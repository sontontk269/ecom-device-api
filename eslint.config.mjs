import tseslint from '@typescript-eslint/parser'
import tseslintPlugin from '@typescript-eslint/eslint-plugin'
const { configs: tsConfigs } = tseslintPlugin
import prettierPlugin from 'eslint-plugin-prettier'
const { configs: prettierConfigs } = prettierPlugin
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import path from 'path'

export default [
  // Ignore files
  {
    ignores: ['node_modules', 'dist', 'build']
  },

  // Main config
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd()
      },
      globals: {
        ...globals.node,
        ...globals.jest
      },
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin, // Đảm bảo plugin TypeScript đã được khai báo ở đây
      import: importPlugin,
      prettier: prettierPlugin
    },
    rules: {
      // TypeScript rules
      semi: ['warn', 'never'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Import rules
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never'
        }
      ],

      // Prettier (formatting)
      'prettier/prettier': ['warn'],

      // Bắt CRLF dòng kết thúc
      'linebreak-style': ['error', 'unix']
    }
  }

  // ...Không sử dụng preset recommended, chỉ giữ lại rules cần thiết...
]
