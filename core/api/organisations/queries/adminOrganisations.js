import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  {
    $filter({ filters, params: { features } }) {
      if (features) {
        filters.features = { $in: features };
      }
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisation(),
  },
);
