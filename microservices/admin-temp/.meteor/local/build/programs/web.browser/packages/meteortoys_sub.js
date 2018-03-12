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
var Mongo = Package.mongo.Mongo;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToysDict, MeteorToys_Sub, displayStatus, p;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/meteortoys_sub/client/template.main.js                                                       //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
                                                                                                         // 1
Template.__checkName("MeteorToys_pubsub");                                                               // 2
Template["MeteorToys_pubsub"] = new Template("Template.MeteorToys_pubsub", (function() {                 // 3
  var view = this;                                                                                       // 4
  return Blaze._TemplateWith(function() {                                                                // 5
    return {                                                                                             // 6
      name: Spacebars.call("MeteorToys_pubsub")                                                          // 7
    };                                                                                                   // 8
  }, function() {                                                                                        // 9
    return Spacebars.include(view.lookupTemplate("MeteorToy"), function() {                              // 10
      return [ "\n		", Blaze.Unless(function() {                                                         // 11
        return Spacebars.call(view.lookup("editing"));                                                   // 12
      }, function() {                                                                                    // 13
        return [ "\n			", Spacebars.include(view.lookupTemplate("MeteorToys_pubsub_header")), "\n			", Spacebars.include(view.lookupTemplate("MeteorToys_pubsub_content")), "\n		" ];
      }, function() {                                                                                    // 15
        return [ "\n			", Spacebars.include(view.lookupTemplate("MeteorToys_pubsub_new_header")), "\n			", Spacebars.include(view.lookupTemplate("MeteorToys_pubsub_new")), "\n		" ];
      }), "\n	" ];                                                                                       // 17
    });                                                                                                  // 18
  });                                                                                                    // 19
}));                                                                                                     // 20
                                                                                                         // 21
Template.__checkName("MeteorToys_pubsub_header");                                                        // 22
Template["MeteorToys_pubsub_header"] = new Template("Template.MeteorToys_pubsub_header", (function() {   // 23
  var view = this;                                                                                       // 24
  return HTML.Raw('<div class="MeteorToys_pubsub_header MeteorToys-background-overlay1">\n		<div class="MeteorToys_name"><strong>Subscriptions</strong></div>\n	</div>');
}));                                                                                                     // 26
                                                                                                         // 27
Template.__checkName("MeteorToys_pubsub_content");                                                       // 28
Template["MeteorToys_pubsub_content"] = new Template("Template.MeteorToys_pubsub_content", (function() {
  var view = this;                                                                                       // 30
  return HTML.DIV({                                                                                      // 31
    "class": "MeteorToys_pubsub_content"                                                                 // 32
  }, "\n		", Blaze.Each(function() {                                                                     // 33
    return Spacebars.call(view.lookup("subscription"));                                                  // 34
  }, function() {                                                                                        // 35
    return [ "\n			", HTML.DIV({                                                                         // 36
      "class": "MeteorToys_row "                                                                         // 37
    }, "\n				", HTML.DIV({                                                                              // 38
      "class": function() {                                                                              // 39
        return [ "MeteorToys_pubsub_row_toggle MeteorToys_pubsub_row_toggle_", Spacebars.mustache(view.lookup("name")) ];
      }                                                                                                  // 41
    }, HTML.CharRef({                                                                                    // 42
      html: "&times;",                                                                                   // 43
      str: "×"                                                                                           // 44
    })), "\n				", HTML.DIV({                                                                            // 45
      "class": "MeteorToys_pubsub_row_name"                                                              // 46
    }, Blaze.View("lookup:name", function() {                                                            // 47
      return Spacebars.mustache(view.lookup("name"));                                                    // 48
    })), "\n				", Blaze.If(function() {                                                                 // 49
      return Spacebars.call(view.lookup("parameters"));                                                  // 50
    }, function() {                                                                                      // 51
      return [ "\n					Params: ", Blaze.View("lookup:parameters", function() {                           // 52
        return Spacebars.mustache(view.lookup("parameters"));                                            // 53
      }), "\n				" ];                                                                                    // 54
    }, function() {                                                                                      // 55
      return "\n					No Parameters\n				";                                                               // 56
    }), "\n			"), "\n		" ];                                                                              // 57
  }, function() {                                                                                        // 58
    return [ "\n			", HTML.DIV({                                                                         // 59
      style: "padding-top: 4px"                                                                          // 60
    }, "No subscriptions discovered"), "\n		" ];                                                         // 61
  }), "\n	");                                                                                            // 62
}));                                                                                                     // 63
                                                                                                         // 64
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                       //
// packages/meteortoys_sub/client/main.js                                                                //
//                                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                         //
var _0x6bdc=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x70\x61\x74\x63\x68","\x73\x74\x61\x72\x74","\x73\x74\x61\x72\x74\x75\x70","\x75\x70\x64\x61\x74\x65","\x6D\x73\x61\x76\x69\x6E\x3A\x73\x75\x62","\x6D\x73\x61\x76\x69\x6E\x3A\x6D\x6F\x6E\x67\x6F\x6C","\x5F\x73\x75\x62\x73\x63\x72\x69\x70\x74\x69\x6F\x6E\x73","\x64\x65\x66\x61\x75\x6C\x74\x5F\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x6B\x65\x79\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2F\x50\x75\x62\x53\x75\x62","\x73\x65\x74","\x64\x69\x73\x70\x6C\x61\x79","\x67\x65\x74","\x54\x6F\x79\x4B\x69\x74","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x4E\x61\x6D\x65\x20\x55\x6E\x61\x76\x61\x69\x6C\x61\x62\x6C\x65","\x6E\x61\x6D\x65","\x50\x61\x72\x61\x6D\x73\x20\x55\x6E\x61\x76\x61\x69\x6C\x61\x62\x6C\x65","\x70\x61\x72\x61\x6D\x73","\x68\x65\x6C\x70\x65\x72\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x70\x75\x62\x73\x75\x62\x5F\x63\x6F\x6E\x74\x65\x6E\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x70\x75\x62\x73\x75\x62\x5F\x65\x64\x69\x74\x69\x6E\x67","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x70\x75\x62\x73\x75\x62","\x73\x74\x6F\x70","\x65\x76\x65\x6E\x74\x73"];Meteor[_0x6bdc[4]](function(){MeteorToysDict= Package[_0x6bdc[1]][_0x6bdc[0]];MeteorToys_Sub[_0x6bdc[2]]();MeteorToys_Sub[_0x6bdc[3]]()});MeteorToys_Sub= {start:function(){MeteorToys_Sub[_0x6bdc[5]]();setInterval(function(){MeteorToys_Sub[_0x6bdc[5]]()},1000)},update:function(){if(Package[_0x6bdc[6]]|| Package[_0x6bdc[7]]){var _0x5a93x1=Meteor[_0x6bdc[9]][_0x6bdc[8]],_0x5a93x2=Object[_0x6bdc[10]](_0x5a93x1);MeteorToysDict[_0x6bdc[12]](_0x6bdc[11],_0x5a93x2)}},patch:function(){displayStatus= Package[_0x6bdc[1]][_0x6bdc[15]][_0x6bdc[14]](_0x6bdc[13]);if( typeof displayStatus!== _0x6bdc[16]){MeteorToysDict[_0x6bdc[12]](_0x6bdc[11],null)}}};Template[_0x6bdc[22]][_0x6bdc[21]]({subscription:function(){var _0x5a93x3=MeteorToysDict[_0x6bdc[14]](_0x6bdc[11]);return _0x5a93x3},name:function(){var _0x5a93x4=_0x6bdc[17];if(Meteor[_0x6bdc[9]][_0x6bdc[8]][this]){if(Meteor[_0x6bdc[9]][_0x6bdc[8]][this][_0x6bdc[18]]){_0x5a93x4= Meteor[_0x6bdc[9]][_0x6bdc[8]][this][_0x6bdc[18]]}};return _0x5a93x4},parameters:function(){p= _0x6bdc[19];if(Meteor[_0x6bdc[9]][_0x6bdc[8]][this]){p= Meteor[_0x6bdc[9]][_0x6bdc[8]][this][_0x6bdc[20]]};return p}});Template[_0x6bdc[24]][_0x6bdc[21]]({editing:function(){return MeteorToysDict[_0x6bdc[14]](_0x6bdc[23])}});Template[_0x6bdc[22]][_0x6bdc[26]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x70\x75\x62\x73\x75\x62\x5F\x72\x6F\x77\x5F\x74\x6F\x67\x67\x6C\x65":function(){Meteor[_0x6bdc[9]][_0x6bdc[8]][this][_0x6bdc[25]]();MeteorToys_Sub[_0x6bdc[5]]()}})
///////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteortoys:sub'] = {};

})();
