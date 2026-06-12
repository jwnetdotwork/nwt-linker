export interface ScripturePart {
	verse: number;
	endVerse?: number;
	originalText: string;
	// For multiple verses, we might need a way to store the separator/whitespace
	separator?: string;
}

export interface ScriptureReference {
	bookAlias: string;
	bookNumber: number;
	chapter: number;
	parts: ScripturePart[];
	originalText: string;
	startIndex: number;
	endIndex: number;
}

export interface PluginSettings {
	enabled: boolean;
	debounceTime: number;
	wtlocale: string;
	pub: string;
	urlTemplate: string;
	aliases: Record<string, Record<string, number>>;
	// verseMap will be added in Phase 4
}
