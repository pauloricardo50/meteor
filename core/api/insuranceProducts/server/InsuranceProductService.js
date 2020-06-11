import CollectionService from '../../helpers/server/CollectionService';
import InsuranceProducts from '../insuranceProducts';

class InsuranceProductService extends CollectionService {
  constructor() {
    super(InsuranceProducts);
  }
}

export default new InsuranceProductService({});
