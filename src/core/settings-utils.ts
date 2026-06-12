import { PluginSettings } from './types';
import aliasesData from '../../data/aliases.json';

/**
 * Ensures that the settings have the default Japanese book aliases if none are present.
 * @param settings The plugin settings to check and potentially modify.
 * @returns true if the settings were modified, false otherwise.
 */
export function ensureDefaultAliases(settings: PluginSettings): boolean {
	if (!settings.aliases || Object.keys(settings.aliases).length === 0) {
		settings.aliases = { ...aliasesData.ja };
		return true;
	}
	return false;
}
