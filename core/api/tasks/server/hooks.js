import Tasks from '..';
import { TASK_STATUS } from '../taskConstants';
import NotificationService from 'core/api/notifications/server/NotificationService';

Tasks.before.update((userId, { _id: taskId, status: oldStatus }, fieldNames, modifier) => {
  if (fieldNames.includes('status')) {
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

    if (
      newStatus === TASK_STATUS.COMPLETED
        || newStatus === TASK_STATUS.CANCELLED
    ) {
      NotificationService.readTaskNotification({ taskId });
    }
  }
});

Tasks.before.update((userId, { _id: taskId, dueAt: oldDate }, fieldNames, modifier) => {
  if (fieldNames.includes('dueAt')) {
    const newDate = modifier.$set && modifier.$set.dueAt;

    if ((newDate && newDate.getTime()) !== (oldDate && oldDate.getTime())) {
      NotificationService.remove({ 'taskLink._id': taskId });
    }
  }
});
