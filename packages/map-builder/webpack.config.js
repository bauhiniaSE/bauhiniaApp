const path = require('path');

const config = {
  entry: './map-builder.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'map-builder.js',
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