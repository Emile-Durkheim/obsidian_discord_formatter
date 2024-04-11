import * as fs from 'fs';

export class EmptyMessageError extends Error {
    // Thrown when an <li> is empty of message content; empty <li>'s are common when 
    // copy-pasting discord messages. Meant to be caught by DiscordConversation.

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, EmptyMessageError.prototype);
    }
}

export class CouldNotParseError extends Error {
    // Thrown in DiscordMessage or DiscordConversation when unexpected HTML is encountenred
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CouldNotParseError.prototype);
    }
}

export function writeClipboardToFile(event: ClipboardEvent): void {
    const doc = event.clipboardData?.getData('text/html');

    if(!doc){
        console.log("No HTML document could be parsed from clipboard");
        return;
    }
    
    // Save document to a file
    for(let i=0; i < 30; i++){
        if(!fs.existsSync(`~/Documents/${i}.html`)){
            fs.writeFile(`~/Documents/${i}.html`, doc, () => {});
            return;
        }
    }
}