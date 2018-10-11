import SecurityService from '../../security';
import LotService from '../LotService';
import PromotionService from '../../promotions/PromotionService';

import { lotInsert, lotUpdate } from '../methodDefinitions';

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

lotUpdate.setHandler(({ userId }, { lotId, object }) => {
  SecurityService.checkUserIsPro(userId);
  return LotService.update({ lotId, object });
});
