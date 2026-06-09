const path = require("path")
const { FlatCompat } = require("@eslint/eslintrc")

const tsParser = require("@typescript-eslint/parser")
const compat = new FlatCompat({ baseDirectory: __dirname })

module.exports = [
  {
    ignores: ["node_modules/**", ".next/**"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["node_modules/**", ".next/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.resolve(__dirname, "tsconfig.json"),
        sourceType: "module",
        ecmaVersion: 2024,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: require("eslint-plugin-import"),
      react: require("eslint-plugin-react"),
      "jsx-a11y": require("eslint-plugin-jsx-a11y"),
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/parsers": {
        [require.resolve("@typescript-eslint/parser")]: [".ts", ".tsx"],
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "react/jsx-no-target-blank": "off",
    },
  },
]
