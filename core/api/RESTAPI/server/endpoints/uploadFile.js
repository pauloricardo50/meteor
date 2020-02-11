import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { PROPERTY_DOCUMENTS, FILE_ROLES } from '../../../files/fileConstants';
import FileService from '../../../files/server/FileService';
import Security from '../../../security';
import PropertyService from '../../../properties/server/PropertyService';
import { PROPERTIES_COLLECTION } from '../../../properties/propertyConstants';
import { withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema, getImpersonateUserId } from './helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';
import { getFileRolesArray } from '../../../files/fileHelpers';

const getInvalidRole = roles => {
  const rolesArray = getFileRolesArray({ roles });
  let invalidRole;

  rolesArray.some(role => {
    if (
      Object.values(FILE_ROLES)
        // API should not allow user files
        .filter(r => r !== FILE_ROLES.USER)
        .includes(role)
    ) {
      return false;
    }
    invalidRole = role;
    return true;
  });

  return invalidRole;
};

const getErrorMessage = ({ value }) => {
  const invalidRole = getInvalidRole(value);
  return `Role "${invalidRole}" is invalid. Please provide any of [${Object.values(
    FILE_ROLES,
  )
    .filter(role => role !== FILE_ROLES.USER)
    .map(role => `'${role}'`)
    .join(', ')}] roles, separated by a comma`;
};

SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      invalidRole: getErrorMessage,
    },
  },
});

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
  roles: {
    type: String,
    defaultValue: 'public',
    optional: true,
    custom() {
      return getInvalidRole(this.value) ? 'invalidRole' : undefined;
    },
  },
});

const uploadFileAPI = req => {
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

  const { category, roles } = cleanBody;
  let { propertyId } = cleanBody;

  const exists = PropertyService.exists(propertyId);

  if (!exists) {
    const propertyByExternalId = PropertyService.get(
      { externalId: propertyId },
      { _id: 1 },
    );
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
      roles,
    });
  });
};

export default uploadFileAPI;
