import SecurityService from '../../security';
import query from './proPromotionLot';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsPro(userId);
  },
});
