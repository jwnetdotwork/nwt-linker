import { describe, it, expect, vi, afterEach } from 'vitest';
import { getPreset } from '../src/core/aliases-presets';
import { detectWTLocale } from '../src/core/locale-detect';
import { ensureDefaultAliases } from '../src/core/settings-utils';
import { DEFAULT_SETTINGS } from '../src/core/constants';
import { PluginSettings } from '../src/core/types';
import { moment } from 'obsidian';

// Standard mock for obsidian's moment
vi.mock('obsidian', () => {
	return {
		moment: {
			locale: () => 'ja',
		},
	};
});

describe('loadSettings logic simulation', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should perform language auto-detection and configure settings when loadData is null (first launch) - en-US', () => {
		// Override moment.locale to return an unsupported/empty value so it falls back to vault language config
		vi.spyOn(moment, 'locale').mockReturnValue('unsupported');

		const savedData = null; // simulate null on loadData
		const isFirstLaunch = savedData === null || savedData === undefined;

		const settings: PluginSettings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			savedData as any,
		);
		settings.loadedPreset = settings.loadedPreset ?? null;

		if (isFirstLaunch) {
			const mockApp: any = {
				vault: {
					getConfig: vi.fn().mockReturnValue('en-US'),
				}
			};
			settings.wtlocale = detectWTLocale(mockApp);
		}

		if (ensureDefaultAliases(settings)) {
			// Saved successfully
		}

		// wtlocale should be English (E)
		expect(settings.wtlocale).toBe('E');

		// Check if aliases are correctly initialized for English
		const enPreset = getPreset('E');
		expect(settings.aliases).toEqual(enPreset?.aliases);
		expect(settings.loadedPreset).toBe('E');
	});

	it('should NOT perform auto-detection when saved settings are present', () => {
		const savedData = { wtlocale: 'S', aliases: { 'Génesis': 1 }, loadedPreset: 'S' };
		const isFirstLaunch = savedData === null || savedData === undefined;

		const settings: PluginSettings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			savedData as any,
		);
		settings.loadedPreset = settings.loadedPreset ?? null;

		if (isFirstLaunch) {
			const mockApp: any = {
				vault: {
					getConfig: vi.fn().mockReturnValue('en-US'),
				}
			};
			settings.wtlocale = detectWTLocale(mockApp);
		}

		if (ensureDefaultAliases(settings)) {
			// Saved successfully
		}

		// wtlocale should remain 'S' as stored in savedData, ignoring the vault language
		expect(settings.wtlocale).toBe('S');
		expect(settings.aliases).toEqual({ 'Génesis': 1 });
		expect(settings.loadedPreset).toBe('S');
	});
});
