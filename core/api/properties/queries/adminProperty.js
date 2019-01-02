import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import adminPropertyFragment from './propertyFragments/adminPropertyFragment';

export default Properties.createQuery(PROPERTY_QUERIES.ADMIN_PROPERTY, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
  },
  ...adminPropertyFragment,
});
