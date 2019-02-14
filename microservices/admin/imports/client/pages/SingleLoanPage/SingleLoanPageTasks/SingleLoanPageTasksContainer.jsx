import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import tasksForDoc from 'core/api/tasks/queries/tasksForDoc';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';
import { taskInsert, taskUpdate } from 'core/api/tasks/index';

export default compose(
  withSmartQuery({
    query: tasksForDoc,
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
