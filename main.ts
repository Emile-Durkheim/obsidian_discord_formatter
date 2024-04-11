import { MarkdownView, Plugin } from 'obsidian';

import UnitTests from 'tests/UnitTests';
import { writeStringToFile } from 'rsc/utils';
import DiscordConversation from 'rsc/DiscordConversation';


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
		this.app.workspace.on('editor-paste', (event) => { this.pasteDiscordMessageAsMarkdown(event) })

		// Debug
		this.app.workspace.on('editor-paste', (clipboardEvent) => {
			console.log(clipboardEvent.clipboardData?.getData('text/html'));
			writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'));
		});
	}


	onunload() {
		this.app.workspace.off('editor-paste', (event) => { this.pasteDiscordMessageAsMarkdown(event) })

		// Debug
		this.app.workspace.off('editor-paste', (clipboardEvent) => {
			console.log(clipboardEvent.clipboardData?.getData('text/html'));
			writeStringToFile(clipboardEvent.clipboardData?.getData('text/html'));
		});
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}


	pasteDiscordMessageAsMarkdown(event: ClipboardEvent){
		const rawHTML = event.clipboardData?.getData('text/html');
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);

		if(!(rawHTML && view?.editor)){
			return;
		}
		
		const conversation = DiscordConversation.fromRawHTML(rawHTML);
		if(conversation.messages.length == 0){
			return;
		}

		event.preventDefault();
		view.editor.replaceSelection(conversation.toMarkdown());
	}
}

