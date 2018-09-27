import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import loanTasks from 'core/api/tasks/queries/loanTasks';
import withTableFilters from 'core/containers/withTableFilters';

export default compose(
  withSmartQuery({
    query: ({ loan: { _id: loanId, propertyIds, borrowerIds } }) =>
      loanTasks.clone({ borrowerIds, loanId, propertyIds }),
    queryOptions: { reactive: false },
  }),
  withTableFilters,
);
