import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { checkQuery, impersonateSchema } from './helpers';
import PropertyService from '../../../properties/server/PropertyService';
import { withMeteorUserId } from '../helpers';
import { propertyPermissionsSchema } from '../../../properties/schemas/PropertySchema';
import UserService from '../../../users/server/UserService';
import {
  addProUserToProperty,
  setProPropertyPermissions,
} from '../../../methods';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const bodySchema = new SimpleSchema({
  email: String,
  permissions: Object,
  ...Object.keys(propertyPermissionsSchema).reduce(
    (permissions, key) => ({
      ...permissions,
      [`permissions.${key}`]: propertyPermissionsSchema[key],
    }),
    {},
  ),
});

const addProUserToPropertyAPI = ({
  user: { _id: userId },
  params,
  body,
  query,
}) => {
  let { propertyId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

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

  const cleanBody = bodySchema.clean(body);
  try {
    bodySchema.validate(cleanBody);
  } catch (error) {
    throw new Meteor.Error(error);
  }

  return withMeteorUserId({ userId, impersonateUser }, () => {
    const { email, permissions } = cleanBody;

    const proUser = UserService.getByEmail(email);

    if (!proUser) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.NOT_FOUND,
        `No user found with email "${email}"`,
      );
    }

    const { users = [] } = PropertyService.fetchOne({
      $filters: { _id: propertyId },
      users: { email: 1 },
    });

    if (users.some(({ email: userEmail }) => userEmail === email)) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        `User with email "${email}" is already part of property with id "${params.propertyId}".`,
      );
    }

    return addProUserToProperty
      .run({
        propertyId,
        userId: proUser._id,
      })
      .then(() =>
        setProPropertyPermissions.run({
          propertyId,
          userId: proUser._id,
          permissions,
        }))
      .then(() => {
        const property = PropertyService.fetchOne({
          $filters: { _id: propertyId },
          users: { _id: 1 },
        });

        const {
          $metadata: { permissions: newPermissions },
        } = property.users.find(({ _id }) => _id === proUser._id);

        return Promise.resolve({
          status: HTTP_STATUS_CODES.OK,
          message: `User with email "${email}" sucessfully added on property with id "${params.propertyId}" !`,
          permissions: newPermissions,
        });
      });
  });
};

export default addProUserToPropertyAPI;
