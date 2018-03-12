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
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var MeteorToysDict, Mongol, updData, newId, self, MongolEditingStatus, Mongol_InlineEditor, current, content, DocumentPosition, CurrentCollection, a, b, colorized, sessionKey, CollectionName, CollectionCount, CurrentDocument, DocumentID, ValidatedCurrentDocument, list, docID, docIndex, currentDoc, newPosition;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/lib/common.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0xaa99=["\x69\x73\x43\x6C\x69\x65\x6E\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x73\x74\x61\x72\x74\x75\x70","\x4D\x6F\x6E\x67\x6F\x6C\x44\x6F\x63\x5F","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x74\x65\x78\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x54\x68\x65\x72\x65\x20\x69\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x77\x69\x74\x68\x20\x79\x6F\x75\x72\x20\x4A\x53\x4F\x4E\x20\x73\x79\x6E\x74\x61\x78\x2E\x0A\x0A\x4E\x6F\x74\x65\x3A\x20\x6B\x65\x79\x73\x20\x61\x6E\x64\x20\x73\x74\x72\x69\x6E\x67\x20\x76\x61\x6C\x75\x65\x73\x20\x6E\x65\x65\x64\x20\x64\x6F\x75\x62\x6C\x65\x20\x71\x75\x6F\x74\x65\x73\x2E","\x6A\x73\x6F\x6E\x2E\x70\x61\x72\x73\x65","\x53\x74\x72\x61\x6E\x67\x65\x2C\x20\x74\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x64\x75\x70\x6C\x69\x63\x61\x74\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x2E","\x64\x75\x70\x6C\x69\x63\x61\x74\x65","\x53\x74\x72\x61\x6E\x67\x65\x2C\x20\x74\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x72\x65\x6D\x6F\x76\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x2E","\x72\x65\x6D\x6F\x76\x65","\x53\x74\x72\x61\x6E\x67\x65\x2C\x20\x74\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x69\x6E\x73\x65\x72\x74\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x2E","\x69\x6E\x73\x65\x72\x74","\x54\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x75\x70\x64\x61\x74\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x2E\x20\x50\x6C\x65\x61\x73\x65\x20\x72\x65\x76\x69\x65\x77\x20\x79\x6F\x75\x72\x20\x63\x68\x61\x6E\x67\x65\x73\x20\x61\x6E\x64\x20\x74\x72\x79\x20\x61\x67\x61\x69\x6E\x2E","\x75\x70\x64\x61\x74\x65","\x55\x6E\x6B\x6E\x6F\x77\x6E\x20\x45\x72\x72\x6F\x72","\x69\x73\x53\x74\x72\x69\x6E\x67","\x65\x78\x65\x63","\x70\x61\x72\x73\x65","\x65\x72\x72\x6F\x72","\x4D\x6F\x6E\x67\x6F\x6C","\x67\x65\x74","\x67\x65\x74\x41\x6C\x6C","\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x6E\x61\x6D\x65","\x6D\x61\x70","\x73\x65\x74","\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73","\x77\x69\x74\x68\x6F\x75\x74","\x70\x75\x73\x68","\x76\x65\x6C\x6F\x63\x69\x74\x79\x54\x65\x73\x74\x46\x69\x6C\x65\x73","\x68\x69\x64\x65\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x76\x65\x6C\x6F\x63\x69\x74\x79\x46\x69\x78\x74\x75\x72\x65\x46\x69\x6C\x65\x73","\x76\x65\x6C\x6F\x63\x69\x74\x79\x54\x65\x73\x74\x52\x65\x70\x6F\x72\x74\x73","\x76\x65\x6C\x6F\x63\x69\x74\x79\x41\x67\x67\x72\x65\x67\x61\x74\x65\x52\x65\x70\x6F\x72\x74\x73","\x76\x65\x6C\x6F\x63\x69\x74\x79\x4C\x6F\x67\x73","\x76\x65\x6C\x6F\x63\x69\x74\x79\x4D\x69\x72\x72\x6F\x72\x73","\x76\x65\x6C\x6F\x63\x69\x74\x79\x4F\x70\x74\x69\x6F\x6E\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x49\x6D\x70\x65\x72\x73\x6F\x6E\x61\x74\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x4A\x65\x74\x53\x65\x74\x74\x65\x72","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x4D\x6F\x6E\x67\x6F\x6C","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x41\x75\x74\x6F\x50\x75\x62","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x45\x6D\x61\x69\x6C","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x52\x65\x73\x75\x6C\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x54\x68\x72\x6F\x74\x74\x6C\x65","\x6D\x65\x74\x65\x6F\x72\x5F\x61\x63\x63\x6F\x75\x6E\x74\x73\x5F\x6C\x6F\x67\x69\x6E\x53\x65\x72\x76\x69\x63\x65\x43\x6F\x6E\x66\x69\x67\x75\x72\x61\x74\x69\x6F\x6E","\x6D\x65\x74\x65\x6F\x72\x5F\x61\x75\x74\x6F\x75\x70\x64\x61\x74\x65\x5F\x63\x6C\x69\x65\x6E\x74\x56\x65\x72\x73\x69\x6F\x6E\x73","\x69\x73\x53\x65\x72\x76\x65\x72","\x2E","\x73\x70\x6C\x69\x74","\x63\x6F\x6E\x63\x61\x74","\x61\x70\x70\x6C\x79","\x5F\x67\x65\x74","\x74\x6F\x55\x70\x70\x65\x72\x43\x61\x73\x65","\x63\x68\x61\x72\x41\x74","\x73\x75\x62\x73\x74\x72","\x61\x6C\x64\x65\x65\x64\x3A\x73\x69\x6D\x70\x6C\x65\x2D\x73\x63\x68\x65\x6D\x61","\x61\x6C\x64\x65\x65\x64\x3A\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x32","\x73\x69\x6D\x70\x6C\x65\x53\x63\x68\x65\x6D\x61","\x69\x73\x46\x75\x6E\x63\x74\x69\x6F\x6E","\x5F\x63\x32"];if(Meteor[_0xaa99[0]]){Meteor[_0xaa99[3]](function(){MeteorToysDict= Package[_0xaa99[2]][_0xaa99[1]]})};if(Mongol=== undefined){Mongol= {}};Mongol= {"\x67\x65\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74\x55\x70\x64\x61\x74\x65":function(_0xaaa9x1){var _0xaaa9x2=_0xaa99[4]+ _0xaaa9x1,_0xaaa9x3=false;updData= document[_0xaa99[5]](_0xaaa9x2);if(updData){_0xaaa9x3= updData[_0xaa99[6]]};return _0xaaa9x3},"\x65\x72\x72\x6F\x72":function(_0xaaa9x1){switch(_0xaaa9x1){case _0xaa99[8]:alert(_0xaa99[7]);break;case _0xaa99[10]:alert(_0xaa99[9]);break;case _0xaa99[12]:alert(_0xaa99[11]);break;case _0xaa99[14]:alert(_0xaa99[13]);break;case _0xaa99[16]:alert(_0xaa99[15]);break;default:return _0xaa99[17];break}},"\x70\x61\x72\x73\x65":function(_0xaaa9x1){var _0xaaa9x4=null;try{var _0xaaa9x5=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;var _0xaaa9x6=function(_0xaaa9x7,_0xaaa9x8){if(_[_0xaa99[18]](_0xaaa9x8)){var _0xaaa9x9=_0xaaa9x5[_0xaa99[19]](_0xaaa9x8);if(_0xaaa9x9){return  new Date(_0xaaa9x8)}};return _0xaaa9x8};_0xaaa9x4= JSON[_0xaa99[20]](_0xaaa9x1,_0xaaa9x6)}catch(error){Mongol[_0xaa99[21]](_0xaa99[8])};return _0xaaa9x4},"\x64\x65\x74\x65\x63\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73":function(){if(MeteorToysDict[_0xaa99[23]](_0xaa99[22])=== undefined){var _0xaaa9xa=_[_0xaa99[27]](Mongo[_0xaa99[25]][_0xaa99[24]](),function(_0xaaa9xb){return _0xaaa9xb[_0xaa99[26]]});var _0xaaa9xc={"\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73":_0xaaa9xa};MeteorToysDict[_0xaa99[28]](_0xaa99[22],_0xaaa9xc)}},"\x68\x69\x64\x65\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E":function(_0xaaa9xd){var _0xaaa9xe=MeteorToysDict[_0xaa99[23]](_0xaa99[22]),_0xaaa9xa=_0xaaa9xe[_0xaa99[29]];_0xaaa9xa= _[_0xaa99[30]](_0xaaa9xa,_0xaaa9xd);_0xaaa9xe[_0xaa99[29]]= _0xaaa9xa;MeteorToysDict[_0xaa99[28]](_0xaa99[22],_0xaaa9xe)},"\x73\x68\x6F\x77\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E":function(_0xaaa9xd){var _0xaaa9xe=MeteorToysDict[_0xaa99[23]](_0xaa99[22]),_0xaaa9xa=_0xaaa9xe[_0xaa99[29]];_0xaaa9xa[_0xaa99[31]](_0xaaa9xd);MeteorToysDict[_0xaa99[28]](_0xaa99[22],_0xaaa9xe)},"\x68\x69\x64\x65\x56\x65\x6C\x6F\x63\x69\x74\x79":function(){this[_0xaa99[33]](_0xaa99[32]);this[_0xaa99[33]](_0xaa99[34]);this[_0xaa99[33]](_0xaa99[35]);this[_0xaa99[33]](_0xaa99[36]);this[_0xaa99[33]](_0xaa99[37]);this[_0xaa99[33]](_0xaa99[38]);this[_0xaa99[33]](_0xaa99[39])},"\x68\x69\x64\x65\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73":function(){this[_0xaa99[33]](_0xaa99[40]);this[_0xaa99[33]](_0xaa99[41]);this[_0xaa99[33]](_0xaa99[42]);this[_0xaa99[33]](_0xaa99[43]);this[_0xaa99[33]](_0xaa99[44]);this[_0xaa99[33]](_0xaa99[45]);this[_0xaa99[33]](_0xaa99[46])},"\x68\x69\x64\x65\x4D\x65\x74\x65\x6F\x72":function(){this[_0xaa99[33]](_0xaa99[47]);this[_0xaa99[33]](_0xaa99[48])},"\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E":function(_0xaaa9xd){return Mongo[_0xaa99[25]][_0xaa99[23]](_0xaaa9xd)|| ((Meteor[_0xaa99[49]])?eval(_0xaaa9xd):Meteor[_0xaa99[54]][_0xaa99[53]](null,[window][_0xaa99[52]](_0xaaa9xd[_0xaa99[51]](_0xaa99[50]))))|| ((Meteor[_0xaa99[49]])?eval(_0xaaa9xf(_0xaaa9xd)):Meteor[_0xaa99[54]][_0xaa99[53]](null,[window][_0xaa99[52]](_0xaaa9xf(_0xaaa9xd)[_0xaa99[51]](_0xaa99[50]))))|| null;function _0xaaa9xf(_0xaaa9x10){return _0xaaa9x10[_0xaa99[56]](0)[_0xaa99[55]]()+ _0xaaa9x10[_0xaa99[57]](1)}},"\x69\x6E\x73\x65\x72\x74\x44\x6F\x63":function(_0xaaa9x11,_0xaaa9x12){check(_0xaaa9x11,Match.Any);check(_0xaaa9x12,Match.Any);if(!!Package[_0xaa99[58]]&&  !!Package[_0xaa99[59]] && _[_0xaa99[61]](_0xaaa9x11[_0xaa99[60]]) && _0xaaa9x11[_0xaa99[62]]){newId= _0xaaa9x11[_0xaa99[14]](_0xaaa9x12,{filter:false,autoConvert:false,removeEmptyStrings:false,validate:false})}else {newId= _0xaaa9x11[_0xaa99[14]](_0xaaa9x12)};return newId}}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_header/template.header.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_header");                                                                                 // 2
Template["Mongol_header"] = new Template("Template.Mongol_header", (function() {                                       // 3
  var view = this;                                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                                              // 5
    return {                                                                                                           // 6
      name: Spacebars.call("mongol_618")                                                                               // 7
    };                                                                                                                 // 8
  }, function() {                                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 10
      return [ "\n\n    ", HTML.STRONG("Mongol"), HTML.BR(), "\n    ", HTML.DIV({                                      // 11
        "class": "Mongol_contentView"                                                                                  // 12
      }, "\n    ", HTML.Comment("  "), "\n      ", HTML.DIV({                                                          // 13
        "class": "Mongol_docMenu",                                                                                     // 14
        style: "text-indent: 8px"                                                                                      // 15
      }, "\n        In-App MongoDB Editor\n      "), "\n      ", HTML.DIV({                                            // 16
        "class": "Mongol_documentViewer "                                                                              // 17
      }, "\n", HTML.PRE({                                                                                              // 18
        "class": "MeteorToys-off"                                                                                      // 19
      }, "{ \n  ", HTML.SPAN({                                                                                         // 20
        "class": "MeteorToys_key"                                                                                      // 21
      }, '"created_by"'), ': "', HTML.A({                                                                              // 22
        href: "http://maxsavin.com"                                                                                    // 23
      }, "Max Savin"), '",\n  ', HTML.SPAN({                                                                           // 24
        "class": "MeteorToys_key"                                                                                      // 25
      }, '"docs_at"'), ':    "', HTML.A({                                                                              // 26
        href: "https://meteor.toys"                                                                                    // 27
      }, "Meteor Toys"), '",\n  ', HTML.SPAN({                                                                         // 28
        "class": "MeteorToys_key"                                                                                      // 29
      }, '"license"'), ':    "', HTML.A({                                                                              // 30
        href: "https://github.com/MeteorToys/allthings/blob/master/LICENSE.md"                                         // 31
      }, "MT License"), '",\n  ', HTML.SPAN({                                                                          // 32
        "class": "MeteorToys_key"                                                                                      // 33
      }, '"alsoSee"'), ':    "', HTML.A({                                                                              // 34
        href: "https://meteorcandy.com/?ref=header"                                                                    // 35
      }, "Meteor Candy"), '",\n}\n'), "\n      "), "\n    ", HTML.Comment("  "), "\n    "), "\n\n  " ];                // 36
    });                                                                                                                // 37
  });                                                                                                                  // 38
}));                                                                                                                   // 39
                                                                                                                       // 40
Template.__checkName("Mongol_header_pro");                                                                             // 41
Template["Mongol_header_pro"] = new Template("Template.Mongol_header_pro", (function() {                               // 42
  var view = this;                                                                                                     // 43
  return Blaze._TemplateWith(function() {                                                                              // 44
    return {                                                                                                           // 45
      name: Spacebars.call("cmongol_618")                                                                              // 46
    };                                                                                                                 // 47
  }, function() {                                                                                                      // 48
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 49
      return [ "\n    ", HTML.STRONG("Mongol Pro"), HTML.BR(), "\n    ", HTML.DIV({                                    // 50
        "class": "Mongol_contentView"                                                                                  // 51
      }, "\n      ", HTML.Comment("  "), "\n      ", HTML.DIV({                                                        // 52
        "class": "Mongol_docMenu",                                                                                     // 53
        style: "text-indent: 8px"                                                                                      // 54
      }, "\n        Reset a Collection\n      "), "\n      ", HTML.DIV({                                               // 55
        "class": "Mongol_documentViewer ",                                                                             // 56
        style: "padding-top: 0px"                                                                                      // 57
      }, "\n        ", HTML.Comment(' <div class="MeteorToys_row Mongol_Impersonation MeteorToys_row_hoverable" style="margin-top: 0px">\n          Reset All Collections\n        </div> '), "\n        ", HTML.DIV({
        "class": "MeteorToys_row Mongol_All MeteorToys_row_hoverable",                                                 // 59
        style: "margin-top: 0px; line-height: 20px"                                                                    // 60
      }, "\n          All Collections + localStorage\n        "), "\n        ", HTML.DIV({                             // 61
        "class": "MeteorToys_row Mongol_MeteorToys MeteorToys_row_hoverable",                                          // 62
        style: "margin-top: 0px; line-height: 20px"                                                                    // 63
      }, "\n          Meteor Toys\n        "), "\n        ", HTML.DIV({                                                // 64
        "class": "MeteorToys_row Mongol_Impersonation MeteorToys_row_hoverable",                                       // 65
        style: "margin-top: 0px; line-height: 20px"                                                                    // 66
      }, "\n          Authenticate Toy\n        "), "\n        ", Blaze.Each(function() {                              // 67
        return Spacebars.call(view.lookup("collection"));                                                              // 68
      }, function() {                                                                                                  // 69
        return [ "\n          ", Blaze.If(function() {                                                                 // 70
          return Spacebars.call(view.lookup("."));                                                                     // 71
        }, function() {                                                                                                // 72
          return [ "\n            ", HTML.DIV({                                                                        // 73
            "class": "MeteorToys_row MeteorToys_row_reset MeteorToys_row_hoverable",                                   // 74
            style: "margin-top: 0px; line-height: 20px"                                                                // 75
          }, "\n              ", Blaze.View("lookup:.", function() {                                                   // 76
            return Spacebars.mustache(view.lookup("."));                                                               // 77
          }), " \n            "), "\n          " ];                                                                    // 78
        }), "\n        " ];                                                                                            // 79
      }), "\n      "), "\n    "), "\n  " ];                                                                            // 80
    });                                                                                                                // 81
  });                                                                                                                  // 82
}));                                                                                                                   // 83
                                                                                                                       // 84
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_header/header.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0xf23a=["\x54\x68\x69\x73\x20\x77\x69\x6C\x6C\x20\x70\x65\x72\x6D\x61\x6E\x65\x6E\x74\x6C\x79\x20\x72\x65\x6D\x6F\x76\x65\x20\x61\x6C\x6C\x20\x74\x68\x65\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x73\x20\x69\x6E\x20","\x2E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x73\x65\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x53\x6F\x72\x72\x79\x2C\x20\x74\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x72\x65\x6D\x6F\x76\x69\x6E\x67\x20","\x63\x61\x6C\x6C","\x54\x68\x69\x73\x20\x77\x69\x6C\x6C\x20\x70\x65\x72\x6D\x61\x6E\x65\x6E\x74\x6C\x79\x20\x72\x65\x6D\x6F\x76\x65\x20\x61\x6C\x6C\x20\x74\x68\x65\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x73\x20\x69\x6E\x20\x79\x6F\x75\x72\x20\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73\x2E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x73\x65\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73","\x53\x6F\x72\x72\x79\x2C\x20\x74\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x72\x65\x6D\x6F\x76\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73\x2E","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x49\x6D\x70\x65\x72\x73\x6F\x6E\x61\x74\x65","\x54\x68\x69\x73\x20\x77\x69\x6C\x6C\x20\x72\x65\x73\x65\x74\x20\x79\x6F\x75\x72\x20\x41\x75\x74\x68\x65\x6E\x74\x69\x63\x61\x74\x69\x6F\x6E\x20\x72\x65\x63\x65\x6E\x74\x73\x20\x6C\x69\x73\x74","\x54\x68\x69\x73\x20\x77\x69\x6C\x6C\x20\x72\x65\x73\x65\x74\x20\x61\x6C\x6C\x20\x79\x6F\x75\x72\x20\x4D\x65\x74\x65\x6F\x72\x20\x54\x6F\x79\x73\x20\x64\x61\x74\x61\x2E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x73\x65\x74\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x54\x68\x69\x73\x20\x77\x69\x6C\x6C\x20\x72\x65\x73\x65\x74\x20\x61\x6C\x6C\x20\x79\x6F\x75\x72\x20\x4D\x65\x74\x65\x6F\x72\x20\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73\x20\x61\x6E\x64\x20\x6C\x6F\x63\x61\x6C\x53\x74\x6F\x72\x61\x67\x65\x2E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x73\x65\x74\x41\x6C\x6C","\x63\x6C\x65\x61\x72","\x72\x65\x6C\x6F\x61\x64","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x68\x65\x61\x64\x65\x72\x5F\x70\x72\x6F","\x4D\x6F\x6E\x67\x6F\x6C","\x67\x65\x74","\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73","\x68\x65\x6C\x70\x65\x72\x73"];Template[_0xf23a[18]][_0xf23a[17]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x72\x6F\x77\x5F\x72\x65\x73\x65\x74":function(){self= String(this);if(confirm(_0xf23a[0]+ self+ _0xf23a[1])){Meteor[_0xf23a[4]](_0xf23a[2],self,function(_0xf1e3x1,_0xf1e3x2){if(_0xf1e3x1){alert(_0xf23a[3]+ self+ _0xf23a[1])}})}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x72\x6F\x77\x5F\x72\x65\x73\x65\x74\x5F\x61\x6C\x6C":function(){if(confirm(_0xf23a[5])){Meteor[_0xf23a[4]](_0xf23a[6],self,function(_0xf1e3x1,_0xf1e3x2){if(_0xf1e3x1){alert(_0xf23a[7])}})}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x49\x6D\x70\x65\x72\x73\x6F\x6E\x61\x74\x69\x6F\x6E":function(){self= _0xf23a[8];if(confirm(_0xf23a[9])){Meteor[_0xf23a[4]](_0xf23a[2],self,function(_0xf1e3x1,_0xf1e3x2){if(_0xf1e3x1){alert(_0xf23a[3]+ self+ _0xf23a[1])}})}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73":function(){if(confirm(_0xf23a[10])){Meteor[_0xf23a[4]](_0xf23a[11],self,function(_0xf1e3x1,_0xf1e3x2){})}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x41\x6C\x6C":function(){if(confirm(_0xf23a[12])){Meteor[_0xf23a[4]](_0xf23a[13],function(_0xf1e3x1,_0xf1e3x2){if(_0xf1e3x1){alert(_0xf23a[3]+ self+ _0xf23a[1])};if(_0xf1e3x2){MeteorToys[_0xf23a[14]]();window[_0xf23a[16]][_0xf23a[15]]()}})}}});Template[_0xf23a[18]][_0xf23a[22]]({collection:function(){var _0xf1e3x3=MeteorToysDict[_0xf23a[20]](_0xf23a[19]);return _0xf1e3x3[_0xf23a[21]]}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_editor/template.docViewer.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_docViewer");                                                                              // 2
Template["Mongol_docViewer"] = new Template("Template.Mongol_docViewer", (function() {                                 // 3
  var view = this;                                                                                                     // 4
  return Blaze.If(function() {                                                                                         // 5
    return Spacebars.call(view.lookup("notEmpty"));                                                                    // 6
  }, function() {                                                                                                      // 7
    return [ "\n    ", Spacebars.include(view.lookupTemplate("Mongol_docControls")), "\n    ", Spacebars.With(function() {
      return Spacebars.call(view.lookup("activeDocument"));                                                            // 9
    }, function() {                                                                                                    // 10
      return [ "\n      ", Blaze.If(function() {                                                                       // 11
        return Spacebars.call(view.lookup("editStyle"));                                                               // 12
      }, function() {                                                                                                  // 13
        return [ "\n        ", HTML.DIV({                                                                              // 14
          "class": function() {                                                                                        // 15
            return [ "Mongol_documentViewer ", Spacebars.mustache(view.lookup("editStyle")) ];                         // 16
          },                                                                                                           // 17
          id: function() {                                                                                             // 18
            return [ "MongolDoc_", Spacebars.mustache(view.lookup("..")) ];                                            // 19
          },                                                                                                           // 20
          contenteditable: function() {                                                                                // 21
            return Spacebars.mustache(view.lookup("editContent"));                                                     // 22
          }                                                                                                            // 23
        }, "  \n          ", HTML.PRE({                                                                                // 24
          spellcheck: "false"                                                                                          // 25
        }, Blaze.View("lookup:normalJSON", function() {                                                                // 26
          return Spacebars.makeRaw(Spacebars.mustache(view.lookup("normalJSON")));                                     // 27
        })), "\n        "), "\n      " ];                                                                              // 28
      }, function() {                                                                                                  // 29
        return [ "\n        ", HTML.DIV({                                                                              // 30
          "class": function() {                                                                                        // 31
            return [ "Mongol_documentViewer ", Spacebars.mustache(view.lookup("editStyle")) ];                         // 32
          },                                                                                                           // 33
          id: function() {                                                                                             // 34
            return [ "MongolDoc_", Spacebars.mustache(view.lookup("..")) ];                                            // 35
          },                                                                                                           // 36
          contenteditable: function() {                                                                                // 37
            return Spacebars.mustache(view.lookup("editContent"));                                                     // 38
          }                                                                                                            // 39
        }, "  \n            ", HTML.PRE({                                                                              // 40
          spellcheck: "false"                                                                                          // 41
        }, Blaze.View("lookup:editableJSON", function() {                                                              // 42
          return Spacebars.makeRaw(Spacebars.mustache(view.lookup("editableJSON")));                                   // 43
        })), "\n        "), "\n      " ];                                                                              // 44
      }), "\n    " ];                                                                                                  // 45
    }, function() {                                                                                                    // 46
      return [ "\n      ", HTML.DIV({                                                                                  // 47
        "class": "Mongol_documentViewer",                                                                              // 48
        id: function() {                                                                                               // 49
          return [ "MongolDoc_", Spacebars.mustache(view.lookup(".")) ];                                               // 50
        }                                                                                                              // 51
      }, "  \n        ", HTML.PRE("No document found"), "\n      "), "\n    " ];                                       // 52
    }), "\n  " ];                                                                                                      // 53
  }, function() {                                                                                                      // 54
    return [ "\n    ", Spacebars.include(view.lookupTemplate("Mongol_docInsert")), "\n  " ];                           // 55
  });                                                                                                                  // 56
}));                                                                                                                   // 57
                                                                                                                       // 58
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_editor/docViewer.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x7aee=["\x66\x65\x74\x63\x68","\x66\x69\x6E\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x67\x65\x74","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x63\x6F\x6C\x6F\x72\x69\x7A\x65\x45\x64\x69\x74\x61\x62\x6C\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x4A\x53\x4F\x4E","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x4D\x6F\x64\x65","\x74\x72\x75\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x61\x62\x6C\x65","\x63\x6F\x75\x6E\x74","\x68\x65\x6C\x70\x65\x72\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x56\x69\x65\x77\x65\x72"];Template[_0x7aee[13]][_0x7aee[12]]({activeDocument:function(){var _0x906cx1=String(this);var _0x906cx2=Mongol.Collection(_0x906cx1);var _0x906cx3=_0x906cx2[_0x7aee[1]]({},{transform:null})[_0x7aee[0]]();var _0x906cx4=_0x7aee[2]+ String(this);var _0x906cx5=MeteorToysDict[_0x7aee[3]](_0x906cx4);var _0x906cx6=_0x906cx3[_0x906cx5];return _0x906cx6},editableJSON:function(){var _0x906cx6=this;var _0x906cx7=JSON[_0x7aee[4]](_0x906cx6,null,2),_0x906cx8;if(!(_0x906cx7=== undefined)){_0x906cx8= Package[_0x7aee[7]][_0x7aee[6]][_0x7aee[5]](_0x906cx7)}else {_0x906cx8= _0x906cx7};return _0x906cx8},normalJSON:function(){var _0x906cx6=this,_0x906cx7=JSON[_0x7aee[4]](_0x906cx6,null,2);return _0x906cx7},editContent:function(){var _0x906cx9=MeteorToysDict[_0x7aee[3]](_0x7aee[8]);if(_0x906cx9){return _0x7aee[9]}},editStyle:function(){var _0x906cx9=MeteorToysDict[_0x7aee[3]](_0x7aee[8]);if(_0x906cx9){return _0x7aee[10]}},notEmpty:function(){var _0x906cxa=Mongol.Collection(String(this))&& Mongol.Collection(String(this))[_0x7aee[1]]()[_0x7aee[11]]()|| 0;if(_0x906cxa>= 1){return true}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_editor/inline.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x761c=["\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x75\x72\x72\x65\x6E\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x67\x65\x74","\x68\x74\x6D\x6C","\x23\x4D\x6F\x6E\x67\x6F\x6C\x44\x6F\x63\x5F","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x62\x61\x63\x6B\x75\x70","\x73\x65\x74","\x74\x65\x78\x74","\x23\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63","\x20\x70\x72\x65","\x69\x73\x53\x74\x72\x69\x6E\x67","\x65\x78\x65\x63","\x70\x61\x72\x73\x65","\x72\x65\x73\x74\x6F\x72\x65\x42\x61\x63\x6B\x75\x70","\x61\x63\x63\x6F\x75\x6E\x74\x5F\x36\x31\x38","\x65\x71\x75\x61\x6C\x73","\x75\x73\x65\x72\x73","\x67\x65\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74\x55\x70\x64\x61\x74\x65","\x67\x65\x74\x44\x61\x74\x61","\x75\x73\x65\x72","\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x66\x65\x74\x63\x68","\x66\x69\x6E\x64","","\x20","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x75\x70\x64\x61\x74\x65","\x76\x61\x6C\x69\x64\x61\x74\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x75\x70\x64\x61\x74\x65","\x65\x72\x72\x6F\x72","\x63\x61\x6C\x6C","\x6B\x65\x79\x43\x6F\x64\x65","\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x62\x6C\x75\x72","\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65\x3A\x66\x6F\x63\x75\x73","\x6B\x65\x79\x64\x6F\x77\x6E","\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65","\x67\x65\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x65\x6D\x70\x74\x79","\x72\x65\x6D\x6F\x76\x65\x41\x6C\x6C\x52\x61\x6E\x67\x65\x73","\x73\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x4D\x6F\x64\x65","\x75\x70\x64\x61\x74\x65\x44\x61\x74\x61","\x72\x65\x6D\x6F\x76\x65\x54\x65\x78\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x62\x69\x6E\x64\x48\x6F\x74\x6B\x65\x79\x73","\x63\x72\x65\x61\x74\x65\x42\x61\x63\x6B\x75\x70","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x56\x69\x65\x77\x65\x72"];MongolEditingStatus= false;Mongol_InlineEditor= {createBackup:function(){current= MeteorToysDict[_0x761c[1]](_0x761c[0]);content= $(_0x761c[3]+ current)[_0x761c[2]]();MeteorToysDict[_0x761c[5]](_0x761c[4],content)},restoreBackup:function(){current= MeteorToysDict[_0x761c[1]](_0x761c[0]);content= MeteorToysDict[_0x761c[1]](_0x761c[4]);$(_0x761c[3]+ current)[_0x761c[2]](content)},clearBackup:function(){MeteorToysDict[_0x761c[5]](_0x761c[4],null)},getData:function(){var _0x48f9x1=MeteorToysDict[_0x761c[1]](_0x761c[0]),_0x48f9x2=$(_0x761c[7]+ _0x48f9x1+ _0x761c[8])[_0x761c[6]]();var _0x48f9x3=null;try{var _0x48f9x4=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;var _0x48f9x5=function(_0x48f9x6,_0x48f9x7){if(_[_0x761c[9]](_0x48f9x7)){var _0x48f9x8=_0x48f9x4[_0x761c[10]](_0x48f9x7);if(_0x48f9x8){return  new Date(_0x48f9x7)}};return _0x48f9x7};_0x48f9x3= JSON[_0x761c[11]](_0x48f9x2,_0x48f9x5)}catch(error){Mongol_InlineEditor[_0x761c[12]]()};return _0x48f9x3},updateData:function(){var _0x48f9x9=(MeteorToysDict[_0x761c[14]](_0x761c[0],_0x761c[13]))?_0x761c[15]:MeteorToysDict[_0x761c[1]](_0x761c[0]),_0x48f9xa,_0x48f9x3,_0x48f9xb;if(MeteorToysDict[_0x761c[14]](_0x761c[0],_0x761c[13])){_0x48f9xb= Mongol[_0x761c[16]](_0x761c[13]);_0x48f9x3= Mongol_InlineEditor[_0x761c[17]]();_0x48f9xa= Meteor[_0x761c[18]]()}else {var _0x48f9xc=_0x761c[19]+ _0x48f9x9;DocumentPosition= MeteorToysDict[_0x761c[1]](_0x48f9xc),CurrentCollection= Mongol.Collection(_0x48f9x9)[_0x761c[21]]({},{transform:null})[_0x761c[20]]();_0x48f9xb= Mongol[_0x761c[16]](_0x48f9x9);_0x48f9x3= Mongol_InlineEditor[_0x761c[17]]();_0x48f9xa= CurrentCollection[DocumentPosition]};delete _0x48f9x3[_0x761c[22]];delete _0x48f9x3[_0x761c[23]];if(_0x48f9x3){Meteor[_0x761c[28]](_0x761c[24],_0x48f9x9,_0x48f9x3,Mongol[_0x761c[25]](_0x48f9xa),function(_0x48f9xd,_0x48f9xe){if(!_0x48f9xd){}else {Mongol[_0x761c[27]](_0x761c[26]);Mongol_InlineEditor[_0x761c[12]]()}})}},bindHotkeys:function(){$(_0x761c[34])[_0x761c[33]](function(_0x48f9xf){if(_0x48f9xf[_0x761c[29]]== 10|| _0x48f9xf[_0x761c[29]]== 13){_0x48f9xf[_0x761c[30]]();$(_0x761c[32])[_0x761c[31]]()};if(_0x48f9xf[_0x761c[29]]== 27){Mongol_InlineEditor[_0x761c[12]]();$(_0x761c[32])[_0x761c[31]]()}})},removeTextSelection:function(){if(window[_0x761c[35]]){if(window[_0x761c[35]]()[_0x761c[36]]){window[_0x761c[35]]()[_0x761c[36]]()}else {if(window[_0x761c[35]]()[_0x761c[37]]){window[_0x761c[35]]()[_0x761c[37]]()}}}else {if(document[_0x761c[38]]){document[_0x761c[38]][_0x761c[36]]()}}}};Template[_0x761c[46]][_0x761c[45]]({"\x64\x62\x6C\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x75\x6D\x65\x6E\x74\x56\x69\x65\x77\x65\x72":function(){MeteorToysDict[_0x761c[5]](_0x761c[39],true)},"\x66\x6F\x63\x75\x73\x6F\x75\x74\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(){try{a= Mongol_InlineEditor[_0x761c[40]]();b= Mongol_InlineEditor[_0x761c[41]]()}catch(e){}},"\x66\x6F\x63\x75\x73\x69\x6E\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(){a= Mongol_InlineEditor[_0x761c[42]]();b= Mongol_InlineEditor[_0x761c[43]]()},"\x64\x62\x6C\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(_0x48f9x10,_0x48f9x11){_0x48f9x10[_0x761c[44]]()}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_account/template.account.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_account");                                                                                // 2
Template["Mongol_account"] = new Template("Template.Mongol_account", (function() {                                     // 3
  var view = this;                                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                                              // 5
    return {                                                                                                           // 6
      name: Spacebars.call("account_618")                                                                              // 7
    };                                                                                                                 // 8
  }, function() {                                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 10
      return [ "\n\n			", HTML.Comment(" Display sign in status "), "\n			", Blaze.If(function() {                     // 11
        return Spacebars.call(view.lookup("currentUser"));                                                             // 12
      }, function() {                                                                                                  // 13
        return [ "\n				", HTML.DIV({                                                                                  // 14
          "class": "Mongol_account_state MeteorToys-background-green"                                                  // 15
        }), "\n			" ];                                                                                                 // 16
      }, function() {                                                                                                  // 17
        return [ "\n				", HTML.DIV({                                                                                  // 18
          "class": "Mongol_account_state MeteorToys-background-red"                                                    // 19
        }), "\n			" ];                                                                                                 // 20
      }), "\n\n			", HTML.Comment(" Row Name "), "\n			", HTML.DIV({                                                   // 21
        "class": "Mongol_icon Mongol_icon_user"                                                                        // 22
      }), "\n			Account\n     \n        ", HTML.DIV({                                                                  // 23
        "class": "Mongol_contentView"                                                                                  // 24
      }, "\n\n			", HTML.Comment(" Document Viewer "), "\n			", Blaze.If(function() {                                  // 25
        return Spacebars.call(view.lookup("currentUser"));                                                             // 26
      }, function() {                                                                                                  // 27
        return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_accountViewer")), "\n			" ];                  // 28
      }, function() {                                                                                                  // 29
        return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_accountViewer_notSignedIn")), "\n			" ];      // 30
      }), "\n\n		"), "\n\n	" ];                                                                                        // 31
    });                                                                                                                // 32
  });                                                                                                                  // 33
}));                                                                                                                   // 34
                                                                                                                       // 35
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_account/account.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_account/template.accountViewer.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_accountViewer");                                                                          // 2
Template["Mongol_accountViewer"] = new Template("Template.Mongol_accountViewer", (function() {                         // 3
  var view = this;                                                                                                     // 4
  return [ Spacebars.include(view.lookupTemplate("Mongol_docControls")), "\n\n	", HTML.DIV({                           // 5
    "class": function() {                                                                                              // 6
      return [ "Mongol_documentViewer ", Spacebars.mustache(view.lookup("editStyle")) ];                               // 7
    },                                                                                                                 // 8
    id: "MongolDoc_account_618",                                                                                       // 9
    contenteditable: function() {                                                                                      // 10
      return Spacebars.mustache(view.lookup("editContent"));                                                           // 11
    }                                                                                                                  // 12
  }, "	\n		", HTML.PRE(Blaze.View("lookup:accountData", function() {                                                   // 13
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("accountData")));                                          // 14
  })), "\n	") ];                                                                                                       // 15
}));                                                                                                                   // 16
                                                                                                                       // 17
Template.__checkName("Mongol_accountViewer_notSignedIn");                                                              // 18
Template["Mongol_accountViewer_notSignedIn"] = new Template("Template.Mongol_accountViewer_notSignedIn", (function() {
  var view = this;                                                                                                     // 20
  return HTML.Raw('<div class="Mongol_docMenu">\n			<div class="Mongol_docBar1" style="text-indent: 8px">\n				Not Signed In\n			</div>\n		</div>\n	<div class="Mongol_documentViewer">	\n		<!-- Nothing -->\n	</div>');
}));                                                                                                                   // 22
                                                                                                                       // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_account/accountViewer.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x5f1f=["\x75\x73\x65\x72","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x4D\x6F\x64\x65","\x67\x65\x74","\x63\x6F\x6C\x6F\x72\x69\x7A\x65\x45\x64\x69\x74\x61\x62\x6C\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x74\x72\x75\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x61\x62\x6C\x65","\x75\x73\x65\x72\x49\x64","\x68\x65\x6C\x70\x65\x72\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x61\x63\x63\x6F\x75\x6E\x74\x56\x69\x65\x77\x65\x72","\x73\x65\x74","\x75\x70\x64\x61\x74\x65\x44\x61\x74\x61","\x72\x65\x6D\x6F\x76\x65\x54\x65\x78\x74\x53\x65\x6C\x65\x63\x74\x69\x6F\x6E","\x62\x69\x6E\x64\x48\x6F\x74\x6B\x65\x79\x73","\x63\x72\x65\x61\x74\x65\x42\x61\x63\x6B\x75\x70","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x65\x76\x65\x6E\x74\x73"];Template[_0x5f1f[11]][_0x5f1f[10]]({accountData:function(){var _0x1862x1=Meteor[_0x5f1f[0]](),_0x1862x2=JSON[_0x5f1f[1]](_0x1862x1,null,2);if(MeteorToysDict[_0x5f1f[3]](_0x5f1f[2])){colorized= _0x1862x2}else {colorized= Package[_0x5f1f[6]][_0x5f1f[5]][_0x5f1f[4]](_0x1862x2)};return colorized},editContent:function(){var _0x1862x3=MeteorToysDict[_0x5f1f[3]](_0x5f1f[2]);if(_0x1862x3){return _0x5f1f[7]}},editStyle:function(){var _0x1862x3=MeteorToysDict[_0x5f1f[3]](_0x5f1f[2]);if(_0x1862x3){return _0x5f1f[8]}},usercode:function(){return Meteor[_0x5f1f[9]]()}});Template[_0x5f1f[11]][_0x5f1f[18]]({"\x64\x62\x6C\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x75\x6D\x65\x6E\x74\x56\x69\x65\x77\x65\x72":function(){MeteorToysDict[_0x5f1f[12]](_0x5f1f[2],true)},"\x66\x6F\x63\x75\x73\x6F\x75\x74\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(){a= Mongol_InlineEditor[_0x5f1f[13]]();b= Mongol_InlineEditor[_0x5f1f[14]]()},"\x66\x6F\x63\x75\x73\x69\x6E\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(){a= Mongol_InlineEditor[_0x5f1f[15]]();b= Mongol_InlineEditor[_0x5f1f[16]]()},"\x64\x62\x6C\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x69\x6E\x6C\x69\x6E\x65":function(_0x1862x4,_0x1862x5){_0x1862x4[_0x5f1f[17]]()}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_collection_notFound/template.notFound.js                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_collection_notFound");                                                                    // 2
Template["Mongol_collection_notFound"] = new Template("Template.Mongol_collection_notFound", (function() {             // 3
  var view = this;                                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                                              // 5
    return {                                                                                                           // 6
      name: Spacebars.call("no_collections")                                                                           // 7
    };                                                                                                                 // 8
  }, function() {                                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 10
      return [ "\n\n    ", HTML.DIV({                                                                                  // 11
        "class": "Mongol_icon Mongol_icon_collection"                                                                  // 12
      }), "No Collections", HTML.BR(), "\n    ", HTML.DIV({                                                            // 13
        "class": "Mongol_contentView"                                                                                  // 14
      }, "\n    ", HTML.Comment("  "), "\n      ", HTML.DIV({                                                          // 15
        "class": "Mongol_docMenu",                                                                                     // 16
        style: "text-indent: 8px"                                                                                      // 17
      }, "\n        None Detected\n      "), "\n      ", HTML.DIV({                                                    // 18
        "class": "Mongol_documentViewer "                                                                              // 19
      }, "\n\n        If you think this is an error,", HTML.BR(), "\n        please report it on ", HTML.A({           // 20
        href: "https://github.com/msavin/Mongol",                                                                      // 21
        style: "color: #cc0000"                                                                                        // 22
      }, "GitHub"), ".\n        \n      "), "\n    ", HTML.Comment("  "), "\n    "), "\n\n  " ];                       // 23
    });                                                                                                                // 24
  });                                                                                                                  // 25
}));                                                                                                                   // 26
                                                                                                                       // 27
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_collection_notFound/notFound.js                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_collection/template.collections.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_collection");                                                                             // 2
Template["Mongol_collection"] = new Template("Template.Mongol_collection", (function() {                               // 3
  var view = this;                                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                                              // 5
    return {                                                                                                           // 6
      name: Spacebars.call(view.lookup("."))                                                                           // 7
    };                                                                                                                 // 8
  }, function() {                                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 10
      return [ "\n\n		", HTML.Comment(" Collection Count "), "\n		", HTML.DIV({                                        // 11
        "class": "Mongol_counter"                                                                                      // 12
      }, "\n			", Blaze.If(function() {                                                                                // 13
        return Spacebars.call(view.lookup("collectionCount"));                                                         // 14
      }, function() {                                                                                                  // 15
        return [ "\n			", HTML.SPAN({                                                                                  // 16
          "class": "MongolHide"                                                                                        // 17
        }, Blaze.View("lookup:currentPosition", function() {                                                           // 18
          return Spacebars.mustache(view.lookup("currentPosition"));                                                   // 19
        }), "/") ];                                                                                                    // 20
      }), Blaze.View("lookup:collectionCount", function() {                                                            // 21
        return Spacebars.mustache(view.lookup("collectionCount"));                                                     // 22
      }), "\n		"), "\n\n		", HTML.Comment(" Collection Name "), "\n		", HTML.DIV({                                     // 23
        "class": "Mongol_row_name"                                                                                     // 24
      }, HTML.DIV({                                                                                                    // 25
        "class": "Mongol_icon Mongol_icon_collection"                                                                  // 26
      }), Blaze.View("lookup:.", function() {                                                                          // 27
        return Spacebars.mustache(view.lookup("."));                                                                   // 28
      }), Blaze.If(function() {                                                                                        // 29
        return Spacebars.call(view.lookup("xf"));                                                                      // 30
      }, function() {                                                                                                  // 31
        return Blaze.View("lookup:xf", function() {                                                                    // 32
          return Spacebars.mustache(view.lookup("xf"));                                                                // 33
        });                                                                                                            // 34
      })), "\n    	    \n		", HTML.Comment(" Document Viewer "), "\n		", HTML.DIV({                                    // 35
        "class": "Mongol_contentView"                                                                                  // 36
      }, "\n			", Spacebars.include(view.lookupTemplate("Mongol_docViewer")), "\n		"), "\n		\n	" ];                    // 37
    });                                                                                                                // 38
  });                                                                                                                  // 39
}));                                                                                                                   // 40
                                                                                                                       // 41
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_collection/collections.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x60b5=["\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x75\x72\x72\x65\x6E\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x65\x71\x75\x61\x6C\x73","\x67\x65\x74","\x73\x65\x74","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x63\x6F\x75\x6E\x74","\x66\x69\x6E\x64","\x68\x65\x6C\x70\x65\x72\x73"];Template[_0x60b5[6]][_0x60b5[5]]({"\x63\x6C\x69\x63\x6B":function(){var _0xe11bx1=String(this),_0xe11bx2=_0x60b5[0]+ _0xe11bx1;if(MeteorToysDict[_0x60b5[2]](_0x60b5[1],_0xe11bx1)){}else {if(!MeteorToysDict[_0x60b5[3]](String(_0xe11bx2))){MeteorToysDict[_0x60b5[4]](String(_0xe11bx2),0)}}}});Template[_0x60b5[6]][_0x60b5[9]]({collectionCount:function(){var _0xe11bx3=String(this);var _0xe11bx4=Mongol.Collection(_0xe11bx3);var _0xe11bx5=_0xe11bx4&& _0xe11bx4[_0x60b5[8]]()[_0x60b5[7]]()|| 0;return _0xe11bx5},currentPosition:function(){var _0xe11bx1=String(this);var _0xe11bx2=_0x60b5[0]+ _0xe11bx1;var _0xe11bx6=MeteorToysDict[_0x60b5[3]](_0xe11bx2);var _0xe11bx5=_0xe11bx6+ 1;return _0xe11bx5}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_trash/template.main.js                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_trash");                                                                                  // 2
Template["Mongol_trash"] = new Template("Template.Mongol_trash", (function() {                                         // 3
  var view = this;                                                                                                     // 4
  return Blaze._TemplateWith(function() {                                                                              // 5
    return {                                                                                                           // 6
      name: Spacebars.call("trash")                                                                                    // 7
    };                                                                                                                 // 8
  }, function() {                                                                                                      // 9
    return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                     // 10
      return [ "\n	  \n		", HTML.DIV({                                                                                 // 11
        "class": "Mongol_counter"                                                                                      // 12
      }, "\n			", Blaze.If(function() {                                                                                // 13
        return Spacebars.call(view.lookup("collectionCount"));                                                         // 14
      }, function() {                                                                                                  // 15
        return [ "\n				", HTML.SPAN({                                                                                 // 16
          "class": "MongolHide"                                                                                        // 17
        }, Blaze.View("lookup:currentPosition", function() {                                                           // 18
          return Spacebars.mustache(view.lookup("currentPosition"));                                                   // 19
        }), "/") ];                                                                                                    // 20
      }), Blaze.View("lookup:collectionCount", function() {                                                            // 21
        return Spacebars.mustache(view.lookup("collectionCount"));                                                     // 22
      }), "\n		"), "\n\n		", HTML.DIV({                                                                                // 23
        "class": "Mongol_row_name"                                                                                     // 24
      }, HTML.DIV({                                                                                                    // 25
        "class": "Mongol_icon Mongol_icon_trash"                                                                       // 26
      }), "Trash"), "\n\n		", Blaze.If(function() {                                                                    // 27
        return Spacebars.call(view.lookup("collectionCount"));                                                         // 28
      }, function() {                                                                                                  // 29
        return [ "\n			", Spacebars.include(view.lookupTemplate("Mongol_trash_viewer")), "\n		" ];                     // 30
      }, function() {                                                                                                  // 31
        return [ "\n			", Spacebars.include(view.lookupTemplate("Mongol_trash_empty")), "\n		" ];                      // 32
      }), "\n\n	" ];                                                                                                   // 33
    });                                                                                                                // 34
  });                                                                                                                  // 35
}));                                                                                                                   // 36
                                                                                                                       // 37
Template.__checkName("Mongol_trash_menu");                                                                             // 38
Template["Mongol_trash_menu"] = new Template("Template.Mongol_trash_menu", (function() {                               // 39
  var view = this;                                                                                                     // 40
  return HTML.DIV({                                                                                                    // 41
    "class": "Mongol_docMenu"                                                                                          // 42
  }, HTML.Raw('\n		<div class="Mongol_m_edit MeteorToys_action">Restore</div>\n		'), HTML.DIV({                        // 43
    "class": function() {                                                                                              // 44
      return [ Spacebars.mustache(view.lookup("disable_right")), " Mongol_m_right MeteorToys_action" ];                // 45
    }                                                                                                                  // 46
  }, HTML.Raw("&rsaquo;")), "\n		", HTML.DIV({                                                                         // 47
    "class": function() {                                                                                              // 48
      return [ Spacebars.mustache(view.lookup("disable_left")), " Mongol_m_left MeteorToys_action" ];                  // 49
    }                                                                                                                  // 50
  }, HTML.Raw("&lsaquo;")), "\n	");                                                                                    // 51
}));                                                                                                                   // 52
                                                                                                                       // 53
Template.__checkName("Mongol_trash_viewer");                                                                           // 54
Template["Mongol_trash_viewer"] = new Template("Template.Mongol_trash_viewer", (function() {                           // 55
  var view = this;                                                                                                     // 56
  return HTML.DIV({                                                                                                    // 57
    "class": "Mongol_contentView"                                                                                      // 58
  }, "\n		", Spacebars.include(view.lookupTemplate("Mongol_trash_menu")), "\n	    ", HTML.DIV({                        // 59
    "class": "Mongol_documentViewer"                                                                                   // 60
  }, "\n", HTML.PRE("From ", Blaze.View("lookup:collectionName", function() {                                          // 61
    return Spacebars.mustache(view.lookup("collectionName"));                                                          // 62
  }), " ", Blaze.View("lookup:currentDocument", function() {                                                           // 63
    return Spacebars.makeRaw(Spacebars.mustache(view.lookup("currentDocument")));                                      // 64
  })), "\n	    "), "\n	");                                                                                             // 65
}));                                                                                                                   // 66
                                                                                                                       // 67
Template.__checkName("Mongol_trash_empty");                                                                            // 68
Template["Mongol_trash_empty"] = new Template("Template.Mongol_trash_empty", (function() {                             // 69
  var view = this;                                                                                                     // 70
  return HTML.Raw('<div class="Mongol_contentView">\n		<div class="Mongol_docMenu" style="text-indent: 8px">Empty</div>\n		<div class="Mongol_documentViewer">\n<pre>When you remove documents,\nthey will appear here.</pre></div>\n	</div>');
}));                                                                                                                   // 72
                                                                                                                       // 73
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_trash/main.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0xedd7=["\x4D\x6F\x6E\x67\x6F\x6C\x5F\x54\x72\x61\x73\x68\x5F\x43\x6F\x75\x6E\x74","\x67\x65\x74","\x73\x65\x74","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x74\x72\x61\x73\x68","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x4D\x6F\x6E\x67\x6F\x6C","\x4D\x6F\x6E\x67\x6F\x6C","\x6D\x73\x61\x76\x69\x6E\x3A\x6D\x6F\x6E\x67\x6F\x6C","\x63\x6F\x75\x6E\x74","\x66\x69\x6E\x64","\x54\x72\x61\x73\x68\x5F\x43\x6F\x75\x6E\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x68\x65\x6C\x70\x65\x72\x73","\x66\x65\x74\x63\x68","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6F\x72\x69\x67\x69\x6E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x61\x74\x65","\x73\x74\x72\x69\x6E\x67\x69\x66\x79","\x63\x6F\x6C\x6F\x72\x69\x7A\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x74\x72\x61\x73\x68\x5F\x76\x69\x65\x77\x65\x72","\x5F\x69\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x69\x6E\x73\x65\x72\x74","\x54\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x72\x65\x73\x74\x6F\x72\x69\x6E\x67\x20\x79\x6F\x75\x72\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x2E","\x63\x61\x6C\x6C","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x6D\x6F\x76\x65","\x54\x68\x65\x72\x65\x20\x77\x61\x73\x20\x61\x6E\x20\x65\x72\x72\x6F\x72\x20\x72\x65\x6D\x6F\x76\x69\x6E\x67\x20\x64\x6F\x63\x75\x6D\x65\x6E\x74\x20\x66\x72\x6F\x6D\x20\x74\x72\x61\x73\x68\x2C","\x63\x6C\x69\x63\x6B","\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x6C\x65\x66\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x64\x69\x73\x61\x62\x6C\x65\x64","\x68\x61\x73\x43\x6C\x61\x73\x73","\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x72\x69\x67\x68\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x74\x72\x61\x73\x68\x5F\x6D\x65\x6E\x75"];Template[_0xedd7[4]][_0xedd7[3]]({"\x63\x6C\x69\x63\x6B":function(){if(!MeteorToysDict[_0xedd7[1]](_0xedd7[0])){MeteorToysDict[_0xedd7[2]](_0xedd7[0],0)}}});Template[_0xedd7[4]][_0xedd7[12]]({collectionCount:function(){var _0x193bx1=_0xedd7[5];var _0x193bx2=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0x193bx1);var _0x193bx3=_0x193bx2&& _0x193bx2[_0xedd7[9]]()[_0xedd7[8]]()|| 0;return _0x193bx3},currentPosition:function(){var _0x193bx4=_0xedd7[10];var _0x193bx5=_0xedd7[11]+ _0x193bx4;var _0x193bx6=MeteorToysDict[_0xedd7[1]](_0x193bx5);var _0x193bx3=_0x193bx6+ 1;return _0x193bx3}});Template[_0xedd7[20]][_0xedd7[12]]({currentDocument:function(){var _0x193bx1=_0xedd7[5],_0x193bx7=MeteorToysDict[_0xedd7[1]](_0xedd7[0]),_0x193bx8=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5])[_0xedd7[9]]()[_0xedd7[13]]()[_0x193bx7];if(_0x193bx8){delete _0x193bx8[_0xedd7[14]];delete _0x193bx8[_0xedd7[15]];var _0x193bx9=Package[_0xedd7[19]][_0xedd7[18]][_0xedd7[17]](JSON[_0xedd7[16]](_0x193bx8,undefined,2));return _0x193bx9}},collectionName:function(){var _0x193bx1=_0xedd7[5],_0x193bx7=MeteorToysDict[_0xedd7[1]](_0xedd7[0]),_0x193bx8=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5])[_0xedd7[9]]()[_0xedd7[13]]()[_0x193bx7];if(_0x193bx8){return _0x193bx8[_0xedd7[14]]}}});Template[_0xedd7[32]][_0xedd7[3]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x65\x64\x69\x74":function(){var _0x193bx1=_0xedd7[5],_0x193bx7=MeteorToysDict[_0xedd7[1]](_0xedd7[0]),_0x193bx8=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5])[_0xedd7[9]]()[_0xedd7[13]]()[_0x193bx7];var _0x193bx4=_0x193bx8[_0xedd7[14]];var _0x193bxa=_0x193bx8[_0xedd7[21]];delete _0x193bx8[_0xedd7[14]];delete _0x193bx8[_0xedd7[15]];Meteor[_0xedd7[24]](_0xedd7[22],_0x193bx4,_0x193bx8,function(_0x193bxb,_0x193bxc){if(_0x193bxb){alert(_0xedd7[23])}});Meteor[_0xedd7[24]](_0xedd7[25],_0xedd7[5],_0x193bxa,true,function(_0x193bxb,_0x193bxc){if(_0x193bxb){alert(_0xedd7[26])}});var _0x193bx5=_0xedd7[0];var _0x193bxd=MeteorToysDict[_0xedd7[1]](_0x193bx5);var _0x193bx2=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5]);var _0x193bxe=_0x193bx2[_0xedd7[9]]()[_0xedd7[8]]()- 1;if(_0x193bxe=== _0x193bxd){$(_0xedd7[28])[_0xedd7[27]]()}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x72\x69\x67\x68\x74":function(){if(!$(_0xedd7[31])[_0xedd7[30]](_0xedd7[29])){var _0x193bx5=_0xedd7[0];var _0x193bxd=MeteorToysDict[_0xedd7[1]](_0x193bx5);var _0x193bx2=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5]);var _0x193bxe=_0x193bx2[_0xedd7[9]]()[_0xedd7[8]]()- 1;if(_0x193bxd> _0x193bxe){MeteorToysDict[_0xedd7[2]](_0x193bx5,0);return};if(_0x193bxe=== _0x193bxd){MeteorToysDict[_0xedd7[2]](_0x193bx5,0)}else {var _0x193bxf=MeteorToysDict[_0xedd7[1]](_0x193bx5)+ 1;MeteorToysDict[_0xedd7[2]](_0x193bx5,_0x193bxf)}}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x6C\x65\x66\x74":function(){if(!$(_0xedd7[28])[_0xedd7[30]](_0xedd7[29])){var _0x193bx5=_0xedd7[0];var _0x193bxd=MeteorToysDict[_0xedd7[1]](_0x193bx5);var _0x193bx2=Package[_0xedd7[7]][_0xedd7[6]].Collection(_0xedd7[5]);var _0x193bxe=_0x193bx2[_0xedd7[9]]()[_0xedd7[8]]()- 1;if(_0x193bxd> _0x193bxe){MeteorToysDict[_0xedd7[2]](_0x193bx5,_0x193bxe);return};if(MeteorToysDict[_0xedd7[1]](_0x193bx5)=== 0){MeteorToysDict[_0xedd7[2]](_0x193bx5,_0x193bxe)}else {var _0x193bxf=MeteorToysDict[_0xedd7[1]](_0x193bx5)- 1;MeteorToysDict[_0xedd7[2]](_0x193bx5,_0x193bxf)}}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_insert/template.docInsert.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_docInsert");                                                                              // 2
Template["Mongol_docInsert"] = new Template("Template.Mongol_docInsert", (function() {                                 // 3
  var view = this;                                                                                                     // 4
  return [ HTML.Raw('<div class="Mongol_docMenu">\n		<div class="MeteorToys_action Mongol_docMenu_insert" style="float: right">Submit</div>\n		&nbsp;Insert a Document\n	</div>\n\n	'), HTML.DIV({
    "class": "Mongol_documentViewer ",                                                                                 // 6
    id: function() {                                                                                                   // 7
      return [ "Mongol_", Spacebars.mustache(view.lookup(".")), "_newEntry" ];                                         // 8
    },                                                                                                                 // 9
    tabindex: "-1",                                                                                                    // 10
    contenteditable: "true"                                                                                            // 11
  }, "	\n", HTML.Raw("<pre>{\n\n}</pre>"), "\n\n	") ];                                                                 // 12
}));                                                                                                                   // 13
                                                                                                                       // 14
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_insert/docInsert.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x1ec8=["\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x5F\x6E\x65\x77\x45\x6E\x74\x72\x79","\x74\x65\x78\x74\x43\x6F\x6E\x74\x65\x6E\x74","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x70\x61\x72\x73\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x69\x6E\x73\x65\x72\x74","\x73\x65\x74","\x44\x6F\x63\x75\x6D\x65\x6E\x74\x20\x73\x75\x63\x63\x65\x73\x73\x66\x75\x6C\x6C\x79\x20\x69\x6E\x73\x65\x72\x74\x65\x64\x2E","\x7B\x3C\x62\x72\x3E\x3C\x62\x72\x3E\x7D","\x68\x74\x6D\x6C","\x23\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x69\x6E\x73\x65\x72\x74","\x65\x72\x72\x6F\x72","\x63\x61\x6C\x6C","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x49\x6E\x73\x65\x72\x74"];Template[_0x1ec8[15]][_0x1ec8[14]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x4D\x65\x6E\x75\x5F\x69\x6E\x73\x65\x72\x74":function(_0x6a7fx1,_0x6a7fx2){var _0x6a7fx3=String(this),_0x6a7fx4=_0x1ec8[0]+ String(this)+ _0x1ec8[1],_0x6a7fx5=document[_0x1ec8[3]](_0x6a7fx4)[_0x1ec8[2]],_0x6a7fx6=Mongol[_0x1ec8[4]](_0x6a7fx5);if(_0x6a7fx6){Meteor[_0x1ec8[13]](_0x1ec8[5],_0x6a7fx3,_0x6a7fx6,function(_0x6a7fx7,_0x6a7fx8){if(!_0x6a7fx7){sessionKey= _0x1ec8[0]+ _0x6a7fx3;MeteorToysDict[_0x1ec8[6]](sessionKey,0);alert(_0x1ec8[7]);_0x6a7fx2.$(_0x1ec8[10]+ _0x6a7fx3+ _0x1ec8[1])[_0x1ec8[9]](_0x1ec8[8])}else {Mongol[_0x1ec8[12]](_0x1ec8[11])}})}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/_component/template.component.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_Component");                                                                              // 2
Template["Mongol_Component"] = new Template("Template.Mongol_Component", (function() {                                 // 3
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    "class": function() {                                                                                              // 6
      return [ "Mongol_row ", Spacebars.mustache(view.lookup("active")) ];                                             // 7
    },                                                                                                                 // 8
    id: function() {                                                                                                   // 9
      return [ "Mongol_c", Spacebars.mustache(view.lookup("name")) ];                                                  // 10
    }                                                                                                                  // 11
  }, "\n		", Blaze._InOuterTemplateScope(view, function() {                                                            // 12
    return Spacebars.include(function() {                                                                              // 13
      return Spacebars.call(view.templateContentBlock);                                                                // 14
    });                                                                                                                // 15
  }), "\n	");                                                                                                          // 16
}));                                                                                                                   // 17
                                                                                                                       // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/_component/component.js                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0x31e5=["\x4D\x6F\x6E\x67\x6F\x6C","\x63\x6C\x6F\x73\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x75\x72\x72\x65\x6E\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x67\x65\x74","\x73\x65\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x4D\x6F\x64\x65","\x77\x68\x69\x63\x68","\x6E\x61\x6D\x65","\x65\x71\x75\x61\x6C\x73","\x73\x74\x6F\x70\x50\x72\x6F\x70\x61\x67\x61\x74\x69\x6F\x6E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x70\x72\x65\x76\x69\x65\x77","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x43\x6F\x6D\x70\x6F\x6E\x65\x6E\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x6F\x77\x5F\x65\x78\x70\x61\x6E\x64","\x68\x65\x6C\x70\x65\x72\x73"];window[_0x31e5[0]]= {};window[_0x31e5[0]][_0x31e5[1]]= function(){if(MeteorToysDict[_0x31e5[3]](_0x31e5[2])){MeteorToysDict[_0x31e5[4]](_0x31e5[2],null);MeteorToysDict[_0x31e5[4]](_0x31e5[5],false)}else {MeteorToys[_0x31e5[1]]()}};Template[_0x31e5[12]][_0x31e5[11]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x6F\x77":function(_0xa3b1x1,_0xa3b1x2){if(_0xa3b1x1[_0x31e5[6]]=== 1){if(MeteorToysDict[_0x31e5[8]](_0x31e5[2],this[_0x31e5[7]])){MeteorToysDict[_0x31e5[4]](_0x31e5[2],null)}else {MeteorToysDict[_0x31e5[4]](_0x31e5[2],this[_0x31e5[7]])};MeteorToysDict[_0x31e5[4]](_0x31e5[5],false)}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x6F\x6E\x74\x65\x6E\x74\x56\x69\x65\x77":function(_0xa3b1x1){_0xa3b1x1[_0x31e5[9]]()},"\x6D\x6F\x75\x73\x65\x6F\x76\x65\x72\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x6F\x77":function(){MeteorToysDict[_0x31e5[4]](_0x31e5[10],this[_0x31e5[7]])}});Template[_0x31e5[12]][_0x31e5[14]]({active:function(){if(MeteorToysDict[_0x31e5[8]](_0x31e5[2],this[_0x31e5[7]])){return _0x31e5[13]}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/template.main.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol");                                                                                        // 2
Template["Mongol"] = new Template("Template.Mongol", (function() {                                                     // 3
  var view = this;                                                                                                     // 4
  return HTML.DIV({                                                                                                    // 5
    id: "Mongol",                                                                                                      // 6
    "class": function() {                                                                                              // 7
      return [ "MeteorToys MeteorToys_hide_Mongol MeteorToysReset ", Spacebars.mustache(view.lookup("active")) ];      // 8
    },                                                                                                                 // 9
    oncontextmenu: "Mongol.close(); return false;"                                                                     // 10
  }, "\n		", Blaze.If(function() {                                                                                     // 11
    return Spacebars.call(view.lookup("MeteorToys_Pro"));                                                              // 12
  }, function() {                                                                                                      // 13
    return [ "\n			", Spacebars.include(view.lookupTemplate("Mongol_header_pro")), "\n			", Spacebars.include(view.lookupTemplate("Mongol_account")), "\n			", Blaze.Each(function() {
      return Spacebars.call(view.lookup("Mongol_collections"));                                                        // 15
    }, function() {                                                                                                    // 16
      return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_collection")), "\n			" ];                       // 17
    }, function() {                                                                                                    // 18
      return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_collection_notFound")), "\n			" ];              // 19
    }), "\n			", Spacebars.include(view.lookupTemplate("Mongol_trash")), "\n		" ];                                     // 20
  }, function() {                                                                                                      // 21
    return [ "\n			", Spacebars.include(view.lookupTemplate("Mongol_header")), "\n			", Spacebars.include(view.lookupTemplate("Mongol_account")), "\n			", Spacebars.include(view.lookupTemplate("Mongol_support")), "\n			", Blaze.Each(function() {
      return Spacebars.call(view.lookup("Mongol_collections"));                                                        // 23
    }, function() {                                                                                                    // 24
      return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_collection")), "\n			" ];                       // 25
    }, function() {                                                                                                    // 26
      return [ "\n				", Spacebars.include(view.lookupTemplate("Mongol_collection_notFound")), "\n			" ];              // 27
    }), "\n		" ];                                                                                                      // 28
  }), "\n\n	");                                                                                                        // 29
}));                                                                                                                   // 30
                                                                                                                       // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/main.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0xe502=["\x64\x65\x74\x65\x63\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x68\x69\x64\x65\x4D\x65\x74\x65\x6F\x72","\x68\x69\x64\x65\x56\x65\x6C\x6F\x63\x69\x74\x79","\x68\x69\x64\x65\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x73\x74\x61\x72\x74\x75\x70","\x4D\x6F\x6E\x67\x6F\x6C","\x67\x65\x74","\x63\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E\x73","\x77\x69\x74\x68\x6F\x75\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x75\x72\x72\x65\x6E\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x78\x70\x61\x6E\x64","\x68\x65\x6C\x70\x65\x72\x73"];Meteor[_0xe502[6]](function(){Mongol[_0xe502[0]]();MeteorToysDict= Package[_0xe502[2]][_0xe502[1]];Mongol[_0xe502[3]]();Mongol[_0xe502[4]]();Mongol[_0xe502[5]]()});Template[_0xe502[7]][_0xe502[13]]({Mongol_collections:function(){var _0x47a5x1=MeteorToysDict[_0xe502[8]](_0xe502[7]);return _0x47a5x1&& _[_0xe502[10]](_0x47a5x1[_0xe502[9]],null)|| []},active:function(){var _0x47a5x2=MeteorToysDict[_0xe502[8]](_0xe502[11]);if(_0x47a5x2){return _0xe502[12]}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_controls/template.docControls.js                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_docControls");                                                                            // 2
Template["Mongol_docControls"] = new Template("Template.Mongol_docControls", (function() {                             // 3
  var view = this;                                                                                                     // 4
  return Blaze.If(function() {                                                                                         // 5
    return Spacebars.call(view.lookup("active"));                                                                      // 6
  }, function() {                                                                                                      // 7
    return [ "\n		\n		", HTML.DIV({                                                                                    // 8
      "class": function() {                                                                                            // 9
        return [ "Mongol_docMenu ", Spacebars.mustache(view.lookup("Mongol_docMenu_editing")) ];                       // 10
      }                                                                                                                // 11
    }, "\n			", Blaze.If(function() {                                                                                  // 12
      return Spacebars.call(view.lookup("account"));                                                                   // 13
    }, function() {                                                                                                    // 14
      return [ "\n				", HTML.DIV({                                                                                    // 15
        "class": "Mongol_docBar1"                                                                                      // 16
      }, "\n					", Blaze.If(function() {                                                                              // 17
        return Spacebars.call(view.lookup("editing"));                                                                 // 18
      }, function() {                                                                                                  // 19
        return [ "\n						", HTML.DIV({                                                                                // 20
          "class": "Mongol_edit_title"                                                                                 // 21
        }, "Update Document"), "\n						", HTML.DIV({                                                                  // 22
          "class": "MeteorToys_action Mongol_edit_save"                                                                // 23
        }, "Save"), "\n						", HTML.DIV({                                                                             // 24
          "class": "MeteorToys_action Mongol_edit_cancel"                                                              // 25
        }, "Cancel"), "\n					" ];                                                                                     // 26
      }, function() {                                                                                                  // 27
        return [ "	\n						\n                        ", HTML.Comment("For some reason, the method in place does not work for this\n                        Commenting out for now"), "\n                        ", HTML.DIV({
          "class": "MeteorToys_action Mongol_m_edit Mongol_m_updateAccount"                                            // 29
        }, "Update"), "\n						\n						", HTML.Comment(" &nbsp;Currently Read-Only "), "\n						", HTML.DIV({          // 30
          "class": "MeteorToys_action Mongol_m_signout"                                                                // 31
        }, "Sign Out"), "\n                        \n					" ];                                                         // 32
      }), "\n				"), "\n			" ];                                                                                        // 33
    }, function() {                                                                                                    // 34
      return [ "\n				", HTML.DIV({                                                                                    // 35
        "class": "Mongol_docBar1"                                                                                      // 36
      }, "\n					", Blaze.If(function() {                                                                              // 37
        return Spacebars.call(view.lookup("editing"));                                                                 // 38
      }, function() {                                                                                                  // 39
        return [ "\n						", HTML.DIV({                                                                                // 40
          "class": "Mongol_edit_title"                                                                                 // 41
        }, "Update Document"), "\n						", HTML.DIV({                                                                  // 42
          "class": "MeteorToys_action Mongol_edit_save"                                                                // 43
        }, "Save"), "\n						", HTML.DIV({                                                                             // 44
          "class": "MeteorToys_action Mongol_edit_cancel"                                                              // 45
        }, "Cancel"), "\n					" ];                                                                                     // 46
      }, function() {                                                                                                  // 47
        return [ "\n						", HTML.DIV({                                                                                // 48
          "class": "MeteorToys_action Mongol_m_edit"                                                                   // 49
        }, "Update"), "\n						", HTML.DIV({                                                                           // 50
          "class": "MeteorToys_action Mongol_m_new"                                                                    // 51
        }, "Duplicate"), "\n						", HTML.DIV({                                                                        // 52
          "class": "MeteorToys_action Mongol_m_delete"                                                                 // 53
        }, "Remove"), "\n						", HTML.DIV({                                                                           // 54
          "class": function() {                                                                                        // 55
            return [ "MeteorToys_action ", Spacebars.mustache(view.lookup("disable")), " Mongol_m_right" ];            // 56
          }                                                                                                            // 57
        }, HTML.CharRef({                                                                                              // 58
          html: "&rsaquo;",                                                                                            // 59
          str: "›"                                                                                                     // 60
        })), "\n						", HTML.DIV({                                                                                    // 61
          "class": function() {                                                                                        // 62
            return [ "MeteorToys_action ", Spacebars.mustache(view.lookup("disable")), " Mongol_m_left" ];             // 63
          }                                                                                                            // 64
        }, HTML.CharRef({                                                                                              // 65
          html: "&lsaquo;",                                                                                            // 66
          str: "‹"                                                                                                     // 67
        })), "\n					" ];                                                                                              // 68
      }), "\n				"), "\n			" ];                                                                                        // 69
    }), "	\n		"), "\n\n	" ];                                                                                           // 70
  }, function() {                                                                                                      // 71
    return [ "\n\n		", HTML.DIV({                                                                                      // 72
      "class": "Mongol_docMenu"                                                                                        // 73
    }, "\n			", HTML.DIV({                                                                                             // 74
      "class": "Mongol_docBar1"                                                                                        // 75
    }, "\n				", HTML.CharRef({                                                                                        // 76
      html: "&nbsp;",                                                                                                  // 77
      str: " "                                                                                                         // 78
    }), "\n			"), "\n		"), "\n\n	" ];                                                                                  // 79
  });                                                                                                                  // 80
}));                                                                                                                   // 81
                                                                                                                       // 82
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/doc_controls/docControls.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _0xaa88=["\x76\x61\x6C\x69\x64\x61\x74\x65\x44\x6F\x63\x75\x6D\x65\x6E\x74","\x69\x73\x46\x75\x6E\x63\x74\x69\x6F\x6E","\x65\x61\x63\x68","\x69\x6E\x6C\x69\x6E\x65\x45\x64\x69\x74\x69\x6E\x67\x54\x69\x6D\x65\x72","\x72\x65\x73\x65\x74\x49\x6E\x6C\x69\x6E\x65\x45\x64\x69\x74\x69\x6E\x67\x54\x69\x6D\x65\x72","\x63\x6C\x65\x61\x72\x54\x69\x6D\x65\x6F\x75\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6E\x6F\x49\x6E\x6C\x69\x6E\x65\x45\x64\x69\x74\x69\x6E\x67","\x73\x65\x74","\x73\x65\x74\x54\x69\x6D\x65\x6F\x75\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x63\x75\x72\x72\x65\x6E\x74\x43\x6F\x6C\x6C\x65\x63\x74\x69\x6F\x6E","\x67\x65\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F","\x66\x65\x74\x63\x68","\x66\x69\x6E\x64","\x63\x6F\x75\x6E\x74","\x5F\x69\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x75\x70\x6C\x69\x63\x61\x74\x65","\x66\x69\x6E\x64\x4F\x6E\x65","\x6D\x61\x70","\x64\x75\x70\x6C\x69\x63\x61\x74\x65","\x65\x72\x72\x6F\x72","\x63\x61\x6C\x6C","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x4D\x6F\x64\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x6D\x6F\x76\x65","\x73\x68\x6F\x75\x6C\x64\x4C\x6F\x67","\x52\x65\x6D\x6F\x76\x65\x64\x20","\x20\x66\x72\x6F\x6D\x20","\x2E\x20\x42\x61\x63\x6B\x2D\x75\x70\x20\x62\x65\x6C\x6F\x77\x3A","\x6C\x6F\x67","\x72\x65\x6D\x6F\x76\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x64\x69\x73\x61\x62\x6C\x65\x64","\x68\x61\x73\x43\x6C\x61\x73\x73","\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x72\x69\x67\x68\x74","\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x6C\x65\x66\x74","\x61\x63\x63\x6F\x75\x6E\x74\x5F\x36\x31\x38","\x65\x71\x75\x61\x6C\x73","\x75\x73\x65\x72\x73","\x67\x65\x74\x44\x6F\x63\x75\x6D\x65\x6E\x74\x55\x70\x64\x61\x74\x65","\x70\x61\x72\x73\x65","\x75\x73\x65\x72","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x75\x70\x64\x61\x74\x65","\x75\x70\x64\x61\x74\x65","\x6C\x6F\x67\x6F\x75\x74","\x65\x76\x65\x6E\x74\x73","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x43\x6F\x6E\x74\x72\x6F\x6C\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x64\x69\x73\x61\x62\x6C\x65\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x77\x72\x61\x70\x70\x65\x72\x5F\x65\x78\x70\x61\x6E\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x64\x6F\x63\x4D\x65\x6E\x75\x5F\x65\x64\x69\x74\x69\x6E\x67","\x68\x65\x6C\x70\x65\x72\x73"];Mongol[_0xaa88[0]]= function(_0x9cdbx1){var _0x9cdbx2={};_[_0xaa88[2]](_0x9cdbx1,function(_0x9cdbx3,_0x9cdbx4){if(_[_0xaa88[1]](_0x9cdbx3)){return};_0x9cdbx2[_0x9cdbx4]= _0x9cdbx3});return _0x9cdbx2};Mongol[_0xaa88[3]]= null;Mongol[_0xaa88[4]]= function(){if(Mongol[_0xaa88[3]]){Meteor[_0xaa88[5]](Mongol[_0xaa88[3]])};MeteorToysDict[_0xaa88[7]](_0xaa88[6],true);Mongol[_0xaa88[3]]= Meteor[_0xaa88[8]](function(){MeteorToysDict[_0xaa88[7]](_0xaa88[6],false)},300)};Template[_0xaa88[44]][_0xaa88[43]]({"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x6E\x65\x77":function(){CollectionName= MeteorToysDict[_0xaa88[10]](_0xaa88[9]),DocumentPosition= MeteorToysDict[_0xaa88[10]](_0xaa88[11]+ String(this)),CurrentCollection= Mongol.Collection(CollectionName)[_0xaa88[13]]({},{transform:null})[_0xaa88[12]](),CollectionCount= Mongol.Collection(CollectionName)[_0xaa88[13]]()[_0xaa88[14]](),CurrentDocument= CurrentCollection[DocumentPosition],DocumentID= CurrentDocument[_0xaa88[15]],sessionKey= _0xaa88[11]+ String(this),ValidatedCurrentDocument= Mongol[_0xaa88[0]](CurrentDocument);Meteor[_0xaa88[21]](_0xaa88[16],CollectionName,ValidatedCurrentDocument._id,function(_0x9cdbx5,_0x9cdbx6){if(!_0x9cdbx5){if(Mongol.Collection(CollectionName)[_0xaa88[17]](_0x9cdbx6)){list= Mongol.Collection(CollectionName)[_0xaa88[13]]({},{transform:null})[_0xaa88[12]](),docID= _0x9cdbx6,currentDoc;docIndex= _[_0xaa88[18]](list,function(_0x9cdbx7,_0x9cdbx8){if(_0x9cdbx7[_0xaa88[15]]=== docID){currentDoc= _0x9cdbx8}});MeteorToysDict[_0xaa88[7]](sessionKey,Number(currentDoc))}}else {Mongol[_0xaa88[20]](_0xaa88[19])}})},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x65\x64\x69\x74":function(){MeteorToysDict[_0xaa88[7]](_0xaa88[22],true)},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x64\x65\x6C\x65\x74\x65":function(){var _0x9cdbx9=MeteorToysDict[_0xaa88[10]](_0xaa88[9]),_0x9cdbxa=_0xaa88[11]+ String(this);DocumentPosition= MeteorToysDict[_0xaa88[10]](_0x9cdbxa),CurrentCollection= Mongol.Collection(_0x9cdbx9)[_0xaa88[13]]({},{transform:null})[_0xaa88[12]](),CollectionCount= Mongol.Collection(_0x9cdbx9)[_0xaa88[13]]()[_0xaa88[14]]();var _0x9cdbxb=CurrentCollection[DocumentPosition],_0x9cdbxc=_0x9cdbxb[_0xaa88[15]];Meteor[_0xaa88[21]](_0xaa88[23],_0x9cdbx9,_0x9cdbxc,function(_0x9cdbx5,_0x9cdbx6){if(!_0x9cdbx5){if(MeteorToysDict[_0xaa88[24]]()){console[_0xaa88[28]](_0xaa88[25]+ _0x9cdbxc+ _0xaa88[26]+ _0x9cdbx9+ _0xaa88[27]);console[_0xaa88[28]](_0x9cdbxb)};if(DocumentPosition>= CollectionCount- 1){newPosition= DocumentPosition- 1;MeteorToysDict[_0xaa88[7]](_0x9cdbxa,newPosition)};if(MeteorToysDict[_0xaa88[10]](_0x9cdbxa)===  -1){MeteorToysDict[_0xaa88[7]](_0x9cdbxa,0)}}else {Mongol[_0xaa88[20]](_0xaa88[29])}})},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x72\x69\x67\x68\x74":function(_0x9cdbxd,_0x9cdbxe){if(!_0x9cdbxe.$(_0xaa88[32])[_0xaa88[31]](_0xaa88[30])){Mongol[_0xaa88[4]]();var _0x9cdbxa=_0xaa88[11]+ String(this);var _0x9cdbxb=MeteorToysDict[_0xaa88[10]](_0x9cdbxa);var _0x9cdbxf=String(this);var _0x9cdbx10=Mongol.Collection(_0x9cdbxf);var _0x9cdbx11=_0x9cdbx10[_0xaa88[13]]()[_0xaa88[14]]()- 1;if(_0x9cdbxb> _0x9cdbx11){MeteorToysDict[_0xaa88[7]](_0x9cdbxa,0);return};if(_0x9cdbx11=== _0x9cdbxb){MeteorToysDict[_0xaa88[7]](_0x9cdbxa,0)}else {var _0x9cdbx12=MeteorToysDict[_0xaa88[10]](_0x9cdbxa)+ 1;MeteorToysDict[_0xaa88[7]](_0x9cdbxa,_0x9cdbx12)}}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x6C\x65\x66\x74":function(_0x9cdbxd,_0x9cdbxe){if(!_0x9cdbxe.$(_0xaa88[33])[_0xaa88[31]](_0xaa88[30])){Mongol[_0xaa88[4]]();sessionKey= _0xaa88[11]+ String(this);var _0x9cdbxb=MeteorToysDict[_0xaa88[10]](sessionKey);var _0x9cdbxf=String(this);var _0x9cdbx10=Mongol.Collection(_0x9cdbxf);var _0x9cdbx11=_0x9cdbx10[_0xaa88[13]]()[_0xaa88[14]]()- 1;if(_0x9cdbxb> _0x9cdbx11){MeteorToysDict[_0xaa88[7]](sessionKey,_0x9cdbx11);return};if(MeteorToysDict[_0xaa88[10]](sessionKey)=== 0){MeteorToysDict[_0xaa88[7]](sessionKey,_0x9cdbx11)}else {var _0x9cdbx12=MeteorToysDict[_0xaa88[10]](sessionKey)- 1;MeteorToysDict[_0xaa88[7]](sessionKey,_0x9cdbx12)}}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x5F\x73\x61\x76\x65":function(){var _0x9cdbxf=(MeteorToysDict[_0xaa88[35]](_0xaa88[9],_0xaa88[34]))?_0xaa88[36]:String(this);if(MeteorToysDict[_0xaa88[35]](_0xaa88[9],_0xaa88[34])){var _0x9cdbx13=Mongol[_0xaa88[37]](_0xaa88[34]);var _0x9cdbx14=Mongol[_0xaa88[38]](_0x9cdbx13);var _0x9cdbx15=Meteor[_0xaa88[39]]()}else {var _0x9cdbxa=_0xaa88[11]+ _0x9cdbxf;DocumentPosition= MeteorToysDict[_0xaa88[10]](_0x9cdbxa),CurrentCollection= Mongol.Collection(_0x9cdbxf)[_0xaa88[13]]({},{transform:null})[_0xaa88[12]]();var _0x9cdbx13=Mongol[_0xaa88[37]](_0x9cdbxf);var _0x9cdbx14=Mongol[_0xaa88[38]](_0x9cdbx13);var _0x9cdbx15=CurrentCollection[DocumentPosition]};if(_0x9cdbx14){Meteor[_0xaa88[21]](_0xaa88[40],_0x9cdbxf,_0x9cdbx14,Mongol[_0xaa88[0]](_0x9cdbx15),function(_0x9cdbx5,_0x9cdbx6){if(!_0x9cdbx5){MeteorToysDict[_0xaa88[7]](_0xaa88[22],null)}else {Mongol[_0xaa88[20]](_0xaa88[41])}})}},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x65\x64\x69\x74\x5F\x63\x61\x6E\x63\x65\x6C":function(){MeteorToysDict[_0xaa88[7]](_0xaa88[22],null)},"\x63\x6C\x69\x63\x6B\x20\x2E\x4D\x6F\x6E\x67\x6F\x6C\x5F\x6D\x5F\x73\x69\x67\x6E\x6F\x75\x74":function(){Meteor[_0xaa88[42]]();MeteorToysDict[_0xaa88[7]](_0xaa88[9],null)}});Template[_0xaa88[44]][_0xaa88[48]]({disable:function(){var _0x9cdbxa=_0xaa88[11]+ String(this);var _0x9cdbxb=MeteorToysDict[_0xaa88[10]](_0x9cdbxa);var _0x9cdbxf=String(this);var _0x9cdbx10=Mongol.Collection(_0x9cdbxf);var _0x9cdbx11=_0x9cdbx10[_0xaa88[13]]()[_0xaa88[14]]();if(_0x9cdbxb>= 1){return};if(_0x9cdbx11=== 1){return _0xaa88[45]}},editing:function(){var _0x9cdbx16=MeteorToysDict[_0xaa88[10]](_0xaa88[22]);return _0x9cdbx16},editing_class:function(){var _0x9cdbx17=MeteorToysDict[_0xaa88[10]](_0xaa88[22]);if(_0x9cdbx17){return _0xaa88[46]}},Mongol_docMenu_editing:function(){var _0x9cdbx18=MeteorToysDict[_0xaa88[10]](_0xaa88[22]);if(_0x9cdbx18){return _0xaa88[47]}},active:function(){var _0x9cdbx19=MeteorToysDict[_0xaa88[10]](_0xaa88[9]);if(_0x9cdbx19=== String(this)){return true};if(_0x9cdbx19=== _0xaa88[34]){return true}},account:function(){var _0x9cdbx1a=MeteorToysDict[_0xaa88[10]](_0xaa88[9]);if(_0x9cdbx1a=== _0xaa88[34]){return true}else {return false}}})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_support/template.support.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
                                                                                                                       // 1
Template.__checkName("Mongol_support");                                                                                // 2
Template["Mongol_support"] = new Template("Template.Mongol_support", (function() {                                     // 3
  var view = this;                                                                                                     // 4
  return Blaze.If(function() {                                                                                         // 5
    return Spacebars.call(view.lookup("show"));                                                                        // 6
  }, function() {                                                                                                      // 7
    return [ "\n	", Blaze._TemplateWith(function() {                                                                   // 8
      return {                                                                                                         // 9
        name: Spacebars.call("support")                                                                                // 10
      };                                                                                                               // 11
    }, function() {                                                                                                    // 12
      return Spacebars.include(view.lookupTemplate("Mongol_Component"), function() {                                   // 13
        return [ "\n		\n		", HTML.DIV({                                                                                // 14
          "class": "Mongol_icon Mongol_icon_support"                                                                   // 15
        }), "Support", HTML.BR(), "\n		\n\n		", HTML.DIV({                                                             // 16
          "class": "Mongol_contentView"                                                                                // 17
        }, "\n			", HTML.DIV({                                                                                         // 18
          "class": "Mongol_docMenu",                                                                                   // 19
          style: "padding-left: 8px"                                                                                   // 20
        }, "\n				", HTML.DIV({                                                                                        // 21
          "class": "MeteorToys_action Mongol_m_signout"                                                                // 22
        }, "Hide"), "\n				Thanks for using Mongol!\n			"), "\n			", HTML.DIV({                                        // 23
          "class": "Mongol_documentViewer "                                                                            // 24
        }, "\n				If you've been enjoying Meteor Toys,", HTML.BR(), "\n				please consider making a one-time\n				purchase ", HTML.BR(), "for the complete set.", HTML.BR(), HTML.BR(), "\n\n				Meteor Toys Pro offer features, such as:", HTML.BR(), "\n				 - One-click Autopublish Toggle", HTML.BR(), "\n				 - Instant Account Authentication", HTML.BR(), "\n				 - DDP Speed Throttle", HTML.BR(), "\n				 ", HTML.BR(), "\n\n				 ", HTML.A({
          href: "https://meteor.toys/?ref=mongol",                                                                     // 26
          target: "_blank",                                                                                            // 27
          style: "color: #cc0000"                                                                                      // 28
        }, HTML.DIV({                                                                                                  // 29
          "class": "Mongol_buy MeteorToys-background-blue MeteorToys-color-foundation"                                 // 30
        }, HTML.CharRef({                                                                                              // 31
          html: "&nbsp;",                                                                                              // 32
          str: " "                                                                                                     // 33
        }), " Upgrade to Pro ", HTML.CharRef({                                                                         // 34
          html: "&raquo;",                                                                                             // 35
          str: "»"                                                                                                     // 36
        }), " ", HTML.CharRef({                                                                                        // 37
          html: "&nbsp;",                                                                                              // 38
          str: " "                                                                                                     // 39
        }))), "\n\n				 ", HTML.BR(), HTML.BR(), "On another note, you might like a new project,", HTML.BR(), "\n				 Meteor Candy. There's a free version that lets ", HTML.BR(), "\n				 you search accounts and impersonate them!", HTML.BR(), HTML.BR(), "\n\n				 ", HTML.A({
          href: "https://github.com/msavin/MeteorCandy?ref=mongol",                                                    // 41
          target: "_blank",                                                                                            // 42
          style: "color: #cc0000"                                                                                      // 43
        }, HTML.DIV({                                                                                                  // 44
          "class": "Mongol_buy MeteorToys-background-blue MeteorToys-color-foundation"                                 // 45
        }, HTML.CharRef({                                                                                              // 46
          html: "&nbsp;",                                                                                              // 47
          str: " "                                                                                                     // 48
        }), " See Meteor Candy ", HTML.CharRef({                                                                       // 49
          html: "&raquo;",                                                                                             // 50
          str: "»"                                                                                                     // 51
        }), " ", HTML.CharRef({                                                                                        // 52
          html: "&nbsp;",                                                                                              // 53
          str: " "                                                                                                     // 54
        }))), " \n\n\n\n			"), "\n		"), "\n	" ];                                                                       // 55
      });                                                                                                              // 56
    }), "\n" ];                                                                                                        // 57
  });                                                                                                                  // 58
}));                                                                                                                   // 59
                                                                                                                       // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/msavin_mongol/client/row_support/support.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Meteor.startup(function () {                                                                                           // 1
	if (localStorage.getItem("MeteorToys.hideSupport")) {                                                                 // 2
		MeteorToysDict.set("hideSupport", true)		                                                                            // 3
	}                                                                                                                     // 4
});                                                                                                                    // 5
                                                                                                                       // 6
Template.Mongol_support.events({                                                                                       // 7
	'click .Mongol_m_signout': function () {                                                                              // 8
		window['Mongol'].close();                                                                                            // 9
                                                                                                                       // 10
		window.setTimeout(function () {                                                                                      // 11
			MeteorToysDict.set("hideSupport", true)                                                                             // 12
			localStorage.setItem("MeteorToys.hideSupport", "true")                                                              // 13
		}, 300);                                                                                                             // 14
	}                                                                                                                     // 15
});                                                                                                                    // 16
                                                                                                                       // 17
Template.Mongol_support.helpers({                                                                                      // 18
	show: function () {                                                                                                   // 19
		if (MeteorToysDict.get("hideSupport")) {                                                                             // 20
			return false;                                                                                                       // 21
		} else {                                                                                                             // 22
			return true;                                                                                                        // 23
		}                                                                                                                    // 24
	}                                                                                                                     // 25
});                                                                                                                    // 26
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['msavin:mongol'] = {}, {
  Mongol: Mongol
});

})();
