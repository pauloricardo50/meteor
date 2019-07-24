import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import { PROPERTY_DOCUMENTS, S3_ACLS } from 'core/api/files/fileConstants';
import { getS3FileKey } from 'core/api/files/server/meteor-slingshot-server';
import FileService from 'core/api/files/server/FileService';
import fs from 'fs';
import {
  checkQuery,
  impersonateSchema,
  getImpersonateUserId,
} from './helpers';

import { withMeteorUserId } from '../helpers';

const s3 = require('s3');

const uploadFileAPI = (req) => {
  const {
    files: { file } = {},
    user: { _id: userId },
    query,
    body,
  } = req;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  if (file) {
    const { name, size, type, path, originalFilename } = file;
    return withMeteorUserId(
      { userId, impersonateUser },
      () =>
        new Promise((resolve, reject) => {
          const client = s3.createClient({
            s3Options: {
              accessKeyId: Meteor.settings.exoscale.API_KEY,
              secretAccessKey: Meteor.settings.exoscale.SECRET_KEY,
              endpoint: 'sos-ch-dk-2.exo.io',
              region: 'CH-DK-2',
            },
          });

          const docId = 'NBcN4Gp8JykBdkNCB';
          const collection = PROPERTIES_COLLECTION;

          const key = getS3FileKey(
            { name: originalFilename },
            { docId, id: 'propertyImages' },
          );

          const params = {
            localFile: path,
            s3Params: {
              Bucket: Meteor.settings.storage.bucketName,
              Key: key,
              ACL: S3_ACLS.PUBLIC_READ,
              ContentDisposition: `inline; filename="${encodeURIComponent(originalFilename)}"; filename*=utf-8''${encodeURIComponent(originalFilename)}`,
            },
          };

          const uploader = client.uploadFile(params);
          uploader.on('error', (err) => {
            reject(err.stack);
          });
          
          uploader.on('end', () => {
            FileService.updateDocumentsCache({ docId, collection })
              .then(() =>
                fs.unlink(path, (err) => {
                  if (err) {
                    reject(err);
                  }
                }))
              .then(() => {
                resolve(`https://${Meteor.settings.storage.bucketName}.sos-ch-dk-2.exo.io/${key}`);
              });
          });
        }),
    );
  }
};

export default uploadFileAPI;
