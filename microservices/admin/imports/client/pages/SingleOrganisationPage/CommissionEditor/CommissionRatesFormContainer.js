import { withProps } from 'recompose';

import { setCommissionRates } from 'core/api/methods';

export default withProps(({ organisationId }) => ({
  onSubmit: ({ commissionRates }) =>
    setCommissionRates.run({ organisationId, commissionRates }),
}));
