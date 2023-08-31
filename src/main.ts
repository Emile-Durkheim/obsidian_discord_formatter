import { MarkdownView, Plugin } from 'obsidian';

import DiscordConversation from 'src/DiscordConversation';


// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DiscordFormatterSettings {}

const DEFAULT_SETTINGS: DiscordFormatterSettings = {}


export default class DiscordFormatter extends Plugin {
	settings: DiscordFormatterSettings
	pasteMessageHandler: (event: ClipboardEvent) => void;

	async onload() {
		await this.loadSettings();
		
		// Define behaviour on paste
		this.pasteMessageHandler = this.pasteMessage.bind(this);
		this.app.workspace.on('editor-paste', this.pasteMessageHandler)
	}


	onunload() {
		this.app.workspace.off('editor-paste', this.pasteMessageHandler)
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.saveData(this.settings);
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
