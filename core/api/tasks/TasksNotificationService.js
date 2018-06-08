import { Bert } from 'meteor/themeteorchef:bert';
import tasksQuery from './queries/tasks';
import { TASK_STATUS, TASK_TYPE } from './taskConstants';
import { FILE_STATUS } from '../constants';

if (typeof window !== 'undefined') window.tasksQuery = tasksQuery;
class TaskNotificationService {
  notifyTaskCompletedWhenFileStatusChanged = ({ fileKey, newStatus }) => {
    if ([FILE_STATUS.ERROR, FILE_STATUS.VALID].includes(newStatus)) {
      tasksQuery
        .clone({ file: fileKey, status: TASK_STATUS.COMPLETED })
        .fetchOne((err, task) => {
          this.notifyAdminOfCompletedTask({ task });
        });
    }
  };

  notifyTaskCompletedWhenAdminAssigned = ({ userId }) => {
    tasksQuery
      .clone({
        user: userId,
        type: TASK_TYPE.ADD_ASSIGNED_TO,
        status: TASK_STATUS.COMPLETED,
      })
      .fetchOne((err, task) => {
        this.notifyAdminOfCompletedTask({ task });
      });
  };

  notifyAdminOfCompletedTask = ({ task }) => {
    if (task) {
      const { _id, status } = task;

      Bert.alert({
        title: 'Success!',
        message: `The task ${_id} has been completed`,
        type: 'success',
        style: 'fixed-top',
      });
    }
  };
}

export default new TaskNotificationService();
