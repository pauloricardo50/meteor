import ActivityService from '../../activities/server/ActivityService';
import CollectionService from '../../helpers/server/CollectionService';
import RevenueService from '../../revenues/server/RevenueService';
import TaskService from '../../tasks/server/TaskService';
import { TASK_STATUS } from '../../tasks/taskConstants';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
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

  readNotificationAll({ filters }) {
    const notification = this.get(filters, { recipientLinks: 1 });

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
      const existingNotification = this.get(
        { 'taskLink._id': taskId },
        { _id: 1 },
      );

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
      loan: { userCache: 1 },
    });

    activities.forEach(({ _id: activityId, createdBy = {}, loan }) => {
      const existingNotification = this.get(
        { 'activityLink._id': activityId },
        { _id: 1 },
      );

      const recipients = [{ _id: createdBy }];

      if (loan && loan.userCache && loan.userCache.assignedEmployeeCache) {
        recipients.push({ _id: loan.userCache.assignedEmployeeCache._id });
      }

      if (!existingNotification) {
        this.insert({
          recipientLinks: [{ _id: createdBy }],
          activityLink: { _id: activityId },
        });
      }
    });
  }

  addRevenueNotifications() {
    const now = new Date();
    const revenues = RevenueService.fetch({
      $filters: { expectedAt: { $lte: now }, paidAt: { $exists: false } },
      loan: { userCache: 1 },
    });

    const admins = UserService.fetch({ $filters: { roles: ROLES.ADMIN } });
    revenues.forEach(({ _id: revenueId, loan = {} }) => {
      const existingNotification = this.get(
        { 'revenueLink._id': revenueId },
        { _id: 1 },
      );

      if (!existingNotification) {
        this.insert({
          recipientLinks: this.getNotificationRecipient(
            loan.userCache &&
              loan.userCache.assignedEmployeeCache &&
              loan.userCache.assignedEmployeeCache._id,
            admins,
          ),
          revenueLink: { _id: revenueId },
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
