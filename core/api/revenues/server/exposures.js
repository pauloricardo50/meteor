import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import { proRevenues } from '../queries';
import { REVENUE_STATUS } from '../revenueConstants';
import { getCommissionFilters } from '../revenueHelpers';

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
      params.mainOrganisationFragment = { _id: 1 };
    },
    embody: body => {
      body.$filter = ({
        filters,
        params: { organisationId, proCommissionStatus },
      }) => {
        const $or = getCommissionFilters(proCommissionStatus, organisationId);

        if ($or.length === 0) {
          throw new Meteor.Error('Invalid query');
        }

        filters.$or = $or;
      };

      body.$postFilter = (revenues = [], { mainOrganisationId }) =>
        revenues.map(revenue => {
          if (
            revenue.loan?.user?.referredByUser?.mainOrganisation?._id ===
            mainOrganisationId
          ) {
            return revenue;
          }

          // Filter out the referrer if he's not from the organisation
          return {
            ...revenue,
            loan: { ...revenue?.loan, user: { ...revenue?.loan?.user } },
          };
        });
    },
    validateParams: {
      organisationId: String,
      proCommissionStatus: Match.OneOf(String, [String]),
      mainOrganisationFragment: Object,
    },
  },
});
