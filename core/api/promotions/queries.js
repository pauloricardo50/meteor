import Promotions from '.';
import { PROMOTION_QUERIES } from './promotionConstants';
import {
  adminPromotions as adminPromotionsFragment,
  proPromotion,
  searchPromotions,
} from '../fragments';

import { createSearchFilters } from '../helpers/mongoHelpers';

export const adminPromotions = Promotions.createQuery(
  PROMOTION_QUERIES.ADMIN_PROMOTIONS,
  adminPromotionsFragment(),
);

export const appPromotion = Promotions.createQuery(
  PROMOTION_QUERIES.APP_PROMOTION,
  proPromotion({ withFilteredLoan: true }),
);

export const promotionSearch = Promotions.createQuery(
  PROMOTION_QUERIES.PROMOTION_SEARCH,
  {
    $filter({ filters, params: { searchQuery } }) {
      Object.assign(filters, createSearchFilters(['name', '_id'], searchQuery));
    },
    ...searchPromotions(),
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);

export const proPromotions = Promotions.createQuery(
  PROMOTION_QUERIES.PRO_PROMOTIONS,
  () => {},
);

export const proPromotionUsers = Promotions.createQuery(
  PROMOTION_QUERIES.PRO_PROMOTION_USERS,
  {
    $filter({ filters, params: { promotionId } }) {
      filters._id = promotionId;
    },
    $postFilter(promotion = []) {
      const { users = [] } = (!!promotion.length && promotion[0]) || {};
      return users;
    },
    users: {
      name: 1,
      organisations: { name: 1, users: { _id: 1 } },
    },
  },
);
