const js = require("@eslint/js");
const node = require("eslint-plugin-node");
const jest = require("eslint-plugin-jest");

module.exports = [
  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // <-- important for require/module.exports
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
        // Jest globals
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
    plugins: {
      node,
      jest,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];