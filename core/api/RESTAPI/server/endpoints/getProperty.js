import omit from 'lodash/omit';
import SimpleSchema from 'simpl-schema';

import PropertyService from 'core/api/properties/server/PropertyService';
import { Meteor } from 'meteor/meteor';
import { getImpersonateUserId, checkQuery } from './helpers';
import { proProperties } from '../../../properties/queries';
import { HTTP_STATUS_CODES } from '../restApiConstants';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const getPropertyAPI = ({ user: { _id: userId }, params, query }) => {
  let { propertyId } = params;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
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

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const [property] = proProperties
    .clone({ _id: propertyId })
    .fetch({ userId: proId || userId });

  const filteredProperty = omit(property, [
    'adminValidation',
    'additionalDocuments',
    'promotion',
    'users',
    'organisation',
  ]);

  return { property: filteredProperty };
};

export default getPropertyAPI;
