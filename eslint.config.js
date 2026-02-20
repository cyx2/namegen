// eslint-disable-next-line @typescript-eslint/no-require-imports
const { fixupConfigRules } = require('@eslint/compat');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextPlugin = require('eslint-config-next/core-web-vitals');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextTypeScriptPlugin = require('eslint-config-next/typescript');

module.exports = [
  {
    ignores: ['coverage/**', 'node_modules/**', '.next/**', 'dist/**'],
  },
  ...fixupConfigRules(nextPlugin),
  ...fixupConfigRules(nextTypeScriptPlugin),
];
