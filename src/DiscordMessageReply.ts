import DiscordMessage from "./DiscordMessage"
import { CouldNotParseError, EmptyMessageError } from "./utils"


export default class DiscordMessageReply{
    context: {
        messageId: string
    }
    content: {
        text: string
    }
    header: {
        nickname: string
    }

    constructor(replyDiv: Element){
        // Check if a replyDiv was actually passed in
        if(!/^message-reply-context/.test(replyDiv.id)){
            console.error(replyDiv);
            throw new CouldNotParseError(`Expected <div id="message-reply-context...">`);
        }


        // Parse nickname
        const nickname = replyDiv.querySelector("[class^='username-']")?.textContent;
        if(!nickname){
            console.error(replyDiv);
            throw new CouldNotParseError(`Expected a <span class='username-'> in div, but querySelector couldn't locate one`);
        }

        this.header = {nickname: nickname};


        // Parse context
        const messageContentDiv = replyDiv.querySelector("[id^='message-content'");
        if(!messageContentDiv){
            console.error(replyDiv);
            throw new CouldNotParseError(`Expectected a <span id='message-content-...'> in div, but querySelector couldn't locate one`);
        }

        const regexMessageId = /message-content-(\d{19})/.exec(messageContentDiv.id);
        if(regexMessageId && regexMessageId.length == 2){
            this.context = {messageId: regexMessageId[1]};
        } else {
            console.error(replyDiv);
            throw new CouldNotParseError(`Could not find messageId`);
        }


        // Parse content
        const messageContentElems = replyDiv.querySelector("div[id^='message-content']")?.children;

        if(!messageContentElems){
            console.error(replyDiv);
            throw new EmptyMessageError(`Message contains no text content`);
        }

        this.content = { text: DiscordMessage.parseMessageContent(messageContentElems) };
    }


    toMarkdown(): string {
        return `>**${this.header.nickname}**: ${this.content.text}`;
    }
}