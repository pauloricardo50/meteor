import { loanSummary } from '../../loans/queries/loanFragments';

export const simpleUser = {
  email: 1,
  name: 1,
  phoneNumbers: 1,
  roles: 1,
};

export const fullUser = {
  ...simpleUser,
  createdAt: 1,
  updatedAt: 1,
  loans: loanSummary,
};

export const adminUser = {
  ...fullUser,
  assignedEmployee: simpleUser,
};

export const appUser = {
  ...fullUser,
  assignedEmployee: simpleUser,
  loans: { _id: 1, name: 1, borrowers: { _id: 1 }, properties: { _id: 1 } },
  borrowers: { _id: 1 },
  properties: { _id: 1 },
};
