/* eslint-env mocha */
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { expect } from 'chai';

import CommissionRateService from '../CommissionRateService';
import generator from '../../../factories/server/index';
import { COMMISSION_RATES_TYPE } from '../../commissionRateConstants';

describe('CommissionRateService', () => {
  beforeEach(() => resetDatabase());

  describe('insert', () => {
    it('throws if no organisationId is given', () => {
      expect(() => CommissionRateService.insert({})).to.throw(
        'Organisation id is required',
      );
    });

    it('throws if rates are empty', () => {
      expect(() =>
        CommissionRateService.insert({
          commissionRates: { rates: [] },
          organisationId: 'org',
        }),
      ).to.throw('Rates length cannot be 0');
    });

    it('throws if commission rates already exist for the organisation', () => {
      generator({
        organisations: {
          _id: 'org',
          name: 'org',
          commissionRates: [
            {
              type: COMMISSION_RATES_TYPE.COMMISSIONS,
              rates: [{ rate: 0.01, startDate: '01-01', threshold: 0 }],
            },
          ],
        },
      });

      expect(() =>
        CommissionRateService.insert({
          commissionRates: {
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
            rates: [{}],
          },
          organisationId: 'org',
        }),
      ).to.throw('commission rates already exist');
    });

    it('throws if first threshold is not 0', () => {
      generator({
        organisations: {
          _id: 'org',
          name: 'org',
        },
      });

      expect(() =>
        CommissionRateService.insert({
          commissionRates: {
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
            rates: [{ threshold: 1 }],
          },
          organisationId: 'org',
        }),
      ).to.throw('Le premier seuil');
    });

    it('throws if any rate is lower than the previous', () => {
      generator({
        organisations: {
          _id: 'org',
          name: 'org',
        },
      });

      expect(() =>
        CommissionRateService.insert({
          commissionRates: {
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
            rates: [
              { threshold: 0, rate: 0 },
              { threshold: 1, rate: 1 },
              { threshold: 2, rate: 0 },
            ],
          },
          organisationId: 'org',
        }),
      ).to.throw('Chaque taux doit être plus élevé que le précédent');
    });

    it('throws if any threshold is lower than the previous', () => {
      generator({
        organisations: {
          _id: 'org',
          name: 'org',
        },
      });

      expect(() =>
        CommissionRateService.insert({
          commissionRates: {
            type: COMMISSION_RATES_TYPE.COMMISSIONS,
            rates: [
              { threshold: 0, rate: 0 },
              { threshold: 1, rate: 0.5 },
              { threshold: 0, rate: 1 },
            ],
          },
          organisationId: 'org',
        }),
      ).to.throw('Chaque seuil doit être plus élevé que le précédent');
    });

    it('inserts a commission rate', () => {
      generator({
        organisations: {
          _id: 'org',
          name: 'org',
        },
      });

      const crId = CommissionRateService.insert({
        commissionRates: {
          type: COMMISSION_RATES_TYPE.COMMISSIONS,
          rates: [
            { threshold: 0, rate: 0 },
            { threshold: 1, rate: 0.5 },
            { threshold: 2, rate: 1, startDate: '05-04' },
          ],
        },
        organisationId: 'org',
      });

      const cr = CommissionRateService.get(crId, {
        type: 1,
        rates: 1,
        organisationLink: 1,
      });

      expect(cr).to.deep.include({
        type: COMMISSION_RATES_TYPE.COMMISSIONS,
        rates: [
          { rate: 0, threshold: 0, startDate: '01-01' },
          { rate: 0.5, threshold: 1, startDate: '01-01' },
          { rate: 1, threshold: 2, startDate: '05-04' },
        ],
        organisationLink: { _id: 'org' },
      });
    });
  });
});
