import { Migrations } from 'meteor/percolate:migrations';

import PromotionOptionService from '../../promotionOptions/server/PromotionOptionService';

export const up = () => {
  const allPromotionOptions = PromotionOptionService.fetch({
    _id: 1,
    promotionLots: {
      promotion: { _id: 1 },
    },
  });

  return Promise.all(
    allPromotionOptions.map(({ _id, promotionLots = [] }) =>
      PromotionOptionService.rawCollection.update(
        { _id },
        { $set: { promotionLink: { _id: promotionLots[0].promotion._id } } },
      ),
    ),
  );
};

export const down = () => {
  const allPromotionOptions = PromotionOptionService.fetch({
    _id: 1,
    promotion: 1,
  });

  return Promise.all(
    allPromotionOptions.map(({ _id }) =>
      PromotionOptionService.rawCollection.update(
        { _id },
        { $unset: { promotionLink: 1 } },
      ),
    ),
  );
};

Migrations.add({
  version: 25,
  name: 'Add promotion link on all promotionOptions',
  up,
  down,
});
