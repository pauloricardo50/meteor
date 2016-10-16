import { Mongo } from 'meteor/mongo';

export const CreditRequests = new Mongo.Collection('creditRequests');

CreditRequests.allow({
  insert: function (userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
  update: function (userId, doc) {
    // This is true if someone is logged in
    return !!userId;
  },
});
