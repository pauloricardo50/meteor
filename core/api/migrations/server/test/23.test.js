import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';

import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../../activities/activityConstants';
import Users from '../../../users';
import UserService from '../../../users/server/UserService';
import { down, up } from '../23';

describe('Migration 23', () => {
  beforeEach(() => resetDatabase());
  describe('up', () => {
    it('adds createdAt activity on all users', async () => {
      const today = new Date();

      await Promise.all(
        [...Array(5)].map((_, i) =>
          Users.rawCollection().insert({
            _id: String(i + 1),
            createdAt: moment(today)
              .add(i, 'day')
              .toDate(),
          }),
        ),
      );

      await up();

      const allUsers = await UserService.fetch({
        _id: 1,
        createdAt: 1,
        activities: { type: 1, metadata: 1, date: 1 },
      });

      allUsers.forEach(({ activities = [], _id }) => {
        const date = moment(today)
          .add(_id - 1, 'days')
          .toDate();
        expect(activities.length).to.equal(1);
        expect(activities[0].type).to.equal(ACTIVITY_TYPES.EVENT);
        expect(activities[0].date.toString()).to.equal(date.toString());
        expect(activities[0].metadata.event).to.equal(
          ACTIVITY_EVENT_METADATA.CREATED,
        );
      });
    });
  });

  describe('down', () => {
    it('removes createdAt activities on users', async () => {
      const today = new Date();
      await Promise.all(
        [...Array(5)].map((_, i) =>
          Users.rawCollection().insert({
            _id: String(i + 1),
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
