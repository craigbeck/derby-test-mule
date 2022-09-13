// console.log('%cEVAL', 'color:magenta', 'app/index.js');
// console.trace();
const derby = require('derby');
require('racer-highway');
const handlers = require('./handlers');

const app = derby.createApp('test-mule', __filename);

// loading view from wrong location
// or loading views when views dont exist
// results in cryptic error
// e.g.
// app.loadViews('/foo/bar');
app.loadViews(__dirname);

app.get('/', handlers.getIndex);

if (module.hot) {
  module.hot.accept();
}

module.exports = app;
