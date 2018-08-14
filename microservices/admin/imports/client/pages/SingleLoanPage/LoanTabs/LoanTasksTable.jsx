import { withQuery } from 'meteor/cultofcoders:grapher-react';
import { compose } from 'recompose';
import query from 'core/api/tasks/queries/loanTasks';
import TasksTable from '../../../components/TasksTable/TasksTable';
import withTableFilters from '../../../../core/containers/withTableFilters';

export default compose(
  withQuery(
    ({ borrowerIds, loanId, propertyId }) =>
      query.clone({ borrowerIds, loanId, propertyId }),
    { reactive: true },
  ),
  withTableFilters,
)(TasksTable);
