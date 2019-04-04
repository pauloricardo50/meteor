// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';
import { Loans } from '../../..';
import { up, down } from '../8';

describe('Migration 8', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('sets the applicationType to FULL on all loans', () =>
      Loans.rawCollection()
        .insert({ _id: 'test' })
        .then(() => Loans.rawCollection().insert({ _id: 'test2' }))
        .then(up)
        .then(() => {
          Loans.find({}).forEach(({ applicationType }) => {
            expect(applicationType).to.equal(APPLICATION_TYPES.FULL);
          });
        }));
  });

  describe('down', () => {
    it('removes applicationType', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', applicationType: 'FULL' })
        .then(() => Loans.rawCollection().insert({ _id: 'test2', applicationType: 'SIMPLE' }))
        .then(down)
        .then(() => {
          Loans.find({}).forEach(({ applicationType }) => {
            expect(applicationType).to.equal(undefined);
          });
        }));
  });
});
