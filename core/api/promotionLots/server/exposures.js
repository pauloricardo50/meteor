import { Match } from 'meteor/check';

import { makePromotionLotAnonymizer } from 'core/api/promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import { appPromotionLots, proPromotionLots } from '../queries';

const promotionLotSecurity = ({ _id, userId, promotionId }) => {
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
};

const promotionLotFilters = ({ filters, promotionId, status }) => {
  if (promotionId) {
    filters.promotionCache = { $elemMatch: { _id: promotionId } };
  }

  if (status) {
    filters.status = status;
  }
};

exposeQuery({
  query: appPromotionLots,
  overrides: {
    firewall(userId, { _id, promotionId }) {
      promotionLotSecurity({ _id, userId, promotionId });
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { promotionId, status } }) => {
        promotionLotFilters({ filters, promotionId, status });
      };
    },
    validateParams: {
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
      promotionLotSecurity({ _id, userId, promotionId });
    },
    embody: (body) => {
      body.$filter = ({ filters, params: { _id, promotionId, status } }) => {
        promotionLotFilters({ filters, promotionId, status });
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
      promotionId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
