import { proRevenue } from '../fragments';
import { REVENUE_QUERIES } from './revenueConstants';
import Revenues from '.';

export const proRevenues = Revenues.createQuery(
  REVENUE_QUERIES.PRO_REVENUES,
  proRevenue(),
);
