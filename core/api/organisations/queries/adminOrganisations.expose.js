import { Match } from 'meteor/check';
import { SecurityService } from '../..';
import query from './adminOrganisations';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
  validateParams: { features: Match.Maybe(Match.OneOf(String, [String])) },
});
