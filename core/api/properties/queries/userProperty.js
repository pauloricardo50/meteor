// @flow
import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { userProperty } from '../../fragments';

export default Properties.createQuery(PROPERTY_QUERIES.USER_PROPERTY, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
  },
  ...userProperty(),
});
