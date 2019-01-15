import { ORGANISATION_TAGS } from 'imports/core/api/constants';
import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  {
    $filter({
      filters,
      params: { features, tags = [...Object.values(ORGANISATION_TAGS), null] },
    }) {
      if (features) {
        filters.features = { $in: features };
        filters.tags = { $in: tags };
      }
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisation(),
  },
);
