import CollectionService from '../../helpers/server/CollectionService';
import Insurances from '../insuranceRequests';

class InsuranceService extends CollectionService {
  constructor() {
    super(Insurances);
  }
}

export default new InsuranceService({});
