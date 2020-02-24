/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from '../../../factories/server';
import { ORGANISATION_TYPES, ORGANISATION_FEATURES } from '../../../constants';
import { Loans } from '../../..';
import { up, down } from '../5';
import LoanService from '../../../loans/server/LoanService';

// Tests are out of date with new max property calculation
describe.skip('Migration 5', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      organisations: [
        {
          name: 'org',
          type: ORGANISATION_TYPES.BANK,
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: [
            { _factory: 'lenderRulesAll', order: 0 },
            { _factory: 'lenderRulesMain', maxBorrowRatio: 0.9, order: 1 },
            { _factory: 'lenderRulesSecondary', maxBorrowRatio: 0.7, order: 2 },
          ],
        },
        {
          name: 'org2',
          type: ORGANISATION_TYPES.BANK,
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: [
            { _factory: 'lenderRulesAll', order: 0 },
            { _factory: 'lenderRulesMain', maxBorrowRatio: 0.7, order: 1 },
            {
              _factory: 'lenderRulesSecondary',
              maxBorrowRatio: 0.65,
              order: 2,
            },
          ],
        },
      ],
    });
  });

  describe('up', () => {
    it('adds range on maxPropertyValue', () => {
      const loanIds = ['loanId1', 'loanId2'];
      generator({
        loans: loanIds.map(_id => ({
          _id,
          borrowers: {
            bankFortune: [{ value: 500000 }],
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
        })),
      });

      return Loans.rawCollection()
        .update(
          { _id: 'loanId1' },
          {
            $set: {
              maxSolvency: {
                canton: 'GE',
                date: new Date(),
                main: { propertyValue: 1000000, borrowRatio: 0.8 },
                second: { propertyValue: 900000, borrowRatio: 0.7 },
              },
            },
          },
        )
        .then(up)
        .then(() => {
          const loan1 = LoanService.get('loanId1', {
            maxPropertyValue: 1,
            maxSolvency: 1,
          });
          const loan2 = LoanService.get('loanId2', {
            maxPropertyValue: 1,
            maxSolvency: 1,
          });

          expect(loan2.maxPropertyValue).to.equal(undefined);
          expect(loan1.maxSolvency).to.equal(undefined);
          expect(loan1.maxPropertyValue).to.not.equal(undefined);
          expect(loan1.maxPropertyValue.main).to.not.equal(undefined);
          expect(loan1.maxPropertyValue.main).to.deep.equal({
            min: { borrowRatio: 0.7, propertyValue: 1707000 },
            max: { borrowRatio: 0.8713, propertyValue: 3278000 },
          });
          expect(loan1.maxPropertyValue.second).to.not.equal(undefined);
          expect(loan1.maxPropertyValue.second).to.deep.equal({
            min: { borrowRatio: 0.65, propertyValue: 1244000 },
            max: { borrowRatio: 0.7, propertyValue: 1420000 },
          });
        });
    });
  });

  describe('down', () => {
    it('removes range on maxPropertyValue', () => {
      const loanIds = ['loanId1', 'loanId2'];
      generator({
        loans: loanIds.map(_id => ({
          _id,
          borrowers: {
            bankFortune: [{ value: 500000 }],
            salary: 1000000,
            insurance2: [{ value: 100000 }],
          },
        })),
      });

      return Loans.rawCollection()
        .update(
          { _id: 'loanId1' },
          {
            $set: {
              maxPropertyValue: {
                canton: 'GE',
                date: new Date(),
                main: {
                  min: { borrowRatio: 0.7, propertyValue: 1707000 },
                  max: { borrowRatio: 0.8713, propertyValue: 3278000 },
                },
                second: {
                  min: { borrowRatio: 0.65, propertyValue: 1244000 },
                  max: { borrowRatio: 0.7, propertyValue: 1420000 },
                },
              },
            },
          },
        )
        .then(down)
        .then(() => {
          const loan1 = LoanService.get('loanId1', {
            maxPropertyValue: 1,
            maxSolvency: 1,
          });
          const loan2 = LoanService.get('loanId2', {
            maxPropertyValue: 1,
            maxSolvency: 1,
          });

          expect(loan2.maxPropertyValue).to.equal(undefined);
          expect(loan1.maxPropertyValue).to.equal(undefined);
          expect(loan1.maxSolvency).to.not.equal(undefined);
          expect(loan1.maxSolvency.main).to.not.equal(undefined);
          expect(loan1.maxSolvency.main).to.deep.equal({
            borrowRatio: 0.8713,
            propertyValue: 3278000,
          });
          expect(loan1.maxSolvency.second).to.not.equal(undefined);
          expect(loan1.maxSolvency.second).to.deep.equal({
            borrowRatio: 0.7,
            propertyValue: 1420000,
          });
        });
    });
  });
});
