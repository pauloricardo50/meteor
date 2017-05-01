import { Meteor } from 'meteor/meteor';
import s3 from 's3';

Meteor.methods({
  getServerTime() {
    return new Date();
  },
});
