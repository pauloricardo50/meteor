const collectionGenerator = require('./plop/generators/collectionGenerator.js');
const formatActionType = require('./plop/actionTypes/format.js');

module.exports = function(plop) {
  plop.setActionType('format', formatActionType);
  plop.setGenerator('collection', collectionGenerator);
};
