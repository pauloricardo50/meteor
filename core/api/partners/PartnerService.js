import Partners from './partners';
import CollectionService from '../helpers/CollectionService';

class PartnerService extends CollectionService {
  constructor() {
    super(Partners);
  }
}

export default new PartnerService();
