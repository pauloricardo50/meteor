import SecurityService from '../../security';
import PromotionService from '../PromotionService';

import {
  promotionInsert,
  promotionUpdate,
  promotionRemove,
} from '../methodDefinitions';

promotionInsert.setHandler(({ userId }, { promotion }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insert({ promotion, userId });
});

promotionUpdate.setHandler(({ userId }, { promotionId, object }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.update({ promotionId, object });
});

promotionRemove.setHandler(({ userId }, { promotionId }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.remove(promotionId);
});
