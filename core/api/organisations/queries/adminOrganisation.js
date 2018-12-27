import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import fullOrganisationFragment from './organisationFragments/fullOrganisationFragment';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATION,
  {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisationFragment,
  },
);
