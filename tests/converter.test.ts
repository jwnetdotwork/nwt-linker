import { describe, it, expect } from 'vitest';
import { generateBibleId, generateUrl, referenceToMarkdown } from '../src/core/converter';
import { DEFAULT_SETTINGS } from '../src/core/constants';
import { ScriptureReference } from '../src/core/types';

describe('converter', () => {
	describe('generateBibleId', () => {
		it('should generate 8-digit bible ID with padding', () => {
			expect(generateBibleId(56, 1, 14)).toBe('56001014');
			expect(generateBibleId(19, 119, 105)).toBe('19119105');
			expect(generateBibleId(1, 1, 1)).toBe('01001001');
		});
	});

	describe('generateUrl', () => {
		it('should generate URL using template and settings', () => {
			const bibleId = '56001014';
			const settings = {
				wtlocale: 'J',
				pub: 'nwtsty',
				urlTemplate: 'https://www.jw.org/finder?bible={{bible}}&wtlocale={{wtlocale}}&pub={{pub}}'
			};
			const expected = 'https://www.jw.org/finder?bible=56001014&wtlocale=J&pub=nwtsty';
			expect(generateUrl(bibleId, settings)).toBe(expected);
		});

		it('should replace multiple occurrences of placeholders', () => {
			const bibleId = '56001014';
			const settings = {
				wtlocale: 'J',
				pub: 'nwtsty',
				urlTemplate: 'https://www.jw.org/finder?bible={{bible}}&wtlocale={{wtlocale}}&pub={{pub}}&ref={{bible}}'
			};
			const expected = 'https://www.jw.org/finder?bible=56001014&wtlocale=J&pub=nwtsty&ref=56001014';
			expect(generateUrl(bibleId, settings)).toBe(expected);
		});
	});

	describe('referenceToMarkdown', () => {
		it('should convert ScriptureReference to Markdown link using original text', () => {
			const ref: ScriptureReference = {
				bookAlias: 'テトス',
				bookNumber: 56,
				chapter: 1,
				parts: [{ verse: 14, originalText: '1:14' }],
				originalText: 'テトス1:14',
				startIndex: 0,
				endIndex: 7
			};

			const markdown = referenceToMarkdown(ref, DEFAULT_SETTINGS);
			// Default template: https://www.jw.org/finder?srcid=jwlshare&wtlocale={{wtlocale}}&prefer=lang&bible={{bible}}&pub={{pub}}
			expect(markdown).toContain('[テトス1:14]');
			expect(markdown).toContain('bible=56001014');
			expect(markdown).toContain('wtlocale=J');
			expect(markdown).toContain('pub=nwtsty');
		});

		it('should preserve full-width characters in original text', () => {
			const ref: ScriptureReference = {
				bookAlias: 'テトス',
				bookNumber: 56,
				chapter: 1,
				parts: [{ verse: 14, originalText: '１：１４' }],
				originalText: 'テトス１：１４',
				startIndex: 0,
				endIndex: 8
			};

			const markdown = referenceToMarkdown(ref, DEFAULT_SETTINGS);
			expect(markdown).toContain('[テトス１：１４]');
			expect(markdown).toContain('bible=56001014');
		});

		it('should throw when ScriptureReference has no parts', () => {
			const ref: ScriptureReference = {
				bookAlias: 'テトス',
				bookNumber: 56,
				chapter: 1,
				parts: [],
				originalText: 'テトス1:',
				startIndex: 0,
				endIndex: 4
			};

			expect(() => referenceToMarkdown(ref, DEFAULT_SETTINGS)).toThrow('ScriptureReference must have at least one part');
		});
	});
});
