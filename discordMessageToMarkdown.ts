import { SETTINGS } from 'main';

export default function discordMessageToMarkdown(event: ClipboardEvent): string | undefined {
    // Check that there is data in clipboardEvent
	if (!event.clipboardData){
		log("clipboardData empty")
		return;
	}

    const messageDOM: Document | null = clipboardToDOM(event.clipboardData);
    if(messageDOM === null){
        log("No HTML in paste");
    }

    console.log(messageDOM);
}


function clipboardToDOM(clipboardData: DataTransfer): Document | null {
	const rawHTML: string | undefined = clipboardData.getData('text/html');
    
    // Ensure rawHTML is defined
    if(!rawHTML){
        return null;
    }

	const parser = new DOMParser();

	const messageDOM: Document = parser.parseFromString(rawHTML, 'text/html');

	return messageDOM;
}


function log(object: string | Error): void{
	if(SETTINGS.debug){
		console.log(object);
	}
}