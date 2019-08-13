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
const factories = {};
Factory = class Factory {
  constructor(name, collection, attributes) {
    this.name = name;
    this.collection = collection;
    this.attributes = attributes;
    this.afterHooks = [];
    this.sequence = 0;
  }

  after(fn) {
    this.afterHooks.push(fn);
    return this;
  }

};

Factory.define = (name, collection, attributes) => {
  factories[name] = new Factory(name, collection, attributes);
  return factories[name];
};

Factory.get = name => {
  const factory = factories[name];

  if (!factory) {
    throw new Error("Factory: There is no factory named " + name);
  }

  return factory;
};

Factory._build = function (name) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const factory = Factory.get(name);
  const result = {}; // "raw" attributes without functions evaluated, or dotted properties resolved

  const extendedAttributes = _.extend({}, factory.attributes, attributes); // either create a new factory and return its _id
  // or return a 'fake' _id (since we're not inserting anything)


  const makeRelation = relName => {
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

  const getValue = value => {
    return value instanceof Factory ? makeRelation(value.name) : value;
  };

  const getValueFromFunction = func => {
    const api = {
      sequence: fn => fn(factory.sequence)
    };
    const fnRes = func.call(result, api, userOptions);
    return getValue(fnRes);
  };

  factory.sequence += 1;

  const walk = (record, object) => {
    _.each(object, (value, key) => {
      let newValue = value; // is this a Factory instance?

      if (value instanceof Factory) {
        newValue = makeRelation(value.name);
      } else if (_.isArray(value)) {
        newValue = value.map(element => {
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

      const modifier = {
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
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Factory._build(name, attributes, userOptions);
};

Factory.tree = function (name, attributes) {
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return Factory._build(name, attributes, userOptions, {
    tree: true
  });
};

Factory._create = (name, doc) => {
  const collection = Factory.get(name).collection;
  const insertId = collection.insert(doc);
  const record = collection.findOne(insertId);
  return record;
};

Factory.create = function (name) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let userOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  const doc = Factory._build(name, attributes, userOptions, {
    insert: true
  });

  const record = Factory._create(name, doc);

  Factory.get(name).afterHooks.forEach(cb => cb(record));
  return record;
};

Factory.extend = function (name) {
  let attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
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
