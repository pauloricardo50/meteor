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
var Template = Package.templating.Template;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Mongo = Package.mongo.Mongo;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToys;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/meteortoys_toggle/client/template.main.js                                  //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
                                                                                       // 1
Template.__checkName("MeteorToysToggle");                                              // 2
Template["MeteorToysToggle"] = new Template("Template.MeteorToysToggle", (function() {
  var view = this;                                                                     // 4
  return Blaze.Unless(function() {                                                     // 5
    return Spacebars.call(view.lookup("hide"));                                        // 6
  }, function() {                                                                      // 7
    return [ "\n	", HTML.DIV({                                                         // 8
      id: "MeteorToys_Toggle",                                                         // 9
      "class": "MeteorToys-background-overlay1",                                       // 10
      oncontextmenu: "return false;",                                                  // 11
      style: ""                                                                        // 12
    }), "\n	" ];                                                                       // 13
  });                                                                                  // 14
}));                                                                                   // 15
                                                                                       // 16
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////
//                                                                                     //
// packages/meteortoys_toggle/client/main.js                                           //
//                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////
                                                                                       //
Meteor.startup(function() {                                                            // 1
	MeteorToys = Package["meteortoys:toykit"].MeteorToys;                                 // 2
	MeteorToys.setDefault("hideToggle", false)                                            // 3
});                                                                                    // 4
                                                                                       // 5
Template.MeteorToysToggle.events({                                                     // 6
	'mouseenter #MeteorToys_Toggle': function (e,t) {                                     // 7
		e.preventDefault();                                                                  // 8
		e.stopPropagation();                                                                 // 9
                                                                                       // 10
		if (e.altKey) {                                                                      // 11
			window["MeteorToys"].close();                                                       // 12
			MeteorToys.set("hideToggle", true);                                                 // 13
			return;                                                                             // 14
		}                                                                                    // 15
                                                                                       // 16
		if (e.shiftKey) {                                                                    // 17
			window["MeteorToys"].close();                                                       // 18
			MeteorToys.set("hideToggle", true);                                                 // 19
			return;                                                                             // 20
		}                                                                                    // 21
                                                                                       // 22
		window["MeteorToys"].open();                                                         // 23
	},                                                                                    // 24
	'touchmove': function () {                                                            // 25
		MeteorToys.set("hideToggle", true);                                                  // 26
	}                                                                                     // 27
});                                                                                    // 28
                                                                                       // 29
Template.MeteorToysToggle.helpers({                                                    // 30
	hide: function () {                                                                   // 31
		return MeteorToys.get("hideToggle")                                                  // 32
	}                                                                                     // 33
});                                                                                    // 34
/////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteortoys:toggle'] = {};

})();
