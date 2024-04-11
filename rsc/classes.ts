class CouldNotParseMessage extends Error {
    // Thrown when HTML shows unexpected behavior

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CouldNotParseMessage.prototype);
    }
}
class EmptyMessage extends Error {
    // Thrown when an <li> is empty of message content; empty <li>'s are common when 
    // copy-pasting discord messages. Meant to be caught by DiscordConversation.

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, EmptyMessage.prototype);
    }
}


export class DiscordMessage {
    readonly context: {
        messageId: number,
        channelId: number
    };

    readonly content: {
        text: string,
        attachments?: string[]  // contains URL to attachment
    };

    header?: {
        username: string,
        timeExact: number,  // unix timestamp in milliseconds
        timeRelative: string,
        avatar?: string  // url
    };


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
            this.parseMessageHeader(messageHeader);

            const avatar = li.querySelector("img[class^='avatar']") as HTMLImageElement;
            if(avatar){
                const avatarUrl = avatar.src;
                this.header!.avatar = avatarUrl;  // header guaranteed to exist if parseMessageHeader returns
            }
        }


        // Parse the message context; guaranteed to exist
        const IdRegex = /(\d{18})-(\d{19})/.exec(li.id);
        
        if(IdRegex && IdRegex.length == 3){
            this.context = {
                channelId: parseInt(IdRegex[1]),
                messageId: parseInt(IdRegex[2])
            }
        } else {
            console.log(li);
            throw new CouldNotParseMessage("messageId and serverId not found in <li> id");
        }


        // Parse the message content; guaranteed to exist
        // Only parse text content for now
        const messageFragments: string[] = [];
        const messageContentSpans = li.querySelector("div[id^='message-content']")?.children;

        if(!messageContentSpans){
            console.log(li);
            throw new CouldNotParseMessage("message contains no text content");
        }

        for(const messageContentSpan of Array.from(messageContentSpans)){
            messageFragments.push(messageContentSpan.innerHTML);
        }

        this.content = {
            text: messageFragments.join('')
        }
    }


    private parseMessageHeader(header: Element): void {
        // Guaranteed to exist if a message header exists
        const username = header.querySelector("span[class^='username']")?.textContent;
        const timeExact = header.querySelector("time")?.dateTime;  // Gets an exact timestamp
        let timeRelative = header.querySelector("time")?.textContent;  // Gets what's printed on the message; i.e. " -- Yesterday at 12:08"
        timeRelative = timeRelative?.slice(3);  // cut off the first " -- " from message
        
        if(username && timeExact && timeRelative){
            this.header = {
                username: username,
                timeExact: Date.parse(timeExact),
                timeRelative: timeRelative
            }
        } else {
            console.log(header);
            throw new CouldNotParseMessage("Message Header exists, but could not find username or time.");
        }
    }
}