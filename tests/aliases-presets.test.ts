import { describe, it, expect } from 'vitest';
import { getPreset, listAvailableLocales } from '../src/core/aliases-presets';
import masterData from '../data/aliases-master.json';

describe('aliases-presets', () => {
	it('should successfully load the "J" preset', () => {
		const preset = getPreset('J');
		expect(preset).not.toBeNull();
		expect(preset?.name).toBe('日本語');
		expect(preset?.iso).toBe('ja');
		expect(preset?.source).toBe('nwt');
		expect(preset?.aliases).toBeDefined();
		expect(preset?.aliases['啓示']).toBe(66);
	});

	it('should return null for non-existent wtlocale preset', () => {
		const preset = getPreset('Z');
		expect(preset).toBeNull();
	});

	it('should return available locales list containing "J"', () => {
		const locales = listAvailableLocales();
		expect(locales).toContain('J');
	});

	it('should validate the structure of all presets in aliases-master.json', () => {
		const data = masterData as any;
		const keys = Object.keys(data);
		expect(keys.length).toBeGreaterThan(0);

		for (const key of keys) {
			const preset = data[key];
			// Check required fields
			expect(preset).toHaveProperty('name');
			expect(typeof preset.name).toBe('string');

			expect(preset).toHaveProperty('iso');
			expect(typeof preset.iso).toBe('string');

			expect(preset).toHaveProperty('source');
			expect(['nwt', 'community', 'manual']).toContain(preset.source);

			if (preset.note !== undefined) {
				expect(typeof preset.note).toBe('string');
			}

			expect(preset).toHaveProperty('aliases');
			expect(typeof preset.aliases).toBe('object');
			expect(preset.aliases).not.toBeNull();

			// Check all aliases
			const aliases = Object.entries(preset.aliases);
			expect(aliases.length).toBeGreaterThan(0);

			for (const [alias, bookNum] of aliases) {
				expect(typeof alias).toBe('string');
				expect(alias.length).toBeGreaterThan(0);
				expect(typeof bookNum).toBe('number');
				expect(bookNum).toBeGreaterThanOrEqual(1);
				expect(bookNum).toBeLessThanOrEqual(66);
			}
		}
	});
});
