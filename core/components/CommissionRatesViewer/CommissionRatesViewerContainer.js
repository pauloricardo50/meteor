import { compose, withProps } from 'recompose';

import { COMMISSION_RATES_TYPE } from '../../api/commissionRates/commissionRateConstants';
import { withSmartQuery } from '../../api/containerToolkit';
import { proOrganisation } from '../../api/organisations/queries';

export default compose(
  withSmartQuery({
    query: proOrganisation,
    queryOptions: { reactive: false, single: true, shouldRefetch: () => false },
    params: ({ organisationId }) => ({
      organisationId,
      $body: {
        generatedRevenues: 1,
        generatedProductions: 1,
        commissionRates: { rates: 1, type: 1 },
      },
    }),
    dataName: 'orgWithRevenues',
  }),
  withProps(
    ({
      orgWithRevenues: {
        generatedRevenues,
        generatedProductions,
        commissionRates,
      },
      commissionRates: commissionRatesOverride,
    }) => ({
      generatedRevenues,
      generatedProductions,
      commissionRates:
        commissionRatesOverride ||
        commissionRates?.find(
          ({ type }) => type === COMMISSION_RATES_TYPE.COMMISSIONS,
        ),
    }),
  ),
);
