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


export function parseMessageContent(elements: HTMLCollection): string {
    const message: string[] = []

    // Using Array.from() because eslint does not recognize me using ES2015+ for some reason...
    for(const elem of Array.from(elements)){
        let textContent = elem.textContent;
        if(!textContent){ 
            continue;
        }

        // If there's a newline, start the next line in a new quote
        textContent = textContent.replace("\n", "\n>");

        switch(elem.nodeName){
            case "EM":  // italics
                message.push(`*${textContent}*`); break;

            case "STRONG": // bold
                message.push(`**${textContent}**`); break;

            case "U": // underline
                message.push(`<u>${textContent}</u>`); break;

            case "S":  // strikethrough
                message.push(`~~${textContent}~~`); break;
            
            case "H1":  // Heading 1
                // headings don't have a newline by default, so we add one manually
                message.push(`**${textContent}**\n>`); break;
            
            case "H2":  // Heading 2
                message.push(`**${textContent}**\n>`); break;
            
            case "H3":  // Heading 3
                message.push(`**${textContent}**\n>`); break;

            default:
                // Quote
                if(/^blockquote/.test(elem.className)){
                    message.push(`>${textContent}`); 

                // (edited) mark
                } else if(/^timestamp/.test(elem.className)){
                    message.push(`*${textContent}*`)

                // No special styling
                } else {
                    message.push(textContent);
                }
        }
    }

    return message.join("");
}


export function writeClipboardToFile(event: ClipboardEvent): void {
    console.log("Triggered")
    const doc = event.clipboardData?.getData('text/html');

    if(!doc){
        console.log("No HTML document could be parsed from clipboard");
        return;
    }
    
    // Save document to a file
    for(let i=0; i < 30; i++){
        if(!fs.existsSync(`${i}.html`)){
            fs.writeFile(`${i}.html`, doc, () => {});
            return;
        }
    }
}