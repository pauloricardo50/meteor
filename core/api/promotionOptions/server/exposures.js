import SecurityService from '../../security';
import { appPromotionOption, proPromotionOptions } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';
import { proPromotionOption } from '../../fragments';
import PromotionOptionService from './PromotionOptionService';
import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';

exposeQuery(
  appPromotionOption,
  {
    firewall(userId, { promotionOptionId }) {
      SecurityService.promotions.hasAccessToPromotionOption({
        promotionOptionId,
        userId,
      });
    },
    validateParams: { promotionOptionId: String },
  },
  {},
);

exposeQuery(
  proPromotionOptions,
  {
    firewall(userId, params) {
      const { promotionOptionIds } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      promotionOptionIds.forEach((promotionOptionId) => {
        SecurityService.promotions.isAllowedToViewPromotionOption({
          promotionOptionId,
          userId,
        });
      });
    },
    validateParams: { promotionOptionIds: [String], userId: String },
  },
  {},
);

proPromotionOptions.resolve(({ userId, promotionOptionIds }) => {
  const promotionOptions = PromotionOptionService.fetch({
    $filters: { _id: { $in: promotionOptionIds } },
    ...proPromotionOption(),
  }) || [];

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return promotionOptions;
  } catch (error) {
    return promotionOptions.map(makePromotionOptionAnonymizer({ userId }));
  }
});
