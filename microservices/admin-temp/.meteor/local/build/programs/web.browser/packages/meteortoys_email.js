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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToysDict, MeteorToysGoTo, currentEmail, nextEmail, emailCount, lastEmail, resultCount, current, thing, doc;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/meteortoys_email/client/template.main.js                                                   //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
                                                                                                       // 1
Template.__checkName("MeteorToys_email");                                                              // 2
Template["MeteorToys_email"] = new Template("Template.MeteorToys_email", (function() {                 // 3
  var view = this;                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                              // 5
    return {                                                                                           // 6
      name: Spacebars.call("MeteorToys_email")                                                         // 7
    };                                                                                                 // 8
  }, function() {                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("MeteorToy"), function() {                            // 10
      return [ "\n		", Spacebars.include(view.lookupTemplate("MeteorToys_email_header")), "\n		", Spacebars.include(view.lookupTemplate("MeteorToys_email_content")), "\n	" ];
    });                                                                                                // 12
  });                                                                                                  // 13
}));                                                                                                   // 14
                                                                                                       // 15
Template.__checkName("MeteorToys_email_content");                                                      // 16
Template["MeteorToys_email_content"] = new Template("Template.MeteorToys_email_content", (function() {
  var view = this;                                                                                     // 18
  return HTML.DIV({                                                                                    // 19
    "class": "MeteorToys_email_content"                                                                // 20
  }, "\n", Blaze.If(function() {                                                                       // 21
    return Spacebars.call(view.lookup("content"));                                                     // 22
  }, function() {                                                                                      // 23
    return [ "\n", Spacebars.With(function() {                                                         // 24
      return Spacebars.call(view.lookup("content"));                                                   // 25
    }, function() {                                                                                    // 26
      return [ "\n	", HTML.DIV({                                                                       // 27
        "class": "MeteorToys_content"                                                                  // 28
      }, "\n		", HTML.DIV({                                                                            // 29
        "class": "MeteorToys_content_name"                                                             // 30
      }, "To "), "\n		", HTML.DIV({                                                                    // 31
        "class": "MeteorToys_content_content"                                                          // 32
      }, Blaze.View("lookup:to", function() {                                                          // 33
        return Spacebars.mustache(view.lookup("to"));                                                  // 34
      })), "\n	"), "\n	", HTML.DIV({                                                                   // 35
        "class": "MeteorToys_content"                                                                  // 36
      }, "\n		", HTML.DIV({                                                                            // 37
        "class": "MeteorToys_content_name"                                                             // 38
      }, "From "), "\n		", HTML.DIV({                                                                  // 39
        "class": "MeteorToys_content_content"                                                          // 40
      }, Blaze.View("lookup:from", function() {                                                        // 41
        return Spacebars.mustache(view.lookup("from"));                                                // 42
      })), "\n	"), "\n	", HTML.DIV({                                                                   // 43
        "class": "MeteorToys_content"                                                                  // 44
      }, "\n		", HTML.DIV({                                                                            // 45
        "class": "MeteorToys_content_name"                                                             // 46
      }, "Subject "), "\n		", HTML.DIV({                                                               // 47
        "class": "MeteorToys_content_content"                                                          // 48
      }, Blaze.View("lookup:subject", function() {                                                     // 49
        return Spacebars.mustache(view.lookup("subject"));                                             // 50
      })), "\n	"), "\n	", HTML.DIV({                                                                   // 51
        "class": "MeteorToys_content"                                                                  // 52
      }, "\n		", HTML.DIV({                                                                            // 53
        "class": "MeteorToys_content_name"                                                             // 54
      }, "Time "), "\n		", HTML.DIV({                                                                  // 55
        "class": "MeteorToys_content_content"                                                          // 56
      }, Blaze.View("lookup:timestamp", function() {                                                   // 57
        return Spacebars.mustache(view.lookup("timestamp"));                                           // 58
      })), "\n	"), "\n	", HTML.DIV({                                                                   // 59
        "class": "MeteorToys_content"                                                                  // 60
      }, "\n		", HTML.DIV({                                                                            // 61
        "class": "MeteorToys_content_name"                                                             // 62
      }, "Body "), "\n		", HTML.DIV({                                                                  // 63
        "class": "MeteorToys_content_content"                                                          // 64
      }, Blaze.View("lookup:body", function() {                                                        // 65
        return Spacebars.mustache(view.lookup("body"));                                                // 66
      })), "\n	"), "\n" ];                                                                             // 67
    }), "\n	", HTML.Comment(" <pre>{{{content}}}</pre> "), "\n" ];                                     // 68
  }, function() {                                                                                      // 69
    return [ "\n	", HTML.DIV({                                                                         // 70
      style: "padding: 5px 8px"                                                                        // 71
    }, "\n		Whenever your application sends", HTML.BR(), "\n		an email, it will be captured", HTML.BR(), "\n		and displayed here.\n	"), "\n" ];
  }), "\n	");                                                                                          // 73
}));                                                                                                   // 74
                                                                                                       // 75
Template.__checkName("MeteorToys_email_header");                                                       // 76
Template["MeteorToys_email_header"] = new Template("Template.MeteorToys_email_header", (function() {   // 77
  var view = this;                                                                                     // 78
  return HTML.DIV({                                                                                    // 79
    "class": "MeteorToys_email_header MeteorToys-background-overlay1"                                  // 80
  }, "\n		", Blaze.If(function() {                                                                     // 81
    return Spacebars.call(view.lookup("hasData"));                                                     // 82
  }, function() {                                                                                      // 83
    return [ "\n			", HTML.DIV({                                                                       // 84
      "class": "MeteorToys_email_button MeteorToys_email_next MeteorToys_action"                       // 85
    }, HTML.CharRef({                                                                                  // 86
      html: "&rsaquo;",                                                                                // 87
      str: "›"                                                                                         // 88
    })), "\n			", HTML.DIV({                                                                           // 89
      "class": "MeteorToys_email_button MeteorToys_email_prev MeteorToys_action"                       // 90
    }, HTML.CharRef({                                                                                  // 91
      html: "&lsaquo;",                                                                                // 92
      str: "‹"                                                                                         // 93
    })), "\n		" ];                                                                                     // 94
  }), "\n		", HTML.DIV({                                                                               // 95
    "class": "MeteorToys_name"                                                                         // 96
  }, HTML.Raw("<strong>Email</strong>"), " ", Blaze.If(function() {                                    // 97
    return Spacebars.call(view.lookup("hasData"));                                                     // 98
  }, function() {                                                                                      // 99
    return [ Blaze.View("lookup:current", function() {                                                 // 100
      return Spacebars.mustache(view.lookup("current"));                                               // 101
    }), " of ", Blaze.View("lookup:total", function() {                                                // 102
      return Spacebars.mustache(view.lookup("total"));                                                 // 103
    }) ];                                                                                              // 104
  })), "\n	");                                                                                         // 105
}));                                                                                                   // 106
                                                                                                       // 107
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                     //
// packages/meteortoys_email/client/main.js                                                            //
//                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                       //
var _0xa374=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x69\x63\x74","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x63\x75\x72\x72\x65\x6E\x74\x45\x6D\x61\x69\x6C","\x73\x65\x74","\x67\x65\x74","\x63\x6F\x75\x6E\x74","\x66\x69\x6E\x64","\x45\x6D\x61\x69\x6C","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6C\x61\x73\x74","\x70\x72\x65\x76","\x66\x69\x72\x73\x74","\x6E\x65\x78\x74","\x65\x76\x65\x6E\x74\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x65\x6D\x61\x69\x6C\x5F\x68\x65\x61\x64\x65\x72","\x68\x65\x6C\x70\x65\x72\x73","\x66\x65\x74\x63\x68","\x68\x74\x6D\x6C","\x74\x65\x78\x74","\x74\x69\x6D\x65\x73\x74\x61\x6D\x70","\x74\x6F\x4C\x6F\x63\x61\x6C\x65\x54\x69\x6D\x65\x53\x74\x72\x69\x6E\x67","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x65\x6D\x61\x69\x6C\x5F\x63\x6F\x6E\x74\x65\x6E\x74"];MeteorToysDict= Package[_0xa374[1]][_0xa374[0]];MeteorToysDict[_0xa374[3]](_0xa374[2],0);MeteorToysGoTo= {"\x6E\x65\x78\x74":function(){currentEmail= MeteorToysDict[_0xa374[4]](_0xa374[2])+ 1;nextEmail= MeteorToysDict[_0xa374[4]](_0xa374[2])+ 1;MeteorToysDict[_0xa374[3]](_0xa374[2],nextEmail)},"\x70\x72\x65\x76":function(){nextEmail= MeteorToysDict[_0xa374[4]](_0xa374[2])- 1;MeteorToysDict[_0xa374[3]](_0xa374[2],nextEmail)},"\x66\x69\x72\x73\x74":function(){MeteorToysDict[_0xa374[3]](_0xa374[2],0)},"\x6C\x61\x73\x74":function(){emailCount= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]()[_0xa374[5]]();lastEmail= emailCount- 1;MeteorToysDict[_0xa374[3]](_0xa374[2],lastEmail)}};Template[_0xa374[14]][_0xa374[13]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x65\x6D\x61\x69\x6C\x5F\x70\x72\x65\x76":function(_0xf0bfx1,_0xf0bfx2){currentEmail= MeteorToysDict[_0xa374[4]](_0xa374[2]);if(currentEmail=== 0){MeteorToysGoTo[_0xa374[9]]()}else {MeteorToysGoTo[_0xa374[10]]()}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x65\x6D\x61\x69\x6C\x5F\x6E\x65\x78\x74":function(){emailCount= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]()[_0xa374[5]]();currentEmail= MeteorToysDict[_0xa374[4]](_0xa374[2])+ 1;if(emailCount=== currentEmail){MeteorToysGoTo[_0xa374[11]]()}else {MeteorToysGoTo[_0xa374[12]]()}}});Template[_0xa374[14]][_0xa374[15]]({current:function(){currentEmail= MeteorToysDict[_0xa374[4]](_0xa374[2])+ 1;return currentEmail},total:function(){emailCount= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]()[_0xa374[5]]();return emailCount},hasData:function(){resultCount= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]()[_0xa374[5]]();if(resultCount<= 1){return false}else {return true}}});Template[_0xa374[21]][_0xa374[15]]({"\x63\x6F\x6E\x74\x65\x6E\x74":function(){current= MeteorToysDict[_0xa374[4]](_0xa374[2]);thing= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]({},{sort:{"\x74\x69\x6D\x65\x73\x74\x61\x6D\x70":-1}});doc= thing[_0xa374[16]]()[current];return doc},"\x62\x6F\x64\x79":function(){current= MeteorToysDict[_0xa374[4]](_0xa374[2]);thing= Package[_0xa374[1]][_0xa374[8]][_0xa374[7]][_0xa374[6]]({},{sort:{"\x74\x69\x6D\x65\x73\x74\x61\x6D\x70":-1}});doc= thing[_0xa374[16]]()[current];if(doc[_0xa374[17]]){return doc[_0xa374[17]]}else {return doc[_0xa374[18]]}},"\x74\x69\x6D\x65\x73\x74\x61\x6D\x70":function(){var _0xf0bfx3=this[_0xa374[19]];return _0xf0bfx3[_0xa374[20]]()}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['meteortoys:email'] = {};

})();
