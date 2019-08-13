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
Injected = {

	obj: function(name) {
		var json = document.getElementById(name);
		// Apparently .text doesn't work on some IE's.
		return json ? EJSON.parse(json.innerHTML) : undefined;
	},

	meta: function(name) {
		return this.metas[name];
	},

	/* internal methods */

	parseMetas: function() {
		var metaEls = document.getElementsByTagName('meta');
		for (var i=0; i < metaEls.length; i++)
			this.metas[ metaEls[i].getAttribute('id') ]
				= metaEls[i].getAttribute('content');
	},
	metas: {}
}

Injected.parseMetas();

// deprecated
Inject = {
	getObj: Injected.obj,
	getMeta: Injected.meta
}

///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("meteorhacks:inject-initial", {
  Injected: Injected,
  Inject: Inject
});

})();
