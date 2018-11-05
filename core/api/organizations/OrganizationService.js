import Organizations from './organizations';
import CollectionService from '../helpers/CollectionService';

export class OrganizationService extends CollectionService {
  constructor() {
    super(Organizations);
  }
}

export default new OrganizationService();
