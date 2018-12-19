import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

const isTest = Meteor.isTest || Meteor.isAppTest;

let emailTestCollection;

if (isTest) {
  emailTestCollection = new Mongo.Collection('emailTestCollection', {
    connection: null,
  });

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
