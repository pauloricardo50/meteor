import CollectionService from '../../helpers/server/CollectionService';
import InsuranceRequests from '../insuranceRequests';
import {
  getNewName,
  setAssignees,
} from '../../helpers/server/collectionServerHelpers';
import UserService from '../../users/server/UserService';
import { INSURANCE_REQUESTS_COLLECTION } from '../insuranceRequestConstants';

class InsuranceRequestService extends CollectionService {
  constructor() {
    super(InsuranceRequests);
  }

  insert = ({ insuranceRequest = {}, userId }) => {
    const name = getNewName({ collection: INSURANCE_REQUESTS_COLLECTION });
    const insuranceRequestId = super.insert({ ...insuranceRequest, name });

    if (userId) {
      this.addLink({
        id: insuranceRequestId,
        linkName: 'user',
        linkId: userId,
      });
      const user = UserService.get(userId, { assignedEmployee: { _id: 1 } });

      if (user?.assignedEmployee?._id) {
        this.setAssignees({
          insuranceRequestId,
          assignees: [
            { _id: user.assignedEmployee._id, percent: 100, isMain: true },
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
