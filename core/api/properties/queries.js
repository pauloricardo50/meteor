import {
  adminProperty,
  proProperty,
  proUser,
  userProperty as userPropertyFragment,
} from '../fragments';
import { PROPERTY_QUERIES } from './propertyConstants';
import Properties from '.';

export const adminProperties = Properties.createQuery(
  PROPERTY_QUERIES.ADMIN_PROPERTIES,
  { ...adminProperty(), $options: { sort: { name: 1 } } },
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
    address1: 1,
    address2: 1,
    category: 1,
    city: 1,
    insideArea: 1,
    name: 1,
    status: 1,
    style: 1,
    totalValue: 1,
    zipCode: 1,
    $options: { sort: { name: 1 }, limit: 5 },
  },
);

export const proProperties = Properties.createQuery(
  PROPERTY_QUERIES.PRO_PROPERTIES,
  proProperty(),
);

export const proPropertyUsers = Properties.createQuery(
  PROPERTY_QUERIES.PRO_PROPERTY_USERS,
  { users: proUser() },
);

export const userProperty = Properties.createQuery(
  PROPERTY_QUERIES.USER_PROPERTY,
  {
    ...userPropertyFragment(),
    // Ask these for non-reactive queries, like ProPropertyPage
    openGraphData: 1,
    documents: 1,
  },
);
