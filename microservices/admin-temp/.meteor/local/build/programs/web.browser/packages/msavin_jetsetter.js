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
var Session = Package.session.Session;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToysDict, JetSetter, CloseJetSetter, value, stringed, colorize, targetDict, target, varName, currentDict, name, contents, Dictionaries, DictNames, dictionaryName;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/template.main.js                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter");                                                                               // 2
Template["JetSetter"] = new Template("Template.JetSetter", (function() {                                         // 3
  var view = this;                                                                                               // 4
  return HTML.DIV({                                                                                              // 5
    id: "JetSetter",                                                                                             // 6
    "class": function() {                                                                                        // 7
      return [ "MeteorToys ", Spacebars.mustache(view.lookup("expanded")), " MeteorToys_hide_JetSetter MeteorToysReset" ];
    },                                                                                                           // 9
    oncontextmenu: 'Package["msavin:jetsetter"].CloseJetSetter(); return false;'                                 // 10
  }, "\n		\n		", Blaze.If(function() {                                                                           // 11
    return Spacebars.call(view.lookup("MeteorToys_Pro"));                                                        // 12
  }, function() {                                                                                                // 13
    return [ "	\n			", Spacebars.include(view.lookupTemplate("JetSetter_header_pro")), "\n		" ];                 // 14
  }, function() {                                                                                                // 15
    return [ "\n			", Spacebars.include(view.lookupTemplate("JetSetter_header")), "\n		" ];                      // 16
  }), "\n		\n		", Blaze.If(function() {                                                                          // 17
    return Spacebars.call(view.lookup("JetSetter_oldSession"));                                                  // 18
  }, function() {                                                                                                // 19
    return [ "\n			", Spacebars.include(view.lookupTemplate("JetSetterSession")), "\n		" ];                      // 20
  }), "\n		\n		", Spacebars.include(view.lookupTemplate("JetSetter_reactive")), "\n\n	");                        // 21
}));                                                                                                             // 22
                                                                                                                 // 23
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/main.js                                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _0x2fb9=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x69\x63\x74","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x6B\x65\x79\x73","\x67\x65\x74\x4F\x77\x6E\x50\x72\x6F\x70\x65\x72\x74\x79\x4E\x61\x6D\x65\x73","\x4D\x65\x74\x65\x6F\x72\x2E","\x61\x72\x72\x61\x79\x43\x6C\x65\x61\x6E\x65\x72","\x4A\x65\x74\x53\x65\x74\x74\x65\x72","\x73\x65\x74","\x6C\x65\x6E\x67\x74\x68","\x73\x75\x62\x73\x74\x72","\x73\x70\x6C\x69\x63\x65","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x63\x75\x72\x72\x65\x6E\x74","\x67\x65\x74","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x65\x78\x70\x61\x6E\x64","\x61\x6C\x6C","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x68\x65\x6C\x70\x65\x72\x73","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x70\x72\x65\x76\x69\x65\x77\x4D\x6F\x64\x65","\x61\x64\x64\x43\x6C\x61\x73\x73","\x23\x4A\x65\x74\x53\x65\x74\x74\x65\x72","\x72\x65\x6D\x6F\x76\x65\x43\x6C\x61\x73\x73","\x65\x76\x65\x6E\x74\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x6C\x6F\x73\x65","\x53\x65\x73\x73\x69\x6F\x6E","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x73\x65\x73\x73\x69\x6F\x6E","\x73\x74\x61\x72\x74\x75\x70"];MeteorToysDict= Package[_0x2fb9[1]][_0x2fb9[0]];JetSetter= {getKeys:function(){var _0xa36fx1=Object[_0x2fb9[3]](Session[_0x2fb9[2]]);_0xa36fx1= JetSetter[_0x2fb9[5]](_0xa36fx1,_0x2fb9[4]);MeteorToysDict[_0x2fb9[7]](_0x2fb9[6],_0xa36fx1)},arrayCleaner:function(_0xa36fx2,_0xa36fx3){var _0xa36fx4=_0xa36fx3[_0x2fb9[8]];for(var _0xa36fx5=0;_0xa36fx5< _0xa36fx2[_0x2fb9[8]];_0xa36fx5++){if(_0xa36fx2[_0xa36fx5][_0x2fb9[9]](0,_0xa36fx4)=== _0xa36fx3){_0xa36fx2[_0x2fb9[10]](_0xa36fx5,1);_0xa36fx5--}};return _0xa36fx2}};Template[_0x2fb9[6]][_0x2fb9[16]]({expanded:function(){var _0xa36fx6=MeteorToysDict[_0x2fb9[12]](_0x2fb9[11]);if(_0xa36fx6){return _0x2fb9[13]}},JetSetter_oldSession:function(){if( typeof Session[_0x2fb9[14]]== _0x2fb9[15]){return false}else {return true}}});Template[_0x2fb9[6]][_0x2fb9[21]]({"\x6D\x6F\x75\x73\x65\x6F\x76\x65\x72":function(){$(_0x2fb9[19])[_0x2fb9[18]](_0x2fb9[17])},"\x6D\x6F\x75\x73\x65\x6F\x75\x74":function(){$(_0x2fb9[19])[_0x2fb9[20]](_0x2fb9[17])}});CloseJetSetter= function(){if(Package[_0x2fb9[1]][_0x2fb9[22]][_0x2fb9[12]](_0x2fb9[11])){Package[_0x2fb9[1]][_0x2fb9[22]][_0x2fb9[7]](_0x2fb9[11])}else {MeteorToys[_0x2fb9[23]]()}};Meteor[_0x2fb9[27]](function(){if( typeof window[_0x2fb9[24]]=== _0x2fb9[25]){if(Package[_0x2fb9[26]]){window[_0x2fb9[24]]= Package[_0x2fb9[26]][_0x2fb9[24]]}}})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row/template.main.js                                                         //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter_reactiveVar_row");                                                               // 2
Template["JetSetter_reactiveVar_row"] = new Template("Template.JetSetter_reactiveVar_row", (function() {         // 3
  var view = this;                                                                                               // 4
  return Blaze._TemplateWith(function() {                                                                        // 5
    return {                                                                                                     // 6
      name: Spacebars.call(view.lookup("componentName"))                                                         // 7
    };                                                                                                           // 8
  }, function() {                                                                                                // 9
    return Spacebars.include(view.lookupTemplate("JetSetter_Component"), function() {                            // 10
      return [ "\n		", HTML.DIV({                                                                                // 11
        "class": "JetSetter_dictTitle"                                                                           // 12
      }, "\n			", Blaze.View("lookup:..key", function() {                                                        // 13
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "key"));                                       // 14
      }), HTML.SPAN({                                                                                            // 15
        "class": "JetSetter_value_preview"                                                                       // 16
      }, ": ", Blaze.View("lookup:value", function() {                                                           // 17
        return Spacebars.makeRaw(Spacebars.mustache(view.lookup("value")));                                      // 18
      })), "\n		"), "\n		", Spacebars.include(view.lookupTemplate("JetSetter_reactiveVar_editor")), "\n	" ];     // 19
    });                                                                                                          // 20
  });                                                                                                            // 21
}));                                                                                                             // 22
                                                                                                                 // 23
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row/main.js                                                                  //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.JetSetter_reactiveVar_row.helpers({                                                                     // 2
	'value': function () {                                                                                          // 3
		try {                                                                                                          // 4
			value = window[this.parent].get(this.key);                                                                    // 5
			return JSON.stringify(value)                                                                                  // 6
		} catch (e) {                                                                                                  // 7
			return "<em>undefined</em>";                                                                                  // 8
		}                                                                                                              // 9
	},                                                                                                              // 10
	'componentName': function () {                                                                                  // 11
		return this.parent + "_" + this.key;                                                                           // 12
	}                                                                                                               // 13
})                                                                                                               // 14
                                                                                                                 // 15
                                                                                                                 // 16
                                                                                                                 // 17
                                                                                                                 // 18
                                                                                                                 // 19
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_editor/template.JetSetter_editor.js                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter_reactiveVar_editor");                                                            // 2
Template["JetSetter_reactiveVar_editor"] = new Template("Template.JetSetter_reactiveVar_editor", (function() {   // 3
  var view = this;                                                                                               // 4
  return HTML.DIV({                                                                                              // 5
    "class": "JetSetter_editor"                                                                                  // 6
  }, "\n		", Blaze.If(function() {                                                                               // 7
    return Spacebars.call(view.lookup("editing"));                                                               // 8
  }, function() {                                                                                                // 9
    return [ "\n			", HTML.DIV({                                                                                 // 10
      "class": "JetSetter_editor_header"                                                                         // 11
    }, "\n				", HTML.DIV({                                                                                      // 12
      "class": "JetSetter_editor_button JetSetter_button_save"                                                   // 13
    }, "Save"), "\n				", HTML.DIV({                                                                             // 14
      "class": "JetSetter_editor_button JetSetter_button_cancel"                                                 // 15
    }, "Cancel"), "\n				Value \n			"), "\n			", HTML.DIV({                                                      // 16
      "class": "JetSetter_editor_content JetSetter_editor_content_editing",                                      // 17
      id: function() {                                                                                           // 18
        return [ "JetSetter_editor_", Spacebars.mustache(view.lookup("editorName")) ];                           // 19
      },                                                                                                         // 20
      contenteditable: "true"                                                                                    // 21
    }, "\n				", HTML.PRE(Blaze.View("lookup:editingContent", function() {                                       // 22
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("editingContent")));                               // 23
    })), "\n			"), "\n		" ];                                                                                     // 24
  }, function() {                                                                                                // 25
    return [ "\n			", HTML.DIV({                                                                                 // 26
      "class": "JetSetter_editor_header"                                                                         // 27
    }, "\n				", HTML.DIV({                                                                                      // 28
      "class": "JetSetter_editor_button JetSetter_button_edit MeteorToys_action"                                 // 29
    }, "Edit"), "\n				", HTML.DIV({                                                                             // 30
      "class": "JetSetter_editor_button JetSetter_button_drop MeteorToys_action"                                 // 31
    }, "Nullify"), "\n				Value \n			"), "\n			", HTML.DIV({                                                     // 32
      "class": "JetSetter_editor_content"                                                                        // 33
    }, "\n				", HTML.PRE(Blaze.View("lookup:content", function() {                                              // 34
      return Spacebars.makeRaw(Spacebars.mustache(view.lookup("content")));                                      // 35
    })), "\n			"), "\n		" ];                                                                                     // 36
  }), "\n	");                                                                                                    // 37
}));                                                                                                             // 38
                                                                                                                 // 39
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_editor/JetSetter_editor.js                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _0x4982=["\x6B\x65\x79","\x67\x65\x74","\x70\x61\x72\x65\x6E\x74","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x63\x6F\x6C\x6F\x72\x69\x7A\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x73\x65\x74\x74\x69\x6E\x67\x73\x5F\x65\x64\x69\x74","\x5F","\x68\x65\x6C\x70\x65\x72\x73","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x72\x65\x61\x63\x74\x69\x76\x65\x56\x61\x72\x5F\x65\x64\x69\x74\x6F\x72","\x74\x65\x78\x74","\x23\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x65\x64\x69\x74\x6F\x72\x5F","\x70\x61\x72\x73\x65","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x66\x61\x69\x6C\x65\x64\x5F\x63\x68\x61\x6E\x67\x65","\x73\x65\x74","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x63\x75\x72\x72\x65\x6E\x74","\x65\x76\x65\x6E\x74\x73"];Template[_0x4982[10]][_0x4982[9]]({"\x63\x6F\x6E\x74\x65\x6E\x74":function(){value= undefined;try{value= window[this[_0x4982[2]]][_0x4982[1]](this[_0x4982[0]])}catch(e){};stringed= JSON[_0x4982[3]](value,null,2);colorize= Package[_0x4982[6]][_0x4982[5]][_0x4982[4]](stringed);return colorize},"\x65\x64\x69\x74\x69\x6E\x67\x43\x6F\x6E\x74\x65\x6E\x74":function(){value= undefined;try{value= window[this[_0x4982[2]]][_0x4982[1]](this[_0x4982[0]])}catch(e){};stringed= JSON[_0x4982[3]](value,null,2);return stringed},"\x65\x64\x69\x74\x69\x6E\x67":function(){return MeteorToysDict[_0x4982[1]](_0x4982[7])},"\x65\x64\x69\x74\x6F\x72\x4E\x61\x6D\x65":function(){return this[_0x4982[2]]+ _0x4982[8]+ this[_0x4982[0]]}});Template[_0x4982[10]][_0x4982[17]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x73\x61\x76\x65":function(){var _0x2e35x1=$(_0x4982[12]+ String(this[_0x4982[2]])+ _0x4982[8]+ String(this[_0x4982[0]]))[_0x4982[11]]();var _0x2e35x2=false;try{_0x2e35x2= JSON[_0x4982[13]](_0x2e35x1)}catch(error){var _0x2e35x2=_0x4982[14]};if(_0x2e35x2=== _0x4982[14]){}else {targetDict= window[this[_0x4982[2]]];window[this[_0x4982[2]]][_0x4982[15]](this[_0x4982[0]],_0x2e35x2)};MeteorToysDict[_0x4982[15]](_0x4982[7],false)},"\x63\x6C\x69\x63\x6B\x20\x2E\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x63\x61\x6E\x63\x65\x6C":function(){MeteorToysDict[_0x4982[15]](_0x4982[7],false)},"\x63\x6C\x69\x63\x6B\x20\x2E\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x65\x64\x69\x74":function(){MeteorToysDict[_0x4982[15]](_0x4982[7],true)},"\x63\x6C\x69\x63\x6B\x20\x2E\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x62\x75\x74\x74\x6F\x6E\x5F\x64\x72\x6F\x70":function(){target= window[this[_0x4982[2]]];if(target[_0x4982[1]](this[_0x4982[0]])=== null){MeteorToysDict[_0x4982[15]](_0x4982[16],false)}else {target[_0x4982[15]](this[_0x4982[0]],null)}}})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_header/template.JetSetter_header.js                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter_header");                                                                        // 2
Template["JetSetter_header"] = new Template("Template.JetSetter_header", (function() {                           // 3
  var view = this;                                                                                               // 4
  return Blaze._TemplateWith(function() {                                                                        // 5
    return {                                                                                                     // 6
      name: Spacebars.call("header")                                                                             // 7
    };                                                                                                           // 8
  }, function() {                                                                                                // 9
    return Spacebars.include(view.lookupTemplate("JetSetter_Component"), function() {                            // 10
      return [ "\n		", HTML.STRONG("JetSetter"), "\n		", HTML.DIV({                                              // 11
        "class": "JetSetter_editor"                                                                              // 12
      }, "\n			", HTML.DIV({                                                                                     // 13
        "class": "JetSetter_editor_header"                                                                       // 14
      }, "\n				In-App Session Editor\n			"), "\n			", HTML.DIV({                                                // 15
        "class": "JetSetter_editor_content"                                                                      // 16
      }, "\n", HTML.PRE({                                                                                        // 17
        "class": "MeteorToys-off"                                                                                // 18
      }, "{ \n  ", HTML.SPAN({                                                                                   // 19
        "class": "MeteorToys_key"                                                                                // 20
      }, '"created_by"'), ': "', HTML.A({                                                                        // 21
        href: "http://maxsavin.com"                                                                              // 22
      }, "Max Savin"), '",\n  ', HTML.SPAN({                                                                     // 23
        "class": "MeteorToys_key"                                                                                // 24
      }, '"docs_at"'), ':    "', HTML.A({                                                                        // 25
        href: "https://meteor.toys"                                                                              // 26
      }, "Meteor Toys"), '",\n  ', HTML.SPAN({                                                                   // 27
        "class": "MeteorToys_key"                                                                                // 28
      }, '"license"'), ':    "', HTML.A({                                                                        // 29
        href: "https://github.com/MeteorToys/allthings/blob/master/LICENSE.md"                                   // 30
      }, "MT License"), '",\n}\n'), "\n			"), "\n		"), "\n	" ];                                                  // 31
    });                                                                                                          // 32
  });                                                                                                            // 33
}));                                                                                                             // 34
                                                                                                                 // 35
Template.__checkName("JetSetter_header_pro");                                                                    // 36
Template["JetSetter_header_pro"] = new Template("Template.JetSetter_header_pro", (function() {                   // 37
  var view = this;                                                                                               // 38
  return Blaze._TemplateWith(function() {                                                                        // 39
    return {                                                                                                     // 40
      name: Spacebars.call("header2")                                                                            // 41
    };                                                                                                           // 42
  }, function() {                                                                                                // 43
    return Spacebars.include(view.lookupTemplate("JetSetter_Component"), function() {                            // 44
      return [ "\n\n		", HTML.STRONG("JetSetter Pro"), "\n		", HTML.DIV({                                        // 45
        "class": "JetSetter_editor"                                                                              // 46
      }, "\n			", HTML.DIV({                                                                                     // 47
        "class": "JetSetter_editor_header"                                                                       // 48
      }, "\n				", HTML.DIV({                                                                                    // 49
        "class": "JetSetter_editor_button JetSetter_button_drop"                                                 // 50
      }, "\n					Add\n				"), "\n				Reactive Dictionaries\n			"), "\n			", HTML.DIV({                           // 51
        "class": "JetSetter_editor_content",                                                                     // 52
        style: "padding-top: 4px"                                                                                // 53
      }, "\n				", Blaze.Each(function() {                                                                       // 54
        return Spacebars.call(view.lookup("ReactiveVar"));                                                       // 55
      }, function() {                                                                                            // 56
        return [ "\n					", HTML.DIV({                                                                           // 57
          "class": "MeteorToys_row"                                                                              // 58
        }, "\n						", HTML.DIV({                                                                                // 59
          "class": "MeteorToys_row_remove"                                                                       // 60
        }, HTML.CharRef({                                                                                        // 61
          html: "&times;",                                                                                       // 62
          str: "×"                                                                                               // 63
        })), "\n						", Blaze.View("lookup:name", function() {                                                  // 64
          return Spacebars.mustache(view.lookup("name"));                                                        // 65
        }), "\n					"), "\n				" ];                                                                              // 66
      }, function() {                                                                                            // 67
        return [ "\n					You are not watching any", HTML.BR(), " reactive dictionaries.\n					To watch,", HTML.BR(), ' simply press the "Add" button.', HTML.BR(), "\n				" ];
      }), "\n			"), "\n		"), "\n		\n	" ];                                                                        // 69
    });                                                                                                          // 70
  });                                                                                                            // 71
}));                                                                                                             // 72
                                                                                                                 // 73
Template.__checkName("JetSetter_reactiveDict_header");                                                           // 74
Template["JetSetter_reactiveDict_header"] = new Template("Template.JetSetter_reactiveDict_header", (function() {
  var view = this;                                                                                               // 76
  return Blaze._TemplateWith(function() {                                                                        // 77
    return {                                                                                                     // 78
      name: Spacebars.call(view.lookup("componentName"))                                                         // 79
    };                                                                                                           // 80
  }, function() {                                                                                                // 81
    return Spacebars.include(view.lookupTemplate("JetSetter_Component"), function() {                            // 82
      return [ "\n		\n		", HTML.DIV({                                                                            // 83
        "class": "JetSetter_dictTitle"                                                                           // 84
      }, "\n			", HTML.STRONG(Blaze.View("lookup:..name", function() {                                           // 85
        return Spacebars.mustache(Spacebars.dot(view.lookup("."), "name"));                                      // 86
      })), "\n			", HTML.DIV("\n				", HTML.STRONG("+"), "\n			"), "\n		"), "\n		\n		", HTML.DIV({               // 87
        "class": "JetSetter_editor"                                                                              // 88
      }, "\n			", HTML.DIV({                                                                                     // 89
        "class": "JetSetter_editor_header"                                                                       // 90
      }, "\n				", HTML.INPUT({                                                                                  // 91
        type: "text",                                                                                            // 92
        "class": "JetSetter_editor_title",                                                                       // 93
        id: function() {                                                                                         // 94
          return [ "JetSetter_new_name_", Spacebars.mustache(Spacebars.dot(view.lookup("."), "name")) ];         // 95
        },                                                                                                       // 96
        placeholder: "Enter Name"                                                                                // 97
      }), HTML.CharRef({                                                                                         // 98
        html: "&nbsp;",                                                                                          // 99
        str: " "                                                                                                 // 100
      }), "\n				", HTML.DIV({                                                                                   // 101
        "class": "JetSetter_editor_button JetSetter_button_new MeteorToys_action"                                // 102
      }, "\n					Set\n				"), "\n			"), "\n			", HTML.DIV({                                                      // 103
        "class": "JetSetter_editor_content JetSetter_editor_create",                                             // 104
        id: function() {                                                                                         // 105
          return [ "JetSetter_new_", Spacebars.mustache(Spacebars.dot(view.lookup("."), "name")) ];              // 106
        },                                                                                                       // 107
        contenteditable: "true",                                                                                 // 108
        style: "cursor: text"                                                                                    // 109
      }), "\n		"), "\n\n	" ];                                                                                    // 110
    });                                                                                                          // 111
  });                                                                                                            // 112
}));                                                                                                             // 113
                                                                                                                 // 114
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_header/JetSetter_header.js                                               //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Template.JetSetter_header_pro.events({                                                                           // 1
	'click .JetSetter_editor_button': function () {                                                                 // 2
		                                                                                                               // 3
		varName = prompt("What's it called?");                                                                         // 4
		target  = window[varName];                                                                                     // 5
                                                                                                                 // 6
		if (typeof target === "undefined") {                                                                           // 7
			alert("The variable you specified does not exist. Please try again.");                                        // 8
			return;                                                                                                       // 9
		}                                                                                                              // 10
		                                                                                                               // 11
		if (typeof target.all === "undefined") {                                                                       // 12
			alert("Invalid variable specified. Please try again");                                                        // 13
		} else {                                                                                                       // 14
			Package["meteortoys:toykit"].MeteorToysData.JetSetter.insert({                                                // 15
				'name': varName                                                                                              // 16
			});                                                                                                           // 17
		}                                                                                                              // 18
                                                                                                                 // 19
	},                                                                                                              // 20
	'click .MeteorToys_row': function () {                                                                          // 21
                                                                                                                 // 22
		var varID = Package["meteortoys:toykit"].MeteorToysData.JetSetter.findOne({                                    // 23
			'name': this.name                                                                                             // 24
		})._id;                                                                                                        // 25
                                                                                                                 // 26
		Package["meteortoys:toykit"].MeteorToysData.JetSetter.remove(varID);                                           // 27
                                                                                                                 // 28
	}                                                                                                               // 29
});                                                                                                              // 30
                                                                                                                 // 31
Template.JetSetter_header_pro.helpers({                                                                          // 32
	ReactiveVar: function () {                                                                                      // 33
		return Package["meteortoys:toykit"].MeteorToysData.JetSetter.find();                                           // 34
	}                                                                                                               // 35
});                                                                                                              // 36
                                                                                                                 // 37
Template.JetSetter_reactiveDict_header.events({                                                                  // 38
	'click .JetSetter_dictTitle': function() {                                                                      // 39
		$("#JetSetter_new_name_" + this.name).focus();                                                                 // 40
	},                                                                                                              // 41
	'click .JetSetter_button_new': function () {                                                                    // 42
		                                                                                                               // 43
		// Capture the Reactive Dictionary                                                                             // 44
		currentDict = window[this.name];                                                                               // 45
                                                                                                                 // 46
		// Get all the values                                                                                          // 47
		name     = $('#JetSetter_new_name_' + this.name).val();                                                        // 48
		contents = $('#JetSetter_new_' + this.name).text();                                                            // 49
		value 	 = Package["meteortoys:toykit"].MeteorToys_JSON.parse(contents);                                        // 50
                                                                                                                 // 51
		// Set the value                                                                                               // 52
		currentDict.set(name, value);                                                                                  // 53
                                                                                                                 // 54
		// Open the box                                                                                                // 55
		var item    = "JetSetter_" + String(this.name) + "_" + name;                                                   // 56
		MeteorToysDict.set("JetSetter_current", item);                                                                 // 57
                                                                                                                 // 58
		// Clear the inputs                                                                                            // 59
		$('#JetSetter_new_name_' + this.name).val("");                                                                 // 60
		$('#JetSetter_new_' + this.name).html = "";                                                                    // 61
                                                                                                                 // 62
	}                                                                                                               // 63
})                                                                                                               // 64
                                                                                                                 // 65
Template.JetSetter_reactiveDict_header.helpers({                                                                 // 66
	'componentName': function () {                                                                                  // 67
		return "header_" + this.name;                                                                                  // 68
	}                                                                                                               // 69
})                                                                                                               // 70
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_dict/template.main.js                                                    //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter_reactive");                                                                      // 2
Template["JetSetter_reactive"] = new Template("Template.JetSetter_reactive", (function() {                       // 3
  var view = this;                                                                                               // 4
  return Blaze.Each(function() {                                                                                 // 5
    return Spacebars.call(view.lookup("ReactiveDrill"));                                                         // 6
  }, function() {                                                                                                // 7
    return [ "\n		", Spacebars.include(view.lookupTemplate("JetSetter_reactiveDict_header")), "\n		", Blaze.Each(function() {
      return Spacebars.call(view.lookup("keys"));                                                                // 9
    }, function() {                                                                                              // 10
      return [ "\n			", Spacebars.include(view.lookupTemplate("JetSetter_reactiveVar_row")), "\n		" ];           // 11
    }), "\n	" ];                                                                                                 // 12
  });                                                                                                            // 13
}));                                                                                                             // 14
                                                                                                                 // 15
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/row_dict/main.js                                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
var _0xf974=["\x73\x65\x73\x73\x69\x6F\x6E","\x61\x6C\x6C","\x66\x75\x6E\x63\x74\x69\x6F\x6E","\x6B\x65\x79\x73","\x53\x65\x73\x73\x69\x6F\x6E","\x70\x75\x73\x68","\x66\x6F\x72\x45\x61\x63\x68","\x61\x75\x74\x68\x65\x6E\x74\x69\x63\x61\x74\x65\x64","\x65\x71\x75\x61\x6C\x73","\x54\x6F\x79\x4B\x69\x74","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x66\x65\x74\x63\x68","\x66\x69\x6E\x64","\x4A\x65\x74\x53\x65\x74\x74\x65\x72","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6E\x61\x6D\x65","\x68\x65\x6C\x70\x65\x72\x73","\x4A\x65\x74\x53\x65\x74\x74\x65\x72\x5F\x72\x65\x61\x63\x74\x69\x76\x65"];Template[_0xf974[17]][_0xf974[16]]({ReactiveDrill:function(){Dictionaries= [];if(Package[_0xf974[0]]){if( typeof Session[_0xf974[1]]== _0xf974[2]){var _0xb9a5x1=[];var _0xb9a5x2=Object[_0xf974[3]](Session[_0xf974[1]]());_0xb9a5x2[_0xf974[6]](function(_0xb9a5x3){_0xb9a5x1[_0xf974[5]]({parent:_0xf974[4],key:_0xb9a5x3})});Dictionaries[_0xf974[5]]({name:_0xf974[4],keys:_0xb9a5x1})}};if(Package[_0xf974[10]][_0xf974[9]][_0xf974[8]](_0xf974[7],true)){DictNames= Package[_0xf974[10]][_0xf974[14]][_0xf974[13]][_0xf974[12]]()[_0xf974[11]]();DictNames[_0xf974[6]](function(_0xb9a5x4){dictionaryName= _0xb9a5x4[_0xf974[15]];_0xb9a5x1= [];_0xb9a5x2= Object[_0xf974[3]](window[_0xb9a5x4[_0xf974[15]]][_0xf974[1]]());_0xb9a5x2[_0xf974[6]](function(_0xb9a5x3){_0xb9a5x1[_0xf974[5]]({parent:dictionaryName,key:_0xb9a5x3})});Dictionaries[_0xf974[5]]({name:dictionaryName,keys:_0xb9a5x1})})};return Dictionaries}})
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/_component/template.component.js                                             //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
                                                                                                                 // 1
Template.__checkName("JetSetter_Component");                                                                     // 2
Template["JetSetter_Component"] = new Template("Template.JetSetter_Component", (function() {                     // 3
  var view = this;                                                                                               // 4
  return HTML.DIV({                                                                                              // 5
    "class": function() {                                                                                        // 6
      return [ "JetSetter_row ", Spacebars.mustache(view.lookup("expand")) ];                                    // 7
    },                                                                                                           // 8
    id: function() {                                                                                             // 9
      return [ "JetSetter_", Spacebars.mustache(view.lookup("name")) ];                                          // 10
    }                                                                                                            // 11
  }, "\n		", Blaze._InOuterTemplateScope(view, function() {                                                      // 12
    return Spacebars.include(function() {                                                                        // 13
      return Spacebars.call(view.templateContentBlock);                                                          // 14
    });                                                                                                          // 15
  }), "\n	");                                                                                                    // 16
}));                                                                                                             // 17
                                                                                                                 // 18
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                               //
// packages/msavin_jetsetter/client/_component/component.js                                                      //
//                                                                                                               //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                 //
Template.JetSetter_Component.helpers({                                                                           // 1
	expand: function () {                                                                                           // 2
	                                                                                                                // 3
	    var current = String(MeteorToysDict.get("JetSetter_current"));                                              // 4
	    var item    = "JetSetter_" + String(this.name);                                                             // 5
                                                                                                                 // 6
	    if (current === item) {                                                                                     // 7
	        return "JetSetter_row_expand";                                                                          // 8
	    }                                                                                                           // 9
                                                                                                                 // 10
	}                                                                                                               // 11
});                                                                                                              // 12
                                                                                                                 // 13
Template.JetSetter_Component.events({                                                                            // 14
	'click .JetSetter_row': function () {                                                                           // 15
                                                                                                                 // 16
		var current = String(MeteorToysDict.get("JetSetter_current"));                                                 // 17
		var target  = "JetSetter_" + String(this.name);                                                                // 18
                                                                                                                 // 19
		if (current === target) {                                                                                      // 20
			MeteorToysDict.set("JetSetter_current", null);                                                                // 21
		} else {                                                                                                       // 22
			MeteorToysDict.set("JetSetter_current", target);                                                              // 23
		}                                                                                                              // 24
                                                                                                                 // 25
		// ensure editing is set to false                                                                              // 26
		MeteorToysDict.set("JetSetter_settings_edit", false)                                                           // 27
                                                                                                                 // 28
		// remove hover element                                                                                        // 29
		$("#JetSetter").removeClass("JetSetter_previewMode");                                                          // 30
		                                                                                                               // 31
		                                                                                                               // 32
	},                                                                                                              // 33
	'click .JetSetter_editor': function (e, t) {                                                                    // 34
	    e.stopPropagation();                                                                                        // 35
	}                                                                                                               // 36
});                                                                                                              // 37
                                                                                                                 // 38
                                                                                                                 // 39
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['msavin:jetsetter'] = {}, {
  JetSetter: JetSetter,
  CloseJetSetter: CloseJetSetter
});

})();
