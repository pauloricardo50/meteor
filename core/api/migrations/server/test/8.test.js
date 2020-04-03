import { resetDatabase } from 'meteor/xolvio:cleaner';

/* eslint-env mocha */
import { expect } from 'chai';

import { APPLICATION_TYPES } from 'core/api/loans/loanConstants';

import Loans from '../../../loans/loans';
import { down, up } from '../8';

describe('Migration 8', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('sets the applicationType to FULL on all loans', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', name: '18-0001' })
        .then(() =>
          Loans.rawCollection().insert({ _id: 'test2', name: '18-0002' }),
        )
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
        .insert({ _id: 'test', applicationType: 'FULL', name: '18-0001' })
        .then(() =>
          Loans.rawCollection().insert({
            _id: 'test2',
            applicationType: 'SIMPLE',
            name: '18-0002',
          }),
        )
        .then(down)
        .then(() => {
          Loans.find({}).forEach(({ applicationType }) => {
            expect(applicationType).to.equal(undefined);
          });
        }));
  });
});
