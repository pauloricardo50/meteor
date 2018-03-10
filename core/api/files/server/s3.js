import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';

// API Ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
export const setupS3 = () => {
  AWS.config.update({
    accessKeyId: Meteor.settings.AWS.users.accessKeyId,
    secretAccessKey: Meteor.settings.AWS.users.secretAccesskey,
  });

  return new AWS.S3({ signatureVersion: 'v4' });
};
