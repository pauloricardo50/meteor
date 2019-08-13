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

/* Package-scope variables */
var resetDatabase;

var require = meteorInstall({"node_modules":{"meteor":{"xolvio:cleaner":{"cleaner.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/xolvio_cleaner/cleaner.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
if (Meteor.isServer) {
  var _resetDatabase = function (options) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('resetDatabase is not allowed outside of a development mode. ' + 'Aborting.');
    }

    options = options || {};
    var excludedCollections = ['system.indexes'];

    if (options.excludedCollections) {
      excludedCollections = excludedCollections.concat(options.excludedCollections);
    }

    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;
    var getCollections = Meteor.wrapAsync(db.collections, db);
    var collections = getCollections();

    var appCollections = _.reject(collections, function (col) {
      return col.collectionName.indexOf('velocity') === 0 || excludedCollections.indexOf(col.collectionName) !== -1;
    });

    _.each(appCollections, function (appCollection) {
      var remove = Meteor.wrapAsync(appCollection.remove, appCollection);
      remove({}, {});
    });
  };

  Meteor.methods({
    'xolvio:cleaner/resetDatabase': function (options) {
      _resetDatabase(options);
    }
  });

  resetDatabase = function (options, callback) {
    _resetDatabase(options);

    if (typeof callback === 'function') {
      callback();
    }
  };
}

if (Meteor.isClient) {
  resetDatabase = function (options, callback) {
    Meteor.call('xolvio:cleaner/resetDatabase', options, callback);
  };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/xolvio:cleaner/cleaner.js");

/* Exports */
Package._define("xolvio:cleaner", {
  resetDatabase: resetDatabase
});

})();
