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
import { ensureDefaultAliases } from './core/settings-utils';

export default class MyPlugin extends Plugin {
	settings!: MyPluginSettings;
	private debounceTimer: number | null = null;
	private isComposing = false;
	private composingEditor: Editor | null = null;
	private lastCompositionEndAt = 0;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerEvent(
			this.app.workspace.on('editor-change', (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
				if (!(info instanceof MarkdownView)) return;
				if (this.isComposing) {
					this.composingEditor = editor;
				}
				this.handleEditorChange(editor);
			})
		);

		this.registerDomEvent(window, 'compositionstart', () => {
			this.isComposing = true;
			const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
			const activeEditor = activeView?.editor;

			if (activeEditor && this.debounceTimer !== null && this.composingEditor === activeEditor) {
				window.clearTimeout(this.debounceTimer);
				this.debounceTimer = null;
				this.composingEditor = null;
			}

			if (activeEditor) {
				this.composingEditor = activeEditor;
			}
		});

		this.registerDomEvent(window, 'compositionupdate', () => {
			this.isComposing = true;
		});

		this.registerDomEvent(window, 'compositionend', () => {
			this.isComposing = false;
			this.lastCompositionEndAt = Date.now();

			// After composition ends, trigger a normal debounce
			if (this.composingEditor) {
				this.handleEditorChange(this.composingEditor);
				this.composingEditor = null;
			}
		});
	}

	onunload() {
		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
		}
	}

	private handleEditorChange(editor: Editor) {
		if (!this.settings.enabled || this.isComposing) return;

		if (this.debounceTimer !== null) {
			window.clearTimeout(this.debounceTimer);
			this.debounceTimer = null;
			this.composingEditor = null;
		}

		this.debounceTimer = window.setTimeout(() => {
			this.debounceTimer = null;

			// Final check before conversion
			if (this.isComposing) return;

			const now = Date.now();
			if (now - this.lastCompositionEndAt < 200) {
				// Re-schedule if within safety buffer
				this.handleEditorChange(editor);
				return;
			}

			convertReferenceInCurrentLine(editor, this.settings.aliases, this.settings);
		}, this.settings.debounceMs);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);

		if (ensureDefaultAliases(this.settings)) {
			await this.saveSettings();
		}
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
