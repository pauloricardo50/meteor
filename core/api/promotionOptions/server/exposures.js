import { Match } from 'meteor/check';

import { makePromotionOptionAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionOption, proPromotionOptions } from '../queries';

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
        const {
          promotionLotId,
          status,
          promotionId,
          loanStatus,
          invitedBy,
          promotionOptionId,
          promotionLotGroupId,
        } = params;

        if (promotionOptionId) {
          filters._id = promotionOptionId;
        }

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

        if (invitedBy) {
          filters['loanCache.promotionLinks.0.invitedBy'] = invitedBy;
        }

        if (promotionLotGroupId) {
          filters[
            'promotionLotCache.0.promotionLotGroupIds'
          ] = promotionLotGroupId;
        }
      };

      body.$postFilter = (
        promotionOptions = [],
        {
          anonymize = false,
          userId,
          promotionId,
          promotionLotId,
          promotionOptionId,
        },
      ) => {
        if (!anonymize) {
          return promotionOptions;
        }

        const anonymizer = makePromotionOptionAnonymizer({
          promotionId,
          promotionLotId,
          promotionOptionId,
          userId,
        });

        return promotionOptions.map(anonymizer);
      };
    },
    validateParams: {
      anonymize: Match.Maybe(Boolean),
      invitedBy: Match.Maybe(Match.OneOf(String, null)),
      loanStatus: Match.Maybe(Match.OneOf(String, Object)),
      promotionId: Match.Maybe(String),
      promotionLotId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
      userId: String,
      promotionOptionId: Match.Maybe(String),
      promotionLotGroupId: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
