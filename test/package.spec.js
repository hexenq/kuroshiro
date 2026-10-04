/**
 * @jest-environment node
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const Kuroshiro = require("..");

async function checkConstructor(Constructor) {
    expect(typeof Constructor).toBe("function");
    expect(Constructor.default).toBe(Constructor);
    expect(typeof Constructor.Util.kanaToHiragna).toBe("function");
    const instance = new Constructor();
    await instance.init({
        init: async () => {},
        parse: async () => [{ surface_form: "漢字", reading: "カンジ" }]
    });
    expect(await instance.convert("漢字")).toBe("かんじ");
}

describe("Built package entries", () => {
    it("Exposes the CommonJS constructor and its default alias", async () => {
        await checkConstructor(Kuroshiro);
    });

    it.each(["kuroshiro.js", "kuroshiro.min.js"])("Exposes the %s browser global", async (file) => {
        const context = {};
        context.window = context;
        context.self = context;
        const bundle = fs.readFileSync(path.join(__dirname, "../dist", file), "utf8");
        vm.runInNewContext(bundle, context, { filename: file });
        await checkConstructor(context.Kuroshiro);
    });
});
