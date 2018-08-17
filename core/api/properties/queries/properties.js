import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { propertySummaryFragment } from './propertyFragments';

export default Properties.createQuery(PROPERTY_QUERIES.PROPERTIES, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      Object.assign(
        filters,
        createSearchFilters(['address1', 'city'], searchQuery),
      );
    }
  },
  ...propertySummaryFragment,
});
