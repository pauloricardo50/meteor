import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { isEmailTestEnv } from '../EmailService';

let emailTestCollection;

if (isEmailTestEnv) {
  emailTestCollection = new Mongo.Collection('emailTestCollection');

  Meteor.methods({
    storeTestEmail(email) {
      emailTestCollection.insert({ ...email });
    },
    getAllTestEmails({ expected = 1 }) {
      // Because emails are sent asynchronously after the actions that trigger
      // them, poll the DB for 2 seconds until something is found
      let counter = 0;

      return new Promise((resolve) => {
        const interval = Meteor.setInterval(() => {
          counter += 1;

          const emails = emailTestCollection.find().fetch();

          if (emails && emails.length >= expected) {
            Meteor.clearInterval(interval);
            resolve(emails);
          }

          if (counter > 40) {
            resolve(emails);
          }
        }, 50);
      });
    },
  });
}

export default emailTestCollection;
