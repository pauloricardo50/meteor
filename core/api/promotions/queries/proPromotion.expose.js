import SecurityService from '../../security';
import query from './proPromotion';

query.expose({
  firewall(userId) {
    // SecurityService.checkUserIsPro(userId);
  },
});
