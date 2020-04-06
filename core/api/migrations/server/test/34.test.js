import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { COMMISSION_RATES_TYPE } from 'core/api/commissionRates/commissionRateConstants';
import OrganisationService from '../../../organisations/server/OrganisationService';
import CommissionRateService from '../../../commissionRates/server/CommissionRateService';
import { up, down } from '../34';

describe('Migration 34', () => {
  beforeEach(() => resetDatabase());

  describe('up', () => {
    it('creates the commission rates link for an organisation with commissionRates', async () => {
      OrganisationService.rawInsert({
        _id: 'org',
        commissionRates: [
          { threshold: 0, rate: 0.1 },
          { threshold: 1, rate: 0.2 },
        ],
      });
      await up();
      const { type, organisationLink, rates } = CommissionRateService.fetchOne({
        type: 1,
        organisationLink: 1,
        rates: 1,
      });

      expect(type).to.equal(COMMISSION_RATES_TYPE.COMMISSIONS);
      expect(organisationLink._id).to.equal('org');
      expect(rates.length).to.equal(2);
      expect(rates[0]).to.deep.include({
        threshold: 0,
        rate: 0.1,
        startDate: '01-01',
      });
      expect(rates[1]).to.deep.include({
        threshold: 1,
        rate: 0.2,
        startDate: '01-01',
      });
    });

    it('does not creates the commission rates link for an organisation without commissionRates', async () => {
      OrganisationService.rawInsert({ _id: 'org' });
      await up();
      const commissionRates = CommissionRateService.fetch({ _id: 1 });

      expect(commissionRates.length).to.equal(0);
    });
  });

  describe('down', () => {
    it('removes the commission rates link and adds the object back to the organisation', async () => {
      OrganisationService.rawInsert({ _id: 'org' });

      CommissionRateService.insert({
        commissionRates: {
          type: COMMISSION_RATES_TYPE.COMMISSIONS,
          rates: [
            { rate: 0.1, threshold: 0, startDate: '01-01' },
            { rate: 0.2, threshold: 1, startDate: '01-01' },
          ],
        },
        organisationId: 'org',
      });

      await down();

      const {
        commissionRates: orgCommissionRates = [],
      } = OrganisationService.findOne({ _id: 'org' }, { commissionRates: 1 });
      const commissionRates = CommissionRateService.fetch({ _id: 1 });

      expect(orgCommissionRates.length).to.equal(2);
      expect(orgCommissionRates[0]).to.deep.include({
        rate: 0.1,
        threshold: 0,
      });
      expect(orgCommissionRates[1]).to.deep.include({
        rate: 0.2,
        threshold: 1,
      });
      expect(commissionRates.length).to.equal(0);
    });

    it('removes the commission rates link but down not add the object back to the organisation when type is REVENUES', async () => {
      OrganisationService.rawInsert({ _id: 'org' });

      CommissionRateService.insert({
        commissionRates: {
          type: COMMISSION_RATES_TYPE.PRODUCTIONS,
          rates: [
            { rate: 0.1, threshold: 0, startDate: '01-01' },
            { rate: 0.2, threshold: 1, startDate: '01-01' },
          ],
        },
        organisationId: 'org',
      });

      await down();

      const {
        commissionRates: orgCommissionRates = [],
      } = OrganisationService.findOne({ _id: 'org' }, { commissionRates: 1 });
      const commissionRates = CommissionRateService.fetch({ _id: 1 });

      expect(orgCommissionRates.length).to.equal(0);
      expect(commissionRates.length).to.equal(0);
    });
  });
});
