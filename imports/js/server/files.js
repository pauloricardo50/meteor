import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';

Meteor.methods({
  deleteFile(key) {
    check(key, String);

    // Check if this user is the owner of the document he's trying to delete a
    // file from
    const keyId = key.split('/')[0];
    const requestFound = !!LoanRequests.findOne({ _id: keyId, userId: Meteor.userId() });
    const borrowerFound = !!Borrowers.findOne({ _id: keyId, userId: Meteor.userId() });

    if (
      Roles.userIsInRole(Meteor.userId(), 'admin') ||
      Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      // Continue
    } else if (!(requestFound || borrowerFound)) {
      throw new Meteor.Error('unauthorized');
    }

    AWS.config.update({
      accessKeyId: Meteor.settings.AWS.users.accessKeyId,
      secretAccessKey: Meteor.settings.AWS.users.secretAccesskey,
    });

    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const params = { Bucket: Meteor.settings.S3Bucket, Key: key };

    return Meteor.wrapAsync(() => s3.deleteObject(params));
  },
});
