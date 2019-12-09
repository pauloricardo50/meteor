/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';

import generator from '../../../factories';
import PromotionLotService from '../../../promotionLots/server/PromotionLotService';
import PromotionService from '../../../promotions/server/PromotionService';
import LotService from '../LotService';

describe('LotService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('lotUpdate', () => {
    let promotionLotId;
    let lotId;

    beforeEach(() => {
      lotId = 'lotId';
      promotionLotId = 'pLotId';
      generator({
        lots: { _id: lotId },
        properties: { _id: 'propertyId' },
        promotionLots: {
          _id: promotionLotId,
          propertyLinks: [{ _id: 'propertyId' }],
          lots: { _id: lotId },
        },
      });
    });

    it('updates the name', () => {
      LotService.update({ lotId, object: { name: 'testname' } });
      const lot = LotService.get(lotId, { name: 1 });
      expect(lot.name).to.equal('testname');
    });

    it('removes the lot link when promotionLotId is null', () => {
      LotService.update({ lotId, object: { promotionLotId: null } });
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks
          .length,
      ).to.equal(0);
    });

    it('adds a new link', () => {
      const id = 'promotionLotId2';
      generator({
        properties: { _id: 'propertyId2' },
        promotionLots: { _id: id, propertyLinks: [{ _id: 'propertyId2' }] },
      });
      LotService.update({
        lotId,
        object: { promotionLotId: id },
      });
      const { lotLinks } = PromotionLotService.get(promotionLotId, {
        lotLinks: 1,
      });
      const { lotLinks: newLotLinks } = PromotionLotService.get(id, {
        lotLinks: 1,
      });

      expect(newLotLinks.length).to.equal(1);
      expect(newLotLinks[0]._id).to.equal(lotId);
      expect(lotLinks.length).to.equal(0);
    });

    it('does not remove the link if no new link is provided', () => {
      LotService.update({ lotId, object: { name: 'testname' } });
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks
          .length,
      ).to.equal(1);
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks[0]
          ._id,
      ).to.equal(lotId);
    });

    it('adds a new link when no current link is present', () => {
      // Removes current link
      LotService.update({
        lotId,
        object: { promotionLotId: null },
      });
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks
          .length,
      ).to.equal(0);

      // Adds link again
      LotService.update({
        lotId,
        object: { promotionLotId },
      });
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks
          .length,
      ).to.equal(1);
      expect(
        PromotionLotService.get(promotionLotId, { lotLinks: 1 }).lotLinks[0]
          ._id,
      ).to.equal(lotId);
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
      let promotion = PromotionService.get(promotionId, { lotLinks: 1 });

      expect(LotService.collection.find({}).count()).to.equal(1);
      expect(promotion.lotLinks).to.deep.equal([{ _id: lotId }]);

      LotService.remove(lotId);

      expect(LotService.collection.find({}).count()).to.equal(0);
      promotion = PromotionService.get(promotionId, { lotLinks: 1 });
      expect(promotion.lotLinks).to.deep.equal([]);
    });
  });
});
