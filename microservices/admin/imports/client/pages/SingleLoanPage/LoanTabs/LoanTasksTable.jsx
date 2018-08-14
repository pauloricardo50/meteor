import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import query from 'core/api/tasks/queries/loanTasks';
import TasksTable from '../../../components/TasksTable/TasksTable';
import withTableFilters from '../../../../core/containers/withTableFilters';

export default compose(
  withSmartQuery({
    query: ({ borrowerIds, loanId, propertyId }) =>
      query.clone({ borrowerIds, loanId, propertyId }),
    queryOptions: { reactive: true },
  }),
  withTableFilters,
)(TasksTable);
