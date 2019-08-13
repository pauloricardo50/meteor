(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:mutations":{"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cultofcoders_mutations/main.js                                                                     //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  Mutation: () => Mutation,
  wrap: () => wrap
});
let wrap;
module.link("./lib/wrap", {
  default(v) {
    wrap = v;
  }

}, 0);
let Mutation;
module.link("./lib/mutation.class", {
  default(v) {
    Mutation = v;
  }

}, 1);
module.link("./lib/debug");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aop.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cultofcoders_mutations/lib/aop.js                                                                  //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
class AOP {
  constructor() {
    this.befores = [];
    this.afters = [];
  }

  addBefore(fn) {
    check(fn, Function);
    this.befores.push(fn);
  }

  addAfter(fn) {
    check(fn, Function);
    this.afters.push(fn);
  }

  executeBefores(...args) {
    this.befores.forEach(fn => fn.call(null, ...args));
  }

  executeAfters(...args) {
    this.afters.forEach(fn => fn.call(null, ...args));
  }

}

module.exportDefault(AOP);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cultofcoders_mutations/lib/debug.js                                                                //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
let Mutation;
module.link("./mutation.class", {
  default(v) {
    Mutation = v;
  }

}, 0);
Object.assign(Mutation, {
  isDebugEnabled: Meteor.isDevelopment || process.env.MUTATION_DEBUG_ENABLED
});
Mutation.addBeforeCall(({
  config,
  params,
  context
}) => {
  if (Mutation.isDebugEnabled) {
    console.log(`[mutations][${config.name}] Calling with params:`, params);
  }
});
Mutation.addAfterCall(({
  config,
  params,
  context,
  result,
  error
}) => {
  if (Mutation.isDebugEnabled) {
    const time = new Date();

    if (!error) {
      console.log(`[mutations][${config.name}] Received result:`, result);
    } else {
      console.error(`[mutations][${config.name}] Received error:`, error);
    }
  }
});
Mutation.addBeforeExecution(({
  config,
  params,
  context
}) => {
  if (Mutation.isDebugEnabled) {
    const time = new Date();
    console.log(`[mutations][${config.name}] Received call with params: ${JSON.stringify(params)}`);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mutation.class.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cultofcoders_mutations/lib/mutation.class.js                                                       //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  default: () => Mutation
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let AOP;
module.link("./aop", {
  default(v) {
    AOP = v;
  }

}, 1);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 2);

class Mutation {
  constructor(config) {
    Mutation.checkDefaultConfig(config);
    this.config = config;
    this.callAOP = new AOP();
    this.executionAOP = new AOP();
  }
  /**
   * @param {Function} fn
   */


  static addBeforeCall(fn) {
    this.callAOP.addBefore(fn);
  }
  /**
   * @param {Function} fn
   */


  static addAfterCall(fn) {
    this.callAOP.addAfter(fn);
  }
  /**
   * @param {Function} fn
   */


  static addBeforeExecution(fn) {
    this.executionAOP.addBefore(fn);
  }
  /**
   * @param {Function} fn
   */


  static addAfterExecution(fn) {
    this.executionAOP.addAfter(fn);
  }
  /**
   * @param {Object} config
   */


  static checkDefaultConfig(config) {
    check(config, Object);

    if (typeof config.name !== 'string') {
      throw new Meteor.Error('invalid-config', 'You must provide a "name" property to your mutation config.');
    }
  }
  /**
   * @param {Function} fn
   */


  addBeforeCall(fn) {
    this.callAOP.addBefore(fn);
  }
  /**
   * @param {Function} fn
   */


  addAfterCall(fn) {
    this.callAOP.addAfter(fn);
  }
  /**
   * @param {Function} fn
   */


  addBeforeExecution(fn) {
    this.executionAOP.addBefore(fn);
  }
  /**
   * @param {Function} fn
   */


  addAfterExecution(fn) {
    this.executionAOP.addAfter(fn);
  }
  /**
   * Runs the mutation inside a promise
   * @param {Object} callParams
   * @param {Object} options Meteor options https://docs.meteor.com/api/methods.html#Meteor-apply
   * @returns {Promise}
   */


  run(callParams, options = {}) {
    const config = this.config;
    const aopData = {
      config,
      params: callParams
    };
    Mutation.callAOP.executeBefores(aopData);
    this.callAOP.executeBefores(aopData);
    const {
      name,
      params
    } = config;
    return new Promise((resolve, reject) => {
      Meteor.apply(name, [callParams], options, (error, result) => {
        const aopData = {
          config,
          params: callParams,
          result,
          error
        };
        Mutation.callAOP.executeAfters(aopData);
        this.callAOP.executeAfters(aopData);

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * Creates the Meteor Method and the handler for it
   * @param {Function} fn
   */


  setHandler(fn) {
    const config = this.config;
    const {
      name,
      params
    } = config;
    const self = this;
    Meteor.methods({
      [name](params = {}) {
        if (config.params) {
          check(params, config.params);
        }

        let aopData = {
          context: this,
          config,
          params
        };
        Mutation.executionAOP.executeBefores(aopData);
        self.executionAOP.executeBefores(aopData);
        let error, result;

        try {
          result = fn.call(null, this, params);
        } catch (e) {
          error = e;
        }

        aopData = {
          context: this,
          config,
          params,
          result,
          error
        };
        Mutation.executionAOP.executeAfters(aopData);
        self.executionAOP.executeAfters(aopData);

        if (error) {
          throw error;
        }

        return result;
      }

    });
  }

}

Mutation.callAOP = new AOP();
Mutation.executionAOP = new AOP();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"wrap.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/cultofcoders_mutations/lib/wrap.js                                                                 //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
module.export({
  default: () => wrap
});
let Mutation;
module.link("./mutation.class", {
  default(v) {
    Mutation = v;
  }

}, 0);

function wrap(config) {
  return new Mutation(config);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:mutations/main.js");

/* Exports */
Package._define("cultofcoders:mutations", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_mutations.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOm11dGF0aW9ucy9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6bXV0YXRpb25zL2xpYi9hb3AuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczptdXRhdGlvbnMvbGliL2RlYnVnLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6bXV0YXRpb25zL2xpYi9tdXRhdGlvbi5jbGFzcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOm11dGF0aW9ucy9saWIvd3JhcC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJNdXRhdGlvbiIsIndyYXAiLCJsaW5rIiwiZGVmYXVsdCIsInYiLCJBT1AiLCJiZWZvcmVzIiwiYWZ0ZXJzIiwiYWRkQmVmb3JlIiwiZm4iLCJjaGVjayIsIkZ1bmN0aW9uIiwicHVzaCIsImFkZEFmdGVyIiwiZXhlY3V0ZUJlZm9yZXMiLCJhcmdzIiwiZm9yRWFjaCIsImNhbGwiLCJleGVjdXRlQWZ0ZXJzIiwiZXhwb3J0RGVmYXVsdCIsIk9iamVjdCIsImFzc2lnbiIsImlzRGVidWdFbmFibGVkIiwiTWV0ZW9yIiwiaXNEZXZlbG9wbWVudCIsInByb2Nlc3MiLCJlbnYiLCJNVVRBVElPTl9ERUJVR19FTkFCTEVEIiwiYWRkQmVmb3JlQ2FsbCIsImNvbmZpZyIsInBhcmFtcyIsImNvbnRleHQiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImFkZEFmdGVyQ2FsbCIsInJlc3VsdCIsImVycm9yIiwidGltZSIsIkRhdGUiLCJhZGRCZWZvcmVFeGVjdXRpb24iLCJKU09OIiwic3RyaW5naWZ5IiwiTWF0Y2giLCJjb25zdHJ1Y3RvciIsImNoZWNrRGVmYXVsdENvbmZpZyIsImNhbGxBT1AiLCJleGVjdXRpb25BT1AiLCJhZGRBZnRlckV4ZWN1dGlvbiIsIkVycm9yIiwicnVuIiwiY2FsbFBhcmFtcyIsIm9wdGlvbnMiLCJhb3BEYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJhcHBseSIsInNldEhhbmRsZXIiLCJzZWxmIiwibWV0aG9kcyIsImUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxVQUFRLEVBQUMsTUFBSUEsUUFBZDtBQUF1QkMsTUFBSSxFQUFDLE1BQUlBO0FBQWhDLENBQWQ7QUFBcUQsSUFBSUEsSUFBSjtBQUFTSCxNQUFNLENBQUNJLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNILFFBQUksR0FBQ0csQ0FBTDtBQUFPOztBQUFuQixDQUF6QixFQUE4QyxDQUE5QztBQUFpRCxJQUFJSixRQUFKO0FBQWFGLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUFuQyxFQUE0RCxDQUE1RDtBQUErRE4sTUFBTSxDQUFDSSxJQUFQLENBQVksYUFBWixFOzs7Ozs7Ozs7OztBQ0EzTCxNQUFNRyxHQUFOLENBQVU7QUFBQTtBQUFBLFNBQ05DLE9BRE0sR0FDSSxFQURKO0FBQUEsU0FFTkMsTUFGTSxHQUVHLEVBRkg7QUFBQTs7QUFJTkMsV0FBUyxDQUFDQyxFQUFELEVBQUs7QUFDVkMsU0FBSyxDQUFDRCxFQUFELEVBQUtFLFFBQUwsQ0FBTDtBQUVBLFNBQUtMLE9BQUwsQ0FBYU0sSUFBYixDQUFrQkgsRUFBbEI7QUFDSDs7QUFFREksVUFBUSxDQUFDSixFQUFELEVBQUs7QUFDVEMsU0FBSyxDQUFDRCxFQUFELEVBQUtFLFFBQUwsQ0FBTDtBQUVBLFNBQUtKLE1BQUwsQ0FBWUssSUFBWixDQUFpQkgsRUFBakI7QUFDSDs7QUFFREssZ0JBQWMsQ0FBQyxHQUFHQyxJQUFKLEVBQVU7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LE9BQU8rQixDQUFQLEVBQVU7QUFDUnhCLGVBQUssR0FBR3dCLENBQVI7QUFDSDs7QUFFRFIsZUFBTyxHQUFHO0FBQ050QixpQkFBTyxFQUFFLElBREg7QUFFTkYsZ0JBRk07QUFHTkMsZ0JBSE07QUFJTk0sZ0JBSk07QUFLTkM7QUFMTSxTQUFWO0FBUUFyQyxnQkFBUSxDQUFDK0MsWUFBVCxDQUFzQjdCLGFBQXRCLENBQW9DbUMsT0FBcEM7QUFDQU0sWUFBSSxDQUFDWixZQUFMLENBQWtCN0IsYUFBbEIsQ0FBZ0NtQyxPQUFoQzs7QUFFQSxZQUFJaEIsS0FBSixFQUFXO0FBQ1AsZ0JBQU1BLEtBQU47QUFDSDs7QUFFRCxlQUFPRCxNQUFQO0FBQ0g7O0FBdENVLEtBQWY7QUF3Q0g7O0FBdEt5Qjs7QUFBVHBDLFEsQ0FDVjhDLE8sR0FBVSxJQUFJekMsR0FBSixFO0FBREFMLFEsQ0FFVitDLFksR0FBZSxJQUFJMUMsR0FBSixFOzs7Ozs7Ozs7OztBQ04xQlAsTUFBTSxDQUFDQyxNQUFQLENBQWM7QUFBQ0ksU0FBTyxFQUFDLE1BQUlGO0FBQWIsQ0FBZDtBQUFrQyxJQUFJRCxRQUFKO0FBQWFGLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLFlBQVEsR0FBQ0ksQ0FBVDtBQUFXOztBQUF2QixDQUEvQixFQUF3RCxDQUF4RDs7QUFFaEMsU0FBU0gsSUFBVCxDQUFjNEIsTUFBZCxFQUFzQjtBQUNqQyxTQUFPLElBQUk3QixRQUFKLENBQWE2QixNQUFiLENBQVA7QUFDSCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9jdWx0b2Zjb2RlcnNfbXV0YXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHdyYXAgZnJvbSAnLi9saWIvd3JhcCc7XG5pbXBvcnQgTXV0YXRpb24gZnJvbSAnLi9saWIvbXV0YXRpb24uY2xhc3MnO1xuaW1wb3J0ICcuL2xpYi9kZWJ1Zyc7XG5cbmV4cG9ydCB7IE11dGF0aW9uLCB3cmFwIH07XG4iLCJjbGFzcyBBT1Age1xuICAgIGJlZm9yZXMgPSBbXTtcbiAgICBhZnRlcnMgPSBbXTtcblxuICAgIGFkZEJlZm9yZShmbikge1xuICAgICAgICBjaGVjayhmbiwgRnVuY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuYmVmb3Jlcy5wdXNoKGZuKTtcbiAgICB9XG5cbiAgICBhZGRBZnRlcihmbikge1xuICAgICAgICBjaGVjayhmbiwgRnVuY3Rpb24pO1xuXG4gICAgICAgIHRoaXMuYWZ0ZXJzLnB1c2goZm4pO1xuICAgIH1cblxuICAgIGV4ZWN1dGVCZWZvcmVzKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy5iZWZvcmVzLmZvckVhY2goZm4gPT4gZm4uY2FsbChudWxsLCAuLi5hcmdzKSk7XG4gICAgfVxuXG4gICAgZXhlY3V0ZUFmdGVycyguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMuYWZ0ZXJzLmZvckVhY2goZm4gPT4gZm4uY2FsbChudWxsLCAuLi5hcmdzKSk7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBT1A7XG4iLCJpbXBvcnQgTXV0YXRpb24gZnJvbSAnLi9tdXRhdGlvbi5jbGFzcyc7XG5cbk9iamVjdC5hc3NpZ24oTXV0YXRpb24sIHtcbiAgICBpc0RlYnVnRW5hYmxlZDogTWV0ZW9yLmlzRGV2ZWxvcG1lbnQgfHwgcHJvY2Vzcy5lbnYuTVVUQVRJT05fREVCVUdfRU5BQkxFRCxcbn0pO1xuXG5NdXRhdGlvbi5hZGRCZWZvcmVDYWxsKCh7IGNvbmZpZywgcGFyYW1zLCBjb250ZXh0IH0pID0+IHtcbiAgICBpZiAoTXV0YXRpb24uaXNEZWJ1Z0VuYWJsZWQpIHtcbiAgICAgICAgY29uc29sZS5sb2coYFttdXRhdGlvbnNdWyR7Y29uZmlnLm5hbWV9XSBDYWxsaW5nIHdpdGggcGFyYW1zOmAsIHBhcmFtcyk7XG4gICAgfVxufSk7XG5cbk11dGF0aW9uLmFkZEFmdGVyQ2FsbCgoeyBjb25maWcsIHBhcmFtcywgY29udGV4dCwgcmVzdWx0LCBlcnJvciB9KSA9PiB7XG4gICAgaWYgKE11dGF0aW9uLmlzRGVidWdFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBbbXV0YXRpb25zXVske2NvbmZpZy5uYW1lfV0gUmVjZWl2ZWQgcmVzdWx0OmAsIHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBbbXV0YXRpb25zXVske2NvbmZpZy5uYW1lfV0gUmVjZWl2ZWQgZXJyb3I6YCwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbk11dGF0aW9uLmFkZEJlZm9yZUV4ZWN1dGlvbigoeyBjb25maWcsIHBhcmFtcywgY29udGV4dCB9KSA9PiB7XG4gICAgaWYgKE11dGF0aW9uLmlzRGVidWdFbmFibGVkKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgIGBbbXV0YXRpb25zXVske1xuICAgICAgICAgICAgICAgIGNvbmZpZy5uYW1lXG4gICAgICAgICAgICB9XSBSZWNlaXZlZCBjYWxsIHdpdGggcGFyYW1zOiAke0pTT04uc3RyaW5naWZ5KHBhcmFtcyl9YFxuICAgICAgICApO1xuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgQU9QIGZyb20gJy4vYW9wJztcbmltcG9ydCB7IGNoZWNrLCBNYXRjaCB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11dGF0aW9uIHtcbiAgICBzdGF0aWMgY2FsbEFPUCA9IG5ldyBBT1AoKTtcbiAgICBzdGF0aWMgZXhlY3V0aW9uQU9QID0gbmV3IEFPUCgpO1xuXG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIE11dGF0aW9uLmNoZWNrRGVmYXVsdENvbmZpZyhjb25maWcpO1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmNhbGxBT1AgPSBuZXcgQU9QKCk7XG4gICAgICAgIHRoaXMuZXhlY3V0aW9uQU9QID0gbmV3IEFPUCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICovXG4gICAgc3RhdGljIGFkZEJlZm9yZUNhbGwoZm4pIHtcbiAgICAgICAgdGhpcy5jYWxsQU9QLmFkZEJlZm9yZShmbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkQWZ0ZXJDYWxsKGZuKSB7XG4gICAgICAgIHRoaXMuY2FsbEFPUC5hZGRBZnRlcihmbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkQmVmb3JlRXhlY3V0aW9uKGZuKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW9uQU9QLmFkZEJlZm9yZShmbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWRkQWZ0ZXJFeGVjdXRpb24oZm4pIHtcbiAgICAgICAgdGhpcy5leGVjdXRpb25BT1AuYWRkQWZ0ZXIoZm4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAgICAgKi9cbiAgICBzdGF0aWMgY2hlY2tEZWZhdWx0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICBjaGVjayhjb25maWcsIE9iamVjdCk7XG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLm5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbmZpZycsXG4gICAgICAgICAgICAgICAgJ1lvdSBtdXN0IHByb3ZpZGUgYSBcIm5hbWVcIiBwcm9wZXJ0eSB0byB5b3VyIG11dGF0aW9uIGNvbmZpZy4nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBhZGRCZWZvcmVDYWxsKGZuKSB7XG4gICAgICAgIHRoaXMuY2FsbEFPUC5hZGRCZWZvcmUoZm4pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAgICovXG4gICAgYWRkQWZ0ZXJDYWxsKGZuKSB7XG4gICAgICAgIHRoaXMuY2FsbEFPUC5hZGRBZnRlcihmbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBhZGRCZWZvcmVFeGVjdXRpb24oZm4pIHtcbiAgICAgICAgdGhpcy5leGVjdXRpb25BT1AuYWRkQmVmb3JlKGZuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICAgICAqL1xuICAgIGFkZEFmdGVyRXhlY3V0aW9uKGZuKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0aW9uQU9QLmFkZEFmdGVyKGZuKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSdW5zIHRoZSBtdXRhdGlvbiBpbnNpZGUgYSBwcm9taXNlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNhbGxQYXJhbXNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBNZXRlb3Igb3B0aW9ucyBodHRwczovL2RvY3MubWV0ZW9yLmNvbS9hcGkvbWV0aG9kcy5odG1sI01ldGVvci1hcHBseVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqL1xuICAgIHJ1bihjYWxsUGFyYW1zLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG5cbiAgICAgICAgY29uc3QgYW9wRGF0YSA9IHsgY29uZmlnLCBwYXJhbXM6IGNhbGxQYXJhbXMgfTtcbiAgICAgICAgTXV0YXRpb24uY2FsbEFPUC5leGVjdXRlQmVmb3Jlcyhhb3BEYXRhKTtcbiAgICAgICAgdGhpcy5jYWxsQU9QLmV4ZWN1dGVCZWZvcmVzKGFvcERhdGEpO1xuXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgcGFyYW1zIH0gPSBjb25maWc7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIE1ldGVvci5hcHBseShuYW1lLCBbY2FsbFBhcmFtc10sIG9wdGlvbnMsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYW9wRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGNhbGxQYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIE11dGF0aW9uLmNhbGxBT1AuZXhlY3V0ZUFmdGVycyhhb3BEYXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxBT1AuZXhlY3V0ZUFmdGVycyhhb3BEYXRhKTtcblxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgTWV0ZW9yIE1ldGhvZCBhbmQgdGhlIGhhbmRsZXIgZm9yIGl0XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICAgKi9cbiAgICBzZXRIYW5kbGVyKGZuKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29uZmlnO1xuICAgICAgICBjb25zdCB7IG5hbWUsIHBhcmFtcyB9ID0gY29uZmlnO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbbmFtZV0ocGFyYW1zID0ge30pIHtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlnLnBhcmFtcykge1xuICAgICAgICAgICAgICAgICAgICBjaGVjayhwYXJhbXMsIGNvbmZpZy5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBhb3BEYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0OiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBjb25maWcsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgTXV0YXRpb24uZXhlY3V0aW9uQU9QLmV4ZWN1dGVCZWZvcmVzKGFvcERhdGEpO1xuICAgICAgICAgICAgICAgIHNlbGYuZXhlY3V0aW9uQU9QLmV4ZWN1dGVCZWZvcmVzKGFvcERhdGEpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yLCByZXN1bHQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZm4uY2FsbChudWxsLCB0aGlzLCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGFvcERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQ6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICByZXN1bHQsXG4gICAgICAgICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICBNdXRhdGlvbi5leGVjdXRpb25BT1AuZXhlY3V0ZUFmdGVycyhhb3BEYXRhKTtcbiAgICAgICAgICAgICAgICBzZWxmLmV4ZWN1dGlvbkFPUC5leGVjdXRlQWZ0ZXJzKGFvcERhdGEpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTXV0YXRpb24gZnJvbSAnLi9tdXRhdGlvbi5jbGFzcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHdyYXAoY29uZmlnKSB7XG4gICAgcmV0dXJuIG5ldyBNdXRhdGlvbihjb25maWcpO1xufVxuIl19
