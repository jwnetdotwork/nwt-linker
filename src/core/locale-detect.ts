import { App, moment } from 'obsidian';

// ISO to WT Locale mapping tables as specified:
const ISO_TO_WT_EXACT: Record<string, string> = {
	'ja': 'J',
	'en': 'E',
	'en-us': 'E',
	'en-gb': 'E',
	'en-ng': 'E',
	'es': 'S',
	'es-es': 'S',
	'es-mx': 'S',
	'es-ar': 'S',
	'zh-hant': 'CH',
	'zh-tw': 'CH',
	'zh-hk': 'CH',
	'zh-mo': 'CH',
	'zh-hans': 'CHS',
	'zh-cn': 'CHS',
	'zh-sg': 'CHS',
	'pt': 'T',
	'pt-br': 'T',
	'pt-pt': 'T',
	'pt-mz': 'T',
	'fr': 'F',
	'fr-fr': 'F',
	'fr-ca': 'F',
	'de': 'X',
	'de-de': 'X',
	'de-at': 'X',
	'de-ch': 'X',
	'ko': 'KO',
	'ko-kr': 'KO',
	'it': 'I',
	'it-it': 'I',
	'ru': 'U',
	'ru-ru': 'U',
};

const ISO_TO_WT_PREFIX: Record<string, string> = {
	'ja': 'J',
	'en': 'E',
	'es': 'S',
	'zh': 'CHS', // Simplified Chinese as default for zh prefix
	'pt': 'T',
	'fr': 'F',
	'de': 'X',
	'ko': 'KO',
	'it': 'I',
	'ru': 'U',
};

/**
 * Normalizes a locale string to lowercase with hyphens.
 * (e.g. "en_US" -> "en-us")
 */
export function normalizeLocaleString(locale: string): string {
	return locale.toLowerCase().replace(/_/g, '-').trim();
}

/**
 * Maps a normalized locale string to a WT Locale string.
 */
export function mapLocaleToWTLocale(locale: string): string | null {
	const normalized = normalizeLocaleString(locale);

	// 1. Exact match
	if (ISO_TO_WT_EXACT[normalized] !== undefined) {
		return ISO_TO_WT_EXACT[normalized];
	}

	// 2. Special check for zh- prefixed locales if not in exact list
	if (normalized.startsWith('zh-')) {
		if (normalized.includes('hant') || normalized.includes('tw') || normalized.includes('hk') || normalized.includes('mo')) {
			return 'CH';
		}
		if (normalized.includes('hans') || normalized.includes('cn') || normalized.includes('sg')) {
			return 'CHS';
		}
	}

	// 3. Fallback to base language code
	const baseCode = normalized.split('-')[0];
	if (baseCode !== undefined && ISO_TO_WT_PREFIX[baseCode] !== undefined) {
		return ISO_TO_WT_PREFIX[baseCode];
	}

	return null;
}

/**
 * Detects the WT Locale based on obsidian environment and browser navigator.
 */
export function detectWTLocale(app: App): string {
	// Strategy 1: moment.locale()
	try {
		const momentLocale = moment.locale();
		if (momentLocale) {
			const wt = mapLocaleToWTLocale(momentLocale);
			if (wt) return wt;
		}
	} catch (e) {
		console.warn('Failed to detect locale from moment.locale():', e);
	}

	// Strategy 2: app.vault.getConfig('language')
	try {
		const obsidianLang = (app.vault as any).getConfig('language');
		if (obsidianLang && typeof obsidianLang === 'string') {
			const wt = mapLocaleToWTLocale(obsidianLang);
			if (wt) return wt;
		}
	} catch (e) {
		console.warn('Failed to detect locale from app.vault.getConfig("language"):', e);
	}

	// Strategy 3: navigator.language
	try {
		const navLang = navigator.language;
		if (navLang) {
			const wt = mapLocaleToWTLocale(navLang);
			if (wt) return wt;
		}
	} catch (e) {
		console.warn('Failed to detect locale from navigator.language:', e);
	}

	// Fallback to J
	return 'J';
}
