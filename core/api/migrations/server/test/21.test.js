import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { OWN_FUNDS_TYPES } from 'core/api/borrowers/borrowerConstants';

import Loans from '../../../loans/loans';
import LoanService from '../../../loans/server/LoanService';
import { down, up } from '../21';

describe('Migration 21', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('migrates thirdPartyFortune to donation in structures', async () => {
      await Loans.rawCollection().insert({
        _id: 'l1',
        name: 'loan1',
        structures: [
          {
            ownFunds: [
              {
                type: 'a',
                value: 5,
              },
              {
                type: 'thirdPartyFortune',
                value: 7,
              },
            ],
          },
          {
            ownFunds: [
              {
                type: 'd',
                value: 5,
              },
              {
                type: 'thirdPartyFortune',
                value: 7,
              },
            ],
          },
          {
            ownFunds: [
              {
                type: 'e',
                value: 5,
              },
            ],
          },
        ],
      });

      await Loans.rawCollection().insert({
        _id: 'l2',
        name: 'loan2',
        structures: [
          {
            ownFunds: [
              {
                type: 'b',
                value: 5,
              },
            ],
          },
        ],
      });

      await up();

      const loan1 = LoanService.get('l1', { structures: 1 });
      const loan2 = LoanService.get('l2', { structures: 1 });

      const { structures: structures1 } = loan1;
      const { structures: structures2 } = loan2;

      expect(structures1.length).to.equal(3);
      expect(structures1[0]).to.deep.equal({
        ownFunds: [
          {
            type: 'a',
            value: 5,
          },
          {
            type: OWN_FUNDS_TYPES.DONATION,
            value: 7,
          },
        ],
      });
      expect(structures1[1]).to.deep.equal({
        ownFunds: [
          {
            type: 'd',
            value: 5,
          },
          {
            type: OWN_FUNDS_TYPES.DONATION,
            value: 7,
          },
        ],
      });

      expect(structures1[2]).to.deep.equal({
        ownFunds: [
          {
            type: 'e',
            value: 5,
          },
        ],
      });

      expect(structures2.length).to.equal(1);
      expect(structures2[0]).to.deep.equal({
        ownFunds: [
          {
            type: 'b',
            value: 5,
          },
        ],
      });
    });
  });

  describe('down', () => {
    it('migrates back donation to thirdPartyFortune in structures', async () => {
      await Loans.rawCollection().insert({
        _id: 'l1',
        name: 'loan1',
        structures: [
          {
            ownFunds: [
              {
                type: 'a',
                value: 5,
              },
              {
                type: OWN_FUNDS_TYPES.DONATION,
                value: 7,
              },
            ],
          },
          {
            ownFunds: [
              {
                type: 'd',
                value: 5,
              },
              {
                type: OWN_FUNDS_TYPES.DONATION,
                value: 7,
              },
            ],
          },
          {
            ownFunds: [
              {
                type: 'e',
                value: 5,
              },
            ],
          },
        ],
      });

      await Loans.rawCollection().insert({
        _id: 'l2',
        name: 'loan2',
        structures: [
          {
            ownFunds: [
              {
                type: 'b',
                value: 5,
              },
            ],
          },
        ],
      });

      await down();

      const loan1 = LoanService.get('l1', { structures: 1 });
      const loan2 = LoanService.get('l2', { structures: 1 });

      const { structures: structures1 } = loan1;
      const { structures: structures2 } = loan2;

      expect(structures1.length).to.equal(3);
      expect(structures1[0]).to.deep.equal({
        ownFunds: [
          {
            type: 'a',
            value: 5,
          },
          {
            type: 'thirdPartyFortune',
            value: 7,
          },
        ],
      });
      expect(structures1[1]).to.deep.equal({
        ownFunds: [
          {
            type: 'd',
            value: 5,
          },
          {
            type: 'thirdPartyFortune',
            value: 7,
          },
        ],
      });

      expect(structures1[2]).to.deep.equal({
        ownFunds: [
          {
            type: 'e',
            value: 5,
          },
        ],
      });

      expect(structures2.length).to.equal(1);
      expect(structures2[0]).to.deep.equal({
        ownFunds: [
          {
            type: 'b',
            value: 5,
          },
        ],
      });
    });
  });
});
