(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, canRun, tN, dcol, speed, _0xb15cx5;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_throttle/server/main.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0x98f9=["\x54\x68\x72\x6F\x74\x74\x6C\x65","\x31\x2E\x30\x2E\x30","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x74\x68\x72\x6F\x74\x74\x6C\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x73\x74\x61\x72\x74\x75\x70","\x66\x69\x6E\x64\x4F\x6E\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x73\x70\x65\x65\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x75\x70\x64\x61\x74\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x54\x68\x72\x6F\x74\x74\x6C\x65","\x5F\x69\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x6D\x6F\x76\x65","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x69\x6E\x73\x65\x72\x74","\x72\x65\x6D\x6F\x76\x65","\x6D\x65\x74\x68\x6F\x64\x73","\x6B\x65\x79\x73","\x73\x6C\x69\x63\x65","\x61\x70\x70\x6C\x79","\x73\x65\x72\x76\x65\x72","\x73\x74\x72\x65\x61\x6D\x5F\x73\x65\x72\x76\x65\x72","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x77\x72\x69\x74\x65"];ToyKit= {name:_0x98f9[0],version:_0x98f9[1],template:_0x98f9[2],ToyKit:_0x98f9[1]};canRun= false;Meteor[_0x98f9[5]](function(){Meteor[_0x98f9[4]](_0x98f9[3],function(_0xb15cx1,_0xb15cx2){canRun= _0xb15cx2})});Meteor[_0x98f9[16]]({"\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x74\x68\x72\x6F\x74\x74\x6C\x65":function(){if(!canRun){return};var _0xb15cx3=Package[_0x98f9[8]][_0x98f9[7]][_0x98f9[0]][_0x98f9[6]]();if(_0xb15cx3){if(_0xb15cx3[_0x98f9[9]]=== 600){Meteor[_0x98f9[4]](_0x98f9[10],_0x98f9[11],{_id:_0xb15cx3[_0x98f9[12]],speed:1200},_0xb15cx3)}else {Meteor[_0x98f9[4]](_0x98f9[13],_0x98f9[11],_0xb15cx3._id,true)}}else {Meteor[_0x98f9[4]](_0x98f9[14],_0x98f9[11],{speed:600})}},"\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x74\x68\x72\x6F\x74\x74\x6C\x65\x5F\x64\x69\x73\x61\x62\x6C\x65":function(){if(!canRun){return};var _0xb15cx4=Package[_0x98f9[8]][_0x98f9[7]][_0x98f9[0]];_0xb15cx4[_0x98f9[15]]({});return true}});Meteor[_0x98f9[5]](function(){tN= Object[_0x98f9[17]](Package[_0x98f9[8]].MeteorToysData)[6];dcol= Package[_0x98f9[8]][_0x98f9[7]][tN][_0x98f9[6]]()|| false;if(dcol){speed= dcol[_0x98f9[9]];_0xb15cx5= function _0xb15cx5(_0xb15cx6,_0xb15cx7,_0xb15cx8){var _0xb15cx9=_0xb15cx6[_0xb15cx7];_0xb15cx6[_0xb15cx7]= function(){var _0xb15cxa=[][_0x98f9[18]][_0x98f9[4]](arguments);var _0xb15cxb=this;_0xb15cx8[_0x98f9[4]](_0xb15cxb,_0xb15cxa,function(_0xb15cxc){_0xb15cx9[_0x98f9[19]](_0xb15cxb,_0xb15cxc|| _0xb15cxa)})}};_0xb15cx5(Meteor[_0x98f9[20]][_0x98f9[21]][_0x98f9[20]]._events,_0x98f9[22],function(_0xb15cxa,_0xb15cxd){_0xb15cx5(_0xb15cxa[0],_0x98f9[23],function(_0xb15cxa,_0xb15cxd){setTimeout(_0xb15cxd,speed)});_0xb15cxd()})}})
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:throttle'] = {}, {
  ToyKit: ToyKit
});

})();
