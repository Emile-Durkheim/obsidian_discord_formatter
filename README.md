# Discord Message Formatter for Obsidian.md
Ever pasted a Discord message into Obsidian and had it get all scrambled? Well, fret no more! This plugin is for you!

### Usage
Just CTRL+C from the desktop Discord client and CTRL+V into Obsidian! All the formatting will be done for you automatically, leaving you with less hassle adding/deleting characters and more time to focus on your notes :)

### Features
- Paste usernames, message times, message texts directly into your notes
- Paste whole conversations rather than just single messages
- Easy to use with just CTRL+C and CTRL+V
- Convert all Discord markdown to Obsidian markdown (underline, bold, quotes, strikethrough, etc.)
- Embed attachments/website in Obsidian

### Limitations
The plugin relies on HTML that Discord **usually** serves when you copy a message from the Desktop Client. However, **Discord does not do this reliably**. In 10% of cases, your clipboard contains only raw text, which the plugin can't parse.

**Fix:** Select the message in a sligthly different way; try to select the *whole* message, starting your cursor above the start of the message/row of messages and end right below the end of the last message. It should work this way. 

**Desktop only, CTRL+C only**: If you try to copy the text out of anything but the Desktop client using the CTRL+C shortcut, your clipboard will only contain raw text which the plugin cannot parse.

### Installation

- Run `git clone https://github.com/Emile-Durkheim/obsidian_discord_formatter` in /yourVault/.obsidian/plugins
- Run `npm install` in /yourVault/.obsidian/plugins/obsidian_discord_formatter
- Open the "Community Plugins" tab in your Vault's settings and enable the plugin there.
