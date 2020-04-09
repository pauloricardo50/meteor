import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const insuranceInsert = new Method({
  name: 'insuranceInsert',
  params: {
    insuranceRequestId: String,
    borrowerId: String,
    organisationId: String,
    insuranceProductId: String,
    insurance: Object,
  },
});

export const insuranceModify = new Method({
  name: 'insuranceModify',
  params: {
    insuranceId: String,
    borrowerId: String,
    organisationId: String,
    insuranceProductId: String,
    insurance: Object,
  },
});

export const insuranceSetAdminNote = new Method({
  name: 'insuranceSetAdminNote',
  params: {
    insuranceId: String,
    adminNoteId: Match.Maybe(String),
    note: Object,
    notifyPros: Match.Maybe(Array),
  },
});

export const insuranceRemoveAdminNote = new Method({
  name: 'insuranceRemoveAdminNote',
  params: {
    insuranceId: String,
    adminNoteId: String,
  },
});

export const insuranceRemove = new Method({
  name: 'insuranceRemove',
  params: {
    insuranceId: String,
  },
});
