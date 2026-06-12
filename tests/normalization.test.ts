import { describe, it, expect } from 'vitest';
import { normalizeText } from '../src/core/normalization';

describe('normalizeText', () => {
	it('should convert full-width numbers to half-width', () => {
		expect(normalizeText('１２３４５６７８９０')).toBe('1234567890');
	});

	it('should convert full-width colons to half-width', () => {
		expect(normalizeText('：')).toBe(':');
	});

	it('should convert full-width commas to half-width', () => {
		expect(normalizeText('，')).toBe(',');
	});

	it('should convert full-width semicolons to half-width', () => {
		expect(normalizeText('；')).toBe(';');
	});

	it('should convert various hyphens to half-width hyphen', () => {
		expect(normalizeText('−–—ー')).toBe('----');
	});

	it('should convert full-width space to half-width space', () => {
		expect(normalizeText('　')).toBe(' ');
	});

	it('should handle complex strings', () => {
		expect(normalizeText('テトス１：１４')).toBe('テトス1:14');
	});
});
