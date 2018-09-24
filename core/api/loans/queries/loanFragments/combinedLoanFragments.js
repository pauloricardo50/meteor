import {
  userPropertyFragment,
  adminPropertyFragment,
} from '../../../properties/queries/propertyFragments';
import { appUserFragment } from '../../../users/queries/userFragments';
import { loanBorrowerFragment } from '../../../borrowers/queries/borrowerFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';
import { loanBaseFragment } from './loanFragments';

export const userLoanFragment = {
  ...loanBaseFragment,
  adminValidation: 1,
  borrowers: loanBorrowerFragment,
  contacts: 1,
  offers: fullOfferFragment,
  properties: userPropertyFragment,
  user: appUserFragment,
  userFormsEnabled: 1,
};

export const sideNavLoanFragment = {
  ...loanBaseFragment,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

export const adminLoanFragment = {
  ...userLoanFragment,
  properties: adminPropertyFragment,
};

export const adminLoansFragment = {
  ...loanBaseFragment,
  borrowers: { name: 1 },
  properties: { value: 1, address1: 1 },
};
