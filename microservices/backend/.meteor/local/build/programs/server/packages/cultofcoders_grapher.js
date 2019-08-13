(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var _ = Package.underscore._;
var Promise = Package.promise.Promise;
var check = Package.check.check;
var Match = Package.check.Match;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var enableDebugLogging = Package['reywood:publish-composite'].enableDebugLogging;
var publishComposite = Package['reywood:publish-composite'].publishComposite;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;

/* Package-scope variables */
var key, ids, what, metadata, params, body, cacher, dotize;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher":{"main.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/main.server.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  NamedQueryStore: () => NamedQueryStore,
  LinkConstants: () => LinkConstants
});
module.link("./lib/extension.js");
module.link("./lib/aggregate");
module.link("./lib/exposure/extension.js");
module.link("./lib/links/extension.js");
module.link("./lib/query/reducers/extension.js");
module.link("./lib/namedQuery/expose/extension.js");
let NamedQueryStore;
module.link("./lib/namedQuery/store", {
  default(v) {
    NamedQueryStore = v;
  }

}, 0);
let LinkConstants;
module.link("./lib/links/constants", {
  default(v) {
    LinkConstants = v;
  }

}, 1);
module.link("./lib/createQuery.js", {
  default: "createQuery"
}, 2);
module.link("./lib/namedQuery/namedQuery.server", {
  default: "NamedQuery"
}, 3);
module.link("./lib/exposure/exposure.js", {
  default: "Exposure"
}, 4);
module.link("./lib/namedQuery/cache/MemoryResultCacher", {
  default: "MemoryResultCacher"
}, 5);
module.link("./lib/namedQuery/cache/BaseResultCacher", {
  default: "BaseResultCacher"
}, 6);
module.link("./lib/compose", {
  default: "compose"
}, 7);
module.link("./lib/graphql", {
  "*": "*"
}, 8);
module.link("./lib/db", {
  default: "db"
}, 9);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aggregate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/aggregate.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Promise;
module.link("meteor/promise", {
  Promise(v) {
    Promise = v;
  }

}, 0);

Mongo.Collection.prototype.aggregate = function (pipelines, options = {}) {
  const coll = this.rawCollection();
  let result = Meteor.wrapAsync(coll.aggregate, coll)(pipelines, options); // We need to check If it's an AggregationCursor
  // The reason we do this was because of the upgrade to 1.7 which involved a mongodb driver update

  if (Array.isArray(result)) {
    return result;
  } else {
    return Promise.await(result.toArray());
  }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"compose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/compose.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let deepExtend;
module.link("deep-extend", {
  default(v) {
    deepExtend = v;
  }

}, 0);
module.exportDefault(function (...args) {
  return deepExtend({}, ...args);
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/createQuery.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Query;
module.link("./query/query.js", {
  default(v) {
    Query = v;
  }

}, 0);
let NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 1);
let NamedQueryStore;
module.link("./namedQuery/store.js", {
  default(v) {
    NamedQueryStore = v;
  }

}, 2);
module.exportDefault((...args) => {
  if (typeof args[0] === 'string') {
    let [name, body, options] = args;
    options = options || {}; // It's a resolver query

    if (_.isFunction(body)) {
      return createNamedQuery(name, null, body, options);
    }

    const entryPointName = _.first(_.keys(body));

    const collection = Mongo.Collection.get(entryPointName);

    if (!collection) {
      throw new Meteor.Error('invalid-name', `We could not find any collection with the name "${entryPointName}". Make sure it is imported prior to using this`);
    }

    return createNamedQuery(name, collection, body[entryPointName], options);
  } else {
    // Query Creation, it can have an endpoint as collection or as a NamedQuery
    let [body, options] = args;
    options = options || {};

    const entryPointName = _.first(_.keys(body));

    const collection = Mongo.Collection.get(entryPointName);

    if (!collection) {
      if (Meteor.isDevelopment && !NamedQueryStore.get(entryPointName)) {
        console.warn(`You are creating a query with the entry point "${entryPointName}", but there was no collection found for it (maybe you forgot to import it client-side?). It's assumed that it's referencing a NamedQuery.`);
      }

      return createNamedQuery(entryPointName, null, {}, {
        params: body[entryPointName]
      });
    } else {
      return createNormalQuery(collection, body[entryPointName], options);
    }
  }
});

function createNamedQuery(name, collection, body, options = {}) {
  // if it exists already, we re-use it
  const namedQuery = NamedQueryStore.get(name);
  let query;

  if (!namedQuery) {
    query = new NamedQuery(name, collection, body, options);
    NamedQueryStore.add(name, query);
  } else {
    query = namedQuery.clone(options.params);
  }

  return query;
}

function createNormalQuery(collection, body, options) {
  return new Query(collection, body, options);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"db.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/db.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
const db = new Proxy({}, {
  get: function (obj, prop) {
    if (typeof prop === 'symbol') {
      return obj[prop];
    }

    const collection = Mongo.Collection.get(prop);

    if (!collection) {
      return obj[prop];
    }

    return collection;
  }
});
module.exportDefault(db);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/extension.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Query;
module.link("./query/query.js", {
  default(v) {
    Query = v;
  }

}, 0);
let NamedQuery;
module.link("./namedQuery/namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 1);
let NamedQueryStore;
module.link("./namedQuery/store.js", {
  default(v) {
    NamedQueryStore = v;
  }

}, 2);

_.extend(Mongo.Collection.prototype, {
  createQuery(...args) {
    if (args.length === 0) {
      return new Query(this, {}, {});
    }

    if (typeof args[0] === 'string') {
      //NamedQuery
      const [name, body, options] = args;
      const query = new NamedQuery(name, this, body, options);
      NamedQueryStore.add(name, query);
      return query;
    } else {
      const [body, options] = args;
      return new Query(this, body, options);
    }
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure":{"exposure.config.schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/exposure.config.schema.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  ExposureDefaults: () => ExposureDefaults,
  ExposureSchema: () => ExposureSchema,
  validateBody: () => validateBody
});
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 0);
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 1);
const ExposureDefaults = {
  blocking: false,
  method: true,
  publication: true
};
const ExposureSchema = {
  firewall: Match.Maybe(Match.OneOf(Function, [Function])),
  maxLimit: Match.Maybe(Match.Integer),
  maxDepth: Match.Maybe(Match.Integer),
  publication: Match.Maybe(Boolean),
  method: Match.Maybe(Boolean),
  blocking: Match.Maybe(Boolean),
  body: Match.Maybe(Object),
  restrictedFields: Match.Maybe([String]),
  restrictLinks: Match.Maybe(Match.OneOf(Function, [String]))
};

function validateBody(collection, body) {
  try {
    createGraph(collection, body);
  } catch (e) {
    throw new Meteor.Error('invalid-body', 'We could not build a valid graph when trying to create your exposure: ' + e.toString());
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/exposure.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Exposure
});
let genCountEndpoint;
module.link("../query/counts/genEndpoint.server.js", {
  default(v) {
    genCountEndpoint = v;
  }

}, 0);
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 1);
let recursiveCompose;
module.link("../query/lib/recursiveCompose.js", {
  default(v) {
    recursiveCompose = v;
  }

}, 2);
let hypernova;
module.link("../query/hypernova/hypernova.js", {
  default(v) {
    hypernova = v;
  }

}, 3);
let ExposureSchema, ExposureDefaults, validateBody;
module.link("./exposure.config.schema.js", {
  ExposureSchema(v) {
    ExposureSchema = v;
  },

  ExposureDefaults(v) {
    ExposureDefaults = v;
  },

  validateBody(v) {
    validateBody = v;
  }

}, 4);
let enforceMaxDepth;
module.link("./lib/enforceMaxDepth.js", {
  default(v) {
    enforceMaxDepth = v;
  }

}, 5);
let enforceMaxLimit;
module.link("./lib/enforceMaxLimit.js", {
  default(v) {
    enforceMaxLimit = v;
  }

}, 6);
let cleanBody;
module.link("./lib/cleanBody.js", {
  default(v) {
    cleanBody = v;
  }

}, 7);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 8);
let restrictFieldsFn;
module.link("./lib/restrictFields.js", {
  default(v) {
    restrictFieldsFn = v;
  }

}, 9);
let restrictLinks;
module.link("./lib/restrictLinks.js", {
  default(v) {
    restrictLinks = v;
  }

}, 10);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 11);
let globalConfig = {};

class Exposure {
  static setConfig(config) {
    Object.assign(globalConfig, config);
  }

  static getConfig() {
    return globalConfig;
  }

  static restrictFields(...args) {
    return restrictFieldsFn(...args);
  }

  constructor(collection, config = {}) {
    collection.__isExposedForGrapher = true;
    collection.__exposure = this;
    this.collection = collection;
    this.name = `exposure_${collection._name}`;
    this.config = config;

    this._validateAndClean();

    this.initSecurity();

    if (this.config.publication) {
      this.initPublication();
    }

    if (this.config.method) {
      this.initMethod();
    }

    if (!this.config.method && !this.config.publication) {
      throw new Meteor.Error('weird', 'If you want to expose your collection you need to specify at least one of ["method", "publication"] options to true');
    }

    this.initCountMethod();
    this.initCountPublication();
  }

  _validateAndClean() {
    if (typeof this.config === 'function') {
      const firewall = this.config;
      this.config = {
        firewall
      };
    }

    this.config = Object.assign({}, ExposureDefaults, Exposure.getConfig(), this.config);
    check(this.config, ExposureSchema);

    if (this.config.body) {
      validateBody(this.collection, this.config.body);
    }
  }
  /**
   * Takes the body and intersects it with the exposure body, if it exists.
   *
   * @param body
   * @param userId
   * @returns {*}
   */


  getTransformedBody(body, userId) {
    if (!this.config.body) {
      return body;
    }

    const processedBody = this.getBody(userId);

    if (processedBody === true) {
      return;
    }

    return cleanBody(processedBody, body);
  }
  /**
   * Gets the exposure body
   */


  getBody(userId) {
    if (!this.config.body) {
      throw new Meteor.Error('missing-body', 'Cannot get exposure body because it was not defined.');
    }

    let body;

    if (_.isFunction(this.config.body)) {
      body = this.config.body.call(this, userId);
    } else {
      body = this.config.body;
    } // it means we allow everything, no need for cloning.


    if (body === true) {
      return true;
    }

    return deepClone(body, userId);
  }
  /**
   * Initializing the publication for reactive query fetching
   */


  initPublication() {
    const collection = this.collection;
    const config = this.config;
    const getTransformedBody = this.getTransformedBody.bind(this);
    Meteor.publishComposite(this.name, function (body) {
      let transformedBody = getTransformedBody(body);
      const rootNode = createGraph(collection, transformedBody);
      enforceMaxDepth(rootNode, config.maxDepth);
      restrictLinks(rootNode, this.userId);
      return recursiveCompose(rootNode, this.userId, {
        bypassFirewalls: !!config.body
      });
    });
  }
  /**
   * Initializez the method to retrieve the data via Meteor.call
   */


  initMethod() {
    const collection = this.collection;
    const config = this.config;
    const getTransformedBody = this.getTransformedBody.bind(this);

    const methodBody = function (body) {
      if (!config.blocking) {
        this.unblock();
      }

      let transformedBody = getTransformedBody(body);
      const rootNode = createGraph(collection, transformedBody);
      enforceMaxDepth(rootNode, config.maxDepth);
      restrictLinks(rootNode, this.userId); // if there is no exposure body defined, then we need to apply firewalls

      return hypernova(rootNode, this.userId, {
        bypassFirewalls: !!config.body
      });
    };

    Meteor.methods({
      [this.name]: methodBody
    });
  }
  /**
   * Initializes the method to retrieve the count of the data via Meteor.call
   * @returns {*}
   */


  initCountMethod() {
    const collection = this.collection;
    Meteor.methods({
      [this.name + '.count'](body) {
        this.unblock();
        return collection.find(body.$filters || {}, {}, this.userId).count();
      }

    });
  }
  /**
   * Initializes the reactive endpoint to retrieve the count of the data.
   */


  initCountPublication() {
    const collection = this.collection;
    genCountEndpoint(this.name, {
      getCursor({
        session
      }) {
        return collection.find(session.filters, {
          fields: {
            _id: 1
          }
        }, this.userId);
      },

      getSession(body) {
        return {
          filters: body.$filters || {}
        };
      }

    });
  }
  /**
   * Initializes security enforcement
   * THINK: Maybe instead of overriding .find, I could store this data of security inside the collection object.
   */


  initSecurity() {
    const collection = this.collection;
    const {
      firewall,
      maxLimit,
      restrictedFields
    } = this.config;
    const find = collection.find.bind(collection);
    const findOne = collection.findOne.bind(collection);

    collection.firewall = (filters, options, userId) => {
      if (userId !== undefined) {
        this._callFirewall({
          collection: collection
        }, filters, options, userId);

        enforceMaxLimit(options, maxLimit);

        if (restrictedFields) {
          Exposure.restrictFields(filters, options, restrictedFields);
        }
      }
    };

    collection.find = function (filters, options = {}, userId = undefined) {
      if (arguments.length == 0) {
        filters = {};
      } // If filters is undefined it should return an empty item


      if (arguments.length > 0 && filters === undefined) {
        return find(undefined, options);
      }

      collection.firewall(filters, options, userId);
      return find(filters, options);
    };

    collection.findOne = function (filters, options = {}, userId = undefined) {
      // If filters is undefined it should return an empty item
      if (arguments.length > 0 && filters === undefined) {
        return null;
      }

      if (typeof filters === 'string') {
        filters = {
          _id: filters
        };
      }

      collection.firewall(filters, options, userId);
      return findOne(filters, options);
    };
  }
  /**
   * @private
   */


  _callFirewall(...args) {
    const {
      firewall
    } = this.config;

    if (!firewall) {
      return;
    }

    if (_.isArray(firewall)) {
      firewall.forEach(fire => {
        fire.call(...args);
      });
    } else {
      firewall.call(...args);
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/extension.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Exposure;
module.link("./exposure.js", {
  default(v) {
    Exposure = v;
  }

}, 0);
Object.assign(Mongo.Collection.prototype, {
  expose(config) {
    if (!Meteor.isServer) {
      throw new Meteor.Error('not-allowed', `You can only expose a collection server side. ${this._name}`);
    }

    new Exposure(this, config);
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanBody.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanBody.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => cleanBody
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);
let cleanFilters, cleanOptions;
module.link("./cleanSelectors", {
  cleanFilters(v) {
    cleanFilters = v;
  },

  cleanOptions(v) {
    cleanOptions = v;
  }

}, 1);
let dotize;
module.link("../../query/lib/dotize", {
  default(v) {
    dotize = v;
  }

}, 2);

function cleanBody(main, second, ...args) {
  let object = {};

  if (second.$filters || second.$options) {
    const fields = getFields(main);
    cleanFilters(second.$filters, fields);
    cleanOptions(second.$options, fields);
  }

  _.each(second, (secondValue, key) => {
    if (key === '$filters' || key === '$options') {
      object[key] = secondValue;
      return;
    }

    let value = main[key];

    if (value === undefined) {
      return;
    } // if the main value is a function, we run it.


    if (_.isFunction(value)) {
      value = value.call(null, ...args);
    } // if the main value is undefined or false, we skip the merge


    if (value === undefined || value === false) {
      return;
    } // we treat this specially, if the value is true


    if (value === true) {
      object[key] = _.isObject(secondValue) ? deepClone(secondValue) : value;
      return;
    } // if the main value is an object


    if (_.isObject(value)) {
      if (_.isObject(secondValue)) {
        // if the second one is an object as well we run recursively run the intersection
        object[key] = cleanBody(value, secondValue, ...args);
      } // if it is not, then we will ignore it, because it won't make sense.
      // to merge {a: 1} with 1.


      return;
    } // if the main value is not an object, it should be a truthy value like 1


    if (_.isObject(secondValue)) {
      // if the second value is an object, then we will keep it.
      // this won't cause problem with deep nesting because
      // when you specify links you will have the main value as an object, otherwise it will fail
      // this is used for things like when you have a hash object like profile with multiple nesting fields, you can allow the client to specify only what he needs
      object[key] = deepClone(secondValue);
    } else {
      // if the second value is not an object, we just store the first value
      object[key] = value;
    }
  });

  return object;
}

function getFields(body) {
  return _.keys(dotize.convert(body));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanSelectors.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanSelectors.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  cleanOptions: () => cleanOptions,
  cleanFilters: () => cleanFilters,
  fieldExists: () => fieldExists
});

function cleanOptions(options, ensureFields) {
  if (!options) {
    return;
  }

  if (options.fields) {
    options.fields = _.pick(options.fields, ...ensureFields);
  }

  if (options.sort) {
    options.sort = _.pick(options.sort, ...ensureFields);
  }
}

const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not'];
const special = [...deepFilterFieldsArray, ...deepFilterFieldsObject];

function cleanFilters(filters, ensureFields) {
  if (!filters) {
    return;
  }

  _.each(filters, (value, key) => {
    if (!_.contains(special, key)) {
      if (!fieldExists(ensureFields, key)) {
        delete filters[key];
      }
    }
  });

  deepFilterFieldsArray.forEach(field => {
    if (filters[field]) {
      filters[field].forEach(element => cleanFilters(element, ensureFields));
    }
  });
  deepFilterFieldsObject.forEach(field => {
    if (filters[field]) {
      cleanFilters(filters[field], ensureFields);
    }
  });
}

function fieldExists(fields, key) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i] === key || key.indexOf(fields[i] + '.') === 0) {
      return true;
    }
  }

  return false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxDepth.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxDepth.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  getDepth: () => getDepth
});
module.exportDefault(function (node, maxDepth) {
  if (maxDepth === undefined) {
    return node;
  }

  const depth = getDepth(node);

  if (depth > maxDepth) {
    throw new Meteor.Error('too-deep', 'Your graph request is too deep and it is not allowed.');
  }

  return node;
});

function getDepth(node) {
  if (node.collectionNodes.length === 0) {
    return 1;
  }

  return 1 + _.max(_.map(node.collectionNodes, getDepth));
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxLimit.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxLimit.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (options, maxLimit) {
  if (maxLimit === undefined) {
    return;
  }

  if (options.limit) {
    if (options.limit > maxLimit) {
      options.limit = maxLimit;
    }
  } else {
    options.limit = maxLimit;
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictFields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictFields.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => restrictFields
});
const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not'];
/**
 * This is used to restrict some fields to some users, by passing the fields as array in the exposure object
 * For example in an user exposure: restrictFields(options, ['services', 'createdAt'])
 *
 * @param filters Object
 * @param options Object
 * @param restrictedFields Array
 */

function restrictFields(filters, options, restrictedFields) {
  if (!_.isArray(restrictedFields)) {
    throw new Meteor.Error('invalid-parameters', 'Please specify an array of restricted fields.');
  }

  cleanFilters(filters, restrictedFields);
  cleanOptions(options, restrictedFields);
}

/**
 * Deep cleans filters
 *
 * @param filters
 * @param restrictedFields
 */
function cleanFilters(filters, restrictedFields) {
  if (filters) {
    cleanObject(filters, restrictedFields);
  }

  deepFilterFieldsArray.forEach(field => {
    if (filters[field]) {
      filters[field].forEach(element => cleanFilters(element, restrictedFields));
    }
  });
  deepFilterFieldsObject.forEach(field => {
    if (filters[field]) {
      cleanFilters(filters[field], restrictedFields);
    }
  });
}
/**
 * Deeply cleans options
 *
 * @param options
 * @param restrictedFields
 */


function cleanOptions(options, restrictedFields) {
  if (options.fields) {
    cleanObject(options.fields, restrictedFields);

    if (_.keys(options.fields).length === 0) {
      _.extend(options.fields, {
        _id: 1
      });
    }
  } else {
    options.fields = {
      _id: 1
    };
  }

  if (options.sort) {
    cleanObject(options.sort, restrictedFields);
  }
}
/**
 * Cleans the object (not deeply)
 *
 * @param object
 * @param restrictedFields
 */


function cleanObject(object, restrictedFields) {
  _.each(object, (value, key) => {
    restrictedFields.forEach(restrictedField => {
      if (matching(restrictedField, key)) {
        delete object[key];
      }
    });
  });
}
/**
 * Returns true if field == subfield or if `${field}.` INCLUDED in subfield
 * Example: "profile" and "profile.firstName" will be a matching field
 * @param field
 * @param subfield
 * @returns {boolean}
 */


function matching(field, subfield) {
  if (field === subfield) {
    return true;
  }

  return subfield.slice(0, field.length + 1) === field + '.';
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictLinks.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictLinks.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => restrictLinks,
  getLinks: () => getLinks
});

function restrictLinks(parentNode, ...args) {
  const restrictedLinks = getLinks(parentNode, ...args);

  if (!restrictedLinks || restrictedLinks.length) {
    return;
  }

  _.each(parentNode.collectionNodes, collectionNode => {
    if (_.contains(restrictedLinks, collectionNode.linkName)) {
      parentNode.remove(collectionNode);
    }
  });
}

function getLinks(node, ...args) {
  if (node.collection && node.collection.__exposure) {
    const exposure = node.collection.__exposure;

    if (exposure.config.restrictLinks) {
      const configRestrictLinks = exposure.config.restrictLinks;

      if (_.isArray(configRestrictLinks)) {
        return configRestrictLinks;
      }

      return configRestrictLinks(...args);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"graphql":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/index.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  astToQuery: () => astToQuery
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let astToQuery;
module.link("./lib/astToQuery", {
  default(v) {
    astToQuery = v;
  }

}, 1);
module.link("./lib/defaults", {
  setAstToQueryDefaults: "setAstToQueryDefaults"
}, 2);
module.link("./lib/astToBody", {
  default: "astToBody"
}, 3);
Object.assign(Mongo.Collection.prototype, {
  astToQuery
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"astToBody.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/astToBody.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Symbols: () => Symbols,
  default: () => astToBody
});
const Symbols = {
  ARGUMENTS: Symbol('arguments')
};

function astToBody(ast) {
  const fieldNodes = ast.fieldNodes;
  const body = extractSelectionSet(ast.fieldNodes[0].selectionSet);
  return body;
}

function extractSelectionSet(set) {
  let body = {};
  set.selections.forEach(el => {
    if (!el.selectionSet) {
      body[el.name.value] = 1;
    } else {
      body[el.name.value] = extractSelectionSet(el.selectionSet);

      if (el.arguments.length) {
        let argumentMap = {};
        el.arguments.forEach(arg => {
          argumentMap[arg.name.value] = arg.value.value;
        });
        body[el.name.value][Symbols.ARGUMENTS] = argumentMap;
      }
    }
  });
  return body;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"astToQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/astToQuery.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => astToQuery,
  getMaxDepth: () => getMaxDepth,
  deny: () => deny,
  clearEmptyObjects: () => clearEmptyObjects,
  createGetArgs: () => createGetArgs
});
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 0);
let astToBody, Symbols;
module.link("./astToBody", {
  default(v) {
    astToBody = v;
  },

  Symbols(v) {
    Symbols = v;
  }

}, 1);
let defaults;
module.link("./defaults", {
  default(v) {
    defaults = v;
  }

}, 2);
let intersectDeep;
module.link("../../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 3);
let enforceMaxLimit;
module.link("../../exposure/lib/enforceMaxLimit", {
  default(v) {
    enforceMaxLimit = v;
  }

}, 4);
const Errors = {
  MAX_DEPTH: 'The maximum depth of this request exceeds the depth allowed.'
};

function astToQuery(ast, config = {}) {
  const collection = this;
  check(config, {
    embody: Match.Maybe(Function),
    $filters: Match.Maybe(Object),
    $options: Match.Maybe(Object),
    maxDepth: Match.Maybe(Number),
    maxLimit: Match.Maybe(Number),
    deny: Match.Maybe([String]),
    intersect: Match.Maybe(Object)
  });
  config = Object.assign({
    $options: {},
    $filters: {}
  }, defaults, config); // get the body

  let body = astToBody(ast); // first we do the intersection

  if (config.intersect) {
    body = intersectDeep(config.intersect, body);
  } // enforce the maximum amount of data we allow to retrieve


  if (config.maxLimit) {
    enforceMaxLimit(config.$options, config.maxLimit);
  } // figure out depth based


  if (config.maxDepth) {
    const currentMaxDepth = getMaxDepth(body);

    if (currentMaxDepth > config.maxDepth) {
      throw Errors.MAX_DEPTH;
    }
  }

  if (config.deny) {
    deny(body, config.deny);
  }

  Object.assign(body, {
    $filters: config.$filters,
    $options: config.$options
  });

  if (config.embody) {
    const getArgs = createGetArgs(body);
    config.embody.call(null, {
      body,
      getArgs
    });
  } // we return the query


  return this.createQuery(body);
}

function getMaxDepth(body) {
  let depths = [];

  for (key in body) {
    if (_.isObject(body[key])) {
      depths.push(getMaxDepth(body[key]));
    }
  }

  if (depths.length === 0) {
    return 1;
  }

  return Math.max(...depths) + 1;
}

function deny(body, fields) {
  fields.forEach(field => {
    let parts = field.split('.');
    let accessor = body;

    while (parts.length != 0) {
      if (parts.length === 1) {
        delete accessor[parts[0]];
      } else {
        if (!_.isObject(accessor)) {
          break;
        }

        accessor = accessor[parts[0]];
      }

      parts.shift();
    }
  });
  return clearEmptyObjects(body);
}

function clearEmptyObjects(body) {
  // clear empty nodes then back-propagate
  for (let key in body) {
    if (_.isObject(body[key])) {
      const shouldDelete = clearEmptyObjects(body[key]);

      if (shouldDelete) {
        delete body[key];
      }
    }
  }

  return Object.keys(body).length === 0;
}

function createGetArgs(body) {
  return function (path) {
    const parts = path.split('.');
    let stopped = false;
    let accessor = body;

    for (var i = 0; i < parts.length; i++) {
      if (!accessor) {
        stopped = true;
        break;
      }

      if (accessor[parts[i]]) {
        accessor = accessor[parts[i]];
      }
    }

    if (stopped) {
      return {};
    }

    if (accessor) {
      return accessor[Symbols.ARGUMENTS] || {};
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"defaults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/graphql/lib/defaults.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  setAstToQueryDefaults: () => setAstToQueryDefaults
});
let defaults = {};
module.exportDefault(defaults);

function setAstToQueryDefaults(object) {
  Object.assign(defaults, object);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"links":{"config.schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/config.schema.js                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DenormalizeSchema: () => DenormalizeSchema,
  LinkConfigDefaults: () => LinkConfigDefaults,
  LinkConfigSchema: () => LinkConfigSchema
});
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 0);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 1);
const DenormalizeSchema = {
  field: String,
  body: Object,
  bypassSchema: Match.Maybe(Boolean)
};
const LinkConfigDefaults = {
  type: 'one'
};
const LinkConfigSchema = {
  type: Match.Maybe(Match.OneOf('one', 'many', '1', '*')),
  collection: Match.Maybe(Match.Where(collection => {
    // We do like this so it works with other types of collections 
    // like FS.Collection
    return _.isObject(collection) && (collection instanceof Mongo.Collection || !!collection._collection);
  })),
  field: Match.Maybe(String),
  metadata: Match.Maybe(Boolean),
  inversedBy: Match.Maybe(String),
  index: Match.Maybe(Boolean),
  unique: Match.Maybe(Boolean),
  autoremove: Match.Maybe(Boolean),
  denormalize: Match.Maybe(Match.ObjectIncluding(DenormalizeSchema))
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/constants.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  LINK_STORAGE: () => LINK_STORAGE
});
const LINK_STORAGE = '__links';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/extension.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let LINK_STORAGE;
module.link("./constants.js", {
  LINK_STORAGE(v) {
    LINK_STORAGE = v;
  }

}, 1);
let Linker;
module.link("./linker.js", {
  default(v) {
    Linker = v;
  }

}, 2);
Object.assign(Mongo.Collection.prototype, {
  /**
   * The data we add should be valid for config.schema.js
   */
  addLinks(data) {
    if (!this[LINK_STORAGE]) {
      this[LINK_STORAGE] = {};
    }

    _.each(data, (linkConfig, linkName) => {
      if (this[LINK_STORAGE][linkName]) {
        throw new Meteor.Error(`You cannot add the link with name: ${linkName} because it was already added to ${this._name} collection`);
      }

      const linker = new Linker(this, linkName, linkConfig);

      _.extend(this[LINK_STORAGE], {
        [linkName]: linker
      });
    });
  },

  getLinks() {
    return this[LINK_STORAGE];
  },

  getLinker(name) {
    if (this[LINK_STORAGE]) {
      return this[LINK_STORAGE][name];
    }
  },

  hasLink(name) {
    if (!this[LINK_STORAGE]) {
      return false;
    }

    return !!this[LINK_STORAGE][name];
  },

  getLink(objectOrId, name) {
    let linkData = this[LINK_STORAGE];

    if (!linkData) {
      throw new Meteor.Error(`There are no links defined for collection: ${this._name}`);
    }

    if (!linkData[name]) {
      throw new Meteor.Error(`There is no link ${name} for collection: ${this._name}`);
    }

    const linker = linkData[name];
    let object = objectOrId;

    if (typeof objectOrId == 'string') {
      if (!linker.isVirtual()) {
        object = this.findOne(objectOrId, {
          fields: {
            [linker.linkStorageField]: 1
          }
        });
      } else {
        object = {
          _id: objectOrId
        };
      }

      if (!object) {
        throw new Meteor.Error(`We could not find any object with _id: "${objectOrId}" within the collection: ${this._name}`);
      }
    }

    return linkData[name].createLink(object);
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linker.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linker.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Linker
});
let LinkMany;
module.link("./linkTypes/linkMany.js", {
  default(v) {
    LinkMany = v;
  }

}, 0);
let LinkManyMeta;
module.link("./linkTypes/linkManyMeta.js", {
  default(v) {
    LinkManyMeta = v;
  }

}, 1);
let LinkOne;
module.link("./linkTypes/linkOne.js", {
  default(v) {
    LinkOne = v;
  }

}, 2);
let LinkOneMeta;
module.link("./linkTypes/linkOneMeta.js", {
  default(v) {
    LinkOneMeta = v;
  }

}, 3);
let LinkConfigSchema, LinkConfigDefaults;
module.link("./config.schema.js", {
  LinkConfigSchema(v) {
    LinkConfigSchema = v;
  },

  LinkConfigDefaults(v) {
    LinkConfigDefaults = v;
  }

}, 4);
let smartArguments;
module.link("./linkTypes/lib/smartArguments", {
  default(v) {
    smartArguments = v;
  }

}, 5);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 6);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 7);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 8);
let access;
module.link("fs", {
  access(v) {
    access = v;
  }

}, 9);

class Linker {
  /**
   * @param mainCollection
   * @param linkName
   * @param linkConfig
   */
  constructor(mainCollection, linkName, linkConfig) {
    this.mainCollection = mainCollection;
    this.linkConfig = Object.assign({}, LinkConfigDefaults, linkConfig);
    this.linkName = linkName; // check linkName must not exist in schema

    this._validateAndClean(); // initialize cascade removal hooks.


    this._initAutoremove();

    this._initDenormalization();

    if (this.isVirtual()) {
      // if it's a virtual field make sure that when this is deleted, it will be removed from the references
      if (!linkConfig.autoremove) {
        this._handleReferenceRemovalForVirtualLinks();
      }
    } else {
      this._initIndex();
    }
  }
  /**
   * Values which represent for the relation a single link
   * @returns {string[]}
   */


  get oneTypes() {
    return ['one', '1'];
  }
  /**
   * Returns the strategies: one, many, one-meta, many-meta
   * @returns {string}
   */


  get strategy() {
    let strategy = this.isMany() ? 'many' : 'one';

    if (this.linkConfig.metadata) {
      strategy += '-meta';
    }

    return strategy;
  }
  /**
   * Returns the field name in the document where the actual relationships are stored.
   * @returns string
   */


  get linkStorageField() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.linkStorageField;
    }

    return this.linkConfig.field;
  }
  /**
   * The collection that is linked with the current collection
   * @returns Mongo.Collection
   */


  getLinkedCollection() {
    return this.linkConfig.collection;
  }
  /**
   * If the relationship for this link is of "many" type.
   */


  isMany() {
    return !this.isSingle();
  }
  /**
   * If the relationship for this link contains metadata
   */


  isMeta() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.isMeta();
    }

    return !!this.linkConfig.metadata;
  }
  /**
   * @returns {boolean}
   */


  isSingle() {
    if (this.isVirtual()) {
      return this.linkConfig.relatedLinker.isSingle();
    }

    return _.contains(this.oneTypes, this.linkConfig.type);
  }
  /**
   * @returns {boolean}
   */


  isVirtual() {
    return !!this.linkConfig.inversedBy;
  }
  /**
   * Should return a single result.
   */


  isOneResult() {
    return this.isVirtual() && this.linkConfig.relatedLinker.linkConfig.unique || !this.isVirtual() && this.isSingle();
  }
  /**
   * @param object
   * @param collection To impersonate the getLinkedCollection() of the "Linker"
   *
   * @returns {LinkOne|LinkMany|LinkManyMeta|LinkOneMeta|LinkResolve}
   */


  createLink(object, collection = null) {
    let helperClass = this._getHelperClass();

    return new helperClass(this, object, collection);
  }
  /**
   * @returns {*}
   * @private
   */


  _validateAndClean() {
    if (!this.linkConfig.collection) {
      throw new Meteor.Error('invalid-config', `For the link ${this.linkName} you did not provide a collection.`);
    }

    if (typeof this.linkConfig.collection === 'string') {
      const collectionName = this.linkConfig.collection;
      this.linkConfig.collection = Mongo.Collection.get(collectionName);

      if (!this.linkConfig.collection) {
        throw new Meteor.Error('invalid-collection', `Could not find a collection with the name: ${collectionName}`);
      }
    }

    if (this.isVirtual()) {
      return this._prepareVirtual();
    } else {
      if (!this.linkConfig.type) {
        this.linkConfig.type = 'one';
      }

      if (!this.linkConfig.field) {
        this.linkConfig.field = this._generateFieldName();
      } else {
        if (this.linkConfig.field == this.linkName) {
          throw new Meteor.Error('invalid-config', `For the link ${this.linkName} you must not use the same name for the field, otherwise it will cause conflicts when fetching data`);
        }
      }
    }

    check(this.linkConfig, LinkConfigSchema);
  }
  /**
   * We need to apply same type of rules in this case.
   * @private
   */


  _prepareVirtual() {
    const {
      collection,
      inversedBy
    } = this.linkConfig;
    let linker = collection.getLinker(inversedBy);

    if (!linker) {
      // it is possible that the collection doesn't have a linker created yet.
      // so we will create it on startup after all links have been defined
      Meteor.startup(() => {
        linker = collection.getLinker(inversedBy);

        if (!linker) {
          throw new Meteor.Error(`You tried setting up an inversed link in "${this.mainCollection._name}" pointing to collection: "${collection._name}" link: "${inversedBy}", but no such link was found. Maybe a typo ?`);
        } else {
          this._setupVirtualConfig(linker);
        }
      });
    } else {
      this._setupVirtualConfig(linker);
    }
  }
  /**
   * @param linker
   * @private
   */


  _setupVirtualConfig(linker) {
    const virtualLinkConfig = linker.linkConfig;

    if (!virtualLinkConfig) {
      throw new Meteor.Error(`There is no link-config for the related collection on ${inversedBy}. Make sure you added the direct links before specifying virtual ones.`);
    }

    _.extend(this.linkConfig, {
      metadata: virtualLinkConfig.metadata,
      relatedLinker: linker
    });
  }
  /**
   * Depending on the strategy, we create the proper helper class
   * @private
   */


  _getHelperClass() {
    switch (this.strategy) {
      case 'many-meta':
        return LinkManyMeta;

      case 'many':
        return LinkMany;

      case 'one-meta':
        return LinkOneMeta;

      case 'one':
        return LinkOne;
    }

    throw new Meteor.Error('invalid-strategy', `${this.strategy} is not a valid strategy`);
  }
  /**
   * If field name not present, we generate it.
   * @private
   */


  _generateFieldName() {
    let cleanedCollectionName = this.linkConfig.collection._name.replace(/\./g, '_');

    let defaultFieldPrefix = this.linkName + '_' + cleanedCollectionName;

    switch (this.strategy) {
      case 'many-meta':
        return `${defaultFieldPrefix}_metas`;

      case 'many':
        return `${defaultFieldPrefix}_ids`;

      case 'one-meta':
        return `${defaultFieldPrefix}_meta`;

      case 'one':
        return `${defaultFieldPrefix}_id`;
    }
  }
  /**
   * When a link that is declared virtual is removed, the reference will be removed from every other link.
   * @private
   */


  _handleReferenceRemovalForVirtualLinks() {
    this.mainCollection.after.remove((userId, doc) => {
      // this problem may occur when you do a .remove() before Meteor.startup()
      if (!this.linkConfig.relatedLinker) {
        console.warn(`There was an error finding the link for removal for collection: "${this.mainCollection._name}" with link: "${this.linkName}". This may occur when you do a .remove() before Meteor.startup()`);
        return;
      }

      const accessor = this.createLink(doc);

      _.each(accessor.fetchAsArray(), linkedObj => {
        const {
          relatedLinker
        } = this.linkConfig; // We do this check, to avoid self-referencing hell when defining virtual links
        // Virtual links if not found "compile-time", we will try again to reprocess them on Meteor.startup
        // if a removal happens before Meteor.startup this may fail

        if (relatedLinker) {
          let link = relatedLinker.createLink(linkedObj);

          if (relatedLinker.isSingle()) {
            link.unset();
          } else {
            link.remove(doc);
          }
        }
      });
    });
  }

  _initIndex() {
    if (Meteor.isServer) {
      let field = this.linkConfig.field;

      if (this.linkConfig.metadata) {
        field = field + '._id';
      }

      if (this.linkConfig.index) {
        if (this.isVirtual()) {
          throw new Meteor.Error('You cannot set index on an inversed link.');
        }

        let options;

        if (this.linkConfig.unique) {
          options = {
            unique: true
          };
        }

        this.mainCollection._ensureIndex({
          [field]: 1
        }, options);
      } else {
        if (this.linkConfig.unique) {
          if (this.isVirtual()) {
            throw new Meteor.Error('You cannot set unique property on an inversed link.');
          }

          this.mainCollection._ensureIndex({
            [field]: 1
          }, {
            unique: true,
            sparse: true
          });
        }
      }
    }
  }

  _initAutoremove() {
    if (!this.linkConfig.autoremove) {
      return;
    }

    if (!this.isVirtual()) {
      this.mainCollection.after.remove((userId, doc) => {
        this.getLinkedCollection().remove({
          _id: {
            $in: smartArguments.getIds(doc[this.linkStorageField])
          }
        });
      });
    } else {
      this.mainCollection.after.remove((userId, doc) => {
        const linker = this.mainCollection.getLink(doc, this.linkName);
        const ids = linker.find({}, {
          fields: {
            _id: 1
          }
        }).fetch().map(item => item._id);
        this.getLinkedCollection().remove({
          _id: {
            $in: ids
          }
        });
      });
    }
  }
  /**
   * Initializes denormalization using herteby:denormalize
   * @private
   */


  _initDenormalization() {
    if (!this.linkConfig.denormalize || !Meteor.isServer) {
      return;
    }

    const packageExists = !!Package['herteby:denormalize'];

    if (!packageExists) {
      throw new Meteor.Error('missing-package', `Please add the herteby:denormalize package to your Meteor application in order to make caching work`);
    }

    const {
      field,
      body,
      bypassSchema
    } = this.linkConfig.denormalize;
    let cacheConfig;
    let referenceFieldSuffix = '';

    if (this.isMeta()) {
      referenceFieldSuffix = this.isSingle() ? '._id' : ':_id';
    }

    if (this.isVirtual()) {
      let inversedLink = this.linkConfig.relatedLinker.linkConfig;
      let type = inversedLink.type == 'many' ? 'many-inverse' : 'inversed';
      cacheConfig = {
        type: type,
        collection: this.linkConfig.collection,
        fields: body,
        referenceField: inversedLink.field + referenceFieldSuffix,
        cacheField: field,
        bypassSchema: !!bypassSchema
      };
    } else {
      cacheConfig = {
        type: this.linkConfig.type,
        collection: this.linkConfig.collection,
        fields: body,
        referenceField: this.linkConfig.field + referenceFieldSuffix,
        cacheField: field,
        bypassSchema: !!bypassSchema
      };
    }

    if (this.isVirtual()) {
      Meteor.startup(() => {
        this.mainCollection.cache(cacheConfig);
      });
    } else {
      this.mainCollection.cache(cacheConfig);
    }
  }
  /**
   * Verifies if this linker is denormalized. It can be denormalized from the inverse side as well.
   *
   * @returns {boolean}
   * @private
   */


  isDenormalized() {
    return !!this.linkConfig.denormalize;
  }
  /**
   * Verifies if the body of the linked element does not contain fields outside the cache body
   *
   * @param body
   * @returns {boolean}
   * @private
   */


  isSubBodyDenormalized(body) {
    const cacheBody = this.linkConfig.denormalize.body;

    const cacheBodyFields = _.keys(dot.dot(cacheBody));

    const bodyFields = _.keys(dot.dot(_.omit(body, '_id')));

    return _.difference(bodyFields, cacheBodyFields).length === 0;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"createSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/lib/createSearchFilters.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => createSearchFilters,
  createOne: () => createOne,
  createOneVirtual: () => createOneVirtual,
  createOneMeta: () => createOneMeta,
  createOneMetaVirtual: () => createOneMetaVirtual,
  createMany: () => createMany,
  createManyVirtual: () => createManyVirtual,
  createManyMeta: () => createManyMeta,
  createManyMetaVirtual: () => createManyMetaVirtual
});
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 0);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 1);

function createSearchFilters(object, fieldStorage, strategy, isVirtual, metaFilters) {
  if (!isVirtual) {
    switch (strategy) {
      case 'one':
        return createOne(object, fieldStorage);

      case 'one-meta':
        return createOneMeta(object, fieldStorage, metaFilters);

      case 'many':
        return createMany(object, fieldStorage);

      case 'many-meta':
        return createManyMeta(object, fieldStorage, metaFilters);

      default:
        throw new Meteor.Error(`Invalid linking strategy: ${strategy}`);
    }
  } else {
    switch (strategy) {
      case 'one':
        return createOneVirtual(object, fieldStorage);

      case 'one-meta':
        return createOneMetaVirtual(object, fieldStorage, metaFilters);

      case 'many':
        return createManyVirtual(object, fieldStorage);

      case 'many-meta':
        return createManyMetaVirtual(object, fieldStorage, metaFilters);

      default:
        throw new Meteor.Error(`Invalid linking strategy: ${strategy}`);
    }
  }
}

function createOne(object, fieldStorage) {
  return {
    _id: dot.pick(fieldStorage, object)
  };
}

function createOneVirtual(object, fieldStorage) {
  return {
    [fieldStorage]: object._id
  };
}

function createOneMeta(object, fieldStorage, metaFilters) {
  const value = object[fieldStorage];

  if (metaFilters) {
    if (!sift(metaFilters)(value)) {
      return {
        _id: undefined
      };
    }
  }

  return {
    _id: value ? value._id : value
  };
}

function createOneMetaVirtual(object, fieldStorage, metaFilters) {
  let filters = {};

  if (metaFilters) {
    _.each(metaFilters, (value, key) => {
      filters[fieldStorage + '.' + key] = value;
    });
  }

  filters[fieldStorage + '._id'] = object._id;
  return filters;
}

function createMany(object, fieldStorage) {
  const [root, ...nested] = fieldStorage.split('.');

  if (nested.length > 0) {
    const arr = object[root];
    const ids = arr ? _.uniq(_.union(arr.map(obj => _.isObject(obj) ? dot.pick(nested.join('.'), obj) : []))) : [];
    return {
      _id: {
        $in: ids
      }
    };
  }

  return {
    _id: {
      $in: object[fieldStorage] || []
    }
  };
}

function createManyVirtual(object, fieldStorage) {
  return {
    [fieldStorage]: object._id
  };
}

function createManyMeta(object, fieldStorage, metaFilters) {
  let value = object[fieldStorage];

  if (metaFilters) {
    value = sift(metaFilters, value);
  }

  return {
    _id: {
      $in: _.pluck(value, '_id') || []
    }
  };
}

function createManyMetaVirtual(object, fieldStorage, metaFilters) {
  let filters = {};

  if (metaFilters) {
    _.each(metaFilters, (value, key) => {
      filters[key] = value;
    });
  }

  filters._id = object._id;
  return {
    [fieldStorage]: {
      $elemMatch: filters
    }
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"linkTypes":{"base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/base.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Link
});
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 0);
let createSearchFilters;
module.link("../lib/createSearchFilters", {
  default(v) {
    createSearchFilters = v;
  }

}, 1);

class Link {
  get config() {
    return this.linker.linkConfig;
  }

  get isVirtual() {
    return this.linker.isVirtual();
  }

  constructor(linker, object, collection) {
    this.linker = linker;
    this.object = object;
    this.linkedCollection = collection ? collection : linker.getLinkedCollection();

    if (this.linker.isVirtual()) {
      this.linkStorageField = this.config.relatedLinker.linkConfig.field;
    } else {
      this.linkStorageField = this.config.field;
    }
  }
  /**
   * Gets the stored link information value
   * @returns {*}
   */


  value() {
    if (this.isVirtual) {
      throw new Meteor.Error('You can only take the value from the main link.');
    }

    return this.object[this.linkStorageField];
  }
  /**
   * Finds linked data.
   *
   * @param filters
   * @param options
   * @returns {*}
   * @param userId
   */


  find(filters = {}, options = {}, userId = undefined) {
    let linker = this.linker;
    const linkedCollection = this.linkedCollection;
    let $metaFilters;

    if (filters.$meta) {
      $metaFilters = filters.$meta;
      delete filters.$meta;
    }

    const searchFilters = createSearchFilters(this.object, this.linkStorageField, linker.strategy, linker.isVirtual(), $metaFilters);

    let appliedFilters = _.extend({}, filters, searchFilters); // see https://github.com/cult-of-coders/grapher/issues/134
    // happens due to recursive importing of modules
    // TODO: find another way to do this


    if (linkedCollection.find) {
      return linkedCollection.find(appliedFilters, options, userId);
    } else {
      return linkedCollection.default.find(appliedFilters, options, userId);
    }
  }
  /**
   * @param filters
   * @param options
   * @param others
   * @returns {*|{content}|any}
   */


  fetch(filters, options, ...others) {
    let result = this.find(filters, options, ...others).fetch();

    if (this.linker.isOneResult()) {
      return _.first(result);
    }

    return result;
  }
  /**
   * This is just like fetch() but forces to get an array even if it's single result
   * 
   * @param {*} filters 
   * @param {*} options 
   * @param  {...any} others 
   */


  fetchAsArray(filters, options, ...others) {
    return this.find(filters, options, ...others).fetch();
  }
  /**
   * When we are dealing with multiple type relationships, $in would require an array. If the field value is null, it will fail
   * We use clean to make it an empty array by default.
   */


  clean() {}
  /**
   * Extracts a single id
   */


  identifyId(what, saveToDatabase) {
    return SmartArgs.getId(what, {
      saveToDatabase,
      collection: this.linkedCollection
    });
  }
  /**
   * Extracts the ids of object(s) or strings and returns an array.
   */


  identifyIds(what, saveToDatabase) {
    return SmartArgs.getIds(what, {
      saveToDatabase,
      collection: this.linkedCollection
    });
  }
  /**
   * Checks when linking data, if the ids are valid with the linked collection.
   * @throws Meteor.Error
   * @param ids
   *
   * @protected
   */


  _validateIds(ids) {
    if (!_.isArray(ids)) {
      ids = [ids];
    }

    const validIds = this.linkedCollection.find({
      _id: {
        $in: ids
      }
    }, {
      fields: {
        _id: 1
      }
    }).fetch().map(doc => doc._id);

    if (validIds.length != ids.length) {
      throw new Meteor.Error('not-found', `You tried to create links with non-existing id(s) inside "${this.linkedCollection._name}": ${_.difference(ids, validIds).join(', ')}`);
    }
  }

  _checkWhat(what) {
    if (what === undefined || what === null) {
      throw new Error(`The argument passed: ${what} is not accepted.`);
    }
  }
  /**
   * This is for allowing commands such as set/unset/add/remove/metadata from the virtual link.
   *
   * @param action
   * @param what
   * @param metadata
   *
   * @protected
   */


  _virtualAction(action, what, metadata) {
    const linker = this.linker.linkConfig.relatedLinker; // its an unset operation most likely.

    if (what === undefined) {
      const reversedLink = linker.createLink(this.fetch());
      reversedLink.unset();
      return;
    }

    if (!_.isArray(what)) {
      what = [what];
    }

    what = _.map(what, element => {
      if (!_.isObject(element)) {
        return linker.mainCollection.findOne(element);
      } else {
        if (!element._id) {
          const elementId = linker.mainCollection.insert(element);

          _.extend(element, linker.mainCollection.findOne(elementId));
        }

        return element;
      }
    });
    return _.map(what, element => {
      const reversedLink = linker.createLink(element);

      if (action == 'metadata') {
        if (linker.isSingle()) {
          return reversedLink.metadata(metadata);
        } else {
          return reversedLink.metadata(this.object, metadata);
        }
      } else if (action == 'add' || action == 'set') {
        if (linker.isSingle()) {
          reversedLink.set(this.object, metadata);
        } else {
          reversedLink.add(this.object, metadata);
        }
      } else {
        if (linker.isSingle()) {
          reversedLink.unset();
        } else {
          reversedLink.remove(this.object);
        }
      }
    });
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkMany.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkMany.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkMany
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 1);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 2);

class LinkMany extends Link {
  clean() {
    if (!this.object[this.linkStorageField]) {
      this.object[this.linkStorageField] = [];
    }
  }
  /**
   * Ads the _ids to the object.
   * @param what
   */


  add(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('add', what);

      return this;
    } //if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/remove operations must be done from the owning-link of the relationship');


    this.clean();

    const _ids = this.identifyIds(what, true);

    this._validateIds(_ids);

    const field = this.linkStorageField; // update the field

    this.object[field] = _.union(this.object[field], _ids); // update the db

    let modifier = {
      $addToSet: {
        [field]: {
          $each: _ids
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }
  /**
   * @param what
   */


  remove(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    if (this.isVirtual) throw new Meteor.Error('not-allowed', 'Add/Remove operations should be done from the owner of the relationship');
    this.clean();
    const field = this.linkStorageField;
    const [root, ...nested] = field.split('.');

    const _ids = this.identifyIds(what); // update the field


    this.object[root] = _.filter(this.object[root], _id => !_.contains(_ids, nested.length > 0 ? dot.pick(nested.join('.'), _id) : _id)); // update the db

    let modifier = {
      $pull: {
        [root]: nested.length > 0 ? {
          [nested.join('.')]: {
            $in: _ids
          }
        } : {
          $in: _ids
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }

  set(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkManyMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkManyMeta.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkManyMeta
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkManyMeta extends Link {
  clean() {
    if (!this.object[this.linkStorageField]) {
      this.object[this.linkStorageField] = [];
    }
  }
  /**
   * @param what
   * @param metadata
   */


  add(what, metadata = {}) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('add', what, metadata);

      return this;
    }

    const _ids = this.identifyIds(what, true);

    this._validateIds(_ids);

    let field = this.linkStorageField;
    this.object[field] = this.object[field] || [];
    let metadatas = [];

    _.each(_ids, _id => {
      let localMetadata = _.clone(metadata);

      localMetadata._id = _id;
      this.object[field].push(localMetadata);
      metadatas.push(localMetadata);
    });

    let modifier = {
      $addToSet: {
        [field]: {
          $each: metadatas
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }
  /**
   * @param what
   * @param extendMetadata
   */


  metadata(what, extendMetadata) {
    if (this.isVirtual) {
      this._virtualAction('metadata', what, extendMetadata);

      return this;
    }

    let field = this.linkStorageField;

    if (what === undefined) {
      return this.object[field];
    }

    if (_.isArray(what)) {
      throw new Meteor.Error('not-allowed', 'Metadata updates should be made for one entity only, not multiple');
    }

    const _id = this.identifyId(what);

    let existingMetadata = _.find(this.object[field], metadata => metadata._id == _id);

    if (extendMetadata === undefined) {
      return existingMetadata;
    } else {
      _.extend(existingMetadata, extendMetadata);

      let subfield = field + '._id';
      let subfieldUpdate = field + '.$';
      this.linker.mainCollection.update({
        _id: this.object._id,
        [subfield]: _id
      }, {
        $set: {
          [subfieldUpdate]: existingMetadata
        }
      });
    }

    return this;
  }

  remove(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    const _ids = this.identifyIds(what);

    let field = this.linkStorageField;
    this.object[field] = _.filter(this.object[field], link => !_.contains(_ids, link._id));
    let modifier = {
      $pull: {
        [field]: {
          _id: {
            $in: _ids
          }
        }
      }
    };
    this.linker.mainCollection.update(this.object._id, modifier);
    return this;
  }

  set(what, metadata) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('set', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *unset* in a relationship that is single. Please use add/remove for *many* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOne.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOne.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkOne
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkOne extends Link {
  set(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    let field = this.linkStorageField;

    const _id = this.identifyId(what, true);

    this._validateIds([_id]);

    this.object[field] = _id;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: _id
      }
    });
    return this;
  }

  unset() {
    if (this.isVirtual) {
      this._virtualAction('unset', what);

      return this;
    }

    let field = this.linkStorageField;
    this.object[field] = null;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: null
      }
    });
    return this;
  }

  add(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('add', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOneMeta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOneMeta.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LinkOneMeta
});
let Link;
module.link("./base.js", {
  default(v) {
    Link = v;
  }

}, 0);
let SmartArgs;
module.link("./lib/smartArguments.js", {
  default(v) {
    SmartArgs = v;
  }

}, 1);

class LinkOneMeta extends Link {
  set(what, metadata = {}) {
    this._checkWhat(what);

    metadata = Object.assign({}, metadata);

    if (this.isVirtual) {
      this._virtualAction('set', what, metadata);

      return this;
    }

    let field = this.linkStorageField;
    metadata._id = this.identifyId(what, true);

    this._validateIds([metadata._id]);

    this.object[field] = metadata;
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: metadata
      }
    });
    return this;
  }

  metadata(extendMetadata) {
    if (this.isVirtual) {
      this._virtualAction('metadata', undefined, extendMetadata);

      return this;
    }

    let field = this.linkStorageField;

    if (!extendMetadata) {
      return this.object[field];
    } else {
      _.extend(this.object[field], extendMetadata);

      this.linker.mainCollection.update(this.object._id, {
        $set: {
          [field]: this.object[field]
        }
      });
    }

    return this;
  }

  unset() {
    if (this.isVirtual) {
      this._virtualAction('unset');

      return this;
    }

    let field = this.linkStorageField;
    this.object[field] = {};
    this.linker.mainCollection.update(this.object._id, {
      $set: {
        [field]: {}
      }
    });
    return this;
  }

  add(what, metadata) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('add', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
    this._checkWhat(what);

    if (this.isVirtual) {
      this._virtualAction('remove', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *remove* in a relationship that is single. Please use set/unset for *single* relationships');
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"smartArguments.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/links/linkTypes/lib/smartArguments.js                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(new class {
  getIds(what, options) {
    if (_.isArray(what)) {
      return _.map(what, subWhat => {
        return this.getId(subWhat, options);
      });
    } else {
      return [this.getId(what, options)];
    }

    throw new Meteor.Error('invalid-type', `Unrecognized type: ${typeof what} for managing links`);
  }

  getId(what, options) {
    if (typeof what === 'string') {
      return what;
    }

    if (typeof what === 'object') {
      if (!what._id && options.saveToDatabase) {
        what._id = options.collection.insert(what);
      }

      return what._id;
    }
  }

}());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"namedQuery":{"namedQuery.base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.base.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => NamedQueryBase
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);
let globalConfig = {};

class NamedQueryBase {
  static setConfig(config) {
    globalConfig = config;
  }

  static getConfig() {
    return globalConfig;
  }

  constructor(name, collection, body, options = {}) {
    this.isNamedQuery = true;
    this.queryName = name;

    if (_.isFunction(body)) {
      this.resolver = body;
    } else {
      this.body = deepClone(body);
    }

    this.subscriptionHandle = null;
    this.params = options.params || {};
    this.options = Object.assign({}, globalConfig, options);
    this.collection = collection;
    this.isExposed = false;
  }

  get name() {
    return `named_query_${this.queryName}`;
  }

  get isResolver() {
    return !!this.resolver;
  }

  setParams(params) {
    this.params = _.extend({}, this.params, params);
    return this;
  }
  /**
   * Validates the parameters
   */


  doValidateParams(params) {
    params = params || this.params;
    const {
      validateParams
    } = this.options;
    if (!validateParams) return;

    try {
      this._validate(validateParams, params);
    } catch (validationError) {
      console.error(`Invalid parameters supplied to the query "${this.queryName}"\n`, validationError);
      throw validationError; // rethrow
    }
  }

  clone(newParams) {
    const params = _.extend({}, deepClone(this.params), newParams);

    let clone = new this.constructor(this.queryName, this.collection, this.isResolver ? this.resolver : deepClone(this.body), (0, _objectSpread2.default)({}, this.options, {
      params
    }));
    clone.cacher = this.cacher;

    if (this.exposeConfig) {
      clone.exposeConfig = this.exposeConfig;
    }

    return clone;
  }
  /**
   * @param {function|object} validator
   * @param {object} params
   * @private
   */


  _validate(validator, params) {
    if (_.isFunction(validator)) {
      validator.call(null, params);
    } else {
      check(params, validator);
    }
  }

}

NamedQueryBase.defaultOptions = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.client.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let CountSubscription;
module.link("../query/counts/countSubscription", {
  default(v) {
    CountSubscription = v;
  }

}, 0);
let createGraph;
module.link("../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 1);
let recursiveFetch;
module.link("../query/lib/recursiveFetch.js", {
  default(v) {
    recursiveFetch = v;
  }

}, 2);
let prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 3);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 4);
let callWithPromise;
module.link("../query/lib/callWithPromise", {
  default(v) {
    callWithPromise = v;
  }

}, 5);
let Base;
module.link("./namedQuery.base", {
  default(v) {
    Base = v;
  }

}, 6);
let LocalCollection;
module.link("meteor/minimongo", {
  LocalCollection(v) {
    LocalCollection = v;
  }

}, 7);
let intersectDeep;
module.link("../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 8);
module.exportDefault(class extends Base {
  /**
   * Subscribe
   *
   * @param callback
   * @returns {null|any|*}
   */
  subscribe(callback) {
    if (this.isResolver) {
      throw new Meteor.Error('not-allowed', `You cannot subscribe to a resolver query`);
    }

    this.subscriptionHandle = Meteor.subscribe(this.name, this.params, callback);
    return this.subscriptionHandle;
  }
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */


  subscribeCount(callback) {
    if (this.isResolver) {
      throw new Meteor.Error('not-allowed', `You cannot subscribe to a resolver query`);
    }

    if (!this._counter) {
      this._counter = new CountSubscription(this);
    }

    return this._counter.subscribe(this.params, callback);
  }
  /**
   * Unsubscribe if an existing subscription exists
   */


  unsubscribe() {
    if (this.subscriptionHandle) {
      this.subscriptionHandle.stop();
    }

    this.subscriptionHandle = null;
  }
  /**
   * Unsubscribe to the counts if a subscription exists.
   */


  unsubscribeCount() {
    if (this._counter) {
      this._counter.unsubscribe();

      this._counter = null;
    }
  }
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */


  fetchSync() {
    return Promise.asyncApply(() => {
      if (this.subscriptionHandle) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name, this.params));
    });
  }
  /**
   * Fetches one element in sync
   * @return {*}
   */


  fetchOneSync() {
    return Promise.asyncApply(() => {
      return _.first(Promise.await(this.fetchSync()));
    });
  }
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */


  fetch(callbackOrOptions) {
    if (!this.subscriptionHandle) {
      return this._fetchStatic(callbackOrOptions);
    } else {
      return this._fetchReactive(callbackOrOptions);
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    if (!this.subscriptionHandle) {
      const callback = args[0];

      if (!_.isFunction(callback)) {
        throw new Meteor.Error('You did not provide a valid callback');
      }

      this.fetch((err, res) => {
        callback(err, res ? _.first(res) : null);
      });
    } else {
      return _.first(this.fetch(...args));
    }
  }
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */


  getCountSync() {
    return Promise.asyncApply(() => {
      if (this._counter) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name + '.count', this.params));
    });
  }
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */


  getCount(callback) {
    if (this._counter) {
      return this._counter.getCount();
    } else {
      if (!callback) {
        throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the count or subscribe first.');
      } else {
        return Meteor.call(this.name + '.count', this.params, callback);
      }
    }
  }
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */


  _fetchStatic(callback) {
    if (!callback) {
      throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
    }

    Meteor.call(this.name, this.params, callback);
  }
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */


  _fetchReactive(options = {}) {
    let body = this.body;

    if (this.params.$body) {
      body = intersectDeep(body, this.params.$body);
    }

    body = prepareForProcess(body, this.params);

    if (!options.allowSkip && body.$options && body.$options.skip) {
      delete body.$options.skip;
    }

    return recursiveFetch(createGraph(this.collection, body), undefined, {
      scoped: this.options.scoped,
      subscriptionHandle: this.subscriptionHandle
    });
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let NamedQueryClient;
module.link("./namedQuery.client", {
  default(v) {
    NamedQueryClient = v;
  }

}, 0);
let NamedQueryServer;
module.link("./namedQuery.server", {
  default(v) {
    NamedQueryServer = v;
  }

}, 1);
let NamedQuery;

if (Meteor.isServer) {
  NamedQuery = NamedQueryServer;
} else {
  NamedQuery = NamedQueryClient;
}

module.exportDefault(NamedQuery);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.server.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let prepareForProcess;
module.link("../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 0);
let Base;
module.link("./namedQuery.base", {
  default(v) {
    Base = v;
  }

}, 1);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 2);
let MemoryResultCacher;
module.link("./cache/MemoryResultCacher", {
  default(v) {
    MemoryResultCacher = v;
  }

}, 3);
let intersectDeep;
module.link("../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 4);
module.exportDefault(class extends Base {
  /**
   * Retrieves the data.
   * @returns {*}
   */
  fetch(context) {
    this._performSecurityChecks(context, this.params);

    if (this.isResolver) {
      return this._fetchResolverData(context);
    } else {
      body = deepClone(this.body);

      if (this.params.$body) {
        body = intersectDeep(body, this.params.$body);
      } // we must apply emobdyment here


      this.doEmbodimentIfItApplies(body, this.params);
      const query = this.collection.createQuery(deepClone(body), {
        params: deepClone(this.params)
      });

      if (this.cacher) {
        const cacheId = this.cacher.generateQueryId(this.queryName, this.params);
        return this.cacher.fetch(cacheId, {
          query
        });
      }

      return query.fetch();
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    return _.first(this.fetch(...args));
  }
  /**
   * Gets the count of matching elements.
   *
   * @returns {any}
   */


  getCount(context) {
    this._performSecurityChecks(context, this.params);

    const countCursor = this.getCursorForCounting();

    if (this.cacher) {
      const cacheId = 'count::' + this.cacher.generateQueryId(this.queryName, this.params);
      return this.cacher.fetch(cacheId, {
        countCursor
      });
    }

    return countCursor.count();
  }
  /**
   * Returns the cursor for counting
   * This is most likely used for counts cursor
   */


  getCursorForCounting() {
    let body = deepClone(this.body);
    this.doEmbodimentIfItApplies(body, this.params);
    body = prepareForProcess(body, this.params);
    return this.collection.find(body.$filters || {}, {
      fields: {
        _id: 1
      }
    });
  }
  /**
   * @param cacher
   */


  cacheResults(cacher) {
    if (!cacher) {
      cacher = new MemoryResultCacher();
    }

    this.cacher = cacher;
  }
  /**
   * Configure resolve. This doesn't actually call the resolver, it just sets it
   * @param fn
   */


  resolve(fn) {
    if (!this.isResolver) {
      throw new Meteor.Error('invalid-call', `You cannot use resolve() on a non resolver NamedQuery`);
    }

    this.resolver = fn;
  }
  /**
   * @returns {*}
   * @private
   */


  _fetchResolverData(context) {
    const resolver = this.resolver;
    const self = this;
    const query = {
      fetch() {
        return resolver.call(context, self.params);
      }

    };

    if (this.cacher) {
      const cacheId = this.cacher.generateQueryId(this.queryName, this.params);
      return this.cacher.fetch(cacheId, {
        query
      });
    }

    return query.fetch();
  }
  /**
   * @param context Meteor method/publish context
   * @param params
   *
   * @private
   */


  _performSecurityChecks(context, params) {
    if (context && this.exposeConfig) {
      this._callFirewall(context, context.userId, params);
    }

    this.doValidateParams(params);
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"store.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/store.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(new class {
  constructor() {
    this.storage = {};
  }

  add(key, value) {
    if (this.storage[key]) {
      throw new Meteor.Error('invalid-name', `You have previously defined another namedQuery with the same name: "${key}". Named Query names should be unique.`);
    }

    this.storage[key] = value;
  }

  get(key) {
    return this.storage[key];
  }

  getAll() {
    return this.storage;
  }

}());
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cache":{"BaseResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/BaseResultCacher.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => BaseResultCacher
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);

class BaseResultCacher {
  constructor(config = {}) {
    this.config = config;
  }
  /**
   * @param queryName
   * @param params
   * @returns {string}
   */


  generateQueryId(queryName, params) {
    return `${queryName}::${EJSON.stringify(params)}`;
  }
  /**
   * Dummy function
   */


  fetch(cacheId, {
    query,
    countCursor
  }) {
    throw 'Not implemented';
  }
  /**
   * @param query
   * @param countCursor
   * @returns {*}
   */


  static fetchData({
    query,
    countCursor
  }) {
    if (query) {
      return query.fetch();
    } else {
      return countCursor.count();
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MemoryResultCacher.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/cache/MemoryResultCacher.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => MemoryResultCacher
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let cloneDeep;
module.link("lodash.clonedeep", {
  default(v) {
    cloneDeep = v;
  }

}, 1);
let BaseResultCacher;
module.link("./BaseResultCacher", {
  default(v) {
    BaseResultCacher = v;
  }

}, 2);
const DEFAULT_TTL = 60000;
/**
 * This is a very basic in-memory result caching functionality
 */

class MemoryResultCacher extends BaseResultCacher {
  constructor(config = {}) {
    super(config);
    this.store = {};
  }
  /**
   * @param cacheId
   * @param query
   * @param countCursor
   * @returns {*}
   */


  fetch(cacheId, {
    query,
    countCursor
  }) {
    const cacheData = this.store[cacheId];

    if (cacheData !== undefined) {
      return cloneDeep(cacheData);
    }

    const data = BaseResultCacher.fetchData({
      query,
      countCursor
    });
    this.storeData(cacheId, data);
    return data;
  }
  /**
   * @param cacheId
   * @param data
   */


  storeData(cacheId, data) {
    const ttl = this.config.ttl || DEFAULT_TTL;
    this.store[cacheId] = cloneDeep(data);
    Meteor.setTimeout(() => {
      delete this.store[cacheId];
    }, ttl);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"expose":{"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/extension.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let NamedQuery;
module.link("../namedQuery.js", {
  default(v) {
    NamedQuery = v;
  }

}, 0);
let ExposeSchema, ExposeDefaults;
module.link("./schema.js", {
  ExposeSchema(v) {
    ExposeSchema = v;
  },

  ExposeDefaults(v) {
    ExposeDefaults = v;
  }

}, 1);
let mergeDeep;
module.link("./lib/mergeDeep.js", {
  default(v) {
    mergeDeep = v;
  }

}, 2);
let createGraph;
module.link("../../query/lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 3);
let recursiveCompose;
module.link("../../query/lib/recursiveCompose.js", {
  default(v) {
    recursiveCompose = v;
  }

}, 4);
let prepareForProcess;
module.link("../../query/lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 5);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 6);
let intersectDeep;
module.link("../../query/lib/intersectDeep", {
  default(v) {
    intersectDeep = v;
  }

}, 7);
let genCountEndpoint;
module.link("../../query/counts/genEndpoint.server", {
  default(v) {
    genCountEndpoint = v;
  }

}, 8);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 9);

_.extend(NamedQuery.prototype, {
  /**
   * @param config
   */
  expose(config = {}) {
    if (!Meteor.isServer) {
      throw new Meteor.Error('invalid-environment', `You must run this in server-side code`);
    }

    if (this.isExposed) {
      throw new Meteor.Error('query-already-exposed', `You have already exposed: "${this.name}" named query`);
    }

    this.exposeConfig = Object.assign({}, ExposeDefaults, config);
    check(this.exposeConfig, ExposeSchema);

    if (this.exposeConfig.validateParams) {
      this.options.validateParams = this.exposeConfig.validateParams;
    }

    if (!this.isResolver) {
      this._initNormalQuery();
    } else {
      this._initMethod();
    }

    this.isExposed = true;
  },

  /**
   * Initializes a normal NamedQuery (normal == not a resolver)
   * @private
   */
  _initNormalQuery() {
    const config = this.exposeConfig;

    if (config.method) {
      this._initMethod();
    }

    if (config.publication) {
      this._initPublication();
    }

    if (!config.method && !config.publication) {
      throw new Meteor.Error('weird', 'If you want to expose your named query you need to specify at least one of ["method", "publication"] options to true');
    }

    this._initCountMethod();

    this._initCountPublication();
  },

  /**
   * Returns the embodied body of the request
   * @param {*} _embody
   * @param {*} body
   */
  doEmbodimentIfItApplies(body, params) {
    // query is not exposed yet, so it doesn't have embodiment logic
    if (!this.exposeConfig) {
      return;
    }

    const {
      embody
    } = this.exposeConfig;

    if (!embody) {
      return;
    }

    if (_.isFunction(embody)) {
      embody.call(this, body, params);
    } else {
      mergeDeep(body, embody);
    }
  },

  /**
   * @private
   */
  _initMethod() {
    const self = this;
    Meteor.methods({
      [this.name](newParams) {
        self._unblockIfNecessary(this); // security is done in the fetching because we provide a context


        return self.clone(newParams).fetch(this);
      }

    });
  },

  /**
   * @returns {void}
   * @private
   */
  _initCountMethod() {
    const self = this;
    Meteor.methods({
      [this.name + '.count'](newParams) {
        self._unblockIfNecessary(this); // security is done in the fetching because we provide a context


        return self.clone(newParams).getCount(this);
      }

    });
  },

  /**
   * @returns {*}
   * @private
   */
  _initCountPublication() {
    const self = this;
    genCountEndpoint(self.name, {
      getCursor({
        session
      }) {
        const query = self.clone(session.params);
        return query.getCursorForCounting();
      },

      getSession(params) {
        self.doValidateParams(params);

        self._callFirewall(this, this.userId, params);

        return {
          name: self.name,
          params
        };
      }

    });
  },

  /**
   * @private
   */
  _initPublication() {
    const self = this;
    Meteor.publishComposite(this.name, function (params = {}) {
      const isScoped = !!self.options.scoped;

      if (isScoped) {
        this.enableScope();
      }

      self._unblockIfNecessary(this);

      self.doValidateParams(params);

      self._callFirewall(this, this.userId, params);

      let body = deepClone(self.body);

      if (params.$body) {
        body = intersectDeep(body, params.$body);
      }

      self.doEmbodimentIfItApplies(body, params);
      body = prepareForProcess(body, params);
      const rootNode = createGraph(self.collection, body);
      return recursiveCompose(rootNode, undefined, {
        scoped: isScoped
      });
    });
  },

  /**
   * @param context
   * @param userId
   * @param params
   * @private
   */
  _callFirewall(context, userId, params) {
    const {
      firewall
    } = this.exposeConfig;

    if (!firewall) {
      return;
    }

    if (_.isArray(firewall)) {
      firewall.forEach(fire => {
        fire.call(context, userId, params);
      });
    } else {
      firewall.call(context, userId, params);
    }
  },

  /**
   * @param context
   * @private
   */
  _unblockIfNecessary(context) {
    if (this.exposeConfig.unblock) {
      if (context.unblock) {
        context.unblock();
      }
    }
  }

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"schema.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/schema.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  ExposeDefaults: () => ExposeDefaults,
  ExposeSchema: () => ExposeSchema
});
let Match;
module.link("meteor/check", {
  Match(v) {
    Match = v;
  }

}, 0);
const ExposeDefaults = {
  publication: true,
  method: true,
  unblock: true
};
const ExposeSchema = {
  firewall: Match.Maybe(Match.OneOf(Function, [Function])),
  publication: Match.Maybe(Boolean),
  unblock: Match.Maybe(Boolean),
  method: Match.Maybe(Boolean),
  embody: Match.Maybe(Match.OneOf(Object, Function)),
  validateParams: Match.Maybe(Match.OneOf(Object, Function))
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"mergeDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/namedQuery/expose/lib/mergeDeep.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => mergeDeep
});

function mergeDeep(target, source) {
  if (_.isObject(target) && _.isObject(source)) {
    _.each(source, (value, key) => {
      if (_.isFunction(source[key])) {
        target[key] = source[key];
      } else if (_.isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    });
  }

  return target;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"query":{"query.base.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.base.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => QueryBase
});
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 0);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 1);

class QueryBase {
  constructor(collection, body, options = {}) {
    this.isGlobalQuery = true;
    this.collection = collection;
    this.body = deepClone(body);
    this.params = options.params || {};
    this.options = options;
  }

  clone(newParams) {
    const params = _.extend({}, deepClone(this.params), newParams);

    return new this.constructor(this.collection, deepClone(this.body), (0, _objectSpread2.default)({
      params
    }, this.options));
  }

  get name() {
    return `exposure_${this.collection._name}`;
  }
  /**
   * Validates the parameters
   */


  doValidateParams() {
    const {
      validateParams
    } = this.options;
    if (!validateParams) return;

    if (_.isFunction(validateParams)) {
      validateParams.call(null, this.params);
    } else {
      check(this.params);
    }
  }
  /**
   * Merges the params with previous params.
   *
   * @param params
   * @returns {Query}
   */


  setParams(params) {
    this.params = _.extend({}, this.params, params);
    return this;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.client.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Query
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let CountSubscription;
module.link("./counts/countSubscription", {
  default(v) {
    CountSubscription = v;
  }

}, 1);
let createGraph;
module.link("./lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 2);
let recursiveFetch;
module.link("./lib/recursiveFetch.js", {
  default(v) {
    recursiveFetch = v;
  }

}, 3);
let prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 4);
let callWithPromise;
module.link("./lib/callWithPromise", {
  default(v) {
    callWithPromise = v;
  }

}, 5);
let Base;
module.link("./query.base", {
  default(v) {
    Base = v;
  }

}, 6);

class Query extends Base {
  /**
   * Subscribe
   *
   * @param callback {Function} optional
   * @returns {null|any|*}
   */
  subscribe(callback) {
    this.doValidateParams();
    this.subscriptionHandle = Meteor.subscribe(this.name, prepareForProcess(this.body, this.params), callback);
    return this.subscriptionHandle;
  }
  /**
   * Subscribe to the counts for this query
   *
   * @param callback
   * @returns {Object}
   */


  subscribeCount(callback) {
    this.doValidateParams();

    if (!this._counter) {
      this._counter = new CountSubscription(this);
    }

    return this._counter.subscribe(prepareForProcess(this.body, this.params), callback);
  }
  /**
   * Unsubscribe if an existing subscription exists
   */


  unsubscribe() {
    if (this.subscriptionHandle) {
      this.subscriptionHandle.stop();
    }

    this.subscriptionHandle = null;
  }
  /**
   * Unsubscribe to the counts if a subscription exists.
   */


  unsubscribeCount() {
    if (this._counter) {
      this._counter.unsubscribe();

      this._counter = null;
    }
  }
  /**
   * Fetches elements in sync using promises
   * @return {*}
   */


  fetchSync() {
    return Promise.asyncApply(() => {
      this.doValidateParams();

      if (this.subscriptionHandle) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name, prepareForProcess(this.body, this.params)));
    });
  }
  /**
   * Fetches one element in sync
   * @return {*}
   */


  fetchOneSync() {
    return Promise.asyncApply(() => {
      return _.first(Promise.await(this.fetchSync()));
    });
  }
  /**
   * Retrieves the data.
   * @param callbackOrOptions
   * @returns {*}
   */


  fetch(callbackOrOptions) {
    this.doValidateParams();

    if (!this.subscriptionHandle) {
      return this._fetchStatic(callbackOrOptions);
    } else {
      return this._fetchReactive(callbackOrOptions);
    }
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    if (!this.subscriptionHandle) {
      const callback = args[0];

      if (!_.isFunction(callback)) {
        throw new Meteor.Error('You did not provide a valid callback');
      }

      this.fetch((err, res) => {
        callback(err, res ? _.first(res) : null);
      });
    } else {
      return _.first(this.fetch(...args));
    }
  }
  /**
   * Gets the count of matching elements in sync.
   * @returns {any}
   */


  getCountSync() {
    return Promise.asyncApply(() => {
      if (this._counter) {
        throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
      }

      return Promise.await(callWithPromise(this.name + '.count', prepareForProcess(this.body, this.params)));
    });
  }
  /**
   * Gets the count of matching elements.
   * @param callback
   * @returns {any}
   */


  getCount(callback) {
    if (this._counter) {
      return this._counter.getCount();
    } else {
      if (!callback) {
        throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the count or subscribe first.');
      } else {
        return Meteor.call(this.name + '.count', prepareForProcess(this.body, this.params), callback);
      }
    }
  }
  /**
   * Fetching non-reactive queries
   * @param callback
   * @private
   */


  _fetchStatic(callback) {
    if (!callback) {
      throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
    }

    Meteor.call(this.name, prepareForProcess(this.body, this.params), callback);
  }
  /**
   * Fetching when we've got an active publication
   *
   * @param options
   * @returns {*}
   * @private
   */


  _fetchReactive(options = {}) {
    let body = prepareForProcess(this.body, this.params);

    if (!options.allowSkip && body.$options && body.$options.skip) {
      delete body.$options.skip;
    }

    return recursiveFetch(createGraph(this.collection, body), this.params);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let QueryClient;
module.link("./query.client", {
  default(v) {
    QueryClient = v;
  }

}, 0);
let QueryServer;
module.link("./query.server", {
  default(v) {
    QueryServer = v;
  }

}, 1);
let Query;

if (Meteor.isServer) {
  Query = QueryServer;
} else {
  Query = QueryClient;
}

module.exportDefault(Query);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/query.server.js                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => Query
});
let createGraph;
module.link("./lib/createGraph.js", {
  default(v) {
    createGraph = v;
  }

}, 0);
let prepareForProcess;
module.link("./lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 1);
let hypernova;
module.link("./hypernova/hypernova.js", {
  default(v) {
    hypernova = v;
  }

}, 2);
let Base;
module.link("./query.base", {
  default(v) {
    Base = v;
  }

}, 3);

class Query extends Base {
  /**
   * Retrieves the data.
   * @param context
   * @returns {*}
   */
  fetch(context = {}) {
    const node = createGraph(this.collection, prepareForProcess(this.body, this.params));
    return hypernova(node, context.userId, {
      params: this.params
    });
  }
  /**
   * @param args
   * @returns {*}
   */


  fetchOne(...args) {
    return _.first(this.fetch(...args));
  }
  /**
   * Gets the count of matching elements.
   * @returns {integer}
   */


  getCount() {
    return this.collection.find(this.body.$filters || {}, {}).count();
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"counts":{"collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/collection.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let COUNTS_COLLECTION_CLIENT;
module.link("./constants", {
  COUNTS_COLLECTION_CLIENT(v) {
    COUNTS_COLLECTION_CLIENT = v;
  }

}, 1);
module.exportDefault(new Mongo.Collection(COUNTS_COLLECTION_CLIENT));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/constants.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  COUNTS_COLLECTION_CLIENT: () => COUNTS_COLLECTION_CLIENT
});
const COUNTS_COLLECTION_CLIENT = 'grapher_counts';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"countSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/countSubscription.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => CountSubscription
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let ReactiveVar;
module.link("meteor/reactive-var", {
  ReactiveVar(v) {
    ReactiveVar = v;
  }

}, 2);
let Tracker;
module.link("meteor/tracker", {
  Tracker(v) {
    Tracker = v;
  }

}, 3);
let Counts;
module.link("./collection", {
  default(v) {
    Counts = v;
  }

}, 4);
let createFauxSubscription;
module.link("./createFauxSubscription", {
  default(v) {
    createFauxSubscription = v;
  }

}, 5);
let prepareForProcess;
module.link("../lib/prepareForProcess.js", {
  default(v) {
    prepareForProcess = v;
  }

}, 6);
let NamedQueryBase;
module.link("../../namedQuery/namedQuery.base", {
  default(v) {
    NamedQueryBase = v;
  }

}, 7);

class CountSubscription {
  /**
   * @param {*} query - The query to use when fetching counts
   */
  constructor(query) {
    this.accessToken = new ReactiveVar(null);
    this.fauxHandle = null;
    this.query = query;
  }
  /**
   * Starts a subscription request for reactive counts.
   *
   * @param {*} arg - The argument to pass to {name}.count.subscribe
   * @param {*} callback
   */


  subscribe(arg, callback) {
    // Don't try to resubscribe if arg hasn't changed
    if (EJSON.equals(this.lastArgs, arg) && this.fauxHandle) {
      return this.fauxHandle;
    }

    this.accessToken.set(null);
    this.lastArgs = arg;
    Meteor.call(this.query.name + '.count.subscribe', arg, (error, token) => {
      if (!this._markedForUnsubscribe) {
        this.subscriptionHandle = Meteor.subscribe(this.query.name + '.count', token, callback);
        this.accessToken.set(token);
        this.disconnectComputation = Tracker.autorun(() => this.handleDisconnect());
      }

      this._markedForUnsubscribe = false;
    });
    this.fauxHandle = createFauxSubscription(this);
    return this.fauxHandle;
  }
  /**
   * Unsubscribes from the count endpoint, if there is such a subscription.
   */


  unsubscribe() {
    if (this.subscriptionHandle) {
      this.disconnectComputation.stop();
      this.subscriptionHandle.stop();
    } else {
      // If we hit this branch, then Meteor.call in subscribe hasn't finished yet
      // so set a flag to stop the subscription from being created
      this._markedForUnsubscribe = true;
    }

    this.accessToken.set(null);
    this.fauxHandle = null;
    this.subscriptionHandle = null;
  }
  /**
   * Reactively fetch current document count. Returns null if the subscription is not ready yet.
   *
   * @returns {Number|null} - Current document count
   */


  getCount() {
    const id = this.accessToken.get();
    if (id === null) return null;
    const doc = Counts.findOne(id);
    return doc.count;
  }
  /**
   * All session info gets deleted when the server goes down, so when the client attempts to
   * optimistically resume the '.count' publication, the server will throw a 'no-request' error.
   *
   * This function prevents that by manually stopping and restarting the subscription when the
   * connection to the server is lost.
   */


  handleDisconnect() {
    const status = Meteor.status();

    if (!status.connected) {
      this._markedForResume = true;
      this.fauxHandle = null;
      this.subscriptionHandle.stop();
    }

    if (status.connected && this._markedForResume) {
      this._markedForResume = false;
      this.subscribe(this.lastArgs);
    }
  }
  /**
   * Returns whether or not a subscription request has been made.
   */


  isSubscribed() {
    return this.accessToken.get() !== null;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createFauxSubscription.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/createFauxSubscription.js                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(countManager => ({
  ready: () => countManager.accessToken.get() !== null && countManager.subscriptionHandle.ready(),
  stop: () => countManager.unsubscribe()
}));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"genEndpoint.server.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/counts/genEndpoint.server.js                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 2);
let COUNTS_COLLECTION_CLIENT;
module.link("./constants", {
  COUNTS_COLLECTION_CLIENT(v) {
    COUNTS_COLLECTION_CLIENT = v;
  }

}, 3);
// XXX: Should this persist between server restarts?
const collection = new Mongo.Collection(null);
/**
 * This method generates a reactive count endpoint (a method and publication) for a collection or named query.
 *
 * @param {String} name - Name of the query or collection
 * @param {Function} getCursor - Takes in the user's session document as an argument, and turns that into a Mongo cursor.
 * @param {Function} getSession - Takes the subscribe method's argument as its parameter. Should enforce any necessary security constraints. The return value of this function is stored in the session document.
 */

module.exportDefault((name, {
  getCursor,
  getSession
}) => {
  Meteor.methods({
    [name + '.count.subscribe'](paramsOrBody) {
      const session = getSession.call(this, paramsOrBody);
      const sessionId = JSON.stringify(session);
      const existingSession = collection.findOne({
        session: sessionId,
        userId: this.userId
      }); // Try to reuse sessions if the user subscribes multiple times with the same data

      if (existingSession) {
        return existingSession._id;
      }

      const token = collection.insert({
        session: sessionId,
        query: name,
        userId: this.userId
      });
      return token;
    }

  });
  Meteor.publish(name + '.count', function (token) {
    check(token, String);
    const self = this;
    const request = collection.findOne({
      _id: token,
      userId: self.userId
    });

    if (!request) {
      throw new Error('no-request', `You must acquire a request token via the "${name}.count.subscribe" method first.`);
    }

    request.session = JSON.parse(request.session);
    const cursor = getCursor.call(this, request); // Start counting

    let count = 0;
    let isReady = false;
    const handle = cursor.observe({
      added() {
        count++;
        isReady && self.changed(COUNTS_COLLECTION_CLIENT, token, {
          count
        });
      },

      removed() {
        count--;
        isReady && self.changed(COUNTS_COLLECTION_CLIENT, token, {
          count
        });
      }

    });
    isReady = true;
    self.added(COUNTS_COLLECTION_CLIENT, token, {
      count
    });
    self.onStop(() => {
      handle.stop();
      collection.remove(token);
    });
    self.ready();
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hypernova":{"aggregateSearchFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/aggregateSearchFilters.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => AggregateFilters
});
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 0);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 1);

function extractIdsFromArray(array, field) {
  return (array || []).map(obj => _.isObject(obj) ? dot.pick(field, obj) : undefined).filter(v => !!v);
}
/**
 * Its purpose is to create filters to get the related data in one request.
 */


class AggregateFilters {
  constructor(collectionNode, metaFilters) {
    this.collectionNode = collectionNode;
    this.linker = collectionNode.linker;
    this.metaFilters = metaFilters;
    this.isVirtual = this.linker.isVirtual();
    this.linkStorageField = this.linker.linkStorageField;
  }

  get parentObjects() {
    return this.collectionNode.parent.results;
  }

  create() {
    switch (this.linker.strategy) {
      case 'one':
        return this.createOne();

      case 'one-meta':
        return this.createOneMeta();

      case 'many':
        return this.createMany();

      case 'many-meta':
        return this.createManyMeta();

      default:
        throw new Meteor.Error(`Invalid linker type: ${this.linker.type}`);
    }
  }

  createOne() {
    if (!this.isVirtual) {
      return {
        _id: {
          $in: _.uniq(extractIdsFromArray(this.parentObjects, this.linkStorageField))
        }
      };
    } else {
      return {
        [this.linkStorageField]: {
          $in: _.uniq(_.pluck(this.parentObjects, '_id'))
        }
      };
    }
  }

  createOneMeta() {
    if (!this.isVirtual) {
      let eligibleObjects = this.parentObjects;

      if (this.metaFilters) {
        eligibleObjects = _.filter(this.parentObjects, object => {
          return sift(this.metaFilters)(object[this.linkStorageField]);
        });
      }

      const storages = _.pluck(eligibleObjects, this.linkStorageField);

      let ids = [];

      _.each(storages, storage => {
        if (storage) {
          ids.push(storage._id);
        }
      });

      return {
        _id: {
          $in: _.uniq(ids)
        }
      };
    } else {
      let filters = {};

      if (this.metaFilters) {
        _.each(this.metaFilters, (value, key) => {
          filters[this.linkStorageField + '.' + key] = value;
        });
      }

      filters[this.linkStorageField + '._id'] = {
        $in: _.uniq(_.pluck(this.parentObjects, '_id'))
      };
      return filters;
    }
  }

  createMany() {
    if (!this.isVirtual) {
      const [root, ...nested] = this.linkStorageField.split('.');

      const arrayOfIds = _.union(...extractIdsFromArray(this.parentObjects, root));

      return {
        _id: {
          $in: _.uniq(nested.length > 0 ? extractIdsFromArray(arrayOfIds, nested.join('.')) : arrayOfIds)
        }
      };
    } else {
      const arrayOfIds = _.pluck(this.parentObjects, '_id');

      return {
        [this.linkStorageField]: {
          $in: _.uniq(_.union(...arrayOfIds))
        }
      };
    }
  }

  createManyMeta() {
    if (!this.isVirtual) {
      let ids = [];

      _.each(this.parentObjects, object => {
        if (object[this.linkStorageField]) {
          if (this.metaFilters) {
            const isValid = sift(this.metaFilters);

            _.each(object[this.linkStorageField], object => {
              if (isValid(object)) {
                ids.push(object._id);
              }
            });
          } else {
            _.each(object[this.linkStorageField], object => {
              ids.push(object._id);
            });
          }
        }
      });

      return {
        _id: {
          $in: _.uniq(ids)
        }
      };
    } else {
      let filters = {};

      if (this.metaFilters) {
        _.each(this.metaFilters, (value, key) => {
          filters[key] = value;
        });
      }

      filters._id = {
        $in: _.uniq(_.pluck(this.parentObjects, '_id'))
      };
      return {
        [this.linkStorageField]: {
          $elemMatch: filters
        }
      };
    }
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembleAggregateResults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/assembleAggregateResults.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 0);
let cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  default(v) {
    cleanObjectForMetaFilters = v;
  }

}, 1);
module.exportDefault(function (childCollectionNode, aggregateResults, metaFilters) {
  const linker = childCollectionNode.linker;
  const linkStorageField = linker.linkStorageField;
  const linkName = childCollectionNode.linkName;
  const isMeta = linker.isMeta();
  const isMany = linker.isMany();
  let allResults = [];

  if (isMeta && metaFilters) {
    const metaFiltersTest = sift(metaFilters);

    _.each(childCollectionNode.parent.results, parentResult => {
      cleanObjectForMetaFilters(parentResult, linkStorageField, metaFiltersTest);
    });
  }

  if (isMeta && isMany) {
    // This case is treated differently because we get an array response from the pipeline.
    _.each(childCollectionNode.parent.results, parentResult => {
      parentResult[linkName] = parentResult[linkName] || [];

      const eligibleAggregateResults = _.filter(aggregateResults, aggregateResult => {
        return _.contains(aggregateResult._id, parentResult._id);
      });

      if (eligibleAggregateResults.length) {
        const datas = _.pluck(eligibleAggregateResults, 'data'); /// [ [x1, x2], [x2, x3] ]


        _.each(datas, data => {
          _.each(data, item => {
            parentResult[linkName].push(item);
          });
        });
      }
    });

    _.each(aggregateResults, aggregateResult => {
      _.each(aggregateResult.data, item => allResults.push(item));
    });
  } else {
    let comparator;

    if (isMany) {
      comparator = (aggregateResult, result) => _.contains(aggregateResult._id, result._id);
    } else {
      comparator = (aggregateResult, result) => aggregateResult._id == result._id;
    }

    const childLinkName = childCollectionNode.linkName;
    const parentResults = childCollectionNode.parent.results;
    parentResults.forEach(parentResult => {
      // We are now finding the data from the pipeline that is related to the _id of the parent
      const eligibleAggregateResults = aggregateResults.filter(aggregateResult => comparator(aggregateResult, parentResult));
      eligibleAggregateResults.forEach(aggregateResult => {
        if (Array.isArray(parentResult[childLinkName])) {
          parentResult[childLinkName].push(...aggregateResult.data);
        } else {
          parentResult[childLinkName] = [...aggregateResult.data];
        }
      });
    });
    aggregateResults.forEach(aggregateResult => {
      allResults.push(...aggregateResult.data);
    });
  }

  childCollectionNode.results = allResults;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembler.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/assembler.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let createSearchFilters;
module.link("../../links/lib/createSearchFilters", {
  default(v) {
    createSearchFilters = v;
  }

}, 0);
let cleanObjectForMetaFilters;
module.link("./lib/cleanObjectForMetaFilters", {
  default(v) {
    cleanObjectForMetaFilters = v;
  }

}, 1);
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 2);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 3);
module.exportDefault((childCollectionNode, {
  limit,
  skip,
  metaFilters
}) => {
  if (childCollectionNode.results.length === 0) {
    return;
  }

  const parent = childCollectionNode.parent;
  const linker = childCollectionNode.linker;
  const strategy = linker.strategy;
  const isSingle = linker.isSingle();
  const isMeta = linker.isMeta();
  const fieldStorage = linker.linkStorageField; // cleaning the parent results from a child
  // this may be the wrong approach but it works for now

  if (isMeta && metaFilters) {
    const metaFiltersTest = sift(metaFilters);

    _.each(parent.results, parentResult => {
      cleanObjectForMetaFilters(parentResult, fieldStorage, metaFiltersTest);
    });
  }

  const resultsByKeyId = _.groupBy(childCollectionNode.results, '_id');

  if (strategy === 'one') {
    parent.results.forEach(parentResult => {
      const value = dot.pick(fieldStorage, parentResult);

      if (!value) {
        return;
      }

      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[value], {
        limit,
        skip
      });
    });
  }

  if (strategy === 'many') {
    parent.results.forEach(parentResult => {
      // support dotted fields
      const [root, ...nested] = fieldStorage.split('.');
      const value = dot.pick(root, parentResult);

      if (!value) {
        return;
      }

      const data = [];
      value.forEach(v => {
        const _id = nested.length > 0 ? dot.pick(nested.join('.'), v) : v;

        data.push(_.first(resultsByKeyId[_id]));
      });
      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit,
        skip
      });
    });
  }

  if (strategy === 'one-meta') {
    parent.results.forEach(parentResult => {
      if (!parentResult[fieldStorage]) {
        return;
      }

      const _id = parentResult[fieldStorage]._id;
      parentResult[childCollectionNode.linkName] = filterAssembledData(resultsByKeyId[_id], {
        limit,
        skip
      });
    });
  }

  if (strategy === 'many-meta') {
    parent.results.forEach(parentResult => {
      const _ids = _.pluck(parentResult[fieldStorage], '_id');

      let data = [];

      _ids.forEach(_id => {
        data.push(_.first(resultsByKeyId[_id]));
      });

      parentResult[childCollectionNode.linkName] = filterAssembledData(data, {
        limit,
        skip
      });
    });
  }
});

function filterAssembledData(data, {
  limit,
  skip
}) {
  if (limit && Array.isArray(data)) {
    return data.slice(skip, limit);
  }

  return data;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"buildAggregatePipeline.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/buildAggregatePipeline.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("./constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT(v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }

}, 1);
module.exportDefault(function (childCollectionNode, filters, options, userId) {
  let containsDottedFields = false;
  const linker = childCollectionNode.linker;
  const linkStorageField = linker.linkStorageField;
  const collection = childCollectionNode.collection;
  let pipeline = [];

  if (collection.firewall) {
    collection.firewall(filters, options, userId);
  }

  filters = cleanUndefinedLeafs(filters);
  pipeline.push({
    $match: filters
  });

  if (options.sort && _.keys(options.sort).length > 0) {
    pipeline.push({
      $sort: options.sort
    });
  }

  let _id = linkStorageField;

  if (linker.isMeta()) {
    _id += '._id';
  }

  let dataPush = {
    _id: '$_id'
  };

  _.each(options.fields, (value, field) => {
    if (field.indexOf('.') >= 0) {
      containsDottedFields = true;
    }

    const safeField = field.replace(/\./g, SAFE_DOTTED_FIELD_REPLACEMENT);
    dataPush[safeField] = '$' + field;
  });

  if (linker.isMeta()) {
    dataPush[linkStorageField] = '$' + linkStorageField;
  }

  pipeline.push({
    $group: {
      _id: "$" + _id,
      data: {
        $push: dataPush
      }
    }
  });

  if (options.limit || options.skip) {
    let $slice = ["$data"];
    if (options.skip) $slice.push(options.skip);
    if (options.limit) $slice.push(options.limit);
    pipeline.push({
      $project: {
        _id: 1,
        data: {
          $slice
        }
      }
    });
  }

  function cleanUndefinedLeafs(tree) {
    const a = Object.assign({}, tree);

    _.each(a, (value, key) => {
      if (value === undefined) {
        delete a[key];
      }

      if (!_.isArray(value) && _.isObject(value)) {
        a[key] = cleanUndefinedLeafs(value);
      }
    });

    return a;
  }

  return {
    pipeline,
    containsDottedFields
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/constants.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  SAFE_DOTTED_FIELD_REPLACEMENT: () => SAFE_DOTTED_FIELD_REPLACEMENT
});
const SAFE_DOTTED_FIELD_REPLACEMENT = '___';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hypernova.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/hypernova.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => hypernovaInit
});
let applyProps;
module.link("../lib/applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let prepareForDelivery;
module.link("../lib/prepareForDelivery.js", {
  default(v) {
    prepareForDelivery = v;
  }

}, 1);
let storeHypernovaResults;
module.link("./storeHypernovaResults.js", {
  default(v) {
    storeHypernovaResults = v;
  }

}, 2);

function hypernova(collectionNode, userId) {
  _.each(collectionNode.collectionNodes, childCollectionNode => {
    let {
      filters,
      options
    } = applyProps(childCollectionNode);
    storeHypernovaResults(childCollectionNode, userId);
    hypernova(childCollectionNode, userId);
  });
}

function hypernovaInit(collectionNode, userId, config = {}) {
  const bypassFirewalls = config.bypassFirewalls || false;
  const params = config.params || {};
  let {
    filters,
    options
  } = applyProps(collectionNode);
  const collection = collectionNode.collection;
  collectionNode.results = collection.find(filters, options, userId).fetch();
  const userIdToPass = config.bypassFirewalls ? undefined : userId;
  hypernova(collectionNode, userIdToPass);
  prepareForDelivery(collectionNode, params);
  return collectionNode.results;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"storeHypernovaResults.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/storeHypernovaResults.js                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => storeHypernovaResults
});
let applyProps;
module.link("../lib/applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let AggregateFilters;
module.link("./aggregateSearchFilters.js", {
  default(v) {
    AggregateFilters = v;
  }

}, 1);
let assemble;
module.link("./assembler.js", {
  default(v) {
    assemble = v;
  }

}, 2);
let assembleAggregateResults;
module.link("./assembleAggregateResults.js", {
  default(v) {
    assembleAggregateResults = v;
  }

}, 3);
let buildAggregatePipeline;
module.link("./buildAggregatePipeline.js", {
  default(v) {
    buildAggregatePipeline = v;
  }

}, 4);
let snapBackDottedFields;
module.link("./lib/snapBackDottedFields", {
  default(v) {
    snapBackDottedFields = v;
  }

}, 5);

function storeHypernovaResults(childCollectionNode, userId) {
  if (childCollectionNode.parent.results.length === 0) {
    return childCollectionNode.results = [];
  }

  let {
    filters,
    options
  } = applyProps(childCollectionNode);
  const metaFilters = filters.$meta;
  const aggregateFilters = new AggregateFilters(childCollectionNode, metaFilters);
  delete filters.$meta;
  const linker = childCollectionNode.linker;
  const isVirtual = linker.isVirtual();
  const collection = childCollectionNode.collection;

  _.extend(filters, aggregateFilters.create()); // if it's not virtual then we retrieve them and assemble them here.


  if (!isVirtual) {
    const filteredOptions = _.omit(options, 'limit');

    childCollectionNode.results = collection.find(filters, filteredOptions, userId).fetch();
    assemble(childCollectionNode, (0, _objectSpread2.default)({}, options, {
      metaFilters
    }));
  } else {
    // virtuals arrive here
    let {
      pipeline,
      containsDottedFields
    } = buildAggregatePipeline(childCollectionNode, filters, options, userId);
    let aggregateResults = collection.aggregate(pipeline);
    /**
     * If in aggregation it contains '.', we replace it with a custom string '___'
     * And then after aggregation is complete we need to snap-it back to how it was.
     */

    if (containsDottedFields) {
      snapBackDottedFields(aggregateResults);
    }

    assembleAggregateResults(childCollectionNode, aggregateResults, metaFilters);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanObjectForMetaFilters.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/cleanObjectForMetaFilters.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(function (object, field, metaFiltersTest) {
  if (object[field]) {
    if (_.isArray(object[field])) {
      object[field] = object[field].filter(metaFiltersTest);
    } else {
      if (!metaFiltersTest(object[field])) {
        object[field] = null;
      }
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"snapBackDottedFields.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/snapBackDottedFields.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let SAFE_DOTTED_FIELD_REPLACEMENT;
module.link("../constants", {
  SAFE_DOTTED_FIELD_REPLACEMENT(v) {
    SAFE_DOTTED_FIELD_REPLACEMENT = v;
  }

}, 0);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 1);
module.exportDefault(function (aggregationResult) {
  aggregationResult.forEach(result => {
    result.data = result.data.map(document => {
      _.each(document, (value, key) => {
        if (key.indexOf(SAFE_DOTTED_FIELD_REPLACEMENT) >= 0) {
          document[key.replace(new RegExp(SAFE_DOTTED_FIELD_REPLACEMENT, 'g'), '.')] = value;
          delete document[key];
        }
      });

      return dot.object(document);
    });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lib":{"applyProps.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/applyProps.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => applyProps
});
const restrictOptions = ['disableOplog', 'pollingIntervalMs', 'pollingThrottleMs'];

function applyProps(node) {
  let filters = Object.assign({}, node.props.$filters);
  let options = Object.assign({}, node.props.$options);
  options = _.omit(options, ...restrictOptions);
  options.fields = options.fields || {};
  node.applyFields(filters, options);
  return {
    filters,
    options
  };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callWithPromise.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/callWithPromise.js                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault((method, myParameters) => {
  return new Promise((resolve, reject) => {
    Meteor.call(method, myParameters, (err, res) => {
      if (err) reject(err.reason || 'Something went wrong.');
      resolve(res);
    });
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createGraph.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/createGraph.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  specialFields: () => specialFields,
  createNodes: () => createNodes,
  addFieldNode: () => addFieldNode,
  getNodeNamespace: () => getNodeNamespace
});
let CollectionNode;
module.link("../nodes/collectionNode.js", {
  default(v) {
    CollectionNode = v;
  }

}, 0);
let FieldNode;
module.link("../nodes/fieldNode.js", {
  default(v) {
    FieldNode = v;
  }

}, 1);
let ReducerNode;
module.link("../nodes/reducerNode.js", {
  default(v) {
    ReducerNode = v;
  }

}, 2);
let dotize;
module.link("./dotize.js", {
  default(v) {
    dotize = v;
  }

}, 3);
let createReducers;
module.link("../reducers/lib/createReducers", {
  default(v) {
    createReducers = v;
  }

}, 4);
const specialFields = ['$filters', '$options', '$postFilters', '$postOptions', '$postFilter'];

function createNodes(root) {
  // this is a fix for phantomjs tests (don't really understand it.)
  if (!_.isObject(root.body)) {
    return;
  }

  _.each(root.body, (body, fieldName) => {
    if (!body) {
      return;
    } // if it's a prop


    if (_.contains(specialFields, fieldName)) {
      root.addProp(fieldName, body);
      return;
    } // workaround, see https://github.com/cult-of-coders/grapher/issues/134
    // TODO: find another way to do this


    if (root.collection.default) {
      root.collection = root.collection.default;
    } // checking if it is a link.


    let linker = root.collection.getLinker(fieldName);

    if (linker) {
      // check if it is a cached link
      // if yes, then we need to explicitly define this at collection level
      // so when we transform the data for delivery, we move it to the link name
      if (linker.isDenormalized()) {
        if (linker.isSubBodyDenormalized(body)) {
          handleDenormalized(root, linker, body, fieldName);
          return;
        }
      }

      let subroot = new CollectionNode(linker.getLinkedCollection(), body, fieldName); // must be before adding linker because _shouldCleanStorage method

      createNodes(subroot);
      root.add(subroot, linker);
      return;
    } // checking if it's a reducer


    const reducer = root.collection.getReducer(fieldName);

    if (reducer) {
      let reducerNode = new ReducerNode(fieldName, reducer);
      root.add(reducerNode);
    } // it's most likely a field then


    addFieldNode(body, fieldName, root);
  });

  createReducers(root);

  if (root.fieldNodes.length === 0) {
    root.add(new FieldNode('_id', 1));
  }
}

function isProjectionOperatorExpression(body) {
  if (_.isObject(body)) {
    const keys = _.keys(body);

    return keys.length === 1 && _.contains(['$elemMatch', '$meta', '$slice'], keys[0]);
  }

  return false;
}
/**
 * @param body
 * @param fieldName
 * @param root
 */


function addFieldNode(body, fieldName, root) {
  // it's not a link and not a special variable => we assume it's a field
  if (_.isObject(body)) {
    if (!isProjectionOperatorExpression(body)) {
      let dotted = dotize.convert({
        [fieldName]: body
      });

      _.each(dotted, (value, key) => {
        root.add(new FieldNode(key, value));
      });
    } else {
      root.add(new FieldNode(fieldName, body, true));
    }
  } else {
    let fieldNode = new FieldNode(fieldName, body);
    root.add(fieldNode);
  }
}

function getNodeNamespace(node) {
  const parts = [];
  let n = node;

  while (n) {
    const name = n.linker ? n.linker.linkName : n.collection._name;
    parts.push(name); // console.log('linker', node.linker ? node.linker.linkName : node.collection._name);

    n = n.parent;
  }

  return parts.reverse().join('_');
}

module.exportDefault(function (collection, body) {
  let root = new CollectionNode(collection, body);
  createNodes(root);
  return root;
});
;
/**
 * Ads denormalization config properly, including _id
 *
 * @param root
 * @param linker
 * @param body
 * @param fieldName
 */

function handleDenormalized(root, linker, body, fieldName) {
  Object.assign(body, {
    _id: 1
  });
  const cacheField = linker.linkConfig.denormalize.field;
  root.snapCache(cacheField, fieldName); // if it's one and direct also include the link storage

  if (!linker.isMany() && !linker.isVirtual()) {
    addFieldNode(1, linker.linkStorageField, root);
  }

  addFieldNode(body, cacheField, root);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dotize.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/dotize.js                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exportDefault(dotize = {});

dotize.convert = function (obj, prefix) {
  if ((!obj || typeof obj != "object") && !Array.isArray(obj)) {
    if (prefix) {
      var newObj = {};
      newObj[prefix] = obj;
      return newObj;
    } else {
      return obj;
    }
  }

  var newObj = {};

  function recurse(o, p, isArrayItem) {
    for (var f in o) {
      if (o[f] && typeof o[f] === "object") {
        if (Array.isArray(o[f])) {
          if (isEmptyArray(o[f])) {
            newObj[getFieldName(f, p, true)] = o[f]; // empty array
          } else {
            newObj = recurse(o[f], getFieldName(f, p, false, true), true); // array
          }
        } else {
          if (isArrayItem) {
            if (isEmptyObj(o[f])) {
              newObj[getFieldName(f, p, true)] = o[f]; // empty object
            } else {
              newObj = recurse(o[f], getFieldName(f, p, true)); // array item object
            }
          } else {
            if (isEmptyObj(o[f])) {
              newObj[getFieldName(f, p)] = o[f]; // empty object
            } else {
              newObj = recurse(o[f], getFieldName(f, p)); // object
            }
          }
        }
      } else {
        if (isArrayItem || isNumber(f)) {
          newObj[getFieldName(f, p, true)] = o[f]; // array item primitive
        } else {
          newObj[getFieldName(f, p)] = o[f]; // primitive
        }
      }
    }

    if (isEmptyObj(newObj)) return obj;
    return newObj;
  }

  function isNumber(f) {
    return !isNaN(parseInt(f));
  }

  function isEmptyObj(obj) {
    for (var prop in obj) {
      if (Object.hasOwnProperty.call(obj, prop)) return false;
    }

    return true;
  }

  function isEmptyArray(o) {
    if (Array.isArray(o) && o.length == 0) return true;
    return false;
  }

  function getFieldName(field, prefix, isArrayItem, isArray) {
    if (isArray) return (prefix ? prefix : "") + (isNumber(field) ? "[" + field + "]" : "." + field);else if (isArrayItem) return (prefix ? prefix : "") + "[" + field + "]";else return (prefix ? prefix + "." : "") + field;
  }

  return recurse(obj, prefix, Array.isArray(obj));
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fieldInProjection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/fieldInProjection.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  expandField: () => expandField,
  isFieldInProjection: () => isFieldInProjection
});

function expandField(fieldName) {
  const parts = fieldName.split('.');
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    result.push(parts.slice(0, i + 1).join('.'));
  }

  return result;
}

function isFieldInProjection(projection, fieldName, checkNested) {
  // for checkNested flag expand the field
  const fields = checkNested ? expandField(fieldName) : [fieldName];
  return fields.some(field => projection[field]);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"intersectDeep.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/intersectDeep.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let specialFields;
module.link("./createGraph", {
  specialFields(v) {
    specialFields = v;
  }

}, 1);
const EXTENDED_SPECIAL_FIELDS = [...specialFields, '$filter', '$paginate'];

function isClientValueValid(value) {
  if (_.isObject(value) && !_.isArray(value)) {
    return _.values(value).every(nestedValue => isClientValueValid(nestedValue));
  } else if (value === 1) {
    return true;
  }

  return false;
}
/**
 * 
 * Recursive function which intersects the fields of the body objects.
 * 
 * @param {object} allowed allowed body object - intersection can only be a subset of it
 * @param {object} client client body - can shrink main body, but not expand
 */


function intersectFields(allowed, client) {
  const intersection = {};

  _.pairs(client).forEach(([field, clientValue]) => {
    if (_.contains(EXTENDED_SPECIAL_FIELDS, field)) {
      return;
    }

    const serverValue = allowed[field];

    if (serverValue === 1) {
      // server allows everything
      if (isClientValueValid(clientValue)) {
        intersection[field] = clientValue;
      }
    } else if (_.isObject(serverValue)) {
      if (_.isObject(clientValue) && !_.isArray(clientValue)) {
        intersection[field] = intersectFields(serverValue, clientValue);
      } else if (clientValue === 1) {
        // if client wants everything, serverValue is more restrictive here
        intersection[field] = serverValue;
      }
    }
  });

  return intersection;
}
/**
 * Given a named query that has a specific body, you can query its subbody
 * This performs an intersection of the bodies allowed in each
 *
 * @param allowedBody
 * @param clientBody
 */


module.exportDefault(function (allowedBody, clientBody) {
  const build = intersectFields(allowedBody, clientBody); // Add back special fields to the new body

  Object.assign(build, _.pick(allowedBody, ...EXTENDED_SPECIAL_FIELDS));
  return build;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForDelivery.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/prepareForDelivery.js                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  applyPostFilters: () => applyPostFilters,
  applyPostOptions: () => applyPostOptions,
  getResultsArray: () => getResultsArray,
  removeLinkStorages: () => removeLinkStorages,
  storeOneResults: () => storeOneResults,
  assembleMetadata: () => assembleMetadata
});
let applyReducers;
module.link("../reducers/lib/applyReducers", {
  default(v) {
    applyReducers = v;
  }

}, 0);
let cleanReducerLeftovers;
module.link("../reducers/lib/cleanReducerLeftovers", {
  default(v) {
    cleanReducerLeftovers = v;
  }

}, 1);
let sift;
module.link("sift", {
  default(v) {
    sift = v;
  }

}, 2);
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 3);
let Minimongo;
module.link("meteor/minimongo", {
  Minimongo(v) {
    Minimongo = v;
  }

}, 4);
module.exportDefault((node, params) => {
  snapBackCaches(node);
  storeOneResults(node, node.results);
  applyReducers(node, params);

  _.each(node.collectionNodes, collectionNode => {
    cloneMetaChildren(collectionNode, node.results);
  });

  _.each(node.collectionNodes, collectionNode => {
    assembleMetadata(collectionNode, node.results);
  });

  cleanReducerLeftovers(node, node.results);
  removeLinkStorages(node, node.results);
  applyPostFilters(node);
  applyPostOptions(node);
  applyPostFilter(node, params);
});

function applyPostFilters(node) {
  const postFilters = node.props.$postFilters;

  if (postFilters) {
    node.results = sift(postFilters, node.results);
  }
}

function applyPostOptions(node) {
  const options = node.props.$postOptions;

  if (options) {
    if (options.sort) {
      const sorter = new Minimongo.Sorter(options.sort);
      node.results.sort(sorter.getComparator());
    }

    if (options.limit || options.skip) {
      const start = options.skip || 0;
      const end = options.limit ? options.limit + start : node.results.length;
      node.results = node.results.slice(start, end);
    }
  }
}

/**
 * Optionally applies a post filtering option
 */
function applyPostFilter(node, params) {
  if (node.props.$postFilter) {
    const filter = node.props.$postFilter;

    if (_.isArray(filter)) {
      filter.forEach(f => {
        node.results = f(node.results, params);
      });
    } else {
      node.results = filter(node.results, params);
    }
  }
}
/**
 *
 * Helper function which transforms results into the array.
 * Results are an object for 'one' links.
 *
 * @param results
 * @return array
 */


function getResultsArray(results) {
  if (_.isArray(results)) {
    return results;
  } else if (_.isUndefined(results)) {
    return [];
  }

  return [results];
}

function removeLinkStorages(node, sameLevelResults) {
  if (!sameLevelResults) {
    return;
  }

  sameLevelResults = getResultsArray(sameLevelResults);

  _.each(node.collectionNodes, collectionNode => {
    const removeStorageField = collectionNode.shouldCleanStorage;

    _.each(sameLevelResults, result => {
      if (removeStorageField) {
        const isSingle = collectionNode.linker.isSingle();
        const [root, ...nested] = collectionNode.linkStorageField.split('.');

        const removeFromResult = (result, removeEmptyRoot = false) => {
          if (isSingle) {
            dot.pick(collectionNode.linkStorageField, result, true);

            if (removeEmptyRoot && nested.length > 0 && _.isEmpty(result[root])) {
              delete result[root];
            }
          } else {
            if (nested.length > 0) {
              const arr = result[root] || [];

              if (_.isArray(arr)) {
                arr.forEach(obj => dot.pick(nested.join('.'), obj, true));

                if (removeEmptyRoot && nested.length > 0 && arr.every(obj => _.isEmpty(obj))) {
                  delete result[root];
                }
              }
            } else {
              delete result[collectionNode.linkStorageField];
            }
          }
        };

        if (collectionNode.isVirtual) {
          const childResults = getResultsArray(result[collectionNode.linkName]);

          _.each(childResults, childResult => {
            removeFromResult(childResult);
          });
        } else {
          removeFromResult(result);
        }
      }

      removeLinkStorages(collectionNode, result[collectionNode.linkName]);
    });
  });
}

function storeOneResults(node, sameLevelResults) {
  if (!sameLevelResults) {
    return;
  }

  node.collectionNodes.forEach(collectionNode => {
    _.each(sameLevelResults, result => {
      // The reason we are doing this is that if the requested link does not exist
      // It will fail when we try to get undefined[something] below
      if (result === undefined) {
        return;
      }

      storeOneResults(collectionNode, result[collectionNode.linkName]);
    });

    if (collectionNode.isOneResult) {
      _.each(sameLevelResults, result => {
        if (result[collectionNode.linkName] && _.isArray(result[collectionNode.linkName])) {
          result[collectionNode.linkName] = result[collectionNode.linkName] ? _.first(result[collectionNode.linkName]) : undefined;
        }
      });
    }
  });
}

function cloneMetaChildren(node, parentResults) {
  if (!parentResults) {
    return;
  }

  const linkName = node.linkName;
  const isMeta = node.isMeta; // parentResults might be an object (for type==one links)

  parentResults = getResultsArray(parentResults);
  parentResults.forEach(parentResult => {
    if (isMeta && parentResult[linkName]) {
      if (node.isOneResult) {
        parentResult[linkName] = Object.assign({}, parentResult[linkName]);
      } else {
        parentResult[linkName] = parentResult[linkName].map(object => {
          return Object.assign({}, object);
        });
      }
    }

    node.collectionNodes.forEach(collectionNode => {
      cloneMetaChildren(collectionNode, parentResult[linkName]);
    });
  });
}

function assembleMetadata(node, parentResults) {
  parentResults = getResultsArray(parentResults); // assembling metadata is depth first

  node.collectionNodes.forEach(collectionNode => {
    _.each(parentResults, result => {
      assembleMetadata(collectionNode, result[node.linkName]);
    });
  });

  if (node.isMeta) {
    if (node.isVirtual) {
      _.each(parentResults, parentResult => {
        const childResult = parentResult[node.linkName];

        if (node.isOneResult) {
          if (_.isObject(childResult)) {
            const storage = childResult[node.linkStorageField];
            storeMetadata(childResult, parentResult, storage, true);
          }
        } else {
          _.each(childResult, object => {
            const storage = object[node.linkStorageField];
            storeMetadata(object, parentResult, storage, true);
          });
        }
      });
    } else {
      _.each(parentResults, parentResult => {
        const childResult = parentResult[node.linkName];
        const storage = parentResult[node.linkStorageField];

        if (node.isOneResult) {
          if (childResult) {
            storeMetadata(childResult, parentResult, storage, false);
          }
        } else {
          _.each(childResult, object => {
            storeMetadata(object, parentResult, storage, false);
          });
        }
      });
    }
  }
}

function storeMetadata(element, parentElement, storage, isVirtual) {
  if (isVirtual) {
    let $metadata;

    if (_.isArray(storage)) {
      $metadata = _.find(storage, storageItem => storageItem._id == parentElement._id);
    } else {
      $metadata = storage;
    }

    element.$metadata = _.omit($metadata, '_id');
  } else {
    let $metadata;

    if (_.isArray(storage)) {
      $metadata = _.find(storage, storageItem => storageItem._id == element._id);
    } else {
      $metadata = storage;
    }

    element.$metadata = _.omit($metadata, '_id');
  }
}

function snapBackCaches(node) {
  node.collectionNodes.forEach(collectionNode => {
    snapBackCaches(collectionNode);
  });

  if (!_.isEmpty(node.snapCaches)) {
    // process stuff
    _.each(node.snapCaches, (linkName, cacheField) => {
      const isSingle = _.contains(node.snapCachesSingles, cacheField);

      const linker = node.collection.getLinker(linkName); // we do this because for one direct and one meta direct, id is not stored

      const shoudStoreLinkStorage = !linker.isMany() && !linker.isVirtual();
      node.results.forEach(result => {
        if (result[cacheField]) {
          if (shoudStoreLinkStorage) {
            Object.assign(result[cacheField], {
              _id: linker.isMeta() ? result[linker.linkStorageField]._id : result[linker.linkStorageField]
            });
          }

          if (isSingle && _.isArray(result[cacheField])) {
            result[linkName] = _.first(result[cacheField]);
          } else {
            result[linkName] = result[cacheField];
          }

          delete result[cacheField];
        }
      });
    });
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForProcess.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/prepareForProcess.js                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 0);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 1);

function defaultFilterFunction({
  filters,
  options,
  params
}) {
  if (params.filters) {
    Object.assign(filters, params.filters);
  }

  if (params.options) {
    Object.assign(options, params.options);
  }
}

function applyFilterRecursive(data, params = {}, isRoot = false) {
  if (isRoot && !_.isFunction(data.$filter)) {
    data.$filter = defaultFilterFunction;
  }

  if (data.$filter) {
    check(data.$filter, Match.OneOf(Function, [Function]));
    data.$filters = data.$filters || {};
    data.$options = data.$options || {};

    if (_.isArray(data.$filter)) {
      data.$filter.forEach(filter => {
        filter.call(null, {
          filters: data.$filters,
          options: data.$options,
          params: params
        });
      });
    } else {
      data.$filter({
        filters: data.$filters,
        options: data.$options,
        params: params
      });
    }

    data.$filter = null;
    delete data.$filter;
  }

  _.each(data, (value, key) => {
    if (_.isObject(value)) {
      return applyFilterRecursive(value, params);
    }
  });
}

function applyPagination(body, _params) {
  if (body['$paginate'] && _params) {
    if (!body.$options) {
      body.$options = {};
    }

    if (_params.limit) {
      _.extend(body.$options, {
        limit: _params.limit
      });
    }

    if (_params.skip) {
      _.extend(body.$options, {
        skip: _params.skip
      });
    }

    delete body['$paginate'];
  }
}

module.exportDefault((_body, _params = {}) => {
  let body = deepClone(_body);
  let params = deepClone(_params);
  applyPagination(body, params);
  applyFilterRecursive(body, params, true);
  return body;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveCompose.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/recursiveCompose.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let applyProps;
module.link("./applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let getNodeNamespace;
module.link("./createGraph", {
  getNodeNamespace(v) {
    getNodeNamespace = v;
  }

}, 1);
let isFieldInProjection;
module.link("./fieldInProjection", {
  isFieldInProjection(v) {
    isFieldInProjection = v;
  }

}, 2);

/**
 * Adds _query_path fields to the cursor docs which are used for scoped query filtering on the client.
 * 
 * @param cursor 
 * @param ns 
 */
function patchCursor(cursor, ns) {
  const originalObserve = cursor.observe;

  cursor.observe = function (callbacks) {
    const newCallbacks = Object.assign({}, callbacks);

    if (callbacks.added) {
      newCallbacks.added = doc => {
        doc = _.clone(doc);
        doc[`_query_path_${ns}`] = 1;
        callbacks.added(doc);
      };
    }

    return originalObserve.call(cursor, newCallbacks);
  };
}

function compose(node, userId, config) {
  return {
    find(parent) {
      if (parent) {
        let {
          filters,
          options
        } = applyProps(node); // composition

        let linker = node.linker;
        let accessor = linker.createLink(parent); // the rule is this, if a child I want to fetch is virtual, then I want to fetch the link storage of those fields

        if (linker.isVirtual()) {
          options.fields = options.fields || {};

          if (!isFieldInProjection(options.fields, linker.linkStorageField, true)) {
            _.extend(options.fields, {
              [linker.linkStorageField]: 1
            });
          }
        }

        const cursor = accessor.find(filters, options, userId);

        if (config.scoped) {
          patchCursor(cursor, getNodeNamespace(node));
        }

        return cursor;
      }
    },

    children: _.map(node.collectionNodes, n => compose(n, userId, config))
  };
}

module.exportDefault((node, userId, config = {
  bypassFirewalls: false,
  scoped: false
}) => {
  return {
    find() {
      let {
        filters,
        options
      } = applyProps(node);
      const cursor = node.collection.find(filters, options, userId);

      if (config.scoped) {
        patchCursor(cursor, getNodeNamespace(node));
      }

      return cursor;
    },

    children: _.map(node.collectionNodes, n => {
      const userIdToPass = config.bypassFirewalls ? undefined : userId;
      return compose(n, userIdToPass, config);
    })
  };
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveFetch.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/lib/recursiveFetch.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let applyProps;
module.link("./applyProps.js", {
  default(v) {
    applyProps = v;
  }

}, 0);
let assembleMetadata, removeLinkStorages, storeOneResults;
module.link("./prepareForDelivery", {
  assembleMetadata(v) {
    assembleMetadata = v;
  },

  removeLinkStorages(v) {
    removeLinkStorages = v;
  },

  storeOneResults(v) {
    storeOneResults = v;
  }

}, 1);
let prepareForDelivery;
module.link("./prepareForDelivery", {
  default(v) {
    prepareForDelivery = v;
  }

}, 2);
let getNodeNamespace;
module.link("./createGraph", {
  getNodeNamespace(v) {
    getNodeNamespace = v;
  }

}, 3);
let isFieldInProjection;
module.link("../lib/fieldInProjection", {
  isFieldInProjection(v) {
    isFieldInProjection = v;
  }

}, 4);

/**
 * This is always run client side to build the data graph out of client-side collections.
 *
 * @param node
 * @param parentObject
 * @param fetchOptions
 * @returns {*}
 */
function fetch(node, parentObject, fetchOptions = {}) {
  let {
    filters,
    options
  } = applyProps(node); // add subscription filter

  if (fetchOptions.scoped && fetchOptions.subscriptionHandle) {
    _.extend(filters, fetchOptions.subscriptionHandle.scopeQuery());
  } // add query path filter


  if (fetchOptions.scoped) {
    _.extend(filters, {
      [`_query_path_${getNodeNamespace(node)}`]: {
        $exists: true
      }
    });
  }

  let results = [];

  if (parentObject) {
    let accessor = node.linker.createLink(parentObject, node.collection);

    if (node.isVirtual) {
      options.fields = options.fields || {};

      if (!isFieldInProjection(options.fields, node.linkStorageField, true)) {
        _.extend(options.fields, {
          [node.linkStorageField]: 1
        });
      }
    }

    results = accessor.find(filters, options).fetch();
  } else {
    results = node.collection.find(filters, options).fetch();
  }

  _.each(node.collectionNodes, collectionNode => {
    _.each(results, result => {
      const collectionNodeResults = fetch(collectionNode, result);
      result[collectionNode.linkName] = collectionNodeResults; //delete result[node.linker.linkStorageField];

      /**
       * Push into the results, because snapBackCaches() in prepareForDelivery does not work otherwise.
       * This is non-optimal, can we be sure that every item in results contains _id and add only if not in
       * the results?
       *
       * Other possible ways:
       * - do something like assemble() in storeHypernovaResults
       * - pass node.results to accessor above and find with sift
       */

      collectionNode.results.push(...collectionNodeResults); // this was not working because all references must be replaced in snapBackCaches, not only the ones that are 
      // found first
      // const currentIds = _.pluck(collectionNode.results, '_id');
      // collectionNode.results.push(...collectionNodeResults.filter(res => !_.contains(currentIds, res._id)));
    });
  });

  return results;
}

module.exportDefault((node, params, fetchOptions) => {
  node.results = fetch(node, null, fetchOptions);
  prepareForDelivery(node, params);
  return node.results;
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"nodes":{"collectionNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/collectionNode.js                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => CollectionNode,
  runFieldSanityChecks: () => runFieldSanityChecks
});
let FieldNode;
module.link("./fieldNode.js", {
  default(v) {
    FieldNode = v;
  }

}, 0);
let ReducerNode;
module.link("./reducerNode.js", {
  default(v) {
    ReducerNode = v;
  }

}, 1);
let deepClone;
module.link("lodash.clonedeep", {
  default(v) {
    deepClone = v;
  }

}, 2);
let check, Match;
module.link("meteor/check", {
  check(v) {
    check = v;
  },

  Match(v) {
    Match = v;
  }

}, 3);
let expandField, isFieldInProjection;
module.link("../lib/fieldInProjection", {
  expandField(v) {
    expandField = v;
  },

  isFieldInProjection(v) {
    isFieldInProjection = v;
  }

}, 4);

class CollectionNode {
  constructor(collection, body = {}, linkName = null) {
    if (collection && !_.isObject(body)) {
      throw new Meteor.Error('invalid-body', `The field "${linkName}" is a collection link, and should have its body defined as an object.`);
    }

    this.body = deepClone(body);
    this.linkName = linkName;
    this.collection = collection;
    this.nodes = [];
    this.props = {};
    this.parent = null;
    this.linker = null;
    this.linkStorageField = null;
    this.scheduledForDeletion = false;
    this.reducers = [];
    this.results = [];
    this.snapCaches = {}; // {cacheField: linkName}

    this.snapCachesSingles = []; // [cacheField1, cacheField2]
  }

  get collectionNodes() {
    return _.filter(this.nodes, n => n instanceof CollectionNode);
  }

  get fieldNodes() {
    return _.filter(this.nodes, n => n instanceof FieldNode);
  }

  get reducerNodes() {
    return _.filter(this.nodes, n => n instanceof ReducerNode);
  }
  /**
   * Adds children to itself
   *
   * @param node
   * @param linker
   */


  add(node, linker) {
    node.parent = this;

    if (node instanceof FieldNode) {
      runFieldSanityChecks(node.name);
    }

    if (linker) {
      node.linker = linker;
      node.linkStorageField = linker.linkStorageField;
      node.isMeta = linker.isMeta();
      node.isVirtual = linker.isVirtual();
      node.isOneResult = linker.isOneResult();
      node.shouldCleanStorage = this._shouldCleanStorage(node);
    }

    this.nodes.push(node);
  }
  /**
   * @param prop
   * @param value
   */


  addProp(prop, value) {
    if (prop === '$postFilter') {
      check(value, Match.OneOf(Function, [Function]));
    }

    Object.assign(this.props, {
      [prop]: value
    });
  }
  /**
   * @param _node
   */


  remove(_node) {
    this.nodes = _.filter(this.nodes, node => _node !== node);
  }
  /**
   * @param filters
   * @param options
   */


  applyFields(filters, options) {
    let hasAddedAnyField = false;

    _.each(this.fieldNodes, n => {
      /**
       * $meta field should be added to the options.fields, but MongoDB does not exclude other fields.
       * Therefore, we do not count this as a field addition.
       * 
       * See: https://docs.mongodb.com/manual/reference/operator/projection/meta/
       * The $meta expression specifies the inclusion of the field to the result set 
       * and does not specify the exclusion of the other fields.
       */
      if (n.projectionOperator !== '$meta') {
        hasAddedAnyField = true;
      }

      n.applyFields(options.fields);
    }); // it will only get here if it has collectionNodes children


    _.each(this.collectionNodes, collectionNode => {
      let linker = collectionNode.linker;

      if (linker && !linker.isVirtual()) {
        if (!isFieldInProjection(options.fields, linker.linkStorageField, true)) {
          options.fields[linker.linkStorageField] = 1;
          hasAddedAnyField = true;
        }
      }
    }); // if he selected filters, we should automatically add those fields


    _.each(filters, (value, field) => {
      // special handling for the $meta filter, conditional operators and text search
      if (!_.contains(['$or', '$nor', '$not', '$and', '$meta', '$text'], field)) {
        // if the field or the parent of the field already exists, don't add it
        if (!_.has(options.fields, field.split('.')[0])) {
          hasAddedAnyField = true;
          options.fields[field] = 1;
        }
      }
    });

    if (!hasAddedAnyField) {
      options.fields = (0, _objectSpread2.default)({
        _id: 1
      }, options.fields);
    }
  }
  /**
   * @param fieldName
   * @returns {boolean}
   */


  hasField(fieldName, checkNested = false) {
    // for checkNested flag it expands profile.phone.verified into 
    // ['profile', 'profile.phone', 'profile.phone.verified']
    // if any of these fields match it means that field exists
    const options = checkNested ? expandField(fieldName) : [fieldName];
    const result = !!_.find(this.fieldNodes, fieldNode => {
      return _.contains(options, fieldNode.name);
    });
    return result;
  }
  /**
   * @param fieldName
   * @returns {FieldNode}
   */


  getField(fieldName) {
    return _.find(this.fieldNodes, fieldNode => {
      return fieldNode.name == fieldName;
    });
  }
  /**
   * @param name
   * @returns {boolean}
   */


  hasCollectionNode(name) {
    return !!_.find(this.collectionNodes, node => {
      return node.linkName == name;
    });
  }
  /**
   * @param name
   * @returns {boolean}
   */


  hasReducerNode(name) {
    return !!_.find(this.reducerNodes, node => {
      return node.name == name;
    });
  }
  /**
   * @param name
   * @returns {ReducerNode}
   */


  getReducerNode(name) {
    return _.find(this.reducerNodes, node => {
      return node.name == name;
    });
  }
  /**
   * @param name
   * @returns {CollectionNode}
   */


  getCollectionNode(name) {
    return _.find(this.collectionNodes, node => {
      return node.linkName == name;
    });
  }
  /**
   * @returns {*}
   */


  getName() {
    return this.linkName ? this.linkName : this.collection ? this.collection._name : 'N/A';
  }
  /**
   * This is used for caching links
   *
   * @param cacheField
   * @param subLinkName
   */


  snapCache(cacheField, subLinkName) {
    this.snapCaches[cacheField] = subLinkName;

    if (this.collection.getLinker(subLinkName).isOneResult()) {
      this.snapCachesSingles.push(cacheField);
    }
  }
  /**
   * This method verifies whether to remove the linkStorageField form the results
   * unless you specify it in your query.
   *
   * @param node
   * @returns {boolean}
   * @private
   */


  _shouldCleanStorage(node) {
    if (node.linkStorageField === '_id') {
      return false;
    } else {
      if (node.isVirtual) {
        return !node.hasField(node.linkStorageField, true);
      } else {
        return !this.hasField(node.linkStorageField, true);
      }
    }
  }

}

function runFieldSanityChecks(fieldName) {
  // Run sanity checks on the field
  if (fieldName[0] === '$') {
    throw new Error(`You are not allowed to use fields that start with $ inside a reducer's body: ${fieldName}`);
  }

  return true;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fieldNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/fieldNode.js                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => FieldNode
});

class FieldNode {
  constructor(name, body, isProjectionOperator = false) {
    this.name = name;
    this.projectionOperator = isProjectionOperator ? _.keys(body)[0] : null;
    this.body = !_.isObject(body) || isProjectionOperator ? body : 1;
    this.scheduledForDeletion = false;
  }

  applyFields(fields) {
    fields[this.name] = this.body;
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reducerNode.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/nodes/reducerNode.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => ReducerNode
});

class ReducerNode {
  constructor(name, {
    body,
    reduce
  }) {
    this.name = name;
    this.body = body;
    this.reduceFunction = reduce;
    this.dependencies = []; // This is a list of the reducer this reducer uses.
  }
  /**
   * When computing we also pass the parameters
   * 
   * @param {*} object 
   * @param {*} args 
   */


  compute(object, ...args) {
    object[this.name] = this.reduce.call(this, object, ...args);
  }

  reduce(object, ...args) {
    return this.reduceFunction.call(this, object, ...args);
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"reducers":{"extension.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/extension.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 0);
let addFieldMap;
module.link("./lib/addFieldMap", {
  default(v) {
    addFieldMap = v;
  }

}, 1);
const storage = '__reducers';
Object.assign(Mongo.Collection.prototype, {
  /**
   * @param data
   */
  addReducers(data) {
    if (!this[storage]) {
      this[storage] = {};
    }

    _.each(data, (reducerConfig, reducerName) => {
      if (!this[reducerConfig]) {
        this[reducerConfig] = {};
      }

      if (this.getLinker(reducerName)) {
        throw new Meteor.Error(`You cannot add the reducer with name: ${reducerName} because it is already defined as a link in ${this._name} collection`);
      }

      if (this[reducerConfig][reducerName]) {
        throw new Meteor.Error(`You cannot add the reducer with name: ${reducerName} because it was already added to ${this._name} collection`);
      }

      check(reducerConfig, {
        body: Object,
        reduce: Function
      });

      _.extend(this[storage], {
        [reducerName]: reducerConfig
      });
    });
  },

  /**
   * @param name
   * @returns {*}
   */
  getReducer(name) {
    if (this[storage]) {
      return this[storage][name];
    }
  },

  /**
   * This creates reducers that makes sort of aliases for the database fields we use
   */
  addFieldMap
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"addFieldMap.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/addFieldMap.js                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => addFieldMap
});

function addFieldMap(map) {
  const collection = this;
  let reducers = {};

  for (let key in map) {
    const dbField = map[key];
    reducers[key] = {
      body: {
        [dbField]: 1
      },

      reduce(obj) {
        return obj[dbField];
      }

    };
  }

  collection.addReducers(reducers);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"applyReducers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/applyReducers.js                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => applyReducers
});

function applyReducers(root, params) {
  _.each(root.collectionNodes, node => {
    applyReducers(node, params);
  });

  const processedReducers = [];
  let reducersQueue = [...root.reducerNodes]; // TODO: find out if there's an infinite reducer inter-deendency

  while (reducersQueue.length) {
    const reducerNode = reducersQueue.shift(); // If this reducer depends on other reducers

    if (reducerNode.dependencies.length) {
      // If there is an unprocessed reducer, move it at the end of the queue
      const allDependenciesComputed = _.all(reducerNode.dependencies, dep => processedReducers.includes(dep));

      if (allDependenciesComputed) {
        root.results.forEach(result => {
          reducerNode.compute(result, params);
        });
        processedReducers.push(reducerNode.name);
      } else {
        // Move it at the end of the queue
        reducersQueue.push(reducerNode);
      }
    } else {
      root.results.forEach(result => {
        reducerNode.compute(result, params);
      });
      processedReducers.push(reducerNode.name);
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanReducerLeftovers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/cleanReducerLeftovers.js                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => cleanReducerLeftovers
});
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 0);

function cleanReducerLeftovers(root, results) {
  _.each(root.collectionNodes, node => {
    if (node.scheduledForDeletion) {
      results.forEach(result => {
        delete result[node.linkName];
      });
    }
  });

  _.each(root.collectionNodes, node => {
    let childResults;

    if (node.isOneResult) {
      childResults = results.map(result => result[node.linkName]).filter(element => !!element);
    } else {
      childResults = _.flatten(results.map(result => result[node.linkName]).filter(element => !!element));
    }

    cleanReducerLeftovers(node, childResults);
  });

  _.each(root.fieldNodes, node => {
    if (node.scheduledForDeletion) {
      cleanNestedFields(node.name.split('.'), results, root);
    }
  });

  _.each(root.reducerNodes, node => {
    if (node.scheduledForDeletion) {
      results.forEach(result => {
        delete result[node.name];
      });
    }
  });
}

// if we store a field like: 'profile.firstName'
// then we need to delete profile: { firstName }
// if profile will have empty keys, we need to delete profile.

/**
 * Cleans what reducers needed to be computed and not used.
 * @param parts
 * @param results
 */
function cleanNestedFields(parts, results, root) {
  const snapCacheField = root.snapCaches[parts[0]];
  const fieldName = snapCacheField ? snapCacheField : parts[0];

  if (parts.length === 1) {
    results.forEach(result => {
      if (_.isObject(result) && fieldName !== '_id') {
        delete result[fieldName];
      }
    });
    return;
  }

  parts.shift();
  cleanNestedFields(parts, results.filter(result => !!result[fieldName]).map(result => result[fieldName]), root);
  results.forEach(result => {
    if (_.isObject(result[fieldName]) && _.keys(result[fieldName]).length === 0) {
      if (fieldName !== '_id') {
        delete result[fieldName];
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createReducers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/createReducers.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => addReducers,
  handleAddElement: () => handleAddElement,
  handleAddReducer: () => handleAddReducer,
  handleAddLink: () => handleAddLink,
  handleAddField: () => handleAddField
});
let dot;
module.link("dot-object", {
  default(v) {
    dot = v;
  }

}, 0);
let createNodes;
module.link("../../lib/createGraph", {
  createNodes(v) {
    createNodes = v;
  }

}, 1);
let CollectionNode;
module.link("../../nodes/collectionNode", {
  default(v) {
    CollectionNode = v;
  }

}, 2);
let FieldNode;
module.link("../../nodes/fieldNode", {
  default(v) {
    FieldNode = v;
  }

}, 3);
let ReducerNode;
module.link("../../nodes/reducerNode", {
  default(v) {
    ReducerNode = v;
  }

}, 4);
let embedReducerWithLink;
module.link("./embedReducerWithLink", {
  default(v) {
    embedReducerWithLink = v;
  }

}, 5);
let specialFields;
module.link("../../lib/createGraph", {
  specialFields(v) {
    specialFields = v;
  }

}, 6);

function addReducers(root) {
  // we add reducers last, after we have added all the fields.
  root.reducerNodes.forEach(reducer => {
    _.each(reducer.body, (body, fieldName) => {
      handleAddElement(reducer, root, fieldName, body);
    });
  });
}

function handleAddElement(reducerNode, root, fieldName, body) {
  // if it's a link
  const collection = root.collection;
  const linker = collection.getLinker(fieldName);

  if (linker) {
    return handleAddLink(reducerNode, fieldName, body, root, linker);
  }

  const reducer = collection.getReducer(fieldName);

  if (reducer) {
    reducerNode.dependencies.push(fieldName);
    return handleAddReducer(fieldName, reducer, root);
  } // we assume it's a field in this case


  return handleAddField(fieldName, body, root);
}

function handleAddReducer(fieldName, {
  body,
  reduce
}, root) {
  if (!root.hasReducerNode(fieldName)) {
    let childReducerNode = new ReducerNode(fieldName, {
      body,
      reduce
    });
    root.add(childReducerNode);
    childReducerNode.scheduledForDeletion = true;

    _.each(childReducerNode.body, (body, fieldName) => {
      handleAddElement(childReducerNode, root, fieldName, body);
    });
  }
}

function handleAddLink(reducerNode, fieldName, body, parent, linker) {
  if (parent.hasCollectionNode(fieldName)) {
    const collectionNode = parent.getCollectionNode(fieldName);
    embedReducerWithLink(reducerNode, body, collectionNode);
  } else {
    // add
    let collectionNode = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
    collectionNode.scheduledForDeletion = true;
    parent.add(collectionNode, linker);
    createNodes(collectionNode);
  }
}

function handleAddField(fieldName, body, root) {
  if (_.contains(specialFields, fieldName)) {
    root.addProp(fieldName, body);
    return;
  }

  if (_.isObject(body)) {
    // if reducer specifies a nested field
    // if it's a prop
    const dots = dot.dot({
      [fieldName]: body
    });

    _.each(dots, (value, key) => {
      addFieldIfRequired(root, key, value);
    });
  } else {
    // if reducer does not specify a nested field, and the field does not exist.
    addFieldIfRequired(root, fieldName, body);
  }
}

function addFieldIfRequired(root, fieldName, body) {
  if (!root.hasField(fieldName, true)) {
    /**
     * Check if there are any nested fields for this field.
     * Adding root field here and scheduling for deletion would not work if there is already nested field, 
     * for example:
     * when trying to add meta: 1, it should be checked that there are no meta.* fields
     * */
    const nestedFields = root.fieldNodes.filter(({
      name
    }) => name.startsWith(`${fieldName}.`)); // remove nested fields - important for minimongo which complains for these situations
    // TODO: excess fields are not removed (caused by adding the root field and removing nested fields) but there
    // should probably be a way to handle this in post-processing - for example by keeping a whitelist of fields
    // and removing anything else

    nestedFields.forEach(node => root.remove(node));
    let fieldNode = new FieldNode(fieldName, body); // delete only if all nested fields are scheduled for deletion (that includes the case of 0 nested fields)

    fieldNode.scheduledForDeletion = nestedFields.every(field => field.scheduledForDeletion);
    root.add(fieldNode);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"embedReducerWithLink.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/cultofcoders_grapher/lib/query/reducers/lib/embedReducerWithLink.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => embedReducerWithLink
});
let handleAddField, handleAddElement, handleAddReducer;
module.link("./createReducers", {
  handleAddField(v) {
    handleAddField = v;
  },

  handleAddElement(v) {
    handleAddElement = v;
  },

  handleAddReducer(v) {
    handleAddReducer = v;
  }

}, 0);

function embedReducerWithLink(reducerNode, reducerBody, collectionNode) {
  _.each(reducerBody, (value, key) => {
    const collection = collectionNode.collection;

    if (_.isObject(value)) {
      // nested field or link
      if (collectionNode.body[key]) {
        // if it exists
        const linker = collection.getLinker(key); // if it's a link

        if (linker) {
          if (linker.isDenormalized()) {
            if (linker.isSubBodyDenormalized(value)) {
              const cacheField = linker.linkConfig.denormalize.field;
              handleAddField(cacheField, value, collectionNode);
              return;
            }
          }

          embedReducerWithLink(reducerNode, value, collectionNode.getCollectionNode(key));
          return;
        }

        handleAddField(key, value, collectionNode);
      } else {
        // does not exist, so it may be a link/reducer/field
        handleAddElement(reducerNode, collectionNode, key, value);
      }
    } else {
      // if this field or other reducer exists within the collection
      if (!collectionNode.body[key]) {
        // can only be field or another reducer for this.
        const reducer = collection.getReducer(key);

        if (reducer) {
          // if it's another reducer
          return handleAddReducer(key, reducer, collectionNode);
        }

        return handleAddField(key, value, collectionNode);
      }
    }
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},"node_modules":{"lodash.clonedeep":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/lodash.clonedeep/package.json                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "lodash.clonedeep",
  "version": "4.5.0"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/lodash.clonedeep/index.js                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dot-object":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/dot-object/package.json                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "dot-object",
  "version": "1.5.4",
  "main": "index"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/dot-object/index.js                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"sift":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/sift/package.json                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "sift",
  "version": "3.2.6",
  "main": "./sift.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sift.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/sift/sift.js                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deep-extend":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/deep-extend/package.json                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "deep-extend",
  "version": "0.5.0",
  "main": "lib/deep-extend.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"deep-extend.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/cultofcoders_grapher/node_modules/deep-extend/lib/deep-extend.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:grapher/main.server.js");

/* Exports */
Package._define("cultofcoders:grapher", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9hZ2dyZWdhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9jb21wb3NlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvY3JlYXRlUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9kYi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4cG9zdXJlLmNvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9leHBvc3VyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9jbGVhbkJvZHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvY2xlYW5TZWxlY3RvcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvZW5mb3JjZU1heERlcHRoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvbGliL2VuZm9yY2VNYXhMaW1pdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdExpbmtzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZ3JhcGhxbC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvQm9keS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9ncmFwaHFsL2xpYi9kZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2NvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saW5rZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55TWV0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9saW5rT25lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpYi9zbWFydEFyZ3VtZW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9saWIvbWVyZ2VEZWVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuYmFzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvY29uc3RhbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvdW50U3Vic2NyaXB0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2Fzc2VtYmxlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2NvbnN0YW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9oeXBlcm5vdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvc3RvcmVIeXBlcm5vdmFSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9hcHBseVByb3BzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbGliL2NhbGxXaXRoUHJvbWlzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9kb3RpemUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvZmllbGRJblByb2plY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9yZWN1cnNpdmVGZXRjaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvZmllbGROb2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvcmVkdWNlck5vZGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYWRkRmllbGRNYXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvZW1iZWRSZWR1Y2VyV2l0aExpbmsuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTmFtZWRRdWVyeVN0b3JlIiwiTGlua0NvbnN0YW50cyIsImxpbmsiLCJkZWZhdWx0IiwidiIsIlByb21pc2UiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJhZ2dyZWdhdGUiLCJwaXBlbGluZXMiLCJvcHRpb25zIiwiY29sbCIsInJhd0NvbGxlY3Rpb24iLCJyZXN1bHQiLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJBcnJheSIsImlzQXJyYXkiLCJhd2FpdCIsInRvQXJyYXkiLCJkZWVwRXh0ZW5kIiwiZXhwb3J0RGVmYXVsdCIsImFyZ3MiLCJRdWVyeSIsIk5hbWVkUXVlcnkiLCJuYW1lIiwiYm9keSIsIl8iLCJpc0Z1bmN0aW9uIiwiY3JlYXRlTmFtZWRRdWVyeSIsImVudHJ5UG9pbnROYW1lIiwiZmlyc3QiLCJrZXlzIiwiY29sbGVjdGlvbiIsImdldCIsIkVycm9yIiwiaXNEZXZlbG9wbWVudCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyYW1zIiwiY3JlYXRlTm9ybWFsUXVlcnkiLCJuYW1lZFF1ZXJ5IiwicXVlcnkiLCJhZGQiLCJjbG9uZSIsImRiIiwiUHJveHkiLCJvYmoiLCJwcm9wIiwiZXh0ZW5kIiwiY3JlYXRlUXVlcnkiLCJsZW5ndGgiLCJFeHBvc3VyZURlZmF1bHRzIiwiRXhwb3N1cmVTY2hlbWEiLCJ2YWxpZGF0ZUJvZHkiLCJjcmVhdGVHcmFwaCIsIk1hdGNoIiwiYmxvY2tpbmciLCJtZXRob2QiLCJwdWJsaWNhdGlvbiIsImZpcmV3YWxsIiwiTWF5YmUiLCJPbmVPZiIsIkZ1bmN0aW9uIiwibWF4TGltaXQiLCJJbnRlZ2VyIiwibWF4RGVwdGgiLCJCb29sZWFuIiwiT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkcyIsIlN0cmluZyIsInJlc3RyaWN0TGlua3MiLCJlIiwidG9TdHJpbmciLCJFeHBvc3VyZSIsImdlbkNvdW50RW5kcG9pbnQiLCJyZWN1cnNpdmVDb21wb3NlIiwiaHlwZXJub3ZhIiwiZW5mb3JjZU1heERlcHRoIiwiZW5mb3JjZU1heExpbWl0IiwiY2xlYW5Cb2R5IiwiZGVlcENsb25lIiwicmVzdHJpY3RGaWVsZHNGbiIsImNoZWNrIiwiZ2xvYmFsQ29uZmlnIiwic2V0Q29uZmlnIiwiY29uZmlnIiwiYXNzaWduIiwiZ2V0Q29uZmlnIiwicmVzdHJpY3RGaWVsZHMiLCJjb25zdHJ1Y3RvciIsIl9faXNFeHBvc2VkRm9yR3JhcGhlciIsIl9fZXhwb3N1cmUiLCJfbmFtZSIsIl92YWxpZGF0ZUFuZENsZWFuIiwiaW5pdFNlY3VyaXR5IiwiaW5pdFB1YmxpY2F0aW9uIiwiaW5pdE1ldGhvZCIsImluaXRDb3VudE1ldGhvZCIsImluaXRDb3VudFB1YmxpY2F0aW9uIiwiZ2V0VHJhbnNmb3JtZWRCb2R5IiwidXNlcklkIiwicHJvY2Vzc2VkQm9keSIsImdldEJvZHkiLCJjYWxsIiwiYmluZCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0cmFuc2Zvcm1lZEJvZHkiLCJyb290Tm9kZSIsImJ5cGFzc0ZpcmV3YWxscyIsIm1ldGhvZEJvZHkiLCJ1bmJsb2NrIiwibWV0aG9kcyIsImZpbmQiLCIkZmlsdGVycyIsImNvdW50IiwiZ2V0Q3Vyc29yIiwic2Vzc2lvbiIsImZpbHRlcnMiLCJmaWVsZHMiLCJfaWQiLCJnZXRTZXNzaW9uIiwiZmluZE9uZSIsInVuZGVmaW5lZCIsIl9jYWxsRmlyZXdhbGwiLCJhcmd1bWVudHMiLCJmb3JFYWNoIiwiZmlyZSIsImV4cG9zZSIsImlzU2VydmVyIiwiY2xlYW5GaWx0ZXJzIiwiY2xlYW5PcHRpb25zIiwiZG90aXplIiwibWFpbiIsInNlY29uZCIsIm9iamVjdCIsIiRvcHRpb25zIiwiZ2V0RmllbGRzIiwiZWFjaCIsInNlY29uZFZhbHVlIiwia2V5IiwidmFsdWUiLCJpc09iamVjdCIsImNvbnZlcnQiLCJmaWVsZEV4aXN0cyIsImVuc3VyZUZpZWxkcyIsInBpY2siLCJzb3J0IiwiZGVlcEZpbHRlckZpZWxkc0FycmF5IiwiZGVlcEZpbHRlckZpZWxkc09iamVjdCIsInNwZWNpYWwiLCJjb250YWlucyIsImZpZWxkIiwiZWxlbWVudCIsImkiLCJpbmRleE9mIiwiZ2V0RGVwdGgiLCJub2RlIiwiZGVwdGgiLCJjb2xsZWN0aW9uTm9kZXMiLCJtYXgiLCJtYXAiLCJsaW1pdCIsImNsZWFuT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkIiwibWF0Y2hpbmciLCJzdWJmaWVsZCIsInNsaWNlIiwiZ2V0TGlua3MiLCJwYXJlbnROb2RlIiwicmVzdHJpY3RlZExpbmtzIiwiY29sbGVjdGlvbk5vZGUiLCJsaW5rTmFtZSIsInJlbW92ZSIsImV4cG9zdXJlIiwiY29uZmlnUmVzdHJpY3RMaW5rcyIsImFzdFRvUXVlcnkiLCJzZXRBc3RUb1F1ZXJ5RGVmYXVsdHMiLCJTeW1ib2xzIiwiYXN0VG9Cb2R5IiwiQVJHVU1FTlRTIiwiU3ltYm9sIiwiYXN0IiwiZmllbGROb2RlcyIsImV4dHJhY3RTZWxlY3Rpb25TZXQiLCJzZWxlY3Rpb25TZXQiLCJzZXQiLCJzZWxlY3Rpb25zIiwiZWwiLCJhcmd1bWVudE1hcCIsImFyZyIsImdldE1heERlcHRoIiwiZGVueSIsImNsZWFyRW1wdHlPYmplY3RzIiwiY3JlYXRlR2V0QXJncyIsImRlZmF1bHRzIiwiaW50ZXJzZWN0RGVlcCIsIkVycm9ycyIsIk1BWF9ERVBUSCIsImVtYm9keSIsIk51bWJlciIsImludGVyc2VjdCIsImN1cnJlbnRNYXhEZXB0aCIsImdldEFyZ3MiLCJkZXB0aHMiLCJwdXNoIiwiTWF0aCIsInBhcnRzIiwic3BsaXQiLCJhY2Nlc3NvciIsInNoaWZ0Iiwic2hvdWxkRGVsZXRlIiwicGF0aCIsInN0b3BwZWQiLCJEZW5vcm1hbGl6ZVNjaGVtYSIsIkxpbmtDb25maWdEZWZhdWx0cyIsIkxpbmtDb25maWdTY2hlbWEiLCJieXBhc3NTY2hlbWEiLCJ0eXBlIiwiV2hlcmUiLCJfY29sbGVjdGlvbiIsIm1ldGFkYXRhIiwiaW52ZXJzZWRCeSIsImluZGV4IiwidW5pcXVlIiwiYXV0b3JlbW92ZSIsImRlbm9ybWFsaXplIiwiT2JqZWN0SW5jbHVkaW5nIiwiTElOS19TVE9SQUdFIiwiTGlua2VyIiwiYWRkTGlua3MiLCJkYXRhIiwibGlua0NvbmZpZyIsImxpbmtlciIsImdldExpbmtlciIsImhhc0xpbmsiLCJnZXRMaW5rIiwib2JqZWN0T3JJZCIsImxpbmtEYXRhIiwiaXNWaXJ0dWFsIiwibGlua1N0b3JhZ2VGaWVsZCIsImNyZWF0ZUxpbmsiLCJMaW5rTWFueSIsIkxpbmtNYW55TWV0YSIsIkxpbmtPbmUiLCJMaW5rT25lTWV0YSIsInNtYXJ0QXJndW1lbnRzIiwiZG90IiwiYWNjZXNzIiwibWFpbkNvbGxlY3Rpb24iLCJfaW5pdEF1dG9yZW1vdmUiLCJfaW5pdERlbm9ybWFsaXphdGlvbiIsIl9oYW5kbGVSZWZlcmVuY2VSZW1vdmFsRm9yVmlydHVhbExpbmtzIiwiX2luaXRJbmRleCIsIm9uZVR5cGVzIiwic3RyYXRlZ3kiLCJpc01hbnkiLCJyZWxhdGVkTGlua2VyIiwiZ2V0TGlua2VkQ29sbGVjdGlvbiIsImlzU2luZ2xlIiwiaXNNZXRhIiwiaXNPbmVSZXN1bHQiLCJoZWxwZXJDbGFzcyIsIl9nZXRIZWxwZXJDbGFzcyIsImNvbGxlY3Rpb25OYW1lIiwiX3ByZXBhcmVWaXJ0dWFsIiwiX2dlbmVyYXRlRmllbGROYW1lIiwic3RhcnR1cCIsIl9zZXR1cFZpcnR1YWxDb25maWciLCJ2aXJ0dWFsTGlua0NvbmZpZyIsImNsZWFuZWRDb2xsZWN0aW9uTmFtZSIsInJlcGxhY2UiLCJkZWZhdWx0RmllbGRQcmVmaXgiLCJhZnRlciIsImRvYyIsImZldGNoQXNBcnJheSIsImxpbmtlZE9iaiIsInVuc2V0IiwiX2Vuc3VyZUluZGV4Iiwic3BhcnNlIiwiJGluIiwiZ2V0SWRzIiwiaWRzIiwiZmV0Y2giLCJpdGVtIiwicGFja2FnZUV4aXN0cyIsIlBhY2thZ2UiLCJjYWNoZUNvbmZpZyIsInJlZmVyZW5jZUZpZWxkU3VmZml4IiwiaW52ZXJzZWRMaW5rIiwicmVmZXJlbmNlRmllbGQiLCJjYWNoZUZpZWxkIiwiY2FjaGUiLCJpc0Rlbm9ybWFsaXplZCIsImlzU3ViQm9keURlbm9ybWFsaXplZCIsImNhY2hlQm9keSIsImNhY2hlQm9keUZpZWxkcyIsImJvZHlGaWVsZHMiLCJvbWl0IiwiZGlmZmVyZW5jZSIsImNyZWF0ZVNlYXJjaEZpbHRlcnMiLCJjcmVhdGVPbmUiLCJjcmVhdGVPbmVWaXJ0dWFsIiwiY3JlYXRlT25lTWV0YSIsImNyZWF0ZU9uZU1ldGFWaXJ0dWFsIiwiY3JlYXRlTWFueSIsImNyZWF0ZU1hbnlWaXJ0dWFsIiwiY3JlYXRlTWFueU1ldGEiLCJjcmVhdGVNYW55TWV0YVZpcnR1YWwiLCJzaWZ0IiwiZmllbGRTdG9yYWdlIiwibWV0YUZpbHRlcnMiLCJyb290IiwibmVzdGVkIiwiYXJyIiwidW5pcSIsInVuaW9uIiwiam9pbiIsInBsdWNrIiwiJGVsZW1NYXRjaCIsIkxpbmsiLCJTbWFydEFyZ3MiLCJsaW5rZWRDb2xsZWN0aW9uIiwiJG1ldGFGaWx0ZXJzIiwiJG1ldGEiLCJzZWFyY2hGaWx0ZXJzIiwiYXBwbGllZEZpbHRlcnMiLCJvdGhlcnMiLCJjbGVhbiIsImlkZW50aWZ5SWQiLCJ3aGF0Iiwic2F2ZVRvRGF0YWJhc2UiLCJnZXRJZCIsImlkZW50aWZ5SWRzIiwiX3ZhbGlkYXRlSWRzIiwidmFsaWRJZHMiLCJfY2hlY2tXaGF0IiwiX3ZpcnR1YWxBY3Rpb24iLCJhY3Rpb24iLCJyZXZlcnNlZExpbmsiLCJlbGVtZW50SWQiLCJpbnNlcnQiLCJfaWRzIiwibW9kaWZpZXIiLCIkYWRkVG9TZXQiLCIkZWFjaCIsInVwZGF0ZSIsImZpbHRlciIsIiRwdWxsIiwibWV0YWRhdGFzIiwibG9jYWxNZXRhZGF0YSIsImV4dGVuZE1ldGFkYXRhIiwiZXhpc3RpbmdNZXRhZGF0YSIsInN1YmZpZWxkVXBkYXRlIiwiJHNldCIsInN1YldoYXQiLCJOYW1lZFF1ZXJ5QmFzZSIsImlzTmFtZWRRdWVyeSIsInF1ZXJ5TmFtZSIsInJlc29sdmVyIiwic3Vic2NyaXB0aW9uSGFuZGxlIiwiaXNFeHBvc2VkIiwiaXNSZXNvbHZlciIsInNldFBhcmFtcyIsImRvVmFsaWRhdGVQYXJhbXMiLCJ2YWxpZGF0ZVBhcmFtcyIsIl92YWxpZGF0ZSIsInZhbGlkYXRpb25FcnJvciIsImVycm9yIiwibmV3UGFyYW1zIiwiY2FjaGVyIiwiZXhwb3NlQ29uZmlnIiwidmFsaWRhdG9yIiwiZGVmYXVsdE9wdGlvbnMiLCJDb3VudFN1YnNjcmlwdGlvbiIsInJlY3Vyc2l2ZUZldGNoIiwicHJlcGFyZUZvclByb2Nlc3MiLCJjYWxsV2l0aFByb21pc2UiLCJCYXNlIiwiTG9jYWxDb2xsZWN0aW9uIiwic3Vic2NyaWJlIiwiY2FsbGJhY2siLCJzdWJzY3JpYmVDb3VudCIsIl9jb3VudGVyIiwidW5zdWJzY3JpYmUiLCJzdG9wIiwidW5zdWJzY3JpYmVDb3VudCIsImZldGNoU3luYyIsImZldGNoT25lU3luYyIsImNhbGxiYWNrT3JPcHRpb25zIiwiX2ZldGNoU3RhdGljIiwiX2ZldGNoUmVhY3RpdmUiLCJmZXRjaE9uZSIsImVyciIsInJlcyIsImdldENvdW50U3luYyIsImdldENvdW50IiwiJGJvZHkiLCJhbGxvd1NraXAiLCJza2lwIiwic2NvcGVkIiwiTmFtZWRRdWVyeUNsaWVudCIsIk5hbWVkUXVlcnlTZXJ2ZXIiLCJNZW1vcnlSZXN1bHRDYWNoZXIiLCJjb250ZXh0IiwiX3BlcmZvcm1TZWN1cml0eUNoZWNrcyIsIl9mZXRjaFJlc29sdmVyRGF0YSIsImRvRW1ib2RpbWVudElmSXRBcHBsaWVzIiwiY2FjaGVJZCIsImdlbmVyYXRlUXVlcnlJZCIsImNvdW50Q3Vyc29yIiwiZ2V0Q3Vyc29yRm9yQ291bnRpbmciLCJjYWNoZVJlc3VsdHMiLCJyZXNvbHZlIiwiZm4iLCJzZWxmIiwic3RvcmFnZSIsImdldEFsbCIsIkJhc2VSZXN1bHRDYWNoZXIiLCJFSlNPTiIsInN0cmluZ2lmeSIsImZldGNoRGF0YSIsImNsb25lRGVlcCIsIkRFRkFVTFRfVFRMIiwic3RvcmUiLCJjYWNoZURhdGEiLCJzdG9yZURhdGEiLCJ0dGwiLCJzZXRUaW1lb3V0IiwiRXhwb3NlU2NoZW1hIiwiRXhwb3NlRGVmYXVsdHMiLCJtZXJnZURlZXAiLCJfaW5pdE5vcm1hbFF1ZXJ5IiwiX2luaXRNZXRob2QiLCJfaW5pdFB1YmxpY2F0aW9uIiwiX2luaXRDb3VudE1ldGhvZCIsIl9pbml0Q291bnRQdWJsaWNhdGlvbiIsIl91bmJsb2NrSWZOZWNlc3NhcnkiLCJpc1Njb3BlZCIsImVuYWJsZVNjb3BlIiwidGFyZ2V0Iiwic291cmNlIiwiUXVlcnlCYXNlIiwiaXNHbG9iYWxRdWVyeSIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlTZXJ2ZXIiLCJDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQiLCJSZWFjdGl2ZVZhciIsIlRyYWNrZXIiLCJDb3VudHMiLCJjcmVhdGVGYXV4U3Vic2NyaXB0aW9uIiwiYWNjZXNzVG9rZW4iLCJmYXV4SGFuZGxlIiwiZXF1YWxzIiwibGFzdEFyZ3MiLCJ0b2tlbiIsIl9tYXJrZWRGb3JVbnN1YnNjcmliZSIsImRpc2Nvbm5lY3RDb21wdXRhdGlvbiIsImF1dG9ydW4iLCJoYW5kbGVEaXNjb25uZWN0IiwiaWQiLCJzdGF0dXMiLCJjb25uZWN0ZWQiLCJfbWFya2VkRm9yUmVzdW1lIiwiaXNTdWJzY3JpYmVkIiwiY291bnRNYW5hZ2VyIiwicmVhZHkiLCJwYXJhbXNPckJvZHkiLCJzZXNzaW9uSWQiLCJKU09OIiwiZXhpc3RpbmdTZXNzaW9uIiwicHVibGlzaCIsInJlcXVlc3QiLCJwYXJzZSIsImN1cnNvciIsImlzUmVhZHkiLCJoYW5kbGUiLCJvYnNlcnZlIiwiYWRkZWQiLCJjaGFuZ2VkIiwicmVtb3ZlZCIsIm9uU3RvcCIsIkFnZ3JlZ2F0ZUZpbHRlcnMiLCJleHRyYWN0SWRzRnJvbUFycmF5IiwiYXJyYXkiLCJwYXJlbnRPYmplY3RzIiwicGFyZW50IiwicmVzdWx0cyIsImNyZWF0ZSIsImVsaWdpYmxlT2JqZWN0cyIsInN0b3JhZ2VzIiwiYXJyYXlPZklkcyIsImlzVmFsaWQiLCJjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIiwiY2hpbGRDb2xsZWN0aW9uTm9kZSIsImFnZ3JlZ2F0ZVJlc3VsdHMiLCJhbGxSZXN1bHRzIiwibWV0YUZpbHRlcnNUZXN0IiwicGFyZW50UmVzdWx0IiwiZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzIiwiYWdncmVnYXRlUmVzdWx0IiwiZGF0YXMiLCJjb21wYXJhdG9yIiwiY2hpbGRMaW5rTmFtZSIsInBhcmVudFJlc3VsdHMiLCJyZXN1bHRzQnlLZXlJZCIsImdyb3VwQnkiLCJmaWx0ZXJBc3NlbWJsZWREYXRhIiwiU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQiLCJjb250YWluc0RvdHRlZEZpZWxkcyIsInBpcGVsaW5lIiwiY2xlYW5VbmRlZmluZWRMZWFmcyIsIiRtYXRjaCIsIiRzb3J0IiwiZGF0YVB1c2giLCJzYWZlRmllbGQiLCIkZ3JvdXAiLCIkcHVzaCIsIiRzbGljZSIsIiRwcm9qZWN0IiwidHJlZSIsImEiLCJoeXBlcm5vdmFJbml0IiwiYXBwbHlQcm9wcyIsInByZXBhcmVGb3JEZWxpdmVyeSIsInN0b3JlSHlwZXJub3ZhUmVzdWx0cyIsInVzZXJJZFRvUGFzcyIsImFzc2VtYmxlIiwiYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzIiwiYnVpbGRBZ2dyZWdhdGVQaXBlbGluZSIsInNuYXBCYWNrRG90dGVkRmllbGRzIiwiYWdncmVnYXRlRmlsdGVycyIsImZpbHRlcmVkT3B0aW9ucyIsImFnZ3JlZ2F0aW9uUmVzdWx0IiwiZG9jdW1lbnQiLCJSZWdFeHAiLCJyZXN0cmljdE9wdGlvbnMiLCJwcm9wcyIsImFwcGx5RmllbGRzIiwibXlQYXJhbWV0ZXJzIiwicmVqZWN0IiwicmVhc29uIiwic3BlY2lhbEZpZWxkcyIsImNyZWF0ZU5vZGVzIiwiYWRkRmllbGROb2RlIiwiZ2V0Tm9kZU5hbWVzcGFjZSIsIkNvbGxlY3Rpb25Ob2RlIiwiRmllbGROb2RlIiwiUmVkdWNlck5vZGUiLCJjcmVhdGVSZWR1Y2VycyIsImZpZWxkTmFtZSIsImFkZFByb3AiLCJoYW5kbGVEZW5vcm1hbGl6ZWQiLCJzdWJyb290IiwicmVkdWNlciIsImdldFJlZHVjZXIiLCJyZWR1Y2VyTm9kZSIsImlzUHJvamVjdGlvbk9wZXJhdG9yRXhwcmVzc2lvbiIsImRvdHRlZCIsImZpZWxkTm9kZSIsIm4iLCJyZXZlcnNlIiwic25hcENhY2hlIiwicHJlZml4IiwibmV3T2JqIiwicmVjdXJzZSIsIm8iLCJwIiwiaXNBcnJheUl0ZW0iLCJmIiwiaXNFbXB0eUFycmF5IiwiZ2V0RmllbGROYW1lIiwiaXNFbXB0eU9iaiIsImlzTnVtYmVyIiwiaXNOYU4iLCJwYXJzZUludCIsImhhc093blByb3BlcnR5IiwiZXhwYW5kRmllbGQiLCJpc0ZpZWxkSW5Qcm9qZWN0aW9uIiwicHJvamVjdGlvbiIsImNoZWNrTmVzdGVkIiwic29tZSIsIkVYVEVOREVEX1NQRUNJQUxfRklFTERTIiwiaXNDbGllbnRWYWx1ZVZhbGlkIiwidmFsdWVzIiwiZXZlcnkiLCJuZXN0ZWRWYWx1ZSIsImludGVyc2VjdEZpZWxkcyIsImFsbG93ZWQiLCJjbGllbnQiLCJpbnRlcnNlY3Rpb24iLCJwYWlycyIsImNsaWVudFZhbHVlIiwic2VydmVyVmFsdWUiLCJhbGxvd2VkQm9keSIsImNsaWVudEJvZHkiLCJidWlsZCIsImFwcGx5UG9zdEZpbHRlcnMiLCJhcHBseVBvc3RPcHRpb25zIiwiZ2V0UmVzdWx0c0FycmF5IiwicmVtb3ZlTGlua1N0b3JhZ2VzIiwic3RvcmVPbmVSZXN1bHRzIiwiYXNzZW1ibGVNZXRhZGF0YSIsImFwcGx5UmVkdWNlcnMiLCJjbGVhblJlZHVjZXJMZWZ0b3ZlcnMiLCJNaW5pbW9uZ28iLCJzbmFwQmFja0NhY2hlcyIsImNsb25lTWV0YUNoaWxkcmVuIiwiYXBwbHlQb3N0RmlsdGVyIiwicG9zdEZpbHRlcnMiLCIkcG9zdEZpbHRlcnMiLCIkcG9zdE9wdGlvbnMiLCJzb3J0ZXIiLCJTb3J0ZXIiLCJnZXRDb21wYXJhdG9yIiwic3RhcnQiLCJlbmQiLCIkcG9zdEZpbHRlciIsImlzVW5kZWZpbmVkIiwic2FtZUxldmVsUmVzdWx0cyIsInJlbW92ZVN0b3JhZ2VGaWVsZCIsInNob3VsZENsZWFuU3RvcmFnZSIsInJlbW92ZUZyb21SZXN1bHQiLCJyZW1vdmVFbXB0eVJvb3QiLCJpc0VtcHR5IiwiY2hpbGRSZXN1bHRzIiwiY2hpbGRSZXN1bHQiLCJzdG9yZU1ldGFkYXRhIiwicGFyZW50RWxlbWVudCIsIiRtZXRhZGF0YSIsInN0b3JhZ2VJdGVtIiwic25hcENhY2hlcyIsInNuYXBDYWNoZXNTaW5nbGVzIiwic2hvdWRTdG9yZUxpbmtTdG9yYWdlIiwiZGVmYXVsdEZpbHRlckZ1bmN0aW9uIiwiYXBwbHlGaWx0ZXJSZWN1cnNpdmUiLCJpc1Jvb3QiLCIkZmlsdGVyIiwiYXBwbHlQYWdpbmF0aW9uIiwiX3BhcmFtcyIsIl9ib2R5IiwicGF0Y2hDdXJzb3IiLCJucyIsIm9yaWdpbmFsT2JzZXJ2ZSIsImNhbGxiYWNrcyIsIm5ld0NhbGxiYWNrcyIsImNvbXBvc2UiLCJjaGlsZHJlbiIsInBhcmVudE9iamVjdCIsImZldGNoT3B0aW9ucyIsInNjb3BlUXVlcnkiLCIkZXhpc3RzIiwiY29sbGVjdGlvbk5vZGVSZXN1bHRzIiwicnVuRmllbGRTYW5pdHlDaGVja3MiLCJub2RlcyIsInNjaGVkdWxlZEZvckRlbGV0aW9uIiwicmVkdWNlcnMiLCJyZWR1Y2VyTm9kZXMiLCJfc2hvdWxkQ2xlYW5TdG9yYWdlIiwiX25vZGUiLCJoYXNBZGRlZEFueUZpZWxkIiwicHJvamVjdGlvbk9wZXJhdG9yIiwiaGFzIiwiaGFzRmllbGQiLCJnZXRGaWVsZCIsImhhc0NvbGxlY3Rpb25Ob2RlIiwiaGFzUmVkdWNlck5vZGUiLCJnZXRSZWR1Y2VyTm9kZSIsImdldENvbGxlY3Rpb25Ob2RlIiwiZ2V0TmFtZSIsInN1YkxpbmtOYW1lIiwiaXNQcm9qZWN0aW9uT3BlcmF0b3IiLCJyZWR1Y2UiLCJyZWR1Y2VGdW5jdGlvbiIsImRlcGVuZGVuY2llcyIsImNvbXB1dGUiLCJhZGRGaWVsZE1hcCIsImFkZFJlZHVjZXJzIiwicmVkdWNlckNvbmZpZyIsInJlZHVjZXJOYW1lIiwiZGJGaWVsZCIsInByb2Nlc3NlZFJlZHVjZXJzIiwicmVkdWNlcnNRdWV1ZSIsImFsbERlcGVuZGVuY2llc0NvbXB1dGVkIiwiYWxsIiwiZGVwIiwiaW5jbHVkZXMiLCJmbGF0dGVuIiwiY2xlYW5OZXN0ZWRGaWVsZHMiLCJzbmFwQ2FjaGVGaWVsZCIsImhhbmRsZUFkZEVsZW1lbnQiLCJoYW5kbGVBZGRSZWR1Y2VyIiwiaGFuZGxlQWRkTGluayIsImhhbmRsZUFkZEZpZWxkIiwiZW1iZWRSZWR1Y2VyV2l0aExpbmsiLCJjaGlsZFJlZHVjZXJOb2RlIiwiZG90cyIsImFkZEZpZWxkSWZSZXF1aXJlZCIsIm5lc3RlZEZpZWxkcyIsInN0YXJ0c1dpdGgiLCJyZWR1Y2VyQm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxpQkFBZSxFQUFDLE1BQUlBLGVBQXJCO0FBQXFDQyxlQUFhLEVBQUMsTUFBSUE7QUFBdkQsQ0FBZDtBQUFxRkgsTUFBTSxDQUFDSSxJQUFQLENBQVksb0JBQVo7QUFBa0NKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGlCQUFaO0FBQStCSixNQUFNLENBQUNJLElBQVAsQ0FBWSw2QkFBWjtBQUEyQ0osTUFBTSxDQUFDSSxJQUFQLENBQVksMEJBQVo7QUFBd0NKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLG1DQUFaO0FBQWlESixNQUFNLENBQUNJLElBQVAsQ0FBWSxzQ0FBWjtBQUFvRCxJQUFJRixlQUFKO0FBQW9CRixNQUFNLENBQUNJLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixtQkFBZSxHQUFDSSxDQUFoQjtBQUFrQjs7QUFBOUIsQ0FBckMsRUFBcUUsQ0FBckU7QUFBd0UsSUFBSUgsYUFBSjtBQUFrQkgsTUFBTSxDQUFDSSxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0gsaUJBQWEsR0FBQ0csQ0FBZDtBQUFnQjs7QUFBNUIs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akosSUFBZixDQUFvQmtILEdBQXBCLENBQUwsRUFBK0I7QUFDM0I7QUFDQSxjQUFNOFosT0FBTyxHQUFHemdCLFVBQVUsQ0FBQzBnQixVQUFYLENBQXNCL1osR0FBdEIsQ0FBaEI7O0FBQ0EsWUFBSThaLE9BQUosRUFBYTtBQUNUO0FBQ0EsaUJBQU95SSxnQkFBZ0IsQ0FBQ3ZpQixHQUFELEVBQU04WixPQUFOLEVBQWUvWCxjQUFmLENBQXZCO0FBQ0g7O0FBRUQsZUFBTzBnQixjQUFjLENBQUN6aUIsR0FBRCxFQUFNQyxLQUFOLEVBQWE4QixjQUFiLENBQXJCO0FBQ0g7QUFDSjtBQUNKLEdBMUNEO0FBMkNILEMiLCJmaWxlIjoiL3BhY2thZ2VzL2N1bHRvZmNvZGVyc19ncmFwaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2xpYi9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9hZ2dyZWdhdGUnO1xuaW1wb3J0ICcuL2xpYi9leHBvc3VyZS9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9saW5rcy9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlTdG9yZSBmcm9tICcuL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlJztcbmltcG9ydCBMaW5rQ29uc3RhbnRzIGZyb20gJy4vbGliL2xpbmtzL2NvbnN0YW50cyc7XG5cbmV4cG9ydCB7IE5hbWVkUXVlcnlTdG9yZSwgTGlua0NvbnN0YW50cyB9O1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVF1ZXJ5IH0gZnJvbSAnLi9saWIvY3JlYXRlUXVlcnkuanMnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIE5hbWVkUXVlcnkgfSBmcm9tICcuL2xpYi9uYW1lZFF1ZXJ5L25hbWVkUXVlcnkuc2VydmVyJztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBvc3VyZSB9IGZyb20gJy4vbGliL2V4cG9zdXJlL2V4cG9zdXJlLmpzJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIE1lbW9yeVJlc3VsdENhY2hlcixcbn0gZnJvbSAnLi9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXInO1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgQmFzZVJlc3VsdENhY2hlcixcbn0gZnJvbSAnLi9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyJztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb21wb3NlIH0gZnJvbSAnLi9saWIvY29tcG9zZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL2dyYXBocWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkYiB9IGZyb20gJy4vbGliL2RiJztcbiIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICdtZXRlb3IvcHJvbWlzZSc7XG5cbk1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLmFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKHBpcGVsaW5lcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29sbCA9IHRoaXMucmF3Q29sbGVjdGlvbigpO1xuXG4gICAgbGV0IHJlc3VsdCA9IE1ldGVvci53cmFwQXN5bmMoY29sbC5hZ2dyZWdhdGUsIGNvbGwpKHBpcGVsaW5lcywgb3B0aW9ucyk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIElmIGl0J3MgYW4gQWdncmVnYXRpb25DdXJzb3JcbiAgICAvLyBUaGUgcmVhc29uIHdlIGRvIHRoaXMgd2FzIGJlY2F1c2Ugb2YgdGhlIHVwZ3JhZGUgdG8gMS43IHdoaWNoIGludm9sdmVkIGEgbW9uZ29kYiBkcml2ZXIgdXBkYXRlXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmF3YWl0KHJlc3VsdC50b0FycmF5KCkpO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgZGVlcEV4dGVuZCBmcm9tICdkZWVwLWV4dGVuZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIGRlZXBFeHRlbmQoe30sIC4uLmFyZ3MpO1xufSIsImltcG9ydCBRdWVyeSBmcm9tICcuL3F1ZXJ5L3F1ZXJ5LmpzJztcbmltcG9ydCBOYW1lZFF1ZXJ5IGZyb20gJy4vbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmpzJztcbmltcG9ydCBOYW1lZFF1ZXJ5U3RvcmUgZnJvbSAnLi9uYW1lZFF1ZXJ5L3N0b3JlLmpzJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgcG9seW1vcnBoaWMgZnVuY3Rpb24sIGl0IGFsbG93cyB5b3UgdG8gY3JlYXRlIGEgcXVlcnkgYXMgYW4gb2JqZWN0XG4gKiBvciBpdCBhbHNvIGFsbG93cyB5b3UgdG8gcmUtdXNlIGFuIGV4aXN0aW5nIHF1ZXJ5IGlmIGl0J3MgYSBuYW1lZCBvbmVcbiAqXG4gKiBAcGFyYW0gYXJnc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBkZWZhdWx0ICguLi5hcmdzKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBsZXQgW25hbWUsIGJvZHksIG9wdGlvbnNdID0gYXJncztcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgLy8gSXQncyBhIHJlc29sdmVyIHF1ZXJ5XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oYm9keSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KG5hbWUsIG51bGwsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW50cnlQb2ludE5hbWUgPSBfLmZpcnN0KF8ua2V5cyhib2R5KSk7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChlbnRyeVBvaW50TmFtZSk7XG5cbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLW5hbWUnLCBgV2UgY291bGQgbm90IGZpbmQgYW55IGNvbGxlY3Rpb24gd2l0aCB0aGUgbmFtZSBcIiR7ZW50cnlQb2ludE5hbWV9XCIuIE1ha2Ugc3VyZSBpdCBpcyBpbXBvcnRlZCBwcmlvciB0byB1c2luZyB0aGlzYClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KG5hbWUsIGNvbGxlY3Rpb24sIGJvZHlbZW50cnlQb2ludE5hbWVdLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBRdWVyeSBDcmVhdGlvbiwgaXQgY2FuIGhhdmUgYW4gZW5kcG9pbnQgYXMgY29sbGVjdGlvbiBvciBhcyBhIE5hbWVkUXVlcnlcbiAgICAgICAgbGV0IFtib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnROYW1lID0gXy5maXJzdChfLmtleXMoYm9keSkpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQoZW50cnlQb2ludE5hbWUpO1xuXG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50ICYmICFOYW1lZFF1ZXJ5U3RvcmUuZ2V0KGVudHJ5UG9pbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgWW91IGFyZSBjcmVhdGluZyBhIHF1ZXJ5IHdpdGggdGhlIGVudHJ5IHBvaW50IFwiJHtlbnRyeVBvaW50TmFtZX1cIiwgYnV0IHRoZXJlIHdhcyBubyBjb2xsZWN0aW9uIGZvdW5kIGZvciBpdCAobWF5YmUgeW91IGZvcmdvdCB0byBpbXBvcnQgaXQgY2xpZW50LXNpZGU/KS4gSXQncyBhc3N1bWVkIHRoYXQgaXQncyByZWZlcmVuY2luZyBhIE5hbWVkUXVlcnkuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5hbWVkUXVlcnkoZW50cnlQb2ludE5hbWUsIG51bGwsIHt9LCB7cGFyYW1zOiBib2R5W2VudHJ5UG9pbnROYW1lXX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5vcm1hbFF1ZXJ5KGNvbGxlY3Rpb24sIGJvZHlbZW50cnlQb2ludE5hbWVdLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBpZiBpdCBleGlzdHMgYWxyZWFkeSwgd2UgcmUtdXNlIGl0XG4gICAgY29uc3QgbmFtZWRRdWVyeSA9IE5hbWVkUXVlcnlTdG9yZS5nZXQobmFtZSk7XG4gICAgbGV0IHF1ZXJ5O1xuXG4gICAgaWYgKCFuYW1lZFF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5ID0gbmV3IE5hbWVkUXVlcnkobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyk7XG4gICAgICAgIE5hbWVkUXVlcnlTdG9yZS5hZGQobmFtZSwgcXVlcnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5ID0gbmFtZWRRdWVyeS5jbG9uZShvcHRpb25zLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb3JtYWxRdWVyeShjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zKSAge1xuICAgIHJldHVybiBuZXcgUXVlcnkoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuY29uc3QgZGIgPSBuZXcgUHJveHkoXG4gIHt9LFxuICB7XG4gICAgZ2V0OiBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KHByb3ApO1xuXG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfSxcbiAgfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZGI7XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeS9xdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbmFtZWRRdWVyeS9zdG9yZS5qcyc7XG5cbl8uZXh0ZW5kKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgY3JlYXRlUXVlcnkoLi4uYXJncykge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVlcnkodGhpcywge30sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy9OYW1lZFF1ZXJ5XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgTmFtZWRRdWVyeShuYW1lLCB0aGlzLCBib2R5LCBvcHRpb25zKTtcbiAgICAgICAgICAgIE5hbWVkUXVlcnlTdG9yZS5hZGQobmFtZSwgcXVlcnkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBbYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXJ5KHRoaXMsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3N1cmVEZWZhdWx0cyA9IHtcbiAgICBibG9ja2luZzogZmFsc2UsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHB1YmxpY2F0aW9uOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IEV4cG9zdXJlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBtYXhMaW1pdDogTWF0Y2guTWF5YmUoTWF0Y2guSW50ZWdlciksXG4gICAgbWF4RGVwdGg6IE1hdGNoLk1heWJlKE1hdGNoLkludGVnZXIpLFxuICAgIHB1YmxpY2F0aW9uOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBtZXRob2Q6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGJsb2NraW5nOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBib2R5OiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgIHJlc3RyaWN0ZWRGaWVsZHM6IE1hdGNoLk1heWJlKFtTdHJpbmddKSxcbiAgICByZXN0cmljdExpbmtzOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtTdHJpbmddKVxuICAgICksXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb2R5KGNvbGxlY3Rpb24sIGJvZHkpIHtcbiAgICB0cnkge1xuICAgICAgICBjcmVhdGVHcmFwaChjb2xsZWN0aW9uLCBib2R5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtYm9keScsICdXZSBjb3VsZCBub3QgYnVpbGQgYSB2YWxpZCBncmFwaCB3aGVuIHRyeWluZyB0byBjcmVhdGUgeW91ciBleHBvc3VyZTogJyArIGUudG9TdHJpbmcoKSlcbiAgICB9XG59IiwiaW1wb3J0IGdlbkNvdW50RW5kcG9pbnQgZnJvbSAnLi4vcXVlcnkvY291bnRzL2dlbkVuZHBvaW50LnNlcnZlci5qcyc7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi4vcXVlcnkvbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVDb21wb3NlIGZyb20gJy4uL3F1ZXJ5L2xpYi9yZWN1cnNpdmVDb21wb3NlLmpzJztcbmltcG9ydCBoeXBlcm5vdmEgZnJvbSAnLi4vcXVlcnkvaHlwZXJub3ZhL2h5cGVybm92YS5qcyc7XG5pbXBvcnQge1xuICAgIEV4cG9zdXJlU2NoZW1hLFxuICAgIEV4cG9zdXJlRGVmYXVsdHMsXG4gICAgdmFsaWRhdGVCb2R5LFxufSBmcm9tICcuL2V4cG9zdXJlLmNvbmZpZy5zY2hlbWEuanMnO1xuaW1wb3J0IGVuZm9yY2VNYXhEZXB0aCBmcm9tICcuL2xpYi9lbmZvcmNlTWF4RGVwdGguanMnO1xuaW1wb3J0IGVuZm9yY2VNYXhMaW1pdCBmcm9tICcuL2xpYi9lbmZvcmNlTWF4TGltaXQuanMnO1xuaW1wb3J0IGNsZWFuQm9keSBmcm9tICcuL2xpYi9jbGVhbkJvZHkuanMnO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCByZXN0cmljdEZpZWxkc0ZuIGZyb20gJy4vbGliL3Jlc3RyaWN0RmllbGRzLmpzJztcbmltcG9ydCByZXN0cmljdExpbmtzIGZyb20gJy4vbGliL3Jlc3RyaWN0TGlua3MuanMnO1xuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5sZXQgZ2xvYmFsQ29uZmlnID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zdXJlIHtcbiAgICBzdGF0aWMgc2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGdsb2JhbENvbmZpZywgY29uZmlnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXN0cmljdEZpZWxkcyguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiByZXN0cmljdEZpZWxkc0ZuKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGNvbGxlY3Rpb24uX19pc0V4cG9zZWRGb3JHcmFwaGVyID0gdHJ1ZTtcbiAgICAgICAgY29sbGVjdGlvbi5fX2V4cG9zdXJlID0gdGhpcztcblxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgICAgICB0aGlzLm5hbWUgPSBgZXhwb3N1cmVfJHtjb2xsZWN0aW9uLl9uYW1lfWA7XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlQW5kQ2xlYW4oKTtcblxuICAgICAgICB0aGlzLmluaXRTZWN1cml0eSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5pbml0UHVibGljYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5tZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5tZXRob2QgJiYgIXRoaXMuY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICd3ZWlyZCcsXG4gICAgICAgICAgICAgICAgJ0lmIHlvdSB3YW50IHRvIGV4cG9zZSB5b3VyIGNvbGxlY3Rpb24geW91IG5lZWQgdG8gc3BlY2lmeSBhdCBsZWFzdCBvbmUgb2YgW1wibWV0aG9kXCIsIFwicHVibGljYXRpb25cIl0gb3B0aW9ucyB0byB0cnVlJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdENvdW50TWV0aG9kKCk7XG4gICAgICAgIHRoaXMuaW5pdENvdW50UHVibGljYXRpb24oKTtcbiAgICB9XG5cbiAgICBfdmFsaWRhdGVBbmRDbGVhbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmNvbmZpZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgZmlyZXdhbGwgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0geyBmaXJld2FsbCB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgICAge30sXG4gICAgICAgICAgICBFeHBvc3VyZURlZmF1bHRzLFxuICAgICAgICAgICAgRXhwb3N1cmUuZ2V0Q29uZmlnKCksXG4gICAgICAgICAgICB0aGlzLmNvbmZpZ1xuICAgICAgICApO1xuICAgICAgICBjaGVjayh0aGlzLmNvbmZpZywgRXhwb3N1cmVTY2hlbWEpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUJvZHkodGhpcy5jb2xsZWN0aW9uLCB0aGlzLmNvbmZpZy5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2VzIHRoZSBib2R5IGFuZCBpbnRlcnNlY3RzIGl0IHdpdGggdGhlIGV4cG9zdXJlIGJvZHksIGlmIGl0IGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldFRyYW5zZm9ybWVkQm9keShib2R5LCB1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NlZEJvZHkgPSB0aGlzLmdldEJvZHkodXNlcklkKTtcblxuICAgICAgICBpZiAocHJvY2Vzc2VkQm9keSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFuQm9keShwcm9jZXNzZWRCb2R5LCBib2R5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBleHBvc3VyZSBib2R5XG4gICAgICovXG4gICAgZ2V0Qm9keSh1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdtaXNzaW5nLWJvZHknLFxuICAgICAgICAgICAgICAgICdDYW5ub3QgZ2V0IGV4cG9zdXJlIGJvZHkgYmVjYXVzZSBpdCB3YXMgbm90IGRlZmluZWQuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBib2R5O1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHRoaXMuY29uZmlnLmJvZHkpKSB7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy5jb25maWcuYm9keS5jYWxsKHRoaXMsIHVzZXJJZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0gdGhpcy5jb25maWcuYm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0IG1lYW5zIHdlIGFsbG93IGV2ZXJ5dGhpbmcsIG5vIG5lZWQgZm9yIGNsb25pbmcuXG4gICAgICAgIGlmIChib2R5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWVwQ2xvbmUoYm9keSwgdXNlcklkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXppbmcgdGhlIHB1YmxpY2F0aW9uIGZvciByZWFjdGl2ZSBxdWVyeSBmZXRjaGluZ1xuICAgICAqL1xuICAgIGluaXRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUodGhpcy5uYW1lLCBmdW5jdGlvbihib2R5KSB7XG4gICAgICAgICAgICBsZXQgdHJhbnNmb3JtZWRCb2R5ID0gZ2V0VHJhbnNmb3JtZWRCb2R5KGJvZHkpO1xuXG4gICAgICAgICAgICBjb25zdCByb290Tm9kZSA9IGNyZWF0ZUdyYXBoKGNvbGxlY3Rpb24sIHRyYW5zZm9ybWVkQm9keSk7XG5cbiAgICAgICAgICAgIGVuZm9yY2VNYXhEZXB0aChyb290Tm9kZSwgY29uZmlnLm1heERlcHRoKTtcbiAgICAgICAgICAgIHJlc3RyaWN0TGlua3Mocm9vdE5vZGUsIHRoaXMudXNlcklkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZUNvbXBvc2Uocm9vdE5vZGUsIHRoaXMudXNlcklkLCB7XG4gICAgICAgICAgICAgICAgYnlwYXNzRmlyZXdhbGxzOiAhIWNvbmZpZy5ib2R5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemV6IHRoZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIGRhdGEgdmlhIE1ldGVvci5jYWxsXG4gICAgICovXG4gICAgaW5pdE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbWV0aG9kQm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgICAgIGlmICghY29uZmlnLmJsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEJvZHkgPSBnZXRUcmFuc2Zvcm1lZEJvZHkoYm9keSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb3ROb2RlID0gY3JlYXRlR3JhcGgoY29sbGVjdGlvbiwgdHJhbnNmb3JtZWRCb2R5KTtcblxuICAgICAgICAgICAgZW5mb3JjZU1heERlcHRoKHJvb3ROb2RlLCBjb25maWcubWF4RGVwdGgpO1xuICAgICAgICAgICAgcmVzdHJpY3RMaW5rcyhyb290Tm9kZSwgdGhpcy51c2VySWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBleHBvc3VyZSBib2R5IGRlZmluZWQsIHRoZW4gd2UgbmVlZCB0byBhcHBseSBmaXJld2FsbHNcbiAgICAgICAgICAgIHJldHVybiBoeXBlcm5vdmEocm9vdE5vZGUsIHRoaXMudXNlcklkLCB7XG4gICAgICAgICAgICAgICAgYnlwYXNzRmlyZXdhbGxzOiAhIWNvbmZpZy5ib2R5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZV06IG1ldGhvZEJvZHksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIGNvdW50IG9mIHRoZSBkYXRhIHZpYSBNZXRlb3IuY2FsbFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGluaXRDb3VudE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lICsgJy5jb3VudCddKGJvZHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKGJvZHkuJGZpbHRlcnMgfHwge30sIHt9LCB0aGlzLnVzZXJJZClcbiAgICAgICAgICAgICAgICAgICAgLmNvdW50KCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVhY3RpdmUgZW5kcG9pbnQgdG8gcmV0cmlldmUgdGhlIGNvdW50IG9mIHRoZSBkYXRhLlxuICAgICAqL1xuICAgIGluaXRDb3VudFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG4gICAgICAgIGdlbkNvdW50RW5kcG9pbnQodGhpcy5uYW1lLCB7XG4gICAgICAgICAgICBnZXRDdXJzb3IoeyBzZXNzaW9uIH0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKFxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uLmZpbHRlcnMsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkczogeyBfaWQ6IDEgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51c2VySWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0U2Vzc2lvbihib2R5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZmlsdGVyczogYm9keS4kZmlsdGVycyB8fCB7fSB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgc2VjdXJpdHkgZW5mb3JjZW1lbnRcbiAgICAgKiBUSElOSzogTWF5YmUgaW5zdGVhZCBvZiBvdmVycmlkaW5nIC5maW5kLCBJIGNvdWxkIHN0b3JlIHRoaXMgZGF0YSBvZiBzZWN1cml0eSBpbnNpZGUgdGhlIGNvbGxlY3Rpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIGluaXRTZWN1cml0eSgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgeyBmaXJld2FsbCwgbWF4TGltaXQsIHJlc3RyaWN0ZWRGaWVsZHMgfSA9IHRoaXMuY29uZmlnO1xuICAgICAgICBjb25zdCBmaW5kID0gY29sbGVjdGlvbi5maW5kLmJpbmQoY29sbGVjdGlvbik7XG4gICAgICAgIGNvbnN0IGZpbmRPbmUgPSBjb2xsZWN0aW9uLmZpbmRPbmUuYmluZChjb2xsZWN0aW9uKTtcblxuICAgICAgICBjb2xsZWN0aW9uLmZpcmV3YWxsID0gKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCkgPT4ge1xuICAgICAgICAgICAgaWYgKHVzZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FsbEZpcmV3YWxsKFxuICAgICAgICAgICAgICAgICAgICB7IGNvbGxlY3Rpb246IGNvbGxlY3Rpb24gfSxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVycyxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgdXNlcklkXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIGVuZm9yY2VNYXhMaW1pdChvcHRpb25zLCBtYXhMaW1pdCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzdHJpY3RlZEZpZWxkcykge1xuICAgICAgICAgICAgICAgICAgICBFeHBvc3VyZS5yZXN0cmljdEZpZWxkcyhmaWx0ZXJzLCBvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgY29sbGVjdGlvbi5maW5kID0gZnVuY3Rpb24oZmlsdGVycywgb3B0aW9ucyA9IHt9LCB1c2VySWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIGZpbHRlcnMgaXMgdW5kZWZpbmVkIGl0IHNob3VsZCByZXR1cm4gYW4gZW1wdHkgaXRlbVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGZpbHRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaW5kKHVuZGVmaW5lZCwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb24uZmlyZXdhbGwoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbmQoZmlsdGVycywgb3B0aW9ucyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29sbGVjdGlvbi5maW5kT25lID0gZnVuY3Rpb24oXG4gICAgICAgICAgICBmaWx0ZXJzLFxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9LFxuICAgICAgICAgICAgdXNlcklkID0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgLy8gSWYgZmlsdGVycyBpcyB1bmRlZmluZWQgaXQgc2hvdWxkIHJldHVybiBhbiBlbXB0eSBpdGVtXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgZmlsdGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmlsdGVycyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzID0geyBfaWQ6IGZpbHRlcnMgfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmluZE9uZShmaWx0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9jYWxsRmlyZXdhbGwoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGZpcmV3YWxsIH0gPSB0aGlzLmNvbmZpZztcbiAgICAgICAgaWYgKCFmaXJld2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaXJld2FsbCkpIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmZvckVhY2goZmlyZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZS5jYWxsKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJld2FsbC5jYWxsKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEV4cG9zdXJlIGZyb20gJy4vZXhwb3N1cmUuanMnO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgZXhwb3NlKGNvbmZpZykge1xuICAgICAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnbm90LWFsbG93ZWQnLFxuICAgICAgICAgICAgICAgIGBZb3UgY2FuIG9ubHkgZXhwb3NlIGEgY29sbGVjdGlvbiBzZXJ2ZXIgc2lkZS4gJHt0aGlzLl9uYW1lfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXcgRXhwb3N1cmUodGhpcywgY29uZmlnKTtcbiAgICB9LFxufSk7XG4iLCJpbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHtjbGVhbkZpbHRlcnMsIGNsZWFuT3B0aW9uc30gZnJvbSAnLi9jbGVhblNlbGVjdG9ycyc7XG5pbXBvcnQgZG90aXplIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9kb3RpemUnO1xuXG4vKipcbiAqIERlZXAgSW50ZXIgQ29tcHV0YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xlYW5Cb2R5KG1haW4sIHNlY29uZCwgLi4uYXJncykge1xuICAgIGxldCBvYmplY3QgPSB7fTtcblxuICAgIGlmIChzZWNvbmQuJGZpbHRlcnMgfHwgc2Vjb25kLiRvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkcyhtYWluKTtcblxuICAgICAgICBjbGVhbkZpbHRlcnMoc2Vjb25kLiRmaWx0ZXJzLCBmaWVsZHMpO1xuICAgICAgICBjbGVhbk9wdGlvbnMoc2Vjb25kLiRvcHRpb25zLCBmaWVsZHMpO1xuICAgIH1cblxuICAgIF8uZWFjaChzZWNvbmQsIChzZWNvbmRWYWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICckZmlsdGVycycgfHwga2V5ID09PSAnJG9wdGlvbnMnKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHNlY29uZFZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbWFpbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB3ZSBydW4gaXQuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwobnVsbCwgLi4uYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyB1bmRlZmluZWQgb3IgZmFsc2UsIHdlIHNraXAgdGhlIG1lcmdlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2UgdHJlYXQgdGhpcyBzcGVjaWFsbHksIGlmIHRoZSB2YWx1ZSBpcyB0cnVlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSA/IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIGFuIG9iamVjdFxuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzZWNvbmQgb25lIGlzIGFuIG9iamVjdCBhcyB3ZWxsIHdlIHJ1biByZWN1cnNpdmVseSBydW4gdGhlIGludGVyc2VjdGlvblxuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gY2xlYW5Cb2R5KHZhbHVlLCBzZWNvbmRWYWx1ZSwgLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBub3QsIHRoZW4gd2Ugd2lsbCBpZ25vcmUgaXQsIGJlY2F1c2UgaXQgd29uJ3QgbWFrZSBzZW5zZS5cbiAgICAgICAgICAgIC8vIHRvIG1lcmdlIHthOiAxfSB3aXRoIDEuXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIGl0IHNob3VsZCBiZSBhIHRydXRoeSB2YWx1ZSBsaWtlIDFcbiAgICAgICAgaWYgKF8uaXNPYmplY3Qoc2Vjb25kVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIGFuIG9iamVjdCwgdGhlbiB3ZSB3aWxsIGtlZXAgaXQuXG4gICAgICAgICAgICAvLyB0aGlzIHdvbid0IGNhdXNlIHByb2JsZW0gd2l0aCBkZWVwIG5lc3RpbmcgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2hlbiB5b3Ugc3BlY2lmeSBsaW5rcyB5b3Ugd2lsbCBoYXZlIHRoZSBtYWluIHZhbHVlIGFzIGFuIG9iamVjdCwgb3RoZXJ3aXNlIGl0IHdpbGwgZmFpbFxuICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VkIGZvciB0aGluZ3MgbGlrZSB3aGVuIHlvdSBoYXZlIGEgaGFzaCBvYmplY3QgbGlrZSBwcm9maWxlIHdpdGggbXVsdGlwbGUgbmVzdGluZyBmaWVsZHMsIHlvdSBjYW4gYWxsb3cgdGhlIGNsaWVudCB0byBzcGVjaWZ5IG9ubHkgd2hhdCBoZSBuZWVkc1xuXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIHdlIGp1c3Qgc3RvcmUgdGhlIGZpcnN0IHZhbHVlXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZHMoYm9keSkge1xuICAgIHJldHVybiBfLmtleXMoZG90aXplLmNvbnZlcnQoYm9keSkpO1xufSIsImV4cG9ydCBmdW5jdGlvbiBjbGVhbk9wdGlvbnMob3B0aW9ucywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBfLnBpY2sob3B0aW9ucy5maWVsZHMsIC4uLmVuc3VyZUZpZWxkcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBvcHRpb25zLnNvcnQgPSBfLnBpY2sob3B0aW9ucy5zb3J0LCAuLi5lbnN1cmVGaWVsZHMpO1xuICAgIH1cbn1cblxuY29uc3QgZGVlcEZpbHRlckZpZWxkc0FycmF5ID0gWyckYW5kJywgJyRvcicsICckbm9yJ107XG5jb25zdCBkZWVwRmlsdGVyRmllbGRzT2JqZWN0ID0gWyckbm90J107XG5jb25zdCBzcGVjaWFsID0gWy4uLmRlZXBGaWx0ZXJGaWVsZHNBcnJheSwgLi4uZGVlcEZpbHRlckZpZWxkc09iamVjdF07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfLmVhY2goZmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNwZWNpYWwsIGtleSkpIHtcbiAgICAgICAgICAgIGlmICghZmllbGRFeGlzdHMoZW5zdXJlRmllbGRzLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZpbHRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc0FycmF5LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRdLmZvckVhY2goZWxlbWVudCA9PiBjbGVhbkZpbHRlcnMoZWxlbWVudCwgZW5zdXJlRmllbGRzKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2ZpZWxkXSkge1xuICAgICAgICAgICAgY2xlYW5GaWx0ZXJzKGZpbHRlcnNbZmllbGRdLCBlbnN1cmVGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogVGhpcyB3aWxsIGNoZWNrIGlmIGEgZmllbGQgZXhpc3RzIGluIGEgc2V0IG9mIGZpZWxkc1xuICogSWYgZmllbGRzIGNvbnRhaW5zIFtcInByb2ZpbGVcIl0sIHRoZW4gXCJwcm9maWxlLnNvbWV0aGluZ1wiIHdpbGwgcmV0dXJuIHRydWVcbiAqXG4gKiBAcGFyYW0gZmllbGRzXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRXhpc3RzKGZpZWxkcywga2V5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZpZWxkc1tpXSA9PT0ga2V5IHx8IGtleS5pbmRleE9mKGZpZWxkc1tpXSArICcuJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5vZGUsIG1heERlcHRoKSB7XG4gICAgaWYgKG1heERlcHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwdGggPSBnZXREZXB0aChub2RlKTtcblxuICAgIGlmIChkZXB0aCA+IG1heERlcHRoKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Rvby1kZWVwJywgJ1lvdXIgZ3JhcGggcmVxdWVzdCBpcyB0b28gZGVlcCBhbmQgaXQgaXMgbm90IGFsbG93ZWQuJylcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlcHRoKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb2xsZWN0aW9uTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiAxICsgXy5tYXgoXG4gICAgICAgIF8ubWFwKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBnZXREZXB0aClcbiAgICApO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zLCBtYXhMaW1pdCkge1xuICAgIGlmIChtYXhMaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5saW1pdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5saW1pdCA+IG1heExpbWl0KSB7XG4gICAgICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgfVxufSIsImNvbnN0IGRlZXBGaWx0ZXJGaWVsZHNBcnJheSA9IFsnJGFuZCcsICckb3InLCAnJG5vciddO1xuY29uc3QgZGVlcEZpbHRlckZpZWxkc09iamVjdCA9IFsnJG5vdCddO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byByZXN0cmljdCBzb21lIGZpZWxkcyB0byBzb21lIHVzZXJzLCBieSBwYXNzaW5nIHRoZSBmaWVsZHMgYXMgYXJyYXkgaW4gdGhlIGV4cG9zdXJlIG9iamVjdFxuICogRm9yIGV4YW1wbGUgaW4gYW4gdXNlciBleHBvc3VyZTogcmVzdHJpY3RGaWVsZHMob3B0aW9ucywgWydzZXJ2aWNlcycsICdjcmVhdGVkQXQnXSlcbiAqXG4gKiBAcGFyYW0gZmlsdGVycyBPYmplY3RcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHBhcmFtIHJlc3RyaWN0ZWRGaWVsZHMgQXJyYXlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzdHJpY3RGaWVsZHMoZmlsdGVycywgb3B0aW9ucywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmICghXy5pc0FycmF5KHJlc3RyaWN0ZWRGaWVsZHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtcGFyYW1ldGVycycsICdQbGVhc2Ugc3BlY2lmeSBhbiBhcnJheSBvZiByZXN0cmljdGVkIGZpZWxkcy4nKTtcbiAgICB9XG5cbiAgICBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgY2xlYW5PcHRpb25zKG9wdGlvbnMsIHJlc3RyaWN0ZWRGaWVsZHMpXG59XG5cbi8qKlxuICogRGVlcCBjbGVhbnMgZmlsdGVyc1xuICpcbiAqIEBwYXJhbSBmaWx0ZXJzXG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KGZpbHRlcnMsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNBcnJheS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBmaWx0ZXJzW2ZpZWxkXS5mb3JFYWNoKGVsZW1lbnQgPT4gY2xlYW5GaWx0ZXJzKGVsZW1lbnQsIHJlc3RyaWN0ZWRGaWVsZHMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc09iamVjdC5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBjbGVhbkZpbHRlcnMoZmlsdGVyc1tmaWVsZF0sIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogRGVlcGx5IGNsZWFucyBvcHRpb25zXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSByZXN0cmljdGVkRmllbGRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKSB7XG4gICAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KG9wdGlvbnMuZmllbGRzLCByZXN0cmljdGVkRmllbGRzKTtcblxuICAgICAgICBpZiAoXy5rZXlzKG9wdGlvbnMuZmllbGRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7X2lkOiAxfSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZmllbGRzID0ge19pZDogMX07XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBjbGVhbk9iamVjdChvcHRpb25zLnNvcnQsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDbGVhbnMgdGhlIG9iamVjdCAobm90IGRlZXBseSlcbiAqXG4gKiBAcGFyYW0gb2JqZWN0XG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbk9iamVjdChvYmplY3QsIHJlc3RyaWN0ZWRGaWVsZHMpIHtcbiAgICBfLmVhY2gob2JqZWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICByZXN0cmljdGVkRmllbGRzLmZvckVhY2goKHJlc3RyaWN0ZWRGaWVsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hdGNoaW5nKHJlc3RyaWN0ZWRGaWVsZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZmllbGQgPT0gc3ViZmllbGQgb3IgaWYgYCR7ZmllbGR9LmAgSU5DTFVERUQgaW4gc3ViZmllbGRcbiAqIEV4YW1wbGU6IFwicHJvZmlsZVwiIGFuZCBcInByb2ZpbGUuZmlyc3ROYW1lXCIgd2lsbCBiZSBhIG1hdGNoaW5nIGZpZWxkXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSBzdWJmaWVsZFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIG1hdGNoaW5nKGZpZWxkLCBzdWJmaWVsZCkge1xuICAgIGlmIChmaWVsZCA9PT0gc3ViZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YmZpZWxkLnNsaWNlKDAsIGZpZWxkLmxlbmd0aCArIDEpID09PSBmaWVsZCArICcuJztcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXN0cmljdExpbmtzKHBhcmVudE5vZGUsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN0cmljdGVkTGlua3MgPSBnZXRMaW5rcyhwYXJlbnROb2RlLCAuLi5hcmdzKTtcblxuICAgIGlmICghcmVzdHJpY3RlZExpbmtzIHx8IHJlc3RyaWN0ZWRMaW5rcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF8uZWFjaChwYXJlbnROb2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBpZiAoXy5jb250YWlucyhyZXN0cmljdGVkTGlua3MsIGNvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lKSkge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmUoY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5rcyhub2RlLCAuLi5hcmdzKSB7XG4gICAgaWYgKG5vZGUuY29sbGVjdGlvbiAmJiBub2RlLmNvbGxlY3Rpb24uX19leHBvc3VyZSkge1xuICAgICAgICBjb25zdCBleHBvc3VyZSA9IG5vZGUuY29sbGVjdGlvbi5fX2V4cG9zdXJlO1xuXG4gICAgICAgIGlmIChleHBvc3VyZS5jb25maWcucmVzdHJpY3RMaW5rcykge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnUmVzdHJpY3RMaW5rcyA9IGV4cG9zdXJlLmNvbmZpZy5yZXN0cmljdExpbmtzO1xuXG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNvbmZpZ1Jlc3RyaWN0TGlua3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1Jlc3RyaWN0TGlua3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb25maWdSZXN0cmljdExpbmtzKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBhc3RUb1F1ZXJ5IGZyb20gJy4vbGliL2FzdFRvUXVlcnknO1xuXG5leHBvcnQgeyBzZXRBc3RUb1F1ZXJ5RGVmYXVsdHMgfSBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGFzdFRvQm9keSB9IGZyb20gJy4vbGliL2FzdFRvQm9keSc7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgYXN0VG9RdWVyeSxcbn0pO1xuXG5leHBvcnQgeyBhc3RUb1F1ZXJ5IH07XG4iLCJleHBvcnQgY29uc3QgU3ltYm9scyA9IHtcbiAgQVJHVU1FTlRTOiBTeW1ib2woJ2FyZ3VtZW50cycpLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0VG9Cb2R5KGFzdCkge1xuICBjb25zdCBmaWVsZE5vZGVzID0gYXN0LmZpZWxkTm9kZXM7XG5cbiAgY29uc3QgYm9keSA9IGV4dHJhY3RTZWxlY3Rpb25TZXQoYXN0LmZpZWxkTm9kZXNbMF0uc2VsZWN0aW9uU2V0KTtcblxuICByZXR1cm4gYm9keTtcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFNlbGVjdGlvblNldChzZXQpIHtcbiAgbGV0IGJvZHkgPSB7fTtcbiAgc2V0LnNlbGVjdGlvbnMuZm9yRWFjaChlbCA9PiB7XG4gICAgaWYgKCFlbC5zZWxlY3Rpb25TZXQpIHtcbiAgICAgIGJvZHlbZWwubmFtZS52YWx1ZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBib2R5W2VsLm5hbWUudmFsdWVdID0gZXh0cmFjdFNlbGVjdGlvblNldChlbC5zZWxlY3Rpb25TZXQpO1xuICAgICAgaWYgKGVsLmFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgbGV0IGFyZ3VtZW50TWFwID0ge307XG4gICAgICAgIGVsLmFyZ3VtZW50cy5mb3JFYWNoKGFyZyA9PiB7XG4gICAgICAgICAgYXJndW1lbnRNYXBbYXJnLm5hbWUudmFsdWVdID0gYXJnLnZhbHVlLnZhbHVlO1xuICAgICAgICB9KTtcblxuICAgICAgICBib2R5W2VsLm5hbWUudmFsdWVdW1N5bWJvbHMuQVJHVU1FTlRTXSA9IGFyZ3VtZW50TWFwO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGJvZHk7XG59XG4iLCJpbXBvcnQgeyBjaGVjaywgTWF0Y2ggfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGFzdFRvQm9keSwgeyBTeW1ib2xzIH0gZnJvbSAnLi9hc3RUb0JvZHknO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnO1xuaW1wb3J0IGludGVyc2VjdERlZXAgZnJvbSAnLi4vLi4vcXVlcnkvbGliL2ludGVyc2VjdERlZXAnO1xuaW1wb3J0IGVuZm9yY2VNYXhMaW1pdCBmcm9tICcuLi8uLi9leHBvc3VyZS9saWIvZW5mb3JjZU1heExpbWl0JztcblxuY29uc3QgRXJyb3JzID0ge1xuICBNQVhfREVQVEg6ICdUaGUgbWF4aW11bSBkZXB0aCBvZiB0aGlzIHJlcXVlc3QgZXhjZWVkcyB0aGUgZGVwdGggYWxsb3dlZC4nLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXN0VG9RdWVyeShhc3QsIGNvbmZpZyA9IHt9KSB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSB0aGlzO1xuXG4gIGNoZWNrKGNvbmZpZywge1xuICAgIGVtYm9keTogTWF0Y2guTWF5YmUoRnVuY3Rpb24pLFxuICAgICRmaWx0ZXJzOiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgICRvcHRpb25zOiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgIG1heERlcHRoOiBNYXRjaC5NYXliZShOdW1iZXIpLFxuICAgIG1heExpbWl0OiBNYXRjaC5NYXliZShOdW1iZXIpLFxuICAgIGRlbnk6IE1hdGNoLk1heWJlKFtTdHJpbmddKSxcbiAgICBpbnRlcnNlY3Q6IE1hdGNoLk1heWJlKE9iamVjdCksXG4gIH0pO1xuXG4gIGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgJG9wdGlvbnM6IHt9LFxuICAgICAgJGZpbHRlcnM6IHt9LFxuICAgIH0sXG4gICAgZGVmYXVsdHMsXG4gICAgY29uZmlnXG4gICk7XG5cbiAgLy8gZ2V0IHRoZSBib2R5XG4gIGxldCBib2R5ID0gYXN0VG9Cb2R5KGFzdCk7XG5cbiAgLy8gZmlyc3Qgd2UgZG8gdGhlIGludGVyc2VjdGlvblxuICBpZiAoY29uZmlnLmludGVyc2VjdCkge1xuICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGNvbmZpZy5pbnRlcnNlY3QsIGJvZHkpO1xuICB9XG5cbiAgLy8gZW5mb3JjZSB0aGUgbWF4aW11bSBhbW91bnQgb2YgZGF0YSB3ZSBhbGxvdyB0byByZXRyaWV2ZVxuICBpZiAoY29uZmlnLm1heExpbWl0KSB7XG4gICAgZW5mb3JjZU1heExpbWl0KGNvbmZpZy4kb3B0aW9ucywgY29uZmlnLm1heExpbWl0KTtcbiAgfVxuXG4gIC8vIGZpZ3VyZSBvdXQgZGVwdGggYmFzZWRcbiAgaWYgKGNvbmZpZy5tYXhEZXB0aCkge1xuICAgIGNvbnN0IGN1cnJlbnRNYXhEZXB0aCA9IGdldE1heERlcHRoKGJvZHkpO1xuICAgIGlmIChjdXJyZW50TWF4RGVwdGggPiBjb25maWcubWF4RGVwdGgpIHtcbiAgICAgIHRocm93IEVycm9ycy5NQVhfREVQVEg7XG4gICAgfVxuICB9XG5cbiAgaWYgKGNvbmZpZy5kZW55KSB7XG4gICAgZGVueShib2R5LCBjb25maWcuZGVueSk7XG4gIH1cblxuICBPYmplY3QuYXNzaWduKGJvZHksIHtcbiAgICAkZmlsdGVyczogY29uZmlnLiRmaWx0ZXJzLFxuICAgICRvcHRpb25zOiBjb25maWcuJG9wdGlvbnMsXG4gIH0pO1xuXG4gIGlmIChjb25maWcuZW1ib2R5KSB7XG4gICAgY29uc3QgZ2V0QXJncyA9IGNyZWF0ZUdldEFyZ3MoYm9keSk7XG4gICAgY29uZmlnLmVtYm9keS5jYWxsKG51bGwsIHtcbiAgICAgIGJvZHksXG4gICAgICBnZXRBcmdzLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gd2UgcmV0dXJuIHRoZSBxdWVyeVxuICByZXR1cm4gdGhpcy5jcmVhdGVRdWVyeShib2R5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1heERlcHRoKGJvZHkpIHtcbiAgbGV0IGRlcHRocyA9IFtdO1xuICBmb3IgKGtleSBpbiBib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keVtrZXldKSkge1xuICAgICAgZGVwdGhzLnB1c2goZ2V0TWF4RGVwdGgoYm9keVtrZXldKSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRlcHRocy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLm1heCguLi5kZXB0aHMpICsgMTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbnkoYm9keSwgZmllbGRzKSB7XG4gIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICBsZXQgcGFydHMgPSBmaWVsZC5zcGxpdCgnLicpO1xuICAgIGxldCBhY2Nlc3NvciA9IGJvZHk7XG4gICAgd2hpbGUgKHBhcnRzLmxlbmd0aCAhPSAwKSB7XG4gICAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGRlbGV0ZSBhY2Nlc3NvcltwYXJ0c1swXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIV8uaXNPYmplY3QoYWNjZXNzb3IpKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYWNjZXNzb3IgPSBhY2Nlc3NvcltwYXJ0c1swXV07XG4gICAgICB9XG4gICAgICBwYXJ0cy5zaGlmdCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGNsZWFyRW1wdHlPYmplY3RzKGJvZHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJFbXB0eU9iamVjdHMoYm9keSkge1xuICAvLyBjbGVhciBlbXB0eSBub2RlcyB0aGVuIGJhY2stcHJvcGFnYXRlXG4gIGZvciAobGV0IGtleSBpbiBib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keVtrZXldKSkge1xuICAgICAgY29uc3Qgc2hvdWxkRGVsZXRlID0gY2xlYXJFbXB0eU9iamVjdHMoYm9keVtrZXldKTtcbiAgICAgIGlmIChzaG91bGREZWxldGUpIHtcbiAgICAgICAgZGVsZXRlIGJvZHlba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmtleXMoYm9keSkubGVuZ3RoID09PSAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR2V0QXJncyhib2R5KSB7XG4gIHJldHVybiBmdW5jdGlvbihwYXRoKSB7XG4gICAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcuJyk7XG4gICAgbGV0IHN0b3BwZWQgPSBmYWxzZTtcbiAgICBsZXQgYWNjZXNzb3IgPSBib2R5O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghYWNjZXNzb3IpIHtcbiAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWNjZXNzb3JbcGFydHNbaV1dKSB7XG4gICAgICAgIGFjY2Vzc29yID0gYWNjZXNzb3JbcGFydHNbaV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdG9wcGVkKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgaWYgKGFjY2Vzc29yKSB7XG4gICAgICByZXR1cm4gYWNjZXNzb3JbU3ltYm9scy5BUkdVTUVOVFNdIHx8IHt9O1xuICAgIH1cbiAgfTtcbn1cbiIsImxldCBkZWZhdWx0cyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcblxuZXhwb3J0IGZ1bmN0aW9uIHNldEFzdFRvUXVlcnlEZWZhdWx0cyhvYmplY3QpIHtcbiAgT2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb2JqZWN0KTtcbn1cbiIsImltcG9ydCB7TWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQge01vbmdvfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5leHBvcnQgY29uc3QgRGVub3JtYWxpemVTY2hlbWEgPSB7XG4gICAgZmllbGQ6IFN0cmluZyxcbiAgICBib2R5OiBPYmplY3QsXG4gICAgYnlwYXNzU2NoZW1hOiBNYXRjaC5NYXliZShCb29sZWFuKVxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtDb25maWdEZWZhdWx0cyA9IHtcbiAgICB0eXBlOiAnb25lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rQ29uZmlnU2NoZW1hID0ge1xuICAgIHR5cGU6IE1hdGNoLk1heWJlKE1hdGNoLk9uZU9mKCdvbmUnLCAnbWFueScsICcxJywgJyonKSksXG4gICAgY29sbGVjdGlvbjogTWF0Y2guTWF5YmUoXG4gICAgICAgIE1hdGNoLldoZXJlKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgICAgICAgLy8gV2UgZG8gbGlrZSB0aGlzIHNvIGl0IHdvcmtzIHdpdGggb3RoZXIgdHlwZXMgb2YgY29sbGVjdGlvbnMgXG4gICAgICAgICAgICAvLyBsaWtlIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgIHJldHVybiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24pICYmIChcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHx8IFxuICAgICAgICAgICAgICAgICEhY29sbGVjdGlvbi5fY29sbGVjdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICApLFxuICAgIGZpZWxkOiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIG1ldGFkYXRhOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBpbnZlcnNlZEJ5OiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIGluZGV4OiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICB1bmlxdWU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGF1dG9yZW1vdmU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGRlbm9ybWFsaXplOiBNYXRjaC5NYXliZShNYXRjaC5PYmplY3RJbmNsdWRpbmcoRGVub3JtYWxpemVTY2hlbWEpKSxcbn07IiwiZXhwb3J0IGNvbnN0IExJTktfU1RPUkFHRSA9ICdfX2xpbmtzJztcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7IExJTktfU1RPUkFHRSB9IGZyb20gJy4vY29uc3RhbnRzLmpzJztcbmltcG9ydCBMaW5rZXIgZnJvbSAnLi9saW5rZXIuanMnO1xuXG5PYmplY3QuYXNzaWduKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogVGhlIGRhdGEgd2UgYWRkIHNob3VsZCBiZSB2YWxpZCBmb3IgY29uZmlnLnNjaGVtYS5qc1xuICAgICAqL1xuICAgIGFkZExpbmtzKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW0xJTktfU1RPUkFHRV0pIHtcbiAgICAgICAgICAgIHRoaXNbTElOS19TVE9SQUdFXSA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgXy5lYWNoKGRhdGEsIChsaW5rQ29uZmlnLCBsaW5rTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbTElOS19TVE9SQUdFXVtsaW5rTmFtZV0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgWW91IGNhbm5vdCBhZGQgdGhlIGxpbmsgd2l0aCBuYW1lOiAke2xpbmtOYW1lfSBiZWNhdXNlIGl0IHdhcyBhbHJlYWR5IGFkZGVkIHRvICR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH0gY29sbGVjdGlvbmBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBuZXcgTGlua2VyKHRoaXMsIGxpbmtOYW1lLCBsaW5rQ29uZmlnKTtcblxuICAgICAgICAgICAgXy5leHRlbmQodGhpc1tMSU5LX1NUT1JBR0VdLCB7XG4gICAgICAgICAgICAgICAgW2xpbmtOYW1lXTogbGlua2VyLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICBnZXRMaW5rcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXTtcbiAgICB9LFxuXG4gICAgZ2V0TGlua2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYXNMaW5rKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzW0xJTktfU1RPUkFHRV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICB9LFxuXG4gICAgZ2V0TGluayhvYmplY3RPcklkLCBuYW1lKSB7XG4gICAgICAgIGxldCBsaW5rRGF0YSA9IHRoaXNbTElOS19TVE9SQUdFXTtcblxuICAgICAgICBpZiAoIWxpbmtEYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBhcmUgbm8gbGlua3MgZGVmaW5lZCBmb3IgY29sbGVjdGlvbjogJHt0aGlzLl9uYW1lfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWxpbmtEYXRhW25hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBsaW5rICR7bmFtZX0gZm9yIGNvbGxlY3Rpb246ICR7dGhpcy5fbmFtZX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbGlua2VyID0gbGlua0RhdGFbbmFtZV07XG4gICAgICAgIGxldCBvYmplY3QgPSBvYmplY3RPcklkO1xuICAgICAgICBpZiAodHlwZW9mIG9iamVjdE9ySWQgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gdGhpcy5maW5kT25lKG9iamVjdE9ySWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdOiAxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB7IF9pZDogb2JqZWN0T3JJZCB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9iamVjdCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBXZSBjb3VsZCBub3QgZmluZCBhbnkgb2JqZWN0IHdpdGggX2lkOiBcIiR7b2JqZWN0T3JJZH1cIiB3aXRoaW4gdGhlIGNvbGxlY3Rpb246ICR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaW5rRGF0YVtuYW1lXS5jcmVhdGVMaW5rKG9iamVjdCk7XG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IExpbmtNYW55IGZyb20gJy4vbGlua1R5cGVzL2xpbmtNYW55LmpzJztcbmltcG9ydCBMaW5rTWFueU1ldGEgZnJvbSAnLi9saW5rVHlwZXMvbGlua01hbnlNZXRhLmpzJztcbmltcG9ydCBMaW5rT25lIGZyb20gJy4vbGlua1R5cGVzL2xpbmtPbmUuanMnO1xuaW1wb3J0IExpbmtPbmVNZXRhIGZyb20gJy4vbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzJztcbmltcG9ydCB7IExpbmtDb25maWdTY2hlbWEsIExpbmtDb25maWdEZWZhdWx0cyB9IGZyb20gJy4vY29uZmlnLnNjaGVtYS5qcyc7XG5pbXBvcnQgc21hcnRBcmd1bWVudHMgZnJvbSAnLi9saW5rVHlwZXMvbGliL3NtYXJ0QXJndW1lbnRzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgYWNjZXNzIH0gZnJvbSAnZnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtYWluQ29sbGVjdGlvblxuICAgICAqIEBwYXJhbSBsaW5rTmFtZVxuICAgICAqIEBwYXJhbSBsaW5rQ29uZmlnXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobWFpbkNvbGxlY3Rpb24sIGxpbmtOYW1lLCBsaW5rQ29uZmlnKSB7XG4gICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24gPSBtYWluQ29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5saW5rQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgTGlua0NvbmZpZ0RlZmF1bHRzLCBsaW5rQ29uZmlnKTtcbiAgICAgICAgdGhpcy5saW5rTmFtZSA9IGxpbmtOYW1lO1xuXG4gICAgICAgIC8vIGNoZWNrIGxpbmtOYW1lIG11c3Qgbm90IGV4aXN0IGluIHNjaGVtYVxuICAgICAgICB0aGlzLl92YWxpZGF0ZUFuZENsZWFuKCk7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBjYXNjYWRlIHJlbW92YWwgaG9va3MuXG4gICAgICAgIHRoaXMuX2luaXRBdXRvcmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuX2luaXREZW5vcm1hbGl6YXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgLy8gaWYgaXQncyBhIHZpcnR1YWwgZmllbGQgbWFrZSBzdXJlIHRoYXQgd2hlbiB0aGlzIGlzIGRlbGV0ZWQsIGl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSByZWZlcmVuY2VzXG4gICAgICAgICAgICBpZiAoIWxpbmtDb25maWcuYXV0b3JlbW92ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2hhbmRsZVJlZmVyZW5jZVJlbW92YWxGb3JWaXJ0dWFsTGlua3MoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRJbmRleCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsdWVzIHdoaWNoIHJlcHJlc2VudCBmb3IgdGhlIHJlbGF0aW9uIGEgc2luZ2xlIGxpbmtcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAgICovXG4gICAgZ2V0IG9uZVR5cGVzKCkge1xuICAgICAgICByZXR1cm4gWydvbmUnLCAnMSddO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIHN0cmF0ZWdpZXM6IG9uZSwgbWFueSwgb25lLW1ldGEsIG1hbnktbWV0YVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2V0IHN0cmF0ZWd5KCkge1xuICAgICAgICBsZXQgc3RyYXRlZ3kgPSB0aGlzLmlzTWFueSgpID8gJ21hbnknIDogJ29uZSc7XG4gICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcubWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHN0cmF0ZWd5ICs9ICctbWV0YSc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RyYXRlZ3k7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgZmllbGQgbmFtZSBpbiB0aGUgZG9jdW1lbnQgd2hlcmUgdGhlIGFjdHVhbCByZWxhdGlvbnNoaXBzIGFyZSBzdG9yZWQuXG4gICAgICogQHJldHVybnMgc3RyaW5nXG4gICAgICovXG4gICAgZ2V0IGxpbmtTdG9yYWdlRmllbGQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcuZmllbGQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbGxlY3Rpb24gdGhhdCBpcyBsaW5rZWQgd2l0aCB0aGUgY3VycmVudCBjb2xsZWN0aW9uXG4gICAgICogQHJldHVybnMgTW9uZ28uQ29sbGVjdGlvblxuICAgICAqL1xuICAgIGdldExpbmtlZENvbGxlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgcmVsYXRpb25zaGlwIGZvciB0aGlzIGxpbmsgaXMgb2YgXCJtYW55XCIgdHlwZS5cbiAgICAgKi9cbiAgICBpc01hbnkoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5pc1NpbmdsZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSByZWxhdGlvbnNoaXAgZm9yIHRoaXMgbGluayBjb250YWlucyBtZXRhZGF0YVxuICAgICAqL1xuICAgIGlzTWV0YSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5pc01ldGEoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXRoaXMubGlua0NvbmZpZy5tZXRhZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc1NpbmdsZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5pc1NpbmdsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnModGhpcy5vbmVUeXBlcywgdGhpcy5saW5rQ29uZmlnLnR5cGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzVmlydHVhbCgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5saW5rQ29uZmlnLmludmVyc2VkQnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIHJldHVybiBhIHNpbmdsZSByZXN1bHQuXG4gICAgICovXG4gICAgaXNPbmVSZXN1bHQoKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAodGhpcy5pc1ZpcnR1YWwoKSAmJlxuICAgICAgICAgICAgICAgIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmxpbmtDb25maWcudW5pcXVlKSB8fFxuICAgICAgICAgICAgKCF0aGlzLmlzVmlydHVhbCgpICYmIHRoaXMuaXNTaW5nbGUoKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVG8gaW1wZXJzb25hdGUgdGhlIGdldExpbmtlZENvbGxlY3Rpb24oKSBvZiB0aGUgXCJMaW5rZXJcIlxuICAgICAqXG4gICAgICogQHJldHVybnMge0xpbmtPbmV8TGlua01hbnl8TGlua01hbnlNZXRhfExpbmtPbmVNZXRhfExpbmtSZXNvbHZlfVxuICAgICAqL1xuICAgIGNyZWF0ZUxpbmsob2JqZWN0LCBjb2xsZWN0aW9uID0gbnVsbCkge1xuICAgICAgICBsZXQgaGVscGVyQ2xhc3MgPSB0aGlzLl9nZXRIZWxwZXJDbGFzcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgaGVscGVyQ2xhc3ModGhpcywgb2JqZWN0LCBjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZUFuZENsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbmZpZycsXG4gICAgICAgICAgICAgICAgYEZvciB0aGUgbGluayAke1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICAgICAgfSB5b3UgZGlkIG5vdCBwcm92aWRlIGEgY29sbGVjdGlvbi5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb247XG4gICAgICAgICAgICB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KGNvbGxlY3Rpb25OYW1lKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbGxlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBgQ291bGQgbm90IGZpbmQgYSBjb2xsZWN0aW9uIHdpdGggdGhlIG5hbWU6ICR7Y29sbGVjdGlvbk5hbWV9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXBhcmVWaXJ0dWFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy50eXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQ29uZmlnLnR5cGUgPSAnb25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuZmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtDb25maWcuZmllbGQgPSB0aGlzLl9nZW5lcmF0ZUZpZWxkTmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmZpZWxkID09IHRoaXMubGlua05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdpbnZhbGlkLWNvbmZpZycsXG4gICAgICAgICAgICAgICAgICAgICAgICBgRm9yIHRoZSBsaW5rICR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rTmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSB5b3UgbXVzdCBub3QgdXNlIHRoZSBzYW1lIG5hbWUgZm9yIHRoZSBmaWVsZCwgb3RoZXJ3aXNlIGl0IHdpbGwgY2F1c2UgY29uZmxpY3RzIHdoZW4gZmV0Y2hpbmcgZGF0YWBcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVjayh0aGlzLmxpbmtDb25maWcsIExpbmtDb25maWdTY2hlbWEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlIG5lZWQgdG8gYXBwbHkgc2FtZSB0eXBlIG9mIHJ1bGVzIGluIHRoaXMgY2FzZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wcmVwYXJlVmlydHVhbCgpIHtcbiAgICAgICAgY29uc3QgeyBjb2xsZWN0aW9uLCBpbnZlcnNlZEJ5IH0gPSB0aGlzLmxpbmtDb25maWc7XG4gICAgICAgIGxldCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihpbnZlcnNlZEJ5KTtcblxuICAgICAgICBpZiAoIWxpbmtlcikge1xuICAgICAgICAgICAgLy8gaXQgaXMgcG9zc2libGUgdGhhdCB0aGUgY29sbGVjdGlvbiBkb2Vzbid0IGhhdmUgYSBsaW5rZXIgY3JlYXRlZCB5ZXQuXG4gICAgICAgICAgICAvLyBzbyB3ZSB3aWxsIGNyZWF0ZSBpdCBvbiBzdGFydHVwIGFmdGVyIGFsbCBsaW5rcyBoYXZlIGJlZW4gZGVmaW5lZFxuICAgICAgICAgICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGludmVyc2VkQnkpO1xuICAgICAgICAgICAgICAgIGlmICghbGlua2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBgWW91IHRyaWVkIHNldHRpbmcgdXAgYW4gaW52ZXJzZWQgbGluayBpbiBcIiR7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5fbmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgfVwiIHBvaW50aW5nIHRvIGNvbGxlY3Rpb246IFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9XCIgbGluazogXCIke2ludmVyc2VkQnl9XCIsIGJ1dCBubyBzdWNoIGxpbmsgd2FzIGZvdW5kLiBNYXliZSBhIHR5cG8gP2BcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR1cFZpcnR1YWxDb25maWcobGlua2VyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGxpbmtlclxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpIHtcbiAgICAgICAgY29uc3QgdmlydHVhbExpbmtDb25maWcgPSBsaW5rZXIubGlua0NvbmZpZztcblxuICAgICAgICBpZiAoIXZpcnR1YWxMaW5rQ29uZmlnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgIGBUaGVyZSBpcyBubyBsaW5rLWNvbmZpZyBmb3IgdGhlIHJlbGF0ZWQgY29sbGVjdGlvbiBvbiAke2ludmVyc2VkQnl9LiBNYWtlIHN1cmUgeW91IGFkZGVkIHRoZSBkaXJlY3QgbGlua3MgYmVmb3JlIHNwZWNpZnlpbmcgdmlydHVhbCBvbmVzLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBfLmV4dGVuZCh0aGlzLmxpbmtDb25maWcsIHtcbiAgICAgICAgICAgIG1ldGFkYXRhOiB2aXJ0dWFsTGlua0NvbmZpZy5tZXRhZGF0YSxcbiAgICAgICAgICAgIHJlbGF0ZWRMaW5rZXI6IGxpbmtlcixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVwZW5kaW5nIG9uIHRoZSBzdHJhdGVneSwgd2UgY3JlYXRlIHRoZSBwcm9wZXIgaGVscGVyIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0SGVscGVyQ2xhc3MoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlua01hbnlNZXRhO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtNYW55O1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBMaW5rT25lTWV0YTtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtPbmU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgJ2ludmFsaWQtc3RyYXRlZ3knLFxuICAgICAgICAgICAgYCR7dGhpcy5zdHJhdGVneX0gaXMgbm90IGEgdmFsaWQgc3RyYXRlZ3lgXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgZmllbGQgbmFtZSBub3QgcHJlc2VudCwgd2UgZ2VuZXJhdGUgaXQuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2VuZXJhdGVGaWVsZE5hbWUoKSB7XG4gICAgICAgIGxldCBjbGVhbmVkQ29sbGVjdGlvbk5hbWUgPSB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbi5fbmFtZS5yZXBsYWNlKFxuICAgICAgICAgICAgL1xcLi9nLFxuICAgICAgICAgICAgJ18nXG4gICAgICAgICk7XG4gICAgICAgIGxldCBkZWZhdWx0RmllbGRQcmVmaXggPSB0aGlzLmxpbmtOYW1lICsgJ18nICsgY2xlYW5lZENvbGxlY3Rpb25OYW1lO1xuXG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9tZXRhc2A7XG4gICAgICAgICAgICBjYXNlICdtYW55JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9pZHNgO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkZWZhdWx0RmllbGRQcmVmaXh9X21ldGFgO1xuICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9pZGA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIGEgbGluayB0aGF0IGlzIGRlY2xhcmVkIHZpcnR1YWwgaXMgcmVtb3ZlZCwgdGhlIHJlZmVyZW5jZSB3aWxsIGJlIHJlbW92ZWQgZnJvbSBldmVyeSBvdGhlciBsaW5rLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2hhbmRsZVJlZmVyZW5jZVJlbW92YWxGb3JWaXJ0dWFsTGlua3MoKSB7XG4gICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uYWZ0ZXIucmVtb3ZlKCh1c2VySWQsIGRvYykgPT4ge1xuICAgICAgICAgICAgLy8gdGhpcyBwcm9ibGVtIG1heSBvY2N1ciB3aGVuIHlvdSBkbyBhIC5yZW1vdmUoKSBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAoKVxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICAgICAgYFRoZXJlIHdhcyBhbiBlcnJvciBmaW5kaW5nIHRoZSBsaW5rIGZvciByZW1vdmFsIGZvciBjb2xsZWN0aW9uOiBcIiR7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgIH1cIiB3aXRoIGxpbms6IFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlua05hbWVcbiAgICAgICAgICAgICAgICAgICAgfVwiLiBUaGlzIG1heSBvY2N1ciB3aGVuIHlvdSBkbyBhIC5yZW1vdmUoKSBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAoKWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgYWNjZXNzb3IgPSB0aGlzLmNyZWF0ZUxpbmsoZG9jKTtcblxuICAgICAgICAgICAgXy5lYWNoKGFjY2Vzc29yLmZldGNoQXNBcnJheSgpLCBsaW5rZWRPYmogPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVsYXRlZExpbmtlciB9ID0gdGhpcy5saW5rQ29uZmlnO1xuICAgICAgICAgICAgICAgIC8vIFdlIGRvIHRoaXMgY2hlY2ssIHRvIGF2b2lkIHNlbGYtcmVmZXJlbmNpbmcgaGVsbCB3aGVuIGRlZmluaW5nIHZpcnR1YWwgbGlua3NcbiAgICAgICAgICAgICAgICAvLyBWaXJ0dWFsIGxpbmtzIGlmIG5vdCBmb3VuZCBcImNvbXBpbGUtdGltZVwiLCB3ZSB3aWxsIHRyeSBhZ2FpbiB0byByZXByb2Nlc3MgdGhlbSBvbiBNZXRlb3Iuc3RhcnR1cFxuICAgICAgICAgICAgICAgIC8vIGlmIGEgcmVtb3ZhbCBoYXBwZW5zIGJlZm9yZSBNZXRlb3Iuc3RhcnR1cCB0aGlzIG1heSBmYWlsXG4gICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRMaW5rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxpbmsgPSByZWxhdGVkTGlua2VyLmNyZWF0ZUxpbmsobGlua2VkT2JqKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVsYXRlZExpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnVuc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5rLnJlbW92ZShkb2MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIF9pbml0SW5kZXgoKSB7XG4gICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua0NvbmZpZy5maWVsZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcubWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCA9IGZpZWxkICsgJy5faWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdZb3UgY2Fubm90IHNldCBpbmRleCBvbiBhbiBpbnZlcnNlZCBsaW5rLidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0geyB1bmlxdWU6IHRydWUgfTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7IFtmaWVsZF06IDEgfSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdZb3UgY2Fubm90IHNldCB1bmlxdWUgcHJvcGVydHkgb24gYW4gaW52ZXJzZWQgbGluay4nXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXTogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHVuaXF1ZTogdHJ1ZSwgc3BhcnNlOiB0cnVlIH1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBfaW5pdEF1dG9yZW1vdmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmF1dG9yZW1vdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoKHVzZXJJZCwgZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRMaW5rZWRDb2xsZWN0aW9uKCkucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkaW46IHNtYXJ0QXJndW1lbnRzLmdldElkcyhkb2NbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uYWZ0ZXIucmVtb3ZlKCh1c2VySWQsIGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IHRoaXMubWFpbkNvbGxlY3Rpb24uZ2V0TGluayhkb2MsIHRoaXMubGlua05hbWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkcyA9IGxpbmtlclxuICAgICAgICAgICAgICAgICAgICAuZmluZCh7fSwgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfSlcbiAgICAgICAgICAgICAgICAgICAgLmZldGNoKClcbiAgICAgICAgICAgICAgICAgICAgLm1hcChpdGVtID0+IGl0ZW0uX2lkKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TGlua2VkQ29sbGVjdGlvbigpLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogeyAkaW46IGlkcyB9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBkZW5vcm1hbGl6YXRpb24gdXNpbmcgaGVydGVieTpkZW5vcm1hbGl6ZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXREZW5vcm1hbGl6YXRpb24oKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmRlbm9ybWFsaXplIHx8ICFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhY2thZ2VFeGlzdHMgPSAhIVBhY2thZ2VbJ2hlcnRlYnk6ZGVub3JtYWxpemUnXTtcbiAgICAgICAgaWYgKCFwYWNrYWdlRXhpc3RzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdtaXNzaW5nLXBhY2thZ2UnLFxuICAgICAgICAgICAgICAgIGBQbGVhc2UgYWRkIHRoZSBoZXJ0ZWJ5OmRlbm9ybWFsaXplIHBhY2thZ2UgdG8geW91ciBNZXRlb3IgYXBwbGljYXRpb24gaW4gb3JkZXIgdG8gbWFrZSBjYWNoaW5nIHdvcmtgXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBmaWVsZCwgYm9keSwgYnlwYXNzU2NoZW1hIH0gPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgICAgIGxldCBjYWNoZUNvbmZpZztcblxuICAgICAgICBsZXQgcmVmZXJlbmNlRmllbGRTdWZmaXggPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaXNNZXRhKCkpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZUZpZWxkU3VmZml4ID0gdGhpcy5pc1NpbmdsZSgpID8gJy5faWQnIDogJzpfaWQnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIGxldCBpbnZlcnNlZExpbmsgPSB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5saW5rQ29uZmlnO1xuXG4gICAgICAgICAgICBsZXQgdHlwZSA9XG4gICAgICAgICAgICAgICAgaW52ZXJzZWRMaW5rLnR5cGUgPT0gJ21hbnknID8gJ21hbnktaW52ZXJzZScgOiAnaW52ZXJzZWQnO1xuXG4gICAgICAgICAgICBjYWNoZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkczogYm9keSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VGaWVsZDogaW52ZXJzZWRMaW5rLmZpZWxkICsgcmVmZXJlbmNlRmllbGRTdWZmaXgsXG4gICAgICAgICAgICAgICAgY2FjaGVGaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYnlwYXNzU2NoZW1hOiAhIWJ5cGFzc1NjaGVtYSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjYWNoZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmxpbmtDb25maWcudHlwZSxcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbixcbiAgICAgICAgICAgICAgICBmaWVsZHM6IGJvZHksXG4gICAgICAgICAgICAgICAgcmVmZXJlbmNlRmllbGQ6IHRoaXMubGlua0NvbmZpZy5maWVsZCArIHJlZmVyZW5jZUZpZWxkU3VmZml4LFxuICAgICAgICAgICAgICAgIGNhY2hlRmllbGQ6IGZpZWxkLFxuICAgICAgICAgICAgICAgIGJ5cGFzc1NjaGVtYTogISFieXBhc3NTY2hlbWEsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIE1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmNhY2hlKGNhY2hlQ29uZmlnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5jYWNoZShjYWNoZUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWZXJpZmllcyBpZiB0aGlzIGxpbmtlciBpcyBkZW5vcm1hbGl6ZWQuIEl0IGNhbiBiZSBkZW5vcm1hbGl6ZWQgZnJvbSB0aGUgaW52ZXJzZSBzaWRlIGFzIHdlbGwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGlzRGVub3JtYWxpemVkKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmVyaWZpZXMgaWYgdGhlIGJvZHkgb2YgdGhlIGxpbmtlZCBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gZmllbGRzIG91dHNpZGUgdGhlIGNhY2hlIGJvZHlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkge1xuICAgICAgICBjb25zdCBjYWNoZUJvZHkgPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemUuYm9keTtcblxuICAgICAgICBjb25zdCBjYWNoZUJvZHlGaWVsZHMgPSBfLmtleXMoZG90LmRvdChjYWNoZUJvZHkpKTtcbiAgICAgICAgY29uc3QgYm9keUZpZWxkcyA9IF8ua2V5cyhkb3QuZG90KF8ub21pdChib2R5LCAnX2lkJykpKTtcblxuICAgICAgICByZXR1cm4gXy5kaWZmZXJlbmNlKGJvZHlGaWVsZHMsIGNhY2hlQm9keUZpZWxkcykubGVuZ3RoID09PSAwO1xuICAgIH1cbn1cbiIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY3JlYXRlU2VhcmNoRmlsdGVycyhvYmplY3QsIGZpZWxkU3RvcmFnZSwgc3RyYXRlZ3ksIGlzVmlydHVhbCwgbWV0YUZpbHRlcnMpIHtcbiAgICBpZiAoIWlzVmlydHVhbCkge1xuICAgICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdvbmUnOiByZXR1cm4gY3JlYXRlT25lKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzogcmV0dXJuIGNyZWF0ZU9uZU1ldGEob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnknOiByZXR1cm4gY3JlYXRlTWFueShvYmplY3QsIGZpZWxkU3RvcmFnZSk7XG4gICAgICAgICAgICBjYXNlICdtYW55LW1ldGEnOiByZXR1cm4gY3JlYXRlTWFueU1ldGEob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5raW5nIHN0cmF0ZWd5OiAke3N0cmF0ZWd5fWApXG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdvbmUnOiByZXR1cm4gY3JlYXRlT25lVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSk7XG4gICAgICAgICAgICBjYXNlICdvbmUtbWV0YSc6IHJldHVybiBjcmVhdGVPbmVNZXRhVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6IHJldHVybiBjcmVhdGVNYW55VmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSk7XG4gICAgICAgICAgICBjYXNlICdtYW55LW1ldGEnOiByZXR1cm4gY3JlYXRlTWFueU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYEludmFsaWQgbGlua2luZyBzdHJhdGVneTogJHtzdHJhdGVneX1gKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT25lKG9iamVjdCwgZmllbGRTdG9yYWdlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiBkb3QucGljayhmaWVsZFN0b3JhZ2UsIG9iamVjdClcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT25lVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFtmaWVsZFN0b3JhZ2VdOiBvYmplY3QuX2lkXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9uZU1ldGEob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKSB7XG4gICAgY29uc3QgdmFsdWUgPSBvYmplY3RbZmllbGRTdG9yYWdlXTtcblxuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICBpZiAoIXNpZnQobWV0YUZpbHRlcnMpKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtfaWQ6IHVuZGVmaW5lZH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IHZhbHVlID8gdmFsdWUuX2lkIDogdmFsdWVcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT25lTWV0YVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKSB7XG4gICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICBpZiAobWV0YUZpbHRlcnMpIHtcbiAgICAgICAgXy5lYWNoKG1ldGFGaWx0ZXJzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyc1tmaWVsZFN0b3JhZ2UgKyAnLicgKyBrZXldID0gdmFsdWU7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZmlsdGVyc1tmaWVsZFN0b3JhZ2UgKyAnLl9pZCddID0gb2JqZWN0Ll9pZDtcblxuICAgIHJldHVybiBmaWx0ZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFueShvYmplY3QsIGZpZWxkU3RvcmFnZSkge1xuICAgIGNvbnN0IFtyb290LCAuLi5uZXN0ZWRdID0gZmllbGRTdG9yYWdlLnNwbGl0KCcuJyk7XG4gICAgaWYgKG5lc3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IGFyciA9IG9iamVjdFtyb290XTtcbiAgICAgICAgY29uc3QgaWRzID0gYXJyID8gXy51bmlxKF8udW5pb24oYXJyLm1hcChvYmogPT4gXy5pc09iamVjdChvYmopID8gZG90LnBpY2sobmVzdGVkLmpvaW4oJy4nKSwgb2JqKSA6IFtdKSkpIDogW107XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBfaWQ6IHskaW46IGlkc31cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IG9iamVjdFtmaWVsZFN0b3JhZ2VdIHx8IFtdXG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFueVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogb2JqZWN0Ll9pZFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55TWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBsZXQgdmFsdWUgPSBvYmplY3RbZmllbGRTdG9yYWdlXTtcblxuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICB2YWx1ZSA9IHNpZnQobWV0YUZpbHRlcnMsIHZhbHVlKVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIF9pZDoge1xuICAgICAgICAgICAgJGluOiBfLnBsdWNrKHZhbHVlLCAnX2lkJykgfHwgW11cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55TWV0YVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKSB7XG4gICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICBpZiAobWV0YUZpbHRlcnMpIHtcbiAgICAgICAgXy5lYWNoKG1ldGFGaWx0ZXJzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgZmlsdGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZmlsdGVycy5faWQgPSBvYmplY3QuX2lkO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgW2ZpZWxkU3RvcmFnZV06IHskZWxlbU1hdGNoOiBmaWx0ZXJzfVxuICAgIH07XG59IiwiaW1wb3J0IFNtYXJ0QXJncyBmcm9tICcuL2xpYi9zbWFydEFyZ3VtZW50cy5qcyc7XG5pbXBvcnQgY3JlYXRlU2VhcmNoRmlsdGVycyBmcm9tICcuLi9saWIvY3JlYXRlU2VhcmNoRmlsdGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmsge1xuICAgIGdldCBjb25maWcoKSB7IHJldHVybiB0aGlzLmxpbmtlci5saW5rQ29uZmlnOyB9XG5cbiAgICBnZXQgaXNWaXJ0dWFsKCkgeyByZXR1cm4gdGhpcy5saW5rZXIuaXNWaXJ0dWFsKCkgfVxuXG4gICAgY29uc3RydWN0b3IobGlua2VyLCBvYmplY3QsIGNvbGxlY3Rpb24pIHtcbiAgICAgICAgdGhpcy5saW5rZXIgPSBsaW5rZXI7XG4gICAgICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xuICAgICAgICB0aGlzLmxpbmtlZENvbGxlY3Rpb24gPSAoY29sbGVjdGlvbikgPyBjb2xsZWN0aW9uIDogbGlua2VyLmdldExpbmtlZENvbGxlY3Rpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5saW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCA9IHRoaXMuY29uZmlnLnJlbGF0ZWRMaW5rZXIubGlua0NvbmZpZy5maWVsZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCA9IHRoaXMuY29uZmlnLmZpZWxkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgc3RvcmVkIGxpbmsgaW5mb3JtYXRpb24gdmFsdWVcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICB2YWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdZb3UgY2FuIG9ubHkgdGFrZSB0aGUgdmFsdWUgZnJvbSB0aGUgbWFpbiBsaW5rLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmluZHMgbGlua2VkIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZmlsdGVyc1xuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAqL1xuICAgIGZpbmQoZmlsdGVycyA9IHt9LCBvcHRpb25zID0ge30sIHVzZXJJZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICBsZXQgbGlua2VyID0gdGhpcy5saW5rZXI7XG4gICAgICAgIGNvbnN0IGxpbmtlZENvbGxlY3Rpb24gPSB0aGlzLmxpbmtlZENvbGxlY3Rpb247XG5cbiAgICAgICAgbGV0ICRtZXRhRmlsdGVycztcbiAgICAgICAgaWYgKGZpbHRlcnMuJG1ldGEpIHtcbiAgICAgICAgICAgICRtZXRhRmlsdGVycyA9IGZpbHRlcnMuJG1ldGE7XG4gICAgICAgICAgICBkZWxldGUgZmlsdGVycy4kbWV0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNlYXJjaEZpbHRlcnMgPSBjcmVhdGVTZWFyY2hGaWx0ZXJzKFxuICAgICAgICAgICAgdGhpcy5vYmplY3QsXG4gICAgICAgICAgICB0aGlzLmxpbmtTdG9yYWdlRmllbGQsXG4gICAgICAgICAgICBsaW5rZXIuc3RyYXRlZ3ksXG4gICAgICAgICAgICBsaW5rZXIuaXNWaXJ0dWFsKCksXG4gICAgICAgICAgICAkbWV0YUZpbHRlcnNcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgYXBwbGllZEZpbHRlcnMgPSBfLmV4dGVuZCh7fSwgZmlsdGVycywgc2VhcmNoRmlsdGVycyk7XG5cbiAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWx0LW9mLWNvZGVycy9ncmFwaGVyL2lzc3Vlcy8xMzRcbiAgICAgICAgLy8gaGFwcGVucyBkdWUgdG8gcmVjdXJzaXZlIGltcG9ydGluZyBvZiBtb2R1bGVzXG4gICAgICAgIC8vIFRPRE86IGZpbmQgYW5vdGhlciB3YXkgdG8gZG8gdGhpc1xuICAgICAgICBpZiAobGlua2VkQ29sbGVjdGlvbi5maW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlua2VkQ29sbGVjdGlvbi5maW5kKGFwcGxpZWRGaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbGlua2VkQ29sbGVjdGlvbi5kZWZhdWx0LmZpbmQoYXBwbGllZEZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmlsdGVyc1xuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHBhcmFtIG90aGVyc1xuICAgICAqIEByZXR1cm5zIHsqfHtjb250ZW50fXxhbnl9XG4gICAgICovXG4gICAgZmV0Y2goZmlsdGVycywgb3B0aW9ucywgLi4ub3RoZXJzKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSB0aGlzLmZpbmQoZmlsdGVycywgb3B0aW9ucywgLi4ub3RoZXJzKS5mZXRjaCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmxpbmtlci5pc09uZVJlc3VsdCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maXJzdChyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGp1c3QgbGlrZSBmZXRjaCgpIGJ1dCBmb3JjZXMgdG8gZ2V0IGFuIGFycmF5IGV2ZW4gaWYgaXQncyBzaW5nbGUgcmVzdWx0XG4gICAgICogXG4gICAgICogQHBhcmFtIHsqfSBmaWx0ZXJzIFxuICAgICAqIEBwYXJhbSB7Kn0gb3B0aW9ucyBcbiAgICAgKiBAcGFyYW0gIHsuLi5hbnl9IG90aGVycyBcbiAgICAgKi9cbiAgICBmZXRjaEFzQXJyYXkoZmlsdGVycywgb3B0aW9ucywgLi4ub3RoZXJzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmQoZmlsdGVycywgb3B0aW9ucywgLi4ub3RoZXJzKS5mZXRjaCgpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiB3ZSBhcmUgZGVhbGluZyB3aXRoIG11bHRpcGxlIHR5cGUgcmVsYXRpb25zaGlwcywgJGluIHdvdWxkIHJlcXVpcmUgYW4gYXJyYXkuIElmIHRoZSBmaWVsZCB2YWx1ZSBpcyBudWxsLCBpdCB3aWxsIGZhaWxcbiAgICAgKiBXZSB1c2UgY2xlYW4gdG8gbWFrZSBpdCBhbiBlbXB0eSBhcnJheSBieSBkZWZhdWx0LlxuICAgICAqL1xuICAgIGNsZWFuKCkge31cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3RzIGEgc2luZ2xlIGlkXG4gICAgICovXG4gICAgaWRlbnRpZnlJZCh3aGF0LCBzYXZlVG9EYXRhYmFzZSkge1xuICAgICAgICByZXR1cm4gU21hcnRBcmdzLmdldElkKHdoYXQsIHtcbiAgICAgICAgICAgIHNhdmVUb0RhdGFiYXNlLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogdGhpcy5saW5rZWRDb2xsZWN0aW9uXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3RzIHRoZSBpZHMgb2Ygb2JqZWN0KHMpIG9yIHN0cmluZ3MgYW5kIHJldHVybnMgYW4gYXJyYXkuXG4gICAgICovXG4gICAgaWRlbnRpZnlJZHMod2hhdCwgc2F2ZVRvRGF0YWJhc2UpIHtcbiAgICAgICAgcmV0dXJuIFNtYXJ0QXJncy5nZXRJZHMod2hhdCwge1xuICAgICAgICAgICAgc2F2ZVRvRGF0YWJhc2UsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxpbmtlZENvbGxlY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZW4gbGlua2luZyBkYXRhLCBpZiB0aGUgaWRzIGFyZSB2YWxpZCB3aXRoIHRoZSBsaW5rZWQgY29sbGVjdGlvbi5cbiAgICAgKiBAdGhyb3dzIE1ldGVvci5FcnJvclxuICAgICAqIEBwYXJhbSBpZHNcbiAgICAgKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKi9cbiAgICBfdmFsaWRhdGVJZHMoaWRzKSB7XG4gICAgICAgIGlmICghXy5pc0FycmF5KGlkcykpIHtcbiAgICAgICAgICAgIGlkcyA9IFtpZHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdmFsaWRJZHMgPSB0aGlzLmxpbmtlZENvbGxlY3Rpb24uZmluZCh7XG4gICAgICAgICAgICBfaWQ6IHskaW46IGlkc31cbiAgICAgICAgfSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpLm1hcChkb2MgPT4gZG9jLl9pZCk7XG5cbiAgICAgICAgaWYgKHZhbGlkSWRzLmxlbmd0aCAhPSBpZHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtZm91bmQnLCBgWW91IHRyaWVkIHRvIGNyZWF0ZSBsaW5rcyB3aXRoIG5vbi1leGlzdGluZyBpZChzKSBpbnNpZGUgXCIke3RoaXMubGlua2VkQ29sbGVjdGlvbi5fbmFtZX1cIjogJHtfLmRpZmZlcmVuY2UoaWRzLCB2YWxpZElkcykuam9pbignLCAnKX1gKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgX2NoZWNrV2hhdCh3aGF0KSB7XG4gICAgICAgIGlmICh3aGF0ID09PSB1bmRlZmluZWQgfHwgd2hhdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgYXJndW1lbnQgcGFzc2VkOiAke3doYXR9IGlzIG5vdCBhY2NlcHRlZC5gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgZm9yIGFsbG93aW5nIGNvbW1hbmRzIHN1Y2ggYXMgc2V0L3Vuc2V0L2FkZC9yZW1vdmUvbWV0YWRhdGEgZnJvbSB0aGUgdmlydHVhbCBsaW5rLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICogQHBhcmFtIG1ldGFkYXRhXG4gICAgICpcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX3ZpcnR1YWxBY3Rpb24oYWN0aW9uLCB3aGF0LCBtZXRhZGF0YSkge1xuICAgICAgICBjb25zdCBsaW5rZXIgPSB0aGlzLmxpbmtlci5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXI7XG5cbiAgICAgICAgLy8gaXRzIGFuIHVuc2V0IG9wZXJhdGlvbiBtb3N0IGxpa2VseS5cbiAgICAgICAgaWYgKHdoYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJzZWRMaW5rID0gbGlua2VyLmNyZWF0ZUxpbmsodGhpcy5mZXRjaCgpKTtcbiAgICAgICAgICAgIHJldmVyc2VkTGluay51bnNldCgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV8uaXNBcnJheSh3aGF0KSkge1xuICAgICAgICAgICAgd2hhdCA9IFt3aGF0XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoYXQgPSBfLm1hcCh3aGF0LCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5rZXIubWFpbkNvbGxlY3Rpb24uZmluZE9uZShlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Ll9pZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBsaW5rZXIubWFpbkNvbGxlY3Rpb24uaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChlbGVtZW50LCBsaW5rZXIubWFpbkNvbGxlY3Rpb24uZmluZE9uZShlbGVtZW50SWQpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKHdoYXQsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJzZWRMaW5rID0gbGlua2VyLmNyZWF0ZUxpbmsoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gJ21ldGFkYXRhJykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTaW5nbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV2ZXJzZWRMaW5rLm1ldGFkYXRhKG1ldGFkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV2ZXJzZWRMaW5rLm1ldGFkYXRhKHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gJ2FkZCcgfHwgYWN0aW9uID09ICdzZXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay5zZXQodGhpcy5vYmplY3QsIG1ldGFkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlZExpbmsuYWRkKHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzU2luZ2xlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLnVuc2V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLnJlbW92ZSh0aGlzLm9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTGluayBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcbmltcG9ydCBTbWFydEFyZ3MgZnJvbSAnLi9saWIvc21hcnRBcmd1bWVudHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rTWFueSBleHRlbmRzIExpbmsge1xuICAgIGNsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0gPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkcyB0aGUgX2lkcyB0byB0aGUgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICovXG4gICAgYWRkKHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgKHRoaXMuaXNWaXJ0dWFsKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdBZGQvcmVtb3ZlIG9wZXJhdGlvbnMgbXVzdCBiZSBkb25lIGZyb20gdGhlIG93bmluZy1saW5rIG9mIHRoZSByZWxhdGlvbnNoaXAnKTtcblxuICAgICAgICB0aGlzLmNsZWFuKCk7XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSWRzKF9pZHMpO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZmllbGRcbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gXy51bmlvbih0aGlzLm9iamVjdFtmaWVsZF0sIF9pZHMpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZGJcbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJGFkZFRvU2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogeyRlYWNoOiBfaWRzfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqL1xuICAgIHJlbW92ZSh3aGF0KSB7XG4gICAgICAgIHRoaXMuX2NoZWNrV2hhdCh3aGF0KTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ0FkZC9SZW1vdmUgb3BlcmF0aW9ucyBzaG91bGQgYmUgZG9uZSBmcm9tIHRoZSBvd25lciBvZiB0aGUgcmVsYXRpb25zaGlwJyk7XG5cbiAgICAgICAgdGhpcy5jbGVhbigpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgY29uc3QgW3Jvb3QsIC4uLm5lc3RlZF0gPSBmaWVsZC5zcGxpdCgnLicpO1xuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZmllbGRcbiAgICAgICAgdGhpcy5vYmplY3Rbcm9vdF0gPSBfLmZpbHRlcihcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3Jvb3RdLFxuICAgIF9pZCA9PiAhXy5jb250YWlucyhfaWRzLCBuZXN0ZWQubGVuZ3RoID4gMCA/IGRvdC5waWNrKG5lc3RlZC5qb2luKCcuJyksIF9pZCkgOiBfaWQpXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBkYlxuICAgICAgICBsZXQgbW9kaWZpZXIgPSB7XG4gICAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgICAgIFtyb290XTogbmVzdGVkLmxlbmd0aCA+IDAgPyB7W25lc3RlZC5qb2luKCcuJyldOiB7JGluOiBfaWRzfX0gOiB7JGluOiBfaWRzfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh3aGF0KSB7XG4gICAgICAgIHRoaXMuX2NoZWNrV2hhdCh3aGF0KTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnNldCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2UgYWRkL3JlbW92ZSBmb3IgKm1hbnkqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICB1bnNldCh3aGF0KSB7XG4gICAgICAgIHRoaXMuX2NoZWNrV2hhdCh3aGF0KTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3Vuc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqdW5zZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua01hbnlNZXRhIGV4dGVuZHMgTGluayB7XG4gICAgY2xlYW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdoYXRcbiAgICAgKiBAcGFyYW0gbWV0YWRhdGFcbiAgICAgKi9cbiAgICBhZGQod2hhdCwgbWV0YWRhdGEgPSB7fSkge1xuICAgICAgICB0aGlzLl9jaGVja1doYXQod2hhdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdhZGQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhfaWRzKTtcblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gdGhpcy5vYmplY3RbZmllbGRdIHx8IFtdO1xuICAgICAgICBsZXQgbWV0YWRhdGFzID0gW107XG5cbiAgICAgICAgXy5lYWNoKF9pZHMsIF9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgbG9jYWxNZXRhZGF0YSA9IF8uY2xvbmUobWV0YWRhdGEpO1xuICAgICAgICAgICAgbG9jYWxNZXRhZGF0YS5faWQgPSBfaWQ7XG5cbiAgICAgICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXS5wdXNoKGxvY2FsTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGFzLnB1c2gobG9jYWxNZXRhZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRhZGRUb1NldDoge1xuICAgICAgICAgICAgICAgIFtmaWVsZF06IHskZWFjaDogbWV0YWRhdGFzfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqIEBwYXJhbSBleHRlbmRNZXRhZGF0YVxuICAgICAqL1xuICAgIG1ldGFkYXRhKHdoYXQsIGV4dGVuZE1ldGFkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignbWV0YWRhdGEnLCB3aGF0LCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIGlmICh3aGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFtmaWVsZF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0FycmF5KHdoYXQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdNZXRhZGF0YSB1cGRhdGVzIHNob3VsZCBiZSBtYWRlIGZvciBvbmUgZW50aXR5IG9ubHksIG5vdCBtdWx0aXBsZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2lkID0gdGhpcy5pZGVudGlmeUlkKHdoYXQpO1xuXG4gICAgICAgIGxldCBleGlzdGluZ01ldGFkYXRhID0gXy5maW5kKHRoaXMub2JqZWN0W2ZpZWxkXSwgbWV0YWRhdGEgPT4gbWV0YWRhdGEuX2lkID09IF9pZCk7XG4gICAgICAgIGlmIChleHRlbmRNZXRhZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdNZXRhZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGV4aXN0aW5nTWV0YWRhdGEsIGV4dGVuZE1ldGFkYXRhKTtcbiAgICAgICAgICAgIGxldCBzdWJmaWVsZCA9IGZpZWxkICsgJy5faWQnO1xuICAgICAgICAgICAgbGV0IHN1YmZpZWxkVXBkYXRlID0gZmllbGQgKyAnLiQnO1xuXG4gICAgICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAgIF9pZDogdGhpcy5vYmplY3QuX2lkLFxuICAgICAgICAgICAgICAgIFtzdWJmaWVsZF06IF9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgIFtzdWJmaWVsZFVwZGF0ZV06IGV4aXN0aW5nTWV0YWRhdGFcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigncmVtb3ZlJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQpO1xuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gXy5maWx0ZXIodGhpcy5vYmplY3RbZmllbGRdLCBsaW5rID0+ICFfLmNvbnRhaW5zKF9pZHMsIGxpbmsuX2lkKSk7XG5cbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJHB1bGw6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7XG4gICAgICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGluOiBfaWRzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh3aGF0LCBtZXRhZGF0YSkge1xuICAgICAgICB0aGlzLl9jaGVja1doYXQod2hhdCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdzZXQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqc2V0KiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBhZGQvcmVtb3ZlIGZvciAqbWFueSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cblxuICAgIHVuc2V0KHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICp1bnNldCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2UgYWRkL3JlbW92ZSBmb3IgKm1hbnkqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG59IiwiaW1wb3J0IExpbmsgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBTbWFydEFyZ3MgZnJvbSAnLi9saWIvc21hcnRBcmd1bWVudHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rT25lIGV4dGVuZHMgTGluayB7XG4gICAgc2V0KHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgY29uc3QgX2lkID0gdGhpcy5pZGVudGlmeUlkKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhbX2lkXSk7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gX2lkO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBfaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5zZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBudWxsO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZCh3aGF0KSB7XG4gICAgICAgIHRoaXMuX2NoZWNrV2hhdCh3aGF0KTtcblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ2FkZCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKmFkZCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigncmVtb3ZlJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqcmVtb3ZlKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG59IiwiaW1wb3J0IExpbmsgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBTbWFydEFyZ3MgZnJvbSAnLi9saWIvc21hcnRBcmd1bWVudHMuanMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5rT25lTWV0YSBleHRlbmRzIExpbmsge1xuICAgIHNldCh3aGF0LCBtZXRhZGF0YSA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2NoZWNrV2hhdCh3aGF0KTtcblxuICAgICAgICBtZXRhZGF0YSA9IE9iamVjdC5hc3NpZ24oe30sIG1ldGFkYXRhKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignc2V0Jywgd2hhdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIG1ldGFkYXRhLl9pZCA9IHRoaXMuaWRlbnRpZnlJZCh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoW21ldGFkYXRhLl9pZF0pO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IG1ldGFkYXRhO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtZXRhZGF0YShleHRlbmRNZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ21ldGFkYXRhJywgdW5kZWZpbmVkLCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIGlmICghZXh0ZW5kTWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFtmaWVsZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9iamVjdFtmaWVsZF0sIGV4dGVuZE1ldGFkYXRhKTtcblxuICAgICAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXTogdGhpcy5vYmplY3RbZmllbGRdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCd1bnNldCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IHt9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGQod2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKmFkZCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgdGhpcy5fY2hlY2tXaGF0KHdoYXQpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigncmVtb3ZlJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqcmVtb3ZlKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG59IiwiLyoqXG4gKiBXaGVuIHlvdSB3b3JrIHdpdGggYWRkL3JlbW92ZSBzZXQvdW5zZXRcbiAqIFlvdSBoYXZlIHRoZSBhYmlsaXR5IHRvIHBhc3Mgc3RyaW5ncywgYXJyYXkgb2Ygc3RyaW5ncywgb2JqZWN0cywgYXJyYXkgb2Ygb2JqZWN0c1xuICogSWYgeW91IGFyZSBhZGRpbmcgc29tZXRoaW5nIGFuZCB5b3Ugd2FudCB0byBzYXZlIHRoZW0gaW4gZGIsIHlvdSBjYW4gcGFzcyBvYmplY3RzIHdpdGhvdXQgaWRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgY2xhc3Mge1xuICAgIGdldElkcyh3aGF0LCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkod2hhdCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLm1hcCh3aGF0LCAoc3ViV2hhdCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldElkKHN1YldoYXQsIG9wdGlvbnMpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFt0aGlzLmdldElkKHdoYXQsIG9wdGlvbnMpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtdHlwZScsIGBVbnJlY29nbml6ZWQgdHlwZTogJHt0eXBlb2Ygd2hhdH0gZm9yIG1hbmFnaW5nIGxpbmtzYCk7XG4gICAgfVxuXG4gICAgZ2V0SWQod2hhdCwgb3B0aW9ucykge1xuICAgICAgICBpZiAodHlwZW9mIHdoYXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gd2hhdDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygd2hhdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICghd2hhdC5faWQgJiYgb3B0aW9ucy5zYXZlVG9EYXRhYmFzZSkge1xuICAgICAgICAgICAgICAgIHdoYXQuX2lkID0gb3B0aW9ucy5jb2xsZWN0aW9uLmluc2VydCh3aGF0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHdoYXQuX2lkXG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcblxubGV0IGdsb2JhbENvbmZpZyA9IHt9O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOYW1lZFF1ZXJ5QmFzZSB7XG4gICAgc3RhdGljIHNldENvbmZpZyhjb25maWcpIHtcbiAgICAgICAgZ2xvYmFsQ29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxDb25maWc7XG4gICAgfVxuXG4gICAgaXNOYW1lZFF1ZXJ5ID0gdHJ1ZTtcblxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvbGxlY3Rpb24sIGJvZHksIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLnF1ZXJ5TmFtZSA9IG5hbWU7XG5cbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihib2R5KSkge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlciA9IGJvZHk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJvZHkgPSBkZWVwQ2xvbmUoYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMucGFyYW1zID0gb3B0aW9ucy5wYXJhbXMgfHwge307XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGdsb2JhbENvbmZpZywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gICAgICAgIHRoaXMuaXNFeHBvc2VkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgIHJldHVybiBgbmFtZWRfcXVlcnlfJHt0aGlzLnF1ZXJ5TmFtZX1gO1xuICAgIH1cblxuICAgIGdldCBpc1Jlc29sdmVyKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLnJlc29sdmVyO1xuICAgIH1cblxuICAgIHNldFBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBfLmV4dGVuZCh7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZG9WYWxpZGF0ZVBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgcGFyYW1zID0gcGFyYW1zIHx8IHRoaXMucGFyYW1zO1xuXG4gICAgICAgIGNvbnN0IHt2YWxpZGF0ZVBhcmFtc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmICghdmFsaWRhdGVQYXJhbXMpIHJldHVybjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5fdmFsaWRhdGUodmFsaWRhdGVQYXJhbXMsIHBhcmFtcyk7XG4gICAgICAgIH0gY2F0Y2ggKHZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgSW52YWxpZCBwYXJhbWV0ZXJzIHN1cHBsaWVkIHRvIHRoZSBxdWVyeSBcIiR7dGhpcy5xdWVyeU5hbWV9XCJcXG5gLCB2YWxpZGF0aW9uRXJyb3IpO1xuICAgICAgICAgICAgdGhyb3cgdmFsaWRhdGlvbkVycm9yOyAvLyByZXRocm93XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbG9uZShuZXdQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gXy5leHRlbmQoe30sIGRlZXBDbG9uZSh0aGlzLnBhcmFtcyksIG5ld1BhcmFtcyk7XG5cbiAgICAgICAgbGV0IGNsb25lID0gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICAgICAgICB0aGlzLnF1ZXJ5TmFtZSxcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgICAgICAgIHRoaXMuaXNSZXNvbHZlciA/IHRoaXMucmVzb2x2ZXIgOiBkZWVwQ2xvbmUodGhpcy5ib2R5KSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNsb25lLmNhY2hlciA9IHRoaXMuY2FjaGVyO1xuICAgICAgICBpZiAodGhpcy5leHBvc2VDb25maWcpIHtcbiAgICAgICAgICAgIGNsb25lLmV4cG9zZUNvbmZpZyA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsb25lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb258b2JqZWN0fSB2YWxpZGF0b3JcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfdmFsaWRhdGUodmFsaWRhdG9yLCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWxpZGF0b3IpKSB7XG4gICAgICAgICAgICB2YWxpZGF0b3IuY2FsbChudWxsLCBwYXJhbXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGVjayhwYXJhbXMsIHZhbGlkYXRvcilcbiAgICAgICAgfVxuICAgIH1cbn1cblxuTmFtZWRRdWVyeUJhc2UuZGVmYXVsdE9wdGlvbnMgPSB7fTsiLCJpbXBvcnQgQ291bnRTdWJzY3JpcHRpb24gZnJvbSAnLi4vcXVlcnkvY291bnRzL2NvdW50U3Vic2NyaXB0aW9uJztcbmltcG9ydCBjcmVhdGVHcmFwaCBmcm9tICcuLi9xdWVyeS9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZUZldGNoIGZyb20gJy4uL3F1ZXJ5L2xpYi9yZWN1cnNpdmVGZXRjaC5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi4vcXVlcnkvbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGNhbGxXaXRoUHJvbWlzZSBmcm9tICcuLi9xdWVyeS9saWIvY2FsbFdpdGhQcm9taXNlJztcbmltcG9ydCBCYXNlIGZyb20gJy4vbmFtZWRRdWVyeS5iYXNlJztcbmltcG9ydCB7TG9jYWxDb2xsZWN0aW9ufSBmcm9tICdtZXRlb3IvbWluaW1vbmdvJztcbmltcG9ydCBpbnRlcnNlY3REZWVwIGZyb20gJy4uL3F1ZXJ5L2xpYi9pbnRlcnNlY3REZWVwJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtudWxsfGFueXwqfVxuICAgICAqL1xuICAgIHN1YnNjcmliZShjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsIGBZb3UgY2Fubm90IHN1YnNjcmliZSB0byBhIHJlc29sdmVyIHF1ZXJ5YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IE1ldGVvci5zdWJzY3JpYmUoXG4gICAgICAgICAgICB0aGlzLm5hbWUsXG4gICAgICAgICAgICB0aGlzLnBhcmFtcyxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZSB0byB0aGUgY291bnRzIGZvciB0aGlzIHF1ZXJ5XG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICAqL1xuICAgIHN1YnNjcmliZUNvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgYFlvdSBjYW5ub3Qgc3Vic2NyaWJlIHRvIGEgcmVzb2x2ZXIgcXVlcnlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IG5ldyBDb3VudFN1YnNjcmlwdGlvbih0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLl9jb3VudGVyLnN1YnNjcmliZSh0aGlzLnBhcmFtcywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIGlmIGFuIGV4aXN0aW5nIHN1YnNjcmlwdGlvbiBleGlzdHNcbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBpZiBhIHN1YnNjcmlwdGlvbiBleGlzdHMuXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmVDb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBlbGVtZW50cyBpbiBzeW5jIHVzaW5nIHByb21pc2VzXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaFN5bmMoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lLCB0aGlzLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBvbmUgZWxlbWVudCBpbiBzeW5jXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaE9uZVN5bmMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KGF3YWl0IHRoaXMuZmV0Y2hTeW5jKCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja09yT3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNhbGxiYWNrT3JPcHRpb25zKSB7XG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFN0YXRpYyhjYWxsYmFja09yT3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFJlYWN0aXZlKGNhbGxiYWNrT3JPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2hPbmUoLi4uYXJncykge1xuICAgICAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdZb3UgZGlkIG5vdCBwcm92aWRlIGEgdmFsaWQgY2FsbGJhY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mZXRjaCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyA/IF8uZmlyc3QocmVzKSA6IG51bGwpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMgaW4gc3luYy5cbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFzeW5jIGdldENvdW50U3luYygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1RoaXMgcXVlcnkgaXMgcmVhY3RpdmUsIG1lYW5pbmcgeW91IGNhbm5vdCB1c2UgcHJvbWlzZXMgdG8gZmV0Y2ggdGhlIGRhdGEuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhQcm9taXNlKHRoaXMubmFtZSArICcuY291bnQnLCB0aGlzLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBnZXRDb3VudChjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuZ2V0Q291bnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgY291bnQgb3Igc3Vic2NyaWJlIGZpcnN0LicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmNhbGwodGhpcy5uYW1lICsgJy5jb3VudCcsIHRoaXMucGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyBub24tcmVhY3RpdmUgcXVlcmllc1xuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoU3RhdGljKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBkYXRhIG9yIHN1YnNjcmliZSBmaXJzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1ldGVvci5jYWxsKHRoaXMubmFtZSwgdGhpcy5wYXJhbXMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyB3aGVuIHdlJ3ZlIGdvdCBhbiBhY3RpdmUgcHVibGljYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hSZWFjdGl2ZShvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IGJvZHkgPSB0aGlzLmJvZHk7XG4gICAgICAgIGlmICh0aGlzLnBhcmFtcy4kYm9keSkge1xuICAgICAgICAgICAgYm9keSA9IGludGVyc2VjdERlZXAoYm9keSwgdGhpcy5wYXJhbXMuJGJvZHkpO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9keSA9IHByZXBhcmVGb3JQcm9jZXNzKGJvZHksIHRoaXMucGFyYW1zKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93U2tpcCAmJiBib2R5LiRvcHRpb25zICYmIGJvZHkuJG9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgZGVsZXRlIGJvZHkuJG9wdGlvbnMuc2tpcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWN1cnNpdmVGZXRjaChcbiAgICAgICAgICAgIGNyZWF0ZUdyYXBoKHRoaXMuY29sbGVjdGlvbiwgYm9keSksXG4gICAgICAgICAgICB1bmRlZmluZWQsIHtcbiAgICAgICAgICAgICAgICBzY29wZWQ6IHRoaXMub3B0aW9ucy5zY29wZWQsXG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uSGFuZGxlOiB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZVxuICAgICAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE5hbWVkUXVlcnlDbGllbnQgZnJvbSAnLi9uYW1lZFF1ZXJ5LmNsaWVudCc7XG5pbXBvcnQgTmFtZWRRdWVyeVNlcnZlciBmcm9tICcuL25hbWVkUXVlcnkuc2VydmVyJztcblxubGV0IE5hbWVkUXVlcnk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBOYW1lZFF1ZXJ5ID0gTmFtZWRRdWVyeVNlcnZlcjtcbn0gZWxzZSB7XG4gICAgTmFtZWRRdWVyeSA9IE5hbWVkUXVlcnlDbGllbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVkUXVlcnk7IiwiaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4uL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL25hbWVkUXVlcnkuYmFzZSc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IE1lbW9yeVJlc3VsdENhY2hlciBmcm9tICcuL2NhY2hlL01lbW9yeVJlc3VsdENhY2hlcic7XG5pbXBvcnQgaW50ZXJzZWN0RGVlcCBmcm9tICcuLi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fcGVyZm9ybVNlY3VyaXR5Q2hlY2tzKGNvbnRleHQsIHRoaXMucGFyYW1zKTtcblxuICAgICAgICBpZiAodGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmV0Y2hSZXNvbHZlckRhdGEoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0gZGVlcENsb25lKHRoaXMuYm9keSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuJGJvZHkpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gaW50ZXJzZWN0RGVlcChib2R5LCB0aGlzLnBhcmFtcy4kYm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHdlIG11c3QgYXBwbHkgZW1vYmR5bWVudCBoZXJlXG4gICAgICAgICAgICB0aGlzLmRvRW1ib2RpbWVudElmSXRBcHBsaWVzKGJvZHksIHRoaXMucGFyYW1zKTtcblxuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmNvbGxlY3Rpb24uY3JlYXRlUXVlcnkoXG4gICAgICAgICAgICAgICAgZGVlcENsb25lKGJvZHkpLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBkZWVwQ2xvbmUodGhpcy5wYXJhbXMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY2FjaGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVJZCA9IHRoaXMuY2FjaGVyLmdlbmVyYXRlUXVlcnlJZCh0aGlzLnF1ZXJ5TmFtZSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlci5mZXRjaChjYWNoZUlkLCB7cXVlcnl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5LmZldGNoKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoT25lKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGdldENvdW50KGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fcGVyZm9ybVNlY3VyaXR5Q2hlY2tzKGNvbnRleHQsIHRoaXMucGFyYW1zKTtcblxuICAgICAgICBjb25zdCBjb3VudEN1cnNvciA9IHRoaXMuZ2V0Q3Vyc29yRm9yQ291bnRpbmcoKTtcblxuICAgICAgICBpZiAodGhpcy5jYWNoZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlSWQgPSAnY291bnQ6OicgKyB0aGlzLmNhY2hlci5nZW5lcmF0ZVF1ZXJ5SWQodGhpcy5xdWVyeU5hbWUsIHRoaXMucGFyYW1zKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVyLmZldGNoKGNhY2hlSWQsIHtjb3VudEN1cnNvcn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNvdW50Q3Vyc29yLmNvdW50KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgY3Vyc29yIGZvciBjb3VudGluZ1xuICAgICAqIFRoaXMgaXMgbW9zdCBsaWtlbHkgdXNlZCBmb3IgY291bnRzIGN1cnNvclxuICAgICAqL1xuICAgIGdldEN1cnNvckZvckNvdW50aW5nKCkge1xuICAgICAgICBsZXQgYm9keSA9IGRlZXBDbG9uZSh0aGlzLmJvZHkpO1xuICAgICAgICB0aGlzLmRvRW1ib2RpbWVudElmSXRBcHBsaWVzKGJvZHksIHRoaXMucGFyYW1zKTtcbiAgICAgICAgYm9keSA9IHByZXBhcmVGb3JQcm9jZXNzKGJvZHksIHRoaXMucGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmQoYm9keS4kZmlsdGVycyB8fCB7fSwge2ZpZWxkczoge19pZDogMX19KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2FjaGVyXG4gICAgICovXG4gICAgY2FjaGVSZXN1bHRzKGNhY2hlcikge1xuICAgICAgICBpZiAoIWNhY2hlcikge1xuICAgICAgICAgICAgY2FjaGVyID0gbmV3IE1lbW9yeVJlc3VsdENhY2hlcigpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jYWNoZXIgPSBjYWNoZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ29uZmlndXJlIHJlc29sdmUuIFRoaXMgZG9lc24ndCBhY3R1YWxseSBjYWxsIHRoZSByZXNvbHZlciwgaXQganVzdCBzZXRzIGl0XG4gICAgICogQHBhcmFtIGZuXG4gICAgICovXG4gICAgcmVzb2x2ZShmbikge1xuICAgICAgICBpZiAoIXRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jYWxsJywgYFlvdSBjYW5ub3QgdXNlIHJlc29sdmUoKSBvbiBhIG5vbiByZXNvbHZlciBOYW1lZFF1ZXJ5YCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc29sdmVyID0gZm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hSZXNvbHZlckRhdGEoY29udGV4dCkge1xuICAgICAgICBjb25zdCByZXNvbHZlciA9IHRoaXMucmVzb2x2ZXI7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBxdWVyeSA9IHtcbiAgICAgICAgICAgIGZldGNoKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlci5jYWxsKGNvbnRleHQsIHNlbGYucGFyYW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAodGhpcy5jYWNoZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlSWQgPSB0aGlzLmNhY2hlci5nZW5lcmF0ZVF1ZXJ5SWQodGhpcy5xdWVyeU5hbWUsIHRoaXMucGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNhY2hlci5mZXRjaChjYWNoZUlkLCB7cXVlcnl9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxdWVyeS5mZXRjaCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjb250ZXh0IE1ldGVvciBtZXRob2QvcHVibGlzaCBjb250ZXh0XG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfcGVyZm9ybVNlY3VyaXR5Q2hlY2tzKGNvbnRleHQsIHBhcmFtcykge1xuICAgICAgICBpZiAoY29udGV4dCAmJiB0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgdGhpcy5fY2FsbEZpcmV3YWxsKGNvbnRleHQsIGNvbnRleHQudXNlcklkLCBwYXJhbXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcyk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgbmV3IGNsYXNzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdG9yYWdlID0ge307XG4gICAgfVxuXG4gICAgYWRkKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZVtrZXldKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLW5hbWUnLCBgWW91IGhhdmUgcHJldmlvdXNseSBkZWZpbmVkIGFub3RoZXIgbmFtZWRRdWVyeSB3aXRoIHRoZSBzYW1lIG5hbWU6IFwiJHtrZXl9XCIuIE5hbWVkIFF1ZXJ5IG5hbWVzIHNob3VsZCBiZSB1bmlxdWUuYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN0b3JhZ2Vba2V5XSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGdldChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXldO1xuICAgIH1cblxuICAgIGdldEFsbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZTtcbiAgICB9XG59IiwiaW1wb3J0IHtFSlNPTn0gZnJvbSAnbWV0ZW9yL2Vqc29uJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgdmVyeSBiYXNpYyBpbi1tZW1vcnkgcmVzdWx0IGNhY2hpbmcgZnVuY3Rpb25hbGl0eVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlUmVzdWx0Q2FjaGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcXVlcnlOYW1lXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICovXG4gICAgZ2VuZXJhdGVRdWVyeUlkKHF1ZXJ5TmFtZSwgcGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBgJHtxdWVyeU5hbWV9Ojoke0VKU09OLnN0cmluZ2lmeShwYXJhbXMpfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHVtbXkgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBmZXRjaChjYWNoZUlkLCB7cXVlcnksIGNvdW50Q3Vyc29yfSkge1xuICAgICAgICB0aHJvdyAnTm90IGltcGxlbWVudGVkJztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcXVlcnlcbiAgICAgKiBAcGFyYW0gY291bnRDdXJzb3JcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZmV0Y2hEYXRhKHtxdWVyeSwgY291bnRDdXJzb3J9KSB7XG4gICAgICAgIGlmIChxdWVyeSkge1xuICAgICAgICAgICAgcmV0dXJuIHF1ZXJ5LmZldGNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY291bnRDdXJzb3IuY291bnQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgQmFzZVJlc3VsdENhY2hlciBmcm9tICcuL0Jhc2VSZXN1bHRDYWNoZXInO1xuXG5jb25zdCBERUZBVUxUX1RUTCA9IDYwMDAwO1xuXG4vKipcbiAqIFRoaXMgaXMgYSB2ZXJ5IGJhc2ljIGluLW1lbW9yeSByZXN1bHQgY2FjaGluZyBmdW5jdGlvbmFsaXR5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1lbW9yeVJlc3VsdENhY2hlciBleHRlbmRzIEJhc2VSZXN1bHRDYWNoZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2FjaGVJZFxuICAgICAqIEBwYXJhbSBxdWVyeVxuICAgICAqIEBwYXJhbSBjb3VudEN1cnNvclxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNhY2hlSWQsIHtxdWVyeSwgY291bnRDdXJzb3J9KSB7XG4gICAgICAgIGNvbnN0IGNhY2hlRGF0YSA9IHRoaXMuc3RvcmVbY2FjaGVJZF07XG4gICAgICAgIGlmIChjYWNoZURhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNsb25lRGVlcChjYWNoZURhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IEJhc2VSZXN1bHRDYWNoZXIuZmV0Y2hEYXRhKHtxdWVyeSwgY291bnRDdXJzb3J9KTtcbiAgICAgICAgdGhpcy5zdG9yZURhdGEoY2FjaGVJZCwgZGF0YSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2FjaGVJZFxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgc3RvcmVEYXRhKGNhY2hlSWQsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgdHRsID0gdGhpcy5jb25maWcudHRsIHx8IERFRkFVTFRfVFRMO1xuICAgICAgICB0aGlzLnN0b3JlW2NhY2hlSWRdID0gY2xvbmVEZWVwKGRhdGEpO1xuXG4gICAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnN0b3JlW2NhY2hlSWRdO1xuICAgICAgICB9LCB0dGwpXG4gICAgfVxufVxuIiwiaW1wb3J0IE5hbWVkUXVlcnkgZnJvbSAnLi4vbmFtZWRRdWVyeS5qcyc7XG5pbXBvcnQgeyBFeHBvc2VTY2hlbWEsIEV4cG9zZURlZmF1bHRzIH0gZnJvbSAnLi9zY2hlbWEuanMnO1xuaW1wb3J0IG1lcmdlRGVlcCBmcm9tICcuL2xpYi9tZXJnZURlZXAuanMnO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQgcmVjdXJzaXZlQ29tcG9zZSBmcm9tICcuLi8uLi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi4vLi4vcXVlcnkvbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgaW50ZXJzZWN0RGVlcCBmcm9tICcuLi8uLi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcCc7XG5pbXBvcnQgZ2VuQ291bnRFbmRwb2ludCBmcm9tICcuLi8uLi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyJztcbmltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcblxuXy5leHRlbmQoTmFtZWRRdWVyeS5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICovXG4gICAgZXhwb3NlKGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGlmICghTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdpbnZhbGlkLWVudmlyb25tZW50JyxcbiAgICAgICAgICAgICAgICBgWW91IG11c3QgcnVuIHRoaXMgaW4gc2VydmVyLXNpZGUgY29kZWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0V4cG9zZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ3F1ZXJ5LWFscmVhZHktZXhwb3NlZCcsXG4gICAgICAgICAgICAgICAgYFlvdSBoYXZlIGFscmVhZHkgZXhwb3NlZDogXCIke3RoaXMubmFtZX1cIiBuYW1lZCBxdWVyeWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV4cG9zZUNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIEV4cG9zZURlZmF1bHRzLCBjb25maWcpO1xuICAgICAgICBjaGVjayh0aGlzLmV4cG9zZUNvbmZpZywgRXhwb3NlU2NoZW1hKTtcblxuICAgICAgICBpZiAodGhpcy5leHBvc2VDb25maWcudmFsaWRhdGVQYXJhbXMpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy52YWxpZGF0ZVBhcmFtcyA9IHRoaXMuZXhwb3NlQ29uZmlnLnZhbGlkYXRlUGFyYW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXROb3JtYWxRdWVyeSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc0V4cG9zZWQgPSB0cnVlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBhIG5vcm1hbCBOYW1lZFF1ZXJ5IChub3JtYWwgPT0gbm90IGEgcmVzb2x2ZXIpXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdE5vcm1hbFF1ZXJ5KCkge1xuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmV4cG9zZUNvbmZpZztcbiAgICAgICAgaWYgKGNvbmZpZy5tZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRNZXRob2QoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWcucHVibGljYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX2luaXRQdWJsaWNhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb25maWcubWV0aG9kICYmICFjb25maWcucHVibGljYXRpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ3dlaXJkJyxcbiAgICAgICAgICAgICAgICAnSWYgeW91IHdhbnQgdG8gZXhwb3NlIHlvdXIgbmFtZWQgcXVlcnkgeW91IG5lZWQgdG8gc3BlY2lmeSBhdCBsZWFzdCBvbmUgb2YgW1wibWV0aG9kXCIsIFwicHVibGljYXRpb25cIl0gb3B0aW9ucyB0byB0cnVlJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXRDb3VudE1ldGhvZCgpO1xuICAgICAgICB0aGlzLl9pbml0Q291bnRQdWJsaWNhdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBlbWJvZGllZCBib2R5IG9mIHRoZSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHsqfSBfZW1ib2R5XG4gICAgICogQHBhcmFtIHsqfSBib2R5XG4gICAgICovXG4gICAgZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIHF1ZXJ5IGlzIG5vdCBleHBvc2VkIHlldCwgc28gaXQgZG9lc24ndCBoYXZlIGVtYm9kaW1lbnQgbG9naWNcbiAgICAgICAgaWYgKCF0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBlbWJvZHkgfSA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuXG4gICAgICAgIGlmICghZW1ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGVtYm9keSkpIHtcbiAgICAgICAgICAgIGVtYm9keS5jYWxsKHRoaXMsIGJvZHksIHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtZXJnZURlZXAoYm9keSwgZW1ib2R5KTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0TWV0aG9kKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZV0obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fdW5ibG9ja0lmTmVjZXNzYXJ5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VjdXJpdHkgaXMgZG9uZSBpbiB0aGUgZmV0Y2hpbmcgYmVjYXVzZSB3ZSBwcm92aWRlIGEgY29udGV4dFxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNsb25lKG5ld1BhcmFtcykuZmV0Y2godGhpcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdENvdW50TWV0aG9kKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lICsgJy5jb3VudCddKG5ld1BhcmFtcykge1xuICAgICAgICAgICAgICAgIHNlbGYuX3VuYmxvY2tJZk5lY2Vzc2FyeSh0aGlzKTtcblxuICAgICAgICAgICAgICAgIC8vIHNlY3VyaXR5IGlzIGRvbmUgaW4gdGhlIGZldGNoaW5nIGJlY2F1c2Ugd2UgcHJvdmlkZSBhIGNvbnRleHRcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5jbG9uZShuZXdQYXJhbXMpLmdldENvdW50KHRoaXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRDb3VudFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBnZW5Db3VudEVuZHBvaW50KHNlbGYubmFtZSwge1xuICAgICAgICAgICAgZ2V0Q3Vyc29yKHsgc2Vzc2lvbiB9KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBzZWxmLmNsb25lKHNlc3Npb24ucGFyYW1zKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVlcnkuZ2V0Q3Vyc29yRm9yQ291bnRpbmcoKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGdldFNlc3Npb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5kb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fY2FsbEZpcmV3YWxsKHRoaXMsIHRoaXMudXNlcklkLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgbmFtZTogc2VsZi5uYW1lLCBwYXJhbXMsIH07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBNZXRlb3IucHVibGlzaENvbXBvc2l0ZSh0aGlzLm5hbWUsIGZ1bmN0aW9uKHBhcmFtcyA9IHt9KSB7XG4gICAgICAgICAgICBjb25zdCBpc1Njb3BlZCA9ICEhc2VsZi5vcHRpb25zLnNjb3BlZDtcblxuICAgICAgICAgICAgaWYgKGlzU2NvcGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVTY29wZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLl91bmJsb2NrSWZOZWNlc3NhcnkodGhpcyk7XG4gICAgICAgICAgICBzZWxmLmRvVmFsaWRhdGVQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgIHNlbGYuX2NhbGxGaXJld2FsbCh0aGlzLCB0aGlzLnVzZXJJZCwgcGFyYW1zKTtcblxuICAgICAgICAgICAgbGV0IGJvZHkgPSBkZWVwQ2xvbmUoc2VsZi5ib2R5KTtcbiAgICAgICAgICAgIGlmIChwYXJhbXMuJGJvZHkpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gaW50ZXJzZWN0RGVlcChib2R5LCBwYXJhbXMuJGJvZHkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmRvRW1ib2RpbWVudElmSXRBcHBsaWVzKGJvZHksIHBhcmFtcyk7XG4gICAgICAgICAgICBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3MoYm9keSwgcGFyYW1zKTtcblxuICAgICAgICAgICAgY29uc3Qgcm9vdE5vZGUgPSBjcmVhdGVHcmFwaChzZWxmLmNvbGxlY3Rpb24sIGJvZHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVjdXJzaXZlQ29tcG9zZShyb290Tm9kZSwgdW5kZWZpbmVkLCB7c2NvcGVkOiBpc1Njb3BlZH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICogQHBhcmFtIHBhcmFtc1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGxGaXJld2FsbChjb250ZXh0LCB1c2VySWQsIHBhcmFtcykge1xuICAgICAgICBjb25zdCB7IGZpcmV3YWxsIH0gPSB0aGlzLmV4cG9zZUNvbmZpZztcbiAgICAgICAgaWYgKCFmaXJld2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaXJld2FsbCkpIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmZvckVhY2goZmlyZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZS5jYWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmlyZXdhbGwuY2FsbChjb250ZXh0LCB1c2VySWQsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbnRleHRcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91bmJsb2NrSWZOZWNlc3NhcnkoY29udGV4dCkge1xuICAgICAgICBpZiAodGhpcy5leHBvc2VDb25maWcudW5ibG9jaykge1xuICAgICAgICAgICAgaWYgKGNvbnRleHQudW5ibG9jaykge1xuICAgICAgICAgICAgICAgIGNvbnRleHQudW5ibG9jaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn0pO1xuIiwiaW1wb3J0IHtNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcblxuZXhwb3J0IGNvbnN0IEV4cG9zZURlZmF1bHRzID0ge1xuICAgIHB1YmxpY2F0aW9uOiB0cnVlLFxuICAgIG1ldGhvZDogdHJ1ZSxcbiAgICB1bmJsb2NrOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IEV4cG9zZVNjaGVtYSA9IHtcbiAgICBmaXJld2FsbDogTWF0Y2guTWF5YmUoXG4gICAgICAgIE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBbRnVuY3Rpb25dKVxuICAgICksXG4gICAgcHVibGljYXRpb246IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIHVuYmxvY2s6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIG1ldGhvZDogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgZW1ib2R5OiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoT2JqZWN0LCBGdW5jdGlvbilcbiAgICApLFxuICAgIHZhbGlkYXRlUGFyYW1zOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoT2JqZWN0LCBGdW5jdGlvbilcbiAgICApXG59O1xuIiwiLyoqXG4gKiBEZWVwIG1lcmdlIHR3byBvYmplY3RzLlxuICogQHBhcmFtIHRhcmdldFxuICogQHBhcmFtIHNvdXJjZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZURlZXAodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAoXy5pc09iamVjdCh0YXJnZXQpICYmIF8uaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICBfLmVhY2goc291cmNlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIE9iamVjdC5hc3NpZ24odGFyZ2V0LCB7IFtrZXldOiB7fSB9KTtcbiAgICAgICAgICAgICAgICBtZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufSIsImltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeUJhc2Uge1xuICAgIGlzR2xvYmFsUXVlcnkgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdGhpcy5ib2R5ID0gZGVlcENsb25lKGJvZHkpO1xuXG4gICAgICAgIHRoaXMucGFyYW1zID0gb3B0aW9ucy5wYXJhbXMgfHwge307XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgY2xvbmUobmV3UGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IF8uZXh0ZW5kKHt9LCBkZWVwQ2xvbmUodGhpcy5wYXJhbXMpLCBuZXdQYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgICAgICAgIGRlZXBDbG9uZSh0aGlzLmJvZHkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIGBleHBvc3VyZV8ke3RoaXMuY29sbGVjdGlvbi5fbmFtZX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyB0aGUgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIGRvVmFsaWRhdGVQYXJhbXMoKSB7XG4gICAgICAgIGNvbnN0IHt2YWxpZGF0ZVBhcmFtc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmICghdmFsaWRhdGVQYXJhbXMpIHJldHVybjtcblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbGlkYXRlUGFyYW1zKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVQYXJhbXMuY2FsbChudWxsLCB0aGlzLnBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrKHRoaXMucGFyYW1zKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIHRoZSBwYXJhbXMgd2l0aCBwcmV2aW91cyBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge1F1ZXJ5fVxuICAgICAqL1xuICAgIHNldFBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBfLmV4dGVuZCh7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgQ291bnRTdWJzY3JpcHRpb24gZnJvbSAnLi9jb3VudHMvY291bnRTdWJzY3JpcHRpb24nO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4vbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVGZXRjaCBmcm9tICcuL2xpYi9yZWN1cnNpdmVGZXRjaC5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IGNhbGxXaXRoUHJvbWlzZSBmcm9tICcuL2xpYi9jYWxsV2l0aFByb21pc2UnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9xdWVyeS5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnkgZXh0ZW5kcyBCYXNlIHtcbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259IG9wdGlvbmFsXG4gICAgICogQHJldHVybnMge251bGx8YW55fCp9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZShcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25IYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHRoZSBjb3VudHMgZm9yIHRoaXMgcXVlcnlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgc3Vic2NyaWJlQ291bnQoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gbmV3IENvdW50U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuc3Vic2NyaWJlKFxuICAgICAgICAgICAgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksXG4gICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIGlmIGFuIGV4aXN0aW5nIHN1YnNjcmlwdGlvbiBleGlzdHNcbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBpZiBhIHN1YnNjcmlwdGlvbiBleGlzdHMuXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmVDb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBlbGVtZW50cyBpbiBzeW5jIHVzaW5nIHByb21pc2VzXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaFN5bmMoKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lLCBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBvbmUgZWxlbWVudCBpbiBzeW5jXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaE9uZVN5bmMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KGF3YWl0IHRoaXMuZmV0Y2hTeW5jKCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja09yT3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNhbGxiYWNrT3JPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFN0YXRpYyhjYWxsYmFja09yT3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFJlYWN0aXZlKGNhbGxiYWNrT3JPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2hPbmUoLi4uYXJncykge1xuICAgICAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdZb3UgZGlkIG5vdCBwcm92aWRlIGEgdmFsaWQgY2FsbGJhY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mZXRjaCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyA/IF8uZmlyc3QocmVzKSA6IG51bGwpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMgaW4gc3luYy5cbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFzeW5jIGdldENvdW50U3luYygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1RoaXMgcXVlcnkgaXMgcmVhY3RpdmUsIG1lYW5pbmcgeW91IGNhbm5vdCB1c2UgcHJvbWlzZXMgdG8gZmV0Y2ggdGhlIGRhdGEuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhQcm9taXNlKHRoaXMubmFtZSArICcuY291bnQnLCBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBnZXRDb3VudChjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuZ2V0Q291bnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgY291bnQgb3Igc3Vic2NyaWJlIGZpcnN0LicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArICcuY291bnQnLFxuICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgbm9uLXJlYWN0aXZlIHF1ZXJpZXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFN0YXRpYyhjYWxsYmFjaykge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgZGF0YSBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBNZXRlb3IuY2FsbCh0aGlzLm5hbWUsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgd2hlbiB3ZSd2ZSBnb3QgYW4gYWN0aXZlIHB1YmxpY2F0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoUmVhY3RpdmUob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGxldCBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyk7XG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd1NraXAgJiYgYm9keS4kb3B0aW9ucyAmJiBib2R5LiRvcHRpb25zLnNraXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBib2R5LiRvcHRpb25zLnNraXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVjdXJzaXZlRmV0Y2goXG4gICAgICAgICAgICBjcmVhdGVHcmFwaCh0aGlzLmNvbGxlY3Rpb24sIGJvZHkpLFxuICAgICAgICAgICAgdGhpcy5wYXJhbXNcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUXVlcnlDbGllbnQgZnJvbSAnLi9xdWVyeS5jbGllbnQnO1xuaW1wb3J0IFF1ZXJ5U2VydmVyIGZyb20gJy4vcXVlcnkuc2VydmVyJztcblxubGV0IFF1ZXJ5O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgUXVlcnkgPSBRdWVyeVNlcnZlcjtcbn0gZWxzZSB7XG4gICAgUXVlcnkgPSBRdWVyeUNsaWVudDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVlcnk7IiwiaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4vbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgaHlwZXJub3ZhIGZyb20gJy4vaHlwZXJub3ZhL2h5cGVybm92YS5qcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL3F1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGF0YS5cbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb25zdCBub2RlID0gY3JlYXRlR3JhcGgoXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBoeXBlcm5vdmEobm9kZSwgY29udGV4dC51c2VySWQsIHtwYXJhbXM6IHRoaXMucGFyYW1zfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvdW50IG9mIG1hdGNoaW5nIGVsZW1lbnRzLlxuICAgICAqIEByZXR1cm5zIHtpbnRlZ2VyfVxuICAgICAqL1xuICAgIGdldENvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmQodGhpcy5ib2R5LiRmaWx0ZXJzIHx8IHt9LCB7fSkuY291bnQoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5UIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbGxlY3Rpb24gdXNlZCB0byBzdG9yZSBjb3VudHMgb24gdGhlIGNsaWVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgbmV3IE1vbmdvLkNvbGxlY3Rpb24oQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5UKTtcbiIsImV4cG9ydCBjb25zdCBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgPSAnZ3JhcGhlcl9jb3VudHMnO1xuIiwiaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSZWFjdGl2ZVZhciB9IGZyb20gJ21ldGVvci9yZWFjdGl2ZS12YXInO1xuaW1wb3J0IHsgVHJhY2tlciB9IGZyb20gJ21ldGVvci90cmFja2VyJztcblxuaW1wb3J0IENvdW50cyBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IGNyZWF0ZUZhdXhTdWJzY3JpcHRpb24gZnJvbSAnLi9jcmVhdGVGYXV4U3Vic2NyaXB0aW9uJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlCYXNlIGZyb20gJy4uLy4uL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRTdWJzY3JpcHRpb24ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Kn0gcXVlcnkgLSBUaGUgcXVlcnkgdG8gdXNlIHdoZW4gZmV0Y2hpbmcgY291bnRzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocXVlcnkpIHtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG5ldyBSZWFjdGl2ZVZhcihudWxsKTtcbiAgICAgICAgdGhpcy5mYXV4SGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBhIHN1YnNjcmlwdGlvbiByZXF1ZXN0IGZvciByZWFjdGl2ZSBjb3VudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGFyZyAtIFRoZSBhcmd1bWVudCB0byBwYXNzIHRvIHtuYW1lfS5jb3VudC5zdWJzY3JpYmVcbiAgICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAgICovXG4gICAgc3Vic2NyaWJlKGFyZywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlc3Vic2NyaWJlIGlmIGFyZyBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBpZiAoRUpTT04uZXF1YWxzKHRoaXMubGFzdEFyZ3MsIGFyZykgJiYgdGhpcy5mYXV4SGFuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYXV4SGFuZGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQobnVsbCk7XG4gICAgICAgIHRoaXMubGFzdEFyZ3MgPSBhcmc7XG5cbiAgICAgICAgTWV0ZW9yLmNhbGwodGhpcy5xdWVyeS5uYW1lICsgJy5jb3VudC5zdWJzY3JpYmUnLCBhcmcsIChlcnJvciwgdG9rZW4pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbWFya2VkRm9yVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IE1ldGVvci5zdWJzY3JpYmUodGhpcy5xdWVyeS5uYW1lICsgJy5jb3VudCcsIHRva2VuLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQodG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0Q29tcHV0YXRpb24gPSBUcmFja2VyLmF1dG9ydW4oKCkgPT4gdGhpcy5oYW5kbGVEaXNjb25uZWN0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBjcmVhdGVGYXV4U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5mYXV4SGFuZGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlcyBmcm9tIHRoZSBjb3VudCBlbmRwb2ludCwgaWYgdGhlcmUgaXMgc3VjaCBhIHN1YnNjcmlwdGlvbi5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RDb21wdXRhdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBoaXQgdGhpcyBicmFuY2gsIHRoZW4gTWV0ZW9yLmNhbGwgaW4gc3Vic2NyaWJlIGhhc24ndCBmaW5pc2hlZCB5ZXRcbiAgICAgICAgICAgIC8vIHNvIHNldCBhIGZsYWcgdG8gc3RvcCB0aGUgc3Vic2NyaXB0aW9uIGZyb20gYmVpbmcgY3JlYXRlZFxuICAgICAgICAgICAgdGhpcy5fbWFya2VkRm9yVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQobnVsbCk7XG4gICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFjdGl2ZWx5IGZldGNoIGN1cnJlbnQgZG9jdW1lbnQgY291bnQuIFJldHVybnMgbnVsbCBpZiB0aGUgc3Vic2NyaXB0aW9uIGlzIG5vdCByZWFkeSB5ZXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfG51bGx9IC0gQ3VycmVudCBkb2N1bWVudCBjb3VudFxuICAgICAqL1xuICAgIGdldENvdW50KCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuYWNjZXNzVG9rZW4uZ2V0KCk7XG4gICAgICAgIGlmIChpZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgZG9jID0gQ291bnRzLmZpbmRPbmUoaWQpO1xuICAgICAgICByZXR1cm4gZG9jLmNvdW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbCBzZXNzaW9uIGluZm8gZ2V0cyBkZWxldGVkIHdoZW4gdGhlIHNlcnZlciBnb2VzIGRvd24sIHNvIHdoZW4gdGhlIGNsaWVudCBhdHRlbXB0cyB0b1xuICAgICAqIG9wdGltaXN0aWNhbGx5IHJlc3VtZSB0aGUgJy5jb3VudCcgcHVibGljYXRpb24sIHRoZSBzZXJ2ZXIgd2lsbCB0aHJvdyBhICduby1yZXF1ZXN0JyBlcnJvci5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcHJldmVudHMgdGhhdCBieSBtYW51YWxseSBzdG9wcGluZyBhbmQgcmVzdGFydGluZyB0aGUgc3Vic2NyaXB0aW9uIHdoZW4gdGhlXG4gICAgICogY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGlzIGxvc3QuXG4gICAgICovXG4gICAgaGFuZGxlRGlzY29ubmVjdCgpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gTWV0ZW9yLnN0YXR1cygpO1xuICAgICAgICBpZiAoIXN0YXR1cy5jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclJlc3VtZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cy5jb25uZWN0ZWQgJiYgdGhpcy5fbWFya2VkRm9yUmVzdW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JSZXN1bWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKHRoaXMubGFzdEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHN1YnNjcmlwdGlvbiByZXF1ZXN0IGhhcyBiZWVuIG1hZGUuXG4gICAgICovXG4gICAgaXNTdWJzY3JpYmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbi5nZXQoKSAhPT0gbnVsbDtcbiAgICB9XG59XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBcImZha2VcIiBzdWJzY3JpcHRpb24gaGFuZGxlIHNvIHRoYXQgdXNlcnMgb2YgQ291bnRTdWJzY3JpcHRpb24jc3Vic2NyaWJlXG4gKiBoYXZlIGFuIGludGVyZmFjZSBjb25zaXN0ZW50IHdpdGggbm9ybWFsIHN1YnNjcmlwdGlvbnMuXG4gKlxuICogQHBhcmFtIHtDb3VudFN1YnNjcmlwdGlvbn0gY291bnRNYW5hZ2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IChjb3VudE1hbmFnZXIpID0+ICh7XG4gICAgcmVhZHk6ICgpID0+IGNvdW50TWFuYWdlci5hY2Nlc3NUb2tlbi5nZXQoKSAhPT0gbnVsbCAmJiBjb3VudE1hbmFnZXIuc3Vic2NyaXB0aW9uSGFuZGxlLnJlYWR5KCksXG4gICAgc3RvcDogKCkgPT4gY291bnRNYW5hZ2VyLnVuc3Vic2NyaWJlKCksXG59KTtcbiIsImltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5pbXBvcnQgeyBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8vIFhYWDogU2hvdWxkIHRoaXMgcGVyc2lzdCBiZXR3ZWVuIHNlcnZlciByZXN0YXJ0cz9cbmNvbnN0IGNvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihudWxsKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBnZW5lcmF0ZXMgYSByZWFjdGl2ZSBjb3VudCBlbmRwb2ludCAoYSBtZXRob2QgYW5kIHB1YmxpY2F0aW9uKSBmb3IgYSBjb2xsZWN0aW9uIG9yIG5hbWVkIHF1ZXJ5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcXVlcnkgb3IgY29sbGVjdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0Q3Vyc29yIC0gVGFrZXMgaW4gdGhlIHVzZXIncyBzZXNzaW9uIGRvY3VtZW50IGFzIGFuIGFyZ3VtZW50LCBhbmQgdHVybnMgdGhhdCBpbnRvIGEgTW9uZ28gY3Vyc29yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0U2Vzc2lvbiAtIFRha2VzIHRoZSBzdWJzY3JpYmUgbWV0aG9kJ3MgYXJndW1lbnQgYXMgaXRzIHBhcmFtZXRlci4gU2hvdWxkIGVuZm9yY2UgYW55IG5lY2Vzc2FyeSBzZWN1cml0eSBjb25zdHJhaW50cy4gVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHN0b3JlZCBpbiB0aGUgc2Vzc2lvbiBkb2N1bWVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgKG5hbWUsIHsgZ2V0Q3Vyc29yLCBnZXRTZXNzaW9uIH0pID0+IHtcbiAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgIFtuYW1lICsgJy5jb3VudC5zdWJzY3JpYmUnXShwYXJhbXNPckJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb24gPSBnZXRTZXNzaW9uLmNhbGwodGhpcywgcGFyYW1zT3JCb2R5KTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25JZCA9IEpTT04uc3RyaW5naWZ5KHNlc3Npb24pO1xuXG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1Nlc3Npb24gPSBjb2xsZWN0aW9uLmZpbmRPbmUoe1xuICAgICAgICAgICAgICAgIHNlc3Npb246IHNlc3Npb25JZCxcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byByZXVzZSBzZXNzaW9ucyBpZiB0aGUgdXNlciBzdWJzY3JpYmVzIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgZGF0YVxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nU2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ1Nlc3Npb24uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGNvbGxlY3Rpb24uaW5zZXJ0KHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uOiBzZXNzaW9uSWQsXG4gICAgICAgICAgICAgICAgcXVlcnk6IG5hbWUsXG4gICAgICAgICAgICAgICAgdXNlcklkOiB0aGlzLnVzZXJJZCxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBNZXRlb3IucHVibGlzaChuYW1lICsgJy5jb3VudCcsIGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICAgIGNoZWNrKHRva2VuLCBTdHJpbmcpO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogdG9rZW4sIHVzZXJJZDogc2VsZi51c2VySWQgfSk7XG5cbiAgICAgICAgaWYgKCFyZXF1ZXN0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ25vLXJlcXVlc3QnLFxuICAgICAgICAgICAgICAgIGBZb3UgbXVzdCBhY3F1aXJlIGEgcmVxdWVzdCB0b2tlbiB2aWEgdGhlIFwiJHtuYW1lfS5jb3VudC5zdWJzY3JpYmVcIiBtZXRob2QgZmlyc3QuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3Quc2Vzc2lvbiA9IEpTT04ucGFyc2UocmVxdWVzdC5zZXNzaW9uKTtcbiAgICAgICAgY29uc3QgY3Vyc29yID0gZ2V0Q3Vyc29yLmNhbGwodGhpcywgcmVxdWVzdCk7XG5cbiAgICAgICAgLy8gU3RhcnQgY291bnRpbmdcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICBsZXQgaXNSZWFkeSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBoYW5kbGUgPSBjdXJzb3Iub2JzZXJ2ZSh7XG4gICAgICAgICAgICBhZGRlZCgpIHtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIGlzUmVhZHkgJiZcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2VkKENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCwgdG9rZW4sIHsgY291bnQgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZW1vdmVkKCkge1xuICAgICAgICAgICAgICAgIGNvdW50LS07XG4gICAgICAgICAgICAgICAgaXNSZWFkeSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlzUmVhZHkgPSB0cnVlO1xuICAgICAgICBzZWxmLmFkZGVkKENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCwgdG9rZW4sIHsgY291bnQgfSk7XG5cbiAgICAgICAgc2VsZi5vblN0b3AoKCkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHRva2VuKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5yZWFkeSgpO1xuICAgIH0pO1xufTtcbiIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuZnVuY3Rpb24gZXh0cmFjdElkc0Zyb21BcnJheShhcnJheSwgZmllbGQpIHtcbiAgICByZXR1cm4gKGFycmF5IHx8IFtdKS5tYXAob2JqID0+IF8uaXNPYmplY3Qob2JqKSA/IGRvdC5waWNrKGZpZWxkLCBvYmopIDogdW5kZWZpbmVkKS5maWx0ZXIodiA9PiAhIXYpO1xufVxuXG4vKipcbiAqIEl0cyBwdXJwb3NlIGlzIHRvIGNyZWF0ZSBmaWx0ZXJzIHRvIGdldCB0aGUgcmVsYXRlZCBkYXRhIGluIG9uZSByZXF1ZXN0LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBZ2dyZWdhdGVGaWx0ZXJzIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uTm9kZSwgbWV0YUZpbHRlcnMpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTm9kZSA9IGNvbGxlY3Rpb25Ob2RlO1xuICAgICAgICB0aGlzLmxpbmtlciA9IGNvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcbiAgICAgICAgdGhpcy5tZXRhRmlsdGVycyA9IG1ldGFGaWx0ZXJzO1xuICAgICAgICB0aGlzLmlzVmlydHVhbCA9IHRoaXMubGlua2VyLmlzVmlydHVhbCgpO1xuXG4gICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCA9IHRoaXMubGlua2VyLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgfVxuXG4gICAgZ2V0IHBhcmVudE9iamVjdHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzO1xuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmxpbmtlci5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPbmUoKTtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPbmVNZXRhKCk7XG4gICAgICAgICAgICBjYXNlICdtYW55JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVNYW55KCk7XG4gICAgICAgICAgICBjYXNlICdtYW55LW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1hbnlNZXRhKCk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYEludmFsaWQgbGlua2VyIHR5cGU6ICR7dGhpcy5saW5rZXIudHlwZX1gKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU9uZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoZXh0cmFjdElkc0Zyb21BcnJheSh0aGlzLnBhcmVudE9iamVjdHMsIHRoaXMubGlua1N0b3JhZ2VGaWVsZCkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgW3RoaXMubGlua1N0b3JhZ2VGaWVsZF06IHtcbiAgICAgICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlT25lTWV0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgbGV0IGVsaWdpYmxlT2JqZWN0cyA9IHRoaXMucGFyZW50T2JqZWN0cztcblxuICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICBlbGlnaWJsZU9iamVjdHMgPSBfLmZpbHRlcih0aGlzLnBhcmVudE9iamVjdHMsIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzaWZ0KHRoaXMubWV0YUZpbHRlcnMpKG9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc3RvcmFnZXMgPSBfLnBsdWNrKGVsaWdpYmxlT2JqZWN0cywgdGhpcy5saW5rU3RvcmFnZUZpZWxkKTtcbiAgICAgICAgICAgIGxldCBpZHMgPSBbXTtcbiAgICAgICAgICAgIF8uZWFjaChzdG9yYWdlcywgc3RvcmFnZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHN0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2goc3RvcmFnZS5faWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDogeyRpbjogXy51bmlxKGlkcyl9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGFGaWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMubWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnNbdGhpcy5saW5rU3RvcmFnZUZpZWxkICsgJy4nICsga2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbHRlcnNbdGhpcy5saW5rU3RvcmFnZUZpZWxkICsgJy5faWQnXSA9IHtcbiAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsICdfaWQnKVxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiBmaWx0ZXJzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlTWFueSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgY29uc3QgW3Jvb3QsIC4uLm5lc3RlZF0gPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5T2ZJZHMgPSBfLnVuaW9uKC4uLmV4dHJhY3RJZHNGcm9tQXJyYXkodGhpcy5wYXJlbnRPYmplY3RzLCByb290KSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShuZXN0ZWQubGVuZ3RoID4gMCA/IGV4dHJhY3RJZHNGcm9tQXJyYXkoYXJyYXlPZklkcywgbmVzdGVkLmpvaW4oJy4nKSkgOiBhcnJheU9mSWRzKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBhcnJheU9mSWRzID0gXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsICdfaWQnKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgW3RoaXMubGlua1N0b3JhZ2VGaWVsZF06IHtcbiAgICAgICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgICAgICBfLnVuaW9uKC4uLmFycmF5T2ZJZHMpXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlTWFueU1ldGEoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIGxldCBpZHMgPSBbXTtcblxuICAgICAgICAgICAgXy5lYWNoKHRoaXMucGFyZW50T2JqZWN0cywgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSBzaWZ0KHRoaXMubWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKG9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdLCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ZhbGlkKG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2gob2JqZWN0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0sIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzLnB1c2gob2JqZWN0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDogeyRpbjogXy51bmlxKGlkcyl9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGFGaWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgXy5lYWNoKHRoaXMubWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnNba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZpbHRlcnMuX2lkID0ge1xuICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkZWxlbU1hdGNoOiBmaWx0ZXJzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgc2lmdCBmcm9tICdzaWZ0JztcbmltcG9ydCBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIGZyb20gJy4vbGliL2NsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMnO1xuXG4vKipcbiAqIFRoaXMgb25seSBhcHBsaWVzIHRvIGludmVyc2VkIGxpbmtzLiBJdCB3aWxsIGFzc2VtYmxlIHRoZSBkYXRhIGluIGEgY29ycmVjdCBtYW5uZXIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGNoaWxkQ29sbGVjdGlvbk5vZGUsIGFnZ3JlZ2F0ZVJlc3VsdHMsIG1ldGFGaWx0ZXJzKSB7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgbGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIGNvbnN0IGxpbmtOYW1lID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZTtcbiAgICBjb25zdCBpc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG4gICAgY29uc3QgaXNNYW55ID0gbGlua2VyLmlzTWFueSgpO1xuXG4gICAgbGV0IGFsbFJlc3VsdHMgPSBbXTtcblxuICAgIGlmIChpc01ldGEgJiYgbWV0YUZpbHRlcnMpIHtcbiAgICAgICAgY29uc3QgbWV0YUZpbHRlcnNUZXN0ID0gc2lmdChtZXRhRmlsdGVycyk7XG4gICAgICAgIF8uZWFjaChjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyhcbiAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHQsXG4gICAgICAgICAgICAgICAgbGlua1N0b3JhZ2VGaWVsZCxcbiAgICAgICAgICAgICAgICBtZXRhRmlsdGVyc1Rlc3RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc01ldGEgJiYgaXNNYW55KSB7XG4gICAgICAgIC8vIFRoaXMgY2FzZSBpcyB0cmVhdGVkIGRpZmZlcmVudGx5IGJlY2F1c2Ugd2UgZ2V0IGFuIGFycmF5IHJlc3BvbnNlIGZyb20gdGhlIHBpcGVsaW5lLlxuXG4gICAgICAgIF8uZWFjaChjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gfHwgW107XG5cbiAgICAgICAgICAgIGNvbnN0IGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cyA9IF8uZmlsdGVyKFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdHMsXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMoYWdncmVnYXRlUmVzdWx0Ll9pZCwgcGFyZW50UmVzdWx0Ll9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhcyA9IF8ucGx1Y2soZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLCAnZGF0YScpOyAvLy8gWyBbeDEsIHgyXSwgW3gyLCB4M10gXVxuXG4gICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFzLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGEsIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy5lYWNoKGFnZ3JlZ2F0ZVJlc3VsdHMsIGFnZ3JlZ2F0ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgICBfLmVhY2goYWdncmVnYXRlUmVzdWx0LmRhdGEsIGl0ZW0gPT4gYWxsUmVzdWx0cy5wdXNoKGl0ZW0pKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNvbXBhcmF0b3I7XG4gICAgICAgIGlmIChpc01hbnkpIHtcbiAgICAgICAgICAgIGNvbXBhcmF0b3IgPSAoYWdncmVnYXRlUmVzdWx0LCByZXN1bHQpID0+XG4gICAgICAgICAgICAgICAgXy5jb250YWlucyhhZ2dyZWdhdGVSZXN1bHQuX2lkLCByZXN1bHQuX2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbXBhcmF0b3IgPSAoYWdncmVnYXRlUmVzdWx0LCByZXN1bHQpID0+XG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0Ll9pZCA9PSByZXN1bHQuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2hpbGRMaW5rTmFtZSA9IGNoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWU7XG4gICAgICAgIGNvbnN0IHBhcmVudFJlc3VsdHMgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzO1xuXG4gICAgICAgIHBhcmVudFJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gV2UgYXJlIG5vdyBmaW5kaW5nIHRoZSBkYXRhIGZyb20gdGhlIHBpcGVsaW5lIHRoYXQgaXMgcmVsYXRlZCB0byB0aGUgX2lkIG9mIHRoZSBwYXJlbnRcbiAgICAgICAgICAgIGNvbnN0IGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cyA9IGFnZ3JlZ2F0ZVJlc3VsdHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdCA9PiBjb21wYXJhdG9yKGFnZ3JlZ2F0ZVJlc3VsdCwgcGFyZW50UmVzdWx0KVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLmZvckVhY2goYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJlbnRSZXN1bHRbY2hpbGRMaW5rTmFtZV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZExpbmtOYW1lXS5wdXNoKC4uLmFnZ3JlZ2F0ZVJlc3VsdC5kYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRMaW5rTmFtZV0gPSBbLi4uYWdncmVnYXRlUmVzdWx0LmRhdGFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBhZ2dyZWdhdGVSZXN1bHRzLmZvckVhY2goYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGFsbFJlc3VsdHMucHVzaCguLi5hZ2dyZWdhdGVSZXN1bHQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IGFsbFJlc3VsdHM7XG59XG4iLCJpbXBvcnQgY3JlYXRlU2VhcmNoRmlsdGVycyBmcm9tICcuLi8uLi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycyc7XG5pbXBvcnQgY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyBmcm9tICcuL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzJztcbmltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHsgbGltaXQsIHNraXAsIG1ldGFGaWx0ZXJzIH0pID0+IHtcbiAgICBpZiAoY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50ID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5wYXJlbnQ7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG5cbiAgICBjb25zdCBzdHJhdGVneSA9IGxpbmtlci5zdHJhdGVneTtcbiAgICBjb25zdCBpc1NpbmdsZSA9IGxpbmtlci5pc1NpbmdsZSgpO1xuICAgIGNvbnN0IGlzTWV0YSA9IGxpbmtlci5pc01ldGEoKTtcbiAgICBjb25zdCBmaWVsZFN0b3JhZ2UgPSBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgIC8vIGNsZWFuaW5nIHRoZSBwYXJlbnQgcmVzdWx0cyBmcm9tIGEgY2hpbGRcbiAgICAvLyB0aGlzIG1heSBiZSB0aGUgd3JvbmcgYXBwcm9hY2ggYnV0IGl0IHdvcmtzIGZvciBub3dcbiAgICBpZiAoaXNNZXRhICYmIG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIGNvbnN0IG1ldGFGaWx0ZXJzVGVzdCA9IHNpZnQobWV0YUZpbHRlcnMpO1xuICAgICAgICBfLmVhY2gocGFyZW50LnJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzKFxuICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdCxcbiAgICAgICAgICAgICAgICBmaWVsZFN0b3JhZ2UsXG4gICAgICAgICAgICAgICAgbWV0YUZpbHRlcnNUZXN0XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHRzQnlLZXlJZCA9IF8uZ3JvdXBCeShjaGlsZENvbGxlY3Rpb25Ob2RlLnJlc3VsdHMsICdfaWQnKTtcblxuICAgIGlmIChzdHJhdGVneSA9PT0gJ29uZScpIHtcbiAgICAgICAgcGFyZW50LnJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkb3QucGljayhmaWVsZFN0b3JhZ2UsIHBhcmVudFJlc3VsdCk7XG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBmaWx0ZXJBc3NlbWJsZWREYXRhKFxuICAgICAgICAgICAgICAgIHJlc3VsdHNCeUtleUlkW3ZhbHVlXSxcbiAgICAgICAgICAgICAgICB7IGxpbWl0LCBza2lwIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzdHJhdGVneSA9PT0gJ21hbnknKSB7XG4gICAgICAgIHBhcmVudC5yZXN1bHRzLmZvckVhY2gocGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgZG90dGVkIGZpZWxkc1xuICAgICAgICAgICAgY29uc3QgW3Jvb3QsIC4uLm5lc3RlZF0gPSBmaWVsZFN0b3JhZ2Uuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZG90LnBpY2socm9vdCwgcGFyZW50UmVzdWx0KTtcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IFtdO1xuICAgICAgICAgICAgdmFsdWUuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBfaWQgPSBuZXN0ZWQubGVuZ3RoID4gMCA/IGRvdC5waWNrKG5lc3RlZC5qb2luKCcuJyksIHYpIDogdjtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goXy5maXJzdChyZXN1bHRzQnlLZXlJZFtfaWRdKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFyZW50UmVzdWx0W2NoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gZmlsdGVyQXNzZW1ibGVkRGF0YShcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHsgbGltaXQsIHNraXAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnb25lLW1ldGEnKSB7XG4gICAgICAgIHBhcmVudC5yZXN1bHRzLmZvckVhY2gocGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmICghcGFyZW50UmVzdWx0W2ZpZWxkU3RvcmFnZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IF9pZCA9IHBhcmVudFJlc3VsdFtmaWVsZFN0b3JhZ2VdLl9pZDtcbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGZpbHRlckFzc2VtYmxlZERhdGEoXG4gICAgICAgICAgICAgICAgcmVzdWx0c0J5S2V5SWRbX2lkXSxcbiAgICAgICAgICAgICAgICB7IGxpbWl0LCBza2lwIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChzdHJhdGVneSA9PT0gJ21hbnktbWV0YScpIHtcbiAgICAgICAgcGFyZW50LnJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgY29uc3QgX2lkcyA9IF8ucGx1Y2socGFyZW50UmVzdWx0W2ZpZWxkU3RvcmFnZV0sICdfaWQnKTtcbiAgICAgICAgICAgIGxldCBkYXRhID0gW107XG4gICAgICAgICAgICBfaWRzLmZvckVhY2goX2lkID0+IHtcbiAgICAgICAgICAgICAgICBkYXRhLnB1c2goXy5maXJzdChyZXN1bHRzQnlLZXlJZFtfaWRdKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcGFyZW50UmVzdWx0W2NoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gZmlsdGVyQXNzZW1ibGVkRGF0YShcbiAgICAgICAgICAgICAgICBkYXRhLFxuICAgICAgICAgICAgICAgIHsgbGltaXQsIHNraXAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gZmlsdGVyQXNzZW1ibGVkRGF0YShkYXRhLCB7IGxpbWl0LCBza2lwIH0pIHtcbiAgICBpZiAobGltaXQgJiYgQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICByZXR1cm4gZGF0YS5zbGljZShza2lwLCBsaW1pdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG59XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHtTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoY2hpbGRDb2xsZWN0aW9uTm9kZSwgZmlsdGVycywgb3B0aW9ucywgdXNlcklkKSB7XG4gICAgbGV0IGNvbnRhaW5zRG90dGVkRmllbGRzID0gZmFsc2U7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgbGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb247XG5cbiAgICBsZXQgcGlwZWxpbmUgPSBbXTtcblxuICAgIGlmIChjb2xsZWN0aW9uLmZpcmV3YWxsKSB7XG4gICAgICAgIGNvbGxlY3Rpb24uZmlyZXdhbGwoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICB9XG5cbiAgICBmaWx0ZXJzID0gY2xlYW5VbmRlZmluZWRMZWFmcyhmaWx0ZXJzKTtcblxuICAgIHBpcGVsaW5lLnB1c2goeyRtYXRjaDogZmlsdGVyc30pO1xuXG4gICAgaWYgKG9wdGlvbnMuc29ydCAmJiBfLmtleXMob3B0aW9ucy5zb3J0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goeyRzb3J0OiBvcHRpb25zLnNvcnR9KVxuICAgIH1cblxuICAgIGxldCBfaWQgPSBsaW5rU3RvcmFnZUZpZWxkO1xuICAgIGlmIChsaW5rZXIuaXNNZXRhKCkpIHtcbiAgICAgICAgX2lkICs9ICcuX2lkJztcbiAgICB9XG5cbiAgICBsZXQgZGF0YVB1c2ggPSB7XG4gICAgICAgIF9pZDogJyRfaWQnXG4gICAgfTtcblxuICAgIF8uZWFjaChvcHRpb25zLmZpZWxkcywgKHZhbHVlLCBmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignLicpID49IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5zRG90dGVkRmllbGRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzYWZlRmllbGQgPSBmaWVsZC5yZXBsYWNlKC9cXC4vZywgU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQpO1xuICAgICAgICBkYXRhUHVzaFtzYWZlRmllbGRdID0gJyQnICsgZmllbGRcbiAgICB9KTtcblxuICAgIGlmIChsaW5rZXIuaXNNZXRhKCkpIHtcbiAgICAgICAgZGF0YVB1c2hbbGlua1N0b3JhZ2VGaWVsZF0gPSAnJCcgKyBsaW5rU3RvcmFnZUZpZWxkO1xuICAgIH1cblxuICAgIHBpcGVsaW5lLnB1c2goe1xuICAgICAgICAkZ3JvdXA6IHtcbiAgICAgICAgICAgIF9pZDogXCIkXCIgKyBfaWQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHB1c2g6IGRhdGFQdXNoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChvcHRpb25zLmxpbWl0IHx8IG9wdGlvbnMuc2tpcCkge1xuICAgICAgICBsZXQgJHNsaWNlID0gW1wiJGRhdGFcIl07XG4gICAgICAgIGlmIChvcHRpb25zLnNraXApICRzbGljZS5wdXNoKG9wdGlvbnMuc2tpcCk7XG4gICAgICAgIGlmIChvcHRpb25zLmxpbWl0KSAkc2xpY2UucHVzaChvcHRpb25zLmxpbWl0KTtcblxuICAgICAgICBwaXBlbGluZS5wdXNoKHtcbiAgICAgICAgICAgICRwcm9qZWN0OiB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIGRhdGE6IHskc2xpY2V9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYW5VbmRlZmluZWRMZWFmcyh0cmVlKSB7XG4gICAgICAgIGNvbnN0IGEgPSBPYmplY3QuYXNzaWduKHt9LCB0cmVlKTtcbiAgICAgICAgXy5lYWNoKGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBhW2tleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghXy5pc0FycmF5KHZhbHVlKSAmJiBfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGFba2V5XSA9IGNsZWFuVW5kZWZpbmVkTGVhZnModmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBhO1xuICAgIH1cblxuICAgIHJldHVybiB7cGlwZWxpbmUsIGNvbnRhaW5zRG90dGVkRmllbGRzfTtcbn0iLCJleHBvcnQgY29uc3QgU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQgPSAnX19fJzsiLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuLi9saWIvYXBwbHlQcm9wcy5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvckRlbGl2ZXJ5IGZyb20gJy4uL2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMnO1xuaW1wb3J0IHN0b3JlSHlwZXJub3ZhUmVzdWx0cyBmcm9tICcuL3N0b3JlSHlwZXJub3ZhUmVzdWx0cy5qcyc7XG5cbmZ1bmN0aW9uIGh5cGVybm92YShjb2xsZWN0aW9uTm9kZSwgdXNlcklkKSB7XG4gICAgXy5lYWNoKGNvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25Ob2RlcywgY2hpbGRDb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKGNoaWxkQ29sbGVjdGlvbk5vZGUpO1xuXG4gICAgICAgIHN0b3JlSHlwZXJub3ZhUmVzdWx0cyhjaGlsZENvbGxlY3Rpb25Ob2RlLCB1c2VySWQpO1xuICAgICAgICBoeXBlcm5vdmEoY2hpbGRDb2xsZWN0aW9uTm9kZSwgdXNlcklkKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHlwZXJub3ZhSW5pdChjb2xsZWN0aW9uTm9kZSwgdXNlcklkLCBjb25maWcgPSB7fSkge1xuICAgIGNvbnN0IGJ5cGFzc0ZpcmV3YWxscyA9IGNvbmZpZy5ieXBhc3NGaXJld2FsbHMgfHwgZmFsc2U7XG4gICAgY29uc3QgcGFyYW1zID0gY29uZmlnLnBhcmFtcyB8fCB7fTtcblxuICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKGNvbGxlY3Rpb25Ob2RlKTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG4gICAgY29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IGNvbGxlY3Rpb24uZmluZChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpLmZldGNoKCk7XG5cbiAgICBjb25zdCB1c2VySWRUb1Bhc3MgPSAoY29uZmlnLmJ5cGFzc0ZpcmV3YWxscykgPyB1bmRlZmluZWQgOiB1c2VySWQ7XG4gICAgaHlwZXJub3ZhKGNvbGxlY3Rpb25Ob2RlLCB1c2VySWRUb1Bhc3MpO1xuXG4gICAgcHJlcGFyZUZvckRlbGl2ZXJ5KGNvbGxlY3Rpb25Ob2RlLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHM7XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuLi9saWIvYXBwbHlQcm9wcy5qcyc7XG5pbXBvcnQgQWdncmVnYXRlRmlsdGVycyBmcm9tICcuL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMnO1xuaW1wb3J0IGFzc2VtYmxlIGZyb20gJy4vYXNzZW1ibGVyLmpzJztcbmltcG9ydCBhc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMgZnJvbSAnLi9hc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMuanMnO1xuaW1wb3J0IGJ1aWxkQWdncmVnYXRlUGlwZWxpbmUgZnJvbSAnLi9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzJztcbmltcG9ydCBzbmFwQmFja0RvdHRlZEZpZWxkcyBmcm9tICcuL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0b3JlSHlwZXJub3ZhUmVzdWx0cyhjaGlsZENvbGxlY3Rpb25Ob2RlLCB1c2VySWQpIHtcbiAgICBpZiAoY2hpbGRDb2xsZWN0aW9uTm9kZS5wYXJlbnQucmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIChjaGlsZENvbGxlY3Rpb25Ob2RlLnJlc3VsdHMgPSBbXSk7XG4gICAgfVxuXG4gICAgbGV0IHsgZmlsdGVycywgb3B0aW9ucyB9ID0gYXBwbHlQcm9wcyhjaGlsZENvbGxlY3Rpb25Ob2RlKTtcblxuICAgIGNvbnN0IG1ldGFGaWx0ZXJzID0gZmlsdGVycy4kbWV0YTtcbiAgICBjb25zdCBhZ2dyZWdhdGVGaWx0ZXJzID0gbmV3IEFnZ3JlZ2F0ZUZpbHRlcnMoXG4gICAgICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUsXG4gICAgICAgIG1ldGFGaWx0ZXJzXG4gICAgKTtcbiAgICBkZWxldGUgZmlsdGVycy4kbWV0YTtcblxuICAgIGNvbnN0IGxpbmtlciA9IGNoaWxkQ29sbGVjdGlvbk5vZGUubGlua2VyO1xuICAgIGNvbnN0IGlzVmlydHVhbCA9IGxpbmtlci5pc1ZpcnR1YWwoKTtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG5cbiAgICBfLmV4dGVuZChmaWx0ZXJzLCBhZ2dyZWdhdGVGaWx0ZXJzLmNyZWF0ZSgpKTtcblxuICAgIC8vIGlmIGl0J3Mgbm90IHZpcnR1YWwgdGhlbiB3ZSByZXRyaWV2ZSB0aGVtIGFuZCBhc3NlbWJsZSB0aGVtIGhlcmUuXG4gICAgaWYgKCFpc1ZpcnR1YWwpIHtcbiAgICAgICAgY29uc3QgZmlsdGVyZWRPcHRpb25zID0gXy5vbWl0KG9wdGlvbnMsICdsaW1pdCcpO1xuXG4gICAgICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IGNvbGxlY3Rpb25cbiAgICAgICAgICAgIC5maW5kKGZpbHRlcnMsIGZpbHRlcmVkT3B0aW9ucywgdXNlcklkKVxuICAgICAgICAgICAgLmZldGNoKCk7XG5cbiAgICAgICAgYXNzZW1ibGUoY2hpbGRDb2xsZWN0aW9uTm9kZSwge1xuICAgICAgICAgICAgLi4ub3B0aW9ucyxcbiAgICAgICAgICAgIG1ldGFGaWx0ZXJzLFxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB2aXJ0dWFscyBhcnJpdmUgaGVyZVxuICAgICAgICBsZXQgeyBwaXBlbGluZSwgY29udGFpbnNEb3R0ZWRGaWVsZHMgfSA9IGJ1aWxkQWdncmVnYXRlUGlwZWxpbmUoXG4gICAgICAgICAgICBjaGlsZENvbGxlY3Rpb25Ob2RlLFxuICAgICAgICAgICAgZmlsdGVycyxcbiAgICAgICAgICAgIG9wdGlvbnMsXG4gICAgICAgICAgICB1c2VySWRcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgYWdncmVnYXRlUmVzdWx0cyA9IGNvbGxlY3Rpb24uYWdncmVnYXRlKHBpcGVsaW5lKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgaW4gYWdncmVnYXRpb24gaXQgY29udGFpbnMgJy4nLCB3ZSByZXBsYWNlIGl0IHdpdGggYSBjdXN0b20gc3RyaW5nICdfX18nXG4gICAgICAgICAqIEFuZCB0aGVuIGFmdGVyIGFnZ3JlZ2F0aW9uIGlzIGNvbXBsZXRlIHdlIG5lZWQgdG8gc25hcC1pdCBiYWNrIHRvIGhvdyBpdCB3YXMuXG4gICAgICAgICAqL1xuICAgICAgICBpZiAoY29udGFpbnNEb3R0ZWRGaWVsZHMpIHtcbiAgICAgICAgICAgIHNuYXBCYWNrRG90dGVkRmllbGRzKGFnZ3JlZ2F0ZVJlc3VsdHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzKFxuICAgICAgICAgICAgY2hpbGRDb2xsZWN0aW9uTm9kZSxcbiAgICAgICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdHMsXG4gICAgICAgICAgICBtZXRhRmlsdGVyc1xuICAgICAgICApO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvYmplY3QsIGZpZWxkLCBtZXRhRmlsdGVyc1Rlc3QpIHtcbiAgICBpZiAob2JqZWN0W2ZpZWxkXSkge1xuICAgICAgICBpZiAoXy5pc0FycmF5KG9iamVjdFtmaWVsZF0pKSB7XG4gICAgICAgICAgICBvYmplY3RbZmllbGRdID0gb2JqZWN0W2ZpZWxkXS5maWx0ZXIobWV0YUZpbHRlcnNUZXN0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFtZXRhRmlsdGVyc1Rlc3Qob2JqZWN0W2ZpZWxkXSkpIHtcbiAgICAgICAgICAgICAgICBvYmplY3RbZmllbGRdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQge1NBRkVfRE9UVEVEX0ZJRUxEX1JFUExBQ0VNRU5UfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFnZ3JlZ2F0aW9uUmVzdWx0KSB7XG4gICAgYWdncmVnYXRpb25SZXN1bHQuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICByZXN1bHQuZGF0YSA9IHJlc3VsdC5kYXRhLm1hcChkb2N1bWVudCA9PiB7XG4gICAgICAgICAgICBfLmVhY2goZG9jdW1lbnQsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGtleS5pbmRleE9mKFNBRkVfRE9UVEVEX0ZJRUxEX1JFUExBQ0VNRU5UKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50W2tleS5yZXBsYWNlKG5ldyBSZWdFeHAoU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQsICdnJyksICcuJyldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkb2N1bWVudFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZG90Lm9iamVjdChkb2N1bWVudCk7XG4gICAgICAgIH0pXG4gICAgfSlcbn0iLCJjb25zdCByZXN0cmljdE9wdGlvbnMgPSBbXG4gICAgJ2Rpc2FibGVPcGxvZycsXG4gICAgJ3BvbGxpbmdJbnRlcnZhbE1zJyxcbiAgICAncG9sbGluZ1Rocm90dGxlTXMnXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcHBseVByb3BzKG5vZGUpIHtcbiAgICBsZXQgZmlsdGVycyA9IE9iamVjdC5hc3NpZ24oe30sIG5vZGUucHJvcHMuJGZpbHRlcnMpO1xuICAgIGxldCBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZS5wcm9wcy4kb3B0aW9ucyk7XG5cbiAgICBvcHRpb25zID0gXy5vbWl0KG9wdGlvbnMsIC4uLnJlc3RyaWN0T3B0aW9ucyk7XG4gICAgb3B0aW9ucy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcyB8fCB7fTtcblxuICAgIG5vZGUuYXBwbHlGaWVsZHMoZmlsdGVycywgb3B0aW9ucyk7XG4gICAgXG4gICAgcmV0dXJuIHtmaWx0ZXJzLCBvcHRpb25zfTtcbn1cbiIsImV4cG9ydCBkZWZhdWx0IChtZXRob2QsIG15UGFyYW1ldGVycykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIE1ldGVvci5jYWxsKG1ldGhvZCwgbXlQYXJhbWV0ZXJzLCAoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHJlamVjdChlcnIucmVhc29uIHx8ICdTb21ldGhpbmcgd2VudCB3cm9uZy4nKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShyZXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07IiwiaW1wb3J0IENvbGxlY3Rpb25Ob2RlIGZyb20gJy4uL25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzJztcbmltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi4vbm9kZXMvZmllbGROb2RlLmpzJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuLi9ub2Rlcy9yZWR1Y2VyTm9kZS5qcyc7XG5pbXBvcnQgZG90aXplIGZyb20gJy4vZG90aXplLmpzJztcbmltcG9ydCBjcmVhdGVSZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMnO1xuXG5leHBvcnQgY29uc3Qgc3BlY2lhbEZpZWxkcyA9IFtcbiAgICAnJGZpbHRlcnMnLFxuICAgICckb3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVycycsXG4gICAgJyRwb3N0T3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVyJ1xuXTtcblxuLyoqXG4gKiBDcmVhdGVzIG5vZGUgb2JqZWN0cyBmcm9tIHRoZSBib2R5LiBUaGUgcm9vdCBpcyBhbHdheXMgYSBjb2xsZWN0aW9uIG5vZGUuXG4gKlxuICogQHBhcmFtIHJvb3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVzKHJvb3QpIHtcbiAgICAvLyB0aGlzIGlzIGEgZml4IGZvciBwaGFudG9tanMgdGVzdHMgKGRvbid0IHJlYWxseSB1bmRlcnN0YW5kIGl0LilcbiAgICBpZiAoIV8uaXNPYmplY3Qocm9vdC5ib2R5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgXy5lYWNoKHJvb3QuYm9keSwgKGJvZHksIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGl0J3MgYSBwcm9wXG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHNwZWNpYWxGaWVsZHMsIGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIHJvb3QuYWRkUHJvcChmaWVsZE5hbWUsIGJvZHkpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3b3JrYXJvdW5kLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBUT0RPOiBmaW5kIGFub3RoZXIgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgaWYgKHJvb3QuY29sbGVjdGlvbi5kZWZhdWx0KSB7XG4gICAgICAgICAgcm9vdC5jb2xsZWN0aW9uID0gcm9vdC5jb2xsZWN0aW9uLmRlZmF1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja2luZyBpZiBpdCBpcyBhIGxpbmsuXG4gICAgICAgIGxldCBsaW5rZXIgPSByb290LmNvbGxlY3Rpb24uZ2V0TGlua2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgaXMgYSBjYWNoZWQgbGlua1xuICAgICAgICAgICAgLy8gaWYgeWVzLCB0aGVuIHdlIG5lZWQgdG8gZXhwbGljaXRseSBkZWZpbmUgdGhpcyBhdCBjb2xsZWN0aW9uIGxldmVsXG4gICAgICAgICAgICAvLyBzbyB3aGVuIHdlIHRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgZGVsaXZlcnksIHdlIG1vdmUgaXQgdG8gdGhlIGxpbmsgbmFtZVxuICAgICAgICAgICAgaWYgKGxpbmtlci5pc0Rlbm9ybWFsaXplZCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHN1YnJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUobGlua2VyLmdldExpbmtlZENvbGxlY3Rpb24oKSwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgIC8vIG11c3QgYmUgYmVmb3JlIGFkZGluZyBsaW5rZXIgYmVjYXVzZSBfc2hvdWxkQ2xlYW5TdG9yYWdlIG1ldGhvZFxuICAgICAgICAgICAgY3JlYXRlTm9kZXMoc3Vicm9vdCk7XG4gICAgICAgICAgICByb290LmFkZChzdWJyb290LCBsaW5rZXIpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja2luZyBpZiBpdCdzIGEgcmVkdWNlclxuICAgICAgICBjb25zdCByZWR1Y2VyID0gcm9vdC5jb2xsZWN0aW9uLmdldFJlZHVjZXIoZmllbGROYW1lKTtcblxuICAgICAgICBpZiAocmVkdWNlcikge1xuICAgICAgICAgICAgbGV0IHJlZHVjZXJOb2RlID0gbmV3IFJlZHVjZXJOb2RlKGZpZWxkTmFtZSwgcmVkdWNlcik7XG4gICAgICAgICAgICByb290LmFkZChyZWR1Y2VyTm9kZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpdCdzIG1vc3QgbGlrZWx5IGEgZmllbGQgdGhlblxuICAgICAgICBhZGRGaWVsZE5vZGUoYm9keSwgZmllbGROYW1lLCByb290KTtcbiAgICB9KTtcblxuICAgIGNyZWF0ZVJlZHVjZXJzKHJvb3QpO1xuXG4gICAgaWYgKHJvb3QuZmllbGROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcm9vdC5hZGQobmV3IEZpZWxkTm9kZSgnX2lkJywgMSkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNQcm9qZWN0aW9uT3BlcmF0b3JFeHByZXNzaW9uKGJvZHkpIHtcbiAgICBpZiAoXy5pc09iamVjdChib2R5KSkge1xuICAgICAgICBjb25zdCBrZXlzID0gXy5rZXlzKGJvZHkpO1xuICAgICAgICByZXR1cm4ga2V5cy5sZW5ndGggPT09IDEgJiYgXy5jb250YWlucyhbJyRlbGVtTWF0Y2gnLCAnJG1ldGEnLCAnJHNsaWNlJ10sIGtleXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaWVsZE5vZGUoYm9keSwgZmllbGROYW1lLCByb290KSB7XG4gICAgLy8gaXQncyBub3QgYSBsaW5rIGFuZCBub3QgYSBzcGVjaWFsIHZhcmlhYmxlID0+IHdlIGFzc3VtZSBpdCdzIGEgZmllbGRcbiAgICBpZiAoXy5pc09iamVjdChib2R5KSkge1xuICAgICAgICBpZiAoIWlzUHJvamVjdGlvbk9wZXJhdG9yRXhwcmVzc2lvbihib2R5KSkge1xuICAgICAgICAgICAgbGV0IGRvdHRlZCA9IGRvdGl6ZS5jb252ZXJ0KHtbZmllbGROYW1lXTogYm9keX0pO1xuICAgICAgICAgICAgXy5lYWNoKGRvdHRlZCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICByb290LmFkZChuZXcgRmllbGROb2RlKGtleSwgdmFsdWUpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcm9vdC5hZGQobmV3IEZpZWxkTm9kZShmaWVsZE5hbWUsIGJvZHksIHRydWUpKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBmaWVsZE5vZGUgPSBuZXcgRmllbGROb2RlKGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIHJvb3QuYWRkKGZpZWxkTm9kZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgbmFtZXNwYWNlIGZvciBub2RlIHdoZW4gdXNpbmcgcXVlcnkgcGF0aCBzY29waW5nLlxuICpcbiAqIEBwYXJhbSBub2RlXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZU5hbWVzcGFjZShub2RlKSB7XG4gICAgY29uc3QgcGFydHMgPSBbXTtcbiAgICBsZXQgbiA9IG5vZGU7XG4gICAgd2hpbGUgKG4pIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IG4ubGlua2VyID8gbi5saW5rZXIubGlua05hbWUgOiBuLmNvbGxlY3Rpb24uX25hbWU7XG4gICAgICAgIHBhcnRzLnB1c2gobmFtZSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsaW5rZXInLCBub2RlLmxpbmtlciA/IG5vZGUubGlua2VyLmxpbmtOYW1lIDogbm9kZS5jb2xsZWN0aW9uLl9uYW1lKTtcbiAgICAgICAgbiA9IG4ucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gcGFydHMucmV2ZXJzZSgpLmpvaW4oJ18nKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gY29sbGVjdGlvblxuICogQHBhcmFtIGJvZHlcbiAqIEByZXR1cm5zIHtDb2xsZWN0aW9uTm9kZX1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNvbGxlY3Rpb24sIGJvZHkpIHtcbiAgICBsZXQgcm9vdCA9IG5ldyBDb2xsZWN0aW9uTm9kZShjb2xsZWN0aW9uLCBib2R5KTtcbiAgICBjcmVhdGVOb2Rlcyhyb290KTtcblxuICAgIHJldHVybiByb290O1xufTtcblxuLyoqXG4gKiBBZHMgZGVub3JtYWxpemF0aW9uIGNvbmZpZyBwcm9wZXJseSwgaW5jbHVkaW5nIF9pZFxuICpcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gbGlua2VyXG4gKiBAcGFyYW0gYm9keVxuICogQHBhcmFtIGZpZWxkTmFtZVxuICovXG5mdW5jdGlvbiBoYW5kbGVEZW5vcm1hbGl6ZWQocm9vdCwgbGlua2VyLCBib2R5LCBmaWVsZE5hbWUpIHtcbiAgICBPYmplY3QuYXNzaWduKGJvZHksIHtfaWQ6IDF9KTtcblxuICAgIGNvbnN0IGNhY2hlRmllbGQgPSBsaW5rZXIubGlua0NvbmZpZy5kZW5vcm1hbGl6ZS5maWVsZDtcbiAgICByb290LnNuYXBDYWNoZShjYWNoZUZpZWxkLCBmaWVsZE5hbWUpO1xuXG4gICAgLy8gaWYgaXQncyBvbmUgYW5kIGRpcmVjdCBhbHNvIGluY2x1ZGUgdGhlIGxpbmsgc3RvcmFnZVxuICAgIGlmICghbGlua2VyLmlzTWFueSgpICYmICFsaW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgYWRkRmllbGROb2RlKDEsIGxpbmtlci5saW5rU3RvcmFnZUZpZWxkLCByb290KTtcbiAgICB9XG5cbiAgICBhZGRGaWVsZE5vZGUoYm9keSwgY2FjaGVGaWVsZCwgcm9vdCk7XG59IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3ZhcmRhcnMvZG90aXplXG5leHBvcnQgZGVmYXVsdCBkb3RpemUgPSB7fTtcblxuZG90aXplLmNvbnZlcnQgPSBmdW5jdGlvbihvYmosIHByZWZpeCkge1xuICAgIGlmICgoIW9iaiB8fCB0eXBlb2Ygb2JqICE9IFwib2JqZWN0XCIpICYmICFBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKHByZWZpeCkge1xuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHt9O1xuICAgICAgICAgICAgbmV3T2JqW3ByZWZpeF0gPSBvYmo7XG4gICAgICAgICAgICByZXR1cm4gbmV3T2JqO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHZhciBuZXdPYmogPSB7fTtcblxuICAgIGZ1bmN0aW9uIHJlY3Vyc2UobywgcCwgaXNBcnJheUl0ZW0pIHtcbiAgICAgICAgZm9yICh2YXIgZiBpbiBvKSB7XG4gICAgICAgICAgICBpZiAob1tmXSAmJiB0eXBlb2Ygb1tmXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5QXJyYXkob1tmXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gZW1wdHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHJlY3Vyc2Uob1tmXSwgZ2V0RmllbGROYW1lKGYsIHAsIGZhbHNlLCB0cnVlKSwgdHJ1ZSk7IC8vIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5T2JqKG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2dldEZpZWxkTmFtZShmLCBwLCB0cnVlKV0gPSBvW2ZdOyAvLyBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gcmVjdXJzZShvW2ZdLCBnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSkpOyAvLyBhcnJheSBpdGVtIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzRW1wdHlPYmoob1tmXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHApXSA9IG9bZl07IC8vIGVtcHR5IG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSByZWN1cnNlKG9bZl0sIGdldEZpZWxkTmFtZShmLCBwKSk7IC8vIG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheUl0ZW0gfHwgaXNOdW1iZXIoZikpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2dldEZpZWxkTmFtZShmLCBwLCB0cnVlKV0gPSBvW2ZdOyAvLyBhcnJheSBpdGVtIHByaW1pdGl2ZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCldID0gb1tmXTsgLy8gcHJpbWl0aXZlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRW1wdHlPYmoobmV3T2JqKSlcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG5cbiAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc051bWJlcihmKSB7XG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VJbnQoZikpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzRW1wdHlPYmoob2JqKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VtcHR5QXJyYXkobykge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvKSAmJiBvLmxlbmd0aCA9PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRGaWVsZE5hbWUoZmllbGQsIHByZWZpeCwgaXNBcnJheUl0ZW0sIGlzQXJyYXkpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkpXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6IFwiXCIpICsgKGlzTnVtYmVyKGZpZWxkKSA/IFwiW1wiICsgZmllbGQgKyBcIl1cIiA6IFwiLlwiICsgZmllbGQpO1xuICAgICAgICBlbHNlIGlmIChpc0FycmF5SXRlbSlcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4IDogXCJcIikgKyBcIltcIiArIGZpZWxkICsgXCJdXCI7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiAocHJlZml4ID8gcHJlZml4ICsgXCIuXCIgOiBcIlwiKSArIGZpZWxkO1xuICAgIH1cblxuICAgIHJldHVybiByZWN1cnNlKG9iaiwgcHJlZml4LCBBcnJheS5pc0FycmF5KG9iaikpO1xufTsiLCIvKipcbiAqIEhlbHBlciBtZXRob2Qgd2hpY2ggZXhwYW5kcyBwcm9maWxlLnBob25lLnZlcmlmaWVkIGludG9cbiAqIFsncHJvZmlsZScsICdwcm9maWxlLnBob25lJywgJ3Byb2ZpbGUucGhvbmUudmVyaWZpZWQnXVxuICogQHBhcmFtIGZpZWxkTmFtZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kRmllbGQoZmllbGROYW1lKSB7XG4gICAgY29uc3QgcGFydHMgPSBmaWVsZE5hbWUuc3BsaXQoJy4nKTtcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0LnB1c2gocGFydHMuc2xpY2UoMCwgaSArIDEpLmpvaW4oJy4nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmllbGRJblByb2plY3Rpb24ocHJvamVjdGlvbiwgZmllbGROYW1lLCBjaGVja05lc3RlZCkge1xuICAgIC8vIGZvciBjaGVja05lc3RlZCBmbGFnIGV4cGFuZCB0aGUgZmllbGRcbiAgICBjb25zdCBmaWVsZHMgPSBjaGVja05lc3RlZCA/IGV4cGFuZEZpZWxkKGZpZWxkTmFtZSkgOiBbZmllbGROYW1lXTtcbiAgICByZXR1cm4gZmllbGRzLnNvbWUoZmllbGQgPT4gcHJvamVjdGlvbltmaWVsZF0pO1xufVxuIiwiaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQge3NwZWNpYWxGaWVsZHN9IGZyb20gJy4vY3JlYXRlR3JhcGgnO1xuXG5jb25zdCBFWFRFTkRFRF9TUEVDSUFMX0ZJRUxEUyA9IFsuLi5zcGVjaWFsRmllbGRzLCAnJGZpbHRlcicsICckcGFnaW5hdGUnXTtcblxuZnVuY3Rpb24gaXNDbGllbnRWYWx1ZVZhbGlkKHZhbHVlKSB7XG4gICAgaWYgKF8uaXNPYmplY3QodmFsdWUpICYmICFfLmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBfLnZhbHVlcyh2YWx1ZSkuZXZlcnkobmVzdGVkVmFsdWUgPT4gaXNDbGllbnRWYWx1ZVZhbGlkKG5lc3RlZFZhbHVlKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlID09PSAxKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogXG4gKiBSZWN1cnNpdmUgZnVuY3Rpb24gd2hpY2ggaW50ZXJzZWN0cyB0aGUgZmllbGRzIG9mIHRoZSBib2R5IG9iamVjdHMuXG4gKiBcbiAqIEBwYXJhbSB7b2JqZWN0fSBhbGxvd2VkIGFsbG93ZWQgYm9keSBvYmplY3QgLSBpbnRlcnNlY3Rpb24gY2FuIG9ubHkgYmUgYSBzdWJzZXQgb2YgaXRcbiAqIEBwYXJhbSB7b2JqZWN0fSBjbGllbnQgY2xpZW50IGJvZHkgLSBjYW4gc2hyaW5rIG1haW4gYm9keSwgYnV0IG5vdCBleHBhbmRcbiAqL1xuZnVuY3Rpb24gaW50ZXJzZWN0RmllbGRzKGFsbG93ZWQsIGNsaWVudCkge1xuICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IHt9O1xuICAgIF8ucGFpcnMoY2xpZW50KS5mb3JFYWNoKChbZmllbGQsIGNsaWVudFZhbHVlXSkgPT4ge1xuICAgICAgICBpZiAoXy5jb250YWlucyhFWFRFTkRFRF9TUEVDSUFMX0ZJRUxEUywgZmllbGQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZXJ2ZXJWYWx1ZSA9IGFsbG93ZWRbZmllbGRdO1xuICAgICAgICBpZiAoc2VydmVyVmFsdWUgPT09IDEpIHsgLy8gc2VydmVyIGFsbG93cyBldmVyeXRoaW5nXG4gICAgICAgICAgICBpZiAoaXNDbGllbnRWYWx1ZVZhbGlkKGNsaWVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbltmaWVsZF0gPSBjbGllbnRWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChfLmlzT2JqZWN0KHNlcnZlclZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoY2xpZW50VmFsdWUpICYmICFfLmlzQXJyYXkoY2xpZW50VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uW2ZpZWxkXSA9IGludGVyc2VjdEZpZWxkcyhzZXJ2ZXJWYWx1ZSwgY2xpZW50VmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2xpZW50VmFsdWUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBjbGllbnQgd2FudHMgZXZlcnl0aGluZywgc2VydmVyVmFsdWUgaXMgbW9yZSByZXN0cmljdGl2ZSBoZXJlXG4gICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uW2ZpZWxkXSA9IHNlcnZlclZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGludGVyc2VjdGlvbjtcbn1cblxuLyoqXG4gKiBHaXZlbiBhIG5hbWVkIHF1ZXJ5IHRoYXQgaGFzIGEgc3BlY2lmaWMgYm9keSwgeW91IGNhbiBxdWVyeSBpdHMgc3ViYm9keVxuICogVGhpcyBwZXJmb3JtcyBhbiBpbnRlcnNlY3Rpb24gb2YgdGhlIGJvZGllcyBhbGxvd2VkIGluIGVhY2hcbiAqXG4gKiBAcGFyYW0gYWxsb3dlZEJvZHlcbiAqIEBwYXJhbSBjbGllbnRCb2R5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChhbGxvd2VkQm9keSwgY2xpZW50Qm9keSkge1xuICAgIGNvbnN0IGJ1aWxkID0gaW50ZXJzZWN0RmllbGRzKGFsbG93ZWRCb2R5LCBjbGllbnRCb2R5KTtcbiAgICAvLyBBZGQgYmFjayBzcGVjaWFsIGZpZWxkcyB0byB0aGUgbmV3IGJvZHlcbiAgICBPYmplY3QuYXNzaWduKGJ1aWxkLCBfLnBpY2soYWxsb3dlZEJvZHksIC4uLkVYVEVOREVEX1NQRUNJQUxfRklFTERTKSk7XG4gICAgcmV0dXJuIGJ1aWxkO1xufVxuIiwiLy8gMS4gQ2xvbmUgY2hpbGRyZW4gd2l0aCBtZXRhIHJlbGF0aW9uc2hpcHNcbi8vIDIuIEFwcGx5ICRtZXRhZGF0YSB0byBjaGlsZHJlblxuLy8gMy4gUmVtb3ZlcyBsaW5rIHN0b3JhZ2UgKGlmIG5vdCBzcGVjaWZpZWQpXG4vLyA0LiBTdG9yZXMgb25lUmVzdWx0IGxpbmtzIGFzIGEgc2luZ2xlIG9iamVjdCBpbnN0ZWFkIG9mIGFycmF5XG5pbXBvcnQgYXBwbHlSZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycyc7XG5pbXBvcnQgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzIGZyb20gJy4uL3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMnO1xuaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuaW1wb3J0IHtNaW5pbW9uZ299IGZyb20gJ21ldGVvci9taW5pbW9uZ28nO1xuXG5leHBvcnQgZGVmYXVsdCAobm9kZSwgcGFyYW1zKSA9PiB7XG4gICAgc25hcEJhY2tDYWNoZXMobm9kZSk7XG4gICAgc3RvcmVPbmVSZXN1bHRzKG5vZGUsIG5vZGUucmVzdWx0cyk7XG5cbiAgICBhcHBseVJlZHVjZXJzKG5vZGUsIHBhcmFtcyk7XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgY2xvbmVNZXRhQ2hpbGRyZW4oY29sbGVjdGlvbk5vZGUsIG5vZGUucmVzdWx0cylcbiAgICB9KTtcblxuICAgIF8uZWFjaChub2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBhc3NlbWJsZU1ldGFkYXRhKGNvbGxlY3Rpb25Ob2RlLCBub2RlLnJlc3VsdHMpXG4gICAgfSk7XG5cbiAgICBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMobm9kZSwgbm9kZS5yZXN1bHRzKTtcblxuICAgIHJlbW92ZUxpbmtTdG9yYWdlcyhub2RlLCBub2RlLnJlc3VsdHMpO1xuXG4gICAgYXBwbHlQb3N0RmlsdGVycyhub2RlKTtcbiAgICBhcHBseVBvc3RPcHRpb25zKG5vZGUpO1xuICAgIGFwcGx5UG9zdEZpbHRlcihub2RlLCBwYXJhbXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQb3N0RmlsdGVycyhub2RlKSB7XG4gICAgY29uc3QgcG9zdEZpbHRlcnMgPSBub2RlLnByb3BzLiRwb3N0RmlsdGVycztcbiAgICBpZiAocG9zdEZpbHRlcnMpIHtcbiAgICAgICAgbm9kZS5yZXN1bHRzID0gc2lmdChwb3N0RmlsdGVycywgbm9kZS5yZXN1bHRzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBvc3RPcHRpb25zKG5vZGUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gbm9kZS5wcm9wcy4kcG9zdE9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICAgICAgY29uc3Qgc29ydGVyID0gbmV3IE1pbmltb25nby5Tb3J0ZXIob3B0aW9ucy5zb3J0KTtcbiAgICAgICAgICAgIG5vZGUucmVzdWx0cy5zb3J0KHNvcnRlci5nZXRDb21wYXJhdG9yKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmxpbWl0IHx8IG9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBvcHRpb25zLnNraXAgfHwgMDtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IG9wdGlvbnMubGltaXQgPyBvcHRpb25zLmxpbWl0ICsgc3RhcnQgOiBub2RlLnJlc3VsdHMubGVuZ3RoO1xuICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gbm9kZS5yZXN1bHRzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qKlxuICogT3B0aW9uYWxseSBhcHBsaWVzIGEgcG9zdCBmaWx0ZXJpbmcgb3B0aW9uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5UG9zdEZpbHRlcihub2RlLCBwYXJhbXMpIHtcbiAgICBpZiAobm9kZS5wcm9wcy4kcG9zdEZpbHRlcikge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBub2RlLnByb3BzLiRwb3N0RmlsdGVyO1xuXG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgICAgZmlsdGVyLmZvckVhY2goZiA9PiB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gZihub2RlLnJlc3VsdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gZmlsdGVyKG5vZGUucmVzdWx0cywgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLyoqXG4gKlxuICogSGVscGVyIGZ1bmN0aW9uIHdoaWNoIHRyYW5zZm9ybXMgcmVzdWx0cyBpbnRvIHRoZSBhcnJheS5cbiAqIFJlc3VsdHMgYXJlIGFuIG9iamVjdCBmb3IgJ29uZScgbGlua3MuXG4gKlxuICogQHBhcmFtIHJlc3VsdHNcbiAqIEByZXR1cm4gYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc3VsdHNBcnJheShyZXN1bHRzKSB7XG4gICAgaWYgKF8uaXNBcnJheShyZXN1bHRzKSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0cztcbiAgICB9XG4gICAgZWxzZSBpZiAoXy5pc1VuZGVmaW5lZChyZXN1bHRzKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBbcmVzdWx0c107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVMaW5rU3RvcmFnZXMobm9kZSwgc2FtZUxldmVsUmVzdWx0cykge1xuICAgIGlmICghc2FtZUxldmVsUmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2FtZUxldmVsUmVzdWx0cyA9IGdldFJlc3VsdHNBcnJheShzYW1lTGV2ZWxSZXN1bHRzKTtcblxuICAgIF8uZWFjaChub2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBjb25zdCByZW1vdmVTdG9yYWdlRmllbGQgPSBjb2xsZWN0aW9uTm9kZS5zaG91bGRDbGVhblN0b3JhZ2U7XG4gICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKHJlbW92ZVN0b3JhZ2VGaWVsZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzU2luZ2xlID0gY29sbGVjdGlvbk5vZGUubGlua2VyLmlzU2luZ2xlKCk7XG4gICAgICAgICAgICAgICAgY29uc3QgW3Jvb3QsIC4uLm5lc3RlZF0gPSBjb2xsZWN0aW9uTm9kZS5saW5rU3RvcmFnZUZpZWxkLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZW1vdmVGcm9tUmVzdWx0ID0gKHJlc3VsdCwgcmVtb3ZlRW1wdHlSb290ID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzU2luZ2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkb3QucGljayhjb2xsZWN0aW9uTm9kZS5saW5rU3RvcmFnZUZpZWxkLCByZXN1bHQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZUVtcHR5Um9vdCAmJiBuZXN0ZWQubGVuZ3RoID4gMCAmJiBfLmlzRW1wdHkocmVzdWx0W3Jvb3RdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbcm9vdF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmVzdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhcnIgPSByZXN1bHRbcm9vdF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNBcnJheShhcnIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyci5mb3JFYWNoKG9iaiA9PiBkb3QucGljayhuZXN0ZWQuam9pbignLicpLCBvYmosIHRydWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlbW92ZUVtcHR5Um9vdCAmJiBuZXN0ZWQubGVuZ3RoID4gMCAmJiBhcnIuZXZlcnkob2JqID0+IF8uaXNFbXB0eShvYmopKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtyb290XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua1N0b3JhZ2VGaWVsZF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb25Ob2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjaGlsZFJlc3VsdHMgPSBnZXRSZXN1bHRzQXJyYXkocmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChjaGlsZFJlc3VsdHMsIGNoaWxkUmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21SZXN1bHQoY2hpbGRSZXN1bHQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tUmVzdWx0KHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW1vdmVMaW5rU3RvcmFnZXMoY29sbGVjdGlvbk5vZGUsIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yZU9uZVJlc3VsdHMobm9kZSwgc2FtZUxldmVsUmVzdWx0cykge1xuICAgIGlmICghc2FtZUxldmVsUmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gVGhlIHJlYXNvbiB3ZSBhcmUgZG9pbmcgdGhpcyBpcyB0aGF0IGlmIHRoZSByZXF1ZXN0ZWQgbGluayBkb2VzIG5vdCBleGlzdFxuICAgICAgICAgICAgLy8gSXQgd2lsbCBmYWlsIHdoZW4gd2UgdHJ5IHRvIGdldCB1bmRlZmluZWRbc29tZXRoaW5nXSBiZWxvd1xuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzdG9yZU9uZVJlc3VsdHMoY29sbGVjdGlvbk5vZGUsIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY29sbGVjdGlvbk5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdICYmIF8uaXNBcnJheShyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBfLmZpcnN0KHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pXG4gICAgICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gY2xvbmVNZXRhQ2hpbGRyZW4obm9kZSwgcGFyZW50UmVzdWx0cykge1xuICAgIGlmICghcGFyZW50UmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGlua05hbWUgPSBub2RlLmxpbmtOYW1lO1xuICAgIGNvbnN0IGlzTWV0YSA9IG5vZGUuaXNNZXRhO1xuXG4gICAgLy8gcGFyZW50UmVzdWx0cyBtaWdodCBiZSBhbiBvYmplY3QgKGZvciB0eXBlPT1vbmUgbGlua3MpXG4gICAgcGFyZW50UmVzdWx0cyA9IGdldFJlc3VsdHNBcnJheShwYXJlbnRSZXN1bHRzKTtcblxuICAgIHBhcmVudFJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICBpZiAoaXNNZXRhICYmIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pIHtcbiAgICAgICAgICAgIGlmIChub2RlLmlzT25lUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IE9iamVjdC5hc3NpZ24oe30sIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSA9IHBhcmVudFJlc3VsdFtsaW5rTmFtZV0ubWFwKG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgICAgICBjbG9uZU1ldGFDaGlsZHJlbihjb2xsZWN0aW9uTm9kZSwgcGFyZW50UmVzdWx0W2xpbmtOYW1lXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVNZXRhZGF0YShub2RlLCBwYXJlbnRSZXN1bHRzKSB7XG4gICAgcGFyZW50UmVzdWx0cyA9IGdldFJlc3VsdHNBcnJheShwYXJlbnRSZXN1bHRzKTtcblxuICAgIC8vIGFzc2VtYmxpbmcgbWV0YWRhdGEgaXMgZGVwdGggZmlyc3RcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2Rlcy5mb3JFYWNoKGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBhc3NlbWJsZU1ldGFkYXRhKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHRbbm9kZS5saW5rTmFtZV0pXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaWYgKG5vZGUuaXNNZXRhKSB7XG4gICAgICAgIGlmIChub2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHQgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rTmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAobm9kZS5pc09uZVJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXy5pc09iamVjdChjaGlsZFJlc3VsdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBjaGlsZFJlc3VsdFtub2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVNZXRhZGF0YShjaGlsZFJlc3VsdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChjaGlsZFJlc3VsdCwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBvYmplY3Rbbm9kZS5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlTWV0YWRhdGEob2JqZWN0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHQgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHBhcmVudFJlc3VsdFtub2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZU1ldGFkYXRhKGNoaWxkUmVzdWx0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChjaGlsZFJlc3VsdCwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlTWV0YWRhdGEob2JqZWN0LCBwYXJlbnRSZXN1bHQsIHN0b3JhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVNZXRhZGF0YShlbGVtZW50LCBwYXJlbnRFbGVtZW50LCBzdG9yYWdlLCBpc1ZpcnR1YWwpIHtcbiAgICBpZiAoaXNWaXJ0dWFsKSB7XG4gICAgICAgIGxldCAkbWV0YWRhdGE7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoc3RvcmFnZSkpIHtcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IF8uZmluZChzdG9yYWdlLCBzdG9yYWdlSXRlbSA9PiBzdG9yYWdlSXRlbS5faWQgPT0gcGFyZW50RWxlbWVudC5faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gc3RvcmFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuJG1ldGFkYXRhID0gXy5vbWl0KCRtZXRhZGF0YSwgJ19pZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0ICRtZXRhZGF0YTtcbiAgICAgICAgaWYgKF8uaXNBcnJheShzdG9yYWdlKSkge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gXy5maW5kKHN0b3JhZ2UsIHN0b3JhZ2VJdGVtID0+IHN0b3JhZ2VJdGVtLl9pZCA9PSBlbGVtZW50Ll9pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBzdG9yYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC4kbWV0YWRhdGEgPSBfLm9taXQoJG1ldGFkYXRhLCAnX2lkJyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzbmFwQmFja0NhY2hlcyhub2RlKSB7XG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIHNuYXBCYWNrQ2FjaGVzKGNvbGxlY3Rpb25Ob2RlKTtcbiAgICB9KTtcblxuICAgIGlmICghXy5pc0VtcHR5KG5vZGUuc25hcENhY2hlcykpIHtcbiAgICAgICAgLy8gcHJvY2VzcyBzdHVmZlxuICAgICAgICBfLmVhY2gobm9kZS5zbmFwQ2FjaGVzLCAobGlua05hbWUsIGNhY2hlRmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2luZ2xlID0gXy5jb250YWlucyhub2RlLnNuYXBDYWNoZXNTaW5nbGVzLCBjYWNoZUZpZWxkKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IG5vZGUuY29sbGVjdGlvbi5nZXRMaW5rZXIobGlua05hbWUpO1xuICAgICAgICAgICAgLy8gd2UgZG8gdGhpcyBiZWNhdXNlIGZvciBvbmUgZGlyZWN0IGFuZCBvbmUgbWV0YSBkaXJlY3QsIGlkIGlzIG5vdCBzdG9yZWRcbiAgICAgICAgICAgIGNvbnN0IHNob3VkU3RvcmVMaW5rU3RvcmFnZSA9ICFsaW5rZXIuaXNNYW55KCkgJiYgIWxpbmtlci5pc1ZpcnR1YWwoKTtcblxuICAgICAgICAgICAgbm9kZS5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2NhY2hlRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaG91ZFN0b3JlTGlua1N0b3JhZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocmVzdWx0W2NhY2hlRmllbGRdLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiBsaW5rZXIuaXNNZXRhKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXN1bHRbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdLl9pZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHJlc3VsdFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzU2luZ2xlICYmIF8uaXNBcnJheShyZXN1bHRbY2FjaGVGaWVsZF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbbGlua05hbWVdID0gXy5maXJzdChyZXN1bHRbY2FjaGVGaWVsZF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2xpbmtOYW1lXSA9IHJlc3VsdFtjYWNoZUZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbY2FjaGVGaWVsZF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQge2NoZWNrLCBNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJGdW5jdGlvbih7XG4gICAgZmlsdGVycyxcbiAgICBvcHRpb25zLFxuICAgIHBhcmFtc1xufSkge1xuICAgIGlmIChwYXJhbXMuZmlsdGVycykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGZpbHRlcnMsIHBhcmFtcy5maWx0ZXJzKTtcbiAgICB9XG4gICAgaWYgKHBhcmFtcy5vcHRpb25zKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24ob3B0aW9ucywgcGFyYW1zLm9wdGlvbnMpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYXBwbHlGaWx0ZXJSZWN1cnNpdmUoZGF0YSwgcGFyYW1zID0ge30sIGlzUm9vdCA9IGZhbHNlKSB7XG4gICAgaWYgKGlzUm9vdCAmJiAhXy5pc0Z1bmN0aW9uKGRhdGEuJGZpbHRlcikpIHtcbiAgICAgICAgZGF0YS4kZmlsdGVyID0gZGVmYXVsdEZpbHRlckZ1bmN0aW9uO1xuICAgIH1cblxuICAgIGlmIChkYXRhLiRmaWx0ZXIpIHtcbiAgICAgICAgY2hlY2soZGF0YS4kZmlsdGVyLCBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW0Z1bmN0aW9uXSkpO1xuXG4gICAgICAgIGRhdGEuJGZpbHRlcnMgPSBkYXRhLiRmaWx0ZXJzIHx8IHt9O1xuICAgICAgICBkYXRhLiRvcHRpb25zID0gZGF0YS4kb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBpZiAoXy5pc0FycmF5KGRhdGEuJGZpbHRlcikpIHtcbiAgICAgICAgICAgIGRhdGEuJGZpbHRlci5mb3JFYWNoKGZpbHRlciA9PiB7XG4gICAgICAgICAgICAgICAgZmlsdGVyLmNhbGwobnVsbCwge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBkYXRhLiRmaWx0ZXJzLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiBkYXRhLiRvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEuJGZpbHRlcih7XG4gICAgICAgICAgICAgICAgZmlsdGVyczogZGF0YS4kZmlsdGVycyxcbiAgICAgICAgICAgICAgICBvcHRpb25zOiBkYXRhLiRvcHRpb25zLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRhdGEuJGZpbHRlciA9IG51bGw7XG4gICAgICAgIGRlbGV0ZShkYXRhLiRmaWx0ZXIpO1xuICAgIH1cblxuICAgIF8uZWFjaChkYXRhLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBhcHBseUZpbHRlclJlY3Vyc2l2ZSh2YWx1ZSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGFwcGx5UGFnaW5hdGlvbihib2R5LCBfcGFyYW1zKSB7XG4gICAgaWYgKGJvZHlbJyRwYWdpbmF0ZSddICYmIF9wYXJhbXMpIHtcbiAgICAgICAgaWYgKCFib2R5LiRvcHRpb25zKSB7XG4gICAgICAgICAgICBib2R5LiRvcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3BhcmFtcy5saW1pdCkge1xuICAgICAgICAgICAgXy5leHRlbmQoYm9keS4kb3B0aW9ucywge1xuICAgICAgICAgICAgICAgIGxpbWl0OiBfcGFyYW1zLmxpbWl0XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9wYXJhbXMuc2tpcCkge1xuICAgICAgICAgICAgXy5leHRlbmQoYm9keS4kb3B0aW9ucywge1xuICAgICAgICAgICAgICAgIHNraXA6IF9wYXJhbXMuc2tpcFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSBib2R5WyckcGFnaW5hdGUnXTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IChfYm9keSwgX3BhcmFtcyA9IHt9KSA9PiB7XG4gICAgbGV0IGJvZHkgPSBkZWVwQ2xvbmUoX2JvZHkpO1xuICAgIGxldCBwYXJhbXMgPSBkZWVwQ2xvbmUoX3BhcmFtcyk7XG5cbiAgICBhcHBseVBhZ2luYXRpb24oYm9keSwgcGFyYW1zKTtcbiAgICBhcHBseUZpbHRlclJlY3Vyc2l2ZShib2R5LCBwYXJhbXMsIHRydWUpO1xuXG4gICAgcmV0dXJuIGJvZHk7XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHtnZXROb2RlTmFtZXNwYWNlfSBmcm9tICcuL2NyZWF0ZUdyYXBoJztcbmltcG9ydCB7aXNGaWVsZEluUHJvamVjdGlvbn0gZnJvbSAnLi9maWVsZEluUHJvamVjdGlvbic7XG5cbi8qKlxuICogQWRkcyBfcXVlcnlfcGF0aCBmaWVsZHMgdG8gdGhlIGN1cnNvciBkb2NzIHdoaWNoIGFyZSB1c2VkIGZvciBzY29wZWQgcXVlcnkgZmlsdGVyaW5nIG9uIHRoZSBjbGllbnQuXG4gKiBcbiAqIEBwYXJhbSBjdXJzb3IgXG4gKiBAcGFyYW0gbnMgXG4gKi9cbmZ1bmN0aW9uIHBhdGNoQ3Vyc29yKGN1cnNvciwgbnMpIHtcbiAgICBjb25zdCBvcmlnaW5hbE9ic2VydmUgPSBjdXJzb3Iub2JzZXJ2ZTtcbiAgICBjdXJzb3Iub2JzZXJ2ZSA9IGZ1bmN0aW9uIChjYWxsYmFja3MpIHtcbiAgICAgICAgY29uc3QgbmV3Q2FsbGJhY2tzID0gT2JqZWN0LmFzc2lnbih7fSwgY2FsbGJhY2tzKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrcy5hZGRlZCkge1xuICAgICAgICAgICAgbmV3Q2FsbGJhY2tzLmFkZGVkID0gZG9jID0+IHtcbiAgICAgICAgICAgICAgICBkb2MgPSBfLmNsb25lKGRvYyk7XG4gICAgICAgICAgICAgICAgZG9jW2BfcXVlcnlfcGF0aF8ke25zfWBdID0gMTtcbiAgICAgICAgICAgICAgICBjYWxsYmFja3MuYWRkZWQoZG9jKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsT2JzZXJ2ZS5jYWxsKGN1cnNvciwgbmV3Q2FsbGJhY2tzKTtcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBjb21wb3NlKG5vZGUsIHVzZXJJZCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhub2RlKTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGxpbmtlciA9IG5vZGUubGlua2VyO1xuICAgICAgICAgICAgICAgIGxldCBhY2Nlc3NvciA9IGxpbmtlci5jcmVhdGVMaW5rKHBhcmVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGUgcnVsZSBpcyB0aGlzLCBpZiBhIGNoaWxkIEkgd2FudCB0byBmZXRjaCBpcyB2aXJ0dWFsLCB0aGVuIEkgd2FudCB0byBmZXRjaCB0aGUgbGluayBzdG9yYWdlIG9mIHRob3NlIGZpZWxkc1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpZWxkSW5Qcm9qZWN0aW9uKG9wdGlvbnMuZmllbGRzLCBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXTogMVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBhY2Nlc3Nvci5maW5kKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZy5zY29wZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcGF0Y2hDdXJzb3IoY3Vyc29yLCBnZXROb2RlTmFtZXNwYWNlKG5vZGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjaGlsZHJlbjogXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIG4gPT4gY29tcG9zZShuLCB1c2VySWQsIGNvbmZpZykpXG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAobm9kZSwgdXNlcklkLCBjb25maWcgPSB7YnlwYXNzRmlyZXdhbGxzOiBmYWxzZSwgc2NvcGVkOiBmYWxzZX0pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBmaW5kKCkge1xuICAgICAgICAgICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMobm9kZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGN1cnNvciA9IG5vZGUuY29sbGVjdGlvbi5maW5kKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG4gICAgICAgICAgICBpZiAoY29uZmlnLnNjb3BlZCkge1xuICAgICAgICAgICAgICAgIHBhdGNoQ3Vyc29yKGN1cnNvciwgZ2V0Tm9kZU5hbWVzcGFjZShub2RlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY3Vyc29yO1xuICAgICAgICB9LFxuXG4gICAgICAgIGNoaWxkcmVuOiBfLm1hcChub2RlLmNvbGxlY3Rpb25Ob2RlcywgbiA9PiB7XG4gICAgICAgICAgICBjb25zdCB1c2VySWRUb1Bhc3MgPSAoY29uZmlnLmJ5cGFzc0ZpcmV3YWxscykgPyB1bmRlZmluZWQgOiB1c2VySWQ7XG5cbiAgICAgICAgICAgIHJldHVybiBjb21wb3NlKG4sIHVzZXJJZFRvUGFzcywgY29uZmlnKTtcbiAgICAgICAgfSlcbiAgICB9XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHsgYXNzZW1ibGVNZXRhZGF0YSwgcmVtb3ZlTGlua1N0b3JhZ2VzLCBzdG9yZU9uZVJlc3VsdHMgfSBmcm9tICcuL3ByZXBhcmVGb3JEZWxpdmVyeSc7XG5pbXBvcnQgcHJlcGFyZUZvckRlbGl2ZXJ5IGZyb20gJy4vcHJlcGFyZUZvckRlbGl2ZXJ5JztcbmltcG9ydCB7Z2V0Tm9kZU5hbWVzcGFjZX0gZnJvbSAnLi9jcmVhdGVHcmFwaCc7XG5pbXBvcnQge2lzRmllbGRJblByb2plY3Rpb259IGZyb20gJy4uL2xpYi9maWVsZEluUHJvamVjdGlvbic7XG5cbi8qKlxuICogVGhpcyBpcyBhbHdheXMgcnVuIGNsaWVudCBzaWRlIHRvIGJ1aWxkIHRoZSBkYXRhIGdyYXBoIG91dCBvZiBjbGllbnQtc2lkZSBjb2xsZWN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHBhcmFtIHBhcmVudE9iamVjdFxuICogQHBhcmFtIGZldGNoT3B0aW9uc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGZldGNoKG5vZGUsIHBhcmVudE9iamVjdCwgZmV0Y2hPcHRpb25zID0ge30pIHtcbiAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhub2RlKTtcbiAgICAvLyBhZGQgc3Vic2NyaXB0aW9uIGZpbHRlclxuICAgIGlmIChmZXRjaE9wdGlvbnMuc2NvcGVkICYmIGZldGNoT3B0aW9ucy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgXy5leHRlbmQoZmlsdGVycywgZmV0Y2hPcHRpb25zLnN1YnNjcmlwdGlvbkhhbmRsZS5zY29wZVF1ZXJ5KCkpO1xuICAgIH1cbiAgICAvLyBhZGQgcXVlcnkgcGF0aCBmaWx0ZXJcbiAgICBpZiAoZmV0Y2hPcHRpb25zLnNjb3BlZCkge1xuICAgICAgICBfLmV4dGVuZChmaWx0ZXJzLCB7W2BfcXVlcnlfcGF0aF8ke2dldE5vZGVOYW1lc3BhY2Uobm9kZSl9YF06IHskZXhpc3RzOiB0cnVlfX0pO1xuICAgIH1cblxuICAgIGxldCByZXN1bHRzID0gW107XG5cbiAgICBpZiAocGFyZW50T2JqZWN0KSB7XG4gICAgICAgIGxldCBhY2Nlc3NvciA9IG5vZGUubGlua2VyLmNyZWF0ZUxpbmsocGFyZW50T2JqZWN0LCBub2RlLmNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGlmIChub2RlLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcyB8fCB7fTtcbiAgICAgICAgICAgIGlmICghaXNGaWVsZEluUHJvamVjdGlvbihvcHRpb25zLmZpZWxkcywgbm9kZS5saW5rU3RvcmFnZUZpZWxkLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7XG4gICAgICAgICAgICAgICAgICAgIFtub2RlLmxpbmtTdG9yYWdlRmllbGRdOiAxXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXN1bHRzID0gYWNjZXNzb3IuZmluZChmaWx0ZXJzLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMgPSBub2RlLmNvbGxlY3Rpb24uZmluZChmaWx0ZXJzLCBvcHRpb25zKS5mZXRjaCgpO1xuICAgIH1cblxuICAgIF8uZWFjaChub2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBfLmVhY2gocmVzdWx0cywgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb25Ob2RlUmVzdWx0cyA9IGZldGNoKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHQpO1xuICAgICAgICAgICAgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGNvbGxlY3Rpb25Ob2RlUmVzdWx0cztcbiAgICAgICAgICAgIC8vZGVsZXRlIHJlc3VsdFtub2RlLmxpbmtlci5saW5rU3RvcmFnZUZpZWxkXTtcblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBQdXNoIGludG8gdGhlIHJlc3VsdHMsIGJlY2F1c2Ugc25hcEJhY2tDYWNoZXMoKSBpbiBwcmVwYXJlRm9yRGVsaXZlcnkgZG9lcyBub3Qgd29yayBvdGhlcndpc2UuXG4gICAgICAgICAgICAgKiBUaGlzIGlzIG5vbi1vcHRpbWFsLCBjYW4gd2UgYmUgc3VyZSB0aGF0IGV2ZXJ5IGl0ZW0gaW4gcmVzdWx0cyBjb250YWlucyBfaWQgYW5kIGFkZCBvbmx5IGlmIG5vdCBpblxuICAgICAgICAgICAgICogdGhlIHJlc3VsdHM/XG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogT3RoZXIgcG9zc2libGUgd2F5czpcbiAgICAgICAgICAgICAqIC0gZG8gc29tZXRoaW5nIGxpa2UgYXNzZW1ibGUoKSBpbiBzdG9yZUh5cGVybm92YVJlc3VsdHNcbiAgICAgICAgICAgICAqIC0gcGFzcyBub2RlLnJlc3VsdHMgdG8gYWNjZXNzb3IgYWJvdmUgYW5kIGZpbmQgd2l0aCBzaWZ0XG4gICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgY29sbGVjdGlvbk5vZGUucmVzdWx0cy5wdXNoKC4uLmNvbGxlY3Rpb25Ob2RlUmVzdWx0cyk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMgd2FzIG5vdCB3b3JraW5nIGJlY2F1c2UgYWxsIHJlZmVyZW5jZXMgbXVzdCBiZSByZXBsYWNlZCBpbiBzbmFwQmFja0NhY2hlcywgbm90IG9ubHkgdGhlIG9uZXMgdGhhdCBhcmUgXG4gICAgICAgICAgICAvLyBmb3VuZCBmaXJzdFxuICAgICAgICAgICAgLy8gY29uc3QgY3VycmVudElkcyA9IF8ucGx1Y2soY29sbGVjdGlvbk5vZGUucmVzdWx0cywgJ19pZCcpO1xuICAgICAgICAgICAgLy8gY29sbGVjdGlvbk5vZGUucmVzdWx0cy5wdXNoKC4uLmNvbGxlY3Rpb25Ob2RlUmVzdWx0cy5maWx0ZXIocmVzID0+ICFfLmNvbnRhaW5zKGN1cnJlbnRJZHMsIHJlcy5faWQpKSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGRlZmF1bHQgKG5vZGUsIHBhcmFtcywgZmV0Y2hPcHRpb25zKSA9PiB7XG4gICAgbm9kZS5yZXN1bHRzID0gZmV0Y2gobm9kZSwgbnVsbCwgZmV0Y2hPcHRpb25zKTtcblxuICAgIHByZXBhcmVGb3JEZWxpdmVyeShub2RlLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIG5vZGUucmVzdWx0cztcbn1cbiIsImltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi9maWVsZE5vZGUuanMnO1xuaW1wb3J0IFJlZHVjZXJOb2RlIGZyb20gJy4vcmVkdWNlck5vZGUuanMnO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y2hlY2ssIE1hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHtleHBhbmRGaWVsZCwgaXNGaWVsZEluUHJvamVjdGlvbn0gZnJvbSAnLi4vbGliL2ZpZWxkSW5Qcm9qZWN0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sbGVjdGlvbk5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIGJvZHkgPSB7fSwgbGlua05hbWUgPSBudWxsKSB7XG4gICAgICAgIGlmIChjb2xsZWN0aW9uICYmICFfLmlzT2JqZWN0KGJvZHkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWJvZHknLCBgVGhlIGZpZWxkIFwiJHtsaW5rTmFtZX1cIiBpcyBhIGNvbGxlY3Rpb24gbGluaywgYW5kIHNob3VsZCBoYXZlIGl0cyBib2R5IGRlZmluZWQgYXMgYW4gb2JqZWN0LmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ib2R5ID0gZGVlcENsb25lKGJvZHkpO1xuICAgICAgICB0aGlzLmxpbmtOYW1lID0gbGlua05hbWU7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdGhpcy5ub2RlcyA9IFtdO1xuICAgICAgICB0aGlzLnByb3BzID0ge307XG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5saW5rZXIgPSBudWxsO1xuICAgICAgICB0aGlzLmxpbmtTdG9yYWdlRmllbGQgPSBudWxsO1xuICAgICAgICB0aGlzLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmVkdWNlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5yZXN1bHRzID0gW107XG4gICAgICAgIHRoaXMuc25hcENhY2hlcyA9IHt9OyAvLyB7Y2FjaGVGaWVsZDogbGlua05hbWV9XG4gICAgICAgIHRoaXMuc25hcENhY2hlc1NpbmdsZXMgPSBbXTsgLy8gW2NhY2hlRmllbGQxLCBjYWNoZUZpZWxkMl1cbiAgICB9XG5cbiAgICBnZXQgY29sbGVjdGlvbk5vZGVzKCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5ub2RlcywgbiA9PiBuIGluc3RhbmNlb2YgQ29sbGVjdGlvbk5vZGUpXG4gICAgfVxuXG4gICAgZ2V0IGZpZWxkTm9kZXMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzLCBuID0+IG4gaW5zdGFuY2VvZiBGaWVsZE5vZGUpO1xuICAgIH1cblxuICAgIGdldCByZWR1Y2VyTm9kZXMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzLCBuID0+IG4gaW5zdGFuY2VvZiBSZWR1Y2VyTm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBjaGlsZHJlbiB0byBpdHNlbGZcbiAgICAgKlxuICAgICAqIEBwYXJhbSBub2RlXG4gICAgICogQHBhcmFtIGxpbmtlclxuICAgICAqL1xuICAgIGFkZChub2RlLCBsaW5rZXIpIHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzO1xuXG4gICAgICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmllbGROb2RlKSB7XG4gICAgICAgICAgICBydW5GaWVsZFNhbml0eUNoZWNrcyhub2RlLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobGlua2VyKSB7XG4gICAgICAgICAgICBub2RlLmxpbmtlciA9IGxpbmtlcjtcbiAgICAgICAgICAgIG5vZGUubGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICAgICAgbm9kZS5pc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG4gICAgICAgICAgICBub2RlLmlzVmlydHVhbCA9IGxpbmtlci5pc1ZpcnR1YWwoKTtcbiAgICAgICAgICAgIG5vZGUuaXNPbmVSZXN1bHQgPSBsaW5rZXIuaXNPbmVSZXN1bHQoKTtcbiAgICAgICAgICAgIG5vZGUuc2hvdWxkQ2xlYW5TdG9yYWdlID0gdGhpcy5fc2hvdWxkQ2xlYW5TdG9yYWdlKG5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ub2Rlcy5wdXNoKG5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwcm9wXG4gICAgICogQHBhcmFtIHZhbHVlXG4gICAgICovXG4gICAgYWRkUHJvcChwcm9wLCB2YWx1ZSkge1xuICAgICAgICBpZiAocHJvcCA9PT0gJyRwb3N0RmlsdGVyJykge1xuICAgICAgICAgICAgY2hlY2sodmFsdWUsIE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBbRnVuY3Rpb25dKSlcbiAgICAgICAgfVxuXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5wcm9wcywge1xuICAgICAgICAgICAgW3Byb3BdOiB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gX25vZGVcbiAgICAgKi9cbiAgICByZW1vdmUoX25vZGUpIHtcbiAgICAgICAgdGhpcy5ub2RlcyA9IF8uZmlsdGVyKHRoaXMubm9kZXMsIG5vZGUgPT4gX25vZGUgIT09IG5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKi9cbiAgICBhcHBseUZpZWxkcyhmaWx0ZXJzLCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBoYXNBZGRlZEFueUZpZWxkID0gZmFsc2U7XG5cbiAgICAgICAgXy5lYWNoKHRoaXMuZmllbGROb2RlcywgbiA9PiB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqICRtZXRhIGZpZWxkIHNob3VsZCBiZSBhZGRlZCB0byB0aGUgb3B0aW9ucy5maWVsZHMsIGJ1dCBNb25nb0RCIGRvZXMgbm90IGV4Y2x1ZGUgb3RoZXIgZmllbGRzLlxuICAgICAgICAgICAgICogVGhlcmVmb3JlLCB3ZSBkbyBub3QgY291bnQgdGhpcyBhcyBhIGZpZWxkIGFkZGl0aW9uLlxuICAgICAgICAgICAgICogXG4gICAgICAgICAgICAgKiBTZWU6IGh0dHBzOi8vZG9jcy5tb25nb2RiLmNvbS9tYW51YWwvcmVmZXJlbmNlL29wZXJhdG9yL3Byb2plY3Rpb24vbWV0YS9cbiAgICAgICAgICAgICAqIFRoZSAkbWV0YSBleHByZXNzaW9uIHNwZWNpZmllcyB0aGUgaW5jbHVzaW9uIG9mIHRoZSBmaWVsZCB0byB0aGUgcmVzdWx0IHNldCBcbiAgICAgICAgICAgICAqIGFuZCBkb2VzIG5vdCBzcGVjaWZ5IHRoZSBleGNsdXNpb24gb2YgdGhlIG90aGVyIGZpZWxkcy5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKG4ucHJvamVjdGlvbk9wZXJhdG9yICE9PSAnJG1ldGEnKSB7XG4gICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuLmFwcGx5RmllbGRzKG9wdGlvbnMuZmllbGRzKVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpdCB3aWxsIG9ubHkgZ2V0IGhlcmUgaWYgaXQgaGFzIGNvbGxlY3Rpb25Ob2RlcyBjaGlsZHJlblxuICAgICAgICBfLmVhY2godGhpcy5jb2xsZWN0aW9uTm9kZXMsIChjb2xsZWN0aW9uTm9kZSkgPT4ge1xuICAgICAgICAgICAgbGV0IGxpbmtlciA9IGNvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcblxuICAgICAgICAgICAgaWYgKGxpbmtlciAmJiAhbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0ZpZWxkSW5Qcm9qZWN0aW9uKG9wdGlvbnMuZmllbGRzLCBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5maWVsZHNbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBpZiBoZSBzZWxlY3RlZCBmaWx0ZXJzLCB3ZSBzaG91bGQgYXV0b21hdGljYWxseSBhZGQgdGhvc2UgZmllbGRzXG4gICAgICAgIF8uZWFjaChmaWx0ZXJzLCAodmFsdWUsIGZpZWxkKSA9PiB7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGhhbmRsaW5nIGZvciB0aGUgJG1ldGEgZmlsdGVyLCBjb25kaXRpb25hbCBvcGVyYXRvcnMgYW5kIHRleHQgc2VhcmNoXG4gICAgICAgICAgICBpZiAoIV8uY29udGFpbnMoWyckb3InLCAnJG5vcicsICckbm90JywgJyRhbmQnLCAnJG1ldGEnLCAnJHRleHQnXSwgZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGZpZWxkIG9yIHRoZSBwYXJlbnQgb2YgdGhlIGZpZWxkIGFscmVhZHkgZXhpc3RzLCBkb24ndCBhZGQgaXRcbiAgICAgICAgICAgICAgICBpZiAoIV8uaGFzKG9wdGlvbnMuZmllbGRzLCBmaWVsZC5zcGxpdCgnLicpWzBdKSl7XG4gICAgICAgICAgICAgICAgICAgIGhhc0FkZGVkQW55RmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZpZWxkc1tmaWVsZF0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFoYXNBZGRlZEFueUZpZWxkKSB7XG4gICAgICAgICAgICBvcHRpb25zLmZpZWxkcyA9IHtcbiAgICAgICAgICAgICAgICBfaWQ6IDEsXG4gICAgICAgICAgICAgICAgLy8gZmllbGRzIG1pZ2h0IGNvbnRhaW4gJG1ldGEgZXhwcmVzc2lvbiwgc28gaXQgc2hvdWxkIGJlIGFkZGVkIGhlcmUsXG4gICAgICAgICAgICAgICAgLi4ub3B0aW9ucy5maWVsZHMsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZpZWxkTmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhc0ZpZWxkKGZpZWxkTmFtZSwgY2hlY2tOZXN0ZWQgPSBmYWxzZSkge1xuICAgICAgICAvLyBmb3IgY2hlY2tOZXN0ZWQgZmxhZyBpdCBleHBhbmRzIHByb2ZpbGUucGhvbmUudmVyaWZpZWQgaW50byBcbiAgICAgICAgLy8gWydwcm9maWxlJywgJ3Byb2ZpbGUucGhvbmUnLCAncHJvZmlsZS5waG9uZS52ZXJpZmllZCddXG4gICAgICAgIC8vIGlmIGFueSBvZiB0aGVzZSBmaWVsZHMgbWF0Y2ggaXQgbWVhbnMgdGhhdCBmaWVsZCBleGlzdHNcblxuICAgICAgICBjb25zdCBvcHRpb25zID0gY2hlY2tOZXN0ZWQgPyBleHBhbmRGaWVsZChmaWVsZE5hbWUpIDogW2ZpZWxkTmFtZV07XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gISFfLmZpbmQodGhpcy5maWVsZE5vZGVzLCBmaWVsZE5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIF8uY29udGFpbnMob3B0aW9ucywgZmllbGROb2RlLm5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWVsZE5hbWVcbiAgICAgKiBAcmV0dXJucyB7RmllbGROb2RlfVxuICAgICAqL1xuICAgIGdldEZpZWxkKGZpZWxkTmFtZSkge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuZmllbGROb2RlcywgZmllbGROb2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZE5vZGUubmFtZSA9PSBmaWVsZE5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhc0NvbGxlY3Rpb25Ob2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmxpbmtOYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhc1JlZHVjZXJOb2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMucmVkdWNlck5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge1JlZHVjZXJOb2RlfVxuICAgICAqL1xuICAgIGdldFJlZHVjZXJOb2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnJlZHVjZXJOb2Rlcywgbm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtDb2xsZWN0aW9uTm9kZX1cbiAgICAgKi9cbiAgICBnZXRDb2xsZWN0aW9uTm9kZShuYW1lKSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubGlua05hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICA/IHRoaXMubGlua05hbWVcbiAgICAgICAgICAgIDogKHRoaXMuY29sbGVjdGlvbiA/IHRoaXMuY29sbGVjdGlvbi5fbmFtZSA6ICdOL0EnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIHVzZWQgZm9yIGNhY2hpbmcgbGlua3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWNoZUZpZWxkXG4gICAgICogQHBhcmFtIHN1YkxpbmtOYW1lXG4gICAgICovXG4gICAgc25hcENhY2hlKGNhY2hlRmllbGQsIHN1YkxpbmtOYW1lKSB7XG4gICAgICAgIHRoaXMuc25hcENhY2hlc1tjYWNoZUZpZWxkXSA9IHN1YkxpbmtOYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24uZ2V0TGlua2VyKHN1YkxpbmtOYW1lKS5pc09uZVJlc3VsdCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNuYXBDYWNoZXNTaW5nbGVzLnB1c2goY2FjaGVGaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCB2ZXJpZmllcyB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgbGlua1N0b3JhZ2VGaWVsZCBmb3JtIHRoZSByZXN1bHRzXG4gICAgICogdW5sZXNzIHlvdSBzcGVjaWZ5IGl0IGluIHlvdXIgcXVlcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3Nob3VsZENsZWFuU3RvcmFnZShub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmxpbmtTdG9yYWdlRmllbGQgPT09ICdfaWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIW5vZGUuaGFzRmllbGQobm9kZS5saW5rU3RvcmFnZUZpZWxkLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmhhc0ZpZWxkKG5vZGUubGlua1N0b3JhZ2VGaWVsZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogTWFrZSBzdXJlIHRoYXQgdGhlIGZpZWxkIGlzIG9rIHRvIGJlIGFkZGVkXG4gKiBAcGFyYW0geyp9IGZpZWxkTmFtZSBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bkZpZWxkU2FuaXR5Q2hlY2tzKGZpZWxkTmFtZSkge1xuICAgIC8vIFJ1biBzYW5pdHkgY2hlY2tzIG9uIHRoZSBmaWVsZFxuICAgIGlmIChmaWVsZE5hbWVbMF0gPT09ICckJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBhcmUgbm90IGFsbG93ZWQgdG8gdXNlIGZpZWxkcyB0aGF0IHN0YXJ0IHdpdGggJCBpbnNpZGUgYSByZWR1Y2VyJ3MgYm9keTogJHtmaWVsZE5hbWV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZE5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJvZHksIGlzUHJvamVjdGlvbk9wZXJhdG9yID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uT3BlcmF0b3IgPSBpc1Byb2plY3Rpb25PcGVyYXRvciA/IF8ua2V5cyhib2R5KVswXSA6IG51bGw7XG4gICAgICAgIHRoaXMuYm9keSA9ICFfLmlzT2JqZWN0KGJvZHkpIHx8IGlzUHJvamVjdGlvbk9wZXJhdG9yID8gYm9keSA6IDE7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhcHBseUZpZWxkcyhmaWVsZHMpIHtcbiAgICAgICAgZmllbGRzW3RoaXMubmFtZV0gPSB0aGlzLmJvZHk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVkdWNlck5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHtib2R5LCByZWR1Y2V9KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMucmVkdWNlRnVuY3Rpb24gPSByZWR1Y2U7XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107IC8vIFRoaXMgaXMgYSBsaXN0IG9mIHRoZSByZWR1Y2VyIHRoaXMgcmVkdWNlciB1c2VzLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gY29tcHV0aW5nIHdlIGFsc28gcGFzcyB0aGUgcGFyYW1ldGVyc1xuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxuICAgICAqIEBwYXJhbSB7Kn0gYXJncyBcbiAgICAgKi9cbiAgICBjb21wdXRlKG9iamVjdCwgLi4uYXJncykge1xuICAgICAgICBvYmplY3RbdGhpcy5uYW1lXSA9IHRoaXMucmVkdWNlLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICByZWR1Y2Uob2JqZWN0LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZUZ1bmN0aW9uLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGFkZEZpZWxkTWFwIGZyb20gJy4vbGliL2FkZEZpZWxkTWFwJztcblxuY29uc3Qgc3RvcmFnZSA9ICdfX3JlZHVjZXJzJztcbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIGFkZFJlZHVjZXJzKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW3N0b3JhZ2VdKSB7XG4gICAgICAgICAgICB0aGlzW3N0b3JhZ2VdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goZGF0YSwgKHJlZHVjZXJDb25maWcsIHJlZHVjZXJOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXNbcmVkdWNlckNvbmZpZ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzW3JlZHVjZXJDb25maWddID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdldExpbmtlcihyZWR1Y2VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgWW91IGNhbm5vdCBhZGQgdGhlIHJlZHVjZXIgd2l0aCBuYW1lOiAke3JlZHVjZXJOYW1lfSBiZWNhdXNlIGl0IGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIGxpbmsgaW4gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzW3JlZHVjZXJDb25maWddW3JlZHVjZXJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBZb3UgY2Fubm90IGFkZCB0aGUgcmVkdWNlciB3aXRoIG5hbWU6ICR7cmVkdWNlck5hbWV9IGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgYWRkZWQgdG8gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoZWNrKHJlZHVjZXJDb25maWcsIHtcbiAgICAgICAgICAgICAgICBib2R5OiBPYmplY3QsXG4gICAgICAgICAgICAgICAgcmVkdWNlOiBGdW5jdGlvbixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzW3N0b3JhZ2VdLCB7XG4gICAgICAgICAgICAgICAgW3JlZHVjZXJOYW1lXTogcmVkdWNlckNvbmZpZyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXRSZWR1Y2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbc3RvcmFnZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3N0b3JhZ2VdW25hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgY3JlYXRlcyByZWR1Y2VycyB0aGF0IG1ha2VzIHNvcnQgb2YgYWxpYXNlcyBmb3IgdGhlIGRhdGFiYXNlIGZpZWxkcyB3ZSB1c2VcbiAgICAgKi9cbiAgICBhZGRGaWVsZE1hcCxcbn0pO1xuIiwiLyoqXG4gKiBAcGFyYW0ge1tuaWNlRmllbGQ6IHN0cmluZ106IGRiRmllbGR9IG1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRGaWVsZE1hcChtYXApIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcztcbiAgICBsZXQgcmVkdWNlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgaW4gbWFwKSB7XG4gICAgICAgIGNvbnN0IGRiRmllbGQgPSBtYXBba2V5XTtcbiAgICAgICAgcmVkdWNlcnNba2V5XSA9IHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBbZGJGaWVsZF06IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmpbZGJGaWVsZF07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbGxlY3Rpb24uYWRkUmVkdWNlcnMocmVkdWNlcnMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwbHlSZWR1Y2Vycyhyb290LCBwYXJhbXMpIHtcbiAgICBfLmVhY2gocm9vdC5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBhcHBseVJlZHVjZXJzKG5vZGUsIHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9jZXNzZWRSZWR1Y2VycyA9IFtdO1xuICAgIGxldCByZWR1Y2Vyc1F1ZXVlID0gWy4uLnJvb3QucmVkdWNlck5vZGVzXTtcblxuICAgIC8vIFRPRE86IGZpbmQgb3V0IGlmIHRoZXJlJ3MgYW4gaW5maW5pdGUgcmVkdWNlciBpbnRlci1kZWVuZGVuY3lcblxuICAgIHdoaWxlIChyZWR1Y2Vyc1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCByZWR1Y2VyTm9kZSA9IHJlZHVjZXJzUXVldWUuc2hpZnQoKTtcblxuICAgICAgICAvLyBJZiB0aGlzIHJlZHVjZXIgZGVwZW5kcyBvbiBvdGhlciByZWR1Y2Vyc1xuICAgICAgICBpZiAocmVkdWNlck5vZGUuZGVwZW5kZW5jaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gdW5wcm9jZXNzZWQgcmVkdWNlciwgbW92ZSBpdCBhdCB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuICAgICAgICAgICAgY29uc3QgYWxsRGVwZW5kZW5jaWVzQ29tcHV0ZWQgPSBfLmFsbChyZWR1Y2VyTm9kZS5kZXBlbmRlbmNpZXMsIGRlcCA9PiBwcm9jZXNzZWRSZWR1Y2Vycy5pbmNsdWRlcyhkZXApKTtcbiAgICAgICAgICAgIGlmIChhbGxEZXBlbmRlbmNpZXNDb21wdXRlZCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZHVjZXJOb2RlLmNvbXB1dGUocmVzdWx0LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZFJlZHVjZXJzLnB1c2gocmVkdWNlck5vZGUubmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgaXQgYXQgdGhlIGVuZCBvZiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICByZWR1Y2Vyc1F1ZXVlLnB1c2gocmVkdWNlck5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdC5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICByZWR1Y2VyTm9kZS5jb21wdXRlKHJlc3VsdCwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9jZXNzZWRSZWR1Y2Vycy5wdXNoKHJlZHVjZXJOb2RlLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuLyoqXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMocm9vdCwgcmVzdWx0cykge1xuICAgIF8uZWFjaChyb290LmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uKSB7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W25vZGUubGlua05hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgbGV0IGNoaWxkUmVzdWx0cztcbiAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgIGNoaWxkUmVzdWx0cyA9IHJlc3VsdHMubWFwKHJlc3VsdCA9PiByZXN1bHRbbm9kZS5saW5rTmFtZV0pLmZpbHRlcihlbGVtZW50ID0+ICEhZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZFJlc3VsdHMgPSBfLmZsYXR0ZW4ocmVzdWx0cy5tYXAocmVzdWx0ID0+IHJlc3VsdFtub2RlLmxpbmtOYW1lXSkuZmlsdGVyKGVsZW1lbnQgPT4gISFlbGVtZW50KSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNsZWFuUmVkdWNlckxlZnRvdmVycyhub2RlLCBjaGlsZFJlc3VsdHMpO1xuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuZmllbGROb2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uKSB7XG4gICAgICAgICAgICBjbGVhbk5lc3RlZEZpZWxkcyhub2RlLm5hbWUuc3BsaXQoJy4nKSwgcmVzdWx0cywgcm9vdCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgXy5lYWNoKHJvb3QucmVkdWNlck5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgaWYgKG5vZGUuc2NoZWR1bGVkRm9yRGVsZXRpb24pIHtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbbm9kZS5uYW1lXTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG4vLyBpZiB3ZSBzdG9yZSBhIGZpZWxkIGxpa2U6ICdwcm9maWxlLmZpcnN0TmFtZSdcbi8vIHRoZW4gd2UgbmVlZCB0byBkZWxldGUgcHJvZmlsZTogeyBmaXJzdE5hbWUgfVxuLy8gaWYgcHJvZmlsZSB3aWxsIGhhdmUgZW1wdHkga2V5cywgd2UgbmVlZCB0byBkZWxldGUgcHJvZmlsZS5cblxuLyoqXG4gKiBDbGVhbnMgd2hhdCByZWR1Y2VycyBuZWVkZWQgdG8gYmUgY29tcHV0ZWQgYW5kIG5vdCB1c2VkLlxuICogQHBhcmFtIHBhcnRzXG4gKiBAcGFyYW0gcmVzdWx0c1xuICovXG5mdW5jdGlvbiBjbGVhbk5lc3RlZEZpZWxkcyhwYXJ0cywgcmVzdWx0cywgcm9vdCkge1xuICAgIGNvbnN0IHNuYXBDYWNoZUZpZWxkID0gcm9vdC5zbmFwQ2FjaGVzW3BhcnRzWzBdXTtcbiAgICBjb25zdCBmaWVsZE5hbWUgPSBzbmFwQ2FjaGVGaWVsZCA/IHNuYXBDYWNoZUZpZWxkIDogcGFydHNbMF07XG5cbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QocmVzdWx0KSAmJiBmaWVsZE5hbWUgIT09ICdfaWQnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtmaWVsZE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFydHMuc2hpZnQoKTtcbiAgICBjbGVhbk5lc3RlZEZpZWxkcyhcbiAgICAgICAgcGFydHMsIFxuICAgICAgICByZXN1bHRzXG4gICAgICAgICAgICAuZmlsdGVyKHJlc3VsdCA9PiAhIXJlc3VsdFtmaWVsZE5hbWVdKVxuICAgICAgICAgICAgLm1hcChyZXN1bHQgPT4gcmVzdWx0W2ZpZWxkTmFtZV0pLFxuICAgICAgICByb290XG4gICAgKTtcbiAgICBcbiAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKF8uaXNPYmplY3QocmVzdWx0W2ZpZWxkTmFtZV0pICYmIF8ua2V5cyhyZXN1bHRbZmllbGROYW1lXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZmllbGROYW1lICE9PSAnX2lkJykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZmllbGROYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59XG4iLCJpbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuaW1wb3J0IHsgY3JlYXRlTm9kZXMgfSBmcm9tICcuLi8uLi9saWIvY3JlYXRlR3JhcGgnO1xuaW1wb3J0IENvbGxlY3Rpb25Ob2RlIGZyb20gJy4uLy4uL25vZGVzL2NvbGxlY3Rpb25Ob2RlJztcbmltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi4vLi4vbm9kZXMvZmllbGROb2RlJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuLi8uLi9ub2Rlcy9yZWR1Y2VyTm9kZSc7XG5pbXBvcnQgZW1iZWRSZWR1Y2VyV2l0aExpbmsgZnJvbSAnLi9lbWJlZFJlZHVjZXJXaXRoTGluayc7XG5pbXBvcnQgeyBzcGVjaWFsRmllbGRzIH0gZnJvbSAnLi4vLi4vbGliL2NyZWF0ZUdyYXBoJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkUmVkdWNlcnMocm9vdCkge1xuICAgIC8vIHdlIGFkZCByZWR1Y2VycyBsYXN0LCBhZnRlciB3ZSBoYXZlIGFkZGVkIGFsbCB0aGUgZmllbGRzLlxuICAgIHJvb3QucmVkdWNlck5vZGVzLmZvckVhY2gocmVkdWNlciA9PiB7XG4gICAgICAgIF8uZWFjaChyZWR1Y2VyLmJvZHksIChib2R5LCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZUFkZEVsZW1lbnQocmVkdWNlciwgcm9vdCwgZmllbGROYW1lLCBib2R5KTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIGJvZHlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUFkZEVsZW1lbnQocmVkdWNlck5vZGUsIHJvb3QsIGZpZWxkTmFtZSwgYm9keSkge1xuICAgIC8vIGlmIGl0J3MgYSBsaW5rXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHJvb3QuY29sbGVjdGlvbjtcbiAgICBjb25zdCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihmaWVsZE5hbWUpO1xuICAgIGlmIChsaW5rZXIpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUFkZExpbmsocmVkdWNlck5vZGUsIGZpZWxkTmFtZSwgYm9keSwgcm9vdCwgbGlua2VyKTtcbiAgICB9XG5cbiAgICBjb25zdCByZWR1Y2VyID0gY29sbGVjdGlvbi5nZXRSZWR1Y2VyKGZpZWxkTmFtZSk7XG4gICAgaWYgKHJlZHVjZXIpIHtcbiAgICAgICAgcmVkdWNlck5vZGUuZGVwZW5kZW5jaWVzLnB1c2goZmllbGROYW1lKTtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUFkZFJlZHVjZXIoZmllbGROYW1lLCByZWR1Y2VyLCByb290KTtcbiAgICB9XG5cbiAgICAvLyB3ZSBhc3N1bWUgaXQncyBhIGZpZWxkIGluIHRoaXMgY2FzZVxuICAgIHJldHVybiBoYW5kbGVBZGRGaWVsZChmaWVsZE5hbWUsIGJvZHksIHJvb3QpO1xufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSByZWR1Y2VyXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkUmVkdWNlcihmaWVsZE5hbWUsIHtib2R5LCByZWR1Y2V9LCByb290KSB7XG4gICAgaWYgKCFyb290Lmhhc1JlZHVjZXJOb2RlKGZpZWxkTmFtZSkpIHtcbiAgICAgICAgbGV0IGNoaWxkUmVkdWNlck5vZGUgPSBuZXcgUmVkdWNlck5vZGUoZmllbGROYW1lLCB7Ym9keSwgcmVkdWNlfSk7XG4gICAgICAgIHJvb3QuYWRkKGNoaWxkUmVkdWNlck5vZGUpO1xuICAgICAgICBjaGlsZFJlZHVjZXJOb2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gdHJ1ZTtcblxuICAgICAgICBfLmVhY2goY2hpbGRSZWR1Y2VyTm9kZS5ib2R5LCAoYm9keSwgZmllbGROYW1lKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVBZGRFbGVtZW50KGNoaWxkUmVkdWNlck5vZGUsIHJvb3QsIGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGxpbmtlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkTGluayhyZWR1Y2VyTm9kZSwgZmllbGROYW1lLCBib2R5LCBwYXJlbnQsIGxpbmtlcikge1xuICAgIGlmIChwYXJlbnQuaGFzQ29sbGVjdGlvbk5vZGUoZmllbGROYW1lKSkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTm9kZSA9IHBhcmVudC5nZXRDb2xsZWN0aW9uTm9kZShmaWVsZE5hbWUpO1xuXG4gICAgICAgIGVtYmVkUmVkdWNlcldpdGhMaW5rKHJlZHVjZXJOb2RlLCBib2R5LCBjb2xsZWN0aW9uTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYWRkXG4gICAgICAgIGxldCBjb2xsZWN0aW9uTm9kZSA9IG5ldyBDb2xsZWN0aW9uTm9kZShsaW5rZXIuZ2V0TGlua2VkQ29sbGVjdGlvbigpLCBib2R5LCBmaWVsZE5hbWUpO1xuICAgICAgICBjb2xsZWN0aW9uTm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IHRydWU7XG4gICAgICAgIHBhcmVudC5hZGQoY29sbGVjdGlvbk5vZGUsIGxpbmtlcik7XG5cbiAgICAgICAgY3JlYXRlTm9kZXMoY29sbGVjdGlvbk5vZGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gZmllbGROYW1lXG4gKiBAcGFyYW0gYm9keVxuICogQHBhcmFtIHJvb3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUFkZEZpZWxkKGZpZWxkTmFtZSwgYm9keSwgcm9vdCkge1xuICAgIGlmIChfLmNvbnRhaW5zKHNwZWNpYWxGaWVsZHMsIGZpZWxkTmFtZSkpIHtcbiAgICAgICAgcm9vdC5hZGRQcm9wKGZpZWxkTmFtZSwgYm9keSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChfLmlzT2JqZWN0KGJvZHkpKSB7XG4gICAgICAgIC8vIGlmIHJlZHVjZXIgc3BlY2lmaWVzIGEgbmVzdGVkIGZpZWxkXG4gICAgICAgIC8vIGlmIGl0J3MgYSBwcm9wXG4gICAgICAgIGNvbnN0IGRvdHMgPSBkb3QuZG90KHtcbiAgICAgICAgICAgIFtmaWVsZE5hbWVdOiBib2R5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uZWFjaChkb3RzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgYWRkRmllbGRJZlJlcXVpcmVkKHJvb3QsIGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiByZWR1Y2VyIGRvZXMgbm90IHNwZWNpZnkgYSBuZXN0ZWQgZmllbGQsIGFuZCB0aGUgZmllbGQgZG9lcyBub3QgZXhpc3QuXG4gICAgICAgIGFkZEZpZWxkSWZSZXF1aXJlZChyb290LCBmaWVsZE5hbWUsIGJvZHkpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYWRkRmllbGRJZlJlcXVpcmVkKHJvb3QsIGZpZWxkTmFtZSwgYm9keSkge1xuICAgIGlmICghcm9vdC5oYXNGaWVsZChmaWVsZE5hbWUsIHRydWUpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDaGVjayBpZiB0aGVyZSBhcmUgYW55IG5lc3RlZCBmaWVsZHMgZm9yIHRoaXMgZmllbGQuXG4gICAgICAgICAqIEFkZGluZyByb290IGZpZWxkIGhlcmUgYW5kIHNjaGVkdWxpbmcgZm9yIGRlbGV0aW9uIHdvdWxkIG5vdCB3b3JrIGlmIHRoZXJlIGlzIGFscmVhZHkgbmVzdGVkIGZpZWxkLCBcbiAgICAgICAgICogZm9yIGV4YW1wbGU6XG4gICAgICAgICAqIHdoZW4gdHJ5aW5nIHRvIGFkZCBtZXRhOiAxLCBpdCBzaG91bGQgYmUgY2hlY2tlZCB0aGF0IHRoZXJlIGFyZSBubyBtZXRhLiogZmllbGRzXG4gICAgICAgICAqICovXG5cbiAgICAgICAgY29uc3QgbmVzdGVkRmllbGRzID0gcm9vdC5maWVsZE5vZGVzLmZpbHRlcigoe25hbWV9KSA9PiBuYW1lLnN0YXJ0c1dpdGgoYCR7ZmllbGROYW1lfS5gKSk7XG4gICAgICAgIC8vIHJlbW92ZSBuZXN0ZWQgZmllbGRzIC0gaW1wb3J0YW50IGZvciBtaW5pbW9uZ28gd2hpY2ggY29tcGxhaW5zIGZvciB0aGVzZSBzaXR1YXRpb25zXG4gICAgICAgIC8vIFRPRE86IGV4Y2VzcyBmaWVsZHMgYXJlIG5vdCByZW1vdmVkIChjYXVzZWQgYnkgYWRkaW5nIHRoZSByb290IGZpZWxkIGFuZCByZW1vdmluZyBuZXN0ZWQgZmllbGRzKSBidXQgdGhlcmVcbiAgICAgICAgLy8gc2hvdWxkIHByb2JhYmx5IGJlIGEgd2F5IHRvIGhhbmRsZSB0aGlzIGluIHBvc3QtcHJvY2Vzc2luZyAtIGZvciBleGFtcGxlIGJ5IGtlZXBpbmcgYSB3aGl0ZWxpc3Qgb2YgZmllbGRzXG4gICAgICAgIC8vIGFuZCByZW1vdmluZyBhbnl0aGluZyBlbHNlXG4gICAgICAgIG5lc3RlZEZpZWxkcy5mb3JFYWNoKG5vZGUgPT4gcm9vdC5yZW1vdmUobm9kZSkpO1xuIFxuICAgICAgICBsZXQgZmllbGROb2RlID0gbmV3IEZpZWxkTm9kZShmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICAvLyBkZWxldGUgb25seSBpZiBhbGwgbmVzdGVkIGZpZWxkcyBhcmUgc2NoZWR1bGVkIGZvciBkZWxldGlvbiAodGhhdCBpbmNsdWRlcyB0aGUgY2FzZSBvZiAwIG5lc3RlZCBmaWVsZHMpXG4gICAgICAgIGZpZWxkTm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IG5lc3RlZEZpZWxkcy5ldmVyeShmaWVsZCA9PiBmaWVsZC5zY2hlZHVsZWRGb3JEZWxldGlvbik7XG5cbiAgICAgICAgcm9vdC5hZGQoZmllbGROb2RlKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge2hhbmRsZUFkZEZpZWxkLCBoYW5kbGVBZGRFbGVtZW50LCBoYW5kbGVBZGRSZWR1Y2VyfSBmcm9tICcuL2NyZWF0ZVJlZHVjZXJzJztcblxuLyoqXG4gKiBFbWJlZHMgdGhlIHJlZHVjZXIgYm9keSB3aXRoIGEgY29sbGVjdGlvbiBib2R5XG4gKiBAcGFyYW0gcmVkdWNlckJvZHlcbiAqIEBwYXJhbSBjb2xsZWN0aW9uTm9kZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbWJlZFJlZHVjZXJXaXRoTGluayhyZWR1Y2VyTm9kZSwgcmVkdWNlckJvZHksIGNvbGxlY3Rpb25Ob2RlKSB7XG4gICAgXy5lYWNoKHJlZHVjZXJCb2R5LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbjtcblxuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIG5lc3RlZCBmaWVsZCBvciBsaW5rXG4gICAgICAgICAgICBpZiAoY29sbGVjdGlvbk5vZGUuYm9keVtrZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgaXQgZXhpc3RzXG4gICAgICAgICAgICAgICAgY29uc3QgbGlua2VyID0gY29sbGVjdGlvbi5nZXRMaW5rZXIoa2V5KTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIGl0J3MgYSBsaW5rXG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzRGVub3JtYWxpemVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTdWJCb2R5RGVub3JtYWxpemVkKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlRmllbGQgPSBsaW5rZXIubGlua0NvbmZpZy5kZW5vcm1hbGl6ZS5maWVsZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVBZGRGaWVsZChjYWNoZUZpZWxkLCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGVtYmVkUmVkdWNlcldpdGhMaW5rKHJlZHVjZXJOb2RlLCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUuZ2V0Q29sbGVjdGlvbk5vZGUoa2V5KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBoYW5kbGVBZGRGaWVsZChrZXksIHZhbHVlLCBjb2xsZWN0aW9uTm9kZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IGV4aXN0LCBzbyBpdCBtYXkgYmUgYSBsaW5rL3JlZHVjZXIvZmllbGRcbiAgICAgICAgICAgICAgICBoYW5kbGVBZGRFbGVtZW50KHJlZHVjZXJOb2RlLCBjb2xsZWN0aW9uTm9kZSwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGlzIGZpZWxkIG9yIG90aGVyIHJlZHVjZXIgZXhpc3RzIHdpdGhpbiB0aGUgY29sbGVjdGlvblxuXG4gICAgICAgICAgICBpZiAoIWNvbGxlY3Rpb25Ob2RlLmJvZHlba2V5XSkge1xuICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIGZpZWxkIG9yIGFub3RoZXIgcmVkdWNlciBmb3IgdGhpcy5cbiAgICAgICAgICAgICAgICBjb25zdCByZWR1Y2VyID0gY29sbGVjdGlvbi5nZXRSZWR1Y2VyKGtleSk7XG4gICAgICAgICAgICAgICAgaWYgKHJlZHVjZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgaXQncyBhbm90aGVyIHJlZHVjZXJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUFkZFJlZHVjZXIoa2V5LCByZWR1Y2VyLCBjb2xsZWN0aW9uTm9kZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUFkZEZpZWxkKGtleSwgdmFsdWUsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59Il19
