import { compose } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit/index';
import {
  interestRates,
  currentInterestRates,
} from 'core/api/interestRates/queries';
import { irs10y } from 'core/api/irs10y/queries';

export default compose(
  withSmartQuery({
    query: interestRates,
    dataName: 'interestRates',
    smallLoader: true,
  }),
  withSmartQuery({
    query: irs10y,
    dataName: 'irs10y',
    smallLoader: true,
  }),
  withSmartQuery({
    query: currentInterestRates,
    dataName: 'currentInterestRates',
    smallLoader: true,
  }),
);
