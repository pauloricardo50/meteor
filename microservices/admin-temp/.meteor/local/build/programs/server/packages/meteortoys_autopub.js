(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, canRun, doc, disable;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_autopub/server/server.js                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0x130e=["\x41\x75\x74\x6F\x50\x75\x62","\x31\x2E\x30\x2E\x30","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x61\x75\x74\x6F\x70\x75\x62","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x73\x74\x61\x72\x74\x75\x70","\x6D\x6F\x6E\x67\x6F","\x66\x69\x6E\x64\x4F\x6E\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x72\x65\x6D\x6F\x76\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x41\x75\x74\x6F\x50\x75\x62","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x69\x6E\x73\x65\x72\x74","\x6D\x65\x74\x68\x6F\x64\x73","\x72\x65\x6D\x6F\x76\x65"];ToyKit= {name:_0x130e[0],version:_0x130e[1],template:_0x130e[2],ToyKit:_0x130e[1]};Meteor[_0x130e[5]](function(){Meteor[_0x130e[4]](_0x130e[3],function(_0x78e9x1,_0x78e9x2){canRun= _0x78e9x2})});if(Package[_0x130e[6]]){Meteor[_0x130e[13]]({MeteorToys_autopub:function(){if(!canRun){return};doc= Package[_0x130e[9]][_0x130e[8]][_0x130e[0]][_0x130e[7]]();if(doc){Meteor[_0x130e[4]](_0x130e[10],_0x130e[11],doc._id)}else {Meteor[_0x130e[4]](_0x130e[12],_0x130e[11],{"\x61\x75\x74\x6F\x70\x75\x62":true})}}})};disable= function(){Package[_0x130e[9]][_0x130e[8]][_0x130e[0]][_0x130e[14]]({})}
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:autopub'] = {}, {
  ToyKit: ToyKit,
  disable: disable
});

})();
