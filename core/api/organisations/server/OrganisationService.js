import CommissionRateService from '../../commissionRates/server/CommissionRateService';
import CollectionService from '../../helpers/server/CollectionService';
import Organisations from '../organisations';

class OrganisationService extends CollectionService {
  constructor() {
    super(Organisations);
  }

  setCommissionRates({ commissionRates, organisationId }) {
    const { _id: currentCommissionRatesId } =
      CommissionRateService.get(
        { 'organisationLink._id': organisationId, type: commissionRates.type },
        { _id: 1 },
      ) || {};
    if (currentCommissionRatesId) {
      return CommissionRateService._update({
        id: currentCommissionRatesId,
        object: commissionRates,
      });
    }
    return CommissionRateService.insert({ commissionRates, organisationId });
  }
}

export default new OrganisationService();
