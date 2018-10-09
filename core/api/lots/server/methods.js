import SecurityService from '../../security';
import LotService from '../LotService';
import PromotionService from '../../promotions/PromotionService';

import { lotInsert, lotUpdate } from '../methodDefinitions';

lotInsert.setHandler(({ userId }, { promotionId, lot }) => {
  SecurityService.checkUserIsPro(userId);
  const lotId = LotService.insert({ lot });
  PromotionService.update({
    promotionId,
    object: { lotLinks: [{ _id: lotId }] },
    operator: '$push',
  });
  return lotId;
});

lotUpdate.setHandler(({ userId }, { lotId, object }) => {
  SecurityService.checkUserIsPro(userId);
  return LotService.update({ lotId, object });
});
