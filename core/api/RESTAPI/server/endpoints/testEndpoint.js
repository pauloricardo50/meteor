import pick from 'lodash/pick';

import { withMeteorUserId } from '../helpers';

const testEndpointAPI = ({ user, body, params, query }) => {
  const { _id: userId } = user;

  return withMeteorUserId(userId, () =>
    JSON.stringify({
      user: pick(user, [
        'emails',
        'createdAt',
        'updatedAt',
        'firstName',
        'lastName',
        'phoneNumbers',
      ]),
      body,
      query,
      params,
    }));
};

export default testEndpointAPI;
