//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import {
  RESIDENCE_TYPE,
  PROPERTY_CATEGORY,
} from 'core/api/properties/propertyConstants';
import generator from '../../../factories/index';
import { proLoans2 } from '../../queries';
import LoanService from '../LoanService';
import { LOAN_STATUS, SOLVENCY_TYPE } from '../../loanConstants';

describe('proLoans2', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('returns loans referredByMe', () => {
    generator({
      loans: [
        { _id: 'loanId1', user: { referredByUser: { _id: 'pro1' } } },
        { _id: 'loanId2', referralId: 'pro1' },
        { _id: 'loanId3', user: { referredByUser: { _id: 'pro2' } } },
        { _id: 'loanId4', referralId: 'pro2' },
        {},
      ],
    });

    expect(LoanService.countAll()).to.equal(5);

    const result = proLoans2
      .clone({ _userId: 'pro1', referredByMe: true })
      .fetch();

    expect(result.length).to.equal(2);
    expect(result[0]._id).to.equal('loanId1');
    expect(result[1]._id).to.equal('loanId2');
  });

  it('returns loans referred by my org', () => {
    generator({
      organisations: {
        _id: 'org',
        users: [{ _id: 'pro1' }, { _id: 'pro2' }],
      },
      loans: [
        { user: { referredByUser: { _id: 'pro1' } } },
        {
          user: {
            referredByUser: { _id: 'pro1' },
            referredByOrganisation: { _id: 'org' },
          },
        },
        { referralId: 'pro1' },
        { user: { referredByOrganisation: { _id: 'org' } } },
        { referralId: 'org' },
        { user: { referredByUser: { _id: 'pro2' } } },
        { referralId: 'pro2' },
        {},
      ],
    });

    expect(LoanService.countAll()).to.equal(8);

    const result = proLoans2
      .clone({ _userId: 'pro1', referredByMyOrganisation: true })
      .fetch();

    expect(result.length).to.equal(7);
  });

  it('does not return loans by a user who is in multiple orgs', () => {
    generator({
      organisations: [
        { _id: 'org1', users: [{ _id: 'pro1' }, { _id: 'pro2' }] },
        { _id: 'org2', users: [{ _id: 'pro2' }, { _id: 'pro3' }] },
      ],
      loans: [
        { referralId: 'pro1' },
        { referralId: 'pro2' },
        { referralId: 'pro3' },
        { referralId: 'org1' },
        { referralId: 'org2' },
      ],
    });

    expect(LoanService.countAll()).to.equal(5);

    const result = proLoans2
      .clone({ _userId: 'pro1', referredByMyOrganisation: true })
      .fetch();

    expect(result.length).to.equal(2);
    expect(result[0].referralId).to.equal('pro1');
    expect(result[1].referralId).to.equal('org1');
  });

  it('does return loans by a user who is in multiple orgs and this is his main one', () => {
    generator({
      organisations: [
        {
          _id: 'org1',
          users: [
            { _id: 'pro1' },
            { _id: 'pro2', $metadata: { isMain: true } },
          ],
        },
        { _id: 'org2', users: [{ _id: 'pro2' }, { _id: 'pro3' }] },
      ],
      loans: [
        { referralId: 'pro1' },
        { referralId: 'pro2' },
        { referralId: 'pro3' },
        { referralId: 'org1' },
        { referralId: 'org2' },
      ],
    });

    expect(LoanService.countAll()).to.equal(5);

    const result = proLoans2
      .clone({ _userId: 'pro1', referredByMyOrganisation: true })
      .fetch();

    expect(result.length).to.equal(3);
    expect(result[0].referralId).to.equal('pro1');
    expect(result[1].referralId).to.equal('pro2');
    expect(result[2].referralId).to.equal('org1');
  });

  it('skips loans from organisation users who do not share customers', () => {
    generator({
      organisations: [
        {
          _id: 'org1',
          users: [
            { _id: 'pro1' },
            { _id: 'pro2' },
            { _id: 'pro3', $metadata: { shareCustomers: false } },
          ],
        },
      ],
      loans: [
        { _id: 'loan1', user: { referredByUser: { _id: 'pro2' } } },
        { user: { referredByUser: { _id: 'pro3' } } },
        {
          user: {
            referredByUser: { _id: 'pro3' },
            referredByOrganisation: { _id: 'org1' },
          },
        },
        { referralId: 'pro3' },
      ],
    });

    expect(LoanService.countAll()).to.equal(4);

    const result = proLoans2
      .clone({ _userId: 'pro1', referredByMyOrganisation: true })
      .fetch();

    expect(result.length).to.equal(1);
    expect(result[0]._id).to.equal('loan1');
  });

  it('throws if the referredByMe and referredByMyOrganisation are undefined', async () => {
    generator({ users: { _id: 'pro1' } });
    try {
      const result = proLoans2.clone({ _userId: 'pro1' }).fetch();
    } catch (error) {
      expect(error.message).to.include(
        'one of "referredByMe" or "referredByMyOrganisation"',
      );
      return;
    }

    expect('no error').to.equal('error');
  });

  it('throws if the both referredByMe and referredByMyOrganisation are defined', async () => {
    generator({ users: { _id: 'pro1' } });
    try {
      const result = proLoans2
        .clone({
          _userId: 'pro1',
          referredByMyOrganisation: true,
          referredByMe: true,
        })
        .fetch();
    } catch (error) {
      expect(error.message).to.include(
        'one of "referredByMe" or "referredByMyOrganisation"',
      );
      return;
    }

    expect('no error').to.equal('error');
  });

  it('filters by status', () => {
    generator({
      organisations: {
        _id: 'org',
        users: [{ _id: 'pro1' }, { _id: 'pro2' }],
      },
      loans: [
        {
          user: { referredByUser: { _id: 'pro1' } },
          status: LOAN_STATUS.QUALIFIED_LEAD,
        },
        {
          user: {
            referredByUser: { _id: 'pro1' },
            referredByOrganisation: { _id: 'org' },
          },
          status: LOAN_STATUS.ONGOING,
        },
        { referralId: 'pro1', status: LOAN_STATUS.PENDING },
        {
          user: {
            referredByOrganisation: { _id: 'org' },
          },
          status: LOAN_STATUS.BILLING,
        },
        { referralId: 'org', status: LOAN_STATUS.FINALIZED },
        { user: { referredByUser: { _id: 'pro2' } } },
        { referralId: 'pro2' },
        {},
      ],
    });

    expect(LoanService.countAll()).to.equal(8);

    const result1 = proLoans2
      .clone({
        _userId: 'pro1',
        referredByMyOrganisation: true,
        status: { $in: [LOAN_STATUS.ONGOING] },
      })
      .fetch();

    expect(result1.length).to.equal(1);

    const result2 = proLoans2
      .clone({
        _userId: 'pro1',
        referredByMyOrganisation: true,
        status: LOAN_STATUS.LEAD,
      })
      .fetch();

    expect(result2.length).to.equal(2);

    const result3 = proLoans2
      .clone({
        _userId: 'pro1',
        referredByMyOrganisation: true,
        status: {
          $in: [
            LOAN_STATUS.ONGOING,
            LOAN_STATUS.BILLING,
            LOAN_STATUS.FINALIZED,
          ],
        },
      })
      .fetch();

    expect(result3.length).to.equal(3);
  });
});
