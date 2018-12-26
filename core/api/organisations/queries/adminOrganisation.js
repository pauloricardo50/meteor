import { contactFragment } from '../../contacts/queries/contactsFragments';
import { lenderFragment } from '../../lenders/queries/lendersFragments';
import { fullOfferFragment } from '../../offers/queries/offerFragments';
import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATION,
  {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: contactFragment,
    lenders: lenderFragment,
    logo: 1,
    name: 1,
    offers: fullOfferFragment,
    type: 1,
    zipCode: 1,
    $options: { sort: { name: 1 } },
  },
);
