import { IDiscordMessage } from "./DiscordMultiMessage"
import { EmptyMessageError, CouldNotParseError } from "./utils"
import { textRunFactory, TextRun } from "./TextRuns"
import { IDiscordFormatterSettings } from "./settings"


/**
 * The attached message that a given Discord message is replying to. (May or may not exist on a DiscordMessage)
 */
export default class DiscordMessageReply implements IDiscordMessage {
    content: {
        textRuns: TextRun[]
    }
    header: {
        nickname: string
    }

    constructor(replyDiv: Element){
        // Check if a REPLY_DIV was actually passed in
        if(!/^message-reply-context/.test(replyDiv.id)){
            console.error(replyDiv);
            throw new CouldNotParseError(`Expected <div id="message-reply-context...">`);
        }


        // Parse header (just the nickname in this case)
        this.header = this.constructMessageHeader(replyDiv);


        // Parse content
        this.content = this.constructMessageContent(replyDiv)
    }


    protected constructMessageContent(replyDiv: Element): DiscordMessageReply["content"] {
        const messageContentElems = this.getMessageTextElems(replyDiv)

        // Fill text runs
        const textRuns = [] as TextRun[];
        for(const elem of Array.from(messageContentElems)){
            textRuns.push(textRunFactory(elem));
        }

        return { textRuns: textRuns };
    }


    /** Gets elements to be consumed by utils/textRunFactory() */
    protected getMessageTextElems(replyDiv: Element): HTMLCollection {
        let messageContentElems = replyDiv.querySelector("div[class^='repliedTextContent']")?.children;
        
        // failsafes for when discord inevitably changes their classname/id formats again
        if(!messageContentElems){
            messageContentElems = replyDiv.querySelector("div[id^='message-content']")?.children;
        }

        if(!messageContentElems){
            messageContentElems = replyDiv.querySelector("div[class^='message-content']")?.children;
        }

        if(!messageContentElems){
            console.error("Couldn't find message content of reply: ", replyDiv);
            throw new EmptyMessageError(`Message contains no text content`);
        }

        return messageContentElems;
    }


    protected constructMessageHeader(replyDiv: Element): DiscordMessageReply["header"] {
        const nickname = replyDiv.querySelector("span[class^='username']")?.textContent;
        if(!nickname){
            console.error(replyDiv);
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