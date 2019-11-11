import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import FileService from '../../../files/server/FileService';
import Security from '../../../security';
import PropertyService from '../../../properties/server/PropertyService';
import { PROPERTIES_COLLECTION } from '../../../properties/propertyConstants';
import { withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema, getImpersonateUserId } from './helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const bodySchema = new SimpleSchema({
  propertyId: String,
  key: String,
});

const deleteFileAPI = req => {
  const {
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

  const { key } = cleanBody;
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

    return FileService.deleteFileAPI({
      docId: propertyId,
      key,
      collection: PROPERTIES_COLLECTION,
    });
    // return deleteFileFromS3({
    //   docId: propertyId,
    //   key,
    //   collection: PROPERTIES_COLLECTION,
    // }).then(deleted => ({ deletedFiles: deleted }));
  });
};

export default deleteFileAPI;
