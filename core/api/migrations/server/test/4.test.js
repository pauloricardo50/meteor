import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import Promotions from '../../../promotions';
import Users from '../../../users/users';
import { PERMISSIONS, down, up } from '../4';

describe('Migration 4', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('modifies user promotion permissions', () => {
      const userId1 = Users.insert({ _id: 'userId1' });
      const userId2 = Users.insert({ _id: 'userId2' });

      return Promotions.rawCollection()
        .insert({
          _id: 'promotionId1',
          userLinks: [
            { _id: userId1, permissions: 'READ' },
            { _id: userId2, permissions: 'MODIFY' },
          ],
        })
        .then(() =>
          Promotions.rawCollection().insert({
            _id: 'promotionId2',
            userLinks: [
              { _id: userId1, permissions: 'READ' },
              { _id: userId2, permissions: 'MODIFY' },
            ],
          }),
        )
        .then(() => {
          Promotions.find().forEach(({ userLinks }) => {
            userLinks.forEach(({ permissions }) => {
              expect(typeof permissions).to.equal('string');
              expect(permissions).to.not.equal(undefined);
            });
          });
        })
        .then(up)
        .then(() =>
          Promotions.find({}).forEach(({ userLinks }) => {
            userLinks.forEach(({ permissions }) => {
              expect(typeof permissions).to.equal('object');
              expect(permissions).to.deep.equal(PERMISSIONS);
            });
          }),
        );
    });
  });

  describe('down', () => {
    it('resets user promotion permissions to READ', () => {
      const userId1 = Users.insert({ _id: 'userId1' });
      const userId2 = Users.insert({ _id: 'userId2' });

      return Promotions.rawCollection()
        .insert({
          _id: 'promotionId1',
          userLinks: [
            { _id: userId1, permissions: { canInviteCustomers: true } },
            { _id: userId2, permissions: { canInviteCustomers: true } },
          ],
        })
        .then(() =>
          Promotions.rawCollection().insert({
            _id: 'promotionId2',
            userLinks: [
              { _id: userId1, permissions: { canInviteCustomers: true } },
              { _id: userId2, permissions: { canInviteCustomers: true } },
            ],
          }),
        )
        .then(() => {
          Promotions.find().forEach(({ userLinks }) => {
            userLinks.forEach(({ permissions }) => {
              expect(typeof permissions).to.equal('object');
              expect(permissions.canInviteCustomers).to.equal(true);
            });
          });
        })
        .then(down)
        .then(() =>
          Promotions.find({}).forEach(({ userLinks }) => {
            userLinks.forEach(({ permissions }) => {
              expect(typeof permissions).to.equal('string');
              expect(permissions).to.equal('READ');
            });
          }),
        );
    });
  });
});
