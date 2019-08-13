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
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var Mongo = Package.mongo.Mongo;
var Random = Package.random.Random;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var DDP = Package['ddp-client'].DDP;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:redis-oplog":{"redis-oplog.client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cultofcoders_redis-oplog/redis-oplog.client.js                                                        //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.export({
  Vent: () => Vent
});
let VentClient;
module.link("./lib/vent/VentClient", {
  default(v) {
    VentClient = v;
  }

}, 0);
const Vent = new VentClient();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"constants.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cultofcoders_redis-oplog/lib/constants.js                                                             //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    return "".concat(id, ".").concat(name);
  }

};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"vent":{"VentClient.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                //
// packages/cultofcoders_redis-oplog/lib/vent/VentClient.js                                                       //
//                                                                                                                //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                  //
module.export({
  default: () => VentClient
});
let VentConstants;
module.link("../constants", {
  VentConstants(v) {
    VentConstants = v;
  }

}, 0);
let Random;
module.link("meteor/random", {
  Random(v) {
    Random = v;
  }

}, 1);
let DDPCommon;
module.link("meteor/ddp-common", {
  DDPCommon(v) {
    DDPCommon = v;
  }

}, 2);

class VentClient {
  constructor() {
    this.store = {};
    this.listen(Meteor.connection);
  }

  subscribe(name) {
    const subscription = new VentClientSubscription(this, name);
    this.add(subscription);

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return subscription.subscribe(...args);
  }

  listen(ddpConnection) {
    ddpConnection._stream.on('message', raw_msg => {
      // avoid parsing unnecessary ddp events
      const search = "{\"msg\":\"changed\",\"".concat(VentConstants.PREFIX, "\":\"1");

      if (raw_msg.substr(0, search.length) !== search) {
        return;
      }

      const msg = DDPCommon.parseDDP(raw_msg);
      const subscription = this.store[msg.id];

      if (subscription) {
        subscription.handle(msg[VentConstants.EVENT_VARIABLE]);
      }
    });
  }
  /**
   * {VentClientSubscription}
   * @param subscription
   */


  add(subscription) {
    this.store[subscription.id] = subscription;
  }
  /**
   * @param {VentClientSubscription} subscription
   */


  remove(subscription) {
    delete this.store[subscription.id];
  }

}

/**
 * Handles Vent subscription
 */
class VentClientSubscription {
  constructor(client, name) {
    this.client = client;
    this._name = name;
    this._id = Random.id();
  }

  get id() {
    return VentConstants.getPrefix(this._id, this._name);
  }
  /**
   * Subscribes to Meteor
   *
   * @param args
   * @returns {*}
   */


  subscribe() {
    const self = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    const handler = Meteor.subscribe(this._name, this._id, ...args);
    const oldStop = handler.stop;
    Object.assign(handler, {
      listen(eventHandler) {
        if (!_.isFunction(eventHandler)) {
          throw new Meteor.Error('invalid-argument', 'You should pass a function to listen()');
        }

        self._eventHandler = eventHandler;
      },

      stop() {
        self.client.remove(self);
        return oldStop.call(handler);
      }

    });
    return handler;
  }
  /**
   * Watches the incomming events
   */


  handle(event) {
    if (this._eventHandler) {
      this._eventHandler(event);
    } else {}
  }

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/cultofcoders:redis-oplog/redis-oplog.client.js");

/* Exports */
Package._define("cultofcoders:redis-oplog", exports);

})();
