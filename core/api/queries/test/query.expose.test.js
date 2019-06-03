import query from './query.test';
import { exposeQuery } from '../queryHelpers';

exposeQuery(query, {
  firewall(userId, params) {
    return null;
  },
});
