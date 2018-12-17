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
    it('adds a category on all Loans', () => {
      Loans.rawCollection().insert({ general: { residenceType: 'dude' } });
      Loans.rawCollection().insert({ general: { residenceType: 'dude' } });

      up().then(() => {
        Loans.find()
          .fetch()
          .forEach(({ general, residenceType }) => {
            expect(general).to.equal(undefined);
            expect(residenceType).to.equal('dude');
          });
      });
    });
  });

  describe('down', () => {
    it('adds a category on all Loans', () => {
      Loans.rawCollection().insert({ residenceType: 'dude' });
      Loans.rawCollection().insert({ residenceType: 'dude' });

      down().then(() => {
        Loans.find()
          .fetch()
          .forEach(({ general, residenceType }) => {
            expect(general).to.deep.equal({ residenceType: 'dude' });
            expect(residenceType).to.equal(undefined);
          });
      });
    });
  });
});
