import { Match } from 'meteor/check';
import SecurityService from '../../security';
import query from './adminOrganisations';

query.expose({
  firewall: () => {
    SecurityService.checkCurrentUserIsAdmin();
  },
  validateParams: {
    features: Match.Maybe(Match.OneOf(String, [String])),
    tags: Match.Maybe(Match.OneOf(String, [String])),
    type: Match.Maybe(Match.OneOf(String, [String])),
    name: Match.Maybe(String),
  },
});
