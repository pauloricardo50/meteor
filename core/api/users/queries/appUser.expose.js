import SecurityService from '../../security';
import query from './appUser';

query.expose({
  firewall: () => SecurityService.checkLoggedIn(),
});
