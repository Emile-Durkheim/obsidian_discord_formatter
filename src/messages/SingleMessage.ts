import MultiMessage from "./MultiMessage";


/** 
 * For the types of messages that are just one singular Discord message, preceded and followed by other people's messages.
 * These are served in an HTML format that's different from multi messages.
 */
export default class SingleMessage extends MultiMessage {
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
}