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

  readNotification({ userId, notificationId }) {
    this.updateLinkMetadata({
      id: notificationId,
      linkName: 'recipients',
      linkId: userId,
      metadata: { read: true },
    });
  }

  snoozeNotification({ userId, notificationId }) {
    const inOneHour = new Date();
    inOneHour.setHours(inOneHour.getHours() + 1);
    this.updateLinkMetadata({
      id: notificationId,
      linkName: 'recipients',
      linkId: userId,
      metadata: { snoozeDate: inOneHour },
    });
  }

  unreadNotification({ userId, notificationId }) {
    this.updateLinkMetadata({
      id: notificationId,
      linkName: 'recipients',
      linkId: userId,
      metadata: { read: false },
    });
  }

  readTaskNotification({ taskId }) {
    const notification = this.fetchOne({
      $filters: { 'taskLink._id': taskId },
      recipientLinks: 1,
    });

    if (notification) {
      const { _id: notificationId, recipientLinks } = notification;
      this._update({
        id: notificationId,
        object: {
          recipientLinks: recipientLinks.map(recipientLink => ({
            ...recipientLink,
            read: true,
          })),
        },
      });
    }
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
    yesterday.setDate(yesterday.getDate() - 2);
    const activities = ActivityService.fetch({
      $filters: {
        shouldNotify: true,
        date: { $gte: yesterday, $lte: now },
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
