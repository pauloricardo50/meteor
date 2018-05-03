import SecurityService from '../../security';
import query from './userLoans';

query.expose({
  firewall(userId, params) {
    SecurityService.checkUserLoggedIn(userId);

    params.userId = userId;
  },
});
