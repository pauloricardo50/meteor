import Properties from '../properties';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { userProperty } from '../../fragments';

export default Properties.createQuery(PROPERTY_QUERIES.ANONYMOUS_PROPERTY, {
  ...userProperty(),
  // Ask these for non-reactive queries, like ProPropertyPage
  documents: 1,
  openGraphData: 1,
});
