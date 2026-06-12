import { describe, it, expect } from 'vitest';
import { ensureDefaultAliases } from '../src/core/settings-utils';
import { PluginSettings } from '../src/core/types';
import aliasesData from '../data/aliases.json';

describe('ensureDefaultAliases', () => {
	it('should populate empty aliases with defaults', () => {
		const settings: Partial<PluginSettings> = {
			aliases: {}
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(true);
		expect(settings.aliases).toEqual(aliasesData.ja);
	});

	it('should populate undefined aliases with defaults', () => {
		const settings: Partial<PluginSettings> = {
			aliases: undefined
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(true);
		expect(settings.aliases).toEqual(aliasesData.ja);
	});

	it('should not modify populated aliases', () => {
		const initialAliases = { 'Custom': 1 };
		const settings: Partial<PluginSettings> = {
			aliases: { ...initialAliases }
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(false);
		expect(settings.aliases).toEqual(initialAliases);
	});
});
