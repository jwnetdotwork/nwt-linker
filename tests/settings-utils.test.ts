import { describe, it, expect } from 'vitest';
import { ensureDefaultAliases } from '../src/core/settings-utils';
import { PluginSettings } from '../src/core/types';
import { getPreset } from '../src/core/aliases-presets';

describe('ensureDefaultAliases', () => {
	const jaPreset = getPreset('J');

	it('should populate empty aliases with defaults', () => {
		const settings: Partial<PluginSettings> = {
			aliases: {},
			wtlocale: 'J',
			loadedPreset: null
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(true);
		expect(settings.aliases).toEqual(jaPreset?.aliases);
		expect(settings.loadedPreset).toBe('J');
	});

	it('should populate undefined aliases with defaults', () => {
		const settings: Partial<PluginSettings> = {
			aliases: undefined,
			wtlocale: 'J',
			loadedPreset: null
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(true);
		expect(settings.aliases).toEqual(jaPreset?.aliases);
		expect(settings.loadedPreset).toBe('J');
	});

	it('should not modify populated aliases', () => {
		const initialAliases = { 'Custom': 1 };
		const settings: Partial<PluginSettings> = {
			aliases: { ...initialAliases },
			wtlocale: 'J',
			loadedPreset: 'J'
		};
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(false);
		expect(settings.aliases).toEqual(initialAliases);
		expect(settings.loadedPreset).toBe('J');
	});

	it('should handle missing loadedPreset but populated aliases', () => {
		const initialAliases = { 'Custom': 1 };
		const settings: Partial<PluginSettings> = {
			aliases: { ...initialAliases },
			wtlocale: 'J',
			loadedPreset: undefined
		} as any;
		const modified = ensureDefaultAliases(settings as PluginSettings);
		expect(modified).toBe(false);
		expect(settings.aliases).toEqual(initialAliases);
		expect(settings.loadedPreset).toBeUndefined(); // ensureDefaultAliases does not set it because modified is false
	});
});
