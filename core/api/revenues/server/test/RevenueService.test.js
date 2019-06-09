// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import generator from '../../../factories';
import RevenueService from '../RevenueService';
import { REVENUE_STATUS } from '../../revenueConstants';

describe('RevenueService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('getGeneratedRevenues', () => {
    it('returns 0 if no revenues exist', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(0);
    });

    it('only gets revenues of the requested org', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [
          {
            organisations: { _id: 'org2' },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(0);
    });

    it('returns all of one revenue', () => {
      generator({
        organisations: { _id: 'org' },
        revenues: [
          {
            organisations: { _id: 'org' },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(100);
    });

    it('only counts closed revenues', () => {
      generator({
        organisations: { _id: 'org' },
        revenues: [
          {
            organisations: { _id: 'org' },
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
          {
            organisations: { _id: 'org' },
            amount: 100,
            status: REVENUE_STATUS.EXPECTED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(100);
    });

    it('splits revenues if there are multiple organisations', () => {
      generator({
        organisations: { _id: 'org', name: 'org1' },
        revenues: [
          {
            organisations: [{ _id: 'org' }, { _id: 'org2' }],
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
          {
            organisations: [{ _id: 'org' }],
            amount: 100,
            status: REVENUE_STATUS.CLOSED,
          },
        ],
      });

      const result = RevenueService.getGeneratedRevenues({
        organisationId: 'org',
      });

      expect(result).to.equal(150);
    });
  });
});
