import { fullOfferFragment } from '../../../offers/queries/offerFragments';

export const contactFragment = {
  firstName: 1,
  lastName: 1,
  name: 1,
  address: 1,
  zipCode: 1,
  address1: 1,
  address2: 1,
  city: 1,
  canton: 1,
  phoneNumbers: 1,
  phoneNumber: 1,
  emails: 1,
  email: 1,
  organisations: { name: 1, _id: 1, address: 1 },
  offers: fullOfferFragment,
};
