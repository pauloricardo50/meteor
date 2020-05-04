import CollectionService from '../../helpers/server/CollectionService';
import InterestRates from '../interestRates';

class InterestRatesService extends CollectionService {
  constructor() {
    super(InterestRates);
  }
}

export default new InterestRatesService();
