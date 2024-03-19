module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', 'import', 'jsx-a11y'],
  // все правила eslint:
  // https://eslint.org/docs/latest/rules/
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/destructuring-assignment': 'off',
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'never',
    //     tsx: 'never',
    //   },
    // ],
    'import/no-unresolved': 'off',
    'no-shadow': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    'react/sort-comp': 'off',
    'class-methods-use-this': 'off',
    'react/prefer-stateless-function': 'off',
    'spaced-comment': 'off',
    'vite': 'off',
    'import/no-extraneous-dependencies': 'off',
    // 'import/extensions' : 'off',
    // disable semicolons - set it in prettier
    //'semi': 'off',
    // disable increment operator
    //'no-plusplus: 'off',
    // disable required empty line in the end of file
    //'eol-last': 'off',
    // max len of line - set it in prettier
    //'max-len': 120,
    //'quotes'
    //'no-tabs'
    // не создавать тело у стрелочной функции, если там одно выражение
    //'arrow-body-style'
    //'no-unused-vars'
    // запятая в конце у последнего свойства объекта
    //'comma-dangle'
    // всегда использовать деструктуризация для извлечения свойства объекта в переменную
    //'prefer-destructuring'
    // запретить изменять параметры функций
    //'no-param-reassign': 'off'
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
}
