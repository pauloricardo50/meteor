import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getImpersonateUserId, checkQuery } from './helpers';
import UserService from '../../../users/server/UserService';

const querySchema = new SimpleSchema({
  'impersonate-user': { type: String, optional: true },
});

const formatPropertyIds = (propertyIds) => {
  const ids = propertyIds.map(id => `"${id}"`);
  return [ids.slice(0, -1).join(', '), ids.slice(-1)[0]].join(ids.length < 2 ? '' : ' and ');
};

const checkProperties = (properties) => {
  properties.forEach((property) => {
    const { _id, externalId } = property;
    if ((!_id && !externalId) || (_id && externalId)) {
      throw new Meteor.Error('Every property must have either a "_id" or "externalId" key');
    }
  });
};

const getExternalProperties = properties =>
  properties.filter(({ externalId }) => externalId);
const getInternalProperties = properties => properties.filter(({ _id }) => _id);

const inviteCustomerToProPropertiesAPI = ({
  user: { _id: userId },
  body,
  query,
}) => {
  const { user, properties = [], shareSolvency = false } = body;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: querySchema,
  });

  checkProperties(properties);

  const externalProperties = getExternalProperties(properties);
  const internalProperties = getInternalProperties(properties);

  const formattedIds = formatPropertyIds([
    ...externalProperties.map(({ externalId }) => externalId),
    ...internalProperties.map(({ _id }) => _id),
  ]);

  let proId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      propertyIds: internalProperties.map(({ _id }) => _id),
      properties: externalProperties,
      user,
      shareSolvency,
    }))
    .then(() => {
      if (impersonateUser) {
        const customerId = UserService.getByEmail(user.email)._id;
        return UserService.setReferredByOrganisation({
          userId: customerId,
          organisationId: UserService.getUserMainOrganisationId(userId),
        });
      }
      return Promise.resolve();
    })
    .then(() => ({
      message: `Successfully invited user "${
        user.email
      }" to property ids ${formattedIds}`,
    }));
};

export default inviteCustomerToProPropertiesAPI;
