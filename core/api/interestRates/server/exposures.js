import moment from 'moment';

import { exposeQuery } from '../../queries/queryHelpers';
import { currentInterestRates, interestRates } from '../queries';

exposeQuery({
  query: currentInterestRates,
  overrides: {
    firewall(userId) {},
    embody(body) {
      body.$filter = ({ filters }) => {
        filters.date = { $lte: moment().toDate() };
      };
      body.$options = { sort: { date: -1 }, limit: 1 };
    },
  },
});

exposeQuery({ query: interestRates, options: { allowFilterById: true } });
