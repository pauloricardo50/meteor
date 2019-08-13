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
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var Random = Package.random.Random;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var Factory;

var require = meteorInstall({"node_modules":{"meteor":{"dburles:factory":{"factory.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/dburles_factory/factory.js                                                                        //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/* global LocalCollection */

/* global Factory:true */
var factories = {};

Factory =
/*#__PURE__*/
function () {
  function Factory(name, collection, attributes) {
    this.name = name;
    this.collection = collection;
    this.attributes = attributes;
    this.afterHooks = [];
    this.sequence = 0;
  }

  var _proto = Factory.prototype;

  _proto.after = function () {
    function after(fn) {
      this.afterHooks.push(fn);
      return this;
    }

    return after;
  }();

  return Factory;
}();

Factory.define = function (name, collection, attributes) {
  factories[name] = new Factory(name, collection, attributes);
  return factories[name];
};

Factory.get = function (name) {
  var factory = factories[name];

  if (!factory) {
    throw new Error("Factory: There is no factory named " + name);
  }

  return factory;
};

Factory._build = function (name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var factory = Factory.get(name);
  var result = {}; // "raw" attributes without functions evaluated, or dotted properties resolved

  var extendedAttributes = _.extend({}, factory.attributes, attributes); // either create a new factory and return its _id
  // or return a 'fake' _id (since we're not inserting anything)


  var makeRelation = function (relName) {
    if (options.insert) {
      return Factory.create(relName, {}, userOptions)._id;
    }

    if (options.tree) {
      return Factory._build(relName, {}, userOptions, {
        tree: true
      });
    } // fake an id on build


    return Random.id();
  };

  var getValue = function (value) {
    return value instanceof Factory ? makeRelation(value.name) : value;
  };

  var getValueFromFunction = function (func) {
    var api = {
      sequence: function (fn) {
        return fn(factory.sequence);
      }
    };
    var fnRes = func.call(result, api, userOptions);
    return getValue(fnRes);
  };

  factory.sequence += 1;

  var walk = function (record, object) {
    _.each(object, function (value, key) {
      var newValue = value; // is this a Factory instance?

      if (value instanceof Factory) {
        newValue = makeRelation(value.name);
      } else if (_.isArray(value)) {
        newValue = value.map(function (element) {
          if (_.isFunction(element)) {
            return getValueFromFunction(element);
          }

          return getValue(element);
        });
      } else if (_.isFunction(value)) {
        newValue = getValueFromFunction(value); // if an object literal is passed in, traverse deeper into it
      } else if (Object.prototype.toString.call(value) === '[object Object]') {
        record[key] = record[key] || {};
        return walk(record[key], value);
      }

      var modifier = {
        $set: {}
      };

      if (key !== '_id') {
        modifier.$set[key] = newValue;
      }

      LocalCollection._modify(record, modifier);
    });
  };

  walk(result, extendedAttributes);

  if (!options.tree) {
    result._id = extendedAttributes._id || Random.id();
  }

  return result;
};

Factory.build = function (name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Factory._build(name, attributes, userOptions);
};

Factory.tree = function (name, attributes) {
  var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Factory._build(name, attributes, userOptions, {
    tree: true
  });
};

Factory._create = function (name, doc) {
  var collection = Factory.get(name).collection;
  var insertId = collection.insert(doc);
  var record = collection.findOne(insertId);
  return record;
};

Factory.create = function (name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var doc = Factory._build(name, attributes, userOptions, {
    insert: true
  });

  var record = Factory._create(name, doc);

  Factory.get(name).afterHooks.forEach(function (cb) {
    return cb(record);
  });
  return record;
};

Factory.extend = function (name) {
  var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _.extend(_.clone(Factory.get(name).attributes), attributes);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/dburles:factory/factory.js");

/* Exports */
Package._define("dburles:factory", {
  Factory: Factory
});

})();
