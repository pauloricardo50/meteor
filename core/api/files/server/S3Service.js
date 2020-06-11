import { Meteor } from 'meteor/meteor';

import AWS from 'aws-sdk';

import {
  OBJECT_STORAGE_PATH,
  S3_ENDPOINT,
  TEST_BUCKET_NAME,
} from '../fileConstants';

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

  putObject = (binaryData, Key, Metadata, ACL = 'bucket-owner-full-control') =>
    this.callS3Method('putObject', {
      Body: binaryData,
      Key,
      Metadata,
      ACL,
    });

  deleteObject = Key => this.callS3Method('deleteObject', { Key });

  deleteObjects = keys =>
    this.callS3Method('deleteObjects', {
      Delete: { Objects: keys.map(Key => ({ Key })) },
    });

  deleteObjectsWithPrefix = prefix => {
    if (!prefix && Meteor.isProduction) {
      throw new Meteor.Error(
        'Tried to delete objects without prefix in production!',
      );
    }

    return this.listObjects(prefix)
      .then(results => results.map(({ Key }) => Key))
      .then(this.deleteObjects);
  };

  getObject = Key => this.callS3Method('getObject', { Key });

  listObjects = Prefix =>
    this.callS3Method('listObjectsV2', { Prefix }).then(
      results => results.Contents,
    );

  listObjectsWithMetadata = Prefix =>
    this.listObjects(Prefix).then(results =>
      Promise.all(
        results.map(object =>
          this.headObject(object.Key).then(
            ({ Metadata, ContentDisposition }) => {
              const name =
                ContentDisposition &&
                decodeURIComponent(
                  ContentDisposition.match(/filename="(.*)"/)[1],
                );
              return {
                ...object,
                ...Metadata,
                url: this.buildFileUrl(object),
                name,
              };
            },
          ),
        ),
      ),
    );

  copyObject = params => this.callS3Method('copyObject', params);

  headObject = Key => this.callS3Method('headObject', { Key });

  callS3Method = (methodName, params) =>
    this.promisify(methodName, this.makeParams(params));

  promisify = (methodName, params) =>
    new Promise((resolve, reject) =>
      this.s3[methodName](params, (err, data) =>
        err ? reject(err) : resolve(data),
      ),
    );

  updateMetadata = (key, newMetadata) =>
    this.headObject(key).then(({ Metadata: oldMetaData }) =>
      this.copyObject({
        Key: key,
        Metadata: { ...oldMetaData, ...newMetadata },
        CopySource: encodeURIComponent(`/${this.params.Bucket}/${key}`),
        MetadataDirective: 'REPLACE',
      }),
    );

  buildFileUrl = file => `${OBJECT_STORAGE_PATH}/${file.Key}`;

  makeSignedUrl = Key =>
    this.s3.getSignedUrl('getObject', {
      Bucket: this.params.Bucket,
      Key,
      Expires: 180,
    });

  getObjectReadStream = Key =>
    this.s3.getObject(this.makeParams({ Key })).createReadStream();

  moveObject = (oldKey, newKey) =>
    this.headObject(oldKey)
      .then(({ Metadata }) =>
        this.copyObject({
          Key: newKey,
          Metadata,
          CopySource: encodeURIComponent(`/${this.params.Bucket}/${oldKey}`),
          MetadataDirective: 'REPLACE',
        }),
      )
      .then(() => this.deleteObject(oldKey));
}

export default new S3Service();
