import eslintConfig from '@moluoxixi/eslintconfig'

module.exports = eslintConfig({
  ignores: [
    'metadata.ts',
    '**/*.spec.ts',
    '.husky/**',
    '**/*.md',
  ],
})
