import * as fs from 'fs';  // won't let me do a normal import, god knows why

import DiscordMessage from "../rsc/DiscordMessage";
import DiscordConversation from "../rsc/DiscordConversation";


// importing 'assert' gives error: Module "assert" can only be default-imported using the 'allowSyntheticDefaultImports' flags(1259)
// unsusccesfully fucked around enough with config files for now, I'll just code it myself 
function assertEqual(outputObject: object, assertionObject: object, name: string): void {
    if(JSON.stringify(outputObject) != JSON.stringify(assertionObject)){
        console.error(`FAIL: ${name}\nOutput Object: `, outputObject, 
                      `\nAssertion Object: `, assertionObject);
    } else {
        console.log(`PASS: ${name}`);
    }
}


class UnitTests {
	DIR = "/home/dude/Sync/dev vault/.obsidian/plugins/obsidian-sample-plugin/tests/"
    
    constructor(){}

    run(){
        this.runMessageTests();
        this.runConversationTests();
    }


    runMessageTests(){
        // Define tests as a Map<filepath, object>
        const htmlObjectPairs = new Map<string, object>([
            ["one_with_header_and_pfp.html", {"header": { "nickname": "Hunter Biden's laptop", "timeExact": 1689992946294, "timeRelative": "Today at 04:29", "avatar": "https://cdn.discordapp.com/avatars/197517944425676802/988fca0e8f445ce54c9dd2600ec7bc35.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132137215611379812" }, "content": { "text": "Dangerous disease" } }],
            ["one_with_header.html", { "header": { "nickname": "Hunter Biden's laptop", "timeExact": 1689997530951, "timeRelative": "Today at 05:45" }, "context": { "channelId": "557327188311932959", "messageId": "1132156445056569395" }, "content": { "text": "true" } }],
            ["one_with_reaction.html", { "context": { "channelId": "840286264964022302", "messageId": "1134896183584763994" }, "content": { "text": "ooh, i have a horrible idea that might work" } }] 
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
                
                assertEqual(message, assertionObject, "DiscordMessage equality check: " + fileName);
            });
        }
    }


    runConversationTests(){
        // Define tests as a Map<filepath, object>
        const htmlObjectPairs = new Map<string, object>([
            ["multiple_with_header.html", {1:2}],
            ["multiple_with_pfp.html", { "messages": [ { "header": { "nickname": "Gigachad Xi", "timeExact": 1689963536254, "timeRelative": "Yesterday at 20:18", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132013860962975744" }, "content": { "text": "Oppenheimer" } }, { "context": { "channelId": "557327188311932959", "messageId": "1132013881879973978" }, "content": { "text": "Is a solid 7/8" } } ] }],
            ["multiple_from_several_users.html", { "messages": [ { "header": { "nickname": "Gigachad Xi", "timeExact": 1689963536254, "timeRelative": "Yesterday at 20:18", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132013860962975744" }, "content": { "text": "Oppenheimer" } }, { "context": { "channelId": "557327188311932959", "messageId": "1132013881879973978" }, "content": { "text": "Is a solid 7/8" } }, { "header": { "nickname": "Luke", "timeExact": 1689964049113, "timeRelative": "Yesterday at 20:27", "avatar": "https://cdn.discordapp.com/avatars/595791333705121804/7b13474c06f4e459c33364597146b822.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132016012049531012" }, "content": { "text": "mooi tota vittu oisko poistaa jotai akuuttii nippii tai jotai mukkulan hepatiittirotta syyhki temestat vittu laika vaik piuhal taj jotai. philisp mankka kajari akuutti 15min tori säätö tos ni saan siit jotain ni voin sit maksaa, en laita tilil mitää kuumottaa vitusti sossut ja edunvalvonta yms ulosoton takia ni koodaile jotai jos mitää buddhaa tms ois poistaa palaillaa sit mo" } }, { "header": { "nickname": "Gigachad Xi", "timeExact": 1689964153722, "timeRelative": "Yesterday at 20:29", "avatar": "https://cdn.discordapp.com/avatars/165944997215076353/432fa5303fb36b8fd126c7178cf70d4c.webp?size=80" }, "context": { "channelId": "557327188311932959", "messageId": "1132016450811461694" }, "content": { "text": "The movie is about physics law and Japan" } } ] }] 
        ])
        
        // assertions
        for (const [fileName, assertionObject] of htmlObjectPairs){
            fs.readFile(this.DIR + fileName, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                
                const conversation = DiscordConversation.fromRawHTML(data);

                assertEqual(conversation, assertionObject, "DiscordConversation equality check: " + fileName);
            });
        }
    }
}

export default new UnitTests();