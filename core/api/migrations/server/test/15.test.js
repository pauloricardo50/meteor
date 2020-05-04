import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { LOAN_CATEGORIES } from '../../../loans/loanConstants';
import Loans from '../../../loans/loans';
import { down, up } from '../15';

describe('Migration 15', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds a category on all loans', async () => {
      await Loans.rawCollection().insert({ _id: '1', name: 'a' });
      await Loans.rawCollection().insert({ _id: '2', name: 'b' });
      await Loans.rawCollection().insert({ _id: '3', name: 'c' });

      Loans.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(undefined);
        });

      await up();

      Loans.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(LOAN_CATEGORIES.STANDARD);
        });
    });
  });

  describe('down', () => {
    it('removes category from all loans', async () => {
      await Loans.rawCollection().insert({
        _id: '1',
        category: LOAN_CATEGORIES.STANDARD,
        name: 'a',
      });
      await Loans.rawCollection().insert({
        _id: '2',
        category: LOAN_CATEGORIES.STANDARD,
        name: 'b',
      });
      await Loans.rawCollection().insert({
        _id: '3',
        category: LOAN_CATEGORIES.PREMIUM,
        name: 'c',
      });

      Loans.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.not.equal(undefined);
        });

      await down();

      Loans.find()
        .fetch()
        .forEach(({ category }) => {
          expect(category).to.equal(undefined);
        });
    });
  });
});
