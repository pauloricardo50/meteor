import { Match } from 'meteor/check';
import intersectDeep from 'meteor/cultofcoders:grapher/lib/query/lib/intersectDeep';

import { exposeQuery } from '../../queries/queryHelpers';
import {
  adminPromotions,
  appPromotion,
  promotionSearch,
  proPromotions,
  proPromotionUsers,
} from '../queries';
import SecurityService from '../../security';
import { PROMOTION_STATUS } from '../promotionConstants';
import PromotionService from './PromotionService';
import { makePromotionLotAnonymizer } from './promotionServerHelpers';
import {
  proPromotion,
  proPromotions as proPromotionsFragment,
} from '../../fragments';

exposeQuery(adminPromotions, {}, { allowFilterById: true });

exposeQuery(
  appPromotion,
  {
    firewall(userId, { promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
    embody: (body) => {
      body.$filter = ({ filters, params }) => {
        filters._id = params.promotionId;
        filters.status = PROMOTION_STATUS.OPEN;
      };
    },
    validateParams: { promotionId: String, loanId: String },
  },
  {},
);

exposeQuery(
  promotionSearch,
  {
    validateParams: { searchQuery: Match.Maybe(String) },
  },
  {},
);

exposeQuery(
  proPromotions,
  {
    firewall(userId, params) {
      SecurityService.checkUserIsPro(userId);
      const { _id: promotionId } = params;
      params.userId = userId;

      if (promotionId) {
        SecurityService.promotions.isAllowedToView({
          promotionId,
          userId,
        });
      }
    },
    validateParams: { userId: String, simple: Match.Maybe(Boolean) },
  },
  { allowFilterById: true },
);

proPromotions.resolve(({ userId, _id, simple, $body }) => {
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
});

exposeQuery(
  proPromotionUsers,
  {
    firewall(userId, { _id: promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
  },
  { allowFilterById: true },
);
