import { contactFragment } from 'imports/core/api/contacts/queries/contactsFragments/';
import { fullOfferFragment } from '../../../offers/queries/offerFragments';

export const lenderFragment = {
  organisation: {
    name: 1,
    type: 1,
    logo: 1,
    contacts: contactFragment,
    $options: { sort: { name: 1 } },
    address: 1,
    address1: 1,
    address2: 1,
    zipCode: 1,
    city: 1,
    canton: 1,
  },
  contact: contactFragment,
  loan: { _id: 1 },
  offers: fullOfferFragment,
  // Insert your fragment here
  // Example
  // firstName: 1,
  // lastName: 1,
};
