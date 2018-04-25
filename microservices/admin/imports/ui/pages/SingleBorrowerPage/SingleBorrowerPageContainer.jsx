import query from 'core/api/borrowers/queries/borrower';
import { compose, withQuery, branch, renderComponent } from 'core/api';
import MissingDoc from '../../components/MissingDoc/MissingDoc';

export default compose(
  withQuery(({ match }) => query.clone({ _id: match.params.borrowerId }), {
    reactive: true,
    single: true,
  }),
  branch(
    ({ isLoading, data }) => !isLoading && !data,
    renderComponent(MissingDoc),
  ),
);
