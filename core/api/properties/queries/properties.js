import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { createSearchFilters } from '../../helpers/mongoHelpers';

export default Properties.createQuery(PROPERTY_QUERIES.PROPERTIES, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      Object.assign(
        filters,
        createSearchFilters(['address1', 'city'], searchQuery),
      );
    }
  },
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  value: 1,
  status: 1,
  style: 1,
  insideArea: 1,
});
