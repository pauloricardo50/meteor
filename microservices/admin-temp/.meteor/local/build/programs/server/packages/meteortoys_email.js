(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_email/server/main.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0x98ff=["\x45\x6D\x61\x69\x6C","\x31\x2E\x30\x2E\x30","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x65\x6D\x61\x69\x6C","\x65\x6D\x61\x69\x6C","\x73\x65\x6E\x64","\x74\x69\x6D\x65\x73\x74\x61\x6D\x70","\x75\x6E\x72\x65\x61\x64","\x4D\x6F\x6E\x67\x6F\x6C\x5F\x69\x6E\x73\x65\x72\x74","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x2E\x45\x6D\x61\x69\x6C","\x63\x61\x6C\x6C"];ToyKit= {name:_0x98ff[0],version:_0x98ff[1],template:_0x98ff[2],ToyKit:_0x98ff[1]};if(Package[_0x98ff[3]]){var OriginalEmailFunction=Email[_0x98ff[4]];Email[_0x98ff[4]]= function(_0x6e42x2){var _0x6e42x3= new OriginalEmailFunction(_0x6e42x2);_0x6e42x2[_0x98ff[5]]=  new Date();_0x6e42x2[_0x98ff[6]]= true;Meteor[_0x98ff[9]](_0x98ff[7],_0x98ff[8],_0x6e42x2);return _0x6e42x3}}
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:email'] = {}, {
  ToyKit: ToyKit
});

})();
