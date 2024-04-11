import { EmptyMessageError, parseMessageAttachments, textRunsToMarkdown } from "./utils";
import { CouldNotParseError } from "./utils";
import DiscordMessageReply from "./DiscordMessageReply";
import { MessageFormats } from "./formats";
import { textRunFactory } from "./utils";
import { IDiscordMessage } from "./IDiscordMessage";


export type TextRun = {
    content: string;
    type:
    "default" |
    "italics" |
    "bold" |
    "underline" |
    "strikethrough" |
    "h1" |
    "h2" |
    "h3" |
    "quote" |
    "edited" |
    "emoji" |
    "customEmoji";
};


export default class DiscordMessage implements IDiscordMessage {

    // Properties as per interface
    content: {
        textRuns?: TextRun[],  
        attachments?: string[]
    }    
    
    header?: {
        nickname: string,
        timeExact: number,
        timeRelative: string,
        avatar?: string,
        reply?: DiscordMessageReply
    }    
    
    
    constructor(MESSAGE_LI: Element) {
        // Check if <li> empty => empty <li>'s are common when
        // copy-pasting Discord messages and should be ignored
        if(!(MESSAGE_LI.firstElementChild?.innerHTML)){
            throw new EmptyMessageError("<li> seems to be empty")
        }    


        // Parse the header
        // May throw CouldNotParseError if, for example, header wasn't copied at all or when
        // only half of a timestamp was copied in. In these cases, we skip constructing the header. 
        try {
            this.header = this.constructMessageHeader(MESSAGE_LI);
        } catch (error) {
            if(!(error instanceof CouldNotParseError)){
                throw error;
            }    
        }    

        // Parse the message content; guaranteed to exist
        this.content = this.constructMessageContent(MESSAGE_LI)
    }    


    protected constructMessageHeader(MESSAGE_LI: Element): DiscordMessage["header"] {
        const headerDiv = MESSAGE_LI.querySelector("h3[class^='header']");
        if(!headerDiv){
            throw new CouldNotParseError(`No <h3 class='header...'> found`);
        }    

        // --- Parse nickname, guaranteed to exist if a message header exists ---
        const nickname = headerDiv.querySelector("span[class^='username']")?.textContent;
        if(!nickname){
            throw new CouldNotParseError(`Message Header exists, but could not find nickname`);
        }    

        
        // --- Parse time,headerDivuaranteed to exist if a message header exists ---ct timestampheaderli
        const timeExact = headerDiv.querySelector("time")?.dateTime
        let timeRelative = headerDiv.querySelector("time")?.textContent;  // Gets what's printed on the message; i.e. " -- Yesterday at 12:08"
        
        if(!(timeExact && timeRelative)){
            throw new CouldNotParseError(`Message Header exists, but could not find time`);
        } else {
            // cut off the first " -- " from time text " -- Today at 18:43"
            const regexTimeRelative = /— (.*)/.exec(timeRelative);  
            if(!(regexTimeRelative && regexTimeRelative.length == 2)){
                throw new CouldNotParseError("Relative time could not be parsed from Regex");
            }    
            
            timeRelative = regexTimeRelative[1]
        }    
        

        // --- Parse avatar, if it exists. Avatar is stored in sister of headerDiv --- 
        const avatarDiv = MESSAGE_LI.querySelector("img[class^='avatar']") as HTMLImageElement;
        let avatarUrl = undefined;
        if(avatarDiv){
            avatarUrl = avatarDiv.src;
        }    


        // --- Parse MessageReply, if it exists. Reply is stored in sister of headerDiv ---
        const messageReplyDiv = MESSAGE_LI.querySelector("div[id^='message-reply'");
        let messageReply = undefined;
        if(messageReplyDiv){
            messageReply = new DiscordMessageReply(messageReplyDiv);
        }    
        

        // --- Construct header ---
        const header: DiscordMessage["header"] = {
            nickname: nickname,
            timeExact: Date.parse(timeExact),
            timeRelative: timeRelative
        }    
        if(avatarUrl) header.avatar = avatarUrl;
        if(messageReply) header.reply = messageReply;

        return header;
    }    


    protected constructMessageContent(MESSAGE_LI: Element): DiscordMessage["content"] {
        const messageTextElems = this.getMessageTextElems(MESSAGE_LI);
        const messageAttachmentElem = MESSAGE_LI.querySelector("div[id^='message-accessories']");
        

        if(!messageTextElems && !messageAttachmentElem){
            throw new EmptyMessageError(`Message contains neither text content nor attachments`);
        }    
        
        
        const content: DiscordMessage["content"] = {};

        // Fill text runs
        if(messageTextElems){
            content.textRuns = [];
            for(const elem of Array.from(messageTextElems)){
                content.textRuns.push(textRunFactory(elem));
            }
        }

        // Fill attachments
        if(messageAttachmentElem){
            content.attachments = parseMessageAttachments(messageAttachmentElem);
        }    


        return content;
    }    


    /** Gets elements to be consumed by utils/textRunFactory() */
    protected getMessageTextElems(MESSAGE_LI: Element): HTMLCollection | undefined {  
        // If the messageLi contains a reply to a different message, the text of the reply will be caught first by 
        // querySelector id^='message-content'; hence why we filter for a div id=^='message-content' that is the child
        // of a div class^='contents' 
        return MESSAGE_LI.querySelector("div[class^='contents'] > div[id^='message-content']")?.children;
    }    

    
    public toMarkdown(formats: MessageFormats): string {
        const markdownArray: string[] = [];

        // Nickname, time, reply
        if(this.header){
            const date = new Date(this.header.timeExact);

            markdownArray.push(
                `**${this.header.nickname} - ${date.toLocaleString()}**`
            )    

            if(this.header.reply){
                markdownArray.push(this.header.reply.toMarkdown(formats));
            }    
        }    

        // Text
        if(this.content.textRuns){
            markdownArray.push(textRunsToMarkdown(this.content.textRuns, formats))
        }

        // Attachments
        if(this.content.attachments){
            for(const url of this.content.attachments){
                markdownArray.push(`![](${url})`)
            }    
        }    

        return '>' + markdownArray.join("\n>");
    }    
}    

