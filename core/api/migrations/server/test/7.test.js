//
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Loans } from '../../..';
import { up, down } from '../7';

describe('Migration 7', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('removes loan.logic', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', logic: { step: 'yo' } })
        .then(up)
        .then(() => {
          const loans = Loans.find({}).fetch();

          expect(loans[0].logic).to.equal(undefined);
        }));

    it('sets the step on the loan', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', logic: { step: 'yo' } })
        .then(up)
        .then(() => {
          const loans = Loans.find({}).fetch();

          expect(loans[0].step).to.equal('yo');
        }));
  });

  describe('down', () => {
    it('removes step', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', step: 'yo' })
        .then(down)
        .then(() => {
          const loans = Loans.find({}).fetch();

          expect(loans[0].step).to.equal(undefined);
        }));

    it('sets the step on loan.logic', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', step: 'yo' })
        .then(down)
        .then(() => {
          const loans = Loans.find({}).fetch();

          expect(loans[0].logic).to.deep.equal({ step: 'yo' });
        }));
  });
});
