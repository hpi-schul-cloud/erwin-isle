module.exports = {
    root: true,
    extends: ['airbnb-base', 'plugin:promise/recommended', 'prettier'],
    rules: {
        'prettier/prettier': ['error'],
        'no-process-env': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                max: 2,
                maxBOF: 0,
                maxEOF: 0,
            },
        ],
        'no-tabs': 'off',
        'no-restricted-syntax': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': [
            'error',
            {
                allow: ['_id', '_v', '__v'],
            },
        ],
        'no-shadow': [
            'error',
            {
                allow: ['err', 'error'],
            },
        ],
        'prefer-destructuring': [
            'warn',
            {
                object: true,
                array: false,
            },
        ],
        'no-param-reassign': [
            'warn',
            {
                props: false,
            },
        ],
        'no-unused-vars': [
            'warn',
            {
                args: 'after-used',
                argsIgnorePattern: 'app|req|res|next|options|params|^_',
            },
        ],
        'arrow-parens': ['error', 'always'],
        'arrow-body-style': ['error', 'as-needed'],
        '@typescript-eslint/explicit-member-accessibility': 2,
        '@typescript-eslint/explicit-function-return-type': 2,
    },
    plugins: ['import', 'prettier', 'promise'],
    env: {
        node: true,
        jest: true,
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.ts'],
            },
        },
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: [
                'airbnb-typescript/base',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:prettier/recommended',
                'plugin:promise/recommended',
            ],
            parserOptions: {
                project: 'tsconfig.json',
            },
            env: {
                node: true,
                es6: true,
            },
            settings: {
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts'],
                },
                'import/resolver': {
                    typescript: {
                        alwaysTryTypes: true,
                        project: ['tsconfig.json'],
                    },
                },
            },
            rules: {
                'import/no-unresolved': 'off', // better handled by ts resolver
                'import/no-extraneous-dependencies': 'off', // better handles by ts resolver
                'import/extensions': ['error', 'always', { ts: 'never' }],
                'import/prefer-default-export': 'off',
                'no-void': ['error', { allowAsStatement: true }],
                'max-classes-per-file': 'off',
                'class-methods-use-this': 'off',
                'no-param-reassign': 'off',
                'no-underscore-dangle': 'off',
            },
            overrides: [
                {
                    files: ['**/*spec.ts'],
                    env: {
                        jest: true,
                    },
                },
            ],
        },
        {
            // legacy typescript
            files: ['{test,src}/**/*.ts'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
        },
    ],
};
