import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { propertySummary } from '../../fragments';

export default Properties.createQuery(PROPERTY_QUERIES.PROPERTY_SEARCH, {
  $filter({ filters, params: { searchQuery } }) {
    Object.assign(
      filters,
      createSearchFilters(['address1', 'city', '_id'], searchQuery),
    );
  },
  ...propertySummary(),
});
