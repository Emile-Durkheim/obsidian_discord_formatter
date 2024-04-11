import { MarkdownView, Plugin } from 'obsidian';

import UnitTests from 'tests/UnitTests';
import { writeClipboardToFile } from 'src/utils';
import DiscordConversation from 'src/DiscordConversation';


interface DiscordFormatterSettings {
	debug: boolean
}

const DEFAULT_SETTINGS: DiscordFormatterSettings = {
	debug: true
}


export default class DiscordFormatter extends Plugin {
	settings: DiscordFormatterSettings
	pasteMessageHandler: (event: ClipboardEvent) => void;

	async onload() {
		await this.loadSettings();
		
		this.addCommand({
			id: "run-unit-tests",
			name: "Debug: Run Unit Tests",
			callback: () => { UnitTests.run() }
		})
		
		// Define behaviour on paste
		this.pasteMessageHandler = this.pasteMessage.bind(this);
		this.app.workspace.on('editor-paste', this.pasteMessageHandler)

		// Debug
		this.app.workspace.on('editor-paste', writeClipboardToFile);
	}


	onunload() {
		this.app.workspace.off('editor-paste', this.pasteMessageHandler)

		// Debug
		this.app.workspace.off('editor-paste', writeClipboardToFile);
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}


	pasteMessage(event: ClipboardEvent){
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

