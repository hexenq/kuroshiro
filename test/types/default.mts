import Kuroshiro from "kuroshiro";

const options: Kuroshiro.ConvertOptions = { to: "hiragana" };
const core = new Kuroshiro();
async function check() {
    await core.init({ init() {}, parse: text => [{ surface_form: text, reading: "ニホンゴ" }] });
    const result: string = await core.convert("日本語", options);
    if (result !== "にほんご") throw new Error(result);
    if (Kuroshiro.Util.kanaToHiragana("ア") !== "あ") throw new Error("Missing helper");
}
void check();
