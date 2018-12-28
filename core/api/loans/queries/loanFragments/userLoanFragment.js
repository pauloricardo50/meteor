import { loanBorrowerFragment } from '../../../borrowers/queries/borrowerFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';
import userPropertyFragment from '../../../properties/queries/propertyFragments/userPropertyFragment';
import loanBaseFragment from './loanBaseFragment';
import appUserFragment from '../../../users/queries/userFragments/appUserFragment';

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
