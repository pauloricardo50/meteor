/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ddpWithUserId } from '../../../methods/methodHelpers';
import { loanSetDisbursementDate } from '../../../methods';
import generator from '../../../factories/server';
import LoanService from '../../../loans/server/LoanService';
import { ACTIVITY_EVENT_METADATA } from '../../activityConstants';

describe('loanSetDisbursementDateListener', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      users: {
        _id: 'admin',
        _factory: 'admin',
        firstName: 'Admin',
        lastName: 'E-Potek',
      },
      loans: { _id: 'loan', _factory: 'loan' },
    });
  });

  it('adds activity on the loan', async () => {
    const today = new Date();
    await ddpWithUserId('admin', () =>
      loanSetDisbursementDate.run({
        loanId: 'loan',
        disbursementDate: today,
      }),
    );

    const { disbursementDate, activities = [] } = LoanService.get('loan', {
      disbursementDate: 1,
      activities: { type: 1, metadata: 1, date: 1 },
    });

    expect(disbursementDate.getTime()).to.equal(today.getTime());
    expect(activities[1].metadata).to.deep.include({
      event: ACTIVITY_EVENT_METADATA.LOAN_DISBURSEMENT_DATE,
    });
    expect(activities[1].date.getTime()).to.equal(today.getTime());
  });
});
