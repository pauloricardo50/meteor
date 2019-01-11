import SecurityService from '../../security';
import query from './adminOrganisation';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
  validateParams: { organisationId: String },
});
