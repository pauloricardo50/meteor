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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var __coffeescriptShare, T9n;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n.coffee.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
                                                                                                                       // 2
                                                                                                                       // 3
Meteor.startup(function() {                                                                                            // 4
  if (Meteor.isClient) {                                                                                               // 5
    return typeof Template !== "undefined" && Template !== null ? Template.registerHelper('t9n', function(x, params) {
      return T9n.get(x, true, params.hash);                                                                            // 7
    }) : void 0;                                                                                                       // 8
  }                                                                                                                    // 9
});                                                                                                                    // 10
                                                                                                                       // 11
T9n = (function() {                                                                                                    // 12
  function T9n() {}                                                                                                    // 13
                                                                                                                       // 14
  T9n.maps = {};                                                                                                       // 15
                                                                                                                       // 16
  T9n.defaultLanguage = 'en';                                                                                          // 17
                                                                                                                       // 18
  T9n.language = '';                                                                                                   // 19
                                                                                                                       // 20
  T9n.dep = new Deps.Dependency();                                                                                     // 21
                                                                                                                       // 22
  T9n.depLanguage = new Deps.Dependency();                                                                             // 23
                                                                                                                       // 24
  T9n.missingPrefix = ">";                                                                                             // 25
                                                                                                                       // 26
  T9n.missingPostfix = "<";                                                                                            // 27
                                                                                                                       // 28
  T9n.map = function(language, map) {                                                                                  // 29
    if (!this.maps[language]) {                                                                                        // 30
      this.maps[language] = {};                                                                                        // 31
    }                                                                                                                  // 32
    this.registerMap(language, '', false, map);                                                                        // 33
    return this.dep.changed();                                                                                         // 34
  };                                                                                                                   // 35
                                                                                                                       // 36
  T9n.get = function(label, markIfMissing, args, language) {                                                           // 37
    var index, parent, ret, _ref, _ref1;                                                                               // 38
    if (markIfMissing == null) {                                                                                       // 39
      markIfMissing = true;                                                                                            // 40
    }                                                                                                                  // 41
    if (args == null) {                                                                                                // 42
      args = {};                                                                                                       // 43
    }                                                                                                                  // 44
    this.dep.depend();                                                                                                 // 45
    this.depLanguage.depend();                                                                                         // 46
    if (typeof label !== 'string') {                                                                                   // 47
      return '';                                                                                                       // 48
    }                                                                                                                  // 49
    if (language == null) {                                                                                            // 50
      language = this.language;                                                                                        // 51
    }                                                                                                                  // 52
    ret = (_ref = this.maps[language]) != null ? _ref[label] : void 0;                                                 // 53
    if (!ret) {                                                                                                        // 54
      index = language.lastIndexOf('_');                                                                               // 55
      if (index) {                                                                                                     // 56
        parent = language.substring(0, index);                                                                         // 57
        if (parent) {                                                                                                  // 58
          return this.get(label, markIfMissing, args, parent);                                                         // 59
        }                                                                                                              // 60
      }                                                                                                                // 61
    }                                                                                                                  // 62
    if (!ret) {                                                                                                        // 63
      ret = (_ref1 = this.maps[this.defaultLanguage]) != null ? _ref1[label] : void 0;                                 // 64
    }                                                                                                                  // 65
    if (!ret) {                                                                                                        // 66
      if (markIfMissing) {                                                                                             // 67
        return this.missingPrefix + label + this.missingPostfix;                                                       // 68
      } else {                                                                                                         // 69
        return label;                                                                                                  // 70
      }                                                                                                                // 71
    }                                                                                                                  // 72
    if (Object.keys(args).length === 0) {                                                                              // 73
      return ret;                                                                                                      // 74
    } else {                                                                                                           // 75
      return this.replaceParams(ret, args);                                                                            // 76
    }                                                                                                                  // 77
  };                                                                                                                   // 78
                                                                                                                       // 79
  T9n.registerMap = function(language, prefix, dot, map) {                                                             // 80
    var key, value, _results;                                                                                          // 81
    if (typeof map === 'string') {                                                                                     // 82
      return this.maps[language][prefix] = map;                                                                        // 83
    } else if (typeof map === 'object') {                                                                              // 84
      if (dot) {                                                                                                       // 85
        prefix = prefix + '.';                                                                                         // 86
      }                                                                                                                // 87
      _results = [];                                                                                                   // 88
      for (key in map) {                                                                                               // 89
        value = map[key];                                                                                              // 90
        _results.push(this.registerMap(language, prefix + key, true, value));                                          // 91
      }                                                                                                                // 92
      return _results;                                                                                                 // 93
    }                                                                                                                  // 94
  };                                                                                                                   // 95
                                                                                                                       // 96
  T9n.getLanguage = function() {                                                                                       // 97
    this.depLanguage.depend();                                                                                         // 98
    return this.language;                                                                                              // 99
  };                                                                                                                   // 100
                                                                                                                       // 101
  T9n.getLanguages = function() {                                                                                      // 102
    this.dep.depend();                                                                                                 // 103
    return Object.keys(this.maps).sort();                                                                              // 104
  };                                                                                                                   // 105
                                                                                                                       // 106
  T9n.getLanguageInfo = function() {                                                                                   // 107
    var k, keys, _i, _len, _results;                                                                                   // 108
    this.dep.depend();                                                                                                 // 109
    keys = Object.keys(this.maps).sort();                                                                              // 110
    _results = [];                                                                                                     // 111
    for (_i = 0, _len = keys.length; _i < _len; _i++) {                                                                // 112
      k = keys[_i];                                                                                                    // 113
      _results.push({                                                                                                  // 114
        name: this.maps[k]['t9Name'],                                                                                  // 115
        code: k                                                                                                        // 116
      });                                                                                                              // 117
    }                                                                                                                  // 118
    return _results;                                                                                                   // 119
  };                                                                                                                   // 120
                                                                                                                       // 121
  T9n.setLanguage = function(language) {                                                                               // 122
    if (this.language === language) {                                                                                  // 123
      return;                                                                                                          // 124
    }                                                                                                                  // 125
    language = language.replace(new RegExp('-', 'g'), '_');                                                            // 126
    if (!this.maps[language]) {                                                                                        // 127
      if (language.indexOf('_') > 1) {                                                                                 // 128
        return this.setLanguage(language.substring(0, language.lastIndexOf('_')));                                     // 129
      } else {                                                                                                         // 130
        throw Error("language " + language + " does not exist");                                                       // 131
      }                                                                                                                // 132
    }                                                                                                                  // 133
    this.language = language;                                                                                          // 134
    return this.depLanguage.changed();                                                                                 // 135
  };                                                                                                                   // 136
                                                                                                                       // 137
  T9n.replaceParams = function(str, args) {                                                                            // 138
    var key, re, value;                                                                                                // 139
    for (key in args) {                                                                                                // 140
      value = args[key];                                                                                               // 141
      re = new RegExp("@{" + key + "}", 'g');                                                                          // 142
      str = str.replace(re, value);                                                                                    // 143
    }                                                                                                                  // 144
    return str;                                                                                                        // 145
  };                                                                                                                   // 146
                                                                                                                       // 147
  return T9n;                                                                                                          // 148
                                                                                                                       // 149
})();                                                                                                                  // 150
                                                                                                                       // 151
this.T9n = T9n;                                                                                                        // 152
                                                                                                                       // 153
this.t9n = function(x, includePrefix, params) {                                                                        // 154
  return T9n.get(x);                                                                                                   // 155
};                                                                                                                     // 156
                                                                                                                       // 157
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ar.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ar;                                                                                                                // 2
                                                                                                                       // 3
ar = {                                                                                                                 // 4
  add: "اضف",                                                                                                          // 5
  and: "و",                                                                                                            // 6
  back: "رجوع",                                                                                                        // 7
  changePassword: "غير كلمة السر",                                                                                     // 8
  choosePassword: "اختر كلمة السر",                                                                                    // 9
  clickAgree: "بفتح حسابك انت توافق على",                                                                              // 10
  configure: "تعديل",                                                                                                  // 11
  createAccount: "افتح حساب جديد",                                                                                     // 12
  currentPassword: "كلمة السر الحالية",                                                                                // 13
  dontHaveAnAccount: "ليس عندك حساب؟",                                                                                 // 14
  email: "البريد الالكترونى",                                                                                          // 15
  emailAddress: "البريد الالكترونى",                                                                                   // 16
  emailResetLink: "اعادة تعيين البريد الالكترونى",                                                                     // 17
  forgotPassword: "نسيت كلمة السر؟",                                                                                   // 18
  ifYouAlreadyHaveAnAccount: "اذا كان عندك حساب",                                                                      // 19
  newPassword: "كلمة السر الجديدة",                                                                                    // 20
  newPasswordAgain: "كلمة السر الجديدة مرة اخرى",                                                                      // 21
  optional: "اختيارى",                                                                                                 // 22
  OR: "او",                                                                                                            // 23
  password: "كلمة السر",                                                                                               // 24
  passwordAgain: "كلمة السر مرة اخرى",                                                                                 // 25
  privacyPolicy: "سياسة الخصوصية",                                                                                     // 26
  remove: "ازالة",                                                                                                     // 27
  resetYourPassword: "اعادة تعيين كلمة السر",                                                                          // 28
  setPassword: "تعيين كلمة السر",                                                                                      // 29
  sign: "تسجيل",                                                                                                       // 30
  signIn: "تسجيل الدخول",                                                                                              // 31
  signin: "تسجيل الدخول",                                                                                              // 32
  signOut: "تسجيل الخروج",                                                                                             // 33
  signUp: "افتح حساب جديد",                                                                                            // 34
  signupCode: "رمز التسجيل",                                                                                           // 35
  signUpWithYourEmailAddress: "سجل ببريدك الالكترونى",                                                                 // 36
  terms: "شروط الاستخدام",                                                                                             // 37
  updateYourPassword: "جدد كلمة السر",                                                                                 // 38
  username: "اسم المستخدم",                                                                                            // 39
  usernameOrEmail: "اسم المستخدم او البريد الالكترونى",                                                                // 40
  "with": "مع",                                                                                                        // 41
  info: {                                                                                                              // 42
    emailSent: "تم ارسال البريد الالكترونى",                                                                           // 43
    emailVerified: "تم تأكيد البريد الالكترونى",                                                                       // 44
    passwordChanged: "تم تغيير كلمة السر",                                                                             // 45
    passwordReset: "تم اعادة تعيين كلمة السر"                                                                          // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "البريد الالكترونى مطلوب",                                                                          // 49
    minChar: "سبعة حروف هو الحد الادنى لكلمة السر",                                                                    // 50
    pwdsDontMatch: "كلمتين السر لا يتطابقان",                                                                          // 51
    pwOneDigit: "كلمة السر يجب ان تحتوى على رقم واحد على الاقل",                                                       // 52
    pwOneLetter: "كلمة السر تحتاج الى حرف اخر",                                                                        // 53
    signInRequired: "عليك بتسجبل الدخول لفعل ذلك",                                                                     // 54
    signupCodeIncorrect: "رمز التسجيل غير صحيح",                                                                       // 55
    signupCodeRequired: "رمز التسجيل مطلوب",                                                                           // 56
    usernameIsEmail: "اسم المستخدم لا يمكن ان يكون بريد الكترونى",                                                     // 57
    usernameRequired: "اسم المستخدم مطلوب",                                                                            // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "البريد الالكترونى مسجل",                                                               // 60
      "Email doesn't match the criteria.": "البريد الالكترونى لا يتوافق مع الشروط",                                    // 61
      "Invalid login token": "رمز الدخول غير صالح",                                                                    // 62
      "Login forbidden": "تسجيل الدخول غير مسموح",                                                                     // 63
      "Service unknown": "خدمة غير معروفة",                                                                            // 64
      "Unrecognized options for login request": "اختيارات غير معلومة عند تسجيل الدخول",                                // 65
      "User validation failed": "تأكيد المستخدم فشل",                                                                  // 66
      "Username already exists.": "اسم المستخدم مسجل",                                                                 // 67
      "You are not logged in.": "لم تسجل دخولك",                                                                       // 68
      "You've been logged out by the server. Please log in again.": "لقد تم تسجيل خروجك من قبل الخادم. قم بتسجيل الدخول مجددا.",
      "Your session has expired. Please log in again.": "لقد انتهت جلستك. قم بتسجيل الدخول مجددا.",                    // 70
      "No matching login attempt found": "لم نجد محاولة دخول مطابقة",                                                  // 71
      "Password is old. Please reset your password.": "كلمة السر قديمة. قم باعادة تعيين كلمة السر.",                   // 72
      "Incorrect password": "كلمة السر غير صحيحة.",                                                                    // 73
      "Invalid email": "البريد الالكترونى غير صالح",                                                                   // 74
      "Must be logged in": "يجب ان تسجل دخولك",                                                                        // 75
      "Need to set a username or email": "يجب تعيين اسم مستخدم او بريد الكترونى",                                      // 76
      "old password format": "صيغة كلمة السر القديمة",                                                                 // 77
      "Password may not be empty": "كلمة السر لا يمكن ان تترك فارغة",                                                  // 78
      "Signups forbidden": "فتح الحسابات غير مسموح",                                                                   // 79
      "Token expired": "انتهى زمن الرمز",                                                                              // 80
      "Token has invalid email address": "الرمز يحتوى على بريد الكترونى غير صالح",                                     // 81
      "User has no password set": "المستخدم لم يقم بتعيين كلمة سر",                                                    // 82
      "User not found": "اسم المستخدم غير موجود",                                                                      // 83
      "Verify email link expired": "انتهى زمن رابط تأكيد البريد الالكترونى",                                           // 84
      "Verify email link is for unknown address": "رابط تأكيد البريد الالكترونى ينتمى الى بريد الكترونى غير معروف",    // 85
      "Match failed": "المطابقة فشلت",                                                                                 // 86
      "Unknown error": "خطأ غير معروف"                                                                                 // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("ar", ar);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ca.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ca;                                                                                                                // 2
                                                                                                                       // 3
ca = {                                                                                                                 // 4
  t9Name: 'Català',                                                                                                    // 5
  add: "afegir",                                                                                                       // 6
  and: "i",                                                                                                            // 7
  back: "enrere",                                                                                                      // 8
  changePassword: "Canviar contrasenya",                                                                               // 9
  choosePassword: "Escollir contrasenya",                                                                              // 10
  clickAgree: "Al fer clic a Subscriure aproves la",                                                                   // 11
  configure: "Disposició",                                                                                             // 12
  createAccount: "Crear compte",                                                                                       // 13
  currentPassword: "Contrasenya actual",                                                                               // 14
  dontHaveAnAccount: "No tens compte?",                                                                                // 15
  email: "Correu",                                                                                                     // 16
  emailAddress: "Adreça de correu",                                                                                    // 17
  emailResetLink: "Restablir correu",                                                                                  // 18
  forgotPassword: "Has oblidat la contrasenya?",                                                                       // 19
  ifYouAlreadyHaveAnAccount: "Si ja tens un compte",                                                                   // 20
  newPassword: "Nova contrasenya",                                                                                     // 21
  newPasswordAgain: "Nova contrasenya (repetir)",                                                                      // 22
  optional: "Opcional",                                                                                                // 23
  OR: "O",                                                                                                             // 24
  password: "Contrasenya",                                                                                             // 25
  passwordAgain: "Contrasenya (repetir)",                                                                              // 26
  privacyPolicy: "Política de Privacitat",                                                                             // 27
  remove: "eliminar",                                                                                                  // 28
  resetYourPassword: "Restablir la teva contrasenya",                                                                  // 29
  setPassword: "Definir contrasenya",                                                                                  // 30
  sign: "Entra",                                                                                                       // 31
  signIn: "Entra",                                                                                                     // 32
  signin: "entra",                                                                                                     // 33
  signOut: "Surt",                                                                                                     // 34
  signUp: "Subscriure's",                                                                                              // 35
  signupCode: "Còdi de subscripció",                                                                                   // 36
  signUpWithYourEmailAddress: "Subscriure-te amb el correu",                                                           // 37
  terms: "Termes d'ús",                                                                                                // 38
  updateYourPassword: "Actualitzar la teva contrasenya",                                                               // 39
  username: "Usuari",                                                                                                  // 40
  usernameOrEmail: "Usuari o correu",                                                                                  // 41
  "with": "amb",                                                                                                       // 42
  maxAllowedLength: "Longitud màxima permesa",                                                                         // 43
  minRequiredLength: "Longitud mínima requerida",                                                                      // 44
  resendVerificationEmail: "Envia el correu de nou",                                                                   // 45
  resendVerificationEmailLink_pre: "Correu de verificació perdut?",                                                    // 46
  resendVerificationEmailLink_link: "Envia de nou",                                                                    // 47
  info: {                                                                                                              // 48
    emailSent: "Correu enviat",                                                                                        // 49
    emailVerified: "Correu verificat",                                                                                 // 50
    passwordChanged: "Contrasenya canviada",                                                                           // 51
    passwordReset: "Restablir contrasenya"                                                                             // 52
  },                                                                                                                   // 53
  error: {                                                                                                             // 54
    emailRequired: "Es requereix el correu.",                                                                          // 55
    minChar: "7 caràcters mínim.",                                                                                     // 56
    pwdsDontMatch: "Les contrasenyes no coincideixen",                                                                 // 57
    pwOneDigit: "mínim un dígit.",                                                                                     // 58
    pwOneLetter: "mínim una lletra.",                                                                                  // 59
    signInRequired: "Has d'iniciar sessió per a fer això.",                                                            // 60
    signupCodeIncorrect: "El còdi de subscripció no coincideix.",                                                      // 61
    signupCodeRequired: "Es requereix el còdi de subscripció.",                                                        // 62
    usernameIsEmail: "L'usuari no pot ser el correu.",                                                                 // 63
    usernameRequired: "Es requereix un usuari.",                                                                       // 64
    accounts: {                                                                                                        // 65
      "Email already exists.": "El correu ja existeix.",                                                               // 66
      "Email doesn't match the criteria.": "El correu no coincideix amb els criteris.",                                // 67
      "Invalid login token": "Token d'entrada invàlid",                                                                // 68
      "Login forbidden": "No es permet entrar en aquests moments",                                                     // 69
      "Service unknown": "Servei desconegut",                                                                          // 70
      "Unrecognized options for login request": "Opcions desconegudes per la petició d'entrada",                       // 71
      "User validation failed": "No s'ha pogut validar l'usuari",                                                      // 72
      "Username already exists.": "L'usuari ja existeix.",                                                             // 73
      "You are not logged in.": "No has iniciat sessió",                                                               // 74
      "You've been logged out by the server. Please log in again.": "Has estat desconnectat pel servidor. Si us plau, entra de nou.",
      "Your session has expired. Please log in again.": "La teva sessió ha expirat. Si us plau, entra de nou.",        // 76
      "Already verified": "Ja està verificat",                                                                         // 77
      "No matching login attempt found": "No s'ha trobat un intent de login vàlid",                                    // 78
      "Password is old. Please reset your password.": "La contrasenya és antiga, si us plau, restableix una contrasenya nova",
      "Incorrect password": "Contrasenya invàlida",                                                                    // 80
      "Invalid email": "Correu invàlid",                                                                               // 81
      "Must be logged in": "Has d'iniciar sessió",                                                                     // 82
      "Need to set a username or email": "Has d'especificar un usuari o un correu",                                    // 83
      "old password format": "Format de contrasenya antic",                                                            // 84
      "Password may not be empty": "La contrasenya no pot ser buida",                                                  // 85
      "Signups forbidden": "Subscripció no permesa en aquest moment",                                                  // 86
      "Token expired": "Token expirat",                                                                                // 87
      "Token has invalid email address": "El token conté un correu invàlid",                                           // 88
      "User has no password set": "Usuari no té contrasenya",                                                          // 89
      "User not found": "Usuari no trobat",                                                                            // 90
      "Verify email link expired": "L'enllaç per a verificar el correu ha expirat",                                    // 91
      "Verify email link is for unknown address": "L'enllaç per a verificar el correu conté una adreça desconeguda",   // 92
      "At least 1 digit, 1 lowercase and 1 uppercase": "Al menys 1 dígit, 1 lletra minúscula i 1 majúscula",           // 93
      "Please verify your email first. Check the email and follow the link!": "Si us plau, verifica el teu correu primer. Comprova el correu i segueix l'enllaç que conté!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nou correu ha estat enviat a la teva bústia. Si no reps el correu assegura't de comprovar la bústia de correu no desitjat.",
      "Match failed": "Comprovació fallida",                                                                           // 96
      "Unknown error": "Error desconegut"                                                                              // 97
    }                                                                                                                  // 98
  }                                                                                                                    // 99
};                                                                                                                     // 100
                                                                                                                       // 101
T9n.map("ca", ca);                                                                                                     // 102
                                                                                                                       // 103
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/cs.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var cs;                                                                                                                // 2
                                                                                                                       // 3
cs = {                                                                                                                 // 4
  add: "přidat",                                                                                                       // 5
  and: "a",                                                                                                            // 6
  back: "zpět",                                                                                                        // 7
  changePassword: "Změnte heslo",                                                                                      // 8
  choosePassword: "Zvolte heslo",                                                                                      // 9
  clickAgree: "Stiskem tlačítka Registrovat souhlasíte s",                                                             // 10
  configure: "Nastavit",                                                                                               // 11
  createAccount: "Vytvořit účet",                                                                                      // 12
  currentPassword: "Současné heslo",                                                                                   // 13
  dontHaveAnAccount: "Nemáte účet?",                                                                                   // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Emailová adresa",                                                                                     // 16
  emailResetLink: "Odkaz na reset emailu",                                                                             // 17
  forgotPassword: "Zapomenuté heslo?",                                                                                 // 18
  ifYouAlreadyHaveAnAccount: "Pokud již máte účet",                                                                    // 19
  newPassword: "Nové heslo",                                                                                           // 20
  newPasswordAgain: "Nové heslo (zopakovat)",                                                                          // 21
  optional: "Volitelný",                                                                                               // 22
  OR: "nebo",                                                                                                          // 23
  password: "Heslo",                                                                                                   // 24
  passwordAgain: "Heslo (zopakovat)",                                                                                  // 25
  privacyPolicy: "Nastavení soukromí",                                                                                 // 26
  remove: "odstranit",                                                                                                 // 27
  resetYourPassword: "Resetovat heslo",                                                                                // 28
  setPassword: "Nastavit heslo",                                                                                       // 29
  sign: "Přihlášení",                                                                                                  // 30
  signIn: "Přihlásit se",                                                                                              // 31
  signin: "přihlásit se",                                                                                              // 32
  signOut: "Odhlásit se",                                                                                              // 33
  signUp: "Registrovat",                                                                                               // 34
  signupCode: "Registrační kód",                                                                                       // 35
  signUpWithYourEmailAddress: "Registrovat se emailovou adresou",                                                      // 36
  terms: "Podmínky použití",                                                                                           // 37
  updateYourPassword: "Aktualizujte si své heslo",                                                                     // 38
  username: "Uživatelské jméno",                                                                                       // 39
  usernameOrEmail: "Uživatelské jméno nebo email",                                                                     // 40
  "with": "s",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "Email odeslán",                                                                                        // 43
    emailVerified: "Email ověřen",                                                                                     // 44
    passwordChanged: "Heslo změněno",                                                                                  // 45
    passwordReset: "Heslo resetováno"                                                                                  // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email je povinný.",                                                                                // 49
    minChar: "minimální délka hesla je 7 znaků.",                                                                      // 50
    pwdsDontMatch: "Hesla nesouhlasí",                                                                                 // 51
    pwOneDigit: "Heslo musí obsahovat alespoň jednu číslici.",                                                         // 52
    pwOneLetter: "Heslo musí obsahovat alespoň 1 slovo.",                                                              // 53
    signInRequired: "Musíte být příhlášeni.",                                                                          // 54
    signupCodeIncorrect: "Registrační kód je chybný.",                                                                 // 55
    signupCodeRequired: "Registrační kód je povinný.",                                                                 // 56
    usernameIsEmail: "Uživatelské jméno nemůže být emailová adresa.",                                                  // 57
    usernameRequired: "Uživatelské jméno je povinné."                                                                  // 58
  },                                                                                                                   // 59
  accounts: {                                                                                                          // 60
    "A login handler should return a result or undefined": "Přihlašovací rutina musí vracet výsledek nebo undefined",  // 61
    "Email already exists.": "Email již existuje.",                                                                    // 62
    "Email doesn't match the criteria.": "Email nesplňuje požadavky.",                                                 // 63
    "Invalid login token": "Neplatný přihlašovací token",                                                              // 64
    "Login forbidden": "Přihlášení je zakázáno",                                                                       // 65
    "Service unknown": "Neznámá služba",                                                                               // 66
    "Unrecognized options for login request": "Nerozpoznaná volba přihlašovacího požadavku",                           // 67
    "User validation failed": "Validace uživatele selhala",                                                            // 68
    "Username already exists.": "Uživatelské jméno již existuje.",                                                     // 69
    "You are not logged in.": "Nejste přihlášený.",                                                                    // 70
    "You've been logged out by the server. Please log in again.": "Byl jste odhlášen. Prosím přihlašte se znovu.",     // 71
    "Your session has expired. Please log in again.": "Vaše připojení vypršelo. Prosím přihlašte se znovu.",           // 72
    "No matching login attempt found": "Nenalezen odpovídající způsob přihlášení",                                     // 73
    "Password is old. Please reset your password.": "Heslo je staré. Prosíme nastavte si ho znovu.",                   // 74
    "Incorrect password": "Chybné heslo",                                                                              // 75
    "Invalid email": "Neplatný email",                                                                                 // 76
    "Must be logged in": "Uživatel musí být přihlášen",                                                                // 77
    "Need to set a username or email": "Je třeba zadat uživatelské jméno nebo email",                                  // 78
    "old password format": "starý formát hesla",                                                                       // 79
    "Password may not be empty": "Heslo nemůže být prázdné",                                                           // 80
    "Signups forbidden": "Registrace je zakázaná",                                                                     // 81
    "Token expired": "Token vypršel",                                                                                  // 82
    "Token has invalid email address": "Token má neplatnou emailovou adresu",                                          // 83
    "User has no password set": "Uživatel nemá nastavené heslo",                                                       // 84
    "User not found": "Uživatel nenalezen",                                                                            // 85
    "Verify email link expired": "Odkaz pro ověření emailu vypršel",                                                   // 86
    "Verify email link is for unknown address": "Odkaz pro ověření emailu má neznámou adresu",                         // 87
    "Match failed": "Nesouhlasí",                                                                                      // 88
    "Unknown error": "Neznámá chyba"                                                                                   // 89
  }                                                                                                                    // 90
};                                                                                                                     // 91
                                                                                                                       // 92
T9n.map("cs", cs);                                                                                                     // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/da.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var da;                                                                                                                // 2
                                                                                                                       // 3
da = {                                                                                                                 // 4
  add: "tilføj",                                                                                                       // 5
  and: "og",                                                                                                           // 6
  back: "tilbage",                                                                                                     // 7
  changePassword: "Skift kodeord",                                                                                     // 8
  choosePassword: "Vælg kodeord",                                                                                      // 9
  clickAgree: "Ved at klikke på tilmeld accepterer du vores",                                                          // 10
  configure: "Konfigurer",                                                                                             // 11
  createAccount: "Opret konto",                                                                                        // 12
  currentPassword: "Nuværende kodeord",                                                                                // 13
  dontHaveAnAccount: "Har du ikke en konto?",                                                                          // 14
  email: "E-mail",                                                                                                     // 15
  emailAddress: "E-mail adresse",                                                                                      // 16
  emailResetLink: "Nulstil E-mail Link",                                                                               // 17
  forgotPassword: "Glemt kodeord?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Hvis jeg allerede har en konto",                                                         // 19
  newPassword: "Nyt kodeord",                                                                                          // 20
  newPasswordAgain: "Nyt kodeord (igen)",                                                                              // 21
  optional: "Frivilligt",                                                                                              // 22
  OR: "eller",                                                                                                         // 23
  password: "Kodeord",                                                                                                 // 24
  passwordAgain: "Kodeord (igen)",                                                                                     // 25
  privacyPolicy: "Privatlivspolitik",                                                                                  // 26
  remove: "fjern",                                                                                                     // 27
  resetYourPassword: "Nulstil dit kodeord",                                                                            // 28
  setPassword: "Sæt kodeord",                                                                                          // 29
  sign: "Log",                                                                                                         // 30
  signIn: "Log ind",                                                                                                   // 31
  signin: "Log ind",                                                                                                   // 32
  signOut: "Log ud",                                                                                                   // 33
  signUp: "Tilmeld",                                                                                                   // 34
  signupCode: "Tilmeldingskode",                                                                                       // 35
  signUpWithYourEmailAddress: "Tilmeld med din e-mail adresse",                                                        // 36
  terms: "Betingelser for brug",                                                                                       // 37
  updateYourPassword: "Skift dit kodeord",                                                                             // 38
  username: "Brugernavn",                                                                                              // 39
  usernameOrEmail: "Brugernavn eller e-mail",                                                                          // 40
  "with": "med",                                                                                                       // 41
  info: {                                                                                                              // 42
    emailSent: "E-mail sendt",                                                                                         // 43
    emailVerified: "Email verificeret",                                                                                // 44
    passwordChanged: "Password ændret",                                                                                // 45
    passwordReset: "Password reset"                                                                                    // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "E-mail er påkrævet.",                                                                              // 49
    minChar: "Kodeordet skal være mindst 7 tegn.",                                                                     // 50
    pwdsDontMatch: "De to kodeord er ikke ens.",                                                                       // 51
    pwOneDigit: "Kodeord kræver mindste et tal.",                                                                      // 52
    pwOneLetter: "Kodeord kræver mindst et bogstav.",                                                                  // 53
    signInRequired: "Du skal være logget ind for at kunne gøre det.",                                                  // 54
    signupCodeIncorrect: "Tilmeldingskode er forkert.",                                                                // 55
    signupCodeRequired: "Tilmeldingskode er påkrævet.",                                                                // 56
    usernameIsEmail: "Brugernavn kan ikke være en e-mail adresse.",                                                    // 57
    usernameRequired: "Brugernavn skal udfyldes.",                                                                     // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "E-mail findes allerede.",                                                              // 60
      "Email doesn't match the criteria.": "E-mail modsvarer ikke kriteriet.",                                         // 61
      "Invalid login token": "Invalid log ind token",                                                                  // 62
      "Login forbidden": "Log ind forbudt",                                                                            // 63
      "Service unknown": "Service ukendt",                                                                             // 64
      "Unrecognized options for login request": "Ukendte options for login forsøg",                                    // 65
      "User validation failed": "Bruger validering fejlede",                                                           // 66
      "Username already exists.": "Brugernavn findes allerede.",                                                       // 67
      "You are not logged in.": "Du er ikke logget ind.",                                                              // 68
      "You've been logged out by the server. Please log in again.": "Du er blevet logget af serveren. Log ind igen.",  // 69
      "Your session has expired. Please log in again.": "Din session er udløbet. Log ind igen.",                       // 70
      "No matching login attempt found": "Der fandtes ingen login forsøg",                                             // 71
      "Password is old. Please reset your password.": "Kodeordet er for gammelt. Du skal resette det.",                // 72
      "Incorrect password": "Forkert kodeord",                                                                         // 73
      "Invalid email": "Invalid e-mail",                                                                               // 74
      "Must be logged in": "Du skal være logget ind",                                                                  // 75
      "Need to set a username or email": "Du skal angive enten brugernavn eller e-mail",                               // 76
      "old password format": "gammelt kodeord format",                                                                 // 77
      "Password may not be empty": "Kodeord skal være udfyldt",                                                        // 78
      "Signups forbidden": "Tilmeldinger forbudt",                                                                     // 79
      "Token expired": "Token udløbet",                                                                                // 80
      "Token has invalid email address": "Token har en invalid e-mail adresse",                                        // 81
      "User has no password set": "Bruger har ikke angivet noget kodeord",                                             // 82
      "User not found": "Bruger ej fundet",                                                                            // 83
      "Verify email link expired": "Verify email link expired",                                                        // 84
      "Verify email link is for unknown address": "Verificer e-mail link for ukendt adresse",                          // 85
      "Match failed": "Match fejlede",                                                                                 // 86
      "Unknown error": "Ukendt fejl"                                                                                   // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("da", da);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/de.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var de;                                                                                                                // 2
                                                                                                                       // 3
de = {                                                                                                                 // 4
  t9Name: 'Deutsch',                                                                                                   // 5
  add: "hinzufügen",                                                                                                   // 6
  and: "und",                                                                                                          // 7
  back: "zurück",                                                                                                      // 8
  changePassword: "Passwort ändern",                                                                                   // 9
  choosePassword: "Passwort auswählen",                                                                                // 10
  clickAgree: "Die Registrierung impliziert die Akzeptanz unserer",                                                    // 11
  configure: "Konfigurieren",                                                                                          // 12
  createAccount: "Konto erstellen",                                                                                    // 13
  currentPassword: "Aktuelles Passwort",                                                                               // 14
  dontHaveAnAccount: "Noch kein Konto?",                                                                               // 15
  email: "E-Mail",                                                                                                     // 16
  emailAddress: "E-Mail Adresse",                                                                                      // 17
  emailResetLink: "Senden",                                                                                            // 18
  forgotPassword: "Passwort vergessen?",                                                                               // 19
  ifYouAlreadyHaveAnAccount: "Falls bereits ein Konto existiert, bitte hier",                                          // 20
  newPassword: "Neues Passwort",                                                                                       // 21
  newPasswordAgain: "Neues Passwort (wiederholen)",                                                                    // 22
  optional: "Optional",                                                                                                // 23
  OR: "ODER",                                                                                                          // 24
  password: "Passwort",                                                                                                // 25
  passwordAgain: "Passwort (wiederholen)",                                                                             // 26
  privacyPolicy: "Datenschutzerklärung",                                                                               // 27
  remove: "entfernen",                                                                                                 // 28
  resetYourPassword: "Passwort zurücksetzen",                                                                          // 29
  setPassword: "Passwort festlegen",                                                                                   // 30
  sign: "Anmelden",                                                                                                    // 31
  signIn: "Anmelden",                                                                                                  // 32
  signin: "anmelden",                                                                                                  // 33
  signOut: "Abmelden",                                                                                                 // 34
  signUp: "Registrieren",                                                                                              // 35
  signupCode: "Registrierungscode",                                                                                    // 36
  signUpWithYourEmailAddress: "Mit E-Mail registrieren",                                                               // 37
  terms: "Geschäftsbedingungen",                                                                                       // 38
  updateYourPassword: "Passwort aktualisieren",                                                                        // 39
  username: "Benutzername",                                                                                            // 40
  usernameOrEmail: "Benutzername oder E-Mail",                                                                         // 41
  "with": "mit",                                                                                                       // 42
  "Verification email lost?": "Verifizierungsemail verloren?",                                                         // 43
  "Send again": "Erneut senden",                                                                                       // 44
  "Send the verification email again": "Verifizierungsemail erneut senden",                                            // 45
  "Send email again": "Email erneut senden",                                                                           // 46
  "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Eine neue Email wurde verschickt. Sollte sich die Email nicht im Posteingang befinden, empfiehlt es sich, den Spamordner zu überprüfen.",
  info: {                                                                                                              // 48
    emailSent: "E-Mail gesendet",                                                                                      // 49
    emailVerified: "E-Mail verifiziert",                                                                               // 50
    PasswordChanged: "Passwort geändert",                                                                              // 51
    PasswordReset: "Passwort zurückgesetzt"                                                                            // 52
  },                                                                                                                   // 53
  error: {                                                                                                             // 54
    emailRequired: "E-Mail benötigt.",                                                                                 // 55
    minChar: "Passwort muss mindestens 7 Zeichen lang sein.",                                                          // 56
    pwdsDontMatch: "Passwörter stimmen nicht überein.",                                                                // 57
    pwOneDigit: "Passwort muss mindestens eine Ziffer enthalten.",                                                     // 58
    pwOneLetter: "Passwort muss mindestens einen Buchstaben enthalten.",                                               // 59
    signInRequired: "Eine Anmeldung ist erforderlich.",                                                                // 60
    signupCodeIncorrect: "Registrierungscode ungültig.",                                                               // 61
    signupCodeRequired: "Registrierungscode benötigt.",                                                                // 62
    usernameIsEmail: "Benutzername darf keine E-Mail Adresse sein.",                                                   // 63
    usernameRequired: "Benutzername benötigt.",                                                                        // 64
    accounts: {                                                                                                        // 65
      "Email already exists.": "Die E-Mail Adresse wird bereits verwendet.",                                           // 66
      "Email doesn't match the criteria.": "E-Mail Adresse erfüllt die Anforderungen nicht.",                          // 67
      "Invalid login token": "Ungültiger Login-Token",                                                                 // 68
      "Login forbidden": "Anmeldedaten ungültig",                                                                      // 69
      "Service unknown": "Dienst unbekannt",                                                                           // 70
      "Unrecognized options for login request": "Unbekannte Optionen für Login Request",                               // 71
      "User validation failed": "Die Benutzerdaten sind nicht korrekt",                                                // 72
      "Username already exists.": "Der Benutzer existiert bereits.",                                                   // 73
      "You are not logged in.": "Eine Anmeldung ist erforderlich.",                                                    // 74
      "You've been logged out by the server. Please log in again.": "Die Sitzung ist abgelaufen, eine neue Anmeldung ist nötig.",
      "Your session has expired. Please log in again.": "Die Sitzung ist abgelaufen, eine neue Anmeldung ist nötig.",  // 76
      "No matching login attempt found": "Kein passender Loginversuch gefunden.",                                      // 77
      "Password is old. Please reset your password.": "Das Passwort ist abgelaufen, ein Zurücksetzen ist erforderlich.",
      "Incorrect password": "Falsches Passwort",                                                                       // 79
      "Invalid email": "Ungültige E-Mail Adresse",                                                                     // 80
      "Must be logged in": "Eine Anmeldung ist erforderlich",                                                          // 81
      "Need to set a username or email": "Benutzername oder E-Mail Adresse müssen angegeben werden",                   // 82
      "Password may not be empty": "Das Passwort darf nicht leer sein",                                                // 83
      "Signups forbidden": "Anmeldungen sind nicht erlaubt",                                                           // 84
      "Token expired": "Token ist abgelaufen",                                                                         // 85
      "Token has invalid email address": "E-Mail Adresse passt nicht zum Token",                                       // 86
      "User has no password set": "Kein Passwort für den Benutzer angegeben",                                          // 87
      "User not found": "Benutzer nicht gefunden",                                                                     // 88
      "Verify email link expired": "Link zur E-Mail Verifizierung ist abgelaufen",                                     // 89
      "Verify email link is for unknown address": "Link zur Verifizierung ist für eine unbekannte E-Mail Adresse",     // 90
      "Already verified": "Diese E-Mail-Adresse ist bereits verifiziert",                                              // 91
      "Match failed": "Abgleich fehlgeschlagen",                                                                       // 92
      "Unknown error": "Unbekannter Fehler"                                                                            // 93
    }                                                                                                                  // 94
  }                                                                                                                    // 95
};                                                                                                                     // 96
                                                                                                                       // 97
T9n.map("de", de);                                                                                                     // 98
                                                                                                                       // 99
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/el.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var el;                                                                                                                // 2
                                                                                                                       // 3
el = {                                                                                                                 // 4
  add: "προσθέστε",                                                                                                    // 5
  and: "και",                                                                                                          // 6
  back: "πίσω",                                                                                                        // 7
  changePassword: "Αλλαγή Κωδικού",                                                                                    // 8
  choosePassword: "Επιλογή Κωδικού",                                                                                   // 9
  clickAgree: "Πατώντας Εγγραφή, συμφωνείτε σε",                                                                       // 10
  configure: "Διαμόρφωση",                                                                                             // 11
  createAccount: "Δημιουργία Λογαριασμού",                                                                             // 12
  currentPassword: "Τρέχων Κωδικός",                                                                                   // 13
  dontHaveAnAccount: "Δεν έχετε λογαριασμό;",                                                                          // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Ηλεκτρονική Διεύθυνση",                                                                               // 16
  emailResetLink: "Αποστολή Συνδέσμου Επαναφοράς",                                                                     // 17
  forgotPassword: "Ξεχάσατε τον κωδικό;",                                                                              // 18
  ifYouAlreadyHaveAnAccount: "Αν έχετε ήδη λογαριασμό",                                                                // 19
  newPassword: "Νέος Κωδικός",                                                                                         // 20
  newPasswordAgain: "Νέος Κωδικός (ξανά)",                                                                             // 21
  optional: "Προαιρετικά",                                                                                             // 22
  OR: "Ή",                                                                                                             // 23
  password: "Κωδικός",                                                                                                 // 24
  passwordAgain: "Κωδικός (ξανά)",                                                                                     // 25
  privacyPolicy: "Πολιτική Απορρήτου",                                                                                 // 26
  remove: "αφαιρέστε",                                                                                                 // 27
  resetYourPassword: "Επαναφορά κωδικού",                                                                              // 28
  setPassword: "Ορίστε Κωδικό",                                                                                        // 29
  sign: "Σύνδεση",                                                                                                     // 30
  signIn: "Είσοδος",                                                                                                   // 31
  signin: "συνδεθείτε",                                                                                                // 32
  signOut: "Αποσύνδεση",                                                                                               // 33
  signUp: "Εγγραφή",                                                                                                   // 34
  signupCode: "Κώδικας Εγγραφής",                                                                                      // 35
  signUpWithYourEmailAddress: "Εγγραφή με την ηλεκτρονική σας διεύθυνση",                                              // 36
  terms: "Όροι Χρήσης",                                                                                                // 37
  updateYourPassword: "Ανανεώστε τον κωδικό σας",                                                                      // 38
  username: "Όνομα χρήστη",                                                                                            // 39
  usernameOrEmail: "Όνομα χρήστη ή email",                                                                             // 40
  "with": "με",                                                                                                        // 41
  info: {                                                                                                              // 42
    emailSent: "Το Email στάλθηκε",                                                                                    // 43
    emailVerified: "Το Email επιβεβαιώθηκε",                                                                           // 44
    passwordChanged: "Ο Κωδικός άλλαξε",                                                                               // 45
    passwordReset: "Ο Κωδικός επαναφέρθηκε"                                                                            // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Το Email απαιτείται.",                                                                             // 49
    minChar: "7 χαρακτήρες τουλάχιστον.",                                                                              // 50
    pwdsDontMatch: "Οι κωδικοί δεν ταιριάζουν",                                                                        // 51
    pwOneDigit: "Ο κωδικός πρέπει να έχει τουλάχιστον ένα ψηφίο.",                                                     // 52
    pwOneLetter: "Ο κωδικός πρέπει να έχει τουλάχιστον ένα γράμμα.",                                                   // 53
    signInRequired: "Πρέπει να είστε συνδεδεμένος για να πραγματοποιήσετε αυτή την ενέργεια.",                         // 54
    signupCodeIncorrect: "Ο κώδικας εγγραφής δεν είναι σωστός.",                                                       // 55
    signupCodeRequired: "Ο κώδικας εγγραφής απαιτείται.",                                                              // 56
    usernameIsEmail: "Το όνομα χρήστη δεν μπορεί να είναι μια διεύθυνση email.",                                       // 57
    usernameRequired: "Το όνομα χρήστη απαιτείται.",                                                                   // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Αυτό το email υπάρχει ήδη.",                                                           // 60
      "Email doesn't match the criteria.": "Το email δεν ταιριάζει με τα κριτήρια.",                                   // 61
      "Invalid login token": "Άκυρο διακριτικό σύνδεσης",                                                              // 62
      "Login forbidden": "Η είσοδος απαγορεύεται",                                                                     // 63
      "Service unknown": "Άγνωστη υπηρεσία",                                                                           // 64
      "Unrecognized options for login request": "Μη αναγνωρίσιμες επιλογές για αίτημα εισόδου",                        // 65
      "User validation failed": "Η επικύρωση του χρήστη απέτυχε",                                                      // 66
      "Username already exists.": "Αυτό το όνομα χρήστη υπάρχει ήδη.",                                                 // 67
      "You are not logged in.": "Δεν είστε συνδεδεμένος.",                                                             // 68
      "You've been logged out by the server. Please log in again.": "Αποσυνδεθήκατε από τον διακομιστή. Παρακαλούμε συνδεθείτε ξανά.",
      "Your session has expired. Please log in again.": "Η συνεδρία έληξε. Παρακαλούμε συνδεθείτε ξανά.",              // 70
      "No matching login attempt found": "Δεν βρέθηκε καμία απόπειρα σύνδεσης που να ταιριάζει",                       // 71
      "Password is old. Please reset your password.": "Ο κωδικός είναι παλιός. Παρακαλούμε επαναφέρετε τον κωδικό σας.",
      "Incorrect password": "Εσφαλμένος κωδικός",                                                                      // 73
      "Invalid email": "Εσφαλμένο email",                                                                              // 74
      "Must be logged in": "Πρέπει να είστε συνδεδεμένος",                                                             // 75
      "Need to set a username or email": "Χρειάζεται να ορίσετε όνομα χρήστη ή email",                                 // 76
      "old password format": "κωδικός παλιάς μορφής",                                                                  // 77
      "Password may not be empty": "Ο κωδικός δεν μπορεί να είναι άδειος",                                             // 78
      "Signups forbidden": "Οι εγγραφές απαγορεύονται",                                                                // 79
      "Token expired": "Το διακριτικό σύνδεσης έληξε",                                                                 // 80
      "Token has invalid email address": "Το διακριτικό σύνδεσης έχει άκυρη διεύθυνση email",                          // 81
      "User has no password set": "Ο χρήστης δεν έχει ορίσει κωδικό",                                                  // 82
      "User not found": "Ο χρήστης δεν βρέθηκε",                                                                       // 83
      "Verify email link expired": "Ο σύνδεσμος επαλήθευσης του email έληξε",                                          // 84
      "Verify email link is for unknown address": "Ο σύνδεσμος επαλήθευσης του email είναι για άγνωστη διεύθυνση",     // 85
      "Match failed": "Η αντιστοίχηση απέτυχε",                                                                        // 86
      "Unknown error": "Άγνωστο σφάλμα"                                                                                // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("el", el);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/en.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var en;                                                                                                                // 2
                                                                                                                       // 3
en = {                                                                                                                 // 4
  t9Name: 'English',                                                                                                   // 5
  add: "add",                                                                                                          // 6
  and: "and",                                                                                                          // 7
  back: "back",                                                                                                        // 8
  cancel: "Cancel",                                                                                                    // 9
  changePassword: "Change Password",                                                                                   // 10
  choosePassword: "Choose a Password",                                                                                 // 11
  clickAgree: "By clicking Register, you agree to our",                                                                // 12
  configure: "Configure",                                                                                              // 13
  createAccount: "Create an Account",                                                                                  // 14
  currentPassword: "Current Password",                                                                                 // 15
  dontHaveAnAccount: "Don't have an account?",                                                                         // 16
  email: "Email",                                                                                                      // 17
  emailAddress: "Email Address",                                                                                       // 18
  emailResetLink: "Email Reset Link",                                                                                  // 19
  forgotPassword: "Forgot your password?",                                                                             // 20
  ifYouAlreadyHaveAnAccount: "If you already have an account",                                                         // 21
  newPassword: "New Password",                                                                                         // 22
  newPasswordAgain: "New Password (again)",                                                                            // 23
  optional: "Optional",                                                                                                // 24
  OR: "OR",                                                                                                            // 25
  password: "Password",                                                                                                // 26
  passwordAgain: "Password (again)",                                                                                   // 27
  privacyPolicy: "Privacy Policy",                                                                                     // 28
  remove: "remove",                                                                                                    // 29
  resetYourPassword: "Reset your password",                                                                            // 30
  setPassword: "Set Password",                                                                                         // 31
  sign: "Sign",                                                                                                        // 32
  signIn: "Sign In",                                                                                                   // 33
  signin: "sign in",                                                                                                   // 34
  signOut: "Sign Out",                                                                                                 // 35
  signUp: "Register",                                                                                                  // 36
  signupCode: "Registration Code",                                                                                     // 37
  signUpWithYourEmailAddress: "Register with your email address",                                                      // 38
  terms: "Terms of Use",                                                                                               // 39
  updateYourPassword: "Update your password",                                                                          // 40
  username: "Username",                                                                                                // 41
  usernameOrEmail: "Username or email",                                                                                // 42
  "with": "with",                                                                                                      // 43
  maxAllowedLength: "Maximum allowed length",                                                                          // 44
  minRequiredLength: "Minimum required length",                                                                        // 45
  resendVerificationEmail: "Send email again",                                                                         // 46
  resendVerificationEmailLink_pre: "Verification email lost?",                                                         // 47
  resendVerificationEmailLink_link: "Send again",                                                                      // 48
  enterPassword: "Enter password",                                                                                     // 49
  enterNewPassword: "Enter new password",                                                                              // 50
  enterEmail: "Enter email",                                                                                           // 51
  enterUsername: "Enter username",                                                                                     // 52
  enterUsernameOrEmail: "Enter username or email",                                                                     // 53
  orUse: "Or use",                                                                                                     // 54
  info: {                                                                                                              // 55
    emailSent: "Email sent",                                                                                           // 56
    emailVerified: "Email verified",                                                                                   // 57
    passwordChanged: "Password changed",                                                                               // 58
    passwordReset: "Password reset"                                                                                    // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Notice',                                                                                                  // 64
      error: 'Error',                                                                                                  // 65
      warning: 'Warning'                                                                                               // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "Email is required.",                                                                               // 70
    minChar: "7 character minimum password.",                                                                          // 71
    pwdsDontMatch: "Passwords don't match",                                                                            // 72
    pwOneDigit: "Password must have at least one digit.",                                                              // 73
    pwOneLetter: "Password requires 1 letter.",                                                                        // 74
    signInRequired: "You must be signed in to do that.",                                                               // 75
    signupCodeIncorrect: "Registration code is incorrect.",                                                            // 76
    signupCodeRequired: "Registration code is required.",                                                              // 77
    usernameIsEmail: "Username cannot be an email address.",                                                           // 78
    usernameRequired: "Username is required.",                                                                         // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "Email already exists.",                                                                // 81
      "Email doesn't match the criteria.": "Email doesn't match the criteria.",                                        // 82
      "Invalid login token": "Invalid login token",                                                                    // 83
      "Login forbidden": "Login forbidden",                                                                            // 84
      "Service unknown": "Service unknown",                                                                            // 85
      "Unrecognized options for login request": "Unrecognized options for login request",                              // 86
      "User validation failed": "User validation failed",                                                              // 87
      "Username already exists.": "Username already exists.",                                                          // 88
      "You are not logged in.": "You are not logged in.",                                                              // 89
      "You've been logged out by the server. Please log in again.": "You've been logged out by the server. Please log in again.",
      "Your session has expired. Please log in again.": "Your session has expired. Please log in again.",              // 91
      "Already verified": "Already verified",                                                                          // 92
      "Invalid email or username": "Invalid email or username",                                                        // 93
      "Internal server error": "Internal server error",                                                                // 94
      "undefined": "Something went wrong",                                                                             // 95
      "No matching login attempt found": "No matching login attempt found",                                            // 96
      "Password is old. Please reset your password.": "Password is old. Please reset your password.",                  // 97
      "Incorrect password": "Incorrect password",                                                                      // 98
      "Invalid email": "Invalid email",                                                                                // 99
      "Must be logged in": "Must be logged in",                                                                        // 100
      "Need to set a username or email": "Need to set a username or email",                                            // 101
      "old password format": "old password format",                                                                    // 102
      "Password may not be empty": "Password may not be empty",                                                        // 103
      "Signups forbidden": "Signups forbidden",                                                                        // 104
      "Token expired": "Token expired",                                                                                // 105
      "Token has invalid email address": "Token has invalid email address",                                            // 106
      "User has no password set": "User has no password set",                                                          // 107
      "User not found": "User not found",                                                                              // 108
      "Verify email link expired": "Verify email link expired",                                                        // 109
      "Verify email link is for unknown address": "Verify email link is for unknown address",                          // 110
      "At least 1 digit, 1 lowercase and 1 uppercase": "At least 1 digit, 1 lowercase and 1 uppercase",                // 111
      "Please verify your email first. Check the email and follow the link!": "Please verify your email first. Check the email and follow the link!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.",
      "Match failed": "Match failed",                                                                                  // 114
      "Unknown error": "Unknown error",                                                                                // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Error, too many requests. Please slow down. You must wait 1 seconds before trying again."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("en", en);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/es.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var es;                                                                                                                // 2
                                                                                                                       // 3
es = {                                                                                                                 // 4
  t9Name: 'Español',                                                                                                   // 5
  add: "agregar",                                                                                                      // 6
  and: "y",                                                                                                            // 7
  back: "regresar",                                                                                                    // 8
  cancel: "Cancelar",                                                                                                  // 9
  changePassword: "Cambiar contraseña",                                                                                // 10
  choosePassword: "Eligir contraseña",                                                                                 // 11
  clickAgree: "Al hacer clic en Suscribir apruebas la",                                                                // 12
  configure: "Configurar",                                                                                             // 13
  createAccount: "Crear cuenta",                                                                                       // 14
  currentPassword: "Contraseña actual",                                                                                // 15
  dontHaveAnAccount: "¿No tienes una cuenta?",                                                                         // 16
  email: "Correo electrónico",                                                                                         // 17
  emailAddress: "Dirección de correo electrónico",                                                                     // 18
  emailResetLink: "Resetear correo electrónico",                                                                       // 19
  forgotPassword: "¿Olvidó su contraseña?",                                                                            // 20
  ifYouAlreadyHaveAnAccount: "Si ya tienes una cuenta",                                                                // 21
  newPassword: "Nueva contraseña",                                                                                     // 22
  newPasswordAgain: "Nueva contraseña (repetir)",                                                                      // 23
  optional: "Opcional",                                                                                                // 24
  OR: "O",                                                                                                             // 25
  password: "Contraseña",                                                                                              // 26
  passwordAgain: "Contraseña (repetir)",                                                                               // 27
  privacyPolicy: "Póliza de Privacidad",                                                                               // 28
  remove: "remover",                                                                                                   // 29
  resetYourPassword: "Resetear contraseña",                                                                            // 30
  setPassword: "Eligir contraseña",                                                                                    // 31
  sign: "Ingresar",                                                                                                    // 32
  signIn: "Entrar",                                                                                                    // 33
  signin: "entrar",                                                                                                    // 34
  signOut: "Salir",                                                                                                    // 35
  signUp: "Registrarse",                                                                                               // 36
  signupCode: "Código de registro",                                                                                    // 37
  signUpWithYourEmailAddress: "Registrate con tu dirección de correo electrónico",                                     // 38
  terms: "Términos de uso",                                                                                            // 39
  updateYourPassword: "Actualizar contraseña",                                                                         // 40
  username: "Usuario",                                                                                                 // 41
  usernameOrEmail: "Usuario o correo electrónico",                                                                     // 42
  "with": "con",                                                                                                       // 43
  maxAllowedLength: "Longitud máxima permitida",                                                                       // 44
  minRequiredLength: "Longitud máxima requerida",                                                                      // 45
  resendVerificationEmail: "Mandar correo electrónico de nuevo",                                                       // 46
  resendVerificationEmailLink_pre: "¿Perdiste tu correo de verificación?",                                             // 47
  resendVerificationEmailLink_link: "Volver a mandar",                                                                 // 48
  enterPassword: "Introducir contraseña",                                                                              // 49
  enterNewPassword: "Introducir contraseña nueva",                                                                     // 50
  enterEmail: "Introducir dirección de correo electrónico",                                                            // 51
  enterUsername: "Introducir nombre de usuario",                                                                       // 52
  enterUsernameOrEmail: "Introducir nombre de usuario o dirección de correos",                                         // 53
  orUse: "O usar",                                                                                                     // 54
  info: {                                                                                                              // 55
    emailSent: "Correo enviado",                                                                                       // 56
    emailVerified: "Dirección de correos verificada",                                                                  // 57
    passwordChanged: "Contraseña cambiada",                                                                            // 58
    passwordReset: "Resetear contraseña"                                                                               // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Aviso',                                                                                                   // 64
      error: 'Error',                                                                                                  // 65
      warning: 'Advertencia'                                                                                           // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "Tu dirección de correos es requerida.",                                                            // 70
    minChar: "7 caracteres mínimo.",                                                                                   // 71
    pwdsDontMatch: "Las contraseñas no coinciden",                                                                     // 72
    pwOneDigit: "mínimo un dígito.",                                                                                   // 73
    pwOneLetter: "mínimo una letra.",                                                                                  // 74
    signInRequired: "Debes iniciar sesión para hacer eso.",                                                            // 75
    signupCodeIncorrect: "El código de registro no coincide.",                                                         // 76
    signupCodeRequired: "Se requiere el código de registro.",                                                          // 77
    usernameIsEmail: "El nombre de usuario no puede ser una dirección de correos.",                                    // 78
    usernameRequired: "Se requiere un nombre de usuario.",                                                             // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "La dirección de correo elecrónico ya existe.",                                         // 81
      "Email doesn't match the criteria.": "La dirección de correo electrónico no coincide con los criterios.",        // 82
      "Invalid login token": "Token de inicio de sesión inválido",                                                     // 83
      "Login forbidden": "Inicio de sesión prohibido",                                                                 // 84
      "Service unknown": "Servicio desconocido",                                                                       // 85
      "Unrecognized options for login request": "Opciones desconocidas para solicitud de inicio de sesión",            // 86
      "User validation failed": "No se ha podido validar el usuario",                                                  // 87
      "Username already exists.": "El usuario ya existe.",                                                             // 88
      "You are not logged in.": "No estás autenticado.",                                                               // 89
      "You've been logged out by the server. Please log in again.": "Has sido desconectado por el servidor. Por favor ingresa de nuevo.",
      "Your session has expired. Please log in again.": "Tu sesión ha expirado. Por favor ingresa de nuevo.",          // 91
      "Already verified": "Ya ha sido verificada",                                                                     // 92
      "Invalid email or username": "Dirección de correo o nombre de usuario no validos",                               // 93
      "Internal server error": "Error interno del servidor",                                                           // 94
      "undefined": "Algo ha ido mal",                                                                                  // 95
      "No matching login attempt found": "No se encontró ningún intento de inicio de sesión coincidente",              // 96
      "Password is old. Please reset your password.": "Contraseña es vieja. Por favor resetea tu contraseña.",         // 97
      "Incorrect password": "Contraseña incorrecta.",                                                                  // 98
      "Invalid email": "Correo electrónico inválido",                                                                  // 99
      "Must be logged in": "Debes estar conectado",                                                                    // 100
      "Need to set a username or email": "Debes especificar un usuario o dirección de correo electrónico",             // 101
      "old password format": "formato viejo de contraseña",                                                            // 102
      "Password may not be empty": "Contraseña no debe quedar vacía",                                                  // 103
      "Signups forbidden": "Registro prohibido",                                                                       // 104
      "Token expired": "Token expirado",                                                                               // 105
      "Token has invalid email address": "Token contiene un correo electrónico inválido",                              // 106
      "User has no password set": "Usuario no tiene contraseña",                                                       // 107
      "User not found": "Usuario no encontrado",                                                                       // 108
      "Verify email link expired": "El enlace para verificar la dirección de correo ha expirado",                      // 109
      "Verify email link is for unknown address": "El enlace para verificar el correo electrónico contiene una dirección desconocida",
      "At least 1 digit, 1 lowercase and 1 uppercase": "Al menos debe contener un número, una minúscula y una mayúscula",
      "Please verify your email first. Check the email and follow the link!": "Por favor comprueba tu dirección de correo primero. Sigue el link que te ha sido enviado.",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nuevo correo te ha sido enviado. Si no ves el correo en tu bandeja comprueba tu carpeta de spam.",
      "Match failed": "No se encontró pareja coincidente",                                                             // 114
      "Unknown error": "Error desconocido",                                                                            // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Error, demasiadas peticiones. Por favor ve más lento. Debes esperar al menos un segundo antes de probar otra vez."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("es", es);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/et.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var et;                                                                                                                // 2
                                                                                                                       // 3
et = {                                                                                                                 // 4
  t9Name: 'Estonian',                                                                                                  // 5
  add: "lisa",                                                                                                         // 6
  and: "ja",                                                                                                           // 7
  back: "tagasi",                                                                                                      // 8
  cancel: "Katkesta",                                                                                                  // 9
  changePassword: "Muuda salasõna",                                                                                    // 10
  choosePassword: "Vali salasõna",                                                                                     // 11
  clickAgree: "Vajutades nupule Registreeru, nõustud meie",                                                            // 12
  configure: "Seadista",                                                                                               // 13
  createAccount: "Loo konto",                                                                                          // 14
  currentPassword: "Praegune salasõna",                                                                                // 15
  dontHaveAnAccount: "Sul ei ole kontot?",                                                                             // 16
  email: "E-post",                                                                                                     // 17
  emailAddress: "E-posti aadress",                                                                                     // 18
  emailResetLink: "Saada lähestamise link",                                                                            // 19
  forgotPassword: "Unustasid salasõna?",                                                                               // 20
  ifYouAlreadyHaveAnAccount: "Kui Sul juba on konto",                                                                  // 21
  newPassword: "Uus salasõna",                                                                                         // 22
  newPasswordAgain: "Uus salasõna (uuesti)",                                                                           // 23
  optional: "Valikuline",                                                                                              // 24
  OR: "või",                                                                                                           // 25
  password: "salasõna",                                                                                                // 26
  passwordAgain: "Salasõna (uuesti)",                                                                                  // 27
  privacyPolicy: "Privaatsuspoliitika",                                                                                // 28
  remove: "eemalda",                                                                                                   // 29
  resetYourPassword: "Lähesta oma salasõna",                                                                           // 30
  setPassword: "Seadista salasõna",                                                                                    // 31
  sign: "Logi",                                                                                                        // 32
  signIn: "Logi sisse ",                                                                                               // 33
  signin: "logi sisse",                                                                                                // 34
  signOut: "Logi välja",                                                                                               // 35
  signUp: "Registreeru",                                                                                               // 36
  signupCode: "Registreerumiskood",                                                                                    // 37
  signUpWithYourEmailAddress: "Registreeru oma e-posti aadressiga",                                                    // 38
  terms: "Kasutustingimused",                                                                                          // 39
  updateYourPassword: "Uuenda oma salasõna",                                                                           // 40
  username: "Kasutajanimi",                                                                                            // 41
  usernameOrEmail: "Kasutaja või e-post",                                                                              // 42
  "with": "koos",                                                                                                      // 43
  maxAllowedLength: "Suurim lubatud pikkus",                                                                           // 44
  minRequiredLength: "Väikseim lubatud pikkus",                                                                        // 45
  resendVerificationEmail: "Saada e-kiri uuesti",                                                                      // 46
  resendVerificationEmailLink_pre: "Kinnitus e-kiri on kadunud?",                                                      // 47
  resendVerificationEmailLink_link: "Saada uuesti",                                                                    // 48
  enterPassword: "Sisesta salasõna",                                                                                   // 49
  enterNewPassword: "Sisesta uus salasõna",                                                                            // 50
  enterEmail: "Sisesta e-posti aadress",                                                                               // 51
  enterUsername: "Sisesta kasutajanimi",                                                                               // 52
  enterUsernameOrEmail: "Sisesta kasutajanimi või e-posti aadress",                                                    // 53
  orUse: "Või kasuta",                                                                                                 // 54
  info: {                                                                                                              // 55
    emailSent: "E-kiri saadetud",                                                                                      // 56
    emailVerified: "E-posti aadress kinnitatud",                                                                       // 57
    passwordChanged: "Salasõna muudetud",                                                                              // 58
    passwordReset: "Salasõna lähestatud"                                                                               // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'OK',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Teate',                                                                                                   // 64
      error: 'Viga',                                                                                                   // 65
      warning: 'Hoiatus'                                                                                               // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "E-post aadress on kohustuslik.",                                                                   // 70
    minChar: "Salasõna peab olema vähemalt 7 märgi pikkune.",                                                          // 71
    pwdsDontMatch: "Salasõnad ei vasta",                                                                               // 72
    pwOneDigit: "Salasõna peab sisaldama vähemalt ühte numbrit.",                                                      // 73
    pwOneLetter: "Salasõna peab sisaldama vähemalt ühte tähte.",                                                       // 74
    signInRequired: "Selle jaoks pead olema sisse logitud.",                                                           // 75
    signupCodeIncorrect: "Registreerimiskood on vale.",                                                                // 76
    signupCodeRequired: "Registreerimiskood on kohustuslik.",                                                          // 77
    usernameIsEmail: "Kasutajanimi ei saa olla e-posti aadress.",                                                      // 78
    usernameRequired: "Kasutajanimi on kohustuslik.",                                                                  // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "See e-posti aadress on juba registreeritud.",                                          // 81
      "Email doesn't match the criteria.": "E-posti aadress ei vasta nõuetele.",                                       // 82
      "Invalid login token": "Vigane sisselogimise žetoon",                                                            // 83
      "Login forbidden": "Sisse logimine keelatud",                                                                    // 84
      "Service unknown": "Tundmatu teenus",                                                                            // 85
      "Unrecognized options for login request": "Tundmatud seaded sisselogimise palves",                               // 86
      "User validation failed": "Kasutaja kinnitamine ei õnnestunud",                                                  // 87
      "Username already exists.": "See kasutajanimi on juba registreeritud.",                                          // 88
      "You are not logged in.": "Sa ei ole sisse logitud.",                                                            // 89
      "You've been logged out by the server. Please log in again.": "Sa oled serveri poolt välja logitud. Palun logi uuesti sisse.",
      "Your session has expired. Please log in again.": "Sinu sessioon on aegunud. Palun logi uuesti sisse.",          // 91
      "Already verified": "Juba kinnitatud",                                                                           // 92
      "Invalid email or username": "Vale e-posti aadress või kasutajanimi",                                            // 93
      "Internal server error": "Sisemine serveri viga",                                                                // 94
      "undefined": "Midagi läks valesti",                                                                              // 95
      "No matching login attempt found": "Sobivat logimisproovi ei leitud",                                            // 96
      "Password is old. Please reset your password.": "Salasõna on vana. Palun lähesta oma salasõna.",                 // 97
      "Incorrect password": "Vale salasõna",                                                                           // 98
      "Invalid email": "Vale e-posti aadress",                                                                         // 99
      "Must be logged in": "Pead olema sisse logitud",                                                                 // 100
      "Need to set a username or email": "Vaja on seadistada kasutajanimi või e-post",                                 // 101
      "old password format": "vana salasõna formaat",                                                                  // 102
      "Password may not be empty": "Salasõna ei või olla tühi",                                                        // 103
      "Signups forbidden": "Registreerumine on suletud",                                                               // 104
      "Token expired": "Aegunud žetoon",                                                                               // 105
      "Token has invalid email address": "Žetoon on seotud vale e-posti aadressiga",                                   // 106
      "User has no password set": "Kasutajal on salasõna seadmata",                                                    // 107
      "User not found": "Sellist kasutajat ei leitud",                                                                 // 108
      "Verify email link expired": "Kinnitus e-kirja viide on aegunud",                                                // 109
      "Verify email link is for unknown address": "Kinnitus e-kirja viide on tundmatule aadressile",                   // 110
      "At least 1 digit, 1 lowercase and 1 uppercase": "Vähemalt 1 number, 1 väike täht ja 1 suur täht",               // 111
      "Please verify your email first. Check the email and follow the link!": "Palun kinnita oma e-posti aadress. E-kirjas vajuta viitele!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Sulle on saadetud uus e-kiri. Kui sa kirja ei näe, vaata palun rämpsposti kausta.",
      "Match failed": "Ei sobi",                                                                                       // 114
      "Unknown error": "Teadmata viga",                                                                                // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Viga, liiga palju proovimisi. Palun võta aeg maha. Pead ootama vähemalt 1 sekundi, enne kui uuesti proovid."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("et", et);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/es_ES.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var es_ES;                                                                                                             // 2
                                                                                                                       // 3
es_ES = {                                                                                                              // 4
  t9Name: 'Español-España',                                                                                            // 5
  add: "agregar",                                                                                                      // 6
  and: "y",                                                                                                            // 7
  back: "regresar",                                                                                                    // 8
  cancel: "Cancelar",                                                                                                  // 9
  changePassword: "Cambiar Contraseña",                                                                                // 10
  choosePassword: "Eligir Contraseña",                                                                                 // 11
  clickAgree: "Si haces clic en Crear Cuenta estás de acuerdo con la",                                                 // 12
  configure: "Configurar",                                                                                             // 13
  createAccount: "Crear cuenta",                                                                                       // 14
  currentPassword: "Contraseña actual",                                                                                // 15
  dontHaveAnAccount: "¿No estás registrado?",                                                                          // 16
  email: "Correo electrónico",                                                                                         // 17
  emailAddress: "Correo electrónico",                                                                                  // 18
  emailResetLink: "Restaurar dirección de correo electrónico",                                                         // 19
  forgotPassword: "¿Has olvidado tu contraseña?",                                                                      // 20
  ifYouAlreadyHaveAnAccount: "Si ya tienes una cuenta, ",                                                              // 21
  newPassword: "Nueva Contraseña",                                                                                     // 22
  newPasswordAgain: "Nueva Contraseña (repetición)",                                                                   // 23
  optional: "Opcional",                                                                                                // 24
  OR: "O",                                                                                                             // 25
  password: "Contraseña",                                                                                              // 26
  passwordAgain: "Contraseña (repetición)",                                                                            // 27
  privacyPolicy: "Póliza de Privacidad",                                                                               // 28
  remove: "remover",                                                                                                   // 29
  resetYourPassword: "Recuperar contraseña",                                                                           // 30
  setPassword: "Definir Contraseña",                                                                                   // 31
  sign: "Entrar",                                                                                                      // 32
  signIn: "Entrar",                                                                                                    // 33
  signin: "entra",                                                                                                     // 34
  signOut: "Salir",                                                                                                    // 35
  signUp: "Regístrate",                                                                                                // 36
  signupCode: "Código para registrarte",                                                                               // 37
  signUpWithYourEmailAddress: "Regístrate con tu correo electrónico",                                                  // 38
  terms: "Términos de Uso",                                                                                            // 39
  updateYourPassword: "Actualizar tu contraseña",                                                                      // 40
  username: "Usuario",                                                                                                 // 41
  usernameOrEmail: "Usuario o correo electrónico",                                                                     // 42
  "with": "con",                                                                                                       // 43
  maxAllowedLength: "Longitud máxima permitida",                                                                       // 44
  minRequiredLength: "Longitud máxima requerida",                                                                      // 45
  resendVerificationEmail: "Mandar correo de nuevo",                                                                   // 46
  resendVerificationEmailLink_pre: "Correo de verificación perdido?",                                                  // 47
  resendVerificationEmailLink_link: "Volver a mandar",                                                                 // 48
  enterPassword: "Introducir contraseña",                                                                              // 49
  enterNewPassword: "Introducir contraseña nueva",                                                                     // 50
  enterEmail: "Introducir correo electrónico",                                                                         // 51
  enterUsername: "Introducir nombre de usuario",                                                                       // 52
  enterUsernameOrEmail: "Introducir nombre de usuario o correo electrónico",                                           // 53
  orUse: "O puedes usar",                                                                                              // 54
  info: {                                                                                                              // 55
    emailSent: "Mensaje enviado",                                                                                      // 56
    emailVerified: "Dirección de correo verificada",                                                                   // 57
    passwordChanged: "Contraseña cambiada",                                                                            // 58
    passwordReset: "Resetar Contraseña"                                                                                // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Aviso',                                                                                                   // 64
      error: 'Error',                                                                                                  // 65
      warning: 'Advertencia'                                                                                           // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "La dirección de correo electrónico es necesaria.",                                                 // 70
    minChar: "7 carácteres mínimo.",                                                                                   // 71
    pwdsDontMatch: "Contraseñas no coinciden",                                                                         // 72
    pwOneDigit: "mínimo un dígito.",                                                                                   // 73
    pwOneLetter: "mínimo una letra.",                                                                                  // 74
    signInRequired: "Debes iniciar sesión para esta opción.",                                                          // 75
    signupCodeIncorrect: "Código de registro inválido.",                                                               // 76
    signupCodeRequired: "Se requiere un código de registro.",                                                          // 77
    usernameIsEmail: "El usuario no puede ser una dirección de correo.",                                               // 78
    usernameRequired: "Se requiere nombre de usuario.",                                                                // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "El correo ya existe.",                                                                 // 81
      "Email doesn't match the criteria.": "El correo no coincide.",                                                   // 82
      "Invalid login token": "Token de inicio de sesión inválido",                                                     // 83
      "Login forbidden": "Inicio de sesión prohibido",                                                                 // 84
      "Service unknown": "Servicio desconocido",                                                                       // 85
      "Unrecognized options for login request": "Opciones desconocidas para solicitud de inicio de sesión",            // 86
      "User validation failed": "No se ha podido validar el usuario",                                                  // 87
      "Username already exists.": "El usuario ya existe.",                                                             // 88
      "You are not logged in.": "No estás conectado.",                                                                 // 89
      "You've been logged out by the server. Please log in again.": "Has sido desconectado por el servidor. Por favor inicia sesión de nuevo.",
      "Your session has expired. Please log in again.": "Tu sesión ha expirado. Por favor inicia sesión de nuevo.",    // 91
      "Already verified": "Ya ha sido verificada",                                                                     // 92
      "Invalid email or username": "Dirección electrónica o nombre de usuario no validos",                             // 93
      "Internal server error": "Error interno del servidor",                                                           // 94
      "undefined": "Algo ha ido mal",                                                                                  // 95
      "No matching login attempt found": "Ningún intento de inicio de sesión coincidente se encontró",                 // 96
      "Password is old. Please reset your password.": "Contraseña es vieja. Por favor, resetea la contraseña.",        // 97
      "Incorrect password": "Contraseña inválida.",                                                                    // 98
      "Invalid email": "Correo electrónico inválido",                                                                  // 99
      "Must be logged in": "Debes ingresar",                                                                           // 100
      "Need to set a username or email": "Tienes que especificar un usuario o una dirección de correo",                // 101
      "old password format": "formato viejo de contraseña",                                                            // 102
      "Password may not be empty": "Contraseña no debe quedar vacía",                                                  // 103
      "Signups forbidden": "Registro prohibido",                                                                       // 104
      "Token expired": "Token expirado",                                                                               // 105
      "Token has invalid email address": "Token contiene una dirección electrónica inválido",                          // 106
      "User has no password set": "Usuario no tiene contraseña",                                                       // 107
      "User not found": "Usuario no encontrado",                                                                       // 108
      "Verify email link expired": "El enlace para verificar el correo electrónico ha expirado",                       // 109
      "Verify email link is for unknown address": "El enlace para verificar el correo electrónico contiene una dirección desconocida",
      "At least 1 digit, 1 lowercase and 1 uppercase": "Al menos tiene que contener un número, una minúscula y una mayúscula",
      "Please verify your email first. Check the email and follow the link!": "Por favor comprueba tu correo electrónico primero. Sigue el link que te ha sido enviado.",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nuevo correo te ha sido enviado. Si no ves el correo en tu bandeja comprueba tu carpeta de spam.",
      "Match failed": "No ha habido ninguna coincidencia",                                                             // 114
      "Unknown error": "Error desconocido",                                                                            // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Error, demasiadas peticiones. Por favor no vayas tan rapido. Tienes que esperar al menos un segundo antes de probar otra vez."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("es_ES", es_ES);                                                                                               // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/fa.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fa;                                                                                                                // 2
                                                                                                                       // 3
fa = {                                                                                                                 // 4
  add: "افزودن",                                                                                                       // 5
  and: "و",                                                                                                            // 6
  back: "برگشت",                                                                                                       // 7
  changePassword: "تعویض گذرواژه",                                                                                     // 8
  choosePassword: "انتخاب یک گذرواژه",                                                                                 // 9
  clickAgree: "با انتخاب ثبت‌نام، شما موافق هستید با",                                                                 // 10
  configure: "پیکربندی",                                                                                               // 11
  createAccount: "ایجاد یک حساب",                                                                                      // 12
  currentPassword: "گذرواژه کنونی",                                                                                    // 13
  dontHaveAnAccount: "یک حساب ندارید؟",                                                                                // 14
  email: "رایانامه",                                                                                                   // 15
  emailAddress: "آدرس رایانامه",                                                                                       // 16
  emailResetLink: "پیوند بازنشانی رایانامه",                                                                           // 17
  forgotPassword: "گذرواژه‌تان را فراموش کرده‌اید؟",                                                                   // 18
  ifYouAlreadyHaveAnAccount: "اگر هم‌اکنون یک حساب دارید",                                                             // 19
  newPassword: "گذرواژه جدید",                                                                                         // 20
  newPasswordAgain: "گذرواژه جدید (تکرار)",                                                                            // 21
  optional: "اختيارى",                                                                                                 // 22
  OR: "یا",                                                                                                            // 23
  password: "گذرواژه",                                                                                                 // 24
  passwordAgain: "گذرواژه (دوباره)",                                                                                   // 25
  privacyPolicy: "حریم خصوصی",                                                                                         // 26
  remove: "حذف",                                                                                                       // 27
  resetYourPassword: "بازنشانی گذرواژه شما",                                                                           // 28
  setPassword: "تنظیم گذرواژه",                                                                                        // 29
  sign: "نشان",                                                                                                        // 30
  signIn: "ورود",                                                                                                      // 31
  signin: "ورود",                                                                                                      // 32
  signOut: "خروج",                                                                                                     // 33
  signUp: "ثبت‌نام",                                                                                                   // 34
  signupCode: "کد ثبت‌نام",                                                                                            // 35
  signUpWithYourEmailAddress: "با آدرس رایانامه‌تان ثبت‌نام کنید",                                                     // 36
  terms: "قوانین استفاده",                                                                                             // 37
  updateYourPassword: "گذرواژه‌تان را به روز کنید",                                                                    // 38
  username: "نام کاربری",                                                                                              // 39
  usernameOrEmail: "نام کاربری یا رایانامه",                                                                           // 40
  "with": "با",                                                                                                        // 41
  info: {                                                                                                              // 42
    emailSent: "رایانامه ارسال شد",                                                                                    // 43
    emailVerified: "رایانامه تایید شد",                                                                                // 44
    passwordChanged: "گذرواژه تغییر کرد",                                                                              // 45
    passwordReset: "گذرواژه بازنشانی شد"                                                                               // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "رایانامه ضروری است.",                                                                              // 49
    minChar: "گذرواژه حداقل ۷ کاراکتر.",                                                                               // 50
    pwdsDontMatch: "گذرواژه‌ها تطابق ندارند",                                                                          // 51
    pwOneDigit: "گذرواژه باید لااقل یک رقم داشته باشد.",                                                               // 52
    pwOneLetter: "گذرواژه یک حرف نیاز دارد.",                                                                          // 53
    signInRequired: "برای انجام آن باید وارد شوید.",                                                                   // 54
    signupCodeIncorrect: "کد ثبت‌نام نادرست است.",                                                                     // 55
    signupCodeRequired: "کد ثبت‌نام ضروری است.",                                                                       // 56
    usernameIsEmail: "نام کاربری نمی‌توان آدرس رایانامه باشد.",                                                        // 57
    usernameRequired: "نام کاربری ضروری است.",                                                                         // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "رایانامه هم‌اکنون وجود دارد.",                                                         // 60
      "Email doesn't match the criteria.": "رایانامه با ضوابط تطابق ندارد.",                                           // 61
      "Invalid login token": "علامت ورود نامعتبر است",                                                                 // 62
      "Login forbidden": "ورود ممنوع است",                                                                             // 63
      "Service unknown": "سرویس ناشناس",                                                                               // 64
      "Unrecognized options for login request": "گزینه‌های نامشخص برای درخواست ورود",                                  // 65
      "User validation failed": "اعتبارسنجی کاربر ناموفق",                                                             // 66
      "Username already exists.": "نام کاربری هم‌اکنون وجود دارد.",                                                    // 67
      "You are not logged in.": "شما وارد نشده‌اید.",                                                                  // 68
      "You've been logged out by the server. Please log in again.": "شما توسط سرور خارج شده‌اید. لطفأ دوباره وارد شوید.",
      "Your session has expired. Please log in again.": "جلسه شما منقضی شده است. لطفا دوباره وارد شوید.",              // 70
      "No matching login attempt found": "تلاش ورود مطابق یافت نشد",                                                   // 71
      "Password is old. Please reset your password.": "گذرواژه قدیمی است. لطفأ گذرواژه‌تان را بازتنظیم کنید.",         // 72
      "Incorrect password": "گذرواژه نادرست",                                                                          // 73
      "Invalid email": "رایانامه نامعتبر",                                                                             // 74
      "Must be logged in": "باید وارد شوید",                                                                           // 75
      "Need to set a username or email": "یک نام کاربری یا ایمیل باید تنظیم شود",                                      // 76
      "old password format": "قالب گذرواژه قدیمی",                                                                     // 77
      "Password may not be empty": "گذرواژه نمی‌تواند خالی باشد",                                                      // 78
      "Signups forbidden": "ثبت‌نام ممنوع",                                                                            // 79
      "Token expired": "علامت رمز منقظی شده است",                                                                      // 80
      "Token has invalid email address": "علامت رمز دارای آدرس رایانامه نامعتبر است",                                  // 81
      "User has no password set": "کاربر گذرواژه‌ای تنظیم نکرده است",                                                  // 82
      "User not found": "کاربر یافت نشد",                                                                              // 83
      "Verify email link expired": "پیوند تایید رایانامه منقضی شده است",                                               // 84
      "Verify email link is for unknown address": "پیوند تایید رایانامه برای آدرس ناشناخته است",                       // 85
      "Match failed": "تطابق ناموفق",                                                                                  // 86
      "Unknown error": "خطای ناشناخته"                                                                                 // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("fa", fa);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/fi.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fi;                                                                                                                // 2
                                                                                                                       // 3
fi = {                                                                                                                 // 4
  t9Name: 'Finnish',                                                                                                   // 5
  add: "lisää",                                                                                                        // 6
  and: "ja",                                                                                                           // 7
  back: "takaisin",                                                                                                    // 8
  cancel: "Peruuta",                                                                                                   // 9
  changePassword: "Vaihda salasana",                                                                                   // 10
  choosePassword: "Valitse salasana",                                                                                  // 11
  clickAgree: "Klikkaamalla Rekisteröidy, hyväksyt meidän",                                                            // 12
  configure: "Asetukset",                                                                                              // 13
  createAccount: "Luo tili",                                                                                           // 14
  currentPassword: "Nykyinen salasana",                                                                                // 15
  dontHaveAnAccount: "Eikö sinulla ole tiliä?",                                                                        // 16
  email: "Sähköposti",                                                                                                 // 17
  emailAddress: "Sähköpostiosoite",                                                                                    // 18
  emailResetLink: "Lähetä salasanan palautuslinkki sähköpostissa",                                                     // 19
  forgotPassword: "Unohditko salasanasi?",                                                                             // 20
  ifYouAlreadyHaveAnAccount: "Jos sinulla on jo tili",                                                                 // 21
  newPassword: "Uusi salasana",                                                                                        // 22
  newPasswordAgain: "Uusi salasana (uudelleen)",                                                                       // 23
  optional: "Valinnainen",                                                                                             // 24
  OR: "TAI",                                                                                                           // 25
  password: "Salasana",                                                                                                // 26
  passwordAgain: "Salasana (uudelleen)",                                                                               // 27
  privacyPolicy: "Tietosuojakäytäntö",                                                                                 // 28
  remove: "poista",                                                                                                    // 29
  resetYourPassword: "Nollaa salasanasi",                                                                              // 30
  setPassword: "Aseta salasana",                                                                                       // 31
  sign: "Kirjaudu",                                                                                                    // 32
  signIn: "Kirjaudu sisään",                                                                                           // 33
  signin: "kirjaudu sisään",                                                                                           // 34
  signOut: "Kirjaudu ulos",                                                                                            // 35
  signUp: "Rekisteröidy",                                                                                              // 36
  signupCode: "Rekisteröinti koodi",                                                                                   // 37
  signUpWithYourEmailAddress: "Rekisteröidy sähköpostiosoitteellasi",                                                  // 38
  terms: "Käyttöehdot",                                                                                                // 39
  updateYourPassword: "Päivitä salasanasi",                                                                            // 40
  username: "Käyttäjätunnus",                                                                                          // 41
  usernameOrEmail: "Käyttäjätunnus tai sähköposti",                                                                    // 42
  "with": "kanssa",                                                                                                    // 43
  maxAllowedLength: "Maksimi sallittu pituus",                                                                         // 44
  minRequiredLength: "Minimi sallittu pituus",                                                                         // 45
  resendVerificationEmail: "Lähetä sähköposti uudelleen",                                                              // 46
  resendVerificationEmailLink_pre: "Varmistus sähköposti kadonnut?",                                                   // 47
  resendVerificationEmailLink_link: "Lähetä uudelleen",                                                                // 48
  enterPassword: "Kirjoita salasana",                                                                                  // 49
  enterNewPassword: "Kirjoita uusi salasana",                                                                          // 50
  enterEmail: "Kirjoita sähköposti",                                                                                   // 51
  enterUsername: "Kirjoita käyttäjätunnus",                                                                            // 52
  enterUsernameOrEmail: "Kirjoita käyttäjätunnus tai sähköposti",                                                      // 53
  orUse: "Tai käytä",                                                                                                  // 54
  info: {                                                                                                              // 55
    emailSent: "Sähköposti lähetetty",                                                                                 // 56
    emailVerified: "Sähköposti varmistettu",                                                                           // 57
    passwordChanged: "Salasana vaihdettu",                                                                             // 58
    passwordReset: "Salasana nollattu"                                                                                 // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Huomio',                                                                                                  // 64
      error: 'Virhe',                                                                                                  // 65
      warning: 'Varoitus'                                                                                              // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "Sähköposti vaaditaan.",                                                                            // 70
    minChar: "7 merkkiä minimi salasana.",                                                                             // 71
    pwdsDontMatch: "Salasanat eivät täsmää",                                                                           // 72
    pwOneDigit: "Salasanassa tulee olla vähintään yksi numero.",                                                       // 73
    pwOneLetter: "Salasana vaatii 1 kirjaimen.",                                                                       // 74
    signInRequired: "Sinun täytyy olla kirjautuneena sisään tehdäksesi tuon.",                                         // 75
    signupCodeIncorrect: "Rekisteröinti koodi on virheellinen.",                                                       // 76
    signupCodeRequired: "Rekisteröinti koodi vaaditaan.",                                                              // 77
    usernameIsEmail: "Käyttäjätunnus ei voi olla sähköpostiosoite.",                                                   // 78
    usernameRequired: "Käyttäjätunnus vaaditaan.",                                                                     // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "Sähköposti on jo olemassa.",                                                           // 81
      "Email doesn't match the criteria.": "Sähköposti ei täytä kriteeriä.",                                           // 82
      "Invalid login token": "Virheellinen kirjautumis token",                                                         // 83
      "Login forbidden": "Kirjautuminen kielletty",                                                                    // 84
      "Service unknown": "Tuntematon palvelu",                                                                         // 85
      "Unrecognized options for login request": "Tunnistamattomat valinnat kirjautumispyynnössä",                      // 86
      "User validation failed": "Käyttäjän varmistus epäonnistui",                                                     // 87
      "Username already exists.": "Käyttäjänimi on jo olemassa.",                                                      // 88
      "You are not logged in.": "Et ole kirjautuneena sisään.",                                                        // 89
      "You've been logged out by the server. Please log in again.": "Palvelin on kirjannut sinut ulos. Ole hyvä ja kirjaudu uudelleen.",
      "Your session has expired. Please log in again.": "Istuntosi on vanhentunut. Ole hyvä ja kirjaudu uudelleen.",   // 91
      "Already verified": "On jo varmistettu",                                                                         // 92
      "Invalid email or username": "Virheellinen sähköposti tai käyttäjätunnus",                                       // 93
      "Internal server error": "Sisäinen palvelinvirhe",                                                               // 94
      "undefined": "Jotain meni väärin",                                                                               // 95
      "No matching login attempt found": "Ei löytynyt täsmäävää kirjautumisyritystä",                                  // 96
      "Password is old. Please reset your password.": "Salasana on vanha. Ole hyvä ja nollaa salasanasi.",             // 97
      "Incorrect password": "Virheellinen salasana",                                                                   // 98
      "Invalid email": "Virheellinen sähköposti",                                                                      // 99
      "Must be logged in": "Täytyy olla kirjautuneena sisään",                                                         // 100
      "Need to set a username or email": "Tarvitsee määrittää käyttäjätunnus tai sähköposti",                          // 101
      "old password format": "vanha salasana muoto",                                                                   // 102
      "Password may not be empty": "Salasana ei voi olla tyhjä",                                                       // 103
      "Signups forbidden": "Rekisteröityminen kielletty",                                                              // 104
      "Token expired": "Token vanhentui",                                                                              // 105
      "Token has invalid email address": "Token sisältää virheellisen sähköpostiosoitteen",                            // 106
      "User has no password set": "Käyttäjälle ei ole salasanaa määritettynä",                                         // 107
      "User not found": "Käyttäjää ei löyty",                                                                          // 108
      "Verify email link expired": "Varmistus sähköposti linkki on vanhentunut",                                       // 109
      "Verify email link is for unknown address": "Varmistus sähköposti linkki on tuntemattomalle osoitteelle",        // 110
      "At least 1 digit, 1 lowercase and 1 uppercase": "Ainakin 1 numero, 1 pieni ja 1 iso kirjain",                   // 111
      "Please verify your email first. Check the email and follow the link!": "Ole hyvä ja varmista sähköpostisi ensin. Tarkista sähköpostisi ja seuraa linkkiä!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Uusi sähköposti on lähetetty sinulle. Jos sähköposti ei näy saapuneissa, tarkista roskaposti kansio.",
      "Match failed": "Eivät täsmää",                                                                                  // 114
      "Unknown error": "Tuntematon virhe",                                                                             // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Virhe, liian monta pyyntöä. Ole hyvä ja hidasta. Sinun täytyy odottaa 1 sekunti ennenkuin yrität uudelleen."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("fi", fi);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/fr.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fr;                                                                                                                // 2
                                                                                                                       // 3
fr = {                                                                                                                 // 4
  t9Name: 'Français',                                                                                                  // 5
  add: "Ajouter",                                                                                                      // 6
  and: "et",                                                                                                           // 7
  back: "retour",                                                                                                      // 8
  changePassword: "Modifier le mot de passe",                                                                          // 9
  choosePassword: "Choisir le mot de passe",                                                                           // 10
  clickAgree: "En cliquant sur « S'enregistrer », vous acceptez nos",                                                  // 11
  configure: "Configurer",                                                                                             // 12
  createAccount: "Créer un compte",                                                                                    // 13
  currentPassword: "Mot de passe actuel",                                                                              // 14
  dontHaveAnAccount: "Vous n'avez pas de compte ?",                                                                    // 15
  email: "E-mail",                                                                                                     // 16
  emailAddress: "Adresse e-mail",                                                                                      // 17
  emailResetLink: "Envoyer l'e-mail de réinitialisation",                                                              // 18
  forgotPassword: "Mot de passe oublié ?",                                                                             // 19
  ifYouAlreadyHaveAnAccount: "Si vous avez déjà un compte",                                                            // 20
  newPassword: "Nouveau mot de passe",                                                                                 // 21
  newPasswordAgain: "Confirmer le nouveau mot de passe",                                                               // 22
  optional: "Facultatif",                                                                                              // 23
  OR: "OU",                                                                                                            // 24
  password: "Mot de passe",                                                                                            // 25
  passwordAgain: "Confirmer le mot de passe",                                                                          // 26
  privacyPolicy: "Politique de confidentialité",                                                                       // 27
  remove: "Supprimer",                                                                                                 // 28
  resetYourPassword: "Reinitialiser votre mot de passe",                                                               // 29
  setPassword: "Renseigner le mot de passe",                                                                           // 30
  sign: "S'enregistrer",                                                                                               // 31
  signIn: "Se connecter",                                                                                              // 32
  signin: "se connecter",                                                                                              // 33
  signOut: "Se déconnecter",                                                                                           // 34
  signUp: "S'enregistrer",                                                                                             // 35
  signupCode: "Code d'inscription",                                                                                    // 36
  signUpWithYourEmailAddress: "S'enregistrer avec votre adresse e-mail",                                               // 37
  terms: "Conditions d'utilisation",                                                                                   // 38
  updateYourPassword: "Mettre à jour le mot de passe",                                                                 // 39
  username: "Nom d'utilisateur",                                                                                       // 40
  usernameOrEmail: "Nom d'utilisateur ou adresse e-mail",                                                              // 41
  "with": "avec",                                                                                                      // 42
  "Verification email lost?": "Vous n'avez pas reçu votre email de vérification?",                                     // 43
  "Send again": "Recevoir un nouvel email",                                                                            // 44
  "Send the verification email again": "Recevoir un nouvel email de vérification",                                     // 45
  "Send email again": "Renvoyer un email",                                                                             // 46
  "Minimum required length: 6": "Veuillez entrer au moins 6 caractères",                                               // 47
  "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nouvel email vient de vous être envoyé. Si vous ne le trouvez pas dans votre boite de réception, vérifiez dans vos spams.",
  "Required Field": "Ce champ est obligatoire",                                                                        // 49
  "Successful Registration! Please check your email and follow the instructions.": "Votre compte est enregistré. Vous allez recevoir un email contenant les instructions pour valider votre compte",
  info: {                                                                                                              // 51
    emailSent: "E-mail envoyé",                                                                                        // 52
    emailVerified: "Adresse e-mail verifiée",                                                                          // 53
    passwordChanged: "Mot de passe modifié",                                                                           // 54
    passwordReset: "Mot de passe réinitialisé",                                                                        // 55
    emailSent: "L'email est envoyé",                                                                                   // 56
    emailVerified: "L'email est vérifié",                                                                              // 57
    passwordChanged: "Le mot de passe a été modifié",                                                                  // 58
    passwordReset: "Le mot de passe a été mis à jour"                                                                  // 59
  },                                                                                                                   // 60
  error: {                                                                                                             // 61
    emailRequired: "Une adresse e-mail est requise.",                                                                  // 62
    minChar: "Votre mot de passe doit contenir au moins 7 caractères.",                                                // 63
    pwdsDontMatch: "Les mots de passe ne correspondent pas",                                                           // 64
    pwOneDigit: "Votre mot de passe doit contenir au moins un chiffre.",                                               // 65
    pwOneLetter: "Votre mot de passe doit contenir au moins une lettre.",                                              // 66
    signInRequired: "Vous devez être connecté pour continuer.",                                                        // 67
    signupCodeIncorrect: "Le code d'enregistrement est incorrect.",                                                    // 68
    signupCodeRequired: "Un code d'inscription est requis.",                                                           // 69
    usernameIsEmail: "Le nom d'utilisateur ne peut être le même que l'adresse email.",                                 // 70
    usernameRequired: "Un nom d'utilisateur est requis.",                                                              // 71
    accounts: {                                                                                                        // 72
      "Email already exists.": "Adresse e-mail déjà utilisée.",                                                        // 73
      "Email doesn't match the criteria.": "L'adresse e-mail ne correspond pas aux critères.",                         // 74
      "Invalid login token": "Jeton d'authentification invalide",                                                      // 75
      "Login forbidden": "Votre identifiant ou votre mot de passe est incorrect",                                      // 76
      "Service unknown": "Service inconnu",                                                                            // 77
      "Unrecognized options for login request": "Options inconnues pour la requête d'authentification",                // 78
      "User validation failed": "Échec de la validation de l'utilisateur",                                             // 79
      "Username already exists.": "Nom d'utilisateur déjà utilisé.",                                                   // 80
      "You are not logged in.": "Vous n'êtes pas connecté.",                                                           // 81
      "You've been logged out by the server. Please log in again.": "Vous avez été déconnecté par le serveur. Veuillez vous reconnecter.",
      "Your session has expired. Please log in again.": "Votre session a expiré. Veuillez vous reconnecter.",          // 83
      "No matching login attempt found": "Aucune tentative d'authentification ne correspond",                          // 84
      "Password is old. Please reset your password.": "Votre mot de passe est trop ancien. Veuillez le modifier.",     // 85
      "Incorrect password": "Mot de passe incorrect",                                                                  // 86
      "Invalid email": "Adresse e-mail invalide",                                                                      // 87
      "Must be logged in": "Vous devez être connecté",                                                                 // 88
      "Need to set a username or email": "Vous devez renseigner un nom d'utilisateur ou une adresse e-mail",           // 89
      "old password format": "Ancien format de mot de passe",                                                          // 90
      "Password may not be empty": "Le mot de passe ne peut être vide",                                                // 91
      "Signups forbidden": "Vous ne pouvez pas créer de compte",                                                       // 92
      "Token expired": "Jeton expiré",                                                                                 // 93
      "Token has invalid email address": "Le jeton contient une adresse e-mail invalide",                              // 94
      "User has no password set": "L'utilisateur n'a pas de mot de passe",                                             // 95
      "User not found": "Utilisateur inconnu",                                                                         // 96
      "Verify email link expired": "Lien de vérification d'e-mail expiré",                                             // 97
      "Please verify your email first. Check the email and follow the link!": "Votre email n'est pas validé. Merci de cliquer sur le lien que vous avez reçu",
      "Verify email link is for unknown address": "Le lien de vérification d'e-mail réfère à une adresse inconnue",    // 99
      "Match failed": "La correspondance a échoué",                                                                    // 100
      "Unknown error": "Erreur inconnue"                                                                               // 101
    }                                                                                                                  // 102
  }                                                                                                                    // 103
};                                                                                                                     // 104
                                                                                                                       // 105
T9n.map("fr", fr);                                                                                                     // 106
                                                                                                                       // 107
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/fr_CA.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var fr_CA;                                                                                                             // 2
                                                                                                                       // 3
fr_CA = {                                                                                                              // 4
  t9Name: 'Français (Canada)',                                                                                         // 5
  add: "Ajouter",                                                                                                      // 6
  and: "et",                                                                                                           // 7
  back: "retour",                                                                                                      // 8
  changePassword: "Modifier le mot de passe",                                                                          // 9
  choosePassword: "Choisir le mot de passe",                                                                           // 10
  clickAgree: "En cliquant sur «&nbsp;S'enregistrer&nbsp;», vous acceptez nos",                                        // 11
  configure: "Configurer",                                                                                             // 12
  createAccount: "Créer un compte",                                                                                    // 13
  currentPassword: "Mot de passe actuel",                                                                              // 14
  dontHaveAnAccount: "Vous n'avez pas de compte ?",                                                                    // 15
  email: "Courriel",                                                                                                   // 16
  emailAddress: "Adresse courriel",                                                                                    // 17
  emailResetLink: "Envoyer un courriel de réinitialisation",                                                           // 18
  forgotPassword: "Mot de passe oublié?",                                                                              // 19
  ifYouAlreadyHaveAnAccount: "Si vous avez déjà un compte",                                                            // 20
  newPassword: "Nouveau mot de passe",                                                                                 // 21
  newPasswordAgain: "Confirmer le nouveau mot de passe",                                                               // 22
  optional: "Facultatif",                                                                                              // 23
  OR: "OU",                                                                                                            // 24
  password: "Mot de passe",                                                                                            // 25
  passwordAgain: "Confirmer le mot de passe",                                                                          // 26
  privacyPolicy: "Politique de confidentialité",                                                                       // 27
  remove: "Supprimer",                                                                                                 // 28
  resetYourPassword: "Reinitialiser votre mot de passe",                                                               // 29
  setPassword: "Saisir le mot de passe",                                                                               // 30
  sign: "S'enregistrer",                                                                                               // 31
  signIn: "Ouvrir une session",                                                                                        // 32
  signin: "ouvrir une session",                                                                                        // 33
  signOut: "Quitter",                                                                                                  // 34
  signUp: "S'enregistrer",                                                                                             // 35
  signupCode: "Code d'inscription",                                                                                    // 36
  signUpWithYourEmailAddress: "S'enregistrer avec une adresse courriel",                                               // 37
  terms: "Conditions d'utilisation",                                                                                   // 38
  updateYourPassword: "Mettre à jour le mot de passe",                                                                 // 39
  username: "Nom d'utilisateur",                                                                                       // 40
  usernameOrEmail: "Nom d'utilisateur ou adresse courriel",                                                            // 41
  "with": "avec",                                                                                                      // 42
  "Verification email lost?": "Vous n'avez pas reçu de courriel de vérification?",                                     // 43
  "Send again": "Envoyer à nouveau",                                                                                   // 44
  "Send the verification email again": "Renvoyer le courriel de vérification",                                         // 45
  "Send email again": "Renvoyer le courriel",                                                                          // 46
  "Minimum required length: 6": "Veuillez saisir au moins 6 caractères",                                               // 47
  "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nouveau courriel vous a été envoyé. Si vous ne le recevez pas sous peu, vérifiez votre dossier destiné aux courriels indésirables.",
  "Required Field": "Ce champ est obligatoire",                                                                        // 49
  "Successful Registration! Please check your email and follow the instructions.": "Votre compte a été créé! Vous recevrez sous peu un courriel de confirmation et la marche à suivre pour valider votre inscription.",
  info: {                                                                                                              // 51
    emailSent: "Courriel envoyé",                                                                                      // 52
    emailVerified: "Adresse courriel verifiée",                                                                        // 53
    passwordChanged: "Mot de passe modifié",                                                                           // 54
    passwordReset: "Mot de passe réinitialisé"                                                                         // 55
  },                                                                                                                   // 56
  error: {                                                                                                             // 57
    emailRequired: "Une adresse courriel est requise.",                                                                // 58
    minChar: "Votre mot de passe doit contenir au moins 7 caractères.",                                                // 59
    pwdsDontMatch: "Les mots de passe saisis ne correspondent pas",                                                    // 60
    pwOneDigit: "Votre mot de passe doit contenir au moins un chiffre.",                                               // 61
    pwOneLetter: "Votre mot de passe doit contenir au moins une lettre.",                                              // 62
    signInRequired: "Vous devez ouvrir une session pour continuer.",                                                   // 63
    signupCodeIncorrect: "Le code d'inscription est incorrect.",                                                       // 64
    signupCodeRequired: "Un code d'inscription est requis.",                                                           // 65
    usernameIsEmail: "Le nom d'utilisateur ne peut être identique à l'adresse courriel.",                              // 66
    usernameRequired: "Un nom d'utilisateur est requis.",                                                              // 67
    accounts: {                                                                                                        // 68
      "Email already exists.": "L'adresse courriel existe déjà.",                                                      // 69
      "Email doesn't match the criteria.": "L'adresse courriel semble incorrectement formatée.",                       // 70
      "Invalid login token": "Jeton d'authentification invalide",                                                      // 71
      "Login forbidden": "Votre identifiant ou votre mot de passe est incorrect",                                      // 72
      "Service unknown": "Service inconnu",                                                                            // 73
      "Unrecognized options for login request": "Options inconnues pour la requête d'authentification",                // 74
      "User validation failed": "Échec de la validation de l'utilisateur",                                             // 75
      "Username already exists.": "Nom d'utilisateur déjà utilisé.",                                                   // 76
      "You are not logged in.": "Vous n'êtes pas connecté.",                                                           // 77
      "You've been logged out by the server. Please log in again.": "Vous avez été déconnecté par le serveur. Veuillez vous reconnecter.",
      "Your session has expired. Please log in again.": "Votre session a expiré. Veuillez vous reconnecter.",          // 79
      "No matching login attempt found": "Aucune tentative d'authentification ne correspond",                          // 80
      "Password is old. Please reset your password.": "Votre mot de passe est périmé. Veuillez le modifier.",          // 81
      "Incorrect password": "Mot de passe incorrect",                                                                  // 82
      "Invalid email": "Adresse courriel invalide",                                                                    // 83
      "Must be logged in": "Vous devez être connecté",                                                                 // 84
      "Need to set a username or email": "Vous devez préciser un nom d'utilisateur ou une adresse courriel",           // 85
      "old password format": "Ancien format de mot de passe",                                                          // 86
      "Password may not be empty": "Le mot de passe ne peut être vide",                                                // 87
      "Signups forbidden": "Vous ne pouvez pas créer de compte",                                                       // 88
      "Token expired": "Jeton expiré",                                                                                 // 89
      "Token has invalid email address": "Le jeton contient une adresse courriel invalide",                            // 90
      "User has no password set": "L'utilisateur n'a pas de mot de passe",                                             // 91
      "User not found": "Utilisateur inconnu",                                                                         // 92
      "Verify email link expired": "Lien de vérification de courriel expiré",                                          // 93
      "Please verify your email first. Check the email and follow the link!": "Votre courriel n'a pas encore été vérifié. Veuillez cliquer le lien que vous avez reçu précédemment.",
      "Verify email link is for unknown address": "Le lien de vérification de courriel réfère à une adresse inconnue",
      "Match failed": "La correspondance a échoué",                                                                    // 96
      "Unknown error": "Erreur inconnue"                                                                               // 97
    }                                                                                                                  // 98
  }                                                                                                                    // 99
};                                                                                                                     // 100
                                                                                                                       // 101
T9n.map("fr_CA", fr_CA);                                                                                               // 102
                                                                                                                       // 103
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/he.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var he;                                                                                                                // 2
                                                                                                                       // 3
he = {                                                                                                                 // 4
  add: "הוסף",                                                                                                         // 5
  and: "ו",                                                                                                            // 6
  back: "חזרה",                                                                                                        // 7
  changePassword: "שינוי סיסמא",                                                                                       // 8
  choosePassword: "בחירת סיסמא",                                                                                       // 9
  clickAgree: "על ידי לחיצה על הירשם, הינך מסכים",                                                                     // 10
  configure: "הגדרות",                                                                                                 // 11
  createAccount: "הוספת חשבון",                                                                                        // 12
  currentPassword: "סיסמא נוכחית",                                                                                     // 13
  dontHaveAnAccount: "אין לך חשבון?",                                                                                  // 14
  email: "דוא\"ל",                                                                                                     // 15
  emailAddress: "דוא\"ל",                                                                                              // 16
  emailResetLink: "שלח קישור לאיפוס סיסמא",                                                                            // 17
  forgotPassword: "שכחת סיסמא?",                                                                                       // 18
  ifYouAlreadyHaveAnAccount: "אם יש לך חשבון",                                                                         // 19
  newPassword: "סיסמא חדשה",                                                                                           // 20
  newPasswordAgain: "סיסמא חדשה (שוב)",                                                                                // 21
  optional: "רשות",                                                                                                    // 22
  OR: "או",                                                                                                            // 23
  password: "סיסמא",                                                                                                   // 24
  passwordAgain: "סיסמא (שוב)",                                                                                        // 25
  privacyPolicy: "למדיניות הפרטיות",                                                                                   // 26
  remove: "הסרה",                                                                                                      // 27
  resetYourPassword: "איפוס סיסמא",                                                                                    // 28
  setPassword: "עדכון סיסמא",                                                                                          // 29
  signIn: "כניסה",                                                                                                     // 30
  signin: "כניסה",                                                                                                     // 31
  signOut: "יציאה",                                                                                                    // 32
  signUp: "הרשמה לחשבון",                                                                                              // 33
  signupCode: "קוד הרשמה",                                                                                             // 34
  signUpWithYourEmailAddress: "הירשם באמצעות הדוא\"ל",                                                                 // 35
  terms: "לתנאי השימוש",                                                                                               // 36
  updateYourPassword: "עדכון סיסמא",                                                                                   // 37
  username: "שם משתמש",                                                                                                // 38
  usernameOrEmail: "שם משתמש או דוא\"ל",                                                                               // 39
  "with": "עם",                                                                                                        // 40
  info: {                                                                                                              // 41
    emailSent: "נשלחה הודעה לדוא\"ל",                                                                                  // 42
    emailVerified: "כתובת הדוא\"ל וודאה בהצלחה",                                                                       // 43
    passwordChanged: "סיסמתך שונתה בהצלחה",                                                                            // 44
    passwordReset: "סיסמתך אופסה בהצלחה"                                                                               // 45
  },                                                                                                                   // 46
  error: {                                                                                                             // 47
    emailRequired: "חובה להזין כתובת דוא\"ל",                                                                          // 48
    minChar: "חובה להזין סיסמא בעלת 7 תווים לפחות.",                                                                   // 49
    pwdsDontMatch: "הסיסמאות אינן זהות.",                                                                              // 50
    pwOneDigit: "הסיסמא חייבת לכלול ספרה אחת לפחות.",                                                                  // 51
    pwOneLetter: "הסיסמא חייבת לכלול אות אחת לפחות.",                                                                  // 52
    signInRequired: "חובה להיכנס למערכת כדי לבצע פעולה זו.",                                                           // 53
    signupCodeIncorrect: "קוד ההרשמה שגוי.",                                                                           // 54
    signupCodeRequired: "חובה להזין את קוד ההרשמה.",                                                                   // 55
    usernameIsEmail: "של המשתמש לא יכול להיות כתובת דוא\"ל.",                                                          // 56
    usernameRequired: "חובה להזין שם משתמש.",                                                                          // 57
    accounts: {                                                                                                        // 58
      "Email already exists.": "הדוא\"ל כבר רשום לחשבון.",                                                             // 59
      "Email doesn't match the criteria.": "הדוא\"ל לא מקיים את הקריטריונים.",                                         // 60
      "Invalid login token": "Token כניסה שגוי",                                                                       // 61
      "Login forbidden": "הכניסה נאסרה",                                                                               // 62
      "Service unknown": "Service לא ידוע",                                                                            // 63
      "Unrecognized options for login request": "נסיון הכניסה כלל אופציות לא מזוהות",                                  // 64
      "User validation failed": "אימות המשתמש נכשל",                                                                   // 65
      "Username already exists.": "שם המשתמש כבר קיים.",                                                               // 66
      "You are not logged in.": "לא נכנסת לחשבון.",                                                                    // 67
      "You've been logged out by the server. Please log in again.": "השרת הוציא אותך מהמערכת. נא להיכנס לחשבונך שוב.",
      "Your session has expired. Please log in again.": "ה-session שלך פג תוקף. נא להיכנס לחשבונך שוב.",               // 69
      "No matching login attempt found": "לא נמצא נסיון כניסה מתאים",                                                  // 70
      "Password is old. Please reset your password.": "סיסמתך ישנה. נא להחליך אותה.",                                  // 71
      "Incorrect password": "סיסמא שגויה",                                                                             // 72
      "Invalid email": "דוא\"ל שגוי",                                                                                  // 73
      "Must be logged in": "חובה להיכנס למערכת כדי לבצע פעולה זו.",                                                    // 74
      "Need to set a username or email": "חובה להגדיר שם משתמש או דוא\"ל",                                             // 75
      "old password format": "פורמט סיסמא ישן",                                                                        // 76
      "Password may not be empty": "הסיסמא לא יכולה להיות ריקה",                                                       // 77
      "Signups forbidden": "אסור להירשם",                                                                              // 78
      "Token expired": "ה-token פג תוקף",                                                                              // 79
      "Token has invalid email address": "ה-token מכיל כתובת דוא\"ל שגוייה",                                           // 80
      "User has no password set": "למשתמש אין סיסמא",                                                                  // 81
      "User not found": "המשתמש לא נמצא",                                                                              // 82
      "Verify email link expired": "קישור וידוי הדוא\"ל פג תוקף",                                                      // 83
      "Verify email link is for unknown address": "קישור וידוי הדוא\"ל הוא לכתובת לא ידועה",                           // 84
      "Match failed": "ההתאמה נכשלה",                                                                                  // 85
      "Unknown error": "שגיאה לא ידועה"                                                                                // 86
    }                                                                                                                  // 87
  }                                                                                                                    // 88
};                                                                                                                     // 89
                                                                                                                       // 90
T9n.map("he", he);                                                                                                     // 91
                                                                                                                       // 92
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/hr.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var hr;                                                                                                                // 2
                                                                                                                       // 3
hr = {                                                                                                                 // 4
  add: "dodaj",                                                                                                        // 5
  and: "i",                                                                                                            // 6
  back: "nazad",                                                                                                       // 7
  changePassword: "Promjeni zaporku",                                                                                  // 8
  choosePassword: "Izaberi zaporku",                                                                                   // 9
  clickAgree: "Klikom na Registracija, prihvatate naše",                                                               // 10
  configure: "Podesi",                                                                                                 // 11
  createAccount: "Napravite račun",                                                                                    // 12
  currentPassword: "Trenutna zaporka",                                                                                 // 13
  dontHaveAnAccount: "Vi nemate račun?",                                                                               // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Email adresa",                                                                                        // 16
  emailResetLink: "Email reset link",                                                                                  // 17
  forgotPassword: "Zaboravili ste zaporku?",                                                                           // 18
  ifYouAlreadyHaveAnAccount: "Ako već imate račun",                                                                    // 19
  newPassword: "Nova zaporka",                                                                                         // 20
  newPasswordAgain: "Nova zaporka (ponovno)",                                                                          // 21
  optional: "neobavezno",                                                                                              // 22
  OR: "ili",                                                                                                           // 23
  password: "Zaporka",                                                                                                 // 24
  passwordAgain: "Zaporka (ponovno)",                                                                                  // 25
  privacyPolicy: "Izjava o privatnosti",                                                                               // 26
  remove: "ukloni",                                                                                                    // 27
  resetYourPassword: "Resetirajte",                                                                                    // 28
  setPassword: "Postavite zaporku",                                                                                    // 29
  sign: "Prijava",                                                                                                     // 30
  signIn: "Prijavi se",                                                                                                // 31
  signin: "prijavi se",                                                                                                // 32
  signOut: "Odjavi se",                                                                                                // 33
  signUp: "Registracija",                                                                                              // 34
  signupCode: "Registracijski kod",                                                                                    // 35
  signUpWithYourEmailAddress: "Registrirajte se sa vašom email adresom",                                               // 36
  terms: "Uslovi korištenja",                                                                                          // 37
  updateYourPassword: "Ažurirajte lozinku",                                                                            // 38
  username: "Korisničko ime",                                                                                          // 39
  usernameOrEmail: "Korisničko ime ili lozinka",                                                                       // 40
  "with": "sa",                                                                                                        // 41
  info: {                                                                                                              // 42
    emailSent: "Email je poslan",                                                                                      // 43
    emailVerified: "Email je verificiran",                                                                             // 44
    passwordChanged: "Zaproka promjenjena",                                                                            // 45
    passwordReset: "Zaporka resetirana"                                                                                // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email je potreban.",                                                                               // 49
    minChar: "Zaporka mora sadržavati više od 7 znakova.",                                                             // 50
    pwdsDontMatch: "Zaporke se ne poklapaju.",                                                                         // 51
    pwOneDigit: "Zaporka mora sadržavati barem jednu brojku.",                                                         // 52
    pwOneLetter: "Zaporka mora sadržavati barem jedno slovo.",                                                         // 53
    signInRequired: "Morate biti prijavljeni za to.",                                                                  // 54
    signupCodeIncorrect: "Registracijski kod je netočan.",                                                             // 55
    signupCodeRequired: "Registracijski kod je potreban.",                                                             // 56
    usernameIsEmail: "Korisničko ime ne može biti email.",                                                             // 57
    usernameRequired: "Korisničko ime je potrebno.",                                                                   // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Email već postoji.",                                                                   // 60
      "Email doesn't match the criteria.": "Email ne zadovoljava kriterij.",                                           // 61
      "Invalid login token": "Nevažeći  token za prijavu",                                                             // 62
      "Login forbidden": "Prijava zabranjena",                                                                         // 63
      "Service unknown": "Servis nepoznat",                                                                            // 64
      "Unrecognized options for login request": "Neprepoznate opcije zahtjeva za prijavu",                             // 65
      "User validation failed": "Provjera valjanosti za korisnika neuspješna.",                                        // 66
      "Username already exists.": "Korisnik već postoji.",                                                             // 67
      "You are not logged in.": "Niste prijavljeni.",                                                                  // 68
      "You've been logged out by the server. Please log in again.": "Odjavljeni ste sa servera. Molimo Vas ponovno se prijavite.",
      "Your session has expired. Please log in again.": "Vaša sesija je istekla. Molimo prijavite se ponovno.",        // 70
      "No matching login attempt found": "Pokušaj prijave se ne podudara sa podatcima u bazi.",                        // 71
      "Password is old. Please reset your password.": "Zaporka je stara. Molimo resetujte zaporku.",                   // 72
      "Incorrect password": "Netočna zaporka",                                                                         // 73
      "Invalid email": "Nevažeći email",                                                                               // 74
      "Must be logged in": "Morate biti prijavljeni",                                                                  // 75
      "Need to set a username or email": "Morate postaviti korisničko ime ili email",                                  // 76
      "old password format": "stari format zaporke",                                                                   // 77
      "Password may not be empty": "Zaporka ne može biti prazna",                                                      // 78
      "Signups forbidden": "Prijave zabranjenje",                                                                      // 79
      "Token expired": "Token je istekao",                                                                             // 80
      "Token has invalid email address": "Token ima nevažeću email adresu",                                            // 81
      "User has no password set": "Korisnik nema postavljenu zaporku",                                                 // 82
      "User not found": "Korisnik nije pronađen",                                                                      // 83
      "Verify email link expired": "Link za verifikaciju emaila je istekao",                                           // 84
      "Verify email link is for unknown address": "Link za verifikaciju emaila je za nepoznatu adresu",                // 85
      "Match failed": "Usporedba neuspjela",                                                                           // 86
      "Unknown error": "Nepoznata pogreška"                                                                            // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("hr", hr);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/hu.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var hu;                                                                                                                // 2
                                                                                                                       // 3
hu = {                                                                                                                 // 4
  add: "hozzáadás",                                                                                                    // 5
  and: "és",                                                                                                           // 6
  back: "vissza",                                                                                                      // 7
  changePassword: "Jelszó megváltoztatása",                                                                            // 8
  choosePassword: "Válassz egy jelszót",                                                                               // 9
  clickAgree: "A regisztráció gombra kattintva egyetértesz a mi",                                                      // 10
  configure: "Beállítás",                                                                                              // 11
  createAccount: "Felhasználó létrehozása",                                                                            // 12
  currentPassword: "Jelenlegi jelszó",                                                                                 // 13
  dontHaveAnAccount: "Nincs még felhasználód?",                                                                        // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Email cím",                                                                                           // 16
  emailResetLink: "Visszaállító link küldése",                                                                         // 17
  forgotPassword: "Elfelejtetted a jelszavadat?",                                                                      // 18
  ifYouAlreadyHaveAnAccount: "Ha már van felhasználód, ",                                                              // 19
  newPassword: "Új jelszó",                                                                                            // 20
  newPasswordAgain: "Új jelszó (ismét)",                                                                               // 21
  optional: "Opcionális",                                                                                              // 22
  OR: "VAGY",                                                                                                          // 23
  password: "Jelszó",                                                                                                  // 24
  passwordAgain: "Jelszó (ismét)",                                                                                     // 25
  privacyPolicy: "Adatvédelmi irányelvek",                                                                             // 26
  remove: "eltávolítás",                                                                                               // 27
  resetYourPassword: "Jelszó visszaállítása",                                                                          // 28
  setPassword: "Jelszó beállítása",                                                                                    // 29
  sign: "Bejelentkezés",                                                                                               // 30
  signIn: "Bejelentkezés",                                                                                             // 31
  signin: "jelentkezz be",                                                                                             // 32
  signOut: "Kijelentkezés",                                                                                            // 33
  signUp: "Regisztráció",                                                                                              // 34
  signupCode: "Regisztrációs kód",                                                                                     // 35
  signUpWithYourEmailAddress: "Regisztráció email címmel",                                                             // 36
  terms: "Használati feltételek",                                                                                      // 37
  updateYourPassword: "Jelszó módosítása",                                                                             // 38
  username: "Felhasználónév",                                                                                          // 39
  usernameOrEmail: "Felhasználónév vagy email",                                                                        // 40
  "with": "-",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "Email elküldve",                                                                                       // 43
    emailVerified: "Email cím igazolva",                                                                               // 44
    passwordChanged: "Jelszó megváltoztatva",                                                                          // 45
    passwordReset: "Jelszó visszaállítva"                                                                              // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email cím megadása kötelező.",                                                                     // 49
    minChar: "A jelszónak legalább 7 karakter hoszúnak kell lennie.",                                                  // 50
    pwdsDontMatch: "A jelszavak nem egyeznek",                                                                         // 51
    pwOneDigit: "A jelszónak legalább egy számjegyet tartalmaznia kell.",                                              // 52
    pwOneLetter: "A jelszónak legalább egy betűt tartalmaznia kell.",                                                  // 53
    signInRequired: "A művelet végrehajtásához be kell jelentkezned.",                                                 // 54
    signupCodeIncorrect: "A regisztrációs kód hibás.",                                                                 // 55
    signupCodeRequired: "A regisztrációs kód megadása kötelező.",                                                      // 56
    usernameIsEmail: "A felhasználónév nem lehet egy email cím.",                                                      // 57
    usernameRequired: "Felhasználónév megadása kötelező.",                                                             // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "A megadott email cím már létezik.",                                                    // 60
      "Email doesn't match the criteria.": "Email cím nem felel meg a feltételeknek.",                                 // 61
      "Invalid login token": "Érvénytelen belépési token",                                                             // 62
      "Login forbidden": "Belépés megtagadva",                                                                         // 63
      "Service unknown": "Ismeretlen szolgáltatás",                                                                    // 64
      "Unrecognized options for login request": "Ismeretlen beállítások a belépési kérelemhez",                        // 65
      "User validation failed": "Felhasználó azonosítás sikertelen",                                                   // 66
      "Username already exists.": "A felhasználónév már létezik.",                                                     // 67
      "You are not logged in.": "Nem vagy bejelentkezve.",                                                             // 68
      "You've been logged out by the server. Please log in again.": "A szerver kijelentkeztetett. Kérjük, jelentkezz be újra.",
      "Your session has expired. Please log in again.": "A munkamenet lejárt. Kérjük, jelentkezz be újra.",            // 70
      "No matching login attempt found": "Nem található megegyező belépési próbálkozás",                               // 71
      "Password is old. Please reset your password.": "A jelszó túl régi. Kérjük, változtasd meg a jelszavad.",        // 72
      "Incorrect password": "Helytelen jelszó",                                                                        // 73
      "Invalid email": "Érvénytelen email cím",                                                                        // 74
      "Must be logged in": "A művelet végrehajtásához bejelentkezés szükséges",                                        // 75
      "Need to set a username or email": "Felhasználónév vagy email cím beállítása kötelező",                          // 76
      "old password format": "régi jelszó formátum",                                                                   // 77
      "Password may not be empty": "A jelszó nem lehet üres",                                                          // 78
      "Signups forbidden": "Regisztráció megtagadva",                                                                  // 79
      "Token expired": "Token lejárt",                                                                                 // 80
      "Token has invalid email address": "A token érvénytelen email címet tartalmaz",                                  // 81
      "User has no password set": "A felhasználóhoz nincs jelszó beállítva",                                           // 82
      "User not found": "Felhasználó nem található",                                                                   // 83
      "Verify email link expired": "Igazoló email link lejárt",                                                        // 84
      "Verify email link is for unknown address": "Az igazoló email link ismeretlen címhez tartozik",                  // 85
      "Match failed": "Megegyeztetés sikertelen",                                                                      // 86
      "Unknown error": "Ismeretlen hiba"                                                                               // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("hu", hu);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/id.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var id;                                                                                                                // 2
                                                                                                                       // 3
id = {                                                                                                                 // 4
  add: "tambah",                                                                                                       // 5
  and: "dan",                                                                                                          // 6
  back: "kembali",                                                                                                     // 7
  changePassword: "Ganti Password",                                                                                    // 8
  choosePassword: "Masukkan Password",                                                                                 // 9
  clickAgree: "Dengan Anda mendaftar, Anda setuju dengan",                                                             // 10
  configure: "Mengaturkan",                                                                                            // 11
  createAccount: "Buat Account",                                                                                       // 12
  currentPassword: "Password Anda Saat Ini",                                                                           // 13
  dontHaveAnAccount: "Tidak punya account?",                                                                           // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Alamat email",                                                                                        // 16
  emailResetLink: "Link untuk email reset",                                                                            // 17
  forgotPassword: "Lupa password?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Jika Anda sudah punya akun",                                                             // 19
  newPassword: "Password Baru",                                                                                        // 20
  newPasswordAgain: "Password Baru (ulang)",                                                                           // 21
  optional: "Opsional",                                                                                                // 22
  OR: "ATAU",                                                                                                          // 23
  password: "Password",                                                                                                // 24
  passwordAgain: "Password (ulang)",                                                                                   // 25
  privacyPolicy: "Kebijakan Privasi",                                                                                  // 26
  remove: "hapus",                                                                                                     // 27
  resetYourPassword: "Reset password anda",                                                                            // 28
  setPassword: "Masukkan Password",                                                                                    // 29
  sign: "Sign",                                                                                                        // 30
  signIn: "Sign In",                                                                                                   // 31
  signin: "sign in",                                                                                                   // 32
  signOut: "Sign Out",                                                                                                 // 33
  signUp: "Mendaftar",                                                                                                 // 34
  signupCode: "Kode Registrasi",                                                                                       // 35
  signUpWithYourEmailAddress: "Mendaftar dengan alamat email Anda",                                                    // 36
  terms: "Persyaratan Layanan",                                                                                        // 37
  updateYourPassword: "Perbarui password Anda",                                                                        // 38
  username: "Username",                                                                                                // 39
  usernameOrEmail: "Username atau email",                                                                              // 40
  "with": "dengan",                                                                                                    // 41
  info: {                                                                                                              // 42
    emailSent: "Email terkirim",                                                                                       // 43
    emailVerified: "Email diverifikasi",                                                                               // 44
    passwordChanged: "Password terganti",                                                                              // 45
    passwordReset: "Password direset"                                                                                  // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Alamat email dibutuhkan.",                                                                         // 49
    minChar: "Minimum password 7 karakter.",                                                                           // 50
    pwdsDontMatch: "Password yang diulang tidak sama.",                                                                // 51
    pwOneDigit: "Password harus ada minimum 1 angka.",                                                                 // 52
    pwOneLetter: "Password harus ada minimum 1 huruf.",                                                                // 53
    signInRequired: "Anda harus sign in untuk melakukan itu.",                                                         // 54
    signupCodeIncorrect: "Kode registrasi salah.",                                                                     // 55
    signupCodeRequired: "Kode registrasi dibutuhkan.",                                                                 // 56
    usernameIsEmail: "Username Anda tidak bisa sama dengan email address.",                                            // 57
    usernameRequired: "Username dibutuhkan.",                                                                          // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Alamat email sudah dipakai.",                                                          // 60
      "Email doesn't match the criteria.": "Alamat email tidak sesuai dengan kriteria.",                               // 61
      "Invalid login token": "Login token tidak valid",                                                                // 62
      "Login forbidden": "Login dilarang",                                                                             // 63
      "Service unknown": "Layanan unknown",                                                                            // 64
      "Unrecognized options for login request": "Options tidak tersedia untuk permintaan login",                       // 65
      "User validation failed": "Validasi user gagal",                                                                 // 66
      "Username already exists.": "Username sudah dipakai.",                                                           // 67
      "You are not logged in.": "Anda belum login.",                                                                   // 68
      "You've been logged out by the server. Please log in again.": "Anda belum dilogout oleh server. Silahkan coba login lagi.",
      "Your session has expired. Please log in again.": "Session Anda telah kadaluarsa. Silahkan coba login lagi.",    // 70
      "No matching login attempt found": "Usaha login tidak ditemukan.",                                               // 71
      "Password is old. Please reset your password.": "Password Anda terlalu tua. Silahkan ganti password Anda.",      // 72
      "Incorrect password": "Password salah",                                                                          // 73
      "Invalid email": "Alamat email tidak valid",                                                                     // 74
      "Must be logged in": "Anda harus login",                                                                         // 75
      "Need to set a username or email": "Anda harus masukkan username atau email",                                    // 76
      "old password format": "format password lama",                                                                   // 77
      "Password may not be empty": "Password tidak boleh kosong",                                                      // 78
      "Signups forbidden": "Signup dilarang",                                                                          // 79
      "Token expired": "Token telah kadaluarsa",                                                                       // 80
      "Token has invalid email address": "Token memberikan alamat email yang tidak valid",                             // 81
      "User has no password set": "User belum memasukkan password",                                                    // 82
      "User not found": "User tidak ditemukan",                                                                        // 83
      "Verify email link expired": "Link untuk verifikasi alamat email telah kadaluarsa",                              // 84
      "Verify email link is for unknown address": "Link untuk verifikasi alamat email memberikan alamat email yang tidak dikenalkan",
      "Match failed": "Mencocokan gagal",                                                                              // 86
      "Unknown error": "Error tidak dikenalkan"                                                                        // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("id", id);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/it.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var it;                                                                                                                // 2
                                                                                                                       // 3
it = {                                                                                                                 // 4
  t9Name: 'Italiano',                                                                                                  // 5
  add: "aggiungi",                                                                                                     // 6
  and: "e",                                                                                                            // 7
  back: "indietro",                                                                                                    // 8
  changePassword: "Cambia Password",                                                                                   // 9
  choosePassword: "Scegli una Password",                                                                               // 10
  clickAgree: "Cliccando Registrati, accetti la nostra",                                                               // 11
  configure: "Configura",                                                                                              // 12
  createAccount: "Crea un Account",                                                                                    // 13
  currentPassword: "Password Corrente",                                                                                // 14
  dontHaveAnAccount: "Non hai un account?",                                                                            // 15
  email: "Email",                                                                                                      // 16
  emailAddress: "Indirizzo Email",                                                                                     // 17
  emailResetLink: "Invia Link di Reset",                                                                               // 18
  forgotPassword: "Hai dimenticato la password?",                                                                      // 19
  ifYouAlreadyHaveAnAccount: "Se hai già un account",                                                                  // 20
  newPassword: "Nuova Password",                                                                                       // 21
  newPasswordAgain: "Nuova Password (di nuovo)",                                                                       // 22
  optional: "Opzionale",                                                                                               // 23
  OR: "OPPURE",                                                                                                        // 24
  password: "Password",                                                                                                // 25
  passwordAgain: "Password (di nuovo)",                                                                                // 26
  privacyPolicy: "Privacy Policy",                                                                                     // 27
  remove: "rimuovi",                                                                                                   // 28
  resetYourPassword: "Reimposta la password",                                                                          // 29
  setPassword: "Imposta Password",                                                                                     // 30
  sign: "Accedi",                                                                                                      // 31
  signIn: "Accedi",                                                                                                    // 32
  signin: "accedi",                                                                                                    // 33
  signOut: "Esci",                                                                                                     // 34
  signUp: "Registrati",                                                                                                // 35
  signupCode: "Codice di Registrazione",                                                                               // 36
  signUpWithYourEmailAddress: "Registrati con il tuo indirizzo email",                                                 // 37
  terms: "Termini di Servizio",                                                                                        // 38
  updateYourPassword: "Aggiorna la password",                                                                          // 39
  username: "Username",                                                                                                // 40
  usernameOrEmail: "Nome utente o email",                                                                              // 41
  "with": "con",                                                                                                       // 42
  "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Ti è stata inviata una nuova email. Se non trovi l' email nella tua posta in arrivo controllate che non sia stata spostata nella cartella SPAM.",
  "Already verified": "Gi\à verificato",                                                                               // 44
  "At least 1 digit, 1 lowercase and 1 uppercase": "Almeno 1 numero, 1 carattere minuscolo e 1 maiuscolo",             // 45
  "Invalid email": "Email non valida",                                                                                 // 46
  "Please verify your email first. Check the email and follow the link!": "Per favore, verifica prima la tua email. Controlla la tua email e segui il collegamento che ti è stato inviato.",
  "Required Field": "Campo richiesto",                                                                                 // 48
  "Send again": "Invia di nuovo",                                                                                      // 49
  "Send email again": "Invia di nuovo l' email",                                                                       // 50
  "Send the verification email again": "Invia di nuovo l' email di verifica",                                          // 51
  "Verification email lost?": "Hai smarrito l' email di verifica?",                                                    // 52
  info: {                                                                                                              // 53
    emailSent: "Email inviata",                                                                                        // 54
    emailVerified: "Email verificata",                                                                                 // 55
    passwordChanged: "Password cambiata",                                                                              // 56
    passwordReset: "Password reimpostata"                                                                              // 57
  },                                                                                                                   // 58
  error: {                                                                                                             // 59
    emailRequired: "L'Email è obbligatoria.",                                                                          // 60
    minChar: "La Password deve essere di almeno 7 caratteri.",                                                         // 61
    pwdsDontMatch: "Le Password non corrispondono",                                                                    // 62
    pwOneDigit: "La Password deve contenere almeno un numero.",                                                        // 63
    pwOneLetter: "La Password deve contenere 1 lettera.",                                                              // 64
    signInRequired: "Per fare questo devi accedere.",                                                                  // 65
    signupCodeIncorrect: "Codice di Registrazione errato.",                                                            // 66
    signupCodeRequired: "Il Codice di Registrazione è obbligatorio.",                                                  // 67
    usernameIsEmail: "Il Nome Utente non può essere un indirizzo email.",                                              // 68
    usernameRequired: "Il Nome utente è obbligatorio.",                                                                // 69
    accounts: {                                                                                                        // 70
      "Email already exists.": "Indirizzo email già esistente.",                                                       // 71
      "Email doesn't match the criteria.": "L'indirizzo email non soddisfa i requisiti.",                              // 72
      "Invalid login token": "Codice di accesso non valido",                                                           // 73
      "Login forbidden": "Accesso non consentito",                                                                     // 74
      "Service unknown": "Servizio sconosciuto",                                                                       // 75
      "Unrecognized options for login request": "Opzioni per la richiesta di accesso non ricunosciute",                // 76
      "User validation failed": "Validazione utente fallita",                                                          // 77
      "Username already exists.": "Nome utente già esistente.",                                                        // 78
      "You are not logged in.": "Non hai effettuato l'accesso.",                                                       // 79
      "You've been logged out by the server. Please log in again.": "Sei stato disconnesso dal server. Per favore accedi di nuovo.",
      "Your session has expired. Please log in again.": "La tua sessione è scaduta. Per favore accedi di nuovo.",      // 81
      "No matching login attempt found": "Tentativo di accesso corrispondente non trovato",                            // 82
      "Password is old. Please reset your password.": "La password è vecchia. Per favore reimposta la tua password.",  // 83
      "Incorrect password": "Password non corretta",                                                                   // 84
      "Must be logged in": "Devi aver eseguito l'accesso",                                                             // 85
      "Need to set a username or email": "È necessario specificare un nome utente o un indirizzo email",               // 86
      "old password format": "vecchio formato password",                                                               // 87
      "Password may not be empty": "La password non può essere vuota",                                                 // 88
      "Signups forbidden": "Registrazioni non consentite",                                                             // 89
      "Token expired": "Codice scaduto",                                                                               // 90
      "Token has invalid email address": "Il codice ha un indirizzo email non valido",                                 // 91
      "User has no password set": "L'utente non ha una password impostata",                                            // 92
      "User not found": "Utente non trovato",                                                                          // 93
      "Verify email link expired": "Link per la verifica dell'email scaduto",                                          // 94
      "Verify email link is for unknown address": "Il link per la verifica dell'email fa riferimento ad un indirizzo sconosciuto",
      "Match failed": "Riscontro fallito",                                                                             // 96
      "Unknown error": "Errore Sconosciuto"                                                                            // 97
    }                                                                                                                  // 98
  }                                                                                                                    // 99
};                                                                                                                     // 100
                                                                                                                       // 101
T9n.map("it", it);                                                                                                     // 102
                                                                                                                       // 103
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ja.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ja;                                                                                                                // 2
                                                                                                                       // 3
ja = {                                                                                                                 // 4
  t9Name: '日本語',                                                                                                       // 5
  add: "アカウント連携：",                                                                                                     // 6
  and: "と",                                                                                                            // 7
  back: "戻る",                                                                                                          // 8
  changePassword: "パスワードを変更する",                                                                                        // 9
  choosePassword: "パスワードを選ぶ",                                                                                          // 10
  clickAgree: "アカウント登録をクリックすると、次の内容に同意したことになります。",                                                                     // 11
  configure: "設定する",                                                                                                   // 12
  createAccount: "新しいアカウントの登録",                                                                                        // 13
  currentPassword: "現在のパスワード",                                                                                         // 14
  dontHaveAnAccount: "まだアカウントをお持ちでない場合は",                                                                              // 15
  Email: "メールアドレス",                                                                                                    // 16
  email: "メールアドレス",                                                                                                    // 17
  emailAddress: "メールアドレス",                                                                                             // 18
  emailResetLink: "パスワードリセットのメールを送る",                                                                                  // 19
  forgotPassword: "パスワードをお忘れですか？",                                                                                     // 20
  ifYouAlreadyHaveAnAccount: "既にアカウントをお持ちの場合は",                                                                        // 21
  newPassword: "新しいパスワード",                                                                                             // 22
  newPasswordAgain: "新しいパスワード（確認）",                                                                                    // 23
  optional: "オプション",                                                                                                   // 24
  OR: "または",                                                                                                           // 25
  password: "パスワード",                                                                                                   // 26
  passwordAgain: "パスワード（確認）",                                                                                          // 27
  privacyPolicy: "プライバシーポリシー",                                                                                         // 28
  remove: "連携の解除：",                                                                                                    // 29
  resetYourPassword: "パスワードのリセット",                                                                                     // 30
  setPassword: "パスワードを設定する",                                                                                           // 31
  sign: "署名",                                                                                                          // 32
  signIn: "ログイン",                                                                                                      // 33
  signin: "ログイン",                                                                                                      // 34
  signOut: "ログアウト",                                                                                                    // 35
  signUp: "アカウント登録",                                                                                                   // 36
  signupCode: "登録用コード",                                                                                                // 37
  signUpWithYourEmailAddress: "メールアドレスで登録する",                                                                          // 38
  terms: "利用規約",                                                                                                       // 39
  updateYourPassword: "パスワードを変更する",                                                                                    // 40
  username: "ユーザー名",                                                                                                   // 41
  usernameOrEmail: "ユーザー名またはメールアドレス",                                                                                  // 42
  "with": "：",                                                                                                         // 43
  maxAllowedLength: "最大文字数",                                                                                           // 44
  minRequiredLength: "最低文字数",                                                                                          // 45
  resendVerificationEmail: "認証メールの再送",                                                                                 // 46
  resendVerificationEmailLink_pre: "認証メールが届いていない場合は",                                                                  // 47
  resendVerificationEmailLink_link: "再送",                                                                              // 48
  info: {                                                                                                              // 49
    emailSent: "メールを送りました",                                                                                            // 50
    emailVerified: "メールアドレスを確認しました",                                                                                   // 51
    passwordChanged: "パスワードを変更しました",                                                                                   // 52
    passwordReset: "パスワードをリセットしました"                                                                                    // 53
  },                                                                                                                   // 54
  error: {                                                                                                             // 55
    emailRequired: "メールアドレスを入力してください。",                                                                                // 56
    minChar: "パスワードの文字数が足りません。",                                                                                       // 57
    pwdsDontMatch: "パスワードが一致しません。",                                                                                    // 58
    pwOneDigit: "パスワードに1文字以上の数字を含めてください。",                                                                             // 59
    pwOneLetter: "パスワードに1文字以上のアルファベットを含めてください。",                                                                       // 60
    signInRequired: "その操作にはログインが必要です。",                                                                                // 61
    signupCodeIncorrect: "登録用コードが間違っています。",                                                                            // 62
    signupCodeRequired: "登録用コードが必要です。",                                                                                // 63
    usernameIsEmail: "ユーザー名にメールアドレスは使えません。",                                                                           // 64
    usernameRequired: "ユーザー名が必要です。",                                                                                   // 65
    accounts: {                                                                                                        // 66
      "Email already exists.": "そのメールアドレスは既に登録されています。",                                                                // 67
      "Email doesn't match the criteria.": "正しいメールアドレスを入力してください。",                                                     // 68
      "Invalid login token": "無効なログイントークンです。",                                                                         // 69
      "Login forbidden": "ログインできません。",                                                                                 // 70
      "Service unknown": "不明なサービスです",                                                                                  // 71
      "Unrecognized options for login request": "不明なログインオプションです",                                                      // 72
      "User validation failed": "ユーザ認証に失敗しました",                                                                        // 73
      "Username already exists.": "そのユーザー名は既に使われています。",                                                                // 74
      "You are not logged in.": "ログインしていません。",                                                                         // 75
      "You've been logged out by the server. Please log in again.": "既にログアウトしています。再度ログインしてください。",                      // 76
      "Your session has expired. Please log in again.": "セッションが切れました。再度ログインしてください。",                                   // 77
      "Already verified": "認証済です",                                                                                     // 78
      "No matching login attempt found": "対応するログイン試行が見つかりません",                                                         // 79
      "Password is old. Please reset your password.": "古いパスワードです。パスワードをリセットしてください。",                                   // 80
      "Incorrect password": "パスワードが正しくありません",                                                                          // 81
      "Invalid email": "無効なメールアドレスです",                                                                                 // 82
      "Must be logged in": "ログインが必要です",                                                                                // 83
      "Need to set a username or email": "ユーザー名かメールアドレスを入力してください",                                                     // 84
      "old password format": "古いパスワード形式です",                                                                            // 85
      "Password may not be empty": "パスワードを入力してください",                                                                   // 86
      "Signups forbidden": "アカウントを登録できません",                                                                            // 87
      "Token expired": "無効なトークンです",                                                                                    // 88
      "Token has invalid email address": "トークンに無効なメールアドレスが含まれています",                                                    // 89
      "User has no password set": "パスワードが設定されていません",                                                                   // 90
      "User not found": "ユーザー名が見つかりません",                                                                               // 91
      "Verify email link expired": "期限の切れた認証メールのリンクです",                                                                // 92
      "Verify email link is for unknown address": "不明なメールアドレスに対する認証メールのリンクです",                                         // 93
      "At least 1 digit, 1 lowercase and 1 uppercase": "数字、小文字、大文字をそれぞれ1文字以上入力してください",                                 // 94
      "Please verify your email first. Check the email and follow the link!": "まず認証メールが届いているか確認して、リンクを押してください！",       // 95
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "新しいメールを送信しました。もしメールが届いていなければ、迷惑メールに分類されていないか確認してください。",
      "Match failed": "一致しません",                                                                                        // 97
      "Unknown error": "不明なエラー"                                                                                        // 98
    }                                                                                                                  // 99
  }                                                                                                                    // 100
};                                                                                                                     // 101
                                                                                                                       // 102
T9n.map("ja", ja);                                                                                                     // 103
                                                                                                                       // 104
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/kh.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var kh;                                                                                                                // 2
                                                                                                                       // 3
kh = {                                                                                                                 // 4
  add: "បន្ថែម",                                                                                                       // 5
  and: "និង",                                                                                                          // 6
  back: "ត្រឡប់ក្រោយ",                                                                                                 // 7
  changePassword: "ផ្លាស់ប្តូរពាក្យសម្ងាត់",                                                                           // 8
  choosePassword: "ជ្រើសពាក្យសម្ងាត់",                                                                                 // 9
  clickAgree: "សូមចុះឈ្មោះ បើអ្នកយល់ព្រម",                                                                             // 10
  configure: "កំណត់រចនាសម្ព័ន្ធ",                                                                                      // 11
  createAccount: "បង្កើតគណនី",                                                                                         // 12
  currentPassword: "ពាក្យសម្ងាត់បច្ចុប្បន្ន",                                                                          // 13
  dontHaveAnAccount: "មិនមានគណនីទេឬ?",                                                                                 // 14
  email: "អ៊ីម៉ែល",                                                                                                    // 15
  emailAddress: "អាសយដ្ឋានអ៊ីម៉ែល",                                                                                    // 16
  emailResetLink: "អ៊ីម៉ែលតំណភ្ជាប់ សម្រាប់កំណត់ឡើងវិញ",                                                               // 17
  forgotPassword: "ភ្លេចពាក្យសម្ងាត់?",                                                                                // 18
  ifYouAlreadyHaveAnAccount: "បើអ្នកមានគណនីមួយរួចទៅហើយ",                                                               // 19
  newPassword: "ពាក្យសម្ងាត់ថ្មី",                                                                                     // 20
  newPasswordAgain: "ពាក្យសម្ងាត់ថ្មី (ម្ដងទៀត)",                                                                      // 21
  optional: "ជម្រើស",                                                                                                  // 22
  OR: "ឬ",                                                                                                             // 23
  password: "ពាក្យសម្ងាត់",                                                                                            // 24
  passwordAgain: "ពាក្យសម្ងាត់ (ម្ដងទៀត)",                                                                             // 25
  privacyPolicy: "គោលការណ៍ភាពឯកជន",                                                                                    // 26
  remove: "លុប",                                                                                                       // 27
  resetYourPassword: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ",                                                                        // 28
  setPassword: "កំណត់ពាក្យសម្ងាត់",                                                                                    // 29
  sign: "ចូលគណនី",                                                                                                     // 30
  signIn: "ពិនិត្យចូល",                                                                                                // 31
  signin: "ចូល",                                                                                                       // 32
  signOut: "ចាកចេញ",                                                                                                   // 33
  signUp: "ចុះឈ្មោះ",                                                                                                  // 34
  signupCode: "លេខ​កូដចុះឈ្មោះ",                                                                                       // 35
  signUpWithYourEmailAddress: "ចុះឈ្មោះជាមួយអាសយដ្ឋានអ៊ីមែល",                                                          // 36
  terms: "លក្ខខណ្ឌនៃការប្រើប្រាស់",                                                                                    // 37
  updateYourPassword: "ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់",                                                                // 38
  username: "ឈ្មោះអ្នកប្រើ",                                                                                           // 39
  usernameOrEmail: "ឈ្មោះអ្នកប្រើ ឬអ៊ីម៉ែល",                                                                           // 40
  "with": "ជាមួយនឹង",                                                                                                  // 41
  info: {                                                                                                              // 42
    emailSent: "អ៊ីម៉ែលដែលបានផ្ញើរ",                                                                                   // 43
    emailVerified: "អ៊ីម៉ែលបានផ្ទៀងផ្ទាត់",                                                                            // 44
    passwordChanged: "ពាក្យសម្ងាត់បាន​ផ្លាស់ប្តូរ",                                                                    // 45
    passwordReset: "កំណត់ពាក្យសម្ងាត់ឡើងវិញ"                                                                           // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "អ៊ីម៉ែលត្រូវបានទាមទារ",                                                                            // 49
    minChar: "ពាក្យសម្ងាត់អប្បបរមា ៧ តួអក្សរលេខ",                                                                      // 50
    pwdsDontMatch: "ពាក្យសម្ងាត់មិនត្រូវគ្នា",                                                                         // 51
    pwOneDigit: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ១ តួលេខ",                                                           // 52
    pwOneLetter: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ១ តួអក្សរ​",                                                       // 53
    signInRequired: "អ្នកត្រូវតែបានចូលគណនី ដើម្បីធ្វើការងារផ្សេងៗ",                                                    // 54
    signupCodeIncorrect: "លេខកូដការចុះឈ្មោះមិនត្រឹមត្រូវ",                                                             // 55
    signupCodeRequired: "លេខកូដការចុះឈ្មោះត្រូវបានទាមទារ",                                                             // 56
    usernameIsEmail: "ឈ្មោះអ្នកប្រើមិនអាចជាអាសយដ្ឋានអ៊ីមែល",                                                           // 57
    usernameRequired: "ឈ្មោះអ្នកប្រើត្រូវបានទាមទារ",                                                                   // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "អ៊ីម៉ែលមានរួចហើយ",                                                                     // 60
      "Email doesn't match the criteria.": "អ៊ីម៉ែលមិនផ្គូផ្គងនឹងលក្ខណៈវិនិច្ឆ័យ",                                     // 61
      "Invalid login token": "សញ្ញាសម្ងាត់ចូលមិនត្រឹមត្រូវ",                                                           // 62
      "Login forbidden": "បានហាមឃាត់ការចូល",                                                                           // 63
      "Service unknown": "សេវាមិនស្គាល់",                                                                              // 64
      "Unrecognized options for login request": "មិនស្គាល់ជម្រើសសម្រាប់សំណើកត់ត្រាចូល",                                // 65
      "User validation failed": "សុពលភាពរបស់អ្នកប្រើបានបរាជ័យ",                                                        // 66
      "Username already exists.": "ឈ្មោះអ្នកប្រើមាន​រួចហើយ",                                                           // 67
      "You are not logged in.": "អ្នកមិនបានចូលគណនីទេ",                                                                 // 68
      "You've been logged out by the server. Please log in again.": "អ្នកបានចាកចេញ ពីគណនី, សូមចូលម្តងទៀត",             // 69
      "Your session has expired. Please log in again.": "សុពលភាពរបស់អ្នកបានផុតកំណត់, សូមចូលម្តងទៀត",                   // 70
      "No matching login attempt found": "គ្មានការផ្គូផ្គងចូលត្រូវបានរកឃើញ",                                           // 71
      "Password is old. Please reset your password.": "ពាក្យសម្ងាត់គឺចាស់,​ សូមកំណត់ពាក្យសម្ងាត់ឡើងវិញ",               // 72
      "Incorrect password": "ពាក្យសម្ងាត់មិនត្រឹមត្រូវ",                                                               // 73
      "Invalid email": "អ៊ីម៉ែលមិនត្រឹមត្រូវ",                                                                         // 74
      "Must be logged in": "ត្រូវតែចូលគណនី",                                                                           // 75
      "Need to set a username or email": "ត្រូវកំណត់ឈ្មោះអ្នកប្រើ​ ឬអ៊ីម៉ែល",                                          // 76
      "old password format": "ទ្រង់ទ្រាយពាក្យសម្ងាត់ចាស់",                                                             // 77
      "Password may not be empty": "ពាក្យសម្ងាត់ប្រហែលជាមិនអាចទទេ",                                                    // 78
      "Signups forbidden": "ការចូលត្រូវបានហាមឃាត់",                                                                    // 79
      "Token expired": "សញ្ញាសម្ងាត់ផុតកំណត់",                                                                         // 80
      "Token has invalid email address": "សញ្ញាសម្ងាត់ដែលមានអាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ",                             // 81
      "User has no password set": "អ្នកប្រើមិនមានសំណុំពាក្យសម្ងាត់",                                                   // 82
      "User not found": "រកមិនឃើញអ្នកប្រើ",                                                                            // 83
      "Verify email link expired": "ផ្ទៀងផ្ទាត់តំណភ្ជាប់អ៊ីម៉ែលផុតកំណត់",                                              // 84
      "Verify email link is for unknown address": "ផ្ទៀងផ្ទាត់តំណភ្ជាប់អ៊ីម៉ែល គឺសម្រាប់អាសយដ្ឋានមិនស្គាល់",           // 85
      "Match failed": "ការផ្ទៀងផ្ទាត់បានបរាជ័យ",                                                                       // 86
      "Unknown error": "មិនស្គាល់កំហុស"                                                                                // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("kh", kh);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ko.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ko;                                                                                                                // 2
                                                                                                                       // 3
ko = {                                                                                                                 // 4
  add: "추가",                                                                                                           // 5
  and: "그리고",                                                                                                          // 6
  back: "뒤로",                                                                                                          // 7
  changePassword: "비밀번호 변경",                                                                                           // 8
  choosePassword: "비밀번호 선택",                                                                                           // 9
  clickAgree: "클릭함으로써 위 약관에 동의합니다",                                                                                    // 10
  configure: "설정",                                                                                                     // 11
  createAccount: "계정 생성",                                                                                              // 12
  currentPassword: "현재 비밀번호",                                                                                          // 13
  dontHaveAnAccount: "계정이 없으세요?",                                                                                      // 14
  email: "이메일",                                                                                                        // 15
  emailAddress: "이메일 주소",                                                                                              // 16
  emailResetLink: "이메일 리셋 링크",                                                                                         // 17
  forgotPassword: "비밀번호를 잊으셨나요?",                                                                                      // 18
  ifYouAlreadyHaveAnAccount: "이미 계정이 있으시면",                                                                            // 19
  newPassword: "새 비밀번호",                                                                                               // 20
  newPasswordAgain: "새 비밀번호(확인)",                                                                                      // 21
  optional: "선택",                                                                                                      // 22
  OR: "혹은",                                                                                                            // 23
  password: "비밀번호",                                                                                                    // 24
  passwordAgain: "비밀번호 (확인)",                                                                                          // 25
  privacyPolicy: "개인정보보호정책",                                                                                           // 26
  remove: "삭제",                                                                                                        // 27
  resetYourPassword: "비밀번호 초기화",                                                                                       // 28
  setPassword: "비밀번호 선택",                                                                                              // 29
  sign: "로그인",                                                                                                         // 30
  signIn: "로그인",                                                                                                       // 31
  signin: "로그인",                                                                                                       // 32
  signOut: "로그아웃",                                                                                                     // 33
  signUp: "회원가입",                                                                                                      // 34
  signupCode: "회원가입 코드",                                                                                               // 35
  signUpWithYourEmailAddress: "이메일로 가입하기",                                                                             // 36
  terms: "약관",                                                                                                         // 37
  updateYourPassword: "비밀번호 업데이트",                                                                                     // 38
  username: "아이디",                                                                                                     // 39
  usernameOrEmail: "아이디 혹은 이메일",                                                                                       // 40
  "with": "와",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "이메일 발송",                                                                                               // 43
    emailVerified: "이메일 인증성공",                                                                                         // 44
    passwordChanged: "비밀번호 변경됨",                                                                                       // 45
    passwordReset: "비밀번호 초기화",                                                                                         // 46
    error: {                                                                                                           // 47
      emailRequired: "이메일이 필요합니다.",                                                                                    // 48
      minChar: "비밀번호는 최소 7자 이상입니다.",                                                                                   // 49
      pwdsDontMatch: "비밀번호가 일치하지 않습니다",                                                                                // 50
      pwOneDigit: "비밀번호에 숫자 하나 이상이 필요합니다.",                                                                            // 51
      pwOneLetter: "비밀번호에 문자 하나 이상이 필요합니다.",                                                                           // 52
      signInRequired: "로그인이 필요한 서비스입니다.",                                                                              // 53
      signupCodeIncorrect: "가입 코드가 맞지 않습니다.",                                                                          // 54
      signupCodeRequired: "가입 코드가 필요합니다.",                                                                             // 55
      usernameIsEmail: "아이디와 이메일은 달라야 합니다.",                                                                           // 56
      usernameRequired: "아이디가 필요합니다.",                                                                                 // 57
      accounts: {                                                                                                      // 58
        "Email already exists.": "중복된 이메일입니다.",                                                                        // 59
        "Email doesn't match the criteria.": "이메일이 요구 조건에 맞지 않습니다.",                                                   // 60
        "Invalid login token": "잘못된 로그인 토큰",                                                                           // 61
        "Login forbidden": "허용되지 않은 로그인",                                                                              // 62
        "Service unknown": "알 수 없는 서비스",                                                                               // 63
        "Unrecognized options for login request": "알 수 없는 로그인 요청 정보입니다",                                               // 64
        "User validation failed": "인증 실패",                                                                             // 65
        "Username already exists.": "중복된 아이디입니다.",                                                                     // 66
        "You are not logged in.": "로그인 상태가 아닙니다.",                                                                     // 67
        "You've been logged out by the server. Please log in again.": "서버에 의해 로그아웃되었습니다. 다시 로그인해주세요.",                 // 68
        "Your session has expired. Please log in again.": "세션이 만료되었습니다. 다시 로그인해주세요.",                                  // 69
        "No matching login attempt found": "해당 로그인 시도를 찾지 못했습니다",                                                      // 70
        "Password is old. Please reset your password.": "오래된 비밀번호입니다. 변경해주세요.",                                        // 71
        "Incorrect password": "잘못된 비밀번호입니다",                                                                           // 72
        "Invalid email": "잘못된 이메일 주소입니다",                                                                              // 73
        "Must be logged in": "로그인이 필요합니다",                                                                             // 74
        "Need to set a username or email": "아이디나 이메일을 입력해주세요",                                                         // 75
        "old password format": "오래된 비밀번호 형식입니다",                                                                       // 76
        "Password may not be empty": "비밀번호를 입력해주세요",                                                                   // 77
        "Signups forbidden": "가입이 거부되었습니다",                                                                            // 78
        "Token expired": "토큰이 만료되었습니다",                                                                                // 79
        "Token has invalid email address": "토큰에 포함된 이메일 주소가 유효하지 않습니다",                                                // 80
        "User has no password set": "설정된 암호가 없습니다",                                                                    // 81
        "User not found": "사용자를 찾을 수 없습니다",                                                                            // 82
        "Verify email link expired": "확인 코드가 만료되었습니다",                                                                 // 83
        "Verify email link is for unknown address": "알 수 없는 인증 메일 주소입니다",                                              // 84
        "Match failed": "매치되지 않습니다",                                                                                   // 85
        "Unknown error": "알 수 없는 오류"                                                                                   // 86
      }                                                                                                                // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("ko", ko);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/nl.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var nl;                                                                                                                // 2
                                                                                                                       // 3
nl = {                                                                                                                 // 4
  add: "toevoegen",                                                                                                    // 5
  and: "en",                                                                                                           // 6
  back: "terug",                                                                                                       // 7
  changePassword: "Wachtwoord wijzigen",                                                                               // 8
  choosePassword: "Wachtwoord kiezen",                                                                                 // 9
  clickAgree: "Door te registreren accepteert u onze",                                                                 // 10
  configure: "Configureer",                                                                                            // 11
  createAccount: "Account aanmaken",                                                                                   // 12
  currentPassword: "Huidig wachtwoord",                                                                                // 13
  dontHaveAnAccount: "Nog geen account?",                                                                              // 14
  email: "E-mail",                                                                                                     // 15
  emailAddress: "E-mailadres",                                                                                         // 16
  emailResetLink: "Verzenden",                                                                                         // 17
  forgotPassword: "Wachtwoord vergeten?",                                                                              // 18
  ifYouAlreadyHaveAnAccount: "Heeft u al een account?",                                                                // 19
  newPassword: "Nieuw wachtwoord",                                                                                     // 20
  newPasswordAgain: "Nieuw wachtwoord (herhalen)",                                                                     // 21
  optional: "Optioneel",                                                                                               // 22
  OR: "OF",                                                                                                            // 23
  password: "Wachtwoord",                                                                                              // 24
  passwordAgain: "Wachtwoord (herhalen)",                                                                              // 25
  privacyPolicy: "privacyverklaring",                                                                                  // 26
  remove: "verwijderen",                                                                                               // 27
  resetYourPassword: "Wachtwoord resetten",                                                                            // 28
  setPassword: "Wachtwoord instellen",                                                                                 // 29
  sign: "Aanmelden",                                                                                                   // 30
  signIn: "Aanmelden",                                                                                                 // 31
  signin: "Aanmelden",                                                                                                 // 32
  signOut: "Afmelden",                                                                                                 // 33
  signUp: "Registreren",                                                                                               // 34
  signupCode: "Registratiecode",                                                                                       // 35
  signUpWithYourEmailAddress: "Met e-mailadres registreren",                                                           // 36
  terms: "gebruiksvoorwaarden",                                                                                        // 37
  updateYourPassword: "Wachtwoord veranderen",                                                                         // 38
  username: "Gebruikersnaam",                                                                                          // 39
  usernameOrEmail: "Gebruikersnaam of e-mailadres",                                                                    // 40
  "with": "met",                                                                                                       // 41
  info: {                                                                                                              // 42
    emailSent: "E-mail verzonden",                                                                                     // 43
    emailVerified: "E-mail geverifieerd",                                                                              // 44
    PasswordChanged: "Wachtwoord gewijzigd",                                                                           // 45
    PasswordReset: "Wachtwoord gereset"                                                                                // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "E-mailadres is verplicht",                                                                         // 49
    minChar: "Wachtwoord moet tenminste 7 tekens lang zijn.",                                                          // 50
    pwdsDontMatch: "Wachtwoorden zijn niet gelijk.",                                                                   // 51
    pwOneDigit: "Wachtwoord moet tenminste 1 cijfer bevatten.",                                                        // 52
    pwOneLetter: "Wachtwoord moet tenminste 1 letter bevatten.",                                                       // 53
    signInRequired: "U moet aangemeld zijn.",                                                                          // 54
    signupCodeIncorrect: "Registratiecode is ongeldig.",                                                               // 55
    signupCodeRequired: "Registratiecode is verplicht.",                                                               // 56
    usernameIsEmail: "Gebruikersnaam is gelijk aan e-mail.",                                                           // 57
    usernameRequired: "Gebruikersnaam is verplicht.",                                                                  // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Dit e-mailadres is al in gebruik.",                                                    // 60
      "Email doesn't match the criteria.": "e-mail voldoet niet aan de voorwaarden.",                                  // 61
      "Invalid login token": "Ongeldig inlogtoken",                                                                    // 62
      "Login forbidden": "Aanmelding geweigerd",                                                                       // 63
      "Service unknown": "Sevice onbekend",                                                                            // 64
      "Unrecognized options for login request": "Onbekende optie voor inlogverzoek",                                   // 65
      "User validation failed": "Gebruikersvalidatie mislukt",                                                         // 66
      "Username already exists.": "Gebruikersnaam bestaat al.",                                                        // 67
      "You are not logged in.": "U bent niet ingelogd.",                                                               // 68
      "You've been logged out by the server. Please log in again.": "U bent door de server afgemeld. Meld a.u.b. opnieuw aan.",
      "Your session has expired. Please log in again.": "Uw sessie is verlopen. Meld a.u.b. opnieuw aan.",             // 70
      "No matching login attempt found": "Geen overeenkomstig inlogverzoek gevonden.",                                 // 71
      "Password is old. Please reset your Password.": "Wachtwoord is verlopen. Reset a.u.b. uw wachtwoord.",           // 72
      "Incorrect password": "Onjuist wachtwoord",                                                                      // 73
      "Invalid email": "Ongeldig e-mailadres",                                                                         // 74
      "Must be logged in": "U moet aangemeld zijn",                                                                    // 75
      "Need to set a username or email": "Gebruikersnaam of e-mailadres moet ingesteld zijn",                          // 76
      "Password may not be empty": "Wachtwoord mag niet leeg zijn",                                                    // 77
      "Signups forbidden": "Registratie verboden",                                                                     // 78
      "Token expired": "Token is verlopen",                                                                            // 79
      "Token has invalid email address": "Token heeft ongeldig e-mailadres",                                           // 80
      "User has no Password set": "Geen wachtwoord ingesteld voor gebruiker",                                          // 81
      "User not found": "Gebruiker niet gevonden",                                                                     // 82
      "Verify email link expired": "Verificatielink is verlopen",                                                      // 83
      "Verify email link is for unknown address": "Verificatielink is voor onbekend e-mailadres",                      // 84
      "Match failed": "Geen match",                                                                                    // 85
      "Unknown error": "Onbekende fout"                                                                                // 86
    }                                                                                                                  // 87
  }                                                                                                                    // 88
};                                                                                                                     // 89
                                                                                                                       // 90
T9n.map("nl", nl);                                                                                                     // 91
                                                                                                                       // 92
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/no_NB.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var no_NB;                                                                                                             // 2
                                                                                                                       // 3
no_NB = {                                                                                                              // 4
  add: "legg til",                                                                                                     // 5
  and: "og",                                                                                                           // 6
  back: "tilbake",                                                                                                     // 7
  changePassword: "Bytt passord",                                                                                      // 8
  choosePassword: "Velg passord",                                                                                      // 9
  clickAgree: "Ved å klikke meld på godtar du vår",                                                                    // 10
  configure: "Konfigurer",                                                                                             // 11
  createAccount: "Oprett konto",                                                                                       // 12
  currentPassword: "Nåværende passord",                                                                                // 13
  dontHaveAnAccount: "Har du ikke en konto?",                                                                          // 14
  email: "E-post",                                                                                                     // 15
  emailAddress: "E-postadresse",                                                                                       // 16
  emailResetLink: "Epost nullstillingslenke",                                                                          // 17
  forgotPassword: "Glemt passord?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Hvis du allerede har en konto",                                                          // 19
  newPassword: "Nytt passord",                                                                                         // 20
  newPasswordAgain: "Gjengi nytt passord",                                                                             // 21
  optional: "Frivillig",                                                                                               // 22
  OR: "eller",                                                                                                         // 23
  password: "Passord",                                                                                                 // 24
  passwordAgain: "Gjengi passord",                                                                                     // 25
  privacyPolicy: "Personvern",                                                                                         // 26
  remove: "fjern",                                                                                                     // 27
  resetYourPassword: "Nullstill passord",                                                                              // 28
  setPassword: "Sett passord",                                                                                         // 29
  sign: "Logg",                                                                                                        // 30
  signIn: "Logg inn",                                                                                                  // 31
  signin: "Logg inn",                                                                                                  // 32
  signOut: "Logg ut",                                                                                                  // 33
  signUp: "Meld på",                                                                                                   // 34
  signupCode: "Påmeldingskode",                                                                                        // 35
  signUpWithYourEmailAddress: "Meld på med din e-postadresse",                                                         // 36
  terms: "Betingelser for bruk",                                                                                       // 37
  updateYourPassword: "Oppdater passord",                                                                              // 38
  username: "Brukernavn",                                                                                              // 39
  usernameOrEmail: "Brukernavn eller e-epost",                                                                         // 40
  "with": "med",                                                                                                       // 41
  info: {                                                                                                              // 42
    emailSent: "E-post sendt",                                                                                         // 43
    emailVerified: "E-post bekreftet",                                                                                 // 44
    passwordChanged: "Passord endret",                                                                                 // 45
    passwordReset: "Passord nullstillt"                                                                                // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "E-post obligatorisk.",                                                                             // 49
    minChar: "Passordet må ha minst 7 tegn.",                                                                          // 50
    pwdsDontMatch: "Passordene er ikke like.",                                                                         // 51
    pwOneDigit: "Passordet må ha minst ett tall.",                                                                     // 52
    pwOneLetter: "Passordet må ha minst en bokstav.",                                                                  // 53
    signInRequired: "Du må være logget inn for å gjøre dette.",                                                        // 54
    signupCodeIncorrect: "Påmelding gikk galt.",                                                                       // 55
    signupCodeRequired: "Påmeldingskode kreves.",                                                                      // 56
    usernameIsEmail: "Brukernavn kan ikke være en e-postadresse.",                                                     // 57
    usernameRequired: "Brukernavn må utfylles.",                                                                       // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "E-postadressen finnes allerede.",                                                      // 60
      "Email doesn't match the criteria.": "E-postadressen møter ikke kriteriet.",                                     // 61
      "Invalid login token": "Ugyldig innloggingstegn",                                                                // 62
      "Login forbidden": "Innlogging forbudt",                                                                         // 63
      "Service unknown": "Ukjent tjeneste",                                                                            // 64
      "Unrecognized options for login request": "Ukjendte valg ved innloggingsforsøk",                                 // 65
      "User validation failed": "Brukergodkjenning gikk galt",                                                         // 66
      "Username already exists.": "Brukernavnet finnes allerede.",                                                     // 67
      "You are not logged in.": "Du er ikke logget inn.",                                                              // 68
      "You've been logged out by the server. Please log in again.": "Tjeneren loggt deg ut. Logg inn på ny.",          // 69
      "Your session has expired. Please log in again.": "Din økt er utløpt. Logg inn på ny.",                          // 70
      "No matching login attempt found": "Fant ingen samsvarende innloggingsførsøk",                                   // 71
      "Password is old. Please reset your password.": "Passordet er for gammelt. Nullstill passordet ditt.",           // 72
      "Incorrect password": "Feil passord",                                                                            // 73
      "Invalid email": "Ugyldig e-postadresse",                                                                        // 74
      "Must be logged in": "Du må være innlogget",                                                                     // 75
      "Need to set a username or email": "Oppgi brukernavn eller e-postadresse",                                       // 76
      "old password format": "gammelt passordformat",                                                                  // 77
      "Password may not be empty": "Passord må være utfyllt",                                                          // 78
      "Signups forbidden": "Påmeldinger ikke tillatt",                                                                 // 79
      "Token expired": "Økten er utløpt",                                                                              // 80
      "Token has invalid email address": "Innloggingstegnet har ugyldig e-postadresse",                                // 81
      "User has no password set": "Brukeren har ikke angitt passord",                                                  // 82
      "User not found": "Bruker ikke funnet",                                                                          // 83
      "Verify email link expired": "Lenke for e-postbekreftelse er utløpt",                                            // 84
      "Verify email link is for unknown address": "Lenke for e-postbekreftelse er for en ukjent adresse",              // 85
      "Match failed": "Ikke samsvar",                                                                                  // 86
      "Unknown error": "Ukjent feil"                                                                                   // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("no_NB", no_NB);                                                                                               // 92
                                                                                                                       // 93
T9n.map("no-NB", no_NB);                                                                                               // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/pl.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pl;                                                                                                                // 2
                                                                                                                       // 3
pl = {                                                                                                                 // 4
  t9Name: 'Polski',                                                                                                    // 5
  add: "dodaj",                                                                                                        // 6
  and: "i",                                                                                                            // 7
  back: "powrót",                                                                                                      // 8
  cancel: "Anuluj",                                                                                                    // 9
  changePassword: "Zmień hasło",                                                                                       // 10
  choosePassword: "Wybierz hasło",                                                                                     // 11
  clickAgree: "Klikając na Zarejestruj się zgadzasz się z naszą",                                                      // 12
  configure: "Konfiguruj",                                                                                             // 13
  createAccount: "Utwórz konto",                                                                                       // 14
  currentPassword: "Aktualne hasło",                                                                                   // 15
  dontHaveAnAccount: "Nie masz konta?",                                                                                // 16
  email: "E-mail",                                                                                                     // 17
  emailAddress: "Adres e-mail",                                                                                        // 18
  emailResetLink: "Wyślij e-mail z linkiem do zmiany hasła",                                                           // 19
  forgotPassword: "Zapomniałeś hasła?",                                                                                // 20
  ifYouAlreadyHaveAnAccount: "Jeżeli już masz konto",                                                                  // 21
  newPassword: "Nowe hasło",                                                                                           // 22
  newPasswordAgain: "Nowe hasło (powtórz)",                                                                            // 23
  optional: "Nieobowiązkowe",                                                                                          // 24
  OR: "LUB",                                                                                                           // 25
  password: "Hasło",                                                                                                   // 26
  passwordAgain: "Hasło (powtórz)",                                                                                    // 27
  privacyPolicy: "polityką prywatności",                                                                               // 28
  remove: "usuń",                                                                                                      // 29
  resetYourPassword: "Ustaw nowe hasło",                                                                               // 30
  setPassword: "Ustaw hasło",                                                                                          // 31
  sign: "Podpisz",                                                                                                     // 32
  signIn: "Zaloguj się",                                                                                               // 33
  signin: "zaloguj się",                                                                                               // 34
  signOut: "Wyloguj się",                                                                                              // 35
  signUp: "Zarejestruj się",                                                                                           // 36
  signupCode: "Kod rejestracji",                                                                                       // 37
  signUpWithYourEmailAddress: "Zarejestruj się używając adresu e-mail",                                                // 38
  terms: "warunkami korzystania z serwisu",                                                                            // 39
  updateYourPassword: "Zaktualizuj swoje hasło",                                                                       // 40
  username: "Nazwa użytkownika",                                                                                       // 41
  usernameOrEmail: "Nazwa użytkownika lub adres e-mail",                                                               // 42
  "with": "z",                                                                                                         // 43
  maxAllowedLength: "Maksymalna dopuszczalna długość",                                                                 // 44
  minRequiredLength: "Minimalna wymagana długość",                                                                     // 45
  resendVerificationEmail: "Wyślij maila ponownie",                                                                    // 46
  resendVerificationEmailLink_pre: "Zgubiłeś mail weryfikacyjny?",                                                     // 47
  resendVerificationEmailLink_link: "Wyślij ponownie",                                                                 // 48
  enterPassword: "Wprowadź hasło",                                                                                     // 49
  enterNewPassword: "Wprowadź nowe hasło",                                                                             // 50
  enterEmail: "Wprowadź adres e-mail",                                                                                 // 51
  enterUsername: "Wprowadź nazwę użytkownika",                                                                         // 52
  enterUsernameOrEmail: "Wprowadź nazwę użytkownika lub adres e-mail",                                                 // 53
  orUse: "Lub użyj",                                                                                                   // 54
  info: {                                                                                                              // 55
    emailSent: "Adres e-mail wysłany",                                                                                 // 56
    emailVerified: "Adres e-mail zweryfikowany",                                                                       // 57
    passwordChanged: "Hasło zmienione",                                                                                // 58
    passwordReset: "Hasło wyzerowane"                                                                                  // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Uwaga',                                                                                                   // 64
      error: 'Błąd',                                                                                                   // 65
      warning: 'Ostrzeżenie'                                                                                           // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "Wymagany jest adres e-mail.",                                                                      // 70
    minChar: "7 znaków to minimalna długość hasła.",                                                                   // 71
    pwdsDontMatch: "Hasła są różne",                                                                                   // 72
    pwOneDigit: "Hasło musi zawierać przynajmniej jedną cyfrę.",                                                       // 73
    pwOneLetter: "Hasło musi zawierać 1 literę.",                                                                      // 74
    signInRequired: "Musisz być zalogowany, aby to zrobić.",                                                           // 75
    signupCodeIncorrect: "Kod rejestracji jest nieprawidłowy.",                                                        // 76
    signupCodeRequired: "Wymagany jest kod rejestracji.",                                                              // 77
    usernameIsEmail: "Adres e-mail nie może być nazwą użytkownika.",                                                   // 78
    usernameRequired: "Wymagana jest nazwa użytkownika.",                                                              // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "Adres e-mail już istnieje.",                                                           // 81
      "Email doesn't match the criteria.": "Adres e-mail nie spełnia kryteriów.",                                      // 82
      "Invalid login token": "Błędny token logowania",                                                                 // 83
      "Login forbidden": "Logowanie zabronione",                                                                       // 84
      "Service unknown": "Nieznana usługa",                                                                            // 85
      "Unrecognized options for login request": "Nieznane parametry w żądaniu logowania",                              // 86
      "User validation failed": "Niepoprawna nazwa użytkownika",                                                       // 87
      "Username already exists.": "Nazwa użytkownika już istnieje.",                                                   // 88
      "You are not logged in.": "Nie jesteś zalogowany.",                                                              // 89
      "You've been logged out by the server. Please log in again.": "Zostałeś wylogowane przez serwer. Zaloguj się ponownie.",
      "Your session has expired. Please log in again.": "Twoja sesja wygasła. Zaloguj się ponownie.",                  // 91
      "Already verified": "Już zweryfikowano",                                                                         // 92
      "Invalid email or username": "Niewłaściwy adress e-mail lub nazwa użytkownika",                                  // 93
      "Internal server error": "Błąd wewnętrzny serwera",                                                              // 94
      "undefined": "Ups, coś poszło nie tak",                                                                          // 95
      "No matching login attempt found": "Nie dopasowano danych logowania",                                            // 96
      "Password is old. Please reset your password.": "Hasło jest stare. Proszę wyzerować hasło.",                     // 97
      "Incorrect password": "Niepoprawne hasło",                                                                       // 98
      "Invalid email": "Błędny adres e-mail",                                                                          // 99
      "Must be logged in": "Musisz być zalogowany",                                                                    // 100
      "Need to set a username or email": "Wymagane ustawienie nazwy użytkownika lub adresu e-mail",                    // 101
      "old password format": "stary format hasła",                                                                     // 102
      "Password may not be empty": "Hasło nie może być puste",                                                         // 103
      "Signups forbidden": "Rejestracja zabroniona",                                                                   // 104
      "Token expired": "Token wygasł",                                                                                 // 105
      "Token has invalid email address": "Token ma niewłaściwy adres e-mail",                                          // 106
      "User has no password set": "Użytkownik nie ma ustawionego hasła",                                               // 107
      "User not found": "Nie znaleziono użytkownika",                                                                  // 108
      "Verify email link expired": "Link weryfikacyjny wygasł",                                                        // 109
      "Verify email link is for unknown address": "Link weryfikacyjny jest dla nieznanego adresu",                     // 110
      "At least 1 digit, 1 lowercase and 1 uppercase": "Przynajmniej jedna cyfra, 1 mała i 1 duża litera",             // 111
      "Please verify your email first. Check the email and follow the link!": "Proszę najpierw zweryfikowac adres e-mail. Sprawdź swojego maila i podążaj za linkiem!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Nowy e-mail został wysłany na twój adres. Jeśli wiadomość nie pojawi się w skrzynce odbiorczej, proszę sprawdzić w folderze ze sapmem.",
      "Match failed": "Błędne dopasowanie",                                                                            // 114
      "Unknown error": "Nieznany błąd",                                                                                // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Błąd, zbyt dużo żądań. Proszę zwolnić. Prosimy odczekać 1 sekundę przed kolejną próbą."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("pl", pl);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/pt.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pt;                                                                                                                // 2
                                                                                                                       // 3
pt = {                                                                                                                 // 4
  t9Name: 'Português',                                                                                                 // 5
  add: "Adicionar",                                                                                                    // 6
  and: "e",                                                                                                            // 7
  back: "Voltar",                                                                                                      // 8
  cancel: "Cancelar",                                                                                                  // 9
  changePassword: "Alterar senha",                                                                                     // 10
  choosePassword: "Escolha uma senha",                                                                                 // 11
  clickAgree: "Ao clicar em Criar Conta, você estará reconhecendo que aceita nossos Termos de Uso",                    // 12
  configure: "Configurar",                                                                                             // 13
  createAccount: "Criar Conta",                                                                                        // 14
  currentPassword: "Senha Atual",                                                                                      // 15
  dontHaveAnAccount: "Não tem conta?",                                                                                 // 16
  email: "E-mail",                                                                                                     // 17
  emailAddress: "Endereço de e-mail",                                                                                  // 18
  emailResetLink: "E-mail com link para gerar Nova Senha",                                                             // 19
  forgotPassword: "Esqueceu sua senha?",                                                                               // 20
  ifYouAlreadyHaveAnAccount: "Se você já tem uma conta",                                                               // 21
  newPassword: "Nova Senha",                                                                                           // 22
  newPasswordAgain: "Nova Senha (novamente)",                                                                          // 23
  optional: "Opcional",                                                                                                // 24
  OR: "OU",                                                                                                            // 25
  password: "Senha",                                                                                                   // 26
  passwordAgain: "Senha (novamente)",                                                                                  // 27
  privacyPolicy: "Política de Privacidade",                                                                            // 28
  remove: "remover",                                                                                                   // 29
  resetYourPassword: "Gerar nova senha",                                                                               // 30
  setPassword: "Cadastrar Senha",                                                                                      // 31
  sign: "Entrar",                                                                                                      // 32
  signIn: "Entrar",                                                                                                    // 33
  signin: "entrar",                                                                                                    // 34
  signOut: "Sair",                                                                                                     // 35
  signUp: "Criar conta",                                                                                               // 36
  signupCode: "Código de Registro",                                                                                    // 37
  signUpWithYourEmailAddress: "Criar conta utilizando seu endereço de e-mail",                                         // 38
  terms: "Termos de Uso",                                                                                              // 39
  updateYourPassword: "Atualizar senha",                                                                               // 40
  username: "Nome de usuário",                                                                                         // 41
  usernameOrEmail: "Usuário ou e-mail",                                                                                // 42
  "with": "com",                                                                                                       // 43
  maxAllowedLength: "Tamanho máximo permitido",                                                                        // 44
  minRequiredLength: "Tamanho Mínimo requerido",                                                                       // 45
  resendVerificationEmail: "Reenviar e-mail de verificação",                                                           // 46
  resendVerificationEmailLink_pre: "Perdeu o e-mail de verificação?",                                                  // 47
  resendVerificationEmailLink_link: "Enviar novamente",                                                                // 48
  enterPassword: "Digite a senha",                                                                                     // 49
  enterNewPassword: "Digite a nova senha",                                                                             // 50
  enterEmail: "Digite o e-mail",                                                                                       // 51
  enterUsername: "Digite o nome de usuário",                                                                           // 52
  enterUsernameOrEmail: "Digite o nome de usuário ou e-mail",                                                          // 53
  orUse: "Ou use",                                                                                                     // 54
  info: {                                                                                                              // 55
    emailSent: "E-mail enviado",                                                                                       // 56
    emailVerified: "E-mail verificado",                                                                                // 57
    passwordChanged: "Senha atualizada",                                                                               // 58
    passwordReset: "Senha alterada"                                                                                    // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Aviso',                                                                                                   // 64
      error: 'Erro',                                                                                                   // 65
      warning: 'Atenção'                                                                                               // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "E-mail é obrigatório.",                                                                            // 70
    minChar: "Senha requer um mínimo de 7 caracteres.",                                                                // 71
    pwdsDontMatch: "Senhas não coincidem",                                                                             // 72
    pwOneDigit: "A Senha deve conter pelo menos um dígito.",                                                           // 73
    pwOneLetter: "A Senha deve conter pelo menos uma letra.",                                                          // 74
    signInRequired: "Você precisa estar logado para fazer isso.",                                                      // 75
    signupCodeIncorrect: "Código de acesso incorreto.",                                                                // 76
    signupCodeRequired: "É necessário um código de acesso.",                                                           // 77
    usernameIsEmail: "Nome de usuário não pode ser um endereço de e-mail.",                                            // 78
    usernameRequired: "Nome de usuário é obrigatório.",                                                                // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "E-mail já existe.",                                                                    // 81
      "Email doesn't match the criteria.": "E-mail inválido.",                                                         // 82
      "Invalid login token": "Token de login inválido",                                                                // 83
      "Login forbidden": "Login não permitido",                                                                        // 84
      "Service unknown": "Serviço desconhecido",                                                                       // 85
      "Unrecognized options for login request": "Opções desconhecidas para solicitação de login",                      // 86
      "User validation failed": "Validação de usuário falhou",                                                         // 87
      "Username already exists.": "Nome de usuário já existe.",                                                        // 88
      "You are not logged in.": "Você não está logado.",                                                               // 89
      "You've been logged out by the server. Please log in again.": "Você foi desconectado pelo servidor. Por favor, efetue login novamente.",
      "Your session has expired. Please log in again.": "Sua sessão expirou. Por favor, efetue login novamente.",      // 91
      "Already verified": "Já verificado",                                                                             // 92
      "Invalid email or username": "Nome de usuário ou e-mail inválido",                                               // 93
      "Internal server error": "Erro interno do servidor",                                                             // 94
      "undefined": "Algo não está certo",                                                                              // 95
      "No matching login attempt found": "Não foi encontrada nenhuma tentativa de login que coincida.",                // 96
      "Password is old. Please reset your password.": "Senha expirou. Por favor, cadastre uma nova senha.",            // 97
      "Incorrect password": "Senha incorreta",                                                                         // 98
      "Invalid email": "E-mail inválido",                                                                              // 99
      "Must be logged in": "É necessário efetuar login",                                                               // 100
      "Need to set a username or email": "É necessário configurar um Nome de Usuário ou E-mail",                       // 101
      "old password format": "Formato de senha antigo",                                                                // 102
      "Password may not be empty": "Senha não pode estar em branco",                                                   // 103
      "Signups forbidden": "Não permitido Criar Conta",                                                                // 104
      "Token expired": "Token expirou",                                                                                // 105
      "Token has invalid email address": "Token tem endereço de e-mail inválido",                                      // 106
      "User has no password set": "Usuário não possui senha cadastrada",                                               // 107
      "User not found": "Usuário não encontrado",                                                                      // 108
      "Verify email link expired": "O link de verificação de e-mail expirou",                                          // 109
      "Verify email link is for unknown address": "O link de verificação de e-mail está configurado para um endereço desconhecido",
      "At least 1 digit, 1 lowercase and 1 uppercase": "Pelo menos 1 número, 1 letra minúscula and 1 maiúscula",       // 111
      "Please verify your email first. Check the email and follow the link!": "Por favor, verifique seu e-mail primeiro. Verifique o e-mail e abra o link!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Um novo e-mail foi enviado para você. Se o e-mail não aparecer na sua caixa de entrada, verifique a sua caixa de spam.",
      "Match failed": "Senhas não coincidem",                                                                          // 114
      "Unknown error": "Erro desconhecido",                                                                            // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Erro, muitas tentativas. Por favor, diminua o ritmo. Você deve aguardar 1 segundo antes de tentar novamente."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("pt", pt);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/pt_PT.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var pt_PT;                                                                                                             // 2
                                                                                                                       // 3
pt_PT = {                                                                                                              // 4
  add: "adicionar",                                                                                                    // 5
  and: "e",                                                                                                            // 6
  back: "voltar",                                                                                                      // 7
  changePassword: "Alterar palavra-passe",                                                                             // 8
  choosePassword: "Escolha uma palavra-passe",                                                                         // 9
  clickAgree: "Ao clicar em Registar, está a aceitar os nossos",                                                       // 10
  configure: "Configurar",                                                                                             // 11
  createAccount: "Criar uma Conta",                                                                                    // 12
  currentPassword: "Palavra-passe Atual",                                                                              // 13
  dontHaveAnAccount: "Não tem conta?",                                                                                 // 14
  email: "E-mail",                                                                                                     // 15
  emailAddress: "Endereço de e-mail",                                                                                  // 16
  emailResetLink: "Enviar e-mail para redefinir a palavra-passe",                                                      // 17
  forgotPassword: "Esqueci-me da palavra-passe",                                                                       // 18
  ifYouAlreadyHaveAnAccount: "Se já tem uma conta",                                                                    // 19
  newPassword: "Nova Palavra-passe",                                                                                   // 20
  newPasswordAgain: "Nova Palavra-passe (novamente)",                                                                  // 21
  optional: "Opcional",                                                                                                // 22
  OR: "OU",                                                                                                            // 23
  password: "Palavra-passe",                                                                                           // 24
  passwordAgain: "Palavra-passe (novamente)",                                                                          // 25
  privacyPolicy: "Política de Privacidade",                                                                            // 26
  remove: "remover",                                                                                                   // 27
  resetYourPassword: "Redefinir a palavra-passe",                                                                      // 28
  setPassword: "Definir Palavra-passe",                                                                                // 29
  sign: "Iniciar",                                                                                                     // 30
  signIn: "Iniciar Sessão",                                                                                            // 31
  signin: "iniciar sessão",                                                                                            // 32
  signOut: "Sair",                                                                                                     // 33
  signUp: "Criar conta",                                                                                               // 34
  signupCode: "Código de Registo",                                                                                     // 35
  signUpWithYourEmailAddress: "Registar com o endereço de e-mail",                                                     // 36
  terms: "Termos de Uso",                                                                                              // 37
  updateYourPassword: "Alterar a palavra-passe",                                                                       // 38
  username: "Nome do ulilizador",                                                                                      // 39
  usernameOrEmail: "Ulilizador ou e-mail",                                                                             // 40
  "with": "com",                                                                                                       // 41
  info: {                                                                                                              // 42
    emailSent: "E-mail enviado",                                                                                       // 43
    emailVerified: "E-mail verificado",                                                                                // 44
    passwordChanged: "Palavra-passe alterada",                                                                         // 45
    passwordReset: "Palavra-passe redefinida"                                                                          // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "O e-mail é obrigatório.",                                                                          // 49
    minChar: "A palavra-passe tem de ter no mínimo 7 caracteres.",                                                     // 50
    pwdsDontMatch: "As palavra-passes não coincidem",                                                                  // 51
    pwOneDigit: "A palavra-passe tem de conter pelo menos um dígito.",                                                 // 52
    pwOneLetter: "A palavra-passe tem de conter pelo menos uma letra.",                                                // 53
    signInRequired: "É necessário iniciar sessão para fazer isso.",                                                    // 54
    signupCodeIncorrect: "Código de registo incorreto.",                                                               // 55
    signupCodeRequired: "É necessário um código de registo.",                                                          // 56
    usernameIsEmail: "O nome do utilizador não pode ser um endereço de e-mail.",                                       // 57
    usernameRequired: "O nome de usuário é obrigatório.",                                                              // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "O e-mail já existe.",                                                                  // 60
      "Email doesn't match the criteria.": "E-mail inválido.",                                                         // 61
      "Invalid login token": "Token de início de sessão inválido",                                                     // 62
      "Login forbidden": "Início de sessão impedido",                                                                  // 63
      "Service unknown": "Serviço desconhecido",                                                                       // 64
      "Unrecognized options for login request": "Pedido de início de sessão com opções não reconhecidas",              // 65
      "User validation failed": "A validação do utilizador falhou",                                                    // 66
      "Username already exists.": "O nome do utilizador já existe.",                                                   // 67
      "You are not logged in.": "Não tem sessão iniciada.",                                                            // 68
      "You've been logged out by the server. Please log in again.": "Sessão terminada pelo servidor. Por favor, inicie sessão novamente.",
      "Your session has expired. Please log in again.": "A sua sessão expirou. Por favor, inicie sessão novamente.",   // 70
      "No matching login attempt found": "Não foi encontrada nenhuma tentativa de início de sessão que coincida.",     // 71
      "Password is old. Please reset your password.": "A palavra-passe é antiga. Por favor, redefina a sua palavra-passe.",
      "Incorrect password": "Palavra-passe incorreta",                                                                 // 73
      "Invalid email": "E-mail inválido",                                                                              // 74
      "Must be logged in": "É necessário iniciar sessão",                                                              // 75
      "Need to set a username or email": "É necessário definir um nome de utilizador ou e-mail",                       // 76
      "old password format": "Formato de palavra-passe antigo",                                                        // 77
      "Password may not be empty": "A palavra-passe não pode estar em branco",                                         // 78
      "Signups forbidden": "Criação de contas proibida",                                                               // 79
      "Token expired": "O token expirou",                                                                              // 80
      "Token has invalid email address": "O token tem um endereço de e-mail inválido",                                 // 81
      "User has no password set": "O utilizador não defeniu a palavra-passe",                                          // 82
      "User not found": "Utilizador não encontrado",                                                                   // 83
      "Verify email link expired": "O link de verificação de e-mail expirou",                                          // 84
      "Verify email link is for unknown address": "O link de verificação de e-mail está definido para um endereço desconhecido",
      "Match failed": "Comparação falhou",                                                                             // 86
      "Unknown error": "Erro desconhecido"                                                                             // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("pt_PT", pt_PT);                                                                                               // 92
                                                                                                                       // 93
T9n.map("pt-PT", pt_PT);                                                                                               // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ro.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ro;                                                                                                                // 2
                                                                                                                       // 3
ro = {                                                                                                                 // 4
  add: "adaugă",                                                                                                       // 5
  and: "și",                                                                                                           // 6
  back: "înapoi",                                                                                                      // 7
  changePassword: "Schimbare parolă",                                                                                  // 8
  choosePassword: "Alege o parolă",                                                                                    // 9
  clickAgree: "Click pe Register, sunteți de acord",                                                                   // 10
  configure: "Configurare",                                                                                            // 11
  createAccount: "Creați un cont",                                                                                     // 12
  currentPassword: "Parola curentă",                                                                                   // 13
  dontHaveAnAccount: "Nu ai un cont?",                                                                                 // 14
  email: "E-mail",                                                                                                     // 15
  emailAddress: "Adresa de e-mail",                                                                                    // 16
  emailResetLink: "Link de resetare parolă",                                                                           // 17
  forgotPassword: "Ți-ai uitat parola?",                                                                               // 18
  ifYouAlreadyHaveAnAccount: "Dacă ai deja un cont",                                                                   // 19
  newPassword: "Parolă nouă",                                                                                          // 20
  newPasswordAgain: "Parolă nouă (din nou)",                                                                           // 21
  optional: "Opțional",                                                                                                // 22
  OR: "SAU",                                                                                                           // 23
  password: "Parolă",                                                                                                  // 24
  passwordAgain: "Parolă (din nou)",                                                                                   // 25
  privacyPolicy: "Politica de confidentialitate",                                                                      // 26
  remove: "Elimină",                                                                                                   // 27
  resetYourPassword: "Schimbati parola",                                                                               // 28
  setPassword: "Setati parola",                                                                                        // 29
  sign: "Înregistrează",                                                                                               // 30
  signIn: "Autentificare",                                                                                             // 31
  signin: "Autentificare",                                                                                             // 32
  signOut: "Deconectare",                                                                                              // 33
  signUp: "Înregistrare",                                                                                              // 34
  signupCode: "Codul de înregistrare",                                                                                 // 35
  signUpWithYourEmailAddress: "Înregistrați-vă adresa de e-mail",                                                      // 36
  terms: "Condiții de utilizare",                                                                                      // 37
  updateYourPassword: "Actualizați parola dvs.",                                                                       // 38
  username: "Nume utilizator",                                                                                         // 39
  usernameOrEmail: "Nume utilizator sau e-mail",                                                                       // 40
  "with": "cu",                                                                                                        // 41
  info: {                                                                                                              // 42
    emailSent: "Email trimis",                                                                                         // 43
    emailVerified: "Email verificat",                                                                                  // 44
    passwordChanged: "Parola a fost schimbata",                                                                        // 45
    passwordReset: "Resetare parola"                                                                                   // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Introduceti Email-ul.",                                                                            // 49
    minChar: "Parolă minima de 7 caractere ",                                                                          // 50
    pwdsDontMatch: "Parolele nu se potrivesc",                                                                         // 51
    pwOneDigit: "Parola trebuie să contină cel puțin o cifră.",                                                        // 52
    pwOneLetter: "Parola necesită o scrisoare.",                                                                       // 53
    signInRequired: "Autentificare.",                                                                                  // 54
    signupCodeIncorrect: "Codul de înregistrare este incorectă.",                                                      // 55
    signupCodeRequired: "Aveti nevoie de cod de înregistrare.",                                                        // 56
    usernameIsEmail: "Numele de utilizator nu poate fi o adresă de e-mail.",                                           // 57
    usernameRequired: "Introduceti numele de utilizator.",                                                             // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "E-mail există deja.",                                                                  // 60
      "Email doesn't match the criteria.": "E-mail nu se potrivește cu criteriile.",                                   // 61
      "Invalid login token": "Token invalid",                                                                          // 62
      "Login forbidden": "Autentificare interzisă",                                                                    // 63
      "Service unknown": "Service necunoscut",                                                                         // 64
      "Unrecognized options for login request": "Opțiuni nerecunoscute de cerere de conectare",                        // 65
      "User validation failed": "Validare utilizator nereușit",                                                        // 66
      "Username already exists.": "Numele de utilizator existent.",                                                    // 67
      "You are not logged in.": "Nu sunteti autentificat.",                                                            // 68
      "You've been logged out by the server. Please log in again.": "Ați fost deconectat de către server rugam sa va logati din nou.",
      "Your session has expired. Please log in again.": "Sesiunea a expirat rugam sa va logati din nou.",              // 70
      "No matching login attempt found": "Autentificare nereusită",                                                    // 71
      "Password is old. Please reset your password.": "Parola expirata, Vă rugăm să resetati parola.",                 // 72
      "Incorrect password": "Parola incorectă",                                                                        // 73
      "Invalid email": "E-mail invalid",                                                                               // 74
      "Must be logged in": "Trebuie sa fii logat",                                                                     // 75
      "Need to set a username or email": "Adaugati un nume utilizator sau un e-mail",                                  // 76
      "old password format": "Parola cu format vechi",                                                                 // 77
      "Password may not be empty": "Parola nu poate fi gol",                                                           // 78
      "Signups forbidden": "Înscrieri interzisă",                                                                      // 79
      "Token expired": "Token expirat",                                                                                // 80
      "Token has invalid email address": "Token are adresă de email invalidă",                                         // 81
      "User has no password set": "Utilizator nu are parola setată",                                                   // 82
      "User not found": "Utilizator nu a fost găsit",                                                                  // 83
      "Verify email link expired": "Link-ul de e-mail a expirat",                                                      // 84
      "Verify email link is for unknown address": "Link-ul de e-mail nu corespunde",                                   // 85
      "Match failed": "Potrivire nereușită",                                                                           // 86
      "Unknown error": "Eroare necunoscută"                                                                            // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("ro", ro);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/ru.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var ru;                                                                                                                // 2
                                                                                                                       // 3
ru = {                                                                                                                 // 4
  add: "добавить",                                                                                                     // 5
  and: "и",                                                                                                            // 6
  back: "назад",                                                                                                       // 7
  changePassword: "Сменить пароль",                                                                                    // 8
  choosePassword: "Придумайте пароль",                                                                                 // 9
  clickAgree: "Нажав на Регистрация, вы соглашаетесь с условиями",                                                     // 10
  configure: "Конфигурировать",                                                                                        // 11
  createAccount: "Создать аккаунт",                                                                                    // 12
  currentPassword: "Текущий пароль",                                                                                   // 13
  dontHaveAnAccount: "Нет аккаунта?",                                                                                  // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Email",                                                                                               // 16
  emailResetLink: "Отправить ссылку для сброса",                                                                       // 17
  forgotPassword: "Забыли пароль?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Если у вас уже есть аккаунт",                                                            // 19
  newPassword: "Новый пароль",                                                                                         // 20
  newPasswordAgain: "Новый пароль (еще раз)",                                                                          // 21
  optional: "Необязательно",                                                                                           // 22
  OR: "ИЛИ",                                                                                                           // 23
  password: "Пароль",                                                                                                  // 24
  passwordAgain: "Пароль (еще раз)",                                                                                   // 25
  privacyPolicy: "Политики безопасности",                                                                              // 26
  remove: "Удалить",                                                                                                   // 27
  resetYourPassword: "Сбросить пароль",                                                                                // 28
  setPassword: "Установить пароль",                                                                                    // 29
  sign: "Подпись",                                                                                                     // 30
  signIn: "Войти",                                                                                                     // 31
  signin: "войти",                                                                                                     // 32
  signOut: "Выйти",                                                                                                    // 33
  signUp: "Регистрация",                                                                                               // 34
  signupCode: "Регистрационный код",                                                                                   // 35
  signUpWithYourEmailAddress: "Зарегистрируйтесь с вашим email адресом",                                               // 36
  terms: "Условиями пользования",                                                                                      // 37
  updateYourPassword: "Обновить пароль",                                                                               // 38
  username: "Имя пользователя",                                                                                        // 39
  usernameOrEmail: "Имя пользователя или email",                                                                       // 40
  "with": "через",                                                                                                     // 41
  info: {                                                                                                              // 42
    emailSent: "Email отправлен",                                                                                      // 43
    emailVerified: "Email прошел проверку",                                                                            // 44
    passwordChanged: "Пароль изменен",                                                                                 // 45
    passwordReset: "Пароль сброшен"                                                                                    // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email обязательно.",                                                                               // 49
    minChar: "Минимальное кол-во символов для пароля 7.",                                                              // 50
    pwdsDontMatch: "Пароли не совпадают",                                                                              // 51
    pwOneDigit: "В пароле должна быть хотя бы одна цифра.",                                                            // 52
    pwOneLetter: "В пароле должна быть хотя бы одна буква.",                                                           // 53
    signInRequired: "Необходимо войти для чтобы продолжить.",                                                          // 54
    signupCodeIncorrect: "Неправильный регистрационный код.",                                                          // 55
    signupCodeRequired: "Необходим регистрационый код.",                                                               // 56
    usernameIsEmail: "Имя пользователя не может быть адресом email.",                                                  // 57
    usernameRequired: "Имя пользователя обязательно.",                                                                 // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Email уже существует",                                                                 // 60
      "Email doesn't match the criteria.": "Email не соответствует критериям.",                                        // 61
      "Invalid login token": "Неверный токен для входа",                                                               // 62
      "Login forbidden": "Вход запрещен",                                                                              // 63
      "Service unknown": "Cервис неизвестен",                                                                          // 64
      "Unrecognized options for login request": "Неизвестные параметры для запроса входа",                             // 65
      "User validation failed": "Проверка пользователя неудалась",                                                     // 66
      "Username already exists.": "Пользователь существует.",                                                          // 67
      "You are not logged in.": "Вы не вошли.",                                                                        // 68
      "You've been logged out by the server. Please log in again.": "Сервер инициировал выход. Пожалуйста войдите еще раз.",
      "Your session has expired. Please log in again.": "Ваша сессия устарела. Пожалуйста войдите еще раз.",           // 70
      "No matching login attempt found": "Не было найдено соответствующей попытки войти",                              // 71
      "Password is old. Please reset your password.": "Пароль устарел. Пожалуйста, сбросьте Ваш пароль.",              // 72
      "Incorrect password": "Неправильный пароль",                                                                     // 73
      "Invalid email": "Несуществующий Email",                                                                         // 74
      "Must be logged in": "Необходимо войти",                                                                         // 75
      "Need to set a username or email": "Необходимо имя пользователя или email",                                      // 76
      "old password format": "старый формат пароля",                                                                   // 77
      "Password may not be empty": "Пароль не может быть пустым",                                                      // 78
      "Signups forbidden": "Регистрация отключена",                                                                    // 79
      "Token expired": "Время действия токена истекло",                                                                // 80
      "Token has invalid email address": "У токена неправильный email адрес",                                          // 81
      "User has no password set": "У пользователя не установлен пароль",                                               // 82
      "User not found": "Пользователь не найден",                                                                      // 83
      "Verify email link expired": "Ссылка подтверждения email устарела",                                              // 84
      "Verify email link is for unknown address": "Ссылка подтверждения email для неизвестного адреса",                // 85
      "Match failed": "Не совпадают",                                                                                  // 86
      "Unknown error": "Неизвестная ошибка"                                                                            // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("ru", ru);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/sk.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var sk;                                                                                                                // 2
                                                                                                                       // 3
sk = {                                                                                                                 // 4
  add: "pridať",                                                                                                       // 5
  and: "a",                                                                                                            // 6
  back: "späť",                                                                                                        // 7
  changePassword: "Zmena hesla",                                                                                       // 8
  choosePassword: "Zvoľte si heslo",                                                                                   // 9
  clickAgree: "Stlačením tlačidla \"Registrovať\" akceptujete",                                                        // 10
  configure: "Nastaviť",                                                                                               // 11
  createAccount: "Vytvoriť konto",                                                                                     // 12
  currentPassword: "Súčasné heslo",                                                                                    // 13
  dontHaveAnAccount: "Nemáte účet?",                                                                                   // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Emailová adresa",                                                                                     // 16
  emailResetLink: "Odoslať na email overovací odkaz",                                                                  // 17
  forgotPassword: "Zabudli ste heslo?",                                                                                // 18
  ifYouAlreadyHaveAnAccount: "Ak už máte vytvorený účet prejdite na",                                                  // 19
  newPassword: "Nové heslo",                                                                                           // 20
  newPasswordAgain: "Nové heslo (opakujte)",                                                                           // 21
  optional: "Voliteľné",                                                                                               // 22
  OR: "alebo",                                                                                                         // 23
  password: "Heslo",                                                                                                   // 24
  passwordAgain: "Heslo (opakujte)",                                                                                   // 25
  privacyPolicy: "pravidlá ochrany súkromia",                                                                          // 26
  remove: "odstrániť",                                                                                                 // 27
  resetYourPassword: "Obnovenie hesla",                                                                                // 28
  setPassword: "Nastaviť heslo",                                                                                       // 29
  sign: "Prihlásiť",                                                                                                   // 30
  signIn: "Prihlásenie",                                                                                               // 31
  signin: "prihlásenie",                                                                                               // 32
  signOut: "Odhlásiť",                                                                                                 // 33
  signUp: "Registrovať",                                                                                               // 34
  signupCode: "Registračný kód",                                                                                       // 35
  signUpWithYourEmailAddress: "Registrácia pomocou emailovej adresy",                                                  // 36
  terms: "pravidlá požívania",                                                                                         // 37
  updateYourPassword: "Aktualizovať heslo",                                                                            // 38
  username: "Užívateľské meno",                                                                                        // 39
  usernameOrEmail: "Užívateľské meno alebo email",                                                                     // 40
  "with": "s",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "Email odoslaný",                                                                                       // 43
    emailVerified: "Email bol overený",                                                                                // 44
    passwordChanged: "Heslo bolo zmenené",                                                                             // 45
    passwordReset: "Obnova hesla"                                                                                      // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email je vyžadovaný.",                                                                             // 49
    minChar: "minimálne 7 znakov heslo.",                                                                              // 50
    pwdsDontMatch: "Heslá sa nezhodujú",                                                                               // 51
    pwOneDigit: "Heslo musí mať aspoň jeden znak.",                                                                    // 52
    pwOneLetter: "Heslo musí mať aspoň 1 znak..",                                                                      // 53
    signInRequired: "Je vyžadované prihlásenie na túto akciu.",                                                        // 54
    signupCodeIncorrect: "Registračný kód je nesprávny.",                                                              // 55
    signupCodeRequired: "Je vyžadovaný registračný kód.",                                                              // 56
    usernameIsEmail: "Užvateľské meno nemôže byť email.",                                                              // 57
    usernameRequired: "Je vyžadované užívateľské meno.",                                                               // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Email už bol registrovaný.",                                                           // 60
      "Email doesn't match the criteria.": "Email nevyhovuje kritériam.",                                              // 61
      "Invalid login token": "Neplatný token prihlásenia",                                                             // 62
      "Login forbidden": "Prihlásenie neuspešné",                                                                      // 63
      "Service unknown": "Neznáma služba",                                                                             // 64
      "Unrecognized options for login request": "Neroznali sa podmienky pre požiadavku prihlásenia",                   // 65
      "User validation failed": "Overenie užívateľa zlyhalo",                                                          // 66
      "Username already exists.": "Užívateľ už existuje.",                                                             // 67
      "You are not logged in.": "Vyžaduje sa prihlásenie.",                                                            // 68
      "You've been logged out by the server. Please log in again.": "Boli ste odhlásený/á zo servera. Prosím prihláste sa znova.",
      "Your session has expired. Please log in again.": "Vaše príhlásenie expirovalo. Prosím prihláste sa znova.",     // 70
      "No matching login attempt found": "Prihlásenie nesúhlasí",                                                      // 71
      "Password is old. Please reset your password.": "Heslo je zastaralé. Prosím obnovte si ho.",                     // 72
      "Incorrect password": "Nesprávne heslo",                                                                         // 73
      "Invalid email": "Nesprávaný email",                                                                             // 74
      "Must be logged in": "Je vyžadované prihlásenie",                                                                // 75
      "Need to set a username or email": "Je potrebné nastaviť užívateľské meno a email",                              // 76
      "old password format": "formát starého hesla",                                                                   // 77
      "Password may not be empty": "Heslo nesmie byť prázdne",                                                         // 78
      "Signups forbidden": "Prihlásenie je zakázané",                                                                  // 79
      "Token expired": "Token expiroval",                                                                              // 80
      "Token has invalid email address": "Token obsahuje nesprávnu emailovú adresu",                                   // 81
      "User has no password set": "Užívateľ nemá nastavené heslo",                                                     // 82
      "User not found": "Užívateľ sa nenašiel",                                                                        // 83
      "Verify email link expired": "Odkazu pre overenie emailu vypršala platnosť.",                                    // 84
      "Verify email link is for unknown address": "Overovací odkaz je z nenámej adresy",                               // 85
      "Match failed": "Nezhodné",                                                                                      // 86
      "Unknown error": "Neznáma chyba"                                                                                 // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("sk", sk);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/sl.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var sl;                                                                                                                // 2
                                                                                                                       // 3
sl = {                                                                                                                 // 4
  add: "dodaj",                                                                                                        // 5
  and: "in",                                                                                                           // 6
  back: "nazaj",                                                                                                       // 7
  changePassword: "Spremeni geslo",                                                                                    // 8
  choosePassword: "Izberi geslo",                                                                                      // 9
  clickAgree: "S klikom na Registracija se strinjaš",                                                                  // 10
  configure: "Nastavi",                                                                                                // 11
  createAccount: "Nova registracija",                                                                                  // 12
  currentPassword: "Trenutno geslo",                                                                                   // 13
  dontHaveAnAccount: "Nisi registriran(a)?",                                                                           // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Email naslov",                                                                                        // 16
  emailResetLink: "Pošlji ponastavitveno povezavo",                                                                    // 17
  forgotPassword: "Pozabljeno geslo?",                                                                                 // 18
  ifYouAlreadyHaveAnAccount: "Če si že registriran(a),",                                                               // 19
  newPassword: "Novo geslo",                                                                                           // 20
  newPasswordAgain: "Novo geslo (ponovno)",                                                                            // 21
  optional: "Po želji",                                                                                                // 22
  OR: "ALI",                                                                                                           // 23
  password: "Geslo",                                                                                                   // 24
  passwordAgain: "Geslo (ponovno)",                                                                                    // 25
  privacyPolicy: "z našimi pogoji uporabe",                                                                            // 26
  remove: "briši",                                                                                                     // 27
  resetYourPassword: "Ponastavi geslo",                                                                                // 28
  setPassword: "Nastavi geslo",                                                                                        // 29
  sign: "Prijava",                                                                                                     // 30
  signIn: "Prijava",                                                                                                   // 31
  signin: "se prijavi",                                                                                                // 32
  signOut: "Odjava",                                                                                                   // 33
  signUp: "Registracija",                                                                                              // 34
  signupCode: "Prijavna koda",                                                                                         // 35
  signUpWithYourEmailAddress: "Prijava z email naslovom",                                                              // 36
  terms: "Pogoji uporabe",                                                                                             // 37
  updateYourPassword: "Spremeni geslo",                                                                                // 38
  username: "Uporabniško ime",                                                                                         // 39
  usernameOrEmail: "Uporabniško ime ali email",                                                                        // 40
  "with": "z",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "E-pošta poslana",                                                                                      // 43
    emailVerified: "Email naslov preverjen",                                                                           // 44
    passwordChanged: "Geslo spremenjeno",                                                                              // 45
    passwordReset: "Geslo ponastavljeno"                                                                               // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email je obvezen vnos.",                                                                           // 49
    minChar: "Geslo mora imeti vsaj sedem znakov.",                                                                    // 50
    pwdsDontMatch: "Gesli se ne ujemata",                                                                              // 51
    pwOneDigit: "V geslu mora biti vsaj ena številka.",                                                                // 52
    pwOneLetter: "V geslu mora biti vsaj ena črka.",                                                                   // 53
    signInRequired: "Za to moraš biti prijavljen(a).",                                                                 // 54
    signupCodeIncorrect: "Prijavna koda je napačna.",                                                                  // 55
    signupCodeRequired: "Prijavna koda je obvezen vnos.",                                                              // 56
    usernameIsEmail: "Uporabniško ime ne more biti email naslov.",                                                     // 57
    usernameRequired: "Uporabniško ime je obvezen vnos.",                                                              // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Email že obstaja.",                                                                    // 60
      "Email doesn't match the criteria.": "Email ne odgovarja kriterijem.",                                           // 61
      "Invalid login token": "Napačen prijavni žeton",                                                                 // 62
      "Login forbidden": "Prijava ni dovoljena",                                                                       // 63
      "Service unknown": "Neznana storitev",                                                                           // 64
      "Unrecognized options for login request": "Neznane možnosti v prijavnem zahtevku",                               // 65
      "User validation failed": "Preverjanje uporabnika neuspešno",                                                    // 66
      "Username already exists.": "Uporabniško ime že obstaja",                                                        // 67
      "You are not logged in.": "Nisi prijavljen(a).",                                                                 // 68
      "You've been logged out by the server. Please log in again.": "Odjavljen(a) si s strežnika. Ponovi prijavo.",    // 69
      "Your session has expired. Please log in again.": "Seja je potekla. Ponovi prijavo.",                            // 70
      "No matching login attempt found": "Prijava ne obstaja",                                                         // 71
      "Password is old. Please reset your password.": "Geslo je staro. Zamenjaj ga.",                                  // 72
      "Incorrect password": "Napačno geslo",                                                                           // 73
      "Invalid email": "Napačen email",                                                                                // 74
      "Must be logged in": "Moraš biti prijavljane(a)",                                                                // 75
      "Need to set a username or email": "Prijava ali email sta obvezna",                                              // 76
      "old password format": "stara oblika gesla",                                                                     // 77
      "Password may not be empty": "Geslo ne sme biti prazno",                                                         // 78
      "Signups forbidden": "Prijave onemogočene",                                                                      // 79
      "Token expired": "Žeton je potekel",                                                                             // 80
      "Token has invalid email address": "Žeton vsebuje napačen email",                                                // 81
      "User has no password set": "Uporabnik nima gesla",                                                              // 82
      "User not found": "Uporabnik ne obstaja",                                                                        // 83
      "Verify email link expired": "Povezava za potrditev je potekla",                                                 // 84
      "Verify email link is for unknown address": "Povezava za potrditev vsebuje neznan naslov",                       // 85
      "Match failed": "Prijava neuspešna",                                                                             // 86
      "Unknown error": "Neznana napaka"                                                                                // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("sl", sl);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/sv.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var sv;                                                                                                                // 2
                                                                                                                       // 3
sv = {                                                                                                                 // 4
  add: "lägg till",                                                                                                    // 5
  and: "och",                                                                                                          // 6
  back: "tillbaka",                                                                                                    // 7
  cancel: "Avbryt",                                                                                                    // 8
  changePassword: "Ändra lösenord",                                                                                    // 9
  choosePassword: "Välj lösenord",                                                                                     // 10
  clickAgree: "När du väljer att bli medlem så godkänner du också vår",                                                // 11
  configure: "Konfigurera",                                                                                            // 12
  createAccount: "Skapa ett konto",                                                                                    // 13
  currentPassword: "Nuvarande lösenord",                                                                               // 14
  dontHaveAnAccount: "Har du inget konto?",                                                                            // 15
  email: "E-postadress",                                                                                               // 16
  emailAddress: "E-postadress",                                                                                        // 17
  emailResetLink: "Återställningslänk för e-post",                                                                     // 18
  forgotPassword: "Glömt ditt lösenord?",                                                                              // 19
  ifYouAlreadyHaveAnAccount: "Är du redan medlem?",                                                                    // 20
  newPassword: "Nytt lösenord",                                                                                        // 21
  newPasswordAgain: "Nytt lösenord (upprepa)",                                                                         // 22
  optional: "Valfri",                                                                                                  // 23
  OR: "ELLER",                                                                                                         // 24
  password: "Lösenord",                                                                                                // 25
  passwordAgain: "Lösenord (upprepa)",                                                                                 // 26
  privacyPolicy: "integritetspolicy",                                                                                  // 27
  remove: "ta bort",                                                                                                   // 28
  resetYourPassword: "Återställ ditt lösenord",                                                                        // 29
  setPassword: "Välj lösenord",                                                                                        // 30
  sign: "Logga",                                                                                                       // 31
  signIn: "Logga in",                                                                                                  // 32
  signin: "logga in",                                                                                                  // 33
  signOut: "Logga ut",                                                                                                 // 34
  signUp: "Bli medlem",                                                                                                // 35
  signupCode: "Registreringskod",                                                                                      // 36
  signUpWithYourEmailAddress: "Bli medlem med e-postadress",                                                           // 37
  terms: "användarvillkor",                                                                                            // 38
  updateYourPassword: "Uppdatera ditt lösenord",                                                                       // 39
  username: "Användarnamn",                                                                                            // 40
  usernameOrEmail: "Användarnamn eller e-postadress",                                                                  // 41
  "with": "med",                                                                                                       // 42
  enterPassword: "Lösenord",                                                                                           // 43
  enterNewPassword: "Nytt lösenord",                                                                                   // 44
  enterEmail: "E-post",                                                                                                // 45
  enterUsername: "Användarnamn",                                                                                       // 46
  enterUsernameOrEmail: "Användarnamn eller e-post",                                                                   // 47
  orUse: "Eller använd",                                                                                               // 48
  info: {                                                                                                              // 49
    emailSent: "E-post skickades",                                                                                     // 50
    emailVerified: "E-post verifierades",                                                                              // 51
    passwordChanged: "Lösenordet har ändrats",                                                                         // 52
    passwordReset: "Återställ lösenordet"                                                                              // 53
  },                                                                                                                   // 54
  alert: {                                                                                                             // 55
    ok: 'Ok',                                                                                                          // 56
    type: {                                                                                                            // 57
      info: 'Info',                                                                                                    // 58
      error: 'Fel',                                                                                                    // 59
      warning: 'Varning'                                                                                               // 60
    }                                                                                                                  // 61
  },                                                                                                                   // 62
  error: {                                                                                                             // 63
    emailRequired: "Det krävs en e-postaddress.",                                                                      // 64
    minChar: "Det krävs minst 7 tecken i ditt lösenord.",                                                              // 65
    pwdsDontMatch: "Lösenorden matchar inte.",                                                                         // 66
    pwOneDigit: "Lösenordet måste ha minst 1 siffra.",                                                                 // 67
    pwOneLetter: "Lösenordet måste ha minst 1 bokstav.",                                                               // 68
    signInRequired: "Inloggning krävs här.",                                                                           // 69
    signupCodeIncorrect: "Registreringskoden är felaktig.",                                                            // 70
    signupCodeRequired: "Det krävs en registreringskod.",                                                              // 71
    usernameIsEmail: "Användarnamnet kan inte vara en e-postadress.",                                                  // 72
    usernameRequired: "Det krävs ett användarnamn.",                                                                   // 73
    accounts: {                                                                                                        // 74
      "Email already exists.": "E-postadressen finns redan.",                                                          // 75
      "Email doesn't match the criteria.": "E-postadressen uppfyller inte kriterierna.",                               // 76
      "Invalid login token": "Felaktig login-token",                                                                   // 77
      "Login forbidden": "Inloggning tillåts ej",                                                                      // 78
      "Service unknown": "Okänd service",                                                                              // 79
      "Unrecognized options for login request": "Okända val för inloggningsförsöket",                                  // 80
      "User validation failed": "Validering av användare misslyckades",                                                // 81
      "Username already exists.": "Användarnamn finns redan.",                                                         // 82
      "You are not logged in.": "Du är inte inloggad.",                                                                // 83
      "You've been logged out by the server. Please log in again.": "Du har loggats ut av servern. Vänligen logga in igen.",
      "Your session has expired. Please log in again.": "Din session har gått ut. Vänligen ligga in igen.",            // 85
      "Invalid email or username": "Ogiltig e-post eller användarnamn",                                                // 86
      "Internal server error": "Internt server problem",                                                               // 87
      "undefined": "Något gick fel",                                                                                   // 88
      "No matching login attempt found": "Inget matchande loginförsök kunde hittas",                                   // 89
      "Password is old. Please reset your password.": "Ditt lösenord är gammalt. Vänligen återställ ditt lösenord.",   // 90
      "Incorrect password": "Felaktigt lösenord",                                                                      // 91
      "Invalid email": "Ogiltig e-postadress",                                                                         // 92
      "Must be logged in": "Måste vara inloggad",                                                                      // 93
      "Need to set a username or email": "Ett användarnamn eller en e-postadress krävs.",                              // 94
      "old password format": "gammalt lösenordsformat",                                                                // 95
      "Password may not be empty": "Lösenordet får inte vara tomt",                                                    // 96
      "Signups forbidden": "Registrering förbjuden",                                                                   // 97
      "Token expired": "Token har gått ut",                                                                            // 98
      "Token has invalid email address": "Token har ogiltig e-postadress",                                             // 99
      "User has no password set": "Användaren har inget lösenord",                                                     // 100
      "User not found": "Användaren hittades inte",                                                                    // 101
      "Verify email link expired": "Länken för att verifera e-postadress har gått ut",                                 // 102
      "Verify email link is for unknown address": "Länken för att verifiera e-postadress är för en okänd adress.",     // 103
      "Match failed": "Matchning misslyckades",                                                                        // 104
      "Unknown error": "Okänt fel"                                                                                     // 105
    }                                                                                                                  // 106
  }                                                                                                                    // 107
};                                                                                                                     // 108
                                                                                                                       // 109
T9n.map("sv", sv);                                                                                                     // 110
                                                                                                                       // 111
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/th.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var th;                                                                                                                // 2
                                                                                                                       // 3
th = {                                                                                                                 // 4
  t9Name: 'Thai',                                                                                                      // 5
  add: "เพิ่ม",                                                                                                        // 6
  and: "และ",                                                                                                          // 7
  back: "ย้อนกลับ",                                                                                                    // 8
  cancel: "ยกเลิก",                                                                                                    // 9
  changePassword: "เปลี่ยนรหัสผ่าน",                                                                                   // 10
  choosePassword: "เลือกรหัสผ่าน",                                                                                     // 11
  clickAgree: "ด้วยการคลิกสมัครและยอมรับ",                                                                             // 12
  configure: "กำหนดค่า",                                                                                               // 13
  createAccount: "สร้างบัญชี",                                                                                         // 14
  currentPassword: "รหัสปัจจุบัน",                                                                                     // 15
  dontHaveAnAccount: "ยังไม่มีบัญชีใช่ไหม",                                                                            // 16
  email: "อีเมล์",                                                                                                     // 17
  emailAddress: "ที่อยู่อีเมล์",                                                                                       // 18
  emailResetLink: "อีเมล์สำหรับรหัสใหม่",                                                                              // 19
  forgotPassword: "คุณลืมรหัสใช่ไหม",                                                                                  // 20
  ifYouAlreadyHaveAnAccount: "ถ้าคุณมีบัญชีแล้ว",                                                                      // 21
  newPassword: "รหัสใหม่",                                                                                             // 22
  newPasswordAgain: "รหัสใหม่ (อีกครั้ง)",                                                                             // 23
  optional: "ไม่จำเป็น",                                                                                               // 24
  OR: "หรือ",                                                                                                          // 25
  password: "รหัสผ่าน",                                                                                                // 26
  passwordAgain: "รหัสผ่าน (อีกครั้ง)",                                                                                // 27
  privacyPolicy: "นโยบายความเป็นส่วนตัว",                                                                              // 28
  remove: "ลบ",                                                                                                        // 29
  resetYourPassword: "ตั้งรหัสผ่านใหม่",                                                                               // 30
  setPassword: "ตั้งรหัสผ่าน",                                                                                         // 31
  sign: "สัญลักษณ์",                                                                                                   // 32
  signIn: "เข้าสู่ระบบ",                                                                                               // 33
  signin: "เข้าสู่ระบบ",                                                                                               // 34
  signOut: "ออกจากระบบ",                                                                                               // 35
  signUp: "สมัคร",                                                                                                     // 36
  signupCode: "รหัสการลงทะเบียน",                                                                                      // 37
  signUpWithYourEmailAddress: "สมัครด้วยอีเมล์",                                                                       // 38
  terms: "ข้อกำหนดใช้งาน",                                                                                             // 39
  updateYourPassword: "แก้ไขรหัสของคุณ",                                                                               // 40
  username: "ชื่อผู้ใช้งาน",                                                                                           // 41
  usernameOrEmail: "ชื่อผู้ใช้งานหรืออีเมล์",                                                                          // 42
  "with": "กับ",                                                                                                       // 43
  maxAllowedLength: "ความยาวสูงสุดที่อนุญาต",                                                                          // 44
  minRequiredLength: "ความยาวต่ำสุดที่อนุญาต",                                                                         // 45
  resendVerificationEmail: "ส่งอีเมล์อีกครั้ง",                                                                        // 46
  resendVerificationEmailLink_pre: "อีเมล์ยืนยัน",                                                                     // 47
  resendVerificationEmailLink_link: "ส่งอีกครั้ง",                                                                     // 48
  enterPassword: "ป้อนรหัสผ่าน",                                                                                       // 49
  enterNewPassword: "ป้อนรหัสผ่านใหม่",                                                                                // 50
  enterEmail: "ป้อนอีเมล์",                                                                                            // 51
  enterUsername: "ป้อนชื่อผู้ใช้งาน",                                                                                  // 52
  enterUsernameOrEmail: "ป้อนชื่อผู้ใช้งานหรืออีเมล์",                                                                 // 53
  orUse: "หรือใช้",                                                                                                    // 54
  info: {                                                                                                              // 55
    emailSent: "ส่งอีเมล์",                                                                                            // 56
    emailVerified: "ตรวจสอบอีเมล์",                                                                                    // 57
    passwordChanged: "รหัสผ่านเปลี่ยนแล้ว",                                                                            // 58
    passwordReset: "ตั้งค่ารหัสผ่าน"                                                                                   // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'ตกลง',                                                                                                        // 62
    type: {                                                                                                            // 63
      info: 'แจ้งให้ทราบ',                                                                                             // 64
      error: 'ผิดพลาด',                                                                                                // 65
      warning: 'เตือน'                                                                                                 // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "ต้องกรอกอีเมล์",                                                                                   // 70
    minChar: "รหัสผ่านต้องมีอย่างน้อย 7 ตัวอักษร",                                                                     // 71
    pwdsDontMatch: "รหัสผ่านไม่ตรงกัน",                                                                                // 72
    pwOneDigit: "รหัสผ่านต้องมีอย่างน้อยหนึ่งหลัก",                                                                    // 73
    pwOneLetter: "รหัสผ่านต้องมีตัวอักษร 1 ตัว",                                                                       // 74
    signInRequired: "คุณต้องลงนามในการกระทำว่า",                                                                       // 75
    signupCodeIncorrect: "รหัสการลงทะเบียนไม่ถูกต้อง",                                                                 // 76
    signupCodeRequired: "ต้องการรหัสลงทะเบียน",                                                                        // 77
    usernameIsEmail: "ชื่อผู้ใช้งานไม่สามารถเป็นที่อยู่อีเมล์",                                                        // 78
    usernameRequired: "ต้องการชื่อผู้ใช้งาน",                                                                          // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "อีเมล์มีอยู่แล้ว",                                                                     // 81
      "Email doesn't match the criteria.": "รูปแบบอีเมล์ไม่ถูกต้อง",                                                   // 82
      "Invalid login token": "หลักฐานการเข้าสู่ระบบไม่ถูกต้อง",                                                        // 83
      "Login forbidden": "ไม่อนุญาตให้เข้าสู่ระบบ",                                                                    // 84
      "Service unknown": "บริการที่ไม่รู้จัก",                                                                         // 85
      "Unrecognized options for login request": "ตัวเลือกที่ไม่รู้จักสำหรับคำขอเข้าสู่ระบบ",                           // 86
      "User validation failed": "การตรวจสอบผู้ใช้ล้มเหลว",                                                             // 87
      "Username already exists.": "ชื่อผู้ใช้มีอยู่แล้ว",                                                              // 88
      "You are not logged in.": "คุณยังไม่ได้เข้าสู่ระบบ",                                                             // 89
      "You've been logged out by the server. Please log in again.": "คุณได้ออกจากระบบโดยเซิร์ฟเวอร์ กรุณาเข้าสู่ระบบอีกครั้ง",
      "Your session has expired. Please log in again.": "session ของคุณหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง",              // 91
      "Already verified": "ยืนยันแล้ว",                                                                                // 92
      "Invalid email or username": "อีเมลหรือชื่อผู้ใช้ไม่ถูกต้อง",                                                    // 93
      "Internal server error": "ข้อผิดพลาดภายในเซิร์ฟเวอร์",                                                           // 94
      "undefined": "มีบางอย่างผิดพลาด",                                                                                // 95
      "No matching login attempt found": "ไม่พบการเข้าสู่ระบบ",                                                        // 96
      "Password is old. Please reset your password.": "รหัสผ่านเก่า โปรดตั้งค่ารหัสผ่านของคุณใหม่",                    // 97
      "Incorrect password": "รหัสผ่านผิดพลาด",                                                                         // 98
      "Invalid email": "อีเมล์ผิดพลาด",                                                                                // 99
      "Must be logged in": "ต้องเข้าสู่ระบบ",                                                                          // 100
      "Need to set a username or email": "จำเป็นที่จะต้องตั้งชื่อผู้ใช้หรืออีเมล์",                                    // 101
      "old password format": "รูปแบบรหัสผ่านเดิม",                                                                     // 102
      "Password may not be empty": "รหัสผ่านไม่เป็นค่าว่าง",                                                           // 103
      "Signups forbidden": "ไม่อนุญาตให้สมัคร",                                                                        // 104
      "Token expired": "Token หมดอายุ",                                                                                // 105
      "Token has invalid email address": "Token มีที่อยู่อีเมลไม่ถูกต้อง",                                             // 106
      "User has no password set": "ผู้ใช้ยังไม่มีการตั้งรหัสผ่าน",                                                     // 107
      "User not found": "ไม่พบชื่อผู้ใช้",                                                                             // 108
      "Verify email link expired": "ตรวจสอบการลิงค์อีเมลหมดอายุ",                                                      // 109
      "Verify email link is for unknown address": "ไม่รู้จักลิงค์ตรวจสอบอีเมล์",                                       // 110
      "At least 1 digit, 1 lowercase and 1 uppercase": "อย่างน้อย 1 หลัก 1 ตัวอักษรเล็ก และ 1 ตัวอักษรใหญ่",           // 111
      "Please verify your email first. Check the email and follow the link!": "โปรดยืนยันอีเมลของคุณก่อน ตรวจสอบอีเมลและทำตามลิงค์!",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "อีเมลใหม่ได้ถูกส่งไปให้คุณแล้ว ถ้าอีเมลไม่แสดงในกล่องจดหมายของคุณให้ตรวจสอบโฟลเดอร์ spam ของคุณ",
      "Match failed": "จับคู่ล้มเหลว",                                                                                 // 114
      "Unknown error": "ไม่รู้ข้อผิดพลาด",                                                                             // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "ผิดพลาด ตอนนี้มีการร้องขอมากเกินไปโปรดรอ 1 วินาทีก่อนค่อยทำอีกครั้ง"
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("th", th);                                                                                                     // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/tr.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var tr;                                                                                                                // 2
                                                                                                                       // 3
tr = {                                                                                                                 // 4
  add: "ekle",                                                                                                         // 5
  and: "ve",                                                                                                           // 6
  back: "geri",                                                                                                        // 7
  changePassword: "Şifre Değiştir",                                                                                    // 8
  choosePassword: "Şifre Belirle",                                                                                     // 9
  clickAgree: "Kayıta tıklayarak kabul etmiş olacağınız",                                                              // 10
  configure: "Yapılandır",                                                                                             // 11
  createAccount: "Hesap Oluştur",                                                                                      // 12
  currentPassword: "Mevcut Şifre",                                                                                     // 13
  dontHaveAnAccount: "Hesabın yok mu?",                                                                                // 14
  email: "Eposta",                                                                                                     // 15
  emailAddress: "Eposta Adresi",                                                                                       // 16
  emailResetLink: "Email Reset Link",                                                                                  // 17
  forgotPassword: "Şifreni mi unuttun?",                                                                               // 18
  ifYouAlreadyHaveAnAccount: "Zaten bir hesabın varsa",                                                                // 19
  newPassword: "Yeni Şifre",                                                                                           // 20
  newPasswordAgain: "Yeni Şifre (tekrar)",                                                                             // 21
  optional: "İsteğe Bağlı",                                                                                            // 22
  OR: "VEYA",                                                                                                          // 23
  password: "Şifre",                                                                                                   // 24
  passwordAgain: "Şifre (tekrar)",                                                                                     // 25
  privacyPolicy: "Gizlilik Politikası",                                                                                // 26
  remove: "kaldır",                                                                                                    // 27
  resetYourPassword: "Şifreni sıfırla",                                                                                // 28
  setPassword: "Şifre Belirle",                                                                                        // 29
  sign: "Giriş",                                                                                                       // 30
  signIn: "Giriş",                                                                                                     // 31
  signin: "Giriş",                                                                                                     // 32
  signOut: "Çıkış",                                                                                                    // 33
  signUp: "Kayıt",                                                                                                     // 34
  signupCode: "Kayıt Kodu",                                                                                            // 35
  signUpWithYourEmailAddress: "Eposta adresin ile kaydol",                                                             // 36
  terms: "Kullanım Şartları",                                                                                          // 37
  updateYourPassword: "Şifreni güncelle",                                                                              // 38
  username: "Kullanıcı adı",                                                                                           // 39
  usernameOrEmail: "Kullanıcı adı veya şifre",                                                                         // 40
  "with": "için",                                                                                                      // 41
  info: {                                                                                                              // 42
    emailSent: "Eposta iletildi",                                                                                      // 43
    emailVerified: "Eposta doğrulandı",                                                                                // 44
    passwordChanged: "Şifre değişti",                                                                                  // 45
    passwordReset: "Şifre sıfırlandı"                                                                                  // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Eposta gerekli.",                                                                                  // 49
    minChar: "En az 7 karakterli şifre.",                                                                              // 50
    pwdsDontMatch: "Şifreler uyuşmuyor",                                                                               // 51
    pwOneDigit: "Şifre en az bir rakam içermeli.",                                                                     // 52
    pwOneLetter: "Şifre bir harf gerektiriyor.",                                                                       // 53
    signInRequired: "Bunun için önce giriş yapmış olmalısın.",                                                         // 54
    signupCodeIncorrect: "Kayıt kodu hatalı.",                                                                         // 55
    signupCodeRequired: "Kayıt kodu gerekli.",                                                                         // 56
    usernameIsEmail: "Kullanıcı adı bir eposta adresi olamaz.",                                                        // 57
    usernameRequired: "Kullanıcı adı gerekli.",                                                                        // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Eposta zaten kayıtlı.",                                                                // 60
      "Email doesn't match the criteria.": "Eposta kriterleri karşılamıyor.",                                          // 61
      "Invalid login token": "Geçersiz giriş işaretçisi",                                                              // 62
      "Login forbidden": "Girişe izin verilmiyor",                                                                     // 63
      "Service unknown": "Servis tanınmıyor",                                                                          // 64
      "Unrecognized options for login request": "Giriş isteği için tanınmayan seçenekler",                             // 65
      "User validation failed": "Kullanıcı doğrulama başarısız",                                                       // 66
      "Username already exists.": "Kullanıcı adı zaten kayıtlı.",                                                      // 67
      "You are not logged in.": "Kullanıcı girişi yapmadın.",                                                          // 68
      "You've been logged out by the server. Please log in again.": "Sunucu tarafından çıkarıldın. Lütfen tekrar kullanıcı girişi yap.",
      "Your session has expired. Please log in again.": "Oturumun zaman aşımına uğradı. Lütfen tekrar kullanıcı girişi yap.",
      "No matching login attempt found": "Eşleşen bir giriş teşebbüsü bulunamadı",                                     // 71
      "Password is old. Please reset your password.": "Şifre eski. Lütfen şifreni sıfırla.",                           // 72
      "Incorrect password": "Hatalı şifre",                                                                            // 73
      "Invalid email": "Hatalı eposta",                                                                                // 74
      "Must be logged in": "Giriş yapmış olmalısın",                                                                   // 75
      "Need to set a username or email": "Kullanıcı adı veya eposta tanımlamalısın",                                   // 76
      "old password format": "eski şifre biçimi",                                                                      // 77
      "Password may not be empty": "Şifre boş bırakılamaz",                                                            // 78
      "Signups forbidden": "Kayıt yapmaya izin verilmiyor",                                                            // 79
      "Token expired": "İşaretçinin süresi geçti",                                                                     // 80
      "Token has invalid email address": "İşaretçide geçersiz eposta adresi var",                                      // 81
      "User has no password set": "Kullanıcının şifresi tanımlanmamış",                                                // 82
      "User not found": "Kullanıcı bulunamadı",                                                                        // 83
      "Verify email link expired": "Eposta doğrulama bağlantısı zaman aşımına uğradı",                                 // 84
      "Verify email link is for unknown address": "Eposta doğrulama bağlantısı bilinmeyen bir adres içeriyor",         // 85
      "Match failed": "Eşleşme başarısız",                                                                             // 86
      "Unknown error": "Bilinmeyen hata"                                                                               // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("tr", tr);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/uk.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var uk;                                                                                                                // 2
                                                                                                                       // 3
uk = {                                                                                                                 // 4
  add: "додати",                                                                                                       // 5
  and: "та",                                                                                                           // 6
  back: "назад",                                                                                                       // 7
  changePassword: "Змінити пароль",                                                                                    // 8
  choosePassword: "Придумайте пароль",                                                                                 // 9
  clickAgree: "Натиснувши на Реєстрація ви погоджуєтеся з умовами",                                                    // 10
  configure: "Налаштувати",                                                                                            // 11
  createAccount: "Створити аккаунт",                                                                                   // 12
  currentPassword: "Діючий пароль",                                                                                    // 13
  dontHaveAnAccount: "Немає аккаунта?",                                                                                // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Email",                                                                                               // 16
  emailResetLink: "Отримати посилання для оновлення паролю",                                                           // 17
  forgotPassword: "Забули пароль?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Якщо у вас вже є аккаунт:",                                                              // 19
  newPassword: "Новий пароль",                                                                                         // 20
  newPasswordAgain: "Новий пароль (ще раз)",                                                                           // 21
  optional: "Необов’язково",                                                                                           // 22
  OR: "АБО",                                                                                                           // 23
  password: "Пароль",                                                                                                  // 24
  passwordAgain: "Пароль (ще раз)",                                                                                    // 25
  privacyPolicy: "Політики безпеки",                                                                                   // 26
  remove: "Видалити",                                                                                                  // 27
  resetYourPassword: "Відновити пароль",                                                                               // 28
  setPassword: "Встановити пароль",                                                                                    // 29
  sign: "Підпис",                                                                                                      // 30
  signIn: "Увійти",                                                                                                    // 31
  signin: "увійти",                                                                                                    // 32
  signOut: "Вийти",                                                                                                    // 33
  signUp: "Зареєструватися",                                                                                           // 34
  signupCode: "Реєстраційний код",                                                                                     // 35
  signUpWithYourEmailAddress: "Зареєструйтесь з вашою email адресою",                                                  // 36
  terms: "Умовами користування",                                                                                       // 37
  updateYourPassword: "Оновити пароль",                                                                                // 38
  username: "Ім’я користувача",                                                                                        // 39
  usernameOrEmail: "Ім’я користувача або email",                                                                       // 40
  "with": "з",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "Email відправлено",                                                                                    // 43
    emailVerified: "Email пройшов перевірку",                                                                          // 44
    passwordChanged: "Пароль змінено",                                                                                 // 45
    passwordReset: "Пароль скинуто"                                                                                    // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email є обов’язковим.",                                                                            // 49
    minChar: "Мінімальна кіл-ть символів для паролю 7.",                                                               // 50
    pwdsDontMatch: "Паролі не співпадають",                                                                            // 51
    pwOneDigit: "Пароль повинен містити хоча б одну цифру.",                                                           // 52
    pwOneLetter: "Пароль повинен містити хоча б одну букву.",                                                          // 53
    signInRequired: "Для продовження необхідно увійти.",                                                               // 54
    signupCodeIncorrect: "Невірний реєстраційний код.",                                                                // 55
    signupCodeRequired: "Необхідний реєстраційний код.",                                                               // 56
    usernameIsEmail: "Ім’я користувача не може бути email адресою.",                                                   // 57
    usernameRequired: "Ім’я користувача є обов’язковим.",                                                              // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "Email вже існує",                                                                      // 60
      "Email doesn't match the criteria.": "Email відповідає критеріям.",                                              // 61
      "Invalid login token": "Невірний токен для входу",                                                               // 62
      "Login forbidden": "Вхід заборонено",                                                                            // 63
      "Service unknown": "Невідомий сервіс",                                                                           // 64
      "Unrecognized options for login request": "Невідомі параметри для запиту входу",                                 // 65
      "User validation failed": "Перевірка користувача не вдалася",                                                    // 66
      "Username already exists.": "Користувач існує.",                                                                 // 67
      "You are not logged in.": "Ви не ввійшли.",                                                                      // 68
      "You've been logged out by the server. Please log in again.": "Сервер ініціював вихід. Будь ласка увійдіть ще раз.",
      "Your session has expired. Please log in again.": "Ваша сесія застаріла. Будь ласка увійдіть ще раз.",           // 70
      "No matching login attempt found": "Не було знайдено відповідної спроби увійти",                                 // 71
      "Password is old. Please reset your password.": "Пароль застарів. Будь ласка, скиньте Ваш пароль.",              // 72
      "Incorrect password": "Невірний пароль",                                                                         // 73
      "Invalid email": "Неіснуючий Email",                                                                             // 74
      "Must be logged in": "Необхідно увійти",                                                                         // 75
      "Need to set a username or email": "Необхідно ім’я користувача або email",                                       // 76
      "old password format": "старий формат паролю",                                                                   // 77
      "Password may not be empty": "Пароль не може бути пустим",                                                       // 78
      "Signups forbidden": "Реєстрацію відключено",                                                                    // 79
      "Token expired": "Час дії токена вичерпано",                                                                     // 80
      "Token has invalid email address": "Невірна email адреса для токена",                                            // 81
      "User has no password set": "У користувача не встановлено пароль",                                               // 82
      "User not found": "Користувач не знайдений",                                                                     // 83
      "Verify email link expired": "Посилання підтвердження email застаріло",                                          // 84
      "Verify email link is for unknown address": "Посилання підтвердження email для невідомої адреси",                // 85
      "Match failed": "Не співпадають",                                                                                // 86
      "Unknown error": "Невідома помилка"                                                                              // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("uk", uk);                                                                                                     // 92
                                                                                                                       // 93
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/vi.coffee.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var vi;                                                                                                                // 2
                                                                                                                       // 3
vi = {                                                                                                                 // 4
  add: "thêm",                                                                                                         // 5
  and: "và",                                                                                                           // 6
  back: "trở lại",                                                                                                     // 7
  changePassword: "Đổi mật khẩu",                                                                                      // 8
  choosePassword: "Chọn một mật khẩu",                                                                                 // 9
  clickAgree: "Bằng cách nhấn vào Đăng ký, bạn đã đồng ý với",                                                         // 10
  configure: "Cấu hình",                                                                                               // 11
  createAccount: "Tạo Tài khoản",                                                                                      // 12
  currentPassword: "Mật khẩu hiện tại",                                                                                // 13
  dontHaveAnAccount: "Chưa có tài khoản?",                                                                             // 14
  email: "Email",                                                                                                      // 15
  emailAddress: "Địa chỉ Email",                                                                                       // 16
  emailResetLink: "Gửi",                                                                                               // 17
  forgotPassword: "Quên mật khẩu?",                                                                                    // 18
  ifYouAlreadyHaveAnAccount: "Nếu bạn đã có tài khoản",                                                                // 19
  newPassword: "Mật khẩu mới",                                                                                         // 20
  newPasswordAgain: "Mật khẩu mới (nhập lại)",                                                                         // 21
  optional: "Tùy chọn",                                                                                                // 22
  OR: "Hoặc",                                                                                                          // 23
  password: "Mật khẩu",                                                                                                // 24
  passwordAgain: "Mật khẩu (nhập lại)",                                                                                // 25
  privacyPolicy: "Chính sách bảo mật",                                                                                 // 26
  remove: "xóa",                                                                                                       // 27
  resetYourPassword: "Lấy lại mật khẩu",                                                                               // 28
  setPassword: "Thiết lập mật khẩu",                                                                                   // 29
  sign: "Ký",                                                                                                          // 30
  signIn: "Đăng nhập",                                                                                                 // 31
  signin: "đăng nhập",                                                                                                 // 32
  signOut: "Đăng xuất",                                                                                                // 33
  signUp: "Đăng ký",                                                                                                   // 34
  signupCode: "Mã đăng ký",                                                                                            // 35
  signUpWithYourEmailAddress: "Đăng ký với email của bạn",                                                             // 36
  terms: "Điều khoản sử dụng",                                                                                         // 37
  updateYourPassword: "Cập nhật mật khẩu",                                                                             // 38
  username: "Tên đăng nhập",                                                                                           // 39
  usernameOrEmail: "Tên đăng nhập hoặc email",                                                                         // 40
  "with": "với",                                                                                                       // 41
  info: {                                                                                                              // 42
    emailSent: "Email đã được gửi đi!",                                                                                // 43
    emailVerified: "Email đã được xác minh",                                                                           // 44
    passwordChanged: "Đã đổi mật khẩu",                                                                                // 45
    passwordReset: "Lất lại mật khẩu"                                                                                  // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "Email phải có.",                                                                                   // 49
    minChar: "Mật khẩu phải có ít nhất 7 ký tự.",                                                                      // 50
    pwdsDontMatch: "Mật khẩu không giống nhau",                                                                        // 51
    pwOneDigit: "Mật khẩu phải có ít nhất 1 chữ số.",                                                                  // 52
    pwOneLetter: "Mật khẩu phải có 1 ký tự chữ.",                                                                      // 53
    signInRequired: "Phải đăng nhập.",                                                                                 // 54
    signupCodeIncorrect: "Mã số đăng ký sai.",                                                                         // 55
    signupCodeRequired: "Phải có mã số đăng ký.",                                                                      // 56
    usernameIsEmail: "Tên đăng nhập không thể là địa chỉ email.",                                                      // 57
    usernameRequired: "Phải có tên đăng nhập.",                                                                        // 58
    accounts: {                                                                                                        // 59
      "A login handler should return a result or undefined": "Bộ xử lý đăng nhập phải trả về một kết quả hoặc undefined",
      "Email already exists.": "Email đã tồn tại.",                                                                    // 61
      "Email doesn't match the criteria.": "Email không phù hợp.",                                                     // 62
      "Invalid login token": "Mã đăng nhập không đúng",                                                                // 63
      "Login forbidden": "Đăng nhập bị cấm",                                                                           // 64
      "Service unknown": "Chưa biết Dịch vụ",                                                                          // 65
      "Unrecognized options for login request": "Tùy chọn không được công nhận đối với yêu cầu đăng nhập",             // 66
      "User validation failed": "Xác nhận người dùng thất bại",                                                        // 67
      "Username already exists.": "Tên đăng nhập đã tồn tại.",                                                         // 68
      "You are not logged in.": "Bạn chưa đăng nhập.",                                                                 // 69
      "You've been logged out by the server. Please log in again.": "Bạn đã bị đăng xuất bởi máy chủ. Vui lòng đăng nhập lại.",
      "Your session has expired. Please log in again.": "Thời gian đăng nhập đã hết. Vui lòng đăng nhập lại.",         // 71
      "No matching login attempt found": "Không tìm thấy đăng nhập phù hợp",                                           // 72
      "Password is old. Please reset your password.": "Mật khẩu đã cũ. Vui lòng lấy lại mật khẩu.",                    // 73
      "Incorrect password": "Mật khẩu sai",                                                                            // 74
      "Invalid email": "Email sai",                                                                                    // 75
      "Must be logged in": "Phải đăng nhập",                                                                           // 76
      "Need to set a username or email": "Phải điền tên đăng nhập hoặc email",                                         // 77
      "old password format": "định dạng mật khẩu cũ",                                                                  // 78
      "Password may not be empty": "mật khẩu không được để trống",                                                     // 79
      "Signups forbidden": "Đăng ký đã bị cấm",                                                                        // 80
      "Token expired": "Hết phiên đăng nhập",                                                                          // 81
      "Token has invalid email address": "Phiên đăng nhập chứa địa chỉ email sai",                                     // 82
      "User has no password set": "Người dùng chưa có mật khẩu",                                                       // 83
      "User not found": "Không tìm thấy người dùng",                                                                   // 84
      "Verify email link expired": "Đường dẫn xác nhận email đã hết hạn",                                              // 85
      "Verify email link is for unknown address": "Đường dẫn xác nhận email là cho địa chỉ chưa xác định",             // 86
      "Match failed": "Không đúng",                                                                                    // 87
      "Unknown error": "Lỗi chưa được biết"                                                                            // 88
    }                                                                                                                  // 89
  }                                                                                                                    // 90
};                                                                                                                     // 91
                                                                                                                       // 92
T9n.map("vi", vi);                                                                                                     // 93
                                                                                                                       // 94
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/zh_CN.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var zh_CN;                                                                                                             // 2
                                                                                                                       // 3
zh_CN = {                                                                                                              // 4
  add: "添加",                                                                                                           // 5
  and: "和",                                                                                                            // 6
  back: "返回",                                                                                                          // 7
  cancel: "取消",                                                                                                        // 8
  changePassword: "修改密码",                                                                                              // 9
  choosePassword: "新密码",                                                                                               // 10
  clickAgree: "点击注册表示您同意",                                                                                             // 11
  configure: "配置",                                                                                                     // 12
  createAccount: "创建账户",                                                                                               // 13
  currentPassword: "当前密码",                                                                                             // 14
  dontHaveAnAccount: "没有账户？",                                                                                          // 15
  email: "电子邮箱",                                                                                                       // 16
  emailAddress: "电邮地址",                                                                                                // 17
  emailResetLink: "邮件重置链接",                                                                                            // 18
  forgotPassword: "忘记密码？",                                                                                             // 19
  ifYouAlreadyHaveAnAccount: "如果您已有账户",                                                                                // 20
  newPassword: "新密码",                                                                                                  // 21
  newPasswordAgain: "再输一遍新密码",                                                                                         // 22
  optional: "可选的",                                                                                                     // 23
  OR: "或",                                                                                                             // 24
  password: "密码",                                                                                                      // 25
  passwordAgain: "再输一遍密码",                                                                                             // 26
  privacyPolicy: "隐私条例",                                                                                               // 27
  remove: "移除",                                                                                                        // 28
  resetYourPassword: "重置您的密码",                                                                                         // 29
  setPassword: "设置密码",                                                                                                 // 30
  sign: "登",                                                                                                           // 31
  signIn: "登录",                                                                                                        // 32
  signin: "登录",                                                                                                        // 33
  signOut: "登出",                                                                                                       // 34
  signUp: "注册",                                                                                                        // 35
  signupCode: "注册码",                                                                                                   // 36
  signUpWithYourEmailAddress: "用您的电子邮件地址注册",                                                                           // 37
  terms: "使用条例",                                                                                                       // 38
  updateYourPassword: "更新您的密码",                                                                                        // 39
  username: "用户名",                                                                                                     // 40
  usernameOrEmail: "用户名或电子邮箱",                                                                                         // 41
  "with": "与",                                                                                                         // 42
  enterPassword: "输入密码",                                                                                               // 43
  enterNewPassword: "输入新密码",                                                                                           // 44
  enterEmail: "输入电子邮件",                                                                                                // 45
  enterUsername: "输入用户名",                                                                                              // 46
  enterUsernameOrEmail: "输入用户名或电子邮件",                                                                                  // 47
  orUse: "或是使用",                                                                                                       // 48
  info: {                                                                                                              // 49
    emailSent: "邮件已发出",                                                                                                // 50
    emailVerified: "邮件验证成功",                                                                                           // 51
    passwordChanged: "密码修改成功",                                                                                         // 52
    passwordReset: "密码重置成功"                                                                                            // 53
  },                                                                                                                   // 54
  error: {                                                                                                             // 55
    emailRequired: "必须填写电子邮件",                                                                                         // 56
    minChar: "密码至少7个字符长",                                                                                              // 57
    pwdsDontMatch: "两次密码不一致",                                                                                          // 58
    pwOneDigit: "密码中至少有一位数字",                                                                                          // 59
    pwOneLetter: "密码中至少有一位字母",                                                                                         // 60
    signInRequired: "您必须登录后才能查看",                                                                                      // 61
    signupCodeIncorrect: "注册码错误",                                                                                      // 62
    signupCodeRequired: "必须有注册码",                                                                                      // 63
    usernameIsEmail: "是用户名而不是电子邮件地址",                                                                                  // 64
    usernameRequired: "必须填写用户名。",                                                                                      // 65
    accounts: {                                                                                                        // 66
      "Email already exists.": "该电子邮件地址已被使用。",                                                                         // 67
      "Email doesn't match the criteria.": "错误的的电子邮件地址。",                                                              // 68
      "Invalid login token": "登录密匙错误",                                                                                 // 69
      "Login forbidden": "登录被阻止",                                                                                      // 70
      "Service unknown": "未知服务",                                                                                       // 71
      "Unrecognized options for login request": "登录请求存在无法识别的选项",                                                       // 72
      "User validation failed": "用户验证失败",                                                                              // 73
      "Username already exists.": "用户名已被占用。",                                                                          // 74
      "You are not logged in.": "您还没有登录。",                                                                             // 75
      "You've been logged out by the server. Please log in again.": "您被服务器登出了。请重新登录。",                                 // 76
      "Your session has expired. Please log in again.": "会话过期，请重新登录。",                                                 // 77
      "Invalid email or username": "不合法的电子邮件或用户名",                                                                     // 78
      "Internal server error": "内部服务器错误",                                                                              // 79
      "undefined": "未知错误",                                                                                             // 80
      "No matching login attempt found": "未发现对应登录请求",                                                                  // 81
      "Password is old. Please reset your password.": "密码过于老了，请重置您的密码。",                                               // 82
      "Incorrect password": "错误的密码",                                                                                   // 83
      "Invalid email": "不合法的电子邮件地址",                                                                                   // 84
      "Must be logged in": "必须先登录",                                                                                    // 85
      "Need to set a username or email": "必须设置用户名或电子邮件地址",                                                             // 86
      "old password format": "较老的密码格式",                                                                                // 87
      "Password may not be empty": "密码不应该为空",                                                                          // 88
      "Signups forbidden": "注册被禁止",                                                                                    // 89
      "Token expired": "密匙过期",                                                                                         // 90
      "Token has invalid email address": "密匙对应的电子邮箱地址不合法",                                                             // 91
      "User has no password set": "用户没有密码",                                                                            // 92
      "User not found": "未找到该用户",                                                                                      // 93
      "Verify email link expired": "激活验证邮件的链接已过期",                                                                     // 94
      "Verify email link is for unknown address": "验证邮件的链接去向未知地址",                                                     // 95
      "Match failed": "匹配失败",                                                                                          // 96
      "Unknown error": "未知错误"                                                                                          // 97
    }                                                                                                                  // 98
  }                                                                                                                    // 99
};                                                                                                                     // 100
                                                                                                                       // 101
T9n.map("zh_CN", zh_CN);                                                                                               // 102
                                                                                                                       // 103
T9n.map("zh-CN", zh_CN);                                                                                               // 104
                                                                                                                       // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/zh_TW.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var zh_TW;                                                                                                             // 2
                                                                                                                       // 3
zh_TW = {                                                                                                              // 4
  add: "添加",                                                                                                           // 5
  and: "和",                                                                                                            // 6
  back: "返回",                                                                                                          // 7
  cancel: "取消",                                                                                                        // 8
  changePassword: "修改密碼",                                                                                              // 9
  choosePassword: "選擇密碼",                                                                                              // 10
  clickAgree: "點擊註冊, 您同意我們的",                                                                                          // 11
  configure: "配置",                                                                                                     // 12
  createAccount: "建立帳號",                                                                                               // 13
  currentPassword: "當前密碼",                                                                                             // 14
  dontHaveAnAccount: "還沒有賬戶?",                                                                                         // 15
  email: "電子郵箱",                                                                                                       // 16
  emailAddress: "電郵地址",                                                                                                // 17
  emailResetLink: "電子郵件重設連結",                                                                                          // 18
  forgotPassword: "忘記密碼?",                                                                                             // 19
  ifYouAlreadyHaveAnAccount: "如果您已有賬戶",                                                                                // 20
  newPassword: "新密碼",                                                                                                  // 21
  newPasswordAgain: "新密碼 (重新輸入)",                                                                                      // 22
  optional: "可選的",                                                                                                     // 23
  OR: "或",                                                                                                             // 24
  password: "密碼",                                                                                                      // 25
  passwordAgain: "密碼 (重新輸入)",                                                                                          // 26
  privacyPolicy: "隱私政策",                                                                                               // 27
  remove: "刪除",                                                                                                        // 28
  resetYourPassword: "重置您的密碼",                                                                                         // 29
  setPassword: "設置密碼",                                                                                                 // 30
  sign: "登",                                                                                                           // 31
  signIn: "登入",                                                                                                        // 32
  signin: "登入",                                                                                                        // 33
  signOut: "登出",                                                                                                       // 34
  signUp: "註冊",                                                                                                        // 35
  signupCode: "註冊碼",                                                                                                   // 36
  signUpWithYourEmailAddress: "使用您的電郵地址註冊",                                                                            // 37
  terms: "使用條款",                                                                                                       // 38
  updateYourPassword: "更新您的密碼",                                                                                        // 39
  username: "用戶名",                                                                                                     // 40
  usernameOrEmail: "用戶名或電子郵箱",                                                                                         // 41
  "with": "與",                                                                                                         // 42
  enterPassword: "輸入密碼",                                                                                               // 43
  enterNewPassword: "輸入新密碼",                                                                                           // 44
  enterEmail: "輸入電子郵件",                                                                                                // 45
  enterUsername: "輸入用戶名",                                                                                              // 46
  enterUsernameOrEmail: "輸入用戶名或電子郵件",                                                                                  // 47
  orUse: "或是使用",                                                                                                       // 48
  info: {                                                                                                              // 49
    emailSent: "郵件已發送",                                                                                                // 50
    emailVerified: "郵件已驗證",                                                                                            // 51
    passwordChanged: "密碼已修改",                                                                                          // 52
    passwordReset: "密碼重置"                                                                                              // 53
  },                                                                                                                   // 54
  error: {                                                                                                             // 55
    emailRequired: "必須填寫電子郵件。",                                                                                        // 56
    minChar: "密碼至少需要7個字符。",                                                                                            // 57
    pwdsDontMatch: "密碼不一致。",                                                                                           // 58
    pwOneDigit: "密碼必須至少有一位數字。",                                                                                        // 59
    pwOneLetter: "密碼必須至少有一位字母。",                                                                                       // 60
    signInRequired: "您必須先登錄才能繼續。",                                                                                     // 61
    signupCodeIncorrect: "註冊碼錯誤。",                                                                                     // 62
    signupCodeRequired: "必須有註冊碼。",                                                                                     // 63
    usernameIsEmail: "用戶名不能為電郵地址。",                                                                                    // 64
    usernameRequired: "必須有用戶名。",                                                                                       // 65
    accounts: {                                                                                                        // 66
      "Email already exists.": "電郵地址已被使用。",                                                                            // 67
      "Email doesn't match the criteria.": "電郵地址不符合條件。",                                                               // 68
      "Invalid login token": "無效的登錄令牌",                                                                                // 69
      "Login forbidden": "禁止登錄",                                                                                       // 70
      "Service unknown": "未知服務",                                                                                       // 71
      "Unrecognized options for login request": "無法識別的登錄請求選項",                                                         // 72
      "User validation failed": "用戶驗證失敗",                                                                              // 73
      "Username already exists.": "用戶名已經存在。",                                                                          // 74
      "You are not logged in.": "您尚未登入。",                                                                              // 75
      "You've been logged out by the server. Please log in again.": "你已被伺服器登出，請重新登入。",                                 // 76
      "Your session has expired. Please log in again.": "您的協定已過期，請重新登入。",                                              // 77
      "Invalid email or username": "無效的電子郵件或用戶名",                                                                      // 78
      "Internal server error": "内部服务器错误",                                                                              // 79
      "undefined": "未知錯誤",                                                                                             // 80
      "No matching login attempt found": "沒有找到匹配的登入請求",                                                                // 81
      "Password is old. Please reset your password.": "密碼是舊的。請重置您的密碼。",                                                // 82
      "Incorrect password": "密碼不正確",                                                                                   // 83
      "Invalid email": "無效的電子郵件",                                                                                      // 84
      "Must be logged in": "必須先登入",                                                                                    // 85
      "Need to set a username or email": "必須設置用戶名或電郵地址",                                                               // 86
      "old password format": "舊密碼格式",                                                                                  // 87
      "Password may not be empty": "密碼不能為空的",                                                                          // 88
      "Signups forbidden": "註冊被禁止",                                                                                    // 89
      "Token expired": "密匙過期",                                                                                         // 90
      "Token has invalid email address": "密匙具有無效的電郵地址",                                                                // 91
      "User has no password set": "用戶沒有設置密碼",                                                                          // 92
      "User not found": "找不到用戶",                                                                                       // 93
      "Verify email link expired": "驗證電郵連結已過期",                                                                        // 94
      "Verify email link is for unknown address": "驗證電郵連結是未知的地址",                                                      // 95
      "Match failed": "匹配失敗",                                                                                          // 96
      "Unknown error": "未知錯誤"                                                                                          // 97
    }                                                                                                                  // 98
  }                                                                                                                    // 99
};                                                                                                                     // 100
                                                                                                                       // 101
T9n.map("zh_TW", zh_TW);                                                                                               // 102
                                                                                                                       // 103
T9n.map("zh-TW", zh_TW);                                                                                               // 104
                                                                                                                       // 105
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/zh_HK.coffee.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var zh_HK;                                                                                                             // 2
                                                                                                                       // 3
zh_HK = {                                                                                                              // 4
  add: "新增",                                                                                                           // 5
  and: "和",                                                                                                            // 6
  back: "返回",                                                                                                          // 7
  changePassword: "修改密碼",                                                                                              // 8
  choosePassword: "選擇密碼",                                                                                              // 9
  clickAgree: "點擊註冊, 您同意我們的",                                                                                          // 10
  configure: "設定",                                                                                                     // 11
  createAccount: "建立帳號",                                                                                               // 12
  currentPassword: "現有密碼",                                                                                             // 13
  dontHaveAnAccount: "還沒有賬號？",                                                                                         // 14
  email: "電郵",                                                                                                         // 15
  emailAddress: "電郵地址",                                                                                                // 16
  emailResetLink: "重設電郵連結",                                                                                            // 17
  forgotPassword: "忘記密碼?",                                                                                             // 18
  ifYouAlreadyHaveAnAccount: "如果已有賬號",                                                                                 // 19
  newPassword: "新密碼",                                                                                                  // 20
  newPasswordAgain: "新密碼 (重新輸入)",                                                                                      // 21
  optional: "可選填",                                                                                                     // 22
  OR: "或",                                                                                                             // 23
  password: "密碼",                                                                                                      // 24
  passwordAgain: "密碼（重新輸入）",                                                                                           // 25
  privacyPolicy: "私隱條款",                                                                                               // 26
  remove: "刪除",                                                                                                        // 27
  resetYourPassword: "重置密碼",                                                                                           // 28
  setPassword: "設定密碼",                                                                                                 // 29
  sign: "登",                                                                                                           // 30
  signIn: "登入",                                                                                                        // 31
  signin: "登入",                                                                                                        // 32
  signOut: "登出",                                                                                                       // 33
  signUp: "註冊",                                                                                                        // 34
  signupCode: "註冊碼",                                                                                                   // 35
  signUpWithYourEmailAddress: "使用您的電郵地址註冊",                                                                            // 36
  terms: "使用條款",                                                                                                       // 37
  updateYourPassword: "更新您的密碼",                                                                                        // 38
  username: "用戶名",                                                                                                     // 39
  usernameOrEmail: "用戶名或電子郵箱",                                                                                         // 40
  "with": "與",                                                                                                         // 41
  info: {                                                                                                              // 42
    emailSent: "已發送郵件",                                                                                                // 43
    emailVerified: "已驗證郵件",                                                                                            // 44
    passwordChanged: "已修改密碼",                                                                                          // 45
    passwordReset: "密碼重置"                                                                                              // 46
  },                                                                                                                   // 47
  error: {                                                                                                             // 48
    emailRequired: "必須填寫電子郵件。",                                                                                        // 49
    minChar: "密碼至少需要 7 個字符。",                                                                                          // 50
    pwdsDontMatch: "密碼不一致。",                                                                                           // 51
    pwOneDigit: "密碼必須至少包括一個數字。",                                                                                       // 52
    pwOneLetter: "密碼必須至少有包括一個字符。",                                                                                     // 53
    signInRequired: "您必須先登錄才能繼續。",                                                                                     // 54
    signupCodeIncorrect: "註冊碼不符。",                                                                                     // 55
    signupCodeRequired: "必須有註冊碼。",                                                                                     // 56
    usernameIsEmail: "用戶名不能設為電郵地址。",                                                                                   // 57
    usernameRequired: "必須有用戶名。",                                                                                       // 58
    accounts: {                                                                                                        // 59
      "Email already exists.": "電郵地址已在本服務登記使用。",                                                                       // 60
      "Email doesn't match the criteria.": "電郵地址不符合條件。",                                                               // 61
      "Invalid login token": "無效的登錄編碼",                                                                                // 62
      "Login forbidden": "禁止登錄",                                                                                       // 63
      "Service unknown": "未知服務",                                                                                       // 64
      "Unrecognized options for login request": "無法識別的登錄請求",                                                           // 65
      "User validation failed": "用戶驗證失敗",                                                                              // 66
      "Username already exists.": "用戶名已存在。",                                                                           // 67
      "You are not logged in.": "您尚未登入。",                                                                              // 68
      "You've been logged out by the server. Please log in again.": "您已被強制登出，請重新登入。",                                  // 69
      "Your session has expired. Please log in again.": "閒置時間過長，請重新登入。",                                               // 70
      "No matching login attempt found": "沒有找到匹配的登入請求",                                                                // 71
      "Password is old. Please reset your password.": "密碼已失效，請重置。",                                                    // 72
      "Incorrect password": "密碼不正確",                                                                                   // 73
      "Invalid email": "無效的電子郵件",                                                                                      // 74
      "Must be logged in": "必須先登入",                                                                                    // 75
      "Need to set a username or email": "必須設置用戶名或電郵地址",                                                               // 76
      "old password format": "舊密碼格式",                                                                                  // 77
      "Password may not be empty": "密碼不能為空",                                                                           // 78
      "Signups forbidden": "註冊被禁止",                                                                                    // 79
      "Token expired": "編碼已經過期",                                                                                       // 80
      "Token has invalid email address": "編碼中的電郵地址無效",                                                                 // 81
      "User has no password set": "用戶尚未設置密碼",                                                                          // 82
      "User not found": "找不到用戶",                                                                                       // 83
      "Verify email link expired": "驗證電郵連結已過期",                                                                        // 84
      "Verify email link is for unknown address": "驗證電郵連結是未知的地址",                                                      // 85
      "Match failed": "無法配對",                                                                                          // 86
      "Unknown error": "無法確認的系統問題"                                                                                     // 87
    }                                                                                                                  // 88
  }                                                                                                                    // 89
};                                                                                                                     // 90
                                                                                                                       // 91
T9n.map("zh_HK", zh_HK);                                                                                               // 92
                                                                                                                       // 93
T9n.map("zh-HK", zh_HK);                                                                                               // 94
                                                                                                                       // 95
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/es_ES_formal.coffee.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var es_ES_formal;                                                                                                      // 2
                                                                                                                       // 3
es_ES_formal = {                                                                                                       // 4
  t9Name: 'Español-España',                                                                                            // 5
  add: "agregar",                                                                                                      // 6
  and: "y",                                                                                                            // 7
  back: "regresar",                                                                                                    // 8
  cancel: "Cancelar",                                                                                                  // 9
  changePassword: "Cambiar Contraseña",                                                                                // 10
  choosePassword: "Eligir Contraseña",                                                                                 // 11
  clickAgree: "Si hace clic en Crear Cuenta acepta la",                                                                // 12
  configure: "Configurar",                                                                                             // 13
  createAccount: "Crear cuenta",                                                                                       // 14
  currentPassword: "Contraseña actual",                                                                                // 15
  dontHaveAnAccount: "¿No está registrado?",                                                                           // 16
  email: "Correo electrónico",                                                                                         // 17
  emailAddress: "Correo electrónico",                                                                                  // 18
  emailResetLink: "Restaurar dirección de correo electrónico",                                                         // 19
  forgotPassword: "¿Ha olvidado su contraseña?",                                                                       // 20
  ifYouAlreadyHaveAnAccount: "Si ya tiene una cuenta, ",                                                               // 21
  newPassword: "Nueva Contraseña",                                                                                     // 22
  newPasswordAgain: "Nueva Contraseña (repetición)",                                                                   // 23
  optional: "Opcional",                                                                                                // 24
  OR: "O",                                                                                                             // 25
  password: "Contraseña",                                                                                              // 26
  passwordAgain: "Contraseña (repetición)",                                                                            // 27
  privacyPolicy: "Póliza de Privacidad",                                                                               // 28
  remove: "remover",                                                                                                   // 29
  resetYourPassword: "Recuperar contraseña",                                                                           // 30
  setPassword: "Definir Contraseña",                                                                                   // 31
  sign: "Entrar",                                                                                                      // 32
  signIn: "Entrar",                                                                                                    // 33
  signin: "entra",                                                                                                     // 34
  signOut: "Salir",                                                                                                    // 35
  signUp: "Regístrarse",                                                                                               // 36
  signupCode: "Código para registrarte",                                                                               // 37
  signUpWithYourEmailAddress: "Regístrarse con su correo electrónico",                                                 // 38
  terms: "Términos de Uso",                                                                                            // 39
  updateYourPassword: "Actualizar contraseña",                                                                         // 40
  username: "Usuario",                                                                                                 // 41
  usernameOrEmail: "Usuario o correo electrónico",                                                                     // 42
  "with": "con",                                                                                                       // 43
  maxAllowedLength: "Longitud máxima permitida",                                                                       // 44
  minRequiredLength: "Longitud máxima requerida",                                                                      // 45
  resendVerificationEmail: "Mandar correo de nuevo",                                                                   // 46
  resendVerificationEmailLink_pre: "Correo de verificación perdido?",                                                  // 47
  resendVerificationEmailLink_link: "Volver a mandar",                                                                 // 48
  enterPassword: "Introducir contraseña",                                                                              // 49
  enterNewPassword: "Introducir contraseña nueva",                                                                     // 50
  enterEmail: "Introducir correo electrónico",                                                                         // 51
  enterUsername: "Introducir nombre de usuario",                                                                       // 52
  enterUsernameOrEmail: "Introducir nombre de usuario o correo electrónico",                                           // 53
  orUse: "O puedes usar",                                                                                              // 54
  info: {                                                                                                              // 55
    emailSent: "Mensaje enviado",                                                                                      // 56
    emailVerified: "Dirección de correo verificada",                                                                   // 57
    passwordChanged: "Contraseña cambiada",                                                                            // 58
    passwordReset: "Resetar Contraseña"                                                                                // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Aviso',                                                                                                   // 64
      error: 'Error',                                                                                                  // 65
      warning: 'Advertencia'                                                                                           // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "La dirección de correo electrónico es necesaria.",                                                 // 70
    minChar: "7 carácteres mínimo.",                                                                                   // 71
    pwdsDontMatch: "Contraseñas no coinciden",                                                                         // 72
    pwOneDigit: "mínimo un dígito.",                                                                                   // 73
    pwOneLetter: "mínimo una letra.",                                                                                  // 74
    signInRequired: "Debe iniciar sesión para esta opción.",                                                           // 75
    signupCodeIncorrect: "Código de registro inválido.",                                                               // 76
    signupCodeRequired: "Se requiere un código de registro.",                                                          // 77
    usernameIsEmail: "El nombre de usuario no puede ser una dirección de correo.",                                     // 78
    usernameRequired: "Se requiere nombre de usuario.",                                                                // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "El correo ya existe.",                                                                 // 81
      "Email doesn't match the criteria.": "El correo no coincide.",                                                   // 82
      "Invalid login token": "Token de inicio de sesión inválido",                                                     // 83
      "Login forbidden": "Inicio de sesión prohibido",                                                                 // 84
      "Service unknown": "Servicio desconocido",                                                                       // 85
      "Unrecognized options for login request": "Opciones desconocidas para solicitud de inicio de sesión",            // 86
      "User validation failed": "No se ha podido validar el usuario",                                                  // 87
      "Username already exists.": "El usuario ya existe.",                                                             // 88
      "You are not logged in.": "No está conectado.",                                                                  // 89
      "You've been logged out by the server. Please log in again.": "Ha sido desconectado por el servidor. Por favor inicie sesión de nuevo.",
      "Your session has expired. Please log in again.": "Su sesión ha expirado. Por favor inicie sesión de nuevo.",    // 91
      "Already verified": "Ya ha sido verificada",                                                                     // 92
      "Invalid email or username": "Dirección electrónica o nombre de usuario no validos",                             // 93
      "Internal server error": "Error interno del servidor",                                                           // 94
      "undefined": "Algo ha ido mal",                                                                                  // 95
      "No matching login attempt found": "Ningún intento de inicio de sesión coincidente se encontró",                 // 96
      "Password is old. Please reset your password.": "Contraseña es vieja. Por favor, resetea la contraseña.",        // 97
      "Incorrect password": "Contraseña inválida.",                                                                    // 98
      "Invalid email": "Correo electrónico inválido",                                                                  // 99
      "Must be logged in": "Debe ingresar",                                                                            // 100
      "Need to set a username or email": "Tiene que especificar un usuario o una dirección de correo",                 // 101
      "old password format": "formato viejo de contraseña",                                                            // 102
      "Password may not be empty": "Contraseña no debe quedar vacía",                                                  // 103
      "Signups forbidden": "Registro prohibido",                                                                       // 104
      "Token expired": "Token expirado",                                                                               // 105
      "Token has invalid email address": "Token contiene una dirección electrónica inválido",                          // 106
      "User has no password set": "Usuario no tiene contraseña",                                                       // 107
      "User not found": "Usuario no encontrado",                                                                       // 108
      "Verify email link expired": "El enlace para verificar el correo electrónico ha expirado",                       // 109
      "Verify email link is for unknown address": "El enlace para verificar el correo electrónico contiene una dirección desconocida",
      "At least 1 digit, 1 lowercase and 1 uppercase": "Al menos tiene que contener un número, una minúscula y una mayúscula",
      "Please verify your email first. Check the email and follow the link!": "Por favor compruebe su correo electrónico primero. Siga el link que le ha sido enviado.",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nuevo correo le ha sido enviado. Si no ve el correo en su bandeja compruebe su carpeta de spam.",
      "Match failed": "No ha habido ninguna coincidencia",                                                             // 114
      "Unknown error": "Error desconocido",                                                                            // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Error, demasiadas peticiones. Por favor no vaya tan rapido. Tiene que esperar al menos un segundo antes de probar otra vez."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("es_ES_formal", es_ES_formal);                                                                                 // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/softwarerero_accounts-t9n/t9n/es_formal.coffee.js                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var es_formal;                                                                                                         // 2
                                                                                                                       // 3
es_formal = {                                                                                                          // 4
  t9Name: 'Español',                                                                                                   // 5
  add: "agregar",                                                                                                      // 6
  and: "y",                                                                                                            // 7
  back: "regresar",                                                                                                    // 8
  cancel: "Cancelar",                                                                                                  // 9
  changePassword: "Cambiar contraseña",                                                                                // 10
  choosePassword: "Eligir contraseña",                                                                                 // 11
  clickAgree: "Al hacer clic en Suscribir aprueba la",                                                                 // 12
  configure: "Configurar",                                                                                             // 13
  createAccount: "Crear cuenta",                                                                                       // 14
  currentPassword: "Contraseña actual",                                                                                // 15
  dontHaveAnAccount: "¿No tiene una cuenta?",                                                                          // 16
  email: "Correo electrónico",                                                                                         // 17
  emailAddress: "Dirección de correo electrónico",                                                                     // 18
  emailResetLink: "Resetear correo electrónico",                                                                       // 19
  forgotPassword: "¿Olvidó su contraseña?",                                                                            // 20
  ifYouAlreadyHaveAnAccount: "Si ya tiene una cuenta",                                                                 // 21
  newPassword: "Nueva contraseña",                                                                                     // 22
  newPasswordAgain: "Nueva contraseña (repetir)",                                                                      // 23
  optional: "Opcional",                                                                                                // 24
  OR: "O",                                                                                                             // 25
  password: "Contraseña",                                                                                              // 26
  passwordAgain: "Contraseña (repetir)",                                                                               // 27
  privacyPolicy: "Póliza de Privacidad",                                                                               // 28
  remove: "remover",                                                                                                   // 29
  resetYourPassword: "Resetear contraseña",                                                                            // 30
  setPassword: "Definir contraseña",                                                                                   // 31
  sign: "Ingresar",                                                                                                    // 32
  signIn: "Entrar",                                                                                                    // 33
  signin: "entrar",                                                                                                    // 34
  signOut: "Salir",                                                                                                    // 35
  signUp: "Registrarse",                                                                                               // 36
  signupCode: "Código de registro",                                                                                    // 37
  signUpWithYourEmailAddress: "Registrarse con su dirección de correo electrónico",                                    // 38
  terms: "Términos de uso",                                                                                            // 39
  updateYourPassword: "Actualizar contraseña",                                                                         // 40
  username: "Usuario",                                                                                                 // 41
  usernameOrEmail: "Usuario o correo electrónico",                                                                     // 42
  "with": "con",                                                                                                       // 43
  maxAllowedLength: "Longitud máxima permitida",                                                                       // 44
  minRequiredLength: "Longitud máxima requerida",                                                                      // 45
  resendVerificationEmail: "Mandar correo electrónico de nuevo",                                                       // 46
  resendVerificationEmailLink_pre: "¿Perdió su correo de verificación?",                                               // 47
  resendVerificationEmailLink_link: "Volver a mandar",                                                                 // 48
  enterPassword: "Introducir contraseña",                                                                              // 49
  enterNewPassword: "Introducir contraseña nueva",                                                                     // 50
  enterEmail: "Introducir dirección de correo electrónico",                                                            // 51
  enterUsername: "Introducir nombre de usario",                                                                        // 52
  enterUsernameOrEmail: "Introducir nombre de usario o dirección de correos",                                          // 53
  orUse: "O usar",                                                                                                     // 54
  info: {                                                                                                              // 55
    emailSent: "Correo enviado",                                                                                       // 56
    emailVerified: "Dirección de correos verificada",                                                                  // 57
    passwordChanged: "Contraseña cambiada",                                                                            // 58
    passwordReset: "Resetear contraseña"                                                                               // 59
  },                                                                                                                   // 60
  alert: {                                                                                                             // 61
    ok: 'Ok',                                                                                                          // 62
    type: {                                                                                                            // 63
      info: 'Aviso',                                                                                                   // 64
      error: 'Error',                                                                                                  // 65
      warning: 'Advertencia'                                                                                           // 66
    }                                                                                                                  // 67
  },                                                                                                                   // 68
  error: {                                                                                                             // 69
    emailRequired: "Su dirección de correos es requerida.",                                                            // 70
    minChar: "7 caracteres mínimo.",                                                                                   // 71
    pwdsDontMatch: "Las contraseñas no coinciden",                                                                     // 72
    pwOneDigit: "mínimo un dígito.",                                                                                   // 73
    pwOneLetter: "mínimo una letra.",                                                                                  // 74
    signInRequired: "Debe iniciar sesión para hacer eso.",                                                             // 75
    signupCodeIncorrect: "El código de registro no coincide.",                                                         // 76
    signupCodeRequired: "Se requiere el código de registro.",                                                          // 77
    usernameIsEmail: "El nombre de usuario no puede ser una dirección de correos.",                                    // 78
    usernameRequired: "Se requiere un nombre de usuario.",                                                             // 79
    accounts: {                                                                                                        // 80
      "Email already exists.": "La dirección de correo elecrónico ya existe.",                                         // 81
      "Email doesn't match the criteria.": "La dirección de correo electrónico no coincide con los criterios.",        // 82
      "Invalid login token": "Token de inicio de sesión inválido",                                                     // 83
      "Login forbidden": "Inicio de sesión prohibido",                                                                 // 84
      "Service unknown": "Servicio desconocido",                                                                       // 85
      "Unrecognized options for login request": "Opciones desconocidas para solicitud de inicio de sesión",            // 86
      "User validation failed": "No se ha podido validar el usuario",                                                  // 87
      "Username already exists.": "El usuario ya existe.",                                                             // 88
      "You are not logged in.": "No está autenticado.",                                                                // 89
      "You've been logged out by the server. Please log in again.": "Ha sido desconectado por el servidor. Por favor ingrese de nuevo.",
      "Your session has expired. Please log in again.": "Su sesión ha expirado. Por favor ingrese de nuevo.",          // 91
      "Already verified": "Ya ha sido verificada",                                                                     // 92
      "Invalid email or username": "Dirección de correo o nombre de usuario no validos",                               // 93
      "Internal server error": "Error interno del servidor",                                                           // 94
      "undefined": "Algo ha ido mal",                                                                                  // 95
      "No matching login attempt found": "No se encontró ningún intento de inicio de sesión coincidente",              // 96
      "Password is old. Please reset your password.": "Contraseña es vieja. Por favor resetee su contraseña.",         // 97
      "Incorrect password": "Contraseña incorrecta.",                                                                  // 98
      "Invalid email": "Correo electrónico inválido",                                                                  // 99
      "Must be logged in": "Debe estar conectado",                                                                     // 100
      "Need to set a username or email": "Debe especificar un usuario o dirección de correo electrónico",              // 101
      "old password format": "formato viejo de contraseña",                                                            // 102
      "Password may not be empty": "Contraseña no debe quedar vacía",                                                  // 103
      "Signups forbidden": "Registro prohibido",                                                                       // 104
      "Token expired": "Token expirado",                                                                               // 105
      "Token has invalid email address": "Token contiene un correo electrónico inválido",                              // 106
      "User has no password set": "Usuario no tiene contraseña",                                                       // 107
      "User not found": "Usuario no encontrado",                                                                       // 108
      "Verify email link expired": "El enlace para verificar la dirección de correo ha expirado",                      // 109
      "Verify email link is for unknown address": "El enlace para verificar el correo electrónico contiene una dirección desconocida",
      "At least 1 digit, 1 lowercase and 1 uppercase": "Al menos debe contener un número, una minúscula y una mayúscula",
      "Please verify your email first. Check the email and follow the link!": "Por favor compruebe su dirección de correo primero. Siga el link que le ha sido enviado.",
      "A new email has been sent to you. If the email doesn't show up in your inbox, be sure to check your spam folder.": "Un nuevo correo le ha sido enviado. Si no ve el correo en su bandeja compruebe su carpeta de spam.",
      "Match failed": "No se encontró pareja coincidente",                                                             // 114
      "Unknown error": "Error desconocido",                                                                            // 115
      "Error, too many requests. Please slow down. You must wait 1 seconds before trying again.": "Error, demasiadas peticiones. Por favor vaya más lento. Debe esperar al menos un segundo antes de probar otra vez."
    }                                                                                                                  // 117
  }                                                                                                                    // 118
};                                                                                                                     // 119
                                                                                                                       // 120
T9n.map("es_formal", es_formal);                                                                                       // 121
                                                                                                                       // 122
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['softwarerero:accounts-t9n'] = {}, {
  T9n: T9n
});

})();
