// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Activities from 'core/api/activities';
import {
  ACTIVITY_TYPES,
  ACTIVITY_EVENT_METADATA,
} from 'core/api/activities/activityConstants';
import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { up, down } from '../22';

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

      const activity1 = Activities.findOne('1');
      const activity2 = Activities.findOne('2');
      const activity3 = Activities.findOne('3');
      const activity4 = Activities.findOne('4');
      const activity5 = Activities.findOne('5');

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

      const activity1 = Activities.findOne('1');
      const activity2 = Activities.findOne('2');
      const activity3 = Activities.findOne('3');
      const activity4 = Activities.findOne('4');
      const activity5 = Activities.findOne('5');

      expect(activity1.type).to.equal('SERVER');
      expect(activity1.secondaryType).to.equal(ACTIVITY_EVENT_METADATA.USER_PASSWORD_SET);
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
