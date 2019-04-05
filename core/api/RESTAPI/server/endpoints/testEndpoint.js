import pick from 'lodash/pick';

const testEndpointAPI = ({ user, body, params, query }) =>
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
  });

export default testEndpointAPI;
