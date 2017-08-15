import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import rateLimit from '/imports/js/helpers/rate-limit.js';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';

/* eslint import/prefer-default-export: 0 */
export const isAllowed = (key) => {
  // Check if this user is the owner of the document he's trying to delete a
  // file from
  const keyId = key.split('/')[0];
  const requestFound = !!LoanRequests.findOne({
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
  } else if (!(requestFound || borrowerFound)) {
    throw new Meteor.Error('unauthorized email');
  }

  return true;
};

const setupS3 = () => {
  AWS.config.update({
    accessKeyId: Meteor.settings.AWS.users.accessKeyId,
    secretAccessKey: Meteor.settings.AWS.users.secretAccesskey,
  });

  return new AWS.S3({ signatureVersion: 'v4' });
};

Meteor.methods({
  deleteFile(key) {
    check(key, String);
    isAllowed(key);

    const s3 = setupS3();
    const params = { Bucket: Meteor.settings.S3Bucket, Key: key };

    const async = Meteor.wrapAsync(s3.deleteObject);

    return async(params);
  },
  downloadFile(key) {
    check(key, String);
    isAllowed(key);

    const s3 = setupS3();
    const params = { Bucket: Meteor.settings.S3Bucket, Key: key };

    // Don't ask me why this works...
    // https://gist.github.com/rclai/b9331afd2fbabadb0074
    const async = Meteor.wrapAsync((parameters, callback) =>
      s3.getObject(parameters, (error, data) => {
        callback(error, data);
      }),
    );

    return async(params);
  },
});

rateLimit({ methods: ['deleteFile', 'downloadFile'] });
