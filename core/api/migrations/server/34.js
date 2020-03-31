import { Migrations } from 'meteor/percolate:migrations';

import CommissionRateService from '../../commissionRates/server/CommissionRateService';
import OrganisationService from '../../organisations/server/OrganisationService';
import { COMMISSION_RATES_TYPE } from '../../commissionRates/commissionRateConstants';

export const up = () => {
  const organisationsWithCommissionRates = OrganisationService.find({})
    .fetch()
    .filter(({ commissionRates = [] }) => !!commissionRates.length);

  return organisationsWithCommissionRates.map(
    ({ commissionRates, _id: organisationId }) => {
      CommissionRateService.insert({
        commissionRates: {
          type: COMMISSION_RATES_TYPE.COMMISSIONS,
          rates: commissionRates,
        },
        organisationId,
      });

      OrganisationService.baseUpdate(
        { _id: organisationId },
        { $unset: { commissionRates: true } },
      );

      return Promise.resolve();
    },
  );
};

export const down = () => {
  const commissionRates = CommissionRateService.fetch({
    organisationLink: 1,
    rates: 1,
    type: 1,
  });

  return Promise.all(
    commissionRates.map(
      ({
        _id: commissionRatesId,
        organisationLink: { _id: organisationId },
        rates,
        type,
      }) => {
        if (type === COMMISSION_RATES_TYPE.COMMISSIONS) {
          OrganisationService.rawCollection.update(
            { _id: organisationId },
            {
              commissionRates: rates.map(({ threshold, rate }) => ({
                threshold,
                rate,
              })),
            },
          );
        }
        CommissionRateService.remove(commissionRatesId);
        return Promise.resolve();
      },
    ),
  );
};

Migrations.add({
  version: 34,
  name: 'Migrate organisation commissionRates',
  up,
  down,
});
