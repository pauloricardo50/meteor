import { exposeQuery } from '../../queries/queryHelpers';
import query from './loansAssignedToAdmin';

exposeQuery(
  query,
  {
    validateParams: { adminId: String },
    embody: (body, params) => {
      body.$filter = ({ filters, params: { adminId } }) => {
        filters.assignedEmployeeId = adminId;
      };
    },
  },
  { allowFilterById: true },
);
