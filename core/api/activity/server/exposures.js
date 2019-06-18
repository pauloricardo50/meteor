import { exposeQuery } from '../../queries/queryHelpers';
import { adminActivities } from '../queries';

exposeQuery({
  query: adminActivities,
  overrides: {
    embody: (body) => {
      body.$filter = ({ filters, params: { _id, loanId } }) => {
        if (_id) {
          filters._id = _id;
        }

        if (loanId) {
          filters['loanLink._id'] = loanId;
        }
      };
    },
    validateParams: {
      _id: Match.Maybe(String),
      loanId: Match.Maybe(String),
    },
  },
});
