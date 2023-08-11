import * as fs from 'fs';  // won't let me do a normal import, god knows why

import DiscordMessage from "../src/DiscordMessage";
import DiscordConversation from "../src/DiscordConversation";


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


class UnitTests {
	DIR = "/home/dude/Sync/dev vault/.obsidian/plugins/obsidian-sample-plugin/tests/"
    
    constructor(){}

    run(){
        this.runMessageTests();
        this.runConversationTests();
    }


    runMessageTests(){
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
            },
            {   
                fileName: "one_with_reaction.html", 
                object: { "context": { "channelId": "840286264964022302", "messageId": "1134896183584763994" }, "content": { "text": "ooh, i have a horrible idea that might work" } },
                markdown: ">ooh, i have a horrible idea that might work"
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
                assertEqual(message.toMarkdown(), markdown, "DiscordMessage.toMarkdown() equality: " + fileName)
            });
        }
    }


    runConversationTests(){
        // Define tests as a Map<filepath, object>
        const TESTOBJECTS: testObject[] = [
            {
                fileName: "multiple_with_header.html", 
                object: { "messages": [ { "header": { "nickname": "Herr", "timeExact": 1690650011630, "timeRelative": "Today at 19:00" }, "context": { "channelId": "840286264964022302", "messageId": "1134893147378425957" }, "content": { "text": "The issue happens when I try to compile the file manually using tsc tests/UnitTests.ts<time aria-label=\"Edited Today at 19:00\" datetime=\"2023-07-29T17:00:17.075Z\"><span class=\"edited-1v5nT8\" style=\"margin: 0px; padding: 0px; border: 0px; font-weight: 400; font-style: inherit; font-family: inherit; font-size: 0.625rem; vertical-align: baseline; outline: 0px; line-height: 1; user-select: none;\">(edited)</span></time>" } }, { "context": { "channelId": "840286264964022302", "messageId": "1134893348440776704" }, "content": { "text": "However, I kinda feel like I have to because npm run dev doesn't seem to compile tests/UnitTests.ts to a tests/UnitTests.js like it does with all other .ts files?<time aria-label=\"Edited Today at 19:01\" datetime=\"2023-07-29T17:01:23.471Z\"><span class=\"edited-1v5nT8\" style=\"margin: 0px; padding: 0px; border: 0px; font-weight: 400; font-style: inherit; font-family: inherit; font-size: 0.625rem; vertical-align: baseline; outline: 0px; line-height: 1; user-select: none;\">(edited)</span></time>" } }, { "context": { "channelId": "840286264964022302", "messageId": "1134893757297344572" }, "content": { "text": "Guess it doesn't matter since it responds to changes to the UnitTests.ts regardless..." } } ] },
                markdown: `>**Herr - 7/29/2023, 7:00:11 PM**\n>The issue happens when I try to compile the file manually using tsc tests/UnitTests.ts<time aria-label="Edited Today at 19:00" datetime="2023-07-29T17:00:17.075Z"><span class="edited-1v5nT8" style="margin: 0px; padding: 0px; border: 0px; font-weight: 400; font-style: inherit; font-family: inherit; font-size: 0.625rem; vertical-align: baseline; outline: 0px; line-height: 1; user-select: none;">(edited)</span></time>\n>However, I kinda feel like I have to because npm run dev doesn't seem to compile tests/UnitTests.ts to a tests/UnitTests.js like it does with all other .ts files?<time aria-label="Edited Today at 19:01" datetime="2023-07-29T17:01:23.471Z"><span class="edited-1v5nT8" style="margin: 0px; padding: 0px; border: 0px; font-weight: 400; font-style: inherit; font-family: inherit; font-size: 0.625rem; vertical-align: baseline; outline: 0px; line-height: 1; user-select: none;">(edited)</span></time>\n>Guess it doesn't matter since it responds to changes to the UnitTests.ts regardless...`
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
                fileName: "one_with_formatting.html",
                object: {},
                markdown: ""
            }
        ]
        
        // assertions
        for (const {fileName, object, markdown} of TESTOBJECTS){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const conversation = DiscordConversation.fromRawHTML(data);

                assertEqual(conversation, object, "DiscordConversation Object equality: " + fileName);
                assertEqual(conversation.toMarkdown(), markdown, "DiscordConversation.toMarkdown() equality: " + fileName)
            });
        }
    }
}

export default new UnitTests();