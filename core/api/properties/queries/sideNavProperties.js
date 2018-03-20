import Property from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';

export default Property.createQuery(PROPERTY_QUERIES.SIDENAV_PROPERTIES, {
  $filter({ filters, params }) {
    filters._id = params.propertyId;
  },
  $paginate: true,
});
