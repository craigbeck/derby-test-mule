const message = require('./message');

function getIndex(page, model) {
  console.log('GET /');
  model.set('_page.message', message);
  page.render();
}

module.exports = {
  getIndex,
}