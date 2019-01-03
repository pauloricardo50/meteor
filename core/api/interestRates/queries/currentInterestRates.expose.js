import moment from 'moment';

import SecurityService from '../../security';
import query from './currentInterestRates';

query.expose({
  firewall(userId) {},
  embody(body) {
    body.$filter = ({ filters }) => {
      filters.date = { $lte: moment().toDate() };
    };
    body.$options = { sort: { date: -1 }, limit: 1 };
  },
  validateParams: {},
});
