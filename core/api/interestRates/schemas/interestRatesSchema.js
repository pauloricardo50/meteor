import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { TRENDS, INTEREST_RATES } from '../interestRatesConstants';

const singleInterestRate = type => ({
  [type]: Object,
  [`${type}.rateLow`]: { type: Number, min: 0, max: 1, optional: false },
  [`${type}.rateHigh`]: { type: Number, min: 0, max: 1, optional: false },
  [`${type}.trend`]: {
    type: String,
    allowedValues: Object.values(TRENDS),
    optional: false,
  },
});

const rates = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({ ...interestRates, ...singleInterestRate(type) }),
  {},
);

const InterestRatesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  date: { type: Date, optional: false },
  ...rates,
});

export default InterestRatesSchema;
