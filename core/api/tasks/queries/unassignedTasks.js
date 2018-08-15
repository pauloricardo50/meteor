import { Tasks } from '../..';
import { TASK_QUERIES } from '../taskConstants';
import { taskFragment } from './taskFragments';

export default Tasks.createQuery(TASK_QUERIES.UNASSIGNED_TASKS, {
  $filter({ filters, options, params }) {
    filters.assignedTo = undefined;
  },
  ...taskFragment,
});
