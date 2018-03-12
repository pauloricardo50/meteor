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
var Random = Package.random.Random;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;

/* Package-scope variables */
var Kadira, BaseErrorModel, Retry, Ntp, getBrowserInfo, getResolution, getErrorStack, getInfoArray, getTime, checkSizeAndPickFields, fixInternetExplorerXDR, ErrorModel;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/common/unify.js                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
Kadira = {};                                                                                        // 1
Kadira.options = {};                                                                                // 2
                                                                                                    // 3
if(Meteor.wrapAsync) {                                                                              // 4
  Kadira._wrapAsync = Meteor.wrapAsync;                                                             // 5
} else {                                                                                            // 6
  Kadira._wrapAsync = Meteor._wrapAsync;                                                            // 7
}                                                                                                   // 8
                                                                                                    // 9
if(Meteor.isServer) {                                                                               // 10
  var EventEmitter = Npm.require('events').EventEmitter;                                            // 11
  var eventBus = new EventEmitter();                                                                // 12
  eventBus.setMaxListeners(0);                                                                      // 13
                                                                                                    // 14
  var buildArgs = function(args) {                                                                  // 15
    args = _.toArray(args);                                                                         // 16
    var eventName = args[0] + '-' + args[1];                                                        // 17
    var args = args.slice(2);                                                                       // 18
    args.unshift(eventName);                                                                        // 19
    return args;                                                                                    // 20
  };                                                                                                // 21
                                                                                                    // 22
  Kadira.EventBus = {};                                                                             // 23
  _.each(['on', 'emit', 'removeListener', 'removeAllListeners'], function(m) {                      // 24
    Kadira.EventBus[m] = function() {                                                               // 25
      var args = buildArgs(arguments);                                                              // 26
      return eventBus[m].apply(eventBus, args);                                                     // 27
    };                                                                                              // 28
  });                                                                                               // 29
}                                                                                                   // 30
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/models/base_error.js                                             //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
BaseErrorModel = function(options) {                                                                // 1
  this._filters = [];                                                                               // 2
};                                                                                                  // 3
                                                                                                    // 4
BaseErrorModel.prototype.addFilter = function(filter) {                                             // 5
  if(typeof filter === 'function') {                                                                // 6
    this._filters.push(filter);                                                                     // 7
  } else {                                                                                          // 8
    throw new Error("Error filter must be a function");                                             // 9
  }                                                                                                 // 10
};                                                                                                  // 11
                                                                                                    // 12
BaseErrorModel.prototype.removeFilter = function(filter) {                                          // 13
  var index = this._filters.indexOf(filter);                                                        // 14
  if(index >= 0) {                                                                                  // 15
    this._filters.splice(index, 1);                                                                 // 16
  }                                                                                                 // 17
};                                                                                                  // 18
                                                                                                    // 19
BaseErrorModel.prototype.applyFilters = function(type, message, error, subType) {                   // 20
  for(var lc=0; lc<this._filters.length; lc++) {                                                    // 21
    var filter = this._filters[lc];                                                                 // 22
    try {                                                                                           // 23
      var validated = filter(type, message, error, subType);                                        // 24
      if(!validated) return false;                                                                  // 25
    } catch (ex) {                                                                                  // 26
      // we need to remove this filter                                                              // 27
      // we may ended up in a error cycle                                                           // 28
      this._filters.splice(lc, 1);                                                                  // 29
      throw new Error("an error thrown from a filter you've suplied", ex.message);                  // 30
    }                                                                                               // 31
  }                                                                                                 // 32
                                                                                                    // 33
  return true;                                                                                      // 34
};                                                                                                  // 35
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/retry.js                                                         //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
// Retry logic with an exponential backoff.                                                         // 1
//                                                                                                  // 2
// options:                                                                                         // 3
//  baseTimeout: time for initial reconnect attempt (ms).                                           // 4
//  exponent: exponential factor to increase timeout each attempt.                                  // 5
//  maxTimeout: maximum time between retries (ms).                                                  // 6
//  minCount: how many times to reconnect "instantly".                                              // 7
//  minTimeout: time to wait for the first `minCount` retries (ms).                                 // 8
//  fuzz: factor to randomize retry times by (to avoid retry storms).                               // 9
                                                                                                    // 10
//TODO: remove this class and use Meteor Retry in a later version of meteor.                        // 11
                                                                                                    // 12
Retry = function (options) {                                                                        // 13
  var self = this;                                                                                  // 14
  _.extend(self, _.defaults(_.clone(options || {}), {                                               // 15
    baseTimeout: 1000, // 1 second                                                                  // 16
    exponent: 2.2,                                                                                  // 17
    // The default is high-ish to ensure a server can recover from a                                // 18
    // failure caused by load.                                                                      // 19
    maxTimeout: 5 * 60000, // 5 minutes                                                             // 20
    minTimeout: 10,                                                                                 // 21
    minCount: 2,                                                                                    // 22
    fuzz: 0.5 // +- 25%                                                                             // 23
  }));                                                                                              // 24
  self.retryTimer = null;                                                                           // 25
};                                                                                                  // 26
                                                                                                    // 27
_.extend(Retry.prototype, {                                                                         // 28
                                                                                                    // 29
  // Reset a pending retry, if any.                                                                 // 30
  clear: function () {                                                                              // 31
    var self = this;                                                                                // 32
    if(self.retryTimer)                                                                             // 33
      clearTimeout(self.retryTimer);                                                                // 34
    self.retryTimer = null;                                                                         // 35
  },                                                                                                // 36
                                                                                                    // 37
  // Calculate how long to wait in milliseconds to retry, based on the                              // 38
  // `count` of which retry this is.                                                                // 39
  _timeout: function (count) {                                                                      // 40
    var self = this;                                                                                // 41
                                                                                                    // 42
    if(count < self.minCount)                                                                       // 43
      return self.minTimeout;                                                                       // 44
                                                                                                    // 45
    var timeout = Math.min(                                                                         // 46
      self.maxTimeout,                                                                              // 47
      self.baseTimeout * Math.pow(self.exponent, count));                                           // 48
    // fuzz the timeout randomly, to avoid reconnect storms when a                                  // 49
    // server goes down.                                                                            // 50
    timeout = timeout * ((Random.fraction() * self.fuzz) +                                          // 51
                         (1 - self.fuzz/2));                                                        // 52
    return Math.ceil(timeout);                                                                      // 53
  },                                                                                                // 54
                                                                                                    // 55
  // Call `fn` after a delay, based on the `count` of which retry this is.                          // 56
  retryLater: function (count, fn) {                                                                // 57
    var self = this;                                                                                // 58
    var timeout = self._timeout(count);                                                             // 59
    if(self.retryTimer)                                                                             // 60
      clearTimeout(self.retryTimer);                                                                // 61
                                                                                                    // 62
    self.retryTimer = setTimeout(fn, timeout);                                                      // 63
    return timeout;                                                                                 // 64
  }                                                                                                 // 65
                                                                                                    // 66
});                                                                                                 // 67
                                                                                                    // 68
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/ntp.js                                                           //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var logger = getLogger();                                                                           // 1
                                                                                                    // 2
Ntp = function (endpoint) {                                                                         // 3
  this.setEndpoint(endpoint);                                                                       // 4
  this.diff = 0;                                                                                    // 5
  this.synced = false;                                                                              // 6
  this.reSyncCount = 0;                                                                             // 7
  this.reSync = new Retry({                                                                         // 8
    baseTimeout: 1000*60,                                                                           // 9
    maxTimeout: 1000*60*10,                                                                         // 10
    minCount: 0                                                                                     // 11
  });                                                                                               // 12
}                                                                                                   // 13
                                                                                                    // 14
Ntp._now = function() {                                                                             // 15
  var now = Date.now();                                                                             // 16
  if(typeof now == 'number') {                                                                      // 17
    return now;                                                                                     // 18
  } else if(now instanceof Date) {                                                                  // 19
    // some extenal JS libraries override Date.now and returns a Date object                        // 20
    // which directly affect us. So we need to prepare for that                                     // 21
    return now.getTime();                                                                           // 22
  } else {                                                                                          // 23
    // trust me. I've seen now === undefined                                                        // 24
    return (new Date()).getTime();                                                                  // 25
  }                                                                                                 // 26
};                                                                                                  // 27
                                                                                                    // 28
Ntp.prototype.setEndpoint = function(endpoint) {                                                    // 29
  this.endpoint = endpoint + '/simplentp/sync';                                                     // 30
};                                                                                                  // 31
                                                                                                    // 32
Ntp.prototype.getTime = function() {                                                                // 33
  return Ntp._now() + Math.round(this.diff);                                                        // 34
};                                                                                                  // 35
                                                                                                    // 36
Ntp.prototype.syncTime = function(localTime) {                                                      // 37
  return localTime + Math.ceil(this.diff);                                                          // 38
};                                                                                                  // 39
                                                                                                    // 40
Ntp.prototype.sync = function() {                                                                   // 41
  logger('init sync');                                                                              // 42
  var self = this;                                                                                  // 43
  var retryCount = 0;                                                                               // 44
  var retry = new Retry({                                                                           // 45
    baseTimeout: 1000*20,                                                                           // 46
    maxTimeout: 1000*60,                                                                            // 47
    minCount: 1,                                                                                    // 48
    minTimeout: 0                                                                                   // 49
  });                                                                                               // 50
  syncTime();                                                                                       // 51
                                                                                                    // 52
  function syncTime () {                                                                            // 53
    if(retryCount<5) {                                                                              // 54
      logger('attempt time sync with server', retryCount);                                          // 55
      // if we send 0 to the retryLater, cacheDns will run immediately                              // 56
      retry.retryLater(retryCount++, cacheDns);                                                     // 57
    } else {                                                                                        // 58
      logger('maximum retries reached');                                                            // 59
      self.reSync.retryLater(self.reSyncCount++, function () {                                      // 60
        var args = [].slice.call(arguments);                                                        // 61
        self.sync.apply(self, args);                                                                // 62
      });                                                                                           // 63
    }                                                                                               // 64
  }                                                                                                 // 65
                                                                                                    // 66
  // first attempt is to cache dns. So, calculation does not                                        // 67
  // include DNS resolution time                                                                    // 68
  function cacheDns () {                                                                            // 69
    self.getServerTime(function(err) {                                                              // 70
      if(!err) {                                                                                    // 71
        calculateTimeDiff();                                                                        // 72
      } else {                                                                                      // 73
        syncTime();                                                                                 // 74
      }                                                                                             // 75
    });                                                                                             // 76
  }                                                                                                 // 77
                                                                                                    // 78
  function calculateTimeDiff () {                                                                   // 79
    var clientStartTime = (new Date()).getTime();                                                   // 80
    self.getServerTime(function(err, serverTime) {                                                  // 81
      if(!err && serverTime) {                                                                      // 82
        // (Date.now() + clientStartTime)/2 : Midpoint between req and res                          // 83
        var networkTime = ((new Date()).getTime() - clientStartTime)/2                              // 84
        var serverStartTime = serverTime - networkTime;                                             // 85
        self.diff = serverStartTime - clientStartTime;                                              // 86
        self.synced = true;                                                                         // 87
        // we need to send 1 into retryLater.                                                       // 88
        self.reSync.retryLater(self.reSyncCount++, function () {                                    // 89
          var args = [].slice.call(arguments);                                                      // 90
          self.sync.apply(self, args);                                                              // 91
        });                                                                                         // 92
        logger('successfully updated diff value', self.diff);                                       // 93
      } else {                                                                                      // 94
        syncTime();                                                                                 // 95
      }                                                                                             // 96
    });                                                                                             // 97
  }                                                                                                 // 98
}                                                                                                   // 99
                                                                                                    // 100
Ntp.prototype.getServerTime = function(callback) {                                                  // 101
  var self = this;                                                                                  // 102
                                                                                                    // 103
  if(Meteor.isServer) {                                                                             // 104
    var Fiber = Npm.require('fibers');                                                              // 105
    new Fiber(function() {                                                                          // 106
      HTTP.get(self.endpoint, function (err, res) {                                                 // 107
        if(err) {                                                                                   // 108
          callback(err);                                                                            // 109
        } else {                                                                                    // 110
          var serverTime = parseInt(res.content)                                                    // 111
          callback(null, serverTime);                                                               // 112
        }                                                                                           // 113
      });                                                                                           // 114
    }).run();                                                                                       // 115
  } else {                                                                                          // 116
    $.ajax({                                                                                        // 117
      type: 'GET',                                                                                  // 118
      url: self.endpoint,                                                                           // 119
      success: function(serverTime) {                                                               // 120
        callback(null, parseInt(serverTime));                                                       // 121
      },                                                                                            // 122
      error: function(err) {                                                                        // 123
        callback(err);                                                                              // 124
      }                                                                                             // 125
    });                                                                                             // 126
  }                                                                                                 // 127
};                                                                                                  // 128
                                                                                                    // 129
function getLogger() {                                                                              // 130
  if(Meteor.isServer) {                                                                             // 131
    return Npm.require('debug')("kadira:ntp");                                                      // 132
  } else {                                                                                          // 133
    return function(message) {                                                                      // 134
      var canLogKadira =                                                                            // 135
        Meteor._localStorage.getItem('LOG_KADIRA') !== null                                         // 136
        && typeof console !== 'undefined';                                                          // 137
                                                                                                    // 138
      if(canLogKadira) {                                                                            // 139
        if(message) {                                                                               // 140
          message = "kadira:ntp " + message;                                                        // 141
          arguments[0] = message;                                                                   // 142
        }                                                                                           // 143
        console.log.apply(console, arguments);                                                      // 144
      }                                                                                             // 145
    }                                                                                               // 146
  }                                                                                                 // 147
}                                                                                                   // 148
                                                                                                    // 149
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/utils.js                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
getBrowserInfo = function () {                                                                      // 1
  return {                                                                                          // 2
    browser: window.navigator.userAgent,                                                            // 3
    userId: Meteor.userId && Meteor.userId(),                                                       // 4
    url: location.href,                                                                             // 5
    resolution: getResolution()                                                                     // 6
  };                                                                                                // 7
}                                                                                                   // 8
                                                                                                    // 9
getResolution = function () {                                                                       // 10
  if(screen && screen.width && screen.height) {                                                     // 11
    var resolution = screen.width + 'x' + screen.height;                                            // 12
    return resolution;                                                                              // 13
  }                                                                                                 // 14
}                                                                                                   // 15
                                                                                                    // 16
getErrorStack = function (zone, callback) {                                                         // 17
  var trace = [];                                                                                   // 18
  var eventMap = zone.eventMap || {};                                                               // 19
  var infoMap = zone.infoMap || {};                                                                 // 20
                                                                                                    // 21
  trace.push({                                                                                      // 22
    at: (new Date().getTime()),                                                                     // 23
    stack: zone.erroredStack.get()                                                                  // 24
  });                                                                                               // 25
                                                                                                    // 26
  processZone();                                                                                    // 27
  function processZone() {                                                                          // 28
    // we assume, first two zones are not interesting                                               // 29
    // bacause, they are some internal meteor loading stuffs                                        // 30
    if(zone && zone.depth > 2) {                                                                    // 31
      var stack = "";                                                                               // 32
      if(zone.currentStack) {                                                                       // 33
        stack = zone.currentStack.get();                                                            // 34
      }                                                                                             // 35
                                                                                                    // 36
      var events = eventMap[zone.id];                                                               // 37
      var info = getInfoArray(infoMap[zone.id]);                                                    // 38
      var ownerArgsEvent = events && events[0] && events[0].type == 'owner-args' && events.shift();
      var runAt = (ownerArgsEvent)? ownerArgsEvent.at : zone.runAt;                                 // 40
      var ownerArgs = (ownerArgsEvent)? _.toArray(ownerArgsEvent.args) : [];                        // 41
                                                                                                    // 42
      // limiting                                                                                   // 43
      events = _.map(_.last(events, 5), checkSizeAndPickFields(100));                               // 44
      info = _.map(_.last(info, 5), checkSizeAndPickFields(100));                                   // 45
      ownerArgs = checkSizeAndPickFields(200)(_.first(ownerArgs, 5));                               // 46
                                                                                                    // 47
      zone.owner && delete zone.owner.zoneId;                                                       // 48
                                                                                                    // 49
      trace.push({                                                                                  // 50
        createdAt: zone.createdAt,                                                                  // 51
        runAt: runAt,                                                                               // 52
        stack: stack,                                                                               // 53
        owner: zone.owner,                                                                          // 54
        ownerArgs: ownerArgs,                                                                       // 55
        events: events,                                                                             // 56
        info: info,                                                                                 // 57
        zoneId: zone.id                                                                             // 58
      });                                                                                           // 59
      zone = zone.parent;                                                                           // 60
                                                                                                    // 61
      setTimeout(processZone, 0);                                                                   // 62
    } else {                                                                                        // 63
      callback(trace);                                                                              // 64
    }                                                                                               // 65
  }                                                                                                 // 66
}                                                                                                   // 67
                                                                                                    // 68
getInfoArray = function (info) {                                                                    // 69
  return _(info || {}).map(function (value, type) {                                                 // 70
    value.type = type;                                                                              // 71
    return value;                                                                                   // 72
  })                                                                                                // 73
}                                                                                                   // 74
                                                                                                    // 75
getTime = function () {                                                                             // 76
  if(Kadira && Kadira.syncedDate) {                                                                 // 77
    return Kadira.syncedDate.getTime();                                                             // 78
  } else {                                                                                          // 79
    return (new Date().getTime());                                                                  // 80
  }                                                                                                 // 81
}                                                                                                   // 82
                                                                                                    // 83
checkSizeAndPickFields = function(maxFieldSize) {                                                   // 84
  return function(obj) {                                                                            // 85
    maxFieldSize = maxFieldSize || 100;                                                             // 86
    for(var key in obj) {                                                                           // 87
      var value = obj[key];                                                                         // 88
      try {                                                                                         // 89
        var valueStringified = JSON.stringify(value);                                               // 90
        if(valueStringified.length > maxFieldSize) {                                                // 91
          obj[key] = valueStringified.substr(0, maxFieldSize) + " ...";                             // 92
        } else {                                                                                    // 93
          obj[key] = value;                                                                         // 94
        }                                                                                           // 95
      } catch(ex) {                                                                                 // 96
        obj[key] = 'Error: cannot stringify value';                                                 // 97
      }                                                                                             // 98
    }                                                                                               // 99
    return obj;                                                                                     // 100
  }                                                                                                 // 101
}                                                                                                   // 102
                                                                                                    // 103
/**                                                                                                 // 104
 * IE8 and IE9 does not support CORS with the usual XMLHttpRequest object                           // 105
 * If XDomainRequest exists, use it to send errors.                                                 // 106
 * XDR can POST data to HTTPS endpoints only if current page uses HTTPS                             // 107
 */                                                                                                 // 108
fixInternetExplorerXDR = function () {                                                              // 109
  if (window.XDomainRequest) {                                                                      // 110
    $.ajaxTransport(function(s) {                                                                   // 111
      return {                                                                                      // 112
        send: function (headers, callback) {                                                        // 113
          var xdr = new XDomainRequest();                                                           // 114
          var data = s.data || null;                                                                // 115
          var url = matchPageProtocol(s.url);                                                       // 116
                                                                                                    // 117
          xdr.onload = function () {                                                                // 118
            var headers = {'Content-Type': xdr.contentType};                                        // 119
            callback(200, 'OK', {text: xdr.responseText}, headers);                                 // 120
          }                                                                                         // 121
                                                                                                    // 122
          xdr.onerror = function () {                                                               // 123
            callback(404);                                                                          // 124
          }                                                                                         // 125
                                                                                                    // 126
          xdr.open(s.type, url);                                                                    // 127
          xdr.send(data);                                                                           // 128
        }                                                                                           // 129
      };                                                                                            // 130
    });                                                                                             // 131
  }                                                                                                 // 132
                                                                                                    // 133
  function matchPageProtocol (endpoint) {                                                           // 134
    var withoutProtocol = endpoint.substr(endpoint.indexOf(':') + 1);                               // 135
    return window.location.protocol + withoutProtocol;                                              // 136
  }                                                                                                 // 137
}                                                                                                   // 138
                                                                                                    // 139
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/models/error.js                                           //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
ErrorModel = function(options) {                                                                    // 1
  BaseErrorModel.call(this);                                                                        // 2
  options = options || {};                                                                          // 3
  options.maxErrorsPerInterval = options.maxErrorsPerInterval || 10;                                // 4
  options.intervalInMillis = options.intervalInMillis || 1000 * 60 *2; //2 mins                     // 5
  options.waitForNtpSyncInterval = options.waitForNtpSyncInterval || 0;                             // 6
  var self = this;                                                                                  // 7
                                                                                                    // 8
  self.options = options;                                                                           // 9
                                                                                                    // 10
  // errorsSentCount will be reseted at the start of the interval                                   // 11
  self.errorsSentCount = 0;                                                                         // 12
  self.errorsSent = Object.create(null);                                                            // 13
  self.intervalTimeoutHandler = setInterval(function() {                                            // 14
    self.errorsSentCount = 0;                                                                       // 15
    self._flushErrors();                                                                            // 16
  }, self.options.intervalInMillis);                                                                // 17
};                                                                                                  // 18
                                                                                                    // 19
_.extend(ErrorModel.prototype, BaseErrorModel.prototype);                                           // 20
                                                                                                    // 21
ErrorModel.prototype.sendError = function(errorDef, err, force) {                                   // 22
  var self = this;                                                                                  // 23
  if(!this.applyFilters('client', errorDef.name, err, errorDef.subType)) {                          // 24
    return;                                                                                         // 25
  };                                                                                                // 26
                                                                                                    // 27
  if(!this.canSendErrors()) {                                                                       // 28
    // reached maximum error count for this interval (1 min)                                        // 29
    return;                                                                                         // 30
  }                                                                                                 // 31
                                                                                                    // 32
  if(force) {                                                                                       // 33
    sendError();                                                                                    // 34
  } else {                                                                                          // 35
    if(Kadira.syncedDate.synced || self.options.waitForNtpSyncInterval == 0) {                      // 36
      sendError();                                                                                  // 37
    } else {                                                                                        // 38
      setTimeout(forceSendError, self.options.waitForNtpSyncInterval);                              // 39
    }                                                                                               // 40
  }                                                                                                 // 41
                                                                                                    // 42
  function forceSendError() {                                                                       // 43
    self.sendError(errorDef, err, true);                                                            // 44
  }                                                                                                 // 45
                                                                                                    // 46
  function sendError() {                                                                            // 47
    if(!self.errorsSent[errorDef.name]) {                                                           // 48
      // sync time with the server                                                                  // 49
      if(errorDef.startTime) {                                                                      // 50
        errorDef.startTime = Kadira.syncedDate.syncTime(errorDef.startTime);                        // 51
      }                                                                                             // 52
      errorDef.count = 1;                                                                           // 53
      var payload = {host: Kadira.options.hostname, errors: [errorDef]}                             // 54
      Kadira.send(payload, '/errors');                                                              // 55
                                                                                                    // 56
      self.errorsSent[errorDef.name] = _.clone(errorDef);                                           // 57
      self.errorsSent[errorDef.name].count = 0;                                                     // 58
      self.errorsSentCount++;                                                                       // 59
    } else {                                                                                        // 60
      self.increamentErrorCount(errorDef.name);                                                     // 61
    }                                                                                               // 62
  }                                                                                                 // 63
};                                                                                                  // 64
                                                                                                    // 65
ErrorModel.prototype._flushErrors = function() {                                                    // 66
  var self = this;                                                                                  // 67
  var errors = _.values(self.errorsSent);                                                           // 68
  errors = _.filter(errors, function(error) {                                                       // 69
    return error.count > 0;                                                                         // 70
  });                                                                                               // 71
                                                                                                    // 72
  if(errors.length > 0) {                                                                           // 73
    Kadira.send({errors: errors}, '/errors');                                                       // 74
  }                                                                                                 // 75
  self.errorsSent = Object.create(null);                                                            // 76
};                                                                                                  // 77
                                                                                                    // 78
ErrorModel.prototype.isErrorExists = function(name) {                                               // 79
  return !!this.errorsSent[name];                                                                   // 80
};                                                                                                  // 81
                                                                                                    // 82
ErrorModel.prototype.increamentErrorCount = function(name) {                                        // 83
  var error = this.errorsSent[name];                                                                // 84
  if(error) {                                                                                       // 85
    error.count++;                                                                                  // 86
  }                                                                                                 // 87
};                                                                                                  // 88
                                                                                                    // 89
ErrorModel.prototype.canSendErrors = function() {                                                   // 90
  return this.errorsSentCount < this.options.maxErrorsPerInterval;                                  // 91
};                                                                                                  // 92
                                                                                                    // 93
ErrorModel.prototype.close = function() {                                                           // 94
  clearTimeout(this.intervalTimeoutHandler);                                                        // 95
};                                                                                                  // 96
                                                                                                    // 97
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/error_reporters/zone.js                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
if(window.Zone && Zone.inited) {                                                                    // 1
  Zone.Reporters.add('kadira', kadiraZoneReporter);                                                 // 2
}                                                                                                   // 3
                                                                                                    // 4
function kadiraZoneReporter(zone) {                                                                 // 5
  // track only if error tracking is enabled                                                        // 6
  if(!Kadira.options.enableErrorTracking) {                                                         // 7
    return;                                                                                         // 8
  }                                                                                                 // 9
                                                                                                    // 10
  var errorName = Zone.Reporters.getErrorMessage(zone.erroredStack._e);                             // 11
  if(Kadira.errors.isErrorExists(errorName)) {                                                      // 12
    Kadira.errors.increamentErrorCount(errorName);                                                  // 13
  } else if(Kadira.errors.canSendErrors()) {                                                        // 14
    getErrorStack(zone, function(stacks) {                                                          // 15
      Kadira.errors.sendError({                                                                     // 16
        appId : Kadira.options.appId,                                                               // 17
        name : errorName,                                                                           // 18
        type : 'client',                                                                            // 19
        startTime : zone.runAt,                                                                     // 20
        subType : 'zone',                                                                           // 21
        info : getBrowserInfo(),                                                                    // 22
        stacks : JSON.stringify(stacks),                                                            // 23
      });                                                                                           // 24
    });                                                                                             // 25
  }                                                                                                 // 26
}                                                                                                   // 27
                                                                                                    // 28
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/error_reporters/window_error.js                           //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var prevWindowOnError = window.onerror || Function.prototype;                                       // 1
                                                                                                    // 2
window.onerror = function(message, url, line, col, error) {                                         // 3
  // track only if error tracking is enabled                                                        // 4
  if(!Kadira.options.enableErrorTracking) {                                                         // 5
    return prevWindowOnError(message, url, line, col, error);                                       // 6
  }                                                                                                 // 7
                                                                                                    // 8
  url = url || '<anonymous>';                                                                       // 9
  line = line || 0;                                                                                 // 10
  col = col || 0;                                                                                   // 11
                                                                                                    // 12
  if(error) {                                                                                       // 13
    var stack = error.stack;                                                                        // 14
  } else {                                                                                          // 15
    var stack = 'Error:\n    at window.onerror ('+url+':'+line+':'+col+')';                         // 16
  }                                                                                                 // 17
                                                                                                    // 18
  var now = (new Date().getTime());                                                                 // 19
  Kadira.errors.sendError({                                                                         // 20
    appId : Kadira.options.appId,                                                                   // 21
    name : message,                                                                                 // 22
    type : 'client',                                                                                // 23
    startTime : now,                                                                                // 24
    subType : 'window.onerror',                                                                     // 25
    info : getBrowserInfo(),                                                                        // 26
    stacks : JSON.stringify([{at: now, events: [], stack: stack}]),                                 // 27
  });                                                                                               // 28
                                                                                                    // 29
  return prevWindowOnError(message, url, line, col, error);;                                        // 30
}                                                                                                   // 31
                                                                                                    // 32
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/error_reporters/meteor_debug.js                           //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var originalMeteorDebug = Meteor._debug;                                                            // 1
                                                                                                    // 2
Meteor._debug = function(m, s) {                                                                    // 3
  // We need to asign variables like this. Otherwise,                                               // 4
  // we can't see proper error messages.                                                            // 5
  // See: https://github.com/meteorhacks/kadira/issues/193                                          // 6
  var message = m;                                                                                  // 7
  var stack = s;                                                                                    // 8
                                                                                                    // 9
  // track only if error tracking is enabled                                                        // 10
  if(!Kadira.options.enableErrorTracking) {                                                         // 11
    return originalMeteorDebug(message, stack);                                                     // 12
  }                                                                                                 // 13
                                                                                                    // 14
  // do not track if a zone is available (let zone handle the error)                                // 15
  if(window.zone) {                                                                                 // 16
    return originalMeteorDebug(message, stack);                                                     // 17
  }                                                                                                 // 18
                                                                                                    // 19
  // We hate Meteor._debug (no single usage pattern)                                                // 20
  if(message instanceof Error) {                                                                    // 21
    stack = message.stack;                                                                          // 22
    message = message.message                                                                       // 23
  } else if(typeof message == 'string' && stack === undefined) {                                    // 24
    stack = getStackFromMessage(message);                                                           // 25
    message = firstLine(message);                                                                   // 26
  }                                                                                                 // 27
                                                                                                    // 28
  // sometimes Meteor._debug is called with the stack concat to the message                         // 29
  // FIXME Meteor._debug can be called in many ways                                                 // 30
  if(message && stack === undefined) {                                                              // 31
    stack = getStackFromMessage(message);                                                           // 32
    message = firstLine(message);                                                                   // 33
  }                                                                                                 // 34
                                                                                                    // 35
  var now = (new Date().getTime());                                                                 // 36
  Kadira.errors.sendError({                                                                         // 37
    appId : Kadira.options.appId,                                                                   // 38
    name : message,                                                                                 // 39
    type : 'client',                                                                                // 40
    startTime : now,                                                                                // 41
    subType : 'meteor._debug',                                                                      // 42
    info : getBrowserInfo(),                                                                        // 43
    stacks : JSON.stringify([{at: now, events: [], stack: stack}]),                                 // 44
  });                                                                                               // 45
                                                                                                    // 46
  return originalMeteorDebug.apply(this, arguments);                                                // 47
};                                                                                                  // 48
                                                                                                    // 49
var stackRegex = /^\s+at\s.+$/gm;                                                                   // 50
function getStackFromMessage (message) {                                                            // 51
  // add empty string to add the empty line at start                                                // 52
  var stack = [''];                                                                                 // 53
  var match;                                                                                        // 54
  while(match = stackRegex.exec(message)) {                                                         // 55
    stack.push(match[0]);                                                                           // 56
  }                                                                                                 // 57
  return stack.join('\n');                                                                          // 58
}                                                                                                   // 59
                                                                                                    // 60
function firstLine (message) {                                                                      // 61
  return message.split('\n')[0];                                                                    // 62
}                                                                                                   // 63
                                                                                                    // 64
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/client/kadira.js                                                 //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
Kadira.enableErrorTracking = function () {                                                          // 1
  Kadira.options.enableErrorTracking = true;                                                        // 2
};                                                                                                  // 3
                                                                                                    // 4
Kadira.disableErrorTracking = function () {                                                         // 5
  Kadira.options.enableErrorTracking = false;                                                       // 6
};                                                                                                  // 7
                                                                                                    // 8
Kadira.trackError = function (type, message, options) {                                             // 9
  if(Kadira.options.enableErrorTracking && type && message) {                                       // 10
    var now = (new Date()).getTime();                                                               // 11
    options = options || {};                                                                        // 12
    _.defaults(options, {subType: 'client', stacks: ''});                                           // 13
    Kadira.errors.sendError({                                                                       // 14
      appId : Kadira.options.appId,                                                                 // 15
      name : message,                                                                               // 16
      source : 'client',                                                                            // 17
      startTime : now,                                                                              // 18
      type : type,                                                                                  // 19
      subType : options.subType,                                                                    // 20
      info : getBrowserInfo(),                                                                      // 21
      stacks : JSON.stringify([{at: now, events: [], stack: options.stacks}]),                      // 22
    });                                                                                             // 23
  }                                                                                                 // 24
};                                                                                                  // 25
                                                                                                    // 26
// Create new NTP object and error model immediately so it can be used                              // 27
// endpoints is set later using __meteor_runtime_config__ or publication                            // 28
Kadira.syncedDate = new Ntp(null);                                                                  // 29
Kadira.errors = new ErrorModel({                                                                    // 30
  waitForNtpSyncInterval: 1000 * 5, // 5 secs                                                       // 31
  intervalInMillis: 1000 * 60 * 1, // 1minutes                                                      // 32
  maxErrorsPerInterval: 5                                                                           // 33
});                                                                                                 // 34
                                                                                                    // 35
// __meteor_runtime_config__ cannot be dynamically set for cordova apps                             // 36
// using a null subscription to send required options to client                                     // 37
if(Meteor.isCordova) {                                                                              // 38
  var SettingsCollection = new Meteor.Collection('kadira_settings');                                // 39
  SettingsCollection.find().observe({added: _.once(initialize)});                                   // 40
} else {                                                                                            // 41
  initialize(__meteor_runtime_config__.kadira);                                                     // 42
}                                                                                                   // 43
                                                                                                    // 44
function initialize (options) {                                                                     // 45
  Kadira.options = options || {};                                                                   // 46
  _.defaults(Kadira.options, {                                                                      // 47
    errorDumpInterval: 1000*60,                                                                     // 48
    maxErrorsPerInterval: 10,                                                                       // 49
    collectAllStacks: false,                                                                        // 50
    enableErrorTracking: false,                                                                     // 51
  });                                                                                               // 52
                                                                                                    // 53
  if(Kadira.options.appId && Kadira.options.endpoint) {                                             // 54
    // update endpoint after receiving correct data                                                 // 55
    Kadira.syncedDate.setEndpoint(Kadira.options.endpoint);                                         // 56
    Kadira.connected = true;                                                                        // 57
    Meteor.startup(function () {                                                                    // 58
      // if we don't do this this might block the initial rendering                                 // 59
      // or, it will show up bottom of the page, which is not cool                                  // 60
      setTimeout(function() {                                                                       // 61
        Kadira.syncedDate.sync();                                                                   // 62
      }, Kadira.options.clientEngineSyncDelay);                                                     // 63
    });                                                                                             // 64
  }                                                                                                 // 65
                                                                                                    // 66
  if(Kadira.connected && Kadira.options.enableErrorTracking) {                                      // 67
    Kadira.enableErrorTracking();                                                                   // 68
  }                                                                                                 // 69
                                                                                                    // 70
  if(window.Zone && Zone.inited) {                                                                  // 71
    Zone.collectAllStacks = Kadira.options.collectAllStacks;                                        // 72
  }                                                                                                 // 73
}                                                                                                   // 74
                                                                                                    // 75
// patch jQuery ajax transport to use IE8/IE9 XDR if necessary                                      // 76
if(window.XDomainRequest) {                                                                         // 77
  fixInternetExplorerXDR();                                                                         // 78
}                                                                                                   // 79
                                                                                                    // 80
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/profiler/client.js                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
// For just making a notice                                                                         // 1
// meteorhacks:kadira-profiler will override this method to add                                     // 2
// actual functionality                                                                             // 3
Kadira.profileCpu = function profileCpu() {                                                         // 4
  var message =                                                                                     // 5
    "Please install meteorhacks:kadira-profiler" +                                                  // 6
    " to take a CPU profile.";                                                                      // 7
  console.log(message);                                                                             // 8
};                                                                                                  // 9
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/common/default_error_filters.js                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var commonErrRegExps = [                                                                            // 1
  /connection timeout\. no (\w*) heartbeat received/i,                                              // 2
  /INVALID_STATE_ERR/i,                                                                             // 3
];                                                                                                  // 4
                                                                                                    // 5
Kadira.errorFilters = {                                                                             // 6
  filterValidationErrors: function(type, message, err) {                                            // 7
    if(err && err instanceof Meteor.Error) {                                                        // 8
      return false;                                                                                 // 9
    } else {                                                                                        // 10
      return true;                                                                                  // 11
    }                                                                                               // 12
  },                                                                                                // 13
                                                                                                    // 14
  filterCommonMeteorErrors: function(type, message) {                                               // 15
    for(var lc=0; lc<commonErrRegExps.length; lc++) {                                               // 16
      var regExp = commonErrRegExps[lc];                                                            // 17
      if(regExp.test(message)) {                                                                    // 18
        return false;                                                                               // 19
      }                                                                                             // 20
    }                                                                                               // 21
    return true;                                                                                    // 22
  }                                                                                                 // 23
};                                                                                                  // 24
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/meteorhacks_kadira/lib/common/send.js                                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
Kadira.send = function (payload, path, callback) {                                                  // 1
  if(!Kadira.connected)  {                                                                          // 2
    throw new Error("You need to connect with Kadira first, before sending messages!");             // 3
  }                                                                                                 // 4
                                                                                                    // 5
  path = (path.substr(0, 1) != '/')? "/" + path : path;                                             // 6
  var endpoint = Kadira.options.endpoint + path;                                                    // 7
  var retryCount = 0;                                                                               // 8
  var retry = new Retry({                                                                           // 9
    minCount: 1,                                                                                    // 10
    minTimeout: 0,                                                                                  // 11
    baseTimeout: 1000*5,                                                                            // 12
    maxTimeout: 1000*60,                                                                            // 13
  });                                                                                               // 14
                                                                                                    // 15
  var sendFunction = Kadira._getSendFunction();                                                     // 16
  tryToSend();                                                                                      // 17
                                                                                                    // 18
  function tryToSend(err) {                                                                         // 19
    if(retryCount < 5) {                                                                            // 20
      retry.retryLater(retryCount++, send);                                                         // 21
    } else {                                                                                        // 22
      console.warn('Error sending error traces to kadira server');                                  // 23
      if(callback) callback(err);                                                                   // 24
    }                                                                                               // 25
  }                                                                                                 // 26
                                                                                                    // 27
  function send() {                                                                                 // 28
    sendFunction(endpoint, payload, function(err, content, statusCode) {                            // 29
      if(err) {                                                                                     // 30
        tryToSend(err);                                                                             // 31
      } else if(statusCode == 200){                                                                 // 32
        if(callback) callback(null, content);                                                       // 33
      } else {                                                                                      // 34
        if(callback) callback(new Meteor.Error(statusCode, content));                               // 35
      }                                                                                             // 36
    });                                                                                             // 37
  }                                                                                                 // 38
};                                                                                                  // 39
                                                                                                    // 40
Kadira._getSendFunction = function() {                                                              // 41
  return (Meteor.isServer)? Kadira._serverSend : Kadira._clientSend;                                // 42
};                                                                                                  // 43
                                                                                                    // 44
Kadira._clientSend = function (endpoint, payload, callback) {                                       // 45
  $.ajax({                                                                                          // 46
    type: 'POST',                                                                                   // 47
    url: endpoint,                                                                                  // 48
    contentType: 'application/json',                                                                // 49
    data: JSON.stringify(payload),                                                                  // 50
    error: function(err) {                                                                          // 51
      callback(err);                                                                                // 52
    },                                                                                              // 53
    success: function(data) {                                                                       // 54
      callback(null, data, 200);                                                                    // 55
    }                                                                                               // 56
  });                                                                                               // 57
}                                                                                                   // 58
                                                                                                    // 59
Kadira._serverSend = function (endpoint, payload, callback) {                                       // 60
  callback = callback || function() {};                                                             // 61
  var Fiber = Npm.require('fibers');                                                                // 62
  new Fiber(function() {                                                                            // 63
    var httpOptions = {                                                                             // 64
      data: payload,                                                                                // 65
      headers: Kadira.options.authHeaders                                                           // 66
    };                                                                                              // 67
                                                                                                    // 68
    HTTP.call('POST', endpoint, httpOptions, function(err, res) {                                   // 69
      if(res) {                                                                                     // 70
        var content = (res.statusCode == 200)? res.data : res.content;                              // 71
        callback(null, content, res.statusCode);                                                    // 72
      } else {                                                                                      // 73
        callback(err);                                                                              // 74
      }                                                                                             // 75
    });                                                                                             // 76
  }).run();                                                                                         // 77
}                                                                                                   // 78
//////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteorhacks:kadira'] = {}, {
  Kadira: Kadira
});

})();
