import SecurityService from '../../security';
import query from './userLoan';

query.expose({
  firewall: () => SecurityService.checkLoggedIn(),
});
