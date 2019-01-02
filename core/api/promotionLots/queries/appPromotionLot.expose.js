import SecurityService from '../../security';
import query from './appPromotionLot';

query.expose({
  firewall(userId) {
    // TODO: Check promotion permissions
  },
  validateParams: { promotionLotId: String },
});
