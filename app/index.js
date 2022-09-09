console.log('%cEVAL', 'color:magenta', 'app/index.js');
console.trace();
const derby = require('derby');
require('racer-highway');
const message = require('./message');
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
  // module.hot._selfAccepted = true;
  console.log('app/index.js HMR hot', module);
  // console.log(app.model);
  console.log('state', app.serializeState());
  module.hot.accept();
  
  // module.hot.accept('./index.js', function() {
  //   console.log('%cACCEPT', 'color:magenta', 'index.js');
  //   // serialize model state
  //   app.page.render();
  // });

  // module.hot.accept('./message.js', function(path) {
  //   // app.model.bundle(function(state) {
  //     // console.log('state', state);
  //     console.log('init?');
  //     const message = require('./message');
  //     console.log(`ACCEPT ${path}`, JSON.stringify(message));
  //     app.model.set('_page.message', message);
  //   // });
  // });

  // module.hot.reject('./handlers.js', path => {
  //   console.warn(`REJECT loading ${path}`);
  // })
}
if (globalThis) {
  globalThis.APP = app;
}

module.exports = app;
