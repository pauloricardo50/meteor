// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Promotions, Users } from '../../..';
import { up, down } from '../4';

describe('Migration 4', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('modifies user promotion permissions', () => {
      const userId1 = Users.insert({ _id: 'userId1' });
      const userId2 = Users.insert({ _id: 'userId2' });
      Promotions.rawCollection().insert({
        _id: 'promotionId1',
        userLinks: [
          { _id: userId1, permissions: 'READ' },
          { _id: userId2, permissions: 'MODIFY' },
        ],
      });
      Promotions.rawCollection().insert({
        _id: 'promotionId2',
        userLinks: [
          { _id: userId1, permissions: 'READ' },
          { _id: userId2, permissions: 'MODIFY' },
        ],
      });

      Promotions.find().forEach(({ userLinks }) => {
        userLinks.forEach(({ permissions }) => {
          expect(typeof permissions).to.equal('string');
          expect(permissions).to.not.equal(undefined);
        });
      });

      return up().then(() =>
        Promotions.find().forEach(({ userLinks }) => {
          userLinks.forEach(({ permissions }) => {
            expect(typeof permissions).to.equal('object');
            expect(Object.keys(permissions).length).to.equal(0);
          });
        }));
    });
  });

  describe('down', () => {
    it('resets user promotion permissions to READ', () => {
      const userId1 = Users.insert({ _id: 'userId1' });
      const userId2 = Users.insert({ _id: 'userId2' });
      Promotions.rawCollection().insert({
        _id: 'promotionId1',
        userLinks: [
          { _id: userId1, permissions: { canInviteCustomers: true } },
          { _id: userId2, permissions: { canInviteCustomers: true } },
        ],
      });
      Promotions.rawCollection().insert({
        _id: 'promotionId2',
        userLinks: [
          { _id: userId1, permissions: { canInviteCustomers: true } },
          { _id: userId2, permissions: { canInviteCustomers: true } },
        ],
      });

      Promotions.find().forEach(({ userLinks }) => {
        userLinks.forEach(({ permissions }) => {
          expect(typeof permissions).to.equal('object');
          expect(permissions.canInviteCustomers).to.equal(true);
        });
      });

      return down().then(() =>
        Promotions.find().forEach(({ userLinks }) => {
          userLinks.forEach(({ permissions }) => {
            expect(typeof permissions).to.equal('string');
            expect(permissions).to.equal('READ');
          });
        }));
    });
  });
});
