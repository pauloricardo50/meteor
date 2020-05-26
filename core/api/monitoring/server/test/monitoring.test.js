import { expect } from 'chai';
import moment from 'moment';

/* eslint-env mocha */
import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server';
import { INSURANCE_REQUEST_STATUS } from '../../../insuranceRequests/insuranceRequestConstants';
import { insuranceRequestUpdateStatus } from '../../../insuranceRequests/methodDefinitions';
import { INSURANCE_STATUS } from '../../../insurances/insuranceConstants';
import { insuranceUpdateStatus } from '../../../insurances/methodDefinitions';
import { LOAN_STATUS } from '../../../loans/loanConstants';
import { loanSetStatus } from '../../../loans/methodDefinitions';
import LoanService from '../../../loans/server/LoanService';
import { ddpWithUserId } from '../../../methods/methodHelpers';
import {
  COMMISSION_STATUS,
  REVENUE_STATUS,
} from '../../../revenues/revenueConstants';
import { collectionStatusChanges, loanMonitoring } from '../resolvers';

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

  describe('collectionStatusChanges', function() {
    this.timeout(5000);

    describe('with loans', () => {
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

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'loans',
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

      it('does not include TEST loans', async () => {
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
          ],
        });
        await ddpWithUserId('admin1', () =>
          loanSetStatus.run({
            loanId: 'loan1',
            status: LOAN_STATUS.QUALIFIED_LEAD,
          }),
        );
        await ddpWithUserId('admin1', () =>
          loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.TEST }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'loans',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(0);
      });

      it('does not include loan status changes to TEST but still includes status changes from TEST', async () => {
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
          ],
        });

        await ddpWithUserId('admin1', () =>
          loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.TEST }),
        );

        await ddpWithUserId('admin1', () =>
          loanSetStatus.run({ loanId: 'loan1', status: LOAN_STATUS.ONGOING }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'loans',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(1);

        expect(result[0].loans[0]._id).to.equal('loan1');
        expect(result[0]).to.deep.include({
          _id: 'admin1',
          totalStatusChangeCount: 1,
          statusChanges: [
            {
              prevStatus: LOAN_STATUS.TEST,
              nextStatus: LOAN_STATUS.ONGOING,
              count: 1,
            },
          ],
        });
      });
    });

    describe('with insurance requests', () => {
      it('groups status changes, and breaks them down by assignee', async () => {
        generator({
          users: [
            { _id: 'admin1', _factory: 'admin' },
            { _id: 'admin2', _factory: 'admin' },
          ],
          insuranceRequests: [
            {
              _id: 'iR1',
              assignees: [
                { _id: 'admin2', $metadata: { isMain: false } },
                { _id: 'admin1', $metadata: { isMain: true } },
              ],
            },
            {
              _id: 'iR2',
              assignees: { _id: 'admin2', $metadata: { isMain: true } },
            },
          ],
        });
        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
          }),
        );
        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.ONGOING,
          }),
        );
        await ddpWithUserId('admin2', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR2',
            status: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
          }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'insuranceRequests',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.include({
          _id: 'admin1',
          totalStatusChangeCount: 2,
          statusChanges: [
            {
              prevStatus: INSURANCE_REQUEST_STATUS.LEAD,
              nextStatus: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
              count: 1,
            },
            {
              prevStatus: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
              nextStatus: INSURANCE_REQUEST_STATUS.ONGOING,
              count: 1,
            },
          ],
        });
        expect(result[0].insuranceRequests.length).to.equal(2);
        expect(result[0].insuranceRequests[0]._id).to.equal('iR1');
        expect(result[0].insuranceRequests[1]._id).to.equal('iR1');

        expect(result[1]).to.deep.include({
          _id: 'admin2',
          totalStatusChangeCount: 1,
          statusChanges: [
            {
              prevStatus: INSURANCE_REQUEST_STATUS.LEAD,
              nextStatus: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
              count: 1,
            },
          ],
        });
        expect(result[1].insuranceRequests.length).to.equal(1);
        expect(result[1].insuranceRequests[0]._id).to.equal('iR2');
      });

      it('does not include TEST insurance requests', async () => {
        generator({
          users: [
            { _id: 'admin1', _factory: 'admin' },
            { _id: 'admin2', _factory: 'admin' },
          ],
          insuranceRequests: [
            {
              _id: 'iR1',
              assignees: [
                { _id: 'admin2', $metadata: { isMain: false } },
                { _id: 'admin1', $metadata: { isMain: true } },
              ],
            },
          ],
        });
        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.QUALIFIED_LEAD,
          }),
        );
        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.TEST,
          }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'insuranceRequests',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(0);
      });

      it('does not include insurance requests status changes to TEST but still includes status changes from TEST', async () => {
        generator({
          users: [
            { _id: 'admin1', _factory: 'admin' },
            { _id: 'admin2', _factory: 'admin' },
          ],
          insuranceRequests: [
            {
              _id: 'iR1',
              assignees: [
                { _id: 'admin2', $metadata: { isMain: false } },
                { _id: 'admin1', $metadata: { isMain: true } },
              ],
            },
          ],
        });

        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.TEST,
          }),
        );

        await ddpWithUserId('admin1', () =>
          insuranceRequestUpdateStatus.run({
            insuranceRequestId: 'iR1',
            status: INSURANCE_REQUEST_STATUS.ONGOING,
          }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'insuranceRequests',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(1);

        expect(result[0].insuranceRequests[0]._id).to.equal('iR1');
        expect(result[0]).to.deep.include({
          _id: 'admin1',
          totalStatusChangeCount: 1,
          statusChanges: [
            {
              prevStatus: INSURANCE_REQUEST_STATUS.TEST,
              nextStatus: INSURANCE_REQUEST_STATUS.ONGOING,
              count: 1,
            },
          ],
        });
      });
    });

    describe('with insurances', () => {
      it('groups status changes, and breaks them down by assignee', async () => {
        generator({
          users: [
            { _id: 'admin1', _factory: 'admin' },
            { _id: 'admin2', _factory: 'admin' },
          ],
          insurances: [
            {
              _id: 'i1',
              insuranceRequest: {
                assignees: [
                  { _id: 'admin2', $metadata: { isMain: false } },
                  { _id: 'admin1', $metadata: { isMain: true } },
                ],
              },
            },
            {
              _id: 'i2',
              insuranceRequest: {
                assignees: { _id: 'admin2', $metadata: { isMain: true } },
              },
            },
          ],
        });
        await ddpWithUserId('admin1', () =>
          insuranceUpdateStatus.run({
            insuranceId: 'i1',
            status: INSURANCE_STATUS.SIGNED,
          }),
        );
        await ddpWithUserId('admin1', () =>
          insuranceUpdateStatus.run({
            insuranceId: 'i1',
            status: INSURANCE_STATUS.POLICED,
          }),
        );
        await ddpWithUserId('admin2', () =>
          insuranceUpdateStatus.run({
            insuranceId: 'i2',
            status: INSURANCE_STATUS.DECLINED,
          }),
        );

        const result = collectionStatusChanges({
          fromDate: moment()
            .subtract(1, 'd')
            .toDate(),
          toDate: moment()
            .add(1, 'd')
            .toDate(),
          collection: 'insurances',
        }).sort((a, b) => a._id.localeCompare(b._id));

        expect(result.length).to.equal(2);
        expect(result[0]).to.deep.include({
          _id: 'admin1',
          totalStatusChangeCount: 2,
          statusChanges: [
            {
              prevStatus: INSURANCE_STATUS.SUGGESTED,
              nextStatus: INSURANCE_STATUS.SIGNED,
              count: 1,
            },
            {
              prevStatus: INSURANCE_STATUS.SIGNED,
              nextStatus: INSURANCE_STATUS.POLICED,
              count: 1,
            },
          ],
        });
        expect(result[0].insurances.length).to.equal(2);
        expect(result[0].insurances[0]._id).to.equal('i1');
        expect(result[0].insurances[1]._id).to.equal('i1');

        expect(result[1]).to.deep.include({
          _id: 'admin2',
          totalStatusChangeCount: 1,
          statusChanges: [
            {
              prevStatus: INSURANCE_STATUS.SUGGESTED,
              nextStatus: INSURANCE_STATUS.DECLINED,
              count: 1,
            },
          ],
        });
        expect(result[1].insurances.length).to.equal(1);
        expect(result[1].insurances[0]._id).to.equal('i2');
      });
    });
  });
});
