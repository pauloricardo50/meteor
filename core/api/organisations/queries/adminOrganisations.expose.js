import { SecurityService } from '../..';
import query from './adminOrganisations';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
});
