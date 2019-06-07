import SecurityService from '../../security';
import { appPromotionOption, proPromotionOptions } from '../queries';
import { exposeQuery } from '../../queries/queryHelpers';
import { proPromotionOptionsResolver } from './resolvers';

exposeQuery({
  query: appPromotionOption,
  overrides: {
    firewall(userId, { promotionOptionId }) {
      SecurityService.promotions.hasAccessToPromotionOption({
        promotionOptionId,
        userId,
      });
    },
    embody: (body) => {
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
      promotionOptionIds.forEach((promotionOptionId) => {
        SecurityService.promotions.isAllowedToViewPromotionOption({
          promotionOptionId,
          userId,
        });
      });
    },
    validateParams: { promotionOptionIds: [String], userId: String },
  },
  resolver: proPromotionOptionsResolver,
});
