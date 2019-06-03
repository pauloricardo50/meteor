import { Match } from 'meteor/check';
import query from '../query1.test';
import { exposeQuery } from '../../queryHelpers';

exposeQuery(query, {
  firewall(userId, params) {
    return null;
  },
  // Embody function
  embody: (body, params) => {
    body.$options = { sort: { value: 1 }, limit: 10 };
    body.$filters = { value: { $gt: 20 } };
  },
  validateParams: {
    name: Match.Maybe(String),
  },
});
