import DiscordFormatter from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface IDiscordFormatterSettings {
  dateFormat: string,
	showReplies: boolean,
  showEdited: "off" | "text" | "tag"
}


export const DEFAULT_SETTINGS: IDiscordFormatterSettings = {
  dateFormat: "MM/dd/yyyy, HH:mm",
	showReplies: false,
	showEdited: "text"
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
      .setName("Date format")
      .setDesc("The format the date/time of the message should be displayed in. (See www.foragoodstrftime.com)")
      .addText((textField) => {
        textField
          .setValue(this.plugin.settings.dateFormat)
          .onChange(async (value) => {
            this.plugin.settings.dateFormat = value;
            await this.plugin.saveSettings();
          })
      })

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
      .setName("Show (edited) tag")
      .setDesc("How to copy the *(edited)* tag at the end of an edited message.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("off", "Don't show")
          .addOption("text", "As *(edited)* text")
          .addOption("tag", "As HTML tag")
          .setValue(this.plugin.settings.showEdited)
          .onChange(async (value: "off" | "text" | "tag") => {
              this.plugin.settings.showEdited = value;
              await this.plugin.saveSettings();
          })
      })
  }
}