const derby = require('derby');

console.log('dirname ', __dirname);
console.log('filename', __filename);

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
