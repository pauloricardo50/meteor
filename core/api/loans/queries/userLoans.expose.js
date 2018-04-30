import SecurityService from '../../security';
import query from './userLoans';

query.expose({
  firewall(userId, params) {
    params.userId = userId;
  },
});
