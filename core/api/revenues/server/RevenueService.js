import { COMMISSION_STATUS } from 'imports/core/api/constants';
import Revenues from '../revenues';
import CollectionService from '../../helpers/CollectionService';
import LoanService from '../../loans/server/LoanService';
import { REVENUE_STATUS } from '../revenueConstants';

class RevenueService extends CollectionService {
  constructor() {
    super(Revenues);
  }

  insert({ revenue, loanId }) {
    const revenueId = this.collection.insert(revenue);

    if (loanId) {
      LoanService.addLink({
        id: loanId,
        linkName: 'revenues',
        linkId: revenueId,
      });
    }

    return revenueId;
  }

  remove({ revenueId }) {
    return super.remove(revenueId);
  }

  getGeneratedRevenues({ organisationId }) {
    const revenues = this.fetch({
      $filters: {
        $and: [
          { status: REVENUE_STATUS.CLOSED },
          { organisationLinks: { $elemMatch: { _id: organisationId } } },
        ],
      },
      amount: 1,
      organisationLinks: 1,
      status: 1,
    });

    return revenues.reduce((total, { amount, organisationLinks }) => {
      const sharedAmount = amount / organisationLinks.length;

      return total + sharedAmount;
    }, 0);
  }

  consolidateRevenue({ revenueId, amount, paidAt }) {
    return this._update({
      id: revenueId,
      object: {
        amount,
        paidAt,
        status: REVENUE_STATUS.CLOSED,
      },
    });
  }

  consolidateCommission({ revenueId, organisationId, paidAt }) {
    return this.updateLinkMetadata({
      id: revenueId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: { paidAt, status: COMMISSION_STATUS.PAID },
    });
  }
}

export default new RevenueService();
