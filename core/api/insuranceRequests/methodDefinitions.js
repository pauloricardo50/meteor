import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const insuranceRequestInsert = new Method({
  name: 'insuranceRequestInsert',
  params: {
    insuranceRequest: Match.Maybe(Object),
    loanId: Match.Maybe(String),
    userId: Match.Maybe(String),
    assignees: Match.Maybe(Array),
    updateUserAssignee: Match.Maybe(Boolean),
    note: Match.Maybe(String),
    borrowerIds: Match.Maybe(Array),
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

export const insuranceRequestSetAdminNote = new Method({
  name: 'insuranceRequestSetAdminNote',
  params: {
    insuranceRequestId: String,
    adminNoteId: Match.Maybe(String),
    note: Object,
    notifyPros: Match.Maybe(Array),
  },
});

export const insuranceRequestRemoveAdminNote = new Method({
  name: 'insuranceRequestRemoveAdminNote',
  params: {
    insuranceRequestId: String,
    adminNoteId: String,
  },
});

export const insuranceRequestSetAssignees = new Method({
  name: 'insuranceRequestSetAssignees',
  params: {
    insuranceRequestId: String,
    assignees: Array,
    note: String,
    updateUserAssignee: Match.Optional(Boolean),
  },
});

export const insuranceRequestUpdateStatus = new Method({
  name: 'insuranceRequestUpdateStatus',
  params: {
    insuranceRequestId: String,
    status: String,
  },
});

export const insuranceRequestInsertBorrower = new Method({
  name: 'insuranceRequestInsertBorrower',
  params: { insuranceRequestId: String, amount: Match.Maybe(Number) },
});
