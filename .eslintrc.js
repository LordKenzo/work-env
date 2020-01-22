module.exports = {
  root: true,
  env: {
    node: false,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:react/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
  },
  settings: {
    /*react: {
      version: "detect"
    }*/
  },
  overrides: [
    {
      files: ['test/*.spec.js', 'dist/**/*'], // Or *.test.js
      rules: {
        'no-var': 'off',
      },
    },
  ],
};