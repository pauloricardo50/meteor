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

require("/node_modules/meteor/dburles:factory/factory.js");

/* Exports */
Package._define("dburles:factory", {
  Factory: Factory
});

})();

//# sourceURL=meteor://💻app/packages/dburles_factory.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZGJ1cmxlczpmYWN0b3J5L2ZhY3RvcnkuanMiXSwibmFtZXMiOlsiZmFjdG9yaWVzIiwiRmFjdG9yeSIsImNvbnN0cnVjdG9yIiwibmFtZSIsImNvbGxlY3Rpb24iLCJhdHRyaWJ1dGVzIiwiYWZ0ZXJIb29rcyIsInNlcXVlbmNlIiwiYWZ0ZXIiLCJmbiIsInB1c2giLCJkZWZpbmUiLCJnZXQiLCJmYWN0b3J5IiwiRXJyb3IiLCJfYnVpbGQiLCJ1c2VyT3B0aW9ucyIsIm9wdGlvbnMiLCJyZXN1bHQiLCJleHRlbmRlZEF0dHJpYnV0ZXMiLCJfIiwiZXh0ZW5kIiwibWFrZVJlbGF0aW9uIiwicmVsTmFtZSIsImluc2VydCIsImNyZWF0ZSIsIl9pZCIsInRyZWUiLCJSYW5kb20iLCJpZCIsImdldFZhbHVlIiwidmFsdWUiLCJnZXRWYWx1ZUZyb21GdW5jdGlvbiIsImZ1bmMiLCJhcGkiLCJmblJlcyIsImNhbGwiLCJ3YWxrIiwicmVjb3JkIiwib2JqZWN0IiwiZWFjaCIsImtleSIsIm5ld1ZhbHVlIiwiaXNBcnJheSIsIm1hcCIsImVsZW1lbnQiLCJpc0Z1bmN0aW9uIiwiT2JqZWN0IiwicHJvdG90eXBlIiwidG9TdHJpbmciLCJtb2RpZmllciIsIiRzZXQiLCJMb2NhbENvbGxlY3Rpb24iLCJfbW9kaWZ5IiwiYnVpbGQiLCJfY3JlYXRlIiwiZG9jIiwiaW5zZXJ0SWQiLCJmaW5kT25lIiwiZm9yRWFjaCIsImNiIiwiY2xvbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBO0FBRUEsTUFBTUEsU0FBUyxHQUFHLEVBQWxCO0FBRUFDLE9BQU8sR0FBRyxNQUFNQSxPQUFOLENBQWM7QUFDdEJDLGFBQVcsQ0FBQ0MsSUFBRCxFQUFPQyxVQUFQLEVBQW1CQyxVQUFuQixFQUErQjtBQUN4QyxTQUFLRixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLFNBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBLFNBQUtDLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFREMsT0FBSyxDQUFDQyxFQUFELEVBQUs7QUFDUixTQUFLSCxVQUFMLENBQWdCSSxJQUFoQixDQUFxQkQsRUFBckI7QUFDQSxXQUFPLElBQVA7QUFDRDs7QUFacUIsQ0FBeEI7O0FBZUFSLE9BQU8sQ0FBQ1UsTUFBUixHQUFpQixDQUFDUixJQUFELEVBQU9DLFVBQVAsRUFBbUJDLFVBQW5CLEtBQWtDO0FBQ2pETCxXQUFTLENBQUNHLElBQUQsQ0FBVCxHQUFrQixJQUFJRixPQUFKLENBQVlFLElBQVosRUFBa0JDLFVBQWxCLEVBQThCQyxVQUE5QixDQUFsQjtBQUNBLFNBQU9MLFNBQVMsQ0FBQ0csSUFBRCxDQUFoQjtBQUNELENBSEQ7O0FBS0FGLE9BQU8sQ0FBQ1csR0FBUixHQUFjVCxJQUFJLElBQUk7QUFDcEIsUUFBTVUsT0FBTyxHQUFHYixTQUFTLENBQUNHLElBQUQsQ0FBekI7O0FBQ0EsTUFBSSxDQUFFVSxPQUFOLEVBQWU7QUFDYixVQUFNLElBQUlDLEtBQUosQ0FBVSx3Q0FBd0NYLElBQWxELENBQU47QUFDRDs7QUFDRCxTQUFPVSxPQUFQO0FBQ0QsQ0FORDs7QUFRQVosT0FBTyxDQUFDYyxNQUFSLEdBQWlCLENBQUNaLElBQUQsRUFBT0UsVUFBVSxHQUFHLEVBQXBCLEVBQXdCVyxXQUFXLEdBQUcsRUFBdEMsRUFBMENDLE9BQU8sR0FBRyxFQUFwRCxLQUEyRDtBQUMxRSxRQUFNSixPQUFPLEdBQUdaLE9BQU8sQ0FBQ1csR0FBUixDQUFZVCxJQUFaLENBQWhCO0FBQ0EsUUFBTWUsTUFBTSxHQUFHLEVBQWYsQ0FGMEUsQ0FJMUU7O0FBQ0EsUUFBTUMsa0JBQWtCLEdBQUdDLENBQUMsQ0FBQ0MsTUFBRixDQUFTLEVBQVQsRUFBYVIsT0FBTyxDQUFDUixVQUFyQixFQUFpQ0EsVUFBakMsQ0FBM0IsQ0FMMEUsQ0FPMUU7QUFDQTs7O0FBQ0EsUUFBTWlCLFlBQVksR0FBR0MsT0FBTyxJQUFJO0FBQzlCLFFBQUlOLE9BQU8sQ0FBQ08sTUFBWixFQUFvQjtBQUNsQixhQUFPdkIsT0FBTyxDQUFDd0IsTUFBUixDQUFlRixPQUFmLEVBQXdCLEVBQXhCLEVBQTRCUCxXQUE1QixFQUF5Q1UsR0FBaEQ7QUFDRDs7QUFDRCxRQUFJVCxPQUFPLENBQUNVLElBQVosRUFBa0I7QUFDaEIsYUFBTzFCLE9BQU8sQ0FBQ2MsTUFBUixDQUFlUSxPQUFmLEVBQXdCLEVBQXhCLEVBQTRCUCxXQUE1QixFQUF5QztBQUFDVyxZQUFJLEVBQUU7QUFBUCxPQUF6QyxDQUFQO0FBQ0QsS0FONkIsQ0FPOUI7OztBQUNBLFdBQU9DLE1BQU0sQ0FBQ0MsRUFBUCxFQUFQO0FBQ0QsR0FURDs7QUFXQSxRQUFNQyxRQUFRLEdBQUdDLEtBQUssSUFBSTtBQUN4QixXQUFRQSxLQUFLLFlBQVk5QixPQUFsQixHQUE2QnFCLFlBQVksQ0FBQ1MsS0FBSyxDQUFDNUIsSUFBUCxDQUF6QyxHQUF3RDRCLEtBQS9EO0FBQ0QsR0FGRDs7QUFJQSxRQUFNQyxvQkFBb0IsR0FBR0MsSUFBSSxJQUFJO0FBQ25DLFVBQU1DLEdBQUcsR0FBRztBQUFFM0IsY0FBUSxFQUFFRSxFQUFFLElBQUlBLEVBQUUsQ0FBQ0ksT0FBTyxDQUFDTixRQUFUO0FBQXBCLEtBQVo7QUFDQSxVQUFNNEIsS0FBSyxHQUFHRixJQUFJLENBQUNHLElBQUwsQ0FBVWxCLE1BQVYsRUFBa0JnQixHQUFsQixFQUF1QmxCLFdBQXZCLENBQWQ7QUFDQSxXQUFPYyxRQUFRLENBQUNLLEtBQUQsQ0FBZjtBQUNELEdBSkQ7O0FBTUF0QixTQUFPLENBQUNOLFFBQVIsSUFBb0IsQ0FBcEI7O0FBRUEsUUFBTThCLElBQUksR0FBRyxDQUFDQyxNQUFELEVBQVNDLE1BQVQsS0FBb0I7QUFDL0JuQixLQUFDLENBQUNvQixJQUFGLENBQU9ELE1BQVAsRUFBZSxDQUFDUixLQUFELEVBQVFVLEdBQVIsS0FBZ0I7QUFDN0IsVUFBSUMsUUFBUSxHQUFHWCxLQUFmLENBRDZCLENBRTdCOztBQUNBLFVBQUlBLEtBQUssWUFBWTlCLE9BQXJCLEVBQThCO0FBQzVCeUMsZ0JBQVEsR0FBR3BCLFlBQVksQ0FBQ1MsS0FBSyxDQUFDNUIsSUFBUCxDQUF2QjtBQUNELE9BRkQsTUFFTyxJQUFJaUIsQ0FBQyxDQUFDdUIsT0FBRixDQUFVWixLQUFWLENBQUosRUFBc0I7QUFDM0JXLGdCQUFRLEdBQUdYLEtBQUssQ0FBQ2EsR0FBTixDQUFVQyxPQUFPLElBQUk7QUFDOUIsY0FBSXpCLENBQUMsQ0FBQzBCLFVBQUYsQ0FBYUQsT0FBYixDQUFKLEVBQTJCO0FBQ3pCLG1CQUFPYixvQkFBb0IsQ0FBQ2EsT0FBRCxDQUEzQjtBQUNEOztBQUNELGlCQUFPZixRQUFRLENBQUNlLE9BQUQsQ0FBZjtBQUNELFNBTFUsQ0FBWDtBQU1ELE9BUE0sTUFPQSxJQUFJekIsQ0FBQyxDQUFDMEIsVUFBRixDQUFhZixLQUFiLENBQUosRUFBeUI7QUFDOUJXLGdCQUFRLEdBQUdWLG9CQUFvQixDQUFDRCxLQUFELENBQS9CLENBRDhCLENBRWhDO0FBQ0MsT0FITSxNQUdBLElBQUlnQixNQUFNLENBQUNDLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCYixJQUExQixDQUErQkwsS0FBL0IsTUFBMEMsaUJBQTlDLEVBQWlFO0FBQ3RFTyxjQUFNLENBQUNHLEdBQUQsQ0FBTixHQUFjSCxNQUFNLENBQUNHLEdBQUQsQ0FBTixJQUFlLEVBQTdCO0FBQ0EsZUFBT0osSUFBSSxDQUFDQyxNQUFNLENBQUNHLEdBQUQsQ0FBUCxFQUFjVixLQUFkLENBQVg7QUFDRDs7QUFFRCxZQUFNbUIsUUFBUSxHQUFHO0FBQUNDLFlBQUksRUFBRTtBQUFQLE9BQWpCOztBQUVBLFVBQUlWLEdBQUcsS0FBSyxLQUFaLEVBQW1CO0FBQ2pCUyxnQkFBUSxDQUFDQyxJQUFULENBQWNWLEdBQWQsSUFBcUJDLFFBQXJCO0FBQ0Q7O0FBRURVLHFCQUFlLENBQUNDLE9BQWhCLENBQXdCZixNQUF4QixFQUFnQ1ksUUFBaEM7QUFDRCxLQTNCRDtBQTRCRCxHQTdCRDs7QUErQkFiLE1BQUksQ0FBQ25CLE1BQUQsRUFBU0Msa0JBQVQsQ0FBSjs7QUFFQSxNQUFJLENBQUVGLE9BQU8sQ0FBQ1UsSUFBZCxFQUFvQjtBQUNsQlQsVUFBTSxDQUFDUSxHQUFQLEdBQWFQLGtCQUFrQixDQUFDTyxHQUFuQixJQUEwQkUsTUFBTSxDQUFDQyxFQUFQLEVBQXZDO0FBQ0Q7O0FBQ0QsU0FBT1gsTUFBUDtBQUNELENBckVEOztBQXVFQWpCLE9BQU8sQ0FBQ3FELEtBQVIsR0FBZ0IsQ0FBQ25ELElBQUQsRUFBT0UsVUFBVSxHQUFHLEVBQXBCLEVBQXdCVyxXQUFXLEdBQUcsRUFBdEMsS0FBNkM7QUFDM0QsU0FBT2YsT0FBTyxDQUFDYyxNQUFSLENBQWVaLElBQWYsRUFBcUJFLFVBQXJCLEVBQWlDVyxXQUFqQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQWYsT0FBTyxDQUFDMEIsSUFBUixHQUFlLENBQUN4QixJQUFELEVBQU9FLFVBQVAsRUFBbUJXLFdBQVcsR0FBRyxFQUFqQyxLQUF3QztBQUNyRCxTQUFPZixPQUFPLENBQUNjLE1BQVIsQ0FBZVosSUFBZixFQUFxQkUsVUFBckIsRUFBaUNXLFdBQWpDLEVBQThDO0FBQUNXLFFBQUksRUFBRTtBQUFQLEdBQTlDLENBQVA7QUFDRCxDQUZEOztBQUlBMUIsT0FBTyxDQUFDc0QsT0FBUixHQUFrQixDQUFDcEQsSUFBRCxFQUFPcUQsR0FBUCxLQUFlO0FBQy9CLFFBQU1wRCxVQUFVLEdBQUdILE9BQU8sQ0FBQ1csR0FBUixDQUFZVCxJQUFaLEVBQWtCQyxVQUFyQztBQUNBLFFBQU1xRCxRQUFRLEdBQUdyRCxVQUFVLENBQUNvQixNQUFYLENBQWtCZ0MsR0FBbEIsQ0FBakI7QUFDQSxRQUFNbEIsTUFBTSxHQUFHbEMsVUFBVSxDQUFDc0QsT0FBWCxDQUFtQkQsUUFBbkIsQ0FBZjtBQUNBLFNBQU9uQixNQUFQO0FBQ0QsQ0FMRDs7QUFPQXJDLE9BQU8sQ0FBQ3dCLE1BQVIsR0FBaUIsQ0FBQ3RCLElBQUQsRUFBT0UsVUFBVSxHQUFHLEVBQXBCLEVBQXdCVyxXQUFXLEdBQUcsRUFBdEMsS0FBNkM7QUFDNUQsUUFBTXdDLEdBQUcsR0FBR3ZELE9BQU8sQ0FBQ2MsTUFBUixDQUFlWixJQUFmLEVBQXFCRSxVQUFyQixFQUFpQ1csV0FBakMsRUFBOEM7QUFBQ1EsVUFBTSxFQUFFO0FBQVQsR0FBOUMsQ0FBWjs7QUFDQSxRQUFNYyxNQUFNLEdBQUdyQyxPQUFPLENBQUNzRCxPQUFSLENBQWdCcEQsSUFBaEIsRUFBc0JxRCxHQUF0QixDQUFmOztBQUVBdkQsU0FBTyxDQUFDVyxHQUFSLENBQVlULElBQVosRUFBa0JHLFVBQWxCLENBQTZCcUQsT0FBN0IsQ0FBcUNDLEVBQUUsSUFBSUEsRUFBRSxDQUFDdEIsTUFBRCxDQUE3QztBQUVBLFNBQU9BLE1BQVA7QUFDRCxDQVBEOztBQVNBckMsT0FBTyxDQUFDb0IsTUFBUixHQUFpQixDQUFDbEIsSUFBRCxFQUFPRSxVQUFVLEdBQUcsRUFBcEIsS0FBMkI7QUFDMUMsU0FBT2UsQ0FBQyxDQUFDQyxNQUFGLENBQVNELENBQUMsQ0FBQ3lDLEtBQUYsQ0FBUTVELE9BQU8sQ0FBQ1csR0FBUixDQUFZVCxJQUFaLEVBQWtCRSxVQUExQixDQUFULEVBQWdEQSxVQUFoRCxDQUFQO0FBQ0QsQ0FGRCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9kYnVybGVzX2ZhY3RvcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgTG9jYWxDb2xsZWN0aW9uICovXG4vKiBnbG9iYWwgRmFjdG9yeTp0cnVlICovXG5cbmNvbnN0IGZhY3RvcmllcyA9IHt9O1xuXG5GYWN0b3J5ID0gY2xhc3MgRmFjdG9yeSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGNvbGxlY3Rpb24sIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICB0aGlzLmFmdGVySG9va3MgPSBbXTtcbiAgICB0aGlzLnNlcXVlbmNlID0gMDtcbiAgfVxuXG4gIGFmdGVyKGZuKSB7XG4gICAgdGhpcy5hZnRlckhvb2tzLnB1c2goZm4pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5GYWN0b3J5LmRlZmluZSA9IChuYW1lLCBjb2xsZWN0aW9uLCBhdHRyaWJ1dGVzKSA9PiB7XG4gIGZhY3Rvcmllc1tuYW1lXSA9IG5ldyBGYWN0b3J5KG5hbWUsIGNvbGxlY3Rpb24sIGF0dHJpYnV0ZXMpO1xuICByZXR1cm4gZmFjdG9yaWVzW25hbWVdO1xufTtcblxuRmFjdG9yeS5nZXQgPSBuYW1lID0+IHtcbiAgY29uc3QgZmFjdG9yeSA9IGZhY3Rvcmllc1tuYW1lXTtcbiAgaWYgKCEgZmFjdG9yeSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkZhY3Rvcnk6IFRoZXJlIGlzIG5vIGZhY3RvcnkgbmFtZWQgXCIgKyBuYW1lKTtcbiAgfVxuICByZXR1cm4gZmFjdG9yeTtcbn07XG5cbkZhY3RvcnkuX2J1aWxkID0gKG5hbWUsIGF0dHJpYnV0ZXMgPSB7fSwgdXNlck9wdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGZhY3RvcnkgPSBGYWN0b3J5LmdldChuYW1lKTtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgLy8gXCJyYXdcIiBhdHRyaWJ1dGVzIHdpdGhvdXQgZnVuY3Rpb25zIGV2YWx1YXRlZCwgb3IgZG90dGVkIHByb3BlcnRpZXMgcmVzb2x2ZWRcbiAgY29uc3QgZXh0ZW5kZWRBdHRyaWJ1dGVzID0gXy5leHRlbmQoe30sIGZhY3RvcnkuYXR0cmlidXRlcywgYXR0cmlidXRlcyk7XG5cbiAgLy8gZWl0aGVyIGNyZWF0ZSBhIG5ldyBmYWN0b3J5IGFuZCByZXR1cm4gaXRzIF9pZFxuICAvLyBvciByZXR1cm4gYSAnZmFrZScgX2lkIChzaW5jZSB3ZSdyZSBub3QgaW5zZXJ0aW5nIGFueXRoaW5nKVxuICBjb25zdCBtYWtlUmVsYXRpb24gPSByZWxOYW1lID0+IHtcbiAgICBpZiAob3B0aW9ucy5pbnNlcnQpIHtcbiAgICAgIHJldHVybiBGYWN0b3J5LmNyZWF0ZShyZWxOYW1lLCB7fSwgdXNlck9wdGlvbnMpLl9pZDtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMudHJlZSkge1xuICAgICAgcmV0dXJuIEZhY3RvcnkuX2J1aWxkKHJlbE5hbWUsIHt9LCB1c2VyT3B0aW9ucywge3RyZWU6IHRydWV9KTtcbiAgICB9XG4gICAgLy8gZmFrZSBhbiBpZCBvbiBidWlsZFxuICAgIHJldHVybiBSYW5kb20uaWQoKTtcbiAgfTtcblxuICBjb25zdCBnZXRWYWx1ZSA9IHZhbHVlID0+IHtcbiAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgRmFjdG9yeSkgPyBtYWtlUmVsYXRpb24odmFsdWUubmFtZSkgOiB2YWx1ZTtcbiAgfTtcblxuICBjb25zdCBnZXRWYWx1ZUZyb21GdW5jdGlvbiA9IGZ1bmMgPT4ge1xuICAgIGNvbnN0IGFwaSA9IHsgc2VxdWVuY2U6IGZuID0+IGZuKGZhY3Rvcnkuc2VxdWVuY2UpIH07XG4gICAgY29uc3QgZm5SZXMgPSBmdW5jLmNhbGwocmVzdWx0LCBhcGksIHVzZXJPcHRpb25zKTtcbiAgICByZXR1cm4gZ2V0VmFsdWUoZm5SZXMpO1xuICB9O1xuXG4gIGZhY3Rvcnkuc2VxdWVuY2UgKz0gMTtcblxuICBjb25zdCB3YWxrID0gKHJlY29yZCwgb2JqZWN0KSA9PiB7XG4gICAgXy5lYWNoKG9iamVjdCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGxldCBuZXdWYWx1ZSA9IHZhbHVlO1xuICAgICAgLy8gaXMgdGhpcyBhIEZhY3RvcnkgaW5zdGFuY2U/XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBGYWN0b3J5KSB7XG4gICAgICAgIG5ld1ZhbHVlID0gbWFrZVJlbGF0aW9uKHZhbHVlLm5hbWUpO1xuICAgICAgfSBlbHNlIGlmIChfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gdmFsdWUubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybiBnZXRWYWx1ZUZyb21GdW5jdGlvbihlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGdldFZhbHVlKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoXy5pc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgICBuZXdWYWx1ZSA9IGdldFZhbHVlRnJvbUZ1bmN0aW9uKHZhbHVlKTtcbiAgICAgIC8vIGlmIGFuIG9iamVjdCBsaXRlcmFsIGlzIHBhc3NlZCBpbiwgdHJhdmVyc2UgZGVlcGVyIGludG8gaXRcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgT2JqZWN0XScpIHtcbiAgICAgICAgcmVjb3JkW2tleV0gPSByZWNvcmRba2V5XSB8fCB7fTtcbiAgICAgICAgcmV0dXJuIHdhbGsocmVjb3JkW2tleV0sIHZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbW9kaWZpZXIgPSB7JHNldDoge319O1xuXG4gICAgICBpZiAoa2V5ICE9PSAnX2lkJykge1xuICAgICAgICBtb2RpZmllci4kc2V0W2tleV0gPSBuZXdWYWx1ZTtcbiAgICAgIH1cblxuICAgICAgTG9jYWxDb2xsZWN0aW9uLl9tb2RpZnkocmVjb3JkLCBtb2RpZmllcik7XG4gICAgfSk7XG4gIH07XG5cbiAgd2FsayhyZXN1bHQsIGV4dGVuZGVkQXR0cmlidXRlcyk7XG5cbiAgaWYgKCEgb3B0aW9ucy50cmVlKSB7XG4gICAgcmVzdWx0Ll9pZCA9IGV4dGVuZGVkQXR0cmlidXRlcy5faWQgfHwgUmFuZG9tLmlkKCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbkZhY3RvcnkuYnVpbGQgPSAobmFtZSwgYXR0cmlidXRlcyA9IHt9LCB1c2VyT3B0aW9ucyA9IHt9KSA9PiB7XG4gIHJldHVybiBGYWN0b3J5Ll9idWlsZChuYW1lLCBhdHRyaWJ1dGVzLCB1c2VyT3B0aW9ucyk7XG59O1xuXG5GYWN0b3J5LnRyZWUgPSAobmFtZSwgYXR0cmlidXRlcywgdXNlck9wdGlvbnMgPSB7fSkgPT4ge1xuICByZXR1cm4gRmFjdG9yeS5fYnVpbGQobmFtZSwgYXR0cmlidXRlcywgdXNlck9wdGlvbnMsIHt0cmVlOiB0cnVlfSk7XG59O1xuXG5GYWN0b3J5Ll9jcmVhdGUgPSAobmFtZSwgZG9jKSA9PiB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSBGYWN0b3J5LmdldChuYW1lKS5jb2xsZWN0aW9uO1xuICBjb25zdCBpbnNlcnRJZCA9IGNvbGxlY3Rpb24uaW5zZXJ0KGRvYyk7XG4gIGNvbnN0IHJlY29yZCA9IGNvbGxlY3Rpb24uZmluZE9uZShpbnNlcnRJZCk7XG4gIHJldHVybiByZWNvcmQ7XG59O1xuXG5GYWN0b3J5LmNyZWF0ZSA9IChuYW1lLCBhdHRyaWJ1dGVzID0ge30sIHVzZXJPcHRpb25zID0ge30pID0+IHtcbiAgY29uc3QgZG9jID0gRmFjdG9yeS5fYnVpbGQobmFtZSwgYXR0cmlidXRlcywgdXNlck9wdGlvbnMsIHtpbnNlcnQ6IHRydWV9KTtcbiAgY29uc3QgcmVjb3JkID0gRmFjdG9yeS5fY3JlYXRlKG5hbWUsIGRvYyk7XG5cbiAgRmFjdG9yeS5nZXQobmFtZSkuYWZ0ZXJIb29rcy5mb3JFYWNoKGNiID0+IGNiKHJlY29yZCkpO1xuXG4gIHJldHVybiByZWNvcmQ7XG59O1xuXG5GYWN0b3J5LmV4dGVuZCA9IChuYW1lLCBhdHRyaWJ1dGVzID0ge30pID0+IHtcbiAgcmV0dXJuIF8uZXh0ZW5kKF8uY2xvbmUoRmFjdG9yeS5nZXQobmFtZSkuYXR0cmlidXRlcyksIGF0dHJpYnV0ZXMpO1xufTtcbiJdfQ==
