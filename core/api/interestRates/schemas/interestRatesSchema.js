import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { TRENDS, INTEREST_RATES } from '../interestRatesConstants';

const singleInterestRate = type => ({
  [type]: { type: Object, optional: true },
  [`${type}.rateLow`]: { type: Number, min: 0, max: 1, optional: true },
  [`${type}.rateHigh`]: { type: Number, min: 0, max: 1, optional: true },
  [`${type}.trend`]: {
    type: String,
    allowedValues: Object.values(TRENDS),
    optional: true,
  },
});

const rates = Object.values(INTEREST_RATES).reduce(
  (interestRates, type) => ({ ...interestRates, ...singleInterestRate(type) }),
  {},
);

const InterestRatesSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  date: Date,
  ...rates,
});

export default InterestRatesSchema;
