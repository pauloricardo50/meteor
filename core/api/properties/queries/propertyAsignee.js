import Property from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';

export default Property.createQuery(PROPERTY_QUERIES.PROPERTY_ASSIGNED_TO, {
  $filter({ filters, params }) {
    filters.userId = params.userId;
  },
  assignedTo: 1,
});
