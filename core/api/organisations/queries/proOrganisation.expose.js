import SecurityService from '../../security';
import query from './proOrganisation';

query.expose({
  firewall: (userId) => {
    SecurityService.checkUserIsPro(userId);
  },
  validateParams: { organisationId: String },
});
