import { Migrations } from 'meteor/percolate:migrations';
import { Random } from 'meteor/random';

import PromotionService from '../../promotions/server/PromotionService';

export const up = () => {
  const promotions = PromotionService.fetch({
    $filters: { constructionTimeline: { $exists: true } },
    constructionTimeline: 1,
  });

  const promises = promotions.map(
    ({ _id: promotionId, constructionTimeline }) => {
      const { steps = [] } = constructionTimeline;

      if (!steps?.length) {
        return Promise.resolve();
      }

      const stepsWithId = steps.map(step => ({ ...step, id: Random.id() }));

      return PromotionService.rawCollection.update(
        { _id: promotionId },
        {
          $set: {
            constructionTimeline: {
              ...constructionTimeline,
              steps: stepsWithId,
            },
          },
        },
      );
    },
  );

  return Promise.all(promises);
};

export const down = () => {
  const promotions = PromotionService.fetch({
    $filters: { constructionTimeline: { $exists: true } },
    constructionTimeline: 1,
  });

  const promises = promotions.map(
    ({ _id: promotionId, constructionTimeline }) => {
      const { steps = [] } = constructionTimeline;

      if (!steps?.length) {
        return Promise.resolve();
      }

      const stepsWithoutId = steps.map(({ id, ...step }) => step);

      return PromotionService.rawCollection.update(
        { _id: promotionId },
        {
          $set: {
            constructionTimeline: {
              ...constructionTimeline,
              steps: stepsWithoutId,
            },
          },
        },
      );
    },
  );

  return Promise.all(promises);
};

Migrations.add({
  version: 38,
  name: 'Add id on promotion construction timeline steps',
  up,
  down,
});
