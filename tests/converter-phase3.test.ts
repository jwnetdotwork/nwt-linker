import { describe, it, expect } from 'vitest';
import { referenceToMarkdown } from '../src/core/converter';
import { ScriptureReference, PluginSettings } from '../src/core/types';

const defaultSettings: PluginSettings = {
	enabled: true,
	debounceMs: 1000,
	wtlocale: 'J',
	pub: 'nwt',
	urlTemplate: 'https://www.jw.org/finder?bible={{bible}}&wtlocale={{wtlocale}}&pub={{pub}}',
	aliases: {},
};

describe('referenceToMarkdown - Phase 3', () => {
	it('should convert multiple verses with spacing', () => {
		const ref: ScriptureReference = {
			bookAlias: '啓示',
			bookNumber: 66,
			chapter: 21,
			parts: [
				{ verse: 3, originalText: '啓示21:3', precedingText: '' },
				{ verse: 4, originalText: '4', precedingText: ', ' },
			],
			originalText: '啓示21:3, 4',
			startIndex: 0,
			endIndex: 10,
		};
		const result = referenceToMarkdown(ref, defaultSettings);
		expect(result).toBe('[啓示21:3](https://www.jw.org/finder?bible=66021003&wtlocale=J&pub=nwt), [4](https://www.jw.org/finder?bible=66021004&wtlocale=J&pub=nwt)');
	});

	it('should convert ranges using starting verse', () => {
		const ref: ScriptureReference = {
			bookAlias: '啓示',
			bookNumber: 66,
			chapter: 21,
			parts: [
				{ verse: 3, endVerse: 5, originalText: '啓示21:3-5', precedingText: '' },
			],
			originalText: '啓示21:3-5',
			startIndex: 0,
			endIndex: 10,
		};
		const result = referenceToMarkdown(ref, defaultSettings);
		expect(result).toBe('[啓示21:3-5](https://www.jw.org/finder?bible=66021003&wtlocale=J&pub=nwt)');
	});

	it('should convert mixed specification', () => {
		const ref: ScriptureReference = {
			bookAlias: '啓示',
			bookNumber: 66,
			chapter: 21,
			parts: [
				{ verse: 3, endVerse: 5, originalText: '啓示21:3-5', precedingText: '' },
				{ verse: 7, originalText: '7', precedingText: ',' },
				{ verse: 9, endVerse: 11, originalText: '9-11', precedingText: ', ' },
			],
			originalText: '啓示21:3-5,7, 9-11',
			startIndex: 0,
			endIndex: 18,
		};
		const result = referenceToMarkdown(ref, defaultSettings);
		expect(result).toContain('[啓示21:3-5](https://www.jw.org/finder?bible=66021003');
		expect(result).toContain(',[7](https://www.jw.org/finder?bible=66021007');
		expect(result).toContain(', [9-11](https://www.jw.org/finder?bible=66021009');
	});
});
