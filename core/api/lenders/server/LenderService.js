import { Meteor } from 'meteor/meteor';

import CollectionService from '../../helpers/server/CollectionService';
import OrganisationService from '../../organisations/server/OrganisationService';
import Lenders from '../lenders';

class LenderService extends CollectionService {
  constructor() {
    super(Lenders);
  }

  insert({ lender, contactId, organisationId }) {
    const { loanId, ...data } = lender;

    const existingLender = this.get(
      {
        'loanLink._id': loanId,
        'organisationLink._id': organisationId,
      },
      {
        organisationLink: 1,
        loanLink: 1,
      },
    );

    if (existingLender) {
      throw new Meteor.Error('Peut pas ajouter le même prêteur 2 fois');
    }

    const lenderId = super.insert(data);
    this.addLink({ id: lenderId, linkName: 'loan', linkId: loanId });

    // If no contact is set, fetch first contact of organisation
    if (!contactId && organisationId) {
      const { contacts } = OrganisationService.get(organisationId, {
        contacts: { _id: 1 },
      });

      if (contacts && contacts.length > 0) {
        contactId = contacts[0]._id;
      }
    }

    this.linkOrganisationAndContact({ lenderId, organisationId, contactId });
    return lenderId;
  }

  linkOrganisationAndContact({ lenderId, organisationId, contactId }) {
    if (organisationId) {
      this.addLink({
        id: lenderId,
        linkName: 'organisation',
        linkId: organisationId,
      });
    }
    if (contactId) {
      this.addLink({
        id: lenderId,
        linkName: 'contact',
        linkId: contactId,
      });
    } else {
      this.removeLink({ id: lenderId, linkName: 'contact' });
    }
  }

  remove({ lenderId }) {
    super.remove(lenderId);
  }
}

export default new LenderService();
