import Contacts from './contacts';
import CollectionService from '../helpers/CollectionService';
import { contactFragment } from './queries/contactsFragments';

class ContactService extends CollectionService {
  constructor() {
    super(Contacts);
  }

  get(contactId) {
    return this.fetchOne({
      $filters: { _id: contactId },
      ...contactFragment,
    });
  }

  changeOrganisations({ contactId, newOrganisations = [] }) {
    const oldOrganisations = this.get(contactId).organisations;

    oldOrganisations.map(({ _id }) =>
      this.removeLink({
        id: contactId,
        linkName: 'organisations',
        linkId: _id,
      }));

    newOrganisations.map(({ _id, metadata }) =>
      this.addLink({
        id: contactId,
        linkName: 'organisations',
        linkId: _id,
        metadata,
      }));
  }
}

export default new ContactService();
