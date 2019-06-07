import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import SecurityService from '../../security';
import {
  adminPromotions,
  appPromotion,
  promotionSearch,
  proPromotions,
  proPromotionUsers,
} from '../queries';
import { PROMOTION_STATUS } from '../promotionConstants';

import { proPromotionsResolver } from './resolvers';

exposeQuery({ query: adminPromotions, options: { allowFilterById: true } });

exposeQuery({
  query: appPromotion,
  overrides: {
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
});

exposeQuery({
  query: promotionSearch,
  overrides: {
    embody: (body) => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['name', '_id'], searchQuery),
        );
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});

exposeQuery({
  query: proPromotions,
  overrides: {
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
  options: { allowFilterById: true },
  resolver: proPromotionsResolver,
});

exposeQuery({
  query: proPromotionUsers,
  overrides: {
    firewall(userId, { _id: promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { promotionId } }) => {
        filters._id = promotionId;
      };
      body.$postFilter = (promotion = []) => {
        const { users = [] } = (!!promotion.length && promotion[0]) || {};
        return users;
      };
    },
  },
  options: { allowFilterById: true },
});
