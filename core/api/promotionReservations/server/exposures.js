import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { promotionReservations } from '../queries';

exposeQuery({
  query: promotionReservations,
  overrides: {
    firewall() {},
    embody: (body) => {
      body.$filter = ({ filters, params: { promotionId, status } }) => {
        filters['promotionLink._id'] = promotionId;

        if (status) {
          filters.status = status;
        }
      };
    },
    validateParams: {
      promotionId: String,
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
