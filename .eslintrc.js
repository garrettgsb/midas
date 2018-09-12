module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "warn",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "error",
            { "allow": ["debug", "info", "warn", "error"] },
        ],
        "no-unused-vars": [
            "error",
            { "args": "none" },
        ],
        //"object-curly-spacing": [ "error", "always" ],
        //"react/jsx-curly-spacing": [ "error", { "when": "never", "children": { "when": "always" } } ],
        "react/prop-types": "warn",         // TODO: JH to fix, then remove this line.
        "react/no-string-refs": "warn",     // TODO: GSB to fix, then remove this line.
    }
};
