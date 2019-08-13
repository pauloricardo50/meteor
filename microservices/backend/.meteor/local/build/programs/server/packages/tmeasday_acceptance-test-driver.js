(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"tmeasday:acceptance-test-driver":{"acceptance-test-driver.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/tmeasday_acceptance-test-driver/acceptance-test-driver.j //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
module.export({
  runTests: () => runTests
});

const runTests = () => 0;
///////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/tmeasday:acceptance-test-driver/acceptance-test-driver.js");

/* Exports */
Package._define("tmeasday:acceptance-test-driver", exports);

})();

//# sourceURL=meteor://💻app/packages/tmeasday_acceptance-test-driver.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvdG1lYXNkYXk6YWNjZXB0YW5jZS10ZXN0LWRyaXZlci9hY2NlcHRhbmNlLXRlc3QtZHJpdmVyLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsInJ1blRlc3RzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFVBQVEsRUFBQyxNQUFJQTtBQUFkLENBQWQ7O0FBQUEsTUFBTUEsUUFBUSxHQUFHLE1BQU0sQ0FBdkIsQyIsImZpbGUiOiIvcGFja2FnZXMvdG1lYXNkYXlfYWNjZXB0YW5jZS10ZXN0LWRyaXZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHJ1blRlc3RzID0gKCkgPT4gMDtcblxuZXhwb3J0IHsgcnVuVGVzdHMgfTsiXX0=
