import { IDiscordMessage } from "./DiscordMessage"
import { EmptyMessageError, CouldNotParseError } from "./utils"
import { textRunFactory, TextRun } from "./TextRuns"
import { IDiscordFormatterSettings } from "./settings"


export default class DiscordMessageReply implements IDiscordMessage {
    content: {
        textRuns: TextRun[]
    }
    header: {
        nickname: string
    }

    constructor(REPLY_DIV: Element){
        // Check if a REPLY_DIV was actually passed in
        if(!/^message-reply-context/.test(REPLY_DIV.id)){
            console.error(REPLY_DIV);
            throw new CouldNotParseError(`Expected <div id="message-reply-context...">`);
        }


        // Parse header (just the nickname in this case)
        this.header = this.constructMessageHeader(REPLY_DIV);


        // Parse content
        this.content = this.constructMessageContent(REPLY_DIV)
    }


    protected constructMessageContent(REPLY_DIV: Element): DiscordMessageReply["content"] {
        const messageContentElems = this.getMessageTextElems(REPLY_DIV)

        if(!messageContentElems){
            console.error(REPLY_DIV);
            throw new EmptyMessageError(`Message contains no text content`);
        }
        
        // Fill text runs
        const textRuns = [] as TextRun[];
        for(const elem of Array.from(messageContentElems)){
            textRuns.push(textRunFactory(elem));
        }

        return { textRuns: textRuns };
    }


    /** Gets elements to be consumed by utils/textRunFactory() */
    protected getMessageTextElems(REPLY_DIV: Element): HTMLCollection | undefined {
        return REPLY_DIV.querySelector("div[id^='message-content']")?.children;
    }


    protected constructMessageHeader(REPLY_DIV: Element): DiscordMessageReply["header"] {
        const nickname = REPLY_DIV.querySelector("[class^='username-']")?.textContent;
        if(!nickname){
            console.error(REPLY_DIV);
            throw new CouldNotParseError(`Expected a <span class='username-'> in div, but querySelector couldn't locate one`);
        }

        return {nickname: nickname};
    }


    toMarkdown(settings: IDiscordFormatterSettings): string {
        const markdownArray: string[] = [];

        for(const textRun of this.content.textRuns){
                const textRunMarkdown = textRun.toMarkdown(settings, true);

                markdownArray.push(textRunMarkdown);
        }

        // If there's a newline, ensure new line is still shown as a nested quote
        const textMarkdown = markdownArray.join('').replaceAll('\n', '\n>>');
        
        return `>**${this.header.nickname}:** ${textMarkdown}`;
    }
}