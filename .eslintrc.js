module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'react-hooks'
  ],
  rules: {
    'no-use-before-define': 0,
    'react/react-in-jsx-scope': 0,
    'no-undef': 0,
    '@typescript-eslint/no-var-requires': 0,
    quotes: 0,
    semi: 0,
    'space-before-function-paren': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'no-unused-vars': 0,
    'no-unreachable-loop': 0,
    '@typescript-eslint/no-empty-function': 0,
    'import/no-absolute-path': 0,
    "multiline-ternary": 0,
    indent: 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
