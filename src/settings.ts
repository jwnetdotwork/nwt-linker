import { App, PluginSettingTab, Setting } from 'obsidian';
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
						this.plugin.settings.enabled = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Debounce time (ms)')
			.setDesc('Wait time after typing stops before converting links')
			.addText((text) =>
				text
					.setPlaceholder('1000')
					.setValue(this.plugin.settings.debounceMs.toString())
					.onChange(async (value) => {
						const numValue = parseInt(value, 10);
						if (!isNaN(numValue)) {
							this.plugin.settings.debounceMs = numValue;
							await this.plugin.saveSettings();
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
						this.plugin.settings.wtlocale = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Publication')
			.setDesc('Publication code for links (e.g., nwtsty)')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.pub)
					.onChange(async (value) => {
						this.plugin.settings.pub = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('URL Template')
			.setDesc('Template for jw.org links')
			.addText((text) =>
				text
					.setValue(this.plugin.settings.urlTemplate)
					.onChange(async (value) => {
						this.plugin.settings.urlTemplate = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
