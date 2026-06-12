import {
	Editor,
	MarkdownFileInfo,
	MarkdownView,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from './settings';
import { convertReferenceInCurrentLine } from './core/editor-converter';
import aliasesData from '../data/aliases.json';

export default class MyPlugin extends Plugin {
	settings!: MyPluginSettings;
	private debounceTimer: number | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('editor-change', (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
				if (!(info instanceof MarkdownView)) return;
				this.handleEditorChange(editor);
			})
		);
	}

	onunload() {
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
		}
	}

	private handleEditorChange(editor: Editor) {
		if (!this.settings.enabled) return;

		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
		}

		this.debounceTimer = window.setTimeout(() => {
			this.debounceTimer = null;
			convertReferenceInCurrentLine(editor, this.settings.aliases, this.settings);
		}, this.settings.debounceMs);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);

		if (!this.settings.aliases || Object.keys(this.settings.aliases).length === 0) {
			this.settings.aliases = { ...aliasesData.ja };
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
