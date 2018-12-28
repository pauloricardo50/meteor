import { SecurityService } from '../..';
import query from './adminOrganisation';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
