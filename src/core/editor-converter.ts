import { Editor, EditorPosition } from 'obsidian';
import { parseSingleReference } from './parser';
import { referenceToMarkdown } from './converter';
import { PluginSettings, ScriptureReference } from './types';
import { getExclusionRanges, isInsideFencedCodeBlock } from './exclusion';
import verseMap from '../../data/verse-map.json';

/**
 * Scans the current line in the editor and converts all found scripture references to Markdown links.
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

	const references: ScriptureReference[] = [];

	for (let i = 0; i < lineText.length; i++) {
		// Skip exclusion ranges
		const range = exclusionRanges.find(r => i >= r.start && i < r.end);
		if (range) {
			i = range.end - 1;
			continue;
		}

		// Optimization: Only attempt parsing if the current position looks like a start of something.
		// We don't pre-check book names here to be safe and handle the scanning correctly.
		// However, parseSingleReference starts with findBookMatch.
		const ref = parseSingleReference(lineText.substring(i), aliases, i, verseMap);
		if (ref) {
			references.push(ref);
			i = ref.endIndex - 1;
		}
	}

	if (references.length > 0) {
		applyConversions(editor, references, cursor, settings);
	}
}

/**
 * Applies multiple conversions with cursor correction in a single transaction.
 */
function applyConversions(
	editor: Editor,
	refs: ScriptureReference[],
	cursor: EditorPosition,
	settings: PluginSettings
): void {
	const changes = refs.map(ref => ({
		from: { line: cursor.line, ch: ref.startIndex },
		to: { line: cursor.line, ch: ref.endIndex },
		text: referenceToMarkdown(ref, settings),
	}));

	let newCursor = { ...cursor };
	let totalLenDiff = 0;

	for (let i = 0; i < refs.length; i++) {
		const ref = refs[i];
		const change = changes[i];
		if (!ref || !change) continue;
		const markdownLink = change.text;
		const lenDiff = markdownLink.length - ref.originalText.length;

		if (cursor.ch >= ref.endIndex) {
			totalLenDiff += lenDiff;
		} else if (cursor.ch > ref.startIndex) {
			newCursor.ch = ref.startIndex + totalLenDiff + markdownLink.length;
			totalLenDiff = 0;
			break;
		}
	}
	newCursor.ch += totalLenDiff;

	try {
		editor.transaction({
			changes,
			selection: { from: { ...newCursor } },
		});
	} catch (error) {
		console.error('NWT Linker: conversion transaction failed', {
			error,
			refs,
			cursor,
			changes,
		});
	}
}
