const { buildSync } = require("esbuild");

const minify = process.argv.includes("--minify");

// Keep the legacy UMD loaders while esbuild bundles the factory's CommonJS body.
const banner = `(function (root, factory) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        root.Kuroshiro = factory();
    }
})(typeof window !== "undefined" ? window
    : typeof global !== "undefined" ? global
    : typeof self !== "undefined" ? self : this, function () {
    var module = { exports: {} };
`;

buildSync({
    entryPoints: ["scripts/browser-entry.js"],
    bundle: true,
    format: "cjs",
    platform: "browser",
    target: "es2017",
    minify,
    outfile: minify ? "dist/kuroshiro.min.js" : "dist/kuroshiro.js",
    banner: { js: banner },
    footer: { js: "return module.exports.default;\n});" }
});
