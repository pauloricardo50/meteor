import { Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import OrganisationService from 'core/api/organisations/server/OrganisationService';
import { formatLoanWithDocuments } from '../../../utils/loanFunctions';
import UserService from '../../users/server/UserService';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';

import {
  adminLoans,
  anonymousLoan,
  fullLoan,
  loanSearch,
  proLoans2,
  proLoansAggregate,
  proPromotionLoans,
  proPropertyLoans,
  proReferredByLoans,
  userLoans,
} from '../queries';
import { LOAN_STATUS } from '../loanConstants';
import {
  proPromotionLoansResolver,
  proPropertyLoansResolver,
  proReferredByLoansResolver,
} from './resolvers';

exposeQuery({
  query: adminLoans,
  overrides: {
    embody: (body, params) => {
      body.$filter = ({
        filters,
        params: {
          _id,
          assignedEmployeeId,
          category,
          hasPromotion,
          noPromotion,
          lenderId,
          name,
          owned,
          promotionId,
          relevantOnly,
          status,
          step,
        },
      }) => {
        if (_id) {
          filters._id = _id;
        }

        if (name) {
          filters.name = name;
        }

        if (owned) {
          filters.userId = { $exists: true };
        }

        if (assignedEmployeeId) {
          filters['userCache.assignedEmployeeCache._id'] = assignedEmployeeId;
        }

        if (relevantOnly) {
          filters.status = {
            $nin: [LOAN_STATUS.TEST, LOAN_STATUS.UNSUCCESSFUL],
          };
          filters.anonymous = { $ne: true };
        }

        if (step) {
          filters.step = step;
        }

        if (category) {
          filters.category = category;
        }

        if (status) {
          filters.status = status;
        }

        if (hasPromotion) {
          filters.$or = [
            { 'promotionLinks.0._id': { $exists: true } },
            { 'financedPromotionLink._id': { $exists: true } },
          ];
        }

        if (promotionId) {
          filters.$or = [
            { 'promotionLinks.0._id': promotionId },
            { 'financedPromotionLink._id': promotionId },
          ];
        }

        if (noPromotion) {
          filters['promotionLinks.0._id'] = { $exists: false };
        }

        if (lenderId) {
          filters.lendersCache = {
            $elemMatch: { 'organisationLink._id': lenderId },
          };
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      assignedEmployeeId: Match.Maybe(Match.OneOf(Object, String)),
      category: Match.Maybe(Match.OneOf(Object, String)),
      hasPromotion: Match.Maybe(Boolean),
      lenderId: Match.Maybe(Match.OneOf(Object, String)),
      name: Match.Maybe(String),
      noPromotion: Match.Maybe(Boolean),
      owned: Match.Maybe(Boolean),
      promotionId: Match.Maybe(Match.OneOf(Object, String)),
      relevantOnly: Match.Maybe(Boolean),
      status: Match.Maybe(Match.OneOf(Object, String)),
      step: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
});

exposeQuery({
  query: anonymousLoan,
  overrides: {
    firewall(userId, params) {
      SecurityService.loans.checkAnonymousLoan(params._id);
    },
    validateParams: { _id: String },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: fullLoan,
  overrides: {
    embody: (body) => {
      body.$postFilter = (loans = []) => loans.map(formatLoanWithDocuments);
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: loanSearch,
  overrides: {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['name', '_id', 'customName'], searchQuery),
        );
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});

exposeQuery({
  query: proPromotionLoans,
  overrides: {
    firewall(userId, params) {
      const { promotionId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      SecurityService.promotions.isAllowedToView({ userId, promotionId });
    },
    validateParams: { promotionId: String, userId: String },
  },
  resolver: ({ userId, promotionId }) =>
    proPromotionLoansResolver({ calledByUserId: userId, promotionId }),
});

exposeQuery({
  query: proPropertyLoans,
  overrides: {
    firewall(userId, params) {
      const { propertyId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      SecurityService.properties.isAllowedToView({ propertyId, userId });
    },
    validateParams: { propertyId: String, userId: String },
  },
  resolver: ({ userId, propertyId }) =>
    proPropertyLoansResolver({ calledByUserId: userId, propertyId }),
});

exposeQuery({
  query: proReferredByLoans,
  overrides: {
    firewall(userId, params) {
      const { userId: providedUserId } = params;
      SecurityService.checkUserIsPro(userId);
      if (SecurityService.isUserAdmin(userId)) {
        params.userId = providedUserId;
      } else {
        params.userId = userId;
      }
      params.calledByUserId = userId;
    },
    validateParams: { userId: String, calledByUserId: String },
  },
  resolver: proReferredByLoansResolver,
});

exposeQuery({
  query: proLoansAggregate,
  overrides: {
    firewall(userId, params) {
      let organisation;
      if (!SecurityService.isUserAdmin(userId)) {
        SecurityService.checkUserIsPro(userId);

        const { organisationId } = params;
        organisation = OrganisationService.fetchOne({
          $filters: { _id: organisationId, 'userLinks._id': userId },
          userLinks: 1,
        });

        if (!organisation) {
          SecurityService.handleUnauthorized('Not allowed to access this organisation');
        }
      }

      params.userIds = organisation.userLinks
        .filter(({ isMain }) => isMain)
        .map(({ _id }) => _id);
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { organisationId, userIds } }) => {
        filters.$or = [
          { 'userCache.referredByOrganisationLink': organisationId },
          { referralId: { $in: userIds } },
        ];
      };
    },
    validateParams: { organisationId: String, userIds: Match.Maybe([String]) },
  },
});

exposeQuery({
  query: userLoans,
  overrides: {
    firewall(userId, params) {
      if (params.userId) {
        SecurityService.checkUserIsAdmin(userId);
      } else {
        params.userId = userId;

        if (!userId) {
          SecurityService.loans.checkAnonymousLoan(params.loanId);
        }
      }
    },
    embody: (body, embodyParams) => {
      body.$filter = ({ filters, params }) => {
        filters.userId = params.userId;
        if (params.loanId) {
          filters._id = params.loanId;
        }
      };

      if (!embodyParams.userId) {
        body.maxPropertyValue = 0;
      }
    },
    validateParams: {
      loanId: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
  },
});

exposeQuery({
  query: proLoans2,
  overrides: {
    firewall(userId, params) {
      if (params.userId) {
        SecurityService.checkUserIsAdmin(userId);
        params._userId = params.userId;
      } else {
        SecurityService.checkUserIsPro(userId);
      }
    },
    embody: (body) => {
      body.$filter = ({
        filters,
        params: {
          _userId,
          status,
          anonymous,
          referredByMe,
          referredByMyOrganisation,
        },
      }) => {
        if (status) {
          filters.status = status;
        }

        if (anonymous) {
          filters.anonymous = anonymous;
        }

        if (!!referredByMe === !!referredByMyOrganisation) {
          throw new Meteor.Error('You have to pick exactly one of "referredByMe" or "referredByMyOrganisation"');
        }

        let referralMatchers = [];

        if (referredByMe) {
          referralMatchers = [
            { 'userCache.referredByUserLink': _userId },
            { referralId: _userId },
          ];
        }

        if (referredByMyOrganisation) {
          const {
            organisation: mainOrg,
            users,
          } = UserService.getMainUsersOfOrg({ userId: _userId });
          if (!mainOrg) {
            throw new Meteor.Error('You do not have a main org');
          }
          const { _id: orgId } = mainOrg;
          const includeUserIds = users
            .filter(({ $metadata }) => $metadata.shareCustomers)
            .map(({ _id }) => _id);
          const excludeUserIds = users
            .filter(({ $metadata }) => !$metadata.shareCustomers)
            .map(({ _id }) => _id);

          referralMatchers = [
            { 'userCache.referredByUserLink': { $in: includeUserIds } },
            { 'userCache.referredByOrganisationLink': orgId },
            { referralId: { $in: [orgId, ...includeUserIds] } },
          ];
          filters['userCache.referredByUserLink'] = { $nin: excludeUserIds };
          filters.referralId = { $nin: excludeUserIds };
        }

        filters.$or = referralMatchers;
      };
    },
    validateParams: {
      anonymous: Match.Maybe(Match.OneOf(Boolean, Object)),
      userId: Match.Maybe(String),
      referredByMe: Match.Maybe(Boolean),
      referredByMyOrganisation: Match.Maybe(Boolean),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
