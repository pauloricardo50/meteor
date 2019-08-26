// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import Borrowers from '../../../borrowers';
import { up, down } from '../20';

describe('Migration 20', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('migrates thirdPartyFortune to donation', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        thirdPartyFortune: 1000,
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await up();

      const borrower1 = Borrowers.findOne('b1');
      const borrower2 = Borrowers.findOne('b2');

      expect(borrower1.thirdPartyFortune).to.equal(undefined);
      expect(borrower1.donation.length).to.equal(1);
      expect(borrower1.donation[0]).to.deep.equal({
        value: 1000,
        description: '',
      });
      expect(borrower2.donation.length).to.equal(0);
    });
  });

  describe('down', () => {
    it('migrates back donation to thirdPartyFortune', async () => {
      await Borrowers.rawCollection().insert({
        _id: 'b1',
        donation: [{ value: 1000 }, { value: 500 }],
        thirdPartyLoan: [{ value: 2000 }],
      });

      await Borrowers.rawCollection().insert({
        _id: 'b2',
      });

      await down();

      const borrower1 = Borrowers.findOne('b1');
      const borrower2 = Borrowers.findOne('b2');

      expect(borrower1.donation).to.equal(undefined);
      expect(borrower1.thirdPartyLoan).to.equal(undefined);
      expect(borrower1.thirdPartyFortune).to.equal(1500);
      expect(borrower2.thirdPartyFortune).to.equal(undefined);
    });
  });
});
