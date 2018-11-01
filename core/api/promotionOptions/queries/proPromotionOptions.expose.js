import SecurityService from '../../security';
import query from './proPromotionOptions';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsPro(userId);
  },
});
