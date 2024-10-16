import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  { 
    rules: {

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-types": "off",
      "camelcase": "error",
      "no-var": "error",
      "space-before-function-paren": ["error", "always"],
      "func-names": ["error", "as-needed"],
      "no-empty": [
        "error",
        {
          allowEmptyCatch: true,
        },
      ],
      "no-empty-pattern": "off",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];