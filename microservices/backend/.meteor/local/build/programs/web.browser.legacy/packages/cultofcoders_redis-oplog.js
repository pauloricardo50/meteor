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
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"cultofcoders:redis-oplog":{"redis-oplog.client.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cultofcoders_redis-oplog/redis-oplog.client.js                                                          //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  Vent: function () {
    return Vent;
  }
});
var VentClient;
module.link("./lib/vent/VentClient", {
  "default": function (v) {
    VentClient = v;
  }
}, 0);
var Vent = new VentClient();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"constants.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cultofcoders_redis-oplog/lib/constants.js                                                               //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
module.export({
  Events: function () {
    return Events;
  },
  Strategy: function () {
    return Strategy;
  },
  RedisPipe: function () {
    return RedisPipe;
  },
  VentConstants: function () {
    return VentConstants;
  }
});
var RedisPipe = {
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
var Events = {
  INSERT: 'i',
  UPDATE: 'u',
  REMOVE: 'r'
};
var Strategy = {
  DEFAULT: 'D',
  DEDICATED_CHANNELS: 'DC',
  LIMIT_SORT: 'LS'
};
var VentConstants = {
  ID: 'i',
  EVENT_VARIABLE: 'e',
  PREFIX: '__vent',
  getPrefix: function (id, name) {
    return id + "." + name;
  }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"vent":{"VentClient.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/cultofcoders_redis-oplog/lib/vent/VentClient.js                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

module.export({
  "default": function () {
    return VentClient;
  }
});
var VentConstants;
module.link("../constants", {
  VentConstants: function (v) {
    VentConstants = v;
  }
}, 0);
var Random;
module.link("meteor/random", {
  Random: function (v) {
    Random = v;
  }
}, 1);
var DDPCommon;
module.link("meteor/ddp-common", {
  DDPCommon: function (v) {
    DDPCommon = v;
  }
}, 2);

var VentClient =
/*#__PURE__*/
function () {
  function VentClient() {
    this.store = {};
    this.listen(Meteor.connection);
  }

  var _proto = VentClient.prototype;

  _proto.subscribe = function () {
    function subscribe(name) {
      var subscription = new VentClientSubscription(this, name);
      this.add(subscription);

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return subscription.subscribe.apply(subscription, args);
    }

    return subscribe;
  }();

  _proto.listen = function () {
    function listen(ddpConnection) {
      var _this = this;

      ddpConnection._stream.on('message', function (raw_msg) {
        // avoid parsing unnecessary ddp events
        var search = "{\"msg\":\"changed\",\"" + VentConstants.PREFIX + "\":\"1";

        if (raw_msg.substr(0, search.length) !== search) {
          return;
        }

        var msg = DDPCommon.parseDDP(raw_msg);
        var subscription = _this.store[msg.id];

        if (subscription) {
          subscription.handle(msg[VentConstants.EVENT_VARIABLE]);
        }
      });
    }

    return listen;
  }()
  /**
   * {VentClientSubscription}
   * @param subscription
   */
  ;

  _proto.add = function () {
    function add(subscription) {
      this.store[subscription.id] = subscription;
    }

    return add;
  }()
  /**
   * @param {VentClientSubscription} subscription
   */
  ;

  _proto.remove = function () {
    function remove(subscription) {
      delete this.store[subscription.id];
    }

    return remove;
  }();

  return VentClient;
}();

/**
 * Handles Vent subscription
 */
var VentClientSubscription =
/*#__PURE__*/
function () {
  function VentClientSubscription(client, name) {
    this.client = client;
    this._name = name;
    this._id = Random.id();
  }

  var _proto2 = VentClientSubscription.prototype;

  /**
   * Subscribes to Meteor
   *
   * @param args
   * @returns {*}
   */
  _proto2.subscribe = function () {
    function subscribe() {
      var _Meteor;

      var self = this;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var handler = (_Meteor = Meteor).subscribe.apply(_Meteor, [this._name, this._id].concat(args));

      var oldStop = handler.stop;
      Object.assign(handler, {
        listen: function (eventHandler) {
          if (!_.isFunction(eventHandler)) {
            throw new Meteor.Error('invalid-argument', 'You should pass a function to listen()');
          }

          self._eventHandler = eventHandler;
        },
        stop: function () {
          self.client.remove(self);
          return oldStop.call(handler);
        }
      });
      return handler;
    }

    return subscribe;
  }()
  /**
   * Watches the incomming events
   */
  ;

  _proto2.handle = function () {
    function handle(event) {
      if (this._eventHandler) {
        this._eventHandler(event);
      } else {}
    }

    return handle;
  }();

  (0, _createClass2.default)(VentClientSubscription, [{
    key: "id",
    get: function () {
      return VentConstants.getPrefix(this._id, this._name);
    }
  }]);
  return VentClientSubscription;
}();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
