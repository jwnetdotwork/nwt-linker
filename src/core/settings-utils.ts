import { PluginSettings } from './types';
import { getPreset } from './aliases-presets';

/**
 * Ensures that the settings have the default book aliases if none are present.
 * @param settings The plugin settings to check and potentially modify.
 * @returns true if the settings were modified, false otherwise.
 */
export function ensureDefaultAliases(settings: PluginSettings): boolean {
	if (!settings.aliases || Object.keys(settings.aliases).length === 0) {
		const preset = getPreset(settings.wtlocale);
		if (preset) {
			settings.aliases = { ...preset.aliases };
			settings.loadedPreset = settings.wtlocale;
			return true;
		} else {
			const fallbackPreset = getPreset('J');
			if (!fallbackPreset) {
				// マスターデータが空。最低限フォールバック。
				settings.aliases = {};
				return false;
			}
			settings.aliases = { ...fallbackPreset.aliases };
			settings.loadedPreset = 'J';
			return true;
		}
	}
	return false;
}
