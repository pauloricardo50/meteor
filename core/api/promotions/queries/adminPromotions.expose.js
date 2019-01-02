import SecurityService from '../../security';
import query from './adminPromotions';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {},
});
