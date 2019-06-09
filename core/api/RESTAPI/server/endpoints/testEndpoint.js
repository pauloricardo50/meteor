import pick from 'lodash/pick';

const testEndpointAPI = ({ user, body, params, query }) => ({
  user: pick(user, ['emails', 'firstName', 'lastName', 'phoneNumbers']),
  body,
  query,
  params,
});

export default testEndpointAPI;
