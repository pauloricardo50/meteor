// @flow
import Properties from '../properties';
import { PROPERTY_QUERIES } from '../../constants';

export default Properties.createQuery(PROPERTY_QUERIES.PROPERTY_FILES, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
  },
  documents: 1,
});
