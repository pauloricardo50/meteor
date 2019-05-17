import { Meteor } from 'meteor/meteor';

import PropertyService from 'core/api/properties/server/PropertyService';
import { proInviteUser } from '../../../methods';
import UserService from '../../../users/server/UserService';
import PropertySchema, {
  userAllowedKeys,
} from '../../../properties/schemas/PropertySchema';
import { withMeteorUserId } from '../helpers';
import { getImpersonateUserId, checkQuery, impersonateSchema } from './helpers';

const formatPropertyIds = (propertyIds) => {
  const ids = propertyIds.map(id => `"${id}"`);
  return [ids.slice(0, -1).join(', '), ids.slice(-1)[0]].join(ids.length < 2 ? '' : ' and ');
};

const checkProperties = (properties) => {
  const schema = PropertySchema.pick(...userAllowedKeys);

  return properties.map((property) => {
    const { _id, externalId } = property;
    if ((!_id && !externalId) || (_id && externalId)) {
      throw new Meteor.Error('Each property must have either a "_id" or "externalId" key');
    }
    if (_id) {
      const exists = PropertyService.exists(_id);
      if (!exists) {
        throw new Meteor.Error(`Property with _id "${_id}" does not exist`);
      }
    } else {
      return checkQuery({ schema, query: property });
    }

    return property;
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
  let { user, properties = [], shareSolvency } = body;
  const { 'impersonate-user': impersonateUser } = checkQuery({
    query,
    schema: impersonateSchema,
  });

  properties = checkProperties(properties);
  const externalProperties = getExternalProperties(properties);
  const internalProperties = getInternalProperties(properties);

  const formattedIds = formatPropertyIds([
    ...externalProperties.map(({ externalId }) => externalId),
    ...internalProperties.map(({ _id }) => _id),
  ]);

  let proId = userId;
  if (impersonateUser) {
    proId = getImpersonateUserId({ userId, impersonateUser });
  }

  const payload = {
    propertyIds: internalProperties.map(({ _id }) => _id),
    properties: externalProperties,
    user,
    shareSolvency,
  };

  if (!payload.propertyIds.length && !payload.properties.length) {
    throw new Meteor.Error('You must provide at least one valid property');
  }

  return withMeteorUserId(proId, () => proInviteUser.run(payload))
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
