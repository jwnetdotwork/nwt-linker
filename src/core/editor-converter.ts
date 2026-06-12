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
	const allLines = [];
	for (let i = 0; i < lineCount; i++) {
		allLines.push(editor.getLine(i));
	}

	if (isInsideFencedCodeBlock(allLines, cursor.line)) {
		return;
	}

	const lineText = allLines[cursor.line];
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

	const lenDiff = markdownLink.length - ref.originalText.length;
	let newCursor = { ...cursor };

	if (cursor.ch >= ref.endIndex) {
		newCursor.ch += lenDiff;
	} else if (cursor.ch > ref.startIndex) {
		// Cursor is inside the reference being converted.
		// Place it at the end of the new link to be safe.
		newCursor.ch = ref.startIndex + markdownLink.length;
	}

	editor.transaction({
		changes: [{
			from,
			to,
			text: markdownLink
		}],
		selection: { head: newCursor, anchor: newCursor }
	});
}
