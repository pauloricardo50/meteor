import Organisations from '../organisations';
import {
  ORGANISATION_FEATURES,
  ORGANISATION_QUERIES,
} from '../organisationConstants';
import { lenderOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.USER_ORGANISATIONS,
  {
    $filter({ filters }) {
      filters.features = { $in: [ORGANISATION_FEATURES.LENDER] };
    },
    $options: { sort: { name: 1 } },
    ...lenderOrganisation(),
  },
);
