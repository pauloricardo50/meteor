import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import loanTasks from 'core/api/tasks/queries/loanTasks';
import TasksTable from '../../../components/TasksTable/TasksTable';
import withTableFilters from '../../../../core/containers/withTableFilters';

export default compose(
  withSmartQuery({
    query: ({ borrowerIds, loanId, propertyIds }) =>
      loanTasks.clone({ borrowerIds, loanId, propertyIds }),
    queryOptions: { reactive: true },
  }),
  withTableFilters,
)(TasksTable);
