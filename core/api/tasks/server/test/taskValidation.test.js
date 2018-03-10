/* eslint-env mocha */
import { expect } from 'chai';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { stubCollections } from 'core/utils/testHelpers';
import sinon from 'sinon';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { validateTask } from '../../taskValidation';
import { TASK_TYPE, AUCTION_STATUS } from '../../../constants';

describe('Task Validation', () => {
  it('throws if no task is given', () => {
    expect(() => validateTask()).to.throw();
  });

  it('returns true if the task has no type', () => {
    const task = {};
    expect(validateTask(task)).to.equal(true);
  });

  it('returns true if the task type is custom', () => {
    const task = { type: TASK_TYPE.CUSTOM };
    expect(validateTask(task)).to.equal(true);
  });

  describe('validation functions', () => {
    let userId;
    let loan;

    beforeEach(() => {
      resetDatabase();
      stubCollections();
      userId = Factory.create('user')._id;
      loan = Factory.create('loan');
      sinon.stub(Meteor, 'userId').callsFake(() => userId);
    });

    afterEach(() => {
      stubCollections.restore();
      Meteor.userId.restore();
    });

    describe('VERIFY', () => {
      it('returns false if the loan is not verified', () => {
        const task = { type: TASK_TYPE.VERIFY, loanId: loan._id };
        expect(validateTask(task)).to.equal(false);
      });

      it('returns true if the loan is valid', () => {
        loan = Factory.create('loan', {
          logic: { verification: { validated: true } },
        });

        const task = { type: TASK_TYPE.VERIFY, loanId: loan._id };
        expect(validateTask(task)).to.equal(true);
      });

      it('returns true if the loan is invalid', () => {
        loan = Factory.create('loan', {
          logic: { verification: { validated: false } },
        });

        const task = { type: TASK_TYPE.VERIFY, loanId: loan._id };
        expect(validateTask(task)).to.equal(true);
      });
    });

    describe('AUCTION', () => {
      it('returns false if the auction is anything but ENDED', () => {
        loan = Factory.create('loan', {
          logic: { auction: { status: AUCTION_STATUS.NONE } },
        });

        let task = { type: TASK_TYPE.AUCTION, loanId: loan._id };
        expect(validateTask(task)).to.equal(false);

        loan = Factory.create('loan', {
          logic: { auction: { status: AUCTION_STATUS.STARTED } },
        });

        task = { type: TASK_TYPE.AUCTION, loanId: loan._id };
        expect(validateTask(task)).to.equal(false);
      });

      it('returns true if the auction is ENDED', () => {
        loan = Factory.create('loan', {
          logic: { auction: { status: AUCTION_STATUS.ENDED } },
        });

        const task = { type: TASK_TYPE.AUCTION, loanId: loan._id };
        expect(validateTask(task)).to.equal(true);
      });
    });

    describe('LENDER_CHOSEN', () => {
      it('works');
    });
  });
});
