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
var check = Package.check.check;
var Match = Package.check.Match;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:mutations":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cultofcoders_mutations/main.js                                                                       //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
module.export({
  Mutation: function () {
    return Mutation;
  },
  wrap: function () {
    return wrap;
  }
});
var wrap;
module.link("./lib/wrap", {
  "default": function (v) {
    wrap = v;
  }
}, 0);
var Mutation;
module.link("./lib/mutation.class", {
  "default": function (v) {
    Mutation = v;
  }
}, 1);
module.link("./lib/debug");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aop.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cultofcoders_mutations/lib/aop.js                                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var AOP =
/*#__PURE__*/
function () {
  function AOP() {
    this.befores = [];
    this.afters = [];
  }

  var _proto = AOP.prototype;

  _proto.addBefore = function () {
    function addBefore(fn) {
      check(fn, Function);
      this.befores.push(fn);
    }

    return addBefore;
  }();

  _proto.addAfter = function () {
    function addAfter(fn) {
      check(fn, Function);
      this.afters.push(fn);
    }

    return addAfter;
  }();

  _proto.executeBefores = function () {
    function executeBefores() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.befores.forEach(function (fn) {
        return fn.call.apply(fn, [null].concat(args));
      });
    }

    return executeBefores;
  }();

  _proto.executeAfters = function () {
    function executeAfters() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.afters.forEach(function (fn) {
        return fn.call.apply(fn, [null].concat(args));
      });
    }

    return executeAfters;
  }();

  return AOP;
}();

module.exportDefault(AOP);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cultofcoders_mutations/lib/debug.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var Mutation;
module.link("./mutation.class", {
  "default": function (v) {
    Mutation = v;
  }
}, 0);
Object.assign(Mutation, {
  isDebugEnabled: Meteor.isDevelopment || process.env.MUTATION_DEBUG_ENABLED
});
Mutation.addBeforeCall(function (_ref) {
  var config = _ref.config,
      params = _ref.params,
      context = _ref.context;

  if (Mutation.isDebugEnabled) {
    console.log("[mutations][" + config.name + "] Calling with params:", params);
  }
});
Mutation.addAfterCall(function (_ref2) {
  var config = _ref2.config,
      params = _ref2.params,
      context = _ref2.context,
      result = _ref2.result,
      error = _ref2.error;

  if (Mutation.isDebugEnabled) {
    var time = new Date();

    if (!error) {
      console.log("[mutations][" + config.name + "] Received result:", result);
    } else {
      console.error("[mutations][" + config.name + "] Received error:", error);
    }
  }
});
Mutation.addBeforeExecution(function (_ref3) {
  var config = _ref3.config,
      params = _ref3.params,
      context = _ref3.context;

  if (Mutation.isDebugEnabled) {
    var time = new Date();
    console.log("[mutations][" + config.name + "] Received call with params: " + JSON.stringify(params));
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mutation.class.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cultofcoders_mutations/lib/mutation.class.js                                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
module.export({
  "default": function () {
    return Mutation;
  }
});
var Meteor;
module.link("meteor/meteor", {
  Meteor: function (v) {
    Meteor = v;
  }
}, 0);
var AOP;
module.link("./aop", {
  "default": function (v) {
    AOP = v;
  }
}, 1);
var check, Match;
module.link("meteor/check", {
  check: function (v) {
    check = v;
  },
  Match: function (v) {
    Match = v;
  }
}, 2);

var Mutation =
/*#__PURE__*/
function () {
  function Mutation(config) {
    Mutation.checkDefaultConfig(config);
    this.config = config;
    this.callAOP = new AOP();
    this.executionAOP = new AOP();
  }
  /**
   * @param {Function} fn
   */


  Mutation.addBeforeCall = function () {
    function addBeforeCall(fn) {
      this.callAOP.addBefore(fn);
    }

    return addBeforeCall;
  }()
  /**
   * @param {Function} fn
   */
  ;

  Mutation.addAfterCall = function () {
    function addAfterCall(fn) {
      this.callAOP.addAfter(fn);
    }

    return addAfterCall;
  }()
  /**
   * @param {Function} fn
   */
  ;

  Mutation.addBeforeExecution = function () {
    function addBeforeExecution(fn) {
      this.executionAOP.addBefore(fn);
    }

    return addBeforeExecution;
  }()
  /**
   * @param {Function} fn
   */
  ;

  Mutation.addAfterExecution = function () {
    function addAfterExecution(fn) {
      this.executionAOP.addAfter(fn);
    }

    return addAfterExecution;
  }()
  /**
   * @param {Object} config
   */
  ;

  Mutation.checkDefaultConfig = function () {
    function checkDefaultConfig(config) {
      check(config, Object);

      if (typeof config.name !== 'string') {
        throw new Meteor.Error('invalid-config', 'You must provide a "name" property to your mutation config.');
      }
    }

    return checkDefaultConfig;
  }()
  /**
   * @param {Function} fn
   */
  ;

  var _proto = Mutation.prototype;

  _proto.addBeforeCall = function () {
    function addBeforeCall(fn) {
      this.callAOP.addBefore(fn);
    }

    return addBeforeCall;
  }()
  /**
   * @param {Function} fn
   */
  ;

  _proto.addAfterCall = function () {
    function addAfterCall(fn) {
      this.callAOP.addAfter(fn);
    }

    return addAfterCall;
  }()
  /**
   * @param {Function} fn
   */
  ;

  _proto.addBeforeExecution = function () {
    function addBeforeExecution(fn) {
      this.executionAOP.addBefore(fn);
    }

    return addBeforeExecution;
  }()
  /**
   * @param {Function} fn
   */
  ;

  _proto.addAfterExecution = function () {
    function addAfterExecution(fn) {
      this.executionAOP.addAfter(fn);
    }

    return addAfterExecution;
  }()
  /**
   * Runs the mutation inside a promise
   * @param {Object} callParams
   * @param {Object} options Meteor options https://docs.meteor.com/api/methods.html#Meteor-apply
   * @returns {Promise}
   */
  ;

  _proto.run = function () {
    function run(callParams) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var config = this.config;
      var aopData = {
        config: config,
        params: callParams
      };
      Mutation.callAOP.executeBefores(aopData);
      this.callAOP.executeBefores(aopData);
      var name = config.name,
          params = config.params;
      return new Promise(function (resolve, reject) {
        Meteor.apply(name, [callParams], options, function (error, result) {
          var aopData = {
            config: config,
            params: callParams,
            result: result,
            error: error
          };
          Mutation.callAOP.executeAfters(aopData);

          _this.callAOP.executeAfters(aopData);

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    }

    return run;
  }()
  /**
   * Creates the Meteor Method and the handler for it
   * @param {Function} fn
   */
  ;

  _proto.setHandler = function () {
    function setHandler(fn) {
      var _Meteor$methods;

      var config = this.config;
      var name = config.name,
          params = config.params;
      var self = this;
      Meteor.methods((_Meteor$methods = {}, _Meteor$methods[name] = function () {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (config.params) {
          check(params, config.params);
        }

        var aopData = {
          context: this,
          config: config,
          params: params
        };
        Mutation.executionAOP.executeBefores(aopData);
        self.executionAOP.executeBefores(aopData);
        var error, result;

        try {
          result = fn.call(null, this, params);
        } catch (e) {
          error = e;
        }

        aopData = {
          context: this,
          config: config,
          params: params,
          result: result,
          error: error
        };
        Mutation.executionAOP.executeAfters(aopData);
        self.executionAOP.executeAfters(aopData);

        if (error) {
          throw error;
        }

        return result;
      }, _Meteor$methods));
    }

    return setHandler;
  }();

  return Mutation;
}();

Mutation.callAOP = new AOP();
Mutation.executionAOP = new AOP();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"wrap.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/cultofcoders_mutations/lib/wrap.js                                                                   //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
module.export({
  "default": function () {
    return wrap;
  }
});
var Mutation;
module.link("./mutation.class", {
  "default": function (v) {
    Mutation = v;
  }
}, 0);

function wrap(config) {
  return new Mutation(config);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
