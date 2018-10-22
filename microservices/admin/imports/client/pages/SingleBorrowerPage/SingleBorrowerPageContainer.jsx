import query from 'core/api/borrowers/queries/adminBorrower';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query,
  params: ({ match }) => ({ _id: match.params.borrowerId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'borrower',
});
