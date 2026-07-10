import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App, moment } from 'obsidian';
import { normalizeLocaleString, mapLocaleToWTLocale, detectWTLocale } from '../src/core/locale-detect';

// We need to mock Obsidian's moment import since it's not present in testing env, or verify if it works.
// We can use vi.spyOn or vi.mock.
vi.mock('obsidian', () => {
	return {
		moment: {
			locale: () => 'ja',
		},
	};
});

describe('normalizeLocaleString', () => {
	it('should convert underscore to hyphen and convert to lowercase', () => {
		expect(normalizeLocaleString('en_US')).toBe('en-us');
		expect(normalizeLocaleString('JA_jp')).toBe('ja-jp');
		expect(normalizeLocaleString(' zh-TW ')).toBe('zh-tw');
	});
});

describe('mapLocaleToWTLocale', () => {
	it('should map exact matches', () => {
		expect(mapLocaleToWTLocale('ja')).toBe('J');
		expect(mapLocaleToWTLocale('en-us')).toBe('E');
		expect(mapLocaleToWTLocale('en-gb')).toBe('E');
		expect(mapLocaleToWTLocale('zh-tw')).toBe('CH');
		expect(mapLocaleToWTLocale('zh-cn')).toBe('CHS');
		expect(mapLocaleToWTLocale('pt-br')).toBe('T');
	});

	it('should map zh- prefixed locales correctly using fallback logic', () => {
		// zh-hant variations -> CH
		expect(mapLocaleToWTLocale('zh-hant-hk')).toBe('CH');
		// zh-hans variations -> CHS
		expect(mapLocaleToWTLocale('zh-hans-cn')).toBe('CHS');
	});

	it('should fall back to prefix match if no exact match exists', () => {
		expect(mapLocaleToWTLocale('en-ca')).toBe('E');
		expect(mapLocaleToWTLocale('fr-be')).toBe('F');
		expect(mapLocaleToWTLocale('de-lu')).toBe('X');
	});

	it('should return null for unknown languages', () => {
		expect(mapLocaleToWTLocale('vi')).toBeNull();
		expect(mapLocaleToWTLocale('tl')).toBeNull();
	});
});

describe('detectWTLocale strategies', () => {
	let mockApp: any;

	beforeEach(() => {
		mockApp = {
			vault: {
				getConfig: vi.fn(),
			},
		};
		// Reset global navigator mock if we use it
		vi.stubGlobal('navigator', {
			language: 'en-US',
		});
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('should prioritize moment.locale() if available', () => {
		vi.spyOn(moment, 'locale').mockReturnValue('es-mx');
		mockApp.vault.getConfig.mockReturnValue('en');

		const wt = detectWTLocale(mockApp as App);
		expect(wt).toBe('S'); // Spanish
	});

	it('should fallback to app.vault.getConfig("language") if moment.locale() is not matched or fails', () => {
		vi.spyOn(moment, 'locale').mockReturnValue('vi'); // Unsupported
		mockApp.vault.getConfig.mockReturnValue('de-de');

		const wt = detectWTLocale(mockApp as App);
		expect(wt).toBe('X'); // German
	});

	it('should fallback to navigator.language if previous strategies fail', () => {
		vi.spyOn(moment, 'locale').mockReturnValue('vi'); // Unsupported
		mockApp.vault.getConfig.mockReturnValue('tl'); // Unsupported
		vi.stubGlobal('navigator', {
			language: 'ru-RU',
		});

		const wt = detectWTLocale(mockApp as App);
		expect(wt).toBe('U'); // Russian
	});

	it('should fallback to J if all strategies fail or return unknown locales', () => {
		vi.spyOn(moment, 'locale').mockImplementation(() => { throw new Error('Moment error'); });
		mockApp.vault.getConfig.mockImplementation(() => { throw new Error('Vault error'); });
		vi.stubGlobal('navigator', {
			get language() {
				throw new Error('Navigator error');
			}
		});

		const wt = detectWTLocale(mockApp as App);
		expect(wt).toBe('J'); // Default Japanese
	});
});
