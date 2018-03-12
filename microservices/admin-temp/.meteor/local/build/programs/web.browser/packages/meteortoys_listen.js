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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToysDict, count, msg;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/meteortoys_listen/client/template.main.js                                                          //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
                                                                                                               // 1
Template.__checkName("MeteorToys_intercept");                                                                  // 2
Template["MeteorToys_intercept"] = new Template("Template.MeteorToys_intercept", (function() {                 // 3
  var view = this;                                                                                             // 4
  return Blaze._TemplateWith(function() {                                                                      // 5
    return {                                                                                                   // 6
      name: Spacebars.call("MeteorToys_intercept")                                                             // 7
    };                                                                                                         // 8
  }, function() {                                                                                              // 9
    return Spacebars.include(view.lookupTemplate("MeteorToy"), function() {                                    // 10
      return [ "\n		", Spacebars.include(view.lookupTemplate("MeteorToys_intercept_header")), "\n		", Spacebars.include(view.lookupTemplate("MeteorToys_intercept_content")), "\n	" ];
    });                                                                                                        // 12
  });                                                                                                          // 13
}));                                                                                                           // 14
                                                                                                               // 15
Template.__checkName("MeteorToys_intercept_header");                                                           // 16
Template["MeteorToys_intercept_header"] = new Template("Template.MeteorToys_intercept_header", (function() {   // 17
  var view = this;                                                                                             // 18
  return HTML.DIV({                                                                                            // 19
    "class": "MeteorToys_intercept_header MeteorToys-background-overlay1"                                      // 20
  }, "\n		", Blaze.Unless(function() {                                                                         // 21
    return Spacebars.call(view.lookup("running"));                                                             // 22
  }, function() {                                                                                              // 23
    return [ "\n			", HTML.DIV({                                                                               // 24
      "class": "MeteorToys_intercept_button MeteorToys_intercept_start MeteorToys_action"                      // 25
    }, "Start"), "\n		" ];                                                                                     // 26
  }, function() {                                                                                              // 27
    return [ "\n			", HTML.DIV({                                                                               // 28
      "class": "MeteorToys_intercept_button MeteorToys_intercept_stop MeteorToys_action"                       // 29
    }, "Stop"), "\n		" ];                                                                                      // 30
  }), HTML.Raw('\n		<div class="MeteorToys_name"><strong>Listen</strong></div>\n	'));                          // 31
}));                                                                                                           // 32
                                                                                                               // 33
Template.__checkName("MeteorToys_intercept_content");                                                          // 34
Template["MeteorToys_intercept_content"] = new Template("Template.MeteorToys_intercept_content", (function() {
  var view = this;                                                                                             // 36
  return HTML.DIV({                                                                                            // 37
    "class": "MeteorToys_intercept_content"                                                                    // 38
  }, "\n		", Blaze.Unless(function() {                                                                         // 39
    return Spacebars.call(view.lookup("running"));                                                             // 40
  }, function() {                                                                                              // 41
    return [ "\n			To get started:\n			", HTML.DIV({                                                           // 42
      "class": "MeteorToys_intercept_row"                                                                      // 43
    }, "\n				", HTML.DIV({                                                                                    // 44
      "class": "MeteorToys_intercept_icon MeteorToys-background-overlay1"                                      // 45
    }, "1"), "\n				Open your browser console through the debugger\n			"), "\n			", HTML.DIV({                 // 46
      "class": "MeteorToys_intercept_row"                                                                      // 47
    }, "\n				", HTML.DIV({                                                                                    // 48
      "class": "MeteorToys_intercept_icon MeteorToys-background-overlay1"                                      // 49
    }, "2"), '\n				Click "start" in the top-right corner\n			'), "\n			", HTML.DIV({                          // 50
      "class": "MeteorToys_intercept_row"                                                                      // 51
    }, "\n				", HTML.DIV({                                                                                    // 52
      "class": "MeteorToys_intercept_icon MeteorToys-background-overlay1"                                      // 53
    }, "3"), "\n				Observe how DDP flows in and out of your app\n			"), "\n		" ];                             // 54
  }, function() {                                                                                              // 55
    return [ "\n			DDP\n			", HTML.SPAN({                                                                      // 56
      style: "color: #A6E22D"                                                                                  // 57
    }, HTML.CharRef({                                                                                          // 58
      html: "&#x25BC;",                                                                                        // 59
      str: "▼"                                                                                                 // 60
    })), " ", Blaze.View("lookup:downCount", function() {                                                      // 61
      return Spacebars.mustache(view.lookup("downCount"));                                                     // 62
    }), "\n			", HTML.SPAN({                                                                                   // 63
      style: "color: #EB4C16"                                                                                  // 64
    }, HTML.CharRef({                                                                                          // 65
      html: "&#x25B2;",                                                                                        // 66
      str: "▲"                                                                                                 // 67
    })), " ", Blaze.View("lookup:upCount", function() {                                                        // 68
      return Spacebars.mustache(view.lookup("upCount"));                                                       // 69
    }), HTML.BR(), " \n		" ];                                                                                  // 70
  }), "\n		\n		\n	");                                                                                          // 71
}));                                                                                                           // 72
                                                                                                               // 73
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                             //
// packages/meteortoys_listen/client/main.js                                                                   //
//                                                                                                             //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                               //
var _0x152c=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x69\x63\x74","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74","\x73\x65\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x6D\x6F\x6E\x6B\x65\x79\x50\x61\x74\x63\x68\x65\x64","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x64\x6F\x77\x6E","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x75\x70","\x6F\x6E","\x65\x71\x75\x61\x6C\x73","\x6F\x66\x66","\x65\x76\x65\x6E\x74\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x68\x65\x61\x64\x65\x72","\x68\x65\x6C\x70\x65\x72\x73","\x67\x65\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x63\x6F\x6E\x74\x65\x6E\x74","\x5F\x73\x65\x6E\x64","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x4F\x55\x54\x20","\x6D\x73\x67","\x6C\x6F\x67","\x63\x61\x6C\x6C","\x6D\x65\x73\x73\x61\x67\x65","\x70\x61\x72\x73\x65","\x49\x4E\x20\x20","\x5F\x73\x74\x72\x65\x61\x6D","\x4D\x65\x74\x65\x6F\x72\x20\x54\x6F\x79\x73\x20\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x20\x73\x74\x61\x72\x74\x65\x64\x20\x61\x74\x20","\x4D\x65\x74\x65\x6F\x72\x20\x54\x6F\x79\x73\x20\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x20\x73\x74\x6F\x70\x70\x65\x64\x20\x61\x74\x20","\x61\x75\x74\x6F\x72\x75\x6E"];MeteorToysDict= Package[_0x152c[1]][_0x152c[0]];MeteorToysDict[_0x152c[3]](_0x152c[2],false);MeteorToysDict[_0x152c[3]](_0x152c[4],false);MeteorToysDict[_0x152c[3]](_0x152c[5],0);MeteorToysDict[_0x152c[3]](_0x152c[6],0);Template[_0x152c[11]][_0x152c[10]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x73\x74\x61\x72\x74":function(){MeteorToysDict[_0x152c[3]](_0x152c[2],_0x152c[7]);if(MeteorToysDict[_0x152c[8]](_0x152c[4],false)){MeteorToysIntercept()}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x74\x65\x72\x63\x65\x70\x74\x5F\x73\x74\x6F\x70":function(){MeteorToysDict[_0x152c[3]](_0x152c[2],_0x152c[9])}});Template[_0x152c[11]][_0x152c[12]]({running:function(){if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[7])){return true}}});Template[_0x152c[14]][_0x152c[12]]({running:function(){if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[7])){return true}},downCount:function(){return MeteorToysDict[_0x152c[13]](_0x152c[5])},upCount:function(){return MeteorToysDict[_0x152c[13]](_0x152c[6])}});var MeteorToysIntercept=function(){var _0xd2c3x2=Meteor[_0x152c[16]][_0x152c[15]];Meteor[_0x152c[16]][_0x152c[15]]= function(_0xd2c3x3){if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[7])){console[_0x152c[19]](_0x152c[17],_0xd2c3x3[_0x152c[18]],_0xd2c3x3);count= MeteorToysDict[_0x152c[13]](_0x152c[6])+ 1;MeteorToysDict[_0x152c[3]](_0x152c[6],count)};_0xd2c3x2[_0x152c[20]](this,_0xd2c3x3)};Meteor[_0x152c[16]][_0x152c[24]][_0x152c[7]](_0x152c[21],function(_0xd2c3x4){if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[7])){msg= JSON[_0x152c[22]](_0xd2c3x4);console[_0x152c[19]](_0x152c[23],msg[_0x152c[18]],msg);count= MeteorToysDict[_0x152c[13]](_0x152c[5])+ 1;MeteorToysDict[_0x152c[3]](_0x152c[5],count)}})};Tracker[_0x152c[27]](function(){if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[7])){console[_0x152c[19]](_0x152c[25]+ Date())};if(MeteorToysDict[_0x152c[8]](_0x152c[2],_0x152c[9])){console[_0x152c[19]](_0x152c[26]+ Date())}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteortoys:listen'] = {};

})();
