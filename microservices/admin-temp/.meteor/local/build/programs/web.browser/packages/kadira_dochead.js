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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var npmLoadScript, DocHead;

var require = meteorInstall({"node_modules":{"meteor":{"kadira:dochead":{"main.js":function(require){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/kadira_dochead/main.js                                                                           //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
npmLoadScript = require('load-script');                                                                      // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"both.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/kadira_dochead/lib/both.js                                                                       //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
var FlowRouter = null;                                                                                       // 1
                                                                                                             //
if (Package['kadira:flow-router-ssr']) {                                                                     // 2
  FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter;                                                 // 3
}                                                                                                            // 4
                                                                                                             //
if (Meteor.isClient) {                                                                                       // 6
  var titleDependency = new Tracker.Dependency();                                                            // 7
}                                                                                                            // 8
                                                                                                             //
DocHead = {                                                                                                  // 10
  currentTitle: null,                                                                                        // 11
  setTitle: function (title) {                                                                               // 12
    if (Meteor.isClient) {                                                                                   // 13
      titleDependency.changed();                                                                             // 14
      document.title = title;                                                                                // 15
    } else {                                                                                                 // 16
      this.currentTitle = title;                                                                             // 17
      var titleHtml = "<title>" + title + "</title>";                                                        // 18
                                                                                                             //
      this._addToHead(titleHtml);                                                                            // 19
    }                                                                                                        // 20
  },                                                                                                         // 21
  addMeta: function (info) {                                                                                 // 22
    this._addTag(info, 'meta');                                                                              // 23
  },                                                                                                         // 24
  addLink: function (info) {                                                                                 // 25
    this._addTag(info, 'link');                                                                              // 26
  },                                                                                                         // 27
  getTitle: function () {                                                                                    // 28
    if (Meteor.isClient) {                                                                                   // 29
      titleDependency.depend();                                                                              // 30
      return document.title;                                                                                 // 31
    }                                                                                                        // 32
                                                                                                             //
    return this.currentTitle;                                                                                // 33
  },                                                                                                         // 34
  addLdJsonScript: function (jsonObj) {                                                                      // 35
    var strObj = JSON.stringify(jsonObj);                                                                    // 36
                                                                                                             //
    this._addLdJsonScript(strObj);                                                                           // 37
  },                                                                                                         // 38
  loadScript: function (url, options, callback) {                                                            // 39
    if (Meteor.isClient) {                                                                                   // 40
      npmLoadScript(url, options, callback);                                                                 // 41
    }                                                                                                        // 42
  },                                                                                                         // 43
  _addTag: function (info, tag) {                                                                            // 44
    var meta = this._buildTag(info, tag);                                                                    // 45
                                                                                                             //
    if (Meteor.isClient) {                                                                                   // 46
      document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', meta);                        // 47
    } else {                                                                                                 // 48
      this._addToHead(meta);                                                                                 // 49
    }                                                                                                        // 50
  },                                                                                                         // 51
  _addToHead: function (html) {                                                                              // 52
    // only work there is kadira:flow-router-ssr                                                             // 53
    if (!FlowRouter) {                                                                                       // 54
      return;                                                                                                // 55
    }                                                                                                        // 56
                                                                                                             //
    var ssrContext = FlowRouter.ssrContext.get();                                                            // 57
                                                                                                             //
    if (ssrContext) {                                                                                        // 58
      ssrContext.addToHead(html);                                                                            // 59
    }                                                                                                        // 60
  },                                                                                                         // 61
  _buildTag: function (metaInfo, type) {                                                                     // 62
    var props = "";                                                                                          // 63
                                                                                                             //
    for (var key in meteorBabelHelpers.sanitizeForInObject(metaInfo)) {                                      // 64
      props += key + "=\"" + metaInfo[key] + "\" ";                                                          // 65
    }                                                                                                        // 66
                                                                                                             //
    props += 'dochead="1"';                                                                                  // 67
    var meta = "<" + type + " " + props + "/>";                                                              // 68
    return meta;                                                                                             // 69
  },                                                                                                         // 70
  _addLdJsonScript: function (stringifiedObject) {                                                           // 71
    var scriptTag = "<script type=\"application/ld+json\" dochead=\"1\">" + stringifiedObject + "</script>";
                                                                                                             //
    if (Meteor.isClient) {                                                                                   // 73
      document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', scriptTag);                   // 74
    } else {                                                                                                 // 75
      this._addToHead(scriptTag);                                                                            // 76
    }                                                                                                        // 77
  },                                                                                                         // 78
  removeDocHeadAddedTags: function () {                                                                      // 79
    if (Meteor.isClient) {                                                                                   // 80
      var elements = document.querySelectorAll('[dochead="1"]'); // We use for-of here to loop only over iterable objects
                                                                                                             //
      for (var _iterator = elements, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;                                                                                            // 83
                                                                                                             //
        if (_isArray) {                                                                                      // 83
          if (_i >= _iterator.length) break;                                                                 // 83
          _ref = _iterator[_i++];                                                                            // 83
        } else {                                                                                             // 83
          _i = _iterator.next();                                                                             // 83
          if (_i.done) break;                                                                                // 83
          _ref = _i.value;                                                                                   // 83
        }                                                                                                    // 83
                                                                                                             //
        var element = _ref;                                                                                  // 83
        element.parentNode.removeChild(element);                                                             // 84
      }                                                                                                      // 85
    }                                                                                                        // 86
  }                                                                                                          // 87
};                                                                                                           // 10
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"flow_router.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// packages/kadira_dochead/lib/flow_router.js                                                                //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
if (Package['kadira:flow-router-ssr']) {                                                                     // 1
  var FlowRouter = Package['kadira:flow-router-ssr'].FlowRouter; // remove added tags when changing routes   // 2
                                                                                                             //
  FlowRouter.triggers.enter(function () {                                                                    // 4
    Meteor.startup(DocHead.removeDocHeadAddedTags);                                                          // 5
  });                                                                                                        // 6
}                                                                                                            // 7
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"node_modules":{"load-script":{"index.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                           //
// node_modules/meteor/kadira_dochead/node_modules/load-script/index.js                                      //
//                                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                             //
                                                                                                             // 1
module.exports = function load (src, opts, cb) {                                                             // 2
  var head = document.head || document.getElementsByTagName('head')[0]                                       // 3
  var script = document.createElement('script')                                                              // 4
                                                                                                             // 5
  if (typeof opts === 'function') {                                                                          // 6
    cb = opts                                                                                                // 7
    opts = {}                                                                                                // 8
  }                                                                                                          // 9
                                                                                                             // 10
  opts = opts || {}                                                                                          // 11
  cb = cb || function() {}                                                                                   // 12
                                                                                                             // 13
  script.type = opts.type || 'text/javascript'                                                               // 14
  script.charset = opts.charset || 'utf8';                                                                   // 15
  script.async = 'async' in opts ? !!opts.async : true                                                       // 16
  script.src = src                                                                                           // 17
                                                                                                             // 18
  if (opts.attrs) {                                                                                          // 19
    setAttributes(script, opts.attrs)                                                                        // 20
  }                                                                                                          // 21
                                                                                                             // 22
  if (opts.text) {                                                                                           // 23
    script.text = '' + opts.text                                                                             // 24
  }                                                                                                          // 25
                                                                                                             // 26
  var onend = 'onload' in script ? stdOnEnd : ieOnEnd                                                        // 27
  onend(script, cb)                                                                                          // 28
                                                                                                             // 29
  // some good legacy browsers (firefox) fail the 'in' detection above                                       // 30
  // so as a fallback we always set onload                                                                   // 31
  // old IE will ignore this and new IE will set onload                                                      // 32
  if (!script.onload) {                                                                                      // 33
    stdOnEnd(script, cb);                                                                                    // 34
  }                                                                                                          // 35
                                                                                                             // 36
  head.appendChild(script)                                                                                   // 37
}                                                                                                            // 38
                                                                                                             // 39
function setAttributes(script, attrs) {                                                                      // 40
  for (var attr in attrs) {                                                                                  // 41
    script.setAttribute(attr, attrs[attr]);                                                                  // 42
  }                                                                                                          // 43
}                                                                                                            // 44
                                                                                                             // 45
function stdOnEnd (script, cb) {                                                                             // 46
  script.onload = function () {                                                                              // 47
    this.onerror = this.onload = null                                                                        // 48
    cb(null, script)                                                                                         // 49
  }                                                                                                          // 50
  script.onerror = function () {                                                                             // 51
    // this.onload = null here is necessary                                                                  // 52
    // because even IE9 works not like others                                                                // 53
    this.onerror = this.onload = null                                                                        // 54
    cb(new Error('Failed to load ' + this.src), script)                                                      // 55
  }                                                                                                          // 56
}                                                                                                            // 57
                                                                                                             // 58
function ieOnEnd (script, cb) {                                                                              // 59
  script.onreadystatechange = function () {                                                                  // 60
    if (this.readyState != 'complete' && this.readyState != 'loaded') return                                 // 61
    this.onreadystatechange = null                                                                           // 62
    cb(null, script) // there is no way to catch loading errors in IE8                                       // 63
  }                                                                                                          // 64
}                                                                                                            // 65
                                                                                                             // 66
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/kadira:dochead/main.js");
require("./node_modules/meteor/kadira:dochead/lib/both.js");
require("./node_modules/meteor/kadira:dochead/lib/flow_router.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['kadira:dochead'] = {}, {
  DocHead: DocHead
});

})();
