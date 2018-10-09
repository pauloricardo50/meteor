import { Accounts as AccountsUI } from 'meteor/epotek:accounts-ui';

AccountsUI.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/',
  minimumPasswordLength: 1,
});
