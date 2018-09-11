// @flow
import SimpleSchema from 'simpl-schema';
import { AMORTIZATION_TYPE, OWN_FUNDS_USAGE_TYPES } from '../loanConstants';
import { OWN_FUNDS_SOURCES } from '../../constants';
import { loanTranchesSchema } from './otherSchemas';

const StructureSchema = new SimpleSchema({
  amortization: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_TYPE),
    optional: true,
  },
  description: { type: String, optional: true },
  id: String,
  name: { type: String, optional: true },
  notaryFees: {
    type: Number,
    optional: true,
    max: 100000000,
    defaultValue: null,
  },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  propertyWork: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  sortOffersBy: { type: String, optional: true },
  ownFunds: { type: Array, defaultValue: [] },
  'ownFunds.$': Object,
  'ownFunds.$.borrowerId': String,
  'ownFunds.$.source': {
    type: String,
    allowedValues: Object.values(OWN_FUNDS_SOURCES),
  },
  'ownFunds.$.value': { type: Number, min: 0, max: 1000000000 },
  'ownFunds.$.usageType': {
    type: String,
    optional: true,
    allowedValues: Object.values(OWN_FUNDS_USAGE_TYPES),
  },
  wantedLoan: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  ...loanTranchesSchema,
});

export type structureType = {
  id: string,
  amortization: number,
  amortizationType: string,
  secondPillarPledged: number,
  secondPillarWithdrawal: string,
  thirdPillarPledged: string,
  thirdPillarWithdrawal: string,
  description: string,
  fortuneUsed: number,
  name: string,
  offerId: string,
  propertyId: string,
  propertyWork: number,
  sortOffersBy: string,
  wantedLoan: number,
};

export default StructureSchema;
