// @flow
import { LOAN_STATUS } from './loanConstants';

export type loanType = {
  userId: string,
  createdAt: Date,
  updatedAt: Date,
  status: $Values<LOAN_STATUS>,
};
