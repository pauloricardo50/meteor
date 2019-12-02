import { Match } from 'meteor/check';

import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionOption, proPromotionOptions } from '../queries';
import UserService from '../../users/server/UserService';

exposeQuery({
  query: appPromotionOption,
  overrides: {
    firewall(userId, { promotionOptionId }) {
      SecurityService.promotions.hasAccessToPromotionOption({
        promotionOptionId,
        userId,
      });
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
      const { promotionOptionIds } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);
      promotionOptionIds.forEach(promotionOptionId => {
        SecurityService.promotions.isAllowedToViewPromotionOption({
          promotionOptionId,
          userId,
        });
      });
      if (!SecurityService.isUserAdmin(userId)) {
        params.anonymize = true;
      }
    },
    embody: (body, embodyParams) => {
      body.$filter = ({ filters, params }) => {
        const { promotionOptionIds = [] } = params;
        filters._id = { $in: promotionOptionIds };
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
      promotionOptionIds: [String],
      userId: String,
      anonymize: Match.Maybe(Boolean),
    },
  },
});
