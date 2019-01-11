import Irs10y from '../irs10y';
import CollectionService from '../../helpers/CollectionService';

class Irs10yService extends CollectionService {
  constructor() {
    super(Irs10y);
  }
}

export default new Irs10yService();
