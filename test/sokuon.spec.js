/**
 * @jest-environment node
 *
 * Regression tests for lone-sokuon romanisation.
 *
 * Reported upstream as takuyaa/kuromoji.js#53 ("座って -> suwatsute,
 * should be suwatte"), filed against the tokenizer. It is not a tokenizer
 * bug — kuromoji returns 座っ[スワッ] + て[テ], which is correct. The error
 * is here: the furigana renderer romanises each notation independently,
 * so a sokuon standing on its own has no following consonant to geminate
 * and falls through to the literal "tsu".
 *
 * For 座って, patchTokens already merges the verb-tail sokuon with the
 * following token, so normal mode passes. Furigana splits the patched
 * token back into notations and needs its own boundary handling.
 */

import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import Kuroshiro from "../src";

/** Strip the <rp> fallbacks and the wrapper so assertions read clearly. */
const plain = str => str.replace(/<rp>.*?<\/rp>/g, "").replace(/<\/?ruby>/g, "");

describe("Lone sokuon romanisation", () => {
    let kuroshiro;

    beforeAll(async () => {
        kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer());
    });

    describe("furigana mode geminates instead of emitting 'tsu'", () => {
        it("座って (verb, sokuon in okurigana)", async () => {
            const result = await kuroshiro.convert("座って", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toBe("座<rt>suwa</rt>って<rt>tte</rt>");
            expect(result).not.toContain("tsu");
        });

        it("行った (verb, different consonant)", async () => {
            const result = await kuroshiro.convert("行った", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toBe("行<rt>i</rt>った<rt>tta</rt>");
        });

        it("真っ赤 (sokuon between two kanji)", async () => {
            const result = await kuroshiro.convert("真っ赤", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toBe("真<rt>ma</rt>っ赤<rt>kka</rt>");
        });

        it("カッター (katakana sokuon)", async () => {
            const result = await kuroshiro.convert("カッター", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toContain("ッタ<rt>tta</rt>");
        });
    });

    describe("cases that were already correct stay correct", () => {
        it("normal mode romanises the token as a unit", async () => {
            expect(await kuroshiro.convert("座って", { to: "romaji", mode: "normal" })).toBe("suwatte");
            expect(await kuroshiro.convert("真っ赤", { to: "romaji", mode: "normal" })).toBe("makka");
        });

        it("a sokuon inside a single token is untouched", async () => {
            const result = await kuroshiro.convert("切符", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toBe("切符<rt>kippu</rt>");
        });

        it("hiragana furigana output is unchanged", async () => {
            const result = await kuroshiro.convert("座って", { to: "hiragana", mode: "furigana" });
            expect(plain(result)).toBe("座<rt>すわ</rt>って");
        });

        it("text with no sokuon is unchanged", async () => {
            const result = await kuroshiro.convert("心を燃やせ", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toBe("心<rt>kokoro</rt>を<rt>o</rt>燃<rt>mo</rt>や<rt>ya</rt>せ<rt>se</rt>");
        });
    });

    describe("known limitation", () => {
        it("a trailing sokuon has nothing to geminate and is left alone", async () => {
            // 「あっ」 has no following mora. There is no agreed romanisation
            // for a stranded sokuon, so this is deliberately not changed.
            const result = await kuroshiro.convert("あっ", { to: "romaji", mode: "furigana" });
            expect(plain(result)).toContain("っ<rt>tsu</rt>");
        });
    });

    describe.each(["hepburn", "passport", "nippon"])("%s boundary regressions", (romajiSystem) => {
        it.each([
            ["座って", "suwatte", "suwatte"],
            ["真っ赤", "makka", "makka"],
            ["買っちゃった", "katchatta", "kattyatta"],
            ["いっしょ", "issho", "issyo"],
            ["マッチャ", "matcha", "mattya"],
            ["切符", "kippu", "kippu"]
        ])("keeps the full mora after a sokuon in %s", async (text, hepburn, nippon) => {
            const result = await kuroshiro.convert(text, { to: "romaji", mode: "furigana", romajiSystem });
            const readings = [...result.matchAll(/<rt>(.*?)<\/rt>/g)].map(match => match[1]).join("");
            expect(readings).toBe(romajiSystem === "nippon" ? nippon : hepburn);
            expect(result.replace(/<rp>.*?<\/rp>|<rt>.*?<\/rt>|<\/?ruby>/g, "")).toBe(text);
        });

        it.each(["cat", "！", " ", "あ", "ー", "🙂", ""])("does not merge a sokuon into %s", async (suffix) => {
            // Fixed tokens isolate renderer boundaries from dictionary/POS changes.
            const instance = new Kuroshiro();
            await instance.init({
                init: async () => {},
                parse: async () => [
                    { surface_form: "っ", reading: "ッ", pronunciation: "ッ" },
                    ...(suffix ? [{ surface_form: suffix }] : [])
                ]
            });
            const result = await instance.convert("っ" + suffix, { to: "romaji", mode: "furigana", romajiSystem });
            expect(plain(result)).toMatch(/^っ<rt>tsu<\/rt>/);
            if (suffix === "cat") expect(plain(result)).toBe("っ<rt>tsu</rt>c<rt>c</rt>a<rt>a</rt>t<rt>t</rt>");
        });

        it("preserves non-romaji output and kanji-only okurigana annotations", async () => {
            const options = { mode: "furigana", romajiSystem };
            expect(plain(await kuroshiro.convert("座って", { ...options, to: "hiragana" }))).toBe("座<rt>すわ</rt>って");
            expect(plain(await kuroshiro.convert("座って", { ...options, to: "katakana" }))).toBe("座<rt>スワ</rt>って");
            expect(await kuroshiro.convert("真っ赤", { to: "romaji", mode: "okurigana", romajiSystem })).toBe("真(ma)っ赤(kka)");
            expect(await kuroshiro.convert("買っちゃった", { to: "romaji", mode: "okurigana", romajiSystem })).toBe("買(ka)っちゃった");
            expect(await kuroshiro.convert("あっcat", { to: "romaji", mode: "normal", romajiSystem })).toBe("atsucat");
            expect(await kuroshiro.convert("座って", { to: "romaji", mode: "spaced", romajiSystem })).toBe("suwatte");
        });
    });
});
