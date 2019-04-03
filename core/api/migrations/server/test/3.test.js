// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { Loans } from '../../..';
import { up, down } from '../3';

describe('Migration 3', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds a category on all Loans', () =>
      Promise.all([
        Loans.rawCollection().insert({
          _id: 'loan1',
          general: { residenceType: 'dude' },
        }),
        Loans.rawCollection().insert({
          _id: 'loan2',
          general: { residenceType: 'dude' },
        }),
      ])
        .then(up)
        .then(() => {
          const loans = Loans.find().fetch();
          loans.forEach(({ general, residenceType }) => {
            expect(general).to.equal(undefined);
            expect(residenceType).to.equal('dude');
          });
        }));
  });

  describe('down', () => {
    it('adds a category on all Loans', () =>
      Promise.all([
        Loans.rawCollection().insert({ _id: 'loan1', residenceType: 'dude' }),
        Loans.rawCollection().insert({ _id: 'loan2', residenceType: 'dude' }),
      ])
        .then(down)
        .then(() => {
          const loans = Loans.find().fetch();
          loans.forEach(({ general, residenceType }) => {
            expect(general).to.deep.equal({ residenceType: 'dude' });
            expect(residenceType).to.equal(undefined);
          });
        }));
  });
});
