// @flow
import { LOAN_STATUS } from './loanConstants';

import type { structureType as _structureType } from './schemas/StructureSchema';

export type loanType = {
  userId: string,
  createdAt: Date,
  updatedAt: Date,
  status: $Values<LOAN_STATUS>,
};
export type structureType = _structureType;
