import { TextRun } from "./AbstractDiscordMessage";
import { IMessageFormats } from "./formats";


// --- Custom Exceptions ---

/** Thrown when unexpected HTML is encountered that can't be parsed. */
export class CouldNotParseError extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CouldNotParseError.prototype);
    }
}


/** Thrown when an <li> is empty of message content; empty <li>'s are common when copy-pasting discord messages. 
 * Meant to be caught by DiscordConversation. */
export class EmptyMessageError extends Error {
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, EmptyMessageError.prototype);
    }
}


// --- Functions called upon elsewhere ---
/** Runs through a <div id="message-content-...">'s children and turns them into TextRuns.
 * 
 *  The children will be <strong>, <u>, <h1>... tags to denote their formatting; this allows us
 *  to push them 
 */
export function parseMessageText(messageContentElems: HTMLCollection): TextRun[] {
    const textRuns: TextRun[] = []

    for(const elem of Array.from(messageContentElems)){
        
        // Check if emojis/custom emojis; parse them
        if(/^emojiContainer/.test(elem.className)){
            const imgElem = elem.children[0] as HTMLImageElement;
            if(!imgElem){
                throw new CouldNotParseError("parseMessageText: No img element found in span.emojiContainer");
            }    
            
            if(/^:.+:$/.test(imgElem.alt)){  // If it's a custom emoji, then alt text is ':emojiName:'
                textRuns.push({type: "customEmoji", content: imgElem.src});
            } else {  // If it's a unicode emoji, then alt text is the unicode emoji
                textRuns.push({type: "emoji", content: imgElem.alt});
            }    
            
            continue;
        }    
        
        
        // Check if message has text; parse it along with its format
        let textContent = elem.textContent;
        if(!textContent){
            throw new CouldNotParseError("parseMessageText: Message run contains neither text content nor emoji")
        }

        // If there's a newline in the message, start the next line in a new quote
        textContent = textContent.replace("\n", "\n>");


        // Check the the type of a node to determine what kind of formatting the text has.
        switch(elem.nodeName){
            case "EM": { // italics
                textRuns.push({type: "italics", content: textContent}); break;
            }    

            case "STRONG": { // bold
                textRuns.push({type: "bold", content: textContent}); break;
            }    

            case "U": { // underline
                textRuns.push({type: "underline", content: textContent}); break;
            }    

            case "S": {  // strikethrough
                textRuns.push({type: "strikethrough", content: textContent}); break;
            }    
            
            case "H1": {  // Heading 1
                textRuns.push({type: "h1", content: textContent}); break;
            }    
            
            case "H2": {  // Heading 2
                textRuns.push({type: "h2", content: textContent}); break;
            }    
            
            case "H3": {  // Heading 3
                textRuns.push({type: "h3", content: textContent}); break;
            }    

            case "TIME": {  // (edited) mark
                textRuns.push({type: "edited", content: (elem as HTMLTimeElement).dateTime}); break;
            }    

            default: {
                // Quote; uses a generic <span> tag and is instead identified by its class name.
                // Appears as class="blockquote-2AkdDH" the last six alphanums being random, 
                // hence why we do a regex on the full class name.
                if(/blockquote/.test(elem.className)){
                    textRuns.push({type: "quote", content: textContent}); 
                    
                // No special styling    
                } else {
                    textRuns.push({type: "default", content: textContent});
                }    
            }    
        }    
    }    

    return textRuns;
}    


export function parseMessageAttachments(messageAccessoryElem: Element): string[] {
    // Element looks like <div id="message-accessories-1143322541809750056"> and contains all images
    if(messageAccessoryElem.nodeName != "DIV" || (!/message-accessories/.test(messageAccessoryElem.id))){
        throw new CouldNotParseError('messageAccessoryElem not <div id="message-accessories...">')
    }    

    const messageAccessoryImages = Array.from(messageAccessoryElem.querySelectorAll("img")) as HTMLImageElement[];
    return messageAccessoryImages.map((img) => {return img.src});
}    


export function textRunsToMarkdown(textRuns: TextRun[], formats: IMessageFormats): string {
    const markdownArray: string[] = [];

    for(const run of textRuns){
        const markdown = formats[run.type](run.content);
        markdownArray.push(markdown);
    }

    return markdownArray.join("")
}