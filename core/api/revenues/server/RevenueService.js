import {
  COMMISSION_STATUS,
  REVENUE_STATUS,
  REVENUE_TYPES,
} from '../revenueConstants';
import Revenues from '../revenues';
import CollectionService from '../../helpers/server/CollectionService';
import InsuranceService from '../../insurances/server/InsuranceService';

class RevenueService extends CollectionService {
  constructor() {
    super(Revenues);
  }

  insert({ revenue, loanId, insuranceId, insuranceRequestId }) {
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

    if (insuranceRequestId) {
      this.addLink({
        id: revenueId,
        linkName: 'insuranceRequest',
        linkId: insuranceRequestId,
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

  updateOrganisationRevenues({ organisationId }) {
    const revenues = this.fetch({
      $filters: {
        'sourceOrganisationLink._id': organisationId,
        status: REVENUE_STATUS.EXPECTED,
        type: REVENUE_TYPES.INSURANCE,
      },
      insurance: { _id: 1 },
    });

    if (revenues?.length) {
      revenues.forEach(revenue => {
        const { insurance, _id: revenueId } = revenue;

        if (!insurance) {
          return;
        }

        const { estimatedRevenue } = InsuranceService.get(insurance._id, {
          estimatedRevenue: 1,
        });

        this._update({ id: revenueId, object: { amount: estimatedRevenue } });
      });
    }
  }
}

export default new RevenueService();
