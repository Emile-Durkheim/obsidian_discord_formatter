import { IDiscordMessage } from "./IDiscordMessage"
import { EmptyMessageError, CouldNotParseError } from "../utils"
import { TextRun } from "../TextRuns"
import { textRunFactory } from "../utils"
import { IDiscordFormatterSettings } from "../settings"


const MAX_CHARS_BEFORE_SHORTEN = 70;


/**
 * The attached message that a given Discord message is replying to. (May or may not exist on a DiscordMessage)
 */
export default class ReplyMessage implements IDiscordMessage {
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


    protected constructMessageContent(replyDiv: Element): ReplyMessage["content"] {
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


    protected constructMessageHeader(replyDiv: Element): ReplyMessage["header"] {
        const nickname = replyDiv.querySelector("span[class^='username']")?.textContent;
        if(!nickname){
            console.error(replyDiv);
            throw new CouldNotParseError(`Expected a <span class='username-'> in div, but querySelector couldn't locate one`);
        }

        return {nickname: nickname};
    }


    toMarkdown(settings: IDiscordFormatterSettings): string {
        const markdownArray: string[] = [];

        let characterCount = 0;
        let isOverMaxCharCount = false;
        const doShortenReplies = settings.showReplies === "shortened";

        for(let i=0; i < this.content.textRuns.length && !(doShortenReplies && isOverMaxCharCount); i++){
            const textRun = this.content.textRuns[i]

            if(doShortenReplies){
                characterCount += textRun.content.length;

                if(characterCount >= MAX_CHARS_BEFORE_SHORTEN){
                    isOverMaxCharCount = true;
                }
            }
            
            // Shorten message content
            if(doShortenReplies && isOverMaxCharCount){
                const overflowingCharCount = characterCount - MAX_CHARS_BEFORE_SHORTEN;
                textRun.content = textRun.content.slice(0, textRun.content.length - overflowingCharCount);
            }
            
            const textRunMarkdown = textRun.toMarkdown(settings, true);
            
            // Edge case: If reply shortening is on but last run before shortening has exactly 1 character, 
            // its content is purged above, but its special markdown would still be committed (like **b** => ****)
            if(textRun.content.length === 0){
                break;
            }

            markdownArray.push(textRunMarkdown);

            if(doShortenReplies && isOverMaxCharCount){
                markdownArray.push('...');
            }
        }

        // If there's a newline, ensure new line is still shown as a nested quote
        const textMarkdown = markdownArray.join('').replaceAll('\n', '\n>>');
        
        return `>**${this.header.nickname}:** ${textMarkdown}`;
    }
}