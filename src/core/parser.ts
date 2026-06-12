import { findBookMatch } from './aliases';
import { normalizeText } from './normalization';
import { ScriptureReference, ScripturePart } from './types';

/**
 * Parses a string for a scripture reference.
 * Supports multiple verses and ranges (e.g., "Gen 1:1, 2-3").
 */
export function parseSingleReference(
	text: string,
	aliases: Record<string, number>,
	startIndex: number = 0,
	verseMap?: Record<string, Record<string, number>>,
): ScriptureReference | null {
	// 1. Find book match at the start
	const bookMatch = findBookMatch(text, aliases);
	if (!bookMatch) return null;

	const afterBook = text.substring(bookMatch.matchLength);
	const normalizedAfterBook = normalizeText(afterBook);

	// 2. Parse Chapter:Verse
	// Match chapter and first verse part
	const firstPartMatch = normalizedAfterBook.match(/^(\s*)(\d+):(\d+)/);
	if (!firstPartMatch) return null;

	const leadingSpace = firstPartMatch[1] ?? '';
	const chapterStr = firstPartMatch[2];
	const firstVerseStr = firstPartMatch[3];
	if (chapterStr === undefined || firstVerseStr === undefined) return null;

	const chapter = parseInt(chapterStr, 10);
	const firstVerse = parseInt(firstVerseStr, 10);
	if (isNaN(chapter) || isNaN(firstVerse)) return null;

	let currentIndex = firstPartMatch[0].length;
	const parts: ScripturePart[] = [];

	// Check if the first verse is part of a range
	let firstPartEndVerse: number | undefined;
	let firstPartOriginalTextEnd = currentIndex;

	if (normalizedAfterBook[currentIndex] === '-') {
		const rangeMatch = normalizedAfterBook.substring(currentIndex).match(/^-(\d+)/);
		if (rangeMatch) {
			// Check for chapter crossing in range: e.g., 21:3-22:1
			const afterRangeIndex = currentIndex + rangeMatch[0].length;
			if (normalizedAfterBook[afterRangeIndex] === ':') {
				return null;
			}

			const endVerseStr = rangeMatch[1];
			if (endVerseStr === undefined) return null;
			firstPartEndVerse = parseInt(endVerseStr, 10);
			if (isNaN(firstPartEndVerse)) return null;
			currentIndex += rangeMatch[0].length;
			firstPartOriginalTextEnd = currentIndex;
		} else {
			// Malformed range like "21:3-"
			return null;
		}
	}

	parts.push({
		verse: firstVerse,
		endVerse: firstPartEndVerse,
		originalText: text.substring(0, bookMatch.matchLength + firstPartOriginalTextEnd),
		precedingText: '',
	});

	// 3. Parse subsequent parts
	while (currentIndex < normalizedAfterBook.length) {
		const remaining = normalizedAfterBook.substring(currentIndex);

		// Stop at semicolon - it's a delimiter for independent references
		if (remaining.startsWith(';')) {
			break;
		}

		// Expect a comma
		const commaMatch = remaining.match(/^(\s*,\s*)(\d+)/);
		if (!commaMatch) {
			break;
		}

		const precedingText = afterBook.substring(currentIndex, currentIndex + (commaMatch[1]?.length ?? 0));
		const verseStr = commaMatch[2];
		if (verseStr === undefined) break;
		const verse = parseInt(verseStr, 10);
		if (isNaN(verse)) break;
		let partEndIndex = currentIndex + commaMatch[0].length;
		let endVerse: number | undefined;

		// Check for chapter crossing in comma: e.g., 21:3, 22:1
		if (normalizedAfterBook[partEndIndex] === ':') {
			return null;
		}

		// Check for range in subsequent part
		if (normalizedAfterBook[partEndIndex] === '-') {
			const rangeMatch = normalizedAfterBook.substring(partEndIndex).match(/^-(\d+)/);
			if (rangeMatch) {
				const afterRangeIndex = partEndIndex + rangeMatch[0].length;
				if (normalizedAfterBook[afterRangeIndex] === ':') {
					return null;
				}

				const endVerseStr = rangeMatch[1];
				if (endVerseStr === undefined) return null;
				endVerse = parseInt(endVerseStr, 10);
				if (isNaN(endVerse)) return null;
				partEndIndex += rangeMatch[0].length;
			} else {
				return null; // Malformed range
			}
		}

		parts.push({
			verse,
			endVerse,
			originalText: afterBook.substring(currentIndex + (commaMatch[1]?.length || 0), partEndIndex),
			precedingText,
		});

		currentIndex = partEndIndex;
	}

	// Requirement 9 & 1.5: Check for unexpected trailing characters or chapter crossing
	if (currentIndex < normalizedAfterBook.length) {
		const trailing = normalizedAfterBook.substring(currentIndex);
		if (/^[,:-]/.test(trailing)) {
			return null;
		}
		const firstTrailingChar = trailing[0];
		if (firstTrailingChar && /[a-zA-Z0-9]/.test(firstTrailingChar)) {
			return null;
		}
	}

	const matchEndIndex = bookMatch.matchLength + currentIndex;
	const originalText = text.substring(0, matchEndIndex);

	// Basic validation (Phase 3 requirement)
	for (const part of parts) {
		if (part.endVerse !== undefined && part.verse > part.endVerse) {
			return null;
		}
	}

	// VerseMap validation (Phase 4 requirement)
	if (verseMap) {
		const bookNumStr = bookMatch.bookNumber.toString();
		const chapters = (verseMap as Record<string, Record<string, number>>)[bookNumStr];
		if (!chapters) return null;

		const maxVerse = chapters[chapter.toString()];
		if (maxVerse === undefined) return null;

		for (const part of parts) {
			if (part.verse < 1 || part.verse > maxVerse) return null;
			if (part.endVerse !== undefined) {
				if (part.endVerse < 1 || part.endVerse > maxVerse) return null;
			}
		}
	}

	return {
		bookAlias: bookMatch.bookAlias,
		bookNumber: bookMatch.bookNumber,
		chapter,
		parts,
		originalText,
		startIndex,
		endIndex: startIndex + matchEndIndex,
	};
}
