import Kuroshiro = require("kuroshiro");

const options: Kuroshiro.ConvertOptions = {
    to: "romaji", mode: "furigana", romajiSystem: "passport",
    delimiter_start: "[", delimiter_end: "]"
};
const asyncAnalyzer: Kuroshiro.Analyzer = {
    init: async () => {},
    parse: async (text) => [{ surface_form: text }]
};
const syncAnalyzer: Kuroshiro.Analyzer = {
    init() {},
    parse: text => [{ surface_form: text, reading: "ニホンゴ" }]
};

async function check() {
    const core = new Kuroshiro();
    const initialized: Promise<void> = core.init(syncAnalyzer);
    await initialized;
    const converted: string = await core.convert("日本語");
    if (converted !== "にほんご") throw new Error(converted);
    const empty: string = await core.convert();
    if (empty !== "") throw new Error(empty);
    const other = new Kuroshiro.default();
    await other.init(asyncAnalyzer);
    await other.convert("abc", options);
    const utility: Kuroshiro.Utilities = Kuroshiro.Util;
    const result: string = utility.kanaToRomaji("カンジ");
    if (result !== "kanji") throw new Error(result);
    if (utility.kanaToHiragana !== utility.kanaToHiragna) throw new Error("Alias mismatch");
    const isKana: boolean = utility.isKana("あ");
    if (!isKana) throw new Error("Expected kana");
}
void check();

function invalid() {
    const core = new Kuroshiro();
    // @ts-expect-error Utilities belong to the constructor, not an instance.
    core.Util.isKana("あ");
    // @ts-expect-error Target must match a supported conversion target.
    core.convert("日本語", { to: "latin" });
    // @ts-expect-error Raw mode is not implemented.
    core.convert("日本語", { mode: "raw" });
    // @ts-expect-error JIS is not a supported system.
    core.convert("日本語", { romajiSystem: "jis" });
    // @ts-expect-error Delimiters must be strings.
    core.convert("日本語", { delimiter_start: 1 });
    // @ts-expect-error Missing analyzer parse method.
    core.init({ init() {} });
    // @ts-expect-error Tokens must contain their original text.
    core.init({ init() {}, parse: () => [{ reading: "ニホンゴ" }] });
    // @ts-expect-error Conversion remains asynchronous.
    const result: string = core.convert("日本語");
    // @ts-expect-error Utilities are typed, not any.
    Kuroshiro.Util.kanaToHiragana(42);
    // @ts-expect-error The romanization system is restricted here too.
    Kuroshiro.Util.kanaToRomaji("あ", "jis");
}
