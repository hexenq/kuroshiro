const core = new Kuroshiro();
const result: Promise<string> = core.convert("日本語", { mode: "furigana" });
const kana: string = Kuroshiro.Util.kanaToHiragana("カナ");
const options: Kuroshiro.ConvertOptions = { to: "romaji" };
