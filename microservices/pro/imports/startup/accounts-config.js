import { Accounts as AccountsUI } from 'meteor/epotek:accounts-ui';

AccountsUI.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/account',
  changePasswordPath: '/account',
  minimumPasswordLength: 5,
});
