import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';
import { taskInsert, taskUpdate } from 'core/api/tasks/index';
import tasks from 'core/api/tasks/queries/tasks';

export default compose(
  withSmartQuery({
    query: tasks,
    params: ({
      loan: { _id: loanId, propertyIds = [], borrowerIds = [] },
    }) => ({
      docIds: [loanId, ...borrowerIds, ...propertyIds],
    }),
    queryOptions: { reactive: false, shouldRefetch: () => false },
    dataName: 'tasks',
    refetchOnMethodCall: [taskInsert, taskUpdate],
  }),
  makeTableFiltersContainer(undefined, 'tasks'),
);
