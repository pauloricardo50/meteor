import { Accounts as AccountsUI } from 'meteor/std:accounts-ui';

AccountsUI.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
  loginPath: '/login',
  homeRoutePath: '/',
  profilePath: '/',
  minimumPasswordLength: 1,
});

