/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import LotService from '../LotService';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import PromotionService from '../../../promotions/server/PromotionService';

describe('LotService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('lotUpdate', () => {
    let promotionLotId;
    let lotId;

    beforeEach(() => {
      lotId = Factory.create('lot', { _id: 'lotId' })._id;
      promotionLotId = Factory.create('promotionLot', {
        _id: 'promotionLotId',
        lotLinks: [{ _id: lotId }],
      })._id;
    });

    it('updates the name', () => {
      LotService.update({ lotId, object: { name: 'testname' } });
      const lot = LotService.get(lotId);
      expect(lot.name).to.equal('testname');
    });

    it('removes the lot link when promotionLotId is null', () => {
      LotService.update({ lotId, object: { promotionLotId: null } });
      expect(PromotionLotService.get(promotionLotId).lotLinks.length).to.equal(0);
    });

    it('adds a new link', () => {
      const newPromotionLotId = Factory.create('promotionLot', {
        _id: 'promotionLotId2',
      })._id;
      LotService.update({
        lotId,
        object: { promotionLotId: newPromotionLotId },
      });
      const { lotLinks } = PromotionLotService.get(promotionLotId);
      const { lotLinks: newLotLinks } = PromotionLotService.get(newPromotionLotId);

      expect(newLotLinks.length).to.equal(1);
      expect(newLotLinks[0]._id).to.equal(lotId);
      expect(lotLinks.length).to.equal(0);
    });

    it('does not remove the link if no new link is provided', () => {
      LotService.update({ lotId, object: { name: 'testname' } });
      expect(PromotionLotService.get(promotionLotId).lotLinks.length).to.equal(1);
      expect(PromotionLotService.get(promotionLotId).lotLinks[0]._id).to.equal(lotId);
    });

    it('adds a new link when no current link is present', () => {
      // Removes current link
      LotService.update({
        lotId,
        object: { promotionLotId: null },
      });
      expect(PromotionLotService.get(promotionLotId).lotLinks.length).to.equal(0);

      // Adds link again
      LotService.update({
        lotId,
        object: { promotionLotId },
      });
      expect(PromotionLotService.get(promotionLotId).lotLinks.length).to.equal(1);
      expect(PromotionLotService.get(promotionLotId).lotLinks[0]._id).to.equal(lotId);
    });
  });

  describe('remove', () => {
    let promotionId;
    let lotId;

    beforeEach(() => {
      lotId = Factory.create('lot')._id;
      promotionId = Factory.create('promotion', {
        _id: 'promotion',
        lotLinks: [{ _id: lotId }],
      })._id;
    });

    it('removes the link from the promotion', () => {
      let promotion = PromotionService.get(promotionId);

      expect(LotService.collection.find({}).count()).to.equal(1);
      expect(promotion.lotLinks).to.deep.equal([{ _id: lotId }]);

      LotService.remove(lotId);

      expect(LotService.collection.find({}).count()).to.equal(0);
      promotion = PromotionService.get(promotionId);
      expect(promotion.lotLinks).to.deep.equal([]);
    });
  });
});
