import { Meteor } from 'meteor/meteor';

import Organisations from '../organisations';
import CollectionService from '../../helpers/server/CollectionService';
import CommissionRateService from '../../commissionRates/server/CommissionRateService';

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
      console.log('currentCommissionRatesId:', currentCommissionRatesId);
      CommissionRateService.remove(currentCommissionRatesId);
    }
    return CommissionRateService.insert({ commissionRates, organisationId });
  }
}

export default new OrganisationService();
