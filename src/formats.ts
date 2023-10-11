import { IDiscordFormatterSettings } from "./settings"


export type MessageFormats = {
    reply: (replyText: string, nickname: string) => string,
    edited: () => string,

    italics: (content: string) => string,
    bold: (content: string) => string,
    underline: (content: string) => string,
    strikethrough: (content: string) => string,

    quote: (content: string) => string,

    // See formatNewline() for why isLastElem is a thing
    h1: (content: string) => string,
    h2: (content: string) => string,
    h3: (content: string) => string,

    default: (content: string) => string,

    emoji: (content: string) => string,
    customEmoji: (content: string) => string  // customEmoji content is a url
}


/** 
 * All formats available; nested formats are to be resolved by createFormats(),
 * which is called once the settings are set and choose one format for each category. 
 */
const formats = {
    reply: {  // showReply toggle
        enabled: (replyText: string, nickname: string) => { return `>**${nickname}**: ${replyText}` },
        disabled: (replyText: string, nickname: string) => { return '' }
    },

    edited: {  // showEdited toggle
        enabled: () => { return ' *(edited)*' },
        disabled: () => { return '' }
    },

    italics: (content: string) => { return `*${content}*` },
    bold: (content: string) => { return `**${content}**` },
    underline: (content: string) => { return `<u>${content}</u>` },
    strikethrough: (content: string) => { return `~~${content}~~` },

    quote: (content: string) => { return `>${content}` },

    undistinguishedHeading: (content: string) => { return addNewLine(`**${content}**`) },
    h1: (content: string) => { return addNewLine(`**--- ${content} ---**`) },
    h2: (content: string) => { return addNewLine(`**--${content}--**`) },
    h3: (content: string) => { return addNewLine(`**-${content}-**`) },

    default: (content: string) => { return content },  // content without particular formatting

    emoji: (content: string) => { return content },
    customEmoji: (content: string) => { return `<img src='${content}' style='height: var(--font-text-size)'>` }
}



/** Since headings don't have a trailing \n as part of their content text by default,
    we add one manually. 
    
    If we didn't, the next piece of content after a heading would be displayed in the same line.
 */
function addNewLine(content: string): string {
    // TODO: Check if this is deprecated


    return content + '\n>';
}


/** 
 * Helper function so settings can be applied and retrieve the right message formats 
 */
export function createFormats(settings: IDiscordFormatterSettings): MessageFormats {
    // Defining this with tons of variables because this is the only good way I've found to make it
    // type-safe without TypeScript screaming at me.

    let h1Format: MessageFormats['h1'];
    let h2Format: MessageFormats['h2'];
    let h3Format: MessageFormats['h3'];
    if(settings.distinguishHeadings === false){
        h1Format = formats.undistinguishedHeading;
        h2Format = formats.undistinguishedHeading;
        h3Format = formats.undistinguishedHeading;
    } else {
        h1Format = formats.h1;
        h2Format = formats.h2;
        h3Format = formats.h3;
    }

    let editedFormat: MessageFormats['edited'];
    if(settings.showEdited === true){
        editedFormat = formats.edited.enabled;
    } else {
        editedFormat = formats.edited.disabled;
    }

    let replyFormat: MessageFormats['reply'];
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

        default: formats.default,

        emoji: formats.emoji,
        customEmoji: formats.customEmoji
    }
}