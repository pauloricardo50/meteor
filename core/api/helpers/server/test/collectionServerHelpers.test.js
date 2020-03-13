/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { getNewName } from '../collectionServerHelpers';
import LoanService from '../../../loans/server/LoanService';
import InsuranceRequestService from '../../../insuranceRequests/server/InsuranceRequestService';
import generator from '../../../factories/server/generator';
import { LOANS_COLLECTION } from '../../../loans/loanConstants';
import { INSURANCE_REQUESTS_COLLECTION } from '../../../insuranceRequests/insuranceRequestConstants';

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
});
