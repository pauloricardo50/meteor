import SecurityService from '../../security';
import { exposeQuery } from '../../queries/queryHelpers';
import { organisationLenderRules } from '../queries';

exposeQuery({
  query: organisationLenderRules,
  overrides: {
    firewall() {
      SecurityService.checkLoggedIn();
    },
    embody: (body, params) => {
      body.$filter = ({ filters, params: { organisationId } }) => {
        filters['organisationLink._id'] = organisationId;
      };
    },
    validateParams: { organisationId: String },
  },
  options: { allowFilterById: true },
});
