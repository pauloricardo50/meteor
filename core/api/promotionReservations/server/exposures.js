import { Match } from 'meteor/check';

import { exposeQuery } from '../../queries/queryHelpers';
import { promotionReservations } from '../queries';

exposeQuery({
  query: promotionReservations,
  overrides: {
    firewall() {},
    embody: (body) => {
      body.$filter = ({ filters, params: { promotionId, status, loanId } }) => {
        filters['promotionLink._id'] = promotionId;

        if (status) {
          filters.status = status;
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }
      };
    },
    validateParams: {
      promotionId: String,
      loanId: Match.Maybe(String),
      status: Match.Maybe(Match.OneOf(String, Object)),
    },
  },
});
