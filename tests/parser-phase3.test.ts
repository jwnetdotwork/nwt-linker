import { describe, it, expect } from 'vitest';
import { parseSingleReference } from '../src/core/parser';
import aliasesData from '../data/aliases.json';

const aliases = aliasesData.ja;

describe('parseSingleReference - Phase 3', () => {
	it('should parse multiple verses', () => {
		const result = parseSingleReference('啓示21:3,4', aliases);
		expect(result).not.toBeNull();
		expect(result?.parts.length).toBe(2);
		expect(result?.parts[0].verse).toBe(3);
		expect(result?.parts[1].verse).toBe(4);
		expect(result?.parts[1].precedingText).toBe(',');
	});

	it('should parse multiple verses with space', () => {
		const result = parseSingleReference('啓示21:3, 4', aliases);
		expect(result).not.toBeNull();
		expect(result?.parts.length).toBe(2);
		expect(result?.parts[1].verse).toBe(4);
		expect(result?.parts[1].precedingText).toBe(', ');
	});

	it('should parse range', () => {
		const result = parseSingleReference('啓示21:3-5', aliases);
		expect(result).not.toBeNull();
		expect(result?.parts.length).toBe(1);
		expect(result?.parts[0].verse).toBe(3);
		expect(result?.parts[0].endVerse).toBe(5);
	});

	it('should parse mixed verses and ranges', () => {
		const result = parseSingleReference('啓示21:3-5,7,9-11', aliases);
		expect(result).not.toBeNull();
		expect(result?.parts.length).toBe(3);
		expect(result?.parts[0].verse).toBe(3);
		expect(result?.parts[0].endVerse).toBe(5);
		expect(result?.parts[1].verse).toBe(7);
		expect(result?.parts[2].verse).toBe(9);
		expect(result?.parts[2].endVerse).toBe(11);
	});

	it('should fail on chapter crossing (comma)', () => {
		const result = parseSingleReference('啓示21:3,22:1', aliases);
		expect(result).toBeNull();
	});

	it('should fail on chapter crossing (range)', () => {
		const result = parseSingleReference('啓示21:3-22:1', aliases);
		expect(result).toBeNull();
	});

	it('should fail on malformed range', () => {
		const result = parseSingleReference('啓示21:3-', aliases);
		expect(result).toBeNull();
	});

	it('should fail on unexpected trailing characters', () => {
		const result = parseSingleReference('啓示21:3, 4abc', aliases);
		expect(result).toBeNull();
	});

	it('should fail on invalid range (start > end)', () => {
		const result = parseSingleReference('啓示21:5-3', aliases);
		expect(result).toBeNull();
	});

	it('should handle full-width characters', () => {
		const result = parseSingleReference('啓示２１：３，　４', aliases);
		expect(result).not.toBeNull();
		expect(result?.chapter).toBe(21);
		expect(result?.parts[0].verse).toBe(3);
		expect(result?.parts[1].verse).toBe(4);
		expect(result?.parts[1].precedingText).toBe('，　');
	});
});
