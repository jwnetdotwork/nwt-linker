import { ScriptureReference, ScripturePart, PluginSettings } from './types';

/**
 * Generates an 8-digit Bible ID in the format BBCCCVVV.
 * B: Book number (2 digits)
 * C: Chapter number (3 digits)
 * V: Verse number (3 digits)
 */
export function generateBibleId(bookNumber: number, chapter: number, verse: number): string {
	const b = bookNumber.toString().padStart(2, '0');
	const c = chapter.toString().padStart(3, '0');
	const v = verse.toString().padStart(3, '0');
	return `${b}${c}${v}`;
}

/**
 * Generates a URL for a scripture reference based on settings and template.
 */
export function generateUrl(
	bibleId: string,
	settings: Pick<PluginSettings, 'wtlocale' | 'pub' | 'urlTemplate'>
): string {
	return settings.urlTemplate
		.replaceAll('{{bible}}', bibleId)
		.replaceAll('{{wtlocale}}', settings.wtlocale)
		.replaceAll('{{pub}}', settings.pub);
}

/**
 * Converts a scripture reference part into a Markdown link.
 */
export function convertToMarkdownLink(
	part: ScripturePart,
	bookNumber: number,
	chapter: number,
	settings: Pick<PluginSettings, 'wtlocale' | 'pub' | 'urlTemplate'>
): string {
	const bibleId = generateBibleId(bookNumber, chapter, part.verse);
	const url = generateUrl(bibleId, settings);
	return `[${part.originalText}](${url})`;
}

/**
 * Converts a whole scripture reference into Markdown.
 */
export function referenceToMarkdown(
	ref: ScriptureReference,
	settings: PluginSettings
): string {
	if (!ref.parts || ref.parts.length === 0) {
		throw new Error('ScriptureReference must have at least one part');
	}

	// For a single part, we might want to ensure the originalText of the reference is used
	// if it's the Phase 1 style "テトス1:14".
	// In Phase 3, parts[0].originalText for "啓示21:3" IS "啓示21:3".
	// So map works fine for both phases.

	return ref.parts
		.map((part) => {
			const link = convertToMarkdownLink(part, ref.bookNumber, ref.chapter, settings);
			return (part.precedingText || '') + link;
		})
		.join('');
}
