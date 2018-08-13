import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Meteor.microservice = 'app';
});
