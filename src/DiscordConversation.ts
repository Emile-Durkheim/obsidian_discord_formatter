import DiscordMessage from "./DiscordMessage";
import DiscordSingleMessage from "./DiscordSingleMessage";
import { IMessageFormats } from "./formats";
import { CouldNotParseError, EmptyMessageError } from "./types";


export default class DiscordConversation {
    messages: DiscordMessage[];

    
    constructor(DOM: Document, formats: IMessageFormats){
        if(!this.isDiscordPaste(DOM)){
            throw new CouldNotParseError("Paste doesn't appear to be from Discord")
        }

        this.messages = this.createMessages(DOM, formats);
    }
    

    static fromRawHTML(HTML: string, formats: IMessageFormats){
        const parser = new DOMParser();
        const DOM: Document = parser.parseFromString(HTML, 'text/html');
    
        return new this(DOM, formats);
    }


    private createMessages(DOM: Document, formats: IMessageFormats): DiscordMessage[] {
        // Factory for Discord messages, as the HTML we get comes in different formats; 
        // 1.) A format with some <ol class="scrollInner"><li>message...</li><li>message,,,</li></ol>
        // 2.) A format, when there's just one message, with <h3>username, time, avatar...</h3><div>message</div>
        // Format #1 can be constructed by the DiscordMessage class, format #2 by the DiscordSingleMessage class
        //
        // Don't kill me for this, I only noticed that the second one exists when I was already
        // 80% done with this plugin. And that's the band-aid solution I chose to go with.
        // If you've got suggestions for how to make this suck less, please do let me know. 

        const discordMessages = []

        const domOfMessages: Element[] = Array.from(DOM.querySelectorAll("li"));
        if(domOfMessages.length > 0){
            for (const message of domOfMessages){
                try {
                    discordMessages.push(new DiscordMessage(message, formats));
                } catch(err) {
                    if(!(err instanceof EmptyMessageError)){
                        throw err;
                    } else { 
                        continue; // Empty li's are expected
                    }  
                }
            }
        } else {
            discordMessages.push(new DiscordSingleMessage(DOM.body, formats));
        }

        return discordMessages;
    }


    private isDiscordPaste(DOM: Document): boolean {
        // Check if it's a text message
        const messageContentElem = DOM.querySelector("div[id^='message-content']");
        if(messageContentElem){
            // div id must always be followed by 19-digit message id
            if(!(/message-content-\d{19}/.test(messageContentElem.id))){
                console.error("isDiscordPaste FAIL: No <div id='message-content-\\d{19}'")
                return false;
            }
    
            // className must be akin to "markup-eYLPri messageContent-2t3eCI"
            if(!(/markup-[\w\d]{6}/.test(messageContentElem.className))){
                console.error("isDiscordPaste FAIL: No <div class='markup-\\w{6}'")
                return false;
            }
            if(!(/messageContent-[\w\d]{6}/.test(messageContentElem.className))){
                console.error("isDiscordPaste FAIL: No <div class='messageContent-\\w{6}'")
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



    public toMarkdown(): string {
        const markdownArray: string[] = [];

        for(const message of this.messages){
            // Insert blank line between different users
            if(message.header && markdownArray.length > 0){
                markdownArray.push(">");
            }

            markdownArray.push(message.toMarkdown());
        }

        return markdownArray.join("\n");
    }
}