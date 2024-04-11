import * as fs from 'fs';

import { SETTINGS } from 'main';


export function writeDocumentToFile(doc: Document): void {
    // Save document to a file

    const serializer = new XMLSerializer();
    const str = serializer.serializeToString(doc);

    for(let i=0; i < 30; i++){
        if(!fs.existsSync(`${i}.html`)){
            fs.writeFile(`${i}.html`, str, () => {});
            return;
        }
    }
}


export function log(...params: any[]): void{
	if(SETTINGS.debug){
        console.log(...params);
	}
}