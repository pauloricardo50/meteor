import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { proProperty } from '../../fragments';

export default Properties.createQuery(PROPERTY_QUERIES.PRO_PROPERTY, {
  ...proProperty(),
});
