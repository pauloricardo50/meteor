import { withSmartQuery } from 'core/api';
import { compose } from 'recompose';
import tasksForDoc from 'core/api/tasks/queries/tasksForDoc';
import { makeTableFiltersContainer } from 'core/containers/withTableFilters';

export default compose(
  withSmartQuery({
    query: tasksForDoc,
    params: ({
      loan: { _id: loanId, propertyIds = [], borrowerIds = [] },
    }) => ({
      docIds: [loanId, ...borrowerIds, ...propertyIds],
    }),
    queryOptions: { reactive: false },
    dataName: 'tasks',
  }),
  makeTableFiltersContainer(undefined, 'tasks'),
);
