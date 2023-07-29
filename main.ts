import { MarkdownView, Plugin } from 'obsidian';

import discordMessageToMarkdown from 'rsc/discordMessageToMarkdown';
import { log, writeStringToFile } from 'rsc/utils';

export const SETTINGS = {
	debug: true
}

export default class DiscordFormatter extends Plugin {
	settings = SETTINGS

	async onload() {
		this.addCommand({
			id: "run-unit-tests",
			name: "Debug: Run Unit Tests"
		})
		
		// Define behaviour on paste
		this.app.workspace.on('editor-paste', (event) => this.pasteDiscordMessageAsMarkdown(event))

		// Debug
		this.app.workspace.on('editor-paste', (clipboardEvent) => {writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'))});
	}


	onunload() {
		this.app.workspace.off('editor-paste', (event) => this.pasteDiscordMessageAsMarkdown(event));
		this.app.workspace.off('editor-paste', (clipboardEvent) => {writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'))});
	}


	pasteDiscordMessageAsMarkdown(event: ClipboardEvent){
		const discordMarkdown = discordMessageToMarkdown(event);
		log(discordMarkdown);
		
		if(typeof discordMarkdown == "string"){
			event.preventDefault();

			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if(view?.editor) view.editor.replaceSelection(discordMarkdown);
		}
	}
}

