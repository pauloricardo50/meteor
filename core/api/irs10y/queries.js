import { irs10y as irs10yFragment } from '../fragments';
import { IRS10Y_QUERIES } from './irs10yConstants';
import Irs10y from '.';

export const irs10y = Irs10y.createQuery(IRS10Y_QUERIES.IRS10Y, {
  ...irs10yFragment(),
  $options: { sort: { date: -1 } },
});
