import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { proPropertySummary } from '../../fragments';

export default Properties.createQuery(PROPERTY_QUERIES.PRO_PROPERTIES, {
  ...proPropertySummary(),
});
