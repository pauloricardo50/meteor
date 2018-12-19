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
    getAllTestEmails() {
      return emailTestCollection.find().fetch();
    },
  });
}

export default emailTestCollection;
