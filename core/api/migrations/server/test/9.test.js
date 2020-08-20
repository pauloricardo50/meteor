import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import { STEPS } from '../../../loans/loanConstants';
import Loans from '../../../loans/loans';
import { down, up } from '../9';

/* eslint-env mocha */

describe('Migration 9', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('rename loan step', () =>
      Loans.rawCollection()
        .insert({ _id: 'test', name: '18-0001', step: 'PREPARATION' })
        .then(() =>
          Loans.rawCollection().insert({
            _id: 'test2',
            name: '18-0002',
            step: 'FIND_LENDER',
          }),
        )
        .then(() =>
          Loans.rawCollection().insert({
            _id: 'test3',
            name: '18-0003',
            step: 'GET_CONTRACT',
          }),
        )
        .then(() =>
          Loans.rawCollection().insert({
            _id: 'test4',
            name: '18-0004',
            step: 'CLOSING',
          }),
        )
        .then(up)
        .then(() => {
          Loans.find({}).forEach(({ step, _id }) => {
            let expectedStep;
            switch (_id) {
              case 'test':
                expectedStep = STEPS.SOLVENCY;
                break;
              case 'test2':
                expectedStep = STEPS.REQUEST;
                break;
              case 'test3':
                expectedStep = STEPS.OFFERS;
                break;
              case 'test4':
                expectedStep = STEPS.CLOSING;
                break;
              default:
                break;
            }
            expect(step).to.equal(expectedStep);
          });
        }));
  });
});
