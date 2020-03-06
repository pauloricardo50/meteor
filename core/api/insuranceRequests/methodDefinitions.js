import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const insuranceRequestInsert = new Method({
  name: 'insuranceRequestInsert',
  params: {
    insuranceRequest: Object,
    loanId: Match.Maybe(String),
    userId: Match.Maybe(String),
    assigneeId: Match.Maybe(String),
  },
});

export const insuranceRequestRemove = new Method({
  name: 'insuranceRequestRemove',
  params: { insuranceRequestId: String },
});

export const insuranceRequestUpdate = new Method({
  name: 'insuranceRequestUpdate',
  params: { insuranceRequestId: String, object: Object },
});
