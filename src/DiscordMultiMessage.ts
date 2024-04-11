
import { DateTime } from "luxon";

import { EmptyMessageError, parseMessageAttachments, CouldNotParseError } from "./utils";
import { TextRun } from "./TextRuns";
import { textRunFactory } from "./utils";
import DiscordMessageReply from "./DiscordMessageReply";
import { IDiscordFormatterSettings } from "./settings";


export interface IDiscordMessage {
    // content will exist on a message, but there might both be only attachments and
    // no text on a message, or only text but not attachments
    content: {
        textRuns?: TextRun[];
        attachments?: string[]; // contains URL to attachment(s)
    };

    // might not be present if user selected only the message text for copy,
    // or if user copied header only partially (i.e. only copied half of the timestamp)
    header?: {
        nickname: string;
        timeExact?: number; // unix timestamp in milliseconds
        timeRelative?: string;
        avatar?: string; // url
        reply?: DiscordMessageReply; // not every message is a reply to another message
    };

    toMarkdown(settings: IDiscordFormatterSettings): string;
}


/**
 * For messages that consist of multiple Discord messages sent one after the other, but appearing as one.
 * These are served in an HTML format that's different from single messages, so the parsing works differently.
 */
export default class DiscordMultiMessage implements IDiscordMessage {

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


    protected constructMessageHeader(MESSAGE_LI: Element): DiscordMultiMessage["header"] {
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
        const header: DiscordMultiMessage["header"] = {
            nickname: nickname,
            timeExact: Date.parse(timeExact),
            timeRelative: timeRelative
        }        
        if(avatarUrl) header.avatar = avatarUrl;
        if(messageReply) header.reply = messageReply;

        return header;
    }        


    protected constructMessageContent(MESSAGE_LI: Element): DiscordMultiMessage["content"] {
        const messageTextElems = this.getMessageTextElems(MESSAGE_LI);
        const messageAttachmentElem = MESSAGE_LI.querySelector("div[id^='message-accessories']");
        

        if(!messageTextElems && !messageAttachmentElem){
            throw new EmptyMessageError(`Message contains neither text content nor attachments`);
        }        
        
        
        const content: DiscordMultiMessage["content"] = {};

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

    
    public toMarkdown(settings: IDiscordFormatterSettings): string {
        const markdownArray: string[] = [];

        // Nickname, time, reply
        if(this.header){
            const date = DateTime.fromMillis(this.header.timeExact);
            
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

