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

/* Package-scope variables */
var serviceName, message, labels;

var require = meteorInstall({"node_modules":{"meteor":{"epotek:accounts-ui":{"check-npm.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/check-npm.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
//
// checkNpmVersions({
//   "react": ">=0.14.7 || ^15.0.0-rc.2",
//   "react-dom": ">=0.14.7 || ^15.0.0-rc.2",
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main_client.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/main_client.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  default: () => LoginForm,
  Accounts: () => Accounts,
  STATES: () => STATES
});
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
module.link("./imports/accounts_ui.js");
module.link("./imports/login_session.js");
let STATES;
module.link("./imports/helpers.js", {
  STATES(v) {
    STATES = v;
  }

}, 1);
module.link("./imports/api/client/loginWithoutPassword.js");
let LoginForm;
module.link("./imports/ui/components/LoginForm.jsx", {
  default(v) {
    LoginForm = v;
  }

}, 2);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"accounts_ui.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/accounts_ui.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let redirect, validatePassword, validateEmail, validateUsername;
module.link("./helpers.js", {
  redirect(v) {
    redirect = v;
  },

  validatePassword(v) {
    validatePassword = v;
  },

  validateEmail(v) {
    validateEmail = v;
  },

  validateUsername(v) {
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
  onSubmitHook: () => {},
  onPreSignUpHook: () => new Promise(resolve => resolve()),
  onPostSignUpHook: () => {},
  onEnrollAccountHook: () => redirect("".concat(Accounts.ui._options.loginPath)),
  onResetPasswordHook: () => redirect("".concat(Accounts.ui._options.loginPath)),
  onVerifyEmailHook: () => redirect("".concat(Accounts.ui._options.profilePath)),
  onSignedInHook: () => redirect("".concat(Accounts.ui._options.homeRoutePath)),
  onSignedOutHook: () => redirect("".concat(Accounts.ui._options.homeRoutePath)),
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
  const VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forbidClientAccountCreation', 'requireEmailVerification', 'minimumPasswordLength', 'loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath', 'onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook', 'onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook', 'validateField', 'emailPattern'];
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
    Object.keys(options.requestPermissions).forEach(service => {
      const scope = options.requestPermissions[service];

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
    Object.keys(options.requestOfflineToken).forEach(service => {
      const value = options.requestOfflineToken[service];
      if (service !== 'google') throw new Error('Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.');

      if (Accounts.ui._options.requestOfflineToken[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
      } else {
        Accounts.ui._options.requestOfflineToken[service] = value;
      }
    });
  } // Deal with `forceApprovalPrompt`


  if (options.forceApprovalPrompt) {
    Object.keys(options.forceApprovalPrompt).forEach(service => {
      const value = options.forceApprovalPrompt[service];
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
    let hook = _arr[_i];

    if (options[hook]) {
      if (typeof options[hook] != 'function') {
        throw new Error("Accounts.ui.config: \"".concat(hook, "\" not a function"));
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // Deal with pattern.


  var _arr2 = ['emailPattern'];

  for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
    let hook = _arr2[_i2];

    if (options[hook]) {
      if (!(options[hook] instanceof RegExp)) {
        throw new Error("Accounts.ui.config: \"".concat(hook, "\" not a Regular Expression"));
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // deal with the paths.


  var _arr3 = ['loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath'];

  for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
    let path = _arr3[_i3];

    if (typeof options[path] !== 'undefined') {
      if (options[path] !== null && typeof options[path] !== 'string') {
        throw new Error("Accounts.ui.config: ".concat(path, " is not a string or null"));
      } else {
        Accounts.ui._options[path] = options[path];
      }
    }
  } // deal with redirect hooks.


  var _arr4 = ['onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook'];

  for (var _i4 = 0; _i4 < _arr4.length; _i4++) {
    let hook = _arr4[_i4];

    if (options[hook]) {
      if (typeof options[hook] == 'function') {
        Accounts.ui._options[hook] = options[hook];
      } else if (typeof options[hook] == 'string') {
        Accounts.ui._options[hook] = () => redirect(options[hook]);
      } else {
        throw new Error("Accounts.ui.config: \"".concat(hook, "\" not a function or an absolute or relative path"));
      }
    }
  }
};

module.exportDefault(Accounts);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/helpers.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  loginButtonsSession: () => loginButtonsSession,
  STATES: () => STATES,
  getLoginServices: () => getLoginServices,
  hasPasswordService: () => hasPasswordService,
  loginResultCallback: () => loginResultCallback,
  passwordSignupFields: () => passwordSignupFields,
  validateEmail: () => validateEmail,
  validatePassword: () => validatePassword,
  validateUsername: () => validateUsername,
  redirect: () => redirect,
  capitalize: () => capitalize
});
let browserHistory;

try {
  browserHistory = require('react-router').browserHistory;
} catch (e) {}

const loginButtonsSession = Accounts._loginButtonsSession;
const STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PROFILE: Symbol('PROFILE'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET'),
  ENROLL_ACCOUNT: Symbol('ENROLL_ACCOUNT')
};

function getLoginServices() {
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : []; // Be equally kind to all login services. This also preserves
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
  let password = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let showMessage = arguments.length > 1 ? arguments[1] : undefined;
  let clearMessage = arguments.length > 2 ? arguments[2] : undefined;

  if (password.length >= Accounts.ui._options.minimumPasswordLength) {
    return true;
  } else {
    // const errMsg = T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength);
    const errMsg = 'error.minChar';
    showMessage(errMsg, 'warning', false, 'password');
    return false;
  }
}

function validateUsername(username, showMessage, clearMessage, formState) {
  if (username) {
    return true;
  } else {
    const fieldName = passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP ? 'username' : 'usernameOrEmail';
    showMessage('error.usernameRequired', 'warning', false, fieldName);
    return false;
  }
}

function redirect(redirect) {
  if (Meteor.isClient) {
    if (window.history) {
      // Run after all app specific redirects, i.e. to the login screen.
      Meteor.setTimeout(() => {
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
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/login_session.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  validateKey: () => validateKey,
  KEY_PREFIX: () => KEY_PREFIX
});
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let STATES, loginResultCallback, getLoginServices;
module.link("./helpers.js", {
  STATES(v) {
    STATES = v;
  },

  loginResultCallback(v) {
    loginResultCallback = v;
  },

  getLoginServices(v) {
    getLoginServices = v;
  }

}, 1);
const VALID_KEYS = ['dropdownVisible', // XXX consider replacing these with one key that has an enum for values.
'inSignupFlow', 'inForgotPasswordFlow', 'inChangePasswordFlow', 'inMessageOnlyFlow', 'errorMessage', 'infoMessage', // dialogs with messages (info and error)
'resetPasswordToken', 'enrollAccountToken', 'justVerifiedEmail', 'justResetPassword', 'configureLoginServiceDialogVisible', 'configureLoginServiceDialogServiceName', 'configureLoginServiceDialogSaveDisabled', 'configureOnDesktopVisible'];

const validateKey = function (key) {
  if (!VALID_KEYS.includes(key)) throw new Error('Invalid key in loginButtonsSession: ' + key);
};

const KEY_PREFIX = 'Meteor.loginButtons.';
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
    if (getLoginServices().map((_ref) => {
      let {
        name
      } = _ref;
      return name;
    }).includes(attemptInfo.type)) loginResultCallback(attemptInfo.type, attemptInfo.error);
  });
  let doneCallback;
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"client":{"loginWithoutPassword.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/api/client/loginWithoutPassword.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"Button.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/Button.jsx                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Button: () => Button
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let Link;

try {
  Link = require('react-router').Link;
} catch (e) {}

class Button extends React.Component {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      className,
      onClick
    } = this.props;

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

}

Button.propTypes = {
  onClick: PropTypes.func
};
Accounts.ui.Button = Button;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Buttons.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/Buttons.jsx                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  Buttons: () => Buttons
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
module.link("./Button.jsx");
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class Buttons extends React.Component {
  render() {
    let {
      buttons = {},
      className = 'buttons'
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(buttons).map((id, i) => React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, buttons[id], {
      key: i
    }))));
  }

}

Accounts.ui.Buttons = Buttons;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/Field.jsx                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Field: () => Field
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mount: true
    };
  }

  triggerUpdate() {
    // Trigger an onChange on inital load, to support browser prefilled values.
    const {
      onChange
    } = this.props;

    if (this.input && onChange) {
      onChange({
        target: {
          value: this.input.value
        }
      });
    }
  }

  componentDidMount() {
    this.triggerUpdate();
  }

  componentDidUpdate(prevProps) {
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

  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className = 'field',
      defaultValue = '',
      message
    } = this.props;
    const {
      mount = true
    } = this.state;

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
      ref: ref => this.input = ref,
      type: type,
      onChange: onChange,
      placeholder: hint,
      defaultValue: defaultValue
    }), message && React.createElement("span", {
      className: ['message', message.type].join(' ').trim()
    }, message.message)) : null;
  }

}

Field.propTypes = {
  onChange: PropTypes.func
};
Accounts.ui.Field = Field;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Fields.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/Fields.jsx                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  Fields: () => Fields
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
module.link("./Field.jsx");

class Fields extends React.Component {
  render() {
    let {
      fields = {},
      className = 'fields'
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(fields).map((id, i) => React.createElement(Accounts.ui.Field, (0, _extends2.default)({}, fields[id], {
      key: i
    }))));
  }

}

Accounts.ui.Fields = Fields;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/Form.jsx                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Form: () => Form
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 3);
module.link("./Fields.jsx");
module.link("./Buttons.jsx");
module.link("./FormMessage.jsx");
module.link("./PasswordOrService.jsx");
module.link("./SocialButtons.jsx");
module.link("./FormMessages.jsx");

class Form extends React.Component {
  componentDidMount() {
    let form = this.form;

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
      });
    }
  }

  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      messages,
      translate,
      ready = true,
      className
    } = this.props;
    return React.createElement("form", {
      ref: ref => this.form = ref,
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

}

Form.propTypes = {
  oauthServices: PropTypes.object,
  fields: PropTypes.object.isRequired,
  buttons: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  error: PropTypes.string,
  ready: PropTypes.bool
};
Accounts.ui.Form = Form;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/FormMessage.jsx                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  FormMessage: () => FormMessage
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

function isObject(obj) {
  return obj === Object(obj);
}

class FormMessage extends React.Component {
  render() {
    let {
      message,
      type,
      className = 'message',
      style = {},
      deprecated
    } = this.props; // XXX Check for deprecations.

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

}

Accounts.ui.FormMessage = FormMessage;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/FormMessages.jsx                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  FormMessages: () => FormMessages
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class FormMessages extends Component {
  render() {
    const {
      messages = [],
      className = 'messages',
      style = {}
    } = this.props;
    return messages.length > 0 && React.createElement("div", {
      className: "messages"
    }, messages.filter(message => !('field' in message)).map((_ref, i) => {
      let {
        message,
        type
      } = _ref;
      return React.createElement(Accounts.ui.FormMessage, {
        message: message,
        type: type,
        key: i
      });
    }));
  }

}

Accounts.ui.FormMessages = FormMessages;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LoginForm.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/LoginForm.jsx                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 3);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 4);
let T9n;
module.link("meteor-accounts-t9n", {
  T9n(v) {
    T9n = v;
  }

}, 5);
let KEY_PREFIX;
module.link("../../login_session.js", {
  KEY_PREFIX(v) {
    KEY_PREFIX = v;
  }

}, 6);
module.link("./Form.jsx");
let STATES, passwordSignupFields, validateEmail, validatePassword, validateUsername, loginResultCallback, getLoginServices, hasPasswordService, capitalize;
module.link("../../helpers.js", {
  STATES(v) {
    STATES = v;
  },

  passwordSignupFields(v) {
    passwordSignupFields = v;
  },

  validateEmail(v) {
    validateEmail = v;
  },

  validatePassword(v) {
    validatePassword = v;
  },

  validateUsername(v) {
    validateUsername = v;
  },

  loginResultCallback(v) {
    loginResultCallback = v;
  },

  getLoginServices(v) {
    getLoginServices = v;
  },

  hasPasswordService(v) {
    hasPasswordService = v;
  },

  capitalize(v) {
    capitalize = v;
  }

}, 7);

function indexBy(array, key) {
  const result = {};
  array.forEach(function (obj) {
    result[obj[key]] = obj;
  });
  return result;
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    let {
      formState,
      loginPath,
      signUpPath,
      resetPasswordPath,
      profilePath,
      changePasswordPath
    } = props;

    if (formState === STATES.SIGN_IN && Package['accounts-password']) {
      console.warn('Do not force the state to SIGN_IN on Accounts.ui.LoginForm, it will make it impossible to reset password in your app, this state is also the default state if logged out, so no need to force it.');
    } // Set inital state.


    this.state = {
      messages: [],
      waiting: true,
      formState: formState ? formState : Accounts.user() ? STATES.PROFILE : STATES.SIGN_IN,
      onSubmitHook: props.onSubmitHook || Accounts.ui._options.onSubmitHook,
      onSignedInHook: props.onSignedInHook || Accounts.ui._options.onSignedInHook,
      onSignedOutHook: props.onSignedOutHook || Accounts.ui._options.onSignedOutHook,
      onPreSignUpHook: props.onPreSignUpHook || Accounts.ui._options.onPreSignUpHook,
      onPostSignUpHook: props.onPostSignUpHook || Accounts.ui._options.onPostSignUpHook
    };
    this.translate = this.translate.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => ({
      waiting: false,
      ready: true
    }));
    let changeState = Session.get(KEY_PREFIX + 'state');

    switch (changeState) {
      case 'enrollAccountToken':
        this.setState(prevState => ({
          formState: STATES.ENROLL_ACCOUNT
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;

      case 'resetPasswordToken':
        this.setState(prevState => ({
          formState: STATES.PASSWORD_CHANGE
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;

      case 'justVerifiedEmail':
        this.setState(prevState => ({
          formState: STATES.PROFILE
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;
    } // Add default field values once the form did mount on the client


    this.setState(prevState => (0, _objectSpread2.default)({}, this.getDefaultFieldValues()));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.formState && nextProps.formState !== this.state.formState) {
      this.setState((0, _objectSpread2.default)({
        formState: nextProps.formState
      }, this.getDefaultFieldValues()));
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.user !== !this.props.user) {
      this.setState({
        formState: this.props.user ? STATES.PROFILE : STATES.SIGN_IN
      });
    }
  }

  translate(text) {
    // if (this.props.t) {
    //   return this.props.t(text);
    // }
    return T9n.get(text);
  }

  validateField(field, value) {
    const {
      formState
    } = this.state;

    switch (field) {
      case 'email':
        return validateEmail(value, this.showMessage.bind(this), this.clearMessage.bind(this));

      case 'password':
        return validatePassword(value, this.showMessage.bind(this), this.clearMessage.bind(this));

      case 'username':
        return validateUsername(value, this.showMessage.bind(this), this.clearMessage.bind(this), formState);
    }
  }

  getUsernameOrEmailField() {
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

  getUsernameField() {
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

  getEmailField() {
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

  getPasswordField() {
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

  getSetPasswordField() {
    return {
      id: 'newPassword',
      hint: this.translate('enterPassword'),
      label: this.translate('choosePassword'),
      type: 'password',
      required: true,
      onChange: this.handleChange.bind(this, 'newPassword')
    };
  }

  getNewPasswordField() {
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

  handleChange(field, evt) {
    let value = evt.target.value;

    switch (field) {
      case 'password':
        break;

      default:
        value = value.trim();
        break;
    }

    this.setState({
      [field]: value
    });
    this.setDefaultFieldValues({
      [field]: value
    });
  }

  fields() {
    const loginFields = [];
    const {
      formState
    } = this.state;

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

  buttons() {
    const {
      loginPath = Accounts.ui._options.loginPath,
      signUpPath = Accounts.ui._options.signUpPath,
      resetPasswordPath = Accounts.ui._options.resetPasswordPath,
      changePasswordPath = Accounts.ui._options.changePasswordPath,
      profilePath = Accounts.ui._options.profilePath
    } = this.props;
    const {
      user
    } = this.props;
    const {
      formState,
      waiting
    } = this.state;
    let loginButtons = [];

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


    loginButtons.sort((a, b) => {
      return (b.type == 'submit' && a.type != undefined) - (a.type == 'submit' && b.type != undefined);
    });
    return indexBy(loginButtons, 'id');
  }

  showSignInLink() {
    return this.state.formState == STATES.SIGN_IN && Package['accounts-password'];
  }

  showPasswordChangeForm() {
    return Package['accounts-password'] && this.state.formState == STATES.PASSWORD_CHANGE;
  }

  showEnrollAccountForm() {
    return Package['accounts-password'] && this.state.formState == STATES.ENROLL_ACCOUNT;
  }

  showCreateAccountLink() {
    return this.state.formState == STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation && Package['accounts-password'];
  }

  showForgotPasswordLink() {
    return !this.props.user && this.state.formState == STATES.SIGN_IN && ['USERNAME_AND_EMAIL', 'USERNAME_AND_OPTIONAL_EMAIL', 'EMAIL_ONLY'].includes(passwordSignupFields());
  }
  /**
   * Helper to store field values while using the form.
   */


  setDefaultFieldValues(defaults) {
    if (typeof defaults !== 'object') {
      throw new Error('Argument to setDefaultFieldValues is not of type object');
    } else if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem('accounts_ui', JSON.stringify((0, _objectSpread2.default)({
        passwordSignupFields: passwordSignupFields()
      }, this.getDefaultFieldValues(), defaults)));
    }
  }
  /**
   * Helper to get field values when switching states in the form.
   */


  getDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);

      if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {
        return defaultFieldValues;
      }
    }
  }
  /**
   * Helper to clear field values when signing in, up or out.
   */


  clearDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.removeItem('accounts_ui');
    }
  }

  switchToSignUp(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.SIGN_UP
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToSignIn(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.SIGN_IN
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToPasswordReset(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.PASSWORD_RESET
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToChangePassword(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.PASSWORD_CHANGE
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToSignOut(event) {
    event.preventDefault();
    this.setState({
      formState: STATES.PROFILE
    });
    this.clearMessages();
  }

  cancelResetPassword(event) {
    event.preventDefault();

    Accounts._loginButtonsSession.set('resetPasswordToken', null);

    this.setState({
      formState: STATES.SIGN_IN,
      messages: []
    });
  }

  signOut() {
    Meteor.logout(() => {
      this.setState({
        formState: STATES.SIGN_IN,
        password: null
      });
      this.state.onSignedOutHook();
      this.clearMessages();
      this.clearDefaultFieldValues();
    });
  }

  signIn() {
    const {
      username = null,
      email = null,
      usernameOrEmail = null,
      password,
      formState,
      onSubmitHook
    } = this.state;
    let error = false;
    let loginSelector;
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
            email
          };
        }
      }
    }

    if (!['EMAIL_ONLY_NO_PASSWORD'].includes(passwordSignupFields()) && !this.validateField('password', password)) {
      error = true;
    }

    if (!error) {
      Meteor.loginWithPassword(loginSelector, password, (error, result) => {
        onSubmitHook(error, formState);

        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
        } else {
          loginResultCallback(() => this.state.onSignedInHook());
          this.setState({
            formState: STATES.PROFILE,
            password: null
          });
          this.clearDefaultFieldValues();
        }
      });
    }
  }

  oauthButtons() {
    const {
      formState,
      waiting
    } = this.state;
    let oauthButtons = [];

    if (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) {
      if (Accounts.oauth) {
        Accounts.oauth.serviceNames().map(service => {
          oauthButtons.push({
            id: service,
            label: capitalize(service),
            disabled: waiting,
            type: 'button',
            className: "btn-".concat(service, " ").concat(service),
            onClick: this.oauthSignIn.bind(this, service)
          });
        });
      }
    }

    return indexBy(oauthButtons, 'id');
  }

  oauthSignIn(serviceName) {
    const {
      user
    } = this.props;
    const {
      formState,
      waiting,
      onSubmitHook
    } = this.state; //Thanks Josh Owens for this one.

    function capitalService() {
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }

    if (serviceName === 'meteor-developer') {
      serviceName = 'meteorDeveloperAccount';
    }

    const loginWithService = Meteor['loginWith' + capitalService()];
    let options = {}; // use default scope unless specified

    if (Accounts.ui._options.requestPermissions[serviceName]) options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    if (Accounts.ui._options.requestOfflineToken[serviceName]) options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    if (Accounts.ui._options.forceApprovalPrompt[serviceName]) options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
    this.clearMessages();
    const self = this;
    loginWithService(options, error => {
      onSubmitHook(error, formState);

      if (error) {
        this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error');
      } else {
        this.setState({
          formState: STATES.PROFILE
        });
        this.clearDefaultFieldValues();
        loginResultCallback(() => {
          Meteor.setTimeout(() => this.state.onSignedInHook(), 100);
        });
      }
    });
  }

  signUp() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    const {
      username = null,
      email = null,
      usernameOrEmail = null,
      password,
      formState,
      onSubmitHook
    } = this.state;
    let error = false;
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

    const SignUp = function (_options) {
      Accounts.createUser(_options, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');

          if (this.translate("error.accounts.".concat(error.reason))) {
            onSubmitHook("error.accounts.".concat(error.reason), formState);
          } else {
            onSubmitHook('unknown_error', formState);
          }
        } else {
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE,
            password: null
          });
          let user = Accounts.user();
          loginResultCallback(this.state.onPostSignUpHook.bind(this, _options, user));
          this.clearDefaultFieldValues();
        }

        this.setState({
          waiting: false
        });
      });
    };

    if (!error) {
      this.setState({
        waiting: true
      }); // Allow for Promises to return.

      let promise = this.state.onPreSignUpHook(options);

      if (promise instanceof Promise) {
        promise.then(SignUp.bind(this, options));
      } else {
        SignUp(options);
      }
    }
  }

  loginWithoutPassword() {
    const {
      email = '',
      usernameOrEmail = '',
      waiting,
      formState,
      onSubmitHook
    } = this.state;

    if (waiting) {
      return;
    }

    if (this.validateField('email', email)) {
      this.setState({
        waiting: true
      });
      Accounts.loginWithoutPassword({
        email: email
      }, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
        } else {
          this.showMessage(this.translate('info.emailSent'), 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
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
      }, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
        } else {
          this.showMessage(this.translate('info.emailSent'), 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    } else {
      let errMsg = null;

      if (['USERNAME_AND_EMAIL_NO_PASSWORD'].includes(passwordSignupFields())) {
        errMsg = this.translate('error.accounts.invalid_email');
      } else {
        errMsg = this.translate('error.accounts.invalid_email');
      }

      this.showMessage(errMsg, 'warning');
      onSubmitHook(errMsg, formState);
    }
  }

  passwordReset() {
    const {
      email = '',
      waiting,
      formState,
      onSubmitHook
    } = this.state;

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
      }, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
        } else {
          this.showMessage(this.translate('info.emailSent'), 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    }
  }

  passwordChange() {
    const {
      password,
      newPassword,
      formState,
      onSubmitHook,
      onSignedInHook
    } = this.state;

    if (!this.validateField('password', newPassword)) {
      onSubmitHook('err.minChar', formState);
      return;
    }

    let token = Accounts._loginButtonsSession.get('resetPasswordToken');

    if (!token) {
      token = Accounts._loginButtonsSession.get('enrollAccountToken');
    }

    if (token) {
      Accounts.resetPassword(token, newPassword, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage(this.translate('info.passwordChanged'), 'success', 5000);
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE
          });

          Accounts._loginButtonsSession.set('resetPasswordToken', null);

          Accounts._loginButtonsSession.set('enrollAccountToken', null);

          onSignedInHook();
        }
      });
    } else {
      Accounts.changePassword(password, newPassword, error => {
        if (error) {
          this.showMessage("error.accounts.".concat(error.reason) || 'unknown_error', 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage('info.passwordChanged', 'success', 5000);
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE
          });
          this.clearDefaultFieldValues();
        }
      });
    }
  }

  showMessage(message, type, clearTimeout, field) {
    message = this.translate(message).trim();

    if (message) {
      this.setState((_ref) => {
        let {
          messages = []
        } = _ref;
        messages.push((0, _objectSpread2.default)({
          message,
          type
        }, field && {
          field
        }));
        return {
          messages
        };
      });

      if (clearTimeout) {
        this.hideMessageTimout = setTimeout(() => {
          // Filter out the message that timed out.
          this.clearMessage(message);
        }, clearTimeout);
      }
    }
  }

  getMessageForField(field) {
    const {
      messages = []
    } = this.state;
    return messages.find((_ref2) => {
      let {
        field: key
      } = _ref2;
      return key === field;
    });
  }

  clearMessage(message) {
    if (message) {
      this.setState((_ref3) => {
        let {
          messages = []
        } = _ref3;
        return {
          messages: messages.filter((_ref4) => {
            let {
              message: a
            } = _ref4;
            return a !== message;
          })
        };
      });
    }
  }

  clearMessages() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }

    this.setState({
      messages: []
    });
  }

  componentWillMount() {
    // XXX Check for backwards compatibility.
    if (Meteor.isClient) {
      const container = document.createElement('div');
      ReactDOM.render(React.createElement(Accounts.ui.Field, {
        message: "test"
      }), container);

      if (container.getElementsByClassName('message').length == 0) {
        // Found backwards compatibility issue with 1.3.x
        console.warn("Implementations of Accounts.ui.Field must render message in v1.2.11.\n          https://github.com/studiointeract/accounts-ui/#deprecations");
      }
    }
  }

  componentWillUnmount() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }
  }

  render() {
    this.oauthButtons(); // Backwords compatibility with v1.2.x.

    const {
      messages = []
    } = this.state;
    const message = {
      deprecated: true,
      message: messages.map((_ref5) => {
        let {
          message
        } = _ref5;
        return message;
      }).join(', ')
    };
    return React.createElement(Accounts.ui.Form, (0, _extends2.default)({
      oauthServices: this.oauthButtons(),
      fields: this.fields(),
      buttons: this.buttons()
    }, this.state, {
      message: message,
      translate: text => this.translate(text)
    }));
  }

}

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
const LoginFormContainer = withTracker(() => {
  // Listen for the user to login/logout and the services list to the user.
  Meteor.subscribe('servicesList');
  return {
    user: Accounts.user()
  };
})(LoginForm);
Accounts.ui.LoginForm = LoginFormContainer;
module.exportDefault(LoginFormContainer);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/PasswordOrService.jsx                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  PasswordOrService: () => PasswordOrService
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let T9n;
module.link("meteor-accounts-t9n", {
  T9n(v) {
    T9n = v;
  }

}, 3);
let hasPasswordService;
module.link("../../helpers.js", {
  hasPasswordService(v) {
    hasPasswordService = v;
  }

}, 4);

class PasswordOrService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPasswordService: hasPasswordService(),
      services: Object.keys(props.oauthServices).map(service => {
        return props.oauthServices[service].label;
      })
    };
  }

  translate(text) {
    if (this.props.translate) {
      return this.props.translate(text);
    }

    return T9n.get(text);
  }

  render() {
    let {
      className = 'password-or-service',
      style = {}
    } = this.props;
    let {
      hasPasswordService,
      services
    } = this.state;
    labels = services;

    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return React.createElement("div", {
        style: style,
        className: className
      }, "".concat(this.translate('orUse'), " ").concat(labels.join(' / ')));
    }

    return null;
  }

}

PasswordOrService.propTypes = {
  oauthServices: PropTypes.object
};
Accounts.ui.PasswordOrService = PasswordOrService;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialButtons.jsx":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/epotek_accounts-ui/imports/ui/components/SocialButtons.jsx                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  SocialButtons: () => SocialButtons
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
module.link("./Button.jsx");
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class SocialButtons extends React.Component {
  render() {
    let {
      oauthServices = {},
      className = 'social-buttons'
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(oauthServices).map((id, i) => {
      return React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, oauthServices[id], {
        key: i
      }));
    }));
  }

}

Accounts.ui.SocialButtons = SocialButtons;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
