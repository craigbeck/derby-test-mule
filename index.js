const derby = require('derby');
const express = require('express');
const http = require('node:http');
// used to bundle client side code for browser
const bundle = require('racer-bundle');
// used to setup websocket connections
const highway = require('racer-highway');

const webpack = require("webpack");
const webpackMiddleware = require("webpack-dev-middleware");
const webpackConfig = require('./webpack.config');
const webpackCompiler = webpack(webpackConfig);

// separate the file for client side code
// when app.ts was included here racer-bundle tries bundling
// server code, including node built-ins for the browser
const app = require('./app');

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

// derby to use bundler
derby.use(bundle);
// derby.use(mockBundler)
const backend = derby.createBackend();

// wrap backend and get upgrade handlers for websocket
const handlers = highway(backend);

function setup(app, options, cb) {
  const expressApp = express(options);

  var publicDir = __dirname + '/public';
  // expressApp.use(webpackMiddleware(webpackCompiler, {
  //   // middleware options...
  //   serverSideRender: true,
  //   index: false,
  //   publicPath: webpackConfig.output.publicPath
  // }));
  expressApp.use(express.static(publicDir));
  expressApp.use(backend.modelMiddleware());
  expressApp.use(app.router());

  const upgradeCallback = handlers.upgrade;
  app.writeScripts(backend, publicDir, { extensions: ['.js'] }, function(err) {
    cb(err, expressApp, upgradeCallback);
  });
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
      var server = http.createServer(expressApp);
      server.on('upgrade', upgrade);
      server.listen(port, listenCallback);
    });
  }

  derby.run(createServer);
}

run(app, { port: 4001 }, () => {});
