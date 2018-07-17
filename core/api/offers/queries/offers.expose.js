import SecurityService from '../../security';
import query from './offers';

query.expose({
  firewall(userId) {
    console.log('userId offers firewall', userId);

    SecurityService.checkLoggedIn();
  },
});
