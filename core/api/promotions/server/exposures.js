import { Roles } from 'meteor/alanning:roles';
import { Match } from 'meteor/check';

import { createSearchFilters } from '../../helpers/mongoHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { PROMOTION_STATUS } from '../promotionConstants';
import {
  appPromotion,
  proPromotionUsers,
  proPromotions,
  promotionSearch,
  promotionsList,
} from '../queries';
import { makePromotionLotAnonymizer } from './promotionServerHelpers';

exposeQuery({
  query: appPromotion,
  overrides: {
    firewall(userId, { promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
    embody: body => {
      body.$filter = ({ filters, params }) => {
        filters._id = params.promotionId;
        filters.status = PROMOTION_STATUS.OPEN;
      };
    },
    validateParams: { promotionId: String, loanId: String },
  },
});

exposeQuery({
  query: promotionSearch,
  overrides: {
    embody: body => {
      body.$filter = ({ filters, params: { searchQuery } }) => {
        Object.assign(
          filters,
          createSearchFilters(['name', '_id'], searchQuery),
        );
      };
    },
    validateParams: { searchQuery: Match.Maybe(String) },
  },
});

exposeQuery({
  query: proPromotions,
  overrides: {
    firewall(userId, params) {
      SecurityService.checkUserIsPro(userId);
      const { _id: promotionId } = params;
      params.userId = userId;

      if (promotionId) {
        SecurityService.promotions.isAllowedToView({
          promotionId,
          userId,
        });
      }

      if (!SecurityService.isUserAdmin(userId)) {
        params.anonymize = true;
      }
    },
    embody: (body, embodyParams) => {
      body.$filter = ({ filters, params }) => {
        const { _id: promotionId, userId } = params;
        if (promotionId) {
          filters._id = promotionId;
        } else {
          filters['userLinks._id'] = userId;
        }
      };

      body.$postFilter = (promotions = [], params) => {
        const { anonymize = false, userId } = params;

        const currentUser = UserService.get(userId, {
          promotions: { _id: 1 },
          organisations: { users: { _id: 1 } },
          roles: 1,
        });

        const isAdmin =
          currentUser &&
          (Roles.userIsInRole(currentUser, ROLES.ADMIN) ||
            Roles.userIsInRole(ROLES.DEV));

        const promotionsWithFilteredNotes = isAdmin
          ? promotions
          : promotions.map(({ promotionLoan, ...promotion }) => {
              if (!promotionLoan) {
                return promotion;
              }

              const { adminNotes, ...rest } = promotionLoan;

              return {
                promotionLoan: { ...rest },
                ...promotion,
              };
            });

        if (!anonymize) {
          return promotionsWithFilteredNotes;
        }

        const promotionLotAnonymizer = makePromotionLotAnonymizer({
          currentUser,
        });

        return promotionsWithFilteredNotes.map(promotion => {
          const { promotionLots = [], ...rest } = promotion;
          return {
            promotionLots: promotionLots.map(promotionLotAnonymizer),
            ...rest,
          };
        });
      };
    },
    validateParams: {
      userId: String,
      anonymize: Match.Maybe(Boolean),
      _id: Match.Maybe(String),
    },
  },
});

exposeQuery({
  query: proPromotionUsers,
  overrides: {
    firewall(userId, { _id: promotionId }) {
      SecurityService.promotions.hasAccessToPromotion({ promotionId, userId });
    },
    embody: body => {
      body.$filter = ({ filters, params: { promotionId } }) => {
        filters._id = promotionId;
      };
      body.$postFilter = (promotion = []) => {
        const { users = [] } = (!!promotion.length && promotion[0]) || {};
        return users;
      };
    },
  },
  options: { allowFilterById: true },
});

exposeQuery({
  query: promotionsList,
  overrides: {
    firewall() {},
    embody: body => {
      body.$filter = ({ filters, params }) => {
        filters.isTest = { $ne: true };
        filters.status = {
          $in: [PROMOTION_STATUS.OPEN, PROMOTION_STATUS.FINISHED],
        };
        if (params.canton) {
          filters.canton = { $in: params.canton };
        }
      };
      body.$options = { sort: { name: 1 } };
    },
    validateParams: { canton: Match.Maybe(Array) },
  },
});
