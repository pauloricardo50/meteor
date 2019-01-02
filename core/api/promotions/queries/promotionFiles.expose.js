import Security from '../../security';
import query from './promotionFiles';

query.expose({
  firewall(userId, { promotionId }) {
    // TODO:
  },
  validateParams: { promotionId: String },
});
