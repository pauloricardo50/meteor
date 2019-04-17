import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
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
    name: 1,
    $options: { sort: { name: 1 }, limit: 5 },
  },
);
