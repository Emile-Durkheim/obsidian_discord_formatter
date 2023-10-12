import DiscordFormatter from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface IDiscordFormatterSettings {
	showReplies: boolean,
	distinguishHeadings: boolean,
  showEdited: boolean,
}


export const DEFAULT_SETTINGS: IDiscordFormatterSettings = {
	showReplies: true,
	distinguishHeadings: false,
	showEdited: true
}


export class SettingsTab extends PluginSettingTab {
  plugin: DiscordFormatter;

  constructor(app: App, plugin: DiscordFormatter) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Show replies")
      .setDesc("If there's a message reply, paste the message that's been replied to.")
      .addToggle((toggle) => {
        toggle
            .setValue(this.plugin.settings.showReplies)
            .onChange(async (value) => {
                this.plugin.settings.showReplies = value;
                await this.plugin.saveSettings();
            })
      })
    
    
    new Setting(containerEl)
      .setName("Show (edited)")
      .setDesc("Copy the *(edited)* mark to Obsidian.")
      .addToggle((toggle) => {
        toggle
            .setValue(this.plugin.settings.showEdited)
            .onChange(async (value) => {
                this.plugin.settings.showEdited = value;
                await this.plugin.saveSettings();
            })
      })
  }
}