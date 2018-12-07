import Organisations from './organisations';
import CollectionService from '../helpers/CollectionService';

export class OrganisationService extends CollectionService {
  constructor() {
    super(Organisations);
  }
}

export default new OrganisationService();
