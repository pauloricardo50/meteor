import query from 'core/api/loans/queries/adminLoan';
import { compose, withQuery, branch, renderComponent } from 'core/api';
import MissingDoc from '../../components/MissingDoc';

export default compose(
  withQuery(({ match }) => query.clone({ _id: match.params.loanId }), {
    reactive: true,
    single: true,
  }),
  branch(
    ({ isLoading, data }) => !isLoading && !data,
    renderComponent(MissingDoc),
  ),
);
