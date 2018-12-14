import { contactFragment } from 'imports/core/api/contacts/queries/contactsFragments/';
import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATION,
  {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
    name: 1,
    type: 1,
    logo: 1,
    contacts: contactFragment,
    $options: { sort: { name: 1 } },
  },
);
