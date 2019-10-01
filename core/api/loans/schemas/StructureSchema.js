// @flow
import SimpleSchema from 'simpl-schema';

import { OWN_FUNDS_TYPES } from '../../constants';
import { moneyField, roundedInteger } from '../../helpers/sharedSchemas';
import { CUSTOM_AUTOFIELD_TYPES } from '../../../components/AutoForm2/constants';
import { AMORTIZATION_TYPE, OWN_FUNDS_USAGE_TYPES } from '../loanConstants';
import { loanTranchesSchema } from './otherSchemas';

export const structureSchema = {
  amortization: { ...moneyField, defaultValue: 0 },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_TYPE),
    optional: true,
  },
  description: { type: String, optional: true },
  disabled: { type: Boolean, defaultValue: false },
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
  'ownFunds.$.value': { ...moneyField, optional: false },
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
  ...loanTranchesSchema,
};

export type structureType = {
  id: string,
  amortization: number,
  amortizationType: string,
  description: string,
  name: string,
  offerId: string,
  propertyId: string,
  propertyWork: number,
  sortOffersBy: string,
  wantedLoan: number,
  ownFunds: Array<Object>,
};

export default new SimpleSchema(structureSchema);
