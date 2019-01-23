import { LOAN_QUERIES } from '../../constants';
import Loans from '../loans';

export default Loans.createQuery(LOAN_QUERIES.LOAN_WITH_NAME, {
  $filter({ filters, params }) {
    filters.name = params.name;
  },
});
