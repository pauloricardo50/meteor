import moment from 'moment';

import { exposeQuery } from '../../queries/queryHelpers';
import { currentInterestRates, interestRates } from '../queries';
import { INTEREST_RATES } from '../interestRatesConstants';

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

exposeQuery({
  query: interestRates,
  options: { allowFilterById: true },
  overrides: {
    firewall(userId) {},
    embody(body) {
      body.$postFilter = (rates = []) =>
        rates.map(rate => {
          const { _id, date } = rate;
          return Object.values(INTEREST_RATES).reduce(
            (formattedRate, key) => ({
              ...formattedRate,
              [key]: rate[key] || {},
            }),
            { _id, date },
          );
        });
    },
  },
});
