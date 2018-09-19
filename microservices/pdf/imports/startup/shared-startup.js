import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Meteor.microservice = 'pdf';
});
