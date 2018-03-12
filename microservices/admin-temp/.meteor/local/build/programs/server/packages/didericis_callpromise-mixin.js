(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var CallPromiseMixin;

var require = meteorInstall({"node_modules":{"meteor":{"didericis:callpromise-mixin":{"callpromise-mixin.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/didericis_callpromise-mixin/callpromise-mixin.js         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
CallPromiseMixin = function CallPromiseMixin(methodOptions) {
    methodOptions.callPromise = function callPromise(args) {
        return new Promise((resolve, reject) => {
            this.call(args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    return methodOptions;
};
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/didericis:callpromise-mixin/callpromise-mixin.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['didericis:callpromise-mixin'] = {}, {
  CallPromiseMixin: CallPromiseMixin
});

})();

//# sourceURL=meteor://💻app/packages/didericis_callpromise-mixin.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGlkZXJpY2lzOmNhbGxwcm9taXNlLW1peGluL2NhbGxwcm9taXNlLW1peGluLmpzIl0sIm5hbWVzIjpbIkNhbGxQcm9taXNlTWl4aW4iLCJtZXRob2RPcHRpb25zIiwiY2FsbFByb21pc2UiLCJhcmdzIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJjYWxsIiwiZXJyIiwicmVzdWx0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLG1CQUFtQixTQUFTQSxnQkFBVCxDQUEwQkMsYUFBMUIsRUFBeUM7QUFDeERBLGtCQUFjQyxXQUFkLEdBQTRCLFNBQVNBLFdBQVQsQ0FBcUJDLElBQXJCLEVBQTJCO0FBQ25ELGVBQU8sSUFBSUMsT0FBSixDQUFZLENBQUNDLE9BQUQsRUFBVUMsTUFBVixLQUFxQjtBQUNwQyxpQkFBS0MsSUFBTCxDQUFVSixJQUFWLEVBQWdCLENBQUNLLEdBQUQsRUFBTUMsTUFBTixLQUFpQjtBQUM3QixvQkFBSUQsR0FBSixFQUFTO0FBQ0xGLDJCQUFPRSxHQUFQO0FBQ0gsaUJBRkQsTUFFTztBQUNISCw0QkFBUUksTUFBUjtBQUNIO0FBQ0osYUFORDtBQU9ILFNBUk0sQ0FBUDtBQVNILEtBVkQ7O0FBV0EsV0FBT1IsYUFBUDtBQUNILENBYkQsQyIsImZpbGUiOiIvcGFja2FnZXMvZGlkZXJpY2lzX2NhbGxwcm9taXNlLW1peGluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQ2FsbFByb21pc2VNaXhpbiA9IGZ1bmN0aW9uIENhbGxQcm9taXNlTWl4aW4obWV0aG9kT3B0aW9ucykge1xuICAgIG1ldGhvZE9wdGlvbnMuY2FsbFByb21pc2UgPSBmdW5jdGlvbiBjYWxsUHJvbWlzZShhcmdzKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNhbGwoYXJncywgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbWV0aG9kT3B0aW9uczsgICAgIFxufSJdfQ==
