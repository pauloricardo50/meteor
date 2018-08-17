// @flow
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';

export default Loans.createQuery(LOAN_QUERIES.LOAN_FILES, {
  $filter({ filters, params: { loanId } }) {
    filters._id = loanId;
  },
  documents: 1,
  borrowers: {
    documents: 1,
  },
  properties: {
    documents: 1,
  },
});
