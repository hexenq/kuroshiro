export = Kuroshiro;
export as namespace Kuroshiro;

declare class Kuroshiro {
    static readonly default: typeof Kuroshiro;
    static Util: Kuroshiro.Utilities;

    init(analyzer: Kuroshiro.Analyzer): Promise<void>;
    convert(str?: string, options?: Kuroshiro.ConvertOptions): Promise<string>;
}

declare namespace Kuroshiro {
    type Target = "hiragana" | "katakana" | "romaji";
    type Mode = "normal" | "spaced" | "okurigana" | "furigana";
    type RomajiSystem = "hepburn" | "nippon" | "passport";

    interface ConvertOptions {
        to?: Target;
        mode?: Mode;
        romajiSystem?: RomajiSystem;
        delimiter_start?: string;
        delimiter_end?: string;
    }

    /** Analyzer-independent token fields used by conversion. */
    interface Token {
        surface_form: string;
        reading?: string;
        pronunciation?: string;
        pos?: string;
        pos_detail_1?: string;
        pos_detail_2?: string;
        pos_detail_3?: string;
        conjugated_type?: string;
        conjugated_form?: string;
        basic_form?: string;
        verbose?: unknown;
    }

    /** Custom analyzers may return values directly or through a Promise. */
    interface Analyzer {
        init(): void | PromiseLike<unknown>;
        parse(str: string): Token[] | PromiseLike<Token[]>;
    }

    interface Utilities {
        isHiragana(ch: string): boolean;
        isKatakana(ch: string): boolean;
        isKana(ch: string): boolean;
        isKanji(ch: string): boolean;
        isJapanese(ch: string): boolean;
        hasHiragana(str: string): boolean;
        hasKatakana(str: string): boolean;
        hasKana(str: string): boolean;
        hasKanji(str: string): boolean;
        hasJapanese(str: string): boolean;
        kanaToHiragana(str: string): string;
        /** Legacy spelling retained for compatibility. */
        kanaToHiragna(str: string): string;
        kanaToKatakana(str: string): string;
        kanaToRomaji(str: string, system?: RomajiSystem): string;
    }
}
