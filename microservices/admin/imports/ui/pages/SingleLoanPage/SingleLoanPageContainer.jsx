import query from 'core/api/loans/queries/adminLoan';
import { compose, branch, renderComponent, withSmartQuery } from 'core/api';
import MissingDoc from '../../components/MissingDoc/MissingDoc';

export default compose(
  withSmartQuery({
    query: ({ match }) => query.clone({ _id: match.params.loanId }),
    queryOptions: { reactive: true, single: true },
    dataName: 'loan',
  }),
  branch(
    ({ isLoading, loan }) => !isLoading && !loan,
    renderComponent(MissingDoc),
  ),
);
