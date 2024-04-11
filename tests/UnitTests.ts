import * as fs from 'fs';  // won't let me do a normal import, god knows why

import DiscordMessage from "../rsc/DiscordMessage";


// importing 'assert' gives error: Module "assert" can only be default-imported using the 'allowSyntheticDefaultImports' flags(1259)
// unsusccesfully fucked around enough with config files for now, I'll just code it myself 
function assertEqual(outputObject: object, assertionObject: object, message: string): void {
    if(JSON.stringify(outputObject) != JSON.stringify(assertionObject)){
        console.log("Output Object:", outputObject);
        console.log("Assertion Object: ", assertionObject);
        throw new Error(message);
    }
}


class UnitTests {
	DIR = "/home/dude/Sync/dev vault/.obsidian/plugins/obsidian-sample-plugin/tests/"
    
    constructor(){}

    run(){
        this.messageTests();

        console.log("Unit tests successful");
    }

    messageTests(){
        // Define tests as a Map<filepath, object>
        const htmlObjectPairs = new Map<string, object>([
            ['one_with_header_and_pfp.html', {
                "header": {
                    "username": "Hunter Biden's laptop",
                    "timeExact": 1689992946294,
                    "timeRelative": "Today at 04:29",
                    "avatar": "https://cdn.discordapp.com/avatars/197517944425676802/988fca0e8f445ce54c9dd2600ec7bc35.webp?size=80"
                },
                "context": {
                    "channelId": "557327188311932959",
                    "messageId": "1132137215611379812"
                },
                "content": {
                    "text": "Dangerous disease"
                }
            }],

            ["one_with_header.html", {
                "header": {
                    "username": "Hunter Biden's laptop",
                    "timeExact": 1689997530951,
                    "timeRelative": "Today at 05:45"
                },
                "context": {
                    "channelId": "557327188311932959",
                    "messageId": "1132156445056569395"
                },
                "content": {
                    "text": "true"
                }
            }],

            ["one_with_reaction.html", {
                "context": {
                    "channelId": "840286264964022302",
                    "messageId": "1134896183584763994"
                },
                "content": {
                    "text": "ooh, i have a horrible idea that might work"
                }
            }]
        ])
    
        
        // assertions
        for (const [fileName, assertionObject] of htmlObjectPairs){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const parser = new DOMParser();
                const DOM = parser.parseFromString(data, 'text/html');
            
                const firstLi = DOM.querySelector("li") as HTMLElement;
                const message = new DiscordMessage(firstLi);
                
                assertEqual(message, assertionObject, "DiscordMessage failed equality check: " + fileName);
            });
        }
    }
}

export default new UnitTests();