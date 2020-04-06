import { Meteor } from 'meteor/meteor';

import { arrayify } from '../../../../utils/general';
import PropertySchema, {
  userAllowedKeys,
} from '../../../properties/schemas/PropertySchema';
import PropertyService from '../../../properties/server/PropertyService';
import { proInviteUser } from '../../../users/methodDefinitions';
import { updateCustomerReferral, withMeteorUserId } from '../helpers';
import { checkQuery, impersonateSchema } from './helpers';

const formatPropertyIds = propertyIds => {
  const ids = propertyIds.map(id => `"${id}"`);
  return [ids.slice(0, -1).join(', '), ids.slice(-1)[0]].join(
    ids.length < 2 ? '' : ' and ',
  );
};

const checkProperties = properties => {
  const schema = PropertySchema.pick(...userAllowedKeys);

  return arrayify(properties).map(property => {
    const { _id, externalId } = property;
    if ((!_id && !externalId) || (_id && externalId)) {
      throw new Meteor.Error(
        'Each property must have either a "_id" or "externalId" key',
      );
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
  let { user, properties = [], shareSolvency, invitationNote } = body;
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

  const payload = {
    propertyIds: internalProperties.map(({ _id }) => _id),
    properties: externalProperties,
    user,
    shareSolvency,
    invitationNote,
  };

  if (!payload.propertyIds.length && !payload.properties.length) {
    throw new Meteor.Error('You must provide at least one valid property');
  }

  return withMeteorUserId({ userId, impersonateUser }, () =>
    proInviteUser.run(payload),
  )
    .then(() =>
      updateCustomerReferral({ customer: user, userId, impersonateUser }),
    )
    .then(() => ({
      message: `Successfully invited user "${user.email}" to property ids ${formattedIds}`,
    }));
};

export default inviteCustomerToProPropertiesAPI;
