import { Editor } from 'obsidian';
import { parseSingleReference } from './parser';
import { referenceToMarkdown } from './converter';
import { PluginSettings } from './types';

/**
 * Scans the current line in the editor and converts the first found scripture reference to a Markdown link.
 */
export function convertReferenceInCurrentLine(
	editor: Editor,
	aliases: Record<string, number>,
	settings: PluginSettings
): void {
	const cursor = editor.getCursor();
	const lineText = editor.getLine(cursor.line);

	// Precompute candidate book names sorted by length descending
	const bookNames = Object.keys(aliases).sort((a, b) => b.length - a.length);

	for (let i = 0; i < lineText.length; i++) {
		// Optimization: Only attempt parsing if the current position matches a book name
		const match = bookNames.find(name => lineText.startsWith(name, i));
		if (!match) continue;

		// We found a potential book name start, now try to parse the whole reference
		const ref = parseSingleReference(lineText.substring(i), aliases, i);
		if (ref) {
			const markdownLink = referenceToMarkdown(ref, settings);

			const from = { line: cursor.line, ch: ref.startIndex };
			const to = { line: cursor.line, ch: ref.endIndex };

			editor.replaceRange(markdownLink, from, to);

			// Phase 1 requirement: stop after the first conversion
			break;
		}
	}
}
