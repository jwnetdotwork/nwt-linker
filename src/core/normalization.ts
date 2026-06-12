/**
 * Normalizes full-width characters to their half-width equivalents.
 */
export function normalizeText(text: string): string {
	return text
		.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
		.replace(/：/g, ':')
		.replace(/，/g, ',')
		.replace(/；/g, ';')
		.replace(/[−–—ー]/g, '-')
		.replace(/　/g, ' '); // Full-width space to half-width space
}
