import Irs10y from '../irs10y';
import { irs10yFragment } from './irs10yFragments';
import { IRS10Y_QUERIES } from '../irs10yConstants';

export default Irs10y.createQuery(IRS10Y_QUERIES.IRS10Y, {
  ...irs10yFragment,
  $options: { sort: { date: -1 } },
});
