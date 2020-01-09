import {
  adminPromotions as adminPromotionsFragment,
  proPromotion,
  searchPromotions,
} from '../fragments';
import { PROMOTION_QUERIES } from './promotionConstants';
import Promotions from '.';

export const adminPromotions = Promotions.createQuery(
  PROMOTION_QUERIES.ADMIN_PROMOTIONS,
  { ...adminPromotionsFragment(), $options: { sort: { name: 1 } } },
);

export const appPromotion = Promotions.createQuery(
  PROMOTION_QUERIES.APP_PROMOTION,
  proPromotion({ withFilteredLoan: true }),
);

export const promotionSearch = Promotions.createQuery(
  PROMOTION_QUERIES.PROMOTION_SEARCH,
  {
    ...searchPromotions(),
    $options: { sort: { createdAt: -1 }, limit: 5 },
  },
);

export const proPromotions = Promotions.createQuery(
  PROMOTION_QUERIES.PRO_PROMOTIONS,
  proPromotion(),
);

export const proPromotionUsers = Promotions.createQuery(
  PROMOTION_QUERIES.PRO_PROMOTION_USERS,
  {
    users: {
      name: 1,
      organisations: { name: 1, users: { _id: 1 } },
    },
  },
);
