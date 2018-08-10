import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { Roles } from 'meteor/alanning:roles';
import { Loans, Borrowers } from '../..';
import { TEST_BUCKET_NAME, S3_ENDPOINT } from '../fileConstants';

const { API_KEY, SECRET_KEY } = Meteor.settings.exoscale;

class S3Service {
  constructor() {
    this.setupS3();
    this.setBucket();
  }

  setupS3 = () => {
    // API Ref: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
    AWS.config.update({ accessKeyId: API_KEY, secretAccessKey: SECRET_KEY });
    this.s3 = new AWS.S3({ signatureVersion: 'v4', endpoint: S3_ENDPOINT });
  };

  setBucket = () => {
    if (Meteor.isTest || Meteor.isAppTest) {
      this.params = { Bucket: TEST_BUCKET_NAME };
    } else {
      this.params = { Bucket: Meteor.settings.storage.bucketName };
    }
  };

  makeParams = (extraParams = {}) => ({ ...this.params, ...extraParams });

  isAllowedToAccess = (key) => {
    // Check if this user is the owner of the document
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
      Roles.userIsInRole(Meteor.userId(), 'admin')
      || Roles.userIsInRole(Meteor.userId(), 'dev')
    ) {
      return true;
    }
    if (!(loanFound || borrowerFound)) {
      throw new Meteor.Error('unauthorized email');
    }

    return true;
  };

  putObject = (binaryData, Key, Metadata) =>
    this.callS3Method('putObject', {
      Body: binaryData,
      Key,
      Metadata,
      ACL: 'bucket-owner-full-control',
    });

  deleteObject = Key => this.callS3Method('deleteObject', { Key });

  deleteObjects = keys =>
    this.callS3Method('deleteObjects', {
      Delete: { Objects: keys.map(Key => ({ Key })) },
    });

  deleteObjectsWithPrefix = prefix =>
    this.listObjects(prefix)
      .then(results => results.map(({ Key }) => Key))
      .then(this.deleteObjects);

  getObject = Key => this.callS3Method('getObject', { Key });

  listObjects = Prefix =>
    this.callS3Method('listObjectsV2', { Prefix }).then(results => results.Contents);

  copyObject = params => this.callS3Method('copyObject', params);

  headObject = Key => this.callS3Method('headObject', { Key });

  callS3Method = (methodName, params) =>
    this.promisify(methodName, this.makeParams(params));

  promisify = (methodName, params) =>
    new Promise((resolve, reject) =>
      this.s3[methodName](
        params,
        (err, data) => (err ? reject(err) : resolve(data)),
      ));

  updateMetadata = (key, newMetadata) =>
    this.getObject(key).then(({ Metadata: oldMetaData }) =>
      this.putObject(undefined, key, { ...oldMetaData, ...newMetadata }));
}

export default new S3Service();
