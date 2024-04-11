import { IDiscordFormatterSettings } from "./settings";
import { CouldNotParseError, EmptyMessageError } from "./utils";


/** Runs through a <div id="message-content-...">'s children and turns them into TextRuns.
 *
 *  The children will be <strong>, <u>, <h1>... tags to denote their formatting; this allows us
 *  to push them
 */
export function textRunFactory(elem: Element): TextRun {
    // Check if emojis/custom emojis; parse them
    if(elem.className.contains("emojiContainer")){
        const imgElem = elem.children[0] as HTMLImageElement;
        if(!imgElem){
            throw new CouldNotParseError("parseMessageText: No img element found in span.emojiContainer");
        }    
        
        if(/^:.+:$/.test(imgElem.alt)){  // If it's a custom emoji, then alt text is ':emojiName:'
            return new TextRunCustomEmoji(imgElem.src);
        } else {  // If it's a unicode emoji, then the alt text contains the unicode emoji
            return new TextRunEmoji(imgElem.alt);
        }    
    }    
    
    
    // Check if message has text; parse it along with its format
    const textContent = elem.textContent;
    if(!textContent){
        // May happen when system message is displayed
        throw new EmptyMessageError("parseMessageText: Message run contains neither text content nor emoji")
    }

    // Check the the type of a node to determine what kind of formatting the text has.
    switch(elem.nodeName){
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
            // hence why we do a regex on the full class name.
            if(elem.className.contains("blockquote")){
                return new TextRunQuote(textContent);

            // Same as above, class="timestamp-p1Df1m"; content becomes datetime string of time tag in children
            } else if(elem.className.contains("timestamp") && elem?.firstChild?.nodeName == "TIME"){
                return new TextRunEdited(textContent);
                
            // No special styling    
            } else {
                return new TextRunDefault(textContent);
            }    
        }
    }
} 



export abstract class TextRun{
    constructor(protected content: string){}
    
    public abstract toMarkdown(
        settings: IDiscordFormatterSettings, 
        // Some Textruns need to emit different markdown when they're shown as part of a reply
        isReply?: boolean
    ): string;
}


class TextRunDefault extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `${this.content}`;
    }
}

class TextRunItalics extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `*${this.content}*`;
    }
}

class TextRunBold extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `**${this.content}**`;
    }
}

class TextRunUnderline extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `<u>${this.content}</u>`;
    }
}

class TextRunStrikethrough extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `~~${this.content}~~`;
    }
}

class TextRunQuote extends TextRun{
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

class TextRunHeading extends TextRun{
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

class TextRunEmoji extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `${this.content}`;
    }
}

class TextRunEdited extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return ` *(edited)*`;
    }
}

class TextRunCustomEmoji extends TextRun{
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        return `*<img src='${this.content}' style='height: var(--font-text-size)'>*`;
    }
}


