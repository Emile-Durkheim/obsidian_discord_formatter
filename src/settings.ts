import DiscordFormatter from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";


export interface IDiscordFormatterSettings {
  dateFormat: string,
	showReplies: "off" | "shortened" | "full",
  showEdited: "off" | "text" | "tag",
  showSystemMessages: boolean
}


export const DEFAULT_SETTINGS: IDiscordFormatterSettings = {
  dateFormat: "MM/dd/yyyy, HH:mm",
	showReplies: "full",
	showEdited: "text",
  showSystemMessages: false
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
      .setName("Copy (edited) tag")
      .setDesc("How to copy the *(edited)* tag at the end of an edited message.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("off", "Don't copy")
          .addOption("text", "Plain text")
          .addOption("tag", "Text with editing date on hover")
          .setValue(this.plugin.settings.showEdited)
          .onChange(async (value: IDiscordFormatterSettings["showEdited"]) => {
              this.plugin.settings.showEdited = value;
              await this.plugin.saveSettings();
          })
      })

    new Setting(containerElement)
      .setName("Copy reply")
      .setDesc("How to copy a message that's being replied to.")
      .addDropdown((dropdown) => {
        dropdown
          .addOption("off", "Don't copy")
          .addOption("shortened", "Shorten reply")
          .addOption("full", "Full reply")
          .setValue(this.plugin.settings.showReplies)
          .onChange(async (value: IDiscordFormatterSettings["showReplies"]) => {
              this.plugin.settings.showReplies = value;
              await this.plugin.saveSettings();
          })
      })

    new Setting(containerElement)
      .setName("Copy system messages")
      .setDesc('Copy messages like "User started call", "User joined server", ...')
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.showSystemMessages)
          .onChange(async (value: IDiscordFormatterSettings["showSystemMessages"]) => {
              this.plugin.settings.showSystemMessages = value;
              await this.plugin.saveSettings();
          })
      })
  }
}