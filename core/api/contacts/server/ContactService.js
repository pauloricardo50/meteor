import Contacts from '../contacts';
import CollectionService from '../../helpers/CollectionService';
import { contact } from '../../fragments';

class ContactService extends CollectionService {
  constructor() {
    super(Contacts);
  }

  get(contactId) {
    return this.fetchOne({
      $filters: { _id: contactId },
      ...contact(),
    });
  }

  changeOrganisations({ contactId, newOrganisations = [] }) {
    const { organisations: oldOrganisations = [] } = this.get(contactId);

    oldOrganisations.forEach(({ _id: organisationId }) =>
      this.removeLink({
        id: contactId,
        linkName: 'organisations',
        linkId: organisationId,
      }),
    );

    newOrganisations.forEach(({ _id: organisationId, metadata }) =>
      this.addLink({
        id: contactId,
        linkName: 'organisations',
        linkId: organisationId,
        metadata,
      }),
    );
  }
}

export default new ContactService();
