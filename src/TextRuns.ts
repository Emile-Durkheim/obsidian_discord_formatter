import { DateTime } from "luxon";
import { IDiscordFormatterSettings } from "./settings";
import { CouldNotParseError, EmptyMessageError } from "./utils";


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
        /* ReplaceAll ensures that quote continuing on next line stays within quoted display; i.e. that quotes like this
        >first line\nsecond line\n
        is displayed as
        >first line\n>second line\n> */
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


/** Runs through a <div id="message-content-...">'s children and turns them into TextRuns.
 * The children will be <strong>, <u>, <h1>... tags to denote their formatting; this allows us to push them.  */
export function textRunFactory(elem: Element): TextRun {
    // Check if emojis/custom emojis; parse them
    if (/emojiContainer/.test(elem.className)) {
        const imgElem = elem.children[0] as HTMLImageElement;
        if (!imgElem) {
            throw new CouldNotParseError("parseMessageText: No img element found in span.emojiContainer");
        }

        if (/^:.+:$/.test(imgElem.alt)) { // If it's a custom emoji, then alt text is ':emojiName:'
            return new TextRunCustomEmoji(imgElem.src);
        } else { // If it's a unicode emoji, then the alt text contains the unicode emoji
            return new TextRunEmoji(imgElem.alt);
        }
    }


    // Check if message has text; parse it along with its format
    const textContent = elem.textContent;
    if (!textContent) {
        // May happen when system message is displayed
        throw new EmptyMessageError("textRunFactory: Message run contains neither text content nor emoji; probably a system message?");
    }

    // Check the the type of a node to determine what kind of formatting the text has.
    switch (elem.nodeName) {
        case "EM": {
            return new TextRunItalics(textContent); break;
        }

        case "STRONG": {
            return new TextRunBold(textContent); break;
        }

        case "U": {
            return new TextRunUnderline(textContent); break;
        }

        case "S": {
            return new TextRunStrikethrough(textContent); break;
        }

        case "H1":
        case "H2":
        case "H3": {
            return new TextRunHeading(textContent); break;
        }

        default: {
            // Quote; uses a generic <span> tag and is instead identified by its class name.
            // Appears as class="blockquote-2AkdDH" the last six alphanums being random, 
            if (/blockquote/.test(elem.className)) {
                return new TextRunQuote(textContent);

                // Same as above, class="timestamp-p1Df1m"; content becomes datetime string of time tag in children
            } else if (/timestamp/.test(elem.className) && elem?.firstElementChild?.nodeName == "TIME") {
                const timestamp = DateTime.fromISO(elem?.firstElementChild?.getAttribute('datetime') as string);

                if (timestamp) {
                    return new TextRunEdited(textContent, timestamp);
                } else {
                    console.error("Couldn't get timestamp off <time> element on (edited) mark: ", elem);
                    return new TextRunEdited(textContent, null);
                }

                // No special styling    
            } else {
                return new TextRunDefault(textContent);
            }
        }
    }
}

