import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from './main';
import { PluginSettings } from './core/types';
import { DEFAULT_SETTINGS } from './core/constants';

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
	}
}
