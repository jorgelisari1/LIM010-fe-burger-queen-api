module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-unused-expressions": "off",
    "no-underscore-dangle":  "off",
    "no-undef": "off",
    "indent": "off",
    "no-unused-vars": "off",
  },
  "overrides": [
    {
        "files": ["*.test.js", "*.spec.js"],
        "rules": {
            "no-unused-expressions": "off"
        }
    }
]
};
