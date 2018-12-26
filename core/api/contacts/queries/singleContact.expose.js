import SecurityService from '../../security';
import query from './singleContact';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsAdmin(userId);
  },
});
