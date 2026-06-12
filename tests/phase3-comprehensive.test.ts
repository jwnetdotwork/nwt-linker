import { describe, it, expect, vi } from 'vitest';
import { parseSingleReference } from '../src/core/parser';
import { referenceToMarkdown } from '../src/core/converter';
import { convertReferenceInCurrentLine } from '../src/core/editor-converter';
import aliasesData from '../data/aliases.json';
import { DEFAULT_SETTINGS } from '../src/core/constants';

const aliases = aliasesData.ja;

describe('Phase 3 Requirements Verification', () => {

	describe('Multiple Verses and Ranges', () => {
		const testCases = [
			{ input: '啓示21:3,4', expected: '[啓示21:3](url), [4](url)' },
			{ input: '啓示21:3, 4', expected: '[啓示21:3](url), [4](url)' },
			{ input: '啓示21:3,4,5', expected: '[啓示21:3](url), [4](url), [5](url)' },
			{ input: '啓示21:3,5,7', expected: '[啓示21:3](url), [5](url), [7](url)' },
			{ input: '啓示21:3-5', expected: '[啓示21:3-5](url)' },
			{ input: '啓示21:3-5,7,9-11', expected: '[啓示21:3-5](url), [7](url), [9-11](url)' },
			{ input: '啓示21:3-5, 7, 9-11', expected: '[啓示21:3-5](url), [7](url), [9-11](url)' },
		];

		testCases.forEach(({ input, expected }) => {
			it(`should convert "${input}" correctly`, () => {
				const ref = parseSingleReference(input, aliases);
				expect(ref).not.toBeNull();
				const result = referenceToMarkdown(ref!, DEFAULT_SETTINGS);
				// We don't check exact URL but structure
				expect(result).toContain('[');
				expect(result.split('](').length - 1).toBe(expected.split('](').length - 1);
			});
		});
	});

	describe('Chapter Crossing Exclusion', () => {
		const invalidCases = [
			'啓示21:3,22:1',
			'啓示21:3-22:1',
		];

		invalidCases.forEach(input => {
			it(`should NOT convert "${input}"`, () => {
				const ref = parseSingleReference(input, aliases);
				expect(ref).toBeNull();
			});
		});
	});

	describe('Semicolon Independent References', () => {
		it('should convert "創 24:59; 出 3:2" independently', () => {
			const transaction = vi.fn();
			const lineText = '創 24:59; 出 3:2';
			const editor = {
				getCursor: () => ({ line: 0, ch: lineText.length }),
				lineCount: () => 1,
				getLine: () => lineText,
				transaction,
			} as any;

			convertReferenceInCurrentLine(editor, aliases, DEFAULT_SETTINGS);

			expect(transaction).toHaveBeenCalledTimes(1);
			const tx = transaction.mock.calls[0][0];
			expect(tx.changes.length).toBe(2);
		});

		it('should NOT inherit book name after semicolon: "創 24:59; 35:8"', () => {
			const transaction = vi.fn();
			const lineText = '創 24:59; 35:8';
			const editor = {
				getCursor: () => ({ line: 0, ch: lineText.length }),
				lineCount: () => 1,
				getLine: () => lineText,
				transaction,
			} as any;

			convertReferenceInCurrentLine(editor, aliases, DEFAULT_SETTINGS);

			expect(transaction).toHaveBeenCalledTimes(1);
			const tx = transaction.mock.calls[0][0];
			expect(tx.changes.length).toBe(1);
			expect(tx.changes[0].text).toContain('創 24:59');
		});
	});

	describe('Line context (Lists, Quotes, Tables)', () => {
		const contexts = [
			'- 啓示21:3',
			'1. 啓示21:3',
			'> 啓示21:3',
			'| col1 | 啓示21:3 |',
		];

		contexts.forEach(lineText => {
			it(`should convert in context: "${lineText}"`, () => {
				const transaction = vi.fn();
				const editor = {
					getCursor: () => ({ line: 0, ch: lineText.length }),
					lineCount: () => 1,
					getLine: () => lineText,
					transaction,
				} as any;

				convertReferenceInCurrentLine(editor, aliases, DEFAULT_SETTINGS);
				expect(transaction).toHaveBeenCalledTimes(1);
			});
		});
	});
});
