(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
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
/* global LocalCollection */ /* global Factory:true */const factories = {};
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

Factory._build = (name, attributes = {}, userOptions = {}, options = {}) => {
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

Factory.build = (name, attributes = {}, userOptions = {}) => {
  return Factory._build(name, attributes, userOptions);
};

Factory.tree = (name, attributes, userOptions = {}) => {
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

Factory.create = (name, attributes = {}, userOptions = {}) => {
  const doc = Factory._build(name, attributes, userOptions, {
    insert: true
  });

  const record = Factory._create(name, doc);

  Factory.get(name).afterHooks.forEach(cb => cb(record));
  return record;
};

Factory.extend = (name, attributes = {}) => {
  return _.extend(_.clone(Factory.get(name).attributes), attributes);
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/dburles:factory/factory.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['dburles:factory'] = {}, {
  Factory: Factory
});

})();

//# sourceURL=meteor://💻app/packages/dburles_factory.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGJ1cmxlczpmYWN0b3J5L2ZhY3RvcnkuanMiXSwibmFtZXMiOlsiZmFjdG9yaWVzIiwiRmFjdG9yeSIsImNvbnN0cnVjdG9yIiwibmFtZSIsImNvbGxlY3Rpb24iLCJhdHRyaWJ1dGVzIiwiYWZ0ZXJIb29rcyIsInNlcXVlbmNlIiwiYWZ0ZXIiLCJmbiIsInB1c2giLCJkZWZpbmUiLCJnZXQiLCJmYWN0b3J5IiwiRXJyb3IiLCJfYnVpbGQiLCJ1c2VyT3B0aW9ucyIsIm9wdGlvbnMiLCJyZXN1bHQiLCJleHRlbmRlZEF0dHJpYnV0ZXMiLCJfIiwiZXh0ZW5kIiwibWFrZVJlbGF0aW9uIiwicmVsTmFtZSIsImluc2VydCIsImNyZWF0ZSIsIl9pZCIsInRyZWUiLCJSYW5kb20iLCJpZCIsImdldFZhbHVlIiwidmFsdWUiLCJnZXRWYWx1ZUZyb21GdW5jdGlvbiIsImZ1bmMiLCJhcGkiLCJmblJlcyIsImNhbGwiLCJ3YWxrIiwicmVjb3JkIiwib2JqZWN0IiwiZWFjaCIsImtleSIsIm5ld1ZhbHVlIiwiaXNBcnJheSIsIm1hcCIsImVsZW1lbnQiLCJpc0Z1bmN0aW9uIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJtb2RpZmllciIsIiRzZXQiLCJMb2NhbENvbGxlY3Rpb24iLCJfbW9kaWZ5IiwiYnVpbGQiLCJfY3JlYXRlIiwiZG9jIiwiaW5zZXJ0SWQiLCJmaW5kT25lIiwiZm9yRWFjaCIsImNiIiwiY2xvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRCLENBQ0EseUJBRUEsTUFBTUEsWUFBWSxFQUFsQjtBQUVBQyxVQUFVLE1BQU1BLE9BQU4sQ0FBYztBQUN0QkMsY0FBWUMsSUFBWixFQUFrQkMsVUFBbEIsRUFBOEJDLFVBQTlCLEVBQTBDO0FBQ3hDLFNBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0Es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RUFBZ0RBLFVBQWhELENBQVA7QUFDRCxDQUZELEMiLCJmaWxlIjoiL3BhY2thZ2VzL2RidXJsZXNfZmFjdG9yeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCBMb2NhbENvbGxlY3Rpb24gKi9cbi8qIGdsb2JhbCBGYWN0b3J5OnRydWUgKi9cblxuY29uc3QgZmFjdG9yaWVzID0ge307XG5cbkZhY3RvcnkgPSBjbGFzcyBGYWN0b3J5IHtcbiAgY29uc3RydWN0b3IobmFtZSwgY29sbGVjdGlvbiwgYXR0cmlidXRlcykge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xuICAgIHRoaXMuYWZ0ZXJIb29rcyA9IFtdO1xuICAgIHRoaXMuc2VxdWVuY2UgPSAwO1xuICB9XG5cbiAgYWZ0ZXIoZm4pIHtcbiAgICB0aGlzLmFmdGVySG9va3MucHVzaChmbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbkZhY3RvcnkuZGVmaW5lID0gKG5hbWUsIGNvbGxlY3Rpb24sIGF0dHJpYnV0ZXMpID0+IHtcbiAgZmFjdG9yaWVzW25hbWVdID0gbmV3IEZhY3RvcnkobmFtZSwgY29sbGVjdGlvbiwgYXR0cmlidXRlcyk7XG4gIHJldHVybiBmYWN0b3JpZXNbbmFtZV07XG59O1xuXG5GYWN0b3J5LmdldCA9IG5hbWUgPT4ge1xuICBjb25zdCBmYWN0b3J5ID0gZmFjdG9yaWVzW25hbWVdO1xuICBpZiAoISBmYWN0b3J5KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiRmFjdG9yeTogVGhlcmUgaXMgbm8gZmFjdG9yeSBuYW1lZCBcIiArIG5hbWUpO1xuICB9XG4gIHJldHVybiBmYWN0b3J5O1xufTtcblxuRmFjdG9yeS5fYnVpbGQgPSAobmFtZSwgYXR0cmlidXRlcyA9IHt9LCB1c2VyT3B0aW9ucyA9IHt9LCBvcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZmFjdG9yeSA9IEZhY3RvcnkuZ2V0KG5hbWUpO1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAvLyBcInJhd1wiIGF0dHJpYnV0ZXMgd2l0aG91dCBmdW5jdGlvbnMgZXZhbHVhdGVkLCBvciBkb3R0ZWQgcHJvcGVydGllcyByZXNvbHZlZFxuICBjb25zdCBleHRlbmRlZEF0dHJpYnV0ZXMgPSBfLmV4dGVuZCh7fSwgZmFjdG9yeS5hdHRyaWJ1dGVzLCBhdHRyaWJ1dGVzKTtcblxuICAvLyBlaXRoZXIgY3JlYXRlIGEgbmV3IGZhY3RvcnkgYW5kIHJldHVybiBpdHMgX2lkXG4gIC8vIG9yIHJldHVybiBhICdmYWtlJyBfaWQgKHNpbmNlIHdlJ3JlIG5vdCBpbnNlcnRpbmcgYW55dGhpbmcpXG4gIGNvbnN0IG1ha2VSZWxhdGlvbiA9IHJlbE5hbWUgPT4ge1xuICAgIGlmIChvcHRpb25zLmluc2VydCkge1xuICAgICAgcmV0dXJuIEZhY3RvcnkuY3JlYXRlKHJlbE5hbWUsIHt9LCB1c2VyT3B0aW9ucykuX2lkO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy50cmVlKSB7XG4gICAgICByZXR1cm4gRmFjdG9yeS5fYnVpbGQocmVsTmFtZSwge30sIHVzZXJPcHRpb25zLCB7dHJlZTogdHJ1ZX0pO1xuICAgIH1cbiAgICAvLyBmYWtlIGFuIGlkIG9uIGJ1aWxkXG4gICAgcmV0dXJuIFJhbmRvbS5pZCgpO1xuICB9O1xuXG4gIGNvbnN0IGdldFZhbHVlID0gdmFsdWUgPT4ge1xuICAgIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBGYWN0b3J5KSA/IG1ha2VSZWxhdGlvbih2YWx1ZS5uYW1lKSA6IHZhbHVlO1xuICB9O1xuXG4gIGNvbnN0IGdldFZhbHVlRnJvbUZ1bmN0aW9uID0gZnVuYyA9PiB7XG4gICAgY29uc3QgYXBpID0geyBzZXF1ZW5jZTogZm4gPT4gZm4oZmFjdG9yeS5zZXF1ZW5jZSkgfTtcbiAgICBjb25zdCBmblJlcyA9IGZ1bmMuY2FsbChyZXN1bHQsIGFwaSwgdXNlck9wdGlvbnMpO1xuICAgIHJldHVybiBnZXRWYWx1ZShmblJlcyk7XG4gIH07XG5cbiAgZmFjdG9yeS5zZXF1ZW5jZSArPSAxO1xuXG4gIGNvbnN0IHdhbGsgPSAocmVjb3JkLCBvYmplY3QpID0+IHtcbiAgICBfLmVhY2gob2JqZWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgbGV0IG5ld1ZhbHVlID0gdmFsdWU7XG4gICAgICAvLyBpcyB0aGlzIGEgRmFjdG9yeSBpbnN0YW5jZT9cbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZhY3RvcnkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBtYWtlUmVsYXRpb24odmFsdWUubmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKF8uaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgbmV3VmFsdWUgPSB2YWx1ZS5tYXAoZWxlbWVudCA9PiB7XG4gICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbGVtZW50KSkge1xuICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlRnJvbUZ1bmN0aW9uKGVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZ2V0VmFsdWUoZWxlbWVudCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gZ2V0VmFsdWVGcm9tRnVuY3Rpb24odmFsdWUpO1xuICAgICAgLy8gaWYgYW4gb2JqZWN0IGxpdGVyYWwgaXMgcGFzc2VkIGluLCB0cmF2ZXJzZSBkZWVwZXIgaW50byBpdFxuICAgICAgfSBlbHNlIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgICByZWNvcmRba2V5XSA9IHJlY29yZFtrZXldIHx8IHt9O1xuICAgICAgICByZXR1cm4gd2FsayhyZWNvcmRba2V5XSwgdmFsdWUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2RpZmllciA9IHskc2V0OiB7fX07XG5cbiAgICAgIGlmIChrZXkgIT09ICdfaWQnKSB7XG4gICAgICAgIG1vZGlmaWVyLiRzZXRba2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgfVxuXG4gICAgICBMb2NhbENvbGxlY3Rpb24uX21vZGlmeShyZWNvcmQsIG1vZGlmaWVyKTtcbiAgICB9KTtcbiAgfTtcblxuICB3YWxrKHJlc3VsdCwgZXh0ZW5kZWRBdHRyaWJ1dGVzKTtcblxuICBpZiAoISBvcHRpb25zLnRyZWUpIHtcbiAgICByZXN1bHQuX2lkID0gZXh0ZW5kZWRBdHRyaWJ1dGVzLl9pZCB8fCBSYW5kb20uaWQoKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuRmFjdG9yeS5idWlsZCA9IChuYW1lLCBhdHRyaWJ1dGVzID0ge30sIHVzZXJPcHRpb25zID0ge30pID0+IHtcbiAgcmV0dXJuIEZhY3RvcnkuX2J1aWxkKG5hbWUsIGF0dHJpYnV0ZXMsIHVzZXJPcHRpb25zKTtcbn07XG5cbkZhY3RvcnkudHJlZSA9IChuYW1lLCBhdHRyaWJ1dGVzLCB1c2VyT3B0aW9ucyA9IHt9KSA9PiB7XG4gIHJldHVybiBGYWN0b3J5Ll9idWlsZChuYW1lLCBhdHRyaWJ1dGVzLCB1c2VyT3B0aW9ucywge3RyZWU6IHRydWV9KTtcbn07XG5cbkZhY3RvcnkuX2NyZWF0ZSA9IChuYW1lLCBkb2MpID0+IHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IEZhY3RvcnkuZ2V0KG5hbWUpLmNvbGxlY3Rpb247XG4gIGNvbnN0IGluc2VydElkID0gY29sbGVjdGlvbi5pbnNlcnQoZG9jKTtcbiAgY29uc3QgcmVjb3JkID0gY29sbGVjdGlvbi5maW5kT25lKGluc2VydElkKTtcbiAgcmV0dXJuIHJlY29yZDtcbn07XG5cbkZhY3RvcnkuY3JlYXRlID0gKG5hbWUsIGF0dHJpYnV0ZXMgPSB7fSwgdXNlck9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCBkb2MgPSBGYWN0b3J5Ll9idWlsZChuYW1lLCBhdHRyaWJ1dGVzLCB1c2VyT3B0aW9ucywge2luc2VydDogdHJ1ZX0pO1xuICBjb25zdCByZWNvcmQgPSBGYWN0b3J5Ll9jcmVhdGUobmFtZSwgZG9jKTtcblxuICBGYWN0b3J5LmdldChuYW1lKS5hZnRlckhvb2tzLmZvckVhY2goY2IgPT4gY2IocmVjb3JkKSk7XG5cbiAgcmV0dXJuIHJlY29yZDtcbn07XG5cbkZhY3RvcnkuZXh0ZW5kID0gKG5hbWUsIGF0dHJpYnV0ZXMgPSB7fSkgPT4ge1xuICByZXR1cm4gXy5leHRlbmQoXy5jbG9uZShGYWN0b3J5LmdldChuYW1lKS5hdHRyaWJ1dGVzKSwgYXR0cmlidXRlcyk7XG59O1xuIl19
