import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers/testHelpers';
import generator from '../../../factories';
import { proLoans } from '../../queries';
import { LOAN_STATUS } from '../../loanConstants';

describe('proLoans', () => {
  beforeEach(() => resetDatabase());

  describe('referredByUser loans', () => {
    it('returns referred loans', () => {
      generator({
        users: {
          _id: 'adminId',
          _factory: 'admin',
          referredCustomers: [{ loans: {} }, { loans: {} }],
        },
      });
      const loans = proLoans
        .clone({ userId: 'adminId', calledByUserId: 'adminId' })
        .fetch();

      expect(loans.length).to.equal(2);
    });

    it('filters loans by status', () => {
      generator({
        users: {
          _id: 'adminId',
          _factory: 'admin',
          referredCustomers: [
            {
              loans: [
                { status: LOAN_STATUS.UNSUCCESSFUL },
                { status: LOAN_STATUS.LEAD },
              ],
            },
            { loans: { status: LOAN_STATUS.CLOSING } },
          ],
        },
      });

      const loans = proLoans
        .clone({
          userId: 'adminId',
          calledByUserId: 'adminId',
        })
        .fetch();

      expect(loans.length).to.equal(3);

      const closingLoans = proLoans
        .clone({
          userId: 'adminId',
          calledByUserId: 'adminId',
          status: LOAN_STATUS.CLOSING,
        })
        .fetch();

      expect(closingLoans.length).to.equal(1);

      const leadAndClosingLoans = proLoans
        .clone({
          userId: 'adminId',
          calledByUserId: 'adminId',
          status: { $in: [LOAN_STATUS.LEAD, LOAN_STATUS.CLOSING] },
        })
        .fetch();

      expect(leadAndClosingLoans.length).to.equal(2);
    });

    it('filters loans by referredByUser', () => {
      generator({
        users: [
          {
            _id: 'pro1',
            _factory: 'pro',
            referredCustomers: [
              { loans: [{ status: LOAN_STATUS.CLOSING, _id: 'loanId' }, {}] },
              { loans: {} },
            ],
          },
          {
            _id: 'pro2',
            _factory: 'pro',
            referredCustomers: [
              { loans: [{ status: LOAN_STATUS.CLOSING }, {}] },
              { loans: { status: LOAN_STATUS.CLOSING } },
            ],
          },
        ],
      });

      const loans1 = proLoans
        .clone({
          userId: 'pro1',
          calledByUserId: 'pro1',
          referredByUserId: 'pro1',
        })
        .fetch();

      expect(loans1.length).to.equal(3);

      const loans2 = proLoans
        .clone({
          userId: 'pro1',
          calledByUserId: 'pro1',
          status: { $in: [LOAN_STATUS.CLOSING] },
          referredByUserId: 'pro1',
        })
        .fetch();

      expect(loans2.length).to.equal(1);
      expect(loans2[0]._id).to.equal('loanId');
    });
  });

  describe('organisationLoans', () => {
    it('fetches all loans from an organisation', () => {
      generator({
        users: [
          {
            _id: 'proId1',
            _factory: 'pro',
            organisations: {
              _id: 'Org1',
              referredCustomers: [{ loans: {} }, { loans: {} }],
            },
          },
          {
            _id: 'proId2',
            _factory: 'pro',
            organisations: { _id: 'Org1' },
          },
        ],
      });
      const loans = proLoans
        .clone({
          userId: 'proId2',
          calledByUserId: 'proId2',
          fetchOrganisationLoans: true,
        })
        .fetch();

      expect(loans.length).to.equal(2);
    });

    it('filters loans from an organisation by status', () => {
      generator({
        users: [
          {
            _id: 'proId1',
            _factory: 'pro',
            organisations: {
              _id: 'Org1',
              referredCustomers: [
                { loans: { status: LOAN_STATUS.LEAD } },
                { loans: { status: LOAN_STATUS.CLOSING } },
              ],
            },
          },
          {
            _id: 'proId2',
            _factory: 'pro',
            organisations: { _id: 'Org1' },
          },
        ],
      });
      const loans = proLoans
        .clone({
          userId: 'proId2',
          calledByUserId: 'proId2',
          fetchOrganisationLoans: true,
          status: { $in: [LOAN_STATUS.LEAD] },
        })
        .fetch();

      expect(loans.length).to.equal(1);
    });
  });

  describe('promotionLoans', () => {
    it('returns all loans of a user for a promotion', () => {
      generator({
        users: {
          _id: 'proId',
          _factory: 'pro',
          referredCustomers: [{ _id: 'user1' }, { _id: 'user2' }],
        },
        promotions: {
          _id: 'promoId',
          loans: [
            { userId: 'user1' },
            { userId: 'user2' },
            { userId: 'user3' },
          ],
        },
      });

      const loans = proLoans
        .clone({
          userId: 'proId',
          calledByUserId: 'proId',
          promotionId: 'promoId',
        })
        .fetch();

      expect(loans.length).to.equal(2);
    });
  });
});
