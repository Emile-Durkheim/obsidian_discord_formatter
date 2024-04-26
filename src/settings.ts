/* 
This is in a different file than SettingsTab.ts because jest otherwise can't run tests:

FAIL  tests/Conversation.test.ts
  ● Test suite failed to run
TypeError: Class extends value undefined is not a constructor or null
> 21 | export class SettingsTab extends PluginSettingTab {
     |                                  ^

This error shouldn't be happening since we *are* technically mocking PluginSettingTab via jest.mock('obsidian')
in the test files, but alas, it acts like PluginSettingsTab doesn't exist. Couldn't find a way to fix it. And
since Jest doesn't need to know about PluginSettingsTab, and only really cares about the default config... I've
decided to go ahead and just refactor the settings out.
*/

export interface IDiscordFormatterSettings {
  dateFormat: string;
  showReplies: "off" | "shortened" | "full";
  showEdited: "off" | "text" | "tag";
  showSystemMessages: boolean;
}

export const DEFAULT_SETTINGS: IDiscordFormatterSettings = {
  dateFormat: "MM/dd/yyyy, HH:mm",
  showReplies: "full",
  showEdited: "text",
  showSystemMessages: false
};