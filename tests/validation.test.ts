import { describe, it, expect } from 'vitest';
import { parseSingleReference } from '../src/core/parser';
import verseMap from '../data/verse-map.json';

const aliases = {
    "テトス": 56,
    "啓示": 66
};

describe('Phase 4 Validation', () => {
    it('should validate book number existence', () => {
        // Book 99 does not exist in verseMap
        expect(parseSingleReference('Unknown 1:1', { "Unknown": 99 }, 0, verseMap as any)).toBeNull();
    });

    it('should validate chapter existence', () => {
        // Titus has 3 chapters
        expect(parseSingleReference('テトス3:1', aliases, 0, verseMap as any)).not.toBeNull();
        expect(parseSingleReference('テトス4:1', aliases, 0, verseMap as any)).toBeNull();
    });

    it('should validate verse existence', () => {
        // Titus 1 has 16 verses
        expect(parseSingleReference('テトス1:16', aliases, 0, verseMap as any)).not.toBeNull();
        expect(parseSingleReference('テトス1:17', aliases, 0, verseMap as any)).toBeNull();
    });

    it('should validate range start and end existence', () => {
        // Revelation 21 has 27 verses
        expect(parseSingleReference('啓示21:1-27', aliases, 0, verseMap as any)).not.toBeNull();
        expect(parseSingleReference('啓示21:1-28', aliases, 0, verseMap as any)).toBeNull();
    });

    it('should validate range start <= range end', () => {
        expect(parseSingleReference('啓示21:5-3', aliases, 0, verseMap as any)).toBeNull();
    });

    it('should validate all parts in a multiple specification', () => {
        // Titus 1:1, 16 is valid, 1:1, 17 is invalid
        expect(parseSingleReference('テトス1:1,16', aliases, 0, verseMap as any)).not.toBeNull();
        expect(parseSingleReference('テトス1:1,17', aliases, 0, verseMap as any)).toBeNull();
    });
});
