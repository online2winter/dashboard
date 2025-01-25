module.exports = {
root: true,
env: {
    browser: true,
    es2021: true,
    node: true,
},
extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
],
parser: '@typescript-eslint/parser',
parserOptions: {
    ecmaFeatures: {
    jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
},
plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'import',
    'jsx-a11y',
    'prettier',
],
settings: {
    react: {
    version: 'detect',
    },
    'import/resolver': {
    node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    typescript: {
        alwaysTryTypes: true,
    },
    },
},
rules: {
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import rules
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-cycle': 'error',
    'import/order': [
    'error',
    {
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: {
        order: 'asc',
        caseInsensitive: true,
        },
    },
    ],
    
    // Error prevention
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    
    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-role': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    
    // Code style
    'prettier/prettier': [
    'error',
    {
        singleQuote: true,
        trailingComma: 'es5',
        printWidth: 100,
        tabWidth: 2,
        semi: true,
    },
    ],
},
overrides: [
    {
    files: ['*.ts', '*.tsx'],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        'react/prop-types': 'off',
    },
    },
],
};

