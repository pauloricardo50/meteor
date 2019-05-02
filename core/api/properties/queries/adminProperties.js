import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { adminProperty } from '../../fragments';

export default Properties.createQuery(
  PROPERTY_QUERIES.ADMIN_PROPERTIES,
  adminProperty(),
);
