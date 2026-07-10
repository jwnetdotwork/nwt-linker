# NWT Linker

NWT Linker is an Obsidian community plugin that turns Bible references into links that open the New World Translation in JW Library or on jw.org.

Type a Bible book name and chapter/verse reference in a note, and the plugin converts it into a link that opens the corresponding passage in the New World Translation.

## Features

- Automatically links Bible references as you type
- Generates jw.org links for the New World Translation
- Opens JW Library when it is available, otherwise falls back to jw.org
- Supports configurable book name aliases
- Loads book name aliases from WT Locale presets
- Add, edit, delete, import, and export aliases as JSON
- Tracks whether aliases are loaded from a preset or custom-edited
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

You can define aliases for each Bible book. Aliases are loaded from locale presets based on your **WT Locale** setting.

For example, the Japanese (`J`) preset includes aliases such as:

- `創世記`, `創` → Genesis
- `詩編`, `詩` → Psalms
- `テトス`, `テト` → Titus
- `ヨハネ`, `ヨハ` → John

This lets you convert references using the shorthand you already prefer.

From **Book name aliases** in the settings, you can:

- Add aliases
- Change the associated book number for an existing alias
- Delete aliases
- Import or export aliases as JSON
- **Load aliases for current WT Locale**: Replace the current aliases with the preset that matches your WT Locale setting (e.g. `J — 日本語`).

### Custom aliases and reloading presets

When you add, edit, delete, or import aliases, the alias list switches to **custom** state. The settings screen shows whether the current list is loaded from a preset or custom-edited.

If you are in custom state and choose **Load aliases for current WT Locale**, a confirmation dialog appears so you do not accidentally overwrite your custom aliases. If the preset for the current locale is already loaded, it reloads immediately.

### Requesting a new locale preset

If you need support for a WT locale that is not yet included, please open an issue or pull request on [GitHub](https://github.com/jwnetdotwork/nwt-linker).

## Settings

You can adjust the following options in the settings screen:

- Enable or disable conversion
- Delay before conversion after typing stops
- Locale for the publication to open
- Publication to open
- URL template

The default values should work fine for Japanese usage.

## Installation

### From Community Plugins

1. In Obsidian, open **Settings → Community plugins**.
2. Turn on **Community plugins** if you haven't already.
3. Search for **NWT Linker**.
4. Select **Install**, then **Enable**.

### Manual installation

1. Open the GitHub [Releases page](https://github.com/jwnetdotwork/nwt-linker/releases) and download `main.js` and `manifest.json` from the latest release.
2. Place those two files in the following folder in your vault:

```text
<Vault>/.obsidian/plugins/nwt-linker/
```

3. Reload Obsidian and enable NWT Linker from **Settings → Community plugins**.

## Network disclosure

This plugin does not make any network requests. All scripture reference conversion happens locally inside your notes. Clicking a generated link opens jw.org in your default browser, which is a network action initiated by you, not the plugin.

## Notes

- Supported WT Locale presets:
  - Japanese (`J`)
  - English (`E`)
  - Spanish (`S`)
  - Chinese Mandarin Traditional (`CH`)
  - Chinese Mandarin Simplified (`CHS`)
  - Portuguese Brazil (`T`)
  - French (`F`)
  - German (`X`)
  - Korean (`KO`)
  - Italian (`I`)
  - Russian (`U`)
- If no preset exists for the configured WT Locale, the plugin falls back to the Japanese (`J`) preset on first setup.
- This is an Obsidian community plugin.
- It works offline by default.
- It follows jw.org usage rules and does not scrape content.
- Reference conversion happens entirely inside your notes.
- How to find your WT Locale
  - Create a share link in your language and look for the `wtlocale=` parameter. The uppercase letters after it are your WT Locale.
  - Example: In `https://www.jw.org/finder?srcid=jwlshare&wtlocale=E&prefer=lang&bible=40024045&pub=nwtsty`, the WT Locale is `E`.
