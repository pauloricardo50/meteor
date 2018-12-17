import Contacts from './contacts';
import CollectionService from '../helpers/CollectionService';

class ContactService extends CollectionService {
  constructor() {
    super(Contacts);
  }
}

export default new ContactService();
