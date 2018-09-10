import Property from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { sideNavPropertyFragment } from './propertyFragments';

export default Property.createQuery(PROPERTY_QUERIES.SIDENAV_PROPERTIES, {
  $paginate: true,
  ...sideNavPropertyFragment,
  $options: { sort: { createdAt: -1 } },
});
