import DiscordMessage, { EmptyMessageError } from "./DiscordMessage";

export default class DiscordConversation {
    messages: DiscordMessage[];


    constructor(doc: Document){
        this.messages = []; 

        const messageLis: Element[] = Array.from(doc.querySelectorAll("li"));

        for (const li of messageLis){
            try {
                this.messages.push(new DiscordMessage(li));
            } catch(err) {
                if(!(err instanceof EmptyMessageError)){
                    throw err;
                } else { continue; }  // Empty li's are expected
            }
        }
    }

    static fromRawHTML(html: string){
        const parser = new DOMParser();
        const DOM: Document = parser.parseFromString(html, 'text/html');

        return new this(DOM);
    }
}