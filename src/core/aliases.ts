export interface BookMatch {
	bookNumber: number;
	bookAlias: string;
	matchLength: number;
}

/**
 * Finds the best book match (longest match) from the beginning of the input string.
 */
export function findBookMatch(
	text: string,
	aliases: Record<string, number>,
): BookMatch | null {
	let bestMatch: BookMatch | null = null;

	for (const [alias, bookNumber] of Object.entries(aliases)) {
		if (text.startsWith(alias)) {
			if (!bestMatch || alias.length > bestMatch.matchLength) {
				bestMatch = {
					bookNumber,
					bookAlias: alias,
					matchLength: alias.length,
				};
			}
		}
	}

	return bestMatch;
}

/**
 * Sorts aliases by length descending to ensure longest match if we were to use a regex,
 * but findBookMatch above already handles it by iterating and keeping the best match.
 */
export function getSortedAliases(aliases: Record<string, number>): [string, number][] {
	return Object.entries(aliases).sort((a, b) => b[0].length - a[0].length);
}
