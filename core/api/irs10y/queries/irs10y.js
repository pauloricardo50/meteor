import Irs10y from '../irs10y';
import { irs10y } from '../../fragments';
import { IRS10Y_QUERIES } from '../irs10yConstants';

export default Irs10y.createQuery(IRS10Y_QUERIES.IRS10Y, {
  ...irs10y(),
  $options: { sort: { date: -1 } },
});
