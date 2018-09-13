// @flow
import SimpleSchema from 'simpl-schema';
import { AMORTIZATION_TYPE } from '../loanConstants';
import { loanTranchesSchema } from './otherSchemas';

const StructureSchema = new SimpleSchema({
  amortization: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_TYPE),
    optional: true,
  },
  description: { type: String, optional: true },
  fortuneUsed: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  id: String,
  name: { type: String, optional: true },
  notaryFees: {
    type: Number,
    optional: true,
    max: 100000000,
    defaultValue: null,
  },
  propertyValue: {
    type: Number,
    optional: true,
    max: 1000000000,
    defaultValue: null,
  },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  propertyWork: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  secondPillarPledged: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  secondPillarWithdrawal: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  sortOffersBy: { type: String, optional: true },
  thirdPartyFortuneUsed: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  thirdPillarPledged: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
  },
  thirdPillarWithdrawal: {
    type: Number,
    min: 0,
    max: 100000000,
    defaultValue: 0,
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
