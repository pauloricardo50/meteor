import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import BorrowerService from '../../../borrowers/server/BorrowerService';
import { down, up } from '../43';

/* eslint-env-mocha */

describe('Migration 43', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('migrates children to an array', async () => {
      await BorrowerService.rawCollection.insert({
        _id: 'b1',
        childrenCount: 2,
      });

      await up();

      const borrowers = BorrowerService.fetch({
        childrenCount: 1,
        children: 1,
      });

      expect(borrowers[0].childrenCount).to.equal(undefined);
      expect(borrowers[0].children).to.deep.equal([
        { name: 'Enfant 1' },
        { name: 'Enfant 2' },
      ]);
    });

    it('does nothing if childrenCount is not set', async () => {
      await BorrowerService.rawCollection.insert({
        _id: 'b1',
      });

      await up();

      const borrowers = BorrowerService.fetch({
        childrenCount: 1,
        children: 1,
      });

      expect(borrowers[0].childrenCount).to.equal(undefined);
      expect(borrowers[0].children).to.deep.equal(undefined);
    });
  });

  describe('down', () => {
    it('migrates children back to a single value', async () => {
      await BorrowerService.rawCollection.insert({
        _id: 'b1',
        children: [
          { name: 'Joe', age: 8 },
          { name: 'Jack', age: 3 },
          { name: 'Mary', age: 4 },
        ],
      });

      await down();

      const borrowers = BorrowerService.fetch({
        childrenCount: 1,
        children: 1,
      });

      expect(borrowers[0].childrenCount).to.equal(3);
      expect(borrowers[0].children).to.deep.equal(undefined);
    });
  });
});
