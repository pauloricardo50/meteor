import { Meteor } from 'meteor/meteor';

import omit from 'lodash/omit';
import SimpleSchema from 'simpl-schema';

import { proProperties } from '../../../properties/queries';
import PropertyService from '../../../properties/server/PropertyService';
import { HTTP_STATUS_CODES } from '../restApiConstants';
import { checkQuery, getImpersonateUserId } from './helpers';

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

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const [property] = proProperties
    .clone({ _id: propertyId })
    .fetch({ userId: proId || userId });

  const filteredProperty = omit(property, [
    'additionalDocuments',
    'promotion',
    'users',
    'organisation',
  ]);

  return { property: filteredProperty };
};

export default getPropertyAPI;
