const path = require("path");

module.exports = {
    plugins: [],

    entry: {
        main: "./src/js/index.js",
    },

    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: 'main.js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: ["babel-loader"]
        }]
    }
};