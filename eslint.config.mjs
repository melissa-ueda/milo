import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Clean-architecture boundary: the domain layer must stay pure and
  // framework-free — no React, Dexie, the AI SDK, or Next imports.
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "react", message: "domain must not import React" },
            { name: "react-dom", message: "domain must not import React" },
            { name: "dexie", message: "domain must not import Dexie" },
            { name: "ai", message: "domain must not import the AI SDK" },
            {
              name: "@ai-sdk/google",
              message: "domain must not import the AI SDK",
            },
          ],
          patterns: [
            {
              group: [
                "@/src/infrastructure/*",
                "@/src/presentation/*",
                "@/src/application/*",
                "next/*",
              ],
              message:
                "domain must not depend on outer layers (application/infrastructure/presentation) or Next.",
            },
          ],
        },
      ],
    },
  },
  // The application layer may depend on domain + its own ports, but never on
  // concrete infrastructure or presentation.
  {
    files: ["src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/src/infrastructure/*", "@/src/presentation/*"],
              message:
                "application must depend on ports, not concrete adapters or presentation.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
