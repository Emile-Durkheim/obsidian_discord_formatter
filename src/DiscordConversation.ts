import DiscordMessage from "./DiscordMessage";
import DiscordSingleMessage from "./DiscordSingleMessage";
import { CouldNotParseError, EmptyMessageError } from "./types";


export default class DiscordConversation {
    messages: DiscordMessage[];

    
    constructor(DOM: Document){
        if(!this.isDiscordPaste(DOM)){
            throw new CouldNotParseError("Paste doesn't appear to be from Discord.")
        }

        this.messages = this.createMessages(DOM);
    }
    

    static fromRawHTML(HTML: string){
        const parser = new DOMParser();
        const DOM: Document = parser.parseFromString(HTML, 'text/html');
    
        return new this(DOM);
    }


    private createMessages(DOM: Document): DiscordMessage[] {
        const discordMessages = []

        const domOfMessages: Element[] = Array.from(DOM.querySelectorAll("li"));
        if(domOfMessages.length){
            for (const message of domOfMessages){
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
            discordMessages.push(new DiscordSingleMessage(DOM.body));
        }

        return discordMessages;
    }


    private isDiscordPaste(DOM: Document): boolean {
        const messageElem = DOM.querySelector("div[id^='message-content']");

        // div with such an id must always exist
        if(!messageElem){
            console.error("isDiscordPaste FAIL: No <div id='message-content-\\d{19}'")
            return false;
        }

        // id must always be followed by 19-digit message id
        if(!(/message-content-\d{19}/.test(messageElem.id))){
            console.error("isDiscordPaste FAIL: No <div id='message-content-\\d{19}'")
            return false;
        }

        // className must be akin to "markup-eYLPri messageContent-2t3eCI"
        if(!(/markup-\w{6}/.test(messageElem.className))){
            console.error("isDiscordPaste FAIL: No <div class='markup-\\w{6}'")
            return false;
        }
        if(!(/markup-\w{6}/.test(messageElem.className))){
            console.error("isDiscordPaste FAIL: No <div class='messageContent-\\w{6}'")
            return false;
        }

        return true;
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