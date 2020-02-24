import { adminRevenue, proRevenue } from '../fragments';
import { REVENUE_QUERIES } from './revenueConstants';
import Revenues from '.';

export const adminRevenues = Revenues.createQuery(
  REVENUE_QUERIES.ADMIN_REVENUES,
  adminRevenue(),
);

export const proRevenues = Revenues.createQuery(
  REVENUE_QUERIES.PRO_REVENUES,
  proRevenue(),
);
