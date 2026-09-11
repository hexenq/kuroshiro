import js from "@eslint/js";
import globals from "globals";

export default [
    {
        ignores: ["coverage/**", "dist/**", "lib/**", "node_modules/**"]
    },
    js.configs.recommended,
    {
        files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node
            }
        },
        rules: {
            "no-case-declarations": "off",
            "no-cond-assign": "off",
            "no-constant-condition": "off",
            "no-control-regex": "off",
            "no-useless-escape": "off",
            "no-unused-vars": "off"
        }
    }
];
