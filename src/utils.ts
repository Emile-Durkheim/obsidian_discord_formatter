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


// --- Funcs that get reused occasionally ---

export function parseMessageAttachments(messageAccessoryElem: Element): string[] {
    // Element looks like <div id="message-accessories-1143322541809750056"> and contains all images
    if(messageAccessoryElem.nodeName != "DIV" || (!/message-accessories/.test(messageAccessoryElem.id))){
        throw new CouldNotParseError('messageAccessoryElem not <div id="message-accessories...">')
    }    

    const messageAccessoryImages = Array.from(messageAccessoryElem.querySelectorAll("img")) as HTMLImageElement[];
    return messageAccessoryImages.map((img) => {return img.src});
}    
