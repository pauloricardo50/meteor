(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var EJSON = Package.ejson.EJSON;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Random = Package.random.Random;
var DDPServer = Package['ddp-server'].DDPServer;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var DDP = Package['ddp-client'].DDP;

/* Package-scope variables */
var doc, selector, callback, _config, channels;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:redis-oplog":{"redis-oplog.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/redis-oplog.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  RedisOplog: () => RedisOplog,
  SyntheticMutator: () => SyntheticMutator,
  ObservableCollection: () => ObservableCollection,
  RedisPipe: () => RedisPipe,
  Config: () => Config,
  Events: () => Events,
  Vent: () => Vent,
  publishWithRedis: () => publishWithRedis,
  getRedisListener: () => getRedisListener,
  getRedisPusher: () => getRedisPusher,
  PublicationFactory: () => PublicationFactory
});
module.link("./lib/mongo//mongoCollectionNames");
let publishWithRedis;
module.link("./lib/publishWithRedis", {
  default(v) {
    publishWithRedis = v;
  }

}, 0);
let RedisPipe, Events;
module.link("./lib/constants", {
  RedisPipe(v) {
    RedisPipe = v;
  },

  Events(v) {
    Events = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let stats;
module.link("./lib/utils/stats", {
  default(v) {
    stats = v;
  }

}, 3);
let init;
module.link("./lib/init", {
  default(v) {
    init = v;
  }

}, 4);
let Config;
module.link("./lib/config", {
  default(v) {
    Config = v;
  }

}, 5);
let getRedisListener, getRedisPusher;
module.link("./lib/redis/getRedisClient", {
  getRedisListener(v) {
    getRedisListener = v;
  },

  getRedisPusher(v) {
    getRedisPusher = v;
  }

}, 6);
let SyntheticMutator;
module.link("./lib/mongo/SyntheticMutator", {
  default(v) {
    SyntheticMutator = v;
  }

}, 7);
let ObservableCollection;
module.link("./lib/cache/ObservableCollection", {
  default(v) {
    ObservableCollection = v;
  }

}, 8);
let Vent;
module.link("./lib/vent/Vent", {
  default(v) {
    Vent = v;
  }

}, 9);
let PublicationFactory;
module.link("./lib/cache/PublicationFactory", {
  default(v) {
    PublicationFactory = v;
  }

}, 10);
const RedisOplog = {
  init,
  stats
}; // Warnings

Meteor.startup(function () {
  if (Package['insecure']) {
    console.log("RedisOplog does not support the insecure package.");
  }
});

if (process.env.REDIS_OPLOG_SETTINGS) {
  init(JSON.parse(process.env.REDIS_OPLOG_SETTINGS));
} else if (Meteor.settings.redisOplog) {
  init(Meteor.settings.redisOplog);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"config.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/config.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * In-Memory configuration storage
 */
let Config = {
  isInitialized: false,
  debug: false,
  overridePublishFunction: true,
  mutationDefaults: {
    pushToRedis: true,
    optimistic: true
  },
  passConfigDown: false,
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  globalRedisPrefix: '',
  retryIntervalMs: 10000,
  externalRedisPublisher: false,
  redisExtras: {
    retry_strategy: function (options) {
      return Config.retryIntervalMs; // reconnect after
      // return Math.min(options.attempt * 100, 30000);
    },
    events: {
      end(err) {
        console.error('RedisOplog - Connection to redis ended');
      },

      error(err) {
        console.error(`RedisOplog - An error occured: \n`, JSON.stringify(err));
      },

      connect(err) {
        if (!err) {
          console.log('RedisOplog - Established connection to redis.');
        } else {
          console.error('RedisOplog - There was an error when connecting to redis', JSON.stringify(err));
        }
      },

      reconnecting(err) {
        if (err) {
          console.error('RedisOplog - There was an error when re-connecting to redis', JSON.stringify(err));
        }
      }

    }
  }
};
module.exportDefault(Config);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"constants.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/constants.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Events: () => Events,
  Strategy: () => Strategy,
  RedisPipe: () => RedisPipe,
  VentConstants: () => VentConstants
});
const RedisPipe = {
  EVENT: 'e',
  DOC: 'd',
  FIELDS: 'f',
  MODIFIER: 'm',
  DOCUMENT_ID: 'id',
  SYNTHETIC: 's',
  UID: 'u',
  // this is the unique identity of a change request
  MODIFIED_TOP_LEVEL_FIELDS: 'mt'
};
module.exportDefault(RedisPipe);
const Events = {
  INSERT: 'i',
  UPDATE: 'u',
  REMOVE: 'r'
};
const Strategy = {
  DEFAULT: 'D',
  DEDICATED_CHANNELS: 'DC',
  LIMIT_SORT: 'LS'
};
const VentConstants = {
  ID: 'i',
  EVENT_VARIABLE: 'e',
  PREFIX: '__vent',

  getPrefix(id, name) {
    return `${id}.${name}`;
  }

};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/debug.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Config;
module.link("./config", {
  default(v) {
    Config = v;
  }

}, 0);
module.exportDefault((message, trace = false) => {
  if (Config.debug) {
    const timestamp = new Date().getTime();
    console.log(`[${timestamp}] - ` + message);

    if (trace) {
      console.log(trace);
    }
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"init.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/init.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Config;
module.link("./config", {
  default(v) {
    Config = v;
  }

}, 0);
let extendMongoCollection;
module.link("./mongo/extendMongoCollection", {
  default(v) {
    extendMongoCollection = v;
  }

}, 1);
let RedisSubscriptionManager;
module.link("./redis/RedisSubscriptionManager", {
  default(v) {
    RedisSubscriptionManager = v;
  }

}, 2);
let publishWithRedis;
module.link("./publishWithRedis", {
  default(v) {
    publishWithRedis = v;
  }

}, 3);
let PubSubManager;
module.link("./redis/PubSubManager", {
  default(v) {
    PubSubManager = v;
  }

}, 4);
let getRedisListener;
module.link("./redis/getRedisClient", {
  getRedisListener(v) {
    getRedisListener = v;
  }

}, 5);
let PublicationFactory;
module.link("./cache/PublicationFactory", {
  default(v) {
    PublicationFactory = v;
  }

}, 6);
let deepExtend;
module.link("deep-extend", {
  default(v) {
    deepExtend = v;
  }

}, 7);
let isInitialized = false;
module.exportDefault((config = {}) => {
  if (isInitialized) {
    throw 'You cannot initialize RedisOplog twice.';
  }

  isInitialized = true;
  deepExtend(Config, config);

  _.extend(Config, {
    isInitialized: true,
    oldPublish: Meteor.publish
  });

  extendMongoCollection();
  Meteor.publishWithRedis = publishWithRedis.bind(Meteor);

  if (Config.overridePublishFunction) {
    Meteor.publish = Meteor.publishWithRedis;
    Meteor.server.publish = Meteor.publishWithRedis;
  } // this initializes the listener singleton with the proper onConnect functionality


  getRedisListener({
    onConnect() {
      // this will be executed initially, but since there won't be any observable collections, nothing will happen
      PublicationFactory.reloadAll();
    }

  });
  RedisSubscriptionManager.init();
  Config.pubSubManager = new PubSubManager();
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publishWithRedis.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/publishWithRedis.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => publishWithRedis
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let shouldPublicationBeWithPolling;
module.link("./utils/shouldPublicationBeWithPolling", {
  default(v) {
    shouldPublicationBeWithPolling = v;
  }

}, 2);
let PublicationFactory;
module.link("./cache/PublicationFactory", {
  default(v) {
    PublicationFactory = v;
  }

}, 3);
let debug;
module.link("./debug", {
  default(v) {
    debug = v;
  }

}, 4);
let Config;
module.link("./config", {
  default(v) {
    Config = v;
  }

}, 5);

function publishWithRedis(name, fn, opts = {}) {
  if (_.isObject(name)) {
    return _.each(name, (value, key) => {
      publishWithRedis(key, value);
    });
  }

  debug('[Main] Created publication with name: ' + name);
  Config.oldPublish(name, function (...args) {
    debug('[Main] New incomming subscription for publication: ' + name);
    let cursors = fn.call(this, ...args);

    if (!cursors) {
      return;
    }

    if (!_.isArray(cursors)) {
      cursors = [cursors];
    }

    const eligibleCursors = _.filter(cursors, cursor => {
      return cursor && !!cursor._cursorDescription;
    });

    const nonEligibleCursors = _.filter(cursors, cursor => {
      return !cursor || !cursor._cursorDescription;
    });

    if (shouldPublicationBeWithPolling(cursors)) {
      return cursors;
    }

    let publicationEntries = [];
    PublicationFactory.queue.runTask(() => {
      eligibleCursors.forEach(cursor => {
        publicationEntries.push(PublicationFactory.create(cursor, this));
      });
    });
    this.onStop(() => {
      PublicationFactory.queue.runTask(() => {
        debug('[Main] Stopping the Meteor subscription for publication: ' + name);
        publicationEntries.forEach(publicationEntry => {
          publicationEntry.removeObserver(this);
        });
      });
    });
    this.ready();
    return nonEligibleCursors;
  }, opts);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"cache":{"ObservableCollection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/ObservableCollection.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => ObservableCollection
});
let DiffSequence;
module.link("meteor/diff-sequence", {
  DiffSequence(v) {
    DiffSequence = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let LocalCollection, Minimongo;
module.link("meteor/minimongo", {
  LocalCollection(v) {
    LocalCollection = v;
  },

  Minimongo(v) {
    Minimongo = v;
  }

}, 2);
let cloneDeep;
module.link("lodash.clonedeep", {
  default(v) {
    cloneDeep = v;
  }

}, 3);
let fieldProjectionIsExclusion;
module.link("./lib/fieldProjectionIsExclusion", {
  default(v) {
    fieldProjectionIsExclusion = v;
  }

}, 4);
let getChannels;
module.link("./lib/getChannels", {
  default(v) {
    getChannels = v;
  }

}, 5);
let extractFieldsFromFilters;
module.link("./lib/extractFieldsFromFilters", {
  default(v) {
    extractFieldsFromFilters = v;
  }

}, 6);
let MongoIDMap;
module.link("./mongoIdMap", {
  MongoIDMap(v) {
    MongoIDMap = v;
  }

}, 7);
const allowedOptions = ['limit', 'skip', 'sort', 'fields', 'channels', 'channel', 'namespace', 'namespaces'];
const {
  Matcher
} = Minimongo;

class ObservableCollection {
  /**
   * @param observer
   * @param cursor
   * @param config
   */
  constructor(observer, cursor, config = {}) {
    this.observer = observer;
    this.cursor = cursor;
    this.config = config;
    this.store = new MongoIDMap();
    const cursorDescription = cursor._cursorDescription;

    if (cursorDescription) {
      this.collectionName = cursorDescription.collectionName;
      this.collection = Mongo.Collection.__getCollectionByName(this.collectionName);
      this.selector = cursorDescription.selector || {};

      if (_.isString(this.selector)) {
        this.selector = {
          _id: this.selector
        };
      }

      if (cursorDescription.options) {
        this.options = _.pick(cursorDescription.options, ...allowedOptions);
      } else {
        this.options = {};
      }
    } else {
      this.collectionName = cursor.collection.name;
      this.collection = Mongo.Collection.__getCollectionByName(this.collectionName);
      this.selector = {};
      this.options = {};
    }

    if (!this.collection) {
      throw new Meteor.Error('We could not properly identify the collection by its name: ' + this.collectionName + '. Make sure you added redis-oplog package before any package that instantiates a collection.');
    } // check for empty projector object and delete.


    if (this.options.fields && _.isEmpty(this.options.fields)) {
      delete this.options.fields;
    }

    if (this.options.fields) {
      this.fieldsArray = _.keys(this.options.fields);

      if (!_.isArray(this.fieldsArray)) {
        throw new Meteor.Error('We could not properly extract any fields. "fields" must be an object. This was provided: ' + JSON.stringify(this.options.fields));
      }

      this.projectFieldsOnDoc = LocalCollection._compileProjection(this.options.fields);
      this.isFieldsProjectionByExclusion = fieldProjectionIsExclusion(this.options.fields);
    }

    this.channels = getChannels(this.collectionName, this.options);
    this.testDocEligibility = this._createTestDocEligibility();
    this.fieldsOfInterest = this._getFieldsOfInterest();
    this.__isInitialized = false;
  }
  /**
   * Function that checks whether or not the doc matches our filters
   *
   * @param doc
   * @returns {*}
   */


  isEligible(doc) {
    if (this.testDocEligibility) {
      return this.testDocEligibility(doc);
    }

    return true;
  }
  /**
   * @param _id
   * @returns {boolean}
   */


  isEligibleByDB(_id) {
    if (this.testDocEligibility) {
      return !!this.collection.findOne(_.extend({}, this.selector, {
        _id
      }), {
        fields: {
          _id: 1
        }
      });
    }

    return true;
  }
  /**
   * Performs the initial search then puts them into the store.
   */


  init() {
    if (this.__isInitialized) {
      return; // silently do nothing.
    }

    this.__isInitialized = true;
    let data = this.cursor.fetch();
    data.forEach(doc => {
      this.store.set(doc._id, doc);
    });
  }
  /**
   * @param docId
   * @returns {boolean}
   */


  contains(docId) {
    return this.store.has(docId);
  }
  /**
   * Sends the data through DDP
   *
   * @param event
   * @param args
   */


  send(event, ...args) {
    this.observer.send(event, this.collectionName, ...args);
  }
  /**
   * @param doc {Object}
   * @param safe {Boolean} If this is set to true, it assumes that the object is cleaned
   */


  add(doc, safe = false) {
    doc = cloneDeep(doc);

    if (!safe) {
      if (this.fieldsArray) {
        doc = this.projectFieldsOnDoc(doc);
      }
    }

    this.store.set(doc._id, doc);
    this.send('added', doc._id, doc);
  }
  /**
   * We use this method when we receive updates for a document that is not yet in the observable collection store
   * @param docId
   */


  addById(docId) {
    const doc = this.collection.findOne({
      _id: docId
    }, this.options);
    this.store.set(docId, doc);

    if (doc) {
      this.send('added', doc._id, doc);
    }
  }
  /**
   * Sends over the wire only the top fields of changes, because DDP client doesnt do deep merge.
   *
   * @param {object} doc
   * @param {array} modifiedFields
   */


  change(doc, modifiedFields) {
    const docId = doc._id;
    const oldDoc = this.store.get(docId);

    if (oldDoc == null) {
      return;
    }

    let newDoc = cloneDeep(doc);

    if (this.fieldsArray) {
      newDoc = this.projectFieldsOnDoc(newDoc);
    }

    if (this.options.transform) {
      newDoc = this.options.transform(newDoc);
    }

    this.store.set(docId, newDoc);
    const changedTopLevelFields = DiffSequence.makeChangedFields(newDoc, oldDoc);

    if (!_.isEmpty(changedTopLevelFields)) {
      this.send('changed', docId, changedTopLevelFields, newDoc, oldDoc);
    }
  }
  /**
   * @param docId string
   * @param modifier object
   * @param topLevelFields array
   * @private
   */


  changeSynthetic(docId, modifier, topLevelFields) {
    if (!this.store.has(docId)) {
      return;
    }

    let storedDoc = this.store.get(docId);
    let oldDoc = cloneDeep(storedDoc);

    LocalCollection._modify(storedDoc, modifier);

    let changedTopLevelFields = {};
    topLevelFields.forEach(topLevelField => {
      changedTopLevelFields[topLevelField] = storedDoc[topLevelField];
    });
    this.send('changed', docId, changedTopLevelFields, storedDoc, oldDoc);
  }
  /**
   * @param docId
   */


  remove(docId) {
    const doc = this.store.pop(docId);

    if (doc != null) {
      this.send('removed', docId, doc);
    }
  }
  /**
   * Clears the store
   */


  clearStore() {
    this.store.clear();
  }
  /**
   * Returns whether the limit of allowed documents is reached
   * based on the selector options
   */


  isLimitReached() {
    if (this.options.limit) {
      const size = this.store.size();
      return size >= this.options.limit;
    }

    return false;
  }
  /**
   * Used at initialization
   *
   * Creates the function that checks if the document is valid
   *
   * @returns {null}
   * @private
   */


  _createTestDocEligibility() {
    const self = this;

    if (_.keys(this.selector).length) {
      try {
        const matcher = new Matcher(this.selector);
        return function (object) {
          return matcher.documentMatches(object).result;
        };
      } catch (e) {
        // The logic here is that if our matcher is too complex for minimongo
        // We put our matching function to query db
        if (e.toString().indexOf('Unrecognized logical operator') >= 0) {
          return function (object) {
            return self.isEligibleByDB(object._id);
          };
        } else {
          throw e;
        }
      }
    }

    return null;
  }
  /**
   * Used at initialization
   *
   * Creates and stores the fields specified in fields & filters
   * If by any chance there are no fields specified, we return true
   *
   * @private
   * @return {true|object}
   */


  _getFieldsOfInterest() {
    if (!this.options.fields) {
      return true;
    } // if you have some fields excluded (high chances you don't, but we query for all fields either way)
    // because it can get very tricky with future subscribers that may need some fields


    if (this.isFieldsProjectionByExclusion) {
      return true;
    } // if we have options, we surely have fields array


    let fieldsArray = this.fieldsArray.slice();

    if (_.keys(this.selector).length > 0) {
      fieldsArray = _.union(fieldsArray, extractFieldsFromFilters(this.selector));
    }

    return fieldsArray;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PublicationEntry.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/PublicationEntry.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => PublicationEntry
});
let ObservableCollection;
module.link("./ObservableCollection", {
  default(v) {
    ObservableCollection = v;
  }

}, 0);
let RedisSubscriber;
module.link("../redis/RedisSubscriber", {
  default(v) {
    RedisSubscriber = v;
  }

}, 1);
let Strategy;
module.link("../constants", {
  Strategy(v) {
    Strategy = v;
  }

}, 2);
let debug;
module.link("../debug", {
  default(v) {
    debug = v;
  }

}, 3);
let getStrategy;
module.link("../processors", {
  getStrategy(v) {
    getStrategy = v;
  }

}, 4);
let DDP;
module.link("meteor/ddp-client", {
  DDP(v) {
    DDP = v;
  }

}, 5);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 6);
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 7);

class PublicationEntry {
  constructor(id, cursor, factory) {
    this.id = id;
    this.factory = factory;
    this.cursor = cursor;
    this.observers = [];
    /**
     * @var {ObservableCollection}
     */

    this.observableCollection = new ObservableCollection(this, cursor);
    this.init();
  }
  /**
   * Initializes subscriptions and the client image on the server
   */


  init() {
    Package.facts && Package.facts.Facts.incrementServerFact('mongo-livedata', 'observe-multiplexers', 1);
    const strategy = getStrategy(this.observableCollection.selector, this.observableCollection.options); // We do this because if we have dedicated channels, we may not need to interogate the db for eligibility

    if (strategy === Strategy.DEDICATED_CHANNELS) {
      let oc = this.observableCollection;

      if (oc.selector._id) {
        oc.__containsOtherSelectorsThanId = _.keys(oc.selector).length > 1;
      }
    }

    this.redisSubscriber = new RedisSubscriber(this, strategy);
  }
  /**
   * Handler for stopping the subscription
   */


  stop() {
    Package.facts && Package.facts.Facts.incrementServerFact('mongo-livedata', 'observe-multiplexers', -1);
    this.redisSubscriber.stop();
    this.observableCollection.clearStore();
  }
  /**
   * @param observer
   */


  addObserver(observer) {
    Package.facts && Package.facts.Facts.incrementServerFact('mongo-livedata', 'observe-handles', 1);

    if (observer.added) {
      this._performInitialAddForObserver(observer);
    }

    this.observers.push(observer);
  }
  /**
   * @param observer
   */


  removeObserver(observer) {
    Package.facts && Package.facts.Facts.incrementServerFact('mongo-livedata', 'observe-handles', -1);
    this.observers = _.without(this.observers, observer);

    if (this.isObserversEmpty()) {
      debug(`[PublicationEntry] No other observers for: ${this.id}. Stopping subscription to redis.`);
      this.stop();
      this.factory.remove(this.id);
    }
  }
  /**
   * @returns {boolean}
   */


  isObserversEmpty() {
    return this.observers.length === 0;
  }
  /**
   * @param action
   * @param args
   */


  send(action, ...args) {
    // The idea here is that if you are doing an optimistic-ui mutation from a method
    // Before the method returns, it should write to the DDP's fence the changes
    // otherwise with an optimistic ui you will get a flicker (insert client side, response from method => removed, insert again from redis later)
    // So we will send added events in sync for the current observer, then defer the rest
    // We should not worry about duplicates because when we send a latency compensated event
    // We give it a random uuid, and if the listener of redis on this server gets a message with the last uuid, it will not process it
    // If it's different, and it can still happen, it will process it again, changes are very small.
    const invoke = DDP._CurrentInvocation.get();

    if (invoke && invoke.connection && invoke.connection.id) {
      // we send first to all watchers for invoke.connection.id
      const currentId = invoke.connection.id;

      const currentObservers = _.filter(this.observers, o => {
        return o.connection && o.connection.id == currentId;
      });

      if (currentObservers.length) {
        currentObservers.forEach(observer => {
          observer[action].call(observer, ...args);
        });
      } // defer the rest so that the method yields quickly to the user, because we have applied it's changes.


      Meteor.defer(() => {
        this.observers.forEach(observer => {
          if (!observer.connection || observer.connection.id != currentId) {
            observer[action].call(observer, ...args);
          }
        });
      });
    } else {
      this.observers.forEach(observer => {
        observer[action].call(observer, ...args);
      });
    }
  }
  /**
   * The first batch of documents that need to be added.
   * @param observer
   */


  _performInitialAddForObserver(observer) {
    debug('[PublicationEntry] Performing initial add for observer');
    this.observableCollection.init();
    this.observableCollection.store.forEach((doc, _id) => {
      // prevents error if document was removed while the _.each is running
      if (!doc) {
        return;
      }

      observer.added.call(observer, this.observableCollection.collectionName, _id, doc);
    });
    debug('[PublicationEntry] Completed initial add for observer');
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PublicationFactory.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/PublicationFactory.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);
let PublicationStore;
module.link("./PublicationStore", {
  default(v) {
    PublicationStore = v;
  }

}, 1);
let PublicationEntry;
module.link("./PublicationEntry", {
  default(v) {
    PublicationEntry = v;
  }

}, 2);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 3);
let reload;
module.link("../processors/actions/reload", {
  default(v) {
    reload = v;
  }

}, 4);
let debug;
module.link("../debug", {
  default(v) {
    debug = v;
  }

}, 5);
module.exportDefault(new class PublicationFactory {
  constructor() {
    this.store = new PublicationStore();
    this.queue = new Meteor._SynchronousQueue();
  }
  /**
   * Potentially creates a new publicationEntry and returns the id
   *
   * @param cursor
   * @param observer
   * @returns {PublicationEntry}
   */


  create(cursor, observer) {
    let description = cursor._cursorDescription;

    if (!description.selector) {
      description.selector = {};
    }

    if (!description.options) {
      description.options = {};
    }

    this.extendCursorWithCollectionDefaults(observer, cursor);
    let id = this.getPublicationId(cursor);
    let publicationEntry;

    if (this.store.has(id)) {
      publicationEntry = this.store.find(id);
      debug(`[PublicationFactory] Re-using existing publication ${publicationEntry.id}`);
    } else {
      publicationEntry = new PublicationEntry(id, cursor, this);
      debug(`[PublicationFactory] Created new subscribers for redis for: ${publicationEntry.id}`);
      this.store.add(id, publicationEntry);
    }

    publicationEntry.addObserver(observer);
    return publicationEntry;
  }
  /**
   * @param id
   */


  remove(id) {
    this.store.remove(id);
  }
  /**
   * Gets an unique id based on the cursors selector and options
   * @param cursor
   * @returns {string}
   */


  getPublicationId(cursor) {
    const description = cursor._cursorDescription;

    const collectionName = this._getCollectionName(cursor);

    const {
      selector,
      options
    } = description; // because of some compatibility stuff

    return collectionName + '::' + EJSON.stringify(selector) + EJSON.stringify(_.omit(options, 'transform'));
  }
  /**
   * Refreshes all observableCollections
   */


  reloadAll() {
    const entries = this.store.getAll();
    entries.forEach(entry => {
      reload(entry.observableCollection);
    });
  }
  /**
   * @param context
   * @param _cursor
   */


  extendCursorWithCollectionDefaults(context, _cursor) {
    const collectionName = this._getCollectionName(_cursor);

    const collection = Mongo.Collection.__getCollectionByName(collectionName);

    if (collection && collection._redisOplog) {
      const {
        cursor
      } = collection._redisOplog;

      if (cursor) {
        let {
          selector,
          options
        } = _cursor._cursorDescription;
        cursor.call(context, options, selector);
      }
    }
  }
  /**
   * @param cursor
   * @returns {*|string}
   * @private
   */


  _getCollectionName(cursor) {
    const description = cursor._cursorDescription; // because of some compatibility stuff

    let collectionName = description.collectionName;

    if (!collectionName) {
      return description.collection.name;
    }

    return collectionName;
  }

}());
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PublicationStore.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/PublicationStore.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => PublicationStore
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

class PublicationStore {
  /**
   * Creates the store
   */
  constructor(name) {
    /**
     * {
     *   id: PublicationEntry
     * }
     */
    this.store = {};
  }
  /**
   * @param id
   * @returns {boolean}
   */


  has(id) {
    return !!this.store[id];
  }
  /**
   * @param id
   * @returns {*}
   */


  find(id) {
    return this.store[id];
  }
  /**
   * @param id
   * @param publicationEntry
   */


  add(id, publicationEntry) {
    if (this.store[id]) {
      throw new Meteor.Error(`You cannot add a publication to this store, because it already exists: ${id}`);
    }

    this.store[id] = publicationEntry;
  }
  /**
   * @param id
   */


  remove(id) {
    delete this.store[id];
  }
  /**
   * @returns {Array}
   */


  getAll() {
    return _.values(this.store);
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mongoIdMap.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/mongoIdMap.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  MongoIDMap: () => MongoIDMap
});
let MongoID;
module.link("meteor/mongo-id", {
  MongoID(v) {
    MongoID = v;
  }

}, 0);

class MongoIDMap {
  constructor(idStringify, idParse) {
    this._internal = new Map();
    this._idStringify = idStringify || MongoID.idStringify;
    this._idParse = idParse || MongoID.idParse;
  }

  get(id) {
    const key = this._idStringify(id);

    return this._internal.get(key);
  }

  pop(id) {
    const key = this._idStringify(id);

    const ret = this._internal.get(key);

    this._internal.delete(key);

    return ret;
  }

  set(id, value) {
    const key = this._idStringify(id);

    this._internal.set(key, value);
  }

  setDefault(id, def) {
    const key = this._idStringify(id);

    if (this._internal.has(key)) {
      return this._internal.get(key);
    }

    this._internal.set(key, def);

    return def;
  }

  remove(id) {
    const key = this._idStringify(id);

    this._internal.delete(key);
  }

  has(id) {
    const key = this._idStringify(id);

    return this._internal.has(key);
  }

  size() {
    return this._internal.size;
  }

  empty() {
    return this._internal.size === 0;
  }

  clear() {
    this._internal.clear();
  }

  keys() {
    return Array.from(this._internal.keys()).map(key => this._idParse(key));
  }

  forEach(iterator) {
    this._internal.forEach((value, key) => {
      iterator.call(null, value, this._idParse(key));
    });
  }

  compareWith(other, callbacks) {
    // operate on the _internal maps to avoid overhead of parsing id's.
    const leftMap = this._internal;
    const rightMap = other._internal;
    leftMap.forEach((leftValue, key) => {
      const rightValue = rightMap.get(key);
      if (rightValue != null) callbacks.both && callbacks.both(this._idParse(key), leftValue, rightValue);else callbacks.leftOnly && callbacks.leftOnly(this._idParse(key), leftValue);
    });

    if (callbacks.rightOnly) {
      rightMap.forEach((rightValue, key) => {
        if (!leftMap.has(key)) callbacks.rightOnly(this._idParse(key), rightValue);
      });
    }
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"extractFieldsFromFilters.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/lib/extractFieldsFromFilters.js                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
const deepFilterFieldsArray = ['$and', '$or', '$nor'];
const deepFilterFieldsObject = ['$not'];
/**
 * Given a complex filtering option, extract the fields
 * @param filters
 */

function extractFieldsFromFilters(filters) {
  let filterFields = [];

  _.each(filters, (value, field) => {
    if (field[0] !== '$') {
      filterFields.push(field);
    }
  });

  deepFilterFieldsArray.forEach(field => {
    if (filters[field]) {
      filters[field].forEach(element => {
        _.union(filterFields, extractFieldsFromFilters(element));
      });
    }
  });
  deepFilterFieldsObject.forEach(field => {
    if (filters[field]) {
      _.union(filterFields, extractFieldsFromFilters(filters[field]));
    }
  });
  return filterFields;
}

module.exportDefault(extractFieldsFromFilters);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fieldProjectionIsExclusion.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/lib/fieldProjectionIsExclusion.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exportDefault(fields => {
  for (let value in fields) {
    return fields[value] !== 1;
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getChannels.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/cache/lib/getChannels.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let getChannelName;
module.link("../../utils/getChannelName", {
  default(v) {
    getChannelName = v;
  }

}, 1);
module.exportDefault((collectionName, {
  namespace,
  channel,
  namespaces,
  channels
}) => {
  let channelStrings = [];

  if (namespaces) {
    namespaces.forEach(name => {
      channelStrings.push(`${name}::${collectionName}`);
    });
  }

  if (namespace) {
    channelStrings.push(`${namespace}::${collectionName}`);
  }

  if (channels) {
    channels.forEach(name => {
      channelStrings.push(name);
    });
  }

  if (channel) {
    channelStrings.push(channel);
  }

  if (channelStrings.length === 0) {
    channelStrings.push(collectionName);
  }

  return channelStrings.map(getChannelName);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"mongo":{"Mutator.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/Mutator.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => Mutator
});
let getMutationConfig;
module.link("./lib/getMutationConfig", {
  default(v) {
    getMutationConfig = v;
  }

}, 0);
let getFields;
module.link("../utils/getFields", {
  default(v) {
    getFields = v;
  }

}, 1);
let dispatchInsert, dispatchUpdate, dispatchRemove;
module.link("./lib/dispatchers", {
  dispatchInsert(v) {
    dispatchInsert = v;
  },

  dispatchUpdate(v) {
    dispatchUpdate = v;
  },

  dispatchRemove(v) {
    dispatchRemove = v;
  }

}, 2);
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 3);
let Events;
module.link("../constants", {
  Events(v) {
    Events = v;
  }

}, 4);

function runCallbackInBackground(fn) {
  Meteor.defer(Meteor.bindEnvironment(fn));
}
/**
 * The Mutator is the interface that does the required updates
 */


class Mutator {
  static init() {
    Mutator.passConfigDown = Config.passConfigDown; // regardless of your choice, these 2 packages must passConfigDown
    // we do like this until we find a more elegant way

    if (Package['aldeed:collection2'] !== undefined || Package['aldeed:collection2-core'] !== undefined) {
      Mutator.passConfigDown = true;
    }
  }

  static insert(Originals, data, _config) {
    const config = getMutationConfig(this, _config, {
      doc: data,
      event: Events.INSERT
    });

    if (canUseOriginalMethod(config)) {
      return Originals.insert.call(this, data);
    }

    try {
      const docId = Originals.insert.call(this, data); // It's a callback

      if (_.isFunction(_config)) {
        const self = this;
        runCallbackInBackground(function () {
          _config.call(self, null, docId);
        });
      }

      dispatchInsert(config.optimistic, this._name, config._channels, docId);
      return docId;
    } catch (e) {
      if (_.isFunction(_config)) {
        Meteor.defer(() => {
          return _config.call(this, e);
        });
      } else {
        throw e;
      }
    }
  }
  /**
   * @param Originals
   * @param selector
   * @param modifier
   * @param _config
   * @param callback
   * @returns {*}
   */


  static update(Originals, selector, modifier, _config, callback) {
    if (_.isString(selector)) {
      selector = {
        _id: selector
      };
    }

    if (_.isFunction(_config)) {
      callback = _config;
      _config = {};
    }

    const config = getMutationConfig(this, _config, {
      event: Events.UPDATE,
      selector,
      modifier
    });

    if (canUseOriginalMethod(config)) {
      return Originals.update.call(this, selector, modifier, config);
    } // searching the elements that will get updated by id


    const findOptions = {
      fields: {
        _id: 1
      },
      transform: null
    };

    if (!config.multi) {
      findOptions.limit = 1;
    }

    let docIds = this.find(selector, findOptions).fetch().map(doc => doc._id);

    if (config && config.upsert) {
      return Mutator._handleUpsert.call(this, Originals, selector, modifier, config, callback, docIds);
    } // we do this because when we send to redis
    // we need the exact _ids
    // and we extend the selector, because if between finding the docIds and updating
    // another matching insert sneaked in, it's update will not be pushed


    const updateSelector = _.extend({}, selector, {
      _id: {
        $in: docIds
      }
    });

    try {
      const result = Originals.update.call(this, updateSelector, modifier, config); // phony callback emulation

      if (callback) {
        const self = this;
        runCallbackInBackground(function () {
          callback.call(self, null, result);
        });
      }

      const {
        fields
      } = getFields(modifier);
      dispatchUpdate(config.optimistic, this._name, config._channels, docIds, fields);
      return result;
    } catch (e) {
      if (callback) {
        const self = this;
        runCallbackInBackground(function () {
          callback.call(self, e);
        });
      } else {
        throw e;
      }
    }
  }
  /**
   * @param Originals
   * @param selector
   * @param modifier
   * @param config
   * @param callback
   * @param docIds
   */


  static _handleUpsert(Originals, selector, modifier, config, callback, docIds) {
    try {
      const data = Originals.update.call(this, selector, modifier, _.extend({}, config, {
        _returnObject: true
      }));
      let {
        insertedId,
        numberAffected
      } = data;

      if (callback) {
        const self = this;
        runCallbackInBackground(function () {
          callback.call(this, null, {
            insertedId,
            numberAffected
          });
        });
      }

      if (config.pushToRedis) {
        if (insertedId) {
          dispatchInsert(config.optimistic, this._name, config._channels, insertedId);
        } else {
          // it means that we ran an upsert thinking there will be no docs
          if (docIds.length === 0 || numberAffected !== docIds.length) {
            // there were no docs initially found matching the selector
            // however a document sneeked in, resulting in a race-condition
            // and if we look again for that document, we cannot retrieve it.
            // or a new document was added/modified to match selector before the actual update
            console.warn('RedisOplog - Warning - A race condition occurred when running upsert.');
          } else {
            const {
              fields
            } = getFields(modifier);
            dispatchUpdate(config.optimistic, this._name, config._channels, docIds, fields);
          }
        }
      }

      return {
        insertedId,
        numberAffected
      };
    } catch (e) {
      if (callback) {
        const self = this;
        runCallbackInBackground(function () {
          callback.call(self, e);
        });
      } else {
        throw e;
      }
    }
  }
  /**
   * @param Originals
   * @param selector
   * @param _config
   * @returns {*}
   */


  static remove(Originals, selector, _config) {
    if (_.isString(selector)) {
      selector = {
        _id: selector
      };
    }

    const config = getMutationConfig(this, _config, {
      selector,
      event: Events.REMOVE
    });

    if (canUseOriginalMethod(config)) {
      return Originals.remove.call(this, selector);
    }

    const removeSelector = _.extend({}, selector); // TODO: optimization check if it has _id or _id with {$in} so we don't have to redo this.


    let docIds = this.find(selector, {
      fields: {
        _id: 1
      },
      transform: null
    }).fetch().map(doc => doc._id);

    if (!selector._id) {
      removeSelector._id = {
        $in: docIds
      };
    }

    try {
      const result = Originals.remove.call(this, removeSelector);

      if (_.isFunction(_config)) {
        const self = this;
        runCallbackInBackground(function () {
          _config.call(self, null);
        });
      }

      dispatchRemove(config.optimistic, this._name, config._channels, docIds);
      return result;
    } catch (e) {
      if (_.isFunction(_config)) {
        const self = this;
        runCallbackInBackground(function () {
          _config.call(self, e);
        });
      } else {
        throw e;
      }
    }
  }

}

function canUseOriginalMethod(mutationConfig) {
  // There are two cases where we can use the original mutators rather than
  // our overriden ones:
  //
  // 1) The user set pushToRedis: false, indicating they don't need realtime
  //    updates at all.
  //
  // 2) The user is using an external redis publisher, so we don't need to
  //    figure out what to publish to redis, and this update doesn't need
  //    optimistic-ui processing, so we don't need to synchronously run
  //    observers.
  return !mutationConfig.pushToRedis || Config.externalRedisPublisher && !mutationConfig.optimistic;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SyntheticMutator.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/SyntheticMutator.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => SyntheticMutator
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 1);
let getRedisPusher;
module.link("../redis/getRedisClient", {
  getRedisPusher(v) {
    getRedisPusher = v;
  }

}, 2);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 3);
let getFields;
module.link("../utils/getFields", {
  default(v) {
    getFields = v;
  }

}, 4);
let Events, RedisPipe;
module.link("../constants", {
  Events(v) {
    Events = v;
  },

  RedisPipe(v) {
    RedisPipe = v;
  }

}, 5);
let containsOperators;
module.link("../mongo/lib/containsOperators", {
  default(v) {
    containsOperators = v;
  }

}, 6);

class SyntheticMutator {
  /**
   * @param channels
   * @param data
   */
  static publish(channels, data) {
    const client = getRedisPusher();
    channels.forEach(channel => {
      client.publish(channel, EJSON.stringify(data));
    });
  }
  /**
   * @param channels
   * @param data
   */


  static insert(channels, data) {
    channels = SyntheticMutator._extractChannels(channels);

    if (!data._id) {
      data._id = Random.id();
    }

    SyntheticMutator.publish(channels, {
      [RedisPipe.EVENT]: Events.INSERT,
      [RedisPipe.SYNTHETIC]: true,
      [RedisPipe.DOC]: data
    });
  }
  /**
   * @param channels
   * @param _id
   * @param modifier
   */


  static update(channels, _id, modifier) {
    channels = SyntheticMutator._extractChannels(channels);

    if (!containsOperators(modifier)) {
      throw new Meteor.Error('Synthetic update can only be done through MongoDB operators.');
    }

    const {
      topLevelFields
    } = getFields(modifier);
    let message = {
      [RedisPipe.EVENT]: Events.UPDATE,
      [RedisPipe.SYNTHETIC]: true,
      [RedisPipe.DOC]: {
        _id
      },
      [RedisPipe.MODIFIER]: modifier,
      [RedisPipe.MODIFIED_TOP_LEVEL_FIELDS]: topLevelFields
    };
    SyntheticMutator.publish(channels, message);
  }
  /**
   * @param channels
   * @param _id
   */


  static remove(channels, _id) {
    channels = SyntheticMutator._extractChannels(channels);
    SyntheticMutator.publish(channels, {
      [RedisPipe.EVENT]: Events.REMOVE,
      [RedisPipe.SYNTHETIC]: true,
      [RedisPipe.DOC]: {
        _id
      }
    });
  }
  /**
   * @param channels
   * @param _id
   * @returns {*}
   * @private
   */


  static _extractChannels(channels, _id) {
    if (!_.isArray(channels)) {
      if (channels instanceof Mongo.Collection) {
        const name = channels._name;
        channels = [name];

        if (_id) {
          channels.push(`${name}::${_id}`);
        }
      }

      channels = [channels];
    }

    return channels;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extendMongoCollection.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/extendMongoCollection.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let extendObserveChanges;
module.link("./extendObserveChanges", {
  default(v) {
    extendObserveChanges = v;
  }

}, 2);

let _validatedInsert;

module.link("./allow-deny/validatedInsert", {
  default(v) {
    _validatedInsert = v;
  }

}, 3);

let _validatedUpdate;

module.link("./allow-deny/validatedUpdate", {
  default(v) {
    _validatedUpdate = v;
  }

}, 4);

let _validatedRemove;

module.link("./allow-deny/validatedRemove", {
  default(v) {
    _validatedRemove = v;
  }

}, 5);
let Mutator;
module.link("./Mutator", {
  default(v) {
    Mutator = v;
  }

}, 6);
module.exportDefault(() => {
  const Originals = {
    insert: Mongo.Collection.prototype.insert,
    update: Mongo.Collection.prototype.update,
    remove: Mongo.Collection.prototype.remove,
    find: Mongo.Collection.prototype.find
  };
  Mutator.init();

  _.extend(Mongo.Collection.prototype, {
    find(...args) {
      var cursor = Originals.find.call(this, ...args);
      extendObserveChanges(cursor, ...args);
      return cursor;
    },

    /**
     * @param data
     * @param config
     * @returns {*}
     */
    insert(data, config) {
      return Mutator.insert.call(this, Originals, data, config);
    },

    /**
     * @param selector
     * @param modifier
     * @param config
     * @param callback
     * @returns {*}
     */
    update(selector, modifier, config, callback) {
      return Mutator.update.call(this, Originals, selector, modifier, config, callback);
    },

    /**
     * @param selector
     * @param config
     * @returns {*}
     */
    remove(selector, config) {
      return Mutator.remove.call(this, Originals, selector, config);
    },

    _validatedInsert,
    _validatedUpdate,
    _validatedRemove,

    /**
     * Configure defaults for your collection
     *
     * @param {function} mutation
     * @param {function} cursor
     */
    configureRedisOplog({
      mutation,
      cursor
    }) {
      this._redisOplog = {};

      if (mutation) {
        if (!_.isFunction(mutation)) {
          throw new Meteor.Error('To configure defaults for the collection, "mutation" needs to be a function');
        }

        this._redisOplog.mutation = mutation;
      }

      if (cursor) {
        if (!_.isFunction(cursor)) {
          throw new Meteor.Error('To configure defaults for the collection, "cursor" needs to be a function');
        }

        this._redisOplog.cursor = cursor;
      }
    }

  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"extendObserveChanges.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/extendObserveChanges.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let PublicationEntry;
module.link("../cache/PublicationEntry", {
  default(v) {
    PublicationEntry = v;
  }

}, 0);
let PublicationFactory;
module.link("../cache/PublicationFactory", {
  default(v) {
    PublicationFactory = v;
  }

}, 1);
let diff;
module.link("deep-diff", {
  diff(v) {
    diff = v;
  }

}, 2);
let cloneDeep;
module.link("lodash.clonedeep", {
  default(v) {
    cloneDeep = v;
  }

}, 3);
let DDP;
module.link("meteor/ddp", {
  DDP(v) {
    DDP = v;
  }

}, 4);
module.exportDefault(function (cursor, selector, options) {
  if (options && options.disableOplog) {
    return;
  }

  if (!cursor._cursorDescription) {
    // It means that it's most likely a LocalCollection, no need to extend it in any way
    return;
  }

  Object.assign(cursor, {
    observeChanges(_observer) {
      return createPublicationEntry(cursor, createObserveChanges(_observer));
    },

    observe(_observer) {
      return createPublicationEntry(cursor, createObserve(_observer));
    }

  });
});

/**
 * Creates the publication entry
 * @param cursor
 * @param observer
 * @returns {{stop: (function()), _multiplexer: {}}}
 */
function createPublicationEntry(cursor, observer) {
  let pe = PublicationFactory.create(cursor, observer);
  return {
    stop() {
      pe.removeObserver(observer);
    },

    // We do this to make it work with meteorhacks:kadira
    _multiplexer: class {
      _sendAdds() {}

    }
  };
}
/**
 * @param observer
 */


function createObserve(observer) {
  const ef = function () {};

  return {
    connection: getObserverConnection(observer),

    added(collectionName, docId, doc) {
      if (observer.added) {
        observer.added(cloneDeep(doc));
      }
    },

    changed(collectionName, docId, changedDiff, newDoc, oldDoc) {
      if (observer.changed) {
        var differences = diff(newDoc, oldDoc);

        if (differences) {
          observer.changed(cloneDeep(newDoc), oldDoc);
        }
      }
    },

    removed(collectionName, docId, doc) {
      if (observer.removed) {
        observer.removed(doc);
      }
    }

  };
}
/**
 * @param observer
 */


function createObserveChanges(observer) {
  const ef = function () {};

  return {
    connection: getObserverConnection(observer),

    added(collectionName, docId, doc) {
      if (observer.added) {
        observer.added(docId, cloneDeep(doc));
      }
    },

    changed(collectionName, docId, doc) {
      if (observer.changed) {
        observer.changed(docId, cloneDeep(doc));
      }
    },

    removed(collectionName, docId) {
      if (observer.removed) {
        observer.removed(docId);
      }
    }

  };
}
/**
 * @param {*} observer
 */


function getObserverConnection(observer) {
  if (observer.connection) {
    return observer.connection;
  }

  const currentPublishInvoke = DDP._CurrentPublicationInvocation && DDP._CurrentPublicationInvocation.get();

  if (currentPublishInvoke) {
    return currentPublishInvoke.connection;
  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mongoCollectionNames.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/mongoCollectionNames.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  getName: () => getName
});
let map = {};

function getName(name) {
  return map[name];
}

function extend(base, sub) {
  // Avoid instantiating the base class just to setup inheritance
  // Also, do a recursive merge of two prototypes, so we don't overwrite
  // the existing prototype, but still maintain the inheritance chain
  // Thanks to @ccnokes
  var origProto = sub.prototype;
  sub.prototype = Object.create(base.prototype);

  for (var key in origProto) {
    sub.prototype[key] = origProto[key];
  } // The constructor property was set wrong, let's fix it


  Object.defineProperty(sub.prototype, 'constructor', {
    enumerable: false,
    value: sub
  });
}

const old = Mongo.Collection;

function extension(name, ...args) {
  old.call(this, name, ...args);
  map[name] = this;
}

_.extend(extension, old);

extend(old, extension);
Mongo.Collection = extension;
Mongo.Collection.__getCollectionByName = getName;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"allow-deny":{"docToValidate.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/allow-deny/docToValidate.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => docToValidate
});
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 0);

function docToValidate(validator, doc, generatedId) {
  let ret = doc;

  if (validator.transform) {
    ret = EJSON.clone(doc); // If you set a server-side transform on your collection, then you don't get
    // to tell the difference between "client specified the ID" and "server
    // generated the ID", because transforms expect to get _id.  If you want to
    // do that check, you can do it with a specific
    // `C.allow({insert: f, transform: null})` validator.

    if (generatedId !== null) {
      ret._id = generatedId;
    }

    ret = validator.transform(ret);
  }

  return ret;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"transformDoc.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/allow-deny/transformDoc.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => transformDoc
});

function transformDoc(validator, doc) {
  if (validator.transform) return validator.transform(doc);
  return doc;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validatedInsert.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/allow-deny/validatedInsert.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => validatedInsert
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let docToValidate;
module.link("./docToValidate", {
  default(v) {
    docToValidate = v;
  }

}, 2);

function validatedInsert(userId, doc, generatedId) {
  // call user validators.
  // Any deny returns true means denied.
  if (_.any(this._validators.insert.deny, validator => validator(userId, docToValidate(validator, doc, generatedId)))) {
    throw new Meteor.Error(403, 'Access denied');
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (_.all(this._validators.insert.allow, validator => !validator(userId, docToValidate(validator, doc, generatedId)))) {
    throw new Meteor.Error(403, 'Access denied');
  } // If we generated an ID above, insert it now: after the validation, but
  // before actually inserting.


  if (generatedId !== null) doc._id = generatedId;
  this.insert(doc, {
    optimistic: true
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validatedRemove.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/allow-deny/validatedRemove.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => validatedRemove
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let transformDoc;
module.link("./transformDoc", {
  default(v) {
    transformDoc = v;
  }

}, 2);

function validatedRemove(userId, selector) {
  const findOptions = {
    transform: null
  };

  if (!this._validators.fetchAllFields) {
    findOptions.fields = {};

    _.each(this._validators.fetch, fieldName => {
      findOptions.fields[fieldName] = 1;
    });
  }

  const doc = this._collection.findOne(selector, findOptions);

  if (!doc) {
    return 0;
  } // call user validators.
  // Any deny returns true means denied.


  if (_.any(this._validators.remove.deny, validator => validator(userId, transformDoc(validator, doc)))) {
    throw new Meteor.Error(403, 'Access denied');
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (_.all(this._validators.remove.allow, validator => !validator(userId, transformDoc(validator, doc)))) {
    throw new Meteor.Error(403, 'Access denied');
  } // Back when we supported arbitrary client-provided selectors, we actually
  // rewrote the selector to {_id: {$in: [ids that we found]}} before passing to
  // Mongo to avoid races, but since selector is guaranteed to already just be
  // an ID, we don't have to any more.


  return this.remove(selector, {
    optimistic: true
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validatedUpdate.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/allow-deny/validatedUpdate.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => validatedUpdate
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);
let LocalCollection;
module.link("meteor/minimongo", {
  LocalCollection(v) {
    LocalCollection = v;
  }

}, 2);
let check;
module.link("meteor/check", {
  check(v) {
    check = v;
  }

}, 3);
let transformDoc;
module.link("./transformDoc", {
  default(v) {
    transformDoc = v;
  }

}, 4);
// Only allow these operations in validated updates. Specifically
// whitelist operations, rather than blacklist, so new complex
// operations that are added aren't automatically allowed. A complex
// operation is one that does more than just modify its target
// field. For now this contains all update operations except '$rename'.
// http://docs.mongodb.org/manual/reference/operators/#update
const ALLOWED_UPDATE_OPERATIONS = {
  $inc: 1,
  $set: 1,
  $unset: 1,
  $addToSet: 1,
  $pop: 1,
  $pullAll: 1,
  $pull: 1,
  $pushAll: 1,
  $push: 1,
  $bit: 1 // Simulate a mongo `update` operation while validating that the access
  // control rules set by calls to `allow/deny` are satisfied. If all
  // pass, rewrite the mongo operation to use $in to set the list of
  // document ids to change ##ValidatedChange

};

function validatedUpdate(userId, selector, mutator, options) {
  check(mutator, Object);
  options = _.clone(options) || {};

  if (!LocalCollection._selectorIsIdPerhapsAsObject(selector)) {
    throw new Error('validated update should be of a single ID');
  } // We don't support upserts because they don't fit nicely into allow/deny
  // rules.


  if (options.upsert) {
    throw new Meteor.Error(403, 'Access denied. Upserts not ' + 'allowed in a restricted collection.');
  }

  const noReplaceError = 'Access denied. In a restricted collection you can only' + ' update documents, not replace them. Use a Mongo update operator, such ' + "as '$set'."; // compute modified fields

  const fields = [];

  if (_.isEmpty(mutator)) {
    throw new Meteor.Error(403, noReplaceError);
  }

  _.each(mutator, (params, op) => {
    if (op.charAt(0) !== '$') {
      throw new Meteor.Error(403, noReplaceError);
    } else if (!_.has(ALLOWED_UPDATE_OPERATIONS, op)) {
      throw new Meteor.Error(403, `Access denied. Operator ${op} not allowed in a restricted collection.`);
    } else {
      _.each(_.keys(params), field => {
        // treat dotted fields as if they are replacing their
        // top-level part
        if (field.indexOf('.') !== -1) {
          field = field.substring(0, field.indexOf('.'));
        } // record the field we are trying to change


        if (!_.contains(fields, field)) {
          fields.push(field);
        }
      });
    }
  });

  const findOptions = {
    transform: null
  };

  if (!this._validators.fetchAllFields) {
    findOptions.fields = {};

    _.each(this._validators.fetch, fieldName => {
      findOptions.fields[fieldName] = 1;
    });
  }

  const doc = this._collection.findOne(selector, findOptions);

  if (!doc) {
    // none satisfied!
    return 0;
  } // call user validators.
  // Any deny returns true means denied.


  if (_.any(this._validators.update.deny, validator => {
    const factoriedDoc = transformDoc(validator, doc);
    return validator(userId, factoriedDoc, fields, mutator);
  })) {
    throw new Meteor.Error(403, 'Access denied');
  } // Any allow returns true means proceed. Throw error if they all fail.


  if (_.all(this._validators.update.allow, validator => {
    const factoriedDoc = transformDoc(validator, doc);
    return !validator(userId, factoriedDoc, fields, mutator);
  })) {
    throw new Meteor.Error(403, 'Access denied');
  }

  options._forbidReplace = true; // Back when we supported arbitrary client-provided selectors, we actually
  // rewrote the selector to include an _id clause before passing to Mongo to
  // avoid races, but since selector is guaranteed to already just be an ID, we
  // don't have to any more.

  return this.update(selector, mutator, _.extend(options, {
    optimistic: true
  }));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"containsOperators.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/lib/containsOperators.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exportDefault(function (modifier) {
  return _.some(modifier, function (value, operator) {
    return /^\$/.test(operator);
  });
});
;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dispatchers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/lib/dispatchers.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  dispatchInsert: () => dispatchInsert,
  dispatchUpdate: () => dispatchUpdate,
  dispatchRemove: () => dispatchRemove
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPServer;
module.link("meteor/ddp-server", {
  DDPServer(v) {
    DDPServer = v;
  }

}, 1);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 2);
let Events, RedisPipe;
module.link("../../constants", {
  Events(v) {
    Events = v;
  },

  RedisPipe(v) {
    RedisPipe = v;
  }

}, 3);
let RedisSubscriptionManager;
module.link("../../redis/RedisSubscriptionManager", {
  default(v) {
    RedisSubscriptionManager = v;
  }

}, 4);
let getRedisPusher;
module.link("../../redis/getRedisClient", {
  getRedisPusher(v) {
    getRedisPusher = v;
  }

}, 5);
let getDedicatedChannel;
module.link("../../utils/getDedicatedChannel", {
  default(v) {
    getDedicatedChannel = v;
  }

}, 6);
let Config;
module.link("../../config", {
  default(v) {
    Config = v;
  }

}, 7);

const getWriteFence = function (optimistic) {
  if (optimistic && DDPServer._CurrentWriteFence) {
    return DDPServer._CurrentWriteFence.get();
  }

  return null;
};

const dispatchEvents = function (fence, collectionName, channels, events) {
  if (fence) {
    const write = fence.beginWrite();
    RedisSubscriptionManager.queue.queueTask(Meteor.bindEnvironment(() => {
      try {
        events.forEach(event => {
          channels.forEach(channelName => {
            RedisSubscriptionManager.process(channelName, event);
          });
          const docId = event[RedisPipe.DOC]._id;
          const dedicatedChannel = getDedicatedChannel(collectionName, docId);
          RedisSubscriptionManager.process(dedicatedChannel, event);
        });
      } finally {
        write.committed();
      }
    }));
  }

  if (Config.externalRedisPublisher) {
    return;
  }

  Meteor.defer(() => {
    const client = getRedisPusher();
    events.forEach(event => {
      const message = EJSON.stringify(event);
      channels.forEach(channelName => {
        client.publish(channelName, message);
      });
      const docId = event[RedisPipe.DOC]._id;
      const dedicatedChannel = getDedicatedChannel(collectionName, docId);
      client.publish(dedicatedChannel, message);
    });
  });
};

const dispatchUpdate = function (optimistic, collectionName, channels, docIds, fields) {
  const fence = getWriteFence(optimistic);
  const uid = fence ? RedisSubscriptionManager.uid : null;
  const events = docIds.map(docId => ({
    [RedisPipe.EVENT]: Events.UPDATE,
    [RedisPipe.FIELDS]: fields,
    [RedisPipe.DOC]: {
      _id: docId
    },
    [RedisPipe.UID]: uid
  }));
  dispatchEvents(fence, collectionName, channels, events);
};

const dispatchRemove = function (optimistic, collectionName, channels, docIds) {
  const fence = getWriteFence(optimistic);
  const uid = fence ? RedisSubscriptionManager.uid : null;
  const events = docIds.map(docId => ({
    [RedisPipe.EVENT]: Events.REMOVE,
    [RedisPipe.DOC]: {
      _id: docId
    },
    [RedisPipe.UID]: uid
  }));
  dispatchEvents(fence, collectionName, channels, events);
};

const dispatchInsert = function (optimistic, collectionName, channels, docId) {
  const fence = getWriteFence(optimistic);
  const uid = fence ? RedisSubscriptionManager.uid : null;
  const event = {
    [RedisPipe.EVENT]: Events.INSERT,
    [RedisPipe.DOC]: {
      _id: docId
    },
    [RedisPipe.UID]: uid
  };
  dispatchEvents(fence, collectionName, channels, [event]);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getMutationConfig.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/mongo/lib/getMutationConfig.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let getChannels;
module.link("../../cache/lib/getChannels", {
  default(v) {
    getChannels = v;
  }

}, 0);
let Config;
module.link("../../config", {
  default(v) {
    Config = v;
  }

}, 1);
module.exportDefault(function (collection, _config, mutationObject) {
  const collectionName = collection._name;

  if (!_config || _.isFunction(_config)) {
    _config = {};
  }

  const defaultOverrides = {};

  if (!DDP._CurrentMethodInvocation.get()) {
    // If we're not in a method, then we should never need to do optimistic
    // ui processing.
    //
    // However, we allow users to really force it by explicitly passing
    // optimistic: true if they want to use the local-dispatch code path
    // rather than going through Redis.
    defaultOverrides.optimistic = false;
  }

  let config = _.extend({}, Config.mutationDefaults, defaultOverrides, _config);

  if (collection._redisOplog) {
    const {
      mutation
    } = collection._redisOplog;

    if (mutation) {
      mutation.call(collection, config, mutationObject);
    }
  }

  config._channels = getChannels(collectionName, config);
  return config;
});
;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"processors":{"default.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/default.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Events;
module.link("../constants", {
  Events(v) {
    Events = v;
  }

}, 0);
module.exportDefault(function (observableCollection, event, doc, modifiedFields) {
  switch (event) {
    case Events.INSERT:
      handleInsert(observableCollection, doc);
      break;

    case Events.UPDATE:
      handleUpdate(observableCollection, doc, modifiedFields);
      break;

    case Events.REMOVE:
      handleRemove(observableCollection, doc);
      break;

    default:
      throw new Meteor.Error(`Invalid event specified: ${event}`);
  }
});

/**
 * @param observableCollection
 * @param doc
 */
const handleInsert = function (observableCollection, doc) {
  if (!observableCollection.contains(doc._id) && observableCollection.isEligible(doc)) {
    observableCollection.add(doc);
  }
};
/**
 * @param observableCollection
 * @param doc
 * @param modifiedFields
 */


const handleUpdate = function (observableCollection, doc, modifiedFields) {
  if (observableCollection.isEligible(doc)) {
    if (observableCollection.contains(doc._id)) {
      observableCollection.change(doc, modifiedFields);
    } else {
      observableCollection.add(doc);
    }
  } else {
    if (observableCollection.contains(doc._id)) {
      observableCollection.remove(doc._id);
    }
  }
};
/**
 * @param observableCollection
 * @param doc
 */


const handleRemove = function (observableCollection, doc) {
  if (observableCollection.contains(doc._id)) {
    observableCollection.remove(doc._id);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"direct.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/direct.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Events;
module.link("../constants", {
  Events(v) {
    Events = v;
  }

}, 0);
module.exportDefault(function (observableCollection, event, doc, modifiedFields) {
  switch (event) {
    case Events.UPDATE:
      handleUpdate(observableCollection, doc, modifiedFields);
      break;

    case Events.REMOVE:
      handleRemove(observableCollection, doc);
      break;

    case Events.INSERT:
      handleInsert(observableCollection, doc);
      break;

    default:
      throw new Meteor.Error(`Invalid event specified: ${event}`);
  }
});

/**
 * @param observableCollection
 * @param doc
 */
const handleInsert = function (observableCollection, doc) {
  if (!observableCollection.contains(doc._id) && observableCollection.isEligible(doc)) {
    observableCollection.add(doc);
  }
};
/**
 * @param observableCollection
 * @param doc
 * @param modifiedFields
 */


const handleUpdate = function (observableCollection, doc, modifiedFields) {
  const otherSelectors = observableCollection.__containsOtherSelectorsThanId;

  if (otherSelectors) {
    if (observableCollection.isEligible(doc)) {
      if (observableCollection.contains(doc._id)) {
        observableCollection.change(doc, modifiedFields);
      } else {
        observableCollection.add(doc);
      }
    } else {
      observableCollection.remove(doc._id);
    }
  } else {
    if (observableCollection.contains(doc._id)) {
      observableCollection.change(doc, modifiedFields);
    } else {
      observableCollection.add(doc);
    }
  }
};
/**
 * @param observableCollection
 * @param doc
 */


const handleRemove = function (observableCollection, doc) {
  observableCollection.remove(doc._id);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getStrategy.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/getStrategy.js                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => getStrategy
});
let Strategy;
module.link("../constants", {
  Strategy(v) {
    Strategy = v;
  }

}, 0);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 1);

function getStrategy(selector = {}, options = {}) {
  if (options.limit && !options.sort) {
    options.sort = {
      _id: 1
    }; // throw new Meteor.Error(`Sorry, but you are not allowed to use "limit" without "sort" option.`);
  }

  if (options.limit && options.sort) {
    return Strategy.LIMIT_SORT;
  }

  if (selector && selector._id) {
    return Strategy.DEDICATED_CHANNELS;
  }

  return Strategy.DEFAULT;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/index.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  getStrategy: () => getStrategy,
  getProcessor: () => getProcessor
});
let Strategy;
module.link("../constants", {
  Strategy(v) {
    Strategy = v;
  }

}, 0);
let defaultStrategy;
module.link("./default", {
  default(v) {
    defaultStrategy = v;
  }

}, 1);
let directStrategy;
module.link("./direct", {
  default(v) {
    directStrategy = v;
  }

}, 2);
let limitSortStrategy;
module.link("./limit-sort", {
  default(v) {
    limitSortStrategy = v;
  }

}, 3);
let getStrategy;
module.link("./getStrategy", {
  default(v) {
    getStrategy = v;
  }

}, 4);
const StrategyProcessorMap = {
  [Strategy.LIMIT_SORT]: limitSortStrategy,
  [Strategy.DEFAULT]: defaultStrategy,
  [Strategy.DEDICATED_CHANNELS]: directStrategy
};

function getProcessor(strategy) {
  return StrategyProcessorMap[strategy];
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"limit-sort.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/limit-sort.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Events;
module.link("../constants", {
  Events(v) {
    Events = v;
  }

}, 0);
let hasSortFields;
module.link("./lib/fieldsExist", {
  hasSortFields(v) {
    hasSortFields = v;
  }

}, 1);
let requery;
module.link("./actions/requery", {
  default(v) {
    requery = v;
  }

}, 2);
module.exportDefault(function (observableCollection, event, doc, modifiedFields) {
  switch (event) {
    case Events.INSERT:
      handleInsert(observableCollection, doc);
      break;

    case Events.UPDATE:
      handleUpdate(observableCollection, doc, modifiedFields);
      break;

    case Events.REMOVE:
      handleRemove(observableCollection, doc);
      break;

    default:
      throw new Meteor.Error(`Invalid event specified: ${event}`);
  }
});

/**
 * @param observableCollection
 * @param doc
 */
const handleInsert = function (observableCollection, doc) {
  if (observableCollection.isEligible(doc)) {
    requery(observableCollection, doc);
  }
};
/**
 * @param observableCollection
 * @param doc
 * @param modifiedFields
 */


const handleUpdate = function (observableCollection, doc, modifiedFields) {
  if (observableCollection.contains(doc._id)) {
    if (observableCollection.isEligible(doc)) {
      if (hasSortFields(observableCollection.options.sort, modifiedFields)) {
        requery(observableCollection, doc, Events.UPDATE, modifiedFields);
      } else {
        observableCollection.change(doc, modifiedFields);
      }
    } else {
      requery(observableCollection);
    }
  } else {
    if (observableCollection.isEligible(doc)) {
      if (hasSortFields(observableCollection.options.sort, modifiedFields)) {
        // This document isn't in the observable collection, but a field that
        // is related to sorting has changed, so the order and image may have changed
        requery(observableCollection, doc, Events.UPDATE, modifiedFields);
      } else {
        // If the document is now eligible and it does not belong in the initial values
        // We only add it to the store if and only if we do not surpass the limit
        if (!observableCollection.isLimitReached()) {
          observableCollection.add(doc);
        }
      }
    }
  }
};
/**
 * @param observableCollection
 * @param doc
 */


const handleRemove = function (observableCollection, doc) {
  if (observableCollection.contains(doc._id)) {
    requery(observableCollection, doc);
  } else {
    if (observableCollection.options.skip) {
      requery(observableCollection, doc);
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"synthetic.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/synthetic.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Events;
module.link("../constants", {
  Events(v) {
    Events = v;
  }

}, 0);
module.exportDefault(function (observableCollection, event, doc, modifier, modifiedTopLevelFields) {
  switch (event) {
    case Events.INSERT:
      handleInsert(observableCollection, doc);
      break;

    case Events.UPDATE:
      handleUpdate(observableCollection, doc, modifier, modifiedTopLevelFields);
      break;

    case Events.REMOVE:
      handleRemove(observableCollection, doc);
      break;

    default:
      throw new Meteor.Error(`Invalid event specified: ${event}`);
  }
});

/**
 * @param observableCollection
 * @param doc
 */
const handleInsert = function (observableCollection, doc) {
  if (observableCollection.isEligible(doc)) {
    observableCollection.add(doc, true);
  }
};
/**
 * @param observableCollection
 * @param doc
 * @param modifier
 * @param modifiedTopLevelFields
 */


const handleUpdate = function (observableCollection, doc, modifier, modifiedTopLevelFields) {
  observableCollection.changeSynthetic(doc._id, modifier, modifiedTopLevelFields);
};
/**
 * @param observableCollection
 * @param doc
 */


const handleRemove = function (observableCollection, doc) {
  if (observableCollection.contains(doc._id)) {
    observableCollection.remove(doc._id);
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"actions":{"reload.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/actions/reload.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let MongoIDMap;
module.link("../../cache/mongoIdMap", {
  MongoIDMap(v) {
    MongoIDMap = v;
  }

}, 1);
module.exportDefault(function (observableCollection) {
  const {
    store,
    cursor
  } = observableCollection;
  const freshData = cursor.fetch();
  const newStore = new MongoIDMap();
  freshData.forEach(doc => newStore.set(doc._id, doc));
  store.compareWith(newStore, {
    both(docId, oldDoc, newDoc) {
      const modifiedFields = _.union(_.keys(oldDoc), _.keys(newDoc));

      observableCollection.change(newDoc, modifiedFields);
    },

    leftOnly(docId) {
      observableCollection.remove(docId);
    },

    rightOnly(docId, newDoc) {
      observableCollection.add(newDoc);
    }

  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"requery.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/actions/requery.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
let EJSON;
module.link("meteor/ejson", {
  EJSON(v) {
    EJSON = v;
  }

}, 1);
let Events;
module.link("../../constants", {
  Events(v) {
    Events = v;
  }

}, 2);
let MongoIDMap;
module.link("../../cache/mongoIdMap", {
  MongoIDMap(v) {
    MongoIDMap = v;
  }

}, 3);
module.exportDefault(function (observableCollection, newCommer, event, modifiedFields) {
  const {
    store,
    selector,
    options
  } = observableCollection;
  const newStore = new MongoIDMap();
  const freshIds = observableCollection.collection.find(selector, (0, _objectSpread2.default)({}, options, {
    fields: {
      _id: 1
    }
  })).fetch();
  freshIds.forEach(doc => newStore.set(doc._id, doc));
  let added = false;
  store.compareWith(newStore, {
    leftOnly(docId) {
      observableCollection.remove(docId);
    },

    rightOnly(docId) {
      if (newCommer && EJSON.equals(docId, newCommer._id)) {
        added = true;
        observableCollection.add(newCommer);
      } else {
        observableCollection.addById(docId);
      }
    }

  }); // if we have an update, and we have a newcommer, that new commer may be inside the ids
  // TODO: maybe refactor this in a separate action (?)

  if (newCommer && Events.UPDATE === event && modifiedFields && !added && store.has(newCommer._id)) {
    observableCollection.change(newCommer, modifiedFields);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"lib":{"fieldsExist.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/processors/lib/fieldsExist.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  hasSortFields: () => hasSortFields
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);

function hasSortFields(fieldsObject, fieldsArray) {
  const existingFields = _.keys(fieldsObject);

  for (let i = 0; i < fieldsArray.length; i++) {
    const field = fieldsArray[i];

    for (let j = 0; j < existingFields.length; j++) {
      const existingField = existingFields[j];

      if (existingField == field || field.indexOf(existingField + '.') != -1 || existingField.indexOf(field + '.') != -1) {
        return true;
      }
    }
  }

  return false;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"redis":{"PubSubManager.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/redis/PubSubManager.js                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => PubSubManager
});
let getRedisListener, getRedisPusher;
module.link("./getRedisClient", {
  getRedisListener(v) {
    getRedisListener = v;
  },

  getRedisPusher(v) {
    getRedisPusher = v;
  }

}, 0);

class PubSubManager {
  constructor() {
    this.channelHandlers = {};
    this.queue = new Meteor._SynchronousQueue();
    this.listener = getRedisListener();
    this.pusher = getRedisPusher();

    this._initMessageListener();
  }
  /**
   * Pushes to Redis
   * @param {string} channel
   * @param {object} message
   */


  publish(channel, message) {
    this.pusher.publish(channel, EJSON.stringify(message));
  }
  /**
   * @param {string} channel
   * @param {function} handler
   */


  subscribe(channel, handler) {
    this.queue.queueTask(() => {
      if (!this.channelHandlers[channel]) {
        this._initChannel(channel);
      }

      this.channelHandlers[channel].push(handler);
    });
  }
  /**
   * @param {string} channel
   * @param {function} handler
   */


  unsubscribe(channel, handler) {
    this.queue.queueTask(() => {
      if (!this.channelHandlers[channel]) {
        return;
      }

      this.channelHandlers[channel] = this.channelHandlers[channel].filter(_handler => {
        return _handler !== handler;
      });

      if (this.channelHandlers[channel].length === 0) {
        this._destroyChannel(channel);
      }
    });
  }
  /**
   * Initializes listening for redis messages
   * @private
   */


  _initMessageListener() {
    const self = this;
    this.listener.on('message', Meteor.bindEnvironment(function (channel, _message) {
      if (self.channelHandlers[channel]) {
        const message = EJSON.parse(_message);
        self.channelHandlers[channel].forEach(channelHandler => {
          channelHandler(message);
        });
      }
    }));
  }
  /**
   * @param channel
   * @private
   */


  _initChannel(channel) {
    this.listener.subscribe(channel);
    this.channelHandlers[channel] = [];
  }
  /**
   * @param channel
   * @private
   */


  _destroyChannel(channel) {
    this.listener.unsubscribe(channel);
    delete this.channelHandlers[channel];
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RedisSubscriber.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/redis/RedisSubscriber.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => RedisSubscriber
});
let Strategy;
module.link("../constants", {
  Strategy(v) {
    Strategy = v;
  }

}, 0);
let getProcessor;
module.link("../processors", {
  getProcessor(v) {
    getProcessor = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 3);
let extractIdsFromSelector;
module.link("../utils/extractIdsFromSelector", {
  default(v) {
    extractIdsFromSelector = v;
  }

}, 4);
let RedisSubscriptionManager;
module.link("./RedisSubscriptionManager", {
  default(v) {
    RedisSubscriptionManager = v;
  }

}, 5);
let syntheticProcessor;
module.link("../processors/synthetic", {
  default(v) {
    syntheticProcessor = v;
  }

}, 6);
let getDedicatedChannel;
module.link("../utils/getDedicatedChannel", {
  default(v) {
    getDedicatedChannel = v;
  }

}, 7);

class RedisSubscriber {
  /**
   * @param publicationEntry
   * @param strategy
   */
  constructor(publicationEntry, strategy) {
    this.publicationEntry = publicationEntry;
    this.observableCollection = publicationEntry.observableCollection;
    this.strategy = strategy;
    this.processor = getProcessor(strategy); // We do this because we override the behavior of dedicated "_id" channels

    this.channels = this.getChannels(this.observableCollection.channels);
    RedisSubscriptionManager.attach(this);
  }
  /**
   * @param channels
   * @returns {*}
   */


  getChannels(channels) {
    const collectionName = this.observableCollection.collectionName;

    switch (this.strategy) {
      case Strategy.DEFAULT:
      case Strategy.LIMIT_SORT:
        return channels;

      case Strategy.DEDICATED_CHANNELS:
        const ids = extractIdsFromSelector(this.observableCollection.selector);
        return ids.map(id => getDedicatedChannel(collectionName, id));

      default:
        throw new Meteor.Error(`Strategy could not be found: ${this.strategy}`);
    }
  }
  /**
   * @param args
   */


  process(...args) {
    this.processor.call(null, this.observableCollection, ...args);
  }
  /**
   * @param event
   * @param doc
   * @param modifier
   * @param modifiedTopLevelFields
   */


  processSynthetic(event, doc, modifier, modifiedTopLevelFields) {
    syntheticProcessor(this.observableCollection, event, doc, modifier, modifiedTopLevelFields);
  }
  /**
   * Detaches from RedisSubscriptionManager
   */


  stop() {
    try {
      RedisSubscriptionManager.detach(this);
    } catch (e) {
      console.warn(`[RedisSubscriber] Weird! There was an error while stopping the publication: `, e);
    }
  }
  /**
   * Retrieves the fields that are used for matching the validity of the document
   *
   * @returns {array}
   */


  getFieldsOfInterest() {
    return this.observableCollection.fieldsOfInterest;
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"RedisSubscriptionManager.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/redis/RedisSubscriptionManager.js                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let debug;
module.link("../debug", {
  default(v) {
    debug = v;
  }

}, 3);
let RedisPipe, Events;
module.link("../constants", {
  RedisPipe(v) {
    RedisPipe = v;
  },

  Events(v) {
    Events = v;
  }

}, 4);
let getFieldsOfInterestFromAll;
module.link("./lib/getFieldsOfInterestFromAll", {
  default(v) {
    getFieldsOfInterestFromAll = v;
  }

}, 5);
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 6);

class RedisSubscriptionManager {
  init() {
    if (this.isInitialized) {
      return;
    }

    this.uid = Random.id();
    this.queue = new Meteor._SynchronousQueue();
    this.store = {}; // {channel: [RedisSubscribers]}

    this.channelHandlers = {}; // {channel: handler}

    this.isInitialized = true;
  }
  /**
   * @param redisSubscriber
   */


  attach(redisSubscriber) {
    this.queue.queueTask(() => {
      _.each(redisSubscriber.channels, channel => {
        if (!this.store[channel]) {
          this.initializeChannel(channel);
        }

        this.store[channel].push(redisSubscriber);
      });
    });
  }
  /**
   * @param redisSubscriber
   */


  detach(redisSubscriber) {
    this.queue.queueTask(() => {
      _.each(redisSubscriber.channels, channel => {
        if (!this.store[channel]) {
          return debug('[RedisSubscriptionManager] Trying to detach a subscriber on a non existent channels.');
        } else {
          this.store[channel] = _.without(this.store[channel], redisSubscriber);

          if (this.store[channel].length === 0) {
            this.destroyChannel(channel);
          }
        }
      });
    });
  }
  /**
   * @param channel
   */


  initializeChannel(channel) {
    debug(`[RedisSubscriptionManager] Subscribing to channel: ${channel}`); // create the handler for this channel

    const self = this;

    const handler = function (message) {
      self.queue.queueTask(() => {
        self.process(channel, message, true);
      });
    };

    this.channelHandlers[channel] = handler;
    this.store[channel] = [];
    const {
      pubSubManager
    } = Config;
    pubSubManager.subscribe(channel, handler);
  }
  /**
   * @param channel
   */


  destroyChannel(channel) {
    debug(`[RedisSubscriptionManager] Unsubscribing from channel: ${channel}`);
    const {
      pubSubManager
    } = Config;
    pubSubManager.unsubscribe(channel, this.channelHandlers[channel]);
    delete this.store[channel];
    delete this.channelHandlers[channel];
  }
  /**
   * @param channel
   * @param data
   * @param [fromRedis=false]
   */


  process(channel, data, fromRedis) {
    // messages from redis that contain our uid were handled
    //  optimistically, so we can drop them.
    if (fromRedis && data[RedisPipe.UID] === this.uid) {
      return;
    }

    const subscribers = this.store[channel];

    if (!subscribers) {
      return;
    }

    let isSynthetic = data[RedisPipe.SYNTHETIC];
    debug(`[RedisSubscriptionManager] Received ${isSynthetic ? 'synthetic ' : ''}event: "${data[RedisPipe.EVENT]}" to "${channel}"`);

    if (subscribers.length === 0) {
      return;
    }

    if (!isSynthetic) {
      const collection = subscribers[0].observableCollection.collection;
      let doc;

      if (data[RedisPipe.EVENT] === Events.REMOVE) {
        doc = data[RedisPipe.DOC];
      } else {
        doc = this.getDoc(collection, subscribers, data);
      } // if by any chance it was deleted after it got dispatched
      // doc will be undefined


      if (!doc) {
        return;
      }

      subscribers.forEach(redisSubscriber => {
        redisSubscriber.process(data[RedisPipe.EVENT], doc, data[RedisPipe.FIELDS]);
      });
    } else {
      subscribers.forEach(redisSubscriber => {
        redisSubscriber.processSynthetic(data[RedisPipe.EVENT], data[RedisPipe.DOC], data[RedisPipe.MODIFIER], data[RedisPipe.MODIFIED_TOP_LEVEL_FIELDS]);
      });
    }
  }
  /**
   * @param collection
   * @param subscribers
   * @param data
   */


  getDoc(collection, subscribers, data) {
    const event = data[RedisPipe.EVENT];
    let doc = data[RedisPipe.DOC];
    const fieldsOfInterest = getFieldsOfInterestFromAll(subscribers);

    if (fieldsOfInterest === true) {
      doc = collection.findOne(doc._id);
    } else {
      doc = collection.findOne(doc._id, {
        fields: fieldsOfInterest
      });
    }

    return doc;
  }

}

module.exportDefault(new RedisSubscriptionManager());
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getRedisClient.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/redis/getRedisClient.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  getRedisPusher: () => getRedisPusher,
  getRedisListener: () => getRedisListener
});
let redis;
module.link("redis", {
  default(v) {
    redis = v;
  }

}, 0);
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 3);
// Redis requires two connections for pushing and listening to data
let redisPusher;
let redisListener;
/**
 * Returns the pusher for events in Redis
 *
 * @returns {*}
 */

function getRedisPusher() {
  if (!redisPusher) {
    redisPusher = redis.createClient(_.extend({}, Config.redis, {
      retry_strategy: getRetryStrategy()
    }));
  }

  return redisPusher;
}

function getRedisListener({
  onConnect
} = {}) {
  if (!redisListener) {
    redisListener = redis.createClient(_.extend({}, Config.redis, {
      retry_strategy: getRetryStrategy()
    })); // we only attach events here

    attachEvents(redisListener, {
      onConnect
    });
  }

  return redisListener;
}

/**
 *
 * @param client
 * @param onConnect
 */
function attachEvents(client, {
  onConnect
}) {
  const functions = ['connect', 'reconnecting', 'error', 'end'];
  functions.forEach(fn => {
    redisListener.on(fn, Meteor.bindEnvironment(function (...args) {
      if (fn === 'connect' && onConnect) {
        onConnect();
      }

      if (Config.redisExtras.events[fn]) {
        return Config.redisExtras.events[fn](...args);
      }
    }));
  });
}
/**
 * Retrieves the retry strategy that can be modified
 * @returns {Function}
 */


function getRetryStrategy() {
  return function (...args) {
    if (Config.redisExtras.retry_strategy) {
      return Config.redisExtras.retry_strategy(...args);
    }
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"getFieldsOfInterestFromAll.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/redis/lib/getFieldsOfInterestFromAll.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  removeChildrenOfParents: () => removeChildrenOfParents
});

function getFieldsOfInterestFromAll(subscribers) {
  let allFields = [];

  for (let i = 0; i < subscribers.length; i++) {
    const subscriber = subscribers[i];
    let fields = subscriber.getFieldsOfInterest();

    if (fields === true) {
      // end of story, there is an observableCollection that needs all fields
      // therefore we will query for all fields
      return true;
    } else {
      allFields = _.union(allFields, fields);
    }
  } // this should not happen, but as a measure of safety


  if (allFields.length === 0) {
    return true;
  }

  allFields = removeChildrenOfParents(allFields);
  let fieldsObject = {};
  allFields.forEach(field => {
    fieldsObject[field] = 1;
  });
  return fieldsObject;
}
/**
 * @param {array} array
 * @return {array} array
 */


function removeChildrenOfParents(array) {
  let freshArray = [];
  array.forEach((element, idxe) => {
    // add it to freshArray only if there's no {me} + '.' inside the array
    const foundParent = array.find((subelement, idxs) => {
      return idxe !== idxs && element.indexOf(`${subelement}.`) >= 0;
    });

    if (!foundParent) {
      freshArray.push(element);
    }
  });
  return freshArray;
}

module.exportDefault(getFieldsOfInterestFromAll);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"utils":{"extractIdsFromSelector.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/extractIdsFromSelector.js                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);
module.exportDefault(function (selector) {
  const filter = selector._id;
  let ids = [];

  if (_.isObject(filter) && !filter._str) {
    if (!filter.$in) {
      throw new Meteor.Error(`When you subscribe directly, you can't have other specified fields rather than $in`);
    }

    ids = filter.$in;
  } else {
    ids.push(filter);
  }

  return ids;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getChannelName.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/getChannelName.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => getChannelName
});
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 0);

function getChannelName(baseChannelName) {
  return (Config.globalRedisPrefix || '') + baseChannelName;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getDedicatedChannel.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/getDedicatedChannel.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => getDedicatedChannel
});
let MongoID;
module.link("meteor/mongo-id", {
  MongoID(v) {
    MongoID = v;
  }

}, 0);
let getChannelName;
module.link("./getChannelName", {
  default(v) {
    getChannelName = v;
  }

}, 1);

function getDedicatedChannel(collectionName, docId) {
  const channelName = `${collectionName}::${MongoID.idStringify(docId)}`;
  return getChannelName(channelName);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"getFields.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/getFields.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => getFields
});

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 0);

function getFields(mutator) {
  // compute modified fields
  var fields = [];
  var topLevelFields = [];

  _.each(mutator, function (params, op) {
    if (op[0] == '$') {
      _.each(_.keys(params), function (field) {
        // record the field we are trying to change
        if (!_.contains(fields, field)) {
          // fields.push(field);
          // topLevelFields.push(field.split('.')[0]);
          // like { $set: { 'array.1.xx' } }
          const specificPositionFieldMatch = /\.[\d]+(\.)?/.exec(field);

          if (specificPositionFieldMatch) {
            fields.push(field.slice(0, specificPositionFieldMatch.index));
          } else {
            if (field.indexOf('.$') !== -1) {
              if (field.indexOf('.$.') !== -1) {
                fields.push(field.split('.$.')[0]);
              } else {
                fields.push(field.split('.$')[0]);
              }
            } else {
              fields.push(field);
            }
          }

          topLevelFields.push(field.split('.')[0]);
        }
      });
    } else {
      fields.push(op);
    }
  });

  return {
    fields,
    topLevelFields
  };
}

;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"shouldPublicationBeWithPolling.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/shouldPublicationBeWithPolling.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
module.exportDefault(function (cursors) {
  let isDisabledOplog = undefined;

  if (cursors.length === 1) {
    const [cursor] = cursors;
    return isOplogDisabled(cursor);
  }

  let disabledConfigs = [];
  cursors.forEach(cursor => {
    disabledConfigs.push(isOplogDisabled(cursor));
  });

  const allTheSame = _.every(disabledConfigs, c => c === true) || _.every(disabledConfigs, c => c === false);

  if (!allTheSame) {
    throw new Meteor.Error('The array of cursors returned must all be reactive with oplog or polling, you are not allowed to mix them up.');
  }

  return disabledConfigs[0];
});

/**
 * @param {*} cursor
 */
function isOplogDisabled(cursor) {
  const config = cursor._cursorDescription || {
    options: {}
  };
  return !!config.options.disableOplog;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"stats.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/utils/stats.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let RedisSubscriptionManager;
module.link("../redis/RedisSubscriptionManager", {
  default(v) {
    RedisSubscriptionManager = v;
  }

}, 0);
let PublicationFactory;
module.link("../cache/PublicationFactory", {
  default(v) {
    PublicationFactory = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
let sizeof;
module.link("object-sizeof", {
  default(v) {
    sizeof = v;
  }

}, 3);
module.exportDefault(() => {
  // total of active queries
  const totalQueries = _.keys(PublicationFactory.store.store).length;

  const redisChannels = _.keys(RedisSubscriptionManager.store).length;

  let totalSize = 0;
  let totalObservers = 0;
  let maxSize = 0;
  let maxSizePubEntry = 0;
  let maxObservers = 0;
  let maxObserversPubEntry;

  _.each(PublicationFactory.store.store, (pubEntry, id) => {
    const size = sizeof(pubEntry.observableCollection.store);
    totalSize += size;

    if (size > maxSize) {
      maxSize = size;
      maxSizePubEntry = pubEntry;
    }

    const observersCount = pubEntry.observers.length;
    totalObservers += observersCount;

    if (observersCount > maxObservers) {
      maxObservers = observersCount;
      maxObserversPubEntry = pubEntry;
    }
  });

  let response = {
    totalQueries,
    redisChannels,
    totalSize: totalSize + 'B',
    totalObservers
  };

  if (maxSize) {
    response.maxSize = {
      size: maxSize,
      id: maxSizePubEntry.id
    };
  }

  if (maxObservers) {
    response.maxObservers = {
      count: maxObservers,
      id: maxObserversPubEntry.id
    };
  }

  return response;
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"vent":{"Vent.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/cultofcoders_redis-oplog/lib/vent/Vent.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => Vent
});
let getRedisListener, getRedisPusher;
module.link("../redis/getRedisClient", {
  getRedisListener(v) {
    getRedisListener = v;
  },

  getRedisPusher(v) {
    getRedisPusher = v;
  }

}, 0);
let VentConstants;
module.link("../constants", {
  VentConstants(v) {
    VentConstants = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 3);
let Config;
module.link("../config", {
  default(v) {
    Config = v;
  }

}, 4);

class Vent {
  /**
   * @param name
   * @param fn
   * @returns {*|any|Observable}
   */
  static publish(name, fn) {
    // check initialization
    if (!Config.isInitialized) {
      throw new Meteor.Error('not-initialized', 'RedisOplog is not initialized at the time of defining this publish. Make sure you initialize it before');
    }

    if (_.isObject(name)) {
      _.each(name, (fn, _name) => {
        Vent.publish(_name, fn);
      });

      return;
    } // validate if everything is in order


    Vent._validateArguments(name, fn); // create the publication properly


    return Vent._createPublishEndPoint(name, fn);
  }
  /**
   * @param {string} channel
   * @param {object} object
   */


  static emit(channel, object) {
    const {
      pubSubManager
    } = Config;
    pubSubManager.publish(channel, object);
  }
  /**
   * Creates the publish endpoint
   *
   * @param name
   * @param fn
   * @returns {*|any|Observable}
   * @private
   */


  static _createPublishEndPoint(name, fn) {
    return Meteor.publish(name, function (collectionId, ...args) {
      Vent._extendPublishContext(this, name, collectionId);

      try {
        fn.call(this, ...args);
      } catch (e) {
        // we do this because the errors in here are silenced
        console.error(e);
        throw e;
      }

      this.ready();
    });
  }
  /**
   * @param context
   * @param name
   * @param collectionId
   * @private
   */


  static _extendPublishContext(context, name, collectionId) {
    const channelHandlers = [];
    const {
      pubSubManager
    } = Config;
    Object.assign(context, {
      on(channel, redisEventHandler) {
        // create the handler for this channel
        const handler = function (message) {
          const data = redisEventHandler.call(context, message);

          if (data) {
            context._session.send({
              msg: 'changed',
              [VentConstants.PREFIX]: '1',
              id: VentConstants.getPrefix(collectionId, name),
              [VentConstants.EVENT_VARIABLE]: data
            });
          }
        };

        channelHandlers.push({
          channel,
          handler
        });
        pubSubManager.subscribe(channel, handler);
      }

    });
    context.onStop(function () {
      channelHandlers.forEach(({
        channel,
        handler
      }) => {
        pubSubManager.unsubscribe(channel, handler);
      });
    });
  }
  /**
   * @param name
   * @param fn
   * @private
   */


  static _validateArguments(name, fn) {
    // validate arguments
    if (!_.isString(name)) {
      if (!_.isObject(name)) {
        throw new Meteor.Error('invalid-definition', 'Argument is invalid');
      }
    } else {
      if (!_.isFunction(fn)) {
        throw new Meteor.Error('invalid-definition', 'The second argument needs to be a function');
      }
    }
  }

}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"node_modules":{"lodash.clonedeep":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/lodash.clonedeep/package.json                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "lodash.clonedeep",
  "version": "4.5.0"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/lodash.clonedeep/index.js                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"object-sizeof":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/object-sizeof/package.json                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "object-sizeof",
  "version": "1.2.0",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/object-sizeof/index.js                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deep-diff":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/deep-diff/package.json                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "deep-diff",
  "version": "0.3.8",
  "main": "./index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/deep-diff/index.js                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"redis":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/redis/package.json                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "redis",
  "version": "2.8.0",
  "main": "./index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/redis/index.js                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"deep-extend":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/deep-extend/package.json                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "deep-extend",
  "version": "0.5.0",
  "main": "lib/deep-extend.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"deep-extend.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/cultofcoders_redis-oplog/node_modules/deep-extend/lib/deep-extend.js                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:redis-oplog/redis-oplog.js");

/* Exports */
Package._define("cultofcoders:redis-oplog", exports);

})();

//# sourceURL=meteor://💻app/packages/cultofcoders_redis-oplog.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL3JlZGlzLW9wbG9nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL2NvbmZpZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9jb25zdGFudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvZGVidWcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvaW5pdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9wdWJsaXNoV2l0aFJlZGlzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL2NhY2hlL09ic2VydmFibGVDb2xsZWN0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL2NhY2hlL1B1YmxpY2F0aW9uRW50cnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvY2FjaGUvUHVibGljYXRpb25GYWN0b3J5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL2NhY2hlL1B1YmxpY2F0aW9uU3RvcmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvY2FjaGUvbW9uZ29JZE1hcC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9jYWNoZS9saWIvZXh0cmFjdEZpZWxkc0Zyb21GaWx0ZXJzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL2NhY2hlL2xpYi9maWVsZFByb2plY3Rpb25Jc0V4Y2x1c2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9jYWNoZS9saWIvZ2V0Q2hhbm5lbHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vTXV0YXRvci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9tb25nby9TeW50aGV0aWNNdXRhdG9yLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL21vbmdvL2V4dGVuZE1vbmdvQ29sbGVjdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9tb25nby9leHRlbmRPYnNlcnZlQ2hhbmdlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9tb25nby9tb25nb0NvbGxlY3Rpb25OYW1lcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9tb25nby9hbGxvdy1kZW55L2RvY1RvVmFsaWRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vYWxsb3ctZGVueS90cmFuc2Zvcm1Eb2MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vYWxsb3ctZGVueS92YWxpZGF0ZWRJbnNlcnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vYWxsb3ctZGVueS92YWxpZGF0ZWRSZW1vdmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vYWxsb3ctZGVueS92YWxpZGF0ZWRVcGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvbW9uZ28vbGliL2NvbnRhaW5zT3BlcmF0b3JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL21vbmdvL2xpYi9kaXNwYXRjaGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9tb25nby9saWIvZ2V0TXV0YXRpb25Db25maWcuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcHJvY2Vzc29ycy9kZWZhdWx0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3Byb2Nlc3NvcnMvZGlyZWN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3Byb2Nlc3NvcnMvZ2V0U3RyYXRlZ3kuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcHJvY2Vzc29ycy9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9wcm9jZXNzb3JzL2xpbWl0LXNvcnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcHJvY2Vzc29ycy9zeW50aGV0aWMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcHJvY2Vzc29ycy9hY3Rpb25zL3JlbG9hZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9wcm9jZXNzb3JzL2FjdGlvbnMvcmVxdWVyeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9wcm9jZXNzb3JzL2xpYi9maWVsZHNFeGlzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9yZWRpcy9QdWJTdWJNYW5hZ2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3JlZGlzL1JlZGlzU3Vic2NyaWJlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi9yZWRpcy9SZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcmVkaXMvZ2V0UmVkaXNDbGllbnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvcmVkaXMvbGliL2dldEZpZWxkc09mSW50ZXJlc3RGcm9tQWxsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3V0aWxzL2V4dHJhY3RJZHNGcm9tU2VsZWN0b3IuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvdXRpbHMvZ2V0Q2hhbm5lbE5hbWUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvdXRpbHMvZ2V0RGVkaWNhdGVkQ2hhbm5lbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvY3VsdG9mY29kZXJzOnJlZGlzLW9wbG9nL2xpYi91dGlscy9nZXRGaWVsZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2N1bHRvZmNvZGVyczpyZWRpcy1vcGxvZy9saWIvdXRpbHMvc2hvdWxkUHVibGljYXRpb25CZVdpdGhQb2xsaW5nLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3V0aWxzL3N0YXRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9jdWx0b2Zjb2RlcnM6cmVkaXMtb3Bsb2cvbGliL3ZlbnQvVmVudC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJSZWRpc09wbG9nIiwiU3ludGhldGljTXV0YXRvciIsIk9ic2VydmFibGVDb2xsZWN0aW9uIiwiUmVkaXNQaXBlIiwiQ29uZmlnIiwiRXZlbnRzIiwiVmVudCIsInB1Ymxpc2hXaXRoUmVkaXMiLCJnZXRSZWRpc0xpc3RlbmVyIiwiZ2V0UmVkaXNQdXNoZXIiLCJQdWJsaWNhdGlvbkZhY3RvcnkiLCJsaW5rIiwiZGVmYXVsdCIsInYiLCJNZXRlb3IiLCJzdGF0cyIsImluaXQiLCJzdGFydHVwIiwiUGFja2FnZSIsImNvbnNvbGUiLCJsb2ciLCJwcm9jZXNzIiwiZW52IiwiUkVESVNfT1BMT0dfU0VUVElOR1MiLCJKU09OIiwicGFyc2UiLCJzZXR0aW5ncyIsInJlZGlzT3Bsb2ciLCJpc0luaXRpYWxpemVkIiwiZGVidWciLCJvdmVycmlkZVB1Ymxpc2hGdW5jdGlvbiIsIm11dGF0aW9uRGVmYXVsdHMiLCJwdXNoVG9SZWRpcyIsIm9wdGltaXN0aWMiLCJwYXNzQ29uZmlnRG93biIsInJlZGlzIiwicG9ydCIsImhvc3QiLCJnbG9iYWxSZWRpc1ByZWZpeCIsInJldHJ5SW50ZXJ2YWxNcyIsImV4dGVybmFsUmVkaXNQdWJsaXNoZXIiLCJyZWRpc0V4dHJhcyIsInJldHJ5X3N0cmF0ZWd5Iiwib3B0aW9ucyIsImV2ZW50cyIsImVuZCIsImVyciIsImVycm9yIiwic3RyaW5naWZ5IiwiY29ubmVjdCIsInJlY29ubmVjdGluZyIsImV4cG9ydERlZmF1bHQiLCJTdHJhdGVneSIsIlZlbnRDb25zdGFudHMiLCJFVkVOVCIsIkRPQyIsIkZJRUxEUyIsIk1PRElGSUVSIiwiRE9DVU1FTlRfSUQiLCJTWU5USEVUSUMiLCJVSUQiLCJNT0RJRklFRF9UT1BfTEVWRUxfRklFTERTIiwiSU5TRVJUIiwiVVBEQVRFIiwiUkVNT1ZFIiwiREVGQVVMVCIsIkRFRElDQVRFRF9DSEFOTkVMUyIsIkxJTUlUX1NPUlQiLCJJRCIsIkVWRU5UX1ZBUklBQkxFIiwiUFJFRklYIiwiZ2V0UHJlZml4IiwiaWQiLCJuYW1lIiwibWVzc2FnZSIsInRyYWNlIiwidGltZXN0YW1wIiwiRGF0ZSIsImdldFRpbWUiLCJleHRlbmRNb25nb0NvbGxlY3Rpb24iLCJSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIiLCJQdWJTdWJNYW5hZ2VyIiwiZGVlcEV4dGVuZCIsImNvbmZpZyIsIl8iLCJleHRlbmQiLCJvbGRQdWJsaXNoIiwicHVibGlzaCIsImJpbmQiLCJzZXJ2ZXIiLCJvbkNvbm5lY3QiLCJyZWxvYWRBbGwiLCJwdWJTdWJNYW5hZ2VyIiwic2hvdWxkUHVibGljYXRpb25CZVdpdGhQb2xsaW5nIiwiZm4iLCJvcHRzIiwiaXNPYmplY3QiLCJlYWNoIiwidmFsdWUiLCJrZXkiLCJhcmdzIiwiY3Vyc29ycyIsImNhbGwiLCJpc0FycmF5IiwiZWxpZ2libGVDdXJzb3JzIiwiZmlsdGVyIiwiY3Vyc29yIiwiX2N1cnNvckRlc2NyaXB0aW9uIiwibm9uRWxpZ2libGVDdXJzb3JzIiwicHVibGljYXRpb25FbnRyaWVzIiwicXVldWUiLCJydW5UYXNrIiwiZm9yRWFjaCIsInB1c2giLCJjcmVhdGUiLCJvblN0b3AiLCJwdWJsaWNhdGlvbkVudHJ5IiwicmVtb3ZlT2JzZXJ2ZXIiLCJyZWFkeSIsIkRpZmZTZXF1ZW5jZSIsIkxvY2FsQ29sbGVjdGlvbiIsIk1pbmltb25nbyIsImNsb25lRGVlcCIsImZpZWxkUHJvamVjdGlvbklzRXhjbHVzaW9uIiwiZ2V0Q2hhbm5lbHMiLCJleHRyYWN0RmllbGRzRnJvbUZpbHRlcnMiLCJNb25nb0lETWFwIiwiYWxsb3dlZE9wdGlvbnMiLCJNYXRjaGVyIiwiY29uc3RydWN0b3IiLCJvYnNlcnZlciIsInN0b3JlIiwiY3Vyc29yRGVzY3JpcHRpb24iLCJjb2xsZWN0aW9uTmFtZSIsImNvbGxlY3Rpb24iLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJfX2dldENvbGxlY3Rpb25CeU5hbWUiLCJzZWxlY3RvciIsImlzU3RyaW5nIiwiX2lkIiwicGljayIsIkVycm9yIiwiZmllbGRzIiwiaXNFbXB0eSIsImZpZWxkc0FycmF5Iiwia2V5cyIsInByb2plY3RGaWVsZHNPbkRvYyIsIl9jb21waWxlUHJvamVjdGlvbiIsImlzRmllbGRzUHJvamVjdGlvbkJ5RXhjbHVzaW9uIiwiY2hhbm5lbHMiLCJ0ZXN0RG9jRWxpZ2liaWxpdHkiLCJfY3JlYXRlVGVzdERvY0VsaWdpYmlsaXR5IiwiZmllbGRzT2ZJbnRlcmVzdCIsIl9nZXRGaWVsZHNPZkludGVyZXN0IiwiX19pc0luaXRpYWxpemVkIiwiaXNFbGlnaWJsZSIsImRvYyIsImlzRWxpZ2libGVCeURCIiwiZmluZE9uZSIsImRhdGEiLCJmZXRjaCIsInNldCIsImNvbnRhaW5zIiwiZG9jSWQiLCJoYXMiLCJzZW5kIiwiZXZlbnQiLCJhZGQiLCJzYWZlIiwiYWRkQnlJZCIsImNoYW5nZSIsIm1vZGlmaWVkRmllbGRzIiwib2xkRG9jIiwiZ2V0IiwibmV3RG9jIiwidHJhbnNmb3JtIiwiY2hhbmdlZFRvcExldmVsRmllbGRzIiwibWFrZUNoYW5nZWRGaWVsZHMiLCJjaGFuZ2VTeW50aGV0aWMiLCJtb2RpZmllciIsInRvcExldmVsRmllbGRzIiwic3RvcmVkRG9jIiwiX21vZGlmeSIsInRvcExldmVsRmllbGQiLCJyZW1vdmUiLCJwb3AiLCJjbGVhclN0b3JlIiwiY2xlYXIiLCJpc0xpbWl0UmVhY2hlZCIsImxpbWl0Iiwic2l6ZSIsInNlbGYiLCJsZW5ndGgiLCJtYXRjaGVyIiwib2JqZWN0IiwiZG9jdW1lbnRNYXRjaGVzIiwicmVzdWx0IiwiZSIsInRvU3RyaW5nIiwiaW5kZXhPZiIsInNsaWNlIiwidW5pb24iLCJQdWJsaWNhdGlvbkVudHJ5IiwiUmVkaXNTdWJzY3JpYmVyIiwiZ2V0U3RyYXRlZ3kiLCJERFAiLCJmYWN0b3J5Iiwib2JzZXJ2ZXJzIiwib2JzZXJ2YWJsZUNvbGxlY3Rpb24iLCJmYWN0cyIsIkZhY3RzIiwiaW5jcmVtZW50U2VydmVyRmFjdCIsInN0cmF0ZWd5Iiwib2MiLCJfX2NvbnRhaW5zT3RoZXJTZWxlY3RvcnNUaGFuSWQiLCJyZWRpc1N1YnNjcmliZXIiLCJzdG9wIiwiYWRkT2JzZXJ2ZXIiLCJhZGRlZCIsIl9wZXJmb3JtSW5pdGlhbEFkZEZvck9ic2VydmVyIiwid2l0aG91dCIsImlzT2JzZXJ2ZXJzRW1wdHkiLCJhY3Rpb24iLCJpbnZva2UiLCJfQ3VycmVudEludm9jYXRpb24iLCJjb25uZWN0aW9uIiwiY3VycmVudElkIiwiY3VycmVudE9ic2VydmVycyIsIm8iLCJkZWZlciIsIkVKU09OIiwiUHVibGljYXRpb25TdG9yZSIsInJlbG9hZCIsIl9TeW5jaHJvbm91c1F1ZXVlIiwiZGVzY3JpcHRpb24iLCJleHRlbmRDdXJzb3JXaXRoQ29sbGVjdGlvbkRlZmF1bHRzIiwiZ2V0UHVibGljYXRpb25JZCIsImZpbmQiLCJfZ2V0Q29sbGVjdGlvbk5hbWUiLCJvbWl0IiwiZW50cmllcyIsImdldEFsbCIsImVudHJ5IiwiY29udGV4dCIsIl9jdXJzb3IiLCJfcmVkaXNPcGxvZyIsInZhbHVlcyIsIk1vbmdvSUQiLCJpZFN0cmluZ2lmeSIsImlkUGFyc2UiLCJfaW50ZXJuYWwiLCJNYXAiLCJfaWRTdHJpbmdpZnkiLCJfaWRQYXJzZSIsInJldCIsImRlbGV0ZSIsInNldERlZmF1bHQiLCJkZWYiLCJlbXB0eSIsIkFycmF5IiwiZnJvbSIsIm1hcCIsIml0ZXJhdG9yIiwiY29tcGFyZVdpdGgiLCJvdGhlciIsImNhbGxiYWNrcyIsImxlZnRNYXAiLCJyaWdodE1hcCIsImxlZnRWYWx1ZSIsInJpZ2h0VmFsdWUiLCJib3RoIiwibGVmdE9ubHkiLCJyaWdodE9ubHkiLCJkZWVwRmlsdGVyRmllbGRzQXJyYXkiLCJkZWVwRmlsdGVyRmllbGRzT2JqZWN0IiwiZmlsdGVycyIsImZpbHRlckZpZWxkcyIsImZpZWxkIiwiZWxlbWVudCIsImdldENoYW5uZWxOYW1lIiwibmFtZXNwYWNlIiwiY2hhbm5lbCIsIm5hbWVzcGFjZXMiLCJjaGFubmVsU3RyaW5ncyIsIk11dGF0b3IiLCJnZXRNdXRhdGlvbkNvbmZpZyIsImdldEZpZWxkcyIsImRpc3BhdGNoSW5zZXJ0IiwiZGlzcGF0Y2hVcGRhdGUiLCJkaXNwYXRjaFJlbW92ZSIsInJ1bkNhbGxiYWNrSW5CYWNrZ3JvdW5kIiwiYmluZEVudmlyb25tZW50IiwidW5kZWZpbmVkIiwiaW5zZXJ0IiwiT3JpZ2luYWxzIiwiX2NvbmZpZyIsImNhblVzZU9yaWdpbmFsTWV0aG9kIiwiaXNGdW5jdGlvbiIsIl9uYW1lIiwiX2NoYW5uZWxzIiwidXBkYXRlIiwiY2FsbGJhY2siLCJmaW5kT3B0aW9ucyIsIm11bHRpIiwiZG9jSWRzIiwidXBzZXJ0IiwiX2hhbmRsZVVwc2VydCIsInVwZGF0ZVNlbGVjdG9yIiwiJGluIiwiX3JldHVybk9iamVjdCIsImluc2VydGVkSWQiLCJudW1iZXJBZmZlY3RlZCIsIndhcm4iLCJyZW1vdmVTZWxlY3RvciIsIm11dGF0aW9uQ29uZmlnIiwiUmFuZG9tIiwiY29udGFpbnNPcGVyYXRvcnMiLCJjbGllbnQiLCJfZXh0cmFjdENoYW5uZWxzIiwiZXh0ZW5kT2JzZXJ2ZUNoYW5nZXMiLCJfdmFsaWRhdGVkSW5zZXJ0IiwiX3ZhbGlkYXRlZFVwZGF0ZSIsIl92YWxpZGF0ZWRSZW1vdmUiLCJwcm90b3R5cGUiLCJjb25maWd1cmVSZWRpc09wbG9nIiwibXV0YXRpb24iLCJkaWZmIiwiZGlzYWJsZU9wbG9nIiwiT2JqZWN0IiwiYXNzaWduIiwib2JzZXJ2ZUNoYW5nZXMiLCJfb2JzZXJ2ZXIiLCJjcmVhdGVQdWJsaWNhdGlvbkVudHJ5IiwiY3JlYXRlT2JzZXJ2ZUNoYW5nZXMiLCJvYnNlcnZlIiwiY3JlYXRlT2JzZXJ2ZSIsInBlIiwiX211bHRpcGxleGVyIiwiX3NlbmRBZGRzIiwiZWYiLCJnZXRPYnNlcnZlckNvbm5lY3Rpb24iLCJjaGFuZ2VkIiwiY2hhbmdlZERpZmYiLCJkaWZmZXJlbmNlcyIsInJlbW92ZWQiLCJjdXJyZW50UHVibGlzaEludm9rZSIsIl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uIiwiZ2V0TmFtZSIsImJhc2UiLCJzdWIiLCJvcmlnUHJvdG8iLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJvbGQiLCJleHRlbnNpb24iLCJkb2NUb1ZhbGlkYXRlIiwidmFsaWRhdG9yIiwiZ2VuZXJhdGVkSWQiLCJjbG9uZSIsInRyYW5zZm9ybURvYyIsInZhbGlkYXRlZEluc2VydCIsInVzZXJJZCIsImFueSIsIl92YWxpZGF0b3JzIiwiZGVueSIsImFsbCIsImFsbG93IiwidmFsaWRhdGVkUmVtb3ZlIiwiZmV0Y2hBbGxGaWVsZHMiLCJmaWVsZE5hbWUiLCJfY29sbGVjdGlvbiIsInZhbGlkYXRlZFVwZGF0ZSIsImNoZWNrIiwiQUxMT1dFRF9VUERBVEVfT1BFUkFUSU9OUyIsIiRpbmMiLCIkc2V0IiwiJHVuc2V0IiwiJGFkZFRvU2V0IiwiJHBvcCIsIiRwdWxsQWxsIiwiJHB1bGwiLCIkcHVzaEFsbCIsIiRwdXNoIiwiJGJpdCIsIm11dGF0b3IiLCJfc2VsZWN0b3JJc0lkUGVyaGFwc0FzT2JqZWN0Iiwibm9SZXBsYWNlRXJyb3IiLCJwYXJhbXMiLCJvcCIsImNoYXJBdCIsInN1YnN0cmluZyIsImZhY3RvcmllZERvYyIsIl9mb3JiaWRSZXBsYWNlIiwic29tZSIsIm9wZXJhdG9yIiwidGVzdCIsIkREUFNlcnZlciIsImdldERlZGljYXRlZENoYW5uZWwiLCJnZXRXcml0ZUZlbmNlIiwiX0N1cnJlbnRXcml0ZUZlbmNlIiwiZGlzcGF0Y2hFdmVudHMiLCJmZW5jZSIsIndyaXRlIiwiYmVnaW5Xcml0ZSIsInF1ZXVlVGFzayIsImNoYW5uZWxOYW1lIiwiZGVkaWNhdGVkQ2hhbm5lbCIsImNvbW1pdHRlZCIsInVpZCIsIm11dGF0aW9uT2JqZWN0IiwiZGVmYXVsdE92ZXJyaWRlcyIsIl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbiIsImhhbmRsZUluc2VydCIsImhhbmRsZVVwZGF0ZSIsImhhbmRsZVJlbW92ZSIsIm90aGVyU2VsZWN0b3JzIiwic29ydCIsImdldFByb2Nlc3NvciIsImRlZmF1bHRTdHJhdGVneSIsImRpcmVjdFN0cmF0ZWd5IiwibGltaXRTb3J0U3RyYXRlZ3kiLCJTdHJhdGVneVByb2Nlc3Nvck1hcCIsImhhc1NvcnRGaWVsZHMiLCJyZXF1ZXJ5Iiwic2tpcCIsIm1vZGlmaWVkVG9wTGV2ZWxGaWVsZHMiLCJmcmVzaERhdGEiLCJuZXdTdG9yZSIsIm5ld0NvbW1lciIsImZyZXNoSWRzIiwiZXF1YWxzIiwiZmllbGRzT2JqZWN0IiwiZXhpc3RpbmdGaWVsZHMiLCJpIiwiaiIsImV4aXN0aW5nRmllbGQiLCJjaGFubmVsSGFuZGxlcnMiLCJsaXN0ZW5lciIsInB1c2hlciIsIl9pbml0TWVzc2FnZUxpc3RlbmVyIiwic3Vic2NyaWJlIiwiaGFuZGxlciIsIl9pbml0Q2hhbm5lbCIsInVuc3Vic2NyaWJlIiwiX2hhbmRsZXIiLCJfZGVzdHJveUNoYW5uZWwiLCJvbiIsIl9tZXNzYWdlIiwiY2hhbm5lbEhhbmRsZXIiLCJleHRyYWN0SWRzRnJvbVNlbGVjdG9yIiwic3ludGhldGljUHJvY2Vzc29yIiwicHJvY2Vzc29yIiwiYXR0YWNoIiwiaWRzIiwicHJvY2Vzc1N5bnRoZXRpYyIsImRldGFjaCIsImdldEZpZWxkc09mSW50ZXJlc3QiLCJnZXRGaWVsZHNPZkludGVyZXN0RnJvbUFsbCIsImluaXRpYWxpemVDaGFubmVsIiwiZGVzdHJveUNoYW5uZWwiLCJmcm9tUmVkaXMiLCJzdWJzY3JpYmVycyIsImlzU3ludGhldGljIiwiZ2V0RG9jIiwicmVkaXNQdXNoZXIiLCJyZWRpc0xpc3RlbmVyIiwiY3JlYXRlQ2xpZW50IiwiZ2V0UmV0cnlTdHJhdGVneSIsImF0dGFjaEV2ZW50cyIsImZ1bmN0aW9ucyIsInJlbW92ZUNoaWxkcmVuT2ZQYXJlbnRzIiwiYWxsRmllbGRzIiwic3Vic2NyaWJlciIsImFycmF5IiwiZnJlc2hBcnJheSIsImlkeGUiLCJmb3VuZFBhcmVudCIsInN1YmVsZW1lbnQiLCJpZHhzIiwiX3N0ciIsImJhc2VDaGFubmVsTmFtZSIsInNwZWNpZmljUG9zaXRpb25GaWVsZE1hdGNoIiwiZXhlYyIsImluZGV4Iiwic3BsaXQiLCJpc0Rpc2FibGVkT3Bsb2ciLCJpc09wbG9nRGlzYWJsZWQiLCJkaXNhYmxlZENvbmZpZ3MiLCJhbGxUaGVTYW1lIiwiZXZlcnkiLCJjIiwic2l6ZW9mIiwidG90YWxRdWVyaWVzIiwicmVkaXNDaGFubmVscyIsInRvdGFsU2l6ZSIsInRvdGFsT2JzZXJ2ZXJzIiwibWF4U2l6ZSIsIm1heFNpemVQdWJFbnRyeSIsIm1heE9ic2VydmVycyIsIm1heE9ic2VydmVyc1B1YkVudHJ5IiwicHViRW50cnkiLCJvYnNlcnZlcnNDb3VudCIsInJlc3BvbnNlIiwiY291bnQiLCJfdmFsaWRhdGVBcmd1bWVudHMiLCJfY3JlYXRlUHVibGlzaEVuZFBvaW50IiwiZW1pdCIsImNvbGxlY3Rpb25JZCIsIl9leHRlbmRQdWJsaXNoQ29udGV4dCIsInJlZGlzRXZlbnRIYW5kbGVyIiwiX3Nlc3Npb24iLCJtc2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxZQUFVLEVBQUMsTUFB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Q0FBQ3JVLE9BQWhCLENBQXdCLENBQUM7QUFBRTBLLGVBQUY7QUFBV2dLO0FBQVgsT0FBRCxLQUEwQjtBQUNoRDlWLHFCQUFhLENBQUNnVyxXQUFkLENBQTBCbEssT0FBMUIsRUFBbUNnSyxPQUFuQztBQUNELE9BRkQ7QUFHSCxLQUpEO0FBS0g7QUFFRDs7Ozs7OztBQUtBLFNBQU8rRCxrQkFBUCxDQUEwQmhiLElBQTFCLEVBQWdDcUIsRUFBaEMsRUFBb0M7QUFDaEM7QUFDQSxRQUFJLENBQUNWLENBQUMsQ0FBQ3VELFFBQUYsQ0FBV2xFLElBQVgsQ0FBTCxFQUF1QjtBQUNuQixVQUFJLENBQUNXLENBQUMsQ0FBQ1ksUUFBRixDQUFXdkIsSUFBWCxDQUFMLEVBQXVCO0FBQ25CLGNBQU0sSUFBSTNELE1BQU0sQ0FBQ2dJLEtBQVgsQ0FBaUIsb0JBQWpCLEVBQXVDLHFCQUF2QyxDQUFOO0FBQ0g7QUFFSixLQUxELE1BS087QUFDSCxVQUFJLENBQUMxRCxDQUFDLENBQUNzTixVQUFGLENBQWE1TSxFQUFiLENBQUwsRUFBdUI7QUFDbkIsY0FBTSxJQUFJaEYsTUFBTSxDQUFDZ0ksS0FBWCxDQUFpQixvQkFBakIsRUFBdUMsNENBQXZDLENBQU47QUFDSDtBQUNKO0FBQ0o7O0FBbkhxQixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9jdWx0b2Zjb2RlcnNfcmVkaXMtb3Bsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4vbGliL21vbmdvLy9tb25nb0NvbGxlY3Rpb25OYW1lcyc7XG5cbmltcG9ydCBwdWJsaXNoV2l0aFJlZGlzIGZyb20gJy4vbGliL3B1Ymxpc2hXaXRoUmVkaXMnO1xuaW1wb3J0IHsgUmVkaXNQaXBlLCBFdmVudHMgfSBmcm9tICcuL2xpYi9jb25zdGFudHMnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgc3RhdHMgZnJvbSAnLi9saWIvdXRpbHMvc3RhdHMnO1xuaW1wb3J0IGluaXQgZnJvbSAnLi9saWIvaW5pdCc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vbGliL2NvbmZpZyc7XG5pbXBvcnQgeyBnZXRSZWRpc0xpc3RlbmVyLCBnZXRSZWRpc1B1c2hlciB9IGZyb20gJy4vbGliL3JlZGlzL2dldFJlZGlzQ2xpZW50JztcbmltcG9ydCBTeW50aGV0aWNNdXRhdG9yIGZyb20gJy4vbGliL21vbmdvL1N5bnRoZXRpY011dGF0b3InO1xuaW1wb3J0IE9ic2VydmFibGVDb2xsZWN0aW9uIGZyb20gJy4vbGliL2NhY2hlL09ic2VydmFibGVDb2xsZWN0aW9uJztcbmltcG9ydCBWZW50IGZyb20gJy4vbGliL3ZlbnQvVmVudCc7XG5pbXBvcnQgUHVibGljYXRpb25GYWN0b3J5IGZyb20gJy4vbGliL2NhY2hlL1B1YmxpY2F0aW9uRmFjdG9yeSc7XG5cbmNvbnN0IFJlZGlzT3Bsb2cgPSB7XG4gICAgaW5pdCxcbiAgICBzdGF0c1xufTtcblxuLy8gV2FybmluZ3Ncbk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoUGFja2FnZVsnaW5zZWN1cmUnXSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIlJlZGlzT3Bsb2cgZG9lcyBub3Qgc3VwcG9ydCB0aGUgaW5zZWN1cmUgcGFja2FnZS5cIilcbiAgICB9XG59KTtcblxuZXhwb3J0IHtcbiAgICBSZWRpc09wbG9nLFxuICAgIFN5bnRoZXRpY011dGF0b3IsXG4gICAgT2JzZXJ2YWJsZUNvbGxlY3Rpb24sXG4gICAgUmVkaXNQaXBlLFxuICAgIENvbmZpZyxcbiAgICBFdmVudHMsXG4gICAgVmVudCxcbiAgICBwdWJsaXNoV2l0aFJlZGlzLFxuICAgIGdldFJlZGlzTGlzdGVuZXIsXG4gICAgZ2V0UmVkaXNQdXNoZXIsXG4gICAgUHVibGljYXRpb25GYWN0b3J5LFxufVxuXG5pZiAocHJvY2Vzcy5lbnYuUkVESVNfT1BMT0dfU0VUVElOR1MpIHtcbiAgICBpbml0KEpTT04ucGFyc2UocHJvY2Vzcy5lbnYuUkVESVNfT1BMT0dfU0VUVElOR1MpKTtcbn0gZWxzZSBpZiAoTWV0ZW9yLnNldHRpbmdzLnJlZGlzT3Bsb2cpIHtcbiAgICBpbml0KE1ldGVvci5zZXR0aW5ncy5yZWRpc09wbG9nKTtcbn0iLCIvKipcbiAqIEluLU1lbW9yeSBjb25maWd1cmF0aW9uIHN0b3JhZ2VcbiAqL1xubGV0IENvbmZpZyA9IHtcbiAgICBpc0luaXRpYWxpemVkOiBmYWxzZSxcbiAgICBkZWJ1ZzogZmFsc2UsXG4gICAgb3ZlcnJpZGVQdWJsaXNoRnVuY3Rpb246IHRydWUsXG4gICAgbXV0YXRpb25EZWZhdWx0czoge1xuICAgICAgICBwdXNoVG9SZWRpczogdHJ1ZSxcbiAgICAgICAgb3B0aW1pc3RpYzogdHJ1ZSxcbiAgICB9LFxuICAgIHBhc3NDb25maWdEb3duOiBmYWxzZSxcbiAgICByZWRpczoge1xuICAgICAgICBwb3J0OiA2Mzc5LFxuICAgICAgICBob3N0OiAnMTI3LjAuMC4xJ1xuICAgIH0sXG4gICAgZ2xvYmFsUmVkaXNQcmVmaXg6ICcnLFxuICAgIHJldHJ5SW50ZXJ2YWxNczogMTAwMDAsXG4gICAgZXh0ZXJuYWxSZWRpc1B1Ymxpc2hlcjogZmFsc2UsXG4gICAgcmVkaXNFeHRyYXM6IHtcbiAgICAgICAgcmV0cnlfc3RyYXRlZ3k6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHJldHVybiBDb25maWcucmV0cnlJbnRlcnZhbE1zO1xuICAgICAgICAgICAgLy8gcmVjb25uZWN0IGFmdGVyXG4gICAgICAgICAgICAvLyByZXR1cm4gTWF0aC5taW4ob3B0aW9ucy5hdHRlbXB0ICogMTAwLCAzMDAwMCk7XG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgZW5kKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlZGlzT3Bsb2cgLSBDb25uZWN0aW9uIHRvIHJlZGlzIGVuZGVkJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3IoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYFJlZGlzT3Bsb2cgLSBBbiBlcnJvciBvY2N1cmVkOiBcXG5gLFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnIpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb25uZWN0KGVycikge1xuICAgICAgICAgICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZGlzT3Bsb2cgLSBFc3RhYmxpc2hlZCBjb25uZWN0aW9uIHRvIHJlZGlzLidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZGlzT3Bsb2cgLSBUaGVyZSB3YXMgYW4gZXJyb3Igd2hlbiBjb25uZWN0aW5nIHRvIHJlZGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGVycilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVjb25uZWN0aW5nKGVycikge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICdSZWRpc09wbG9nIC0gVGhlcmUgd2FzIGFuIGVycm9yIHdoZW4gcmUtY29ubmVjdGluZyB0byByZWRpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnIpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQ29uZmlnO1xuIiwiY29uc3QgUmVkaXNQaXBlID0ge1xuICAgIEVWRU5UOiAnZScsXG4gICAgRE9DOiAnZCcsXG4gICAgRklFTERTOiAnZicsXG4gICAgTU9ESUZJRVI6ICdtJyxcbiAgICBET0NVTUVOVF9JRDogJ2lkJyxcbiAgICBTWU5USEVUSUM6ICdzJyxcbiAgICBVSUQ6ICd1JywgLy8gdGhpcyBpcyB0aGUgdW5pcXVlIGlkZW50aXR5IG9mIGEgY2hhbmdlIHJlcXVlc3RcbiAgICBNT0RJRklFRF9UT1BfTEVWRUxfRklFTERTOiAnbXQnXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWRpc1BpcGU7XG5cbmNvbnN0IEV2ZW50cyA9IHtcbiAgICBJTlNFUlQ6ICdpJyxcbiAgICBVUERBVEU6ICd1JyxcbiAgICBSRU1PVkU6ICdyJ1xufTtcblxuY29uc3QgU3RyYXRlZ3kgPSB7XG4gICAgREVGQVVMVDogJ0QnLFxuICAgIERFRElDQVRFRF9DSEFOTkVMUzogJ0RDJyxcbiAgICBMSU1JVF9TT1JUOiAnTFMnXG59O1xuXG5jb25zdCBWZW50Q29uc3RhbnRzID0ge1xuICAgIElEOiAnaScsXG4gICAgRVZFTlRfVkFSSUFCTEU6ICdlJyxcbiAgICBQUkVGSVg6ICdfX3ZlbnQnLFxuICAgIGdldFByZWZpeChpZCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gYCR7aWR9LiR7bmFtZX1gO1xuICAgIH1cbn07XG5cbmV4cG9ydCB7XG4gICAgRXZlbnRzLFxuICAgIFN0cmF0ZWd5LFxuICAgIFJlZGlzUGlwZSxcbiAgICBWZW50Q29uc3RhbnRzXG59O1xuIiwiaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IChtZXNzYWdlLCB0cmFjZSA9IGZhbHNlKSA9PiB7XG4gICAgaWYgKENvbmZpZy5kZWJ1Zykge1xuICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zb2xlLmxvZyhgWyR7dGltZXN0YW1wfV0gLSBgICsgbWVzc2FnZSk7XG5cbiAgICAgICAgaWYgKHRyYWNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0cmFjZSk7XG4gICAgICAgIH1cbiAgICB9XG59IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2x1aW4vaW9yZWRpcyNjb25uZWN0LXRvLXJlZGlzXG5pbXBvcnQgQ29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBleHRlbmRNb25nb0NvbGxlY3Rpb24gZnJvbSAnLi9tb25nby9leHRlbmRNb25nb0NvbGxlY3Rpb24nO1xuaW1wb3J0IFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlciBmcm9tICcuL3JlZGlzL1JlZGlzU3Vic2NyaXB0aW9uTWFuYWdlcic7XG5pbXBvcnQgcHVibGlzaFdpdGhSZWRpcyBmcm9tICcuL3B1Ymxpc2hXaXRoUmVkaXMnO1xuaW1wb3J0IFB1YlN1Yk1hbmFnZXIgZnJvbSAnLi9yZWRpcy9QdWJTdWJNYW5hZ2VyJztcbmltcG9ydCB7Z2V0UmVkaXNMaXN0ZW5lcn0gZnJvbSAnLi9yZWRpcy9nZXRSZWRpc0NsaWVudCc7XG5pbXBvcnQgUHVibGljYXRpb25GYWN0b3J5IGZyb20gJy4vY2FjaGUvUHVibGljYXRpb25GYWN0b3J5JztcbmltcG9ydCBkZWVwRXh0ZW5kIGZyb20gJ2RlZXAtZXh0ZW5kJztcblxubGV0IGlzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuZXhwb3J0IGRlZmF1bHQgKGNvbmZpZyA9IHt9KSA9PiB7XG4gICAgaWYgKGlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgdGhyb3cgJ1lvdSBjYW5ub3QgaW5pdGlhbGl6ZSBSZWRpc09wbG9nIHR3aWNlLic7XG4gICAgfVxuXG4gICAgaXNJbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBkZWVwRXh0ZW5kKENvbmZpZywgY29uZmlnKTtcblxuICAgIF8uZXh0ZW5kKENvbmZpZywge1xuICAgICAgICBpc0luaXRpYWxpemVkOiB0cnVlLFxuICAgICAgICBvbGRQdWJsaXNoOiBNZXRlb3IucHVibGlzaCxcbiAgICB9KTtcblxuICAgIGV4dGVuZE1vbmdvQ29sbGVjdGlvbigpO1xuXG4gICAgTWV0ZW9yLnB1Ymxpc2hXaXRoUmVkaXMgPSBwdWJsaXNoV2l0aFJlZGlzLmJpbmQoTWV0ZW9yKTtcblxuICAgIGlmIChDb25maWcub3ZlcnJpZGVQdWJsaXNoRnVuY3Rpb24pIHtcbiAgICAgICAgTWV0ZW9yLnB1Ymxpc2ggPSBNZXRlb3IucHVibGlzaFdpdGhSZWRpcztcbiAgICAgICAgTWV0ZW9yLnNlcnZlci5wdWJsaXNoID0gTWV0ZW9yLnB1Ymxpc2hXaXRoUmVkaXM7XG4gICAgfVxuXG4gICAgLy8gdGhpcyBpbml0aWFsaXplcyB0aGUgbGlzdGVuZXIgc2luZ2xldG9uIHdpdGggdGhlIHByb3BlciBvbkNvbm5lY3QgZnVuY3Rpb25hbGl0eVxuICAgIGdldFJlZGlzTGlzdGVuZXIoe1xuICAgICAgICBvbkNvbm5lY3QoKSB7XG4gICAgICAgICAgICAvLyB0aGlzIHdpbGwgYmUgZXhlY3V0ZWQgaW5pdGlhbGx5LCBidXQgc2luY2UgdGhlcmUgd29uJ3QgYmUgYW55IG9ic2VydmFibGUgY29sbGVjdGlvbnMsIG5vdGhpbmcgd2lsbCBoYXBwZW5cbiAgICAgICAgICAgIFB1YmxpY2F0aW9uRmFjdG9yeS5yZWxvYWRBbGwoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgUmVkaXNTdWJzY3JpcHRpb25NYW5hZ2VyLmluaXQoKTtcbiAgICBDb25maWcucHViU3ViTWFuYWdlciA9IG5ldyBQdWJTdWJNYW5hZ2VyKCk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgc2hvdWxkUHVibGljYXRpb25CZVdpdGhQb2xsaW5nIGZyb20gJy4vdXRpbHMvc2hvdWxkUHVibGljYXRpb25CZVdpdGhQb2xsaW5nJztcbmltcG9ydCBQdWJsaWNhdGlvbkZhY3RvcnkgZnJvbSAnLi9jYWNoZS9QdWJsaWNhdGlvbkZhY3RvcnknO1xuaW1wb3J0IGRlYnVnIGZyb20gJy4vZGVidWcnO1xuaW1wb3J0IENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5cbi8qXG5NZXRlb3IucHVibGlzaFdpdGhSZWRpcyhuYW1lLCBmdW5jdGlvbiAoKSB7XG4gLy8gcmV0dXJuIGN1cnNvciBvciBhcnJheSBvZiBjdXJzb3JzXG59KVxuKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHB1Ymxpc2hXaXRoUmVkaXMobmFtZSwgZm4sIG9wdHMgPSB7fSkge1xuICAgIGlmIChfLmlzT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgIHJldHVybiBfLmVhY2gobmFtZSwgKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHB1Ymxpc2hXaXRoUmVkaXMoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRlYnVnKCdbTWFpbl0gQ3JlYXRlZCBwdWJsaWNhdGlvbiB3aXRoIG5hbWU6ICcgKyBuYW1lKTtcblxuICAgIENvbmZpZy5vbGRQdWJsaXNoKFxuICAgICAgICBuYW1lLFxuICAgICAgICBmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICAgICAgICBkZWJ1ZygnW01haW5dIE5ldyBpbmNvbW1pbmcgc3Vic2NyaXB0aW9uIGZvciBwdWJsaWNhdGlvbjogJyArIG5hbWUpO1xuXG4gICAgICAgICAgICBsZXQgY3Vyc29ycyA9IGZuLmNhbGwodGhpcywgLi4uYXJncyk7XG4gICAgICAgICAgICBpZiAoIWN1cnNvcnMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghXy5pc0FycmF5KGN1cnNvcnMpKSB7XG4gICAgICAgICAgICAgICAgY3Vyc29ycyA9IFtjdXJzb3JzXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZWxpZ2libGVDdXJzb3JzID0gXy5maWx0ZXIoY3Vyc29ycywgY3Vyc29yID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3Vyc29yICYmICEhY3Vyc29yLl9jdXJzb3JEZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY29uc3Qgbm9uRWxpZ2libGVDdXJzb3JzID0gXy5maWx0ZXIoY3Vyc29ycywgY3Vyc29yID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWN1cnNvciB8fCAhY3Vyc29yLl9jdXJzb3JEZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2hvdWxkUHVibGljYXRpb25CZVdpdGhQb2xsaW5nKGN1cnNvcnMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnNvcnM7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBwdWJsaWNhdGlvbkVudHJpZXMgPSBbXTtcblxuICAgICAgICAgICAgUHVibGljYXRpb25GYWN0b3J5LnF1ZXVlLnJ1blRhc2soKCkgPT4ge1xuICAgICAgICAgICAgICAgIGVsaWdpYmxlQ3Vyc29ycy5mb3JFYWNoKGN1cnNvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRW50cmllcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgUHVibGljYXRpb25GYWN0b3J5LmNyZWF0ZShjdXJzb3IsIHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vblN0b3AoKCkgPT4ge1xuICAgICAgICAgICAgICAgIFB1YmxpY2F0aW9uRmFjdG9yeS5xdWV1ZS5ydW5UYXNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWcoXG4gICAgICAgICAgICAgICAgICAgICAgICAnW01haW5dIFN0b3BwaW5nIHRoZSBNZXRlb3Igc3Vic2NyaXB0aW9uIGZvciBwdWJsaWNhdGlvbjogJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBwdWJsaWNhdGlvbkVudHJpZXMuZm9yRWFjaChwdWJsaWNhdGlvbkVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRW50cnkucmVtb3ZlT2JzZXJ2ZXIodGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMucmVhZHkoKTtcblxuICAgICAgICAgICAgcmV0dXJuIG5vbkVsaWdpYmxlQ3Vyc29ycztcbiAgICAgICAgfSxcbiAgICAgICAgb3B0c1xuICAgICk7XG59XG4iLCJpbXBvcnQgeyBEaWZmU2VxdWVuY2UgfSBmcm9tICdtZXRlb3IvZGlmZi1zZXF1ZW5jZSc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgTG9jYWxDb2xsZWN0aW9uLCBNaW5pbW9uZ28gfSBmcm9tICdtZXRlb3IvbWluaW1vbmdvJztcbmltcG9ydCBjbG9uZURlZXAgZnJvbSAnbG9kYXNoLmNsb25lZGVlcCc7XG5pbXBvcnQgZmllbGRQcm9qZWN0aW9uSXNFeGNsdXNpb24gZnJvbSAnLi9saWIvZmllbGRQcm9qZWN0aW9uSXNFeGNsdXNpb24nO1xuaW1wb3J0IGdldENoYW5uZWxzIGZyb20gJy4vbGliL2dldENoYW5uZWxzJztcbmltcG9ydCBleHRyYWN0RmllbGRzRnJvbUZpbHRlcnMgZnJvbSAnLi9saWIvZXh0cmFjdEZpZWxkc0Zyb21GaWx0ZXJzJztcbmltcG9ydCB7IE1vbmdvSURNYXAgfSBmcm9tICcuL21vbmdvSWRNYXAnO1xuXG5jb25zdCBhbGxvd2VkT3B0aW9ucyA9IFtcbiAgICAnbGltaXQnLFxuICAgICdza2lwJyxcbiAgICAnc29ydCcsXG4gICAgJ2ZpZWxkcycsXG4gICAgJ2NoYW5uZWxzJyxcbiAgICAnY2hhbm5lbCcsXG4gICAgJ25hbWVzcGFjZScsXG4gICAgJ25hbWVzcGFjZXMnLFxuXTtcblxuY29uc3QgeyBNYXRjaGVyIH0gPSBNaW5pbW9uZ287XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ic2VydmFibGVDb2xsZWN0aW9uIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JzZXJ2ZXJcbiAgICAgKiBAcGFyYW0gY3Vyc29yXG4gICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9ic2VydmVyLCBjdXJzb3IsIGNvbmZpZyA9IHt9KSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgICAgICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLnN0b3JlID0gbmV3IE1vbmdvSURNYXAoKTtcblxuICAgICAgICBjb25zdCBjdXJzb3JEZXNjcmlwdGlvbiA9IGN1cnNvci5fY3Vyc29yRGVzY3JpcHRpb247XG5cbiAgICAgICAgaWYgKGN1cnNvckRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gY3Vyc29yRGVzY3JpcHRpb24uY29sbGVjdGlvbk5hbWU7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLl9fZ2V0Q29sbGVjdGlvbkJ5TmFtZShcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdG9yID0gY3Vyc29yRGVzY3JpcHRpb24uc2VsZWN0b3IgfHwge307XG5cbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKHRoaXMuc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IHsgX2lkOiB0aGlzLnNlbGVjdG9yIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zID0gXy5waWNrKFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3JEZXNjcmlwdGlvbi5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAuLi5hbGxvd2VkT3B0aW9uc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IGN1cnNvci5jb2xsZWN0aW9uLm5hbWU7XG4gICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLl9fZ2V0Q29sbGVjdGlvbkJ5TmFtZShcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RvciA9IHt9O1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuY29sbGVjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAnV2UgY291bGQgbm90IHByb3Blcmx5IGlkZW50aWZ5IHRoZSBjb2xsZWN0aW9uIGJ5IGl0cyBuYW1lOiAnICtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSArXG4gICAgICAgICAgICAgICAgICAgICcuIE1ha2Ugc3VyZSB5b3UgYWRkZWQgcmVkaXMtb3Bsb2cgcGFja2FnZSBiZWZvcmUgYW55IHBhY2thZ2UgdGhhdCBpbnN0YW50aWF0ZXMgYSBjb2xsZWN0aW9uLidcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgZW1wdHkgcHJvamVjdG9yIG9iamVjdCBhbmQgZGVsZXRlLlxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZpZWxkcyAmJiBfLmlzRW1wdHkodGhpcy5vcHRpb25zLmZpZWxkcykpIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9wdGlvbnMuZmllbGRzO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgICAgIHRoaXMuZmllbGRzQXJyYXkgPSBfLmtleXModGhpcy5vcHRpb25zLmZpZWxkcyk7XG5cbiAgICAgICAgICAgIGlmICghXy5pc0FycmF5KHRoaXMuZmllbGRzQXJyYXkpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICAgICAgJ1dlIGNvdWxkIG5vdCBwcm9wZXJseSBleHRyYWN0IGFueSBmaWVsZHMuIFwiZmllbGRzXCIgbXVzdCBiZSBhbiBvYmplY3QuIFRoaXMgd2FzIHByb3ZpZGVkOiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHRoaXMub3B0aW9ucy5maWVsZHMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5wcm9qZWN0RmllbGRzT25Eb2MgPSBMb2NhbENvbGxlY3Rpb24uX2NvbXBpbGVQcm9qZWN0aW9uKFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5maWVsZHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLmlzRmllbGRzUHJvamVjdGlvbkJ5RXhjbHVzaW9uID0gZmllbGRQcm9qZWN0aW9uSXNFeGNsdXNpb24oXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLmZpZWxkc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2hhbm5lbHMgPSBnZXRDaGFubmVscyh0aGlzLmNvbGxlY3Rpb25OYW1lLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICB0aGlzLnRlc3REb2NFbGlnaWJpbGl0eSA9IHRoaXMuX2NyZWF0ZVRlc3REb2NFbGlnaWJpbGl0eSgpO1xuICAgICAgICB0aGlzLmZpZWxkc09mSW50ZXJlc3QgPSB0aGlzLl9nZXRGaWVsZHNPZkludGVyZXN0KCk7XG4gICAgICAgIHRoaXMuX19pc0luaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gdGhhdCBjaGVja3Mgd2hldGhlciBvciBub3QgdGhlIGRvYyBtYXRjaGVzIG91ciBmaWx0ZXJzXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZG9jXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICovXG4gICAgaXNFbGlnaWJsZShkb2MpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdERvY0VsaWdpYmlsaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXN0RG9jRWxpZ2liaWxpdHkoZG9jKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBfaWRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc0VsaWdpYmxlQnlEQihfaWQpIHtcbiAgICAgICAgaWYgKHRoaXMudGVzdERvY0VsaWdpYmlsaXR5KSB7XG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLmNvbGxlY3Rpb24uZmluZE9uZShcbiAgICAgICAgICAgICAgICBfLmV4dGVuZCh7fSwgdGhpcy5zZWxlY3RvciwgeyBfaWQgfSksXG4gICAgICAgICAgICAgICAgeyBmaWVsZHM6IHsgX2lkOiAxIH0gfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIHRoZSBpbml0aWFsIHNlYXJjaCB0aGVuIHB1dHMgdGhlbSBpbnRvIHRoZSBzdG9yZS5cbiAgICAgKi9cbiAgICBpbml0KCkge1xuICAgICAgICBpZiAodGhpcy5fX2lzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gc2lsZW50bHkgZG8gbm90aGluZy5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX19pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgbGV0IGRhdGEgPSB0aGlzLmN1cnNvci5mZXRjaCgpO1xuXG4gICAgICAgIGRhdGEuZm9yRWFjaChkb2MgPT4ge1xuICAgICAgICAgICAgdGhpcy5zdG9yZS5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGRvY0lkXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgY29udGFpbnMoZG9jSWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmUuaGFzKGRvY0lkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyB0aGUgZGF0YSB0aHJvdWdoIEREUFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50XG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKi9cbiAgICBzZW5kKGV2ZW50LCAuLi5hcmdzKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIuc2VuZChldmVudCwgdGhpcy5jb2xsZWN0aW9uTmFtZSwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGRvYyB7T2JqZWN0fVxuICAgICAqIEBwYXJhbSBzYWZlIHtCb29sZWFufSBJZiB0aGlzIGlzIHNldCB0byB0cnVlLCBpdCBhc3N1bWVzIHRoYXQgdGhlIG9iamVjdCBpcyBjbGVhbmVkXG4gICAgICovXG4gICAgYWRkKGRvYywgc2FmZSA9IGZhbHNlKSB7XG4gICAgICAgIGRvYyA9IGNsb25lRGVlcChkb2MpO1xuXG4gICAgICAgIGlmICghc2FmZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmllbGRzQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBkb2MgPSB0aGlzLnByb2plY3RGaWVsZHNPbkRvYyhkb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdG9yZS5zZXQoZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgdGhpcy5zZW5kKCdhZGRlZCcsIGRvYy5faWQsIGRvYyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2UgdXNlIHRoaXMgbWV0aG9kIHdoZW4gd2UgcmVjZWl2ZSB1cGRhdGVzIGZvciBhIGRvY3VtZW50IHRoYXQgaXMgbm90IHlldCBpbiB0aGUgb2JzZXJ2YWJsZSBjb2xsZWN0aW9uIHN0b3JlXG4gICAgICogQHBhcmFtIGRvY0lkXG4gICAgICovXG4gICAgYWRkQnlJZChkb2NJZCkge1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZSh7IF9pZDogZG9jSWQgfSwgdGhpcy5vcHRpb25zKTtcblxuICAgICAgICB0aGlzLnN0b3JlLnNldChkb2NJZCwgZG9jKTtcblxuICAgICAgICBpZiAoZG9jKSB7XG4gICAgICAgICAgICB0aGlzLnNlbmQoJ2FkZGVkJywgZG9jLl9pZCwgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIG92ZXIgdGhlIHdpcmUgb25seSB0aGUgdG9wIGZpZWxkcyBvZiBjaGFuZ2VzLCBiZWNhdXNlIEREUCBjbGllbnQgZG9lc250IGRvIGRlZXAgbWVyZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZG9jXG4gICAgICogQHBhcmFtIHthcnJheX0gbW9kaWZpZWRGaWVsZHNcbiAgICAgKi9cbiAgICBjaGFuZ2UoZG9jLCBtb2RpZmllZEZpZWxkcykge1xuICAgICAgICBjb25zdCBkb2NJZCA9IGRvYy5faWQ7XG4gICAgICAgIGNvbnN0IG9sZERvYyA9IHRoaXMuc3RvcmUuZ2V0KGRvY0lkKTtcbiAgICAgICAgaWYgKG9sZERvYyA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG5ld0RvYyA9IGNsb25lRGVlcChkb2MpO1xuICAgICAgICBpZiAodGhpcy5maWVsZHNBcnJheSkge1xuICAgICAgICAgICAgbmV3RG9jID0gdGhpcy5wcm9qZWN0RmllbGRzT25Eb2MobmV3RG9jKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgICAgICAgbmV3RG9jID0gdGhpcy5vcHRpb25zLnRyYW5zZm9ybShuZXdEb2MpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RvcmUuc2V0KGRvY0lkLCBuZXdEb2MpO1xuICAgICAgICBjb25zdCBjaGFuZ2VkVG9wTGV2ZWxGaWVsZHMgPSBEaWZmU2VxdWVuY2UubWFrZUNoYW5nZWRGaWVsZHMobmV3RG9jLCBvbGREb2MpO1xuICAgICAgICBpZiAoIV8uaXNFbXB0eShjaGFuZ2VkVG9wTGV2ZWxGaWVsZHMpKSB7XG4gICAgICAgICAgICB0aGlzLnNlbmQoJ2NoYW5nZWQnLCBkb2NJZCwgY2hhbmdlZFRvcExldmVsRmllbGRzLCBuZXdEb2MsIG9sZERvYylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkb2NJZCBzdHJpbmdcbiAgICAgKiBAcGFyYW0gbW9kaWZpZXIgb2JqZWN0XG4gICAgICogQHBhcmFtIHRvcExldmVsRmllbGRzIGFycmF5XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjaGFuZ2VTeW50aGV0aWMoZG9jSWQsIG1vZGlmaWVyLCB0b3BMZXZlbEZpZWxkcykge1xuICAgICAgICBpZiAoIXRoaXMuc3RvcmUuaGFzKGRvY0lkKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHN0b3JlZERvYyA9IHRoaXMuc3RvcmUuZ2V0KGRvY0lkKTtcbiAgICAgICAgbGV0IG9sZERvYyA9IGNsb25lRGVlcChzdG9yZWREb2MpO1xuXG4gICAgICAgIExvY2FsQ29sbGVjdGlvbi5fbW9kaWZ5KHN0b3JlZERvYywgbW9kaWZpZXIpO1xuICAgICAgICBsZXQgY2hhbmdlZFRvcExldmVsRmllbGRzID0ge307XG5cbiAgICAgICAgdG9wTGV2ZWxGaWVsZHMuZm9yRWFjaCh0b3BMZXZlbEZpZWxkID0+IHtcbiAgICAgICAgICAgIGNoYW5nZWRUb3BMZXZlbEZpZWxkc1t0b3BMZXZlbEZpZWxkXSA9IHN0b3JlZERvY1t0b3BMZXZlbEZpZWxkXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZW5kKCdjaGFuZ2VkJywgZG9jSWQsIGNoYW5nZWRUb3BMZXZlbEZpZWxkcywgc3RvcmVkRG9jLCBvbGREb2MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBkb2NJZFxuICAgICAqL1xuICAgIHJlbW92ZShkb2NJZCkge1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLnN0b3JlLnBvcChkb2NJZCk7XG4gICAgICAgIGlmIChkb2MgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5zZW5kKCdyZW1vdmVkJywgZG9jSWQsIGRvYyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbGVhcnMgdGhlIHN0b3JlXG4gICAgICovXG4gICAgY2xlYXJTdG9yZSgpIHtcbiAgICAgICAgdGhpcy5zdG9yZS5jbGVhcigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgd2hldGhlciB0aGUgbGltaXQgb2YgYWxsb3dlZCBkb2N1bWVudHMgaXMgcmVhY2hlZFxuICAgICAqIGJhc2VkIG9uIHRoZSBzZWxlY3RvciBvcHRpb25zXG4gICAgICovXG4gICAgaXNMaW1pdFJlYWNoZWQoKSB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGltaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnN0b3JlLnNpemUoKTtcbiAgICAgICAgICAgIHJldHVybiBzaXplID49IHRoaXMub3B0aW9ucy5saW1pdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGF0IGluaXRpYWxpemF0aW9uXG4gICAgICpcbiAgICAgKiBDcmVhdGVzIHRoZSBmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGUgZG9jdW1lbnQgaXMgdmFsaWRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtudWxsfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NyZWF0ZVRlc3REb2NFbGlnaWJpbGl0eSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKF8ua2V5cyh0aGlzLnNlbGVjdG9yKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2hlciA9IG5ldyBNYXRjaGVyKHRoaXMuc2VsZWN0b3IpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoZXIuZG9jdW1lbnRNYXRjaGVzKG9iamVjdCkucmVzdWx0O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGxvZ2ljIGhlcmUgaXMgdGhhdCBpZiBvdXIgbWF0Y2hlciBpcyB0b28gY29tcGxleCBmb3IgbWluaW1vbmdvXG4gICAgICAgICAgICAgICAgLy8gV2UgcHV0IG91ciBtYXRjaGluZyBmdW5jdGlvbiB0byBxdWVyeSBkYlxuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgZS50b1N0cmluZygpLmluZGV4T2YoJ1VucmVjb2duaXplZCBsb2dpY2FsIG9wZXJhdG9yJykgPj0gMFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuaXNFbGlnaWJsZUJ5REIob2JqZWN0Ll9pZCk7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBVc2VkIGF0IGluaXRpYWxpemF0aW9uXG4gICAgICpcbiAgICAgKiBDcmVhdGVzIGFuZCBzdG9yZXMgdGhlIGZpZWxkcyBzcGVjaWZpZWQgaW4gZmllbGRzICYgZmlsdGVyc1xuICAgICAqIElmIGJ5IGFueSBjaGFuY2UgdGhlcmUgYXJlIG5vIGZpZWxkcyBzcGVjaWZpZWQsIHdlIHJldHVybiB0cnVlXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEByZXR1cm4ge3RydWV8b2JqZWN0fVxuICAgICAqL1xuICAgIF9nZXRGaWVsZHNPZkludGVyZXN0KCkge1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5maWVsZHMpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgeW91IGhhdmUgc29tZSBmaWVsZHMgZXhjbHVkZWQgKGhpZ2ggY2hhbmNlcyB5b3UgZG9uJ3QsIGJ1dCB3ZSBxdWVyeSBmb3IgYWxsIGZpZWxkcyBlaXRoZXIgd2F5KVxuICAgICAgICAvLyBiZWNhdXNlIGl0IGNhbiBnZXQgdmVyeSB0cmlja3kgd2l0aCBmdXR1cmUgc3Vic2NyaWJlcnMgdGhhdCBtYXkgbmVlZCBzb21lIGZpZWxkc1xuICAgICAgICBpZiAodGhpcy5pc0ZpZWxkc1Byb2plY3Rpb25CeUV4Y2x1c2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB3ZSBoYXZlIG9wdGlvbnMsIHdlIHN1cmVseSBoYXZlIGZpZWxkcyBhcnJheVxuICAgICAgICBsZXQgZmllbGRzQXJyYXkgPSB0aGlzLmZpZWxkc0FycmF5LnNsaWNlKCk7XG4gICAgICAgIGlmIChfLmtleXModGhpcy5zZWxlY3RvcikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZmllbGRzQXJyYXkgPSBfLnVuaW9uKFxuICAgICAgICAgICAgICAgIGZpZWxkc0FycmF5LFxuICAgICAgICAgICAgICAgIGV4dHJhY3RGaWVsZHNGcm9tRmlsdGVycyh0aGlzLnNlbGVjdG9yKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmaWVsZHNBcnJheTtcbiAgICB9XG59XG4iLCJpbXBvcnQgT2JzZXJ2YWJsZUNvbGxlY3Rpb24gZnJvbSAnLi9PYnNlcnZhYmxlQ29sbGVjdGlvbic7XG5pbXBvcnQgUmVkaXNTdWJzY3JpYmVyIGZyb20gJy4uL3JlZGlzL1JlZGlzU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgZGVidWcgZnJvbSAnLi4vZGVidWcnO1xuaW1wb3J0IHsgZ2V0U3RyYXRlZ3kgfSBmcm9tICcuLi9wcm9jZXNzb3JzJztcbmltcG9ydCB7IEREUCB9IGZyb20gJ21ldGVvci9kZHAtY2xpZW50JztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1YmxpY2F0aW9uRW50cnkge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBjdXJzb3IsIGZhY3RvcnkpIHtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmZhY3RvcnkgPSBmYWN0b3J5O1xuICAgICAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHZhciB7T2JzZXJ2YWJsZUNvbGxlY3Rpb259XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uID0gbmV3IE9ic2VydmFibGVDb2xsZWN0aW9uKHRoaXMsIGN1cnNvcik7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgc3Vic2NyaXB0aW9ucyBhbmQgdGhlIGNsaWVudCBpbWFnZSBvbiB0aGUgc2VydmVyXG4gICAgICovXG4gICAgaW5pdCgpIHtcbiAgICAgICAgUGFja2FnZS5mYWN0cyAmJlxuICAgICAgICAgICAgUGFja2FnZS5mYWN0cy5GYWN0cy5pbmNyZW1lbnRTZXJ2ZXJGYWN0KFxuICAgICAgICAgICAgICAgICdtb25nby1saXZlZGF0YScsXG4gICAgICAgICAgICAgICAgJ29ic2VydmUtbXVsdGlwbGV4ZXJzJyxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHN0cmF0ZWd5ID0gZ2V0U3RyYXRlZ3koXG4gICAgICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLnNlbGVjdG9yLFxuICAgICAgICAgICAgdGhpcy5vYnNlcnZhYmxlQ29sbGVjdGlvbi5vcHRpb25zXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gV2UgZG8gdGhpcyBiZWNhdXNlIGlmIHdlIGhhdmUgZGVkaWNhdGVkIGNoYW5uZWxzLCB3ZSBtYXkgbm90IG5lZWQgdG8gaW50ZXJvZ2F0ZSB0aGUgZGIgZm9yIGVsaWdpYmlsaXR5XG4gICAgICAgIGlmIChzdHJhdGVneSA9PT0gU3RyYXRlZ3kuREVESUNBVEVEX0NIQU5ORUxTKSB7XG4gICAgICAgICAgICBsZXQgb2MgPSB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uO1xuICAgICAgICAgICAgaWYgKG9jLnNlbGVjdG9yLl9pZCkge1xuICAgICAgICAgICAgICAgIG9jLl9fY29udGFpbnNPdGhlclNlbGVjdG9yc1RoYW5JZCA9XG4gICAgICAgICAgICAgICAgICAgIF8ua2V5cyhvYy5zZWxlY3RvcikubGVuZ3RoID4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmVkaXNTdWJzY3JpYmVyID0gbmV3IFJlZGlzU3Vic2NyaWJlcih0aGlzLCBzdHJhdGVneSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlciBmb3Igc3RvcHBpbmcgdGhlIHN1YnNjcmlwdGlvblxuICAgICAqL1xuICAgIHN0b3AoKSB7XG4gICAgICAgIFBhY2thZ2UuZmFjdHMgJiZcbiAgICAgICAgICAgIFBhY2thZ2UuZmFjdHMuRmFjdHMuaW5jcmVtZW50U2VydmVyRmFjdChcbiAgICAgICAgICAgICAgICAnbW9uZ28tbGl2ZWRhdGEnLFxuICAgICAgICAgICAgICAgICdvYnNlcnZlLW11bHRpcGxleGVycycsXG4gICAgICAgICAgICAgICAgLTFcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5yZWRpc1N1YnNjcmliZXIuc3RvcCgpO1xuICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLmNsZWFyU3RvcmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JzZXJ2ZXJcbiAgICAgKi9cbiAgICBhZGRPYnNlcnZlcihvYnNlcnZlcikge1xuICAgICAgICBQYWNrYWdlLmZhY3RzICYmXG4gICAgICAgICAgICBQYWNrYWdlLmZhY3RzLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICAgICAgICAgICAgJ21vbmdvLWxpdmVkYXRhJyxcbiAgICAgICAgICAgICAgICAnb2JzZXJ2ZS1oYW5kbGVzJyxcbiAgICAgICAgICAgICAgICAxXG4gICAgICAgICAgICApO1xuXG4gICAgICAgIGlmIChvYnNlcnZlci5hZGRlZCkge1xuICAgICAgICAgICAgdGhpcy5fcGVyZm9ybUluaXRpYWxBZGRGb3JPYnNlcnZlcihvYnNlcnZlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gb2JzZXJ2ZXJcbiAgICAgKi9cbiAgICByZW1vdmVPYnNlcnZlcihvYnNlcnZlcikge1xuICAgICAgICBQYWNrYWdlLmZhY3RzICYmXG4gICAgICAgICAgICBQYWNrYWdlLmZhY3RzLkZhY3RzLmluY3JlbWVudFNlcnZlckZhY3QoXG4gICAgICAgICAgICAgICAgJ21vbmdvLWxpdmVkYXRhJyxcbiAgICAgICAgICAgICAgICAnb2JzZXJ2ZS1oYW5kbGVzJyxcbiAgICAgICAgICAgICAgICAtMVxuICAgICAgICAgICAgKTtcblxuICAgICAgICB0aGlzLm9ic2VydmVycyA9IF8ud2l0aG91dCh0aGlzLm9ic2VydmVycywgb2JzZXJ2ZXIpO1xuXG4gICAgICAgIGlmICh0aGlzLmlzT2JzZXJ2ZXJzRW1wdHkoKSkge1xuICAgICAgICAgICAgZGVidWcoXG4gICAgICAgICAgICAgICAgYFtQdWJsaWNhdGlvbkVudHJ5XSBObyBvdGhlciBvYnNlcnZlcnMgZm9yOiAke1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlkXG4gICAgICAgICAgICAgICAgfS4gU3RvcHBpbmcgc3Vic2NyaXB0aW9uIHRvIHJlZGlzLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgICAgICAgIHRoaXMuZmFjdG9yeS5yZW1vdmUodGhpcy5pZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBpc09ic2VydmVyc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZlcnMubGVuZ3RoID09PSAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBhY3Rpb25cbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqL1xuICAgIHNlbmQoYWN0aW9uLCAuLi5hcmdzKSB7XG4gICAgICAgIC8vIFRoZSBpZGVhIGhlcmUgaXMgdGhhdCBpZiB5b3UgYXJlIGRvaW5nIGFuIG9wdGltaXN0aWMtdWkgbXV0YXRpb24gZnJvbSBhIG1ldGhvZFxuICAgICAgICAvLyBCZWZvcmUgdGhlIG1ldGhvZCByZXR1cm5zLCBpdCBzaG91bGQgd3JpdGUgdG8gdGhlIEREUCdzIGZlbmNlIHRoZSBjaGFuZ2VzXG4gICAgICAgIC8vIG90aGVyd2lzZSB3aXRoIGFuIG9wdGltaXN0aWMgdWkgeW91IHdpbGwgZ2V0IGEgZmxpY2tlciAoaW5zZXJ0IGNsaWVudCBzaWRlLCByZXNwb25zZSBmcm9tIG1ldGhvZCA9PiByZW1vdmVkLCBpbnNlcnQgYWdhaW4gZnJvbSByZWRpcyBsYXRlcilcbiAgICAgICAgLy8gU28gd2Ugd2lsbCBzZW5kIGFkZGVkIGV2ZW50cyBpbiBzeW5jIGZvciB0aGUgY3VycmVudCBvYnNlcnZlciwgdGhlbiBkZWZlciB0aGUgcmVzdFxuICAgICAgICAvLyBXZSBzaG91bGQgbm90IHdvcnJ5IGFib3V0IGR1cGxpY2F0ZXMgYmVjYXVzZSB3aGVuIHdlIHNlbmQgYSBsYXRlbmN5IGNvbXBlbnNhdGVkIGV2ZW50XG4gICAgICAgIC8vIFdlIGdpdmUgaXQgYSByYW5kb20gdXVpZCwgYW5kIGlmIHRoZSBsaXN0ZW5lciBvZiByZWRpcyBvbiB0aGlzIHNlcnZlciBnZXRzIGEgbWVzc2FnZSB3aXRoIHRoZSBsYXN0IHV1aWQsIGl0IHdpbGwgbm90IHByb2Nlc3MgaXRcbiAgICAgICAgLy8gSWYgaXQncyBkaWZmZXJlbnQsIGFuZCBpdCBjYW4gc3RpbGwgaGFwcGVuLCBpdCB3aWxsIHByb2Nlc3MgaXQgYWdhaW4sIGNoYW5nZXMgYXJlIHZlcnkgc21hbGwuXG4gICAgICAgIGNvbnN0IGludm9rZSA9IEREUC5fQ3VycmVudEludm9jYXRpb24uZ2V0KCk7XG5cbiAgICAgICAgaWYgKGludm9rZSAmJiBpbnZva2UuY29ubmVjdGlvbiAmJiBpbnZva2UuY29ubmVjdGlvbi5pZCkge1xuICAgICAgICAgICAgLy8gd2Ugc2VuZCBmaXJzdCB0byBhbGwgd2F0Y2hlcnMgZm9yIGludm9rZS5jb25uZWN0aW9uLmlkXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50SWQgPSBpbnZva2UuY29ubmVjdGlvbi5pZDtcblxuICAgICAgICAgICAgY29uc3QgY3VycmVudE9ic2VydmVycyA9IF8uZmlsdGVyKHRoaXMub2JzZXJ2ZXJzLCBvID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gby5jb25uZWN0aW9uICYmIG8uY29ubmVjdGlvbi5pZCA9PSBjdXJyZW50SWQ7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGN1cnJlbnRPYnNlcnZlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudE9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXJbYWN0aW9uXS5jYWxsKG9ic2VydmVyLCAuLi5hcmdzKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGVmZXIgdGhlIHJlc3Qgc28gdGhhdCB0aGUgbWV0aG9kIHlpZWxkcyBxdWlja2x5IHRvIHRoZSB1c2VyLCBiZWNhdXNlIHdlIGhhdmUgYXBwbGllZCBpdCdzIGNoYW5nZXMuXG4gICAgICAgICAgICBNZXRlb3IuZGVmZXIoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAhb2JzZXJ2ZXIuY29ubmVjdGlvbiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY29ubmVjdGlvbi5pZCAhPSBjdXJyZW50SWRcbiAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZlclthY3Rpb25dLmNhbGwob2JzZXJ2ZXIsIC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyW2FjdGlvbl0uY2FsbChvYnNlcnZlciwgLi4uYXJncyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBmaXJzdCBiYXRjaCBvZiBkb2N1bWVudHMgdGhhdCBuZWVkIHRvIGJlIGFkZGVkLlxuICAgICAqIEBwYXJhbSBvYnNlcnZlclxuICAgICAqL1xuICAgIF9wZXJmb3JtSW5pdGlhbEFkZEZvck9ic2VydmVyKG9ic2VydmVyKSB7XG4gICAgICAgIGRlYnVnKCdbUHVibGljYXRpb25FbnRyeV0gUGVyZm9ybWluZyBpbml0aWFsIGFkZCBmb3Igb2JzZXJ2ZXInKTtcblxuICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLmluaXQoKTtcblxuICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLnN0b3JlLmZvckVhY2goKGRvYywgX2lkKSA9PiB7XG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBlcnJvciBpZiBkb2N1bWVudCB3YXMgcmVtb3ZlZCB3aGlsZSB0aGUgXy5lYWNoIGlzIHJ1bm5pbmdcbiAgICAgICAgICAgIGlmICghZG9jKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb2JzZXJ2ZXIuYWRkZWQuY2FsbChcbiAgICAgICAgICAgICAgICBvYnNlcnZlcixcbiAgICAgICAgICAgICAgICB0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLmNvbGxlY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgIF9pZCxcbiAgICAgICAgICAgICAgICBkb2NcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlYnVnKCdbUHVibGljYXRpb25FbnRyeV0gQ29tcGxldGVkIGluaXRpYWwgYWRkIGZvciBvYnNlcnZlcicpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEVKU09OIH0gZnJvbSAnbWV0ZW9yL2Vqc29uJztcbmltcG9ydCBQdWJsaWNhdGlvblN0b3JlIGZyb20gJy4vUHVibGljYXRpb25TdG9yZSc7XG5pbXBvcnQgUHVibGljYXRpb25FbnRyeSBmcm9tICcuL1B1YmxpY2F0aW9uRW50cnknO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCByZWxvYWQgZnJvbSAnLi4vcHJvY2Vzc29ycy9hY3Rpb25zL3JlbG9hZCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnLi4vZGVidWcnO1xuXG5leHBvcnQgZGVmYXVsdCBuZXcgY2xhc3MgUHVibGljYXRpb25GYWN0b3J5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IG5ldyBQdWJsaWNhdGlvblN0b3JlKCk7XG4gICAgICAgIHRoaXMucXVldWUgPSBuZXcgTWV0ZW9yLl9TeW5jaHJvbm91c1F1ZXVlKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUG90ZW50aWFsbHkgY3JlYXRlcyBhIG5ldyBwdWJsaWNhdGlvbkVudHJ5IGFuZCByZXR1cm5zIHRoZSBpZFxuICAgICAqXG4gICAgICogQHBhcmFtIGN1cnNvclxuICAgICAqIEBwYXJhbSBvYnNlcnZlclxuICAgICAqIEByZXR1cm5zIHtQdWJsaWNhdGlvbkVudHJ5fVxuICAgICAqL1xuICAgIGNyZWF0ZShjdXJzb3IsIG9ic2VydmVyKSB7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IGN1cnNvci5fY3Vyc29yRGVzY3JpcHRpb247XG5cbiAgICAgICAgaWYgKCFkZXNjcmlwdGlvbi5zZWxlY3Rvcikge1xuICAgICAgICAgICAgZGVzY3JpcHRpb24uc2VsZWN0b3IgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWRlc2NyaXB0aW9uLm9wdGlvbnMpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXh0ZW5kQ3Vyc29yV2l0aENvbGxlY3Rpb25EZWZhdWx0cyhvYnNlcnZlciwgY3Vyc29yKTtcblxuICAgICAgICBsZXQgaWQgPSB0aGlzLmdldFB1YmxpY2F0aW9uSWQoY3Vyc29yKTtcbiAgICAgICAgbGV0IHB1YmxpY2F0aW9uRW50cnk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3RvcmUuaGFzKGlkKSkge1xuICAgICAgICAgICAgcHVibGljYXRpb25FbnRyeSA9IHRoaXMuc3RvcmUuZmluZChpZCk7XG4gICAgICAgICAgICBkZWJ1ZyhcbiAgICAgICAgICAgICAgICBgW1B1YmxpY2F0aW9uRmFjdG9yeV0gUmUtdXNpbmcgZXhpc3RpbmcgcHVibGljYXRpb24gJHtcbiAgICAgICAgICAgICAgICAgICAgcHVibGljYXRpb25FbnRyeS5pZFxuICAgICAgICAgICAgICAgIH1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHVibGljYXRpb25FbnRyeSA9IG5ldyBQdWJsaWNhdGlvbkVudHJ5KGlkLCBjdXJzb3IsIHRoaXMpO1xuICAgICAgICAgICAgZGVidWcoXG4gICAgICAgICAgICAgICAgYFtQdWJsaWNhdGlvbkZhY3RvcnldIENyZWF0ZWQgbmV3IHN1YnNjcmliZXJzIGZvciByZWRpcyBmb3I6ICR7XG4gICAgICAgICAgICAgICAgICAgIHB1YmxpY2F0aW9uRW50cnkuaWRcbiAgICAgICAgICAgICAgICB9YFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgdGhpcy5zdG9yZS5hZGQoaWQsIHB1YmxpY2F0aW9uRW50cnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljYXRpb25FbnRyeS5hZGRPYnNlcnZlcihvYnNlcnZlcik7XG5cbiAgICAgICAgcmV0dXJuIHB1YmxpY2F0aW9uRW50cnk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkXG4gICAgICovXG4gICAgcmVtb3ZlKGlkKSB7XG4gICAgICAgIHRoaXMuc3RvcmUucmVtb3ZlKGlkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGFuIHVuaXF1ZSBpZCBiYXNlZCBvbiB0aGUgY3Vyc29ycyBzZWxlY3RvciBhbmQgb3B0aW9uc1xuICAgICAqIEBwYXJhbSBjdXJzb3JcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldFB1YmxpY2F0aW9uSWQoY3Vyc29yKSB7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY3Vyc29yLl9jdXJzb3JEZXNjcmlwdGlvbjtcbiAgICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSB0aGlzLl9nZXRDb2xsZWN0aW9uTmFtZShjdXJzb3IpO1xuXG4gICAgICAgIGNvbnN0IHsgc2VsZWN0b3IsIG9wdGlvbnMgfSA9IGRlc2NyaXB0aW9uO1xuXG4gICAgICAgIC8vIGJlY2F1c2Ugb2Ygc29tZSBjb21wYXRpYmlsaXR5IHN0dWZmXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICBjb2xsZWN0aW9uTmFtZSArXG4gICAgICAgICAgICAnOjonICtcbiAgICAgICAgICAgIEVKU09OLnN0cmluZ2lmeShzZWxlY3RvcikgK1xuICAgICAgICAgICAgRUpTT04uc3RyaW5naWZ5KF8ub21pdChvcHRpb25zLCAndHJhbnNmb3JtJykpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVmcmVzaGVzIGFsbCBvYnNlcnZhYmxlQ29sbGVjdGlvbnNcbiAgICAgKi9cbiAgICByZWxvYWRBbGwoKSB7XG4gICAgICAgIGNvbnN0IGVudHJpZXMgPSB0aGlzLnN0b3JlLmdldEFsbCgpO1xuXG4gICAgICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICByZWxvYWQoZW50cnkub2JzZXJ2YWJsZUNvbGxlY3Rpb24pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwYXJhbSBfY3Vyc29yXG4gICAgICovXG4gICAgZXh0ZW5kQ3Vyc29yV2l0aENvbGxlY3Rpb25EZWZhdWx0cyhjb250ZXh0LCBfY3Vyc29yKSB7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gdGhpcy5fZ2V0Q29sbGVjdGlvbk5hbWUoX2N1cnNvcik7XG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBNb25nby5Db2xsZWN0aW9uLl9fZ2V0Q29sbGVjdGlvbkJ5TmFtZShcbiAgICAgICAgICAgIGNvbGxlY3Rpb25OYW1lXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGNvbGxlY3Rpb24gJiYgY29sbGVjdGlvbi5fcmVkaXNPcGxvZykge1xuICAgICAgICAgICAgY29uc3QgeyBjdXJzb3IgfSA9IGNvbGxlY3Rpb24uX3JlZGlzT3Bsb2c7XG4gICAgICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgbGV0IHsgc2VsZWN0b3IsIG9wdGlvbnMgfSA9IF9jdXJzb3IuX2N1cnNvckRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIGN1cnNvci5jYWxsKGNvbnRleHQsIG9wdGlvbnMsIHNlbGVjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjdXJzb3JcbiAgICAgKiBAcmV0dXJucyB7KnxzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0Q29sbGVjdGlvbk5hbWUoY3Vyc29yKSB7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gY3Vyc29yLl9jdXJzb3JEZXNjcmlwdGlvbjtcblxuICAgICAgICAvLyBiZWNhdXNlIG9mIHNvbWUgY29tcGF0aWJpbGl0eSBzdHVmZlxuICAgICAgICBsZXQgY29sbGVjdGlvbk5hbWUgPSBkZXNjcmlwdGlvbi5jb2xsZWN0aW9uTmFtZTtcbiAgICAgICAgaWYgKCFjb2xsZWN0aW9uTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0aW9uLmNvbGxlY3Rpb24ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uTmFtZTtcbiAgICB9XG59KCk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVibGljYXRpb25TdG9yZSB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgc3RvcmVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgaWQ6IFB1YmxpY2F0aW9uRW50cnlcbiAgICAgICAgICogfVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5zdG9yZSA9IHt9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZFxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGhhcyhpZCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLnN0b3JlW2lkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBmaW5kKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JlW2lkXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKiBAcGFyYW0gcHVibGljYXRpb25FbnRyeVxuICAgICAqL1xuICAgIGFkZChpZCwgcHVibGljYXRpb25FbnRyeSkge1xuICAgICAgICBpZiAodGhpcy5zdG9yZVtpZF0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYFlvdSBjYW5ub3QgYWRkIGEgcHVibGljYXRpb24gdG8gdGhpcyBzdG9yZSwgYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0czogJHtpZH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3RvcmVbaWRdID0gcHVibGljYXRpb25FbnRyeTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWRcbiAgICAgKi9cbiAgICByZW1vdmUoaWQpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuc3RvcmVbaWRdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBnZXRBbGwoKSB7XG4gICAgICAgIHJldHVybiBfLnZhbHVlcyh0aGlzLnN0b3JlKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTW9uZ29JRCB9IGZyb20gJ21ldGVvci9tb25nby1pZCc7XG5cbmV4cG9ydCBjbGFzcyBNb25nb0lETWFwIHtcblxuICAgIGNvbnN0cnVjdG9yKGlkU3RyaW5naWZ5LCBpZFBhcnNlKSB7XG4gICAgICAgIHRoaXMuX2ludGVybmFsID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLl9pZFN0cmluZ2lmeSA9IGlkU3RyaW5naWZ5IHx8IE1vbmdvSUQuaWRTdHJpbmdpZnk7XG4gICAgICAgIHRoaXMuX2lkUGFyc2UgPSBpZFBhcnNlIHx8IE1vbmdvSUQuaWRQYXJzZTtcbiAgICB9XG5cbiAgICBnZXQoaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJuYWwuZ2V0KGtleSk7XG4gICAgfVxuXG4gICAgcG9wKGlkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuX2lkU3RyaW5naWZ5KGlkKTtcbiAgICAgICAgY29uc3QgcmV0ID0gdGhpcy5faW50ZXJuYWwuZ2V0KGtleSk7XG4gICAgICAgIHRoaXMuX2ludGVybmFsLmRlbGV0ZShrZXkpO1xuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIHNldChpZCwgdmFsdWUpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgICAgICB0aGlzLl9pbnRlcm5hbC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc2V0RGVmYXVsdChpZCwgZGVmKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuX2lkU3RyaW5naWZ5KGlkKTtcbiAgICAgICAgaWYgKHRoaXMuX2ludGVybmFsLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJuYWwuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faW50ZXJuYWwuc2V0KGtleSwgZGVmKTtcbiAgICAgICAgcmV0dXJuIGRlZjtcbiAgICB9XG5cbiAgICByZW1vdmUoaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgICAgICB0aGlzLl9pbnRlcm5hbC5kZWxldGUoa2V5KTtcbiAgICB9XG5cbiAgICBoYXMoaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5faWRTdHJpbmdpZnkoaWQpO1xuICAgICAgICByZXR1cm4gdGhpcy5faW50ZXJuYWwuaGFzKGtleSk7XG4gICAgfVxuXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludGVybmFsLnNpemU7XG4gICAgfVxuXG4gICAgZW1wdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnRlcm5hbC5zaXplID09PSAwO1xuICAgIH1cblxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbC5jbGVhcigpO1xuICAgIH1cblxuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX2ludGVybmFsLmtleXMoKSkubWFwKGtleSA9PiB0aGlzLl9pZFBhcnNlKGtleSkpXG4gICAgfVxuXG4gICAgZm9yRWFjaChpdGVyYXRvcikge1xuICAgICAgICB0aGlzLl9pbnRlcm5hbC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBpdGVyYXRvci5jYWxsKG51bGwsIHZhbHVlLCB0aGlzLl9pZFBhcnNlKGtleSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb21wYXJlV2l0aChvdGhlciwgY2FsbGJhY2tzKSB7XG4gICAgICAgIC8vIG9wZXJhdGUgb24gdGhlIF9pbnRlcm5hbCBtYXBzIHRvIGF2b2lkIG92ZXJoZWFkIG9mIHBhcnNpbmcgaWQncy5cbiAgICAgICAgY29uc3QgbGVmdE1hcCA9IHRoaXMuX2ludGVybmFsO1xuICAgICAgICBjb25zdCByaWdodE1hcCA9IG90aGVyLl9pbnRlcm5hbDtcblxuICAgICAgICBsZWZ0TWFwLmZvckVhY2goKGxlZnRWYWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByaWdodFZhbHVlID0gcmlnaHRNYXAuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAocmlnaHRWYWx1ZSAhPSBudWxsKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5ib3RoICYmIGNhbGxiYWNrcy5ib3RoKHRoaXMuX2lkUGFyc2Uoa2V5KSwgbGVmdFZhbHVlLCByaWdodFZhbHVlKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBjYWxsYmFja3MubGVmdE9ubHkgJiYgY2FsbGJhY2tzLmxlZnRPbmx5KHRoaXMuX2lkUGFyc2Uoa2V5KSwgbGVmdFZhbHVlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChjYWxsYmFja3MucmlnaHRPbmx5KSB7XG4gICAgICAgICAgICByaWdodE1hcC5mb3JFYWNoKChyaWdodFZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWxlZnRNYXAuaGFzKGtleSkpXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrcy5yaWdodE9ubHkodGhpcy5faWRQYXJzZShrZXkpLCByaWdodFZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9XG59XG4iLCJjb25zdCBkZWVwRmlsdGVyRmllbGRzQXJyYXkgPSBbJyRhbmQnLCAnJG9yJywgJyRub3InXTtcbmNvbnN0IGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QgPSBbJyRub3QnXTtcblxuLyoqXG4gKiBHaXZlbiBhIGNvbXBsZXggZmlsdGVyaW5nIG9wdGlvbiwgZXh0cmFjdCB0aGUgZmllbGRzXG4gKiBAcGFyYW0gZmlsdGVyc1xuICovXG5mdW5jdGlvbiBleHRyYWN0RmllbGRzRnJvbUZpbHRlcnMoZmlsdGVycykge1xuICAgIGxldCBmaWx0ZXJGaWVsZHMgPSBbXTtcblxuICAgIF8uZWFjaChmaWx0ZXJzLCAodmFsdWUsIGZpZWxkKSA9PiB7XG4gICAgICAgIGlmIChmaWVsZFswXSAhPT0gJyQnKSB7XG4gICAgICAgICAgICBmaWx0ZXJGaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNBcnJheS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgaWYgKGZpbHRlcnNbZmllbGRdKSB7XG4gICAgICAgICAgICBmaWx0ZXJzW2ZpZWxkXS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIF8udW5pb24oZmlsdGVyRmllbGRzLCBleHRyYWN0RmllbGRzRnJvbUZpbHRlcnMoZWxlbWVudCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGRlZXBGaWx0ZXJGaWVsZHNPYmplY3QuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICAgIGlmIChmaWx0ZXJzW2ZpZWxkXSkge1xuICAgICAgICAgICAgXy51bmlvbihmaWx0ZXJGaWVsZHMsIGV4dHJhY3RGaWVsZHNGcm9tRmlsdGVycyhmaWx0ZXJzW2ZpZWxkXSkpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmlsdGVyRmllbGRzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBleHRyYWN0RmllbGRzRnJvbUZpbHRlcnM7XG4iLCJleHBvcnQgZGVmYXVsdCAoZmllbGRzKSA9PiB7XG4gICAgZm9yIChsZXQgdmFsdWUgaW4gZmllbGRzKSB7XG4gICAgICAgIHJldHVybiBmaWVsZHNbdmFsdWVdICE9PSAxO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGdldENoYW5uZWxOYW1lIGZyb20gJy4uLy4uL3V0aWxzL2dldENoYW5uZWxOYW1lJztcblxuZXhwb3J0IGRlZmF1bHQgKGNvbGxlY3Rpb25OYW1lLCB7bmFtZXNwYWNlLCBjaGFubmVsLCBuYW1lc3BhY2VzLCBjaGFubmVsc30pID0+IHtcbiAgICBsZXQgY2hhbm5lbFN0cmluZ3MgPSBbXTtcblxuICAgIGlmIChuYW1lc3BhY2VzKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGNoYW5uZWxTdHJpbmdzLnB1c2goYCR7bmFtZX06OiR7Y29sbGVjdGlvbk5hbWV9YClcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgIGNoYW5uZWxTdHJpbmdzLnB1c2goYCR7bmFtZXNwYWNlfTo6JHtjb2xsZWN0aW9uTmFtZX1gKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbm5lbHMpIHtcbiAgICAgICAgY2hhbm5lbHMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGNoYW5uZWxTdHJpbmdzLnB1c2gobmFtZSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoY2hhbm5lbCkge1xuICAgICAgICBjaGFubmVsU3RyaW5ncy5wdXNoKGNoYW5uZWwpO1xuICAgIH1cblxuICAgIGlmIChjaGFubmVsU3RyaW5ncy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY2hhbm5lbFN0cmluZ3MucHVzaChjb2xsZWN0aW9uTmFtZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYW5uZWxTdHJpbmdzLm1hcChnZXRDaGFubmVsTmFtZSk7XG59XG4iLCJpbXBvcnQgZ2V0TXV0YXRpb25Db25maWcgZnJvbSAnLi9saWIvZ2V0TXV0YXRpb25Db25maWcnO1xuaW1wb3J0IGdldEZpZWxkcyBmcm9tICcuLi91dGlscy9nZXRGaWVsZHMnO1xuaW1wb3J0IHtcbiAgICBkaXNwYXRjaEluc2VydCxcbiAgICBkaXNwYXRjaFVwZGF0ZSxcbiAgICBkaXNwYXRjaFJlbW92ZSxcbn0gZnJvbSAnLi9saWIvZGlzcGF0Y2hlcnMnO1xuaW1wb3J0IENvbmZpZyBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZnVuY3Rpb24gcnVuQ2FsbGJhY2tJbkJhY2tncm91bmQoZm4pIHtcbiAgICBNZXRlb3IuZGVmZXIoTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmbikpO1xufVxuXG4vKipcbiAqIFRoZSBNdXRhdG9yIGlzIHRoZSBpbnRlcmZhY2UgdGhhdCBkb2VzIHRoZSByZXF1aXJlZCB1cGRhdGVzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11dGF0b3Ige1xuICAgIHN0YXRpYyBpbml0KCkge1xuICAgICAgICBNdXRhdG9yLnBhc3NDb25maWdEb3duID0gQ29uZmlnLnBhc3NDb25maWdEb3duO1xuXG4gICAgICAgIC8vIHJlZ2FyZGxlc3Mgb2YgeW91ciBjaG9pY2UsIHRoZXNlIDIgcGFja2FnZXMgbXVzdCBwYXNzQ29uZmlnRG93blxuICAgICAgICAvLyB3ZSBkbyBsaWtlIHRoaXMgdW50aWwgd2UgZmluZCBhIG1vcmUgZWxlZ2FudCB3YXlcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgUGFja2FnZVsnYWxkZWVkOmNvbGxlY3Rpb24yJ10gIT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgUGFja2FnZVsnYWxkZWVkOmNvbGxlY3Rpb24yLWNvcmUnXSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgICAgTXV0YXRvci5wYXNzQ29uZmlnRG93biA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgaW5zZXJ0KE9yaWdpbmFscywgZGF0YSwgX2NvbmZpZykge1xuICAgICAgICBjb25zdCBjb25maWcgPSBnZXRNdXRhdGlvbkNvbmZpZyh0aGlzLCBfY29uZmlnLCB7XG4gICAgICAgICAgICBkb2M6IGRhdGEsXG4gICAgICAgICAgICBldmVudDogRXZlbnRzLklOU0VSVCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNhblVzZU9yaWdpbmFsTWV0aG9kKGNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmlnaW5hbHMuaW5zZXJ0LmNhbGwodGhpcywgZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgZG9jSWQgPSBPcmlnaW5hbHMuaW5zZXJ0LmNhbGwodGhpcywgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIEl0J3MgYSBjYWxsYmFja1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihfY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHJ1bkNhbGxiYWNrSW5CYWNrZ3JvdW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfY29uZmlnLmNhbGwoc2VsZiwgbnVsbCwgZG9jSWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkaXNwYXRjaEluc2VydChcbiAgICAgICAgICAgICAgICBjb25maWcub3B0aW1pc3RpYyxcbiAgICAgICAgICAgICAgICB0aGlzLl9uYW1lLFxuICAgICAgICAgICAgICAgIGNvbmZpZy5fY2hhbm5lbHMsXG4gICAgICAgICAgICAgICAgZG9jSWRcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiBkb2NJZDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihfY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIE1ldGVvci5kZWZlcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfY29uZmlnLmNhbGwodGhpcywgZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gT3JpZ2luYWxzXG4gICAgICogQHBhcmFtIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIG1vZGlmaWVyXG4gICAgICogQHBhcmFtIF9jb25maWdcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdXBkYXRlKE9yaWdpbmFscywgc2VsZWN0b3IsIG1vZGlmaWVyLCBfY29uZmlnLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoXy5pc1N0cmluZyhzZWxlY3RvcikpIHtcbiAgICAgICAgICAgIHNlbGVjdG9yID0geyBfaWQ6IHNlbGVjdG9yIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKF9jb25maWcpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IF9jb25maWc7XG4gICAgICAgICAgICBfY29uZmlnID0ge307XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb25maWcgPSBnZXRNdXRhdGlvbkNvbmZpZyh0aGlzLCBfY29uZmlnLCB7XG4gICAgICAgICAgICBldmVudDogRXZlbnRzLlVQREFURSxcbiAgICAgICAgICAgIHNlbGVjdG9yLFxuICAgICAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChjYW5Vc2VPcmlnaW5hbE1ldGhvZChjb25maWcpKSB7XG4gICAgICAgICAgICByZXR1cm4gT3JpZ2luYWxzLnVwZGF0ZS5jYWxsKHRoaXMsIHNlbGVjdG9yLCBtb2RpZmllciwgY29uZmlnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlYXJjaGluZyB0aGUgZWxlbWVudHMgdGhhdCB3aWxsIGdldCB1cGRhdGVkIGJ5IGlkXG4gICAgICAgIGNvbnN0IGZpbmRPcHRpb25zID0geyBmaWVsZHM6IHsgX2lkOiAxIH0sIHRyYW5zZm9ybTogbnVsbCB9O1xuICAgICAgICBpZiAoIWNvbmZpZy5tdWx0aSkge1xuICAgICAgICAgICAgZmluZE9wdGlvbnMubGltaXQgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRvY0lkcyA9IHRoaXMuZmluZChzZWxlY3RvciwgZmluZE9wdGlvbnMpXG4gICAgICAgICAgICAuZmV0Y2goKVxuICAgICAgICAgICAgLm1hcChkb2MgPT4gZG9jLl9pZCk7XG5cbiAgICAgICAgaWYgKGNvbmZpZyAmJiBjb25maWcudXBzZXJ0KSB7XG4gICAgICAgICAgICByZXR1cm4gTXV0YXRvci5faGFuZGxlVXBzZXJ0LmNhbGwoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBPcmlnaW5hbHMsXG4gICAgICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICAgICAgbW9kaWZpZXIsXG4gICAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIGRvY0lkc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIGRvIHRoaXMgYmVjYXVzZSB3aGVuIHdlIHNlbmQgdG8gcmVkaXNcbiAgICAgICAgLy8gd2UgbmVlZCB0aGUgZXhhY3QgX2lkc1xuICAgICAgICAvLyBhbmQgd2UgZXh0ZW5kIHRoZSBzZWxlY3RvciwgYmVjYXVzZSBpZiBiZXR3ZWVuIGZpbmRpbmcgdGhlIGRvY0lkcyBhbmQgdXBkYXRpbmdcbiAgICAgICAgLy8gYW5vdGhlciBtYXRjaGluZyBpbnNlcnQgc25lYWtlZCBpbiwgaXQncyB1cGRhdGUgd2lsbCBub3QgYmUgcHVzaGVkXG4gICAgICAgIGNvbnN0IHVwZGF0ZVNlbGVjdG9yID0gXy5leHRlbmQoe30sIHNlbGVjdG9yLCB7XG4gICAgICAgICAgICBfaWQ6IHsgJGluOiBkb2NJZHMgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IE9yaWdpbmFscy51cGRhdGUuY2FsbChcbiAgICAgICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgICAgIHVwZGF0ZVNlbGVjdG9yLFxuICAgICAgICAgICAgICAgIG1vZGlmaWVyLFxuICAgICAgICAgICAgICAgIGNvbmZpZ1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gcGhvbnkgY2FsbGJhY2sgZW11bGF0aW9uXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBydW5DYWxsYmFja0luQmFja2dyb3VuZChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzZWxmLCBudWxsLCByZXN1bHQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB7IGZpZWxkcyB9ID0gZ2V0RmllbGRzKG1vZGlmaWVyKTtcblxuICAgICAgICAgICAgZGlzcGF0Y2hVcGRhdGUoXG4gICAgICAgICAgICAgICAgY29uZmlnLm9wdGltaXN0aWMsXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSxcbiAgICAgICAgICAgICAgICBjb25maWcuX2NoYW5uZWxzLFxuICAgICAgICAgICAgICAgIGRvY0lkcyxcbiAgICAgICAgICAgICAgICBmaWVsZHNcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHJ1bkNhbGxiYWNrSW5CYWNrZ3JvdW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5jYWxsKHNlbGYsIGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIE9yaWdpbmFsc1xuICAgICAqIEBwYXJhbSBzZWxlY3RvclxuICAgICAqIEBwYXJhbSBtb2RpZmllclxuICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZG9jSWRzXG4gICAgICovXG4gICAgc3RhdGljIF9oYW5kbGVVcHNlcnQoXG4gICAgICAgIE9yaWdpbmFscyxcbiAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgIG1vZGlmaWVyLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGNhbGxiYWNrLFxuICAgICAgICBkb2NJZHNcbiAgICApIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBPcmlnaW5hbHMudXBkYXRlLmNhbGwoXG4gICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcixcbiAgICAgICAgICAgICAgICBtb2RpZmllcixcbiAgICAgICAgICAgICAgICBfLmV4dGVuZCh7fSwgY29uZmlnLCB7IF9yZXR1cm5PYmplY3Q6IHRydWUgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBsZXQgeyBpbnNlcnRlZElkLCBudW1iZXJBZmZlY3RlZCB9ID0gZGF0YTtcblxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgcnVuQ2FsbGJhY2tJbkJhY2tncm91bmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywgbnVsbCwgeyBpbnNlcnRlZElkLCBudW1iZXJBZmZlY3RlZCB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbmZpZy5wdXNoVG9SZWRpcykge1xuICAgICAgICAgICAgICAgIGlmIChpbnNlcnRlZElkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoSW5zZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLm9wdGltaXN0aWMsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnLl9jaGFubmVscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydGVkSWRcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBpdCBtZWFucyB0aGF0IHdlIHJhbiBhbiB1cHNlcnQgdGhpbmtpbmcgdGhlcmUgd2lsbCBiZSBubyBkb2NzXG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY0lkcy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIG51bWJlckFmZmVjdGVkICE9PSBkb2NJZHMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlcmUgd2VyZSBubyBkb2NzIGluaXRpYWxseSBmb3VuZCBtYXRjaGluZyB0aGUgc2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhvd2V2ZXIgYSBkb2N1bWVudCBzbmVla2VkIGluLCByZXN1bHRpbmcgaW4gYSByYWNlLWNvbmRpdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIGlmIHdlIGxvb2sgYWdhaW4gZm9yIHRoYXQgZG9jdW1lbnQsIHdlIGNhbm5vdCByZXRyaWV2ZSBpdC5cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3IgYSBuZXcgZG9jdW1lbnQgd2FzIGFkZGVkL21vZGlmaWVkIHRvIG1hdGNoIHNlbGVjdG9yIGJlZm9yZSB0aGUgYWN0dWFsIHVwZGF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWRpc09wbG9nIC0gV2FybmluZyAtIEEgcmFjZSBjb25kaXRpb24gb2NjdXJyZWQgd2hlbiBydW5uaW5nIHVwc2VydC4nXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgeyBmaWVsZHMgfSA9IGdldEZpZWxkcyhtb2RpZmllcik7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaFVwZGF0ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWcub3B0aW1pc3RpYyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZy5fY2hhbm5lbHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9jSWRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkc1xuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHsgaW5zZXJ0ZWRJZCwgbnVtYmVyQWZmZWN0ZWQgfTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgcnVuQ2FsbGJhY2tJbkJhY2tncm91bmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2VsZiwgZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gT3JpZ2luYWxzXG4gICAgICogQHBhcmFtIHNlbGVjdG9yXG4gICAgICogQHBhcmFtIF9jb25maWdcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBzdGF0aWMgcmVtb3ZlKE9yaWdpbmFscywgc2VsZWN0b3IsIF9jb25maWcpIHtcbiAgICAgICAgaWYgKF8uaXNTdHJpbmcoc2VsZWN0b3IpKSB7XG4gICAgICAgICAgICBzZWxlY3RvciA9IHsgX2lkOiBzZWxlY3RvciB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29uZmlnID0gZ2V0TXV0YXRpb25Db25maWcodGhpcywgX2NvbmZpZywge1xuICAgICAgICAgICAgc2VsZWN0b3IsXG4gICAgICAgICAgICBldmVudDogRXZlbnRzLlJFTU9WRSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGNhblVzZU9yaWdpbmFsTWV0aG9kKGNvbmZpZykpIHtcbiAgICAgICAgICAgIHJldHVybiBPcmlnaW5hbHMucmVtb3ZlLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVtb3ZlU2VsZWN0b3IgPSBfLmV4dGVuZCh7fSwgc2VsZWN0b3IpO1xuXG4gICAgICAgIC8vIFRPRE86IG9wdGltaXphdGlvbiBjaGVjayBpZiBpdCBoYXMgX2lkIG9yIF9pZCB3aXRoIHskaW59IHNvIHdlIGRvbid0IGhhdmUgdG8gcmVkbyB0aGlzLlxuICAgICAgICBsZXQgZG9jSWRzID0gdGhpcy5maW5kKHNlbGVjdG9yLCB7XG4gICAgICAgICAgICBmaWVsZHM6IHsgX2lkOiAxIH0sXG4gICAgICAgICAgICB0cmFuc2Zvcm06IG51bGwsXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZmV0Y2goKVxuICAgICAgICAgICAgLm1hcChkb2MgPT4gZG9jLl9pZCk7XG5cbiAgICAgICAgaWYgKCFzZWxlY3Rvci5faWQpIHtcbiAgICAgICAgICAgIHJlbW92ZVNlbGVjdG9yLl9pZCA9IHsgJGluOiBkb2NJZHMgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBPcmlnaW5hbHMucmVtb3ZlLmNhbGwodGhpcywgcmVtb3ZlU2VsZWN0b3IpO1xuXG4gICAgICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKF9jb25maWcpKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgcnVuQ2FsbGJhY2tJbkJhY2tncm91bmQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIF9jb25maWcuY2FsbChzZWxmLCBudWxsKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZGlzcGF0Y2hSZW1vdmUoXG4gICAgICAgICAgICAgICAgY29uZmlnLm9wdGltaXN0aWMsXG4gICAgICAgICAgICAgICAgdGhpcy5fbmFtZSxcbiAgICAgICAgICAgICAgICBjb25maWcuX2NoYW5uZWxzLFxuICAgICAgICAgICAgICAgIGRvY0lkc1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKF8uaXNGdW5jdGlvbihfY29uZmlnKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHJ1bkNhbGxiYWNrSW5CYWNrZ3JvdW5kKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBfY29uZmlnLmNhbGwoc2VsZiwgZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNhblVzZU9yaWdpbmFsTWV0aG9kKG11dGF0aW9uQ29uZmlnKSB7XG4gICAgLy8gVGhlcmUgYXJlIHR3byBjYXNlcyB3aGVyZSB3ZSBjYW4gdXNlIHRoZSBvcmlnaW5hbCBtdXRhdG9ycyByYXRoZXIgdGhhblxuICAgIC8vIG91ciBvdmVycmlkZW4gb25lczpcbiAgICAvL1xuICAgIC8vIDEpIFRoZSB1c2VyIHNldCBwdXNoVG9SZWRpczogZmFsc2UsIGluZGljYXRpbmcgdGhleSBkb24ndCBuZWVkIHJlYWx0aW1lXG4gICAgLy8gICAgdXBkYXRlcyBhdCBhbGwuXG4gICAgLy9cbiAgICAvLyAyKSBUaGUgdXNlciBpcyB1c2luZyBhbiBleHRlcm5hbCByZWRpcyBwdWJsaXNoZXIsIHNvIHdlIGRvbid0IG5lZWQgdG9cbiAgICAvLyAgICBmaWd1cmUgb3V0IHdoYXQgdG8gcHVibGlzaCB0byByZWRpcywgYW5kIHRoaXMgdXBkYXRlIGRvZXNuJ3QgbmVlZFxuICAgIC8vICAgIG9wdGltaXN0aWMtdWkgcHJvY2Vzc2luZywgc28gd2UgZG9uJ3QgbmVlZCB0byBzeW5jaHJvbm91c2x5IHJ1blxuICAgIC8vICAgIG9ic2VydmVycy5cbiAgICByZXR1cm4gIW11dGF0aW9uQ29uZmlnLnB1c2hUb1JlZGlzIHx8IChDb25maWcuZXh0ZXJuYWxSZWRpc1B1Ymxpc2hlciAmJiAhbXV0YXRpb25Db25maWcub3B0aW1pc3RpYyk7XG59XG4iLCJpbXBvcnQge01vbmdvfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHtSYW5kb219IGZyb20gJ21ldGVvci9yYW5kb20nO1xuaW1wb3J0IHsgZ2V0UmVkaXNQdXNoZXIgfSBmcm9tICcuLi9yZWRpcy9nZXRSZWRpc0NsaWVudCc7XG5pbXBvcnQge0VKU09OfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IGdldEZpZWxkcyBmcm9tICcuLi91dGlscy9nZXRGaWVsZHMnO1xuaW1wb3J0IHtFdmVudHMsIFJlZGlzUGlwZX0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBjb250YWluc09wZXJhdG9ycyBmcm9tICcuLi9tb25nby9saWIvY29udGFpbnNPcGVyYXRvcnMnO1xuXG4vKipcbiAqIGNhbGwoTW9uZ28uQ29sbGVjdGlvbikuaW5zZXJ0KGRhdGEpXG4gKiBAcGFyYW0gY2hhbm5lbE9yQ29sbGVjdGlvbiB7TW9uZ28uQ29sbGVjdGlvbnxzdHJpbmd9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5bnRoZXRpY011dGF0b3Ige1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjaGFubmVsc1xuICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICovXG4gICAgc3RhdGljIHB1Ymxpc2goY2hhbm5lbHMsIGRhdGEpIHtcbiAgICAgICAgY29uc3QgY2xpZW50ID0gZ2V0UmVkaXNQdXNoZXIoKTtcblxuICAgICAgICBjaGFubmVscy5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgICAgICAgY2xpZW50LnB1Ymxpc2goY2hhbm5lbCwgRUpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2hhbm5lbHNcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIHN0YXRpYyBpbnNlcnQoY2hhbm5lbHMsIGRhdGEpIHtcbiAgICAgICAgY2hhbm5lbHMgPSBTeW50aGV0aWNNdXRhdG9yLl9leHRyYWN0Q2hhbm5lbHMoY2hhbm5lbHMpO1xuXG4gICAgICAgIGlmICghZGF0YS5faWQpIHtcbiAgICAgICAgICAgIGRhdGEuX2lkID0gUmFuZG9tLmlkKCk7XG4gICAgICAgIH1cblxuICAgICAgICBTeW50aGV0aWNNdXRhdG9yLnB1Ymxpc2goY2hhbm5lbHMsIHtcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuRVZFTlRdOiBFdmVudHMuSU5TRVJULFxuICAgICAgICAgICAgW1JlZGlzUGlwZS5TWU5USEVUSUNdOiB0cnVlLFxuICAgICAgICAgICAgW1JlZGlzUGlwZS5ET0NdOiBkYXRhXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNoYW5uZWxzXG4gICAgICogQHBhcmFtIF9pZFxuICAgICAqIEBwYXJhbSBtb2RpZmllclxuICAgICAqL1xuICAgIHN0YXRpYyB1cGRhdGUoY2hhbm5lbHMsIF9pZCwgbW9kaWZpZXIpIHtcbiAgICAgICAgY2hhbm5lbHMgPSBTeW50aGV0aWNNdXRhdG9yLl9leHRyYWN0Q2hhbm5lbHMoY2hhbm5lbHMpO1xuXG4gICAgICAgIGlmICghY29udGFpbnNPcGVyYXRvcnMobW9kaWZpZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdTeW50aGV0aWMgdXBkYXRlIGNhbiBvbmx5IGJlIGRvbmUgdGhyb3VnaCBNb25nb0RCIG9wZXJhdG9ycy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHsgdG9wTGV2ZWxGaWVsZHMgfSA9IGdldEZpZWxkcyhtb2RpZmllcik7XG5cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgICBbUmVkaXNQaXBlLkVWRU5UXTogRXZlbnRzLlVQREFURSxcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuU1lOVEhFVElDXTogdHJ1ZSxcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuRE9DXTogeyBfaWQgfSxcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuTU9ESUZJRVJdOiBtb2RpZmllcixcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuTU9ESUZJRURfVE9QX0xFVkVMX0ZJRUxEU106IHRvcExldmVsRmllbGRzXG4gICAgICAgIH07XG5cbiAgICAgICAgU3ludGhldGljTXV0YXRvci5wdWJsaXNoKGNoYW5uZWxzLCBtZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2hhbm5lbHNcbiAgICAgKiBAcGFyYW0gX2lkXG4gICAgICovXG4gICAgc3RhdGljIHJlbW92ZShjaGFubmVscywgX2lkKSB7XG4gICAgICAgIGNoYW5uZWxzID0gU3ludGhldGljTXV0YXRvci5fZXh0cmFjdENoYW5uZWxzKGNoYW5uZWxzKTtcblxuICAgICAgICBTeW50aGV0aWNNdXRhdG9yLnB1Ymxpc2goY2hhbm5lbHMsIHtcbiAgICAgICAgICAgIFtSZWRpc1BpcGUuRVZFTlRdOiBFdmVudHMuUkVNT1ZFLFxuICAgICAgICAgICAgW1JlZGlzUGlwZS5TWU5USEVUSUNdOiB0cnVlLFxuICAgICAgICAgICAgW1JlZGlzUGlwZS5ET0NdOiB7X2lkfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2hhbm5lbHNcbiAgICAgKiBAcGFyYW0gX2lkXG4gICAgICogQHJldHVybnMgeyp9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzdGF0aWMgX2V4dHJhY3RDaGFubmVscyhjaGFubmVscywgX2lkKSB7XG4gICAgICAgIGlmICghXy5pc0FycmF5KGNoYW5uZWxzKSkge1xuICAgICAgICAgICAgaWYgKGNoYW5uZWxzIGluc3RhbmNlb2YgTW9uZ28uQ29sbGVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBjaGFubmVscy5fbmFtZTtcbiAgICAgICAgICAgICAgICBjaGFubmVscyA9IFtuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAoX2lkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNoYW5uZWxzLnB1c2goYCR7bmFtZX06OiR7X2lkfWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2hhbm5lbHMgPSBbY2hhbm5lbHNdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNoYW5uZWxzO1xuICAgIH1cbn0iLCJpbXBvcnQge01vbmdvfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgZXh0ZW5kT2JzZXJ2ZUNoYW5nZXMgZnJvbSAnLi9leHRlbmRPYnNlcnZlQ2hhbmdlcyc7XG5pbXBvcnQgX3ZhbGlkYXRlZEluc2VydCBmcm9tICcuL2FsbG93LWRlbnkvdmFsaWRhdGVkSW5zZXJ0J1xuaW1wb3J0IF92YWxpZGF0ZWRVcGRhdGUgZnJvbSAnLi9hbGxvdy1kZW55L3ZhbGlkYXRlZFVwZGF0ZSdcbmltcG9ydCBfdmFsaWRhdGVkUmVtb3ZlIGZyb20gJy4vYWxsb3ctZGVueS92YWxpZGF0ZWRSZW1vdmUnXG5pbXBvcnQgTXV0YXRvciBmcm9tICcuL011dGF0b3InO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgY29uc3QgT3JpZ2luYWxzID0ge1xuICAgICAgICBpbnNlcnQ6IE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLmluc2VydCxcbiAgICAgICAgdXBkYXRlOiBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS51cGRhdGUsXG4gICAgICAgIHJlbW92ZTogTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUucmVtb3ZlLFxuICAgICAgICBmaW5kOiBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5maW5kLFxuICAgIH07XG5cbiAgICBNdXRhdG9yLmluaXQoKTtcblxuICAgIF8uZXh0ZW5kKE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlLCB7XG4gICAgICAgIGZpbmQoLi4uYXJncykge1xuICAgICAgICAgICAgdmFyIGN1cnNvciA9IE9yaWdpbmFscy5maW5kLmNhbGwodGhpcywgLi4uYXJncyk7XG5cbiAgICAgICAgICAgIGV4dGVuZE9ic2VydmVDaGFuZ2VzKGN1cnNvciwgLi4uYXJncyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJzb3I7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBkYXRhXG4gICAgICAgICAqIEBwYXJhbSBjb25maWdcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICBpbnNlcnQoZGF0YSwgY29uZmlnKSB7XG4gICAgICAgICAgICByZXR1cm4gTXV0YXRvci5pbnNlcnQuY2FsbCh0aGlzLCBPcmlnaW5hbHMsIGRhdGEsIGNvbmZpZyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBzZWxlY3RvclxuICAgICAgICAgKiBAcGFyYW0gbW9kaWZpZXJcbiAgICAgICAgICogQHBhcmFtIGNvbmZpZ1xuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgICAgICogQHJldHVybnMgeyp9XG4gICAgICAgICAqL1xuICAgICAgICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyLCBjb25maWcsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gTXV0YXRvci51cGRhdGUuY2FsbCh0aGlzLCBPcmlnaW5hbHMsIHNlbGVjdG9yLCBtb2RpZmllciwgY29uZmlnLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwYXJhbSBzZWxlY3RvclxuICAgICAgICAgKiBAcGFyYW0gY29uZmlnXG4gICAgICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlKHNlbGVjdG9yLCBjb25maWcpIHtcbiAgICAgICAgICAgIHJldHVybiBNdXRhdG9yLnJlbW92ZS5jYWxsKHRoaXMsIE9yaWdpbmFscywgc2VsZWN0b3IsIGNvbmZpZyk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgX3ZhbGlkYXRlZEluc2VydCxcbiAgICAgICAgX3ZhbGlkYXRlZFVwZGF0ZSxcbiAgICAgICAgX3ZhbGlkYXRlZFJlbW92ZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29uZmlndXJlIGRlZmF1bHRzIGZvciB5b3VyIGNvbGxlY3Rpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gbXV0YXRpb25cbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY3Vyc29yXG4gICAgICAgICAqL1xuICAgICAgICBjb25maWd1cmVSZWRpc09wbG9nKHttdXRhdGlvbiwgY3Vyc29yfSkge1xuICAgICAgICAgICAgdGhpcy5fcmVkaXNPcGxvZyA9IHt9O1xuICAgICAgICAgICAgaWYgKG11dGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24obXV0YXRpb24pKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1RvIGNvbmZpZ3VyZSBkZWZhdWx0cyBmb3IgdGhlIGNvbGxlY3Rpb24sIFwibXV0YXRpb25cIiBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uJylcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9yZWRpc09wbG9nLm11dGF0aW9uID0gbXV0YXRpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oY3Vyc29yKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdUbyBjb25maWd1cmUgZGVmYXVsdHMgZm9yIHRoZSBjb2xsZWN0aW9uLCBcImN1cnNvclwiIG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZGlzT3Bsb2cuY3Vyc29yID0gY3Vyc29yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgUHVibGljYXRpb25FbnRyeSBmcm9tIFwiLi4vY2FjaGUvUHVibGljYXRpb25FbnRyeVwiO1xuaW1wb3J0IFB1YmxpY2F0aW9uRmFjdG9yeSBmcm9tIFwiLi4vY2FjaGUvUHVibGljYXRpb25GYWN0b3J5XCI7XG5pbXBvcnQgeyBkaWZmIH0gZnJvbSBcImRlZXAtZGlmZlwiO1xuaW1wb3J0IGNsb25lRGVlcCBmcm9tIFwibG9kYXNoLmNsb25lZGVlcFwiO1xuaW1wb3J0IHsgRERQIH0gZnJvbSBcIm1ldGVvci9kZHBcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oY3Vyc29yLCBzZWxlY3Rvciwgb3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGlzYWJsZU9wbG9nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWN1cnNvci5fY3Vyc29yRGVzY3JpcHRpb24pIHtcbiAgICAgICAgLy8gSXQgbWVhbnMgdGhhdCBpdCdzIG1vc3QgbGlrZWx5IGEgTG9jYWxDb2xsZWN0aW9uLCBubyBuZWVkIHRvIGV4dGVuZCBpdCBpbiBhbnkgd2F5XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBPYmplY3QuYXNzaWduKGN1cnNvciwge1xuICAgICAgICBvYnNlcnZlQ2hhbmdlcyhfb2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQdWJsaWNhdGlvbkVudHJ5KFxuICAgICAgICAgICAgICAgIGN1cnNvcixcbiAgICAgICAgICAgICAgICBjcmVhdGVPYnNlcnZlQ2hhbmdlcyhfb2JzZXJ2ZXIpXG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBvYnNlcnZlKF9vYnNlcnZlcikge1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVB1YmxpY2F0aW9uRW50cnkoY3Vyc29yLCBjcmVhdGVPYnNlcnZlKF9vYnNlcnZlcikpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgcHVibGljYXRpb24gZW50cnlcbiAqIEBwYXJhbSBjdXJzb3JcbiAqIEBwYXJhbSBvYnNlcnZlclxuICogQHJldHVybnMge3tzdG9wOiAoZnVuY3Rpb24oKSksIF9tdWx0aXBsZXhlcjoge319fVxuICovXG5mdW5jdGlvbiBjcmVhdGVQdWJsaWNhdGlvbkVudHJ5KGN1cnNvciwgb2JzZXJ2ZXIpIHtcbiAgICBsZXQgcGUgPSBQdWJsaWNhdGlvbkZhY3RvcnkuY3JlYXRlKGN1cnNvciwgb2JzZXJ2ZXIpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RvcCgpIHtcbiAgICAgICAgICAgIHBlLnJlbW92ZU9ic2VydmVyKG9ic2VydmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgLy8gV2UgZG8gdGhpcyB0byBtYWtlIGl0IHdvcmsgd2l0aCBtZXRlb3JoYWNrczprYWRpcmFcbiAgICAgICAgX211bHRpcGxleGVyOiBjbGFzcyB7XG4gICAgICAgICAgICBfc2VuZEFkZHMoKSB7fVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gY3JlYXRlT2JzZXJ2ZShvYnNlcnZlcikge1xuICAgIGNvbnN0IGVmID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIGNvbm5lY3Rpb246IGdldE9ic2VydmVyQ29ubmVjdGlvbihvYnNlcnZlciksXG4gICAgICAgIGFkZGVkKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCwgZG9jKSB7XG4gICAgICAgICAgICBpZiAob2JzZXJ2ZXIuYWRkZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5hZGRlZChjbG9uZURlZXAoZG9jKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkLCBjaGFuZ2VkRGlmZiwgbmV3RG9jLCBvbGREb2MpIHtcbiAgICAgICAgICAgIGlmIChvYnNlcnZlci5jaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpZmZlcmVuY2VzID0gZGlmZihuZXdEb2MsIG9sZERvYyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGlmZmVyZW5jZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuY2hhbmdlZChjbG9uZURlZXAobmV3RG9jKSwgb2xkRG9jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkLCBkb2MpIHtcbiAgICAgICAgICAgIGlmIChvYnNlcnZlci5yZW1vdmVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIucmVtb3ZlZChkb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2ZXJcbiAqL1xuZnVuY3Rpb24gY3JlYXRlT2JzZXJ2ZUNoYW5nZXMob2JzZXJ2ZXIpIHtcbiAgICBjb25zdCBlZiA9IGZ1bmN0aW9uKCkge307XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBjb25uZWN0aW9uOiBnZXRPYnNlcnZlckNvbm5lY3Rpb24ob2JzZXJ2ZXIpLFxuICAgICAgICBhZGRlZChjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIGRvYykge1xuICAgICAgICAgICAgaWYgKG9ic2VydmVyLmFkZGVkKSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuYWRkZWQoZG9jSWQsIGNsb25lRGVlcChkb2MpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIGRvYykge1xuICAgICAgICAgICAgaWYgKG9ic2VydmVyLmNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jaGFuZ2VkKGRvY0lkLCBjbG9uZURlZXAoZG9jKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgICAgICBpZiAob2JzZXJ2ZXIucmVtb3ZlZCkge1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLnJlbW92ZWQoZG9jSWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbn1cblxuLyoqXG4gKiBAcGFyYW0geyp9IG9ic2VydmVyXG4gKi9cbmZ1bmN0aW9uIGdldE9ic2VydmVyQ29ubmVjdGlvbihvYnNlcnZlcikge1xuICAgIGlmIChvYnNlcnZlci5jb25uZWN0aW9uKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5jb25uZWN0aW9uO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRQdWJsaXNoSW52b2tlID0gRERQLl9DdXJyZW50UHVibGljYXRpb25JbnZvY2F0aW9uICYmIEREUC5fQ3VycmVudFB1YmxpY2F0aW9uSW52b2NhdGlvbi5nZXQoKTtcblxuICAgIGlmIChjdXJyZW50UHVibGlzaEludm9rZSkge1xuICAgICAgICByZXR1cm4gY3VycmVudFB1Ymxpc2hJbnZva2UuY29ubmVjdGlvbjtcbiAgICB9XG59XG4iLCJsZXQgbWFwID0ge307XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbWFwW25hbWVdO1xufVxuXG5mdW5jdGlvbiBleHRlbmQoYmFzZSwgc3ViKSB7XG4gICAgLy8gQXZvaWQgaW5zdGFudGlhdGluZyB0aGUgYmFzZSBjbGFzcyBqdXN0IHRvIHNldHVwIGluaGVyaXRhbmNlXG4gICAgLy8gQWxzbywgZG8gYSByZWN1cnNpdmUgbWVyZ2Ugb2YgdHdvIHByb3RvdHlwZXMsIHNvIHdlIGRvbid0IG92ZXJ3cml0ZVxuICAgIC8vIHRoZSBleGlzdGluZyBwcm90b3R5cGUsIGJ1dCBzdGlsbCBtYWludGFpbiB0aGUgaW5oZXJpdGFuY2UgY2hhaW5cbiAgICAvLyBUaGFua3MgdG8gQGNjbm9rZXNcbiAgICB2YXIgb3JpZ1Byb3RvID0gc3ViLnByb3RvdHlwZTtcbiAgICBzdWIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShiYXNlLnByb3RvdHlwZSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9yaWdQcm90bykge1xuICAgICAgICBzdWIucHJvdG90eXBlW2tleV0gPSBvcmlnUHJvdG9ba2V5XTtcbiAgICB9XG4gICAgLy8gVGhlIGNvbnN0cnVjdG9yIHByb3BlcnR5IHdhcyBzZXQgd3JvbmcsIGxldCdzIGZpeCBpdFxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdWIucHJvdG90eXBlLCAnY29uc3RydWN0b3InLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB2YWx1ZTogc3ViLFxuICAgIH0pO1xufVxuXG5jb25zdCBvbGQgPSBNb25nby5Db2xsZWN0aW9uO1xuXG5mdW5jdGlvbiBleHRlbnNpb24obmFtZSwgLi4uYXJncykge1xuICAgIG9sZC5jYWxsKHRoaXMsIG5hbWUsIC4uLmFyZ3MpO1xuICAgIG1hcFtuYW1lXSA9IHRoaXM7XG59XG5cbl8uZXh0ZW5kKGV4dGVuc2lvbiwgb2xkKTtcbmV4dGVuZChvbGQsIGV4dGVuc2lvbik7XG5cbk1vbmdvLkNvbGxlY3Rpb24gPSBleHRlbnNpb247XG5Nb25nby5Db2xsZWN0aW9uLl9fZ2V0Q29sbGVjdGlvbkJ5TmFtZSA9IGdldE5hbWU7XG4iLCJpbXBvcnQge0VKU09OfSBmcm9tICdtZXRlb3IvZWpzb24nXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRvY1RvVmFsaWRhdGUodmFsaWRhdG9yLCBkb2MsIGdlbmVyYXRlZElkKSB7XG4gICAgbGV0IHJldCA9IGRvY1xuICAgIGlmICh2YWxpZGF0b3IudHJhbnNmb3JtKSB7XG4gICAgICAgIHJldCA9IEVKU09OLmNsb25lKGRvYylcbiAgICAgICAgLy8gSWYgeW91IHNldCBhIHNlcnZlci1zaWRlIHRyYW5zZm9ybSBvbiB5b3VyIGNvbGxlY3Rpb24sIHRoZW4geW91IGRvbid0IGdldFxuICAgICAgICAvLyB0byB0ZWxsIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gXCJjbGllbnQgc3BlY2lmaWVkIHRoZSBJRFwiIGFuZCBcInNlcnZlclxuICAgICAgICAvLyBnZW5lcmF0ZWQgdGhlIElEXCIsIGJlY2F1c2UgdHJhbnNmb3JtcyBleHBlY3QgdG8gZ2V0IF9pZC4gIElmIHlvdSB3YW50IHRvXG4gICAgICAgIC8vIGRvIHRoYXQgY2hlY2ssIHlvdSBjYW4gZG8gaXQgd2l0aCBhIHNwZWNpZmljXG4gICAgICAgIC8vIGBDLmFsbG93KHtpbnNlcnQ6IGYsIHRyYW5zZm9ybTogbnVsbH0pYCB2YWxpZGF0b3IuXG4gICAgICAgIGlmIChnZW5lcmF0ZWRJZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0Ll9pZCA9IGdlbmVyYXRlZElkXG4gICAgICAgIH1cbiAgICAgICAgcmV0ID0gdmFsaWRhdG9yLnRyYW5zZm9ybShyZXQpXG4gICAgfVxuICAgIHJldHVybiByZXRcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYW5zZm9ybURvYyh2YWxpZGF0b3IsIGRvYykge1xuICAgIGlmICh2YWxpZGF0b3IudHJhbnNmb3JtKSByZXR1cm4gdmFsaWRhdG9yLnRyYW5zZm9ybShkb2MpXG4gICAgcmV0dXJuIGRvY1xufVxuIiwiaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InXG5pbXBvcnQge199IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJ1xuaW1wb3J0IGRvY1RvVmFsaWRhdGUgZnJvbSAnLi9kb2NUb1ZhbGlkYXRlJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZWRJbnNlcnQodXNlcklkLCBkb2MsIGdlbmVyYXRlZElkKSB7XG4gICAgLy8gY2FsbCB1c2VyIHZhbGlkYXRvcnMuXG4gICAgLy8gQW55IGRlbnkgcmV0dXJucyB0cnVlIG1lYW5zIGRlbmllZC5cbiAgICBpZiAoXy5hbnkodGhpcy5fdmFsaWRhdG9ycy5pbnNlcnQuZGVueSwgdmFsaWRhdG9yID0+XG4gICAgICAgICAgICB2YWxpZGF0b3IodXNlcklkLCBkb2NUb1ZhbGlkYXRlKHZhbGlkYXRvciwgZG9jLCBnZW5lcmF0ZWRJZCkpKSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgJ0FjY2VzcyBkZW5pZWQnKVxuICAgIH1cbiAgICAvLyBBbnkgYWxsb3cgcmV0dXJucyB0cnVlIG1lYW5zIHByb2NlZWQuIFRocm93IGVycm9yIGlmIHRoZXkgYWxsIGZhaWwuXG4gICAgaWYgKF8uYWxsKHRoaXMuX3ZhbGlkYXRvcnMuaW5zZXJ0LmFsbG93LCB2YWxpZGF0b3IgPT5cbiAgICAgICAgICAgICF2YWxpZGF0b3IodXNlcklkLCBkb2NUb1ZhbGlkYXRlKHZhbGlkYXRvciwgZG9jLCBnZW5lcmF0ZWRJZCkpKSkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgJ0FjY2VzcyBkZW5pZWQnKVxuICAgIH1cblxuICAgIC8vIElmIHdlIGdlbmVyYXRlZCBhbiBJRCBhYm92ZSwgaW5zZXJ0IGl0IG5vdzogYWZ0ZXIgdGhlIHZhbGlkYXRpb24sIGJ1dFxuICAgIC8vIGJlZm9yZSBhY3R1YWxseSBpbnNlcnRpbmcuXG4gICAgaWYgKGdlbmVyYXRlZElkICE9PSBudWxsKSBkb2MuX2lkID0gZ2VuZXJhdGVkSWRcblxuICAgIHRoaXMuaW5zZXJ0KGRvYywge29wdGltaXN0aWM6IHRydWV9KVxufVxuIiwiLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwIG5vLXVuZGVyc2NvcmUtZGFuZ2xlOiAwICovXG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcidcbmltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnXG5pbXBvcnQgdHJhbnNmb3JtRG9jIGZyb20gJy4vdHJhbnNmb3JtRG9jJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2YWxpZGF0ZWRSZW1vdmUodXNlcklkLCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IGZpbmRPcHRpb25zID0ge3RyYW5zZm9ybTogbnVsbH1cbiAgICBpZiAoIXRoaXMuX3ZhbGlkYXRvcnMuZmV0Y2hBbGxGaWVsZHMpIHtcbiAgICAgICAgZmluZE9wdGlvbnMuZmllbGRzID0ge31cbiAgICAgICAgXy5lYWNoKHRoaXMuX3ZhbGlkYXRvcnMuZmV0Y2gsIGZpZWxkTmFtZSA9PiB7XG4gICAgICAgICAgICBmaW5kT3B0aW9ucy5maWVsZHNbZmllbGROYW1lXSA9IDFcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBkb2MgPSB0aGlzLl9jb2xsZWN0aW9uLmZpbmRPbmUoc2VsZWN0b3IsIGZpbmRPcHRpb25zKVxuICAgIGlmICghZG9jKSB7XG4gICAgICAgIHJldHVybiAwXG4gICAgfVxuXG4gICAgLy8gY2FsbCB1c2VyIHZhbGlkYXRvcnMuXG4gICAgLy8gQW55IGRlbnkgcmV0dXJucyB0cnVlIG1lYW5zIGRlbmllZC5cbiAgICBpZiAoXy5hbnkodGhpcy5fdmFsaWRhdG9ycy5yZW1vdmUuZGVueSwgdmFsaWRhdG9yID0+XG4gICAgICAgICAgICB2YWxpZGF0b3IodXNlcklkLCB0cmFuc2Zvcm1Eb2ModmFsaWRhdG9yLCBkb2MpKSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdBY2Nlc3MgZGVuaWVkJylcbiAgICB9XG4gICAgLy8gQW55IGFsbG93IHJldHVybnMgdHJ1ZSBtZWFucyBwcm9jZWVkLiBUaHJvdyBlcnJvciBpZiB0aGV5IGFsbCBmYWlsLlxuICAgIGlmIChfLmFsbCh0aGlzLl92YWxpZGF0b3JzLnJlbW92ZS5hbGxvdywgdmFsaWRhdG9yID0+XG4gICAgICAgICAgICAhdmFsaWRhdG9yKHVzZXJJZCwgdHJhbnNmb3JtRG9jKHZhbGlkYXRvciwgZG9jKSkpKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCAnQWNjZXNzIGRlbmllZCcpXG4gICAgfVxuXG4gICAgLy8gQmFjayB3aGVuIHdlIHN1cHBvcnRlZCBhcmJpdHJhcnkgY2xpZW50LXByb3ZpZGVkIHNlbGVjdG9ycywgd2UgYWN0dWFsbHlcbiAgICAvLyByZXdyb3RlIHRoZSBzZWxlY3RvciB0byB7X2lkOiB7JGluOiBbaWRzIHRoYXQgd2UgZm91bmRdfX0gYmVmb3JlIHBhc3NpbmcgdG9cbiAgICAvLyBNb25nbyB0byBhdm9pZCByYWNlcywgYnV0IHNpbmNlIHNlbGVjdG9yIGlzIGd1YXJhbnRlZWQgdG8gYWxyZWFkeSBqdXN0IGJlXG4gICAgLy8gYW4gSUQsIHdlIGRvbid0IGhhdmUgdG8gYW55IG1vcmUuXG4gICAgcmV0dXJuIHRoaXMucmVtb3ZlKHNlbGVjdG9yLCB7b3B0aW1pc3RpYzogdHJ1ZX0pXG59XG4iLCIvKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IDAgbm8tdW5kZXJzY29yZS1kYW5nbGU6IDAgKi9cbmltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJ1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSdcbmltcG9ydCB7TG9jYWxDb2xsZWN0aW9ufSBmcm9tICdtZXRlb3IvbWluaW1vbmdvJ1xuaW1wb3J0IHtjaGVja30gZnJvbSAnbWV0ZW9yL2NoZWNrJ1xuaW1wb3J0IHRyYW5zZm9ybURvYyBmcm9tICcuL3RyYW5zZm9ybURvYydcblxuLy8gT25seSBhbGxvdyB0aGVzZSBvcGVyYXRpb25zIGluIHZhbGlkYXRlZCB1cGRhdGVzLiBTcGVjaWZpY2FsbHlcbi8vIHdoaXRlbGlzdCBvcGVyYXRpb25zLCByYXRoZXIgdGhhbiBibGFja2xpc3QsIHNvIG5ldyBjb21wbGV4XG4vLyBvcGVyYXRpb25zIHRoYXQgYXJlIGFkZGVkIGFyZW4ndCBhdXRvbWF0aWNhbGx5IGFsbG93ZWQuIEEgY29tcGxleFxuLy8gb3BlcmF0aW9uIGlzIG9uZSB0aGF0IGRvZXMgbW9yZSB0aGFuIGp1c3QgbW9kaWZ5IGl0cyB0YXJnZXRcbi8vIGZpZWxkLiBGb3Igbm93IHRoaXMgY29udGFpbnMgYWxsIHVwZGF0ZSBvcGVyYXRpb25zIGV4Y2VwdCAnJHJlbmFtZScuXG4vLyBodHRwOi8vZG9jcy5tb25nb2RiLm9yZy9tYW51YWwvcmVmZXJlbmNlL29wZXJhdG9ycy8jdXBkYXRlXG5jb25zdCBBTExPV0VEX1VQREFURV9PUEVSQVRJT05TID0ge1xuICAgICRpbmM6IDEsXG4gICAgJHNldDogMSxcbiAgICAkdW5zZXQ6IDEsXG4gICAgJGFkZFRvU2V0OiAxLFxuICAgICRwb3A6IDEsXG4gICAgJHB1bGxBbGw6IDEsXG4gICAgJHB1bGw6IDEsXG4gICAgJHB1c2hBbGw6IDEsXG4gICAgJHB1c2g6IDEsXG4gICAgJGJpdDogMSxcbn1cblxuLy8gU2ltdWxhdGUgYSBtb25nbyBgdXBkYXRlYCBvcGVyYXRpb24gd2hpbGUgdmFsaWRhdGluZyB0aGF0IHRoZSBhY2Nlc3Ncbi8vIGNvbnRyb2wgcnVsZXMgc2V0IGJ5IGNhbGxzIHRvIGBhbGxvdy9kZW55YCBhcmUgc2F0aXNmaWVkLiBJZiBhbGxcbi8vIHBhc3MsIHJld3JpdGUgdGhlIG1vbmdvIG9wZXJhdGlvbiB0byB1c2UgJGluIHRvIHNldCB0aGUgbGlzdCBvZlxuLy8gZG9jdW1lbnQgaWRzIHRvIGNoYW5nZSAjI1ZhbGlkYXRlZENoYW5nZVxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdmFsaWRhdGVkVXBkYXRlKHVzZXJJZCwgc2VsZWN0b3IsIG11dGF0b3IsIG9wdGlvbnMpIHtcbiAgICBjaGVjayhtdXRhdG9yLCBPYmplY3QpXG4gICAgb3B0aW9ucyA9IF8uY2xvbmUob3B0aW9ucykgfHwge31cblxuICAgIGlmICghTG9jYWxDb2xsZWN0aW9uLl9zZWxlY3RvcklzSWRQZXJoYXBzQXNPYmplY3Qoc2VsZWN0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndmFsaWRhdGVkIHVwZGF0ZSBzaG91bGQgYmUgb2YgYSBzaW5nbGUgSUQnKVxuICAgIH1cblxuICAgIC8vIFdlIGRvbid0IHN1cHBvcnQgdXBzZXJ0cyBiZWNhdXNlIHRoZXkgZG9uJ3QgZml0IG5pY2VseSBpbnRvIGFsbG93L2RlbnlcbiAgICAvLyBydWxlcy5cbiAgICBpZiAob3B0aW9ucy51cHNlcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdBY2Nlc3MgZGVuaWVkLiBVcHNlcnRzIG5vdCAnICtcbiAgICAgICAgICAgICdhbGxvd2VkIGluIGEgcmVzdHJpY3RlZCBjb2xsZWN0aW9uLicpXG4gICAgfVxuXG4gICAgY29uc3Qgbm9SZXBsYWNlRXJyb3IgPSAnQWNjZXNzIGRlbmllZC4gSW4gYSByZXN0cmljdGVkIGNvbGxlY3Rpb24geW91IGNhbiBvbmx5JyArXG4gICAgICAgICcgdXBkYXRlIGRvY3VtZW50cywgbm90IHJlcGxhY2UgdGhlbS4gVXNlIGEgTW9uZ28gdXBkYXRlIG9wZXJhdG9yLCBzdWNoICcgK1xuICAgICAgICBcImFzICckc2V0Jy5cIlxuXG4gICAgLy8gY29tcHV0ZSBtb2RpZmllZCBmaWVsZHNcbiAgICBjb25zdCBmaWVsZHMgPSBbXVxuICAgIGlmIChfLmlzRW1wdHkobXV0YXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIG5vUmVwbGFjZUVycm9yKVxuICAgIH1cbiAgICBfLmVhY2gobXV0YXRvciwgKHBhcmFtcywgb3ApID0+IHtcbiAgICAgICAgaWYgKG9wLmNoYXJBdCgwKSAhPT0gJyQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgbm9SZXBsYWNlRXJyb3IpXG4gICAgICAgIH0gZWxzZSBpZiAoIV8uaGFzKEFMTE9XRURfVVBEQVRFX09QRVJBVElPTlMsIG9wKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICA0MDMsIGBBY2Nlc3MgZGVuaWVkLiBPcGVyYXRvciAke29wfSBub3QgYWxsb3dlZCBpbiBhIHJlc3RyaWN0ZWQgY29sbGVjdGlvbi5gKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXy5lYWNoKF8ua2V5cyhwYXJhbXMpLCBmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgLy8gdHJlYXQgZG90dGVkIGZpZWxkcyBhcyBpZiB0aGV5IGFyZSByZXBsYWNpbmcgdGhlaXJcbiAgICAgICAgICAgICAgICAvLyB0b3AtbGV2ZWwgcGFydFxuICAgICAgICAgICAgICAgIGlmIChmaWVsZC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkID0gZmllbGQuc3Vic3RyaW5nKDAsIGZpZWxkLmluZGV4T2YoJy4nKSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGhlIGZpZWxkIHdlIGFyZSB0cnlpbmcgdG8gY2hhbmdlXG4gICAgICAgICAgICAgICAgaWYgKCFfLmNvbnRhaW5zKGZpZWxkcywgZmllbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9KVxuXG4gICAgY29uc3QgZmluZE9wdGlvbnMgPSB7dHJhbnNmb3JtOiBudWxsfVxuICAgIGlmICghdGhpcy5fdmFsaWRhdG9ycy5mZXRjaEFsbEZpZWxkcykge1xuICAgICAgICBmaW5kT3B0aW9ucy5maWVsZHMgPSB7fVxuICAgICAgICBfLmVhY2godGhpcy5fdmFsaWRhdG9ycy5mZXRjaCwgZmllbGROYW1lID0+IHtcbiAgICAgICAgICAgIGZpbmRPcHRpb25zLmZpZWxkc1tmaWVsZE5hbWVdID0gMVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGNvbnN0IGRvYyA9IHRoaXMuX2NvbGxlY3Rpb24uZmluZE9uZShzZWxlY3RvciwgZmluZE9wdGlvbnMpXG4gICAgaWYgKCFkb2MpIHsgLy8gbm9uZSBzYXRpc2ZpZWQhXG4gICAgICAgIHJldHVybiAwXG4gICAgfVxuXG4gICAgLy8gY2FsbCB1c2VyIHZhbGlkYXRvcnMuXG4gICAgLy8gQW55IGRlbnkgcmV0dXJucyB0cnVlIG1lYW5zIGRlbmllZC5cbiAgICBpZiAoXy5hbnkodGhpcy5fdmFsaWRhdG9ycy51cGRhdGUuZGVueSwgdmFsaWRhdG9yID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcmllZERvYyA9IHRyYW5zZm9ybURvYyh2YWxpZGF0b3IsIGRvYylcbiAgICAgICAgICAgIHJldHVybiB2YWxpZGF0b3IodXNlcklkLFxuICAgICAgICAgICAgICAgIGZhY3RvcmllZERvYyxcbiAgICAgICAgICAgICAgICBmaWVsZHMsXG4gICAgICAgICAgICAgICAgbXV0YXRvcilcbiAgICAgICAgfSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdBY2Nlc3MgZGVuaWVkJylcbiAgICB9XG4gICAgLy8gQW55IGFsbG93IHJldHVybnMgdHJ1ZSBtZWFucyBwcm9jZWVkLiBUaHJvdyBlcnJvciBpZiB0aGV5IGFsbCBmYWlsLlxuICAgIGlmIChfLmFsbCh0aGlzLl92YWxpZGF0b3JzLnVwZGF0ZS5hbGxvdywgdmFsaWRhdG9yID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcmllZERvYyA9IHRyYW5zZm9ybURvYyh2YWxpZGF0b3IsIGRvYylcbiAgICAgICAgICAgIHJldHVybiAhdmFsaWRhdG9yKHVzZXJJZCxcbiAgICAgICAgICAgICAgICBmYWN0b3JpZWREb2MsXG4gICAgICAgICAgICAgICAgZmllbGRzLFxuICAgICAgICAgICAgICAgIG11dGF0b3IpXG4gICAgICAgIH0pKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCAnQWNjZXNzIGRlbmllZCcpXG4gICAgfVxuXG4gICAgb3B0aW9ucy5fZm9yYmlkUmVwbGFjZSA9IHRydWVcblxuICAgIC8vIEJhY2sgd2hlbiB3ZSBzdXBwb3J0ZWQgYXJiaXRyYXJ5IGNsaWVudC1wcm92aWRlZCBzZWxlY3RvcnMsIHdlIGFjdHVhbGx5XG4gICAgLy8gcmV3cm90ZSB0aGUgc2VsZWN0b3IgdG8gaW5jbHVkZSBhbiBfaWQgY2xhdXNlIGJlZm9yZSBwYXNzaW5nIHRvIE1vbmdvIHRvXG4gICAgLy8gYXZvaWQgcmFjZXMsIGJ1dCBzaW5jZSBzZWxlY3RvciBpcyBndWFyYW50ZWVkIHRvIGFscmVhZHkganVzdCBiZSBhbiBJRCwgd2VcbiAgICAvLyBkb24ndCBoYXZlIHRvIGFueSBtb3JlLlxuXG4gICAgcmV0dXJuIHRoaXMudXBkYXRlKHNlbGVjdG9yLCBtdXRhdG9yLCBfLmV4dGVuZChvcHRpb25zLCB7XG4gICAgICAgIG9wdGltaXN0aWM6IHRydWVcbiAgICB9KSlcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChtb2RpZmllcikge1xuICAgIHJldHVybiBfLnNvbWUobW9kaWZpZXIsIGZ1bmN0aW9uICh2YWx1ZSwgb3BlcmF0b3IpIHtcbiAgICAgICAgcmV0dXJuIC9eXFwkLy50ZXN0KG9wZXJhdG9yKTtcbiAgICB9KTtcbn07XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFNlcnZlciB9IGZyb20gJ21ldGVvci9kZHAtc2VydmVyJztcbmltcG9ydCB7IEVKU09OIH0gZnJvbSAnbWV0ZW9yL2Vqc29uJztcbmltcG9ydCB7IEV2ZW50cywgUmVkaXNQaXBlIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCBSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIgZnJvbSAnLi4vLi4vcmVkaXMvUmVkaXNTdWJzY3JpcHRpb25NYW5hZ2VyJztcbmltcG9ydCB7IGdldFJlZGlzUHVzaGVyIH0gZnJvbSBcIi4uLy4uL3JlZGlzL2dldFJlZGlzQ2xpZW50XCI7XG5pbXBvcnQgZ2V0RGVkaWNhdGVkQ2hhbm5lbCBmcm9tICcuLi8uLi91dGlscy9nZXREZWRpY2F0ZWRDaGFubmVsJztcbmltcG9ydCBDb25maWcgZnJvbSAnLi4vLi4vY29uZmlnJztcblxuY29uc3QgZ2V0V3JpdGVGZW5jZSA9IGZ1bmN0aW9uIChvcHRpbWlzdGljKSB7XG4gICAgaWYgKG9wdGltaXN0aWMgJiYgRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZSkge1xuICAgICAgICByZXR1cm4gRERQU2VydmVyLl9DdXJyZW50V3JpdGVGZW5jZS5nZXQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG5jb25zdCBkaXNwYXRjaEV2ZW50cyA9IGZ1bmN0aW9uIChmZW5jZSwgY29sbGVjdGlvbk5hbWUsIGNoYW5uZWxzLCBldmVudHMpIHtcbiAgICBpZiAoZmVuY2UpIHtcbiAgICAgICAgY29uc3Qgd3JpdGUgPSBmZW5jZS5iZWdpbldyaXRlKCk7XG4gICAgICAgIFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlci5xdWV1ZS5xdWV1ZVRhc2soTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCgoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjaGFubmVscy5mb3JFYWNoKGNoYW5uZWxOYW1lID0+IHtcbiAgICAgICAgICAgICAgICAgIFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlci5wcm9jZXNzKGNoYW5uZWxOYW1lLCBldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZG9jSWQgPSBldmVudFtSZWRpc1BpcGUuRE9DXS5faWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVkaWNhdGVkQ2hhbm5lbCA9IGdldERlZGljYXRlZENoYW5uZWwoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgICAgICAgICBSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIucHJvY2VzcyhkZWRpY2F0ZWRDaGFubmVsLCBldmVudCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgd3JpdGUuY29tbWl0dGVkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBpZiAoQ29uZmlnLmV4dGVybmFsUmVkaXNQdWJsaXNoZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIE1ldGVvci5kZWZlcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNsaWVudCA9IGdldFJlZGlzUHVzaGVyKCk7XG4gICAgICAgIGV2ZW50cy5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IEVKU09OLnN0cmluZ2lmeShldmVudCk7XG4gICAgICAgICAgICBjaGFubmVscy5mb3JFYWNoKGNoYW5uZWxOYW1lID0+IHtcbiAgICAgICAgICAgICAgICBjbGllbnQucHVibGlzaChjaGFubmVsTmFtZSwgbWVzc2FnZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGRvY0lkID0gZXZlbnRbUmVkaXNQaXBlLkRPQ10uX2lkO1xuICAgICAgICAgICAgY29uc3QgZGVkaWNhdGVkQ2hhbm5lbCA9IGdldERlZGljYXRlZENoYW5uZWwoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgICAgIGNsaWVudC5wdWJsaXNoKGRlZGljYXRlZENoYW5uZWwsIG1lc3NhZ2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cblxuY29uc3QgZGlzcGF0Y2hVcGRhdGUgPSBmdW5jdGlvbiAob3B0aW1pc3RpYywgY29sbGVjdGlvbk5hbWUsIGNoYW5uZWxzLCBkb2NJZHMsIGZpZWxkcykge1xuICAgIGNvbnN0IGZlbmNlID0gZ2V0V3JpdGVGZW5jZShvcHRpbWlzdGljKTtcbiAgICBjb25zdCB1aWQgPSBmZW5jZSA/IFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlci51aWQgOiBudWxsO1xuICAgIGNvbnN0IGV2ZW50cyA9IGRvY0lkcy5tYXAoZG9jSWQgPT4gKHtcbiAgICAgICAgW1JlZGlzUGlwZS5FVkVOVF06IEV2ZW50cy5VUERBVEUsXG4gICAgICAgIFtSZWRpc1BpcGUuRklFTERTXTogZmllbGRzLFxuICAgICAgICBbUmVkaXNQaXBlLkRPQ106IHsgX2lkOiBkb2NJZCB9LFxuICAgICAgICBbUmVkaXNQaXBlLlVJRF06IHVpZCxcbiAgICB9KSk7XG4gICAgZGlzcGF0Y2hFdmVudHMoZmVuY2UsIGNvbGxlY3Rpb25OYW1lLCBjaGFubmVscywgZXZlbnRzKTtcbn07XG5cbmNvbnN0IGRpc3BhdGNoUmVtb3ZlID0gZnVuY3Rpb24gKG9wdGltaXN0aWMsIGNvbGxlY3Rpb25OYW1lLCBjaGFubmVscywgZG9jSWRzKSB7XG4gICAgY29uc3QgZmVuY2UgPSBnZXRXcml0ZUZlbmNlKG9wdGltaXN0aWMpO1xuICAgIGNvbnN0IHVpZCA9IGZlbmNlID8gUmVkaXNTdWJzY3JpcHRpb25NYW5hZ2VyLnVpZCA6IG51bGw7XG4gICAgY29uc3QgZXZlbnRzID0gZG9jSWRzLm1hcChkb2NJZCA9PiAoe1xuICAgICAgICBbUmVkaXNQaXBlLkVWRU5UXTogRXZlbnRzLlJFTU9WRSxcbiAgICAgICAgW1JlZGlzUGlwZS5ET0NdOiB7IF9pZDogZG9jSWQgfSxcbiAgICAgICAgW1JlZGlzUGlwZS5VSURdOiB1aWQsXG4gICAgfSkpO1xuICAgIGRpc3BhdGNoRXZlbnRzKGZlbmNlLCBjb2xsZWN0aW9uTmFtZSwgY2hhbm5lbHMsIGV2ZW50cyk7XG59O1xuXG5jb25zdCBkaXNwYXRjaEluc2VydCA9IGZ1bmN0aW9uIChvcHRpbWlzdGljLCBjb2xsZWN0aW9uTmFtZSwgY2hhbm5lbHMsIGRvY0lkKSB7XG4gICAgY29uc3QgZmVuY2UgPSBnZXRXcml0ZUZlbmNlKG9wdGltaXN0aWMpO1xuICAgIGNvbnN0IHVpZCA9IGZlbmNlID8gUmVkaXNTdWJzY3JpcHRpb25NYW5hZ2VyLnVpZCA6IG51bGw7XG4gICAgY29uc3QgZXZlbnQgPSB7XG4gICAgICAgIFtSZWRpc1BpcGUuRVZFTlRdOiBFdmVudHMuSU5TRVJULFxuICAgICAgICBbUmVkaXNQaXBlLkRPQ106IHsgX2lkOiBkb2NJZCB9LFxuICAgICAgICBbUmVkaXNQaXBlLlVJRF06IHVpZCxcbiAgICB9O1xuICAgIGRpc3BhdGNoRXZlbnRzKGZlbmNlLCBjb2xsZWN0aW9uTmFtZSwgY2hhbm5lbHMsIFtldmVudF0pO1xufTtcblxuZXhwb3J0IHsgZGlzcGF0Y2hJbnNlcnQsIGRpc3BhdGNoVXBkYXRlLCBkaXNwYXRjaFJlbW92ZSB9O1xuIiwiaW1wb3J0IGdldENoYW5uZWxzIGZyb20gJy4uLy4uL2NhY2hlL2xpYi9nZXRDaGFubmVscyc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZyc7XG5cbi8qKlxuICogQHBhcmFtIGNvbGxlY3Rpb25cbiAqIEBwYXJhbSBfY29uZmlnXG4gKiBAcGFyYW0gbXV0YXRpb25PYmplY3RcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKGNvbGxlY3Rpb24sIF9jb25maWcsIG11dGF0aW9uT2JqZWN0KSB7XG4gICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSBjb2xsZWN0aW9uLl9uYW1lO1xuXG4gICAgaWYgKCFfY29uZmlnIHx8IF8uaXNGdW5jdGlvbihfY29uZmlnKSkge1xuICAgICAgICBfY29uZmlnID0ge307XG4gICAgfVxuXG4gICAgY29uc3QgZGVmYXVsdE92ZXJyaWRlcyA9IHt9O1xuICAgIGlmICghRERQLl9DdXJyZW50TWV0aG9kSW52b2NhdGlvbi5nZXQoKSkge1xuICAgICAgICAvLyBJZiB3ZSdyZSBub3QgaW4gYSBtZXRob2QsIHRoZW4gd2Ugc2hvdWxkIG5ldmVyIG5lZWQgdG8gZG8gb3B0aW1pc3RpY1xuICAgICAgICAvLyB1aSBwcm9jZXNzaW5nLlxuICAgICAgICAvL1xuICAgICAgICAvLyBIb3dldmVyLCB3ZSBhbGxvdyB1c2VycyB0byByZWFsbHkgZm9yY2UgaXQgYnkgZXhwbGljaXRseSBwYXNzaW5nXG4gICAgICAgIC8vIG9wdGltaXN0aWM6IHRydWUgaWYgdGhleSB3YW50IHRvIHVzZSB0aGUgbG9jYWwtZGlzcGF0Y2ggY29kZSBwYXRoXG4gICAgICAgIC8vIHJhdGhlciB0aGFuIGdvaW5nIHRocm91Z2ggUmVkaXMuXG4gICAgICAgIGRlZmF1bHRPdmVycmlkZXMub3B0aW1pc3RpYyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBjb25maWcgPSBfLmV4dGVuZCh7fSwgQ29uZmlnLm11dGF0aW9uRGVmYXVsdHMsIGRlZmF1bHRPdmVycmlkZXMsIF9jb25maWcpO1xuXG4gICAgaWYgKGNvbGxlY3Rpb24uX3JlZGlzT3Bsb2cpIHtcbiAgICAgICAgY29uc3Qge211dGF0aW9ufSA9IGNvbGxlY3Rpb24uX3JlZGlzT3Bsb2c7XG4gICAgICAgIGlmIChtdXRhdGlvbikge1xuICAgICAgICAgICAgbXV0YXRpb24uY2FsbChjb2xsZWN0aW9uLCBjb25maWcsIG11dGF0aW9uT2JqZWN0KVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uZmlnLl9jaGFubmVscyA9IGdldENoYW5uZWxzKGNvbGxlY3Rpb25OYW1lLCBjb25maWcpO1xuXG4gICAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGV2ZW50XG4gKiBAcGFyYW0gZG9jXG4gKiBAcGFyYW0gbW9kaWZpZWRGaWVsZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBldmVudCwgZG9jLCBtb2RpZmllZEZpZWxkcykge1xuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgICAgY2FzZSBFdmVudHMuSU5TRVJUOlxuICAgICAgICAgICAgaGFuZGxlSW5zZXJ0KG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgRXZlbnRzLlVQREFURTpcbiAgICAgICAgICAgIGhhbmRsZVVwZGF0ZShvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jLCBtb2RpZmllZEZpZWxkcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFdmVudHMuUkVNT1ZFOlxuICAgICAgICAgICAgaGFuZGxlUmVtb3ZlKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGV2ZW50IHNwZWNpZmllZDogJHtldmVudH1gKVxuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqL1xuY29uc3QgaGFuZGxlSW5zZXJ0ID0gZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpIHtcbiAgICBpZiAoIW9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpICYmIG9ic2VydmFibGVDb2xsZWN0aW9uLmlzRWxpZ2libGUoZG9jKSkge1xuICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5hZGQoZG9jKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGRvY1xuICogQHBhcmFtIG1vZGlmaWVkRmllbGRzXG4gKi9cbmNvbnN0IGhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jLCBtb2RpZmllZEZpZWxkcykge1xuICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5pc0VsaWdpYmxlKGRvYykpIHtcbiAgICAgICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpKSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5jaGFuZ2UoZG9jLCBtb2RpZmllZEZpZWxkcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5hZGQoZG9jKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5jb250YWlucyhkb2MuX2lkKSkge1xuICAgICAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24ucmVtb3ZlKGRvYy5faWQpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqL1xuY29uc3QgaGFuZGxlUmVtb3ZlID0gZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpIHtcbiAgICBpZiAob2JzZXJ2YWJsZUNvbGxlY3Rpb24uY29udGFpbnMoZG9jLl9pZCkpIHtcbiAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24ucmVtb3ZlKGRvYy5faWQpO1xuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGV2ZW50XG4gKiBAcGFyYW0gZG9jXG4gKiBAcGFyYW0gbW9kaWZpZWRGaWVsZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBldmVudCwgZG9jLCBtb2RpZmllZEZpZWxkcykge1xuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgICAgY2FzZSBFdmVudHMuVVBEQVRFOlxuICAgICAgICAgICAgaGFuZGxlVXBkYXRlKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MsIG1vZGlmaWVkRmllbGRzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEV2ZW50cy5SRU1PVkU6XG4gICAgICAgICAgICBoYW5kbGVSZW1vdmUob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFdmVudHMuSU5TRVJUOlxuICAgICAgICAgICAgaGFuZGxlSW5zZXJ0KG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBJbnZhbGlkIGV2ZW50IHNwZWNpZmllZDogJHtldmVudH1gKVxuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqL1xuY29uc3QgaGFuZGxlSW5zZXJ0ID0gZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpIHtcbiAgICBpZiAoIW9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpICYmIG9ic2VydmFibGVDb2xsZWN0aW9uLmlzRWxpZ2libGUoZG9jKSkge1xuICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5hZGQoZG9jKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGRvY1xuICogQHBhcmFtIG1vZGlmaWVkRmllbGRzXG4gKi9cbmNvbnN0IGhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jLCBtb2RpZmllZEZpZWxkcykge1xuICAgIGNvbnN0IG90aGVyU2VsZWN0b3JzID0gb2JzZXJ2YWJsZUNvbGxlY3Rpb24uX19jb250YWluc090aGVyU2VsZWN0b3JzVGhhbklkO1xuXG4gICAgaWYgKG90aGVyU2VsZWN0b3JzKSB7XG4gICAgICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5pc0VsaWdpYmxlKGRvYykpIHtcbiAgICAgICAgICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5jb250YWlucyhkb2MuX2lkKSkge1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLmNoYW5nZShkb2MsIG1vZGlmaWVkRmllbGRzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24uYWRkKGRvYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5yZW1vdmUoZG9jLl9pZCk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAob2JzZXJ2YWJsZUNvbGxlY3Rpb24uY29udGFpbnMoZG9jLl9pZCkpIHtcbiAgICAgICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLmNoYW5nZShkb2MsIG1vZGlmaWVkRmllbGRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLmFkZChkb2MpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqL1xuY29uc3QgaGFuZGxlUmVtb3ZlID0gZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MpIHtcbiAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5yZW1vdmUoZG9jLl9pZCk7XG59O1xuIiwiaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuLyoqXG4gKiBAcGFyYW0gc2VsZWN0b3JcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0U3RyYXRlZ3koc2VsZWN0b3IgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMubGltaXQgJiYgIW9wdGlvbnMuc29ydCkge1xuICAgICAgICBvcHRpb25zLnNvcnQgPSB7IF9pZDogMSB9O1xuICAgICAgICAvLyB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGBTb3JyeSwgYnV0IHlvdSBhcmUgbm90IGFsbG93ZWQgdG8gdXNlIFwibGltaXRcIiB3aXRob3V0IFwic29ydFwiIG9wdGlvbi5gKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5saW1pdCAmJiBvcHRpb25zLnNvcnQpIHtcbiAgICAgICAgcmV0dXJuIFN0cmF0ZWd5LkxJTUlUX1NPUlQ7XG4gICAgfVxuXG4gICAgaWYgKHNlbGVjdG9yICYmIHNlbGVjdG9yLl9pZCkge1xuICAgICAgICByZXR1cm4gU3RyYXRlZ3kuREVESUNBVEVEX0NIQU5ORUxTO1xuICAgIH1cblxuICAgIHJldHVybiBTdHJhdGVneS5ERUZBVUxUO1xufSIsImltcG9ydCB7IFN0cmF0ZWd5IH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuaW1wb3J0IGRlZmF1bHRTdHJhdGVneSBmcm9tICcuL2RlZmF1bHQnO1xuaW1wb3J0IGRpcmVjdFN0cmF0ZWd5IGZyb20gJy4vZGlyZWN0JztcbmltcG9ydCBsaW1pdFNvcnRTdHJhdGVneSBmcm9tICcuL2xpbWl0LXNvcnQnO1xuaW1wb3J0IGdldFN0cmF0ZWd5IGZyb20gJy4vZ2V0U3RyYXRlZ3knO1xuXG5jb25zdCBTdHJhdGVneVByb2Nlc3Nvck1hcCA9IHtcbiAgICBbU3RyYXRlZ3kuTElNSVRfU09SVF06IGxpbWl0U29ydFN0cmF0ZWd5LFxuICAgIFtTdHJhdGVneS5ERUZBVUxUXTogZGVmYXVsdFN0cmF0ZWd5LFxuICAgIFtTdHJhdGVneS5ERURJQ0FURURfQ0hBTk5FTFNdOiBkaXJlY3RTdHJhdGVneVxufTtcblxuZXhwb3J0IHsgZ2V0U3RyYXRlZ3kgfVxuXG4vKipcbiAqIEBwYXJhbSBzdHJhdGVneVxuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9jZXNzb3Ioc3RyYXRlZ3kpIHtcbiAgICByZXR1cm4gU3RyYXRlZ3lQcm9jZXNzb3JNYXBbc3RyYXRlZ3ldO1xufSIsImltcG9ydCB7IEV2ZW50cyB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBoYXNTb3J0RmllbGRzIH0gZnJvbSAnLi9saWIvZmllbGRzRXhpc3QnO1xuaW1wb3J0IHJlcXVlcnkgZnJvbSAnLi9hY3Rpb25zL3JlcXVlcnknO1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGV2ZW50XG4gKiBAcGFyYW0gZG9jXG4gKiBAcGFyYW0gbW9kaWZpZWRGaWVsZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24ob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGV2ZW50LCBkb2MsIG1vZGlmaWVkRmllbGRzKSB7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgICBjYXNlIEV2ZW50cy5JTlNFUlQ6XG4gICAgICAgICAgICBoYW5kbGVJbnNlcnQob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFdmVudHMuVVBEQVRFOlxuICAgICAgICAgICAgaGFuZGxlVXBkYXRlKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MsIG1vZGlmaWVkRmllbGRzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEV2ZW50cy5SRU1PVkU6XG4gICAgICAgICAgICBoYW5kbGVSZW1vdmUob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYEludmFsaWQgZXZlbnQgc3BlY2lmaWVkOiAke2V2ZW50fWApO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqL1xuY29uc3QgaGFuZGxlSW5zZXJ0ID0gZnVuY3Rpb24ob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYykge1xuICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5pc0VsaWdpYmxlKGRvYykpIHtcbiAgICAgICAgcmVxdWVyeShvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGRvY1xuICogQHBhcmFtIG1vZGlmaWVkRmllbGRzXG4gKi9cbmNvbnN0IGhhbmRsZVVwZGF0ZSA9IGZ1bmN0aW9uKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MsIG1vZGlmaWVkRmllbGRzKSB7XG4gICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpKSB7XG4gICAgICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5pc0VsaWdpYmxlKGRvYykpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBoYXNTb3J0RmllbGRzKG9ic2VydmFibGVDb2xsZWN0aW9uLm9wdGlvbnMuc29ydCwgbW9kaWZpZWRGaWVsZHMpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICByZXF1ZXJ5KFxuICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZG9jLFxuICAgICAgICAgICAgICAgICAgICBFdmVudHMuVVBEQVRFLFxuICAgICAgICAgICAgICAgICAgICBtb2RpZmllZEZpZWxkc1xuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLmNoYW5nZShkb2MsIG1vZGlmaWVkRmllbGRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlcnkob2JzZXJ2YWJsZUNvbGxlY3Rpb24pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLmlzRWxpZ2libGUoZG9jKSkge1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIGhhc1NvcnRGaWVsZHMob2JzZXJ2YWJsZUNvbGxlY3Rpb24ub3B0aW9ucy5zb3J0LCBtb2RpZmllZEZpZWxkcylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgZG9jdW1lbnQgaXNuJ3QgaW4gdGhlIG9ic2VydmFibGUgY29sbGVjdGlvbiwgYnV0IGEgZmllbGQgdGhhdFxuICAgICAgICAgICAgICAgIC8vIGlzIHJlbGF0ZWQgdG8gc29ydGluZyBoYXMgY2hhbmdlZCwgc28gdGhlIG9yZGVyIGFuZCBpbWFnZSBtYXkgaGF2ZSBjaGFuZ2VkXG4gICAgICAgICAgICAgICAgcmVxdWVyeShcbiAgICAgICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgIGRvYyxcbiAgICAgICAgICAgICAgICAgICAgRXZlbnRzLlVQREFURSxcbiAgICAgICAgICAgICAgICAgICAgbW9kaWZpZWRGaWVsZHNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZG9jdW1lbnQgaXMgbm93IGVsaWdpYmxlIGFuZCBpdCBkb2VzIG5vdCBiZWxvbmcgaW4gdGhlIGluaXRpYWwgdmFsdWVzXG4gICAgICAgICAgICAgICAgLy8gV2Ugb25seSBhZGQgaXQgdG8gdGhlIHN0b3JlIGlmIGFuZCBvbmx5IGlmIHdlIGRvIG5vdCBzdXJwYXNzIHRoZSBsaW1pdFxuICAgICAgICAgICAgICAgIGlmICghb2JzZXJ2YWJsZUNvbGxlY3Rpb24uaXNMaW1pdFJlYWNoZWQoKSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5hZGQoZG9jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGRvY1xuICovXG5jb25zdCBoYW5kbGVSZW1vdmUgPSBmdW5jdGlvbihvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jKSB7XG4gICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpKSB7XG4gICAgICAgIHJlcXVlcnkob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLm9wdGlvbnMuc2tpcCkge1xuICAgICAgICAgICAgcmVxdWVyeShvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJpbXBvcnQgeyBFdmVudHMgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG4vKipcbiAqIFN5bnRoZXRpYyBwcm9jZXNzb3JzIHByb2Nlc3NlcyB2aXJ0dWFsIG11dGF0aW9ucyB0aGF0IGFyZW4ndCBhY3R1YWxseSBwZXJzaXN0ZWQgaW4gdGhlIGRhdGFiYXNlXG4gKiBCdXQgaXQgd2lsbCBtYWtlIGl0IGJlaGF2ZSBsaWtlIHRoZXkgd2VyZS5cbiAqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBldmVudFxuICogQHBhcmFtIGRvY1xuICogQHBhcmFtIG1vZGlmaWVyXG4gKiBAcGFyYW0gbW9kaWZpZWRUb3BMZXZlbEZpZWxkc1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGV2ZW50LCBkb2MsIG1vZGlmaWVyLCBtb2RpZmllZFRvcExldmVsRmllbGRzKSB7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgICBjYXNlIEV2ZW50cy5JTlNFUlQ6XG4gICAgICAgICAgICBoYW5kbGVJbnNlcnQob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBFdmVudHMuVVBEQVRFOlxuICAgICAgICAgICAgaGFuZGxlVXBkYXRlKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MsIG1vZGlmaWVyLCBtb2RpZmllZFRvcExldmVsRmllbGRzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEV2ZW50cy5SRU1PVkU6XG4gICAgICAgICAgICBoYW5kbGVSZW1vdmUob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYEludmFsaWQgZXZlbnQgc3BlY2lmaWVkOiAke2V2ZW50fWApXG4gICAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSBvYnNlcnZhYmxlQ29sbGVjdGlvblxuICogQHBhcmFtIGRvY1xuICovXG5jb25zdCBoYW5kbGVJbnNlcnQgPSBmdW5jdGlvbiAob2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGRvYykge1xuICAgIGlmIChvYnNlcnZhYmxlQ29sbGVjdGlvbi5pc0VsaWdpYmxlKGRvYykpIHtcbiAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24uYWRkKGRvYywgdHJ1ZSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBkb2NcbiAqIEBwYXJhbSBtb2RpZmllclxuICogQHBhcmFtIG1vZGlmaWVkVG9wTGV2ZWxGaWVsZHNcbiAqL1xuY29uc3QgaGFuZGxlVXBkYXRlID0gZnVuY3Rpb24gKG9ic2VydmFibGVDb2xsZWN0aW9uLCBkb2MsIG1vZGlmaWVyLCBtb2RpZmllZFRvcExldmVsRmllbGRzKSB7XG4gICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24uY2hhbmdlU3ludGhldGljKGRvYy5faWQsIG1vZGlmaWVyLCBtb2RpZmllZFRvcExldmVsRmllbGRzKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIG9ic2VydmFibGVDb2xsZWN0aW9uXG4gKiBAcGFyYW0gZG9jXG4gKi9cbmNvbnN0IGhhbmRsZVJlbW92ZSA9IGZ1bmN0aW9uIChvYnNlcnZhYmxlQ29sbGVjdGlvbiwgZG9jKSB7XG4gICAgaWYgKG9ic2VydmFibGVDb2xsZWN0aW9uLmNvbnRhaW5zKGRvYy5faWQpKSB7XG4gICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLnJlbW92ZShkb2MuX2lkKTtcbiAgICB9XG59OyIsImltcG9ydCB7X30gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgTW9uZ29JRE1hcCB9IGZyb20gJy4uLy4uL2NhY2hlL21vbmdvSWRNYXAnO1xuXG4vKipcbiAqIE1vc3QgbGlrZWx5IHVzZWQgd2hlbiByZWRpcyBjb25uZWN0aW9uIHJlc3VtZXMuXG4gKiBJdCByZWZyZXNoZXMgdGhlIGNvbGxlY3Rpb24gZnJvbSB0aGUgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG9ic2VydmFibGVDb2xsZWN0aW9uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvYnNlcnZhYmxlQ29sbGVjdGlvbikge1xuICAgIGNvbnN0IHsgc3RvcmUsIGN1cnNvciB9ID0gb2JzZXJ2YWJsZUNvbGxlY3Rpb247XG5cbiAgICBjb25zdCBmcmVzaERhdGEgPSBjdXJzb3IuZmV0Y2goKTtcblxuICAgIGNvbnN0IG5ld1N0b3JlID0gbmV3IE1vbmdvSURNYXAoKTtcbiAgICBmcmVzaERhdGEuZm9yRWFjaCgoZG9jKSA9PiBuZXdTdG9yZS5zZXQoZG9jLl9pZCwgZG9jKSk7XG5cbiAgICBzdG9yZS5jb21wYXJlV2l0aChuZXdTdG9yZSwge1xuICAgICAgICBib3RoKGRvY0lkLCBvbGREb2MsIG5ld0RvYykge1xuICAgICAgICAgICAgY29uc3QgbW9kaWZpZWRGaWVsZHMgPSBfLnVuaW9uKF8ua2V5cyhvbGREb2MpLCBfLmtleXMobmV3RG9jKSk7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5jaGFuZ2UobmV3RG9jLCBtb2RpZmllZEZpZWxkcyk7XG4gICAgICAgIH0sXG4gICAgICAgIGxlZnRPbmx5KGRvY0lkKSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5yZW1vdmUoZG9jSWQpO1xuICAgICAgICB9LFxuICAgICAgICByaWdodE9ubHkoZG9jSWQsIG5ld0RvYykge1xuICAgICAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24uYWRkKG5ld0RvYyk7XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgRXZlbnRzIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IE1vbmdvSURNYXAgfSBmcm9tICcuLi8uLi9jYWNoZS9tb25nb0lkTWFwJztcblxuLyoqXG4gKiBAcGFyYW0gb2JzZXJ2YWJsZUNvbGxlY3Rpb25cbiAqIEBwYXJhbSBuZXdDb21tZXJcbiAqIEBwYXJhbSBldmVudFxuICogQHBhcmFtIG1vZGlmaWVkRmllbGRzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvYnNlcnZhYmxlQ29sbGVjdGlvbiwgbmV3Q29tbWVyLCBldmVudCwgbW9kaWZpZWRGaWVsZHMpIHtcbiAgICBjb25zdCB7IHN0b3JlLCBzZWxlY3Rvciwgb3B0aW9ucyB9ID0gb2JzZXJ2YWJsZUNvbGxlY3Rpb247XG5cbiAgICBjb25zdCBuZXdTdG9yZSA9IG5ldyBNb25nb0lETWFwKCk7XG4gICAgY29uc3QgZnJlc2hJZHMgPSBvYnNlcnZhYmxlQ29sbGVjdGlvbi5jb2xsZWN0aW9uLmZpbmQoXG4gICAgICAgIHNlbGVjdG9yLCB7IC4uLm9wdGlvbnMsIGZpZWxkczogeyBfaWQ6IDEgfSB9KS5mZXRjaCgpO1xuICAgIGZyZXNoSWRzLmZvckVhY2goZG9jID0+IG5ld1N0b3JlLnNldChkb2MuX2lkLCBkb2MpKTtcblxuICAgIGxldCBhZGRlZCA9IGZhbHNlO1xuICAgIHN0b3JlLmNvbXBhcmVXaXRoKG5ld1N0b3JlLCB7XG4gICAgICAgIGxlZnRPbmx5KGRvY0lkKSB7XG4gICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5yZW1vdmUoZG9jSWQpO1xuICAgICAgICB9LFxuICAgICAgICByaWdodE9ubHkoZG9jSWQpIHtcbiAgICAgICAgICAgIGlmIChuZXdDb21tZXIgJiYgRUpTT04uZXF1YWxzKGRvY0lkLCBuZXdDb21tZXIuX2lkKSkge1xuICAgICAgICAgICAgICAgIGFkZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBvYnNlcnZhYmxlQ29sbGVjdGlvbi5hZGQobmV3Q29tbWVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2YWJsZUNvbGxlY3Rpb24uYWRkQnlJZChkb2NJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGlmIHdlIGhhdmUgYW4gdXBkYXRlLCBhbmQgd2UgaGF2ZSBhIG5ld2NvbW1lciwgdGhhdCBuZXcgY29tbWVyIG1heSBiZSBpbnNpZGUgdGhlIGlkc1xuICAgIC8vIFRPRE86IG1heWJlIHJlZmFjdG9yIHRoaXMgaW4gYSBzZXBhcmF0ZSBhY3Rpb24gKD8pXG4gICAgaWYgKG5ld0NvbW1lclxuICAgICAgICAmJiBFdmVudHMuVVBEQVRFID09PSBldmVudFxuICAgICAgICAmJiBtb2RpZmllZEZpZWxkc1xuICAgICAgICAmJiAhYWRkZWRcbiAgICAgICAgJiYgc3RvcmUuaGFzKG5ld0NvbW1lci5faWQpKSB7XG4gICAgICAgIG9ic2VydmFibGVDb2xsZWN0aW9uLmNoYW5nZShuZXdDb21tZXIsIG1vZGlmaWVkRmllbGRzKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vKipcbiAqIEBwYXJhbSBmaWVsZHNPYmplY3Qge09iamVjdH0ge1wicHJvZmlsZS5maXJzdE5hbWVcIjogMSwgXCJyb2xlc1wiOiAxLCBcInNvbWV0aGluZ1wiOiAxIH1cbiAqIEBwYXJhbSBmaWVsZHNBcnJheSB7QXJyYXl9IFtcInByb2ZpbGVcIiwgXCJyb2xlcy54eFwiLCBcInNvbWV0aGluZ1wiIF1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc1NvcnRGaWVsZHMoZmllbGRzT2JqZWN0LCBmaWVsZHNBcnJheSkge1xuICAgIGNvbnN0IGV4aXN0aW5nRmllbGRzID0gXy5rZXlzKGZpZWxkc09iamVjdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCA7IGkgPCBmaWVsZHNBcnJheS5sZW5ndGggOyBpKyspIHtcbiAgICAgICAgY29uc3QgZmllbGQgPSBmaWVsZHNBcnJheVtpXTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBleGlzdGluZ0ZpZWxkcy5sZW5ndGggOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nRmllbGQgPSBleGlzdGluZ0ZpZWxkc1tqXTtcblxuICAgICAgICAgICAgaWYgKGV4aXN0aW5nRmllbGQgPT0gZmllbGRcbiAgICAgICAgICAgICAgICB8fCBmaWVsZC5pbmRleE9mKGV4aXN0aW5nRmllbGQgKyAnLicpICE9IC0xXG4gICAgICAgICAgICAgICAgfHwgZXhpc3RpbmdGaWVsZC5pbmRleE9mKGZpZWxkICsgJy4nKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufSIsImltcG9ydCB7IGdldFJlZGlzTGlzdGVuZXIsIGdldFJlZGlzUHVzaGVyIH0gZnJvbSAnLi9nZXRSZWRpc0NsaWVudCc7XG5cbi8qKlxuICogTWFuYWdlcyBjb21tdW5pY2F0aW9uIHdpdGggUmVkaXNcbiAqIFVuaWZpZXMgYWxsIGxpYnJhcmllcyB0aGF0IHVzZSB0aGlzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFB1YlN1Yk1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNoYW5uZWxIYW5kbGVycyA9IHt9O1xuICAgICAgICB0aGlzLnF1ZXVlID0gbmV3IE1ldGVvci5fU3luY2hyb25vdXNRdWV1ZSgpO1xuXG4gICAgICAgIHRoaXMubGlzdGVuZXIgPSBnZXRSZWRpc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMucHVzaGVyID0gZ2V0UmVkaXNQdXNoZXIoKTtcblxuICAgICAgICB0aGlzLl9pbml0TWVzc2FnZUxpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHVzaGVzIHRvIFJlZGlzXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbWVzc2FnZVxuICAgICAqL1xuICAgIHB1Ymxpc2goY2hhbm5lbCwgbWVzc2FnZSkge1xuICAgICAgICB0aGlzLnB1c2hlci5wdWJsaXNoKGNoYW5uZWwsIEVKU09OLnN0cmluZ2lmeShtZXNzYWdlKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyXG4gICAgICovXG4gICAgc3Vic2NyaWJlKGNoYW5uZWwsIGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5xdWV1ZS5xdWV1ZVRhc2soKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2luaXRDaGFubmVsKGNoYW5uZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXS5wdXNoKGhhbmRsZXIpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhbm5lbFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXJcbiAgICAgKi9cbiAgICB1bnN1YnNjcmliZShjaGFubmVsLCBoYW5kbGVyKSB7XG4gICAgICAgIHRoaXMucXVldWUucXVldWVUYXNrKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5jaGFubmVsSGFuZGxlcnNbY2hhbm5lbF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbEhhbmRsZXJzW2NoYW5uZWxdID0gdGhpcy5jaGFubmVsSGFuZGxlcnNbY2hhbm5lbF0uZmlsdGVyKF9oYW5kbGVyID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gX2hhbmRsZXIgIT09IGhhbmRsZXI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbm5lbEhhbmRsZXJzW2NoYW5uZWxdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc3Ryb3lDaGFubmVsKGNoYW5uZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEluaXRpYWxpemVzIGxpc3RlbmluZyBmb3IgcmVkaXMgbWVzc2FnZXNcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pbml0TWVzc2FnZUxpc3RlbmVyKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICB0aGlzLmxpc3RlbmVyLm9uKCdtZXNzYWdlJywgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudChmdW5jdGlvbihjaGFubmVsLCBfbWVzc2FnZSkge1xuICAgICAgICAgICAgaWYgKHNlbGYuY2hhbm5lbEhhbmRsZXJzW2NoYW5uZWxdKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IEVKU09OLnBhcnNlKF9tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXS5mb3JFYWNoKGNoYW5uZWxIYW5kbGVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2hhbm5lbEhhbmRsZXIobWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjaGFubmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaW5pdENoYW5uZWwoY2hhbm5lbCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyLnN1YnNjcmliZShjaGFubmVsKTtcblxuICAgICAgICB0aGlzLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXSA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjaGFubmVsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZGVzdHJveUNoYW5uZWwoY2hhbm5lbCkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyLnVuc3Vic2NyaWJlKGNoYW5uZWwpO1xuXG4gICAgICAgIGRlbGV0ZSB0aGlzLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTdHJhdGVneSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRQcm9jZXNzb3IgfSBmcm9tICcuLi9wcm9jZXNzb3JzJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBleHRyYWN0SWRzRnJvbVNlbGVjdG9yIGZyb20gJy4uL3V0aWxzL2V4dHJhY3RJZHNGcm9tU2VsZWN0b3InO1xuaW1wb3J0IFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlciBmcm9tICcuL1JlZGlzU3Vic2NyaXB0aW9uTWFuYWdlcic7XG5pbXBvcnQgc3ludGhldGljUHJvY2Vzc29yIGZyb20gJy4uL3Byb2Nlc3NvcnMvc3ludGhldGljJztcbmltcG9ydCBnZXREZWRpY2F0ZWRDaGFubmVsIGZyb20gJy4uL3V0aWxzL2dldERlZGljYXRlZENoYW5uZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWRpc1N1YnNjcmliZXIge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwdWJsaWNhdGlvbkVudHJ5XG4gICAgICogQHBhcmFtIHN0cmF0ZWd5XG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHVibGljYXRpb25FbnRyeSwgc3RyYXRlZ3kpIHtcbiAgICAgICAgdGhpcy5wdWJsaWNhdGlvbkVudHJ5ID0gcHVibGljYXRpb25FbnRyeTtcbiAgICAgICAgdGhpcy5vYnNlcnZhYmxlQ29sbGVjdGlvbiA9IHB1YmxpY2F0aW9uRW50cnkub2JzZXJ2YWJsZUNvbGxlY3Rpb247XG4gICAgICAgIHRoaXMuc3RyYXRlZ3kgPSBzdHJhdGVneTtcbiAgICAgICAgdGhpcy5wcm9jZXNzb3IgPSBnZXRQcm9jZXNzb3Ioc3RyYXRlZ3kpO1xuXG4gICAgICAgIC8vIFdlIGRvIHRoaXMgYmVjYXVzZSB3ZSBvdmVycmlkZSB0aGUgYmVoYXZpb3Igb2YgZGVkaWNhdGVkIFwiX2lkXCIgY2hhbm5lbHNcbiAgICAgICAgdGhpcy5jaGFubmVscyA9IHRoaXMuZ2V0Q2hhbm5lbHModGhpcy5vYnNlcnZhYmxlQ29sbGVjdGlvbi5jaGFubmVscyk7XG5cbiAgICAgICAgUmVkaXNTdWJzY3JpcHRpb25NYW5hZ2VyLmF0dGFjaCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2hhbm5lbHNcbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXRDaGFubmVscyhjaGFubmVscykge1xuICAgICAgICBjb25zdCBjb2xsZWN0aW9uTmFtZSA9IHRoaXMub2JzZXJ2YWJsZUNvbGxlY3Rpb24uY29sbGVjdGlvbk5hbWU7XG5cbiAgICAgICAgc3dpdGNoICh0aGlzLnN0cmF0ZWd5KSB7XG4gICAgICAgICAgICBjYXNlIFN0cmF0ZWd5LkRFRkFVTFQ6XG4gICAgICAgICAgICBjYXNlIFN0cmF0ZWd5LkxJTUlUX1NPUlQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoYW5uZWxzO1xuICAgICAgICAgICAgY2FzZSBTdHJhdGVneS5ERURJQ0FURURfQ0hBTk5FTFM6XG4gICAgICAgICAgICAgICAgY29uc3QgaWRzID0gZXh0cmFjdElkc0Zyb21TZWxlY3Rvcih0aGlzLm9ic2VydmFibGVDb2xsZWN0aW9uLnNlbGVjdG9yKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBpZHMubWFwKGlkID0+IGdldERlZGljYXRlZENoYW5uZWwoY29sbGVjdGlvbk5hbWUsIGlkKSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoYFN0cmF0ZWd5IGNvdWxkIG5vdCBiZSBmb3VuZDogJHt0aGlzLnN0cmF0ZWd5fWApXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqL1xuICAgIHByb2Nlc3MoLi4uYXJncykge1xuICAgICAgICB0aGlzLnByb2Nlc3Nvci5jYWxsKG51bGwsIHRoaXMub2JzZXJ2YWJsZUNvbGxlY3Rpb24sIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBldmVudFxuICAgICAqIEBwYXJhbSBkb2NcbiAgICAgKiBAcGFyYW0gbW9kaWZpZXJcbiAgICAgKiBAcGFyYW0gbW9kaWZpZWRUb3BMZXZlbEZpZWxkc1xuICAgICAqL1xuICAgIHByb2Nlc3NTeW50aGV0aWMoZXZlbnQsIGRvYywgbW9kaWZpZXIsIG1vZGlmaWVkVG9wTGV2ZWxGaWVsZHMpIHtcbiAgICAgICAgc3ludGhldGljUHJvY2Vzc29yKHRoaXMub2JzZXJ2YWJsZUNvbGxlY3Rpb24sIGV2ZW50LCBkb2MsIG1vZGlmaWVyLCBtb2RpZmllZFRvcExldmVsRmllbGRzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZXRhY2hlcyBmcm9tIFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlclxuICAgICAqL1xuICAgIHN0b3AoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIuZGV0YWNoKHRoaXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFtSZWRpc1N1YnNjcmliZXJdIFdlaXJkISBUaGVyZSB3YXMgYW4gZXJyb3Igd2hpbGUgc3RvcHBpbmcgdGhlIHB1YmxpY2F0aW9uOiBgLCBlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgZmllbGRzIHRoYXQgYXJlIHVzZWQgZm9yIG1hdGNoaW5nIHRoZSB2YWxpZGl0eSBvZiB0aGUgZG9jdW1lbnRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHthcnJheX1cbiAgICAgKi9cbiAgICBnZXRGaWVsZHNPZkludGVyZXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYnNlcnZhYmxlQ29sbGVjdGlvbi5maWVsZHNPZkludGVyZXN0O1xuICAgIH1cbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUmFuZG9tIH0gZnJvbSAnbWV0ZW9yL3JhbmRvbSc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGRlYnVnIGZyb20gJy4uL2RlYnVnJztcbmltcG9ydCB7IFJlZGlzUGlwZSwgRXZlbnRzIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBnZXRGaWVsZHNPZkludGVyZXN0RnJvbUFsbCBmcm9tICcuL2xpYi9nZXRGaWVsZHNPZkludGVyZXN0RnJvbUFsbCc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5cbmNsYXNzIFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlciB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudWlkID0gUmFuZG9tLmlkKCk7XG4gICAgICAgIHRoaXMucXVldWUgPSBuZXcgTWV0ZW9yLl9TeW5jaHJvbm91c1F1ZXVlKCk7XG4gICAgICAgIHRoaXMuc3RvcmUgPSB7fTsgLy8ge2NoYW5uZWw6IFtSZWRpc1N1YnNjcmliZXJzXX1cbiAgICAgICAgdGhpcy5jaGFubmVsSGFuZGxlcnMgPSB7fTsgLy8ge2NoYW5uZWw6IGhhbmRsZXJ9XG5cbiAgICAgICAgdGhpcy5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcmVkaXNTdWJzY3JpYmVyXG4gICAgICovXG4gICAgYXR0YWNoKHJlZGlzU3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLnF1ZXVlLnF1ZXVlVGFzaygoKSA9PiB7XG4gICAgICAgICAgICBfLmVhY2gocmVkaXNTdWJzY3JpYmVyLmNoYW5uZWxzLCBjaGFubmVsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmVbY2hhbm5lbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hhbm5lbChjaGFubmVsKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0b3JlW2NoYW5uZWxdLnB1c2gocmVkaXNTdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcmVkaXNTdWJzY3JpYmVyXG4gICAgICovXG4gICAgZGV0YWNoKHJlZGlzU3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLnF1ZXVlLnF1ZXVlVGFzaygoKSA9PiB7XG4gICAgICAgICAgICBfLmVhY2gocmVkaXNTdWJzY3JpYmVyLmNoYW5uZWxzLCBjaGFubmVsID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuc3RvcmVbY2hhbm5lbF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlYnVnKFxuICAgICAgICAgICAgICAgICAgICAgICAgJ1tSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXJdIFRyeWluZyB0byBkZXRhY2ggYSBzdWJzY3JpYmVyIG9uIGEgbm9uIGV4aXN0ZW50IGNoYW5uZWxzLidcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0b3JlW2NoYW5uZWxdID0gXy53aXRob3V0KFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdG9yZVtjaGFubmVsXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZGlzU3Vic2NyaWJlclxuICAgICAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0b3JlW2NoYW5uZWxdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXN0cm95Q2hhbm5lbChjaGFubmVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2hhbm5lbFxuICAgICAqL1xuICAgIGluaXRpYWxpemVDaGFubmVsKGNoYW5uZWwpIHtcbiAgICAgICAgZGVidWcoYFtSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXJdIFN1YnNjcmliaW5nIHRvIGNoYW5uZWw6ICR7Y2hhbm5lbH1gKTtcblxuICAgICAgICAvLyBjcmVhdGUgdGhlIGhhbmRsZXIgZm9yIHRoaXMgY2hhbm5lbFxuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHNlbGYucXVldWUucXVldWVUYXNrKCgpID0+IHtcbiAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3MoY2hhbm5lbCwgbWVzc2FnZSwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNoYW5uZWxIYW5kbGVyc1tjaGFubmVsXSA9IGhhbmRsZXI7XG4gICAgICAgIHRoaXMuc3RvcmVbY2hhbm5lbF0gPSBbXTtcblxuICAgICAgICBjb25zdCB7IHB1YlN1Yk1hbmFnZXIgfSA9IENvbmZpZztcbiAgICAgICAgcHViU3ViTWFuYWdlci5zdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNoYW5uZWxcbiAgICAgKi9cbiAgICBkZXN0cm95Q2hhbm5lbChjaGFubmVsKSB7XG4gICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgYFtSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXJdIFVuc3Vic2NyaWJpbmcgZnJvbSBjaGFubmVsOiAke2NoYW5uZWx9YFxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHsgcHViU3ViTWFuYWdlciB9ID0gQ29uZmlnO1xuICAgICAgICBwdWJTdWJNYW5hZ2VyLnVuc3Vic2NyaWJlKGNoYW5uZWwsIHRoaXMuY2hhbm5lbEhhbmRsZXJzW2NoYW5uZWxdKTtcblxuICAgICAgICBkZWxldGUgdGhpcy5zdG9yZVtjaGFubmVsXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2hhbm5lbEhhbmRsZXJzW2NoYW5uZWxdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBjaGFubmVsXG4gICAgICogQHBhcmFtIGRhdGFcbiAgICAgKiBAcGFyYW0gW2Zyb21SZWRpcz1mYWxzZV1cbiAgICAgKi9cbiAgICBwcm9jZXNzKGNoYW5uZWwsIGRhdGEsIGZyb21SZWRpcykge1xuICAgICAgICAvLyBtZXNzYWdlcyBmcm9tIHJlZGlzIHRoYXQgY29udGFpbiBvdXIgdWlkIHdlcmUgaGFuZGxlZFxuICAgICAgICAvLyAgb3B0aW1pc3RpY2FsbHksIHNvIHdlIGNhbiBkcm9wIHRoZW0uXG4gICAgICAgIGlmIChmcm9tUmVkaXMgJiYgZGF0YVtSZWRpc1BpcGUuVUlEXSA9PT0gdGhpcy51aWQpe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlcnMgPSB0aGlzLnN0b3JlW2NoYW5uZWxdO1xuICAgICAgICBpZiAoIXN1YnNjcmliZXJzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaXNTeW50aGV0aWMgPSBkYXRhW1JlZGlzUGlwZS5TWU5USEVUSUNdO1xuXG4gICAgICAgIGRlYnVnKFxuICAgICAgICAgICAgYFtSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXJdIFJlY2VpdmVkICR7XG4gICAgICAgICAgICAgICAgaXNTeW50aGV0aWMgPyAnc3ludGhldGljICcgOiAnJ1xuICAgICAgICAgICAgfWV2ZW50OiBcIiR7ZGF0YVtSZWRpc1BpcGUuRVZFTlRdfVwiIHRvIFwiJHtjaGFubmVsfVwiYFxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChzdWJzY3JpYmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNTeW50aGV0aWMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBzdWJzY3JpYmVyc1swXS5vYnNlcnZhYmxlQ29sbGVjdGlvbi5jb2xsZWN0aW9uO1xuXG4gICAgICAgICAgICBsZXQgZG9jO1xuICAgICAgICAgICAgaWYgKGRhdGFbUmVkaXNQaXBlLkVWRU5UXSA9PT0gRXZlbnRzLlJFTU9WRSkge1xuICAgICAgICAgICAgICAgIGRvYyA9IGRhdGFbUmVkaXNQaXBlLkRPQ107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvYyA9IHRoaXMuZ2V0RG9jKGNvbGxlY3Rpb24sIHN1YnNjcmliZXJzLCBkYXRhKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gaWYgYnkgYW55IGNoYW5jZSBpdCB3YXMgZGVsZXRlZCBhZnRlciBpdCBnb3QgZGlzcGF0Y2hlZFxuICAgICAgICAgICAgLy8gZG9jIHdpbGwgYmUgdW5kZWZpbmVkXG4gICAgICAgICAgICBpZiAoIWRvYykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3Vic2NyaWJlcnMuZm9yRWFjaChyZWRpc1N1YnNjcmliZXIgPT4ge1xuICAgICAgICAgICAgICAgIHJlZGlzU3Vic2NyaWJlci5wcm9jZXNzKFxuICAgICAgICAgICAgICAgICAgICBkYXRhW1JlZGlzUGlwZS5FVkVOVF0sXG4gICAgICAgICAgICAgICAgICAgIGRvYyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtSZWRpc1BpcGUuRklFTERTXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXJzLmZvckVhY2gocmVkaXNTdWJzY3JpYmVyID0+IHtcbiAgICAgICAgICAgICAgICByZWRpc1N1YnNjcmliZXIucHJvY2Vzc1N5bnRoZXRpYyhcbiAgICAgICAgICAgICAgICAgICAgZGF0YVtSZWRpc1BpcGUuRVZFTlRdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhW1JlZGlzUGlwZS5ET0NdLFxuICAgICAgICAgICAgICAgICAgICBkYXRhW1JlZGlzUGlwZS5NT0RJRklFUl0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGFbUmVkaXNQaXBlLk1PRElGSUVEX1RPUF9MRVZFTF9GSUVMRFNdXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb25cbiAgICAgKiBAcGFyYW0gc3Vic2NyaWJlcnNcbiAgICAgKiBAcGFyYW0gZGF0YVxuICAgICAqL1xuICAgIGdldERvYyhjb2xsZWN0aW9uLCBzdWJzY3JpYmVycywgZGF0YSkge1xuICAgICAgICBjb25zdCBldmVudCA9IGRhdGFbUmVkaXNQaXBlLkVWRU5UXTtcbiAgICAgICAgbGV0IGRvYyA9IGRhdGFbUmVkaXNQaXBlLkRPQ107XG5cbiAgICAgICAgY29uc3QgZmllbGRzT2ZJbnRlcmVzdCA9IGdldEZpZWxkc09mSW50ZXJlc3RGcm9tQWxsKHN1YnNjcmliZXJzKTtcblxuICAgICAgICBpZiAoZmllbGRzT2ZJbnRlcmVzdCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgZG9jID0gY29sbGVjdGlvbi5maW5kT25lKGRvYy5faWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9jID0gY29sbGVjdGlvbi5maW5kT25lKGRvYy5faWQsIHsgZmllbGRzOiBmaWVsZHNPZkludGVyZXN0IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRvYztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIoKTtcbiIsImltcG9ydCByZWRpcyBmcm9tICdyZWRpcyc7XG5pbXBvcnQgQ29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG4vLyBSZWRpcyByZXF1aXJlcyB0d28gY29ubmVjdGlvbnMgZm9yIHB1c2hpbmcgYW5kIGxpc3RlbmluZyB0byBkYXRhXG5sZXQgcmVkaXNQdXNoZXI7XG5sZXQgcmVkaXNMaXN0ZW5lcjtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwdXNoZXIgZm9yIGV2ZW50cyBpbiBSZWRpc1xuICpcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkaXNQdXNoZXIoKSB7XG4gICAgaWYgKCFyZWRpc1B1c2hlcikge1xuICAgICAgICByZWRpc1B1c2hlciA9IHJlZGlzLmNyZWF0ZUNsaWVudChfLmV4dGVuZCh7fSwgQ29uZmlnLnJlZGlzLCB7XG4gICAgICAgICAgICByZXRyeV9zdHJhdGVneTogZ2V0UmV0cnlTdHJhdGVneSgpXG4gICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVkaXNQdXNoZXI7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbGlzdGVuZXIgZm9yIGV2ZW50cyBpbiBSZWRpc1xuICpcbiAqIEBwYXJhbSBvbkNvbm5lY3RcbiAqIEByZXR1cm5zIHsqfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVkaXNMaXN0ZW5lcih7b25Db25uZWN0fSA9IHt9KSB7XG4gICAgaWYgKCFyZWRpc0xpc3RlbmVyKSB7XG4gICAgICAgIHJlZGlzTGlzdGVuZXIgPSByZWRpcy5jcmVhdGVDbGllbnQoXy5leHRlbmQoe30sIENvbmZpZy5yZWRpcywge1xuICAgICAgICAgICAgcmV0cnlfc3RyYXRlZ3k6IGdldFJldHJ5U3RyYXRlZ3koKVxuICAgICAgICB9KSk7XG5cbiAgICAgICAgLy8gd2Ugb25seSBhdHRhY2ggZXZlbnRzIGhlcmVcbiAgICAgICAgYXR0YWNoRXZlbnRzKHJlZGlzTGlzdGVuZXIsIHtvbkNvbm5lY3R9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVkaXNMaXN0ZW5lcjtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGNsaWVudFxuICogQHBhcmFtIG9uQ29ubmVjdFxuICovXG5mdW5jdGlvbiBhdHRhY2hFdmVudHMoY2xpZW50LCB7b25Db25uZWN0fSkge1xuICAgIGNvbnN0IGZ1bmN0aW9ucyA9IFsnY29ubmVjdCcsICdyZWNvbm5lY3RpbmcnLCAnZXJyb3InLCAnZW5kJ107XG5cbiAgICBmdW5jdGlvbnMuZm9yRWFjaChmbiA9PiB7XG4gICAgICAgIHJlZGlzTGlzdGVuZXIub24oZm4sIE1ldGVvci5iaW5kRW52aXJvbm1lbnQoZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChmbiA9PT0gJ2Nvbm5lY3QnICYmIG9uQ29ubmVjdCkge1xuICAgICAgICAgICAgICAgIG9uQ29ubmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKENvbmZpZy5yZWRpc0V4dHJhcy5ldmVudHNbZm5dKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5yZWRpc0V4dHJhcy5ldmVudHNbZm5dKC4uLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSlcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIHJldHJ5IHN0cmF0ZWd5IHRoYXQgY2FuIGJlIG1vZGlmaWVkXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbmZ1bmN0aW9uIGdldFJldHJ5U3RyYXRlZ3koKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgaWYgKENvbmZpZy5yZWRpc0V4dHJhcy5yZXRyeV9zdHJhdGVneSkge1xuICAgICAgICAgICAgcmV0dXJuIENvbmZpZy5yZWRpc0V4dHJhcy5yZXRyeV9zdHJhdGVneSguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJmdW5jdGlvbiBnZXRGaWVsZHNPZkludGVyZXN0RnJvbUFsbChzdWJzY3JpYmVycykge1xuICAgIGxldCBhbGxGaWVsZHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1YnNjcmliZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBzdWJzY3JpYmVyc1tpXTtcbiAgICAgICAgbGV0IGZpZWxkcyA9IHN1YnNjcmliZXIuZ2V0RmllbGRzT2ZJbnRlcmVzdCgpO1xuXG4gICAgICAgIGlmIChmaWVsZHMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIC8vIGVuZCBvZiBzdG9yeSwgdGhlcmUgaXMgYW4gb2JzZXJ2YWJsZUNvbGxlY3Rpb24gdGhhdCBuZWVkcyBhbGwgZmllbGRzXG4gICAgICAgICAgICAvLyB0aGVyZWZvcmUgd2Ugd2lsbCBxdWVyeSBmb3IgYWxsIGZpZWxkc1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhbGxGaWVsZHMgPSBfLnVuaW9uKGFsbEZpZWxkcywgZmllbGRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHRoaXMgc2hvdWxkIG5vdCBoYXBwZW4sIGJ1dCBhcyBhIG1lYXN1cmUgb2Ygc2FmZXR5XG4gICAgaWYgKGFsbEZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgYWxsRmllbGRzID0gcmVtb3ZlQ2hpbGRyZW5PZlBhcmVudHMoYWxsRmllbGRzKTtcblxuICAgIGxldCBmaWVsZHNPYmplY3QgPSB7fTtcblxuICAgIGFsbEZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgICAgZmllbGRzT2JqZWN0W2ZpZWxkXSA9IDE7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZmllbGRzT2JqZWN0O1xufVxuXG4vKipcbiAqIEBwYXJhbSB7YXJyYXl9IGFycmF5XG4gKiBAcmV0dXJuIHthcnJheX0gYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUNoaWxkcmVuT2ZQYXJlbnRzKGFycmF5KSB7XG4gICAgbGV0IGZyZXNoQXJyYXkgPSBbXTtcblxuICAgIGFycmF5LmZvckVhY2goKGVsZW1lbnQsIGlkeGUpID0+IHtcbiAgICAgICAgLy8gYWRkIGl0IHRvIGZyZXNoQXJyYXkgb25seSBpZiB0aGVyZSdzIG5vIHttZX0gKyAnLicgaW5zaWRlIHRoZSBhcnJheVxuICAgICAgICBjb25zdCBmb3VuZFBhcmVudCA9IGFycmF5LmZpbmQoKHN1YmVsZW1lbnQsIGlkeHMpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBpZHhlICE9PSBpZHhzICYmIGVsZW1lbnQuaW5kZXhPZihgJHtzdWJlbGVtZW50fS5gKSA+PSAwO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWZvdW5kUGFyZW50KSB7XG4gICAgICAgICAgICBmcmVzaEFycmF5LnB1c2goZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBmcmVzaEFycmF5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRGaWVsZHNPZkludGVyZXN0RnJvbUFsbDtcbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgZmlsdGVyID0gc2VsZWN0b3IuX2lkO1xuICAgIGxldCBpZHMgPSBbXTtcblxuICAgIGlmIChfLmlzT2JqZWN0KGZpbHRlcikgJiYgIWZpbHRlci5fc3RyKSB7XG4gICAgICAgIGlmICghZmlsdGVyLiRpbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICAgICBgV2hlbiB5b3Ugc3Vic2NyaWJlIGRpcmVjdGx5LCB5b3UgY2FuJ3QgaGF2ZSBvdGhlciBzcGVjaWZpZWQgZmllbGRzIHJhdGhlciB0aGFuICRpbmBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZHMgPSBmaWx0ZXIuJGluO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlkcy5wdXNoKGZpbHRlcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkcztcbn1cbiIsImltcG9ydCBDb25maWcgZnJvbSAnLi4vY29uZmlnJztcblxuLyoqXG4gKiBHaXZlbiBhIGJhc2UgY2hhbm5lbCBuYW1lLCBhcHBsaWVzIHRoZSBnbG9iYWwgcHJlZml4LlxuICpcbiAqIEBwYXJhbSBiYXNlQ2hhbm5lbE5hbWVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Q2hhbm5lbE5hbWUoYmFzZUNoYW5uZWxOYW1lKSB7XG4gICAgcmV0dXJuIChDb25maWcuZ2xvYmFsUmVkaXNQcmVmaXggfHwgJycpICsgYmFzZUNoYW5uZWxOYW1lO1xufVxuIiwiaW1wb3J0IHsgTW9uZ29JRCB9IGZyb20gJ21ldGVvci9tb25nby1pZCc7XG5pbXBvcnQgZ2V0Q2hhbm5lbE5hbWUgZnJvbSAnLi9nZXRDaGFubmVsTmFtZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldERlZGljYXRlZENoYW5uZWwoY29sbGVjdGlvbk5hbWUsIGRvY0lkKXtcbiAgY29uc3QgY2hhbm5lbE5hbWUgPSBgJHtjb2xsZWN0aW9uTmFtZX06OiR7TW9uZ29JRC5pZFN0cmluZ2lmeShkb2NJZCl9YDtcbiAgcmV0dXJuIGdldENoYW5uZWxOYW1lKGNoYW5uZWxOYW1lKTtcbn1cbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbi8qKlxuICogVGFrZW4gZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL21hdGIzMy9tZXRlb3ItY29sbGVjdGlvbi1ob29rcy9ibG9iL21hc3Rlci9jb2xsZWN0aW9uLWhvb2tzLmpzI0wxOTggYW5kIG1vZGlmaWVkLlxuICogQHBhcmFtIG11dGF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0RmllbGRzKG11dGF0b3IpIHtcbiAgICAvLyBjb21wdXRlIG1vZGlmaWVkIGZpZWxkc1xuICAgIHZhciBmaWVsZHMgPSBbXTtcbiAgICB2YXIgdG9wTGV2ZWxGaWVsZHMgPSBbXTtcblxuICAgIF8uZWFjaChtdXRhdG9yLCBmdW5jdGlvbiAocGFyYW1zLCBvcCkge1xuICAgICAgICBpZiAob3BbMF0gPT0gJyQnKSB7XG4gICAgICAgICAgICBfLmVhY2goXy5rZXlzKHBhcmFtcyksIGZ1bmN0aW9uIChmaWVsZCkge1xuICAgICAgICAgICAgICAgIC8vIHJlY29yZCB0aGUgZmllbGQgd2UgYXJlIHRyeWluZyB0byBjaGFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoIV8uY29udGFpbnMoZmllbGRzLCBmaWVsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAvLyB0b3BMZXZlbEZpZWxkcy5wdXNoKGZpZWxkLnNwbGl0KCcuJylbMF0pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxpa2UgeyAkc2V0OiB7ICdhcnJheS4xLnh4JyB9IH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3BlY2lmaWNQb3NpdGlvbkZpZWxkTWF0Y2ggPSAoL1xcLltcXGRdKyhcXC4pPy8pLmV4ZWMoZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3BlY2lmaWNQb3NpdGlvbkZpZWxkTWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkLnNsaWNlKDAsIHNwZWNpZmljUG9zaXRpb25GaWVsZE1hdGNoLmluZGV4KSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignLiQnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmllbGQuaW5kZXhPZignLiQuJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkLnNwbGl0KCcuJC4nKVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQuc3BsaXQoJy4kJylbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdG9wTGV2ZWxGaWVsZHMucHVzaChmaWVsZC5zcGxpdCgnLicpWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKG9wKVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge2ZpZWxkcywgdG9wTGV2ZWxGaWVsZHN9O1xufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihjdXJzb3JzKSB7XG4gICAgbGV0IGlzRGlzYWJsZWRPcGxvZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChjdXJzb3JzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBbY3Vyc29yXSA9IGN1cnNvcnM7XG4gICAgICAgIHJldHVybiBpc09wbG9nRGlzYWJsZWQoY3Vyc29yKTtcbiAgICB9XG5cbiAgICBsZXQgZGlzYWJsZWRDb25maWdzID0gW107XG4gICAgY3Vyc29ycy5mb3JFYWNoKGN1cnNvciA9PiB7XG4gICAgICAgIGRpc2FibGVkQ29uZmlncy5wdXNoKGlzT3Bsb2dEaXNhYmxlZChjdXJzb3IpKTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGFsbFRoZVNhbWUgPVxuICAgICAgICBfLmV2ZXJ5KGRpc2FibGVkQ29uZmlncywgYyA9PiBjID09PSB0cnVlKSB8fFxuICAgICAgICBfLmV2ZXJ5KGRpc2FibGVkQ29uZmlncywgYyA9PiBjID09PSBmYWxzZSk7XG5cbiAgICBpZiAoIWFsbFRoZVNhbWUpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcbiAgICAgICAgICAgICdUaGUgYXJyYXkgb2YgY3Vyc29ycyByZXR1cm5lZCBtdXN0IGFsbCBiZSByZWFjdGl2ZSB3aXRoIG9wbG9nIG9yIHBvbGxpbmcsIHlvdSBhcmUgbm90IGFsbG93ZWQgdG8gbWl4IHRoZW0gdXAuJ1xuICAgICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBkaXNhYmxlZENvbmZpZ3NbMF07XG59XG5cbi8qKlxuICogQHBhcmFtIHsqfSBjdXJzb3JcbiAqL1xuZnVuY3Rpb24gaXNPcGxvZ0Rpc2FibGVkKGN1cnNvcikge1xuICAgIGNvbnN0IGNvbmZpZyA9IGN1cnNvci5fY3Vyc29yRGVzY3JpcHRpb24gfHwgeyBvcHRpb25zOiB7fSB9O1xuXG4gICAgcmV0dXJuICEhY29uZmlnLm9wdGlvbnMuZGlzYWJsZU9wbG9nO1xufVxuIiwiaW1wb3J0IFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlciBmcm9tICcuLi9yZWRpcy9SZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXInO1xuaW1wb3J0IFB1YmxpY2F0aW9uRmFjdG9yeSBmcm9tICcuLi9jYWNoZS9QdWJsaWNhdGlvbkZhY3RvcnknO1xuaW1wb3J0IHtffSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgc2l6ZW9mIGZyb20gJ29iamVjdC1zaXplb2YnO1xuXG5leHBvcnQgZGVmYXVsdCAoKSA9PiB7XG4gICAgLy8gdG90YWwgb2YgYWN0aXZlIHF1ZXJpZXNcbiAgICBjb25zdCB0b3RhbFF1ZXJpZXMgPSBfLmtleXMoUHVibGljYXRpb25GYWN0b3J5LnN0b3JlLnN0b3JlKS5sZW5ndGg7XG4gICAgY29uc3QgcmVkaXNDaGFubmVscyA9IF8ua2V5cyhSZWRpc1N1YnNjcmlwdGlvbk1hbmFnZXIuc3RvcmUpLmxlbmd0aDtcblxuICAgIGxldCB0b3RhbFNpemUgPSAwO1xuICAgIGxldCB0b3RhbE9ic2VydmVycyA9IDA7XG4gICAgbGV0IG1heFNpemUgPSAwO1xuICAgIGxldCBtYXhTaXplUHViRW50cnkgPSAwO1xuICAgIGxldCBtYXhPYnNlcnZlcnMgPSAwO1xuICAgIGxldCBtYXhPYnNlcnZlcnNQdWJFbnRyeTtcblxuICAgIF8uZWFjaChQdWJsaWNhdGlvbkZhY3Rvcnkuc3RvcmUuc3RvcmUsIChwdWJFbnRyeSwgaWQpID0+IHtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IHNpemVvZihwdWJFbnRyeS5vYnNlcnZhYmxlQ29sbGVjdGlvbi5zdG9yZSk7XG4gICAgICAgIHRvdGFsU2l6ZSArPSBzaXplO1xuXG4gICAgICAgIGlmIChzaXplID4gbWF4U2l6ZSkge1xuICAgICAgICAgICAgbWF4U2l6ZSA9IHNpemU7XG4gICAgICAgICAgICBtYXhTaXplUHViRW50cnkgPSBwdWJFbnRyeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9ic2VydmVyc0NvdW50ID0gcHViRW50cnkub2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICAgICAgdG90YWxPYnNlcnZlcnMgKz0gb2JzZXJ2ZXJzQ291bnQ7XG5cbiAgICAgICAgaWYgKG9ic2VydmVyc0NvdW50ID4gbWF4T2JzZXJ2ZXJzKSB7XG4gICAgICAgICAgICBtYXhPYnNlcnZlcnMgPSBvYnNlcnZlcnNDb3VudDtcbiAgICAgICAgICAgIG1heE9ic2VydmVyc1B1YkVudHJ5ID0gcHViRW50cnk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZXNwb25zZSA9IHtcbiAgICAgICAgdG90YWxRdWVyaWVzLFxuICAgICAgICByZWRpc0NoYW5uZWxzLFxuICAgICAgICB0b3RhbFNpemU6IHRvdGFsU2l6ZSArICdCJyxcbiAgICAgICAgdG90YWxPYnNlcnZlcnMsXG4gICAgfTtcblxuICAgIGlmIChtYXhTaXplKSB7XG4gICAgICAgIHJlc3BvbnNlLm1heFNpemUgPSB7XG4gICAgICAgICAgICBzaXplOiBtYXhTaXplLFxuICAgICAgICAgICAgaWQ6IG1heFNpemVQdWJFbnRyeS5pZFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1heE9ic2VydmVycykge1xuICAgICAgICByZXNwb25zZS5tYXhPYnNlcnZlcnMgPSB7XG4gICAgICAgICAgICBjb3VudDogbWF4T2JzZXJ2ZXJzLFxuICAgICAgICAgICAgaWQ6IG1heE9ic2VydmVyc1B1YkVudHJ5LmlkXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG59IiwiaW1wb3J0IHtnZXRSZWRpc0xpc3RlbmVyLCBnZXRSZWRpc1B1c2hlcn0gZnJvbSAnLi4vcmVkaXMvZ2V0UmVkaXNDbGllbnQnO1xuaW1wb3J0IHtWZW50Q29uc3RhbnRzfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtSYW5kb219IGZyb20gJ21ldGVvci9yYW5kb20nO1xuaW1wb3J0IENvbmZpZyBmcm9tICcuLi9jb25maWcnO1xuXG4vLyBUT0RPOlxuLy8gVW5pZnkgbGlzdGVuaW5nIG9mIGV2ZW50cyB3aXRoIFJlZGlzU3Vic2NyaXB0aW9uTWFuYWdlclxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZW50IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEBwYXJhbSBmblxuICAgICAqIEByZXR1cm5zIHsqfGFueXxPYnNlcnZhYmxlfVxuICAgICAqL1xuICAgIHN0YXRpYyBwdWJsaXNoKG5hbWUsIGZuKSB7XG4gICAgICAgIC8vIGNoZWNrIGluaXRpYWxpemF0aW9uXG4gICAgICAgIGlmICghQ29uZmlnLmlzSW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25vdC1pbml0aWFsaXplZCcsICdSZWRpc09wbG9nIGlzIG5vdCBpbml0aWFsaXplZCBhdCB0aGUgdGltZSBvZiBkZWZpbmluZyB0aGlzIHB1Ymxpc2guIE1ha2Ugc3VyZSB5b3UgaW5pdGlhbGl6ZSBpdCBiZWZvcmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfLmlzT2JqZWN0KG5hbWUpKSB7XG4gICAgICAgICAgICBfLmVhY2gobmFtZSwgKGZuLCBfbmFtZSkgPT4ge1xuICAgICAgICAgICAgICAgIFZlbnQucHVibGlzaChfbmFtZSwgZm4pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkYXRlIGlmIGV2ZXJ5dGhpbmcgaXMgaW4gb3JkZXJcbiAgICAgICAgVmVudC5fdmFsaWRhdGVBcmd1bWVudHMobmFtZSwgZm4pO1xuXG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgcHVibGljYXRpb24gcHJvcGVybHlcbiAgICAgICAgcmV0dXJuIFZlbnQuX2NyZWF0ZVB1Ymxpc2hFbmRQb2ludChuYW1lLCBmbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNoYW5uZWxcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gICAgICovXG4gICAgc3RhdGljIGVtaXQoY2hhbm5lbCwgb2JqZWN0KSB7XG4gICAgICAgIGNvbnN0IHtwdWJTdWJNYW5hZ2VyfSA9IENvbmZpZztcblxuICAgICAgICBwdWJTdWJNYW5hZ2VyLnB1Ymxpc2goY2hhbm5lbCwgb2JqZWN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBwdWJsaXNoIGVuZHBvaW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEBwYXJhbSBmblxuICAgICAqIEByZXR1cm5zIHsqfGFueXxPYnNlcnZhYmxlfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc3RhdGljIF9jcmVhdGVQdWJsaXNoRW5kUG9pbnQobmFtZSwgZm4pIHtcbiAgICAgICAgcmV0dXJuIE1ldGVvci5wdWJsaXNoKG5hbWUsIGZ1bmN0aW9uIChjb2xsZWN0aW9uSWQsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIFZlbnQuX2V4dGVuZFB1Ymxpc2hDb250ZXh0KHRoaXMsIG5hbWUsIGNvbGxlY3Rpb25JZCk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZm4uY2FsbCh0aGlzLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyB3ZSBkbyB0aGlzIGJlY2F1c2UgdGhlIGVycm9ycyBpbiBoZXJlIGFyZSBzaWxlbmNlZFxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY29udGV4dFxuICAgICAqIEBwYXJhbSBuYW1lXG4gICAgICogQHBhcmFtIGNvbGxlY3Rpb25JZFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc3RhdGljIF9leHRlbmRQdWJsaXNoQ29udGV4dChjb250ZXh0LCBuYW1lLCBjb2xsZWN0aW9uSWQpIHtcbiAgICAgICAgY29uc3QgY2hhbm5lbEhhbmRsZXJzID0gW107XG4gICAgICAgIGNvbnN0IHsgcHViU3ViTWFuYWdlciB9ID0gQ29uZmlnO1xuXG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dCwge1xuICAgICAgICAgICAgb24oY2hhbm5lbCwgcmVkaXNFdmVudEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGUgdGhlIGhhbmRsZXIgZm9yIHRoaXMgY2hhbm5lbFxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSBmdW5jdGlvbihtZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZWRpc0V2ZW50SGFuZGxlci5jYWxsKGNvbnRleHQsIG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0Ll9zZXNzaW9uLnNlbmQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1zZzogJ2NoYW5nZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtWZW50Q29uc3RhbnRzLlBSRUZJWF06ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogVmVudENvbnN0YW50cy5nZXRQcmVmaXgoY29sbGVjdGlvbklkLCBuYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbVmVudENvbnN0YW50cy5FVkVOVF9WQVJJQUJMRV06IGRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBjaGFubmVsSGFuZGxlcnMucHVzaCh7IGNoYW5uZWwsIGhhbmRsZXIgfSk7XG4gICAgICAgICAgICAgICAgcHViU3ViTWFuYWdlci5zdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlcik7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICBjb250ZXh0Lm9uU3RvcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjaGFubmVsSGFuZGxlcnMuZm9yRWFjaCgoeyBjaGFubmVsLCBoYW5kbGVyIH0pID0+IHtcbiAgICAgICAgICAgICAgcHViU3ViTWFuYWdlci51bnN1YnNjcmliZShjaGFubmVsLCBoYW5kbGVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gbmFtZVxuICAgICAqIEBwYXJhbSBmblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc3RhdGljIF92YWxpZGF0ZUFyZ3VtZW50cyhuYW1lLCBmbikge1xuICAgICAgICAvLyB2YWxpZGF0ZSBhcmd1bWVudHNcbiAgICAgICAgaWYgKCFfLmlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICAgICAgICBpZiAoIV8uaXNPYmplY3QobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdpbnZhbGlkLWRlZmluaXRpb24nLCAnQXJndW1lbnQgaXMgaW52YWxpZCcpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2ludmFsaWQtZGVmaW5pdGlvbicsICdUaGUgc2Vjb25kIGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgZnVuY3Rpb24nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG4iXX0=
