import { Meteor } from 'meteor/meteor';
import formatMessage from '../intl';

// Defaults
export const from = "Yannis d'e-Potek";
export const fromEmail = 'info@e-potek.ch';
export const defaultFrom = `${from} <${fromEmail}>`;
export const defaultCTA_URL = 'https://www.e-potek.ch/app';

/**
 * emailFooter - Returns the default email footer for all emails
 *
 * @param {boolean} [unsubscribe=true] Whether to show an unsubscribe line or not
 *
 * @return {type} a HTML string
 */

export const emailFooter = (unsubscribe = true) =>
  formatMessage('emails.footer', {
    copyright: '<em>&copy; *|CURRENT_YEAR|* e-Potek</em><br /><br />',
    url: '<a href="http://e-potek.ch" target="_blank">www.e-potek.ch</a><br />',
    unsubscribe: unsubscribe
      ? `<a href="*|UNSUB|*">${formatMessage('emails.unsubscribe')}</a>`
      : '',
  });

/**
 * getEmailContent - Returns all the fields for an email
 *
 * @param {String} emailId an id representing what email this is, example:
 * auctionEnded, verificationRequested
 *
 * @return {Object} contains all the fields
 */
export const getEmailContent = (emailId, intlValues = {}) => {
  const subject = formatMessage(`emails.${emailId}.subject`, intlValues, '');
  const title = formatMessage(`emails.${emailId}.title`, intlValues, '');
  const body = formatMessage(`emails.${emailId}.body`, {
    verticalSpace: '<span><br/><br/></span>',
    ...intlValues,
  });
  const CTA = formatMessage(
    `emails.${emailId}.CTA`,
    intlValues,
    defaultCTA_URL,
  );
  const customFrom = formatMessage(
    `emails.${emailId}.from`,
    intlValues,
    defaultFrom,
  );
  const email = Meteor.user() && Meteor.user().emails[0].address;

  return { email, subject, title, body, CTA, from: customFrom };
};
