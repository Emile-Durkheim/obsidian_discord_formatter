import { DateTime } from "luxon";
import { IDiscordFormatterSettings } from "./settings";


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


/** Gets image URLs off a given <div id="message-accesories-..."> (which contains all images)*/
export function parseMessageAttachments(messageAccessoryElem: Element): string[] {
    if(messageAccessoryElem.nodeName != "DIV" || (!/message-accessories/.test(messageAccessoryElem.id))){
        throw new CouldNotParseError('messageAccessoryElem not <div id="message-accessories...">')
    }    

    const messageAccessoryImages = Array.from(messageAccessoryElem.querySelectorAll("img")) as HTMLImageElement[];
    return messageAccessoryImages.map((img) => {return img.src});
}    


export function formatMessageDate(date: DateTime, settings: IDiscordFormatterSettings){
    // If no date format is specified, don't display anything.
    // Effectively allows to disable the showing of datetime
    if(settings.dateFormat.length == 0){
        return '';
    }

    // ' - ' is some nice fluff formatting for making the datetime appear visually
    // different from the username
    return ` - ${date.toFormat(settings.dateFormat)}`;
}