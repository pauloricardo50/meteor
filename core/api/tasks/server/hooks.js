import Tasks from '..';
import { TASK_STATUS } from '../taskConstants';

Tasks.before.update((userId, { status: oldStatus }, fieldNames, modifier) => {
  const newStatus = modifier.$set && modifier.$set.status;
  if (
    oldStatus !== TASK_STATUS.COMPLETED
    && newStatus === TASK_STATUS.COMPLETED
  ) {
    modifier.$set.completedAt = new Date();
  }
  if (
    oldStatus === TASK_STATUS.COMPLETED
    && newStatus !== TASK_STATUS.COMPLETED
  ) {
    modifier.$set.completedAt = null;
  }
});
