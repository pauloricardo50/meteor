import SimpleSchema from 'simpl-schema';
import {
  AMORTIZATION_STRATEGY_PRESET,
  INSURANCE_USE_PRESET,
} from '../loanConstants';
import { loanTranchesSchema } from './GeneralSchema';

const StructureSchema = new SimpleSchema({
  id: String,
  amortization: { type: Number, min: 0, max: 100000000, optional: true },
  amortizationType: {
    type: String,
    allowedValues: Object.values(AMORTIZATION_STRATEGY_PRESET),
    optional: true,
  },
  '2ndPillarUsed': { type: Number, min: 0, max: 100000000, optional: true },
  '2ndPillarUsageType': {
    type: String,
    allowedValues: Object.values(INSURANCE_USE_PRESET),
    optional: true,
  },
  '3rdPillarUsed': { type: Number, min: 0, max: 100000000, optional: true },
  description: { type: String, optional: true },
  fortuneUsed: { type: Number, min: 0, max: 100000000, optional: true },
  loanValue: { type: Number, min: 0, max: 100000000, optional: true },
  name: { type: String, optional: true },
  offerId: { type: String, optional: true },
  propertyId: { type: String, optional: true },
  propertyWork: { type: Number, min: 0, max: 100000000, optional: true },
  sortOffersBy: { type: String, optional: true },
  wantedLoan: { type: Number, min: 0, max: 100000000, optional: true },
  ...loanTranchesSchema,
});

export default StructureSchema;
