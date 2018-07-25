// @flow
import SimpleSchema from 'simpl-schema';
import {
  AMORTIZATION_STRATEGY_PRESET,
  INSURANCE_USE_PRESET,
} from '../loanConstants';
import { loanTranchesSchema } from './otherSchemas';

const StructureSchema = new SimpleSchema({
  id: String,
  amortization: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_STRATEGY_PRESET),
    optional: true,
  },
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
  description: { type: String, optional: true },
  fortuneUsed: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  loanValue: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  name: { type: String, optional: true },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  propertyWork: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  sortOffersBy: { type: String, optional: true },
  wantedLoan: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
  propertyValue: { type: Number, min: 0, max: 100000000, defaultValue: 0 },
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
  loanValue: number,
  name: string,
  offerId: string,
  propertyId: string,
  propertyWork: number,
  sortOffersBy: string,
  wantedLoan: number,
  propertyValue: number,
};

export default StructureSchema;
