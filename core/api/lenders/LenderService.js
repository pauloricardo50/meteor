import { Meteor } from 'meteor/meteor';

import Lenders from './lenders';
import CollectionService from '../helpers/CollectionService';

class LenderService extends CollectionService {
  constructor() {
    super(Lenders);
  }

  insert({ lender, contactId, organisationId }) {
    const { loanId, ...data } = lender;

    const existingLender = this.fetchOne({
      filter: {
        'loanLink._id': loanId,
        'organisationLink._id': organisationId,
      },
    });

    if (existingLender) {
      throw new Meteor.Error('Peut pas ajouter le même prêteur 2 fois');
    }

    const lenderId = super.insert(data);
    this.addLink({ id: lenderId, linkName: 'loan', linkId: loanId });
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
