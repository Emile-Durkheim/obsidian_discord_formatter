import { CouldNotParseError, EmptyMessageError, IDiscordMessage } from "./types";
import DiscordMessageReply from "./DiscordMessageReply";


export default class DiscordMessage implements IDiscordMessage {
    content: {
        text: string,
        attachments?: string[]  // contains URL to attachment
    }
    
    context: {
        channelId: string
        messageId?: string,  // messaged ID will be unknown when paste happens to be 
                             // in DiscordSingleMessage format
    };

    header?: {
        nickname: string,
        timeExact: number,  // unix timestamp in milliseconds
        timeRelative: string,
        avatar?: string,  // url
        reply?: DiscordMessageReply
    }


    constructor(MESSAGE_LI: Element) {
        // Check if <li> empty => empty <li>'s are common when
        // copy-pasting Discord messages and should be ignored
        if(!(MESSAGE_LI.firstElementChild?.innerHTML)){
            throw new EmptyMessageError("<li> seems to be empty")
        }


        // Parse the header, if one exists
        try {
            this.constructMessageHeader(MESSAGE_LI);
        } catch (error) {
            // If incomplete header is passed, like one only containing a timestamp, continue without building the header
            if(!(error instanceof CouldNotParseError)){
                throw error;
            }
        }

        // Parse the message context; guaranteed to exist
        this.constructMessageContext(MESSAGE_LI);

        // Parse the message content; guaranteed to exist
        this.constructMessageContent(MESSAGE_LI)
    }


    protected constructMessageHeader(MESSAGE_LI: Element) {
        const headerDiv = MESSAGE_LI.querySelector("h3[class^='header']");
        if(!headerDiv){
            throw new CouldNotParseError(`No <h3 class='header...'> found`);
        }

        // --- Parse nickname, guaranteed to exist if a message header exists ---
        const nickname = headerDiv.querySelector("span[class^='username']")?.textContent;
        if(!nickname){
            throw new CouldNotParseError(`Message Header exists, but could not find nickname`);
        }

        
        // --- Parse time,headerDivuaranteed to exist if a message header exists ---ct timestampheaderli
        const timeExact = headerDiv.querySelector("time")?.dateTime
        let timeRelative = headerDiv.querySelector("time")?.textContent;  // Gets what's printed on the message; i.e. " -- Yesterday at 12:08"
        
        if(!(timeExact && timeRelative)){
            throw new CouldNotParseError(`Message Header exists, but could not find time`);
        } else {
            // cut off the first " -- " from time text " -- Today at 18:43"
            const regexTimeRelative = /— (.*)/.exec(timeRelative);  
            if(!(regexTimeRelative && regexTimeRelative.length == 2)){
                throw new CouldNotParseError("Relative time could not be parsed from Regex");
            }
            
            timeRelative = regexTimeRelative[1]
        }
        
        // --- Parse avatar, if it exists. Avatar is stored in sister of headerDiv --- 
        const avatarDiv = MESSAGE_LI.querySelector("img[class^='avatar']") as HTMLImageElement;
        let avatarUrl = undefined;
        if(avatarDiv){
            avatarUrl = avatarDiv.src;
        }


        // --- Parse MessageReply, if it exists. Reply is stored in sister of headerDiv ---
        const messageReplyDiv = MESSAGE_LI.querySelector("div[id^='message-reply'");
        let messageReply = undefined;
        if(messageReplyDiv){
            messageReply = new DiscordMessageReply(messageReplyDiv);
        }
        

        // --- Construct header ---
        const header: DiscordMessage["header"] = {
            nickname: nickname,
            timeExact: Date.parse(timeExact),
            timeRelative: timeRelative
        }
        if(avatarUrl) header.avatar = avatarUrl;
        if(messageReply) header.reply = messageReply;

        this.header = header;
    }


    protected constructMessageContent(MESSAGE_LI: Element) {
        // If the messageLi contains a reply to a different message, the text of the reply will be caught first by 
        // querySelector id^='message-content'; hence why we filter for a div id=^='message-content' that is the child
        // of a div class^='contents' 
        const messageTextElems = MESSAGE_LI.querySelector("div[class^='contents'] > div[id^='message-content']")?.children;

        if(!messageTextElems){
            throw new EmptyMessageError(`Message contains no text content`);
        }

        this.content = {
            text: this.parseMessageText(messageTextElems)
        };
    }

    protected parseMessageText(messageContentElems: HTMLCollection): string {
        const message: string[] = []

        // Using Array.from() because eslint does not recognize me using ES2015+ for some reason...
        for(const elem of Array.from(messageContentElems)){
            let textContent = elem.textContent;
            
            // --- Emojis/Custom emojis ---
            if(!textContent){ 
                if(/^emojiContainer/.test(elem.className)){
                    const imgElem = elem.children[0] as HTMLImageElement;
                    if(!imgElem){
                        console.error("No img element found in span.emojiContainer");
                    }

                    if(/^:.+:$/.test(imgElem.alt)){  // If it's a custom emoji, then alt text is ':emojiName:'
                        message.push(`<img src='${imgElem.src}' style='height: var(--font-text-size)'>`)
                    } else {  // If it's a unicode emoji, then alt text is the unicode emoji
                        message.push(`${imgElem.alt}`);
                    }
                }
                continue;
            }


            // --- Text ----

            // If there's a newline, start the next line in a new quote
            textContent = textContent.replace("\n", "\n>");

            // Check the the type of a node to determine what kind of text it is.
            // For some types of text (quotes...) we need to check the
            // class name instead. A blockquote will have class="blockquote-2AkdDH",
            // wherein the last 6 alphanumericals will be random gibberish.
            switch(elem.nodeName){
                case "EM": { // italics
                    message.push(`*${textContent}*`); break;
                }

                case "STRONG": { // bold
                    message.push(`**${textContent}**`); break;
                }

                case "U": { // underline
                    message.push(`<u>${textContent}</u>`); break;
                }

                case "S": {  // strikethrough
                    message.push(`~~${textContent}~~`); break;
                }
                
                case "H1": {  // Heading 1
                    // headings don't have a newline by default, so we add one manually
                    message.push(`**${textContent}**\n>`); break;
                }
                
                case "H2": {  // Heading 2
                    message.push(`**${textContent}**\n>`); break;
                }
                
                case "H3": {  // Heading 3
                    message.push(`**${textContent}**\n>`); break;
                }

                default: {  
                    // Check class names for other formatting types
                    // Quote
                    if(/^blockquote/.test(elem.className)){
                        message.push(`>${textContent}`); 
                        
                    // (edited) mark
                    } else if(/^timestamp/.test(elem.className)){
                        message.push(` *(edited)*`)

                    // No special styling
                    } else {
                        message.push(textContent);
                    }
                }
            }
        }

        return message.join("");
    }

    
    protected constructMessageContext(MESSAGE_LI: Element) {
        // li has an id="chat-messages-557327188311932959-1135326475244027975", with first number
        // being the channel ID and second number being the message ID; that's what we're extracting.
        const IdRegex = /(\d{18})-(\d{19})/.exec(MESSAGE_LI.id);
        
        if(!(IdRegex && IdRegex.length == 3)){
            console.log(MESSAGE_LI);
            throw new CouldNotParseError("messageId and serverId not found in <li> id");
        }

        this.context = {
            channelId: IdRegex[1],
            messageId: IdRegex[2]
        }
    }


    public toMarkdown(): string {
        const markdownArray: string[] = [];

        if(this.header){
            const date = new Date(this.header.timeExact);

            markdownArray.push(
                `**${this.header.nickname} - ${date.toLocaleString()}**`
            )

            if(this.header.reply){
                markdownArray.push(this.header.reply.toMarkdown());
            }
        }

        markdownArray.push(this.content.text);

        return '>' + markdownArray.join("\n>");
    }
}

