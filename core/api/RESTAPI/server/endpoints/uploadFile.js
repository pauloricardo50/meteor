import { Meteor } from 'meteor/meteor';
import fs from 'fs';
import SimpleSchema from 'simpl-schema';

import { PROPERTY_DOCUMENTS } from 'core/api/files/fileConstants';
import Security from '../../../security';
import PropertyService from '../../../properties/server/PropertyService';
import { PROPERTIES_COLLECTION } from '../../../properties/propertyConstants';
import { withMeteorUserId } from '../helpers';
import {
  checkQuery,
  impersonateSchema,
  getImpersonateUserId,
  uploadFileToS3,
} from './helpers';

const bodySchema = new SimpleSchema({
  propertyId: String,
  category: {
    type: String,
    custom() {
      if (this.field('propertyId')) {
        return Object.values(PROPERTY_DOCUMENTS).includes(this.value)
          ? undefined
          : 'invalidCategory';
      }
    },
  },
});

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

  const cleanBody = bodySchema.clean(body);
  try {
    bodySchema.validate(cleanBody);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  const { propertyId, category } = cleanBody;

  if (propertyId) {
    const property = PropertyService.get(propertyId);
    if (!property) {
      throw new Meteor.Error(`Property with id "${propertyId}" not found`);
    }
  }

  if (!file) {
    throw new Meteor.Error('No file uploaded');
  }
  const { path } = file;

  return withMeteorUserId({ userId, impersonateUser }, () => {
    let impersonateUserId;
    if (impersonateUser) {
      impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
    }

    Security.properties.isAllowedToManageDocuments({
      userId: impersonateUserId || userId,
      propertyId,
    });

    return uploadFileToS3({
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
    });
  });
};

export default uploadFileAPI;
