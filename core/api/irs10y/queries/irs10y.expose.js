import SecurityService from '../../security';
import query from './irs10y';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {},
});
