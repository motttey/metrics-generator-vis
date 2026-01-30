import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";

const reactRecommended = react.configs.flat.recommended;
const reactJsxRuntime = react.configs.flat["jsx-runtime"];

export default [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["**/*.{jsx,tsx}"],
    ...reactRecommended,
    ...reactJsxRuntime,
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
    },
  },

  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];
