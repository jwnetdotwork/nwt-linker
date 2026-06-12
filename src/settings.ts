import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';
import { PluginSettings } from './core/types';
import { DEFAULT_SETTINGS } from './core/constants';
import aliasesData from '../data/aliases.json';

export { DEFAULT_SETTINGS };
export type MyPluginSettings = PluginSettings;

export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Enabled')
			.setDesc('Enable automatic scripture link conversion')
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (value) => {
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
					}),
			);

		new Setting(containerEl)
			.setName('Debounce time (ms)')
			.setDesc('Wait time after typing stops before converting links (min 100ms)')
			.addText((text) =>
				text
					.setPlaceholder('1000')
					.setValue(this.plugin.settings.debounceMs.toString())
					.onChange(async (value) => {
						const numValue = parseInt(value, 10);
						if (isNaN(numValue) || numValue < 100) {
							// For invalid input, we don't save but we also don't necessarily want to
							// revert the text immediately as the user might be typing.
							// However, per requirements "fallback to previous valid setting if input is [invalid]"
							// We can use the blur event or just wait for a valid value.
							// To keep it simple and reactive:
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
					}),
			);

		new Setting(containerEl)
			.setName('WT Locale')
			.setDesc('Locale for jw.org links (e.g., J for Japanese)')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.wtlocale)
					.onChange(async (value) => {
						const prev = this.plugin.settings.wtlocale;
						try {
							this.plugin.settings.wtlocale = value;
							await this.plugin.saveSettings();
						} catch (error) {
							this.plugin.settings.wtlocale = prev;
							text.setValue(prev);
							console.error(error);
							new Notice('Failed to save setting: ' + (error instanceof Error ? error.message : String(error)));
						}
					}),
			);

		new Setting(containerEl)
			.setName('Publication')
			.setDesc('Publication code for links (e.g., nwtsty)')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.pub)
					.onChange(async (value) => {
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
					}),
			);

		new Setting(containerEl)
			.setName('URL Template')
			.setDesc('Template for jw.org links. Must contain {{bible}}.')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.urlTemplate)
					.onChange(async (value) => {
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
					}),
			);

		containerEl.createEl('h3', { text: 'Book Name Aliases' });

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
				.onClick(async () => {
					if (!newAlias) {
						new Notice('Alias cannot be empty');
						return;
					}
					if (this.plugin.settings.aliases[newAlias]) {
						new Notice('Alias already exists');
						return;
					}
					this.plugin.settings.aliases[newAlias] = newBookNum;
					await this.plugin.saveSettings();
					this.display();
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
					.onChange(async (value) => {
						const num = parseInt(value, 10);
						if (!isNaN(num) && num >= 1 && num <= 66) {
							this.plugin.settings.aliases[alias] = num;
							await this.plugin.saveSettings();
						}
					});
				text.inputEl.style.width = '60px';
			});

			s.addButton((btn) =>
				btn
					.setIcon('trash')
					.setWarning()
					.setTooltip('Delete alias')
					.onClick(async () => {
						delete this.plugin.settings.aliases[alias];
						await this.plugin.saveSettings();
						this.display();
					}),
			);
		}

		// JSON Import/Export
		containerEl.createEl('h3', { text: 'Import/Export Aliases' });
		const jsonDesc = containerEl.createEl('p', {
			text: 'Import or export your aliases as JSON. When importing, it will overwrite your current aliases.',
		});
		jsonDesc.addClass('setting-item-description');

		const jsonTextArea = containerEl.createEl('textarea', {
			cls: 'alias-json-textarea',
		});
		jsonTextArea.style.width = '100%';
		jsonTextArea.style.height = '150px';
		jsonTextArea.value = JSON.stringify(this.plugin.settings.aliases, null, 2);

		const buttonContainer = containerEl.createDiv();
		buttonContainer.style.display = 'flex';
		buttonContainer.style.gap = '10px';
		buttonContainer.style.marginTop = '10px';

		const importBtn = buttonContainer.createEl('button', { text: 'Import JSON' });
		importBtn.addEventListener('click', async () => {
			try {
				const imported = JSON.parse(jsonTextArea.value);
				if (typeof imported !== 'object' || imported === null) {
					throw new Error('Invalid JSON format: must be an object');
				}
				// Basic validation
				for (const [key, value] of Object.entries(imported)) {
					if (typeof key !== 'string' || typeof value !== 'number' || value < 1 || value > 66) {
						throw new Error(`Invalid entry: ${key}: ${value}. Book number must be 1-66.`);
					}
				}
				this.plugin.settings.aliases = imported;
				await this.plugin.saveSettings();
				new Notice('Aliases imported successfully');
				this.display();
			} catch (e) {
				new Notice('Failed to import JSON: ' + (e instanceof Error ? e.message : String(e)));
			}
		});

		const resetBtn = buttonContainer.createEl('button', { text: 'Reset to Defaults (JP)' });
		resetBtn.addEventListener('click', async () => {
			if (confirm('Are you sure you want to reset all aliases to Japanese defaults?')) {
				this.plugin.settings.aliases = { ...aliasesData.ja };
				await this.plugin.saveSettings();
				new Notice('Aliases reset to defaults');
				this.display();
			}
		});
	}
}
