import { describe, it, expect } from 'vitest';
import { findBookMatch } from '../src/core/aliases';

describe('findBookMatch', () => {
	const aliases = {
		'ヨハネ': 43,
		'ヨハネ第一': 62,
		'ヨハ一': 62,
	};

	it('should find the longest match', () => {
		const match = findBookMatch('ヨハネ第一1:1', aliases);
		expect(match).not.toBeNull();
		expect(match?.bookAlias).toBe('ヨハネ第一');
		expect(match?.bookNumber).toBe(62);
	});

	it('should find a shorter match if it is the only one', () => {
		const match = findBookMatch('ヨハネ1:1', aliases);
		expect(match).not.toBeNull();
		expect(match?.bookAlias).toBe('ヨハネ');
		expect(match?.bookNumber).toBe(43);
	});

	it('should find match with abbreviation', () => {
		const match = findBookMatch('ヨハ一1:1', aliases);
		expect(match).not.toBeNull();
		expect(match?.bookAlias).toBe('ヨハ一');
		expect(match?.bookNumber).toBe(62);
	});

	it('should return null if no match is found', () => {
		const match = findBookMatch('創世記1:1', aliases);
		expect(match).toBeNull();
	});
});
