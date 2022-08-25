const webpack = require('webpack');
const path = require('node:path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { WebpackDeduplicationPlugin } = require('webpack-deduplication-plugin');
const Derby = require('derby');


function DerbyViewsPlugin() {}
DerbyViewsPlugin.prototype.apply = function(compiler) {
  const pkgPath = require.resolve('./package.json');
  const pkg = require(pkgPath);
  const viewsPath = '../derby/lib/_views.js';
  const virtualModules = new VirtualModulesPlugin({
    [viewsPath]: 'module.exports = function serializedViews(){ /* SERIALIZED_VIEWS derby/lib/_views */ };',
  });
  virtualModules.apply(compiler);
  compiler.hooks.compilation.tap('DerbyViewsPlugin', function() {
    const app = Derby.createApp('derby-views-plugin', './app');
    const viewSource = app._viewsSource({server: true, minify: true});
    virtualModules.writeModule(viewsPath, viewSource);
  });
}



const config = {
  mode: 'development',
  entry: './app/index.js',
  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    concatenateModules: true,
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.title': JSON.stringify('browser'),
    }),
    new WebpackDeduplicationPlugin({}),
    new DerbyViewsPlugin(),
  ],
  resolve: {
    fallback: {
      // bufferutil: false, // ws provides fallback, webpack does not pick up on fallback
      // 'utf-8-validate': false, // ws provides fallback, webpack does not pick up on fallback
      // fs: false,  // ws server only
      // tls: false, // ws server only
      // crypto: require.resolve('crypto-browserify'),
      // http: require.resolve('stream-http'),
      // https: require.resolve('https-browserify'),
      // os: require.resolve('os-browserify/browser'),
      events: require.resolve('events/'),
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      racer: require.resolve('racer'),
      // stream: require.resolve('stream-browserify'),
      // zlib: require.resolve('browserify-zlib'),
    },
  },
};

module.exports = config;
