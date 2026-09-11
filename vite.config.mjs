import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
    build: {
        target: "es2017",
        emptyOutDir: false,
        minify: mode === "minify",
        lib: {
            entry: "scripts/browser-entry.js",
            name: "Kuroshiro",
            formats: ["umd"],
            fileName: () => mode === "minify" ? "kuroshiro.min.js" : "kuroshiro.js"
        }
    }
}));
