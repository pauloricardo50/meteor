import { Match } from 'meteor/check';
import { Method } from '../methods/methods';

export const insuranceRequestInsert = new Method({
  name: 'insuranceRequestInsert',
  params: {
    insuranceRequest: Match.Maybe(Object),
    loanId: Match.Maybe(String),
    userId: Match.Maybe(String),
    assigneeId: Match.Maybe(String),
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
