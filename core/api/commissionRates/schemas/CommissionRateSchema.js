import SimpleSchema from 'simpl-schema';
import { percentageField, moneyField } from '../../helpers/sharedSchemas';

import { COMMISSION_RATES_TYPE } from '../commissionRateConstants';

const CommissionRateSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: Object.values(COMMISSION_RATES_TYPE),
    defaultValue: COMMISSION_RATES_TYPE.COMMISSIONS,
  },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': String,
  rates: { type: Array, defaultValue: [] },
  'rates.$': Object,
  'rates.$.rate': percentageField,
  'rates.$.threshold': { ...moneyField, defaultValue: 0 },
  'rates.$.date': {
    type: String,
    // MM-DD
    defaultValue: '01-01',
  },
});

export default CommissionRateSchema;
