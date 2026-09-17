const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { parse } = require("acorn");
const { JSDOM } = require("jsdom");

const Kuroshiro = require("..");

assert.equal(typeof Kuroshiro, "function");
assert.equal(Kuroshiro.default, Kuroshiro);
assert.equal(typeof new Kuroshiro().init, "function");
assert.equal(typeof Kuroshiro.Util.kanaToRomaji, "function");

async function checkConstructor(Constructor, label) {
    assert.equal(typeof Constructor, "function", label);
    assert.equal(Constructor.default, Constructor, `${label}: legacy default export`);
    assert.equal(Constructor.Util.kanaToRomaji("カンジ"), "kanji", label);

    const instance = new Constructor.default();
    await instance.init({
        init: () => Promise.resolve(),
        parse: text => Promise.resolve(text === "買っちゃった" ? [
            { surface_form: text, reading: "カッチャッタ", pronunciation: "カッチャッタ" }
        ] : text === "っcat" ? [
            { surface_form: "っ", reading: "ッ", pronunciation: "ッ" },
            { surface_form: "cat" }
        ] : [{ surface_form: "漢字", reading: "カンジ", pronunciation: "カンジ" }])
    });
    assert.equal(await instance.convert("漢字"), "かんじ", label);
    const ruby = await instance.convert("買っちゃった", { to: "romaji", mode: "furigana" });
    assert.ok(ruby.includes("っちゃ<rp>(</rp><rt>tcha</rt>"), `${label}: sokuon with contracted kana`);
    const mixed = await instance.convert("っcat", { to: "romaji", mode: "furigana" });
    assert.ok(mixed.includes("っ<rp>(</rp><rt>tsu</rt>"), `${label}: preserve Latin boundary`);
}

function globalContext(...aliases) {
    const context = {};
    // In browsers and workers, window/self refer to the global object itself.
    for (const alias of aliases) context[alias] = context;
    return context;
}

async function main() {
    await checkConstructor(Kuroshiro, "package CommonJS entry");
    const imported = await import("../index.js");
    assert.equal(imported.default, Kuroshiro);

    for (const file of ["dist/kuroshiro.js", "dist/kuroshiro.min.js"]) {
        const bundle = fs.readFileSync(file, "utf8");
        // Match the syntax baseline of the previously published UMD bundles.
        assert.doesNotThrow(() => parse(bundle, { ecmaVersion: 2015, sourceType: "script" }),
            `${file}: UMD syntax must remain compatible with ES2015`);
        const environments = [
            ["browser", globalContext("window", "self"), context => context.window.Kuroshiro],
            ["worker", globalContext("self"), context => context.self.Kuroshiro],
            ["global", globalContext("global"), context => context.global.Kuroshiro],
            ["bare context", {}, context => context.Kuroshiro],
            ["without globalThis", { globalThis: undefined }, context => context.Kuroshiro],
            ["CommonJS", { module: { exports: {} }, exports: {} }, context => context.module.exports]
        ];

        for (const [name, context, getExport] of environments) {
            vm.runInNewContext(bundle, context, { filename: file });
            await checkConstructor(getExport(context), `${file}: ${name}`);
        }

        await checkConstructor(require(`../${file}`), `${file}: Node.js require`);
        const dom = new JSDOM("", { runScripts: "outside-only" });
        try {
            dom.window.eval(bundle);
            await checkConstructor(dom.window.Kuroshiro, `${file}: DOM window`);
        }
        finally {
            dom.window.close();
        }

        let amdExport;
        let defineCalls = 0;
        const amdContext = globalContext("window", "self");
        Object.assign(amdContext, {
            define: Object.assign((dependencies, factory) => {
                assert.equal(dependencies.length, 0);
                defineCalls++;
                amdExport = factory();
            }, { amd: {} })
        });
        vm.runInNewContext(bundle, amdContext, { filename: file });
        assert.equal(defineCalls, 1, `${file}: AMD registration`);
        assert.equal(amdContext.window.Kuroshiro, undefined, `${file}: AMD must not set a global`);
        await checkConstructor(amdExport, `${file}: AMD`);
    }
    console.log("Package imports and both UMD bundles passed compatibility checks.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
