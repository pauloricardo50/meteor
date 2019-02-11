import SecurityService from '../../security';
import query from './proPromotionOptions';
import PromotionOptionService from '../server/PromotionOptionService';
import { proPromotionOption } from '../../fragments';
import { handlePromotionOptionsAnonymization } from '../../promotions/server/promotionServerHelpers';

query.expose({
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
});

query.resolve(({ userId, promotionOptionIds }) => {
  const promotionOptions = PromotionOptionService.fetch({
    $filters: { _id: { $in: promotionOptionIds } },
    ...proPromotionOption(),
  });

  try {
    SecurityService.checkCurrentUserIsAdmin();
    return promotionOptions;
  } catch (error) {
    return handlePromotionOptionsAnonymization({ promotionOptions, userId });
  }
});
