import { Meteor } from 'meteor/meteor';

import CommissionRates from '../commissionRates';
import CollectionService from '../../helpers/server/CollectionService';

class CommissionRateService extends CollectionService {
  constructor() {
    super(CommissionRates);
  }

  insert = ({ commissionRates = {}, organisationId }) => {
    const { type, rates = [] } = commissionRates;

    if (!organisationId) {
      throw new Meteor.Error(`Organisation id is required`);
    }

    if (!rates.length) {
      throw new Meteor.Error(`Rates length cannot be 0`);
    }

    const organisationCommissionRates = this.get(
      { 'organisationLink._id': organisationId, type },
      { rates: 1, organisation: { name: 1 } },
    );

    if (organisationCommissionRates?.length) {
      throw new Meteor.Error(
        `${type} commission rates already exist for organisation ${organisationCommissionRates[0]?.organisation?.name}`,
      );
    }

    rates.forEach(({ rate, threshold }, index, array) => {
      if (index === 0) {
        if (threshold !== 0) {
          throw new Meteor.Error('Le premier seuil doit être à 0');
        }
        return;
      }

      const { rate: previousRate, threshold: previousThreshold } = array[
        index - 1
      ];

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

    const commissionRatesId = super.insert(commissionRates);
    this.addLink({
      id: commissionRatesId,
      linkName: 'organisation',
      linkId: organisationId,
    });

    return commissionRatesId;
  };
}

export default new CommissionRateService();
