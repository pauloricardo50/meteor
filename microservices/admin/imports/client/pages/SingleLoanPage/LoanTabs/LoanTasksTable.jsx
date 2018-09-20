import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import loanTasks from 'core/api/tasks/queries/loanTasks';
import withTableFilters from 'core/containers/withTableFilters';
import TasksTable from '../../../components/TasksTable/TasksTable';

export default compose(
  withSmartQuery({
    query: ({ borrowerIds, loanId, propertyIds }) =>
      loanTasks.clone({ borrowerIds, loanId, propertyIds }),
    queryOptions: { reactive: true },
  }),
  withTableFilters,
)(TasksTable);
