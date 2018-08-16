import Loans from '../loans';
import { LOAN_QUERIES } from '../loanConstants';
import { formatLoanWithStructure } from '../../../utils/loanFunctions';

export default Loans.createQuery(LOAN_QUERIES.SIDENAV_LOANS, {
  $options: {
    sort: {
      createdAt: -1,
    },
  },
  $postFilter: (loans, params) => loans.map(formatLoanWithStructure),
  $paginate: true,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  user: {
    assignedEmployee: { emails: 1 },
  },
  structures: {
    id: 1,
    wantedLoan: 1,
    secondPillarPledged: 1,
    thirdPillarPledged: 1,
  },
  selectedStructure: 1,
});
