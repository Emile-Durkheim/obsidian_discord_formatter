import { readFile } from 'fs/promises';

import Conversation from "../src/Conversation";
import { DEFAULT_SETTINGS, IDiscordFormatterSettings } from "../src/settings";


// Only E2E tests because cutting relevant HTML out of HTML files upon every Discord HTML update (which happens more often than one would wish) would be too cumbersome
describe("General tests with default settings", () => {
    test("SingleMessage with all TextRuns", async () => {
        const html = await readFile("tests/all_formatting.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(DEFAULT_SETTINGS)
        ).toBe(
            ">**Herr - 08/08/2023, 22:20**\n>normal *italics* **bold** <u>underline</u> ~~strikethrough~~\n>**HEADING 1**\n>**HEADING 2**\n>**HEADING 3**\n>>quote\n>>with multiple lines\n>🍋 <img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>\n>gap *(edited)*"
        )
    })


    test("SingleMessage with attachments", async () => {
        const html = await readFile("tests/attachments.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(DEFAULT_SETTINGS)
        ).toBe(
            ">**Herr - 08/22/2023, 00:34**\n>accompanying message text\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104103870516/Herr_portrait_of_weird_worm_person_69c468d8-c741-4728-96ab-b8016fff0a2d_1.png?ex=6536f4df&is=65247fdf&hm=084d2f551c30b88ae98b6f04e5ada374928958574c9c068dbd667f5fd0f93069&=&width=273&height=273)\n>![](https://media.discordapp.net/attachments/1138567305459142796/1143312104556875816/Herr_weird_creepy_worm_person_cd6e3e60-3e2a-4a11-b21e-d076f9c7317b.png?ex=6536f4df&is=65247fdf&hm=1a6b752c4a90d838cc96040c950df09403d44a7d51270f7f002ebacdfd852bc1&=&width=273&height=273)"
        )
    })
})


describe("Date formats", () => {
    test("Date format: 'DD'", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "dateFormat": "DD" })
        const html = await readFile("tests/date.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr - Aug 22, 2023**\n>date test"
        )
    }),

    test("Date format: ''", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "dateFormat": "" })
        const html = await readFile("tests/date.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>date test"
        )
    })
})


describe("SystemMessages", () => {
    test("Show SystemMessage: On", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showSystemMessages": true })
        const html = await readFile("tests/systemmessage.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**pringles**\n>Hard\n>\n>**System**\n>bird added fcbambi to the group.\n>\n>**bird**\n>@ratking not everyone is a narc"
        )
    }),

    test("Show SystemMessage: Off", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showSystemMessages": false })
        const html = await readFile("tests/systemmessage.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**pringles**\n>Hard\n>\n>**bird**\n>@ratking not everyone is a narc"
        )
    })
})



describe("Replies", () => {
    test("Show Replies: Full", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showReplies": "full" })
        const html = await readFile("tests/reply_shortening.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789 THIS MUST BE SHORTENED AWAY\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789 THIS MUST BE SHORTENED AWAY\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>helloworld\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>helloworld\n>reply"
        )
    }),

    test("Show Replies: Shorten", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showReplies": "shortened" })
        const html = await readFile("tests/reply_shortening.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789 THIS MUST BE SHORTENED AWAY\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789 ...\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>...\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>helloworld\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>...\n>reply"
        )
    }),

    test("Show Replies: Off", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showReplies": "off" })
        const html = await readFile("tests/reply_shortening.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789 THIS MUST BE SHORTENED AWAY\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789 THIS MUST BE SHORTENED AWAY\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>\n>123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>helloworld\n>\n>**Herr**\n>>**Herr:** 123456789 123456789 123456789 123456789 123456789 123456789 123456789<img src='https://cdn.discordapp.com/emojis/289470315942248448.webp?size=44&quality=lossless' style='height: var(--font-text-size)'>helloworld\n>reply"
        )
    })
})


describe("(edited) mark", () => {
    test("Copy (edited): Plain text", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showEdited": "text" })
        const html = await readFile("tests/edited.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>edited message *(edited)*\n>second message below so (edited) above gets copied"
        )
    }),

    test("Copy (edited): Tag", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showEdited": "tag" })
        const html = await readFile("tests/edited.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>edited message <i aria-label=\"Edited at \">(edited)</i>\n>second message below so (edited) above gets copied"
        )
    }),

    test("Copy (edited): Off", async () => {
        const settings: IDiscordFormatterSettings = Object.assign(DEFAULT_SETTINGS, { "showEdited": "off" })
        const html = await readFile("tests/edited.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(settings)
        ).toBe(
            ">**Herr**\n>edited message\n>second message below so (edited) above gets copied"
        )
    })
})



describe("Emoji reactions", () => {
    test("ignore emoji reactions", async () => {
        const html = await readFile("tests/reactions.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(DEFAULT_SETTINGS)
        ).toBe(
            ">**Herr**\n>message with reactions"
        )
    })
})


/** Sometimes, only the HTML container of a message will be copied, without its contents. 
 * This is expected, and shouldn't break the pasted markdown */
describe("Empty messages", () => {
    test("Ignore empty messages", async () => {
        const html = await readFile("tests/empty_message_error.html", "utf-8");

        expect(
            Conversation.fromRawHTML(html).toMarkdown(DEFAULT_SETTINGS)
        ).toBe(
            ">**Herr**\n>message with empty HTML containers before and after"
        )
    })
})