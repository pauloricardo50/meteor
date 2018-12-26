import { loanBorrowerFragment } from '../../../borrowers/queries/borrowerFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';
import { appUserFragment } from '../../../users/queries/userFragments';
import { userPropertyFragment } from '../../../properties/queries/propertyFragments';
import loanBaseFragment from './loanBaseFragment';

export default {
  ...loanBaseFragment,
  adminValidation: 1,
  borrowers: loanBorrowerFragment,
  contacts: 1,
  offers: fullOfferFragment,
  properties: userPropertyFragment,
  user: appUserFragment,
  userFormsEnabled: 1,
};
