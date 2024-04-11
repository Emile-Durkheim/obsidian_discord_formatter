import { CouldNotParseError } from "./utils";

export class EmptyMessage extends Error {
    // Thrown when an <li> is empty of message content; empty <li>'s are common when 
    // copy-pasting discord messages. Meant to be caught by DiscordConversation.

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, EmptyMessage.prototype);
    }
}


export type DiscordMessageContext = {
    messageId: string,
    channelId: string
}
export type DiscordMessageContent = {
    text: string,
    attachments?: string[]  // contains URL to attachment
}
export type DiscordMessageHeader = {
    username: string,
    timeExact: number,  // unix timestamp in milliseconds
    timeRelative: string,
    avatar?: string  // url
}

export default class DiscordMessage {
    readonly context: DiscordMessageContext;
    readonly content: DiscordMessageContent;
    readonly header?: DiscordMessageHeader;


    constructor(li: Element) {
        // Check if <li> empty => empty <li>'s are common when
        // copy-pasting Discord messages and should be ignored
        if(!(li.firstElementChild?.innerHTML)){
            console.log(li);
            throw new EmptyMessage("<li> seems to be empty")
        }


        // Parse the header, if one exists
        const messageHeader = li.querySelector("h3[class^='header']");
        
        if(messageHeader){
            this.header = this.parseMessageHeader(messageHeader);

            const avatar = li.querySelector("img[class^='avatar']") as HTMLImageElement;
            if(avatar){
                const avatarUrl = avatar.src;
                this.header!.avatar = avatarUrl;  // header guaranteed to exist if parseMessageHeader returns
            }
        }


        // Parse the message context; guaranteed to exist
        this.context = this.parseMessageContent(li);

        // Parse the message content; guaranteed to exist; only text content for now
        const messageText = this.parseMessageText(li);
        this.content = {
            text: messageText
        }
    }


    private parseMessageHeader(header: Element): DiscordMessageHeader {
        // Guaranteed to exist if a message header exists
        const username = header.querySelector("span[class^='username']")?.textContent;
        const timeExact = header.querySelector("time")?.dateTime;  // Gets an exact timestamp
        let timeRelative = header.querySelector("time")?.textContent;  // Gets what's printed on the message; i.e. " -- Yesterday at 12:08"
        timeRelative = timeRelative?.slice(3);  // cut off the first " -- " from message
        
        if(username && timeExact && timeRelative){
            return {
                username: username,
                timeExact: Date.parse(timeExact),
                timeRelative: timeRelative
            }
        } else {
            console.log(header);
            throw new CouldNotParseError("Message Header exists, but could not find username or time.");
        }
    }


    private parseMessageText(li: Element): string {
        const messageFragments: string[] = [];
        const messageContentSpans = li.querySelector("div[id^='message-content']")?.children;

        if(!messageContentSpans){
            console.log(li);
            throw new CouldNotParseError("message contains no text content");
        }

        for(const messageContentSpan of Array.from(messageContentSpans)){
            messageFragments.push(messageContentSpan.innerHTML);
        }

        return messageFragments.join('');
    }

    
    private parseMessageContent(li: Element): DiscordMessageContext {
        const IdRegex = /(\d{18})-(\d{19})/.exec(li.id);
        
        if(IdRegex && IdRegex.length == 3){
            return {
                channelId: IdRegex[1],
                messageId: IdRegex[2]
            }
        } else {
            console.log(li);
            throw new CouldNotParseError("messageId and serverId not found in <li> id");
        }
    }
}