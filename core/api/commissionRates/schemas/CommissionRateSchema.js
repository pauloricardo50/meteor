import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { percentageField, moneyField } from '../../helpers/sharedSchemas';

import { COMMISSION_RATES_TYPE } from '../commissionRateConstants';

const CommissionRateSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: Object.values(COMMISSION_RATES_TYPE),
    defaultValue: COMMISSION_RATES_TYPE.COMMISSIONS,
    uniforms: {
      transform: type =>
        type === COMMISSION_RATES_TYPE.COMMISSIONS
          ? 'e-Potek -> Organisation'
          : 'Organisation -> e-Potek',
    },
  },
  organisationLink: { type: Object, optional: true },
  'organisationLink._id': { type: String, optional: true },
  rates: { type: Array, defaultValue: [] },
  'rates.$': Object,
  'rates.$.rate': { ...percentageField },
  'rates.$.threshold': { ...moneyField, defaultValue: 0 },
  'rates.$.startDate': {
    type: String,
    // MM-DD
    defaultValue: '01-01',
    uniforms: {
      type: CUSTOM_AUTOFIELD_TYPES.DATE,
      getProps: props => ({
        value:
          props.value &&
          moment(
            new Date(
              `${new Date().getFullYear()}-${props.value
                .split('-')
                .slice(1)
                .join('-')}`,
            ),
          ).format('YYYY-MM-DD'),
      }),
    },
  },
});

export default CommissionRateSchema;
