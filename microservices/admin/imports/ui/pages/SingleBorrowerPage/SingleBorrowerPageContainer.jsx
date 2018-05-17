import query from 'core/api/borrowers/queries/borrower';
import { compose, branch, renderComponent, withSmartQuery } from 'core/api';
import MissingDoc from '../../components/MissingDoc';

export default compose(
  withSmartQuery({
    query: ({ match }) => query.clone({ _id: match.params.borrowerId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'borrower',
  }),
  branch(
    ({ isLoading, borrower }) => !isLoading && !borrower,
    renderComponent(MissingDoc),
  ),
);
