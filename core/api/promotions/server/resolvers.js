import intersectDeep from 'meteor/cultofcoders:grapher/lib/query/lib/intersectDeep';

import {
  proPromotion,
  proPromotions as proPromotionsFragment,
} from '../../fragments';
import SecurityService from '../../security';
import PromotionService from './PromotionService';
import { makePromotionLotAnonymizer } from './promotionServerHelpers';

export const proPromotionsResolver = ({ userId, _id, simple, $body }) => {
  let fragment = _id ? proPromotion() : proPromotionsFragment();

  if ($body) {
    fragment = intersectDeep(proPromotion(), $body);
  }

  const promotions = PromotionService.fetch({
    $filters: { ...(_id ? { _id } : { 'userLinks._id': userId }) },
    ...fragment,
  });

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return promotions;
  } catch (error) {
    return promotions.map((promotion) => {
      const { promotionLots = [], ...rest } = promotion;
      return simple
        ? promotion
        : {
          promotionLots: promotionLots.map(makePromotionLotAnonymizer({ userId })),
          ...rest,
        };
    });
  }
};
