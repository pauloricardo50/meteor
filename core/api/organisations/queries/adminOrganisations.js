import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  {
    $filter({ filters, params }) {},
    $options: { sort: { name: 1 } },
    address: 1,
    address1: 1,
    address2: 1,
    canton: 1,
    city: 1,
    contacts: { _id: 1, role: 1, email: 1, name: 1 },
    logo: 1,
    name: 1,
    type: 1,
    zipCode: 1,
  },
);
