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
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var serviceName, message, labels;

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

},"main_server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/main_server.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
let redirect, STATES;
module.link("./imports/helpers.js", {
  redirect(v) {
    redirect = v;
  },

  STATES(v) {
    STATES = v;
  }

}, 1);
module.link("./imports/api/server/loginWithoutPassword.js");
module.link("./imports/api/server/servicesListPublication.js");
let LoginForm;
module.link("./imports/ui/components/LoginForm.jsx", {
  default(v) {
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
  onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  onSignedInHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  onSignedOutHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
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
// packages/epotek_accounts-ui/imports/helpers.js                                                                      //
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

function validatePassword(password = '', showMessage, clearMessage) {
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/login_session.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
// packages/epotek_accounts-ui/imports/api/server/loginWithoutPassword.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
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
          username: username,
          'emails.address': {
            $exists: 1
          }
        }, {
          'emails.address': email
        }]
      });
      if (!user) throw new Meteor.Error(403, 'User not found');
      email = user.emails[0].address;
    } else {
      check(email, String);
      var user = Meteor.users.findOne({
        'emails.address': email
      });
      if (!user) throw new Meteor.Error(403, 'User not found');
    }

    if (Accounts.ui._options.requireEmailVerification) {
      if (!user.emails[0].verified) {
        throw new Meteor.Error(403, 'Email not verified');
      }
    }

    Accounts.sendLoginEmail(user._id, email);
  }
});
/**
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
  }) => address).includes(address)) throw new Error('No such email address for user.');
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
      return 'Login on ' + Accounts.emailTemplates.siteName;
    },
    text: function (user, url) {
      var greeting = user.profile && user.profile.name ? 'Hello ' + user.profile.name + ',' : 'Hello,';
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
// packages/epotek_accounts-ui/imports/api/server/servicesListPublication.js                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let getLoginServices;
module.link("../../helpers.js", {
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
// packages/epotek_accounts-ui/imports/ui/components/Button.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Field.jsx                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/Form.jsx                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/FormMessage.jsx                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/FormMessages.jsx                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    }, messages.filter(message => !('field' in message)).map(({
      message,
      type
    }, i) => React.createElement(Accounts.ui.FormMessage, {
      message: message,
      type: type,
      key: i
    })));
  }

}

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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
        this.showMessage(`error.accounts.${error.reason}` || 'unknown_error');
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');

          if (this.translate(`error.accounts.${error.reason}`)) {
            onSubmitHook(`error.accounts.${error.reason}`, formState);
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
          this.showMessage(`error.accounts.${error.reason}` || 'unknown_error', 'error');
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/epotek_accounts-ui/imports/ui/components/PasswordOrService.jsx                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
      }, `${this.translate('orUse')} ${labels.join(' / ')}`);
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
// packages/epotek_accounts-ui/imports/ui/components/SocialButtons.jsx                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/node_modules/meteor/epotek:accounts-ui/check-npm.js");
var exports = require("/node_modules/meteor/epotek:accounts-ui/main_server.js");

/* Exports */
Package._define("epotek:accounts-ui", exports);

})();

//# sourceURL=meteor://💻app/packages/epotek_accounts-ui.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2NoZWNrLW5wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL21haW5fc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy9hY2NvdW50c191aS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvaGVscGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9CdXR0b24uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0J1dHRvbnMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0ZpZWxkLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9GaWVsZHMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm0uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm1NZXNzYWdlLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZXBvdGVrOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9Gb3JtTWVzc2FnZXMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3giLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2Vwb3RlazphY2NvdW50cy11aS9pbXBvcnRzL3VpL2NvbXBvbmVudHMvUGFzc3dvcmRPclNlcnZpY2UuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9lcG90ZWs6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL1NvY2lhbEJ1dHRvbnMuanN4Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImRlZmF1bHQiLCJMb2dpbkZvcm0iLCJBY2NvdW50cyIsIlNUQVRFUyIsImxpbmsiLCJ2IiwicmVkaXJlY3QiLCJ2YWxpZGF0ZVBhc3N3b3JkIiwidmFsaWRhdGVFbWFpbCIsInZhbGlkYXRlVXNlcm5hbWUiLCJ1aSIsIl9vcHRpb25zIiwicmVxdWVzdFBlcm1pc3Npb25zIiwicmVxdWVzdE9mZmxpbmVUb2tlbiIsImZvcmNlQXBwcm92YWxQcm9tcHQiLCJyZXF1aXJlRW1haWxWZXJpZmljYXRpb24iLCJwYXNzd29yZFNpZ251cEZpZWxkcyIsIm1pbmltdW1QYXNzd29yZExlbmd0aCIsImxvZ2luUGF0aCIsInNpZ25VcFBhdGgiLCJyZXNldFBhc3N3b3JkUGF0aCIsInByb2ZpbGVQYXRoIiwiY2hhbmdlUGFzc3dvcmRQYXRoIiwiaG9tZVJvdXRlUGF0aCIsIm9uU3VibWl0SG9vayIsIm9uUHJlU2lnblVwSG9vayIsIlByb21pc2UiLCJyZXNvbHZlIiwib25Qb3N0U2lnblVwSG9vayIsIm9uRW5yb2xsQWNjb3VudEhvb2siLCJvblJlc2V0UGFzc3dvcmRIb29rIiwib25WZXJpZnlFbWFpbEhvb2siLCJvblNpZ25lZEluSG9vayIsIm9uU2lnbmVkT3V0SG9vayIsImVtYWlsUGF0dGVybiIsIlJlZ0V4cCIsImNvbmZpZyIsIm9wdGlvbnMiLCJWQUxJRF9LRVlTIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrZXkiLCJpbmNsdWRlcyIsIkVycm9yIiwic2VydmljZSIsInNjb3BlIiwiQXJyYXkiLCJ2YWx1ZSIsImhvb2siLCJwYXRoIiwiZXhwb3J0RGVmYXVsdCIsImxvZ2luQnV0dG9uc1Nlc3Npb24iLCJnZXRMb2dpblNlcnZpY2VzIiwiaGFzUGFzc3dvcmRTZXJ2aWNlIiwibG9naW5SZXN1bHRDYWxsYmFjayIsImNhcGl0YWxpemUiLCJicm93c2VySGlzdG9yeSIsInJlcXVpcmUiLCJlIiwiX2xvZ2luQnV0dG9uc1Nlc3Npb24iLCJTSUdOX0lOIiwiU3ltYm9sIiwiU0lHTl9VUCIsIlBST0ZJTEUiLCJQQVNTV09SRF9DSEFOR0UiLCJQQVNTV09SRF9SRVNFVCIsIkVOUk9MTF9BQ0NPVU5UIiwic2VydmljZXMiLCJQYWNrYWdlIiwib2F1dGgiLCJzZXJ2aWNlTmFtZXMiLCJzb3J0IiwibWFwIiwibmFtZSIsImVyciIsIkxvZ2luQ2FuY2VsbGVkRXJyb3IiLCJTZXJ2aWNlQ29uZmlndXJhdGlvbiIsIkNvbmZpZ0Vycm9yIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlbWFpbCIsInNob3dNZXNzYWdlIiwiY2xlYXJNZXNzYWdlIiwidGVzdCIsImxlbmd0aCIsInBhc3N3b3JkIiwiZXJyTXNnIiwidXNlcm5hbWUiLCJmb3JtU3RhdGUiLCJmaWVsZE5hbWUiLCJoaXN0b3J5Iiwic2V0VGltZW91dCIsIkZsb3dSb3V0ZXIiLCJnbyIsInB1c2giLCJwdXNoU3RhdGUiLCJzdHJpbmciLCJyZXBsYWNlIiwic3BsaXQiLCJ3b3JkIiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImpvaW4iLCJ2YWxpZGF0ZUtleSIsIktFWV9QUkVGSVgiLCJzZXQiLCJfc2V0IiwiU2Vzc2lvbiIsImdldCIsIm9uUGFnZUxvYWRMb2dpbiIsImF0dGVtcHRJbmZvIiwidHlwZSIsImVycm9yIiwiZG9uZUNhbGxiYWNrIiwib25SZXNldFBhc3N3b3JkTGluayIsInRva2VuIiwiZG9uZSIsIm9uRW5yb2xsbWVudExpbmsiLCJvbkVtYWlsVmVyaWZpY2F0aW9uTGluayIsInZlcmlmeUVtYWlsIiwibWV0aG9kcyIsImxvZ2luV2l0aG91dFBhc3N3b3JkIiwiY2hlY2siLCJTdHJpbmciLCJ1c2VyIiwidXNlcnMiLCJmaW5kT25lIiwiJG9yIiwiJGV4aXN0cyIsImVtYWlscyIsImFkZHJlc3MiLCJ2ZXJpZmllZCIsInNlbmRMb2dpbkVtYWlsIiwiX2lkIiwidXNlcklkIiwiZmluZCIsInRva2VuUmVjb3JkIiwiUmFuZG9tIiwic2VjcmV0Iiwid2hlbiIsIkRhdGUiLCJ1cGRhdGUiLCIkcHVzaCIsIl9lbnN1cmUiLCJ2ZXJpZmljYXRpb25Ub2tlbnMiLCJsb2dpblVybCIsInVybHMiLCJ0byIsImZyb20iLCJlbWFpbFRlbXBsYXRlcyIsImxvZ2luTm9QYXNzd29yZCIsInN1YmplY3QiLCJ0ZXh0IiwiaHRtbCIsImhlYWRlcnMiLCJFbWFpbCIsInNlbmQiLCJzaXRlTmFtZSIsInVybCIsImdyZWV0aW5nIiwicHJvZmlsZSIsInB1Ymxpc2giLCJmaWVsZHMiLCJCdXR0b24iLCJSZWFjdCIsIlByb3BUeXBlcyIsIkxpbmsiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJsYWJlbCIsImRpc2FibGVkIiwiY2xhc3NOYW1lIiwib25DbGljayIsInByb3BzIiwicHJvcFR5cGVzIiwiZnVuYyIsIkJ1dHRvbnMiLCJidXR0b25zIiwiaWQiLCJpIiwiRmllbGQiLCJjb25zdHJ1Y3RvciIsInN0YXRlIiwibW91bnQiLCJ0cmlnZ2VyVXBkYXRlIiwib25DaGFuZ2UiLCJpbnB1dCIsInRhcmdldCIsImNvbXBvbmVudERpZE1vdW50IiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwic2V0U3RhdGUiLCJoaW50IiwicmVxdWlyZWQiLCJkZWZhdWx0VmFsdWUiLCJtZXNzYWdlIiwicmVmIiwidHJpbSIsIkZpZWxkcyIsIkZvcm0iLCJSZWFjdERPTSIsImZvcm0iLCJhZGRFdmVudExpc3RlbmVyIiwicHJldmVudERlZmF1bHQiLCJvYXV0aFNlcnZpY2VzIiwibWVzc2FnZXMiLCJ0cmFuc2xhdGUiLCJyZWFkeSIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJib29sIiwiRm9ybU1lc3NhZ2UiLCJpc09iamVjdCIsIm9iaiIsInN0eWxlIiwiZGVwcmVjYXRlZCIsImNvbnNvbGUiLCJ3YXJuIiwiRm9ybU1lc3NhZ2VzIiwiZmlsdGVyIiwid2l0aFRyYWNrZXIiLCJUOW4iLCJpbmRleEJ5IiwiYXJyYXkiLCJyZXN1bHQiLCJ3YWl0aW5nIiwiYmluZCIsInByZXZTdGF0ZSIsImNoYW5nZVN0YXRlIiwiZ2V0RGVmYXVsdEZpZWxkVmFsdWVzIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsIm5leHRDb250ZXh0IiwidmFsaWRhdGVGaWVsZCIsImZpZWxkIiwiZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQiLCJoYW5kbGVDaGFuZ2UiLCJnZXRNZXNzYWdlRm9yRmllbGQiLCJnZXRVc2VybmFtZUZpZWxkIiwiZ2V0RW1haWxGaWVsZCIsImdldFBhc3N3b3JkRmllbGQiLCJnZXRTZXRQYXNzd29yZEZpZWxkIiwiZ2V0TmV3UGFzc3dvcmRGaWVsZCIsImV2dCIsInNldERlZmF1bHRGaWVsZFZhbHVlcyIsImxvZ2luRmllbGRzIiwiYXNzaWduIiwic2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSIsInNob3dFbnJvbGxBY2NvdW50Rm9ybSIsImxvZ2luQnV0dG9ucyIsInNpZ25PdXQiLCJzaG93Q3JlYXRlQWNjb3VudExpbmsiLCJzd2l0Y2hUb1NpZ25VcCIsInN3aXRjaFRvU2lnbkluIiwic2hvd0ZvcmdvdFBhc3N3b3JkTGluayIsInN3aXRjaFRvUGFzc3dvcmRSZXNldCIsInN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQiLCJzaWduVXAiLCJzaG93U2lnbkluTGluayIsInNpZ25JbiIsInBhc3N3b3JkUmVzZXQiLCJwYXNzd29yZENoYW5nZSIsInN3aXRjaFRvU2lnbk91dCIsImNhbmNlbFJlc2V0UGFzc3dvcmQiLCJhIiwiYiIsInVuZGVmaW5lZCIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImRlZmF1bHRzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZWZhdWx0RmllbGRWYWx1ZXMiLCJwYXJzZSIsImdldEl0ZW0iLCJjbGVhckRlZmF1bHRGaWVsZFZhbHVlcyIsInJlbW92ZUl0ZW0iLCJldmVudCIsImNsZWFyTWVzc2FnZXMiLCJsb2dvdXQiLCJ1c2VybmFtZU9yRW1haWwiLCJsb2dpblNlbGVjdG9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJyZWFzb24iLCJvYXV0aEJ1dHRvbnMiLCJvYXV0aFNpZ25JbiIsInNlcnZpY2VOYW1lIiwiY2FwaXRhbFNlcnZpY2UiLCJsb2dpbldpdGhTZXJ2aWNlIiwic2VsZiIsInV1aWQiLCJTaWduVXAiLCJjcmVhdGVVc2VyIiwicHJvbWlzZSIsInRoZW4iLCJmb3Jnb3RQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwicmVzZXRQYXNzd29yZCIsImNoYW5nZVBhc3N3b3JkIiwiY2xlYXJUaW1lb3V0IiwiaGlkZU1lc3NhZ2VUaW1vdXQiLCJjb21wb25lbnRXaWxsTW91bnQiLCJjb250YWluZXIiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJzeW1ib2wiLCJkZWZhdWx0UHJvcHMiLCJMb2dpbkZvcm1Db250YWluZXIiLCJzdWJzY3JpYmUiLCJQYXNzd29y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Q0FBQ0MsTUFBUCxDQUFjO0FBQUNnVSxlQUFhLEVBQUMsTUFBSUE7QUFBbkIsQ0FBZDtBQUFpRCxJQUFJdEosS0FBSjtBQUFVM0ssTUFBTSxDQUFDTSxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDSixTQUFPLENBQUNLLENBQUQsRUFBRztBQUFDb0ssU0FBSyxHQUFDcEssQ0FBTjtBQUFROztBQUFwQixDQUFwQixFQUEwQyxDQUExQztBQUE2Q1AsTUFBTSxDQUFDTSxJQUFQLENBQVksY0FBWjtBQUE0QixJQUFJRixRQUFKO0FBQWFKLE1BQU0sQ0FBQ00sSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNGLFVBQVEsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFlBQVEsR0FBQ0csQ0FBVDtBQUFXOztBQUF4QixDQUFuQyxFQUE2RCxDQUE3RDs7QUFJMUksTUFBTTBULGFBQU4sU0FBNEJ0SixLQUFLLENBQUNHLFNBQWxDLENBQTRDO0FBQ2pEQyxRQUFNLEdBQUc7QUFDUCxRQUFJO0FBQUVvQyxtQkFBYSxHQUFHLEVBQWxCO0FBQXNCakMsZUFBUyxHQUFHO0FBQWxDLFFBQXVELEtBQUtFLEtBQWhFO0FBQ0EsV0FDRTtBQUFLLGVBQVMsRUFBRUY7QUFBaEIsT0FDR3pJLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZeUssYUFBWixFQUEyQnhJLEdBQTNCLENBQStCLENBQUM4RyxFQUFELEVBQUtDLENBQUwsS0FBVztBQUN6QyxhQUFPLG9CQUFDLFFBQUQsQ0FBVSxFQUFWLENBQWEsTUFBYiw2QkFBd0J5QixhQUFhLENBQUMxQixFQUFELENBQXJDO0FBQTJDLFdBQUcsRUFBRUM7QUFBaEQsU0FBUDtBQUNELEtBRkEsQ0FESCxDQURGO0FBT0Q7O0FBVmdEOztBQWFuRHRMLFFBQVEsQ0FBQ1EsRUFBVCxDQUFZcVQsYUFBWixHQUE0QkEsYUFBNUIsQyIsImZpbGUiOiIvcGFja2FnZXMvZXBvdGVrX2FjY291bnRzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuLy9cbi8vIGNoZWNrTnBtVmVyc2lvbnMoe1xuLy8gICBcInJlYWN0XCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyAgIFwicmVhY3QtZG9tXCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyB9KTtcbiIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYWNjb3VudHNfdWkuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyc7XG5pbXBvcnQgeyByZWRpcmVjdCwgU1RBVEVTIH0gZnJvbSAnLi9pbXBvcnRzL2hlbHBlcnMuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyc7XG5pbXBvcnQgJy4vaW1wb3J0cy9hcGkvc2VydmVyL3NlcnZpY2VzTGlzdFB1YmxpY2F0aW9uLmpzJztcbmltcG9ydCBMb2dpbkZvcm0gZnJvbSAnLi9pbXBvcnRzL3VpL2NvbXBvbmVudHMvTG9naW5Gb3JtLmpzeCc7XG5cbmV4cG9ydCB7IExvZ2luRm9ybSBhcyBkZWZhdWx0LCBBY2NvdW50cywgU1RBVEVTIH07XG4iLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7XG4gIHJlZGlyZWN0LFxuICB2YWxpZGF0ZVBhc3N3b3JkLFxuICB2YWxpZGF0ZUVtYWlsLFxuICB2YWxpZGF0ZVVzZXJuYW1lXG59IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbi8qKlxuICogQHN1bW1hcnkgQWNjb3VudHMgVUlcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJPZiBBY2NvdW50c1xuICovXG5BY2NvdW50cy51aSA9IHt9O1xuXG5BY2NvdW50cy51aS5fb3B0aW9ucyA9IHtcbiAgcmVxdWVzdFBlcm1pc3Npb25zOiBbXSxcbiAgcmVxdWVzdE9mZmxpbmVUb2tlbjoge30sXG4gIGZvcmNlQXBwcm92YWxQcm9tcHQ6IHt9LFxuICByZXF1aXJlRW1haWxWZXJpZmljYXRpb246IGZhbHNlLFxuICBwYXNzd29yZFNpZ251cEZpZWxkczogJ0VNQUlMX09OTFlfTk9fUEFTU1dPUkQnLFxuICBtaW5pbXVtUGFzc3dvcmRMZW5ndGg6IDcsXG4gIGxvZ2luUGF0aDogJy8nLFxuICBzaWduVXBQYXRoOiBudWxsLFxuICByZXNldFBhc3N3b3JkUGF0aDogbnVsbCxcbiAgcHJvZmlsZVBhdGg6ICcvJyxcbiAgY2hhbmdlUGFzc3dvcmRQYXRoOiBudWxsLFxuICBob21lUm91dGVQYXRoOiAnLycsXG4gIG9uU3VibWl0SG9vazogKCkgPT4ge30sXG4gIG9uUHJlU2lnblVwSG9vazogKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKCkpLFxuICBvblBvc3RTaWduVXBIb29rOiAoKSA9PiB7fSxcbiAgb25FbnJvbGxBY2NvdW50SG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMubG9naW5QYXRofWApLFxuICBvblJlc2V0UGFzc3dvcmRIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5sb2dpblBhdGh9YCksXG4gIG9uVmVyaWZ5RW1haWxIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5wcm9maWxlUGF0aH1gKSxcbiAgb25TaWduZWRJbkhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLmhvbWVSb3V0ZVBhdGh9YCksXG4gIG9uU2lnbmVkT3V0SG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMuaG9tZVJvdXRlUGF0aH1gKSxcbiAgZW1haWxQYXR0ZXJuOiBuZXcgUmVnRXhwKCdbXkBdK0BbXkAuXXsyLH0uW14uQF0rJylcbn07XG5cbi8qKlxuICogQHN1bW1hcnkgQ29uZmlndXJlIHRoZSBiZWhhdmlvciBvZiBbYDxBY2NvdW50cy51aS5Mb2dpbkZvcm0gLz5gXSgjcmVhY3QtYWNjb3VudHMtdWkpLlxuICogQGFueXdoZXJlXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zIFdoaWNoIFtwZXJtaXNzaW9uc10oI3JlcXVlc3RwZXJtaXNzaW9ucykgdG8gcmVxdWVzdCBmcm9tIHRoZSB1c2VyIGZvciBlYWNoIGV4dGVybmFsIHNlcnZpY2UuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuIFRvIGFzayB0aGUgdXNlciBmb3IgcGVybWlzc2lvbiB0byBhY3Qgb24gdGhlaXIgYmVoYWxmIHdoZW4gb2ZmbGluZSwgbWFwIHRoZSByZWxldmFudCBleHRlcm5hbCBzZXJ2aWNlIHRvIGB0cnVlYC4gQ3VycmVudGx5IG9ubHkgc3VwcG9ydGVkIHdpdGggR29vZ2xlLiBTZWUgW01ldGVvci5sb2dpbldpdGhFeHRlcm5hbFNlcnZpY2VdKCNtZXRlb3JfbG9naW53aXRoZXh0ZXJuYWxzZXJ2aWNlKSBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdCBJZiB0cnVlLCBmb3JjZXMgdGhlIHVzZXIgdG8gYXBwcm92ZSB0aGUgYXBwJ3MgcGVybWlzc2lvbnMsIGV2ZW4gaWYgcHJldmlvdXNseSBhcHByb3ZlZC4gQ3VycmVudGx5IG9ubHkgc3VwcG9ydGVkIHdpdGggR29vZ2xlLlxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMgV2hpY2ggZmllbGRzIHRvIGRpc3BsYXkgaW4gdGhlIHVzZXIgY3JlYXRpb24gZm9ybS4gT25lIG9mICdgVVNFUk5BTUVfQU5EX0VNQUlMYCcsICdgVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMYCcsICdgVVNFUk5BTUVfT05MWWAnLCAnYEVNQUlMX09OTFlgJywgb3IgJ2BOT19QQVNTV09SRGAnIChkZWZhdWx0KS5cbiAqL1xuQWNjb3VudHMudWkuY29uZmlnID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAvLyB2YWxpZGF0ZSBvcHRpb25zIGtleXNcbiAgY29uc3QgVkFMSURfS0VZUyA9IFtcbiAgICAncGFzc3dvcmRTaWdudXBGaWVsZHMnLFxuICAgICdyZXF1ZXN0UGVybWlzc2lvbnMnLFxuICAgICdyZXF1ZXN0T2ZmbGluZVRva2VuJyxcbiAgICAnZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uJyxcbiAgICAncmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uJyxcbiAgICAnbWluaW11bVBhc3N3b3JkTGVuZ3RoJyxcbiAgICAnbG9naW5QYXRoJyxcbiAgICAnc2lnblVwUGF0aCcsXG4gICAgJ3Jlc2V0UGFzc3dvcmRQYXRoJyxcbiAgICAncHJvZmlsZVBhdGgnLFxuICAgICdjaGFuZ2VQYXNzd29yZFBhdGgnLFxuICAgICdob21lUm91dGVQYXRoJyxcbiAgICAnb25TdWJtaXRIb29rJyxcbiAgICAnb25QcmVTaWduVXBIb29rJyxcbiAgICAnb25Qb3N0U2lnblVwSG9vaycsXG4gICAgJ29uRW5yb2xsQWNjb3VudEhvb2snLFxuICAgICdvblJlc2V0UGFzc3dvcmRIb29rJyxcbiAgICAnb25WZXJpZnlFbWFpbEhvb2snLFxuICAgICdvblNpZ25lZEluSG9vaycsXG4gICAgJ29uU2lnbmVkT3V0SG9vaycsXG4gICAgJ3ZhbGlkYXRlRmllbGQnLFxuICAgICdlbWFpbFBhdHRlcm4nXG4gIF07XG5cbiAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIVZBTElEX0tFWVMuaW5jbHVkZXMoa2V5KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWNjb3VudHMudWkuY29uZmlnOiBJbnZhbGlkIGtleTogJyArIGtleSk7XG4gIH0pO1xuXG4gIC8vIERlYWwgd2l0aCBgcGFzc3dvcmRTaWdudXBGaWVsZHNgXG4gIGlmIChvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzKSB7XG4gICAgaWYgKFxuICAgICAgW1xuICAgICAgICAnVVNFUk5BTUVfQU5EX0VNQUlMJyxcbiAgICAgICAgJ1VTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTCcsXG4gICAgICAgICdVU0VSTkFNRV9PTkxZJyxcbiAgICAgICAgJ0VNQUlMX09OTFknLFxuICAgICAgICAnRU1BSUxfT05MWV9OT19QQVNTV09SRCcsXG4gICAgICAgICdVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkQnXG4gICAgICBdLmluY2x1ZGVzKG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMpXG4gICAgKSB7XG4gICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcyA9IG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0FjY291bnRzLnVpLmNvbmZpZzogSW52YWxpZCBvcHRpb24gZm9yIGBwYXNzd29yZFNpZ251cEZpZWxkc2A6ICcgK1xuICAgICAgICAgIG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHNcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGByZXF1ZXN0UGVybWlzc2lvbnNgXG4gIGlmIChvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucykge1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zKS5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgY29uc3Qgc2NvcGUgPSBvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlXTtcbiAgICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYHJlcXVlc3RQZXJtaXNzaW9uc2AgbW9yZSB0aGFuIG9uY2UgZm9yIFwiICtcbiAgICAgICAgICAgIHNlcnZpY2VcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoIShzY29wZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0FjY291bnRzLnVpLmNvbmZpZzogVmFsdWUgZm9yIGByZXF1ZXN0UGVybWlzc2lvbnNgIG11c3QgYmUgYW4gYXJyYXknXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZV0gPSBzY29wZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgcmVxdWVzdE9mZmxpbmVUb2tlbmBcbiAgaWYgKG9wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbikge1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbikuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdO1xuICAgICAgaWYgKHNlcnZpY2UgIT09ICdnb29nbGUnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0FjY291bnRzLnVpLmNvbmZpZzogYHJlcXVlc3RPZmZsaW5lVG9rZW5gIG9ubHkgc3VwcG9ydGVkIGZvciBHb29nbGUgbG9naW4gYXQgdGhlIG1vbWVudC4nXG4gICAgICAgICk7XG5cbiAgICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkFjY291bnRzLnVpLmNvbmZpZzogQ2FuJ3Qgc2V0IGByZXF1ZXN0T2ZmbGluZVRva2VuYCBtb3JlIHRoYW4gb25jZSBmb3IgXCIgK1xuICAgICAgICAgICAgc2VydmljZVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbltzZXJ2aWNlXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGBmb3JjZUFwcHJvdmFsUHJvbXB0YFxuICBpZiAob3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0KSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0KS5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV07XG4gICAgICBpZiAoc2VydmljZSAhPT0gJ2dvb2dsZScpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQWNjb3VudHMudWkuY29uZmlnOiBgZm9yY2VBcHByb3ZhbFByb21wdGAgb25seSBzdXBwb3J0ZWQgZm9yIEdvb2dsZSBsb2dpbiBhdCB0aGUgbW9tZW50LidcbiAgICAgICAgKTtcblxuICAgICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYGZvcmNlQXBwcm92YWxQcm9tcHRgIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArXG4gICAgICAgICAgICBzZXJ2aWNlXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0W3NlcnZpY2VdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBEZWFsIHdpdGggYHJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbmBcbiAgaWYgKG9wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbiAhPSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEFjY291bnRzLnVpLmNvbmZpZzogXCJyZXF1aXJlRW1haWxWZXJpZmljYXRpb25cIiBub3QgYSBib29sZWFuYFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uID1cbiAgICAgICAgb3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb247XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGBtaW5pbXVtUGFzc3dvcmRMZW5ndGhgXG4gIGlmIChvcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aCkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGggIT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEFjY291bnRzLnVpLmNvbmZpZzogXCJtaW5pbXVtUGFzc3dvcmRMZW5ndGhcIiBub3QgYSBudW1iZXJgXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGggPVxuICAgICAgICBvcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvLyBEZWFsIHdpdGggdGhlIGhvb2tzLlxuICBmb3IgKGxldCBob29rIG9mIFsnb25TdWJtaXRIb29rJywgJ29uUHJlU2lnblVwSG9vaycsICdvblBvc3RTaWduVXBIb29rJ10pIHtcbiAgICBpZiAob3B0aW9uc1tob29rXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1tob29rXSA9IG9wdGlvbnNbaG9va107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIHBhdHRlcm4uXG4gIGZvciAobGV0IGhvb2sgb2YgWydlbWFpbFBhdHRlcm4nXSkge1xuICAgIGlmIChvcHRpb25zW2hvb2tdKSB7XG4gICAgICBpZiAoIShvcHRpb25zW2hvb2tdIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEFjY291bnRzLnVpLmNvbmZpZzogXCIke2hvb2t9XCIgbm90IGEgUmVndWxhciBFeHByZXNzaW9uYFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGRlYWwgd2l0aCB0aGUgcGF0aHMuXG4gIGZvciAobGV0IHBhdGggb2YgW1xuICAgICdsb2dpblBhdGgnLFxuICAgICdzaWduVXBQYXRoJyxcbiAgICAncmVzZXRQYXNzd29yZFBhdGgnLFxuICAgICdwcm9maWxlUGF0aCcsXG4gICAgJ2NoYW5nZVBhc3N3b3JkUGF0aCcsXG4gICAgJ2hvbWVSb3V0ZVBhdGgnXG4gIF0pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbcGF0aF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAob3B0aW9uc1twYXRoXSAhPT0gbnVsbCAmJiB0eXBlb2Ygb3B0aW9uc1twYXRoXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6ICR7cGF0aH0gaXMgbm90IGEgc3RyaW5nIG9yIG51bGxgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW3BhdGhdID0gb3B0aW9uc1twYXRoXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBkZWFsIHdpdGggcmVkaXJlY3QgaG9va3MuXG4gIGZvciAobGV0IGhvb2sgb2YgW1xuICAgICdvbkVucm9sbEFjY291bnRIb29rJyxcbiAgICAnb25SZXNldFBhc3N3b3JkSG9vaycsXG4gICAgJ29uVmVyaWZ5RW1haWxIb29rJyxcbiAgICAnb25TaWduZWRJbkhvb2snLFxuICAgICdvblNpZ25lZE91dEhvb2snXG4gIF0pIHtcbiAgICBpZiAob3B0aW9uc1tob29rXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9uc1tob29rXSA9PSAnc3RyaW5nJykge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1tob29rXSA9ICgpID0+IHJlZGlyZWN0KG9wdGlvbnNbaG9va10pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uIG9yIGFuIGFic29sdXRlIG9yIHJlbGF0aXZlIHBhdGhgXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvdW50cztcbiIsImxldCBicm93c2VySGlzdG9yeTtcbnRyeSB7XG4gIGJyb3dzZXJIaXN0b3J5ID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJykuYnJvd3Nlckhpc3Rvcnk7XG59IGNhdGNoIChlKSB7fVxuZXhwb3J0IGNvbnN0IGxvZ2luQnV0dG9uc1Nlc3Npb24gPSBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbjtcbmV4cG9ydCBjb25zdCBTVEFURVMgPSB7XG4gIFNJR05fSU46IFN5bWJvbCgnU0lHTl9JTicpLFxuICBTSUdOX1VQOiBTeW1ib2woJ1NJR05fVVAnKSxcbiAgUFJPRklMRTogU3ltYm9sKCdQUk9GSUxFJyksXG4gIFBBU1NXT1JEX0NIQU5HRTogU3ltYm9sKCdQQVNTV09SRF9DSEFOR0UnKSxcbiAgUEFTU1dPUkRfUkVTRVQ6IFN5bWJvbCgnUEFTU1dPUkRfUkVTRVQnKSxcbiAgRU5ST0xMX0FDQ09VTlQ6IFN5bWJvbCgnRU5ST0xMX0FDQ09VTlQnKVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2luU2VydmljZXMoKSB7XG4gIC8vIEZpcnN0IGxvb2sgZm9yIE9BdXRoIHNlcnZpY2VzLlxuICBjb25zdCBzZXJ2aWNlcyA9IFBhY2thZ2VbJ2FjY291bnRzLW9hdXRoJ11cbiAgICA/IEFjY291bnRzLm9hdXRoLnNlcnZpY2VOYW1lcygpXG4gICAgOiBbXTtcblxuICAvLyBCZSBlcXVhbGx5IGtpbmQgdG8gYWxsIGxvZ2luIHNlcnZpY2VzLiBUaGlzIGFsc28gcHJlc2VydmVzXG4gIC8vIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5LlxuICBzZXJ2aWNlcy5zb3J0KCk7XG5cbiAgcmV0dXJuIHNlcnZpY2VzLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHsgbmFtZTogbmFtZSB9O1xuICB9KTtcbn1cbi8vIEV4cG9ydCBnZXRMb2dpblNlcnZpY2VzIHVzaW5nIG9sZCBzdHlsZSBnbG9iYWxzIGZvciBhY2NvdW50cy1iYXNlIHdoaWNoXG4vLyByZXF1aXJlcyBpdC5cbnRoaXMuZ2V0TG9naW5TZXJ2aWNlcyA9IGdldExvZ2luU2VydmljZXM7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQYXNzd29yZFNlcnZpY2UoKSB7XG4gIC8vIEZpcnN0IGxvb2sgZm9yIE9BdXRoIHNlcnZpY2VzLlxuICByZXR1cm4gISFQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5SZXN1bHRDYWxsYmFjayhzZXJ2aWNlLCBlcnIpIHtcbiAgaWYgKCFlcnIpIHtcbiAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBBY2NvdW50cy5Mb2dpbkNhbmNlbGxlZEVycm9yKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9IGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIFNlcnZpY2VDb25maWd1cmF0aW9uLkNvbmZpZ0Vycm9yKSB7XG4gIH0gZWxzZSB7XG4gICAgLy9sb2dpbkJ1dHRvbnNTZXNzaW9uLmVycm9yTWVzc2FnZShlcnIucmVhc29uIHx8IFwiVW5rbm93biBlcnJvclwiKTtcbiAgfVxuXG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAodHlwZW9mIHJlZGlyZWN0ID09PSAnc3RyaW5nJykge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZXJ2aWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZXJ2aWNlKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXNzd29yZFNpZ251cEZpZWxkcygpIHtcbiAgcmV0dXJuIEFjY291bnRzLnVpLl9vcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzIHx8ICdFTUFJTF9PTkxZX05PX1BBU1NXT1JEJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWwoZW1haWwsIHNob3dNZXNzYWdlLCBjbGVhck1lc3NhZ2UpIHtcbiAgaWYgKFxuICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzKCkgPT09ICdVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUwnICYmXG4gICAgZW1haWwgPT09ICcnXG4gICkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5lbWFpbFBhdHRlcm4udGVzdChlbWFpbCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICghZW1haWwgfHwgZW1haWwubGVuZ3RoID09PSAwKSB7XG4gICAgc2hvd01lc3NhZ2UoJ2Vycm9yLmVtYWlsUmVxdWlyZWQnLCAnd2FybmluZycsIGZhbHNlLCAnZW1haWwnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgc2hvd01lc3NhZ2UoJ2Vycm9yLmFjY291bnRzLkludmFsaWQgZW1haWwnLCAnd2FybmluZycsIGZhbHNlLCAnZW1haWwnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQgPSAnJywgc2hvd01lc3NhZ2UsIGNsZWFyTWVzc2FnZSkge1xuICBpZiAocGFzc3dvcmQubGVuZ3RoID49IEFjY291bnRzLnVpLl9vcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIC8vIGNvbnN0IGVyck1zZyA9IFQ5bi5nZXQoXCJlcnJvci5taW5DaGFyXCIpLnJlcGxhY2UoLzcvLCBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpO1xuICAgIGNvbnN0IGVyck1zZyA9ICdlcnJvci5taW5DaGFyJztcbiAgICBzaG93TWVzc2FnZShlcnJNc2csICd3YXJuaW5nJywgZmFsc2UsICdwYXNzd29yZCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VybmFtZShcbiAgdXNlcm5hbWUsXG4gIHNob3dNZXNzYWdlLFxuICBjbGVhck1lc3NhZ2UsXG4gIGZvcm1TdGF0ZVxuKSB7XG4gIGlmICh1c2VybmFtZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGZpZWxkTmFtZSA9XG4gICAgICBwYXNzd29yZFNpZ251cEZpZWxkcygpID09PSAnVVNFUk5BTUVfT05MWScgfHwgZm9ybVN0YXRlID09PSBTVEFURVMuU0lHTl9VUFxuICAgICAgICA/ICd1c2VybmFtZSdcbiAgICAgICAgOiAndXNlcm5hbWVPckVtYWlsJztcbiAgICBzaG93TWVzc2FnZSgnZXJyb3IudXNlcm5hbWVSZXF1aXJlZCcsICd3YXJuaW5nJywgZmFsc2UsIGZpZWxkTmFtZSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWRpcmVjdChyZWRpcmVjdCkge1xuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKHdpbmRvdy5oaXN0b3J5KSB7XG4gICAgICAvLyBSdW4gYWZ0ZXIgYWxsIGFwcCBzcGVjaWZpYyByZWRpcmVjdHMsIGkuZS4gdG8gdGhlIGxvZ2luIHNjcmVlbi5cbiAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKFBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlciddKSB7XG4gICAgICAgICAgUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyJ10uRmxvd1JvdXRlci5nbyhyZWRpcmVjdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyLXNzciddKSB7XG4gICAgICAgICAgUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyLXNzciddLkZsb3dSb3V0ZXIuZ28ocmVkaXJlY3QpO1xuICAgICAgICB9IGVsc2UgaWYgKGJyb3dzZXJIaXN0b3J5KSB7XG4gICAgICAgICAgYnJvd3Nlckhpc3RvcnkucHVzaChyZWRpcmVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAncmVkaXJlY3QnLCByZWRpcmVjdCk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nXG4gICAgLnJlcGxhY2UoL1xcLS8sICcgJylcbiAgICAuc3BsaXQoJyAnKVxuICAgIC5tYXAod29yZCA9PiB7XG4gICAgICByZXR1cm4gd29yZC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHdvcmQuc2xpY2UoMSk7XG4gICAgfSlcbiAgICAuam9pbignICcpO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgeyBTVEFURVMsIGxvZ2luUmVzdWx0Q2FsbGJhY2ssIGdldExvZ2luU2VydmljZXMgfSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG5jb25zdCBWQUxJRF9LRVlTID0gW1xuICAnZHJvcGRvd25WaXNpYmxlJyxcblxuICAvLyBYWFggY29uc2lkZXIgcmVwbGFjaW5nIHRoZXNlIHdpdGggb25lIGtleSB0aGF0IGhhcyBhbiBlbnVtIGZvciB2YWx1ZXMuXG4gICdpblNpZ251cEZsb3cnLFxuICAnaW5Gb3Jnb3RQYXNzd29yZEZsb3cnLFxuICAnaW5DaGFuZ2VQYXNzd29yZEZsb3cnLFxuICAnaW5NZXNzYWdlT25seUZsb3cnLFxuXG4gICdlcnJvck1lc3NhZ2UnLFxuICAnaW5mb01lc3NhZ2UnLFxuXG4gIC8vIGRpYWxvZ3Mgd2l0aCBtZXNzYWdlcyAoaW5mbyBhbmQgZXJyb3IpXG4gICdyZXNldFBhc3N3b3JkVG9rZW4nLFxuICAnZW5yb2xsQWNjb3VudFRva2VuJyxcbiAgJ2p1c3RWZXJpZmllZEVtYWlsJyxcbiAgJ2p1c3RSZXNldFBhc3N3b3JkJyxcblxuICAnY29uZmlndXJlTG9naW5TZXJ2aWNlRGlhbG9nVmlzaWJsZScsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2VEaWFsb2dTZXJ2aWNlTmFtZScsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2VEaWFsb2dTYXZlRGlzYWJsZWQnLFxuICAnY29uZmlndXJlT25EZXNrdG9wVmlzaWJsZSdcbl07XG5cbmV4cG9ydCBjb25zdCB2YWxpZGF0ZUtleSA9IGZ1bmN0aW9uKGtleSkge1xuICBpZiAoIVZBTElEX0tFWVMuaW5jbHVkZXMoa2V5KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQga2V5IGluIGxvZ2luQnV0dG9uc1Nlc3Npb246ICcgKyBrZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IEtFWV9QUkVGSVggPSAnTWV0ZW9yLmxvZ2luQnV0dG9ucy4nO1xuXG4vLyBYWFggVGhpcyBzaG91bGQgcHJvYmFibHkgYmUgcGFja2FnZSBzY29wZSByYXRoZXIgdGhhbiBleHBvcnRlZFxuLy8gKHRoZXJlIHdhcyBldmVuIGEgY29tbWVudCB0byB0aGF0IGVmZmVjdCBoZXJlIGZyb20gYmVmb3JlIHdlIGhhZFxuLy8gbmFtZXNwYWNpbmcpIGJ1dCBhY2NvdW50cy11aS12aWV3ZXIgdXNlcyBpdCwgc28gbGVhdmUgaXQgYXMgaXMgZm9yXG4vLyBub3dcbkFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uID0ge1xuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YWxpZGF0ZUtleShrZXkpO1xuICAgIGlmIChbJ2Vycm9yTWVzc2FnZScsICdpbmZvTWVzc2FnZSddLmluY2x1ZGVzKGtleSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiRG9uJ3Qgc2V0IGVycm9yTWVzc2FnZSBvciBpbmZvTWVzc2FnZSBkaXJlY3RseS4gSW5zdGVhZCwgdXNlIGVycm9yTWVzc2FnZSgpIG9yIGluZm9NZXNzYWdlKCkuXCJcbiAgICAgICk7XG5cbiAgICB0aGlzLl9zZXQoa2V5LCB2YWx1ZSk7XG4gIH0sXG5cbiAgX3NldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyBrZXksIHZhbHVlKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhbGlkYXRlS2V5KGtleSk7XG4gICAgcmV0dXJuIFNlc3Npb24uZ2V0KEtFWV9QUkVGSVggKyBrZXkpO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gIC8vIEluIHRoZSBsb2dpbiByZWRpcmVjdCBmbG93LCB3ZSdsbCBoYXZlIHRoZSByZXN1bHQgb2YgdGhlIGxvZ2luXG4gIC8vIGF0dGVtcHQgYXQgcGFnZSBsb2FkIHRpbWUgd2hlbiB3ZSdyZSByZWRpcmVjdGVkIGJhY2sgdG8gdGhlXG4gIC8vIGFwcGxpY2F0aW9uLiAgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byB1cGRhdGUgdGhlIFVJIChpLmUuIHRvIGNsb3NlXG4gIC8vIHRoZSBkaWFsb2cgb24gYSBzdWNjZXNzZnVsIGxvZ2luIG9yIGRpc3BsYXkgdGhlIGVycm9yIG9uIGEgZmFpbGVkXG4gIC8vIGxvZ2luKS5cbiAgLy9cbiAgQWNjb3VudHMub25QYWdlTG9hZExvZ2luKGZ1bmN0aW9uKGF0dGVtcHRJbmZvKSB7XG4gICAgLy8gSWdub3JlIGlmIHdlIGhhdmUgYSBsZWZ0IG92ZXIgbG9naW4gYXR0ZW1wdCBmb3IgYSBzZXJ2aWNlIHRoYXQgaXMgbm8gbG9uZ2VyIHJlZ2lzdGVyZWQuXG4gICAgaWYgKFxuICAgICAgZ2V0TG9naW5TZXJ2aWNlcygpXG4gICAgICAgIC5tYXAoKHsgbmFtZSB9KSA9PiBuYW1lKVxuICAgICAgICAuaW5jbHVkZXMoYXR0ZW1wdEluZm8udHlwZSlcbiAgICApXG4gICAgICBsb2dpblJlc3VsdENhbGxiYWNrKGF0dGVtcHRJbmZvLnR5cGUsIGF0dGVtcHRJbmZvLmVycm9yKTtcbiAgfSk7XG5cbiAgbGV0IGRvbmVDYWxsYmFjaztcblxuICBBY2NvdW50cy5vblJlc2V0UGFzc3dvcmRMaW5rKGZ1bmN0aW9uKHRva2VuLCBkb25lKSB7XG4gICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCB0b2tlbik7XG4gICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsICdyZXNldFBhc3N3b3JkVG9rZW4nKTtcbiAgICBkb25lQ2FsbGJhY2sgPSBkb25lO1xuXG4gICAgQWNjb3VudHMudWkuX29wdGlvbnMub25SZXNldFBhc3N3b3JkSG9vaygpO1xuICB9KTtcblxuICBBY2NvdW50cy5vbkVucm9sbG1lbnRMaW5rKGZ1bmN0aW9uKHRva2VuLCBkb25lKSB7XG4gICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdlbnJvbGxBY2NvdW50VG9rZW4nLCB0b2tlbik7XG4gICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsICdlbnJvbGxBY2NvdW50VG9rZW4nKTtcbiAgICBkb25lQ2FsbGJhY2sgPSBkb25lO1xuXG4gICAgQWNjb3VudHMudWkuX29wdGlvbnMub25FbnJvbGxBY2NvdW50SG9vaygpO1xuICB9KTtcblxuICBBY2NvdW50cy5vbkVtYWlsVmVyaWZpY2F0aW9uTGluayhmdW5jdGlvbih0b2tlbiwgZG9uZSkge1xuICAgIEFjY291bnRzLnZlcmlmeUVtYWlsKHRva2VuLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2p1c3RWZXJpZmllZEVtYWlsJywgdHJ1ZSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCAnanVzdFZlcmlmaWVkRW1haWwnKTtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMub25TaWduZWRJbkhvb2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm9uVmVyaWZ5RW1haWxIb29rKCk7XG4gICAgICB9XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG4vLy9cbi8vLyBMT0dJTiBXSVRIT1VUIFBBU1NXT1JEXG4vLy9cblxuLy8gTWV0aG9kIGNhbGxlZCBieSBhIHVzZXIgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0IGVtYWlsLiBUaGlzIGlzXG4vLyB0aGUgc3RhcnQgb2YgdGhlIHJlc2V0IHByb2Nlc3MuXG5NZXRlb3IubWV0aG9kcyh7XG4gIGxvZ2luV2l0aG91dFBhc3N3b3JkOiBmdW5jdGlvbih7IGVtYWlsLCB1c2VybmFtZSA9IG51bGwgfSkge1xuICAgIGlmICh1c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG5cbiAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgICAkb3I6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAnZW1haWxzLmFkZHJlc3MnOiB7ICRleGlzdHM6IDEgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ2VtYWlscy5hZGRyZXNzJzogZW1haWxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgJ1VzZXIgbm90IGZvdW5kJyk7XG5cbiAgICAgIGVtYWlsID0gdXNlci5lbWFpbHNbMF0uYWRkcmVzcztcbiAgICB9IGVsc2Uge1xuICAgICAgY2hlY2soZW1haWwsIFN0cmluZyk7XG5cbiAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyAnZW1haWxzLmFkZHJlc3MnOiBlbWFpbCB9KTtcbiAgICAgIGlmICghdXNlcikgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdVc2VyIG5vdCBmb3VuZCcpO1xuICAgIH1cblxuICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb24pIHtcbiAgICAgIGlmICghdXNlci5lbWFpbHNbMF0udmVyaWZpZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsICdFbWFpbCBub3QgdmVyaWZpZWQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBBY2NvdW50cy5zZW5kTG9naW5FbWFpbCh1c2VyLl9pZCwgZW1haWwpO1xuICB9XG59KTtcblxuLyoqXG4gKiBAc3VtbWFyeSBTZW5kIGFuIGVtYWlsIHdpdGggYSBsaW5rIHRoZSB1c2VyIGNhbiB1c2UgdmVyaWZ5IHRoZWlyIGVtYWlsIGFkZHJlc3MuXG4gKiBAbG9jdXMgU2VydmVyXG4gKiBAcGFyYW0ge1N0cmluZ30gdXNlcklkIFRoZSBpZCBvZiB0aGUgdXNlciB0byBzZW5kIGVtYWlsIHRvLlxuICogQHBhcmFtIHtTdHJpbmd9IFtlbWFpbF0gT3B0aW9uYWwuIFdoaWNoIGFkZHJlc3Mgb2YgdGhlIHVzZXIncyB0byBzZW5kIHRoZSBlbWFpbCB0by4gVGhpcyBhZGRyZXNzIG11c3QgYmUgaW4gdGhlIHVzZXIncyBgZW1haWxzYCBsaXN0LiBEZWZhdWx0cyB0byB0aGUgZmlyc3QgdW52ZXJpZmllZCBlbWFpbCBpbiB0aGUgbGlzdC5cbiAqL1xuQWNjb3VudHMuc2VuZExvZ2luRW1haWwgPSBmdW5jdGlvbih1c2VySWQsIGFkZHJlc3MpIHtcbiAgLy8gWFhYIEFsc28gZ2VuZXJhdGUgYSBsaW5rIHVzaW5nIHdoaWNoIHNvbWVvbmUgY2FuIGRlbGV0ZSB0aGlzXG4gIC8vIGFjY291bnQgaWYgdGhleSBvd24gc2FpZCBhZGRyZXNzIGJ1dCB3ZXJlbid0IHRob3NlIHdobyBjcmVhdGVkXG4gIC8vIHRoaXMgYWNjb3VudC5cblxuICAvLyBNYWtlIHN1cmUgdGhlIHVzZXIgZXhpc3RzLCBhbmQgYWRkcmVzcyBpcyBvbmUgb2YgdGhlaXIgYWRkcmVzc2VzLlxuICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJJZCk7XG4gIGlmICghdXNlcikgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgZmluZCB1c2VyXCIpO1xuICAvLyBwaWNrIHRoZSBmaXJzdCB1bnZlcmlmaWVkIGFkZHJlc3MgaWYgd2Ugd2VyZW4ndCBwYXNzZWQgYW4gYWRkcmVzcy5cbiAgaWYgKCFhZGRyZXNzKSB7XG4gICAgdmFyIGVtYWlsID0gKHVzZXIuZW1haWxzIHx8IFtdKS5maW5kKCh7IHZlcmlmaWVkIH0pID0+ICF2ZXJpZmllZCk7XG4gICAgYWRkcmVzcyA9IChlbWFpbCB8fCB7fSkuYWRkcmVzcztcbiAgfVxuICAvLyBtYWtlIHN1cmUgd2UgaGF2ZSBhIHZhbGlkIGFkZHJlc3NcbiAgaWYgKFxuICAgICFhZGRyZXNzIHx8XG4gICAgISh1c2VyLmVtYWlscyB8fCBbXSkubWFwKCh7IGFkZHJlc3MgfSkgPT4gYWRkcmVzcykuaW5jbHVkZXMoYWRkcmVzcylcbiAgKVxuICAgIHRocm93IG5ldyBFcnJvcignTm8gc3VjaCBlbWFpbCBhZGRyZXNzIGZvciB1c2VyLicpO1xuXG4gIHZhciB0b2tlblJlY29yZCA9IHtcbiAgICB0b2tlbjogUmFuZG9tLnNlY3JldCgpLFxuICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgd2hlbjogbmV3IERhdGUoKVxuICB9O1xuICBNZXRlb3IudXNlcnMudXBkYXRlKFxuICAgIHsgX2lkOiB1c2VySWQgfSxcbiAgICB7ICRwdXNoOiB7ICdzZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMnOiB0b2tlblJlY29yZCB9IH1cbiAgKTtcblxuICAvLyBiZWZvcmUgcGFzc2luZyB0byB0ZW1wbGF0ZSwgdXBkYXRlIHVzZXIgb2JqZWN0IHdpdGggbmV3IHRva2VuXG4gIE1ldGVvci5fZW5zdXJlKHVzZXIsICdzZXJ2aWNlcycsICdlbWFpbCcpO1xuICBpZiAoIXVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zKSB7XG4gICAgdXNlci5zZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMgPSBbXTtcbiAgfVxuICB1c2VyLnNlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2Vucy5wdXNoKHRva2VuUmVjb3JkKTtcblxuICB2YXIgbG9naW5VcmwgPSBBY2NvdW50cy51cmxzLnZlcmlmeUVtYWlsKHRva2VuUmVjb3JkLnRva2VuKTtcblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICB0bzogYWRkcmVzcyxcbiAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuZnJvbVxuICAgICAgPyBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuZnJvbSh1c2VyKVxuICAgICAgOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgIHN1YmplY3Q6IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5zdWJqZWN0KHVzZXIpXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQudGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMudGV4dCA9IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC50ZXh0KHVzZXIsIGxvZ2luVXJsKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmh0bWwgPT09ICdmdW5jdGlvbicpXG4gICAgb3B0aW9ucy5odG1sID0gQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmh0bWwodXNlciwgbG9naW5VcmwpO1xuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuaGVhZGVycyA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zLmhlYWRlcnMgPSBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5oZWFkZXJzO1xuICB9XG5cbiAgRW1haWwuc2VuZChvcHRpb25zKTtcbn07XG5cbi8vIENoZWNrIGZvciBpbnN0YWxsZWQgYWNjb3VudHMtcGFzc3dvcmQgZGVwZW5kZW5jeS5cbmlmIChBY2NvdW50cy5lbWFpbFRlbXBsYXRlcykge1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQgPSB7XG4gICAgc3ViamVjdDogZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuICdMb2dpbiBvbiAnICsgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuc2l0ZU5hbWU7XG4gICAgfSxcbiAgICB0ZXh0OiBmdW5jdGlvbih1c2VyLCB1cmwpIHtcbiAgICAgIHZhciBncmVldGluZyA9XG4gICAgICAgIHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZVxuICAgICAgICAgID8gJ0hlbGxvICcgKyB1c2VyLnByb2ZpbGUubmFtZSArICcsJ1xuICAgICAgICAgIDogJ0hlbGxvLCc7XG4gICAgICByZXR1cm4gYCR7Z3JlZXRpbmd9XG5UbyBsb2dpbiwgc2ltcGx5IGNsaWNrIHRoZSBsaW5rIGJlbG93LlxuJHt1cmx9XG5UaGFua3MuXG5gO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgZ2V0TG9naW5TZXJ2aWNlcyB9IGZyb20gJy4uLy4uL2hlbHBlcnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnc2VydmljZXNMaXN0JywgZnVuY3Rpb24oKSB7XG4gIGxldCBzZXJ2aWNlcyA9IGdldExvZ2luU2VydmljZXMoKTtcbiAgaWYgKFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ10pIHtcbiAgICBzZXJ2aWNlcy5wdXNoKHsgbmFtZTogJ3Bhc3N3b3JkJyB9KTtcbiAgfVxuICBsZXQgZmllbGRzID0ge307XG4gIC8vIFB1Ymxpc2ggdGhlIGV4aXN0aW5nIHNlcnZpY2VzIGZvciBhIHVzZXIsIG9ubHkgbmFtZSBvciBub3RoaW5nIGVsc2UuXG4gIHNlcnZpY2VzLmZvckVhY2goc2VydmljZSA9PiAoZmllbGRzW2BzZXJ2aWNlcy4ke3NlcnZpY2UubmFtZX0ubmFtZWBdID0gMSkpO1xuICByZXR1cm4gTWV0ZW9yLnVzZXJzLmZpbmQoeyBfaWQ6IHRoaXMudXNlcklkIH0sIHsgZmllbGRzOiBmaWVsZHMgfSk7XG59KTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmxldCBMaW5rO1xudHJ5IHtcbiAgTGluayA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpLkxpbms7XG59IGNhdGNoIChlKSB7fVxuXG5leHBvcnQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGxhYmVsLFxuICAgICAgaHJlZiA9IG51bGwsXG4gICAgICB0eXBlLFxuICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIG9uQ2xpY2tcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAodHlwZSA9PSAnbGluaycpIHtcbiAgICAgIC8vIFN1cHBvcnQgUmVhY3QgUm91dGVyLlxuICAgICAgaWYgKExpbmsgJiYgaHJlZikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxMaW5rIHRvPXtocmVmfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8YSBocmVmPXtocmVmfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gb25DbGljaz17b25DbGlja30+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgPC9hPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgdHlwZT17dHlwZX1cbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgPlxuICAgICAgICB7bGFiZWx9XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG5cbkJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5BY2NvdW50cy51aS5CdXR0b24gPSBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0ICcuL0J1dHRvbi5qc3gnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IGJ1dHRvbnMgPSB7fSwgY2xhc3NOYW1lID0gJ2J1dHRvbnMnIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAge09iamVjdC5rZXlzKGJ1dHRvbnMpLm1hcCgoaWQsIGkpID0+IChcbiAgICAgICAgICA8QWNjb3VudHMudWkuQnV0dG9uIHsuLi5idXR0b25zW2lkXX0ga2V5PXtpfSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQWNjb3VudHMudWkuQnV0dG9ucyA9IEJ1dHRvbnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5leHBvcnQgY2xhc3MgRmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW91bnQ6IHRydWVcbiAgICB9O1xuICB9XG5cbiAgdHJpZ2dlclVwZGF0ZSgpIHtcbiAgICAvLyBUcmlnZ2VyIGFuIG9uQ2hhbmdlIG9uIGluaXRhbCBsb2FkLCB0byBzdXBwb3J0IGJyb3dzZXIgcHJlZmlsbGVkIHZhbHVlcy5cbiAgICBjb25zdCB7IG9uQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmICh0aGlzLmlucHV0ICYmIG9uQ2hhbmdlKSB7XG4gICAgICBvbkNoYW5nZSh7IHRhcmdldDogeyB2YWx1ZTogdGhpcy5pbnB1dC52YWx1ZSB9IH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIC8vIFJlLW1vdW50IGNvbXBvbmVudCBzbyB0aGF0IHdlIGRvbid0IGV4cG9zZSBicm93c2VyIHByZWZpbGxlZCBwYXNzd29yZHMgaWYgdGhlIGNvbXBvbmVudCB3YXNcbiAgICAvLyBhIHBhc3N3b3JkIGJlZm9yZSBhbmQgbm93IHNvbWV0aGluZyBlbHNlLlxuICAgIGlmIChwcmV2UHJvcHMuaWQgIT09IHRoaXMucHJvcHMuaWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBtb3VudDogZmFsc2UgfSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5tb3VudCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IG1vdW50OiB0cnVlIH0pO1xuICAgICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkLFxuICAgICAgaGludCxcbiAgICAgIGxhYmVsLFxuICAgICAgdHlwZSA9ICd0ZXh0JyxcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgcmVxdWlyZWQgPSBmYWxzZSxcbiAgICAgIGNsYXNzTmFtZSA9ICdmaWVsZCcsXG4gICAgICBkZWZhdWx0VmFsdWUgPSAnJyxcbiAgICAgIG1lc3NhZ2VcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IG1vdW50ID0gdHJ1ZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAodHlwZSA9PSAnbm90aWNlJykge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9PntsYWJlbH08L2Rpdj47XG4gICAgfVxuICAgIHJldHVybiBtb3VudCA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj17aWR9PntsYWJlbH08L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgcmVmPXtyZWYgPT4gKHRoaXMuaW5wdXQgPSByZWYpfVxuICAgICAgICAgIHR5cGU9e3R5cGV9XG4gICAgICAgICAgb25DaGFuZ2U9e29uQ2hhbmdlfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXtoaW50fVxuICAgICAgICAgIGRlZmF1bHRWYWx1ZT17ZGVmYXVsdFZhbHVlfVxuICAgICAgICAvPlxuICAgICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtbJ21lc3NhZ2UnLCBtZXNzYWdlLnR5cGVdLmpvaW4oJyAnKS50cmltKCl9PlxuICAgICAgICAgICAge21lc3NhZ2UubWVzc2FnZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgfVxufVxuXG5GaWVsZC5wcm9wVHlwZXMgPSB7XG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuQWNjb3VudHMudWkuRmllbGQgPSBGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCAnLi9GaWVsZC5qc3gnO1xuXG5leHBvcnQgY2xhc3MgRmllbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IGZpZWxkcyA9IHt9LCBjbGFzc05hbWUgPSAnZmllbGRzJyB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICAgIHtPYmplY3Qua2V5cyhmaWVsZHMpLm1hcCgoaWQsIGkpID0+IChcbiAgICAgICAgICA8QWNjb3VudHMudWkuRmllbGQgey4uLmZpZWxkc1tpZF19IGtleT17aX0gLz5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLkZpZWxkcyA9IEZpZWxkcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuaW1wb3J0ICcuL0ZpZWxkcy5qc3gnO1xuaW1wb3J0ICcuL0J1dHRvbnMuanN4JztcbmltcG9ydCAnLi9Gb3JtTWVzc2FnZS5qc3gnO1xuaW1wb3J0ICcuL1Bhc3N3b3JkT3JTZXJ2aWNlLmpzeCc7XG5pbXBvcnQgJy4vU29jaWFsQnV0dG9ucy5qc3gnO1xuaW1wb3J0ICcuL0Zvcm1NZXNzYWdlcy5qc3gnO1xuXG5leHBvcnQgY2xhc3MgRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCBmb3JtID0gdGhpcy5mb3JtO1xuICAgIGlmIChmb3JtKSB7XG4gICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGUgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaGFzUGFzc3dvcmRTZXJ2aWNlLFxuICAgICAgb2F1dGhTZXJ2aWNlcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGJ1dHRvbnMsXG4gICAgICBlcnJvcixcbiAgICAgIG1lc3NhZ2VzLFxuICAgICAgdHJhbnNsYXRlLFxuICAgICAgcmVhZHkgPSB0cnVlLFxuICAgICAgY2xhc3NOYW1lXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtXG4gICAgICAgIHJlZj17cmVmID0+ICh0aGlzLmZvcm0gPSByZWYpfVxuICAgICAgICBjbGFzc05hbWU9e1tjbGFzc05hbWUsIHJlYWR5ID8gJ3JlYWR5JyA6IG51bGxdLmpvaW4oJyAnKX1cbiAgICAgICAgY2xhc3NOYW1lPVwiYWNjb3VudHMtdWlcIlxuICAgICAgICBub1ZhbGlkYXRlXG4gICAgICA+XG4gICAgICAgIDxBY2NvdW50cy51aS5GaWVsZHMgZmllbGRzPXtmaWVsZHN9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5CdXR0b25zIGJ1dHRvbnM9e2J1dHRvbnN9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5QYXNzd29yZE9yU2VydmljZVxuICAgICAgICAgIG9hdXRoU2VydmljZXM9e29hdXRoU2VydmljZXN9XG4gICAgICAgICAgdHJhbnNsYXRlPXt0cmFuc2xhdGV9XG4gICAgICAgIC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5Tb2NpYWxCdXR0b25zIG9hdXRoU2VydmljZXM9e29hdXRoU2VydmljZXN9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5Gb3JtTWVzc2FnZXMgbWVzc2FnZXM9e21lc3NhZ2VzfSAvPlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7XG4gIG9hdXRoU2VydmljZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGZpZWxkczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBidXR0b25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHRyYW5zbGF0ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJlYWR5OiBQcm9wVHlwZXMuYm9vbFxufTtcblxuQWNjb3VudHMudWkuRm9ybSA9IEZvcm07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1NZXNzYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCB7XG4gICAgICBtZXNzYWdlLFxuICAgICAgdHlwZSxcbiAgICAgIGNsYXNzTmFtZSA9ICdtZXNzYWdlJyxcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBkZXByZWNhdGVkXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gWFhYIENoZWNrIGZvciBkZXByZWNhdGlvbnMuXG4gICAgaWYgKGRlcHJlY2F0ZWQpIHtcbiAgICAgIC8vIEZvdW5kIGJhY2t3b3JkcyBjb21wYXRpYmlsaXR5IGlzc3VlLlxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAnWW91IGFyZSBvdmVycmlkaW5nIEFjY291bnRzLnVpLkZvcm0gYW5kIHVzaW5nIEZvcm1NZXNzYWdlLCB0aGUgdXNlIG9mIEZvcm1NZXNzYWdlIGluIEZvcm0gaGFzIGJlZW4gZGVwcmVhY3RlZCBpbiB2MS4yLjExLCB1cGRhdGUgeW91ciBpbXBsZW1lbnRhdGlvbiB0byB1c2UgRm9ybU1lc3NhZ2VzOiBodHRwczovL2dpdGh1Yi5jb20vc3R1ZGlvaW50ZXJhY3QvYWNjb3VudHMtdWkvI2RlcHJlY2F0aW9ucydcbiAgICAgICk7XG4gICAgfVxuICAgIG1lc3NhZ2UgPSBpc09iamVjdChtZXNzYWdlKSA/IG1lc3NhZ2UubWVzc2FnZSA6IG1lc3NhZ2U7IC8vIElmIG1lc3NhZ2UgaXMgb2JqZWN0LCB0aGVuIHRyeSB0byBnZXQgbWVzc2FnZSBmcm9tIGl0XG4gICAgcmV0dXJuIG1lc3NhZ2UgPyAoXG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZX0gY2xhc3NOYW1lPXtbY2xhc3NOYW1lLCB0eXBlXS5qb2luKCcgJyl9PlxuICAgICAgICB7bWVzc2FnZX1cbiAgICAgIDwvZGl2PlxuICAgICkgOiBudWxsO1xuICB9XG59XG5cbkFjY291bnRzLnVpLkZvcm1NZXNzYWdlID0gRm9ybU1lc3NhZ2U7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtTWVzc2FnZXMgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlcyA9IFtdLCBjbGFzc05hbWUgPSAnbWVzc2FnZXMnLCBzdHlsZSA9IHt9IH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICBtZXNzYWdlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlc1wiPlxuICAgICAgICAgIHttZXNzYWdlc1xuICAgICAgICAgICAgLmZpbHRlcihtZXNzYWdlID0+ICEoJ2ZpZWxkJyBpbiBtZXNzYWdlKSlcbiAgICAgICAgICAgIC5tYXAoKHsgbWVzc2FnZSwgdHlwZSB9LCBpKSA9PiAoXG4gICAgICAgICAgICAgIDxBY2NvdW50cy51aS5Gb3JtTWVzc2FnZSBtZXNzYWdlPXttZXNzYWdlfSB0eXBlPXt0eXBlfSBrZXk9e2l9IC8+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgKTtcbiAgfVxufVxuXG5BY2NvdW50cy51aS5Gb3JtTWVzc2FnZXMgPSBGb3JtTWVzc2FnZXM7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgd2l0aFRyYWNrZXIgfSBmcm9tICdtZXRlb3IvcmVhY3QtbWV0ZW9yLWRhdGEnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgeyBUOW4gfSBmcm9tICdtZXRlb3ItYWNjb3VudHMtdDluJztcbmltcG9ydCB7IEtFWV9QUkVGSVggfSBmcm9tICcuLi8uLi9sb2dpbl9zZXNzaW9uLmpzJztcbmltcG9ydCAnLi9Gb3JtLmpzeCc7XG5cbmltcG9ydCB7XG4gIFNUQVRFUyxcbiAgcGFzc3dvcmRTaWdudXBGaWVsZHMsXG4gIHZhbGlkYXRlRW1haWwsXG4gIHZhbGlkYXRlUGFzc3dvcmQsXG4gIHZhbGlkYXRlVXNlcm5hbWUsXG4gIGxvZ2luUmVzdWx0Q2FsbGJhY2ssXG4gIGdldExvZ2luU2VydmljZXMsXG4gIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgY2FwaXRhbGl6ZVxufSBmcm9tICcuLi8uLi9oZWxwZXJzLmpzJztcblxuZnVuY3Rpb24gaW5kZXhCeShhcnJheSwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgIHJlc3VsdFtvYmpba2V5XV0gPSBvYmo7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5jbGFzcyBMb2dpbkZvcm0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBsZXQge1xuICAgICAgZm9ybVN0YXRlLFxuICAgICAgbG9naW5QYXRoLFxuICAgICAgc2lnblVwUGF0aCxcbiAgICAgIHJlc2V0UGFzc3dvcmRQYXRoLFxuICAgICAgcHJvZmlsZVBhdGgsXG4gICAgICBjaGFuZ2VQYXNzd29yZFBhdGhcbiAgICB9ID0gcHJvcHM7XG5cbiAgICBpZiAoZm9ybVN0YXRlID09PSBTVEFURVMuU0lHTl9JTiAmJiBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICdEbyBub3QgZm9yY2UgdGhlIHN0YXRlIHRvIFNJR05fSU4gb24gQWNjb3VudHMudWkuTG9naW5Gb3JtLCBpdCB3aWxsIG1ha2UgaXQgaW1wb3NzaWJsZSB0byByZXNldCBwYXNzd29yZCBpbiB5b3VyIGFwcCwgdGhpcyBzdGF0ZSBpcyBhbHNvIHRoZSBkZWZhdWx0IHN0YXRlIGlmIGxvZ2dlZCBvdXQsIHNvIG5vIG5lZWQgdG8gZm9yY2UgaXQuJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgaW5pdGFsIHN0YXRlLlxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXNzYWdlczogW10sXG4gICAgICB3YWl0aW5nOiB0cnVlLFxuICAgICAgZm9ybVN0YXRlOiBmb3JtU3RhdGVcbiAgICAgICAgPyBmb3JtU3RhdGVcbiAgICAgICAgOiBBY2NvdW50cy51c2VyKClcbiAgICAgICAgICA/IFNUQVRFUy5QUk9GSUxFXG4gICAgICAgICAgOiBTVEFURVMuU0lHTl9JTixcbiAgICAgIG9uU3VibWl0SG9vazogcHJvcHMub25TdWJtaXRIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uU3VibWl0SG9vayxcbiAgICAgIG9uU2lnbmVkSW5Ib29rOlxuICAgICAgICBwcm9wcy5vblNpZ25lZEluSG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblNpZ25lZEluSG9vayxcbiAgICAgIG9uU2lnbmVkT3V0SG9vazpcbiAgICAgICAgcHJvcHMub25TaWduZWRPdXRIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uU2lnbmVkT3V0SG9vayxcbiAgICAgIG9uUHJlU2lnblVwSG9vazpcbiAgICAgICAgcHJvcHMub25QcmVTaWduVXBIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uUHJlU2lnblVwSG9vayxcbiAgICAgIG9uUG9zdFNpZ25VcEhvb2s6XG4gICAgICAgIHByb3BzLm9uUG9zdFNpZ25VcEhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25Qb3N0U2lnblVwSG9va1xuICAgIH07XG4gICAgdGhpcy50cmFuc2xhdGUgPSB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHsgd2FpdGluZzogZmFsc2UsIHJlYWR5OiB0cnVlIH0pKTtcbiAgICBsZXQgY2hhbmdlU3RhdGUgPSBTZXNzaW9uLmdldChLRVlfUFJFRklYICsgJ3N0YXRlJyk7XG4gICAgc3dpdGNoIChjaGFuZ2VTdGF0ZSkge1xuICAgICAgY2FzZSAnZW5yb2xsQWNjb3VudFRva2VuJzpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5FTlJPTExfQUNDT1VOVFxuICAgICAgICB9KSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNldFBhc3N3b3JkVG9rZW4nOlxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBBU1NXT1JEX0NIQU5HRVxuICAgICAgICB9KSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2p1c3RWZXJpZmllZEVtYWlsJzpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFXG4gICAgICAgIH0pKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBBZGQgZGVmYXVsdCBmaWVsZCB2YWx1ZXMgb25jZSB0aGUgZm9ybSBkaWQgbW91bnQgb24gdGhlIGNsaWVudFxuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAuLi50aGlzLmdldERlZmF1bHRGaWVsZFZhbHVlcygpXG4gICAgfSkpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMsIG5leHRDb250ZXh0KSB7XG4gICAgaWYgKG5leHRQcm9wcy5mb3JtU3RhdGUgJiYgbmV4dFByb3BzLmZvcm1TdGF0ZSAhPT0gdGhpcy5zdGF0ZS5mb3JtU3RhdGUpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmb3JtU3RhdGU6IG5leHRQcm9wcy5mb3JtU3RhdGUsXG4gICAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKClcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGlmICghcHJldlByb3BzLnVzZXIgIT09ICF0aGlzLnByb3BzLnVzZXIpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmb3JtU3RhdGU6IHRoaXMucHJvcHMudXNlciA/IFNUQVRFUy5QUk9GSUxFIDogU1RBVEVTLlNJR05fSU5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHRyYW5zbGF0ZSh0ZXh0KSB7XG4gICAgLy8gaWYgKHRoaXMucHJvcHMudCkge1xuICAgIC8vICAgcmV0dXJuIHRoaXMucHJvcHMudCh0ZXh0KTtcbiAgICAvLyB9XG4gICAgcmV0dXJuIFQ5bi5nZXQodGV4dCk7XG4gIH1cblxuICB2YWxpZGF0ZUZpZWxkKGZpZWxkLCB2YWx1ZSkge1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlIH0gPSB0aGlzLnN0YXRlO1xuICAgIHN3aXRjaCAoZmllbGQpIHtcbiAgICAgIGNhc2UgJ2VtYWlsJzpcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlRW1haWwoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3Bhc3N3b3JkJzpcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlUGFzc3dvcmQoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlLmJpbmQodGhpcylcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3VzZXJuYW1lJzpcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlVXNlcm5hbWUoXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgZm9ybVN0YXRlXG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWVPckVtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlclVzZXJuYW1lT3JFbWFpbCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCd1c2VybmFtZU9yRW1haWwnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8ICcnLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ3VzZXJuYW1lT3JFbWFpbCcpLFxuICAgICAgbWVzc2FnZTogdGhpcy5nZXRNZXNzYWdlRm9yRmllbGQoJ3VzZXJuYW1lT3JFbWFpbCcpXG4gICAgfTtcbiAgfVxuXG4gIGdldFVzZXJuYW1lRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWUnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyVXNlcm5hbWUnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgndXNlcm5hbWUnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8ICcnLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ3VzZXJuYW1lJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgndXNlcm5hbWUnKVxuICAgIH07XG4gIH1cblxuICBnZXRFbWFpbEZpZWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2VtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlckVtYWlsJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2VtYWlsJyksXG4gICAgICB0eXBlOiAnZW1haWwnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUuZW1haWwgfHwgJycsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAnZW1haWwnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCdlbWFpbCcpXG4gICAgfTtcbiAgfVxuXG4gIGdldFBhc3N3b3JkRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAncGFzc3dvcmQnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyUGFzc3dvcmQnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgncGFzc3dvcmQnKSxcbiAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5wYXNzd29yZCB8fCAnJyxcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICdwYXNzd29yZCcpLFxuICAgICAgbWVzc2FnZTogdGhpcy5nZXRNZXNzYWdlRm9yRmllbGQoJ3Bhc3N3b3JkJylcbiAgICB9O1xuICB9XG5cbiAgZ2V0U2V0UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjaG9vc2VQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJylcbiAgICB9O1xuICB9XG5cbiAgZ2V0TmV3UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJOZXdQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCduZXdQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgnbmV3UGFzc3dvcmQnKVxuICAgIH07XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZmllbGQsIGV2dCkge1xuICAgIGxldCB2YWx1ZSA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgc3dpdGNoIChmaWVsZCkge1xuICAgICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IFtmaWVsZF06IHZhbHVlIH0pO1xuICAgIHRoaXMuc2V0RGVmYXVsdEZpZWxkVmFsdWVzKHsgW2ZpZWxkXTogdmFsdWUgfSk7XG4gIH1cblxuICBmaWVsZHMoKSB7XG4gICAgY29uc3QgbG9naW5GaWVsZHMgPSBbXTtcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghaGFzUGFzc3dvcmRTZXJ2aWNlKCkgJiYgZ2V0TG9naW5TZXJ2aWNlcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgICBsb2dpbkZpZWxkcy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdObyBsb2dpbiBzZXJ2aWNlIGFkZGVkLCBpLmUuIGFjY291bnRzLXBhc3N3b3JkJyxcbiAgICAgICAgdHlwZTogJ25vdGljZSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UoKSAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4pIHtcbiAgICAgIGlmIChcbiAgICAgICAgW1xuICAgICAgICAgICdVU0VSTkFNRV9BTkRfRU1BSUwnLFxuICAgICAgICAgICdVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUwnLFxuICAgICAgICAgICdVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkQnXG4gICAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSlcbiAgICAgICkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYXNzd29yZFNpZ251cEZpZWxkcygpID09PSAnVVNFUk5BTUVfT05MWScpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFVzZXJuYW1lRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgWydFTUFJTF9PTkxZJywgJ0VNQUlMX09OTFlfTk9fUEFTU1dPUkQnXS5pbmNsdWRlcyhcbiAgICAgICAgICBwYXNzd29yZFNpZ251cEZpZWxkcygpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0RW1haWxGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFxuICAgICAgICAhWydFTUFJTF9PTkxZX05PX1BBU1NXT1JEJywgJ1VTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRCddLmluY2x1ZGVzKFxuICAgICAgICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzKClcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UoKSAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgIGlmIChcbiAgICAgICAgW1xuICAgICAgICAgICdVU0VSTkFNRV9BTkRfRU1BSUwnLFxuICAgICAgICAgICdVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUwnLFxuICAgICAgICAgICdVU0VSTkFNRV9PTkxZJyxcbiAgICAgICAgICAnVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEJ1xuICAgICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpXG4gICAgICApIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFVzZXJuYW1lRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgW1xuICAgICAgICAgICdVU0VSTkFNRV9BTkRfRU1BSUwnLFxuICAgICAgICAgICdFTUFJTF9PTkxZJyxcbiAgICAgICAgICAnRU1BSUxfT05MWV9OT19QQVNTV09SRCcsXG4gICAgICAgICAgJ1VTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRCdcbiAgICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKVxuICAgICAgKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRFbWFpbEZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoWydVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUwnXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKFxuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5nZXRFbWFpbEZpZWxkKCksIHsgcmVxdWlyZWQ6IGZhbHNlIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgIVsnRU1BSUxfT05MWV9OT19QQVNTV09SRCcsICdVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkQnXS5pbmNsdWRlcyhcbiAgICAgICAgICBwYXNzd29yZFNpZ251cEZpZWxkcygpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0UGFzc3dvcmRGaWVsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9SRVNFVCkge1xuICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldEVtYWlsRmllbGQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIE1ldGVvci5pc0NsaWVudCAmJlxuICAgICAgICAhQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uZ2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nKVxuICAgICAgKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgICAgfVxuICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldE5ld1Bhc3N3b3JkRmllbGQoKSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd0Vucm9sbEFjY291bnRGb3JtKCkpIHtcbiAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRTZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgIH1cbiAgICByZXR1cm4gaW5kZXhCeShsb2dpbkZpZWxkcywgJ2lkJyk7XG4gIH1cblxuICBidXR0b25zKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGxvZ2luUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLmxvZ2luUGF0aCxcbiAgICAgIHNpZ25VcFBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5zaWduVXBQYXRoLFxuICAgICAgcmVzZXRQYXNzd29yZFBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXNldFBhc3N3b3JkUGF0aCxcbiAgICAgIGNoYW5nZVBhc3N3b3JkUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLmNoYW5nZVBhc3N3b3JkUGF0aCxcbiAgICAgIHByb2ZpbGVQYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMucHJvZmlsZVBhdGhcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHVzZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUsIHdhaXRpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IGxvZ2luQnV0dG9ucyA9IFtdO1xuXG4gICAgaWYgKHVzZXIgJiYgZm9ybVN0YXRlID09IFNUQVRFUy5QUk9GSUxFKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc2lnbk91dCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnbk91dCcpLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogdGhpcy5zaWduT3V0LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dDcmVhdGVBY2NvdW50TGluaygpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9TaWduVXAnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25VcCcpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IHNpZ25VcFBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9TaWduVXAuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCB8fCBmb3JtU3RhdGUgPT0gU1RBVEVTLlBBU1NXT1JEX1JFU0VUKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9TaWduSW4nLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25JbicpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IGxvZ2luUGF0aCxcbiAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb1NpZ25Jbi5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93Rm9yZ290UGFzc3dvcmRMaW5rKCkpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzd2l0Y2hUb1Bhc3N3b3JkUmVzZXQnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2ZvcmdvdFBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogcmVzZXRQYXNzd29yZFBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9QYXNzd29yZFJlc2V0LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHVzZXIgJiZcbiAgICAgICFbJ0VNQUlMX09OTFlfTk9fUEFTU1dPUkQnLCAnVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEJ10uaW5jbHVkZXMoXG4gICAgICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzKClcbiAgICAgICkgJiZcbiAgICAgIGZvcm1TdGF0ZSA9PSBTVEFURVMuUFJPRklMRSAmJlxuICAgICAgKHVzZXIuc2VydmljZXMgJiYgJ3Bhc3N3b3JkJyBpbiB1c2VyLnNlcnZpY2VzKVxuICAgICkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3N3aXRjaFRvQ2hhbmdlUGFzc3dvcmQnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2NoYW5nZVBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogY2hhbmdlUGFzc3dvcmRQYXRoLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3NpZ25VcCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnblVwJyksXG4gICAgICAgIHR5cGU6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gJ3N1Ym1pdCcgOiAnbGluaycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGl2ZScsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/IHRoaXMuc2lnblVwLmJpbmQodGhpcywge30pIDogbnVsbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd1NpZ25JbkxpbmsoKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3NpZ25JbicsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnbkluJyksXG4gICAgICAgIHR5cGU6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gJ3N1Ym1pdCcgOiAnbGluaycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGl2ZScsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/IHRoaXMuc2lnbkluLmJpbmQodGhpcykgOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9SRVNFVCkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ2VtYWlsUmVzZXRMaW5rJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdyZXNldFlvdXJQYXNzd29yZCcpLFxuICAgICAgICB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMucGFzc3dvcmRSZXNldC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93UGFzc3dvcmRDaGFuZ2VGb3JtKCkgfHwgdGhpcy5zaG93RW5yb2xsQWNjb3VudEZvcm0oKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ2NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbGFiZWw6IHRoaXMuc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpXG4gICAgICAgICAgPyB0aGlzLnRyYW5zbGF0ZSgnY2hhbmdlUGFzc3dvcmQnKVxuICAgICAgICAgIDogdGhpcy50cmFuc2xhdGUoJ3NldFBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdzdWJtaXQnLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogdGhpcy5wYXNzd29yZENoYW5nZS5iaW5kKHRoaXMpXG4gICAgICB9KTtcblxuICAgICAgaWYgKEFjY291bnRzLnVzZXIoKSkge1xuICAgICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdzd2l0Y2hUb1NpZ25PdXQnLFxuICAgICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnY2FuY2VsJyksXG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIGhyZWY6IHByb2ZpbGVQYXRoLFxuICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9TaWduT3V0LmJpbmQodGhpcylcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgaWQ6ICdjYW5jZWxSZXNldFBhc3N3b3JkJyxcbiAgICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2NhbmNlbCcpLFxuICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICBvbkNsaWNrOiB0aGlzLmNhbmNlbFJlc2V0UGFzc3dvcmQuYmluZCh0aGlzKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBidXR0b24gYXJyYXkgc28gdGhhdCB0aGUgc3VibWl0IGJ1dHRvbiBhbHdheXMgY29tZXMgZmlyc3QsIGFuZFxuICAgIC8vIGJ1dHRvbnMgc2hvdWxkIGFsc28gY29tZSBiZWZvcmUgbGlua3MuXG4gICAgbG9naW5CdXR0b25zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIChiLnR5cGUgPT0gJ3N1Ym1pdCcgJiYgYS50eXBlICE9IHVuZGVmaW5lZCkgLVxuICAgICAgICAoYS50eXBlID09ICdzdWJtaXQnICYmIGIudHlwZSAhPSB1bmRlZmluZWQpXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluZGV4QnkobG9naW5CdXR0b25zLCAnaWQnKTtcbiAgfVxuXG4gIHNob3dTaWduSW5MaW5rKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiAmJiBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddXG4gICAgKTtcbiAgfVxuXG4gIHNob3dQYXNzd29yZENoYW5nZUZvcm0oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ10gJiZcbiAgICAgIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9DSEFOR0VcbiAgICApO1xuICB9XG5cbiAgc2hvd0Vucm9sbEFjY291bnRGb3JtKCkge1xuICAgIHJldHVybiAoXG4gICAgICBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddICYmXG4gICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuRU5ST0xMX0FDQ09VTlRcbiAgICApO1xuICB9XG5cbiAgc2hvd0NyZWF0ZUFjY291bnRMaW5rKCkge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiAmJlxuICAgICAgIUFjY291bnRzLl9vcHRpb25zLmZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiAmJlxuICAgICAgUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXVxuICAgICk7XG4gIH1cblxuICBzaG93Rm9yZ290UGFzc3dvcmRMaW5rKCkge1xuICAgIHJldHVybiAoXG4gICAgICAhdGhpcy5wcm9wcy51c2VyICYmXG4gICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiAmJlxuICAgICAgW1xuICAgICAgICAnVVNFUk5BTUVfQU5EX0VNQUlMJyxcbiAgICAgICAgJ1VTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTCcsXG4gICAgICAgICdFTUFJTF9PTkxZJ1xuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIHN0b3JlIGZpZWxkIHZhbHVlcyB3aGlsZSB1c2luZyB0aGUgZm9ybS5cbiAgICovXG4gIHNldERlZmF1bHRGaWVsZFZhbHVlcyhkZWZhdWx0cykge1xuICAgIGlmICh0eXBlb2YgZGVmYXVsdHMgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdBcmd1bWVudCB0byBzZXREZWZhdWx0RmllbGRWYWx1ZXMgaXMgbm90IG9mIHR5cGUgb2JqZWN0J1xuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICdhY2NvdW50c191aScsXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBwYXNzd29yZFNpZ251cEZpZWxkczogcGFzc3dvcmRTaWdudXBGaWVsZHMoKSxcbiAgICAgICAgICAuLi50aGlzLmdldERlZmF1bHRGaWVsZFZhbHVlcygpLFxuICAgICAgICAgIC4uLmRlZmF1bHRzXG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gZ2V0IGZpZWxkIHZhbHVlcyB3aGVuIHN3aXRjaGluZyBzdGF0ZXMgaW4gdGhlIGZvcm0uXG4gICAqL1xuICBnZXREZWZhdWx0RmllbGRWYWx1ZXMoKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgZGVmYXVsdEZpZWxkVmFsdWVzID0gSlNPTi5wYXJzZShcbiAgICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRzX3VpJykgfHwgbnVsbFxuICAgICAgKTtcbiAgICAgIGlmIChcbiAgICAgICAgZGVmYXVsdEZpZWxkVmFsdWVzICYmXG4gICAgICAgIGRlZmF1bHRGaWVsZFZhbHVlcy5wYXNzd29yZFNpZ251cEZpZWxkcyA9PT0gcGFzc3dvcmRTaWdudXBGaWVsZHMoKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0RmllbGRWYWx1ZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBjbGVhciBmaWVsZCB2YWx1ZXMgd2hlbiBzaWduaW5nIGluLCB1cCBvciBvdXQuXG4gICAqL1xuICBjbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudHNfdWknKTtcbiAgICB9XG4gIH1cblxuICBzd2l0Y2hUb1NpZ25VcChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX1VQLFxuICAgICAgLi4udGhpcy5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKVxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICB9XG5cbiAgc3dpdGNoVG9TaWduSW4oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9JTixcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKClcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvUGFzc3dvcmRSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QQVNTV09SRF9SRVNFVCxcbiAgICAgIC4uLnRoaXMuZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKClcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUEFTU1dPUkRfQ0hBTkdFLFxuICAgICAgLi4udGhpcy5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKVxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICB9XG5cbiAgc3dpdGNoVG9TaWduT3V0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEVcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIGNhbmNlbFJlc2V0UGFzc3dvcmQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgncmVzZXRQYXNzd29yZFRva2VuJywgbnVsbCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX0lOLFxuICAgICAgbWVzc2FnZXM6IFtdXG4gICAgfSk7XG4gIH1cblxuICBzaWduT3V0KCkge1xuICAgIE1ldGVvci5sb2dvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlNJR05fSU4sXG4gICAgICAgIHBhc3N3b3JkOiBudWxsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGUub25TaWduZWRPdXRIb29rKCk7XG4gICAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25JbigpIHtcbiAgICBjb25zdCB7XG4gICAgICB1c2VybmFtZSA9IG51bGwsXG4gICAgICBlbWFpbCA9IG51bGwsXG4gICAgICB1c2VybmFtZU9yRW1haWwgPSBudWxsLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBvblN1Ym1pdEhvb2tcbiAgICB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICBsZXQgbG9naW5TZWxlY3RvcjtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcblxuICAgIGlmICh1c2VybmFtZU9yRW1haWwgIT09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lT3JFbWFpbCkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXG4gICAgICAgICAgICAnZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZCcsXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIFsnVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEJ10uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGhpcy5sb2dpbldpdGhvdXRQYXNzd29yZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dpblNlbGVjdG9yID0gdXNlcm5hbWVPckVtYWlsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh1c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUub25TdWJtaXRIb29rKFxuICAgICAgICAgICAgJ2Vycm9yLmFjY291bnRzLnVzZXJuYW1lUmVxdWlyZWQnLFxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5mb3JtU3RhdGVcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2luU2VsZWN0b3IgPSB7IHVzZXJuYW1lOiB1c2VybmFtZSB9O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodXNlcm5hbWVPckVtYWlsID09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoWydFTUFJTF9PTkxZX05PX1BBU1NXT1JEJ10uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgICB0aGlzLmxvZ2luV2l0aG91dFBhc3N3b3JkKCk7XG4gICAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2luU2VsZWN0b3IgPSB7IGVtYWlsIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKFxuICAgICAgIVsnRU1BSUxfT05MWV9OT19QQVNTV09SRCddLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpICYmXG4gICAgICAhdGhpcy52YWxpZGF0ZUZpZWxkKCdwYXNzd29yZCcsIHBhc3N3b3JkKVxuICAgICkge1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIE1ldGVvci5sb2dpbldpdGhQYXNzd29yZChsb2dpblNlbGVjdG9yLCBwYXNzd29yZCwgKGVycm9yLCByZXN1bHQpID0+IHtcbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgJ3Vua25vd25fZXJyb3InLFxuICAgICAgICAgICAgJ2Vycm9yJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjaygoKSA9PiB0aGlzLnN0YXRlLm9uU2lnbmVkSW5Ib29rKCkpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBudWxsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvYXV0aEJ1dHRvbnMoKSB7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUsIHdhaXRpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IG9hdXRoQnV0dG9ucyA9IFtdO1xuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gfHwgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICBpZiAoQWNjb3VudHMub2F1dGgpIHtcbiAgICAgICAgQWNjb3VudHMub2F1dGguc2VydmljZU5hbWVzKCkubWFwKHNlcnZpY2UgPT4ge1xuICAgICAgICAgIG9hdXRoQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBzZXJ2aWNlLFxuICAgICAgICAgICAgbGFiZWw6IGNhcGl0YWxpemUoc2VydmljZSksXG4gICAgICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgICAgIHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBgYnRuLSR7c2VydmljZX0gJHtzZXJ2aWNlfWAsXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLm9hdXRoU2lnbkluLmJpbmQodGhpcywgc2VydmljZSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleEJ5KG9hdXRoQnV0dG9ucywgJ2lkJyk7XG4gIH1cblxuICBvYXV0aFNpZ25JbihzZXJ2aWNlTmFtZSkge1xuICAgIGNvbnN0IHsgdXNlciB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSwgd2FpdGluZywgb25TdWJtaXRIb29rIH0gPSB0aGlzLnN0YXRlO1xuICAgIC8vVGhhbmtzIEpvc2ggT3dlbnMgZm9yIHRoaXMgb25lLlxuICAgIGZ1bmN0aW9uIGNhcGl0YWxTZXJ2aWNlKCkge1xuICAgICAgcmV0dXJuIHNlcnZpY2VOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc2VydmljZU5hbWUuc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgaWYgKHNlcnZpY2VOYW1lID09PSAnbWV0ZW9yLWRldmVsb3BlcicpIHtcbiAgICAgIHNlcnZpY2VOYW1lID0gJ21ldGVvckRldmVsb3BlckFjY291bnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ2luV2l0aFNlcnZpY2UgPSBNZXRlb3JbJ2xvZ2luV2l0aCcgKyBjYXBpdGFsU2VydmljZSgpXTtcblxuICAgIGxldCBvcHRpb25zID0ge307IC8vIHVzZSBkZWZhdWx0IHNjb3BlIHVubGVzcyBzcGVjaWZpZWRcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VOYW1lXSlcbiAgICAgIG9wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zID1cbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VOYW1lXTtcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbltzZXJ2aWNlTmFtZV0pXG4gICAgICBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4gPVxuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VOYW1lXTtcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlTmFtZV0pXG4gICAgICBvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQgPVxuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0W3NlcnZpY2VOYW1lXTtcblxuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGxvZ2luV2l0aFNlcnZpY2Uob3B0aW9ucywgZXJyb3IgPT4ge1xuICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgJ3Vua25vd25fZXJyb3InKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFIH0pO1xuICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIGxvZ2luUmVzdWx0Q2FsbGJhY2soKCkgPT4ge1xuICAgICAgICAgIE1ldGVvci5zZXRUaW1lb3V0KCgpID0+IHRoaXMuc3RhdGUub25TaWduZWRJbkhvb2soKSwgMTAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzaWduVXAob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgdXNlcm5hbWUgPSBudWxsLFxuICAgICAgZW1haWwgPSBudWxsLFxuICAgICAgdXNlcm5hbWVPckVtYWlsID0gbnVsbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG5cbiAgICBpZiAodXNlcm5hbWUgIT09IG51bGwpIHtcbiAgICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLm9uU3VibWl0SG9vayhcbiAgICAgICAgICAgICdlcnJvci5hY2NvdW50cy51c2VybmFtZVJlcXVpcmVkJyxcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuZm9ybVN0YXRlXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgWydVU0VSTkFNRV9BTkRfRU1BSUwnLCAnVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEJ10uaW5jbHVkZXMoXG4gICAgICAgICAgcGFzc3dvcmRTaWdudXBGaWVsZHMoKVxuICAgICAgICApICYmXG4gICAgICAgICF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpXG4gICAgICApIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXG4gICAgICAgICAgICAnZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZCcsXG4gICAgICAgICAgICB0aGlzLnN0YXRlLmZvcm1TdGF0ZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLmVtYWlsID0gZW1haWw7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgWydFTUFJTF9PTkxZX05PX1BBU1NXT1JEJywgJ1VTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRCddLmluY2x1ZGVzKFxuICAgICAgICBwYXNzd29yZFNpZ251cEZpZWxkcygpXG4gICAgICApXG4gICAgKSB7XG4gICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBwYXNzd29yZC5cbiAgICAgIG9wdGlvbnMucGFzc3dvcmQgPSBNZXRlb3IudXVpZCgpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgncGFzc3dvcmQnLCBwYXNzd29yZCkpIHtcbiAgICAgIG9uU3VibWl0SG9vaygnSW52YWxpZCBwYXNzd29yZCcsIGZvcm1TdGF0ZSk7XG4gICAgICBlcnJvciA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICB9XG5cbiAgICBjb25zdCBTaWduVXAgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgICAgQWNjb3VudHMuY3JlYXRlVXNlcihfb3B0aW9ucywgZXJyb3IgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgJ3Vua25vd25fZXJyb3InLFxuICAgICAgICAgICAgJ2Vycm9yJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHRoaXMudHJhbnNsYXRlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gKSkge1xuICAgICAgICAgICAgb25TdWJtaXRIb29rKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvblN1Ym1pdEhvb2soJ3Vua25vd25fZXJyb3InLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvblN1Ym1pdEhvb2sobnVsbCwgZm9ybVN0YXRlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSwgcGFzc3dvcmQ6IG51bGwgfSk7XG4gICAgICAgICAgbGV0IHVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjayhcbiAgICAgICAgICAgIHRoaXMuc3RhdGUub25Qb3N0U2lnblVwSG9vay5iaW5kKHRoaXMsIF9vcHRpb25zLCB1c2VyKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiB0cnVlIH0pO1xuICAgICAgLy8gQWxsb3cgZm9yIFByb21pc2VzIHRvIHJldHVybi5cbiAgICAgIGxldCBwcm9taXNlID0gdGhpcy5zdGF0ZS5vblByZVNpZ25VcEhvb2sob3B0aW9ucyk7XG4gICAgICBpZiAocHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKFNpZ25VcC5iaW5kKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFNpZ25VcChvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2dpbldpdGhvdXRQYXNzd29yZCgpIHtcbiAgICBjb25zdCB7XG4gICAgICBlbWFpbCA9ICcnLFxuICAgICAgdXNlcm5hbWVPckVtYWlsID0gJycsXG4gICAgICB3YWl0aW5nLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAod2FpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnZhbGlkYXRlRmllbGQoJ2VtYWlsJywgZW1haWwpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcblxuICAgICAgQWNjb3VudHMubG9naW5XaXRob3V0UGFzc3dvcmQoeyBlbWFpbDogZW1haWwgfSwgZXJyb3IgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgJ3Vua25vd25fZXJyb3InLFxuICAgICAgICAgICAgJ2Vycm9yJ1xuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZSh0aGlzLnRyYW5zbGF0ZSgnaW5mby5lbWFpbFNlbnQnKSwgJ3N1Y2Nlc3MnLCA1MDAwKTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZU9yRW1haWwpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcblxuICAgICAgQWNjb3VudHMubG9naW5XaXRob3V0UGFzc3dvcmQoXG4gICAgICAgIHsgZW1haWw6IHVzZXJuYW1lT3JFbWFpbCwgdXNlcm5hbWU6IHVzZXJuYW1lT3JFbWFpbCB9LFxuICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFxuICAgICAgICAgICAgICBgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCAndW5rbm93bl9lcnJvcicsXG4gICAgICAgICAgICAgICdlcnJvcidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodGhpcy50cmFuc2xhdGUoJ2luZm8uZW1haWxTZW50JyksICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBlcnJNc2cgPSBudWxsO1xuICAgICAgaWYgKFsnVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEJ10uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgZXJyTXNnID0gdGhpcy50cmFuc2xhdGUoJ2Vycm9yLmFjY291bnRzLmludmFsaWRfZW1haWwnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVyck1zZyA9IHRoaXMudHJhbnNsYXRlKCdlcnJvci5hY2NvdW50cy5pbnZhbGlkX2VtYWlsJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnNob3dNZXNzYWdlKGVyck1zZywgJ3dhcm5pbmcnKTtcbiAgICAgIG9uU3VibWl0SG9vayhlcnJNc2csIGZvcm1TdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcGFzc3dvcmRSZXNldCgpIHtcbiAgICBjb25zdCB7IGVtYWlsID0gJycsIHdhaXRpbmcsIGZvcm1TdGF0ZSwgb25TdWJtaXRIb29rIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHdhaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICBpZiAodGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IHRydWUgfSk7XG5cbiAgICAgIEFjY291bnRzLmZvcmdvdFBhc3N3b3JkKHsgZW1haWw6IGVtYWlsIH0sIGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcbiAgICAgICAgICAgIGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8ICd1bmtub3duX2Vycm9yJyxcbiAgICAgICAgICAgICdlcnJvcidcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UodGhpcy50cmFuc2xhdGUoJ2luZm8uZW1haWxTZW50JyksICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcGFzc3dvcmRDaGFuZ2UoKSB7XG4gICAgY29uc3Qge1xuICAgICAgcGFzc3dvcmQsXG4gICAgICBuZXdQYXNzd29yZCxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9vayxcbiAgICAgIG9uU2lnbmVkSW5Ib29rXG4gICAgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgncGFzc3dvcmQnLCBuZXdQYXNzd29yZCkpIHtcbiAgICAgIG9uU3VibWl0SG9vaygnZXJyLm1pbkNoYXInLCBmb3JtU3RhdGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB0b2tlbiA9IEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLmdldCgncmVzZXRQYXNzd29yZFRva2VuJyk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgdG9rZW4gPSBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5nZXQoJ2Vucm9sbEFjY291bnRUb2tlbicpO1xuICAgIH1cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIEFjY291bnRzLnJlc2V0UGFzc3dvcmQodG9rZW4sIG5ld1Bhc3N3b3JkLCBlcnJvciA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXG4gICAgICAgICAgICBgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCAndW5rbm93bl9lcnJvcicsXG4gICAgICAgICAgICAnZXJyb3InXG4gICAgICAgICAgKTtcbiAgICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsIGZvcm1TdGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcbiAgICAgICAgICAgIHRoaXMudHJhbnNsYXRlKCdpbmZvLnBhc3N3b3JkQ2hhbmdlZCcpLFxuICAgICAgICAgICAgJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgNTAwMFxuICAgICAgICAgICk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCBudWxsKTtcbiAgICAgICAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2Vucm9sbEFjY291bnRUb2tlbicsIG51bGwpO1xuICAgICAgICAgIG9uU2lnbmVkSW5Ib29rKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBBY2NvdW50cy5jaGFuZ2VQYXNzd29yZChwYXNzd29yZCwgbmV3UGFzc3dvcmQsIGVycm9yID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcbiAgICAgICAgICAgIGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8ICd1bmtub3duX2Vycm9yJyxcbiAgICAgICAgICAgICdlcnJvcidcbiAgICAgICAgICApO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKCdpbmZvLnBhc3N3b3JkQ2hhbmdlZCcsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzaG93TWVzc2FnZShtZXNzYWdlLCB0eXBlLCBjbGVhclRpbWVvdXQsIGZpZWxkKSB7XG4gICAgbWVzc2FnZSA9IHRoaXMudHJhbnNsYXRlKG1lc3NhZ2UpLnRyaW0oKTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoeyBtZXNzYWdlcyA9IFtdIH0pID0+IHtcbiAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIC4uLihmaWVsZCAmJiB7IGZpZWxkIH0pXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyBtZXNzYWdlcyB9O1xuICAgICAgfSk7XG4gICAgICBpZiAoY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSBtZXNzYWdlIHRoYXQgdGltZWQgb3V0LlxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9LCBjbGVhclRpbWVvdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE1lc3NhZ2VGb3JGaWVsZChmaWVsZCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZXMgPSBbXSB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gbWVzc2FnZXMuZmluZCgoeyBmaWVsZDoga2V5IH0pID0+IGtleSA9PT0gZmllbGQpO1xuICB9XG5cbiAgY2xlYXJNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoeyBtZXNzYWdlcyA9IFtdIH0pID0+ICh7XG4gICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlcy5maWx0ZXIoKHsgbWVzc2FnZTogYSB9KSA9PiBhICE9PSBtZXNzYWdlKVxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyTWVzc2FnZXMoKSB7XG4gICAgaWYgKHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVNZXNzYWdlVGltb3V0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzOiBbXSB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAvLyBYWFggQ2hlY2sgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgUmVhY3RET00ucmVuZGVyKDxBY2NvdW50cy51aS5GaWVsZCBtZXNzYWdlPVwidGVzdFwiIC8+LCBjb250YWluZXIpO1xuICAgICAgaWYgKGNvbnRhaW5lci5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtZXNzYWdlJykubGVuZ3RoID09IDApIHtcbiAgICAgICAgLy8gRm91bmQgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgaXNzdWUgd2l0aCAxLjMueFxuICAgICAgICBjb25zb2xlLndhcm4oYEltcGxlbWVudGF0aW9ucyBvZiBBY2NvdW50cy51aS5GaWVsZCBtdXN0IHJlbmRlciBtZXNzYWdlIGluIHYxLjIuMTEuXG4gICAgICAgICAgaHR0cHM6Ly9naXRodWIuY29tL3N0dWRpb2ludGVyYWN0L2FjY291bnRzLXVpLyNkZXByZWNhdGlvbnNgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5oaWRlTWVzc2FnZVRpbW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLm9hdXRoQnV0dG9ucygpO1xuICAgIC8vIEJhY2t3b3JkcyBjb21wYXRpYmlsaXR5IHdpdGggdjEuMi54LlxuICAgIGNvbnN0IHsgbWVzc2FnZXMgPSBbXSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgZGVwcmVjYXRlZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VzLm1hcCgoeyBtZXNzYWdlIH0pID0+IG1lc3NhZ2UpLmpvaW4oJywgJylcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8QWNjb3VudHMudWkuRm9ybVxuICAgICAgICBvYXV0aFNlcnZpY2VzPXt0aGlzLm9hdXRoQnV0dG9ucygpfVxuICAgICAgICBmaWVsZHM9e3RoaXMuZmllbGRzKCl9XG4gICAgICAgIGJ1dHRvbnM9e3RoaXMuYnV0dG9ucygpfVxuICAgICAgICB7Li4udGhpcy5zdGF0ZX1cbiAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cbiAgICAgICAgdHJhbnNsYXRlPXt0ZXh0ID0+IHRoaXMudHJhbnNsYXRlKHRleHQpfVxuICAgICAgLz5cbiAgICApO1xuICB9XG59XG5Mb2dpbkZvcm0ucHJvcFR5cGVzID0ge1xuICBmb3JtU3RhdGU6IFByb3BUeXBlcy5zeW1ib2wsXG4gIGxvZ2luUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgc2lnblVwUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHByb2ZpbGVQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBjaGFuZ2VQYXNzd29yZFBhdGg6IFByb3BUeXBlcy5zdHJpbmdcbn07XG5Mb2dpbkZvcm0uZGVmYXVsdFByb3BzID0ge1xuICBmb3JtU3RhdGU6IG51bGwsXG4gIGxvZ2luUGF0aDogbnVsbCxcbiAgc2lnblVwUGF0aDogbnVsbCxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IG51bGwsXG4gIHByb2ZpbGVQYXRoOiBudWxsLFxuICBjaGFuZ2VQYXNzd29yZFBhdGg6IG51bGxcbn07XG5cbkFjY291bnRzLnVpLkxvZ2luRm9ybSA9IExvZ2luRm9ybTtcblxuY29uc3QgTG9naW5Gb3JtQ29udGFpbmVyID0gd2l0aFRyYWNrZXIoKCkgPT4ge1xuICAvLyBMaXN0ZW4gZm9yIHRoZSB1c2VyIHRvIGxvZ2luL2xvZ291dCBhbmQgdGhlIHNlcnZpY2VzIGxpc3QgdG8gdGhlIHVzZXIuXG4gIE1ldGVvci5zdWJzY3JpYmUoJ3NlcnZpY2VzTGlzdCcpO1xuICByZXR1cm4ge1xuICAgIHVzZXI6IEFjY291bnRzLnVzZXIoKVxuICB9O1xufSkoTG9naW5Gb3JtKTtcbkFjY291bnRzLnVpLkxvZ2luRm9ybSA9IExvZ2luRm9ybUNvbnRhaW5lcjtcbmV4cG9ydCBkZWZhdWx0IExvZ2luRm9ybUNvbnRhaW5lcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgeyBUOW4gfSBmcm9tICdtZXRlb3ItYWNjb3VudHMtdDluJztcbmltcG9ydCB7IGhhc1Bhc3N3b3JkU2VydmljZSB9IGZyb20gJy4uLy4uL2hlbHBlcnMuanMnO1xuXG5leHBvcnQgY2xhc3MgUGFzc3dvcmRPclNlcnZpY2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGFzUGFzc3dvcmRTZXJ2aWNlOiBoYXNQYXNzd29yZFNlcnZpY2UoKSxcbiAgICAgIHNlcnZpY2VzOiBPYmplY3Qua2V5cyhwcm9wcy5vYXV0aFNlcnZpY2VzKS5tYXAoc2VydmljZSA9PiB7XG4gICAgICAgIHJldHVybiBwcm9wcy5vYXV0aFNlcnZpY2VzW3NlcnZpY2VdLmxhYmVsO1xuICAgICAgfSlcbiAgICB9O1xuICB9XG5cbiAgdHJhbnNsYXRlKHRleHQpIHtcbiAgICBpZiAodGhpcy5wcm9wcy50cmFuc2xhdGUpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb3BzLnRyYW5zbGF0ZSh0ZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIFQ5bi5nZXQodGV4dCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHsgY2xhc3NOYW1lID0gJ3Bhc3N3b3JkLW9yLXNlcnZpY2UnLCBzdHlsZSA9IHt9IH0gPSB0aGlzLnByb3BzO1xuICAgIGxldCB7IGhhc1Bhc3N3b3JkU2VydmljZSwgc2VydmljZXMgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGFiZWxzID0gc2VydmljZXM7XG4gICAgaWYgKHNlcnZpY2VzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGxhYmVscyA9IFtdO1xuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UgJiYgc2VydmljZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAgICB7YCR7dGhpcy50cmFuc2xhdGUoJ29yVXNlJyl9ICR7bGFiZWxzLmpvaW4oJyAvICcpfWB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuUGFzc3dvcmRPclNlcnZpY2UucHJvcFR5cGVzID0ge1xuICBvYXV0aFNlcnZpY2VzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5BY2NvdW50cy51aS5QYXNzd29yZE9yU2VydmljZSA9IFBhc3N3b3JkT3JTZXJ2aWNlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAnLi9CdXR0b24uanN4JztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5leHBvcnQgY2xhc3MgU29jaWFsQnV0dG9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlcigpIHtcbiAgICBsZXQgeyBvYXV0aFNlcnZpY2VzID0ge30sIGNsYXNzTmFtZSA9ICdzb2NpYWwtYnV0dG9ucycgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAgICB7T2JqZWN0LmtleXMob2F1dGhTZXJ2aWNlcykubWFwKChpZCwgaSkgPT4ge1xuICAgICAgICAgIHJldHVybiA8QWNjb3VudHMudWkuQnV0dG9uIHsuLi5vYXV0aFNlcnZpY2VzW2lkXX0ga2V5PXtpfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLlNvY2lhbEJ1dHRvbnMgPSBTb2NpYWxCdXR0b25zO1xuIl19
