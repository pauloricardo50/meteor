import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { adminPropertyFragment } from './propertyFragments';

export default Properties.createQuery(PROPERTY_QUERIES.ADMIN_PROPERTIES, {
  ...adminPropertyFragment,
});
