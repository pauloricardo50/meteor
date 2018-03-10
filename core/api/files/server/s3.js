import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { Roles } from 'meteor/alanning:roles';
import { Loans, Borrowers } from '../..';

// API Ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
export const setupS3 = () => {
  AWS.config.update({
    accessKeyId: Meteor.settings.AWS.users.accessKeyId,
    secretAccessKey: Meteor.settings.AWS.users.secretAccesskey,
  });

  return new AWS.S3({ signatureVersion: 'v4' });
};

export const isAllowed = (key) => {
  // Check if this user is the owner of the document he's trying to delete a
  // file from
  const keyId = key.split('/')[0];
  const loanFound = !!Loans.findOne({
    _id: keyId,
    userId: Meteor.userId(),
  });
  const borrowerFound = !!Borrowers.findOne({
    _id: keyId,
    userId: Meteor.userId(),
  });

  if (
    Roles.userIsInRole(Meteor.userId(), 'admin') ||
    Roles.userIsInRole(Meteor.userId(), 'dev')
  ) {
    return true;
  } else if (!(loanFound || borrowerFound)) {
    throw new Meteor.Error('unauthorized email');
  }

  return true;
};
