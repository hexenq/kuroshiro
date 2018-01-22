// Type definitions for kuroshiro.js
// Project: https://github.com/Shadowlauch/kuroshiro.js
// Definitions by: Lars Naurath <https://github.com/Shadowlauch>

export function init(options?: { dicPath?: string }, callback?: (err?: any) => void): void;
export function init(callback?: (err?: any) => void): void;

export function convert(str: string, options?: { to?: 'hiragana' | 'katakana' | 'romaji', } & ConvertOptions): string;

export function toHiragana(str: string, options?: ConvertOptions): string;

export function toKatakana(str: string, options?: ConvertOptions): string;

export function toRomaji(str: string, options?: ConvertOptions): string;

export function toKana(str: string, options?: ConvertOptions): string;

export function isHiragana(str: string): boolean;

export function isKatakana(str: string): boolean;

export function isRomaji(str: string): boolean;

export function isKanji(str: string): boolean;

export function hasHiragana(str: string): boolean;

export function hasKatakana(str: string): boolean;

export function hasKanji(str: string): boolean;

interface ConvertOptions {
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana',
    delimiter_start?: string,
    delimiter_end?: string
}

