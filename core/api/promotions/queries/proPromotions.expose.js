import SecurityService from '../../security';
import query from './proPromotions';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsPro(userId);
  },
});
