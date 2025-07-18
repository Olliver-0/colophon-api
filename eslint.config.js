import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import { globalIgnores } from "eslint/config";

export default tseslint.config([
  globalIgnores(["dist"]),

  {
    files: ["**/*.ts"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
]);
