import { Match } from 'meteor/check';
import query from '../query2.test';
import { exposeQuery } from '../../queryHelpers';

exposeQuery(query, {
  firewall(userId, params) {
    return null;
  },
  // Embody object
  embody: {
    $options: {
      sort: { value: 1 },
      limit: 10,
    },
    // Must use a function, to not be overriden by defaultFilter
    $filter: ({ filters, params }) => {
      filters.value = { $gt: 20 };
    },
  },
  validateParams: {
    name: Match.Maybe(String),
  },
});
