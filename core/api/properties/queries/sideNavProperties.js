import Property from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { sideNavProperty } from '../../fragments';

export default Property.createQuery(PROPERTY_QUERIES.SIDENAV_PROPERTIES, {
  $paginate: true,
  ...sideNavProperty(),
  $options: { sort: { createdAt: -1 } },
});
