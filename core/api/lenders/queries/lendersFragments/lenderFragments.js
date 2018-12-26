import { contactFragment } from 'core/api/contacts/queries/contactsFragments';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';

export const lenderFragment = {
  organisation: {
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: contactFragment,
    logo: 1,
    name: 1,
    type: 1,
    zipCode: 1,
    $options: { sort: { name: 1 } },
  },
  contact: contactFragment,
  loan: { _id: 1 },
  offers: fullOfferFragment,
};
