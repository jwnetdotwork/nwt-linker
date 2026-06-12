import { describe, it, expect } from 'vitest';
import { ensureDefaultAliases } from '../src/core/settings-utils';
import { DEFAULT_SETTINGS } from '../src/core/constants';
import { findBookMatch } from '../src/core/aliases';
import { PluginSettings } from '../src/core/types';

describe('Startup Integration', () => {
	it('should resolve "啓示21:1" on a fresh settings object after normalization', () => {
		// 1. Simulate fresh settings (empty aliases)
		const settings: PluginSettings = {
			...DEFAULT_SETTINGS,
			aliases: {}
		};

		// 2. Run normalization (what happens in loadSettings)
		ensureDefaultAliases(settings);

		// 3. Verify normalization populated the expected alias
		expect(settings.aliases['啓示']).toBe(66);

		// 4. Verify the resolver can now find the book
		const match = findBookMatch('啓示21:1', settings.aliases);
		expect(match).not.toBeNull();
		expect(match?.bookNumber).toBe(66);
		expect(match?.bookAlias).toBe('啓示');
	});
});
