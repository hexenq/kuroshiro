"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const compiler = require.resolve("typescript/bin/tsc");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "kuroshiro-types-"));

function run(command, args, cwd = temp) {
    return execFileSync(command, args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function installPackedPackage(directory) {
    const metadata = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
    // Build first via npm test. Never recurse into prepack or install from the network.
    const output = run(process.execPath, [
        process.env.npm_execpath, "pack", "--ignore-scripts", "--json",
        "--pack-destination", temp, "--cache", path.join(temp, "cache")
    ], directory);
    const result = JSON.parse(output);
    // npm 12 keys results by package name; earlier npm versions return an array.
    const packed = Array.isArray(result) ? result[0] : result[metadata.name];
    assert.ok(packed.files.some(file => file.path === metadata.types), "Declaration must be published");
    const destination = path.join(temp, "node_modules", metadata.name);
    fs.mkdirSync(destination, { recursive: true });
    run("tar", ["-xzf", path.join(temp, packed.filename), "--strip-components=1", "-C", destination]);
    // Reuse installed runtime dependencies, but load our entry and declarations from the tarball.
    for (const dependency of Object.keys(metadata.dependencies || {})) {
        const link = path.join(temp, "node_modules", dependency);
        if (fs.existsSync(link)) continue;
        fs.mkdirSync(path.dirname(link), { recursive: true });
        const manifest = require.resolve(dependency + "/package.json", { paths: [directory] });
        fs.symlinkSync(path.dirname(manifest), link, "junction");
    }
    return metadata.name;
}

function compile(label, options, files, execute = false) {
    const outDir = path.join(temp, label);
    const config = path.join(temp, label + ".json");
    fs.writeFileSync(config, JSON.stringify({
        compilerOptions: {
            strict: true, skipLibCheck: false, types: [], target: "ES2015",
            lib: ["ES2015"], noEmit: !execute, outDir, ...options
        },
        files
    }));
    run(process.execPath, [compiler, "--project", config]);
    if (execute) {
        for (const file of files) {
            const emitted = path.basename(file).replace(/\.cts$/, ".cjs").replace(/\.mts$/, ".mjs");
            run(process.execPath, [path.join(outDir, emitted)]);
        }
    }
    console.log("Packed types passed: " + label);
}

try {
    assert.ok(process.env.npm_execpath, "Run this check with npm run test:types");
    installPackedPackage(root);
    const fixtureRoot = path.join(root, "test/types");
    for (const file of fs.readdirSync(fixtureRoot)) {
        fs.copyFileSync(path.join(fixtureRoot, file), path.join(temp, file));
    }
    const commonjs = ["commonjs.cts"];
    const modules = [...commonjs, "default.mts", "interop.cts"];
    compile("commonjs", { module: "CommonJS", moduleResolution: "Node", esModuleInterop: false }, commonjs);
    compile("interop", { module: "CommonJS", moduleResolution: "Node", esModuleInterop: true }, ["interop.cts"]);
    compile("node16", { module: "Node16", moduleResolution: "Node16" }, modules);
    compile("nodenext", { module: "NodeNext", moduleResolution: "NodeNext" }, modules, true);
    compile("bundler", { module: "ESNext", moduleResolution: "Bundler", verbatimModuleSyntax: true }, ["default.mts"]);
    compile("browser-global", { module: "None", moduleResolution: "Node", types: ["kuroshiro"] }, ["browser.ts"]);
    // Use the published analyzer already installed as a development dependency.
    const analyzerDirectory = path.dirname(require.resolve("kuroshiro-analyzer-kuromoji/package.json"));
    fs.symlinkSync(analyzerDirectory, path.join(temp, "node_modules/kuroshiro-analyzer-kuromoji"), "junction");
    const joint = ["joint.cts", "joint.mts"];
    for (const file of joint) fs.copyFileSync(path.join(root, "test/integration", file), path.join(temp, file));
    compile("joint", { module: "NodeNext", moduleResolution: "NodeNext" }, joint, true);
}
catch (error) {
    console.error(error.stdout || error.stderr || error);
    process.exitCode = 1;
}
finally {
    fs.rmSync(temp, { recursive: true, force: true });
}
