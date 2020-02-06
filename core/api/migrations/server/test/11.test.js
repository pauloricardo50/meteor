//
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import UserService from '../../../users/server/UserService';
import { up, down } from '../11';
import generator from '../../../factories';

describe('Migration 11', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('sets first organisation as main', () => {
      generator({
        organisations: [
          { name: 'org1', users: [{ _id: 'user1' }, { _id: 'user2' }] },
          { name: 'org2', users: [{ _id: 'user1' }] },
          {
            name: 'org3',
            users: [{ _id: 'user1' }, { _id: 'user2' }, { _id: 'user3' }],
          },
          { name: 'org4', users: [{ _id: 'user2' }] },
        ],
        users: [{ _id: 'user4' }],
      });
      return up().then(() => {
        const allUsers = UserService.fetch({
          organisations: { _id: 1 },
        });
        allUsers.forEach(({ organisations = [] }) =>
          organisations.forEach(({ $metadata: { isMain } }, index) => {
            if (index === 0) {
              expect(isMain).to.equal(true);
            } else {
              expect(isMain).to.equal(false);
            }
          }),
        );
      });
    });
  });

  describe('down', () => {
    it('removes isMain metadata', () => {
      generator({
        organisations: [
          {
            name: 'org1',
            users: [
              { _id: 'user1', $metadata: { isMain: true } },
              { _id: 'user2' },
            ],
          },
          { name: 'org2', users: [{ _id: 'user1' }] },
          {
            name: 'org3',
            users: [
              { _id: 'user1' },
              { _id: 'user2' },
              { _id: 'user3', $metadata: { isMain: true } },
            ],
          },
          {
            name: 'org4',
            users: [{ _id: 'user2', $metadata: { isMain: true } }],
          },
        ],
        users: [{ _id: 'user4' }],
      });
      return down().then(() => {
        const allUsers = UserService.fetch({
          organisations: { _id: 1 },
        });
        allUsers.forEach(({ organisations = [] }) =>
          organisations.forEach(({ $metadata: { isMain } }) => {
            expect(isMain).to.equal(undefined);
          }),
        );
      });
    });
  });
});
