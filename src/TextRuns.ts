import { DateTime } from "luxon";
import { IDiscordFormatterSettings } from "./settings";


export abstract class TextRun{
    constructor(public content: string){}
    
    public abstract toMarkdown(
        // Some Textruns need to emit different markdown when they're shown as part of a reply is
        settings: IDiscordFormatterSettings, isReply?: boolean
    ): string;
}


export class TextRunDefault extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `${this.content}`;
    }
}

export class TextRunItalics extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `*${this.content}*`;
    }
}

export class TextRunBold extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `**${this.content}**`;
    }
}

export class TextRunUnderline extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `<u>${this.content}</u>`;
    }
}

export class TextRunStrikethrough extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `~~${this.content}~~`;
    }
}

export class TextRunQuote extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        // ReplaceAll ensures that quote continuing on next line stays within quoted display;
        // i.e. that quote like this
        // >first line\nsecond line\n
        // is displayed as
        // >first line\n>second line\n>
        //
        // slice ensures that next line following the quote is *not* double-indented, i.e. that
        // it looks like:
        // >first line\n>second line\n

        return `>${this.content.replaceAll('\n', '\n>').slice(0, -1)}`;
    }
}

export class TextRunHeading extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings, isReply: boolean): string {
        // Since headings don't come with a \n as part of their text content,
        // we add one ourselves; but since replies have no newlines at all, we
        // need to *not* do this when it's emitted as part of a reply
        const markdown = `**${this.content}**`;

        if(isReply){
            return `${markdown} `;
        } else {
            return `${markdown}\n`;
        }
    }
}

export class TextRunEmoji extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `${this.content}`;
    }
}

export class TextRunEdited extends TextRun{
    constructor(public content: string, readonly timestamp: DateTime | null){
        super(content);
    }

    public toMarkdown(settings: IDiscordFormatterSettings): string {
        if(settings.showEdited === "off"){
            return ``;
        } else if(settings.showEdited === "text" || this.timestamp === null){
            return ` *(edited)*`;
        } else if(settings.showEdited === "tag"){
            const timeString = this.timestamp.toFormat(settings.dateFormat);
            return ` <i aria-label="Edited at ${timeString}">(edited)</i>`
        } else {
            throw new Error(`Expected 'off', 'text' or 'tag' in settings.showEdited, got: ${settings.showEdited}`);
        }
    }
}

export class TextRunCustomEmoji extends TextRun{
    constructor(readonly linkToEmoji: string){
        super('#');  // '#' so when content.length is queried, textrun length is considered to be 1 (important when shortening replies)
    }

    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `<img src='${this.linkToEmoji}' style='height: var(--font-text-size)'>`;
    }
}
