// IMPORTANT: Adjust DIR in the UnitTests class to the directory that the plugin is contained in.
// Let me know if there's a better way. The fact that the file's working directory is tied to some
// Electron directory from which I can't access the test html files is throwing me off. That's also why
// the assertions themselves are inline inside this file, rather than stored in a .json in the tests folder.


// IMPORTANT 2: Tests are deprecated since settings update


import * as fs from 'fs';

import DiscordMessage from "../src/DiscordMessage";
import DiscordConversation from "../src/DiscordConversation";
import DiscordSingleMessage from 'src/DiscordSingleMessage';
import { IDiscordFormatterSettings } from 'src/settings';


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
        } else {
            console.log(`PASS: ${name}`);
        }
    }
}


type testObject = {fileName: string, object: object, markdown: string};


class Tests {
	DIR = "/home/dude/Sync/dev vault/.obsidian/plugins/discord-message-formatter/tests/"
    
    constructor(){}

    run(settings: IDiscordFormatterSettings){
        console.log("--- TEST START ---");
        this.runMessageTests(settings);
        this.runConversationTests(settings);
        this.runSingleMessageTests(settings);  // referring to DiscordSingleMessage class
    }


    runMessageTests(settings: IDiscordFormatterSettings){
        // Backend: Make sure that filepath.html results in a given object
        const TESTOBJECTS: testObject[] = [
            {   
                fileName: "one_with_header_and_pfp.html", 
                object: {"header": { "nickname": "Hunter Biden's laptop", "timeExact": 1689992946294, "timeRelative": "Today at 04:29", "avatar": "https://cdn.discordapp.com/avatars/197517944425676802/988fca0e8f445ce54c9dd2600ec7bc35.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132137215611379812" }, "content": { "text": "Dangerous disease" }},
                markdown: ">**Hunter Biden's laptop - 7/22/2023, 4:29:06 AM**\n>Dangerous disease"
            },
            {
                fileName: "one_with_header.html", 
                object: { "header": { "nickname": "Hunter Biden's laptop", "timeExact": 1689997530951, "timeRelative": "Today at 05:45" }, "context": { "channelId": "557327188311932959", "messageId": "1132156445056569395" }, "content": { "text": "true" } },
                markdown: ">**Hunter Biden's laptop - 7/22/2023, 5:45:30 AM**\n>true"
            }
        ]
        

        for (const {fileName, object, markdown} of TESTOBJECTS){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const parser = new DOMParser();
                const DOM = parser.parseFromString(data, 'text/html');
            
                const firstLi = DOM.querySelector("li") as HTMLElement;
                const message = new DiscordMessage(firstLi);

                assertEqual(message, object, "DiscordMessage Object equality: " + fileName);
                assertEqual(message.toMarkdown(settings), markdown, "DiscordMessage.toMarkdown() equality: " + fileName)
            });
        }
    }


    runConversationTests(settings: IDiscordFormatterSettings){
        // Define tests as a Map<filepath, object>
        const TESTOBJECTS: testObject[] = [
            {
                fileName: "multiple_with_header.html", 
                object: { "messages": [ { "header": { "nickname": "Herr", "timeExact": 1690650011630, "timeRelative": "Today at 19:00" }, "context": { "channelId": "840286264964022302", "messageId": "1134893147378425957" }, "content": { "text": "The issue happens when I try to compile the file manually using tsc tests/UnitTests.ts *(edited)*" } }, { "context": { "channelId": "840286264964022302", "messageId": "1134893348440776704" }, "content": { "text": "However, I kinda feel like I have to because npm run dev doesn't seem to compile tests/UnitTests.ts to a tests/UnitTests.js like it does with all other .ts files? *(edited)*" } }, { "context": { "channelId": "840286264964022302", "messageId": "1134893757297344572" }, "content": { "text": "Guess it doesn't matter since it responds to changes to the UnitTests.ts regardless..." } } ] },
                markdown: `>**Herr - 7/29/2023, 7:00:11 PM**\n>The issue happens when I try to compile the file manually using tsc tests/UnitTests.ts *(edited)*\n>However, I kinda feel like I have to because npm run dev doesn't seem to compile tests/UnitTests.ts to a tests/UnitTests.js like it does with all other .ts files? *(edited)*\n>Guess it doesn't matter since it responds to changes to the UnitTests.ts regardless...`
            },
            {
                fileName: "multiple_with_pfp.html", 
                object: { "messages": [ { "header": { "nickname": "Gigachad Xi", "timeExact": 1689963536254, "timeRelative": "Yesterday at 20:18", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132013860962975744" }, "content": { "text": "Oppenheimer" } }, { "context": { "channelId": "557327188311932959", "messageId": "1132013881879973978" }, "content": { "text": "Is a solid 7/8" } } ] },
                markdown: ">**Gigachad Xi - 7/21/2023, 8:18:56 PM**\n>Oppenheimer\n>Is a solid 7/8"
            },
            {
                fileName: "multiple_from_several_users.html", 
                object: { "messages": [ { "header": { "nickname": "Gigachad Xi", "timeExact": 1689963536254, "timeRelative": "Yesterday at 20:18", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132013860962975744" }, "content": { "text": "Oppenheimer" } }, { "context": { "channelId": "557327188311932959", "messageId": "1132013881879973978" }, "content": { "text": "Is a solid 7/8" } }, { "header": { "nickname": "Luke", "timeExact": 1689964049113, "timeRelative": "Yesterday at 20:27", "avatar": "https://cdn.discordapp.com/avatars/595791333705121804/7b13474c06f4e459c33364597146b822.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132016012049531012" }, "content": { "text": "mooi tota vittu oisko poistaa jotai akuuttii nippii tai jotai mukkulan hepatiittirotta syyhki temestat vittu laika vaik piuhal taj jotai. philisp mankka kajari akuutti 15min tori säätö tos ni saan siit jotain ni voin sit maksaa, en laita tilil mitää kuumottaa vitusti sossut ja edunvalvonta yms ulosoton takia ni koodaile jotai jos mitää buddhaa tms ois poistaa palaillaa sit mo" } }, { "header": { "nickname": "Gigachad Xi", "timeExact": 1689964153722, "timeRelative": "Yesterday at 20:29", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132016450811461694" }, "content": { "text": "The movie is about physics law and Japan" } } ] },
                markdown: ">**Gigachad Xi - 7/21/2023, 8:18:56 PM**\n>Oppenheimer\n>Is a solid 7/8\n>\n>**Luke - 7/21/2023, 8:27:29 PM**\n>mooi tota vittu oisko poistaa jotai akuuttii nippii tai jotai mukkulan hepatiittirotta syyhki temestat vittu laika vaik piuhal taj jotai. philisp mankka kajari akuutti 15min tori säätö tos ni saan siit jotain ni voin sit maksaa, en laita tilil mitää kuumottaa vitusti sossut ja edunvalvonta yms ulosoton takia ni koodaile jotai jos mitää buddhaa tms ois poistaa palaillaa sit mo\n>\n>**Gigachad Xi - 7/21/2023, 8:29:13 PM**\n>The movie is about physics law and Japan"
            },
            {
                fileName: "multiple_with_reply.html",
                object: {"messages": [{"header": {"nickname": "bird","timeExact": 1691022210439,"timeRelative": "Today at 02:23"},"context": {"channelId": "931852793277476894","messageId": "1136454262331822130"},"content": {"text": "I love germany but has to be like among the least drippiest euro countries out there"}},{"context": {"channelId": "931852793277476894","messageId": "1136454712170921994"},"content": {"text": "And its music so bad"}},{"header": {"nickname": "Matthaeus","timeExact": 1691022398376,"timeRelative": "Today at 02:26","avatar": "https://cdn.discordapp.com/avatars/197517944425676802/988fca0e8f445ce54c9dd2600ec7bc35.webp?size=80","reply": {"header": {"nickname": "@bird"},"context": {"messageId": "1136454712170921994"},"content": {"text": "And its music so bad"}}},"context": {"channelId": "931852793277476894","messageId": "1136455050596732929"},"content": {"text": "Lot of good German techno music though"}}]},
                markdown: ">**bird - 8/3/2023, 2:23:30 AM**\n>I love germany but has to be like among the least drippiest euro countries out there\n>And its music so bad\n>\n>**Matthaeus - 8/3/2023, 2:26:38 AM**\n>>**@bird**: And its music so bad\n>Lot of good German techno music though"
            },
            {
                fileName: "single_with_formatting.html",
                object: {"messages":[{"header":{"nickname":"Herr","timeExact":1691526039341,"timeRelative":"08/08/2023 22:20"},"context":{"channelId":"138567305459142796","messageId":"1138567473910796310"},"content":{"text":"normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING 1**\n>**HEADING 2**\n>**HEADING 3**\n>>quote\n> *(edited)*"}}]},
                markdown: ">**Herr - 8/8/2023, 10:20:39 PM**\n>normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING 1**\n>**HEADING 2**\n>**HEADING 3**\n>>quote\n> *(edited)*"
            },
            {
                fileName: "single_with_unicode_emojis.html",
                object: {"messages":[{"header":{"nickname":"Herr","timeExact":1692649260204,"timeRelative":"Today at 22:21"},"context":{"channelId":"114327860366934837"},"content":{"text":"🍋 🍆 🇩🇪"}}]},
                markdown: `>**Herr - 8/21/2023, 10:21:00 PM**\n>🍋 🍆 🇩🇪`
            },
            {
                fileName: "single_with_custom_emojis.html",
                object: {"messages":[{"header":{"nickname":"Herr","timeExact":1692649260204,"timeRelative":"Today at 22:21"},"context":{"channelId":"114327860366934837"},"content":{"text":"<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=96&quality=lossless' style='height: var(--font-text-size)'>"}}]},
                markdown: `>**Herr - 8/21/2023, 10:21:00 PM**\n><img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=96&quality=lossless' style='height: var(--font-text-size)'>`
            },
            {
                fileName: "several_with_attachments.html",
                object: {"messages":[{"header":{"nickname":"Herr","timeExact":1692655959816,"timeRelative":"Today at 00:12"},"context":{"channelId":"138567305459142796","messageId":"1143306703878766633"},"content":{"text":"hello world *(edited)*"}},{"context":{"channelId":"138567305459142796","messageId":"1143307020049584188"},"content":{"text":"abacaba"}},{"header":{"nickname":"Herr","timeExact":1692657247448,"timeRelative":"Today at 00:34","avatar":"https://cdn.discordapp.com/avatars/132166096286515200/d094d931f04b153aaaeb736c7f9718e9.webp?size=80"},"context":{"channelId":"138567305459142796","messageId":"1143312104598810689"},"content":{"text":"accompanying message text","attachments":["https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?width=273&height=273","https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?width=273&height=273"]}},{"header":{"nickname":"Herr","timeExact":1692659735873,"timeRelative":"Today at 01:15","avatar":"https://cdn.discordapp.com/avatars/132166096286515200/d094d931f04b153aaaeb736c7f9718e9.webp?size=80"},"context":{"channelId":"138567305459142796","messageId":"1143322541809750056"},"content":{"attachments":["https://media.discordapp.net/attachments/1138567305459142796/1143322540970872902/catjam.gif"]}}]},
                markdown: `>**Herr - 8/22/2023, 12:12:39 AM**\n>hello world *(edited)*\n>abacaba\n>\n>**Herr - 8/22/2023, 12:34:07 AM**\n>accompanying message text\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?width=273&height=273)\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?width=273&height=273)\n>\n>**Herr - 8/22/2023, 1:15:35 AM**\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143322540970872902/catjam.gif)`
            }
        ]
        
        // assertions
        for (const {fileName, object, markdown} of TESTOBJECTS){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const conversation = DiscordConversation.fromRawHTML(data, settings);

                assertEqual(conversation, object, "DiscordConversation Object equality: " + fileName);
                assertEqual(conversation.toMarkdown(settings), markdown, "DiscordConversation.toMarkdown() equality: " + fileName)
            });
        }
    }


    runSingleMessageTests(settings: IDiscordFormatterSettings){
        // referring to DiscordSingleMessage class
        const TESTOBJECTS: testObject[] = [
            {
                fileName: "single.html", 
                object: {"header":{"nickname":"Herr","timeExact":1691526039341,"timeRelative":"Today at 22:20"},"context":{"channelId":"113856747391079631"},"content":{"text":"normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING**\n>"}},
                markdown: `>**Herr - 8/8/2023, 10:20:39 PM**\n>normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING**\n>`
            },
            {
                fileName: "single_with_unicode_emojis.html",
                object: {"header":{"nickname":"Herr","timeExact":1692649260204,"timeRelative":"Today at 22:21"},"context":{"channelId":"114327860366934837"},"content":{"text":"🍋 🍆 🇩🇪"}},
                markdown: `>**Herr - 8/21/2023, 10:21:00 PM**\n>🍋 🍆 🇩🇪`
            },
            {
                fileName: "single_with_attachments_and_text.html",
                object: {"header":{"nickname":"Herr","timeExact":1692657247448,"timeRelative":"Today at 00:34"},"context":{"channelId":"114331210459881068"},"content":{"text":"accompanying message text","attachments":["https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?width=273&height=273","https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?width=273&height=273"]}},
                markdown: `>**Herr - 8/22/2023, 12:34:07 AM**\n>accompanying message text\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?width=273&height=273)\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?width=273&height=273)`
            },
            {
                fileName: "single_with_only_attachment.html",
                object: {"header":{"nickname":"Herr","timeExact":1692659735873,"timeRelative":"Today at 01:15"},"context":{"channelId":"114332254180975005"},"content":{"attachments":["https://media.discordapp.net/attachments/1138567305459142796/1143322540970872902/catjam.gif"]}},
                markdown: `>**Herr - 8/22/2023, 1:15:35 AM**\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143322540970872902/catjam.gif)`
            },
        ]

        for (const {fileName, object, markdown} of TESTOBJECTS){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const parser = new DOMParser();
                const DOM = parser.parseFromString(data, 'text/html');
            
                const singleMessage = new DiscordSingleMessage(DOM.body);

                assertEqual(singleMessage, object, "SingleMessage Object equality: " + fileName);
                assertEqual(singleMessage.toMarkdown(settings), markdown, "SingleMessage.toMarkdown() equality: " + fileName)
            });
        }
    }
}

export default new Tests();
