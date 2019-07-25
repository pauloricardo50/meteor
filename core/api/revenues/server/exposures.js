import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminRevenues } from '../queries';

exposeQuery({
  query: adminRevenues,
  overrides: {
    embody: (body) => {
      body.$filter = ({
        filters,
        params: {
          _id,
          status,
          loanId,
          sourceOrganisationId,
          organisationId,
          commissionStatus,
        },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (status) {
          filters.status = status;
        }

        if (loanId) {
          filters['loanCache.0._id'] = loanId;
        }

        if (sourceOrganisationId) {
          filters['sourceOrganisationLink._id'] = sourceOrganisationId;
        }

        if (organisationId) {
          if (commissionStatus) {
            filters.organisationLinks = {
              $elemMatch: { _id: organisationId, status: commissionStatus },
            };
          } else {
            filters.organisationLinks = {
              $elemMatch: { _id: organisationId },
            };
          }
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      loanId: Match.Maybe(String),
      sourceOrganisationId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(Object, String)),
      commissionStatus: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
});
