import { Match } from 'meteor/check';

import { makePromotionLotAnonymizer } from 'core/api/promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionLots, proPromotionLots } from '../queries';

exposeQuery({
  query: appPromotionLots,
  overrides: {
    firewall(userId, { _id, promotionId }) {
      if (_id) {
        SecurityService.promotions.hasAccessToPromotionLot({
          promotionLotId: _id,
          userId,
        });
      }

      if (promotionId) {
        SecurityService.promotions.hasAccessToPromotion({
          promotionId,
          userId,
        });
      }

      if (!promotionId && !_id) {
        SecurityService.handleUnauthorized('Must supply _id or promotionId');
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { _id, promotionId, status } }) => {
        if (_id) {
          filters._id = _id;
        }

        if (promotionId) {
          filters['promotionCache._id'] = promotionId;
        }

        if (status) {
          filters.status = status;
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      promotionId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});

exposeQuery({
  query: proPromotionLots,
  overrides: {
    firewall(userId, params) {
      const { _id, promotionId } = params;
      SecurityService.checkUserIsPro(userId);
      if (_id) {
        SecurityService.promotions.isAllowedToViewPromotionLot({
          promotionLotId: _id,
          userId,
        });
      }

      if (promotionId) {
        SecurityService.promotions.isAllowedToView({
          promotionId,
          userId,
        });
      }

      if (!promotionId && !_id) {
        SecurityService.handleUnauthorized('Must supply _id or promotionId');
      }
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { _id, promotionId, status } }) => {
        if (_id) {
          filters._id = _id;
        }

        if (promotionId) {
          filters.promotionCache = { $elemMatch: { _id: promotionId } };
        }

        if (status) {
          filters.status = status;
        }
      };
      body.$postFilter = (results, { _userId }) => {
        try {
          SecurityService.checkCurrentUserIsAdmin(_userId);
          return results;
        } catch (error) {
          return results.map(makePromotionLotAnonymizer({ userId: _userId }));
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      promotionId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
