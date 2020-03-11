import CollectionService from '../../helpers/server/CollectionService';
import Insurances from '../insurances';
import InsuranceRequestService from '../../insuranceRequests/server/InsuranceRequestService';
import { INSURANCE_STATUS } from '../insuranceConstants';

class InsuranceService extends CollectionService {
  constructor() {
    super(Insurances);
  }

  insert = ({
    insuranceRequestId,
    borrowerId,
    organisationId,
    insuranceProductId,
    insurance = {},
  }) => {
    const insuranceId = super.insert(insurance);
    this.addLink({
      id: insuranceId,
      linkName: 'insuranceRequest',
      linkId: insuranceRequestId,
    });
    this.addLink({ id: insuranceId, linkName: 'borrower', linkId: borrowerId });
    this.addLink({
      id: insuranceId,
      linkName: 'organisation',
      linkId: organisationId,
    });
    this.addLink({
      id: insuranceId,
      linkName: 'insuranceProduct',
      linkId: insuranceProductId,
    });

    return insuranceId;
  };

  getGeneratedProductions = ({ organisationId }) => {
    const activeInsurances = this.fetch({
      $filters: {
        'organisationLink._id': organisationId,
        status: INSURANCE_STATUS.ACTIVE,
      },
      premium: 1,
      singlePremium: 1,
      duration: 1,
      insuranceProduct: { revaluationFactor: 1 },
    });

    return activeInsurances.reduce((totalProduction, insurance) => {
      const {
        premium,
        singlePremium,
        duration,
        insuranceProduct: { revaluationFactor },
      } = insurance;
      let production = 0;

      if (singlePremium) {
        production = premium * revaluationFactor;
      } else {
        production = premium * duration * revaluationFactor;
      }

      return production + totalProduction;
    }, 0);
  };
}

export default new InsuranceService({});
