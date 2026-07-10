import masterData from '../../data/aliases-master.json';
import { LocalePreset } from './types';

export type { LocalePreset };

const PRESETS: Record<string, LocalePreset> = masterData as Record<string, LocalePreset>;

/** 指定 wtlocale のプリセットを返す。なければ null。 */
export function getPreset(wtlocale: string): LocalePreset | null {
	return PRESETS[wtlocale.toUpperCase()] ?? null;
}

/** バンドルされている wtlocale 一覧。 */
export function listAvailableLocales(): string[] {
	return Object.keys(PRESETS);
}
