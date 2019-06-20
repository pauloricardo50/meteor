import Tasks from '..';
import { TASK_STATUS } from '../taskConstants';
import NotificationService from 'core/api/notifications/server/NotificationService';

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

Tasks.after.update(
  function (userId, doc, fieldNames) {
    if (fieldNames.includes('dueAt')) {
      const { dueAt: newDate } = doc;
      const { dueAt: oldDate } = this.previous;

      if ((newDate && newDate.getTime()) !== (oldDate && oldDate.getTime())) {
        NotificationService.remove({ 'taskLink._id': doc._id });
      }
    }
  },
  { fetchPrevious: true },
);
