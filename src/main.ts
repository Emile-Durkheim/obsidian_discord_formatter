import { MarkdownView, Plugin } from 'obsidian';

import DiscordConversation from 'src/DiscordConversation';
import { IDiscordFormatterSettings, SettingsTab, DEFAULT_SETTINGS } from './settings';


export default class DiscordFormatter extends Plugin {
	settings: IDiscordFormatterSettings
	pasteMessageHandler: (event: ClipboardEvent) => void;

	async onload() {
		await this.loadSettings();

		// Settings tab
		this.addSettingTab(new SettingsTab(this.app, this));
		
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

		// Return if no html in clipboard or no editor open => if no Discord message to paste
		if(!(rawHTML && view?.editor)){
			return;
		}
		

		const conversation = DiscordConversation.fromRawHTML(rawHTML, this.settings);
		if(conversation.messages.length == 0){
			return;
		}

		event.preventDefault();
		view.editor.replaceSelection(conversation.toMarkdown(this.settings));
	}
}

