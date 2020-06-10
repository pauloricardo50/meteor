import { Meteor } from 'meteor/meteor';
import { Match } from 'meteor/check';

import { createSearchFilters } from '../../helpers/mongoHelpers';
import { makeLoanAnonymizer as makePromotionLoanAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import {
  anonymousLoan,
  loanSearch,
  proLoans2,
  proLoansAggregate,
  proPromotionLoans,
  proPropertyLoans,
  userLoans,
} from '../queries';
import { getProLoanFilters } from './exposureHelpers';
import { proPropertyLoansResolver } from './resolvers';

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
  query: loanSearch,
  overrides: {
    firewall(userId) {
      SecurityService.checkUserIsAdmin(userId);
    },
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery, userId } }) => {
        const search = createSearchFilters(
          ['name', '_id', 'customName'],
          searchQuery,
        );

        if (userId) {
          filters.$and = [search, { userId }];
        } else {
          Object.assign(filters, search);
        }
      };
    },
    validateParams: {
      searchQuery: Match.Maybe(String),
      userId: Match.Maybe(String),
    },
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
    embody: body => {
      body.$filter = ({
        filters,
        params: { promotionId, status, invitedBy },
      }) => {
        if (promotionId) {
          filters['promotionLinks._id'] = promotionId;
        }

        if (status) {
          filters.status = status;
        }

        if (invitedBy) {
          filters['promotionLinks.invitedBy'] = invitedBy;
        }
      };

      body.$postFilter = (loans, { userId }) => {
        try {
          SecurityService.checkUserIsAdmin(userId);
          return loans;
        } catch (error) {
          const currentUser = UserService.get(userId, {
            promotions: { _id: 1 },
            organisations: { users: { _id: 1 } },
          });

          const promotionLoanAnonymizer = makePromotionLoanAnonymizer({
            currentUser,
          });

          return loans.map(loan => promotionLoanAnonymizer(loan));
        }
      };
    },
    validateParams: {
      promotionId: String,
      userId: String,
      status: Match.Maybe(Match.OneOf(Object, String)),
      invitedBy: Match.Maybe(Match.OneOf(Object, String)),
    },
  },
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
    validateParams: {
      propertyId: String,
      userId: String,
      anonymous: Match.Maybe(Object),
    },
  },
  resolver: ({ userId, ...params }) =>
    proPropertyLoansResolver({ calledByUserId: userId, ...params }),
});

exposeQuery({
  query: proLoansAggregate,
  overrides: {
    firewall(userId, { referredByUserId }) {
      SecurityService.checkUserIsPro(userId);

      if (
        referredByUserId &&
        referredByUserId !== 'nobody' &&
        referredByUserId !== 'referral'
      ) {
        const org = UserService.getUserMainOrganisation(userId, {
          userLinks: 1,
        });
        if (!org.userLinks.find(({ _id }) => _id === userId)) {
          SecurityService.handleUnauthorized('Not allowed');
        }
      }
    },
    embody: body => {
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
          if (referredByUserId === 'referral') {
            forceReferralFilter = [
              { 'userCache.referredByUserLink': { $exists: true, $ne: '' } },
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
    embody: body => {
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
          throw new Meteor.Error(
            'You have to pick exactly one of "referredByMe" or "referredByMyOrganisation"',
          );
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
