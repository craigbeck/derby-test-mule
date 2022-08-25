const derby = require('derby');
require('racer-highway');

const app = derby.createApp('test-mule', __filename);


// loading view from wrong location
// or loading views when views dont exist
// results in cryptic error
// e.g.
// app.loadViews('/foo/bar');
app.loadViews(__dirname);

app.get('/', page => {
  page.render();
});

module.exports = app;
