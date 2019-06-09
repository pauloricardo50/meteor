import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { isEmailTestEnv } from '../EmailService';

let emailTestCollection;

const POLLING_INTERVAL = 50;
// Most tests have a 10'000 timeout, so let them have an extra
// 2000ms to wrap up
const TIMEOUT = 8000;

if (isEmailTestEnv) {
  emailTestCollection = new Mongo.Collection('emailTestCollection');

  Meteor.methods({
    storeTestEmail(email) {
      return emailTestCollection.insert({ ...email });
    },
    getAllTestEmails({
      expected = 1,
      timeout = TIMEOUT,
      pollingInterval = POLLING_INTERVAL,
    } = {}) {
      // Because emails are sent asynchronously after the actions that trigger
      // them, poll the DB for 10 seconds until something is found
      let counter = 0;

      return new Promise((resolve) => {
        const interval = Meteor.setInterval(() => {
          counter += 1;

          const emails = emailTestCollection
            .find({}, { sort: { date: 1 } })
            .fetch();

          if (emails && emails.length >= expected) {
            Meteor.clearInterval(interval);
            resolve(emails);
          }

          if (counter > timeout / pollingInterval) {
            resolve(emails);
          }
        }, pollingInterval);
      });
    },
  });
}

export default emailTestCollection;
