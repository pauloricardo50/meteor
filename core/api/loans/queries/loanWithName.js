import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';

export default Loans.createQuery(LOAN_QUERIES.LOAN_WITH_NAME, {
  $filter({ filters, params }) {
    filters.name = params.name;
  },
});
