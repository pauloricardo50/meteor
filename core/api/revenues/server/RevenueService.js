import Revenues from '../revenues';
import CollectionService from '../../helpers/CollectionService';

class RevenueService extends CollectionService {
  constructor() {
    super(Revenues);
  }
}

export default new RevenueService();
