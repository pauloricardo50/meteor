/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { ddpWithUserId } from '../../../methods/methodHelpers';
import { getNewName } from '../collectionServerHelpers';
import { setAssignees } from '../sharedHelpers';
import LoanService from '../../../loans/server/LoanService';
import UserService from '../../../users/server/UserService';
import InsuranceRequestService from '../../../insuranceRequests/server/InsuranceRequestService';
import generator from '../../../factories/server/generator';
import { LOANS_COLLECTION } from '../../../loans/loanConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../../insuranceRequests/insuranceRequestConstants';
import { INSURANCES_COLLECTION } from '../../../insurances/insuranceConstants';

describe('collectionServerHelpers', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('getNewName', () => {
    describe('Loans', () => {
      it('returns 20-0001 for the very first loan', () => {
        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-0001');
      });

      it('returns 20-0002 for the second loan', () => {
        generator({
          loans: {
            _id: 'loanId',
            name: getNewName({ collection: LOANS_COLLECTION }),
          },
        });
        const loan = LoanService.get('loanId', { name: 1 });
        expect(loan.name).to.equal('20-0001');

        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-0002');
      });

      it('sorts loans properly 1', () => {
        generator({
          loans: [{ name: '20-0009' }, { name: '20-0010' }],
        });

        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-0011');
      });

      it('sorts loans properly even if created in different order', () => {
        generator({
          loans: [
            { name: '20-0955' },
            { name: '20-0153' },
            { name: '10-0001' },
          ],
        });

        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-0956');
      });

      it('returns 20-1234 for the nth loan', () => {
        generator({
          loans: [{ name: '20-1233' }],
        });

        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-1234');
      });

      it('does not break if a 10000th loan is added', () => {
        generator({
          loans: [{ name: '20-9999' }],
        });
        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-10000');
      });

      it('handles new year properly', () => {
        generator({
          loans: [{ name: '20-0003' }],
        });
        const name = getNewName({
          collection: LOANS_COLLECTION,
          now: new Date(2021, 1, 1),
        });
        expect(name).to.equal('21-0001');
      });
    });
    describe('InsuranceRequests', () => {
      it('returns 20-0001-A for the very first insurance request', () => {
        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-0001-A');
      });

      it('returns 20-0002-A for the second insurance request', () => {
        generator({
          insuranceRequests: {
            _id: 'insuranceRequestId',
            name: getNewName({ collection: INSURANCE_REQUESTS_COLLECTION }),
          },
        });

        const insuranceRequest = InsuranceRequestService.get(
          'insuranceRequestId',
          { name: 1 },
        );
        expect(insuranceRequest.name).to.equal('20-0001-A');

        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-0002-A');
      });

      it('sorts insurance requests properly 1', () => {
        generator({
          insuranceRequests: [{ name: '20-0009-A' }, { name: '20-0010-A' }],
        });

        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-0011-A');
      });

      it('sorts insurance requests properly even if created in different order', () => {
        generator({
          insuranceRequests: [
            { name: '20-0955-A' },
            { name: '20-0153-A' },
            { name: '10-0001-A' },
          ],
        });

        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-0956-A');
      });

      it('returns 20-1234-A for the nth insurance request', () => {
        generator({
          insuranceRequests: [{ name: '20-1233-A' }],
        });

        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-1234-A');
      });

      it('does not break if a 10000th insurance request is added', () => {
        generator({
          insuranceRequests: [{ name: '20-9999-A' }],
        });
        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-10000-A');
      });

      it('handles new year properly', () => {
        generator({
          insuranceRequests: [{ name: '20-0003-A' }],
        });
        const name = getNewName({
          collection: INSURANCE_REQUESTS_COLLECTION,
          now: new Date(2021, 1, 1),
        });
        expect(name).to.equal('21-0001-A');
      });
    });
    describe('Insurances', () => {
      it('returns 20-0001-A01 when being first linked to insurance request 20-0001-A', () => {
        generator({
          insuranceRequests: { _id: 'insuranceRequestId', name: '20-0001-A' },
        });

        const name = getNewName({
          collection: INSURANCES_COLLECTION,
          insuranceRequestId: 'insuranceRequestId',
        });

        expect(name).to.equal('20-0001-A01');
      });

      it('returns 20-0001-A02 when being the second linked to insurance request 20-0001-A', () => {
        generator({
          insuranceRequests: {
            _id: 'insuranceRequestId',
            name: '20-0001-A',
            insurances: { name: '20-0001-A01' },
          },
        });

        const name = getNewName({
          collection: INSURANCES_COLLECTION,
          insuranceRequestId: 'insuranceRequestId',
        });

        expect(name).to.equal('20-0001-A02');
      });
    });

    describe('Mixed', () => {
      it('returns 20-0002-A for the first insurance request inserted after the first loan', () => {
        generator({
          loans: {
            _id: 'loanId',
            name: getNewName({ collection: LOANS_COLLECTION }),
          },
        });
        const loan = LoanService.get('loanId', { name: 1 });
        expect(loan.name).to.equal('20-0001');

        const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
        expect(name).to.equal('20-0002-A');
      });

      it('returns 20-0001-A for the first insurance request linked to the loan 20-0001', () => {
        generator({
          loans: {
            _id: 'loanId',
            name: getNewName({ collection: LOANS_COLLECTION }),
          },
        });

        const name = getNewName({
          collection: INSURANCE_REQUESTS_COLLECTION,
          loanId: 'loanId',
        });
        expect(name).to.equal('20-0001-A');
      });

      it('returns 20-0001-B for the second insurance request linked to the loan 20-0001', () => {
        generator({
          loans: {
            _id: 'loanId',
            name: getNewName({ collection: LOANS_COLLECTION }),
            insuranceRequests: { name: '20-0001-A' },
          },
        });

        const name = getNewName({
          collection: INSURANCE_REQUESTS_COLLECTION,
          loanId: 'loanId',
        });
        expect(name).to.equal('20-0001-B');
      });

      it('returns 20-0001 for the loan linked to insurance request 20-0001-A', () => {
        generator({
          insuranceRequests: { _id: 'insuranceRequestId', name: '20-0001-A' },
        });
        const name = getNewName({
          collection: LOANS_COLLECTION,
          insuranceRequestId: 'insuranceRequestId',
        });

        expect(name).to.equal('20-0001');
      });

      it('returns 20-0002 for the first loan inserted after the first insurance request', () => {
        generator({
          insuranceRequests: {
            _id: 'insuranceRequestId',
            name: getNewName({ collection: INSURANCE_REQUESTS_COLLECTION }),
          },
        });
        const insuranceRequest = InsuranceRequestService.get(
          'insuranceRequestId',
          { name: 1 },
        );
        expect(insuranceRequest.name).to.equal('20-0001-A');

        const name = getNewName({ collection: LOANS_COLLECTION });
        expect(name).to.equal('20-0002');
      });

      it('sorts loans and insurance requests properly', () => {
        generator({
          insuranceRequests: [{ name: '20-1456-A' }, { name: '20-0023-A' }],
          loans: [{ name: '19-2121' }, { name: '20-0123' }],
        });

        const insuranceRequestId = InsuranceRequestService.insert({});
        const loanId = LoanService.insert({});

        const {
          name: insuranceRequestName,
        } = InsuranceRequestService.get(insuranceRequestId, { name: 1 });
        const { name: loanName } = LoanService.get(loanId, { name: 1 });

        expect(insuranceRequestName).to.equal('20-1457-A');
        expect(loanName).to.equal('20-1458');
      });
    });
  });

  describe('setAssignees', () => {
    it('throws if no assignees are set', () => {
      expect(() => setAssignees({ assignees: [] })).to.throw('entre 1 et 3');
      expect(() => setAssignees({ assignees: [{}, {}, {}, {}] })).to.throw(
        'entre 1 et 3',
      );
    });

    it('throws if percentages do not add up to 1000', () => {
      expect(() => setAssignees({ assignees: [{ percent: 80 }] })).to.throw(
        '100%',
      );
      expect(() =>
        setAssignees({ assignees: [{ percent: 80 }, { percent: 30 }] }),
      ).to.throw('100%');
    });

    it('throws if a decimal value is used for percent', () => {
      generator({
        loans: { _id: 'id' },
        users: [{ _id: 'admin1' }, { _id: 'admin2' }],
      });

      expect(() =>
        setAssignees({
          collection: LOANS_COLLECTION,
          docId: 'id',
          assignees: [
            { _id: 'admin1', percent: 79.5, isMain: true },
            { _id: 'admin2', percent: 20.5 },
          ],
        }),
      ).to.throw('integer');
    });

    it('throws if a percentage less than 10 is used', () => {
      generator({
        loans: { _id: 'id' },
        users: [{ _id: 'admin1' }, { _id: 'admin2' }],
      });

      expect(() =>
        setAssignees({
          collection: LOANS_COLLECTION,
          docId: 'id',
          assignees: [
            { _id: 'admin1', percent: 8, isMain: true },
            { _id: 'admin2', percent: 92 },
          ],
        }),
      ).to.throw('at least 10');
    });

    it('forces isMain to a boolean', () => {
      generator({
        loans: { _id: 'id' },
        users: [{ _id: 'admin1' }, { _id: 'admin2' }],
      });

      LoanService.setAssignees({
        loanId: 'id',
        assignees: [
          { _id: 'admin1', percent: 10, isMain: true },
          { _id: 'admin2', percent: 90 },
        ],
      });

      expect(
        LoanService.get('id', { assigneeLinks: 1 }).assigneeLinks,
      ).to.deep.equal([
        {
          _id: 'admin1',
          isMain: true,
          percent: 10,
        },
        { _id: 'admin2', isMain: false, percent: 90 },
      ]);
    });

    it('throws if there is more or less than 1 main assignee', () => {
      expect(() =>
        setAssignees({
          collection: LOANS_COLLECTION,
          docId: 'id',
          assignees: [{ percent: 100 }],
        }),
      ).to.throw('un seul');

      expect(() =>
        setAssignees({
          collection: LOANS_COLLECTION,
          docId: 'id',
          assignees: [
            { percent: 80, isMain: true },
            { percent: 20, isMain: true },
          ],
        }),
      ).to.throw('un seul');
    });

    it('does not allow non multiples of 10', () => {
      generator({
        loans: { _id: 'id' },
        users: [{ _id: 'admin1' }, { _id: 'admin2' }],
      });

      expect(() =>
        setAssignees({
          collection: LOANS_COLLECTION,
          docId: 'id',
          assignees: [
            { _id: 'admin1', percent: 25, isMain: true },
            { _id: 'admin2', percent: 75 },
          ],
        }),
      ).to.throw('25 is not an allowed');
    });

    it('sets the main assignee to be the user assignee if asked to', () => {
      generator({
        loans: { _id: 'id', user: { _id: 'user' } },
        users: [
          { _factory: 'admin', _id: 'admin1' },
          { _factory: 'admin', _id: 'admin2' },
        ],
      });

      return ddpWithUserId('admin1', () => {
        setAssignees({
          docId: 'id',
          collection: LOANS_COLLECTION,
          assignees: [
            { _id: 'admin1', percent: 50, isMain: true },
            { _id: 'admin2', percent: 50, isMain: false },
          ],
          updateUserAssignee: true,
        });

        const user = UserService.get('user', { assignedEmployeeId: 1 });
        expect(user.assignedEmployeeId).to.equal('admin1');
      });
    });

    it('also sets the assignees to the linked insurance requests', async () => {
      generator({
        loans: {
          _id: 'id',
          insuranceRequests: [{ _id: 'iR1' }, { _id: 'iR2' }],
        },
        users: { _id: 'admin', _factory: 'admin' },
      });

      await setAssignees({
        docId: 'id',
        collection: LOANS_COLLECTION,
        assignees: [{ _id: 'admin', percent: 100, isMain: true }],
      });

      const iR1 = InsuranceRequestService.get('iR1', { assigneeLinks: 1 });
      const iR2 = InsuranceRequestService.get('iR2', { assigneeLinks: 1 });

      expect(iR1.assigneeLinks).to.deep.equal([
        { _id: 'admin', percent: 100, isMain: true },
      ]);
      expect(iR2.assigneeLinks).to.deep.equal([
        { _id: 'admin', percent: 100, isMain: true },
      ]);
    });

    it('also sets the assignees to the linked loan and other insurance requests', async () => {
      generator({
        loans: {
          _id: 'id',
          insuranceRequests: [{ _id: 'iR1' }, { _id: 'iR2' }],
        },
        users: { _id: 'admin', _factory: 'admin' },
      });

      await setAssignees({
        docId: 'iR1',
        collection: INSURANCE_REQUESTS_COLLECTION,
        assignees: [{ _id: 'admin', percent: 100, isMain: true }],
      });

      const loan = LoanService.get('id', { assigneeLinks: 1 });
      const iR2 = InsuranceRequestService.get('iR2', { assigneeLinks: 1 });

      expect(loan.assigneeLinks).to.deep.equal([
        { _id: 'admin', percent: 100, isMain: true },
      ]);
      expect(iR2.assigneeLinks).to.deep.equal([
        { _id: 'admin', percent: 100, isMain: true },
      ]);
    });
  });
});
