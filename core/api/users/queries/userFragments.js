import { loanSummaryFragment } from '../../loans/queries/loanFragments';

export const simpleUserFragment = {
  email: 1,
  name: 1,
  phoneNumbers: 1,
  roles: 1,
};

export const fullUserFragment = {
  ...simpleUserFragment,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
  loans: loanSummaryFragment,
};

export const adminUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};

export const appUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
  loans: { _id: 1, name: 1, borrowers: { _id: 1 }, properties: { _id: 1 } },
  borrowers: { _id: 1 },
  properties: { _id: 1 },
};
