import { Meteor } from 'meteor/meteor';

import { compose, withState } from 'recompose';
import moment from 'moment';

import { withSmartQuery } from 'core/api/containerToolkit';
import { TASK_STATUS, TASKS_COLLECTION } from 'core/api/constants';
import TasksTable, { taskTableFragment } from './TasksTable';

const getUptoDate = uptoDate => {
  switch (uptoDate) {
    case 'TODAY':
      return moment()
        .endOf('day')
        .toDate();
    case 'TOMORROW':
      return moment()
        .endOf('day')
        .add(1, 'days')
        .endOf('day')
        .toDate();

    default:
      return null;
  }
};

const getQueryFilters = ({ assignee, status, uptoDate }) => {
  let $or;

  if (getUptoDate(uptoDate)) {
    $or = [
      { dueAt: { $lt: getUptoDate(uptoDate) } },
      { dueAt: { $exists: false } },
    ];
  }

  return { 'assigneeLink._id': assignee, status, $or };
};

export const withTasksQuery = compose(
  withState('assignee', 'setAssignee', () => ({
    $in: [Meteor.userId(), undefined],
  })),
  withState('status', 'setStatus', { $in: [TASK_STATUS.ACTIVE] }),
  withState('uptoDate', 'setUptoDate', 'TOMORROW'),
  withSmartQuery({
    query: TASKS_COLLECTION,
    params: ({ assignee, status, uptoDate }) => ({
      $filters: getQueryFilters({ assignee, status, uptoDate }),
      ...taskTableFragment,
    }),
    queryOptions: { reactive: false, pollingMs: 5000 },
    dataName: 'tasks',
  }),
);

export default compose(withTasksQuery)(TasksTable);
