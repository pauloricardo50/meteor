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
var key, ids, what, params, body, cacher, dotize;

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
    if (this.isVirtual) {
      this._virtualAction('set', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
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
    if (this.isVirtual) {
      this._virtualAction('set', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *set* in a relationship that is single. Please use add/remove for *many* relationships');
  }

  unset(what) {
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
    if (this.isVirtual) {
      this._virtualAction('add', what);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
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
    if (this.isVirtual) {
      this._virtualAction('set', what);

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
    if (this.isVirtual) {
      this._virtualAction('add', what, metadata);

      return this;
    }

    throw new Meteor.Error('invalid-command', 'You are trying to *add* in a relationship that is single. Please use set/unset for *single* relationships');
  }

  remove(what) {
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
  let filters = _.extend({}, node.props.$filters);

  let options = _.extend({}, node.props.$options);

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
  return fieldName.split('.').reduce((acc, key) => {
    if (acc.length === 0) {
      return [key];
    }

    const [last] = acc;
    return [...acc, `${last}.${key}`];
  }, []);
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

    _.extend(this.props, {
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
    return !!_.find(this.fieldNodes, fieldNode => {
      return _.contains(options, fieldNode.name);
    });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9hZ2dyZWdhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9jb21wb3NlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvY3JlYXRlUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9kYi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4cG9zdXJlLmNvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9leHBvc3VyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2V4dGVuc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9jbGVhbkJvZHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvY2xlYW5TZWxlY3RvcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvZW5mb3JjZU1heERlcHRoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvbGliL2VuZm9yY2VNYXhMaW1pdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9yZXN0cmljdExpbmtzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZ3JhcGhxbC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvQm9keS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2dyYXBocWwvbGliL2FzdFRvUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9ncmFwaHFsL2xpYi9kZWZhdWx0cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2NvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saW5rZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55TWV0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9saW5rT25lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpYi9zbWFydEFyZ3VtZW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9saWIvbWVyZ2VEZWVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuYmFzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvY29uc3RhbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvdW50U3Vic2NyaXB0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2Fzc2VtYmxlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2NvbnN0YW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9oeXBlcm5vdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvc3RvcmVIeXBlcm5vdmFSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9hcHBseVByb3BzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbGliL2NhbGxXaXRoUHJvbWlzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9kb3RpemUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvZmllbGRJblByb2plY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9yZWN1cnNpdmVGZXRjaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvZmllbGROb2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvcmVkdWNlck5vZGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYWRkRmllbGRNYXAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvZW1iZWRSZWR1Y2VyV2l0aExpbmsuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTmFtZWRRdWVyeVN0b3JlIiwiTGlua0NvbnN0YW50cyIsImxpbmsiLCJkZWZhdWx0IiwidiIsIlByb21pc2UiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJhZ2dyZWdhdGUiLCJwaXBlbGluZXMiLCJvcHRpb25zIiwiY29sbCIsInJhd0NvbGxlY3Rpb24iLCJyZXN1bHQiLCJNZXRlb3IiLCJ3cmFwQXN5bmMiLCJBcnJheSIsImlzQXJyYXkiLCJhd2FpdCIsInRvQXJyYXkiLCJkZWVwRXh0ZW5kIiwiZXhwb3J0RGVmYXVsdCIsImFyZ3MiLCJRdWVyeSIsIk5hbWVkUXVlcnkiLCJuYW1lIiwiYm9keSIsIl8iLCJpc0Z1bmN0aW9uIiwiY3JlYXRlTmFtZWRRdWVyeSIsImVudHJ5UG9pbnROYW1lIiwiZmlyc3QiLCJrZXlzIiwiY29sbGVjdGlvbiIsImdldCIsIkVycm9yIiwiaXNEZXZlbG9wbWVudCIsImNvbnNvbGUiLCJ3YXJuIiwicGFyYW1zIiwiY3JlYXRlTm9ybWFsUXVlcnkiLCJuYW1lZFF1ZXJ5IiwicXVlcnkiLCJhZGQiLCJjbG9uZSIsImRiIiwiUHJveHkiLCJvYmoiLCJwcm9wIiwiZXh0ZW5kIiwiY3JlYXRlUXVlcnkiLCJFeHBvc3VyZURlZmF1bHRzIiwiRXhwb3N1cmVTY2hlbWEiLCJ2YWxpZGF0ZUJvZHkiLCJjcmVhdGVHcmFwaCIsIk1hdGNoIiwiYmxvY2tpbmciLCJtZXRob2QiLCJwdWJsaWNhdGlvbiIsImZpcmV3YWxsIiwiTWF5YmUiLCJPbmVPZiIsIkZ1bmN0aW9uIiwibWF4TGltaXQiLCJJbnRlZ2VyIiwibWF4RGVwdGgiLCJCb29sZWFuIiwiT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkcyIsIlN0cmluZyIsInJlc3RyaWN0TGlua3MiLCJlIiwidG9TdHJpbmciLCJFeHBvc3VyZSIsImdlbkNvdW50RW5kcG9pbnQiLCJyZWN1cnNpdmVDb21wb3NlIiwiaHlwZXJub3ZhIiwiZW5mb3JjZU1heERlcHRoIiwiZW5mb3JjZU1heExpbWl0IiwiY2xlYW5Cb2R5IiwiZGVlcENsb25lIiwicmVzdHJpY3RGaWVsZHNGbiIsImNoZWNrIiwiZ2xvYmFsQ29uZmlnIiwic2V0Q29uZmlnIiwiY29uZmlnIiwiYXNzaWduIiwiZ2V0Q29uZmlnIiwicmVzdHJpY3RGaWVsZHMiLCJjb25zdHJ1Y3RvciIsIl9faXNFeHBvc2VkRm9yR3JhcGhlciIsIl9fZXhwb3N1cmUiLCJfbmFtZSIsIl92YWxpZGF0ZUFuZENsZWFuIiwiaW5pdFNlY3VyaXR5IiwiaW5pdFB1YmxpY2F0aW9uIiwiaW5pdE1ldGhvZCIsImluaXRDb3VudE1ldGhvZCIsImluaXRDb3VudFB1YmxpY2F0aW9uIiwiZ2V0VHJhbnNmb3JtZWRCb2R5IiwidXNlcklkIiwicHJvY2Vzc2VkQm9keSIsImdldEJvZHkiLCJjYWxsIiwiYmluZCIsInB1Ymxpc2hDb21wb3NpdGUiLCJ0cmFuc2Zvcm1lZEJvZHkiLCJyb290Tm9kZSIsImJ5cGFzc0ZpcmV3YWxscyIsIm1ldGhvZEJvZHkiLCJ1bmJsb2NrIiwibWV0aG9kcyIsImZpbmQiLCIkZmlsdGVycyIsImNvdW50IiwiZ2V0Q3Vyc29yIiwic2Vzc2lvbiIsImZpbHRlcnMiLCJmaWVsZHMiLCJfaWQiLCJnZXRTZXNzaW9uIiwiZmluZE9uZSIsInVuZGVmaW5lZCIsIl9jYWxsRmlyZXdhbGwiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJmb3JFYWNoIiwiZmlyZSIsImV4cG9zZSIsImlzU2VydmVyIiwiY2xlYW5GaWx0ZXJzIiwiY2xlYW5PcHRpb25zIiwiZG90aXplIiwibWFpbiIsInNlY29uZCIsIm9iamVjdCIsIiRvcHRpb25zIiwiZ2V0RmllbGRzIiwiZWFjaCIsInNlY29uZFZhbHVlIiwia2V5IiwidmFsdWUiLCJpc09iamVjdCIsImNvbnZlcnQiLCJmaWVsZEV4aXN0cyIsImVuc3VyZUZpZWxkcyIsInBpY2siLCJzb3J0IiwiZGVlcEZpbHRlckZpZWxkc0FycmF5IiwiZGVlcEZpbHRlckZpZWxkc09iamVjdCIsInNwZWNpYWwiLCJjb250YWlucyIsImZpZWxkIiwiZWxlbWVudCIsImkiLCJpbmRleE9mIiwiZ2V0RGVwdGgiLCJub2RlIiwiZGVwdGgiLCJjb2xsZWN0aW9uTm9kZXMiLCJtYXgiLCJtYXAiLCJsaW1pdCIsImNsZWFuT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkIiwibWF0Y2hpbmciLCJzdWJmaWVsZCIsInNsaWNlIiwiZ2V0TGlua3MiLCJwYXJlbnROb2RlIiwicmVzdHJpY3RlZExpbmtzIiwiY29sbGVjdGlvbk5vZGUiLCJsaW5rTmFtZSIsInJlbW92ZSIsImV4cG9zdXJlIiwiY29uZmlnUmVzdHJpY3RMaW5rcyIsImFzdFRvUXVlcnkiLCJzZXRBc3RUb1F1ZXJ5RGVmYXVsdHMiLCJTeW1ib2xzIiwiYXN0VG9Cb2R5IiwiQVJHVU1FTlRTIiwiU3ltYm9sIiwiYXN0IiwiZmllbGROb2RlcyIsImV4dHJhY3RTZWxlY3Rpb25TZXQiLCJzZWxlY3Rpb25TZXQiLCJzZXQiLCJzZWxlY3Rpb25zIiwiZWwiLCJhcmd1bWVudE1hcCIsImFyZyIsImdldE1heERlcHRoIiwiZGVueSIsImNsZWFyRW1wdHlPYmplY3RzIiwiY3JlYXRlR2V0QXJncyIsImRlZmF1bHRzIiwiaW50ZXJzZWN0RGVlcCIsIkVycm9ycyIsIk1BWF9ERVBUSCIsImVtYm9keSIsIk51bWJlciIsImludGVyc2VjdCIsImN1cnJlbnRNYXhEZXB0aCIsImdldEFyZ3MiLCJkZXB0aHMiLCJwdXNoIiwiTWF0aCIsInBhcnRzIiwic3BsaXQiLCJhY2Nlc3NvciIsInNoaWZ0Iiwic2hvdWxkRGVsZXRlIiwicGF0aCIsInN0b3BwZWQiLCJEZW5vcm1hbGl6ZVNjaGVtYSIsIkxpbmtDb25maWdEZWZhdWx0cyIsIkxpbmtDb25maWdTY2hlbWEiLCJieXBhc3NTY2hlbWEiLCJ0eXBlIiwiV2hlcmUiLCJfY29sbGVjdGlvbiIsIm1ldGFkYXRhIiwiaW52ZXJzZWRCeSIsImluZGV4IiwidW5pcXVlIiwiYXV0b3JlbW92ZSIsImRlbm9ybWFsaXplIiwiT2JqZWN0SW5jbHVkaW5nIiwiTElOS19TVE9SQUdFIiwiTGlua2VyIiwiYWRkTGlua3MiLCJkYXRhIiwibGlua0NvbmZpZyIsImxpbmtlciIsImdldExpbmtlciIsImhhc0xpbmsiLCJnZXRMaW5rIiwib2JqZWN0T3JJZCIsImxpbmtEYXRhIiwiaXNWaXJ0dWFsIiwibGlua1N0b3JhZ2VGaWVsZCIsImNyZWF0ZUxpbmsiLCJMaW5rTWFueSIsIkxpbmtNYW55TWV0YSIsIkxpbmtPbmUiLCJMaW5rT25lTWV0YSIsInNtYXJ0QXJndW1lbnRzIiwiZG90IiwiYWNjZXNzIiwibWFpbkNvbGxlY3Rpb24iLCJfaW5pdEF1dG9yZW1vdmUiLCJfaW5pdERlbm9ybWFsaXphdGlvbiIsIl9oYW5kbGVSZWZlcmVuY2VSZW1vdmFsRm9yVmlydHVhbExpbmtzIiwiX2luaXRJbmRleCIsIm9uZVR5cGVzIiwic3RyYXRlZ3kiLCJpc01hbnkiLCJyZWxhdGVkTGlua2VyIiwiZ2V0TGlua2VkQ29sbGVjdGlvbiIsImlzU2luZ2xlIiwiaXNNZXRhIiwiaXNPbmVSZXN1bHQiLCJoZWxwZXJDbGFzcyIsIl9nZXRIZWxwZXJDbGFzcyIsImNvbGxlY3Rpb25OYW1lIiwiX3ByZXBhcmVWaXJ0dWFsIiwiX2dlbmVyYXRlRmllbGROYW1lIiwic3RhcnR1cCIsIl9zZXR1cFZpcnR1YWxDb25maWciLCJ2aXJ0dWFsTGlua0NvbmZpZyIsImNsZWFuZWRDb2xsZWN0aW9uTmFtZSIsInJlcGxhY2UiLCJkZWZhdWx0RmllbGRQcmVmaXgiLCJhZnRlciIsImRvYyIsImZldGNoQXNBcnJheSIsImxpbmtlZE9iaiIsInVuc2V0IiwiX2Vuc3VyZUluZGV4Iiwic3BhcnNlIiwiJGluIiwiZ2V0SWRzIiwiaWRzIiwiZmV0Y2giLCJpdGVtIiwicGFja2FnZUV4aXN0cyIsIlBhY2thZ2UiLCJjYWNoZUNvbmZpZyIsInJlZmVyZW5jZUZpZWxkU3VmZml4IiwiaW52ZXJzZWRMaW5rIiwicmVmZXJlbmNlRmllbGQiLCJjYWNoZUZpZWxkIiwiY2FjaGUiLCJpc0Rlbm9ybWFsaXplZCIsImlzU3ViQm9keURlbm9ybWFsaXplZCIsImNhY2hlQm9keSIsImNhY2hlQm9keUZpZWxkcyIsImJvZHlGaWVsZHMiLCJvbWl0IiwiZGlmZmVyZW5jZSIsImNyZWF0ZVNlYXJjaEZpbHRlcnMiLCJjcmVhdGVPbmUiLCJjcmVhdGVPbmVWaXJ0dWFsIiwiY3JlYXRlT25lTWV0YSIsImNyZWF0ZU9uZU1ldGFWaXJ0dWFsIiwiY3JlYXRlTWFueSIsImNyZWF0ZU1hbnlWaXJ0dWFsIiwiY3JlYXRlTWFueU1ldGEiLCJjcmVhdGVNYW55TWV0YVZpcnR1YWwiLCJzaWZ0IiwiZmllbGRTdG9yYWdlIiwibWV0YUZpbHRlcnMiLCJyb290IiwibmVzdGVkIiwiYXJyIiwidW5pcSIsInVuaW9uIiwiam9pbiIsInBsdWNrIiwiJGVsZW1NYXRjaCIsIkxpbmsiLCJTbWFydEFyZ3MiLCJsaW5rZWRDb2xsZWN0aW9uIiwiJG1ldGFGaWx0ZXJzIiwiJG1ldGEiLCJzZWFyY2hGaWx0ZXJzIiwiYXBwbGllZEZpbHRlcnMiLCJvdGhlcnMiLCJjbGVhbiIsImlkZW50aWZ5SWQiLCJ3aGF0Iiwic2F2ZVRvRGF0YWJhc2UiLCJnZXRJZCIsImlkZW50aWZ5SWRzIiwiX3ZhbGlkYXRlSWRzIiwidmFsaWRJZHMiLCJfdmlydHVhbEFjdGlvbiIsImFjdGlvbiIsInJldmVyc2VkTGluayIsImVsZW1lbnRJZCIsImluc2VydCIsIl9pZHMiLCJtb2RpZmllciIsIiRhZGRUb1NldCIsIiRlYWNoIiwidXBkYXRlIiwiZmlsdGVyIiwiJHB1bGwiLCJtZXRhZGF0YXMiLCJsb2NhbE1ldGFkYXRhIiwiZXh0ZW5kTWV0YWRhdGEiLCJleGlzdGluZ01ldGFkYXRhIiwic3ViZmllbGRVcGRhdGUiLCIkc2V0Iiwic3ViV2hhdCIsIk5hbWVkUXVlcnlCYXNlIiwiaXNOYW1lZFF1ZXJ5IiwicXVlcnlOYW1lIiwicmVzb2x2ZXIiLCJzdWJzY3JpcHRpb25IYW5kbGUiLCJpc0V4cG9zZWQiLCJpc1Jlc29sdmVyIiwic2V0UGFyYW1zIiwiZG9WYWxpZGF0ZVBhcmFtcyIsInZhbGlkYXRlUGFyYW1zIiwiX3ZhbGlkYXRlIiwidmFsaWRhdGlvbkVycm9yIiwiZXJyb3IiLCJuZXdQYXJhbXMiLCJjYWNoZXIiLCJleHBvc2VDb25maWciLCJ2YWxpZGF0b3IiLCJkZWZhdWx0T3B0aW9ucyIsIkNvdW50U3Vic2NyaXB0aW9uIiwicmVjdXJzaXZlRmV0Y2giLCJwcmVwYXJlRm9yUHJvY2VzcyIsImNhbGxXaXRoUHJvbWlzZSIsIkJhc2UiLCJMb2NhbENvbGxlY3Rpb24iLCJzdWJzY3JpYmUiLCJjYWxsYmFjayIsInN1YnNjcmliZUNvdW50IiwiX2NvdW50ZXIiLCJ1bnN1YnNjcmliZSIsInN0b3AiLCJ1bnN1YnNjcmliZUNvdW50IiwiZmV0Y2hTeW5jIiwiZmV0Y2hPbmVTeW5jIiwiY2FsbGJhY2tPck9wdGlvbnMiLCJfZmV0Y2hTdGF0aWMiLCJfZmV0Y2hSZWFjdGl2ZSIsImZldGNoT25lIiwiZXJyIiwicmVzIiwiZ2V0Q291bnRTeW5jIiwiZ2V0Q291bnQiLCIkYm9keSIsImFsbG93U2tpcCIsInNraXAiLCJzY29wZWQiLCJOYW1lZFF1ZXJ5Q2xpZW50IiwiTmFtZWRRdWVyeVNlcnZlciIsIk1lbW9yeVJlc3VsdENhY2hlciIsImNvbnRleHQiLCJfcGVyZm9ybVNlY3VyaXR5Q2hlY2tzIiwiX2ZldGNoUmVzb2x2ZXJEYXRhIiwiZG9FbWJvZGltZW50SWZJdEFwcGxpZXMiLCJjYWNoZUlkIiwiZ2VuZXJhdGVRdWVyeUlkIiwiY291bnRDdXJzb3IiLCJnZXRDdXJzb3JGb3JDb3VudGluZyIsImNhY2hlUmVzdWx0cyIsInJlc29sdmUiLCJmbiIsInNlbGYiLCJzdG9yYWdlIiwiZ2V0QWxsIiwiQmFzZVJlc3VsdENhY2hlciIsIkVKU09OIiwic3RyaW5naWZ5IiwiZmV0Y2hEYXRhIiwiY2xvbmVEZWVwIiwiREVGQVVMVF9UVEwiLCJzdG9yZSIsImNhY2hlRGF0YSIsInN0b3JlRGF0YSIsInR0bCIsInNldFRpbWVvdXQiLCJFeHBvc2VTY2hlbWEiLCJFeHBvc2VEZWZhdWx0cyIsIm1lcmdlRGVlcCIsIl9pbml0Tm9ybWFsUXVlcnkiLCJfaW5pdE1ldGhvZCIsIl9pbml0UHVibGljYXRpb24iLCJfaW5pdENvdW50TWV0aG9kIiwiX2luaXRDb3VudFB1YmxpY2F0aW9uIiwiX3VuYmxvY2tJZk5lY2Vzc2FyeSIsImlzU2NvcGVkIiwiZW5hYmxlU2NvcGUiLCJ0YXJnZXQiLCJzb3VyY2UiLCJRdWVyeUJhc2UiLCJpc0dsb2JhbFF1ZXJ5IiwiUXVlcnlDbGllbnQiLCJRdWVyeVNlcnZlciIsIkNPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCIsIlJlYWN0aXZlVmFyIiwiVHJhY2tlciIsIkNvdW50cyIsImNyZWF0ZUZhdXhTdWJzY3JpcHRpb24iLCJhY2Nlc3NUb2tlbiIsImZhdXhIYW5kbGUiLCJlcXVhbHMiLCJsYXN0QXJncyIsInRva2VuIiwiX21hcmtlZEZvclVuc3Vic2NyaWJlIiwiZGlzY29ubmVjdENvbXB1dGF0aW9uIiwiYXV0b3J1biIsImhhbmRsZURpc2Nvbm5lY3QiLCJpZCIsInN0YXR1cyIsImNvbm5lY3RlZCIsIl9tYXJrZWRGb3JSZXN1bWUiLCJpc1N1YnNjcmliZWQiLCJjb3VudE1hbmFnZXIiLCJyZWFkeSIsInBhcmFtc09yQm9keSIsInNlc3Npb25JZCIsIkpTT04iLCJleGlzdGluZ1Nlc3Npb24iLCJwdWJsaXNoIiwicmVxdWVzdCIsInBhcnNlIiwiY3Vyc29yIiwiaXNSZWFkeSIsImhhbmRsZSIsIm9ic2VydmUiLCJhZGRlZCIsImNoYW5nZWQiLCJyZW1vdmVkIiwib25TdG9wIiwiQWdncmVnYXRlRmlsdGVycyIsImV4dHJhY3RJZHNGcm9tQXJyYXkiLCJhcnJheSIsInBhcmVudE9iamVjdHMiLCJwYXJlbnQiLCJyZXN1bHRzIiwiY3JlYXRlIiwiZWxpZ2libGVPYmplY3RzIiwic3RvcmFnZXMiLCJhcnJheU9mSWRzIiwiaXNWYWxpZCIsImNsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMiLCJjaGlsZENvbGxlY3Rpb25Ob2RlIiwiYWdncmVnYXRlUmVzdWx0cyIsImFsbFJlc3VsdHMiLCJtZXRhRmlsdGVyc1Rlc3QiLCJwYXJlbnRSZXN1bHQiLCJlbGlnaWJsZUFnZ3JlZ2F0ZVJlc3VsdHMiLCJhZ2dyZWdhdGVSZXN1bHQiLCJkYXRhcyIsImNvbXBhcmF0b3IiLCJjaGlsZExpbmtOYW1lIiwicGFyZW50UmVzdWx0cyIsInJlc3VsdHNCeUtleUlkIiwiZ3JvdXBCeSIsImZpbHRlckFzc2VtYmxlZERhdGEiLCJTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVCIsImNvbnRhaW5zRG90dGVkRmllbGRzIiwicGlwZWxpbmUiLCIkbWF0Y2giLCIkc29ydCIsImRhdGFQdXNoIiwic2FmZUZpZWxkIiwiJGdyb3VwIiwiJHB1c2giLCIkc2xpY2UiLCIkcHJvamVjdCIsImh5cGVybm92YUluaXQiLCJhcHBseVByb3BzIiwicHJlcGFyZUZvckRlbGl2ZXJ5Iiwic3RvcmVIeXBlcm5vdmFSZXN1bHRzIiwidXNlcklkVG9QYXNzIiwiYXNzZW1ibGUiLCJhc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMiLCJidWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lIiwic25hcEJhY2tEb3R0ZWRGaWVsZHMiLCJhZ2dyZWdhdGVGaWx0ZXJzIiwiZmlsdGVyZWRPcHRpb25zIiwiYWdncmVnYXRpb25SZXN1bHQiLCJkb2N1bWVudCIsIlJlZ0V4cCIsInJlc3RyaWN0T3B0aW9ucyIsInByb3BzIiwiYXBwbHlGaWVsZHMiLCJteVBhcmFtZXRlcnMiLCJyZWplY3QiLCJyZWFzb24iLCJzcGVjaWFsRmllbGRzIiwiY3JlYXRlTm9kZXMiLCJhZGRGaWVsZE5vZGUiLCJnZXROb2RlTmFtZXNwYWNlIiwiQ29sbGVjdGlvbk5vZGUiLCJGaWVsZE5vZGUiLCJSZWR1Y2VyTm9kZSIsImNyZWF0ZVJlZHVjZXJzIiwiZmllbGROYW1lIiwiYWRkUHJvcCIsImhhbmRsZURlbm9ybWFsaXplZCIsInN1YnJvb3QiLCJyZWR1Y2VyIiwiZ2V0UmVkdWNlciIsInJlZHVjZXJOb2RlIiwiaXNQcm9qZWN0aW9uT3BlcmF0b3JFeHByZXNzaW9uIiwiZG90dGVkIiwiZmllbGROb2RlIiwibiIsInJldmVyc2UiLCJzbmFwQ2FjaGUiLCJwcmVmaXgiLCJuZXdPYmoiLCJyZWN1cnNlIiwibyIsInAiLCJpc0FycmF5SXRlbSIsImYiLCJpc0VtcHR5QXJyYXkiLCJnZXRGaWVsZE5hbWUiLCJpc0VtcHR5T2JqIiwiaXNOdW1iZXIiLCJpc05hTiIsInBhcnNlSW50IiwiaGFzT3duUHJvcGVydHkiLCJleHBhbmRGaWVsZCIsImlzRmllbGRJblByb2plY3Rpb24iLCJyZWR1Y2UiLCJhY2MiLCJsYXN0IiwicHJvamVjdGlvbiIsImNoZWNrTmVzdGVkIiwic29tZSIsIkVYVEVOREVEX1NQRUNJQUxfRklFTERTIiwiaXNDbGllbnRWYWx1ZVZhbGlkIiwidmFsdWVzIiwiZXZlcnkiLCJuZXN0ZWRWYWx1ZSIsImludGVyc2VjdEZpZWxkcyIsImFsbG93ZWQiLCJjbGllbnQiLCJpbnRlcnNlY3Rpb24iLCJwYWlycyIsImNsaWVudFZhbHVlIiwic2VydmVyVmFsdWUiLCJhbGxvd2VkQm9keSIsImNsaWVudEJvZHkiLCJidWlsZCIsImFwcGx5UG9zdEZpbHRlcnMiLCJhcHBseVBvc3RPcHRpb25zIiwiZ2V0UmVzdWx0c0FycmF5IiwicmVtb3ZlTGlua1N0b3JhZ2VzIiwic3RvcmVPbmVSZXN1bHRzIiwiYXNzZW1ibGVNZXRhZGF0YSIsImFwcGx5UmVkdWNlcnMiLCJjbGVhblJlZHVjZXJMZWZ0b3ZlcnMiLCJNaW5pbW9uZ28iLCJzbmFwQmFja0NhY2hlcyIsImNsb25lTWV0YUNoaWxkcmVuIiwiYXBwbHlQb3N0RmlsdGVyIiwicG9zdEZpbHRlcnMiLCIkcG9zdEZpbHRlcnMiLCIkcG9zdE9wdGlvbnMiLCJzb3J0ZXIiLCJTb3J0ZXIiLCJnZXRDb21wYXJhdG9yIiwic3RhcnQiLCJlbmQiLCIkcG9zdEZpbHRlciIsImlzVW5kZWZpbmVkIiwic2FtZUxldmVsUmVzdWx0cyIsInJlbW92ZVN0b3JhZ2VGaWVsZCIsInNob3VsZENsZWFuU3RvcmFnZSIsInJlbW92ZUZyb21SZXN1bHQiLCJyZW1vdmVFbXB0eVJvb3QiLCJpc0VtcHR5IiwiY2hpbGRSZXN1bHRzIiwiY2hpbGRSZXN1bHQiLCJzdG9yZU1ldGFkYXRhIiwicGFyZW50RWxlbWVudCIsIiRtZXRhZGF0YSIsInN0b3JhZ2VJdGVtIiwic25hcENhY2hlcyIsInNuYXBDYWNoZXNTaW5nbGVzIiwic2hvdWRTdG9yZUxpbmtTdG9yYWdlIiwiZGVmYXVsdEZpbHRlckZ1bmN0aW9uIiwiYXBwbHlGaWx0ZXJSZWN1cnNpdmUiLCJpc1Jvb3QiLCIkZmlsdGVyIiwiYXBwbHlQYWdpbmF0aW9uIiwiX3BhcmFtcyIsIl9ib2R5IiwicGF0Y2hDdXJzb3IiLCJucyIsIm9yaWdpbmFsT2JzZXJ2ZSIsImNhbGxiYWNrcyIsIm5ld0NhbGxiYWNrcyIsImNvbXBvc2UiLCJjaGlsZHJlbiIsInBhcmVudE9iamVjdCIsImZldGNoT3B0aW9ucyIsInNjb3BlUXVlcnkiLCIkZXhpc3RzIiwiY29sbGVjdGlvbk5vZGVSZXN1bHRzIiwicnVuRmllbGRTYW5pdHlDaGVja3MiLCJub2RlcyIsInNjaGVkdWxlZEZvckRlbGV0aW9uIiwicmVkdWNlcnMiLCJyZWR1Y2VyTm9kZXMiLCJfc2hvdWxkQ2xlYW5TdG9yYWdlIiwiX25vZGUiLCJoYXNBZGRlZEFueUZpZWxkIiwicHJvamVjdGlvbk9wZXJhdG9yIiwiaGFzIiwiaGFzRmllbGQiLCJnZXRGaWVsZCIsImhhc0NvbGxlY3Rpb25Ob2RlIiwiaGFzUmVkdWNlck5vZGUiLCJnZXRSZWR1Y2VyTm9kZSIsImdldENvbGxlY3Rpb25Ob2RlIiwiZ2V0TmFtZSIsInN1YkxpbmtOYW1lIiwiaXNQcm9qZWN0aW9uT3BlcmF0b3IiLCJyZWR1Y2VGdW5jdGlvbiIsImRlcGVuZGVuY2llcyIsImNvbXB1dGUiLCJhZGRGaWVsZE1hcCIsImFkZFJlZHVjZXJzIiwicmVkdWNlckNvbmZpZyIsInJlZHVjZXJOYW1lIiwiZGJGaWVsZCIsInByb2Nlc3NlZFJlZHVjZXJzIiwicmVkdWNlcnNRdWV1ZSIsImFsbERlcGVuZGVuY2llc0NvbXB1dGVkIiwiYWxsIiwiZGVwIiwiaW5jbHVkZXMiLCJmbGF0dGVuIiwiY2xlYW5OZXN0ZWRGaWVsZHMiLCJzbmFwQ2FjaGVGaWVsZCIsImhhbmRsZUFkZEVsZW1lbnQiLCJoYW5kbGVBZGRSZWR1Y2VyIiwiaGFuZGxlQWRkTGluayIsImhhbmRsZUFkZEZpZWxkIiwiZW1iZWRSZWR1Y2VyV2l0aExpbmsiLCJjaGlsZFJlZHVjZXJOb2RlIiwiZG90cyIsImFkZEZpZWxkSWZSZXF1aXJlZCIsIm5lc3RlZEZpZWxkcyIsInN0YXJ0c1dpdGgiLCJyZWR1Y2VyQm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxpQkFBZSxFQUFDLE1BQUlBLGVBQXJCO0FBQXFDQyxlQUFhLEVBQUMsTUFBSUE7QUFBdkQsQ0FBZDtBQUFxRkgsTUFBTSxDQUFDSSxJQUFQLENBQVksb0JBQVo7QUFBa0NKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLGlCQUFaO0FBQStCSixNQUFNLENBQUNJLElBQVAsQ0FBWSw2QkFBWjtBQUEyQ0osTUFBTSxDQUFDSSxJQUFQLENBQVksMEJBQVo7QUFBd0NKLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLG1DQUFaO0FBQWlESixNQUFNLENBQUNJLElBQVAsQ0FBWSxzQ0FBWjtBQUFvRCxJQUFJRixlQUFKO0FBQW9CRixNQUFNLENBQUNJLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixtQkFBZSxHQUFDSSxDQUFoQjtBQUFrQjs7QUFBOUIsQ0FBckMsRUFBcUUsQ0FBckU7QUFBd0UsSUFBSUgsYUFBSjtBQUFrQkgsTUFBTSxDQUFDSSxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0MsU0FBTyxDQUFDQyxDQUFELEVBQUc7QUFBQ0gsaUJBQWEsR0FBQ0csQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBcEMsRUFBa0UsQ0FBbEU7QUFBcUVOLE1BQU0sQ0FB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ckMsb0JBQU1zSixVQUFVLEdBQUcxRCxNQUFNLENBQUNELFVBQVAsQ0FBa0JOLFdBQWxCLENBQThCMUUsS0FBakQ7QUFDQTJoQiw0QkFBYyxDQUFDaFosVUFBRCxFQUFhdEosS0FBYixFQUFvQjhCLGNBQXBCLENBQWQ7QUFDQTtBQUNIO0FBQ0o7O0FBRUR5Z0IsOEJBQW9CLENBQUM1SSxXQUFELEVBQWMzWixLQUFkLEVBQXFCOEIsY0FBYyxDQUFDZ2YsaUJBQWYsQ0FBaUMvZ0IsR0FBakMsQ0FBckIsQ0FBcEI7QUFDQTtBQUNIOztBQUVEdWlCLHNCQUFjLENBQUN2aUIsR0FBRCxFQUFNQyxLQUFOLEVBQWE4QixjQUFiLENBQWQ7QUFDSCxPQW5CRCxNQW1CTztBQUNIO0FBQ0FxZ0Isd0JBQWdCLENBQUN4SSxXQUFELEVBQWM3WCxjQUFkLEVBQThCL0IsR0FBOUIsRUFBbUNDLEtBQW5DLENBQWhCO0FBQ0g7QUFDSixLQXpCRCxNQXlCTztBQUNIO0FBRUEsVUFBSSxDQUFDOEIsY0FBYyxDQUFDakosSUFBZixDQUFvQmtILEdBQXBCLENBQUwsRUFBK0I7QUFDM0I7QUFDQSxjQUFNMFosT0FBTyxHQUFHcmdCLFVBQVUsQ0FBQ3NnQixVQUFYLENBQXNCM1osR0FBdEIsQ0FBaEI7O0FBQ0EsWUFBSTBaLE9BQUosRUFBYTtBQUNUO0FBQ0EsaUJBQU8ySSxnQkFBZ0IsQ0FBQ3JpQixHQUFELEVBQU0wWixPQUFOLEVBQWUzWCxjQUFmLENBQXZCO0FBQ0g7O0FBRUQsZUFBT3dnQixjQUFjLENBQUN2aUIsR0FBRCxFQUFNQyxLQUFOLEVBQWE4QixjQUFiLENBQXJCO0FBQ0g7QUFDSjtBQUNKLEdBMUNEO0FBMkNILEMiLCJmaWxlIjoiL3BhY2thZ2VzL2N1bHRvZmNvZGVyc19ncmFwaGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2xpYi9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9hZ2dyZWdhdGUnO1xuaW1wb3J0ICcuL2xpYi9leHBvc3VyZS9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9saW5rcy9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMnO1xuaW1wb3J0ICcuL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlTdG9yZSBmcm9tICcuL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlJztcbmltcG9ydCBMaW5rQ29uc3RhbnRzIGZyb20gJy4vbGliL2xpbmtzL2NvbnN0YW50cyc7XG5cbmV4cG9ydCB7IE5hbWVkUXVlcnlTdG9yZSwgTGlua0NvbnN0YW50cyB9O1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNyZWF0ZVF1ZXJ5IH0gZnJvbSAnLi9saWIvY3JlYXRlUXVlcnkuanMnO1xuXG5leHBvcnQgeyBkZWZhdWx0IGFzIE5hbWVkUXVlcnkgfSBmcm9tICcuL2xpYi9uYW1lZFF1ZXJ5L25hbWVkUXVlcnkuc2VydmVyJztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBFeHBvc3VyZSB9IGZyb20gJy4vbGliL2V4cG9zdXJlL2V4cG9zdXJlLmpzJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIE1lbW9yeVJlc3VsdENhY2hlcixcbn0gZnJvbSAnLi9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXInO1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgQmFzZVJlc3VsdENhY2hlcixcbn0gZnJvbSAnLi9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyJztcblxuZXhwb3J0IHsgZGVmYXVsdCBhcyBjb21wb3NlIH0gZnJvbSAnLi9saWIvY29tcG9zZSc7XG5cbmV4cG9ydCAqIGZyb20gJy4vbGliL2dyYXBocWwnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBkYiB9IGZyb20gJy4vbGliL2RiJztcbiIsImltcG9ydCB7IFByb21pc2UgfSBmcm9tICdtZXRlb3IvcHJvbWlzZSc7XG5cbk1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLmFnZ3JlZ2F0ZSA9IGZ1bmN0aW9uKHBpcGVsaW5lcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgY29sbCA9IHRoaXMucmF3Q29sbGVjdGlvbigpO1xuXG4gICAgbGV0IHJlc3VsdCA9IE1ldGVvci53cmFwQXN5bmMoY29sbC5hZ2dyZWdhdGUsIGNvbGwpKHBpcGVsaW5lcywgb3B0aW9ucyk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIElmIGl0J3MgYW4gQWdncmVnYXRpb25DdXJzb3JcbiAgICAvLyBUaGUgcmVhc29uIHdlIGRvIHRoaXMgd2FzIGJlY2F1c2Ugb2YgdGhlIHVwZ3JhZGUgdG8gMS43IHdoaWNoIGludm9sdmVkIGEgbW9uZ29kYiBkcml2ZXIgdXBkYXRlXG4gICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0KSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLmF3YWl0KHJlc3VsdC50b0FycmF5KCkpO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgZGVlcEV4dGVuZCBmcm9tICdkZWVwLWV4dGVuZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIGRlZXBFeHRlbmQoe30sIC4uLmFyZ3MpO1xufSIsImltcG9ydCBRdWVyeSBmcm9tICcuL3F1ZXJ5L3F1ZXJ5LmpzJztcbmltcG9ydCBOYW1lZFF1ZXJ5IGZyb20gJy4vbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmpzJztcbmltcG9ydCBOYW1lZFF1ZXJ5U3RvcmUgZnJvbSAnLi9uYW1lZFF1ZXJ5L3N0b3JlLmpzJztcblxuLyoqXG4gKiBUaGlzIGlzIGEgcG9seW1vcnBoaWMgZnVuY3Rpb24sIGl0IGFsbG93cyB5b3UgdG8gY3JlYXRlIGEgcXVlcnkgYXMgYW4gb2JqZWN0XG4gKiBvciBpdCBhbHNvIGFsbG93cyB5b3UgdG8gcmUtdXNlIGFuIGV4aXN0aW5nIHF1ZXJ5IGlmIGl0J3MgYSBuYW1lZCBvbmVcbiAqXG4gKiBAcGFyYW0gYXJnc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBkZWZhdWx0ICguLi5hcmdzKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICBsZXQgW25hbWUsIGJvZHksIG9wdGlvbnNdID0gYXJncztcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgLy8gSXQncyBhIHJlc29sdmVyIHF1ZXJ5XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oYm9keSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KG5hbWUsIG51bGwsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZW50cnlQb2ludE5hbWUgPSBfLmZpcnN0KF8ua2V5cyhib2R5KSk7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChlbnRyeVBvaW50TmFtZSk7XG5cbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLW5hbWUnLCBgV2UgY291bGQgbm90IGZpbmQgYW55IGNvbGxlY3Rpb24gd2l0aCB0aGUgbmFtZSBcIiR7ZW50cnlQb2ludE5hbWV9XCIuIE1ha2Ugc3VyZSBpdCBpcyBpbXBvcnRlZCBwcmlvciB0byB1c2luZyB0aGlzYClcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KG5hbWUsIGNvbGxlY3Rpb24sIGJvZHlbZW50cnlQb2ludE5hbWVdLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBRdWVyeSBDcmVhdGlvbiwgaXQgY2FuIGhhdmUgYW4gZW5kcG9pbnQgYXMgY29sbGVjdGlvbiBvciBhcyBhIE5hbWVkUXVlcnlcbiAgICAgICAgbGV0IFtib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnROYW1lID0gXy5maXJzdChfLmtleXMoYm9keSkpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQoZW50cnlQb2ludE5hbWUpO1xuXG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKE1ldGVvci5pc0RldmVsb3BtZW50ICYmICFOYW1lZFF1ZXJ5U3RvcmUuZ2V0KGVudHJ5UG9pbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgWW91IGFyZSBjcmVhdGluZyBhIHF1ZXJ5IHdpdGggdGhlIGVudHJ5IHBvaW50IFwiJHtlbnRyeVBvaW50TmFtZX1cIiwgYnV0IHRoZXJlIHdhcyBubyBjb2xsZWN0aW9uIGZvdW5kIGZvciBpdCAobWF5YmUgeW91IGZvcmdvdCB0byBpbXBvcnQgaXQgY2xpZW50LXNpZGU/KS4gSXQncyBhc3N1bWVkIHRoYXQgaXQncyByZWZlcmVuY2luZyBhIE5hbWVkUXVlcnkuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5hbWVkUXVlcnkoZW50cnlQb2ludE5hbWUsIG51bGwsIHt9LCB7cGFyYW1zOiBib2R5W2VudHJ5UG9pbnROYW1lXX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5vcm1hbFF1ZXJ5KGNvbGxlY3Rpb24sIGJvZHlbZW50cnlQb2ludE5hbWVdLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBpZiBpdCBleGlzdHMgYWxyZWFkeSwgd2UgcmUtdXNlIGl0XG4gICAgY29uc3QgbmFtZWRRdWVyeSA9IE5hbWVkUXVlcnlTdG9yZS5nZXQobmFtZSk7XG4gICAgbGV0IHF1ZXJ5O1xuXG4gICAgaWYgKCFuYW1lZFF1ZXJ5KSB7XG4gICAgICAgIHF1ZXJ5ID0gbmV3IE5hbWVkUXVlcnkobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyk7XG4gICAgICAgIE5hbWVkUXVlcnlTdG9yZS5hZGQobmFtZSwgcXVlcnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5ID0gbmFtZWRRdWVyeS5jbG9uZShvcHRpb25zLnBhcmFtcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHF1ZXJ5O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb3JtYWxRdWVyeShjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zKSAge1xuICAgIHJldHVybiBuZXcgUXVlcnkoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuY29uc3QgZGIgPSBuZXcgUHJveHkoXG4gIHt9LFxuICB7XG4gICAgZ2V0OiBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KHByb3ApO1xuXG4gICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgcmV0dXJuIG9ialtwcm9wXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfSxcbiAgfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgZGI7XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeS9xdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbmFtZWRRdWVyeS9zdG9yZS5qcyc7XG5cbl8uZXh0ZW5kKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgY3JlYXRlUXVlcnkoLi4uYXJncykge1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvL05hbWVkUXVlcnlcbiAgICAgICAgICAgIGNvbnN0IFtuYW1lLCBib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IG5ldyBOYW1lZFF1ZXJ5KG5hbWUsIHRoaXMsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICAgICAgTmFtZWRRdWVyeVN0b3JlLmFkZChuYW1lLCBxdWVyeSk7XG5cbiAgICAgICAgICAgIHJldHVybiBxdWVyeTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IFtib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgUXVlcnkodGhpcywgYm9keSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iLCJpbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi4vcXVlcnkvbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCB7TWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbmV4cG9ydCBjb25zdCBFeHBvc3VyZURlZmF1bHRzID0ge1xuICAgIGJsb2NraW5nOiBmYWxzZSxcbiAgICBtZXRob2Q6IHRydWUsXG4gICAgcHVibGljYXRpb246IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgRXhwb3N1cmVTY2hlbWEgPSB7XG4gICAgZmlyZXdhbGw6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW0Z1bmN0aW9uXSlcbiAgICApLFxuICAgIG1heExpbWl0OiBNYXRjaC5NYXliZShNYXRjaC5JbnRlZ2VyKSxcbiAgICBtYXhEZXB0aDogTWF0Y2guTWF5YmUoTWF0Y2guSW50ZWdlciksXG4gICAgcHVibGljYXRpb246IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIG1ldGhvZDogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgYmxvY2tpbmc6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGJvZHk6IE1hdGNoLk1heWJlKE9iamVjdCksXG4gICAgcmVzdHJpY3RlZEZpZWxkczogTWF0Y2guTWF5YmUoW1N0cmluZ10pLFxuICAgIHJlc3RyaWN0TGlua3M6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW1N0cmluZ10pXG4gICAgKSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUJvZHkoY29sbGVjdGlvbiwgYm9keSkge1xuICAgIHRyeSB7XG4gICAgICAgIGNyZWF0ZUdyYXBoKGNvbGxlY3Rpb24sIGJvZHkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1ib2R5JywgJ1dlIGNvdWxkIG5vdCBidWlsZCBhIHZhbGlkIGdyYXBoIHdoZW4gdHJ5aW5nIHRvIGNyZWF0ZSB5b3VyIGV4cG9zdXJlOiAnICsgZS50b1N0cmluZygpKVxuICAgIH1cbn0iLCJpbXBvcnQgZ2VuQ291bnRFbmRwb2ludCBmcm9tICcuLi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyLmpzJztcbmltcG9ydCBjcmVhdGVHcmFwaCBmcm9tICcuLi9xdWVyeS9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZUNvbXBvc2UgZnJvbSAnLi4vcXVlcnkvbGliL3JlY3Vyc2l2ZUNvbXBvc2UuanMnO1xuaW1wb3J0IGh5cGVybm92YSBmcm9tICcuLi9xdWVyeS9oeXBlcm5vdmEvaHlwZXJub3ZhLmpzJztcbmltcG9ydCB7XG4gICAgRXhwb3N1cmVTY2hlbWEsXG4gICAgRXhwb3N1cmVEZWZhdWx0cyxcbiAgICB2YWxpZGF0ZUJvZHksXG59IGZyb20gJy4vZXhwb3N1cmUuY29uZmlnLnNjaGVtYS5qcyc7XG5pbXBvcnQgZW5mb3JjZU1heERlcHRoIGZyb20gJy4vbGliL2VuZm9yY2VNYXhEZXB0aC5qcyc7XG5pbXBvcnQgZW5mb3JjZU1heExpbWl0IGZyb20gJy4vbGliL2VuZm9yY2VNYXhMaW1pdC5qcyc7XG5pbXBvcnQgY2xlYW5Cb2R5IGZyb20gJy4vbGliL2NsZWFuQm9keS5qcyc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHJlc3RyaWN0RmllbGRzRm4gZnJvbSAnLi9saWIvcmVzdHJpY3RGaWVsZHMuanMnO1xuaW1wb3J0IHJlc3RyaWN0TGlua3MgZnJvbSAnLi9saWIvcmVzdHJpY3RMaW5rcy5qcyc7XG5pbXBvcnQgeyBjaGVjayB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbmxldCBnbG9iYWxDb25maWcgPSB7fTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwb3N1cmUge1xuICAgIHN0YXRpYyBzZXRDb25maWcoY29uZmlnKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZ2xvYmFsQ29uZmlnLCBjb25maWcpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiBnbG9iYWxDb25maWc7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc3RyaWN0RmllbGRzKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHJlc3RyaWN0RmllbGRzRm4oLi4uYXJncyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbiwgY29uZmlnID0ge30pIHtcbiAgICAgICAgY29sbGVjdGlvbi5fX2lzRXhwb3NlZEZvckdyYXBoZXIgPSB0cnVlO1xuICAgICAgICBjb2xsZWN0aW9uLl9fZXhwb3N1cmUgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gICAgICAgIHRoaXMubmFtZSA9IGBleHBvc3VyZV8ke2NvbGxlY3Rpb24uX25hbWV9YDtcblxuICAgICAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVBbmRDbGVhbigpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNlY3VyaXR5KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRQdWJsaWNhdGlvbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5pbml0TWV0aG9kKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLm1ldGhvZCAmJiAhdGhpcy5jb25maWcucHVibGljYXRpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ3dlaXJkJyxcbiAgICAgICAgICAgICAgICAnSWYgeW91IHdhbnQgdG8gZXhwb3NlIHlvdXIgY29sbGVjdGlvbiB5b3UgbmVlZCB0byBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBvZiBbXCJtZXRob2RcIiwgXCJwdWJsaWNhdGlvblwiXSBvcHRpb25zIHRvIHRydWUnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0Q291bnRNZXRob2QoKTtcbiAgICAgICAgdGhpcy5pbml0Q291bnRQdWJsaWNhdGlvbigpO1xuICAgIH1cblxuICAgIF92YWxpZGF0ZUFuZENsZWFuKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuY29uZmlnID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJld2FsbCA9IHRoaXMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSB7IGZpcmV3YWxsIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgICAgICB7fSxcbiAgICAgICAgICAgIEV4cG9zdXJlRGVmYXVsdHMsXG4gICAgICAgICAgICBFeHBvc3VyZS5nZXRDb25maWcoKSxcbiAgICAgICAgICAgIHRoaXMuY29uZmlnXG4gICAgICAgICk7XG4gICAgICAgIGNoZWNrKHRoaXMuY29uZmlnLCBFeHBvc3VyZVNjaGVtYSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmJvZHkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlQm9keSh0aGlzLmNvbGxlY3Rpb24sIHRoaXMuY29uZmlnLmJvZHkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGFrZXMgdGhlIGJvZHkgYW5kIGludGVyc2VjdHMgaXQgd2l0aCB0aGUgZXhwb3N1cmUgYm9keSwgaWYgaXQgZXhpc3RzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGJvZHlcbiAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZ2V0VHJhbnNmb3JtZWRCb2R5KGJvZHksIHVzZXJJZCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybiBib2R5O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJvY2Vzc2VkQm9keSA9IHRoaXMuZ2V0Qm9keSh1c2VySWQpO1xuXG4gICAgICAgIGlmIChwcm9jZXNzZWRCb2R5ID09PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xlYW5Cb2R5KHByb2Nlc3NlZEJvZHksIGJvZHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGV4cG9zdXJlIGJvZHlcbiAgICAgKi9cbiAgICBnZXRCb2R5KHVzZXJJZCkge1xuICAgICAgICBpZiAoIXRoaXMuY29uZmlnLmJvZHkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ21pc3NpbmctYm9keScsXG4gICAgICAgICAgICAgICAgJ0Nhbm5vdCBnZXQgZXhwb3N1cmUgYm9keSBiZWNhdXNlIGl0IHdhcyBub3QgZGVmaW5lZC4nXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odGhpcy5jb25maWcuYm9keSkpIHtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLmNvbmZpZy5ib2R5LmNhbGwodGhpcywgdXNlcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLmNvbmZpZy5ib2R5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQgbWVhbnMgd2UgYWxsb3cgZXZlcnl0aGluZywgbm8gbmVlZCBmb3IgY2xvbmluZy5cbiAgICAgICAgaWYgKGJvZHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShib2R5LCB1c2VySWQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemluZyB0aGUgcHVibGljYXRpb24gZm9yIHJlYWN0aXZlIHF1ZXJ5IGZldGNoaW5nXG4gICAgICovXG4gICAgaW5pdFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uc3QgZ2V0VHJhbnNmb3JtZWRCb2R5ID0gdGhpcy5nZXRUcmFuc2Zvcm1lZEJvZHkuYmluZCh0aGlzKTtcblxuICAgICAgICBNZXRlb3IucHVibGlzaENvbXBvc2l0ZSh0aGlzLm5hbWUsIGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEJvZHkgPSBnZXRUcmFuc2Zvcm1lZEJvZHkoYm9keSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb3ROb2RlID0gY3JlYXRlR3JhcGgoY29sbGVjdGlvbiwgdHJhbnNmb3JtZWRCb2R5KTtcblxuICAgICAgICAgICAgZW5mb3JjZU1heERlcHRoKHJvb3ROb2RlLCBjb25maWcubWF4RGVwdGgpO1xuICAgICAgICAgICAgcmVzdHJpY3RMaW5rcyhyb290Tm9kZSwgdGhpcy51c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVjdXJzaXZlQ29tcG9zZShyb290Tm9kZSwgdGhpcy51c2VySWQsIHtcbiAgICAgICAgICAgICAgICBieXBhc3NGaXJld2FsbHM6ICEhY29uZmlnLmJvZHksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXogdGhlIG1ldGhvZCB0byByZXRyaWV2ZSB0aGUgZGF0YSB2aWEgTWV0ZW9yLmNhbGxcbiAgICAgKi9cbiAgICBpbml0TWV0aG9kKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uc3QgZ2V0VHJhbnNmb3JtZWRCb2R5ID0gdGhpcy5nZXRUcmFuc2Zvcm1lZEJvZHkuYmluZCh0aGlzKTtcblxuICAgICAgICBjb25zdCBtZXRob2RCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgICAgICAgaWYgKCFjb25maWcuYmxvY2tpbmcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmxvY2soKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkQm9keSA9IGdldFRyYW5zZm9ybWVkQm9keShib2R5KTtcblxuICAgICAgICAgICAgY29uc3Qgcm9vdE5vZGUgPSBjcmVhdGVHcmFwaChjb2xsZWN0aW9uLCB0cmFuc2Zvcm1lZEJvZHkpO1xuXG4gICAgICAgICAgICBlbmZvcmNlTWF4RGVwdGgocm9vdE5vZGUsIGNvbmZpZy5tYXhEZXB0aCk7XG4gICAgICAgICAgICByZXN0cmljdExpbmtzKHJvb3ROb2RlLCB0aGlzLnVzZXJJZCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGV4cG9zdXJlIGJvZHkgZGVmaW5lZCwgdGhlbiB3ZSBuZWVkIHRvIGFwcGx5IGZpcmV3YWxsc1xuICAgICAgICAgICAgcmV0dXJuIGh5cGVybm92YShyb290Tm9kZSwgdGhpcy51c2VySWQsIHtcbiAgICAgICAgICAgICAgICBieXBhc3NGaXJld2FsbHM6ICEhY29uZmlnLmJvZHksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lXTogbWV0aG9kQm9keSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgdGhlIG1ldGhvZCB0byByZXRyaWV2ZSB0aGUgY291bnQgb2YgdGhlIGRhdGEgdmlhIE1ldGVvci5jYWxsXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgaW5pdENvdW50TWV0aG9kKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG4gICAgICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgICAgICAgIFt0aGlzLm5hbWUgKyAnLmNvdW50J10oYm9keSkge1xuICAgICAgICAgICAgICAgIHRoaXMudW5ibG9jaygpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoYm9keS4kZmlsdGVycyB8fCB7fSwge30sIHRoaXMudXNlcklkKVxuICAgICAgICAgICAgICAgICAgICAuY291bnQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIHRoZSByZWFjdGl2ZSBlbmRwb2ludCB0byByZXRyaWV2ZSB0aGUgY291bnQgb2YgdGhlIGRhdGEuXG4gICAgICovXG4gICAgaW5pdENvdW50UHVibGljYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cbiAgICAgICAgZ2VuQ291bnRFbmRwb2ludCh0aGlzLm5hbWUsIHtcbiAgICAgICAgICAgIGdldEN1cnNvcih7IHNlc3Npb24gfSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb24uZmlsdGVycyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzOiB7IF9pZDogMSB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVzZXJJZFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBnZXRTZXNzaW9uKGJvZHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geyBmaWx0ZXJzOiBib2R5LiRmaWx0ZXJzIHx8IHt9IH07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyBzZWN1cml0eSBlbmZvcmNlbWVudFxuICAgICAqIFRISU5LOiBNYXliZSBpbnN0ZWFkIG9mIG92ZXJyaWRpbmcgLmZpbmQsIEkgY291bGQgc3RvcmUgdGhpcyBkYXRhIG9mIHNlY3VyaXR5IGluc2lkZSB0aGUgY29sbGVjdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgaW5pdFNlY3VyaXR5KCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuICAgICAgICBjb25zdCB7IGZpcmV3YWxsLCBtYXhMaW1pdCwgcmVzdHJpY3RlZEZpZWxkcyB9ID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGZpbmQgPSBjb2xsZWN0aW9uLmZpbmQuYmluZChjb2xsZWN0aW9uKTtcbiAgICAgICAgY29uc3QgZmluZE9uZSA9IGNvbGxlY3Rpb24uZmluZE9uZS5iaW5kKGNvbGxlY3Rpb24pO1xuXG4gICAgICAgIGNvbGxlY3Rpb24uZmlyZXdhbGwgPSAoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKSA9PiB7XG4gICAgICAgICAgICBpZiAodXNlcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jYWxsRmlyZXdhbGwoXG4gICAgICAgICAgICAgICAgICAgIHsgY29sbGVjdGlvbjogY29sbGVjdGlvbiB9LFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzLFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICB1c2VySWRcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgZW5mb3JjZU1heExpbWl0KG9wdGlvbnMsIG1heExpbWl0KTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN0cmljdGVkRmllbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgIEV4cG9zdXJlLnJlc3RyaWN0RmllbGRzKGZpbHRlcnMsIG9wdGlvbnMsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb2xsZWN0aW9uLmZpbmQgPSBmdW5jdGlvbihmaWx0ZXJzLCBvcHRpb25zID0ge30sIHVzZXJJZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgZmlsdGVycyBpcyB1bmRlZmluZWQgaXQgc2hvdWxkIHJldHVybiBhbiBlbXB0eSBpdGVtXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgZmlsdGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmQodW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmluZChmaWx0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb2xsZWN0aW9uLmZpbmRPbmUgPSBmdW5jdGlvbihcbiAgICAgICAgICAgIGZpbHRlcnMsXG4gICAgICAgICAgICBvcHRpb25zID0ge30sXG4gICAgICAgICAgICB1c2VySWQgPSB1bmRlZmluZWRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBJZiBmaWx0ZXJzIGlzIHVuZGVmaW5lZCBpdCBzaG91bGQgcmV0dXJuIGFuIGVtcHR5IGl0ZW1cbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBmaWx0ZXJzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWx0ZXJzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSB7IF9pZDogZmlsdGVycyB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb2xsZWN0aW9uLmZpcmV3YWxsKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG5cbiAgICAgICAgICAgIHJldHVybiBmaW5kT25lKGZpbHRlcnMsIG9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGxGaXJld2FsbCguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZmlyZXdhbGwgfSA9IHRoaXMuY29uZmlnO1xuICAgICAgICBpZiAoIWZpcmV3YWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0FycmF5KGZpcmV3YWxsKSkge1xuICAgICAgICAgICAgZmlyZXdhbGwuZm9yRWFjaChmaXJlID0+IHtcbiAgICAgICAgICAgICAgICBmaXJlLmNhbGwoLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmNhbGwoLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgRXhwb3N1cmUgZnJvbSAnLi9leHBvc3VyZS5qcyc7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICBleHBvc2UoY29uZmlnKSB7XG4gICAgICAgIGlmICghTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICdub3QtYWxsb3dlZCcsXG4gICAgICAgICAgICAgICAgYFlvdSBjYW4gb25seSBleHBvc2UgYSBjb2xsZWN0aW9uIHNlcnZlciBzaWRlLiAke3RoaXMuX25hbWV9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ldyBFeHBvc3VyZSh0aGlzLCBjb25maWcpO1xuICAgIH0sXG59KTtcbiIsImltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NsZWFuRmlsdGVycywgY2xlYW5PcHRpb25zfSBmcm9tICcuL2NsZWFuU2VsZWN0b3JzJztcbmltcG9ydCBkb3RpemUgZnJvbSAnLi4vLi4vcXVlcnkvbGliL2RvdGl6ZSc7XG5cbi8qKlxuICogRGVlcCBJbnRlciBDb21wdXRhdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGVhbkJvZHkobWFpbiwgc2Vjb25kLCAuLi5hcmdzKSB7XG4gICAgbGV0IG9iamVjdCA9IHt9O1xuXG4gICAgaWYgKHNlY29uZC4kZmlsdGVycyB8fCBzZWNvbmQuJG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZmllbGRzID0gZ2V0RmllbGRzKG1haW4pO1xuXG4gICAgICAgIGNsZWFuRmlsdGVycyhzZWNvbmQuJGZpbHRlcnMsIGZpZWxkcyk7XG4gICAgICAgIGNsZWFuT3B0aW9ucyhzZWNvbmQuJG9wdGlvbnMsIGZpZWxkcyk7XG4gICAgfVxuXG4gICAgXy5lYWNoKHNlY29uZCwgKHNlY29uZFZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGtleSA9PT0gJyRmaWx0ZXJzJyB8fCBrZXkgPT09ICckb3B0aW9ucycpIHtcbiAgICAgICAgICAgIG9iamVjdFtrZXldID0gc2Vjb25kVmFsdWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdmFsdWUgPSBtYWluW2tleV07XG5cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIGEgZnVuY3Rpb24sIHdlIHJ1biBpdC5cbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuY2FsbChudWxsLCAuLi5hcmdzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIHVuZGVmaW5lZCBvciBmYWxzZSwgd2Ugc2tpcCB0aGUgbWVyZ2VcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3ZSB0cmVhdCB0aGlzIHNwZWNpYWxseSwgaWYgdGhlIHZhbHVlIGlzIHRydWVcbiAgICAgICAgaWYgKHZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IF8uaXNPYmplY3Qoc2Vjb25kVmFsdWUpID8gZGVlcENsb25lKHNlY29uZFZhbHVlKSA6IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIG1haW4gdmFsdWUgaXMgYW4gb2JqZWN0XG4gICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKF8uaXNPYmplY3Qoc2Vjb25kVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIHNlY29uZCBvbmUgaXMgYW4gb2JqZWN0IGFzIHdlbGwgd2UgcnVuIHJlY3Vyc2l2ZWx5IHJ1biB0aGUgaW50ZXJzZWN0aW9uXG4gICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBjbGVhbkJvZHkodmFsdWUsIHNlY29uZFZhbHVlLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGlmIGl0IGlzIG5vdCwgdGhlbiB3ZSB3aWxsIGlnbm9yZSBpdCwgYmVjYXVzZSBpdCB3b24ndCBtYWtlIHNlbnNlLlxuICAgICAgICAgICAgLy8gdG8gbWVyZ2Uge2E6IDF9IHdpdGggMS5cblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIG1haW4gdmFsdWUgaXMgbm90IGFuIG9iamVjdCwgaXQgc2hvdWxkIGJlIGEgdHJ1dGh5IHZhbHVlIGxpa2UgMVxuICAgICAgICBpZiAoXy5pc09iamVjdChzZWNvbmRWYWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzZWNvbmQgdmFsdWUgaXMgYW4gb2JqZWN0LCB0aGVuIHdlIHdpbGwga2VlcCBpdC5cbiAgICAgICAgICAgIC8vIHRoaXMgd29uJ3QgY2F1c2UgcHJvYmxlbSB3aXRoIGRlZXAgbmVzdGluZyBiZWNhdXNlXG4gICAgICAgICAgICAvLyB3aGVuIHlvdSBzcGVjaWZ5IGxpbmtzIHlvdSB3aWxsIGhhdmUgdGhlIG1haW4gdmFsdWUgYXMgYW4gb2JqZWN0LCBvdGhlcndpc2UgaXQgd2lsbCBmYWlsXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHVzZWQgZm9yIHRoaW5ncyBsaWtlIHdoZW4geW91IGhhdmUgYSBoYXNoIG9iamVjdCBsaWtlIHByb2ZpbGUgd2l0aCBtdWx0aXBsZSBuZXN0aW5nIGZpZWxkcywgeW91IGNhbiBhbGxvdyB0aGUgY2xpZW50IHRvIHNwZWNpZnkgb25seSB3aGF0IGhlIG5lZWRzXG5cbiAgICAgICAgICAgIG9iamVjdFtrZXldID0gZGVlcENsb25lKHNlY29uZFZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoZSBzZWNvbmQgdmFsdWUgaXMgbm90IGFuIG9iamVjdCwgd2UganVzdCBzdG9yZSB0aGUgZmlyc3QgdmFsdWVcbiAgICAgICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBvYmplY3Q7XG59XG5cbmZ1bmN0aW9uIGdldEZpZWxkcyhib2R5KSB7XG4gICAgcmV0dXJuIF8ua2V5cyhkb3RpemUuY29udmVydChib2R5KSk7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhvcHRpb25zLCBlbnN1cmVGaWVsZHMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmZpZWxkcykge1xuICAgICAgICBvcHRpb25zLmZpZWxkcyA9IF8ucGljayhvcHRpb25zLmZpZWxkcywgLi4uZW5zdXJlRmllbGRzKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zb3J0KSB7XG4gICAgICAgIG9wdGlvbnMuc29ydCA9IF8ucGljayhvcHRpb25zLnNvcnQsIC4uLmVuc3VyZUZpZWxkcyk7XG4gICAgfVxufVxuXG5jb25zdCBkZWVwRmlsdGVyRmllbGRzQXJyYXkgPSBbJyRhbmQnLCAnJG9yJywgJyRub3InXTtcbmNvbnN0IGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QgPSBbJyRub3QnXTtcbmNvbnN0IHNwZWNpYWwgPSBbLi4uZGVlcEZpbHRlckZpZWxkc0FycmF5LCAuLi5kZWVwRmlsdGVyRmllbGRzT2JqZWN0XTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuRmlsdGVycyhmaWx0ZXJzLCBlbnN1cmVGaWVsZHMpIHtcbiAgICBpZiAoIWZpbHRlcnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF8uZWFjaChmaWx0ZXJzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoIV8uY29udGFpbnMoc3BlY2lhbCwga2V5KSkge1xuICAgICAgICAgICAgaWYgKCFmaWVsZEV4aXN0cyhlbnN1cmVGaWVsZHMsIGtleSkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgZmlsdGVyc1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBkZWVwRmlsdGVyRmllbGRzQXJyYXkuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2ZpZWxkXSkge1xuICAgICAgICAgICAgZmlsdGVyc1tmaWVsZF0uZm9yRWFjaChlbGVtZW50ID0+IGNsZWFuRmlsdGVycyhlbGVtZW50LCBlbnN1cmVGaWVsZHMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc09iamVjdC5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBjbGVhbkZpbHRlcnMoZmlsdGVyc1tmaWVsZF0sIGVuc3VyZUZpZWxkcyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBUaGlzIHdpbGwgY2hlY2sgaWYgYSBmaWVsZCBleGlzdHMgaW4gYSBzZXQgb2YgZmllbGRzXG4gKiBJZiBmaWVsZHMgY29udGFpbnMgW1wicHJvZmlsZVwiXSwgdGhlbiBcInByb2ZpbGUuc29tZXRoaW5nXCIgd2lsbCByZXR1cm4gdHJ1ZVxuICpcbiAqIEBwYXJhbSBmaWVsZHNcbiAqIEBwYXJhbSBrZXlcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmllbGRFeGlzdHMoZmllbGRzLCBrZXkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpZWxkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoZmllbGRzW2ldID09PSBrZXkgfHwga2V5LmluZGV4T2YoZmllbGRzW2ldICsgJy4nKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAobm9kZSwgbWF4RGVwdGgpIHtcbiAgICBpZiAobWF4RGVwdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBjb25zdCBkZXB0aCA9IGdldERlcHRoKG5vZGUpO1xuXG4gICAgaWYgKGRlcHRoID4gbWF4RGVwdGgpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcigndG9vLWRlZXAnLCAnWW91ciBncmFwaCByZXF1ZXN0IGlzIHRvbyBkZWVwIGFuZCBpdCBpcyBub3QgYWxsb3dlZC4nKVxuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVwdGgobm9kZSkge1xuICAgIGlmIChub2RlLmNvbGxlY3Rpb25Ob2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIDEgKyBfLm1heChcbiAgICAgICAgXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGdldERlcHRoKVxuICAgICk7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnMsIG1heExpbWl0KSB7XG4gICAgaWYgKG1heExpbWl0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmxpbWl0KSB7XG4gICAgICAgIGlmIChvcHRpb25zLmxpbWl0ID4gbWF4TGltaXQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMubGltaXQgPSBtYXhMaW1pdDtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMubGltaXQgPSBtYXhMaW1pdDtcbiAgICB9XG59IiwiY29uc3QgZGVlcEZpbHRlckZpZWxkc0FycmF5ID0gWyckYW5kJywgJyRvcicsICckbm9yJ107XG5jb25zdCBkZWVwRmlsdGVyRmllbGRzT2JqZWN0ID0gWyckbm90J107XG5cbi8qKlxuICogVGhpcyBpcyB1c2VkIHRvIHJlc3RyaWN0IHNvbWUgZmllbGRzIHRvIHNvbWUgdXNlcnMsIGJ5IHBhc3NpbmcgdGhlIGZpZWxkcyBhcyBhcnJheSBpbiB0aGUgZXhwb3N1cmUgb2JqZWN0XG4gKiBGb3IgZXhhbXBsZSBpbiBhbiB1c2VyIGV4cG9zdXJlOiByZXN0cmljdEZpZWxkcyhvcHRpb25zLCBbJ3NlcnZpY2VzJywgJ2NyZWF0ZWRBdCddKVxuICpcbiAqIEBwYXJhbSBmaWx0ZXJzIE9iamVjdFxuICogQHBhcmFtIG9wdGlvbnMgT2JqZWN0XG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkcyBBcnJheVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXN0cmljdEZpZWxkcyhmaWx0ZXJzLCBvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKSB7XG4gICAgaWYgKCFfLmlzQXJyYXkocmVzdHJpY3RlZEZpZWxkcykpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1wYXJhbWV0ZXJzJywgJ1BsZWFzZSBzcGVjaWZ5IGFuIGFycmF5IG9mIHJlc3RyaWN0ZWQgZmllbGRzLicpO1xuICAgIH1cblxuICAgIGNsZWFuRmlsdGVycyhmaWx0ZXJzLCByZXN0cmljdGVkRmllbGRzKTtcbiAgICBjbGVhbk9wdGlvbnMob3B0aW9ucywgcmVzdHJpY3RlZEZpZWxkcylcbn1cblxuLyoqXG4gKiBEZWVwIGNsZWFucyBmaWx0ZXJzXG4gKlxuICogQHBhcmFtIGZpbHRlcnNcbiAqIEBwYXJhbSByZXN0cmljdGVkRmllbGRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuRmlsdGVycyhmaWx0ZXJzLCByZXN0cmljdGVkRmllbGRzKSB7XG4gICAgaWYgKGZpbHRlcnMpIHtcbiAgICAgICAgY2xlYW5PYmplY3QoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgfVxuXG4gICAgZGVlcEZpbHRlckZpZWxkc0FycmF5LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRdLmZvckVhY2goZWxlbWVudCA9PiBjbGVhbkZpbHRlcnMoZWxlbWVudCwgcmVzdHJpY3RlZEZpZWxkcykpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBkZWVwRmlsdGVyRmllbGRzT2JqZWN0LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIGNsZWFuRmlsdGVycyhmaWx0ZXJzW2ZpZWxkXSwgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLyoqXG4gKiBEZWVwbHkgY2xlYW5zIG9wdGlvbnNcbiAqXG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQHBhcmFtIHJlc3RyaWN0ZWRGaWVsZHNcbiAqL1xuZnVuY3Rpb24gY2xlYW5PcHRpb25zKG9wdGlvbnMsIHJlc3RyaWN0ZWRGaWVsZHMpIHtcbiAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgY2xlYW5PYmplY3Qob3B0aW9ucy5maWVsZHMsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuXG4gICAgICAgIGlmIChfLmtleXMob3B0aW9ucy5maWVsZHMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgXy5leHRlbmQob3B0aW9ucy5maWVsZHMsIHtfaWQ6IDF9KVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5maWVsZHMgPSB7X2lkOiAxfTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5zb3J0KSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KG9wdGlvbnMuc29ydCwgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgfVxufVxuXG4vKipcbiAqIENsZWFucyB0aGUgb2JqZWN0IChub3QgZGVlcGx5KVxuICpcbiAqIEBwYXJhbSBvYmplY3RcbiAqIEBwYXJhbSByZXN0cmljdGVkRmllbGRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuT2JqZWN0KG9iamVjdCwgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIF8uZWFjaChvYmplY3QsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIHJlc3RyaWN0ZWRGaWVsZHMuZm9yRWFjaCgocmVzdHJpY3RlZEZpZWxkKSA9PiB7XG4gICAgICAgICAgICBpZiAobWF0Y2hpbmcocmVzdHJpY3RlZEZpZWxkLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9iamVjdFtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBmaWVsZCA9PSBzdWJmaWVsZCBvciBpZiBgJHtmaWVsZH0uYCBJTkNMVURFRCBpbiBzdWJmaWVsZFxuICogRXhhbXBsZTogXCJwcm9maWxlXCIgYW5kIFwicHJvZmlsZS5maXJzdE5hbWVcIiB3aWxsIGJlIGEgbWF0Y2hpbmcgZmllbGRcbiAqIEBwYXJhbSBmaWVsZFxuICogQHBhcmFtIHN1YmZpZWxkXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gbWF0Y2hpbmcoZmllbGQsIHN1YmZpZWxkKSB7XG4gICAgaWYgKGZpZWxkID09PSBzdWJmaWVsZCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3ViZmllbGQuc2xpY2UoMCwgZmllbGQubGVuZ3RoICsgMSkgPT09IGZpZWxkICsgJy4nO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc3RyaWN0TGlua3MocGFyZW50Tm9kZSwgLi4uYXJncykge1xuICAgIGNvbnN0IHJlc3RyaWN0ZWRMaW5rcyA9IGdldExpbmtzKHBhcmVudE5vZGUsIC4uLmFyZ3MpO1xuXG4gICAgaWYgKCFyZXN0cmljdGVkTGlua3MgfHwgcmVzdHJpY3RlZExpbmtzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgXy5lYWNoKHBhcmVudE5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHJlc3RyaWN0ZWRMaW5rcywgY29sbGVjdGlvbk5vZGUubGlua05hbWUpKSB7XG4gICAgICAgICAgICBwYXJlbnROb2RlLnJlbW92ZShjb2xsZWN0aW9uTm9kZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldExpbmtzKG5vZGUsIC4uLmFyZ3MpIHtcbiAgICBpZiAobm9kZS5jb2xsZWN0aW9uICYmIG5vZGUuY29sbGVjdGlvbi5fX2V4cG9zdXJlKSB7XG4gICAgICAgIGNvbnN0IGV4cG9zdXJlID0gbm9kZS5jb2xsZWN0aW9uLl9fZXhwb3N1cmU7XG5cbiAgICAgICAgaWYgKGV4cG9zdXJlLmNvbmZpZy5yZXN0cmljdExpbmtzKSB7XG4gICAgICAgICAgICBjb25zdCBjb25maWdSZXN0cmljdExpbmtzID0gZXhwb3N1cmUuY29uZmlnLnJlc3RyaWN0TGlua3M7XG5cbiAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoY29uZmlnUmVzdHJpY3RMaW5rcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29uZmlnUmVzdHJpY3RMaW5rcztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1Jlc3RyaWN0TGlua3MoLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IGFzdFRvUXVlcnkgZnJvbSAnLi9saWIvYXN0VG9RdWVyeSc7XG5cbmV4cG9ydCB7IHNldEFzdFRvUXVlcnlEZWZhdWx0cyB9IGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgYXN0VG9Cb2R5IH0gZnJvbSAnLi9saWIvYXN0VG9Cb2R5JztcblxuT2JqZWN0LmFzc2lnbihNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICBhc3RUb1F1ZXJ5LFxufSk7XG5cbmV4cG9ydCB7IGFzdFRvUXVlcnkgfTtcbiIsImV4cG9ydCBjb25zdCBTeW1ib2xzID0ge1xuICBBUkdVTUVOVFM6IFN5bWJvbCgnYXJndW1lbnRzJyksXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3RUb0JvZHkoYXN0KSB7XG4gIGNvbnN0IGZpZWxkTm9kZXMgPSBhc3QuZmllbGROb2RlcztcblxuICBjb25zdCBib2R5ID0gZXh0cmFjdFNlbGVjdGlvblNldChhc3QuZmllbGROb2Rlc1swXS5zZWxlY3Rpb25TZXQpO1xuXG4gIHJldHVybiBib2R5O1xufVxuXG5mdW5jdGlvbiBleHRyYWN0U2VsZWN0aW9uU2V0KHNldCkge1xuICBsZXQgYm9keSA9IHt9O1xuICBzZXQuc2VsZWN0aW9ucy5mb3JFYWNoKGVsID0+IHtcbiAgICBpZiAoIWVsLnNlbGVjdGlvblNldCkge1xuICAgICAgYm9keVtlbC5uYW1lLnZhbHVlXSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvZHlbZWwubmFtZS52YWx1ZV0gPSBleHRyYWN0U2VsZWN0aW9uU2V0KGVsLnNlbGVjdGlvblNldCk7XG4gICAgICBpZiAoZWwuYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBsZXQgYXJndW1lbnRNYXAgPSB7fTtcbiAgICAgICAgZWwuYXJndW1lbnRzLmZvckVhY2goYXJnID0+IHtcbiAgICAgICAgICBhcmd1bWVudE1hcFthcmcubmFtZS52YWx1ZV0gPSBhcmcudmFsdWUudmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJvZHlbZWwubmFtZS52YWx1ZV1bU3ltYm9scy5BUkdVTUVOVFNdID0gYXJndW1lbnRNYXA7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYm9keTtcbn1cbiIsImltcG9ydCB7IGNoZWNrLCBNYXRjaCB9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgYXN0VG9Cb2R5LCB7IFN5bWJvbHMgfSBmcm9tICcuL2FzdFRvQm9keSc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9kZWZhdWx0cyc7XG5pbXBvcnQgaW50ZXJzZWN0RGVlcCBmcm9tICcuLi8uLi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcCc7XG5pbXBvcnQgZW5mb3JjZU1heExpbWl0IGZyb20gJy4uLy4uL2V4cG9zdXJlL2xpYi9lbmZvcmNlTWF4TGltaXQnO1xuXG5jb25zdCBFcnJvcnMgPSB7XG4gIE1BWF9ERVBUSDogJ1RoZSBtYXhpbXVtIGRlcHRoIG9mIHRoaXMgcmVxdWVzdCBleGNlZWRzIHRoZSBkZXB0aCBhbGxvd2VkLicsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhc3RUb1F1ZXJ5KGFzdCwgY29uZmlnID0ge30pIHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXM7XG5cbiAgY2hlY2soY29uZmlnLCB7XG4gICAgZW1ib2R5OiBNYXRjaC5NYXliZShGdW5jdGlvbiksXG4gICAgJGZpbHRlcnM6IE1hdGNoLk1heWJlKE9iamVjdCksXG4gICAgJG9wdGlvbnM6IE1hdGNoLk1heWJlKE9iamVjdCksXG4gICAgbWF4RGVwdGg6IE1hdGNoLk1heWJlKE51bWJlciksXG4gICAgbWF4TGltaXQ6IE1hdGNoLk1heWJlKE51bWJlciksXG4gICAgZGVueTogTWF0Y2guTWF5YmUoW1N0cmluZ10pLFxuICAgIGludGVyc2VjdDogTWF0Y2guTWF5YmUoT2JqZWN0KSxcbiAgfSk7XG5cbiAgY29uZmlnID0gT2JqZWN0LmFzc2lnbihcbiAgICB7XG4gICAgICAkb3B0aW9uczoge30sXG4gICAgICAkZmlsdGVyczoge30sXG4gICAgfSxcbiAgICBkZWZhdWx0cyxcbiAgICBjb25maWdcbiAgKTtcblxuICAvLyBnZXQgdGhlIGJvZHlcbiAgbGV0IGJvZHkgPSBhc3RUb0JvZHkoYXN0KTtcblxuICAvLyBmaXJzdCB3ZSBkbyB0aGUgaW50ZXJzZWN0aW9uXG4gIGlmIChjb25maWcuaW50ZXJzZWN0KSB7XG4gICAgYm9keSA9IGludGVyc2VjdERlZXAoY29uZmlnLmludGVyc2VjdCwgYm9keSk7XG4gIH1cblxuICAvLyBlbmZvcmNlIHRoZSBtYXhpbXVtIGFtb3VudCBvZiBkYXRhIHdlIGFsbG93IHRvIHJldHJpZXZlXG4gIGlmIChjb25maWcubWF4TGltaXQpIHtcbiAgICBlbmZvcmNlTWF4TGltaXQoY29uZmlnLiRvcHRpb25zLCBjb25maWcubWF4TGltaXQpO1xuICB9XG5cbiAgLy8gZmlndXJlIG91dCBkZXB0aCBiYXNlZFxuICBpZiAoY29uZmlnLm1heERlcHRoKSB7XG4gICAgY29uc3QgY3VycmVudE1heERlcHRoID0gZ2V0TWF4RGVwdGgoYm9keSk7XG4gICAgaWYgKGN1cnJlbnRNYXhEZXB0aCA+IGNvbmZpZy5tYXhEZXB0aCkge1xuICAgICAgdGhyb3cgRXJyb3JzLk1BWF9ERVBUSDtcbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLmRlbnkpIHtcbiAgICBkZW55KGJvZHksIGNvbmZpZy5kZW55KTtcbiAgfVxuXG4gIE9iamVjdC5hc3NpZ24oYm9keSwge1xuICAgICRmaWx0ZXJzOiBjb25maWcuJGZpbHRlcnMsXG4gICAgJG9wdGlvbnM6IGNvbmZpZy4kb3B0aW9ucyxcbiAgfSk7XG5cbiAgaWYgKGNvbmZpZy5lbWJvZHkpIHtcbiAgICBjb25zdCBnZXRBcmdzID0gY3JlYXRlR2V0QXJncyhib2R5KTtcbiAgICBjb25maWcuZW1ib2R5LmNhbGwobnVsbCwge1xuICAgICAgYm9keSxcbiAgICAgIGdldEFyZ3MsXG4gICAgfSk7XG4gIH1cblxuICAvLyB3ZSByZXR1cm4gdGhlIHF1ZXJ5XG4gIHJldHVybiB0aGlzLmNyZWF0ZVF1ZXJ5KGJvZHkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4RGVwdGgoYm9keSkge1xuICBsZXQgZGVwdGhzID0gW107XG4gIGZvciAoa2V5IGluIGJvZHkpIHtcbiAgICBpZiAoXy5pc09iamVjdChib2R5W2tleV0pKSB7XG4gICAgICBkZXB0aHMucHVzaChnZXRNYXhEZXB0aChib2R5W2tleV0pKTtcbiAgICB9XG4gIH1cblxuICBpZiAoZGVwdGhzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiAxO1xuICB9XG5cbiAgcmV0dXJuIE1hdGgubWF4KC4uLmRlcHRocykgKyAxO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVueShib2R5LCBmaWVsZHMpIHtcbiAgZmllbGRzLmZvckVhY2goZmllbGQgPT4ge1xuICAgIGxldCBwYXJ0cyA9IGZpZWxkLnNwbGl0KCcuJyk7XG4gICAgbGV0IGFjY2Vzc29yID0gYm9keTtcbiAgICB3aGlsZSAocGFydHMubGVuZ3RoICE9IDApIHtcbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgZGVsZXRlIGFjY2Vzc29yW3BhcnRzWzBdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghXy5pc09iamVjdChhY2Nlc3NvcikpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhY2Nlc3NvciA9IGFjY2Vzc29yW3BhcnRzWzBdXTtcbiAgICAgIH1cbiAgICAgIHBhcnRzLnNoaWZ0KCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gY2xlYXJFbXB0eU9iamVjdHMoYm9keSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckVtcHR5T2JqZWN0cyhib2R5KSB7XG4gIC8vIGNsZWFyIGVtcHR5IG5vZGVzIHRoZW4gYmFjay1wcm9wYWdhdGVcbiAgZm9yIChsZXQga2V5IGluIGJvZHkpIHtcbiAgICBpZiAoXy5pc09iamVjdChib2R5W2tleV0pKSB7XG4gICAgICBjb25zdCBzaG91bGREZWxldGUgPSBjbGVhckVtcHR5T2JqZWN0cyhib2R5W2tleV0pO1xuICAgICAgaWYgKHNob3VsZERlbGV0ZSkge1xuICAgICAgICBkZWxldGUgYm9keVtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBPYmplY3Qua2V5cyhib2R5KS5sZW5ndGggPT09IDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVHZXRBcmdzKGJvZHkpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHBhdGgpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHBhdGguc3BsaXQoJy4nKTtcbiAgICBsZXQgc3RvcHBlZCA9IGZhbHNlO1xuICAgIGxldCBhY2Nlc3NvciA9IGJvZHk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFhY2Nlc3Nvcikge1xuICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChhY2Nlc3NvcltwYXJ0c1tpXV0pIHtcbiAgICAgICAgYWNjZXNzb3IgPSBhY2Nlc3NvcltwYXJ0c1tpXV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN0b3BwZWQpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICBpZiAoYWNjZXNzb3IpIHtcbiAgICAgIHJldHVybiBhY2Nlc3NvcltTeW1ib2xzLkFSR1VNRU5UU10gfHwge307XG4gICAgfVxuICB9O1xufVxuIiwibGV0IGRlZmF1bHRzID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0QXN0VG9RdWVyeURlZmF1bHRzKG9iamVjdCkge1xuICBPYmplY3QuYXNzaWduKGRlZmF1bHRzLCBvYmplY3QpO1xufVxuIiwiaW1wb3J0IHtNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7TW9uZ299IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmV4cG9ydCBjb25zdCBEZW5vcm1hbGl6ZVNjaGVtYSA9IHtcbiAgICBmaWVsZDogU3RyaW5nLFxuICAgIGJvZHk6IE9iamVjdCxcbiAgICBieXBhc3NTY2hlbWE6IE1hdGNoLk1heWJlKEJvb2xlYW4pXG59O1xuXG5leHBvcnQgY29uc3QgTGlua0NvbmZpZ0RlZmF1bHRzID0ge1xuICAgIHR5cGU6ICdvbmUnLFxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtDb25maWdTY2hlbWEgPSB7XG4gICAgdHlwZTogTWF0Y2guTWF5YmUoTWF0Y2guT25lT2YoJ29uZScsICdtYW55JywgJzEnLCAnKicpKSxcbiAgICBjb2xsZWN0aW9uOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guV2hlcmUoY29sbGVjdGlvbiA9PiB7XG4gICAgICAgICAgICAvLyBXZSBkbyBsaWtlIHRoaXMgc28gaXQgd29ya3Mgd2l0aCBvdGhlciB0eXBlcyBvZiBjb2xsZWN0aW9ucyBcbiAgICAgICAgICAgIC8vIGxpa2UgRlMuQ29sbGVjdGlvblxuICAgICAgICAgICAgcmV0dXJuIF8uaXNPYmplY3QoY29sbGVjdGlvbikgJiYgKFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24gaW5zdGFuY2VvZiBNb25nby5Db2xsZWN0aW9uXG4gICAgICAgICAgICAgICAgfHwgXG4gICAgICAgICAgICAgICAgISFjb2xsZWN0aW9uLl9jb2xsZWN0aW9uXG4gICAgICAgICAgICApO1xuICAgICAgICB9KVxuICAgICksXG4gICAgZmllbGQ6IE1hdGNoLk1heWJlKFN0cmluZyksXG4gICAgbWV0YWRhdGE6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGludmVyc2VkQnk6IE1hdGNoLk1heWJlKFN0cmluZyksXG4gICAgaW5kZXg6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIHVuaXF1ZTogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgYXV0b3JlbW92ZTogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgZGVub3JtYWxpemU6IE1hdGNoLk1heWJlKE1hdGNoLk9iamVjdEluY2x1ZGluZyhEZW5vcm1hbGl6ZVNjaGVtYSkpLFxufTsiLCJleHBvcnQgY29uc3QgTElOS19TVE9SQUdFID0gJ19fbGlua3MnO1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgTElOS19TVE9SQUdFIH0gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuaW1wb3J0IExpbmtlciBmcm9tICcuL2xpbmtlci5qcyc7XG5cbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZGF0YSB3ZSBhZGQgc2hvdWxkIGJlIHZhbGlkIGZvciBjb25maWcuc2NoZW1hLmpzXG4gICAgICovXG4gICAgYWRkTGlua3MoZGF0YSkge1xuICAgICAgICBpZiAoIXRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgdGhpc1tMSU5LX1NUT1JBR0VdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goZGF0YSwgKGxpbmtDb25maWcsIGxpbmtOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1tMSU5LX1NUT1JBR0VdW2xpbmtOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBZb3UgY2Fubm90IGFkZCB0aGUgbGluayB3aXRoIG5hbWU6ICR7bGlua05hbWV9IGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgYWRkZWQgdG8gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IG5ldyBMaW5rZXIodGhpcywgbGlua05hbWUsIGxpbmtDb25maWcpO1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzW0xJTktfU1RPUkFHRV0sIHtcbiAgICAgICAgICAgICAgICBbbGlua05hbWVdOiBsaW5rZXIsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIGdldExpbmtzKCkge1xuICAgICAgICByZXR1cm4gdGhpc1tMSU5LX1NUT1JBR0VdO1xuICAgIH0sXG5cbiAgICBnZXRMaW5rZXIobmFtZSkge1xuICAgICAgICBpZiAodGhpc1tMSU5LX1NUT1JBR0VdKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tMSU5LX1NUT1JBR0VdW25hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGhhc0xpbmsobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhdGhpc1tMSU5LX1NUT1JBR0VdW25hbWVdO1xuICAgIH0sXG5cbiAgICBnZXRMaW5rKG9iamVjdE9ySWQsIG5hbWUpIHtcbiAgICAgICAgbGV0IGxpbmtEYXRhID0gdGhpc1tMSU5LX1NUT1JBR0VdO1xuXG4gICAgICAgIGlmICghbGlua0RhdGEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgYFRoZXJlIGFyZSBubyBsaW5rcyBkZWZpbmVkIGZvciBjb2xsZWN0aW9uOiAke3RoaXMuX25hbWV9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbGlua0RhdGFbbmFtZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgYFRoZXJlIGlzIG5vIGxpbmsgJHtuYW1lfSBmb3IgY29sbGVjdGlvbjogJHt0aGlzLl9uYW1lfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaW5rZXIgPSBsaW5rRGF0YVtuYW1lXTtcbiAgICAgICAgbGV0IG9iamVjdCA9IG9iamVjdE9ySWQ7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqZWN0T3JJZCA9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKCFsaW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB0aGlzLmZpbmRPbmUob2JqZWN0T3JJZCwge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZHM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF06IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iamVjdCA9IHsgX2lkOiBvYmplY3RPcklkIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYFdlIGNvdWxkIG5vdCBmaW5kIGFueSBvYmplY3Qgd2l0aCBfaWQ6IFwiJHtvYmplY3RPcklkfVwiIHdpdGhpbiB0aGUgY29sbGVjdGlvbjogJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpbmtEYXRhW25hbWVdLmNyZWF0ZUxpbmsob2JqZWN0KTtcbiAgICB9LFxufSk7XG4iLCJpbXBvcnQgTGlua01hbnkgZnJvbSAnLi9saW5rVHlwZXMvbGlua01hbnkuanMnO1xuaW1wb3J0IExpbmtNYW55TWV0YSBmcm9tICcuL2xpbmtUeXBlcy9saW5rTWFueU1ldGEuanMnO1xuaW1wb3J0IExpbmtPbmUgZnJvbSAnLi9saW5rVHlwZXMvbGlua09uZS5qcyc7XG5pbXBvcnQgTGlua09uZU1ldGEgZnJvbSAnLi9saW5rVHlwZXMvbGlua09uZU1ldGEuanMnO1xuaW1wb3J0IHsgTGlua0NvbmZpZ1NjaGVtYSwgTGlua0NvbmZpZ0RlZmF1bHRzIH0gZnJvbSAnLi9jb25maWcuc2NoZW1hLmpzJztcbmltcG9ydCBzbWFydEFyZ3VtZW50cyBmcm9tICcuL2xpbmtUeXBlcy9saWIvc21hcnRBcmd1bWVudHMnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcbmltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgeyBhY2Nlc3MgfSBmcm9tICdmcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtlciB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1haW5Db2xsZWN0aW9uXG4gICAgICogQHBhcmFtIGxpbmtOYW1lXG4gICAgICogQHBhcmFtIGxpbmtDb25maWdcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtYWluQ29sbGVjdGlvbiwgbGlua05hbWUsIGxpbmtDb25maWcpIHtcbiAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbiA9IG1haW5Db2xsZWN0aW9uO1xuICAgICAgICB0aGlzLmxpbmtDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBMaW5rQ29uZmlnRGVmYXVsdHMsIGxpbmtDb25maWcpO1xuICAgICAgICB0aGlzLmxpbmtOYW1lID0gbGlua05hbWU7XG5cbiAgICAgICAgLy8gY2hlY2sgbGlua05hbWUgbXVzdCBub3QgZXhpc3QgaW4gc2NoZW1hXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlQW5kQ2xlYW4oKTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIGNhc2NhZGUgcmVtb3ZhbCBob29rcy5cbiAgICAgICAgdGhpcy5faW5pdEF1dG9yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5faW5pdERlbm9ybWFsaXphdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgdmlydHVhbCBmaWVsZCBtYWtlIHN1cmUgdGhhdCB3aGVuIHRoaXMgaXMgZGVsZXRlZCwgaXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIGlmICghbGlua0NvbmZpZy5hdXRvcmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlUmVmZXJlbmNlUmVtb3ZhbEZvclZpcnR1YWxMaW5rcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5pdEluZGV4KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWx1ZXMgd2hpY2ggcmVwcmVzZW50IGZvciB0aGUgcmVsYXRpb24gYSBzaW5nbGUgbGlua1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cbiAgICBnZXQgb25lVHlwZXMoKSB7XG4gICAgICAgIHJldHVybiBbJ29uZScsICcxJ107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc3RyYXRlZ2llczogb25lLCBtYW55LCBvbmUtbWV0YSwgbWFueS1tZXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgc3RyYXRlZ3koKSB7XG4gICAgICAgIGxldCBzdHJhdGVneSA9IHRoaXMuaXNNYW55KCkgPyAnbWFueScgOiAnb25lJztcbiAgICAgICAgaWYgKHRoaXMubGlua0NvbmZpZy5tZXRhZGF0YSkge1xuICAgICAgICAgICAgc3RyYXRlZ3kgKz0gJy1tZXRhJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHJhdGVneTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaWVsZCBuYW1lIGluIHRoZSBkb2N1bWVudCB3aGVyZSB0aGUgYWN0dWFsIHJlbGF0aW9uc2hpcHMgYXJlIHN0b3JlZC5cbiAgICAgKiBAcmV0dXJucyBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGlua1N0b3JhZ2VGaWVsZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5maWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29sbGVjdGlvbiB0aGF0IGlzIGxpbmtlZCB3aXRoIHRoZSBjdXJyZW50IGNvbGxlY3Rpb25cbiAgICAgKiBAcmV0dXJucyBNb25nby5Db2xsZWN0aW9uXG4gICAgICovXG4gICAgZ2V0TGlua2VkQ29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSByZWxhdGlvbnNoaXAgZm9yIHRoaXMgbGluayBpcyBvZiBcIm1hbnlcIiB0eXBlLlxuICAgICAqL1xuICAgIGlzTWFueSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzU2luZ2xlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHJlbGF0aW9uc2hpcCBmb3IgdGhpcyBsaW5rIGNvbnRhaW5zIG1ldGFkYXRhXG4gICAgICovXG4gICAgaXNNZXRhKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmlzTWV0YSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhdGhpcy5saW5rQ29uZmlnLm1ldGFkYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzU2luZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmlzU2luZ2xlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXy5jb250YWlucyh0aGlzLm9uZVR5cGVzLCB0aGlzLmxpbmtDb25maWcudHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNWaXJ0dWFsKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmxpbmtDb25maWcuaW52ZXJzZWRCeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgcmV0dXJuIGEgc2luZ2xlIHJlc3VsdC5cbiAgICAgKi9cbiAgICBpc09uZVJlc3VsdCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICh0aGlzLmlzVmlydHVhbCgpICYmXG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXIubGlua0NvbmZpZy51bmlxdWUpIHx8XG4gICAgICAgICAgICAoIXRoaXMuaXNWaXJ0dWFsKCkgJiYgdGhpcy5pc1NpbmdsZSgpKVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBvYmplY3RcbiAgICAgKiBAcGFyYW0gY29sbGVjdGlvbiBUbyBpbXBlcnNvbmF0ZSB0aGUgZ2V0TGlua2VkQ29sbGVjdGlvbigpIG9mIHRoZSBcIkxpbmtlclwiXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TGlua09uZXxMaW5rTWFueXxMaW5rTWFueU1ldGF8TGlua09uZU1ldGF8TGlua1Jlc29sdmV9XG4gICAgICovXG4gICAgY3JlYXRlTGluayhvYmplY3QsIGNvbGxlY3Rpb24gPSBudWxsKSB7XG4gICAgICAgIGxldCBoZWxwZXJDbGFzcyA9IHRoaXMuX2dldEhlbHBlckNsYXNzKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBoZWxwZXJDbGFzcyh0aGlzLCBvYmplY3QsIGNvbGxlY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3ZhbGlkYXRlQW5kQ2xlYW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQtY29uZmlnJyxcbiAgICAgICAgICAgICAgICBgRm9yIHRoZSBsaW5rICR7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlua05hbWVcbiAgICAgICAgICAgICAgICB9IHlvdSBkaWQgbm90IHByb3ZpZGUgYSBjb2xsZWN0aW9uLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSB0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbjtcbiAgICAgICAgICAgIHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQoY29sbGVjdGlvbk5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgJ2ludmFsaWQtY29sbGVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGBDb3VsZCBub3QgZmluZCBhIGNvbGxlY3Rpb24gd2l0aCB0aGUgbmFtZTogJHtjb2xsZWN0aW9uTmFtZX1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcHJlcGFyZVZpcnR1YWwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLnR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtDb25maWcudHlwZSA9ICdvbmUnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5maWVsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGlua0NvbmZpZy5maWVsZCA9IHRoaXMuX2dlbmVyYXRlRmllbGROYW1lKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcuZmllbGQgPT0gdGhpcy5saW5rTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2ludmFsaWQtY29uZmlnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBGb3IgdGhlIGxpbmsgJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9IHlvdSBtdXN0IG5vdCB1c2UgdGhlIHNhbWUgbmFtZSBmb3IgdGhlIGZpZWxkLCBvdGhlcndpc2UgaXQgd2lsbCBjYXVzZSBjb25mbGljdHMgd2hlbiBmZXRjaGluZyBkYXRhYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNoZWNrKHRoaXMubGlua0NvbmZpZywgTGlua0NvbmZpZ1NjaGVtYSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2UgbmVlZCB0byBhcHBseSBzYW1lIHR5cGUgb2YgcnVsZXMgaW4gdGhpcyBjYXNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3ByZXBhcmVWaXJ0dWFsKCkge1xuICAgICAgICBjb25zdCB7IGNvbGxlY3Rpb24sIGludmVyc2VkQnkgfSA9IHRoaXMubGlua0NvbmZpZztcbiAgICAgICAgbGV0IGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGludmVyc2VkQnkpO1xuXG4gICAgICAgIGlmICghbGlua2VyKSB7XG4gICAgICAgICAgICAvLyBpdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBjb2xsZWN0aW9uIGRvZXNuJ3QgaGF2ZSBhIGxpbmtlciBjcmVhdGVkIHlldC5cbiAgICAgICAgICAgIC8vIHNvIHdlIHdpbGwgY3JlYXRlIGl0IG9uIHN0YXJ0dXAgYWZ0ZXIgYWxsIGxpbmtzIGhhdmUgYmVlbiBkZWZpbmVkXG4gICAgICAgICAgICBNZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGlua2VyID0gY29sbGVjdGlvbi5nZXRMaW5rZXIoaW52ZXJzZWRCeSk7XG4gICAgICAgICAgICAgICAgaWYgKCFsaW5rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGBZb3UgdHJpZWQgc2V0dGluZyB1cCBhbiBpbnZlcnNlZCBsaW5rIGluIFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9uYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICB9XCIgcG9pbnRpbmcgdG8gY29sbGVjdGlvbjogXCIke1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uX25hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cIiBsaW5rOiBcIiR7aW52ZXJzZWRCeX1cIiwgYnV0IG5vIHN1Y2ggbGluayB3YXMgZm91bmQuIE1heWJlIGEgdHlwbyA/YFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc2V0dXBWaXJ0dWFsQ29uZmlnKGxpbmtlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbGlua2VyXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2V0dXBWaXJ0dWFsQ29uZmlnKGxpbmtlcikge1xuICAgICAgICBjb25zdCB2aXJ0dWFsTGlua0NvbmZpZyA9IGxpbmtlci5saW5rQ29uZmlnO1xuXG4gICAgICAgIGlmICghdmlydHVhbExpbmtDb25maWcpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgYFRoZXJlIGlzIG5vIGxpbmstY29uZmlnIGZvciB0aGUgcmVsYXRlZCBjb2xsZWN0aW9uIG9uICR7aW52ZXJzZWRCeX0uIE1ha2Ugc3VyZSB5b3UgYWRkZWQgdGhlIGRpcmVjdCBsaW5rcyBiZWZvcmUgc3BlY2lmeWluZyB2aXJ0dWFsIG9uZXMuYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZXh0ZW5kKHRoaXMubGlua0NvbmZpZywge1xuICAgICAgICAgICAgbWV0YWRhdGE6IHZpcnR1YWxMaW5rQ29uZmlnLm1ldGFkYXRhLFxuICAgICAgICAgICAgcmVsYXRlZExpbmtlcjogbGlua2VyLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXBlbmRpbmcgb24gdGhlIHN0cmF0ZWd5LCB3ZSBjcmVhdGUgdGhlIHByb3BlciBoZWxwZXIgY2xhc3NcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRIZWxwZXJDbGFzcygpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdtYW55LW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBMaW5rTWFueU1ldGE7XG4gICAgICAgICAgICBjYXNlICdtYW55JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlua01hbnk7XG4gICAgICAgICAgICBjYXNlICdvbmUtbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtPbmVNZXRhO1xuICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlua09uZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAnaW52YWxpZC1zdHJhdGVneScsXG4gICAgICAgICAgICBgJHt0aGlzLnN0cmF0ZWd5fSBpcyBub3QgYSB2YWxpZCBzdHJhdGVneWBcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBmaWVsZCBuYW1lIG5vdCBwcmVzZW50LCB3ZSBnZW5lcmF0ZSBpdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZW5lcmF0ZUZpZWxkTmFtZSgpIHtcbiAgICAgICAgbGV0IGNsZWFuZWRDb2xsZWN0aW9uTmFtZSA9IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLl9uYW1lLnJlcGxhY2UoXG4gICAgICAgICAgICAvXFwuL2csXG4gICAgICAgICAgICAnXydcbiAgICAgICAgKTtcbiAgICAgICAgbGV0IGRlZmF1bHRGaWVsZFByZWZpeCA9IHRoaXMubGlua05hbWUgKyAnXycgKyBjbGVhbmVkQ29sbGVjdGlvbk5hbWU7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdtYW55LW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkZWZhdWx0RmllbGRQcmVmaXh9X21ldGFzYDtcbiAgICAgICAgICAgIGNhc2UgJ21hbnknOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkZWZhdWx0RmllbGRQcmVmaXh9X2lkc2A7XG4gICAgICAgICAgICBjYXNlICdvbmUtbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2RlZmF1bHRGaWVsZFByZWZpeH1fbWV0YWA7XG4gICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtkZWZhdWx0RmllbGRQcmVmaXh9X2lkYDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gYSBsaW5rIHRoYXQgaXMgZGVjbGFyZWQgdmlydHVhbCBpcyByZW1vdmVkLCB0aGUgcmVmZXJlbmNlIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIGV2ZXJ5IG90aGVyIGxpbmsuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaGFuZGxlUmVmZXJlbmNlUmVtb3ZhbEZvclZpcnR1YWxMaW5rcygpIHtcbiAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoKHVzZXJJZCwgZG9jKSA9PiB7XG4gICAgICAgICAgICAvLyB0aGlzIHByb2JsZW0gbWF5IG9jY3VyIHdoZW4geW91IGRvIGEgLnJlbW92ZSgpIGJlZm9yZSBNZXRlb3Iuc3RhcnR1cCgpXG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICBgVGhlcmUgd2FzIGFuIGVycm9yIGZpbmRpbmcgdGhlIGxpbmsgZm9yIHJlbW92YWwgZm9yIGNvbGxlY3Rpb246IFwiJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfVwiIHdpdGggbGluazogXCIke1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saW5rTmFtZVxuICAgICAgICAgICAgICAgICAgICB9XCIuIFRoaXMgbWF5IG9jY3VyIHdoZW4geW91IGRvIGEgLnJlbW92ZSgpIGJlZm9yZSBNZXRlb3Iuc3RhcnR1cCgpYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBhY2Nlc3NvciA9IHRoaXMuY3JlYXRlTGluayhkb2MpO1xuXG4gICAgICAgICAgICBfLmVhY2goYWNjZXNzb3IuZmV0Y2hBc0FycmF5KCksIGxpbmtlZE9iaiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyByZWxhdGVkTGlua2VyIH0gPSB0aGlzLmxpbmtDb25maWc7XG4gICAgICAgICAgICAgICAgLy8gV2UgZG8gdGhpcyBjaGVjaywgdG8gYXZvaWQgc2VsZi1yZWZlcmVuY2luZyBoZWxsIHdoZW4gZGVmaW5pbmcgdmlydHVhbCBsaW5rc1xuICAgICAgICAgICAgICAgIC8vIFZpcnR1YWwgbGlua3MgaWYgbm90IGZvdW5kIFwiY29tcGlsZS10aW1lXCIsIHdlIHdpbGwgdHJ5IGFnYWluIHRvIHJlcHJvY2VzcyB0aGVtIG9uIE1ldGVvci5zdGFydHVwXG4gICAgICAgICAgICAgICAgLy8gaWYgYSByZW1vdmFsIGhhcHBlbnMgYmVmb3JlIE1ldGVvci5zdGFydHVwIHRoaXMgbWF5IGZhaWxcbiAgICAgICAgICAgICAgICBpZiAocmVsYXRlZExpbmtlcikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbGluayA9IHJlbGF0ZWRMaW5rZXIuY3JlYXRlTGluayhsaW5rZWRPYmopO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkTGlua2VyLmlzU2luZ2xlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsudW5zZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmsucmVtb3ZlKGRvYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgX2luaXRJbmRleCgpIHtcbiAgICAgICAgaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rQ29uZmlnLmZpZWxkO1xuICAgICAgICAgICAgaWYgKHRoaXMubGlua0NvbmZpZy5tZXRhZGF0YSkge1xuICAgICAgICAgICAgICAgIGZpZWxkID0gZmllbGQgKyAnLl9pZCc7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1lvdSBjYW5ub3Qgc2V0IGluZGV4IG9uIGFuIGludmVyc2VkIGxpbmsuJ1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7IHVuaXF1ZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KHsgW2ZpZWxkXTogMSB9LCBvcHRpb25zKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGlua0NvbmZpZy51bmlxdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1lvdSBjYW5ub3Qgc2V0IHVuaXF1ZSBwcm9wZXJ0eSBvbiBhbiBpbnZlcnNlZCBsaW5rLidcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9lbnN1cmVJbmRleChcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZmllbGRdOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHsgdW5pcXVlOiB0cnVlLCBzcGFyc2U6IHRydWUgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pbml0QXV0b3JlbW92ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuYXV0b3JlbW92ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmFmdGVyLnJlbW92ZSgodXNlcklkLCBkb2MpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldExpbmtlZENvbGxlY3Rpb24oKS5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbjogc21hcnRBcmd1bWVudHMuZ2V0SWRzKGRvY1t0aGlzLmxpbmtTdG9yYWdlRmllbGRdKSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5hZnRlci5yZW1vdmUoKHVzZXJJZCwgZG9jKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGlua2VyID0gdGhpcy5tYWluQ29sbGVjdGlvbi5nZXRMaW5rKGRvYywgdGhpcy5saW5rTmFtZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gbGlua2VyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKHt9LCB7IGZpZWxkczogeyBfaWQ6IDEgfSB9KVxuICAgICAgICAgICAgICAgICAgICAuZmV0Y2goKVxuICAgICAgICAgICAgICAgICAgICAubWFwKGl0ZW0gPT4gaXRlbS5faWQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRMaW5rZWRDb2xsZWN0aW9uKCkucmVtb3ZlKHtcbiAgICAgICAgICAgICAgICAgICAgX2lkOiB7ICRpbjogaWRzIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGRlbm9ybWFsaXphdGlvbiB1c2luZyBoZXJ0ZWJ5OmRlbm9ybWFsaXplXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdERlbm9ybWFsaXphdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemUgfHwgIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFja2FnZUV4aXN0cyA9ICEhUGFja2FnZVsnaGVydGVieTpkZW5vcm1hbGl6ZSddO1xuICAgICAgICBpZiAoIXBhY2thZ2VFeGlzdHMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ21pc3NpbmctcGFja2FnZScsXG4gICAgICAgICAgICAgICAgYFBsZWFzZSBhZGQgdGhlIGhlcnRlYnk6ZGVub3JtYWxpemUgcGFja2FnZSB0byB5b3VyIE1ldGVvciBhcHBsaWNhdGlvbiBpbiBvcmRlciB0byBtYWtlIGNhY2hpbmcgd29ya2BcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGZpZWxkLCBib2R5LCBieXBhc3NTY2hlbWEgfSA9IHRoaXMubGlua0NvbmZpZy5kZW5vcm1hbGl6ZTtcbiAgICAgICAgbGV0IGNhY2hlQ29uZmlnO1xuXG4gICAgICAgIGxldCByZWZlcmVuY2VGaWVsZFN1ZmZpeCA9ICcnO1xuICAgICAgICBpZiAodGhpcy5pc01ldGEoKSkge1xuICAgICAgICAgICAgcmVmZXJlbmNlRmllbGRTdWZmaXggPSB0aGlzLmlzU2luZ2xlKCkgPyAnLl9pZCcgOiAnOl9pZCc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgbGV0IGludmVyc2VkTGluayA9IHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmxpbmtDb25maWc7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID1cbiAgICAgICAgICAgICAgICBpbnZlcnNlZExpbmsudHlwZSA9PSAnbWFueScgPyAnbWFueS1pbnZlcnNlJyA6ICdpbnZlcnNlZCc7XG5cbiAgICAgICAgICAgIGNhY2hlQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgY29sbGVjdGlvbjogdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb24sXG4gICAgICAgICAgICAgICAgZmllbGRzOiBib2R5LFxuICAgICAgICAgICAgICAgIHJlZmVyZW5jZUZpZWxkOiBpbnZlcnNlZExpbmsuZmllbGQgKyByZWZlcmVuY2VGaWVsZFN1ZmZpeCxcbiAgICAgICAgICAgICAgICBjYWNoZUZpZWxkOiBmaWVsZCxcbiAgICAgICAgICAgICAgICBieXBhc3NTY2hlbWE6ICEhYnlwYXNzU2NoZW1hLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMubGlua0NvbmZpZy50eXBlLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkczogYm9keSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VGaWVsZDogdGhpcy5saW5rQ29uZmlnLmZpZWxkICsgcmVmZXJlbmNlRmllbGRTdWZmaXgsXG4gICAgICAgICAgICAgICAgY2FjaGVGaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYnlwYXNzU2NoZW1hOiAhIWJ5cGFzc1NjaGVtYSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMubWFpbkNvbGxlY3Rpb24uY2FjaGUoY2FjaGVDb25maWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmNhY2hlKGNhY2hlQ29uZmlnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZlcmlmaWVzIGlmIHRoaXMgbGlua2VyIGlzIGRlbm9ybWFsaXplZC4gSXQgY2FuIGJlIGRlbm9ybWFsaXplZCBmcm9tIHRoZSBpbnZlcnNlIHNpZGUgYXMgd2VsbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgaXNEZW5vcm1hbGl6ZWQoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMubGlua0NvbmZpZy5kZW5vcm1hbGl6ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWZXJpZmllcyBpZiB0aGUgYm9keSBvZiB0aGUgbGlua2VkIGVsZW1lbnQgZG9lcyBub3QgY29udGFpbiBmaWVsZHMgb3V0c2lkZSB0aGUgY2FjaGUgYm9keVxuICAgICAqXG4gICAgICogQHBhcmFtIGJvZHlcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGlzU3ViQm9keURlbm9ybWFsaXplZChib2R5KSB7XG4gICAgICAgIGNvbnN0IGNhY2hlQm9keSA9IHRoaXMubGlua0NvbmZpZy5kZW5vcm1hbGl6ZS5ib2R5O1xuXG4gICAgICAgIGNvbnN0IGNhY2hlQm9keUZpZWxkcyA9IF8ua2V5cyhkb3QuZG90KGNhY2hlQm9keSkpO1xuICAgICAgICBjb25zdCBib2R5RmllbGRzID0gXy5rZXlzKGRvdC5kb3QoXy5vbWl0KGJvZHksICdfaWQnKSkpO1xuXG4gICAgICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYm9keUZpZWxkcywgY2FjaGVCb2R5RmllbGRzKS5sZW5ndGggPT09IDA7XG4gICAgfVxufVxuIiwiaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTZWFyY2hGaWx0ZXJzKG9iamVjdCwgZmllbGRTdG9yYWdlLCBzdHJhdGVneSwgaXNWaXJ0dWFsLCBtZXRhRmlsdGVycykge1xuICAgIGlmICghaXNWaXJ0dWFsKSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOiByZXR1cm4gY3JlYXRlT25lTWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6IHJldHVybiBjcmVhdGVNYW55KG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGxpbmtpbmcgc3RyYXRlZ3k6ICR7c3RyYXRlZ3l9YClcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmVWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzogcmV0dXJuIGNyZWF0ZU9uZU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycyk7XG4gICAgICAgICAgICBjYXNlICdtYW55JzogcmV0dXJuIGNyZWF0ZU1hbnlWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5raW5nIHN0cmF0ZWd5OiAke3N0cmF0ZWd5fWApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IGRvdC5waWNrKGZpZWxkU3RvcmFnZSwgb2JqZWN0KVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmVWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgW2ZpZWxkU3RvcmFnZV06IG9iamVjdC5faWRcbiAgICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlT25lTWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG9iamVjdFtmaWVsZFN0b3JhZ2VdO1xuXG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIGlmICghc2lmdChtZXRhRmlsdGVycykodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge19pZDogdW5kZWZpbmVkfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIF9pZDogdmFsdWUgPyB2YWx1ZS5faWQgOiB2YWx1ZVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmVNZXRhVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICBfLmVhY2gobWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJzW2ZpZWxkU3RvcmFnZSArICcuJyArIGtleV0gPSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmaWx0ZXJzW2ZpZWxkU3RvcmFnZSArICcuX2lkJ10gPSBvYmplY3QuX2lkO1xuXG4gICAgcmV0dXJuIGZpbHRlcnM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55KG9iamVjdCwgZmllbGRTdG9yYWdlKSB7XG4gICAgY29uc3QgW3Jvb3QsIC4uLm5lc3RlZF0gPSBmaWVsZFN0b3JhZ2Uuc3BsaXQoJy4nKTtcbiAgICBpZiAobmVzdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgYXJyID0gb2JqZWN0W3Jvb3RdO1xuICAgICAgICBjb25zdCBpZHMgPSBhcnIgPyBfLnVuaXEoXy51bmlvbihhcnIubWFwKG9iaiA9PiBfLmlzT2JqZWN0KG9iaikgPyBkb3QucGljayhuZXN0ZWQuam9pbignLicpLCBvYmopIDogW10pKSkgOiBbXTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIF9pZDogeyRpbjogaWRzfVxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogb2JqZWN0W2ZpZWxkU3RvcmFnZV0gfHwgW11cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55VmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFtmaWVsZFN0b3JhZ2VdOiBvYmplY3QuX2lkXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGxldCB2YWx1ZSA9IG9iamVjdFtmaWVsZFN0b3JhZ2VdO1xuXG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIHZhbHVlID0gc2lmdChtZXRhRmlsdGVycywgdmFsdWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IF8ucGx1Y2sodmFsdWUsICdfaWQnKSB8fCBbXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICBfLmVhY2gobWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmaWx0ZXJzLl9pZCA9IG9iamVjdC5faWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogeyRlbGVtTWF0Y2g6IGZpbHRlcnN9XG4gICAgfTtcbn0iLCJpbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcbmltcG9ydCBjcmVhdGVTZWFyY2hGaWx0ZXJzIGZyb20gJy4uL2xpYi9jcmVhdGVTZWFyY2hGaWx0ZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XG4gICAgZ2V0IGNvbmZpZygpIHsgcmV0dXJuIHRoaXMubGlua2VyLmxpbmtDb25maWc7IH1cblxuICAgIGdldCBpc1ZpcnR1YWwoKSB7IHJldHVybiB0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSB9XG5cbiAgICBjb25zdHJ1Y3RvcihsaW5rZXIsIG9iamVjdCwgY29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmxpbmtlciA9IGxpbmtlcjtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIHRoaXMubGlua2VkQ29sbGVjdGlvbiA9IChjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBsaW5rZXIuZ2V0TGlua2VkQ29sbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcucmVsYXRlZExpbmtlci5saW5rQ29uZmlnLmZpZWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcuZmllbGQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdG9yZWQgbGluayBpbmZvcm1hdGlvbiB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBjYW4gb25seSB0YWtlIHRoZSB2YWx1ZSBmcm9tIHRoZSBtYWluIGxpbmsuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBsaW5rZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICovXG4gICAgZmluZChmaWx0ZXJzID0ge30sIG9wdGlvbnMgPSB7fSwgdXNlcklkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBsaW5rZXIgPSB0aGlzLmxpbmtlcjtcbiAgICAgICAgY29uc3QgbGlua2VkQ29sbGVjdGlvbiA9IHRoaXMubGlua2VkQ29sbGVjdGlvbjtcblxuICAgICAgICBsZXQgJG1ldGFGaWx0ZXJzO1xuICAgICAgICBpZiAoZmlsdGVycy4kbWV0YSkge1xuICAgICAgICAgICAgJG1ldGFGaWx0ZXJzID0gZmlsdGVycy4kbWV0YTtcbiAgICAgICAgICAgIGRlbGV0ZSBmaWx0ZXJzLiRtZXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoRmlsdGVycyA9IGNyZWF0ZVNlYXJjaEZpbHRlcnMoXG4gICAgICAgICAgICB0aGlzLm9iamVjdCxcbiAgICAgICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCxcbiAgICAgICAgICAgIGxpbmtlci5zdHJhdGVneSxcbiAgICAgICAgICAgIGxpbmtlci5pc1ZpcnR1YWwoKSxcbiAgICAgICAgICAgICRtZXRhRmlsdGVyc1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhcHBsaWVkRmlsdGVycyA9IF8uZXh0ZW5kKHt9LCBmaWx0ZXJzLCBzZWFyY2hGaWx0ZXJzKTtcblxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBoYXBwZW5zIGR1ZSB0byByZWN1cnNpdmUgaW1wb3J0aW5nIG9mIG1vZHVsZXNcbiAgICAgICAgLy8gVE9ETzogZmluZCBhbm90aGVyIHdheSB0byBkbyB0aGlzXG4gICAgICAgIGlmIChsaW5rZWRDb2xsZWN0aW9uLmZpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmZpbmQoYXBwbGllZEZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmRlZmF1bHQuZmluZChhcHBsaWVkRmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3RoZXJzXG4gICAgICogQHJldHVybnMgeyp8e2NvbnRlbnR9fGFueX1cbiAgICAgKi9cbiAgICBmZXRjaChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZmluZChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpLmZldGNoKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGlua2VyLmlzT25lUmVzdWx0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMganVzdCBsaWtlIGZldGNoKCkgYnV0IGZvcmNlcyB0byBnZXQgYW4gYXJyYXkgZXZlbiBpZiBpdCdzIHNpbmdsZSByZXN1bHRcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0geyp9IGZpbHRlcnMgXG4gICAgICogQHBhcmFtIHsqfSBvcHRpb25zIFxuICAgICAqIEBwYXJhbSAgey4uLmFueX0gb3RoZXJzIFxuICAgICAqL1xuICAgIGZldGNoQXNBcnJheShmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpLmZldGNoKClcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHdlIGFyZSBkZWFsaW5nIHdpdGggbXVsdGlwbGUgdHlwZSByZWxhdGlvbnNoaXBzLCAkaW4gd291bGQgcmVxdWlyZSBhbiBhcnJheS4gSWYgdGhlIGZpZWxkIHZhbHVlIGlzIG51bGwsIGl0IHdpbGwgZmFpbFxuICAgICAqIFdlIHVzZSBjbGVhbiB0byBtYWtlIGl0IGFuIGVtcHR5IGFycmF5IGJ5IGRlZmF1bHQuXG4gICAgICovXG4gICAgY2xlYW4oKSB7fVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdHMgYSBzaW5nbGUgaWRcbiAgICAgKi9cbiAgICBpZGVudGlmeUlkKHdoYXQsIHNhdmVUb0RhdGFiYXNlKSB7XG4gICAgICAgIHJldHVybiBTbWFydEFyZ3MuZ2V0SWQod2hhdCwge1xuICAgICAgICAgICAgc2F2ZVRvRGF0YWJhc2UsXG4gICAgICAgICAgICBjb2xsZWN0aW9uOiB0aGlzLmxpbmtlZENvbGxlY3Rpb25cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdHMgdGhlIGlkcyBvZiBvYmplY3Qocykgb3Igc3RyaW5ncyBhbmQgcmV0dXJucyBhbiBhcnJheS5cbiAgICAgKi9cbiAgICBpZGVudGlmeUlkcyh3aGF0LCBzYXZlVG9EYXRhYmFzZSkge1xuICAgICAgICByZXR1cm4gU21hcnRBcmdzLmdldElkcyh3aGF0LCB7XG4gICAgICAgICAgICBzYXZlVG9EYXRhYmFzZSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua2VkQ29sbGVjdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3Mgd2hlbiBsaW5raW5nIGRhdGEsIGlmIHRoZSBpZHMgYXJlIHZhbGlkIHdpdGggdGhlIGxpbmtlZCBjb2xsZWN0aW9uLlxuICAgICAqIEB0aHJvd3MgTWV0ZW9yLkVycm9yXG4gICAgICogQHBhcmFtIGlkc1xuICAgICAqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF92YWxpZGF0ZUlkcyhpZHMpIHtcbiAgICAgICAgaWYgKCFfLmlzQXJyYXkoaWRzKSkge1xuICAgICAgICAgICAgaWRzID0gW2lkc107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2YWxpZElkcyA9IHRoaXMubGlua2VkQ29sbGVjdGlvbi5maW5kKHtcbiAgICAgICAgICAgIF9pZDogeyRpbjogaWRzfVxuICAgICAgICB9LCB7ZmllbGRzOiB7X2lkOiAxfX0pLmZldGNoKCkubWFwKGRvYyA9PiBkb2MuX2lkKTtcblxuICAgICAgICBpZiAodmFsaWRJZHMubGVuZ3RoICE9IGlkcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1mb3VuZCcsIGBZb3UgdHJpZWQgdG8gY3JlYXRlIGxpbmtzIHdpdGggbm9uLWV4aXN0aW5nIGlkKHMpIGluc2lkZSBcIiR7dGhpcy5saW5rZWRDb2xsZWN0aW9uLl9uYW1lfVwiOiAke18uZGlmZmVyZW5jZShpZHMsIHZhbGlkSWRzKS5qb2luKCcsICcpfWApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIGZvciBhbGxvd2luZyBjb21tYW5kcyBzdWNoIGFzIHNldC91bnNldC9hZGQvcmVtb3ZlL21ldGFkYXRhIGZyb20gdGhlIHZpcnR1YWwgbGluay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqIEBwYXJhbSBtZXRhZGF0YVxuICAgICAqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqL1xuICAgIF92aXJ0dWFsQWN0aW9uKGFjdGlvbiwgd2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgY29uc3QgbGlua2VyID0gdGhpcy5saW5rZXIubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyO1xuXG4gICAgICAgIC8vIGl0cyBhbiB1bnNldCBvcGVyYXRpb24gbW9zdCBsaWtlbHkuXG4gICAgICAgIGlmICh3aGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHJldmVyc2VkTGluayA9IGxpbmtlci5jcmVhdGVMaW5rKHRoaXMuZmV0Y2goKSk7XG4gICAgICAgICAgICByZXZlcnNlZExpbmsudW5zZXQoKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFfLmlzQXJyYXkod2hhdCkpIHtcbiAgICAgICAgICAgIHdoYXQgPSBbd2hhdF07XG4gICAgICAgIH1cblxuICAgICAgICB3aGF0ID0gXy5tYXAod2hhdCwgZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbGlua2VyLm1haW5Db2xsZWN0aW9uLmZpbmRPbmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5faWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudElkID0gbGlua2VyLm1haW5Db2xsZWN0aW9uLmluc2VydChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQoZWxlbWVudCwgbGlua2VyLm1haW5Db2xsZWN0aW9uLmZpbmRPbmUoZWxlbWVudElkKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBfLm1hcCh3aGF0LCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJldmVyc2VkTGluayA9IGxpbmtlci5jcmVhdGVMaW5rKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoYWN0aW9uID09ICdtZXRhZGF0YScpIHtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzU2luZ2xlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2VkTGluay5tZXRhZGF0YShtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldmVyc2VkTGluay5tZXRhZGF0YSh0aGlzLm9iamVjdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09ICdhZGQnIHx8IGFjdGlvbiA9PSAnc2V0Jykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTaW5nbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlZExpbmsuc2V0KHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLmFkZCh0aGlzLm9iamVjdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay51bnNldCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay5yZW1vdmUodGhpcy5vYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IExpbmsgZnJvbSAnLi9iYXNlLmpzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua01hbnkgZXh0ZW5kcyBMaW5rIHtcbiAgICBjbGVhbigpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdKSB7XG4gICAgICAgICAgICB0aGlzLm9iamVjdFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZHMgdGhlIF9pZHMgdG8gdGhlIG9iamVjdC5cbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqL1xuICAgIGFkZCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vaWYgKHRoaXMuaXNWaXJ0dWFsKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdBZGQvcmVtb3ZlIG9wZXJhdGlvbnMgbXVzdCBiZSBkb25lIGZyb20gdGhlIG93bmluZy1saW5rIG9mIHRoZSByZWxhdGlvbnNoaXAnKTtcblxuICAgICAgICB0aGlzLmNsZWFuKCk7XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSWRzKF9pZHMpO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZmllbGRcbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gXy51bmlvbih0aGlzLm9iamVjdFtmaWVsZF0sIF9pZHMpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZGJcbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJGFkZFRvU2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogeyRlYWNoOiBfaWRzfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqL1xuICAgIHJlbW92ZSh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigncmVtb3ZlJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnQWRkL1JlbW92ZSBvcGVyYXRpb25zIHNob3VsZCBiZSBkb25lIGZyb20gdGhlIG93bmVyIG9mIHRoZSByZWxhdGlvbnNoaXAnKTtcblxuICAgICAgICB0aGlzLmNsZWFuKCk7XG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICBjb25zdCBbcm9vdCwgLi4ubmVzdGVkXSA9IGZpZWxkLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCk7XG5cbiAgICAgICAgLy8gdXBkYXRlIHRoZSBmaWVsZFxuICAgICAgICB0aGlzLm9iamVjdFtyb290XSA9IF8uZmlsdGVyKFxuICAgICAgICAgICAgdGhpcy5vYmplY3Rbcm9vdF0sXG4gICAgX2lkID0+ICFfLmNvbnRhaW5zKF9pZHMsIG5lc3RlZC5sZW5ndGggPiAwID8gZG90LnBpY2sobmVzdGVkLmpvaW4oJy4nKSwgX2lkKSA6IF9pZClcbiAgICAgICAgKTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGRiXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICAgICAgW3Jvb3RdOiBuZXN0ZWQubGVuZ3RoID4gMCA/IHtbbmVzdGVkLmpvaW4oJy4nKV06IHskaW46IF9pZHN9fSA6IHskaW46IF9pZHN9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCBtb2RpZmllcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0KHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdzZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICpzZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgdW5zZXQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3Vuc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqdW5zZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua01hbnlNZXRhIGV4dGVuZHMgTGluayB7XG4gICAgY2xlYW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdoYXRcbiAgICAgKiBAcGFyYW0gbWV0YWRhdGFcbiAgICAgKi9cbiAgICBhZGQod2hhdCwgbWV0YWRhdGEgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ2FkZCcsIHdoYXQsIG1ldGFkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSWRzKF9pZHMpO1xuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSB0aGlzLm9iamVjdFtmaWVsZF0gfHwgW107XG4gICAgICAgIGxldCBtZXRhZGF0YXMgPSBbXTtcblxuICAgICAgICBfLmVhY2goX2lkcywgX2lkID0+IHtcbiAgICAgICAgICAgIGxldCBsb2NhbE1ldGFkYXRhID0gXy5jbG9uZShtZXRhZGF0YSk7XG4gICAgICAgICAgICBsb2NhbE1ldGFkYXRhLl9pZCA9IF9pZDtcblxuICAgICAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdLnB1c2gobG9jYWxNZXRhZGF0YSk7XG4gICAgICAgICAgICBtZXRhZGF0YXMucHVzaChsb2NhbE1ldGFkYXRhKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJGFkZFRvU2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogeyRlYWNoOiBtZXRhZGF0YXN9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICogQHBhcmFtIGV4dGVuZE1ldGFkYXRhXG4gICAgICovXG4gICAgbWV0YWRhdGEod2hhdCwgZXh0ZW5kTWV0YWRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdtZXRhZGF0YScsIHdoYXQsIGV4dGVuZE1ldGFkYXRhKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgaWYgKHdoYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0W2ZpZWxkXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmlzQXJyYXkod2hhdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ01ldGFkYXRhIHVwZGF0ZXMgc2hvdWxkIGJlIG1hZGUgZm9yIG9uZSBlbnRpdHkgb25seSwgbm90IG11bHRpcGxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfaWQgPSB0aGlzLmlkZW50aWZ5SWQod2hhdCk7XG5cbiAgICAgICAgbGV0IGV4aXN0aW5nTWV0YWRhdGEgPSBfLmZpbmQodGhpcy5vYmplY3RbZmllbGRdLCBtZXRhZGF0YSA9PiBtZXRhZGF0YS5faWQgPT0gX2lkKTtcbiAgICAgICAgaWYgKGV4dGVuZE1ldGFkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ01ldGFkYXRhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQoZXhpc3RpbmdNZXRhZGF0YSwgZXh0ZW5kTWV0YWRhdGEpO1xuICAgICAgICAgICAgbGV0IHN1YmZpZWxkID0gZmllbGQgKyAnLl9pZCc7XG4gICAgICAgICAgICBsZXQgc3ViZmllbGRVcGRhdGUgPSBmaWVsZCArICcuJCc7XG5cbiAgICAgICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgX2lkOiB0aGlzLm9iamVjdC5faWQsXG4gICAgICAgICAgICAgICAgW3N1YmZpZWxkXTogX2lkXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgW3N1YmZpZWxkVXBkYXRlXTogZXhpc3RpbmdNZXRhZGF0YVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBfaWRzID0gdGhpcy5pZGVudGlmeUlkcyh3aGF0KTtcbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IF8uZmlsdGVyKHRoaXMub2JqZWN0W2ZpZWxkXSwgbGluayA9PiAhXy5jb250YWlucyhfaWRzLCBsaW5rLl9pZCkpO1xuXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRwdWxsOiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbjogX2lkc1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXQod2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdzZXQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqc2V0KiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBhZGQvcmVtb3ZlIGZvciAqbWFueSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cblxuICAgIHVuc2V0KHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCd1bnNldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnVuc2V0KiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBhZGQvcmVtb3ZlIGZvciAqbWFueSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cbn0iLCJpbXBvcnQgTGluayBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IFNtYXJ0QXJncyBmcm9tICcuL2xpYi9zbWFydEFyZ3VtZW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtPbmUgZXh0ZW5kcyBMaW5rIHtcbiAgICBzZXQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIGNvbnN0IF9pZCA9IHRoaXMuaWRlbnRpZnlJZCh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoW19pZF0pO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IF9pZDtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogX2lkXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHVuc2V0KCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3Vuc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gbnVsbDtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ2FkZCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKmFkZCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdyZW1vdmUnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICpyZW1vdmUqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIHNldC91bnNldCBmb3IgKnNpbmdsZSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cbn0iLCJpbXBvcnQgTGluayBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IFNtYXJ0QXJncyBmcm9tICcuL2xpYi9zbWFydEFyZ3VtZW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtPbmVNZXRhIGV4dGVuZHMgTGluayB7XG4gICAgc2V0KHdoYXQsIG1ldGFkYXRhID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdzZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICBtZXRhZGF0YS5faWQgPSB0aGlzLmlkZW50aWZ5SWQod2hhdCwgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlSWRzKFttZXRhZGF0YS5faWRdKTtcblxuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBtZXRhZGF0YTtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXTogbWV0YWRhdGFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbWV0YWRhdGEoZXh0ZW5kTWV0YWRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdtZXRhZGF0YScsIHVuZGVmaW5lZCwgZXh0ZW5kTWV0YWRhdGEpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICBpZiAoIWV4dGVuZE1ldGFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbZmllbGRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5leHRlbmQodGhpcy5vYmplY3RbZmllbGRdLCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIFtmaWVsZF06IHRoaXMub2JqZWN0W2ZpZWxkXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5zZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSB7fTtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCB7XG4gICAgICAgICAgICAkc2V0OiB7XG4gICAgICAgICAgICAgICAgW2ZpZWxkXToge31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYWRkKHdoYXQsIG1ldGFkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCwgbWV0YWRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKmFkZCogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdyZW1vdmUnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICpyZW1vdmUqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIHNldC91bnNldCBmb3IgKnNpbmdsZSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cbn0iLCIvKipcbiAqIFdoZW4geW91IHdvcmsgd2l0aCBhZGQvcmVtb3ZlIHNldC91bnNldFxuICogWW91IGhhdmUgdGhlIGFiaWxpdHkgdG8gcGFzcyBzdHJpbmdzLCBhcnJheSBvZiBzdHJpbmdzLCBvYmplY3RzLCBhcnJheSBvZiBvYmplY3RzXG4gKiBJZiB5b3UgYXJlIGFkZGluZyBzb21ldGhpbmcgYW5kIHlvdSB3YW50IHRvIHNhdmUgdGhlbSBpbiBkYiwgeW91IGNhbiBwYXNzIG9iamVjdHMgd2l0aG91dCBpZHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IG5ldyBjbGFzcyB7XG4gICAgZ2V0SWRzKHdoYXQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKF8uaXNBcnJheSh3aGF0KSkge1xuICAgICAgICAgICAgcmV0dXJuIF8ubWFwKHdoYXQsIChzdWJXaGF0KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0SWQoc3ViV2hhdCwgb3B0aW9ucylcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW3RoaXMuZ2V0SWQod2hhdCwgb3B0aW9ucyldO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC10eXBlJywgYFVucmVjb2duaXplZCB0eXBlOiAke3R5cGVvZiB3aGF0fSBmb3IgbWFuYWdpbmcgbGlua3NgKTtcbiAgICB9XG5cbiAgICBnZXRJZCh3aGF0LCBvcHRpb25zKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2hhdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiB3aGF0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiB3aGF0ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKCF3aGF0Ll9pZCAmJiBvcHRpb25zLnNhdmVUb0RhdGFiYXNlKSB7XG4gICAgICAgICAgICAgICAgd2hhdC5faWQgPSBvcHRpb25zLmNvbGxlY3Rpb24uaW5zZXJ0KHdoYXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gd2hhdC5faWRcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuXG5sZXQgZ2xvYmFsQ29uZmlnID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hbWVkUXVlcnlCYXNlIHtcbiAgICBzdGF0aWMgc2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICBnbG9iYWxDb25maWcgPSBjb25maWc7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldENvbmZpZygpIHtcbiAgICAgICAgcmV0dXJuIGdsb2JhbENvbmZpZztcbiAgICB9XG5cbiAgICBpc05hbWVkUXVlcnkgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMucXVlcnlOYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGJvZHkpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVyID0gYm9keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGRlZXBDbG9uZShib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgZ2xvYmFsQ29uZmlnLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5pc0V4cG9zZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIGBuYW1lZF9xdWVyeV8ke3RoaXMucXVlcnlOYW1lfWA7XG4gICAgfVxuXG4gICAgZ2V0IGlzUmVzb2x2ZXIoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMucmVzb2x2ZXI7XG4gICAgfVxuXG4gICAgc2V0UGFyYW1zKHBhcmFtcykge1xuICAgICAgICB0aGlzLnBhcmFtcyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBkb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgdGhpcy5wYXJhbXM7XG5cbiAgICAgICAgY29uc3Qge3ZhbGlkYXRlUGFyYW1zfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBhcmFtcykgcmV0dXJuO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZGF0ZSh2YWxpZGF0ZVBhcmFtcywgcGFyYW1zKTtcbiAgICAgICAgfSBjYXRjaCAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIHBhcmFtZXRlcnMgc3VwcGxpZWQgdG8gdGhlIHF1ZXJ5IFwiJHt0aGlzLnF1ZXJ5TmFtZX1cIlxcbmAsIHZhbGlkYXRpb25FcnJvcik7XG4gICAgICAgICAgICB0aHJvdyB2YWxpZGF0aW9uRXJyb3I7IC8vIHJldGhyb3dcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKG5ld1BhcmFtcykge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBfLmV4dGVuZCh7fSwgZGVlcENsb25lKHRoaXMucGFyYW1zKSwgbmV3UGFyYW1zKTtcblxuICAgICAgICBsZXQgY2xvbmUgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHRoaXMucXVlcnlOYW1lLFxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgdGhpcy5pc1Jlc29sdmVyID8gdGhpcy5yZXNvbHZlciA6IGRlZXBDbG9uZSh0aGlzLmJvZHkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY2xvbmUuY2FjaGVyID0gdGhpcy5jYWNoZXI7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgY2xvbmUuZXhwb3NlQ29uZmlnID0gdGhpcy5leHBvc2VDb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbnxvYmplY3R9IHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZSh2YWxpZGF0b3IsIHBhcmFtcykge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbGlkYXRvcikpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvci5jYWxsKG51bGwsIHBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrKHBhcmFtcywgdmFsaWRhdG9yKVxuICAgICAgICB9XG4gICAgfVxufVxuXG5OYW1lZFF1ZXJ5QmFzZS5kZWZhdWx0T3B0aW9ucyA9IHt9OyIsImltcG9ydCBDb3VudFN1YnNjcmlwdGlvbiBmcm9tICcuLi9xdWVyeS9jb3VudHMvY291bnRTdWJzY3JpcHRpb24nO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQgcmVjdXJzaXZlRmV0Y2ggZnJvbSAnLi4vcXVlcnkvbGliL3JlY3Vyc2l2ZUZldGNoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgY2FsbFdpdGhQcm9taXNlIGZyb20gJy4uL3F1ZXJ5L2xpYi9jYWxsV2l0aFByb21pc2UnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9uYW1lZFF1ZXJ5LmJhc2UnO1xuaW1wb3J0IHtMb2NhbENvbGxlY3Rpb259IGZyb20gJ21ldGVvci9taW5pbW9uZ28nO1xuaW1wb3J0IGludGVyc2VjdERlZXAgZnJvbSAnLi4vcXVlcnkvbGliL2ludGVyc2VjdERlZXAnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge251bGx8YW55fCp9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgYFlvdSBjYW5ub3Qgc3Vic2NyaWJlIHRvIGEgcmVzb2x2ZXIgcXVlcnlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZShcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHRoaXMucGFyYW1zLFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25IYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHRoZSBjb3VudHMgZm9yIHRoaXMgcXVlcnlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgc3Vic2NyaWJlQ291bnQoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCBgWW91IGNhbm5vdCBzdWJzY3JpYmUgdG8gYSByZXNvbHZlciBxdWVyeWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gbmV3IENvdW50U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuc3Vic2NyaWJlKHRoaXMucGFyYW1zLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgaWYgYW4gZXhpc3Rpbmcgc3Vic2NyaXB0aW9uIGV4aXN0c1xuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZSB0byB0aGUgY291bnRzIGlmIGEgc3Vic2NyaXB0aW9uIGV4aXN0cy5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZUNvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIGVsZW1lbnRzIGluIHN5bmMgdXNpbmcgcHJvbWlzZXNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUaGlzIHF1ZXJ5IGlzIHJlYWN0aXZlLCBtZWFuaW5nIHlvdSBjYW5ub3QgdXNlIHByb21pc2VzIHRvIGZldGNoIHRoZSBkYXRhLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxXaXRoUHJvbWlzZSh0aGlzLm5hbWUsIHRoaXMucGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIG9uZSBlbGVtZW50IGluIHN5bmNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoT25lU3luYygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoYXdhaXQgdGhpcy5mZXRjaFN5bmMoKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrT3JPcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FsbGJhY2tPck9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoU3RhdGljKGNhbGxiYWNrT3JPcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoUmVhY3RpdmUoY2FsbGJhY2tPck9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBkaWQgbm90IHByb3ZpZGUgYSB2YWxpZCBjYWxsYmFjaycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZldGNoKChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzID8gXy5maXJzdChyZXMpIDogbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cyBpbiBzeW5jLlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYXN5bmMgZ2V0Q291bnRTeW5jKCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lICsgJy5jb3VudCcsIHRoaXMucGFyYW1zKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGdldENvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5nZXRDb3VudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBjb3VudCBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbCh0aGlzLm5hbWUgKyAnLmNvdW50JywgdGhpcy5wYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoaW5nIG5vbi1yZWFjdGl2ZSBxdWVyaWVzXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hTdGF0aWMoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnWW91IGFyZSBvbiBjbGllbnQgc28geW91IG11c3QgZWl0aGVyIHByb3ZpZGUgYSBjYWxsYmFjayB0byBnZXQgdGhlIGRhdGEgb3Igc3Vic2NyaWJlIGZpcnN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgTWV0ZW9yLmNhbGwodGhpcy5uYW1lLCB0aGlzLnBhcmFtcywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoaW5nIHdoZW4gd2UndmUgZ290IGFuIGFjdGl2ZSBwdWJsaWNhdGlvblxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFJlYWN0aXZlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBsZXQgYm9keSA9IHRoaXMuYm9keTtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1zLiRib2R5KSB7XG4gICAgICAgICAgICBib2R5ID0gaW50ZXJzZWN0RGVlcChib2R5LCB0aGlzLnBhcmFtcy4kYm9keSk7XG4gICAgICAgIH1cblxuICAgICAgICBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3MoYm9keSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICBpZiAoIW9wdGlvbnMuYWxsb3dTa2lwICYmIGJvZHkuJG9wdGlvbnMgJiYgYm9keS4kb3B0aW9ucy5za2lwKSB7XG4gICAgICAgICAgICBkZWxldGUgYm9keS4kb3B0aW9ucy5za2lwO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZUZldGNoKFxuICAgICAgICAgICAgY3JlYXRlR3JhcGgodGhpcy5jb2xsZWN0aW9uLCBib2R5KSxcbiAgICAgICAgICAgIHVuZGVmaW5lZCwge1xuICAgICAgICAgICAgICAgIHNjb3BlZDogdGhpcy5vcHRpb25zLnNjb3BlZCxcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25IYW5kbGU6IHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlXG4gICAgICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTmFtZWRRdWVyeUNsaWVudCBmcm9tICcuL25hbWVkUXVlcnkuY2xpZW50JztcbmltcG9ydCBOYW1lZFF1ZXJ5U2VydmVyIGZyb20gJy4vbmFtZWRRdWVyeS5zZXJ2ZXInO1xuXG5sZXQgTmFtZWRRdWVyeTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAgIE5hbWVkUXVlcnkgPSBOYW1lZFF1ZXJ5U2VydmVyO1xufSBlbHNlIHtcbiAgICBOYW1lZFF1ZXJ5ID0gTmFtZWRRdWVyeUNsaWVudDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTmFtZWRRdWVyeTsiLCJpbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi4vcXVlcnkvbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vbmFtZWRRdWVyeS5iYXNlJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgTWVtb3J5UmVzdWx0Q2FjaGVyIGZyb20gJy4vY2FjaGUvTWVtb3J5UmVzdWx0Q2FjaGVyJztcbmltcG9ydCBpbnRlcnNlY3REZWVwIGZyb20gJy4uL3F1ZXJ5L2xpYi9pbnRlcnNlY3REZWVwJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZXh0ZW5kcyBCYXNlIHtcbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY29udGV4dCkge1xuICAgICAgICB0aGlzLl9wZXJmb3JtU2VjdXJpdHlDaGVja3MoY29udGV4dCwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFJlc29sdmVyRGF0YShjb250ZXh0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSBkZWVwQ2xvbmUodGhpcy5ib2R5KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcmFtcy4kYm9keSkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGJvZHksIHRoaXMucGFyYW1zLiRib2R5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gd2UgbXVzdCBhcHBseSBlbW9iZHltZW50IGhlcmVcbiAgICAgICAgICAgIHRoaXMuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuY29sbGVjdGlvbi5jcmVhdGVRdWVyeShcbiAgICAgICAgICAgICAgICBkZWVwQ2xvbmUoYm9keSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGRlZXBDbG9uZSh0aGlzLnBhcmFtcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZUlkID0gdGhpcy5jYWNoZXIuZ2VuZXJhdGVRdWVyeUlkKHRoaXMucXVlcnlOYW1lLCB0aGlzLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVyLmZldGNoKGNhY2hlSWQsIHtxdWVyeX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnkuZmV0Y2goKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2hPbmUoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gXy5maXJzdCh0aGlzLmZldGNoKC4uLmFyZ3MpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgZ2V0Q291bnQoY29udGV4dCkge1xuICAgICAgICB0aGlzLl9wZXJmb3JtU2VjdXJpdHlDaGVja3MoY29udGV4dCwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGNvdW50Q3Vyc29yID0gdGhpcy5nZXRDdXJzb3JGb3JDb3VudGluZygpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlcikge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVJZCA9ICdjb3VudDo6JyArIHRoaXMuY2FjaGVyLmdlbmVyYXRlUXVlcnlJZCh0aGlzLnF1ZXJ5TmFtZSwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZXIuZmV0Y2goY2FjaGVJZCwge2NvdW50Q3Vyc29yfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnRDdXJzb3IuY291bnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJzb3IgZm9yIGNvdW50aW5nXG4gICAgICogVGhpcyBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBjb3VudHMgY3Vyc29yXG4gICAgICovXG4gICAgZ2V0Q3Vyc29yRm9yQ291bnRpbmcoKSB7XG4gICAgICAgIGxldCBib2R5ID0gZGVlcENsb25lKHRoaXMuYm9keSk7XG4gICAgICAgIHRoaXMuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3MoYm9keSwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmluZChib2R5LiRmaWx0ZXJzIHx8IHt9LCB7ZmllbGRzOiB7X2lkOiAxfX0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjYWNoZXJcbiAgICAgKi9cbiAgICBjYWNoZVJlc3VsdHMoY2FjaGVyKSB7XG4gICAgICAgIGlmICghY2FjaGVyKSB7XG4gICAgICAgICAgICBjYWNoZXIgPSBuZXcgTWVtb3J5UmVzdWx0Q2FjaGVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNhY2hlciA9IGNhY2hlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmUgcmVzb2x2ZS4gVGhpcyBkb2Vzbid0IGFjdHVhbGx5IGNhbGwgdGhlIHJlc29sdmVyLCBpdCBqdXN0IHNldHMgaXRcbiAgICAgKiBAcGFyYW0gZm5cbiAgICAgKi9cbiAgICByZXNvbHZlKGZuKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNhbGwnLCBgWW91IGNhbm5vdCB1c2UgcmVzb2x2ZSgpIG9uIGEgbm9uIHJlc29sdmVyIE5hbWVkUXVlcnlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVzb2x2ZXIgPSBmbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFJlc29sdmVyRGF0YShjb250ZXh0KSB7XG4gICAgICAgIGNvbnN0IHJlc29sdmVyID0gdGhpcy5yZXNvbHZlcjtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0ge1xuICAgICAgICAgICAgZmV0Y2goKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmVyLmNhbGwoY29udGV4dCwgc2VsZi5wYXJhbXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlcikge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVJZCA9IHRoaXMuY2FjaGVyLmdlbmVyYXRlUXVlcnlJZCh0aGlzLnF1ZXJ5TmFtZSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVyLmZldGNoKGNhY2hlSWQsIHtxdWVyeX0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHF1ZXJ5LmZldGNoKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbnRleHQgTWV0ZW9yIG1ldGhvZC9wdWJsaXNoIGNvbnRleHRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wZXJmb3JtU2VjdXJpdHlDaGVja3MoY29udGV4dCwgcGFyYW1zKSB7XG4gICAgICAgIGlmIChjb250ZXh0ICYmIHRoaXMuZXhwb3NlQ29uZmlnKSB7XG4gICAgICAgICAgICB0aGlzLl9jYWxsRmlyZXdhbGwoY29udGV4dCwgY29udGV4dC51c2VySWQsIHBhcmFtcyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRvVmFsaWRhdGVQYXJhbXMocGFyYW1zKTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBuZXcgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB7fTtcbiAgICB9XG5cbiAgICBhZGQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5zdG9yYWdlW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtbmFtZScsIGBZb3UgaGF2ZSBwcmV2aW91c2x5IGRlZmluZWQgYW5vdGhlciBuYW1lZFF1ZXJ5IHdpdGggdGhlIHNhbWUgbmFtZTogXCIke2tleX1cIi4gTmFtZWQgUXVlcnkgbmFtZXMgc2hvdWxkIGJlIHVuaXF1ZS5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlW2tleV07XG4gICAgfVxuXG4gICAgZ2V0QWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlO1xuICAgIH1cbn0iLCJpbXBvcnQge0VKU09OfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuXG4vKipcbiAqIFRoaXMgaXMgYSB2ZXJ5IGJhc2ljIGluLW1lbW9yeSByZXN1bHQgY2FjaGluZyBmdW5jdGlvbmFsaXR5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VSZXN1bHRDYWNoZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBxdWVyeU5hbWVcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZW5lcmF0ZVF1ZXJ5SWQocXVlcnlOYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIGAke3F1ZXJ5TmFtZX06OiR7RUpTT04uc3RyaW5naWZ5KHBhcmFtcyl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvblxuICAgICAqL1xuICAgIGZldGNoKGNhY2hlSWQsIHtxdWVyeSwgY291bnRDdXJzb3J9KSB7XG4gICAgICAgIHRocm93ICdOb3QgaW1wbGVtZW50ZWQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBxdWVyeVxuICAgICAqIEBwYXJhbSBjb3VudEN1cnNvclxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBmZXRjaERhdGEoe3F1ZXJ5LCBjb3VudEN1cnNvcn0pIHtcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnkuZmV0Y2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjb3VudEN1cnNvci5jb3VudCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCBCYXNlUmVzdWx0Q2FjaGVyIGZyb20gJy4vQmFzZVJlc3VsdENhY2hlcic7XG5cbmNvbnN0IERFRkFVTFRfVFRMID0gNjAwMDA7XG5cbi8qKlxuICogVGhpcyBpcyBhIHZlcnkgYmFzaWMgaW4tbWVtb3J5IHJlc3VsdCBjYWNoaW5nIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtb3J5UmVzdWx0Q2FjaGVyIGV4dGVuZHMgQmFzZVJlc3VsdENhY2hlciB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjYWNoZUlkXG4gICAgICogQHBhcmFtIHF1ZXJ5XG4gICAgICogQHBhcmFtIGNvdW50Q3Vyc29yXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FjaGVJZCwge3F1ZXJ5LCBjb3VudEN1cnNvcn0pIHtcbiAgICAgICAgY29uc3QgY2FjaGVEYXRhID0gdGhpcy5zdG9yZVtjYWNoZUlkXTtcbiAgICAgICAgaWYgKGNhY2hlRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmVEZWVwKGNhY2hlRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gQmFzZVJlc3VsdENhY2hlci5mZXRjaERhdGEoe3F1ZXJ5LCBjb3VudEN1cnNvcn0pO1xuICAgICAgICB0aGlzLnN0b3JlRGF0YShjYWNoZUlkLCBkYXRhKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjYWNoZUlkXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBzdG9yZURhdGEoY2FjaGVJZCwgZGF0YSkge1xuICAgICAgICBjb25zdCB0dGwgPSB0aGlzLmNvbmZpZy50dGwgfHwgREVGQVVMVF9UVEw7XG4gICAgICAgIHRoaXMuc3RvcmVbY2FjaGVJZF0gPSBjbG9uZURlZXAoZGF0YSk7XG5cbiAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbY2FjaGVJZF07XG4gICAgICAgIH0sIHR0bClcbiAgICB9XG59XG4iLCJpbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuLi9uYW1lZFF1ZXJ5LmpzJztcbmltcG9ydCB7IEV4cG9zZVNjaGVtYSwgRXhwb3NlRGVmYXVsdHMgfSBmcm9tICcuL3NjaGVtYS5qcyc7XG5pbXBvcnQgbWVyZ2VEZWVwIGZyb20gJy4vbGliL21lcmdlRGVlcC5qcyc7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi4vLi4vcXVlcnkvbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVDb21wb3NlIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9yZWN1cnNpdmVDb21wb3NlLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi8uLi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCBpbnRlcnNlY3REZWVwIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9pbnRlcnNlY3REZWVwJztcbmltcG9ydCBnZW5Db3VudEVuZHBvaW50IGZyb20gJy4uLy4uL3F1ZXJ5L2NvdW50cy9nZW5FbmRwb2ludC5zZXJ2ZXInO1xuaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5fLmV4dGVuZChOYW1lZFF1ZXJ5LnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKi9cbiAgICBleHBvc2UoY29uZmlnID0ge30pIHtcbiAgICAgICAgaWYgKCFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgJ2ludmFsaWQtZW52aXJvbm1lbnQnLFxuICAgICAgICAgICAgICAgIGBZb3UgbXVzdCBydW4gdGhpcyBpbiBzZXJ2ZXItc2lkZSBjb2RlYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzRXhwb3NlZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAncXVlcnktYWxyZWFkeS1leHBvc2VkJyxcbiAgICAgICAgICAgICAgICBgWW91IGhhdmUgYWxyZWFkeSBleHBvc2VkOiBcIiR7dGhpcy5uYW1lfVwiIG5hbWVkIHF1ZXJ5YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXhwb3NlQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgRXhwb3NlRGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgICAgIGNoZWNrKHRoaXMuZXhwb3NlQ29uZmlnLCBFeHBvc2VTY2hlbWEpO1xuXG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZy52YWxpZGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZhbGlkYXRlUGFyYW1zID0gdGhpcy5leHBvc2VDb25maWcudmFsaWRhdGVQYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhpcy5faW5pdE5vcm1hbFF1ZXJ5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TWV0aG9kKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzRXhwb3NlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbm9ybWFsIE5hbWVkUXVlcnkgKG5vcm1hbCA9PSBub3QgYSByZXNvbHZlcilcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0Tm9ybWFsUXVlcnkoKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuICAgICAgICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5faW5pdFB1YmxpY2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbmZpZy5tZXRob2QgJiYgIWNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnd2VpcmQnLFxuICAgICAgICAgICAgICAgICdJZiB5b3Ugd2FudCB0byBleHBvc2UgeW91ciBuYW1lZCBxdWVyeSB5b3UgbmVlZCB0byBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBvZiBbXCJtZXRob2RcIiwgXCJwdWJsaWNhdGlvblwiXSBvcHRpb25zIHRvIHRydWUnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5faW5pdENvdW50TWV0aG9kKCk7XG4gICAgICAgIHRoaXMuX2luaXRDb3VudFB1YmxpY2F0aW9uKCk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGVtYm9kaWVkIGJvZHkgb2YgdGhlIHJlcXVlc3RcbiAgICAgKiBAcGFyYW0geyp9IF9lbWJvZHlcbiAgICAgKiBAcGFyYW0geyp9IGJvZHlcbiAgICAgKi9cbiAgICBkb0VtYm9kaW1lbnRJZkl0QXBwbGllcyhib2R5LCBwYXJhbXMpIHtcbiAgICAgICAgLy8gcXVlcnkgaXMgbm90IGV4cG9zZWQgeWV0LCBzbyBpdCBkb2Vzbid0IGhhdmUgZW1ib2RpbWVudCBsb2dpY1xuICAgICAgICBpZiAoIXRoaXMuZXhwb3NlQ29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7IGVtYm9keSB9ID0gdGhpcy5leHBvc2VDb25maWc7XG5cbiAgICAgICAgaWYgKCFlbWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24oZW1ib2R5KSkge1xuICAgICAgICAgICAgZW1ib2R5LmNhbGwodGhpcywgYm9keSwgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lcmdlRGVlcChib2R5LCBlbWJvZHkpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRNZXRob2QoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lXShuZXdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl91bmJsb2NrSWZOZWNlc3NhcnkodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWN1cml0eSBpcyBkb25lIGluIHRoZSBmZXRjaGluZyBiZWNhdXNlIHdlIHByb3ZpZGUgYSBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xvbmUobmV3UGFyYW1zKS5mZXRjaCh0aGlzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7dm9pZH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0Q291bnRNZXRob2QoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgICAgICAgIFt0aGlzLm5hbWUgKyAnLmNvdW50J10obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fdW5ibG9ja0lmTmVjZXNzYXJ5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VjdXJpdHkgaXMgZG9uZSBpbiB0aGUgZmV0Y2hpbmcgYmVjYXVzZSB3ZSBwcm92aWRlIGEgY29udGV4dFxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNsb25lKG5ld1BhcmFtcykuZ2V0Q291bnQodGhpcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdENvdW50UHVibGljYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGdlbkNvdW50RW5kcG9pbnQoc2VsZi5uYW1lLCB7XG4gICAgICAgICAgICBnZXRDdXJzb3IoeyBzZXNzaW9uIH0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeSA9IHNlbGYuY2xvbmUoc2Vzc2lvbi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBxdWVyeS5nZXRDdXJzb3JGb3JDb3VudGluZygpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0U2Vzc2lvbihwYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRvVmFsaWRhdGVQYXJhbXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9jYWxsRmlyZXdhbGwodGhpcywgdGhpcy51c2VySWQsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBuYW1lOiBzZWxmLm5hbWUsIHBhcmFtcywgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0UHVibGljYXRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIE1ldGVvci5wdWJsaXNoQ29tcG9zaXRlKHRoaXMubmFtZSwgZnVuY3Rpb24ocGFyYW1zID0ge30pIHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2NvcGVkID0gISFzZWxmLm9wdGlvbnMuc2NvcGVkO1xuXG4gICAgICAgICAgICBpZiAoaXNTY29wZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuYWJsZVNjb3BlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuX3VuYmxvY2tJZk5lY2Vzc2FyeSh0aGlzKTtcbiAgICAgICAgICAgIHNlbGYuZG9WYWxpZGF0ZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgc2VsZi5fY2FsbEZpcmV3YWxsKHRoaXMsIHRoaXMudXNlcklkLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICBsZXQgYm9keSA9IGRlZXBDbG9uZShzZWxmLmJvZHkpO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy4kYm9keSkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGJvZHksIHBhcmFtcy4kYm9keSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSwgcGFyYW1zKTtcbiAgICAgICAgICAgIGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyhib2R5LCBwYXJhbXMpO1xuXG4gICAgICAgICAgICBjb25zdCByb290Tm9kZSA9IGNyZWF0ZUdyYXBoKHNlbGYuY29sbGVjdGlvbiwgYm9keSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVDb21wb3NlKHJvb3ROb2RlLCB1bmRlZmluZWQsIHtzY29wZWQ6IGlzU2NvcGVkfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwYXJhbSB1c2VySWRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsbEZpcmV3YWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHsgZmlyZXdhbGwgfSA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuICAgICAgICBpZiAoIWZpcmV3YWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0FycmF5KGZpcmV3YWxsKSkge1xuICAgICAgICAgICAgZmlyZXdhbGwuZm9yRWFjaChmaXJlID0+IHtcbiAgICAgICAgICAgICAgICBmaXJlLmNhbGwoY29udGV4dCwgdXNlcklkLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJld2FsbC5jYWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VuYmxvY2tJZk5lY2Vzc2FyeShjb250ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZy51bmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC51bmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iLCJpbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3NlRGVmYXVsdHMgPSB7XG4gICAgcHVibGljYXRpb246IHRydWUsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHVuYmxvY2s6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgRXhwb3NlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBwdWJsaWNhdGlvbjogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgdW5ibG9jazogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgbWV0aG9kOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBlbWJvZHk6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgICksXG4gICAgdmFsaWRhdGVQYXJhbXM6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgIClcbn07XG4iLCIvKipcbiAqIERlZXAgbWVyZ2UgdHdvIG9iamVjdHMuXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcGFyYW0gc291cmNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIG1lcmdlRGVlcCh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmIChfLmlzT2JqZWN0KHRhcmdldCkgJiYgXy5pc09iamVjdChzb3VyY2UpKSB7XG4gICAgICAgIF8uZWFjaChzb3VyY2UsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKF8uaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YXJnZXRba2V5XSkgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHsgW2tleV06IHt9IH0pO1xuICAgICAgICAgICAgICAgIG1lcmdlRGVlcCh0YXJnZXRba2V5XSwgc291cmNlW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHRhcmdldCwgeyBba2V5XTogc291cmNlW2tleV0gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG59IiwiaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y2hlY2t9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5QmFzZSB7XG4gICAgaXNHbG9iYWxRdWVyeSA9IHRydWU7XG5cbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uLCBib2R5LCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcblxuICAgICAgICB0aGlzLmJvZHkgPSBkZWVwQ2xvbmUoYm9keSk7XG5cbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB9XG5cbiAgICBjbG9uZShuZXdQYXJhbXMpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gXy5leHRlbmQoe30sIGRlZXBDbG9uZSh0aGlzLnBhcmFtcyksIG5ld1BhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgZGVlcENsb25lKHRoaXMuYm9keSksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMub3B0aW9uc1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCkge1xuICAgICAgICByZXR1cm4gYGV4cG9zdXJlXyR7dGhpcy5jb2xsZWN0aW9uLl9uYW1lfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmFsaWRhdGVzIHRoZSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgZG9WYWxpZGF0ZVBhcmFtcygpIHtcbiAgICAgICAgY29uc3Qge3ZhbGlkYXRlUGFyYW1zfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBhcmFtcykgcmV0dXJuO1xuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsaWRhdGVQYXJhbXMpKSB7XG4gICAgICAgICAgICB2YWxpZGF0ZVBhcmFtcy5jYWxsKG51bGwsIHRoaXMucGFyYW1zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hlY2sodGhpcy5wYXJhbXMpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZXMgdGhlIHBhcmFtcyB3aXRoIHByZXZpb3VzIHBhcmFtcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKiBAcmV0dXJucyB7UXVlcnl9XG4gICAgICovXG4gICAgc2V0UGFyYW1zKHBhcmFtcykge1xuICAgICAgICB0aGlzLnBhcmFtcyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59IiwiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBDb3VudFN1YnNjcmlwdGlvbiBmcm9tICcuL2NvdW50cy9jb3VudFN1YnNjcmlwdGlvbic7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHJlY3Vyc2l2ZUZldGNoIGZyb20gJy4vbGliL3JlY3Vyc2l2ZUZldGNoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgY2FsbFdpdGhQcm9taXNlIGZyb20gJy4vbGliL2NhbGxXaXRoUHJvbWlzZSc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL3F1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gb3B0aW9uYWxcbiAgICAgKiBAcmV0dXJucyB7bnVsbHxhbnl8Kn1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBNZXRlb3Iuc3Vic2NyaWJlKFxuICAgICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgICAgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksXG4gICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBmb3IgdGhpcyBxdWVyeVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVDb3VudChjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmRvVmFsaWRhdGVQYXJhbXMoKTtcblxuICAgICAgICBpZiAoIXRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBuZXcgQ291bnRTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5zdWJzY3JpYmUoXG4gICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSxcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgaWYgYW4gZXhpc3Rpbmcgc3Vic2NyaXB0aW9uIGV4aXN0c1xuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZSB0byB0aGUgY291bnRzIGlmIGEgc3Vic2NyaXB0aW9uIGV4aXN0cy5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZUNvdW50KCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhpcy5fY291bnRlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5fY291bnRlciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIGVsZW1lbnRzIGluIHN5bmMgdXNpbmcgcHJvbWlzZXNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoU3luYygpIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUaGlzIHF1ZXJ5IGlzIHJlYWN0aXZlLCBtZWFuaW5nIHlvdSBjYW5ub3QgdXNlIHByb21pc2VzIHRvIGZldGNoIHRoZSBkYXRhLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxXaXRoUHJvbWlzZSh0aGlzLm5hbWUsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIG9uZSBlbGVtZW50IGluIHN5bmNcbiAgICAgKiBAcmV0dXJuIHsqfVxuICAgICAqL1xuICAgIGFzeW5jIGZldGNoT25lU3luYygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QoYXdhaXQgdGhpcy5mZXRjaFN5bmMoKSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXRyaWV2ZXMgdGhlIGRhdGEuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrT3JPcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FsbGJhY2tPck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoU3RhdGljKGNhbGxiYWNrT3JPcHRpb25zKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2ZldGNoUmVhY3RpdmUoY2FsbGJhY2tPck9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJnc1swXTtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGNhbGxiYWNrKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBkaWQgbm90IHByb3ZpZGUgYSB2YWxpZCBjYWxsYmFjaycpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZldGNoKChlcnIsIHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgcmVzID8gXy5maXJzdChyZXMpIDogbnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cyBpbiBzeW5jLlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgYXN5bmMgZ2V0Q291bnRTeW5jKCkge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lICsgJy5jb3VudCcsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGdldENvdW50KGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5nZXRDb3VudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBjb3VudCBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBNZXRlb3IuY2FsbChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lICsgJy5jb3VudCcsXG4gICAgICAgICAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyBub24tcmVhY3RpdmUgcXVlcmllc1xuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoU3RhdGljKGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ1lvdSBhcmUgb24gY2xpZW50IHNvIHlvdSBtdXN0IGVpdGhlciBwcm92aWRlIGEgY2FsbGJhY2sgdG8gZ2V0IHRoZSBkYXRhIG9yIHN1YnNjcmliZSBmaXJzdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIE1ldGVvci5jYWxsKHRoaXMubmFtZSwgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGluZyB3aGVuIHdlJ3ZlIGdvdCBhbiBhY3RpdmUgcHVibGljYXRpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZmV0Y2hSZWFjdGl2ZShvcHRpb25zID0ge30pIHtcbiAgICAgICAgbGV0IGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKTtcbiAgICAgICAgaWYgKCFvcHRpb25zLmFsbG93U2tpcCAmJiBib2R5LiRvcHRpb25zICYmIGJvZHkuJG9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgZGVsZXRlIGJvZHkuJG9wdGlvbnMuc2tpcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWN1cnNpdmVGZXRjaChcbiAgICAgICAgICAgIGNyZWF0ZUdyYXBoKHRoaXMuY29sbGVjdGlvbiwgYm9keSksXG4gICAgICAgICAgICB0aGlzLnBhcmFtc1xuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCBRdWVyeUNsaWVudCBmcm9tICcuL3F1ZXJ5LmNsaWVudCc7XG5pbXBvcnQgUXVlcnlTZXJ2ZXIgZnJvbSAnLi9xdWVyeS5zZXJ2ZXInO1xuXG5sZXQgUXVlcnk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBRdWVyeSA9IFF1ZXJ5U2VydmVyO1xufSBlbHNlIHtcbiAgICBRdWVyeSA9IFF1ZXJ5Q2xpZW50O1xufVxuXG5leHBvcnQgZGVmYXVsdCBRdWVyeTsiLCJpbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi9saWIvY3JlYXRlR3JhcGguanMnO1xuaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4vbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBoeXBlcm5vdmEgZnJvbSAnLi9oeXBlcm5vdmEvaHlwZXJub3ZhLmpzJztcbmltcG9ydCBCYXNlIGZyb20gJy4vcXVlcnkuYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFF1ZXJ5IGV4dGVuZHMgQmFzZSB7XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSBjb250ZXh0XG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBjcmVhdGVHcmFwaChcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGh5cGVybm92YShub2RlLCBjb250ZXh0LnVzZXJJZCwge3BhcmFtczogdGhpcy5wYXJhbXN9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoT25lKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlyc3QodGhpcy5mZXRjaCguLi5hcmdzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICogQHJldHVybnMge2ludGVnZXJ9XG4gICAgICovXG4gICAgZ2V0Q291bnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uZmluZCh0aGlzLmJvZHkuJGZpbHRlcnMgfHwge30sIHt9KS5jb3VudCgpO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgeyBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8qKlxuICogSW50ZXJuYWwgY29sbGVjdGlvbiB1c2VkIHRvIHN0b3JlIGNvdW50cyBvbiB0aGUgY2xpZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCBuZXcgTW9uZ28uQ29sbGVjdGlvbihDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQpO1xuIiwiZXhwb3J0IGNvbnN0IENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCA9ICdncmFwaGVyX2NvdW50cyc7XG4iLCJpbXBvcnQgeyBFSlNPTiB9IGZyb20gJ21ldGVvci9lanNvbic7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJlYWN0aXZlVmFyIH0gZnJvbSAnbWV0ZW9yL3JlYWN0aXZlLXZhcic7XG5pbXBvcnQgeyBUcmFja2VyIH0gZnJvbSAnbWV0ZW9yL3RyYWNrZXInO1xuXG5pbXBvcnQgQ291bnRzIGZyb20gJy4vY29sbGVjdGlvbic7XG5pbXBvcnQgY3JlYXRlRmF1eFN1YnNjcmlwdGlvbiBmcm9tICcuL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24nO1xuaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4uL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeUJhc2UgZnJvbSAnLi4vLi4vbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3VudFN1YnNjcmlwdGlvbiB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsqfSBxdWVyeSAtIFRoZSBxdWVyeSB0byB1c2Ugd2hlbiBmZXRjaGluZyBjb3VudHNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihxdWVyeSkge1xuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuID0gbmV3IFJlYWN0aXZlVmFyKG51bGwpO1xuICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBudWxsO1xuICAgICAgICB0aGlzLnF1ZXJ5ID0gcXVlcnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgZm9yIHJlYWN0aXZlIGNvdW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gYXJnIC0gVGhlIGFyZ3VtZW50IHRvIHBhc3MgdG8ge25hbWV9LmNvdW50LnN1YnNjcmliZVxuICAgICAqIEBwYXJhbSB7Kn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBzdWJzY3JpYmUoYXJnLCBjYWxsYmFjaykge1xuICAgICAgICAvLyBEb24ndCB0cnkgdG8gcmVzdWJzY3JpYmUgaWYgYXJnIGhhc24ndCBjaGFuZ2VkXG4gICAgICAgIGlmIChFSlNPTi5lcXVhbHModGhpcy5sYXN0QXJncywgYXJnKSAmJiB0aGlzLmZhdXhIYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZhdXhIYW5kbGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldChudWxsKTtcbiAgICAgICAgdGhpcy5sYXN0QXJncyA9IGFyZztcblxuICAgICAgICBNZXRlb3IuY2FsbCh0aGlzLnF1ZXJ5Lm5hbWUgKyAnLmNvdW50LnN1YnNjcmliZScsIGFyZywgKGVycm9yLCB0b2tlbikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZSh0aGlzLnF1ZXJ5Lm5hbWUgKyAnLmNvdW50JywgdG9rZW4sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldCh0b2tlbik7XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RDb21wdXRhdGlvbiA9IFRyYWNrZXIuYXV0b3J1bigoKSA9PiB0aGlzLmhhbmRsZURpc2Nvbm5lY3QoKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclVuc3Vic2NyaWJlID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IGNyZWF0ZUZhdXhTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLmZhdXhIYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmVzIGZyb20gdGhlIGNvdW50IGVuZHBvaW50LCBpZiB0aGVyZSBpcyBzdWNoIGEgc3Vic2NyaXB0aW9uLlxuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdENvbXB1dGF0aW9uLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHdlIGhpdCB0aGlzIGJyYW5jaCwgdGhlbiBNZXRlb3IuY2FsbCBpbiBzdWJzY3JpYmUgaGFzbid0IGZpbmlzaGVkIHlldFxuICAgICAgICAgICAgLy8gc28gc2V0IGEgZmxhZyB0byBzdG9wIHRoZSBzdWJzY3JpcHRpb24gZnJvbSBiZWluZyBjcmVhdGVkXG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFjY2Vzc1Rva2VuLnNldChudWxsKTtcbiAgICAgICAgdGhpcy5mYXV4SGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlYWN0aXZlbHkgZmV0Y2ggY3VycmVudCBkb2N1bWVudCBjb3VudC4gUmV0dXJucyBudWxsIGlmIHRoZSBzdWJzY3JpcHRpb24gaXMgbm90IHJlYWR5IHlldC5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtOdW1iZXJ8bnVsbH0gLSBDdXJyZW50IGRvY3VtZW50IGNvdW50XG4gICAgICovXG4gICAgZ2V0Q291bnQoKSB7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5hY2Nlc3NUb2tlbi5nZXQoKTtcbiAgICAgICAgaWYgKGlkID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBkb2MgPSBDb3VudHMuZmluZE9uZShpZCk7XG4gICAgICAgIHJldHVybiBkb2MuY291bnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIHNlc3Npb24gaW5mbyBnZXRzIGRlbGV0ZWQgd2hlbiB0aGUgc2VydmVyIGdvZXMgZG93biwgc28gd2hlbiB0aGUgY2xpZW50IGF0dGVtcHRzIHRvXG4gICAgICogb3B0aW1pc3RpY2FsbHkgcmVzdW1lIHRoZSAnLmNvdW50JyBwdWJsaWNhdGlvbiwgdGhlIHNlcnZlciB3aWxsIHRocm93IGEgJ25vLXJlcXVlc3QnIGVycm9yLlxuICAgICAqXG4gICAgICogVGhpcyBmdW5jdGlvbiBwcmV2ZW50cyB0aGF0IGJ5IG1hbnVhbGx5IHN0b3BwaW5nIGFuZCByZXN0YXJ0aW5nIHRoZSBzdWJzY3JpcHRpb24gd2hlbiB0aGVcbiAgICAgKiBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIgaXMgbG9zdC5cbiAgICAgKi9cbiAgICBoYW5kbGVEaXNjb25uZWN0KCkge1xuICAgICAgICBjb25zdCBzdGF0dXMgPSBNZXRlb3Iuc3RhdHVzKCk7XG4gICAgICAgIGlmICghc3RhdHVzLmNvbm5lY3RlZCkge1xuICAgICAgICAgICAgdGhpcy5fbWFya2VkRm9yUmVzdW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3RhdHVzLmNvbm5lY3RlZCAmJiB0aGlzLl9tYXJrZWRGb3JSZXN1bWUpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclJlc3VtZSA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUodGhpcy5sYXN0QXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHdoZXRoZXIgb3Igbm90IGEgc3Vic2NyaXB0aW9uIHJlcXVlc3QgaGFzIGJlZW4gbWFkZS5cbiAgICAgKi9cbiAgICBpc1N1YnNjcmliZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY2Vzc1Rva2VuLmdldCgpICE9PSBudWxsO1xuICAgIH1cbn1cbiIsIi8qKlxuICogVGhpcyBtZXRob2QgY3JlYXRlcyBhIFwiZmFrZVwiIHN1YnNjcmlwdGlvbiBoYW5kbGUgc28gdGhhdCB1c2VycyBvZiBDb3VudFN1YnNjcmlwdGlvbiNzdWJzY3JpYmVcbiAqIGhhdmUgYW4gaW50ZXJmYWNlIGNvbnNpc3RlbnQgd2l0aCBub3JtYWwgc3Vic2NyaXB0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge0NvdW50U3Vic2NyaXB0aW9ufSBjb3VudE1hbmFnZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKGNvdW50TWFuYWdlcikgPT4gKHtcbiAgICByZWFkeTogKCkgPT4gY291bnRNYW5hZ2VyLmFjY2Vzc1Rva2VuLmdldCgpICE9PSBudWxsICYmIGNvdW50TWFuYWdlci5zdWJzY3JpcHRpb25IYW5kbGUucmVhZHkoKSxcbiAgICBzdG9wOiAoKSA9PiBjb3VudE1hbmFnZXIudW5zdWJzY3JpYmUoKSxcbn0pO1xuIiwiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmltcG9ydCB7IENPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCB9IGZyb20gJy4vY29uc3RhbnRzJztcblxuLy8gWFhYOiBTaG91bGQgdGhpcyBwZXJzaXN0IGJldHdlZW4gc2VydmVyIHJlc3RhcnRzP1xuY29uc3QgY29sbGVjdGlvbiA9IG5ldyBNb25nby5Db2xsZWN0aW9uKG51bGwpO1xuXG4vKipcbiAqIFRoaXMgbWV0aG9kIGdlbmVyYXRlcyBhIHJlYWN0aXZlIGNvdW50IGVuZHBvaW50IChhIG1ldGhvZCBhbmQgcHVibGljYXRpb24pIGZvciBhIGNvbGxlY3Rpb24gb3IgbmFtZWQgcXVlcnkuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBxdWVyeSBvciBjb2xsZWN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRDdXJzb3IgLSBUYWtlcyBpbiB0aGUgdXNlcidzIHNlc3Npb24gZG9jdW1lbnQgYXMgYW4gYXJndW1lbnQsIGFuZCB0dXJucyB0aGF0IGludG8gYSBNb25nbyBjdXJzb3IuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBnZXRTZXNzaW9uIC0gVGFrZXMgdGhlIHN1YnNjcmliZSBtZXRob2QncyBhcmd1bWVudCBhcyBpdHMgcGFyYW1ldGVyLiBTaG91bGQgZW5mb3JjZSBhbnkgbmVjZXNzYXJ5IHNlY3VyaXR5IGNvbnN0cmFpbnRzLiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gaXMgc3RvcmVkIGluIHRoZSBzZXNzaW9uIGRvY3VtZW50LlxuICovXG5leHBvcnQgZGVmYXVsdCAobmFtZSwgeyBnZXRDdXJzb3IsIGdldFNlc3Npb24gfSkgPT4ge1xuICAgIE1ldGVvci5tZXRob2RzKHtcbiAgICAgICAgW25hbWUgKyAnLmNvdW50LnN1YnNjcmliZSddKHBhcmFtc09yQm9keSkge1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IGdldFNlc3Npb24uY2FsbCh0aGlzLCBwYXJhbXNPckJvZHkpO1xuICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbklkID0gSlNPTi5zdHJpbmdpZnkoc2Vzc2lvbik7XG5cbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU2Vzc2lvbiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7XG4gICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvbklkLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gVHJ5IHRvIHJldXNlIHNlc3Npb25zIGlmIHRoZSB1c2VyIHN1YnNjcmliZXMgbXVsdGlwbGUgdGltZXMgd2l0aCB0aGUgc2FtZSBkYXRhXG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdTZXNzaW9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nU2Vzc2lvbi5faWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHRva2VuID0gY29sbGVjdGlvbi5pbnNlcnQoe1xuICAgICAgICAgICAgICAgIHNlc3Npb246IHNlc3Npb25JZCxcbiAgICAgICAgICAgICAgICBxdWVyeTogbmFtZSxcbiAgICAgICAgICAgICAgICB1c2VySWQ6IHRoaXMudXNlcklkLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgICAgfSxcbiAgICB9KTtcblxuICAgIE1ldGVvci5wdWJsaXNoKG5hbWUgKyAnLmNvdW50JywgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgY2hlY2sodG9rZW4sIFN0cmluZyk7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCByZXF1ZXN0ID0gY29sbGVjdGlvbi5maW5kT25lKHsgX2lkOiB0b2tlbiwgdXNlcklkOiBzZWxmLnVzZXJJZCB9KTtcblxuICAgICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnbm8tcmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgYFlvdSBtdXN0IGFjcXVpcmUgYSByZXF1ZXN0IHRva2VuIHZpYSB0aGUgXCIke25hbWV9LmNvdW50LnN1YnNjcmliZVwiIG1ldGhvZCBmaXJzdC5gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdC5zZXNzaW9uID0gSlNPTi5wYXJzZShyZXF1ZXN0LnNlc3Npb24pO1xuICAgICAgICBjb25zdCBjdXJzb3IgPSBnZXRDdXJzb3IuY2FsbCh0aGlzLCByZXF1ZXN0KTtcblxuICAgICAgICAvLyBTdGFydCBjb3VudGluZ1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIGxldCBpc1JlYWR5ID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IGN1cnNvci5vYnNlcnZlKHtcbiAgICAgICAgICAgIGFkZGVkKCkge1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgaXNSZWFkeSAmJlxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZWQoKSB7XG4gICAgICAgICAgICAgICAgY291bnQtLTtcbiAgICAgICAgICAgICAgICBpc1JlYWR5ICYmXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhbmdlZChDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQsIHRva2VuLCB7IGNvdW50IH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXNSZWFkeSA9IHRydWU7XG4gICAgICAgIHNlbGYuYWRkZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcblxuICAgICAgICBzZWxmLm9uU3RvcCgoKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGUuc3RvcCgpO1xuICAgICAgICAgICAgY29sbGVjdGlvbi5yZW1vdmUodG9rZW4pO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLnJlYWR5KCk7XG4gICAgfSk7XG59O1xuIiwiaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5mdW5jdGlvbiBleHRyYWN0SWRzRnJvbUFycmF5KGFycmF5LCBmaWVsZCkge1xuICAgIHJldHVybiAoYXJyYXkgfHwgW10pLm1hcChvYmogPT4gXy5pc09iamVjdChvYmopID8gZG90LnBpY2soZmllbGQsIG9iaikgOiB1bmRlZmluZWQpLmZpbHRlcih2ID0+ICEhdik7XG59XG5cbi8qKlxuICogSXRzIHB1cnBvc2UgaXMgdG8gY3JlYXRlIGZpbHRlcnMgdG8gZ2V0IHRoZSByZWxhdGVkIGRhdGEgaW4gb25lIHJlcXVlc3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFnZ3JlZ2F0ZUZpbHRlcnMge1xuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb25Ob2RlLCBtZXRhRmlsdGVycykge1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb25Ob2RlID0gY29sbGVjdGlvbk5vZGU7XG4gICAgICAgIHRoaXMubGlua2VyID0gY29sbGVjdGlvbk5vZGUubGlua2VyO1xuICAgICAgICB0aGlzLm1ldGFGaWx0ZXJzID0gbWV0YUZpbHRlcnM7XG4gICAgICAgIHRoaXMuaXNWaXJ0dWFsID0gdGhpcy5saW5rZXIuaXNWaXJ0dWFsKCk7XG5cbiAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5saW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICB9XG5cbiAgICBnZXQgcGFyZW50T2JqZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHM7XG4gICAgfVxuXG4gICAgY3JlYXRlKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubGlua2VyLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9uZSgpO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9uZU1ldGEoKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnknOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU1hbnkoKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTWFueU1ldGEoKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5rZXIgdHlwZTogJHt0aGlzLmxpbmtlci50eXBlfWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlT25lKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIF9pZDoge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShleHRyYWN0SWRzRnJvbUFycmF5KHRoaXMucGFyZW50T2JqZWN0cywgdGhpcy5saW5rU3RvcmFnZUZpZWxkKSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCAnX2lkJylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVPbmVNZXRhKCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICBsZXQgZWxpZ2libGVPYmplY3RzID0gdGhpcy5wYXJlbnRPYmplY3RzO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tZXRhRmlsdGVycykge1xuICAgICAgICAgICAgICAgIGVsaWdpYmxlT2JqZWN0cyA9IF8uZmlsdGVyKHRoaXMucGFyZW50T2JqZWN0cywgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNpZnQodGhpcy5tZXRhRmlsdGVycykob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzdG9yYWdlcyA9IF8ucGx1Y2soZWxpZ2libGVPYmplY3RzLCB0aGlzLmxpbmtTdG9yYWdlRmllbGQpO1xuICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuICAgICAgICAgICAgXy5lYWNoKHN0b3JhZ2VzLCBzdG9yYWdlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc3RvcmFnZSkge1xuICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChzdG9yYWdlLl9pZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7JGluOiBfLnVuaXEoaWRzKX1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5tZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyc1t0aGlzLmxpbmtTdG9yYWdlRmllbGQgKyAnLicgKyBrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsdGVyc1t0aGlzLmxpbmtTdG9yYWdlRmllbGQgKyAnLl9pZCddID0ge1xuICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIGZpbHRlcnM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNYW55KCkge1xuICAgICAgICBpZiAoIXRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICBjb25zdCBbcm9vdCwgLi4ubmVzdGVkXSA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgY29uc3QgYXJyYXlPZklkcyA9IF8udW5pb24oLi4uZXh0cmFjdElkc0Zyb21BcnJheSh0aGlzLnBhcmVudE9iamVjdHMsIHJvb3QpKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICRpbjogXy51bmlxKG5lc3RlZC5sZW5ndGggPiAwID8gZXh0cmFjdElkc0Zyb21BcnJheShhcnJheU9mSWRzLCBuZXN0ZWQuam9pbignLicpKSA6IGFycmF5T2ZJZHMpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5T2ZJZHMgPSBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5pb24oLi4uYXJyYXlPZklkcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNYW55TWV0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuXG4gICAgICAgICAgICBfLmVhY2godGhpcy5wYXJlbnRPYmplY3RzLCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tZXRhRmlsdGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHNpZnQodGhpcy5tZXRhRmlsdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0sIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsaWQob2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChvYmplY3QuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChvYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChvYmplY3QuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7JGluOiBfLnVuaXEoaWRzKX1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5tZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsdGVycy5faWQgPSB7XG4gICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCAnX2lkJylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdOiB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtTWF0Y2g6IGZpbHRlcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGNsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMgZnJvbSAnLi9saWIvY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyc7XG5cbi8qKlxuICogVGhpcyBvbmx5IGFwcGxpZXMgdG8gaW52ZXJzZWQgbGlua3MuIEl0IHdpbGwgYXNzZW1ibGUgdGhlIGRhdGEgaW4gYSBjb3JyZWN0IG1hbm5lci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY2hpbGRDb2xsZWN0aW9uTm9kZSwgYWdncmVnYXRlUmVzdWx0cywgbWV0YUZpbHRlcnMpIHtcbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcbiAgICBjb25zdCBsaW5rU3RvcmFnZUZpZWxkID0gbGlua2VyLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgY29uc3QgbGlua05hbWUgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lO1xuICAgIGNvbnN0IGlzTWV0YSA9IGxpbmtlci5pc01ldGEoKTtcbiAgICBjb25zdCBpc01hbnkgPSBsaW5rZXIuaXNNYW55KCk7XG5cbiAgICBsZXQgYWxsUmVzdWx0cyA9IFtdO1xuXG4gICAgaWYgKGlzTWV0YSAmJiBtZXRhRmlsdGVycykge1xuICAgICAgICBjb25zdCBtZXRhRmlsdGVyc1Rlc3QgPSBzaWZ0KG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgXy5lYWNoKGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzKFxuICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdCxcbiAgICAgICAgICAgICAgICBsaW5rU3RvcmFnZUZpZWxkLFxuICAgICAgICAgICAgICAgIG1ldGFGaWx0ZXJzVGVzdFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGlzTWV0YSAmJiBpc01hbnkpIHtcbiAgICAgICAgLy8gVGhpcyBjYXNlIGlzIHRyZWF0ZWQgZGlmZmVyZW50bHkgYmVjYXVzZSB3ZSBnZXQgYW4gYXJyYXkgcmVzcG9uc2UgZnJvbSB0aGUgcGlwZWxpbmUuXG5cbiAgICAgICAgXy5lYWNoKGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbbGlua05hbWVdID0gcGFyZW50UmVzdWx0W2xpbmtOYW1lXSB8fCBbXTtcblxuICAgICAgICAgICAgY29uc3QgZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzID0gXy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0cyxcbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyhhZ2dyZWdhdGVSZXN1bHQuX2lkLCBwYXJlbnRSZXN1bHQuX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFzID0gXy5wbHVjayhlbGlnaWJsZUFnZ3JlZ2F0ZVJlc3VsdHMsICdkYXRhJyk7IC8vLyBbIFt4MSwgeDJdLCBbeDIsIHgzXSBdXG5cbiAgICAgICAgICAgICAgICBfLmVhY2goZGF0YXMsIGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goZGF0YSwgaXRlbSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHRbbGlua05hbWVdLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBfLmVhY2goYWdncmVnYXRlUmVzdWx0cywgYWdncmVnYXRlUmVzdWx0ID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChhZ2dyZWdhdGVSZXN1bHQuZGF0YSwgaXRlbSA9PiBhbGxSZXN1bHRzLnB1c2goaXRlbSkpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY29tcGFyYXRvcjtcbiAgICAgICAgaWYgKGlzTWFueSkge1xuICAgICAgICAgICAgY29tcGFyYXRvciA9IChhZ2dyZWdhdGVSZXN1bHQsIHJlc3VsdCkgPT5cbiAgICAgICAgICAgICAgICBfLmNvbnRhaW5zKGFnZ3JlZ2F0ZVJlc3VsdC5faWQsIHJlc3VsdC5faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29tcGFyYXRvciA9IChhZ2dyZWdhdGVSZXN1bHQsIHJlc3VsdCkgPT5cbiAgICAgICAgICAgICAgICBhZ2dyZWdhdGVSZXN1bHQuX2lkID09IHJlc3VsdC5faWQ7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjaGlsZExpbmtOYW1lID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZTtcbiAgICAgICAgY29uc3QgcGFyZW50UmVzdWx0cyA9IGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHM7XG5cbiAgICAgICAgcGFyZW50UmVzdWx0cy5mb3JFYWNoKHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAvLyBXZSBhcmUgbm93IGZpbmRpbmcgdGhlIGRhdGEgZnJvbSB0aGUgcGlwZWxpbmUgdGhhdCBpcyByZWxhdGVkIHRvIHRoZSBfaWQgb2YgdGhlIHBhcmVudFxuICAgICAgICAgICAgY29uc3QgZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzID0gYWdncmVnYXRlUmVzdWx0cy5maWx0ZXIoXG4gICAgICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0ID0+IGNvbXBhcmF0b3IoYWdncmVnYXRlUmVzdWx0LCBwYXJlbnRSZXN1bHQpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBlbGlnaWJsZUFnZ3JlZ2F0ZVJlc3VsdHMuZm9yRWFjaChhZ2dyZWdhdGVSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmVudFJlc3VsdFtjaGlsZExpbmtOYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2NoaWxkTGlua05hbWVdLnB1c2goLi4uYWdncmVnYXRlUmVzdWx0LmRhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZExpbmtOYW1lXSA9IFsuLi5hZ2dyZWdhdGVSZXN1bHQuZGF0YV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFnZ3JlZ2F0ZVJlc3VsdHMuZm9yRWFjaChhZ2dyZWdhdGVSZXN1bHQgPT4ge1xuICAgICAgICAgICAgYWxsUmVzdWx0cy5wdXNoKC4uLmFnZ3JlZ2F0ZVJlc3VsdC5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gYWxsUmVzdWx0cztcbn1cbiIsImltcG9ydCBjcmVhdGVTZWFyY2hGaWx0ZXJzIGZyb20gJy4uLy4uL2xpbmtzL2xpYi9jcmVhdGVTZWFyY2hGaWx0ZXJzJztcbmltcG9ydCBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIGZyb20gJy4vbGliL2NsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMnO1xuaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCAoY2hpbGRDb2xsZWN0aW9uTm9kZSwgeyBsaW1pdCwgc2tpcCwgbWV0YUZpbHRlcnMgfSkgPT4ge1xuICAgIGlmIChjaGlsZENvbGxlY3Rpb25Ob2RlLnJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJlbnQgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudDtcbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcblxuICAgIGNvbnN0IHN0cmF0ZWd5ID0gbGlua2VyLnN0cmF0ZWd5O1xuICAgIGNvbnN0IGlzU2luZ2xlID0gbGlua2VyLmlzU2luZ2xlKCk7XG4gICAgY29uc3QgaXNNZXRhID0gbGlua2VyLmlzTWV0YSgpO1xuICAgIGNvbnN0IGZpZWxkU3RvcmFnZSA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgLy8gY2xlYW5pbmcgdGhlIHBhcmVudCByZXN1bHRzIGZyb20gYSBjaGlsZFxuICAgIC8vIHRoaXMgbWF5IGJlIHRoZSB3cm9uZyBhcHByb2FjaCBidXQgaXQgd29ya3MgZm9yIG5vd1xuICAgIGlmIChpc01ldGEgJiYgbWV0YUZpbHRlcnMpIHtcbiAgICAgICAgY29uc3QgbWV0YUZpbHRlcnNUZXN0ID0gc2lmdChtZXRhRmlsdGVycyk7XG4gICAgICAgIF8uZWFjaChwYXJlbnQucmVzdWx0cywgcGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGNsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMoXG4gICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0LFxuICAgICAgICAgICAgICAgIGZpZWxkU3RvcmFnZSxcbiAgICAgICAgICAgICAgICBtZXRhRmlsdGVyc1Rlc3RcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHNCeUtleUlkID0gXy5ncm91cEJ5KGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cywgJ19pZCcpO1xuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnb25lJykge1xuICAgICAgICBwYXJlbnQucmVzdWx0cy5mb3JFYWNoKHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGRvdC5waWNrKGZpZWxkU3RvcmFnZSwgcGFyZW50UmVzdWx0KTtcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGZpbHRlckFzc2VtYmxlZERhdGEoXG4gICAgICAgICAgICAgICAgcmVzdWx0c0J5S2V5SWRbdmFsdWVdLFxuICAgICAgICAgICAgICAgIHsgbGltaXQsIHNraXAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnbWFueScpIHtcbiAgICAgICAgcGFyZW50LnJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgLy8gc3VwcG9ydCBkb3R0ZWQgZmllbGRzXG4gICAgICAgICAgICBjb25zdCBbcm9vdCwgLi4ubmVzdGVkXSA9IGZpZWxkU3RvcmFnZS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBkb3QucGljayhyb290LCBwYXJlbnRSZXN1bHQpO1xuICAgICAgICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gW107XG4gICAgICAgICAgICB2YWx1ZS5mb3JFYWNoKHYgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IF9pZCA9IG5lc3RlZC5sZW5ndGggPiAwID8gZG90LnBpY2sobmVzdGVkLmpvaW4oJy4nKSwgdikgOiB2O1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChfLmZpcnN0KHJlc3VsdHNCeUtleUlkW19pZF0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBmaWx0ZXJBc3NlbWJsZWREYXRhKFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgeyBsaW1pdCwgc2tpcCB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoc3RyYXRlZ3kgPT09ICdvbmUtbWV0YScpIHtcbiAgICAgICAgcGFyZW50LnJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgaWYgKCFwYXJlbnRSZXN1bHRbZmllbGRTdG9yYWdlXSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgX2lkID0gcGFyZW50UmVzdWx0W2ZpZWxkU3RvcmFnZV0uX2lkO1xuICAgICAgICAgICAgcGFyZW50UmVzdWx0W2NoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gZmlsdGVyQXNzZW1ibGVkRGF0YShcbiAgICAgICAgICAgICAgICByZXN1bHRzQnlLZXlJZFtfaWRdLFxuICAgICAgICAgICAgICAgIHsgbGltaXQsIHNraXAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHN0cmF0ZWd5ID09PSAnbWFueS1tZXRhJykge1xuICAgICAgICBwYXJlbnQucmVzdWx0cy5mb3JFYWNoKHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBfaWRzID0gXy5wbHVjayhwYXJlbnRSZXN1bHRbZmllbGRTdG9yYWdlXSwgJ19pZCcpO1xuICAgICAgICAgICAgbGV0IGRhdGEgPSBbXTtcbiAgICAgICAgICAgIF9pZHMuZm9yRWFjaChfaWQgPT4ge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaChfLmZpcnN0KHJlc3VsdHNCeUtleUlkW19pZF0pKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBmaWx0ZXJBc3NlbWJsZWREYXRhKFxuICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgeyBsaW1pdCwgc2tpcCB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBmaWx0ZXJBc3NlbWJsZWREYXRhKGRhdGEsIHsgbGltaXQsIHNraXAgfSkge1xuICAgIGlmIChsaW1pdCAmJiBBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIHJldHVybiBkYXRhLnNsaWNlKHNraXAsIGxpbWl0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbn1cbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQge1NBRkVfRE9UVEVEX0ZJRUxEX1JFUExBQ0VNRU5UfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjaGlsZENvbGxlY3Rpb25Ob2RlLCBmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpIHtcbiAgICBsZXQgY29udGFpbnNEb3R0ZWRGaWVsZHMgPSBmYWxzZTtcbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcbiAgICBjb25zdCBsaW5rU3RvcmFnZUZpZWxkID0gbGlua2VyLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbjtcblxuICAgIGxldCBwaXBlbGluZSA9IFtdO1xuXG4gICAgaWYgKGNvbGxlY3Rpb24uZmlyZXdhbGwpIHtcbiAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuICAgIH1cblxuICAgIHBpcGVsaW5lLnB1c2goeyRtYXRjaDogZmlsdGVyc30pO1xuXG4gICAgaWYgKG9wdGlvbnMuc29ydCAmJiBfLmtleXMob3B0aW9ucy5zb3J0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBpcGVsaW5lLnB1c2goeyRzb3J0OiBvcHRpb25zLnNvcnR9KVxuICAgIH1cblxuICAgIGxldCBfaWQgPSBsaW5rU3RvcmFnZUZpZWxkO1xuICAgIGlmIChsaW5rZXIuaXNNZXRhKCkpIHtcbiAgICAgICAgX2lkICs9ICcuX2lkJztcbiAgICB9XG5cbiAgICBsZXQgZGF0YVB1c2ggPSB7XG4gICAgICAgIF9pZDogJyRfaWQnXG4gICAgfTtcblxuICAgIF8uZWFjaChvcHRpb25zLmZpZWxkcywgKHZhbHVlLCBmaWVsZCkgPT4ge1xuICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignLicpID49IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5zRG90dGVkRmllbGRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzYWZlRmllbGQgPSBmaWVsZC5yZXBsYWNlKC9cXC4vZywgU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQpO1xuICAgICAgICBkYXRhUHVzaFtzYWZlRmllbGRdID0gJyQnICsgZmllbGRcbiAgICB9KTtcblxuICAgIGlmIChsaW5rZXIuaXNNZXRhKCkpIHtcbiAgICAgICAgZGF0YVB1c2hbbGlua1N0b3JhZ2VGaWVsZF0gPSAnJCcgKyBsaW5rU3RvcmFnZUZpZWxkO1xuICAgIH1cblxuICAgIHBpcGVsaW5lLnB1c2goe1xuICAgICAgICAkZ3JvdXA6IHtcbiAgICAgICAgICAgIF9pZDogXCIkXCIgKyBfaWQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJHB1c2g6IGRhdGFQdXNoXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChvcHRpb25zLmxpbWl0IHx8IG9wdGlvbnMuc2tpcCkge1xuICAgICAgICBsZXQgJHNsaWNlID0gW1wiJGRhdGFcIl07XG4gICAgICAgIGlmIChvcHRpb25zLnNraXApICRzbGljZS5wdXNoKG9wdGlvbnMuc2tpcCk7XG4gICAgICAgIGlmIChvcHRpb25zLmxpbWl0KSAkc2xpY2UucHVzaChvcHRpb25zLmxpbWl0KTtcblxuICAgICAgICBwaXBlbGluZS5wdXNoKHtcbiAgICAgICAgICAgICRwcm9qZWN0OiB7XG4gICAgICAgICAgICAgICAgX2lkOiAxLFxuICAgICAgICAgICAgICAgIGRhdGE6IHskc2xpY2V9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHtwaXBlbGluZSwgY29udGFpbnNEb3R0ZWRGaWVsZHN9O1xufSIsImV4cG9ydCBjb25zdCBTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVCA9ICdfX18nOyIsImltcG9ydCBhcHBseVByb3BzIGZyb20gJy4uL2xpYi9hcHBseVByb3BzLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yRGVsaXZlcnkgZnJvbSAnLi4vbGliL3ByZXBhcmVGb3JEZWxpdmVyeS5qcyc7XG5pbXBvcnQgc3RvcmVIeXBlcm5vdmFSZXN1bHRzIGZyb20gJy4vc3RvcmVIeXBlcm5vdmFSZXN1bHRzLmpzJztcblxuZnVuY3Rpb24gaHlwZXJub3ZhKGNvbGxlY3Rpb25Ob2RlLCB1c2VySWQpIHtcbiAgICBfLmVhY2goY29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbk5vZGVzLCBjaGlsZENvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMoY2hpbGRDb2xsZWN0aW9uTm9kZSk7XG5cbiAgICAgICAgc3RvcmVIeXBlcm5vdmFSZXN1bHRzKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHVzZXJJZCk7XG4gICAgICAgIGh5cGVybm92YShjaGlsZENvbGxlY3Rpb25Ob2RlLCB1c2VySWQpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoeXBlcm5vdmFJbml0KGNvbGxlY3Rpb25Ob2RlLCB1c2VySWQsIGNvbmZpZyA9IHt9KSB7XG4gICAgY29uc3QgYnlwYXNzRmlyZXdhbGxzID0gY29uZmlnLmJ5cGFzc0ZpcmV3YWxscyB8fCBmYWxzZTtcbiAgICBjb25zdCBwYXJhbXMgPSBjb25maWcucGFyYW1zIHx8IHt9O1xuXG4gICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMoY29sbGVjdGlvbk5vZGUpO1xuXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb247XG5cbiAgICBjb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gY29sbGVjdGlvbi5maW5kKGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCkuZmV0Y2goKTtcblxuICAgIGNvbnN0IHVzZXJJZFRvUGFzcyA9IChjb25maWcuYnlwYXNzRmlyZXdhbGxzKSA/IHVuZGVmaW5lZCA6IHVzZXJJZDtcbiAgICBoeXBlcm5vdmEoY29sbGVjdGlvbk5vZGUsIHVzZXJJZFRvUGFzcyk7XG5cbiAgICBwcmVwYXJlRm9yRGVsaXZlcnkoY29sbGVjdGlvbk5vZGUsIHBhcmFtcyk7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbk5vZGUucmVzdWx0cztcbn1cbiIsImltcG9ydCBhcHBseVByb3BzIGZyb20gJy4uL2xpYi9hcHBseVByb3BzLmpzJztcbmltcG9ydCBBZ2dyZWdhdGVGaWx0ZXJzIGZyb20gJy4vYWdncmVnYXRlU2VhcmNoRmlsdGVycy5qcyc7XG5pbXBvcnQgYXNzZW1ibGUgZnJvbSAnLi9hc3NlbWJsZXIuanMnO1xuaW1wb3J0IGFzc2VtYmxlQWdncmVnYXRlUmVzdWx0cyBmcm9tICcuL2Fzc2VtYmxlQWdncmVnYXRlUmVzdWx0cy5qcyc7XG5pbXBvcnQgYnVpbGRBZ2dyZWdhdGVQaXBlbGluZSBmcm9tICcuL2J1aWxkQWdncmVnYXRlUGlwZWxpbmUuanMnO1xuaW1wb3J0IHNuYXBCYWNrRG90dGVkRmllbGRzIGZyb20gJy4vbGliL3NuYXBCYWNrRG90dGVkRmllbGRzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RvcmVIeXBlcm5vdmFSZXN1bHRzKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHVzZXJJZCkge1xuICAgIGlmIChjaGlsZENvbGxlY3Rpb25Ob2RlLnBhcmVudC5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gKGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IFtdKTtcbiAgICB9XG5cbiAgICBsZXQgeyBmaWx0ZXJzLCBvcHRpb25zIH0gPSBhcHBseVByb3BzKGNoaWxkQ29sbGVjdGlvbk5vZGUpO1xuXG4gICAgY29uc3QgbWV0YUZpbHRlcnMgPSBmaWx0ZXJzLiRtZXRhO1xuICAgIGNvbnN0IGFnZ3JlZ2F0ZUZpbHRlcnMgPSBuZXcgQWdncmVnYXRlRmlsdGVycyhcbiAgICAgICAgY2hpbGRDb2xsZWN0aW9uTm9kZSxcbiAgICAgICAgbWV0YUZpbHRlcnNcbiAgICApO1xuICAgIGRlbGV0ZSBmaWx0ZXJzLiRtZXRhO1xuXG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgaXNWaXJ0dWFsID0gbGlua2VyLmlzVmlydHVhbCgpO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb247XG5cblxuICAgIF8uZXh0ZW5kKGZpbHRlcnMsIGFnZ3JlZ2F0ZUZpbHRlcnMuY3JlYXRlKCkpO1xuXG4gICAgLy8gaWYgaXQncyBub3QgdmlydHVhbCB0aGVuIHdlIHJldHJpZXZlIHRoZW0gYW5kIGFzc2VtYmxlIHRoZW0gaGVyZS5cbiAgICBpZiAoIWlzVmlydHVhbCkge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZE9wdGlvbnMgPSBfLm9taXQob3B0aW9ucywgJ2xpbWl0Jyk7XG5cbiAgICAgICAgY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gY29sbGVjdGlvblxuICAgICAgICAgICAgLmZpbmQoZmlsdGVycywgZmlsdGVyZWRPcHRpb25zLCB1c2VySWQpXG4gICAgICAgICAgICAuZmV0Y2goKTtcblxuICAgICAgICBhc3NlbWJsZShjaGlsZENvbGxlY3Rpb25Ob2RlLCB7XG4gICAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgICAgbWV0YUZpbHRlcnMsXG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHZpcnR1YWxzIGFycml2ZSBoZXJlXG4gICAgICAgIGxldCB7IHBpcGVsaW5lLCBjb250YWluc0RvdHRlZEZpZWxkcyB9ID0gYnVpbGRBZ2dyZWdhdGVQaXBlbGluZShcbiAgICAgICAgICAgIGNoaWxkQ29sbGVjdGlvbk5vZGUsXG4gICAgICAgICAgICBmaWx0ZXJzLFxuICAgICAgICAgICAgb3B0aW9ucyxcbiAgICAgICAgICAgIHVzZXJJZFxuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhZ2dyZWdhdGVSZXN1bHRzID0gY29sbGVjdGlvbi5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJZiBpbiBhZ2dyZWdhdGlvbiBpdCBjb250YWlucyAnLicsIHdlIHJlcGxhY2UgaXQgd2l0aCBhIGN1c3RvbSBzdHJpbmcgJ19fXydcbiAgICAgICAgICogQW5kIHRoZW4gYWZ0ZXIgYWdncmVnYXRpb24gaXMgY29tcGxldGUgd2UgbmVlZCB0byBzbmFwLWl0IGJhY2sgdG8gaG93IGl0IHdhcy5cbiAgICAgICAgICovXG4gICAgICAgIGlmIChjb250YWluc0RvdHRlZEZpZWxkcykge1xuICAgICAgICAgICAgc25hcEJhY2tEb3R0ZWRGaWVsZHMoYWdncmVnYXRlUmVzdWx0cyk7XG4gICAgICAgIH1cblxuICAgICAgICBhc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMoXG4gICAgICAgICAgICBjaGlsZENvbGxlY3Rpb25Ob2RlLFxuICAgICAgICAgICAgYWdncmVnYXRlUmVzdWx0cyxcbiAgICAgICAgICAgIG1ldGFGaWx0ZXJzXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9iamVjdCwgZmllbGQsIG1ldGFGaWx0ZXJzVGVzdCkge1xuICAgIGlmIChvYmplY3RbZmllbGRdKSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkob2JqZWN0W2ZpZWxkXSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBvYmplY3RbZmllbGRdLmZpbHRlcihtZXRhRmlsdGVyc1Rlc3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIW1ldGFGaWx0ZXJzVGVzdChvYmplY3RbZmllbGRdKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7U0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlR9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYWdncmVnYXRpb25SZXN1bHQpIHtcbiAgICBhZ2dyZWdhdGlvblJlc3VsdC5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc3VsdC5kYXRhID0gcmVzdWx0LmRhdGEubWFwKGRvY3VtZW50ID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkb2N1bWVudCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRba2V5LnJlcGxhY2UobmV3IFJlZ0V4cChTQUZFX0RPVFRFRF9GSUVMRF9SRVBMQUNFTUVOVCwgJ2cnKSwgJy4nKV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRvY3VtZW50W2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiBkb3Qub2JqZWN0KGRvY3VtZW50KTtcbiAgICAgICAgfSlcbiAgICB9KVxufSIsImNvbnN0IHJlc3RyaWN0T3B0aW9ucyA9IFtcbiAgICAnZGlzYWJsZU9wbG9nJyxcbiAgICAncG9sbGluZ0ludGVydmFsTXMnLFxuICAgICdwb2xsaW5nVGhyb3R0bGVNcydcbl07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFwcGx5UHJvcHMobm9kZSkge1xuICAgIGxldCBmaWx0ZXJzID0gXy5leHRlbmQoe30sIG5vZGUucHJvcHMuJGZpbHRlcnMpO1xuICAgIGxldCBvcHRpb25zID0gXy5leHRlbmQoe30sIG5vZGUucHJvcHMuJG9wdGlvbnMpO1xuXG4gICAgb3B0aW9ucyA9IF8ub21pdChvcHRpb25zLCAuLi5yZXN0cmljdE9wdGlvbnMpO1xuICAgIG9wdGlvbnMuZmllbGRzID0gb3B0aW9ucy5maWVsZHMgfHwge307XG5cbiAgICBub2RlLmFwcGx5RmllbGRzKGZpbHRlcnMsIG9wdGlvbnMpO1xuICAgIFxuICAgIHJldHVybiB7ZmlsdGVycywgb3B0aW9uc307XG59XG4iLCJleHBvcnQgZGVmYXVsdCAobWV0aG9kLCBteVBhcmFtZXRlcnMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBNZXRlb3IuY2FsbChtZXRob2QsIG15UGFyYW1ldGVycywgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyLnJlYXNvbiB8fCAnU29tZXRoaW5nIHdlbnQgd3JvbmcuJyk7XG5cbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59OyIsImltcG9ydCBDb2xsZWN0aW9uTm9kZSBmcm9tICcuLi9ub2Rlcy9jb2xsZWN0aW9uTm9kZS5qcyc7XG5pbXBvcnQgRmllbGROb2RlIGZyb20gJy4uL25vZGVzL2ZpZWxkTm9kZS5qcyc7XG5pbXBvcnQgUmVkdWNlck5vZGUgZnJvbSAnLi4vbm9kZXMvcmVkdWNlck5vZGUuanMnO1xuaW1wb3J0IGRvdGl6ZSBmcm9tICcuL2RvdGl6ZS5qcyc7XG5pbXBvcnQgY3JlYXRlUmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMvbGliL2NyZWF0ZVJlZHVjZXJzJztcblxuZXhwb3J0IGNvbnN0IHNwZWNpYWxGaWVsZHMgPSBbXG4gICAgJyRmaWx0ZXJzJyxcbiAgICAnJG9wdGlvbnMnLFxuICAgICckcG9zdEZpbHRlcnMnLFxuICAgICckcG9zdE9wdGlvbnMnLFxuICAgICckcG9zdEZpbHRlcidcbl07XG5cbi8qKlxuICogQ3JlYXRlcyBub2RlIG9iamVjdHMgZnJvbSB0aGUgYm9keS4gVGhlIHJvb3QgaXMgYWx3YXlzIGEgY29sbGVjdGlvbiBub2RlLlxuICpcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb2Rlcyhyb290KSB7XG4gICAgLy8gdGhpcyBpcyBhIGZpeCBmb3IgcGhhbnRvbWpzIHRlc3RzIChkb24ndCByZWFsbHkgdW5kZXJzdGFuZCBpdC4pXG4gICAgaWYgKCFfLmlzT2JqZWN0KHJvb3QuYm9keSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF8uZWFjaChyb290LmJvZHksIChib2R5LCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBpdCdzIGEgcHJvcFxuICAgICAgICBpZiAoXy5jb250YWlucyhzcGVjaWFsRmllbGRzLCBmaWVsZE5hbWUpKSB7XG4gICAgICAgICAgICByb290LmFkZFByb3AoZmllbGROYW1lLCBib2R5KTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd29ya2Fyb3VuZCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9jdWx0LW9mLWNvZGVycy9ncmFwaGVyL2lzc3Vlcy8xMzRcbiAgICAgICAgLy8gVE9ETzogZmluZCBhbm90aGVyIHdheSB0byBkbyB0aGlzXG4gICAgICAgIGlmIChyb290LmNvbGxlY3Rpb24uZGVmYXVsdCkge1xuICAgICAgICAgIHJvb3QuY29sbGVjdGlvbiA9IHJvb3QuY29sbGVjdGlvbi5kZWZhdWx0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tpbmcgaWYgaXQgaXMgYSBsaW5rLlxuICAgICAgICBsZXQgbGlua2VyID0gcm9vdC5jb2xsZWN0aW9uLmdldExpbmtlcihmaWVsZE5hbWUpO1xuXG4gICAgICAgIGlmIChsaW5rZXIpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGl0IGlzIGEgY2FjaGVkIGxpbmtcbiAgICAgICAgICAgIC8vIGlmIHllcywgdGhlbiB3ZSBuZWVkIHRvIGV4cGxpY2l0bHkgZGVmaW5lIHRoaXMgYXQgY29sbGVjdGlvbiBsZXZlbFxuICAgICAgICAgICAgLy8gc28gd2hlbiB3ZSB0cmFuc2Zvcm0gdGhlIGRhdGEgZm9yIGRlbGl2ZXJ5LCB3ZSBtb3ZlIGl0IHRvIHRoZSBsaW5rIG5hbWVcbiAgICAgICAgICAgIGlmIChsaW5rZXIuaXNEZW5vcm1hbGl6ZWQoKSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTdWJCb2R5RGVub3JtYWxpemVkKGJvZHkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhbmRsZURlbm9ybWFsaXplZChyb290LCBsaW5rZXIsIGJvZHksIGZpZWxkTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzdWJyb290ID0gbmV3IENvbGxlY3Rpb25Ob2RlKGxpbmtlci5nZXRMaW5rZWRDb2xsZWN0aW9uKCksIGJvZHksIGZpZWxkTmFtZSk7XG4gICAgICAgICAgICAvLyBtdXN0IGJlIGJlZm9yZSBhZGRpbmcgbGlua2VyIGJlY2F1c2UgX3Nob3VsZENsZWFuU3RvcmFnZSBtZXRob2RcbiAgICAgICAgICAgIGNyZWF0ZU5vZGVzKHN1YnJvb3QpO1xuICAgICAgICAgICAgcm9vdC5hZGQoc3Vicm9vdCwgbGlua2VyKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tpbmcgaWYgaXQncyBhIHJlZHVjZXJcbiAgICAgICAgY29uc3QgcmVkdWNlciA9IHJvb3QuY29sbGVjdGlvbi5nZXRSZWR1Y2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKHJlZHVjZXIpIHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHJlZHVjZXIpO1xuICAgICAgICAgICAgcm9vdC5hZGQocmVkdWNlck5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQncyBtb3N0IGxpa2VseSBhIGZpZWxkIHRoZW5cbiAgICAgICAgYWRkRmllbGROb2RlKGJvZHksIGZpZWxkTmFtZSwgcm9vdCk7XG4gICAgfSk7XG5cbiAgICBjcmVhdGVSZWR1Y2Vycyhyb290KTtcblxuICAgIGlmIChyb290LmZpZWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJvb3QuYWRkKG5ldyBGaWVsZE5vZGUoJ19pZCcsIDEpKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGlzUHJvamVjdGlvbk9wZXJhdG9yRXhwcmVzc2lvbihib2R5KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IF8ua2V5cyhib2R5KTtcbiAgICAgICAgcmV0dXJuIGtleXMubGVuZ3RoID09PSAxICYmIF8uY29udGFpbnMoWyckZWxlbU1hdGNoJywgJyRtZXRhJywgJyRzbGljZSddLCBrZXlzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gZmllbGROYW1lXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRmllbGROb2RlKGJvZHksIGZpZWxkTmFtZSwgcm9vdCkge1xuICAgIC8vIGl0J3Mgbm90IGEgbGluayBhbmQgbm90IGEgc3BlY2lhbCB2YXJpYWJsZSA9PiB3ZSBhc3N1bWUgaXQncyBhIGZpZWxkXG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgaWYgKCFpc1Byb2plY3Rpb25PcGVyYXRvckV4cHJlc3Npb24oYm9keSkpIHtcbiAgICAgICAgICAgIGxldCBkb3R0ZWQgPSBkb3RpemUuY29udmVydCh7W2ZpZWxkTmFtZV06IGJvZHl9KTtcbiAgICAgICAgICAgIF8uZWFjaChkb3R0ZWQsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgcm9vdC5hZGQobmV3IEZpZWxkTm9kZShrZXksIHZhbHVlKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJvb3QuYWRkKG5ldyBGaWVsZE5vZGUoZmllbGROYW1lLCBib2R5LCB0cnVlKSk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgZmllbGROb2RlID0gbmV3IEZpZWxkTm9kZShmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICByb290LmFkZChmaWVsZE5vZGUpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBSZXR1cm5zIG5hbWVzcGFjZSBmb3Igbm9kZSB3aGVuIHVzaW5nIHF1ZXJ5IHBhdGggc2NvcGluZy5cbiAqXG4gKiBAcGFyYW0gbm9kZVxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVOYW1lc3BhY2Uobm9kZSkge1xuICAgIGNvbnN0IHBhcnRzID0gW107XG4gICAgbGV0IG4gPSBub2RlO1xuICAgIHdoaWxlIChuKSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBuLmxpbmtlciA/IG4ubGlua2VyLmxpbmtOYW1lIDogbi5jb2xsZWN0aW9uLl9uYW1lO1xuICAgICAgICBwYXJ0cy5wdXNoKG5hbWUpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbGlua2VyJywgbm9kZS5saW5rZXIgPyBub2RlLmxpbmtlci5saW5rTmFtZSA6IG5vZGUuY29sbGVjdGlvbi5fbmFtZSk7XG4gICAgICAgIG4gPSBuLnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnRzLnJldmVyc2UoKS5qb2luKCdfJyk7XG59XG5cbi8qKlxuICogQHBhcmFtIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSBib2R5XG4gKiBAcmV0dXJucyB7Q29sbGVjdGlvbk5vZGV9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBib2R5KSB7XG4gICAgbGV0IHJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUoY29sbGVjdGlvbiwgYm9keSk7XG4gICAgY3JlYXRlTm9kZXMocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbn07XG5cbi8qKlxuICogQWRzIGRlbm9ybWFsaXphdGlvbiBjb25maWcgcHJvcGVybHksIGluY2x1ZGluZyBfaWRcbiAqXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGxpbmtlclxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKSB7XG4gICAgT2JqZWN0LmFzc2lnbihib2R5LCB7X2lkOiAxfSk7XG5cbiAgICBjb25zdCBjYWNoZUZpZWxkID0gbGlua2VyLmxpbmtDb25maWcuZGVub3JtYWxpemUuZmllbGQ7XG4gICAgcm9vdC5zbmFwQ2FjaGUoY2FjaGVGaWVsZCwgZmllbGROYW1lKTtcblxuICAgIC8vIGlmIGl0J3Mgb25lIGFuZCBkaXJlY3QgYWxzbyBpbmNsdWRlIHRoZSBsaW5rIHN0b3JhZ2VcbiAgICBpZiAoIWxpbmtlci5pc01hbnkoKSAmJiAhbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgIGFkZEZpZWxkTm9kZSgxLCBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZCwgcm9vdCk7XG4gICAgfVxuXG4gICAgYWRkRmllbGROb2RlKGJvZHksIGNhY2hlRmllbGQsIHJvb3QpO1xufSIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS92YXJkYXJzL2RvdGl6ZVxuZXhwb3J0IGRlZmF1bHQgZG90aXplID0ge307XG5cbmRvdGl6ZS5jb252ZXJ0ID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcbiAgICBpZiAoKCFvYmogfHwgdHlwZW9mIG9iaiAhPSBcIm9iamVjdFwiKSAmJiAhQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcbiAgICAgICAgICAgIG5ld09ialtwcmVmaXhdID0gb2JqO1xuICAgICAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmV3T2JqID0ge307XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKG8sIHAsIGlzQXJyYXlJdGVtKSB7XG4gICAgICAgIGZvciAodmFyIGYgaW4gbykge1xuICAgICAgICAgICAgaWYgKG9bZl0gJiYgdHlwZW9mIG9bZl0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eUFycmF5KG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpXSA9IG9bZl07IC8vIGVtcHR5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSByZWN1cnNlKG9bZl0sIGdldEZpZWxkTmFtZShmLCBwLCBmYWxzZSwgdHJ1ZSksIHRydWUpOyAvLyBhcnJheVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eU9iaihvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHJlY3Vyc2Uob1tmXSwgZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpKTsgLy8gYXJyYXkgaXRlbSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5T2JqKG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2dldEZpZWxkTmFtZShmLCBwKV0gPSBvW2ZdOyAvLyBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gcmVjdXJzZShvW2ZdLCBnZXRGaWVsZE5hbWUoZiwgcCkpOyAvLyBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtIHx8IGlzTnVtYmVyKGYpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gYXJyYXkgaXRlbSBwcmltaXRpdmVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHApXSA9IG9bZl07IC8vIHByaW1pdGl2ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0VtcHR5T2JqKG5ld09iaikpXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoZikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGYpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbXB0eUFycmF5KG8pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobykgJiYgby5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RmllbGROYW1lKGZpZWxkLCBwcmVmaXgsIGlzQXJyYXlJdGVtLCBpc0FycmF5KSB7XG4gICAgICAgIGlmIChpc0FycmF5KVxuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiBcIlwiKSArIChpc051bWJlcihmaWVsZCkgPyBcIltcIiArIGZpZWxkICsgXCJdXCIgOiBcIi5cIiArIGZpZWxkKTtcbiAgICAgICAgZWxzZSBpZiAoaXNBcnJheUl0ZW0pXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6IFwiXCIpICsgXCJbXCIgKyBmaWVsZCArIFwiXVwiO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCArIFwiLlwiIDogXCJcIikgKyBmaWVsZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjdXJzZShvYmosIHByZWZpeCwgQXJyYXkuaXNBcnJheShvYmopKTtcbn07IiwiLyoqXG4gKiBIZWxwZXIgbWV0aG9kIHdoaWNoIGV4cGFuZHMgcHJvZmlsZS5waG9uZS52ZXJpZmllZCBpbnRvXG4gKiBbJ3Byb2ZpbGUnLCAncHJvZmlsZS5waG9uZScsICdwcm9maWxlLnBob25lLnZlcmlmaWVkJ11cbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZEZpZWxkKGZpZWxkTmFtZSkge1xuICAgIHJldHVybiBmaWVsZE5hbWUuc3BsaXQoJy4nKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgIGlmIChhY2MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgW2xhc3RdID0gYWNjO1xuICAgICAgICByZXR1cm4gWy4uLmFjYywgYCR7bGFzdH0uJHtrZXl9YF07XG4gICAgfSwgW10pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZpZWxkSW5Qcm9qZWN0aW9uKHByb2plY3Rpb24sIGZpZWxkTmFtZSwgY2hlY2tOZXN0ZWQpIHtcbiAgICAvLyBmb3IgY2hlY2tOZXN0ZWQgZmxhZyBleHBhbmQgdGhlIGZpZWxkXG4gICAgY29uc3QgZmllbGRzID0gY2hlY2tOZXN0ZWQgPyBleHBhbmRGaWVsZChmaWVsZE5hbWUpIDogW2ZpZWxkTmFtZV07XG4gICAgcmV0dXJuIGZpZWxkcy5zb21lKGZpZWxkID0+IHByb2plY3Rpb25bZmllbGRdKTtcbn1cbiIsImltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHtzcGVjaWFsRmllbGRzfSBmcm9tICcuL2NyZWF0ZUdyYXBoJztcblxuY29uc3QgRVhURU5ERURfU1BFQ0lBTF9GSUVMRFMgPSBbLi4uc3BlY2lhbEZpZWxkcywgJyRmaWx0ZXInLCAnJHBhZ2luYXRlJ107XG5cbmZ1bmN0aW9uIGlzQ2xpZW50VmFsdWVWYWxpZCh2YWx1ZSkge1xuICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSAmJiAhXy5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gXy52YWx1ZXModmFsdWUpLmV2ZXJ5KG5lc3RlZFZhbHVlID0+IGlzQ2xpZW50VmFsdWVWYWxpZChuZXN0ZWRWYWx1ZSkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFxuICogUmVjdXJzaXZlIGZ1bmN0aW9uIHdoaWNoIGludGVyc2VjdHMgdGhlIGZpZWxkcyBvZiB0aGUgYm9keSBvYmplY3RzLlxuICogXG4gKiBAcGFyYW0ge29iamVjdH0gYWxsb3dlZCBhbGxvd2VkIGJvZHkgb2JqZWN0IC0gaW50ZXJzZWN0aW9uIGNhbiBvbmx5IGJlIGEgc3Vic2V0IG9mIGl0XG4gKiBAcGFyYW0ge29iamVjdH0gY2xpZW50IGNsaWVudCBib2R5IC0gY2FuIHNocmluayBtYWluIGJvZHksIGJ1dCBub3QgZXhwYW5kXG4gKi9cbmZ1bmN0aW9uIGludGVyc2VjdEZpZWxkcyhhbGxvd2VkLCBjbGllbnQpIHtcbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSB7fTtcbiAgICBfLnBhaXJzKGNsaWVudCkuZm9yRWFjaCgoW2ZpZWxkLCBjbGllbnRWYWx1ZV0pID0+IHtcbiAgICAgICAgaWYgKF8uY29udGFpbnMoRVhURU5ERURfU1BFQ0lBTF9GSUVMRFMsIGZpZWxkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VydmVyVmFsdWUgPSBhbGxvd2VkW2ZpZWxkXTtcbiAgICAgICAgaWYgKHNlcnZlclZhbHVlID09PSAxKSB7IC8vIHNlcnZlciBhbGxvd3MgZXZlcnl0aGluZ1xuICAgICAgICAgICAgaWYgKGlzQ2xpZW50VmFsdWVWYWxpZChjbGllbnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25bZmllbGRdID0gY2xpZW50VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoXy5pc09iamVjdChzZXJ2ZXJWYWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KGNsaWVudFZhbHVlKSAmJiAhXy5pc0FycmF5KGNsaWVudFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbltmaWVsZF0gPSBpbnRlcnNlY3RGaWVsZHMoc2VydmVyVmFsdWUsIGNsaWVudFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNsaWVudFZhbHVlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgY2xpZW50IHdhbnRzIGV2ZXJ5dGhpbmcsIHNlcnZlclZhbHVlIGlzIG1vcmUgcmVzdHJpY3RpdmUgaGVyZVxuICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbltmaWVsZF0gPSBzZXJ2ZXJWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbnRlcnNlY3Rpb247XG59XG5cbi8qKlxuICogR2l2ZW4gYSBuYW1lZCBxdWVyeSB0aGF0IGhhcyBhIHNwZWNpZmljIGJvZHksIHlvdSBjYW4gcXVlcnkgaXRzIHN1YmJvZHlcbiAqIFRoaXMgcGVyZm9ybXMgYW4gaW50ZXJzZWN0aW9uIG9mIHRoZSBib2RpZXMgYWxsb3dlZCBpbiBlYWNoXG4gKlxuICogQHBhcmFtIGFsbG93ZWRCb2R5XG4gKiBAcGFyYW0gY2xpZW50Qm9keVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYWxsb3dlZEJvZHksIGNsaWVudEJvZHkpIHtcbiAgICBjb25zdCBidWlsZCA9IGludGVyc2VjdEZpZWxkcyhhbGxvd2VkQm9keSwgY2xpZW50Qm9keSk7XG4gICAgLy8gQWRkIGJhY2sgc3BlY2lhbCBmaWVsZHMgdG8gdGhlIG5ldyBib2R5XG4gICAgT2JqZWN0LmFzc2lnbihidWlsZCwgXy5waWNrKGFsbG93ZWRCb2R5LCAuLi5FWFRFTkRFRF9TUEVDSUFMX0ZJRUxEUykpO1xuICAgIHJldHVybiBidWlsZDtcbn1cbiIsIi8vIDEuIENsb25lIGNoaWxkcmVuIHdpdGggbWV0YSByZWxhdGlvbnNoaXBzXG4vLyAyLiBBcHBseSAkbWV0YWRhdGEgdG8gY2hpbGRyZW5cbi8vIDMuIFJlbW92ZXMgbGluayBzdG9yYWdlIChpZiBub3Qgc3BlY2lmaWVkKVxuLy8gNC4gU3RvcmVzIG9uZVJlc3VsdCBsaW5rcyBhcyBhIHNpbmdsZSBvYmplY3QgaW5zdGVhZCBvZiBhcnJheVxuaW1wb3J0IGFwcGx5UmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMvbGliL2FwcGx5UmVkdWNlcnMnO1xuaW1wb3J0IGNsZWFuUmVkdWNlckxlZnRvdmVycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvY2xlYW5SZWR1Y2VyTGVmdG92ZXJzJztcbmltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcbmltcG9ydCB7TWluaW1vbmdvfSBmcm9tICdtZXRlb3IvbWluaW1vbmdvJztcblxuZXhwb3J0IGRlZmF1bHQgKG5vZGUsIHBhcmFtcykgPT4ge1xuICAgIHNuYXBCYWNrQ2FjaGVzKG5vZGUpO1xuICAgIHN0b3JlT25lUmVzdWx0cyhub2RlLCBub2RlLnJlc3VsdHMpO1xuXG4gICAgYXBwbHlSZWR1Y2Vycyhub2RlLCBwYXJhbXMpO1xuXG4gICAgXy5lYWNoKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGNsb25lTWV0YUNoaWxkcmVuKGNvbGxlY3Rpb25Ob2RlLCBub2RlLnJlc3VsdHMpXG4gICAgfSk7XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgYXNzZW1ibGVNZXRhZGF0YShjb2xsZWN0aW9uTm9kZSwgbm9kZS5yZXN1bHRzKVxuICAgIH0pO1xuXG4gICAgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzKG5vZGUsIG5vZGUucmVzdWx0cyk7XG5cbiAgICByZW1vdmVMaW5rU3RvcmFnZXMobm9kZSwgbm9kZS5yZXN1bHRzKTtcblxuICAgIGFwcGx5UG9zdEZpbHRlcnMobm9kZSk7XG4gICAgYXBwbHlQb3N0T3B0aW9ucyhub2RlKTtcbiAgICBhcHBseVBvc3RGaWx0ZXIobm9kZSwgcGFyYW1zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UG9zdEZpbHRlcnMobm9kZSkge1xuICAgIGNvbnN0IHBvc3RGaWx0ZXJzID0gbm9kZS5wcm9wcy4kcG9zdEZpbHRlcnM7XG4gICAgaWYgKHBvc3RGaWx0ZXJzKSB7XG4gICAgICAgIG5vZGUucmVzdWx0cyA9IHNpZnQocG9zdEZpbHRlcnMsIG5vZGUucmVzdWx0cyk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQb3N0T3B0aW9ucyhub2RlKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IG5vZGUucHJvcHMuJHBvc3RPcHRpb25zO1xuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnNvcnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvcnRlciA9IG5ldyBNaW5pbW9uZ28uU29ydGVyKG9wdGlvbnMuc29ydCk7XG4gICAgICAgICAgICBub2RlLnJlc3VsdHMuc29ydChzb3J0ZXIuZ2V0Q29tcGFyYXRvcigpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5saW1pdCB8fCBvcHRpb25zLnNraXApIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gb3B0aW9ucy5za2lwIHx8IDA7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBvcHRpb25zLmxpbWl0ID8gb3B0aW9ucy5saW1pdCArIHN0YXJ0IDogbm9kZS5yZXN1bHRzLmxlbmd0aDtcbiAgICAgICAgICAgIG5vZGUucmVzdWx0cyA9IG5vZGUucmVzdWx0cy5zbGljZShzdGFydCwgZW5kKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG4vKipcbiAqIE9wdGlvbmFsbHkgYXBwbGllcyBhIHBvc3QgZmlsdGVyaW5nIG9wdGlvblxuICovXG5mdW5jdGlvbiBhcHBseVBvc3RGaWx0ZXIobm9kZSwgcGFyYW1zKSB7XG4gICAgaWYgKG5vZGUucHJvcHMuJHBvc3RGaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgZmlsdGVyID0gbm9kZS5wcm9wcy4kcG9zdEZpbHRlcjtcblxuICAgICAgICBpZiAoXy5pc0FycmF5KGZpbHRlcikpIHtcbiAgICAgICAgICAgIGZpbHRlci5mb3JFYWNoKGYgPT4ge1xuICAgICAgICAgICAgICAgIG5vZGUucmVzdWx0cyA9IGYobm9kZS5yZXN1bHRzLCBwYXJhbXMpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGUucmVzdWx0cyA9IGZpbHRlcihub2RlLnJlc3VsdHMsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICpcbiAqIEhlbHBlciBmdW5jdGlvbiB3aGljaCB0cmFuc2Zvcm1zIHJlc3VsdHMgaW50byB0aGUgYXJyYXkuXG4gKiBSZXN1bHRzIGFyZSBhbiBvYmplY3QgZm9yICdvbmUnIGxpbmtzLlxuICpcbiAqIEBwYXJhbSByZXN1bHRzXG4gKiBAcmV0dXJuIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXN1bHRzQXJyYXkocmVzdWx0cykge1xuICAgIGlmIChfLmlzQXJyYXkocmVzdWx0cykpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfVxuICAgIGVsc2UgaWYgKF8uaXNVbmRlZmluZWQocmVzdWx0cykpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gW3Jlc3VsdHNdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTGlua1N0b3JhZ2VzKG5vZGUsIHNhbWVMZXZlbFJlc3VsdHMpIHtcbiAgICBpZiAoIXNhbWVMZXZlbFJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHNhbWVMZXZlbFJlc3VsdHMgPSBnZXRSZXN1bHRzQXJyYXkoc2FtZUxldmVsUmVzdWx0cyk7XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3ZlU3RvcmFnZUZpZWxkID0gY29sbGVjdGlvbk5vZGUuc2hvdWxkQ2xlYW5TdG9yYWdlO1xuICAgICAgICBfLmVhY2goc2FtZUxldmVsUmVzdWx0cywgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmIChyZW1vdmVTdG9yYWdlRmllbGQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1NpbmdsZSA9IGNvbGxlY3Rpb25Ob2RlLmxpbmtlci5pc1NpbmdsZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtyb290LCAuLi5uZXN0ZWRdID0gY29sbGVjdGlvbk5vZGUubGlua1N0b3JhZ2VGaWVsZC5zcGxpdCgnLicpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlRnJvbVJlc3VsdCA9IChyZXN1bHQsIHJlbW92ZUVtcHR5Um9vdCA9IGZhbHNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1NpbmdsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG90LnBpY2soY29sbGVjdGlvbk5vZGUubGlua1N0b3JhZ2VGaWVsZCwgcmVzdWx0LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1vdmVFbXB0eVJvb3QgJiYgbmVzdGVkLmxlbmd0aCA+IDAgJiYgXy5pc0VtcHR5KHJlc3VsdFtyb290XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W3Jvb3RdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5lc3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJyID0gcmVzdWx0W3Jvb3RdIHx8IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfLmlzQXJyYXkoYXJyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcnIuZm9yRWFjaChvYmogPT4gZG90LnBpY2sobmVzdGVkLmpvaW4oJy4nKSwgb2JqLCB0cnVlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZW1vdmVFbXB0eVJvb3QgJiYgbmVzdGVkLmxlbmd0aCA+IDAgJiYgYXJyLmV2ZXJ5KG9iaiA9PiBfLmlzRW1wdHkob2JqKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbcm9vdF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uTm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHRzID0gZ2V0UmVzdWx0c0FycmF5KHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goY2hpbGRSZXN1bHRzLCBjaGlsZFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVGcm9tUmVzdWx0KGNoaWxkUmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlRnJvbVJlc3VsdChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVtb3ZlTGlua1N0b3JhZ2VzKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKTtcbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcmVPbmVSZXN1bHRzKG5vZGUsIHNhbWVMZXZlbFJlc3VsdHMpIHtcbiAgICBpZiAoIXNhbWVMZXZlbFJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG5vZGUuY29sbGVjdGlvbk5vZGVzLmZvckVhY2goY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBfLmVhY2goc2FtZUxldmVsUmVzdWx0cywgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIC8vIFRoZSByZWFzb24gd2UgYXJlIGRvaW5nIHRoaXMgaXMgdGhhdCBpZiB0aGUgcmVxdWVzdGVkIGxpbmsgZG9lcyBub3QgZXhpc3RcbiAgICAgICAgICAgIC8vIEl0IHdpbGwgZmFpbCB3aGVuIHdlIHRyeSB0byBnZXQgdW5kZWZpbmVkW3NvbWV0aGluZ10gYmVsb3dcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3RvcmVPbmVSZXN1bHRzKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNvbGxlY3Rpb25Ob2RlLmlzT25lUmVzdWx0KSB7XG4gICAgICAgICAgICBfLmVhY2goc2FtZUxldmVsUmVzdWx0cywgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSAmJiBfLmlzQXJyYXkocmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV1cbiAgICAgICAgICAgICAgICAgICAgICAgID8gXy5maXJzdChyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsb25lTWV0YUNoaWxkcmVuKG5vZGUsIHBhcmVudFJlc3VsdHMpIHtcbiAgICBpZiAoIXBhcmVudFJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmtOYW1lID0gbm9kZS5saW5rTmFtZTtcbiAgICBjb25zdCBpc01ldGEgPSBub2RlLmlzTWV0YTtcblxuICAgIC8vIHBhcmVudFJlc3VsdHMgbWlnaHQgYmUgYW4gb2JqZWN0IChmb3IgdHlwZT09b25lIGxpbmtzKVxuICAgIHBhcmVudFJlc3VsdHMgPSBnZXRSZXN1bHRzQXJyYXkocGFyZW50UmVzdWx0cyk7XG5cbiAgICBwYXJlbnRSZXN1bHRzLmZvckVhY2gocGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKGlzTWV0YSAmJiBwYXJlbnRSZXN1bHRbbGlua05hbWVdKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5pc09uZVJlc3VsdCkge1xuICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gPSBPYmplY3QuYXNzaWduKHt9LCBwYXJlbnRSZXN1bHRbbGlua05hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gPSBwYXJlbnRSZXN1bHRbbGlua05hbWVdLm1hcChvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuY29sbGVjdGlvbk5vZGVzLmZvckVhY2goY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICAgICAgY2xvbmVNZXRhQ2hpbGRyZW4oY29sbGVjdGlvbk5vZGUsIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlTWV0YWRhdGEobm9kZSwgcGFyZW50UmVzdWx0cykge1xuICAgIHBhcmVudFJlc3VsdHMgPSBnZXRSZXN1bHRzQXJyYXkocGFyZW50UmVzdWx0cyk7XG5cbiAgICAvLyBhc3NlbWJsaW5nIG1ldGFkYXRhIGlzIGRlcHRoIGZpcnN0XG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChwYXJlbnRSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgYXNzZW1ibGVNZXRhZGF0YShjb2xsZWN0aW9uTm9kZSwgcmVzdWx0W25vZGUubGlua05hbWVdKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmIChub2RlLmlzTWV0YSkge1xuICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIF8uZWFjaChwYXJlbnRSZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUmVzdWx0ID0gcGFyZW50UmVzdWx0W25vZGUubGlua05hbWVdO1xuXG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF8uaXNPYmplY3QoY2hpbGRSZXN1bHQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gY2hpbGRSZXN1bHRbbm9kZS5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlTWV0YWRhdGEoY2hpbGRSZXN1bHQsIHBhcmVudFJlc3VsdCwgc3RvcmFnZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goY2hpbGRSZXN1bHQsIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gb2JqZWN0W25vZGUubGlua1N0b3JhZ2VGaWVsZF07XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZU1ldGFkYXRhKG9iamVjdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZWFjaChwYXJlbnRSZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUmVzdWx0ID0gcGFyZW50UmVzdWx0W25vZGUubGlua05hbWVdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2UgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rU3RvcmFnZUZpZWxkXTtcblxuICAgICAgICAgICAgICAgIGlmIChub2RlLmlzT25lUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmVNZXRhZGF0YShjaGlsZFJlc3VsdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfLmVhY2goY2hpbGRSZXN1bHQsIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZU1ldGFkYXRhKG9iamVjdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlTWV0YWRhdGEoZWxlbWVudCwgcGFyZW50RWxlbWVudCwgc3RvcmFnZSwgaXNWaXJ0dWFsKSB7XG4gICAgaWYgKGlzVmlydHVhbCkge1xuICAgICAgICBsZXQgJG1ldGFkYXRhO1xuICAgICAgICBpZiAoXy5pc0FycmF5KHN0b3JhZ2UpKSB7XG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBfLmZpbmQoc3RvcmFnZSwgc3RvcmFnZUl0ZW0gPT4gc3RvcmFnZUl0ZW0uX2lkID09IHBhcmVudEVsZW1lbnQuX2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IHN0b3JhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LiRtZXRhZGF0YSA9IF8ub21pdCgkbWV0YWRhdGEsICdfaWQnKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCAkbWV0YWRhdGE7XG4gICAgICAgIGlmIChfLmlzQXJyYXkoc3RvcmFnZSkpIHtcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IF8uZmluZChzdG9yYWdlLCBzdG9yYWdlSXRlbSA9PiBzdG9yYWdlSXRlbS5faWQgPT0gZWxlbWVudC5faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gc3RvcmFnZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsZW1lbnQuJG1ldGFkYXRhID0gXy5vbWl0KCRtZXRhZGF0YSwgJ19pZCcpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc25hcEJhY2tDYWNoZXMobm9kZSkge1xuICAgIG5vZGUuY29sbGVjdGlvbk5vZGVzLmZvckVhY2goY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBzbmFwQmFja0NhY2hlcyhjb2xsZWN0aW9uTm9kZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoIV8uaXNFbXB0eShub2RlLnNuYXBDYWNoZXMpKSB7XG4gICAgICAgIC8vIHByb2Nlc3Mgc3R1ZmZcbiAgICAgICAgXy5lYWNoKG5vZGUuc25hcENhY2hlcywgKGxpbmtOYW1lLCBjYWNoZUZpZWxkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpc1NpbmdsZSA9IF8uY29udGFpbnMobm9kZS5zbmFwQ2FjaGVzU2luZ2xlcywgY2FjaGVGaWVsZCk7XG4gICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBub2RlLmNvbGxlY3Rpb24uZ2V0TGlua2VyKGxpbmtOYW1lKTtcbiAgICAgICAgICAgIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSBmb3Igb25lIGRpcmVjdCBhbmQgb25lIG1ldGEgZGlyZWN0LCBpZCBpcyBub3Qgc3RvcmVkXG4gICAgICAgICAgICBjb25zdCBzaG91ZFN0b3JlTGlua1N0b3JhZ2UgPSAhbGlua2VyLmlzTWFueSgpICYmICFsaW5rZXIuaXNWaXJ0dWFsKCk7XG5cbiAgICAgICAgICAgIG5vZGUucmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdFtjYWNoZUZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2hvdWRTdG9yZUxpbmtTdG9yYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKHJlc3VsdFtjYWNoZUZpZWxkXSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9pZDogbGlua2VyLmlzTWV0YSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzdWx0W2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXS5faWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiByZXN1bHRbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1NpbmdsZSAmJiBfLmlzQXJyYXkocmVzdWx0W2NhY2hlRmllbGRdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2xpbmtOYW1lXSA9IF8uZmlyc3QocmVzdWx0W2NhY2hlRmllbGRdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtsaW5rTmFtZV0gPSByZXN1bHRbY2FjaGVGaWVsZF07XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2NhY2hlRmllbGRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiaW1wb3J0IHtjaGVjaywgTWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyRnVuY3Rpb24oe1xuICAgIGZpbHRlcnMsXG4gICAgb3B0aW9ucyxcbiAgICBwYXJhbXNcbn0pIHtcbiAgICBpZiAocGFyYW1zLmZpbHRlcnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihmaWx0ZXJzLCBwYXJhbXMuZmlsdGVycyk7XG4gICAgfVxuICAgIGlmIChwYXJhbXMub3B0aW9ucykge1xuICAgICAgICBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHBhcmFtcy5vcHRpb25zKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5RmlsdGVyUmVjdXJzaXZlKGRhdGEsIHBhcmFtcyA9IHt9LCBpc1Jvb3QgPSBmYWxzZSkge1xuICAgIGlmIChpc1Jvb3QgJiYgIV8uaXNGdW5jdGlvbihkYXRhLiRmaWx0ZXIpKSB7XG4gICAgICAgIGRhdGEuJGZpbHRlciA9IGRlZmF1bHRGaWx0ZXJGdW5jdGlvbjtcbiAgICB9XG5cbiAgICBpZiAoZGF0YS4kZmlsdGVyKSB7XG4gICAgICAgIGNoZWNrKGRhdGEuJGZpbHRlciwgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pKTtcblxuICAgICAgICBkYXRhLiRmaWx0ZXJzID0gZGF0YS4kZmlsdGVycyB8fCB7fTtcbiAgICAgICAgZGF0YS4kb3B0aW9ucyA9IGRhdGEuJG9wdGlvbnMgfHwge307XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShkYXRhLiRmaWx0ZXIpKSB7XG4gICAgICAgICAgICBkYXRhLiRmaWx0ZXIuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgICAgICAgICAgIGZpbHRlci5jYWxsKG51bGwsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyczogZGF0YS4kZmlsdGVycyxcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uczogZGF0YS4kb3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXRhLiRmaWx0ZXIoe1xuICAgICAgICAgICAgICAgIGZpbHRlcnM6IGRhdGEuJGZpbHRlcnMsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogZGF0YS4kb3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHBhcmFtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLiRmaWx0ZXIgPSBudWxsO1xuICAgICAgICBkZWxldGUoZGF0YS4kZmlsdGVyKTtcbiAgICB9XG5cbiAgICBfLmVhY2goZGF0YSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gYXBwbHlGaWx0ZXJSZWN1cnNpdmUodmFsdWUsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBhcHBseVBhZ2luYXRpb24oYm9keSwgX3BhcmFtcykge1xuICAgIGlmIChib2R5WyckcGFnaW5hdGUnXSAmJiBfcGFyYW1zKSB7XG4gICAgICAgIGlmICghYm9keS4kb3B0aW9ucykge1xuICAgICAgICAgICAgYm9keS4kb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF9wYXJhbXMubGltaXQpIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGJvZHkuJG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBsaW1pdDogX3BhcmFtcy5saW1pdFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfcGFyYW1zLnNraXApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGJvZHkuJG9wdGlvbnMsIHtcbiAgICAgICAgICAgICAgICBza2lwOiBfcGFyYW1zLnNraXBcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgYm9keVsnJHBhZ2luYXRlJ107XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCAoX2JvZHksIF9wYXJhbXMgPSB7fSkgPT4ge1xuICAgIGxldCBib2R5ID0gZGVlcENsb25lKF9ib2R5KTtcbiAgICBsZXQgcGFyYW1zID0gZGVlcENsb25lKF9wYXJhbXMpO1xuXG4gICAgYXBwbHlQYWdpbmF0aW9uKGJvZHksIHBhcmFtcyk7XG4gICAgYXBwbHlGaWx0ZXJSZWN1cnNpdmUoYm9keSwgcGFyYW1zLCB0cnVlKTtcblxuICAgIHJldHVybiBib2R5O1xufVxuIiwiaW1wb3J0IGFwcGx5UHJvcHMgZnJvbSAnLi9hcHBseVByb3BzLmpzJztcbmltcG9ydCB7Z2V0Tm9kZU5hbWVzcGFjZX0gZnJvbSAnLi9jcmVhdGVHcmFwaCc7XG5pbXBvcnQge2lzRmllbGRJblByb2plY3Rpb259IGZyb20gJy4vZmllbGRJblByb2plY3Rpb24nO1xuXG4vKipcbiAqIEFkZHMgX3F1ZXJ5X3BhdGggZmllbGRzIHRvIHRoZSBjdXJzb3IgZG9jcyB3aGljaCBhcmUgdXNlZCBmb3Igc2NvcGVkIHF1ZXJ5IGZpbHRlcmluZyBvbiB0aGUgY2xpZW50LlxuICogXG4gKiBAcGFyYW0gY3Vyc29yIFxuICogQHBhcmFtIG5zIFxuICovXG5mdW5jdGlvbiBwYXRjaEN1cnNvcihjdXJzb3IsIG5zKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxPYnNlcnZlID0gY3Vyc29yLm9ic2VydmU7XG4gICAgY3Vyc29yLm9ic2VydmUgPSBmdW5jdGlvbiAoY2FsbGJhY2tzKSB7XG4gICAgICAgIGNvbnN0IG5ld0NhbGxiYWNrcyA9IE9iamVjdC5hc3NpZ24oe30sIGNhbGxiYWNrcyk7XG4gICAgICAgIGlmIChjYWxsYmFja3MuYWRkZWQpIHtcbiAgICAgICAgICAgIG5ld0NhbGxiYWNrcy5hZGRlZCA9IGRvYyA9PiB7XG4gICAgICAgICAgICAgICAgZG9jID0gXy5jbG9uZShkb2MpO1xuICAgICAgICAgICAgICAgIGRvY1tgX3F1ZXJ5X3BhdGhfJHtuc31gXSA9IDE7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tzLmFkZGVkKGRvYyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE9ic2VydmUuY2FsbChjdXJzb3IsIG5ld0NhbGxiYWNrcyk7XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gY29tcG9zZShub2RlLCB1c2VySWQsIGNvbmZpZykge1xuICAgIHJldHVybiB7XG4gICAgICAgIGZpbmQocGFyZW50KSB7XG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgICAgICAgICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMobm9kZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBjb21wb3NpdGlvblxuICAgICAgICAgICAgICAgIGxldCBsaW5rZXIgPSBub2RlLmxpbmtlcjtcbiAgICAgICAgICAgICAgICBsZXQgYWNjZXNzb3IgPSBsaW5rZXIuY3JlYXRlTGluayhwYXJlbnQpO1xuXG4gICAgICAgICAgICAgICAgLy8gdGhlIHJ1bGUgaXMgdGhpcywgaWYgYSBjaGlsZCBJIHdhbnQgdG8gZmV0Y2ggaXMgdmlydHVhbCwgdGhlbiBJIHdhbnQgdG8gZmV0Y2ggdGhlIGxpbmsgc3RvcmFnZSBvZiB0aG9zZSBmaWVsZHNcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzID0gb3B0aW9ucy5maWVsZHMgfHwge307XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNGaWVsZEluUHJvamVjdGlvbihvcHRpb25zLmZpZWxkcywgbGlua2VyLmxpbmtTdG9yYWdlRmllbGQsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmZpZWxkcywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF06IDFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gYWNjZXNzb3IuZmluZChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuICAgICAgICAgICAgICAgIGlmIChjb25maWcuc2NvcGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhdGNoQ3Vyc29yKGN1cnNvciwgZ2V0Tm9kZU5hbWVzcGFjZShub2RlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJzb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgY2hpbGRyZW46IF8ubWFwKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBuID0+IGNvbXBvc2UobiwgdXNlcklkLCBjb25maWcpKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKG5vZGUsIHVzZXJJZCwgY29uZmlnID0ge2J5cGFzc0ZpcmV3YWxsczogZmFsc2UsIHNjb3BlZDogZmFsc2V9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZCgpIHtcbiAgICAgICAgICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKG5vZGUpO1xuXG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBub2RlLmNvbGxlY3Rpb24uZmluZChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuICAgICAgICAgICAgaWYgKGNvbmZpZy5zY29wZWQpIHtcbiAgICAgICAgICAgICAgICBwYXRjaEN1cnNvcihjdXJzb3IsIGdldE5vZGVOYW1lc3BhY2Uobm9kZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN1cnNvcjtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGlsZHJlbjogXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIG4gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXNlcklkVG9QYXNzID0gKGNvbmZpZy5ieXBhc3NGaXJld2FsbHMpID8gdW5kZWZpbmVkIDogdXNlcklkO1xuXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZShuLCB1c2VySWRUb1Bhc3MsIGNvbmZpZyk7XG4gICAgICAgIH0pXG4gICAgfVxufVxuIiwiaW1wb3J0IGFwcGx5UHJvcHMgZnJvbSAnLi9hcHBseVByb3BzLmpzJztcbmltcG9ydCB7IGFzc2VtYmxlTWV0YWRhdGEsIHJlbW92ZUxpbmtTdG9yYWdlcywgc3RvcmVPbmVSZXN1bHRzIH0gZnJvbSAnLi9wcmVwYXJlRm9yRGVsaXZlcnknO1xuaW1wb3J0IHByZXBhcmVGb3JEZWxpdmVyeSBmcm9tICcuL3ByZXBhcmVGb3JEZWxpdmVyeSc7XG5pbXBvcnQge2dldE5vZGVOYW1lc3BhY2V9IGZyb20gJy4vY3JlYXRlR3JhcGgnO1xuaW1wb3J0IHtpc0ZpZWxkSW5Qcm9qZWN0aW9ufSBmcm9tICcuLi9saWIvZmllbGRJblByb2plY3Rpb24nO1xuXG4vKipcbiAqIFRoaXMgaXMgYWx3YXlzIHJ1biBjbGllbnQgc2lkZSB0byBidWlsZCB0aGUgZGF0YSBncmFwaCBvdXQgb2YgY2xpZW50LXNpZGUgY29sbGVjdGlvbnMuXG4gKlxuICogQHBhcmFtIG5vZGVcbiAqIEBwYXJhbSBwYXJlbnRPYmplY3RcbiAqIEBwYXJhbSBmZXRjaE9wdGlvbnNcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBmZXRjaChub2RlLCBwYXJlbnRPYmplY3QsIGZldGNoT3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMobm9kZSk7XG4gICAgLy8gYWRkIHN1YnNjcmlwdGlvbiBmaWx0ZXJcbiAgICBpZiAoZmV0Y2hPcHRpb25zLnNjb3BlZCAmJiBmZXRjaE9wdGlvbnMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgIF8uZXh0ZW5kKGZpbHRlcnMsIGZldGNoT3B0aW9ucy5zdWJzY3JpcHRpb25IYW5kbGUuc2NvcGVRdWVyeSgpKTtcbiAgICB9XG4gICAgLy8gYWRkIHF1ZXJ5IHBhdGggZmlsdGVyXG4gICAgaWYgKGZldGNoT3B0aW9ucy5zY29wZWQpIHtcbiAgICAgICAgXy5leHRlbmQoZmlsdGVycywge1tgX3F1ZXJ5X3BhdGhfJHtnZXROb2RlTmFtZXNwYWNlKG5vZGUpfWBdOiB7JGV4aXN0czogdHJ1ZX19KTtcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgaWYgKHBhcmVudE9iamVjdCkge1xuICAgICAgICBsZXQgYWNjZXNzb3IgPSBub2RlLmxpbmtlci5jcmVhdGVMaW5rKHBhcmVudE9iamVjdCwgbm9kZS5jb2xsZWN0aW9uKTtcblxuICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzID0gb3B0aW9ucy5maWVsZHMgfHwge307XG4gICAgICAgICAgICBpZiAoIWlzRmllbGRJblByb2plY3Rpb24ob3B0aW9ucy5maWVsZHMsIG5vZGUubGlua1N0b3JhZ2VGaWVsZCwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmZpZWxkcywge1xuICAgICAgICAgICAgICAgICAgICBbbm9kZS5saW5rU3RvcmFnZUZpZWxkXTogMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmVzdWx0cyA9IGFjY2Vzc29yLmZpbmQoZmlsdGVycywgb3B0aW9ucykuZmV0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRzID0gbm9kZS5jb2xsZWN0aW9uLmZpbmQoZmlsdGVycywgb3B0aW9ucykuZmV0Y2goKTtcbiAgICB9XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgXy5lYWNoKHJlc3VsdHMsIHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTm9kZVJlc3VsdHMgPSBmZXRjaChjb2xsZWN0aW9uTm9kZSwgcmVzdWx0KTtcbiAgICAgICAgICAgIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBjb2xsZWN0aW9uTm9kZVJlc3VsdHM7XG4gICAgICAgICAgICAvL2RlbGV0ZSByZXN1bHRbbm9kZS5saW5rZXIubGlua1N0b3JhZ2VGaWVsZF07XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogUHVzaCBpbnRvIHRoZSByZXN1bHRzLCBiZWNhdXNlIHNuYXBCYWNrQ2FjaGVzKCkgaW4gcHJlcGFyZUZvckRlbGl2ZXJ5IGRvZXMgbm90IHdvcmsgb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICogVGhpcyBpcyBub24tb3B0aW1hbCwgY2FuIHdlIGJlIHN1cmUgdGhhdCBldmVyeSBpdGVtIGluIHJlc3VsdHMgY29udGFpbnMgX2lkIGFuZCBhZGQgb25seSBpZiBub3QgaW5cbiAgICAgICAgICAgICAqIHRoZSByZXN1bHRzP1xuICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAqIE90aGVyIHBvc3NpYmxlIHdheXM6XG4gICAgICAgICAgICAgKiAtIGRvIHNvbWV0aGluZyBsaWtlIGFzc2VtYmxlKCkgaW4gc3RvcmVIeXBlcm5vdmFSZXN1bHRzXG4gICAgICAgICAgICAgKiAtIHBhc3Mgbm9kZS5yZXN1bHRzIHRvIGFjY2Vzc29yIGFib3ZlIGFuZCBmaW5kIHdpdGggc2lmdFxuICAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMucHVzaCguLi5jb2xsZWN0aW9uTm9kZVJlc3VsdHMpO1xuXG4gICAgICAgICAgICAvLyB0aGlzIHdhcyBub3Qgd29ya2luZyBiZWNhdXNlIGFsbCByZWZlcmVuY2VzIG11c3QgYmUgcmVwbGFjZWQgaW4gc25hcEJhY2tDYWNoZXMsIG5vdCBvbmx5IHRoZSBvbmVzIHRoYXQgYXJlIFxuICAgICAgICAgICAgLy8gZm91bmQgZmlyc3RcbiAgICAgICAgICAgIC8vIGNvbnN0IGN1cnJlbnRJZHMgPSBfLnBsdWNrKGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMsICdfaWQnKTtcbiAgICAgICAgICAgIC8vIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHMucHVzaCguLi5jb2xsZWN0aW9uTm9kZVJlc3VsdHMuZmlsdGVyKHJlcyA9PiAhXy5jb250YWlucyhjdXJyZW50SWRzLCByZXMuX2lkKSkpO1xuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwYXJhbXMsIGZldGNoT3B0aW9ucykgPT4ge1xuICAgIG5vZGUucmVzdWx0cyA9IGZldGNoKG5vZGUsIG51bGwsIGZldGNoT3B0aW9ucyk7XG5cbiAgICBwcmVwYXJlRm9yRGVsaXZlcnkobm9kZSwgcGFyYW1zKTtcblxuICAgIHJldHVybiBub2RlLnJlc3VsdHM7XG59XG4iLCJpbXBvcnQgRmllbGROb2RlIGZyb20gJy4vZmllbGROb2RlLmpzJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuL3JlZHVjZXJOb2RlLmpzJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NoZWNrLCBNYXRjaH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7ZXhwYW5kRmllbGQsIGlzRmllbGRJblByb2plY3Rpb259IGZyb20gJy4uL2xpYi9maWVsZEluUHJvamVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbGxlY3Rpb25Ob2RlIHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uLCBib2R5ID0ge30sIGxpbmtOYW1lID0gbnVsbCkge1xuICAgICAgICBpZiAoY29sbGVjdGlvbiAmJiAhXy5pc09iamVjdChib2R5KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1ib2R5JywgYFRoZSBmaWVsZCBcIiR7bGlua05hbWV9XCIgaXMgYSBjb2xsZWN0aW9uIGxpbmssIGFuZCBzaG91bGQgaGF2ZSBpdHMgYm9keSBkZWZpbmVkIGFzIGFuIG9iamVjdC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYm9keSA9IGRlZXBDbG9uZShib2R5KTtcbiAgICAgICAgdGhpcy5saW5rTmFtZSA9IGxpbmtOYW1lO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuXG4gICAgICAgIHRoaXMubm9kZXMgPSBbXTtcbiAgICAgICAgdGhpcy5wcm9wcyA9IHt9O1xuICAgICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICAgIHRoaXMubGlua2VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gbnVsbDtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJlZHVjZXJzID0gW107XG4gICAgICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgICAgICB0aGlzLnNuYXBDYWNoZXMgPSB7fTsgLy8ge2NhY2hlRmllbGQ6IGxpbmtOYW1lfVxuICAgICAgICB0aGlzLnNuYXBDYWNoZXNTaW5nbGVzID0gW107IC8vIFtjYWNoZUZpZWxkMSwgY2FjaGVGaWVsZDJdXG4gICAgfVxuXG4gICAgZ2V0IGNvbGxlY3Rpb25Ob2RlcygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMubm9kZXMsIG4gPT4gbiBpbnN0YW5jZW9mIENvbGxlY3Rpb25Ob2RlKVxuICAgIH1cblxuICAgIGdldCBmaWVsZE5vZGVzKCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5ub2RlcywgbiA9PiBuIGluc3RhbmNlb2YgRmllbGROb2RlKTtcbiAgICB9XG5cbiAgICBnZXQgcmVkdWNlck5vZGVzKCkge1xuICAgICAgICByZXR1cm4gXy5maWx0ZXIodGhpcy5ub2RlcywgbiA9PiBuIGluc3RhbmNlb2YgUmVkdWNlck5vZGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgY2hpbGRyZW4gdG8gaXRzZWxmXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqIEBwYXJhbSBsaW5rZXJcbiAgICAgKi9cbiAgICBhZGQobm9kZSwgbGlua2VyKSB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcztcblxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZpZWxkTm9kZSkge1xuICAgICAgICAgICAgcnVuRmllbGRTYW5pdHlDaGVja3Mobm9kZS5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgbm9kZS5saW5rZXIgPSBsaW5rZXI7XG4gICAgICAgICAgICBub2RlLmxpbmtTdG9yYWdlRmllbGQgPSBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgICAgIG5vZGUuaXNNZXRhID0gbGlua2VyLmlzTWV0YSgpO1xuICAgICAgICAgICAgbm9kZS5pc1ZpcnR1YWwgPSBsaW5rZXIuaXNWaXJ0dWFsKCk7XG4gICAgICAgICAgICBub2RlLmlzT25lUmVzdWx0ID0gbGlua2VyLmlzT25lUmVzdWx0KCk7XG4gICAgICAgICAgICBub2RlLnNob3VsZENsZWFuU3RvcmFnZSA9IHRoaXMuX3Nob3VsZENsZWFuU3RvcmFnZShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcHJvcFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIGFkZFByb3AocHJvcCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3AgPT09ICckcG9zdEZpbHRlcicpIHtcbiAgICAgICAgICAgIGNoZWNrKHZhbHVlLCBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW0Z1bmN0aW9uXSkpXG4gICAgICAgIH1cblxuICAgICAgICBfLmV4dGVuZCh0aGlzLnByb3BzLCB7XG4gICAgICAgICAgICBbcHJvcF06IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBfbm9kZVxuICAgICAqL1xuICAgIHJlbW92ZShfbm9kZSkge1xuICAgICAgICB0aGlzLm5vZGVzID0gXy5maWx0ZXIodGhpcy5ub2Rlcywgbm9kZSA9PiBfbm9kZSAhPT0gbm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZpbHRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGFwcGx5RmllbGRzKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGhhc0FkZGVkQW55RmllbGQgPSBmYWxzZTtcblxuICAgICAgICBfLmVhY2godGhpcy5maWVsZE5vZGVzLCBuID0+IHtcbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogJG1ldGEgZmllbGQgc2hvdWxkIGJlIGFkZGVkIHRvIHRoZSBvcHRpb25zLmZpZWxkcywgYnV0IE1vbmdvREIgZG9lcyBub3QgZXhjbHVkZSBvdGhlciBmaWVsZHMuXG4gICAgICAgICAgICAgKiBUaGVyZWZvcmUsIHdlIGRvIG5vdCBjb3VudCB0aGlzIGFzIGEgZmllbGQgYWRkaXRpb24uXG4gICAgICAgICAgICAgKiBcbiAgICAgICAgICAgICAqIFNlZTogaHR0cHM6Ly9kb2NzLm1vbmdvZGIuY29tL21hbnVhbC9yZWZlcmVuY2Uvb3BlcmF0b3IvcHJvamVjdGlvbi9tZXRhL1xuICAgICAgICAgICAgICogVGhlICRtZXRhIGV4cHJlc3Npb24gc3BlY2lmaWVzIHRoZSBpbmNsdXNpb24gb2YgdGhlIGZpZWxkIHRvIHRoZSByZXN1bHQgc2V0IFxuICAgICAgICAgICAgICogYW5kIGRvZXMgbm90IHNwZWNpZnkgdGhlIGV4Y2x1c2lvbiBvZiB0aGUgb3RoZXIgZmllbGRzLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBpZiAobi5wcm9qZWN0aW9uT3BlcmF0b3IgIT09ICckbWV0YScpIHtcbiAgICAgICAgICAgICAgICBoYXNBZGRlZEFueUZpZWxkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG4uYXBwbHlGaWVsZHMob3B0aW9ucy5maWVsZHMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGl0IHdpbGwgb25seSBnZXQgaGVyZSBpZiBpdCBoYXMgY29sbGVjdGlvbk5vZGVzIGNoaWxkcmVuXG4gICAgICAgIF8uZWFjaCh0aGlzLmNvbGxlY3Rpb25Ob2RlcywgKGNvbGxlY3Rpb25Ob2RlKSA9PiB7XG4gICAgICAgICAgICBsZXQgbGlua2VyID0gY29sbGVjdGlvbk5vZGUubGlua2VyO1xuXG4gICAgICAgICAgICBpZiAobGlua2VyICYmICFsaW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzRmllbGRJblByb2plY3Rpb24ob3B0aW9ucy5maWVsZHMsIGxpbmtlci5saW5rU3RvcmFnZUZpZWxkLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZpZWxkc1tsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICBoYXNBZGRlZEFueUZpZWxkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIGhlIHNlbGVjdGVkIGZpbHRlcnMsIHdlIHNob3VsZCBhdXRvbWF0aWNhbGx5IGFkZCB0aG9zZSBmaWVsZHNcbiAgICAgICAgXy5lYWNoKGZpbHRlcnMsICh2YWx1ZSwgZmllbGQpID0+IHtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZSAkbWV0YSBmaWx0ZXIsIGNvbmRpdGlvbmFsIG9wZXJhdG9ycyBhbmQgdGV4dCBzZWFyY2hcbiAgICAgICAgICAgIGlmICghXy5jb250YWlucyhbJyRvcicsICckbm9yJywgJyRub3QnLCAnJGFuZCcsICckbWV0YScsICckdGV4dCddLCBmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAvLyBpZiB0aGUgZmllbGQgb3IgdGhlIHBhcmVudCBvZiB0aGUgZmllbGQgYWxyZWFkeSBleGlzdHMsIGRvbid0IGFkZCBpdFxuICAgICAgICAgICAgICAgIGlmICghXy5oYXMob3B0aW9ucy5maWVsZHMsIGZpZWxkLnNwbGl0KCcuJylbMF0pKXtcbiAgICAgICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzW2ZpZWxkXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWhhc0FkZGVkQW55RmllbGQpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzID0ge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICAvLyBmaWVsZHMgbWlnaHQgY29udGFpbiAkbWV0YSBleHByZXNzaW9uLCBzbyBpdCBzaG91bGQgYmUgYWRkZWQgaGVyZSxcbiAgICAgICAgICAgICAgICAuLi5vcHRpb25zLmZpZWxkcyxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmllbGROYW1lXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzRmllbGQoZmllbGROYW1lLCBjaGVja05lc3RlZCA9IGZhbHNlKSB7XG4gICAgICAgIC8vIGZvciBjaGVja05lc3RlZCBmbGFnIGl0IGV4cGFuZHMgcHJvZmlsZS5waG9uZS52ZXJpZmllZCBpbnRvIFxuICAgICAgICAvLyBbJ3Byb2ZpbGUnLCAncHJvZmlsZS5waG9uZScsICdwcm9maWxlLnBob25lLnZlcmlmaWVkJ11cbiAgICAgICAgLy8gaWYgYW55IG9mIHRoZXNlIGZpZWxkcyBtYXRjaCBpdCBtZWFucyB0aGF0IGZpZWxkIGV4aXN0c1xuICAgICAgICBjb25zdCBvcHRpb25zID0gY2hlY2tOZXN0ZWQgPyBleHBhbmRGaWVsZChmaWVsZE5hbWUpIDogW2ZpZWxkTmFtZV07XG4gICAgICAgIHJldHVybiAhIV8uZmluZCh0aGlzLmZpZWxkTm9kZXMsIGZpZWxkTm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gXy5jb250YWlucyhvcHRpb25zLCBmaWVsZE5vZGUubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWVsZE5hbWVcbiAgICAgKiBAcmV0dXJucyB7RmllbGROb2RlfVxuICAgICAqL1xuICAgIGdldEZpZWxkKGZpZWxkTmFtZSkge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuZmllbGROb2RlcywgZmllbGROb2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZE5vZGUubmFtZSA9PSBmaWVsZE5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhc0NvbGxlY3Rpb25Ob2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmxpbmtOYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhc1JlZHVjZXJOb2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMucmVkdWNlck5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLm5hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHJldHVybnMge1JlZHVjZXJOb2RlfVxuICAgICAqL1xuICAgIGdldFJlZHVjZXJOb2RlKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLnJlZHVjZXJOb2Rlcywgbm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtDb2xsZWN0aW9uTm9kZX1cbiAgICAgKi9cbiAgICBnZXRDb2xsZWN0aW9uTm9kZShuYW1lKSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubGlua05hbWUgPT0gbmFtZVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICA/IHRoaXMubGlua05hbWVcbiAgICAgICAgICAgIDogKHRoaXMuY29sbGVjdGlvbiA/IHRoaXMuY29sbGVjdGlvbi5fbmFtZSA6ICdOL0EnKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIGlzIHVzZWQgZm9yIGNhY2hpbmcgbGlua3NcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWNoZUZpZWxkXG4gICAgICogQHBhcmFtIHN1YkxpbmtOYW1lXG4gICAgICovXG4gICAgc25hcENhY2hlKGNhY2hlRmllbGQsIHN1YkxpbmtOYW1lKSB7XG4gICAgICAgIHRoaXMuc25hcENhY2hlc1tjYWNoZUZpZWxkXSA9IHN1YkxpbmtOYW1lO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbGxlY3Rpb24uZ2V0TGlua2VyKHN1YkxpbmtOYW1lKS5pc09uZVJlc3VsdCgpKSB7XG4gICAgICAgICAgICB0aGlzLnNuYXBDYWNoZXNTaW5nbGVzLnB1c2goY2FjaGVGaWVsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGlzIG1ldGhvZCB2ZXJpZmllcyB3aGV0aGVyIHRvIHJlbW92ZSB0aGUgbGlua1N0b3JhZ2VGaWVsZCBmb3JtIHRoZSByZXN1bHRzXG4gICAgICogdW5sZXNzIHlvdSBzcGVjaWZ5IGl0IGluIHlvdXIgcXVlcnkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbm9kZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3Nob3VsZENsZWFuU3RvcmFnZShub2RlKSB7XG4gICAgICAgIGlmIChub2RlLmxpbmtTdG9yYWdlRmllbGQgPT09ICdfaWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIW5vZGUuaGFzRmllbGQobm9kZS5saW5rU3RvcmFnZUZpZWxkLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICF0aGlzLmhhc0ZpZWxkKG5vZGUubGlua1N0b3JhZ2VGaWVsZCwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8qKlxuICogTWFrZSBzdXJlIHRoYXQgdGhlIGZpZWxkIGlzIG9rIHRvIGJlIGFkZGVkXG4gKiBAcGFyYW0geyp9IGZpZWxkTmFtZSBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJ1bkZpZWxkU2FuaXR5Q2hlY2tzKGZpZWxkTmFtZSkge1xuICAgIC8vIFJ1biBzYW5pdHkgY2hlY2tzIG9uIHRoZSBmaWVsZFxuICAgIGlmIChmaWVsZE5hbWVbMF0gPT09ICckJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBhcmUgbm90IGFsbG93ZWQgdG8gdXNlIGZpZWxkcyB0aGF0IHN0YXJ0IHdpdGggJCBpbnNpZGUgYSByZWR1Y2VyJ3MgYm9keTogJHtmaWVsZE5hbWV9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBGaWVsZE5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGJvZHksIGlzUHJvamVjdGlvbk9wZXJhdG9yID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5wcm9qZWN0aW9uT3BlcmF0b3IgPSBpc1Byb2plY3Rpb25PcGVyYXRvciA/IF8ua2V5cyhib2R5KVswXSA6IG51bGw7XG4gICAgICAgIHRoaXMuYm9keSA9ICFfLmlzT2JqZWN0KGJvZHkpIHx8IGlzUHJvamVjdGlvbk9wZXJhdG9yID8gYm9keSA6IDE7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBhcHBseUZpZWxkcyhmaWVsZHMpIHtcbiAgICAgICAgZmllbGRzW3RoaXMubmFtZV0gPSB0aGlzLmJvZHk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVkdWNlck5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHtib2R5LCByZWR1Y2V9KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMucmVkdWNlRnVuY3Rpb24gPSByZWR1Y2U7XG4gICAgICAgIHRoaXMuZGVwZW5kZW5jaWVzID0gW107IC8vIFRoaXMgaXMgYSBsaXN0IG9mIHRoZSByZWR1Y2VyIHRoaXMgcmVkdWNlciB1c2VzLlxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gY29tcHV0aW5nIHdlIGFsc28gcGFzcyB0aGUgcGFyYW1ldGVyc1xuICAgICAqIFxuICAgICAqIEBwYXJhbSB7Kn0gb2JqZWN0IFxuICAgICAqIEBwYXJhbSB7Kn0gYXJncyBcbiAgICAgKi9cbiAgICBjb21wdXRlKG9iamVjdCwgLi4uYXJncykge1xuICAgICAgICBvYmplY3RbdGhpcy5uYW1lXSA9IHRoaXMucmVkdWNlLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICByZWR1Y2Uob2JqZWN0LCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlZHVjZUZ1bmN0aW9uLmNhbGwodGhpcywgb2JqZWN0LCAuLi5hcmdzKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgY2hlY2sgfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGFkZEZpZWxkTWFwIGZyb20gJy4vbGliL2FkZEZpZWxkTWFwJztcblxuY29uc3Qgc3RvcmFnZSA9ICdfX3JlZHVjZXJzJztcbk9iamVjdC5hc3NpZ24oTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIGFkZFJlZHVjZXJzKGRhdGEpIHtcbiAgICAgICAgaWYgKCF0aGlzW3N0b3JhZ2VdKSB7XG4gICAgICAgICAgICB0aGlzW3N0b3JhZ2VdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goZGF0YSwgKHJlZHVjZXJDb25maWcsIHJlZHVjZXJOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXNbcmVkdWNlckNvbmZpZ10pIHtcbiAgICAgICAgICAgICAgICB0aGlzW3JlZHVjZXJDb25maWddID0ge307XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmdldExpbmtlcihyZWR1Y2VyTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFxuICAgICAgICAgICAgICAgICAgICBgWW91IGNhbm5vdCBhZGQgdGhlIHJlZHVjZXIgd2l0aCBuYW1lOiAke3JlZHVjZXJOYW1lfSBiZWNhdXNlIGl0IGlzIGFscmVhZHkgZGVmaW5lZCBhcyBhIGxpbmsgaW4gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzW3JlZHVjZXJDb25maWddW3JlZHVjZXJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBZb3UgY2Fubm90IGFkZCB0aGUgcmVkdWNlciB3aXRoIG5hbWU6ICR7cmVkdWNlck5hbWV9IGJlY2F1c2UgaXQgd2FzIGFscmVhZHkgYWRkZWQgdG8gJHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX25hbWVcbiAgICAgICAgICAgICAgICAgICAgfSBjb2xsZWN0aW9uYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNoZWNrKHJlZHVjZXJDb25maWcsIHtcbiAgICAgICAgICAgICAgICBib2R5OiBPYmplY3QsXG4gICAgICAgICAgICAgICAgcmVkdWNlOiBGdW5jdGlvbixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzW3N0b3JhZ2VdLCB7XG4gICAgICAgICAgICAgICAgW3JlZHVjZXJOYW1lXTogcmVkdWNlckNvbmZpZyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXRSZWR1Y2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbc3RvcmFnZV0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzW3N0b3JhZ2VdW25hbWVdO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFRoaXMgY3JlYXRlcyByZWR1Y2VycyB0aGF0IG1ha2VzIHNvcnQgb2YgYWxpYXNlcyBmb3IgdGhlIGRhdGFiYXNlIGZpZWxkcyB3ZSB1c2VcbiAgICAgKi9cbiAgICBhZGRGaWVsZE1hcCxcbn0pO1xuIiwiLyoqXG4gKiBAcGFyYW0ge1tuaWNlRmllbGQ6IHN0cmluZ106IGRiRmllbGR9IG1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRGaWVsZE1hcChtYXApIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcztcbiAgICBsZXQgcmVkdWNlcnMgPSB7fTtcbiAgICBmb3IgKGxldCBrZXkgaW4gbWFwKSB7XG4gICAgICAgIGNvbnN0IGRiRmllbGQgPSBtYXBba2V5XTtcbiAgICAgICAgcmVkdWNlcnNba2V5XSA9IHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgICBbZGJGaWVsZF06IDEsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlKG9iaikge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmpbZGJGaWVsZF07XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGNvbGxlY3Rpb24uYWRkUmVkdWNlcnMocmVkdWNlcnMpO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYXBwbHlSZWR1Y2Vycyhyb290LCBwYXJhbXMpIHtcbiAgICBfLmVhY2gocm9vdC5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBhcHBseVJlZHVjZXJzKG5vZGUsIHBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9jZXNzZWRSZWR1Y2VycyA9IFtdO1xuICAgIGxldCByZWR1Y2Vyc1F1ZXVlID0gWy4uLnJvb3QucmVkdWNlck5vZGVzXTtcblxuICAgIC8vIFRPRE86IGZpbmQgb3V0IGlmIHRoZXJlJ3MgYW4gaW5maW5pdGUgcmVkdWNlciBpbnRlci1kZWVuZGVuY3lcblxuICAgIHdoaWxlIChyZWR1Y2Vyc1F1ZXVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCByZWR1Y2VyTm9kZSA9IHJlZHVjZXJzUXVldWUuc2hpZnQoKTtcblxuICAgICAgICAvLyBJZiB0aGlzIHJlZHVjZXIgZGVwZW5kcyBvbiBvdGhlciByZWR1Y2Vyc1xuICAgICAgICBpZiAocmVkdWNlck5vZGUuZGVwZW5kZW5jaWVzLmxlbmd0aCkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYW4gdW5wcm9jZXNzZWQgcmVkdWNlciwgbW92ZSBpdCBhdCB0aGUgZW5kIG9mIHRoZSBxdWV1ZVxuICAgICAgICAgICAgY29uc3QgYWxsRGVwZW5kZW5jaWVzQ29tcHV0ZWQgPSBfLmFsbChyZWR1Y2VyTm9kZS5kZXBlbmRlbmNpZXMsIGRlcCA9PiBwcm9jZXNzZWRSZWR1Y2Vycy5pbmNsdWRlcyhkZXApKTtcbiAgICAgICAgICAgIGlmIChhbGxEZXBlbmRlbmNpZXNDb21wdXRlZCkge1xuICAgICAgICAgICAgICAgIHJvb3QucmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlZHVjZXJOb2RlLmNvbXB1dGUocmVzdWx0LCBwYXJhbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHByb2Nlc3NlZFJlZHVjZXJzLnB1c2gocmVkdWNlck5vZGUubmFtZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE1vdmUgaXQgYXQgdGhlIGVuZCBvZiB0aGUgcXVldWVcbiAgICAgICAgICAgICAgICByZWR1Y2Vyc1F1ZXVlLnB1c2gocmVkdWNlck5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm9vdC5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICByZWR1Y2VyTm9kZS5jb21wdXRlKHJlc3VsdCwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9jZXNzZWRSZWR1Y2Vycy5wdXNoKHJlZHVjZXJOb2RlLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcblxuLyoqXG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMocm9vdCwgcmVzdWx0cykge1xuICAgIF8uZWFjaChyb290LmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uKSB7XG4gICAgICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W25vZGUubGlua05hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgbGV0IGNoaWxkUmVzdWx0cztcbiAgICAgICAgaWYgKG5vZGUuaXNPbmVSZXN1bHQpIHtcbiAgICAgICAgICAgIGNoaWxkUmVzdWx0cyA9IHJlc3VsdHMubWFwKHJlc3VsdCA9PiByZXN1bHRbbm9kZS5saW5rTmFtZV0pLmZpbHRlcihlbGVtZW50ID0+ICEhZWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjaGlsZFJlc3VsdHMgPSBfLmZsYXR0ZW4ocmVzdWx0cy5tYXAocmVzdWx0ID0+IHJlc3VsdFtub2RlLmxpbmtOYW1lXSkuZmlsdGVyKGVsZW1lbnQgPT4gISFlbGVtZW50KSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhblJlZHVjZXJMZWZ0b3ZlcnMobm9kZSwgY2hpbGRSZXN1bHRzKTtcbiAgICB9KTtcblxuICAgIF8uZWFjaChyb290LmZpZWxkTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbikge1xuICAgICAgICAgICAgY2xlYW5OZXN0ZWRGaWVsZHMobm9kZS5uYW1lLnNwbGl0KCcuJyksIHJlc3VsdHMsIHJvb3QpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBfLmVhY2gocm9vdC5yZWR1Y2VyTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbikge1xuICAgICAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtub2RlLm5hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbi8vIGlmIHdlIHN0b3JlIGEgZmllbGQgbGlrZTogJ3Byb2ZpbGUuZmlyc3ROYW1lJ1xuLy8gdGhlbiB3ZSBuZWVkIHRvIGRlbGV0ZSBwcm9maWxlOiB7IGZpcnN0TmFtZSB9XG4vLyBpZiBwcm9maWxlIHdpbGwgaGF2ZSBlbXB0eSBrZXlzLCB3ZSBuZWVkIHRvIGRlbGV0ZSBwcm9maWxlLlxuXG4vKipcbiAqIENsZWFucyB3aGF0IHJlZHVjZXJzIG5lZWRlZCB0byBiZSBjb21wdXRlZCBhbmQgbm90IHVzZWQuXG4gKiBAcGFyYW0gcGFydHNcbiAqIEBwYXJhbSByZXN1bHRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuTmVzdGVkRmllbGRzKHBhcnRzLCByZXN1bHRzLCByb290KSB7XG4gICAgY29uc3Qgc25hcENhY2hlRmllbGQgPSByb290LnNuYXBDYWNoZXNbcGFydHNbMF1dO1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IHNuYXBDYWNoZUZpZWxkID8gc25hcENhY2hlRmllbGQgOiBwYXJ0c1swXTtcblxuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgcmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICBpZiAoXy5pc09iamVjdChyZXN1bHQpICYmIGZpZWxkTmFtZSAhPT0gJ19pZCcpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2ZpZWxkTmFtZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwYXJ0cy5zaGlmdCgpO1xuICAgIGNsZWFuTmVzdGVkRmllbGRzKFxuICAgICAgICBwYXJ0cywgXG4gICAgICAgIHJlc3VsdHNcbiAgICAgICAgICAgIC5maWx0ZXIocmVzdWx0ID0+ICEhcmVzdWx0W2ZpZWxkTmFtZV0pXG4gICAgICAgICAgICAubWFwKHJlc3VsdCA9PiByZXN1bHRbZmllbGROYW1lXSksXG4gICAgICAgIHJvb3RcbiAgICApO1xuICAgIFxuICAgIHJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICBpZiAoXy5pc09iamVjdChyZXN1bHRbZmllbGROYW1lXSkgJiYgXy5rZXlzKHJlc3VsdFtmaWVsZE5hbWVdKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGlmIChmaWVsZE5hbWUgIT09ICdfaWQnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtmaWVsZE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn1cbiIsImltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQgeyBjcmVhdGVOb2RlcyB9IGZyb20gJy4uLy4uL2xpYi9jcmVhdGVHcmFwaCc7XG5pbXBvcnQgQ29sbGVjdGlvbk5vZGUgZnJvbSAnLi4vLi4vbm9kZXMvY29sbGVjdGlvbk5vZGUnO1xuaW1wb3J0IEZpZWxkTm9kZSBmcm9tICcuLi8uLi9ub2Rlcy9maWVsZE5vZGUnO1xuaW1wb3J0IFJlZHVjZXJOb2RlIGZyb20gJy4uLy4uL25vZGVzL3JlZHVjZXJOb2RlJztcbmltcG9ydCBlbWJlZFJlZHVjZXJXaXRoTGluayBmcm9tICcuL2VtYmVkUmVkdWNlcldpdGhMaW5rJztcbmltcG9ydCB7IHNwZWNpYWxGaWVsZHMgfSBmcm9tICcuLi8uLi9saWIvY3JlYXRlR3JhcGgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRSZWR1Y2Vycyhyb290KSB7XG4gICAgLy8gd2UgYWRkIHJlZHVjZXJzIGxhc3QsIGFmdGVyIHdlIGhhdmUgYWRkZWQgYWxsIHRoZSBmaWVsZHMuXG4gICAgcm9vdC5yZWR1Y2VyTm9kZXMuZm9yRWFjaChyZWR1Y2VyID0+IHtcbiAgICAgICAgXy5lYWNoKHJlZHVjZXIuYm9keSwgKGJvZHksIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlQWRkRWxlbWVudChyZWR1Y2VyLCByb290LCBmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICB9KVxuICAgIH0pO1xufVxuXG4vKipcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gZmllbGROYW1lXG4gKiBAcGFyYW0gYm9keVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkRWxlbWVudChyZWR1Y2VyTm9kZSwgcm9vdCwgZmllbGROYW1lLCBib2R5KSB7XG4gICAgLy8gaWYgaXQncyBhIGxpbmtcbiAgICBjb25zdCBjb2xsZWN0aW9uID0gcm9vdC5jb2xsZWN0aW9uO1xuICAgIGNvbnN0IGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGZpZWxkTmFtZSk7XG4gICAgaWYgKGxpbmtlcikge1xuICAgICAgICByZXR1cm4gaGFuZGxlQWRkTGluayhyZWR1Y2VyTm9kZSwgZmllbGROYW1lLCBib2R5LCByb290LCBsaW5rZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoZmllbGROYW1lKTtcbiAgICBpZiAocmVkdWNlcikge1xuICAgICAgICByZWR1Y2VyTm9kZS5kZXBlbmRlbmNpZXMucHVzaChmaWVsZE5hbWUpO1xuICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihmaWVsZE5hbWUsIHJlZHVjZXIsIHJvb3QpO1xuICAgIH1cblxuICAgIC8vIHdlIGFzc3VtZSBpdCdzIGEgZmllbGQgaW4gdGhpcyBjYXNlXG4gICAgcmV0dXJuIGhhbmRsZUFkZEZpZWxkKGZpZWxkTmFtZSwgYm9keSwgcm9vdCk7XG59XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIHJlZHVjZXJcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRSZWR1Y2VyKGZpZWxkTmFtZSwge2JvZHksIHJlZHVjZX0sIHJvb3QpIHtcbiAgICBpZiAoIXJvb3QuaGFzUmVkdWNlck5vZGUoZmllbGROYW1lKSkge1xuICAgICAgICBsZXQgY2hpbGRSZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHtib2R5LCByZWR1Y2V9KTtcbiAgICAgICAgcm9vdC5hZGQoY2hpbGRSZWR1Y2VyTm9kZSk7XG4gICAgICAgIGNoaWxkUmVkdWNlck5vZGUuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSB0cnVlO1xuXG4gICAgICAgIF8uZWFjaChjaGlsZFJlZHVjZXJOb2RlLmJvZHksIChib2R5LCBmaWVsZE5hbWUpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZUFkZEVsZW1lbnQoY2hpbGRSZWR1Y2VyTm9kZSwgcm9vdCwgZmllbGROYW1lLCBib2R5KTtcbiAgICAgICAgfSlcbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSByb290XG4gKiBAcGFyYW0gbGlua2VyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRMaW5rKHJlZHVjZXJOb2RlLCBmaWVsZE5hbWUsIGJvZHksIHBhcmVudCwgbGlua2VyKSB7XG4gICAgaWYgKHBhcmVudC5oYXNDb2xsZWN0aW9uTm9kZShmaWVsZE5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25Ob2RlID0gcGFyZW50LmdldENvbGxlY3Rpb25Ob2RlKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsocmVkdWNlck5vZGUsIGJvZHksIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhZGRcbiAgICAgICAgbGV0IGNvbGxlY3Rpb25Ob2RlID0gbmV3IENvbGxlY3Rpb25Ob2RlKGxpbmtlci5nZXRMaW5rZWRDb2xsZWN0aW9uKCksIGJvZHksIGZpZWxkTmFtZSk7XG4gICAgICAgIGNvbGxlY3Rpb25Ob2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50LmFkZChjb2xsZWN0aW9uTm9kZSwgbGlua2VyKTtcblxuICAgICAgICBjcmVhdGVOb2Rlcyhjb2xsZWN0aW9uTm9kZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkRmllbGQoZmllbGROYW1lLCBib2R5LCByb290KSB7XG4gICAgaWYgKF8uY29udGFpbnMoc3BlY2lhbEZpZWxkcywgZmllbGROYW1lKSkge1xuICAgICAgICByb290LmFkZFByb3AoZmllbGROYW1lLCBib2R5KTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgLy8gaWYgcmVkdWNlciBzcGVjaWZpZXMgYSBuZXN0ZWQgZmllbGRcbiAgICAgICAgLy8gaWYgaXQncyBhIHByb3BcbiAgICAgICAgY29uc3QgZG90cyA9IGRvdC5kb3Qoe1xuICAgICAgICAgICAgW2ZpZWxkTmFtZV06IGJvZHlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy5lYWNoKGRvdHMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBhZGRGaWVsZElmUmVxdWlyZWQocm9vdCwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHJlZHVjZXIgZG9lcyBub3Qgc3BlY2lmeSBhIG5lc3RlZCBmaWVsZCwgYW5kIHRoZSBmaWVsZCBkb2VzIG5vdCBleGlzdC5cbiAgICAgICAgYWRkRmllbGRJZlJlcXVpcmVkKHJvb3QsIGZpZWxkTmFtZSwgYm9keSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhZGRGaWVsZElmUmVxdWlyZWQocm9vdCwgZmllbGROYW1lLCBib2R5KSB7XG4gICAgaWYgKCFyb290Lmhhc0ZpZWxkKGZpZWxkTmFtZSwgdHJ1ZSkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgbmVzdGVkIGZpZWxkcyBmb3IgdGhpcyBmaWVsZC5cbiAgICAgICAgICogQWRkaW5nIHJvb3QgZmllbGQgaGVyZSBhbmQgc2NoZWR1bGluZyBmb3IgZGVsZXRpb24gd291bGQgbm90IHdvcmsgaWYgdGhlcmUgaXMgYWxyZWFkeSBuZXN0ZWQgZmllbGQsIFxuICAgICAgICAgKiBmb3IgZXhhbXBsZTpcbiAgICAgICAgICogd2hlbiB0cnlpbmcgdG8gYWRkIG1ldGE6IDEsIGl0IHNob3VsZCBiZSBjaGVja2VkIHRoYXQgdGhlcmUgYXJlIG5vIG1ldGEuKiBmaWVsZHNcbiAgICAgICAgICogKi9cblxuICAgICAgICBjb25zdCBuZXN0ZWRGaWVsZHMgPSByb290LmZpZWxkTm9kZXMuZmlsdGVyKCh7bmFtZX0pID0+IG5hbWUuc3RhcnRzV2l0aChgJHtmaWVsZE5hbWV9LmApKTtcbiAgICAgICAgLy8gcmVtb3ZlIG5lc3RlZCBmaWVsZHMgLSBpbXBvcnRhbnQgZm9yIG1pbmltb25nbyB3aGljaCBjb21wbGFpbnMgZm9yIHRoZXNlIHNpdHVhdGlvbnNcbiAgICAgICAgLy8gVE9ETzogZXhjZXNzIGZpZWxkcyBhcmUgbm90IHJlbW92ZWQgKGNhdXNlZCBieSBhZGRpbmcgdGhlIHJvb3QgZmllbGQgYW5kIHJlbW92aW5nIG5lc3RlZCBmaWVsZHMpIGJ1dCB0aGVyZVxuICAgICAgICAvLyBzaG91bGQgcHJvYmFibHkgYmUgYSB3YXkgdG8gaGFuZGxlIHRoaXMgaW4gcG9zdC1wcm9jZXNzaW5nIC0gZm9yIGV4YW1wbGUgYnkga2VlcGluZyBhIHdoaXRlbGlzdCBvZiBmaWVsZHNcbiAgICAgICAgLy8gYW5kIHJlbW92aW5nIGFueXRoaW5nIGVsc2VcbiAgICAgICAgbmVzdGVkRmllbGRzLmZvckVhY2gobm9kZSA9PiByb290LnJlbW92ZShub2RlKSk7XG4gXG4gICAgICAgIGxldCBmaWVsZE5vZGUgPSBuZXcgRmllbGROb2RlKGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIC8vIGRlbGV0ZSBvbmx5IGlmIGFsbCBuZXN0ZWQgZmllbGRzIGFyZSBzY2hlZHVsZWQgZm9yIGRlbGV0aW9uICh0aGF0IGluY2x1ZGVzIHRoZSBjYXNlIG9mIDAgbmVzdGVkIGZpZWxkcylcbiAgICAgICAgZmllbGROb2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gbmVzdGVkRmllbGRzLmV2ZXJ5KGZpZWxkID0+IGZpZWxkLnNjaGVkdWxlZEZvckRlbGV0aW9uKTtcblxuICAgICAgICByb290LmFkZChmaWVsZE5vZGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7aGFuZGxlQWRkRmllbGQsIGhhbmRsZUFkZEVsZW1lbnQsIGhhbmRsZUFkZFJlZHVjZXJ9IGZyb20gJy4vY3JlYXRlUmVkdWNlcnMnO1xuXG4vKipcbiAqIEVtYmVkcyB0aGUgcmVkdWNlciBib2R5IHdpdGggYSBjb2xsZWN0aW9uIGJvZHlcbiAqIEBwYXJhbSByZWR1Y2VyQm9keVxuICogQHBhcmFtIGNvbGxlY3Rpb25Ob2RlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVtYmVkUmVkdWNlcldpdGhMaW5rKHJlZHVjZXJOb2RlLCByZWR1Y2VyQm9keSwgY29sbGVjdGlvbk5vZGUpIHtcbiAgICBfLmVhY2gocmVkdWNlckJvZHksICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG4gICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgLy8gbmVzdGVkIGZpZWxkIG9yIGxpbmtcbiAgICAgICAgICAgIGlmIChjb2xsZWN0aW9uTm9kZS5ib2R5W2tleV0pIHtcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCBleGlzdHNcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihrZXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgaXQncyBhIGxpbmtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNEZW5vcm1hbGl6ZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1N1YkJvZHlEZW5vcm1hbGl6ZWQodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FjaGVGaWVsZCA9IGxpbmtlci5saW5rQ29uZmlnLmRlbm9ybWFsaXplLmZpZWxkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZUFkZEZpZWxkKGNhY2hlRmllbGQsIHZhbHVlLCBjb2xsZWN0aW9uTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsocmVkdWNlck5vZGUsIHZhbHVlLCBjb2xsZWN0aW9uTm9kZS5nZXRDb2xsZWN0aW9uTm9kZShrZXkpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGhhbmRsZUFkZEZpZWxkKGtleSwgdmFsdWUsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3QgZXhpc3QsIHNvIGl0IG1heSBiZSBhIGxpbmsvcmVkdWNlci9maWVsZFxuICAgICAgICAgICAgICAgIGhhbmRsZUFkZEVsZW1lbnQocmVkdWNlck5vZGUsIGNvbGxlY3Rpb25Ob2RlLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgZmllbGQgb3Igb3RoZXIgcmVkdWNlciBleGlzdHMgd2l0aGluIHRoZSBjb2xsZWN0aW9uXG5cbiAgICAgICAgICAgIGlmICghY29sbGVjdGlvbk5vZGUuYm9keVtrZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgZmllbGQgb3IgYW5vdGhlciByZWR1Y2VyIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAocmVkdWNlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIGFub3RoZXIgcmVkdWNlclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihrZXksIHJlZHVjZXIsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkRmllbGQoa2V5LCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0iXX0=
