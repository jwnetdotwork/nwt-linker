import { App, Modal, Notice, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';
import { PluginSettings } from './core/types';
import { DEFAULT_SETTINGS } from './core/constants';
import { getPreset } from './core/aliases-presets';

export { DEFAULT_SETTINGS };
export type MyPluginSettings = PluginSettings;

class ConfirmModal extends Modal {
	constructor(
		app: App,
		private message: string,
		private onConfirm: () => void,
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl('h3', { text: 'Confirm' });
		contentEl.createEl('p', { text: this.message });

		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = 'flex';
		buttonContainer.style.justifyContent = 'flex-end';
		buttonContainer.style.gap = '10px';
		buttonContainer.style.marginTop = '20px';

		const cancelBtn = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelBtn.onclick = () => this.close();

		const confirmBtn = buttonContainer.createEl('button', { text: 'Confirm', cls: 'mod-warning' });
		confirmBtn.onclick = () => {
			this.onConfirm();
			this.close();
		};
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;
	private saveDebounceTimer: number | null = null;
	private jsonTextArea: HTMLTextAreaElement | null = null;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	private updateJsonTextarea() {
		if (this.jsonTextArea) {
			this.jsonTextArea.value = JSON.stringify(this.plugin.settings.aliases, null, 2);
		}
	}

	private async debouncedSave() {
		if (this.saveDebounceTimer !== null) {
			window.clearTimeout(this.saveDebounceTimer);
		}
		this.saveDebounceTimer = window.setTimeout(async () => {
			this.saveDebounceTimer = null;
			await this.plugin.saveSettings();
			this.updateJsonTextarea();
		}, 500);
	}

	display(): void {
		const { containerEl } = this;
		const scrollTop = containerEl.scrollTop;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Enabled')
			.setDesc('Enable automatic scripture link conversion')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange((value) => {
						void (async () => {
							const prev = this.plugin.settings.enabled;
							try {
								this.plugin.settings.enabled = value;
								await this.plugin.saveSettings();
							} catch (error) {
								this.plugin.settings.enabled = prev;
								toggle.setValue(prev);
								console.error(error);
								new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
							}
						})();
					}),
			);

		new Setting(containerEl)
			.setName('Debounce time (ms)')
			.setDesc('Wait time after typing stops before converting links (min 100ms)')
			.addText((text) =>
				text
					.setPlaceholder('1000')
					.setValue(this.plugin.settings.debounceMs.toString())
					.onChange((value) => {
						void (async () => {
							const numValue = parseInt(value, 10);
							if (isNaN(numValue) || numValue < 100) {
								return;
							}

							const prev = this.plugin.settings.debounceMs;
							try {
								this.plugin.settings.debounceMs = numValue;
								await this.plugin.saveSettings();
							} catch (error) {
								this.plugin.settings.debounceMs = prev;
								text.setValue(prev.toString());
								console.error(error);
								new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
							}
						})();
					}),
			);

		let updateLoadBtnLabel: (() => void) | null = null;

		new Setting(containerEl)
			.setName('WT Locale')
			.setDesc('Locale for jw.org links (e.g., J for Japanese)')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.wtlocale)
					.onChange((value) => {
						void (async () => {
							const normalized = value.trim().toUpperCase();
							const prev = this.plugin.settings.wtlocale;
							try {
								this.plugin.settings.wtlocale = normalized;
								await this.plugin.saveSettings();
								if (updateLoadBtnLabel) {
									updateLoadBtnLabel();
								}
							} catch (error) {
								this.plugin.settings.wtlocale = prev;
								text.setValue(prev);
								console.error(error);
								new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
							}
						})();
					}),
			);

		new Setting(containerEl)
			.setName('Publication')
			.setDesc('Publication code for links (e.g., nwtsty)')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.pub)
					.onChange((value) => {
						void (async () => {
							const prev = this.plugin.settings.pub;
							try {
								this.plugin.settings.pub = value;
								await this.plugin.saveSettings();
							} catch (error) {
								this.plugin.settings.pub = prev;
								text.setValue(prev);
								console.error(error);
								new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
							}
						})();
					}),
			);

		new Setting(containerEl)
			.setName('URL Template')
			.setDesc('Template for jw.org links. Must contain {{bible}}.')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.urlTemplate)
					.onChange((value) => {
						void (async () => {
							// Validation
							if (!value.includes('{{bible}}')) {
								return;
							}
							try {
								new URL(value.replace('{{bible}}', '01001001').replace('{{wtlocale}}', 'J').replace('{{pub}}', 'nwtsty'));
							} catch {
								return;
							}

							const prev = this.plugin.settings.urlTemplate;
							try {
								this.plugin.settings.urlTemplate = value;
								await this.plugin.saveSettings();
							} catch (error) {
								this.plugin.settings.urlTemplate = prev;
								text.setValue(prev);
								console.error(error);
								new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
							}
						})();
					}),
			);

		containerEl.createEl('h3', { text: 'Book name aliases' });

		// Preset Status Display under the Book name aliases header
		const statusEl = containerEl.createEl('p');
		statusEl.addClass('setting-item-description');
		const updateStatusText = () => {
			const loadedPreset = this.plugin.settings.loadedPreset;
			if (loadedPreset !== null) {
				const preset = getPreset(loadedPreset);
				const presetName = preset ? preset.name : loadedPreset;
				statusEl.setText(`Currently loaded: ${presetName} (${loadedPreset})`);
			} else {
				statusEl.setText('Currently: custom (manually edited)');
			}
		};
		updateStatusText();

		// Add new alias
		const addAliasSetting = new Setting(containerEl)
			.setName('Add new alias')
			.setDesc('Add a new book name alias and its corresponding book number (1-66).');

		let newAlias = '';
		let newBookNum = 1;

		addAliasSetting.addText((text) =>
			text
				.setPlaceholder('Alias (e.g. Gen)')
				.onChange((value) => (newAlias = value.trim())),
		);
		addAliasSetting.addText((text) =>
			text
				.setPlaceholder('Book # (1-66)')
				.onChange((value) => {
					const num = parseInt(value, 10);
					if (!isNaN(num) && num >= 1 && num <= 66) {
						newBookNum = num;
					}
				}),
		);
		addAliasSetting.addButton((btn) =>
			btn
				.setButtonText('Add')
				.setCta()
				.onClick(() => {
					void (async () => {
						if (!newAlias) {
							new Notice('Alias cannot be empty');
							return;
						}
						if (this.plugin.settings.aliases[newAlias]) {
							new Notice('Alias already exists');
							return;
						}
						this.plugin.settings.aliases[newAlias] = newBookNum;
						this.plugin.settings.loadedPreset = null; // Set custom status
						await this.plugin.saveSettings();
						this.display();
					})();
				}),
		);

		// Alias list
		const aliasListContainer = containerEl.createDiv('alias-list-container');
		aliasListContainer.style.marginTop = '20px';

		const aliases = Object.entries(this.plugin.settings.aliases).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));

		for (const [alias, bookNum] of aliases) {
			const s = new Setting(aliasListContainer);
			s.setName(alias);
			s.setDesc(`Book number: ${bookNum}`);

			s.addText((text) => {
				text.setPlaceholder('New book #')
					.setValue(bookNum.toString())
					.onChange((value) => {
						const num = parseInt(value, 10);
						if (!isNaN(num) && num >= 1 && num <= 66) {
							this.plugin.settings.aliases[alias] = num;
							this.plugin.settings.loadedPreset = null; // Set custom status
							void this.debouncedSave();
							// Update status text in real time
							updateStatusText();
						}
					});
				text.inputEl.style.width = '60px';
			});

			s.addButton((btn) =>
				btn
					.setIcon('trash')
					.setWarning()
					.setTooltip('Delete alias')
					.onClick(() => {
						void (async () => {
							delete this.plugin.settings.aliases[alias];
							this.plugin.settings.loadedPreset = null; // Set custom status
							await this.plugin.saveSettings();
							this.display();
						})();
					}),
			);
		}

		// JSON Import/Export
		containerEl.createEl('h3', { text: 'Import/export aliases' });
		const jsonDesc = containerEl.createEl('p', {
			text: 'Import or export your aliases as JSON. When importing, it will overwrite your current aliases.',
		});
		jsonDesc.addClass('setting-item-description');

		this.jsonTextArea = containerEl.createEl('textarea', {
			cls: 'alias-json-textarea',
		});
		this.jsonTextArea.style.width = '100%';
		this.jsonTextArea.style.height = '150px';
		this.jsonTextArea.value = JSON.stringify(this.plugin.settings.aliases, null, 2);

		const buttonContainer = containerEl.createDiv();
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '10px';
		buttonContainer.style.marginTop = '10px';

		const importBtn = buttonContainer.createEl('button', { text: 'Import JSON' });
		importBtn.addEventListener('click', () => {
			void (async () => {
				try {
					const jsonValue = this.jsonTextArea?.value ?? '{}';
					const imported = JSON.parse(jsonValue) as Record<string, unknown>;
					if (typeof imported !== 'object' || imported === null) {
						throw new Error('Invalid JSON format: must be an object');
					}
					// Basic validation
					for (const [key, value] of Object.entries(imported)) {
						if (typeof value !== 'number' || value < 1 || value > 66) {
							throw new Error(`Invalid entry: ${key}: ${String(value)}. Book number must be 1-66.`);
						}
					}
					this.plugin.settings.aliases = imported as Record<string, number>;
					this.plugin.settings.loadedPreset = null; // Set custom status
					await this.plugin.saveSettings();
					new Notice('Aliases imported successfully');
					this.display();
				} catch (e) {
					new Notice('Failed to import JSON: ' + (e instanceof Error ? e.message : String(e)));
				}
			})();
		});

		// Dynamic Button replacement for defaults reset
		const loadBtn = buttonContainer.createEl('button');
		updateLoadBtnLabel = () => {
			const currentLocale = this.plugin.settings.wtlocale;
			const preset = getPreset(currentLocale);
			const label = preset
				? `Load aliases (${currentLocale} — ${preset.name})`
				: 'Load aliases for current WT Locale';
			loadBtn.setText(label);
		};
		updateLoadBtnLabel();

		loadBtn.addEventListener('click', () => {
			void (async () => {
				const currentLocale = this.plugin.settings.wtlocale;
				const preset = getPreset(currentLocale);
				if (!preset) {
					new Notice(`No preset available for locale "${currentLocale}". Add it to data/aliases-master.json.`);
					return;
				}

				const loadPresetAction = async () => {
					this.plugin.settings.aliases = JSON.parse(JSON.stringify(preset.aliases)) as Record<string, number>;
					this.plugin.settings.loadedPreset = currentLocale;
					await this.plugin.saveSettings();
					new Notice(`Aliases loaded for ${preset.name}`);
					this.display();
				};

				if (this.plugin.settings.loadedPreset === currentLocale) {
					// Skip confirmation and load instantly
					await loadPresetAction();
				} else {
					new ConfirmModal(
						this.app,
						`Replace current aliases with the "${preset.name}" (${currentLocale}) preset? This will discard any custom aliases you've added.`,
						() => {
							void loadPresetAction();
						}
					).open();
				}
			})();
		});

		containerEl.scrollTop = scrollTop;
	}
}
