import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { ACTIVITY_TYPES } from '../../../activities/activityConstants';
import ActivityService from '../../../activities/server/ActivityService';
import generator from '../../../factories/server';
import TaskService from '../../../tasks/server/TaskService';
import { TASK_STATUS } from '../../../tasks/taskConstants';
import NotificationService from '../NotificationService';

describe('NotificationService', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  beforeEach(() => {
    resetDatabase();
  });

  describe('addTaskNotifications', () => {
    it('adds a notification for active tasks with dueAt in the past', () => {
      generator({
        users: { _id: 'userId' },
        tasks: [
          {
            _factory: null,
            status: TASK_STATUS.ACTIVE,
            assigneeLink: { _id: 'userId' },
          },
          {
            _factory: null,
            status: TASK_STATUS.COMPLETED,
            assigneeLink: { _id: 'userId' },
          },
          {
            _factory: null,
            status: TASK_STATUS.ACTIVE,
            dueAt: tomorrow,
            assigneeLink: { _id: 'userId' },
          },
          {
            _factory: null,
            _id: 'a',
            status: TASK_STATUS.ACTIVE,
            dueAt: yesterday,
            assigneeLink: { _id: 'userId' },
          },
        ],
      });

      NotificationService.addTaskNotifications();
      const notifications = NotificationService.fetch({ taskLink: 1 });

      expect(notifications.length).to.equal(1);
      expect(notifications[0].taskLink._id).to.equal('a');
    });

    it('does not add a notification if there is already one', () => {
      generator({
        users: { _id: 'userId' },
        tasks: [
          {
            _factory: null,
            status: TASK_STATUS.ACTIVE,
            assigneeLink: { _id: 'userId' },
            dueAt: yesterday,
            _id: 'a',
          },
          {
            _factory: null,
            status: TASK_STATUS.ACTIVE,
            assigneeLink: { _id: 'userId' },
            dueAt: yesterday,
            _id: 'b',
          },
        ],
        notifications: {
          _factory: null,
          recipientLinks: [{ _id: 'userId' }],
          taskLink: { _id: 'a' },
          _id: 'old',
        },
      });

      NotificationService.addTaskNotifications();
      const notifications = NotificationService.fetch({
        $options: { sort: { createdAt: 1 } },
        taskLink: 1,
      });

      expect(notifications.length).to.equal(2);
      expect(notifications[0]._id).to.equal('old');
      expect(notifications[0].taskLink._id).to.equal('a');
      expect(notifications[1].taskLink._id).to.equal('b');
    });

    it('adds all admins on a due task notification if no one is assigned to it', () => {
      generator({
        users: [
          { _id: 'userId1', _factory: 'admin' },
          { _id: 'userId2', _factory: 'admin' },
          { _id: 'userId3', _factory: 'admin' },
          { _id: 'userId4', _factory: 'user' },
          { _id: 'userId5', _factory: 'pro' },
          { _id: 'userId6', _factory: 'dev' },
        ],
        tasks: {
          _factory: null,
          status: TASK_STATUS.ACTIVE,
          dueAt: yesterday,
          _id: 'a',
        },
      });

      NotificationService.addTaskNotifications();
      const notifications = NotificationService.fetch({
        taskLink: 1,
        recipientLinks: 1,
      });

      expect(notifications.length).to.equal(1);
      expect(notifications[0].recipientLinks.length).to.equal(3);
      expect(
        notifications[0].recipientLinks.map(({ _id }) => _id),
      ).to.deep.equal(['userId1', 'userId2', 'userId3']);
    });
  });

  describe('notification retirement', () => {
    it('removes an existing notification if a tasks due date is changed', () => {
      generator({
        users: { _id: 'userId' },
        tasks: [
          {
            _factory: null,
            status: TASK_STATUS.ACTIVE,
            assigneeLink: { _id: 'userId' },
            dueAt: yesterday,
            _id: 'a',
          },
        ],
        notifications: {
          _factory: null,
          recipientLinks: [{ _id: 'userId' }],
          taskLink: { _id: 'a' },
          _id: 'old',
        },
      });

      TaskService.update({ taskId: 'a', object: { dueAt: new Date() } });
      const notifications = NotificationService.fetch({});

      expect(notifications.length).to.equal(0);
    });

    it("removes an existing notification if an activity's date is changed", () => {
      generator({
        users: { _id: 'userId' },
        activities: [
          {
            _factory: null,
            date: yesterday,
            _id: 'a',
            createdBy: 'userId',
            title: 'Hello',
            type: ACTIVITY_TYPES.OTHER,
          },
        ],
        notifications: {
          _factory: null,
          activityLink: { _id: 'a' },
          _id: 'old',
          recipientLinks: [{ _id: 'userId' }],
        },
      });

      ActivityService._update({
        id: 'a',
        object: { date: new Date(), type: ACTIVITY_TYPES.OTHER },
      });
      const notifications = NotificationService.fetch({});

      expect(notifications.length).to.equal(0);
    });
  });
});
