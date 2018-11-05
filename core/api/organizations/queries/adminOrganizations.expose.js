import { SecurityService } from '../..';
import query from './adminOrganizations';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
