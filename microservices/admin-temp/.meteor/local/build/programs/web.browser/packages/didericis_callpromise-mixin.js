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
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var CallPromiseMixin;

var require = meteorInstall({"node_modules":{"meteor":{"didericis:callpromise-mixin":{"callpromise-mixin.js":function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/didericis_callpromise-mixin/callpromise-mixin.js         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
CallPromiseMixin = function () {                                     // 1
    function CallPromiseMixin(methodOptions) {                       // 1
        methodOptions.callPromise = function () {                    // 2
            function callPromise(args) {                             // 2
                var _this = this;                                    // 2
                                                                     //
                return new Promise(function (resolve, reject) {      // 3
                    _this.call(args, function (err, result) {        // 4
                        if (err) {                                   // 5
                            reject(err);                             // 6
                        } else {                                     // 7
                            resolve(result);                         // 8
                        }                                            // 9
                    });                                              // 10
                });                                                  // 11
            }                                                        // 12
                                                                     //
            return callPromise;                                      // 2
        }();                                                         // 2
                                                                     //
        return methodOptions;                                        // 13
    }                                                                // 14
                                                                     //
    return CallPromiseMixin;                                         // 1
}();                                                                 // 1
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
