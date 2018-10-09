import { loanBaseFragment } from '../../../loans/queries/loanFragments';
import { simpleUserFragment } from './userFragments';

export const fullUserFragment = {
  ...simpleUserFragment,
  assignedEmployee: simpleUserFragment,
  emails: 1,
  createdAt: 1,
  updatedAt: 1,
  loans: loanBaseFragment,
};

export const adminUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};

export const appUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
  loans: {
    _id: 1,
    name: 1,
    borrowers: { _id: 1 },
    general: 1,
    logic: { step: 1 },
  },
  borrowers: { _id: 1, name: 1 },
  properties: { _id: 1 },
};

export const proUserFragment = {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
  promotions: { name: 1 },
  properties: { address: 1 },
};
