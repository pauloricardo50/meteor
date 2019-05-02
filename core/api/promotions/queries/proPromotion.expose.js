import { Match } from 'meteor/check';
import intersectDeep from 'meteor/cultofcoders:grapher/lib/query/lib/intersectDeep';

import SecurityService from '../../security';
import { proPromotion } from '../../fragments';
import { makePromotionLotAnonymizer } from '../server/promotionServerHelpers';
import PromotionService from '../server/PromotionService';
import query from './proPromotion';

query.expose({
  firewall(userId, params) {
    const { _id: promotionId } = params;
    params.userId = userId;
    SecurityService.checkUserIsPro(userId);
    SecurityService.promotions.isAllowedToView({
      promotionId,
      userId,
    });
  },
  validateParams: {
    _id: String,
    userId: String,
    $body: Match.Maybe(Object),
  },
});

query.resolve(({ userId, _id, $body }) => {
  let fragment = proPromotion();

  if ($body) {
    fragment = intersectDeep(proPromotion(), $body);
  }

  const promotion = PromotionService.fetchOne({
    $filters: { _id },
    ...fragment,
  });

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return [promotion];
  } catch (error) {
    const { promotionLots = [], ...rest } = promotion;
    return [
      {
        promotionLots: promotionLots.map(makePromotionLotAnonymizer({ userId })),
        ...rest,
      },
    ];
  }
});
