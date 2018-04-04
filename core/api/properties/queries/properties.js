import Property from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';

export default Property.createQuery(PROPERTY_QUERIES.PROPERTIES, {
  $filter({ filters, params }) {
    const { searchQuery } = params;
    if (searchQuery) {
      filters.$or = [
        { address1: { $regex: searchQuery } },
        { city: { $regex: searchQuery } },
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
