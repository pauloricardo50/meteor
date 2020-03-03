import CollectionService from '../../helpers/server/CollectionService';
import Insurances from '../insurances';

class InsuranceService extends CollectionService {
  constructor() {
    super(Insurances);
  }
}

export default new InsuranceService({});
