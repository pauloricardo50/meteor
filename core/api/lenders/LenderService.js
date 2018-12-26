import Lenders from './lenders';
import CollectionService from '../helpers/CollectionService';

class LenderService extends CollectionService {
  constructor() {
    super(Lenders);
  }

  insert(object = {}) {
    const { loanId, ...lender } = object;
    const lenderId = super.insert(lender);
    this.addLink({ id: lenderId, linkName: 'loan', linkId: loanId });
    return lenderId;
  }

  linkOrganisationAndContact({ lenderId, organisationId, contactId }) {
    this.addLink({
      id: lenderId,
      linkName: 'organisation',
      linkId: organisationId,
    });
    if (contactId) {
      this.addLink({
        id: lenderId,
        linkName: 'contact',
        linkId: contactId,
      });
    }
  }
}

export default new LenderService();
