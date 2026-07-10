export interface ScripturePart {
	verse: number;
	endVerse?: number;
	originalText: string;
	/** The text (like a comma and space) that precedes this part. */
	precedingText?: string;
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

export interface LocalePreset {
	name: string;
	iso: string;
	source: 'nwt' | 'community' | 'manual';
	note?: string;
	aliases: Record<string, number>;
}

export interface PluginSettings {
	enabled: boolean;
	debounceMs: number;
	wtlocale: string;
	pub: string;
	urlTemplate: string;
	aliases: Record<string, number>;
	/** The wtlocale of the preset loaded directly preceding, or null if custom edited. */
	loadedPreset: string | null;
}
