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
The plugin relies on HTML that Discord **usually** serves when you copy a message from the Desktop Client. However, **Discord does not do this reliably**. In 10% of cases, your clipboard contains only raw text, which I can't parse as well as the HTML.

**Fix:** Select the message in a sligthly different way. With profile picture, without profile picture; with emoji reaction, without emoji reaction... I'm not sure what causes the HTML not to be copied, but just going about the selection slightly differently will eventually do the trick

This is my first Obsidian plugin and my first TypeScript project, so be kind. I know some portions of the code are messy and in need of refactoring.

### Installation

- Run `git clone https://github.com/Emile-Durkheim/obsidian_discord_formatter` in /yourVault/.obsidian/plugins
- Run `npm install` in /yourVault/.obsidian/plugins/obsidian_discord_formatter
- Open the "Community Plugins" tab in your Vault's settings and enable the plugin there.
