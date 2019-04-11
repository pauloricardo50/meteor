import { Meteor } from 'meteor/meteor';
import { proInviteUser } from '../../../methods';
import { withMeteorUserId } from '../helpers';
import UserService from '../../../users/server/UserService';

const formatPropertyIds = (propertyIds) => {
  const ids = propertyIds.map(id => `"${id}"`);
  return [ids.slice(0, -1).join(', '), ids.slice(-1)[0]].join(ids.length < 2 ? '' : ' and ');
};

const getInvitedByUserId = ({ userId, invitedByEmail }) => {
  const { organisations: userOrganisationIds = [] } = UserService.fetchOne({
    $filters: { _id: userId },
    organisations: { _id: 1 },
  });
  const { _id: proId, organisations: proOrganisationIds = [] } = UserService.fetchOne({
    $filters: { 'emails.address': { $in: [invitedByEmail] } },
    organisations: { _id: 1 },
  }) || {};

  if (!proId) {
    throw new Meteor.Error(`No user found for email address "${invitedByEmail}"`);
  }

  if (
    userOrganisationIds.length === 0
    || proOrganisationIds.length === 0
    || userOrganisationIds[0]._id !== proOrganisationIds[0]._id
  ) {
    throw new Meteor.Error(`User with email address "${invitedByEmail}" is not part of your organisation`);
  }

  return proId;
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
  const { user, properties = [], invitedByEmail } = body;

  checkProperties(properties);

  const externalProperties = getExternalProperties(properties);
  const internalProperties = getInternalProperties(properties);

  const formattedIds = formatPropertyIds([
    ...externalProperties.map(({ externalId }) => externalId),
    ...internalProperties.map(({ _id }) => _id),
  ]);

  let proId;
  if (invitedByEmail) {
    proId = getInvitedByUserId({ userId, invitedByEmail });
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
