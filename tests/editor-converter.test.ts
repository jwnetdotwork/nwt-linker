import { describe, expect, it, vi } from 'vitest';
import { convertReferenceInCurrentLine } from '../src/core/editor-converter';
import { DEFAULT_SETTINGS } from '../src/core/constants';
import aliasesData from '../data/aliases.json';

describe('convertReferenceInCurrentLine', () => {
	it('creates a transaction with Obsidian selection coordinates', () => {
		const transaction = vi.fn();
		const editor = {
			getCursor: () => ({ line: 0, ch: 6 }),
			lineCount: () => 1,
			getLine: () => '啓示21:3',
			transaction,
			replaceRange: vi.fn(),
			setCursor: vi.fn(),
		} as any;

		convertReferenceInCurrentLine(editor, aliasesData.ja, DEFAULT_SETTINGS);

		expect(transaction).toHaveBeenCalledTimes(1);
		const tx = transaction.mock.calls[0][0];
		expect(tx.changes[0].from).toEqual({ line: 0, ch: 0 });
		expect(tx.changes[0].to).toEqual({ line: 0, ch: 6 });
		expect(tx.selection).toHaveProperty('from');
		expect(tx.selection).not.toHaveProperty('anchor');
		expect(tx.selection.from.line).toBe(0);
		expect(tx.selection.from.ch).toBeGreaterThan(6);
	});
});
