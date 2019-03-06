import Revenues from '../revenues';
import CollectionService from '../../helpers/CollectionService';
import LoanService from '../../loans/server/LoanService';

class RevenueService extends CollectionService {
  constructor() {
    super(Revenues);
  }

  insert({ revenue, loanId }) {
    const revenueId = this.collection.insert(revenue);

    if (loanId) {
      console.log('loanId:', loanId);
      // LoanService._update({
      //   id: loanId,
      //   object: { $push: { revenueLinks: { _id: revenueId } } },
      // });
      LoanService.addLink({
        id: loanId,
        linkName: 'revenues',
        linkId: revenueId,
      });
    }

    return revenueId;
  }
}

export default new RevenueService();
