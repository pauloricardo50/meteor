(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare, extendPublish;

var require = meteorInstall({"node_modules":{"meteor":{"peerlibrary:extend-publish":{"server.coffee":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/peerlibrary_extend-publish/server.coffee                                                         //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
module.export({
  extendPublish: () => extendPublish
});

var extendPublish = function (newPublishArguments) {
  var Server, originalMeteorPublish, originalPublish; // DDP Server constructor.

  Server = Object.getPrototypeOf(Meteor.server).constructor;
  originalPublish = Server.prototype.publish;

  Server.prototype.publish = function (...args) {
    var newArgs; // If the first argument is an object, we let the original publish function to traverse it.

    if (_.isObject(args[0])) {
      originalPublish.apply(this, args);
      return;
    }

    newArgs = newPublishArguments.apply(this, args);
    return originalPublish.apply(this, newArgs);
  }; // Because Meteor.publish is a bound function it remembers old
  // prototype method so we have wrap it to directly as well.


  originalMeteorPublish = Meteor.publish;
  return Meteor.publish = function (...args) {
    var newArgs; // If the first argument is an object, we let the original publish function to traverse it.

    if (_.isObject(args[0])) {
      originalMeteorPublish.apply(this, args);
      return;
    }

    newArgs = newPublishArguments.apply(this, args);
    return originalMeteorPublish.apply(this, newArgs);
  };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

var exports = require("/node_modules/meteor/peerlibrary:extend-publish/server.coffee");

/* Exports */
Package._define("peerlibrary:extend-publish", exports, {
  extendPublish: extendPublish
});

})();

//# sourceURL=meteor://💻app/packages/peerlibrary_extend-publish.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGVlcmxpYnJhcnlfZXh0ZW5kLXB1Ymxpc2gvc2VydmVyLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyLmNvZmZlZSJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJleHRlbmRQdWJsaXNoIiwibmV3UHVibGlzaEFyZ3VtZW50cyIsIlNlcnZlciIsIm9yaWdpbmFsTWV0ZW9yUHVibGlzaCIsIm9yaWdpbmFsUHVibGlzaCIsIk9iamVjdCIsImdldFByb3RvdHlwZU9mIiwiTWV0ZW9yIiwic2VydmVyIiwiY29uc3RydWN0b3IiLCJwcm90b3R5cGUiLCJwdWJsaXNoIiwiYXJncyIsIm5ld0FyZ3MiLCJfIiwiaXNPYmplY3QiLCJhcHBseSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsTUFBQSxDQUFBQyxNQUFBLENBQU87QUFBQUMsZUFBZ0IsUUFBQUE7QUFBaEIsQ0FBUDs7QUFBQSxJQUFPQSxhQUFQLEdBQXVCLFVBQUNDLG1CQUFEO0FBRXJCLE1BQUFDLE1BQUEsRUFBQUMscUJBQUEsRUFBQUMsZUFBQSxDQUZxQixDQ0VyQjs7QURBQUYsUUFBQSxHQUFTRyxNQUFNLENBQUNDLGNBQVAsQ0FBc0JDLE1BQU0sQ0FBQ0MsTUFBN0IsRUFBcUNDLFdBQTlDO0FBRUFMLGlCQUFBLEdBQWtCRixNQUFNLENBQUFRLFNBQU4sQ0FBUUMsT0FBMUI7O0FBQ0FULFFBQU0sQ0FBQVEsU0FBTixDQUFRQyxPQUFSLEdBQWtCLGFBQUNDLElBQUQ7QUFFaEIsUUFBQUMsT0FBQSxDQUZnQixDQ0VoQjs7QURBQSxRQUFHQyxDQUFDLENBQUNDLFFBQUYsQ0FBV0gsSUFBSyxHQUFoQixDQUFIO0FBQ0VSLHFCQUFlLENBQUNZLEtBQWhCLENBQXNCLElBQXRCLEVBQTRCSixJQUE1QjtBQUNBO0FDRUQ7O0FEQURDLFdBQUEsR0FBVVosbUJBQW1CLENBQUNlLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDSixJQUFoQyxDQUFWO0FDRUEsV0RBQVIsZUFBZSxDQUFDWSxLQUFoQixDQUFzQixJQUF0QixFQUE0QkgsT0FBNUIsQ0NBQTtBRFJnQixHQUFsQixDQUxxQixDQ2VyQjtBQUNBOzs7QURDQVYsdUJBQUEsR0FBd0JJLE1BQU0sQ0FBQ0ksT0FBL0I7QUNDQSxTREFBSixNQUFNLENBQUNJLE9BQVAsR0FBaUIsYUFBQ0MsSUFBRDtBQUVmLFFBQUFDLE9BQUEsQ0FGZSxDQ0VmOztBREFBLFFBQUdDLENBQUMsQ0FBQ0MsUUFBRixDQUFXSCxJQUFLLEdBQWhCLENBQUg7QUFDRVQsMkJBQXFCLENBQUNhLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDSixJQUFsQztBQUNBO0FDRUQ7O0FEQURDLFdBQUEsR0FBVVosbUJBQW1CLENBQUNlLEtBQXBCLENBQTBCLElBQTFCLEVBQWdDSixJQUFoQyxDQUFWO0FDRUEsV0RBQVQscUJBQXFCLENBQUNhLEtBQXRCLENBQTRCLElBQTVCLEVBQWtDSCxPQUFsQyxDQ0FBO0FEUmUsR0NBakI7QURsQnFCLENBQXZCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3BlZXJsaWJyYXJ5X2V4dGVuZC1wdWJsaXNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGV4dGVuZFB1Ymxpc2ggPSAobmV3UHVibGlzaEFyZ3VtZW50cykgLT5cbiAgIyBERFAgU2VydmVyIGNvbnN0cnVjdG9yLlxuICBTZXJ2ZXIgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTWV0ZW9yLnNlcnZlcikuY29uc3RydWN0b3JcblxuICBvcmlnaW5hbFB1Ymxpc2ggPSBTZXJ2ZXI6OnB1Ymxpc2hcbiAgU2VydmVyOjpwdWJsaXNoID0gKGFyZ3MuLi4pIC0+XG4gICAgIyBJZiB0aGUgZmlyc3QgYXJndW1lbnQgaXMgYW4gb2JqZWN0LCB3ZSBsZXQgdGhlIG9yaWdpbmFsIHB1Ymxpc2ggZnVuY3Rpb24gdG8gdHJhdmVyc2UgaXQuXG4gICAgaWYgXy5pc09iamVjdCBhcmdzWzBdXG4gICAgICBvcmlnaW5hbFB1Ymxpc2guYXBwbHkgdGhpcywgYXJnc1xuICAgICAgcmV0dXJuXG5cbiAgICBuZXdBcmdzID0gbmV3UHVibGlzaEFyZ3VtZW50cy5hcHBseSB0aGlzLCBhcmdzXG5cbiAgICBvcmlnaW5hbFB1Ymxpc2guYXBwbHkgdGhpcywgbmV3QXJnc1xuXG4gICMgQmVjYXVzZSBNZXRlb3IucHVibGlzaCBpcyBhIGJvdW5kIGZ1bmN0aW9uIGl0IHJlbWVtYmVycyBvbGRcbiAgIyBwcm90b3R5cGUgbWV0aG9kIHNvIHdlIGhhdmUgd3JhcCBpdCB0byBkaXJlY3RseSBhcyB3ZWxsLlxuICBvcmlnaW5hbE1ldGVvclB1Ymxpc2ggPSBNZXRlb3IucHVibGlzaFxuICBNZXRlb3IucHVibGlzaCA9IChhcmdzLi4uKSAtPlxuICAgICMgSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFuIG9iamVjdCwgd2UgbGV0IHRoZSBvcmlnaW5hbCBwdWJsaXNoIGZ1bmN0aW9uIHRvIHRyYXZlcnNlIGl0LlxuICAgIGlmIF8uaXNPYmplY3QgYXJnc1swXVxuICAgICAgb3JpZ2luYWxNZXRlb3JQdWJsaXNoLmFwcGx5IHRoaXMsIGFyZ3NcbiAgICAgIHJldHVyblxuXG4gICAgbmV3QXJncyA9IG5ld1B1Ymxpc2hBcmd1bWVudHMuYXBwbHkgdGhpcywgYXJnc1xuXG4gICAgb3JpZ2luYWxNZXRlb3JQdWJsaXNoLmFwcGx5IHRoaXMsIG5ld0FyZ3NcbiIsImV4cG9ydCB2YXIgZXh0ZW5kUHVibGlzaCA9IGZ1bmN0aW9uKG5ld1B1Ymxpc2hBcmd1bWVudHMpIHtcbiAgdmFyIFNlcnZlciwgb3JpZ2luYWxNZXRlb3JQdWJsaXNoLCBvcmlnaW5hbFB1Ymxpc2g7XG4gIC8vIEREUCBTZXJ2ZXIgY29uc3RydWN0b3IuXG4gIFNlcnZlciA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihNZXRlb3Iuc2VydmVyKS5jb25zdHJ1Y3RvcjtcbiAgb3JpZ2luYWxQdWJsaXNoID0gU2VydmVyLnByb3RvdHlwZS5wdWJsaXNoO1xuICBTZXJ2ZXIucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgdmFyIG5ld0FyZ3M7XG4gICAgLy8gSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFuIG9iamVjdCwgd2UgbGV0IHRoZSBvcmlnaW5hbCBwdWJsaXNoIGZ1bmN0aW9uIHRvIHRyYXZlcnNlIGl0LlxuICAgIGlmIChfLmlzT2JqZWN0KGFyZ3NbMF0pKSB7XG4gICAgICBvcmlnaW5hbFB1Ymxpc2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5ld0FyZ3MgPSBuZXdQdWJsaXNoQXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIHJldHVybiBvcmlnaW5hbFB1Ymxpc2guYXBwbHkodGhpcywgbmV3QXJncyk7XG4gIH07XG4gIC8vIEJlY2F1c2UgTWV0ZW9yLnB1Ymxpc2ggaXMgYSBib3VuZCBmdW5jdGlvbiBpdCByZW1lbWJlcnMgb2xkXG4gIC8vIHByb3RvdHlwZSBtZXRob2Qgc28gd2UgaGF2ZSB3cmFwIGl0IHRvIGRpcmVjdGx5IGFzIHdlbGwuXG4gIG9yaWdpbmFsTWV0ZW9yUHVibGlzaCA9IE1ldGVvci5wdWJsaXNoO1xuICByZXR1cm4gTWV0ZW9yLnB1Ymxpc2ggPSBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgdmFyIG5ld0FyZ3M7XG4gICAgLy8gSWYgdGhlIGZpcnN0IGFyZ3VtZW50IGlzIGFuIG9iamVjdCwgd2UgbGV0IHRoZSBvcmlnaW5hbCBwdWJsaXNoIGZ1bmN0aW9uIHRvIHRyYXZlcnNlIGl0LlxuICAgIGlmIChfLmlzT2JqZWN0KGFyZ3NbMF0pKSB7XG4gICAgICBvcmlnaW5hbE1ldGVvclB1Ymxpc2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG5ld0FyZ3MgPSBuZXdQdWJsaXNoQXJndW1lbnRzLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIHJldHVybiBvcmlnaW5hbE1ldGVvclB1Ymxpc2guYXBwbHkodGhpcywgbmV3QXJncyk7XG4gIH07XG59O1xuIl19
