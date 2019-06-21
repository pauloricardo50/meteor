import { Meteor } from 'meteor/meteor';

import PropertyService from '../../../properties/server/PropertyService';
import { proPropertyInsert } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema, getImpersonateUserId } from './helpers';

const insertPropertyAPI = ({
  user: { _id: userId },
  body: property,
  query,
}) => {
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  const { externalId } = property;

  if (externalId) {
    const propertyByExternalId = PropertyService.fetchOne({
      $filters: { externalId },
    });

    if (propertyByExternalId) {
      throw new Meteor.Error(`A property with externalId "${externalId}" already exists !`);
    }
  }

  return withMeteorUserId({ userId, impersonateUser }, () => {
    let impersonateUserId;
    if (impersonateUser) {
      impersonateUserId = getImpersonateUserId({ userId, impersonateUser });
    }
    return proPropertyInsert
      .run({ userId: impersonateUserId || userId, property })
      .then(propertyId => ({
        message: `Successfully inserted property with id "${propertyId}"`,
      }));
  });
};

export default insertPropertyAPI;
