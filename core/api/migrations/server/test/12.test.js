//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import UserService from '../../../users/server/UserService';
import { up, down } from '../12';
import generator from '../../../factories';

describe('Migration 12', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('enables customers sharing', () => {
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
          organisations.forEach(({ $metadata: { shareCustomers } }) => {
            expect(shareCustomers).to.equal(true);
          }),
        );
      });
    });
  });

  // Test is outdated
  describe.skip('down', () => {
    it('removes shareCustomers metadata', () => {
      generator({
        organisations: [
          {
            name: 'org1',
            users: [
              { _id: 'user1', $metadata: { shareCustomers: true } },
              { _id: 'user2' },
            ],
          },
          { name: 'org2', users: [{ _id: 'user1' }] },
          {
            name: 'org3',
            users: [
              { _id: 'user1' },
              { _id: 'user2' },
              { _id: 'user3', $metadata: { shareCustomers: true } },
            ],
          },
          {
            name: 'org4',
            users: [{ _id: 'user2', $metadata: { shareCustomers: true } }],
          },
        ],
        users: [{ _id: 'user4' }],
      });
      return down().then(() => {
        const allUsers = UserService.fetch({
          organisations: { _id: 1 },
        });
        allUsers.forEach(({ organisations = [] }) =>
          organisations.forEach(({ $metadata: { shareCustomers } }) => {
            expect(shareCustomers).to.equal(undefined);
          }),
        );
      });
    });
  });
});
