import SecurityService from '../../security';
import query from './promotionLotFiles';

query.expose({
  firewall(userId) {
    // TODO:
  },
  validateParams: { promotionLotId: String },
});
