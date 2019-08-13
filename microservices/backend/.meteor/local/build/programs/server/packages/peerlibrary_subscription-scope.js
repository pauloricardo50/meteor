(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var extendPublish = Package['peerlibrary:extend-publish'].extendPublish;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var meteorInstall = Package.modules.meteorInstall;

/* Package-scope variables */
var __coffeescriptShare;

var require = meteorInstall({"node_modules":{"meteor":{"peerlibrary:subscription-scope":{"server.coffee":function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/peerlibrary_subscription-scope/server.coffee                  //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
extendPublish(function (name, func, options) {
  var newFunc;

  newFunc = function (...args) {
    var enabled, originalAdded, originalChanged, publish, scopeFieldName;
    publish = this;
    scopeFieldName = `_sub_${publish._subscriptionId}`;
    enabled = false;

    publish.enableScope = function () {
      return enabled = true;
    };

    originalAdded = publish.added;

    publish.added = function (collectionName, id, fields) {
      // Add our scoping field.
      if (enabled) {
        fields = _.clone(fields);
        fields[scopeFieldName] = 1;
      }

      return originalAdded.call(this, collectionName, id, fields);
    };

    originalChanged = publish.changed;

    publish.changed = function (collectionName, id, fields) {
      // We do not allow changes to our scoping field.
      if (enabled && scopeFieldName in fields) {
        fields = _.clone(fields);
        delete fields[scopeFieldName];
      }

      return originalChanged.call(this, collectionName, id, fields);
    };

    return func.apply(publish, args);
  };

  return [name, newFunc, options];
});
////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".coffee"
  ]
});

require("/node_modules/meteor/peerlibrary:subscription-scope/server.coffee");

/* Exports */
Package._define("peerlibrary:subscription-scope");

})();

//# sourceURL=meteor://💻app/packages/peerlibrary_subscription-scope.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcGVlcmxpYnJhcnlfc3Vic2NyaXB0aW9uLXNjb3BlL3NlcnZlci5jb2ZmZWUiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci5jb2ZmZWUiXSwibmFtZXMiOlsiZXh0ZW5kUHVibGlzaCIsIm5hbWUiLCJmdW5jIiwib3B0aW9ucyIsIm5ld0Z1bmMiLCJhcmdzIiwiZW5hYmxlZCIsIm9yaWdpbmFsQWRkZWQiLCJvcmlnaW5hbENoYW5nZWQiLCJwdWJsaXNoIiwic2NvcGVGaWVsZE5hbWUiLCJfc3Vic2NyaXB0aW9uSWQiLCJlbmFibGVTY29wZSIsImFkZGVkIiwiY29sbGVjdGlvbk5hbWUiLCJpZCIsImZpZWxkcyIsIl8iLCJjbG9uZSIsImNhbGwiLCJjaGFuZ2VkIiwiYXBwbHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxhQUFBLENBQWMsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQLEVBQWFDLE9BQWI7QUFDWixNQUFBQyxPQUFBOztBQUFBQSxTQUFBLEdBQVUsYUFBQ0MsSUFBRDtBQUNSLFFBQUFDLE9BQUEsRUFBQUMsYUFBQSxFQUFBQyxlQUFBLEVBQUFDLE9BQUEsRUFBQUMsY0FBQTtBQUFBRCxXQUFBLEdBQVUsSUFBVjtBQUVBQyxrQkFBQSxHQUFpQixRQUFRRCxPQUFPLENBQUNFLGVBQWhCLEVBQWpCO0FBRUFMLFdBQUEsR0FBVSxLQUFWOztBQUVBRyxXQUFPLENBQUNHLFdBQVIsR0FBc0I7QUNBcEIsYURDQU4sT0FBQSxHQUFVLElDRFY7QURBb0IsS0FBdEI7O0FBR0FDLGlCQUFBLEdBQWdCRSxPQUFPLENBQUNJLEtBQXhCOztBQUNBSixXQUFPLENBQUNJLEtBQVIsR0FBZ0IsVUFBQ0MsY0FBRCxFQUFpQkMsRUFBakIsRUFBcUJDLE1BQXJCO0FDQWQ7QURFQSxVQUFHVixPQUFIO0FBQ0VVLGNBQUEsR0FBU0MsQ0FBQyxDQUFDQyxLQUFGLENBQVFGLE1BQVIsQ0FBVDtBQUNBQSxjQUFPLENBQUFOLGNBQUEsQ0FBUCxHQUF5QixDQUF6QjtBQ0FEOztBQUNELGFEQ0FILGFBQWEsQ0FBQ1ksSUFBZCxDQUFtQixJQUFuQixFQUFzQkwsY0FBdEIsRUFBc0NDLEVBQXRDLEVBQTBDQyxNQUExQyxDQ0RBO0FETGMsS0FBaEI7O0FBUUFSLG1CQUFBLEdBQWtCQyxPQUFPLENBQUNXLE9BQTFCOztBQUNBWCxXQUFPLENBQUNXLE9BQVIsR0FBa0IsVUFBQ04sY0FBRCxFQUFpQkMsRUFBakIsRUFBcUJDLE1BQXJCO0FDQWhCO0FERUEsVUFBR1YsT0FBQSxJQUFZSSxjQUFBLElBQWtCTSxNQUFqQztBQUNFQSxjQUFBLEdBQVNDLENBQUMsQ0FBQ0MsS0FBRixDQUFRRixNQUFSLENBQVQ7QUFDQSxlQUFPQSxNQUFPLENBQUFOLGNBQUEsQ0FBZDtBQ0FEOztBQUNELGFEQ0FGLGVBQWUsQ0FBQ1csSUFBaEIsQ0FBcUIsSUFBckIsRUFBd0JMLGNBQXhCLEVBQXdDQyxFQUF4QyxFQUE0Q0MsTUFBNUMsQ0NEQTtBRExnQixLQUFsQjs7QUNPQSxXRENBZCxJQUFJLENBQUNtQixLQUFMLENBQVdaLE9BQVgsRUFBb0JKLElBQXBCLENDREE7QUQzQlEsR0FBVjs7QUM2QkEsU0RDQSxDQUFDSixJQUFELEVBQU9HLE9BQVAsRUFBZ0JELE9BQWhCLENDREE7QUQ5QkYsRyIsImZpbGUiOiIvcGFja2FnZXMvcGVlcmxpYnJhcnlfc3Vic2NyaXB0aW9uLXNjb3BlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXh0ZW5kUHVibGlzaCAobmFtZSwgZnVuYywgb3B0aW9ucykgLT5cbiAgbmV3RnVuYyA9IChhcmdzLi4uKSAtPlxuICAgIHB1Ymxpc2ggPSBAXG5cbiAgICBzY29wZUZpZWxkTmFtZSA9IFwiX3N1Yl8je3B1Ymxpc2guX3N1YnNjcmlwdGlvbklkfVwiXG5cbiAgICBlbmFibGVkID0gZmFsc2VcblxuICAgIHB1Ymxpc2guZW5hYmxlU2NvcGUgPSAtPlxuICAgICAgZW5hYmxlZCA9IHRydWVcblxuICAgIG9yaWdpbmFsQWRkZWQgPSBwdWJsaXNoLmFkZGVkXG4gICAgcHVibGlzaC5hZGRlZCA9IChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykgLT5cbiAgICAgICMgQWRkIG91ciBzY29waW5nIGZpZWxkLlxuICAgICAgaWYgZW5hYmxlZFxuICAgICAgICBmaWVsZHMgPSBfLmNsb25lIGZpZWxkc1xuICAgICAgICBmaWVsZHNbc2NvcGVGaWVsZE5hbWVdID0gMVxuXG4gICAgICBvcmlnaW5hbEFkZGVkLmNhbGwgQCwgY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHNcblxuICAgIG9yaWdpbmFsQ2hhbmdlZCA9IHB1Ymxpc2guY2hhbmdlZFxuICAgIHB1Ymxpc2guY2hhbmdlZCA9IChjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykgLT5cbiAgICAgICMgV2UgZG8gbm90IGFsbG93IGNoYW5nZXMgdG8gb3VyIHNjb3BpbmcgZmllbGQuXG4gICAgICBpZiBlbmFibGVkIGFuZCBzY29wZUZpZWxkTmFtZSBvZiBmaWVsZHNcbiAgICAgICAgZmllbGRzID0gXy5jbG9uZSBmaWVsZHNcbiAgICAgICAgZGVsZXRlIGZpZWxkc1tzY29wZUZpZWxkTmFtZV1cblxuICAgICAgb3JpZ2luYWxDaGFuZ2VkLmNhbGwgQCwgY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHNcblxuICAgIGZ1bmMuYXBwbHkgcHVibGlzaCwgYXJnc1xuXG4gIFtuYW1lLCBuZXdGdW5jLCBvcHRpb25zXVxuIiwiZXh0ZW5kUHVibGlzaChmdW5jdGlvbihuYW1lLCBmdW5jLCBvcHRpb25zKSB7XG4gIHZhciBuZXdGdW5jO1xuICBuZXdGdW5jID0gZnVuY3Rpb24oLi4uYXJncykge1xuICAgIHZhciBlbmFibGVkLCBvcmlnaW5hbEFkZGVkLCBvcmlnaW5hbENoYW5nZWQsIHB1Ymxpc2gsIHNjb3BlRmllbGROYW1lO1xuICAgIHB1Ymxpc2ggPSB0aGlzO1xuICAgIHNjb3BlRmllbGROYW1lID0gYF9zdWJfJHtwdWJsaXNoLl9zdWJzY3JpcHRpb25JZH1gO1xuICAgIGVuYWJsZWQgPSBmYWxzZTtcbiAgICBwdWJsaXNoLmVuYWJsZVNjb3BlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZW5hYmxlZCA9IHRydWU7XG4gICAgfTtcbiAgICBvcmlnaW5hbEFkZGVkID0gcHVibGlzaC5hZGRlZDtcbiAgICBwdWJsaXNoLmFkZGVkID0gZnVuY3Rpb24oY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpIHtcbiAgICAgIC8vIEFkZCBvdXIgc2NvcGluZyBmaWVsZC5cbiAgICAgIGlmIChlbmFibGVkKSB7XG4gICAgICAgIGZpZWxkcyA9IF8uY2xvbmUoZmllbGRzKTtcbiAgICAgICAgZmllbGRzW3Njb3BlRmllbGROYW1lXSA9IDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gb3JpZ2luYWxBZGRlZC5jYWxsKHRoaXMsIGNvbGxlY3Rpb25OYW1lLCBpZCwgZmllbGRzKTtcbiAgICB9O1xuICAgIG9yaWdpbmFsQ2hhbmdlZCA9IHB1Ymxpc2guY2hhbmdlZDtcbiAgICBwdWJsaXNoLmNoYW5nZWQgPSBmdW5jdGlvbihjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcykge1xuICAgICAgLy8gV2UgZG8gbm90IGFsbG93IGNoYW5nZXMgdG8gb3VyIHNjb3BpbmcgZmllbGQuXG4gICAgICBpZiAoZW5hYmxlZCAmJiBzY29wZUZpZWxkTmFtZSBpbiBmaWVsZHMpIHtcbiAgICAgICAgZmllbGRzID0gXy5jbG9uZShmaWVsZHMpO1xuICAgICAgICBkZWxldGUgZmllbGRzW3Njb3BlRmllbGROYW1lXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmlnaW5hbENoYW5nZWQuY2FsbCh0aGlzLCBjb2xsZWN0aW9uTmFtZSwgaWQsIGZpZWxkcyk7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuYy5hcHBseShwdWJsaXNoLCBhcmdzKTtcbiAgfTtcbiAgcmV0dXJuIFtuYW1lLCBuZXdGdW5jLCBvcHRpb25zXTtcbn0pO1xuIl19
