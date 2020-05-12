import { expect } from 'chai';
import moment from 'moment';

/* eslint-env mocha */
import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { LOAN_STATUS } from '../../../loans/loanConstants';
import { loanSetStatus } from '../../../loans/methodDefinitions';
import LoanService from '../../../loans/server/LoanService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import {
  COMMISSION_STATUS,
  REVENUE_STATUS,
} from '../../../revenues/revenueConstants';
import { loanMonitoring, loanStatusChanges } from '../resolvers';

describe('monitoring', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('loanMonitoring', () => {
    it('groups loans by status', () => {
      generator({
        loans: [
          { status: LOAN_STATUS.LEAD },
          { status: LOAN_STATUS.LEAD },
          { status: LOAN_STATUS.ONGOING },
          { status: LOAN_STATUS.CLOSING },
        ],
      });

      const result = loanMonitoring({
        groupBy: 'status',
        value: 'count',
      });

      expect(result).to.deep.equal([
        { _id: LOAN_STATUS.LEAD, count: 2 },
        { _id: LOAN_STATUS.ONGOING, count: 1 },
        { _id: LOAN_STATUS.CLOSING, count: 1 },
      ]);
    });

    it('adds up revenues for each status', () => {
      generator({
        loans: [
          { status: LOAN_STATUS.LEAD, revenues: { amount: 100 } },
          {
            status: LOAN_STATUS.CLOSING,
            revenues: [
              { amount: 100, status: REVENUE_STATUS.CLOSED },
              { amount: 100 },
            ],
          },
        ],
      });

      const result = loanMonitoring({
        groupBy: 'status',
        value: 'revenues',
      });

      expect(result).to.deep.equal([
        {
          _id: LOAN_STATUS.LEAD,
          revenues: 100,
          expectedRevenues: 100,
          paidRevenues: 0,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
        {
          _id: LOAN_STATUS.CLOSING,
          revenues: 200,
          expectedRevenues: 100,
          paidRevenues: 100,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
      ]);
    });

    it('adds up wantedLoan values', () => {
      generator({
        loans: [
          {
            selectedStructure: '2',
            structures: [
              { id: '1', wantedLoan: 5000 },
              { id: '2', wantedLoan: 3000 },
            ],
          },
          {
            selectedStructure: '1',
            structures: [{ id: '1', wantedLoan: 5000 }],
          },
          {
            selectedStructure: '1',
            structures: [{ id: '1', wantedLoan: 4000 }],
            status: LOAN_STATUS.CLOSING,
          },
        ],
      });

      const result = loanMonitoring({
        groupBy: 'status',
        value: 'loanValue',
      });

      expect(result).to.deep.equal([
        { _id: LOAN_STATUS.LEAD, loanValue: 8000 },
        { _id: LOAN_STATUS.CLOSING, loanValue: 4000 },
      ]);
    });

    it('groups loans by createdBy', async () => {
      await LoanService.collection.rawCollection().insert({
        name: 'a',
        createdAt: moment('2018/01/02', 'YYYY/MM/DD').toDate(),
      });
      await LoanService.collection.rawCollection().insert({
        name: 'b',
        createdAt: moment('2018/01/05', 'YYYY/MM/DD').toDate(),
      });
      await LoanService.collection.rawCollection().insert({
        name: 'c',
        createdAt: moment('2018/03/02', 'YYYY/MM/DD').toDate(),
      });

      const result = loanMonitoring({
        groupBy: 'createdAt',
        value: 'count',
      });

      expect(result).to.deep.equal([
        { _id: { month: 1, year: 2018 }, count: 2 },
        { _id: { month: 3, year: 2018 }, count: 1 },
      ]);
    });

    it('groups revenues by date', () => {
      generator({
        loans: [
          {
            revenues: {
              amount: 100,
              expectedAt: moment('2018/01/02', 'YYYY/MM/DD').toDate(),
            },
          },
          {
            revenues: [
              {
                amount: 200,
                expectedAt: moment('2018/02/02', 'YYYY/MM/DD').toDate(),
              },
              {
                amount: 300,
                expectedAt: moment('2018/03/02', 'YYYY/MM/DD').toDate(),
                paidAt: moment('2018/04/02', 'YYYY/MM/DD').toDate(),
              },
              {
                amount: 500,
                expectedAt: moment('2018/05/02', 'YYYY/MM/DD').toDate(),
                paidAt: moment('2018/01/02', 'YYYY/MM/DD').toDate(),
                status: REVENUE_STATUS.CLOSED,
              },
              {
                amount: 600,
                expectedAt: moment('2019/01/02', 'YYYY/MM/DD').toDate(),
                status: REVENUE_STATUS.CLOSED,
              },
            ],
          },
        ],
      });

      const result = loanMonitoring({
        groupBy: 'revenueDate',
        value: 'revenues',
      });

      expect(result).to.deep.equal([
        {
          _id: { month: null, year: null },
          revenues: 600,
          paidRevenues: 600,
          expectedRevenues: 0,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
        {
          _id: { month: 1, year: 2018 },
          revenues: 600,
          paidRevenues: 500,
          expectedRevenues: 100,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
        {
          _id: { month: 2, year: 2018 },
          revenues: 200,
          paidRevenues: 0,
          expectedRevenues: 200,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
        {
          _id: { month: 3, year: 2018 },
          revenues: 300,
          paidRevenues: 0,
          expectedRevenues: 300,
          commissionsToPay: 0,
          commissionsPaid: 0,
        },
      ]);
    });

    it('counts commissions paid and to pay', () => {
      generator({
        loans: {
          revenues: [
            {
              amount: 100,
              expectedAt: moment('2018/01/02', 'YYYY/MM/DD').toDate(),
              organisations: [
                { $metadata: { commissionRate: 0.05 } },
                {
                  $metadata: {
                    commissionRate: 0.1,
                    status: COMMISSION_STATUS.PAID,
                  },
                },
              ],
            },
            {
              amount: 100,
              expectedAt: moment('2018/01/02', 'YYYY/MM/DD').toDate(),
              organisations: [
                { $metadata: { commissionRate: 0.02 } },
                {
                  $metadata: {
                    commissionRate: 0.01,
                    status: COMMISSION_STATUS.PAID,
                  },
                },
              ],
            },
          ],
        },
      });

      const result = loanMonitoring({
        groupBy: 'revenueDate',
        value: 'revenues',
      });

      expect(result).to.deep.equal([
        {
          _id: { month: 1, year: 2018 },
          revenues: 200,
          paidRevenues: 0,
          expectedRevenues: 200,
          commissionsToPay: 7,
          commissionsPaid: 11,
        },
      ]);
    });
  });

  describe('loanStatusChanges', function() {
    this.timeout(5000);
    it('groups status changes', async () => {
      generator({
        loans: [
          { _id: 'loan1', status: LOAN_STATUS.QUALIFIED_LEAD },
          { _id: 'loan2', status: LOAN_STATUS.QUALIFIED_LEAD },
        ],
        users: { _id: 'admin', _factory: 'admin' },
      });
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.ONGOING }),
      );
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.CLOSING }),
      );
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.PENDING }),
      );
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan2', status: LOAN_STATUS.ONGOING }),
      );
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan2', status: LOAN_STATUS.PENDING }),
      );
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({
          loanId: 'loan2',
          status: LOAN_STATUS.FINALIZED,
        }),
      );

      const result = loanStatusChanges({
        fromDate: moment()
          .subtract(1, 'd')
          .toDate(),
        toDate: moment()
          .add(1, 'd')
          .toDate(),
      });

      expect(result.length).to.equal(5);

      const qualifiedLeadToOngoing = result.find(
        ({ _id: { prevStatus, nextStatus } }) =>
          prevStatus === LOAN_STATUS.QUALIFIED_LEAD &&
          nextStatus === LOAN_STATUS.ONGOING,
      );
      expect(qualifiedLeadToOngoing).to.deep.include({
        _id: {
          prevStatus: LOAN_STATUS.QUALIFIED_LEAD,
          nextStatus: LOAN_STATUS.ONGOING,
        },
        count: 2,
      });

      const pendingToFinalized = result.find(
        ({ _id: { prevStatus, nextStatus } }) =>
          prevStatus === LOAN_STATUS.PENDING &&
          nextStatus === LOAN_STATUS.FINALIZED,
      );
      expect(pendingToFinalized).to.deep.include({
        _id: {
          prevStatus: LOAN_STATUS.PENDING,
          nextStatus: LOAN_STATUS.FINALIZED,
        },
        count: 1,
      });
    });

    it('groups status changes, and breaks them down by assignee', async () => {
      generator({
        users: [
          { _id: 'admin1', _factory: 'admin' },
          { _id: 'admin2', _factory: 'admin' },
        ],
        loans: [
          {
            _id: 'loan1',
            assignees: [
              { _id: 'admin2', $metadata: { isMain: false } },
              { _id: 'admin1', $metadata: { isMain: true } },
            ],
          },
          {
            _id: 'loan2',
            assignees: { _id: 'admin2', $metadata: { isMain: true } },
          },
        ],
      });
      await ddpWithUserId('admin1', () =>
        loanSetStatus.run({
          loanId: 'loan1',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      );
      await ddpWithUserId('admin1', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.ONGOING }),
      );
      await ddpWithUserId('admin2', () =>
        loanSetStatus.run({
          loanId: 'loan2',
          status: LOAN_STATUS.QUALIFIED_LEAD,
        }),
      );

      const result = loanStatusChanges({
        fromDate: moment()
          .subtract(1, 'd')
          .toDate(),
        toDate: moment()
          .add(1, 'd')
          .toDate(),
        breakdown: 'assignee',
      }).sort((a, b) => a._id.localeCompare(b._id));

      expect(result.length).to.equal(2);
      expect(result[0]).to.deep.include({
        _id: 'admin1',
        totalStatusChangeCount: 2,
        statusChanges: [
          {
            prevStatus: LOAN_STATUS.LEAD,
            nextStatus: LOAN_STATUS.QUALIFIED_LEAD,
            count: 1,
          },
          {
            prevStatus: LOAN_STATUS.QUALIFIED_LEAD,
            nextStatus: LOAN_STATUS.ONGOING,
            count: 1,
          },
        ],
      });
      expect(result[0].loans.length).to.equal(2);
      expect(result[0].loans[0]._id).to.equal('loan1');
      expect(result[0].loans[1]._id).to.equal('loan1');

      expect(result[1]).to.deep.include({
        _id: 'admin2',
        totalStatusChangeCount: 1,
        statusChanges: [
          {
            prevStatus: LOAN_STATUS.LEAD,
            nextStatus: LOAN_STATUS.QUALIFIED_LEAD,
            count: 1,
          },
        ],
      });
      expect(result[1].loans.length).to.equal(1);
      expect(result[1].loans[0]._id).to.equal('loan2');
    });
  });
});
