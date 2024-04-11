// import DiscordMessageReply from "./DiscordMessageReply"
import { IDiscordFormatterSettings } from "./settings"


export interface IMessageFormats {
    // reply: (reply: DiscordMessageReply) => string | null,
    reply: () => boolean,
    edited: () => string | null,

    italics: (text: string) => string,
    bold: (text: string) => string,
    underline: (text: string) => string,
    strikethrough: (text: string) => string,

    quote: (text: string) => string,

    // See formatNewline() for why isLastElem is a thing
    h1: (text: string, isLastElem: boolean) => string,
    h2: (text: string, isLastElem: boolean) => string,
    h3: (text: string, isLastElem: boolean) => string,

    default: (text: string) => string
}


const formats = {
    reply: {  // showReply toggle
        // enabled: (reply: DiscordMessageReply) => { return reply.toMarkdown() },
        // disabled: (reply: DiscordMessageReply) => { return null }
        enabled: () => true,
        disabled: () => false
    },

    edited: {  // showEdited toggle
        enabled: () => { return ' *(edited)*' },
        disabled: () => { return null }
    },

    italics: (text: string) => { return `*${text}*` },
    bold: (text: string) => { return `**${text}**` },
    underline: (text: string) => { return `<u>${text}</u>` },
    strikethrough: (text: string) => { return `~~${text}~~` },

    quote: (text: string) => { return `>${text}` },

    undistinguishedHeading: (text: string, isLastElem: boolean) => { return formatNewline(`**${text}**`, isLastElem) },
    h1: (text: string, isLastElem: boolean) => { return formatNewline(`**--- ${text} ---**`, isLastElem) },
    h2: (text: string, isLastElem: boolean) => { return formatNewline(`**--${text}--**`, isLastElem) },
    h3: (text: string, isLastElem: boolean) => { return formatNewline(`**-${text}-**`, isLastElem) },

    default: (text: string) => { return `${text}` }  // text without specfic formatting
}
function formatNewline(text: string, isLastElem: boolean): string {
    // Since headings don't have a \n as part of their text by default,
    // we need to add this manually.

    if(isLastElem){
        return text;
    }

    return text + '\n>';
}


export function createFormats(settings: IDiscordFormatterSettings): IMessageFormats {
    // Defining this with tons of variables because this is the only good way I've found to make it
    // type-safe without TypeScript screaming at me.

    let h1Format: IMessageFormats['h1'];
    let h2Format: IMessageFormats['h2'];
    let h3Format: IMessageFormats['h3'];
    if(settings.distinguishHeadings === false){
        h1Format = formats.undistinguishedHeading;
        h2Format = formats.undistinguishedHeading;
        h3Format = formats.undistinguishedHeading;
    } else {
        h1Format = formats.h1;
        h2Format = formats.h2;
        h3Format = formats.h3;
    }

    let editedFormat: IMessageFormats['edited'];
    if(settings.showEdited === true){
        editedFormat = formats.edited.enabled;
    } else {
        editedFormat = formats.edited.disabled;
    }

    let replyFormat: IMessageFormats['reply'];
    if(settings.showReplies === true) {
        replyFormat = formats.reply.enabled;
    } else {
        replyFormat = formats.reply.disabled;
    }


    return {
        reply: replyFormat,
        edited: editedFormat,

        italics: formats.italics,
        bold: formats.bold,
        underline: formats.underline,
        strikethrough: formats.strikethrough,

        quote: formats.quote,
        h1: h1Format,
        h2: h2Format,
        h3: h3Format,

        default:formats.default 
    }
}