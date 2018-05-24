import query from 'core/api/borrowers/queries/borrower';
import { withSmartQuery } from 'core/api';

export default withSmartQuery({
  query: ({ match }) => query.clone({ _id: match.params.borrowerId }),
  queryOptions: { reactive: true, single: true },
  dataName: 'borrower',
});
