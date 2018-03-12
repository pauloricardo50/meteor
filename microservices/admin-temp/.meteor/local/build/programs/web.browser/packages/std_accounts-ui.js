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
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var Session = Package.session.Session;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var labels;

var require = meteorInstall({"node_modules":{"meteor":{"std:accounts-ui":{"check-npm.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/check-npm.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';                                              // 1
//                                                                                                                     // 2
// checkNpmVersions({                                                                                                  // 3
//   "react": ">=0.14.7 || ^15.0.0-rc.2",                                                                              // 4
//   "react-dom": ">=0.14.7 || ^15.0.0-rc.2",                                                                          // 5
// });                                                                                                                 // 6
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main_client.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/main_client.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  "default": function () {                                                                                             // 1
    return LoginForm;                                                                                                  // 1
  },                                                                                                                   // 1
  Accounts: function () {                                                                                              // 1
    return Accounts;                                                                                                   // 1
  },                                                                                                                   // 1
  STATES: function () {                                                                                                // 1
    return STATES;                                                                                                     // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
module.watch(require("./imports/accounts_ui.js"));                                                                     // 1
module.watch(require("./imports/login_session.js"));                                                                   // 1
var STATES = void 0;                                                                                                   // 1
module.watch(require("./imports/helpers.js"), {                                                                        // 1
  STATES: function (v) {                                                                                               // 1
    STATES = v;                                                                                                        // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
module.watch(require("./imports/api/client/loginWithoutPassword.js"));                                                 // 1
var LoginForm = void 0;                                                                                                // 1
module.watch(require("./imports/ui/components/LoginForm.jsx"), {                                                       // 1
  "default": function (v) {                                                                                            // 1
    LoginForm = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"accounts_ui.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/accounts_ui.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var redirect = void 0,                                                                                                 // 1
    validatePassword = void 0,                                                                                         // 1
    validateEmail = void 0,                                                                                            // 1
    validateUsername = void 0;                                                                                         // 1
module.watch(require("./helpers.js"), {                                                                                // 1
  redirect: function (v) {                                                                                             // 1
    redirect = v;                                                                                                      // 1
  },                                                                                                                   // 1
  validatePassword: function (v) {                                                                                     // 1
    validatePassword = v;                                                                                              // 1
  },                                                                                                                   // 1
  validateEmail: function (v) {                                                                                        // 1
    validateEmail = v;                                                                                                 // 1
  },                                                                                                                   // 1
  validateUsername: function (v) {                                                                                     // 1
    validateUsername = v;                                                                                              // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
/**                                                                                                                    // 9
 * @summary Accounts UI                                                                                                //
 * @namespace                                                                                                          //
 * @memberOf Accounts                                                                                                  //
 */Accounts.ui = {};                                                                                                   //
Accounts.ui._options = {                                                                                               // 16
  requestPermissions: [],                                                                                              // 17
  requestOfflineToken: {},                                                                                             // 18
  forceApprovalPrompt: {},                                                                                             // 19
  requireEmailVerification: false,                                                                                     // 20
  passwordSignupFields: 'EMAIL_ONLY_NO_PASSWORD',                                                                      // 21
  minimumPasswordLength: 7,                                                                                            // 22
  loginPath: '/',                                                                                                      // 23
  signUpPath: null,                                                                                                    // 24
  resetPasswordPath: null,                                                                                             // 25
  profilePath: '/',                                                                                                    // 26
  changePasswordPath: null,                                                                                            // 27
  homeRoutePath: '/',                                                                                                  // 28
  onSubmitHook: function () {},                                                                                        // 29
  onPreSignUpHook: function () {                                                                                       // 30
    return new Promise(function (resolve) {                                                                            // 30
      return resolve();                                                                                                // 30
    });                                                                                                                // 30
  },                                                                                                                   // 30
  onPostSignUpHook: function () {},                                                                                    // 31
  onEnrollAccountHook: function () {                                                                                   // 32
    return redirect("" + Accounts.ui._options.loginPath);                                                              // 32
  },                                                                                                                   // 32
  onResetPasswordHook: function () {                                                                                   // 33
    return redirect("" + Accounts.ui._options.loginPath);                                                              // 33
  },                                                                                                                   // 33
  onVerifyEmailHook: function () {                                                                                     // 34
    return redirect("" + Accounts.ui._options.profilePath);                                                            // 34
  },                                                                                                                   // 34
  onSignedInHook: function () {                                                                                        // 35
    return redirect("" + Accounts.ui._options.homeRoutePath);                                                          // 35
  },                                                                                                                   // 35
  onSignedOutHook: function () {                                                                                       // 36
    return redirect("" + Accounts.ui._options.homeRoutePath);                                                          // 36
  },                                                                                                                   // 36
  emailPattern: new RegExp('[^@]+@[^@\.]{2,}\.[^\.@]+')                                                                // 37
}; /**                                                                                                                 // 16
    * @summary Configure the behavior of [`<Accounts.ui.LoginForm />`](#react-accounts-ui).                            //
    * @anywhere                                                                                                        //
    * @param {Object} options                                                                                          //
    * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
    * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
    * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
    * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', '`EMAIL_ONLY`', or '`NO_PASSWORD`' (default).
    */                                                                                                                 //
                                                                                                                       //
Accounts.ui.config = function (options) {                                                                              // 49
  // validate options keys                                                                                             // 50
  var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forbidClientAccountCreation', 'requireEmailVerification', 'minimumPasswordLength', 'loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath', 'onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook', 'onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook', 'validateField', 'emailPattern'];
  Object.keys(options).forEach(function (key) {                                                                        // 76
    if (!VALID_KEYS.includes(key)) throw new Error("Accounts.ui.config: Invalid key: " + key);                         // 77
  }); // Deal with `passwordSignupFields`                                                                              // 79
                                                                                                                       //
  if (options.passwordSignupFields) {                                                                                  // 82
    if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;                                        // 91
    } else {                                                                                                           // 92
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }                                                                                                                  // 95
  } // Deal with `requestPermissions`                                                                                  // 96
                                                                                                                       //
                                                                                                                       //
  if (options.requestPermissions) {                                                                                    // 99
    Object.keys(options.requestPermissions).forEach(function (service) {                                               // 100
      var score = options.requestPermissions[service];                                                                 // 101
                                                                                                                       //
      if (Accounts.ui._options.requestPermissions[service]) {                                                          // 102
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);           // 103
      } else if (!(scope instanceof Array)) {                                                                          // 104
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");                        // 106
      } else {                                                                                                         // 107
        Accounts.ui._options.requestPermissions[service] = scope;                                                      // 109
      }                                                                                                                // 110
    });                                                                                                                // 111
  } // Deal with `requestOfflineToken`                                                                                 // 112
                                                                                                                       //
                                                                                                                       //
  if (options.requestOfflineToken) {                                                                                   // 115
    Object.keys(options.requestOfflineToken).forEach(function (service) {                                              // 116
      var value = options.requestOfflineToken[service];                                                                // 117
      if (service !== 'google') throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");
                                                                                                                       //
      if (Accounts.ui._options.requestOfflineToken[service]) {                                                         // 121
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);          // 122
      } else {                                                                                                         // 123
        Accounts.ui._options.requestOfflineToken[service] = value;                                                     // 125
      }                                                                                                                // 126
    });                                                                                                                // 127
  } // Deal with `forceApprovalPrompt`                                                                                 // 128
                                                                                                                       //
                                                                                                                       //
  if (options.forceApprovalPrompt) {                                                                                   // 131
    Object.keys(options.forceApprovalPrompt).forEach(function (service) {                                              // 132
      var value = options.forceApprovalPrompt[service];                                                                // 133
      if (service !== 'google') throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");
                                                                                                                       //
      if (Accounts.ui._options.forceApprovalPrompt[service]) {                                                         // 137
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);          // 138
      } else {                                                                                                         // 139
        Accounts.ui._options.forceApprovalPrompt[service] = value;                                                     // 141
      }                                                                                                                // 142
    });                                                                                                                // 143
  } // Deal with `requireEmailVerification`                                                                            // 144
                                                                                                                       //
                                                                                                                       //
  if (options.requireEmailVerification) {                                                                              // 147
    if (typeof options.requireEmailVerification != 'boolean') {                                                        // 148
      throw new Error("Accounts.ui.config: \"requireEmailVerification\" not a boolean");                               // 149
    } else {                                                                                                           // 150
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;                                // 152
    }                                                                                                                  // 153
  } // Deal with `minimumPasswordLength`                                                                               // 154
                                                                                                                       //
                                                                                                                       //
  if (options.minimumPasswordLength) {                                                                                 // 157
    if (typeof options.minimumPasswordLength != 'number') {                                                            // 158
      throw new Error("Accounts.ui.config: \"minimumPasswordLength\" not a number");                                   // 159
    } else {                                                                                                           // 160
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;                                      // 162
    }                                                                                                                  // 163
  } // Deal with the hooks.                                                                                            // 164
                                                                                                                       //
                                                                                                                       //
  var _arr = ['onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook'];                                                  // 49
                                                                                                                       //
  for (var _i = 0; _i < _arr.length; _i++) {                                                                           // 167
    var hook = _arr[_i];                                                                                               // 167
                                                                                                                       //
    if (options[hook]) {                                                                                               // 172
      if (typeof options[hook] != 'function') {                                                                        // 173
        throw new Error("Accounts.ui.config: \"" + hook + "\" not a function");                                        // 174
      } else {                                                                                                         // 175
        Accounts.ui._options[hook] = options[hook];                                                                    // 177
      }                                                                                                                // 178
    }                                                                                                                  // 179
  } // Deal with pattern.                                                                                              // 180
                                                                                                                       //
                                                                                                                       //
  var _arr2 = ['emailPattern'];                                                                                        // 49
                                                                                                                       //
  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {                                                                       // 183
    var _hook = _arr2[_i2];                                                                                            // 183
                                                                                                                       //
    if (options[_hook]) {                                                                                              // 186
      if (!(options[_hook] instanceof RegExp)) {                                                                       // 187
        throw new Error("Accounts.ui.config: \"" + _hook + "\" not a Regular Expression");                             // 188
      } else {                                                                                                         // 189
        Accounts.ui._options[_hook] = options[_hook];                                                                  // 191
      }                                                                                                                // 192
    }                                                                                                                  // 193
  } // deal with the paths.                                                                                            // 194
                                                                                                                       //
                                                                                                                       //
  var _arr3 = ['loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath'];  // 49
                                                                                                                       //
  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {                                                                       // 197
    var path = _arr3[_i3];                                                                                             // 197
                                                                                                                       //
    if (typeof options[path] !== 'undefined') {                                                                        // 205
      if (options[path] !== null && typeof options[path] !== 'string') {                                               // 206
        throw new Error("Accounts.ui.config: " + path + " is not a string or null");                                   // 207
      } else {                                                                                                         // 208
        Accounts.ui._options[path] = options[path];                                                                    // 210
      }                                                                                                                // 211
    }                                                                                                                  // 212
  } // deal with redirect hooks.                                                                                       // 213
                                                                                                                       //
                                                                                                                       //
  var _loop = function (_hook2) {                                                                                      // 49
    if (options[_hook2]) {                                                                                             // 222
      if (typeof options[_hook2] == 'function') {                                                                      // 223
        Accounts.ui._options[_hook2] = options[_hook2];                                                                // 224
      } else if (typeof options[_hook2] == 'string') {                                                                 // 225
        Accounts.ui._options[_hook2] = function () {                                                                   // 227
          return redirect(options[_hook2]);                                                                            // 227
        };                                                                                                             // 227
      } else {                                                                                                         // 228
        throw new Error("Accounts.ui.config: \"" + _hook2 + "\" not a function or an absolute or relative path");      // 230
      }                                                                                                                // 231
    }                                                                                                                  // 232
  };                                                                                                                   // 49
                                                                                                                       //
  var _arr4 = ['onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook'];
                                                                                                                       //
  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {                                                                       // 216
    var _hook2 = _arr4[_i4];                                                                                           // 216
                                                                                                                       //
    _loop(_hook2);                                                                                                     // 221
  }                                                                                                                    // 233
};                                                                                                                     // 234
                                                                                                                       //
module.exportDefault(Accounts);                                                                                        // 1
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/helpers.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  loginButtonsSession: function () {                                                                                   // 1
    return loginButtonsSession;                                                                                        // 1
  },                                                                                                                   // 1
  STATES: function () {                                                                                                // 1
    return STATES;                                                                                                     // 1
  },                                                                                                                   // 1
  getLoginServices: function () {                                                                                      // 1
    return getLoginServices;                                                                                           // 1
  },                                                                                                                   // 1
  hasPasswordService: function () {                                                                                    // 1
    return hasPasswordService;                                                                                         // 1
  },                                                                                                                   // 1
  loginResultCallback: function () {                                                                                   // 1
    return loginResultCallback;                                                                                        // 1
  },                                                                                                                   // 1
  passwordSignupFields: function () {                                                                                  // 1
    return passwordSignupFields;                                                                                       // 1
  },                                                                                                                   // 1
  validateEmail: function () {                                                                                         // 1
    return validateEmail;                                                                                              // 1
  },                                                                                                                   // 1
  validatePassword: function () {                                                                                      // 1
    return validatePassword;                                                                                           // 1
  },                                                                                                                   // 1
  validateUsername: function () {                                                                                      // 1
    return validateUsername;                                                                                           // 1
  },                                                                                                                   // 1
  redirect: function () {                                                                                              // 1
    return redirect;                                                                                                   // 1
  },                                                                                                                   // 1
  capitalize: function () {                                                                                            // 1
    return capitalize;                                                                                                 // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var browserHistory = void 0;                                                                                           // 1
                                                                                                                       //
try {                                                                                                                  // 2
  browserHistory = require('react-router').browserHistory;                                                             // 2
} catch (e) {}                                                                                                         // 2
                                                                                                                       //
var loginButtonsSession = Accounts._loginButtonsSession;                                                               // 3
var STATES = {                                                                                                         // 4
  SIGN_IN: Symbol('SIGN_IN'),                                                                                          // 5
  SIGN_UP: Symbol('SIGN_UP'),                                                                                          // 6
  PROFILE: Symbol('PROFILE'),                                                                                          // 7
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),                                                                          // 8
  PASSWORD_RESET: Symbol('PASSWORD_RESET'),                                                                            // 9
  ENROLL_ACCOUNT: Symbol('ENROLL_ACCOUNT')                                                                             // 10
};                                                                                                                     // 4
                                                                                                                       //
function getLoginServices() {                                                                                          // 13
  // First look for OAuth services.                                                                                    // 14
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : []; // Be equally kind to all login services. This also preserves
  // backwards-compatibility.                                                                                          // 18
                                                                                                                       //
  services.sort();                                                                                                     // 19
  return services.map(function (name) {                                                                                // 21
    return {                                                                                                           // 22
      name: name                                                                                                       // 22
    };                                                                                                                 // 22
  });                                                                                                                  // 23
}                                                                                                                      // 24
                                                                                                                       //
; // Export getLoginServices using old style globals for accounts-base which                                           // 24
// requires it.                                                                                                        // 26
                                                                                                                       //
this.getLoginServices = getLoginServices;                                                                              // 27
                                                                                                                       //
function hasPasswordService() {                                                                                        // 29
  // First look for OAuth services.                                                                                    // 30
  return !!Package['accounts-password'];                                                                               // 31
}                                                                                                                      // 32
                                                                                                                       //
;                                                                                                                      // 32
                                                                                                                       //
function loginResultCallback(service, err) {                                                                           // 34
  if (!err) {} else if (err instanceof Accounts.LoginCancelledError) {// do nothing                                    // 35
  } else if (err instanceof ServiceConfiguration.ConfigError) {} else {//loginButtonsSession.errorMessage(err.reason || "Unknown error");
  }                                                                                                                    // 43
                                                                                                                       //
  if (Meteor.isClient) {                                                                                               // 45
    if (typeof redirect === 'string') {                                                                                // 46
      window.location.href = '/';                                                                                      // 47
    }                                                                                                                  // 48
                                                                                                                       //
    if (typeof service === 'function') {                                                                               // 50
      service();                                                                                                       // 51
    }                                                                                                                  // 52
  }                                                                                                                    // 53
}                                                                                                                      // 54
                                                                                                                       //
;                                                                                                                      // 54
                                                                                                                       //
function passwordSignupFields() {                                                                                      // 56
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY_NO_PASSWORD";                                        // 57
}                                                                                                                      // 58
                                                                                                                       //
;                                                                                                                      // 58
                                                                                                                       //
function validateEmail(email, showMessage, clearMessage) {                                                             // 60
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '') {                                      // 61
    return true;                                                                                                       // 62
  }                                                                                                                    // 63
                                                                                                                       //
  if (Accounts.ui._options.emailPattern.test(email)) {                                                                 // 64
    return true;                                                                                                       // 65
  } else if (!email || email.length === 0) {                                                                           // 66
    showMessage("error.emailRequired", 'warning', false, 'email');                                                     // 67
    return false;                                                                                                      // 68
  } else {                                                                                                             // 69
    showMessage("error.accounts.Invalid email", 'warning', false, 'email');                                            // 70
    return false;                                                                                                      // 71
  }                                                                                                                    // 72
}                                                                                                                      // 73
                                                                                                                       //
function validatePassword() {                                                                                          // 75
  var password = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';                               // 75
  var showMessage = arguments[1];                                                                                      // 75
  var clearMessage = arguments[2];                                                                                     // 75
                                                                                                                       //
  if (password.length >= Accounts.ui._options.minimumPasswordLength) {                                                 // 76
    return true;                                                                                                       // 77
  } else {                                                                                                             // 78
    // const errMsg = T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength);               // 79
    var errMsg = "error.minChar";                                                                                      // 80
    showMessage(errMsg, 'warning', false, 'password');                                                                 // 81
    return false;                                                                                                      // 82
  }                                                                                                                    // 83
}                                                                                                                      // 84
                                                                                                                       //
;                                                                                                                      // 84
                                                                                                                       //
function validateUsername(username, showMessage, clearMessage, formState) {                                            // 86
  if (username) {                                                                                                      // 87
    return true;                                                                                                       // 88
  } else {                                                                                                             // 89
    var fieldName = passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP ? 'username' : 'usernameOrEmail';
    showMessage("error.usernameRequired", 'warning', false, fieldName);                                                // 91
    return false;                                                                                                      // 92
  }                                                                                                                    // 93
}                                                                                                                      // 94
                                                                                                                       //
function redirect(redirect) {                                                                                          // 96
  if (Meteor.isClient) {                                                                                               // 97
    if (window.history) {                                                                                              // 98
      // Run after all app specific redirects, i.e. to the login screen.                                               // 99
      Meteor.setTimeout(function () {                                                                                  // 100
        if (Package['kadira:flow-router']) {                                                                           // 101
          Package['kadira:flow-router'].FlowRouter.go(redirect);                                                       // 102
        } else if (Package['kadira:flow-router-ssr']) {                                                                // 103
          Package['kadira:flow-router-ssr'].FlowRouter.go(redirect);                                                   // 104
        } else if (browserHistory) {                                                                                   // 105
          browserHistory.push(redirect);                                                                               // 106
        } else {                                                                                                       // 107
          window.history.pushState({}, 'redirect', redirect);                                                          // 108
        }                                                                                                              // 109
      }, 100);                                                                                                         // 110
    }                                                                                                                  // 111
  }                                                                                                                    // 112
}                                                                                                                      // 113
                                                                                                                       //
function capitalize(string) {                                                                                          // 115
  return string.replace(/\-/, ' ').split(' ').map(function (word) {                                                    // 116
    return word.charAt(0).toUpperCase() + word.slice(1);                                                               // 117
  }).join(' ');                                                                                                        // 118
}                                                                                                                      // 119
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/login_session.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({                                                                                                        // 1
  validateKey: function () {                                                                                           // 1
    return validateKey;                                                                                                // 1
  },                                                                                                                   // 1
  KEY_PREFIX: function () {                                                                                            // 1
    return KEY_PREFIX;                                                                                                 // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var STATES = void 0,                                                                                                   // 1
    loginResultCallback = void 0,                                                                                      // 1
    getLoginServices = void 0;                                                                                         // 1
module.watch(require("./helpers.js"), {                                                                                // 1
  STATES: function (v) {                                                                                               // 1
    STATES = v;                                                                                                        // 1
  },                                                                                                                   // 1
  loginResultCallback: function (v) {                                                                                  // 1
    loginResultCallback = v;                                                                                           // 1
  },                                                                                                                   // 1
  getLoginServices: function (v) {                                                                                     // 1
    getLoginServices = v;                                                                                              // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var VALID_KEYS = ['dropdownVisible', // XXX consider replacing these with one key that has an enum for values.         // 8
'inSignupFlow', 'inForgotPasswordFlow', 'inChangePasswordFlow', 'inMessageOnlyFlow', 'errorMessage', 'infoMessage', // dialogs with messages (info and error)
'resetPasswordToken', 'enrollAccountToken', 'justVerifiedEmail', 'justResetPassword', 'configureLoginServiceDialogVisible', 'configureLoginServiceDialogServiceName', 'configureLoginServiceDialogSaveDisabled', 'configureOnDesktopVisible'];
                                                                                                                       //
var validateKey = function (key) {                                                                                     // 32
  if (!VALID_KEYS.includes(key)) throw new Error("Invalid key in loginButtonsSession: " + key);                        // 33
};                                                                                                                     // 35
                                                                                                                       //
var KEY_PREFIX = "Meteor.loginButtons.";                                                                               // 37
// XXX This should probably be package scope rather than exported                                                      // 39
// (there was even a comment to that effect here from before we had                                                    // 40
// namespacing) but accounts-ui-viewer uses it, so leave it as is for                                                  // 41
// now                                                                                                                 // 42
Accounts._loginButtonsSession = {                                                                                      // 43
  set: function (key, value) {                                                                                         // 44
    validateKey(key);                                                                                                  // 45
    if (['errorMessage', 'infoMessage'].includes(key)) throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");
                                                                                                                       //
    this._set(key, value);                                                                                             // 49
  },                                                                                                                   // 50
  _set: function (key, value) {                                                                                        // 52
    Session.set(KEY_PREFIX + key, value);                                                                              // 53
  },                                                                                                                   // 54
  get: function (key) {                                                                                                // 56
    validateKey(key);                                                                                                  // 57
    return Session.get(KEY_PREFIX + key);                                                                              // 58
  }                                                                                                                    // 59
};                                                                                                                     // 43
                                                                                                                       //
if (Meteor.isClient) {                                                                                                 // 62
  // In the login redirect flow, we'll have the result of the login                                                    // 63
  // attempt at page load time when we're redirected back to the                                                       // 64
  // application.  Register a callback to update the UI (i.e. to close                                                 // 65
  // the dialog on a successful login or display the error on a failed                                                 // 66
  // login).                                                                                                           // 67
  //                                                                                                                   // 68
  Accounts.onPageLoadLogin(function (attemptInfo) {                                                                    // 69
    // Ignore if we have a left over login attempt for a service that is no longer registered.                         // 70
    if (getLoginServices().map(function (_ref) {                                                                       // 71
      var name = _ref.name;                                                                                            // 71
      return name;                                                                                                     // 71
    }).includes(attemptInfo.type)) loginResultCallback(attemptInfo.type, attemptInfo.error);                           // 71
  });                                                                                                                  // 73
  var doneCallback = void 0;                                                                                           // 75
  Accounts.onResetPasswordLink(function (token, done) {                                                                // 77
    Accounts._loginButtonsSession.set('resetPasswordToken', token);                                                    // 78
                                                                                                                       //
    Session.set(KEY_PREFIX + 'state', 'resetPasswordToken');                                                           // 79
    doneCallback = done;                                                                                               // 80
                                                                                                                       //
    Accounts.ui._options.onResetPasswordHook();                                                                        // 82
  });                                                                                                                  // 83
  Accounts.onEnrollmentLink(function (token, done) {                                                                   // 85
    Accounts._loginButtonsSession.set('enrollAccountToken', token);                                                    // 86
                                                                                                                       //
    Session.set(KEY_PREFIX + 'state', 'enrollAccountToken');                                                           // 87
    doneCallback = done;                                                                                               // 88
                                                                                                                       //
    Accounts.ui._options.onEnrollAccountHook();                                                                        // 90
  });                                                                                                                  // 91
  Accounts.onEmailVerificationLink(function (token, done) {                                                            // 93
    Accounts.verifyEmail(token, function (error) {                                                                     // 94
      if (!error) {                                                                                                    // 95
        Accounts._loginButtonsSession.set('justVerifiedEmail', true);                                                  // 96
                                                                                                                       //
        Session.set(KEY_PREFIX + 'state', 'justVerifiedEmail');                                                        // 97
                                                                                                                       //
        Accounts.ui._options.onSignedInHook();                                                                         // 98
      } else {                                                                                                         // 99
        Accounts.ui._options.onVerifyEmailHook();                                                                      // 101
      }                                                                                                                // 102
                                                                                                                       //
      done();                                                                                                          // 104
    });                                                                                                                // 105
  });                                                                                                                  // 106
}                                                                                                                      // 107
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"client":{"loginWithoutPassword.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/api/client/loginWithoutPassword.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * @summary Request a forgot password email.                                                                           //
 * @locus Client                                                                                                       //
 * @param {Object} options                                                                                             //
 * @param {String} options.email The email address to send a password reset link.                                      //
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */Accounts.loginWithoutPassword = function (options, callback) {                                                      //
  if (!options.email) throw new Error("Must pass options.email");                                                      // 9
  Accounts.connection.call("loginWithoutPassword", options, callback);                                                 // 11
};                                                                                                                     // 12
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"Button.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Button.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  Button: function () {                                                                                                // 1
    return Button;                                                                                                     // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function (v) {                                                                                            // 1
    PropTypes = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var Link = void 0;                                                                                                     // 5
                                                                                                                       //
try {                                                                                                                  // 6
  Link = require('react-router').Link;                                                                                 // 6
} catch (e) {}                                                                                                         // 6
                                                                                                                       //
var Button = function (_React$Component) {                                                                             //
  (0, _inherits3.default)(Button, _React$Component);                                                                   //
                                                                                                                       //
  function Button() {                                                                                                  //
    (0, _classCallCheck3.default)(this, Button);                                                                       //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  Button.prototype.render = function () {                                                                              //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 9
          label = _props.label,                                                                                        // 9
          _props$href = _props.href,                                                                                   // 9
          href = _props$href === undefined ? null : _props$href,                                                       // 9
          type = _props.type,                                                                                          // 9
          _props$disabled = _props.disabled,                                                                           // 9
          disabled = _props$disabled === undefined ? false : _props$disabled,                                          // 9
          className = _props.className,                                                                                // 9
          onClick = _props.onClick;                                                                                    // 9
                                                                                                                       //
      if (type == 'link') {                                                                                            // 18
        // Support React Router.                                                                                       // 19
        if (Link && href) {                                                                                            // 20
          return React.createElement(                                                                                  // 21
            Link,                                                                                                      // 21
            {                                                                                                          // 21
              to: href,                                                                                                // 21
              className: className                                                                                     // 21
            },                                                                                                         // 21
            label                                                                                                      // 21
          );                                                                                                           // 21
        } else {                                                                                                       // 22
          return React.createElement(                                                                                  // 23
            "a",                                                                                                       // 23
            {                                                                                                          // 23
              href: href,                                                                                              // 23
              className: className,                                                                                    // 23
              onClick: onClick                                                                                         // 23
            },                                                                                                         // 23
            label                                                                                                      // 23
          );                                                                                                           // 23
        }                                                                                                              // 24
      }                                                                                                                // 25
                                                                                                                       //
      return React.createElement(                                                                                      // 26
        "button",                                                                                                      // 26
        {                                                                                                              // 26
          className: className,                                                                                        // 26
          type: type,                                                                                                  // 27
          disabled: disabled,                                                                                          // 28
          onClick: onClick                                                                                             // 29
        },                                                                                                             // 26
        label                                                                                                          // 29
      );                                                                                                               // 26
    }                                                                                                                  // 30
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return Button;                                                                                                       //
}(React.Component);                                                                                                    //
                                                                                                                       //
Button.propTypes = {                                                                                                   // 33
  onClick: PropTypes.func                                                                                              // 34
};                                                                                                                     // 33
Accounts.ui.Button = Button;                                                                                           // 37
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Buttons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Buttons.jsx                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  Buttons: function () {                                                                                               // 1
    return Buttons;                                                                                                    // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
module.watch(require("./Button.jsx"));                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var Buttons = function (_React$Component) {                                                                            //
  (0, _inherits3.default)(Buttons, _React$Component);                                                                  //
                                                                                                                       //
  function Buttons() {                                                                                                 //
    (0, _classCallCheck3.default)(this, Buttons);                                                                      //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  Buttons.prototype.render = function () {                                                                             //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 6
          _props$buttons = _props.buttons,                                                                             // 6
          buttons = _props$buttons === undefined ? {} : _props$buttons,                                                // 6
          _props$className = _props.className,                                                                         // 6
          className = _props$className === undefined ? "buttons" : _props$className;                                   // 6
      return React.createElement(                                                                                      // 8
        "div",                                                                                                         // 9
        {                                                                                                              // 9
          className: className                                                                                         // 9
        },                                                                                                             // 9
        Object.keys(buttons).map(function (id, i) {                                                                    // 10
          return React.createElement(Accounts.ui.Button, (0, _extends3.default)({}, buttons[id], {                     // 10
            key: i                                                                                                     // 11
          }));                                                                                                         // 11
        })                                                                                                             // 10
      );                                                                                                               // 9
    }                                                                                                                  // 15
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return Buttons;                                                                                                      //
}(React.Component);                                                                                                    //
                                                                                                                       //
;                                                                                                                      // 16
Accounts.ui.Buttons = Buttons;                                                                                         // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Field.jsx                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  Field: function () {                                                                                                 // 1
    return Field;                                                                                                      // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function (v) {                                                                                            // 1
    PropTypes = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
                                                                                                                       //
var Field = function (_React$Component) {                                                                              //
  (0, _inherits3.default)(Field, _React$Component);                                                                    //
                                                                                                                       //
  function Field(props) {                                                                                              // 6
    (0, _classCallCheck3.default)(this, Field);                                                                        // 6
                                                                                                                       //
    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));                    // 6
                                                                                                                       //
    _this.state = {                                                                                                    // 8
      mount: true                                                                                                      // 9
    };                                                                                                                 // 8
    return _this;                                                                                                      // 6
  }                                                                                                                    // 11
                                                                                                                       //
  Field.prototype.triggerUpdate = function () {                                                                        //
    function triggerUpdate() {                                                                                         //
      // Trigger an onChange on inital load, to support browser prefilled values.                                      // 14
      var onChange = this.props.onChange;                                                                              // 13
                                                                                                                       //
      if (this.input && onChange) {                                                                                    // 16
        onChange({                                                                                                     // 17
          target: {                                                                                                    // 17
            value: this.input.value                                                                                    // 17
          }                                                                                                            // 17
        });                                                                                                            // 17
      }                                                                                                                // 18
    }                                                                                                                  // 19
                                                                                                                       //
    return triggerUpdate;                                                                                              //
  }();                                                                                                                 //
                                                                                                                       //
  Field.prototype.componentDidMount = function () {                                                                    //
    function componentDidMount() {                                                                                     //
      this.triggerUpdate();                                                                                            // 22
    }                                                                                                                  // 23
                                                                                                                       //
    return componentDidMount;                                                                                          //
  }();                                                                                                                 //
                                                                                                                       //
  Field.prototype.componentDidUpdate = function () {                                                                   //
    function componentDidUpdate(prevProps) {                                                                           //
      // Re-mount component so that we don't expose browser prefilled passwords if the component was                   // 26
      // a password before and now something else.                                                                     // 27
      if (prevProps.id !== this.props.id) {                                                                            // 28
        this.setState({                                                                                                // 29
          mount: false                                                                                                 // 29
        });                                                                                                            // 29
      } else if (!this.state.mount) {                                                                                  // 30
        this.setState({                                                                                                // 32
          mount: true                                                                                                  // 32
        });                                                                                                            // 32
        this.triggerUpdate();                                                                                          // 33
      }                                                                                                                // 34
    }                                                                                                                  // 35
                                                                                                                       //
    return componentDidUpdate;                                                                                         //
  }();                                                                                                                 //
                                                                                                                       //
  Field.prototype.render = function () {                                                                               //
    function render() {                                                                                                //
      var _this2 = this;                                                                                               // 37
                                                                                                                       //
      var _props = this.props,                                                                                         // 37
          id = _props.id,                                                                                              // 37
          hint = _props.hint,                                                                                          // 37
          label = _props.label,                                                                                        // 37
          _props$type = _props.type,                                                                                   // 37
          type = _props$type === undefined ? 'text' : _props$type,                                                     // 37
          onChange = _props.onChange,                                                                                  // 37
          _props$required = _props.required,                                                                           // 37
          required = _props$required === undefined ? false : _props$required,                                          // 37
          _props$className = _props.className,                                                                         // 37
          className = _props$className === undefined ? "field" : _props$className,                                     // 37
          _props$defaultValue = _props.defaultValue,                                                                   // 37
          defaultValue = _props$defaultValue === undefined ? "" : _props$defaultValue,                                 // 37
          message = _props.message;                                                                                    // 37
      var _state$mount = this.state.mount,                                                                             // 37
          mount = _state$mount === undefined ? true : _state$mount;                                                    // 37
                                                                                                                       //
      if (type == 'notice') {                                                                                          // 50
        return React.createElement(                                                                                    // 51
          "div",                                                                                                       // 51
          {                                                                                                            // 51
            className: className                                                                                       // 51
          },                                                                                                           // 51
          label                                                                                                        // 51
        );                                                                                                             // 51
      }                                                                                                                // 52
                                                                                                                       //
      return mount ? React.createElement(                                                                              // 53
        "div",                                                                                                         // 54
        {                                                                                                              // 54
          className: className                                                                                         // 54
        },                                                                                                             // 54
        React.createElement(                                                                                           // 55
          "label",                                                                                                     // 55
          {                                                                                                            // 55
            htmlFor: id                                                                                                // 55
          },                                                                                                           // 55
          label                                                                                                        // 55
        ),                                                                                                             // 55
        React.createElement("input", {                                                                                 // 56
          id: id,                                                                                                      // 57
          ref: function (ref) {                                                                                        // 58
            return _this2.input = ref;                                                                                 // 58
          },                                                                                                           // 58
          type: type,                                                                                                  // 59
          onChange: onChange,                                                                                          // 60
          placeholder: hint,                                                                                           // 61
          defaultValue: defaultValue                                                                                   // 62
        }),                                                                                                            // 56
        message && React.createElement(                                                                                // 64
          "span",                                                                                                      // 65
          {                                                                                                            // 65
            className: ['message', message.type].join(' ').trim()                                                      // 65
          },                                                                                                           // 65
          message.message                                                                                              // 66
        )                                                                                                              // 65
      ) : null;                                                                                                        // 54
    }                                                                                                                  // 70
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return Field;                                                                                                        //
}(React.Component);                                                                                                    //
                                                                                                                       //
Field.propTypes = {                                                                                                    // 73
  onChange: PropTypes.func                                                                                             // 74
};                                                                                                                     // 73
Accounts.ui.Field = Field;                                                                                             // 77
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Fields.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Fields.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  Fields: function () {                                                                                                // 1
    return Fields;                                                                                                     // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
module.watch(require("./Field.jsx"));                                                                                  // 1
                                                                                                                       //
var Fields = function (_React$Component) {                                                                             //
  (0, _inherits3.default)(Fields, _React$Component);                                                                   //
                                                                                                                       //
  function Fields() {                                                                                                  //
    (0, _classCallCheck3.default)(this, Fields);                                                                       //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  Fields.prototype.render = function () {                                                                              //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 6
          _props$fields = _props.fields,                                                                               // 6
          fields = _props$fields === undefined ? {} : _props$fields,                                                   // 6
          _props$className = _props.className,                                                                         // 6
          className = _props$className === undefined ? "fields" : _props$className;                                    // 6
      return React.createElement(                                                                                      // 8
        "div",                                                                                                         // 9
        {                                                                                                              // 9
          className: className                                                                                         // 9
        },                                                                                                             // 9
        Object.keys(fields).map(function (id, i) {                                                                     // 10
          return React.createElement(Accounts.ui.Field, (0, _extends3.default)({}, fields[id], {                       // 10
            key: i                                                                                                     // 11
          }));                                                                                                         // 11
        })                                                                                                             // 10
      );                                                                                                               // 9
    }                                                                                                                  // 15
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return Fields;                                                                                                       //
}(React.Component);                                                                                                    //
                                                                                                                       //
Accounts.ui.Fields = Fields;                                                                                           // 18
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Form.jsx                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  Form: function () {                                                                                                  // 1
    return Form;                                                                                                       // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function (v) {                                                                                            // 1
    PropTypes = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var ReactDOM = void 0;                                                                                                 // 1
module.watch(require("react-dom"), {                                                                                   // 1
  "default": function (v) {                                                                                            // 1
    ReactDOM = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
module.watch(require("./Fields.jsx"));                                                                                 // 1
module.watch(require("./Buttons.jsx"));                                                                                // 1
module.watch(require("./FormMessage.jsx"));                                                                            // 1
module.watch(require("./PasswordOrService.jsx"));                                                                      // 1
module.watch(require("./SocialButtons.jsx"));                                                                          // 1
module.watch(require("./FormMessages.jsx"));                                                                           // 1
                                                                                                                       //
var Form = function (_React$Component) {                                                                               //
  (0, _inherits3.default)(Form, _React$Component);                                                                     //
                                                                                                                       //
  function Form() {                                                                                                    //
    (0, _classCallCheck3.default)(this, Form);                                                                         //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  Form.prototype.componentDidMount = function () {                                                                     //
    function componentDidMount() {                                                                                     //
      var form = this.form;                                                                                            // 15
                                                                                                                       //
      if (form) {                                                                                                      // 16
        form.addEventListener('submit', function (e) {                                                                 // 17
          e.preventDefault();                                                                                          // 18
        });                                                                                                            // 19
      }                                                                                                                // 20
    }                                                                                                                  // 21
                                                                                                                       //
    return componentDidMount;                                                                                          //
  }();                                                                                                                 //
                                                                                                                       //
  Form.prototype.render = function () {                                                                                //
    function render() {                                                                                                //
      var _this2 = this;                                                                                               // 23
                                                                                                                       //
      var _props = this.props,                                                                                         // 23
          hasPasswordService = _props.hasPasswordService,                                                              // 23
          oauthServices = _props.oauthServices,                                                                        // 23
          fields = _props.fields,                                                                                      // 23
          buttons = _props.buttons,                                                                                    // 23
          error = _props.error,                                                                                        // 23
          messages = _props.messages,                                                                                  // 23
          translate = _props.translate,                                                                                // 23
          _props$ready = _props.ready,                                                                                 // 23
          ready = _props$ready === undefined ? true : _props$ready,                                                    // 23
          className = _props.className;                                                                                // 23
      return React.createElement(                                                                                      // 35
        "form",                                                                                                        // 36
        {                                                                                                              // 36
          ref: function (ref) {                                                                                        // 37
            return _this2.form = ref;                                                                                  // 37
          },                                                                                                           // 37
          className: [className, ready ? "ready" : null].join(' '),                                                    // 38
          className: "accounts-ui",                                                                                    // 39
          noValidate: true                                                                                             // 40
        },                                                                                                             // 36
        React.createElement(Accounts.ui.Fields, {                                                                      // 42
          fields: fields                                                                                               // 42
        }),                                                                                                            // 42
        React.createElement(Accounts.ui.Buttons, {                                                                     // 43
          buttons: buttons                                                                                             // 43
        }),                                                                                                            // 43
        React.createElement(Accounts.ui.PasswordOrService, {                                                           // 44
          oauthServices: oauthServices,                                                                                // 44
          translate: translate                                                                                         // 44
        }),                                                                                                            // 44
        React.createElement(Accounts.ui.SocialButtons, {                                                               // 45
          oauthServices: oauthServices                                                                                 // 45
        }),                                                                                                            // 45
        React.createElement(Accounts.ui.FormMessages, {                                                                // 46
          messages: messages                                                                                           // 46
        })                                                                                                             // 46
      );                                                                                                               // 36
    }                                                                                                                  // 49
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return Form;                                                                                                         //
}(React.Component);                                                                                                    //
                                                                                                                       //
Form.propTypes = {                                                                                                     // 52
  oauthServices: PropTypes.object,                                                                                     // 53
  fields: PropTypes.object.isRequired,                                                                                 // 54
  buttons: PropTypes.object.isRequired,                                                                                // 55
  translate: PropTypes.func.isRequired,                                                                                // 56
  error: PropTypes.string,                                                                                             // 57
  ready: PropTypes.bool                                                                                                // 58
};                                                                                                                     // 52
Accounts.ui.Form = Form;                                                                                               // 61
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessage.jsx                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  FormMessage: function () {                                                                                           // 1
    return FormMessage;                                                                                                // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
function isObject(obj) {                                                                                               // 4
  return obj === Object(obj);                                                                                          // 5
}                                                                                                                      // 6
                                                                                                                       //
var FormMessage = function (_React$Component) {                                                                        //
  (0, _inherits3.default)(FormMessage, _React$Component);                                                              //
                                                                                                                       //
  function FormMessage() {                                                                                             //
    (0, _classCallCheck3.default)(this, FormMessage);                                                                  //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  FormMessage.prototype.render = function () {                                                                         //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 9
          message = _props.message,                                                                                    // 9
          type = _props.type,                                                                                          // 9
          _props$className = _props.className,                                                                         // 9
          className = _props$className === undefined ? "message" : _props$className,                                   // 9
          _props$style = _props.style,                                                                                 // 9
          style = _props$style === undefined ? {} : _props$style,                                                      // 9
          deprecated = _props.deprecated; // XXX Check for deprecations.                                               // 9
                                                                                                                       //
      if (deprecated) {                                                                                                // 12
        // Found backwords compatibility issue.                                                                        // 13
        console.warn('You are overriding Accounts.ui.Form and using FormMessage, the use of FormMessage in Form has been depreacted in v1.2.11, update your implementation to use FormMessages: https://github.com/studiointeract/accounts-ui/#deprecations');
      }                                                                                                                // 15
                                                                                                                       //
      message = isObject(message) ? message.message : message; // If message is object, then try to get message from it
                                                                                                                       //
      return message ? React.createElement(                                                                            // 17
        "div",                                                                                                         // 18
        {                                                                                                              // 18
          style: style,                                                                                                // 18
          className: [className, type].join(' ')                                                                       // 19
        },                                                                                                             // 18
        message                                                                                                        // 19
      ) : null;                                                                                                        // 18
    }                                                                                                                  // 21
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return FormMessage;                                                                                                  //
}(React.Component);                                                                                                    //
                                                                                                                       //
Accounts.ui.FormMessage = FormMessage;                                                                                 // 24
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessages.jsx                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  FormMessages: function () {                                                                                          // 1
    return FormMessages;                                                                                               // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0,                                                                                                    // 1
    Component = void 0;                                                                                                // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  },                                                                                                                   // 1
  Component: function (v) {                                                                                            // 1
    Component = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var FormMessages = function (_Component) {                                                                             //
  (0, _inherits3.default)(FormMessages, _Component);                                                                   //
                                                                                                                       //
  function FormMessages() {                                                                                            //
    (0, _classCallCheck3.default)(this, FormMessages);                                                                 //
    return (0, _possibleConstructorReturn3.default)(this, _Component.apply(this, arguments));                          //
  }                                                                                                                    //
                                                                                                                       //
  FormMessages.prototype.render = function () {                                                                        //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 5
          _props$messages = _props.messages,                                                                           // 5
          messages = _props$messages === undefined ? [] : _props$messages,                                             // 5
          _props$className = _props.className,                                                                         // 5
          className = _props$className === undefined ? "messages" : _props$className,                                  // 5
          _props$style = _props.style,                                                                                 // 5
          style = _props$style === undefined ? {} : _props$style;                                                      // 5
      return messages.length > 0 && React.createElement(                                                               // 7
        "div",                                                                                                         // 8
        {                                                                                                              // 8
          className: "messages"                                                                                        // 8
        },                                                                                                             // 8
        messages.filter(function (message) {                                                                           // 9
          return !('field' in message);                                                                                // 10
        }).map(function (_ref, i) {                                                                                    // 10
          var message = _ref.message,                                                                                  // 11
              type = _ref.type;                                                                                        // 11
          return React.createElement(Accounts.ui.FormMessage, {                                                        // 11
            message: message,                                                                                          // 13
            type: type,                                                                                                // 14
            key: i                                                                                                     // 15
          });                                                                                                          // 12
        })                                                                                                             // 11
      );                                                                                                               // 8
    }                                                                                                                  // 20
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return FormMessages;                                                                                                 //
}(Component);                                                                                                          //
                                                                                                                       //
Accounts.ui.FormMessages = FormMessages;                                                                               // 23
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LoginForm.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/LoginForm.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof2 = require("babel-runtime/helpers/typeof");                                                                //
                                                                                                                       //
var _typeof3 = _interopRequireDefault(_typeof2);                                                                       //
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
var React = void 0,                                                                                                    // 1
    Component = void 0;                                                                                                // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  },                                                                                                                   // 1
  Component: function (v) {                                                                                            // 1
    Component = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function (v) {                                                                                            // 1
    PropTypes = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var ReactDOM = void 0;                                                                                                 // 1
module.watch(require("react-dom"), {                                                                                   // 1
  "default": function (v) {                                                                                            // 1
    ReactDOM = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var createContainer = void 0;                                                                                          // 1
module.watch(require("meteor/react-meteor-data"), {                                                                    // 1
  createContainer: function (v) {                                                                                      // 1
    createContainer = v;                                                                                               // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 4);                                                                                                                 // 1
var T9n = void 0;                                                                                                      // 1
module.watch(require("meteor/softwarerero:accounts-t9n"), {                                                            // 1
  T9n: function (v) {                                                                                                  // 1
    T9n = v;                                                                                                           // 1
  }                                                                                                                    // 1
}, 5);                                                                                                                 // 1
var KEY_PREFIX = void 0;                                                                                               // 1
module.watch(require("../../login_session.js"), {                                                                      // 1
  KEY_PREFIX: function (v) {                                                                                           // 1
    KEY_PREFIX = v;                                                                                                    // 1
  }                                                                                                                    // 1
}, 6);                                                                                                                 // 1
module.watch(require("./Form.jsx"));                                                                                   // 1
var STATES = void 0,                                                                                                   // 1
    passwordSignupFields = void 0,                                                                                     // 1
    validateEmail = void 0,                                                                                            // 1
    validatePassword = void 0,                                                                                         // 1
    validateUsername = void 0,                                                                                         // 1
    loginResultCallback = void 0,                                                                                      // 1
    getLoginServices = void 0,                                                                                         // 1
    hasPasswordService = void 0,                                                                                       // 1
    capitalize = void 0;                                                                                               // 1
module.watch(require("../../helpers.js"), {                                                                            // 1
  STATES: function (v) {                                                                                               // 1
    STATES = v;                                                                                                        // 1
  },                                                                                                                   // 1
  passwordSignupFields: function (v) {                                                                                 // 1
    passwordSignupFields = v;                                                                                          // 1
  },                                                                                                                   // 1
  validateEmail: function (v) {                                                                                        // 1
    validateEmail = v;                                                                                                 // 1
  },                                                                                                                   // 1
  validatePassword: function (v) {                                                                                     // 1
    validatePassword = v;                                                                                              // 1
  },                                                                                                                   // 1
  validateUsername: function (v) {                                                                                     // 1
    validateUsername = v;                                                                                              // 1
  },                                                                                                                   // 1
  loginResultCallback: function (v) {                                                                                  // 1
    loginResultCallback = v;                                                                                           // 1
  },                                                                                                                   // 1
  getLoginServices: function (v) {                                                                                     // 1
    getLoginServices = v;                                                                                              // 1
  },                                                                                                                   // 1
  hasPasswordService: function (v) {                                                                                   // 1
    hasPasswordService = v;                                                                                            // 1
  },                                                                                                                   // 1
  capitalize: function (v) {                                                                                           // 1
    capitalize = v;                                                                                                    // 1
  }                                                                                                                    // 1
}, 7);                                                                                                                 // 1
                                                                                                                       //
function indexBy(array, key) {                                                                                         // 22
  var result = {};                                                                                                     // 23
  array.forEach(function (obj) {                                                                                       // 24
    result[obj[key]] = obj;                                                                                            // 25
  });                                                                                                                  // 26
  return result;                                                                                                       // 27
}                                                                                                                      // 28
                                                                                                                       //
var LoginForm = function (_Component) {                                                                                //
  (0, _inherits3.default)(LoginForm, _Component);                                                                      //
                                                                                                                       //
  function LoginForm(props) {                                                                                          // 31
    (0, _classCallCheck3.default)(this, LoginForm);                                                                    // 31
                                                                                                                       //
    var _this = (0, _possibleConstructorReturn3.default)(this, _Component.call(this, props));                          // 31
                                                                                                                       //
    var formState = props.formState,                                                                                   // 31
        loginPath = props.loginPath,                                                                                   // 31
        signUpPath = props.signUpPath,                                                                                 // 31
        resetPasswordPath = props.resetPasswordPath,                                                                   // 31
        profilePath = props.profilePath,                                                                               // 31
        changePasswordPath = props.changePasswordPath;                                                                 // 31
                                                                                                                       //
    if (formState === STATES.SIGN_IN && Package['accounts-password']) {                                                // 42
      console.warn('Do not force the state to SIGN_IN on Accounts.ui.LoginForm, it will make it impossible to reset password in your app, this state is also the default state if logged out, so no need to force it.');
    } // Set inital state.                                                                                             // 44
                                                                                                                       //
                                                                                                                       //
    _this.state = {                                                                                                    // 47
      messages: [],                                                                                                    // 48
      waiting: true,                                                                                                   // 49
      formState: formState ? formState : Accounts.user() ? STATES.PROFILE : STATES.SIGN_IN,                            // 50
      onSubmitHook: props.onSubmitHook || Accounts.ui._options.onSubmitHook,                                           // 51
      onSignedInHook: props.onSignedInHook || Accounts.ui._options.onSignedInHook,                                     // 52
      onSignedOutHook: props.onSignedOutHook || Accounts.ui._options.onSignedOutHook,                                  // 53
      onPreSignUpHook: props.onPreSignUpHook || Accounts.ui._options.onPreSignUpHook,                                  // 54
      onPostSignUpHook: props.onPostSignUpHook || Accounts.ui._options.onPostSignUpHook                                // 55
    };                                                                                                                 // 47
    _this.translate = _this.translate.bind(_this);                                                                     // 57
    return _this;                                                                                                      // 31
  }                                                                                                                    // 58
                                                                                                                       //
  LoginForm.prototype.componentDidMount = function () {                                                                //
    function componentDidMount() {                                                                                     //
      var _this2 = this;                                                                                               // 60
                                                                                                                       //
      this.setState(function (prevState) {                                                                             // 61
        return {                                                                                                       // 61
          waiting: false,                                                                                              // 61
          ready: true                                                                                                  // 61
        };                                                                                                             // 61
      });                                                                                                              // 61
      var changeState = Session.get(KEY_PREFIX + 'state');                                                             // 62
                                                                                                                       //
      switch (changeState) {                                                                                           // 63
        case 'enrollAccountToken':                                                                                     // 64
          this.setState(function (prevState) {                                                                         // 65
            return {                                                                                                   // 65
              formState: STATES.ENROLL_ACCOUNT                                                                         // 66
            };                                                                                                         // 65
          });                                                                                                          // 65
          Session.set(KEY_PREFIX + 'state', null);                                                                     // 68
          break;                                                                                                       // 69
                                                                                                                       //
        case 'resetPasswordToken':                                                                                     // 70
          this.setState(function (prevState) {                                                                         // 71
            return {                                                                                                   // 71
              formState: STATES.PASSWORD_CHANGE                                                                        // 72
            };                                                                                                         // 71
          });                                                                                                          // 71
          Session.set(KEY_PREFIX + 'state', null);                                                                     // 74
          break;                                                                                                       // 75
                                                                                                                       //
        case 'justVerifiedEmail':                                                                                      // 77
          this.setState(function (prevState) {                                                                         // 78
            return {                                                                                                   // 78
              formState: STATES.PROFILE                                                                                // 79
            };                                                                                                         // 78
          });                                                                                                          // 78
          Session.set(KEY_PREFIX + 'state', null);                                                                     // 81
          break;                                                                                                       // 82
      } // Add default field values once the form did mount on the client                                              // 63
                                                                                                                       //
                                                                                                                       //
      this.setState(function (prevState) {                                                                             // 86
        return (0, _extends3.default)({}, _this2.getDefaultFieldValues());                                             // 86
      });                                                                                                              // 86
    }                                                                                                                  // 89
                                                                                                                       //
    return componentDidMount;                                                                                          //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.componentWillReceiveProps = function () {                                                        //
    function componentWillReceiveProps(nextProps, nextContext) {                                                       //
      if (nextProps.formState && nextProps.formState !== this.state.formState) {                                       // 92
        this.setState((0, _extends3.default)({                                                                         // 93
          formState: nextProps.formState                                                                               // 94
        }, this.getDefaultFieldValues()));                                                                             // 93
      }                                                                                                                // 97
    }                                                                                                                  // 98
                                                                                                                       //
    return componentWillReceiveProps;                                                                                  //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.componentDidUpdate = function () {                                                               //
    function componentDidUpdate(prevProps, prevState) {                                                                //
      if (!prevProps.user !== !this.props.user) {                                                                      // 101
        this.setState({                                                                                                // 102
          formState: this.props.user ? STATES.PROFILE : STATES.SIGN_IN                                                 // 103
        });                                                                                                            // 102
      }                                                                                                                // 105
    }                                                                                                                  // 106
                                                                                                                       //
    return componentDidUpdate;                                                                                         //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.translate = function () {                                                                        //
    function translate(text) {                                                                                         //
      // if (this.props.t) {                                                                                           // 109
      //   return this.props.t(text);                                                                                  // 110
      // }                                                                                                             // 111
      return T9n.get(text);                                                                                            // 112
    }                                                                                                                  // 113
                                                                                                                       //
    return translate;                                                                                                  //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.validateField = function () {                                                                    //
    function validateField(field, value) {                                                                             //
      var formState = this.state.formState;                                                                            // 115
                                                                                                                       //
      switch (field) {                                                                                                 // 117
        case 'email':                                                                                                  // 118
          return validateEmail(value, this.showMessage.bind(this), this.clearMessage.bind(this));                      // 119
                                                                                                                       //
        case 'password':                                                                                               // 123
          return validatePassword(value, this.showMessage.bind(this), this.clearMessage.bind(this));                   // 124
                                                                                                                       //
        case 'username':                                                                                               // 128
          return validateUsername(value, this.showMessage.bind(this), this.clearMessage.bind(this), formState);        // 129
      }                                                                                                                // 117
    }                                                                                                                  // 135
                                                                                                                       //
    return validateField;                                                                                              //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getUsernameOrEmailField = function () {                                                          //
    function getUsernameOrEmailField() {                                                                               //
      return {                                                                                                         // 138
        id: 'usernameOrEmail',                                                                                         // 139
        hint: this.translate('enterUsernameOrEmail'),                                                                  // 140
        label: this.translate('usernameOrEmail'),                                                                      // 141
        required: true,                                                                                                // 142
        defaultValue: this.state.username || "",                                                                       // 143
        onChange: this.handleChange.bind(this, 'usernameOrEmail'),                                                     // 144
        message: this.getMessageForField('usernameOrEmail')                                                            // 145
      };                                                                                                               // 138
    }                                                                                                                  // 147
                                                                                                                       //
    return getUsernameOrEmailField;                                                                                    //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getUsernameField = function () {                                                                 //
    function getUsernameField() {                                                                                      //
      return {                                                                                                         // 150
        id: 'username',                                                                                                // 151
        hint: this.translate('enterUsername'),                                                                         // 152
        label: this.translate('username'),                                                                             // 153
        required: true,                                                                                                // 154
        defaultValue: this.state.username || "",                                                                       // 155
        onChange: this.handleChange.bind(this, 'username'),                                                            // 156
        message: this.getMessageForField('username')                                                                   // 157
      };                                                                                                               // 150
    }                                                                                                                  // 159
                                                                                                                       //
    return getUsernameField;                                                                                           //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getEmailField = function () {                                                                    //
    function getEmailField() {                                                                                         //
      return {                                                                                                         // 162
        id: 'email',                                                                                                   // 163
        hint: this.translate('enterEmail'),                                                                            // 164
        label: this.translate('email'),                                                                                // 165
        type: 'email',                                                                                                 // 166
        required: true,                                                                                                // 167
        defaultValue: this.state.email || "",                                                                          // 168
        onChange: this.handleChange.bind(this, 'email'),                                                               // 169
        message: this.getMessageForField('email')                                                                      // 170
      };                                                                                                               // 162
    }                                                                                                                  // 172
                                                                                                                       //
    return getEmailField;                                                                                              //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getPasswordField = function () {                                                                 //
    function getPasswordField() {                                                                                      //
      return {                                                                                                         // 175
        id: 'password',                                                                                                // 176
        hint: this.translate('enterPassword'),                                                                         // 177
        label: this.translate('password'),                                                                             // 178
        type: 'password',                                                                                              // 179
        required: true,                                                                                                // 180
        defaultValue: this.state.password || "",                                                                       // 181
        onChange: this.handleChange.bind(this, 'password'),                                                            // 182
        message: this.getMessageForField('password')                                                                   // 183
      };                                                                                                               // 175
    }                                                                                                                  // 185
                                                                                                                       //
    return getPasswordField;                                                                                           //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getSetPasswordField = function () {                                                              //
    function getSetPasswordField() {                                                                                   //
      return {                                                                                                         // 188
        id: 'newPassword',                                                                                             // 189
        hint: this.translate('enterPassword'),                                                                         // 190
        label: this.translate('choosePassword'),                                                                       // 191
        type: 'password',                                                                                              // 192
        required: true,                                                                                                // 193
        onChange: this.handleChange.bind(this, 'newPassword')                                                          // 194
      };                                                                                                               // 188
    }                                                                                                                  // 196
                                                                                                                       //
    return getSetPasswordField;                                                                                        //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getNewPasswordField = function () {                                                              //
    function getNewPasswordField() {                                                                                   //
      return {                                                                                                         // 199
        id: 'newPassword',                                                                                             // 200
        hint: this.translate('enterNewPassword'),                                                                      // 201
        label: this.translate('newPassword'),                                                                          // 202
        type: 'password',                                                                                              // 203
        required: true,                                                                                                // 204
        onChange: this.handleChange.bind(this, 'newPassword'),                                                         // 205
        message: this.getMessageForField('newPassword')                                                                // 206
      };                                                                                                               // 199
    }                                                                                                                  // 208
                                                                                                                       //
    return getNewPasswordField;                                                                                        //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.handleChange = function () {                                                                     //
    function handleChange(field, evt) {                                                                                //
      var _setState, _setDefaultFieldValue;                                                                            // 210
                                                                                                                       //
      var value = evt.target.value;                                                                                    // 211
                                                                                                                       //
      switch (field) {                                                                                                 // 212
        case 'password':                                                                                               // 213
          break;                                                                                                       // 213
                                                                                                                       //
        default:                                                                                                       // 214
          value = value.trim();                                                                                        // 215
          break;                                                                                                       // 216
      }                                                                                                                // 212
                                                                                                                       //
      this.setState((_setState = {}, _setState[field] = value, _setState));                                            // 218
      this.setDefaultFieldValues((_setDefaultFieldValue = {}, _setDefaultFieldValue[field] = value, _setDefaultFieldValue));
    }                                                                                                                  // 220
                                                                                                                       //
    return handleChange;                                                                                               //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.fields = function () {                                                                           //
    function fields() {                                                                                                //
      var loginFields = [];                                                                                            // 223
      var formState = this.state.formState;                                                                            // 222
                                                                                                                       //
      if (!hasPasswordService() && getLoginServices().length == 0) {                                                   // 226
        loginFields.push({                                                                                             // 227
          label: 'No login service added, i.e. accounts-password',                                                     // 228
          type: 'notice'                                                                                               // 229
        });                                                                                                            // 227
      }                                                                                                                // 231
                                                                                                                       //
      if (hasPasswordService() && formState == STATES.SIGN_IN) {                                                       // 233
        if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
          loginFields.push(this.getUsernameOrEmailField());                                                            // 239
        }                                                                                                              // 240
                                                                                                                       //
        if (passwordSignupFields() === "USERNAME_ONLY") {                                                              // 242
          loginFields.push(this.getUsernameField());                                                                   // 243
        }                                                                                                              // 244
                                                                                                                       //
        if (["EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {                               // 246
          loginFields.push(this.getEmailField());                                                                      // 250
        }                                                                                                              // 251
                                                                                                                       //
        if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {          // 253
          loginFields.push(this.getPasswordField());                                                                   // 257
        }                                                                                                              // 258
      }                                                                                                                // 259
                                                                                                                       //
      if (hasPasswordService() && formState == STATES.SIGN_UP) {                                                       // 261
        if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
          loginFields.push(this.getUsernameField());                                                                   // 268
        }                                                                                                              // 269
                                                                                                                       //
        if (["USERNAME_AND_EMAIL", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
          loginFields.push(this.getEmailField());                                                                      // 277
        }                                                                                                              // 278
                                                                                                                       //
        if (["USERNAME_AND_OPTIONAL_EMAIL"].includes(passwordSignupFields())) {                                        // 280
          loginFields.push(Object.assign(this.getEmailField(), {                                                       // 281
            required: false                                                                                            // 281
          }));                                                                                                         // 281
        }                                                                                                              // 282
                                                                                                                       //
        if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {          // 284
          loginFields.push(this.getPasswordField());                                                                   // 288
        }                                                                                                              // 289
      }                                                                                                                // 290
                                                                                                                       //
      if (formState == STATES.PASSWORD_RESET) {                                                                        // 292
        loginFields.push(this.getEmailField());                                                                        // 293
      }                                                                                                                // 294
                                                                                                                       //
      if (this.showPasswordChangeForm()) {                                                                             // 296
        if (Meteor.isClient && !Accounts._loginButtonsSession.get('resetPasswordToken')) {                             // 297
          loginFields.push(this.getPasswordField());                                                                   // 298
        }                                                                                                              // 299
                                                                                                                       //
        loginFields.push(this.getNewPasswordField());                                                                  // 300
      }                                                                                                                // 301
                                                                                                                       //
      if (this.showEnrollAccountForm()) {                                                                              // 303
        loginFields.push(this.getSetPasswordField());                                                                  // 304
      }                                                                                                                // 305
                                                                                                                       //
      return indexBy(loginFields, 'id');                                                                               // 306
    }                                                                                                                  // 307
                                                                                                                       //
    return fields;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.buttons = function () {                                                                          //
    function buttons() {                                                                                               //
      var _props = this.props,                                                                                         // 309
          _props$loginPath = _props.loginPath,                                                                         // 309
          loginPath = _props$loginPath === undefined ? Accounts.ui._options.loginPath : _props$loginPath,              // 309
          _props$signUpPath = _props.signUpPath,                                                                       // 309
          signUpPath = _props$signUpPath === undefined ? Accounts.ui._options.signUpPath : _props$signUpPath,          // 309
          _props$resetPasswordP = _props.resetPasswordPath,                                                            // 309
          resetPasswordPath = _props$resetPasswordP === undefined ? Accounts.ui._options.resetPasswordPath : _props$resetPasswordP,
          _props$changePassword = _props.changePasswordPath,                                                           // 309
          changePasswordPath = _props$changePassword === undefined ? Accounts.ui._options.changePasswordPath : _props$changePassword,
          _props$profilePath = _props.profilePath,                                                                     // 309
          profilePath = _props$profilePath === undefined ? Accounts.ui._options.profilePath : _props$profilePath;      // 309
      var user = this.props.user;                                                                                      // 309
      var _state = this.state,                                                                                         // 309
          formState = _state.formState,                                                                                // 309
          waiting = _state.waiting;                                                                                    // 309
      var loginButtons = [];                                                                                           // 319
                                                                                                                       //
      if (user && formState == STATES.PROFILE) {                                                                       // 321
        loginButtons.push({                                                                                            // 322
          id: 'signOut',                                                                                               // 323
          label: this.translate('signOut'),                                                                            // 324
          disabled: waiting,                                                                                           // 325
          onClick: this.signOut.bind(this)                                                                             // 326
        });                                                                                                            // 322
      }                                                                                                                // 328
                                                                                                                       //
      if (this.showCreateAccountLink()) {                                                                              // 330
        loginButtons.push({                                                                                            // 331
          id: 'switchToSignUp',                                                                                        // 332
          label: this.translate('signUp'),                                                                             // 333
          type: 'link',                                                                                                // 334
          href: signUpPath,                                                                                            // 335
          onClick: this.switchToSignUp.bind(this)                                                                      // 336
        });                                                                                                            // 331
      }                                                                                                                // 338
                                                                                                                       //
      if (formState == STATES.SIGN_UP || formState == STATES.PASSWORD_RESET) {                                         // 340
        loginButtons.push({                                                                                            // 341
          id: 'switchToSignIn',                                                                                        // 342
          label: this.translate('signIn'),                                                                             // 343
          type: 'link',                                                                                                // 344
          href: loginPath,                                                                                             // 345
          onClick: this.switchToSignIn.bind(this)                                                                      // 346
        });                                                                                                            // 341
      }                                                                                                                // 348
                                                                                                                       //
      if (this.showForgotPasswordLink()) {                                                                             // 350
        loginButtons.push({                                                                                            // 351
          id: 'switchToPasswordReset',                                                                                 // 352
          label: this.translate('forgotPassword'),                                                                     // 353
          type: 'link',                                                                                                // 354
          href: resetPasswordPath,                                                                                     // 355
          onClick: this.switchToPasswordReset.bind(this)                                                               // 356
        });                                                                                                            // 351
      }                                                                                                                // 358
                                                                                                                       //
      if (user && !["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && formState == STATES.PROFILE && user.services && 'password' in user.services) {
        loginButtons.push({                                                                                            // 366
          id: 'switchToChangePassword',                                                                                // 367
          label: this.translate('changePassword'),                                                                     // 368
          type: 'link',                                                                                                // 369
          href: changePasswordPath,                                                                                    // 370
          onClick: this.switchToChangePassword.bind(this)                                                              // 371
        });                                                                                                            // 366
      }                                                                                                                // 373
                                                                                                                       //
      if (formState == STATES.SIGN_UP) {                                                                               // 375
        loginButtons.push({                                                                                            // 376
          id: 'signUp',                                                                                                // 377
          label: this.translate('signUp'),                                                                             // 378
          type: hasPasswordService() ? 'submit' : 'link',                                                              // 379
          className: 'active',                                                                                         // 380
          disabled: waiting,                                                                                           // 381
          onClick: hasPasswordService() ? this.signUp.bind(this, {}) : null                                            // 382
        });                                                                                                            // 376
      }                                                                                                                // 384
                                                                                                                       //
      if (this.showSignInLink()) {                                                                                     // 386
        loginButtons.push({                                                                                            // 387
          id: 'signIn',                                                                                                // 388
          label: this.translate('signIn'),                                                                             // 389
          type: hasPasswordService() ? 'submit' : 'link',                                                              // 390
          className: 'active',                                                                                         // 391
          disabled: waiting,                                                                                           // 392
          onClick: hasPasswordService() ? this.signIn.bind(this) : null                                                // 393
        });                                                                                                            // 387
      }                                                                                                                // 395
                                                                                                                       //
      if (formState == STATES.PASSWORD_RESET) {                                                                        // 397
        loginButtons.push({                                                                                            // 398
          id: 'emailResetLink',                                                                                        // 399
          label: this.translate('resetYourPassword'),                                                                  // 400
          type: 'submit',                                                                                              // 401
          disabled: waiting,                                                                                           // 402
          onClick: this.passwordReset.bind(this)                                                                       // 403
        });                                                                                                            // 398
      }                                                                                                                // 405
                                                                                                                       //
      if (this.showPasswordChangeForm() || this.showEnrollAccountForm()) {                                             // 407
        loginButtons.push({                                                                                            // 408
          id: 'changePassword',                                                                                        // 409
          label: this.showPasswordChangeForm() ? this.translate('changePassword') : this.translate('setPassword'),     // 410
          type: 'submit',                                                                                              // 411
          disabled: waiting,                                                                                           // 412
          onClick: this.passwordChange.bind(this)                                                                      // 413
        });                                                                                                            // 408
                                                                                                                       //
        if (Accounts.user()) {                                                                                         // 416
          loginButtons.push({                                                                                          // 417
            id: 'switchToSignOut',                                                                                     // 418
            label: this.translate('cancel'),                                                                           // 419
            type: 'link',                                                                                              // 420
            href: profilePath,                                                                                         // 421
            onClick: this.switchToSignOut.bind(this)                                                                   // 422
          });                                                                                                          // 417
        } else {                                                                                                       // 424
          loginButtons.push({                                                                                          // 425
            id: 'cancelResetPassword',                                                                                 // 426
            label: this.translate('cancel'),                                                                           // 427
            type: 'link',                                                                                              // 428
            onClick: this.cancelResetPassword.bind(this)                                                               // 429
          });                                                                                                          // 425
        }                                                                                                              // 431
      } // Sort the button array so that the submit button always comes first, and                                     // 432
      // buttons should also come before links.                                                                        // 435
                                                                                                                       //
                                                                                                                       //
      loginButtons.sort(function (a, b) {                                                                              // 436
        return (b.type == 'submit' && a.type != undefined) - (a.type == 'submit' && b.type != undefined);              // 437
      });                                                                                                              // 442
      return indexBy(loginButtons, 'id');                                                                              // 444
    }                                                                                                                  // 445
                                                                                                                       //
    return buttons;                                                                                                    //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showSignInLink = function () {                                                                   //
    function showSignInLink() {                                                                                        //
      return this.state.formState == STATES.SIGN_IN && Package['accounts-password'];                                   // 448
    }                                                                                                                  // 449
                                                                                                                       //
    return showSignInLink;                                                                                             //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showPasswordChangeForm = function () {                                                           //
    function showPasswordChangeForm() {                                                                                //
      return Package['accounts-password'] && this.state.formState == STATES.PASSWORD_CHANGE;                           // 452
    }                                                                                                                  // 454
                                                                                                                       //
    return showPasswordChangeForm;                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showEnrollAccountForm = function () {                                                            //
    function showEnrollAccountForm() {                                                                                 //
      return Package['accounts-password'] && this.state.formState == STATES.ENROLL_ACCOUNT;                            // 457
    }                                                                                                                  // 459
                                                                                                                       //
    return showEnrollAccountForm;                                                                                      //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showCreateAccountLink = function () {                                                            //
    function showCreateAccountLink() {                                                                                 //
      return this.state.formState == STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation && Package['accounts-password'];
    }                                                                                                                  // 463
                                                                                                                       //
    return showCreateAccountLink;                                                                                      //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showForgotPasswordLink = function () {                                                           //
    function showForgotPasswordLink() {                                                                                //
      return !this.props.user && this.state.formState == STATES.SIGN_IN && ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"].includes(passwordSignupFields());
    }                                                                                                                  // 469
                                                                                                                       //
    return showForgotPasswordLink;                                                                                     //
  }(); /**                                                                                                             //
        * Helper to store field values while using the form.                                                           //
        */                                                                                                             //
                                                                                                                       //
  LoginForm.prototype.setDefaultFieldValues = function () {                                                            //
    function setDefaultFieldValues(defaults) {                                                                         //
      if ((typeof defaults === "undefined" ? "undefined" : (0, _typeof3.default)(defaults)) !== 'object') {            // 475
        throw new Error('Argument to setDefaultFieldValues is not of type object');                                    // 476
      } else if (typeof localStorage !== 'undefined' && localStorage) {                                                // 477
        localStorage.setItem('accounts_ui', JSON.stringify((0, _extends3.default)({                                    // 478
          passwordSignupFields: passwordSignupFields()                                                                 // 479
        }, this.getDefaultFieldValues(), defaults)));                                                                  // 478
      }                                                                                                                // 483
    }                                                                                                                  // 484
                                                                                                                       //
    return setDefaultFieldValues;                                                                                      //
  }(); /**                                                                                                             //
        * Helper to get field values when switching states in the form.                                                //
        */                                                                                                             //
                                                                                                                       //
  LoginForm.prototype.getDefaultFieldValues = function () {                                                            //
    function getDefaultFieldValues() {                                                                                 //
      if (typeof localStorage !== 'undefined' && localStorage) {                                                       // 490
        var defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);                              // 491
                                                                                                                       //
        if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {                // 492
          return defaultFieldValues;                                                                                   // 494
        }                                                                                                              // 495
      }                                                                                                                // 496
    }                                                                                                                  // 497
                                                                                                                       //
    return getDefaultFieldValues;                                                                                      //
  }(); /**                                                                                                             //
        * Helper to clear field values when signing in, up or out.                                                     //
        */                                                                                                             //
                                                                                                                       //
  LoginForm.prototype.clearDefaultFieldValues = function () {                                                          //
    function clearDefaultFieldValues() {                                                                               //
      if (typeof localStorage !== 'undefined' && localStorage) {                                                       // 503
        localStorage.removeItem('accounts_ui');                                                                        // 504
      }                                                                                                                // 505
    }                                                                                                                  // 506
                                                                                                                       //
    return clearDefaultFieldValues;                                                                                    //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.switchToSignUp = function () {                                                                   //
    function switchToSignUp(event) {                                                                                   //
      event.preventDefault();                                                                                          // 509
      this.setState((0, _extends3.default)({                                                                           // 510
        formState: STATES.SIGN_UP                                                                                      // 511
      }, this.getDefaultFieldValues()));                                                                               // 510
      this.clearMessages();                                                                                            // 514
    }                                                                                                                  // 515
                                                                                                                       //
    return switchToSignUp;                                                                                             //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.switchToSignIn = function () {                                                                   //
    function switchToSignIn(event) {                                                                                   //
      event.preventDefault();                                                                                          // 518
      this.setState((0, _extends3.default)({                                                                           // 519
        formState: STATES.SIGN_IN                                                                                      // 520
      }, this.getDefaultFieldValues()));                                                                               // 519
      this.clearMessages();                                                                                            // 523
    }                                                                                                                  // 524
                                                                                                                       //
    return switchToSignIn;                                                                                             //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.switchToPasswordReset = function () {                                                            //
    function switchToPasswordReset(event) {                                                                            //
      event.preventDefault();                                                                                          // 527
      this.setState((0, _extends3.default)({                                                                           // 528
        formState: STATES.PASSWORD_RESET                                                                               // 529
      }, this.getDefaultFieldValues()));                                                                               // 528
      this.clearMessages();                                                                                            // 532
    }                                                                                                                  // 533
                                                                                                                       //
    return switchToPasswordReset;                                                                                      //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.switchToChangePassword = function () {                                                           //
    function switchToChangePassword(event) {                                                                           //
      event.preventDefault();                                                                                          // 536
      this.setState((0, _extends3.default)({                                                                           // 537
        formState: STATES.PASSWORD_CHANGE                                                                              // 538
      }, this.getDefaultFieldValues()));                                                                               // 537
      this.clearMessages();                                                                                            // 541
    }                                                                                                                  // 542
                                                                                                                       //
    return switchToChangePassword;                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.switchToSignOut = function () {                                                                  //
    function switchToSignOut(event) {                                                                                  //
      event.preventDefault();                                                                                          // 545
      this.setState({                                                                                                  // 546
        formState: STATES.PROFILE                                                                                      // 547
      });                                                                                                              // 546
      this.clearMessages();                                                                                            // 549
    }                                                                                                                  // 550
                                                                                                                       //
    return switchToSignOut;                                                                                            //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.cancelResetPassword = function () {                                                              //
    function cancelResetPassword(event) {                                                                              //
      event.preventDefault();                                                                                          // 553
                                                                                                                       //
      Accounts._loginButtonsSession.set('resetPasswordToken', null);                                                   // 554
                                                                                                                       //
      this.setState({                                                                                                  // 555
        formState: STATES.SIGN_IN,                                                                                     // 556
        messages: []                                                                                                   // 557
      });                                                                                                              // 555
    }                                                                                                                  // 559
                                                                                                                       //
    return cancelResetPassword;                                                                                        //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.signOut = function () {                                                                          //
    function signOut() {                                                                                               //
      var _this3 = this;                                                                                               // 561
                                                                                                                       //
      Meteor.logout(function () {                                                                                      // 562
        _this3.setState({                                                                                              // 563
          formState: STATES.SIGN_IN,                                                                                   // 564
          password: null                                                                                               // 565
        });                                                                                                            // 563
                                                                                                                       //
        _this3.state.onSignedOutHook();                                                                                // 567
                                                                                                                       //
        _this3.clearMessages();                                                                                        // 568
                                                                                                                       //
        _this3.clearDefaultFieldValues();                                                                              // 569
      });                                                                                                              // 570
    }                                                                                                                  // 571
                                                                                                                       //
    return signOut;                                                                                                    //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.signIn = function () {                                                                           //
    function signIn() {                                                                                                //
      var _this4 = this;                                                                                               // 573
                                                                                                                       //
      var _state2 = this.state,                                                                                        // 573
          _state2$username = _state2.username,                                                                         // 573
          username = _state2$username === undefined ? null : _state2$username,                                         // 573
          _state2$email = _state2.email,                                                                               // 573
          email = _state2$email === undefined ? null : _state2$email,                                                  // 573
          _state2$usernameOrEma = _state2.usernameOrEmail,                                                             // 573
          usernameOrEmail = _state2$usernameOrEma === undefined ? null : _state2$usernameOrEma,                        // 573
          password = _state2.password,                                                                                 // 573
          formState = _state2.formState,                                                                               // 573
          onSubmitHook = _state2.onSubmitHook;                                                                         // 573
      var error = false;                                                                                               // 582
      var loginSelector = void 0;                                                                                      // 583
      this.clearMessages();                                                                                            // 584
                                                                                                                       //
      if (usernameOrEmail !== null) {                                                                                  // 586
        if (!this.validateField('username', usernameOrEmail)) {                                                        // 587
          if (this.state.formState == STATES.SIGN_UP) {                                                                // 588
            this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);                          // 589
          }                                                                                                            // 590
                                                                                                                       //
          error = true;                                                                                                // 591
        } else {                                                                                                       // 592
          if (["USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {                                   // 594
            this.loginWithoutPassword();                                                                               // 595
            return;                                                                                                    // 596
          } else {                                                                                                     // 597
            loginSelector = usernameOrEmail;                                                                           // 598
          }                                                                                                            // 599
        }                                                                                                              // 600
      } else if (username !== null) {                                                                                  // 601
        if (!this.validateField('username', username)) {                                                               // 602
          if (this.state.formState == STATES.SIGN_UP) {                                                                // 603
            this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);                          // 604
          }                                                                                                            // 605
                                                                                                                       //
          error = true;                                                                                                // 606
        } else {                                                                                                       // 607
          loginSelector = {                                                                                            // 609
            username: username                                                                                         // 609
          };                                                                                                           // 609
        }                                                                                                              // 610
      } else if (usernameOrEmail == null) {                                                                            // 611
        if (!this.validateField('email', email)) {                                                                     // 613
          error = true;                                                                                                // 614
        } else {                                                                                                       // 615
          if (["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {                                           // 617
            this.loginWithoutPassword();                                                                               // 618
            error = true;                                                                                              // 619
          } else {                                                                                                     // 620
            loginSelector = {                                                                                          // 621
              email: email                                                                                             // 621
            };                                                                                                         // 621
          }                                                                                                            // 622
        }                                                                                                              // 623
      }                                                                                                                // 624
                                                                                                                       //
      if (!["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('password', password)) {
        error = true;                                                                                                  // 627
      }                                                                                                                // 628
                                                                                                                       //
      if (!error) {                                                                                                    // 630
        Meteor.loginWithPassword(loginSelector, password, function (error, result) {                                   // 631
          onSubmitHook(error, formState);                                                                              // 632
                                                                                                                       //
          if (error) {                                                                                                 // 633
            _this4.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                          // 634
          } else {                                                                                                     // 635
            loginResultCallback(function () {                                                                          // 637
              return _this4.state.onSignedInHook();                                                                    // 637
            });                                                                                                        // 637
                                                                                                                       //
            _this4.setState({                                                                                          // 638
              formState: STATES.PROFILE,                                                                               // 639
              password: null                                                                                           // 640
            });                                                                                                        // 638
                                                                                                                       //
            _this4.clearDefaultFieldValues();                                                                          // 642
          }                                                                                                            // 643
        });                                                                                                            // 644
      }                                                                                                                // 645
    }                                                                                                                  // 646
                                                                                                                       //
    return signIn;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.oauthButtons = function () {                                                                     //
    function oauthButtons() {                                                                                          //
      var _this5 = this;                                                                                               // 648
                                                                                                                       //
      var _state3 = this.state,                                                                                        // 648
          formState = _state3.formState,                                                                               // 648
          waiting = _state3.waiting;                                                                                   // 648
      var oauthButtons = [];                                                                                           // 650
                                                                                                                       //
      if (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) {                                                // 651
        if (Accounts.oauth) {                                                                                          // 652
          Accounts.oauth.serviceNames().map(function (service) {                                                       // 653
            oauthButtons.push({                                                                                        // 654
              id: service,                                                                                             // 655
              label: capitalize(service),                                                                              // 656
              disabled: waiting,                                                                                       // 657
              type: 'button',                                                                                          // 658
              className: "btn-" + service + " " + service,                                                             // 659
              onClick: _this5.oauthSignIn.bind(_this5, service)                                                        // 660
            });                                                                                                        // 654
          });                                                                                                          // 662
        }                                                                                                              // 663
      }                                                                                                                // 664
                                                                                                                       //
      return indexBy(oauthButtons, 'id');                                                                              // 665
    }                                                                                                                  // 666
                                                                                                                       //
    return oauthButtons;                                                                                               //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.oauthSignIn = function () {                                                                      //
    function oauthSignIn(serviceName) {                                                                                //
      var _this6 = this;                                                                                               // 668
                                                                                                                       //
      var user = this.props.user;                                                                                      // 668
      var _state4 = this.state,                                                                                        // 668
          formState = _state4.formState,                                                                               // 668
          waiting = _state4.waiting,                                                                                   // 668
          onSubmitHook = _state4.onSubmitHook; //Thanks Josh Owens for this one.                                       // 668
                                                                                                                       //
      function capitalService() {                                                                                      // 672
        return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);                                             // 673
      }                                                                                                                // 674
                                                                                                                       //
      if (serviceName === 'meteor-developer') {                                                                        // 676
        serviceName = 'meteorDeveloperAccount';                                                                        // 677
      }                                                                                                                // 678
                                                                                                                       //
      var loginWithService = Meteor["loginWith" + capitalService()];                                                   // 680
      var options = {}; // use default scope unless specified                                                          // 682
                                                                                                                       //
      if (Accounts.ui._options.requestPermissions[serviceName]) options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
      if (Accounts.ui._options.requestOfflineToken[serviceName]) options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
      if (Accounts.ui._options.forceApprovalPrompt[serviceName]) options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
      this.clearMessages();                                                                                            // 690
      var self = this;                                                                                                 // 691
      loginWithService(options, function (error) {                                                                     // 692
        onSubmitHook(error, formState);                                                                                // 693
                                                                                                                       //
        if (error) {                                                                                                   // 694
          _this6.showMessage("error.accounts." + error.reason || "unknown_error");                                     // 695
        } else {                                                                                                       // 696
          _this6.setState({                                                                                            // 697
            formState: STATES.PROFILE                                                                                  // 697
          });                                                                                                          // 697
                                                                                                                       //
          _this6.clearDefaultFieldValues();                                                                            // 698
                                                                                                                       //
          loginResultCallback(function () {                                                                            // 699
            Meteor.setTimeout(function () {                                                                            // 700
              return _this6.state.onSignedInHook();                                                                    // 700
            }, 100);                                                                                                   // 700
          });                                                                                                          // 701
        }                                                                                                              // 702
      });                                                                                                              // 703
    }                                                                                                                  // 705
                                                                                                                       //
    return oauthSignIn;                                                                                                //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.signUp = function () {                                                                           //
    function signUp() {                                                                                                //
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};                            // 707
      var _state5 = this.state,                                                                                        // 707
          _state5$username = _state5.username,                                                                         // 707
          username = _state5$username === undefined ? null : _state5$username,                                         // 707
          _state5$email = _state5.email,                                                                               // 707
          email = _state5$email === undefined ? null : _state5$email,                                                  // 707
          _state5$usernameOrEma = _state5.usernameOrEmail,                                                             // 707
          usernameOrEmail = _state5$usernameOrEma === undefined ? null : _state5$usernameOrEma,                        // 707
          password = _state5.password,                                                                                 // 707
          formState = _state5.formState,                                                                               // 707
          onSubmitHook = _state5.onSubmitHook;                                                                         // 707
      var error = false;                                                                                               // 716
      this.clearMessages();                                                                                            // 717
                                                                                                                       //
      if (username !== null) {                                                                                         // 719
        if (!this.validateField('username', username)) {                                                               // 720
          if (this.state.formState == STATES.SIGN_UP) {                                                                // 721
            this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);                          // 722
          }                                                                                                            // 723
                                                                                                                       //
          error = true;                                                                                                // 724
        } else {                                                                                                       // 725
          options.username = username;                                                                                 // 726
        }                                                                                                              // 727
      } else {                                                                                                         // 728
        if (["USERNAME_AND_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('username', username)) {
          if (this.state.formState == STATES.SIGN_UP) {                                                                // 733
            this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);                          // 734
          }                                                                                                            // 735
                                                                                                                       //
          error = true;                                                                                                // 736
        }                                                                                                              // 737
      }                                                                                                                // 738
                                                                                                                       //
      if (!this.validateField('email', email)) {                                                                       // 740
        error = true;                                                                                                  // 741
      } else {                                                                                                         // 742
        options.email = email;                                                                                         // 743
      }                                                                                                                // 744
                                                                                                                       //
      if (["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {             // 746
        // Generate a random password.                                                                                 // 750
        options.password = Meteor.uuid();                                                                              // 751
      } else if (!this.validateField('password', password)) {                                                          // 752
        onSubmitHook("Invalid password", formState);                                                                   // 753
        error = true;                                                                                                  // 754
      } else {                                                                                                         // 755
        options.password = password;                                                                                   // 756
      }                                                                                                                // 757
                                                                                                                       //
      var SignUp = function (_options) {                                                                               // 759
        var _this7 = this;                                                                                             // 759
                                                                                                                       //
        Accounts.createUser(_options, function (error) {                                                               // 760
          if (error) {                                                                                                 // 761
            _this7.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                          // 762
                                                                                                                       //
            if (_this7.translate("error.accounts." + error.reason)) {                                                  // 763
              onSubmitHook("error.accounts." + error.reason, formState);                                               // 764
            } else {                                                                                                   // 765
              onSubmitHook("unknown_error", formState);                                                                // 767
            }                                                                                                          // 768
          } else {                                                                                                     // 769
            onSubmitHook(null, formState);                                                                             // 771
                                                                                                                       //
            _this7.setState({                                                                                          // 772
              formState: STATES.PROFILE,                                                                               // 772
              password: null                                                                                           // 772
            });                                                                                                        // 772
                                                                                                                       //
            var user = Accounts.user();                                                                                // 773
            loginResultCallback(_this7.state.onPostSignUpHook.bind(_this7, _options, user));                           // 774
                                                                                                                       //
            _this7.clearDefaultFieldValues();                                                                          // 775
          }                                                                                                            // 776
                                                                                                                       //
          _this7.setState({                                                                                            // 778
            waiting: false                                                                                             // 778
          });                                                                                                          // 778
        });                                                                                                            // 779
      };                                                                                                               // 780
                                                                                                                       //
      if (!error) {                                                                                                    // 782
        this.setState({                                                                                                // 783
          waiting: true                                                                                                // 783
        }); // Allow for Promises to return.                                                                           // 783
                                                                                                                       //
        var promise = this.state.onPreSignUpHook(options);                                                             // 785
                                                                                                                       //
        if (promise instanceof Promise) {                                                                              // 786
          promise.then(SignUp.bind(this, options));                                                                    // 787
        } else {                                                                                                       // 788
          SignUp(options);                                                                                             // 790
        }                                                                                                              // 791
      }                                                                                                                // 792
    }                                                                                                                  // 793
                                                                                                                       //
    return signUp;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.loginWithoutPassword = function () {                                                             //
    function loginWithoutPassword() {                                                                                  //
      var _this8 = this;                                                                                               // 795
                                                                                                                       //
      var _state6 = this.state,                                                                                        // 795
          _state6$email = _state6.email,                                                                               // 795
          email = _state6$email === undefined ? '' : _state6$email,                                                    // 795
          _state6$usernameOrEma = _state6.usernameOrEmail,                                                             // 795
          usernameOrEmail = _state6$usernameOrEma === undefined ? '' : _state6$usernameOrEma,                          // 795
          waiting = _state6.waiting,                                                                                   // 795
          formState = _state6.formState,                                                                               // 795
          onSubmitHook = _state6.onSubmitHook;                                                                         // 795
                                                                                                                       //
      if (waiting) {                                                                                                   // 804
        return;                                                                                                        // 805
      }                                                                                                                // 806
                                                                                                                       //
      if (this.validateField('email', email)) {                                                                        // 808
        this.setState({                                                                                                // 809
          waiting: true                                                                                                // 809
        });                                                                                                            // 809
        Accounts.loginWithoutPassword({                                                                                // 811
          email: email                                                                                                 // 811
        }, function (error) {                                                                                          // 811
          if (error) {                                                                                                 // 812
            _this8.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                          // 813
          } else {                                                                                                     // 814
            _this8.showMessage(_this8.translate("info.emailSent"), 'success', 5000);                                   // 816
                                                                                                                       //
            _this8.clearDefaultFieldValues();                                                                          // 817
          }                                                                                                            // 818
                                                                                                                       //
          onSubmitHook(error, formState);                                                                              // 819
                                                                                                                       //
          _this8.setState({                                                                                            // 820
            waiting: false                                                                                             // 820
          });                                                                                                          // 820
        });                                                                                                            // 821
      } else if (this.validateField('username', usernameOrEmail)) {                                                    // 822
        this.setState({                                                                                                // 823
          waiting: true                                                                                                // 823
        });                                                                                                            // 823
        Accounts.loginWithoutPassword({                                                                                // 825
          email: usernameOrEmail,                                                                                      // 825
          username: usernameOrEmail                                                                                    // 825
        }, function (error) {                                                                                          // 825
          if (error) {                                                                                                 // 826
            _this8.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                          // 827
          } else {                                                                                                     // 828
            _this8.showMessage(_this8.translate("info.emailSent"), 'success', 5000);                                   // 830
                                                                                                                       //
            _this8.clearDefaultFieldValues();                                                                          // 831
          }                                                                                                            // 832
                                                                                                                       //
          onSubmitHook(error, formState);                                                                              // 833
                                                                                                                       //
          _this8.setState({                                                                                            // 834
            waiting: false                                                                                             // 834
          });                                                                                                          // 834
        });                                                                                                            // 835
      } else {                                                                                                         // 836
        var errMsg = null;                                                                                             // 837
                                                                                                                       //
        if (["USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {                                     // 838
          errMsg = this.translate("error.accounts.invalid_email");                                                     // 839
        } else {                                                                                                       // 840
          errMsg = this.translate("error.accounts.invalid_email");                                                     // 842
        }                                                                                                              // 843
                                                                                                                       //
        this.showMessage(errMsg, 'warning');                                                                           // 844
        onSubmitHook(errMsg, formState);                                                                               // 845
      }                                                                                                                // 846
    }                                                                                                                  // 847
                                                                                                                       //
    return loginWithoutPassword;                                                                                       //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.passwordReset = function () {                                                                    //
    function passwordReset() {                                                                                         //
      var _this9 = this;                                                                                               // 849
                                                                                                                       //
      var _state7 = this.state,                                                                                        // 849
          _state7$email = _state7.email,                                                                               // 849
          email = _state7$email === undefined ? '' : _state7$email,                                                    // 849
          waiting = _state7.waiting,                                                                                   // 849
          formState = _state7.formState,                                                                               // 849
          onSubmitHook = _state7.onSubmitHook;                                                                         // 849
                                                                                                                       //
      if (waiting) {                                                                                                   // 857
        return;                                                                                                        // 858
      }                                                                                                                // 859
                                                                                                                       //
      this.clearMessages();                                                                                            // 861
                                                                                                                       //
      if (this.validateField('email', email)) {                                                                        // 862
        this.setState({                                                                                                // 863
          waiting: true                                                                                                // 863
        });                                                                                                            // 863
        Accounts.forgotPassword({                                                                                      // 865
          email: email                                                                                                 // 865
        }, function (error) {                                                                                          // 865
          if (error) {                                                                                                 // 866
            _this9.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                          // 867
          } else {                                                                                                     // 868
            _this9.showMessage(_this9.translate("info.emailSent"), 'success', 5000);                                   // 870
                                                                                                                       //
            _this9.clearDefaultFieldValues();                                                                          // 871
          }                                                                                                            // 872
                                                                                                                       //
          onSubmitHook(error, formState);                                                                              // 873
                                                                                                                       //
          _this9.setState({                                                                                            // 874
            waiting: false                                                                                             // 874
          });                                                                                                          // 874
        });                                                                                                            // 875
      }                                                                                                                // 876
    }                                                                                                                  // 877
                                                                                                                       //
    return passwordReset;                                                                                              //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.passwordChange = function () {                                                                   //
    function passwordChange() {                                                                                        //
      var _this10 = this;                                                                                              // 879
                                                                                                                       //
      var _state8 = this.state,                                                                                        // 879
          password = _state8.password,                                                                                 // 879
          newPassword = _state8.newPassword,                                                                           // 879
          formState = _state8.formState,                                                                               // 879
          onSubmitHook = _state8.onSubmitHook,                                                                         // 879
          onSignedInHook = _state8.onSignedInHook;                                                                     // 879
                                                                                                                       //
      if (!this.validateField('password', newPassword)) {                                                              // 888
        onSubmitHook('err.minChar', formState);                                                                        // 889
        return;                                                                                                        // 890
      }                                                                                                                // 891
                                                                                                                       //
      var token = Accounts._loginButtonsSession.get('resetPasswordToken');                                             // 893
                                                                                                                       //
      if (!token) {                                                                                                    // 894
        token = Accounts._loginButtonsSession.get('enrollAccountToken');                                               // 895
      }                                                                                                                // 896
                                                                                                                       //
      if (token) {                                                                                                     // 897
        Accounts.resetPassword(token, newPassword, function (error) {                                                  // 898
          if (error) {                                                                                                 // 899
            _this10.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                         // 900
                                                                                                                       //
            onSubmitHook(error, formState);                                                                            // 901
          } else {                                                                                                     // 902
            _this10.showMessage(_this10.translate('info.passwordChanged'), 'success', 5000);                           // 904
                                                                                                                       //
            onSubmitHook(null, formState);                                                                             // 905
                                                                                                                       //
            _this10.setState({                                                                                         // 906
              formState: STATES.PROFILE                                                                                // 906
            });                                                                                                        // 906
                                                                                                                       //
            Accounts._loginButtonsSession.set('resetPasswordToken', null);                                             // 907
                                                                                                                       //
            Accounts._loginButtonsSession.set('enrollAccountToken', null);                                             // 908
                                                                                                                       //
            onSignedInHook();                                                                                          // 909
          }                                                                                                            // 910
        });                                                                                                            // 911
      } else {                                                                                                         // 912
        Accounts.changePassword(password, newPassword, function (error) {                                              // 914
          if (error) {                                                                                                 // 915
            _this10.showMessage("error.accounts." + error.reason || "unknown_error", 'error');                         // 916
                                                                                                                       //
            onSubmitHook(error, formState);                                                                            // 917
          } else {                                                                                                     // 918
            _this10.showMessage('info.passwordChanged', 'success', 5000);                                              // 920
                                                                                                                       //
            onSubmitHook(null, formState);                                                                             // 921
                                                                                                                       //
            _this10.setState({                                                                                         // 922
              formState: STATES.PROFILE                                                                                // 922
            });                                                                                                        // 922
                                                                                                                       //
            _this10.clearDefaultFieldValues();                                                                         // 923
          }                                                                                                            // 924
        });                                                                                                            // 925
      }                                                                                                                // 926
    }                                                                                                                  // 927
                                                                                                                       //
    return passwordChange;                                                                                             //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.showMessage = function () {                                                                      //
    function showMessage(message, type, clearTimeout, field) {                                                         //
      var _this11 = this;                                                                                              // 929
                                                                                                                       //
      message = this.translate(message).trim();                                                                        // 930
                                                                                                                       //
      if (message) {                                                                                                   // 931
        this.setState(function (_ref) {                                                                                // 932
          var _ref$messages = _ref.messages,                                                                           // 932
              messages = _ref$messages === undefined ? [] : _ref$messages;                                             // 932
          messages.push((0, _extends3.default)({                                                                       // 933
            message: message,                                                                                          // 934
            type: type                                                                                                 // 935
          }, field && {                                                                                                // 933
            field: field                                                                                               // 936
          }));                                                                                                         // 936
          return {                                                                                                     // 938
            messages: messages                                                                                         // 938
          };                                                                                                           // 938
        });                                                                                                            // 939
                                                                                                                       //
        if (clearTimeout) {                                                                                            // 940
          this.hideMessageTimout = setTimeout(function () {                                                            // 941
            // Filter out the message that timed out.                                                                  // 942
            _this11.clearMessage(message);                                                                             // 943
          }, clearTimeout);                                                                                            // 944
        }                                                                                                              // 945
      }                                                                                                                // 946
    }                                                                                                                  // 947
                                                                                                                       //
    return showMessage;                                                                                                //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.getMessageForField = function () {                                                               //
    function getMessageForField(field) {                                                                               //
      var _state$messages = this.state.messages,                                                                       // 949
          messages = _state$messages === undefined ? [] : _state$messages;                                             // 949
      return messages.find(function (_ref2) {                                                                          // 951
        var key = _ref2.field;                                                                                         // 951
        return key === field;                                                                                          // 951
      });                                                                                                              // 951
    }                                                                                                                  // 952
                                                                                                                       //
    return getMessageForField;                                                                                         //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.clearMessage = function () {                                                                     //
    function clearMessage(message) {                                                                                   //
      if (message) {                                                                                                   // 955
        this.setState(function (_ref3) {                                                                               // 956
          var _ref3$messages = _ref3.messages,                                                                         // 956
              messages = _ref3$messages === undefined ? [] : _ref3$messages;                                           // 956
          return {                                                                                                     // 956
            messages: messages.filter(function (_ref4) {                                                               // 957
              var a = _ref4.message;                                                                                   // 957
              return a !== message;                                                                                    // 957
            })                                                                                                         // 957
          };                                                                                                           // 956
        });                                                                                                            // 956
      }                                                                                                                // 959
    }                                                                                                                  // 960
                                                                                                                       //
    return clearMessage;                                                                                               //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.clearMessages = function () {                                                                    //
    function clearMessages() {                                                                                         //
      if (this.hideMessageTimout) {                                                                                    // 963
        clearTimeout(this.hideMessageTimout);                                                                          // 964
      }                                                                                                                // 965
                                                                                                                       //
      this.setState({                                                                                                  // 966
        messages: []                                                                                                   // 966
      });                                                                                                              // 966
    }                                                                                                                  // 967
                                                                                                                       //
    return clearMessages;                                                                                              //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.componentWillMount = function () {                                                               //
    function componentWillMount() {                                                                                    //
      // XXX Check for backwards compatibility.                                                                        // 970
      if (Meteor.isClient) {                                                                                           // 971
        var container = document.createElement('div');                                                                 // 972
        ReactDOM.render(React.createElement(Accounts.ui.Field, {                                                       // 973
          message: "test"                                                                                              // 973
        }), container);                                                                                                // 973
                                                                                                                       //
        if (container.getElementsByClassName('message').length == 0) {                                                 // 974
          // Found backwards compatibility issue with 1.3.x                                                            // 975
          console.warn("Implementations of Accounts.ui.Field must render message in v1.2.11.\n          https://github.com/studiointeract/accounts-ui/#deprecations");
        }                                                                                                              // 978
      }                                                                                                                // 979
    }                                                                                                                  // 980
                                                                                                                       //
    return componentWillMount;                                                                                         //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.componentWillUnmount = function () {                                                             //
    function componentWillUnmount() {                                                                                  //
      if (this.hideMessageTimout) {                                                                                    // 983
        clearTimeout(this.hideMessageTimout);                                                                          // 984
      }                                                                                                                // 985
    }                                                                                                                  // 986
                                                                                                                       //
    return componentWillUnmount;                                                                                       //
  }();                                                                                                                 //
                                                                                                                       //
  LoginForm.prototype.render = function () {                                                                           //
    function render() {                                                                                                //
      var _this12 = this;                                                                                              // 988
                                                                                                                       //
      this.oauthButtons(); // Backwords compatibility with v1.2.x.                                                     // 989
                                                                                                                       //
      var _state$messages2 = this.state.messages,                                                                      // 988
          messages = _state$messages2 === undefined ? [] : _state$messages2;                                           // 988
      var message = {                                                                                                  // 992
        deprecated: true,                                                                                              // 993
        message: messages.map(function (_ref5) {                                                                       // 994
          var message = _ref5.message;                                                                                 // 994
          return message;                                                                                              // 994
        }).join(', ')                                                                                                  // 994
      };                                                                                                               // 992
      return React.createElement(Accounts.ui.Form, (0, _extends3.default)({                                            // 996
        oauthServices: this.oauthButtons(),                                                                            // 998
        fields: this.fields(),                                                                                         // 999
        buttons: this.buttons()                                                                                        // 1000
      }, this.state, {                                                                                                 // 997
        message: message,                                                                                              // 1002
        translate: function (text) {                                                                                   // 1003
          return _this12.translate(text);                                                                              // 1003
        }                                                                                                              // 1003
      }));                                                                                                             // 997
    }                                                                                                                  // 1006
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return LoginForm;                                                                                                    //
}(Component);                                                                                                          //
                                                                                                                       //
LoginForm.propTypes = {                                                                                                // 1008
  formState: PropTypes.symbol,                                                                                         // 1009
  loginPath: PropTypes.string,                                                                                         // 1010
  signUpPath: PropTypes.string,                                                                                        // 1011
  resetPasswordPath: PropTypes.string,                                                                                 // 1012
  profilePath: PropTypes.string,                                                                                       // 1013
  changePasswordPath: PropTypes.string                                                                                 // 1014
};                                                                                                                     // 1008
LoginForm.defaultProps = {                                                                                             // 1016
  formState: null,                                                                                                     // 1017
  loginPath: null,                                                                                                     // 1018
  signUpPath: null,                                                                                                    // 1019
  resetPasswordPath: null,                                                                                             // 1020
  profilePath: null,                                                                                                   // 1021
  changePasswordPath: null                                                                                             // 1022
};                                                                                                                     // 1016
Accounts.ui.LoginForm = LoginForm;                                                                                     // 1025
module.exportDefault(createContainer(function () {                                                                     // 1
  // Listen for the user to login/logout and the services list to the user.                                            // 1028
  Meteor.subscribe('servicesList');                                                                                    // 1029
  return {                                                                                                             // 1030
    user: Accounts.user()                                                                                              // 1031
  };                                                                                                                   // 1030
}, LoginForm));                                                                                                        // 1033
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/PasswordOrService.jsx                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  PasswordOrService: function () {                                                                                     // 1
    return PasswordOrService;                                                                                          // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
var PropTypes = void 0;                                                                                                // 1
module.watch(require("prop-types"), {                                                                                  // 1
  "default": function (v) {                                                                                            // 1
    PropTypes = v;                                                                                                     // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 2);                                                                                                                 // 1
var T9n = void 0;                                                                                                      // 1
module.watch(require("meteor/softwarerero:accounts-t9n"), {                                                            // 1
  T9n: function (v) {                                                                                                  // 1
    T9n = v;                                                                                                           // 1
  }                                                                                                                    // 1
}, 3);                                                                                                                 // 1
var hasPasswordService = void 0;                                                                                       // 1
module.watch(require("../../helpers.js"), {                                                                            // 1
  hasPasswordService: function (v) {                                                                                   // 1
    hasPasswordService = v;                                                                                            // 1
  }                                                                                                                    // 1
}, 4);                                                                                                                 // 1
                                                                                                                       //
var PasswordOrService = function (_React$Component) {                                                                  //
  (0, _inherits3.default)(PasswordOrService, _React$Component);                                                        //
                                                                                                                       //
  function PasswordOrService(props) {                                                                                  // 8
    (0, _classCallCheck3.default)(this, PasswordOrService);                                                            // 8
                                                                                                                       //
    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props));                    // 8
                                                                                                                       //
    _this.state = {                                                                                                    // 10
      hasPasswordService: hasPasswordService(),                                                                        // 11
      services: Object.keys(props.oauthServices).map(function (service) {                                              // 12
        return props.oauthServices[service].label;                                                                     // 13
      })                                                                                                               // 14
    };                                                                                                                 // 10
    return _this;                                                                                                      // 8
  }                                                                                                                    // 16
                                                                                                                       //
  PasswordOrService.prototype.translate = function () {                                                                //
    function translate(text) {                                                                                         //
      if (this.props.translate) {                                                                                      // 19
        return this.props.translate(text);                                                                             // 20
      }                                                                                                                // 21
                                                                                                                       //
      return T9n.get(text);                                                                                            // 22
    }                                                                                                                  // 23
                                                                                                                       //
    return translate;                                                                                                  //
  }();                                                                                                                 //
                                                                                                                       //
  PasswordOrService.prototype.render = function () {                                                                   //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 25
          _props$className = _props.className,                                                                         // 25
          className = _props$className === undefined ? "password-or-service" : _props$className,                       // 25
          _props$style = _props.style,                                                                                 // 25
          style = _props$style === undefined ? {} : _props$style;                                                      // 25
      var _state = this.state,                                                                                         // 25
          hasPasswordService = _state.hasPasswordService,                                                              // 25
          services = _state.services;                                                                                  // 25
      labels = services;                                                                                               // 28
                                                                                                                       //
      if (services.length > 2) {                                                                                       // 29
        labels = [];                                                                                                   // 30
      }                                                                                                                // 31
                                                                                                                       //
      if (hasPasswordService && services.length > 0) {                                                                 // 33
        return React.createElement(                                                                                    // 34
          "div",                                                                                                       // 35
          {                                                                                                            // 35
            style: style,                                                                                              // 35
            className: className                                                                                       // 35
          },                                                                                                           // 35
          this.translate('orUse') + " " + labels.join(' / ')                                                           // 36
        );                                                                                                             // 35
      }                                                                                                                // 39
                                                                                                                       //
      return null;                                                                                                     // 40
    }                                                                                                                  // 41
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return PasswordOrService;                                                                                            //
}(React.Component);                                                                                                    //
                                                                                                                       //
PasswordOrService.propTypes = {                                                                                        // 44
  oauthServices: PropTypes.object                                                                                      // 45
};                                                                                                                     // 44
Accounts.ui.PasswordOrService = PasswordOrService;                                                                     // 48
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialButtons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/SocialButtons.jsx                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");                                                              //
                                                                                                                       //
var _extends3 = _interopRequireDefault(_extends2);                                                                     //
                                                                                                                       //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                                //
                                                                                                                       //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                       //
                                                                                                                       //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                          //
                                                                                                                       //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                                 //
                                                                                                                       //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                            //
                                                                                                                       //
var _inherits3 = _interopRequireDefault(_inherits2);                                                                   //
                                                                                                                       //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }                      //
                                                                                                                       //
module.export({                                                                                                        // 1
  SocialButtons: function () {                                                                                         // 1
    return SocialButtons;                                                                                              // 1
  }                                                                                                                    // 1
});                                                                                                                    // 1
var React = void 0;                                                                                                    // 1
module.watch(require("react"), {                                                                                       // 1
  "default": function (v) {                                                                                            // 1
    React = v;                                                                                                         // 1
  }                                                                                                                    // 1
}, 0);                                                                                                                 // 1
module.watch(require("./Button.jsx"));                                                                                 // 1
var Accounts = void 0;                                                                                                 // 1
module.watch(require("meteor/accounts-base"), {                                                                        // 1
  Accounts: function (v) {                                                                                             // 1
    Accounts = v;                                                                                                      // 1
  }                                                                                                                    // 1
}, 1);                                                                                                                 // 1
                                                                                                                       //
var SocialButtons = function (_React$Component) {                                                                      //
  (0, _inherits3.default)(SocialButtons, _React$Component);                                                            //
                                                                                                                       //
  function SocialButtons() {                                                                                           //
    (0, _classCallCheck3.default)(this, SocialButtons);                                                                //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));                    //
  }                                                                                                                    //
                                                                                                                       //
  SocialButtons.prototype.render = function () {                                                                       //
    function render() {                                                                                                //
      var _props = this.props,                                                                                         // 7
          _props$oauthServices = _props.oauthServices,                                                                 // 7
          oauthServices = _props$oauthServices === undefined ? {} : _props$oauthServices,                              // 7
          _props$className = _props.className,                                                                         // 7
          className = _props$className === undefined ? "social-buttons" : _props$className;                            // 7
      return React.createElement(                                                                                      // 9
        "div",                                                                                                         // 10
        {                                                                                                              // 10
          className: className                                                                                         // 10
        },                                                                                                             // 10
        Object.keys(oauthServices).map(function (id, i) {                                                              // 11
          return React.createElement(Accounts.ui.Button, (0, _extends3.default)({}, oauthServices[id], {               // 12
            key: i                                                                                                     // 12
          }));                                                                                                         // 12
        })                                                                                                             // 13
      );                                                                                                               // 10
    }                                                                                                                  // 16
                                                                                                                       //
    return render;                                                                                                     //
  }();                                                                                                                 //
                                                                                                                       //
  return SocialButtons;                                                                                                //
}(React.Component);                                                                                                    //
                                                                                                                       //
Accounts.ui.SocialButtons = SocialButtons;                                                                             // 19
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"node_modules":{"prop-types":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../../.1.2.23.opnxbu.tzi2++os+web.browser+web.cordova/npm/node_modules/prop-types/package.json                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "prop-types";                                                                                           // 1
exports.version = "15.5.10";                                                                                           // 2
exports.main = "index.js";                                                                                             // 3
                                                                                                                       // 4
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/index.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2013-present, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 */                                                                                                                    // 8
                                                                                                                       // 9
if (process.env.NODE_ENV !== 'production') {                                                                           // 10
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&                                                            // 11
    Symbol.for &&                                                                                                      // 12
    Symbol.for('react.element')) ||                                                                                    // 13
    0xeac7;                                                                                                            // 14
                                                                                                                       // 15
  var isValidElement = function(object) {                                                                              // 16
    return typeof object === 'object' &&                                                                               // 17
      object !== null &&                                                                                               // 18
      object.$$typeof === REACT_ELEMENT_TYPE;                                                                          // 19
  };                                                                                                                   // 20
                                                                                                                       // 21
  // By explicitly using `prop-types` you are opting into new development behavior.                                    // 22
  // http://fb.me/prop-types-in-prod                                                                                   // 23
  var throwOnDirectAccess = true;                                                                                      // 24
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);                          // 25
} else {                                                                                                               // 26
  // By explicitly using `prop-types` you are opting into new production behavior.                                     // 27
  // http://fb.me/prop-types-in-prod                                                                                   // 28
  module.exports = require('./factoryWithThrowingShims')();                                                            // 29
}                                                                                                                      // 30
                                                                                                                       // 31
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"factoryWithTypeCheckers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/factoryWithTypeCheckers.js                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2013-present, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 */                                                                                                                    // 8
                                                                                                                       // 9
'use strict';                                                                                                          // 10
                                                                                                                       // 11
var emptyFunction = require('fbjs/lib/emptyFunction');                                                                 // 12
var invariant = require('fbjs/lib/invariant');                                                                         // 13
var warning = require('fbjs/lib/warning');                                                                             // 14
                                                                                                                       // 15
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');                                                      // 16
var checkPropTypes = require('./checkPropTypes');                                                                      // 17
                                                                                                                       // 18
module.exports = function(isValidElement, throwOnDirectAccess) {                                                       // 19
  /* global Symbol */                                                                                                  // 20
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;                                               // 21
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.                                                      // 22
                                                                                                                       // 23
  /**                                                                                                                  // 24
   * Returns the iterator method function contained on the iterable object.                                            // 25
   *                                                                                                                   // 26
   * Be sure to invoke the function with the iterable as context:                                                      // 27
   *                                                                                                                   // 28
   *     var iteratorFn = getIteratorFn(myIterable);                                                                   // 29
   *     if (iteratorFn) {                                                                                             // 30
   *       var iterator = iteratorFn.call(myIterable);                                                                 // 31
   *       ...                                                                                                         // 32
   *     }                                                                                                             // 33
   *                                                                                                                   // 34
   * @param {?object} maybeIterable                                                                                    // 35
   * @return {?function}                                                                                               // 36
   */                                                                                                                  // 37
  function getIteratorFn(maybeIterable) {                                                                              // 38
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {                                                                            // 40
      return iteratorFn;                                                                                               // 41
    }                                                                                                                  // 42
  }                                                                                                                    // 43
                                                                                                                       // 44
  /**                                                                                                                  // 45
   * Collection of methods that allow declaration and validation of props that are                                     // 46
   * supplied to React components. Example usage:                                                                      // 47
   *                                                                                                                   // 48
   *   var Props = require('ReactPropTypes');                                                                          // 49
   *   var MyArticle = React.createClass({                                                                             // 50
   *     propTypes: {                                                                                                  // 51
   *       // An optional string prop named "description".                                                             // 52
   *       description: Props.string,                                                                                  // 53
   *                                                                                                                   // 54
   *       // A required enum prop named "category".                                                                   // 55
   *       category: Props.oneOf(['News','Photos']).isRequired,                                                        // 56
   *                                                                                                                   // 57
   *       // A prop named "dialog" that requires an instance of Dialog.                                               // 58
   *       dialog: Props.instanceOf(Dialog).isRequired                                                                 // 59
   *     },                                                                                                            // 60
   *     render: function() { ... }                                                                                    // 61
   *   });                                                                                                             // 62
   *                                                                                                                   // 63
   * A more formal specification of how these methods are used:                                                        // 64
   *                                                                                                                   // 65
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)                                       // 66
   *   decl := ReactPropTypes.{type}(.isRequired)?                                                                     // 67
   *                                                                                                                   // 68
   * Each and every declaration produces a function with the same signature. This                                      // 69
   * allows the creation of custom validation functions. For example:                                                  // 70
   *                                                                                                                   // 71
   *  var MyLink = React.createClass({                                                                                 // 72
   *    propTypes: {                                                                                                   // 73
   *      // An optional string or URI prop named "href".                                                              // 74
   *      href: function(props, propName, componentName) {                                                             // 75
   *        var propValue = props[propName];                                                                           // 76
   *        if (propValue != null && typeof propValue !== 'string' &&                                                  // 77
   *            !(propValue instanceof URI)) {                                                                         // 78
   *          return new Error(                                                                                        // 79
   *            'Expected a string or an URI for ' + propName + ' in ' +                                               // 80
   *            componentName                                                                                          // 81
   *          );                                                                                                       // 82
   *        }                                                                                                          // 83
   *      }                                                                                                            // 84
   *    },                                                                                                             // 85
   *    render: function() {...}                                                                                       // 86
   *  });                                                                                                              // 87
   *                                                                                                                   // 88
   * @internal                                                                                                         // 89
   */                                                                                                                  // 90
                                                                                                                       // 91
  var ANONYMOUS = '<<anonymous>>';                                                                                     // 92
                                                                                                                       // 93
  // Important!                                                                                                        // 94
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.                                // 95
  var ReactPropTypes = {                                                                                               // 96
    array: createPrimitiveTypeChecker('array'),                                                                        // 97
    bool: createPrimitiveTypeChecker('boolean'),                                                                       // 98
    func: createPrimitiveTypeChecker('function'),                                                                      // 99
    number: createPrimitiveTypeChecker('number'),                                                                      // 100
    object: createPrimitiveTypeChecker('object'),                                                                      // 101
    string: createPrimitiveTypeChecker('string'),                                                                      // 102
    symbol: createPrimitiveTypeChecker('symbol'),                                                                      // 103
                                                                                                                       // 104
    any: createAnyTypeChecker(),                                                                                       // 105
    arrayOf: createArrayOfTypeChecker,                                                                                 // 106
    element: createElementTypeChecker(),                                                                               // 107
    instanceOf: createInstanceTypeChecker,                                                                             // 108
    node: createNodeChecker(),                                                                                         // 109
    objectOf: createObjectOfTypeChecker,                                                                               // 110
    oneOf: createEnumTypeChecker,                                                                                      // 111
    oneOfType: createUnionTypeChecker,                                                                                 // 112
    shape: createShapeTypeChecker                                                                                      // 113
  };                                                                                                                   // 114
                                                                                                                       // 115
  /**                                                                                                                  // 116
   * inlined Object.is polyfill to avoid requiring consumers ship their own                                            // 117
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is                        // 118
   */                                                                                                                  // 119
  /*eslint-disable no-self-compare*/                                                                                   // 120
  function is(x, y) {                                                                                                  // 121
    // SameValue algorithm                                                                                             // 122
    if (x === y) {                                                                                                     // 123
      // Steps 1-5, 7-10                                                                                               // 124
      // Steps 6.b-6.e: +0 != -0                                                                                       // 125
      return x !== 0 || 1 / x === 1 / y;                                                                               // 126
    } else {                                                                                                           // 127
      // Step 6.a: NaN == NaN                                                                                          // 128
      return x !== x && y !== y;                                                                                       // 129
    }                                                                                                                  // 130
  }                                                                                                                    // 131
  /*eslint-enable no-self-compare*/                                                                                    // 132
                                                                                                                       // 133
  /**                                                                                                                  // 134
   * We use an Error-like object for backward compatibility as people may call                                         // 135
   * PropTypes directly and inspect their output. However, we don't use real                                           // 136
   * Errors anymore. We don't inspect their stack anyway, and creating them                                            // 137
   * is prohibitively expensive if they are created too often, such as what                                            // 138
   * happens in oneOfType() for any type before the one that matched.                                                  // 139
   */                                                                                                                  // 140
  function PropTypeError(message) {                                                                                    // 141
    this.message = message;                                                                                            // 142
    this.stack = '';                                                                                                   // 143
  }                                                                                                                    // 144
  // Make `instanceof Error` still work for returned errors.                                                           // 145
  PropTypeError.prototype = Error.prototype;                                                                           // 146
                                                                                                                       // 147
  function createChainableTypeChecker(validate) {                                                                      // 148
    if (process.env.NODE_ENV !== 'production') {                                                                       // 149
      var manualPropTypeCallCache = {};                                                                                // 150
      var manualPropTypeWarningCount = 0;                                                                              // 151
    }                                                                                                                  // 152
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {                   // 153
      componentName = componentName || ANONYMOUS;                                                                      // 154
      propFullName = propFullName || propName;                                                                         // 155
                                                                                                                       // 156
      if (secret !== ReactPropTypesSecret) {                                                                           // 157
        if (throwOnDirectAccess) {                                                                                     // 158
          // New behavior only for users of `prop-types` package                                                       // 159
          invariant(                                                                                                   // 160
            false,                                                                                                     // 161
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +                   // 162
            'Use `PropTypes.checkPropTypes()` to call them. ' +                                                        // 163
            'Read more at http://fb.me/use-check-prop-types'                                                           // 164
          );                                                                                                           // 165
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {                          // 166
          // Old behavior for people using React.PropTypes                                                             // 167
          var cacheKey = componentName + ':' + propName;                                                               // 168
          if (                                                                                                         // 169
            !manualPropTypeCallCache[cacheKey] &&                                                                      // 170
            // Avoid spamming the console because they are often not actionable except for lib authors                 // 171
            manualPropTypeWarningCount < 3                                                                             // 172
          ) {                                                                                                          // 173
            warning(                                                                                                   // 174
              false,                                                                                                   // 175
              'You are manually calling a React.PropTypes validation ' +                                               // 176
              'function for the `%s` prop on `%s`. This is deprecated ' +                                              // 177
              'and will throw in the standalone `prop-types` package. ' +                                              // 178
              'You may be seeing this warning due to a third-party PropTypes ' +                                       // 179
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',                        // 180
              propFullName,                                                                                            // 181
              componentName                                                                                            // 182
            );                                                                                                         // 183
            manualPropTypeCallCache[cacheKey] = true;                                                                  // 184
            manualPropTypeWarningCount++;                                                                              // 185
          }                                                                                                            // 186
        }                                                                                                              // 187
      }                                                                                                                // 188
      if (props[propName] == null) {                                                                                   // 189
        if (isRequired) {                                                                                              // 190
          if (props[propName] === null) {                                                                              // 191
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }                                                                                                            // 193
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }                                                                                                              // 195
        return null;                                                                                                   // 196
      } else {                                                                                                         // 197
        return validate(props, propName, componentName, location, propFullName);                                       // 198
      }                                                                                                                // 199
    }                                                                                                                  // 200
                                                                                                                       // 201
    var chainedCheckType = checkType.bind(null, false);                                                                // 202
    chainedCheckType.isRequired = checkType.bind(null, true);                                                          // 203
                                                                                                                       // 204
    return chainedCheckType;                                                                                           // 205
  }                                                                                                                    // 206
                                                                                                                       // 207
  function createPrimitiveTypeChecker(expectedType) {                                                                  // 208
    function validate(props, propName, componentName, location, propFullName, secret) {                                // 209
      var propValue = props[propName];                                                                                 // 210
      var propType = getPropType(propValue);                                                                           // 211
      if (propType !== expectedType) {                                                                                 // 212
        // `propValue` being instance of, say, date/regexp, pass the 'object'                                          // 213
        // check, but we can offer a more precise error message here rather than                                       // 214
        // 'of type `object`'.                                                                                         // 215
        var preciseType = getPreciseType(propValue);                                                                   // 216
                                                                                                                       // 217
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }                                                                                                                // 219
      return null;                                                                                                     // 220
    }                                                                                                                  // 221
    return createChainableTypeChecker(validate);                                                                       // 222
  }                                                                                                                    // 223
                                                                                                                       // 224
  function createAnyTypeChecker() {                                                                                    // 225
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);                                                  // 226
  }                                                                                                                    // 227
                                                                                                                       // 228
  function createArrayOfTypeChecker(typeChecker) {                                                                     // 229
    function validate(props, propName, componentName, location, propFullName) {                                        // 230
      if (typeof typeChecker !== 'function') {                                                                         // 231
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }                                                                                                                // 233
      var propValue = props[propName];                                                                                 // 234
      if (!Array.isArray(propValue)) {                                                                                 // 235
        var propType = getPropType(propValue);                                                                         // 236
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }                                                                                                                // 238
      for (var i = 0; i < propValue.length; i++) {                                                                     // 239
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {                                                                                  // 241
          return error;                                                                                                // 242
        }                                                                                                              // 243
      }                                                                                                                // 244
      return null;                                                                                                     // 245
    }                                                                                                                  // 246
    return createChainableTypeChecker(validate);                                                                       // 247
  }                                                                                                                    // 248
                                                                                                                       // 249
  function createElementTypeChecker() {                                                                                // 250
    function validate(props, propName, componentName, location, propFullName) {                                        // 251
      var propValue = props[propName];                                                                                 // 252
      if (!isValidElement(propValue)) {                                                                                // 253
        var propType = getPropType(propValue);                                                                         // 254
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }                                                                                                                // 256
      return null;                                                                                                     // 257
    }                                                                                                                  // 258
    return createChainableTypeChecker(validate);                                                                       // 259
  }                                                                                                                    // 260
                                                                                                                       // 261
  function createInstanceTypeChecker(expectedClass) {                                                                  // 262
    function validate(props, propName, componentName, location, propFullName) {                                        // 263
      if (!(props[propName] instanceof expectedClass)) {                                                               // 264
        var expectedClassName = expectedClass.name || ANONYMOUS;                                                       // 265
        var actualClassName = getClassName(props[propName]);                                                           // 266
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }                                                                                                                // 268
      return null;                                                                                                     // 269
    }                                                                                                                  // 270
    return createChainableTypeChecker(validate);                                                                       // 271
  }                                                                                                                    // 272
                                                                                                                       // 273
  function createEnumTypeChecker(expectedValues) {                                                                     // 274
    if (!Array.isArray(expectedValues)) {                                                                              // 275
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;                                                                            // 277
    }                                                                                                                  // 278
                                                                                                                       // 279
    function validate(props, propName, componentName, location, propFullName) {                                        // 280
      var propValue = props[propName];                                                                                 // 281
      for (var i = 0; i < expectedValues.length; i++) {                                                                // 282
        if (is(propValue, expectedValues[i])) {                                                                        // 283
          return null;                                                                                                 // 284
        }                                                                                                              // 285
      }                                                                                                                // 286
                                                                                                                       // 287
      var valuesString = JSON.stringify(expectedValues);                                                               // 288
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }                                                                                                                  // 290
    return createChainableTypeChecker(validate);                                                                       // 291
  }                                                                                                                    // 292
                                                                                                                       // 293
  function createObjectOfTypeChecker(typeChecker) {                                                                    // 294
    function validate(props, propName, componentName, location, propFullName) {                                        // 295
      if (typeof typeChecker !== 'function') {                                                                         // 296
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }                                                                                                                // 298
      var propValue = props[propName];                                                                                 // 299
      var propType = getPropType(propValue);                                                                           // 300
      if (propType !== 'object') {                                                                                     // 301
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }                                                                                                                // 303
      for (var key in propValue) {                                                                                     // 304
        if (propValue.hasOwnProperty(key)) {                                                                           // 305
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {                                                                                // 307
            return error;                                                                                              // 308
          }                                                                                                            // 309
        }                                                                                                              // 310
      }                                                                                                                // 311
      return null;                                                                                                     // 312
    }                                                                                                                  // 313
    return createChainableTypeChecker(validate);                                                                       // 314
  }                                                                                                                    // 315
                                                                                                                       // 316
  function createUnionTypeChecker(arrayOfTypeCheckers) {                                                               // 317
    if (!Array.isArray(arrayOfTypeCheckers)) {                                                                         // 318
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;                                                                            // 320
    }                                                                                                                  // 321
                                                                                                                       // 322
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {                                                             // 323
      var checker = arrayOfTypeCheckers[i];                                                                            // 324
      if (typeof checker !== 'function') {                                                                             // 325
        warning(                                                                                                       // 326
          false,                                                                                                       // 327
          'Invalid argument supplid to oneOfType. Expected an array of check functions, but ' +                        // 328
          'received %s at index %s.',                                                                                  // 329
          getPostfixForTypeWarning(checker),                                                                           // 330
          i                                                                                                            // 331
        );                                                                                                             // 332
        return emptyFunction.thatReturnsNull;                                                                          // 333
      }                                                                                                                // 334
    }                                                                                                                  // 335
                                                                                                                       // 336
    function validate(props, propName, componentName, location, propFullName) {                                        // 337
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {                                                           // 338
        var checker = arrayOfTypeCheckers[i];                                                                          // 339
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {           // 340
          return null;                                                                                                 // 341
        }                                                                                                              // 342
      }                                                                                                                // 343
                                                                                                                       // 344
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }                                                                                                                  // 346
    return createChainableTypeChecker(validate);                                                                       // 347
  }                                                                                                                    // 348
                                                                                                                       // 349
  function createNodeChecker() {                                                                                       // 350
    function validate(props, propName, componentName, location, propFullName) {                                        // 351
      if (!isNode(props[propName])) {                                                                                  // 352
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }                                                                                                                // 354
      return null;                                                                                                     // 355
    }                                                                                                                  // 356
    return createChainableTypeChecker(validate);                                                                       // 357
  }                                                                                                                    // 358
                                                                                                                       // 359
  function createShapeTypeChecker(shapeTypes) {                                                                        // 360
    function validate(props, propName, componentName, location, propFullName) {                                        // 361
      var propValue = props[propName];                                                                                 // 362
      var propType = getPropType(propValue);                                                                           // 363
      if (propType !== 'object') {                                                                                     // 364
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }                                                                                                                // 366
      for (var key in shapeTypes) {                                                                                    // 367
        var checker = shapeTypes[key];                                                                                 // 368
        if (!checker) {                                                                                                // 369
          continue;                                                                                                    // 370
        }                                                                                                              // 371
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);  // 372
        if (error) {                                                                                                   // 373
          return error;                                                                                                // 374
        }                                                                                                              // 375
      }                                                                                                                // 376
      return null;                                                                                                     // 377
    }                                                                                                                  // 378
    return createChainableTypeChecker(validate);                                                                       // 379
  }                                                                                                                    // 380
                                                                                                                       // 381
  function isNode(propValue) {                                                                                         // 382
    switch (typeof propValue) {                                                                                        // 383
      case 'number':                                                                                                   // 384
      case 'string':                                                                                                   // 385
      case 'undefined':                                                                                                // 386
        return true;                                                                                                   // 387
      case 'boolean':                                                                                                  // 388
        return !propValue;                                                                                             // 389
      case 'object':                                                                                                   // 390
        if (Array.isArray(propValue)) {                                                                                // 391
          return propValue.every(isNode);                                                                              // 392
        }                                                                                                              // 393
        if (propValue === null || isValidElement(propValue)) {                                                         // 394
          return true;                                                                                                 // 395
        }                                                                                                              // 396
                                                                                                                       // 397
        var iteratorFn = getIteratorFn(propValue);                                                                     // 398
        if (iteratorFn) {                                                                                              // 399
          var iterator = iteratorFn.call(propValue);                                                                   // 400
          var step;                                                                                                    // 401
          if (iteratorFn !== propValue.entries) {                                                                      // 402
            while (!(step = iterator.next()).done) {                                                                   // 403
              if (!isNode(step.value)) {                                                                               // 404
                return false;                                                                                          // 405
              }                                                                                                        // 406
            }                                                                                                          // 407
          } else {                                                                                                     // 408
            // Iterator will provide entry [k,v] tuples rather than values.                                            // 409
            while (!(step = iterator.next()).done) {                                                                   // 410
              var entry = step.value;                                                                                  // 411
              if (entry) {                                                                                             // 412
                if (!isNode(entry[1])) {                                                                               // 413
                  return false;                                                                                        // 414
                }                                                                                                      // 415
              }                                                                                                        // 416
            }                                                                                                          // 417
          }                                                                                                            // 418
        } else {                                                                                                       // 419
          return false;                                                                                                // 420
        }                                                                                                              // 421
                                                                                                                       // 422
        return true;                                                                                                   // 423
      default:                                                                                                         // 424
        return false;                                                                                                  // 425
    }                                                                                                                  // 426
  }                                                                                                                    // 427
                                                                                                                       // 428
  function isSymbol(propType, propValue) {                                                                             // 429
    // Native Symbol.                                                                                                  // 430
    if (propType === 'symbol') {                                                                                       // 431
      return true;                                                                                                     // 432
    }                                                                                                                  // 433
                                                                                                                       // 434
    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'                                                           // 435
    if (propValue['@@toStringTag'] === 'Symbol') {                                                                     // 436
      return true;                                                                                                     // 437
    }                                                                                                                  // 438
                                                                                                                       // 439
    // Fallback for non-spec compliant Symbols which are polyfilled.                                                   // 440
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {                                                 // 441
      return true;                                                                                                     // 442
    }                                                                                                                  // 443
                                                                                                                       // 444
    return false;                                                                                                      // 445
  }                                                                                                                    // 446
                                                                                                                       // 447
  // Equivalent of `typeof` but with special handling for array and regexp.                                            // 448
  function getPropType(propValue) {                                                                                    // 449
    var propType = typeof propValue;                                                                                   // 450
    if (Array.isArray(propValue)) {                                                                                    // 451
      return 'array';                                                                                                  // 452
    }                                                                                                                  // 453
    if (propValue instanceof RegExp) {                                                                                 // 454
      // Old webkits (at least until Android 4.0) return 'function' rather than                                        // 455
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/                                         // 456
      // passes PropTypes.object.                                                                                      // 457
      return 'object';                                                                                                 // 458
    }                                                                                                                  // 459
    if (isSymbol(propType, propValue)) {                                                                               // 460
      return 'symbol';                                                                                                 // 461
    }                                                                                                                  // 462
    return propType;                                                                                                   // 463
  }                                                                                                                    // 464
                                                                                                                       // 465
  // This handles more types than `getPropType`. Only used for error messages.                                         // 466
  // See `createPrimitiveTypeChecker`.                                                                                 // 467
  function getPreciseType(propValue) {                                                                                 // 468
    if (typeof propValue === 'undefined' || propValue === null) {                                                      // 469
      return '' + propValue;                                                                                           // 470
    }                                                                                                                  // 471
    var propType = getPropType(propValue);                                                                             // 472
    if (propType === 'object') {                                                                                       // 473
      if (propValue instanceof Date) {                                                                                 // 474
        return 'date';                                                                                                 // 475
      } else if (propValue instanceof RegExp) {                                                                        // 476
        return 'regexp';                                                                                               // 477
      }                                                                                                                // 478
    }                                                                                                                  // 479
    return propType;                                                                                                   // 480
  }                                                                                                                    // 481
                                                                                                                       // 482
  // Returns a string that is postfixed to a warning about an invalid type.                                            // 483
  // For example, "undefined" or "of type array"                                                                       // 484
  function getPostfixForTypeWarning(value) {                                                                           // 485
    var type = getPreciseType(value);                                                                                  // 486
    switch (type) {                                                                                                    // 487
      case 'array':                                                                                                    // 488
      case 'object':                                                                                                   // 489
        return 'an ' + type;                                                                                           // 490
      case 'boolean':                                                                                                  // 491
      case 'date':                                                                                                     // 492
      case 'regexp':                                                                                                   // 493
        return 'a ' + type;                                                                                            // 494
      default:                                                                                                         // 495
        return type;                                                                                                   // 496
    }                                                                                                                  // 497
  }                                                                                                                    // 498
                                                                                                                       // 499
  // Returns class name of the object, if any.                                                                         // 500
  function getClassName(propValue) {                                                                                   // 501
    if (!propValue.constructor || !propValue.constructor.name) {                                                       // 502
      return ANONYMOUS;                                                                                                // 503
    }                                                                                                                  // 504
    return propValue.constructor.name;                                                                                 // 505
  }                                                                                                                    // 506
                                                                                                                       // 507
  ReactPropTypes.checkPropTypes = checkPropTypes;                                                                      // 508
  ReactPropTypes.PropTypes = ReactPropTypes;                                                                           // 509
                                                                                                                       // 510
  return ReactPropTypes;                                                                                               // 511
};                                                                                                                     // 512
                                                                                                                       // 513
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"ReactPropTypesSecret.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/lib/ReactPropTypesSecret.js                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2013-present, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 */                                                                                                                    // 8
                                                                                                                       // 9
'use strict';                                                                                                          // 10
                                                                                                                       // 11
var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';                                             // 12
                                                                                                                       // 13
module.exports = ReactPropTypesSecret;                                                                                 // 14
                                                                                                                       // 15
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"checkPropTypes.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/checkPropTypes.js                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2013-present, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 */                                                                                                                    // 8
                                                                                                                       // 9
'use strict';                                                                                                          // 10
                                                                                                                       // 11
if (process.env.NODE_ENV !== 'production') {                                                                           // 12
  var invariant = require('fbjs/lib/invariant');                                                                       // 13
  var warning = require('fbjs/lib/warning');                                                                           // 14
  var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');                                                    // 15
  var loggedTypeFailures = {};                                                                                         // 16
}                                                                                                                      // 17
                                                                                                                       // 18
/**                                                                                                                    // 19
 * Assert that the values match with the type specs.                                                                   // 20
 * Error messages are memorized and will only be shown once.                                                           // 21
 *                                                                                                                     // 22
 * @param {object} typeSpecs Map of name to a ReactPropType                                                            // 23
 * @param {object} values Runtime values that need to be type-checked                                                  // 24
 * @param {string} location e.g. "prop", "context", "child context"                                                    // 25
 * @param {string} componentName Name of the component for error messages.                                             // 26
 * @param {?Function} getStack Returns the component stack.                                                            // 27
 * @private                                                                                                            // 28
 */                                                                                                                    // 29
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {                                        // 30
  if (process.env.NODE_ENV !== 'production') {                                                                         // 31
    for (var typeSpecName in typeSpecs) {                                                                              // 32
      if (typeSpecs.hasOwnProperty(typeSpecName)) {                                                                    // 33
        var error;                                                                                                     // 34
        // Prop type validation may throw. In case they do, we don't want to                                           // 35
        // fail the render phase where it didn't fail before. So we log it.                                            // 36
        // After these have been cleaned up, we'll let them throw.                                                     // 37
        try {                                                                                                          // 38
          // This is intentionally an invariant that gets caught. It's the same                                        // 39
          // behavior as without this statement except with a better message.                                          // 40
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', location, typeSpecName);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);  // 42
        } catch (ex) {                                                                                                 // 43
          error = ex;                                                                                                  // 44
        }                                                                                                              // 45
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {                                        // 47
          // Only monitor this failure once because there tends to be a lot of the                                     // 48
          // same error.                                                                                               // 49
          loggedTypeFailures[error.message] = true;                                                                    // 50
                                                                                                                       // 51
          var stack = getStack ? getStack() : '';                                                                      // 52
                                                                                                                       // 53
          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');                 // 54
        }                                                                                                              // 55
      }                                                                                                                // 56
    }                                                                                                                  // 57
  }                                                                                                                    // 58
}                                                                                                                      // 59
                                                                                                                       // 60
module.exports = checkPropTypes;                                                                                       // 61
                                                                                                                       // 62
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"factoryWithThrowingShims.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/factoryWithThrowingShims.js                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2013-present, Facebook, Inc.                                                                              // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 */                                                                                                                    // 8
                                                                                                                       // 9
'use strict';                                                                                                          // 10
                                                                                                                       // 11
var emptyFunction = require('fbjs/lib/emptyFunction');                                                                 // 12
var invariant = require('fbjs/lib/invariant');                                                                         // 13
var ReactPropTypesSecret = require('./lib/ReactPropTypesSecret');                                                      // 14
                                                                                                                       // 15
module.exports = function() {                                                                                          // 16
  function shim(props, propName, componentName, location, propFullName, secret) {                                      // 17
    if (secret === ReactPropTypesSecret) {                                                                             // 18
      // It is still safe when called from React.                                                                      // 19
      return;                                                                                                          // 20
    }                                                                                                                  // 21
    invariant(                                                                                                         // 22
      false,                                                                                                           // 23
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +                         // 24
      'Use PropTypes.checkPropTypes() to call them. ' +                                                                // 25
      'Read more at http://fb.me/use-check-prop-types'                                                                 // 26
    );                                                                                                                 // 27
  };                                                                                                                   // 28
  shim.isRequired = shim;                                                                                              // 29
  function getShim() {                                                                                                 // 30
    return shim;                                                                                                       // 31
  };                                                                                                                   // 32
  // Important!                                                                                                        // 33
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.                                 // 34
  var ReactPropTypes = {                                                                                               // 35
    array: shim,                                                                                                       // 36
    bool: shim,                                                                                                        // 37
    func: shim,                                                                                                        // 38
    number: shim,                                                                                                      // 39
    object: shim,                                                                                                      // 40
    string: shim,                                                                                                      // 41
    symbol: shim,                                                                                                      // 42
                                                                                                                       // 43
    any: shim,                                                                                                         // 44
    arrayOf: getShim,                                                                                                  // 45
    element: shim,                                                                                                     // 46
    instanceOf: getShim,                                                                                               // 47
    node: shim,                                                                                                        // 48
    objectOf: getShim,                                                                                                 // 49
    oneOf: getShim,                                                                                                    // 50
    oneOfType: getShim,                                                                                                // 51
    shape: getShim                                                                                                     // 52
  };                                                                                                                   // 53
                                                                                                                       // 54
  ReactPropTypes.checkPropTypes = emptyFunction;                                                                       // 55
  ReactPropTypes.PropTypes = ReactPropTypes;                                                                           // 56
                                                                                                                       // 57
  return ReactPropTypes;                                                                                               // 58
};                                                                                                                     // 59
                                                                                                                       // 60
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"fbjs":{"lib":{"emptyFunction.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/fbjs/lib/emptyFunction.js                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
"use strict";                                                                                                          // 1
                                                                                                                       // 2
/**                                                                                                                    // 3
 * Copyright (c) 2013-present, Facebook, Inc.                                                                          // 4
 * All rights reserved.                                                                                                // 5
 *                                                                                                                     // 6
 * This source code is licensed under the BSD-style license found in the                                               // 7
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 8
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 9
 *                                                                                                                     // 10
 *                                                                                                                     // 11
 */                                                                                                                    // 12
                                                                                                                       // 13
function makeEmptyFunction(arg) {                                                                                      // 14
  return function () {                                                                                                 // 15
    return arg;                                                                                                        // 16
  };                                                                                                                   // 17
}                                                                                                                      // 18
                                                                                                                       // 19
/**                                                                                                                    // 20
 * This function accepts and discards inputs; it has no side effects. This is                                          // 21
 * primarily useful idiomatically for overridable function endpoints which                                             // 22
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.                                             // 23
 */                                                                                                                    // 24
var emptyFunction = function emptyFunction() {};                                                                       // 25
                                                                                                                       // 26
emptyFunction.thatReturns = makeEmptyFunction;                                                                         // 27
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);                                                             // 28
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);                                                               // 29
emptyFunction.thatReturnsNull = makeEmptyFunction(null);                                                               // 30
emptyFunction.thatReturnsThis = function () {                                                                          // 31
  return this;                                                                                                         // 32
};                                                                                                                     // 33
emptyFunction.thatReturnsArgument = function (arg) {                                                                   // 34
  return arg;                                                                                                          // 35
};                                                                                                                     // 36
                                                                                                                       // 37
module.exports = emptyFunction;                                                                                        // 38
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"invariant.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/fbjs/lib/invariant.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright (c) 2013-present, Facebook, Inc.                                                                          // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 *                                                                                                                     // 8
 */                                                                                                                    // 9
                                                                                                                       // 10
'use strict';                                                                                                          // 11
                                                                                                                       // 12
/**                                                                                                                    // 13
 * Use invariant() to assert state which your program assumes to be true.                                              // 14
 *                                                                                                                     // 15
 * Provide sprintf-style format (only %s is supported) and arguments                                                   // 16
 * to provide information about what broke and what you were                                                           // 17
 * expecting.                                                                                                          // 18
 *                                                                                                                     // 19
 * The invariant message will be stripped in production, but the invariant                                             // 20
 * will remain to ensure logic does not differ in production.                                                          // 21
 */                                                                                                                    // 22
                                                                                                                       // 23
var validateFormat = function validateFormat(format) {};                                                               // 24
                                                                                                                       // 25
if (process.env.NODE_ENV !== 'production') {                                                                           // 26
  validateFormat = function validateFormat(format) {                                                                   // 27
    if (format === undefined) {                                                                                        // 28
      throw new Error('invariant requires an error message argument');                                                 // 29
    }                                                                                                                  // 30
  };                                                                                                                   // 31
}                                                                                                                      // 32
                                                                                                                       // 33
function invariant(condition, format, a, b, c, d, e, f) {                                                              // 34
  validateFormat(format);                                                                                              // 35
                                                                                                                       // 36
  if (!condition) {                                                                                                    // 37
    var error;                                                                                                         // 38
    if (format === undefined) {                                                                                        // 39
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {                                                                                                           // 41
      var args = [a, b, c, d, e, f];                                                                                   // 42
      var argIndex = 0;                                                                                                // 43
      error = new Error(format.replace(/%s/g, function () {                                                            // 44
        return args[argIndex++];                                                                                       // 45
      }));                                                                                                             // 46
      error.name = 'Invariant Violation';                                                                              // 47
    }                                                                                                                  // 48
                                                                                                                       // 49
    error.framesToPop = 1; // we don't care about invariant's own frame                                                // 50
    throw error;                                                                                                       // 51
  }                                                                                                                    // 52
}                                                                                                                      // 53
                                                                                                                       // 54
module.exports = invariant;                                                                                            // 55
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"warning.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/fbjs/lib/warning.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**                                                                                                                    // 1
 * Copyright 2014-2015, Facebook, Inc.                                                                                 // 2
 * All rights reserved.                                                                                                // 3
 *                                                                                                                     // 4
 * This source code is licensed under the BSD-style license found in the                                               // 5
 * LICENSE file in the root directory of this source tree. An additional grant                                         // 6
 * of patent rights can be found in the PATENTS file in the same directory.                                            // 7
 *                                                                                                                     // 8
 */                                                                                                                    // 9
                                                                                                                       // 10
'use strict';                                                                                                          // 11
                                                                                                                       // 12
var emptyFunction = require('./emptyFunction');                                                                        // 13
                                                                                                                       // 14
/**                                                                                                                    // 15
 * Similar to invariant but only logs a warning if the condition is not met.                                           // 16
 * This can be used to log issues in development environments in critical                                              // 17
 * paths. Removing the logging code for production environments will keep the                                          // 18
 * same logic and follow the same code paths.                                                                          // 19
 */                                                                                                                    // 20
                                                                                                                       // 21
var warning = emptyFunction;                                                                                           // 22
                                                                                                                       // 23
if (process.env.NODE_ENV !== 'production') {                                                                           // 24
  (function () {                                                                                                       // 25
    var printWarning = function printWarning(format) {                                                                 // 26
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {        // 27
        args[_key - 1] = arguments[_key];                                                                              // 28
      }                                                                                                                // 29
                                                                                                                       // 30
      var argIndex = 0;                                                                                                // 31
      var message = 'Warning: ' + format.replace(/%s/g, function () {                                                  // 32
        return args[argIndex++];                                                                                       // 33
      });                                                                                                              // 34
      if (typeof console !== 'undefined') {                                                                            // 35
        console.error(message);                                                                                        // 36
      }                                                                                                                // 37
      try {                                                                                                            // 38
        // --- Welcome to debugging React ---                                                                          // 39
        // This error was thrown as a convenience so that you can use this stack                                       // 40
        // to find the callsite that caused this warning to fire.                                                      // 41
        throw new Error(message);                                                                                      // 42
      } catch (x) {}                                                                                                   // 43
    };                                                                                                                 // 44
                                                                                                                       // 45
    warning = function warning(condition, format) {                                                                    // 46
      if (format === undefined) {                                                                                      // 47
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');             // 48
      }                                                                                                                // 49
                                                                                                                       // 50
      if (format.indexOf('Failed Composite propType: ') === 0) {                                                       // 51
        return; // Ignore CompositeComponent proptype check.                                                           // 52
      }                                                                                                                // 53
                                                                                                                       // 54
      if (!condition) {                                                                                                // 55
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];                                                                          // 57
        }                                                                                                              // 58
                                                                                                                       // 59
        printWarning.apply(undefined, [format].concat(args));                                                          // 60
      }                                                                                                                // 61
    };                                                                                                                 // 62
  })();                                                                                                                // 63
}                                                                                                                      // 64
                                                                                                                       // 65
module.exports = warning;                                                                                              // 66
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
require("./node_modules/meteor/std:accounts-ui/check-npm.js");
var exports = require("./node_modules/meteor/std:accounts-ui/main_client.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['std:accounts-ui'] = exports;

})();
