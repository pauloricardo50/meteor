import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import UserService from '../../../users/server/UserService';
import { ACQUISITION_CHANNELS } from '../../../users/userConstants';
import { down, up } from '../36';

/* eslint-env-mocha */

describe('Migration 36', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds REFERRAL_ORGANIC acquisition channel when user is referred by an organisation only', async () => {
      generator({
        organisations: { _id: 'org' },
        users: {
          _id: 'user',
          _factory: 'user',
          referredByOrganisationLink: 'org',
        },
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_ORGANIC,
      );
    });

    it('does not add REFERRAL_ORGANIC acquisition channel when user is referred by user only', async () => {
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

      expect(user.acquisitionChannel).to.equal(undefined);
    });

    it('does not add REFERRAL_ORGANIC acquisition channel when user is referred by user and organisation', async () => {
      generator({
        organisations: { _id: 'org' },

        users: [
          { _id: 'pro', _factory: 'pro' },
          {
            _id: 'user',
            _factory: 'user',
            referredByUserLink: 'pro',
            referredByOrganisationLink: 'org',
          },
        ],
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });

    it('does not add REFERRAL_ORGANIC acquisition channel when user is not referred', async () => {
      generator({
        users: {
          _id: 'user',
          _factory: 'user',
        },
      });

      await up();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('adds back REFERRAL_PRO acquisition channel when user is referred by an organisation only', async () => {
      generator({
        organisations: { _id: 'org' },
        users: {
          _id: 'user',
          _factory: 'user',
          referredByOrganisationLink: 'org',
        },
      });

      await down();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(
        ACQUISITION_CHANNELS.REFERRAL_PRO,
      );
    });

    it('does not add REFERRAL_PRO acquisition channel when user is referred by user only', async () => {
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

      await down();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });

    it('does not add REFERRAL_PRO acquisition channel when user is referred by user and organisation', async () => {
      generator({
        organisations: { _id: 'org' },

        users: [
          { _id: 'pro', _factory: 'pro' },
          {
            _id: 'user',
            _factory: 'user',
            referredByUserLink: 'pro',
            referredByOrganisationLink: 'org',
          },
        ],
      });

      await down();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });

    it('does not add REFERRAL_PRO acquisition channel when user is not referred', async () => {
      generator({
        users: {
          _id: 'user',
          _factory: 'user',
        },
      });

      await down();

      const user = UserService.get('user', {
        acquisitionChannel: 1,
      });

      expect(user.acquisitionChannel).to.equal(undefined);
    });
  });
});
