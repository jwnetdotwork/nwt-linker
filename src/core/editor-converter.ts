import { Editor, EditorPosition } from 'obsidian';
import { parseSingleReference } from './parser';
import { referenceToMarkdown } from './converter';
import { PluginSettings, ScriptureReference } from './types';
import { getExclusionRanges, isInsideFencedCodeBlock } from './exclusion';

/**
 * Scans the current line in the editor and converts the first found scripture reference to a Markdown link.
 */
export function convertReferenceInCurrentLine(
	editor: Editor,
	aliases: Record<string, number>,
	settings: PluginSettings
): void {
	const cursor = editor.getCursor();
	const lineCount = editor.lineCount();
	const allLines: string[] = [];
	for (let i = 0; i < lineCount; i++) {
		allLines.push(editor.getLine(i));
	}

	if (cursor.line < 0 || cursor.line >= lineCount) {
		return;
	}

	if (isInsideFencedCodeBlock(allLines, cursor.line)) {
		return;
	}

	const lineText = editor.getLine(cursor.line);
	const exclusionRanges = getExclusionRanges(lineText);

	// Precompute candidate book names sorted by length descending
	const bookNames = Object.keys(aliases).sort((a, b) => b.length - a.length);

	for (let i = 0; i < lineText.length; i++) {
		// Skip exclusion ranges
		const range = exclusionRanges.find(r => i >= r.start && i < r.end);
		if (range) {
			i = range.end - 1;
			continue;
		}

		// Optimization: Only attempt parsing if the current position matches a book name
		const match = bookNames.find(name => lineText.startsWith(name, i));
		if (!match) continue;

		// We found a potential book name start, now try to parse the whole reference
		const ref = parseSingleReference(lineText.substring(i), aliases, i);
		if (ref) {
			applyConversion(editor, ref, cursor, settings);
			// Phase 1/2 requirement: stop after the first conversion
			break;
		}
	}
}

/**
 * Applies the conversion with cursor correction in a single transaction.
 */
function applyConversion(
	editor: Editor,
	ref: ScriptureReference,
	cursor: EditorPosition,
	settings: PluginSettings
): void {
	const markdownLink = referenceToMarkdown(ref, settings);
	const from = { line: cursor.line, ch: ref.startIndex };
	const to = { line: cursor.line, ch: ref.endIndex };

	if (!isValidPosition(from) || !isValidPosition(to) || !isValidPosition(cursor)) {
		console.warn('NWT Linker: skipped conversion with invalid editor positions', {
			ref,
			cursor,
			from,
			to,
		});
		return;
	}

	const lenDiff = markdownLink.length - ref.originalText.length;
	let newCursor = { ...cursor };

	if (cursor.ch >= ref.endIndex) {
		newCursor.ch += lenDiff;
	} else if (cursor.ch > ref.startIndex) {
		// Cursor is inside the reference being converted.
		// Place it at the end of the new link to be safe.
		newCursor.ch = ref.startIndex + markdownLink.length;
	}

	try {
		editor.transaction({
			changes: [{
				from,
				to,
				text: markdownLink,
			}],
			selection: { from: { ...newCursor } },
		});
	} catch (error) {
		console.error('NWT Linker: conversion transaction failed', {
			error,
			ref,
			cursor,
			from,
			to,
			markdownLink,
		});

		// Fallback keeps the conversion functional even if transaction selection handling breaks.
		try {
			editor.replaceRange(markdownLink, from, to);
			editor.setCursor(newCursor);
		} catch (fallbackError) {
			console.error('NWT Linker: fallback conversion failed', {
				fallbackError,
				ref,
				cursor,
				from,
				to,
				markdownLink,
			});
		}
	}
}

function isValidPosition(position: { line: number; ch: number }): boolean {
	return Number.isInteger(position.line) && Number.isInteger(position.ch) && position.line >= 0 && position.ch >= 0;
}
