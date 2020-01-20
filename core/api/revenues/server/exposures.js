import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { adminRevenues } from '../queries';
import { REVENUE_STATUS } from '../revenueConstants';

exposeQuery({
  query: adminRevenues,
  overrides: {
    embody: body => {
      body.$filter = ({
        filters,
        params: {
          _id,
          commissionStatus,
          date,
          expectedAt,
          loanId,
          organisationId,
          sourceOrganisationId,
          status,
          type,
        },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (status) {
          filters.status = status;
        }

        if (type) {
          filters.type = type;
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

        if (date) {
          filters.$or = [
            { status: REVENUE_STATUS.EXPECTED, expectedAt: date },
            { status: REVENUE_STATUS.PAID, paidAt: date },
          ];
        }

        if (expectedAt) {
          filters.expectedAt = expectedAt;
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      commissionStatus: Match.Maybe(Match.OneOf(Object, String)),
      date: Match.Maybe(Match.OneOf(Object, Date)),
      expectedAt: Match.Maybe(Match.OneOf(Object, Date)),
      loanId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      sourceOrganisationId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(Object, String)),
      type: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
});
