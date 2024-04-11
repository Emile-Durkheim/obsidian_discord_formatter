import { parseMessageContent, CouldNotParseError, EmptyMessageError } from "./utils";
import DiscordMessageReply from "./DiscordMessageReply";


export default class DiscordMessage {
    context: {
        messageId: string,
        channelId: string
    };

    content: {
        text: string,
        attachments?: string[]  // contains URL to attachment
    }

    header?: {
        nickname: string,
        timeExact: number,  // unix timestamp in milliseconds
        timeRelative: string,
        avatar?: string,  // url
        reply?: DiscordMessageReply
    }


    constructor(messageLi: Element) {
        // Check if <li> empty => empty <li>'s are common when
        // copy-pasting Discord messages and should be ignored
        if(!(messageLi.firstElementChild?.innerHTML)){
            throw new EmptyMessageError("<li> seems to be empty")
        }


        // Parse the header, if one exists
        const messageHeader = messageLi.querySelector("h3[class^='header']");
        
        if(messageHeader){
            this.constructMessageHeader(messageLi);
        }


        // Parse the message context; guaranteed to exist
        this.constructMessageContext(messageLi);

        // Parse the message content; guaranteed to exist; only text content supported for now
        this.constructMessageContent(messageLi)
    }


    private constructMessageHeader(li: Element) {
        const headerDiv = li.querySelector("h3[class^='header']");
        if(!headerDiv){
            console.error(headerDiv);
            throw new CouldNotParseError(`parseMessageHeader() called but <h3 class='header...'> could not be found`);
        }

        // --- Parse nickname, guaranteed to exist if a message header exists ---
        const nickname = headerDiv.querySelector("span[class^='username']")?.textContent;
        if(!nickname){
            console.error(headerDiv);
            throw new CouldNotParseError(`Message Header exists, but could not find nickname`);
        }

        
        // --- Parse time,headerDivuaranteed to exist if a message header exists ---ct timestampheaderli
        const timeExact = headerDiv.querySelector("time")?.dateTime
        let timeRelative = headerDiv.querySelector("time")?.textContent;  // Gets what's printed on the message; i.e. " -- Yesterday at 12:08"
        
        if(!(timeExact && timeRelative)){
            console.error(headerDiv);
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
        const avatarDiv = li.querySelector("img[class^='avatar']") as HTMLImageElement;
        let avatarUrl = undefined;
        if(avatarDiv){
            avatarUrl = avatarDiv.src;
        }


        // --- Parse MessageReply, if it exists. Reply is stored in sister of headerDiv ---
        const messageReplyDiv = li.querySelector("div[id^='message-reply'");
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

        this.header = header;
    }


    private constructMessageContent(li: Element) {
        const messageContentElems = li.querySelector("div[class^='contents'] > div[id^='message-content']")?.children;

        if(!messageContentElems){
            console.error(li);
            throw new EmptyMessageError(`Message contains no text content`);
        }

        this.content = {
            text: parseMessageContent(messageContentElems)
        };
    }

    
    private constructMessageContext(li: Element) {
        const IdRegex = /(\d{18})-(\d{19})/.exec(li.id);
        
        if(!(IdRegex && IdRegex.length == 3)){
            console.log(li);
            throw new CouldNotParseError("messageId and serverId not found in <li> id");
        }

        this.context = {
            channelId: IdRegex[1],
            messageId: IdRegex[2]
        }
    }


    public toMarkdown(): string {
        const markdownArray: string[] = [];

        if(this.header){
            const date = new Date(this.header.timeExact);

            markdownArray.push(
                `**${this.header.nickname} - ${date.toLocaleString()}**`
            )

            if(this.header.reply){
                markdownArray.push(this.header.reply.toMarkdown());
            }
        }

        markdownArray.push(this.content.text);

        return '>' + markdownArray.join("\n>");
    }
}

