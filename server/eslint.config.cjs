import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

module.exports = defineConfig([
  {
    ignores: ["node_modules/", "dist/", "coverage/"],

    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },
    ...js.configs.recommended,
  },
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
