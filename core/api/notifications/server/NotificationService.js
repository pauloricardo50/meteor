import TaskService from 'core/api/tasks/server/TaskService';
import { TASK_STATUS } from 'core/api/tasks/taskConstants';
import ActivityService from 'core/api/activities/server/ActivityService';
import UserService from 'core/api/users/server/UserService';
import { ROLES } from 'core/api/users/userConstants';
import CollectionService from '../../helpers/CollectionService';
import Notifications from '../notifications';

class NotificationService extends CollectionService {
  constructor() {
    super(Notifications);
  }

  addTaskNotifications() {
    const tasks = TaskService.fetch({
      $filters: {
        status: TASK_STATUS.ACTIVE,
        dueAt: { $lte: new Date() },
      },
      _id: 1,
      assigneeLink: 1,
    });

    const admins = UserService.fetch({ $filters: { roles: ROLES.ADMIN } });
    tasks.forEach(({ _id: taskId, assigneeLink = {} }) => {
      const existingNotification = this.fetchOne({
        $filters: { 'taskLink._id': taskId },
      });

      if (!existingNotification) {
        this.insert({
          recipientLinks: this.getNotificationRecipient(
            assigneeLink._id,
            admins,
          ),
          taskLink: { _id: taskId },
        });
      }
    });
  }

  addActivityNotifications() {
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const activities = ActivityService.fetch({
      $filters: {
        shouldNotify: true,
        $and: [{ date: { $lte: now } }, { date: { $gte: yesterday } }],
      },
      _id: 1,
      createdBy: 1,
    });

    activities.forEach(({ _id: activityId, createdBy = {} }) => {
      const existingNotification = this.fetchOne({
        $filters: { 'activityLink._id': activityId },
      });
      if (!existingNotification) {
        this.insert({
          recipientLinks: [{ _id: createdBy }],
          activityLink: { _id: activityId },
        });
      }
    });
  }

  getNotificationRecipient(assignee, admins) {
    if (assignee) {
      return [{ _id: assignee }];
    }
    return admins.map(({ _id }) => ({ _id }));
  }
}

export default new NotificationService();
