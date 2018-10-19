/**
 * @jest-environment node
 */

import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import Kuroshiro from "../src";
import { patchTokens } from "../src/util";

describe("Kuroshiro Node Initialization Test", () => {
    let kuroshiro;

    beforeAll(async () => {
        kuroshiro = new Kuroshiro();
    });
    it("Invalid Initialization Parameter(1)", async (done) => {
        try {
            await kuroshiro.init();
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Invalid Initialization Parameter(2)", async (done) => {
        try {
            await kuroshiro.init("param");
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Invalid Initialization Parameter(3)", async (done) => {
        try {
            await kuroshiro.init({});
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Repeated Initialization", async (done) => {
        try {
            await kuroshiro.init(new KuromojiAnalyzer());
            await kuroshiro.init(new KuromojiAnalyzer());
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
});

describe("Kuroshiro Node Funtional Test", () => {
    const EXAMPLE_TEXT = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";
    const EXAMPLE_TEXT2 = "ブラウン管への愛が足りねぇな";
    const EXAMPLE_TEXT3 = "関ヶ原の戦い";
    const EXAMPLE_TEXT4 = "綺麗な花。面白い映画。面白かったです。";
    const EXAMPLE_TEXT5 = "言い訳";
    const EXAMPLE_TEXT6 = "可愛い";

    let kuroshiro;

    beforeAll(async () => {
        kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer());
    });
    it("Convert - Wrong Parameter - Invalid Target Syllabary", async (done) => {
        const ori = EXAMPLE_TEXT;
        try {
            const result = await kuroshiro.convert(ori, { to: "xxxx" });
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Convert - Wrong Parameter - Invalid Conversion Mode", async (done) => {
        const ori = EXAMPLE_TEXT;
        try {
            const result = await kuroshiro.convert(ori, { to: "hiragana", mode: "xxxx" });
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Convert - Wrong Parameter - Invalid Romanization System", async (done) => {
        const ori = EXAMPLE_TEXT;
        try {
            const result = await kuroshiro.convert(ori, { to: "hiragana", romajiSystem: "xxxx" });
            done("SHOULD NOT BE HERE");
        }
        catch (err) {
            done();
        }
    });
    it("Token Patch", () => {
        const tokens = JSON.parse("[{\"surface_form\":\"綺麗\",\"pos\":\"名詞\",\"reading\":\"きれい\"},{\"surface_form\":\"な\",\"pos\":\"助動詞\"},{\"surface_form\":\"花\",\"pos\":\"名詞\",\"reading\":\"ハナ\"},{\"surface_form\":\"。\",\"pos\":\"記号\",\"reading\":\"。\"},{\"surface_form\":\"面白い\",\"pos\":\"形容詞\",\"reading\":\"オモシロイ\"},{\"surface_form\":\"映画\",\"pos\":\"名詞\",\"reading\":\"エイガ\"},{\"surface_form\":\"。\",\"pos\":\"記号\",\"reading\":\"。\"},{\"surface_form\":\"面白かっ\",\"pos\":\"形容詞\",\"reading\":\"オモシロカッ\"},{\"surface_form\":\"た\",\"pos\":\"助動詞\",\"reading\":\"タ\"},{\"surface_form\":\"です\",\"pos\":\"助動詞\",\"reading\":\"デス\"},{\"surface_form\":\"。\",\"pos\":\"記号\",\"reading\":\"。\"},{\"surface_form\":\"繋ご\",\"pos\":\"動詞\",\"reading\":\"ツナゴ\"},{\"surface_form\":\"う\",\"pos\":\"助動詞\",\"reading\":\"ウ\"},{\"surface_form\":\"うp\",\"pos\":\"名詞\"}]");
        const result = patchTokens(tokens);
        expect(result).toHaveLength(12);
    });
    it("Kana Character Recognition", () => {
        const ori = "こ";
        const result = Kuroshiro.Util.isKana(ori);
        expect(result).toBeTruthy();
    });
    it("Kanji Character Recognition", () => {
        const ori = "公";
        const result = Kuroshiro.Util.isKanji(ori);
        expect(result).toBeTruthy();
    });
    it("Kana-mixed String Recognition(T)", () => {
        const ori = "この公園の中で";
        const result = Kuroshiro.Util.hasKana(ori);
        expect(result).toBeTruthy();
    });
    it("Kana-mixed String Recognition(F)", () => {
        const ori = "abc漢字";
        const result = Kuroshiro.Util.hasKana(ori);
        expect(result).toBeFalsy();
    });
    it("Kanji-mixed String Recognition", () => {
        const ori = "この公園の中で";
        const result = Kuroshiro.Util.hasKanji(ori);
        expect(result).toBeTruthy();
    });
    it("Kana to Hiragana", () => {
        const ori = "サカナ";
        const result = Kuroshiro.Util.kanaToHiragna(ori);
        expect(result).toEqual("さかな");
    });
    it("Kana to Katakana", () => {
        const ori = "さかな";
        const result = Kuroshiro.Util.kanaToKatakana(ori);
        expect(result).toEqual("サカナ");
    });
    it("Kana to Romaji (nippon-shiki)", () => {
        const ori = "サポート";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "nippon");
        expect(result).toEqual("sapôto");
    });
    it("Kana to Romaji (passport-shiki)", () => {
        const ori = "サポート";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "passport");
        expect(result).toEqual("sapoto");
    });
    it("Kana to Romaji (hepburn-shiki)(1)", () => {
        const ori = "サポート";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "hepburn");
        expect(result).toEqual("sapōto");
    });
    it("Kana to Romaji (hepburn-shiki)(2)", () => {
        const ori = "ナンバ";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "hepburn");
        expect(result).toEqual("namba");
    });
    it("Kana to Romaji (hepburn-shiki)(3)", () => {
        const ori = "まんえんいか";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "hepburn");
        expect(result).toEqual("man'en'ika");
    });
    it("Kana to Romaji (hepburn-shiki)(4)", () => {
        const ori = "まっちゃ";
        const result = Kuroshiro.Util.kanaToRomaji(ori, "hepburn");
        expect(result).toEqual("matcha");
    });
    it("Kanji to Hiragana(1)", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！");
    });
    it("Kanji to Hiragana(2)", async () => {
        const ori = EXAMPLE_TEXT2;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("ブラウンかんへのあいがたりねぇな");
    });
    it("Kanji to Hiragana(3)", async () => {
        const ori = EXAMPLE_TEXT3;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("せきがはらのたたかい");
    });
    it("Kanji to Katakana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "katakana" });
        expect(result).toEqual("カンジトレタラテヲツナゴウ、カサナルノハジンセイノライン and レミリアサイコウ！");
    });
    it("Kanji to Katakana (Simple One Chara)", async () => {
        const ori = "あ い う え お か き く け こ さ し す せ そ た ち つ て と な に ぬ ね の は ひ ふ へ ほ ま み む め も や ゆ よ ら り る れ ろ わ を ん が ぎ ぐ げ ご ざ じ ず ぜ ぞ だ ぢ づ で ど ば び ぶ べ ぼ ぱ ぴ ぷ ぺ ぽ きゃ きゅ きょ しゃ しゅ しょ ちゃ ちゅ ちょ にゃ にゅ にょ ひゃ ひゅ ひょ みゃ みゅ みょ りゃ りゅ りょ ぎゃ ぎゅ ぎょ じゃ じゅ じょ びゃ びゅ びょ ぴゃ ぴゅ ぴょ";
        const result = await kuroshiro.convert(ori, { to: "katakana" });
        expect(result).toEqual("ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド バ ビ ブ ベ ボ パ ピ プ ペ ポ キャ キュ キョ シャ シュ ショ チャ チュ チョ ニャ ニュ ニョ ヒャ ヒュ ヒョ ミャ ミュ ミョ リャ リュ リョ ギャ ギュ ギョ ジャ ジュ ジョ ビャ ビュ ビョ ピャ ピュ ピョ");
    });
    it("Kanji to Romaji", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "romaji" });
        expect(result).toEqual("kanjitoretarateotsunagō,kasanarunowajinseinorain and remiriasaikō!");
    });
    it("Kanji to Romaji with sokuon", async () => {
        const ori = "勝手に買っちゃったんだ";
        const result = await kuroshiro.convert(ori, { mode: "spaced", to: "romaji" });
        expect(result).toEqual("katte ni katchatta n da");
    });
    it("Kanji to Romaji with spaces", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "spaced", to: "romaji" });
        expect(result).toEqual("kanjitore tara te o tsunagō , kasanaru no wa jinsei no rain   and   remi ria saikō !");
    });
    it("Kanji to Romaji with passport-shiki romaji system", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "romaji", romajiSystem: "passport" });
        expect(result).toEqual("kanjitoretarateotsunago,kasanarunowajinseinorain and remiriasaiko!");
    });
    it("Kanji to Romaji misc with hepburn-shiki romaji system", async () => {
        const ori = "東京、九州、丸の内、観桜、呼応、思う、長雨、記入、金融、学校、ビール、お母さん、委員";
        const result = await kuroshiro.convert(ori, { to: "romaji" });
        expect(result).toEqual("tōkyō,kyūshū,marunouchi,kan'ō,koō,omou,nagaame,kinyū,kin'yū,gakkō,bīru,okāsan,iin");
    });
    it("Kanji to Romaji misc with nippon-shiki romaji system", async () => {
        const ori = "東京、九州、丸の内、観桜、呼応、思う、長雨、記入、金融、学校、ビール、お母さん、委員";
        const result = await kuroshiro.convert(ori, { to: "romaji", romajiSystem: "nippon" });
        expect(result).toEqual("tôkyô,kyûsyû,marunouti,kan'ô,koô,omou,nagaame,kinyû,kin'yû,gakkô,bîru,okâsan,iin");
    });
    it("Kanji to Romaji misc with passport-shiki romaji system", async () => {
        const ori = "東京、九州、丸の内、観桜、呼応、思う、長雨、記入、金融、学校、ビール、お母さん、委員";
        const result = await kuroshiro.convert(ori, { to: "romaji", romajiSystem: "passport" });
        expect(result).toEqual("tokyo,kyushu,marunouchi,kano,koo,omou,nagaame,kinyu,kinyu,gakko,biru,okasan,iin");
    });
    it("Kanji to Hiragana with spaces", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "spaced", to: "hiragana" });
        expect(result).toEqual("かんじとれ たら て を つなごう 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！");
    });
    it("Kanji to Katakana with spaces", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "spaced", to: "katakana" });
        expect(result).toEqual("カンジトレ タラ テ ヲ ツナゴウ 、 カサナル ノ ハ ジンセイ ノ ライン   and   レミ リア サイコウ ！");
    });
    it("Kanji to Hiragana with okurigana(1)", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！");
    });
    it("Kanji to Hiragana with okurigana(2)", async () => {
        const ori = EXAMPLE_TEXT2;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("ブラウン管(かん)への愛(あい)が足(た)りねぇな");
    });
    it("Kanji to Hiragana with okurigana(3)", async () => {
        const ori = EXAMPLE_TEXT3;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("関ヶ原(せきがはら)の戦(たたか)い");
    });
    it("Kanji to Hiragana with okurigana(4)", async () => {
        const ori = EXAMPLE_TEXT4;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("綺麗(きれい)な花(はな)。面白(おもしろ)い映画(えいが)。面白(おもしろ)かったです。");
    });
    it("Kanji to Hiragana with okurigana(5)", async () => {
        const ori = EXAMPLE_TEXT5;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("言(い)い訳(わけ)");
    });
    it("Kanji to Hiragana with okurigana(6)", async () => {
        const ori = EXAMPLE_TEXT6;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "hiragana" });
        expect(result).toEqual("可愛(かわい)い");
    });
    it("Kanji to Katakana with okurigana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "katakana" });
        expect(result).toEqual("感(カン)じ取(ト)れたら手(テ)を繋(ツナ)ごう、重(カサ)なるのは人生(ジンセイ)のライン and レミリア最高(サイコウ)！");
    });
    it("Kanji to Romaji with okurigana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "okurigana", to: "romaji" });
        expect(result).toEqual("感(kan)じ取(to)れたら手(te)を繋(tsuna)ごう、重(kasa)なるのは人生(jinsei)のライン and レミリア最高(saikō)！");
    });
    it("Kanji to Hiragana with furigana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "furigana", to: "hiragana" });
        expect(result).toEqual("<ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！");
    });
    it("Kanji to Katakana with furigana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "furigana", to: "katakana" });
        expect(result).toEqual("<ruby>感<rp>(</rp><rt>カン</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>ト</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>テ</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>ツナ</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>カサ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>ジンセイ</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>サイコウ</rt><rp>)</rp></ruby>！");
    });
    it("Kanji to Romaji with furigana", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { mode: "furigana", to: "romaji" });
        expect(result).toEqual("<ruby>感<rp>(</rp><rt>kan</rt><rp>)</rp>じ<rp>(</rp><rt>ji</rt><rp>)</rp>取<rp>(</rp><rt>to</rt><rp>)</rp>れ<rp>(</rp><rt>re</rt><rp>)</rp>た<rp>(</rp><rt>ta</rt><rp>)</rp>ら<rp>(</rp><rt>ra</rt><rp>)</rp>手<rp>(</rp><rt>te</rt><rp>)</rp>を<rp>(</rp><rt>o</rt><rp>)</rp>繋<rp>(</rp><rt>tsuna</rt><rp>)</rp>ご<rp>(</rp><rt>go</rt><rp>)</rp>う<rp>(</rp><rt>u</rt><rp>)</rp>、<rp>(</rp><rt>,</rt><rp>)</rp>重<rp>(</rp><rt>kasa</rt><rp>)</rp>な<rp>(</rp><rt>na</rt><rp>)</rp>る<rp>(</rp><rt>ru</rt><rp>)</rp>の<rp>(</rp><rt>no</rt><rp>)</rp>は<rp>(</rp><rt>wa</rt><rp>)</rp>人生<rp>(</rp><rt>jinsei</rt><rp>)</rp>の<rp>(</rp><rt>no</rt><rp>)</rp>ラ<rp>(</rp><rt>ra</rt><rp>)</rp>イ<rp>(</rp><rt>i</rt><rp>)</rp>ン<rp>(</rp><rt>n</rt><rp>)</rp> <rp>(</rp><rt> </rt><rp>)</rp>a<rp>(</rp><rt>a</rt><rp>)</rp>n<rp>(</rp><rt>n</rt><rp>)</rp>d<rp>(</rp><rt>d</rt><rp>)</rp> <rp>(</rp><rt> </rt><rp>)</rp>レ<rp>(</rp><rt>re</rt><rp>)</rp>ミ<rp>(</rp><rt>mi</rt><rp>)</rp>リ<rp>(</rp><rt>ri</rt><rp>)</rp>ア<rp>(</rp><rt>a</rt><rp>)</rp>最高<rp>(</rp><rt>saikō</rt><rp>)</rp>！<rp>(</rp><rt>!</rt><rp>)</rp></ruby>");
    });
});
