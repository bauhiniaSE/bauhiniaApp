const path = require('path');

const config = {
  entry: './simulation-service.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'simulation-service.js',
    libraryTarget: 'window'
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js'
    ]
  }
};

module.exports = config;