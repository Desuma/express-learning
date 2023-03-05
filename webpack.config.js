const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src',
  target: 'node',
  output: {
    filename: './bin/index.js',
    path: path.resolve(__dirname, 'build'),
    // libraryTarget: 'commonjs'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use: 'awesome-typescript-loader',
        use: 'ts-loader',
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
          to: 'public'
        }, {
          from: path.resolve(__dirname, 'one_key_start.sh'),
          to: './'
        },
      ]
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src')
    }
  },
  externals: [nodeExternals()],
  mode: 'production'
};