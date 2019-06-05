import moment from 'moment';

import { currentInterestRates, interestRates } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';

exposeQuery(
  currentInterestRates,
  {
    firewall(userId) {},
    embody(body) {
      body.$filter = ({ filters }) => {
        filters.date = { $lte: moment().toDate() };
      };
      body.$options = { sort: { date: -1 }, limit: 1 };
    },
  },
  {},
);

exposeQuery(interestRates, {}, { allowFilterById: true });
