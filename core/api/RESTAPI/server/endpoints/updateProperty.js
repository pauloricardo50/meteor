import { Meteor } from 'meteor/meteor';

import PropertyService from '../../../properties/server/PropertyService';
import { propertyUpdate } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema } from './helpers';

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
    propertyUpdate.run({ propertyId, object }));
};

export default updatePropertyAPI;
