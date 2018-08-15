import {
  userPropertyFragment,
  adminPropertyFragment,
} from '../../properties/queries/propertyFragments';
import { appUserFragment } from '../../users/queries/userFragments';
import { loanBorrowerFragment } from '../../borrowers/queries/borrowerFragments';
import { fullOfferFragment } from '../../offers/queries/offerFragments';

export const loanBaseFragment = {
  borrowers: { firstName: 1, lastName: 1 },
  createdAt: 1,
  logic: 1,
  name: 1,
  properties: { value: 1, address1: 1 },
  selectedStructure: 1,
  status: 1,
  structures: 1,
  updatedAt: 1,
  userId: 1,
};

export const loanSummaryFragment = loanBaseFragment;

export const userLoanFragment = {
  ...loanBaseFragment,
  adminValidation: 1,
  borrowerIds: 1,
  borrowers: loanBorrowerFragment,
  contacts: 1,
  documents: 1,
  offers: fullOfferFragment,
  properties: userPropertyFragment,
  user: appUserFragment,
  userFormsEnabled: 1,
};

export const sideNavLoanFragment = {
  ...loanBaseFragment,
  user: { assignedEmployee: { email: 1 } },
};

export const adminLoanFragment = {
  ...userLoanFragment,
  properties: adminPropertyFragment,
};

export const adminLoansFragment = {
  ...loanBaseFragment,
  borrowers: { name: 1 },
  documents: 1,
  properties: { value: 1 },
};
