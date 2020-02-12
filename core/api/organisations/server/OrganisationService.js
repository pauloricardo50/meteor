import { Meteor } from 'meteor/meteor';

import Organisations from '../organisations';
import CollectionService from '../../helpers/CollectionService';

class OrganisationService extends CollectionService {
  constructor() {
    super(Organisations);
  }

  setCommissionRates({ commissionRates, organisationId }) {
    if (commissionRates.length > 0) {
      if (commissionRates[0].threshold !== 0) {
        throw new Meteor.Error('Le premier seuil doit être 0');
      }
    }

    commissionRates.forEach(({ rate, threshold }, i, arr) => {
      if (i === 0) {
        return;
      }

      const { rate: previousRate, threshold: previousThreshold } = arr[i - 1];

      if (previousRate >= rate) {
        throw new Meteor.Error(
          'Chaque taux doit être plus élevé que le précédent',
        );
      }

      if (previousThreshold >= threshold) {
        throw new Meteor.Error(
          'Chaque seuil doit être plus élevé que le précédent',
        );
      }
    });

    return this._update({ id: organisationId, object: { commissionRates } });
  }
}

export default new OrganisationService();
