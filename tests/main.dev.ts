import * as fs from 'fs';
import DiscordFormatter from "src/main";


const TARGET_DIR = "";  // Path that pasted HTML should be saved to; MUST have a trailing slash


/** Extension of default plugin that saves all pasted HTML to a file */
export default class DiscordFormatterDev extends DiscordFormatter {
	writeClipboardHandler: (event: ClipboardEvent) => void;

	async onload() {
		this.init();

		// Dev setup => Pasted Discord Message gets written to directory of choice
		this.writeClipboardHandler = this.writeClipboardToFile.bind(this);
		this.app.workspace.on('editor-paste', this.writeClipboardHandler);
	}


	onunload() {
		this.app.workspace.off('editor-paste', this.pasteMessageHandler);

		// Dev setup
		this.app.workspace.off('editor-paste', this.writeClipboardHandler);
	}


	private writeClipboardToFile(event: ClipboardEvent){
		let string = event.clipboardData?.getData('text/html');
	
		if(!string){
			string = event.clipboardData?.getData('text');
		}

		if(!string){
			return;
		}
		
		// Save document to a file
		for(let i=0; i < 100; i++){
			const path = `${TARGET_DIR}${i}.html`;
			if(!fs.existsSync(path)){
				fs.writeFile(path, string, () => {});
				console.log(`Wrote to ${path}`)
				return;
			}
		}
	}
}