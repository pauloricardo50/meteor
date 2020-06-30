import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import PromotionService from '../../../promotions/server/PromotionService';
import { down, up } from '../38';

/* eslint-env-mocha */

describe('Migration 38', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('up', () => {
    it('adds id on construction timeline steps', async () => {
      await PromotionService.rawCollection.insert({
        _id: 'promo',
        constructionTimeline: { steps: [{}, {}] },
      });

      await up();

      const {
        constructionTimeline: { steps = [] } = {},
      } = PromotionService.get('promo', { constructionTimeline: 1 });

      expect(steps.length).to.equal(2);

      steps.forEach(({ id }) => expect(id).to.not.equal(undefined));
    });

    it('does not touch promotions without construction timeline', async () => {
      await PromotionService.rawCollection.insert({
        _id: 'promo',
      });

      await up();

      const { constructionTimeline } = PromotionService.get('promo', {
        constructionTimeline: 1,
      });

      expect(constructionTimeline).to.equal(undefined);
    });
  });

  describe('down', () => {
    it('removes id on construction timeline steps', async () => {
      await PromotionService.rawCollection.insert({
        _id: 'promo',
        constructionTimeline: { steps: [{ id: '123' }, { id: '456' }] },
      });

      await down();

      const {
        constructionTimeline: { steps = [] } = {},
      } = PromotionService.get('promo', { constructionTimeline: 1 });

      expect(steps.length).to.equal(2);

      steps.forEach(({ id }) => expect(id).to.equal(undefined));
    });

    it('does not touch promotions without construction timeline', async () => {
      await PromotionService.rawCollection.insert({
        _id: 'promo',
      });

      await down();

      const { constructionTimeline } = PromotionService.get('promo', {
        constructionTimeline: 1,
      });

      expect(constructionTimeline).to.equal(undefined);
    });
  });
});
