var expect = require("chai").expect;
import kuroshiro from "../src/index.js";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"; 

describe("kuroshiro.js Test", function () {
    const EXAMPLE_TEXT = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";
    const EXAMPLE_TEXT2 = "ブラウン管への愛が足りねぇな";
    const EXAMPLE_TEXT3 = "関ヶ原の戦い";
    const EXAMPLE_TEXT4 = "綺麗な花。面白い映画。面白かったです。";

    before(function(done){
        kuroshiro.init(new KuromojiAnalyzer(), done);
    });
    it("Kanji Character Recognition", function () {
        var ori = '公';
        var result = kuroshiro.isKanji(ori);
        expect(result).to.be.true;
    });
    it("Kanji-mixed String Recognition", function () {
        var ori = 'この公園の中で';
        var result = kuroshiro.hasKanji(ori);
        expect(result).to.be.true;
    });
    it("Kanji to Hiragana(1)", function (done) {
        var ori = EXAMPLE_TEXT;
        var result = kuroshiro.convert(ori,{to:'hiragana'}, function(result){
            expect(result).to.eql('かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！');
            done();
        });        
    });
    it("Kanji to Hiragana(2)", function (done) {
        var ori = EXAMPLE_TEXT2;
        var result = kuroshiro.convert(ori,{to:'hiragana'}, function(result){
            expect(result).to.eql('ブラウンかんへのあいがたりねぇな');
            done();
        });
    });
    it("Kanji to Hiragana(3)", function (done) {
        var ori = EXAMPLE_TEXT3;
        var result = kuroshiro.convert(ori,{to:'hiragana'}, function(result){
            expect(result).to.eql('せきがはらのたたかい');
            done();
        });
    });
    // it("Kanji to Katakana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{to:'katakana'});
    //     expect(result).to.eql('カンジトレタラテヲツナゴウ、カサナルノハジンセイノライン and レミリアサイコウ！');
    // });
    // it("Kanji to Romaji", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{to:'romaji'});
    //     expect(result).to.eql('kanjitoretaratewotsunagou,kasanarunohajinseinorain and remiriasaikou!');
    // });
    // it("Kanji to Hiragana with spaces", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'spaced', to:'hiragana'});
    //     expect(result).to.eql('かんじとれ たら て を つなご う 、 かさなる の は じんせい の ライン   and   レミ リア さいこう ！');
    // });
    // it("Kanji to Katakana with spaces", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'spaced', to:'katakana'});
    //     expect(result).to.eql('カンジトレ タラ テ ヲ ツナゴ ウ 、 カサナル ノ ハ ジンセイ ノ ライン   and   レミ リア サイコウ ！');
    // });
    // it("Kanji to Romaji with spaces", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'spaced', to:'romaji'});
    //     expect(result).to.eql('kanjitore tara te wo tsunago u , kasanaru no ha jinsei no rain   and   remi ria saikou !');
    // });
    // it("Kanji to Hiragana with okurigana(1)", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'hiragana'});
    //     expect(result).to.eql('感(かん)じ取(と)れたら手(て)を繋(つな)ごう、重(かさ)なるのは人生(じんせい)のライン and レミリア最高(さいこう)！');
    // });
    // it("Kanji to Hiragana with okurigana(2)", function () {
    //     var ori = EXAMPLE_TEXT2;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'hiragana'});
    //     expect(result).to.eql('ブラウン管(かん)への愛(あい)が足(た)りねぇな');
    // });
    // it("Kanji to Hiragana with okurigana(3)", function () {
    //     var ori = EXAMPLE_TEXT3;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'hiragana'});
    //     expect(result).to.eql('関ヶ原(せきがはら)の戦(たたか)い');
    // });
    // it("Kanji to Hiragana with okurigana(4)", function () {
    //     var ori = EXAMPLE_TEXT4;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'hiragana'});
    //     expect(result).to.eql('綺麗(きれい)な花(はな)。面白(おもしろ)い映画(えいが)。面白(おもしろ)かったです。');
    // });
    // it("Kanji to Katakana with okurigana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'katakana'});
    //     expect(result).to.eql('感(カン)じ取(ト)れたら手(テ)を繋(ツナ)ごう、重(カサ)なるのは人生(ジンセイ)のライン and レミリア最高(サイコウ)！');
    // });
    // it("Kanji to Romaji with okurigana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'okurigana', to:'romaji'});
    //     expect(result).to.eql('感(kan)じ取(to)れたら手(te)を繋(tsuna)ごう、重(kasa)なるのは人生(jinsei)のライン and レミリア最高(saikou)！');
    // });
    // it("Kanji to Hiragana with furigana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'furigana', to:'hiragana'});
    //     expect(result).to.eql('<ruby>感<rp>(</rp><rt>かん</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>と</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>て</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>つな</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>かさ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>じんせい</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>さいこう</rt><rp>)</rp></ruby>！');
    // });
    // it("Kanji to Katakana with furigana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'furigana', to:'katakana'});
    //     expect(result).to.eql('<ruby>感<rp>(</rp><rt>カン</rt><rp>)</rp></ruby>じ<ruby>取<rp>(</rp><rt>ト</rt><rp>)</rp></ruby>れたら<ruby>手<rp>(</rp><rt>テ</rt><rp>)</rp></ruby>を<ruby>繋<rp>(</rp><rt>ツナ</rt><rp>)</rp></ruby>ごう、<ruby>重<rp>(</rp><rt>カサ</rt><rp>)</rp></ruby>なるのは<ruby>人生<rp>(</rp><rt>ジンセイ</rt><rp>)</rp></ruby>のライン and レミリア<ruby>最高<rp>(</rp><rt>サイコウ</rt><rp>)</rp></ruby>！');
    // });
    // it("Kanji to Romaji with furigana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.convert(ori,{mode:'furigana', to:'romaji'});
    //     expect(result).to.eql('<ruby>感<rp>(</rp><rt>kan</rt><rp>)</rp>じ<rp>(</rp><rt>ji</rt><rp>)</rp>取<rp>(</rp><rt>to</rt><rp>)</rp>れ<rp>(</rp><rt>re</rt><rp>)</rp>た<rp>(</rp><rt>ta</rt><rp>)</rp>ら<rp>(</rp><rt>ra</rt><rp>)</rp>手<rp>(</rp><rt>te</rt><rp>)</rp>を<rp>(</rp><rt>wo</rt><rp>)</rp>繋<rp>(</rp><rt>tsuna</rt><rp>)</rp>ご<rp>(</rp><rt>go</rt><rp>)</rp>う<rp>(</rp><rt>u</rt><rp>)</rp>、<rp>(</rp><rt>,</rt><rp>)</rp>重<rp>(</rp><rt>kasa</rt><rp>)</rp>な<rp>(</rp><rt>na</rt><rp>)</rp>る<rp>(</rp><rt>ru</rt><rp>)</rp>の<rp>(</rp><rt>no</rt><rp>)</rp>は<rp>(</rp><rt>ha</rt><rp>)</rp>人生<rp>(</rp><rt>jinsei</rt><rp>)</rp>の<rp>(</rp><rt>no</rt><rp>)</rp>ラ<rp>(</rp><rt>ra</rt><rp>)</rp>イ<rp>(</rp><rt>i</rt><rp>)</rp>ン<rp>(</rp><rt>n</rt><rp>)</rp> <rp>(</rp><rt> </rt><rp>)</rp>a<rp>(</rp><rt>a</rt><rp>)</rp>n<rp>(</rp><rt>n</rt><rp>)</rp>d<rp>(</rp><rt>d</rt><rp>)</rp> <rp>(</rp><rt> </rt><rp>)</rp>レ<rp>(</rp><rt>re</rt><rp>)</rp>ミ<rp>(</rp><rt>mi</rt><rp>)</rp>リ<rp>(</rp><rt>ri</rt><rp>)</rp>ア<rp>(</rp><rt>a</rt><rp>)</rp>最高<rp>(</rp><rt>saikou</rt><rp>)</rp>！<rp>(</rp><rt>!</rt><rp>)</rp></ruby>');
    // });
    // it("Function toHiragana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.toHiragana(ori);
    //     expect(result).to.eql('かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！');
    // });
    // it("Function toKatakana", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.toKatakana(ori);
    //     expect(result).to.eql('カンジトレタラテヲツナゴウ、カサナルノハジンセイノライン and レミリアサイコウ！');
    // });
    // it("Function toRomaji", function () {
    //     var ori = EXAMPLE_TEXT;
    //     var result = kuroshiro.toRomaji(ori);
    //     expect(result).to.eql('kanjitoretaratewotsunagou,kasanarunohajinseinorain and remiriasaikou!');
    // });
});