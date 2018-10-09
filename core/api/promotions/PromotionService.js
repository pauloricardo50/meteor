import Promotions from './promotions';
import { PROMOTION_USER_PERMISSIONS } from './promotionConstants';

export class PromotionService {
  insert = ({ promotion = {}, userId }) =>
    Promotions.insert({
      ...promotion,
      userLinks: [
        {
          _id: userId,
          permissions: PROMOTION_USER_PERMISSIONS.MODIFY,
        },
      ],
    });

  update = ({ promotionId, object, operator = '$set' }) =>
    Promotions.update(promotionId, { [operator]: object });

  remove = ({ promotionId }) => Promotions.remove(promotionId);
}

export default new PromotionService();
