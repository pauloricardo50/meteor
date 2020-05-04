import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import Activities from '../../../activities';
import {
  ACTIVITY_EVENT_METADATA,
  ACTIVITY_TYPES,
} from '../../../activities/activityConstants';
import ActivityService from '../../../activities/server/ActivityService';
import { EMAIL_IDS } from '../../../email/emailConstants';
import { down, up } from '../22';

describe('Migration 22', () => {
  beforeEach(() => resetDatabase());
  describe('up', () => {
    it('migrates SERVER activities only', async () => {
      await Promise.all([
        Activities.rawCollection().insert({
          _id: '1',
          type: 'SERVER',
          secondaryType: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
        }),
        Activities.rawCollection().insert({ _id: '2', type: 'EVENT' }),
        Activities.rawCollection().insert({ _id: '3', type: 'EMAIL' }),
        Activities.rawCollection().insert({ _id: '4', type: 'PHONE' }),
        Activities.rawCollection().insert({ _id: '5', type: 'OTHER' }),
      ]);

      await up();

      const activity1 = ActivityService.get('1', { type: 1, metadata: 1 });
      const activity2 = ActivityService.get('2', { type: 1, metadata: 1 });
      const activity3 = ActivityService.get('3', { type: 1, metadata: 1 });
      const activity4 = ActivityService.get('4', { type: 1, metadata: 1 });
      const activity5 = ActivityService.get('5', { type: 1, metadata: 1 });

      expect(activity1.type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activity1.metadata).to.deep.equal({
        event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
      });
      expect(activity2.type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activity2.metadata).to.equal(undefined);
      expect(activity3.type).to.equal(ACTIVITY_TYPES.EMAIL);
      expect(activity3.metadata).to.equal(undefined);
      expect(activity4.type).to.equal(ACTIVITY_TYPES.PHONE);
      expect(activity4.metadata).to.equal(undefined);
      expect(activity5.type).to.equal(ACTIVITY_TYPES.OTHER);
      expect(activity5.metadata).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('migrates back SERVER activities and remove metadata on all activities', async () => {
      await Promise.all([
        Activities.rawCollection().insert({
          _id: '1',
          type: 'EVENT',
          isServerGenerated: true,
          metadata: { event: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET },
        }),
        Activities.rawCollection().insert({
          _id: '2',
          type: 'EVENT',
        }),
        Activities.rawCollection().insert({
          _id: '3',
          type: 'EMAIL',
          isServerGenerated: true,
          metadata: { emailId: EMAIL_IDS.ENROLL_ACCOUNT },
        }),
        Activities.rawCollection().insert({ _id: '4', type: 'PHONE' }),
        Activities.rawCollection().insert({ _id: '5', type: 'OTHER' }),
      ]);

      await down();

      const activity1 = ActivityService.get('1', {
        type: 1,
        secondaryType: 1,
        metadata: 1,
      });
      const activity2 = ActivityService.get('2', {
        type: 1,
        secondaryType: 1,
        metadata: 1,
      });
      const activity3 = ActivityService.get('3', {
        type: 1,
        secondaryType: 1,
        metadata: 1,
      });
      const activity4 = ActivityService.get('4', {
        type: 1,
        secondaryType: 1,
        metadata: 1,
      });
      const activity5 = ActivityService.get('5', {
        type: 1,
        secondaryType: 1,
        metadata: 1,
      });

      expect(activity1).to.deep.include({
        type: 'SERVER',
        secondaryType: ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET,
      });
      expect(activity1.metadata).to.equal(undefined);
      expect(activity2.type).to.equal(ACTIVITY_TYPES.EVENT);
      expect(activity2.metadata).to.equal(undefined);
      expect(activity3.type).to.equal('SERVER');
      expect(activity3.secondaryType).to.equal(undefined);
      expect(activity3.metadata).to.equal(undefined);
      expect(activity4.type).to.equal(ACTIVITY_TYPES.PHONE);
      expect(activity4.metadata).to.equal(undefined);
      expect(activity5.type).to.equal(ACTIVITY_TYPES.OTHER);
      expect(activity5.metadata).to.equal(undefined);
    });
  });
});
