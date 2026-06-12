import {
	Editor,
	MarkdownView,
	Plugin,
	TFile,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from './settings';
import { parseSingleReference } from './core/parser';
import { referenceToMarkdown } from './core/converter';
import aliasesData from '../data/aliases.json';

export default class MyPlugin extends Plugin {
	settings!: MyPluginSettings;
	private debounceTimer: number | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('editor-change', (editor: Editor, info: MarkdownView | TFile) => {
				if (!(info instanceof MarkdownView)) return;
				this.handleEditorChange(editor);
			})
		);
	}

	onunload() {
		if (this.debounceTimer) {
			window.clearTimeout(this.debounceTimer);
		}
	}

	private handleEditorChange(editor: Editor) {
		if (!this.settings.enabled) return;

		if (this.debounceTimer) {
			window.clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = window.setTimeout(() => {
			this.convertReferenceInCurrentLine(editor);
		}, this.settings.debounceMs);
	}

	private convertReferenceInCurrentLine(editor: Editor) {
		const cursor = editor.getCursor();
		const lineText = editor.getLine(cursor.line);

		// Use the Japanese aliases for now as per data/aliases.json structure
		const aliases = aliasesData.ja;

		// Phase 1: Only convert the first reference in the current line
		// To allow for multiple references in the future, we could loop.
		// But for now, we follow Phase 1 requirement.

		// We need to scan the line. parseSingleReference currently expects to start at the book name.
		// So we need to find where the book name might start.

		// Simple approach for Phase 1: Try to parse starting from each position in the line
		// or use a more efficient way to find potential book names.
		for (let i = 0; i < lineText.length; i++) {
			const ref = parseSingleReference(lineText.substring(i), aliases, i);
			if (ref) {
				const markdownLink = referenceToMarkdown(ref, this.settings);

				// Replace the original text with the markdown link
				const from = { line: cursor.line, ch: ref.startIndex };
				const to = { line: cursor.line, ch: ref.endIndex };

				editor.replaceRange(markdownLink, from, to);

				// For Phase 1, we stop after the first conversion
				break;
			}
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
