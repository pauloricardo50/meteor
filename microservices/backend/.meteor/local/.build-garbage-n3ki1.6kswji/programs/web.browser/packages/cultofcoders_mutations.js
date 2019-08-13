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

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:mutations":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cultofcoders_mutations/main.js                                                                           //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aop.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cultofcoders_mutations/lib/aop.js                                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

  executeBefores() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    this.befores.forEach(fn => fn.call(null, ...args));
  }

  executeAfters() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    this.afters.forEach(fn => fn.call(null, ...args));
  }

}

module.exportDefault(AOP);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cultofcoders_mutations/lib/debug.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
Mutation.addBeforeCall((_ref) => {
  let {
    config,
    params,
    context
  } = _ref;

  if (Mutation.isDebugEnabled) {
    console.log("[mutations][".concat(config.name, "] Calling with params:"), params);
  }
});
Mutation.addAfterCall((_ref2) => {
  let {
    config,
    params,
    context,
    result,
    error
  } = _ref2;

  if (Mutation.isDebugEnabled) {
    const time = new Date();

    if (!error) {
      console.log("[mutations][".concat(config.name, "] Received result:"), result);
    } else {
      console.error("[mutations][".concat(config.name, "] Received error:"), error);
    }
  }
});
Mutation.addBeforeExecution((_ref3) => {
  let {
    config,
    params,
    context
  } = _ref3;

  if (Mutation.isDebugEnabled) {
    const time = new Date();
    console.log("[mutations][".concat(config.name, "] Received call with params: ").concat(JSON.stringify(params)));
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mutation.class.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cultofcoders_mutations/lib/mutation.class.js                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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


  run(callParams) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
      [name]() {
        let params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"wrap.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/cultofcoders_mutations/lib/wrap.js                                                                       //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
