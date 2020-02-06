/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from 'core/api/activities/activityConstants';
import Users from 'core/api/users';
import UserService from 'core/api/users/server/UserService';
import { up, down } from '../24';

describe('Migration 24', () => {
  beforeEach(() => resetDatabase());
  describe('up', () => {
    it('adds first connection activity on all verified users', async () => {
      const today = new Date();

      await Promise.all(
        [...Array(5)].map((_, i) =>
          Users.rawCollection().insert({
            _id: String(i + 1),
            emails: [
              {
                address: `user${i + 1}@e-potek.ch`,
                verified: (i + 1) % 2 === 0,
              },
            ],
            createdAt: moment(today)
              .add(i, 'day')
              .toDate(),
          }),
        ),
      );

      await up();

      const allUsers = UserService.fetch({
        _id: 1,
        createdAt: 1,
        emails: { verified: 1 },
        activities: { type: 1, metadata: 1, date: 1 },
      });

      allUsers.forEach(({ activities = [], _id, emails = [] }) => {
        const date = moment(today)
          .add(_id - 1, 'days')
          .toDate();
        const [{ verified }] = emails;
        if (verified) {
          expect(activities.length).to.equal(1);
          expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
          expect(activities[0].date.toString()).to.equal(date.toString());
          expect(activities[0].metadata.event).to.equal(
            ACTIVITY_EVENT_METADATA.USER_FIRST_CONNECTION,
          );
        } else {
          expect(activities.length).to.equal(0);
        }
      });
    });
  });

  describe('down', () => {
    it('removes first connection activities on users', async () => {
      const today = new Date();
      await Promise.all(
        [...Array(5)].map((_, i) =>
          Users.rawCollection().insert({
            _id: String(i + 1),
            emails: [
              {
                address: `user${i + 1}@e-potek.ch`,
                verified: (i + 1) % 2 === 0,
              },
            ],
            createdAt: moment(today)
              .add(i, 'day')
              .toDate(),
          }),
        ),
      );

      await up();
      await down();

      const allUsers = await UserService.fetch({
        _id: 1,
        activities: { _id: 1 },
      });

      allUsers.forEach(({ activities = [] }) => {
        expect(activities.length).to.equal(0);
      });
    });
  });
});
