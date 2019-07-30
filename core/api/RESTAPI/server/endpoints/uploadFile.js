import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { PROPERTY_DOCUMENTS } from '../../../files/fileConstants';
import FileService from '../../../files/server/FileService';
import Security from '../../../security';
import PropertyService from '../../../properties/server/PropertyService';
import { PROPERTIES_COLLECTION } from '../../../properties/propertyConstants';
import { withMeteorUserId } from '../helpers';
import {
  checkQuery,
  impersonateSchema,
  getImpersonateUserId,
} from './helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const bodySchema = new SimpleSchema({
  propertyId: String,
  category: {
    type: String,
    allowedValues: [...Object.values(PROPERTY_DOCUMENTS)],
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

  const { category } = cleanBody;
  let { propertyId } = cleanBody;

  const exists = PropertyService.exists(propertyId);

  if (!exists) {
    const propertyByExternalId = PropertyService.fetchOne({
      $filters: { externalId: propertyId },
    });
    if (propertyByExternalId) {
      propertyId = propertyByExternalId._id;
    } else {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.NOT_FOUND,
        `No property found for id "${propertyId}"`,
      );
    }
  }

  if (!file) {
    throw new Meteor.Error('No file uploaded');
  }
  return withMeteorUserId({ userId, impersonateUser }, () => {
    let impersonateUserId;
    if (impersonateUser) {
      impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
    }

    try {
      Security.properties.isAllowedToManageDocuments({
        userId: impersonateUserId || userId,
        propertyId,
      });
    } catch (error) {
      throw new Meteor.Error(HTTP_STATUS_CODES.FORBIDDEN, error);
    }

    return FileService.uploadFileAPI({
      file,
      docId: propertyId,
      id: category,
      collection: PROPERTIES_COLLECTION,
    });
  });
};

export default uploadFileAPI;
