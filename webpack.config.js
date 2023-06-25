const path = require('path');

module.exports = {
    entry: './client/src/index.js', // Update with your entry point file path
    // Rest of your webpack configuration options
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            // Add more rules for other file types or loaders if needed
        ],
    },
};



