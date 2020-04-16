import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const borrowerInsert = new Method({
  name: 'borrowerInsert',
  params: { borrower: Object, userId: Match.Optional(String) },
});

export const borrowerUpdate = new Method({
  name: 'borrowerUpdate',
  params: { borrowerId: String, object: Object },
});

export const borrowerDelete = new Method({
  name: 'borrowerDelete',
  params: { borrowerId: String, loanId: Match.Optional(String) },
});

export const pushBorrowerValue = new Method({
  name: 'pushBorrowerValue',
  params: { borrowerId: String, object: Object },
});

export const popBorrowerValue = new Method({
  name: 'popBorrowerValue',
  params: { borrowerId: String, object: Object },
});

export const pullBorrowerValue = new Method({
  name: 'pullBorrowerValue',
  params: { borrowerId: String, object: Object },
});

export const getReusableBorrowers = new Method({
  name: 'getReusableBorrowers',
  params: {
    loanId: Match.Maybe(Match.OneOf(String, undefined)),
    insuranceRequestId: Match.Maybe(Match.OneOf(String, undefined)),
  },
  doNotRefetchQueries: true,
});
