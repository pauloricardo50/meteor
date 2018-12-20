import {
  userPropertyFragment,
  adminPropertyFragment,
} from '../../../properties/queries/propertyFragments';
import { appUserFragment } from '../../../users/queries/userFragments';
import { loanBorrowerFragment } from '../../../borrowers/queries/borrowerFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';
import { loanBaseFragment } from './loanFragments';
import { lenderFragment } from '../../../lenders/queries/lendersFragments';

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
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

export const adminLoanFragment = {
  ...userLoanFragment,
  closingDate: 1,
  properties: adminPropertyFragment,
  signingDate: 1,
  status: 1,
  lenders: lenderFragment,
};

export const adminLoansFragment = {
  ...loanBaseFragment,
  borrowers: { name: 1 },
  closingDate: 1,
  properties: { value: 1, address1: 1 },
  signingDate: 1,
  status: 1,
  user: { assignedEmployee: { email: 1 }, name: 1 },
};

export const proLoansFragment = {
  name: 1,
  user: { name: 1, phoneNumbers: 1, email: 1 },
  promotionProgress: 1,
  promotionLinks: 1,
  promotionOptions: {
    name: 1,
    status: 1,
    promotionLots: { _id: 1, attributedTo: { user: { _id: 1 } } },
    solvency: 1,
  },
  promotions: { _id: 1, users: { _id: 1 }, status: 1 },
  createdAt: 1,
};
