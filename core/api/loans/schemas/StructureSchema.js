import SimpleSchema from 'simpl-schema';

import { MIN_INSURANCE2_WITHDRAW } from '../../../config/financeConstants';
import { OWN_FUNDS_TYPES } from '../../constants';
import {
  moneyField,
  roundedInteger,
  percentageField,
} from '../../helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';
import { AMORTIZATION_TYPE, OWN_FUNDS_USAGE_TYPES } from '../loanConstants';
import { loanTranchesSchema } from './otherSchemas';

SimpleSchema.setDefaultMessages({
  messages: {
    fr: {
      insurance2WithdrawNotEnough:
        'Vous devez retirer au minimum CHF 20 000 de LPP',
    },
  },
});

export const structureSchema = {
  amortization: { ...moneyField, defaultValue: 0 },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_TYPE),
    optional: true,
  },
  description: { type: String, optional: true },
  disabled: { type: Boolean, defaultValue: false },
  firstRank: { ...percentageField, min: 0 },
  id: String,
  mortgageNoteIds: { type: Array, optional: true },
  'mortgageNoteIds.$': String,
  name: { type: String, optional: true },
  notaryFees: { ...moneyField, defaultValue: null },
  propertyValue: { ...moneyField, defaultValue: null },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  promotionOptionId: { type: String, optional: true },
  propertyWork: { ...moneyField, defaultValue: 0 },
  sortOffersBy: { type: String, optional: true },
  ownFunds: { type: Array, defaultValue: [] },
  'ownFunds.$': Object,
  'ownFunds.$.borrowerId': String,
  'ownFunds.$.type': {
    type: String,
    allowedValues: Object.values(OWN_FUNDS_TYPES),
    optional: true,
  },
  'ownFunds.$.value': {
    ...moneyField,
    optional: false,
    custom() {
      const isInsurance2Withdraw =
        this.siblingField('type').value === OWN_FUNDS_TYPES.INSURANCE_2 &&
        this.siblingField('usageType').value === OWN_FUNDS_USAGE_TYPES.WITHDRAW;
      if (isInsurance2Withdraw && this.value < MIN_INSURANCE2_WITHDRAW) {
        return 'insurance2WithdrawNotEnough';
      }
    },
  },
  'ownFunds.$.usageType': {
    type: String,
    optional: true,
    allowedValues: Object.values(OWN_FUNDS_USAGE_TYPES),
  },
  'ownFunds.$.description': {
    type: String,
    optional: true,
  },
  wantedLoan: {
    ...roundedInteger({ digits: 3, func: 'floor', min: 100000 }),
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.MONEY },
  },
  yearlyAmortization: { ...moneyField },
  ...loanTranchesSchema,
};

export default new SimpleSchema(structureSchema);
