import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

async function check() {
    const analyzer = new KuromojiAnalyzer();
    const core = new Kuroshiro();
    await core.init(analyzer);
    const tokens: Kuroshiro.Token[] = await analyzer.parse("日本語");
    if (!tokens.length) throw new Error("Expected real tokens");
    const text: string = await core.convert("日本語", { to: "romaji" });
    if (text !== "nihongo") throw new Error(text);
}
void check();
