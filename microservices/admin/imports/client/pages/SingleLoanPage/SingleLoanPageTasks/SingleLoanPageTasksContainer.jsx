import { withSmartQuery } from 'core/api';
import { compose, shouldUpdate } from 'recompose';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';
import { taskInsert, taskUpdate } from 'core/api/tasks/index';
import tasks from 'core/api/tasks/queries/tasks';

export default compose(
  // This component is self-contained, shouldn't need to update
  // If tasks are added to new borrowers or properties, a refresh will do
  shouldUpdate(() => false),
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
