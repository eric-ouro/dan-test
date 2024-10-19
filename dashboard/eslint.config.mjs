import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-plugin-prettier/recommended";

const customRules = {
  rules: {
    // This rule is not compatible with Next.js
    "@typescript-eslint/no-misused-promises": "off",
  },
  // Supabase types are not type checked by ESLint
  overrides: [
    {
      files: ["utils/supabase/types.ts"],
      rules: "off",
    },
  ],
};

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  customRules
);
