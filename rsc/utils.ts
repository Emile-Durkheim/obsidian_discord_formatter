import * as fs from 'fs';

import DiscordFormatter from 'main';


export class CouldNotParseError extends Error {
    // Thrown in DiscordMessage or DiscordConversation when unexpected HTML is encountenred
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CouldNotParseError.prototype);
    }
}

export function writeDocumentToFile(doc: Document): void {
    // Save document to a file

    const serializer = new XMLSerializer();
    const str = serializer.serializeToString(doc);

    for(let i=0; i < 30; i++){
        if(!fs.existsSync(`~/Documents/${i}.html`)){
            fs.writeFile(`~/Documents/${i}.html`, str, () => {});
            return;
        }
    }
}

export function writeStringToFile(str: string | undefined){
    if(typeof str == "undefined"){
        log("string undefined")
        return;
    }

    for(let i=0; i < 30; i++){
        if(!fs.existsSync(`${i}.html`)){
            fs.writeFile(`${i}.html`, str, () => {});
            return;
        }
    }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(...params: any[]): void{
	if(DiscordFormatter.settings.debug){
        console.log(...params);
	}
}