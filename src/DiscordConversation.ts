import DiscordMessage from "./DiscordMessage";
import DiscordSingleMessage from "./DiscordSingleMessage";
import { IDiscordFormatterSettings } from "./settings";
import { EmptyMessageError } from "./utils";
import { CouldNotParseError } from "./utils";


export default class DiscordConversation {
    messages: DiscordMessage[];

    
    constructor(DOM: Document, settings: IDiscordFormatterSettings){
        if(!this.isDiscordPaste(DOM)){
            throw new CouldNotParseError("Paste doesn't appear to be from Discord")
        }

        this.messages = this.createMessages(DOM, settings);
    }
    

    static fromRawHTML(HTML: string, settings: IDiscordFormatterSettings){
        const parser = new DOMParser();
        const DOM: Document = parser.parseFromString(HTML, 'text/html');
    
        return new this(DOM, settings);
    }


    private createMessages(DOM: Document, settings: IDiscordFormatterSettings): DiscordMessage[] {
        // Factory for Discord messages, as the HTML we get comes in different formats; 
        // 1.) A format with some <ol class="scrollInner"><li>message...</li><li>message,,,</li></ol>
        // 2.) A format, when there's just one message, with <h3>username, time, avatar...</h3><div>message</div>
        // Format #1 can be constructed by the DiscordMessage class, format #2 by the DiscordSingleMessage class

        const discordMessages = []

        const messageElems: Element[] = Array.from(DOM.querySelectorAll("li[id^='chat-messages']"));
        if(messageElems.length != 0) {

            for (const message of messageElems){
                try {
                    discordMessages.push(new DiscordMessage(message));
                } catch(err) {
                    if(!(err instanceof EmptyMessageError)){
                        throw err;
                    } else { 
                        continue; // Empty li's are expected
                    }  
                }
            } 

        } else {
            // Single messages aren't in an <li> (see above), so we just try to
            // construct a message from the pasted dom. If it turns out the paste isn't
            // a Discord Message at all (i.e. there's no child divs that are discord text content
            // or pictures) the DiscordSingleMessage constructor will throw an error.
            discordMessages.push(new DiscordSingleMessage(DOM.body));
        }

        return discordMessages;
    }


    private isDiscordPaste(DOM: Document): boolean {
        // Check if it's a text message
        const messageContentElem = DOM.querySelector("div[id^='message-content']");
        if(messageContentElem){
            // div id will be akin to "message-content-3827338291039483728"; the number represents the 19-digit message id
            if(!(/message-content.\d{19}/.test(messageContentElem.id))){
                console.error("isDiscordPaste FAIL: No <div id='message-content-\\d{19}'")
                return false;
            }
    
            // className will be akin to "markup_eYLPri messageContent__2t3eCI"
            if(!(messageContentElem.className.contains("markup"))){
                console.error("isDiscordPaste FAIL: No <div class='markup...")
                return false;
            }
            if(!(messageContentElem.className.contains("messageContent"))){
                console.error("isDiscordPaste FAIL: No <div class='messageContent...'")
                return false;
            }
    
            return true;
        }

        // If not a text message, check if it's a media message 
        const messageAccesoriesElem = DOM.querySelector("div[id^='message-accessories']");
        if(messageAccesoriesElem){
            // div id must always be followed by 19-digit message id
            if(!(/message-accessories-\d{19}/.test(messageAccesoriesElem.id))){
                console.error("isDiscordPaste FAIL: No <div id='message-accessories-\\d{19}'")
                return false;
            }
            
            // className must always be akin to "container-2EofcI"
            if(!(/container-[\w\d]{6}/.test(messageAccesoriesElem.className))){
                console.error("isDiscordPaste FAIL: No <div class='container-\\w{6}'")
                return false;
            }

            return true;
        }

        return false;
    }



    public toMarkdown(settings: IDiscordFormatterSettings): string {
        const markdownArray: string[] = [];

        for(const message of this.messages){
            // Insert blank line between different users
            if(message.header && markdownArray.length > 0){
                markdownArray.push(">");
            }

            markdownArray.push(message.toMarkdown(settings));
        }

        return markdownArray.join("\n");
    }
}