import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { createRegexQuery } from '../../helpers/mongoHelpers';

export default Properties.createQuery(PROPERTY_QUERIES.PROPERTIES, {
  $filter({ filters, params: { searchQuery } }) {
    if (searchQuery) {
      filters.$or = [
        createRegexQuery('address1', searchQuery),
        createRegexQuery('city', searchQuery),
      ];
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
