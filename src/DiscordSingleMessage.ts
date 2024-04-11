import DiscordMessage from "./DiscordMessage";
import { CouldNotParseError, EmptyMessageError } from "./types";


export default class DiscordSingleMessage extends DiscordMessage {
    constructor(messageDiv: Element){
        super(messageDiv);   
    }
    
    protected constructMessageContent(messageDiv: Element){
        // This type of HTML can't contain a reply, so its HTML structure is more basic.
        // The message content is exposed right away in a direct child of the message div,
        // so we need to change the querySelector
        const messageContentElems = messageDiv.querySelector("div[id^='message-content']")?.children;

        if(!messageContentElems){
            console.error(messageDiv);
            throw new EmptyMessageError(`Message contains no text content`);
        }

        this.content = {
            text: DiscordMessage.parseMessageContent(messageContentElems)
        };
    }

    protected constructMessageContext(messageDiv: Element): void {
        // This type of HTML doesn't contain 
        const messageContentElem = messageDiv.querySelector("div[id^='message-content']");

        if(!messageContentElem){
            throw new CouldNotParseError("No div[id='message-content...' could be found.")
        }

        const channelIdRegex = /\d{18}/.exec(messageContentElem.id);
        if(!(channelIdRegex && channelIdRegex.length == 1)){
            throw new CouldNotParseError("Could not parse channel id from message-content div");
        }

        this.context = {
            channelId: channelIdRegex[0]
        }
    }
}