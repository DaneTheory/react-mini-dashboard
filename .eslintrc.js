module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    parser: "babel-eslint",
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2018,
        sourceType: "module"
    },
    plugins: ["react"],
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-console": "off"
    }
};
