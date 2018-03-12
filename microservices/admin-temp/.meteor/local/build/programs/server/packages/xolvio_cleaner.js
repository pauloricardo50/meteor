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
  const _resetDatabase = function (options) {
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
      remove({});
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
require("./node_modules/meteor/xolvio:cleaner/cleaner.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['xolvio:cleaner'] = {}, {
  resetDatabase: resetDatabase
});

})();

//# sourceURL=meteor://💻app/packages/xolvio_cleaner.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMveG9sdmlvOmNsZWFuZXIvY2xlYW5lci5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJpc1NlcnZlciIsIl9yZXNldERhdGFiYXNlIiwib3B0aW9ucyIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsIkVycm9yIiwiZXhjbHVkZWRDb2xsZWN0aW9ucyIsImNvbmNhdCIsImRiIiwiTW9uZ29JbnRlcm5hbHMiLCJkZWZhdWx0UmVtb3RlQ29sbGVjdGlvbkRyaXZlciIsIm1vbmdvIiwiZ2V0Q29sbGVjdGlvbnMiLCJ3cmFwQXN5bmMiLCJjb2xsZWN0aW9ucyIsImFwcENvbGxlY3Rpb25zIiwiXyIsInJlamVjdCIsImNvbCIsImNvbGxlY3Rpb25OYW1lIiwiaW5kZXhPZiIsImVhY2giLCJhcHBDb2xsZWN0aW9uIiwicmVtb3ZlIiwibWV0aG9kcyIsInJlc2V0RGF0YWJhc2UiLCJjYWxsYmFjayIsImlzQ2xpZW50IiwiY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLE9BQU9DLFFBQVgsRUFBcUI7QUFDbkIsUUFBTUMsaUJBQWlCLFVBQVVDLE9BQVYsRUFBbUI7QUFDeEMsUUFBSUMsUUFBUUMsR0FBUixDQUFZQyxRQUFaLEtBQXlCLGFBQTdCLEVBQTRDO0FBQzFDLFlBQU0sSUFBSUMsS0FBSixDQUNKLGlFQUNBLFdBRkksQ0FBTjtBQUlEOztBQUVESixjQUFVQSxXQUFXLEVBQXJCO0FBQ0EsUUFBSUssc0JBQXNCLENBQUMsZ0JBQUQsQ0FBMUI7O0FBQ0EsUUFBSUwsUUFBUUssbUJBQVosRUFBaUM7QUFDL0JBLDRCQUFzQkEsb0JBQW9CQyxNQUFwQixDQUEyQk4sUUFBUUssbUJBQW5DLENBQXRCO0FBQ0Q7O0FBRUQsUUFBSUUsS0FBS0MsZUFBZUMsNkJBQWYsR0FBK0NDLEtBQS9DLENBQXFESCxFQUE5RDtBQUNBLFFBQUlJLGlCQUFpQmQsT0FBT2UsU0FBUCxDQUFpQkwsR0FBR00sV0FBcEIsRUFBaUNOLEVBQWpDLENBQXJCO0FBQ0EsUUFBSU0sY0FBY0YsZ0JBQWxCOztBQUNBLFFBQUlHLGlCQUFpQkMsRUFBRUMsTUFBRixDQUFTSCxXQUFULEVBQXNCLFVBQVVJLEdBQVYsRUFBZTtBQUN4RCxhQUFPQSxJQUFJQyxjQUFKLENBQW1CQyxPQUFuQixDQUEyQixVQUEzQixNQUEyQyxDQUEzQyxJQUNMZCxvQkFBb0JjLE9BQXBCLENBQTRCRixJQUFJQyxjQUFoQyxNQUFvRCxDQUFDLENBRHZEO0FBRUQsS0FIb0IsQ0FBckI7O0FBS0FILE1BQUVLLElBQUYsQ0FBT04sY0FBUCxFQUF1QixVQUFVTyxhQUFWLEVBQXlCO0FBQzlDLFVBQUlDLFNBQVN6QixPQUFPZSxTQUFQLENBQWlCUyxjQUFjQyxNQUEvQixFQUF1Q0QsYUFBdkMsQ0FBYjtBQUNBQyxhQUFPLEVBQVA7QUFDRCxLQUhEO0FBSUQsR0ExQkQ7O0FBNEJBekIsU0FBTzBCLE9BQVAsQ0FBZTtBQUNiLG9DQUFnQyxVQUFVdkIsT0FBVixFQUFtQjtBQUNqREQscUJBQWVDLE9BQWY7QUFDRDtBQUhZLEdBQWY7O0FBTUF3QixrQkFBZ0IsVUFBU3hCLE9BQVQsRUFBa0J5QixRQUFsQixFQUE0QjtBQUMxQzFCLG1CQUFlQyxPQUFmOztBQUNBLFFBQUksT0FBT3lCLFFBQVAsS0FBb0IsVUFBeEIsRUFBb0M7QUFBRUE7QUFBYTtBQUNwRCxHQUhEO0FBS0Q7O0FBQ0QsSUFBSTVCLE9BQU82QixRQUFYLEVBQXFCO0FBQ25CRixrQkFBZ0IsVUFBU3hCLE9BQVQsRUFBa0J5QixRQUFsQixFQUE0QjtBQUMxQzVCLFdBQU84QixJQUFQLENBQVksOEJBQVosRUFBNEMzQixPQUE1QyxFQUFxRHlCLFFBQXJEO0FBQ0QsR0FGRDtBQUdELEMiLCJmaWxlIjoiL3BhY2thZ2VzL3hvbHZpb19jbGVhbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBjb25zdCBfcmVzZXREYXRhYmFzZSA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdyZXNldERhdGFiYXNlIGlzIG5vdCBhbGxvd2VkIG91dHNpZGUgb2YgYSBkZXZlbG9wbWVudCBtb2RlLiAnICtcbiAgICAgICAgJ0Fib3J0aW5nLidcbiAgICAgICk7XG4gICAgfVxuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdmFyIGV4Y2x1ZGVkQ29sbGVjdGlvbnMgPSBbJ3N5c3RlbS5pbmRleGVzJ107XG4gICAgaWYgKG9wdGlvbnMuZXhjbHVkZWRDb2xsZWN0aW9ucykge1xuICAgICAgZXhjbHVkZWRDb2xsZWN0aW9ucyA9IGV4Y2x1ZGVkQ29sbGVjdGlvbnMuY29uY2F0KG9wdGlvbnMuZXhjbHVkZWRDb2xsZWN0aW9ucyk7XG4gICAgfVxuXG4gICAgdmFyIGRiID0gTW9uZ29JbnRlcm5hbHMuZGVmYXVsdFJlbW90ZUNvbGxlY3Rpb25Ecml2ZXIoKS5tb25nby5kYjtcbiAgICB2YXIgZ2V0Q29sbGVjdGlvbnMgPSBNZXRlb3Iud3JhcEFzeW5jKGRiLmNvbGxlY3Rpb25zLCBkYik7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gZ2V0Q29sbGVjdGlvbnMoKTtcbiAgICB2YXIgYXBwQ29sbGVjdGlvbnMgPSBfLnJlamVjdChjb2xsZWN0aW9ucywgZnVuY3Rpb24gKGNvbCkge1xuICAgICAgcmV0dXJuIGNvbC5jb2xsZWN0aW9uTmFtZS5pbmRleE9mKCd2ZWxvY2l0eScpID09PSAwIHx8XG4gICAgICAgIGV4Y2x1ZGVkQ29sbGVjdGlvbnMuaW5kZXhPZihjb2wuY29sbGVjdGlvbk5hbWUpICE9PSAtMTtcbiAgICB9KTtcblxuICAgIF8uZWFjaChhcHBDb2xsZWN0aW9ucywgZnVuY3Rpb24gKGFwcENvbGxlY3Rpb24pIHtcbiAgICAgIHZhciByZW1vdmUgPSBNZXRlb3Iud3JhcEFzeW5jKGFwcENvbGxlY3Rpb24ucmVtb3ZlLCBhcHBDb2xsZWN0aW9uKTtcbiAgICAgIHJlbW92ZSh7fSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICd4b2x2aW86Y2xlYW5lci9yZXNldERhdGFiYXNlJzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgIF9yZXNldERhdGFiYXNlKG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmVzZXREYXRhYmFzZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIGNhbGxiYWNrKSB7XG4gICAgX3Jlc2V0RGF0YWJhc2Uob3B0aW9ucyk7XG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykgeyBjYWxsYmFjaygpOyB9XG4gIH1cblxufVxuaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICByZXNldERhdGFiYXNlID0gZnVuY3Rpb24ob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBNZXRlb3IuY2FsbCgneG9sdmlvOmNsZWFuZXIvcmVzZXREYXRhYmFzZScsIG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgfVxufVxuIl19
