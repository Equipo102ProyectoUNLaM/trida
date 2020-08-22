module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parser: 'babel-eslint',
    extends: [
      'plugin:react/recommended',
      'plugin:prettier/recommended'
    ],
    plugins: [
      "html"
    ],
    // add your custom rules here
    rules: {
        "react/prop-types": 0,
        "react/react-in-jsx-scope": "off",
        "react/destructuring-assignment": "off",
        "no-nested-ternary": "warn",
    }
  }