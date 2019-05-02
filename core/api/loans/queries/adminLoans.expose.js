import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import query from './adminLoans';

exposeQuery(query, {
  embody: {
    $filter({ filters, params: { _id, owned, name } }) {
      if (_id) {
        filters._id = _id;
      }

      if (name) {
        filters.name = name;
      }

      if (owned) {
        filters.userId = { $exists: true };
      }
    },
  },
  validateParams: {
    _id: Match.Maybe(String),
    name: Match.Maybe(String),
    owned: Match.Maybe(Boolean),
  },
});
