(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Collection2;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:collection2-core":{"collection2.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/aldeed_collection2-core/collection2.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let EventEmitter;
module.watch(require("meteor/raix:eventemitter"), {
  EventEmitter(v) {
    EventEmitter = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let EJSON;
module.watch(require("meteor/ejson"), {
  EJSON(v) {
    EJSON = v;
  }

}, 2);

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 3);
let checkNpmVersions;
module.watch(require("meteor/tmeasday:check-npm-versions"), {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 4);
checkNpmVersions({
  'simpl-schema': '>=0.0.0'
}, 'aldeed:meteor-collection2-core');

const SimpleSchema = require('simpl-schema').default; // Exported only for listening to events


const Collection2 = new EventEmitter(); /**
                                         * Mongo.Collection.prototype.attachSchema
                                         * @param {SimpleSchema|Object} ss - SimpleSchema instance or a schema definition object
                                         *    from which to create a new SimpleSchema instance
                                         * @param {Object} [options]
                                         * @param {Boolean} [options.transform=false] Set to `true` if your document must be passed
                                         *    through the collection's transform to properly validate.
                                         * @param {Boolean} [options.replace=false] Set to `true` to replace any existing schema instead of combining
                                         * @return {undefined}
                                         *
                                         * Use this method to attach a schema to a collection created by another package,
                                         * such as Meteor.users. It is most likely unsafe to call this method more than
                                         * once for a single collection, or to call this for a collection that had a
                                         * schema object passed to its constructor.
                                         */

Mongo.Collection.prototype.attachSchema = function c2AttachSchema(ss, options) {
  var self = this;
  options = options || {}; // Allow passing just the schema object

  if (!(ss instanceof SimpleSchema)) {
    ss = new SimpleSchema(ss);
  }

  self._c2 = self._c2 || {}; // If we've already attached one schema, we combine both into a new schema unless options.replace is `true`

  if (self._c2._simpleSchema && options.replace !== true) {
    if (ss.version >= 2) {
      var newSS = new SimpleSchema(self._c2._simpleSchema);
      newSS.extend(ss);
      ss = newSS;
    } else {
      ss = new SimpleSchema([self._c2._simpleSchema, ss]);
    }
  }

  var selector = options.selector;

  function attachTo(obj) {
    if (typeof selector === "object") {
      // Index of existing schema with identical selector
      var schemaIndex = -1; // we need an array to hold multiple schemas

      obj._c2._simpleSchemas = obj._c2._simpleSchemas || []; // Loop through existing schemas with selectors

      obj._c2._simpleSchemas.forEach((schema, index) => {
        // if we find a schema with an identical selector, save it's index
        if (_.isEqual(schema.selector, selector)) {
          schemaIndex = index;
        }
      });

      if (schemaIndex === -1) {
        // We didn't find the schema in our array - push it into the array
        obj._c2._simpleSchemas.push({
          schema: new SimpleSchema(ss),
          selector: selector
        });
      } else {
        // We found a schema with an identical selector in our array,
        if (options.replace !== true) {
          // Merge with existing schema unless options.replace is `true`
          if (obj._c2._simpleSchemas[schemaIndex].schema.version >= 2) {
            obj._c2._simpleSchemas[schemaIndex].schema.extend(ss);
          } else {
            obj._c2._simpleSchemas[schemaIndex].schema = new SimpleSchema([obj._c2._simpleSchemas[schemaIndex].schema, ss]);
          }
        } else {
          // If options.repalce is `true` replace existing schema with new schema
          obj._c2._simpleSchemas[schemaIndex].schema = ss;
        }
      } // Remove existing schemas without selector


      delete obj._c2._simpleSchema;
    } else {
      // Track the schema in the collection
      obj._c2._simpleSchema = ss; // Remove existing schemas with selector

      delete obj._c2._simpleSchemas;
    }
  }

  attachTo(self); // Attach the schema to the underlying LocalCollection, too

  if (self._collection instanceof LocalCollection) {
    self._collection._c2 = self._collection._c2 || {};
    attachTo(self._collection);
  }

  defineDeny(self, options);
  keepInsecure(self);
  Collection2.emit('schema.attached', self, ss, options);
};

[Mongo.Collection, LocalCollection].forEach(obj => {
  /**
   * simpleSchema
   * @description function detect the correct schema by given params. If it
   * detect multi-schema presence in `self`, then it made an attempt to find a
   * `selector` in args
   * @param {Object} doc - It could be <update> on update/upsert or document
   * itself on insert/remove
   * @param {Object} [options] - It could be <update> on update/upsert etc
   * @param {Object} [query] - it could be <query> on update/upsert
   * @return {Object} Schema
   */obj.prototype.simpleSchema = function (doc, options, query) {
    if (!this._c2) return null;
    if (this._c2._simpleSchema) return this._c2._simpleSchema;
    var schemas = this._c2._simpleSchemas;

    if (schemas && schemas.length > 0) {
      if (!doc) throw new Error('collection.simpleSchema() requires doc argument when there are multiple schemas');
      var schema, selector, target;

      for (var i = 0; i < schemas.length; i++) {
        schema = schemas[i];
        selector = Object.keys(schema.selector)[0]; // We will set this to undefined because in theory you might want to select
        // on a null value.

        target = undefined; // here we are looking for selector in different places
        // $set should have more priority here

        if (doc.$set && typeof doc.$set[selector] !== 'undefined') {
          target = doc.$set[selector];
        } else if (typeof doc[selector] !== 'undefined') {
          target = doc[selector];
        } else if (options && options.selector) {
          target = options.selector[selector];
        } else if (query && query[selector]) {
          // on upsert/update operations
          target = query[selector];
        } // we need to compare given selector with doc property or option to
        // find right schema


        if (target !== undefined && target === schema.selector[selector]) {
          return schema.schema;
        }
      }
    }

    return null;
  };
}); // Wrap DB write operation methods

['insert', 'update'].forEach(methodName => {
  var _super = Mongo.Collection.prototype[methodName];

  Mongo.Collection.prototype[methodName] = function () {
    var self = this,
        options,
        args = _.toArray(arguments);

    options = methodName === "insert" ? args[1] : args[2]; // Support missing options arg

    if (!options || typeof options === "function") {
      options = {};
    }

    if (self._c2 && options.bypassCollection2 !== true) {
      var userId = null;

      try {
        // https://github.com/aldeed/meteor-collection2/issues/175
        userId = Meteor.userId();
      } catch (err) {}

      args = doValidate.call(self, methodName, args, Meteor.isServer || self._connection === null, // getAutoValues
      userId, Meteor.isServer // isFromTrustedCode
      );

      if (!args) {
        // doValidate already called the callback or threw the error so we're done.
        // But insert should always return an ID to match core behavior.
        return methodName === "insert" ? self._makeNewID() : undefined;
      }
    } else {
      // We still need to adjust args because insert does not take options
      if (methodName === "insert" && typeof args[1] !== 'function') args.splice(1, 1);
    }

    return _super.apply(self, args);
  };
}); /*
     * Private
     */

function doValidate(type, args, getAutoValues, userId, isFromTrustedCode) {
  var self = this,
      doc,
      callback,
      error,
      options,
      isUpsert,
      selector,
      last,
      hasCallback;

  if (!args.length) {
    throw new Error(type + " requires an argument");
  } // Gather arguments and cache the selector


  if (type === "insert") {
    doc = args[0];
    options = args[1];
    callback = args[2]; // The real insert doesn't take options

    if (typeof options === "function") {
      args = [doc, options];
    } else if (typeof callback === "function") {
      args = [doc, callback];
    } else {
      args = [doc];
    }
  } else if (type === "update") {
    selector = args[0];
    doc = args[1];
    options = args[2];
    callback = args[3];
  } else {
    throw new Error("invalid type argument");
  }

  var validatedObjectWasInitiallyEmpty = _.isEmpty(doc); // Support missing options arg


  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};
  last = args.length - 1;
  hasCallback = typeof args[last] === 'function'; // If update was called with upsert:true, flag as an upsert

  isUpsert = type === "update" && options.upsert === true; // we need to pass `doc` and `options` to `simpleSchema` method, that's why
  // schema declaration moved here

  var schema = self.simpleSchema(doc, options, selector);
  var isLocalCollection = self._connection === null; // On the server and for local collections, we allow passing `getAutoValues: false` to disable autoValue functions

  if ((Meteor.isServer || isLocalCollection) && options.getAutoValues === false) {
    getAutoValues = false;
  } // Determine validation context


  var validationContext = options.validationContext;

  if (validationContext) {
    if (typeof validationContext === 'string') {
      validationContext = schema.namedContext(validationContext);
    }
  } else {
    validationContext = schema.namedContext();
  } // Add a default callback function if we're on the client and no callback was given


  if (Meteor.isClient && !callback) {
    // Client can't block, so it can't report errors by exception,
    // only by callback. If they forget the callback, give them a
    // default one that logs the error, so they aren't totally
    // baffled if their writes don't work because their database is
    // down.
    callback = function (err) {
      if (err) {
        Meteor._debug(type + " failed: " + (err.reason || err.stack));
      }
    };
  } // If client validation is fine or is skipped but then something
  // is found to be invalid on the server, we get that error back
  // as a special Meteor.Error that we need to parse.


  if (Meteor.isClient && hasCallback) {
    callback = args[last] = wrapCallbackForParsingServerErrors(validationContext, callback);
  }

  var schemaAllowsId = schema.allowsKey("_id");

  if (type === "insert" && !doc._id && schemaAllowsId) {
    doc._id = self._makeNewID();
  } // Get the docId for passing in the autoValue/custom context


  var docId;

  if (type === 'insert') {
    docId = doc._id; // might be undefined
  } else if (type === "update" && selector) {
    docId = typeof selector === 'string' || selector instanceof Mongo.ObjectID ? selector : selector._id;
  } // If _id has already been added, remove it temporarily if it's
  // not explicitly defined in the schema.


  var cachedId;

  if (doc._id && !schemaAllowsId) {
    cachedId = doc._id;
    delete doc._id;
  }

  function doClean(docToClean, getAutoValues, filter, autoConvert, removeEmptyStrings, trimStrings) {
    // Clean the doc/modifier in place
    schema.clean(docToClean, {
      mutate: true,
      filter: filter,
      autoConvert: autoConvert,
      getAutoValues: getAutoValues,
      isModifier: type !== "insert",
      removeEmptyStrings: removeEmptyStrings,
      trimStrings: trimStrings,
      extendAutoValueContext: _.extend({
        isInsert: type === "insert",
        isUpdate: type === "update" && options.upsert !== true,
        isUpsert: isUpsert,
        userId: userId,
        isFromTrustedCode: isFromTrustedCode,
        docId: docId,
        isLocalCollection: isLocalCollection
      }, options.extendAutoValueContext || {})
    });
  } // Preliminary cleaning on both client and server. On the server and for local
  // collections, automatic values will also be set at this point.


  doClean(doc, getAutoValues, options.filter !== false, options.autoConvert !== false, options.removeEmptyStrings !== false, options.trimStrings !== false); // We clone before validating because in some cases we need to adjust the
  // object a bit before validating it. If we adjusted `doc` itself, our
  // changes would persist into the database.

  var docToValidate = {};

  for (var prop in doc) {
    // We omit prototype properties when cloning because they will not be valid
    // and mongo omits them when saving to the database anyway.
    if (Object.prototype.hasOwnProperty.call(doc, prop)) {
      docToValidate[prop] = doc[prop];
    }
  } // On the server, upserts are possible; SimpleSchema handles upserts pretty
  // well by default, but it will not know about the fields in the selector,
  // which are also stored in the database if an insert is performed. So we
  // will allow these fields to be considered for validation by adding them
  // to the $set in the modifier. This is no doubt prone to errors, but there
  // probably isn't any better way right now.


  if (Meteor.isServer && isUpsert && _.isObject(selector)) {
    var set = docToValidate.$set || {}; // If selector uses $and format, convert to plain object selector

    if (Array.isArray(selector.$and)) {
      const plainSelector = {};
      selector.$and.forEach(sel => {
        _.extend(plainSelector, sel);
      });
      docToValidate.$set = plainSelector;
    } else {
      docToValidate.$set = _.clone(selector);
    }

    if (!schemaAllowsId) delete docToValidate.$set._id;

    _.extend(docToValidate.$set, set);
  } // Set automatic values for validation on the client.
  // On the server, we already updated doc with auto values, but on the client,
  // we will add them to docToValidate for validation purposes only.
  // This is because we want all actual values generated on the server.


  if (Meteor.isClient && !isLocalCollection) {
    doClean(docToValidate, true, false, false, false, false);
  } // XXX Maybe move this into SimpleSchema


  if (!validatedObjectWasInitiallyEmpty && _.isEmpty(docToValidate)) {
    throw new Error('After filtering out keys not in the schema, your ' + (type === 'update' ? 'modifier' : 'object') + ' is now empty');
  } // Validate doc


  var isValid;

  if (options.validate === false) {
    isValid = true;
  } else {
    isValid = validationContext.validate(docToValidate, {
      modifier: type === "update" || type === "upsert",
      upsert: isUpsert,
      extendedCustomContext: _.extend({
        isInsert: type === "insert",
        isUpdate: type === "update" && options.upsert !== true,
        isUpsert: isUpsert,
        userId: userId,
        isFromTrustedCode: isFromTrustedCode,
        docId: docId,
        isLocalCollection: isLocalCollection
      }, options.extendedCustomContext || {})
    });
  }

  if (isValid) {
    // Add the ID back
    if (cachedId) {
      doc._id = cachedId;
    } // Update the args to reflect the cleaned doc
    // XXX not sure this is necessary since we mutate


    if (type === "insert") {
      args[0] = doc;
    } else {
      args[1] = doc;
    } // If callback, set invalidKey when we get a mongo unique error


    if (Meteor.isServer && hasCallback) {
      args[last] = wrapCallbackForParsingMongoValidationErrors(validationContext, args[last]);
    }

    return args;
  } else {
    error = getErrorObject(validationContext, `in ${self._name} ${type}`);

    if (callback) {
      // insert/update/upsert pass `false` when there's an error, so we do that
      callback(error, false);
    } else {
      throw error;
    }
  }
}

function getErrorObject(context, appendToMessage = '') {
  let message;
  const invalidKeys = typeof context.validationErrors === 'function' ? context.validationErrors() : context.invalidKeys();

  if (invalidKeys.length) {
    const firstErrorKey = invalidKeys[0].name;
    const firstErrorMessage = context.keyErrorMessage(firstErrorKey); // If the error is in a nested key, add the full key to the error message
    // to be more helpful.

    if (firstErrorKey.indexOf('.') === -1) {
      message = firstErrorMessage;
    } else {
      message = `${firstErrorMessage} (${firstErrorKey})`;
    }
  } else {
    message = "Failed validation";
  }

  message = `${message} ${appendToMessage}`.trim();
  const error = new Error(message);
  error.invalidKeys = invalidKeys;
  error.validationContext = context; // If on the server, we add a sanitized error, too, in case we're
  // called from a method.

  if (Meteor.isServer) {
    error.sanitizedError = new Meteor.Error(400, message, EJSON.stringify(error.invalidKeys));
  }

  return error;
}

function addUniqueError(context, errorMessage) {
  var name = errorMessage.split('c2_')[1].split(' ')[0];
  var val = errorMessage.split('dup key:')[1].split('"')[1];
  var addValidationErrorsPropName = typeof context.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  context[addValidationErrorsPropName]([{
    name: name,
    type: 'notUnique',
    value: val
  }]);
}

function wrapCallbackForParsingMongoValidationErrors(validationContext, cb) {
  return function wrappedCallbackForParsingMongoValidationErrors(error) {
    var args = _.toArray(arguments);

    if (error && (error.name === "MongoError" && error.code === 11001 || error.message.indexOf('MongoError: E11000' !== -1)) && error.message.indexOf('c2_') !== -1) {
      addUniqueError(validationContext, error.message);
      args[0] = getErrorObject(validationContext);
    }

    return cb.apply(this, args);
  };
}

function wrapCallbackForParsingServerErrors(validationContext, cb) {
  var addValidationErrorsPropName = typeof validationContext.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  return function wrappedCallbackForParsingServerErrors(error) {
    var args = _.toArray(arguments); // Handle our own validation errors


    if (error instanceof Meteor.Error && error.error === 400 && error.reason === "INVALID" && typeof error.details === "string") {
      var invalidKeysFromServer = EJSON.parse(error.details);
      validationContext[addValidationErrorsPropName](invalidKeysFromServer);
      args[0] = getErrorObject(validationContext);
    } // Handle Mongo unique index errors, which are forwarded to the client as 409 errors
    else if (error instanceof Meteor.Error && error.error === 409 && error.reason && error.reason.indexOf('E11000') !== -1 && error.reason.indexOf('c2_') !== -1) {
        addUniqueError(validationContext, error.reason);
        args[0] = getErrorObject(validationContext);
      }

    return cb.apply(this, args);
  };
}

var alreadyInsecured = {};

function keepInsecure(c) {
  // If insecure package is in use, we need to add allow rules that return
  // true. Otherwise, it would seemingly turn off insecure mode.
  if (Package && Package.insecure && !alreadyInsecured[c._name]) {
    c.allow({
      insert: function () {
        return true;
      },
      update: function () {
        return true;
      },
      remove: function () {
        return true;
      },
      fetch: [],
      transform: null
    });
    alreadyInsecured[c._name] = true;
  } // If insecure package is NOT in use, then adding the two deny functions
  // does not have any effect on the main app's security paradigm. The
  // user will still be required to add at least one allow function of her
  // own for each operation for this collection. And the user may still add
  // additional deny functions, but does not have to.

}

var alreadyDefined = {};

function defineDeny(c, options) {
  if (!alreadyDefined[c._name]) {
    var isLocalCollection = c._connection === null; // First define deny functions to extend doc with the results of clean
    // and autovalues. This must be done with "transform: null" or we would be
    // extending a clone of doc and therefore have no effect.

    c.deny({
      insert: function (userId, doc) {
        // Referenced doc is cleaned in place
        c.simpleSchema(doc).clean(doc, {
          mutate: true,
          isModifier: false,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: true,
            isUpdate: false,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // Referenced modifier is cleaned in place
        c.simpleSchema(modifier).clean(modifier, {
          mutate: true,
          isModifier: true,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: false,
            isUpdate: true,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc && doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      fetch: ['_id'],
      transform: null
    }); // Second define deny functions to validate again on the server
    // for client-initiated inserts and updates. These should be
    // called after the clean/autovalue functions since we're adding
    // them after. These must *not* have "transform: null" if options.transform is true because
    // we need to pass the doc through any transforms to be sure
    // that custom types are properly recognized for type validation.

    c.deny(_.extend({
      insert: function (userId, doc) {
        // We pass the false options because we will have done them on client if desired
        doValidate.call(c, "insert", [doc, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // NOTE: This will never be an upsert because client-side upserts
        // are not allowed once you define allow/deny functions.
        // We pass the false options because we will have done them on client if desired
        doValidate.call(c, "update", [{
          _id: doc && doc._id
        }, modifier, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      fetch: ['_id']
    }, options.transform === true ? {} : {
      transform: null
    })); // note that we've already done this collection so that we don't do it again
    // if attachSchema is called again

    alreadyDefined[c._name] = true;
  }
}

module.exportDefault(Collection2);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/aldeed:collection2-core/collection2.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['aldeed:collection2-core'] = exports, {
  Collection2: Collection2
});

})();

//# sourceURL=meteor://💻app/packages/aldeed_collection2-core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOmNvbGxlY3Rpb24yLWNvcmUvY29sbGVjdGlvbjIuanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsIk1ldGVvciIsIkVKU09OIiwiXyIsImNoZWNrTnBtVmVyc2lvbnMiLCJTaW1wbGVTY2hlbWEiLCJkZWZhdWx0IiwiQ29sbGVjdGlvbjIiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJhdHRhY2hTY2hlbWEiLCJjMkF0dGFjaFNjaGVtYSIsInNzIiwib3B0aW9ucyIsInNlbGYiLCJfYzIiLCJfc2ltcGxlU2NoZW1hIiwicmVwbGFjZSIsInZlcnNpb24iLCJuZXdTUyIsImV4dGVuZCIsInNlbGVjdG9yIiwiYXR0YWNoVG8iLCJvYmoiLCJzY2hlbWFJbmRleCIsIl9zaW1wbGVTY2hlbWFzIiwiZm9yRWFjaCIsInNjaGVtYSIsImluZGV4IiwiaXNFcXVhbCIsInB1c2giLCJfY29sbGVjdGlvbiIsIkxvY2FsQ29sbGVjdGlvbiIsImRlZmluZURlbnkiLCJrZWVwSW5zZWN1cmUiLCJlbWl0Iiwic2ltcGxlU2NoZW1hIiwiZG9jIiwicXVlcnkiLCJzY2hlbWFzIiwibGVuZ3RoIiwiRXJyb3IiLCJ0YXJnZXQiLCJpIiwiT2JqZWN0Iiwia2V5cyIsInVuZGVmaW5lZCIsIiRzZXQiLCJtZXRob2ROYW1lIiwiX3N1cGVyIiwiYXJncyIsInRvQXJyYXkiLCJhcmd1bWVudHMiLCJieXBhc3NDb2xsZWN0aW9uMiIsInVzZXJJZCIsImVyciIsImRvVmFsaWRhdGUiLCJjYWxsIiwiaXNTZXJ2ZXIiLCJfY29ubmVjdGlvbiIsIl9tYWtlTmV3SUQiLCJzcGxpY2UiLCJhcHBseSIsInR5cGUiLCJnZXRBdXRvVmFsdWVzIiwiaXNGcm9tVHJ1c3RlZENvZGUiLCJjYWxsYmFjayIsImVycm9yIiwiaXNVcHNlcnQiLCJsYXN0IiwiaGFzQ2FsbGJhY2siLCJ2YWxpZGF0ZWRPYmplY3RXYXNJbml0aWFsbHlFbXB0eSIsImlzRW1wdHkiLCJ1cHNlcnQiLCJpc0xvY2FsQ29sbGVjdGlvbiIsInZhbGlkYXRpb25Db250ZXh0IiwibmFtZWRDb250ZXh0IiwiaXNDbGllbnQiLCJfZGVidWciLCJyZWFzb24iLCJzdGFjayIsIndyYXBDYWxsYmFja0ZvclBhcnNpbmdTZXJ2ZXJFcnJvcnMiLCJzY2hlbWFBbGxvd3NJZCIsImFsbG93c0tleSIsIl9pZCIsImRvY0lkIiwiT2JqZWN0SUQiLCJjYWNoZWRJZCIsImRvQ2xlYW4iLCJkb2NUb0NsZWFuIiwiZmlsdGVyIiwiYXV0b0NvbnZlcnQiLCJyZW1vdmVFbXB0eVN0cmluZ3MiLCJ0cmltU3RyaW5ncyIsImNsZWFuIiwibXV0YXRlIiwiaXNNb2RpZmllciIsImV4dGVuZEF1dG9WYWx1ZUNvbnRleHQiLCJpc0luc2VydCIsImlzVXBkYXRlIiwiZG9jVG9WYWxpZGF0ZSIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsImlzT2JqZWN0Iiwic2V0IiwiQXJyYXkiLCJpc0FycmF5IiwiJGFuZCIsInBsYWluU2VsZWN0b3IiLCJzZWwiLCJjbG9uZSIsImlzVmFsaWQiLCJ2YWxpZGF0ZSIsIm1vZGlmaWVyIiwiZXh0ZW5kZWRDdXN0b21Db250ZXh0Iiwid3JhcENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyIsImdldEVycm9yT2JqZWN0IiwiX25hbWUiLCJjb250ZXh0IiwiYXBwZW5kVG9NZXNzYWdlIiwibWVzc2FnZSIsImludmFsaWRLZXlzIiwidmFsaWRhdGlvbkVycm9ycyIsImZpcnN0RXJyb3JLZXkiLCJuYW1lIiwiZmlyc3RFcnJvck1lc3NhZ2UiLCJrZXlFcnJvck1lc3NhZ2UiLCJpbmRleE9mIiwidHJpbSIsInNhbml0aXplZEVycm9yIiwic3RyaW5naWZ5IiwiYWRkVW5pcXVlRXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJzcGxpdCIsInZhbCIsImFkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZSIsImFkZFZhbGlkYXRpb25FcnJvcnMiLCJ2YWx1ZSIsImNiIiwid3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyIsImNvZGUiLCJ3cmFwcGVkQ2FsbGJhY2tGb3JQYXJzaW5nU2VydmVyRXJyb3JzIiwiZGV0YWlscyIsImludmFsaWRLZXlzRnJvbVNlcnZlciIsInBhcnNlIiwiYWxyZWFkeUluc2VjdXJlZCIsImMiLCJQYWNrYWdlIiwiaW5zZWN1cmUiLCJhbGxvdyIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImZldGNoIiwidHJhbnNmb3JtIiwiYWxyZWFkeURlZmluZWQiLCJkZW55IiwiZmllbGRzIiwiZXhwb3J0RGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFKO0FBQWlCQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsMEJBQVIsQ0FBYixFQUFpRDtBQUFDSCxlQUFhSSxDQUFiLEVBQWU7QUFBQ0osbUJBQWFJLENBQWI7QUFBZTs7QUFBaEMsQ0FBakQsRUFBbUYsQ0FBbkY7QUFBc0YsSUFBSUMsTUFBSjtBQUFXSixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiLEVBQXNDO0FBQUNFLFNBQU9ELENBQVAsRUFBUztBQUFDQyxhQUFPRCxDQUFQO0FBQVM7O0FBQXBCLENBQXRDLEVBQTRELENBQTVEO0FBQStELElBQUlFLEtBQUo7QUFBVUwsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDRyxRQUFNRixDQUFOLEVBQVE7QUFBQ0UsWUFBTUYsQ0FBTjtBQUFROztBQUFsQixDQUFyQyxFQUF5RCxDQUF6RDs7QUFBNEQsSUFBSUcsQ0FBSjs7QUFBTU4sT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG1CQUFSLENBQWIsRUFBMEM7QUFBQ0ksSUFBRUgsQ0FBRixFQUFJO0FBQUNHLFFBQUVILENBQUY7QUFBSTs7QUFBVixDQUExQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJSSxn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V0MsSUFBWCxDQUNFeUYsQ0FERixFQUVFLFFBRkYsRUFHRSxDQUNFO0FBQUM5RCxlQUFLL0MsT0FBT0EsSUFBSStDO0FBQWpCLFNBREYsRUFFRTZCLFFBRkYsRUFHRTtBQUNFcEIsdUJBQWEsS0FEZjtBQUVFRCw4QkFBb0IsS0FGdEI7QUFHRUYsa0JBQVEsS0FIVjtBQUlFQyx1QkFBYTtBQUpmLFNBSEYsRUFTRSxVQUFTeEIsS0FBVCxFQUFnQjtBQUNkLGNBQUlBLEtBQUosRUFBVztBQUNULGtCQUFNLElBQUluRSxPQUFPeUMsS0FBWCxDQUFpQixHQUFqQixFQUFzQixTQUF0QixFQUFpQ3hDLE1BQU1pSSxTQUFOLENBQWdCL0QsTUFBTXNELFdBQXRCLENBQWpDLENBQU47QUFDRDtBQUNGLFNBYkgsQ0FIRixFQWtCRSxLQWxCRixFQWtCUztBQUNQbkUsY0FuQkYsRUFvQkUsS0FwQkYsQ0FvQlE7QUFwQlI7QUF1QkEsZUFBTyxLQUFQO0FBQ0QsT0F2RGE7QUF3RGRtRyxhQUFPLENBQUMsS0FBRDtBQXhETyxLQUFULEVBeURKNUksUUFBUTZJLFNBQVIsS0FBc0IsSUFBdEIsR0FBNkIsRUFBN0IsR0FBa0M7QUFBQ0EsaUJBQVc7QUFBWixLQXpEOUIsQ0FBUCxFQWhFNEIsQ0EySDVCO0FBQ0E7O0FBQ0FDLG1CQUFlVCxFQUFFN0IsS0FBakIsSUFBMEIsSUFBMUI7QUFDRDtBQUNGOztBQW5yQkR6SCxPQUFPa0ssYUFBUCxDQXFyQmV4SixXQXJyQmYsRSIsImZpbGUiOiIvcGFja2FnZXMvYWxkZWVkX2NvbGxlY3Rpb24yLWNvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdtZXRlb3IvcmFpeDpldmVudGVtaXR0ZXInO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBFSlNPTiB9IGZyb20gJ21ldGVvci9lanNvbic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuXG5jaGVja05wbVZlcnNpb25zKHsgJ3NpbXBsLXNjaGVtYSc6ICc+PTAuMC4wJyB9LCAnYWxkZWVkOm1ldGVvci1jb2xsZWN0aW9uMi1jb3JlJyk7XG5cbmNvbnN0IFNpbXBsZVNjaGVtYSA9IHJlcXVpcmUoJ3NpbXBsLXNjaGVtYScpLmRlZmF1bHQ7XG5cbi8vIEV4cG9ydGVkIG9ubHkgZm9yIGxpc3RlbmluZyB0byBldmVudHNcbmNvbnN0IENvbGxlY3Rpb24yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4vKipcbiAqIE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLmF0dGFjaFNjaGVtYVxuICogQHBhcmFtIHtTaW1wbGVTY2hlbWF8T2JqZWN0fSBzcyAtIFNpbXBsZVNjaGVtYSBpbnN0YW5jZSBvciBhIHNjaGVtYSBkZWZpbml0aW9uIG9iamVjdFxuICogICAgZnJvbSB3aGljaCB0byBjcmVhdGUgYSBuZXcgU2ltcGxlU2NoZW1hIGluc3RhbmNlXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnRyYW5zZm9ybT1mYWxzZV0gU2V0IHRvIGB0cnVlYCBpZiB5b3VyIGRvY3VtZW50IG11c3QgYmUgcGFzc2VkXG4gKiAgICB0aHJvdWdoIHRoZSBjb2xsZWN0aW9uJ3MgdHJhbnNmb3JtIHRvIHByb3Blcmx5IHZhbGlkYXRlLlxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yZXBsYWNlPWZhbHNlXSBTZXQgdG8gYHRydWVgIHRvIHJlcGxhY2UgYW55IGV4aXN0aW5nIHNjaGVtYSBpbnN0ZWFkIG9mIGNvbWJpbmluZ1xuICogQHJldHVybiB7dW5kZWZpbmVkfVxuICpcbiAqIFVzZSB0aGlzIG1ldGhvZCB0byBhdHRhY2ggYSBzY2hlbWEgdG8gYSBjb2xsZWN0aW9uIGNyZWF0ZWQgYnkgYW5vdGhlciBwYWNrYWdlLFxuICogc3VjaCBhcyBNZXRlb3IudXNlcnMuIEl0IGlzIG1vc3QgbGlrZWx5IHVuc2FmZSB0byBjYWxsIHRoaXMgbWV0aG9kIG1vcmUgdGhhblxuICogb25jZSBmb3IgYSBzaW5nbGUgY29sbGVjdGlvbiwgb3IgdG8gY2FsbCB0aGlzIGZvciBhIGNvbGxlY3Rpb24gdGhhdCBoYWQgYVxuICogc2NoZW1hIG9iamVjdCBwYXNzZWQgdG8gaXRzIGNvbnN0cnVjdG9yLlxuICovXG5Nb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5hdHRhY2hTY2hlbWEgPSBmdW5jdGlvbiBjMkF0dGFjaFNjaGVtYShzcywgb3B0aW9ucykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIEFsbG93IHBhc3NpbmcganVzdCB0aGUgc2NoZW1hIG9iamVjdFxuICBpZiAoIShzcyBpbnN0YW5jZW9mIFNpbXBsZVNjaGVtYSkpIHtcbiAgICBzcyA9IG5ldyBTaW1wbGVTY2hlbWEoc3MpO1xuICB9XG5cbiAgc2VsZi5fYzIgPSBzZWxmLl9jMiB8fCB7fTtcblxuICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGF0dGFjaGVkIG9uZSBzY2hlbWEsIHdlIGNvbWJpbmUgYm90aCBpbnRvIGEgbmV3IHNjaGVtYSB1bmxlc3Mgb3B0aW9ucy5yZXBsYWNlIGlzIGB0cnVlYFxuICBpZiAoc2VsZi5fYzIuX3NpbXBsZVNjaGVtYSAmJiBvcHRpb25zLnJlcGxhY2UgIT09IHRydWUpIHtcbiAgICBpZiAoc3MudmVyc2lvbiA+PSAyKSB7XG4gICAgICB2YXIgbmV3U1MgPSBuZXcgU2ltcGxlU2NoZW1hKHNlbGYuX2MyLl9zaW1wbGVTY2hlbWEpO1xuICAgICAgbmV3U1MuZXh0ZW5kKHNzKTtcbiAgICAgIHNzID0gbmV3U1M7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNzID0gbmV3IFNpbXBsZVNjaGVtYShbc2VsZi5fYzIuX3NpbXBsZVNjaGVtYSwgc3NdKTtcbiAgICB9XG4gIH1cblxuICB2YXIgc2VsZWN0b3IgPSBvcHRpb25zLnNlbGVjdG9yO1xuXG4gIGZ1bmN0aW9uIGF0dGFjaFRvKG9iaikge1xuICAgIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIC8vIEluZGV4IG9mIGV4aXN0aW5nIHNjaGVtYSB3aXRoIGlkZW50aWNhbCBzZWxlY3RvclxuICAgICAgdmFyIHNjaGVtYUluZGV4ID0gLTE7XG5cbiAgICAgIC8vIHdlIG5lZWQgYW4gYXJyYXkgdG8gaG9sZCBtdWx0aXBsZSBzY2hlbWFzXG4gICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzID0gb2JqLl9jMi5fc2ltcGxlU2NoZW1hcyB8fCBbXTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIGV4aXN0aW5nIHNjaGVtYXMgd2l0aCBzZWxlY3RvcnNcbiAgICAgIG9iai5fYzIuX3NpbXBsZVNjaGVtYXMuZm9yRWFjaCgoc2NoZW1hLCBpbmRleCkgPT4ge1xuICAgICAgICAvLyBpZiB3ZSBmaW5kIGEgc2NoZW1hIHdpdGggYW4gaWRlbnRpY2FsIHNlbGVjdG9yLCBzYXZlIGl0J3MgaW5kZXhcbiAgICAgICAgaWYoXy5pc0VxdWFsKHNjaGVtYS5zZWxlY3Rvciwgc2VsZWN0b3IpKSB7XG4gICAgICAgICAgc2NoZW1hSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoc2NoZW1hSW5kZXggPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIGRpZG4ndCBmaW5kIHRoZSBzY2hlbWEgaW4gb3VyIGFycmF5IC0gcHVzaCBpdCBpbnRvIHRoZSBhcnJheVxuICAgICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzLnB1c2goe1xuICAgICAgICAgIHNjaGVtYTogbmV3IFNpbXBsZVNjaGVtYShzcyksXG4gICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIGZvdW5kIGEgc2NoZW1hIHdpdGggYW4gaWRlbnRpY2FsIHNlbGVjdG9yIGluIG91ciBhcnJheSxcbiAgICAgICAgaWYgKG9wdGlvbnMucmVwbGFjZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgIC8vIE1lcmdlIHdpdGggZXhpc3Rpbmcgc2NoZW1hIHVubGVzcyBvcHRpb25zLnJlcGxhY2UgaXMgYHRydWVgXG4gICAgICAgICAgaWYgKG9iai5fYzIuX3NpbXBsZVNjaGVtYXNbc2NoZW1hSW5kZXhdLnNjaGVtYS52ZXJzaW9uID49IDIpIHtcbiAgICAgICAgICAgIG9iai5fYzIuX3NpbXBsZVNjaGVtYXNbc2NoZW1hSW5kZXhdLnNjaGVtYS5leHRlbmQoc3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKFtvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEsIHNzXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIG9wdGlvbnMucmVwYWxjZSBpcyBgdHJ1ZWAgcmVwbGFjZSBleGlzdGluZyBzY2hlbWEgd2l0aCBuZXcgc2NoZW1hXG4gICAgICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hc1tzY2hlbWFJbmRleF0uc2NoZW1hID0gc3M7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAvLyBSZW1vdmUgZXhpc3Rpbmcgc2NoZW1hcyB3aXRob3V0IHNlbGVjdG9yXG4gICAgICBkZWxldGUgb2JqLl9jMi5fc2ltcGxlU2NoZW1hO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUcmFjayB0aGUgc2NoZW1hIGluIHRoZSBjb2xsZWN0aW9uXG4gICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWEgPSBzcztcblxuICAgICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHNjaGVtYXMgd2l0aCBzZWxlY3RvclxuICAgICAgZGVsZXRlIG9iai5fYzIuX3NpbXBsZVNjaGVtYXM7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoVG8oc2VsZik7XG4gIC8vIEF0dGFjaCB0aGUgc2NoZW1hIHRvIHRoZSB1bmRlcmx5aW5nIExvY2FsQ29sbGVjdGlvbiwgdG9vXG4gIGlmIChzZWxmLl9jb2xsZWN0aW9uIGluc3RhbmNlb2YgTG9jYWxDb2xsZWN0aW9uKSB7XG4gICAgc2VsZi5fY29sbGVjdGlvbi5fYzIgPSBzZWxmLl9jb2xsZWN0aW9uLl9jMiB8fCB7fTtcbiAgICBhdHRhY2hUbyhzZWxmLl9jb2xsZWN0aW9uKTtcbiAgfVxuXG4gIGRlZmluZURlbnkoc2VsZiwgb3B0aW9ucyk7XG4gIGtlZXBJbnNlY3VyZShzZWxmKTtcblxuICBDb2xsZWN0aW9uMi5lbWl0KCdzY2hlbWEuYXR0YWNoZWQnLCBzZWxmLCBzcywgb3B0aW9ucyk7XG59O1xuXG5bTW9uZ28uQ29sbGVjdGlvbiwgTG9jYWxDb2xsZWN0aW9uXS5mb3JFYWNoKChvYmopID0+IHtcbiAgLyoqXG4gICAqIHNpbXBsZVNjaGVtYVxuICAgKiBAZGVzY3JpcHRpb24gZnVuY3Rpb24gZGV0ZWN0IHRoZSBjb3JyZWN0IHNjaGVtYSBieSBnaXZlbiBwYXJhbXMuIElmIGl0XG4gICAqIGRldGVjdCBtdWx0aS1zY2hlbWEgcHJlc2VuY2UgaW4gYHNlbGZgLCB0aGVuIGl0IG1hZGUgYW4gYXR0ZW1wdCB0byBmaW5kIGFcbiAgICogYHNlbGVjdG9yYCBpbiBhcmdzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkb2MgLSBJdCBjb3VsZCBiZSA8dXBkYXRlPiBvbiB1cGRhdGUvdXBzZXJ0IG9yIGRvY3VtZW50XG4gICAqIGl0c2VsZiBvbiBpbnNlcnQvcmVtb3ZlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gLSBJdCBjb3VsZCBiZSA8dXBkYXRlPiBvbiB1cGRhdGUvdXBzZXJ0IGV0Y1xuICAgKiBAcGFyYW0ge09iamVjdH0gW3F1ZXJ5XSAtIGl0IGNvdWxkIGJlIDxxdWVyeT4gb24gdXBkYXRlL3Vwc2VydFxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFNjaGVtYVxuICAgKi9cbiAgb2JqLnByb3RvdHlwZS5zaW1wbGVTY2hlbWEgPSBmdW5jdGlvbiAoZG9jLCBvcHRpb25zLCBxdWVyeSkge1xuICAgIGlmICghdGhpcy5fYzIpIHJldHVybiBudWxsO1xuICAgIGlmICh0aGlzLl9jMi5fc2ltcGxlU2NoZW1hKSByZXR1cm4gdGhpcy5fYzIuX3NpbXBsZVNjaGVtYTtcblxuICAgIHZhciBzY2hlbWFzID0gdGhpcy5fYzIuX3NpbXBsZVNjaGVtYXM7XG4gICAgaWYgKHNjaGVtYXMgJiYgc2NoZW1hcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIWRvYykgdGhyb3cgbmV3IEVycm9yKCdjb2xsZWN0aW9uLnNpbXBsZVNjaGVtYSgpIHJlcXVpcmVzIGRvYyBhcmd1bWVudCB3aGVuIHRoZXJlIGFyZSBtdWx0aXBsZSBzY2hlbWFzJyk7XG5cbiAgICAgIHZhciBzY2hlbWEsIHNlbGVjdG9yLCB0YXJnZXQ7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2NoZW1hID0gc2NoZW1hc1tpXTtcbiAgICAgICAgc2VsZWN0b3IgPSBPYmplY3Qua2V5cyhzY2hlbWEuc2VsZWN0b3IpWzBdO1xuXG4gICAgICAgIC8vIFdlIHdpbGwgc2V0IHRoaXMgdG8gdW5kZWZpbmVkIGJlY2F1c2UgaW4gdGhlb3J5IHlvdSBtaWdodCB3YW50IHRvIHNlbGVjdFxuICAgICAgICAvLyBvbiBhIG51bGwgdmFsdWUuXG4gICAgICAgIHRhcmdldCA9IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBoZXJlIHdlIGFyZSBsb29raW5nIGZvciBzZWxlY3RvciBpbiBkaWZmZXJlbnQgcGxhY2VzXG4gICAgICAgIC8vICRzZXQgc2hvdWxkIGhhdmUgbW9yZSBwcmlvcml0eSBoZXJlXG4gICAgICAgIGlmIChkb2MuJHNldCAmJiB0eXBlb2YgZG9jLiRzZXRbc2VsZWN0b3JdICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHRhcmdldCA9IGRvYy4kc2V0W3NlbGVjdG9yXTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jW3NlbGVjdG9yXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0YXJnZXQgPSBkb2Nbc2VsZWN0b3JdO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zZWxlY3Rvcikge1xuICAgICAgICAgIHRhcmdldCA9IG9wdGlvbnMuc2VsZWN0b3Jbc2VsZWN0b3JdO1xuICAgICAgICB9IGVsc2UgaWYgKHF1ZXJ5ICYmIHF1ZXJ5W3NlbGVjdG9yXSkgeyAvLyBvbiB1cHNlcnQvdXBkYXRlIG9wZXJhdGlvbnNcbiAgICAgICAgICB0YXJnZXQgPSBxdWVyeVtzZWxlY3Rvcl07XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGNvbXBhcmUgZ2l2ZW4gc2VsZWN0b3Igd2l0aCBkb2MgcHJvcGVydHkgb3Igb3B0aW9uIHRvXG4gICAgICAgIC8vIGZpbmQgcmlnaHQgc2NoZW1hXG4gICAgICAgIGlmICh0YXJnZXQgIT09IHVuZGVmaW5lZCAmJiB0YXJnZXQgPT09IHNjaGVtYS5zZWxlY3RvcltzZWxlY3Rvcl0pIHtcbiAgICAgICAgICByZXR1cm4gc2NoZW1hLnNjaGVtYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9O1xufSk7XG5cbi8vIFdyYXAgREIgd3JpdGUgb3BlcmF0aW9uIG1ldGhvZHNcblsnaW5zZXJ0JywgJ3VwZGF0ZSddLmZvckVhY2goKG1ldGhvZE5hbWUpID0+IHtcbiAgdmFyIF9zdXBlciA9IE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcywgb3B0aW9ucyxcbiAgICAgICAgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMpO1xuXG4gICAgb3B0aW9ucyA9IChtZXRob2ROYW1lID09PSBcImluc2VydFwiKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXG4gICAgLy8gU3VwcG9ydCBtaXNzaW5nIG9wdGlvbnMgYXJnXG4gICAgaWYgKCFvcHRpb25zIHx8IHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fYzIgJiYgb3B0aW9ucy5ieXBhc3NDb2xsZWN0aW9uMiAhPT0gdHJ1ZSkge1xuICAgICAgdmFyIHVzZXJJZCA9IG51bGw7XG4gICAgICB0cnkgeyAvLyBodHRwczovL2dpdGh1Yi5jb20vYWxkZWVkL21ldGVvci1jb2xsZWN0aW9uMi9pc3N1ZXMvMTc1XG4gICAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge31cblxuICAgICAgYXJncyA9IGRvVmFsaWRhdGUuY2FsbChcbiAgICAgICAgc2VsZixcbiAgICAgICAgbWV0aG9kTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgTWV0ZW9yLmlzU2VydmVyIHx8IHNlbGYuX2Nvbm5lY3Rpb24gPT09IG51bGwsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBNZXRlb3IuaXNTZXJ2ZXIgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICk7XG4gICAgICBpZiAoIWFyZ3MpIHtcbiAgICAgICAgLy8gZG9WYWxpZGF0ZSBhbHJlYWR5IGNhbGxlZCB0aGUgY2FsbGJhY2sgb3IgdGhyZXcgdGhlIGVycm9yIHNvIHdlJ3JlIGRvbmUuXG4gICAgICAgIC8vIEJ1dCBpbnNlcnQgc2hvdWxkIGFsd2F5cyByZXR1cm4gYW4gSUQgdG8gbWF0Y2ggY29yZSBiZWhhdmlvci5cbiAgICAgICAgcmV0dXJuIG1ldGhvZE5hbWUgPT09IFwiaW5zZXJ0XCIgPyBzZWxmLl9tYWtlTmV3SUQoKSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2Ugc3RpbGwgbmVlZCB0byBhZGp1c3QgYXJncyBiZWNhdXNlIGluc2VydCBkb2VzIG5vdCB0YWtlIG9wdGlvbnNcbiAgICAgIGlmIChtZXRob2ROYW1lID09PSBcImluc2VydFwiICYmIHR5cGVvZiBhcmdzWzFdICE9PSAnZnVuY3Rpb24nKSBhcmdzLnNwbGljZSgxLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3N1cGVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9O1xufSk7XG5cbi8qXG4gKiBQcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZG9WYWxpZGF0ZSh0eXBlLCBhcmdzLCBnZXRBdXRvVmFsdWVzLCB1c2VySWQsIGlzRnJvbVRydXN0ZWRDb2RlKSB7XG4gIHZhciBzZWxmID0gdGhpcywgZG9jLCBjYWxsYmFjaywgZXJyb3IsIG9wdGlvbnMsIGlzVXBzZXJ0LCBzZWxlY3RvciwgbGFzdCwgaGFzQ2FsbGJhY2s7XG5cbiAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcih0eXBlICsgXCIgcmVxdWlyZXMgYW4gYXJndW1lbnRcIik7XG4gIH1cblxuICAvLyBHYXRoZXIgYXJndW1lbnRzIGFuZCBjYWNoZSB0aGUgc2VsZWN0b3JcbiAgaWYgKHR5cGUgPT09IFwiaW5zZXJ0XCIpIHtcbiAgICBkb2MgPSBhcmdzWzBdO1xuICAgIG9wdGlvbnMgPSBhcmdzWzFdO1xuICAgIGNhbGxiYWNrID0gYXJnc1syXTtcblxuICAgIC8vIFRoZSByZWFsIGluc2VydCBkb2Vzbid0IHRha2Ugb3B0aW9uc1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmdzID0gW2RvYywgb3B0aW9uc107XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJncyA9IFtkb2MsIGNhbGxiYWNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncyA9IFtkb2NdO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSBcInVwZGF0ZVwiKSB7XG4gICAgc2VsZWN0b3IgPSBhcmdzWzBdO1xuICAgIGRvYyA9IGFyZ3NbMV07XG4gICAgb3B0aW9ucyA9IGFyZ3NbMl07XG4gICAgY2FsbGJhY2sgPSBhcmdzWzNdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgdHlwZSBhcmd1bWVudFwiKTtcbiAgfVxuXG4gIHZhciB2YWxpZGF0ZWRPYmplY3RXYXNJbml0aWFsbHlFbXB0eSA9IF8uaXNFbXB0eShkb2MpO1xuXG4gIC8vIFN1cHBvcnQgbWlzc2luZyBvcHRpb25zIGFyZ1xuICBpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGxhc3QgPSBhcmdzLmxlbmd0aCAtIDE7XG5cbiAgaGFzQ2FsbGJhY2sgPSAodHlwZW9mIGFyZ3NbbGFzdF0gPT09ICdmdW5jdGlvbicpO1xuXG4gIC8vIElmIHVwZGF0ZSB3YXMgY2FsbGVkIHdpdGggdXBzZXJ0OnRydWUsIGZsYWcgYXMgYW4gdXBzZXJ0XG4gIGlzVXBzZXJ0ID0gKHR5cGUgPT09IFwidXBkYXRlXCIgJiYgb3B0aW9ucy51cHNlcnQgPT09IHRydWUpO1xuXG4gIC8vIHdlIG5lZWQgdG8gcGFzcyBgZG9jYCBhbmQgYG9wdGlvbnNgIHRvIGBzaW1wbGVTY2hlbWFgIG1ldGhvZCwgdGhhdCdzIHdoeVxuICAvLyBzY2hlbWEgZGVjbGFyYXRpb24gbW92ZWQgaGVyZVxuICB2YXIgc2NoZW1hID0gc2VsZi5zaW1wbGVTY2hlbWEoZG9jLCBvcHRpb25zLCBzZWxlY3Rvcik7XG4gIHZhciBpc0xvY2FsQ29sbGVjdGlvbiA9IChzZWxmLl9jb25uZWN0aW9uID09PSBudWxsKTtcblxuICAvLyBPbiB0aGUgc2VydmVyIGFuZCBmb3IgbG9jYWwgY29sbGVjdGlvbnMsIHdlIGFsbG93IHBhc3NpbmcgYGdldEF1dG9WYWx1ZXM6IGZhbHNlYCB0byBkaXNhYmxlIGF1dG9WYWx1ZSBmdW5jdGlvbnNcbiAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgfHwgaXNMb2NhbENvbGxlY3Rpb24pICYmIG9wdGlvbnMuZ2V0QXV0b1ZhbHVlcyA9PT0gZmFsc2UpIHtcbiAgICBnZXRBdXRvVmFsdWVzID0gZmFsc2U7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgdmFsaWRhdGlvbiBjb250ZXh0XG4gIHZhciB2YWxpZGF0aW9uQ29udGV4dCA9IG9wdGlvbnMudmFsaWRhdGlvbkNvbnRleHQ7XG4gIGlmICh2YWxpZGF0aW9uQ29udGV4dCkge1xuICAgIGlmICh0eXBlb2YgdmFsaWRhdGlvbkNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWxpZGF0aW9uQ29udGV4dCA9IHNjaGVtYS5uYW1lZENvbnRleHQodmFsaWRhdGlvbkNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0aW9uQ29udGV4dCA9IHNjaGVtYS5uYW1lZENvbnRleHQoKTtcbiAgfVxuXG4gIC8vIEFkZCBhIGRlZmF1bHQgY2FsbGJhY2sgZnVuY3Rpb24gaWYgd2UncmUgb24gdGhlIGNsaWVudCBhbmQgbm8gY2FsbGJhY2sgd2FzIGdpdmVuXG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIWNhbGxiYWNrKSB7XG4gICAgLy8gQ2xpZW50IGNhbid0IGJsb2NrLCBzbyBpdCBjYW4ndCByZXBvcnQgZXJyb3JzIGJ5IGV4Y2VwdGlvbixcbiAgICAvLyBvbmx5IGJ5IGNhbGxiYWNrLiBJZiB0aGV5IGZvcmdldCB0aGUgY2FsbGJhY2ssIGdpdmUgdGhlbSBhXG4gICAgLy8gZGVmYXVsdCBvbmUgdGhhdCBsb2dzIHRoZSBlcnJvciwgc28gdGhleSBhcmVuJ3QgdG90YWxseVxuICAgIC8vIGJhZmZsZWQgaWYgdGhlaXIgd3JpdGVzIGRvbid0IHdvcmsgYmVjYXVzZSB0aGVpciBkYXRhYmFzZSBpc1xuICAgIC8vIGRvd24uXG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgTWV0ZW9yLl9kZWJ1Zyh0eXBlICsgXCIgZmFpbGVkOiBcIiArIChlcnIucmVhc29uIHx8IGVyci5zdGFjaykpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjbGllbnQgdmFsaWRhdGlvbiBpcyBmaW5lIG9yIGlzIHNraXBwZWQgYnV0IHRoZW4gc29tZXRoaW5nXG4gIC8vIGlzIGZvdW5kIHRvIGJlIGludmFsaWQgb24gdGhlIHNlcnZlciwgd2UgZ2V0IHRoYXQgZXJyb3IgYmFja1xuICAvLyBhcyBhIHNwZWNpYWwgTWV0ZW9yLkVycm9yIHRoYXQgd2UgbmVlZCB0byBwYXJzZS5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBoYXNDYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gYXJnc1tsYXN0XSA9IHdyYXBDYWxsYmFja0ZvclBhcnNpbmdTZXJ2ZXJFcnJvcnModmFsaWRhdGlvbkNvbnRleHQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBzY2hlbWFBbGxvd3NJZCA9IHNjaGVtYS5hbGxvd3NLZXkoXCJfaWRcIik7XG4gIGlmICh0eXBlID09PSBcImluc2VydFwiICYmICFkb2MuX2lkICYmIHNjaGVtYUFsbG93c0lkKSB7XG4gICAgZG9jLl9pZCA9IHNlbGYuX21ha2VOZXdJRCgpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBkb2NJZCBmb3IgcGFzc2luZyBpbiB0aGUgYXV0b1ZhbHVlL2N1c3RvbSBjb250ZXh0XG4gIHZhciBkb2NJZDtcbiAgaWYgKHR5cGUgPT09ICdpbnNlcnQnKSB7XG4gICAgZG9jSWQgPSBkb2MuX2lkOyAvLyBtaWdodCBiZSB1bmRlZmluZWRcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcInVwZGF0ZVwiICYmIHNlbGVjdG9yKSB7XG4gICAgZG9jSWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnIHx8IHNlbGVjdG9yIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQgPyBzZWxlY3RvciA6IHNlbGVjdG9yLl9pZDtcbiAgfVxuXG4gIC8vIElmIF9pZCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkLCByZW1vdmUgaXQgdGVtcG9yYXJpbHkgaWYgaXQnc1xuICAvLyBub3QgZXhwbGljaXRseSBkZWZpbmVkIGluIHRoZSBzY2hlbWEuXG4gIHZhciBjYWNoZWRJZDtcbiAgaWYgKGRvYy5faWQgJiYgIXNjaGVtYUFsbG93c0lkKSB7XG4gICAgY2FjaGVkSWQgPSBkb2MuX2lkO1xuICAgIGRlbGV0ZSBkb2MuX2lkO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9DbGVhbihkb2NUb0NsZWFuLCBnZXRBdXRvVmFsdWVzLCBmaWx0ZXIsIGF1dG9Db252ZXJ0LCByZW1vdmVFbXB0eVN0cmluZ3MsIHRyaW1TdHJpbmdzKSB7XG4gICAgLy8gQ2xlYW4gdGhlIGRvYy9tb2RpZmllciBpbiBwbGFjZVxuICAgIHNjaGVtYS5jbGVhbihkb2NUb0NsZWFuLCB7XG4gICAgICBtdXRhdGU6IHRydWUsXG4gICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgIGF1dG9Db252ZXJ0OiBhdXRvQ29udmVydCxcbiAgICAgIGdldEF1dG9WYWx1ZXM6IGdldEF1dG9WYWx1ZXMsXG4gICAgICBpc01vZGlmaWVyOiAodHlwZSAhPT0gXCJpbnNlcnRcIiksXG4gICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IHJlbW92ZUVtcHR5U3RyaW5ncyxcbiAgICAgIHRyaW1TdHJpbmdzOiB0cmltU3RyaW5ncyxcbiAgICAgIGV4dGVuZEF1dG9WYWx1ZUNvbnRleHQ6IF8uZXh0ZW5kKHtcbiAgICAgICAgaXNJbnNlcnQ6ICh0eXBlID09PSBcImluc2VydFwiKSxcbiAgICAgICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICAgICAgaXNVcHNlcnQ6IGlzVXBzZXJ0LFxuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGlzRnJvbVRydXN0ZWRDb2RlLFxuICAgICAgICBkb2NJZDogZG9jSWQsXG4gICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgfSwgb3B0aW9ucy5leHRlbmRBdXRvVmFsdWVDb250ZXh0IHx8IHt9KVxuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJlbGltaW5hcnkgY2xlYW5pbmcgb24gYm90aCBjbGllbnQgYW5kIHNlcnZlci4gT24gdGhlIHNlcnZlciBhbmQgZm9yIGxvY2FsXG4gIC8vIGNvbGxlY3Rpb25zLCBhdXRvbWF0aWMgdmFsdWVzIHdpbGwgYWxzbyBiZSBzZXQgYXQgdGhpcyBwb2ludC5cbiAgZG9DbGVhbihcbiAgICBkb2MsXG4gICAgZ2V0QXV0b1ZhbHVlcyxcbiAgICBvcHRpb25zLmZpbHRlciAhPT0gZmFsc2UsXG4gICAgb3B0aW9ucy5hdXRvQ29udmVydCAhPT0gZmFsc2UsXG4gICAgb3B0aW9ucy5yZW1vdmVFbXB0eVN0cmluZ3MgIT09IGZhbHNlLFxuICAgIG9wdGlvbnMudHJpbVN0cmluZ3MgIT09IGZhbHNlXG4gICk7XG5cbiAgLy8gV2UgY2xvbmUgYmVmb3JlIHZhbGlkYXRpbmcgYmVjYXVzZSBpbiBzb21lIGNhc2VzIHdlIG5lZWQgdG8gYWRqdXN0IHRoZVxuICAvLyBvYmplY3QgYSBiaXQgYmVmb3JlIHZhbGlkYXRpbmcgaXQuIElmIHdlIGFkanVzdGVkIGBkb2NgIGl0c2VsZiwgb3VyXG4gIC8vIGNoYW5nZXMgd291bGQgcGVyc2lzdCBpbnRvIHRoZSBkYXRhYmFzZS5cbiAgdmFyIGRvY1RvVmFsaWRhdGUgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBkb2MpIHtcbiAgICAvLyBXZSBvbWl0IHByb3RvdHlwZSBwcm9wZXJ0aWVzIHdoZW4gY2xvbmluZyBiZWNhdXNlIHRoZXkgd2lsbCBub3QgYmUgdmFsaWRcbiAgICAvLyBhbmQgbW9uZ28gb21pdHMgdGhlbSB3aGVuIHNhdmluZyB0byB0aGUgZGF0YWJhc2UgYW55d2F5LlxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZG9jLCBwcm9wKSkge1xuICAgICAgZG9jVG9WYWxpZGF0ZVtwcm9wXSA9IGRvY1twcm9wXTtcbiAgICB9XG4gIH1cblxuICAvLyBPbiB0aGUgc2VydmVyLCB1cHNlcnRzIGFyZSBwb3NzaWJsZTsgU2ltcGxlU2NoZW1hIGhhbmRsZXMgdXBzZXJ0cyBwcmV0dHlcbiAgLy8gd2VsbCBieSBkZWZhdWx0LCBidXQgaXQgd2lsbCBub3Qga25vdyBhYm91dCB0aGUgZmllbGRzIGluIHRoZSBzZWxlY3RvcixcbiAgLy8gd2hpY2ggYXJlIGFsc28gc3RvcmVkIGluIHRoZSBkYXRhYmFzZSBpZiBhbiBpbnNlcnQgaXMgcGVyZm9ybWVkLiBTbyB3ZVxuICAvLyB3aWxsIGFsbG93IHRoZXNlIGZpZWxkcyB0byBiZSBjb25zaWRlcmVkIGZvciB2YWxpZGF0aW9uIGJ5IGFkZGluZyB0aGVtXG4gIC8vIHRvIHRoZSAkc2V0IGluIHRoZSBtb2RpZmllci4gVGhpcyBpcyBubyBkb3VidCBwcm9uZSB0byBlcnJvcnMsIGJ1dCB0aGVyZVxuICAvLyBwcm9iYWJseSBpc24ndCBhbnkgYmV0dGVyIHdheSByaWdodCBub3cuXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgaXNVcHNlcnQgJiYgXy5pc09iamVjdChzZWxlY3RvcikpIHtcbiAgICB2YXIgc2V0ID0gZG9jVG9WYWxpZGF0ZS4kc2V0IHx8IHt9O1xuXG4gICAgLy8gSWYgc2VsZWN0b3IgdXNlcyAkYW5kIGZvcm1hdCwgY29udmVydCB0byBwbGFpbiBvYmplY3Qgc2VsZWN0b3JcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rvci4kYW5kKSkge1xuICAgICAgY29uc3QgcGxhaW5TZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3IuJGFuZC5mb3JFYWNoKHNlbCA9PiB7XG4gICAgICAgIF8uZXh0ZW5kKHBsYWluU2VsZWN0b3IsIHNlbCk7XG4gICAgICB9KTtcbiAgICAgIGRvY1RvVmFsaWRhdGUuJHNldCA9IHBsYWluU2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY1RvVmFsaWRhdGUuJHNldCA9IF8uY2xvbmUoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIGlmICghc2NoZW1hQWxsb3dzSWQpIGRlbGV0ZSBkb2NUb1ZhbGlkYXRlLiRzZXQuX2lkO1xuICAgIF8uZXh0ZW5kKGRvY1RvVmFsaWRhdGUuJHNldCwgc2V0KTtcbiAgfVxuXG4gIC8vIFNldCBhdXRvbWF0aWMgdmFsdWVzIGZvciB2YWxpZGF0aW9uIG9uIHRoZSBjbGllbnQuXG4gIC8vIE9uIHRoZSBzZXJ2ZXIsIHdlIGFscmVhZHkgdXBkYXRlZCBkb2Mgd2l0aCBhdXRvIHZhbHVlcywgYnV0IG9uIHRoZSBjbGllbnQsXG4gIC8vIHdlIHdpbGwgYWRkIHRoZW0gdG8gZG9jVG9WYWxpZGF0ZSBmb3IgdmFsaWRhdGlvbiBwdXJwb3NlcyBvbmx5LlxuICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2Ugd2FudCBhbGwgYWN0dWFsIHZhbHVlcyBnZW5lcmF0ZWQgb24gdGhlIHNlcnZlci5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhaXNMb2NhbENvbGxlY3Rpb24pIHtcbiAgICBkb0NsZWFuKGRvY1RvVmFsaWRhdGUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIC8vIFhYWCBNYXliZSBtb3ZlIHRoaXMgaW50byBTaW1wbGVTY2hlbWFcbiAgaWYgKCF2YWxpZGF0ZWRPYmplY3RXYXNJbml0aWFsbHlFbXB0eSAmJiBfLmlzRW1wdHkoZG9jVG9WYWxpZGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FmdGVyIGZpbHRlcmluZyBvdXQga2V5cyBub3QgaW4gdGhlIHNjaGVtYSwgeW91ciAnICtcbiAgICAgICh0eXBlID09PSAndXBkYXRlJyA/ICdtb2RpZmllcicgOiAnb2JqZWN0JykgK1xuICAgICAgJyBpcyBub3cgZW1wdHknKTtcbiAgfVxuXG4gIC8vIFZhbGlkYXRlIGRvY1xuICB2YXIgaXNWYWxpZDtcbiAgaWYgKG9wdGlvbnMudmFsaWRhdGUgPT09IGZhbHNlKSB7XG4gICAgaXNWYWxpZCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaXNWYWxpZCA9IHZhbGlkYXRpb25Db250ZXh0LnZhbGlkYXRlKGRvY1RvVmFsaWRhdGUsIHtcbiAgICAgIG1vZGlmaWVyOiAodHlwZSA9PT0gXCJ1cGRhdGVcIiB8fCB0eXBlID09PSBcInVwc2VydFwiKSxcbiAgICAgIHVwc2VydDogaXNVcHNlcnQsXG4gICAgICBleHRlbmRlZEN1c3RvbUNvbnRleHQ6IF8uZXh0ZW5kKHtcbiAgICAgICAgaXNJbnNlcnQ6ICh0eXBlID09PSBcImluc2VydFwiKSxcbiAgICAgICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICAgICAgaXNVcHNlcnQ6IGlzVXBzZXJ0LFxuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGlzRnJvbVRydXN0ZWRDb2RlLFxuICAgICAgICBkb2NJZDogZG9jSWQsXG4gICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgfSwgb3B0aW9ucy5leHRlbmRlZEN1c3RvbUNvbnRleHQgfHwge30pXG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXNWYWxpZCkge1xuICAgIC8vIEFkZCB0aGUgSUQgYmFja1xuICAgIGlmIChjYWNoZWRJZCkge1xuICAgICAgZG9jLl9pZCA9IGNhY2hlZElkO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJncyB0byByZWZsZWN0IHRoZSBjbGVhbmVkIGRvY1xuICAgIC8vIFhYWCBub3Qgc3VyZSB0aGlzIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBtdXRhdGVcbiAgICBpZiAodHlwZSA9PT0gXCJpbnNlcnRcIikge1xuICAgICAgYXJnc1swXSA9IGRvYztcbiAgICB9IGVsc2Uge1xuICAgICAgYXJnc1sxXSA9IGRvYztcbiAgICB9XG5cbiAgICAvLyBJZiBjYWxsYmFjaywgc2V0IGludmFsaWRLZXkgd2hlbiB3ZSBnZXQgYSBtb25nbyB1bmlxdWUgZXJyb3JcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIGhhc0NhbGxiYWNrKSB7XG4gICAgICBhcmdzW2xhc3RdID0gd3JhcENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgYXJnc1tsYXN0XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3M7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCwgYGluICR7c2VsZi5fbmFtZX0gJHt0eXBlfWApO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgLy8gaW5zZXJ0L3VwZGF0ZS91cHNlcnQgcGFzcyBgZmFsc2VgIHdoZW4gdGhlcmUncyBhbiBlcnJvciwgc28gd2UgZG8gdGhhdFxuICAgICAgY2FsbGJhY2soZXJyb3IsIGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldEVycm9yT2JqZWN0KGNvbnRleHQsIGFwcGVuZFRvTWVzc2FnZSA9ICcnKSB7XG4gIGxldCBtZXNzYWdlO1xuICBjb25zdCBpbnZhbGlkS2V5cyA9ICh0eXBlb2YgY29udGV4dC52YWxpZGF0aW9uRXJyb3JzID09PSAnZnVuY3Rpb24nKSA/IGNvbnRleHQudmFsaWRhdGlvbkVycm9ycygpIDogY29udGV4dC5pbnZhbGlkS2V5cygpO1xuICBpZiAoaW52YWxpZEtleXMubGVuZ3RoKSB7XG4gICAgY29uc3QgZmlyc3RFcnJvcktleSA9IGludmFsaWRLZXlzWzBdLm5hbWU7XG4gICAgY29uc3QgZmlyc3RFcnJvck1lc3NhZ2UgPSBjb250ZXh0LmtleUVycm9yTWVzc2FnZShmaXJzdEVycm9yS2V5KTtcblxuICAgIC8vIElmIHRoZSBlcnJvciBpcyBpbiBhIG5lc3RlZCBrZXksIGFkZCB0aGUgZnVsbCBrZXkgdG8gdGhlIGVycm9yIG1lc3NhZ2VcbiAgICAvLyB0byBiZSBtb3JlIGhlbHBmdWwuXG4gICAgaWYgKGZpcnN0RXJyb3JLZXkuaW5kZXhPZignLicpID09PSAtMSkge1xuICAgICAgbWVzc2FnZSA9IGZpcnN0RXJyb3JNZXNzYWdlO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlID0gYCR7Zmlyc3RFcnJvck1lc3NhZ2V9ICgke2ZpcnN0RXJyb3JLZXl9KWA7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG1lc3NhZ2UgPSBcIkZhaWxlZCB2YWxpZGF0aW9uXCI7XG4gIH1cbiAgbWVzc2FnZSA9IGAke21lc3NhZ2V9ICR7YXBwZW5kVG9NZXNzYWdlfWAudHJpbSgpO1xuICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgZXJyb3IuaW52YWxpZEtleXMgPSBpbnZhbGlkS2V5cztcbiAgZXJyb3IudmFsaWRhdGlvbkNvbnRleHQgPSBjb250ZXh0O1xuICAvLyBJZiBvbiB0aGUgc2VydmVyLCB3ZSBhZGQgYSBzYW5pdGl6ZWQgZXJyb3IsIHRvbywgaW4gY2FzZSB3ZSdyZVxuICAvLyBjYWxsZWQgZnJvbSBhIG1ldGhvZC5cbiAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIGVycm9yLnNhbml0aXplZEVycm9yID0gbmV3IE1ldGVvci5FcnJvcig0MDAsIG1lc3NhZ2UsIEVKU09OLnN0cmluZ2lmeShlcnJvci5pbnZhbGlkS2V5cykpO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gYWRkVW5pcXVlRXJyb3IoY29udGV4dCwgZXJyb3JNZXNzYWdlKSB7XG4gIHZhciBuYW1lID0gZXJyb3JNZXNzYWdlLnNwbGl0KCdjMl8nKVsxXS5zcGxpdCgnICcpWzBdO1xuICB2YXIgdmFsID0gZXJyb3JNZXNzYWdlLnNwbGl0KCdkdXAga2V5OicpWzFdLnNwbGl0KCdcIicpWzFdO1xuXG4gIHZhciBhZGRWYWxpZGF0aW9uRXJyb3JzUHJvcE5hbWUgPSAodHlwZW9mIGNvbnRleHQuYWRkVmFsaWRhdGlvbkVycm9ycyA9PT0gJ2Z1bmN0aW9uJykgPyAnYWRkVmFsaWRhdGlvbkVycm9ycycgOiAnYWRkSW52YWxpZEtleXMnO1xuICBjb250ZXh0W2FkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZV0oW3tcbiAgICBuYW1lOiBuYW1lLFxuICAgIHR5cGU6ICdub3RVbmlxdWUnLFxuICAgIHZhbHVlOiB2YWxcbiAgfV0pO1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2tGb3JQYXJzaW5nTW9uZ29WYWxpZGF0aW9uRXJyb3JzKHZhbGlkYXRpb25Db250ZXh0LCBjYikge1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyhlcnJvcikge1xuICAgIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgaWYgKGVycm9yICYmXG4gICAgICAgICgoZXJyb3IubmFtZSA9PT0gXCJNb25nb0Vycm9yXCIgJiYgZXJyb3IuY29kZSA9PT0gMTEwMDEpIHx8IGVycm9yLm1lc3NhZ2UuaW5kZXhPZignTW9uZ29FcnJvcjogRTExMDAwJyAhPT0gLTEpKSAmJlxuICAgICAgICBlcnJvci5tZXNzYWdlLmluZGV4T2YoJ2MyXycpICE9PSAtMSkge1xuICAgICAgYWRkVW5pcXVlRXJyb3IodmFsaWRhdGlvbkNvbnRleHQsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgYXJnc1swXSA9IGdldEVycm9yT2JqZWN0KHZhbGlkYXRpb25Db250ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNiLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xufVxuXG5mdW5jdGlvbiB3cmFwQ2FsbGJhY2tGb3JQYXJzaW5nU2VydmVyRXJyb3JzKHZhbGlkYXRpb25Db250ZXh0LCBjYikge1xuICB2YXIgYWRkVmFsaWRhdGlvbkVycm9yc1Byb3BOYW1lID0gKHR5cGVvZiB2YWxpZGF0aW9uQ29udGV4dC5hZGRWYWxpZGF0aW9uRXJyb3JzID09PSAnZnVuY3Rpb24nKSA/ICdhZGRWYWxpZGF0aW9uRXJyb3JzJyA6ICdhZGRJbnZhbGlkS2V5cyc7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkQ2FsbGJhY2tGb3JQYXJzaW5nU2VydmVyRXJyb3JzKGVycm9yKSB7XG4gICAgdmFyIGFyZ3MgPSBfLnRvQXJyYXkoYXJndW1lbnRzKTtcbiAgICAvLyBIYW5kbGUgb3VyIG93biB2YWxpZGF0aW9uIGVycm9yc1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIE1ldGVvci5FcnJvciAmJlxuICAgICAgICBlcnJvci5lcnJvciA9PT0gNDAwICYmXG4gICAgICAgIGVycm9yLnJlYXNvbiA9PT0gXCJJTlZBTElEXCIgJiZcbiAgICAgICAgdHlwZW9mIGVycm9yLmRldGFpbHMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHZhciBpbnZhbGlkS2V5c0Zyb21TZXJ2ZXIgPSBFSlNPTi5wYXJzZShlcnJvci5kZXRhaWxzKTtcbiAgICAgIHZhbGlkYXRpb25Db250ZXh0W2FkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZV0oaW52YWxpZEtleXNGcm9tU2VydmVyKTtcbiAgICAgIGFyZ3NbMF0gPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgfVxuICAgIC8vIEhhbmRsZSBNb25nbyB1bmlxdWUgaW5kZXggZXJyb3JzLCB3aGljaCBhcmUgZm9yd2FyZGVkIHRvIHRoZSBjbGllbnQgYXMgNDA5IGVycm9yc1xuICAgIGVsc2UgaWYgKGVycm9yIGluc3RhbmNlb2YgTWV0ZW9yLkVycm9yICYmXG4gICAgICAgICAgICAgZXJyb3IuZXJyb3IgPT09IDQwOSAmJlxuICAgICAgICAgICAgIGVycm9yLnJlYXNvbiAmJlxuICAgICAgICAgICAgIGVycm9yLnJlYXNvbi5pbmRleE9mKCdFMTEwMDAnKSAhPT0gLTEgJiZcbiAgICAgICAgICAgICBlcnJvci5yZWFzb24uaW5kZXhPZignYzJfJykgIT09IC0xKSB7XG4gICAgICBhZGRVbmlxdWVFcnJvcih2YWxpZGF0aW9uQ29udGV4dCwgZXJyb3IucmVhc29uKTtcbiAgICAgIGFyZ3NbMF0gPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjYi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cblxudmFyIGFscmVhZHlJbnNlY3VyZWQgPSB7fTtcbmZ1bmN0aW9uIGtlZXBJbnNlY3VyZShjKSB7XG4gIC8vIElmIGluc2VjdXJlIHBhY2thZ2UgaXMgaW4gdXNlLCB3ZSBuZWVkIHRvIGFkZCBhbGxvdyBydWxlcyB0aGF0IHJldHVyblxuICAvLyB0cnVlLiBPdGhlcndpc2UsIGl0IHdvdWxkIHNlZW1pbmdseSB0dXJuIG9mZiBpbnNlY3VyZSBtb2RlLlxuICBpZiAoUGFja2FnZSAmJiBQYWNrYWdlLmluc2VjdXJlICYmICFhbHJlYWR5SW5zZWN1cmVkW2MuX25hbWVdKSB7XG4gICAgYy5hbGxvdyh7XG4gICAgICBpbnNlcnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgZmV0Y2g6IFtdLFxuICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgfSk7XG4gICAgYWxyZWFkeUluc2VjdXJlZFtjLl9uYW1lXSA9IHRydWU7XG4gIH1cbiAgLy8gSWYgaW5zZWN1cmUgcGFja2FnZSBpcyBOT1QgaW4gdXNlLCB0aGVuIGFkZGluZyB0aGUgdHdvIGRlbnkgZnVuY3Rpb25zXG4gIC8vIGRvZXMgbm90IGhhdmUgYW55IGVmZmVjdCBvbiB0aGUgbWFpbiBhcHAncyBzZWN1cml0eSBwYXJhZGlnbS4gVGhlXG4gIC8vIHVzZXIgd2lsbCBzdGlsbCBiZSByZXF1aXJlZCB0byBhZGQgYXQgbGVhc3Qgb25lIGFsbG93IGZ1bmN0aW9uIG9mIGhlclxuICAvLyBvd24gZm9yIGVhY2ggb3BlcmF0aW9uIGZvciB0aGlzIGNvbGxlY3Rpb24uIEFuZCB0aGUgdXNlciBtYXkgc3RpbGwgYWRkXG4gIC8vIGFkZGl0aW9uYWwgZGVueSBmdW5jdGlvbnMsIGJ1dCBkb2VzIG5vdCBoYXZlIHRvLlxufVxuXG52YXIgYWxyZWFkeURlZmluZWQgPSB7fTtcbmZ1bmN0aW9uIGRlZmluZURlbnkoYywgb3B0aW9ucykge1xuICBpZiAoIWFscmVhZHlEZWZpbmVkW2MuX25hbWVdKSB7XG5cbiAgICB2YXIgaXNMb2NhbENvbGxlY3Rpb24gPSAoYy5fY29ubmVjdGlvbiA9PT0gbnVsbCk7XG5cbiAgICAvLyBGaXJzdCBkZWZpbmUgZGVueSBmdW5jdGlvbnMgdG8gZXh0ZW5kIGRvYyB3aXRoIHRoZSByZXN1bHRzIG9mIGNsZWFuXG4gICAgLy8gYW5kIGF1dG92YWx1ZXMuIFRoaXMgbXVzdCBiZSBkb25lIHdpdGggXCJ0cmFuc2Zvcm06IG51bGxcIiBvciB3ZSB3b3VsZCBiZVxuICAgIC8vIGV4dGVuZGluZyBhIGNsb25lIG9mIGRvYyBhbmQgdGhlcmVmb3JlIGhhdmUgbm8gZWZmZWN0LlxuICAgIGMuZGVueSh7XG4gICAgICBpbnNlcnQ6IGZ1bmN0aW9uKHVzZXJJZCwgZG9jKSB7XG4gICAgICAgIC8vIFJlZmVyZW5jZWQgZG9jIGlzIGNsZWFuZWQgaW4gcGxhY2VcbiAgICAgICAgYy5zaW1wbGVTY2hlbWEoZG9jKS5jbGVhbihkb2MsIHtcbiAgICAgICAgICBtdXRhdGU6IHRydWUsXG4gICAgICAgICAgaXNNb2RpZmllcjogZmFsc2UsXG4gICAgICAgICAgLy8gV2UgZG9uJ3QgZG8gdGhlc2UgaGVyZSBiZWNhdXNlIHRoZXkgYXJlIGRvbmUgb24gdGhlIGNsaWVudCBpZiBkZXNpcmVkXG4gICAgICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgZXh0ZW5kQXV0b1ZhbHVlQ29udGV4dDoge1xuICAgICAgICAgICAgaXNJbnNlcnQ6IHRydWUsXG4gICAgICAgICAgICBpc1VwZGF0ZTogZmFsc2UsXG4gICAgICAgICAgICBpc1Vwc2VydDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGlzRnJvbVRydXN0ZWRDb2RlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvY0lkOiBkb2MuX2lkLFxuICAgICAgICAgICAgaXNMb2NhbENvbGxlY3Rpb246IGlzTG9jYWxDb2xsZWN0aW9uXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGRzLCBtb2RpZmllcikge1xuICAgICAgICAvLyBSZWZlcmVuY2VkIG1vZGlmaWVyIGlzIGNsZWFuZWQgaW4gcGxhY2VcbiAgICAgICAgYy5zaW1wbGVTY2hlbWEobW9kaWZpZXIpLmNsZWFuKG1vZGlmaWVyLCB7XG4gICAgICAgICAgbXV0YXRlOiB0cnVlLFxuICAgICAgICAgIGlzTW9kaWZpZXI6IHRydWUsXG4gICAgICAgICAgLy8gV2UgZG9uJ3QgZG8gdGhlc2UgaGVyZSBiZWNhdXNlIHRoZXkgYXJlIGRvbmUgb24gdGhlIGNsaWVudCBpZiBkZXNpcmVkXG4gICAgICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2UsXG4gICAgICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgZXh0ZW5kQXV0b1ZhbHVlQ29udGV4dDoge1xuICAgICAgICAgICAgaXNJbnNlcnQ6IGZhbHNlLFxuICAgICAgICAgICAgaXNVcGRhdGU6IHRydWUsXG4gICAgICAgICAgICBpc1Vwc2VydDogZmFsc2UsXG4gICAgICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgICAgIGlzRnJvbVRydXN0ZWRDb2RlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvY0lkOiBkb2MgJiYgZG9jLl9pZCxcbiAgICAgICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIGZldGNoOiBbJ19pZCddLFxuICAgICAgdHJhbnNmb3JtOiBudWxsXG4gICAgfSk7XG5cbiAgICAvLyBTZWNvbmQgZGVmaW5lIGRlbnkgZnVuY3Rpb25zIHRvIHZhbGlkYXRlIGFnYWluIG9uIHRoZSBzZXJ2ZXJcbiAgICAvLyBmb3IgY2xpZW50LWluaXRpYXRlZCBpbnNlcnRzIGFuZCB1cGRhdGVzLiBUaGVzZSBzaG91bGQgYmVcbiAgICAvLyBjYWxsZWQgYWZ0ZXIgdGhlIGNsZWFuL2F1dG92YWx1ZSBmdW5jdGlvbnMgc2luY2Ugd2UncmUgYWRkaW5nXG4gICAgLy8gdGhlbSBhZnRlci4gVGhlc2UgbXVzdCAqbm90KiBoYXZlIFwidHJhbnNmb3JtOiBudWxsXCIgaWYgb3B0aW9ucy50cmFuc2Zvcm0gaXMgdHJ1ZSBiZWNhdXNlXG4gICAgLy8gd2UgbmVlZCB0byBwYXNzIHRoZSBkb2MgdGhyb3VnaCBhbnkgdHJhbnNmb3JtcyB0byBiZSBzdXJlXG4gICAgLy8gdGhhdCBjdXN0b20gdHlwZXMgYXJlIHByb3Blcmx5IHJlY29nbml6ZWQgZm9yIHR5cGUgdmFsaWRhdGlvbi5cbiAgICBjLmRlbnkoXy5leHRlbmQoe1xuICAgICAgaW5zZXJ0OiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICAvLyBXZSBwYXNzIHRoZSBmYWxzZSBvcHRpb25zIGJlY2F1c2Ugd2Ugd2lsbCBoYXZlIGRvbmUgdGhlbSBvbiBjbGllbnQgaWYgZGVzaXJlZFxuICAgICAgICBkb1ZhbGlkYXRlLmNhbGwoXG4gICAgICAgICAgYyxcbiAgICAgICAgICBcImluc2VydFwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIGRvYyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0lOVkFMSUQnLCBFSlNPTi5zdHJpbmdpZnkoZXJyb3IuaW52YWxpZEtleXMpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmFsc2UsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgZmFsc2UgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbih1c2VySWQsIGRvYywgZmllbGRzLCBtb2RpZmllcikge1xuICAgICAgICAvLyBOT1RFOiBUaGlzIHdpbGwgbmV2ZXIgYmUgYW4gdXBzZXJ0IGJlY2F1c2UgY2xpZW50LXNpZGUgdXBzZXJ0c1xuICAgICAgICAvLyBhcmUgbm90IGFsbG93ZWQgb25jZSB5b3UgZGVmaW5lIGFsbG93L2RlbnkgZnVuY3Rpb25zLlxuICAgICAgICAvLyBXZSBwYXNzIHRoZSBmYWxzZSBvcHRpb25zIGJlY2F1c2Ugd2Ugd2lsbCBoYXZlIGRvbmUgdGhlbSBvbiBjbGllbnQgaWYgZGVzaXJlZFxuICAgICAgICBkb1ZhbGlkYXRlLmNhbGwoXG4gICAgICAgICAgYyxcbiAgICAgICAgICBcInVwZGF0ZVwiLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHtfaWQ6IGRvYyAmJiBkb2MuX2lkfSxcbiAgICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0cmltU3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgICAgICAgIGF1dG9Db252ZXJ0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCAnSU5WQUxJRCcsIEVKU09OLnN0cmluZ2lmeShlcnJvci5pbnZhbGlkS2V5cykpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgXSxcbiAgICAgICAgICBmYWxzZSwgLy8gZ2V0QXV0b1ZhbHVlc1xuICAgICAgICAgIHVzZXJJZCxcbiAgICAgICAgICBmYWxzZSAvLyBpc0Zyb21UcnVzdGVkQ29kZVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBmZXRjaDogWydfaWQnXVxuICAgIH0sIG9wdGlvbnMudHJhbnNmb3JtID09PSB0cnVlID8ge30gOiB7dHJhbnNmb3JtOiBudWxsfSkpO1xuXG4gICAgLy8gbm90ZSB0aGF0IHdlJ3ZlIGFscmVhZHkgZG9uZSB0aGlzIGNvbGxlY3Rpb24gc28gdGhhdCB3ZSBkb24ndCBkbyBpdCBhZ2FpblxuICAgIC8vIGlmIGF0dGFjaFNjaGVtYSBpcyBjYWxsZWQgYWdhaW5cbiAgICBhbHJlYWR5RGVmaW5lZFtjLl9uYW1lXSA9IHRydWU7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29sbGVjdGlvbjI7XG4iXX0=
