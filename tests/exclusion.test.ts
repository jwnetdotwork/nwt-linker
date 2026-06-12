import { describe, it, expect } from 'vitest';
import { getExclusionRanges, isInsideFencedCodeBlock } from '../src/core/exclusion';

describe('getExclusionRanges', () => {
	it('detects markdown links', () => {
		const text = 'Check [John 3:16](https://example.com) here';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('[John 3:16](https://example.com)');
	});

	it('detects internal links', () => {
		const text = 'See [[John 3:16]] for more';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('[[John 3:16]]');
	});

	it('detects inline code', () => {
		const text = 'Type `John 3:16` to see';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('`John 3:16`');
	});

	it('detects plain URLs', () => {
		const text = 'Visit https://example.com/John_3:16 now';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('https://example.com/John_3:16');
	});

	it('detects brackets and parentheses', () => {
		const text = '[John 3:16] and (Genesis 1:1)';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(2);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('[John 3:16]');
		expect(text.substring(ranges[1].start, ranges[1].end)).toBe('(Genesis 1:1)');
	});

	it('handles mixed exclusions', () => {
		const text = 'Refer to [John 3:16](url) and `Gen 1:1`. Also (Rev 21:3).';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(3);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('[John 3:16](url)');
		expect(text.substring(ranges[1].start, ranges[1].end)).toBe('`Gen 1:1`');
		expect(text.substring(ranges[2].start, ranges[2].end)).toBe('(Rev 21:3)');
	});

	it('excludes scripture within brackets', () => {
		const text = '[テトス1:14]';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('[テトス1:14]');
	});

	it('excludes scripture within parentheses', () => {
		const text = '(テトス1:14)';
		const ranges = getExclusionRanges(text);
		expect(ranges).toHaveLength(1);
		expect(text.substring(ranges[0].start, ranges[0].end)).toBe('(テトス1:14)');
	});
});

describe('isInsideFencedCodeBlock', () => {
	it('returns true inside a block', () => {
		const lines = [
			'some text',
			'```',
			'inside',
			'```',
			'outside'
		];
		expect(isInsideFencedCodeBlock(lines, 0)).toBe(false);
		expect(isInsideFencedCodeBlock(lines, 1)).toBe(true); // fence line
		expect(isInsideFencedCodeBlock(lines, 2)).toBe(true); // inside
		expect(isInsideFencedCodeBlock(lines, 3)).toBe(true); // fence line
		expect(isInsideFencedCodeBlock(lines, 4)).toBe(false); // outside
	});

	it('handles multiple blocks', () => {
		const lines = [
			'```',
			'b1',
			'```',
			'text',
			'```',
			'b2',
			'```'
		];
		expect(isInsideFencedCodeBlock(lines, 0)).toBe(true);
		expect(isInsideFencedCodeBlock(lines, 1)).toBe(true);
		expect(isInsideFencedCodeBlock(lines, 2)).toBe(true);
		expect(isInsideFencedCodeBlock(lines, 3)).toBe(false);
		expect(isInsideFencedCodeBlock(lines, 4)).toBe(true);
	});
});
