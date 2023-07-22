import { Plugin } from 'obsidian';
import discordMessageToMarkdown from 'discordMessageToMarkdown';

export const SETTINGS = {
	debug: true
}

export default class DiscordFormatter extends Plugin {
	settings = SETTINGS

	async onload() {
		// A test command
		this.addCommand({
			id: 'test-command',
			name: 'hello world',
			callback: () => {
				console.log("Test command");
			}
		})


		// Define behaviour on paste
		this.app.workspace.on('editor-paste', discordMessageToMarkdown);
		
		// Debug
		this.app.workspace.on('editor-paste', (clipboardEvent) => {console.log(clipboardEvent.clipboardData?.getData('text/html'))});
	}


	onunload() {
		this.app.workspace.off('editor-paste', discordMessageToMarkdown);
	}
}