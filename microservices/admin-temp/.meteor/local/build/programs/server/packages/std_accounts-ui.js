(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var serviceName, message, labels;

var require = meteorInstall({"node_modules":{"meteor":{"std:accounts-ui":{"check-npm.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/check-npm.js                                                                               //
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

},"main_server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/main_server.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => LoginForm,
  Accounts: () => Accounts,
  STATES: () => STATES
});
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
module.watch(require("./imports/accounts_ui.js"));
module.watch(require("./imports/login_session.js"));
let redirect, STATES;
module.watch(require("./imports/helpers.js"), {
  redirect(v) {
    redirect = v;
  },

  STATES(v) {
    STATES = v;
  }

}, 1);
module.watch(require("./imports/api/server/loginWithoutPassword.js"));
module.watch(require("./imports/api/server/servicesListPublication.js"));
let LoginForm;
module.watch(require("./imports/ui/components/LoginForm.jsx"), {
  default(v) {
    LoginForm = v;
  }

}, 2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"accounts_ui.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/accounts_ui.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let redirect, validatePassword, validateEmail, validateUsername;
module.watch(require("./helpers.js"), {
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
 */Accounts.ui = {};
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
  onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  onSignedInHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  onSignedOutHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  emailPattern: new RegExp('[^@]+@[^@\.]{2,}\.[^\.@]+')
}; /**
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
    if (!VALID_KEYS.includes(key)) throw new Error("Accounts.ui.config: Invalid key: " + key);
  }); // Deal with `passwordSignupFields`

  if (options.passwordSignupFields) {
    if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
    } else {
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }
  } // Deal with `requestPermissions`


  if (options.requestPermissions) {
    Object.keys(options.requestPermissions).forEach(service => {
      const score = options.requestPermissions[service];

      if (Accounts.ui._options.requestPermissions[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
      } else if (!(scope instanceof Array)) {
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
      } else {
        Accounts.ui._options.requestPermissions[service] = scope;
      }
    });
  } // Deal with `requestOfflineToken`


  if (options.requestOfflineToken) {
    Object.keys(options.requestOfflineToken).forEach(service => {
      const value = options.requestOfflineToken[service];
      if (service !== 'google') throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");

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
      if (service !== 'google') throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");

      if (Accounts.ui._options.forceApprovalPrompt[service]) {
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
      } else {
        Accounts.ui._options.forceApprovalPrompt[service] = value;
      }
    });
  } // Deal with `requireEmailVerification`


  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification != 'boolean') {
      throw new Error(`Accounts.ui.config: "requireEmailVerification" not a boolean`);
    } else {
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;
    }
  } // Deal with `minimumPasswordLength`


  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength != 'number') {
      throw new Error(`Accounts.ui.config: "minimumPasswordLength" not a number`);
    } else {
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  } // Deal with the hooks.


  for (let hook of ['onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook']) {
    if (options[hook]) {
      if (typeof options[hook] != 'function') {
        throw new Error(`Accounts.ui.config: "${hook}" not a function`);
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // Deal with pattern.


  for (let hook of ['emailPattern']) {
    if (options[hook]) {
      if (!(options[hook] instanceof RegExp)) {
        throw new Error(`Accounts.ui.config: "${hook}" not a Regular Expression`);
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // deal with the paths.


  for (let path of ['loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath']) {
    if (typeof options[path] !== 'undefined') {
      if (options[path] !== null && typeof options[path] !== 'string') {
        throw new Error(`Accounts.ui.config: ${path} is not a string or null`);
      } else {
        Accounts.ui._options[path] = options[path];
      }
    }
  } // deal with redirect hooks.


  for (let hook of ['onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook']) {
    if (options[hook]) {
      if (typeof options[hook] == 'function') {
        Accounts.ui._options[hook] = options[hook];
      } else if (typeof options[hook] == 'string') {
        Accounts.ui._options[hook] = () => redirect(options[hook]);
      } else {
        throw new Error(`Accounts.ui.config: "${hook}" not a function or an absolute or relative path`);
      }
    }
  }
};

module.exportDefault(Accounts);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/helpers.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

; // Export getLoginServices using old style globals for accounts-base which
// requires it.

this.getLoginServices = getLoginServices;

function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
}

;

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

;

function passwordSignupFields() {
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY_NO_PASSWORD";
}

;

function validateEmail(email, showMessage, clearMessage) {
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '') {
    return true;
  }

  if (Accounts.ui._options.emailPattern.test(email)) {
    return true;
  } else if (!email || email.length === 0) {
    showMessage("error.emailRequired", 'warning', false, 'email');
    return false;
  } else {
    showMessage("error.accounts.Invalid email", 'warning', false, 'email');
    return false;
  }
}

function validatePassword(password = '', showMessage, clearMessage) {
  if (password.length >= Accounts.ui._options.minimumPasswordLength) {
    return true;
  } else {
    // const errMsg = T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength);
    const errMsg = "error.minChar";
    showMessage(errMsg, 'warning', false, 'password');
    return false;
  }
}

;

function validateUsername(username, showMessage, clearMessage, formState) {
  if (username) {
    return true;
  } else {
    const fieldName = passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP ? 'username' : 'usernameOrEmail';
    showMessage("error.usernameRequired", 'warning', false, fieldName);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/login_session.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  validateKey: () => validateKey,
  KEY_PREFIX: () => KEY_PREFIX
});
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let STATES, loginResultCallback, getLoginServices;
module.watch(require("./helpers.js"), {
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
  if (!VALID_KEYS.includes(key)) throw new Error("Invalid key in loginButtonsSession: " + key);
};

const KEY_PREFIX = "Meteor.loginButtons.";
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
    if (getLoginServices().map(({
      name
    }) => name).includes(attemptInfo.type)) loginResultCallback(attemptInfo.type, attemptInfo.error);
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"server":{"loginWithoutPassword.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/api/server/loginWithoutPassword.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
///
/// LOGIN WITHOUT PASSWORD
///
// Method called by a user to request a password reset email. This is
// the start of the reset process.
Meteor.methods({
  loginWithoutPassword: function ({
    email,
    username = null
  }) {
    if (username !== null) {
      check(username, String);
      var user = Meteor.users.findOne({
        $or: [{
          "username": username,
          "emails.address": {
            $exists: 1
          }
        }, {
          "emails.address": email
        }]
      });
      if (!user) throw new Meteor.Error(403, "User not found");
      email = user.emails[0].address;
    } else {
      check(email, String);
      var user = Meteor.users.findOne({
        "emails.address": email
      });
      if (!user) throw new Meteor.Error(403, "User not found");
    }

    if (Accounts.ui._options.requireEmailVerification) {
      if (!user.emails[0].verified) {
        throw new Meteor.Error(403, "Email not verified");
      }
    }

    Accounts.sendLoginEmail(user._id, email);
  }
}); /**
     * @summary Send an email with a link the user can use verify their email address.
     * @locus Server
     * @param {String} userId The id of the user to send email to.
     * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
     */

Accounts.sendLoginEmail = function (userId, address) {
  // XXX Also generate a link using which someone can delete this
  // account if they own said address but weren't those who created
  // this account.
  // Make sure the user exists, and address is one of their addresses.
  var user = Meteor.users.findOne(userId);
  if (!user) throw new Error("Can't find user"); // pick the first unverified address if we weren't passed an address.

  if (!address) {
    var email = (user.emails || []).find(({
      verified
    }) => !verified);
    address = (email || {}).address;
  } // make sure we have a valid address


  if (!address || !(user.emails || []).map(({
    address
  }) => address).includes(address)) throw new Error("No such email address for user.");
  var tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()
  };
  Meteor.users.update({
    _id: userId
  }, {
    $push: {
      'services.email.verificationTokens': tokenRecord
    }
  }); // before passing to template, update user object with new token

  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }

  user.services.email.verificationTokens.push(tokenRecord);
  var loginUrl = Accounts.urls.verifyEmail(tokenRecord.token);
  var options = {
    to: address,
    from: Accounts.emailTemplates.loginNoPassword.from ? Accounts.emailTemplates.loginNoPassword.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.loginNoPassword.subject(user)
  };

  if (typeof Accounts.emailTemplates.loginNoPassword.text === 'function') {
    options.text = Accounts.emailTemplates.loginNoPassword.text(user, loginUrl);
  }

  if (typeof Accounts.emailTemplates.loginNoPassword.html === 'function') options.html = Accounts.emailTemplates.loginNoPassword.html(user, loginUrl);

  if (typeof Accounts.emailTemplates.headers === 'object') {
    options.headers = Accounts.emailTemplates.headers;
  }

  Email.send(options);
}; // Check for installed accounts-password dependency.


if (Accounts.emailTemplates) {
  Accounts.emailTemplates.loginNoPassword = {
    subject: function (user) {
      return "Login on " + Accounts.emailTemplates.siteName;
    },
    text: function (user, url) {
      var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";
      return `${greeting}
To login, simply click the link below.
${url}
Thanks.
`;
    }
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"servicesListPublication.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/api/server/servicesListPublication.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let getLoginServices;
module.watch(require("../../helpers.js"), {
  getLoginServices(v) {
    getLoginServices = v;
  }

}, 1);
Meteor.publish('servicesList', function () {
  let services = getLoginServices();

  if (Package['accounts-password']) {
    services.push({
      name: 'password'
    });
  }

  let fields = {}; // Publish the existing services for a user, only name or nothing else.

  services.forEach(service => fields[`services.${service.name}.name`] = 1);
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: fields
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"Button.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Button.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Button: () => Button
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.watch(require("meteor/accounts-base"), {
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
        return React.createElement(
          Link,
          {
            to: href,
            className: className
          },
          label
        );
      } else {
        return React.createElement(
          "a",
          {
            href: href,
            className: className,
            onClick: onClick
          },
          label
        );
      }
    }

    return React.createElement(
      "button",
      {
        className: className,
        type: type,
        disabled: disabled,
        onClick: onClick
      },
      label
    );
  }

}

Button.propTypes = {
  onClick: PropTypes.func
};
Accounts.ui.Button = Button;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Buttons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Buttons.jsx                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
  Buttons: () => Buttons
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
module.watch(require("./Button.jsx"));
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class Buttons extends React.Component {
  render() {
    let {
      buttons = {},
      className = "buttons"
    } = this.props;
    return React.createElement(
      "div",
      {
        className: className
      },
      Object.keys(buttons).map((id, i) => React.createElement(Accounts.ui.Button, (0, _extends3.default)({}, buttons[id], {
        key: i
      })))
    );
  }

}

;
Accounts.ui.Buttons = Buttons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Field.jsx                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Field: () => Field
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.watch(require("meteor/accounts-base"), {
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
      className = "field",
      defaultValue = "",
      message
    } = this.props;
    const {
      mount = true
    } = this.state;

    if (type == 'notice') {
      return React.createElement(
        "div",
        {
          className: className
        },
        label
      );
    }

    return mount ? React.createElement(
      "div",
      {
        className: className
      },
      React.createElement(
        "label",
        {
          htmlFor: id
        },
        label
      ),
      React.createElement("input", {
        id: id,
        ref: ref => this.input = ref,
        type: type,
        onChange: onChange,
        placeholder: hint,
        defaultValue: defaultValue
      }),
      message && React.createElement(
        "span",
        {
          className: ['message', message.type].join(' ').trim()
        },
        message.message
      )
    ) : null;
  }

}

Field.propTypes = {
  onChange: PropTypes.func
};
Accounts.ui.Field = Field;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Fields.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Fields.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
  Fields: () => Fields
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
module.watch(require("./Field.jsx"));

class Fields extends React.Component {
  render() {
    let {
      fields = {},
      className = "fields"
    } = this.props;
    return React.createElement(
      "div",
      {
        className: className
      },
      Object.keys(fields).map((id, i) => React.createElement(Accounts.ui.Field, (0, _extends3.default)({}, fields[id], {
        key: i
      })))
    );
  }

}

Accounts.ui.Fields = Fields;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Form.jsx                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Form: () => Form
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
  default(v) {
    PropTypes = v;
  }

}, 1);
let ReactDOM;
module.watch(require("react-dom"), {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 3);
module.watch(require("./Fields.jsx"));
module.watch(require("./Buttons.jsx"));
module.watch(require("./FormMessage.jsx"));
module.watch(require("./PasswordOrService.jsx"));
module.watch(require("./SocialButtons.jsx"));
module.watch(require("./FormMessages.jsx"));

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
    return React.createElement(
      "form",
      {
        ref: ref => this.form = ref,
        className: [className, ready ? "ready" : null].join(' '),
        className: "accounts-ui",
        noValidate: true
      },
      React.createElement(Accounts.ui.Fields, {
        fields: fields
      }),
      React.createElement(Accounts.ui.Buttons, {
        buttons: buttons
      }),
      React.createElement(Accounts.ui.PasswordOrService, {
        oauthServices: oauthServices,
        translate: translate
      }),
      React.createElement(Accounts.ui.SocialButtons, {
        oauthServices: oauthServices
      }),
      React.createElement(Accounts.ui.FormMessages, {
        messages: messages
      })
    );
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessage.jsx                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FormMessage: () => FormMessage
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.watch(require("meteor/accounts-base"), {
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
      className = "message",
      style = {},
      deprecated
    } = this.props; // XXX Check for deprecations.

    if (deprecated) {
      // Found backwords compatibility issue.
      console.warn('You are overriding Accounts.ui.Form and using FormMessage, the use of FormMessage in Form has been depreacted in v1.2.11, update your implementation to use FormMessages: https://github.com/studiointeract/accounts-ui/#deprecations');
    }

    message = isObject(message) ? message.message : message; // If message is object, then try to get message from it

    return message ? React.createElement(
      "div",
      {
        style: style,
        className: [className, type].join(' ')
      },
      message
    ) : null;
  }

}

Accounts.ui.FormMessage = FormMessage;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessages.jsx                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FormMessages: () => FormMessages
});
let React, Component;
module.watch(require("react"), {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class FormMessages extends Component {
  render() {
    const {
      messages = [],
      className = "messages",
      style = {}
    } = this.props;
    return messages.length > 0 && React.createElement(
      "div",
      {
        className: "messages"
      },
      messages.filter(message => !('field' in message)).map(({
        message,
        type
      }, i) => React.createElement(Accounts.ui.FormMessage, {
        message: message,
        type: type,
        key: i
      }))
    );
  }

}

Accounts.ui.FormMessages = FormMessages;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LoginForm.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/LoginForm.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let React, Component;
module.watch(require("react"), {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
  default(v) {
    PropTypes = v;
  }

}, 1);
let ReactDOM;
module.watch(require("react-dom"), {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let createContainer;
module.watch(require("meteor/react-meteor-data"), {
  createContainer(v) {
    createContainer = v;
  }

}, 3);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 4);
let T9n;
module.watch(require("meteor/softwarerero:accounts-t9n"), {
  T9n(v) {
    T9n = v;
  }

}, 5);
let KEY_PREFIX;
module.watch(require("../../login_session.js"), {
  KEY_PREFIX(v) {
    KEY_PREFIX = v;
  }

}, 6);
module.watch(require("./Form.jsx"));
let STATES, passwordSignupFields, validateEmail, validatePassword, validateUsername, loginResultCallback, getLoginServices, hasPasswordService, capitalize;
module.watch(require("../../helpers.js"), {
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


    this.setState(prevState => (0, _extends3.default)({}, this.getDefaultFieldValues()));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.formState && nextProps.formState !== this.state.formState) {
      this.setState((0, _extends3.default)({
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
      defaultValue: this.state.username || "",
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
      defaultValue: this.state.username || "",
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
      defaultValue: this.state.email || "",
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
      defaultValue: this.state.password || "",
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
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getUsernameOrEmailField());
      }

      if (passwordSignupFields() === "USERNAME_ONLY") {
        loginFields.push(this.getUsernameField());
      }

      if (["EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getPasswordField());
      }
    }

    if (hasPasswordService() && formState == STATES.SIGN_UP) {
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getUsernameField());
      }

      if (["USERNAME_AND_EMAIL", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      if (["USERNAME_AND_OPTIONAL_EMAIL"].includes(passwordSignupFields())) {
        loginFields.push(Object.assign(this.getEmailField(), {
          required: false
        }));
      }

      if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
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

    if (user && !["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && formState == STATES.PROFILE && user.services && 'password' in user.services) {
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
    return !this.props.user && this.state.formState == STATES.SIGN_IN && ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"].includes(passwordSignupFields());
  } /**
     * Helper to store field values while using the form.
     */

  setDefaultFieldValues(defaults) {
    if (typeof defaults !== 'object') {
      throw new Error('Argument to setDefaultFieldValues is not of type object');
    } else if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem('accounts_ui', JSON.stringify((0, _extends3.default)({
        passwordSignupFields: passwordSignupFields()
      }, this.getDefaultFieldValues(), defaults)));
    }
  } /**
     * Helper to get field values when switching states in the form.
     */

  getDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);

      if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {
        return defaultFieldValues;
      }
    }
  } /**
     * Helper to clear field values when signing in, up or out.
     */

  clearDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.removeItem('accounts_ui');
    }
  }

  switchToSignUp(event) {
    event.preventDefault();
    this.setState((0, _extends3.default)({
      formState: STATES.SIGN_UP
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToSignIn(event) {
    event.preventDefault();
    this.setState((0, _extends3.default)({
      formState: STATES.SIGN_IN
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToPasswordReset(event) {
    event.preventDefault();
    this.setState((0, _extends3.default)({
      formState: STATES.PASSWORD_RESET
    }, this.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToChangePassword(event) {
    event.preventDefault();
    this.setState((0, _extends3.default)({
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
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      } else {
        if (["USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
          this.loginWithoutPassword();
          return;
        } else {
          loginSelector = usernameOrEmail;
        }
      }
    } else if (username !== null) {
      if (!this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
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
        if (["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {
          this.loginWithoutPassword();
          error = true;
        } else {
          loginSelector = {
            email
          };
        }
      }
    }

    if (!["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('password', password)) {
      error = true;
    }

    if (!error) {
      Meteor.loginWithPassword(loginSelector, password, (error, result) => {
        onSubmitHook(error, formState);

        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
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
            className: `btn-${service} ${service}`,
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

    const loginWithService = Meteor["loginWith" + capitalService()];
    let options = {}; // use default scope unless specified

    if (Accounts.ui._options.requestPermissions[serviceName]) options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    if (Accounts.ui._options.requestOfflineToken[serviceName]) options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    if (Accounts.ui._options.forceApprovalPrompt[serviceName]) options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
    this.clearMessages();
    const self = this;
    loginWithService(options, error => {
      onSubmitHook(error, formState);

      if (error) {
        this.showMessage(`error.accounts.${error.reason}` || "unknown_error");
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

  signUp(options = {}) {
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
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      } else {
        options.username = username;
      }
    } else {
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      }
    }

    if (!this.validateField('email', email)) {
      error = true;
    } else {
      options.email = email;
    }

    if (["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
      // Generate a random password.
      options.password = Meteor.uuid();
    } else if (!this.validateField('password', password)) {
      onSubmitHook("Invalid password", formState);
      error = true;
    } else {
      options.password = password;
    }

    const SignUp = function (_options) {
      Accounts.createUser(_options, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');

          if (this.translate(`error.accounts.${error.reason}`)) {
            onSubmitHook(`error.accounts.${error.reason}`, formState);
          } else {
            onSubmitHook("unknown_error", formState);
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
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage(this.translate("info.emailSent"), 'success', 5000);
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
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage(this.translate("info.emailSent"), 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    } else {
      let errMsg = null;

      if (["USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        errMsg = this.translate("error.accounts.invalid_email");
      } else {
        errMsg = this.translate("error.accounts.invalid_email");
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
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage(this.translate("info.emailSent"), 'success', 5000);
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
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
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
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
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
      this.setState(({
        messages = []
      }) => {
        messages.push((0, _extends3.default)({
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
    return messages.find(({
      field: key
    }) => key === field);
  }

  clearMessage(message) {
    if (message) {
      this.setState(({
        messages = []
      }) => ({
        messages: messages.filter(({
          message: a
        }) => a !== message)
      }));
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
        console.warn(`Implementations of Accounts.ui.Field must render message in v1.2.11.
          https://github.com/studiointeract/accounts-ui/#deprecations`);
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
      message: messages.map(({
        message
      }) => message).join(', ')
    };
    return React.createElement(Accounts.ui.Form, (0, _extends3.default)({
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
module.exportDefault(createContainer(() => {
  // Listen for the user to login/logout and the services list to the user.
  Meteor.subscribe('servicesList');
  return {
    user: Accounts.user()
  };
}, LoginForm));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/PasswordOrService.jsx                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PasswordOrService: () => PasswordOrService
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.watch(require("prop-types"), {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let T9n;
module.watch(require("meteor/softwarerero:accounts-t9n"), {
  T9n(v) {
    T9n = v;
  }

}, 3);
let hasPasswordService;
module.watch(require("../../helpers.js"), {
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
      className = "password-or-service",
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
      return React.createElement(
        "div",
        {
          style: style,
          className: className
        },
        `${this.translate('orUse')} ${labels.join(' / ')}`
      );
    }

    return null;
  }

}

PasswordOrService.propTypes = {
  oauthServices: PropTypes.object
};
Accounts.ui.PasswordOrService = PasswordOrService;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialButtons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/SocialButtons.jsx                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.export({
  SocialButtons: () => SocialButtons
});
let React;
module.watch(require("react"), {
  default(v) {
    React = v;
  }

}, 0);
module.watch(require("./Button.jsx"));
let Accounts;
module.watch(require("meteor/accounts-base"), {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class SocialButtons extends React.Component {
  render() {
    let {
      oauthServices = {},
      className = "social-buttons"
    } = this.props;
    return React.createElement(
      "div",
      {
        className: className
      },
      Object.keys(oauthServices).map((id, i) => {
        return React.createElement(Accounts.ui.Button, (0, _extends3.default)({}, oauthServices[id], {
          key: i
        }));
      })
    );
  }

}

Accounts.ui.SocialButtons = SocialButtons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"node_modules":{"prop-types":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// ../../.1.2.23.opnxbu.tzi2++os+web.browser+web.cordova/npm/node_modules/prop-types/package.json                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
exports.name = "prop-types";
exports.version = "15.5.10";
exports.main = "index.js";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/index.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = require('./factoryWithThrowingShims')();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
require("./node_modules/meteor/std:accounts-ui/check-npm.js");
var exports = require("./node_modules/meteor/std:accounts-ui/main_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['std:accounts-ui'] = exports;

})();

//# sourceURL=meteor://💻app/packages/std_accounts-ui.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2NoZWNrLW5wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL21haW5fc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy9hY2NvdW50c191aS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvaGVscGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9CdXR0b24uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0J1dHRvbnMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0ZpZWxkLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9GaWVsZHMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm0uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm1NZXNzYWdlLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9Gb3JtTWVzc2FnZXMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3giLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZDphY2NvdW50cy11aS9pbXBvcnRzL3VpL2NvbXBvbmVudHMvUGFzc3dvcmRPclNlcnZpY2UuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL1NvY2lhbEJ1dHRvbnMuanN4Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImRlZmF1bHQiLCJMb2dpbkZvcm0iLCJBY2NvdW50cyIsIlNUQVRFUyIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJyZWRpcmVjdCIsInZhbGlkYXRlUGFzc3dvcmQiLCJ2YWxpZGF0ZUVtYWlsIiwidmFsaWRhdGVVc2VybmFtZSIsInVpIiwiX29wdGlvbnMiLCJyZXF1ZXN0UGVybWlzc2lvbnMiLCJyZXF1ZXN0T2ZmbGluZVRva2VuIiwiZm9yY2VBcHByb3ZhbFByb21wdCIsInJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbiIsInBhc3N3b3JkU2lnbnVwRmllbGRzIiwibWluaW11bVBhc3N3b3JkTGVuZ3RoIiwibG9naW5QYXRoIiwic2lnblVwUGF0aCIsInJlc2V0UGFzc3dvcmRQYXRoIiwicHJvZmlsZVBhdGgiLCJjaGFuZ2VQYXNzd29yZFBhdGgiLCJob21lUm91dGVQYXRoIiwib25TdWJtaXRIb29rIiwib25QcmVTaWduVXBIb29rIiwiUHJvbWlzZSIsInJlc29sdmUiLCJvblBvc3RTaWduVXBIb29rIiwib25FbnJvbGxBY2NvdW50SG9vayIsIm9uUmVzZXRQYXNzd29yZEhvb2siLCJvblZlcmlmeUVtYWlsSG9vayIsIm9uU2lnbmVkSW5Ib29rIiwib25TaWduZWRPdXRIb29rIiwiZW1haWxQYXR0ZXJuIiwiUmVnRXhwIiwiY29uZmlnIiwib3B0aW9ucyIsIlZBTElEX0tFWVMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiRXJyb3IiLCJzZXJ2aWNlIiwic2NvcmUiLCJzY29wZSIsIkFycmF5IiwidmFsdWUiLCJob29rIiwicGF0aCIsImV4cG9ydERlZmF1bHQiLCJsb2dpbkJ1dHRvbnNTZXNzaW9uIiwiZ2V0TG9naW5TZXJ2aWNlcyIsImhhc1Bhc3N3b3JkU2VydmljZSIsImxvZ2luUmVzdWx0Q2FsbGJhY2siLCJjYXBpdGFsaXplIiwiYnJvd3Nlckhpc3RvcnkiLCJlIiwiX2xvZ2luQnV0dG9uc1Nlc3Npb24iLCJTSUdOX0lOIiwiU3ltYm9sIiwiU0lHTl9VUCIsIlBST0ZJTEUiLCJQQVNTV09SRF9DSEFOR0UiLCJQQVNTV09SRF9SRVNFVCIsIkVOUk9MTF9BQ0NPVU5UIiwic2VydmljZXMiLCJQYWNrYWdlIiwib2F1dGgiLCJzZXJ2aWNlTmFtZXMiLCJzb3J0IiwibWFwIiwibmFtZSIsImVyciIsIkxvZ2luQ2FuY2VsbGVkRXJyb3IiLCJTZXJ2aWNlQ29uZmlndXJhdGlvbiIsIkNvbmZpZ0Vycm9yIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlbWFpbCIsInNob3dNZXNzYWdlIiwiY2xlYXJNZXNzYWdlIiwidGVzdCIsImxlbmd0aCIsInBhc3N3b3JkIiwiZXJyTXNnIiwidXNlcm5hbWUiLCJmb3JtU3RhdGUiLCJmaWVsZE5hbWUiLCJoaXN0b3J5Iiwic2V0VGltZW91dCIsIkZsb3dSb3V0ZXIiLCJnbyIsInB1c2giLCJwdXNoU3RhdGUiLCJzdHJpbmciLCJyZXBsYWNlIiwic3BsaXQiLCJ3b3JkIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImpvaW4iLCJ2YWxpZGF0ZUtleSIsIktFWV9QUkVGSVgiLCJzZXQiLCJfc2V0IiwiU2Vzc2lvbiIsImdldCIsIm9uUGFnZUxvYWRMb2dpbiIsImF0dGVtcHRJbmZvIiwidHlwZSIsImVycm9yIiwiZG9uZUNhbGxiYWNrIiwib25SZXNldFBhc3N3b3JkTGluayIsInRva2VuIiwiZG9uZSIsIm9uRW5yb2xsbWVudExpbmsiLCJvbkVtYWlsVmVyaWZpY2F0aW9uTGluayIsInZlcmlmeUVtYWlsIiwibWV0aG9kcyIsImxvZ2luV2l0aG91dFBhc3N3b3JkIiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyIiwidXNlcnMiLCJmaW5kT25lIiwiJG9yIiwiJGV4aXN0cyIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRMb2dpbkVtYWlsIiwiX2lkIiwidXNlcklkIiwiZmluZCIsInRva2VuUmVjb3JkIiwiUmFuZG9tIiwic2VjcmV0Iiwid2hlbiIsIkRhdGUiLCJ1cGRhdGUiLCIkcHVzaCIsIl9lbnN1cmUiLCJ2ZXJpZmljYXRpb25Ub2tlbnMiLCJsb2dpblVybCIsInVybHMiLCJ0byIsImZyb20iLCJlbWFpbFRlbXBsYXRlcyIsImxvZ2luTm9QYXNzd29yZCIsInN1YmplY3QiLCJ0ZXh0IiwiaHRtbCIsImhlYWRlcnMiLCJFbWFpbCIsInNlbmQiLCJzaXRlTmFtZSIsInVybCIsImdyZWV0aW5nIiwicHJvZmlsZSIsInB1Ymxpc2giLCJmaWVsZHMiLCJCdXR0b24iLCJSZWFjdCIsIlByb3BUeXBlcyIsIkxpbmsiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJsYWJlbCIsImRpc2FibGVkIiwiY2xhc3NOYW1lIiwib25DbGljayIsInByb3BzIiwicHJvcFR5cGVzIiwiZnVuYyIsIkJ1dHRvbnMiLCJidXR0b25zIiwiaWQiLCJpIiwiRmllbGQiLCJjb25zdHJ1Y3RvciIsInN0YXRlIiwibW91bnQiLCJ0cmlnZ2VyVXBkYXRlIiwib25DaGFuZ2UiLCJpbnB1dCIsInRhcmdldCIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwic2V0U3RhdGUiLCJoaW50IiwicmVxdWlyZWQiLCJkZWZhdWx0VmFsdWUiLCJtZXNzYWdlIiwicmVmIiwidHJpbSIsIkZpZWxkcyIsIkZvcm0iLCJSZWFjdERPTSIsImZvcm0iLCJhZGRFdmVudExpc3RlbmVyIiwicHJldmVudERlZmF1bHQiLCJvYXV0aFNlcnZpY2VzIiwibWVzc2FnZXMiLCJ0cmFuc2xhdGUiLCJyZWFkeSIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiRm9ybU1lc3NhZ2UiLCJpc09iamVjdCIsIm9iaiIsInN0eWxlIiwiZGVwcmVjYXRlZCIsImNvbnNvbGUiLCJ3YXJuIiwiRm9ybU1lc3NhZ2VzIiwiZmlsdGVyIiwiY3JlYXRlQ29udGFpbmVyIiwiVDluIiwiaW5kZXhCeSIsImFycmF5IiwicmVzdWx0Iiwid2FpdGluZyIsImJpbmQiLCJwcmV2U3RhdGUiLCJjaGFuZ2VTdGF0ZSIsImdldERlZmF1bHRGaWVsZFZhbHVlcyIsImNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMiLCJuZXh0UHJvcHMiLCJuZXh0Q29udGV4dCIsInZhbGlkYXRlRmllbGQiLCJmaWVsZCIsImdldFVzZXJuYW1lT3JFbWFpbEZpZWxkIiwiaGFuZGxlQ2hhbmdlIiwiZ2V0TWVzc2FnZUZvckZpZWxkIiwiZ2V0VXNlcm5hbWVGaWVsZCIsImdldEVtYWlsRmllbGQiLCJnZXRQYXNzd29yZEZpZWxkIiwiZ2V0U2V0UGFzc3dvcmRGaWVsZCIsImdldE5ld1Bhc3N3b3JkRmllbGQiLCJldnQiLCJzZXREZWZhdWx0RmllbGRWYWx1ZXMiLCJsb2dpbkZpZWxkcyIsImFzc2lnbiIsInNob3dQYXNzd29yZENoYW5nZUZvcm0iLCJzaG93RW5yb2xsQWNjb3VudEZvcm0iLCJsb2dpbkJ1dHRvbnMiLCJzaWduT3V0Iiwic2hvd0NyZWF0ZUFjY291bnRMaW5rIiwic3dpdGNoVG9TaWduVXAiLCJzd2l0Y2hUb1NpZ25JbiIsInNob3dGb3Jnb3RQYXNzd29yZExpbmsiLCJzd2l0Y2hUb1Bhc3N3b3JkUmVzZXQiLCJzd2l0Y2hUb0NoYW5nZVBhc3N3b3JkIiwic2lnblVwIiwic2hvd1NpZ25JbkxpbmsiLCJzaWduSW4iLCJwYXNzd29yZFJlc2V0IiwicGFzc3dvcmRDaGFuZ2UiLCJzd2l0Y2hUb1NpZ25PdXQiLCJjYW5jZWxSZXNldFBhc3N3b3JkIiwiYSIsImIiLCJ1bmRlZmluZWQiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJkZWZhdWx0cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiZGVmYXVsdEZpZWxkVmFsdWVzIiwicGFyc2UiLCJnZXRJdGVtIiwiY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMiLCJyZW1vdmVJdGVtIiwiZXZlbnQiLCJjbGVhck1lc3NhZ2VzIiwibG9nb3V0IiwidXNlcm5hbWVPckVtYWlsIiwibG9naW5TZWxlY3RvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicmVhc29uIiwib2F1dGhCdXR0b25zIiwib2F1dGhTaWduSW4iLCJzZXJ2aWNlTmFtZSIsImNhcGl0YWxTZXJ2aWNlIiwibG9naW5XaXRoU2VydmljZSIsInNlbGYiLCJ1dWlkIiwiU2lnblVwIiwiY3JlYXRlVXNlciIsInByb21pc2UiLCJ0aGVuIiwiZm9yZ290UGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsInJlc2V0UGFzc3dvcmQiLCJjaGFuZ2VQYXNzd29yZCIsImNsZWFyVGltZW91dCIsImhpZGVNZXNzYWdlVGltb3V0IiwiY29tcG9uZW50V2lsbE1vdW50IiwiY29udGFpbmVyIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImNvbXBvbmVudFdpbGxVbm1vdW50Iiwic3ltYm9sIiwiZGVmYXVsdFByb3BzIiwic3Vic2NyaWJlIiwiUGFzc3dvcmRPclNlcnZpY2UiLCJsYWJlbHMiLCJTb2NpYWxCdXR0b25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7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Ly8gaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuLy9cbi8vIGNoZWNrTnBtVmVyc2lvbnMoe1xuLy8gICBcInJlYWN0XCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyAgIFwicmVhY3QtZG9tXCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyB9KTtcbiIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYWNjb3VudHNfdWkuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyc7XG5pbXBvcnQgeyByZWRpcmVjdCwgU1RBVEVTIH3CoGZyb20gJy4vaW1wb3J0cy9oZWxwZXJzLmpzJztcbmltcG9ydCAnLi9pbXBvcnRzL2FwaS9zZXJ2ZXIvbG9naW5XaXRob3V0UGFzc3dvcmQuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyc7XG5pbXBvcnQgTG9naW5Gb3JtIGZyb20gJy4vaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3gnO1xuXG5leHBvcnQge1xuICBMb2dpbkZvcm0gYXMgZGVmYXVsdCxcbiAgQWNjb3VudHMsXG4gIFNUQVRFUyxcbn07XG4iLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7XG4gIHJlZGlyZWN0LFxuICB2YWxpZGF0ZVBhc3N3b3JkLFxuICB2YWxpZGF0ZUVtYWlsLFxuICB2YWxpZGF0ZVVzZXJuYW1lLFxufSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEFjY291bnRzIFVJXG4gKiBAbmFtZXNwYWNlXG4gKiBAbWVtYmVyT2YgQWNjb3VudHNcbiAqL1xuQWNjb3VudHMudWkgPSB7fTtcblxuQWNjb3VudHMudWkuX29wdGlvbnMgPSB7XG4gIHJlcXVlc3RQZXJtaXNzaW9uczogW10sXG4gIHJlcXVlc3RPZmZsaW5lVG9rZW46IHt9LFxuICBmb3JjZUFwcHJvdmFsUHJvbXB0OiB7fSxcbiAgcmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uOiBmYWxzZSxcbiAgcGFzc3dvcmRTaWdudXBGaWVsZHM6ICdFTUFJTF9PTkxZX05PX1BBU1NXT1JEJyxcbiAgbWluaW11bVBhc3N3b3JkTGVuZ3RoOiA3LFxuICBsb2dpblBhdGg6ICcvJyxcbiAgc2lnblVwUGF0aDogbnVsbCxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IG51bGwsXG4gIHByb2ZpbGVQYXRoOiAnLycsXG4gIGNoYW5nZVBhc3N3b3JkUGF0aDogbnVsbCxcbiAgaG9tZVJvdXRlUGF0aDogJy8nLFxuICBvblN1Ym1pdEhvb2s6ICgpID0+IHt9LFxuICBvblByZVNpZ25VcEhvb2s6ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSgpKSxcbiAgb25Qb3N0U2lnblVwSG9vazogKCkgPT4ge30sXG4gIG9uRW5yb2xsQWNjb3VudEhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLmxvZ2luUGF0aH1gKSxcbiAgb25SZXNldFBhc3N3b3JkSG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMubG9naW5QYXRofWApLFxuICBvblZlcmlmeUVtYWlsSG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMucHJvZmlsZVBhdGh9YCksXG4gIG9uU2lnbmVkSW5Ib29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5ob21lUm91dGVQYXRofWApLFxuICBvblNpZ25lZE91dEhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLmhvbWVSb3V0ZVBhdGh9YCksXG4gIGVtYWlsUGF0dGVybjogbmV3IFJlZ0V4cCgnW15AXStAW15AXFwuXXsyLH1cXC5bXlxcLkBdKycpLFxufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25maWd1cmUgdGhlIGJlaGF2aW9yIG9mIFtgPEFjY291bnRzLnVpLkxvZ2luRm9ybSAvPmBdKCNyZWFjdC1hY2NvdW50cy11aSkuXG4gKiBAYW55d2hlcmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMgV2hpY2ggW3Blcm1pc3Npb25zXSgjcmVxdWVzdHBlcm1pc3Npb25zKSB0byByZXF1ZXN0IGZyb20gdGhlIHVzZXIgZm9yIGVhY2ggZXh0ZXJuYWwgc2VydmljZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4gVG8gYXNrIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uIHRvIGFjdCBvbiB0aGVpciBiZWhhbGYgd2hlbiBvZmZsaW5lLCBtYXAgdGhlIHJlbGV2YW50IGV4dGVybmFsIHNlcnZpY2UgdG8gYHRydWVgLiBDdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgd2l0aCBHb29nbGUuIFNlZSBbTWV0ZW9yLmxvZ2luV2l0aEV4dGVybmFsU2VydmljZV0oI21ldGVvcl9sb2dpbndpdGhleHRlcm5hbHNlcnZpY2UpIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0IElmIHRydWUsIGZvcmNlcyB0aGUgdXNlciB0byBhcHByb3ZlIHRoZSBhcHAncyBwZXJtaXNzaW9ucywgZXZlbiBpZiBwcmV2aW91c2x5IGFwcHJvdmVkLiBDdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgd2l0aCBHb29nbGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcyBXaGljaCBmaWVsZHMgdG8gZGlzcGxheSBpbiB0aGUgdXNlciBjcmVhdGlvbiBmb3JtLiBPbmUgb2YgJ2BVU0VSTkFNRV9BTkRfRU1BSUxgJywgJ2BVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxgJywgJ2BVU0VSTkFNRV9PTkxZYCcsICdgRU1BSUxfT05MWWAnLCBvciAnYE5PX1BBU1NXT1JEYCcgKGRlZmF1bHQpLlxuICovXG5BY2NvdW50cy51aS5jb25maWcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIC8vIHZhbGlkYXRlIG9wdGlvbnMga2V5c1xuICBjb25zdCBWQUxJRF9LRVlTID0gW1xuICAgICdwYXNzd29yZFNpZ251cEZpZWxkcycsXG4gICAgJ3JlcXVlc3RQZXJtaXNzaW9ucycsXG4gICAgJ3JlcXVlc3RPZmZsaW5lVG9rZW4nLFxuICAgICdmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24nLFxuICAgICdyZXF1aXJlRW1haWxWZXJpZmljYXRpb24nLFxuICAgICdtaW5pbXVtUGFzc3dvcmRMZW5ndGgnLFxuICAgICdsb2dpblBhdGgnLFxuICAgICdzaWduVXBQYXRoJyxcbiAgICAncmVzZXRQYXNzd29yZFBhdGgnLFxuICAgICdwcm9maWxlUGF0aCcsXG4gICAgJ2NoYW5nZVBhc3N3b3JkUGF0aCcsXG4gICAgJ2hvbWVSb3V0ZVBhdGgnLFxuICAgICdvblN1Ym1pdEhvb2snLFxuICAgICdvblByZVNpZ25VcEhvb2snLFxuICAgICdvblBvc3RTaWduVXBIb29rJyxcbiAgICAnb25FbnJvbGxBY2NvdW50SG9vaycsXG4gICAgJ29uUmVzZXRQYXNzd29yZEhvb2snLFxuICAgICdvblZlcmlmeUVtYWlsSG9vaycsXG4gICAgJ29uU2lnbmVkSW5Ib29rJyxcbiAgICAnb25TaWduZWRPdXRIb29rJyxcbiAgICAndmFsaWRhdGVGaWVsZCcsXG4gICAgJ2VtYWlsUGF0dGVybicsXG4gIF07XG5cbiAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCFWQUxJRF9LRVlTLmluY2x1ZGVzKGtleSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IEludmFsaWQga2V5OiBcIiArIGtleSk7XG4gIH0pO1xuXG4gIC8vIERlYWwgd2l0aCBgcGFzc3dvcmRTaWdudXBGaWVsZHNgXG4gIGlmIChvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzKSB7XG4gICAgaWYgKFtcbiAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiLFxuICAgICAgXCJVU0VSTkFNRV9PTkxZXCIsXG4gICAgICBcIkVNQUlMX09OTFlcIixcbiAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgIF0uaW5jbHVkZXMob3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcykpIHtcbiAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzID0gb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IEludmFsaWQgb3B0aW9uIGZvciBgcGFzc3dvcmRTaWdudXBGaWVsZHNgOiBcIiArIG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgcmVxdWVzdFBlcm1pc3Npb25zYFxuICBpZiAob3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucykuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgIGNvbnN0IHNjb3JlID0gb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZV07XG4gICAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogQ2FuJ3Qgc2V0IGByZXF1ZXN0UGVybWlzc2lvbnNgIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArIHNlcnZpY2UpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIShzY29wZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IFZhbHVlIGZvciBgcmVxdWVzdFBlcm1pc3Npb25zYCBtdXN0IGJlIGFuIGFycmF5XCIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlXSA9IHNjb3BlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGByZXF1ZXN0T2ZmbGluZVRva2VuYFxuICBpZiAob3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuKSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuKS5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZV07XG4gICAgICBpZiAoc2VydmljZSAhPT0gJ2dvb2dsZScpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogYHJlcXVlc3RPZmZsaW5lVG9rZW5gIG9ubHkgc3VwcG9ydGVkIGZvciBHb29nbGUgbG9naW4gYXQgdGhlIG1vbWVudC5cIik7XG5cbiAgICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogQ2FuJ3Qgc2V0IGByZXF1ZXN0T2ZmbGluZVRva2VuYCBtb3JlIHRoYW4gb25jZSBmb3IgXCIgKyBzZXJ2aWNlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBEZWFsIHdpdGggYGZvcmNlQXBwcm92YWxQcm9tcHRgXG4gIGlmIChvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQpLmZvckVhY2goc2VydmljZSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlXTtcbiAgICAgIGlmIChzZXJ2aWNlICE9PSAnZ29vZ2xlJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBgZm9yY2VBcHByb3ZhbFByb21wdGAgb25seSBzdXBwb3J0ZWQgZm9yIEdvb2dsZSBsb2dpbiBhdCB0aGUgbW9tZW50LlwiKTtcblxuICAgICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYGZvcmNlQXBwcm92YWxQcm9tcHRgIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArIHNlcnZpY2UpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgcmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uYFxuICBpZiAob3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb24pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uICE9ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwicmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uXCIgbm90IGEgYm9vbGVhbmApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbiA9IG9wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgbWluaW11bVBhc3N3b3JkTGVuZ3RoYFxuICBpZiAob3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubWluaW11bVBhc3N3b3JkTGVuZ3RoICE9ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCJtaW5pbXVtUGFzc3dvcmRMZW5ndGhcIiBub3QgYSBudW1iZXJgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGggPSBvcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvLyBEZWFsIHdpdGggdGhlIGhvb2tzLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAnb25TdWJtaXRIb29rJyxcbiAgICAnb25QcmVTaWduVXBIb29rJyxcbiAgICAnb25Qb3N0U2lnblVwSG9vaycsXG4gIF0pIHtcbiAgICBpZiAob3B0aW9uc1tob29rXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBwYXR0ZXJuLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAnZW1haWxQYXR0ZXJuJyxcbiAgXSkge1xuICAgIGlmIChvcHRpb25zW2hvb2tdKSB7XG4gICAgICBpZiAoIShvcHRpb25zW2hvb2tdIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCIke2hvb2t9XCIgbm90IGEgUmVndWxhciBFeHByZXNzaW9uYCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGRlYWwgd2l0aCB0aGUgcGF0aHMuXG4gIGZvciAobGV0IHBhdGggb2YgW1xuICAgICdsb2dpblBhdGgnLFxuICAgICdzaWduVXBQYXRoJyxcbiAgICAncmVzZXRQYXNzd29yZFBhdGgnLFxuICAgICdwcm9maWxlUGF0aCcsXG4gICAgJ2NoYW5nZVBhc3N3b3JkUGF0aCcsXG4gICAgJ2hvbWVSb3V0ZVBhdGgnXG4gIF0pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbcGF0aF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAob3B0aW9uc1twYXRoXSAhPT0gbnVsbCAmJiB0eXBlb2Ygb3B0aW9uc1twYXRoXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6ICR7cGF0aH0gaXMgbm90IGEgc3RyaW5nIG9yIG51bGxgKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1twYXRoXSA9IG9wdGlvbnNbcGF0aF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gZGVhbCB3aXRoIHJlZGlyZWN0IGhvb2tzLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAgICdvbkVucm9sbEFjY291bnRIb29rJyxcbiAgICAgICdvblJlc2V0UGFzc3dvcmRIb29rJyxcbiAgICAgICdvblZlcmlmeUVtYWlsSG9vaycsXG4gICAgICAnb25TaWduZWRJbkhvb2snLFxuICAgICAgJ29uU2lnbmVkT3V0SG9vayddKSB7XG4gICAgaWYgKG9wdGlvbnNbaG9va10pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tob29rXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW2hvb2tdID0gb3B0aW9uc1tob29rXTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdID09ICdzdHJpbmcnKSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW2hvb2tdID0gKCkgPT4gcmVkaXJlY3Qob3B0aW9uc1tob29rXSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uIG9yIGFuIGFic29sdXRlIG9yIHJlbGF0aXZlIHBhdGhgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFjY291bnRzO1xuIiwibGV0IGJyb3dzZXJIaXN0b3J5XG50cnkgeyBicm93c2VySGlzdG9yeSA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpLmJyb3dzZXJIaXN0b3J5IH0gY2F0Y2goZSkge31cbmV4cG9ydCBjb25zdCBsb2dpbkJ1dHRvbnNTZXNzaW9uID0gQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb247XG5leHBvcnQgY29uc3QgU1RBVEVTID0ge1xuICBTSUdOX0lOOiBTeW1ib2woJ1NJR05fSU4nKSxcbiAgU0lHTl9VUDogU3ltYm9sKCdTSUdOX1VQJyksXG4gIFBST0ZJTEU6IFN5bWJvbCgnUFJPRklMRScpLFxuICBQQVNTV09SRF9DSEFOR0U6IFN5bWJvbCgnUEFTU1dPUkRfQ0hBTkdFJyksXG4gIFBBU1NXT1JEX1JFU0VUOiBTeW1ib2woJ1BBU1NXT1JEX1JFU0VUJyksXG4gIEVOUk9MTF9BQ0NPVU5UOiBTeW1ib2woJ0VOUk9MTF9BQ0NPVU5UJylcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2dpblNlcnZpY2VzKCkge1xuICAvLyBGaXJzdCBsb29rIGZvciBPQXV0aCBzZXJ2aWNlcy5cbiAgY29uc3Qgc2VydmljZXMgPSBQYWNrYWdlWydhY2NvdW50cy1vYXV0aCddID8gQWNjb3VudHMub2F1dGguc2VydmljZU5hbWVzKCkgOiBbXTtcblxuICAvLyBCZSBlcXVhbGx5IGtpbmQgdG8gYWxsIGxvZ2luIHNlcnZpY2VzLiBUaGlzIGFsc28gcHJlc2VydmVzXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICBzZXJ2aWNlcy5zb3J0KCk7XG5cbiAgcmV0dXJuIHNlcnZpY2VzLm1hcChmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4ge25hbWU6IG5hbWV9O1xuICB9KTtcbn07XG4vLyBFeHBvcnQgZ2V0TG9naW5TZXJ2aWNlcyB1c2luZyBvbGQgc3R5bGUgZ2xvYmFscyBmb3IgYWNjb3VudHMtYmFzZSB3aGljaFxuLy8gcmVxdWlyZXMgaXQuXG50aGlzLmdldExvZ2luU2VydmljZXMgPSBnZXRMb2dpblNlcnZpY2VzO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFzc3dvcmRTZXJ2aWNlKCkge1xuICAvLyBGaXJzdCBsb29rIGZvciBPQXV0aCBzZXJ2aWNlcy5cbiAgcmV0dXJuICEhUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dpblJlc3VsdENhbGxiYWNrKHNlcnZpY2UsIGVycikge1xuICBpZiAoIWVycikge1xuXG4gIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgQWNjb3VudHMuTG9naW5DYW5jZWxsZWRFcnJvcikge1xuICAgIC8vIGRvIG5vdGhpbmdcbiAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBTZXJ2aWNlQ29uZmlndXJhdGlvbi5Db25maWdFcnJvcikge1xuXG4gIH0gZWxzZSB7XG4gICAgLy9sb2dpbkJ1dHRvbnNTZXNzaW9uLmVycm9yTWVzc2FnZShlcnIucmVhc29uIHx8IFwiVW5rbm93biBlcnJvclwiKTtcbiAgfVxuXG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAodHlwZW9mIHJlZGlyZWN0ID09PSAnc3RyaW5nJyl7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHNlcnZpY2UgPT09ICdmdW5jdGlvbicpe1xuICAgICAgc2VydmljZSgpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhc3N3b3JkU2lnbnVwRmllbGRzKCkge1xuICByZXR1cm4gQWNjb3VudHMudWkuX29wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMgfHwgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCI7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVFbWFpbChlbWFpbCwgc2hvd01lc3NhZ2UsIGNsZWFyTWVzc2FnZSkge1xuICBpZiAocGFzc3dvcmRTaWdudXBGaWVsZHMoKSA9PT0gXCJVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxcIiAmJiBlbWFpbCA9PT0gJycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMuZW1haWxQYXR0ZXJuLnRlc3QoZW1haWwpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoIWVtYWlsIHx8IGVtYWlsLmxlbmd0aCA9PT0gMCkge1xuICAgIHNob3dNZXNzYWdlKFwiZXJyb3IuZW1haWxSZXF1aXJlZFwiLCAnd2FybmluZycsIGZhbHNlLCAnZW1haWwnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgc2hvd01lc3NhZ2UoXCJlcnJvci5hY2NvdW50cy5JbnZhbGlkIGVtYWlsXCIsICd3YXJuaW5nJywgZmFsc2UsICdlbWFpbCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCA9ICcnLCBzaG93TWVzc2FnZSwgY2xlYXJNZXNzYWdlKXtcbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA+PSBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBjb25zdCBlcnJNc2cgPSBUOW4uZ2V0KFwiZXJyb3IubWluQ2hhclwiKS5yZXBsYWNlKC83LywgQWNjb3VudHMudWkuX29wdGlvbnMubWluaW11bVBhc3N3b3JkTGVuZ3RoKTtcbiAgICBjb25zdCBlcnJNc2cgPSBcImVycm9yLm1pbkNoYXJcIlxuICAgIHNob3dNZXNzYWdlKGVyck1zZywgJ3dhcm5pbmcnLCBmYWxzZSwgJ3Bhc3N3b3JkJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VybmFtZSh1c2VybmFtZSwgc2hvd01lc3NhZ2UsIGNsZWFyTWVzc2FnZSwgZm9ybVN0YXRlKSB7XG4gIGlmICggdXNlcm5hbWUgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZmllbGROYW1lID0gKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkgPT09ICdVU0VSTkFNRV9PTkxZJyB8fCBmb3JtU3RhdGUgPT09IFNUQVRFUy5TSUdOX1VQKSA/ICd1c2VybmFtZScgOiAndXNlcm5hbWVPckVtYWlsJztcbiAgICBzaG93TWVzc2FnZShcImVycm9yLnVzZXJuYW1lUmVxdWlyZWRcIiwgJ3dhcm5pbmcnLCBmYWxzZSwgZmllbGROYW1lKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZGlyZWN0KHJlZGlyZWN0KSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAod2luZG93Lmhpc3RvcnkpIHtcbiAgICAgIC8vIFJ1biBhZnRlciBhbGwgYXBwIHNwZWNpZmljIHJlZGlyZWN0cywgaS5lLiB0byB0aGUgbG9naW4gc2NyZWVuLlxuICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyJ10pIHtcbiAgICAgICAgICBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXInXS5GbG93Um91dGVyLmdvKHJlZGlyZWN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXItc3NyJ10pIHtcbiAgICAgICAgICBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXItc3NyJ10uRmxvd1JvdXRlci5nbyhyZWRpcmVjdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoYnJvd3Nlckhpc3RvcnkpIHtcbiAgICAgICAgICBicm93c2VySGlzdG9yeS5wdXNoKHJlZGlyZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoIHt9ICwgJ3JlZGlyZWN0JywgcmVkaXJlY3QgKTtcbiAgICAgICAgfVxuICAgICAgfSwgMTAwKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcGl0YWxpemUoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvXFwtLywgJyAnKS5zcGxpdCgnICcpLm1hcCh3b3JkID0+IHtcbiAgICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSk7XG4gIH0pLmpvaW4oJyAnKTtcbn1cbiIsImltcG9ydCB7QWNjb3VudHN9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7XG4gIFNUQVRFUyxcbiAgbG9naW5SZXN1bHRDYWxsYmFjayxcbiAgZ2V0TG9naW5TZXJ2aWNlc1xufSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG5jb25zdCBWQUxJRF9LRVlTID0gW1xuICAnZHJvcGRvd25WaXNpYmxlJyxcblxuICAvLyBYWFggY29uc2lkZXIgcmVwbGFjaW5nIHRoZXNlIHdpdGggb25lIGtleSB0aGF0IGhhcyBhbiBlbnVtIGZvciB2YWx1ZXMuXG4gICdpblNpZ251cEZsb3cnLFxuICAnaW5Gb3Jnb3RQYXNzd29yZEZsb3cnLFxuICAnaW5DaGFuZ2VQYXNzd29yZEZsb3cnLFxuICAnaW5NZXNzYWdlT25seUZsb3cnLFxuXG4gICdlcnJvck1lc3NhZ2UnLFxuICAnaW5mb01lc3NhZ2UnLFxuXG4gIC8vIGRpYWxvZ3Mgd2l0aCBtZXNzYWdlcyAoaW5mbyBhbmQgZXJyb3IpXG4gICdyZXNldFBhc3N3b3JkVG9rZW4nLFxuICAnZW5yb2xsQWNjb3VudFRva2VuJyxcbiAgJ2p1c3RWZXJpZmllZEVtYWlsJyxcbiAgJ2p1c3RSZXNldFBhc3N3b3JkJyxcblxuICAnY29uZmlndXJlTG9naW5TZXJ2aWNlRGlhbG9nVmlzaWJsZScsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2VEaWFsb2dTZXJ2aWNlTmFtZScsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2VEaWFsb2dTYXZlRGlzYWJsZWQnLFxuICAnY29uZmlndXJlT25EZXNrdG9wVmlzaWJsZSdcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUtleSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgaWYgKCFWQUxJRF9LRVlTLmluY2x1ZGVzKGtleSkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBrZXkgaW4gbG9naW5CdXR0b25zU2Vzc2lvbjogXCIgKyBrZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IEtFWV9QUkVGSVggPSBcIk1ldGVvci5sb2dpbkJ1dHRvbnMuXCI7XG5cbi8vIFhYWCBUaGlzIHNob3VsZCBwcm9iYWJseSBiZSBwYWNrYWdlIHNjb3BlIHJhdGhlciB0aGFuIGV4cG9ydGVkXG4vLyAodGhlcmUgd2FzIGV2ZW4gYSBjb21tZW50IHRvIHRoYXQgZWZmZWN0IGhlcmUgZnJvbSBiZWZvcmUgd2UgaGFkXG4vLyBuYW1lc3BhY2luZykgYnV0IGFjY291bnRzLXVpLXZpZXdlciB1c2VzIGl0LCBzbyBsZWF2ZSBpdCBhcyBpcyBmb3Jcbi8vIG5vd1xuQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24gPSB7XG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIHZhbGlkYXRlS2V5KGtleSk7XG4gICAgaWYgKFsnZXJyb3JNZXNzYWdlJywgJ2luZm9NZXNzYWdlJ10uaW5jbHVkZXMoa2V5KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkRvbid0IHNldCBlcnJvck1lc3NhZ2Ugb3IgaW5mb01lc3NhZ2UgZGlyZWN0bHkuIEluc3RlYWQsIHVzZSBlcnJvck1lc3NhZ2UoKSBvciBpbmZvTWVzc2FnZSgpLlwiKTtcblxuICAgIHRoaXMuX3NldChrZXksIHZhbHVlKTtcbiAgfSxcblxuICBfc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArIGtleSwgdmFsdWUpO1xuICB9LFxuXG4gIGdldDogZnVuY3Rpb24oa2V5KSB7XG4gICAgdmFsaWRhdGVLZXkoa2V5KTtcbiAgICByZXR1cm4gU2Vzc2lvbi5nZXQoS0VZX1BSRUZJWCArIGtleSk7XG4gIH1cbn07XG5cbmlmIChNZXRlb3IuaXNDbGllbnQpe1xuICAvLyBJbiB0aGUgbG9naW4gcmVkaXJlY3QgZmxvdywgd2UnbGwgaGF2ZSB0aGUgcmVzdWx0IG9mIHRoZSBsb2dpblxuICAvLyBhdHRlbXB0IGF0IHBhZ2UgbG9hZCB0aW1lIHdoZW4gd2UncmUgcmVkaXJlY3RlZCBiYWNrIHRvIHRoZVxuICAvLyBhcHBsaWNhdGlvbi4gIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gdXBkYXRlIHRoZSBVSSAoaS5lLiB0byBjbG9zZVxuICAvLyB0aGUgZGlhbG9nIG9uIGEgc3VjY2Vzc2Z1bCBsb2dpbiBvciBkaXNwbGF5IHRoZSBlcnJvciBvbiBhIGZhaWxlZFxuICAvLyBsb2dpbikuXG4gIC8vXG4gIEFjY291bnRzLm9uUGFnZUxvYWRMb2dpbihmdW5jdGlvbiAoYXR0ZW1wdEluZm8pIHtcbiAgICAvLyBJZ25vcmUgaWYgd2UgaGF2ZSBhIGxlZnQgb3ZlciBsb2dpbiBhdHRlbXB0IGZvciBhIHNlcnZpY2UgdGhhdCBpcyBubyBsb25nZXIgcmVnaXN0ZXJlZC5cbiAgICBpZiAoZ2V0TG9naW5TZXJ2aWNlcygpLm1hcCgoeyBuYW1lIH0pID0+IG5hbWUpLmluY2x1ZGVzKGF0dGVtcHRJbmZvLnR5cGUpKVxuICAgICAgbG9naW5SZXN1bHRDYWxsYmFjayhhdHRlbXB0SW5mby50eXBlLCBhdHRlbXB0SW5mby5lcnJvcik7XG4gIH0pO1xuXG4gIGxldCBkb25lQ2FsbGJhY2s7XG5cbiAgQWNjb3VudHMub25SZXNldFBhc3N3b3JkTGluayhmdW5jdGlvbiAodG9rZW4sIGRvbmUpIHtcbiAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ3Jlc2V0UGFzc3dvcmRUb2tlbicsIHRva2VuKTtcbiAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgJ3Jlc2V0UGFzc3dvcmRUb2tlbicpO1xuICAgIGRvbmVDYWxsYmFjayA9IGRvbmU7XG5cbiAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5vblJlc2V0UGFzc3dvcmRIb29rKCk7XG4gIH0pO1xuXG4gIEFjY291bnRzLm9uRW5yb2xsbWVudExpbmsoZnVuY3Rpb24gKHRva2VuLCBkb25lKSB7XG4gICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdlbnJvbGxBY2NvdW50VG9rZW4nLCB0b2tlbik7XG4gICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsICdlbnJvbGxBY2NvdW50VG9rZW4nKTtcbiAgICBkb25lQ2FsbGJhY2sgPSBkb25lO1xuXG4gICAgQWNjb3VudHMudWkuX29wdGlvbnMub25FbnJvbGxBY2NvdW50SG9vaygpO1xuICB9KTtcblxuICBBY2NvdW50cy5vbkVtYWlsVmVyaWZpY2F0aW9uTGluayhmdW5jdGlvbiAodG9rZW4sIGRvbmUpIHtcbiAgICBBY2NvdW50cy52ZXJpZnlFbWFpbCh0b2tlbiwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBpZiAoISBlcnJvcikge1xuICAgICAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2p1c3RWZXJpZmllZEVtYWlsJywgdHJ1ZSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCAnanVzdFZlcmlmaWVkRW1haWwnKTtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMub25TaWduZWRJbkhvb2soKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5vblZlcmlmeUVtYWlsSG9vaygpO1xuICAgICAgfVxuXG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuLy8vXG4vLy8gTE9HSU4gV0lUSE9VVCBQQVNTV09SRFxuLy8vXG5cbi8vIE1ldGhvZCBjYWxsZWQgYnkgYSB1c2VyIHRvIHJlcXVlc3QgYSBwYXNzd29yZCByZXNldCBlbWFpbC4gVGhpcyBpc1xuLy8gdGhlIHN0YXJ0IG9mIHRoZSByZXNldCBwcm9jZXNzLlxuTWV0ZW9yLm1ldGhvZHMoe1xuICBsb2dpbldpdGhvdXRQYXNzd29yZDogZnVuY3Rpb24gKHsgZW1haWwsIHVzZXJuYW1lID0gbnVsbCB9KSB7XG4gICAgaWYgKHVzZXJuYW1lICE9PSBudWxsKSB7XG4gICAgICBjaGVjayh1c2VybmFtZSwgU3RyaW5nKTtcblxuICAgICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7ICRvcjogW3tcbiAgICAgICAgICBcInVzZXJuYW1lXCI6IHVzZXJuYW1lLCBcImVtYWlscy5hZGRyZXNzXCI6IHsgJGV4aXN0czogMSB9XG4gICAgICAgIH0sIHtcbiAgICAgICAgICBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICAgIGlmICghdXNlcilcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XG5cbiAgICAgIGVtYWlsID0gdXNlci5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBjaGVjayhlbWFpbCwgU3RyaW5nKTtcblxuICAgICAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7IFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWwgfSk7XG4gICAgICBpZiAoIXVzZXIpXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgbm90IGZvdW5kXCIpO1xuICAgIH1cblxuICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb24pIHtcbiAgICAgIGlmICghdXNlci5lbWFpbHNbMF0udmVyaWZpZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiRW1haWwgbm90IHZlcmlmaWVkXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIEFjY291bnRzLnNlbmRMb2dpbkVtYWlsKHVzZXIuX2lkLCBlbWFpbCk7XG4gIH0sXG59KTtcblxuLyoqXG4gKiBAc3VtbWFyeSBTZW5kIGFuIGVtYWlsIHdpdGggYSBsaW5rIHRoZSB1c2VyIGNhbiB1c2UgdmVyaWZ5IHRoZWlyIGVtYWlsIGFkZHJlc3MuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byBzZW5kIGVtYWlsIHRvLlxuICogQHBhcmFtIHtTdHJpbmd9IFtlbWFpbF0gT3B0aW9uYWwuIFdoaWNoIGFkZHJlc3Mgb2YgdGhlIHVzZXIncyB0byBzZW5kIHRoZSBlbWFpbCB0by4gVGhpcyBhZGRyZXNzIG11c3QgYmUgaW4gdGhlIHVzZXIncyBgZW1haWxzYCBsaXN0LiBEZWZhdWx0cyB0byB0aGUgZmlyc3QgdW52ZXJpZmllZCBlbWFpbCBpbiB0aGUgbGlzdC5cbiAqL1xuQWNjb3VudHMuc2VuZExvZ2luRW1haWwgPSBmdW5jdGlvbiAodXNlcklkLCBhZGRyZXNzKSB7XG4gIC8vIFhYWCBBbHNvIGdlbmVyYXRlIGEgbGluayB1c2luZyB3aGljaCBzb21lb25lIGNhbiBkZWxldGUgdGhpc1xuICAvLyBhY2NvdW50IGlmIHRoZXkgb3duIHNhaWQgYWRkcmVzcyBidXQgd2VyZW4ndCB0aG9zZSB3aG8gY3JlYXRlZFxuICAvLyB0aGlzIGFjY291bnQuXG5cbiAgLy8gTWFrZSBzdXJlIHRoZSB1c2VyIGV4aXN0cywgYW5kIGFkZHJlc3MgaXMgb25lIG9mIHRoZWlyIGFkZHJlc3Nlcy5cbiAgdmFyIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh1c2VySWQpO1xuICBpZiAoIXVzZXIpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgZmluZCB1c2VyXCIpO1xuICAvLyBwaWNrIHRoZSBmaXJzdCB1bnZlcmlmaWVkIGFkZHJlc3MgaWYgd2Ugd2VyZW4ndCBwYXNzZWQgYW4gYWRkcmVzcy5cbiAgaWYgKCFhZGRyZXNzKSB7XG4gICAgdmFyIGVtYWlsID0gKHVzZXIuZW1haWxzIHx8IFtdKS5maW5kKCh7IHZlcmlmaWVkIH0pID0+ICF2ZXJpZmllZCk7XG4gICAgYWRkcmVzcyA9IChlbWFpbCB8fCB7fSkuYWRkcmVzcztcbiAgfVxuICAvLyBtYWtlIHN1cmUgd2UgaGF2ZSBhIHZhbGlkIGFkZHJlc3NcbiAgaWYgKCFhZGRyZXNzIHx8ICEodXNlci5lbWFpbHMgfHwgW10pLm1hcCgoeyBhZGRyZXNzIH0pID0+IGFkZHJlc3MpLmluY2x1ZGVzKGFkZHJlc3MpKVxuICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1Y2ggZW1haWwgYWRkcmVzcyBmb3IgdXNlci5cIik7XG5cblxuICB2YXIgdG9rZW5SZWNvcmQgPSB7XG4gICAgdG9rZW46IFJhbmRvbS5zZWNyZXQoKSxcbiAgICBhZGRyZXNzOiBhZGRyZXNzLFxuICAgIHdoZW46IG5ldyBEYXRlKCl9O1xuICBNZXRlb3IudXNlcnMudXBkYXRlKFxuICAgIHtfaWQ6IHVzZXJJZH0sXG4gICAgeyRwdXNoOiB7J3NlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2Vucyc6IHRva2VuUmVjb3JkfX0pO1xuXG4gIC8vIGJlZm9yZSBwYXNzaW5nIHRvIHRlbXBsYXRlLCB1cGRhdGUgdXNlciBvYmplY3Qgd2l0aCBuZXcgdG9rZW5cbiAgTWV0ZW9yLl9lbnN1cmUodXNlciwgJ3NlcnZpY2VzJywgJ2VtYWlsJyk7XG4gIGlmICghdXNlci5zZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMpIHtcbiAgICB1c2VyLnNlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2VucyA9IFtdO1xuICB9XG4gIHVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zLnB1c2godG9rZW5SZWNvcmQpO1xuXG4gIHZhciBsb2dpblVybCA9IEFjY291bnRzLnVybHMudmVyaWZ5RW1haWwodG9rZW5SZWNvcmQudG9rZW4pO1xuXG4gIHZhciBvcHRpb25zID0ge1xuICAgIHRvOiBhZGRyZXNzLFxuICAgIGZyb206IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5mcm9tXG4gICAgICA/IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5mcm9tKHVzZXIpXG4gICAgICA6IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb20sXG4gICAgc3ViamVjdDogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLnN1YmplY3QodXNlcilcbiAgfTtcblxuICBpZiAodHlwZW9mIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC50ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb3B0aW9ucy50ZXh0ID1cbiAgICAgIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC50ZXh0KHVzZXIsIGxvZ2luVXJsKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmh0bWwgPT09ICdmdW5jdGlvbicpXG4gICAgb3B0aW9ucy5odG1sID1cbiAgICAgIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5odG1sKHVzZXIsIGxvZ2luVXJsKTtcblxuICBpZiAodHlwZW9mIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmhlYWRlcnMgPT09ICdvYmplY3QnKSB7XG4gICAgb3B0aW9ucy5oZWFkZXJzID0gQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuaGVhZGVycztcbiAgfVxuXG4gIEVtYWlsLnNlbmQob3B0aW9ucyk7XG59O1xuXG4vLyBDaGVjayBmb3IgaW5zdGFsbGVkIGFjY291bnRzLXBhc3N3b3JkIGRlcGVuZGVuY3kuXG5pZiAoQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMpIHtcbiAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkID0ge1xuICAgIHN1YmplY3Q6IGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgIHJldHVybiBcIkxvZ2luIG9uIFwiICsgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWU7XG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbih1c2VyLCB1cmwpIHtcbiAgICAgIHZhciBncmVldGluZyA9ICh1c2VyLnByb2ZpbGUgJiYgdXNlci5wcm9maWxlLm5hbWUpID9cbiAgICAgICAgICAgIChcIkhlbGxvIFwiICsgdXNlci5wcm9maWxlLm5hbWUgKyBcIixcIikgOiBcIkhlbGxvLFwiO1xuICAgICAgcmV0dXJuIGAke2dyZWV0aW5nfVxuVG8gbG9naW4sIHNpbXBseSBjbGljayB0aGUgbGluayBiZWxvdy5cbiR7dXJsfVxuVGhhbmtzLlxuYDtcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGdldExvZ2luU2VydmljZXMgfSBmcm9tICcuLi8uLi9oZWxwZXJzLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ3NlcnZpY2VzTGlzdCcsIGZ1bmN0aW9uKCkge1xuICBsZXQgc2VydmljZXMgPSBnZXRMb2dpblNlcnZpY2VzKCk7XG4gIGlmIChQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddKSB7XG4gICAgc2VydmljZXMucHVzaCh7bmFtZTogJ3Bhc3N3b3JkJ30pO1xuICB9XG4gIGxldCBmaWVsZHMgPSB7fTtcbiAgLy8gUHVibGlzaCB0aGUgZXhpc3Rpbmcgc2VydmljZXMgZm9yIGEgdXNlciwgb25seSBuYW1lIG9yIG5vdGhpbmcgZWxzZS5cbiAgc2VydmljZXMuZm9yRWFjaChzZXJ2aWNlID0+IGZpZWxkc1tgc2VydmljZXMuJHtzZXJ2aWNlLm5hbWV9Lm5hbWVgXSA9IDEpO1xuICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoeyBfaWQ6IHRoaXMudXNlcklkIH0sIHsgZmllbGRzOiBmaWVsZHN9KTtcbn0pO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxubGV0IExpbms7XG50cnkgeyBMaW5rID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJykuTGluazsgfSBjYXRjaChlKSB7fVxuXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICBsYWJlbCxcbiAgICAgIGhyZWYgPSBudWxsLFxuICAgICAgdHlwZSxcbiAgICAgIGRpc2FibGVkID0gZmFsc2UsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBvbkNsaWNrXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHR5cGUgPT0gJ2xpbmsnKSB7XG4gICAgICAvLyBTdXBwb3J0IFJlYWN0IFJvdXRlci5cbiAgICAgIGlmIChMaW5rICYmIGhyZWYpIHtcbiAgICAgICAgcmV0dXJuIDxMaW5rIHRvPXsgaHJlZiB9wqBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT57IGxhYmVsIH08L0xpbms+O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIDxhwqBocmVmPXsgaHJlZiB9wqBjbGFzc05hbWU9eyBjbGFzc05hbWUgfSBvbkNsaWNrPXsgb25DbGljayB9PnsgbGFiZWwgfTwvYT47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiA8YnV0dG9uIGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9XG4gICAgICAgICAgICAgICAgICAgdHlwZT17IHR5cGUgfcKgXG4gICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyBkaXNhYmxlZCB9XG4gICAgICAgICAgICAgICAgICAgb25DbGljaz17IG9uQ2xpY2sgfT57IGxhYmVsIH08L2J1dHRvbj47XG4gIH1cbn1cblxuQnV0dG9uLnByb3BUeXBlcyA9IHtcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbkFjY291bnRzLnVpLkJ1dHRvbiA9IEJ1dHRvbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgJy4vQnV0dG9uLmpzeCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuZXhwb3J0IGNsYXNzIEJ1dHRvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGxldCB7IGJ1dHRvbnMgPSB7fSwgY2xhc3NOYW1lID0gXCJidXR0b25zXCIgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgIHtPYmplY3Qua2V5cyhidXR0b25zKS5tYXAoKGlkLCBpKSA9PlxuICAgICAgICAgIDxBY2NvdW50cy51aS5CdXR0b24gey4uLmJ1dHRvbnNbaWRdfSBrZXk9e2l9IC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59O1xuXG5BY2NvdW50cy51aS5CdXR0b25zID0gQnV0dG9ucztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBGaWVsZCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtb3VudDogdHJ1ZVxuICAgIH07XG4gIH1cblxuICB0cmlnZ2VyVXBkYXRlKCkge1xuICAgIC8vIFRyaWdnZXIgYW4gb25DaGFuZ2Ugb24gaW5pdGFsIGxvYWQsIHRvIHN1cHBvcnQgYnJvd3NlciBwcmVmaWxsZWQgdmFsdWVzLlxuICAgIGNvbnN0IHsgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHRoaXMuaW5wdXQgJiYgb25DaGFuZ2UpIHtcbiAgICAgIG9uQ2hhbmdlKHsgdGFyZ2V0OiB7IHZhbHVlOiB0aGlzLmlucHV0LnZhbHVlIH0gfSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgLy8gUmUtbW91bnQgY29tcG9uZW50IHNvIHRoYXQgd2UgZG9uJ3QgZXhwb3NlIGJyb3dzZXIgcHJlZmlsbGVkIHBhc3N3b3JkcyBpZiB0aGUgY29tcG9uZW50IHdhc1xuICAgIC8vIGEgcGFzc3dvcmQgYmVmb3JlIGFuZCBub3cgc29tZXRoaW5nIGVsc2UuXG4gICAgaWYgKHByZXZQcm9wcy5pZCAhPT0gdGhpcy5wcm9wcy5pZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91bnQ6IGZhbHNlfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLnN0YXRlLm1vdW50KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHttb3VudDogdHJ1ZX0pO1xuICAgICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkLFxuICAgICAgaGludCxcbiAgICAgIGxhYmVsLFxuICAgICAgdHlwZSA9ICd0ZXh0JyxcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgcmVxdWlyZWQgPSBmYWxzZSxcbiAgICAgIGNsYXNzTmFtZSA9IFwiZmllbGRcIixcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IFwiXCIsXG4gICAgICBtZXNzYWdlLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgbW91bnQgPSB0cnVlIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICh0eXBlID09ICdub3RpY2UnKSB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT57IGxhYmVsIH08L2Rpdj47XG4gICAgfVxuICAgIHJldHVybiBtb3VudCA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPXsgaWQgfT57IGxhYmVsIH08L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZD17IGlkIH1cbiAgICAgICAgICByZWY9eyAocmVmKSA9PiB0aGlzLmlucHV0ID0gcmVmIH1cbiAgICAgICAgICB0eXBlPXsgdHlwZSB9XG4gICAgICAgICAgb25DaGFuZ2U9eyBvbkNoYW5nZSB9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9eyBoaW50IH1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9eyBkZWZhdWx0VmFsdWUgfVxuICAgICAgICAvPlxuICAgICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtbJ21lc3NhZ2UnLCBtZXNzYWdlLnR5cGVdLmpvaW4oJyAnKS50cmltKCl9PlxuICAgICAgICAgICAge21lc3NhZ2UubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgfVxufVxuXG5GaWVsZC5wcm9wVHlwZXMgPSB7XG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuQWNjb3VudHMudWkuRmllbGQgPSBGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCAnLi9GaWVsZC5qc3gnO1xuXG5leHBvcnQgY2xhc3MgRmllbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBmaWVsZHMgPSB7fSwgY2xhc3NOYW1lID0gXCJmaWVsZHNcIiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cbiAgICAgICAge09iamVjdC5rZXlzKGZpZWxkcykubWFwKChpZCwgaSkgPT5cbiAgICAgICAgICA8QWNjb3VudHMudWkuRmllbGQgey4uLmZpZWxkc1tpZF19IGtleT17aX0gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQWNjb3VudHMudWkuRmllbGRzID0gRmllbGRzO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5pbXBvcnQgJy4vRmllbGRzLmpzeCc7XG5pbXBvcnQgJy4vQnV0dG9ucy5qc3gnO1xuaW1wb3J0ICcuL0Zvcm1NZXNzYWdlLmpzeCc7XG5pbXBvcnQgJy4vUGFzc3dvcmRPclNlcnZpY2UuanN4JztcbmltcG9ydCAnLi9Tb2NpYWxCdXR0b25zLmpzeCc7XG5pbXBvcnQgJy4vRm9ybU1lc3NhZ2VzLmpzeCc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLmZvcm07XG4gICAgaWYgKGZvcm0pIHtcbiAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgICAgIG9hdXRoU2VydmljZXMsXG4gICAgICBmaWVsZHMsXG4gICAgICBidXR0b25zLFxuICAgICAgZXJyb3IsXG4gICAgICBtZXNzYWdlcyxcbiAgICAgIHRyYW5zbGF0ZSxcbiAgICAgIHJlYWR5ID0gdHJ1ZSxcbiAgICAgIGNsYXNzTmFtZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybVxuICAgICAgICByZWY9eyhyZWYpID0+IHRoaXMuZm9ybSA9IHJlZn1cbiAgICAgICAgY2xhc3NOYW1lPXtbY2xhc3NOYW1lLCByZWFkeSA/IFwicmVhZHlcIiA6IG51bGxdLmpvaW4oJyAnKX1cbiAgICAgICAgY2xhc3NOYW1lPVwiYWNjb3VudHMtdWlcIlxuICAgICAgICBub1ZhbGlkYXRlXG4gICAgICA+XG4gICAgICAgIDxBY2NvdW50cy51aS5GaWVsZHMgZmllbGRzPXsgZmllbGRzIH0gLz5cbiAgICAgICAgPEFjY291bnRzLnVpLkJ1dHRvbnMgYnV0dG9ucz17IGJ1dHRvbnMgfSAvPlxuICAgICAgICA8QWNjb3VudHMudWkuUGFzc3dvcmRPclNlcnZpY2Ugb2F1dGhTZXJ2aWNlcz17IG9hdXRoU2VydmljZXMgfSB0cmFuc2xhdGU9eyB0cmFuc2xhdGUgfSAvPlxuICAgICAgICA8QWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyBvYXV0aFNlcnZpY2VzPXsgb2F1dGhTZXJ2aWNlcyB9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5Gb3JtTWVzc2FnZXMgbWVzc2FnZXM9e21lc3NhZ2VzfSAvPlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7XG4gIG9hdXRoU2VydmljZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGZpZWxkczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBidXR0b25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHRyYW5zbGF0ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJlYWR5OiBQcm9wVHlwZXMuYm9vbFxufTtcblxuQWNjb3VudHMudWkuRm9ybSA9IEZvcm07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1NZXNzYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBtZXNzYWdlLCB0eXBlLCBjbGFzc05hbWUgPSBcIm1lc3NhZ2VcIiwgc3R5bGUgPSB7fSwgZGVwcmVjYXRlZCB9ID0gdGhpcy5wcm9wcztcbiAgICAvLyBYWFggQ2hlY2sgZm9yIGRlcHJlY2F0aW9ucy5cbiAgICBpZiAoZGVwcmVjYXRlZCkge1xuICAgICAgLy8gRm91bmQgYmFja3dvcmRzIGNvbXBhdGliaWxpdHkgaXNzdWUuXG4gICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgb3ZlcnJpZGluZyBBY2NvdW50cy51aS5Gb3JtIGFuZCB1c2luZyBGb3JtTWVzc2FnZSwgdGhlIHVzZSBvZiBGb3JtTWVzc2FnZSBpbiBGb3JtIGhhcyBiZWVuIGRlcHJlYWN0ZWQgaW4gdjEuMi4xMSwgdXBkYXRlIHlvdXIgaW1wbGVtZW50YXRpb24gdG8gdXNlIEZvcm1NZXNzYWdlczogaHR0cHM6Ly9naXRodWIuY29tL3N0dWRpb2ludGVyYWN0L2FjY291bnRzLXVpLyNkZXByZWNhdGlvbnMnKTtcbiAgICB9XG4gICAgbWVzc2FnZSA9IGlzT2JqZWN0KG1lc3NhZ2UpID8gbWVzc2FnZS5tZXNzYWdlIDogbWVzc2FnZTsgLy8gSWYgbWVzc2FnZSBpcyBvYmplY3QsIHRoZW4gdHJ5IHRvIGdldCBtZXNzYWdlIGZyb20gaXRcbiAgICByZXR1cm4gbWVzc2FnZSA/IChcbiAgICAgIDxkaXYgc3R5bGU9eyBzdHlsZSB9wqBcbiAgICAgICAgICAgY2xhc3NOYW1lPXtbIGNsYXNzTmFtZSwgdHlwZSBdLmpvaW4oJyAnKX0+eyBtZXNzYWdlIH08L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgfVxufVxuXG5BY2NvdW50cy51aS5Gb3JtTWVzc2FnZSA9IEZvcm1NZXNzYWdlO1xuIiwiaW1wb3J0IFJlYWN0LCB7wqBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuZXhwb3J0IGNsYXNzIEZvcm1NZXNzYWdlcyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlcyA9IFtdLCBjbGFzc05hbWUgPSBcIm1lc3NhZ2VzXCIsIHN0eWxlID0ge30gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlc1wiPlxuICAgICAgICB7bWVzc2FnZXNcbiAgICAgICAgICAuZmlsdGVyKG1lc3NhZ2UgPT4gISgnZmllbGQnIGluIG1lc3NhZ2UpKVxuICAgICAgICAgIC5tYXAoKHvCoG1lc3NhZ2UsIHR5cGUgfSwgaSkgPT5cbiAgICAgICAgICA8QWNjb3VudHMudWkuRm9ybU1lc3NhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2V9XG4gICAgICAgICAgICB0eXBlPXt0eXBlfVxuICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLkZvcm1NZXNzYWdlcyA9IEZvcm1NZXNzYWdlcztcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBjcmVhdGVDb250YWluZXIgfSBmcm9tICdtZXRlb3IvcmVhY3QtbWV0ZW9yLWRhdGEnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgeyBUOW4gfSBmcm9tICdtZXRlb3Ivc29mdHdhcmVyZXJvOmFjY291bnRzLXQ5bic7XG5pbXBvcnQge8KgS0VZX1BSRUZJWCB9IGZyb20gJy4uLy4uL2xvZ2luX3Nlc3Npb24uanMnO1xuaW1wb3J0ICcuL0Zvcm0uanN4JztcblxuaW1wb3J0IHtcbiAgU1RBVEVTLFxuICBwYXNzd29yZFNpZ251cEZpZWxkcyxcbiAgdmFsaWRhdGVFbWFpbCxcbiAgdmFsaWRhdGVQYXNzd29yZCxcbiAgdmFsaWRhdGVVc2VybmFtZSxcbiAgbG9naW5SZXN1bHRDYWxsYmFjayxcbiAgZ2V0TG9naW5TZXJ2aWNlcyxcbiAgaGFzUGFzc3dvcmRTZXJ2aWNlLFxuICBjYXBpdGFsaXplXG59IGZyb20gJy4uLy4uL2hlbHBlcnMuanMnO1xuXG5mdW5jdGlvbiBpbmRleEJ5KGFycmF5LCBrZXkpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24ob2JqKSB7XG4gICAgcmVzdWx0W29ialtrZXldXSA9IG9iajtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmNsYXNzIExvZ2luRm9ybSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIGxldCB7XG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBsb2dpblBhdGgsXG4gICAgICBzaWduVXBQYXRoLFxuICAgICAgcmVzZXRQYXNzd29yZFBhdGgsXG4gICAgICBwcm9maWxlUGF0aCxcbiAgICAgIGNoYW5nZVBhc3N3b3JkUGF0aFxuICAgIH0gPSBwcm9wcztcblxuICAgIGlmIChmb3JtU3RhdGUgPT09IFNUQVRFUy5TSUdOX0lOICYmIFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ10pIHtcbiAgICAgIGNvbnNvbGUud2FybignRG8gbm90IGZvcmNlIHRoZSBzdGF0ZSB0byBTSUdOX0lOIG9uIEFjY291bnRzLnVpLkxvZ2luRm9ybSwgaXQgd2lsbCBtYWtlIGl0IGltcG9zc2libGUgdG8gcmVzZXQgcGFzc3dvcmQgaW4geW91ciBhcHAsIHRoaXMgc3RhdGUgaXMgYWxzbyB0aGUgZGVmYXVsdCBzdGF0ZSBpZiBsb2dnZWQgb3V0LCBzbyBubyBuZWVkIHRvIGZvcmNlIGl0LicpO1xuICAgIH1cblxuICAgIC8vIFNldCBpbml0YWwgc3RhdGUuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1lc3NhZ2VzOiBbXSxcbiAgICAgIHdhaXRpbmc6IHRydWUsXG4gICAgICBmb3JtU3RhdGU6IGZvcm1TdGF0ZSA/IGZvcm1TdGF0ZSA6IEFjY291bnRzLnVzZXIoKSA/IFNUQVRFUy5QUk9GSUxFIDogU1RBVEVTLlNJR05fSU4sXG4gICAgICBvblN1Ym1pdEhvb2s6IHByb3BzLm9uU3VibWl0SG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblN1Ym1pdEhvb2ssXG4gICAgICBvblNpZ25lZEluSG9vazogcHJvcHMub25TaWduZWRJbkhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25TaWduZWRJbkhvb2ssXG4gICAgICBvblNpZ25lZE91dEhvb2s6IHByb3BzLm9uU2lnbmVkT3V0SG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblNpZ25lZE91dEhvb2ssXG4gICAgICBvblByZVNpZ25VcEhvb2s6IHByb3BzLm9uUHJlU2lnblVwSG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblByZVNpZ25VcEhvb2ssXG4gICAgICBvblBvc3RTaWduVXBIb29rOiBwcm9wcy5vblBvc3RTaWduVXBIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uUG9zdFNpZ25VcEhvb2ssXG4gICAgfTtcbiAgICB0aGlzLnRyYW5zbGF0ZSA9IHRoaXMudHJhbnNsYXRlLmJpbmQodGhpcyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoeyB3YWl0aW5nOiBmYWxzZSwgcmVhZHk6IHRydWUgfSkpO1xuICAgIGxldCBjaGFuZ2VTdGF0ZSA9IFNlc3Npb24uZ2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnKTtcbiAgICBzd2l0Y2ggKGNoYW5nZVN0YXRlKSB7XG4gICAgICBjYXNlICdlbnJvbGxBY2NvdW50VG9rZW4nOlxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLkVOUk9MTF9BQ0NPVU5UXG4gICAgICAgIH0pKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jlc2V0UGFzc3dvcmRUb2tlbic6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUEFTU1dPUkRfQ0hBTkdFXG4gICAgICAgIH0pKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsIG51bGwpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnanVzdFZlcmlmaWVkRW1haWwnOlxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEVcbiAgICAgICAgfSkpO1xuICAgICAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIEFkZCBkZWZhdWx0IGZpZWxkIHZhbHVlcyBvbmNlIHRoZSBmb3JtIGRpZCBtb3VudCBvbiB0aGUgY2xpZW50XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMsIG5leHRDb250ZXh0KSB7XG4gICAgaWYgKG5leHRQcm9wcy5mb3JtU3RhdGUgJiYgbmV4dFByb3BzLmZvcm1TdGF0ZSAhPT0gdGhpcy5zdGF0ZS5mb3JtU3RhdGUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmb3JtU3RhdGU6IG5leHRQcm9wcy5mb3JtU3RhdGUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICBpZiAoIXByZXZQcm9wcy51c2VyICE9PSAhdGhpcy5wcm9wcy51c2VyKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZm9ybVN0YXRlOiB0aGlzLnByb3BzLnVzZXIgPyBTVEFURVMuUFJPRklMRSA6IFNUQVRFUy5TSUdOX0lOXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB0cmFuc2xhdGUodGV4dCkge1xuICAgIC8vIGlmICh0aGlzLnByb3BzLnQpIHtcbiAgICAvLyAgIHJldHVybiB0aGlzLnByb3BzLnQodGV4dCk7XG4gICAgLy8gfVxuICAgIHJldHVybiBUOW4uZ2V0KHRleHQpO1xuICB9XG5cbiAgdmFsaWRhdGVGaWVsZChmaWVsZCwgdmFsdWUpIHtcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBzd2l0Y2goZmllbGQpIHtcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlRW1haWwodmFsdWUsXG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICk7XG4gICAgICBjYXNlICdwYXNzd29yZCc6XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVBhc3N3b3JkKHZhbHVlLFxuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICB0aGlzLmNsZWFyTWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgY2FzZSAndXNlcm5hbWUnOlxuICAgICAgICByZXR1cm4gdmFsaWRhdGVVc2VybmFtZSh2YWx1ZSxcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICBmb3JtU3RhdGUsXG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWVPckVtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlclVzZXJuYW1lT3JFbWFpbCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCd1c2VybmFtZU9yRW1haWwnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8IFwiXCIsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAndXNlcm5hbWVPckVtYWlsJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgndXNlcm5hbWVPckVtYWlsJyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFVzZXJuYW1lRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWUnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyVXNlcm5hbWUnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgndXNlcm5hbWUnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8IFwiXCIsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAndXNlcm5hbWUnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCd1c2VybmFtZScpLFxuICAgIH07XG4gIH1cblxuICBnZXRFbWFpbEZpZWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2VtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlckVtYWlsJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2VtYWlsJyksXG4gICAgICB0eXBlOiAnZW1haWwnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUuZW1haWwgfHwgXCJcIixcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICdlbWFpbCcpLFxuICAgICAgbWVzc2FnZTogdGhpcy5nZXRNZXNzYWdlRm9yRmllbGQoJ2VtYWlsJyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFBhc3N3b3JkRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAncGFzc3dvcmQnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyUGFzc3dvcmQnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgncGFzc3dvcmQnKSxcbiAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5wYXNzd29yZCB8fCBcIlwiLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ3Bhc3N3b3JkJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgncGFzc3dvcmQnKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0U2V0UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjaG9vc2VQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJylcbiAgICB9O1xuICB9XG5cbiAgZ2V0TmV3UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJOZXdQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCduZXdQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgnbmV3UGFzc3dvcmQnKSxcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGZpZWxkLCBldnQpIHtcbiAgICBsZXQgdmFsdWUgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgIHN3aXRjaCAoZmllbGQpIHtcbiAgICAgIGNhc2UgJ3Bhc3N3b3JkJzogYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBbZmllbGRdOiB2YWx1ZSB9KTtcbiAgICB0aGlzLnNldERlZmF1bHRGaWVsZFZhbHVlcyh7wqBbZmllbGRdOiB2YWx1ZSB9KTtcbiAgfVxuXG4gIGZpZWxkcygpIHtcbiAgICBjb25zdCBsb2dpbkZpZWxkcyA9IFtdO1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKCFoYXNQYXNzd29yZFNlcnZpY2UoKSAmJiBnZXRMb2dpblNlcnZpY2VzKCkubGVuZ3RoID09IDApIHtcbiAgICAgIGxvZ2luRmllbGRzLnB1c2goe1xuICAgICAgICBsYWJlbDogJ05vIGxvZ2luIHNlcnZpY2UgYWRkZWQsIGkuZS4gYWNjb3VudHMtcGFzc3dvcmQnLFxuICAgICAgICB0eXBlOiAnbm90aWNlJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGhhc1Bhc3N3b3JkU2VydmljZSgpICYmIGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTikge1xuICAgICAgaWYgKFtcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXNzd29yZFNpZ251cEZpZWxkcygpID09PSBcIlVTRVJOQU1FX09OTFlcIikge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0VXNlcm5hbWVGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFtcbiAgICAgICAgXCJFTUFJTF9PTkxZXCIsXG4gICAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRFbWFpbEZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIVtcbiAgICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFBhc3N3b3JkRmllbGQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhhc1Bhc3N3b3JkU2VydmljZSgpICYmIGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgaWYgKFtcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxcIixcbiAgICAgICAgXCJVU0VSTkFNRV9PTkxZXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFVzZXJuYW1lRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChbXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICAgIFwiRU1BSUxfT05MWVwiLFxuICAgICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0RW1haWxGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFtcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKE9iamVjdC5hc3NpZ24odGhpcy5nZXRFbWFpbEZpZWxkKCksIHtyZXF1aXJlZDogZmFsc2V9KSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghW1xuICAgICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0UGFzc3dvcmRGaWVsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9SRVNFVCkge1xuICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldEVtYWlsRmllbGQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpKSB7XG4gICAgICBpZiAoTWV0ZW9yLmlzQ2xpZW50ICYmICFBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5nZXQoJ3Jlc2V0UGFzc3dvcmRUb2tlbicpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgICAgfVxuICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldE5ld1Bhc3N3b3JkRmllbGQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd0Vucm9sbEFjY291bnRGb3JtKCkpIHtcbiAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRTZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXhCeShsb2dpbkZpZWxkcywgJ2lkJyk7XG4gIH1cblxuICBidXR0b25zKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGxvZ2luUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLmxvZ2luUGF0aCxcbiAgICAgIHNpZ25VcFBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5zaWduVXBQYXRoLFxuICAgICAgcmVzZXRQYXNzd29yZFBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXNldFBhc3N3b3JkUGF0aCxcbiAgICAgIGNoYW5nZVBhc3N3b3JkUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLmNoYW5nZVBhc3N3b3JkUGF0aCxcbiAgICAgIHByb2ZpbGVQYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMucHJvZmlsZVBhdGgsXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyB1c2VyIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlLCB3YWl0aW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCBsb2dpbkJ1dHRvbnMgPSBbXTtcblxuICAgIGlmICh1c2VyICYmIGZvcm1TdGF0ZSA9PSBTVEFURVMuUFJPRklMRSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3NpZ25PdXQnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25PdXQnKSxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc2lnbk91dC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93Q3JlYXRlQWNjb3VudExpbmsoKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3N3aXRjaFRvU2lnblVwJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdzaWduVXAnKSxcbiAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICBocmVmOiBzaWduVXBQYXRoLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvU2lnblVwLmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVAgfHwgZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9SRVNFVCkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3N3aXRjaFRvU2lnbkluJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdzaWduSW4nKSxcbiAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICBocmVmOiBsb2dpblBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9TaWduSW4uYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd0ZvcmdvdFBhc3N3b3JkTGluaygpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9QYXNzd29yZFJlc2V0JyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdmb3Jnb3RQYXNzd29yZCcpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IHJlc2V0UGFzc3dvcmRQYXRoLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvUGFzc3dvcmRSZXNldC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodXNlciAmJiAhW1xuICAgICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKVxuICAgICAgJiYgZm9ybVN0YXRlID09IFNUQVRFUy5QUk9GSUxFXG4gICAgICAmJiAodXNlci5zZXJ2aWNlcyAmJiAncGFzc3dvcmQnIGluIHVzZXIuc2VydmljZXMpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9DaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnY2hhbmdlUGFzc3dvcmQnKSxcbiAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICBocmVmOiBjaGFuZ2VQYXNzd29yZFBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9DaGFuZ2VQYXNzd29yZC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc2lnblVwJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdzaWduVXAnKSxcbiAgICAgICAgdHlwZTogaGFzUGFzc3dvcmRTZXJ2aWNlKCkgPyAnc3VibWl0JyA6ICdsaW5rJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnYWN0aXZlJyxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gdGhpcy5zaWduVXAuYmluZCh0aGlzLCB7fSkgOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93U2lnbkluTGluaygpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc2lnbkluJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdzaWduSW4nKSxcbiAgICAgICAgdHlwZTogaGFzUGFzc3dvcmRTZXJ2aWNlKCkgPyAnc3VibWl0JyA6ICdsaW5rJyxcbiAgICAgICAgY2xhc3NOYW1lOiAnYWN0aXZlJyxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gdGhpcy5zaWduSW4uYmluZCh0aGlzKSA6IG51bGxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlBBU1NXT1JEX1JFU0VUKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnZW1haWxSZXNldExpbmsnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3Jlc2V0WW91clBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogdGhpcy5wYXNzd29yZFJlc2V0LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dQYXNzd29yZENoYW5nZUZvcm0oKSB8fCB0aGlzLnNob3dFbnJvbGxBY2NvdW50Rm9ybSgpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnY2hhbmdlUGFzc3dvcmQnLFxuICAgICAgICBsYWJlbDogKHRoaXMuc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpID8gdGhpcy50cmFuc2xhdGUoJ2NoYW5nZVBhc3N3b3JkJykgOiB0aGlzLnRyYW5zbGF0ZSgnc2V0UGFzc3dvcmQnKSksXG4gICAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogdGhpcy5wYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpXG4gICAgICB9KTtcblxuICAgICAgaWYgKEFjY291bnRzLnVzZXIoKSkge1xuICAgICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdzd2l0Y2hUb1NpZ25PdXQnLFxuICAgICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnY2FuY2VsJyksXG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIGhyZWY6IHByb2ZpbGVQYXRoLFxuICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9TaWduT3V0LmJpbmQodGhpcylcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdjYW5jZWxSZXNldFBhc3N3b3JkJyxcbiAgICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2NhbmNlbCcpLFxuICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICBvbkNsaWNrOiB0aGlzLmNhbmNlbFJlc2V0UGFzc3dvcmQuYmluZCh0aGlzKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU29ydCB0aGUgYnV0dG9uIGFycmF5IHNvIHRoYXQgdGhlIHN1Ym1pdCBidXR0b24gYWx3YXlzIGNvbWVzIGZpcnN0LCBhbmRcbiAgICAvLyBidXR0b25zIHNob3VsZCBhbHNvIGNvbWUgYmVmb3JlIGxpbmtzLlxuICAgIGxvZ2luQnV0dG9ucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBiLnR5cGUgPT0gJ3N1Ym1pdCcgJiZcbiAgICAgICAgYS50eXBlICE9IHVuZGVmaW5lZCkgLSAoXG4gICAgICAgICAgYS50eXBlID09ICdzdWJtaXQnICYmXG4gICAgICAgICAgYi50eXBlICE9IHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5kZXhCeShsb2dpbkJ1dHRvbnMsICdpZCcpO1xuICB9XG5cbiAgc2hvd1NpZ25JbkxpbmsoKXtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gJiYgUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXTtcbiAgfVxuXG4gIHNob3dQYXNzd29yZENoYW5nZUZvcm0oKSB7XG4gICAgcmV0dXJuKFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ11cbiAgICAgICYmIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9DSEFOR0UpO1xuICB9XG5cbiAgc2hvd0Vucm9sbEFjY291bnRGb3JtKCkge1xuICAgIHJldHVybihQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddXG4gICAgICAmJiB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuRU5ST0xMX0FDQ09VTlQpO1xuICB9XG5cbiAgc2hvd0NyZWF0ZUFjY291bnRMaW5rKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiAmJiAhQWNjb3VudHMuX29wdGlvbnMuZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uICYmIFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ107XG4gIH1cblxuICBzaG93Rm9yZ290UGFzc3dvcmRMaW5rKCkge1xuICAgIHJldHVybiAhdGhpcy5wcm9wcy51c2VyXG4gICAgICAmJiB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTlxuICAgICAgJiYgW1wiVVNFUk5BTUVfQU5EX0VNQUlMXCIsIFwiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCIsIFwiRU1BSUxfT05MWVwiXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gc3RvcmUgZmllbGQgdmFsdWVzIHdoaWxlIHVzaW5nIHRoZSBmb3JtLlxuICAgKi9cbiAgc2V0RGVmYXVsdEZpZWxkVmFsdWVzKGRlZmF1bHRzKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0cyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgdG8gc2V0RGVmYXVsdEZpZWxkVmFsdWVzIGlzIG5vdCBvZiB0eXBlIG9iamVjdCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudHNfdWknLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzOiBwYXNzd29yZFNpZ251cEZpZWxkcygpLFxuICAgICAgICAuLi50aGlzLmdldERlZmF1bHRGaWVsZFZhbHVlcygpLFxuICAgICAgICAuLi5kZWZhdWx0cyxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGdldCBmaWVsZCB2YWx1ZXMgd2hlbiBzd2l0Y2hpbmcgc3RhdGVzIGluIHRoZSBmb3JtLlxuICAgKi9cbiAgZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRGaWVsZFZhbHVlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRzX3VpJykgfHwgbnVsbCk7XG4gICAgICBpZiAoZGVmYXVsdEZpZWxkVmFsdWVzXG4gICAgICAgICYmIGRlZmF1bHRGaWVsZFZhbHVlcy5wYXNzd29yZFNpZ251cEZpZWxkcyA9PT0gcGFzc3dvcmRTaWdudXBGaWVsZHMoKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdEZpZWxkVmFsdWVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gY2xlYXIgZmllbGQgdmFsdWVzIHdoZW4gc2lnbmluZyBpbiwgdXAgb3Igb3V0LlxuICAgKi9cbiAgY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnRzX3VpJyk7XG4gICAgfVxuICB9XG5cbiAgc3dpdGNoVG9TaWduVXAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9VUCxcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBzd2l0Y2hUb1NpZ25JbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX0lOLFxuICAgICAgLi4udGhpcy5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvUGFzc3dvcmRSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QQVNTV09SRF9SRVNFVCxcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBzd2l0Y2hUb0NoYW5nZVBhc3N3b3JkKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBBU1NXT1JEX0NIQU5HRSxcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBzd2l0Y2hUb1NpZ25PdXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNhbmNlbFJlc2V0UGFzc3dvcmQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgncmVzZXRQYXNzd29yZFRva2VuJywgbnVsbCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX0lOLFxuICAgICAgbWVzc2FnZXM6IFtdLFxuICAgIH0pO1xuICB9XG5cbiAgc2lnbk91dCgpIHtcbiAgICBNZXRlb3IubG9nb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX0lOLFxuICAgICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdGF0ZS5vblNpZ25lZE91dEhvb2soKTtcbiAgICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgIH0pO1xuICB9XG5cbiAgc2lnbkluKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHVzZXJuYW1lID0gbnVsbCxcbiAgICAgIGVtYWlsID0gbnVsbCxcbiAgICAgIHVzZXJuYW1lT3JFbWFpbCA9IG51bGwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9va1xuICAgIH3CoD0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBsZXQgbG9naW5TZWxlY3RvcjtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcblxuICAgIGlmICh1c2VybmFtZU9yRW1haWwgIT09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lT3JFbWFpbCkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXCJlcnJvci5hY2NvdW50cy51c2VybmFtZVJlcXVpcmVkXCIsIHRoaXMuc3RhdGUuZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKFtcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICAgIHRoaXMubG9naW5XaXRob3V0UGFzc3dvcmQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9naW5TZWxlY3RvciA9IHVzZXJuYW1lT3JFbWFpbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodXNlcm5hbWUgIT09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLm9uU3VibWl0SG9vayhcImVycm9yLmFjY291bnRzLnVzZXJuYW1lUmVxdWlyZWRcIiwgdGhpcy5zdGF0ZS5mb3JtU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBsb2dpblNlbGVjdG9yID0geyB1c2VybmFtZTogdXNlcm5hbWUgfTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAodXNlcm5hbWVPckVtYWlsID09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaWYgKFtcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIl0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgICB0aGlzLmxvZ2luV2l0aG91dFBhc3N3b3JkKCk7XG4gICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2luU2VsZWN0b3IgPSB7IGVtYWlsIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFbXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpXG4gICAgICAmJiAhdGhpcy52YWxpZGF0ZUZpZWxkKCdwYXNzd29yZCcsIHBhc3N3b3JkKSkge1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIE1ldGVvci5sb2dpbldpdGhQYXNzd29yZChsb2dpblNlbGVjdG9yLCBwYXNzd29yZCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLGZvcm1TdGF0ZSk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGxvZ2luUmVzdWx0Q2FsbGJhY2soKCkgPT4gdGhpcy5zdGF0ZS5vblNpZ25lZEluSG9vaygpKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUsXG4gICAgICAgICAgICBwYXNzd29yZDogbnVsbCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG9hdXRoQnV0dG9ucygpIHtcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSwgd2FpdGluZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgb2F1dGhCdXR0b25zID0gW107XG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiB8fCBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVAgKSB7XG4gICAgICBpZihBY2NvdW50cy5vYXV0aCkge1xuICAgICAgICBBY2NvdW50cy5vYXV0aC5zZXJ2aWNlTmFtZXMoKS5tYXAoKHNlcnZpY2UpID0+IHtcbiAgICAgICAgICBvYXV0aEJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgICBpZDogc2VydmljZSxcbiAgICAgICAgICAgIGxhYmVsOiBjYXBpdGFsaXplKHNlcnZpY2UpLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgICAgICB0eXBlOiAnYnV0dG9uJyxcbiAgICAgICAgICAgIGNsYXNzTmFtZTogYGJ0bi0ke3NlcnZpY2V9ICR7c2VydmljZX1gLFxuICAgICAgICAgICAgb25DbGljazogdGhpcy5vYXV0aFNpZ25Jbi5iaW5kKHRoaXMsIHNlcnZpY2UpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW5kZXhCeShvYXV0aEJ1dHRvbnMsICdpZCcpO1xuICB9XG5cbiAgb2F1dGhTaWduSW4oc2VydmljZU5hbWUpIHtcbiAgICBjb25zdCB7IHVzZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUsIHdhaXRpbmcsIG9uU3VibWl0SG9vayB9ID0gdGhpcy5zdGF0ZTtcbiAgICAvL1RoYW5rcyBKb3NoIE93ZW5zIGZvciB0aGlzIG9uZS5cbiAgICBmdW5jdGlvbiBjYXBpdGFsU2VydmljZSgpIHtcbiAgICAgIHJldHVybiBzZXJ2aWNlTmFtZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHNlcnZpY2VOYW1lLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIGlmKHNlcnZpY2VOYW1lID09PSAnbWV0ZW9yLWRldmVsb3Blcicpe1xuICAgICAgc2VydmljZU5hbWUgPSAnbWV0ZW9yRGV2ZWxvcGVyQWNjb3VudCc7XG4gICAgfVxuXG4gICAgY29uc3QgbG9naW5XaXRoU2VydmljZSA9IE1ldGVvcltcImxvZ2luV2l0aFwiICsgY2FwaXRhbFNlcnZpY2UoKV07XG5cbiAgICBsZXQgb3B0aW9ucyA9IHt9OyAvLyB1c2UgZGVmYXVsdCBzY29wZSB1bmxlc3Mgc3BlY2lmaWVkXG4gICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlTmFtZV0pXG4gICAgICBvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucyA9IEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlTmFtZV07XG4gICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZU5hbWVdKVxuICAgICAgb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuID0gQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbltzZXJ2aWNlTmFtZV07XG4gICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZU5hbWVdKVxuICAgICAgb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0ID0gQWNjb3VudHMudWkuX29wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlTmFtZV07XG5cbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICBjb25zdCBzZWxmID0gdGhpc1xuICAgIGxvZ2luV2l0aFNlcnZpY2Uob3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICBvblN1Ym1pdEhvb2soZXJyb3IsZm9ybVN0YXRlKTtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFIH0pO1xuICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIGxvZ2luUmVzdWx0Q2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHRoaXMuc3RhdGUub25TaWduZWRJbkhvb2soKSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfVxuXG4gIHNpZ25VcChvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICB1c2VybmFtZSA9IG51bGwsXG4gICAgICBlbWFpbCA9IG51bGwsXG4gICAgICB1c2VybmFtZU9yRW1haWwgPSBudWxsLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBvblN1Ym1pdEhvb2tcbiAgICB9wqA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG5cbiAgICBpZiAodXNlcm5hbWUgIT09IG51bGwpIHtcbiAgICAgIGlmICggIXRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZSkgKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUub25TdWJtaXRIb29rKFwiZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZFwiLCB0aGlzLnN0YXRlLmZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoW1xuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpICYmICF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpICkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLm9uU3VibWl0SG9vayhcImVycm9yLmFjY291bnRzLnVzZXJuYW1lUmVxdWlyZWRcIiwgdGhpcy5zdGF0ZS5mb3JtU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgnZW1haWwnLCBlbWFpbCkpe1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmVtYWlsID0gZW1haWw7XG4gICAgfVxuXG4gICAgaWYgKFtcbiAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgIC8vIEdlbmVyYXRlIGEgcmFuZG9tIHBhc3N3b3JkLlxuICAgICAgb3B0aW9ucy5wYXNzd29yZCA9IE1ldGVvci51dWlkKCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdwYXNzd29yZCcsIHBhc3N3b3JkKSkge1xuICAgICAgb25TdWJtaXRIb29rKFwiSW52YWxpZCBwYXNzd29yZFwiLCBmb3JtU3RhdGUpO1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgY29uc3QgU2lnblVwID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgICAgIEFjY291bnRzLmNyZWF0ZVVzZXIoX29wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGUoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWApKSB7XG4gICAgICAgICAgICBvblN1Ym1pdEhvb2soYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb25TdWJtaXRIb29rKFwidW5rbm93bl9lcnJvclwiLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvblN1Ym1pdEhvb2sobnVsbCwgZm9ybVN0YXRlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSwgcGFzc3dvcmQ6IG51bGwgfSk7XG4gICAgICAgICAgbGV0IHVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjayh0aGlzLnN0YXRlLm9uUG9zdFNpZ25VcEhvb2suYmluZCh0aGlzLCBfb3B0aW9ucywgdXNlcikpO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcbiAgICAgIC8vIEFsbG93IGZvciBQcm9taXNlcyB0byByZXR1cm4uXG4gICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuc3RhdGUub25QcmVTaWduVXBIb29rKG9wdGlvbnMpO1xuICAgICAgaWYgKHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHByb21pc2UudGhlbihTaWduVXAuYmluZCh0aGlzLCBvcHRpb25zKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgU2lnblVwKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxvZ2luV2l0aG91dFBhc3N3b3JkKCl7XG4gICAgY29uc3Qge1xuICAgICAgZW1haWwgPSAnJyxcbiAgICAgIHVzZXJuYW1lT3JFbWFpbCA9ICcnLFxuICAgICAgd2FpdGluZyxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9va1xuICAgIH3CoD0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICh3YWl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmFsaWRhdGVGaWVsZCgnZW1haWwnLCBlbWFpbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiB0cnVlIH0pO1xuXG4gICAgICBBY2NvdW50cy5sb2dpbldpdGhvdXRQYXNzd29yZCh7IGVtYWlsOiBlbWFpbCB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIiwgJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZSh0aGlzLnRyYW5zbGF0ZShcImluZm8uZW1haWxTZW50XCIpLCAnc3VjY2VzcycsIDUwMDApO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsIGZvcm1TdGF0ZSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lT3JFbWFpbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiB0cnVlIH0pO1xuXG4gICAgICBBY2NvdW50cy5sb2dpbldpdGhvdXRQYXNzd29yZCh7IGVtYWlsOiB1c2VybmFtZU9yRW1haWwsIHVzZXJuYW1lOiB1c2VybmFtZU9yRW1haWwgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodGhpcy50cmFuc2xhdGUoXCJpbmZvLmVtYWlsU2VudFwiKSwgJ3N1Y2Nlc3MnLCA1MDAwKTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGVyck1zZyA9IG51bGw7XG4gICAgICBpZiAoW1wiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGVyck1zZyA9IHRoaXMudHJhbnNsYXRlKFwiZXJyb3IuYWNjb3VudHMuaW52YWxpZF9lbWFpbFwiKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBlcnJNc2cgPSB0aGlzLnRyYW5zbGF0ZShcImVycm9yLmFjY291bnRzLmludmFsaWRfZW1haWxcIik7XG4gICAgICB9XG4gICAgICB0aGlzLnNob3dNZXNzYWdlKGVyck1zZywnd2FybmluZycpO1xuICAgICAgb25TdWJtaXRIb29rKGVyck1zZywgZm9ybVN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBwYXNzd29yZFJlc2V0KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGVtYWlsID0gJycsXG4gICAgICB3YWl0aW5nLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHdhaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICBpZiAodGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IHRydWUgfSk7XG5cbiAgICAgIEFjY291bnRzLmZvcmdvdFBhc3N3b3JkKHsgZW1haWw6IGVtYWlsIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKHRoaXMudHJhbnNsYXRlKFwiaW5mby5lbWFpbFNlbnRcIiksICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcGFzc3dvcmRDaGFuZ2UoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcGFzc3dvcmQsXG4gICAgICBuZXdQYXNzd29yZCxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9vayxcbiAgICAgIG9uU2lnbmVkSW5Ib29rLFxuICAgIH3CoD0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdwYXNzd29yZCcsIG5ld1Bhc3N3b3JkKSl7XG4gICAgICBvblN1Ym1pdEhvb2soJ2Vyci5taW5DaGFyJyxmb3JtU3RhdGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0b2tlbiA9IEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLmdldCgncmVzZXRQYXNzd29yZFRva2VuJyk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgdG9rZW4gPSBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5nZXQoJ2Vucm9sbEFjY291bnRUb2tlbicpO1xuICAgIH1cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIEFjY291bnRzLnJlc2V0UGFzc3dvcmQodG9rZW4sIG5ld1Bhc3N3b3JkLCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIiwgJ2Vycm9yJyk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodGhpcy50cmFuc2xhdGUoJ2luZm8ucGFzc3dvcmRDaGFuZ2VkJyksICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCBudWxsKTtcbiAgICAgICAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2Vucm9sbEFjY291bnRUb2tlbicsIG51bGwpO1xuICAgICAgICAgIG9uU2lnbmVkSW5Ib29rKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEFjY291bnRzLmNoYW5nZVBhc3N3b3JkKHBhc3N3b3JkLCBuZXdQYXNzd29yZCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKCdpbmZvLnBhc3N3b3JkQ2hhbmdlZCcsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzaG93TWVzc2FnZShtZXNzYWdlLCB0eXBlLCBjbGVhclRpbWVvdXQsIGZpZWxkKXtcbiAgICBtZXNzYWdlID0gdGhpcy50cmFuc2xhdGUobWVzc2FnZSkudHJpbSgpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKCh7wqBtZXNzYWdlcyA9IFtdIH0pID0+IHtcbiAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIC4uLihmaWVsZCAmJiB7wqBmaWVsZMKgfSksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gIHvCoG1lc3NhZ2VzIH07XG4gICAgICB9KTtcbiAgICAgIGlmIChjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5oaWRlTWVzc2FnZVRpbW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG1lc3NhZ2UgdGhhdCB0aW1lZCBvdXQuXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH0sIGNsZWFyVGltZW91dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TWVzc2FnZUZvckZpZWxkKGZpZWxkKSB7XG4gICAgY29uc3Qge8KgbWVzc2FnZXMgPSBbXSB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gbWVzc2FnZXMuZmluZCgoe8KgZmllbGQ6a2V5IH0pID0+IGtleSA9PT0gZmllbGQpO1xuICB9XG5cbiAgY2xlYXJNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoe8KgbWVzc2FnZXMgPSBbXcKgfSkgPT4gKHtcbiAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzLmZpbHRlcigoe8KgbWVzc2FnZTphIH0pID0+IGEgIT09IG1lc3NhZ2UpLFxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyTWVzc2FnZXMoKSB7XG4gICAgaWYgKHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVNZXNzYWdlVGltb3V0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzOiBbXSB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAvLyBYWFggQ2hlY2sgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgUmVhY3RET00ucmVuZGVyKDxBY2NvdW50cy51aS5GaWVsZCBtZXNzYWdlPVwidGVzdFwiIC8+LCBjb250YWluZXIpO1xuICAgICAgaWYgKGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZXNzYWdlJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRm91bmQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgaXNzdWUgd2l0aCAxLjMueFxuICAgICAgICBjb25zb2xlLndhcm4oYEltcGxlbWVudGF0aW9ucyBvZiBBY2NvdW50cy51aS5GaWVsZCBtdXN0IHJlbmRlciBtZXNzYWdlIGluIHYxLjIuMTEuXG4gICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3N0dWRpb2ludGVyYWN0L2FjY291bnRzLXVpLyNkZXByZWNhdGlvbnNgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5oaWRlTWVzc2FnZVRpbW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLm9hdXRoQnV0dG9ucygpO1xuICAgIC8vIEJhY2t3b3JkcyBjb21wYXRpYmlsaXR5IHdpdGggdjEuMi54LlxuICAgIGNvbnN0IHvCoG1lc3NhZ2VzID0gW10gfcKgPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB7XG4gICAgICBkZXByZWNhdGVkOiB0cnVlLFxuICAgICAgbWVzc2FnZTogbWVzc2FnZXMubWFwKCh7wqBtZXNzYWdlIH0pID0+IG1lc3NhZ2UpLmpvaW4oJywgJyksXG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPEFjY291bnRzLnVpLkZvcm1cbiAgICAgICAgb2F1dGhTZXJ2aWNlcz17dGhpcy5vYXV0aEJ1dHRvbnMoKX1cbiAgICAgICAgZmllbGRzPXt0aGlzLmZpZWxkcygpfcKgXG4gICAgICAgIGJ1dHRvbnM9e3RoaXMuYnV0dG9ucygpfVxuICAgICAgICB7Li4udGhpcy5zdGF0ZX1cbiAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cbiAgICAgICAgdHJhbnNsYXRlPXt0ZXh0ID0+IHRoaXMudHJhbnNsYXRlKHRleHQpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5Mb2dpbkZvcm0ucHJvcFR5cGVzID0ge1xuICBmb3JtU3RhdGU6IFByb3BUeXBlcy5zeW1ib2wsXG4gIGxvZ2luUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2lnblVwUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHByb2ZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjaGFuZ2VQYXNzd29yZFBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG59O1xuTG9naW5Gb3JtLmRlZmF1bHRQcm9wcyA9IHtcbiAgZm9ybVN0YXRlOiBudWxsLFxuICBsb2dpblBhdGg6IG51bGwsXG4gIHNpZ25VcFBhdGg6IG51bGwsXG4gIHJlc2V0UGFzc3dvcmRQYXRoOiBudWxsLFxuICBwcm9maWxlUGF0aDogbnVsbCxcbiAgY2hhbmdlUGFzc3dvcmRQYXRoOiBudWxsLFxufTtcblxuQWNjb3VudHMudWkuTG9naW5Gb3JtID0gTG9naW5Gb3JtO1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVDb250YWluZXIoKCkgPT4ge1xuICAvLyBMaXN0ZW4gZm9yIHRoZSB1c2VyIHRvIGxvZ2luL2xvZ291dCBhbmQgdGhlIHNlcnZpY2VzIGxpc3QgdG8gdGhlIHVzZXIuXG4gIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZpY2VzTGlzdCcpO1xuICByZXR1cm4gKHtcbiAgICB1c2VyOiBBY2NvdW50cy51c2VyKCksXG4gIH0pO1xufSwgTG9naW5Gb3JtKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgeyBUOW4gfSBmcm9tICdtZXRlb3Ivc29mdHdhcmVyZXJvOmFjY291bnRzLXQ5bic7XG5pbXBvcnQgeyBoYXNQYXNzd29yZFNlcnZpY2UgfSBmcm9tICcuLi8uLi9oZWxwZXJzLmpzJztcblxuZXhwb3J0IGNsYXNzIFBhc3N3b3JkT3JTZXJ2aWNlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGhhc1Bhc3N3b3JkU2VydmljZTogaGFzUGFzc3dvcmRTZXJ2aWNlKCksXG4gICAgICBzZXJ2aWNlczogT2JqZWN0LmtleXMocHJvcHMub2F1dGhTZXJ2aWNlcykubWFwKHNlcnZpY2UgPT4ge1xuICAgICAgICByZXR1cm4gcHJvcHMub2F1dGhTZXJ2aWNlc1tzZXJ2aWNlXS5sYWJlbFxuICAgICAgfSlcbiAgICB9O1xuICB9XG5cbiAgdHJhbnNsYXRlKHRleHQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy50cmFuc2xhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnRyYW5zbGF0ZSh0ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIFQ5bi5nZXQodGV4dCk7XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGxldCB7IGNsYXNzTmFtZSA9IFwicGFzc3dvcmQtb3Itc2VydmljZVwiLCBzdHlsZSA9IHt9IH0gPSB0aGlzLnByb3BzO1xuICAgIGxldCB7IGhhc1Bhc3N3b3JkU2VydmljZSwgc2VydmljZXMgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGFiZWxzID0gc2VydmljZXM7XG4gICAgaWYgKHNlcnZpY2VzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGxhYmVscyA9IFtdO1xuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UgJiYgc2VydmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17IHN0eWxlIH3CoGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PlxuICAgICAgICAgIHsgYCR7dGhpcy50cmFuc2xhdGUoJ29yVXNlJyl9ICR7IGxhYmVscy5qb2luKCcgLyAnKSB9YCB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUGFzc3dvcmRPclNlcnZpY2UucHJvcFR5cGVzID0ge1xuICBvYXV0aFNlcnZpY2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5BY2NvdW50cy51aS5QYXNzd29yZE9yU2VydmljZSA9IFBhc3N3b3JkT3JTZXJ2aWNlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAnLi9CdXR0b24uanN4JztcbmltcG9ydCB7QWNjb3VudHN9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuXG5leHBvcnQgY2xhc3MgU29jaWFsQnV0dG9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBvYXV0aFNlcnZpY2VzID0ge30sIGNsYXNzTmFtZSA9IFwic29jaWFsLWJ1dHRvbnNcIiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4oXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PlxuICAgICAgICB7T2JqZWN0LmtleXMob2F1dGhTZXJ2aWNlcykubWFwKChpZCwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiA8QWNjb3VudHMudWkuQnV0dG9uIHsuLi5vYXV0aFNlcnZpY2VzW2lkXX0ga2V5PXtpfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLlNvY2lhbEJ1dHRvbnMgPSBTb2NpYWxCdXR0b25zO1xuIl19
