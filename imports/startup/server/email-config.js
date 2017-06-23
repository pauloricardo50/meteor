import { Mandrill } from 'meteor/wylio:mandrill';
import { Meteor } from 'meteor/meteor';

const setupMandrill = () => {
  let key = '';
  if (Meteor.isTest) {
    key = Meteor.settings.MANDRILL_API_KEY_TEST;
  } else {
    key = Meteor.settings.MANDRILL_API_KEY;
  }

  Mandrill.config({
    username: Meteor.settings.MANDRILL_LOGIN, // the email address you log into Mandrill with. Only used to set MAIL_URL.
    key, // get your Mandrill key from https://mandrillapp.com/settings/index
    port: 587, // defaults to 465 for SMTP over TLS
    host: 'smtps.mandrillapp.com', // the SMTP host
    // baseUrl: 'https://mandrillapp.com/api/1.0/'  // update this in case Mandrill changes its API endpoint URL or version
  });
};

export default setupMandrill;
