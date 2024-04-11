// IMPORTANT: Adjust DIR in the UnitTests class to the directory that the plugin is contained in.
// Let me know if there's a better way. The fact that the file's working directory is tied to some
// Electron directory from which I can't access the test html files is throwing me off. That's also why
// the assertions themselves are inline inside this file, rather than stored in a .json in the tests folder.
const DIR = "your/dir/here/"


import * as fs from 'fs';

import Conversation from "../src/Conversation";
import { DEFAULT_SETTINGS, IDiscordFormatterSettings } from 'src/settings';


// importing 'assert' gives error: Module "assert" can only be default-imported using the 'allowSyntheticDefaultImports' flags(1259)
// unsusccesfully fucked around enough with config files for now, I'll just code it myself 
function assertEqual(outputValue: object | string, assertionValue: object | string, name: string): void {
    // Compare objects
    if(outputValue instanceof Object && assertionValue instanceof Object){
        if(JSON.stringify(outputValue) != JSON.stringify(assertionValue)){
            console.error(`FAIL: ${name}\nOutput Object: `, outputValue, 
                          `\nAssertion Object: `, assertionValue);
        } else {
            console.log(`PASS: ${name}`);
        }
    
    // Compare strings
    } else if(typeof outputValue == "string" && typeof assertionValue == "string"){
        if(outputValue != assertionValue){
            console.error(`FAIL: ${name}\nOutput string: `, outputValue, 
                          `\nAssertion string: `, assertionValue);
            fs.writeFile("fuckme.txt", outputValue, () => {});
        } else {
            console.log(`PASS: ${name}`);
        }
    }
}


type testMarkdown = {fileName: string, markdown: string};


class Tests {
    constructor(){}

    run(settings: IDiscordFormatterSettings){
        console.log("--- TEST START ---");
        this.runConversationTests();
    }


    runConversationTests(){
        const settings: IDiscordFormatterSettings = DEFAULT_SETTINGS;

        // Define tests as a Map<filepath, object>
        const TESTOBJECTS: testMarkdown[] = [
            {
                fileName: "single_message_with_all_formatting.html", 
                markdown: `>**Herr - 08/08/2023, 22:20**\n>normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING 1**\n>**HEADING 2**\n>**HEADING 3**\n>>quote\n>>with multiple lines\n>🍋 *<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>*\n>\n>gap *(edited)*`
            },
            {
                fileName: "single_message_with_attachments.html",
                markdown: `>**Herr - 08/22/2023, 00:34**\n>accompanying message text\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?ex=6536f4df&is=65247fdf&hm=084d2f551c30b88ae98b6f04e5ada374928958574c9c068dbd667f5fd0f93069&=&width=273&height=273)\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?ex=6536f4df&is=65247fdf&hm=1a6b752c4a90d838cc96040c950df09403d44a7d51270f7f002ebacdfd852bc1&=&width=273&height=273)`
            },
            {
                fileName: "two_messages_with_reply.html",
                markdown: `>**Herr - 10/13/2023, 18:36**\n>message above reply *(edited)*\n>\n>**Herr - 10/13/2023, 18:37**\n>>**Herr:** normal\xa0*italics*\xa0**bold**\xa0<u>underline</u>\xa0~~strikethrough~~\xa0**HEADING 1** **HEADING 2** **HEADING 3** > quote\xa0> with multiple lines\xa0🍋\xa0*<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>*\xa0gap\xa0 *(edited)*\n>reply to message with all formatting`
            }
        ]
        
        // assertions
        for (const {fileName, markdown} of TESTOBJECTS){
            fs.readFile(DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const conversation = Conversation.fromRawHTML(data, settings);

                assertEqual(conversation.toMarkdown(settings), markdown, "DiscordConversation.toMarkdown() equality: " + fileName)
            });
        }
    }
}

export default new Tests();
