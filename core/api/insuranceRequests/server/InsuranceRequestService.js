import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequests from '../insuranceRequests';
import {
  getNewName,
  setAssignees,
} from '../../helpers/server/collectionServerHelpers';
import UserService from '../../users/server/UserService';
import LoanService from '../../loans/server/LoanService';
import { INSURANCE_REQUESTS_COLLECTION } from '../insuranceRequestConstants';

class InsuranceRequestService extends CollectionService {
  constructor() {
    super(InsuranceRequests);
  }

  insert = ({ insuranceRequest = {}, userId, loanId, assigneeId }) => {
    const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
    const insuranceRequestId = super.insert({ ...insuranceRequest, name });
    const loan =
      loanId &&
      LoanService.get(loanId, {
        user: { _id: 1 },
        assignees: { percent: 1, isMain: 1 },
      });
    const user =
      userId && UserService.get(userId, { assignedEmployee: { _id: 1 } });

    if (loan) {
      this.addLink({
        id: insuranceRequestId,
        linkName: 'loan',
        linkId: loanId,
      });
    }

    if (user) {
      this.addLink({
        id: insuranceRequestId,
        linkName: 'user',
        linkId: userId,
      });
    }

    // Set the assignee
    if (assigneeId) {
      this.setAssignees({
        insuranceRequestId,
        assignees: [{ _id: assigneeId, percent: 100, isMain: true }],
      });
    }
    // Set the same assignees as the loan
    else if (!user && loan) {
      const { assignees = [], user: { _id: loanUserId } = {} } = loan;
      if (assignees.length) {
        this.setAssignees({
          insuranceRequestId,
          assignees,
        });
      }
      if (loanUserId) {
        this.addLink({
          id: insuranceRequestId,
          linkName: 'user',
          linkId: loanUserId,
        });
      }
    }
    // Set the same assignee as the user
    else if (user) {
      const { assignedEmployee = {} } = user;
      if (assignedEmployee) {
        this.setAssignees({
          insuranceRequestId,
          assignees: [
            { _id: assignedEmployee._id, percent: 100, isMain: true },
          ],
        });
      }
    }

    return insuranceRequestId;
  };

  setAssignees = ({ insuranceRequestId, ...params }) =>
    setAssignees({
      docId: insuranceRequestId,
      collection: INSURANCE_REQUESTS_COLLECTION,
      ...params,
    });
}

export default new InsuranceRequestService({});
