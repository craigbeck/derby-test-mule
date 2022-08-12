const webpack = require('webpack');
const path = require('node:path');

const config = {
  mode: 'development',
  entry: './app/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.title': JSON.stringify('browser'),
    })
  ],
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
    }
  },
  node: {
    global: true,
  }
};

module.exports = config;
