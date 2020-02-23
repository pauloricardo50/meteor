import { Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { adminRevenues, proRevenues } from '../queries';
import { REVENUE_STATUS } from '../revenueConstants';
import UserService from '../../users/server/UserService';

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
          paidAt,
          sourceOrganisationId,
          status,
          type,
          filters: extraFilters,
          secondaryType,
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

        if (secondaryType) {
          filters.secondaryType = secondaryType;
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

        if (paidAt) {
          filters.paidAt = paidAt;
        }

        if (extraFilters) {
          Object.assign(filters, extraFilters);
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      commissionStatus: Match.Maybe(Match.OneOf(Object, String)),
      date: Match.Maybe(Match.OneOf(Object, Date)),
      expectedAt: Match.Maybe(Match.OneOf(Object, Date)),
      filters: Match.Maybe(Match.OneOf(Object)),
      loanId: Match.Maybe(String),
      organisationId: Match.Maybe(String),
      paidAt: Match.Maybe(Match.OneOf(Object, Date)),
      sourceOrganisationId: Match.Maybe(Match.OneOf(Object, String)),
      status: Match.Maybe(Match.OneOf(Object, String)),
      type: Match.Maybe(Match.OneOf(Object, String)),
      secondaryType: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
});

exposeQuery({
  query: proRevenues,
  overrides: {
    firewall(userId, params) {
      SecurityService.checkUserIsPro(userId);
      const { _id: mainOrganisationId } = UserService.getUserMainOrganisation(
        userId,
      );

      if (!mainOrganisationId) {
        throw new Meteor.Error('No mainOrganisationId found');
      }

      params.organisationId = mainOrganisationId;
    },
    embody: body => {
      body.$filter = ({ filters, params }) => {
        filters.organisationLinks = {
          $elemMatch: { _id: params.organisationId },
        };
      };
    },
    validateParams: {
      status: Match.Maybe(Match.OneOf(Object, String)),
      organisationId: String,
    },
  },
});
