import { TextRun } from "../TextRuns";
import ReplyMessage from "./ReplyMessage";
import { IDiscordFormatterSettings } from "../settings";



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
        nickname?: string;
        timestamp?: number; // unix timestamp in milliseconds
        avatar?: string; // url
        reply?: ReplyMessage; // not every message is a reply to another message
    };

    toMarkdown(settings: IDiscordFormatterSettings): string;
}
