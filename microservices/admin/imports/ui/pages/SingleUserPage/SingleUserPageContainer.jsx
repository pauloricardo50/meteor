import query from 'core/api/users/queries/adminUser';
import { compose, withQuery, branch, renderComponent } from 'core/api';
import MissingDoc from 'core/components/MissingDoc';
export default compose(
  withQuery(({ match }) => query.clone({ _id: match.params.userId }), {
    reactive: true,
    single: true,
  }),
  branch(
    ({ isLoading, data }) => !isLoading && !data,
    renderComponent(MissingDoc),
  ),
);
