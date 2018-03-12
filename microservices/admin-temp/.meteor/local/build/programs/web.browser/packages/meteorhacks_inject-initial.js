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
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;

/* Package-scope variables */
var Injected, Inject;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteorhacks_inject-initial/lib/inject-client.js          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
Injected = {                                                         // 1
                                                                     // 2
	obj: function(name) {                                               // 3
		var json = document.getElementById(name);                          // 4
		// Apparently .text doesn't work on some IE's.                     // 5
		return json ? EJSON.parse(json.innerHTML) : undefined;             // 6
	},                                                                  // 7
                                                                     // 8
	meta: function(name) {                                              // 9
		return this.metas[name];                                           // 10
	},                                                                  // 11
                                                                     // 12
	/* internal methods */                                              // 13
                                                                     // 14
	parseMetas: function() {                                            // 15
		var metaEls = document.getElementsByTagName('meta');               // 16
		for (var i=0; i < metaEls.length; i++)                             // 17
			this.metas[ metaEls[i].getAttribute('id') ]                       // 18
				= metaEls[i].getAttribute('content');                            // 19
	},                                                                  // 20
	metas: {}                                                           // 21
}                                                                    // 22
                                                                     // 23
Injected.parseMetas();                                               // 24
                                                                     // 25
// deprecated                                                        // 26
Inject = {                                                           // 27
	getObj: Injected.obj,                                               // 28
	getMeta: Injected.meta                                              // 29
}                                                                    // 30
                                                                     // 31
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteorhacks:inject-initial'] = {}, {
  Injected: Injected,
  Inject: Inject
});

})();
