import { compose } from 'recompose';
import { withSmartQuery } from 'core/api/containerToolkit/index';
import interestRates from 'core/api/interestRates/queries/interestRates';

export default compose(withSmartQuery({
  query: interestRates,
  queryOptions: { reactive: true },
  dataName: 'interestRates',
  smallLoader: true,
}));
