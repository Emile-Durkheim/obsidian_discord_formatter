import { log } from 'rsc/utils';

export default function discordMessageToMarkdown(event: ClipboardEvent): string | undefined {
    // Check that there is data in clipboardEvent
    if (!event.clipboardData){
        log("clipboardData empty")
        return;
    }
    
    // Parse clipboardEvent into a Document if possible
    const messageDOM = clipboardToDocument(event.clipboardData);
    if(!messageDOM){
        log("No HTML in paste");
        return;
    }

    // Ensure it's a Discord message
    if(!isDiscordMessage(messageDOM)){
        log("Not a Discord message");
        return;
    }

    // Parse message to markdown

    // That children exist was already ensured by isDiscordMessage()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const messageDivs: Element[] = Array.from(messageDOM.body.firstElementChild!.children!);
    const markdown: string[] = [];

    for(const messageDiv of messageDivs)
    {
        // Parse the header that contains username/time if it exists on the message
        const messageHeader = messageDiv.querySelector("h3");

        if(messageHeader){
            const username = messageHeader.querySelector("span > span")?.textContent;
            const time = messageHeader.querySelector("time")?.textContent;
            
            if(!(username && time)){
                throw new Error("Couldn't get username or time.");
            }

            markdown.push(`>**${username}${time}**`);
        }
        
        
        // Parse the message
        // no-non-null-assertion: Assured to be non-null by HTML structure of Discord message
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const messageFragments: string[] = [];
        const messageContentSpans = messageDiv.querySelector("div[id*='message-content']")?.children;

        if(messageContentSpans === undefined){
            log("Contains no message: ", messageDiv);
            continue;
        }

        for(const messageContentSpan of Array.from(messageContentSpans)){
            messageFragments.push(messageContentSpan.innerHTML);
        }

        // Push the message to our markdown
        markdown.push(`>${messageFragments.join('')}`);
    }

    log(markdown.join('\n'));
    return markdown.join('\n');
}


function isDiscordMessage(doc: Document){
    // Checks whether the message has a few hallmarks of a Discord DOM, i.e.:
    // First child of body is an OL with the properties:
    // class="scrollInner-xxxxx", dataset-list-id="chat-messages", and an <li> child
    //
    // Should probably be made more robust in the future; could imagine this would catch Slack messages too... 

	if(doc.body?.firstChild?.nodeName != 'OL')
    {
		return false;
	}
    
    // Line above already ensures that <ol> exists
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const ol: HTMLElement = doc.body.firstElementChild! as HTMLElement;

    return (
			ol.dataset.listId == "chat-messages" && 
            /scrollerInner-.{6}/.test(ol.className) &&
            ol.firstElementChild?.nodeName == 'LI'
           )
}


function clipboardToDocument(clipboardData: DataTransfer): Document | undefined {
	const rawHTML: string | undefined = clipboardData.getData('text/html');
    
    if(!rawHTML){
        return;
    }

	const parser = new DOMParser();
	const messageDOM: Document = parser.parseFromString(rawHTML, 'text/html');

	return messageDOM;
}