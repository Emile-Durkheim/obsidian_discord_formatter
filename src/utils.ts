import { DateTime } from "luxon";
import { TextRun, TextRunCustomEmoji, TextRunEmoji, TextRunItalics, TextRunBold, TextRunUnderline, TextRunStrikethrough, TextRunHeading, TextRunQuote, TextRunEdited, TextRunDefault } from "./TextRuns";


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


export function parseMessageAttachments(messageAccessoryElem: Element): string[] {
    // Element looks like <div id="message-accessories-1143322541809750056"> and contains all images
    if(messageAccessoryElem.nodeName != "DIV" || (!/message-accessories/.test(messageAccessoryElem.id))){
        throw new CouldNotParseError('messageAccessoryElem not <div id="message-accessories...">')
    }    

    const messageAccessoryImages = Array.from(messageAccessoryElem.querySelectorAll("img")) as HTMLImageElement[];
    return messageAccessoryImages.map((img) => {return img.src});
}    


/** Runs through a <div id="message-content-...">'s children and turns them into TextRuns.
 *
 *  The children will be <strong>, <u>, <h1>... tags to denote their formatting; this allows us
 *  to push them
 */
export function textRunFactory(elem: Element): TextRun {
    // Check if emojis/custom emojis; parse them
    if (elem.className.contains("emojiContainer")) {
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
            if (elem.className.contains("blockquote")) {
                return new TextRunQuote(textContent);

                // Same as above, class="timestamp-p1Df1m"; content becomes datetime string of time tag in children
            } else if (elem.className.contains("timestamp") && elem?.firstElementChild?.nodeName == "TIME") {
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
