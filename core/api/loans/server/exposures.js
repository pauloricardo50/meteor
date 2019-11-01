import { Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';

import { formatLoanWithDocuments } from '../../../utils/loanFunctions';
import { createSearchFilters } from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
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
import { getProLoanFilters } from './exposureHelpers';

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
    firewall(userId, { referredByUserId }) {
      SecurityService.checkUserIsPro(userId);

      if (referredByUserId && referredByUserId !== 'nobody') {
        const org = UserService.getUserMainOrganisation(userId);
        if (!org.userLinks.find(({ _id }) => _id === userId)) {
          SecurityService.handleUnauthorized('Not allowed');
        }
      }
    },
    embody: (body) => {
      body.$filter = ({
        filters,
        params: { _userId, anonymous, referredByUserId },
      }) => {
        if (anonymous) {
          filters.anonymous = anonymous;
        }

        getProLoanFilters({
          filters,
          userId: _userId,
          referredByMyOrganisation: true,
        });

        if (referredByUserId) {
          let forceReferralFilter = [
            { 'userCache.referredByUserLink': referredByUserId },
            { referralId: referredByUserId },
          ];
          if (referredByUserId === 'nobody') {
            forceReferralFilter = [
              { 'userCache.referredByUserLink': { $in: [false, null] } },
            ];
          }
          filters.$and = [{ $or: filters.$or }, { $or: forceReferralFilter }];
          delete filters.$or;
        }
      };
    },
    validateParams: {
      referredByUserId: Match.Maybe(String),
      anonymous: Match.Maybe(Match.OneOf(Boolean, Object)),
    },
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

        getProLoanFilters({
          filters,
          userId: _userId,
          referredByMe,
          referredByMyOrganisation,
        });
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
