import { contactFragment } from '../../../contacts/queries/contactsFragments';
import { lenderFragment } from '../../../lenders/queries/lendersFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';
import { baseOrganisationFragment } from './organisationFragments';

export default {
  ...baseOrganisationFragment,
  contacts: contactFragment,
  lenders: lenderFragment,
  offers: fullOfferFragment,
};
