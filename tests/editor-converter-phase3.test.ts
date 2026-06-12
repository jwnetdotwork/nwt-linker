import { describe, expect, it, vi } from 'vitest';
import { convertReferenceInCurrentLine } from '../src/core/editor-converter';
import { DEFAULT_SETTINGS } from '../src/core/constants';
import aliasesData from '../data/aliases.json';

describe('convertReferenceInCurrentLine - Phase 3', () => {
	it('converts multiple references in one line', () => {
		const transaction = vi.fn();
		const lineText = '創 24:59; 出 3:2';
		const editor = {
			getCursor: () => ({ line: 0, ch: lineText.length }),
			lineCount: () => 1,
			getLine: () => lineText,
			transaction,
		} as any;

		convertReferenceInCurrentLine(editor, aliasesData.ja, DEFAULT_SETTINGS);

		expect(transaction).toHaveBeenCalledTimes(1);
		const tx = transaction.mock.calls[0][0];
		expect(tx.changes.length).toBe(2);
		expect(tx.changes[0].text).toContain('創 24:59');
		expect(tx.changes[1].text).toContain('出 3:2');
	});

	it('converts mixed references correctly', () => {
		const transaction = vi.fn();
		const lineText = '啓示21:3-5, 7';
		const editor = {
			getCursor: () => ({ line: 0, ch: lineText.length }),
			lineCount: () => 1,
			getLine: () => lineText,
			transaction,
		} as any;

		convertReferenceInCurrentLine(editor, aliasesData.ja, DEFAULT_SETTINGS);

		expect(transaction).toHaveBeenCalledTimes(1);
		const tx = transaction.mock.calls[0][0];
		expect(tx.changes.length).toBe(1); // One ScriptureReference with multiple parts
		expect(tx.changes[0].text).toContain('啓示21:3-5');
		expect(tx.changes[0].text).toContain(', [7]');
	});

	it('skips invalid semicolon inheritance', () => {
		const transaction = vi.fn();
		const lineText = '創 24:59; 35:8';
		const editor = {
			getCursor: () => ({ line: 0, ch: lineText.length }),
			lineCount: () => 1,
			getLine: () => lineText,
			transaction,
		} as any;

		convertReferenceInCurrentLine(editor, aliasesData.ja, DEFAULT_SETTINGS);

		expect(transaction).toHaveBeenCalledTimes(1);
		const tx = transaction.mock.calls[0][0];
		expect(tx.changes.length).toBe(1);
		expect(tx.changes[0].text).toContain('創 24:59');
		// 35:8 should not be in changes
	});

	it('handles cursor positioning after multiple replacements', () => {
		const transaction = vi.fn();
		const lineText = 'テトス1:14 啓示21:3'; // Removed 'と' to simplify
		// Cursor at the very end
		const editor = {
			getCursor: () => ({ line: 0, ch: lineText.length }),
			lineCount: () => 1,
			getLine: () => lineText,
			transaction,
		} as any;

		convertReferenceInCurrentLine(editor, aliasesData.ja, DEFAULT_SETTINGS);

		expect(transaction).toHaveBeenCalledTimes(1);
		const tx = transaction.mock.calls[0][0];
		expect(tx.changes.length).toBe(2);
		const firstLink = tx.changes[0].text;
		const secondLink = tx.changes[1].text;

		const expectedLen = lineText.length
			+ (firstLink.length - 'テトス1:14'.length)
			+ (secondLink.length - '啓示21:3'.length);

		expect(tx.selection.from.ch).toBe(expectedLen);
	});
});
