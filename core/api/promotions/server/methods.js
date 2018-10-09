import SecurityService from '../../security';
import PromotionService from '../PromotionService';

import { promotionInsert } from '../methodDefinitions';

promotionInsert.setHandler(({ userId }, { promotion }) => {
  SecurityService.checkUserIsPro(userId);
  return PromotionService.insert({ promotion, userId });
});
