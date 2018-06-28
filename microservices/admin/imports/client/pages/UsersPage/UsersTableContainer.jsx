import { compose } from 'recompose';
import query from 'core/api/users/queries/adminUsers';
import withTableFilters from 'core/containers/withTableFilters';
import { withQuery } from 'core/api';

export default compose(
  withQuery(props => query.clone({ assignedTo: props.assignedTo }), {
    reactive: true,
  }),
  withTableFilters,
);
