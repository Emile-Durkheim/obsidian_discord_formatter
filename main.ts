import { MarkdownView, Plugin } from 'obsidian';

import UnitTests from 'tests/UnitTests';
// import discordMessageToMarkdown from 'rsc/discordMessageToMarkdown';
import { writeStringToFile } from 'rsc/utils';


interface DiscordFormatterSettings {
	debug: boolean
}

const DEFAULT_SETTINGS: DiscordFormatterSettings = {
	debug: true
}


export default class DiscordFormatter extends Plugin {
	settings: DiscordFormatterSettings

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: "run-unit-tests",
			name: "Debug: Run Unit Tests",
			callback: () => { UnitTests.run() }
		})
		
		// Define behaviour on paste
		this.app.workspace.on('editor-paste', (event) => {})

		// Debug
		this.app.workspace.on('editor-paste', (clipboardEvent) => {
			console.log(clipboardEvent.clipboardData?.getData('text/html'));
			writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'));
		});
	}


	onunload() {
		this.app.workspace.off('editor-paste', (event) => {});
		this.app.workspace.off('editor-paste', (clipboardEvent) => {
			console.log(clipboardEvent.clipboardData?.getData('text/html'));
			writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'));
		});
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}


	// pasteDiscordMessageAsMarkdown(event: ClipboardEvent){
	// 	const discordMarkdown = discordMessageToMarkdown(event);
	// 	console.log(discordMarkdown);
		
	// 	if(typeof discordMarkdown == "string"){
	// 		event.preventDefault();

	// 		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
	// 		if(view?.editor) view.editor.replaceSelection(discordMarkdown);
	// 	}
	// }
}

