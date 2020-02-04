//      
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import {
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
} from 'core/api/promotionOptions/promotionOptionConstants';
import PromotionService from '../../../promotions/server/PromotionService';
import PromotionOptionService from '../../../promotionOptions/server/PromotionOptionService';
import generator from '../../../factories/index';
import {
  PROMOTION_LOT_STATUS,
  PROMOTION_OPTION_STATUS,
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
} from '../../../constants';
import { up, down } from '../27';

describe('Migration 27', () => {
  beforeEach(() => resetDatabase());

  describe('up', () => {
    it('sets agreementDuration on all promotions', async () => {
      await PromotionService.collection.rawCollection().insert({ _id: 'a' });
      await PromotionService.collection.rawCollection().insert({ _id: 'b' });

      await up();

      const promotions = PromotionService.find().fetch();
      expect(promotions.length).to.equal(2);
      promotions.forEach(p => {
        expect(p.agreementDuration).to.equal(30);
      });
    });

    it('inits the reservation for each promotion option', async () => {
      generator({
        properties: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
        promotions: {
          _id: 'promo',
          promotionLots: [
            {
              status: PROMOTION_LOT_STATUS.AVAILABLE,
              propertyLinks: [{ _id: 'a' }],
              promotionOptions: {
                loan: { _id: 'loan1' },
                promotion: { _id: 'promo' },
              },
            },
            {
              status: PROMOTION_LOT_STATUS.AVAILABLE,
              propertyLinks: [{ _id: 'b' }],
              promotionOptions: {
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
            },
            {
              status: PROMOTION_LOT_STATUS.AVAILABLE,
              propertyLinks: [{ _id: 'c' }],
              promotionOptions: {
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
            },
          ],
        },
        loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
      });

      await up();

      const promotionOptions = PromotionOptionService.find({}).fetch();

      const today = moment().format('YYYY MM DD');

      promotionOptions.forEach(
        ({
          simpleVerification,
          fullVerification,
          bank,
          reservationDeposit,
          reservationAgreement,
        }) => {
          expect(moment(simpleVerification.date).format('YYYY MM DD')).to.equal(
            today,
          );
          expect(simpleVerification.status).to.equal(
            PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE,
          );
          expect(moment(fullVerification.date).format('YYYY MM DD')).to.equal(
            today,
          );
          expect(fullVerification.status).to.equal(
            PROMOTION_OPTION_FULL_VERIFICATION_STATUS.INCOMPLETE,
          );
          expect(moment(bank.date).format('YYYY MM DD')).to.equal(today);
          expect(bank.status).to.equal(PROMOTION_OPTION_BANK_STATUS.INCOMPLETE);
          expect(moment(reservationDeposit.date).format('YYYY MM DD')).to.equal(
            today,
          );
          expect(reservationDeposit.status).to.equal(
            PROMOTION_OPTION_DEPOSIT_STATUS.WAITING,
          );
          expect(
            moment(reservationAgreement.date).format('YYYY MM DD'),
          ).to.equal(today);
          expect(reservationAgreement.status).to.equal(
            PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
          );
        },
      );
    });

    it('sets the reservation for each reserved or sold promotionLot', async () => {
      generator({
        properties: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
        promotions: {
          _id: 'promo',
          promotionLots: [
            {
              status: PROMOTION_LOT_STATUS.AVAILABLE,
              propertyLinks: [{ _id: 'a' }],
            },
            {
              status: PROMOTION_LOT_STATUS.RESERVED,
              propertyLinks: [{ _id: 'b' }],
              promotionOptions: {
                loan: { _id: 'loan1' },
                promotion: { _id: 'promo' },
              },
              attributedTo: { _id: 'loan1' },
            },
            {
              status: PROMOTION_LOT_STATUS.SOLD,
              propertyLinks: [{ _id: 'c' }],
              promotionOptions: {
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
              attributedTo: { _id: 'loan2' },
            },
          ],
          loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
        },
      });

      await up();

      const pOs = PromotionOptionService.find(
        {},
        { sort: { status: 1 } },
      ).fetch();
      expect(pOs.length).to.equal(2);
      expect(pOs[0].status).to.equal(
        PROMOTION_OPTION_STATUS.RESERVATION_ACTIVE,
      );
      expect(pOs[1].status).to.equal(PROMOTION_OPTION_STATUS.SOLD);
    });

    it('sets agreement to waiting on reserved lots', async () => {
      generator({
        properties: { _id: 'a' },
        promotions: {
          _id: 'promo',
          promotionLots: {
            status: PROMOTION_LOT_STATUS.RESERVED,
            propertyLinks: [{ _id: 'b' }],
            promotionOptions: {
              loan: { _id: 'loan1' },
              promotion: { _id: 'promo' },
            },
            attributedTo: { _id: 'loan1' },
          },
          loans: [{ _id: 'loan1' }],
        },
      });

      await up();

      const pOs = PromotionOptionService.find({}).fetch();
      expect(pOs[0].reservationAgreement).to.deep.include({
        status: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
      });
    });

    it('sets statuses on sold lots', async () => {
      generator({
        properties: { _id: 'a' },
        promotions: {
          _id: 'promo',
          promotionLots: {
            status: PROMOTION_LOT_STATUS.SOLD,
            propertyLinks: [{ _id: 'b' }],
            promotionOptions: {
              loan: { _id: 'loan1' },
              promotion: { _id: 'promo' },
            },
            attributedTo: { _id: 'loan1' },
          },
          loans: [{ _id: 'loan1' }],
        },
      });

      await up();

      const pOs = PromotionOptionService.find({}).fetch();
      expect(pOs[0].reservationAgreement).to.deep.include({
        status: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
      });
      expect(pOs[0].bank).to.deep.include({
        status: PROMOTION_OPTION_BANK_STATUS.VALIDATED,
      });
      expect(pOs[0].reservationDeposit).to.deep.include({
        status: PROMOTION_OPTION_DEPOSIT_STATUS.PAID,
      });
    });
  });

  describe('down', () => {
    it('resets all promotion options', async () => {
      generator({
        properties: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
        promotions: {
          promotionLots: [
            {
              status: PROMOTION_LOT_STATUS.AVAILABLE,
              propertyLinks: [{ _id: 'a' }],
            },
            {
              status: PROMOTION_LOT_STATUS.RESERVED,
              propertyLinks: [{ _id: 'b' }],
              promotionOptions: {
                loan: { _id: 'loan1' },
                promotion: { _id: 'promo' },
              },
              attributedTo: { _id: 'loan1' },
            },
            {
              status: PROMOTION_LOT_STATUS.SOLD,
              propertyLinks: [{ _id: 'c' }],
              promotionOptions: {
                loan: { _id: 'loan2' },
                promotion: { _id: 'promo' },
              },
              attributedTo: { _id: 'loan2' },
            },
          ],
        },
        loans: [{ _id: 'loan1' }, { _id: 'loan2' }],
      });

      await up();
      await down();

      const pOs = PromotionOptionService.find({}).fetch();

      pOs.forEach(pO => {
        expect(pO.status).to.equal(undefined);
        expect(pO.reservationAgreement).to.equal(undefined);
        expect(pO.bank).to.equal(undefined);
        expect(pO.deposit).to.equal(undefined);
      });
    });
  });
});
