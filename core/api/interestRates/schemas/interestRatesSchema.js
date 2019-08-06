import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  percentageField,
} from '../../helpers/sharedSchemas';
import { TRENDS, INTEREST_RATES } from '../interestRatesConstants';

const singleInterestRate = type => ({
  [type]: { type: Object, optional: true, defaultValue: {} },
  [`${type}.rateLow`]: percentageField,
  [`${type}.rateHigh`]: percentageField,
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
