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
      const loan = LoanService.getLoanById(loanId);
      expect(loan.promotionOptionLinks).to.deep.equal([]);
    });

    it('Removes the priority order from the loan', () => {
      PromotionOptionService.remove({ promotionOptionId });
      const loan = LoanService.getLoanById(loanId);
      expect(loan.promotionLinks).to.deep.equal([
        { _id: 'promotion', priorityOrder: [] },
      ]);
    });
  });
});
