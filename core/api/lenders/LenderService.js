import Lenders from './lenders';
import CollectionService from '../helpers/CollectionService';

class LenderService extends CollectionService {
  constructor() {
    super(Lenders);
  }
}

export default new LenderService();
