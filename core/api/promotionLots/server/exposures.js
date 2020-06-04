import { Match } from 'meteor/check';

import { makePromotionLotAnonymizer } from '../../promotions/server/promotionServerHelpers';
import { exposeQuery } from '../../queries/queryHelpers';
import SecurityService from '../../security';
import UserService from '../../users/server/UserService';
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

const promotionLotFilters = ({
  filters,
  promotionId,
  status,
  showAllLots,
  promotionLotIds,
  promotionLotGroupId,
}) => {
  if (promotionId) {
    filters.promotionCache = { $elemMatch: { _id: promotionId } };
  }

  if (status) {
    filters.status = status;
  }

  if (promotionLotGroupId) {
    filters.promotionLotGroupIds = promotionLotGroupId;
  }

  if (showAllLots === false) {
    filters._id = { $in: promotionLotIds };
  }
};

exposeQuery({
  query: appPromotionLots,
  overrides: {
    firewall(userId, { _id, promotionId }) {
      promotionLotSecurity({ _id, userId, promotionId });
    },
    embody: body => {
      body.$filter = ({
        filters,
        params: {
          promotionId,
          status,
          showAllLots,
          promotionLotIds,
          promotionLotGroupId,
        },
      }) => {
        promotionLotFilters({
          filters,
          promotionId,
          status,
          showAllLots,
          promotionLotIds,
          promotionLotGroupId,
        });
      };
    },
    validateParams: {
      promotionId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
      showAllLots: Match.Maybe(Match.OneOf(Boolean, undefined)),
      promotionLotIds: Match.Maybe(Match.OneOf(Array, undefined)),
      promotionLotGroupId: Match.Maybe(Match.OneOf(String, Object)),
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
    embody: body => {
      body.$filter = ({
        filters,
        params: { _id, promotionId, status, promotionLotGroupId },
      }) => {
        promotionLotFilters({
          filters,
          promotionId,
          status,
          promotionLotGroupId,
        });
      };
      body.$postFilter = (results, { _userId }) => {
        try {
          SecurityService.checkCurrentUserIsAdmin(_userId);
          return results;
        } catch (error) {
          const currentUser = UserService.get(_userId, {
            promotions: { _id: 1 },
            organisations: { users: { _id: 1 } },
          });
          return results.map(makePromotionLotAnonymizer({ currentUser }));
        }
      };
    },
    validateParams: {
      promotionId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
      promotionLotGroupId: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
