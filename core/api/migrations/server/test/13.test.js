//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { up, down } from '../13';
import { Loans, Borrowers } from '../../..';

describe('Migration 13', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds an empty object on all relevant documents', async () => {
      await Loans.rawCollection().insert({
        _id: 'test1',
        name: '18-0001',
      });

      await Loans.rawCollection().insert({
        _id: 'test2',
        name: '18-0002',
      });

      Loans.find({})
        .fetch()
        .forEach(({ documents }) => {
          expect(documents).to.equal(undefined);
        });

      await up();

      Loans.find({})
        .fetch()
        .forEach(({ documents }) => {
          expect(documents).to.deep.equal({});
        });
    });
  });

  describe('down', () => {
    it('removes documents from all collections', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'test',
        documents: { stuff: { yo: 'dude' } },
      });

      await down();

      Borrowers.find({})
        .fetch()
        .forEach(({ documents }) => {
          expect(documents).to.equal(undefined);
        });
    });
  });
});
