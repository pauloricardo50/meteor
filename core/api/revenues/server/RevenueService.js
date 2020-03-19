import { COMMISSION_STATUS } from 'imports/core/api/constants';
import Revenues from '../revenues';
import CollectionService from '../../helpers/server/CollectionService';
import { REVENUE_STATUS } from '../revenueConstants';
import InsuranceService from '../../insurances/server/InsuranceService';

class RevenueService extends CollectionService {
  constructor() {
    super(Revenues);
  }

  insert({ revenue, loanId, insuranceId }) {
    const revenueId = this.collection.insert(revenue);

    if (loanId) {
      this.addLink({ id: revenueId, linkName: 'loan', linkId: loanId });
    }

    if (insuranceId) {
      const { insuranceRequest } = InsuranceService.get(insuranceId, {
        insuranceRequest: { _id: 1 },
      });
      this.addLink({
        id: revenueId,
        linkName: 'insurance',
        linkId: insuranceId,
      });
      this.addLink({
        id: revenueId,
        linkName: 'insuranceRequest',
        linkId: insuranceRequest._id,
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

  consolidateCommission({ revenueId, organisationId, paidAt, commissionRate }) {
    return this.updateLinkMetadata({
      id: revenueId,
      linkName: 'organisations',
      linkId: organisationId,
      metadata: { paidAt, status: COMMISSION_STATUS.PAID, commissionRate },
    });
  }
}

export default new RevenueService();
