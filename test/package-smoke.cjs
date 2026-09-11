const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

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
        parse: () => Promise.resolve([
            { surface_form: "漢字", reading: "カンジ", pronunciation: "カンジ" }
        ])
    });
    assert.equal(await instance.convert("漢字"), "かんじ", label);
}

async function main() {
    await checkConstructor(Kuroshiro, "package CommonJS entry");
    const imported = await import("../index.js");
    assert.equal(imported.default, Kuroshiro);

    for (const file of ["dist/kuroshiro.js", "dist/kuroshiro.min.js"]) {
        const bundle = fs.readFileSync(file, "utf8");
        const environments = [
            ["browser", { window: {} }, context => context.window.Kuroshiro],
            ["worker", { self: {} }, context => context.self.Kuroshiro],
            ["global", { global: {} }, context => context.global.Kuroshiro],
            ["bare context", {}, context => context.Kuroshiro],
            ["CommonJS", { module: { exports: {} }, exports: {} }, context => context.module.exports]
        ];

        for (const [name, context, getExport] of environments) {
            vm.runInNewContext(bundle, context, { filename: file });
            await checkConstructor(getExport(context), `${file}: ${name}`);
        }

        let amdExport;
        let defineCalls = 0;
        const amdContext = {
            window: {},
            define: Object.assign((dependencies, factory) => {
                assert.equal(dependencies.length, 0);
                defineCalls++;
                amdExport = factory();
            }, { amd: {} })
        };
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
