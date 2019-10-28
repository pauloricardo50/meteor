// @flow
/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';

import moment from 'moment';
import { expect } from 'chai';

import LoanService from 'core/api/loans/server/LoanService';
import { REVENUE_STATUS } from 'core/api/revenues/revenueConstants';
import { loanSetStatus } from 'core/api/loans/index';
import { ddpWithUserId } from 'core/api/methods/server/methodHelpers';
import generator from '../../../factories/factoriesHelpers';
import { LOAN_STATUS } from '../../../loans/loanConstants';
import { loanMonitoring, loanStatusChanges } from '../resolvers';

describe('monitoring', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('loanMonitoring', () => {
    it('groups loans by status', async () => {
      generator({
        loans: [
          { status: LOAN_STATUS.LEAD },
          { status: LOAN_STATUS.LEAD },
          { status: LOAN_STATUS.ONGOING },
          { status: LOAN_STATUS.CLOSING },
        ],
      });

      const result = await loanMonitoring({
        groupBy: 'status',
        value: 'count',
      });

      expect(result).to.deep.equal([
        { _id: LOAN_STATUS.CLOSING, count: 1 },
        { _id: LOAN_STATUS.ONGOING, count: 1 },
        { _id: LOAN_STATUS.LEAD, count: 2 },
      ]);
    });

    it('adds up revenues for each status', async () => {
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

      const result = await loanMonitoring({
        groupBy: 'status',
        value: 'revenues',
      });

      expect(result).to.deep.equal([
        {
          _id: LOAN_STATUS.CLOSING,
          revenues: 200,
          expectedRevenues: 100,
          paidRevenues: 100,
        },
        {
          _id: LOAN_STATUS.LEAD,
          revenues: 100,
          expectedRevenues: 100,
          paidRevenues: 0,
        },
      ]);
    });

    it('adds up wantedLoan values', async () => {
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

      const result = await loanMonitoring({
        groupBy: 'status',
        value: 'loanValue',
      });

      expect(result).to.deep.equal([
        { _id: LOAN_STATUS.CLOSING, loanValue: 4000 },
        { _id: LOAN_STATUS.LEAD, loanValue: 8000 },
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

      const result = await loanMonitoring({
        groupBy: 'createdAt',
        value: 'count',
      });

      expect(result).to.deep.equal([
        { _id: { month: 1, year: 2018 }, count: 2 },
        { _id: { month: 3, year: 2018 }, count: 1 },
      ]);
    });

    it('groups revenues by date', async () => {
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

      const result = await loanMonitoring({
        groupBy: 'revenueDate',
        value: 'revenues',
      });

      expect(result).to.deep.equal([
        {
          _id: { month: null, year: null },
          revenues: 600,
          paidRevenues: 600,
          expectedRevenues: 0,
        },
        {
          _id: { month: 1, year: 2018 },
          revenues: 600,
          paidRevenues: 500,
          expectedRevenues: 100,
        },
        {
          _id: { month: 2, year: 2018 },
          revenues: 200,
          paidRevenues: 0,
          expectedRevenues: 200,
        },
        {
          _id: { month: 3, year: 2018 },
          revenues: 300,
          paidRevenues: 0,
          expectedRevenues: 300,
        },
      ]);
    });
  });

  describe('loanStatusChanges', () => {
    it('groups status changes', async () => {
      generator({
        loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
        users: { _id: 'admin', _factory: 'admin' },
      });
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.ONGOING }));
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.BILLING }));
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.PENDING }));
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan2', status: LOAN_STATUS.ONGOING }));
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({ loanId: 'loan2', status: LOAN_STATUS.PENDING }));
      await ddpWithUserId('admin', () =>
        loanSetStatus.run({
          loanId: 'loan2',
          status: LOAN_STATUS.FINALIZED,
        }));

      const result = await loanStatusChanges({
        fromDate: moment()
          .subtract(1, 'd')
          .toDate(),
        toDate: moment()
          .add(1, 'd')
          .toDate(),
      });

      expect(result.length).to.equal(5);
      expect(result[0]).to.deep.include({
        _id: { prevStatus: LOAN_STATUS.ONGOING, nextStatus: LOAN_STATUS.BILLING },
        count: 1,
      });
      expect(result[1]).to.deep.include({
        _id: {
          prevStatus: LOAN_STATUS.PENDING,
          nextStatus: LOAN_STATUS.FINALIZED,
        },
        count: 1,
      });
    });
  });
});
