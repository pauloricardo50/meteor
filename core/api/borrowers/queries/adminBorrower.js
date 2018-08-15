import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import { loanSummary } from '../../loans/queries/loanFragments';
import { appUser } from '../../users/queries/userFragments';

export default Borrowers.createQuery(BORROWER_QUERIES.BORROWER, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $postFilter(borrowers) {
    return borrowers.map(({ loans, ...borrower }) => ({
      ...borrower,
      loans: loans.map(formatLoanWithStructure),
    }));
  },
  createdAt: 1,
  updatedAt: 1,
  gender: 1,
  age: 1,
  address1: 1,
  firstName: 1,
  lastName: 1,
  user: appUser,
  // fields used in LoanSummary component
  loans: loanSummary,
  // fields used in Recap component
  salary: 1,
  otherIncome: 1,
  expenses: 1,
  bankFortune: 1,
  insuranceSecondPillar: 1,
  insuranceThirdPillar: 1,
  realEstate: 1,
});
