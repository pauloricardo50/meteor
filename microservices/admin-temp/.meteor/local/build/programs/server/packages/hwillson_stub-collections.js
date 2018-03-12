(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"hwillson:stub-collections":{"stub_collections.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/hwillson_stub-collections/stub_collections.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
let sinon;
module.watch(require("meteor/practicalmeteor:sinon"), {
  sinon(v) {
    sinon = v;
  }

}, 2);

const StubCollections = (() => {
  const publicApi = {};
  const privateApi = {}; /* Public API */

  publicApi.add = collections => {
    privateApi.collections.push(...collections);
  };

  publicApi.stub = collections => {
    const pendingCollections = collections || privateApi.collections;
    [].concat(pendingCollections).forEach(collection => {
      if (!privateApi.pairs[collection._name]) {
        const options = {
          transform: collection._transform
        };
        const pair = {
          localCollection: new collection.constructor(null, options),
          collection
        };
        privateApi.stubPair(pair);
        privateApi.pairs[collection._name] = pair;
      }
    });
  };

  publicApi.restore = () => {
    privateApi.sandbox.restore();
    privateApi.pairs = {};
  }; /* Private API */

  privateApi.sandbox = sinon.sandbox.create();
  privateApi.pairs = {};
  privateApi.collections = [];
  privateApi.symbols = [];

  for (let symbol in Mongo.Collection.prototype) {
    privateApi.symbols.push(symbol);
  }

  privateApi.stubPair = pair => {
    privateApi.symbols.forEach(symbol => {
      if (_.isFunction(pair.localCollection[symbol]) && symbol != 'simpleSchema') {
        privateApi.sandbox.stub(pair.collection, symbol, _.bind(pair.localCollection[symbol], pair.localCollection));
      }
    });
  };

  return publicApi;
})();

module.exportDefault(StubCollections);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/hwillson:stub-collections/stub_collections.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['hwillson:stub-collections'] = exports;

})();

//# sourceURL=meteor://💻app/packages/hwillson_stub-collections.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvaHdpbGxzb246c3R1Yi1jb2xsZWN0aW9ucy9zdHViX2NvbGxlY3Rpb25zLmpzIl0sIm5hbWVzIjpbIl8iLCJtb2R1bGUiLCJ3YXRjaCIsInJlcXVpcmUiLCJ2IiwiTW9uZ28iLCJzaW5vbiIsIlN0dWJDb2xsZWN0aW9ucyIsInB1YmxpY0FwaSIsInByaXZhdGVBcGkiLCJhZGQiLCJjb2xsZWN0aW9ucyIsInB1c2giLCJzdHViIiwicGVuZGluZ0NvbGxlY3Rpb25zIiwiY29uY2F0IiwiZm9yRWFjaCIsImNvbGxlY3Rpb24iLCJwYWlycyIsIl9uYW1lIiwib3B0aW9ucyIsInRyYW5zZm9ybSIsIl90cmFuc2Zvcm0iLCJwYWlyIiwibG9jYWxDb2xsZWN0aW9uIiwiY29uc3RydWN0b3IiLCJzdHViUGFpciIsInJlc3RvcmUiLCJzYW5kYm94IiwiY3JlYXRlIiwic3ltYm9scyIsInN5bWJvbCIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJpc0Z1bmN0aW9uIiwiYmluZCIsImV4cG9ydERlZmF1bHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxDQUFKOztBQUFNQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsbUJBQVIsQ0FBYixFQUEwQztBQUFDSCxJQUFFSSxDQUFGLEVBQUk7QUFBQ0osUUFBRUksQ0FBRjtBQUFJOztBQUFWLENBQTFDLEVBQXNELENBQXREO0FBQXlELElBQUlDLEtBQUo7QUFBVUosT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDRSxRQUFNRCxDQUFOLEVBQVE7QUFBQ0MsWUFBTUQsQ0FBTjtBQUFROztBQUFsQixDQUFyQyxFQUF5RCxDQUF6RDtBQUE0RCxJQUFJRSxLQUFKO0FBQVVMLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSw4QkFBUixDQUFiLEVBQXFEO0FBQUNHLFFBQU1GLENBQU4sRUFBUTtBQUFDRSxZQUFNRixDQUFOO0FBQVE7O0FBQWxCLENBQXJELEVBQXlFLENBQXpFOztBQUkvSSxNQUFNRyxrQkFBa0IsQ0FBQyxNQUFNO0FBQzdCLFFBQU1DLFlBQVksRUFBbEI7QUFDQSxRQUFNQyxhQUFhLEVBQW5CLENBRjZCLENBSTdCOztBQUVBRCxZQUFVRSxHQUFWLEdBQWlCQyxXQUFELElBQWlCO0FBQy9CRixlQUFXRSxXQUFYLENBQXVCQyxJQUF2QixDQUE0QixHQUFHRCxXQUEvQjtBQUNELEdBRkQ7O0FBSUFILFlBQVVLLElBQVYsR0FBa0JGLFdBQUQsSUFBaUI7QUFDaEMsVUFBTUcscUJBQXFCSCxlQUFlRixXQUFXRSxXQUFyRDtBQUNBLE9BQUdJLE1BQUgsQ0FBVUQsa0JBQVYsRUFBOEJFLE9BQTlCLENBQXVDQyxVQUFELElBQWdCO0FBQ3BELFVBQUksQ0FBQ1IsV0FBV1MsS0FBWCxDQUFpQkQsV0FBV0UsS0FBNUIsQ0FBTCxFQUF5QztBQUN2QyxjQUFNQyxVQUFVO0FBQ2RDLHFCQUFXSixXQUFXSztBQURSLFNBQWhCO0FBR0EsY0FBTUMsT0FBTztBQUNYQywyQkFBaUIsSUFBSVAsV0FBV1EsV0FBZixDQUEyQixJQUEzQixFQUFpQ0wsT0FBakMsQ0FETjtBQUVYSDtBQUZXLFNBQWI7QUFJQVIsbUJBQVdpQixRQUFYLENBQW9CSCxJQUFwQjtBQUNBZCxtQkFBV1MsS0FBWCxDQUFpQkQsV0FBV0UsS0FBNUIsSUFBcUNJLElBQXJDO0FBQ0Q7QUFDRixLQVpEO0FBYUQsR0FmRDs7QUFpQkFmLFlBQVVtQixPQUFWLEdBQW9CLE1BQU07QUFDeEJsQixlQUFXbUIsT0FBWCxDQUFtQkQsT0FBbkI7QUFDQWxCLGVBQVdTLEtBQVgsR0FBbUIsRUFBbkI7QUFDRCxHQUhELENBM0I2QixDQWdDN0I7O0FBRUFULGFBQVdtQixPQUFYLEdBQXFCdEIsTUFBTXNCLE9BQU4sQ0FBY0MsTUFBZCxFQUFyQjtBQUNBcEIsYUFBV1MsS0FBWCxHQUFtQixFQUFuQjtBQUNBVCxhQUFXRSxXQUFYLEdBQXlCLEVBQXpCO0FBQ0FGLGFBQVdxQixPQUFYLEdBQXFCLEVBQXJCOztBQUNBLE9BQUssSUFBSUMsTUFBVCxJQUFtQjFCLE1BQU0yQixVQUFOLENBQWlCQyxTQUFwQyxFQUErQztBQUM3Q3hCLGVBQVdxQixPQUFYLENBQW1CbEIsSUFBbkIsQ0FBd0JtQixNQUF4QjtBQUNEOztBQUVEdEIsYUFBV2lCLFFBQVgsR0FBdUJILElBQUQsSUFBVTtBQUM5QmQsZUFBV3FCLE9BQVgsQ0FBbUJkLE9BQW5CLENBQTRCZSxNQUFELElBQVk7QUFDckMsVUFBSS9CLEVBQUVrQyxVQUFGLENBQWFYLEtBQUtDLGVBQUwsQ0FBcUJPLE1BQXJCLENBQWIsS0FDR0EsVUFBVSxjQURqQixFQUNpQztBQUMvQnRCLG1CQUFXbUIsT0FBWCxDQUFtQmYsSUFBbkIsQ0FDRVUsS0FBS04sVUFEUCxFQUVFYyxNQUZGLEVBR0UvQixFQUFFbUMsSUFBRixDQUFPWixLQUFLQyxlQUFMLENBQXFCTyxNQUFyQixDQUFQLEVBQXFDUixLQUFLQyxlQUExQyxDQUhGO0FBS0Q7QUFDRixLQVREO0FBVUQsR0FYRDs7QUFhQSxTQUFPaEIsU0FBUDtBQUNELENBeER1QixHQUF4Qjs7QUFKQVAsT0FBT21DLGFBQVAsQ0E4RGU3QixlQTlEZixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9od2lsbHNvbl9zdHViLWNvbGxlY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IHNpbm9uIH0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpzaW5vbic7XG5cbmNvbnN0IFN0dWJDb2xsZWN0aW9ucyA9ICgoKSA9PiB7XG4gIGNvbnN0IHB1YmxpY0FwaSA9IHt9O1xuICBjb25zdCBwcml2YXRlQXBpID0ge307XG5cbiAgLyogUHVibGljIEFQSSAqL1xuXG4gIHB1YmxpY0FwaS5hZGQgPSAoY29sbGVjdGlvbnMpID0+IHtcbiAgICBwcml2YXRlQXBpLmNvbGxlY3Rpb25zLnB1c2goLi4uY29sbGVjdGlvbnMpO1xuICB9O1xuXG4gIHB1YmxpY0FwaS5zdHViID0gKGNvbGxlY3Rpb25zKSA9PiB7XG4gICAgY29uc3QgcGVuZGluZ0NvbGxlY3Rpb25zID0gY29sbGVjdGlvbnMgfHwgcHJpdmF0ZUFwaS5jb2xsZWN0aW9ucztcbiAgICBbXS5jb25jYXQocGVuZGluZ0NvbGxlY3Rpb25zKS5mb3JFYWNoKChjb2xsZWN0aW9uKSA9PiB7XG4gICAgICBpZiAoIXByaXZhdGVBcGkucGFpcnNbY29sbGVjdGlvbi5fbmFtZV0pIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICB0cmFuc2Zvcm06IGNvbGxlY3Rpb24uX3RyYW5zZm9ybSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcGFpciA9IHtcbiAgICAgICAgICBsb2NhbENvbGxlY3Rpb246IG5ldyBjb2xsZWN0aW9uLmNvbnN0cnVjdG9yKG51bGwsIG9wdGlvbnMpLFxuICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgIH07XG4gICAgICAgIHByaXZhdGVBcGkuc3R1YlBhaXIocGFpcik7XG4gICAgICAgIHByaXZhdGVBcGkucGFpcnNbY29sbGVjdGlvbi5fbmFtZV0gPSBwYWlyO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHB1YmxpY0FwaS5yZXN0b3JlID0gKCkgPT4ge1xuICAgIHByaXZhdGVBcGkuc2FuZGJveC5yZXN0b3JlKCk7XG4gICAgcHJpdmF0ZUFwaS5wYWlycyA9IHt9O1xuICB9O1xuXG4gIC8qIFByaXZhdGUgQVBJICovXG5cbiAgcHJpdmF0ZUFwaS5zYW5kYm94ID0gc2lub24uc2FuZGJveC5jcmVhdGUoKTtcbiAgcHJpdmF0ZUFwaS5wYWlycyA9IHt9O1xuICBwcml2YXRlQXBpLmNvbGxlY3Rpb25zID0gW107XG4gIHByaXZhdGVBcGkuc3ltYm9scyA9IFtdO1xuICBmb3IgKGxldCBzeW1ib2wgaW4gTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUpIHtcbiAgICBwcml2YXRlQXBpLnN5bWJvbHMucHVzaChzeW1ib2wpO1xuICB9XG5cbiAgcHJpdmF0ZUFwaS5zdHViUGFpciA9IChwYWlyKSA9PiB7XG4gICAgcHJpdmF0ZUFwaS5zeW1ib2xzLmZvckVhY2goKHN5bWJvbCkgPT4ge1xuICAgICAgaWYgKF8uaXNGdW5jdGlvbihwYWlyLmxvY2FsQ29sbGVjdGlvbltzeW1ib2xdKSBcbiAgICAgICAgICAmJiBzeW1ib2wgIT0gJ3NpbXBsZVNjaGVtYScpIHtcbiAgICAgICAgcHJpdmF0ZUFwaS5zYW5kYm94LnN0dWIoXG4gICAgICAgICAgcGFpci5jb2xsZWN0aW9uLFxuICAgICAgICAgIHN5bWJvbCxcbiAgICAgICAgICBfLmJpbmQocGFpci5sb2NhbENvbGxlY3Rpb25bc3ltYm9sXSwgcGFpci5sb2NhbENvbGxlY3Rpb24pXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHB1YmxpY0FwaTtcbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFN0dWJDb2xsZWN0aW9ucztcbiJdfQ==
