import PromotionService from '../../promotions/server/PromotionService';
import SecurityService from '../../security';
import { lotInsert, lotRemove, lotUpdate } from '../methodDefinitions';
import LotService from './LotService';

lotInsert.setHandler(({ userId }, { promotionId, lot }) => {
  SecurityService.promotions.isAllowedToAddLots({ promotionId, userId });
  const lotId = LotService.insert(lot);
  PromotionService.addLink({
    id: promotionId,
    linkName: 'lots',
    linkId: lotId,
  });
  return lotId;
});

lotUpdate.setHandler(({ userId }, params) => {
  const { lotId } = params;
  SecurityService.promotions.isAllowedToModifyAdditionalLot({ lotId, userId });
  return LotService.update(params);
});

lotRemove.setHandler(({ userId }, { lotId }) => {
  SecurityService.promotions.isAllowedToRemoveAdditionalLot({ lotId, userId });
  return LotService.remove(lotId);
});
