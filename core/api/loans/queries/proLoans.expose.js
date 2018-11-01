import SecurityService from '../../security';
import query from './proLoans';

query.expose({
  firewall(userId) {
    SecurityService.checkUserIsPro(userId);
  },
});
