import SecurityService from '../../security';
import query from './organisationFiles';

query.expose({
  firewall: () => SecurityService.checkCurrentUserIsAdmin(),
  validateParams: { organisationId: String },
});
