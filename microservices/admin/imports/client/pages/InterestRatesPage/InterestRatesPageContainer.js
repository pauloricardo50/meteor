import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import interestRates from 'core/api/interestRates/queries/interestRates';
import irs10y from 'core/api/irs10y/queries/irs10y';
import currentRates from 'core/api/interestRates/queries/currentInterestRates';

export default compose(
  withSmartQuery({
    query: interestRates,
    queryOptions: { reactive: true },
    dataName: 'interestRates',
    smallLoader: true,
  }),
  withSmartQuery({
    query: irs10y,
    queryOptions: { reactive: true },
    dataName: 'irs10y',
    smallLoader: true,
  }),
  withSmartQuery({
    query: currentRates,
    queryOptions: { reactive: true },
    dataName: 'currentInterestRates',
    smallLoader: true,
  }),
);
