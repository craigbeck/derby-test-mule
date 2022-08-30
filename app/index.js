const derby = require('derby');
require('racer-highway');
const message = require('./message');

const app = derby.createApp('test-mule', __filename);

// loading view from wrong location
// or loading views when views dont exist
// results in cryptic error
// e.g.
// app.loadViews('/foo/bar');
app.loadViews(__dirname);

app.get('/', (page, model) => {
  model.set('_page.message', message);
  page.render();
});

if (module.hot) {
  module.hot.accept('./index.js', function() {
    console.log('ACCEPT index.js');
    app.render();
  });
  module.hot.accept('./message.js', function(...args) {
    const message = require('./message');
    console.log('ACCEPT message.js', JSON.stringify(message));
    app.model.set('_page.message', message);
    // app.render();
  });
}

module.exports = app;
