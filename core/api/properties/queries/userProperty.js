// @flow
import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { userPropertyFragment } from './propertyFragments';

export default Properties.createQuery(PROPERTY_QUERIES.USER_PROPERTY, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
  },
  ...userPropertyFragment,
});

export type userProperty = {
  value: number,
  address1: string,
  style: string,
};
