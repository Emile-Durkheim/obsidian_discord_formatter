import { DateTime } from "luxon";

import { EmptyMessageError, parseMessageAttachments, CouldNotParseError } from "../utils";
import { TextRun } from "../TextRuns";
import { textRunFactory } from "../utils";
import ReplyMessage from "./ReplyMessage";
import { IDiscordFormatterSettings } from "../settings";
import { IDiscordMessage } from "./IDiscordMessage";


/**
 * For messages that consist of multiple Discord messages sent one after the other, but appearing as one.
 * These are served in an HTML format that's different from single messages, so the parsing works differently.
 */
export default class MultiMessage implements IDiscordMessage {

    // Properties as per interface
    content: {
        textRuns?: TextRun[],  
        attachments?: string[]
    }        
    
    header?: {
        nickname: string,
        timestamp: number,
        avatar?: string,
        reply?: ReplyMessage
    }        
    
    
    constructor(messageLi: Element) {
        // Parse the header
        // May throw CouldNotParseError if, for example, header wasn't copied at all or when
        // only half of a timestamp was copied in. In these cases, we skip constructing the header. 
        try {
            this.header = this.constructMessageHeader(messageLi);
        } catch (error) {
            if(!(error instanceof CouldNotParseError)){
                throw error;
            }        
        }        

        // Parse the message content; guaranteed to exist
        this.content = this.constructMessageContent(messageLi)
    }        


    protected constructMessageHeader(messageLi: Element): MultiMessage["header"] {
        const headerDiv = messageLi.querySelector("h3[class^='header']");
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
        
        if(!timeExact){
            throw new CouldNotParseError(`Message Header exists, but could not find time`);
        }   
        

        // --- Parse avatar, if it exists. Avatar is stored in sister of headerDiv --- 
        const avatarDiv = messageLi.querySelector("img[class^='avatar']") as HTMLImageElement;
        let avatarUrl = undefined;
        if(avatarDiv){
            avatarUrl = avatarDiv.src;
        }        


        // --- Parse MessageReply, if it exists. Reply is stored in sister of headerDiv ---
        const messageReplyDiv = messageLi.querySelector("div[id^='message-reply'");
        let messageReply = undefined;
        if(messageReplyDiv){
            messageReply = new ReplyMessage(messageReplyDiv);
        }        
        

        // --- Construct header ---
        const header: MultiMessage["header"] = {
            nickname: nickname,
            timestamp: Date.parse(timeExact),
        }        
        if(avatarUrl) header.avatar = avatarUrl;
        if(messageReply) header.reply = messageReply;

        return header;
    }        


    protected constructMessageContent(messageLi: Element): MultiMessage["content"] {
        const messageTextElems = this.getMessageTextElems(messageLi);
        const messageAttachmentElem = messageLi.querySelector("div[id^='message-accessories']");
        

        if(!messageTextElems && !messageAttachmentElem){
            throw new EmptyMessageError(`Message contains neither text content nor attachments`);
        }        
        
        
        const content: MultiMessage["content"] = {};

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
    protected getMessageTextElems(messageLi: Element): HTMLCollection | undefined {  
        // If the messageLi contains a reply to a different message, the text of the reply will be caught first by 
        // querySelector id^='message-content'; hence why we filter for a div id=^='message-content' that is the child
        // of a div class^='contents' 
        return messageLi.querySelector("div[class^='contents'] > div[id^='message-content']")?.children;
    }        

    
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        const markdownArray: string[] = [];

        // Nickname, time, reply
        if(this.header){
            const date = DateTime.fromMillis(this.header.timestamp);
            
            markdownArray.push(
                `**${this.header.nickname} - ${date.toFormat(settings.dateFormat)}**`
            )        

            if(this.header.reply && settings.showReplies){
                markdownArray.push(this.header.reply.toMarkdown(settings));
            }        
        }        

        // Text
        if(this.content.textRuns){
            const textMarkdownArray: string[] = [];

            for(const textRun of this.content.textRuns){
                let textRunMarkdown = textRun.toMarkdown(settings);

                // Replace newlines so that, even if newline in text message,
                // message is still displayed in a quote in Obsidian
                textRunMarkdown = textRunMarkdown.replaceAll(
                    '\n', '\n>'
                );

                textMarkdownArray.push(textRunMarkdown);
            }    

            markdownArray.push(textMarkdownArray.join(''));
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

