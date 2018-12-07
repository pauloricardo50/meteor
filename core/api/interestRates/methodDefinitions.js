import { Method } from '../methods/methods';

export const interestRatesInsert = new Method({
  name: 'interestRatesInsert',
  params: {
    interestRates: Object,
  },
});

export const interestRatesRemove = new Method({
  name: 'interestRatesRemove',
  params: {
    interestRatesId: String,
  },
});

export const interestRatesUpdate = new Method({
  name: 'interestRatesUpdate',
  params: {
    interestRatesId: String,
    object: Object,
  },
});
