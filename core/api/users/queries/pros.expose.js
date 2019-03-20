import SecurityService from '../../security';
import query from './pros';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
  validateParams: {},
});
