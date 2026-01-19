module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
      },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
  ignorePatterns: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts', '.vite/**', 'test-*.js'],
}

