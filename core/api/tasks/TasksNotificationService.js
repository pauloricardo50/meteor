import tasksQuery from '../tasks/queries/tasks';
import { TASK_STATUS, TASK_TYPE } from './taskConstants';
import { Bert } from 'meteor/themeteorchef:bert';
import { FILE_STATUS } from '../constants';

class TaskNotificationService {
  notifyTaskCompletedWhenFileStatusChanged = ({ fileKey, newStatus }) => {
    if ([FILE_STATUS.ERROR, FILE_STATUS.VALID].includes(newStatus)) {
      tasksQuery
        .clone({ file: fileKey, status: TASK_STATUS.COMPLETED })
        .fetchOneSync()
        .then((task) => {
          if (task) {
            this.notifyAdminOfCompletedTask({ task });
          }
        });
    }
  };

  notifyTaskCompletedWhenAddedAssignedAdmin = ({ userId }) => {
    tasksQuery
      .clone({
        user: userId,
        type: TASK_TYPE.ADD_ASSIGNED_TO,
        status: TASK_STATUS.COMPLETED,
      })
      .fetchOneSync()
      .then((task) => {
        if (task) {
          this.notifyAdminOfCompletedTask({ task });
        }
      });
  };

  notifyAdminOfCompletedTask = ({ task: { _id, status } }) => {
    Bert.alert({
      title: 'Success!',
      message: `The task ${_id} has been completed`,
      type: 'success',
      style: 'fixed-top',
    });
  };
}

export default new TaskNotificationService();
