import SecurityService from '../../security';
import query from './appPromotion';

query.expose({
  firewall(userId) {
    // SecurityService.checkUserIsPro(userId);
  },
});
