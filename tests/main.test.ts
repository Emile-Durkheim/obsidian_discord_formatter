// This file is duplicated code from main.ts; not the ideal solution I'm aware

import { MarkdownView, Plugin } from "obsidian";
import DiscordConversation from "src/DiscordConversation";
import { IDiscordFormatterSettings, SettingsTab, DEFAULT_SETTINGS } from 'src/settings';


// Test
import Tests from "./tests";
import * as fs from 'fs';


export default class DiscordFormatter extends Plugin {
	settings: IDiscordFormatterSettings
	pasteMessageHandler: (event: ClipboardEvent) => void;
	writeClipboardHandler: (event: ClipboardEvent) => void;  // Test

	async onload() {
		await this.loadSettings();
        
		// Settings tab
		this.addSettingTab(new SettingsTab(this.app, this));

		// Define behaviour on paste
		this.pasteMessageHandler = this.pasteMessage.bind(this);
		this.app.workspace.on('editor-paste', this.pasteMessageHandler);



		// Test
		this.writeClipboardHandler = this.writeClipboardToFile.bind(this);
		this.app.workspace.on('editor-paste', this.writeClipboardHandler);

		this.addCommand({
			id: "run-unit-tests",
			name: "Debug: Run Unit Tests",
			callback: () => { Tests.run(this.settings) }
		})		
	}


	onunload() {
		this.app.workspace.off('editor-paste', this.pasteMessageHandler);

		this.app.workspace.off('editor-paste', this.writeClipboardHandler);  // Test
	}


	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.saveData(this.settings);
	}



	pasteMessage(event: ClipboardEvent){
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if(!view?.editor){
			return;
		}
		
		
		let conversation: DiscordConversation | undefined = undefined;
		if(event.clipboardData?.getData('text/html')){
			const rawHTML = event.clipboardData?.getData('text/html');
			conversation = DiscordConversation.fromRawHTML(rawHTML, this.settings);
		}

		if(conversation && conversation?.messages.length > 0){
			event.preventDefault();
			view.editor.replaceSelection(conversation.toMarkdown(this.settings));
		}
	}


	private writeClipboardToFile(event: ClipboardEvent){
		// Test func
		let string = event.clipboardData?.getData('text/html');
	
		if(!string){
			string = event.clipboardData?.getData('text');
		}

		if(!string){
			return;
		}
		
		// Save document to a file
		for(let i=0; i < 30; i++){
			if(!fs.existsSync(`${i}.html`)){
				console.log(`Wrote to ~/${i}.html`)
				fs.writeFile(`${i}.html`, string, () => {});
				return;
			}
		}
	}
}