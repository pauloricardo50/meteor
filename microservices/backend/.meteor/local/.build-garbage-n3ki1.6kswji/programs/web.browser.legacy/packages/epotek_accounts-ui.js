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
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

/* Package-scope variables */
var labels;

var require = meteorInstall({"node_modules":{"meteor":{"epotek:accounts-ui":{"check-npm.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/check-npm.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
//
// checkNpmVersions({
//   "react": ">=0.14.7 || ^15.0.0-rc.2",
//   "react-dom": ">=0.14.7 || ^15.0.0-rc.2",
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main_client.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/main_client.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  "default": function () {
    return LoginForm;
  },
  Accounts: function () {
    return Accounts;
  },
  STATES: function () {
    return STATES;
  }
});
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 0);
module.link("./imports/accounts_ui.js");
module.link("./imports/login_session.js");
var STATES;
module.link("./imports/helpers.js", {
  STATES: function (v) {
    STATES = v;
  }
}, 1);
module.link("./imports/api/client/loginWithoutPassword.js");
var LoginForm;
module.link("./imports/ui/components/LoginForm.jsx", {
  "default": function (v) {
    LoginForm = v;
  }
}, 2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"accounts_ui.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/accounts_ui.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 0);
var redirect, validatePassword, validateEmail, validateUsername;
module.link("./helpers.js", {
  redirect: function (v) {
    redirect = v;
  },
  validatePassword: function (v) {
    validatePassword = v;
  },
  validateEmail: function (v) {
    validateEmail = v;
  },
  validateUsername: function (v) {
    validateUsername = v;
  }
}, 1);

/**
 * @summary Accounts UI
 * @namespace
 * @memberOf Accounts
 */
Accounts.ui = {};
Accounts.ui._options = {
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  passwordSignupFields: 'EMAIL_ONLY_NO_PASSWORD',
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  onSubmitHook: function () {},
  onPreSignUpHook: function () {
    return new Promise(function (resolve) {
      return resolve();
    });
  },
  onPostSignUpHook: function () {},
  onEnrollAccountHook: function () {
    return redirect("" + Accounts.ui._options.loginPath);
  },
  onResetPasswordHook: function () {
    return redirect("" + Accounts.ui._options.loginPath);
  },
  onVerifyEmailHook: function () {
    return redirect("" + Accounts.ui._options.profilePath);
  },
  onSignedInHook: function () {
    return redirect("" + Accounts.ui._options.homeRoutePath);
  },
  onSignedOutHook: function () {
    return redirect("" + Accounts.ui._options.homeRoutePath);
  },
  emailPattern: new RegExp('[^@]+@[^@.]{2,}.[^.@]+')
};
/**
 * @summary Configure the behavior of [`<Accounts.ui.LoginForm />`](#react-accounts-ui).
 * @anywhere
 * @param {Object} options
 * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
 * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', '`EMAIL_ONLY`', or '`NO_PASSWORD`' (default).
 */

Accounts.ui.config = function (options) {
  // validate options keys
  var VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forbidClientAccountCreation', 'requireEmailVerification', 'minimumPasswordLength', 'loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath', 'onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook', 'onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook', 'validateField', 'emailPattern'];
  Object.keys(options).forEach(function (key) {
    if (!VALID_KEYS.includes(key)) throw new Error('Accounts.ui.config: Invalid key: ' + key);
  }); // Deal with `passwordSignupFields`

  if (options.passwordSignupFields) {
    if (['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', 'EMAIL_ONLY', 'EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
    } else {
      throw new Error('Accounts.ui.config: Invalid option for `passwordSignupFields`: ' + options.passwordSignupFields);
    }
  } // Deal with `requestPermissions`


  if (options.requestPermissions) {
    Object.keys(options.requestPermissions).forEach(function (service) {
      var scope = options.requestPermissions[service];

      if (Accounts.ui._options.requestPermissions[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
      } else if (!(scope instanceof Array)) {
        throw new Error('Accounts.ui.config: Value for `requestPermissions` must be an array');
      } else {
        Accounts.ui._options.requestPermissions[service] = scope;
      }
    });
  } // Deal with `requestOfflineToken`


  if (options.requestOfflineToken) {
    Object.keys(options.requestOfflineToken).forEach(function (service) {
      var value = options.requestOfflineToken[service];
      if (service !== 'google') throw new Error('Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.');

      if (Accounts.ui._options.requestOfflineToken[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
      } else {
        Accounts.ui._options.requestOfflineToken[service] = value;
      }
    });
  } // Deal with `forceApprovalPrompt`


  if (options.forceApprovalPrompt) {
    Object.keys(options.forceApprovalPrompt).forEach(function (service) {
      var value = options.forceApprovalPrompt[service];
      if (service !== 'google') throw new Error('Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.');

      if (Accounts.ui._options.forceApprovalPrompt[service]) {
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
      } else {
        Accounts.ui._options.forceApprovalPrompt[service] = value;
      }
    });
  } // Deal with `requireEmailVerification`


  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification != 'boolean') {
      throw new Error("Accounts.ui.config: \"requireEmailVerification\" not a boolean");
    } else {
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;
    }
  } // Deal with `minimumPasswordLength`


  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength != 'number') {
      throw new Error("Accounts.ui.config: \"minimumPasswordLength\" not a number");
    } else {
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  } // Deal with the hooks.


  var _arr = ['onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var hook = _arr[_i];

    if (options[hook]) {
      if (typeof options[hook] != 'function') {
        throw new Error("Accounts.ui.config: \"" + hook + "\" not a function");
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // Deal with pattern.


  var _arr2 = ['emailPattern'];

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    var _hook = _arr2[_i2];

    if (options[_hook]) {
      if (!(options[_hook] instanceof RegExp)) {
        throw new Error("Accounts.ui.config: \"" + _hook + "\" not a Regular Expression");
      } else {
        Accounts.ui._options[_hook] = options[_hook];
      }
    }
  } // deal with the paths.


  var _arr3 = ['loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath'];

  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
    var path = _arr3[_i3];

    if (typeof options[path] !== 'undefined') {
      if (options[path] !== null && typeof options[path] !== 'string') {
        throw new Error("Accounts.ui.config: " + path + " is not a string or null");
      } else {
        Accounts.ui._options[path] = options[path];
      }
    }
  } // deal with redirect hooks.


  var _loop = function (_hook2) {
    if (options[_hook2]) {
      if (typeof options[_hook2] == 'function') {
        Accounts.ui._options[_hook2] = options[_hook2];
      } else if (typeof options[_hook2] == 'string') {
        Accounts.ui._options[_hook2] = function () {
          return redirect(options[_hook2]);
        };
      } else {
        throw new Error("Accounts.ui.config: \"" + _hook2 + "\" not a function or an absolute or relative path");
      }
    }
  };

  var _arr4 = ['onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook'];

  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
    var _hook2 = _arr4[_i4];

    _loop(_hook2);
  }
};

module.exportDefault(Accounts);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/helpers.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  loginButtonsSession: function () {
    return loginButtonsSession;
  },
  STATES: function () {
    return STATES;
  },
  getLoginServices: function () {
    return getLoginServices;
  },
  hasPasswordService: function () {
    return hasPasswordService;
  },
  loginResultCallback: function () {
    return loginResultCallback;
  },
  passwordSignupFields: function () {
    return passwordSignupFields;
  },
  validateEmail: function () {
    return validateEmail;
  },
  validatePassword: function () {
    return validatePassword;
  },
  validateUsername: function () {
    return validateUsername;
  },
  redirect: function () {
    return redirect;
  },
  capitalize: function () {
    return capitalize;
  }
});
var browserHistory;

try {
  browserHistory = require('react-router').browserHistory;
} catch (e) {}

var loginButtonsSession = Accounts._loginButtonsSession;
var STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PROFILE: Symbol('PROFILE'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET'),
  ENROLL_ACCOUNT: Symbol('ENROLL_ACCOUNT')
};

function getLoginServices() {
  // First look for OAuth services.
  var services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : []; // Be equally kind to all login services. This also preserves
  // backwards-compatibility.

  services.sort();
  return services.map(function (name) {
    return {
      name: name
    };
  });
}

// Export getLoginServices using old style globals for accounts-base which
// requires it.
this.getLoginServices = getLoginServices;

function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
}

function loginResultCallback(service, err) {
  if (!err) {} else if (err instanceof Accounts.LoginCancelledError) {// do nothing
  } else if (err instanceof ServiceConfiguration.ConfigError) {} else {//loginButtonsSession.errorMessage(err.reason || "Unknown error");
  }

  if (Meteor.isClient) {
    if (typeof redirect === 'string') {
      window.location.href = '/';
    }

    if (typeof service === 'function') {
      service();
    }
  }
}

function passwordSignupFields() {
  return Accounts.ui._options.passwordSignupFields || 'EMAIL_ONLY_NO_PASSWORD';
}

function validateEmail(email, showMessage, clearMessage) {
  if (passwordSignupFields() === 'USERNAME_AND_OPTIONAL_EMAIL' && email === '') {
    return true;
  }

  if (Accounts.ui._options.emailPattern.test(email)) {
    return true;
  } else if (!email || email.length === 0) {
    showMessage('error.emailRequired', 'warning', false, 'email');
    return false;
  } else {
    showMessage('error.accounts.Invalid email', 'warning', false, 'email');
    return false;
  }
}

function validatePassword() {
  var password = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var showMessage = arguments.length > 1 ? arguments[1] : undefined;
  var clearMessage = arguments.length > 2 ? arguments[2] : undefined;

  if (password.length >= Accounts.ui._options.minimumPasswordLength) {
    return true;
  } else {
    // const errMsg = T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength);
    var errMsg = 'error.minChar';
    showMessage(errMsg, 'warning', false, 'password');
    return false;
  }
}

function validateUsername(username, showMessage, clearMessage, formState) {
  if (username) {
    return true;
  } else {
    var fieldName = passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP ? 'username' : 'usernameOrEmail';
    showMessage('error.usernameRequired', 'warning', false, fieldName);
    return false;
  }
}

function redirect(redirect) {
  if (Meteor.isClient) {
    if (window.history) {
      // Run after all app specific redirects, i.e. to the login screen.
      Meteor.setTimeout(function () {
        if (Package['kadira:flow-router']) {
          Package['kadira:flow-router'].FlowRouter.go(redirect);
        } else if (Package['kadira:flow-router-ssr']) {
          Package['kadira:flow-router-ssr'].FlowRouter.go(redirect);
        } else if (browserHistory) {
          browserHistory.push(redirect);
        } else {
          window.history.pushState({}, 'redirect', redirect);
        }
      }, 100);
    }
  }
}

function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/login_session.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  validateKey: function () {
    return validateKey;
  },
  KEY_PREFIX: function () {
    return KEY_PREFIX;
  }
});
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 0);
var STATES, loginResultCallback, getLoginServices;
module.link("./helpers.js", {
  STATES: function (v) {
    STATES = v;
  },
  loginResultCallback: function (v) {
    loginResultCallback = v;
  },
  getLoginServices: function (v) {
    getLoginServices = v;
  }
}, 1);
var VALID_KEYS = ['dropdownVisible', // XXX consider replacing these with one key that has an enum for values.
'inSignupFlow', 'inForgotPasswordFlow', 'inChangePasswordFlow', 'inMessageOnlyFlow', 'errorMessage', 'infoMessage', // dialogs with messages (info and error)
'resetPasswordToken', 'enrollAccountToken', 'justVerifiedEmail', 'justResetPassword', 'configureLoginServiceDialogVisible', 'configureLoginServiceDialogServiceName', 'configureLoginServiceDialogSaveDisabled', 'configureOnDesktopVisible'];

var validateKey = function (key) {
  if (!VALID_KEYS.includes(key)) throw new Error('Invalid key in loginButtonsSession: ' + key);
};

var KEY_PREFIX = 'Meteor.loginButtons.';
// XXX This should probably be package scope rather than exported
// (there was even a comment to that effect here from before we had
// namespacing) but accounts-ui-viewer uses it, so leave it as is for
// now
Accounts._loginButtonsSession = {
  set: function (key, value) {
    validateKey(key);
    if (['errorMessage', 'infoMessage'].includes(key)) throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");

    this._set(key, value);
  },
  _set: function (key, value) {
    Session.set(KEY_PREFIX + key, value);
  },
  get: function (key) {
    validateKey(key);
    return Session.get(KEY_PREFIX + key);
  }
};

if (Meteor.isClient) {
  // In the login redirect flow, we'll have the result of the login
  // attempt at page load time when we're redirected back to the
  // application.  Register a callback to update the UI (i.e. to close
  // the dialog on a successful login or display the error on a failed
  // login).
  //
  Accounts.onPageLoadLogin(function (attemptInfo) {
    // Ignore if we have a left over login attempt for a service that is no longer registered.
    if (getLoginServices().map(function (_ref) {
      var name = _ref.name;
      return name;
    }).includes(attemptInfo.type)) loginResultCallback(attemptInfo.type, attemptInfo.error);
  });
  var doneCallback;
  Accounts.onResetPasswordLink(function (token, done) {
    Accounts._loginButtonsSession.set('resetPasswordToken', token);

    Session.set(KEY_PREFIX + 'state', 'resetPasswordToken');
    doneCallback = done;

    Accounts.ui._options.onResetPasswordHook();
  });
  Accounts.onEnrollmentLink(function (token, done) {
    Accounts._loginButtonsSession.set('enrollAccountToken', token);

    Session.set(KEY_PREFIX + 'state', 'enrollAccountToken');
    doneCallback = done;

    Accounts.ui._options.onEnrollAccountHook();
  });
  Accounts.onEmailVerificationLink(function (token, done) {
    Accounts.verifyEmail(token, function (error) {
      if (!error) {
        Accounts._loginButtonsSession.set('justVerifiedEmail', true);

        Session.set(KEY_PREFIX + 'state', 'justVerifiedEmail');

        Accounts.ui._options.onSignedInHook();
      } else {
        Accounts.ui._options.onVerifyEmailHook();
      }

      done();
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"client":{"loginWithoutPassword.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/api/client/loginWithoutPassword.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * @summary Request a forgot password email.
 * @locus Client
 * @param {Object} options
 * @param {String} options.email The email address to send a password reset link.
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */
Accounts.loginWithoutPassword = function (options, callback) {
  if (!options.email) throw new Error('Must pass options.email');
  Accounts.connection.call('loginWithoutPassword', options, callback);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"Button.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Button.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  Button: function () {
    return Button;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 2);
var Link;

try {
  Link = require('react-router').Link;
} catch (e) {}

var Button =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Button, _React$Component);

  function Button() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Button.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          label = _this$props.label,
          _this$props$href = _this$props.href,
          href = _this$props$href === void 0 ? null : _this$props$href,
          type = _this$props.type,
          _this$props$disabled = _this$props.disabled,
          disabled = _this$props$disabled === void 0 ? false : _this$props$disabled,
          className = _this$props.className,
          onClick = _this$props.onClick;

      if (type == 'link') {
        // Support React Router.
        if (Link && href) {
          return React.createElement(Link, {
            to: href,
            className: className
          }, label);
        } else {
          return React.createElement("a", {
            href: href,
            className: className,
            onClick: onClick
          }, label);
        }
      }

      return React.createElement("button", {
        className: className,
        type: type,
        disabled: disabled,
        onClick: onClick
      }, label);
    }

    return render;
  }();

  return Button;
}(React.Component);

Button.propTypes = {
  onClick: PropTypes.func
};
Accounts.ui.Button = Button;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Buttons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Buttons.jsx                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  Buttons: function () {
    return Buttons;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("./Button.jsx");
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 1);

var Buttons =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Buttons, _React$Component);

  function Buttons() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Buttons.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          _this$props$buttons = _this$props.buttons,
          buttons = _this$props$buttons === void 0 ? {} : _this$props$buttons,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'buttons' : _this$props$className;
      return React.createElement("div", {
        className: className
      }, Object.keys(buttons).map(function (id, i) {
        return React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, buttons[id], {
          key: i
        }));
      }));
    }

    return render;
  }();

  return Buttons;
}(React.Component);

Accounts.ui.Buttons = Buttons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Field.jsx                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  Field: function () {
    return Field;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 2);

var Field =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Field, _React$Component);

  function Field(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      mount: true
    };
    return _this;
  }

  var _proto = Field.prototype;

  _proto.triggerUpdate = function () {
    function triggerUpdate() {
      // Trigger an onChange on inital load, to support browser prefilled values.
      var onChange = this.props.onChange;

      if (this.input && onChange) {
        onChange({
          target: {
            value: this.input.value
          }
        });
      }
    }

    return triggerUpdate;
  }();

  _proto.componentDidMount = function () {
    function componentDidMount() {
      this.triggerUpdate();
    }

    return componentDidMount;
  }();

  _proto.componentDidUpdate = function () {
    function componentDidUpdate(prevProps) {
      // Re-mount component so that we don't expose browser prefilled passwords if the component was
      // a password before and now something else.
      if (prevProps.id !== this.props.id) {
        this.setState({
          mount: false
        });
      } else if (!this.state.mount) {
        this.setState({
          mount: true
        });
        this.triggerUpdate();
      }
    }

    return componentDidUpdate;
  }();

  _proto.render = function () {
    function render() {
      var _this2 = this;

      var _this$props = this.props,
          id = _this$props.id,
          hint = _this$props.hint,
          label = _this$props.label,
          _this$props$type = _this$props.type,
          type = _this$props$type === void 0 ? 'text' : _this$props$type,
          onChange = _this$props.onChange,
          _this$props$required = _this$props.required,
          required = _this$props$required === void 0 ? false : _this$props$required,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'field' : _this$props$className,
          _this$props$defaultVa = _this$props.defaultValue,
          defaultValue = _this$props$defaultVa === void 0 ? '' : _this$props$defaultVa,
          message = _this$props.message;
      var _this$state$mount = this.state.mount,
          mount = _this$state$mount === void 0 ? true : _this$state$mount;

      if (type == 'notice') {
        return React.createElement("div", {
          className: className
        }, label);
      }

      return mount ? React.createElement("div", {
        className: className
      }, React.createElement("label", {
        htmlFor: id
      }, label), React.createElement("input", {
        id: id,
        ref: function (ref) {
          return _this2.input = ref;
        },
        type: type,
        onChange: onChange,
        placeholder: hint,
        defaultValue: defaultValue
      }), message && React.createElement("span", {
        className: ['message', message.type].join(' ').trim()
      }, message.message)) : null;
    }

    return render;
  }();

  return Field;
}(React.Component);

Field.propTypes = {
  onChange: PropTypes.func
};
Accounts.ui.Field = Field;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Fields.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Fields.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  Fields: function () {
    return Fields;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 1);
module.link("./Field.jsx");

var Fields =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Fields, _React$Component);

  function Fields() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Fields.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          _this$props$fields = _this$props.fields,
          fields = _this$props$fields === void 0 ? {} : _this$props$fields,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'fields' : _this$props$className;
      return React.createElement("div", {
        className: className
      }, Object.keys(fields).map(function (id, i) {
        return React.createElement(Accounts.ui.Field, (0, _extends2.default)({}, fields[id], {
          key: i
        }));
      }));
    }

    return render;
  }();

  return Fields;
}(React.Component);

Accounts.ui.Fields = Fields;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Form.jsx                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  Form: function () {
    return Form;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 2);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 3);
module.link("./Fields.jsx");
module.link("./Buttons.jsx");
module.link("./FormMessage.jsx");
module.link("./PasswordOrService.jsx");
module.link("./SocialButtons.jsx");
module.link("./FormMessages.jsx");

var Form =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(Form, _React$Component);

  function Form() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = Form.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var form = this.form;

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
        });
      }
    }

    return componentDidMount;
  }();

  _proto.render = function () {
    function render() {
      var _this = this;

      var _this$props = this.props,
          hasPasswordService = _this$props.hasPasswordService,
          oauthServices = _this$props.oauthServices,
          fields = _this$props.fields,
          buttons = _this$props.buttons,
          error = _this$props.error,
          messages = _this$props.messages,
          translate = _this$props.translate,
          _this$props$ready = _this$props.ready,
          ready = _this$props$ready === void 0 ? true : _this$props$ready,
          className = _this$props.className;
      return React.createElement("form", {
        ref: function (ref) {
          return _this.form = ref;
        },
        className: [className, ready ? 'ready' : null].join(' '),
        className: "accounts-ui",
        noValidate: true
      }, React.createElement(Accounts.ui.Fields, {
        fields: fields
      }), React.createElement(Accounts.ui.Buttons, {
        buttons: buttons
      }), React.createElement(Accounts.ui.PasswordOrService, {
        oauthServices: oauthServices,
        translate: translate
      }), React.createElement(Accounts.ui.SocialButtons, {
        oauthServices: oauthServices
      }), React.createElement(Accounts.ui.FormMessages, {
        messages: messages
      }));
    }

    return render;
  }();

  return Form;
}(React.Component);

Form.propTypes = {
  oauthServices: PropTypes.object,
  fields: PropTypes.object.isRequired,
  buttons: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  error: PropTypes.string,
  ready: PropTypes.bool
};
Accounts.ui.Form = Form;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/FormMessage.jsx                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  FormMessage: function () {
    return FormMessage;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 1);

function isObject(obj) {
  return obj === Object(obj);
}

var FormMessage =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(FormMessage, _React$Component);

  function FormMessage() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = FormMessage.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          message = _this$props.message,
          type = _this$props.type,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'message' : _this$props$className,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style,
          deprecated = _this$props.deprecated; // XXX Check for deprecations.

      if (deprecated) {
        // Found backwords compatibility issue.
        console.warn('You are overriding Accounts.ui.Form and using FormMessage, the use of FormMessage in Form has been depreacted in v1.2.11, update your implementation to use FormMessages: https://github.com/studiointeract/accounts-ui/#deprecations');
      }

      message = isObject(message) ? message.message : message; // If message is object, then try to get message from it

      return message ? React.createElement("div", {
        style: style,
        className: [className, type].join(' ')
      }, message) : null;
    }

    return render;
  }();

  return FormMessage;
}(React.Component);

Accounts.ui.FormMessage = FormMessage;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/FormMessages.jsx                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  FormMessages: function () {
    return FormMessages;
  }
});
var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 1);

var FormMessages =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(FormMessages, _Component);

  function FormMessages() {
    return _Component.apply(this, arguments) || this;
  }

  var _proto = FormMessages.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          _this$props$messages = _this$props.messages,
          messages = _this$props$messages === void 0 ? [] : _this$props$messages,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'messages' : _this$props$className,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style;
      return messages.length > 0 && React.createElement("div", {
        className: "messages"
      }, messages.filter(function (message) {
        return !('field' in message);
      }).map(function (_ref, i) {
        var message = _ref.message,
            type = _ref.type;
        return React.createElement(Accounts.ui.FormMessage, {
          message: message,
          type: type,
          key: i
        });
      }));
    }

    return render;
  }();

  return FormMessages;
}(Component);

Accounts.ui.FormMessages = FormMessages;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LoginForm.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/LoginForm.jsx                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React, Component;
module.link("react", {
  "default": function (v) {
    React = v;
  },
  Component: function (v) {
    Component = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var ReactDOM;
module.link("react-dom", {
  "default": function (v) {
    ReactDOM = v;
  }
}, 2);
var withTracker;
module.link("meteor/react-meteor-data", {
  withTracker: function (v) {
    withTracker = v;
  }
}, 3);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 4);
var T9n;
module.link("meteor-accounts-t9n", {
  T9n: function (v) {
    T9n = v;
  }
}, 5);
var KEY_PREFIX;
module.link("../../login_session.js", {
  KEY_PREFIX: function (v) {
    KEY_PREFIX = v;
  }
}, 6);
module.link("./Form.jsx");
var STATES, passwordSignupFields, validateEmail, validatePassword, validateUsername, loginResultCallback, getLoginServices, hasPasswordService, capitalize;
module.link("../../helpers.js", {
  STATES: function (v) {
    STATES = v;
  },
  passwordSignupFields: function (v) {
    passwordSignupFields = v;
  },
  validateEmail: function (v) {
    validateEmail = v;
  },
  validatePassword: function (v) {
    validatePassword = v;
  },
  validateUsername: function (v) {
    validateUsername = v;
  },
  loginResultCallback: function (v) {
    loginResultCallback = v;
  },
  getLoginServices: function (v) {
    getLoginServices = v;
  },
  hasPasswordService: function (v) {
    hasPasswordService = v;
  },
  capitalize: function (v) {
    capitalize = v;
  }
}, 7);

function indexBy(array, key) {
  var result = {};
  array.forEach(function (obj) {
    result[obj[key]] = obj;
  });
  return result;
}

var LoginForm =
/*#__PURE__*/
function (_Component) {
  (0, _inheritsLoose2.default)(LoginForm, _Component);

  function LoginForm(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    var formState = props.formState,
        loginPath = props.loginPath,
        signUpPath = props.signUpPath,
        resetPasswordPath = props.resetPasswordPath,
        profilePath = props.profilePath,
        changePasswordPath = props.changePasswordPath;

    if (formState === STATES.SIGN_IN && Package['accounts-password']) {
      console.warn('Do not force the state to SIGN_IN on Accounts.ui.LoginForm, it will make it impossible to reset password in your app, this state is also the default state if logged out, so no need to force it.');
    } // Set inital state.


    _this.state = {
      messages: [],
      waiting: true,
      formState: formState ? formState : Accounts.user() ? STATES.PROFILE : STATES.SIGN_IN,
      onSubmitHook: props.onSubmitHook || Accounts.ui._options.onSubmitHook,
      onSignedInHook: props.onSignedInHook || Accounts.ui._options.onSignedInHook,
      onSignedOutHook: props.onSignedOutHook || Accounts.ui._options.onSignedOutHook,
      onPreSignUpHook: props.onPreSignUpHook || Accounts.ui._options.onPreSignUpHook,
      onPostSignUpHook: props.onPostSignUpHook || Accounts.ui._options.onPostSignUpHook
    };
    _this.translate = _this.translate.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  var _proto = LoginForm.prototype;

  _proto.componentDidMount = function () {
    function componentDidMount() {
      var _this2 = this;

      this.setState(function (prevState) {
        return {
          waiting: false,
          ready: true
        };
      });
      var changeState = Session.get(KEY_PREFIX + 'state');

      switch (changeState) {
        case 'enrollAccountToken':
          this.setState(function (prevState) {
            return {
              formState: STATES.ENROLL_ACCOUNT
            };
          });
          Session.set(KEY_PREFIX + 'state', null);
          break;

        case 'resetPasswordToken':
          this.setState(function (prevState) {
            return {
              formState: STATES.PASSWORD_CHANGE
            };
          });
          Session.set(KEY_PREFIX + 'state', null);
          break;

        case 'justVerifiedEmail':
          this.setState(function (prevState) {
            return {
              formState: STATES.PROFILE
            };
          });
          Session.set(KEY_PREFIX + 'state', null);
          break;
      } // Add default field values once the form did mount on the client


      this.setState(function (prevState) {
        return (0, _objectSpread2.default)({}, _this2.getDefaultFieldValues());
      });
    }

    return componentDidMount;
  }();

  _proto.componentWillReceiveProps = function () {
    function componentWillReceiveProps(nextProps, nextContext) {
      if (nextProps.formState && nextProps.formState !== this.state.formState) {
        this.setState((0, _objectSpread2.default)({
          formState: nextProps.formState
        }, this.getDefaultFieldValues()));
      }
    }

    return componentWillReceiveProps;
  }();

  _proto.componentDidUpdate = function () {
    function componentDidUpdate(prevProps, prevState) {
      if (!prevProps.user !== !this.props.user) {
        this.setState({
          formState: this.props.user ? STATES.PROFILE : STATES.SIGN_IN
        });
      }
    }

    return componentDidUpdate;
  }();

  _proto.translate = function () {
    function translate(text) {
      // if (this.props.t) {
      //   return this.props.t(text);
      // }
      return T9n.get(text);
    }

    return translate;
  }();

  _proto.validateField = function () {
    function validateField(field, value) {
      var formState = this.state.formState;

      switch (field) {
        case 'email':
          return validateEmail(value, this.showMessage.bind(this), this.clearMessage.bind(this));

        case 'password':
          return validatePassword(value, this.showMessage.bind(this), this.clearMessage.bind(this));

        case 'username':
          return validateUsername(value, this.showMessage.bind(this), this.clearMessage.bind(this), formState);
      }
    }

    return validateField;
  }();

  _proto.getUsernameOrEmailField = function () {
    function getUsernameOrEmailField() {
      return {
        id: 'usernameOrEmail',
        hint: this.translate('enterUsernameOrEmail'),
        label: this.translate('usernameOrEmail'),
        required: true,
        defaultValue: this.state.username || '',
        onChange: this.handleChange.bind(this, 'usernameOrEmail'),
        message: this.getMessageForField('usernameOrEmail')
      };
    }

    return getUsernameOrEmailField;
  }();

  _proto.getUsernameField = function () {
    function getUsernameField() {
      return {
        id: 'username',
        hint: this.translate('enterUsername'),
        label: this.translate('username'),
        required: true,
        defaultValue: this.state.username || '',
        onChange: this.handleChange.bind(this, 'username'),
        message: this.getMessageForField('username')
      };
    }

    return getUsernameField;
  }();

  _proto.getEmailField = function () {
    function getEmailField() {
      return {
        id: 'email',
        hint: this.translate('enterEmail'),
        label: this.translate('email'),
        type: 'email',
        required: true,
        defaultValue: this.state.email || '',
        onChange: this.handleChange.bind(this, 'email'),
        message: this.getMessageForField('email')
      };
    }

    return getEmailField;
  }();

  _proto.getPasswordField = function () {
    function getPasswordField() {
      return {
        id: 'password',
        hint: this.translate('enterPassword'),
        label: this.translate('password'),
        type: 'password',
        required: true,
        defaultValue: this.state.password || '',
        onChange: this.handleChange.bind(this, 'password'),
        message: this.getMessageForField('password')
      };
    }

    return getPasswordField;
  }();

  _proto.getSetPasswordField = function () {
    function getSetPasswordField() {
      return {
        id: 'newPassword',
        hint: this.translate('enterPassword'),
        label: this.translate('choosePassword'),
        type: 'password',
        required: true,
        onChange: this.handleChange.bind(this, 'newPassword')
      };
    }

    return getSetPasswordField;
  }();

  _proto.getNewPasswordField = function () {
    function getNewPasswordField() {
      return {
        id: 'newPassword',
        hint: this.translate('enterNewPassword'),
        label: this.translate('newPassword'),
        type: 'password',
        required: true,
        onChange: this.handleChange.bind(this, 'newPassword'),
        message: this.getMessageForField('newPassword')
      };
    }

    return getNewPasswordField;
  }();

  _proto.handleChange = function () {
    function handleChange(field, evt) {
      var _this$setState, _this$setDefaultField;

      var value = evt.target.value;

      switch (field) {
        case 'password':
          break;

        default:
          value = value.trim();
          break;
      }

      this.setState((_this$setState = {}, _this$setState[field] = value, _this$setState));
      this.setDefaultFieldValues((_this$setDefaultField = {}, _this$setDefaultField[field] = value, _this$setDefaultField));
    }

    return handleChange;
  }();

  _proto.fields = function () {
    function fields() {
      var loginFields = [];
      var formState = this.state.formState;

      if (!hasPasswordService() && getLoginServices().length == 0) {
        loginFields.push({
          label: 'No login service added, i.e. accounts-password',
          type: 'notice'
        });
      }

      if (hasPasswordService() && formState == STATES.SIGN_IN) {
        if (['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getUsernameOrEmailField());
        }

        if (passwordSignupFields() === 'USERNAME_ONLY') {
          loginFields.push(this.getUsernameField());
        }

        if (['EMAIL_ONLY', 'EMAIL_ONLY_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getEmailField());
        }

        if (!['EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getPasswordField());
        }
      }

      if (hasPasswordService() && formState == STATES.SIGN_UP) {
        if (['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'USERNAME_ONLY', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getUsernameField());
        }

        if (['USERNAME_AND_EMAIL', 'EMAIL_ONLY', 'EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getEmailField());
        }

        if (['USERNAME_AND_OPTIONAL_EMAIL'].includes(passwordSignupFields())) {
          loginFields.push(Object.assign(this.getEmailField(), {
            required: false
          }));
        }

        if (!['EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          loginFields.push(this.getPasswordField());
        }
      }

      if (formState == STATES.PASSWORD_RESET) {
        loginFields.push(this.getEmailField());
      }

      if (this.showPasswordChangeForm()) {
        if (Meteor.isClient && !Accounts._loginButtonsSession.get('resetPasswordToken')) {
          loginFields.push(this.getPasswordField());
        }

        loginFields.push(this.getNewPasswordField());
      }

      if (this.showEnrollAccountForm()) {
        loginFields.push(this.getSetPasswordField());
      }

      return indexBy(loginFields, 'id');
    }

    return fields;
  }();

  _proto.buttons = function () {
    function buttons() {
      var _this$props = this.props,
          _this$props$loginPath = _this$props.loginPath,
          loginPath = _this$props$loginPath === void 0 ? Accounts.ui._options.loginPath : _this$props$loginPath,
          _this$props$signUpPat = _this$props.signUpPath,
          signUpPath = _this$props$signUpPat === void 0 ? Accounts.ui._options.signUpPath : _this$props$signUpPat,
          _this$props$resetPass = _this$props.resetPasswordPath,
          resetPasswordPath = _this$props$resetPass === void 0 ? Accounts.ui._options.resetPasswordPath : _this$props$resetPass,
          _this$props$changePas = _this$props.changePasswordPath,
          changePasswordPath = _this$props$changePas === void 0 ? Accounts.ui._options.changePasswordPath : _this$props$changePas,
          _this$props$profilePa = _this$props.profilePath,
          profilePath = _this$props$profilePa === void 0 ? Accounts.ui._options.profilePath : _this$props$profilePa;
      var user = this.props.user;
      var _this$state = this.state,
          formState = _this$state.formState,
          waiting = _this$state.waiting;
      var loginButtons = [];

      if (user && formState == STATES.PROFILE) {
        loginButtons.push({
          id: 'signOut',
          label: this.translate('signOut'),
          disabled: waiting,
          onClick: this.signOut.bind(this)
        });
      }

      if (this.showCreateAccountLink()) {
        loginButtons.push({
          id: 'switchToSignUp',
          label: this.translate('signUp'),
          type: 'link',
          href: signUpPath,
          onClick: this.switchToSignUp.bind(this)
        });
      }

      if (formState == STATES.SIGN_UP || formState == STATES.PASSWORD_RESET) {
        loginButtons.push({
          id: 'switchToSignIn',
          label: this.translate('signIn'),
          type: 'link',
          href: loginPath,
          onClick: this.switchToSignIn.bind(this)
        });
      }

      if (this.showForgotPasswordLink()) {
        loginButtons.push({
          id: 'switchToPasswordReset',
          label: this.translate('forgotPassword'),
          type: 'link',
          href: resetPasswordPath,
          onClick: this.switchToPasswordReset.bind(this)
        });
      }

      if (user && !['EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields()) && formState == STATES.PROFILE && user.services && 'password' in user.services) {
        loginButtons.push({
          id: 'switchToChangePassword',
          label: this.translate('changePassword'),
          type: 'link',
          href: changePasswordPath,
          onClick: this.switchToChangePassword.bind(this)
        });
      }

      if (formState == STATES.SIGN_UP) {
        loginButtons.push({
          id: 'signUp',
          label: this.translate('signUp'),
          type: hasPasswordService() ? 'submit' : 'link',
          className: 'active',
          disabled: waiting,
          onClick: hasPasswordService() ? this.signUp.bind(this, {}) : null
        });
      }

      if (this.showSignInLink()) {
        loginButtons.push({
          id: 'signIn',
          label: this.translate('signIn'),
          type: hasPasswordService() ? 'submit' : 'link',
          className: 'active',
          disabled: waiting,
          onClick: hasPasswordService() ? this.signIn.bind(this) : null
        });
      }

      if (formState == STATES.PASSWORD_RESET) {
        loginButtons.push({
          id: 'emailResetLink',
          label: this.translate('resetYourPassword'),
          type: 'submit',
          disabled: waiting,
          onClick: this.passwordReset.bind(this)
        });
      }

      if (this.showPasswordChangeForm() || this.showEnrollAccountForm()) {
        loginButtons.push({
          id: 'changePassword',
          label: this.showPasswordChangeForm() ? this.translate('changePassword') : this.translate('setPassword'),
          type: 'submit',
          disabled: waiting,
          onClick: this.passwordChange.bind(this)
        });

        if (Accounts.user()) {
          loginButtons.push({
            id: 'switchToSignOut',
            label: this.translate('cancel'),
            type: 'link',
            href: profilePath,
            onClick: this.switchToSignOut.bind(this)
          });
        } else {
          loginButtons.push({
            id: 'cancelResetPassword',
            label: this.translate('cancel'),
            type: 'link',
            onClick: this.cancelResetPassword.bind(this)
          });
        }
      } // Sort the button array so that the submit button always comes first, and
      // buttons should also come before links.


      loginButtons.sort(function (a, b) {
        return (b.type == 'submit' && a.type != undefined) - (a.type == 'submit' && b.type != undefined);
      });
      return indexBy(loginButtons, 'id');
    }

    return buttons;
  }();

  _proto.showSignInLink = function () {
    function showSignInLink() {
      return this.state.formState == STATES.SIGN_IN && Package['accounts-password'];
    }

    return showSignInLink;
  }();

  _proto.showPasswordChangeForm = function () {
    function showPasswordChangeForm() {
      return Package['accounts-password'] && this.state.formState == STATES.PASSWORD_CHANGE;
    }

    return showPasswordChangeForm;
  }();

  _proto.showEnrollAccountForm = function () {
    function showEnrollAccountForm() {
      return Package['accounts-password'] && this.state.formState == STATES.ENROLL_ACCOUNT;
    }

    return showEnrollAccountForm;
  }();

  _proto.showCreateAccountLink = function () {
    function showCreateAccountLink() {
      return this.state.formState == STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation && Package['accounts-password'];
    }

    return showCreateAccountLink;
  }();

  _proto.showForgotPasswordLink = function () {
    function showForgotPasswordLink() {
      return !this.props.user && this.state.formState == STATES.SIGN_IN && ['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'EMAIL_ONLY'].includes(passwordSignupFields());
    }

    return showForgotPasswordLink;
  }()
  /**
   * Helper to store field values while using the form.
   */
  ;

  _proto.setDefaultFieldValues = function () {
    function setDefaultFieldValues(defaults) {
      if ((0, _typeof2.default)(defaults) !== 'object') {
        throw new Error('Argument to setDefaultFieldValues is not of type object');
      } else if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem('accounts_ui', JSON.stringify((0, _objectSpread2.default)({
          passwordSignupFields: passwordSignupFields()
        }, this.getDefaultFieldValues(), defaults)));
      }
    }

    return setDefaultFieldValues;
  }()
  /**
   * Helper to get field values when switching states in the form.
   */
  ;

  _proto.getDefaultFieldValues = function () {
    function getDefaultFieldValues() {
      if (typeof localStorage !== 'undefined' && localStorage) {
        var defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);

        if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {
          return defaultFieldValues;
        }
      }
    }

    return getDefaultFieldValues;
  }()
  /**
   * Helper to clear field values when signing in, up or out.
   */
  ;

  _proto.clearDefaultFieldValues = function () {
    function clearDefaultFieldValues() {
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.removeItem('accounts_ui');
      }
    }

    return clearDefaultFieldValues;
  }();

  _proto.switchToSignUp = function () {
    function switchToSignUp(event) {
      event.preventDefault();
      this.setState((0, _objectSpread2.default)({
        formState: STATES.SIGN_UP
      }, this.getDefaultFieldValues()));
      this.clearMessages();
    }

    return switchToSignUp;
  }();

  _proto.switchToSignIn = function () {
    function switchToSignIn(event) {
      event.preventDefault();
      this.setState((0, _objectSpread2.default)({
        formState: STATES.SIGN_IN
      }, this.getDefaultFieldValues()));
      this.clearMessages();
    }

    return switchToSignIn;
  }();

  _proto.switchToPasswordReset = function () {
    function switchToPasswordReset(event) {
      event.preventDefault();
      this.setState((0, _objectSpread2.default)({
        formState: STATES.PASSWORD_RESET
      }, this.getDefaultFieldValues()));
      this.clearMessages();
    }

    return switchToPasswordReset;
  }();

  _proto.switchToChangePassword = function () {
    function switchToChangePassword(event) {
      event.preventDefault();
      this.setState((0, _objectSpread2.default)({
        formState: STATES.PASSWORD_CHANGE
      }, this.getDefaultFieldValues()));
      this.clearMessages();
    }

    return switchToChangePassword;
  }();

  _proto.switchToSignOut = function () {
    function switchToSignOut(event) {
      event.preventDefault();
      this.setState({
        formState: STATES.PROFILE
      });
      this.clearMessages();
    }

    return switchToSignOut;
  }();

  _proto.cancelResetPassword = function () {
    function cancelResetPassword(event) {
      event.preventDefault();

      Accounts._loginButtonsSession.set('resetPasswordToken', null);

      this.setState({
        formState: STATES.SIGN_IN,
        messages: []
      });
    }

    return cancelResetPassword;
  }();

  _proto.signOut = function () {
    function signOut() {
      var _this3 = this;

      Meteor.logout(function () {
        _this3.setState({
          formState: STATES.SIGN_IN,
          password: null
        });

        _this3.state.onSignedOutHook();

        _this3.clearMessages();

        _this3.clearDefaultFieldValues();
      });
    }

    return signOut;
  }();

  _proto.signIn = function () {
    function signIn() {
      var _this4 = this;

      var _this$state2 = this.state,
          _this$state2$username = _this$state2.username,
          username = _this$state2$username === void 0 ? null : _this$state2$username,
          _this$state2$email = _this$state2.email,
          email = _this$state2$email === void 0 ? null : _this$state2$email,
          _this$state2$username2 = _this$state2.usernameOrEmail,
          usernameOrEmail = _this$state2$username2 === void 0 ? null : _this$state2$username2,
          password = _this$state2.password,
          formState = _this$state2.formState,
          onSubmitHook = _this$state2.onSubmitHook;
      var error = false;
      var loginSelector;
      this.clearMessages();

      if (usernameOrEmail !== null) {
        if (!this.validateField('username', usernameOrEmail)) {
          if (this.state.formState == STATES.SIGN_UP) {
            this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
          }

          error = true;
        } else {
          if (['USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
            this.loginWithoutPassword();
            return;
          } else {
            loginSelector = usernameOrEmail;
          }
        }
      } else if (username !== null) {
        if (!this.validateField('username', username)) {
          if (this.state.formState == STATES.SIGN_UP) {
            this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
          }

          error = true;
        } else {
          loginSelector = {
            username: username
          };
        }
      } else if (usernameOrEmail == null) {
        if (!this.validateField('email', email)) {
          error = true;
        } else {
          if (['EMAIL_ONLY_NO_PASSWORD'].includes(passwordSignupFields())) {
            this.loginWithoutPassword();
            error = true;
          } else {
            loginSelector = {
              email: email
            };
          }
        }
      }

      if (!['EMAIL_ONLY_NO_PASSWORD'].includes(passwordSignupFields()) && !this.validateField('password', password)) {
        error = true;
      }

      if (!error) {
        Meteor.loginWithPassword(loginSelector, password, function (error, result) {
          onSubmitHook(error, formState);

          if (error) {
            _this4.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');
          } else {
            loginResultCallback(function () {
              return _this4.state.onSignedInHook();
            });

            _this4.setState({
              formState: STATES.PROFILE,
              password: null
            });

            _this4.clearDefaultFieldValues();
          }
        });
      }
    }

    return signIn;
  }();

  _proto.oauthButtons = function () {
    function oauthButtons() {
      var _this5 = this;

      var _this$state3 = this.state,
          formState = _this$state3.formState,
          waiting = _this$state3.waiting;
      var oauthButtons = [];

      if (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) {
        if (Accounts.oauth) {
          Accounts.oauth.serviceNames().map(function (service) {
            oauthButtons.push({
              id: service,
              label: capitalize(service),
              disabled: waiting,
              type: 'button',
              className: "btn-" + service + " " + service,
              onClick: _this5.oauthSignIn.bind(_this5, service)
            });
          });
        }
      }

      return indexBy(oauthButtons, 'id');
    }

    return oauthButtons;
  }();

  _proto.oauthSignIn = function () {
    function oauthSignIn(serviceName) {
      var _this6 = this;

      var user = this.props.user;
      var _this$state4 = this.state,
          formState = _this$state4.formState,
          waiting = _this$state4.waiting,
          onSubmitHook = _this$state4.onSubmitHook; //Thanks Josh Owens for this one.

      function capitalService() {
        return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
      }

      if (serviceName === 'meteor-developer') {
        serviceName = 'meteorDeveloperAccount';
      }

      var loginWithService = Meteor['loginWith' + capitalService()];
      var options = {}; // use default scope unless specified

      if (Accounts.ui._options.requestPermissions[serviceName]) options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
      if (Accounts.ui._options.requestOfflineToken[serviceName]) options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
      if (Accounts.ui._options.forceApprovalPrompt[serviceName]) options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
      this.clearMessages();
      var self = this;
      loginWithService(options, function (error) {
        onSubmitHook(error, formState);

        if (error) {
          _this6.showMessage("error.accounts." + error.reason || 'unknown_error');
        } else {
          _this6.setState({
            formState: STATES.PROFILE
          });

          _this6.clearDefaultFieldValues();

          loginResultCallback(function () {
            Meteor.setTimeout(function () {
              return _this6.state.onSignedInHook();
            }, 100);
          });
        }
      });
    }

    return oauthSignIn;
  }();

  _proto.signUp = function () {
    function signUp() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var _this$state5 = this.state,
          _this$state5$username = _this$state5.username,
          username = _this$state5$username === void 0 ? null : _this$state5$username,
          _this$state5$email = _this$state5.email,
          email = _this$state5$email === void 0 ? null : _this$state5$email,
          _this$state5$username2 = _this$state5.usernameOrEmail,
          usernameOrEmail = _this$state5$username2 === void 0 ? null : _this$state5$username2,
          password = _this$state5.password,
          formState = _this$state5.formState,
          onSubmitHook = _this$state5.onSubmitHook;
      var error = false;
      this.clearMessages();

      if (username !== null) {
        if (!this.validateField('username', username)) {
          if (this.state.formState == STATES.SIGN_UP) {
            this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
          }

          error = true;
        } else {
          options.username = username;
        }
      } else {
        if (['USERNAME_AND_EMAIL', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields()) && !this.validateField('username', username)) {
          if (this.state.formState == STATES.SIGN_UP) {
            this.state.onSubmitHook('error.accounts.usernameRequired', this.state.formState);
          }

          error = true;
        }
      }

      if (!this.validateField('email', email)) {
        error = true;
      } else {
        options.email = email;
      }

      if (['EMAIL_ONLY_NO_PASSWORD', 'USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
        // Generate a random password.
        options.password = Meteor.uuid();
      } else if (!this.validateField('password', password)) {
        onSubmitHook('Invalid password', formState);
        error = true;
      } else {
        options.password = password;
      }

      var SignUp = function (_options) {
        var _this7 = this;

        Accounts.createUser(_options, function (error) {
          if (error) {
            _this7.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');

            if (_this7.translate("error.accounts." + error.reason)) {
              onSubmitHook("error.accounts." + error.reason, formState);
            } else {
              onSubmitHook('unknown_error', formState);
            }
          } else {
            onSubmitHook(null, formState);

            _this7.setState({
              formState: STATES.PROFILE,
              password: null
            });

            var user = Accounts.user();
            loginResultCallback(_this7.state.onPostSignUpHook.bind(_this7, _options, user));

            _this7.clearDefaultFieldValues();
          }

          _this7.setState({
            waiting: false
          });
        });
      };

      if (!error) {
        this.setState({
          waiting: true
        }); // Allow for Promises to return.

        var promise = this.state.onPreSignUpHook(options);

        if (promise instanceof Promise) {
          promise.then(SignUp.bind(this, options));
        } else {
          SignUp(options);
        }
      }
    }

    return signUp;
  }();

  _proto.loginWithoutPassword = function () {
    function loginWithoutPassword() {
      var _this8 = this;

      var _this$state6 = this.state,
          _this$state6$email = _this$state6.email,
          email = _this$state6$email === void 0 ? '' : _this$state6$email,
          _this$state6$username = _this$state6.usernameOrEmail,
          usernameOrEmail = _this$state6$username === void 0 ? '' : _this$state6$username,
          waiting = _this$state6.waiting,
          formState = _this$state6.formState,
          onSubmitHook = _this$state6.onSubmitHook;

      if (waiting) {
        return;
      }

      if (this.validateField('email', email)) {
        this.setState({
          waiting: true
        });
        Accounts.loginWithoutPassword({
          email: email
        }, function (error) {
          if (error) {
            _this8.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');
          } else {
            _this8.showMessage(_this8.translate('info.emailSent'), 'success', 5000);

            _this8.clearDefaultFieldValues();
          }

          onSubmitHook(error, formState);

          _this8.setState({
            waiting: false
          });
        });
      } else if (this.validateField('username', usernameOrEmail)) {
        this.setState({
          waiting: true
        });
        Accounts.loginWithoutPassword({
          email: usernameOrEmail,
          username: usernameOrEmail
        }, function (error) {
          if (error) {
            _this8.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');
          } else {
            _this8.showMessage(_this8.translate('info.emailSent'), 'success', 5000);

            _this8.clearDefaultFieldValues();
          }

          onSubmitHook(error, formState);

          _this8.setState({
            waiting: false
          });
        });
      } else {
        var errMsg = null;

        if (['USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
          errMsg = this.translate('error.accounts.invalid_email');
        } else {
          errMsg = this.translate('error.accounts.invalid_email');
        }

        this.showMessage(errMsg, 'warning');
        onSubmitHook(errMsg, formState);
      }
    }

    return loginWithoutPassword;
  }();

  _proto.passwordReset = function () {
    function passwordReset() {
      var _this9 = this;

      var _this$state7 = this.state,
          _this$state7$email = _this$state7.email,
          email = _this$state7$email === void 0 ? '' : _this$state7$email,
          waiting = _this$state7.waiting,
          formState = _this$state7.formState,
          onSubmitHook = _this$state7.onSubmitHook;

      if (waiting) {
        return;
      }

      this.clearMessages();

      if (this.validateField('email', email)) {
        this.setState({
          waiting: true
        });
        Accounts.forgotPassword({
          email: email
        }, function (error) {
          if (error) {
            _this9.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');
          } else {
            _this9.showMessage(_this9.translate('info.emailSent'), 'success', 5000);

            _this9.clearDefaultFieldValues();
          }

          onSubmitHook(error, formState);

          _this9.setState({
            waiting: false
          });
        });
      }
    }

    return passwordReset;
  }();

  _proto.passwordChange = function () {
    function passwordChange() {
      var _this10 = this;

      var _this$state8 = this.state,
          password = _this$state8.password,
          newPassword = _this$state8.newPassword,
          formState = _this$state8.formState,
          onSubmitHook = _this$state8.onSubmitHook,
          onSignedInHook = _this$state8.onSignedInHook;

      if (!this.validateField('password', newPassword)) {
        onSubmitHook('err.minChar', formState);
        return;
      }

      var token = Accounts._loginButtonsSession.get('resetPasswordToken');

      if (!token) {
        token = Accounts._loginButtonsSession.get('enrollAccountToken');
      }

      if (token) {
        Accounts.resetPassword(token, newPassword, function (error) {
          if (error) {
            _this10.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');

            onSubmitHook(error, formState);
          } else {
            _this10.showMessage(_this10.translate('info.passwordChanged'), 'success', 5000);

            onSubmitHook(null, formState);

            _this10.setState({
              formState: STATES.PROFILE
            });

            Accounts._loginButtonsSession.set('resetPasswordToken', null);

            Accounts._loginButtonsSession.set('enrollAccountToken', null);

            onSignedInHook();
          }
        });
      } else {
        Accounts.changePassword(password, newPassword, function (error) {
          if (error) {
            _this10.showMessage("error.accounts." + error.reason || 'unknown_error', 'error');

            onSubmitHook(error, formState);
          } else {
            _this10.showMessage('info.passwordChanged', 'success', 5000);

            onSubmitHook(null, formState);

            _this10.setState({
              formState: STATES.PROFILE
            });

            _this10.clearDefaultFieldValues();
          }
        });
      }
    }

    return passwordChange;
  }();

  _proto.showMessage = function () {
    function showMessage(message, type, clearTimeout, field) {
      var _this11 = this;

      message = this.translate(message).trim();

      if (message) {
        this.setState(function (_ref) {
          var _ref$messages = _ref.messages,
              messages = _ref$messages === void 0 ? [] : _ref$messages;
          messages.push((0, _objectSpread2.default)({
            message: message,
            type: type
          }, field && {
            field: field
          }));
          return {
            messages: messages
          };
        });

        if (clearTimeout) {
          this.hideMessageTimout = setTimeout(function () {
            // Filter out the message that timed out.
            _this11.clearMessage(message);
          }, clearTimeout);
        }
      }
    }

    return showMessage;
  }();

  _proto.getMessageForField = function () {
    function getMessageForField(field) {
      var _this$state$messages = this.state.messages,
          messages = _this$state$messages === void 0 ? [] : _this$state$messages;
      return messages.find(function (_ref2) {
        var key = _ref2.field;
        return key === field;
      });
    }

    return getMessageForField;
  }();

  _proto.clearMessage = function () {
    function clearMessage(message) {
      if (message) {
        this.setState(function (_ref3) {
          var _ref3$messages = _ref3.messages,
              messages = _ref3$messages === void 0 ? [] : _ref3$messages;
          return {
            messages: messages.filter(function (_ref4) {
              var a = _ref4.message;
              return a !== message;
            })
          };
        });
      }
    }

    return clearMessage;
  }();

  _proto.clearMessages = function () {
    function clearMessages() {
      if (this.hideMessageTimout) {
        clearTimeout(this.hideMessageTimout);
      }

      this.setState({
        messages: []
      });
    }

    return clearMessages;
  }();

  _proto.componentWillMount = function () {
    function componentWillMount() {
      // XXX Check for backwards compatibility.
      if (Meteor.isClient) {
        var container = document.createElement('div');
        ReactDOM.render(React.createElement(Accounts.ui.Field, {
          message: "test"
        }), container);

        if (container.getElementsByClassName('message').length == 0) {
          // Found backwards compatibility issue with 1.3.x
          console.warn("Implementations of Accounts.ui.Field must render message in v1.2.11.\n          https://github.com/studiointeract/accounts-ui/#deprecations");
        }
      }
    }

    return componentWillMount;
  }();

  _proto.componentWillUnmount = function () {
    function componentWillUnmount() {
      if (this.hideMessageTimout) {
        clearTimeout(this.hideMessageTimout);
      }
    }

    return componentWillUnmount;
  }();

  _proto.render = function () {
    function render() {
      var _this12 = this;

      this.oauthButtons(); // Backwords compatibility with v1.2.x.

      var _this$state$messages2 = this.state.messages,
          messages = _this$state$messages2 === void 0 ? [] : _this$state$messages2;
      var message = {
        deprecated: true,
        message: messages.map(function (_ref5) {
          var message = _ref5.message;
          return message;
        }).join(', ')
      };
      return React.createElement(Accounts.ui.Form, (0, _extends2.default)({
        oauthServices: this.oauthButtons(),
        fields: this.fields(),
        buttons: this.buttons()
      }, this.state, {
        message: message,
        translate: function (text) {
          return _this12.translate(text);
        }
      }));
    }

    return render;
  }();

  return LoginForm;
}(Component);

LoginForm.propTypes = {
  formState: PropTypes.symbol,
  loginPath: PropTypes.string,
  signUpPath: PropTypes.string,
  resetPasswordPath: PropTypes.string,
  profilePath: PropTypes.string,
  changePasswordPath: PropTypes.string
};
LoginForm.defaultProps = {
  formState: null,
  loginPath: null,
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: null,
  changePasswordPath: null
};
Accounts.ui.LoginForm = LoginForm;
var LoginFormContainer = withTracker(function () {
  // Listen for the user to login/logout and the services list to the user.
  Meteor.subscribe('servicesList');
  return {
    user: Accounts.user()
  };
})(LoginForm);
Accounts.ui.LoginForm = LoginFormContainer;
module.exportDefault(LoginFormContainer);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/PasswordOrService.jsx                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  PasswordOrService: function () {
    return PasswordOrService;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
var PropTypes;
module.link("prop-types", {
  "default": function (v) {
    PropTypes = v;
  }
}, 1);
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 2);
var T9n;
module.link("meteor-accounts-t9n", {
  T9n: function (v) {
    T9n = v;
  }
}, 3);
var hasPasswordService;
module.link("../../helpers.js", {
  hasPasswordService: function (v) {
    hasPasswordService = v;
  }
}, 4);

var PasswordOrService =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(PasswordOrService, _React$Component);

  function PasswordOrService(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasPasswordService: hasPasswordService(),
      services: Object.keys(props.oauthServices).map(function (service) {
        return props.oauthServices[service].label;
      })
    };
    return _this;
  }

  var _proto = PasswordOrService.prototype;

  _proto.translate = function () {
    function translate(text) {
      if (this.props.translate) {
        return this.props.translate(text);
      }

      return T9n.get(text);
    }

    return translate;
  }();

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'password-or-service' : _this$props$className,
          _this$props$style = _this$props.style,
          style = _this$props$style === void 0 ? {} : _this$props$style;
      var _this$state = this.state,
          hasPasswordService = _this$state.hasPasswordService,
          services = _this$state.services;
      labels = services;

      if (services.length > 2) {
        labels = [];
      }

      if (hasPasswordService && services.length > 0) {
        return React.createElement("div", {
          style: style,
          className: className
        }, this.translate('orUse') + " " + labels.join(' / '));
      }

      return null;
    }

    return render;
  }();

  return PasswordOrService;
}(React.Component);

PasswordOrService.propTypes = {
  oauthServices: PropTypes.object
};
Accounts.ui.PasswordOrService = PasswordOrService;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialButtons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/SocialButtons.jsx                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

module.export({
  SocialButtons: function () {
    return SocialButtons;
  }
});
var React;
module.link("react", {
  "default": function (v) {
    React = v;
  }
}, 0);
module.link("./Button.jsx");
var Accounts;
module.link("meteor/accounts-base", {
  Accounts: function (v) {
    Accounts = v;
  }
}, 1);

var SocialButtons =
/*#__PURE__*/
function (_React$Component) {
  (0, _inheritsLoose2.default)(SocialButtons, _React$Component);

  function SocialButtons() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = SocialButtons.prototype;

  _proto.render = function () {
    function render() {
      var _this$props = this.props,
          _this$props$oauthServ = _this$props.oauthServices,
          oauthServices = _this$props$oauthServ === void 0 ? {} : _this$props$oauthServ,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? 'social-buttons' : _this$props$className;
      return React.createElement("div", {
        className: className
      }, Object.keys(oauthServices).map(function (id, i) {
        return React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, oauthServices[id], {
          key: i
        }));
      }));
    }

    return render;
  }();

  return SocialButtons;
}(React.Component);

Accounts.ui.SocialButtons = SocialButtons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/node_modules/meteor/epotek:accounts-ui/check-npm.js");
var exports = require("/node_modules/meteor/epotek:accounts-ui/main_client.js");

/* Exports */
Package._define("epotek:accounts-ui", exports);

})();
