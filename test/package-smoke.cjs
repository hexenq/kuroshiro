const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const Kuroshiro = require("..");

assert.equal(typeof Kuroshiro, "function");
assert.equal(Kuroshiro.default, Kuroshiro);
assert.equal(typeof new Kuroshiro().init, "function");
assert.equal(typeof Kuroshiro.Util.kanaToRomaji, "function");

const browserBundle = fs.readFileSync("dist/kuroshiro.js", "utf8");
const browserContext = { window: {} };
vm.runInNewContext(browserBundle, browserContext);

assert.equal(typeof browserContext.window.Kuroshiro, "function");
assert.equal(typeof new browserContext.window.Kuroshiro().convert, "function");
