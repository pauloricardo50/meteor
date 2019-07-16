import { Meteor } from 'meteor/meteor';

import { apiProperty } from 'core/api/fragments';
import PropertyService from '../../../properties/server/PropertyService';
import { propertyUpdate } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema } from './helpers';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const updatePropertyAPI = ({
  user: { _id: userId },
  params,
  body: object,
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
      throw new Meteor.Error(`No property found for id "${propertyId}"`);
    }
  }

  return withMeteorUserId({ userId, impersonateUser }, () =>
    propertyUpdate.run({ propertyId, object }).then(() => {
      const property = PropertyService.fetchOne({
        $filters: { _id: propertyId },
        ...apiProperty(),
      });
      return Promise.resolve({
        status: HTTP_STATUS_CODES.OK,
        message: `Property with id "${params.propertyId}" updated !`,
        property,
      });
    }));
};

export default updatePropertyAPI;
