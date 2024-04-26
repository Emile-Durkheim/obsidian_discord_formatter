import { TextRun, TextRunDefault } from "../TextRuns";
import { IDiscordMessage } from "./IDiscordMessage";
import { IDiscordFormatterSettings } from "../settings";
import { EmptyMessageError, formatMessageDate } from "../utils";
import { DateTime } from "luxon";


export default class SystemMessage implements IDiscordMessage {
    content: {
        textRuns: TextRun[]
    }
    header: {
        timestamp: number
    }


    constructor(messageLi: Element){
        // Construct content
        const messageTextElems = messageLi.querySelector("div[class^='content_']")?.childNodes;
        
        if(!messageTextElems){
            throw new EmptyMessageError(`System message contains no text content`);
        }
        
        let text = "";
        for(const elem of Array.from(messageTextElems)){
            // Actual text will be in either textNode or <a> tag, <span> contains a timestamp.
            if(elem.nodeName !== "SPAN"){
                text += elem.textContent;
            }
        } 

        this.content = {textRuns: [new TextRunDefault(text)]};


        // Construct header
        const timeElem = messageLi.querySelector("time");

        if(!timeElem?.dateTime){
            throw new EmptyMessageError('System message contains no timestamp');
        }

        this.header = {timestamp: Date.parse(timeElem.dateTime)};
    }

    
    toMarkdown(settings: IDiscordFormatterSettings): string {
        const date = DateTime.fromMillis(this.header.timestamp);
        return `>**System${formatMessageDate(date, settings)}**\n>${this.content.textRuns[0].toMarkdown(settings)}`
    }
}