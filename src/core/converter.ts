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
		.replace('{{bible}}', bibleId)
		.replace('{{wtlocale}}', settings.wtlocale)
		.replace('{{pub}}', settings.pub);
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
 * Phase 1 version: handles only the first part as part of the whole reference.
 */
export function referenceToMarkdown(
	ref: ScriptureReference,
	settings: PluginSettings
): string {
	// In Phase 1, we only have one part, and the originalText of the reference
	// is the whole thing (e.g., "テトス1:14").
	// The requirement says: "表示テキストには元の入力文字列を使用する"

	// For multiple parts (Phase 3), we'll need more complex logic.
	// For now, we take the first verse to generate the Bible ID.
	const firstPart = ref.parts[0];
	const bibleId = generateBibleId(ref.bookNumber, ref.chapter, firstPart.verse);
	const url = generateUrl(bibleId, settings);

	return `[${ref.originalText}](${url})`;
}
