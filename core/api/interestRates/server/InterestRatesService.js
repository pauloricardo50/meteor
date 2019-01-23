import InterestRates from '../interestRates';
import CollectionService from '../../helpers/CollectionService';

class InterestRatesService extends CollectionService {
  constructor() {
    super(InterestRates);
  }
}

export default new InterestRatesService();
