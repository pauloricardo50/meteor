import SecurityService from '../../security';
import query from './interestRates';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {},
});
