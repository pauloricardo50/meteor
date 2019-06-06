import Properties from '.';
import { PROPERTY_QUERIES } from './propertyConstants';
import {
  adminProperty,
  userProperty as userPropertyFragment,
  proProperty,
} from '../fragments';
import { createSearchFilters } from '../helpers/mongoHelpers';

export const adminProperties = Properties.createQuery(
  PROPERTY_QUERIES.ADMIN_PROPERTIES,
  adminProperty(),
);

export const anonymousProperty = Properties.createQuery(
  PROPERTY_QUERIES.ANONYMOUS_PROPERTY,
  {
    ...userPropertyFragment(),
    // Ask these for non-reactive queries, like ProPropertyPage
    documents: 1,
    openGraphData: 1,
  },
);

export const propertySearch = Properties.createQuery(
  PROPERTY_QUERIES.PROPERTY_SEARCH,
  {
    $filter({ filters, params: { searchQuery } }) {
      Object.assign(
        filters,
        createSearchFilters(['address1', 'city', '_id'], searchQuery),
      );
    },
    address1: 1,
    address2: 1,
    city: 1,
    zipCode: 1,
    totalValue: 1,
    status: 1,
    style: 1,
    insideArea: 1,
    $options: { limit: 5 },
  },
);

export const proProperties = Properties.createQuery(
  PROPERTY_QUERIES.PRO_PROPERTIES,
  () => {},
);

export const proPropertyUsers = Properties.createQuery(
  PROPERTY_QUERIES.PRO_PROPERTY_USERS,
  () => {},
);

export const userProperty = Properties.createQuery(
  PROPERTY_QUERIES.USER_PROPERTY,
  {
    $filter({ filters, params: { propertyId } }) {
      filters._id = propertyId;
    },
    ...userPropertyFragment(),
    // Ask these for non-reactive queries, like ProPropertyPage
    openGraphData: 1,
    documents: 1,
  },
);
