// @flow
import SimpleSchema from 'simpl-schema';
import { AMORTIZATION_TYPE, OWN_FUNDS_USAGE_TYPES } from '../loanConstants';
import { OWN_FUNDS_TYPES } from '../../constants';
import { loanTranchesSchema } from './otherSchemas';

const StructureSchema = new SimpleSchema({
  amortization: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_TYPE),
    optional: true,
  },
  description: { type: String, optional: true },
  id: String,
  mortgageNoteIds: { type: Array, optional: true },
  'mortgageNoteIds.$': String,
  name: { type: String, optional: true },
  notaryFees: {
    type: SimpleSchema.Integer,
    optional: true,
    max: 100000000,
    defaultValue: null,
  },
  propertyValue: {
    type: SimpleSchema.Integer,
    optional: true,
    max: 1000000000,
    defaultValue: null,
  },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  promotionOptionId: { type: String, optional: true },
  propertyWork: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  sortOffersBy: { type: String, optional: true },
  ownFunds: { type: Array, defaultValue: [] },
  'ownFunds.$': Object,
  'ownFunds.$.borrowerId': String,
  'ownFunds.$.type': {
    type: String,
    allowedValues: Object.values(OWN_FUNDS_TYPES),
  },
  'ownFunds.$.value': { type: SimpleSchema.Integer, min: 0, max: 1000000000 },
  'ownFunds.$.usageType': {
    type: String,
    optional: true,
    allowedValues: Object.values(OWN_FUNDS_USAGE_TYPES),
  },
  wantedLoan: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  ...loanTranchesSchema,
});

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

export default StructureSchema;
