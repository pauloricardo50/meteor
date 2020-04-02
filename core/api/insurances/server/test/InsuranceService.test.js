/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';
import moment from 'moment';

import InsuranceService from '../InsuranceService';
import InsuranceRequestService from '../../../insuranceRequests/server/InsuranceRequestService';
import generator from '../../../factories/server/index';
import { ORGANISATION_FEATURES } from '../../../organisations/organisationConstants';
import {
  INSURANCE_STATUS,
  INSURANCE_PREMIUM_FREQUENCY,
} from '../../insuranceConstants';
import { INSURANCE_REQUEST_STATUS } from '../../../insuranceRequests/insuranceRequestConstants';

describe('InsuranceService', () => {
  beforeEach(() => {
    resetDatabase();
    generator({
      organisations: {
        _id: 'org',
        _factory: 'organisation',
        features: [ORGANISATION_FEATURES.INSURANCE],
        commissionRates: { _factory: 'commissionRate' },
        insuranceProducts: { _id: 'product', _factory: 'insuranceProduct' },
      },
      insuranceRequests: {
        _id: 'insuranceRequest',
        _factory: 'insuranceRequest',
        borrowers: { _id: 'borrower', _factory: 'borrower' },
      },
    });
  });

  describe('insert', () => {
    describe('updates the linked insurance status', () => {
      it('to BILLING when the insurance status is ACTIVE', () => {
        InsuranceService.insert({
          insuranceRequestId: 'insuranceRequest',
          borrowerId: 'borrower',
          organisationId: 'org',
          insuranceProductId: 'product',
          insurance: {
            status: INSURANCE_STATUS.POLICED,
            startDate: new Date(),
            endDate: new Date(),
          },
        });

        const { status } = InsuranceRequestService.get('insuranceRequest', {
          status: 1,
        });

        expect(status).to.equal(INSURANCE_REQUEST_STATUS.BILLING);
      });

      it('to BILLING when every linked insurances status is either ACTIVE or DECLINED', () => {
        InsuranceService.insert({
          insuranceRequestId: 'insuranceRequest',
          borrowerId: 'borrower',
          organisationId: 'org',
          insuranceProductId: 'product',
          insurance: {
            status: INSURANCE_STATUS.DECLINED,
            startDate: new Date(),
            endDate: new Date(),
          },
        });

        InsuranceService.insert({
          insuranceRequestId: 'insuranceRequest',
          borrowerId: 'borrower',
          organisationId: 'org',
          insuranceProductId: 'product',
          insurance: {
            status: INSURANCE_STATUS.POLICED,
            startDate: new Date(),
            endDate: new Date(),
          },
        });

        const { status } = InsuranceRequestService.get('insuranceRequest', {
          status: 1,
        });

        expect(status).to.equal(INSURANCE_REQUEST_STATUS.BILLING);
      });
    });
  });

  describe('insurance duration reducer', () => {
    it('returns 1 if the premium frequency is SINGLE', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: new Date(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.SINGLE,
        },
      });

      const { duration } = InsuranceService.get(insuranceId, { duration: 1 });

      expect(duration).to.equal(1);
    });

    it('returns 15 if the premium frequency is MONTHLY and the duration is 15 months', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(15, 'months')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.MONTHLY,
        },
      });

      const { duration } = InsuranceService.get(insuranceId, { duration: 1 });

      expect(duration).to.equal(15);
    });

    it('returns 4 if the premium frequency is QUARTERLY and the duration is 12 months', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(12, 'months')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.QUARTERLY,
        },
      });

      const { duration } = InsuranceService.get(insuranceId, { duration: 1 });

      expect(duration).to.equal(4);
    });

    it('returns 3 if the premium frequency is BIANNUAL and the duration is 18 months', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(18, 'months')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.BIANNUAL,
        },
      });

      const { duration } = InsuranceService.get(insuranceId, { duration: 1 });

      expect(duration).to.equal(3);
    });

    it('returns 5 if the premium frequency is YEARLY and the duration is 60 months', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(60, 'months')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.YEARLY,
        },
      });

      const { duration } = InsuranceService.get(insuranceId, { duration: 1 });

      expect(duration).to.equal(5);
    });
  });

  describe('estimated revenue reducer', () => {
    it('returns the correct estimated revenue when the premium frequency is SINGLE', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: new Date(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.SINGLE,
          premium: 1000,
        },
      });

      const { estimatedRevenue } = InsuranceService.get(insuranceId, {
        estimatedRevenue: 1,
      });

      expect(estimatedRevenue).to.equal(20);
    });

    it('returns the correct estimated revenue when the premium frequency is MONTHLY', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(1, 'year')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.MONTHLY,
          premium: 1000,
        },
      });

      const { estimatedRevenue } = InsuranceService.get(insuranceId, {
        estimatedRevenue: 1,
      });

      expect(estimatedRevenue).to.equal(240);
    });

    it('returns the correct estimated revenue when the premium frequency is QUARTERLY', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(1, 'year')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.QUARTERLY,
          premium: 1000,
        },
      });

      const { estimatedRevenue } = InsuranceService.get(insuranceId, {
        estimatedRevenue: 1,
      });

      expect(estimatedRevenue).to.equal(80);
    });

    it('returns the correct estimated revenue when the premium frequency is BIANNUAL', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.BIANNUAL,
          startDate: new Date(),
          endDate: moment()
            .add(1, 'year')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.BIANNUAL,
          premium: 1000,
        },
      });

      const { estimatedRevenue } = InsuranceService.get(insuranceId, {
        estimatedRevenue: 1,
      });

      expect(estimatedRevenue).to.equal(40);
    });

    it('returns the correct estimated revenue when the premium frequency is YEARLY', () => {
      const insuranceId = InsuranceService.insert({
        insuranceRequestId: 'insuranceRequest',
        borrowerId: 'borrower',
        organisationId: 'org',
        insuranceProductId: 'product',
        insurance: {
          status: INSURANCE_STATUS.POLICED,
          startDate: new Date(),
          endDate: moment()
            .add(1, 'year')
            .toDate(),
          premiumFrequency: INSURANCE_PREMIUM_FREQUENCY.YEARLY,
          premium: 1000,
        },
      });

      const { estimatedRevenue } = InsuranceService.get(insuranceId, {
        estimatedRevenue: 1,
      });

      expect(estimatedRevenue).to.equal(20);
    });
  });
});
