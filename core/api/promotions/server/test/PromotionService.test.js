// @flow
/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import PromotionService from '../../PromotionService';
import PromotionLotService from '../../../promotionLots/PromotionLotService';
import PromotionOptionService from '../../../promotionOptions/PromotionOptionService';
import LotService from '../../../lots/LotService';

describe('PromotionService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('remove', () => {
    let promotionOptionId;
    let loanId;
    let promotionId;
    let promotionLotId;
    let lotId;

    beforeEach(() => {
      lotId = Factory.create('lot')._id;
      promotionLotId = Factory.create('promotionLot')._id;
      promotionId = Factory.create('promotion', {
        _id: 'promotion',
        lotLinks: [{ _id: lotId }],
        promotionLotLinks: [{ _id: promotionLotId }],
      })._id;
      promotionOptionId = Factory.create('promotionOption', {
        promotionLotLinks: [{ _id: promotionLotId }],
      })._id;
      loanId = Factory.create('loan', {
        promotionOptionLinks: [{ _id: promotionOptionId }],
        promotionLinks: [
          { _id: 'promotion', priorityOrder: [promotionOptionId] },
        ],
      })._id;
    });

    it('deletes the promotion', () => {
      expect(PromotionService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all promotionLots', () => {
      expect(PromotionLotService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionLotService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all promotionOptions', () => {
      expect(PromotionOptionService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(PromotionOptionService.collection.find({}).count()).to.equal(0);
    });

    it('deletes all lots', () => {
      expect(LotService.collection.find({}).count()).to.equal(1);
      PromotionService.remove({ promotionId });
      expect(LotService.collection.find({}).count()).to.equal(0);
    });
  });
});
