import { PROPERTIES_COLLECTION } from 'core/api/properties/propertyConstants';
import fs from 'fs';
import { Meteor } from 'meteor/meteor';
import {
  checkQuery,
  impersonateSchema,
  getImpersonateUserId,
  uploadFileToS3,
} from './helpers';

import { withMeteorUserId } from '../helpers';

const uploadFileAPI = (req) => {
  const {
    files: { file } = {},
    user: { _id: userId },
    query,
    body: { propertyId, category },
  } = req;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  if (!file) {
    throw new Meteor.Error('No file uploaded');
  }
  const { name, size, type, path, originalFilename } = file;

  return withMeteorUserId({ userId, impersonateUser }, () =>
    uploadFileToS3({
      file,
      docId: propertyId,
      id: category,
      collection: PROPERTIES_COLLECTION,
    }).then((downloadUrl) => {
      fs.unlink(path, (err) => {
        if (err) {
          throw new Meteor.Error(err);
        }
      });
      return downloadUrl;
    }));
};

export default uploadFileAPI;
