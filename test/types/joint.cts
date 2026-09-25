import Kuroshiro = require("kuroshiro");
import KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");

async function check() {
    const analyzer: Kuroshiro.Analyzer = new KuromojiAnalyzer({});
    const core = new Kuroshiro();
    await core.init(analyzer);
    const text: string = await core.convert("日本語", { to: "hiragana" });
    if (text !== "にほんご") throw new Error(text);
}
void check();
