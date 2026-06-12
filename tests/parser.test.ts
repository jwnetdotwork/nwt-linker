import { describe, it, expect } from 'vitest';
import { parseSingleReference } from '../src/core/parser';
import aliasesData from '../data/aliases.json';

const aliases = aliasesData.ja;

describe('parseSingleReference', () => {
	it('should parse simple reference', () => {
		const result = parseSingleReference('テトス1:14', aliases);
		expect(result).not.toBeNull();
		expect(result?.bookAlias).toBe('テトス');
		expect(result?.chapter).toBe(1);
		expect(result?.parts[0].verse).toBe(14);
		expect(result?.originalText).toBe('テトス1:14');
	});

	it('should parse reference with half-width space', () => {
		const result = parseSingleReference('テトス 1:14', aliases);
		expect(result).not.toBeNull();
		expect(result?.originalText).toBe('テトス 1:14');
	});

	it('should parse reference with full-width space', () => {
		const result = parseSingleReference('テトス　1:14', aliases);
		expect(result).not.toBeNull();
		expect(result?.originalText).toBe('テトス　1:14');
	});

	it('should parse reference with full-width characters', () => {
		const result = parseSingleReference('テトス１：１４', aliases);
		expect(result).not.toBeNull();
		expect(result?.chapter).toBe(1);
		expect(result?.parts[0].verse).toBe(14);
		expect(result?.originalText).toBe('テトス１：１４');
	});

	it('should parse reference with abbreviation', () => {
		const result = parseSingleReference('ヨハ一1:1', aliases);
		expect(result).not.toBeNull();
		expect(result?.bookAlias).toBe('ヨハ一');
		expect(result?.bookNumber).toBe(62);
		expect(result?.chapter).toBe(1);
		expect(result?.parts[0].verse).toBe(1);
	});

	it('should fail for incomplete reference (no verse)', () => {
		const result = parseSingleReference('テトス1:', aliases);
		expect(result).toBeNull();
	});

	it('should fail for incomplete reference (no colon)', () => {
		const result = parseSingleReference('テトス1', aliases);
		expect(result).toBeNull();
	});

	it('should fail for unsupported format (Japanese style)', () => {
		const result = parseSingleReference('テトス1章14節', aliases);
		expect(result).toBeNull();
	});
});
