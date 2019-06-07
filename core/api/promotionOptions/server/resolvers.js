import PromotionOptionService from './PromotionOptionService';
import { proPromotionOption } from '../../fragments';
import SecurityService from '../../security';
import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';

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
