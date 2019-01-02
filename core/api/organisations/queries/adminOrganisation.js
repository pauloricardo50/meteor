import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATION,
  {
    $filter({ filters, params: { organisationId } }) {
      filters._id = organisationId;
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisation(),
  },
);
