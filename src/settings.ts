import DiscordFormatter from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface IDiscordFormatterSettings {
	showReplies: boolean,
  showEdited: boolean,
}


export const DEFAULT_SETTINGS: IDiscordFormatterSettings = {
	showReplies: false,
	showEdited: true
}


export class SettingsTab extends PluginSettingTab {
  plugin: DiscordFormatter;

  constructor(app: App, plugin: DiscordFormatter) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl: containerElement } = this;

    containerElement.empty();

    new Setting(containerElement)
      .setName("Show replies")
      .setDesc("If the message you're copying is a reply to another message, also copy the message it's a reply to.")
      .addToggle((toggle) => {
        toggle
            .setValue(this.plugin.settings.showReplies)
            .onChange(async (value) => {
                this.plugin.settings.showReplies = value;
                await this.plugin.saveSettings();
            })
      })
    
    
    new Setting(containerElement)
      .setName("Show (edited)")
      .setDesc("Copy the *(edited)* mark at the end of an edited message.")
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