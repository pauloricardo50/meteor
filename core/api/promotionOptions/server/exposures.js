import { Match } from 'meteor/check';

import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionOption, proPromotionOptions } from '../queries';
import UserService from '../../users/server/UserService';

exposeQuery({
  query: appPromotionOption,
  overrides: {
    firewall(userId, { promotionOptionId, promotionId }) {
      SecurityService.promotions.hasAccessToPromotionOption({
        promotionOptionId,
        userId,
      });

      if (promotionId) {
        SecurityService.promotions.hasAccessToPromotion({
          promotionId,
          userId,
        });
      }
    },
    embody: body => {
      body.$filter = ({ filters, params: { promotionOptionId } }) => {
        filters._id = promotionOptionId;
      };
    },
    validateParams: { promotionOptionId: String },
  },
});

exposeQuery({
  query: proPromotionOptions,
  overrides: {
    firewall(userId, params) {
      const { promotionOptionIds, promotionId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);

      if (promotionOptionIds) {
        promotionOptionIds.forEach(promotionOptionId => {
          SecurityService.promotions.isAllowedToViewPromotionOption({
            promotionOptionId,
            userId,
          });
        });
      }

      if (promotionId) {
        SecurityService.promotions.hasAccessToPromotion({
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
        const { promotionOptionIds, status, promotionId } = params;

        if (promotionOptionIds) {
          filters._id = { $in: promotionOptionIds };
        }

        if (status) {
          filters.status = status;
        }

        if (promotionId) {
          filters['promotionLink._id'] = promotionId;
        }
      };

      body.$postFilter = (promotionOptions = [], params) => {
        const { anonymize = false, userId } = params;
        const currentUser = UserService.fetchOne({
          $filters: { _id: userId },
          promotions: { _id: 1 },
          organisations: { users: { _id: 1 } },
        });
        return anonymize
          ? promotionOptions.map(
            makePromotionOptionAnonymizer({ currentUser }),
          )
          : promotionOptions;
      };
    },
    validateParams: {
      promotionId: Match.Maybe(String),
      promotionOptionIds: Match.Maybe([String]),
      userId: String,
      anonymize: Match.Maybe(Boolean),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
