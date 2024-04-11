import DiscordMessageReply from "./DiscordMessageReply";

export class EmptyMessageError extends Error {
    // Thrown when an <li> is empty of message content; empty <li>'s are common when 
    // copy-pasting discord messages. Meant to be caught by DiscordConversation.

    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, EmptyMessageError.prototype);
    }
}


export class CouldNotParseError extends Error {
    // Thrown in DiscordMessage or DiscordConversation when unexpected HTML is encountenred
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, CouldNotParseError.prototype);
    }
}


export interface IDiscordMessage {
    toMarkdown(): string

    content: {
        text: string,
        attachments?: string[]  // contains URL to attachment
    }
    
    context: {
        channelId?: string
        messageId?: string,  // messaged ID will be unknown when paste happens to be 
                             // in DiscordSingleMessage format
    };

    header?: {
        nickname: string,
        timeExact?: number,  // unix timestamp in milliseconds
        timeRelative?: string,
        avatar?: string,  // url
        reply?: DiscordMessageReply
    }
}