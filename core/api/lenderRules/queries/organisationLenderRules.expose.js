import SecurityService from '../../security';
import { exposeQuery } from '../../queries/queryHelpers';
import query from './organisationLenderRules';

exposeQuery(
  query,
  {
    firewall() {
      SecurityService.checkLoggedIn();
    },
    embody: (query, params) => {
      body.$filter = ({ filters, params: { organisationId } }) => {
        filters['organisationLink._id'] = organisationId;
      };
    },
    validateParams: { organisationId: String },
  },
  { allowFilterById: true },
);
