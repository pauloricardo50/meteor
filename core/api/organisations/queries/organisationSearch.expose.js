import { Match } from 'meteor/check';

import SecurityService from '../../security';
import query from './organisationSearch';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
  validateParams: { searchQuery: Match.Maybe(String) },
});
