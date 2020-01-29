// @flow
/* eslint-env-mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from 'core/api/factories/index';
import { ACQUISITION_CHANNELS } from 'core/api/users/userConstants';
import { up, down } from '../33';
import UserService from '../../../users/server/UserService';

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

    it('adds REFERRAL_PRO acquisition channel when user is referred by am organisation', async () => {
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

    it('does not add acquisition channel when user not referred', async () => {
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
