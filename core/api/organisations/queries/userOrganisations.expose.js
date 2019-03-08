import { Match } from 'meteor/check';
import SecurityService from '../../security';
import query from './userOrganisations';

query.expose({
  firewall: (userId) => {
    SecurityService.checkUserLoggedIn(userId);
  },
  validateParams: {},
});
