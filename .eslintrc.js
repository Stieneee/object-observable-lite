module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: 'airbnb-base',
  globals: {},
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "max-len": "off",
    "no-underscore-dangle": "off",
    "no-param-reassign": "warn",
    "no-prototype-builtins": "warn",
    "no-use-before-define": "warn"
  },
};
