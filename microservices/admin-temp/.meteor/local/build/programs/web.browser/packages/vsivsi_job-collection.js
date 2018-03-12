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
var later = Package['mrt:later'].later;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, Job, JobCollection;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/vsivsi_job-collection/job/src/job_class.coffee                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
                                                                                                                      //
var JobQueue,                                                                                                         // 9
    _clearInterval,                                                                                                   // 9
    _setImmediate,                                                                                                    // 9
    _setInterval,                                                                                                     // 9
    concatReduce,                                                                                                     // 9
    isBoolean,                                                                                                        // 9
    isFunction,                                                                                                       // 9
    isInteger,                                                                                                        // 9
    isNonEmptyString,                                                                                                 // 9
    isNonEmptyStringOrArrayOfNonEmptyStrings,                                                                         // 9
    methodCall,                                                                                                       // 9
    optionsHelp,                                                                                                      // 9
    reduceCallbacks,                                                                                                  // 9
    splitLongArray,                                                                                                   // 9
    slice = [].slice,                                                                                                 // 9
    indexOf = [].indexOf || function (item) {                                                                         // 9
  for (var i = 0, l = this.length; i < l; i++) {                                                                      // 3
    if (i in this && this[i] === item) return i;                                                                      // 3
  }                                                                                                                   // 3
                                                                                                                      //
  return -1;                                                                                                          // 3
};                                                                                                                    // 3
                                                                                                                      //
methodCall = function (root, method, params, cb, after) {                                                             // 9
  var apply, name, ref, ref1, ref2, ref3;                                                                             // 10
                                                                                                                      //
  if (after == null) {                                                                                                // 7
    after = function (ret) {                                                                                          // 9
      return ret;                                                                                                     // 9
    };                                                                                                                // 9
  }                                                                                                                   // 11
                                                                                                                      //
  apply = (ref = (ref1 = Job._ddp_apply) != null ? ref1[(ref2 = root.root) != null ? ref2 : root] : void 0) != null ? ref : Job._ddp_apply;
                                                                                                                      //
  if (typeof apply !== 'function') {                                                                                  // 11
    throw new Error("Job remote method call error, no valid invocation method found.");                               // 12
  }                                                                                                                   // 15
                                                                                                                      //
  name = ((ref3 = root.root) != null ? ref3 : root) + "_" + method;                                                   // 13
                                                                                                                      //
  if (cb && typeof cb === 'function') {                                                                               // 14
    return apply(name, params, function (_this) {                                                                     // 18
      return function (err, res) {                                                                                    // 19
        if (err) {                                                                                                    // 16
          return cb(err);                                                                                             // 16
        }                                                                                                             // 22
                                                                                                                      //
        return cb(null, after(res));                                                                                  // 23
      };                                                                                                              // 15
    }(this));                                                                                                         // 15
  } else {                                                                                                            // 14
    return after(apply(name, params));                                                                                // 19
  }                                                                                                                   // 28
};                                                                                                                    // 9
                                                                                                                      //
optionsHelp = function (options, cb) {                                                                                // 21
  var ref;                                                                                                            // 23
                                                                                                                      //
  if (cb != null && typeof cb !== 'function') {                                                                       // 23
    options = cb;                                                                                                     // 24
    cb = void 0;                                                                                                      // 25
  } else {                                                                                                            // 23
    if (!((typeof options === "undefined" ? "undefined" : _typeof(options)) === 'object' && options instanceof Array && options.length < 2)) {
      throw new Error('options... in optionsHelp must be an Array with zero or one elements');                        // 30
    }                                                                                                                 // 39
                                                                                                                      //
    options = (ref = options != null ? options[0] : void 0) != null ? ref : {};                                       // 31
  }                                                                                                                   // 41
                                                                                                                      //
  if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== 'object') {                               // 32
    throw new Error('in optionsHelp options not an object or bad callback');                                          // 33
  }                                                                                                                   // 44
                                                                                                                      //
  return [options, cb];                                                                                               // 34
};                                                                                                                    // 21
                                                                                                                      //
splitLongArray = function (arr, max) {                                                                                // 36
  var i, k, ref, results;                                                                                             // 37
                                                                                                                      //
  if (!(arr instanceof Array && max > 0)) {                                                                           // 37
    throw new Error('splitLongArray: bad params');                                                                    // 37
  }                                                                                                                   // 52
                                                                                                                      //
  results = [];                                                                                                       // 38
                                                                                                                      //
  for (i = k = 0, ref = Math.ceil(arr.length / max); 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {        // 54
    results.push(arr.slice(i * max, (i + 1) * max));                                                                  // 55
  }                                                                                                                   // 38
                                                                                                                      //
  return results;                                                                                                     // 57
};                                                                                                                    // 36
                                                                                                                      //
reduceCallbacks = function (cb, num, reduce, init) {                                                                  // 42
  var cbCount, cbErr, cbRetVal;                                                                                       // 43
                                                                                                                      //
  if (reduce == null) {                                                                                               // 62
    reduce = function (a, b) {                                                                                        // 42
      return a || b;                                                                                                  // 64
    };                                                                                                                // 42
  }                                                                                                                   // 66
                                                                                                                      //
  if (init == null) {                                                                                                 // 67
    init = false;                                                                                                     // 42
  }                                                                                                                   // 69
                                                                                                                      //
  if (cb == null) {                                                                                                   // 43
    return void 0;                                                                                                    // 43
  }                                                                                                                   // 72
                                                                                                                      //
  if (!(typeof cb === 'function' && num > 0 && typeof reduce === 'function')) {                                       // 44
    throw new Error('Bad params given to reduceCallbacks');                                                           // 45
  }                                                                                                                   // 75
                                                                                                                      //
  cbRetVal = init;                                                                                                    // 46
  cbCount = 0;                                                                                                        // 47
  cbErr = null;                                                                                                       // 48
  return function (err, res) {                                                                                        // 49
    if (!cbErr) {                                                                                                     // 50
      if (err) {                                                                                                      // 51
        cbErr = err;                                                                                                  // 52
        return cb(err);                                                                                               // 83
      } else {                                                                                                        // 51
        cbCount++;                                                                                                    // 55
        cbRetVal = reduce(cbRetVal, res);                                                                             // 56
                                                                                                                      //
        if (cbCount === num) {                                                                                        // 57
          return cb(null, cbRetVal);                                                                                  // 88
        } else if (cbCount > num) {                                                                                   // 57
          throw new Error("reduceCallbacks callback invoked more than requested " + num + " times");                  // 60
        }                                                                                                             // 51
      }                                                                                                               // 50
    }                                                                                                                 // 93
  };                                                                                                                  // 49
};                                                                                                                    // 42
                                                                                                                      //
concatReduce = function (a, b) {                                                                                      // 62
  if (!(a instanceof Array)) {                                                                                        // 63
    a = [a];                                                                                                          // 63
  }                                                                                                                   // 100
                                                                                                                      //
  return a.concat(b);                                                                                                 // 101
};                                                                                                                    // 62
                                                                                                                      //
isInteger = function (i) {                                                                                            // 66
  return typeof i === 'number' && Math.floor(i) === i;                                                                // 105
};                                                                                                                    // 66
                                                                                                                      //
isBoolean = function (b) {                                                                                            // 68
  return typeof b === 'boolean';                                                                                      // 109
};                                                                                                                    // 68
                                                                                                                      //
isFunction = function (f) {                                                                                           // 70
  return typeof f === 'function';                                                                                     // 113
};                                                                                                                    // 70
                                                                                                                      //
isNonEmptyString = function (s) {                                                                                     // 72
  return typeof s === 'string' && s.length > 0;                                                                       // 117
};                                                                                                                    // 72
                                                                                                                      //
isNonEmptyStringOrArrayOfNonEmptyStrings = function (sa) {                                                            // 74
  var s;                                                                                                              // 75
  return isNonEmptyString(sa) || sa instanceof Array && sa.length !== 0 && function () {                              // 122
    var k, len, results;                                                                                              // 123
    results = [];                                                                                                     // 78
                                                                                                                      //
    for (k = 0, len = sa.length; k < len; k++) {                                                                      // 125
      s = sa[k];                                                                                                      // 126
                                                                                                                      //
      if (isNonEmptyString(s)) {                                                                                      // 127
        results.push(s);                                                                                              // 128
      }                                                                                                               // 129
    }                                                                                                                 // 78
                                                                                                                      //
    return results;                                                                                                   // 131
  }().length === sa.length;                                                                                           // 132
};                                                                                                                    // 74
                                                                                                                      //
_setImmediate = function () {                                                                                         // 81
  var args, func;                                                                                                     // 82
  func = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];                                  // 81
                                                                                                                      //
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setTimeout : void 0) != null) {                      // 82
    return Meteor.setTimeout.apply(Meteor, [func, 0].concat(slice.call(args)));                                       // 83
  } else if (typeof setImmediate !== "undefined" && setImmediate !== null) {                                          // 82
    return setImmediate.apply(null, [func].concat(slice.call(args)));                                                 // 85
  } else {                                                                                                            // 84
    return setTimeout.apply(null, [func, 0].concat(slice.call(args)));                                                // 88
  }                                                                                                                   // 144
};                                                                                                                    // 81
                                                                                                                      //
_setInterval = function () {                                                                                          // 90
  var args, func, timeOut;                                                                                            // 91
  func = arguments[0], timeOut = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];          // 90
                                                                                                                      //
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.setInterval : void 0) != null) {                     // 91
    return Meteor.setInterval.apply(Meteor, [func, timeOut].concat(slice.call(args)));                                // 92
  } else {                                                                                                            // 91
    return setInterval.apply(null, [func, timeOut].concat(slice.call(args)));                                         // 95
  }                                                                                                                   // 154
};                                                                                                                    // 90
                                                                                                                      //
_clearInterval = function (id) {                                                                                      // 97
  if ((typeof Meteor !== "undefined" && Meteor !== null ? Meteor.clearInterval : void 0) != null) {                   // 98
    return Meteor.clearInterval(id);                                                                                  // 99
  } else {                                                                                                            // 98
    return clearInterval(id);                                                                                         // 102
  }                                                                                                                   // 162
};                                                                                                                    // 97
                                                                                                                      //
JobQueue = function () {                                                                                              // 106
  function JobQueue() {                                                                                               // 108
    var k, options, ref, ref1, ref2, ref3, ref4, root1, type1, worker;                                                // 109
    root1 = arguments[0], type1 = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), worker = arguments[k++];
    this.root = root1;                                                                                                // 108
    this.type = type1;                                                                                                // 108
    this.worker = worker;                                                                                             // 108
                                                                                                                      //
    if (!(this instanceof JobQueue)) {                                                                                // 109
      return function (func, args, ctor) {                                                                            // 110
        ctor.prototype = func.prototype;                                                                              // 174
        var child = new ctor(),                                                                                       // 175
            result = func.apply(child, args);                                                                         // 175
        return Object(result) === result ? result : child;                                                            // 176
      }(JobQueue, [this.root, this.type].concat(slice.call(options), [this.worker]), function () {});                 // 177
    }                                                                                                                 // 178
                                                                                                                      //
    ref = optionsHelp(options, this.worker), options = ref[0], this.worker = ref[1];                                  // 111
                                                                                                                      //
    if (!isNonEmptyString(this.root)) {                                                                               // 113
      throw new Error("JobQueue: Invalid root, must be nonempty string");                                             // 114
    }                                                                                                                 // 182
                                                                                                                      //
    if (!isNonEmptyStringOrArrayOfNonEmptyStrings(this.type)) {                                                       // 116
      throw new Error("JobQueue: Invalid type, must be nonempty string or array of nonempty strings");                // 117
    }                                                                                                                 // 185
                                                                                                                      //
    if (!isFunction(this.worker)) {                                                                                   // 119
      throw new Error("JobQueue: Invalid worker, must be a function");                                                // 120
    }                                                                                                                 // 188
                                                                                                                      //
    this.errorCallback = (ref1 = options.errorCallback) != null ? ref1 : function (e) {                               // 122
      return console.error("JobQueue: ", e);                                                                          // 190
    };                                                                                                                // 122
                                                                                                                      //
    if (!isFunction(this.errorCallback)) {                                                                            // 124
      throw new Error("JobQueue: Invalid errorCallback, must be a function");                                         // 125
    }                                                                                                                 // 194
                                                                                                                      //
    this.pollInterval = options.pollInterval != null && !options.pollInterval ? Job.forever : !(options.pollInterval != null && isInteger(options.pollInterval)) ? 5000 : options.pollInterval;
                                                                                                                      //
    if (!(isInteger(this.pollInterval) && this.pollInterval >= 0)) {                                                  // 134
      throw new Error("JobQueue: Invalid pollInterval, must be a positive integer");                                  // 135
    }                                                                                                                 // 198
                                                                                                                      //
    this.concurrency = (ref2 = options.concurrency) != null ? ref2 : 1;                                               // 137
                                                                                                                      //
    if (!(isInteger(this.concurrency) && this.concurrency >= 0)) {                                                    // 138
      throw new Error("JobQueue: Invalid concurrency, must be a positive integer");                                   // 139
    }                                                                                                                 // 202
                                                                                                                      //
    this.payload = (ref3 = options.payload) != null ? ref3 : 1;                                                       // 141
                                                                                                                      //
    if (!(isInteger(this.payload) && this.payload >= 0)) {                                                            // 142
      throw new Error("JobQueue: Invalid payload, must be a positive integer");                                       // 143
    }                                                                                                                 // 206
                                                                                                                      //
    this.prefetch = (ref4 = options.prefetch) != null ? ref4 : 0;                                                     // 145
                                                                                                                      //
    if (!(isInteger(this.prefetch) && this.prefetch >= 0)) {                                                          // 146
      throw new Error("JobQueue: Invalid prefetch, must be a positive integer");                                      // 147
    }                                                                                                                 // 210
                                                                                                                      //
    this.workTimeout = options.workTimeout;                                                                           // 149
                                                                                                                      //
    if (this.workTimeout != null && !(isInteger(this.workTimeout) && this.workTimeout >= 0)) {                        // 150
      throw new Error("JobQueue: Invalid workTimeout, must be a positive integer");                                   // 151
    }                                                                                                                 // 214
                                                                                                                      //
    this.callbackStrict = options.callbackStrict;                                                                     // 153
                                                                                                                      //
    if (this.callbackStrict != null && !isBoolean(this.callbackStrict)) {                                             // 154
      throw new Error("JobQueue: Invalid callbackStrict, must be a boolean");                                         // 155
    }                                                                                                                 // 218
                                                                                                                      //
    this._workers = {};                                                                                               // 157
    this._tasks = [];                                                                                                 // 158
    this._taskNumber = 0;                                                                                             // 159
    this._stoppingGetWork = void 0;                                                                                   // 160
    this._stoppingTasks = void 0;                                                                                     // 161
    this._interval = null;                                                                                            // 162
    this._getWorkOutstanding = false;                                                                                 // 163
    this.paused = true;                                                                                               // 164
    this.resume();                                                                                                    // 165
  }                                                                                                                   // 108
                                                                                                                      //
  JobQueue.prototype._getWork = function () {                                                                         // 230
    var numJobsToGet, options;                                                                                        // 169
                                                                                                                      //
    if (!(this._getWorkOutstanding || this.paused)) {                                                                 // 169
      numJobsToGet = this.prefetch + this.payload * (this.concurrency - this.running()) - this.length();              // 170
                                                                                                                      //
      if (numJobsToGet > 0) {                                                                                         // 171
        this._getWorkOutstanding = true;                                                                              // 172
        options = {                                                                                                   // 173
          maxJobs: numJobsToGet                                                                                       // 173
        };                                                                                                            // 173
                                                                                                                      //
        if (this.workTimeout != null) {                                                                               // 174
          options.workTimeout = this.workTimeout;                                                                     // 174
        }                                                                                                             // 241
                                                                                                                      //
        return Job.getWork(this.root, this.type, options, function (_this) {                                          // 242
          return function (err, jobs) {                                                                               // 243
            var j, k, len;                                                                                            // 176
            _this._getWorkOutstanding = false;                                                                        // 176
                                                                                                                      //
            if (err) {                                                                                                // 177
              return _this.errorCallback(new Error("Received error from getWork(): " + err));                         // 247
            } else if (jobs != null && jobs instanceof Array) {                                                       // 177
              if (jobs.length > numJobsToGet) {                                                                       // 180
                _this.errorCallback(new Error("getWork() returned jobs (" + jobs.length + ") in excess of maxJobs (" + numJobsToGet + ")"));
              }                                                                                                       // 251
                                                                                                                      //
              for (k = 0, len = jobs.length; k < len; k++) {                                                          // 182
                j = jobs[k];                                                                                          // 253
                                                                                                                      //
                _this._tasks.push(j);                                                                                 // 183
                                                                                                                      //
                if (_this._stoppingGetWork == null) {                                                                 // 184
                  _setImmediate(_this._process.bind(_this));                                                          // 184
                }                                                                                                     // 257
              }                                                                                                       // 182
                                                                                                                      //
              if (_this._stoppingGetWork != null) {                                                                   // 185
                return _this._stoppingGetWork();                                                                      // 260
              }                                                                                                       // 179
            } else {                                                                                                  // 179
              return _this.errorCallback(new Error("Nonarray response from server from getWork()"));                  // 263
            }                                                                                                         // 264
          };                                                                                                          // 175
        }(this));                                                                                                     // 175
      }                                                                                                               // 169
    }                                                                                                                 // 268
  };                                                                                                                  // 167
                                                                                                                      //
  JobQueue.prototype._only_once = function (fn) {                                                                     // 271
    var called;                                                                                                       // 190
    called = false;                                                                                                   // 190
    return function (_this) {                                                                                         // 191
      return function () {                                                                                            // 275
        if (called) {                                                                                                 // 192
          _this.errorCallback(new Error("Worker callback called multiple times"));                                    // 193
                                                                                                                      //
          if (_this.callbackStrict) {                                                                                 // 194
            throw new Error("JobQueue: worker callback was invoked multiple times");                                  // 195
          }                                                                                                           // 192
        }                                                                                                             // 281
                                                                                                                      //
        called = true;                                                                                                // 196
        return fn.apply(_this, arguments);                                                                            // 283
      };                                                                                                              // 191
    }(this);                                                                                                          // 191
  };                                                                                                                  // 189
                                                                                                                      //
  JobQueue.prototype._process = function () {                                                                         // 288
    var cb, job, next;                                                                                                // 200
                                                                                                                      //
    if (!this.paused && this.running() < this.concurrency && this.length()) {                                         // 200
      if (this.payload > 1) {                                                                                         // 201
        job = this._tasks.splice(0, this.payload);                                                                    // 202
      } else {                                                                                                        // 201
        job = this._tasks.shift();                                                                                    // 204
      }                                                                                                               // 295
                                                                                                                      //
      job._taskId = "Task_" + this._taskNumber++;                                                                     // 205
      this._workers[job._taskId] = job;                                                                               // 206
                                                                                                                      //
      next = function (_this) {                                                                                       // 207
        return function () {                                                                                          // 299
          delete _this._workers[job._taskId];                                                                         // 208
                                                                                                                      //
          if (_this._stoppingTasks != null && _this.running() === 0 && _this.length() === 0) {                        // 209
            return _this._stoppingTasks();                                                                            // 302
          } else {                                                                                                    // 209
            _setImmediate(_this._process.bind(_this));                                                                // 212
                                                                                                                      //
            return _setImmediate(_this._getWork.bind(_this));                                                         // 305
          }                                                                                                           // 306
        };                                                                                                            // 207
      }(this);                                                                                                        // 207
                                                                                                                      //
      cb = this._only_once(next);                                                                                     // 214
      return this.worker(job, cb);                                                                                    // 310
    }                                                                                                                 // 311
  };                                                                                                                  // 199
                                                                                                                      //
  JobQueue.prototype._stopGetWork = function (callback) {                                                             // 314
    _clearInterval(this._interval);                                                                                   // 218
                                                                                                                      //
    this._interval = null;                                                                                            // 219
                                                                                                                      //
    if (this._getWorkOutstanding) {                                                                                   // 220
      return this._stoppingGetWork = callback;                                                                        // 318
    } else {                                                                                                          // 220
      return _setImmediate(callback);                                                                                 // 320
    }                                                                                                                 // 321
  };                                                                                                                  // 217
                                                                                                                      //
  JobQueue.prototype._waitForTasks = function (callback) {                                                            // 324
    if (this.running() !== 0) {                                                                                       // 226
      return this._stoppingTasks = callback;                                                                          // 326
    } else {                                                                                                          // 226
      return _setImmediate(callback);                                                                                 // 328
    }                                                                                                                 // 329
  };                                                                                                                  // 225
                                                                                                                      //
  JobQueue.prototype._failJobs = function (tasks, callback) {                                                         // 332
    var count, job, k, len, results;                                                                                  // 232
                                                                                                                      //
    if (tasks.length === 0) {                                                                                         // 232
      _setImmediate(callback);                                                                                        // 232
    }                                                                                                                 // 336
                                                                                                                      //
    count = 0;                                                                                                        // 233
    results = [];                                                                                                     // 234
                                                                                                                      //
    for (k = 0, len = tasks.length; k < len; k++) {                                                                   // 339
      job = tasks[k];                                                                                                 // 340
      results.push(job.fail("Worker shutdown", function (_this) {                                                     // 341
        return function (err, res) {                                                                                  // 342
          count++;                                                                                                    // 236
                                                                                                                      //
          if (count === tasks.length) {                                                                               // 237
            return callback();                                                                                        // 345
          }                                                                                                           // 346
        };                                                                                                            // 235
      }(this)));                                                                                                      // 235
    }                                                                                                                 // 234
                                                                                                                      //
    return results;                                                                                                   // 350
  };                                                                                                                  // 231
                                                                                                                      //
  JobQueue.prototype._hard = function (callback) {                                                                    // 353
    this.paused = true;                                                                                               // 241
    return this._stopGetWork(function (_this) {                                                                       // 355
      return function () {                                                                                            // 356
        var i, r, ref, tasks;                                                                                         // 243
        tasks = _this._tasks;                                                                                         // 243
        _this._tasks = [];                                                                                            // 244
        ref = _this._workers;                                                                                         // 245
                                                                                                                      //
        for (i in meteorBabelHelpers.sanitizeForInObject(ref)) {                                                      // 245
          r = ref[i];                                                                                                 // 362
          tasks = tasks.concat(r);                                                                                    // 246
        }                                                                                                             // 245
                                                                                                                      //
        return _this._failJobs(tasks, callback);                                                                      // 365
      };                                                                                                              // 242
    }(this));                                                                                                         // 242
  };                                                                                                                  // 240
                                                                                                                      //
  JobQueue.prototype._stop = function (callback) {                                                                    // 370
    this.paused = true;                                                                                               // 250
    return this._stopGetWork(function (_this) {                                                                       // 372
      return function () {                                                                                            // 373
        var tasks;                                                                                                    // 252
        tasks = _this._tasks;                                                                                         // 252
        _this._tasks = [];                                                                                            // 253
        return _this._waitForTasks(function () {                                                                      // 377
          return _this._failJobs(tasks, callback);                                                                    // 378
        });                                                                                                           // 254
      };                                                                                                              // 251
    }(this));                                                                                                         // 251
  };                                                                                                                  // 249
                                                                                                                      //
  JobQueue.prototype._soft = function (callback) {                                                                    // 384
    return this._stopGetWork(function (_this) {                                                                       // 385
      return function () {                                                                                            // 386
        return _this._waitForTasks(callback);                                                                         // 387
      };                                                                                                              // 258
    }(this));                                                                                                         // 258
  };                                                                                                                  // 257
                                                                                                                      //
  JobQueue.prototype.length = function () {                                                                           // 392
    return this._tasks.length;                                                                                        // 393
  };                                                                                                                  // 261
                                                                                                                      //
  JobQueue.prototype.running = function () {                                                                          // 396
    return Object.keys(this._workers).length;                                                                         // 397
  };                                                                                                                  // 263
                                                                                                                      //
  JobQueue.prototype.idle = function () {                                                                             // 400
    return this.length() + this.running() === 0;                                                                      // 401
  };                                                                                                                  // 265
                                                                                                                      //
  JobQueue.prototype.full = function () {                                                                             // 404
    return this.running() === this.concurrency;                                                                       // 405
  };                                                                                                                  // 267
                                                                                                                      //
  JobQueue.prototype.pause = function () {                                                                            // 408
    if (this.paused) {                                                                                                // 270
      return;                                                                                                         // 270
    }                                                                                                                 // 411
                                                                                                                      //
    if (!(this.pollInterval >= Job.forever)) {                                                                        // 271
      _clearInterval(this._interval);                                                                                 // 272
                                                                                                                      //
      this._interval = null;                                                                                          // 273
    }                                                                                                                 // 415
                                                                                                                      //
    this.paused = true;                                                                                               // 274
    return this;                                                                                                      // 417
  };                                                                                                                  // 269
                                                                                                                      //
  JobQueue.prototype.resume = function () {                                                                           // 420
    var k, ref, w;                                                                                                    // 278
                                                                                                                      //
    if (!this.paused) {                                                                                               // 278
      return;                                                                                                         // 278
    }                                                                                                                 // 424
                                                                                                                      //
    this.paused = false;                                                                                              // 279
                                                                                                                      //
    _setImmediate(this._getWork.bind(this));                                                                          // 280
                                                                                                                      //
    if (!(this.pollInterval >= Job.forever)) {                                                                        // 281
      this._interval = _setInterval(this._getWork.bind(this), this.pollInterval);                                     // 282
    }                                                                                                                 // 429
                                                                                                                      //
    for (w = k = 1, ref = this.concurrency; 1 <= ref ? k <= ref : k >= ref; w = 1 <= ref ? ++k : --k) {               // 283
      _setImmediate(this._process.bind(this));                                                                        // 284
    }                                                                                                                 // 283
                                                                                                                      //
    return this;                                                                                                      // 433
  };                                                                                                                  // 277
                                                                                                                      //
  JobQueue.prototype.trigger = function () {                                                                          // 436
    if (this.paused) {                                                                                                // 288
      return;                                                                                                         // 288
    }                                                                                                                 // 439
                                                                                                                      //
    _setImmediate(this._getWork.bind(this));                                                                          // 289
                                                                                                                      //
    return this;                                                                                                      // 441
  };                                                                                                                  // 287
                                                                                                                      //
  JobQueue.prototype.shutdown = function () {                                                                         // 444
    var cb, k, options, ref;                                                                                          // 293
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 293
                                                                                                                      //
    if (options.level == null) {                                                                                      // 448
      options.level = 'normal';                                                                                       // 294
    }                                                                                                                 // 450
                                                                                                                      //
    if (options.quiet == null) {                                                                                      // 451
      options.quiet = false;                                                                                          // 295
    }                                                                                                                 // 453
                                                                                                                      //
    if (cb == null) {                                                                                                 // 296
      if (!options.quiet) {                                                                                           // 297
        console.warn("using default shutdown callback!");                                                             // 297
      }                                                                                                               // 457
                                                                                                                      //
      cb = function (_this) {                                                                                         // 298
        return function () {                                                                                          // 459
          return console.warn("Shutdown complete");                                                                   // 460
        };                                                                                                            // 298
      }(this);                                                                                                        // 298
    }                                                                                                                 // 463
                                                                                                                      //
    switch (options.level) {                                                                                          // 300
      case 'hard':                                                                                                    // 300
        if (!options.quiet) {                                                                                         // 302
          console.warn("Shutting down hard");                                                                         // 302
        }                                                                                                             // 468
                                                                                                                      //
        return this._hard(cb);                                                                                        // 469
                                                                                                                      //
      case 'soft':                                                                                                    // 300
        if (!options.quiet) {                                                                                         // 305
          console.warn("Shutting down soft");                                                                         // 305
        }                                                                                                             // 473
                                                                                                                      //
        return this._soft(cb);                                                                                        // 474
                                                                                                                      //
      default:                                                                                                        // 300
        if (!options.quiet) {                                                                                         // 308
          console.warn("Shutting down normally");                                                                     // 308
        }                                                                                                             // 478
                                                                                                                      //
        return this._stop(cb);                                                                                        // 479
    }                                                                                                                 // 300
  };                                                                                                                  // 292
                                                                                                                      //
  return JobQueue;                                                                                                    // 483
}();                                                                                                                  // 485
                                                                                                                      //
Job = function () {                                                                                                   // 313
  Job.forever = 9007199254740992;                                                                                     // 316
  Job.foreverDate = new Date(8640000000000000);                                                                       // 319
  Job.jobPriorities = {                                                                                               // 321
    low: 10,                                                                                                          // 322
    normal: 0,                                                                                                        // 323
    medium: -5,                                                                                                       // 324
    high: -10,                                                                                                        // 325
    critical: -15                                                                                                     // 326
  };                                                                                                                  // 322
  Job.jobRetryBackoffMethods = ['constant', 'exponential'];                                                           // 328
  Job.jobStatuses = ['waiting', 'paused', 'ready', 'running', 'failed', 'cancelled', 'completed'];                    // 330
  Job.jobLogLevels = ['info', 'success', 'warning', 'danger'];                                                        // 333
  Job.jobStatusCancellable = ['running', 'ready', 'waiting', 'paused'];                                               // 335
  Job.jobStatusPausable = ['ready', 'waiting'];                                                                       // 336
  Job.jobStatusRemovable = ['cancelled', 'completed', 'failed'];                                                      // 337
  Job.jobStatusRestartable = ['cancelled', 'failed'];                                                                 // 338
  Job.ddpMethods = ['startJobs', 'stopJobs', 'startJobServer', 'shutdownJobServer', 'jobRemove', 'jobPause', 'jobResume', 'jobReady', 'jobCancel', 'jobRestart', 'jobSave', 'jobRerun', 'getWork', 'getJob', 'jobLog', 'jobProgress', 'jobDone', 'jobFail'];
  Job.ddpPermissionLevels = ['admin', 'manager', 'creator', 'worker'];                                                // 346
  Job.ddpMethodPermissions = {                                                                                        // 349
    'startJobs': ['startJobs', 'admin'],                                                                              // 350
    'stopJobs': ['stopJobs', 'admin'],                                                                                // 351
    'startJobServer': ['startJobServer', 'admin'],                                                                    // 352
    'shutdownJobServer': ['shutdownJobServer', 'admin'],                                                              // 353
    'jobRemove': ['jobRemove', 'admin', 'manager'],                                                                   // 354
    'jobPause': ['jobPause', 'admin', 'manager'],                                                                     // 355
    'jobResume': ['jobResume', 'admin', 'manager'],                                                                   // 356
    'jobCancel': ['jobCancel', 'admin', 'manager'],                                                                   // 357
    'jobReady': ['jobReady', 'admin', 'manager'],                                                                     // 358
    'jobRestart': ['jobRestart', 'admin', 'manager'],                                                                 // 359
    'jobSave': ['jobSave', 'admin', 'creator'],                                                                       // 360
    'jobRerun': ['jobRerun', 'admin', 'creator'],                                                                     // 361
    'getWork': ['getWork', 'admin', 'worker'],                                                                        // 362
    'getJob': ['getJob', 'admin', 'worker'],                                                                          // 363
    'jobLog': ['jobLog', 'admin', 'worker'],                                                                          // 364
    'jobProgress': ['jobProgress', 'admin', 'worker'],                                                                // 365
    'jobDone': ['jobDone', 'admin', 'worker'],                                                                        // 366
    'jobFail': ['jobFail', 'admin', 'worker']                                                                         // 367
  };                                                                                                                  // 350
  Job._ddp_apply = void 0;                                                                                            // 370
                                                                                                                      //
  Job._setDDPApply = function (apply, collectionName) {                                                               // 374
    if (typeof apply === 'function') {                                                                                // 375
      if (typeof collectionName === 'string') {                                                                       // 376
        if (this._ddp_apply == null) {                                                                                // 544
          this._ddp_apply = {};                                                                                       // 377
        }                                                                                                             // 546
                                                                                                                      //
        if (typeof this._ddp_apply === 'function') {                                                                  // 378
          throw new Error("Job.setDDP must specify a collection name each time if called more than once.");           // 379
        }                                                                                                             // 549
                                                                                                                      //
        return this._ddp_apply[collectionName] = apply;                                                               // 550
      } else if (!this._ddp_apply) {                                                                                  // 376
        return this._ddp_apply = apply;                                                                               // 552
      } else {                                                                                                        // 381
        throw new Error("Job.setDDP must specify a collection name each time if called more than once.");             // 384
      }                                                                                                               // 375
    } else {                                                                                                          // 375
      throw new Error("Bad function in Job.setDDPApply()");                                                           // 386
    }                                                                                                                 // 558
  };                                                                                                                  // 374
                                                                                                                      //
  Job.setDDP = function (ddp, collectionNames, Fiber) {                                                               // 389
    var collName, k, len, results;                                                                                    // 390
                                                                                                                      //
    if (ddp == null) {                                                                                                // 563
      ddp = null;                                                                                                     // 389
    }                                                                                                                 // 565
                                                                                                                      //
    if (collectionNames == null) {                                                                                    // 566
      collectionNames = null;                                                                                         // 389
    }                                                                                                                 // 568
                                                                                                                      //
    if (Fiber == null) {                                                                                              // 569
      Fiber = null;                                                                                                   // 389
    }                                                                                                                 // 571
                                                                                                                      //
    if (!(typeof collectionNames === 'string' || collectionNames instanceof Array)) {                                 // 390
      Fiber = collectionNames;                                                                                        // 392
      collectionNames = [void 0];                                                                                     // 393
    } else if (typeof collectionNames === 'string') {                                                                 // 390
      collectionNames = [collectionNames];                                                                            // 396
    }                                                                                                                 // 577
                                                                                                                      //
    results = [];                                                                                                     // 397
                                                                                                                      //
    for (k = 0, len = collectionNames.length; k < len; k++) {                                                         // 579
      collName = collectionNames[k];                                                                                  // 580
                                                                                                                      //
      if (!(ddp != null && ddp.close != null && ddp.subscribe != null)) {                                             // 398
        if (ddp === null && (typeof Meteor !== "undefined" && Meteor !== null ? Meteor.apply : void 0) != null) {     // 400
          results.push(this._setDDPApply(Meteor.apply, collName));                                                    // 583
        } else {                                                                                                      // 400
          throw new Error("Bad ddp object in Job.setDDP()");                                                          // 405
        }                                                                                                             // 398
      } else if (ddp.observe == null) {                                                                               // 398
        results.push(this._setDDPApply(ddp.apply.bind(ddp), collName));                                               // 588
      } else {                                                                                                        // 406
        if (Fiber == null) {                                                                                          // 409
          results.push(this._setDDPApply(ddp.call.bind(ddp), collName));                                              // 591
        } else {                                                                                                      // 409
          results.push(this._setDDPApply(function (name, params, cb) {                                                // 593
            var fib;                                                                                                  // 415
            fib = Fiber.current;                                                                                      // 415
            ddp.call(name, params, function (err, res) {                                                              // 416
              if (cb != null && typeof cb === 'function') {                                                           // 417
                return cb(err, res);                                                                                  // 598
              } else {                                                                                                // 417
                if (err) {                                                                                            // 420
                  return fib.throwInto(err);                                                                          // 601
                } else {                                                                                              // 420
                  return fib.run(res);                                                                                // 603
                }                                                                                                     // 417
              }                                                                                                       // 605
            });                                                                                                       // 416
                                                                                                                      //
            if (cb != null && typeof cb === 'function') {} else {                                                     // 424
              return Fiber["yield"]();                                                                                // 427
            }                                                                                                         // 611
          }, collName));                                                                                              // 414
        }                                                                                                             // 406
      }                                                                                                               // 614
    }                                                                                                                 // 397
                                                                                                                      //
    return results;                                                                                                   // 616
  };                                                                                                                  // 389
                                                                                                                      //
  Job.getWork = function () {                                                                                         // 433
    var cb, k, options, ref, root, type;                                                                              // 434
    root = arguments[0], type = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 434
                                                                                                                      //
    if (typeof type === 'string') {                                                                                   // 435
      type = [type];                                                                                                  // 435
    }                                                                                                                 // 625
                                                                                                                      //
    if (options.workTimeout != null) {                                                                                // 436
      if (!(isInteger(options.workTimeout) && options.workTimeout > 0)) {                                             // 437
        throw new Error('getWork: workTimeout must be a positive integer');                                           // 438
      }                                                                                                               // 436
    }                                                                                                                 // 630
                                                                                                                      //
    return methodCall(root, "getWork", [type, options], cb, function (_this) {                                        // 631
      return function (res) {                                                                                         // 632
        var doc, jobs;                                                                                                // 440
                                                                                                                      //
        jobs = function () {                                                                                          // 440
          var l, len, results;                                                                                        // 635
          results = [];                                                                                               // 440
                                                                                                                      //
          for (l = 0, len = res.length; l < len; l++) {                                                               // 637
            doc = res[l];                                                                                             // 638
            results.push(new Job(root, doc));                                                                         // 639
          }                                                                                                           // 440
                                                                                                                      //
          return results;                                                                                             // 641
        }() || [];                                                                                                    // 642
                                                                                                                      //
        if (options.maxJobs != null) {                                                                                // 441
          return jobs;                                                                                                // 442
        } else {                                                                                                      // 441
          return jobs[0];                                                                                             // 444
        }                                                                                                             // 647
      };                                                                                                              // 439
    }(this));                                                                                                         // 439
  };                                                                                                                  // 433
                                                                                                                      //
  Job.processJobs = JobQueue;                                                                                         // 447
                                                                                                                      //
  Job.makeJob = function () {                                                                                         // 451
    var depFlag;                                                                                                      // 452
    depFlag = false;                                                                                                  // 452
    return function (root, doc) {                                                                                     // 657
      if (!depFlag) {                                                                                                 // 454
        depFlag = true;                                                                                               // 455
        console.warn("Job.makeJob(root, jobDoc) has been deprecated and will be removed in a future release, use 'new Job(root, jobDoc)' instead.");
      }                                                                                                               // 661
                                                                                                                      //
      return new Job(root, doc);                                                                                      // 662
    };                                                                                                                // 453
  }();                                                                                                                // 451
                                                                                                                      //
  Job.getJob = function () {                                                                                          // 461
    var cb, id, k, options, ref, root;                                                                                // 462
    root = arguments[0], id = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 462
                                                                                                                      //
    if (options.getLog == null) {                                                                                     // 670
      options.getLog = false;                                                                                         // 463
    }                                                                                                                 // 672
                                                                                                                      //
    return methodCall(root, "getJob", [id, options], cb, function (_this) {                                           // 673
      return function (doc) {                                                                                         // 674
        if (doc) {                                                                                                    // 465
          return new Job(root, doc);                                                                                  // 676
        } else {                                                                                                      // 465
          return void 0;                                                                                              // 678
        }                                                                                                             // 679
      };                                                                                                              // 464
    }(this));                                                                                                         // 464
  };                                                                                                                  // 461
                                                                                                                      //
  Job.getJobs = function () {                                                                                         // 471
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 472
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 472
                                                                                                                      //
    if (options.getLog == null) {                                                                                     // 688
      options.getLog = false;                                                                                         // 473
    }                                                                                                                 // 690
                                                                                                                      //
    retVal = [];                                                                                                      // 474
    chunksOfIds = splitLongArray(ids, 32);                                                                            // 475
    myCb = reduceCallbacks(cb, chunksOfIds.length, concatReduce, []);                                                 // 476
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 477
      chunkOfIds = chunksOfIds[l];                                                                                    // 695
      retVal = retVal.concat(methodCall(root, "getJob", [chunkOfIds, options], myCb, function (_this) {               // 478
        return function (doc) {                                                                                       // 697
          var d, len1, m, results;                                                                                    // 479
                                                                                                                      //
          if (doc) {                                                                                                  // 479
            results = [];                                                                                             // 480
                                                                                                                      //
            for (m = 0, len1 = doc.length; m < len1; m++) {                                                           // 701
              d = doc[m];                                                                                             // 702
              results.push(new Job(root, d.type, d.data, d));                                                         // 703
            }                                                                                                         // 480
                                                                                                                      //
            return results;                                                                                           // 705
          } else {                                                                                                    // 479
            return null;                                                                                              // 707
          }                                                                                                           // 708
        };                                                                                                            // 478
      }(this)));                                                                                                      // 478
    }                                                                                                                 // 477
                                                                                                                      //
    return retVal;                                                                                                    // 483
  };                                                                                                                  // 471
                                                                                                                      //
  Job.pauseJobs = function () {                                                                                       // 487
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 488
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 488
    retVal = false;                                                                                                   // 489
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 490
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 491
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 492
      chunkOfIds = chunksOfIds[l];                                                                                    // 723
      retVal = methodCall(root, "jobPause", [chunkOfIds, options], myCb) || retVal;                                   // 493
    }                                                                                                                 // 492
                                                                                                                      //
    return retVal;                                                                                                    // 494
  };                                                                                                                  // 487
                                                                                                                      //
  Job.resumeJobs = function () {                                                                                      // 498
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 499
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 499
    retVal = false;                                                                                                   // 500
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 501
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 502
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 503
      chunkOfIds = chunksOfIds[l];                                                                                    // 737
      retVal = methodCall(root, "jobResume", [chunkOfIds, options], myCb) || retVal;                                  // 504
    }                                                                                                                 // 503
                                                                                                                      //
    return retVal;                                                                                                    // 505
  };                                                                                                                  // 498
                                                                                                                      //
  Job.readyJobs = function () {                                                                                       // 509
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 510
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
                                                                                                                      //
    if (ids == null) {                                                                                                // 746
      ids = [];                                                                                                       // 509
    }                                                                                                                 // 748
                                                                                                                      //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 510
                                                                                                                      //
    if (options.force == null) {                                                                                      // 750
      options.force = false;                                                                                          // 511
    }                                                                                                                 // 752
                                                                                                                      //
    retVal = false;                                                                                                   // 512
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 513
                                                                                                                      //
    if (!(chunksOfIds.length > 0)) {                                                                                  // 514
      chunksOfIds = [[]];                                                                                             // 514
    }                                                                                                                 // 757
                                                                                                                      //
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 515
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 516
      chunkOfIds = chunksOfIds[l];                                                                                    // 760
      retVal = methodCall(root, "jobReady", [chunkOfIds, options], myCb) || retVal;                                   // 517
    }                                                                                                                 // 516
                                                                                                                      //
    return retVal;                                                                                                    // 518
  };                                                                                                                  // 509
                                                                                                                      //
  Job.cancelJobs = function () {                                                                                      // 521
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 522
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 522
                                                                                                                      //
    if (options.antecedents == null) {                                                                                // 770
      options.antecedents = true;                                                                                     // 523
    }                                                                                                                 // 772
                                                                                                                      //
    retVal = false;                                                                                                   // 524
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 525
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 526
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 527
      chunkOfIds = chunksOfIds[l];                                                                                    // 777
      retVal = methodCall(root, "jobCancel", [chunkOfIds, options], myCb) || retVal;                                  // 528
    }                                                                                                                 // 527
                                                                                                                      //
    return retVal;                                                                                                    // 529
  };                                                                                                                  // 521
                                                                                                                      //
  Job.restartJobs = function () {                                                                                     // 532
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 533
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 533
                                                                                                                      //
    if (options.retries == null) {                                                                                    // 787
      options.retries = 1;                                                                                            // 534
    }                                                                                                                 // 789
                                                                                                                      //
    if (options.dependents == null) {                                                                                 // 790
      options.dependents = true;                                                                                      // 535
    }                                                                                                                 // 792
                                                                                                                      //
    retVal = false;                                                                                                   // 536
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 537
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 538
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 539
      chunkOfIds = chunksOfIds[l];                                                                                    // 797
      retVal = methodCall(root, "jobRestart", [chunkOfIds, options], myCb) || retVal;                                 // 540
    }                                                                                                                 // 539
                                                                                                                      //
    return retVal;                                                                                                    // 541
  };                                                                                                                  // 532
                                                                                                                      //
  Job.removeJobs = function () {                                                                                      // 544
    var cb, chunkOfIds, chunksOfIds, ids, k, l, len, myCb, options, ref, retVal, root;                                // 545
    root = arguments[0], ids = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 545
    retVal = false;                                                                                                   // 546
    chunksOfIds = splitLongArray(ids, 256);                                                                           // 547
    myCb = reduceCallbacks(cb, chunksOfIds.length);                                                                   // 548
                                                                                                                      //
    for (l = 0, len = chunksOfIds.length; l < len; l++) {                                                             // 549
      chunkOfIds = chunksOfIds[l];                                                                                    // 811
      retVal = methodCall(root, "jobRemove", [chunkOfIds, options], myCb) || retVal;                                  // 550
    }                                                                                                                 // 549
                                                                                                                      //
    return retVal;                                                                                                    // 551
  };                                                                                                                  // 544
                                                                                                                      //
  Job.startJobs = function () {                                                                                       // 555
    var cb, k, options, ref, root;                                                                                    // 556
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 556
    return methodCall(root, "startJobs", [options], cb);                                                              // 821
  };                                                                                                                  // 555
                                                                                                                      //
  Job.stopJobs = function () {                                                                                        // 561
    var cb, k, options, ref, root;                                                                                    // 562
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 562
                                                                                                                      //
    if (options.timeout == null) {                                                                                    // 828
      options.timeout = 60 * 1000;                                                                                    // 563
    }                                                                                                                 // 830
                                                                                                                      //
    return methodCall(root, "stopJobs", [options], cb);                                                               // 831
  };                                                                                                                  // 561
                                                                                                                      //
  Job.startJobServer = function () {                                                                                  // 567
    var cb, k, options, ref, root;                                                                                    // 568
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 568
    return methodCall(root, "startJobServer", [options], cb);                                                         // 838
  };                                                                                                                  // 567
                                                                                                                      //
  Job.shutdownJobServer = function () {                                                                               // 572
    var cb, k, options, ref, root;                                                                                    // 573
    root = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 573
                                                                                                                      //
    if (options.timeout == null) {                                                                                    // 845
      options.timeout = 60 * 1000;                                                                                    // 574
    }                                                                                                                 // 847
                                                                                                                      //
    return methodCall(root, "shutdownJobServer", [options], cb);                                                      // 848
  };                                                                                                                  // 572
                                                                                                                      //
  function Job(rootVal, type, data) {                                                                                 // 578
    var doc, ref, time;                                                                                               // 579
                                                                                                                      //
    if (!(this instanceof Job)) {                                                                                     // 579
      return new Job(rootVal, type, data);                                                                            // 580
    }                                                                                                                 // 855
                                                                                                                      //
    this.root = rootVal;                                                                                              // 583
    this._root = rootVal;                                                                                             // 585
                                                                                                                      //
    if (((ref = this.root) != null ? ref.root : void 0) != null && typeof this.root.root === 'string') {              // 588
      this.root = this._root.root;                                                                                    // 589
    }                                                                                                                 // 860
                                                                                                                      //
    if (data == null && (type != null ? type.data : void 0) != null && (type != null ? type.type : void 0) != null) {
      if (type instanceof Job) {                                                                                      // 593
        return type;                                                                                                  // 594
      }                                                                                                               // 864
                                                                                                                      //
      doc = type;                                                                                                     // 596
      data = doc.data;                                                                                                // 597
      type = doc.type;                                                                                                // 598
    } else {                                                                                                          // 592
      doc = {};                                                                                                       // 600
    }                                                                                                                 // 870
                                                                                                                      //
    if (!((typeof doc === "undefined" ? "undefined" : _typeof(doc)) === 'object' && (typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object' && typeof type === 'string' && typeof this.root === 'string')) {
      throw new Error("new Job: bad parameter(s), " + this.root + " (" + _typeof(this.root) + "), " + type + " (" + (typeof type === "undefined" ? "undefined" : _typeof(type)) + "), " + data + " (" + (typeof data === "undefined" ? "undefined" : _typeof(data)) + "), " + doc + " (" + (typeof doc === "undefined" ? "undefined" : _typeof(doc)) + ")");
    } else if (doc.type != null && doc.data != null) {                                                                // 602
      this._doc = doc;                                                                                                // 609
    } else {                                                                                                          // 608
      time = new Date();                                                                                              // 612
      this._doc = {                                                                                                   // 613
        runId: null,                                                                                                  // 614
        type: type,                                                                                                   // 615
        data: data,                                                                                                   // 616
        status: 'waiting',                                                                                            // 617
        updated: time,                                                                                                // 618
        created: time                                                                                                 // 619
      };                                                                                                              // 614
      this.priority().retry().repeat().after().progress().depends().log("Constructed");                               // 620
    }                                                                                                                 // 886
                                                                                                                      //
    return this;                                                                                                      // 622
  }                                                                                                                   // 578
                                                                                                                      //
  Job.prototype._echo = function (message, level) {                                                                   // 890
    if (level == null) {                                                                                              // 891
      level = null;                                                                                                   // 625
    }                                                                                                                 // 893
                                                                                                                      //
    switch (level) {                                                                                                  // 626
      case 'danger':                                                                                                  // 626
        console.error(message);                                                                                       // 627
        break;                                                                                                        // 627
                                                                                                                      //
      case 'warning':                                                                                                 // 626
        console.warn(message);                                                                                        // 628
        break;                                                                                                        // 628
                                                                                                                      //
      case 'success':                                                                                                 // 626
        console.log(message);                                                                                         // 629
        break;                                                                                                        // 629
                                                                                                                      //
      default:                                                                                                        // 626
        console.info(message);                                                                                        // 630
    }                                                                                                                 // 626
  };                                                                                                                  // 625
                                                                                                                      //
  Job.prototype.depends = function (jobs) {                                                                           // 909
    var depends, j, k, len;                                                                                           // 636
                                                                                                                      //
    if (jobs) {                                                                                                       // 636
      if (jobs instanceof Job) {                                                                                      // 637
        jobs = [jobs];                                                                                                // 638
      }                                                                                                               // 914
                                                                                                                      //
      if (jobs instanceof Array) {                                                                                    // 639
        depends = this._doc.depends;                                                                                  // 640
                                                                                                                      //
        for (k = 0, len = jobs.length; k < len; k++) {                                                                // 641
          j = jobs[k];                                                                                                // 918
                                                                                                                      //
          if (!(j instanceof Job && j._doc._id != null)) {                                                            // 642
            throw new Error('Each provided object must be a saved Job instance (with an _id)');                       // 643
          }                                                                                                           // 921
                                                                                                                      //
          depends.push(j._doc._id);                                                                                   // 644
        }                                                                                                             // 639
      } else {                                                                                                        // 639
        throw new Error('Bad input parameter: depends() accepts a falsy value, or Job or array of Jobs');             // 646
      }                                                                                                               // 636
    } else {                                                                                                          // 636
      depends = [];                                                                                                   // 648
    }                                                                                                                 // 929
                                                                                                                      //
    this._doc.depends = depends;                                                                                      // 649
    this._doc.resolved = [];                                                                                          // 650
    return this;                                                                                                      // 651
  };                                                                                                                  // 635
                                                                                                                      //
  Job.prototype.priority = function (level) {                                                                         // 935
    var priority;                                                                                                     // 655
                                                                                                                      //
    if (level == null) {                                                                                              // 937
      level = 0;                                                                                                      // 654
    }                                                                                                                 // 939
                                                                                                                      //
    if (typeof level === 'string') {                                                                                  // 655
      priority = Job.jobPriorities[level];                                                                            // 656
                                                                                                                      //
      if (priority == null) {                                                                                         // 657
        throw new Error('Invalid string priority level provided');                                                    // 658
      }                                                                                                               // 655
    } else if (isInteger(level)) {                                                                                    // 655
      priority = level;                                                                                               // 660
    } else {                                                                                                          // 659
      throw new Error('priority must be an integer or valid priority level');                                         // 662
      priority = 0;                                                                                                   // 663
    }                                                                                                                 // 950
                                                                                                                      //
    this._doc.priority = priority;                                                                                    // 664
    return this;                                                                                                      // 665
  };                                                                                                                  // 654
                                                                                                                      //
  Job.prototype.retry = function (options) {                                                                          // 955
    var base, ref;                                                                                                    // 671
                                                                                                                      //
    if (options == null) {                                                                                            // 957
      options = 0;                                                                                                    // 670
    }                                                                                                                 // 959
                                                                                                                      //
    if (isInteger(options) && options >= 0) {                                                                         // 671
      options = {                                                                                                     // 672
        retries: options                                                                                              // 672
      };                                                                                                              // 672
    }                                                                                                                 // 964
                                                                                                                      //
    if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== 'object') {                             // 673
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');                          // 674
    }                                                                                                                 // 967
                                                                                                                      //
    if (options.retries != null) {                                                                                    // 675
      if (!(isInteger(options.retries) && options.retries >= 0)) {                                                    // 676
        throw new Error('bad option: retries must be an integer >= 0');                                               // 677
      }                                                                                                               // 971
                                                                                                                      //
      options.retries++;                                                                                              // 678
    } else {                                                                                                          // 675
      options.retries = Job.forever;                                                                                  // 680
    }                                                                                                                 // 975
                                                                                                                      //
    if (options.until != null) {                                                                                      // 681
      if (!(options.until instanceof Date)) {                                                                         // 682
        throw new Error('bad option: until must be a Date object');                                                   // 683
      }                                                                                                               // 681
    } else {                                                                                                          // 681
      options.until = Job.foreverDate;                                                                                // 685
    }                                                                                                                 // 982
                                                                                                                      //
    if (options.wait != null) {                                                                                       // 686
      if (!(isInteger(options.wait) && options.wait >= 0)) {                                                          // 687
        throw new Error('bad option: wait must be an integer >= 0');                                                  // 688
      }                                                                                                               // 686
    } else {                                                                                                          // 686
      options.wait = 5 * 60 * 1000;                                                                                   // 690
    }                                                                                                                 // 989
                                                                                                                      //
    if (options.backoff != null) {                                                                                    // 691
      if (ref = options.backoff, indexOf.call(Job.jobRetryBackoffMethods, ref) < 0) {                                 // 692
        throw new Error('bad option: invalid retry backoff method');                                                  // 693
      }                                                                                                               // 691
    } else {                                                                                                          // 691
      options.backoff = 'constant';                                                                                   // 695
    }                                                                                                                 // 996
                                                                                                                      //
    this._doc.retries = options.retries;                                                                              // 697
    this._doc.repeatRetries = options.retries;                                                                        // 698
    this._doc.retryWait = options.wait;                                                                               // 699
                                                                                                                      //
    if ((base = this._doc).retried == null) {                                                                         // 1000
      base.retried = 0;                                                                                               // 1001
    }                                                                                                                 // 1002
                                                                                                                      //
    this._doc.retryBackoff = options.backoff;                                                                         // 701
    this._doc.retryUntil = options.until;                                                                             // 702
    return this;                                                                                                      // 703
  };                                                                                                                  // 670
                                                                                                                      //
  Job.prototype.repeat = function (options) {                                                                         // 1008
    var base, ref;                                                                                                    // 709
                                                                                                                      //
    if (options == null) {                                                                                            // 1010
      options = 0;                                                                                                    // 708
    }                                                                                                                 // 1012
                                                                                                                      //
    if (isInteger(options) && options >= 0) {                                                                         // 709
      options = {                                                                                                     // 710
        repeats: options                                                                                              // 710
      };                                                                                                              // 710
    }                                                                                                                 // 1017
                                                                                                                      //
    if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== 'object') {                             // 711
      throw new Error('bad parameter: accepts either an integer >= 0 or an options object');                          // 712
    }                                                                                                                 // 1020
                                                                                                                      //
    if (options.wait != null && options.schedule != null) {                                                           // 713
      throw new Error('bad options: wait and schedule options are mutually exclusive');                               // 714
    }                                                                                                                 // 1023
                                                                                                                      //
    if (options.repeats != null) {                                                                                    // 715
      if (!(isInteger(options.repeats) && options.repeats >= 0)) {                                                    // 716
        throw new Error('bad option: repeats must be an integer >= 0');                                               // 717
      }                                                                                                               // 715
    } else {                                                                                                          // 715
      options.repeats = Job.forever;                                                                                  // 719
    }                                                                                                                 // 1030
                                                                                                                      //
    if (options.until != null) {                                                                                      // 720
      if (!(options.until instanceof Date)) {                                                                         // 721
        throw new Error('bad option: until must be a Date object');                                                   // 722
      }                                                                                                               // 720
    } else {                                                                                                          // 720
      options.until = Job.foreverDate;                                                                                // 724
    }                                                                                                                 // 1037
                                                                                                                      //
    if (options.wait != null) {                                                                                       // 725
      if (!(isInteger(options.wait) && options.wait >= 0)) {                                                          // 726
        throw new Error('bad option: wait must be an integer >= 0');                                                  // 727
      }                                                                                                               // 725
    } else {                                                                                                          // 725
      options.wait = 5 * 60 * 1000;                                                                                   // 729
    }                                                                                                                 // 1044
                                                                                                                      //
    if (options.schedule != null) {                                                                                   // 730
      if (_typeof(options.schedule) !== 'object') {                                                                   // 731
        throw new Error('bad option, schedule option must be an object');                                             // 732
      }                                                                                                               // 1048
                                                                                                                      //
      if (!(((ref = options.schedule) != null ? ref.schedules : void 0) != null && options.schedule.schedules instanceof Array)) {
        throw new Error('bad option, schedule object requires a schedules attribute of type Array.');                 // 734
      }                                                                                                               // 1051
                                                                                                                      //
      if (options.schedule.exceptions != null && !(options.schedule.exceptions instanceof Array)) {                   // 735
        throw new Error('bad option, schedule object exceptions attribute must be an Array');                         // 736
      }                                                                                                               // 1054
                                                                                                                      //
      options.wait = {                                                                                                // 737
        schedules: options.schedule.schedules,                                                                        // 738
        exceptions: options.schedule.exceptions                                                                       // 739
      };                                                                                                              // 738
    }                                                                                                                 // 1059
                                                                                                                      //
    this._doc.repeats = options.repeats;                                                                              // 741
    this._doc.repeatWait = options.wait;                                                                              // 742
                                                                                                                      //
    if ((base = this._doc).repeated == null) {                                                                        // 1062
      base.repeated = 0;                                                                                              // 1063
    }                                                                                                                 // 1064
                                                                                                                      //
    this._doc.repeatUntil = options.until;                                                                            // 744
    return this;                                                                                                      // 745
  };                                                                                                                  // 708
                                                                                                                      //
  Job.prototype.delay = function (wait) {                                                                             // 1069
    if (wait == null) {                                                                                               // 1070
      wait = 0;                                                                                                       // 748
    }                                                                                                                 // 1072
                                                                                                                      //
    if (!(isInteger(wait) && wait >= 0)) {                                                                            // 749
      throw new Error('Bad parameter, delay requires a non-negative integer.');                                       // 750
    }                                                                                                                 // 1075
                                                                                                                      //
    return this.after(new Date(new Date().valueOf() + wait));                                                         // 751
  };                                                                                                                  // 748
                                                                                                                      //
  Job.prototype.after = function (time) {                                                                             // 1079
    var after;                                                                                                        // 755
                                                                                                                      //
    if (time == null) {                                                                                               // 1081
      time = new Date(0);                                                                                             // 754
    }                                                                                                                 // 1083
                                                                                                                      //
    if ((typeof time === "undefined" ? "undefined" : _typeof(time)) === 'object' && time instanceof Date) {           // 755
      after = time;                                                                                                   // 756
    } else {                                                                                                          // 755
      throw new Error('Bad parameter, after requires a valid Date object');                                           // 758
    }                                                                                                                 // 1088
                                                                                                                      //
    this._doc.after = after;                                                                                          // 759
    return this;                                                                                                      // 760
  };                                                                                                                  // 754
                                                                                                                      //
  Job.prototype.log = function () {                                                                                   // 1093
    var base, cb, k, message, options, ref, ref1;                                                                     // 764
    message = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 764
                                                                                                                      //
    if (options.level == null) {                                                                                      // 1097
      options.level = 'info';                                                                                         // 765
    }                                                                                                                 // 1099
                                                                                                                      //
    if (typeof message !== 'string') {                                                                                // 766
      throw new Error('Log message must be a string');                                                                // 767
    }                                                                                                                 // 1102
                                                                                                                      //
    if (!(typeof options.level === 'string' && (ref1 = options.level, indexOf.call(Job.jobLogLevels, ref1) >= 0))) {  // 768
      throw new Error('Log level options must be one of Job.jobLogLevels');                                           // 769
    }                                                                                                                 // 1105
                                                                                                                      //
    if (options.echo != null) {                                                                                       // 770
      if (options.echo && Job.jobLogLevels.indexOf(options.level) >= Job.jobLogLevels.indexOf(options.echo)) {        // 771
        this._echo("LOG: " + options.level + ", " + this._doc._id + " " + this._doc.runId + ": " + message, options.level);
      }                                                                                                               // 1109
                                                                                                                      //
      delete options.echo;                                                                                            // 773
    }                                                                                                                 // 1111
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 774
      return methodCall(this._root, "jobLog", [this._doc._id, this._doc.runId, message, options], cb);                // 775
    } else {                                                                                                          // 774
      if ((base = this._doc).log == null) {                                                                           // 1115
        base.log = [];                                                                                                // 1116
      }                                                                                                               // 1117
                                                                                                                      //
      this._doc.log.push({                                                                                            // 778
        time: new Date(),                                                                                             // 778
        runId: null,                                                                                                  // 778
        level: options.level,                                                                                         // 778
        message: message                                                                                              // 778
      });                                                                                                             // 778
                                                                                                                      //
      if (cb != null && typeof cb === 'function') {                                                                   // 779
        _setImmediate(cb, null, true);                                                                                // 780
      }                                                                                                               // 1126
                                                                                                                      //
      return this;                                                                                                    // 781
    }                                                                                                                 // 1128
  };                                                                                                                  // 763
                                                                                                                      //
  Job.prototype.progress = function () {                                                                              // 1131
    var cb, completed, k, options, progress, ref, total;                                                              // 786
    completed = arguments[0], total = arguments[1], options = 4 <= arguments.length ? slice.call(arguments, 2, k = arguments.length - 1) : (k = 2, []), cb = arguments[k++];
                                                                                                                      //
    if (completed == null) {                                                                                          // 1134
      completed = 0;                                                                                                  // 785
    }                                                                                                                 // 1136
                                                                                                                      //
    if (total == null) {                                                                                              // 1137
      total = 1;                                                                                                      // 785
    }                                                                                                                 // 1139
                                                                                                                      //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 786
                                                                                                                      //
    if (typeof completed === 'number' && typeof total === 'number' && completed >= 0 && total > 0 && total >= completed) {
      progress = {                                                                                                    // 792
        completed: completed,                                                                                         // 793
        total: total,                                                                                                 // 794
        percent: 100 * completed / total                                                                              // 795
      };                                                                                                              // 793
                                                                                                                      //
      if (options.echo) {                                                                                             // 796
        delete options.echo;                                                                                          // 797
                                                                                                                      //
        this._echo("PROGRESS: " + this._doc._id + " " + this._doc.runId + ": " + progress.completed + " out of " + progress.total + " (" + progress.percent + "%)");
      }                                                                                                               // 1150
                                                                                                                      //
      if (this._doc._id != null && this._doc.runId != null) {                                                         // 799
        return methodCall(this._root, "jobProgress", [this._doc._id, this._doc.runId, completed, total, options], cb, function (_this) {
          return function (res) {                                                                                     // 1153
            if (res) {                                                                                                // 801
              _this._doc.progress = progress;                                                                         // 802
            }                                                                                                         // 1156
                                                                                                                      //
            return res;                                                                                               // 1157
          };                                                                                                          // 800
        }(this));                                                                                                     // 800
      } else if (this._doc._id == null) {                                                                             // 799
        this._doc.progress = progress;                                                                                // 805
                                                                                                                      //
        if (cb != null && typeof cb === 'function') {                                                                 // 806
          _setImmediate(cb, null, true);                                                                              // 807
        }                                                                                                             // 1164
                                                                                                                      //
        return this;                                                                                                  // 808
      }                                                                                                               // 787
    } else {                                                                                                          // 787
      throw new Error("job.progress: something is wrong with progress params: " + this.id + ", " + completed + " out of " + total);
    }                                                                                                                 // 1169
                                                                                                                      //
    return null;                                                                                                      // 811
  };                                                                                                                  // 785
                                                                                                                      //
  Job.prototype.save = function () {                                                                                  // 1173
    var cb, k, options, ref;                                                                                          // 816
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 816
    return methodCall(this._root, "jobSave", [this._doc, options], cb, function (_this) {                             // 817
      return function (id) {                                                                                          // 1178
        if (id) {                                                                                                     // 818
          _this._doc._id = id;                                                                                        // 819
        }                                                                                                             // 1181
                                                                                                                      //
        return id;                                                                                                    // 1182
      };                                                                                                              // 817
    }(this));                                                                                                         // 817
  };                                                                                                                  // 815
                                                                                                                      //
  Job.prototype.refresh = function () {                                                                               // 1187
    var cb, k, options, ref;                                                                                          // 824
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 824
                                                                                                                      //
    if (options.getLog == null) {                                                                                     // 1191
      options.getLog = false;                                                                                         // 825
    }                                                                                                                 // 1193
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 826
      return methodCall(this._root, "getJob", [this._doc._id, options], cb, function (_this) {                        // 827
        return function (doc) {                                                                                       // 1196
          if (doc != null) {                                                                                          // 828
            _this._doc = doc;                                                                                         // 829
            return _this;                                                                                             // 1199
          } else {                                                                                                    // 828
            return false;                                                                                             // 1201
          }                                                                                                           // 1202
        };                                                                                                            // 827
      }(this));                                                                                                       // 827
    } else {                                                                                                          // 826
      throw new Error("Can't call .refresh() on an unsaved job");                                                     // 834
    }                                                                                                                 // 1207
  };                                                                                                                  // 823
                                                                                                                      //
  Job.prototype.done = function () {                                                                                  // 1210
    var cb, k, options, ref, result;                                                                                  // 838
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
                                                                                                                      //
    if (result == null) {                                                                                             // 1213
      result = {};                                                                                                    // 837
    }                                                                                                                 // 1215
                                                                                                                      //
    if (typeof result === 'function') {                                                                               // 838
      cb = result;                                                                                                    // 839
      result = {};                                                                                                    // 840
    }                                                                                                                 // 1219
                                                                                                                      //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 841
                                                                                                                      //
    if (!(result != null && (typeof result === "undefined" ? "undefined" : _typeof(result)) === 'object')) {          // 842
      result = {                                                                                                      // 843
        value: result                                                                                                 // 843
      };                                                                                                              // 843
    }                                                                                                                 // 1225
                                                                                                                      //
    if (this._doc._id != null && this._doc.runId != null) {                                                           // 844
      return methodCall(this._root, "jobDone", [this._doc._id, this._doc.runId, result, options], cb);                // 845
    } else {                                                                                                          // 844
      throw new Error("Can't call .done() on an unsaved or non-running job");                                         // 847
    }                                                                                                                 // 1230
                                                                                                                      //
    return null;                                                                                                      // 848
  };                                                                                                                  // 837
                                                                                                                      //
  Job.prototype.fail = function () {                                                                                  // 1234
    var cb, k, options, ref, result;                                                                                  // 852
    result = arguments[0], options = 3 <= arguments.length ? slice.call(arguments, 1, k = arguments.length - 1) : (k = 1, []), cb = arguments[k++];
                                                                                                                      //
    if (result == null) {                                                                                             // 1237
      result = "No error information provided";                                                                       // 851
    }                                                                                                                 // 1239
                                                                                                                      //
    if (typeof result === 'function') {                                                                               // 852
      cb = result;                                                                                                    // 853
      result = "No error information provided";                                                                       // 854
    }                                                                                                                 // 1243
                                                                                                                      //
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 855
                                                                                                                      //
    if (!(result != null && (typeof result === "undefined" ? "undefined" : _typeof(result)) === 'object')) {          // 856
      result = {                                                                                                      // 857
        value: result                                                                                                 // 857
      };                                                                                                              // 857
    }                                                                                                                 // 1249
                                                                                                                      //
    if (options.fatal == null) {                                                                                      // 1250
      options.fatal = false;                                                                                          // 858
    }                                                                                                                 // 1252
                                                                                                                      //
    if (this._doc._id != null && this._doc.runId != null) {                                                           // 859
      return methodCall(this._root, "jobFail", [this._doc._id, this._doc.runId, result, options], cb);                // 860
    } else {                                                                                                          // 859
      throw new Error("Can't call .fail() on an unsaved or non-running job");                                         // 862
    }                                                                                                                 // 1257
                                                                                                                      //
    return null;                                                                                                      // 863
  };                                                                                                                  // 851
                                                                                                                      //
  Job.prototype.pause = function () {                                                                                 // 1261
    var cb, k, options, ref;                                                                                          // 867
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 867
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 868
      return methodCall(this._root, "jobPause", [this._doc._id, options], cb);                                        // 869
    } else {                                                                                                          // 868
      this._doc.status = 'paused';                                                                                    // 871
                                                                                                                      //
      if (cb != null && typeof cb === 'function') {                                                                   // 872
        _setImmediate(cb, null, true);                                                                                // 873
      }                                                                                                               // 1271
                                                                                                                      //
      return this;                                                                                                    // 874
    }                                                                                                                 // 1273
                                                                                                                      //
    return null;                                                                                                      // 875
  };                                                                                                                  // 866
                                                                                                                      //
  Job.prototype.resume = function () {                                                                                // 1277
    var cb, k, options, ref;                                                                                          // 880
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 880
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 881
      return methodCall(this._root, "jobResume", [this._doc._id, options], cb);                                       // 882
    } else {                                                                                                          // 881
      this._doc.status = 'waiting';                                                                                   // 884
                                                                                                                      //
      if (cb != null && typeof cb === 'function') {                                                                   // 885
        _setImmediate(cb, null, true);                                                                                // 886
      }                                                                                                               // 1287
                                                                                                                      //
      return this;                                                                                                    // 887
    }                                                                                                                 // 1289
                                                                                                                      //
    return null;                                                                                                      // 888
  };                                                                                                                  // 879
                                                                                                                      //
  Job.prototype.ready = function () {                                                                                 // 1293
    var cb, k, options, ref;                                                                                          // 892
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 892
                                                                                                                      //
    if (options.force == null) {                                                                                      // 1297
      options.force = false;                                                                                          // 893
    }                                                                                                                 // 1299
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 894
      return methodCall(this._root, "jobReady", [this._doc._id, options], cb);                                        // 895
    } else {                                                                                                          // 894
      throw new Error("Can't call .ready() on an unsaved job");                                                       // 897
    }                                                                                                                 // 1304
                                                                                                                      //
    return null;                                                                                                      // 898
  };                                                                                                                  // 891
                                                                                                                      //
  Job.prototype.cancel = function () {                                                                                // 1308
    var cb, k, options, ref;                                                                                          // 902
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 902
                                                                                                                      //
    if (options.antecedents == null) {                                                                                // 1312
      options.antecedents = true;                                                                                     // 903
    }                                                                                                                 // 1314
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 904
      return methodCall(this._root, "jobCancel", [this._doc._id, options], cb);                                       // 905
    } else {                                                                                                          // 904
      throw new Error("Can't call .cancel() on an unsaved job");                                                      // 907
    }                                                                                                                 // 1319
                                                                                                                      //
    return null;                                                                                                      // 908
  };                                                                                                                  // 901
                                                                                                                      //
  Job.prototype.restart = function () {                                                                               // 1323
    var cb, k, options, ref;                                                                                          // 912
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 912
                                                                                                                      //
    if (options.retries == null) {                                                                                    // 1327
      options.retries = 1;                                                                                            // 913
    }                                                                                                                 // 1329
                                                                                                                      //
    if (options.dependents == null) {                                                                                 // 1330
      options.dependents = true;                                                                                      // 914
    }                                                                                                                 // 1332
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 915
      return methodCall(this._root, "jobRestart", [this._doc._id, options], cb);                                      // 916
    } else {                                                                                                          // 915
      throw new Error("Can't call .restart() on an unsaved job");                                                     // 918
    }                                                                                                                 // 1337
                                                                                                                      //
    return null;                                                                                                      // 919
  };                                                                                                                  // 911
                                                                                                                      //
  Job.prototype.rerun = function () {                                                                                 // 1341
    var cb, k, options, ref;                                                                                          // 923
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 923
                                                                                                                      //
    if (options.repeats == null) {                                                                                    // 1345
      options.repeats = 0;                                                                                            // 924
    }                                                                                                                 // 1347
                                                                                                                      //
    if (options.wait == null) {                                                                                       // 1348
      options.wait = this._doc.repeatWait;                                                                            // 925
    }                                                                                                                 // 1350
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 926
      return methodCall(this._root, "jobRerun", [this._doc._id, options], cb);                                        // 927
    } else {                                                                                                          // 926
      throw new Error("Can't call .rerun() on an unsaved job");                                                       // 929
    }                                                                                                                 // 1355
                                                                                                                      //
    return null;                                                                                                      // 930
  };                                                                                                                  // 922
                                                                                                                      //
  Job.prototype.remove = function () {                                                                                // 1359
    var cb, k, options, ref;                                                                                          // 934
    options = 2 <= arguments.length ? slice.call(arguments, 0, k = arguments.length - 1) : (k = 0, []), cb = arguments[k++];
    ref = optionsHelp(options, cb), options = ref[0], cb = ref[1];                                                    // 934
                                                                                                                      //
    if (this._doc._id != null) {                                                                                      // 935
      return methodCall(this._root, "jobRemove", [this._doc._id, options], cb);                                       // 936
    } else {                                                                                                          // 935
      throw new Error("Can't call .remove() on an unsaved job");                                                      // 938
    }                                                                                                                 // 1367
                                                                                                                      //
    return null;                                                                                                      // 939
  };                                                                                                                  // 933
                                                                                                                      //
  Object.defineProperties(Job.prototype, {                                                                            // 942
    doc: {                                                                                                            // 943
      get: function () {                                                                                              // 944
        return this._doc;                                                                                             // 1374
      },                                                                                                              // 944
      set: function () {                                                                                              // 945
        return console.warn("Job.doc cannot be directly assigned.");                                                  // 1377
      }                                                                                                               // 944
    },                                                                                                                // 944
    type: {                                                                                                           // 946
      get: function () {                                                                                              // 947
        return this._doc.type;                                                                                        // 1382
      },                                                                                                              // 947
      set: function () {                                                                                              // 948
        return console.warn("Job.type cannot be directly assigned.");                                                 // 1385
      }                                                                                                               // 947
    },                                                                                                                // 947
    data: {                                                                                                           // 949
      get: function () {                                                                                              // 950
        return this._doc.data;                                                                                        // 1390
      },                                                                                                              // 950
      set: function () {                                                                                              // 951
        return console.warn("Job.data cannot be directly assigned.");                                                 // 1393
      }                                                                                                               // 950
    }                                                                                                                 // 950
  });                                                                                                                 // 943
  return Job;                                                                                                         // 1398
}();                                                                                                                  // 1400
                                                                                                                      //
if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {                           // 954
  module.exports = Job;                                                                                               // 955
}                                                                                                                     // 1404
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/vsivsi_job-collection/src/shared.coffee                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var JobCollectionBase,                                                                                                // 7
    _validId,                                                                                                         // 7
    _validIntGTEOne,                                                                                                  // 7
    _validIntGTEZero,                                                                                                 // 7
    _validJobDoc,                                                                                                     // 7
    _validLaterJSObj,                                                                                                 // 7
    _validLog,                                                                                                        // 7
    _validLogLevel,                                                                                                   // 7
    _validNumGTEOne,                                                                                                  // 7
    _validNumGTEZero,                                                                                                 // 7
    _validNumGTZero,                                                                                                  // 7
    _validProgress,                                                                                                   // 7
    _validRetryBackoff,                                                                                               // 7
    _validStatus,                                                                                                     // 7
    indexOf = [].indexOf || function (item) {                                                                         // 7
  for (var i = 0, l = this.length; i < l; i++) {                                                                      // 7
    if (i in this && this[i] === item) return i;                                                                      // 7
  }                                                                                                                   // 7
                                                                                                                      //
  return -1;                                                                                                          // 7
},                                                                                                                    // 7
    extend = function (child, parent) {                                                                               // 7
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {                                                   // 3
    if (hasProp.call(parent, key)) child[key] = parent[key];                                                          // 3
  }                                                                                                                   // 3
                                                                                                                      //
  function ctor() {                                                                                                   // 3
    this.constructor = child;                                                                                         // 3
  }                                                                                                                   // 3
                                                                                                                      //
  ctor.prototype = parent.prototype;                                                                                  // 3
  child.prototype = new ctor();                                                                                       // 3
  child.__super__ = parent.prototype;                                                                                 // 3
  return child;                                                                                                       // 3
},                                                                                                                    // 3
    hasProp = {}.hasOwnProperty,                                                                                      // 7
    slice = [].slice;                                                                                                 // 7
                                                                                                                      //
_validNumGTEZero = function (v) {                                                                                     // 7
  return Match.test(v, Number) && v >= 0.0;                                                                           // 8
};                                                                                                                    // 7
                                                                                                                      //
_validNumGTZero = function (v) {                                                                                      // 10
  return Match.test(v, Number) && v > 0.0;                                                                            // 12
};                                                                                                                    // 10
                                                                                                                      //
_validNumGTEOne = function (v) {                                                                                      // 13
  return Match.test(v, Number) && v >= 1.0;                                                                           // 16
};                                                                                                                    // 13
                                                                                                                      //
_validIntGTEZero = function (v) {                                                                                     // 16
  return _validNumGTEZero(v) && Math.floor(v) === v;                                                                  // 20
};                                                                                                                    // 16
                                                                                                                      //
_validIntGTEOne = function (v) {                                                                                      // 19
  return _validNumGTEOne(v) && Math.floor(v) === v;                                                                   // 24
};                                                                                                                    // 19
                                                                                                                      //
_validStatus = function (v) {                                                                                         // 22
  return Match.test(v, String) && indexOf.call(Job.jobStatuses, v) >= 0;                                              // 28
};                                                                                                                    // 22
                                                                                                                      //
_validLogLevel = function (v) {                                                                                       // 25
  return Match.test(v, String) && indexOf.call(Job.jobLogLevels, v) >= 0;                                             // 32
};                                                                                                                    // 25
                                                                                                                      //
_validRetryBackoff = function (v) {                                                                                   // 28
  return Match.test(v, String) && indexOf.call(Job.jobRetryBackoffMethods, v) >= 0;                                   // 36
};                                                                                                                    // 28
                                                                                                                      //
_validId = function (v) {                                                                                             // 31
  return Match.test(v, Match.OneOf(String, Mongo.Collection.ObjectID));                                               // 40
};                                                                                                                    // 31
                                                                                                                      //
_validLog = function () {                                                                                             // 34
  return [{                                                                                                           // 44
    time: Date,                                                                                                       // 36
    runId: Match.OneOf(Match.Where(_validId), null),                                                                  // 37
    level: Match.Where(_validLogLevel),                                                                               // 38
    message: String,                                                                                                  // 39
    data: Match.Optional(Object)                                                                                      // 40
  }];                                                                                                                 // 35
};                                                                                                                    // 34
                                                                                                                      //
_validProgress = function () {                                                                                        // 43
  return {                                                                                                            // 56
    completed: Match.Where(_validNumGTEZero),                                                                         // 44
    total: Match.Where(_validNumGTEZero),                                                                             // 45
    percent: Match.Where(_validNumGTEZero)                                                                            // 46
  };                                                                                                                  // 44
};                                                                                                                    // 43
                                                                                                                      //
_validLaterJSObj = function () {                                                                                      // 48
  return {                                                                                                            // 64
    schedules: [Object],                                                                                              // 49
    exceptions: Match.Optional([Object])                                                                              // 50
  };                                                                                                                  // 49
};                                                                                                                    // 48
                                                                                                                      //
_validJobDoc = function () {                                                                                          // 52
  return {                                                                                                            // 71
    _id: Match.Optional(Match.OneOf(Match.Where(_validId), null)),                                                    // 53
    runId: Match.OneOf(Match.Where(_validId), null),                                                                  // 54
    type: String,                                                                                                     // 55
    status: Match.Where(_validStatus),                                                                                // 56
    data: Object,                                                                                                     // 57
    result: Match.Optional(Object),                                                                                   // 58
    failures: Match.Optional([Object]),                                                                               // 59
    priority: Match.Integer,                                                                                          // 60
    depends: [Match.Where(_validId)],                                                                                 // 61
    resolved: [Match.Where(_validId)],                                                                                // 62
    after: Date,                                                                                                      // 63
    updated: Date,                                                                                                    // 64
    workTimeout: Match.Optional(Match.Where(_validIntGTEOne)),                                                        // 65
    expiresAfter: Match.Optional(Date),                                                                               // 66
    log: Match.Optional(_validLog()),                                                                                 // 67
    progress: _validProgress(),                                                                                       // 68
    retries: Match.Where(_validIntGTEZero),                                                                           // 69
    retried: Match.Where(_validIntGTEZero),                                                                           // 70
    repeatRetries: Match.Optional(Match.Where(_validIntGTEZero)),                                                     // 71
    retryUntil: Date,                                                                                                 // 72
    retryWait: Match.Where(_validIntGTEZero),                                                                         // 73
    retryBackoff: Match.Where(_validRetryBackoff),                                                                    // 74
    repeats: Match.Where(_validIntGTEZero),                                                                           // 75
    repeated: Match.Where(_validIntGTEZero),                                                                          // 76
    repeatUntil: Date,                                                                                                // 77
    repeatWait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj)),                            // 78
    created: Date                                                                                                     // 79
  };                                                                                                                  // 53
};                                                                                                                    // 52
                                                                                                                      //
JobCollectionBase = function (superClass) {                                                                           // 81
  extend(JobCollectionBase, superClass);                                                                              // 103
                                                                                                                      //
  function JobCollectionBase(root, options) {                                                                         // 83
    var collectionName;                                                                                               // 84
    this.root = root != null ? root : 'queue';                                                                        // 83
                                                                                                                      //
    if (options == null) {                                                                                            // 108
      options = {};                                                                                                   // 83
    }                                                                                                                 // 110
                                                                                                                      //
    if (!(this instanceof JobCollectionBase)) {                                                                       // 84
      return new JobCollectionBase(this.root, options);                                                               // 85
    }                                                                                                                 // 113
                                                                                                                      //
    if (!(this instanceof Mongo.Collection)) {                                                                        // 87
      throw new Meteor.Error('The global definition of Mongo.Collection has changed since the job-collection package was loaded. Please ensure that any packages that redefine Mongo.Collection are loaded before job-collection.');
    }                                                                                                                 // 116
                                                                                                                      //
    if (Mongo.Collection !== Mongo.Collection.prototype.constructor) {                                                // 90
      throw new Meteor.Error('The global definition of Mongo.Collection has been patched by another package, and the prototype constructor has been left in an inconsistent state. Please see this link for a workaround: https://github.com/vsivsi/meteor-file-sample-app/issues/2#issuecomment-120780592');
    }                                                                                                                 // 119
                                                                                                                      //
    this.later = later;                                                                                               // 93
                                                                                                                      //
    if (options.noCollectionSuffix == null) {                                                                         // 121
      options.noCollectionSuffix = false;                                                                             // 95
    }                                                                                                                 // 123
                                                                                                                      //
    collectionName = this.root;                                                                                       // 97
                                                                                                                      //
    if (!options.noCollectionSuffix) {                                                                                // 99
      collectionName += '.jobs';                                                                                      // 100
    }                                                                                                                 // 127
                                                                                                                      //
    delete options.noCollectionSuffix;                                                                                // 104
    Job.setDDP(options.connection, this.root);                                                                        // 106
                                                                                                                      //
    this._createLogEntry = function (message, runId, level, time, data) {                                             // 108
      var l;                                                                                                          // 109
                                                                                                                      //
      if (message == null) {                                                                                          // 132
        message = '';                                                                                                 // 108
      }                                                                                                               // 134
                                                                                                                      //
      if (runId == null) {                                                                                            // 135
        runId = null;                                                                                                 // 108
      }                                                                                                               // 137
                                                                                                                      //
      if (level == null) {                                                                                            // 138
        level = 'info';                                                                                               // 108
      }                                                                                                               // 140
                                                                                                                      //
      if (time == null) {                                                                                             // 141
        time = new Date();                                                                                            // 108
      }                                                                                                               // 143
                                                                                                                      //
      if (data == null) {                                                                                             // 144
        data = null;                                                                                                  // 108
      }                                                                                                               // 146
                                                                                                                      //
      l = {                                                                                                           // 109
        time: time,                                                                                                   // 109
        runId: runId,                                                                                                 // 109
        message: message,                                                                                             // 109
        level: level                                                                                                  // 109
      };                                                                                                              // 109
      return l;                                                                                                       // 110
    };                                                                                                                // 108
                                                                                                                      //
    this._logMessage = {                                                                                              // 112
      'readied': function () {                                                                                        // 113
        return this._createLogEntry("Promoted to ready");                                                             // 157
      }.bind(this),                                                                                                   // 113
      'forced': function (id) {                                                                                       // 114
        return this._createLogEntry("Dependencies force resolved", null, 'warning');                                  // 160
      }.bind(this),                                                                                                   // 114
      'rerun': function (id, runId) {                                                                                 // 115
        return this._createLogEntry("Rerunning job", null, 'info', new Date(), {                                      // 163
          previousJob: {                                                                                              // 115
            id: id,                                                                                                   // 115
            runId: runId                                                                                              // 115
          }                                                                                                           // 115
        });                                                                                                           // 115
      }.bind(this),                                                                                                   // 115
      'running': function (runId) {                                                                                   // 116
        return this._createLogEntry("Job Running", runId);                                                            // 171
      }.bind(this),                                                                                                   // 116
      'paused': function () {                                                                                         // 117
        return this._createLogEntry("Job Paused");                                                                    // 174
      }.bind(this),                                                                                                   // 117
      'resumed': function () {                                                                                        // 118
        return this._createLogEntry("Job Resumed");                                                                   // 177
      }.bind(this),                                                                                                   // 118
      'cancelled': function () {                                                                                      // 119
        return this._createLogEntry("Job Cancelled", null, 'warning');                                                // 180
      }.bind(this),                                                                                                   // 119
      'restarted': function () {                                                                                      // 120
        return this._createLogEntry("Job Restarted");                                                                 // 183
      }.bind(this),                                                                                                   // 120
      'resubmitted': function () {                                                                                    // 121
        return this._createLogEntry("Job Resubmitted");                                                               // 186
      }.bind(this),                                                                                                   // 121
      'submitted': function () {                                                                                      // 122
        return this._createLogEntry("Job Submitted");                                                                 // 189
      }.bind(this),                                                                                                   // 122
      'completed': function (runId) {                                                                                 // 123
        return this._createLogEntry("Job Completed", runId, 'success');                                               // 192
      }.bind(this),                                                                                                   // 123
      'resolved': function (id, runId) {                                                                              // 124
        return this._createLogEntry("Dependency resolved", null, 'info', new Date(), {                                // 195
          dependency: {                                                                                               // 124
            id: id,                                                                                                   // 124
            runId: runId                                                                                              // 124
          }                                                                                                           // 124
        });                                                                                                           // 124
      }.bind(this),                                                                                                   // 124
      'failed': function (runId, fatal, err) {                                                                        // 125
        var level, msg, value;                                                                                        // 126
        value = err.value;                                                                                            // 126
        msg = "Job Failed with" + (fatal ? ' Fatal' : '') + " Error" + (value != null && typeof value === 'string' ? ': ' + value : '') + ".";
        level = fatal ? 'danger' : 'warning';                                                                         // 128
        return this._createLogEntry(msg, runId, level);                                                               // 207
      }.bind(this)                                                                                                    // 125
    };                                                                                                                // 113
                                                                                                                      //
    JobCollectionBase.__super__.constructor.call(this, collectionName, options);                                      // 132
  }                                                                                                                   // 83
                                                                                                                      //
  JobCollectionBase.prototype._validNumGTEZero = _validNumGTEZero;                                                    // 213
  JobCollectionBase.prototype._validNumGTZero = _validNumGTZero;                                                      // 215
  JobCollectionBase.prototype._validNumGTEOne = _validNumGTEOne;                                                      // 217
  JobCollectionBase.prototype._validIntGTEZero = _validIntGTEZero;                                                    // 219
  JobCollectionBase.prototype._validIntGTEOne = _validIntGTEOne;                                                      // 221
  JobCollectionBase.prototype._validStatus = _validStatus;                                                            // 223
  JobCollectionBase.prototype._validLogLevel = _validLogLevel;                                                        // 225
  JobCollectionBase.prototype._validRetryBackoff = _validRetryBackoff;                                                // 227
  JobCollectionBase.prototype._validId = _validId;                                                                    // 229
  JobCollectionBase.prototype._validLog = _validLog;                                                                  // 231
  JobCollectionBase.prototype._validProgress = _validProgress;                                                        // 233
  JobCollectionBase.prototype._validJobDoc = _validJobDoc;                                                            // 235
  JobCollectionBase.prototype.jobLogLevels = Job.jobLogLevels;                                                        // 237
  JobCollectionBase.prototype.jobPriorities = Job.jobPriorities;                                                      // 239
  JobCollectionBase.prototype.jobStatuses = Job.jobStatuses;                                                          // 241
  JobCollectionBase.prototype.jobStatusCancellable = Job.jobStatusCancellable;                                        // 243
  JobCollectionBase.prototype.jobStatusPausable = Job.jobStatusPausable;                                              // 245
  JobCollectionBase.prototype.jobStatusRemovable = Job.jobStatusRemovable;                                            // 247
  JobCollectionBase.prototype.jobStatusRestartable = Job.jobStatusRestartable;                                        // 249
  JobCollectionBase.prototype.forever = Job.forever;                                                                  // 251
  JobCollectionBase.prototype.foreverDate = Job.foreverDate;                                                          // 253
  JobCollectionBase.prototype.ddpMethods = Job.ddpMethods;                                                            // 255
  JobCollectionBase.prototype.ddpPermissionLevels = Job.ddpPermissionLevels;                                          // 257
  JobCollectionBase.prototype.ddpMethodPermissions = Job.ddpMethodPermissions;                                        // 259
                                                                                                                      //
  JobCollectionBase.prototype.processJobs = function () {                                                             // 261
    var params;                                                                                                       // 161
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 161
    return function (func, args, ctor) {                                                                              // 264
      ctor.prototype = func.prototype;                                                                                // 265
      var child = new ctor(),                                                                                         // 266
          result = func.apply(child, args);                                                                           // 266
      return Object(result) === result ? result : child;                                                              // 267
    }(Job.processJobs, [this.root].concat(slice.call(params)), function () {});                                       // 268
  };                                                                                                                  // 161
                                                                                                                      //
  JobCollectionBase.prototype.getJob = function () {                                                                  // 271
    var params;                                                                                                       // 162
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 162
    return Job.getJob.apply(Job, [this.root].concat(slice.call(params)));                                             // 274
  };                                                                                                                  // 162
                                                                                                                      //
  JobCollectionBase.prototype.getWork = function () {                                                                 // 277
    var params;                                                                                                       // 163
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 163
    return Job.getWork.apply(Job, [this.root].concat(slice.call(params)));                                            // 280
  };                                                                                                                  // 163
                                                                                                                      //
  JobCollectionBase.prototype.getJobs = function () {                                                                 // 283
    var params;                                                                                                       // 164
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 164
    return Job.getJobs.apply(Job, [this.root].concat(slice.call(params)));                                            // 286
  };                                                                                                                  // 164
                                                                                                                      //
  JobCollectionBase.prototype.readyJobs = function () {                                                               // 289
    var params;                                                                                                       // 165
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 165
    return Job.readyJobs.apply(Job, [this.root].concat(slice.call(params)));                                          // 292
  };                                                                                                                  // 165
                                                                                                                      //
  JobCollectionBase.prototype.cancelJobs = function () {                                                              // 295
    var params;                                                                                                       // 166
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 166
    return Job.cancelJobs.apply(Job, [this.root].concat(slice.call(params)));                                         // 298
  };                                                                                                                  // 166
                                                                                                                      //
  JobCollectionBase.prototype.pauseJobs = function () {                                                               // 301
    var params;                                                                                                       // 167
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 167
    return Job.pauseJobs.apply(Job, [this.root].concat(slice.call(params)));                                          // 304
  };                                                                                                                  // 167
                                                                                                                      //
  JobCollectionBase.prototype.resumeJobs = function () {                                                              // 307
    var params;                                                                                                       // 168
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 168
    return Job.resumeJobs.apply(Job, [this.root].concat(slice.call(params)));                                         // 310
  };                                                                                                                  // 168
                                                                                                                      //
  JobCollectionBase.prototype.restartJobs = function () {                                                             // 313
    var params;                                                                                                       // 169
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 169
    return Job.restartJobs.apply(Job, [this.root].concat(slice.call(params)));                                        // 316
  };                                                                                                                  // 169
                                                                                                                      //
  JobCollectionBase.prototype.removeJobs = function () {                                                              // 319
    var params;                                                                                                       // 170
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 170
    return Job.removeJobs.apply(Job, [this.root].concat(slice.call(params)));                                         // 322
  };                                                                                                                  // 170
                                                                                                                      //
  JobCollectionBase.prototype.setDDP = function () {                                                                  // 325
    var params;                                                                                                       // 172
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 172
    return Job.setDDP.apply(Job, params);                                                                             // 328
  };                                                                                                                  // 172
                                                                                                                      //
  JobCollectionBase.prototype.startJobServer = function () {                                                          // 331
    var params;                                                                                                       // 174
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 174
    return Job.startJobServer.apply(Job, [this.root].concat(slice.call(params)));                                     // 334
  };                                                                                                                  // 174
                                                                                                                      //
  JobCollectionBase.prototype.shutdownJobServer = function () {                                                       // 337
    var params;                                                                                                       // 175
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 175
    return Job.shutdownJobServer.apply(Job, [this.root].concat(slice.call(params)));                                  // 340
  };                                                                                                                  // 175
                                                                                                                      //
  JobCollectionBase.prototype.startJobs = function () {                                                               // 343
    var params;                                                                                                       // 178
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 178
    return Job.startJobs.apply(Job, [this.root].concat(slice.call(params)));                                          // 346
  };                                                                                                                  // 178
                                                                                                                      //
  JobCollectionBase.prototype.stopJobs = function () {                                                                // 349
    var params;                                                                                                       // 179
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                   // 179
    return Job.stopJobs.apply(Job, [this.root].concat(slice.call(params)));                                           // 352
  };                                                                                                                  // 179
                                                                                                                      //
  JobCollectionBase.prototype.jobDocPattern = _validJobDoc();                                                         // 355
                                                                                                                      //
  JobCollectionBase.prototype.allow = function () {                                                                   // 357
    throw new Error("Server-only function jc.allow() invoked on client.");                                            // 184
  };                                                                                                                  // 184
                                                                                                                      //
  JobCollectionBase.prototype.deny = function () {                                                                    // 361
    throw new Error("Server-only function jc.deny() invoked on client.");                                             // 185
  };                                                                                                                  // 185
                                                                                                                      //
  JobCollectionBase.prototype.promote = function () {                                                                 // 365
    throw new Error("Server-only function jc.promote() invoked on client.");                                          // 186
  };                                                                                                                  // 186
                                                                                                                      //
  JobCollectionBase.prototype.setLogStream = function () {                                                            // 369
    throw new Error("Server-only function jc.setLogStream() invoked on client.");                                     // 187
  };                                                                                                                  // 187
                                                                                                                      //
  JobCollectionBase.prototype.logConsole = function () {                                                              // 373
    throw new Error("Client-only function jc.logConsole() invoked on server.");                                       // 190
  };                                                                                                                  // 190
                                                                                                                      //
  JobCollectionBase.prototype.makeJob = function () {                                                                 // 377
    var dep;                                                                                                          // 194
    dep = false;                                                                                                      // 194
    return function () {                                                                                              // 380
      var params;                                                                                                     // 196
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                 // 195
                                                                                                                      //
      if (!dep) {                                                                                                     // 196
        dep = true;                                                                                                   // 197
        console.warn("WARNING: jc.makeJob() has been deprecated. Use new Job(jc, doc) instead.");                     // 198
      }                                                                                                               // 386
                                                                                                                      //
      return function (func, args, ctor) {                                                                            // 387
        ctor.prototype = func.prototype;                                                                              // 388
        var child = new ctor(),                                                                                       // 389
            result = func.apply(child, args);                                                                         // 389
        return Object(result) === result ? result : child;                                                            // 390
      }(Job, [this.root].concat(slice.call(params)), function () {});                                                 // 391
    };                                                                                                                // 195
  }();                                                                                                                // 193
                                                                                                                      //
  JobCollectionBase.prototype.createJob = function () {                                                               // 395
    var dep;                                                                                                          // 203
    dep = false;                                                                                                      // 203
    return function () {                                                                                              // 398
      var params;                                                                                                     // 205
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                 // 204
                                                                                                                      //
      if (!dep) {                                                                                                     // 205
        dep = true;                                                                                                   // 206
        console.warn("WARNING: jc.createJob() has been deprecated. Use new Job(jc, type, data) instead.");            // 207
      }                                                                                                               // 404
                                                                                                                      //
      return function (func, args, ctor) {                                                                            // 405
        ctor.prototype = func.prototype;                                                                              // 406
        var child = new ctor(),                                                                                       // 407
            result = func.apply(child, args);                                                                         // 407
        return Object(result) === result ? result : child;                                                            // 408
      }(Job, [this.root].concat(slice.call(params)), function () {});                                                 // 409
    };                                                                                                                // 204
  }();                                                                                                                // 202
                                                                                                                      //
  JobCollectionBase.prototype._methodWrapper = function (method, func) {                                              // 413
    var ref, toLog, unblockDDPMethods;                                                                                // 211
    toLog = this._toLog;                                                                                              // 211
    unblockDDPMethods = (ref = this._unblockDDPMethods) != null ? ref : false;                                        // 212
    return function () {                                                                                              // 214
      var params, ref1, retval, user;                                                                                 // 215
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];                                                 // 214
      user = (ref1 = this.userId) != null ? ref1 : "[UNAUTHENTICATED]";                                               // 215
      toLog(user, method, "params: " + JSON.stringify(params));                                                       // 216
                                                                                                                      //
      if (unblockDDPMethods) {                                                                                        // 217
        this.unblock();                                                                                               // 217
      }                                                                                                               // 424
                                                                                                                      //
      retval = func.apply(null, params);                                                                              // 218
      toLog(user, method, "returned: " + JSON.stringify(retval));                                                     // 219
      return retval;                                                                                                  // 220
    };                                                                                                                // 214
  };                                                                                                                  // 210
                                                                                                                      //
  JobCollectionBase.prototype._generateMethods = function () {                                                        // 431
    var baseMethodName, methodFunc, methodName, methodPrefix, methodsOut, ref;                                        // 223
    methodsOut = {};                                                                                                  // 223
    methodPrefix = '_DDPMethod_';                                                                                     // 224
    ref = this;                                                                                                       // 225
                                                                                                                      //
    for (methodName in meteorBabelHelpers.sanitizeForInObject(ref)) {                                                 // 225
      methodFunc = ref[methodName];                                                                                   // 437
                                                                                                                      //
      if (!(methodName.slice(0, methodPrefix.length) === methodPrefix)) {                                             // 438
        continue;                                                                                                     // 439
      }                                                                                                               // 440
                                                                                                                      //
      baseMethodName = methodName.slice(methodPrefix.length);                                                         // 226
      methodsOut[this.root + "_" + baseMethodName] = this._methodWrapper(baseMethodName, methodFunc.bind(this));      // 227
    }                                                                                                                 // 225
                                                                                                                      //
    return methodsOut;                                                                                                // 228
  };                                                                                                                  // 222
                                                                                                                      //
  JobCollectionBase.prototype._idsOfDeps = function (ids, antecedents, dependents, jobStatuses) {                     // 447
    var antsArray, dependsIds, dependsQuery;                                                                          // 234
    dependsQuery = [];                                                                                                // 234
    dependsIds = [];                                                                                                  // 235
                                                                                                                      //
    if (dependents) {                                                                                                 // 236
      dependsQuery.push({                                                                                             // 237
        depends: {                                                                                                    // 238
          $elemMatch: {                                                                                               // 239
            $in: ids                                                                                                  // 240
          }                                                                                                           // 240
        }                                                                                                             // 239
      });                                                                                                             // 238
    }                                                                                                                 // 459
                                                                                                                      //
    if (antecedents) {                                                                                                // 241
      antsArray = [];                                                                                                 // 242
      this.find({                                                                                                     // 243
        _id: {                                                                                                        // 245
          $in: ids                                                                                                    // 246
        }                                                                                                             // 246
      }, {                                                                                                            // 244
        fields: {                                                                                                     // 249
          depends: 1                                                                                                  // 250
        },                                                                                                            // 250
        transform: null                                                                                               // 251
      }).forEach(function (d) {                                                                                       // 248
        var i, k, len, ref, results;                                                                                  // 253
                                                                                                                      //
        if (indexOf.call(antsArray, i) < 0) {                                                                         // 253
          ref = d.depends;                                                                                            // 253
          results = [];                                                                                               // 253
                                                                                                                      //
          for (k = 0, len = ref.length; k < len; k++) {                                                               // 476
            i = ref[k];                                                                                               // 477
            results.push(antsArray.push(i));                                                                          // 478
          }                                                                                                           // 253
                                                                                                                      //
          return results;                                                                                             // 480
        }                                                                                                             // 481
      });                                                                                                             // 243
                                                                                                                      //
      if (antsArray.length > 0) {                                                                                     // 254
        dependsQuery.push({                                                                                           // 255
          _id: {                                                                                                      // 256
            $in: antsArray                                                                                            // 257
          }                                                                                                           // 257
        });                                                                                                           // 256
      }                                                                                                               // 241
    }                                                                                                                 // 490
                                                                                                                      //
    if (dependsQuery.length > 0) {                                                                                    // 258
      this.find({                                                                                                     // 259
        status: {                                                                                                     // 261
          $in: jobStatuses                                                                                            // 262
        },                                                                                                            // 262
        $or: dependsQuery                                                                                             // 263
      }, {                                                                                                            // 260
        fields: {                                                                                                     // 266
          _id: 1                                                                                                      // 267
        },                                                                                                            // 267
        transform: null                                                                                               // 268
      }).forEach(function (d) {                                                                                       // 265
        var ref;                                                                                                      // 271
                                                                                                                      //
        if (ref = d._id, indexOf.call(dependsIds, ref) < 0) {                                                         // 271
          return dependsIds.push(d._id);                                                                              // 505
        }                                                                                                             // 506
      });                                                                                                             // 259
    }                                                                                                                 // 508
                                                                                                                      //
    return dependsIds;                                                                                                // 272
  };                                                                                                                  // 230
                                                                                                                      //
  JobCollectionBase.prototype._rerun_job = function (doc, repeats, wait, repeatUntil) {                               // 512
    var id, jobId, logObj, runId, time;                                                                               // 276
                                                                                                                      //
    if (repeats == null) {                                                                                            // 514
      repeats = doc.repeats - 1;                                                                                      // 274
    }                                                                                                                 // 516
                                                                                                                      //
    if (wait == null) {                                                                                               // 517
      wait = doc.repeatWait;                                                                                          // 274
    }                                                                                                                 // 519
                                                                                                                      //
    if (repeatUntil == null) {                                                                                        // 520
      repeatUntil = doc.repeatUntil;                                                                                  // 274
    }                                                                                                                 // 522
                                                                                                                      //
    id = doc._id;                                                                                                     // 276
    runId = doc.runId;                                                                                                // 277
    time = new Date();                                                                                                // 278
    delete doc._id;                                                                                                   // 279
    delete doc.result;                                                                                                // 280
    delete doc.failures;                                                                                              // 281
    delete doc.expiresAfter;                                                                                          // 282
    delete doc.workTimeout;                                                                                           // 283
    doc.runId = null;                                                                                                 // 284
    doc.status = "waiting";                                                                                           // 285
    doc.repeatRetries = doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried;                    // 286
    doc.retries = doc.repeatRetries;                                                                                  // 287
                                                                                                                      //
    if (doc.retries > this.forever) {                                                                                 // 288
      doc.retries = this.forever;                                                                                     // 288
    }                                                                                                                 // 537
                                                                                                                      //
    doc.retryUntil = repeatUntil;                                                                                     // 289
    doc.retried = 0;                                                                                                  // 290
    doc.repeats = repeats;                                                                                            // 291
                                                                                                                      //
    if (doc.repeats > this.forever) {                                                                                 // 292
      doc.repeats = this.forever;                                                                                     // 292
    }                                                                                                                 // 543
                                                                                                                      //
    doc.repeatUntil = repeatUntil;                                                                                    // 293
    doc.repeated = doc.repeated + 1;                                                                                  // 294
    doc.updated = time;                                                                                               // 295
    doc.created = time;                                                                                               // 296
    doc.progress = {                                                                                                  // 297
      completed: 0,                                                                                                   // 298
      total: 1,                                                                                                       // 299
      percent: 0                                                                                                      // 300
    };                                                                                                                // 298
                                                                                                                      //
    if (logObj = this._logMessage.rerun(id, runId)) {                                                                 // 301
      doc.log = [logObj];                                                                                             // 302
    } else {                                                                                                          // 301
      doc.log = [];                                                                                                   // 304
    }                                                                                                                 // 557
                                                                                                                      //
    doc.after = new Date(time.valueOf() + wait);                                                                      // 306
                                                                                                                      //
    if (jobId = this.insert(doc)) {                                                                                   // 307
      this._DDPMethod_jobReady(jobId);                                                                                // 308
                                                                                                                      //
      return jobId;                                                                                                   // 309
    } else {                                                                                                          // 307
      console.warn("Job rerun/repeat failed to reschedule!", id, runId);                                              // 311
    }                                                                                                                 // 564
                                                                                                                      //
    return null;                                                                                                      // 312
  };                                                                                                                  // 274
                                                                                                                      //
  JobCollectionBase.prototype._checkDeps = function (job, dryRun) {                                                   // 568
    var cancel, cancelled, depJob, deps, failed, foundIds, j, k, len, len1, log, m, mods, n, ref, ref1, removed, resolved;
                                                                                                                      //
    if (dryRun == null) {                                                                                             // 570
      dryRun = true;                                                                                                  // 314
    }                                                                                                                 // 572
                                                                                                                      //
    cancel = false;                                                                                                   // 315
    resolved = [];                                                                                                    // 316
    failed = [];                                                                                                      // 317
    cancelled = [];                                                                                                   // 318
    removed = [];                                                                                                     // 319
    log = [];                                                                                                         // 320
                                                                                                                      //
    if (job.depends.length > 0) {                                                                                     // 321
      deps = this.find({                                                                                              // 322
        _id: {                                                                                                        // 322
          $in: job.depends                                                                                            // 322
        }                                                                                                             // 322
      }, {                                                                                                            // 322
        fields: {                                                                                                     // 322
          _id: 1,                                                                                                     // 322
          runId: 1,                                                                                                   // 322
          status: 1                                                                                                   // 322
        }                                                                                                             // 322
      }).fetch();                                                                                                     // 322
                                                                                                                      //
      if (deps.length !== job.depends.length) {                                                                       // 324
        foundIds = deps.map(function (d) {                                                                            // 325
          return d._id;                                                                                               // 593
        });                                                                                                           // 325
        ref = job.depends;                                                                                            // 326
                                                                                                                      //
        for (k = 0, len = ref.length; k < len; k++) {                                                                 // 326
          j = ref[k];                                                                                                 // 597
                                                                                                                      //
          if (!!(indexOf.call(foundIds, j) >= 0)) {                                                                   // 598
            continue;                                                                                                 // 599
          }                                                                                                           // 600
                                                                                                                      //
          if (!dryRun) {                                                                                              // 327
            this._DDPMethod_jobLog(job._id, null, "Antecedent job " + j + " missing at save");                        // 327
          }                                                                                                           // 603
                                                                                                                      //
          removed.push(j);                                                                                            // 328
        }                                                                                                             // 326
                                                                                                                      //
        cancel = true;                                                                                                // 329
      }                                                                                                               // 607
                                                                                                                      //
      for (m = 0, len1 = deps.length; m < len1; m++) {                                                                // 331
        depJob = deps[m];                                                                                             // 609
                                                                                                                      //
        if (ref1 = depJob.status, indexOf.call(this.jobStatusCancellable, ref1) < 0) {                                // 332
          switch (depJob.status) {                                                                                    // 333
            case "completed":                                                                                         // 333
              resolved.push(depJob._id);                                                                              // 335
              log.push(this._logMessage.resolved(depJob._id, depJob.runId));                                          // 336
              break;                                                                                                  // 334
                                                                                                                      //
            case "failed":                                                                                            // 333
              cancel = true;                                                                                          // 338
              failed.push(depJob._id);                                                                                // 339
                                                                                                                      //
              if (!dryRun) {                                                                                          // 340
                this._DDPMethod_jobLog(job._id, null, "Antecedent job failed before save");                           // 340
              }                                                                                                       // 621
                                                                                                                      //
              break;                                                                                                  // 337
                                                                                                                      //
            case "cancelled":                                                                                         // 333
              cancel = true;                                                                                          // 342
              cancelled.push(depJob._id);                                                                             // 343
                                                                                                                      //
              if (!dryRun) {                                                                                          // 344
                this._DDPMethod_jobLog(job._id, null, "Antecedent job cancelled before save");                        // 344
              }                                                                                                       // 628
                                                                                                                      //
              break;                                                                                                  // 341
                                                                                                                      //
            default:                                                                                                  // 333
              throw new Meteor.Error("Unknown status in jobSave Dependency check");                                   // 346
          }                                                                                                           // 333
        }                                                                                                             // 633
      }                                                                                                               // 331
                                                                                                                      //
      if (!(resolved.length === 0 || dryRun)) {                                                                       // 348
        mods = {                                                                                                      // 349
          $pull: {                                                                                                    // 350
            depends: {                                                                                                // 351
              $in: resolved                                                                                           // 352
            }                                                                                                         // 352
          },                                                                                                          // 351
          $push: {                                                                                                    // 353
            resolved: {                                                                                               // 354
              $each: resolved                                                                                         // 355
            },                                                                                                        // 355
            log: {                                                                                                    // 356
              $each: log                                                                                              // 357
            }                                                                                                         // 357
          }                                                                                                           // 354
        };                                                                                                            // 350
        n = this.update({                                                                                             // 359
          _id: job._id,                                                                                               // 361
          status: 'waiting'                                                                                           // 362
        }, mods);                                                                                                     // 360
                                                                                                                      //
        if (!n) {                                                                                                     // 367
          console.warn("Update for job " + job._id + " during dependency check failed.");                             // 368
        }                                                                                                             // 348
      }                                                                                                               // 658
                                                                                                                      //
      if (cancel && !dryRun) {                                                                                        // 370
        this._DDPMethod_jobCancel(job._id);                                                                           // 371
                                                                                                                      //
        return false;                                                                                                 // 372
      }                                                                                                               // 321
    }                                                                                                                 // 663
                                                                                                                      //
    if (dryRun) {                                                                                                     // 374
      if (cancel || resolved.length > 0) {                                                                            // 375
        return {                                                                                                      // 376
          jobId: job._id,                                                                                             // 377
          resolved: resolved,                                                                                         // 378
          failed: failed,                                                                                             // 379
          cancelled: cancelled,                                                                                       // 380
          removed: removed                                                                                            // 381
        };                                                                                                            // 376
      } else {                                                                                                        // 375
        return false;                                                                                                 // 384
      }                                                                                                               // 374
    } else {                                                                                                          // 374
      return true;                                                                                                    // 386
    }                                                                                                                 // 678
  };                                                                                                                  // 314
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_startJobServer = function (options) {                                        // 681
    check(options, Match.Optional({}));                                                                               // 389
                                                                                                                      //
    if (options == null) {                                                                                            // 683
      options = {};                                                                                                   // 390
    }                                                                                                                 // 685
                                                                                                                      //
    if (!this.isSimulation) {                                                                                         // 392
      if (this.stopped && this.stopped !== true) {                                                                    // 393
        Meteor.clearTimeout(this.stopped);                                                                            // 393
      }                                                                                                               // 689
                                                                                                                      //
      this.stopped = false;                                                                                           // 394
    }                                                                                                                 // 691
                                                                                                                      //
    return true;                                                                                                      // 395
  };                                                                                                                  // 388
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_startJobs = function () {                                                    // 695
    var depFlag;                                                                                                      // 398
    depFlag = false;                                                                                                  // 398
    return function (options) {                                                                                       // 698
      if (!depFlag) {                                                                                                 // 400
        depFlag = true;                                                                                               // 401
        console.warn("Deprecation Warning: jc.startJobs() has been renamed to jc.startJobServer()");                  // 402
      }                                                                                                               // 702
                                                                                                                      //
      return this._DDPMethod_startJobServer(options);                                                                 // 403
    };                                                                                                                // 399
  }();                                                                                                                // 397
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_shutdownJobServer = function (options) {                                     // 707
    check(options, Match.Optional({                                                                                   // 406
      timeout: Match.Optional(Match.Where(_validIntGTEOne))                                                           // 407
    }));                                                                                                              // 407
                                                                                                                      //
    if (options == null) {                                                                                            // 711
      options = {};                                                                                                   // 408
    }                                                                                                                 // 713
                                                                                                                      //
    if (options.timeout == null) {                                                                                    // 714
      options.timeout = 60 * 1000;                                                                                    // 409
    }                                                                                                                 // 716
                                                                                                                      //
    if (!this.isSimulation) {                                                                                         // 412
      if (this.stopped && this.stopped !== true) {                                                                    // 413
        Meteor.clearTimeout(this.stopped);                                                                            // 413
      }                                                                                                               // 720
                                                                                                                      //
      this.stopped = Meteor.setTimeout(function (_this) {                                                             // 414
        return function () {                                                                                          // 722
          var cursor, failedJobs;                                                                                     // 416
          cursor = _this.find({                                                                                       // 416
            status: 'running'                                                                                         // 418
          }, {                                                                                                        // 417
            transform: null                                                                                           // 421
          });                                                                                                         // 420
          failedJobs = cursor.count();                                                                                // 424
                                                                                                                      //
          if (failedJobs !== 0) {                                                                                     // 425
            console.warn("Failing " + failedJobs + " jobs on queue stop.");                                           // 425
          }                                                                                                           // 732
                                                                                                                      //
          cursor.forEach(function (d) {                                                                               // 426
            return _this._DDPMethod_jobFail(d._id, d.runId, "Running at Job Server shutdown.");                       // 734
          });                                                                                                         // 426
                                                                                                                      //
          if (_this.logStream != null) {                                                                              // 427
            _this.logStream.end();                                                                                    // 428
                                                                                                                      //
            return _this.logStream = null;                                                                            // 738
          }                                                                                                           // 739
        };                                                                                                            // 415
      }(this), options.timeout);                                                                                      // 415
    }                                                                                                                 // 742
                                                                                                                      //
    return true;                                                                                                      // 432
  };                                                                                                                  // 405
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_stopJobs = function () {                                                     // 746
    var depFlag;                                                                                                      // 435
    depFlag = false;                                                                                                  // 435
    return function (options) {                                                                                       // 749
      if (!depFlag) {                                                                                                 // 437
        depFlag = true;                                                                                               // 438
        console.warn("Deprecation Warning: jc.stopJobs() has been renamed to jc.shutdownJobServer()");                // 439
      }                                                                                                               // 753
                                                                                                                      //
      return this._DDPMethod_shutdownJobServer(options);                                                              // 440
    };                                                                                                                // 436
  }();                                                                                                                // 434
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_getJob = function (ids, options) {                                           // 758
    var d, docs, fields, single;                                                                                      // 443
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 443
    check(options, Match.Optional({                                                                                   // 444
      getLog: Match.Optional(Boolean),                                                                                // 445
      getFailures: Match.Optional(Boolean)                                                                            // 446
    }));                                                                                                              // 445
                                                                                                                      //
    if (options == null) {                                                                                            // 765
      options = {};                                                                                                   // 447
    }                                                                                                                 // 767
                                                                                                                      //
    if (options.getLog == null) {                                                                                     // 768
      options.getLog = false;                                                                                         // 448
    }                                                                                                                 // 770
                                                                                                                      //
    if (options.getFailures == null) {                                                                                // 771
      options.getFailures = false;                                                                                    // 449
    }                                                                                                                 // 773
                                                                                                                      //
    single = false;                                                                                                   // 450
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 451
      ids = [ids];                                                                                                    // 452
      single = true;                                                                                                  // 453
    }                                                                                                                 // 778
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 454
      return null;                                                                                                    // 454
    }                                                                                                                 // 781
                                                                                                                      //
    fields = {                                                                                                        // 455
      _private: 0                                                                                                     // 455
    };                                                                                                                // 455
                                                                                                                      //
    if (!options.getLog) {                                                                                            // 456
      fields.log = 0;                                                                                                 // 456
    }                                                                                                                 // 787
                                                                                                                      //
    if (!options.getFailures) {                                                                                       // 457
      fields.failures = 0;                                                                                            // 457
    }                                                                                                                 // 790
                                                                                                                      //
    docs = this.find({                                                                                                // 458
      _id: {                                                                                                          // 460
        $in: ids                                                                                                      // 461
      }                                                                                                               // 461
    }, {                                                                                                              // 459
      fields: fields,                                                                                                 // 464
      transform: null                                                                                                 // 465
    }).fetch();                                                                                                       // 463
                                                                                                                      //
    if (docs != null ? docs.length : void 0) {                                                                        // 468
      if (this.scrub != null) {                                                                                       // 469
        docs = function () {                                                                                          // 470
          var k, len, results;                                                                                        // 802
          results = [];                                                                                               // 470
                                                                                                                      //
          for (k = 0, len = docs.length; k < len; k++) {                                                              // 804
            d = docs[k];                                                                                              // 805
            results.push(this.scrub(d));                                                                              // 806
          }                                                                                                           // 470
                                                                                                                      //
          return results;                                                                                             // 808
        }.call(this);                                                                                                 // 809
      }                                                                                                               // 810
                                                                                                                      //
      check(docs, [_validJobDoc()]);                                                                                  // 471
                                                                                                                      //
      if (single) {                                                                                                   // 472
        return docs[0];                                                                                               // 473
      } else {                                                                                                        // 472
        return docs;                                                                                                  // 475
      }                                                                                                               // 468
    }                                                                                                                 // 817
                                                                                                                      //
    return null;                                                                                                      // 476
  };                                                                                                                  // 442
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_getWork = function (type, options) {                                         // 821
    var d, docs, foundDocs, ids, logObj, mods, num, runId, time;                                                      // 479
    check(type, Match.OneOf(String, [String]));                                                                       // 479
    check(options, Match.Optional({                                                                                   // 480
      maxJobs: Match.Optional(Match.Where(_validIntGTEOne)),                                                          // 481
      workTimeout: Match.Optional(Match.Where(_validIntGTEOne))                                                       // 482
    }));                                                                                                              // 481
                                                                                                                      //
    if (this.isSimulation) {                                                                                          // 485
      return;                                                                                                         // 486
    }                                                                                                                 // 830
                                                                                                                      //
    if (options == null) {                                                                                            // 831
      options = {};                                                                                                   // 488
    }                                                                                                                 // 833
                                                                                                                      //
    if (options.maxJobs == null) {                                                                                    // 834
      options.maxJobs = 1;                                                                                            // 489
    }                                                                                                                 // 836
                                                                                                                      //
    if (this.stopped) {                                                                                               // 491
      return [];                                                                                                      // 492
    }                                                                                                                 // 839
                                                                                                                      //
    if (typeof type === 'string') {                                                                                   // 495
      type = [type];                                                                                                  // 496
    }                                                                                                                 // 842
                                                                                                                      //
    time = new Date();                                                                                                // 497
    docs = [];                                                                                                        // 498
    runId = this._makeNewID();                                                                                        // 499
                                                                                                                      //
    while (docs.length < options.maxJobs) {                                                                           // 501
      ids = this.find({                                                                                               // 503
        type: {                                                                                                       // 505
          $in: type                                                                                                   // 506
        },                                                                                                            // 506
        status: 'ready',                                                                                              // 507
        runId: null                                                                                                   // 508
      }, {                                                                                                            // 504
        sort: {                                                                                                       // 511
          priority: 1,                                                                                                // 512
          retryUntil: 1,                                                                                              // 513
          after: 1                                                                                                    // 514
        },                                                                                                            // 512
        limit: options.maxJobs - docs.length,                                                                         // 515
        fields: {                                                                                                     // 516
          _id: 1                                                                                                      // 517
        },                                                                                                            // 517
        transform: null                                                                                               // 518
      }).map(function (d) {                                                                                           // 510
        return d._id;                                                                                                 // 865
      });                                                                                                             // 503
                                                                                                                      //
      if (!((ids != null ? ids.length : void 0) > 0)) {                                                               // 521
        break;                                                                                                        // 522
      }                                                                                                               // 869
                                                                                                                      //
      mods = {                                                                                                        // 524
        $set: {                                                                                                       // 525
          status: 'running',                                                                                          // 526
          runId: runId,                                                                                               // 527
          updated: time                                                                                               // 528
        },                                                                                                            // 526
        $inc: {                                                                                                       // 529
          retries: -1,                                                                                                // 530
          retried: 1                                                                                                  // 531
        }                                                                                                             // 530
      };                                                                                                              // 525
                                                                                                                      //
      if (logObj = this._logMessage.running(runId)) {                                                                 // 533
        mods.$push = {                                                                                                // 534
          log: logObj                                                                                                 // 535
        };                                                                                                            // 535
      }                                                                                                               // 885
                                                                                                                      //
      if (options.workTimeout != null) {                                                                              // 537
        mods.$set.workTimeout = options.workTimeout;                                                                  // 538
        mods.$set.expiresAfter = new Date(time.valueOf() + options.workTimeout);                                      // 539
      } else {                                                                                                        // 537
        if (mods.$unset == null) {                                                                                    // 890
          mods.$unset = {};                                                                                           // 541
        }                                                                                                             // 892
                                                                                                                      //
        mods.$unset.workTimeout = "";                                                                                 // 542
        mods.$unset.expiresAfter = "";                                                                                // 543
      }                                                                                                               // 895
                                                                                                                      //
      num = this.update({                                                                                             // 545
        _id: {                                                                                                        // 547
          $in: ids                                                                                                    // 548
        },                                                                                                            // 548
        status: 'ready',                                                                                              // 549
        runId: null                                                                                                   // 550
      }, mods, {                                                                                                      // 546
        multi: true                                                                                                   // 554
      });                                                                                                             // 553
                                                                                                                      //
      if (num > 0) {                                                                                                  // 558
        foundDocs = this.find({                                                                                       // 559
          _id: {                                                                                                      // 561
            $in: ids                                                                                                  // 562
          },                                                                                                          // 562
          runId: runId                                                                                                // 563
        }, {                                                                                                          // 560
          fields: {                                                                                                   // 566
            log: 0,                                                                                                   // 567
            failures: 0,                                                                                              // 568
            _private: 0                                                                                               // 569
          },                                                                                                          // 567
          transform: null                                                                                             // 570
        }).fetch();                                                                                                   // 565
                                                                                                                      //
        if ((foundDocs != null ? foundDocs.length : void 0) > 0) {                                                    // 574
          if (this.scrub != null) {                                                                                   // 575
            foundDocs = function () {                                                                                 // 576
              var k, len, results;                                                                                    // 922
              results = [];                                                                                           // 576
                                                                                                                      //
              for (k = 0, len = foundDocs.length; k < len; k++) {                                                     // 924
                d = foundDocs[k];                                                                                     // 925
                results.push(this.scrub(d));                                                                          // 926
              }                                                                                                       // 576
                                                                                                                      //
              return results;                                                                                         // 928
            }.call(this);                                                                                             // 929
          }                                                                                                           // 930
                                                                                                                      //
          check(docs, [_validJobDoc()]);                                                                              // 577
          docs = docs.concat(foundDocs);                                                                              // 578
        }                                                                                                             // 558
      }                                                                                                               // 934
    }                                                                                                                 // 501
                                                                                                                      //
    return docs;                                                                                                      // 581
  };                                                                                                                  // 478
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobRemove = function (ids, options) {                                        // 939
    var num;                                                                                                          // 584
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 584
    check(options, Match.Optional({}));                                                                               // 585
                                                                                                                      //
    if (options == null) {                                                                                            // 943
      options = {};                                                                                                   // 586
    }                                                                                                                 // 945
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 587
      ids = [ids];                                                                                                    // 588
    }                                                                                                                 // 948
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 589
      return false;                                                                                                   // 589
    }                                                                                                                 // 951
                                                                                                                      //
    num = this.remove({                                                                                               // 590
      _id: {                                                                                                          // 592
        $in: ids                                                                                                      // 593
      },                                                                                                              // 593
      status: {                                                                                                       // 594
        $in: this.jobStatusRemovable                                                                                  // 595
      }                                                                                                               // 595
    });                                                                                                               // 591
                                                                                                                      //
    if (num > 0) {                                                                                                    // 598
      return true;                                                                                                    // 599
    } else {                                                                                                          // 598
      console.warn("jobRemove failed");                                                                               // 601
    }                                                                                                                 // 964
                                                                                                                      //
    return false;                                                                                                     // 602
  };                                                                                                                  // 583
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobPause = function (ids, options) {                                         // 968
    var logObj, mods, num, time;                                                                                      // 605
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 605
    check(options, Match.Optional({}));                                                                               // 606
                                                                                                                      //
    if (options == null) {                                                                                            // 972
      options = {};                                                                                                   // 607
    }                                                                                                                 // 974
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 608
      ids = [ids];                                                                                                    // 609
    }                                                                                                                 // 977
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 610
      return false;                                                                                                   // 610
    }                                                                                                                 // 980
                                                                                                                      //
    time = new Date();                                                                                                // 611
    mods = {                                                                                                          // 613
      $set: {                                                                                                         // 614
        status: "paused",                                                                                             // 615
        updated: time                                                                                                 // 616
      }                                                                                                               // 615
    };                                                                                                                // 614
                                                                                                                      //
    if (logObj = this._logMessage.paused()) {                                                                         // 618
      mods.$push = {                                                                                                  // 619
        log: logObj                                                                                                   // 620
      };                                                                                                              // 620
    }                                                                                                                 // 992
                                                                                                                      //
    num = this.update({                                                                                               // 622
      _id: {                                                                                                          // 624
        $in: ids                                                                                                      // 625
      },                                                                                                              // 625
      status: {                                                                                                       // 626
        $in: this.jobStatusPausable                                                                                   // 627
      }                                                                                                               // 627
    }, mods, {                                                                                                        // 623
      multi: true                                                                                                     // 631
    });                                                                                                               // 630
                                                                                                                      //
    if (num > 0) {                                                                                                    // 634
      return true;                                                                                                    // 635
    } else {                                                                                                          // 634
      console.warn("jobPause failed");                                                                                // 637
    }                                                                                                                 // 1007
                                                                                                                      //
    return false;                                                                                                     // 638
  };                                                                                                                  // 604
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobResume = function (ids, options) {                                        // 1011
    var logObj, mods, num, time;                                                                                      // 641
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 641
    check(options, Match.Optional({}));                                                                               // 642
                                                                                                                      //
    if (options == null) {                                                                                            // 1015
      options = {};                                                                                                   // 643
    }                                                                                                                 // 1017
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 644
      ids = [ids];                                                                                                    // 645
    }                                                                                                                 // 1020
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 646
      return false;                                                                                                   // 646
    }                                                                                                                 // 1023
                                                                                                                      //
    time = new Date();                                                                                                // 647
    mods = {                                                                                                          // 648
      $set: {                                                                                                         // 649
        status: "waiting",                                                                                            // 650
        updated: time                                                                                                 // 651
      }                                                                                                               // 650
    };                                                                                                                // 649
                                                                                                                      //
    if (logObj = this._logMessage.resumed()) {                                                                        // 653
      mods.$push = {                                                                                                  // 654
        log: logObj                                                                                                   // 655
      };                                                                                                              // 655
    }                                                                                                                 // 1035
                                                                                                                      //
    num = this.update({                                                                                               // 657
      _id: {                                                                                                          // 659
        $in: ids                                                                                                      // 660
      },                                                                                                              // 660
      status: "paused",                                                                                               // 661
      updated: {                                                                                                      // 662
        $ne: time                                                                                                     // 663
      }                                                                                                               // 663
    }, mods, {                                                                                                        // 658
      multi: true                                                                                                     // 667
    });                                                                                                               // 666
                                                                                                                      //
    if (num > 0) {                                                                                                    // 670
      this._DDPMethod_jobReady(ids);                                                                                  // 671
                                                                                                                      //
      return true;                                                                                                    // 672
    } else {                                                                                                          // 670
      console.warn("jobResume failed");                                                                               // 674
    }                                                                                                                 // 1052
                                                                                                                      //
    return false;                                                                                                     // 675
  };                                                                                                                  // 640
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobReady = function (ids, options) {                                         // 1056
    var l, logObj, mods, now, num, query;                                                                             // 678
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 678
    check(options, Match.Optional({                                                                                   // 679
      force: Match.Optional(Boolean),                                                                                 // 680
      time: Match.Optional(Date)                                                                                      // 681
    }));                                                                                                              // 680
                                                                                                                      //
    if (this.isSimulation) {                                                                                          // 686
      return;                                                                                                         // 687
    }                                                                                                                 // 1065
                                                                                                                      //
    now = new Date();                                                                                                 // 689
                                                                                                                      //
    if (options == null) {                                                                                            // 1067
      options = {};                                                                                                   // 691
    }                                                                                                                 // 1069
                                                                                                                      //
    if (options.force == null) {                                                                                      // 1070
      options.force = false;                                                                                          // 692
    }                                                                                                                 // 1072
                                                                                                                      //
    if (options.time == null) {                                                                                       // 1073
      options.time = now;                                                                                             // 693
    }                                                                                                                 // 1075
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 695
      ids = [ids];                                                                                                    // 696
    }                                                                                                                 // 1078
                                                                                                                      //
    query = {                                                                                                         // 698
      status: "waiting",                                                                                              // 699
      after: {                                                                                                        // 700
        $lte: options.time                                                                                            // 701
      }                                                                                                               // 701
    };                                                                                                                // 699
    mods = {                                                                                                          // 703
      $set: {                                                                                                         // 704
        status: "ready",                                                                                              // 705
        updated: now                                                                                                  // 706
      }                                                                                                               // 705
    };                                                                                                                // 704
                                                                                                                      //
    if (ids.length > 0) {                                                                                             // 708
      query._id = {                                                                                                   // 709
        $in: ids                                                                                                      // 710
      };                                                                                                              // 710
      mods.$set.after = now;                                                                                          // 711
    }                                                                                                                 // 1096
                                                                                                                      //
    logObj = [];                                                                                                      // 713
                                                                                                                      //
    if (options.force) {                                                                                              // 715
      mods.$set.depends = [];                                                                                         // 716
      l = this._logMessage.forced();                                                                                  // 717
                                                                                                                      //
      if (l) {                                                                                                        // 718
        logObj.push(l);                                                                                               // 718
      }                                                                                                               // 715
    } else {                                                                                                          // 715
      query.depends = {                                                                                               // 720
        $size: 0                                                                                                      // 721
      };                                                                                                              // 721
    }                                                                                                                 // 1108
                                                                                                                      //
    l = this._logMessage.readied();                                                                                   // 723
                                                                                                                      //
    if (l) {                                                                                                          // 724
      logObj.push(l);                                                                                                 // 724
    }                                                                                                                 // 1112
                                                                                                                      //
    if (logObj.length > 0) {                                                                                          // 726
      mods.$push = {                                                                                                  // 727
        log: {                                                                                                        // 728
          $each: logObj                                                                                               // 729
        }                                                                                                             // 729
      };                                                                                                              // 728
    }                                                                                                                 // 1119
                                                                                                                      //
    num = this.update(query, mods, {                                                                                  // 731
      multi: true                                                                                                     // 735
    });                                                                                                               // 734
                                                                                                                      //
    if (num > 0) {                                                                                                    // 739
      return true;                                                                                                    // 740
    } else {                                                                                                          // 739
      return false;                                                                                                   // 742
    }                                                                                                                 // 1127
  };                                                                                                                  // 677
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobCancel = function (ids, options) {                                        // 1130
    var cancelIds, depsCancelled, logObj, mods, num, time;                                                            // 745
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 745
    check(options, Match.Optional({                                                                                   // 746
      antecedents: Match.Optional(Boolean),                                                                           // 747
      dependents: Match.Optional(Boolean)                                                                             // 748
    }));                                                                                                              // 747
                                                                                                                      //
    if (options == null) {                                                                                            // 1137
      options = {};                                                                                                   // 749
    }                                                                                                                 // 1139
                                                                                                                      //
    if (options.antecedents == null) {                                                                                // 1140
      options.antecedents = false;                                                                                    // 750
    }                                                                                                                 // 1142
                                                                                                                      //
    if (options.dependents == null) {                                                                                 // 1143
      options.dependents = true;                                                                                      // 751
    }                                                                                                                 // 1145
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 752
      ids = [ids];                                                                                                    // 753
    }                                                                                                                 // 1148
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 754
      return false;                                                                                                   // 754
    }                                                                                                                 // 1151
                                                                                                                      //
    time = new Date();                                                                                                // 755
    mods = {                                                                                                          // 757
      $set: {                                                                                                         // 758
        status: "cancelled",                                                                                          // 759
        runId: null,                                                                                                  // 760
        progress: {                                                                                                   // 761
          completed: 0,                                                                                               // 762
          total: 1,                                                                                                   // 763
          percent: 0                                                                                                  // 764
        },                                                                                                            // 762
        updated: time                                                                                                 // 765
      }                                                                                                               // 759
    };                                                                                                                // 758
                                                                                                                      //
    if (logObj = this._logMessage.cancelled()) {                                                                      // 767
      mods.$push = {                                                                                                  // 768
        log: logObj                                                                                                   // 769
      };                                                                                                              // 769
    }                                                                                                                 // 1169
                                                                                                                      //
    num = this.update({                                                                                               // 771
      _id: {                                                                                                          // 773
        $in: ids                                                                                                      // 774
      },                                                                                                              // 774
      status: {                                                                                                       // 775
        $in: this.jobStatusCancellable                                                                                // 776
      }                                                                                                               // 776
    }, mods, {                                                                                                        // 772
      multi: true                                                                                                     // 780
    });                                                                                                               // 779
    cancelIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusCancellable);             // 784
    depsCancelled = false;                                                                                            // 786
                                                                                                                      //
    if (cancelIds.length > 0) {                                                                                       // 787
      depsCancelled = this._DDPMethod_jobCancel(cancelIds, options);                                                  // 788
    }                                                                                                                 // 1184
                                                                                                                      //
    if (num > 0 || depsCancelled) {                                                                                   // 790
      return true;                                                                                                    // 791
    } else {                                                                                                          // 790
      console.warn("jobCancel failed");                                                                               // 793
    }                                                                                                                 // 1189
                                                                                                                      //
    return false;                                                                                                     // 794
  };                                                                                                                  // 744
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobRestart = function (ids, options) {                                       // 1193
    var depsRestarted, logObj, mods, num, query, restartIds, time;                                                    // 797
    check(ids, Match.OneOf(Match.Where(_validId), [Match.Where(_validId)]));                                          // 797
    check(options, Match.Optional({                                                                                   // 798
      retries: Match.Optional(Match.Where(_validIntGTEZero)),                                                         // 799
      until: Match.Optional(Date),                                                                                    // 800
      antecedents: Match.Optional(Boolean),                                                                           // 801
      dependents: Match.Optional(Boolean)                                                                             // 802
    }));                                                                                                              // 799
                                                                                                                      //
    if (options == null) {                                                                                            // 1202
      options = {};                                                                                                   // 803
    }                                                                                                                 // 1204
                                                                                                                      //
    if (options.retries == null) {                                                                                    // 1205
      options.retries = 1;                                                                                            // 804
    }                                                                                                                 // 1207
                                                                                                                      //
    if (options.retries > this.forever) {                                                                             // 805
      options.retries = this.forever;                                                                                 // 805
    }                                                                                                                 // 1210
                                                                                                                      //
    if (options.dependents == null) {                                                                                 // 1211
      options.dependents = false;                                                                                     // 806
    }                                                                                                                 // 1213
                                                                                                                      //
    if (options.antecedents == null) {                                                                                // 1214
      options.antecedents = true;                                                                                     // 807
    }                                                                                                                 // 1216
                                                                                                                      //
    if (_validId(ids)) {                                                                                              // 808
      ids = [ids];                                                                                                    // 809
    }                                                                                                                 // 1219
                                                                                                                      //
    if (ids.length === 0) {                                                                                           // 810
      return false;                                                                                                   // 810
    }                                                                                                                 // 1222
                                                                                                                      //
    time = new Date();                                                                                                // 811
    query = {                                                                                                         // 813
      _id: {                                                                                                          // 814
        $in: ids                                                                                                      // 815
      },                                                                                                              // 815
      status: {                                                                                                       // 816
        $in: this.jobStatusRestartable                                                                                // 817
      }                                                                                                               // 817
    };                                                                                                                // 814
    mods = {                                                                                                          // 819
      $set: {                                                                                                         // 820
        status: "waiting",                                                                                            // 821
        progress: {                                                                                                   // 822
          completed: 0,                                                                                               // 823
          total: 1,                                                                                                   // 824
          percent: 0                                                                                                  // 825
        },                                                                                                            // 823
        updated: time                                                                                                 // 826
      },                                                                                                              // 821
      $inc: {                                                                                                         // 827
        retries: options.retries                                                                                      // 828
      }                                                                                                               // 828
    };                                                                                                                // 820
                                                                                                                      //
    if (logObj = this._logMessage.restarted()) {                                                                      // 830
      mods.$push = {                                                                                                  // 831
        log: logObj                                                                                                   // 832
      };                                                                                                              // 832
    }                                                                                                                 // 1250
                                                                                                                      //
    if (options.until != null) {                                                                                      // 834
      mods.$set.retryUntil = options.until;                                                                           // 835
    }                                                                                                                 // 1253
                                                                                                                      //
    num = this.update(query, mods, {                                                                                  // 837
      multi: true                                                                                                     // 837
    });                                                                                                               // 837
    restartIds = this._idsOfDeps(ids, options.antecedents, options.dependents, this.jobStatusRestartable);            // 840
    depsRestarted = false;                                                                                            // 842
                                                                                                                      //
    if (restartIds.length > 0) {                                                                                      // 843
      depsRestarted = this._DDPMethod_jobRestart(restartIds, options);                                                // 844
    }                                                                                                                 // 1261
                                                                                                                      //
    if (num > 0 || depsRestarted) {                                                                                   // 846
      this._DDPMethod_jobReady(ids);                                                                                  // 847
                                                                                                                      //
      return true;                                                                                                    // 848
    } else {                                                                                                          // 846
      console.warn("jobRestart failed");                                                                              // 850
    }                                                                                                                 // 1267
                                                                                                                      //
    return false;                                                                                                     // 851
  };                                                                                                                  // 796
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobSave = function (doc, options) {                                          // 1271
    var logObj, mods, next, nextDate, num, ref, schedule, time;                                                       // 856
    check(doc, _validJobDoc());                                                                                       // 856
    check(options, Match.Optional({                                                                                   // 857
      cancelRepeats: Match.Optional(Boolean)                                                                          // 858
    }));                                                                                                              // 858
    check(doc.status, Match.Where(function (v) {                                                                      // 859
      return Match.test(v, String) && (v === 'waiting' || v === 'paused');                                            // 1278
    }));                                                                                                              // 859
                                                                                                                      //
    if (options == null) {                                                                                            // 1280
      options = {};                                                                                                   // 861
    }                                                                                                                 // 1282
                                                                                                                      //
    if (options.cancelRepeats == null) {                                                                              // 1283
      options.cancelRepeats = false;                                                                                  // 862
    }                                                                                                                 // 1285
                                                                                                                      //
    if (doc.repeats > this.forever) {                                                                                 // 863
      doc.repeats = this.forever;                                                                                     // 863
    }                                                                                                                 // 1288
                                                                                                                      //
    if (doc.retries > this.forever) {                                                                                 // 864
      doc.retries = this.forever;                                                                                     // 864
    }                                                                                                                 // 1291
                                                                                                                      //
    time = new Date();                                                                                                // 866
                                                                                                                      //
    if (doc.after < time) {                                                                                           // 870
      doc.after = time;                                                                                               // 870
    }                                                                                                                 // 1295
                                                                                                                      //
    if (doc.retryUntil < time) {                                                                                      // 871
      doc.retryUntil = time;                                                                                          // 871
    }                                                                                                                 // 1298
                                                                                                                      //
    if (doc.repeatUntil < time) {                                                                                     // 872
      doc.repeatUntil = time;                                                                                         // 872
    }                                                                                                                 // 1301
                                                                                                                      //
    if (this.later != null && typeof doc.repeatWait !== 'number') {                                                   // 876
      schedule = (ref = this.later) != null ? ref.schedule(doc.repeatWait) : void 0;                                  // 879
                                                                                                                      //
      if (!(schedule && (next = schedule.next(2, schedule.prev(1, doc.after))[1]))) {                                 // 880
        console.warn("No valid available later.js times in schedule after " + doc.after);                             // 881
        return null;                                                                                                  // 882
      }                                                                                                               // 1307
                                                                                                                      //
      nextDate = new Date(next);                                                                                      // 883
                                                                                                                      //
      if (!(nextDate <= doc.repeatUntil)) {                                                                           // 884
        console.warn("No valid available later.js times in schedule before " + doc.repeatUntil);                      // 885
        return null;                                                                                                  // 886
      }                                                                                                               // 1312
                                                                                                                      //
      doc.after = nextDate;                                                                                           // 887
    } else if (this.later == null && doc.repeatWait !== 'number') {                                                   // 876
      console.warn("Later.js not loaded...");                                                                         // 889
      return null;                                                                                                    // 890
    }                                                                                                                 // 1317
                                                                                                                      //
    if (doc._id) {                                                                                                    // 892
      mods = {                                                                                                        // 894
        $set: {                                                                                                       // 895
          status: 'waiting',                                                                                          // 896
          data: doc.data,                                                                                             // 897
          retries: doc.retries,                                                                                       // 898
          repeatRetries: doc.repeatRetries != null ? doc.repeatRetries : doc.retries + doc.retried,                   // 899
          retryUntil: doc.retryUntil,                                                                                 // 900
          retryWait: doc.retryWait,                                                                                   // 901
          retryBackoff: doc.retryBackoff,                                                                             // 902
          repeats: doc.repeats,                                                                                       // 903
          repeatUntil: doc.repeatUntil,                                                                               // 904
          repeatWait: doc.repeatWait,                                                                                 // 905
          depends: doc.depends,                                                                                       // 906
          priority: doc.priority,                                                                                     // 907
          after: doc.after,                                                                                           // 908
          updated: time                                                                                               // 909
        }                                                                                                             // 896
      };                                                                                                              // 895
                                                                                                                      //
      if (logObj = this._logMessage.resubmitted()) {                                                                  // 911
        mods.$push = {                                                                                                // 912
          log: logObj                                                                                                 // 913
        };                                                                                                            // 913
      }                                                                                                               // 1341
                                                                                                                      //
      num = this.update({                                                                                             // 915
        _id: doc._id,                                                                                                 // 917
        status: 'paused',                                                                                             // 918
        runId: null                                                                                                   // 919
      }, mods);                                                                                                       // 916
                                                                                                                      //
      if (num && this._checkDeps(doc, false)) {                                                                       // 924
        this._DDPMethod_jobReady(doc._id);                                                                            // 925
                                                                                                                      //
        return doc._id;                                                                                               // 926
      } else {                                                                                                        // 924
        return null;                                                                                                  // 928
      }                                                                                                               // 892
    } else {                                                                                                          // 892
      if (doc.repeats === this.forever && options.cancelRepeats) {                                                    // 930
        this.find({                                                                                                   // 932
          type: doc.type,                                                                                             // 934
          status: {                                                                                                   // 935
            $in: this.jobStatusCancellable                                                                            // 936
          }                                                                                                           // 936
        }, {                                                                                                          // 933
          transform: null                                                                                             // 939
        }).forEach(function (_this) {                                                                                 // 938
          return function (d) {                                                                                       // 1363
            return _this._DDPMethod_jobCancel(d._id, {});                                                             // 1364
          };                                                                                                          // 941
        }(this));                                                                                                     // 941
      }                                                                                                               // 1367
                                                                                                                      //
      doc.created = time;                                                                                             // 942
      doc.log.push(this._logMessage.submitted());                                                                     // 943
      doc._id = this.insert(doc);                                                                                     // 944
                                                                                                                      //
      if (doc._id && this._checkDeps(doc, false)) {                                                                   // 945
        this._DDPMethod_jobReady(doc._id);                                                                            // 946
                                                                                                                      //
        return doc._id;                                                                                               // 947
      } else {                                                                                                        // 945
        return null;                                                                                                  // 949
      }                                                                                                               // 892
    }                                                                                                                 // 1377
  };                                                                                                                  // 855
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobProgress = function (id, runId, completed, total, options) {              // 1380
    var job, mods, num, progress, time;                                                                               // 954
    check(id, Match.Where(_validId));                                                                                 // 954
    check(runId, Match.Where(_validId));                                                                              // 955
    check(completed, Match.Where(_validNumGTEZero));                                                                  // 956
    check(total, Match.Where(_validNumGTZero));                                                                       // 957
    check(options, Match.Optional({}));                                                                               // 958
                                                                                                                      //
    if (options == null) {                                                                                            // 1387
      options = {};                                                                                                   // 959
    }                                                                                                                 // 1389
                                                                                                                      //
    if (this.stopped) {                                                                                               // 962
      return null;                                                                                                    // 963
    }                                                                                                                 // 1392
                                                                                                                      //
    progress = {                                                                                                      // 965
      completed: completed,                                                                                           // 966
      total: total,                                                                                                   // 967
      percent: 100 * completed / total                                                                                // 968
    };                                                                                                                // 966
    check(progress, Match.Where(function (v) {                                                                        // 970
      var ref;                                                                                                        // 971
      return v.total >= v.completed && 0 <= (ref = v.percent) && ref <= 100;                                          // 1400
    }));                                                                                                              // 970
    time = new Date();                                                                                                // 973
    job = this.findOne({                                                                                              // 975
      _id: id                                                                                                         // 975
    }, {                                                                                                              // 975
      fields: {                                                                                                       // 975
        workTimeout: 1                                                                                                // 975
      }                                                                                                               // 975
    });                                                                                                               // 975
    mods = {                                                                                                          // 977
      $set: {                                                                                                         // 978
        progress: progress,                                                                                           // 979
        updated: time                                                                                                 // 980
      }                                                                                                               // 979
    };                                                                                                                // 978
                                                                                                                      //
    if ((job != null ? job.workTimeout : void 0) != null) {                                                           // 982
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);                                            // 983
    }                                                                                                                 // 1418
                                                                                                                      //
    num = this.update({                                                                                               // 985
      _id: id,                                                                                                        // 987
      runId: runId,                                                                                                   // 988
      status: "running"                                                                                               // 989
    }, mods);                                                                                                         // 986
                                                                                                                      //
    if (num === 1) {                                                                                                  // 994
      return true;                                                                                                    // 995
    } else {                                                                                                          // 994
      console.warn("jobProgress failed");                                                                             // 997
    }                                                                                                                 // 1428
                                                                                                                      //
    return false;                                                                                                     // 998
  };                                                                                                                  // 953
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobLog = function (id, runId, message, options) {                            // 1432
    var job, logObj, mods, num, ref, time;                                                                            // 1001
    check(id, Match.Where(_validId));                                                                                 // 1001
    check(runId, Match.OneOf(Match.Where(_validId), null));                                                           // 1002
    check(message, String);                                                                                           // 1003
    check(options, Match.Optional({                                                                                   // 1004
      level: Match.Optional(Match.Where(_validLogLevel)),                                                             // 1005
      data: Match.Optional(Object)                                                                                    // 1006
    }));                                                                                                              // 1005
                                                                                                                      //
    if (options == null) {                                                                                            // 1441
      options = {};                                                                                                   // 1007
    }                                                                                                                 // 1443
                                                                                                                      //
    time = new Date();                                                                                                // 1008
    logObj = {                                                                                                        // 1009
      time: time,                                                                                                     // 1010
      runId: runId,                                                                                                   // 1011
      level: (ref = options.level) != null ? ref : 'info',                                                            // 1012
      message: message                                                                                                // 1013
    };                                                                                                                // 1010
                                                                                                                      //
    if (options.data != null) {                                                                                       // 1014
      logObj.data = options.data;                                                                                     // 1014
    }                                                                                                                 // 1453
                                                                                                                      //
    job = this.findOne({                                                                                              // 1016
      _id: id                                                                                                         // 1016
    }, {                                                                                                              // 1016
      fields: {                                                                                                       // 1016
        status: 1,                                                                                                    // 1016
        workTimeout: 1                                                                                                // 1016
      }                                                                                                               // 1016
    });                                                                                                               // 1016
    mods = {                                                                                                          // 1018
      $push: {                                                                                                        // 1019
        log: logObj                                                                                                   // 1020
      },                                                                                                              // 1020
      $set: {                                                                                                         // 1021
        updated: time                                                                                                 // 1022
      }                                                                                                               // 1022
    };                                                                                                                // 1019
                                                                                                                      //
    if ((job != null ? job.workTimeout : void 0) != null && job.status === 'running') {                               // 1024
      mods.$set.expiresAfter = new Date(time.valueOf() + job.workTimeout);                                            // 1025
    }                                                                                                                 // 1472
                                                                                                                      //
    num = this.update({                                                                                               // 1027
      _id: id                                                                                                         // 1029
    }, mods);                                                                                                         // 1028
                                                                                                                      //
    if (num === 1) {                                                                                                  // 1033
      return true;                                                                                                    // 1034
    } else {                                                                                                          // 1033
      console.warn("jobLog failed");                                                                                  // 1036
    }                                                                                                                 // 1480
                                                                                                                      //
    return false;                                                                                                     // 1037
  };                                                                                                                  // 1000
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobRerun = function (id, options) {                                          // 1484
    var doc;                                                                                                          // 1040
    check(id, Match.Where(_validId));                                                                                 // 1040
    check(options, Match.Optional({                                                                                   // 1041
      repeats: Match.Optional(Match.Where(_validIntGTEZero)),                                                         // 1042
      until: Match.Optional(Date),                                                                                    // 1043
      wait: Match.OneOf(Match.Where(_validIntGTEZero), Match.Where(_validLaterJSObj))                                 // 1044
    }));                                                                                                              // 1042
    doc = this.findOne({                                                                                              // 1046
      _id: id,                                                                                                        // 1048
      status: "completed"                                                                                             // 1049
    }, {                                                                                                              // 1047
      fields: {                                                                                                       // 1052
        result: 0,                                                                                                    // 1053
        failures: 0,                                                                                                  // 1054
        log: 0,                                                                                                       // 1055
        progress: 0,                                                                                                  // 1056
        updated: 0,                                                                                                   // 1057
        after: 0,                                                                                                     // 1058
        status: 0                                                                                                     // 1059
      },                                                                                                              // 1053
      transform: null                                                                                                 // 1060
    });                                                                                                               // 1051
                                                                                                                      //
    if (doc != null) {                                                                                                // 1064
      if (options == null) {                                                                                          // 1508
        options = {};                                                                                                 // 1065
      }                                                                                                               // 1510
                                                                                                                      //
      if (options.repeats == null) {                                                                                  // 1511
        options.repeats = 0;                                                                                          // 1066
      }                                                                                                               // 1513
                                                                                                                      //
      if (options.repeats > this.forever) {                                                                           // 1067
        options.repeats = this.forever;                                                                               // 1067
      }                                                                                                               // 1516
                                                                                                                      //
      if (options.until == null) {                                                                                    // 1517
        options.until = doc.repeatUntil;                                                                              // 1068
      }                                                                                                               // 1519
                                                                                                                      //
      if (options.wait == null) {                                                                                     // 1520
        options.wait = 0;                                                                                             // 1069
      }                                                                                                               // 1522
                                                                                                                      //
      return this._rerun_job(doc, options.repeats, options.wait, options.until);                                      // 1070
    }                                                                                                                 // 1524
                                                                                                                      //
    return false;                                                                                                     // 1072
  };                                                                                                                  // 1039
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobDone = function (id, runId, result, options) {                            // 1528
    var after, d, doc, ids, jobId, logObj, mods, n, next, num, ref, time, wait;                                       // 1075
    check(id, Match.Where(_validId));                                                                                 // 1075
    check(runId, Match.Where(_validId));                                                                              // 1076
    check(result, Object);                                                                                            // 1077
    check(options, Match.Optional({                                                                                   // 1078
      repeatId: Match.Optional(Boolean),                                                                              // 1079
      delayDeps: Match.Optional(Match.Where(_validIntGTEZero))                                                        // 1080
    }));                                                                                                              // 1079
                                                                                                                      //
    if (options == null) {                                                                                            // 1537
      options = {                                                                                                     // 1082
        repeatId: false                                                                                               // 1082
      };                                                                                                              // 1082
    }                                                                                                                 // 1541
                                                                                                                      //
    time = new Date();                                                                                                // 1083
    doc = this.findOne({                                                                                              // 1084
      _id: id,                                                                                                        // 1086
      runId: runId,                                                                                                   // 1087
      status: "running"                                                                                               // 1088
    }, {                                                                                                              // 1085
      fields: {                                                                                                       // 1091
        log: 0,                                                                                                       // 1092
        failures: 0,                                                                                                  // 1093
        updated: 0,                                                                                                   // 1094
        after: 0,                                                                                                     // 1095
        status: 0                                                                                                     // 1096
      },                                                                                                              // 1092
      transform: null                                                                                                 // 1097
    });                                                                                                               // 1090
                                                                                                                      //
    if (doc == null) {                                                                                                // 1100
      if (!this.isSimulation) {                                                                                       // 1101
        console.warn("Running job not found", id, runId);                                                             // 1102
      }                                                                                                               // 1560
                                                                                                                      //
      return false;                                                                                                   // 1103
    }                                                                                                                 // 1562
                                                                                                                      //
    mods = {                                                                                                          // 1105
      $set: {                                                                                                         // 1106
        status: "completed",                                                                                          // 1107
        result: result,                                                                                               // 1108
        progress: {                                                                                                   // 1109
          completed: doc.progress.total || 1,                                                                         // 1110
          total: doc.progress.total || 1,                                                                             // 1111
          percent: 100                                                                                                // 1112
        },                                                                                                            // 1110
        updated: time                                                                                                 // 1113
      }                                                                                                               // 1107
    };                                                                                                                // 1106
                                                                                                                      //
    if (logObj = this._logMessage.completed(runId)) {                                                                 // 1115
      mods.$push = {                                                                                                  // 1116
        log: logObj                                                                                                   // 1117
      };                                                                                                              // 1117
    }                                                                                                                 // 1579
                                                                                                                      //
    num = this.update({                                                                                               // 1119
      _id: id,                                                                                                        // 1121
      runId: runId,                                                                                                   // 1122
      status: "running"                                                                                               // 1123
    }, mods);                                                                                                         // 1120
                                                                                                                      //
    if (num === 1) {                                                                                                  // 1127
      if (doc.repeats > 0) {                                                                                          // 1128
        if (typeof doc.repeatWait === 'number') {                                                                     // 1129
          if (doc.repeatUntil - doc.repeatWait >= time) {                                                             // 1130
            jobId = this._rerun_job(doc);                                                                             // 1131
          }                                                                                                           // 1129
        } else {                                                                                                      // 1129
          next = (ref = this.later) != null ? ref.schedule(doc.repeatWait).next(2) : void 0;                          // 1135
                                                                                                                      //
          if (next && next.length > 0) {                                                                              // 1136
            d = new Date(next[0]);                                                                                    // 1137
                                                                                                                      //
            if (d - time > 500 || next.length > 1) {                                                                  // 1138
              if (d - time <= 500) {                                                                                  // 1139
                d = new Date(next[1]);                                                                                // 1140
              }                                                                                                       // 1598
                                                                                                                      //
              wait = d - time;                                                                                        // 1141
                                                                                                                      //
              if (doc.repeatUntil - wait >= time) {                                                                   // 1142
                jobId = this._rerun_job(doc, doc.repeats - 1, wait);                                                  // 1143
              }                                                                                                       // 1138
            }                                                                                                         // 1136
          }                                                                                                           // 1129
        }                                                                                                             // 1128
      }                                                                                                               // 1606
                                                                                                                      //
      ids = this.find({                                                                                               // 1146
        depends: {                                                                                                    // 1148
          $all: [id]                                                                                                  // 1149
        }                                                                                                             // 1149
      }, {                                                                                                            // 1147
        transform: null,                                                                                              // 1152
        fields: {                                                                                                     // 1153
          _id: 1                                                                                                      // 1154
        }                                                                                                             // 1154
      }).fetch().map(function (_this) {                                                                               // 1151
        return function (d) {                                                                                         // 1617
          return d._id;                                                                                               // 1618
        };                                                                                                            // 1156
      }(this));                                                                                                       // 1156
                                                                                                                      //
      if (ids.length > 0) {                                                                                           // 1158
        mods = {                                                                                                      // 1160
          $pull: {                                                                                                    // 1161
            depends: id                                                                                               // 1162
          },                                                                                                          // 1162
          $push: {                                                                                                    // 1163
            resolved: id                                                                                              // 1164
          }                                                                                                           // 1164
        };                                                                                                            // 1161
                                                                                                                      //
        if (options.delayDeps != null) {                                                                              // 1166
          after = new Date(time.valueOf() + options.delayDeps);                                                       // 1167
          mods.$max = {                                                                                               // 1168
            after: after                                                                                              // 1169
          };                                                                                                          // 1169
        }                                                                                                             // 1635
                                                                                                                      //
        if (logObj = this._logMessage.resolved(id, runId)) {                                                          // 1171
          mods.$push.log = logObj;                                                                                    // 1172
        }                                                                                                             // 1638
                                                                                                                      //
        n = this.update({                                                                                             // 1174
          _id: {                                                                                                      // 1176
            $in: ids                                                                                                  // 1177
          }                                                                                                           // 1177
        }, mods, {                                                                                                    // 1175
          multi: true                                                                                                 // 1181
        });                                                                                                           // 1180
                                                                                                                      //
        if (n !== ids.length) {                                                                                       // 1184
          console.warn("Not all dependent jobs were resolved " + ids.length + " > " + n);                             // 1185
        }                                                                                                             // 1648
                                                                                                                      //
        this._DDPMethod_jobReady(ids);                                                                                // 1187
      }                                                                                                               // 1650
                                                                                                                      //
      if (options.repeatId && jobId != null) {                                                                        // 1188
        return jobId;                                                                                                 // 1189
      } else {                                                                                                        // 1188
        return true;                                                                                                  // 1191
      }                                                                                                               // 1127
    } else {                                                                                                          // 1127
      console.warn("jobDone failed");                                                                                 // 1193
    }                                                                                                                 // 1658
                                                                                                                      //
    return false;                                                                                                     // 1194
  };                                                                                                                  // 1074
                                                                                                                      //
  JobCollectionBase.prototype._DDPMethod_jobFail = function (id, runId, err, options) {                               // 1662
    var after, doc, logObj, mods, newStatus, num, time;                                                               // 1197
    check(id, Match.Where(_validId));                                                                                 // 1197
    check(runId, Match.Where(_validId));                                                                              // 1198
    check(err, Object);                                                                                               // 1199
    check(options, Match.Optional({                                                                                   // 1200
      fatal: Match.Optional(Boolean)                                                                                  // 1201
    }));                                                                                                              // 1201
                                                                                                                      //
    if (options == null) {                                                                                            // 1670
      options = {};                                                                                                   // 1203
    }                                                                                                                 // 1672
                                                                                                                      //
    if (options.fatal == null) {                                                                                      // 1673
      options.fatal = false;                                                                                          // 1204
    }                                                                                                                 // 1675
                                                                                                                      //
    time = new Date();                                                                                                // 1206
    doc = this.findOne({                                                                                              // 1207
      _id: id,                                                                                                        // 1209
      runId: runId,                                                                                                   // 1210
      status: "running"                                                                                               // 1211
    }, {                                                                                                              // 1208
      fields: {                                                                                                       // 1214
        log: 0,                                                                                                       // 1215
        failures: 0,                                                                                                  // 1216
        progress: 0,                                                                                                  // 1217
        updated: 0,                                                                                                   // 1218
        after: 0,                                                                                                     // 1219
        runId: 0,                                                                                                     // 1220
        status: 0                                                                                                     // 1221
      },                                                                                                              // 1215
      transform: null                                                                                                 // 1222
    });                                                                                                               // 1213
                                                                                                                      //
    if (doc == null) {                                                                                                // 1225
      if (!this.isSimulation) {                                                                                       // 1226
        console.warn("Running job not found", id, runId);                                                             // 1227
      }                                                                                                               // 1696
                                                                                                                      //
      return false;                                                                                                   // 1228
    }                                                                                                                 // 1698
                                                                                                                      //
    after = function () {                                                                                             // 1230
      switch (doc.retryBackoff) {                                                                                     // 1230
        case 'exponential':                                                                                           // 1230
          return new Date(time.valueOf() + doc.retryWait * Math.pow(2, doc.retried - 1));                             // 1702
                                                                                                                      //
        default:                                                                                                      // 1230
          return new Date(time.valueOf() + doc.retryWait);                                                            // 1704
      }                                                                                                               // 1230
    }();                                                                                                              // 1706
                                                                                                                      //
    newStatus = !options.fatal && doc.retries > 0 && doc.retryUntil >= after ? "waiting" : "failed";                  // 1236
    err.runId = runId;                                                                                                // 1240
    mods = {                                                                                                          // 1242
      $set: {                                                                                                         // 1243
        status: newStatus,                                                                                            // 1244
        runId: null,                                                                                                  // 1245
        after: after,                                                                                                 // 1246
        updated: time                                                                                                 // 1247
      },                                                                                                              // 1244
      $push: {                                                                                                        // 1248
        failures: err                                                                                                 // 1249
      }                                                                                                               // 1249
    };                                                                                                                // 1243
                                                                                                                      //
    if (logObj = this._logMessage.failed(runId, newStatus === 'failed', err)) {                                       // 1252
      mods.$push.log = logObj;                                                                                        // 1253
    }                                                                                                                 // 1722
                                                                                                                      //
    num = this.update({                                                                                               // 1255
      _id: id,                                                                                                        // 1257
      runId: runId,                                                                                                   // 1258
      status: "running"                                                                                               // 1259
    }, mods);                                                                                                         // 1256
                                                                                                                      //
    if (newStatus === "failed" && num === 1) {                                                                        // 1263
      this.find({                                                                                                     // 1265
        depends: {                                                                                                    // 1267
          $all: [id]                                                                                                  // 1268
        }                                                                                                             // 1268
      }, {                                                                                                            // 1266
        transform: null                                                                                               // 1271
      }).forEach(function (_this) {                                                                                   // 1270
        return function (d) {                                                                                         // 1736
          return _this._DDPMethod_jobCancel(d._id);                                                                   // 1737
        };                                                                                                            // 1273
      }(this));                                                                                                       // 1273
    }                                                                                                                 // 1740
                                                                                                                      //
    if (num === 1) {                                                                                                  // 1274
      return true;                                                                                                    // 1275
    } else {                                                                                                          // 1274
      console.warn("jobFail failed");                                                                                 // 1277
    }                                                                                                                 // 1745
                                                                                                                      //
    return false;                                                                                                     // 1278
  };                                                                                                                  // 1196
                                                                                                                      //
  return JobCollectionBase;                                                                                           // 1749
}(Mongo.Collection);                                                                                                  // 1751
                                                                                                                      //
share.JobCollectionBase = JobCollectionBase;                                                                          // 1282
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/vsivsi_job-collection/src/client.coffee                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var bind = function (fn, me) {                                                                                        // 7
  return function () {                                                                                                // 7
    return fn.apply(me, arguments);                                                                                   // 7
  };                                                                                                                  // 7
},                                                                                                                    // 7
    extend = function (child, parent) {                                                                               // 7
  for (var key in meteorBabelHelpers.sanitizeForInObject(parent)) {                                                   // 3
    if (hasProp.call(parent, key)) child[key] = parent[key];                                                          // 3
  }                                                                                                                   // 3
                                                                                                                      //
  function ctor() {                                                                                                   // 3
    this.constructor = child;                                                                                         // 3
  }                                                                                                                   // 3
                                                                                                                      //
  ctor.prototype = parent.prototype;                                                                                  // 3
  child.prototype = new ctor();                                                                                       // 3
  child.__super__ = parent.prototype;                                                                                 // 3
  return child;                                                                                                       // 3
},                                                                                                                    // 3
    hasProp = {}.hasOwnProperty;                                                                                      // 7
                                                                                                                      //
if (Meteor.isClient) {                                                                                                // 7
  if (!Function.prototype.bind) {                                                                                     // 10
    Function.prototype.bind = function (oThis) {                                                                      // 11
      var aArgs, fBound, fNOP, fToBind;                                                                               // 12
                                                                                                                      //
      if (typeof this !== "function") {                                                                               // 12
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");                  // 14
      }                                                                                                               // 12
                                                                                                                      //
      aArgs = Array.prototype.slice.call(arguments, 1);                                                               // 16
      fToBind = this;                                                                                                 // 17
                                                                                                                      //
      fNOP = function () {};                                                                                          // 18
                                                                                                                      //
      fBound = function () {                                                                                          // 19
        var func;                                                                                                     // 20
        func = this instanceof fNOP && oThis ? this : oThis;                                                          // 20
        return fToBind.apply(func, aArgs.concat(Array.prototype.slice.call(arguments)));                              // 21
      };                                                                                                              // 19
                                                                                                                      //
      fNOP.prototype = this.prototype;                                                                                // 23
      fBound.prototype = new fNOP();                                                                                  // 24
      return fBound;                                                                                                  // 25
    };                                                                                                                // 11
  }                                                                                                                   // 25
                                                                                                                      //
  JobCollection = function (superClass) {                                                                             // 30
    extend(JobCollection, superClass);                                                                                // 27
                                                                                                                      //
    function JobCollection(root, options) {                                                                           // 32
      if (root == null) {                                                                                             // 30
        root = 'queue';                                                                                               // 32
      }                                                                                                               // 32
                                                                                                                      //
      if (options == null) {                                                                                          // 33
        options = {};                                                                                                 // 32
      }                                                                                                               // 35
                                                                                                                      //
      this._toLog = bind(this._toLog, this);                                                                          // 36
                                                                                                                      //
      if (!(this instanceof JobCollection)) {                                                                         // 33
        return new JobCollection(root, options);                                                                      // 34
      }                                                                                                               // 39
                                                                                                                      //
      JobCollection.__super__.constructor.call(this, root, options);                                                  // 37
                                                                                                                      //
      this.logConsole = false;                                                                                        // 39
      this.isSimulation = true;                                                                                       // 40
                                                                                                                      //
      if (options.connection == null) {                                                                               // 42
        Meteor.methods(this._generateMethods());                                                                      // 43
      } else {                                                                                                        // 42
        options.connection.methods(this._generateMethods());                                                          // 45
      }                                                                                                               // 47
    }                                                                                                                 // 32
                                                                                                                      //
    JobCollection.prototype._toLog = function (userId, method, message) {                                             // 50
      if (this.logConsole) {                                                                                          // 48
        return console.log(new Date() + ", " + userId + ", " + method + ", " + message + "\n");                       // 52
      }                                                                                                               // 53
    };                                                                                                                // 47
                                                                                                                      //
    return JobCollection;                                                                                             // 56
  }(share.JobCollectionBase);                                                                                         // 58
}                                                                                                                     // 59
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['vsivsi:job-collection'] = {}, {
  Job: Job,
  JobCollection: JobCollection
});

})();
