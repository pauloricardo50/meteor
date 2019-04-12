import { Meteor } from 'meteor/meteor';
import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import { getInvitedByUserId } from './helpers';

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

const inviteCustomerToProPropertiesAPI = ({ user: { _id: userId }, body }) => {
  const { user, properties = [], referredBy } = body;

  checkProperties(properties);

  const externalProperties = getExternalProperties(properties);
  const internalProperties = getInternalProperties(properties);

  const formattedIds = formatPropertyIds([
    ...externalProperties.map(({ externalId }) => externalId),
    ...internalProperties.map(({ _id }) => _id),
  ]);

  let proId;
  if (referredBy) {
    proId = getInvitedByUserId({ userId, referredBy });
  }

  return withMeteorUserId(proId || userId, () =>
    proInviteUser.run({
      propertyIds: internalProperties.map(({ _id }) => _id),
      properties: externalProperties,
      user,
    })).then(() => ({
    message: `Successfully invited user "${
      user.email
    }" to property ids ${formattedIds}`,
  }));
};

export default inviteCustomerToProPropertiesAPI;
