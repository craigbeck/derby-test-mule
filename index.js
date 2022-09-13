const derby = require('derby');
const express = require('express');
const http = require('node:http');
// used to bundle client side code for browser
const bundle = require('racer-bundle');
// used to setup websocket connections
const highway = require('racer-highway');

const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require('./webpack.config');
const webpackCompiler = webpack(webpackConfig);

let app = require('./app');

const mockBundler = (app) => {
  var Backend = app.Backend || app.Store;
  // gets the entry point for the app passed as filename
  // bundles form there, writes to public directory
  Backend.prototype.bundle = (filename, options, cb) => {
    if (typeof options === 'function') {
      cb = options;
      options = null;
    }
    console.log('>>>>', filename);
    cb(null, 'console.log("Source bundled!")', '{"SOURCE_MAP":false}');
  }
}

const chokidar = require('chokidar');
const path = require('node:path') ;
const watcher = chokidar.watch('./app', {ignored:['*.html']});
watcher.on('ready', function() {
  const apppath = path.resolve('./app');
  console.log('WATCHING', apppath);
  watcher.on('all', function(type, subpath) {
    console.log('EVENT:', type, subpath);
    const filepath = path.resolve('.', subpath);
    console.log('FILE:', filepath)
    Object.keys(require.cache).forEach(function(id) {
      if (id.startsWith(apppath)) {
        console.log('!>', id);
        delete require.cache[id];
      }
    });
  });
});

// derby to use bundler
derby.use(bundle);
// derby.use(mockBundler)
const backend = derby.createBackend();
// wrap backend and get upgrade handlers for websocket
const handlers = highway(backend);

function setup(app, options, cb) {
  const expressApp = express(options);

  var publicDir = __dirname + '/public';
  const devMiddleware = webpackMiddleware(webpackCompiler, {
    // middleware options...
    serverSideRender: true,
    index: false,
    publicPath: webpackConfig.output.publicPath,
  });
  expressApp.use(devMiddleware);
  expressApp.use(webpackHotMiddleware(webpackCompiler));
  expressApp.use(express.static(publicDir));
  expressApp.use(backend.modelMiddleware());
  expressApp.use((req, res, next) => {
    // require cached unless changes cause cache to be cleared
    // require/recreate app
    let app = require('./app');
    const routerFn = app.router();
    // invoke router
    routerFn(req, res, next);
  });
  
  // app._autoRefresh() required to install middleware handlers
  app._autoRefresh(backend);
  cb(null, expressApp, handlers.upgrade);
}

function run(app, options, cb) {
  options || (options = {});
  var port = options.port || process.env.PORT || 3000;

  function listenCallback() {
    console.log('%d listening. Go to: http://localhost:%d/', process.pid, port);
    cb?.();
  }

  function createServer() {
    setup(app, options, function(err, expressApp, upgrade) {
      if (err) {
        console.error(err);
        process.exit(3);
      }
      var server = http.createServer((req, res) => {
        expressApp(req, res);
      });
      server.on('upgrade', upgrade);
      server.listen(port, listenCallback);

      process.addListener('SIGINFO', () => {
        if (!server.listening) return;
        app.restart();
      })
    });
  }

  // derby.run just calls createServer
  // only determines if run as clustered worker process
  // processwhen in dev
  derby.run(createServer);
}

run(app, { port: 4001 }, () => {});
