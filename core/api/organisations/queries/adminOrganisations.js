import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  {
    $filter({ filters, params }) {},
    name: 1,
    type: 1,
    logo: 1,
    $options: { sort: { name: 1 } },
  },
);
