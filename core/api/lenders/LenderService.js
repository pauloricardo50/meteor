import Lenders from './lenders';
import CollectionService from '../helpers/CollectionService';

class LenderService extends CollectionService {
  constructor() {
    super(Lenders);
  }

  insert(object = {}) {
    const { loanId, ...lender } = object;
    const lenderId = this.collection.insert(lender);
    this.addLink({ id: lenderId, linkName: 'loan', linkId: loanId });
    return lenderId;
  }
}

export default new LenderService();
