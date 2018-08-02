/**
 * @jest-environment jsdom
 */

import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
import Kuroshiro from "../src";

describe("Kuroshiro Browser Test", () => {
    const EXAMPLE_TEXT = "感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！";

    let kuroshiro;

    beforeAll(async () => {
        kuroshiro = new Kuroshiro();
        await kuroshiro.init(new KuromojiAnalyzer());
    });
    it("Util Test", () => {
        const ori = "公";
        const result = Kuroshiro.Util.isKanji(ori);
        expect(result).toBeTruthy();
    });
    it("Convert Test", async () => {
        const ori = EXAMPLE_TEXT;
        const result = await kuroshiro.convert(ori, { to: "hiragana" });
        expect(result).toEqual("かんじとれたらてをつなごう、かさなるのはじんせいのライン and レミリアさいこう！");
    });
});
