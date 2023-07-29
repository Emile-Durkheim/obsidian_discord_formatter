import * as fs from 'fs';

import { SETTINGS } from 'main';


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
	if(SETTINGS.debug){
        console.log(...params);
	}
}