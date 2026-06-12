export interface ExclusionRange {
	start: number;
	end: number;
}

/**
 * Finds all ranges in the text that should be excluded from conversion.
 */
export function getExclusionRanges(text: string): ExclusionRange[] {
	const ranges: ExclusionRange[] = [];

	// 1. Markdown Links [text](url)
	// Regex: \[([^\]]+)\]\(([^)]+)\)
	const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
	let match;
	while ((match = markdownLinkRegex.exec(text)) !== null) {
		ranges.push({ start: match.index, end: match.index + match[0].length });
	}

	// 2. Obsidian Internal Links [[link]]
	const internalLinkRegex = /\[\[([^\]]+)\]\]/g;
	while ((match = internalLinkRegex.exec(text)) !== null) {
		if (!isRangeOverlapping(match.index, match.index + match[0].length, ranges)) {
			ranges.push({ start: match.index, end: match.index + match[0].length });
		}
	}

	// 3. Inline code `code`
	const inlineCodeRegex = /`([^`]+)`/g;
	while ((match = inlineCodeRegex.exec(text)) !== null) {
		if (!isRangeOverlapping(match.index, match.index + match[0].length, ranges)) {
			ranges.push({ start: match.index, end: match.index + match[0].length });
		}
	}

	// 4. Plain URLs
	const urlRegex = /https?:\/\/[^\s]+/g;
	while ((match = urlRegex.exec(text)) !== null) {
		if (!isRangeOverlapping(match.index, match.index + match[0].length, ranges)) {
			ranges.push({ start: match.index, end: match.index + match[0].length });
		}
	}

	// 5. Brackets [...] (excluding those already matched by links)
	const bracketRegex = /\[([^\]]+)\]/g;
	while ((match = bracketRegex.exec(text)) !== null) {
		if (!isRangeOverlapping(match.index, match.index + match[0].length, ranges)) {
			ranges.push({ start: match.index, end: match.index + match[0].length });
		}
	}

	// 6. Parentheses (...)
	const parenRegex = /\(([^)]+)\)/g;
	while ((match = parenRegex.exec(text)) !== null) {
		if (!isRangeOverlapping(match.index, match.index + match[0].length, ranges)) {
			ranges.push({ start: match.index, end: match.index + match[0].length });
		}
	}

	return ranges.sort((a, b) => a.start - b.start);
}

function isRangeOverlapping(start: number, end: number, ranges: ExclusionRange[]): boolean {
	return ranges.some(r => (start >= r.start && start < r.end) || (end > r.start && end <= r.end) || (start <= r.start && end >= r.end));
}

/**
 * Checks if the current line is inside a fenced code block.
 * @param lines All lines of the document.
 * @param currentLineIndex Index of the current line (0-based).
 */
export function isInsideFencedCodeBlock(lines: string[], currentLineIndex: number): boolean {
	let inside = false;
	for (let i = 0; i <= currentLineIndex; i++) {
		if (lines[i].trimStart().startsWith('```')) {
			inside = !inside;
		}
	}
	// If the current line itself is a fence, we should probably treat it as "inside" (or at least "exclude")
	// If the loop ends and 'inside' is true, it means we are AFTER an opening fence but haven't hit a closing one yet.
	// But if the current line is the closing fence, 'inside' will be false.
	// The requirement says "コードブロック内では解析を実行しない" (Do not execute analysis inside code blocks).
	// If the current line is a fence line itself, we should also skip it.

	// Re-evaluation: if lines[currentLineIndex] is '```', it toggled 'inside'.
	// If it was the closing fence, 'inside' becomes false.
	// But we still don't want to convert on the fence line itself.

	// Let's refine:
	let insideBeforeLine = false;
	for (let i = 0; i < currentLineIndex; i++) {
		if (lines[i].trimStart().startsWith('```')) {
			insideBeforeLine = !insideBeforeLine;
		}
	}

	const currentLineIsFence = lines[currentLineIndex].trimStart().startsWith('```');

	return insideBeforeLine || currentLineIsFence;
}
