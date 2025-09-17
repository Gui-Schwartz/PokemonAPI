import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      react: pluginReact,
    },
    extends: [
      "plugin:react/recommended",
      "plugin:react/jsx-runtime", // 👈 precisa desse aqui
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // 👈 desliga a regra antiga
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);