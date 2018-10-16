import SecurityService from '../../security';
import LotService from '../LotService';
import PromotionService from '../../promotions/PromotionService';

import { lotInsert, lotUpdate, lotRemove } from '../methodDefinitions';

lotInsert.setHandler(({ userId }, { promotionId, lot }) => {
  SecurityService.checkUserIsPro(userId);
  const lotId = LotService.insert(lot);
  PromotionService.addLink({
    id: promotionId,
    linkName: 'lotLinks',
    linkId: lotId,
  });
  return lotId;
});

lotUpdate.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsPro(userId);
  return LotService.update(params);
});

lotRemove.setHandler(({ userId }, { lotId }) => {
  SecurityService.checkUserIsPro(userId);
  return LotService.removeLot(lotId);
});
