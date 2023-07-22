import { log, writeDocumentToFile } from 'utils';

export default function discordMessageToMarkdown(event: ClipboardEvent): string | undefined {
    // Check that there is data in clipboardEvent
	if (!event.clipboardData){
		log("clipboardData empty")
		return;
	}
    
    // Parse clipboardEvent into a Document if possible
    const messageDOM: Document | null = clipboardToDocument(event.clipboardData);
    if(messageDOM === null){
        log("No HTML in paste");
		return;
    }

    // Ensure it's a Discord message
    log('isDiscordMessage: ', isDiscordMessage(messageDOM));
    if(!isDiscordMessage(messageDOM)){
        return;
    }


}


function clipboardToDocument(clipboardData: DataTransfer): Document | null {
	const rawHTML: string | undefined = clipboardData.getData('text/html');
    
    // Ensure rawHTML is defined
    if(!rawHTML){
        return null;
    }

	const parser = new DOMParser();

	const messageDOM: Document = parser.parseFromString(rawHTML, 'text/html');


	return messageDOM;
}


function isDiscordMessage(doc: Document){
	if(doc.body?.firstChild?.nodeName != 'OL'){
		return false;
	}
    
    // Line above already ensures that <ol> exists
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const ol: HTMLElement = doc.body.firstElementChild! as HTMLElement;

	return (
			ol.dataset.listId == "chat-messages" && 
            /scrollerInner/.test(ol.className) &&
            ol.firstElementChild?.nodeName == 'LI'
	);
}