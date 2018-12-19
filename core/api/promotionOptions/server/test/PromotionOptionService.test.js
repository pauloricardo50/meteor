// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import PromotionOptionService from '../../PromotionOptionService';
import LoanService from '../../../loans/LoanService';

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
      promotionLotId = Factory.create('promotionLot', { _id: 'lotId' })._id;
      promotionId = Factory.create('promotion', { _id: 'promotion' })._id;
      promotionOptionId = Factory.create('promotionOption')._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId] },
        ],
      })._id;
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
        { _id: 'promotion', priorityOrder: [] },
      ]);
    });
  });

  describe('insert', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;

    beforeEach(() => {
      promotionLotId = Factory.create('promotionLot', { _id: 'lotId' })._id;
      promotionId = Factory.create('promotion', { _id: 'promotion' })._id;
      loanId = Factory.create('loan', {
        promotionLinks: [{ _id: 'promotion', priorityOrder: [] }],
      })._id;
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
        promotionLinks: [{ _id: 'promotion', priorityOrder: ['test'] }],
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
      promotionLotId = Factory.create('promotionLot', { _id: 'lotId' })._id;
      promotionId = Factory.create('promotion', { _id: 'promotion' })._id;
      promotionOptionId = Factory.create('promotionOption')._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId] },
        ],
      })._id;
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.increasePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption up by one', () => {
      promotionOptionId = Factory.create('promotionOption')._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: ['test', promotionOptionId] },
        ],
      })._id;
      PromotionOptionService.increasePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
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
      promotionLotId = Factory.create('promotionLot', { _id: 'lotId' })._id;
      promotionId = Factory.create('promotion', { _id: 'promotion' })._id;
      promotionOptionId = Factory.create('promotionOption')._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId] },
        ],
      })._id;
    });

    it('does nothing if priority is already max', () => {
      PromotionOptionService.reducePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        promotionOptionId,
      ]);
    });

    it('moves the promotionOption down by one', () => {
      promotionOptionId = Factory.create('promotionOption')._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId, 'test'] },
        ],
      })._id;
      PromotionOptionService.reducePriorityOrder({ promotionOptionId });
      const loan = LoanService.get(loanId);
      expect(loan.promotionLinks[0].priorityOrder).to.deep.equal([
        'test',
        promotionOptionId,
      ]);
    });
  });
});
