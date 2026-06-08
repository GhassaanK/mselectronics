module.exports = [
  {
    files: ["**/*.{ts,tsx}"],
    plugins: ["import", "react", "jsx-a11y"],
    rules: {
      "import/no-anonymous-default-export": "warn",
      "react/no-unknown-property": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"]
        }
      ],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "react/jsx-no-target-blank": "off"
    },
    parser: require.resolve("@typescript-eslint/parser"),
    parserOptions: {
      project: "./tsconfig.json",
      sourceType: "module"
    },
    settings: {
      react: {
        version: "detect"
      },
      "import/parsers": {
        [require.resolve("@typescript-eslint/parser")]: [".ts", ".tsx"]
      },
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"]
        },
        typescript: {
          alwaysTryTypes: true
        }
      }
    },
    env: {
      browser: true,
      node: true
    }
  }
]
