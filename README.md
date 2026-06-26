# NWT Linker

NWT Linker is an Obsidian community plugin that turns Bible references into links that open the New World Translation in JW Library or on jw.org.

Type a Bible book name and chapter/verse reference in a note, and the plugin converts it into a link that opens the corresponding passage in the New World Translation.

## Features

- Automatically links Bible references as you type
- Generates jw.org links for the New World Translation
- Opens JW Library when it is available, otherwise falls back to jw.org
- Supports configurable book name aliases
- Add, edit, delete, import, and export aliases as JSON
- Lets you configure locale, publication, and the URL template
- Uses a short delay after typing stops, so it stays out of the way while you edit

## Usage

Enter a Bible reference like this:

```text
Titus1:14
```

It will be converted into a link such as:

```md
[Titus 1:14](https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=56001014&pub=nwtsty)
```

It also works when there is a space between the book name and the chapter number:

```text
Titus 1:14
```

## Book name aliases

You can define aliases for each Bible book.

For example, you can register alternate names such as:

- `Titus`
- `Tit`
- `John`
- `Jn`

This lets you convert references using the shorthand you already prefer.

From **Book name aliases** in the settings, you can:

- Add aliases
- Change the associated book number for an existing alias
- Delete aliases
- Import or export aliases as JSON
- Reset to the default Japanese aliases

## Settings

You can adjust the following options in the settings screen:

- Enable or disable conversion
- Delay before conversion after typing stops
- Locale for the publication to open
- Publication to open
- URL template

The default values should work fine for Japanese usage.

## Installation

### Manual installation

1. Open the GitHub [Releases page](https://github.com/jwnetdotwork/nwt-linker/releases) and download `main.js` and `manifest.json` from the latest release.
2. Place those two files in the following folder in your vault:

```text
<Vault>/.obsidian/plugins/obsidian-nwt-linker/
```

3. Reload Obsidian and enable NWT Linker from **Settings → Community plugins**.

## Notes

- This is an Obsidian community plugin.
- It works offline by default.
- It follows jw.org usage rules and does not scrape content.
- Reference conversion happens entirely inside your notes.
