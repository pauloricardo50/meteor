import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';
import { Roles } from 'meteor/alanning:roles';
import {
  Loans,
  Borrowers,
  Properties,
  Promotions,
  PromotionOptions,
} from '../..';
import {
  TEST_BUCKET_NAME,
  S3_ENDPOINT,
  OBJECT_STORAGE_PATH,
} from '../fileConstants';
import { PROPERTY_CATEGORY } from '../../constants';
import FileService from './FileService';
import SecurityService from '../../security';
import LoanService from '../../loans/server/LoanService';
import BorrowerService from '../../borrowers/server/BorrowerService';
import PropertyService from '../../properties/server/PropertyService';
import PromotionService from '../../promotions/server/PromotionService';
import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';

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

  isAllowedToAccess = ({ userId, key }) => {
    if (
      Roles.userIsInRole(userId, 'admin') ||
      Roles.userIsInRole(userId, 'dev')
    ) {
      return true;
    }

    // Check if this user is the owner of the document
    const { docId: keyId } = FileService.getKeyParts(key);
    const loanFound = !!LoanService.get(
      {
        _id: keyId,
        userId,
      },
      { _id: 1 },
    );

    if (loanFound) {
      return true;
    }

    const borrowerFound = !!BorrowerService.get(
      {
        _id: keyId,
        userId,
      },
      { _id: 1 },
    );

    if (borrowerFound) {
      return true;
    }

    const property = PropertyService.get(keyId, { category: 1, userId: 1 });

    if (property) {
      if (!property.category || property.category === PROPERTY_CATEGORY.USER) {
        if (property.userId === userId) {
          return true;
        }
        throw new Meteor.Error('Unauthorized download');
      }

      return true;
    }

    const promotionFound = !!PromotionService.get(keyId, { _id: 1 });

    if (promotionFound) {
      return true;
    }

    const promotionOption = PromotionOptionService.get(keyId, { _id: 1 });

    if (promotionOption) {
      try {
        SecurityService.promotions.isAllowedToManagePromotionReservation({
          promotionOptionId: promotionOption._id,
          userId,
        });
        return true;
      } catch (error) {
        throw new Meteor.Error('Unauthorized download');
      }
    }

    throw new Meteor.Error('Unauthorized download');
  };

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

  deleteObjectsWithPrefix = prefix =>
    this.listObjects(prefix)
      .then(results => results.map(({ Key }) => Key))
      .then(this.deleteObjects);

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
        CopySource: `/${this.params.Bucket}/${key}`,
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
          CopySource: `/${this.params.Bucket}/${oldKey}`,
          MetadataDirective: 'REPLACE',
        }),
      )
      .then(() => this.deleteObject(oldKey));
}

export default new S3Service();
