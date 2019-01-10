import SecurityService from '../../security';
import PromotionService from '../../promotions/server/PromotionService';
import { lotInsert, lotUpdate, lotRemove } from '../methodDefinitions';
import LotService from './LotService';

lotInsert.setHandler(({ userId }, { promotionId, lot }) => {
  SecurityService.checkUserIsPro(userId);
  const lotId = LotService.insert(lot);
  PromotionService.addLink({
    id: promotionId,
    linkName: 'lots',
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
  return LotService.remove(lotId);
});
