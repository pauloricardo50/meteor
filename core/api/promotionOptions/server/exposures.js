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
      const { promotionLotId, promotionId } = params;
      params.userId = userId;
      SecurityService.checkUserIsPro(userId);

      if (promotionLotId) {
        SecurityService.promotions.hasAccessToPromotionLot({
          promotionLotId,
          userId,
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
        const { promotionLotId, status, promotionId, loanStatus } = params;

        if (status) {
          filters.status = status;
        }

        if (promotionId) {
          filters['promotionLink._id'] = promotionId;
        }

        if (promotionLotId) {
          filters.promotionLotLinks = {
            $elemMatch: { _id: promotionLotId },
          };
        }

        if (loanStatus) {
          filters['loanCache.status'] = loanStatus;
        }
      };

      body.$postFilter = (promotionOptions = [], params) => {
        const { anonymize = false, userId } = params;
        const currentUser = UserService.get(userId, {
          promotions: { _id: 1 },
          organisations: { users: { _id: 1 } },
        });
        return anonymize
          ? promotionOptions.map(makePromotionOptionAnonymizer({ currentUser }))
          : promotionOptions;
      };
    },
    validateParams: {
      promotionId: Match.Maybe(String),
      promotionLotId: Match.Maybe(String),
      userId: String,
      anonymize: Match.Maybe(Boolean),
      status: Match.Maybe(Match.OneOf(String, Object)),
      loanStatus: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
