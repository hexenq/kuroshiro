"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const destination = path.join(root, "tmp/kuromoji");
const repository = "https://github.com/hexenq/kuroshiro-analyzer-kuromoji.git";
// Shared by local integration checks and CI; update deliberately with the analyzer.
const revision = "c7b43575ee0a2c57be91f5f19fcb101003189c7d";

function git(args, cwd = destination) {
    return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
}

try {
    if (!process.env.npm_execpath) throw new Error("Run npm run prepare:integration.");
    if (!fs.existsSync(destination)) {
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        git(["clone", "--no-checkout", "--filter=blob:none", repository, destination], root);
        git(["checkout", "--detach", revision]);
    }
    // Never reset or overwrite an existing checkout that a contributor may be editing.
    if (!fs.existsSync(path.join(destination, ".git"))
        || git(["rev-parse", "HEAD"]) !== revision
        || git(["status", "--porcelain"])) {
        throw new Error("tmp/kuromoji must be a clean checkout of " + revision
            + ". Move the existing directory aside before preparing integration again.");
    }
    for (const args of [["ci"], ["run", "build"]]) {
        execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
            cwd: destination, stdio: "inherit"
        });
    }
    console.log("Integration analyzer ready. Run npm run test:integration after building core.");
}
catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}
