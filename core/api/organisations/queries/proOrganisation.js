import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ORGANISATION_SEARCH,
  {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
    ...fullOrganisation(),
  },
);
