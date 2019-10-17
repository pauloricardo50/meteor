// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

// import { PROMOTION_RESERVATION_STATUS } from 'core/api/promotionReservations/promotionReservationConstants';
// import PromotionReservationService from '../../../promotionReservations/server/PromotionReservationService';
import generator from '../../../factories';
import LoanService from '../../../loans/server/LoanService';
import PromotionOptionService from '../PromotionOptionService';
import { PROMOTION_OPTION_MORTGAGE_CERTIFICATION_STATUS } from '../../promotionOptionConstants';

describe('PromotionOptionService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('remove', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: { _id: promotionOptionId, loan: { _id: loanId } },
          },
          loans: { _id: loanId },
        },
      });
    });

    it('Removes the promotionOption', () => {
      expect(PromotionOptionService.get(promotionOptionId)).to.not.equal(undefined);
      PromotionOptionService.remove({ promotionOptionId });
      expect(PromotionOptionService.get(promotionOptionId)).to.equal(undefined);
    });

    it('Removes the link from the loan', () => {
      PromotionOptionService.remove({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionOptionLinks).to.deep.equal([]);
    });

    it('Removes the priority order from the loan', () => {
      PromotionOptionService.remove({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks).to.deep.equal([
        { _id: promotionId, priorityOrder: [], showAllLots: true },
      ]);
    });

    it('throws if there is an active/completed promotionReservation', async () => {
      const pRId = await PromotionReservationService.insert({
        promotionOptionId,
        promotionReservation: { startDate: new Date() },
        withAgreement: false,
      });
      expect(() =>
        PromotionOptionService.remove({ promotionOptionId })).to.throw('active');
    });

    it('does not throw if there is a cancelled promotionReservation', async () => {
      const pRId = await PromotionReservationService.insert({
        promotionOptionId,
        promotionReservation: { startDate: new Date() },
        withAgreement: false,
      });
      PromotionReservationService._update({
        id: pRId,
        object: { status: PROMOTION_RESERVATION_STATUS.CANCELED },
      });
      expect(() =>
        PromotionOptionService.remove({ promotionOptionId })).to.not.throw('active');

      const pR = PromotionReservationService.findOne({});
      expect(pR).to.equal(undefined);
    });
  });

  describe('insert', () => {
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      loanId = 'loanId';
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
          },
          loans: { _id: loanId, $metadata: { priorityOrder: [] } },
        },
      });
    });

    it('inserts a new promotionOption', () => {
      const id = PromotionOptionService.insert({ promotionLotId, loanId });
      expect(PromotionOptionService.get(id)).to.not.equal(undefined);
    });

    it('throws if promotion lot exists in another promotionOption in the loan', () => {
      const id = PromotionOptionService.insert({ promotionLotId, loanId });
      expect(PromotionOptionService.get(id)).to.not.equal(undefined);

      expect(() =>
        PromotionOptionService.insert({ promotionLotId, loanId })).to.throw('Vous avez déjà');
    });

    it('adds a link on the loan', () => {
      PromotionOptionService.insert({ promotionLotId, loanId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionOptionLinks.length).to.equal(1);
    });

    it('inserts the promotionOptionId in the priorityOrder', () => {
      const id = PromotionOptionService.insert({ promotionLotId, loanId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder[0]).to.equal(id);
    });

    it('inserts the promotionOptionId at the end of the priorityOrder', () => {
      LoanService.remove(loanId);
      loanId = Factory.create('loan', {
        promotionLinks: [{ _id: promotionId, priorityOrder: ['test'] }],
      })._id;
      let loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder.length).to.equal(1);

      const id = PromotionOptionService.insert({ promotionLotId, loanId });
      loan = LoanService.get(loanId);

      expect(loan.promotionLinks[0].priorityOrder.length).to.equal(2);
      expect(loan.promotionLinks[0].priorityOrder[1]).to.equal(id);
    });
  });

  describe('increasePriorityOrder', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';

      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          loans: {
            _id: loanId,
            $metadata: { priorityOrder: [promotionOptionId] },
          },
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: { _id: promotionOptionId, loan: { _id: loanId } },
          },
        },
      });
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.increasePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption up by one', () => {
      generator({
        promotionOptions: {
          _id: 'pOptId2',
          promotionLots: { _id: promotionLotId },
          loan: {
            _id: 'loanId2',
            promotionLinks: [
              { _id: promotionId, priorityOrder: ['test', 'pOptId2'] },
            ],
          },
        },
      });
      PromotionOptionService.increasePriorityOrder({
        promotionOptionId: 'pOptId2',
      });
      const loan = LoanService.get('loanId2');
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        'pOptId2',
        'test',
      ]);
    });
  });

  describe('reducePriorityOrder', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionId = 'promoId';
      promotionLotId = 'pLotId';
      promotionOptionId = 'pOptId';
      loanId = 'loanId';

      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: promotionId,
          loans: {
            _id: loanId,
            $metadata: { priorityOrder: [promotionOptionId] },
          },
          promotionLots: {
            _id: promotionLotId,
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: { _id: promotionOptionId, loan: { _id: loanId } },
          },
        },
      });
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.reducePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption down by one', () => {
      generator({
        promotionOptions: {
          _id: 'pOptId2',
          promotionLots: { _id: promotionLotId },
          loan: {
            _id: 'loanId2',
            promotionLinks: [
              { _id: promotionId, priorityOrder: ['pOptId2', 'test'] },
            ],
          },
        },
      });
      PromotionOptionService.reducePriorityOrder({
        promotionOptionId: 'pOptId2',
      });
      const loan = LoanService.get('loanId2');
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        'test',
        'pOptId2',
      ]);
    });
  });

  describe('update', () => {
    it('updates any related promotionReservation if solvency changes', async () => {
      generator({
        properties: { _id: 'propId' },
        promotions: {
          _id: 'promotionId',
          loans: { _id: 'loanId' },
          promotionLots: {
            _id: 'promotionLotId',
            propertyLinks: [{ _id: 'propId' }],
            promotionOptions: {
              _id: 'promotionOptionId',
              loan: { _id: 'loanId' },
            },
          },
        },
      });

      await PromotionReservationService.insert({
        promotionOptionId: 'promotionOptionId',
        promotionReservation: { startDate: new Date() },
        withAgreement: false,
      });

      PromotionOptionService.update({
        promotionOptionId: 'promotionOptionId',
        object: { solvency: PROMOTION_OPTION_SOLVENCY.SOLVENT },
      });

      const pR = PromotionReservationService.findOne({});

      expect(pR.mortgageCertification.status).to.equal(PROMOTION_OPTION_SOLVENCY.SOLVENT);
    });
  });
});
