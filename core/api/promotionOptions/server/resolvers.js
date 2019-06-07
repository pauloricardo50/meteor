import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { proPromotionOption } from '../../fragments';
import SecurityService from '../../security';
import PromotionOptionService from './PromotionOptionService';

export const proPromotionOptionsResolver = ({ userId, promotionOptionIds }) => {
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
};
