import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';
import { createSearchFilters } from '../../helpers';

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ORGANISATION_SEARCH,
  {
    $filter({ filters, params: { searchQuery } }) {
      Object.assign(
        filters,
        createSearchFilters(['name', '_id', 'type'], searchQuery),
      );
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisation(),
  },
);
