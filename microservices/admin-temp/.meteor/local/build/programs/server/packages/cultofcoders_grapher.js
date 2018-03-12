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
var ids, what, params, body, cacher, dotize;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:grapher":{"main.server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/main.server.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    NamedQueryStore: () => NamedQueryStore,
    LinkConstants: () => LinkConstants
});
module.watch(require("./lib/createQuery.js"), {
    default(v) {
        exports.createQuery = v;
    }

}, 2);
module.watch(require("./lib/exposure/exposure.js"), {
    default(v) {
        exports.Exposure = v;
    }

}, 3);
module.watch(require("./lib/namedQuery/cache/MemoryResultCacher"), {
    default(v) {
        exports.MemoryResultCacher = v;
    }

}, 4);
module.watch(require("./lib/namedQuery/cache/BaseResultCacher"), {
    default(v) {
        exports.BaseResultCacher = v;
    }

}, 5);
module.watch(require("./lib/compose"), {
    default(v) {
        exports.compose = v;
    }

}, 6);
module.watch(require("./lib/extension.js"));
module.watch(require("./lib/aggregate"));
module.watch(require("./lib/exposure/extension.js"));
module.watch(require("./lib/links/extension.js"));
module.watch(require("./lib/query/reducers/extension.js"));
module.watch(require("./lib/namedQuery/expose/extension.js"));
let NamedQueryStore;
module.watch(require("./lib/namedQuery/store"), {
    default(v) {
        NamedQueryStore = v;
    }

}, 0);
let LinkConstants;
module.watch(require("./lib/links/constants"), {
    default(v) {
        LinkConstants = v;
    }

}, 1);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"aggregate.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/aggregate.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Mongo.Collection.prototype.aggregate = function (pipelines, options) {
    const coll = this.rawCollection();
    return Meteor.wrapAsync(coll.aggregate, coll)(pipelines, options);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"compose.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/compose.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let deepExtend;
module.watch(require("deep-extend"), {
    default(v) {
        deepExtend = v;
    }

}, 0);
module.exportDefault(function (...args) {
    return deepExtend({}, ...args);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createQuery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/createQuery.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Query;
module.watch(require("./query/query.js"), {
    default(v) {
        Query = v;
    }

}, 0);
let NamedQuery;
module.watch(require("./namedQuery/namedQuery.js"), {
    default(v) {
        NamedQuery = v;
    }

}, 1);
let NamedQueryStore;
module.watch(require("./namedQuery/store.js"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/extension.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Query;
module.watch(require("./query/query.js"), {
    default(v) {
        Query = v;
    }

}, 0);
let NamedQuery;
module.watch(require("./namedQuery/namedQuery.js"), {
    default(v) {
        NamedQuery = v;
    }

}, 1);
let NamedQueryStore;
module.watch(require("./namedQuery/store.js"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure":{"exposure.config.schema.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/exposure.config.schema.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    ExposureDefaults: () => ExposureDefaults,
    ExposureSchema: () => ExposureSchema,
    validateBody: () => validateBody
});
let createGraph;
module.watch(require("../query/lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 0);
let Match;
module.watch(require("meteor/check"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"exposure.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/exposure.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => Exposure
});
let genCountEndpoint;
module.watch(require("../query/counts/genEndpoint.server.js"), {
    default(v) {
        genCountEndpoint = v;
    }

}, 0);
let createGraph;
module.watch(require("../query/lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 1);
let recursiveCompose;
module.watch(require("../query/lib/recursiveCompose.js"), {
    default(v) {
        recursiveCompose = v;
    }

}, 2);
let hypernova;
module.watch(require("../query/hypernova/hypernova.js"), {
    default(v) {
        hypernova = v;
    }

}, 3);
let ExposureSchema, ExposureDefaults, validateBody;
module.watch(require("./exposure.config.schema.js"), {
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
module.watch(require("./lib/enforceMaxDepth.js"), {
    default(v) {
        enforceMaxDepth = v;
    }

}, 5);
let enforceMaxLimit;
module.watch(require("./lib/enforceMaxLimit.js"), {
    default(v) {
        enforceMaxLimit = v;
    }

}, 6);
let cleanBody;
module.watch(require("./lib/cleanBody.js"), {
    default(v) {
        cleanBody = v;
    }

}, 7);
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 8);
let restrictFieldsFn;
module.watch(require("./lib/restrictFields.js"), {
    default(v) {
        restrictFieldsFn = v;
    }

}, 9);
let restrictLinks;
module.watch(require("./lib/restrictLinks.js"), {
    default(v) {
        restrictLinks = v;
    }

}, 10);
let check;
module.watch(require("meteor/check"), {
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
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
       * Initializes the reactive endpoint to retrieve the count of the data.
       */

    initCountPublication() {
        const collection = this.collection;
        genCountEndpoint(this.name, {
            getCursor(session) {
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
    } /**
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
    } /**
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

;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/extension.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Exposure;
module.watch(require("./exposure.js"), {
    default(v) {
        Exposure = v;
    }

}, 0);

_.extend(Mongo.Collection.prototype, {
    expose(config) {
        if (!Meteor.isServer) {
            throw new Meteor.Error('not-allowed', `You can only expose a collection server side. ${this._name}`);
        }

        new Exposure(this, config);
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanBody.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanBody.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => cleanBody
});
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 0);
let cleanFilters, cleanOptions;
module.watch(require("./cleanSelectors"), {
    cleanFilters(v) {
        cleanFilters = v;
    },

    cleanOptions(v) {
        cleanOptions = v;
    }

}, 1);
let dotize;
module.watch(require("../../query/lib/dotize"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanSelectors.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/cleanSelectors.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxDepth.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxDepth.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"enforceMaxLimit.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/enforceMaxLimit.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictFields.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictFields.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => restrictFields
});
const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not']; /**
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
 */function cleanFilters(filters, restrictedFields) {
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
} /**
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
} /**
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
} /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"restrictLinks.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/exposure/lib/restrictLinks.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"links":{"config.schema.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/config.schema.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    DenormalizeSchema: () => DenormalizeSchema,
    LinkConfigDefaults: () => LinkConfigDefaults,
    LinkConfigSchema: () => LinkConfigSchema
});
let Match;
module.watch(require("meteor/check"), {
    Match(v) {
        Match = v;
    }

}, 0);
let Mongo;
module.watch(require("meteor/mongo"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/constants.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  LINK_STORAGE: () => LINK_STORAGE
});
const LINK_STORAGE = '__links';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extension.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/extension.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.watch(require("meteor/mongo"), {
    Mongo(v) {
        Mongo = v;
    }

}, 0);
let LINK_STORAGE;
module.watch(require("./constants.js"), {
    LINK_STORAGE(v) {
        LINK_STORAGE = v;
    }

}, 1);
let Linker;
module.watch(require("./linker.js"), {
    default(v) {
        Linker = v;
    }

}, 2);

_.extend(Mongo.Collection.prototype, {
    /**
     * The data we add should be valid for config.schema.js
     */addLinks(data) {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linker.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linker.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => Linker
});
let LinkMany;
module.watch(require("./linkTypes/linkMany.js"), {
    default(v) {
        LinkMany = v;
    }

}, 0);
let LinkManyMeta;
module.watch(require("./linkTypes/linkManyMeta.js"), {
    default(v) {
        LinkManyMeta = v;
    }

}, 1);
let LinkOne;
module.watch(require("./linkTypes/linkOne.js"), {
    default(v) {
        LinkOne = v;
    }

}, 2);
let LinkOneMeta;
module.watch(require("./linkTypes/linkOneMeta.js"), {
    default(v) {
        LinkOneMeta = v;
    }

}, 3);
let LinkConfigSchema, LinkConfigDefaults;
module.watch(require("./config.schema.js"), {
    LinkConfigSchema(v) {
        LinkConfigSchema = v;
    },

    LinkConfigDefaults(v) {
        LinkConfigDefaults = v;
    }

}, 4);
let smartArguments;
module.watch(require("./linkTypes/lib/smartArguments"), {
    default(v) {
        smartArguments = v;
    }

}, 5);
let dot;
module.watch(require("dot-object"), {
    default(v) {
        dot = v;
    }

}, 6);
let check;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    }

}, 7);

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 8);

class Linker {
    /**
     * @param mainCollection
     * @param linkName
     * @param linkConfig
     */constructor(mainCollection, linkName, linkConfig) {
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
    } /**
       * Values which represent for the relation a single link
       * @returns {string[]}
       */

    get oneTypes() {
        return ['one', '1'];
    } /**
       * Returns the strategies: one, many, one-meta, many-meta
       * @returns {string}
       */

    get strategy() {
        let strategy = this.isMany() ? 'many' : 'one';

        if (this.linkConfig.metadata) {
            strategy += '-meta';
        }

        return strategy;
    } /**
       * Returns the field name in the document where the actual relationships are stored.
       * @returns string
       */

    get linkStorageField() {
        if (this.isVirtual()) {
            return this.linkConfig.relatedLinker.linkStorageField;
        }

        return this.linkConfig.field;
    } /**
       * The collection that is linked with the current collection
       * @returns Mongo.Collection
       */

    getLinkedCollection() {
        return this.linkConfig.collection;
    } /**
       * If the relationship for this link is of "many" type.
       */

    isMany() {
        return !this.isSingle();
    } /**
       * If the relationship for this link contains metadata
       */

    isMeta() {
        if (this.isVirtual()) {
            return this.linkConfig.relatedLinker.isMeta();
        }

        return !!this.linkConfig.metadata;
    } /**
       * @returns {boolean}
       */

    isSingle() {
        if (this.isVirtual()) {
            return this.linkConfig.relatedLinker.isSingle();
        }

        return _.contains(this.oneTypes, this.linkConfig.type);
    } /**
       * @returns {boolean}
       */

    isVirtual() {
        return !!this.linkConfig.inversedBy;
    } /**
       * Should return a single result.
       */

    isOneResult() {
        return this.isVirtual() && this.linkConfig.relatedLinker.linkConfig.unique || !this.isVirtual() && this.isSingle();
    } /**
       * @param object
       * @param collection To impersonate the getLinkedCollection() of the "Linker"
       *
       * @returns {LinkOne|LinkMany|LinkManyMeta|LinkOneMeta|LinkResolve}
       */

    createLink(object, collection = null) {
        let helperClass = this._getHelperClass();

        return new helperClass(this, object, collection);
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
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

            let accessor = this.createLink(doc);

            _.each(accessor.fetch(), linkedObj => {
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
                    if (this.isMany()) {
                        throw new Meteor.Error('You cannot set unique property on a multi field.');
                    }

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

                    if (this.isMany()) {
                        throw new Meteor.Error('You cannot set unique property on a multi field.');
                    }

                    this.mainCollection._ensureIndex({
                        [field]: 1
                    }, {
                        unique: true
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
    } /**
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
    } /**
       * Verifies if this linker is denormalized. It can be denormalized from the inverse side as well.
       *
       * @returns {boolean}
       * @private
       */

    isDenormalized() {
        return !!this.linkConfig.denormalize;
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"createSearchFilters.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/lib/createSearchFilters.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
module.watch(require("sift"), {
    default(v) {
        sift = v;
    }

}, 0);

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
        _id: object[fieldStorage]
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"linkTypes":{"base.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/base.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => Link
});
let SmartArgs;
module.watch(require("./lib/smartArguments.js"), {
    default(v) {
        SmartArgs = v;
    }

}, 0);
let createSearchFilters;
module.watch(require("../lib/createSearchFilters"), {
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
    } /**
       * Gets the stored link information value
       * @returns {*}
       */

    value() {
        if (this.isVirtual) {
            throw new Meteor.Error('You can only take the value from the main link.');
        }

        return this.object[this.linkStorageField];
    } /**
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
    } /**
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
    } /**
       * When we are dealing with multiple type relationships, $in would require an array. If the field value is null, it will fail
       * We use clean to make it an empty array by default.
       */

    clean() {} /**
                * Extracts a single id
                */

    identifyId(what, saveToDatabase) {
        return SmartArgs.getId(what, {
            saveToDatabase,
            collection: this.linkedCollection
        });
    } /**
       * Extracts the ids of object(s) or strings and returns an array.
       */

    identifyIds(what, saveToDatabase) {
        return SmartArgs.getIds(what, {
            saveToDatabase,
            collection: this.linkedCollection
        });
    } /**
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
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkMany.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkMany.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => LinkMany
});
let Link;
module.watch(require("./base.js"), {
    default(v) {
        Link = v;
    }

}, 0);
let SmartArgs;
module.watch(require("./lib/smartArguments.js"), {
    default(v) {
        SmartArgs = v;
    }

}, 1);

class LinkMany extends Link {
    clean() {
        if (!this.object[this.linkStorageField]) {
            this.object[this.linkStorageField] = [];
        }
    } /**
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
    } /**
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

        const _ids = this.identifyIds(what); // update the field


        this.object[field] = _.filter(this.object[field], _id => !_.contains(_ids, _id)); // update the db

        let modifier = {
            $pullAll: {
                [field]: _ids
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkManyMeta.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkManyMeta.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => LinkManyMeta
});
let Link;
module.watch(require("./base.js"), {
    default(v) {
        Link = v;
    }

}, 0);
let SmartArgs;
module.watch(require("./lib/smartArguments.js"), {
    default(v) {
        SmartArgs = v;
    }

}, 1);

class LinkManyMeta extends Link {
    clean() {
        if (!this.object[this.linkStorageField]) {
            this.object[this.linkStorageField] = [];
        }
    } /**
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
    } /**
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
                    $elemMatch: {
                        _id: {
                            $in: _ids
                        }
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOne.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOne.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => LinkOne
});
let Link;
module.watch(require("./base.js"), {
    default(v) {
        Link = v;
    }

}, 0);
let SmartArgs;
module.watch(require("./lib/smartArguments.js"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"linkOneMeta.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/linkOneMeta.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => LinkOneMeta
});
let Link;
module.watch(require("./base.js"), {
    default(v) {
        Link = v;
    }

}, 0);
let SmartArgs;
module.watch(require("./lib/smartArguments.js"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"smartArguments.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/links/linkTypes/lib/smartArguments.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"namedQuery":{"namedQuery.base.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.base.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => NamedQueryBase
});
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 0);

class NamedQueryBase {
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
        this.options = options;
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
    } /**
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

        let clone = new this.constructor(this.queryName, this.collection, this.isResolver ? this.resolver : deepClone(this.body), (0, _extends3.default)({}, this.options, {
            params
        }));
        clone.cacher = this.cacher;

        if (this.exposeConfig) {
            clone.exposeConfig = this.exposeConfig;
        }

        return clone;
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.client.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.client.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let CountSubscription;
module.watch(require("../query/counts/countSubscription"), {
    default(v) {
        CountSubscription = v;
    }

}, 0);
let createGraph;
module.watch(require("../query/lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 1);
let recursiveFetch;
module.watch(require("../query/lib/recursiveFetch.js"), {
    default(v) {
        recursiveFetch = v;
    }

}, 2);
let prepareForProcess;
module.watch(require("../query/lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 3);

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 4);
let callWithPromise;
module.watch(require("../query/lib/callWithPromise"), {
    default(v) {
        callWithPromise = v;
    }

}, 5);
let Base;
module.watch(require("./namedQuery.base"), {
    default(v) {
        Base = v;
    }

}, 6);
module.exportDefault(class extends Base {
    /**
     * Subscribe
     *
     * @param callback
     * @returns {null|any|*}
     */subscribe(callback) {
        if (this.isResolver) {
            throw new Meteor.Error('not-allowed', `You cannot subscribe to a resolver query`);
        }

        this.subscriptionHandle = Meteor.subscribe(this.name, this.params, callback);
        return this.subscriptionHandle;
    } /**
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
    } /**
       * Unsubscribe if an existing subscription exists
       */

    unsubscribe() {
        if (this.subscriptionHandle) {
            this.subscriptionHandle.stop();
        }

        this.subscriptionHandle = null;
    } /**
       * Unsubscribe to the counts if a subscription exists.
       */

    unsubscribeCount() {
        if (this._counter) {
            this._counter.unsubscribe();

            this._counter = null;
        }
    } /**
       * Fetches elements in sync using promises
       * @return {*}
       */

    fetchSync() {
        return Promise.asyncApply(() => {
            if (this.subscriptionHandle) {
                throw new Meteor.Error('This query is reactive, meaning you cannot use promises to fetch the data.');
            }

            return Promise.await(callWithPromise(this.name, prepareForProcess(this.body, this.params)));
        });
    } /**
       * Fetches one element in sync
       * @return {*}
       */

    fetchOneSync() {
        return Promise.asyncApply(() => {
            return _.first(Promise.await(this.fetchSync()));
        });
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
       * Fetching non-reactive queries
       * @param callback
       * @private
       */

    _fetchStatic(callback) {
        if (!callback) {
            throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
        }

        Meteor.call(this.name, this.params, callback);
    } /**
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

        return recursiveFetch(createGraph(this.collection, body));
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let NamedQueryClient;
module.watch(require("./namedQuery.client"), {
    default(v) {
        NamedQueryClient = v;
    }

}, 0);
let NamedQueryServer;
module.watch(require("./namedQuery.server"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"namedQuery.server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/namedQuery.server.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let prepareForProcess;
module.watch(require("../query/lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 0);
let Base;
module.watch(require("./namedQuery.base"), {
    default(v) {
        Base = v;
    }

}, 1);
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 2);
let MemoryResultCacher;
module.watch(require("./cache/MemoryResultCacher"), {
    default(v) {
        MemoryResultCacher = v;
    }

}, 3);
let intersectDeep;
module.watch(require("../query/lib/intersectDeep"), {
    default(v) {
        intersectDeep = v;
    }

}, 4);
module.exportDefault(class extends Base {
    /**
     * Retrieves the data.
     * @returns {*}
     */fetch(context) {
        this._performSecurityChecks(context, this.params);

        if (this.isResolver) {
            return this._fetchResolverData(context);
        } else {
            body = deepClone(this.body);

            if (this.params.$body) {
                body = intersectDeep(body, this.params.$body);
            } // we must apply emobdyment here


            this.doEmbodimentIfItApplies(body);
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
    } /**
       * @param args
       * @returns {*}
       */

    fetchOne(...args) {
        return _.first(this.fetch(...args));
    } /**
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
    } /**
       * Returns the cursor for counting
       * This is most likely used for counts cursor
       */

    getCursorForCounting() {
        let body = deepClone(this.body);
        this.doEmbodimentIfItApplies(body);
        body = prepareForProcess(body, this.params);
        return this.collection.find(body.$filters || {}, {
            fields: {
                _id: 1
            }
        });
    } /**
       * @param cacher
       */

    cacheResults(cacher) {
        if (!cacher) {
            cacher = new MemoryResultCacher();
        }

        this.cacher = cacher;
    } /**
       * Configure resolve. This doesn't actually call the resolver, it just sets it
       * @param fn
       */

    resolve(fn) {
        if (!this.isResolver) {
            throw new Meteor.Error('invalid-call', `You cannot use resolve() on a non resolver NamedQuery`);
        }

        this.resolver = fn;
    } /**
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
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"store.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/store.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cache":{"BaseResultCacher.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/cache/BaseResultCacher.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => BaseResultCacher
});
let EJSON;
module.watch(require("meteor/ejson"), {
    EJSON(v) {
        EJSON = v;
    }

}, 0);

class BaseResultCacher {
    constructor(config = {}) {
        this.config = config;
    } /**
       * @param queryName
       * @param params
       * @returns {string}
       */

    generateQueryId(queryName, params) {
        return `${queryName}::${EJSON.stringify(params)}`;
    } /**
       * Dummy function
       */

    fetch(cacheId, {
        query,
        countCursor
    }) {
        throw 'Not implemented';
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"MemoryResultCacher.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/cache/MemoryResultCacher.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => MemoryResultCacher
});
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 0);
let cloneDeep;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        cloneDeep = v;
    }

}, 1);
let BaseResultCacher;
module.watch(require("./BaseResultCacher"), {
    default(v) {
        BaseResultCacher = v;
    }

}, 2);
const DEFAULT_TTL = 60000; /**
                            * This is a very basic in-memory result caching functionality
                            */

class MemoryResultCacher extends BaseResultCacher {
    constructor(config = {}) {
        super(config);
        this.store = {};
    } /**
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
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"expose":{"extension.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/expose/extension.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let NamedQuery;
module.watch(require("../namedQuery.js"), {
    default(v) {
        NamedQuery = v;
    }

}, 0);
let ExposeSchema, ExposeDefaults;
module.watch(require("./schema.js"), {
    ExposeSchema(v) {
        ExposeSchema = v;
    },

    ExposeDefaults(v) {
        ExposeDefaults = v;
    }

}, 1);
let mergeDeep;
module.watch(require("./lib/mergeDeep.js"), {
    default(v) {
        mergeDeep = v;
    }

}, 2);
let createGraph;
module.watch(require("../../query/lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 3);
let recursiveCompose;
module.watch(require("../../query/lib/recursiveCompose.js"), {
    default(v) {
        recursiveCompose = v;
    }

}, 4);
let prepareForProcess;
module.watch(require("../../query/lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 5);
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 6);
let intersectDeep;
module.watch(require("../../query/lib/intersectDeep"), {
    default(v) {
        intersectDeep = v;
    }

}, 7);
let genCountEndpoint;
module.watch(require("../../query/counts/genEndpoint.server"), {
    default(v) {
        genCountEndpoint = v;
    }

}, 8);
let check;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    }

}, 9);

_.extend(NamedQuery.prototype, {
    /**
     * @param config
     */expose(config = {}) {
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
     */_initNormalQuery() {
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
     */doEmbodimentIfItApplies(body) {
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
            embody.call(this, body, this.params);
        } else {
            mergeDeep(body, embody);
        }
    },

    /**
     * @private
     */_initMethod() {
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
     */_initCountMethod() {
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
     */_initCountPublication() {
        const self = this;
        genCountEndpoint(self.name, {
            getCursor(session) {
                const query = self.clone(session.params);
                return query.getCursorForCounting();
            },

            getSession(newParams) {
                self.doValidateParams(newParams);

                self._callFirewall(this, this.userId, params);

                return {
                    params: newParams
                };
            }

        });
    },

    /**
     * @private
     */_initPublication() {
        const self = this;
        Meteor.publishComposite(this.name, function (params = {}) {
            self._unblockIfNecessary(this);

            self.doValidateParams(params);

            self._callFirewall(this, this.userId, params);

            let body = deepClone(self.body);

            if (params.$body) {
                body = intersectDeep(body, params.$body);
            }

            self.doEmbodimentIfItApplies(body);
            body = prepareForProcess(body, params);
            const rootNode = createGraph(self.collection, body);
            return recursiveCompose(rootNode);
        });
    },

    /**
     * @param context
     * @param userId
     * @param params
     * @private
     */_callFirewall(context, userId, params) {
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
     */_unblockIfNecessary(context) {
        if (this.exposeConfig.unblock) {
            if (context.unblock) {
                context.unblock();
            }
        }
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"schema.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/expose/schema.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    ExposeDefaults: () => ExposeDefaults,
    ExposeSchema: () => ExposeSchema
});
let Match;
module.watch(require("meteor/check"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"mergeDeep.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/namedQuery/expose/lib/mergeDeep.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"query":{"query.base.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/query.base.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => QueryBase
});
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 0);
let check;
module.watch(require("meteor/check"), {
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

        return new this.constructor(this.collection, deepClone(this.body), (0, _extends3.default)({
            params
        }, this.options));
    }

    get name() {
        return `exposure_${this.collection._name}`;
    } /**
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
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.client.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/query.client.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => Query
});

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 0);
let CountSubscription;
module.watch(require("./counts/countSubscription"), {
    default(v) {
        CountSubscription = v;
    }

}, 1);
let createGraph;
module.watch(require("./lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 2);
let recursiveFetch;
module.watch(require("./lib/recursiveFetch.js"), {
    default(v) {
        recursiveFetch = v;
    }

}, 3);
let prepareForProcess;
module.watch(require("./lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 4);
let callWithPromise;
module.watch(require("./lib/callWithPromise"), {
    default(v) {
        callWithPromise = v;
    }

}, 5);
let Base;
module.watch(require("./query.base"), {
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
     */subscribe(callback) {
        this.doValidateParams();
        this.subscriptionHandle = Meteor.subscribe(this.name, prepareForProcess(this.body, this.params), callback);
        return this.subscriptionHandle;
    } /**
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
    } /**
       * Unsubscribe if an existing subscription exists
       */

    unsubscribe() {
        if (this.subscriptionHandle) {
            this.subscriptionHandle.stop();
        }

        this.subscriptionHandle = null;
    } /**
       * Unsubscribe to the counts if a subscription exists.
       */

    unsubscribeCount() {
        if (this._counter) {
            this._counter.unsubscribe();

            this._counter = null;
        }
    } /**
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
    } /**
       * Fetches one element in sync
       * @return {*}
       */

    fetchOneSync() {
        return Promise.asyncApply(() => {
            return _.first(Promise.await(this.fetchSync()));
        });
    } /**
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
    } /**
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
    } /**
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
    } /**
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
    } /**
       * Fetching non-reactive queries
       * @param callback
       * @private
       */

    _fetchStatic(callback) {
        if (!callback) {
            throw new Meteor.Error('not-allowed', 'You are on client so you must either provide a callback to get the data or subscribe first.');
        }

        Meteor.call(this.name, prepareForProcess(this.body, this.params), callback);
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/query.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let QueryClient;
module.watch(require("./query.client"), {
    default(v) {
        QueryClient = v;
    }

}, 0);
let QueryServer;
module.watch(require("./query.server"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"query.server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/query.server.js                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => Query
});
let createGraph;
module.watch(require("./lib/createGraph.js"), {
    default(v) {
        createGraph = v;
    }

}, 0);
let prepareForProcess;
module.watch(require("./lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 1);
let hypernova;
module.watch(require("./hypernova/hypernova.js"), {
    default(v) {
        hypernova = v;
    }

}, 2);
let Base;
module.watch(require("./query.base"), {
    default(v) {
        Base = v;
    }

}, 3);

class Query extends Base {
    /**
     * Retrieves the data.
     * @param context
     * @returns {*}
     */fetch(context = {}) {
        const node = createGraph(this.collection, prepareForProcess(this.body, this.params));
        return hypernova(node, context.userId, {
            params: this.params
        });
    } /**
       * @param args
       * @returns {*}
       */

    fetchOne(...args) {
        return _.first(this.fetch(...args));
    } /**
       * Gets the count of matching elements.
       * @returns {integer}
       */

    getCount() {
        return this.collection.find(this.body.$filters || {}, {}).count();
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"counts":{"collection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/counts/collection.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.watch(require("meteor/mongo"), {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let COUNTS_COLLECTION_CLIENT;
module.watch(require("./constants"), {
  COUNTS_COLLECTION_CLIENT(v) {
    COUNTS_COLLECTION_CLIENT = v;
  }

}, 1);
module.exportDefault(new Mongo.Collection(COUNTS_COLLECTION_CLIENT));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/counts/constants.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  COUNTS_COLLECTION_CLIENT: () => COUNTS_COLLECTION_CLIENT
});
const COUNTS_COLLECTION_CLIENT = 'grapher_counts';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"countSubscription.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/counts/countSubscription.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => CountSubscription
});
let EJSON;
module.watch(require("meteor/ejson"), {
    EJSON(v) {
        EJSON = v;
    }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 1);
let ReactiveVar;
module.watch(require("meteor/reactive-var"), {
    ReactiveVar(v) {
        ReactiveVar = v;
    }

}, 2);
let Tracker;
module.watch(require("meteor/tracker"), {
    Tracker(v) {
        Tracker = v;
    }

}, 3);
let Counts;
module.watch(require("./collection"), {
    default(v) {
        Counts = v;
    }

}, 4);
let createFauxSubscription;
module.watch(require("./createFauxSubscription"), {
    default(v) {
        createFauxSubscription = v;
    }

}, 5);
let prepareForProcess;
module.watch(require("../lib/prepareForProcess.js"), {
    default(v) {
        prepareForProcess = v;
    }

}, 6);
let NamedQueryBase;
module.watch(require("../../namedQuery/namedQuery.base"), {
    default(v) {
        NamedQueryBase = v;
    }

}, 7);

class CountSubscription {
    /**
     * @param {*} query - The query to use when fetching counts
     */constructor(query) {
        this.accessToken = new ReactiveVar(null);
        this.fauxHandle = null;
        this.query = query;
    } /**
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
    } /**
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
    } /**
       * Reactively fetch current document count. Returns null if the subscription is not ready yet.
       *
       * @returns {Number|null} - Current document count
       */

    getCount() {
        const id = this.accessToken.get();
        if (id === null) return null;
        const doc = Counts.findOne(id);
        return doc.count;
    } /**
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
    } /**
       * Returns whether or not a subscription request has been made.
       */

    isSubscribed() {
        return this.accessToken.get() !== null;
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createFauxSubscription.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/counts/createFauxSubscription.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exportDefault(countManager => ({
  ready: () => countManager.accessToken.get() !== null && countManager.subscriptionHandle.ready(),
  stop: () => countManager.unsubscribe()
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"genEndpoint.server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/counts/genEndpoint.server.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let check;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 1);
let Mongo;
module.watch(require("meteor/mongo"), {
    Mongo(v) {
        Mongo = v;
    }

}, 2);
let COUNTS_COLLECTION_CLIENT;
module.watch(require("./constants"), {
    COUNTS_COLLECTION_CLIENT(v) {
        COUNTS_COLLECTION_CLIENT = v;
    }

}, 3);
// XXX: Should this persist between server restarts?
const collection = new Mongo.Collection(null); /**
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
            const existingSession = collection.findOne((0, _extends3.default)({}, session, {
                userId: this.userId
            })); // Try to reuse sessions if the user subscribes multiple times with the same data

            if (existingSession) {
                return existingSession._id;
            }

            const token = collection.insert((0, _extends3.default)({}, session, {
                query: name,
                userId: this.userId
            }));
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

        const cursor = getCursor.call(this, request); // Start counting

        let count = 0;
        self.added(COUNTS_COLLECTION_CLIENT, token, {
            count
        });
        const handle = cursor.observeChanges({
            added(id) {
                count++;
                self.changed(COUNTS_COLLECTION_CLIENT, token, {
                    count
                });
            },

            removed(id) {
                count--;
                self.changed(COUNTS_COLLECTION_CLIENT, token, {
                    count
                });
            }

        });
        self.onStop(() => {
            handle.stop();
            collection.remove(token);
        });
        self.ready();
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"hypernova":{"aggregateSearchFilters.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/aggregateSearchFilters.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => AggregateFilters
});
let sift;
module.watch(require("sift"), {
    default(v) {
        sift = v;
    }

}, 0);

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
                    $in: _.uniq(_.pluck(this.parentObjects, this.linkStorageField))
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
            const arrayOfIds = _.pluck(this.parentObjects, this.linkStorageField);

            return {
                _id: {
                    $in: _.uniq(_.union(...arrayOfIds))
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembleAggregateResults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/assembleAggregateResults.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let sift;
module.watch(require("sift"), {
    default(v) {
        sift = v;
    }

}, 0);
let cleanObjectForMetaFilters;
module.watch(require("./lib/cleanObjectForMetaFilters"), {
    default(v) {
        cleanObjectForMetaFilters = v;
    }

}, 1);
module.exportDefault(function (childCollectionNode, aggregateResults, metaFilters) {
    const linker = childCollectionNode.linker;
    const linkStorageField = linker.linkStorageField;
    const linkName = childCollectionNode.linkName;
    const isMeta = linker.isMeta();
    let allResults = [];

    if (isMeta && metaFilters) {
        const metaFiltersTest = sift(metaFilters);

        _.each(childCollectionNode.parent.results, parentResult => {
            cleanObjectForMetaFilters(parentResult, linkStorageField, metaFiltersTest);
        });
    }

    if (isMeta && linker.isMany()) {
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
        _.each(aggregateResults, aggregateResult => {
            let parentResult = _.find(childCollectionNode.parent.results, result => {
                return result._id == aggregateResult._id;
            });

            if (parentResult) {
                parentResult[childCollectionNode.linkName] = aggregateResult.data;
            }

            _.each(aggregateResult.data, item => {
                allResults.push(item);
            });
        });
    }

    childCollectionNode.results = allResults;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"assembler.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/assembler.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let createSearchFilters;
module.watch(require("../../links/lib/createSearchFilters"), {
    default(v) {
        createSearchFilters = v;
    }

}, 0);
let cleanObjectForMetaFilters;
module.watch(require("./lib/cleanObjectForMetaFilters"), {
    default(v) {
        cleanObjectForMetaFilters = v;
    }

}, 1);
let sift;
module.watch(require("sift"), {
    default(v) {
        sift = v;
    }

}, 2);
module.exportDefault((childCollectionNode, {
    limit,
    skip,
    metaFilters
}) => {
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

    _.each(parent.results, result => {
        let data = assembleData(childCollectionNode, result, {
            fieldStorage,
            strategy,
            isSingle
        });
        result[childCollectionNode.linkName] = filterAssembledData(data, {
            limit,
            skip
        });
    });
});

function filterAssembledData(data, {
    limit,
    skip
}) {
    if (limit) {
        return data.slice(skip, limit);
    }

    return data;
}

function assembleData(childCollectionNode, result, {
    fieldStorage,
    strategy
}) {
    const filters = createSearchFilters(result, fieldStorage, strategy, false);
    return sift(filters, childCollectionNode.results);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"buildAggregatePipeline.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/buildAggregatePipeline.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 0);
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

        const safeField = field.replace('.', '___');
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/constants.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  SAFE_DOTTED_FIELD_REPLACEMENT: () => SAFE_DOTTED_FIELD_REPLACEMENT
});
const SAFE_DOTTED_FIELD_REPLACEMENT = '___';
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"hypernova.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/hypernova.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => hypernovaInit
});
let applyProps;
module.watch(require("../lib/applyProps.js"), {
    default(v) {
        applyProps = v;
    }

}, 0);
let prepareForDelivery;
module.watch(require("../lib/prepareForDelivery.js"), {
    default(v) {
        prepareForDelivery = v;
    }

}, 1);
let storeHypernovaResults;
module.watch(require("./storeHypernovaResults.js"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"storeHypernovaResults.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/storeHypernovaResults.js                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
    default: () => storeHypernovaResults
});
let applyProps;
module.watch(require("../lib/applyProps.js"), {
    default(v) {
        applyProps = v;
    }

}, 0);
let AggregateFilters;
module.watch(require("./aggregateSearchFilters.js"), {
    default(v) {
        AggregateFilters = v;
    }

}, 1);
let assemble;
module.watch(require("./assembler.js"), {
    default(v) {
        assemble = v;
    }

}, 2);
let assembleAggregateResults;
module.watch(require("./assembleAggregateResults.js"), {
    default(v) {
        assembleAggregateResults = v;
    }

}, 3);
let buildAggregatePipeline;
module.watch(require("./buildAggregatePipeline.js"), {
    default(v) {
        buildAggregatePipeline = v;
    }

}, 4);
let snapBackDottedFields;
module.watch(require("./lib/snapBackDottedFields"), {
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
        assemble(childCollectionNode, (0, _extends3.default)({}, options, {
            metaFilters
        }));
    } else {
        // virtuals arrive here
        let {
            pipeline,
            containsDottedFields
        } = buildAggregatePipeline(childCollectionNode, filters, options, userId);
        let aggregateResults = collection.aggregate(pipeline, {
            explains: true
        }); /**
             * If in aggregation it contains '.', we replace it with a custom string '___'
             * And then after aggregation is complete we need to snap-it back to how it was.
             */

        if (containsDottedFields) {
            snapBackDottedFields(aggregateResults);
        }

        assembleAggregateResults(childCollectionNode, aggregateResults, metaFilters);
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"cleanObjectForMetaFilters.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/cleanObjectForMetaFilters.js                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"snapBackDottedFields.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/hypernova/lib/snapBackDottedFields.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let SAFE_DOTTED_FIELD_REPLACEMENT;
module.watch(require("../constants"), {
    SAFE_DOTTED_FIELD_REPLACEMENT(v) {
        SAFE_DOTTED_FIELD_REPLACEMENT = v;
    }

}, 0);
let dot;
module.watch(require("dot-object"), {
    default(v) {
        dot = v;
    }

}, 1);
module.exportDefault(function (aggregationResult) {
    aggregationResult.forEach(result => {
        result.data = result.data.map(document => {
            _.each(document, (value, key) => {
                if (key.indexOf(SAFE_DOTTED_FIELD_REPLACEMENT) >= 0) {
                    document[key.replace(SAFE_DOTTED_FIELD_REPLACEMENT, '.')] = value;
                    delete document[key];
                }
            });

            return dot.object(document);
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"lib":{"applyProps.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/applyProps.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"callWithPromise.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/callWithPromise.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exportDefault((method, myParameters) => {
    return new Promise((resolve, reject) => {
        Meteor.call(method, myParameters, (err, res) => {
            if (err) reject(err.reason || 'Something went wrong.');
            resolve(res);
        });
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createGraph.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/createGraph.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    createNodes: () => createNodes,
    addFieldNode: () => addFieldNode
});
let CollectionNode;
module.watch(require("../nodes/collectionNode.js"), {
    default(v) {
        CollectionNode = v;
    }

}, 0);
let FieldNode;
module.watch(require("../nodes/fieldNode.js"), {
    default(v) {
        FieldNode = v;
    }

}, 1);
let ReducerNode;
module.watch(require("../nodes/reducerNode.js"), {
    default(v) {
        ReducerNode = v;
    }

}, 2);
let dotize;
module.watch(require("./dotize.js"), {
    default(v) {
        dotize = v;
    }

}, 3);
let createReducers;
module.watch(require("../reducers/lib/createReducers"), {
    default(v) {
        createReducers = v;
    }

}, 4);
const specialFields = ['$filters', '$options', '$postFilters', '$postOptions', '$postFilter']; /**
                                                                                                * Creates node objects from the body. The root is always a collection node.
                                                                                                *
                                                                                                * @param root
                                                                                                */

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

            let subroot = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
            root.add(subroot, linker);
            createNodes(subroot);
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

function addFieldNode(body, fieldName, root) {
    // it's not a link and not a special variable => we assume it's a field
    if (_.isObject(body)) {
        let dotted = dotize.convert({
            [fieldName]: body
        });

        _.each(dotted, (value, key) => {
            root.add(new FieldNode(key, value));
        });
    } else {
        let fieldNode = new FieldNode(fieldName, body);
        root.add(fieldNode);
    }
}

module.exportDefault(function (collection, body) {
    let root = new CollectionNode(collection, body);
    createNodes(root);
    return root;
});
; /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dotize.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/dotize.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"intersectDeep.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/intersectDeep.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let dot;
module.watch(require("dot-object"), {
    default(v) {
        dot = v;
    }

}, 0);

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 1);
module.exportDefault(function (allowedBody, clientBody) {
    const allowedBodyDot = _.keys(dot.dot(allowedBody));

    const clientBodyDot = _.keys(dot.dot(clientBody));

    const intersection = _.intersection(allowedBodyDot, clientBodyDot);

    const build = {};
    intersection.forEach(intersectedField => {
        build[intersectedField] = 1;
    });
    return dot.object(build);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForDelivery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/prepareForDelivery.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    applyPostFilters: () => applyPostFilters,
    applyPostOptions: () => applyPostOptions,
    removeLinkStorages: () => removeLinkStorages,
    storeOneResults: () => storeOneResults,
    assembleMetadata: () => assembleMetadata
});
let applyReducers;
module.watch(require("../reducers/lib/applyReducers"), {
    default(v) {
        applyReducers = v;
    }

}, 0);
let cleanReducerLeftovers;
module.watch(require("../reducers/lib/cleanReducerLeftovers"), {
    default(v) {
        cleanReducerLeftovers = v;
    }

}, 1);
let sift;
module.watch(require("sift"), {
    default(v) {
        sift = v;
    }

}, 2);
let Minimongo;
module.watch(require("meteor/minimongo"), {
    Minimongo(v) {
        Minimongo = v;
    }

}, 3);
module.exportDefault((node, params) => {
    snapBackCaches(node);
    applyReducers(node, params);
    cleanReducerLeftovers(node);

    _.each(node.collectionNodes, collectionNode => {
        cloneMetaChildren(collectionNode, node.results);
    });

    _.each(node.collectionNodes, collectionNode => {
        assembleMetadata(collectionNode, node.results);
    });

    removeLinkStorages(node, node.results);
    storeOneResults(node, node.results);
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
 */function applyPostFilter(node, params) {
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

function removeLinkStorages(node, sameLevelResults) {
    if (!sameLevelResults) {
        return;
    }

    _.each(node.collectionNodes, collectionNode => {
        const removeStorageField = collectionNode.shouldCleanStorage;

        _.each(sameLevelResults, result => {
            if (removeStorageField) {
                delete result[collectionNode.linkStorageField];
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
            storeOneResults(collectionNode, result[collectionNode.linkName]);
        });

        if (collectionNode.isOneResult) {
            sameLevelResults.forEach(result => {
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
    const isMeta = node.isMeta;
    parentResults.forEach(parentResult => {
        if (isMeta && parentResult[linkName]) {
            parentResult[linkName] = parentResult[linkName].map(object => {
                return Object.assign({}, object);
            });
        }

        node.collectionNodes.forEach(collectionNode => {
            cloneMetaChildren(collectionNode, parentResult[linkName]);
        });
    });
}

function assembleMetadata(node, parentResults) {
    // assembling metadata is depth first
    node.collectionNodes.forEach(collectionNode => {
        _.each(parentResults, result => {
            assembleMetadata(collectionNode, result[node.linkName]);
        });
    });

    if (node.isMeta) {
        if (node.isVirtual) {
            _.each(parentResults, parentResult => {
                const childResult = parentResult[node.linkName];

                _.each(childResult, object => {
                    const storage = object[node.linkStorageField];
                    storeMetadata(object, parentResult, storage, true);
                });
            });
        } else {
            _.each(parentResults, parentResult => {
                const childResult = parentResult[node.linkName];
                const storage = parentResult[node.linkStorageField];

                _.each(childResult, object => {
                    storeMetadata(object, parentResult, storage, false);
                });
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"prepareForProcess.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/prepareForProcess.js                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let check, Match;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    },

    Match(v) {
        Match = v;
    }

}, 0);
let deepClone;
module.watch(require("lodash.clonedeep"), {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveCompose.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/recursiveCompose.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let applyProps;
module.watch(require("./applyProps.js"), {
    default(v) {
        applyProps = v;
    }

}, 0);

function compose(node, userId) {
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

                    _.extend(options.fields, {
                        [linker.linkStorageField]: 1
                    });
                }

                return accessor.find(filters, options, userId);
            }
        },

        children: _.map(node.collectionNodes, n => compose(n, userId))
    };
}

module.exportDefault((node, userId, config = {
    bypassFirewalls: false
}) => {
    return {
        find() {
            let {
                filters,
                options
            } = applyProps(node);
            return node.collection.find(filters, options, userId);
        },

        children: _.map(node.collectionNodes, n => {
            const userIdToPass = config.bypassFirewalls ? undefined : userId;
            return compose(n, userIdToPass);
        })
    };
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"recursiveFetch.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/lib/recursiveFetch.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let applyProps;
module.watch(require("./applyProps.js"), {
    default(v) {
        applyProps = v;
    }

}, 0);
let assembleMetadata, removeLinkStorages, storeOneResults;
module.watch(require("./prepareForDelivery"), {
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
module.watch(require("./prepareForDelivery"), {
    default(v) {
        prepareForDelivery = v;
    }

}, 2);

/**
 * This is always run client side to build the data graph out of client-side collections.
 *
 * @param node
 * @param parentObject
 * @returns {*}
 */function fetch(node, parentObject) {
    let {
        filters,
        options
    } = applyProps(node);
    let results = [];

    if (parentObject) {
        let accessor = node.linker.createLink(parentObject, node.collection);

        if (node.isVirtual) {
            options.fields = options.fields || {};

            _.extend(options.fields, {
                [node.linkStorageField]: 1
            });
        }

        results = accessor.find(filters, options).fetch();
    } else {
        results = node.collection.find(filters, options).fetch();
    }

    _.each(node.collectionNodes, collectionNode => {
        _.each(results, result => {
            result[collectionNode.linkName] = fetch(collectionNode, result); //delete result[node.linker.linkStorageField];
        });
    });

    return results;
}

module.exportDefault((node, params) => {
    node.results = fetch(node);
    prepareForDelivery(node, params);
    return node.results;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"nodes":{"collectionNode.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/nodes/collectionNode.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => CollectionNode
});
let FieldNode;
module.watch(require("./fieldNode.js"), {
    default(v) {
        FieldNode = v;
    }

}, 0);
let ReducerNode;
module.watch(require("./reducerNode.js"), {
    default(v) {
        ReducerNode = v;
    }

}, 1);
let deepClone;
module.watch(require("lodash.clonedeep"), {
    default(v) {
        deepClone = v;
    }

}, 2);
let check, Match;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    },

    Match(v) {
        Match = v;
    }

}, 3);

class CollectionNode {
    constructor(collection, body = {}, linkName = null) {
        if (collection && !_.isObject(body)) {
            throw new Meteor.Error('invalid-body', 'Every collection link should have its body defined as an object.');
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
    } /**
       * Adds children to itself
       *
       * @param node
       * @param linker
       */

    add(node, linker) {
        node.parent = this;

        if (linker) {
            node.linker = linker;
            node.linkStorageField = linker.linkStorageField;
            node.isMeta = linker.isMeta();
            node.isVirtual = linker.isVirtual();
            node.isOneResult = linker.isOneResult();
            node.shouldCleanStorage = this._shouldCleanStorage(node);
        }

        this.nodes.push(node);
    } /**
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
    } /**
       * @param _node
       */

    remove(_node) {
        this.nodes = _.filter(this.nodes, node => _node !== node);
    } /**
       * @param filters
       * @param options
       */

    applyFields(filters, options) {
        let hasAddedAnyField = false;

        _.each(this.fieldNodes, n => {
            hasAddedAnyField = true;
            n.applyFields(options.fields);
        }); // it will only get here if it has collectionNodes children


        _.each(this.collectionNodes, collectionNode => {
            let linker = collectionNode.linker;

            if (linker && !linker.isVirtual()) {
                options.fields[linker.linkStorageField] = 1;
                hasAddedAnyField = true;
            }
        }); // if he selected filters, we should automatically add those fields


        _.each(filters, (value, field) => {
            // special handling for the $meta filter and conditional operators
            if (!_.contains(['$or', '$nor', '$not', '$and', '$meta'], field)) {
                // if the field or the parent of the field already exists, don't add it
                if (!_.has(options.fields, field.split('.')[0])) {
                    hasAddedAnyField = true;
                    options.fields[field] = 1;
                }
            }
        });

        if (!hasAddedAnyField) {
            options.fields = {
                _id: 1
            };
        }
    } /**
       * @param fieldName
       * @returns {boolean}
       */

    hasField(fieldName) {
        return !!_.find(this.fieldNodes, fieldNode => {
            return fieldNode.name == fieldName;
        });
    } /**
       * @param fieldName
       * @returns {FieldNode}
       */

    getField(fieldName) {
        return _.find(this.fieldNodes, fieldNode => {
            return fieldNode.name == fieldName;
        });
    } /**
       * @param name
       * @returns {boolean}
       */

    hasCollectionNode(name) {
        return !!_.find(this.collectionNodes, node => {
            return node.linkName == name;
        });
    } /**
       * @param name
       * @returns {boolean}
       */

    hasReducerNode(name) {
        return !!_.find(this.reducerNodes, node => {
            return node.name == name;
        });
    } /**
       * @param name
       * @returns {ReducerNode}
       */

    getReducerNode(name) {
        return _.find(this.reducerNodes, node => {
            return node.name == name;
        });
    } /**
       * @param name
       * @returns {CollectionNode}
       */

    getCollectionNode(name) {
        return _.find(this.collectionNodes, node => {
            return node.linkName == name;
        });
    } /**
       * @returns {*}
       */

    getName() {
        return this.linkName ? this.linkName : this.collection ? this.collection._name : 'N/A';
    } /**
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
    } /**
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
                return !node.hasField(node.linkStorageField);
            } else {
                return !this.hasField(node.linkStorageField);
            }
        }
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fieldNode.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/nodes/fieldNode.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => FieldNode
});

class FieldNode {
    constructor(name, body) {
        this.name = name;
        this.body = _.isObject(body) ? 1 : body;
        this.scheduledForDeletion = false;
    }

    applyFields(fields) {
        fields[this.name] = this.body;
    }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"reducerNode.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/nodes/reducerNode.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    } /**
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"reducers":{"extension.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/reducers/extension.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let check;
module.watch(require("meteor/check"), {
    check(v) {
        check = v;
    }

}, 0);
const storage = '__reducers';
Object.assign(Mongo.Collection.prototype, {
    /**
     * @param data
     */addReducers(data) {
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
     */getReducer(name) {
        if (this[storage]) {
            return this[storage][name];
        }
    }

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"applyReducers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/reducers/lib/applyReducers.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => applyReducers
});

function applyReducers(root, params) {
    _.each(root.collectionNodes, node => {
        applyReducers(node, params);
    });

    _.each(root.reducerNodes, reducerNode => {
        root.results.forEach(result => {
            reducerNode.compute(result, params);
        });
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cleanReducerLeftovers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/reducers/lib/cleanReducerLeftovers.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => cleanReducerLeftovers
});

function cleanReducerLeftovers(root) {
    _.each(root.collectionNodes, node => {
        if (node.scheduledForDeletion) {
            root.results.forEach(result => {
                delete result[node.linkName];
            });
        }
    });

    _.each(root.collectionNodes, node => {
        cleanReducerLeftovers(node);
    });

    _.each(root.fieldNodes, node => {
        if (node.scheduledForDeletion) {
            cleanNestedFields(node.name.split('.'), root.results);
        }
    });

    _.each(root.reducerNodes, node => {
        if (node.scheduledForDeletion) {
            root.results.forEach(result => {
                delete result[node.name];
            });
        }
    });
}

// if we store a field like: 'profile.firstName'
// then we need to delete profile: { firstName }
// if profile will have empty keys, we need to delete profile.
/**
 *
 * @param parts
 * @param results
 */function cleanNestedFields(parts, results) {
    const fieldName = parts[0];

    if (parts.length === 1) {
        results.forEach(result => {
            if (fieldName !== '_id') {
                delete result[fieldName];
            }
        });
        return;
    }

    parts.shift();
    cleanNestedFields(parts, results.map(result => result[fieldName]));
    results.forEach(result => {
        if (_.keys(result[fieldName]).length === 0) {
            if (fieldName !== '_id') {
                delete result[fieldName];
            }
        }
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"createReducers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/reducers/lib/createReducers.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => addReducers,
    handleAddElement: () => handleAddElement,
    handleAddReducer: () => handleAddReducer,
    handleAddLink: () => handleAddLink,
    handleAddField: () => handleAddField
});
let dot;
module.watch(require("dot-object"), {
    default(v) {
        dot = v;
    }

}, 0);
let createNodes;
module.watch(require("../../lib/createGraph"), {
    createNodes(v) {
        createNodes = v;
    }

}, 1);
let CollectionNode;
module.watch(require("../../nodes/collectionNode"), {
    default(v) {
        CollectionNode = v;
    }

}, 2);
let FieldNode;
module.watch(require("../../nodes/fieldNode"), {
    default(v) {
        FieldNode = v;
    }

}, 3);
let ReducerNode;
module.watch(require("../../nodes/reducerNode"), {
    default(v) {
        ReducerNode = v;
    }

}, 4);
let embedReducerWithLink;
module.watch(require("./embedReducerWithLink"), {
    default(v) {
        embedReducerWithLink = v;
    }

}, 5);

function addReducers(root) {
    // we add reducers last, after we have added all the fields.
    root.reducerNodes.forEach(reducer => {
        _.each(reducer.body, (body, fieldName) => {
            handleAddElement(root, fieldName, body);
        });
    });
}

function handleAddElement(root, fieldName, body) {
    // if it's a link
    const collection = root.collection;
    const linker = collection.getLinker(fieldName);

    if (linker) {
        return handleAddLink(fieldName, body, root, linker);
    }

    const reducer = collection.getReducer(fieldName);

    if (reducer) {
        return handleAddReducer(fieldName, reducer, root);
    } // we assume it's a field in this case


    return handleAddField(fieldName, body, root);
}

function handleAddReducer(fieldName, reducer, root) {
    if (!root.hasReducerNode(fieldName)) {
        let reducerNode = new ReducerNode(fieldName, reducer);
        root.add(reducerNode);
        reducerNode.scheduledForDeletion = true;

        _.each(reducer.body, (body, fieldName) => {
            handleAddElement(root, fieldName, body);
        });
    }
}

function handleAddLink(fieldName, body, root, linker) {
    if (root.hasCollectionNode(fieldName)) {
        const collectionNode = root.getCollectionNode(fieldName);
        embedReducerWithLink(body, collectionNode);
    } else {
        // add
        let collectionNode = new CollectionNode(linker.getLinkedCollection(), body, fieldName);
        collectionNode.scheduledForDeletion = true;
        root.add(collectionNode, linker);
        createNodes(collectionNode);
    }
}

function handleAddField(fieldName, body, root) {
    if (_.isObject(body)) {
        // if reducer specifies a nested field
        const dots = dot.dot({
            [fieldName]: body
        });

        _.each(dots, (value, key) => {
            if (!root.hasField(key)) {
                let fieldNode = new FieldNode(key, value);
                fieldNode.scheduledForDeletion = true;
                root.add(fieldNode);
            }
        });
    } else {
        // if reducer does not specify a nested field, and the field does not exist.
        if (!root.hasField(fieldName)) {
            let fieldNode = new FieldNode(fieldName, body);
            fieldNode.scheduledForDeletion = true;
            root.add(fieldNode);
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"embedReducerWithLink.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_grapher/lib/query/reducers/lib/embedReducerWithLink.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
    default: () => embedReducerWithLink
});
let handleAddField, handleAddElement, handleAddReducer;
module.watch(require("./createReducers"), {
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

function embedReducerWithLink(reducerBody, collectionNode) {
    _.each(reducerBody, (value, key) => {
        const collection = collectionNode.collection;

        if (_.isObject(value)) {
            // nested field or link
            if (collectionNode.body[key]) {
                // if it exists
                const linker = collection.getLinker(key); // if it's a link

                if (linker) {
                    embedReducerWithLink(value, collectionNode.getCollectionNode(key));
                    return;
                }

                handleAddField(key, value, collectionNode);
            } else {
                // does not exist, so it may be a link/reducer/field
                handleAddElement(root, key, value);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},"node_modules":{"lodash.clonedeep":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_grapher/node_modules/lodash.clonedeep/index.js                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = "[object Arguments]",
    arrayTag = "[object Array]",
    boolTag = "[object Boolean]",
    dateTag = "[object Date]",
    errorTag = "[object Error]",
    funcTag = "[object Function]",
    genTag = "[object GeneratorFunction]",
    mapTag = "[object Map]",
    numberTag = "[object Number]",
    objectTag = "[object Object]",
    promiseTag = "[object Promise]",
    regexpTag = "[object RegExp]",
    setTag = "[object Set]",
    stringTag = "[object String]",
    symbolTag = "[object Symbol]",
    weakMapTag = "[object WeakMap]";

var arrayBufferTag = "[object ArrayBuffer]",
    dataViewTag = "[object DataView]",
    float32Tag = "[object Float32Array]",
    float64Tag = "[object Float64Array]",
    int8Tag = "[object Int8Array]",
    int16Tag = "[object Int16Array]",
    int32Tag = "[object Int32Array]",
    uint8Tag = "[object Uint8Array]",
    uint8ClampedTag = "[object Uint8ClampedArray]",
    uint16Tag = "[object Uint16Array]",
    uint32Tag = "[object Uint32Array]";

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[
    arrayBufferTag
] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[
    dateTag
] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[
    int8Tag
] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[
    mapTag
] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[
    regexpTag
] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[
    symbolTag
] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[
    uint16Tag
] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[
    weakMapTag
] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal =
    typeof global == "object" && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf =
    typeof self == "object" && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function("return this")();

/** Detect free variable `exports`. */
var freeExports =
    typeof exports == "object" && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule =
    freeExports &&
    typeof module == "object" &&
    module &&
    !module.nodeType &&
    module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
}

/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
}

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
    var index = -1,
        length = array ? array.length : 0;

    while (++index < length) {
        if (iteratee(array[index], index, array) === false) {
            break;
        }
    }
    return array;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
        array[offset + index] = values[index];
    }
    return array;
}

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array ? array.length : 0;

    if (initAccum && length) {
        accumulator = array[++index];
    }
    while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
    return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != "function") {
        try {
            result = !!(value + "");
        } catch (e) {}
    }
    return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
        result[++index] = [key, value];
    });
    return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
        result[++index] = value;
    });
    return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root["__core-js_shared__"];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(
        (coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO) || ""
    );
    return uid ? "Symbol(src)_1." + uid : "";
})();

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp(
    "^" +
        funcToString
            .call(hasOwnProperty)
            .replace(reRegExpChar, "\\$&")
            .replace(
                /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                "$1.*?"
            ) +
        "$"
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, "DataView"),
    Map = getNative(root, "Map"),
    Promise = getNative(root, "Promise"),
    Set = getNative(root, "Set"),
    WeakMap = getNative(root, "WeakMap"),
    nativeCreate = getNative(Object, "create");

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
    var data = this.__data__;
    return nativeCreate
        ? data[key] !== undefined
        : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
    this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
        return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
        data.pop();
    } else {
        splice.call(data, index, 1);
    }
    return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
        data.push([key, value]);
    } else {
        data[index][1] = value;
    }
    return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
    var index = -1,
        length = entries ? entries.length : 0;

    this.clear();
    while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
    this.__data__ = {
        hash: new Hash(),
        map: new (Map || ListCache)(),
        string: new Hash()
    };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
    return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
    return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
    this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
    this.__data__ = new ListCache();
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
    return this.__data__["delete"](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
    return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
    return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            return this;
        }
        cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result =
        isArray(value) || isArguments(value)
            ? baseTimes(value.length, String)
            : [];

    var length = result.length,
        skipIndexes = !!length;

    for (var key in value) {
        if (
            (inherited || hasOwnProperty.call(value, key)) &&
            !(skipIndexes && (key == "length" || isIndex(key, length)))
        ) {
            result.push(key);
        }
    }
    return result;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
    var objValue = object[key];
    if (
        !(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
        (value === undefined && !(key in object))
    ) {
        object[key] = value;
    }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
        if (eq(array[length][0], key)) {
            return length;
        }
    }
    return -1;
}

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) {
        result = object
            ? customizer(value, key, object, stack)
            : customizer(value);
    }
    if (result !== undefined) {
        return result;
    }
    if (!isObject(value)) {
        return value;
    }
    var isArr = isArray(value);
    if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) {
            return copyArray(value, result);
        }
    } else {
        var tag = getTag(value),
            isFunc = tag == funcTag || tag == genTag;

        if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
        }
        if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
            if (isHostObject(value)) {
                return object ? value : {};
            }
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) {
                return copySymbols(value, baseAssign(result, value));
            }
        } else {
            if (!cloneableTags[tag]) {
                return object ? value : {};
            }
            result = initCloneByTag(value, tag, baseClone, isDeep);
        }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
        return stacked;
    }
    stack.set(value, result);

    if (!isArr) {
        var props = isFull ? getAllKeys(value) : keys(value);
    }
    arrayEach(props || value, function(subValue, key) {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(
            result,
            key,
            baseClone(subValue, isDeep, isFull, customizer, key, value, stack)
        );
    });
    return result;
}

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
    return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
        return false;
    }
    var pattern =
        isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
    if (!isPrototype(object)) {
        return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
            result.push(key);
        }
    }
    return result;
}

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
        return buffer.slice();
    }
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(
        buffer,
        dataView.byteOffset,
        dataView.byteLength
    );
}

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor());
}

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor());
}

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep
        ? cloneArrayBuffer(typedArray.buffer)
        : typedArray.buffer;
    return new typedArray.constructor(
        buffer,
        typedArray.byteOffset,
        typedArray.length
    );
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
        array[index] = source[index];
    }
    return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
    object || (object = {});

    var index = -1,
        length = props.length;

    while (++index < length) {
        var key = props[index];

        var newValue = customizer
            ? customizer(object[key], source[key], key, object, source)
            : undefined;

        assignValue(
            object,
            key,
            newValue === undefined ? source[key] : newValue
        );
    }
    return object;
}

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
        ? data[typeof key == "string" ? "string" : "hash"]
        : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols
    ? overArg(nativeGetSymbols, Object)
    : stubArray;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (
    (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map()) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set()) != setTag) ||
    (WeakMap && getTag(new WeakMap()) != weakMapTag)
) {
    getTag = function(value) {
        var result = objectToString.call(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? toSource(Ctor) : undefined;

        if (ctorString) {
            switch (ctorString) {
                case dataViewCtorString:
                    return dataViewTag;
                case mapCtorString:
                    return mapTag;
                case promiseCtorString:
                    return promiseTag;
                case setCtorString:
                    return setTag;
                case weakMapCtorString:
                    return weakMapTag;
            }
        }
        return result;
    };
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
    var length = array.length,
        result = array.constructor(length);

    // Add properties assigned by `RegExp#exec`.
    if (
        length &&
        typeof array[0] == "string" &&
        hasOwnProperty.call(array, "index")
    ) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object)
        ? baseCreate(getPrototype(object))
        : {};
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
        case arrayBufferTag:
            return cloneArrayBuffer(object);

        case boolTag:
        case dateTag:
            return new Ctor(+object);

        case dataViewTag:
            return cloneDataView(object, isDeep);

        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
            return cloneTypedArray(object, isDeep);

        case mapTag:
            return cloneMap(object, isDeep, cloneFunc);

        case numberTag:
        case stringTag:
            return new Ctor(object);

        case regexpTag:
            return cloneRegExp(object);

        case setTag:
            return cloneSet(object, isDeep, cloneFunc);

        case symbolTag:
            return cloneSymbol(object);
    }
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return (
        !!length &&
        (typeof value == "number" || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length)
    );
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
    var type = typeof value;
    return type == "string" ||
        type == "number" ||
        type == "symbol" ||
        type == "boolean"
        ? value !== "__proto__"
        : value === null;
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == "function" && Ctor.prototype) || objectProto;

    return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
    if (func != null) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + "";
        } catch (e) {}
    }
    return "";
}

/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */
function cloneDeep(value) {
    return baseClone(value, true, true);
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
    return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return (
        isArrayLikeObject(value) &&
        hasOwnProperty.call(value, "callee") &&
        (!propertyIsEnumerable.call(value, "callee") ||
            objectToString.call(value) == argsTag)
    );
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
    return (
        typeof value == "number" &&
        value > -1 &&
        value % 1 == 0 &&
        value <= MAX_SAFE_INTEGER
    );
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
    return !!value && typeof value == "object";
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
    return [];
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
    return false;
}

module.exports = cloneDeep;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dot-object":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../../.1.3.1.o1og0g.wvr4q++os+web.browser+web.cordova/npm/node_modules/dot-object/package.json                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "dot-object";
exports.version = "1.5.4";
exports.main = "index";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_grapher/node_modules/dot-object/index.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";

function _process(v, mod) {
    var i;
    var r;

    if (typeof mod === "function") {
        r = mod(v);
        if (r !== undefined) {
            v = r;
        }
    } else if (Array.isArray(mod)) {
        for (i = 0; i < mod.length; i++) {
            r = mod[i](v);
            if (r !== undefined) {
                v = r;
            }
        }
    }

    return v;
}

function parseKey(key, val) {
    // detect negative index notation
    if (key[0] === "-" && Array.isArray(val) && /^-\d+$/.test(key)) {
        return val.length + parseInt(key, 10);
    }
    return key;
}

function isIndex(k) {
    return /^\d+/.test(k);
}

function parsePath(path, sep) {
    if (path.indexOf("[") >= 0) {
        path = path.replace(/\[/g, ".").replace(/]/g, "");
    }
    return path.split(sep);
}

function DotObject(seperator, override, useArray) {
    if (!(this instanceof DotObject)) {
        return new DotObject(seperator, override, useArray);
    }

    if (typeof seperator === "undefined") seperator = ".";
    if (typeof override === "undefined") override = false;
    if (typeof useArray === "undefined") useArray = true;
    this.seperator = seperator;
    this.override = override;
    this.useArray = useArray;

    // contains touched arrays
    this.cleanup = [];
}

var dotDefault = new DotObject(".", false, true);
function wrap(method) {
    return function() {
        return dotDefault[method].apply(dotDefault, arguments);
    };
}

DotObject.prototype._fill = function(a, obj, v, mod) {
    var k = a.shift();

    if (a.length > 0) {
        obj[k] = obj[k] || (this.useArray && isIndex(a[0]) ? [] : {});

        if (obj[k] !== Object(obj[k])) {
            if (this.override) {
                obj[k] = {};
            } else {
                throw new Error(
                    "Trying to redefine `" + k + "` which is a " + typeof obj[k]
                );
            }
        }

        this._fill(a, obj[k], v, mod);
    } else {
        if (
            !this.override &&
            obj[k] === Object(obj[k]) &&
            Object.keys(obj[k]).length
        ) {
            throw new Error("Trying to redefine non-empty obj['" + k + "']");
        }

        obj[k] = _process(v, mod);
    }
};

/**
 *
 * Converts an object with dotted-key/value pairs to it's expanded version
 *
 * Optionally transformed by a set of modifiers.
 *
 * Usage:
 *
 *   var row = {
 *     'nr': 200,
 *     'doc.name': '  My Document  '
 *   }
 *
 *   var mods = {
 *     'doc.name': [_s.trim, _s.underscored]
 *   }
 *
 *   dot.object(row, mods)
 *
 * @param {Object} obj
 * @param {Object} mods
 */
DotObject.prototype.object = function(obj, mods) {
    var self = this;

    Object.keys(obj).forEach(function(k) {
        var mod = mods === undefined ? null : mods[k];
        // normalize array notation.
        var ok = parsePath(k, self.seperator).join(self.seperator);

        if (ok.indexOf(self.seperator) !== -1) {
            self._fill(ok.split(self.seperator), obj, obj[k], mod);
            delete obj[k];
        } else if (self.override) {
            obj[k] = _process(obj[k], mod);
        }
    });

    return obj;
};

/**
 * @param {String} path dotted path
 * @param {String} v value to be set
 * @param {Object} obj object to be modified
 * @param {Function|Array} mod optional modifier
 */
DotObject.prototype.str = function(path, v, obj, mod) {
    if (path.indexOf(this.seperator) !== -1) {
        this._fill(path.split(this.seperator), obj, v, mod);
    } else if (!obj.hasOwnProperty(path) || this.override) {
        obj[path] = _process(v, mod);
    }

    return obj;
};

/**
 *
 * Pick a value from an object using dot notation.
 *
 * Optionally remove the value
 *
 * @param {String} path
 * @param {Object} obj
 * @param {Boolean} remove
 */
DotObject.prototype.pick = function(path, obj, remove) {
    var i;
    var keys;
    var val;
    var key;
    var cp;

    keys = parsePath(path, this.seperator);
    for (i = 0; i < keys.length; i++) {
        key = parseKey(keys[i], obj);
        if (obj && typeof obj === "object" && key in obj) {
            if (i === keys.length - 1) {
                if (remove) {
                    val = obj[key];
                    delete obj[key];
                    if (Array.isArray(obj)) {
                        cp = keys.slice(0, -1).join(".");
                        if (this.cleanup.indexOf(cp) === -1) {
                            this.cleanup.push(cp);
                        }
                    }
                    return val;
                } else {
                    return obj[key];
                }
            } else {
                obj = obj[key];
            }
        } else {
            return undefined;
        }
    }
    if (remove && Array.isArray(obj)) {
        obj = obj.filter(function(n) {
            return n !== undefined;
        });
    }
    return obj;
};

/**
 *
 * Remove value from an object using dot notation.
 *
 * @param {String} path
 * @param {Object} obj
 * @return {Mixed} The removed value
 */
DotObject.prototype.remove = function(path, obj) {
    var i;

    this.cleanup = [];
    if (Array.isArray(path)) {
        for (i = 0; i < path.length; i++) {
            this.pick(path[i], obj, true);
        }
        this._cleanup(obj);
        return obj;
    } else {
        return this.pick(path, obj, true);
    }
};

DotObject.prototype._cleanup = function(obj) {
    var ret;
    var i;
    var keys;
    var root;
    if (this.cleanup.length) {
        for (i = 0; i < this.cleanup.length; i++) {
            keys = this.cleanup[i].split(".");
            root = keys.splice(0, -1).join(".");
            ret = root ? this.pick(root, obj) : obj;
            ret = ret[keys[0]].filter(function(v) {
                return v !== undefined;
            });
            this.set(this.cleanup[i], ret, obj);
        }
        this.cleanup = [];
    }
};

// alias method
DotObject.prototype.del = DotObject.prototype.remove;

/**
 *
 * Move a property from one place to the other.
 *
 * If the source path does not exist (undefined)
 * the target property will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.move = function(source, target, obj, mods, merge) {
    if (typeof mods === "function" || Array.isArray(mods)) {
        this.set(
            target,
            _process(this.pick(source, obj, true), mods),
            obj,
            merge
        );
    } else {
        merge = mods;
        this.set(target, this.pick(source, obj, true), obj, merge);
    }

    return obj;
};

/**
 *
 * Transfer a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.transfer = function(
    source,
    target,
    obj1,
    obj2,
    mods,
    merge
) {
    if (typeof mods === "function" || Array.isArray(mods)) {
        this.set(
            target,
            _process(this.pick(source, obj1, true), mods),
            obj2,
            merge
        );
    } else {
        merge = mods;
        this.set(target, this.pick(source, obj1, true), obj2, merge);
    }

    return obj2;
};

/**
 *
 * Copy a property from one object to another object.
 *
 * If the source path does not exist (undefined)
 * the property on the other object will not be set.
 *
 * @param {String} source
 * @param {String} target
 * @param {Object} obj1
 * @param {Object} obj2
 * @param {Function|Array} mods
 * @param {Boolean} merge
 */
DotObject.prototype.copy = function(source, target, obj1, obj2, mods, merge) {
    if (typeof mods === "function" || Array.isArray(mods)) {
        this.set(
            target,
            _process(
                // clone what is picked
                JSON.parse(JSON.stringify(this.pick(source, obj1, false))),
                mods
            ),
            obj2,
            merge
        );
    } else {
        merge = mods;
        this.set(target, this.pick(source, obj1, false), obj2, merge);
    }

    return obj2;
};

function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
}

/**
 *
 * Set a property on an object using dot notation.
 *
 * @param {String} path
 * @param {Mixed} val
 * @param {Object} obj
 * @param {Boolean} merge
 */
DotObject.prototype.set = function(path, val, obj, merge) {
    var i;
    var k;
    var keys;
    var key;

    // Do not operate if the value is undefined.
    if (typeof val === "undefined") {
        return obj;
    }
    keys = parsePath(path, this.seperator);

    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        if (i === keys.length - 1) {
            if (merge && isObject(val) && isObject(obj[key])) {
                for (k in val) {
                    if (val.hasOwnProperty(k)) {
                        obj[key][k] = val[k];
                    }
                }
            } else if (merge && Array.isArray(obj[key]) && Array.isArray(val)) {
                for (var j = 0; j < val.length; j++) {
                    obj[keys[i]].push(val[j]);
                }
            } else {
                obj[key] = val;
            }
        } else if (
            // force the value to be an object
            !obj.hasOwnProperty(key) ||
            (!isObject(obj[key]) && !Array.isArray(obj[key]))
        ) {
            // initialize as array if next key is numeric
            if (/^\d+$/.test(keys[i + 1])) {
                obj[key] = [];
            } else {
                obj[key] = {};
            }
        }
        obj = obj[key];
    }
    return obj;
};

/**
 *
 * Transform an object
 *
 * Usage:
 *
 *   var obj = {
 *     "id": 1,
 *    "some": {
 *      "thing": "else"
 *    }
 *   }
 *
 *   var transform = {
 *     "id": "nr",
 *    "some.thing": "name"
 *   }
 *
 *   var tgt = dot.transform(transform, obj)
 *
 * @param {Object} recipe Transform recipe
 * @param {Object} obj Object to be transformed
 * @param {Array} mods modifiers for the target
 */
DotObject.prototype.transform = function(recipe, obj, tgt) {
    obj = obj || {};
    tgt = tgt || {};
    Object.keys(recipe).forEach(
        function(key) {
            this.set(recipe[key], this.pick(key, obj), tgt);
        }.bind(this)
    );
    return tgt;
};

/**
 *
 * Convert object to dotted-key/value pair
 *
 * Usage:
 *
 *   var tgt = dot.dot(obj)
 *
 *   or
 *
 *   var tgt = {}
 *   dot.dot(obj, tgt)
 *
 * @param {Object} obj source object
 * @param {Object} tgt target object
 * @param {Array} path path array (internal)
 */
DotObject.prototype.dot = function(obj, tgt, path) {
    tgt = tgt || {};
    path = path || [];
    Object.keys(obj).forEach(
        function(key) {
            if (
                (Object(obj[key]) === obj[key] &&
                    Object.prototype.toString.call(obj[key]) ===
                        "[object Object]") ||
                Object.prototype.toString.call(obj[key]) === "[object Array]"
            ) {
                return this.dot(obj[key], tgt, path.concat(key));
            } else {
                tgt[path.concat(key).join(this.seperator)] = obj[key];
            }
        }.bind(this)
    );
    return tgt;
};

DotObject.pick = wrap("pick");
DotObject.move = wrap("move");
DotObject.transfer = wrap("transfer");
DotObject.transform = wrap("transform");
DotObject.copy = wrap("copy");
DotObject.object = wrap("object");
DotObject.str = wrap("str");
DotObject.set = wrap("set");
DotObject.del = DotObject.remove = wrap("remove");
DotObject.dot = wrap("dot");
["override", "overwrite"].forEach(function(prop) {
    Object.defineProperty(DotObject, prop, {
        get: function() {
            return dotDefault.override;
        },
        set: function(val) {
            dotDefault.override = !!val;
        }
    });
});

Object.defineProperty(DotObject, "useArray", {
    get: function() {
        return dotDefault.useArray;
    },
    set: function(val) {
        dotDefault.useArray = val;
    }
});

DotObject._process = _process;

module.exports = DotObject;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"sift":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../../.1.3.1.o1og0g.wvr4q++os+web.browser+web.cordova/npm/node_modules/sift/package.json                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "sift";
exports.version = "3.2.6";
exports.main = "./sift.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"sift.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_grapher/node_modules/sift/sift.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*
 * Sift 3.x
 *
 * Copryright 2015, Craig Condon
 * Licensed under MIT
 *
 * Filter JavaScript objects with mongodb queries
 */

(function() {
    "use strict";

    /**
     */

    function isFunction(value) {
        return typeof value === "function";
    }

    /**
     */

    function isArray(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    }

    /**
     */

    function comparable(value) {
        if (value instanceof Date) {
            return value.getTime();
        } else if (value instanceof Array) {
            return value.map(comparable);
        } else {
            return value;
        }
    }

    function get(obj, key) {
        if (obj.get) return obj.get(key);
        return obj[key];
    }

    /**
     */

    function or(validator) {
        return function(a, b) {
            if (!isArray(b) || !b.length) return validator(a, b);
            for (var i = 0, n = b.length; i < n; i++)
                if (validator(a, get(b, i))) return true;
            return false;
        };
    }

    /**
     */

    function and(validator) {
        return function(a, b) {
            if (!isArray(b) || !b.length) return validator(a, b);
            for (var i = 0, n = b.length; i < n; i++)
                if (!validator(a, get(b, i))) return false;
            return true;
        };
    }

    function validate(validator, b) {
        return validator.v(validator.a, b);
    }

    var operator = {
        /**
         */

        $eq: or(function(a, b) {
            return a(b);
        }),

        /**
         */

        $ne: and(function(a, b) {
            return !a(b);
        }),

        /**
         */

        $or: function(a, b) {
            for (var i = 0, n = a.length; i < n; i++)
                if (validate(get(a, i), b)) return true;
            return false;
        },

        /**
         */

        $gt: or(function(a, b) {
            return sift.compare(comparable(b), a) > 0;
        }),

        /**
         */

        $gte: or(function(a, b) {
            return sift.compare(comparable(b), a) >= 0;
        }),

        /**
         */

        $lt: or(function(a, b) {
            return sift.compare(comparable(b), a) < 0;
        }),

        /**
         */

        $lte: or(function(a, b) {
            return sift.compare(comparable(b), a) <= 0;
        }),

        /**
         */

        $mod: or(function(a, b) {
            return b % a[0] == a[1];
        }),

        /**
         */

        $in: function(a, b) {
            if (b instanceof Array) {
                for (var i = b.length; i--; ) {
                    if (~a.indexOf(comparable(get(b, i)))) return true;
                }
            } else {
                return !!~a.indexOf(comparable(b));
            }

            return false;
        },

        /**
         */

        $nin: function(a, b) {
            return !operator.$in(a, b);
        },

        /**
         */

        $not: function(a, b) {
            return !validate(a, b);
        },

        /**
         */

        $type: function(a, b) {
            return b != void 0 ? b instanceof a || b.constructor == a : false;
        },

        /**
         */

        $all: function(a, b) {
            if (!b) b = [];
            for (var i = a.length; i--; ) {
                if (!~comparable(b).indexOf(get(a, i))) return false;
            }
            return true;
        },

        /**
         */

        $size: function(a, b) {
            return b ? a === b.length : false;
        },

        /**
         */

        $nor: function(a, b) {
            // todo - this suffice? return !operator.$in(a)
            for (var i = 0, n = a.length; i < n; i++)
                if (validate(get(a, i), b)) return false;
            return true;
        },

        /**
         */

        $and: function(a, b) {
            for (var i = 0, n = a.length; i < n; i++)
                if (!validate(get(a, i), b)) return false;
            return true;
        },

        /**
         */

        $regex: or(function(a, b) {
            return typeof b === "string" && a.test(b);
        }),

        /**
         */

        $where: function(a, b) {
            return a.call(b, b);
        },

        /**
         */

        $elemMatch: function(a, b) {
            if (isArray(b)) return !!~search(b, a);
            return validate(a, b);
        },

        /**
         */

        $exists: function(a, b) {
            return (b != void 0) === a;
        }
    };

    /**
     */

    var prepare = {
        /**
         */

        $eq: function(a) {
            if (a instanceof RegExp) {
                return function(b) {
                    return typeof b === "string" && a.test(b);
                };
            } else if (a instanceof Function) {
                return a;
            } else if (isArray(a) && !a.length) {
                // Special case of a == []
                return function(b) {
                    return isArray(b) && !b.length;
                };
            } else if (a === null) {
                return function(b) {
                    //will match both null and undefined
                    return b == null;
                };
            }

            return function(b) {
                return sift.compare(comparable(b), a) === 0;
            };
        },

        /**
         */

        $ne: function(a) {
            return prepare.$eq(a);
        },

        /**
         */

        $and: function(a) {
            return a.map(parse);
        },

        /**
         */

        $or: function(a) {
            return a.map(parse);
        },

        /**
         */

        $nor: function(a) {
            return a.map(parse);
        },

        /**
         */

        $not: function(a) {
            return parse(a);
        },

        /**
         */

        $regex: function(a, query) {
            return new RegExp(a, query.$options);
        },

        /**
         */

        $where: function(a) {
            return typeof a === "string"
                ? new Function("obj", "return " + a)
                : a;
        },

        /**
         */

        $elemMatch: function(a) {
            return parse(a);
        },

        /**
         */

        $exists: function(a) {
            return !!a;
        }
    };

    /**
     */

    function search(array, validator) {
        for (var i = 0; i < array.length; i++) {
            if (validate(validator, get(array, i))) {
                return i;
            }
        }

        return -1;
    }

    /**
     */

    function createValidator(a, validate) {
        return { a: a, v: validate };
    }

    /**
     */

    function nestedValidator(a, b) {
        var values = [];
        findValues(b, a.k, 0, values);

        if (values.length === 1) {
            return validate(a.nv, values[0]);
        }

        return !!~search(values, a.nv);
    }

    /**
     */

    function findValues(current, keypath, index, values) {
        if (index === keypath.length || current == void 0) {
            values.push(current);
            return;
        }

        var k = get(keypath, index);

        // ensure that if current is an array, that the current key
        // is NOT an array index. This sort of thing needs to work:
        // sift({'foo.0':42}, [{foo: [42]}]);
        if (isArray(current) && isNaN(Number(k))) {
            for (var i = 0, n = current.length; i < n; i++) {
                findValues(get(current, i), keypath, index, values);
            }
        } else {
            findValues(get(current, k), keypath, index + 1, values);
        }
    }

    /**
     */

    function createNestedValidator(keypath, a) {
        return { a: { k: keypath, nv: a }, v: nestedValidator };
    }

    /**
     * flatten the query
     */

    function parse(query) {
        query = comparable(query);

        if (
            !query ||
            (query.constructor.toString() !== "Object" &&
                query.constructor
                    .toString()
                    .replace(/\n/g, "")
                    .replace(/ /g, "") !== "functionObject(){[nativecode]}")
        ) {
            // cross browser support
            query = { $eq: query };
        }

        var validators = [];

        for (var key in query) {
            var a = query[key];

            if (key === "$options") continue;

            if (operator[key]) {
                if (prepare[key]) a = prepare[key](a, query);
                validators.push(createValidator(comparable(a), operator[key]));
            } else {
                if (key.charCodeAt(0) === 36) {
                    throw new Error("Unknown operation " + key);
                }

                validators.push(
                    createNestedValidator(key.split("."), parse(a))
                );
            }
        }

        return validators.length === 1
            ? validators[0]
            : createValidator(validators, operator.$and);
    }

    /**
     */

    function createRootValidator(query, getter) {
        var validator = parse(query);
        if (getter) {
            validator = {
                a: validator,
                v: function(a, b) {
                    return validate(a, getter(b));
                }
            };
        }
        return validator;
    }

    /**
     */

    function sift(query, array, getter) {
        if (isFunction(array)) {
            getter = array;
            array = void 0;
        }

        var validator = createRootValidator(query, getter);

        function filter(b) {
            return validate(validator, b);
        }

        if (array) {
            return array.filter(filter);
        }

        return filter;
    }

    /**
     */

    sift.use = function(plugin) {
        if (isFunction(plugin)) return plugin(sift);
        for (var key in plugin) {
            if (key.charCodeAt(0) === 36) operator[key] = plugin[key];
        }
    };

    /**
     */

    sift.indexOf = function(query, array, getter) {
        return search(array, createRootValidator(query, getter));
    };

    /**
     */

    sift.compare = function(a, b) {
        if (a === b) return 0;
        if (typeof a === typeof b) {
            if (a > b) return 1;
            if (a < b) return -1;
        }
    };

    /* istanbul ignore next */
    if (
        typeof module !== "undefined" &&
        typeof module.exports !== "undefined"
    ) {
        module.exports = sift;
    }

    if (typeof window !== "undefined") {
        window.sift = sift;
    }
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deep-extend":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../../.1.3.1.o1og0g.wvr4q++os+web.browser+web.cordova/npm/node_modules/deep-extend/package.json                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "deep-extend";
exports.version = "0.5.0";
exports.main = "lib/deep-extend.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"deep-extend.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_grapher/node_modules/deep-extend/lib/deep-extend.js                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*!
 * @description Recursive object extending
 * @author Viacheslav Lotsmanov <lotsmanov89@gmail.com>
 * @license MIT
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2013-2015 Viacheslav Lotsmanov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

function isSpecificValue(val) {
    return val instanceof Buffer || val instanceof Date || val instanceof RegExp
        ? true
        : false;
}

function cloneSpecificValue(val) {
    if (val instanceof Buffer) {
        var x = new Buffer(val.length);
        val.copy(x);
        return x;
    } else if (val instanceof Date) {
        return new Date(val.getTime());
    } else if (val instanceof RegExp) {
        return new RegExp(val);
    } else {
        throw new Error("Unexpected situation");
    }
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr) {
    var clone = [];
    arr.forEach(function(item, index) {
        if (typeof item === "object" && item !== null) {
            if (Array.isArray(item)) {
                clone[index] = deepCloneArray(item);
            } else if (isSpecificValue(item)) {
                clone[index] = cloneSpecificValue(item);
            } else {
                clone[index] = deepExtend({}, item);
            }
        } else {
            clone[index] = item;
        }
    });
    return clone;
}

/**
 * Extening object that entered in first argument.
 *
 * Returns extended object or false if have no target object or incorrect type.
 *
 * If you wish to clone source object (without modify it), just use empty new
 * object as first argument, like this:
 *   deepExtend({}, yourObj_1, [yourObj_N]);
 */
var deepExtend = (module.exports = function(/*obj_1, [obj_2], [obj_N]*/) {
    if (arguments.length < 1 || typeof arguments[0] !== "object") {
        return false;
    }

    if (arguments.length < 2) {
        return arguments[0];
    }

    var target = arguments[0];

    // convert arguments to array and cut off target object
    var args = Array.prototype.slice.call(arguments, 1);

    var val, src, clone;

    args.forEach(function(obj) {
        // skip argument if isn't an object, is null, or is an array
        if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
            return;
        }

        Object.keys(obj).forEach(function(key) {
            src = target[key]; // source value
            val = obj[key]; // new value

            // recursion prevention
            if (val === target) {
                return;

                /**
                 * if new value isn't object then just overwrite by new value
                 * instead of extending.
                 */
            } else if (typeof val !== "object" || val === null) {
                target[key] = val;
                return;

                // just clone arrays (and recursive clone objects inside)
            } else if (Array.isArray(val)) {
                target[key] = deepCloneArray(val);
                return;

                // custom cloning and overwrite for specific objects
            } else if (isSpecificValue(val)) {
                target[key] = cloneSpecificValue(val);
                return;

                // overwrite by new value if source isn't object or array
            } else if (
                typeof src !== "object" ||
                src === null ||
                Array.isArray(src)
            ) {
                target[key] = deepExtend({}, val);
                return;

                // source value and new value is objects both, extending...
            } else {
                target[key] = deepExtend(src, val);
                return;
            }
        });
    });

    return target;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/cultofcoders:grapher/main.server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['cultofcoders:grapher'] = exports;

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_grapher.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbWFpbi5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9hZ2dyZWdhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9jb21wb3NlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvY3JlYXRlUXVlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9leHBvc3VyZS5jb25maWcuc2NoZW1hLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvZXhwb3N1cmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvY2xlYW5Cb2R5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvbGliL2NsZWFuU2VsZWN0b3JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvZXhwb3N1cmUvbGliL2VuZm9yY2VNYXhEZXB0aC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2V4cG9zdXJlL2xpYi9lbmZvcmNlTWF4TGltaXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvcmVzdHJpY3RGaWVsZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9leHBvc3VyZS9saWIvcmVzdHJpY3RMaW5rcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2NvbmZpZy5zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saW5rZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9saW5rcy9saWIvY3JlYXRlU2VhcmNoRmlsdGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtNYW55TWV0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL2xpbmtzL2xpbmtUeXBlcy9saW5rT25lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpbmtPbmVNZXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbGlua3MvbGlua1R5cGVzL2xpYi9zbWFydEFyZ3VtZW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9uYW1lZFF1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L3N0b3JlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvbmFtZWRRdWVyeS9jYWNoZS9NZW1vcnlSZXN1bHRDYWNoZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9zY2hlbWEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9uYW1lZFF1ZXJ5L2V4cG9zZS9saWIvbWVyZ2VEZWVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuYmFzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmNsaWVudC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3F1ZXJ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvcXVlcnkuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvbGxlY3Rpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvY29uc3RhbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NvdW50U3Vic2NyaXB0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvY291bnRzL2NyZWF0ZUZhdXhTdWJzY3JpcHRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2Fzc2VtYmxlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2NvbnN0YW50cy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2h5cGVybm92YS9oeXBlcm5vdmEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9oeXBlcm5vdmEvc3RvcmVIeXBlcm5vdmFSZXN1bHRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9jbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvaHlwZXJub3ZhL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9hcHBseVByb3BzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbGliL2NhbGxXaXRoUHJvbWlzZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9kb3RpemUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L2xpYi9yZWN1cnNpdmVGZXRjaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L25vZGVzL2NvbGxlY3Rpb25Ob2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvZmllbGROb2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6Z3JhcGhlci9saWIvcXVlcnkvbm9kZXMvcmVkdWNlck5vZGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9leHRlbnNpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOmdyYXBoZXIvbGliL3F1ZXJ5L3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvY3JlYXRlUmVkdWNlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpncmFwaGVyL2xpYi9xdWVyeS9yZWR1Y2Vycy9saWIvZW1iZWRSZWR1Y2VyV2l0aExpbmsuanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0IiwiTmFtZWRRdWVyeVN0b3JlIiwiTGlua0NvbnN0YW50cyIsIndhdGNoIiwicmVxdWlyZSIsImRlZmF1bHQiLCJ2IiwiZXhwb3J0cyIsImNyZWF0ZVF1ZXJ5IiwiRXhwb3N1cmUiLCJNZW1vcnlSZXN1bHRDYWNoZXIiLCJCYXNlUmVzdWx0Q2FjaGVyIiwiY29tcG9zZSIsIk1vbmdvIiwiQ29sbGVjdGlvbiIsInByb3RvdHlwZSIsImFnZ3JlZ2F0ZSIsInBpcGVsaW5lcyIsIm9wdGlvbnMiLCJjb2xsIiwicmF3Q29sbGVjdGlvbiIsIk1ldGVvciIsIndyYXBBc3luYyIsImRlZXBFeHRlbmQiLCJleHBvcnREZWZhdWx0IiwiYXJncyIsIlF1ZXJ5IiwiTmFtZWRRdWVyeSIsIm5hbWUiLCJib2R5IiwiXyIsImlzRnVuY3Rpb24iLCJjcmVhdGVOYW1lZFF1ZXJ5IiwiZW50cnlQb2ludE5hbWUiLCJmaXJzdCIsImtleXMiLCJjb2xsZWN0aW9uIiwiZ2V0IiwiRXJyb3IiLCJpc0RldmVsb3BtZW50IiwiY29uc29sZSIsIndhcm4iLCJwYXJhbXMiLCJjcmVhdGVOb3JtYWxRdWVyeSIsIm5hbWVkUXVlcnkiLCJxdWVyeSIsImFkZCIsImNsb25lIiwiZXh0ZW5kIiwiRXhwb3N1cmVEZWZhdWx0cyIsIkV4cG9zdXJlU2NoZW1hIiwidmFsaWRhdGVCb2R5IiwiY3JlYXRlR3JhcGgiLCJNYXRjaCIsImJsb2NraW5nIiwibWV0aG9kIiwicHVibGljYXRpb24iLCJmaXJld2FsbCIsIk1heWJlIiwiT25lT2YiLCJGdW5jdGlvbiIsIm1heExpbWl0IiwiSW50ZWdlciIsIm1heERlcHRoIiwiQm9vbGVhbiIsIk9iamVjdCIsInJlc3RyaWN0ZWRGaWVsZHMiLCJTdHJpbmciLCJyZXN0cmljdExpbmtzIiwiZSIsInRvU3RyaW5nIiwiZ2VuQ291bnRFbmRwb2ludCIsInJlY3Vyc2l2ZUNvbXBvc2UiLCJoeXBlcm5vdmEiLCJlbmZvcmNlTWF4RGVwdGgiLCJlbmZvcmNlTWF4TGltaXQiLCJjbGVhbkJvZHkiLCJkZWVwQ2xvbmUiLCJyZXN0cmljdEZpZWxkc0ZuIiwiY2hlY2siLCJnbG9iYWxDb25maWciLCJzZXRDb25maWciLCJjb25maWciLCJhc3NpZ24iLCJnZXRDb25maWciLCJyZXN0cmljdEZpZWxkcyIsImNvbnN0cnVjdG9yIiwiX19pc0V4cG9zZWRGb3JHcmFwaGVyIiwiX19leHBvc3VyZSIsIl9uYW1lIiwiX3ZhbGlkYXRlQW5kQ2xlYW4iLCJpbml0U2VjdXJpdHkiLCJpbml0UHVibGljYXRpb24iLCJpbml0TWV0aG9kIiwiaW5pdENvdW50TWV0aG9kIiwiaW5pdENvdW50UHVibGljYXRpb24iLCJnZXRUcmFuc2Zvcm1lZEJvZHkiLCJ1c2VySWQiLCJwcm9jZXNzZWRCb2R5IiwiZ2V0Qm9keSIsImNhbGwiLCJiaW5kIiwicHVibGlzaENvbXBvc2l0ZSIsInRyYW5zZm9ybWVkQm9keSIsInJvb3ROb2RlIiwiYnlwYXNzRmlyZXdhbGxzIiwibWV0aG9kQm9keSIsInVuYmxvY2siLCJtZXRob2RzIiwiZmluZCIsIiRmaWx0ZXJzIiwiY291bnQiLCJnZXRDdXJzb3IiLCJzZXNzaW9uIiwiZmlsdGVycyIsImZpZWxkcyIsIl9pZCIsImdldFNlc3Npb24iLCJmaW5kT25lIiwidW5kZWZpbmVkIiwiX2NhbGxGaXJld2FsbCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImlzQXJyYXkiLCJmb3JFYWNoIiwiZmlyZSIsImV4cG9zZSIsImlzU2VydmVyIiwiY2xlYW5GaWx0ZXJzIiwiY2xlYW5PcHRpb25zIiwiZG90aXplIiwibWFpbiIsInNlY29uZCIsIm9iamVjdCIsIiRvcHRpb25zIiwiZ2V0RmllbGRzIiwiZWFjaCIsInNlY29uZFZhbHVlIiwia2V5IiwidmFsdWUiLCJpc09iamVjdCIsImNvbnZlcnQiLCJmaWVsZEV4aXN0cyIsImVuc3VyZUZpZWxkcyIsInBpY2siLCJzb3J0IiwiZGVlcEZpbHRlckZpZWxkc0FycmF5IiwiZGVlcEZpbHRlckZpZWxkc09iamVjdCIsInNwZWNpYWwiLCJjb250YWlucyIsImZpZWxkIiwiZWxlbWVudCIsImkiLCJpbmRleE9mIiwiZ2V0RGVwdGgiLCJub2RlIiwiZGVwdGgiLCJjb2xsZWN0aW9uTm9kZXMiLCJtYXgiLCJtYXAiLCJsaW1pdCIsImNsZWFuT2JqZWN0IiwicmVzdHJpY3RlZEZpZWxkIiwibWF0Y2hpbmciLCJzdWJmaWVsZCIsInNsaWNlIiwiZ2V0TGlua3MiLCJwYXJlbnROb2RlIiwicmVzdHJpY3RlZExpbmtzIiwiY29sbGVjdGlvbk5vZGUiLCJsaW5rTmFtZSIsInJlbW92ZSIsImV4cG9zdXJlIiwiY29uZmlnUmVzdHJpY3RMaW5rcyIsIkRlbm9ybWFsaXplU2NoZW1hIiwiTGlua0NvbmZpZ0RlZmF1bHRzIiwiTGlua0NvbmZpZ1NjaGVtYSIsImJ5cGFzc1NjaGVtYSIsInR5cGUiLCJXaGVyZSIsIl9jb2xsZWN0aW9uIiwibWV0YWRhdGEiLCJpbnZlcnNlZEJ5IiwiaW5kZXgiLCJ1bmlxdWUiLCJhdXRvcmVtb3ZlIiwiZGVub3JtYWxpemUiLCJPYmplY3RJbmNsdWRpbmciLCJMSU5LX1NUT1JBR0UiLCJMaW5rZXIiLCJhZGRMaW5rcyIsImRhdGEiLCJsaW5rQ29uZmlnIiwibGlua2VyIiwiZ2V0TGlua2VyIiwiaGFzTGluayIsImdldExpbmsiLCJvYmplY3RPcklkIiwibGlua0RhdGEiLCJpc1ZpcnR1YWwiLCJsaW5rU3RvcmFnZUZpZWxkIiwiY3JlYXRlTGluayIsIkxpbmtNYW55IiwiTGlua01hbnlNZXRhIiwiTGlua09uZSIsIkxpbmtPbmVNZXRhIiwic21hcnRBcmd1bWVudHMiLCJkb3QiLCJtYWluQ29sbGVjdGlvbiIsIl9pbml0QXV0b3JlbW92ZSIsIl9pbml0RGVub3JtYWxpemF0aW9uIiwiX2hhbmRsZVJlZmVyZW5jZVJlbW92YWxGb3JWaXJ0dWFsTGlua3MiLCJfaW5pdEluZGV4Iiwib25lVHlwZXMiLCJzdHJhdGVneSIsImlzTWFueSIsInJlbGF0ZWRMaW5rZXIiLCJnZXRMaW5rZWRDb2xsZWN0aW9uIiwiaXNTaW5nbGUiLCJpc01ldGEiLCJpc09uZVJlc3VsdCIsImhlbHBlckNsYXNzIiwiX2dldEhlbHBlckNsYXNzIiwiY29sbGVjdGlvbk5hbWUiLCJfcHJlcGFyZVZpcnR1YWwiLCJfZ2VuZXJhdGVGaWVsZE5hbWUiLCJzdGFydHVwIiwiX3NldHVwVmlydHVhbENvbmZpZyIsInZpcnR1YWxMaW5rQ29uZmlnIiwiY2xlYW5lZENvbGxlY3Rpb25OYW1lIiwicmVwbGFjZSIsImRlZmF1bHRGaWVsZFByZWZpeCIsImFmdGVyIiwiZG9jIiwiYWNjZXNzb3IiLCJmZXRjaCIsImxpbmtlZE9iaiIsImxpbmsiLCJ1bnNldCIsIl9lbnN1cmVJbmRleCIsIiRpbiIsImdldElkcyIsImlkcyIsIml0ZW0iLCJwYWNrYWdlRXhpc3RzIiwiUGFja2FnZSIsImNhY2hlQ29uZmlnIiwicmVmZXJlbmNlRmllbGRTdWZmaXgiLCJpbnZlcnNlZExpbmsiLCJyZWZlcmVuY2VGaWVsZCIsImNhY2hlRmllbGQiLCJjYWNoZSIsImlzRGVub3JtYWxpemVkIiwiaXNTdWJCb2R5RGVub3JtYWxpemVkIiwiY2FjaGVCb2R5IiwiY2FjaGVCb2R5RmllbGRzIiwiYm9keUZpZWxkcyIsIm9taXQiLCJkaWZmZXJlbmNlIiwiY3JlYXRlU2VhcmNoRmlsdGVycyIsImNyZWF0ZU9uZSIsImNyZWF0ZU9uZVZpcnR1YWwiLCJjcmVhdGVPbmVNZXRhIiwiY3JlYXRlT25lTWV0YVZpcnR1YWwiLCJjcmVhdGVNYW55IiwiY3JlYXRlTWFueVZpcnR1YWwiLCJjcmVhdGVNYW55TWV0YSIsImNyZWF0ZU1hbnlNZXRhVmlydHVhbCIsInNpZnQiLCJmaWVsZFN0b3JhZ2UiLCJtZXRhRmlsdGVycyIsInBsdWNrIiwiJGVsZW1NYXRjaCIsIkxpbmsiLCJTbWFydEFyZ3MiLCJsaW5rZWRDb2xsZWN0aW9uIiwiJG1ldGFGaWx0ZXJzIiwiJG1ldGEiLCJzZWFyY2hGaWx0ZXJzIiwiYXBwbGllZEZpbHRlcnMiLCJvdGhlcnMiLCJyZXN1bHQiLCJjbGVhbiIsImlkZW50aWZ5SWQiLCJ3aGF0Iiwic2F2ZVRvRGF0YWJhc2UiLCJnZXRJZCIsImlkZW50aWZ5SWRzIiwiX3ZhbGlkYXRlSWRzIiwidmFsaWRJZHMiLCJqb2luIiwiX3ZpcnR1YWxBY3Rpb24iLCJhY3Rpb24iLCJyZXZlcnNlZExpbmsiLCJlbGVtZW50SWQiLCJpbnNlcnQiLCJzZXQiLCJfaWRzIiwidW5pb24iLCJtb2RpZmllciIsIiRhZGRUb1NldCIsIiRlYWNoIiwidXBkYXRlIiwiZmlsdGVyIiwiJHB1bGxBbGwiLCJtZXRhZGF0YXMiLCJsb2NhbE1ldGFkYXRhIiwicHVzaCIsImV4dGVuZE1ldGFkYXRhIiwiZXhpc3RpbmdNZXRhZGF0YSIsInN1YmZpZWxkVXBkYXRlIiwiJHNldCIsIiRwdWxsIiwic3ViV2hhdCIsIk5hbWVkUXVlcnlCYXNlIiwiaXNOYW1lZFF1ZXJ5IiwicXVlcnlOYW1lIiwicmVzb2x2ZXIiLCJzdWJzY3JpcHRpb25IYW5kbGUiLCJpc0V4cG9zZWQiLCJpc1Jlc29sdmVyIiwic2V0UGFyYW1zIiwiZG9WYWxpZGF0ZVBhcmFtcyIsInZhbGlkYXRlUGFyYW1zIiwiX3ZhbGlkYXRlIiwidmFsaWRhdGlvbkVycm9yIiwiZXJyb3IiLCJuZXdQYXJhbXMiLCJjYWNoZXIiLCJleHBvc2VDb25maWciLCJ2YWxpZGF0b3IiLCJDb3VudFN1YnNjcmlwdGlvbiIsInJlY3Vyc2l2ZUZldGNoIiwicHJlcGFyZUZvclByb2Nlc3MiLCJjYWxsV2l0aFByb21pc2UiLCJCYXNlIiwic3Vic2NyaWJlIiwiY2FsbGJhY2siLCJzdWJzY3JpYmVDb3VudCIsIl9jb3VudGVyIiwidW5zdWJzY3JpYmUiLCJzdG9wIiwidW5zdWJzY3JpYmVDb3VudCIsImZldGNoU3luYyIsImZldGNoT25lU3luYyIsImNhbGxiYWNrT3JPcHRpb25zIiwiX2ZldGNoU3RhdGljIiwiX2ZldGNoUmVhY3RpdmUiLCJmZXRjaE9uZSIsImVyciIsInJlcyIsImdldENvdW50U3luYyIsImdldENvdW50IiwiJGJvZHkiLCJpbnRlcnNlY3REZWVwIiwiYWxsb3dTa2lwIiwic2tpcCIsIk5hbWVkUXVlcnlDbGllbnQiLCJOYW1lZFF1ZXJ5U2VydmVyIiwiY29udGV4dCIsIl9wZXJmb3JtU2VjdXJpdHlDaGVja3MiLCJfZmV0Y2hSZXNvbHZlckRhdGEiLCJkb0VtYm9kaW1lbnRJZkl0QXBwbGllcyIsImNhY2hlSWQiLCJnZW5lcmF0ZVF1ZXJ5SWQiLCJjb3VudEN1cnNvciIsImdldEN1cnNvckZvckNvdW50aW5nIiwiY2FjaGVSZXN1bHRzIiwicmVzb2x2ZSIsImZuIiwic2VsZiIsInN0b3JhZ2UiLCJnZXRBbGwiLCJFSlNPTiIsInN0cmluZ2lmeSIsImZldGNoRGF0YSIsImNsb25lRGVlcCIsIkRFRkFVTFRfVFRMIiwic3RvcmUiLCJjYWNoZURhdGEiLCJzdG9yZURhdGEiLCJ0dGwiLCJzZXRUaW1lb3V0IiwiRXhwb3NlU2NoZW1hIiwiRXhwb3NlRGVmYXVsdHMiLCJtZXJnZURlZXAiLCJfaW5pdE5vcm1hbFF1ZXJ5IiwiX2luaXRNZXRob2QiLCJfaW5pdFB1YmxpY2F0aW9uIiwiX2luaXRDb3VudE1ldGhvZCIsIl9pbml0Q291bnRQdWJsaWNhdGlvbiIsImVtYm9keSIsIl91bmJsb2NrSWZOZWNlc3NhcnkiLCJ0YXJnZXQiLCJzb3VyY2UiLCJRdWVyeUJhc2UiLCJpc0dsb2JhbFF1ZXJ5IiwiUXVlcnlDbGllbnQiLCJRdWVyeVNlcnZlciIsIkNPVU5UU19DT0xMRUNUSU9OX0NMSUVOVCIsIlJlYWN0aXZlVmFyIiwiVHJhY2tlciIsIkNvdW50cyIsImNyZWF0ZUZhdXhTdWJzY3JpcHRpb24iLCJhY2Nlc3NUb2tlbiIsImZhdXhIYW5kbGUiLCJhcmciLCJlcXVhbHMiLCJsYXN0QXJncyIsInRva2VuIiwiX21hcmtlZEZvclVuc3Vic2NyaWJlIiwiZGlzY29ubmVjdENvbXB1dGF0aW9uIiwiYXV0b3J1biIsImhhbmRsZURpc2Nvbm5lY3QiLCJpZCIsInN0YXR1cyIsImNvbm5lY3RlZCIsIl9tYXJrZWRGb3JSZXN1bWUiLCJpc1N1YnNjcmliZWQiLCJjb3VudE1hbmFnZXIiLCJyZWFkeSIsInBhcmFtc09yQm9keSIsImV4aXN0aW5nU2Vzc2lvbiIsInB1Ymxpc2giLCJyZXF1ZXN0IiwiY3Vyc29yIiwiYWRkZWQiLCJoYW5kbGUiLCJvYnNlcnZlQ2hhbmdlcyIsImNoYW5nZWQiLCJyZW1vdmVkIiwib25TdG9wIiwiQWdncmVnYXRlRmlsdGVycyIsInBhcmVudE9iamVjdHMiLCJwYXJlbnQiLCJyZXN1bHRzIiwiY3JlYXRlIiwidW5pcSIsImVsaWdpYmxlT2JqZWN0cyIsInN0b3JhZ2VzIiwiYXJyYXlPZklkcyIsImlzVmFsaWQiLCJjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIiwiY2hpbGRDb2xsZWN0aW9uTm9kZSIsImFnZ3JlZ2F0ZVJlc3VsdHMiLCJhbGxSZXN1bHRzIiwibWV0YUZpbHRlcnNUZXN0IiwicGFyZW50UmVzdWx0IiwiZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzIiwiYWdncmVnYXRlUmVzdWx0IiwiZGF0YXMiLCJhc3NlbWJsZURhdGEiLCJmaWx0ZXJBc3NlbWJsZWREYXRhIiwiY29udGFpbnNEb3R0ZWRGaWVsZHMiLCJwaXBlbGluZSIsIiRtYXRjaCIsIiRzb3J0IiwiZGF0YVB1c2giLCJzYWZlRmllbGQiLCIkZ3JvdXAiLCIkcHVzaCIsIiRzbGljZSIsIiRwcm9qZWN0IiwiU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQiLCJoeXBlcm5vdmFJbml0IiwiYXBwbHlQcm9wcyIsInByZXBhcmVGb3JEZWxpdmVyeSIsInN0b3JlSHlwZXJub3ZhUmVzdWx0cyIsInVzZXJJZFRvUGFzcyIsImFzc2VtYmxlIiwiYXNzZW1ibGVBZ2dyZWdhdGVSZXN1bHRzIiwiYnVpbGRBZ2dyZWdhdGVQaXBlbGluZSIsInNuYXBCYWNrRG90dGVkRmllbGRzIiwiYWdncmVnYXRlRmlsdGVycyIsImZpbHRlcmVkT3B0aW9ucyIsImV4cGxhaW5zIiwiYWdncmVnYXRpb25SZXN1bHQiLCJkb2N1bWVudCIsInJlc3RyaWN0T3B0aW9ucyIsInByb3BzIiwiYXBwbHlGaWVsZHMiLCJteVBhcmFtZXRlcnMiLCJQcm9taXNlIiwicmVqZWN0IiwicmVhc29uIiwiY3JlYXRlTm9kZXMiLCJhZGRGaWVsZE5vZGUiLCJDb2xsZWN0aW9uTm9kZSIsIkZpZWxkTm9kZSIsIlJlZHVjZXJOb2RlIiwiY3JlYXRlUmVkdWNlcnMiLCJzcGVjaWFsRmllbGRzIiwicm9vdCIsImZpZWxkTmFtZSIsImFkZFByb3AiLCJoYW5kbGVEZW5vcm1hbGl6ZWQiLCJzdWJyb290IiwicmVkdWNlciIsImdldFJlZHVjZXIiLCJyZWR1Y2VyTm9kZSIsImZpZWxkTm9kZXMiLCJkb3R0ZWQiLCJmaWVsZE5vZGUiLCJzbmFwQ2FjaGUiLCJvYmoiLCJwcmVmaXgiLCJBcnJheSIsIm5ld09iaiIsInJlY3Vyc2UiLCJvIiwicCIsImlzQXJyYXlJdGVtIiwiZiIsImlzRW1wdHlBcnJheSIsImdldEZpZWxkTmFtZSIsImlzRW1wdHlPYmoiLCJpc051bWJlciIsImlzTmFOIiwicGFyc2VJbnQiLCJwcm9wIiwiaGFzT3duUHJvcGVydHkiLCJhbGxvd2VkQm9keSIsImNsaWVudEJvZHkiLCJhbGxvd2VkQm9keURvdCIsImNsaWVudEJvZHlEb3QiLCJpbnRlcnNlY3Rpb24iLCJidWlsZCIsImludGVyc2VjdGVkRmllbGQiLCJhcHBseVBvc3RGaWx0ZXJzIiwiYXBwbHlQb3N0T3B0aW9ucyIsInJlbW92ZUxpbmtTdG9yYWdlcyIsInN0b3JlT25lUmVzdWx0cyIsImFzc2VtYmxlTWV0YWRhdGEiLCJhcHBseVJlZHVjZXJzIiwiY2xlYW5SZWR1Y2VyTGVmdG92ZXJzIiwiTWluaW1vbmdvIiwic25hcEJhY2tDYWNoZXMiLCJjbG9uZU1ldGFDaGlsZHJlbiIsImFwcGx5UG9zdEZpbHRlciIsInBvc3RGaWx0ZXJzIiwiJHBvc3RGaWx0ZXJzIiwiJHBvc3RPcHRpb25zIiwic29ydGVyIiwiU29ydGVyIiwiZ2V0Q29tcGFyYXRvciIsInN0YXJ0IiwiZW5kIiwiJHBvc3RGaWx0ZXIiLCJzYW1lTGV2ZWxSZXN1bHRzIiwicmVtb3ZlU3RvcmFnZUZpZWxkIiwic2hvdWxkQ2xlYW5TdG9yYWdlIiwicGFyZW50UmVzdWx0cyIsImNoaWxkUmVzdWx0Iiwic3RvcmVNZXRhZGF0YSIsInBhcmVudEVsZW1lbnQiLCIkbWV0YWRhdGEiLCJzdG9yYWdlSXRlbSIsImlzRW1wdHkiLCJzbmFwQ2FjaGVzIiwic25hcENhY2hlc1NpbmdsZXMiLCJzaG91ZFN0b3JlTGlua1N0b3JhZ2UiLCJkZWZhdWx0RmlsdGVyRnVuY3Rpb24iLCJhcHBseUZpbHRlclJlY3Vyc2l2ZSIsImlzUm9vdCIsIiRmaWx0ZXIiLCJhcHBseVBhZ2luYXRpb24iLCJfcGFyYW1zIiwiX2JvZHkiLCJjaGlsZHJlbiIsIm4iLCJwYXJlbnRPYmplY3QiLCJub2RlcyIsInNjaGVkdWxlZEZvckRlbGV0aW9uIiwicmVkdWNlcnMiLCJyZWR1Y2VyTm9kZXMiLCJfc2hvdWxkQ2xlYW5TdG9yYWdlIiwiX25vZGUiLCJoYXNBZGRlZEFueUZpZWxkIiwiaGFzIiwic3BsaXQiLCJoYXNGaWVsZCIsImdldEZpZWxkIiwiaGFzQ29sbGVjdGlvbk5vZGUiLCJoYXNSZWR1Y2VyTm9kZSIsImdldFJlZHVjZXJOb2RlIiwiZ2V0Q29sbGVjdGlvbk5vZGUiLCJnZXROYW1lIiwic3ViTGlua05hbWUiLCJyZWR1Y2UiLCJyZWR1Y2VGdW5jdGlvbiIsImNvbXB1dGUiLCJhZGRSZWR1Y2VycyIsInJlZHVjZXJDb25maWciLCJyZWR1Y2VyTmFtZSIsImNsZWFuTmVzdGVkRmllbGRzIiwicGFydHMiLCJzaGlmdCIsImhhbmRsZUFkZEVsZW1lbnQiLCJoYW5kbGVBZGRSZWR1Y2VyIiwiaGFuZGxlQWRkTGluayIsImhhbmRsZUFkZEZpZWxkIiwiZW1iZWRSZWR1Y2VyV2l0aExpbmsiLCJkb3RzIiwicmVkdWNlckJvZHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsTUFBUCxDQUFjO0FBQUNDLHFCQUFnQixNQUFJQSxlQUFyQjtBQUFxQ0MsbUJBQWMsTUFBSUE7QUFBdkQsQ0FBZDtBQUFxRkgsT0FBT0ksS0FBUCxDQUFhQyxRQUFRLHNCQUFSLENBQWIsRUFBNkM7QUFBQ0MsWUFBUUMsQ0FBUixFQUFVO0FBQUNDLGdCQUFRQyxXQUFSLEdBQW9CRixDQUFwQjtBQUFzQjs7QUFBbEMsQ0FBN0MsRUFBaUYsQ0FBakY7QUFBb0ZQLE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSw0QkFBUixDQUFiLEVBQW1EO0FBQUNDLFlBQVFDLENBQVIsRUFBVTtBQUFDQyxnQkFBUUUsUUFBUixHQUFpQkgsQ0FBakI7QUFBbUI7O0FBQS9CLENBQW5ELEVBQW9GLENBQXBGO0FBQXVGUCxPQUFPSSxLQUFQLENBQWFDLFFBQVEsMkNBQVIsQ0FBYixFQUFrRTtBQUFDQyxZQUFRQyxDQUFSLEVBQVU7QUFBQ0MsZ0JBQVFHLGtCQUFSLEdBQTJCSixDQUEzQjtBQUE2Qjs7QUFBekMsQ0FBbEUsRUFBNkcsQ0FBN0c7QUFBZ0hQLE9BQU9JLEtBQVAsQ0FBYUMsUUFBUSx5Q0FBUixDQUFiLEVBQWdFO0FBQUNDLFlBQVFDLENBQVIsRUFBVTtBQUFDQyxnQkFBUUksZ0JBQVIsR0FBeUJMLENBQXpCO0FBQTJCOztBQUF2QyxDQUFoRSxFQUF5RyxDQUF6RztBQUE0R1AsT0FB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YyxHQUFmLEVBQW9CQyxLQUFwQixFQUEyQjhCLGNBQTNCLENBQVA7QUFDSDtBQUNKO0FBQ0osS0FsQ0Q7QUFtQ0gsQyIsImZpbGUiOiIvcGFja2FnZXMvY3VsdG9mY29kZXJzX2dyYXBoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGliL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQgJy4vbGliL2V4cG9zdXJlL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL2xpbmtzL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL3F1ZXJ5L3JlZHVjZXJzL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgJy4vbGliL25hbWVkUXVlcnkvZXhwb3NlL2V4dGVuc2lvbi5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbGliL25hbWVkUXVlcnkvc3RvcmUnO1xuaW1wb3J0IExpbmtDb25zdGFudHMgZnJvbSAnLi9saWIvbGlua3MvY29uc3RhbnRzJztcblxuZXhwb3J0IHtcbiAgICBOYW1lZFF1ZXJ5U3RvcmUsXG4gICAgTGlua0NvbnN0YW50c1xufVxuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgY3JlYXRlUXVlcnlcbn0gZnJvbSAnLi9saWIvY3JlYXRlUXVlcnkuanMnO1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgRXhwb3N1cmVcbn0gZnJvbSAnLi9saWIvZXhwb3N1cmUvZXhwb3N1cmUuanMnO1xuXG5leHBvcnQge1xuICAgIGRlZmF1bHQgYXMgTWVtb3J5UmVzdWx0Q2FjaGVyXG59IGZyb20gJy4vbGliL25hbWVkUXVlcnkvY2FjaGUvTWVtb3J5UmVzdWx0Q2FjaGVyJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIEJhc2VSZXN1bHRDYWNoZXJcbn0gZnJvbSAnLi9saWIvbmFtZWRRdWVyeS9jYWNoZS9CYXNlUmVzdWx0Q2FjaGVyJztcblxuZXhwb3J0IHtcbiAgICBkZWZhdWx0IGFzIGNvbXBvc2Vcbn0gZnJvbSAnLi9saWIvY29tcG9zZSc7IiwiTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUuYWdncmVnYXRlID0gZnVuY3Rpb24ocGlwZWxpbmVzLCBvcHRpb25zKSB7XG4gICAgY29uc3QgY29sbCA9IHRoaXMucmF3Q29sbGVjdGlvbigpO1xuXG4gICAgcmV0dXJuIE1ldGVvci53cmFwQXN5bmMoY29sbC5hZ2dyZWdhdGUsIGNvbGwpKHBpcGVsaW5lcywgb3B0aW9ucyk7XG59O1xuIiwiaW1wb3J0IGRlZXBFeHRlbmQgZnJvbSAnZGVlcC1leHRlbmQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgIHJldHVybiBkZWVwRXh0ZW5kKHt9LCAuLi5hcmdzKTtcbn0iLCJpbXBvcnQgUXVlcnkgZnJvbSAnLi9xdWVyeS9xdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5qcyc7XG5pbXBvcnQgTmFtZWRRdWVyeVN0b3JlIGZyb20gJy4vbmFtZWRRdWVyeS9zdG9yZS5qcyc7XG5cbi8qKlxuICogVGhpcyBpcyBhIHBvbHltb3JwaGljIGZ1bmN0aW9uLCBpdCBhbGxvd3MgeW91IHRvIGNyZWF0ZSBhIHF1ZXJ5IGFzIGFuIG9iamVjdFxuICogb3IgaXQgYWxzbyBhbGxvd3MgeW91IHRvIHJlLXVzZSBhbiBleGlzdGluZyBxdWVyeSBpZiBpdCdzIGEgbmFtZWQgb25lXG4gKlxuICogQHBhcmFtIGFyZ3NcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZGVmYXVsdCAoLi4uYXJncykgPT4ge1xuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgbGV0IFtuYW1lLCBib2R5LCBvcHRpb25zXSA9IGFyZ3M7XG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIC8vIEl0J3MgYSByZXNvbHZlciBxdWVyeVxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGJvZHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBudWxsLCBib2R5LCBvcHRpb25zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGVudHJ5UG9pbnROYW1lID0gXy5maXJzdChfLmtleXMoYm9keSkpO1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gTW9uZ28uQ29sbGVjdGlvbi5nZXQoZW50cnlQb2ludE5hbWUpO1xuXG4gICAgICAgIGlmICghY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1uYW1lJywgYFdlIGNvdWxkIG5vdCBmaW5kIGFueSBjb2xsZWN0aW9uIHdpdGggdGhlIG5hbWUgXCIke2VudHJ5UG9pbnROYW1lfVwiLiBNYWtlIHN1cmUgaXQgaXMgaW1wb3J0ZWQgcHJpb3IgdG8gdXNpbmcgdGhpc2ApXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY3JlYXRlTmFtZWRRdWVyeShuYW1lLCBjb2xsZWN0aW9uLCBib2R5W2VudHJ5UG9pbnROYW1lXSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUXVlcnkgQ3JlYXRpb24sIGl0IGNhbiBoYXZlIGFuIGVuZHBvaW50IGFzIGNvbGxlY3Rpb24gb3IgYXMgYSBOYW1lZFF1ZXJ5XG4gICAgICAgIGxldCBbYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuICAgICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgICAgICBjb25zdCBlbnRyeVBvaW50TmFtZSA9IF8uZmlyc3QoXy5rZXlzKGJvZHkpKTtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IE1vbmdvLkNvbGxlY3Rpb24uZ2V0KGVudHJ5UG9pbnROYW1lKTtcblxuICAgICAgICBpZiAoIWNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChNZXRlb3IuaXNEZXZlbG9wbWVudCAmJiAhTmFtZWRRdWVyeVN0b3JlLmdldChlbnRyeVBvaW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFlvdSBhcmUgY3JlYXRpbmcgYSBxdWVyeSB3aXRoIHRoZSBlbnRyeSBwb2ludCBcIiR7ZW50cnlQb2ludE5hbWV9XCIsIGJ1dCB0aGVyZSB3YXMgbm8gY29sbGVjdGlvbiBmb3VuZCBmb3IgaXQgKG1heWJlIHlvdSBmb3Jnb3QgdG8gaW1wb3J0IGl0IGNsaWVudC1zaWRlPykuIEl0J3MgYXNzdW1lZCB0aGF0IGl0J3MgcmVmZXJlbmNpbmcgYSBOYW1lZFF1ZXJ5LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOYW1lZFF1ZXJ5KGVudHJ5UG9pbnROYW1lLCBudWxsLCB7fSwge3BhcmFtczogYm9keVtlbnRyeVBvaW50TmFtZV19KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVOb3JtYWxRdWVyeShjb2xsZWN0aW9uLCBib2R5W2VudHJ5UG9pbnROYW1lXSwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU5hbWVkUXVlcnkobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gaWYgaXQgZXhpc3RzIGFscmVhZHksIHdlIHJlLXVzZSBpdFxuICAgIGNvbnN0IG5hbWVkUXVlcnkgPSBOYW1lZFF1ZXJ5U3RvcmUuZ2V0KG5hbWUpO1xuICAgIGxldCBxdWVyeTtcblxuICAgIGlmICghbmFtZWRRdWVyeSkge1xuICAgICAgICBxdWVyeSA9IG5ldyBOYW1lZFF1ZXJ5KG5hbWUsIGNvbGxlY3Rpb24sIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICBOYW1lZFF1ZXJ5U3RvcmUuYWRkKG5hbWUsIHF1ZXJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWVyeSA9IG5hbWVkUXVlcnkuY2xvbmUob3B0aW9ucy5wYXJhbXMpO1xuICAgIH1cblxuICAgIHJldHVybiBxdWVyeTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTm9ybWFsUXVlcnkoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucykgIHtcbiAgICByZXR1cm4gbmV3IFF1ZXJ5KGNvbGxlY3Rpb24sIGJvZHksIG9wdGlvbnMpO1xufVxuIiwiaW1wb3J0IFF1ZXJ5IGZyb20gJy4vcXVlcnkvcXVlcnkuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnkgZnJvbSAnLi9uYW1lZFF1ZXJ5L25hbWVkUXVlcnkuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlTdG9yZSBmcm9tICcuL25hbWVkUXVlcnkvc3RvcmUuanMnO1xuXG5fLmV4dGVuZChNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICAgIGNyZWF0ZVF1ZXJ5KC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy9OYW1lZFF1ZXJ5XG4gICAgICAgICAgICBjb25zdCBbbmFtZSwgYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuICAgICAgICAgICAgY29uc3QgcXVlcnkgPSBuZXcgTmFtZWRRdWVyeShuYW1lLCB0aGlzLCBib2R5LCBvcHRpb25zKTtcbiAgICAgICAgICAgIE5hbWVkUXVlcnlTdG9yZS5hZGQobmFtZSwgcXVlcnkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBbYm9keSwgb3B0aW9uc10gPSBhcmdzO1xuXG4gICAgICAgICAgICByZXR1cm4gbmV3IFF1ZXJ5KHRoaXMsIGJvZHksIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxufSk7IiwiaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3N1cmVEZWZhdWx0cyA9IHtcbiAgICBibG9ja2luZzogZmFsc2UsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHB1YmxpY2F0aW9uOiB0cnVlLFxufTtcblxuZXhwb3J0IGNvbnN0IEV4cG9zdXJlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBtYXhMaW1pdDogTWF0Y2guTWF5YmUoTWF0Y2guSW50ZWdlciksXG4gICAgbWF4RGVwdGg6IE1hdGNoLk1heWJlKE1hdGNoLkludGVnZXIpLFxuICAgIHB1YmxpY2F0aW9uOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBtZXRob2Q6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGJsb2NraW5nOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBib2R5OiBNYXRjaC5NYXliZShPYmplY3QpLFxuICAgIHJlc3RyaWN0ZWRGaWVsZHM6IE1hdGNoLk1heWJlKFtTdHJpbmddKSxcbiAgICByZXN0cmljdExpbmtzOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtTdHJpbmddKVxuICAgICksXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCb2R5KGNvbGxlY3Rpb24sIGJvZHkpIHtcbiAgICB0cnkge1xuICAgICAgICBjcmVhdGVHcmFwaChjb2xsZWN0aW9uLCBib2R5KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtYm9keScsICdXZSBjb3VsZCBub3QgYnVpbGQgYSB2YWxpZCBncmFwaCB3aGVuIHRyeWluZyB0byBjcmVhdGUgeW91ciBleHBvc3VyZTogJyArIGUudG9TdHJpbmcoKSlcbiAgICB9XG59IiwiaW1wb3J0IGdlbkNvdW50RW5kcG9pbnQgZnJvbSAnLi4vcXVlcnkvY291bnRzL2dlbkVuZHBvaW50LnNlcnZlci5qcyc7XG5pbXBvcnQgY3JlYXRlR3JhcGggZnJvbSAnLi4vcXVlcnkvbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVDb21wb3NlIGZyb20gJy4uL3F1ZXJ5L2xpYi9yZWN1cnNpdmVDb21wb3NlLmpzJztcbmltcG9ydCBoeXBlcm5vdmEgZnJvbSAnLi4vcXVlcnkvaHlwZXJub3ZhL2h5cGVybm92YS5qcyc7XG5pbXBvcnQge0V4cG9zdXJlU2NoZW1hLCBFeHBvc3VyZURlZmF1bHRzLCB2YWxpZGF0ZUJvZHl9IGZyb20gJy4vZXhwb3N1cmUuY29uZmlnLnNjaGVtYS5qcyc7XG5pbXBvcnQgZW5mb3JjZU1heERlcHRoIGZyb20gJy4vbGliL2VuZm9yY2VNYXhEZXB0aC5qcyc7XG5pbXBvcnQgZW5mb3JjZU1heExpbWl0IGZyb20gJy4vbGliL2VuZm9yY2VNYXhMaW1pdC5qcyc7XG5pbXBvcnQgY2xlYW5Cb2R5IGZyb20gJy4vbGliL2NsZWFuQm9keS5qcyc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHJlc3RyaWN0RmllbGRzRm4gZnJvbSAnLi9saWIvcmVzdHJpY3RGaWVsZHMuanMnO1xuaW1wb3J0IHJlc3RyaWN0TGlua3MgZnJvbSAnLi9saWIvcmVzdHJpY3RMaW5rcy5qcyc7XG5pbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5sZXQgZ2xvYmFsQ29uZmlnID0ge307XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cG9zdXJlIHtcbiAgICBzdGF0aWMgc2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICBPYmplY3QuYXNzaWduKGdsb2JhbENvbmZpZywgY29uZmlnKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gZ2xvYmFsQ29uZmlnO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXN0cmljdEZpZWxkcyguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiByZXN0cmljdEZpZWxkc0ZuKC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKGNvbGxlY3Rpb24sIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIGNvbGxlY3Rpb24uX19pc0V4cG9zZWRGb3JHcmFwaGVyID0gdHJ1ZTtcbiAgICAgICAgY29sbGVjdGlvbi5fX2V4cG9zdXJlID0gdGhpcztcblxuICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uO1xuICAgICAgICB0aGlzLm5hbWUgPSBgZXhwb3N1cmVfJHtjb2xsZWN0aW9uLl9uYW1lfWA7XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlQW5kQ2xlYW4oKTtcblxuICAgICAgICB0aGlzLmluaXRTZWN1cml0eSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5pbml0UHVibGljYXRpb24oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5tZXRob2QpIHtcbiAgICAgICAgICAgIHRoaXMuaW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5tZXRob2QgJiYgIXRoaXMuY29uZmlnLnB1YmxpY2F0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCd3ZWlyZCcsICdJZiB5b3Ugd2FudCB0byBleHBvc2UgeW91ciBjb2xsZWN0aW9uIHlvdSBuZWVkIHRvIHNwZWNpZnkgYXQgbGVhc3Qgb25lIG9mIFtcIm1ldGhvZFwiLCBcInB1YmxpY2F0aW9uXCJdIG9wdGlvbnMgdG8gdHJ1ZScpXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXRDb3VudE1ldGhvZCgpO1xuICAgICAgICB0aGlzLmluaXRDb3VudFB1YmxpY2F0aW9uKCk7XG4gICAgfVxuXG4gICAgX3ZhbGlkYXRlQW5kQ2xlYW4oKSB7XG4gICAgICAgIGlmICh0eXBlb2YodGhpcy5jb25maWcpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCBmaXJld2FsbCA9IHRoaXMuY29uZmlnO1xuICAgICAgICAgICAgdGhpcy5jb25maWcgPSB7ZmlyZXdhbGx9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBFeHBvc3VyZURlZmF1bHRzLCBFeHBvc3VyZS5nZXRDb25maWcoKSwgdGhpcy5jb25maWcpO1xuICAgICAgICBjaGVjayh0aGlzLmNvbmZpZywgRXhwb3N1cmVTY2hlbWEpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB2YWxpZGF0ZUJvZHkodGhpcy5jb2xsZWN0aW9uLCB0aGlzLmNvbmZpZy5ib2R5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRha2VzIHRoZSBib2R5IGFuZCBpbnRlcnNlY3RzIGl0IHdpdGggdGhlIGV4cG9zdXJlIGJvZHksIGlmIGl0IGV4aXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHBhcmFtIHVzZXJJZFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldFRyYW5zZm9ybWVkQm9keShib2R5LCB1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICByZXR1cm4gYm9keTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NlZEJvZHkgPSB0aGlzLmdldEJvZHkodXNlcklkKTtcblxuICAgICAgICBpZiAocHJvY2Vzc2VkQm9keSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFuQm9keShwcm9jZXNzZWRCb2R5LCBib2R5KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBleHBvc3VyZSBib2R5XG4gICAgICovXG4gICAgZ2V0Qm9keSh1c2VySWQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5ib2R5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdtaXNzaW5nLWJvZHknLCAnQ2Fubm90IGdldCBleHBvc3VyZSBib2R5IGJlY2F1c2UgaXQgd2FzIG5vdCBkZWZpbmVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGJvZHk7XG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odGhpcy5jb25maWcuYm9keSkpIHtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLmNvbmZpZy5ib2R5LmNhbGwodGhpcywgdXNlcklkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJvZHkgPSB0aGlzLmNvbmZpZy5ib2R5O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQgbWVhbnMgd2UgYWxsb3cgZXZlcnl0aGluZywgbm8gbmVlZCBmb3IgY2xvbmluZy5cbiAgICAgICAgaWYgKGJvZHkgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZXBDbG9uZShcbiAgICAgICAgICAgIGJvZHksXG4gICAgICAgICAgICB1c2VySWRcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXppbmcgdGhlIHB1YmxpY2F0aW9uIGZvciByZWFjdGl2ZSBxdWVyeSBmZXRjaGluZ1xuICAgICAqL1xuICAgIGluaXRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUodGhpcy5uYW1lLCBmdW5jdGlvbiAoYm9keSkge1xuICAgICAgICAgICAgbGV0IHRyYW5zZm9ybWVkQm9keSA9IGdldFRyYW5zZm9ybWVkQm9keShib2R5KTtcblxuICAgICAgICAgICAgY29uc3Qgcm9vdE5vZGUgPSBjcmVhdGVHcmFwaChjb2xsZWN0aW9uLCB0cmFuc2Zvcm1lZEJvZHkpO1xuXG4gICAgICAgICAgICBlbmZvcmNlTWF4RGVwdGgocm9vdE5vZGUsIGNvbmZpZy5tYXhEZXB0aCk7XG4gICAgICAgICAgICByZXN0cmljdExpbmtzKHJvb3ROb2RlLCB0aGlzLnVzZXJJZCk7XG5cbiAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVDb21wb3NlKHJvb3ROb2RlLCB0aGlzLnVzZXJJZCwge1xuICAgICAgICAgICAgICAgIGJ5cGFzc0ZpcmV3YWxsczogISFjb25maWcuYm9keVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemV6IHRoZSBtZXRob2QgdG8gcmV0cmlldmUgdGhlIGRhdGEgdmlhIE1ldGVvci5jYWxsXG4gICAgICovXG4gICAgaW5pdE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgICAgIGNvbnN0IGdldFRyYW5zZm9ybWVkQm9keSA9IHRoaXMuZ2V0VHJhbnNmb3JtZWRCb2R5LmJpbmQodGhpcyk7XG5cbiAgICAgICAgY29uc3QgbWV0aG9kQm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgICAgICAgIGlmICghY29uZmlnLmJsb2NraW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0cmFuc2Zvcm1lZEJvZHkgPSBnZXRUcmFuc2Zvcm1lZEJvZHkoYm9keSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvb3ROb2RlID0gY3JlYXRlR3JhcGgoY29sbGVjdGlvbiwgdHJhbnNmb3JtZWRCb2R5KTtcblxuICAgICAgICAgICAgZW5mb3JjZU1heERlcHRoKHJvb3ROb2RlLCBjb25maWcubWF4RGVwdGgpO1xuICAgICAgICAgICAgcmVzdHJpY3RMaW5rcyhyb290Tm9kZSwgdGhpcy51c2VySWQpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBpcyBubyBleHBvc3VyZSBib2R5IGRlZmluZWQsIHRoZW4gd2UgbmVlZCB0byBhcHBseSBmaXJld2FsbHNcbiAgICAgICAgICAgIHJldHVybiBoeXBlcm5vdmEocm9vdE5vZGUsIHRoaXMudXNlcklkLCB7XG4gICAgICAgICAgICAgICAgYnlwYXNzRmlyZXdhbGxzOiAhIWNvbmZpZy5ib2R5XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgICAgICBbdGhpcy5uYW1lXTogbWV0aG9kQm9keVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgbWV0aG9kIHRvIHJldHJpZXZlIHRoZSBjb3VudCBvZiB0aGUgZGF0YSB2aWEgTWV0ZW9yLmNhbGxcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBpbml0Q291bnRNZXRob2QoKSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSB0aGlzLmNvbGxlY3Rpb247XG5cbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZSArICcuY291bnQnXShib2R5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51bmJsb2NrKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbi5maW5kKGJvZHkuJGZpbHRlcnMgfHwge30sIHt9LCB0aGlzLnVzZXJJZCkuY291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplcyB0aGUgcmVhY3RpdmUgZW5kcG9pbnQgdG8gcmV0cmlldmUgdGhlIGNvdW50IG9mIHRoZSBkYXRhLlxuICAgICAqL1xuICAgIGluaXRDb3VudFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcy5jb2xsZWN0aW9uO1xuXG4gICAgICAgIGdlbkNvdW50RW5kcG9pbnQodGhpcy5uYW1lLCB7XG4gICAgICAgICAgICBnZXRDdXJzb3Ioc2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbmQoc2Vzc2lvbi5maWx0ZXJzLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkczoge19pZDogMX0sXG4gICAgICAgICAgICAgICAgfSwgdGhpcy51c2VySWQpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0U2Vzc2lvbihib2R5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZmlsdGVyczogYm9keS4kZmlsdGVycyB8fCB7fSB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgc2VjdXJpdHkgZW5mb3JjZW1lbnRcbiAgICAgKiBUSElOSzogTWF5YmUgaW5zdGVhZCBvZiBvdmVycmlkaW5nIC5maW5kLCBJIGNvdWxkIHN0b3JlIHRoaXMgZGF0YSBvZiBzZWN1cml0eSBpbnNpZGUgdGhlIGNvbGxlY3Rpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIGluaXRTZWN1cml0eSgpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IHRoaXMuY29sbGVjdGlvbjtcbiAgICAgICAgY29uc3Qge2ZpcmV3YWxsLCBtYXhMaW1pdCwgcmVzdHJpY3RlZEZpZWxkc30gPSB0aGlzLmNvbmZpZztcbiAgICAgICAgY29uc3QgZmluZCA9IGNvbGxlY3Rpb24uZmluZC5iaW5kKGNvbGxlY3Rpb24pO1xuICAgICAgICBjb25zdCBmaW5kT25lID0gY29sbGVjdGlvbi5maW5kT25lLmJpbmQoY29sbGVjdGlvbik7XG5cbiAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbCA9IChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpID0+IHtcbiAgICAgICAgICAgIGlmICh1c2VySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NhbGxGaXJld2FsbCh7Y29sbGVjdGlvbjogY29sbGVjdGlvbn0sIGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG5cbiAgICAgICAgICAgICAgICBlbmZvcmNlTWF4TGltaXQob3B0aW9ucywgbWF4TGltaXQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3RyaWN0ZWRGaWVsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgRXhwb3N1cmUucmVzdHJpY3RGaWVsZHMoZmlsdGVycywgb3B0aW9ucywgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbGxlY3Rpb24uZmluZCA9IGZ1bmN0aW9uIChmaWx0ZXJzLCBvcHRpb25zID0ge30sIHVzZXJJZCA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgZmlsdGVycyBpcyB1bmRlZmluZWQgaXQgc2hvdWxkIHJldHVybiBhbiBlbXB0eSBpdGVtXG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgZmlsdGVycyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbmQodW5kZWZpbmVkLCBvcHRpb25zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmluZChmaWx0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb2xsZWN0aW9uLmZpbmRPbmUgPSBmdW5jdGlvbiAoZmlsdGVycywgb3B0aW9ucyA9IHt9LCB1c2VySWQgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIC8vIElmIGZpbHRlcnMgaXMgdW5kZWZpbmVkIGl0IHNob3VsZCByZXR1cm4gYW4gZW1wdHkgaXRlbVxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGZpbHRlcnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mKGZpbHRlcnMpID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGZpbHRlcnMgPSB7X2lkOiBmaWx0ZXJzfTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sbGVjdGlvbi5maXJld2FsbChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmluZE9uZShmaWx0ZXJzLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NhbGxGaXJld2FsbCguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHtmaXJld2FsbH0gPSB0aGlzLmNvbmZpZztcbiAgICAgICAgaWYgKCFmaXJld2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaXJld2FsbCkpIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmZvckVhY2goZmlyZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZS5jYWxsKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmNhbGwoLi4uYXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiaW1wb3J0IEV4cG9zdXJlIGZyb20gJy4vZXhwb3N1cmUuanMnO1xuXG5fLmV4dGVuZChNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICAgIGV4cG9zZShjb25maWcpIHtcbiAgICAgICAgaWYgKCFNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgYFlvdSBjYW4gb25seSBleHBvc2UgYSBjb2xsZWN0aW9uIHNlcnZlciBzaWRlLiAke3RoaXMuX25hbWV9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBuZXcgRXhwb3N1cmUodGhpcywgY29uZmlnKTtcbiAgICB9XG59KTsiLCJpbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IHtjbGVhbkZpbHRlcnMsIGNsZWFuT3B0aW9uc30gZnJvbSAnLi9jbGVhblNlbGVjdG9ycyc7XG5pbXBvcnQgZG90aXplIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9kb3RpemUnO1xuXG4vKipcbiAqIERlZXAgSW50ZXIgQ29tcHV0YXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xlYW5Cb2R5KG1haW4sIHNlY29uZCwgLi4uYXJncykge1xuICAgIGxldCBvYmplY3QgPSB7fTtcblxuICAgIGlmIChzZWNvbmQuJGZpbHRlcnMgfHwgc2Vjb25kLiRvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGZpZWxkcyA9IGdldEZpZWxkcyhtYWluKTtcblxuICAgICAgICBjbGVhbkZpbHRlcnMoc2Vjb25kLiRmaWx0ZXJzLCBmaWVsZHMpO1xuICAgICAgICBjbGVhbk9wdGlvbnMoc2Vjb25kLiRvcHRpb25zLCBmaWVsZHMpO1xuICAgIH1cblxuICAgIF8uZWFjaChzZWNvbmQsIChzZWNvbmRWYWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09ICckZmlsdGVycycgfHwga2V5ID09PSAnJG9wdGlvbnMnKSB7XG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHNlY29uZFZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gbWFpbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCB3ZSBydW4gaXQuXG4gICAgICAgIGlmIChfLmlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmNhbGwobnVsbCwgLi4uYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbWFpbiB2YWx1ZSBpcyB1bmRlZmluZWQgb3IgZmFsc2UsIHdlIHNraXAgdGhlIG1lcmdlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2UgdHJlYXQgdGhpcyBzcGVjaWFsbHksIGlmIHRoZSB2YWx1ZSBpcyB0cnVlXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgb2JqZWN0W2tleV0gPSBfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSA/IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSkgOiB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIGFuIG9iamVjdFxuICAgICAgICBpZiAoXy5pc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHNlY29uZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzZWNvbmQgb25lIGlzIGFuIG9iamVjdCBhcyB3ZWxsIHdlIHJ1biByZWN1cnNpdmVseSBydW4gdGhlIGludGVyc2VjdGlvblxuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gY2xlYW5Cb2R5KHZhbHVlLCBzZWNvbmRWYWx1ZSwgLi4uYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZiBpdCBpcyBub3QsIHRoZW4gd2Ugd2lsbCBpZ25vcmUgaXQsIGJlY2F1c2UgaXQgd29uJ3QgbWFrZSBzZW5zZS5cbiAgICAgICAgICAgIC8vIHRvIG1lcmdlIHthOiAxfSB3aXRoIDEuXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtYWluIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIGl0IHNob3VsZCBiZSBhIHRydXRoeSB2YWx1ZSBsaWtlIDFcbiAgICAgICAgaWYgKF8uaXNPYmplY3Qoc2Vjb25kVmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIGFuIG9iamVjdCwgdGhlbiB3ZSB3aWxsIGtlZXAgaXQuXG4gICAgICAgICAgICAvLyB0aGlzIHdvbid0IGNhdXNlIHByb2JsZW0gd2l0aCBkZWVwIG5lc3RpbmcgYmVjYXVzZVxuICAgICAgICAgICAgLy8gd2hlbiB5b3Ugc3BlY2lmeSBsaW5rcyB5b3Ugd2lsbCBoYXZlIHRoZSBtYWluIHZhbHVlIGFzIGFuIG9iamVjdCwgb3RoZXJ3aXNlIGl0IHdpbGwgZmFpbFxuICAgICAgICAgICAgLy8gdGhpcyBpcyB1c2VkIGZvciB0aGluZ3MgbGlrZSB3aGVuIHlvdSBoYXZlIGEgaGFzaCBvYmplY3QgbGlrZSBwcm9maWxlIHdpdGggbXVsdGlwbGUgbmVzdGluZyBmaWVsZHMsIHlvdSBjYW4gYWxsb3cgdGhlIGNsaWVudCB0byBzcGVjaWZ5IG9ubHkgd2hhdCBoZSBuZWVkc1xuXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IGRlZXBDbG9uZShzZWNvbmRWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiB0aGUgc2Vjb25kIHZhbHVlIGlzIG5vdCBhbiBvYmplY3QsIHdlIGp1c3Qgc3RvcmUgdGhlIGZpcnN0IHZhbHVlXG4gICAgICAgICAgICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBnZXRGaWVsZHMoYm9keSkge1xuICAgIHJldHVybiBfLmtleXMoZG90aXplLmNvbnZlcnQoYm9keSkpO1xufSIsImV4cG9ydCBmdW5jdGlvbiBjbGVhbk9wdGlvbnMob3B0aW9ucywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBfLnBpY2sob3B0aW9ucy5maWVsZHMsIC4uLmVuc3VyZUZpZWxkcyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBvcHRpb25zLnNvcnQgPSBfLnBpY2sob3B0aW9ucy5zb3J0LCAuLi5lbnN1cmVGaWVsZHMpO1xuICAgIH1cbn1cblxuY29uc3QgZGVlcEZpbHRlckZpZWxkc0FycmF5ID0gWyckYW5kJywgJyRvcicsICckbm9yJ107XG5jb25zdCBkZWVwRmlsdGVyRmllbGRzT2JqZWN0ID0gWyckbm90J107XG5jb25zdCBzcGVjaWFsID0gWy4uLmRlZXBGaWx0ZXJGaWVsZHNBcnJheSwgLi4uZGVlcEZpbHRlckZpZWxkc09iamVjdF07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgZW5zdXJlRmllbGRzKSB7XG4gICAgaWYgKCFmaWx0ZXJzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfLmVhY2goZmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFfLmNvbnRhaW5zKHNwZWNpYWwsIGtleSkpIHtcbiAgICAgICAgICAgIGlmICghZmllbGRFeGlzdHMoZW5zdXJlRmllbGRzLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZpbHRlcnNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc0FycmF5LmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICBpZiAoZmlsdGVyc1tmaWVsZF0pIHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRdLmZvckVhY2goZWxlbWVudCA9PiBjbGVhbkZpbHRlcnMoZWxlbWVudCwgZW5zdXJlRmllbGRzKSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2ZpZWxkXSkge1xuICAgICAgICAgICAgY2xlYW5GaWx0ZXJzKGZpbHRlcnNbZmllbGRdLCBlbnN1cmVGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogVGhpcyB3aWxsIGNoZWNrIGlmIGEgZmllbGQgZXhpc3RzIGluIGEgc2V0IG9mIGZpZWxkc1xuICogSWYgZmllbGRzIGNvbnRhaW5zIFtcInByb2ZpbGVcIl0sIHRoZW4gXCJwcm9maWxlLnNvbWV0aGluZ1wiIHdpbGwgcmV0dXJuIHRydWVcbiAqXG4gKiBAcGFyYW0gZmllbGRzXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpZWxkRXhpc3RzKGZpZWxkcywga2V5KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGZpZWxkc1tpXSA9PT0ga2V5IHx8IGtleS5pbmRleE9mKGZpZWxkc1tpXSArICcuJykgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG5vZGUsIG1heERlcHRoKSB7XG4gICAgaWYgKG1heERlcHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuXG4gICAgY29uc3QgZGVwdGggPSBnZXREZXB0aChub2RlKTtcblxuICAgIGlmIChkZXB0aCA+IG1heERlcHRoKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3Rvby1kZWVwJywgJ1lvdXIgZ3JhcGggcmVxdWVzdCBpcyB0b28gZGVlcCBhbmQgaXQgaXMgbm90IGFsbG93ZWQuJylcbiAgICB9XG5cbiAgICByZXR1cm4gbm9kZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlcHRoKG5vZGUpIHtcbiAgICBpZiAobm9kZS5jb2xsZWN0aW9uTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIHJldHVybiAxICsgXy5tYXgoXG4gICAgICAgIF8ubWFwKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBnZXREZXB0aClcbiAgICApO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zLCBtYXhMaW1pdCkge1xuICAgIGlmIChtYXhMaW1pdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5saW1pdCkge1xuICAgICAgICBpZiAob3B0aW9ucy5saW1pdCA+IG1heExpbWl0KSB7XG4gICAgICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLmxpbWl0ID0gbWF4TGltaXQ7XG4gICAgfVxufSIsImNvbnN0IGRlZXBGaWx0ZXJGaWVsZHNBcnJheSA9IFsnJGFuZCcsICckb3InLCAnJG5vciddO1xuY29uc3QgZGVlcEZpbHRlckZpZWxkc09iamVjdCA9IFsnJG5vdCddO1xuXG4vKipcbiAqIFRoaXMgaXMgdXNlZCB0byByZXN0cmljdCBzb21lIGZpZWxkcyB0byBzb21lIHVzZXJzLCBieSBwYXNzaW5nIHRoZSBmaWVsZHMgYXMgYXJyYXkgaW4gdGhlIGV4cG9zdXJlIG9iamVjdFxuICogRm9yIGV4YW1wbGUgaW4gYW4gdXNlciBleHBvc3VyZTogcmVzdHJpY3RGaWVsZHMob3B0aW9ucywgWydzZXJ2aWNlcycsICdjcmVhdGVkQXQnXSlcbiAqXG4gKiBAcGFyYW0gZmlsdGVycyBPYmplY3RcbiAqIEBwYXJhbSBvcHRpb25zIE9iamVjdFxuICogQHBhcmFtIHJlc3RyaWN0ZWRGaWVsZHMgQXJyYXlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzdHJpY3RGaWVsZHMoZmlsdGVycywgb3B0aW9ucywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmICghXy5pc0FycmF5KHJlc3RyaWN0ZWRGaWVsZHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtcGFyYW1ldGVycycsICdQbGVhc2Ugc3BlY2lmeSBhbiBhcnJheSBvZiByZXN0cmljdGVkIGZpZWxkcy4nKTtcbiAgICB9XG5cbiAgICBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcyk7XG4gICAgY2xlYW5PcHRpb25zKG9wdGlvbnMsIHJlc3RyaWN0ZWRGaWVsZHMpXG59XG5cbi8qKlxuICogRGVlcCBjbGVhbnMgZmlsdGVyc1xuICpcbiAqIEBwYXJhbSBmaWx0ZXJzXG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbkZpbHRlcnMoZmlsdGVycywgcmVzdHJpY3RlZEZpZWxkcykge1xuICAgIGlmIChmaWx0ZXJzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KGZpbHRlcnMsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNBcnJheS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBmaWx0ZXJzW2ZpZWxkXS5mb3JFYWNoKGVsZW1lbnQgPT4gY2xlYW5GaWx0ZXJzKGVsZW1lbnQsIHJlc3RyaWN0ZWRGaWVsZHMpKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZGVlcEZpbHRlckZpZWxkc09iamVjdC5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBjbGVhbkZpbHRlcnMoZmlsdGVyc1tmaWVsZF0sIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogRGVlcGx5IGNsZWFucyBvcHRpb25zXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSByZXN0cmljdGVkRmllbGRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhvcHRpb25zLCByZXN0cmljdGVkRmllbGRzKSB7XG4gICAgaWYgKG9wdGlvbnMuZmllbGRzKSB7XG4gICAgICAgIGNsZWFuT2JqZWN0KG9wdGlvbnMuZmllbGRzLCByZXN0cmljdGVkRmllbGRzKTtcblxuICAgICAgICBpZiAoXy5rZXlzKG9wdGlvbnMuZmllbGRzKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKG9wdGlvbnMuZmllbGRzLCB7X2lkOiAxfSlcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuZmllbGRzID0ge19pZDogMX07XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICBjbGVhbk9iamVjdChvcHRpb25zLnNvcnQsIHJlc3RyaWN0ZWRGaWVsZHMpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDbGVhbnMgdGhlIG9iamVjdCAobm90IGRlZXBseSlcbiAqXG4gKiBAcGFyYW0gb2JqZWN0XG4gKiBAcGFyYW0gcmVzdHJpY3RlZEZpZWxkc1xuICovXG5mdW5jdGlvbiBjbGVhbk9iamVjdChvYmplY3QsIHJlc3RyaWN0ZWRGaWVsZHMpIHtcbiAgICBfLmVhY2gob2JqZWN0LCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICByZXN0cmljdGVkRmllbGRzLmZvckVhY2goKHJlc3RyaWN0ZWRGaWVsZCkgPT4ge1xuICAgICAgICAgICAgaWYgKG1hdGNoaW5nKHJlc3RyaWN0ZWRGaWVsZCwga2V5KSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgZmllbGQgPT0gc3ViZmllbGQgb3IgaWYgYCR7ZmllbGR9LmAgSU5DTFVERUQgaW4gc3ViZmllbGRcbiAqIEV4YW1wbGU6IFwicHJvZmlsZVwiIGFuZCBcInByb2ZpbGUuZmlyc3ROYW1lXCIgd2lsbCBiZSBhIG1hdGNoaW5nIGZpZWxkXG4gKiBAcGFyYW0gZmllbGRcbiAqIEBwYXJhbSBzdWJmaWVsZFxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIG1hdGNoaW5nKGZpZWxkLCBzdWJmaWVsZCkge1xuICAgIGlmIChmaWVsZCA9PT0gc3ViZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YmZpZWxkLnNsaWNlKDAsIGZpZWxkLmxlbmd0aCArIDEpID09PSBmaWVsZCArICcuJztcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXN0cmljdExpbmtzKHBhcmVudE5vZGUsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN0cmljdGVkTGlua3MgPSBnZXRMaW5rcyhwYXJlbnROb2RlLCAuLi5hcmdzKTtcblxuICAgIGlmICghcmVzdHJpY3RlZExpbmtzIHx8IHJlc3RyaWN0ZWRMaW5rcy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIF8uZWFjaChwYXJlbnROb2RlLmNvbGxlY3Rpb25Ob2RlcywgY29sbGVjdGlvbk5vZGUgPT4ge1xuICAgICAgICBpZiAoXy5jb250YWlucyhyZXN0cmljdGVkTGlua3MsIGNvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lKSkge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmUoY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5rcyhub2RlLCAuLi5hcmdzKSB7XG4gICAgaWYgKG5vZGUuY29sbGVjdGlvbiAmJiBub2RlLmNvbGxlY3Rpb24uX19leHBvc3VyZSkge1xuICAgICAgICBjb25zdCBleHBvc3VyZSA9IG5vZGUuY29sbGVjdGlvbi5fX2V4cG9zdXJlO1xuXG4gICAgICAgIGlmIChleHBvc3VyZS5jb25maWcucmVzdHJpY3RMaW5rcykge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnUmVzdHJpY3RMaW5rcyA9IGV4cG9zdXJlLmNvbmZpZy5yZXN0cmljdExpbmtzO1xuXG4gICAgICAgICAgICBpZiAoXy5pc0FycmF5KGNvbmZpZ1Jlc3RyaWN0TGlua3MpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1Jlc3RyaWN0TGlua3M7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjb25maWdSZXN0cmljdExpbmtzKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7TWF0Y2h9IGZyb20gJ21ldGVvci9jaGVjayc7XG5pbXBvcnQge01vbmdvfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5leHBvcnQgY29uc3QgRGVub3JtYWxpemVTY2hlbWEgPSB7XG4gICAgZmllbGQ6IFN0cmluZyxcbiAgICBib2R5OiBPYmplY3QsXG4gICAgYnlwYXNzU2NoZW1hOiBNYXRjaC5NYXliZShCb29sZWFuKVxufTtcblxuZXhwb3J0IGNvbnN0IExpbmtDb25maWdEZWZhdWx0cyA9IHtcbiAgICB0eXBlOiAnb25lJyxcbn07XG5cbmV4cG9ydCBjb25zdCBMaW5rQ29uZmlnU2NoZW1hID0ge1xuICAgIHR5cGU6IE1hdGNoLk1heWJlKE1hdGNoLk9uZU9mKCdvbmUnLCAnbWFueScsICcxJywgJyonKSksXG4gICAgY29sbGVjdGlvbjogTWF0Y2guTWF5YmUoXG4gICAgICAgIE1hdGNoLldoZXJlKGNvbGxlY3Rpb24gPT4ge1xuICAgICAgICAgICAgLy8gV2UgZG8gbGlrZSB0aGlzIHNvIGl0IHdvcmtzIHdpdGggb3RoZXIgdHlwZXMgb2YgY29sbGVjdGlvbnMgXG4gICAgICAgICAgICAvLyBsaWtlIEZTLkNvbGxlY3Rpb25cbiAgICAgICAgICAgIHJldHVybiBfLmlzT2JqZWN0KGNvbGxlY3Rpb24pICYmIChcbiAgICAgICAgICAgICAgICBjb2xsZWN0aW9uIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvblxuICAgICAgICAgICAgICAgIHx8IFxuICAgICAgICAgICAgICAgICEhY29sbGVjdGlvbi5fY29sbGVjdGlvblxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICApLFxuICAgIGZpZWxkOiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIG1ldGFkYXRhOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBpbnZlcnNlZEJ5OiBNYXRjaC5NYXliZShTdHJpbmcpLFxuICAgIGluZGV4OiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICB1bmlxdWU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGF1dG9yZW1vdmU6IE1hdGNoLk1heWJlKEJvb2xlYW4pLFxuICAgIGRlbm9ybWFsaXplOiBNYXRjaC5NYXliZShNYXRjaC5PYmplY3RJbmNsdWRpbmcoRGVub3JtYWxpemVTY2hlbWEpKSxcbn07IiwiZXhwb3J0IGNvbnN0IExJTktfU1RPUkFHRSA9ICdfX2xpbmtzJztcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCB7TElOS19TVE9SQUdFfSBmcm9tICcuL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgTGlua2VyIGZyb20gJy4vbGlua2VyLmpzJztcblxuXy5leHRlbmQoTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUsIHtcbiAgICAvKipcbiAgICAgKiBUaGUgZGF0YSB3ZSBhZGQgc2hvdWxkIGJlIHZhbGlkIGZvciBjb25maWcuc2NoZW1hLmpzXG4gICAgICovXG4gICAgYWRkTGlua3MoZGF0YSkge1xuICAgICAgICBpZiAoIXRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgdGhpc1tMSU5LX1NUT1JBR0VdID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBfLmVhY2goZGF0YSwgKGxpbmtDb25maWcsIGxpbmtOYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1tMSU5LX1NUT1JBR0VdW2xpbmtOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYFlvdSBjYW5ub3QgYWRkIHRoZSBsaW5rIHdpdGggbmFtZTogJHtsaW5rTmFtZX0gYmVjYXVzZSBpdCB3YXMgYWxyZWFkeSBhZGRlZCB0byAke3RoaXMuX25hbWV9IGNvbGxlY3Rpb25gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBsaW5rZXIgPSBuZXcgTGlua2VyKHRoaXMsIGxpbmtOYW1lLCBsaW5rQ29uZmlnKTtcblxuICAgICAgICAgICAgXy5leHRlbmQodGhpc1tMSU5LX1NUT1JBR0VdLCB7XG4gICAgICAgICAgICAgICAgW2xpbmtOYW1lXTogbGlua2VyXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBcbiAgICBnZXRMaW5rcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXTtcbiAgICB9LFxuXG4gICAgZ2V0TGlua2VyKG5hbWUpIHtcbiAgICAgICAgaWYgKHRoaXNbTElOS19TVE9SQUdFXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBoYXNMaW5rKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzW0xJTktfU1RPUkFHRV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAhIXRoaXNbTElOS19TVE9SQUdFXVtuYW1lXTtcbiAgICB9LFxuXG4gICAgZ2V0TGluayhvYmplY3RPcklkLCBuYW1lKSB7XG4gICAgICAgIGxldCBsaW5rRGF0YSA9IHRoaXNbTElOS19TVE9SQUdFXTtcblxuICAgICAgICBpZiAoIWxpbmtEYXRhKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBUaGVyZSBhcmUgbm8gbGlua3MgZGVmaW5lZCBmb3IgY29sbGVjdGlvbjogJHt0aGlzLl9uYW1lfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFsaW5rRGF0YVtuYW1lXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgVGhlcmUgaXMgbm8gbGluayAke25hbWV9IGZvciBjb2xsZWN0aW9uOiAke3RoaXMuX25hbWV9YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBsaW5rZXIgPSBsaW5rRGF0YVtuYW1lXTtcbiAgICAgICAgbGV0IG9iamVjdCA9IG9iamVjdE9ySWQ7XG4gICAgICAgIGlmICh0eXBlb2Yob2JqZWN0T3JJZCkgPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmICghbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0gdGhpcy5maW5kT25lKG9iamVjdE9ySWQsIHtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBbbGlua2VyLmxpbmtTdG9yYWdlRmllbGRdOiAxXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0ID0ge19pZDogb2JqZWN0T3JJZH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgV2UgY291bGQgbm90IGZpbmQgYW55IG9iamVjdCB3aXRoIF9pZDogXCIke29iamVjdE9ySWR9XCIgd2l0aGluIHRoZSBjb2xsZWN0aW9uOiAke3RoaXMuX25hbWV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlua0RhdGFbbmFtZV0uY3JlYXRlTGluayhvYmplY3QpO1xuICAgIH1cbn0pO1xuXG4iLCJpbXBvcnQgTGlua01hbnkgZnJvbSAnLi9saW5rVHlwZXMvbGlua01hbnkuanMnO1xuaW1wb3J0IExpbmtNYW55TWV0YSBmcm9tICcuL2xpbmtUeXBlcy9saW5rTWFueU1ldGEuanMnO1xuaW1wb3J0IExpbmtPbmUgZnJvbSAnLi9saW5rVHlwZXMvbGlua09uZS5qcyc7XG5pbXBvcnQgTGlua09uZU1ldGEgZnJvbSAnLi9saW5rVHlwZXMvbGlua09uZU1ldGEuanMnO1xuaW1wb3J0IHtMaW5rQ29uZmlnU2NoZW1hLCBMaW5rQ29uZmlnRGVmYXVsdHN9IGZyb20gJy4vY29uZmlnLnNjaGVtYS5qcyc7XG5pbXBvcnQgc21hcnRBcmd1bWVudHMgZnJvbSAnLi9saW5rVHlwZXMvbGliL3NtYXJ0QXJndW1lbnRzJztcbmltcG9ydCBkb3QgZnJvbSAnZG90LW9iamVjdCc7XG5pbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtlciB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1haW5Db2xsZWN0aW9uXG4gICAgICogQHBhcmFtIGxpbmtOYW1lXG4gICAgICogQHBhcmFtIGxpbmtDb25maWdcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtYWluQ29sbGVjdGlvbiwgbGlua05hbWUsIGxpbmtDb25maWcpIHtcbiAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbiA9IG1haW5Db2xsZWN0aW9uO1xuICAgICAgICB0aGlzLmxpbmtDb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBMaW5rQ29uZmlnRGVmYXVsdHMsIGxpbmtDb25maWcpO1xuICAgICAgICB0aGlzLmxpbmtOYW1lID0gbGlua05hbWU7XG5cbiAgICAgICAgLy8gY2hlY2sgbGlua05hbWUgbXVzdCBub3QgZXhpc3QgaW4gc2NoZW1hXG4gICAgICAgIHRoaXMuX3ZhbGlkYXRlQW5kQ2xlYW4oKTtcblxuICAgICAgICAvLyBpbml0aWFsaXplIGNhc2NhZGUgcmVtb3ZhbCBob29rcy5cbiAgICAgICAgdGhpcy5faW5pdEF1dG9yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5faW5pdERlbm9ybWFsaXphdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgdmlydHVhbCBmaWVsZCBtYWtlIHN1cmUgdGhhdCB3aGVuIHRoaXMgaXMgZGVsZXRlZCwgaXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIHJlZmVyZW5jZXNcbiAgICAgICAgICAgIGlmICghbGlua0NvbmZpZy5hdXRvcmVtb3ZlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlUmVmZXJlbmNlUmVtb3ZhbEZvclZpcnR1YWxMaW5rcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5faW5pdEluZGV4KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWx1ZXMgd2hpY2ggcmVwcmVzZW50IGZvciB0aGUgcmVsYXRpb24gYSBzaW5nbGUgbGlua1xuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cbiAgICBnZXQgb25lVHlwZXMoKSB7XG4gICAgICAgIHJldHVybiBbJ29uZScsICcxJ107XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc3RyYXRlZ2llczogb25lLCBtYW55LCBvbmUtbWV0YSwgbWFueS1tZXRhXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgc3RyYXRlZ3koKSB7XG4gICAgICAgIGxldCBzdHJhdGVneSA9IHRoaXMuaXNNYW55KCkgPyAnbWFueScgOiAnb25lJztcbiAgICAgICAgaWYgKHRoaXMubGlua0NvbmZpZy5tZXRhZGF0YSkge1xuICAgICAgICAgICAgc3RyYXRlZ3kgKz0gJy1tZXRhJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdHJhdGVneTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBmaWVsZCBuYW1lIGluIHRoZSBkb2N1bWVudCB3aGVyZSB0aGUgYWN0dWFsIHJlbGF0aW9uc2hpcHMgYXJlIHN0b3JlZC5cbiAgICAgKiBAcmV0dXJucyBzdHJpbmdcbiAgICAgKi9cbiAgICBnZXQgbGlua1N0b3JhZ2VGaWVsZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpbmtDb25maWcucmVsYXRlZExpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5maWVsZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29sbGVjdGlvbiB0aGF0IGlzIGxpbmtlZCB3aXRoIHRoZSBjdXJyZW50IGNvbGxlY3Rpb25cbiAgICAgKiBAcmV0dXJucyBNb25nby5Db2xsZWN0aW9uXG4gICAgICovXG4gICAgZ2V0TGlua2VkQ29sbGVjdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIHRoZSByZWxhdGlvbnNoaXAgZm9yIHRoaXMgbGluayBpcyBvZiBcIm1hbnlcIiB0eXBlLlxuICAgICAqL1xuICAgIGlzTWFueSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzU2luZ2xlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHJlbGF0aW9uc2hpcCBmb3IgdGhpcyBsaW5rIGNvbnRhaW5zIG1ldGFkYXRhXG4gICAgICovXG4gICAgaXNNZXRhKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmlzTWV0YSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhdGhpcy5saW5rQ29uZmlnLm1ldGFkYXRhO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGlzU2luZ2xlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmlzU2luZ2xlKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gXy5jb250YWlucyh0aGlzLm9uZVR5cGVzLCB0aGlzLmxpbmtDb25maWcudHlwZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNWaXJ0dWFsKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmxpbmtDb25maWcuaW52ZXJzZWRCeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgcmV0dXJuIGEgc2luZ2xlIHJlc3VsdC5cbiAgICAgKi9cbiAgICBpc09uZVJlc3VsdCgpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICh0aGlzLmlzVmlydHVhbCgpICYmIHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmxpbmtDb25maWcudW5pcXVlKVxuICAgICAgICAgICAgfHwgKCF0aGlzLmlzVmlydHVhbCgpICYmIHRoaXMuaXNTaW5nbGUoKSlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JqZWN0XG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb24gVG8gaW1wZXJzb25hdGUgdGhlIGdldExpbmtlZENvbGxlY3Rpb24oKSBvZiB0aGUgXCJMaW5rZXJcIlxuICAgICAqXG4gICAgICogQHJldHVybnMge0xpbmtPbmV8TGlua01hbnl8TGlua01hbnlNZXRhfExpbmtPbmVNZXRhfExpbmtSZXNvbHZlfVxuICAgICAqL1xuICAgIGNyZWF0ZUxpbmsob2JqZWN0LCBjb2xsZWN0aW9uID0gbnVsbCkge1xuICAgICAgICBsZXQgaGVscGVyQ2xhc3MgPSB0aGlzLl9nZXRIZWxwZXJDbGFzcygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgaGVscGVyQ2xhc3ModGhpcywgb2JqZWN0LCBjb2xsZWN0aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZUFuZENsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbmZpZycsIGBGb3IgdGhlIGxpbmsgJHt0aGlzLmxpbmtOYW1lfSB5b3UgZGlkIG5vdCBwcm92aWRlIGEgY29sbGVjdGlvbi5gKVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZih0aGlzLmxpbmtDb25maWcuY29sbGVjdGlvbikgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uO1xuICAgICAgICAgICAgdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLmdldChjb2xsZWN0aW9uTmFtZSk7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLmNvbGxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbGxlY3Rpb24nLCBgQ291bGQgbm90IGZpbmQgYSBjb2xsZWN0aW9uIHdpdGggdGhlIG5hbWU6ICR7Y29sbGVjdGlvbk5hbWV9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ByZXBhcmVWaXJ0dWFsKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy50eXBlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saW5rQ29uZmlnLnR5cGUgPSAnb25lJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuZmllbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxpbmtDb25maWcuZmllbGQgPSB0aGlzLl9nZW5lcmF0ZUZpZWxkTmFtZSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmZpZWxkID09IHRoaXMubGlua05hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb25maWcnLCBgRm9yIHRoZSBsaW5rICR7dGhpcy5saW5rTmFtZX0geW91IG11c3Qgbm90IHVzZSB0aGUgc2FtZSBuYW1lIGZvciB0aGUgZmllbGQsIG90aGVyd2lzZSBpdCB3aWxsIGNhdXNlIGNvbmZsaWN0cyB3aGVuIGZldGNoaW5nIGRhdGFgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGVjayh0aGlzLmxpbmtDb25maWcsIExpbmtDb25maWdTY2hlbWEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlIG5lZWQgdG8gYXBwbHkgc2FtZSB0eXBlIG9mIHJ1bGVzIGluIHRoaXMgY2FzZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9wcmVwYXJlVmlydHVhbCgpIHtcbiAgICAgICAgY29uc3Qge2NvbGxlY3Rpb24sIGludmVyc2VkQnl9ID0gdGhpcy5saW5rQ29uZmlnO1xuICAgICAgICBsZXQgbGlua2VyID0gY29sbGVjdGlvbi5nZXRMaW5rZXIoaW52ZXJzZWRCeSk7XG5cbiAgICAgICAgaWYgKCFsaW5rZXIpIHtcbiAgICAgICAgICAgIC8vIGl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGNvbGxlY3Rpb24gZG9lc24ndCBoYXZlIGEgbGlua2VyIGNyZWF0ZWQgeWV0LlxuICAgICAgICAgICAgLy8gc28gd2Ugd2lsbCBjcmVhdGUgaXQgb24gc3RhcnR1cCBhZnRlciBhbGwgbGlua3MgaGF2ZSBiZWVuIGRlZmluZWRcbiAgICAgICAgICAgIE1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihpbnZlcnNlZEJ5KTtcbiAgICAgICAgICAgICAgICBpZiAoIWxpbmtlcikge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBZb3UgdHJpZWQgc2V0dGluZyB1cCBhbiBpbnZlcnNlZCBsaW5rIGluIFwiJHt0aGlzLm1haW5Db2xsZWN0aW9uLl9uYW1lfVwiIHBvaW50aW5nIHRvIGNvbGxlY3Rpb246IFwiJHtjb2xsZWN0aW9uLl9uYW1lfVwiIGxpbms6IFwiJHtpbnZlcnNlZEJ5fVwiLCBidXQgbm8gc3VjaCBsaW5rIHdhcyBmb3VuZC4gTWF5YmUgYSB0eXBvID9gKVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHVwVmlydHVhbENvbmZpZyhsaW5rZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zZXR1cFZpcnR1YWxDb25maWcobGlua2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsaW5rZXJcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZXR1cFZpcnR1YWxDb25maWcobGlua2VyKSB7XG4gICAgICAgIGNvbnN0IHZpcnR1YWxMaW5rQ29uZmlnID0gbGlua2VyLmxpbmtDb25maWc7XG5cbiAgICAgICAgaWYgKCF2aXJ0dWFsTGlua0NvbmZpZykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgVGhlcmUgaXMgbm8gbGluay1jb25maWcgZm9yIHRoZSByZWxhdGVkIGNvbGxlY3Rpb24gb24gJHtpbnZlcnNlZEJ5fS4gTWFrZSBzdXJlIHlvdSBhZGRlZCB0aGUgZGlyZWN0IGxpbmtzIGJlZm9yZSBzcGVjaWZ5aW5nIHZpcnR1YWwgb25lcy5gKVxuICAgICAgICB9XG5cbiAgICAgICAgXy5leHRlbmQodGhpcy5saW5rQ29uZmlnLCB7XG4gICAgICAgICAgICBtZXRhZGF0YTogdmlydHVhbExpbmtDb25maWcubWV0YWRhdGEsXG4gICAgICAgICAgICByZWxhdGVkTGlua2VyOiBsaW5rZXJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGVwZW5kaW5nIG9uIHRoZSBzdHJhdGVneSwgd2UgY3JlYXRlIHRoZSBwcm9wZXIgaGVscGVyIGNsYXNzXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0SGVscGVyQ2xhc3MoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5zdHJhdGVneSkge1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gTGlua01hbnlNZXRhO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtNYW55O1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOlxuICAgICAgICAgICAgICAgIHJldHVybiBMaW5rT25lTWV0YTtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIExpbmtPbmU7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLXN0cmF0ZWd5JywgYCR7dGhpcy5zdHJhdGVneX0gaXMgbm90IGEgdmFsaWQgc3RyYXRlZ3lgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJZiBmaWVsZCBuYW1lIG5vdCBwcmVzZW50LCB3ZSBnZW5lcmF0ZSBpdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZW5lcmF0ZUZpZWxkTmFtZSgpIHtcbiAgICAgICAgbGV0IGNsZWFuZWRDb2xsZWN0aW9uTmFtZSA9IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLl9uYW1lLnJlcGxhY2UoL1xcLi9nLCAnXycpO1xuICAgICAgICBsZXQgZGVmYXVsdEZpZWxkUHJlZml4ID0gdGhpcy5saW5rTmFtZSArICdfJyArIGNsZWFuZWRDb2xsZWN0aW9uTmFtZTtcblxuICAgICAgICBzd2l0Y2ggKHRoaXMuc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2RlZmF1bHRGaWVsZFByZWZpeH1fbWV0YXNgO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2RlZmF1bHRGaWVsZFByZWZpeH1faWRzYDtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7ZGVmYXVsdEZpZWxkUHJlZml4fV9tZXRhYDtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAke2RlZmF1bHRGaWVsZFByZWZpeH1faWRgO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiBhIGxpbmsgdGhhdCBpcyBkZWNsYXJlZCB2aXJ0dWFsIGlzIHJlbW92ZWQsIHRoZSByZWZlcmVuY2Ugd2lsbCBiZSByZW1vdmVkIGZyb20gZXZlcnkgb3RoZXIgbGluay5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9oYW5kbGVSZWZlcmVuY2VSZW1vdmFsRm9yVmlydHVhbExpbmtzKCkge1xuICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmFmdGVyLnJlbW92ZSgodXNlcklkLCBkb2MpID0+IHtcbiAgICAgICAgICAgIC8vIHRoaXMgcHJvYmxlbSBtYXkgb2NjdXIgd2hlbiB5b3UgZG8gYSAucmVtb3ZlKCkgYmVmb3JlIE1ldGVvci5zdGFydHVwKClcbiAgICAgICAgICAgIGlmICghdGhpcy5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYFRoZXJlIHdhcyBhbiBlcnJvciBmaW5kaW5nIHRoZSBsaW5rIGZvciByZW1vdmFsIGZvciBjb2xsZWN0aW9uOiBcIiR7dGhpcy5tYWluQ29sbGVjdGlvbi5fbmFtZX1cIiB3aXRoIGxpbms6IFwiJHt0aGlzLmxpbmtOYW1lfVwiLiBUaGlzIG1heSBvY2N1ciB3aGVuIHlvdSBkbyBhIC5yZW1vdmUoKSBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAoKWApO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGFjY2Vzc29yID0gdGhpcy5jcmVhdGVMaW5rKGRvYyk7XG5cbiAgICAgICAgICAgIF8uZWFjaChhY2Nlc3Nvci5mZXRjaCgpLCBsaW5rZWRPYmogPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHtyZWxhdGVkTGlua2VyfSA9IHRoaXMubGlua0NvbmZpZztcbiAgICAgICAgICAgICAgICAvLyBXZSBkbyB0aGlzIGNoZWNrLCB0byBhdm9pZCBzZWxmLXJlZmVyZW5jaW5nIGhlbGwgd2hlbiBkZWZpbmluZyB2aXJ0dWFsIGxpbmtzXG4gICAgICAgICAgICAgICAgLy8gVmlydHVhbCBsaW5rcyBpZiBub3QgZm91bmQgXCJjb21waWxlLXRpbWVcIiwgd2Ugd2lsbCB0cnkgYWdhaW4gdG8gcmVwcm9jZXNzIHRoZW0gb24gTWV0ZW9yLnN0YXJ0dXBcbiAgICAgICAgICAgICAgICAvLyBpZiBhIHJlbW92YWwgaGFwcGVucyBiZWZvcmUgTWV0ZW9yLnN0YXJ0dXAgdGhpcyBtYXkgZmFpbFxuICAgICAgICAgICAgICAgIGlmIChyZWxhdGVkTGlua2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaW5rID0gcmVsYXRlZExpbmtlci5jcmVhdGVMaW5rKGxpbmtlZE9iaik7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbGF0ZWRMaW5rZXIuaXNTaW5nbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay51bnNldCgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGluay5yZW1vdmUoZG9jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIF9pbml0SW5kZXgoKSB7XG4gICAgICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua0NvbmZpZy5maWVsZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtDb25maWcubWV0YWRhdGEpIHtcbiAgICAgICAgICAgICAgICBmaWVsZCA9IGZpZWxkICsgJy5faWQnO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IGNhbm5vdCBzZXQgaW5kZXggb24gYW4gaW52ZXJzZWQgbGluay4nKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01hbnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IGNhbm5vdCBzZXQgdW5pcXVlIHByb3BlcnR5IG9uIGEgbXVsdGkgZmllbGQuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zID0ge3VuaXF1ZTogdHJ1ZX1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7W2ZpZWxkXTogMX0sIG9wdGlvbnMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5saW5rQ29uZmlnLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IGNhbm5vdCBzZXQgdW5pcXVlIHByb3BlcnR5IG9uIGFuIGludmVyc2VkIGxpbmsuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc01hbnkoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IGNhbm5vdCBzZXQgdW5pcXVlIHByb3BlcnR5IG9uIGEgbXVsdGkgZmllbGQuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLl9lbnN1cmVJbmRleCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBbZmllbGRdOiAxXG4gICAgICAgICAgICAgICAgICAgIH0sIHt1bmlxdWU6IHRydWV9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9pbml0QXV0b3JlbW92ZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmxpbmtDb25maWcuYXV0b3JlbW92ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmFmdGVyLnJlbW92ZSgodXNlcklkLCBkb2MpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdldExpbmtlZENvbGxlY3Rpb24oKS5yZW1vdmUoe1xuICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbjogc21hcnRBcmd1bWVudHMuZ2V0SWRzKGRvY1t0aGlzLmxpbmtTdG9yYWdlRmllbGRdKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1haW5Db2xsZWN0aW9uLmFmdGVyLnJlbW92ZSgodXNlcklkLCBkb2MpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5rZXIgPSB0aGlzLm1haW5Db2xsZWN0aW9uLmdldExpbmsoZG9jLCB0aGlzLmxpbmtOYW1lKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpZHMgPSBsaW5rZXIuZmluZCh7fSwge2ZpZWxkczoge19pZDogMX19KS5mZXRjaCgpLm1hcChpdGVtID0+IGl0ZW0uX2lkKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0TGlua2VkQ29sbGVjdGlvbigpLnJlbW92ZSh7XG4gICAgICAgICAgICAgICAgICAgIF9pZDogeyRpbjogaWRzfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgZGVub3JtYWxpemF0aW9uIHVzaW5nIGhlcnRlYnk6ZGVub3JtYWxpemVcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0RGVub3JtYWxpemF0aW9uKCkge1xuICAgICAgICBpZiAoIXRoaXMubGlua0NvbmZpZy5kZW5vcm1hbGl6ZSB8fCAhTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYWNrYWdlRXhpc3RzID0gISFQYWNrYWdlWydoZXJ0ZWJ5OmRlbm9ybWFsaXplJ107XG4gICAgICAgIGlmICghcGFja2FnZUV4aXN0cykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbWlzc2luZy1wYWNrYWdlJywgYFBsZWFzZSBhZGQgdGhlIGhlcnRlYnk6ZGVub3JtYWxpemUgcGFja2FnZSB0byB5b3VyIE1ldGVvciBhcHBsaWNhdGlvbiBpbiBvcmRlciB0byBtYWtlIGNhY2hpbmcgd29ya2ApXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB7ZmllbGQsIGJvZHksIGJ5cGFzc1NjaGVtYX0gPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgICAgIGxldCBjYWNoZUNvbmZpZztcblxuICAgICAgICBsZXQgcmVmZXJlbmNlRmllbGRTdWZmaXggPSAnJztcbiAgICAgICAgaWYgKHRoaXMuaXNNZXRhKCkpIHtcbiAgICAgICAgICAgIHJlZmVyZW5jZUZpZWxkU3VmZml4ID0gKHRoaXMuaXNTaW5nbGUoKSA/ICcuX2lkJyA6ICc6X2lkJyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgbGV0IGludmVyc2VkTGluayA9IHRoaXMubGlua0NvbmZpZy5yZWxhdGVkTGlua2VyLmxpbmtDb25maWc7XG5cbiAgICAgICAgICAgIGxldCB0eXBlID0gaW52ZXJzZWRMaW5rLnR5cGUgPT0gJ21hbnknID8gJ21hbnktaW52ZXJzZScgOiAnaW52ZXJzZWQnO1xuXG4gICAgICAgICAgICBjYWNoZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkczogYm9keSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VGaWVsZDogaW52ZXJzZWRMaW5rLmZpZWxkICsgcmVmZXJlbmNlRmllbGRTdWZmaXgsXG4gICAgICAgICAgICAgICAgY2FjaGVGaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYnlwYXNzU2NoZW1hOiAhIWJ5cGFzc1NjaGVtYVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHRoaXMubGlua0NvbmZpZy50eXBlLFxuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua0NvbmZpZy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgICAgIGZpZWxkczogYm9keSxcbiAgICAgICAgICAgICAgICByZWZlcmVuY2VGaWVsZDogdGhpcy5saW5rQ29uZmlnLmZpZWxkICsgcmVmZXJlbmNlRmllbGRTdWZmaXgsXG4gICAgICAgICAgICAgICAgY2FjaGVGaWVsZDogZmllbGQsXG4gICAgICAgICAgICAgICAgYnlwYXNzU2NoZW1hOiAhIWJ5cGFzc1NjaGVtYVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCgpKSB7XG4gICAgICAgICAgICBNZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5jYWNoZShjYWNoZUNvbmZpZyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5tYWluQ29sbGVjdGlvbi5jYWNoZShjYWNoZUNvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWZXJpZmllcyBpZiB0aGlzIGxpbmtlciBpcyBkZW5vcm1hbGl6ZWQuIEl0IGNhbiBiZSBkZW5vcm1hbGl6ZWQgZnJvbSB0aGUgaW52ZXJzZSBzaWRlIGFzIHdlbGwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGlzRGVub3JtYWxpemVkKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVmVyaWZpZXMgaWYgdGhlIGJvZHkgb2YgdGhlIGxpbmtlZCBlbGVtZW50IGRvZXMgbm90IGNvbnRhaW4gZmllbGRzIG91dHNpZGUgdGhlIGNhY2hlIGJvZHlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2R5XG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBpc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkge1xuICAgICAgICBjb25zdCBjYWNoZUJvZHkgPSB0aGlzLmxpbmtDb25maWcuZGVub3JtYWxpemUuYm9keTtcblxuICAgICAgICBjb25zdCBjYWNoZUJvZHlGaWVsZHMgPSBfLmtleXMoZG90LmRvdChjYWNoZUJvZHkpKTtcbiAgICAgICAgY29uc3QgYm9keUZpZWxkcyA9IF8ua2V5cyhcbiAgICAgICAgICAgIGRvdC5kb3QoXG4gICAgICAgICAgICAgICAgXy5vbWl0KGJvZHksICdfaWQnKVxuICAgICAgICAgICAgKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBfLmRpZmZlcmVuY2UoYm9keUZpZWxkcywgY2FjaGVCb2R5RmllbGRzKS5sZW5ndGggPT09IDA7XG4gICAgfVxufSIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBjcmVhdGVTZWFyY2hGaWx0ZXJzKG9iamVjdCwgZmllbGRTdG9yYWdlLCBzdHJhdGVneSwgaXNWaXJ0dWFsLCBtZXRhRmlsdGVycykge1xuICAgIGlmICghaXNWaXJ0dWFsKSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpO1xuICAgICAgICAgICAgY2FzZSAnb25lLW1ldGEnOiByZXR1cm4gY3JlYXRlT25lTWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6IHJldHVybiBjcmVhdGVNYW55KG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YShvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGxpbmtpbmcgc3RyYXRlZ3k6ICR7c3RyYXRlZ3l9YClcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6IHJldHVybiBjcmVhdGVPbmVWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ29uZS1tZXRhJzogcmV0dXJuIGNyZWF0ZU9uZU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycyk7XG4gICAgICAgICAgICBjYXNlICdtYW55JzogcmV0dXJuIGNyZWF0ZU1hbnlWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlKTtcbiAgICAgICAgICAgIGNhc2UgJ21hbnktbWV0YSc6IHJldHVybiBjcmVhdGVNYW55TWV0YVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UsIG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihgSW52YWxpZCBsaW5raW5nIHN0cmF0ZWd5OiAke3N0cmF0ZWd5fWApXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmUob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IG9iamVjdFtmaWVsZFN0b3JhZ2VdXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9uZVZpcnR1YWwob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogb2JqZWN0Ll9pZFxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPbmVNZXRhKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2ZpZWxkU3RvcmFnZV07XG5cbiAgICBpZiAobWV0YUZpbHRlcnMpIHtcbiAgICAgICAgaWYgKCFzaWZ0KG1ldGFGaWx0ZXJzKSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7X2lkOiB1bmRlZmluZWR9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB2YWx1ZSA/IHZhbHVlLl9pZCA6IHZhbHVlXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9uZU1ldGFWaXJ0dWFsKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGxldCBmaWx0ZXJzID0ge307XG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIF8uZWFjaChtZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGZpbHRlcnNbZmllbGRTdG9yYWdlICsgJy4nICsga2V5XSA9IHZhbHVlO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIGZpbHRlcnNbZmllbGRTdG9yYWdlICsgJy5faWQnXSA9IG9iamVjdC5faWQ7XG5cbiAgICByZXR1cm4gZmlsdGVycztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnkob2JqZWN0LCBmaWVsZFN0b3JhZ2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBfaWQ6IHtcbiAgICAgICAgICAgICRpbjogb2JqZWN0W2ZpZWxkU3RvcmFnZV0gfHwgW11cbiAgICAgICAgfVxuICAgIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNYW55VmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIFtmaWVsZFN0b3JhZ2VdOiBvYmplY3QuX2lkXG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhKG9iamVjdCwgZmllbGRTdG9yYWdlLCBtZXRhRmlsdGVycykge1xuICAgIGxldCB2YWx1ZSA9IG9iamVjdFtmaWVsZFN0b3JhZ2VdO1xuXG4gICAgaWYgKG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIHZhbHVlID0gc2lmdChtZXRhRmlsdGVycywgdmFsdWUpXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAkaW46IF8ucGx1Y2sodmFsdWUsICdfaWQnKSB8fCBbXVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1hbnlNZXRhVmlydHVhbChvYmplY3QsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnMpIHtcbiAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgIGlmIChtZXRhRmlsdGVycykge1xuICAgICAgICBfLmVhY2gobWV0YUZpbHRlcnMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBmaWx0ZXJzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBmaWx0ZXJzLl9pZCA9IG9iamVjdC5faWQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBbZmllbGRTdG9yYWdlXTogeyRlbGVtTWF0Y2g6IGZpbHRlcnN9XG4gICAgfTtcbn0iLCJpbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcbmltcG9ydCBjcmVhdGVTZWFyY2hGaWx0ZXJzIGZyb20gJy4uL2xpYi9jcmVhdGVTZWFyY2hGaWx0ZXJzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluayB7XG4gICAgZ2V0IGNvbmZpZygpIHsgcmV0dXJuIHRoaXMubGlua2VyLmxpbmtDb25maWc7IH1cblxuICAgIGdldCBpc1ZpcnR1YWwoKSB7IHJldHVybiB0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSB9XG5cbiAgICBjb25zdHJ1Y3RvcihsaW5rZXIsIG9iamVjdCwgY29sbGVjdGlvbikge1xuICAgICAgICB0aGlzLmxpbmtlciA9IGxpbmtlcjtcbiAgICAgICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgICAgIHRoaXMubGlua2VkQ29sbGVjdGlvbiA9IChjb2xsZWN0aW9uKSA/IGNvbGxlY3Rpb24gOiBsaW5rZXIuZ2V0TGlua2VkQ29sbGVjdGlvbigpO1xuXG4gICAgICAgIGlmICh0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcucmVsYXRlZExpbmtlci5saW5rQ29uZmlnLmZpZWxkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5saW5rU3RvcmFnZUZpZWxkID0gdGhpcy5jb25maWcuZmllbGQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBzdG9yZWQgbGluayBpbmZvcm1hdGlvbiB2YWx1ZVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1lvdSBjYW4gb25seSB0YWtlIHRoZSB2YWx1ZSBmcm9tIHRoZSBtYWluIGxpbmsuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBsaW5rZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKiBAcGFyYW0gdXNlcklkXG4gICAgICovXG4gICAgZmluZChmaWx0ZXJzID0ge30sIG9wdGlvbnMgPSB7fSwgdXNlcklkID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGxldCBsaW5rZXIgPSB0aGlzLmxpbmtlcjtcbiAgICAgICAgY29uc3QgbGlua2VkQ29sbGVjdGlvbiA9IHRoaXMubGlua2VkQ29sbGVjdGlvbjtcblxuICAgICAgICBsZXQgJG1ldGFGaWx0ZXJzO1xuICAgICAgICBpZiAoZmlsdGVycy4kbWV0YSkge1xuICAgICAgICAgICAgJG1ldGFGaWx0ZXJzID0gZmlsdGVycy4kbWV0YTtcbiAgICAgICAgICAgIGRlbGV0ZSBmaWx0ZXJzLiRtZXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc2VhcmNoRmlsdGVycyA9IGNyZWF0ZVNlYXJjaEZpbHRlcnMoXG4gICAgICAgICAgICB0aGlzLm9iamVjdCxcbiAgICAgICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCxcbiAgICAgICAgICAgIGxpbmtlci5zdHJhdGVneSxcbiAgICAgICAgICAgIGxpbmtlci5pc1ZpcnR1YWwoKSxcbiAgICAgICAgICAgICRtZXRhRmlsdGVyc1xuICAgICAgICApO1xuXG4gICAgICAgIGxldCBhcHBsaWVkRmlsdGVycyA9IF8uZXh0ZW5kKHt9LCBmaWx0ZXJzLCBzZWFyY2hGaWx0ZXJzKTtcblxuICAgICAgICAvLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBoYXBwZW5zIGR1ZSB0byByZWN1cnNpdmUgaW1wb3J0aW5nIG9mIG1vZHVsZXNcbiAgICAgICAgLy8gVE9ETzogZmluZCBhbm90aGVyIHdheSB0byBkbyB0aGlzXG4gICAgICAgIGlmIChsaW5rZWRDb2xsZWN0aW9uLmZpbmQpIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmZpbmQoYXBwbGllZEZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBsaW5rZWRDb2xsZWN0aW9uLmRlZmF1bHQuZmluZChhcHBsaWVkRmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWx0ZXJzXG4gICAgICogQHBhcmFtIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0gb3RoZXJzXG4gICAgICogQHJldHVybnMgeyp8e2NvbnRlbnR9fGFueX1cbiAgICAgKi9cbiAgICBmZXRjaChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHRoaXMuZmluZChmaWx0ZXJzLCBvcHRpb25zLCAuLi5vdGhlcnMpLmZldGNoKCk7XG5cbiAgICAgICAgaWYgKHRoaXMubGlua2VyLmlzT25lUmVzdWx0KCkpIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHJlc3VsdCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdoZW4gd2UgYXJlIGRlYWxpbmcgd2l0aCBtdWx0aXBsZSB0eXBlIHJlbGF0aW9uc2hpcHMsICRpbiB3b3VsZCByZXF1aXJlIGFuIGFycmF5LiBJZiB0aGUgZmllbGQgdmFsdWUgaXMgbnVsbCwgaXQgd2lsbCBmYWlsXG4gICAgICogV2UgdXNlIGNsZWFuIHRvIG1ha2UgaXQgYW4gZW1wdHkgYXJyYXkgYnkgZGVmYXVsdC5cbiAgICAgKi9cbiAgICBjbGVhbigpIHt9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyBhIHNpbmdsZSBpZFxuICAgICAqL1xuICAgIGlkZW50aWZ5SWQod2hhdCwgc2F2ZVRvRGF0YWJhc2UpIHtcbiAgICAgICAgcmV0dXJuIFNtYXJ0QXJncy5nZXRJZCh3aGF0LCB7XG4gICAgICAgICAgICBzYXZlVG9EYXRhYmFzZSxcbiAgICAgICAgICAgIGNvbGxlY3Rpb246IHRoaXMubGlua2VkQ29sbGVjdGlvblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyB0aGUgaWRzIG9mIG9iamVjdChzKSBvciBzdHJpbmdzIGFuZCByZXR1cm5zIGFuIGFycmF5LlxuICAgICAqL1xuICAgIGlkZW50aWZ5SWRzKHdoYXQsIHNhdmVUb0RhdGFiYXNlKSB7XG4gICAgICAgIHJldHVybiBTbWFydEFyZ3MuZ2V0SWRzKHdoYXQsIHtcbiAgICAgICAgICAgIHNhdmVUb0RhdGFiYXNlLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogdGhpcy5saW5rZWRDb2xsZWN0aW9uXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB3aGVuIGxpbmtpbmcgZGF0YSwgaWYgdGhlIGlkcyBhcmUgdmFsaWQgd2l0aCB0aGUgbGlua2VkIGNvbGxlY3Rpb24uXG4gICAgICogQHRocm93cyBNZXRlb3IuRXJyb3JcbiAgICAgKiBAcGFyYW0gaWRzXG4gICAgICpcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX3ZhbGlkYXRlSWRzKGlkcykge1xuICAgICAgICBpZiAoIV8uaXNBcnJheShpZHMpKSB7XG4gICAgICAgICAgICBpZHMgPSBbaWRzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHZhbGlkSWRzID0gdGhpcy5saW5rZWRDb2xsZWN0aW9uLmZpbmQoe1xuICAgICAgICAgICAgX2lkOiB7JGluOiBpZHN9XG4gICAgICAgIH0sIHtmaWVsZHM6IHtfaWQ6IDF9fSkuZmV0Y2goKS5tYXAoZG9jID0+IGRvYy5faWQpO1xuXG4gICAgICAgIGlmICh2YWxpZElkcy5sZW5ndGggIT0gaWRzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWZvdW5kJywgYFlvdSB0cmllZCB0byBjcmVhdGUgbGlua3Mgd2l0aCBub24tZXhpc3RpbmcgaWQocykgaW5zaWRlIFwiJHt0aGlzLmxpbmtlZENvbGxlY3Rpb24uX25hbWV9XCI6ICR7Xy5kaWZmZXJlbmNlKGlkcywgdmFsaWRJZHMpLmpvaW4oJywgJyl9YClcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgZm9yIGFsbG93aW5nIGNvbW1hbmRzIHN1Y2ggYXMgc2V0L3Vuc2V0L2FkZC9yZW1vdmUvbWV0YWRhdGEgZnJvbSB0aGUgdmlydHVhbCBsaW5rLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFjdGlvblxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICogQHBhcmFtIG1ldGFkYXRhXG4gICAgICpcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICovXG4gICAgX3ZpcnR1YWxBY3Rpb24oYWN0aW9uLCB3aGF0LCBtZXRhZGF0YSkge1xuICAgICAgICBjb25zdCBsaW5rZXIgPSB0aGlzLmxpbmtlci5saW5rQ29uZmlnLnJlbGF0ZWRMaW5rZXI7XG5cbiAgICAgICAgLy8gaXRzIGFuIHVuc2V0IG9wZXJhdGlvbiBtb3N0IGxpa2VseS5cbiAgICAgICAgaWYgKHdoYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJzZWRMaW5rID0gbGlua2VyLmNyZWF0ZUxpbmsodGhpcy5mZXRjaCgpKTtcbiAgICAgICAgICAgIHJldmVyc2VkTGluay51bnNldCgpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIV8uaXNBcnJheSh3aGF0KSkge1xuICAgICAgICAgICAgd2hhdCA9IFt3aGF0XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdoYXQgPSBfLm1hcCh3aGF0LCBlbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGlmICghXy5pc09iamVjdChlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBsaW5rZXIubWFpbkNvbGxlY3Rpb24uZmluZE9uZShlbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50Ll9pZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50SWQgPSBsaW5rZXIubWFpbkNvbGxlY3Rpb24uaW5zZXJ0KGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChlbGVtZW50LCBsaW5rZXIubWFpbkNvbGxlY3Rpb24uZmluZE9uZShlbGVtZW50SWQpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIF8ubWFwKHdoYXQsIGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmV2ZXJzZWRMaW5rID0gbGlua2VyLmNyZWF0ZUxpbmsoZWxlbWVudCk7XG5cbiAgICAgICAgICAgIGlmIChhY3Rpb24gPT0gJ21ldGFkYXRhJykge1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNTaW5nbGUoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV2ZXJzZWRMaW5rLm1ldGFkYXRhKG1ldGFkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV2ZXJzZWRMaW5rLm1ldGFkYXRhKHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT0gJ2FkZCcgfHwgYWN0aW9uID09ICdzZXQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1NpbmdsZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VkTGluay5zZXQodGhpcy5vYmplY3QsIG1ldGFkYXRhKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXZlcnNlZExpbmsuYWRkKHRoaXMub2JqZWN0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobGlua2VyLmlzU2luZ2xlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLnVuc2V0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZWRMaW5rLnJlbW92ZSh0aGlzLm9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTGluayBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IFNtYXJ0QXJncyBmcm9tICcuL2xpYi9zbWFydEFyZ3VtZW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtNYW55IGV4dGVuZHMgTGluayB7XG4gICAgY2xlYW4oKSB7XG4gICAgICAgIGlmICghdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSkge1xuICAgICAgICAgICAgdGhpcy5vYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRzIHRoZSBfaWRzIHRvIHRoZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHdoYXRcbiAgICAgKi9cbiAgICBhZGQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ2FkZCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvL2lmICh0aGlzLmlzVmlydHVhbCkgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnQWRkL3JlbW92ZSBvcGVyYXRpb25zIG11c3QgYmUgZG9uZSBmcm9tIHRoZSBvd25pbmctbGluayBvZiB0aGUgcmVsYXRpb25zaGlwJyk7XG5cbiAgICAgICAgdGhpcy5jbGVhbigpO1xuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhfaWRzKTtcblxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGZpZWxkXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IF8udW5pb24odGhpcy5vYmplY3RbZmllbGRdLCBfaWRzKTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGRiXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRhZGRUb1NldDoge1xuICAgICAgICAgICAgICAgIFtmaWVsZF06IHskZWFjaDogX2lkc31cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUodGhpcy5vYmplY3QuX2lkLCBtb2RpZmllcik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHdoYXRcbiAgICAgKi9cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1hbGxvd2VkJywgJ0FkZC9SZW1vdmUgb3BlcmF0aW9ucyBzaG91bGQgYmUgZG9uZSBmcm9tIHRoZSBvd25lciBvZiB0aGUgcmVsYXRpb25zaGlwJyk7XG5cbiAgICAgICAgdGhpcy5jbGVhbigpO1xuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICBjb25zdCBfaWRzID0gdGhpcy5pZGVudGlmeUlkcyh3aGF0KTtcblxuICAgICAgICAvLyB1cGRhdGUgdGhlIGZpZWxkXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IF8uZmlsdGVyKHRoaXMub2JqZWN0W2ZpZWxkXSwgX2lkID0+ICFfLmNvbnRhaW5zKF9pZHMsIF9pZCkpO1xuXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgZGJcbiAgICAgICAgbGV0IG1vZGlmaWVyID0ge1xuICAgICAgICAgICAgJHB1bGxBbGw6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBfaWRzXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqc2V0KiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBhZGQvcmVtb3ZlIGZvciAqbWFueSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cblxuICAgIHVuc2V0KHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCd1bnNldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnVuc2V0KiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBhZGQvcmVtb3ZlIGZvciAqbWFueSogcmVsYXRpb25zaGlwcycpO1xuICAgIH1cbn0iLCJpbXBvcnQgTGluayBmcm9tICcuL2Jhc2UuanMnO1xuaW1wb3J0IFNtYXJ0QXJncyBmcm9tICcuL2xpYi9zbWFydEFyZ3VtZW50cy5qcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmtNYW55TWV0YSBleHRlbmRzIExpbmsge1xuICAgIGNsZWFuKCkge1xuICAgICAgICBpZiAoIXRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0pIHtcbiAgICAgICAgICAgIHRoaXMub2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0gPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB3aGF0XG4gICAgICogQHBhcmFtIG1ldGFkYXRhXG4gICAgICovXG4gICAgYWRkKHdoYXQsIG1ldGFkYXRhID0ge30pIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdhZGQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IF9pZHMgPSB0aGlzLmlkZW50aWZ5SWRzKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhfaWRzKTtcblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gdGhpcy5vYmplY3RbZmllbGRdIHx8IFtdO1xuICAgICAgICBsZXQgbWV0YWRhdGFzID0gW107XG5cbiAgICAgICAgXy5lYWNoKF9pZHMsIF9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgbG9jYWxNZXRhZGF0YSA9IF8uY2xvbmUobWV0YWRhdGEpO1xuICAgICAgICAgICAgbG9jYWxNZXRhZGF0YS5faWQgPSBfaWQ7XG5cbiAgICAgICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXS5wdXNoKGxvY2FsTWV0YWRhdGEpO1xuICAgICAgICAgICAgbWV0YWRhdGFzLnB1c2gobG9jYWxNZXRhZGF0YSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBtb2RpZmllciA9IHtcbiAgICAgICAgICAgICRhZGRUb1NldDoge1xuICAgICAgICAgICAgICAgIFtmaWVsZF06IHskZWFjaDogbWV0YWRhdGFzfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIG1vZGlmaWVyKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gd2hhdFxuICAgICAqIEBwYXJhbSBleHRlbmRNZXRhZGF0YVxuICAgICAqL1xuICAgIG1ldGFkYXRhKHdoYXQsIGV4dGVuZE1ldGFkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignbWV0YWRhdGEnLCB3aGF0LCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIGlmICh3aGF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFtmaWVsZF07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0FycmF5KHdoYXQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdNZXRhZGF0YSB1cGRhdGVzIHNob3VsZCBiZSBtYWRlIGZvciBvbmUgZW50aXR5IG9ubHksIG5vdCBtdWx0aXBsZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2lkID0gdGhpcy5pZGVudGlmeUlkKHdoYXQpO1xuXG4gICAgICAgIGxldCBleGlzdGluZ01ldGFkYXRhID0gXy5maW5kKHRoaXMub2JqZWN0W2ZpZWxkXSwgbWV0YWRhdGEgPT4gbWV0YWRhdGEuX2lkID09IF9pZCk7XG4gICAgICAgIGlmIChleHRlbmRNZXRhZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZXhpc3RpbmdNZXRhZGF0YTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF8uZXh0ZW5kKGV4aXN0aW5nTWV0YWRhdGEsIGV4dGVuZE1ldGFkYXRhKTtcbiAgICAgICAgICAgIGxldCBzdWJmaWVsZCA9IGZpZWxkICsgJy5faWQnO1xuICAgICAgICAgICAgbGV0IHN1YmZpZWxkVXBkYXRlID0gZmllbGQgKyAnLiQnO1xuXG4gICAgICAgICAgICB0aGlzLmxpbmtlci5tYWluQ29sbGVjdGlvbi51cGRhdGUoe1xuICAgICAgICAgICAgICAgIF9pZDogdGhpcy5vYmplY3QuX2lkLFxuICAgICAgICAgICAgICAgIFtzdWJmaWVsZF06IF9pZFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgJHNldDoge1xuICAgICAgICAgICAgICAgICAgIFtzdWJmaWVsZFVwZGF0ZV06IGV4aXN0aW5nTWV0YWRhdGFcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKHdoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdyZW1vdmUnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgX2lkcyA9IHRoaXMuaWRlbnRpZnlJZHMod2hhdCk7XG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcblxuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBfLmZpbHRlcih0aGlzLm9iamVjdFtmaWVsZF0sIGxpbmsgPT4gIV8uY29udGFpbnMoX2lkcywgbGluay5faWQpKTtcblxuICAgICAgICBsZXQgbW9kaWZpZXIgPSB7XG4gICAgICAgICAgICAkcHVsbDoge1xuICAgICAgICAgICAgICAgIFtmaWVsZF06IHtcbiAgICAgICAgICAgICAgICAgICAgJGVsZW1NYXRjaDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGluOiBfaWRzXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwgbW9kaWZpZXIpO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh3aGF0LCBtZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQsIG1ldGFkYXRhKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1jb21tYW5kJywgJ1lvdSBhcmUgdHJ5aW5nIHRvICpzZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxuXG4gICAgdW5zZXQod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3Vuc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqdW5zZXQqIGluIGEgcmVsYXRpb25zaGlwIHRoYXQgaXMgc2luZ2xlLiBQbGVhc2UgdXNlIGFkZC9yZW1vdmUgZm9yICptYW55KiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua09uZSBleHRlbmRzIExpbmsge1xuICAgIHNldCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignc2V0Jywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBmaWVsZCA9IHRoaXMubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgY29uc3QgX2lkID0gdGhpcy5pZGVudGlmeUlkKHdoYXQsIHRydWUpO1xuICAgICAgICB0aGlzLl92YWxpZGF0ZUlkcyhbX2lkXSk7XG5cbiAgICAgICAgdGhpcy5vYmplY3RbZmllbGRdID0gX2lkO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBfaWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdW5zZXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbigndW5zZXQnLCB3aGF0KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuICAgICAgICB0aGlzLm9iamVjdFtmaWVsZF0gPSBudWxsO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGFkZCh3aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgdGhpcy5fdmlydHVhbEFjdGlvbignYWRkJywgd2hhdCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqYWRkKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnJlbW92ZSogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsImltcG9ydCBMaW5rIGZyb20gJy4vYmFzZS5qcyc7XG5pbXBvcnQgU21hcnRBcmdzIGZyb20gJy4vbGliL3NtYXJ0QXJndW1lbnRzLmpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGlua09uZU1ldGEgZXh0ZW5kcyBMaW5rIHtcbiAgICBzZXQod2hhdCwgbWV0YWRhdGEgPSB7fSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3NldCcsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIG1ldGFkYXRhLl9pZCA9IHRoaXMuaWRlbnRpZnlJZCh3aGF0LCB0cnVlKTtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVJZHMoW21ldGFkYXRhLl9pZF0pO1xuXG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IG1ldGFkYXRhO1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiBtZXRhZGF0YVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtZXRhZGF0YShleHRlbmRNZXRhZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ21ldGFkYXRhJywgdW5kZWZpbmVkLCBleHRlbmRNZXRhZGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGZpZWxkID0gdGhpcy5saW5rU3RvcmFnZUZpZWxkO1xuXG4gICAgICAgIGlmICghZXh0ZW5kTWV0YWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdFtmaWVsZF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzLm9iamVjdFtmaWVsZF0sIGV4dGVuZE1ldGFkYXRhKTtcblxuICAgICAgICAgICAgdGhpcy5saW5rZXIubWFpbkNvbGxlY3Rpb24udXBkYXRlKHRoaXMub2JqZWN0Ll9pZCwge1xuICAgICAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICAgICAgW2ZpZWxkXTogdGhpcy5vYmplY3RbZmllbGRdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB1bnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCd1bnNldCcpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmllbGQgPSB0aGlzLmxpbmtTdG9yYWdlRmllbGQ7XG4gICAgICAgIHRoaXMub2JqZWN0W2ZpZWxkXSA9IHt9O1xuXG4gICAgICAgIHRoaXMubGlua2VyLm1haW5Db2xsZWN0aW9uLnVwZGF0ZSh0aGlzLm9iamVjdC5faWQsIHtcbiAgICAgICAgICAgICRzZXQ6IHtcbiAgICAgICAgICAgICAgICBbZmllbGRdOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBhZGQod2hhdCwgbWV0YWRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICB0aGlzLl92aXJ0dWFsQWN0aW9uKCdhZGQnLCB3aGF0LCBtZXRhZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY29tbWFuZCcsICdZb3UgYXJlIHRyeWluZyB0byAqYWRkKiBpbiBhIHJlbGF0aW9uc2hpcCB0aGF0IGlzIHNpbmdsZS4gUGxlYXNlIHVzZSBzZXQvdW5zZXQgZm9yICpzaW5nbGUqIHJlbGF0aW9uc2hpcHMnKTtcbiAgICB9XG5cbiAgICByZW1vdmUod2hhdCkge1xuICAgICAgICBpZiAodGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHRoaXMuX3ZpcnR1YWxBY3Rpb24oJ3JlbW92ZScsIHdoYXQpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWNvbW1hbmQnLCAnWW91IGFyZSB0cnlpbmcgdG8gKnJlbW92ZSogaW4gYSByZWxhdGlvbnNoaXAgdGhhdCBpcyBzaW5nbGUuIFBsZWFzZSB1c2Ugc2V0L3Vuc2V0IGZvciAqc2luZ2xlKiByZWxhdGlvbnNoaXBzJyk7XG4gICAgfVxufSIsIi8qKlxuICogV2hlbiB5b3Ugd29yayB3aXRoIGFkZC9yZW1vdmUgc2V0L3Vuc2V0XG4gKiBZb3UgaGF2ZSB0aGUgYWJpbGl0eSB0byBwYXNzIHN0cmluZ3MsIGFycmF5IG9mIHN0cmluZ3MsIG9iamVjdHMsIGFycmF5IG9mIG9iamVjdHNcbiAqIElmIHlvdSBhcmUgYWRkaW5nIHNvbWV0aGluZyBhbmQgeW91IHdhbnQgdG8gc2F2ZSB0aGVtIGluIGRiLCB5b3UgY2FuIHBhc3Mgb2JqZWN0cyB3aXRob3V0IGlkcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgbmV3IGNsYXNzIHtcbiAgICBnZXRJZHMod2hhdCwgb3B0aW9ucykge1xuICAgICAgICBpZiAoXy5pc0FycmF5KHdoYXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gXy5tYXAod2hhdCwgKHN1YldoYXQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRJZChzdWJXaGF0LCBvcHRpb25zKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBbdGhpcy5nZXRJZCh3aGF0LCBvcHRpb25zKV07XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLXR5cGUnLCBgVW5yZWNvZ25pemVkIHR5cGU6ICR7dHlwZW9mIHdoYXR9IGZvciBtYW5hZ2luZyBsaW5rc2ApO1xuICAgIH1cblxuICAgIGdldElkKHdoYXQsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aGF0ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIHdoYXQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHdoYXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoIXdoYXQuX2lkICYmIG9wdGlvbnMuc2F2ZVRvRGF0YWJhc2UpIHtcbiAgICAgICAgICAgICAgICB3aGF0Ll9pZCA9IG9wdGlvbnMuY29sbGVjdGlvbi5pbnNlcnQod2hhdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB3aGF0Ll9pZFxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE5hbWVkUXVlcnlCYXNlIHtcbiAgICBpc05hbWVkUXVlcnkgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IobmFtZSwgY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMucXVlcnlOYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKGJvZHkpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc29sdmVyID0gYm9keTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYm9keSA9IGRlZXBDbG9uZShib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyB8fCB7fTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICAgICAgdGhpcy5pc0V4cG9zZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIGBuYW1lZF9xdWVyeV8ke3RoaXMucXVlcnlOYW1lfWA7XG4gICAgfVxuXG4gICAgZ2V0IGlzUmVzb2x2ZXIoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMucmVzb2x2ZXI7XG4gICAgfVxuXG4gICAgc2V0UGFyYW1zKHBhcmFtcykge1xuICAgICAgICB0aGlzLnBhcmFtcyA9IF8uZXh0ZW5kKHt9LCB0aGlzLnBhcmFtcywgcGFyYW1zKTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBWYWxpZGF0ZXMgdGhlIHBhcmFtZXRlcnNcbiAgICAgKi9cbiAgICBkb1ZhbGlkYXRlUGFyYW1zKHBhcmFtcykge1xuICAgICAgICBwYXJhbXMgPSBwYXJhbXMgfHwgdGhpcy5wYXJhbXM7XG5cbiAgICAgICAgY29uc3Qge3ZhbGlkYXRlUGFyYW1zfSA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKCF2YWxpZGF0ZVBhcmFtcykgcmV0dXJuO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzLl92YWxpZGF0ZSh2YWxpZGF0ZVBhcmFtcywgcGFyYW1zKTtcbiAgICAgICAgfSBjYXRjaCAodmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBJbnZhbGlkIHBhcmFtZXRlcnMgc3VwcGxpZWQgdG8gdGhlIHF1ZXJ5IFwiJHt0aGlzLnF1ZXJ5TmFtZX1cIlxcbmAsIHZhbGlkYXRpb25FcnJvcik7XG4gICAgICAgICAgICB0aHJvdyB2YWxpZGF0aW9uRXJyb3I7IC8vIHJldGhyb3dcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNsb25lKG5ld1BhcmFtcykge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBfLmV4dGVuZCh7fSwgZGVlcENsb25lKHRoaXMucGFyYW1zKSwgbmV3UGFyYW1zKTtcblxuICAgICAgICBsZXQgY2xvbmUgPSBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHRoaXMucXVlcnlOYW1lLFxuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uLFxuICAgICAgICAgICAgdGhpcy5pc1Jlc29sdmVyID8gdGhpcy5yZXNvbHZlciA6IGRlZXBDbG9uZSh0aGlzLmJvZHkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgY2xvbmUuY2FjaGVyID0gdGhpcy5jYWNoZXI7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgY2xvbmUuZXhwb3NlQ29uZmlnID0gdGhpcy5leHBvc2VDb25maWc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xvbmU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbnxvYmplY3R9IHZhbGlkYXRvclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF92YWxpZGF0ZSh2YWxpZGF0b3IsIHBhcmFtcykge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbGlkYXRvcikpIHtcbiAgICAgICAgICAgIHZhbGlkYXRvci5jYWxsKG51bGwsIHBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrKHBhcmFtcywgdmFsaWRhdG9yKVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBDb3VudFN1YnNjcmlwdGlvbiBmcm9tICcuLi9xdWVyeS9jb3VudHMvY291bnRTdWJzY3JpcHRpb24nO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQgcmVjdXJzaXZlRmV0Y2ggZnJvbSAnLi4vcXVlcnkvbGliL3JlY3Vyc2l2ZUZldGNoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi9xdWVyeS9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBjYWxsV2l0aFByb21pc2UgZnJvbSAnLi4vcXVlcnkvbGliL2NhbGxXaXRoUHJvbWlzZSc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL25hbWVkUXVlcnkuYmFzZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7bnVsbHxhbnl8Kn1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmUoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCBgWW91IGNhbm5vdCBzdWJzY3JpYmUgdG8gYSByZXNvbHZlciBxdWVyeWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBNZXRlb3Iuc3Vic2NyaWJlKFxuICAgICAgICAgICAgdGhpcy5uYW1lLFxuICAgICAgICAgICAgdGhpcy5wYXJhbXMsXG4gICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBmb3IgdGhpcyBxdWVyeVxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge09iamVjdH1cbiAgICAgKi9cbiAgICBzdWJzY3JpYmVDb3VudChjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsIGBZb3UgY2Fubm90IHN1YnNjcmliZSB0byBhIHJlc29sdmVyIHF1ZXJ5YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBuZXcgQ291bnRTdWJzY3JpcHRpb24odGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fY291bnRlci5zdWJzY3JpYmUodGhpcy5wYXJhbXMsIGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVbnN1YnNjcmliZSBpZiBhbiBleGlzdGluZyBzdWJzY3JpcHRpb24gZXhpc3RzXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUgPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIHRvIHRoZSBjb3VudHMgaWYgYSBzdWJzY3JpcHRpb24gZXhpc3RzLlxuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlQ291bnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgZWxlbWVudHMgaW4gc3luYyB1c2luZyBwcm9taXNlc1xuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2hTeW5jKCkge1xuICAgICAgICBpZiAodGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1RoaXMgcXVlcnkgaXMgcmVhY3RpdmUsIG1lYW5pbmcgeW91IGNhbm5vdCB1c2UgcHJvbWlzZXMgdG8gZmV0Y2ggdGhlIGRhdGEuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhQcm9taXNlKHRoaXMubmFtZSwgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgb25lIGVsZW1lbnQgaW4gc3luY1xuICAgICAqIEByZXR1cm4geyp9XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2hPbmVTeW5jKCkge1xuICAgICAgICByZXR1cm4gXy5maXJzdChhd2FpdCB0aGlzLmZldGNoU3luYygpKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGF0YS5cbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tPck9wdGlvbnNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaChjYWxsYmFja09yT3B0aW9ucykge1xuICAgICAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmV0Y2hTdGF0aWMoY2FsbGJhY2tPck9wdGlvbnMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmV0Y2hSZWFjdGl2ZShjYWxsYmFja09yT3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoT25lKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgY29uc3QgY2FsbGJhY2sgPSBhcmdzWzBdO1xuICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oY2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignWW91IGRpZCBub3QgcHJvdmlkZSBhIHZhbGlkIGNhbGxiYWNrJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZmV0Y2goKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCByZXMgPyBfLmZpcnN0KHJlcykgOiBudWxsKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXy5maXJzdCh0aGlzLmZldGNoKC4uLmFyZ3MpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvdW50IG9mIG1hdGNoaW5nIGVsZW1lbnRzIGluIHN5bmMuXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBhc3luYyBnZXRDb3VudFN5bmMoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUaGlzIHF1ZXJ5IGlzIHJlYWN0aXZlLCBtZWFuaW5nIHlvdSBjYW5ub3QgdXNlIHByb21pc2VzIHRvIGZldGNoIHRoZSBkYXRhLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF3YWl0IGNhbGxXaXRoUHJvbWlzZSh0aGlzLm5hbWUgKyAnLmNvdW50JywgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvdW50IG9mIG1hdGNoaW5nIGVsZW1lbnRzLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgZ2V0Q291bnQoY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb3VudGVyLmdldENvdW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbm90LWFsbG93ZWQnLCAnWW91IGFyZSBvbiBjbGllbnQgc28geW91IG11c3QgZWl0aGVyIHByb3ZpZGUgYSBjYWxsYmFjayB0byBnZXQgdGhlIGNvdW50IG9yIHN1YnNjcmliZSBmaXJzdC4nKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1ldGVvci5jYWxsKHRoaXMubmFtZSArICcuY291bnQnLCB0aGlzLnBhcmFtcywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgbm9uLXJlYWN0aXZlIHF1ZXJpZXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFN0YXRpYyhjYWxsYmFjaykge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgZGF0YSBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBNZXRlb3IuY2FsbCh0aGlzLm5hbWUsIHRoaXMucGFyYW1zLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgd2hlbiB3ZSd2ZSBnb3QgYW4gYWN0aXZlIHB1YmxpY2F0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoUmVhY3RpdmUob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGxldCBib2R5ID0gdGhpcy5ib2R5O1xuICAgICAgICBpZiAodGhpcy5wYXJhbXMuJGJvZHkpIHtcbiAgICAgICAgICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGJvZHksIHRoaXMucGFyYW1zLiRib2R5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyhib2R5LCB0aGlzLnBhcmFtcyk7XG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd1NraXAgJiYgYm9keS4kb3B0aW9ucyAmJiBib2R5LiRvcHRpb25zLnNraXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBib2R5LiRvcHRpb25zLnNraXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVjdXJzaXZlRmV0Y2goXG4gICAgICAgICAgICBjcmVhdGVHcmFwaCh0aGlzLmNvbGxlY3Rpb24sIGJvZHkpXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IE5hbWVkUXVlcnlDbGllbnQgZnJvbSAnLi9uYW1lZFF1ZXJ5LmNsaWVudCc7XG5pbXBvcnQgTmFtZWRRdWVyeVNlcnZlciBmcm9tICcuL25hbWVkUXVlcnkuc2VydmVyJztcblxubGV0IE5hbWVkUXVlcnk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBOYW1lZFF1ZXJ5ID0gTmFtZWRRdWVyeVNlcnZlcjtcbn0gZWxzZSB7XG4gICAgTmFtZWRRdWVyeSA9IE5hbWVkUXVlcnlDbGllbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5hbWVkUXVlcnk7IiwiaW1wb3J0IHByZXBhcmVGb3JQcm9jZXNzIGZyb20gJy4uL3F1ZXJ5L2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL25hbWVkUXVlcnkuYmFzZSc7XG5pbXBvcnQgZGVlcENsb25lIGZyb20gJ2xvZGFzaC5jbG9uZWRlZXAnO1xuaW1wb3J0IE1lbW9yeVJlc3VsdENhY2hlciBmcm9tICcuL2NhY2hlL01lbW9yeVJlc3VsdENhY2hlcic7XG5pbXBvcnQgaW50ZXJzZWN0RGVlcCBmcm9tICcuLi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGV4dGVuZHMgQmFzZSB7XG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fcGVyZm9ybVNlY3VyaXR5Q2hlY2tzKGNvbnRleHQsIHRoaXMucGFyYW1zKTtcblxuICAgICAgICBpZiAodGhpcy5pc1Jlc29sdmVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmV0Y2hSZXNvbHZlckRhdGEoY29udGV4dCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0gZGVlcENsb25lKHRoaXMuYm9keSk7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJhbXMuJGJvZHkpIHtcbiAgICAgICAgICAgICAgICBib2R5ID0gaW50ZXJzZWN0RGVlcChib2R5LCB0aGlzLnBhcmFtcy4kYm9keSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIHdlIG11c3QgYXBwbHkgZW1vYmR5bWVudCBoZXJlXG4gICAgICAgICAgICB0aGlzLmRvRW1ib2RpbWVudElmSXRBcHBsaWVzKGJvZHkpO1xuXG4gICAgICAgICAgICBjb25zdCBxdWVyeSA9IHRoaXMuY29sbGVjdGlvbi5jcmVhdGVRdWVyeShcbiAgICAgICAgICAgICAgICBkZWVwQ2xvbmUoYm9keSksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IGRlZXBDbG9uZSh0aGlzLnBhcmFtcylcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jYWNoZXIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZUlkID0gdGhpcy5jYWNoZXIuZ2VuZXJhdGVRdWVyeUlkKHRoaXMucXVlcnlOYW1lLCB0aGlzLnBhcmFtcyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVyLmZldGNoKGNhY2hlSWQsIHtxdWVyeX0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcXVlcnkuZmV0Y2goKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2hPbmUoLi4uYXJncykge1xuICAgICAgICByZXR1cm4gXy5maXJzdCh0aGlzLmZldGNoKC4uLmFyZ3MpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBjb3VudCBvZiBtYXRjaGluZyBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthbnl9XG4gICAgICovXG4gICAgZ2V0Q291bnQoY29udGV4dCkge1xuICAgICAgICB0aGlzLl9wZXJmb3JtU2VjdXJpdHlDaGVja3MoY29udGV4dCwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgIGNvbnN0IGNvdW50Q3Vyc29yID0gdGhpcy5nZXRDdXJzb3JGb3JDb3VudGluZygpO1xuXG4gICAgICAgIGlmICh0aGlzLmNhY2hlcikge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVJZCA9ICdjb3VudDo6JyArIHRoaXMuY2FjaGVyLmdlbmVyYXRlUXVlcnlJZCh0aGlzLnF1ZXJ5TmFtZSwgdGhpcy5wYXJhbXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZXIuZmV0Y2goY2FjaGVJZCwge2NvdW50Q3Vyc29yfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY291bnRDdXJzb3IuY291bnQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjdXJzb3IgZm9yIGNvdW50aW5nXG4gICAgICogVGhpcyBpcyBtb3N0IGxpa2VseSB1c2VkIGZvciBjb3VudHMgY3Vyc29yXG4gICAgICovXG4gICAgZ2V0Q3Vyc29yRm9yQ291bnRpbmcoKSB7XG4gICAgICAgIGxldCBib2R5ID0gZGVlcENsb25lKHRoaXMuYm9keSk7XG4gICAgICAgIHRoaXMuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSk7XG4gICAgICAgIGJvZHkgPSBwcmVwYXJlRm9yUHJvY2Vzcyhib2R5LCB0aGlzLnBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5maW5kKGJvZHkuJGZpbHRlcnMgfHwge30sIHtmaWVsZHM6IHtfaWQ6IDF9fSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNhY2hlclxuICAgICAqL1xuICAgIGNhY2hlUmVzdWx0cyhjYWNoZXIpIHtcbiAgICAgICAgaWYgKCFjYWNoZXIpIHtcbiAgICAgICAgICAgIGNhY2hlciA9IG5ldyBNZW1vcnlSZXN1bHRDYWNoZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2FjaGVyID0gY2FjaGVyO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyZSByZXNvbHZlLiBUaGlzIGRvZXNuJ3QgYWN0dWFsbHkgY2FsbCB0aGUgcmVzb2x2ZXIsIGl0IGp1c3Qgc2V0cyBpdFxuICAgICAqIEBwYXJhbSBmblxuICAgICAqL1xuICAgIHJlc29sdmUoZm4pIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUmVzb2x2ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtY2FsbCcsIGBZb3UgY2Fubm90IHVzZSByZXNvbHZlKCkgb24gYSBub24gcmVzb2x2ZXIgTmFtZWRRdWVyeWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZXNvbHZlciA9IGZuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoUmVzb2x2ZXJEYXRhKGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgcmVzb2x2ZXIgPSB0aGlzLnJlc29sdmVyO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgcXVlcnkgPSB7XG4gICAgICAgICAgICBmZXRjaCgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzb2x2ZXIuY2FsbChjb250ZXh0LCBzZWxmLnBhcmFtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVyKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZUlkID0gdGhpcy5jYWNoZXIuZ2VuZXJhdGVRdWVyeUlkKHRoaXMucXVlcnlOYW1lLCB0aGlzLnBhcmFtcyk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZXIuZmV0Y2goY2FjaGVJZCwge3F1ZXJ5fSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcXVlcnkuZmV0Y2goKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dCBNZXRlb3IgbWV0aG9kL3B1Ymxpc2ggY29udGV4dFxuICAgICAqIEBwYXJhbSBwYXJhbXNcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3BlcmZvcm1TZWN1cml0eUNoZWNrcyhjb250ZXh0LCBwYXJhbXMpIHtcbiAgICAgICAgaWYgKGNvbnRleHQgJiYgdGhpcy5leHBvc2VDb25maWcpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbGxGaXJld2FsbChjb250ZXh0LCBjb250ZXh0LnVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcyhwYXJhbXMpO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBuZXcgY2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnN0b3JhZ2UgPSB7fTtcbiAgICB9XG5cbiAgICBhZGQoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5zdG9yYWdlW2tleV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtbmFtZScsIGBZb3UgaGF2ZSBwcmV2aW91c2x5IGRlZmluZWQgYW5vdGhlciBuYW1lZFF1ZXJ5IHdpdGggdGhlIHNhbWUgbmFtZTogXCIke2tleX1cIi4gTmFtZWQgUXVlcnkgbmFtZXMgc2hvdWxkIGJlIHVuaXF1ZS5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmFnZVtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlW2tleV07XG4gICAgfVxuXG4gICAgZ2V0QWxsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlO1xuICAgIH1cbn0iLCJpbXBvcnQge0VKU09OfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuXG4vKipcbiAqIFRoaXMgaXMgYSB2ZXJ5IGJhc2ljIGluLW1lbW9yeSByZXN1bHQgY2FjaGluZyBmdW5jdGlvbmFsaXR5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VSZXN1bHRDYWNoZXIge1xuICAgIGNvbnN0cnVjdG9yKGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBxdWVyeU5hbWVcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZW5lcmF0ZVF1ZXJ5SWQocXVlcnlOYW1lLCBwYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIGAke3F1ZXJ5TmFtZX06OiR7RUpTT04uc3RyaW5naWZ5KHBhcmFtcyl9YDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEdW1teSBmdW5jdGlvblxuICAgICAqL1xuICAgIGZldGNoKGNhY2hlSWQsIHtxdWVyeSwgY291bnRDdXJzb3J9KSB7XG4gICAgICAgIHRocm93ICdOb3QgaW1wbGVtZW50ZWQnO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBxdWVyeVxuICAgICAqIEBwYXJhbSBjb3VudEN1cnNvclxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIHN0YXRpYyBmZXRjaERhdGEoe3F1ZXJ5LCBjb3VudEN1cnNvcn0pIHtcbiAgICAgICAgaWYgKHF1ZXJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gcXVlcnkuZmV0Y2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBjb3VudEN1cnNvci5jb3VudCgpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCBCYXNlUmVzdWx0Q2FjaGVyIGZyb20gJy4vQmFzZVJlc3VsdENhY2hlcic7XG5cbmNvbnN0IERFRkFVTFRfVFRMID0gNjAwMDA7XG5cbi8qKlxuICogVGhpcyBpcyBhIHZlcnkgYmFzaWMgaW4tbWVtb3J5IHJlc3VsdCBjYWNoaW5nIGZ1bmN0aW9uYWxpdHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWVtb3J5UmVzdWx0Q2FjaGVyIGV4dGVuZHMgQmFzZVJlc3VsdENhY2hlciB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnID0ge30pIHtcbiAgICAgICAgc3VwZXIoY29uZmlnKTtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjYWNoZUlkXG4gICAgICogQHBhcmFtIHF1ZXJ5XG4gICAgICogQHBhcmFtIGNvdW50Q3Vyc29yXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2goY2FjaGVJZCwge3F1ZXJ5LCBjb3VudEN1cnNvcn0pIHtcbiAgICAgICAgY29uc3QgY2FjaGVEYXRhID0gdGhpcy5zdG9yZVtjYWNoZUlkXTtcbiAgICAgICAgaWYgKGNhY2hlRGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2xvbmVEZWVwKGNhY2hlRGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkYXRhID0gQmFzZVJlc3VsdENhY2hlci5mZXRjaERhdGEoe3F1ZXJ5LCBjb3VudEN1cnNvcn0pO1xuICAgICAgICB0aGlzLnN0b3JlRGF0YShjYWNoZUlkLCBkYXRhKTtcblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjYWNoZUlkXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKi9cbiAgICBzdG9yZURhdGEoY2FjaGVJZCwgZGF0YSkge1xuICAgICAgICBjb25zdCB0dGwgPSB0aGlzLmNvbmZpZy50dGwgfHwgREVGQVVMVF9UVEw7XG4gICAgICAgIHRoaXMuc3RvcmVbY2FjaGVJZF0gPSBjbG9uZURlZXAoZGF0YSk7XG5cbiAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbY2FjaGVJZF07XG4gICAgICAgIH0sIHR0bClcbiAgICB9XG59XG4iLCJpbXBvcnQgTmFtZWRRdWVyeSBmcm9tICcuLi9uYW1lZFF1ZXJ5LmpzJztcbmltcG9ydCB7RXhwb3NlU2NoZW1hLCBFeHBvc2VEZWZhdWx0c30gZnJvbSAnLi9zY2hlbWEuanMnO1xuaW1wb3J0IG1lcmdlRGVlcCBmcm9tICcuL2xpYi9tZXJnZURlZXAuanMnO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4uLy4uL3F1ZXJ5L2xpYi9jcmVhdGVHcmFwaC5qcyc7XG5pbXBvcnQgcmVjdXJzaXZlQ29tcG9zZSBmcm9tICcuLi8uLi9xdWVyeS9saWIvcmVjdXJzaXZlQ29tcG9zZS5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi4vLi4vcXVlcnkvbGliL3ByZXBhcmVGb3JQcm9jZXNzLmpzJztcbmltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgaW50ZXJzZWN0RGVlcCBmcm9tICcuLi8uLi9xdWVyeS9saWIvaW50ZXJzZWN0RGVlcCc7XG5pbXBvcnQgZ2VuQ291bnRFbmRwb2ludCBmcm9tICcuLi8uLi9xdWVyeS9jb3VudHMvZ2VuRW5kcG9pbnQuc2VydmVyJztcbmltcG9ydCB7Y2hlY2t9IGZyb20gJ21ldGVvci9jaGVjayc7XG5cbl8uZXh0ZW5kKE5hbWVkUXVlcnkucHJvdG90eXBlLCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIGV4cG9zZShjb25maWcgPSB7fSkge1xuICAgICAgICBpZiAoIU1ldGVvci5pc1NlcnZlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignaW52YWxpZC1lbnZpcm9ubWVudCcsIGBZb3UgbXVzdCBydW4gdGhpcyBpbiBzZXJ2ZXItc2lkZSBjb2RlYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5pc0V4cG9zZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3F1ZXJ5LWFscmVhZHktZXhwb3NlZCcsIGBZb3UgaGF2ZSBhbHJlYWR5IGV4cG9zZWQ6IFwiJHt0aGlzLm5hbWV9XCIgbmFtZWQgcXVlcnlgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXhwb3NlQ29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgRXhwb3NlRGVmYXVsdHMsIGNvbmZpZyk7XG4gICAgICAgIGNoZWNrKHRoaXMuZXhwb3NlQ29uZmlnLCBFeHBvc2VTY2hlbWEpO1xuXG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZy52YWxpZGF0ZVBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnZhbGlkYXRlUGFyYW1zID0gdGhpcy5leHBvc2VDb25maWcudmFsaWRhdGVQYXJhbXM7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXNSZXNvbHZlcikge1xuICAgICAgICAgICAgdGhpcy5faW5pdE5vcm1hbFF1ZXJ5KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9pbml0TWV0aG9kKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlzRXhwb3NlZCA9IHRydWU7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGEgbm9ybWFsIE5hbWVkUXVlcnkgKG5vcm1hbCA9PSBub3QgYSByZXNvbHZlcilcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0Tm9ybWFsUXVlcnkoKSB7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZXhwb3NlQ29uZmlnO1xuICAgICAgICBpZiAoY29uZmlnLm1ldGhvZCkge1xuICAgICAgICAgICAgdGhpcy5faW5pdE1ldGhvZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5faW5pdFB1YmxpY2F0aW9uKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbmZpZy5tZXRob2QgJiYgIWNvbmZpZy5wdWJsaWNhdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignd2VpcmQnLCAnSWYgeW91IHdhbnQgdG8gZXhwb3NlIHlvdXIgbmFtZWQgcXVlcnkgeW91IG5lZWQgdG8gc3BlY2lmeSBhdCBsZWFzdCBvbmUgb2YgW1wibWV0aG9kXCIsIFwicHVibGljYXRpb25cIl0gb3B0aW9ucyB0byB0cnVlJylcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2luaXRDb3VudE1ldGhvZCgpO1xuICAgICAgICB0aGlzLl9pbml0Q291bnRQdWJsaWNhdGlvbigpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBlbWJvZGllZCBib2R5IG9mIHRoZSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHsqfSBfZW1ib2R5IFxuICAgICAqIEBwYXJhbSB7Kn0gYm9keSBcbiAgICAgKi9cbiAgICBkb0VtYm9kaW1lbnRJZkl0QXBwbGllcyhib2R5KSB7XG4gICAgICAgIC8vIHF1ZXJ5IGlzIG5vdCBleHBvc2VkIHlldCwgc28gaXQgZG9lc24ndCBoYXZlIGVtYm9kaW1lbnQgbG9naWNcbiAgICAgICAgaWYgKCF0aGlzLmV4cG9zZUNvbmZpZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qge2VtYm9keX0gPSB0aGlzLmV4cG9zZUNvbmZpZztcblxuICAgICAgICBpZiAoIWVtYm9keSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihlbWJvZHkpKSB7XG4gICAgICAgICAgICBlbWJvZHkuY2FsbCh0aGlzLCBib2R5LCB0aGlzLnBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lcmdlRGVlcChcbiAgICAgICAgICAgICAgICBib2R5LFxuICAgICAgICAgICAgICAgIGVtYm9keVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0TWV0aG9kKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZV0obmV3UGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5fdW5ibG9ja0lmTmVjZXNzYXJ5KHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgLy8gc2VjdXJpdHkgaXMgZG9uZSBpbiB0aGUgZmV0Y2hpbmcgYmVjYXVzZSB3ZSBwcm92aWRlIGEgY29udGV4dFxuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmNsb25lKG5ld1BhcmFtcykuZmV0Y2godGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRDb3VudE1ldGhvZCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgTWV0ZW9yLm1ldGhvZHMoe1xuICAgICAgICAgICAgW3RoaXMubmFtZSArICcuY291bnQnXShuZXdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl91bmJsb2NrSWZOZWNlc3NhcnkodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBzZWN1cml0eSBpcyBkb25lIGluIHRoZSBmZXRjaGluZyBiZWNhdXNlIHdlIHByb3ZpZGUgYSBjb250ZXh0XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuY2xvbmUobmV3UGFyYW1zKS5nZXRDb3VudCh0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRDb3VudFB1YmxpY2F0aW9uKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBnZW5Db3VudEVuZHBvaW50KHNlbGYubmFtZSwge1xuICAgICAgICAgICAgZ2V0Q3Vyc29yKHNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICBjb25zdCBxdWVyeSA9IHNlbGYuY2xvbmUoc2Vzc2lvbi5wYXJhbXMpO1xuICAgICAgICAgICAgICAgIHJldHVybiBxdWVyeS5nZXRDdXJzb3JGb3JDb3VudGluZygpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZ2V0U2Vzc2lvbihuZXdQYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmRvVmFsaWRhdGVQYXJhbXMobmV3UGFyYW1zKTtcbiAgICAgICAgICAgICAgICBzZWxmLl9jYWxsRmlyZXdhbGwodGhpcywgdGhpcy51c2VySWQsIHBhcmFtcyk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBwYXJhbXM6IG5ld1BhcmFtcyB9O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2luaXRQdWJsaWNhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2hDb21wb3NpdGUodGhpcy5uYW1lLCBmdW5jdGlvbiAocGFyYW1zID0ge30pIHtcbiAgICAgICAgICAgIHNlbGYuX3VuYmxvY2tJZk5lY2Vzc2FyeSh0aGlzKTtcbiAgICAgICAgICAgIHNlbGYuZG9WYWxpZGF0ZVBhcmFtcyhwYXJhbXMpO1xuICAgICAgICAgICAgc2VsZi5fY2FsbEZpcmV3YWxsKHRoaXMsIHRoaXMudXNlcklkLCBwYXJhbXMpO1xuXG4gICAgICAgICAgICBsZXQgYm9keSA9IGRlZXBDbG9uZShzZWxmLmJvZHkpO1xuICAgICAgICAgICAgaWYgKHBhcmFtcy4kYm9keSkge1xuICAgICAgICAgICAgICAgIGJvZHkgPSBpbnRlcnNlY3REZWVwKGJvZHksIHBhcmFtcy4kYm9keSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGYuZG9FbWJvZGltZW50SWZJdEFwcGxpZXMoYm9keSk7XG4gICAgICAgICAgICBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3MoYm9keSwgcGFyYW1zKTtcblxuICAgICAgICAgICAgY29uc3Qgcm9vdE5vZGUgPSBjcmVhdGVHcmFwaChzZWxmLmNvbGxlY3Rpb24sIGJvZHkpO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVjdXJzaXZlQ29tcG9zZShyb290Tm9kZSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwYXJhbSB1c2VySWRcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfY2FsbEZpcmV3YWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHtmaXJld2FsbH0gPSB0aGlzLmV4cG9zZUNvbmZpZztcbiAgICAgICAgaWYgKCFmaXJld2FsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKF8uaXNBcnJheShmaXJld2FsbCkpIHtcbiAgICAgICAgICAgIGZpcmV3YWxsLmZvckVhY2goZmlyZSA9PiB7XG4gICAgICAgICAgICAgICAgZmlyZS5jYWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaXJld2FsbC5jYWxsKGNvbnRleHQsIHVzZXJJZCwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VuYmxvY2tJZk5lY2Vzc2FyeShjb250ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLmV4cG9zZUNvbmZpZy51bmJsb2NrKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC51bmJsb2NrKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC51bmJsb2NrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxufSk7XG4iLCJpbXBvcnQge01hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgY29uc3QgRXhwb3NlRGVmYXVsdHMgPSB7XG4gICAgcHVibGljYXRpb246IHRydWUsXG4gICAgbWV0aG9kOiB0cnVlLFxuICAgIHVuYmxvY2s6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgRXhwb3NlU2NoZW1hID0ge1xuICAgIGZpcmV3YWxsOiBNYXRjaC5NYXliZShcbiAgICAgICAgTWF0Y2guT25lT2YoRnVuY3Rpb24sIFtGdW5jdGlvbl0pXG4gICAgKSxcbiAgICBwdWJsaWNhdGlvbjogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgdW5ibG9jazogTWF0Y2guTWF5YmUoQm9vbGVhbiksXG4gICAgbWV0aG9kOiBNYXRjaC5NYXliZShCb29sZWFuKSxcbiAgICBlbWJvZHk6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgICksXG4gICAgdmFsaWRhdGVQYXJhbXM6IE1hdGNoLk1heWJlKFxuICAgICAgICBNYXRjaC5PbmVPZihPYmplY3QsIEZ1bmN0aW9uKVxuICAgICksXG59O1xuIiwiLyoqXG4gKiBEZWVwIG1lcmdlIHR3byBvYmplY3RzLlxuICogQHBhcmFtIHRhcmdldFxuICogQHBhcmFtIHNvdXJjZVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZURlZXAodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAoXy5pc09iamVjdCh0YXJnZXQpICYmIF8uaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICBfLmVhY2goc291cmNlLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihzb3VyY2Vba2V5XSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuICAgICAgICAgICAgICAgIGlmICghdGFyZ2V0W2tleV0pIE9iamVjdC5hc3NpZ24odGFyZ2V0LCB7IFtrZXldOiB7fSB9KTtcbiAgICAgICAgICAgICAgICBtZXJnZURlZXAodGFyZ2V0W2tleV0sIHNvdXJjZVtrZXldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHsgW2tleV06IHNvdXJjZVtrZXldIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufSIsImltcG9ydCBkZWVwQ2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeUJhc2Uge1xuICAgIGlzR2xvYmFsUXVlcnkgPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbiwgYm9keSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG5cbiAgICAgICAgdGhpcy5ib2R5ID0gZGVlcENsb25lKGJvZHkpO1xuXG4gICAgICAgIHRoaXMucGFyYW1zID0gb3B0aW9ucy5wYXJhbXMgfHwge307XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuXG4gICAgY2xvbmUobmV3UGFyYW1zKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IF8uZXh0ZW5kKHt9LCBkZWVwQ2xvbmUodGhpcy5wYXJhbXMpLCBuZXdQYXJhbXMpO1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIHRoaXMuY29sbGVjdGlvbixcbiAgICAgICAgICAgIGRlZXBDbG9uZSh0aGlzLmJvZHkpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHBhcmFtcyxcbiAgICAgICAgICAgICAgICAuLi50aGlzLm9wdGlvbnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIGBleHBvc3VyZV8ke3RoaXMuY29sbGVjdGlvbi5fbmFtZX1gO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyB0aGUgcGFyYW1ldGVyc1xuICAgICAqL1xuICAgIGRvVmFsaWRhdGVQYXJhbXMoKSB7XG4gICAgICAgIGNvbnN0IHt2YWxpZGF0ZVBhcmFtc30gPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIGlmICghdmFsaWRhdGVQYXJhbXMpIHJldHVybjtcblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHZhbGlkYXRlUGFyYW1zKSkge1xuICAgICAgICAgICAgdmFsaWRhdGVQYXJhbXMuY2FsbChudWxsLCB0aGlzLnBhcmFtcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNoZWNrKHRoaXMucGFyYW1zKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWVyZ2VzIHRoZSBwYXJhbXMgd2l0aCBwcmV2aW91cyBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFyYW1zXG4gICAgICogQHJldHVybnMge1F1ZXJ5fVxuICAgICAqL1xuICAgIHNldFBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgdGhpcy5wYXJhbXMgPSBfLmV4dGVuZCh7fSwgdGhpcy5wYXJhbXMsIHBhcmFtcyk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufSIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgQ291bnRTdWJzY3JpcHRpb24gZnJvbSAnLi9jb3VudHMvY291bnRTdWJzY3JpcHRpb24nO1xuaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4vbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCByZWN1cnNpdmVGZXRjaCBmcm9tICcuL2xpYi9yZWN1cnNpdmVGZXRjaC5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvclByb2Nlc3MgZnJvbSAnLi9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IGNhbGxXaXRoUHJvbWlzZSBmcm9tICcuL2xpYi9jYWxsV2l0aFByb21pc2UnO1xuaW1wb3J0IEJhc2UgZnJvbSAnLi9xdWVyeS5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnkgZXh0ZW5kcyBCYXNlIHtcbiAgICAvKipcbiAgICAgKiBTdWJzY3JpYmVcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259IG9wdGlvbmFsXG4gICAgICogQHJldHVybnMge251bGx8YW55fCp9XG4gICAgICovXG4gICAgc3Vic2NyaWJlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gTWV0ZW9yLnN1YnNjcmliZShcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb25IYW5kbGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlIHRvIHRoZSBjb3VudHMgZm9yIHRoaXMgcXVlcnlcbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAgICovXG4gICAgc3Vic2NyaWJlQ291bnQoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5kb1ZhbGlkYXRlUGFyYW1zKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9jb3VudGVyKSB7XG4gICAgICAgICAgICB0aGlzLl9jb3VudGVyID0gbmV3IENvdW50U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuc3Vic2NyaWJlKFxuICAgICAgICAgICAgcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyksXG4gICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlIGlmIGFuIGV4aXN0aW5nIHN1YnNjcmlwdGlvbiBleGlzdHNcbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmUgdG8gdGhlIGNvdW50cyBpZiBhIHN1YnNjcmlwdGlvbiBleGlzdHMuXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmVDb3VudCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHRoaXMuX2NvdW50ZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBlbGVtZW50cyBpbiBzeW5jIHVzaW5nIHByb21pc2VzXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaFN5bmMoKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignVGhpcyBxdWVyeSBpcyByZWFjdGl2ZSwgbWVhbmluZyB5b3UgY2Fubm90IHVzZSBwcm9taXNlcyB0byBmZXRjaCB0aGUgZGF0YS4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhd2FpdCBjYWxsV2l0aFByb21pc2UodGhpcy5uYW1lLCBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyBvbmUgZWxlbWVudCBpbiBzeW5jXG4gICAgICogQHJldHVybiB7Kn1cbiAgICAgKi9cbiAgICBhc3luYyBmZXRjaE9uZVN5bmMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KGF3YWl0IHRoaXMuZmV0Y2hTeW5jKCkpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIHRoZSBkYXRhLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja09yT3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNhbGxiYWNrT3JPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZG9WYWxpZGF0ZVBhcmFtcygpO1xuXG4gICAgICAgIGlmICghdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFN0YXRpYyhjYWxsYmFja09yT3B0aW9ucylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mZXRjaFJlYWN0aXZlKGNhbGxiYWNrT3JPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgZmV0Y2hPbmUoLi4uYXJncykge1xuICAgICAgICBpZiAoIXRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3NbMF07XG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihjYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdZb3UgZGlkIG5vdCBwcm92aWRlIGEgdmFsaWQgY2FsbGJhY2snKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5mZXRjaCgoZXJyLCByZXMpID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIHJlcyA/IF8uZmlyc3QocmVzKSA6IG51bGwpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMgaW4gc3luYy5cbiAgICAgKiBAcmV0dXJucyB7YW55fVxuICAgICAqL1xuICAgIGFzeW5jIGdldENvdW50U3luYygpIHtcbiAgICAgICAgaWYgKHRoaXMuX2NvdW50ZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1RoaXMgcXVlcnkgaXMgcmVhY3RpdmUsIG1lYW5pbmcgeW91IGNhbm5vdCB1c2UgcHJvbWlzZXMgdG8gZmV0Y2ggdGhlIGRhdGEuJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYXdhaXQgY2FsbFdpdGhQcm9taXNlKHRoaXMubmFtZSArICcuY291bnQnLCBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgY291bnQgb2YgbWF0Y2hpbmcgZWxlbWVudHMuXG4gICAgICogQHBhcmFtIGNhbGxiYWNrXG4gICAgICogQHJldHVybnMge2FueX1cbiAgICAgKi9cbiAgICBnZXRDb3VudChjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5fY291bnRlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvdW50ZXIuZ2V0Q291bnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgY291bnQgb3Igc3Vic2NyaWJlIGZpcnN0LicpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWV0ZW9yLmNhbGwoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArICcuY291bnQnLFxuICAgICAgICAgICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgbm9uLXJlYWN0aXZlIHF1ZXJpZXNcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9mZXRjaFN0YXRpYyhjYWxsYmFjaykge1xuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdub3QtYWxsb3dlZCcsICdZb3UgYXJlIG9uIGNsaWVudCBzbyB5b3UgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIGNhbGxiYWNrIHRvIGdldCB0aGUgZGF0YSBvciBzdWJzY3JpYmUgZmlyc3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBNZXRlb3IuY2FsbCh0aGlzLm5hbWUsIHByZXBhcmVGb3JQcm9jZXNzKHRoaXMuYm9keSwgdGhpcy5wYXJhbXMpLCBjYWxsYmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRmV0Y2hpbmcgd2hlbiB3ZSd2ZSBnb3QgYW4gYWN0aXZlIHB1YmxpY2F0aW9uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2ZldGNoUmVhY3RpdmUob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGxldCBib2R5ID0gcHJlcGFyZUZvclByb2Nlc3ModGhpcy5ib2R5LCB0aGlzLnBhcmFtcyk7XG4gICAgICAgIGlmICghb3B0aW9ucy5hbGxvd1NraXAgJiYgYm9keS4kb3B0aW9ucyAmJiBib2R5LiRvcHRpb25zLnNraXApIHtcbiAgICAgICAgICAgIGRlbGV0ZSBib2R5LiRvcHRpb25zLnNraXA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVjdXJzaXZlRmV0Y2goXG4gICAgICAgICAgICBjcmVhdGVHcmFwaCh0aGlzLmNvbGxlY3Rpb24sIGJvZHkpLFxuICAgICAgICAgICAgdGhpcy5wYXJhbXNcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgUXVlcnlDbGllbnQgZnJvbSAnLi9xdWVyeS5jbGllbnQnO1xuaW1wb3J0IFF1ZXJ5U2VydmVyIGZyb20gJy4vcXVlcnkuc2VydmVyJztcblxubGV0IFF1ZXJ5O1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgUXVlcnkgPSBRdWVyeVNlcnZlcjtcbn0gZWxzZSB7XG4gICAgUXVlcnkgPSBRdWVyeUNsaWVudDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUXVlcnk7IiwiaW1wb3J0IGNyZWF0ZUdyYXBoIGZyb20gJy4vbGliL2NyZWF0ZUdyYXBoLmpzJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuL2xpYi9wcmVwYXJlRm9yUHJvY2Vzcy5qcyc7XG5pbXBvcnQgaHlwZXJub3ZhIGZyb20gJy4vaHlwZXJub3ZhL2h5cGVybm92YS5qcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL3F1ZXJ5LmJhc2UnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSBleHRlbmRzIEJhc2Uge1xuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZGF0YS5cbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGZldGNoKGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb25zdCBub2RlID0gY3JlYXRlR3JhcGgoXG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24sXG4gICAgICAgICAgICBwcmVwYXJlRm9yUHJvY2Vzcyh0aGlzLmJvZHksIHRoaXMucGFyYW1zKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBoeXBlcm5vdmEobm9kZSwgY29udGV4dC51c2VySWQsIHtwYXJhbXM6IHRoaXMucGFyYW1zfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmZXRjaE9uZSguLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiBfLmZpcnN0KHRoaXMuZmV0Y2goLi4uYXJncykpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIGNvdW50IG9mIG1hdGNoaW5nIGVsZW1lbnRzLlxuICAgICAqIEByZXR1cm5zIHtpbnRlZ2VyfVxuICAgICAqL1xuICAgIGdldENvdW50KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmQodGhpcy5ib2R5LiRmaWx0ZXJzIHx8IHt9LCB7fSkuY291bnQoKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHsgQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5UIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEludGVybmFsIGNvbGxlY3Rpb24gdXNlZCB0byBzdG9yZSBjb3VudHMgb24gdGhlIGNsaWVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgbmV3IE1vbmdvLkNvbGxlY3Rpb24oQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5UKTtcbiIsImV4cG9ydCBjb25zdCBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgPSAnZ3JhcGhlcl9jb3VudHMnO1xuIiwiaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSZWFjdGl2ZVZhciB9IGZyb20gJ21ldGVvci9yZWFjdGl2ZS12YXInO1xuaW1wb3J0IHsgVHJhY2tlciB9IGZyb20gJ21ldGVvci90cmFja2VyJztcblxuaW1wb3J0IENvdW50cyBmcm9tICcuL2NvbGxlY3Rpb24nO1xuaW1wb3J0IGNyZWF0ZUZhdXhTdWJzY3JpcHRpb24gZnJvbSAnLi9jcmVhdGVGYXV4U3Vic2NyaXB0aW9uJztcbmltcG9ydCBwcmVwYXJlRm9yUHJvY2VzcyBmcm9tICcuLi9saWIvcHJlcGFyZUZvclByb2Nlc3MuanMnO1xuaW1wb3J0IE5hbWVkUXVlcnlCYXNlIGZyb20gJy4uLy4uL25hbWVkUXVlcnkvbmFtZWRRdWVyeS5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRTdWJzY3JpcHRpb24ge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Kn0gcXVlcnkgLSBUaGUgcXVlcnkgdG8gdXNlIHdoZW4gZmV0Y2hpbmcgY291bnRzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocXVlcnkpIHtcbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbiA9IG5ldyBSZWFjdGl2ZVZhcihudWxsKTtcbiAgICAgICAgdGhpcy5mYXV4SGFuZGxlID0gbnVsbDtcbiAgICAgICAgdGhpcy5xdWVyeSA9IHF1ZXJ5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0cyBhIHN1YnNjcmlwdGlvbiByZXF1ZXN0IGZvciByZWFjdGl2ZSBjb3VudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IGFyZyAtIFRoZSBhcmd1bWVudCB0byBwYXNzIHRvIHtuYW1lfS5jb3VudC5zdWJzY3JpYmVcbiAgICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAgICovXG4gICAgc3Vic2NyaWJlKGFyZywgY2FsbGJhY2spIHtcbiAgICAgICAgLy8gRG9uJ3QgdHJ5IHRvIHJlc3Vic2NyaWJlIGlmIGFyZyBoYXNuJ3QgY2hhbmdlZFxuICAgICAgICBpZiAoRUpTT04uZXF1YWxzKHRoaXMubGFzdEFyZ3MsIGFyZykgJiYgdGhpcy5mYXV4SGFuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mYXV4SGFuZGxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQobnVsbCk7XG4gICAgICAgIHRoaXMubGFzdEFyZ3MgPSBhcmc7XG5cbiAgICAgICAgTWV0ZW9yLmNhbGwodGhpcy5xdWVyeS5uYW1lICsgJy5jb3VudC5zdWJzY3JpYmUnLCBhcmcsIChlcnJvciwgdG9rZW4pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbWFya2VkRm9yVW5zdWJzY3JpYmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZSA9IE1ldGVvci5zdWJzY3JpYmUodGhpcy5xdWVyeS5uYW1lICsgJy5jb3VudCcsIHRva2VuLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQodG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNjb25uZWN0Q29tcHV0YXRpb24gPSBUcmFja2VyLmF1dG9ydW4oKCkgPT4gdGhpcy5oYW5kbGVEaXNjb25uZWN0KCkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JVbnN1YnNjcmliZSA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBjcmVhdGVGYXV4U3Vic2NyaXB0aW9uKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5mYXV4SGFuZGxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlcyBmcm9tIHRoZSBjb3VudCBlbmRwb2ludCwgaWYgdGhlcmUgaXMgc3VjaCBhIHN1YnNjcmlwdGlvbi5cbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3RDb21wdXRhdGlvbi5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkhhbmRsZS5zdG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSBoaXQgdGhpcyBicmFuY2gsIHRoZW4gTWV0ZW9yLmNhbGwgaW4gc3Vic2NyaWJlIGhhc24ndCBmaW5pc2hlZCB5ZXRcbiAgICAgICAgICAgIC8vIHNvIHNldCBhIGZsYWcgdG8gc3RvcCB0aGUgc3Vic2NyaXB0aW9uIGZyb20gYmVpbmcgY3JlYXRlZFxuICAgICAgICAgICAgdGhpcy5fbWFya2VkRm9yVW5zdWJzY3JpYmUgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hY2Nlc3NUb2tlbi5zZXQobnVsbCk7XG4gICAgICAgIHRoaXMuZmF1eEhhbmRsZSA9IG51bGw7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uSGFuZGxlID0gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZWFjdGl2ZWx5IGZldGNoIGN1cnJlbnQgZG9jdW1lbnQgY291bnQuIFJldHVybnMgbnVsbCBpZiB0aGUgc3Vic2NyaXB0aW9uIGlzIG5vdCByZWFkeSB5ZXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7TnVtYmVyfG51bGx9IC0gQ3VycmVudCBkb2N1bWVudCBjb3VudFxuICAgICAqL1xuICAgIGdldENvdW50KCkge1xuICAgICAgICBjb25zdCBpZCA9IHRoaXMuYWNjZXNzVG9rZW4uZ2V0KCk7XG4gICAgICAgIGlmIChpZCA9PT0gbnVsbCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgY29uc3QgZG9jID0gQ291bnRzLmZpbmRPbmUoaWQpO1xuICAgICAgICByZXR1cm4gZG9jLmNvdW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsbCBzZXNzaW9uIGluZm8gZ2V0cyBkZWxldGVkIHdoZW4gdGhlIHNlcnZlciBnb2VzIGRvd24sIHNvIHdoZW4gdGhlIGNsaWVudCBhdHRlbXB0cyB0b1xuICAgICAqIG9wdGltaXN0aWNhbGx5IHJlc3VtZSB0aGUgJy5jb3VudCcgcHVibGljYXRpb24sIHRoZSBzZXJ2ZXIgd2lsbCB0aHJvdyBhICduby1yZXF1ZXN0JyBlcnJvci5cbiAgICAgKlxuICAgICAqIFRoaXMgZnVuY3Rpb24gcHJldmVudHMgdGhhdCBieSBtYW51YWxseSBzdG9wcGluZyBhbmQgcmVzdGFydGluZyB0aGUgc3Vic2NyaXB0aW9uIHdoZW4gdGhlXG4gICAgICogY29ubmVjdGlvbiB0byB0aGUgc2VydmVyIGlzIGxvc3QuXG4gICAgICovXG4gICAgaGFuZGxlRGlzY29ubmVjdCgpIHtcbiAgICAgICAgY29uc3Qgc3RhdHVzID0gTWV0ZW9yLnN0YXR1cygpO1xuICAgICAgICBpZiAoIXN0YXR1cy5jb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX21hcmtlZEZvclJlc3VtZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZhdXhIYW5kbGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25IYW5kbGUuc3RvcCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHN0YXR1cy5jb25uZWN0ZWQgJiYgdGhpcy5fbWFya2VkRm9yUmVzdW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXJrZWRGb3JSZXN1bWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKHRoaXMubGFzdEFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCBhIHN1YnNjcmlwdGlvbiByZXF1ZXN0IGhhcyBiZWVuIG1hZGUuXG4gICAgICovXG4gICAgaXNTdWJzY3JpYmVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2Nlc3NUb2tlbi5nZXQoKSAhPT0gbnVsbDtcbiAgICB9XG59XG4iLCIvKipcbiAqIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBcImZha2VcIiBzdWJzY3JpcHRpb24gaGFuZGxlIHNvIHRoYXQgdXNlcnMgb2YgQ291bnRTdWJzY3JpcHRpb24jc3Vic2NyaWJlXG4gKiBoYXZlIGFuIGludGVyZmFjZSBjb25zaXN0ZW50IHdpdGggbm9ybWFsIHN1YnNjcmlwdGlvbnMuXG4gKlxuICogQHBhcmFtIHtDb3VudFN1YnNjcmlwdGlvbn0gY291bnRNYW5hZ2VyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IChjb3VudE1hbmFnZXIpID0+ICh7XG4gICAgcmVhZHk6ICgpID0+IGNvdW50TWFuYWdlci5hY2Nlc3NUb2tlbi5nZXQoKSAhPT0gbnVsbCAmJiBjb3VudE1hbmFnZXIuc3Vic2NyaXB0aW9uSGFuZGxlLnJlYWR5KCksXG4gICAgc3RvcDogKCkgPT4gY291bnRNYW5hZ2VyLnVuc3Vic2NyaWJlKCksXG59KTtcbiIsImltcG9ydCB7IGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuXG5pbXBvcnQgeyBDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbi8vIFhYWDogU2hvdWxkIHRoaXMgcGVyc2lzdCBiZXR3ZWVuIHNlcnZlciByZXN0YXJ0cz9cbmNvbnN0IGNvbGxlY3Rpb24gPSBuZXcgTW9uZ28uQ29sbGVjdGlvbihudWxsKTtcblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBnZW5lcmF0ZXMgYSByZWFjdGl2ZSBjb3VudCBlbmRwb2ludCAoYSBtZXRob2QgYW5kIHB1YmxpY2F0aW9uKSBmb3IgYSBjb2xsZWN0aW9uIG9yIG5hbWVkIHF1ZXJ5LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcXVlcnkgb3IgY29sbGVjdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0Q3Vyc29yIC0gVGFrZXMgaW4gdGhlIHVzZXIncyBzZXNzaW9uIGRvY3VtZW50IGFzIGFuIGFyZ3VtZW50LCBhbmQgdHVybnMgdGhhdCBpbnRvIGEgTW9uZ28gY3Vyc29yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0U2Vzc2lvbiAtIFRha2VzIHRoZSBzdWJzY3JpYmUgbWV0aG9kJ3MgYXJndW1lbnQgYXMgaXRzIHBhcmFtZXRlci4gU2hvdWxkIGVuZm9yY2UgYW55IG5lY2Vzc2FyeSBzZWN1cml0eSBjb25zdHJhaW50cy4gVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHN0b3JlZCBpbiB0aGUgc2Vzc2lvbiBkb2N1bWVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgKG5hbWUsIHsgZ2V0Q3Vyc29yLCBnZXRTZXNzaW9uIH0pID0+IHtcbiAgICBNZXRlb3IubWV0aG9kcyh7XG4gICAgICAgIFtuYW1lICsgJy5jb3VudC5zdWJzY3JpYmUnXShwYXJhbXNPckJvZHkpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb24gPSBnZXRTZXNzaW9uLmNhbGwodGhpcywgcGFyYW1zT3JCb2R5KTtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nU2Vzc2lvbiA9IGNvbGxlY3Rpb24uZmluZE9uZSh7IC4uLnNlc3Npb24sIHVzZXJJZDogdGhpcy51c2VySWQgfSk7XG5cbiAgICAgICAgICAgIC8vIFRyeSB0byByZXVzZSBzZXNzaW9ucyBpZiB0aGUgdXNlciBzdWJzY3JpYmVzIG11bHRpcGxlIHRpbWVzIHdpdGggdGhlIHNhbWUgZGF0YVxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nU2Vzc2lvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiBleGlzdGluZ1Nlc3Npb24uX2lkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGNvbGxlY3Rpb24uaW5zZXJ0KHtcbiAgICAgICAgICAgICAgICAuLi5zZXNzaW9uLFxuICAgICAgICAgICAgICAgIHF1ZXJ5OiBuYW1lLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgTWV0ZW9yLnB1Ymxpc2gobmFtZSArICcuY291bnQnLCBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICBjaGVjayh0b2tlbiwgU3RyaW5nKTtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSBjb2xsZWN0aW9uLmZpbmRPbmUoeyBfaWQ6IHRva2VuLCB1c2VySWQ6IHNlbGYudXNlcklkIH0pO1xuXG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCduby1yZXF1ZXN0JywgYFlvdSBtdXN0IGFjcXVpcmUgYSByZXF1ZXN0IHRva2VuIHZpYSB0aGUgXCIke25hbWV9LmNvdW50LnN1YnNjcmliZVwiIG1ldGhvZCBmaXJzdC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGN1cnNvciA9IGdldEN1cnNvci5jYWxsKHRoaXMsIHJlcXVlc3QpO1xuXG4gICAgICAgIC8vIFN0YXJ0IGNvdW50aW5nXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHNlbGYuYWRkZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcbiAgICAgICAgY29uc3QgaGFuZGxlID0gY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgICAgICAgIGFkZGVkKGlkKSB7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZWQoQ09VTlRTX0NPTExFQ1RJT05fQ0xJRU5ULCB0b2tlbiwgeyBjb3VudCB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZWQoaWQpIHtcbiAgICAgICAgICAgICAgICBjb3VudC0tO1xuICAgICAgICAgICAgICAgIHNlbGYuY2hhbmdlZChDT1VOVFNfQ09MTEVDVElPTl9DTElFTlQsIHRva2VuLCB7IGNvdW50IH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZi5vblN0b3AoKCkgPT4ge1xuICAgICAgICAgICAgaGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24ucmVtb3ZlKHRva2VuKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNlbGYucmVhZHkoKTtcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgc2lmdCBmcm9tICdzaWZ0JztcblxuLyoqXG4gKiBJdHMgcHVycG9zZSBpcyB0byBjcmVhdGUgZmlsdGVycyB0byBnZXQgdGhlIHJlbGF0ZWQgZGF0YSBpbiBvbmUgcmVxdWVzdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWdncmVnYXRlRmlsdGVycyB7XG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbk5vZGUsIG1ldGFGaWx0ZXJzKSB7XG4gICAgICAgIHRoaXMuY29sbGVjdGlvbk5vZGUgPSBjb2xsZWN0aW9uTm9kZTtcbiAgICAgICAgdGhpcy5saW5rZXIgPSBjb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgICAgIHRoaXMubWV0YUZpbHRlcnMgPSBtZXRhRmlsdGVycztcbiAgICAgICAgdGhpcy5pc1ZpcnR1YWwgPSB0aGlzLmxpbmtlci5pc1ZpcnR1YWwoKTtcblxuICAgICAgICB0aGlzLmxpbmtTdG9yYWdlRmllbGQgPSB0aGlzLmxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIH1cblxuICAgIGdldCBwYXJlbnRPYmplY3RzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0aW9uTm9kZS5wYXJlbnQucmVzdWx0cztcbiAgICB9XG5cbiAgICBjcmVhdGUoKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5saW5rZXIuc3RyYXRlZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlT25lKCk7XG4gICAgICAgICAgICBjYXNlICdvbmUtbWV0YSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlT25lTWV0YSgpO1xuICAgICAgICAgICAgY2FzZSAnbWFueSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlTWFueSgpO1xuICAgICAgICAgICAgY2FzZSAnbWFueS1tZXRhJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVNYW55TWV0YSgpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGxpbmtlciB0eXBlOiAke3RoaXMubGlua2VyLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVPbmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsIHRoaXMubGlua1N0b3JhZ2VGaWVsZClcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdOiB7XG4gICAgICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICAgICAgXy5wbHVjayh0aGlzLnBhcmVudE9iamVjdHMsICdfaWQnKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU9uZU1ldGEoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIGxldCBlbGlnaWJsZU9iamVjdHMgPSB0aGlzLnBhcmVudE9iamVjdHM7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1ldGFGaWx0ZXJzKSB7XG4gICAgICAgICAgICAgICAgZWxpZ2libGVPYmplY3RzID0gXy5maWx0ZXIodGhpcy5wYXJlbnRPYmplY3RzLCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2lmdCh0aGlzLm1ldGFGaWx0ZXJzKShvYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHN0b3JhZ2VzID0gXy5wbHVjayhlbGlnaWJsZU9iamVjdHMsIHRoaXMubGlua1N0b3JhZ2VGaWVsZCk7XG4gICAgICAgICAgICBsZXQgaWRzID0gW107XG4gICAgICAgICAgICBfLmVhY2goc3RvcmFnZXMsIHN0b3JhZ2UgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdG9yYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKHN0b3JhZ2UuX2lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBfaWQ6IHskaW46IF8udW5pcShpZHMpfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBmaWx0ZXJzID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5tZXRhRmlsdGVycykge1xuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLm1ldGFGaWx0ZXJzLCAodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJzW3RoaXMubGlua1N0b3JhZ2VGaWVsZCArICcuJyArIGtleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWx0ZXJzW3RoaXMubGlua1N0b3JhZ2VGaWVsZCArICcuX2lkJ10gPSB7XG4gICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCAnX2lkJylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVycztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZU1hbnkoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5T2ZJZHMgPSBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgdGhpcy5saW5rU3RvcmFnZUZpZWxkKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7XG4gICAgICAgICAgICAgICAgICAgICRpbjogXy51bmlxKFxuICAgICAgICAgICAgICAgICAgICAgICAgXy51bmlvbiguLi5hcnJheU9mSWRzKVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGFycmF5T2ZJZHMgPSBfLnBsdWNrKHRoaXMucGFyZW50T2JqZWN0cywgJ19pZCcpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBbdGhpcy5saW5rU3RvcmFnZUZpZWxkXToge1xuICAgICAgICAgICAgICAgICAgICAkaW46IF8udW5pcShcbiAgICAgICAgICAgICAgICAgICAgICAgIF8udW5pb24oLi4uYXJyYXlPZklkcylcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVNYW55TWV0YSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmlydHVhbCkge1xuICAgICAgICAgICAgbGV0IGlkcyA9IFtdO1xuXG4gICAgICAgICAgICBfLmVhY2godGhpcy5wYXJlbnRPYmplY3RzLCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5tZXRhRmlsdGVycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHNpZnQodGhpcy5tZXRhRmlsdGVycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfLmVhY2gob2JqZWN0W3RoaXMubGlua1N0b3JhZ2VGaWVsZF0sIG9iamVjdCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmFsaWQob2JqZWN0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChvYmplY3QuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChvYmplY3RbdGhpcy5saW5rU3RvcmFnZUZpZWxkXSwgb2JqZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHMucHVzaChvYmplY3QuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgX2lkOiB7JGluOiBfLnVuaXEoaWRzKX1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlsdGVycyA9IHt9O1xuICAgICAgICAgICAgaWYgKHRoaXMubWV0YUZpbHRlcnMpIHtcbiAgICAgICAgICAgICAgICBfLmVhY2godGhpcy5tZXRhRmlsdGVycywgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZmlsdGVycy5faWQgPSB7XG4gICAgICAgICAgICAgICAgJGluOiBfLnVuaXEoXG4gICAgICAgICAgICAgICAgICAgIF8ucGx1Y2sodGhpcy5wYXJlbnRPYmplY3RzLCAnX2lkJylcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIFt0aGlzLmxpbmtTdG9yYWdlRmllbGRdOiB7XG4gICAgICAgICAgICAgICAgICAgICRlbGVtTWF0Y2g6IGZpbHRlcnNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBzaWZ0IGZyb20gJ3NpZnQnO1xuaW1wb3J0IGNsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMgZnJvbSAnLi9saWIvY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyc7XG5cbi8qKlxuICogVGhpcyBvbmx5IGFwcGxpZXMgdG8gaW52ZXJzZWQgbGlua3MuIEl0IHdpbGwgYXNzZW1ibGUgdGhlIGRhdGEgaW4gYSBjb3JyZWN0IG1hbm5lci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNoaWxkQ29sbGVjdGlvbk5vZGUsIGFnZ3JlZ2F0ZVJlc3VsdHMsIG1ldGFGaWx0ZXJzKSB7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgbGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIGNvbnN0IGxpbmtOYW1lID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZTtcbiAgICBjb25zdCBpc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG5cbiAgICBsZXQgYWxsUmVzdWx0cyA9IFtdO1xuXG4gICAgaWYgKGlzTWV0YSAmJiBtZXRhRmlsdGVycykge1xuICAgICAgICBjb25zdCBtZXRhRmlsdGVyc1Rlc3QgPSBzaWZ0KG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgXy5lYWNoKGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzKHBhcmVudFJlc3VsdCwgbGlua1N0b3JhZ2VGaWVsZCwgbWV0YUZpbHRlcnNUZXN0KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoaXNNZXRhICYmIGxpbmtlci5pc01hbnkoKSkge1xuICAgICAgICAvLyBUaGlzIGNhc2UgaXMgdHJlYXRlZCBkaWZmZXJlbnRseSBiZWNhdXNlIHdlIGdldCBhbiBhcnJheSByZXNwb25zZSBmcm9tIHRoZSBwaXBlbGluZS5cblxuICAgICAgICBfLmVhY2goY2hpbGRDb2xsZWN0aW9uTm9kZS5wYXJlbnQucmVzdWx0cywgcGFyZW50UmVzdWx0ID0+IHtcbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gPSBwYXJlbnRSZXN1bHRbbGlua05hbWVdIHx8IFtdO1xuXG4gICAgICAgICAgICBjb25zdCBlbGlnaWJsZUFnZ3JlZ2F0ZVJlc3VsdHMgPSBfLmZpbHRlcihhZ2dyZWdhdGVSZXN1bHRzLCBhZ2dyZWdhdGVSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBfLmNvbnRhaW5zKGFnZ3JlZ2F0ZVJlc3VsdC5faWQsIHBhcmVudFJlc3VsdC5faWQpXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGVsaWdpYmxlQWdncmVnYXRlUmVzdWx0cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhcyA9IF8ucGx1Y2soZWxpZ2libGVBZ2dyZWdhdGVSZXN1bHRzLCAnZGF0YScpOyAvLy8gWyBbeDEsIHgyXSwgW3gyLCB4M10gXVxuXG4gICAgICAgICAgICAgICAgXy5lYWNoKGRhdGFzLCBkYXRhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGRhdGEsIGl0ZW0gPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50UmVzdWx0W2xpbmtOYW1lXS5wdXNoKGl0ZW0pXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIF8uZWFjaChhZ2dyZWdhdGVSZXN1bHRzLCBhZ2dyZWdhdGVSZXN1bHQgPT4ge1xuICAgICAgICAgICAgXy5lYWNoKGFnZ3JlZ2F0ZVJlc3VsdC5kYXRhLCBpdGVtID0+IGFsbFJlc3VsdHMucHVzaChpdGVtKSlcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgXy5lYWNoKGFnZ3JlZ2F0ZVJlc3VsdHMsIGFnZ3JlZ2F0ZVJlc3VsdCA9PiB7XG4gICAgICAgICAgICBsZXQgcGFyZW50UmVzdWx0ID0gXy5maW5kKGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50LnJlc3VsdHMsIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0Ll9pZCA9PSBhZ2dyZWdhdGVSZXN1bHQuX2lkO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChwYXJlbnRSZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRSZXN1bHRbY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0gPSBhZ2dyZWdhdGVSZXN1bHQuZGF0YTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgXy5lYWNoKGFnZ3JlZ2F0ZVJlc3VsdC5kYXRhLCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICBhbGxSZXN1bHRzLnB1c2goaXRlbSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjaGlsZENvbGxlY3Rpb25Ob2RlLnJlc3VsdHMgPSBhbGxSZXN1bHRzO1xufSIsImltcG9ydCBjcmVhdGVTZWFyY2hGaWx0ZXJzIGZyb20gJy4uLy4uL2xpbmtzL2xpYi9jcmVhdGVTZWFyY2hGaWx0ZXJzJztcbmltcG9ydCBjbGVhbk9iamVjdEZvck1ldGFGaWx0ZXJzIGZyb20gJy4vbGliL2NsZWFuT2JqZWN0Rm9yTWV0YUZpbHRlcnMnO1xuaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5cbmV4cG9ydCBkZWZhdWx0IChjaGlsZENvbGxlY3Rpb25Ob2RlLCB7bGltaXQsIHNraXAsIG1ldGFGaWx0ZXJzfSkgPT4ge1xuICAgIGNvbnN0IHBhcmVudCA9IGNoaWxkQ29sbGVjdGlvbk5vZGUucGFyZW50O1xuICAgIGNvbnN0IGxpbmtlciA9IGNoaWxkQ29sbGVjdGlvbk5vZGUubGlua2VyO1xuXG4gICAgY29uc3Qgc3RyYXRlZ3kgPSBsaW5rZXIuc3RyYXRlZ3k7XG4gICAgY29uc3QgaXNTaW5nbGUgPSBsaW5rZXIuaXNTaW5nbGUoKTtcbiAgICBjb25zdCBpc01ldGEgPSBsaW5rZXIuaXNNZXRhKCk7XG4gICAgY29uc3QgZmllbGRTdG9yYWdlID0gbGlua2VyLmxpbmtTdG9yYWdlRmllbGQ7XG5cbiAgICAvLyBjbGVhbmluZyB0aGUgcGFyZW50IHJlc3VsdHMgZnJvbSBhIGNoaWxkXG4gICAgLy8gdGhpcyBtYXkgYmUgdGhlIHdyb25nIGFwcHJvYWNoIGJ1dCBpdCB3b3JrcyBmb3Igbm93XG4gICAgaWYgKGlzTWV0YSAmJiBtZXRhRmlsdGVycykge1xuICAgICAgICBjb25zdCBtZXRhRmlsdGVyc1Rlc3QgPSBzaWZ0KG1ldGFGaWx0ZXJzKTtcbiAgICAgICAgXy5lYWNoKHBhcmVudC5yZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgY2xlYW5PYmplY3RGb3JNZXRhRmlsdGVycyhwYXJlbnRSZXN1bHQsIGZpZWxkU3RvcmFnZSwgbWV0YUZpbHRlcnNUZXN0KTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBfLmVhY2gocGFyZW50LnJlc3VsdHMsIHJlc3VsdCA9PiB7XG4gICAgICAgIGxldCBkYXRhID0gYXNzZW1ibGVEYXRhKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHJlc3VsdCwge1xuICAgICAgICAgICAgZmllbGRTdG9yYWdlLCBzdHJhdGVneSwgaXNTaW5nbGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVzdWx0W2NoaWxkQ29sbGVjdGlvbk5vZGUubGlua05hbWVdID0gZmlsdGVyQXNzZW1ibGVkRGF0YShkYXRhLCB7bGltaXQsIHNraXB9KVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJBc3NlbWJsZWREYXRhKGRhdGEsIHtsaW1pdCwgc2tpcH0pIHtcbiAgICBpZiAobGltaXQpIHtcbiAgICAgICAgcmV0dXJuIGRhdGEuc2xpY2Uoc2tpcCwgbGltaXQpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xufVxuXG5mdW5jdGlvbiBhc3NlbWJsZURhdGEoY2hpbGRDb2xsZWN0aW9uTm9kZSwgcmVzdWx0LCB7ZmllbGRTdG9yYWdlLCBzdHJhdGVneX0pIHtcbiAgICBjb25zdCBmaWx0ZXJzID0gY3JlYXRlU2VhcmNoRmlsdGVycyhyZXN1bHQsIGZpZWxkU3RvcmFnZSwgc3RyYXRlZ3ksIGZhbHNlKTtcblxuICAgIHJldHVybiBzaWZ0KGZpbHRlcnMsIGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyk7XG59XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoY2hpbGRDb2xsZWN0aW9uTm9kZSwgZmlsdGVycywgb3B0aW9ucywgdXNlcklkKSB7XG4gICAgbGV0IGNvbnRhaW5zRG90dGVkRmllbGRzID0gZmFsc2U7XG4gICAgY29uc3QgbGlua2VyID0gY2hpbGRDb2xsZWN0aW9uTm9kZS5saW5rZXI7XG4gICAgY29uc3QgbGlua1N0b3JhZ2VGaWVsZCA9IGxpbmtlci5saW5rU3RvcmFnZUZpZWxkO1xuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb247XG5cbiAgICBsZXQgcGlwZWxpbmUgPSBbXTtcblxuICAgIGlmIChjb2xsZWN0aW9uLmZpcmV3YWxsKSB7XG4gICAgICAgIGNvbGxlY3Rpb24uZmlyZXdhbGwoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICB9XG5cbiAgICBwaXBlbGluZS5wdXNoKHskbWF0Y2g6IGZpbHRlcnN9KTtcblxuICAgIGlmIChvcHRpb25zLnNvcnQgJiYgXy5rZXlzKG9wdGlvbnMuc29ydCkubGVuZ3RoID4gMCkge1xuICAgICAgICBwaXBlbGluZS5wdXNoKHskc29ydDogb3B0aW9ucy5zb3J0fSlcbiAgICB9XG5cbiAgICBsZXQgX2lkID0gbGlua1N0b3JhZ2VGaWVsZDtcbiAgICBpZiAobGlua2VyLmlzTWV0YSgpKSB7XG4gICAgICAgIF9pZCArPSAnLl9pZCc7XG4gICAgfVxuXG4gICAgbGV0IGRhdGFQdXNoID0ge1xuICAgICAgICBfaWQ6ICckX2lkJ1xuICAgIH07XG5cbiAgICBfLmVhY2gob3B0aW9ucy5maWVsZHMsICh2YWx1ZSwgZmllbGQpID0+IHtcbiAgICAgICAgaWYgKGZpZWxkLmluZGV4T2YoJy4nKSA+PSAwKSB7XG4gICAgICAgICAgICBjb250YWluc0RvdHRlZEZpZWxkcyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc2FmZUZpZWxkID0gZmllbGQucmVwbGFjZSgnLicsICdfX18nKTtcbiAgICAgICAgZGF0YVB1c2hbc2FmZUZpZWxkXSA9ICckJyArIGZpZWxkXG4gICAgfSk7XG5cbiAgICBpZiAobGlua2VyLmlzTWV0YSgpKSB7XG4gICAgICAgIGRhdGFQdXNoW2xpbmtTdG9yYWdlRmllbGRdID0gJyQnICsgbGlua1N0b3JhZ2VGaWVsZDtcbiAgICB9XG5cbiAgICBwaXBlbGluZS5wdXNoKHtcbiAgICAgICAgJGdyb3VwOiB7XG4gICAgICAgICAgICBfaWQ6IFwiJFwiICsgX2lkLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICRwdXNoOiBkYXRhUHVzaFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAob3B0aW9ucy5saW1pdCB8fCBvcHRpb25zLnNraXApIHtcbiAgICAgICAgbGV0ICRzbGljZSA9IFtcIiRkYXRhXCJdO1xuICAgICAgICBpZiAob3B0aW9ucy5za2lwKSAkc2xpY2UucHVzaChvcHRpb25zLnNraXApO1xuICAgICAgICBpZiAob3B0aW9ucy5saW1pdCkgJHNsaWNlLnB1c2gob3B0aW9ucy5saW1pdCk7XG5cbiAgICAgICAgcGlwZWxpbmUucHVzaCh7XG4gICAgICAgICAgICAkcHJvamVjdDoge1xuICAgICAgICAgICAgICAgIF9pZDogMSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7JHNsaWNlfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHJldHVybiB7cGlwZWxpbmUsIGNvbnRhaW5zRG90dGVkRmllbGRzfTtcbn0iLCJleHBvcnQgY29uc3QgU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQgPSAnX19fJzsiLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuLi9saWIvYXBwbHlQcm9wcy5qcyc7XG5pbXBvcnQgcHJlcGFyZUZvckRlbGl2ZXJ5IGZyb20gJy4uL2xpYi9wcmVwYXJlRm9yRGVsaXZlcnkuanMnO1xuaW1wb3J0IHN0b3JlSHlwZXJub3ZhUmVzdWx0cyBmcm9tICcuL3N0b3JlSHlwZXJub3ZhUmVzdWx0cy5qcyc7XG5cbmZ1bmN0aW9uIGh5cGVybm92YShjb2xsZWN0aW9uTm9kZSwgdXNlcklkKSB7XG4gICAgXy5lYWNoKGNvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb25Ob2RlcywgY2hpbGRDb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKGNoaWxkQ29sbGVjdGlvbk5vZGUpO1xuXG4gICAgICAgIHN0b3JlSHlwZXJub3ZhUmVzdWx0cyhjaGlsZENvbGxlY3Rpb25Ob2RlLCB1c2VySWQpO1xuICAgICAgICBoeXBlcm5vdmEoY2hpbGRDb2xsZWN0aW9uTm9kZSwgdXNlcklkKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHlwZXJub3ZhSW5pdChjb2xsZWN0aW9uTm9kZSwgdXNlcklkLCBjb25maWcgPSB7fSkge1xuICAgIGNvbnN0IGJ5cGFzc0ZpcmV3YWxscyA9IGNvbmZpZy5ieXBhc3NGaXJld2FsbHMgfHwgZmFsc2U7XG4gICAgY29uc3QgcGFyYW1zID0gY29uZmlnLnBhcmFtcyB8fCB7fTtcblxuICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKGNvbGxlY3Rpb25Ob2RlKTtcblxuICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uTm9kZS5jb2xsZWN0aW9uO1xuXG4gICAgY29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IGNvbGxlY3Rpb24uZmluZChmaWx0ZXJzLCBvcHRpb25zLCB1c2VySWQpLmZldGNoKCk7XG5cbiAgICBjb25zdCB1c2VySWRUb1Bhc3MgPSAoY29uZmlnLmJ5cGFzc0ZpcmV3YWxscykgPyB1bmRlZmluZWQgOiB1c2VySWQ7XG4gICAgaHlwZXJub3ZhKGNvbGxlY3Rpb25Ob2RlLCB1c2VySWRUb1Bhc3MpO1xuXG4gICAgcHJlcGFyZUZvckRlbGl2ZXJ5KGNvbGxlY3Rpb25Ob2RlLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25Ob2RlLnJlc3VsdHM7XG59XG4iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuLi9saWIvYXBwbHlQcm9wcy5qcyc7XG5pbXBvcnQgQWdncmVnYXRlRmlsdGVycyBmcm9tICcuL2FnZ3JlZ2F0ZVNlYXJjaEZpbHRlcnMuanMnO1xuaW1wb3J0IGFzc2VtYmxlIGZyb20gJy4vYXNzZW1ibGVyLmpzJztcbmltcG9ydCBhc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMgZnJvbSAnLi9hc3NlbWJsZUFnZ3JlZ2F0ZVJlc3VsdHMuanMnO1xuaW1wb3J0IGJ1aWxkQWdncmVnYXRlUGlwZWxpbmUgZnJvbSAnLi9idWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lLmpzJztcbmltcG9ydCBzbmFwQmFja0RvdHRlZEZpZWxkcyBmcm9tICcuL2xpYi9zbmFwQmFja0RvdHRlZEZpZWxkcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0b3JlSHlwZXJub3ZhUmVzdWx0cyhjaGlsZENvbGxlY3Rpb25Ob2RlLCB1c2VySWQpIHtcbiAgICBpZiAoY2hpbGRDb2xsZWN0aW9uTm9kZS5wYXJlbnQucmVzdWx0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkQ29sbGVjdGlvbk5vZGUucmVzdWx0cyA9IFtdO1xuICAgIH1cblxuICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKGNoaWxkQ29sbGVjdGlvbk5vZGUpO1xuXG4gICAgY29uc3QgbWV0YUZpbHRlcnMgPSBmaWx0ZXJzLiRtZXRhO1xuICAgIGNvbnN0IGFnZ3JlZ2F0ZUZpbHRlcnMgPSBuZXcgQWdncmVnYXRlRmlsdGVycyhjaGlsZENvbGxlY3Rpb25Ob2RlLCBtZXRhRmlsdGVycyk7XG4gICAgZGVsZXRlIGZpbHRlcnMuJG1ldGE7XG5cbiAgICBjb25zdCBsaW5rZXIgPSBjaGlsZENvbGxlY3Rpb25Ob2RlLmxpbmtlcjtcbiAgICBjb25zdCBpc1ZpcnR1YWwgPSBsaW5rZXIuaXNWaXJ0dWFsKCk7XG4gICAgY29uc3QgY29sbGVjdGlvbiA9IGNoaWxkQ29sbGVjdGlvbk5vZGUuY29sbGVjdGlvbjtcblxuICAgIF8uZXh0ZW5kKGZpbHRlcnMsIGFnZ3JlZ2F0ZUZpbHRlcnMuY3JlYXRlKCkpO1xuXG4gICAgLy8gaWYgaXQncyBub3QgdmlydHVhbCB0aGVuIHdlIHJldHJpZXZlIHRoZW0gYW5kIGFzc2VtYmxlIHRoZW0gaGVyZS5cbiAgICBpZiAoIWlzVmlydHVhbCkge1xuICAgICAgICBjb25zdCBmaWx0ZXJlZE9wdGlvbnMgPSBfLm9taXQob3B0aW9ucywgJ2xpbWl0Jyk7XG5cbiAgICAgICAgY2hpbGRDb2xsZWN0aW9uTm9kZS5yZXN1bHRzID0gY29sbGVjdGlvbi5maW5kKGZpbHRlcnMsIGZpbHRlcmVkT3B0aW9ucywgdXNlcklkKS5mZXRjaCgpO1xuXG4gICAgICAgIGFzc2VtYmxlKGNoaWxkQ29sbGVjdGlvbk5vZGUsIHtcbiAgICAgICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgICAgICBtZXRhRmlsdGVyc1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyB2aXJ0dWFscyBhcnJpdmUgaGVyZVxuICAgICAgICBsZXQge3BpcGVsaW5lLCBjb250YWluc0RvdHRlZEZpZWxkc30gPSBidWlsZEFnZ3JlZ2F0ZVBpcGVsaW5lKGNoaWxkQ29sbGVjdGlvbk5vZGUsIGZpbHRlcnMsIG9wdGlvbnMsIHVzZXJJZCk7XG5cbiAgICAgICAgbGV0IGFnZ3JlZ2F0ZVJlc3VsdHMgPSBjb2xsZWN0aW9uLmFnZ3JlZ2F0ZShwaXBlbGluZSwge2V4cGxhaW5zOiB0cnVlfSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIElmIGluIGFnZ3JlZ2F0aW9uIGl0IGNvbnRhaW5zICcuJywgd2UgcmVwbGFjZSBpdCB3aXRoIGEgY3VzdG9tIHN0cmluZyAnX19fJ1xuICAgICAgICAgKiBBbmQgdGhlbiBhZnRlciBhZ2dyZWdhdGlvbiBpcyBjb21wbGV0ZSB3ZSBuZWVkIHRvIHNuYXAtaXQgYmFjayB0byBob3cgaXQgd2FzLlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGNvbnRhaW5zRG90dGVkRmllbGRzKSB7XG4gICAgICAgICAgICBzbmFwQmFja0RvdHRlZEZpZWxkcyhhZ2dyZWdhdGVSZXN1bHRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzc2VtYmxlQWdncmVnYXRlUmVzdWx0cyhjaGlsZENvbGxlY3Rpb25Ob2RlLCBhZ2dyZWdhdGVSZXN1bHRzLCBtZXRhRmlsdGVycyk7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9iamVjdCwgZmllbGQsIG1ldGFGaWx0ZXJzVGVzdCkge1xuICAgIGlmIChvYmplY3RbZmllbGRdKSB7XG4gICAgICAgIGlmIChfLmlzQXJyYXkob2JqZWN0W2ZpZWxkXSkpIHtcbiAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBvYmplY3RbZmllbGRdLmZpbHRlcihtZXRhRmlsdGVyc1Rlc3QpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIW1ldGFGaWx0ZXJzVGVzdChvYmplY3RbZmllbGRdKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtmaWVsZF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCB7U0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlR9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoYWdncmVnYXRpb25SZXN1bHQpIHtcbiAgICBhZ2dyZWdhdGlvblJlc3VsdC5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc3VsdC5kYXRhID0gcmVzdWx0LmRhdGEubWFwKGRvY3VtZW50ID0+IHtcbiAgICAgICAgICAgIF8uZWFjaChkb2N1bWVudCwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YoU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRba2V5LnJlcGxhY2UoU0FGRV9ET1RURURfRklFTERfUkVQTEFDRU1FTlQsICcuJyldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkb2N1bWVudFtrZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gZG90Lm9iamVjdChkb2N1bWVudCk7XG4gICAgICAgIH0pXG4gICAgfSlcbn0iLCJjb25zdCByZXN0cmljdE9wdGlvbnMgPSBbXG4gICAgJ2Rpc2FibGVPcGxvZycsXG4gICAgJ3BvbGxpbmdJbnRlcnZhbE1zJyxcbiAgICAncG9sbGluZ1Rocm90dGxlTXMnXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcHBseVByb3BzKG5vZGUpIHtcbiAgICBsZXQgZmlsdGVycyA9IF8uZXh0ZW5kKHt9LCBub2RlLnByb3BzLiRmaWx0ZXJzKTtcbiAgICBsZXQgb3B0aW9ucyA9IF8uZXh0ZW5kKHt9LCBub2RlLnByb3BzLiRvcHRpb25zKTtcblxuICAgIG9wdGlvbnMgPSBfLm9taXQob3B0aW9ucywgLi4ucmVzdHJpY3RPcHRpb25zKTtcbiAgICBvcHRpb25zLmZpZWxkcyA9IG9wdGlvbnMuZmllbGRzIHx8IHt9O1xuXG4gICAgbm9kZS5hcHBseUZpZWxkcyhmaWx0ZXJzLCBvcHRpb25zKTtcblxuICAgIHJldHVybiB7ZmlsdGVycywgb3B0aW9uc307XG59XG4iLCJleHBvcnQgZGVmYXVsdCAobWV0aG9kLCBteVBhcmFtZXRlcnMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBNZXRlb3IuY2FsbChtZXRob2QsIG15UGFyYW1ldGVycywgKGVyciwgcmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZWplY3QoZXJyLnJlYXNvbiB8fCAnU29tZXRoaW5nIHdlbnQgd3JvbmcuJyk7XG5cbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59OyIsImltcG9ydCBDb2xsZWN0aW9uTm9kZSBmcm9tICcuLi9ub2Rlcy9jb2xsZWN0aW9uTm9kZS5qcyc7XG5pbXBvcnQgRmllbGROb2RlIGZyb20gJy4uL25vZGVzL2ZpZWxkTm9kZS5qcyc7XG5pbXBvcnQgUmVkdWNlck5vZGUgZnJvbSAnLi4vbm9kZXMvcmVkdWNlck5vZGUuanMnO1xuaW1wb3J0IGRvdGl6ZSBmcm9tICcuL2RvdGl6ZS5qcyc7XG5pbXBvcnQgY3JlYXRlUmVkdWNlcnMgZnJvbSAnLi4vcmVkdWNlcnMvbGliL2NyZWF0ZVJlZHVjZXJzJztcblxuY29uc3Qgc3BlY2lhbEZpZWxkcyA9IFtcbiAgICAnJGZpbHRlcnMnLFxuICAgICckb3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVycycsXG4gICAgJyRwb3N0T3B0aW9ucycsXG4gICAgJyRwb3N0RmlsdGVyJ1xuXTtcblxuLyoqXG4gKiBDcmVhdGVzIG5vZGUgb2JqZWN0cyBmcm9tIHRoZSBib2R5LiBUaGUgcm9vdCBpcyBhbHdheXMgYSBjb2xsZWN0aW9uIG5vZGUuXG4gKlxuICogQHBhcmFtIHJvb3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5vZGVzKHJvb3QpIHtcbiAgICAvLyB0aGlzIGlzIGEgZml4IGZvciBwaGFudG9tanMgdGVzdHMgKGRvbid0IHJlYWxseSB1bmRlcnN0YW5kIGl0LilcbiAgICBpZiAoIV8uaXNPYmplY3Qocm9vdC5ib2R5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgXy5lYWNoKHJvb3QuYm9keSwgKGJvZHksIGZpZWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGl0J3MgYSBwcm9wXG4gICAgICAgIGlmIChfLmNvbnRhaW5zKHNwZWNpYWxGaWVsZHMsIGZpZWxkTmFtZSkpIHtcbiAgICAgICAgICAgIHJvb3QuYWRkUHJvcChmaWVsZE5hbWUsIGJvZHkpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyB3b3JrYXJvdW5kLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2N1bHQtb2YtY29kZXJzL2dyYXBoZXIvaXNzdWVzLzEzNFxuICAgICAgICAvLyBUT0RPOiBmaW5kIGFub3RoZXIgd2F5IHRvIGRvIHRoaXNcbiAgICAgICAgaWYgKHJvb3QuY29sbGVjdGlvbi5kZWZhdWx0KSB7XG4gICAgICAgICAgcm9vdC5jb2xsZWN0aW9uID0gcm9vdC5jb2xsZWN0aW9uLmRlZmF1bHQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVja2luZyBpZiBpdCBpcyBhIGxpbmsuXG4gICAgICAgIGxldCBsaW5rZXIgPSByb290LmNvbGxlY3Rpb24uZ2V0TGlua2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaXQgaXMgYSBjYWNoZWQgbGlua1xuICAgICAgICAgICAgLy8gaWYgeWVzLCB0aGVuIHdlIG5lZWQgdG8gZXhwbGljaXRseSBkZWZpbmUgdGhpcyBhdCBjb2xsZWN0aW9uIGxldmVsXG4gICAgICAgICAgICAvLyBzbyB3aGVuIHdlIHRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgZGVsaXZlcnksIHdlIG1vdmUgaXQgdG8gdGhlIGxpbmsgbmFtZVxuICAgICAgICAgICAgaWYgKGxpbmtlci5pc0Rlbm9ybWFsaXplZCgpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxpbmtlci5pc1N1YkJvZHlEZW5vcm1hbGl6ZWQoYm9keSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHN1YnJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUobGlua2VyLmdldExpbmtlZENvbGxlY3Rpb24oKSwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgICAgIHJvb3QuYWRkKHN1YnJvb3QsIGxpbmtlcik7XG5cbiAgICAgICAgICAgIGNyZWF0ZU5vZGVzKHN1YnJvb3QpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY2hlY2tpbmcgaWYgaXQncyBhIHJlZHVjZXJcbiAgICAgICAgY29uc3QgcmVkdWNlciA9IHJvb3QuY29sbGVjdGlvbi5nZXRSZWR1Y2VyKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgaWYgKHJlZHVjZXIpIHtcbiAgICAgICAgICAgIGxldCByZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHJlZHVjZXIpO1xuICAgICAgICAgICAgcm9vdC5hZGQocmVkdWNlck5vZGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaXQncyBtb3N0IGxpa2VseSBhIGZpZWxkIHRoZW5cbiAgICAgICAgYWRkRmllbGROb2RlKGJvZHksIGZpZWxkTmFtZSwgcm9vdCk7XG4gICAgfSk7XG5cbiAgICBjcmVhdGVSZWR1Y2Vycyhyb290KTtcblxuICAgIGlmIChyb290LmZpZWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJvb3QuYWRkKG5ldyBGaWVsZE5vZGUoJ19pZCcsIDEpKTtcbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRGaWVsZE5vZGUoYm9keSwgZmllbGROYW1lLCByb290KSB7XG4gICAgLy8gaXQncyBub3QgYSBsaW5rIGFuZCBub3QgYSBzcGVjaWFsIHZhcmlhYmxlID0+IHdlIGFzc3VtZSBpdCdzIGEgZmllbGRcbiAgICBpZiAoXy5pc09iamVjdChib2R5KSkge1xuICAgICAgICBsZXQgZG90dGVkID0gZG90aXplLmNvbnZlcnQoe1tmaWVsZE5hbWVdOiBib2R5fSk7XG4gICAgICAgIF8uZWFjaChkb3R0ZWQsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICByb290LmFkZChuZXcgRmllbGROb2RlKGtleSwgdmFsdWUpKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGZpZWxkTm9kZSA9IG5ldyBGaWVsZE5vZGUoZmllbGROYW1lLCBib2R5KTtcbiAgICAgICAgcm9vdC5hZGQoZmllbGROb2RlKTtcbiAgICB9XG59XG5cbi8qKlxuICogQHBhcmFtIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSBib2R5XG4gKiBAcmV0dXJucyB7Q29sbGVjdGlvbk5vZGV9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBib2R5KSB7XG4gICAgbGV0IHJvb3QgPSBuZXcgQ29sbGVjdGlvbk5vZGUoY29sbGVjdGlvbiwgYm9keSk7XG4gICAgY3JlYXRlTm9kZXMocm9vdCk7XG5cbiAgICByZXR1cm4gcm9vdDtcbn07XG5cbi8qKlxuICogQWRzIGRlbm9ybWFsaXphdGlvbiBjb25maWcgcHJvcGVybHksIGluY2x1ZGluZyBfaWRcbiAqXG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGxpbmtlclxuICogQHBhcmFtIGJvZHlcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRGVub3JtYWxpemVkKHJvb3QsIGxpbmtlciwgYm9keSwgZmllbGROYW1lKSB7XG4gICAgT2JqZWN0LmFzc2lnbihib2R5LCB7X2lkOiAxfSk7XG5cbiAgICBjb25zdCBjYWNoZUZpZWxkID0gbGlua2VyLmxpbmtDb25maWcuZGVub3JtYWxpemUuZmllbGQ7XG4gICAgcm9vdC5zbmFwQ2FjaGUoY2FjaGVGaWVsZCwgZmllbGROYW1lKTtcblxuICAgIC8vIGlmIGl0J3Mgb25lIGFuZCBkaXJlY3QgYWxzbyBpbmNsdWRlIHRoZSBsaW5rIHN0b3JhZ2VcbiAgICBpZiAoIWxpbmtlci5pc01hbnkoKSAmJiAhbGlua2VyLmlzVmlydHVhbCgpKSB7XG4gICAgICAgIGFkZEZpZWxkTm9kZSgxLCBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZCwgcm9vdCk7XG4gICAgfVxuXG4gICAgYWRkRmllbGROb2RlKGJvZHksIGNhY2hlRmllbGQsIHJvb3QpO1xufSIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS92YXJkYXJzL2RvdGl6ZVxuZXhwb3J0IGRlZmF1bHQgZG90aXplID0ge307XG5cbmRvdGl6ZS5jb252ZXJ0ID0gZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcbiAgICBpZiAoKCFvYmogfHwgdHlwZW9mIG9iaiAhPSBcIm9iamVjdFwiKSAmJiAhQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIGlmIChwcmVmaXgpIHtcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB7fTtcbiAgICAgICAgICAgIG5ld09ialtwcmVmaXhdID0gb2JqO1xuICAgICAgICAgICAgcmV0dXJuIG5ld09iajtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbmV3T2JqID0ge307XG5cbiAgICBmdW5jdGlvbiByZWN1cnNlKG8sIHAsIGlzQXJyYXlJdGVtKSB7XG4gICAgICAgIGZvciAodmFyIGYgaW4gbykge1xuICAgICAgICAgICAgaWYgKG9bZl0gJiYgdHlwZW9mIG9bZl0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eUFycmF5KG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpXSA9IG9bZl07IC8vIGVtcHR5IGFycmF5XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdPYmogPSByZWN1cnNlKG9bZl0sIGdldEZpZWxkTmFtZShmLCBwLCBmYWxzZSwgdHJ1ZSksIHRydWUpOyAvLyBhcnJheVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNFbXB0eU9iaihvW2ZdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld09iaiA9IHJlY3Vyc2Uob1tmXSwgZ2V0RmllbGROYW1lKGYsIHAsIHRydWUpKTsgLy8gYXJyYXkgaXRlbSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0VtcHR5T2JqKG9bZl0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqW2dldEZpZWxkTmFtZShmLCBwKV0gPSBvW2ZdOyAvLyBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3T2JqID0gcmVjdXJzZShvW2ZdLCBnZXRGaWVsZE5hbWUoZiwgcCkpOyAvLyBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlJdGVtIHx8IGlzTnVtYmVyKGYpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld09ialtnZXRGaWVsZE5hbWUoZiwgcCwgdHJ1ZSldID0gb1tmXTsgLy8gYXJyYXkgaXRlbSBwcmltaXRpdmVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdPYmpbZ2V0RmllbGROYW1lKGYsIHApXSA9IG9bZl07IC8vIHByaW1pdGl2ZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0VtcHR5T2JqKG5ld09iaikpXG4gICAgICAgICAgICByZXR1cm4gb2JqO1xuXG4gICAgICAgIHJldHVybiBuZXdPYmo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIoZikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlSW50KGYpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VtcHR5T2JqKG9iaikge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9iaikge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFbXB0eUFycmF5KG8pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobykgJiYgby5sZW5ndGggPT0gMClcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0RmllbGROYW1lKGZpZWxkLCBwcmVmaXgsIGlzQXJyYXlJdGVtLCBpc0FycmF5KSB7XG4gICAgICAgIGlmIChpc0FycmF5KVxuICAgICAgICAgICAgcmV0dXJuIChwcmVmaXggPyBwcmVmaXggOiBcIlwiKSArIChpc051bWJlcihmaWVsZCkgPyBcIltcIiArIGZpZWxkICsgXCJdXCIgOiBcIi5cIiArIGZpZWxkKTtcbiAgICAgICAgZWxzZSBpZiAoaXNBcnJheUl0ZW0pXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCA6IFwiXCIpICsgXCJbXCIgKyBmaWVsZCArIFwiXVwiO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gKHByZWZpeCA/IHByZWZpeCArIFwiLlwiIDogXCJcIikgKyBmaWVsZDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVjdXJzZShvYmosIHByZWZpeCwgQXJyYXkuaXNBcnJheShvYmopKTtcbn07IiwiaW1wb3J0IGRvdCBmcm9tICdkb3Qtb2JqZWN0JztcbmltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIEdpdmVuIGEgbmFtZWQgcXVlcnkgdGhhdCBoYXMgYSBzcGVjaWZpYyBib2R5LCB5b3UgY2FuIHF1ZXJ5IGl0cyBzdWJib2R5XG4gKiBUaGlzIHBlcmZvcm1zIGFuIGludGVyc2VjdGlvbiBvZiB0aGUgYm9kaWVzIGFsbG93ZWQgaW4gZWFjaFxuICpcbiAqIEBwYXJhbSBhbGxvd2VkQm9keVxuICogQHBhcmFtIGNsaWVudEJvZHlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGFsbG93ZWRCb2R5LCBjbGllbnRCb2R5KSB7XG4gICAgY29uc3QgYWxsb3dlZEJvZHlEb3QgPSBfLmtleXMoZG90LmRvdChhbGxvd2VkQm9keSkpO1xuICAgIGNvbnN0IGNsaWVudEJvZHlEb3QgPSBfLmtleXMoZG90LmRvdChjbGllbnRCb2R5KSk7XG5cbiAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSBfLmludGVyc2VjdGlvbihhbGxvd2VkQm9keURvdCwgY2xpZW50Qm9keURvdCk7XG5cbiAgICBjb25zdCBidWlsZCA9IHt9O1xuICAgIGludGVyc2VjdGlvbi5mb3JFYWNoKGludGVyc2VjdGVkRmllbGQgPT4ge1xuICAgICAgICBidWlsZFtpbnRlcnNlY3RlZEZpZWxkXSA9IDE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZG90Lm9iamVjdChidWlsZCk7XG59IiwiLy8gMS4gQ2xvbmUgY2hpbGRyZW4gd2l0aCBtZXRhIHJlbGF0aW9uc2hpcHNcbi8vIDIuIEFwcGx5ICRtZXRhZGF0YSB0byBjaGlsZHJlblxuLy8gMy4gUmVtb3ZlcyBsaW5rIHN0b3JhZ2UgKGlmIG5vdCBzcGVjaWZpZWQpXG4vLyA0LiBTdG9yZXMgb25lUmVzdWx0IGxpbmtzIGFzIGEgc2luZ2xlIG9iamVjdCBpbnN0ZWFkIG9mIGFycmF5XG5pbXBvcnQgYXBwbHlSZWR1Y2VycyBmcm9tICcuLi9yZWR1Y2Vycy9saWIvYXBwbHlSZWR1Y2Vycyc7XG5pbXBvcnQgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzIGZyb20gJy4uL3JlZHVjZXJzL2xpYi9jbGVhblJlZHVjZXJMZWZ0b3ZlcnMnO1xuaW1wb3J0IHNpZnQgZnJvbSAnc2lmdCc7XG5pbXBvcnQge01pbmltb25nb30gZnJvbSAnbWV0ZW9yL21pbmltb25nbyc7XG5cbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwYXJhbXMpID0+IHtcbiAgICBzbmFwQmFja0NhY2hlcyhub2RlKTtcbiAgICBhcHBseVJlZHVjZXJzKG5vZGUsIHBhcmFtcyk7XG4gICAgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzKG5vZGUpO1xuXG4gICAgXy5lYWNoKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIGNsb25lTWV0YUNoaWxkcmVuKGNvbGxlY3Rpb25Ob2RlLCBub2RlLnJlc3VsdHMpXG4gICAgfSk7XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgYXNzZW1ibGVNZXRhZGF0YShjb2xsZWN0aW9uTm9kZSwgbm9kZS5yZXN1bHRzKVxuICAgIH0pO1xuXG4gICAgcmVtb3ZlTGlua1N0b3JhZ2VzKG5vZGUsIG5vZGUucmVzdWx0cyk7XG4gICAgc3RvcmVPbmVSZXN1bHRzKG5vZGUsIG5vZGUucmVzdWx0cyk7XG4gICAgYXBwbHlQb3N0RmlsdGVycyhub2RlKTtcbiAgICBhcHBseVBvc3RPcHRpb25zKG5vZGUpO1xuICAgIGFwcGx5UG9zdEZpbHRlcihub2RlLCBwYXJhbXMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQb3N0RmlsdGVycyhub2RlKSB7XG4gICAgY29uc3QgcG9zdEZpbHRlcnMgPSBub2RlLnByb3BzLiRwb3N0RmlsdGVycztcbiAgICBpZiAocG9zdEZpbHRlcnMpIHtcbiAgICAgICAgbm9kZS5yZXN1bHRzID0gc2lmdChwb3N0RmlsdGVycywgbm9kZS5yZXN1bHRzKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBvc3RPcHRpb25zKG5vZGUpIHtcbiAgICBjb25zdCBvcHRpb25zID0gbm9kZS5wcm9wcy4kcG9zdE9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuc29ydCkge1xuICAgICAgICAgICAgY29uc3Qgc29ydGVyID0gbmV3IE1pbmltb25nby5Tb3J0ZXIob3B0aW9ucy5zb3J0KTtcbiAgICAgICAgICAgIG5vZGUucmVzdWx0cy5zb3J0KHNvcnRlci5nZXRDb21wYXJhdG9yKCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmxpbWl0IHx8IG9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBvcHRpb25zLnNraXAgfHwgMDtcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IG9wdGlvbnMubGltaXQgPyBvcHRpb25zLmxpbWl0ICsgc3RhcnQgOiBub2RlLnJlc3VsdHMubGVuZ3RoO1xuICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gbm9kZS5yZXN1bHRzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qKlxuICogT3B0aW9uYWxseSBhcHBsaWVzIGEgcG9zdCBmaWx0ZXJpbmcgb3B0aW9uXG4gKi9cbmZ1bmN0aW9uIGFwcGx5UG9zdEZpbHRlcihub2RlLCBwYXJhbXMpIHtcbiAgICBpZiAobm9kZS5wcm9wcy4kcG9zdEZpbHRlcikge1xuICAgICAgICBjb25zdCBmaWx0ZXIgPSBub2RlLnByb3BzLiRwb3N0RmlsdGVyO1xuXG4gICAgICAgIGlmIChfLmlzQXJyYXkoZmlsdGVyKSkge1xuICAgICAgICAgICAgZmlsdGVyLmZvckVhY2goZiA9PiB7XG4gICAgICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gZihub2RlLnJlc3VsdHMsIHBhcmFtcyk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbm9kZS5yZXN1bHRzID0gZmlsdGVyKG5vZGUucmVzdWx0cywgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUxpbmtTdG9yYWdlcyhub2RlLCBzYW1lTGV2ZWxSZXN1bHRzKSB7XG4gICAgaWYgKCFzYW1lTGV2ZWxSZXN1bHRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBfLmVhY2gobm9kZS5jb2xsZWN0aW9uTm9kZXMsIGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgY29uc3QgcmVtb3ZlU3RvcmFnZUZpZWxkID0gY29sbGVjdGlvbk5vZGUuc2hvdWxkQ2xlYW5TdG9yYWdlO1xuICAgICAgICBfLmVhY2goc2FtZUxldmVsUmVzdWx0cywgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmIChyZW1vdmVTdG9yYWdlRmllbGQpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZW1vdmVMaW5rU3RvcmFnZXMoY29sbGVjdGlvbk5vZGUsIHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV0pO1xuICAgICAgICB9KVxuICAgIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yZU9uZVJlc3VsdHMobm9kZSwgc2FtZUxldmVsUmVzdWx0cykge1xuICAgIGlmICghc2FtZUxldmVsUmVzdWx0cykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChzYW1lTGV2ZWxSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgc3RvcmVPbmVSZXN1bHRzKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNvbGxlY3Rpb25Ob2RlLmlzT25lUmVzdWx0KSB7XG4gICAgICAgICAgICBzYW1lTGV2ZWxSZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSAmJiBfLmlzQXJyYXkocmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IHJlc3VsdFtjb2xsZWN0aW9uTm9kZS5saW5rTmFtZV1cbiAgICAgICAgICAgICAgICAgICAgICAgID8gXy5maXJzdChyZXN1bHRbY29sbGVjdGlvbk5vZGUubGlua05hbWVdKVxuICAgICAgICAgICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGNsb25lTWV0YUNoaWxkcmVuKG5vZGUsIHBhcmVudFJlc3VsdHMpIHtcbiAgICBpZiAoIXBhcmVudFJlc3VsdHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxpbmtOYW1lID0gbm9kZS5saW5rTmFtZTtcbiAgICBjb25zdCBpc01ldGEgPSBub2RlLmlzTWV0YTtcblxuICAgIHBhcmVudFJlc3VsdHMuZm9yRWFjaChwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICBpZiAoaXNNZXRhICYmIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0pIHtcbiAgICAgICAgICAgIHBhcmVudFJlc3VsdFtsaW5rTmFtZV0gPSBwYXJlbnRSZXN1bHRbbGlua05hbWVdLm1hcChvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvYmplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmNvbGxlY3Rpb25Ob2Rlcy5mb3JFYWNoKGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgICAgIGNsb25lTWV0YUNoaWxkcmVuKGNvbGxlY3Rpb25Ob2RlLCBwYXJlbnRSZXN1bHRbbGlua05hbWVdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZU1ldGFkYXRhKG5vZGUsIHBhcmVudFJlc3VsdHMpIHtcbiAgICAvLyBhc3NlbWJsaW5nIG1ldGFkYXRhIGlzIGRlcHRoIGZpcnN0XG4gICAgbm9kZS5jb2xsZWN0aW9uTm9kZXMuZm9yRWFjaChjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChwYXJlbnRSZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgYXNzZW1ibGVNZXRhZGF0YShjb2xsZWN0aW9uTm9kZSwgcmVzdWx0W25vZGUubGlua05hbWVdKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmIChub2RlLmlzTWV0YSkge1xuICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIF8uZWFjaChwYXJlbnRSZXN1bHRzLCBwYXJlbnRSZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkUmVzdWx0ID0gcGFyZW50UmVzdWx0W25vZGUubGlua05hbWVdO1xuXG4gICAgICAgICAgICAgICAgXy5lYWNoKGNoaWxkUmVzdWx0LCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdG9yYWdlID0gb2JqZWN0W25vZGUubGlua1N0b3JhZ2VGaWVsZF07XG5cbiAgICAgICAgICAgICAgICAgICAgc3RvcmVNZXRhZGF0YShvYmplY3QsIHBhcmVudFJlc3VsdCwgc3RvcmFnZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5lYWNoKHBhcmVudFJlc3VsdHMsIHBhcmVudFJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRSZXN1bHQgPSBwYXJlbnRSZXN1bHRbbm9kZS5saW5rTmFtZV07XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHBhcmVudFJlc3VsdFtub2RlLmxpbmtTdG9yYWdlRmllbGRdO1xuXG4gICAgICAgICAgICAgICAgXy5lYWNoKGNoaWxkUmVzdWx0LCBvYmplY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzdG9yZU1ldGFkYXRhKG9iamVjdCwgcGFyZW50UmVzdWx0LCBzdG9yYWdlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBzdG9yZU1ldGFkYXRhKGVsZW1lbnQsIHBhcmVudEVsZW1lbnQsIHN0b3JhZ2UsIGlzVmlydHVhbCkge1xuICAgIGlmIChpc1ZpcnR1YWwpIHtcbiAgICAgICAgbGV0ICRtZXRhZGF0YTtcbiAgICAgICAgaWYgKF8uaXNBcnJheShzdG9yYWdlKSkge1xuICAgICAgICAgICAgJG1ldGFkYXRhID0gXy5maW5kKHN0b3JhZ2UsIHN0b3JhZ2VJdGVtID0+IHN0b3JhZ2VJdGVtLl9pZCA9PSBwYXJlbnRFbGVtZW50Ll9pZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBzdG9yYWdlO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudC4kbWV0YWRhdGEgPSBfLm9taXQoJG1ldGFkYXRhLCAnX2lkJylcbiAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgJG1ldGFkYXRhO1xuICAgICAgICBpZiAoXy5pc0FycmF5KHN0b3JhZ2UpKSB7XG4gICAgICAgICAgICAkbWV0YWRhdGEgPSBfLmZpbmQoc3RvcmFnZSwgc3RvcmFnZUl0ZW0gPT4gc3RvcmFnZUl0ZW0uX2lkID09IGVsZW1lbnQuX2lkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRtZXRhZGF0YSA9IHN0b3JhZ2U7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LiRtZXRhZGF0YSA9IF8ub21pdCgkbWV0YWRhdGEsICdfaWQnKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHNuYXBCYWNrQ2FjaGVzKG5vZGUpIHtcbiAgICBub2RlLmNvbGxlY3Rpb25Ob2Rlcy5mb3JFYWNoKGNvbGxlY3Rpb25Ob2RlID0+IHtcbiAgICAgICAgc25hcEJhY2tDYWNoZXMoY29sbGVjdGlvbk5vZGUpO1xuICAgIH0pO1xuXG4gICAgaWYgKCFfLmlzRW1wdHkobm9kZS5zbmFwQ2FjaGVzKSkge1xuICAgICAgICAvLyBwcm9jZXNzIHN0dWZmXG4gICAgICAgIF8uZWFjaChub2RlLnNuYXBDYWNoZXMsIChsaW5rTmFtZSwgY2FjaGVGaWVsZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNTaW5nbGUgPSBfLmNvbnRhaW5zKG5vZGUuc25hcENhY2hlc1NpbmdsZXMsIGNhY2hlRmllbGQpO1xuICAgICAgICAgICAgY29uc3QgbGlua2VyID0gbm9kZS5jb2xsZWN0aW9uLmdldExpbmtlcihsaW5rTmFtZSk7XG4gICAgICAgICAgICAvLyB3ZSBkbyB0aGlzIGJlY2F1c2UgZm9yIG9uZSBkaXJlY3QgYW5kIG9uZSBtZXRhIGRpcmVjdCwgaWQgaXMgbm90IHN0b3JlZFxuICAgICAgICAgICAgY29uc3Qgc2hvdWRTdG9yZUxpbmtTdG9yYWdlID0gIWxpbmtlci5pc01hbnkoKSAmJiAhbGlua2VyLmlzVmlydHVhbCgpO1xuXG4gICAgICAgICAgICBub2RlLnJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRbY2FjaGVGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNob3VkU3RvcmVMaW5rU3RvcmFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHRbY2FjaGVGaWVsZF0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfaWQ6IGxpbmtlci5pc01ldGEoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHJlc3VsdFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF0uX2lkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmVzdWx0W2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTaW5nbGUgJiYgXy5pc0FycmF5KHJlc3VsdFtjYWNoZUZpZWxkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdFtsaW5rTmFtZV0gPSBfLmZpcnN0KHJlc3VsdFtjYWNoZUZpZWxkXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRbbGlua05hbWVdID0gcmVzdWx0W2NhY2hlRmllbGRdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtjYWNoZUZpZWxkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH1cbn1cbiIsImltcG9ydCB7Y2hlY2ssIE1hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcblxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlckZ1bmN0aW9uKHtcbiAgICBmaWx0ZXJzLFxuICAgIG9wdGlvbnMsXG4gICAgcGFyYW1zXG59KSB7XG4gICAgaWYgKHBhcmFtcy5maWx0ZXJzKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZmlsdGVycywgcGFyYW1zLmZpbHRlcnMpO1xuICAgIH1cbiAgICBpZiAocGFyYW1zLm9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvcHRpb25zLCBwYXJhbXMub3B0aW9ucyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBhcHBseUZpbHRlclJlY3Vyc2l2ZShkYXRhLCBwYXJhbXMgPSB7fSwgaXNSb290ID0gZmFsc2UpIHtcbiAgICBpZiAoaXNSb290ICYmICFfLmlzRnVuY3Rpb24oZGF0YS4kZmlsdGVyKSkge1xuICAgICAgICBkYXRhLiRmaWx0ZXIgPSBkZWZhdWx0RmlsdGVyRnVuY3Rpb247XG4gICAgfVxuXG4gICAgaWYgKGRhdGEuJGZpbHRlcikge1xuICAgICAgICBjaGVjayhkYXRhLiRmaWx0ZXIsIE1hdGNoLk9uZU9mKEZ1bmN0aW9uLCBbRnVuY3Rpb25dKSk7XG5cbiAgICAgICAgZGF0YS4kZmlsdGVycyA9IGRhdGEuJGZpbHRlcnMgfHwge307XG4gICAgICAgIGRhdGEuJG9wdGlvbnMgPSBkYXRhLiRvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIGlmIChfLmlzQXJyYXkoZGF0YS4kZmlsdGVyKSkge1xuICAgICAgICAgICAgZGF0YS4kZmlsdGVyLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAgICAgICAgICAgICBmaWx0ZXIuY2FsbChudWxsLCB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IGRhdGEuJGZpbHRlcnMsXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IGRhdGEuJG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogcGFyYW1zXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS4kZmlsdGVyKHtcbiAgICAgICAgICAgICAgICBmaWx0ZXJzOiBkYXRhLiRmaWx0ZXJzLFxuICAgICAgICAgICAgICAgIG9wdGlvbnM6IGRhdGEuJG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiBwYXJhbXNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZGF0YS4kZmlsdGVyID0gbnVsbDtcbiAgICAgICAgZGVsZXRlKGRhdGEuJGZpbHRlcik7XG4gICAgfVxuXG4gICAgXy5lYWNoKGRhdGEsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFwcGx5RmlsdGVyUmVjdXJzaXZlKHZhbHVlLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfSlcbn1cblxuZnVuY3Rpb24gYXBwbHlQYWdpbmF0aW9uKGJvZHksIF9wYXJhbXMpIHtcbiAgICBpZiAoYm9keVsnJHBhZ2luYXRlJ10gJiYgX3BhcmFtcykge1xuICAgICAgICBpZiAoIWJvZHkuJG9wdGlvbnMpIHtcbiAgICAgICAgICAgIGJvZHkuJG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfcGFyYW1zLmxpbWl0KSB7XG4gICAgICAgICAgICBfLmV4dGVuZChib2R5LiRvcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgbGltaXQ6IF9wYXJhbXMubGltaXRcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX3BhcmFtcy5za2lwKSB7XG4gICAgICAgICAgICBfLmV4dGVuZChib2R5LiRvcHRpb25zLCB7XG4gICAgICAgICAgICAgICAgc2tpcDogX3BhcmFtcy5za2lwXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIGJvZHlbJyRwYWdpbmF0ZSddO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKF9ib2R5LCBfcGFyYW1zID0ge30pID0+IHtcbiAgICBsZXQgYm9keSA9IGRlZXBDbG9uZShfYm9keSk7XG4gICAgbGV0IHBhcmFtcyA9IGRlZXBDbG9uZShfcGFyYW1zKTtcblxuICAgIGFwcGx5UGFnaW5hdGlvbihib2R5LCBwYXJhbXMpO1xuICAgIGFwcGx5RmlsdGVyUmVjdXJzaXZlKGJvZHksIHBhcmFtcywgdHJ1ZSk7XG5cbiAgICByZXR1cm4gYm9keTtcbn1cbiIsImltcG9ydCBhcHBseVByb3BzIGZyb20gJy4vYXBwbHlQcm9wcy5qcyc7XG5cbmZ1bmN0aW9uIGNvbXBvc2Uobm9kZSwgdXNlcklkKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZChwYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBsZXQge2ZpbHRlcnMsIG9wdGlvbnN9ID0gYXBwbHlQcm9wcyhub2RlKTtcblxuICAgICAgICAgICAgICAgIC8vIGNvbXBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGxpbmtlciA9IG5vZGUubGlua2VyO1xuICAgICAgICAgICAgICAgIGxldCBhY2Nlc3NvciA9IGxpbmtlci5jcmVhdGVMaW5rKHBhcmVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyB0aGUgcnVsZSBpcyB0aGlzLCBpZiBhIGNoaWxkIEkgd2FudCB0byBmZXRjaCBpcyB2aXJ0dWFsLCB0aGVuIEkgd2FudCB0byBmZXRjaCB0aGUgbGluayBzdG9yYWdlIG9mIHRob3NlIGZpZWxkc1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIuaXNWaXJ0dWFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMgPSBvcHRpb25zLmZpZWxkcyB8fCB7fTtcbiAgICAgICAgICAgICAgICAgICAgXy5leHRlbmQob3B0aW9ucy5maWVsZHMsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFtsaW5rZXIubGlua1N0b3JhZ2VGaWVsZF06IDFcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjY2Vzc29yLmZpbmQoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBjaGlsZHJlbjogXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIG4gPT4gY29tcG9zZShuLCB1c2VySWQpKVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgKG5vZGUsIHVzZXJJZCwgY29uZmlnID0ge2J5cGFzc0ZpcmV3YWxsczogZmFsc2V9KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZmluZCgpIHtcbiAgICAgICAgICAgIGxldCB7ZmlsdGVycywgb3B0aW9uc30gPSBhcHBseVByb3BzKG5vZGUpO1xuXG4gICAgICAgICAgICByZXR1cm4gbm9kZS5jb2xsZWN0aW9uLmZpbmQoZmlsdGVycywgb3B0aW9ucywgdXNlcklkKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGlsZHJlbjogXy5tYXAobm9kZS5jb2xsZWN0aW9uTm9kZXMsIG4gPT4ge1xuICAgICAgICAgICAgY29uc3QgdXNlcklkVG9QYXNzID0gKGNvbmZpZy5ieXBhc3NGaXJld2FsbHMpID8gdW5kZWZpbmVkIDogdXNlcklkO1xuXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZShuLCB1c2VySWRUb1Bhc3MpO1xuICAgICAgICB9KVxuICAgIH1cbn0iLCJpbXBvcnQgYXBwbHlQcm9wcyBmcm9tICcuL2FwcGx5UHJvcHMuanMnO1xuaW1wb3J0IHsgYXNzZW1ibGVNZXRhZGF0YSwgcmVtb3ZlTGlua1N0b3JhZ2VzLCBzdG9yZU9uZVJlc3VsdHMgfSBmcm9tICcuL3ByZXBhcmVGb3JEZWxpdmVyeSc7XG5pbXBvcnQgcHJlcGFyZUZvckRlbGl2ZXJ5IGZyb20gJy4vcHJlcGFyZUZvckRlbGl2ZXJ5JztcblxuLyoqXG4gKiBUaGlzIGlzIGFsd2F5cyBydW4gY2xpZW50IHNpZGUgdG8gYnVpbGQgdGhlIGRhdGEgZ3JhcGggb3V0IG9mIGNsaWVudC1zaWRlIGNvbGxlY3Rpb25zLlxuICpcbiAqIEBwYXJhbSBub2RlXG4gKiBAcGFyYW0gcGFyZW50T2JqZWN0XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gZmV0Y2gobm9kZSwgcGFyZW50T2JqZWN0KSB7XG4gICAgbGV0IHtmaWx0ZXJzLCBvcHRpb25zfSA9IGFwcGx5UHJvcHMobm9kZSk7XG5cbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgaWYgKHBhcmVudE9iamVjdCkge1xuICAgICAgICBsZXQgYWNjZXNzb3IgPSBub2RlLmxpbmtlci5jcmVhdGVMaW5rKHBhcmVudE9iamVjdCwgbm9kZS5jb2xsZWN0aW9uKTtcblxuICAgICAgICBpZiAobm9kZS5pc1ZpcnR1YWwpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzID0gb3B0aW9ucy5maWVsZHMgfHwge307XG4gICAgICAgICAgICBfLmV4dGVuZChvcHRpb25zLmZpZWxkcywge1xuICAgICAgICAgICAgICAgIFtub2RlLmxpbmtTdG9yYWdlRmllbGRdOiAxXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlc3VsdHMgPSBhY2Nlc3Nvci5maW5kKGZpbHRlcnMsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0cyA9IG5vZGUuY29sbGVjdGlvbi5maW5kKGZpbHRlcnMsIG9wdGlvbnMpLmZldGNoKCk7XG4gICAgfVxuXG4gICAgXy5lYWNoKG5vZGUuY29sbGVjdGlvbk5vZGVzLCBjb2xsZWN0aW9uTm9kZSA9PiB7XG4gICAgICAgIF8uZWFjaChyZXN1bHRzLCByZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmVzdWx0W2NvbGxlY3Rpb25Ob2RlLmxpbmtOYW1lXSA9IGZldGNoKGNvbGxlY3Rpb25Ob2RlLCByZXN1bHQpO1xuICAgICAgICAgICAgLy9kZWxldGUgcmVzdWx0W25vZGUubGlua2VyLmxpbmtTdG9yYWdlRmllbGRdO1xuICAgICAgICB9KVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IChub2RlLCBwYXJhbXMpID0+IHtcbiAgICBub2RlLnJlc3VsdHMgPSBmZXRjaChub2RlKTtcblxuICAgIHByZXBhcmVGb3JEZWxpdmVyeShub2RlLCBwYXJhbXMpO1xuXG4gICAgcmV0dXJuIG5vZGUucmVzdWx0cztcbn1cbiIsImltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi9maWVsZE5vZGUuanMnO1xuaW1wb3J0IFJlZHVjZXJOb2RlIGZyb20gJy4vcmVkdWNlck5vZGUuanMnO1xuaW1wb3J0IGRlZXBDbG9uZSBmcm9tICdsb2Rhc2guY2xvbmVkZWVwJztcbmltcG9ydCB7Y2hlY2ssIE1hdGNofSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xsZWN0aW9uTm9kZSB7XG4gICAgY29uc3RydWN0b3IoY29sbGVjdGlvbiwgYm9keSA9IHt9LCBsaW5rTmFtZSA9IG51bGwpIHtcbiAgICAgICAgaWYgKGNvbGxlY3Rpb24gJiYgIV8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtYm9keScsICdFdmVyeSBjb2xsZWN0aW9uIGxpbmsgc2hvdWxkIGhhdmUgaXRzIGJvZHkgZGVmaW5lZCBhcyBhbiBvYmplY3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJvZHkgPSBkZWVwQ2xvbmUoYm9keSk7XG4gICAgICAgIHRoaXMubGlua05hbWUgPSBsaW5rTmFtZTtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcblxuICAgICAgICB0aGlzLm5vZGVzID0gW107XG4gICAgICAgIHRoaXMucHJvcHMgPSB7fTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICB0aGlzLmxpbmtlciA9IG51bGw7XG4gICAgICAgIHRoaXMubGlua1N0b3JhZ2VGaWVsZCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yZWR1Y2VycyA9IFtdO1xuICAgICAgICB0aGlzLnJlc3VsdHMgPSBbXTtcbiAgICAgICAgdGhpcy5zbmFwQ2FjaGVzID0ge307IC8vIHtjYWNoZUZpZWxkOiBsaW5rTmFtZX1cbiAgICAgICAgdGhpcy5zbmFwQ2FjaGVzU2luZ2xlcyA9IFtdOyAvLyBbY2FjaGVGaWVsZDEsIGNhY2hlRmllbGQyXVxuICAgIH1cblxuICAgIGdldCBjb2xsZWN0aW9uTm9kZXMoKSB7XG4gICAgICAgIHJldHVybiBfLmZpbHRlcih0aGlzLm5vZGVzLCBuID0+IG4gaW5zdGFuY2VvZiBDb2xsZWN0aW9uTm9kZSlcbiAgICB9XG5cbiAgICBnZXQgZmllbGROb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMubm9kZXMsIG4gPT4gbiBpbnN0YW5jZW9mIEZpZWxkTm9kZSk7XG4gICAgfVxuXG4gICAgZ2V0IHJlZHVjZXJOb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIF8uZmlsdGVyKHRoaXMubm9kZXMsIG4gPT4gbiBpbnN0YW5jZW9mIFJlZHVjZXJOb2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGNoaWxkcmVuIHRvIGl0c2VsZlxuICAgICAqXG4gICAgICogQHBhcmFtIG5vZGVcbiAgICAgKiBAcGFyYW0gbGlua2VyXG4gICAgICovXG4gICAgYWRkKG5vZGUsIGxpbmtlcikge1xuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXM7XG5cbiAgICAgICAgaWYgKGxpbmtlcikge1xuICAgICAgICAgICAgbm9kZS5saW5rZXIgPSBsaW5rZXI7XG4gICAgICAgICAgICBub2RlLmxpbmtTdG9yYWdlRmllbGQgPSBsaW5rZXIubGlua1N0b3JhZ2VGaWVsZDtcbiAgICAgICAgICAgIG5vZGUuaXNNZXRhID0gbGlua2VyLmlzTWV0YSgpO1xuICAgICAgICAgICAgbm9kZS5pc1ZpcnR1YWwgPSBsaW5rZXIuaXNWaXJ0dWFsKCk7XG4gICAgICAgICAgICBub2RlLmlzT25lUmVzdWx0ID0gbGlua2VyLmlzT25lUmVzdWx0KCk7XG4gICAgICAgICAgICBub2RlLnNob3VsZENsZWFuU3RvcmFnZSA9IHRoaXMuX3Nob3VsZENsZWFuU3RvcmFnZShub2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubm9kZXMucHVzaChub2RlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcHJvcFxuICAgICAqIEBwYXJhbSB2YWx1ZVxuICAgICAqL1xuICAgIGFkZFByb3AocHJvcCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHByb3AgPT09ICckcG9zdEZpbHRlcicpIHtcbiAgICAgICAgICAgIGNoZWNrKHZhbHVlLCBNYXRjaC5PbmVPZihGdW5jdGlvbiwgW0Z1bmN0aW9uXSkpXG4gICAgICAgIH1cblxuICAgICAgICBfLmV4dGVuZCh0aGlzLnByb3BzLCB7XG4gICAgICAgICAgICBbcHJvcF06IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBfbm9kZVxuICAgICAqL1xuICAgIHJlbW92ZShfbm9kZSkge1xuICAgICAgICB0aGlzLm5vZGVzID0gXy5maWx0ZXIodGhpcy5ub2Rlcywgbm9kZSA9PiBfbm9kZSAhPT0gbm9kZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGZpbHRlcnNcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGFwcGx5RmllbGRzKGZpbHRlcnMsIG9wdGlvbnMpIHtcbiAgICAgICAgbGV0IGhhc0FkZGVkQW55RmllbGQgPSBmYWxzZTtcblxuICAgICAgICBfLmVhY2godGhpcy5maWVsZE5vZGVzLCBuID0+IHtcbiAgICAgICAgICAgIGhhc0FkZGVkQW55RmllbGQgPSB0cnVlO1xuICAgICAgICAgICAgbi5hcHBseUZpZWxkcyhvcHRpb25zLmZpZWxkcylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gaXQgd2lsbCBvbmx5IGdldCBoZXJlIGlmIGl0IGhhcyBjb2xsZWN0aW9uTm9kZXMgY2hpbGRyZW5cbiAgICAgICAgXy5lYWNoKHRoaXMuY29sbGVjdGlvbk5vZGVzLCAoY29sbGVjdGlvbk5vZGUpID0+IHtcbiAgICAgICAgICAgIGxldCBsaW5rZXIgPSBjb2xsZWN0aW9uTm9kZS5saW5rZXI7XG5cbiAgICAgICAgICAgIGlmIChsaW5rZXIgJiYgIWxpbmtlci5pc1ZpcnR1YWwoKSkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZmllbGRzW2xpbmtlci5saW5rU3RvcmFnZUZpZWxkXSA9IDE7XG4gICAgICAgICAgICAgICAgaGFzQWRkZWRBbnlGaWVsZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGlmIGhlIHNlbGVjdGVkIGZpbHRlcnMsIHdlIHNob3VsZCBhdXRvbWF0aWNhbGx5IGFkZCB0aG9zZSBmaWVsZHNcbiAgICAgICAgXy5lYWNoKGZpbHRlcnMsICh2YWx1ZSwgZmllbGQpID0+IHtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgaGFuZGxpbmcgZm9yIHRoZSAkbWV0YSBmaWx0ZXIgYW5kIGNvbmRpdGlvbmFsIG9wZXJhdG9yc1xuICAgICAgICAgICAgaWYgKCFfLmNvbnRhaW5zKFsnJG9yJywgJyRub3InLCAnJG5vdCcsICckYW5kJywgJyRtZXRhJ10sIGZpZWxkKSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBmaWVsZCBvciB0aGUgcGFyZW50IG9mIHRoZSBmaWVsZCBhbHJlYWR5IGV4aXN0cywgZG9uJ3QgYWRkIGl0XG4gICAgICAgICAgICAgICAgaWYgKCFfLmhhcyhvcHRpb25zLmZpZWxkcywgZmllbGQuc3BsaXQoJy4nKVswXSkpe1xuICAgICAgICAgICAgICAgICAgICBoYXNBZGRlZEFueUZpZWxkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5maWVsZHNbZmllbGRdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghaGFzQWRkZWRBbnlGaWVsZCkge1xuICAgICAgICAgICAgb3B0aW9ucy5maWVsZHMgPSB7X2lkOiAxfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBmaWVsZE5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNGaWVsZChmaWVsZE5hbWUpIHtcbiAgICAgICAgcmV0dXJuICEhXy5maW5kKHRoaXMuZmllbGROb2RlcywgZmllbGROb2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBmaWVsZE5vZGUubmFtZSA9PSBmaWVsZE5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gZmllbGROYW1lXG4gICAgICogQHJldHVybnMge0ZpZWxkTm9kZX1cbiAgICAgKi9cbiAgICBnZXRGaWVsZChmaWVsZE5hbWUpIHtcbiAgICAgICAgcmV0dXJuIF8uZmluZCh0aGlzLmZpZWxkTm9kZXMsIGZpZWxkTm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gZmllbGROb2RlLm5hbWUgPT0gZmllbGROYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNDb2xsZWN0aW9uTm9kZShuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIV8uZmluZCh0aGlzLmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5saW5rTmFtZSA9PSBuYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBoYXNSZWR1Y2VyTm9kZShuYW1lKSB7XG4gICAgICAgIHJldHVybiAhIV8uZmluZCh0aGlzLnJlZHVjZXJOb2Rlcywgbm9kZSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZS5uYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHtSZWR1Y2VyTm9kZX1cbiAgICAgKi9cbiAgICBnZXRSZWR1Y2VyTm9kZShuYW1lKSB7XG4gICAgICAgIHJldHVybiBfLmZpbmQodGhpcy5yZWR1Y2VyTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGUubmFtZSA9PSBuYW1lXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG5hbWVcbiAgICAgKiBAcmV0dXJucyB7Q29sbGVjdGlvbk5vZGV9XG4gICAgICovXG4gICAgZ2V0Q29sbGVjdGlvbk5vZGUobmFtZSkge1xuICAgICAgICByZXR1cm4gXy5maW5kKHRoaXMuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgICAgIHJldHVybiBub2RlLmxpbmtOYW1lID09IG5hbWVcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5saW5rTmFtZVxuICAgICAgICAgICAgPyB0aGlzLmxpbmtOYW1lXG4gICAgICAgICAgICA6ICh0aGlzLmNvbGxlY3Rpb24gPyB0aGlzLmNvbGxlY3Rpb24uX25hbWUgOiAnTi9BJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBpcyB1c2VkIGZvciBjYWNoaW5nIGxpbmtzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FjaGVGaWVsZFxuICAgICAqIEBwYXJhbSBzdWJMaW5rTmFtZVxuICAgICAqL1xuICAgIHNuYXBDYWNoZShjYWNoZUZpZWxkLCBzdWJMaW5rTmFtZSkge1xuICAgICAgICB0aGlzLnNuYXBDYWNoZXNbY2FjaGVGaWVsZF0gPSBzdWJMaW5rTmFtZTtcblxuICAgICAgICBpZiAodGhpcy5jb2xsZWN0aW9uLmdldExpbmtlcihzdWJMaW5rTmFtZSkuaXNPbmVSZXN1bHQoKSkge1xuICAgICAgICAgICAgdGhpcy5zbmFwQ2FjaGVzU2luZ2xlcy5wdXNoKGNhY2hlRmllbGQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2QgdmVyaWZpZXMgd2hldGhlciB0byByZW1vdmUgdGhlIGxpbmtTdG9yYWdlRmllbGQgZm9ybSB0aGUgcmVzdWx0c1xuICAgICAqIHVubGVzcyB5b3Ugc3BlY2lmeSBpdCBpbiB5b3VyIHF1ZXJ5LlxuICAgICAqXG4gICAgICogQHBhcmFtIG5vZGVcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zaG91bGRDbGVhblN0b3JhZ2Uobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5saW5rU3RvcmFnZUZpZWxkID09PSAnX2lkJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGUuaXNWaXJ0dWFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICFub2RlLmhhc0ZpZWxkKG5vZGUubGlua1N0b3JhZ2VGaWVsZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiAhdGhpcy5oYXNGaWVsZChub2RlLmxpbmtTdG9yYWdlRmllbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmllbGROb2RlIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBib2R5KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYm9keSA9IF8uaXNPYmplY3QoYm9keSkgPyAxIDogYm9keTtcbiAgICAgICAgdGhpcy5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFwcGx5RmllbGRzKGZpZWxkcykge1xuICAgICAgICBmaWVsZHNbdGhpcy5uYW1lXSA9IHRoaXMuYm9keTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVkdWNlck5vZGUge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHtib2R5LCByZWR1Y2V9KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgICAgIHRoaXMucmVkdWNlRnVuY3Rpb24gPSByZWR1Y2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2hlbiBjb21wdXRpbmcgd2UgYWxzbyBwYXNzIHRoZSBwYXJhbWV0ZXJzXG4gICAgICogXG4gICAgICogQHBhcmFtIHsqfSBvYmplY3QgXG4gICAgICogQHBhcmFtIHsqfSBhcmdzIFxuICAgICAqL1xuICAgIGNvbXB1dGUob2JqZWN0LCAuLi5hcmdzKSB7XG4gICAgICAgIG9iamVjdFt0aGlzLm5hbWVdID0gdGhpcy5yZWR1Y2UuY2FsbCh0aGlzLCBvYmplY3QsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHJlZHVjZShvYmplY3QsIC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVkdWNlRnVuY3Rpb24uY2FsbCh0aGlzLCBvYmplY3QsIC4uLmFyZ3MpO1xuICAgIH1cbn0iLCJpbXBvcnQge2NoZWNrfSBmcm9tICdtZXRlb3IvY2hlY2snO1xuXG5jb25zdCBzdG9yYWdlID0gJ19fcmVkdWNlcnMnO1xuT2JqZWN0LmFzc2lnbihNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZSwge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgYWRkUmVkdWNlcnMoZGF0YSkge1xuICAgICAgICBpZiAoIXRoaXNbc3RvcmFnZV0pIHtcbiAgICAgICAgICAgIHRoaXNbc3RvcmFnZV0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIF8uZWFjaChkYXRhLCAocmVkdWNlckNvbmZpZywgcmVkdWNlck5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpc1tyZWR1Y2VyQ29uZmlnXSkge1xuICAgICAgICAgICAgICAgIHRoaXNbcmVkdWNlckNvbmZpZ10gPSB7fTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0TGlua2VyKHJlZHVjZXJOYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYFlvdSBjYW5ub3QgYWRkIHRoZSByZWR1Y2VyIHdpdGggbmFtZTogJHtyZWR1Y2VyTmFtZX0gYmVjYXVzZSBpdCBpcyBhbHJlYWR5IGRlZmluZWQgYXMgYSBsaW5rIGluICR7dGhpcy5fbmFtZX0gY29sbGVjdGlvbmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzW3JlZHVjZXJDb25maWddW3JlZHVjZXJOYW1lXSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYFlvdSBjYW5ub3QgYWRkIHRoZSByZWR1Y2VyIHdpdGggbmFtZTogJHtyZWR1Y2VyTmFtZX0gYmVjYXVzZSBpdCB3YXMgYWxyZWFkeSBhZGRlZCB0byAke3RoaXMuX25hbWV9IGNvbGxlY3Rpb25gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjaGVjayhyZWR1Y2VyQ29uZmlnLCB7XG4gICAgICAgICAgICAgICAgYm9keTogT2JqZWN0LFxuICAgICAgICAgICAgICAgIHJlZHVjZTogRnVuY3Rpb25cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfLmV4dGVuZCh0aGlzW3N0b3JhZ2VdLCB7XG4gICAgICAgICAgICAgICAgW3JlZHVjZXJOYW1lXTogcmVkdWNlckNvbmZpZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldFJlZHVjZXIobmFtZSkge1xuICAgICAgICBpZiAodGhpc1tzdG9yYWdlXSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbc3RvcmFnZV1bbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59KTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhcHBseVJlZHVjZXJzKHJvb3QsIHBhcmFtcykge1xuICAgIF8uZWFjaChyb290LmNvbGxlY3Rpb25Ob2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGFwcGx5UmVkdWNlcnMobm9kZSwgcGFyYW1zKTtcbiAgICB9KTtcblxuICAgIF8uZWFjaChyb290LnJlZHVjZXJOb2RlcywgcmVkdWNlck5vZGUgPT4ge1xuICAgICAgICByb290LnJlc3VsdHMuZm9yRWFjaChyZXN1bHQgPT4ge1xuICAgICAgICAgICAgcmVkdWNlck5vZGUuY29tcHV0ZShyZXN1bHQsIHBhcmFtcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsIi8qKlxuICogQHBhcmFtIHJvb3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2xlYW5SZWR1Y2VyTGVmdG92ZXJzKHJvb3QpIHtcbiAgICBfLmVhY2gocm9vdC5jb2xsZWN0aW9uTm9kZXMsIG5vZGUgPT4ge1xuICAgICAgICBpZiAobm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbikge1xuICAgICAgICAgICAgcm9vdC5yZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBkZWxldGUgcmVzdWx0W25vZGUubGlua05hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuY29sbGVjdGlvbk5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgY2xlYW5SZWR1Y2VyTGVmdG92ZXJzKG5vZGUpO1xuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QuZmllbGROb2Rlcywgbm9kZSA9PiB7XG4gICAgICAgIGlmIChub2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uKSB7XG4gICAgICAgICAgICBjbGVhbk5lc3RlZEZpZWxkcyhub2RlLm5hbWUuc3BsaXQoJy4nKSwgcm9vdC5yZXN1bHRzKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgXy5lYWNoKHJvb3QucmVkdWNlck5vZGVzLCBub2RlID0+IHtcbiAgICAgICAgaWYgKG5vZGUuc2NoZWR1bGVkRm9yRGVsZXRpb24pIHtcbiAgICAgICAgICAgIHJvb3QucmVzdWx0cy5mb3JFYWNoKHJlc3VsdCA9PiB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtub2RlLm5hbWVdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG4vLyBpZiB3ZSBzdG9yZSBhIGZpZWxkIGxpa2U6ICdwcm9maWxlLmZpcnN0TmFtZSdcbi8vIHRoZW4gd2UgbmVlZCB0byBkZWxldGUgcHJvZmlsZTogeyBmaXJzdE5hbWUgfVxuLy8gaWYgcHJvZmlsZSB3aWxsIGhhdmUgZW1wdHkga2V5cywgd2UgbmVlZCB0byBkZWxldGUgcHJvZmlsZS5cblxuLyoqXG4gKlxuICogQHBhcmFtIHBhcnRzXG4gKiBAcGFyYW0gcmVzdWx0c1xuICovXG5mdW5jdGlvbiBjbGVhbk5lc3RlZEZpZWxkcyhwYXJ0cywgcmVzdWx0cykge1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9IHBhcnRzWzBdO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcblxuICAgICAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgICAgIGlmIChmaWVsZE5hbWUgIT09ICdfaWQnKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHJlc3VsdFtmaWVsZE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGFydHMuc2hpZnQoKTtcbiAgICBjbGVhbk5lc3RlZEZpZWxkcyhwYXJ0cywgcmVzdWx0cy5tYXAocmVzdWx0ID0+IHJlc3VsdFtmaWVsZE5hbWVdKSk7XG5cbiAgICByZXN1bHRzLmZvckVhY2gocmVzdWx0ID0+IHtcbiAgICAgICAgaWYgKF8ua2V5cyhyZXN1bHRbZmllbGROYW1lXSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBpZiAoZmllbGROYW1lICE9PSAnX2lkJykge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSByZXN1bHRbZmllbGROYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pXG59XG4iLCJpbXBvcnQgZG90IGZyb20gJ2RvdC1vYmplY3QnO1xuaW1wb3J0IHsgY3JlYXRlTm9kZXMgfSBmcm9tICcuLi8uLi9saWIvY3JlYXRlR3JhcGgnO1xuaW1wb3J0IENvbGxlY3Rpb25Ob2RlIGZyb20gJy4uLy4uL25vZGVzL2NvbGxlY3Rpb25Ob2RlJztcbmltcG9ydCBGaWVsZE5vZGUgZnJvbSAnLi4vLi4vbm9kZXMvZmllbGROb2RlJztcbmltcG9ydCBSZWR1Y2VyTm9kZSBmcm9tICcuLi8uLi9ub2Rlcy9yZWR1Y2VyTm9kZSc7XG5pbXBvcnQgZW1iZWRSZWR1Y2VyV2l0aExpbmsgZnJvbSAnLi9lbWJlZFJlZHVjZXJXaXRoTGluayc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFkZFJlZHVjZXJzKHJvb3QpIHtcbiAgICAvLyB3ZSBhZGQgcmVkdWNlcnMgbGFzdCwgYWZ0ZXIgd2UgaGF2ZSBhZGRlZCBhbGwgdGhlIGZpZWxkcy5cbiAgICByb290LnJlZHVjZXJOb2Rlcy5mb3JFYWNoKHJlZHVjZXIgPT4ge1xuICAgICAgICBfLmVhY2gocmVkdWNlci5ib2R5LCAoYm9keSwgZmllbGROYW1lKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVBZGRFbGVtZW50KHJvb3QsIGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIH0pXG4gICAgfSk7XG59XG5cbi8qKlxuICogQHBhcmFtIHJvb3RcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRFbGVtZW50KHJvb3QsIGZpZWxkTmFtZSwgYm9keSkge1xuICAgIC8vIGlmIGl0J3MgYSBsaW5rXG4gICAgY29uc3QgY29sbGVjdGlvbiA9IHJvb3QuY29sbGVjdGlvbjtcbiAgICBjb25zdCBsaW5rZXIgPSBjb2xsZWN0aW9uLmdldExpbmtlcihmaWVsZE5hbWUpO1xuICAgIGlmIChsaW5rZXIpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUFkZExpbmsoZmllbGROYW1lLCBib2R5LCByb290LCBsaW5rZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoZmllbGROYW1lKTtcbiAgICBpZiAocmVkdWNlcikge1xuICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihmaWVsZE5hbWUsIHJlZHVjZXIsIHJvb3QpO1xuICAgIH1cblxuICAgIC8vIHdlIGFzc3VtZSBpdCdzIGEgZmllbGQgaW4gdGhpcyBjYXNlXG4gICAgcmV0dXJuIGhhbmRsZUFkZEZpZWxkKGZpZWxkTmFtZSwgYm9keSwgcm9vdCk7XG59XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkTmFtZVxuICogQHBhcmFtIHJlZHVjZXJcbiAqIEBwYXJhbSByb290XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVBZGRSZWR1Y2VyKGZpZWxkTmFtZSwgcmVkdWNlciwgcm9vdCkge1xuICAgIGlmICghcm9vdC5oYXNSZWR1Y2VyTm9kZShmaWVsZE5hbWUpKSB7XG4gICAgICAgIGxldCByZWR1Y2VyTm9kZSA9IG5ldyBSZWR1Y2VyTm9kZShmaWVsZE5hbWUsIHJlZHVjZXIpO1xuICAgICAgICByb290LmFkZChyZWR1Y2VyTm9kZSk7XG4gICAgICAgIHJlZHVjZXJOb2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gdHJ1ZTtcblxuICAgICAgICBfLmVhY2gocmVkdWNlci5ib2R5LCAoYm9keSwgZmllbGROYW1lKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVBZGRFbGVtZW50KHJvb3QsIGZpZWxkTmFtZSwgYm9keSk7XG4gICAgICAgIH0pXG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gcm9vdFxuICogQHBhcmFtIGxpbmtlclxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkTGluayhmaWVsZE5hbWUsIGJvZHksIHJvb3QsIGxpbmtlcikge1xuICAgIGlmIChyb290Lmhhc0NvbGxlY3Rpb25Ob2RlKGZpZWxkTmFtZSkpIHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbk5vZGUgPSByb290LmdldENvbGxlY3Rpb25Ob2RlKGZpZWxkTmFtZSk7XG5cbiAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsoYm9keSwgY29sbGVjdGlvbk5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGFkZFxuICAgICAgICBsZXQgY29sbGVjdGlvbk5vZGUgPSBuZXcgQ29sbGVjdGlvbk5vZGUobGlua2VyLmdldExpbmtlZENvbGxlY3Rpb24oKSwgYm9keSwgZmllbGROYW1lKTtcbiAgICAgICAgY29sbGVjdGlvbk5vZGUuc2NoZWR1bGVkRm9yRGVsZXRpb24gPSB0cnVlO1xuICAgICAgICByb290LmFkZChjb2xsZWN0aW9uTm9kZSwgbGlua2VyKTtcblxuICAgICAgICBjcmVhdGVOb2Rlcyhjb2xsZWN0aW9uTm9kZSk7XG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBmaWVsZE5hbWVcbiAqIEBwYXJhbSBib2R5XG4gKiBAcGFyYW0gcm9vdFxuICovXG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQWRkRmllbGQoZmllbGROYW1lLCBib2R5LCByb290KSB7XG4gICAgaWYgKF8uaXNPYmplY3QoYm9keSkpIHtcbiAgICAgICAgLy8gaWYgcmVkdWNlciBzcGVjaWZpZXMgYSBuZXN0ZWQgZmllbGRcbiAgICAgICAgY29uc3QgZG90cyA9IGRvdC5kb3Qoe1xuICAgICAgICAgICAgW2ZpZWxkTmFtZV06IGJvZHlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgXy5lYWNoKGRvdHMsICh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJvb3QuaGFzRmllbGQoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWVsZE5vZGUgPSBuZXcgRmllbGROb2RlKGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIGZpZWxkTm9kZS5zY2hlZHVsZWRGb3JEZWxldGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICByb290LmFkZChmaWVsZE5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiByZWR1Y2VyIGRvZXMgbm90IHNwZWNpZnkgYSBuZXN0ZWQgZmllbGQsIGFuZCB0aGUgZmllbGQgZG9lcyBub3QgZXhpc3QuXG4gICAgICAgIGlmICghcm9vdC5oYXNGaWVsZChmaWVsZE5hbWUpKSB7XG4gICAgICAgICAgICBsZXQgZmllbGROb2RlID0gbmV3IEZpZWxkTm9kZShmaWVsZE5hbWUsIGJvZHkpO1xuICAgICAgICAgICAgZmllbGROb2RlLnNjaGVkdWxlZEZvckRlbGV0aW9uID0gdHJ1ZTtcblxuICAgICAgICAgICAgcm9vdC5hZGQoZmllbGROb2RlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7aGFuZGxlQWRkRmllbGQsIGhhbmRsZUFkZEVsZW1lbnQsIGhhbmRsZUFkZFJlZHVjZXJ9IGZyb20gJy4vY3JlYXRlUmVkdWNlcnMnO1xuXG4vKipcbiAqIEVtYmVkcyB0aGUgcmVkdWNlciBib2R5IHdpdGggYSBjb2xsZWN0aW9uIGJvZHlcbiAqIEBwYXJhbSByZWR1Y2VyQm9keVxuICogQHBhcmFtIGNvbGxlY3Rpb25Ob2RlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVtYmVkUmVkdWNlcldpdGhMaW5rKHJlZHVjZXJCb2R5LCBjb2xsZWN0aW9uTm9kZSkge1xuICAgIF8uZWFjaChyZWR1Y2VyQm9keSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3Rpb25Ob2RlLmNvbGxlY3Rpb247XG5cbiAgICAgICAgaWYgKF8uaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICAvLyBuZXN0ZWQgZmllbGQgb3IgbGlua1xuICAgICAgICAgICAgaWYgKGNvbGxlY3Rpb25Ob2RlLmJvZHlba2V5XSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIGl0IGV4aXN0c1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmtlciA9IGNvbGxlY3Rpb24uZ2V0TGlua2VyKGtleSk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIGEgbGlua1xuICAgICAgICAgICAgICAgIGlmIChsaW5rZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZW1iZWRSZWR1Y2VyV2l0aExpbmsodmFsdWUsIGNvbGxlY3Rpb25Ob2RlLmdldENvbGxlY3Rpb25Ob2RlKGtleSkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaGFuZGxlQWRkRmllbGQoa2V5LCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBkb2VzIG5vdCBleGlzdCwgc28gaXQgbWF5IGJlIGEgbGluay9yZWR1Y2VyL2ZpZWxkXG4gICAgICAgICAgICAgICAgaGFuZGxlQWRkRWxlbWVudChyb290LCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGlmIHRoaXMgZmllbGQgb3Igb3RoZXIgcmVkdWNlciBleGlzdHMgd2l0aGluIHRoZSBjb2xsZWN0aW9uXG5cbiAgICAgICAgICAgIGlmICghY29sbGVjdGlvbk5vZGUuYm9keVtrZXldKSB7XG4gICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgZmllbGQgb3IgYW5vdGhlciByZWR1Y2VyIGZvciB0aGlzLlxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZHVjZXIgPSBjb2xsZWN0aW9uLmdldFJlZHVjZXIoa2V5KTtcbiAgICAgICAgICAgICAgICBpZiAocmVkdWNlcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiBpdCdzIGFub3RoZXIgcmVkdWNlclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkUmVkdWNlcihrZXksIHJlZHVjZXIsIGNvbGxlY3Rpb25Ob2RlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlQWRkRmllbGQoa2V5LCB2YWx1ZSwgY29sbGVjdGlvbk5vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSlcbn0iXX0=
