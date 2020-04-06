import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env-mocha */
import { expect } from 'chai';

import ActivityService from '../../../activities/server/ActivityService';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';
import { ACQUISITION_CHANNELS } from '../../../users/userConstants';
import { down, up } from '../33';

describe('Migration 33', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds REFERRAL_PRO acquisition channel when user is referred by a pro', async () => {
      generator({
        users: [
          { _id: 'pro', _factory: 'pro' },
          {
            _id: 'user',
            _factory: 'user',
            referredByUserLink: 'pro',
          },
        ],
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_PRO,
      );
    });

    it('adds REFERRAL_ADMIN acquisition channel when user is referred by an admin', async () => {
      generator({
        users: [
          { _id: 'admin', _factory: 'admin' },
          {
            _id: 'user',
            _factory: 'user',
            referredByUserLink: 'admin',
          },
        ],
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_ADMIN,
      );
    });

    it('adds REFERRAL_PRO acquisition channel when user is referred by an organisation', async () => {
      generator({
        organisations: { _id: 'org' },
        users: [
          {
            _id: 'user',
            _factory: 'user',
            referredByOrganisationLink: 'org',
          },
        ],
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_PRO,
      );
    });

    it('adds REFERRAL_API acquisition channel when user is referred via API', async () => {
      generator({
        users: [
          { _id: 'pro', _factory: 'pro' },
          {
            _id: 'user',
            _factory: 'user',
            referredByUserLink: 'pro',
          },
        ],
      });

      ActivityService.addCreatedAtActivity({
        createdAt: new Date(),
        description: 'Référé par Pro, API Realforce',
        title: 'Compte créé',
        userLink: { _id: 'user' },
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_API,
      );
    });

    it('does not add acquisition channel when user is not referred', async () => {
      generator({
        users: [
          {
            _id: 'user',
            _factory: 'user',
          },
        ],
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('removes acquisition channel on users', async () => {
      generator({
        users: [
          {
            _id: 'user',
            _factory: 'user',
            acquisitionChannel: ACQUISITION_CHANNELS.REFERRAL_PRO,
          },
        ],
      });

      await down();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });
  });
});
