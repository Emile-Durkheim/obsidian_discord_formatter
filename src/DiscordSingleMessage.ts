import DiscordMessage from "./DiscordMessage";
import { CouldNotParseError } from "./types";


export default class DiscordSingleMessage extends DiscordMessage {
    constructor(messageDiv: Element){
        super(messageDiv);   
    }
    
    protected getMessageTextElems(messageDiv: Element): HTMLCollection | undefined {
        // This type of HTML can't contain a reply, so its HTML structure is more basic.
        // The message content is exposed right away in a direct child of the message div,
        // so we need to change the querySelector
        // If the messageLi contains 
        return messageDiv.querySelector("div[id^='message-content']")?.children;
    }

    protected constructMessageContext(messageDiv: Element): void {
        // This type of messages doesn't contain a message ID
        const messageContentElem = messageDiv.querySelector("div[id^='message-content']");
        const messageAccessoryElem = messageDiv.querySelector("div[id^='message-accessories']");

        if(!messageContentElem && !messageAccessoryElem){
            throw new CouldNotParseError("No div#message-content nor div#message-accessories could be found.")
        }

        const channelIdRegex = /\d{18}/;
        let regexResult = undefined;
        if(messageContentElem){
            regexResult = channelIdRegex.exec(messageContentElem.id);
        } else if(messageAccessoryElem){
            regexResult = channelIdRegex.exec(messageAccessoryElem.id);
        }

        if(!(regexResult && regexResult.length == 1)){
            throw new CouldNotParseError("Could not parse channel id from message-content div");
        }

        this.context = {
            channelId: regexResult[0]
        }
    }
}