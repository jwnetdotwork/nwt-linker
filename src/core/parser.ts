import { findBookMatch } from './aliases';
import { normalizeText } from './normalization';
import { ScriptureReference } from './types';

/**
 * Parses a string for a single scripture reference.
 * Currently only supports {Book} {Chapter}:{Verse} format.
 */
export function parseSingleReference(
	text: string,
	aliases: Record<string, number>,
	startIndex: number = 0,
): ScriptureReference | null {
	// 1. Find book match at the start
	const bookMatch = findBookMatch(text, aliases);
	if (!bookMatch) return null;

	const afterBook = text.substring(bookMatch.matchLength);

	// 2. Normalize the rest for easier parsing of chapter:verse
	// We only normalize after the book name to preserve the original book name if needed,
	// though the requirements say "normalized for analysis, original for display".
	const normalizedAfterBook = normalizeText(afterBook);

	// Check if it matches " {Chapter}:{Verse}" or "{Chapter}:{Verse}"
	// The regex should be strict about what follows.
	// We want to avoid "テトス1:" or "テトス1"
	const match = normalizedAfterBook.match(/^(\s*)(\d+):(\d+)/);
	if (!match) return null;

	const space = match[1];
	const chapterStr = match[2];
	const verseStr = match[3];

	const chapter = parseInt(chapterStr, 10);
	const verse = parseInt(verseStr, 10);

	const matchEndIndex = bookMatch.matchLength + match[0].length;
	const originalText = text.substring(0, matchEndIndex);

	// Requirement: parse failed for "テトス1章14節"
	// If the text continues with something that looks like part of a reference but isn't supported,
	// we might need more checks. But the regex ^ above handles the start.
	// Does it handle "テトス1:14章"? The prompt says "テトス1:14" should be parsed.
	// Usually, if it's followed by more text, it's fine unless it's the "1章" format.

	return {
		bookAlias: bookMatch.bookAlias,
		bookNumber: bookMatch.bookNumber,
		chapter,
		parts: [
			{
				verse,
				originalText: match[0].substring(space.length), // Just the "1:14" part
			},
		],
		originalText,
		startIndex,
		endIndex: startIndex + matchEndIndex,
	};
}
