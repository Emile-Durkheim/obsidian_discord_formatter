import DiscordMessageReply from "./DiscordMessageReply";
import { MessageFormats } from "./formats";


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

    toMarkdown(formats: MessageFormats): string;
}

