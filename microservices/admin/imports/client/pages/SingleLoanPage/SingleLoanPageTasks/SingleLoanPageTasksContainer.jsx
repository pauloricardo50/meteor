import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import loanTasks from 'core/api/tasks/queries/loanTasks';
import withTableFilters from 'core/containers/withTableFilters';

export default compose(
  withSmartQuery({
    query: loanTasks,
    params: ({ loan: { _id: loanId, propertyIds, borrowerIds } }) => ({
      borrowerIds,
      loanId,
      propertyIds,
    }),
    queryOptions: { reactive: false },
  }),
  withTableFilters,
);
