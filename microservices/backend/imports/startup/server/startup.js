import { Meteor } from 'meteor/meteor';

Meteor.microservice = 'backend';

if (Meteor.isAppTest) {
  Meteor.isTest = true;
}
