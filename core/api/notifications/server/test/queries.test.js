//
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { adminNotifications } from '../../queries';
import generator from '../../../factories/index';
import '../exposures';

describe('adminNotifications', () => {
  beforeEach(() => {
    resetDatabase();
  });

  const USER_ID = 'a';
  const getNotifications = () =>
    adminNotifications.clone({ userId: USER_ID, unread: true }).fetch();

  it('fetches the latest notifications for one user', () => {
    generator({
      users: { _id: USER_ID },
      notifications: [
        { _id: '1', recipientLinks: [{ _id: USER_ID }] },
        { _id: '2', recipientLinks: [{ _id: 'b' }] },
      ],
    });

    const notifications = getNotifications();
    expect(notifications.length).to.equal(1);
    expect(notifications[0]._id).to.equal('1');
  });

  it('does not fetch read notifications', () => {
    generator({
      users: { _id: USER_ID },
      notifications: [
        { _id: '1', recipientLinks: [{ _id: USER_ID }] },
        { _id: '2', recipientLinks: [{ _id: USER_ID, read: true }] },
      ],
    });

    const notifications = getNotifications();
    expect(notifications.length).to.equal(1);
    expect(notifications[0]._id).to.equal('1');
  });

  it('does not fetch snoozed notifications', () => {
    const date = new Date();
    date.setHours(date.getHours() + 1);

    generator({
      users: { _id: USER_ID },
      notifications: [
        { _id: '1', recipientLinks: [{ _id: USER_ID }] },
        {
          _id: '2',
          recipientLinks: [{ _id: USER_ID, snoozeDate: date }],
        },
      ],
    });

    const notifications = getNotifications();
    expect(notifications.length).to.equal(1);
    expect(notifications[0]._id).to.equal('1');
  });

  it('does fetch snoozed notifications from the past', () => {
    const date = new Date();
    date.setHours(date.getHours() - 1);

    generator({
      users: { _id: USER_ID },
      notifications: [
        { _id: '1', recipientLinks: [{ _id: USER_ID }] },
        {
          _id: '2',
          recipientLinks: [{ _id: USER_ID, snoozeDate: date }],
        },
      ],
    });

    const notifications = getNotifications();
    expect(notifications.length).to.equal(2);
  });
});
