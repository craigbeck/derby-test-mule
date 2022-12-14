const path = require('node:path');
const webpack = require('webpack');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { WebpackDeduplicationPlugin } = require('webpack-deduplication-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const APP_PATH = './app';

function DerbyViewsPlugin() {}
DerbyViewsPlugin.prototype.apply = function(compiler) {
  const pkgPath = require.resolve('./package.json');
  const pkg = require(pkgPath);
  const viewsPath = '../derby/lib/_views.js';
  const virtualModules = new VirtualModulesPlugin({
    [viewsPath]: `module.exports = function serializedViews(){ /* SERIALIZED_VIEWS ${viewsPath} */ };`,
  });
  virtualModules.apply(compiler);
  compiler.hooks.compilation.tap('DerbyViewsPlugin', function() {
    const originalNodeEnv = process.env.NODE_ENV;
    // hack to work around Derby listening for changes and holding process open
    process.env.NODE_ENV = 'production';
    const app = require(APP_PATH);
    const viewSource = app._viewsSource({server: false, minify: false});
    virtualModules.writeModule(viewsPath, viewSource);
    process.env.NODE_ENV = originalNodeEnv;
    // fs.writeFileSync(`${app.name}.debug.views.js`, viewSource, {encoding: 'utf-8'});
  });
}

const config = {
  mode: 'development',
  entry: [
    'webpack-hot-middleware/client',
    './app',
  ],
  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
  },
  output: {
    filename: '[name]-[hash].js',
    chunkFilename: '[id]-[chunkhash].js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.title': JSON.stringify('browser'),
      'DERBY_BUNDLED_AT': (new Date()).toISOString(),
      'DERBY_SCRIPT_HASH': 'm4gic_h4$h',
    }),
    new WebpackDeduplicationPlugin({}),
    new DerbyViewsPlugin(),
    new WebpackManifestPlugin({ writeToFileEmit: true }),
  ],
  resolve: {
    fallback: {
      events: require.resolve('events/'),
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser'),
      racer: require.resolve('racer'),
    },
  },
};

module.exports = config;
