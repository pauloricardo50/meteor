//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"hwillson:stub-collections":{"stub_collections.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/hwillson_stub-collections/stub_collections.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");                                         //
                                                                                                                      //
var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);                                                //
                                                                                                                      //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                     //
                                                                                                                      //
var _ = void 0;                                                                                                       // 1
                                                                                                                      //
module.watch(require("meteor/underscore"), {                                                                          // 1
  _: function (v) {                                                                                                   // 1
    _ = v;                                                                                                            // 1
  }                                                                                                                   // 1
}, 0);                                                                                                                // 1
var Mongo = void 0;                                                                                                   // 1
module.watch(require("meteor/mongo"), {                                                                               // 1
  Mongo: function (v) {                                                                                               // 1
    Mongo = v;                                                                                                        // 1
  }                                                                                                                   // 1
}, 1);                                                                                                                // 1
var sinon = void 0;                                                                                                   // 1
module.watch(require("meteor/practicalmeteor:sinon"), {                                                               // 1
  sinon: function (v) {                                                                                               // 1
    sinon = v;                                                                                                        // 1
  }                                                                                                                   // 1
}, 2);                                                                                                                // 1
                                                                                                                      //
var StubCollections = function () {                                                                                   // 5
  var publicApi = {};                                                                                                 // 6
  var privateApi = {}; /* Public API */                                                                               // 7
                                                                                                                      //
  publicApi.add = function (collections) {                                                                            // 11
    var _privateApi$collectio;                                                                                        // 11
                                                                                                                      //
    (_privateApi$collectio = privateApi.collections).push.apply(_privateApi$collectio, (0, _toConsumableArray3.default)(collections));
  };                                                                                                                  // 13
                                                                                                                      //
  publicApi.stub = function (collections) {                                                                           // 15
    var pendingCollections = collections || privateApi.collections;                                                   // 16
    [].concat(pendingCollections).forEach(function (collection) {                                                     // 17
      if (!privateApi.pairs[collection._name]) {                                                                      // 18
        var options = {                                                                                               // 19
          transform: collection._transform                                                                            // 20
        };                                                                                                            // 19
        var pair = {                                                                                                  // 22
          localCollection: new collection.constructor(null, options),                                                 // 23
          collection: collection                                                                                      // 24
        };                                                                                                            // 22
        privateApi.stubPair(pair);                                                                                    // 26
        privateApi.pairs[collection._name] = pair;                                                                    // 27
      }                                                                                                               // 28
    });                                                                                                               // 29
  };                                                                                                                  // 30
                                                                                                                      //
  publicApi.restore = function () {                                                                                   // 32
    privateApi.sandbox.restore();                                                                                     // 33
    privateApi.pairs = {};                                                                                            // 34
  }; /* Private API */                                                                                                // 35
                                                                                                                      //
  privateApi.sandbox = sinon.sandbox.create();                                                                        // 39
  privateApi.pairs = {};                                                                                              // 40
  privateApi.collections = [];                                                                                        // 41
  privateApi.symbols = [];                                                                                            // 42
                                                                                                                      //
  for (var symbol in meteorBabelHelpers.sanitizeForInObject(Mongo.Collection.prototype)) {                            // 43
    privateApi.symbols.push(symbol);                                                                                  // 44
  }                                                                                                                   // 45
                                                                                                                      //
  privateApi.stubPair = function (pair) {                                                                             // 47
    privateApi.symbols.forEach(function (symbol) {                                                                    // 48
      if (_.isFunction(pair.localCollection[symbol]) && symbol != 'simpleSchema') {                                   // 49
        privateApi.sandbox.stub(pair.collection, symbol, _.bind(pair.localCollection[symbol], pair.localCollection));
      }                                                                                                               // 56
    });                                                                                                               // 57
  };                                                                                                                  // 58
                                                                                                                      //
  return publicApi;                                                                                                   // 60
}();                                                                                                                  // 61
                                                                                                                      //
module.exportDefault(StubCollections);                                                                                // 1
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
