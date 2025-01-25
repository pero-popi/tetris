const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: `${__dirname}/html/assets/scripts`,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.js'
    ]
  },
  devServer: {
    static: `${__dirname}/html`
  }
};
